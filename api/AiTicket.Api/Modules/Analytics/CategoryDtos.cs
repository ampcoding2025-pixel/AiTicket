using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Analytics;

public sealed record CategoryExplorerResponse(
    MetaDto Meta,
    string RuleSetVersion,
    string Note,
    IReadOnlyList<KpiCardDto> Summary,
    IReadOnlyList<CategoryNodeDto> Tree);

public sealed record CategoryNodeDto(
    string Id,
    string Level,
    string Name,
    double Count,
    double GrowthPercent,
    double? ComplaintSharePercent,
    IReadOnlyList<CategorySampleDto>? Samples,
    IReadOnlyList<CategoryNodeDto>? Children);

public sealed record CategorySampleDto(
    string Id,
    string Caption,
    string ClassName,
    string Status);
