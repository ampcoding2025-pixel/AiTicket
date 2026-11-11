# KPI Dictionary (Business-Oriented + Didban Mapping)

**Rule:** Do not calculate a KPI unless required fields are confirmed. Status reflects verified `DidehbanDb` inspection (2026-11-11).

Status keys:

- `Feasible now` — fields exist with usable fill rates
- `Feasible with business rules` — fields exist; closed/eligible definitions need sign-off
- `Weak / proxy only` — signal exists but incomplete
- `Unavailable` — fields missing or empty; do not show as live KPI
- `Planned M2` — needs models / knowledge layer not in Didban

Domain note: source system is **Behzisti Didban** (`Cookie` = case). Brief “Social Security” labels should be reconciled with stakeholders.

---

## A. Volume KPIs

### A1. Total Requests (Cases)
- **Definition:** Count of eligible `Cookie` rows in period
- **Formula:** `COUNT(CookieId WHERE CookieTime IN period AND eligibility)`
- **Fields:** `CookieId`, `CookieTime`
- **Status:** `Feasible now` (~192,937 historical)

### A2. Total Complaints
- **Definition:** Cases with `SubjectClassId = 1` (شکایت)
- **Formula:** `COUNT WHERE SubjectClassId = 1`
- **Fields:** `SubjectClassId`
- **Status:** `Feasible now` (~48,555)

### A3. Non-Complaint Requests
- **Definition:** Guidance + report + suggestion (or Total − Complaints)
- **Formula:** `SubjectClassId IN (3,4,5)`
- **Status:** `Feasible now`

### A4. Requests by Category / Nature / Group / Subject
- **Formula:** `COUNT grouped by SubjectNatureId | SubjectGroupId | SubjectId | ZoneId`
- **Status:** `Feasible now` — use Didban taxonomy, **not** Healthcare/Insurance mock taxonomy

### A5. Requests by Organizational Unit
- **Formula:** `COUNT grouped by DepartmentId`
- **Status:** `Feasible now` (100% DepartmentId fill)

### A6. Requests by Channel / Region
- **Fields:** `CookieChannelId`; geo via `Inform.RegionId` / `AreaId`
- **Status:** `Feasible now`

### A7. Requests per Day / Month
- **Fields:** `CookieTime`
- **Status:** `Feasible now`

---

## B. Resolution KPIs

### B1. Resolution Rate
- **Definition:** Share of eligible cases closed in period
- **Formula:** `Resolved / Eligible × 100`
- **Candidate resolved signals:** `CookieFinishTime IS NOT NULL` and/or status in closed set (e.g. 37, 38, 15, 19, 6 — **must be business-approved**)
- **Status:** `Feasible with business rules` (FinishTime ~98.5% filled)

### B2. Average / Median Resolution Time
- **Formula:** `AVG/MEDIAN(CookieFinishTime − CookieTime)` for resolved
- **Observed exploratory avg:** ~47 days / ~1140 hours (needs outlier handling + eligibility rules)
- **Status:** `Feasible with business rules`

### B3. Unresolved / Backlog
- **Formula:** `CookieFinishTime IS NULL` or open statuses / presence in `Cartable`
- **Status:** `Feasible with business rules` (`Cartable` ~30k active-ish)

### B4. Average First-Response Time
- **Candidate:** first `CookieFlow` / first pursuit after `CookieTime`
- **Status:** `Feasible with business rules` (derive from flow timeline)

### B5. Reopened / Redistributed
- **Candidate statuses:** 14, 40 (توزیع مجدد…); flow status transitions
- **Status:** `Feasible with business rules`

---

## C. Operational KPIs

### C1. Workload per Organizational Unit
- **Formula:** open/incoming/closed by `DepartmentId` (+ optional `UserId`)
- **Status:** `Feasible now`

### C2. Incoming vs Resolved (throughput)
- **Fields:** `CookieTime` vs `CookieFinishTime`
- **Status:** `Feasible now`

### C3. SLA Compliance
- **Required:** due timestamps vs close
- **Observed:** `CookieDeadlineTime`, `CartableDeadlineTime`, `CookieFlowDeadlineTime` are **empty (0)**
- **Proxy candidate:** `CookieFlowDelayTime > 0` (~350k flow rows) — semantics unconfirmed
- **Status:** `Unavailable` as true SLA until policy + populated due dates; delay proxy = `Weak / proxy only`

