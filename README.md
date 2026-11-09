# AiTicket — Social Security Intelligent Analytics Platform

پلتفرم تحلیلی و هوش سازمانی برای تحلیل تاریخی درخواست‌ها و شکایات (منبع داده: دیده‌بان) با مسیر تکاملی به سمت مدیریت هوشمند شکایت.

## Approach

**Outside-In:** Product & UX → Presentation Layer (Mock Data) → API contracts → Backend → Didban read-only integration → AI.

## Repository Layout

```
docs/     Product, IA, KPI, architecture notes
web/      Next.js frontend (Phase 2)
```

## Quick Start (Frontend)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Didban Access Policy

- **Read-only** inspection/integration only
- **No CRUD** on production Didban tables
- Secrets stay in local environment / secret manager — never commit credentials

## Status

- Phase 1 docs: started
- Phase 2 Executive Dashboard with Mock Data: in progress
- Didban schema discovery: blocked until host/engine details are provided
