# KPI Dictionary (Business-Oriented)

**Rule:** Do not calculate a KPI unless required fields are confirmed in Didban. Mark unavailable KPIs explicitly.

Status keys: `Defined` | `Pending data mapping` | `Unavailable until fields confirmed`

---

## A. Volume KPIs

### A1. Total Requests
- **Definition:** Count of all eligible historical submissions in the selected period.
- **Formula:** `COUNT(requests WHERE eligibility_rules)`
- **Required fields:** request_id, created_at (or equivalent)
- **Aggregation:** Count
- **Time:** Period filter
- **Filters:** type, category, org unit, branch, region
- **Interpretation:** Overall demand volume
- **Limitations:** Depends on eligibility definition (duplicates, drafts, cancelled)
- **Status:** Pending data mapping

### A2. Total Complaints
- **Definition:** Submissions classified as complaints
- **Formula:** `COUNT(requests WHERE type = complaint)`
- **Required fields:** request_id, type/classification
- **Status:** Pending data mapping

### A3. Non-Complaint Requests
- **Formula:** `Total Requests − Total Complaints` (or explicit non-complaint type)
- **Status:** Pending data mapping

### A4. Requests by Category / Org Unit
- **Formula:** `COUNT grouped by category_id | org_unit_id`
- **Status:** Pending data mapping

---

## B. Resolution KPIs

### B1. Resolution Rate
- **Definition:** Share of eligible requests marked resolved in period
- **Formula:** `Resolved / Eligible × 100`
- **Required fields:** status, resolved_at, eligibility rules agreed with business
- **Interpretation:** Operational closure performance
- **Limitations:** Status semantics must be validated; reopen may inflate/deflate
- **Status:** Pending data mapping

### B2. Average / Median Resolution Time
- **Formula:** `AVG/MEDIAN(resolved_at − created_at)` for resolved items
- **Required fields:** created_at, resolved_at
- **Status:** Pending data mapping

### B3. Average First-Response Time
- **Required fields:** first_response_at, created_at
- **Status:** Unavailable until fields confirmed

---

## C. Operational KPIs

### C1. Workload per Organizational Unit
- **Formula:** open/incoming counts by org unit
- **Status:** Pending data mapping

### C2. SLA Compliance
- **Formula:** `Within_SLA / Eligible × 100`
- **Required fields:** SLA policy, due_at, closed_at
- **Status:** Unavailable until SLA rules confirmed

---

## D. Historical Knowledge KPIs

### D1. Historical Answer Coverage
- **Definition:** Share of requests for which a historical answer record exists
- **Formula:** `With_historical_answer / Eligible × 100`
- **Important:** This is **availability**, not legal validity
- **Status:** Pending data mapping

### D2. Valid Answer Coverage
- **Definition:** Share with an answer currently marked valid (effective, not superseded)
- **Formula:** `Valid_answers / Eligible × 100`
- **Required fields:** answer validity, effective/expiry/version
- **Status:** Unavailable until knowledge validity model exists

### D3. Answers Requiring Expert Review
- **Formula:** `Needs_review / Retrieved_candidates × 100`
- **Status:** Planned (M2)

---

## E. AI KPIs (M2 — demo UI only in M1)

Classification accuracy, Precision, Recall, F1, human correction rate, confidence distribution, drift, automated resolution rate.

**Rule:** Never show fabricated live model metrics. Use explicit `نمایشی (Mock)` labels.

---

## F. Customer Experience KPIs

Repeated complaint rate, recurrence, satisfaction — only if fields exist in Didban or linked systems.

**Status:** Unavailable until fields confirmed

---

## Executive Dashboard KPI Cards (M1 Mock Binding)

Until Didban mapping is complete, the Executive Dashboard binds to **synthetic mock series** labeled as demo data, using the definitions above as the contract.
