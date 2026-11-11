namespace AiTicket.Api.Infrastructure.Analytics;

public sealed class AnalyticsOptions
{
    public const string SectionName = "Analytics";

    public string RuleSetVersion { get; set; } = "eligibility-v0.1-draft+resolved-v0.1-draft";
    public int DefaultCookieTypeId { get; set; } = 1;
}
