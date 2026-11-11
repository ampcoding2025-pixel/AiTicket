using System.Text.RegularExpressions;
using AiTicket.Api.Contracts;
using Dapper;

namespace AiTicket.Api.Modules.Analytics;

public sealed partial class DidbanAnalyticsQueryService
{
    private static readonly Regex NationalCode = new(@"\b\d{10}\b", RegexOptions.Compiled);
    private static readonly Regex PhoneLike = new(@"\b0\d{10}\b", RegexOptions.Compiled);

    public async Task<TopicExplorerResponse> GetTopicsAsync(PeriodFilter filter, CancellationToken ct)
    {
        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);

        var total = await connection.ExecuteScalarAsync<long>(
            new CommandDefinition(
                $"""
                SELECT COUNT_BIG(*)
                FROM dbo.Cookie c
                {whereSql}
                """,
                dp,
                cancellationToken: ct));

        var topSubjects = (await connection.QueryAsync<SubjectVolumeRow>(
            new CommandDefinition(
                $"""
                SELECT TOP 12
                  c.SubjectId,
                  ISNULL(s.SubjectName, N'بدون موضوع') AS SubjectName,
                  ISNULL(g.SubjectGroupName, N'') AS GroupName,
                  COUNT_BIG(*) AS Cnt
                FROM dbo.Cookie c
                LEFT JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                LEFT JOIN dbo.SubjectGroup g ON g.SubjectGroupId = c.SubjectGroupId
                {whereSql}
                GROUP BY c.SubjectId, s.SubjectName, g.SubjectGroupName
                ORDER BY Cnt DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var subjectIds = topSubjects.Select(s => s.SubjectId).ToArray();
        var evolutionBySubject = new Dictionary<int, List<TopicEvolutionPointDto>>();
        var samplesBySubject = new Dictionary<int, List<TopicSampleDto>>();
        var growthBySubject = new Dictionary<int, double?>();

        if (subjectIds.Length > 0)
        {
            var evoDp = new DynamicParameters();
            evoDp.Add("ids", subjectIds);
            foreach (var (key, value) in parameters)
            {
                evoDp.Add(key, value);
            }

            var evoRows = await connection.QueryAsync<SubjectYearRow>(
                new CommandDefinition(
                    $"""
                    SELECT
                      c.SubjectId,
                      CAST(YEAR(c.CookieTime) AS nvarchar(8)) AS Label,
                      COUNT_BIG(*) AS Cnt
                    FROM dbo.Cookie c
                    {whereSql}
                    AND c.SubjectId IN @ids
                    GROUP BY c.SubjectId, YEAR(c.CookieTime)
                    ORDER BY c.SubjectId, YEAR(c.CookieTime)
                    """,
                    evoDp,
                    cancellationToken: ct));

            foreach (var group in evoRows.GroupBy(r => r.SubjectId))
            {
                var points = group
                    .Select(r => new TopicEvolutionPointDto(r.Label ?? "", r.Cnt))
                    .ToList();
                evolutionBySubject[group.Key] = points;

                if (points.Count >= 2)
                {
                    var prev = points[^2].Count;
                    var last = points[^1].Count;
                    growthBySubject[group.Key] = prev == 0
                        ? null
                        : Math.Round(100.0 * (last - prev) / prev, 1);
                }
                else
                {
                    growthBySubject[group.Key] = null;
                }
            }

            var sampleDp = new DynamicParameters();
            sampleDp.Add("ids", subjectIds);
            var samples = await connection.QueryAsync<TopicSampleRow>(
                new CommandDefinition(
                    """
                    SELECT TOP 36
                      c.CookieId,
                      c.SubjectId,
                      LEFT(ISNULL(c.CookieCaption, N''), 140) AS Caption,
                      sc.SubjectClassName
                    FROM dbo.Cookie c
                    LEFT JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                    WHERE c.SubjectId IN @ids
                      AND c.CookieCaption IS NOT NULL
                      AND LEN(LTRIM(RTRIM(c.CookieCaption))) > 8
                    ORDER BY c.CookieTime DESC
                    """,
                    sampleDp,
                    cancellationToken: ct));

            foreach (var group in samples.GroupBy(s => s.SubjectId))
            {
                samplesBySubject[group.Key] = group
                    .Take(3)
                    .Select(s => new TopicSampleDto(
                        $"c-{s.CookieId}",
                        RedactCaption(s.Caption),
                        s.SubjectClassName ?? ""))
                    .ToList();
            }
        }

        var covered = topSubjects.Sum(s => s.Cnt);
        var coveragePercent = total == 0 ? 0 : Math.Round(100.0 * covered / total, 1);

        var clusters = topSubjects.Select(s =>
        {
            var id = $"sub-{s.SubjectId}";
            var share = total == 0 ? 0 : Math.Round(100.0 * s.Cnt / total, 1);
            growthBySubject.TryGetValue(s.SubjectId, out var growth);
            evolutionBySubject.TryGetValue(s.SubjectId, out var evo);
            samplesBySubject.TryGetValue(s.SubjectId, out var samples);

            return new TopicClusterDto(
                id,
                s.SubjectName ?? "بدون موضوع",
                s.Cnt,
                share,
                growth,
                null,
                "taxonomy-baseline · SubjectId (not NLP)",
                ExtractKeywords(s.SubjectName),
                string.IsNullOrWhiteSpace(s.GroupName)
                    ? new[] { s.SubjectName ?? "" }
                    : new[] { s.SubjectName ?? "", s.GroupName! },
                evo ?? [],
                samples ?? []);
        }).ToList();

        // Same SubjectGroup → weak co-membership edge (not textual co-occurrence).
        var relations = new List<TopicRelationDto>();
        foreach (var group in topSubjects.GroupBy(s => s.GroupName ?? ""))
        {
            var members = group.ToList();
            if (members.Count < 2 || string.IsNullOrWhiteSpace(group.Key)) continue;
            for (var i = 0; i < members.Count; i++)
            {
                for (var j = i + 1; j < members.Count; j++)
                {
                    var a = members[i];
                    var b = members[j];
                    var weight = Math.Round(
                        Math.Min(a.Cnt, b.Cnt) / (double)Math.Max(a.Cnt, b.Cnt),
                        2);
                    relations.Add(new TopicRelationDto(
                        $"sub-{a.SubjectId}",
                        $"sub-{b.SubjectId}",
                        weight,
                        $"هم‌گروه موضوعی: {group.Key} (تاکسونومی — نه شباهت متنی)"));
                }
            }
        }

        var summary = new List<KpiCardDto>
        {
            new("clusters", "موضوعات پرتکرار (تاکسونومی)", clusters.Count, "count", null, "neutral",
                "خوشه = Subject دیده‌بان، نه مدل موضوعی", "feasible"),
            new("coverage", "پوشش حجم توسط ۱۲ موضوع برتر", coveragePercent, "percent", null, "positive",
                null, "feasible"),
            new("stability", "پایداری بین‌دوره‌ای موضوع", null, "percent", null, "neutral",
                "نیازمند ارزیابی آفلاین NLP", "unavailable"),
            new("noise", "خوشه نویز متنی", null, "percent", null, "warning",
                "بدون مدل خوشه‌بندی قابل محاسبه نیست", "unavailable"),
        };

        const string caveat =
            "این خروجی baseline تاکسونومی Subject است، نه BERTopic/LDA. Coherence و نویز متنی خاموش‌اند تا پایپ‌لاین آفلاین NLP روی CookieCaption پالایش‌شده اجرا شود.";

        return new TopicExplorerResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            "taxonomy-baseline-v0.1",
            caveat,
            summary,
            clusters,
            relations.Take(20).ToList());
    }

    private static IReadOnlyList<string> ExtractKeywords(string? subjectName)
    {
        if (string.IsNullOrWhiteSpace(subjectName)) return [];
        return subjectName
            .Split([' ', '،', ',', '-', '/', '‌'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(t => t.Length >= 3)
            .Distinct(StringComparer.Ordinal)
            .Take(6)
            .ToArray();
    }

    private static string RedactCaption(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return "";
        var redacted = NationalCode.Replace(text, "[کد ملی]");
        redacted = PhoneLike.Replace(redacted, "[تلفن]");
        return redacted.Length <= 120 ? redacted : redacted[..117] + "…";
    }

    private sealed class SubjectVolumeRow
    {
        public int SubjectId { get; init; }
        public string? SubjectName { get; init; }
        public string? GroupName { get; init; }
        public long Cnt { get; init; }
    }

    private sealed class SubjectYearRow
    {
        public int SubjectId { get; init; }
        public string? Label { get; init; }
        public long Cnt { get; init; }
    }

    private sealed class TopicSampleRow
    {
        public long CookieId { get; init; }
        public int SubjectId { get; init; }
        public string? Caption { get; init; }
        public string? SubjectClassName { get; init; }
    }
}
