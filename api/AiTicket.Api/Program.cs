using AiTicket.Api.Infrastructure.Analytics;
using AiTicket.Api.Infrastructure.Didban;
using AiTicket.Api.Modules.Analytics;
using AiTicket.Api.Modules.Knowledge;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DidbanOptions>(builder.Configuration.GetSection(DidbanOptions.SectionName));
builder.Services.Configure<AnalyticsOptions>(builder.Configuration.GetSection(AnalyticsOptions.SectionName));

builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IDidbanConnectionFactory, SqlDidbanConnectionFactory>();
builder.Services.AddScoped<DidbanAnalyticsQueryService>();
builder.Services.AddScoped<IAnalyticsQueryService, CachingAnalyticsQueryService>();
builder.Services.AddScoped<IKnowledgeQueryService, DidbanKnowledgeQueryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "AiTicket Analytics API",
        Version = "v1",
        Description = "Read-only analytics over Didban. Secrets must not be committed."
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddHealthChecks()
    .AddCheck<DidbanHealthCheck>("didban", failureStatus: HealthStatus.Degraded);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("web");
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

public sealed class DidbanHealthCheck(IDidbanConnectionFactory factory) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (!factory.IsConfigured)
        {
            return HealthCheckResult.Degraded("Didban connection string is not configured.");
        }

        try
        {
            await using var connection = await factory.OpenReadOnlyAsync(cancellationToken);
            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT 1";
            _ = await command.ExecuteScalarAsync(cancellationToken);
            return HealthCheckResult.Healthy("Didban read connection OK.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Didban read connection failed.", ex);
        }
    }
}

public partial class Program;
