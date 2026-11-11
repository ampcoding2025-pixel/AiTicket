# Prioritized Dig-In Roadmap (Decision Record)

Date: 2026-11-11  
Method: Outside-In (brief) + verified Didban reality (read-only)

## Repo State vs Brief

| Brief expectation | Repo reality |
|-------------------|--------------|
| Phase 1 product docs | Present (`docs/01`–`07`) |
| Phase 2 Executive Dashboard + Mock | Started (`web/` Next.js, shell, KPI cards, charts) |
| Didban blocked | **Outdated** — connected; findings in `08` |
| KPI dictionary unmapped | **Updated** in `04` with Feasible/Unavailable |
| AI / backend | Correctly not started |

## Strategic Corrections (Do First Mentally)

1. **Domain:** Design for **Behzisti Didban**, reconcile “Social Security” naming with stakeholders.
2. **70% claim:** Treat as **unverified**; measured citizen-reply availability ≈ **6.3%**.
3. **Taxonomy:** Replace Healthcare/Insurance mock with SubjectClass / Nature / Group / Subject.
4. **Outside-In still wins:** Finish trustworthy UI + contracts before wiring production queries into pages — but **parallel** schema/KPI mapping is now unblocked.

---

## Prioritized Dig-In List (Execute in Order)

### P0 — Align truth (docs + product language) — **THIS STEP**
**Why:** Wrong domain / wrong 70% claim will poison every dashboard.

- [x] Read-only Didban discovery (`08`)
- [x] Remap KPI feasibility (`04`)
- [x] Analytics/AI toolkit (`10`)
- [ ] Stakeholder confirm: product name, closed-status set, delay/discontent semantics
- [ ] Update mock taxonomy labels toward Behzisti dimensions (still Mock-flagged)

**Exit:** Shared vocabulary Cookie/SubjectClass/Department; no live “70% valid answers” claim.

---

### P1 — Finish Phase 2 Presentation Layer (Mock, Behzisti-shaped)
**Why:** Brief requires Outside-In; execs need a presentable RTL product before API work.

1. Polish Executive Dashboard interactions (filters, drill-down drawer stubs, Jalali range) — **done**
2. Request & Complaint Analytics page — **done**
3. Category Explorer bound to Didban-shaped taxonomy — **done**
4. Topic & Cluster Explorer shell — **done**
5. Historical Answer Intelligence page — **done**
6. KPI Monitoring page — **done**
7. Reports + AI + Admin shells — **done (Mock structure)**

**Exit:** Demo-ready M1 UI; mock provider remains swappable. **P1 complete as of 2026-11-11.**

---

### P2 — API contracts + analytical field map — **IN PROGRESS**
**Why:** Frontend must not couple to raw Didban tables.

Deliverables:

- [x] OpenAPI draft — `docs/openapi/analytics-v1.yaml` + `docs/11-api-contracts.md`
- [x] Mapping doc — `docs/12-didban-field-map.md`
- [x] Eligibility & resolved-status rules — **draft** in `12` (awaiting business sign-off)
- [x] PII minimization matrix — `docs/13-pii-matrix.md`

**Exit:** Contracts frozen enough to implement backend without UI redesign.  
**Remaining:** stakeholder sign-off on `eligibility-v0.1` / `resolved-v0.1`; then P3 backend skeleton.

---

### P3 — Read-only integration pipeline (Backend start) — **IN PROGRESS**
**Why:** Replace Mock with truth for Feasible KPIs only.

- [x] ASP.NET modular monolith skeleton (`api/AiTicket.Api`)
- [x] Read-only SQL (Dapper) for executive / requests / KPI values
- [x] Health + admin sources probe
- [x] Cache aggregates (`IMemoryCache`, ~3 minutes)
- [x] Frontend `DATA_PROVIDER=api` swap (executive, requests, categories, answers; topics/KPI catalog/admin still Mock fallback)
- [x] Category tree + answer summary/cases endpoints

**First live KPI set (API):** A1, A2, A3, B1/B2/B3 (needs_rules), D1, C3 unavailable.

**Exit:** Executive Dashboard can run on `DATA_PROVIDER=api` against Didban aggregates. **P3 core complete** — polish: volume trend live; remaining: KPI dictionary page live values, topics NLP.

---

### P4 — Historical analytics & offline NLP (not automation)
**Why:** Match/exceed observed org analysis with measurable quality.

1. Topic models (TF-IDF baseline → BERTopic Persian) on scrubbed Cookie text
2. Stability check of topics across years
3. Similar-case prototype (embeddings) + precision@k sampled by experts
4. Process mining on CookieFlow for referral/reopen
5. Formal study: “what % have reusable answers?” with expert rubric — **replace 70% myth with measured result**

**Exit:** Topic Explorer + Similar Case fed by batch jobs; evaluation notes in docs.

---

### P5 — Knowledge validity & HITL automation (M2)
**Why:** Brief’s RAG/auto-reply needs data Didban lacks today.

- External circular/regulation store with version/effective/expiry
- Validity-aware retrieval
- Classification assist + human approval
- AI monitoring page with real metrics only

**Exit:** Controlled pilot, not org-wide auto-answer.

---

## What We Will Dig Next (Immediate Working Decision)

**P1–P3 core complete.** API serves executive/requests/categories/answers/KPIs with cache; web can use `NEXT_PUBLIC_DATA_PROVIDER=api`.

**Next:** stakeholder sign-off on eligibility/resolved rules; then live KPI dictionary values on monitoring page, or start P4 offline NLP.

We will **not** yet: train production classifiers, call ChatGPT on citizen text at scale, or write to Didban.

---

## Dig Sequence Cheat Sheet

```
P0 Align truth (domain, KPI feasibility, 70% myth)
 → P1 Complete Mock UI (Behzisti-shaped)
 → P2 API contracts + field map
 → P3 Read-only live aggregates for Feasible KPIs
 → P4 Offline NLP / similarity / topic quality
 → P5 Validity-aware RAG + HITL automation
```
