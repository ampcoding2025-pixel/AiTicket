using AiTicket.Api.Contracts;
using AiTicket.Api.Infrastructure.Didban;
using Microsoft.AspNetCore.Mvc;

namespace AiTicket.Api.Modules.Analytics;

[ApiController]
[Route("api/v1/analytics")]
public sealed class AnalyticsController(
    IAnalyticsQueryService analytics,
    IDidbanConnectionFactory connectionFactory) : ControllerBase
{
    [HttpGet("executive")]
    [ProducesResponseType(typeof(ExecutiveDashboardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDto), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ExecutiveDashboardResponse>> GetExecutive(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
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

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        var result = await analytics.GetExecutiveAsync(filter, ct);
        return Ok(result);
    }

    [HttpGet("requests")]
    [ProducesResponseType(typeof(RequestAnalyticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<RequestAnalyticsResponse>> GetRequests(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
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

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await analytics.GetRequestsAsync(filter, ct));
    }

    [HttpGet("categories/tree")]
    [ProducesResponseType(typeof(CategoryExplorerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<CategoryExplorerResponse>> GetCategoryTree(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
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

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await analytics.GetCategoryTreeAsync(filter, ct));
    }

    [HttpGet("topics")]
    [ProducesResponseType(typeof(TopicExplorerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TopicExplorerResponse>> GetTopics(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
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

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await analytics.GetTopicsAsync(filter, ct));
    }
}
