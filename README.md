# AiTicket — Intelligent Complaint & Request Analytics Platform

پلتفرم تحلیلی برای تبدیل دادهٔ تاریخی **دیده‌بان** به هوش سازمانی قابل اقدام، با مسیر تکاملی به سمت دستیار هوشمند رسیدگی (انسان در حلقه).

> **Verified source (2026-11-11):** `DidehbanDb` on SQL Server is operationally a **Behzisti** case system (`Cookie` + taxonomy). Reconcile product naming with stakeholders — see `docs/08-didban-inspection-notes.md`.

## Approach

**Outside-In:** Product & UX → Presentation Layer (Mock Data) → API contracts → Backend → Didban read-only integration → AI.

## Repository Layout

```
docs/     Product, IA, KPI mapping, Didban notes, roadmap, AI toolkit, API contracts
web/      Next.js frontend (Phase 2 Mock UI)
api/      ASP.NET Core read-only analytics API (Phase 3)
```

## Quick Start (Frontend)

```bash
cd web
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

Branding uses `web/public/behzisti-logo.png` in the sidebar.

### Live API mode (optional)

```bash
# terminal 1 — API with user-secrets Didban connection
cd api/AiTicket.Api
dotnet run

# terminal 2 — web pointed at API
cd web
# set in .env.local:
# NEXT_PUBLIC_DATA_PROVIDER=api
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5088
npm.cmd run dev
```

## Didban Access Policy

- **Read-only** inspection/integration only
- **No CRUD** on production Didban tables
- Secrets stay in local environment / secret manager — never commit credentials

## Status

| Track | Status |
|-------|--------|
| Phase 1 docs | In place; KPI + Didban notes refreshed from live DB |
| Phase 2 Executive Dashboard (Mock) | Behzisti-shaped Mock complete |
| Phase 2 Request Analytics (Mock) | Done (`/analytics/requests`) |
| Phase 2 Category Explorer (Mock) | Done (`/analytics/categories`) |
| Phase 2 Topic & Cluster Explorer (Mock) | Done (`/analytics/topics`) |
| Phase 2 Historical Answer Intelligence (Mock) | Done (`/knowledge/answers`) |
| Phase 2 KPI Monitoring (Mock) | Done (`/performance/kpi`) |
| Phase 2 Reports & Export (Mock) | Done (`/reports/standard`, `/reports/export`) |
| Phase 2 AI Performance shell (Mock) | Done (`/ai/performance`) |
| Phase 2 Admin shells (Mock) | Done (`/admin/*`) |
| **Phase 2 Presentation Layer** | **Complete (Mock, Behzisti-shaped)** |
| Phase 3 API contracts (docs) | Done draft — `docs/11`–`13` + OpenAPI |
| Phase 3 Backend API | Core done — executive/requests/categories/answers + cache; web API provider wired |
| Didban schema discovery | **Done (read-only)** — see `docs/08` |
| KPI feasibility mapping | **Done (first pass)** — see `docs/04` |
| Prioritized roadmap | `docs/09-prioritized-roadmap.md` |
| Analytics / AI toolkit | `docs/10-analytics-ai-toolkit.md` |

## Next Step (Agreed Priority)

**P1 — Continue Outside-In frontend** with Behzisti-shaped mock dimensions and honest Unavailable KPI badges, while collecting stakeholder answers for closed-status / SLA semantics (P0 leftovers).

Do **not** start production AI automation or write to Didban.
