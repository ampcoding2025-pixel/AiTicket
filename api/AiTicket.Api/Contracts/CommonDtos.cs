namespace AiTicket.Api.Contracts;

public sealed record MetaDto(
    string Source,
    DateTimeOffset GeneratedAt,
    string PeriodLabel,
    IReadOnlyList<string>? Warnings = null);

public sealed record PeriodFilter(
    DateTime? From,
    DateTime? To,
    int? DepartmentId,
    int? SubjectClassId,
    int? ChannelId,
    int? RegionId,
    int? ZoneId);

public sealed record KpiCardDto(
    string Id,
    string Label,
    double? Value,
    string? Unit,
    double? DeltaPercent,
    string? Tone,
    string? Hint,
    string Feasibility);

public sealed record NamedValueDto(string Name, double Value);

public sealed record ProblemDto(
    string Type,
    string Title,
    int Status,
    string Detail,
    string Code);
