using System.Data.Common;

namespace AiTicket.Api.Infrastructure.Didban;

public interface IDidbanConnectionFactory
{
    bool IsConfigured { get; }
    Task<DbConnection> OpenReadOnlyAsync(CancellationToken cancellationToken = default);
}
