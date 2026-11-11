namespace AiTicket.Api.Infrastructure.Didban;

public sealed class DidbanOptions
{
    public const string SectionName = "Didban";

    public string ConnectionString { get; set; } = string.Empty;
    public int CommandTimeoutSeconds { get; set; } = 60;
    public bool TrustServerCertificate { get; set; } = true;
    public bool ReadOnlyEnforced { get; set; } = true;
}
