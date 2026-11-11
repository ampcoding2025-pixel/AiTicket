using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Analytics;

public sealed record TopicExplorerResponse(
    MetaDto Meta,
    string RuleSetVersion,
    string Method,
    string Caveat,
    IReadOnlyList<KpiCardDto> Summary,
    IReadOnlyList<TopicClusterDto> Clusters,
    IReadOnlyList<TopicRelationDto> Relations);

public sealed record TopicClusterDto(
    string Id,
    string Name,
    long Size,
    double SharePercent,
    double? GrowthPercent,
    double? Coherence,
    string Method,
    IReadOnlyList<string> Keywords,
    IReadOnlyList<string> LinkedSubjectNames,
    IReadOnlyList<TopicEvolutionPointDto> Evolution,
    IReadOnlyList<TopicSampleDto> Samples);

public sealed record TopicEvolutionPointDto(string Label, long Count);

public sealed record TopicSampleDto(string Id, string Caption, string ClassName);

public sealed record TopicRelationDto(string Source, string Target, double Weight, string Reason);
