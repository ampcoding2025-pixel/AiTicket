using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Analytics;

public interface IAnalyticsQueryService
{
    Task<ExecutiveDashboardResponse> GetExecutiveAsync(PeriodFilter filter, CancellationToken ct, bool bypassCache = false);
    Task<RequestAnalyticsResponse> GetRequestsAsync(PeriodFilter filter, CancellationToken ct);
    Task<KpiValuesResponse> GetKpiValuesAsync(PeriodFilter filter, IReadOnlyList<string>? codes, CancellationToken ct);
    Task<CategoryExplorerResponse> GetCategoryTreeAsync(PeriodFilter filter, CancellationToken ct);
    Task<TopicExplorerResponse> GetTopicsAsync(PeriodFilter filter, CancellationToken ct);
}
