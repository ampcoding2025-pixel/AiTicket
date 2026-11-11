# Phase 2 — Didban Field Map & Eligibility Rules (Draft)

Read-only source: `DidehbanDb` (SQL Server). Analytical DTOs must **not** expose raw tables 1:1.

## Entity Mapping

| Product concept | Didban object | Key columns |
|-----------------|---------------|-------------|
| Case | `Cookie` | `CookieId`, `CookieTime`, `CookieFinishTime`, `CookieStatusId`, `SubjectClassId`, `SubjectId`, `SubjectGroupId`, `SubjectNatureId`, `ZoneId`, `DepartmentId`, `CookieChannelId`, `CookieIsCritical`, `CookiePersuitsCount`, `ReferringCookieId` |
| Citizen / geo | `Inform` | `CookieId`, `RegionId`, `AreaId` (PII columns excluded from aggregates) |
| Workflow step | `CookieFlow` | `CookieId`, `CookieFlowTime`, `CookieStatusId`, `DepartmentId`, `CookieFlowReplyCitizen`, `CookieFlowDelayTime`, `CookieFlowDiscontentCount`, `ReferToUserId` |
| Open work | `Cartable` | `CookieId`, `CartableTime`, `DepartmentId`, `CookieStatusId` |
| Taxonomy leaf | `Subject` | `SubjectId`, `SubjectName`, `SubjectGroupId` |
| Taxonomy mid | `SubjectGroup` | `SubjectGroupId`, `SubjectGroupName` |
| Domain | `SubjectNature` | `SubjectNatureId`, `SubjectNatureName` |
| Class | `SubjectClass` | `SubjectClassId`, `SubjectClassName` |
| Org unit | `Department` | `DepartmentId`, `DepartmentName`, `RegionId` |
| Channel | `CookieChannel` | `CookieChannelId`, `CookieChannelName` |
| Status | `CookieStatus` | `CookieStatusId`, `CookieStatusName` |
| Province | `Region` | `RegionId`, `RegionName` |

## DTO Field Sources (examples)

### Executive KPI A1 Total cases
- Source: `COUNT(*) FROM Cookie WHERE CookieTime BETWEEN @from AND @to AND <eligibility>`

### A2 Complaints
- `SubjectClassId = 1`

### B2 Resolution time
- `DATEDIFF(day, CookieTime, CookieFinishTime)` where finish not null and eligibility + resolved rule

### D1 Answer availability
- Distinct `CookieId` with non-empty `CookieFlow.CookieFlowReplyCitizen` / eligible cookies

### Geo
- Join `Inform` on `CookieId`; group by `Inform.RegionId`

## Eligibility Rules — Draft `eligibility-v0.1`

**Goal:** define which Cookie rows count in volume/resolution KPIs.

Proposed include when **all** true:

1. `CookieTime` within selected period (for period-scoped KPIs)
2. `CookieTypeId = 1` (پیام) — only type observed in fact table
3. Not cancelled if business confirms cancel semantics (`CookieCancelTime IS NULL`) — **pending stakeholder confirm**

Proposed exclude (pending confirm):

- Pure noise subjects optional filter (e.g. «پیام‌های صوتی غیرقابل پیگیری») via query flag `excludeNoiseSubjects=true`
- Test/system users if identifiable later

`ruleSetVersion`: `eligibility-v0.1-draft` until signed off.

## Resolved-Status Rules — Draft `resolved-v0.1`

Two complementary signals (product must pick primary):

### Option A — FinishTime primary (recommended start)
- Resolved: `CookieFinishTime IS NOT NULL`
- Unresolved: `CookieFinishTime IS NULL`

### Option B — Status set primary
Candidate closed statuses observed at high volume:

| Id | Name | Role |
|----|------|------|
| 37 | رسیدگی توسط پردازش | likely closed-ish |
| 38 | تایید نهایی | closed |
| 15 | انجام شد | closed |
| 19 | تایید انجام | closed |
| 6 | رسیدگی و انجام شد | closed |
| 12 | قابلیت توزیع ندارد | terminal non-action? |

**Blocker:** Status 37 dominates (~138k). Treating all as “resolved” may inflate resolution rate. Requires business workshop.

Until sign-off: APIs may expose **both** `finishedCount` (FinishTime) and `statusClosedCount` (status set) under Needs_rules feasibility.

`ruleSetVersion`: `resolved-v0.1-draft`

## SLA

Do **not** implement C3 until deadline fields populated or formal SLA calendar provided. Delay proxy (`CookieFlowDelayTime`) may be exposed only as `weak_proxy` metric with explicit labeling.

## Open Decisions (must close before P3 live wiring)

1. Final eligibility exclusions
2. Final resolved definition (A vs B vs hybrid)
3. Whether noise subject 357 is excluded from executive totals by default
4. Org hierarchy: flat `Department` vs `DepartmentChart`
5. Who signs `ruleSetVersion` promotions
