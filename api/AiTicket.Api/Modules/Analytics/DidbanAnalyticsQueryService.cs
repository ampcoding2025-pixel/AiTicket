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

    /// <summary>SubjectId 357 = پیامهای صوتی غیر قابل پیگیری (docs/12).</summary>
    private const int VoiceNoiseSubjectId = 357;

    public async Task<ExecutiveDashboardResponse> GetExecutiveAsync(
        PeriodFilter filter,
        CancellationToken ct,
        bool bypassCache = false)
    {
        _ = bypassCache; // cache handled by CachingAnalyticsQueryService decorator
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

        // Decision coverage: class-split + voice noise (357) + auto-register dead-end
        var decision = await connection.QuerySingleAsync<DecisionCoverageRow>(
            new CommandDefinition(
                $"""
                SELECT
                  COUNT_BIG(*) AS Eligible,
                  COUNT_BIG(replied.CookieId) AS WithReply,
                  SUM(CASE WHEN c.SubjectClassId = 1 THEN 1 ELSE 0 END) AS ComplaintEligible,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND replied.CookieId IS NOT NULL THEN 1 ELSE 0 END) AS ComplaintWithReply,
                  SUM(CASE WHEN c.SubjectClassId = 3 THEN 1 ELSE 0 END) AS GuidanceEligible,
                  SUM(CASE WHEN c.SubjectClassId = 3 AND replied.CookieId IS NOT NULL THEN 1 ELSE 0 END) AS GuidanceWithReply,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND c.SubjectId = {VoiceNoiseSubjectId} THEN 1 ELSE 0 END) AS VoiceComplaintEligible,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND ISNULL(c.SubjectId, 0) <> {VoiceNoiseSubjectId} THEN 1 ELSE 0 END) AS ComplaintExVoiceEligible,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND ISNULL(c.SubjectId, 0) <> {VoiceNoiseSubjectId} AND replied.CookieId IS NOT NULL THEN 1 ELSE 0 END) AS ComplaintExVoiceWithReply,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND d.DepartmentName = N'ثبت خودکار' THEN 1 ELSE 0 END) AS AutoComplaintEligible,
                  SUM(CASE WHEN c.SubjectClassId = 1 AND d.DepartmentName = N'ثبت خودکار' AND replied.CookieId IS NOT NULL THEN 1 ELSE 0 END) AS AutoComplaintWithReply
                FROM dbo.Cookie c
                LEFT JOIN dbo.Department d ON d.DepartmentId = c.DepartmentId
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

        var volumeTrendRows = (await connection.QueryAsync<VolumeTrendRow>(
            new CommandDefinition(
                $"""
                SELECT
                  CONCAT(
                    CAST(YEAR(c.CookieTime) AS nvarchar(4)),
                    N'/',
                    RIGHT(CONCAT(N'0', CAST(MONTH(c.CookieTime) AS nvarchar(2))), 2)
                  ) AS Label,
                  COUNT_BIG(*) AS Requests,
                  SUM(CASE WHEN c.SubjectClassId = 1 THEN 1 ELSE 0 END) AS Complaints
                FROM dbo.Cookie c
                {whereSql}
                GROUP BY YEAR(c.CookieTime), MONTH(c.CookieTime)
                ORDER BY YEAR(c.CookieTime), MONTH(c.CookieTime)
                """,
                dp,
                cancellationToken: ct))).ToList();

        var total = volume.Total;
        var resolutionRate = total == 0 ? 0 : Math.Round(100.0 * volume.Finished / total, 1);
        var availablePercent = Pct(decision.WithReply, decision.Eligible);
        var d1Complaint = Pct(decision.ComplaintWithReply, decision.ComplaintEligible);
        var d1Guidance = Pct(decision.GuidanceWithReply, decision.GuidanceEligible);
        var d1ExVoice = Pct(decision.ComplaintExVoiceWithReply, decision.ComplaintExVoiceEligible);
        var voiceShare = Pct(decision.VoiceComplaintEligible, decision.ComplaintEligible);
        var autoCov = Pct(decision.AutoComplaintWithReply, decision.AutoComplaintEligible);
        var complaintShare = Pct(volume.Complaints, total);
        var topSubject = topSubjects.FirstOrDefault();
        var topSubjectShare = topSubject is null ? 0 : Pct(topSubject.Value, total);

        var kpis = new List<KpiCardDto>
        {
            new("total-requests", "کل پرونده‌ها (Cookie)", total, "count", null, "neutral", null, "feasible"),
            new("total-complaints", "شکایات", volume.Complaints, "count", null, "warning", null, "feasible"),
            new("complaint-share", "سهم شکایت", complaintShare, "percent", null, "neutral", null, "feasible"),
            new("d1-complaint", "پوشش پاسخ — شکایت (D1c)", d1Complaint, "percent", null,
                d1Complaint >= 50 ? "positive" : "warning",
                "Availability روی SubjectClass=شکایت — نه Validity", "feasible"),
            new("d1-complaint-ex-voice", "پوشش شکایت بدون نویز صوتی (D1x)", d1ExVoice, "percent", null,
                d1ExVoice >= 70 ? "positive" : "warning",
                "شکایت بدون SubjectId=357", "feasible"),
            new("d1-guidance", "پوشش پاسخ — راهنمایی (D1g)", d1Guidance, "percent", null,
                d1Guidance < 5 ? "critical" : "warning",
                "تقریباً همیشه نزدیک صفر در دیده‌بان فعلی", "feasible"),
            new("voice-noise-share", "سهم نویز صوتی از شکایت (N1)", voiceShare, "percent", null, "warning",
                "موضوع ۳۵۷ — کاندید انحراف از صف شکایت", "feasible"),
            new("auto-register-deadend", "شکایت ثبت‌خودکار بدون پاسخ (N2)",
                decision.AutoComplaintEligible, "count", null,
                decision.AutoComplaintEligible > 0 && autoCov < 5 ? "critical" : "neutral",
                $"پوشش پاسخ روی ثبت خودکار ≈ {autoCov}٪", "feasible"),
            new("non-complaint", "غیرشکایت", volume.NonComplaints, "count", null, "positive", null, "feasible"),
            new("answer-coverage", "پوشش پاسخ ترکیبی (D1)", availablePercent, "percent", null, "warning",
                "گمراه‌کننده برای مدیریت — از D1c/D1g استفاده کنید", "feasible"),
            new("resolved", "دارای FinishTime", volume.Finished, "count", null, "positive",
                "تعریف بسته‌شدن هنوز نیازمند تأیید کسب‌وکار است", "needs_rules"),
            new("unresolved", "بدون FinishTime", volume.Unfinished, "count", null, "neutral", null, "needs_rules"),
            new("avg-resolution", "میانگین زمان اتمام (روز)",
                volume.AvgResolutionDays is null ? null : Math.Round(volume.AvgResolutionDays.Value, 1),
                "days", null, "warning", "بدون حذف پرت", "needs_rules"),
            new("resolution-rate", "نرخ اتمام (FinishTime)", resolutionRate, "percent", null, "positive", null, "needs_rules"),
            new("sla", "رعایت SLA", null, "percent", null, "critical",
                "فیلدهای Deadline خالی‌اند", "unavailable"),
        };

        var brief = BuildDecisionBrief(
            SqlFilterBuilder.PeriodLabel(filter),
            total,
            complaintShare,
            availablePercent,
            d1Complaint,
            d1Guidance,
            d1ExVoice,
            voiceShare,
            decision.VoiceComplaintEligible,
            decision.AutoComplaintEligible,
            autoCov,
            topSubject?.Name,
            topSubjectShare);

        logger.LogInformation(
            "Executive aggregates computed. Total={Total} D1c={D1c} D1g={D1g} D1x={D1x} RuleSet={RuleSet}",
            total, d1Complaint, d1Guidance, d1ExVoice, _analytics.RuleSetVersion);

        var volumeTrend = volumeTrendRows
            .Select(r => new VolumeTrendPointDto(r.Label ?? "", r.Requests, r.Complaints))
            .ToList();

        return new ExecutiveDashboardResponse(
            new MetaDto("didban", DateTimeOffset.UtcNow, SqlFilterBuilder.PeriodLabel(filter)),
            _analytics.RuleSetVersion,
            kpis,
            volumeTrend,
            classDist,
            channelDist,
            topSubjects,
            topDepartments,
            new AnswerCoverageDto(
                availablePercent,
                null,
                null,
                "unavailable",
                "پوشش بر اساس CookieFlowReplyCitizen است. اعتبار قانونی نسخه‌بندی در دیده‌بان موجود نیست. برای تصمیم از D1c/D1g/D1x استفاده کنید.",
                d1Complaint,
                d1Guidance,
                d1ExVoice,
                decision.VoiceComplaintEligible,
                voiceShare,
                decision.AutoComplaintEligible,
                autoCov),
            brief);
    }

    private static double Pct(long numerator, long denominator) =>
        denominator == 0 ? 0 : Math.Round(100.0 * numerator / denominator, 1);

    private static DecisionBriefDto BuildDecisionBrief(
        string periodLabel,
        long total,
        double complaintShare,
        double d1Blended,
        double d1Complaint,
        double d1Guidance,
        double d1ExVoice,
        double voiceShare,
        long voiceCount,
        long autoCount,
        double autoCov,
        string? topSubjectName,
        double topSubjectShare)
    {
        var bigIdea =
            $"در {periodLabel} حدود {total:N0} پرونده با سهم شکایت ≈ {complaintShare:0.#}٪؛ " +
            $"پوشش پاسخ شکایت (D1c) ≈ {d1Complaint:0.#}٪ در برابر راهنمایی (D1g) ≈ {d1Guidance:0.#}٪ — " +
            $"عدد ترکیبی D1≈{d1Blended:0.#}٪ برای تصمیم‌گیری کافی نیست.";

        var insights = new List<DecisionInsightDto>
        {
            new(
                "split-d1",
                "پوشش پاسخ را بر اساس طبقه جدا کنید",
                $"D1c≈{d1Complaint:0.#}٪ و D1g≈{d1Guidance:0.#}٪؛ مدیریت روی D1 ترکیبی ({d1Blended:0.#}٪) تصویر غلط می‌دهد.",
                "attention",
                "P0"),
            new(
                "voice-noise",
                "نویز صوتی غیرقابل پیگیری صف شکایت را آلوده می‌کند",
                voiceCount > 0
                    ? $"حدود {voiceCount:N0} شکایت موضوع ۳۵۷ (≈{voiceShare:0.#}٪ شکایت‌ها) با پوشش پاسخ ≈۰٪. D1x (بدون نویز) ≈ {d1ExVoice:0.#}٪."
                    : "در این بازه شکایت نویز صوتی دیده نشد.",
                "attention",
                "P0"),
            new(
                "auto-register",
                "ثبت خودکار بن‌بست پاسخ شکایت است",
                autoCount > 0
                    ? $"{autoCount:N0} شکایت روی «ثبت خودکار» با پوشش پاسخ ≈ {autoCov:0.#}٪ — در حالی‌که رؤسای شهرستان معمولاً بالای ۹۰٪اند."
                    : "شکایت ثبت‌خودکار در این فیلتر نیست.",
                "attention",
                "P0"),
            new(
                "top-subject",
                "تمرکز موضوعی برای بسته پاسخ",
                string.IsNullOrWhiteSpace(topSubjectName)
                    ? "موضوع پرتکرار در این بازه خالی است."
                    : $"پرتکرارترین موضوع «{topSubjectName}» ≈ {topSubjectShare:0.#}٪ حجم است — کاندید بسته پاسخ انسان‌محور (بدون ارسال خودکار).",
                "opportunity",
                "P1"),
            new(
                "rules-appendix",
                "شاخص‌های FinishTime/SLA هنوز تصمیم‌پذیر نیستند",
                "B1/B2/B3 نیازمند امضای قاعده؛ C3 به‌خاطر Deadline خالی unavailable است.",
                "info",
                "P2"),
        };

        return new DecisionBriefDto(bigIdea, insights);
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
            ["D1c"] = executive.Kpis.First(k => k.Id == "d1-complaint"),
            ["D1g"] = executive.Kpis.First(k => k.Id == "d1-guidance"),
            ["D1x"] = executive.Kpis.First(k => k.Id == "d1-complaint-ex-voice"),
            ["N1"] = executive.Kpis.First(k => k.Id == "voice-noise-share"),
            ["N2"] = executive.Kpis.First(k => k.Id == "auto-register-deadend"),
            ["A2s"] = executive.Kpis.First(k => k.Id == "complaint-share"),
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

    private sealed class DecisionCoverageRow
    {
        public long Eligible { get; init; }
        public long WithReply { get; init; }
        public long ComplaintEligible { get; init; }
        public long ComplaintWithReply { get; init; }
        public long GuidanceEligible { get; init; }
        public long GuidanceWithReply { get; init; }
        public long VoiceComplaintEligible { get; init; }
        public long ComplaintExVoiceEligible { get; init; }
        public long ComplaintExVoiceWithReply { get; init; }
        public long AutoComplaintEligible { get; init; }
        public long AutoComplaintWithReply { get; init; }
    }

    private sealed class VolumeTrendRow
    {
        public string? Label { get; init; }
        public long Requests { get; init; }
        public long Complaints { get; init; }
    }
}
