# Page-by-Page Frontend Implementation Plan

## Shared Shell (all pages)

- RTL layout (`dir="rtl"`)
- Collapsible sidebar with maturity badges
- Top header: Jalali/Gregorian date range, org unit, branch, request type filters
- Demo banner: داده‌های نمایشی (Mock) — تا زمان اتصال به دیده‌بان
- Role switcher (dev/demo) for navigation visibility tests

## Page 1 — Executive Dashboard (FIRST)

**Route:** `/`

**Blocks:**
1. KPI strip (12 cards, responsive wrap; drill-down affordance)
2. Requests over time (line/area)
3. Complaints vs requests (stacked/grouped bar)
4. Category distribution (donut + legend)
5. Organizational unit performance (horizontal bar)
6. Historical answer coverage (gauge + validity caveat callout)
7. Emerging / recurring topics (ranked list)
8. Recent analytical insights (cards with “insight” text — mock, labeled)

**Interactions:** filter changes update mock series; KPI click opens drawer/table stub; export button stub.

## Page 2 — Request & Complaint Analytics

Filters + volume tables + period comparison + repeated-request list.

## Page 3 — Topic & Cluster Explorer

Topic list, keywords, sizes, representative requests, optional relationship graph (only if edges are meaningful).

## Page 4 — Category Explorer

Tree navigation + counts + growth + representative records. Taxonomy from config, not hardcoded final org taxonomy.

## Page 5 — Historical Answer Intelligence

Coverage vs valid vs needs-review; explorer for request → similar → answers → validity.

## Page 6 — KPI & Performance

KPI catalog browser bound to dictionary definitions.

## Page 7 — AI Performance

Shell metrics with mandatory Mock labels; no fabricated “production” accuracy claims.

## Page 8 — Reports & Exports

Standard report list + PDF/Excel download stubs.

## Admin shells

Users/roles, data sources, integration monitoring, audit logs, settings — structure only in early M1.

## Delivery Order

1. App shell + design tokens + mock provider
2. Executive Dashboard — **done (Mock, Behzisti-shaped 2026-11-11)**
3. Analytics pages — Request + Category + Topic/Cluster Explorer **Mock**
4. Knowledge pages — Historical Answer Intelligence **Mock**
5. KPI center **Mock** + Reports/Export **Mock**
6. AI Performance shell **Mock** + Admin shells **Mock** (users/sources/integration/audit/settings)

## 2026-11-11 alignment notes

- Mock taxonomy switched from Healthcare/Insurance to Didban SubjectClass / SubjectGroup
- Answer coverage mock reflects ~6.3% ReplyCitizen availability; validity marked unavailable
- SLA KPI marked unavailable (empty deadline fields)
- Branding softened to «سازمانی / دیده‌بان» pending stakeholder naming decision
