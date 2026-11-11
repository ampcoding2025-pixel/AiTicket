using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Knowledge;

public interface IKnowledgeQueryService
{
    Task<AnswerIntelligenceResponse> GetAnswerIntelligenceAsync(PeriodFilter filter, CancellationToken ct);
    Task<AnswerCasesPageResponse> GetAnswerCasesAsync(
        PeriodFilter filter,
        string? validity,
        int page,
        int pageSize,
        CancellationToken ct);
}
