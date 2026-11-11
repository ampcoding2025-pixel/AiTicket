using AiTicket.Api.Contracts;
using Microsoft.Extensions.Caching.Memory;

namespace AiTicket.Api.Modules.Analytics;

public sealed class CachingAnalyticsQueryService(
    DidbanAnalyticsQueryService inner,
    IMemoryCache cache) : IAnalyticsQueryService
{
    private static readonly TimeSpan Ttl = TimeSpan.FromMinutes(3);

    public Task<ExecutiveDashboardResponse> GetExecutiveAsync(PeriodFilter filter, CancellationToken ct) =>
        GetOrCreateAsync($"exec:{Key(filter)}", () => inner.GetExecutiveAsync(filter, ct));

    public Task<RequestAnalyticsResponse> GetRequestsAsync(PeriodFilter filter, CancellationToken ct) =>
        GetOrCreateAsync($"req:{Key(filter)}", () => inner.GetRequestsAsync(filter, ct));

    public Task<KpiValuesResponse> GetKpiValuesAsync(PeriodFilter filter, IReadOnlyList<string>? codes, CancellationToken ct)
    {
        var codeKey = codes is null ? "*" : string.Join(',', codes);
        return GetOrCreateAsync($"kpi:{Key(filter)}:{codeKey}", () => inner.GetKpiValuesAsync(filter, codes, ct));
    }

    public Task<CategoryExplorerResponse> GetCategoryTreeAsync(PeriodFilter filter, CancellationToken ct) =>
        GetOrCreateAsync($"cat:{Key(filter)}", () => inner.GetCategoryTreeAsync(filter, ct));

    public Task<TopicExplorerResponse> GetTopicsAsync(PeriodFilter filter, CancellationToken ct) =>
        GetOrCreateAsync($"topics:{Key(filter)}", () => inner.GetTopicsAsync(filter, ct));

    private Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory) =>
        cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = Ttl;
            return await factory();
        })!;

    private static string Key(PeriodFilter filter) =>
        $"{filter.From:o}|{filter.To:o}|{filter.DepartmentId}|{filter.SubjectClassId}|{filter.ChannelId}|{filter.ZoneId}|{filter.RegionId}";
}
