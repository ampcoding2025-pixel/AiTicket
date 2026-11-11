using AiTicket.Api.Contracts;
using AiTicket.Api.Infrastructure.Analytics;
using AiTicket.Api.Infrastructure.Didban;
using Dapper;
using Microsoft.Extensions.Options;

namespace AiTicket.Api.Modules.Analytics;

public sealed partial class DidbanAnalyticsQueryService(
    IDidbanConnectionFactory connectionFactory,
    IOptions<AnalyticsOptions> analyticsOptions,
    ILogger<DidbanAnalyticsQueryService> logger) : IAnalyticsQueryService
{
    private readonly AnalyticsOptions _analytics = analyticsOptions.Value;

    public async Task<ExecutiveDashboardResponse> GetExecutiveAsync(PeriodFilter filter, CancellationToken ct)
    {
        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);

        const string volumeSql = """
            SELECT
              COUNT_BIG(*) AS Total,
              SUM(CASE WHEN c.SubjectClassId = 1 THEN 1 ELSE 0 END) AS Complaints,
              SUM(CASE WHEN c.SubjectClassId <> 1 THEN 1 ELSE 0 END) AS NonComplaints,
              SUM(CASE WHEN c.CookieFinishTime IS NOT NULL THEN 1 ELSE 0 END) AS Finished,
              SUM(CASE WHEN c.CookieFinishTime IS NULL THEN 1 ELSE 0 END) AS Unfinished,
              AVG(CASE WHEN c.CookieFinishTime IS NOT NULL
                       THEN CAST(DATEDIFF(day, c.CookieTime, c.CookieFinishTime) AS float) END) AS AvgResolutionDays
            FROM dbo.Cookie c
            {0}
            """;

        var volume = await connection.QuerySingleAsync<VolumeRow>(
            new CommandDefinition(string.Format(volumeSql, whereSql), dp, cancellationToken: ct));

        var classDist = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT sc.SubjectClassName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                {whereSql}
                GROUP BY sc.SubjectClassName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var channelDist = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT ch.CookieChannelName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.CookieChannel ch ON ch.CookieChannelId = c.CookieChannelId
                {whereSql}
                GROUP BY ch.CookieChannelName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var topSubjects = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT TOP 10 s.SubjectName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.Subject s ON s.SubjectId = c.SubjectId
                {whereSql}
                GROUP BY s.SubjectName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var topDepartments = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT TOP 10 d.DepartmentName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.Department d ON d.DepartmentId = c.DepartmentId
                {whereSql}
                GROUP BY d.DepartmentName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var replyCoverage = await connection.QuerySingleAsync<ReplyCoverageRow>(
            new CommandDefinition(
                $"""
                SELECT
                  COUNT_BIG(DISTINCT c.CookieId) AS Eligible,
                  COUNT_BIG(DISTINCT CASE
                    WHEN EXISTS (
                      SELECT 1
                      FROM dbo.CookieFlow f
                      WHERE f.CookieId = c.CookieId
                        AND f.CookieFlowReplyCitizen IS NOT NULL
                        AND LEN(LTRIM(RTRIM(f.CookieFlowReplyCitizen))) > 0
                    ) THEN c.CookieId END) AS WithReply
                FROM dbo.Cookie c
                {whereSql}
                """,
                dp,
                cancellationToken: ct));

        var total = volume.Total;
        var resolutionRate = total == 0 ? 0 : Math.Round(100.0 * volume.Finished / total, 1);
        var availablePercent = replyCoverage.Eligible == 0
            ? 0
            : Math.Round(100.0 * replyCoverage.WithReply / replyCoverage.Eligible, 1);

        var kpis = new List<KpiCardDto>
        {
            new("total-requests", "کل پرونده‌ها (Cookie)", total, "count", null, "neutral", null, "feasible"),
            new("total-complaints", "شکایات", volume.Complaints, "count", null, "warning", null, "feasible"),
            new("non-complaint", "غیرشکایت", volume.NonComplaints, "count", null, "positive", null, "feasible"),
            new("resolved", "دارای FinishTime", volume.Finished, "count", null, "positive",
                "تعریف بسته‌شدن هنوز نیازمند تأیید کسب‌وکار است", "needs_rules"),
            new("unresolved", "بدون FinishTime", volume.Unfinished, "count", null, "neutral", null, "needs_rules"),
            new("avg-resolution", "میانگین زمان اتمام (روز)",
                volume.AvgResolutionDays is null ? null : Math.Round(volume.AvgResolutionDays.Value, 1),
                "days", null, "warning", "بدون حذف پرت", "needs_rules"),
            new("resolution-rate", "نرخ اتمام (FinishTime)", resolutionRate, "percent", null, "positive", null, "needs_rules"),
            new("answer-coverage", "پوشش پاسخ شهروند", availablePercent, "percent", null, "warning",
                "Availability ≠ Validity", "feasible"),
            new("sla", "رعایت SLA", null, "percent", null, "critical",
                "فیلدهای Deadline خالی‌اند", "unavailable"),
        };

        logger.LogInformation("Executive aggregates computed. Total={Total} RuleSet={RuleSet}", total, _analytics.RuleSetVersion);

        return new ExecutiveDashboardResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            kpis,
            classDist,
            channelDist,
            topSubjects,
            topDepartments,
            new AnswerCoverageDto(
                availablePercent,
                null,
                null,
                "unavailable",
                "پوشش بر اساس CookieFlowReplyCitizen است. اعتبار قانونی نسخه‌بندی در دیده‌بان موجود نیست."));
    }

    public async Task<RequestAnalyticsResponse> GetRequestsAsync(PeriodFilter filter, CancellationToken ct)
    {
        await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
        var (whereSql, parameters) = SqlFilterBuilder.BuildCookieWhere(filter, _analytics.DefaultCookieTypeId);
        var dp = ToDynamic(parameters);

        var totals = await connection.QuerySingleAsync<VolumeRow>(
            new CommandDefinition(
                $"""
                SELECT
                  COUNT_BIG(*) AS Total,
                  SUM(CASE WHEN c.SubjectClassId = 1 THEN 1 ELSE 0 END) AS Complaints,
                  SUM(CASE WHEN c.SubjectClassId <> 1 THEN 1 ELSE 0 END) AS NonComplaints,
                  SUM(CASE WHEN c.CookieFinishTime IS NOT NULL THEN 1 ELSE 0 END) AS Finished,
                  SUM(CASE WHEN c.CookieFinishTime IS NULL THEN 1 ELSE 0 END) AS Unfinished,
                  CAST(NULL AS float) AS AvgResolutionDays
                FROM dbo.Cookie c
                {whereSql}
                """,
                dp,
                cancellationToken: ct));

        var byClass = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT sc.SubjectClassName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.SubjectClass sc ON sc.SubjectClassId = c.SubjectClassId
                {whereSql}
                GROUP BY sc.SubjectClassName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var byChannel = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT ch.CookieChannelName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.CookieChannel ch ON ch.CookieChannelId = c.CookieChannelId
                {whereSql}
                GROUP BY ch.CookieChannelName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var regionWhere = whereSql;
        var byRegion = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT TOP 15 r.RegionName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.Inform i ON i.CookieId = c.CookieId
                INNER JOIN dbo.Region r ON r.RegionId = i.RegionId
                {regionWhere}
                GROUP BY r.RegionName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var byGroup = (await connection.QueryAsync<NamedValueDto>(
            new CommandDefinition(
                $"""
                SELECT TOP 15 sg.SubjectGroupName AS Name, COUNT_BIG(*) AS Value
                FROM dbo.Cookie c
                INNER JOIN dbo.SubjectGroup sg ON sg.SubjectGroupId = c.SubjectGroupId
                {whereSql}
                GROUP BY sg.SubjectGroupName
                ORDER BY Value DESC
                """,
                dp,
                cancellationToken: ct))).ToList();

        var complaintShare = totals.Total == 0 ? 0 : Math.Round(100.0 * totals.Complaints / totals.Total, 1);
        var guidance = byClass.FirstOrDefault(x => x.Name.Contains("راهنمایی", StringComparison.Ordinal));
        var guidanceShare = totals.Total == 0 || guidance is null
            ? 0
            : Math.Round(100.0 * guidance.Value / totals.Total, 1);

        var summary = new List<KpiCardDto>
        {
            new("period-total", "حجم دوره", totals.Total, "count", null, "neutral", null, "feasible"),
            new("period-complaints", "شکایت در دوره", totals.Complaints, "count", null, "warning", null, "feasible"),
            new("complaint-share", "سهم شکایت", complaintShare, "percent", null, "neutral", null, "feasible"),
            new("guidance-share", "سهم راهنمایی", guidanceShare, "percent", null, "positive", null, "feasible"),
        };

        return new RequestAnalyticsResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            summary,
            byClass,
            byChannel,
            byRegion,
            byGroup);
    }

    public async Task<KpiValuesResponse> GetKpiValuesAsync(
        PeriodFilter filter,
        IReadOnlyList<string>? codes,
        CancellationToken ct)
    {
        var executive = await GetExecutiveAsync(filter, ct);
        var map = new Dictionary<string, KpiCardDto>(StringComparer.OrdinalIgnoreCase)
        {
            ["A1"] = executive.Kpis.First(k => k.Id == "total-requests"),
            ["A2"] = executive.Kpis.First(k => k.Id == "total-complaints"),
            ["A3"] = executive.Kpis.First(k => k.Id == "non-complaint"),
            ["B1"] = executive.Kpis.First(k => k.Id == "resolution-rate"),
            ["B2"] = executive.Kpis.First(k => k.Id == "avg-resolution"),
            ["B3"] = executive.Kpis.First(k => k.Id == "unresolved"),
            ["D1"] = executive.Kpis.First(k => k.Id == "answer-coverage"),
            ["C3"] = executive.Kpis.First(k => k.Id == "sla"),
        };

        IEnumerable<KeyValuePair<string, KpiCardDto>> selected = map;
        if (codes is { Count: > 0 })
        {
            var set = codes.Select(c => c.Trim()).Where(c => c.Length > 0).ToHashSet(StringComparer.OrdinalIgnoreCase);
            selected = map.Where(kv => set.Contains(kv.Key));
        }

        var now = DateTimeOffset.UtcNow;
        var values = selected
            .Select(kv => new KpiValueDto(kv.Key, kv.Value.Feasibility, kv.Value.Value, kv.Value.Unit ?? "count", now))
            .ToList();

        return new KpiValuesResponse(executive.Meta, _analytics.RuleSetVersion, values);
    }

    private static DynamicParameters ToDynamic(Dictionary<string, object?> parameters)
    {
        var dp = new DynamicParameters();
        foreach (var (key, value) in parameters)
        {
            dp.Add(key, value);
        }

        return dp;
    }

    private sealed class VolumeRow
    {
        public long Total { get; init; }
        public long Complaints { get; init; }
        public long NonComplaints { get; init; }
        public long Finished { get; init; }
        public long Unfinished { get; init; }
        public double? AvgResolutionDays { get; init; }
    }

    private sealed class ReplyCoverageRow
    {
        public long Eligible { get; init; }
        public long WithReply { get; init; }
    }
}
