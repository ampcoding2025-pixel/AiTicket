using AiTicket.Api.Infrastructure.Didban;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace AiTicket.Api.Modules.Admin;

[ApiController]
[Route("api/v1/admin")]
public sealed class AdminController(IDidbanConnectionFactory connectionFactory) : ControllerBase
{
    [HttpGet("sources")]
    public async Task<IActionResult> GetSources(CancellationToken ct)
    {
        if (!connectionFactory.IsConfigured)
        {
            return Ok(new
            {
                items = new[]
                {
                    new
                    {
                        id = "ds-didban",
                        name = "DidehbanDb",
                        status = "not_configured",
                        accessMode = "read_only",
                        note = "Connection string missing"
                    }
                }
            });
        }

        try
        {
            await using var connection = await connectionFactory.OpenReadOnlyAsync(ct);
            var version = await connection.ExecuteScalarAsync<string>(
                new CommandDefinition("SELECT CAST(SERVERPROPERTY('ProductVersion') AS nvarchar(128))", cancellationToken: ct));
            var db = await connection.ExecuteScalarAsync<string>(
                new CommandDefinition("SELECT DB_NAME()", cancellationToken: ct));

            return Ok(new
            {
                items = new[]
                {
                    new
                    {
                        id = "ds-didban",
                        name = db ?? "DidehbanDb",
                        status = "connected",
                        accessMode = "read_only",
                        note = $"SQL Server {version}"
                    }
                }
            });
        }
        catch (Exception ex)
        {
            return Ok(new
            {
                items = new[]
                {
                    new
                    {
                        id = "ds-didban",
                        name = "DidehbanDb",
                        status = "unreachable",
                        accessMode = "read_only",
                        note = ex.Message
                    }
                }
            });
        }
    }
}
