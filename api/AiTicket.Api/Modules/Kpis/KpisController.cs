using AiTicket.Api.Contracts;
using AiTicket.Api.Infrastructure.Didban;
using AiTicket.Api.Modules.Analytics;
using Microsoft.AspNetCore.Mvc;

namespace AiTicket.Api.Modules.Kpis;

[ApiController]
[Route("api/v1/kpis")]
public sealed class KpisController(
    IAnalyticsQueryService analytics,
    IDidbanConnectionFactory connectionFactory) : ControllerBase
{
    [HttpGet("values")]
    [ProducesResponseType(typeof(KpiValuesResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<KpiValuesResponse>> GetValues(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
        [FromQuery] string? codes,
        CancellationToken ct)
    {
        if (!connectionFactory.IsConfigured)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new ProblemDto(
                "https://aiticket.local/problems/didban-not-configured",
                "Didban not configured",
                503,
                "Set Didban:ConnectionString via user secrets or environment.",
                "didban_not_configured"));
        }

        var codeList = string.IsNullOrWhiteSpace(codes)
            ? null
            : codes.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await analytics.GetKpiValuesAsync(filter, codeList, ct));
    }
}
