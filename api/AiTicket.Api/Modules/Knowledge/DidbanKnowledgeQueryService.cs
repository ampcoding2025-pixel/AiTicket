using System.Text.RegularExpressions;
using AiTicket.Api.Contracts;
using AiTicket.Api.Infrastructure.Analytics;
using AiTicket.Api.Infrastructure.Didban;
using AiTicket.Api.Modules.Analytics;
using Dapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace AiTicket.Api.Modules.Knowledge;

public sealed class DidbanKnowledgeQueryService(
    IDidbanConnectionFactory connectionFactory,
    IOptions<AnalyticsOptions> analyticsOptions,
    IMemoryCache cache) : IKnowledgeQueryService
{
    private static readonly Regex NationalCode = new(@"\b\d{10}\b", RegexOptions.Compiled);
    private static readonly Regex PhoneLike = new(@"\b0\d{9,10}\b", RegexOptions.Compiled);

    private readonly AnalyticsOptions _analytics = analyticsOptions.Value;

    public Task<AnswerIntelligenceResponse> GetAnswerIntelligenceAsync(PeriodFilter filter, CancellationToken ct)
    {
        var key = $"answers:summary:{FilterKey(filter)}";
        return cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(3);
            return await LoadSummaryAsync(filter, ct);
        })!;
    }

    public async Task<AnswerCasesPageResponse> GetAnswerCasesAsync(
        PeriodFilter filter,
        string? validity,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var offset = (page - 1) * pageSize;

        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);
        dp.Add("offset", offset);
        dp.Add("pageSize", pageSize);

        // List focuses on cases that have citizen reply (availability). Other validity states are synthetic labels.
        var onlyNoAnswer = string.Equals(validity, "no_answer", StringComparison.OrdinalIgnoreCase);

        string sql;
        if (onlyNoAnswer)
        {
            sql = $"""
                SELECT COUNT_BIG(*) FROM dbo.Cookie c
                {whereSql}
                AND NOT EXISTS (
                  SELECT 1 FROM dbo.CookieFlow f
                  WHERE f.CookieId = c.CookieId
                    AND f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0)
                """;
        }
        else
        {
            sql = $"""
                SELECT COUNT_BIG(*) FROM dbo.Cookie c
                {whereSql}
                AND EXISTS (
                  SELECT 1 FROM dbo.CookieFlow f
                  WHERE f.CookieId = c.CookieId
                    AND f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0)
                """;
        }

        var total = await connection.ExecuteScalarAsync<long>(new CommandDefinition(sql, dp, cancellationToken: ct));

        var listSql = onlyNoAnswer
            ? $"""
                SELECT
                  c.CookieId,
                  LEFT(ISNULL(c.CookieCaption, N''), 160) AS Caption,
                  sc.SubjectClassName,
                  s.SubjectName,
                  ISNULL(d.DepartmentName, N'نامشخص') AS DepartmentName,
                  CONVERT(char(10), c.CookieTime, 23) AS RequestDate,
                  CAST(NULL AS nvarchar(10)) AS AnswerDate,
                  CAST(NULL AS nvarchar(200)) AS AnswerExcerpt
                FROM dbo.Cookie c
                LEFT JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                LEFT JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                LEFT JOIN dbo.Department d ON d.DepartmentId = c.DepartmentId
                {whereSql}
                AND NOT EXISTS (
                  SELECT 1 FROM dbo.CookieFlow f
                  WHERE f.CookieId = c.CookieId
                    AND f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0)
                ORDER BY c.CookieTime DESC
                OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
                """
            : $"""
                SELECT
                  c.CookieId,
                  LEFT(ISNULL(c.CookieCaption, N''), 160) AS Caption,
                  sc.SubjectClassName,
                  s.SubjectName,
                  ISNULL(d.DepartmentName, N'نامشخص') AS DepartmentName,
                  CONVERT(char(10), c.CookieTime, 23) AS RequestDate,
                  CONVERT(char(10), reply.ReplyTime, 23) AS AnswerDate,
                  LEFT(ISNULL(reply.ReplyText, N''), 160) AS AnswerExcerpt
                FROM dbo.Cookie c
                LEFT JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                LEFT JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                LEFT JOIN dbo.Department d ON d.DepartmentId = c.DepartmentId
                OUTER APPLY (
                  SELECT TOP 1 f.CookieFlowReplyCitizen AS ReplyText, f.CookieFlowTime AS ReplyTime
                  FROM dbo.CookieFlow f
                  WHERE f.CookieId = c.CookieId
                    AND f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0
                  ORDER BY f.CookieFlowTime DESC
                ) reply
                {whereSql}
                AND reply.ReplyText IS NOT NULL
                ORDER BY c.CookieTime DESC
                OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
                """;

        var rows = await connection.QueryAsync<CaseRow>(new CommandDefinition(listSql, dp, cancellationToken: ct));
        var items = rows.Select(r =>
        {
            var hasReply = !string.IsNullOrWhiteSpace(r.AnswerExcerpt);
            return new AnswerCaseDto(
                $"c-{r.CookieId}",
                Redact(r.Caption) ?? "",
                r.SubjectClassName ?? "",
                r.SubjectName ?? "",
                r.DepartmentName ?? "",
                r.RequestDate ?? "",
                r.AnswerDate,
                hasReply ? Redact(r.AnswerExcerpt) : null,
                null,
                null,
                hasReply ? "available_unvalidated" : "no_answer",
                hasReply
                    ? "پاسخ متنی موجود است؛ اعتبار قانونی بررسی نشده."
                    : "ReplyCitizen برای این پرونده خالی است.");
        }).ToList();

        return new AnswerCasesPageResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            items,
            page,
            pageSize,
            total);
    }

    private async Task<AnswerIntelligenceResponse> LoadSummaryAsync(PeriodFilter filter, CancellationToken ct)
    {
        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);

        var coverage = await connection.QuerySingleAsync<CoverageRow>(
            new CommandDefinition(
                $"""
                SELECT
                  COUNT_BIG(*) AS Eligible,
                  COUNT_BIG(replied.CookieId) AS WithReply
                FROM dbo.Cookie c
                LEFT JOIN (
                  SELECT DISTINCT f.CookieId
                  FROM dbo.CookieFlow f
                  WHERE f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0
                ) replied ON replied.CookieId = c.CookieId
                {whereSql}
                """,
                dp,
                cancellationToken: ct));

        var withReply = coverage.WithReply;
        var eligible = coverage.Eligible;
        var noText = Math.Max(0, eligible - withReply);
        var availablePercent = eligible == 0 ? 0 : Math.Round(100.0 * withReply / eligible, 1);

        var trend = (await connection.QueryAsync<CoverageTrendPointDto>(
            new CommandDefinition(
                $"""
                SELECT
                  CAST(YEAR(c.CookieTime) AS nvarchar(8)) AS Label,
                  CASE WHEN COUNT_BIG(*) = 0 THEN CAST(0 AS float)
                       ELSE CAST(ROUND(100.0 * COUNT_BIG(replied.CookieId) / COUNT_BIG(*), 1) AS float) END AS AvailablePercent
                FROM dbo.Cookie c
                LEFT JOIN (
                  SELECT DISTINCT f.CookieId
                  FROM dbo.CookieFlow f
                  WHERE f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0
                ) replied ON replied.CookieId = c.CookieId
                {whereSql}
                GROUP BY YEAR(c.CookieTime)
                ORDER BY YEAR(c.CookieTime)
                """,
                dp,
                cancellationToken: ct))).ToList();

        var frequent = (await connection.QueryAsync<FrequentRow>(
            new CommandDefinition(
                $"""
                SELECT TOP 8
                  s.SubjectId,
                  s.SubjectName AS Topic,
                  COUNT_BIG(*) AS ReuseCount,
                  CONVERT(char(10), MAX(c.CookieTime), 23) AS LastUsed
                FROM dbo.Cookie c
                INNER JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                {whereSql}
                AND EXISTS (
                  SELECT 1 FROM dbo.CookieFlow f
                  WHERE f.CookieId = c.CookieId
                    AND f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0)
                GROUP BY s.SubjectId, s.SubjectName
                ORDER BY ReuseCount DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var casesPage = await GetAnswerCasesAsync(filter, null, 1, 8, ct);

        var byDepartment = await LoadCoverageByDimensionAsync(
            connection,
            whereSql,
            dp,
            dimIdExpr: "ISNULL(CAST(c.DepartmentId AS nvarchar(20)), N'0')",
            dimNameExpr: "ISNULL(d.DepartmentName, N'نامشخص')",
            joinSql: "LEFT JOIN dbo.Department d ON d.DepartmentId = c.DepartmentId",
            ct);

        var bySubject = await LoadCoverageByDimensionAsync(
            connection,
            whereSql,
            dp,
            dimIdExpr: "ISNULL(CAST(c.SubjectId AS nvarchar(20)), N'0')",
            dimNameExpr: "ISNULL(s.SubjectName, N'نامشخص')",
            joinSql: "LEFT JOIN dbo.Subject s ON s.SubjectId = c.SubjectId",
            ct);

        var summary = new List<KpiCardDto>
        {
            new("eligible", "پرونده‌های مشمول", eligible, "count", null, "neutral", null, "feasible"),
            new("available", "پوشش پاسخ شهروند", availablePercent, "percent", null, "warning", "Availability — نه Validity", "feasible"),
            new("valid", "پوشش پاسخ معتبر فعلی", null, "percent", null, "critical", "مدل اعتبار در دیده‌بان نیست", "unavailable"),
            new("review", "نیازمند بررسی خبره", null, "percent", null, "critical", "M2", "unavailable"),
        };

        return new AnswerIntelligenceResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            "پوشش پاسخ بر اساس CookieFlowReplyCitizen است. Validity/versioning در دیده‌بان موجود نیست.",
            summary,
            new CoverageBreakdownDto(eligible, withReply, 0, noText, null, null),
            trend,
            frequent.Select(f => new FrequentAnswerDto(
                $"fa-{f.SubjectId}",
                f.Topic ?? "",
                f.ReuseCount,
                f.LastUsed ?? "",
                "available_unvalidated")).ToList(),
            casesPage.Items,
            byDepartment,
            bySubject);
    }

    private static async Task<IReadOnlyList<CoverageDimensionDto>> LoadCoverageByDimensionAsync(
        System.Data.IDbConnection connection,
        string whereSql,
        DynamicParameters dp,
        string dimIdExpr,
        string dimNameExpr,
        string joinSql,
        CancellationToken ct)
    {
        var rows = await connection.QueryAsync<DimensionRow>(
            new CommandDefinition(
                $"""
                SELECT TOP 12
                  {dimIdExpr} AS DimId,
                  {dimNameExpr} AS DimName,
                  COUNT_BIG(*) AS Eligible,
                  COUNT_BIG(replied.CookieId) AS WithReply
                FROM dbo.Cookie c
                {joinSql}
                LEFT JOIN (
                  SELECT DISTINCT f.CookieId
                  FROM dbo.CookieFlow f
                  WHERE f.CookieFlowReplyCitizen IS NOT NULL
                    AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0
                ) replied ON replied.CookieId = c.CookieId
                {whereSql}
                GROUP BY {dimIdExpr}, {dimNameExpr}
                ORDER BY COUNT_BIG(*) DESC
                """,
                dp,
                cancellationToken: ct));

        return rows.Select(r =>
        {
            var pct = r.Eligible == 0 ? 0 : Math.Round(100.0 * r.WithReply / r.Eligible, 1);
            return new CoverageDimensionDto(r.DimId ?? "0", r.DimName ?? "نامشخص", r.Eligible, r.WithReply, pct);
        }).ToList();
    }

    private static string FilterKey(PeriodFilter filter) =>
        $"{filter.From:o}|{filter.To:o}|{filter.DepartmentId}|{filter.SubjectClassId}|{filter.ChannelId}|{filter.ZoneId}|{filter.RegionId}";

    private static DynamicParameters ToDynamic(Dictionary<string, object?> parameters)
    {
        var dp = new DynamicParameters();
        foreach (var (key, value) in parameters)
        {
            dp.Add(key, value);
        }
        return dp;
    }

    private static string? Redact(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return text;
        var redacted = NationalCode.Replace(text, "[کد ملی]");
        redacted = PhoneLike.Replace(redacted, "[تلفن]");
        return redacted;
    }

    private sealed class CoverageRow
    {
        public long Eligible { get; init; }
        public long WithReply { get; init; }
    }

    private sealed class DimensionRow
    {
        public string? DimId { get; init; }
        public string? DimName { get; init; }
        public long Eligible { get; init; }
        public long WithReply { get; init; }
    }

    private sealed class FrequentRow
    {
        public int SubjectId { get; init; }
        public string? Topic { get; init; }
        public long ReuseCount { get; init; }
        public string? LastUsed { get; init; }
    }

    private sealed class CaseRow
    {
        public long CookieId { get; init; }
        public string? Caption { get; init; }
        public string? SubjectClassName { get; init; }
        public string? SubjectName { get; init; }
        public string? DepartmentName { get; init; }
        public string? RequestDate { get; init; }
        public string? AnswerDate { get; init; }
        public string? AnswerExcerpt { get; init; }
    }
}
