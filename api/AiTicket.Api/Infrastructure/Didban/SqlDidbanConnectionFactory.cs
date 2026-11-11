using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;

namespace AiTicket.Api.Infrastructure.Didban;

public sealed class SqlDidbanConnectionFactory(IOptions<DidbanOptions> options) : IDidbanConnectionFactory
{
    private readonly DidbanOptions _options = options.Value;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_options.ConnectionString);

    public async Task<DbConnection> OpenReadOnlyAsync(CancellationToken cancellationToken = default)
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException(
                "Didban connection string is not configured. Copy appsettings.Development.example.json values into user secrets or env.");
        }

        var builder = new SqlConnectionStringBuilder(_options.ConnectionString)
        {
            ApplicationIntent = ApplicationIntent.ReadOnly
        };

        if (_options.TrustServerCertificate)
        {
            builder.TrustServerCertificate = true;
            builder.Encrypt = true;
        }

        var connection = new SqlConnection(builder.ConnectionString);
        await connection.OpenAsync(cancellationToken);
        return connection;
    }
}
