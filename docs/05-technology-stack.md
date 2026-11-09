# Recommended Technology Stack & Design System

## Architecture Style

**Modular Monolith** (not premature microservices)

## Frontend (Phase 2 — in progress)

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui-compatible primitives |
| Data fetching | TanStack Query (later); mock providers first |
| Client state | Zustand when needed |
| Charts | Apache ECharts (preferred for dense analytics) |
| Forms | React Hook Form + Zod |
| Direction | RTL + Persian typography (Vazirmatn) |
| Themes | Light default; dark tokens reserved |

### Design System Direction (Government Enterprise)

- Trustworthy, restrained palette (deep teal/slate — not purple-gradient AI clichés)
- Clear KPI hierarchy: value → label → delta → period
- Dense but readable tables; consistent 4/8 spacing scale
- Explicit maturity badges for Mock / Planned features
- Accessible contrast; focus states for keyboard use

### Frontend Data Layer Rule

Pages consume a **replaceable data provider** (`mock` → `api`) so UI does not couple to future backend shapes.

## Backend (later phases)

- ASP.NET Core Web API, C#, .NET 10 LTS
- EF Core + Dapper for heavy analytics
- FluentValidation, OpenAPI, Hangfire/Quartz
- Modules: Identity, Organization, Request Analytics, Complaint Analytics, Taxonomy, Knowledge, KPI/Reporting, Integration, AI, Audit

## Data Integration

- Didban = **read-only** historical source
- Discover schema before mapping
- Analytical model separate from source tables
- Preserve source IDs for traceability

## AI / NLP (later)

- Python services only where specialized NLP/ML is needed
- Sentence transformers suitable for Persian; topic models with evaluation
- RAG with temporal validity and abstain behavior

## Infra

Docker, CI/CD, structured logging, OpenTelemetry, health checks, secrets management, backups, RBAC, audit
