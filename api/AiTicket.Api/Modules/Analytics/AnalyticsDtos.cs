using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Analytics;

public sealed record ExecutiveDashboardResponse(
    MetaDto Meta,
    string RuleSetVersion,
    IReadOnlyList<KpiCardDto> Kpis,
    IReadOnlyList<VolumeTrendPointDto> VolumeTrend,
    IReadOnlyList<NamedValueDto> ClassDistribution,
    IReadOnlyList<NamedValueDto> ChannelDistribution,
    IReadOnlyList<NamedValueDto> TopSubjects,
    IReadOnlyList<NamedValueDto> TopDepartments,
    AnswerCoverageDto AnswerCoverage);

public sealed record VolumeTrendPointDto(string Label, long Requests, long Complaints);

public sealed record AnswerCoverageDto(
    double HistoricalAvailablePercent,
    double? CurrentlyValidPercent,
    double? NeedsReviewPercent,
    string ValidityStatus,
    string Caveat);

public sealed record RequestAnalyticsResponse(
    MetaDto Meta,
    string RuleSetVersion,
    IReadOnlyList<KpiCardDto> Summary,
    IReadOnlyList<NamedValueDto> ByClass,
    IReadOnlyList<NamedValueDto> ByChannel,
    IReadOnlyList<NamedValueDto> ByRegion,
    IReadOnlyList<NamedValueDto> BySubjectGroup);

public sealed record KpiValuesResponse(
    MetaDto Meta,
    string RuleSetVersion,
    IReadOnlyList<KpiValueDto> Values);

public sealed record KpiValueDto(
    string Code,
    string Feasibility,
    double? Value,
    string Unit,
    DateTimeOffset ComputedAt);
