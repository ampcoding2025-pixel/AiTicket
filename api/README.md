# AiTicket API (Phase 3)

ASP.NET Core modular monolith — **read-only** analytics over Didban.

## Run

```powershell
cd api/AiTicket.Api
dotnet restore
dotnet user-secrets init
dotnet user-secrets set "Didban:ConnectionString" "Server=HOST;Database=DidehbanDb;User Id=USER;Password=PASS;Encrypt=True;TrustServerCertificate=True;ApplicationIntent=ReadOnly"
dotnet run
```

Swagger: http://localhost:5088/swagger  
Health: http://localhost:5088/health

Never commit real connection strings. Use `appsettings.Development.example.json` as a template only.

## Implemented endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/analytics/executive` | Live Didban aggregates + monthly volumeTrend (cached ~3m) |
| GET | `/api/v1/analytics/requests` | Class/channel/region/group |
| GET | `/api/v1/analytics/categories/tree` | Zone→Nature→Group→Subject tree |
| GET | `/api/v1/knowledge/answers/summary` | Reply coverage + redacted cases |
| GET | `/api/v1/knowledge/answers/cases` | Paged redacted answer cases |
| GET | `/api/v1/kpis/values` | A1/A2/A3/B1/B2/B3/D1/C3 |
| GET | `/api/v1/admin/sources` | Connection health |
| GET | `/health` | Didban probe |

## Safety

- `ApplicationIntent=ReadOnly` on SQL connections
- No INSERT/UPDATE/DELETE helpers
- SLA KPI returns `feasibility: unavailable`
- Answer validity remains null
