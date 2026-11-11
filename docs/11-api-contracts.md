# Phase 2 — API Contracts (Frontend-Driven)

Status: **Draft for implementation** (2026-11-11)  
Source of truth for shapes: `web/src/data/providers/types.ts`  
Transport target: ASP.NET Core OpenAPI; frontend swaps `mock` → `api` via `NEXT_PUBLIC_DATA_PROVIDER`.

## Design Rules

1. Contracts follow **presentation needs**, not raw Didban tables.
2. Aggregate endpoints never return national code, phone, address, or raw free-text with PII by default.
3. Every list endpoint supports: `from`, `to`, `departmentId`, `subjectClassId`, `channelId`, `regionId`, `zoneId` (all optional).
4. Unavailable KPIs return `feasibility` + `value: null` — clients must not invent numbers.
5. Errors use RFC7807-style problem details.

## Auth (planned)

| Item | Contract |
|------|----------|
| Scheme | Bearer JWT (or cookie session) — TBD with Identity module |
| Roles | `executive`, `analytics`, `supervisor`, `expert`, `admin` |
| Drill-down | Requires `expert+` and masked fields unless elevated claim |

Until Identity exists, local/dev may use a header stub `X-Demo-Role`.

## Common Types

```ts
PeriodFilter {
  from?: string; // ISO date
  to?: string;
  departmentId?: number;
  subjectClassId?: number;
  channelId?: number;
  regionId?: number;
  zoneId?: number;
}

Meta {
  source: "didban" | "mock";
  generatedAt: string; // ISO
  periodLabel: string;
  warnings?: string[];
}

Feasibility = "feasible" | "needs_rules" | "weak_proxy" | "unavailable" | "planned_m2" | "illustrative"
```

## Endpoints

### 1. Executive Dashboard

`GET /api/v1/analytics/executive`

Query: `PeriodFilter`

Response: `ExecutiveDashboardData` (+ `meta.source` may be `didban`)

Notes:
- Include only Feasible / Needs_rules KPIs with values; Unavailable → `value` null + hint.
- `answerCoverage.currentlyValidPercent` remains null until knowledge store exists.

### 2. Request Analytics

`GET /api/v1/analytics/requests`

Query: `PeriodFilter`

Response: `RequestAnalyticsData`

### 3. Category Explorer

`GET /api/v1/analytics/categories/tree`

Query: `PeriodFilter`

Response: `CategoryExplorerData`

`GET /api/v1/analytics/categories/{nodeId}`

Response: single `CategoryNode` detail including optional masked `samples` (caption/class/status only).

### 4. Topic Explorer

`GET /api/v1/analytics/topics`

Query: `PeriodFilter` + `modelRunId?`

Response: `TopicExplorerData`

Until offline NLP jobs exist: return `403` with problem `model_not_ready` **or** empty clusters with `meta.warnings` — product choice: prefer empty + warning over fake metrics.

### 5. Answer Intelligence

`GET /api/v1/knowledge/answers/summary`

Query: `PeriodFilter`

Response: summary KPIs + coverageBreakdown + coverageTrend

`GET /api/v1/knowledge/answers/cases`

Query: `PeriodFilter` + `validity?` + `page` + `pageSize`

Response: paged `HistoricalAnswerCase[]` (excerpts redacted/masked)

### 6. KPI Catalog & Values

`GET /api/v1/kpis/dictionary`

Response: dictionary items without volatile `latestValue`/`trend` (static contract)

`GET /api/v1/kpis/values`

Query: `PeriodFilter` + `codes?: string[]` (e.g. `A1,A2,B1`)

Response:

```ts
{
  meta: Meta;
  values: Array<{
    code: string;
    feasibility: Feasibility;
    value: number | null;
    unit: string;
    trend?: { label: string; value: number }[];
    computedAt: string;
    ruleSetVersion: string; // e.g. eligibility-v0.1
  }>
}
```

### 7. Reports

`GET /api/v1/reports`

Response: report catalog

`POST /api/v1/reports/{reportId}/exports`

Body: `{ format: "pdf" | "xlsx"; filters: PeriodFilter }`

Response: `{ jobId: string; status: "queued" }`

`GET /api/v1/reports/exports/{jobId}`

Response: job status + download URL when ready

### 8. AI Performance

`GET /api/v1/ai/performance`

Response: `AiPerformanceData`

Rule: if no evaluated model, all metric values **must** be null and `lifecycle: not_trained`.

### 9. Admin (stubs → Identity later)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/users` | Admin only |
| GET | `/api/v1/admin/roles` | Admin only |
| GET | `/api/v1/admin/sources` | Health of Didban read connection |
| GET | `/api/v1/admin/integrations` | Pipeline checks |
| GET | `/api/v1/admin/audit` | Paged audit |
| GET | `/api/v1/admin/settings` | Non-secret settings |

## Error Model

```json
{
  "type": "https://aiticket.local/problems/kpi-unavailable",
  "title": "KPI unavailable",
  "status": 422,
  "detail": "C3 SLA requires populated deadline fields.",
  "code": "kpi_unavailable"
}
```

Common codes: `kpi_unavailable`, `model_not_ready`, `forbidden`, `validation_error`, `upstream_didban_error`.

## Pagination

```ts
PageRequest { page?: number; pageSize?: number } // pageSize default 25, max 100
PageResponse<T> { items: T[]; page: number; pageSize: number; total: number }
```

## Versioning

- Prefix `/api/v1`
- Breaking changes require `/api/v2` or negotiated compatibility window
- `ruleSetVersion` on KPI values tracks eligibility/resolved-status rule changes

## OpenAPI Artifact

Machine-readable draft: `docs/openapi/analytics-v1.yaml`