### C4. Escalation / Referral Rate
- **Candidate:** status 31 ارجاع شد; `ReferToUserId`; zone/department changes in flow
- **Status:** `Feasible with business rules`

### C5. Pursuit Intensity
- **Formula:** share with `CookiePersuitsCount > 0`; avg pursuits
- **Status:** `Feasible now`

### C6. Critical Case Rate
- **Field:** `CookieIsCritical`
- **Status:** `Feasible now` (rare events)

---

## D. Historical Knowledge KPIs

### D1. Historical Answer Availability (Citizen Reply Text)
- **Definition:** Share of cases with non-empty `CookieFlow.CookieFlowReplyCitizen`
- **Observed:** ~12,220 distinct Cookies ≈ **~6.3%** — **not ~70%**
- **Status:** `Feasible now` — must be labeled as **availability of citizen reply field**, not legal validity

### D2. Operator-Note Coverage
- **Definition:** Cases with operator narrative in flow (`CookieFlowText`/`Desc`)
- **Status:** `Feasible now` but **must not** be marketed as reusable authoritative answers without validation

### D3. Valid Answer Coverage
- **Required:** effective/expiry/version/supersede metadata for regulations & answers
- **Status:** `Unavailable` in Didban — needs Knowledge module (M2)

### D4. Similar Case Retrieval Rate / Answer Reuse Rate
- **Required:** embedding index + retrieval logs + reuse tracking
- **Status:** `Planned M2` (can prototype offline; not a live org KPI yet)

### D5. Answers Requiring Expert Review
- **Status:** `Planned M2`

### D6. FAQ Coverage
- **Field:** `FAQ` (5 rows)
- **Status:** `Unavailable` as meaningful KPI

---

## E. AI KPIs (M2 — demo UI only in M1)

Classification accuracy, Precision, Recall, F1, human correction rate, confidence distribution, drift, automated resolution rate.

**Rule:** Never show fabricated live model metrics. Use `نمایشی (Mock)` until evaluated on labeled holdouts.

**Status:** `Planned M2`

---

## F. Customer Experience KPIs

### F1. Explicit Satisfaction Rate
- **Candidate statuses:** رضایت / عدم رضایت*
- **Observed:** nearly empty on Cookie
- **Status:** `Unavailable` (insufficient volume)

### F2. Discontent Signal Rate
- **Field:** `CookieFlowDiscontentCount > 0`
- **Status:** `Weak / proxy only` — confirm business meaning before executive use

### F3. Repeated / Linked Case Rate
- **Fields:** `ReferringCookieId` (409), `CookieLinkedCount` (0 useful), pursuit chains
- **Status:** `Weak / proxy only` — better as NLP near-duplicate detection (M1.5/M2 analytics)

### F4. Satisfaction Score (numeric)
- **Fields:** `SatisfactionScore`, `CookieScore`
- **Status:** `Unavailable` (null/zero)

---

## Executive Dashboard Binding Guidance

| Card | Bind when real | Until then |
|------|----------------|------------|
| Total / complaints / non-complaints | Feasible | Mock labeled, then swap provider |
| Resolved / unresolved / resolution % | After closed-status sign-off | Mock |
| Avg resolution time | After outlier rules | Mock |
| By category / org unit / channel / region | Feasible | Mock taxonomy → replace with Behzisti dims |
| Historical answer coverage | Feasible (~6.3% citizen reply) | Show real % with caveat; **do not claim 70%** |
| SLA compliance | Unavailable | Hide or mark unavailable |
| Satisfaction | Unavailable | Hide or mark unavailable |
| Emerging topics | Needs topic model | Mock → BERTopic/LDA later |

---

## Missing KPIs vs Brief Ambition (Gap List)

| Desired KPI | Gap |
|-------------|-----|
| True SLA compliance | No populated deadline fields + no SLA policy table found |
| Valid / versioned answer coverage | No regulation versioning store |
| ~70% historical answer reuse claim | Citizen reply ≈ 6.3%; claim unverified on this DB |
| CSAT / satisfaction score | Statuses unused; score columns empty |
| Robust repeat-complaint rate | Weak linkage fields; needs similarity pipeline |
| Model accuracy / drift | No production inference yet |
| Automated resolution rate | Not implemented |
| Attachment-backed evidence KPIs | No access to `DidehbanAttachment` |
