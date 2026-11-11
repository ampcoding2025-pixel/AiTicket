using AiTicket.Api.Contracts;
using AiTicket.Api.Infrastructure.Didban;
using Microsoft.AspNetCore.Mvc;

namespace AiTicket.Api.Modules.Knowledge;

[ApiController]
[Route("api/v1/knowledge/answers")]
public sealed class KnowledgeController(
    IKnowledgeQueryService knowledge,
    IDidbanConnectionFactory connectionFactory) : ControllerBase
{
    [HttpGet("summary")]
    [ProducesResponseType(typeof(AnswerIntelligenceResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AnswerIntelligenceResponse>> GetSummary(
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
            return StatusCode(StatusCodes.Status503ServiceUnavailable, NotConfigured());
        }

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await knowledge.GetAnswerIntelligenceAsync(filter, ct));
    }

    [HttpGet("cases")]
    [ProducesResponseType(typeof(AnswerCasesPageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AnswerCasesPageResponse>> GetCases(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? departmentId,
        [FromQuery] int? subjectClassId,
        [FromQuery] int? channelId,
        [FromQuery] int? regionId,
        [FromQuery] int? zoneId,
        [FromQuery] string? validity,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken ct = default)
    {
        if (!connectionFactory.IsConfigured)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, NotConfigured());
        }

        var filter = new PeriodFilter(from, to, departmentId, subjectClassId, channelId, regionId, zoneId);
        return Ok(await knowledge.GetAnswerCasesAsync(filter, validity, page, pageSize, ct));
    }

    private static ProblemDto NotConfigured() => new(
        "https://aiticket.local/problems/didban-not-configured",
        "Didban not configured",
        503,
        "Set Didban:ConnectionString via user secrets or environment.",
        "didban_not_configured");
}
