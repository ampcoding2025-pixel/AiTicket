using AiTicket.Api.Contracts;
using Dapper;

namespace AiTicket.Api.Modules.Analytics;

public sealed partial class DidbanAnalyticsQueryService
{
    public async Task<CategoryExplorerResponse> GetCategoryTreeAsync(PeriodFilter filter, CancellationToken ct)
    {
        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);

        var rows = (await connection.QueryAsync<TaxonomyAggRow>(
            new CommandDefinition(
                $"""
                SELECT
                  c.ZoneId,
                  ISNULL(z.ZoneName, N'بدون حیطه') AS ZoneName,
                  c.SubjectNatureId,
                  ISNULL(n.SubjectNatureName, N'بدون ماهیت') AS NatureName,
                  c.SubjectGroupId,
                  ISNULL(g.SubjectGroupName, N'بدون گروه') AS GroupName,
                  c.SubjectId,
                  ISNULL(s.SubjectName, N'بدون موضوع') AS SubjectName,
                  COUNT_BIG(*) AS Cnt,
                  SUM(CASE WHEN c.SubjectClassId = 1 THEN 1 ELSE 0 END) AS Complaints
                FROM dbo.Cookie c
                LEFT JOIN dbo.Zone z ON z.ZoneId = c.ZoneId
                LEFT JOIN dbo.SubjectNature n ON n.SubjectNatureId = c.SubjectNatureId
                LEFT JOIN dbo.SubjectGroup g ON g.SubjectGroupId = c.SubjectGroupId
                LEFT JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                {whereSql}
                GROUP BY
                  c.ZoneId, z.ZoneName,
                  c.SubjectNatureId, n.SubjectNatureName,
                  c.SubjectGroupId, g.SubjectGroupName,
                  c.SubjectId, s.SubjectName
                """,
                dp,
                cancellationToken: ct))).ToList();

        var total = rows.Sum(r => r.Cnt);
        var topSubjectIds = rows.OrderByDescending(r => r.Cnt).Select(r => r.SubjectId).Distinct().Take(10).ToArray();
        var samplesBySubject = new Dictionary<int, List<CategorySampleDto>>();

        if (topSubjectIds.Length > 0)
        {
            var sampleDp = new DynamicParameters();
            sampleDp.Add("ids", topSubjectIds);
            var samples = await connection.QueryAsync<SampleRow>(
                new CommandDefinition(
                    """
                    SELECT TOP 30
                      c.CookieId,
                      c.SubjectId,
                      LEFT(ISNULL(c.CookieCaption, N''), 120) AS Caption,
                      sc.SubjectClassName,
                      st.CookieStatusName
                    FROM dbo.Cookie c
                    LEFT JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                    LEFT JOIN dbo.CookieStatus st ON st.CookieStatusId = c.CookieStatusId
                    WHERE c.SubjectId IN @ids
                    ORDER BY c.CookieTime DESC
                    """,
                    sampleDp,
                    cancellationToken: ct));

            foreach (var group in samples.GroupBy(s => s.SubjectId))
            {
                samplesBySubject[group.Key] = group
                    .Take(3)
                    .Select(s => new CategorySampleDto(
                        $"c-{s.CookieId}",
                        Truncate(s.Caption),
                        s.SubjectClassName ?? "",
                        s.CookieStatusName ?? ""))
                    .ToList();
            }
        }

        var tree = BuildTree(rows, samplesBySubject);
        var nodeCount = CountNodes(tree);
        var topShare = total == 0 || tree.Count == 0 ? 0 : Math.Round(100.0 * tree[0].Count / total, 1);

        var summary = new List<KpiCardDto>
        {
            new("nodes", "گره‌های درخت", nodeCount, "count", null, "neutral", null, "feasible"),
            new("leaf-subjects", "موضوعات برگ در نتیجه", rows.Select(r => r.SubjectId).Distinct().Count(), "count", null, "neutral", null, "feasible"),
            new("top-share", "سهم بزرگ‌ترین حیطه", topShare, "percent", null, "neutral", null, "feasible"),
            new("growth-hot", "رشد نسبی", null, "percent", null, "warning", "رشد دوره‌ای هنوز محاسبه نمی‌شود", "needs_rules"),
        };

        return new CategoryExplorerResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            "درخت از Zone/Nature/Group/Subject دیده‌بان ساخته شده است؛ growth هنوز Needs_rules است.",
            summary,
            tree);
    }

    private static List<CategoryNodeDto> BuildTree(
        List<TaxonomyAggRow> rows,
        IReadOnlyDictionary<int, List<CategorySampleDto>> samplesBySubject)
    {
        return rows
            .GroupBy(r => new { r.ZoneId, r.ZoneName })
            .Select(z =>
            {
                var natures = z
                    .GroupBy(r => new { r.SubjectNatureId, r.NatureName })
                    .Select(n =>
                    {
                        var groups = n
                            .GroupBy(r => new { r.SubjectGroupId, r.GroupName })
                            .Select(g =>
                            {
                                var subjects = g
                                    .OrderByDescending(r => r.Cnt)
                                    .Take(12)
                                    .Select(s =>
                                    {
                                        var share = s.Cnt == 0 ? 0 : Math.Round(100.0 * s.Complaints / s.Cnt, 1);
                                        samplesBySubject.TryGetValue(s.SubjectId, out var samples);
                                        return new CategoryNodeDto(
                                            $"sub-{s.SubjectId}",
                                            "subject",
                                            s.SubjectName,
                                            s.Cnt,
                                            0,
                                            share,
                                            samples,
                                            null);
                                    })
                                    .ToList();

                                return new CategoryNodeDto(
                                    $"grp-{g.Key.SubjectGroupId}",
                                    "group",
                                    g.Key.GroupName,
                                    g.Sum(x => x.Cnt),
                                    0,
                                    null,
                                    null,
                                    subjects);
                            })
                            .OrderByDescending(x => x.Count)
                            .ToList();

                        return new CategoryNodeDto(
                            $"nat-{n.Key.SubjectNatureId}",
                            "nature",
                            n.Key.NatureName,
                            n.Sum(x => x.Cnt),
                            0,
                            null,
                            null,
                            groups);
                    })
                    .OrderByDescending(x => x.Count)
                    .ToList();

                return new CategoryNodeDto(
                    $"zone-{z.Key.ZoneId}",
                    "zone",
                    z.Key.ZoneName,
                    z.Sum(x => x.Cnt),
                    0,
                    null,
                    null,
                    natures);
            })
            .OrderByDescending(x => x.Count)
            .ToList();
    }

    private static int CountNodes(IEnumerable<CategoryNodeDto> nodes)
    {
        var count = 0;
        foreach (var n in nodes)
        {
            count++;
            if (n.Children is { Count: > 0 })
            {
                count += CountNodes(n.Children);
            }
        }
        return count;
    }

    private static string Truncate(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return "";
        return text.Length <= 120 ? text : text[..120];
    }

    private sealed class TaxonomyAggRow
    {
        public int? ZoneId { get; init; }
        public string ZoneName { get; init; } = "";
        public int? SubjectNatureId { get; init; }
        public string NatureName { get; init; } = "";
        public int? SubjectGroupId { get; init; }
        public string GroupName { get; init; } = "";
        public int SubjectId { get; init; }
        public string SubjectName { get; init; } = "";
        public long Cnt { get; init; }
        public long Complaints { get; init; }
    }

    private sealed class SampleRow
    {
        public long CookieId { get; init; }
        public int SubjectId { get; init; }
        public string? Caption { get; init; }
        public string? SubjectClassName { get; init; }
        public string? CookieStatusName { get; init; }
    }
}
