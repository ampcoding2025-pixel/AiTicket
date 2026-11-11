using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Knowledge;

public sealed record AnswerIntelligenceResponse(
    MetaDto Meta,
    string RuleSetVersion,
    string Caveat,
    IReadOnlyList<KpiCardDto> Summary,
    CoverageBreakdownDto CoverageBreakdown,
    IReadOnlyList<CoverageTrendPointDto> CoverageTrend,
    IReadOnlyList<FrequentAnswerDto> FrequentAnswers,
    IReadOnlyList<AnswerCaseDto> Cases,
    IReadOnlyList<CoverageDimensionDto> CoverageByDepartment,
    IReadOnlyList<CoverageDimensionDto> CoverageBySubject);

/** Diagnostic slice: where Availability concentrates (not Validity). */
public sealed record CoverageDimensionDto(
    string Id,
    string Name,
    long Eligible,
    long WithReply,
    double CoveragePercent);

public sealed record CoverageBreakdownDto(
    long TotalEligible,
    long WithCitizenReply,
    long WithOperatorNoteOnly,
    long WithNoTextAnswer,
    long? CurrentlyValid,
    long? NeedsReview);

public sealed record CoverageTrendPointDto(string Label, double AvailablePercent);

public sealed record FrequentAnswerDto(
    string Id,
    string Topic,
    long ReuseCount,
    string LastUsed,
    string Validity);

public sealed record AnswerCaseDto(
    string Id,
    string RequestCaption,
    string RequestClass,
    string SubjectName,
    string DepartmentName,
    string RequestDate,
    string? AnswerDate,
    string? AnswerExcerpt,
    double? SimilarityScore,
    string? SimilarCaseId,
    string Validity,
    string ValidityNote);

public sealed record AnswerCasesPageResponse(
    MetaDto Meta,
    IReadOnlyList<AnswerCaseDto> Items,
    int Page,
    int PageSize,
    long Total);
