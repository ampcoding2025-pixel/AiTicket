# BI Dashboard Assessment — Chapter 1: The Importance of Context

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic |
| Chapter | 1 — The Importance of Context |
| Scope | Executive Dashboard (`داشبورد مدیریتی`, `/`) |
| Date | 2026-11-11 |
| Method | Evidence from live UI, product docs, and Didban-backed API reads |
| Verdict | **Partially meets** Chapter 1 principles (pre-fix) |
| Score | **12 / 28** (~43%) at audit time |
| Remediation | **2026-11-11** — must-fix + should-improve applied on Executive Dashboard (see § Remediations) |

---

## A. Executive summary

The dashboard is honest about data limits (feasibility badges, answer-validity caveats, Didban source labeling) and surfaces measurable volume and coverage. It does **not** yet meet Chapter 1 context standards because audience, purpose, and a single **Big Idea** are not framed for a decision-maker in three minutes. Header filters and several supporting visuals do not yet support the decisions the product vision claims.

**Strengths**

- Feasibility / validity honesty (no unverified “70%” claim)
- Live Didban volume and answer coverage (~6.3%)
- Source and period label shown on the page

**Most important weaknesses**

1. No identifiable Big Idea (Critical)
2. Header filter period vs live data period mismatch (High)
3. Audience / purpose / decisions not stated on the page (High)
4. Weak actionability (High)

---

## B. Dashboard context

### Confirmed (evidence-backed)

| Item | Evidence |
|------|----------|
| Name / domain | داشبورد مدیریتی — Behzisti Didban complaint/request analytics (`Cookie` / `SubjectClass` / `Department`). Vision doc still titled “Social Security”; product language elsewhere is Behzisti. |
| Stated M1 purpose (docs) | Historical analytics so senior management can answer volume, resolution, category, and emerging-topic questions; validity-aware knowledge caveats; Outside-In mock→API (`docs/01-product-vision.md`). |
| Delivery | Persian RTL web app (Next.js); API mode reads Didban read-only. |
| Approach | Combination — monitoring KPIs + exploratory charts; drill-down stubbed. |
| Observed live signals | ~193k cookies; complaint vs non-complaint split; answer coverage ~6.3%; SLA unavailable; resolution KPIs marked `needs_rules`. |

### Missing / not confirmed

- Named primary persona for this exact page (exec vs analytics manager) **in the UI**
- Signed decision set: what action follows backlog rise, low coverage, or unit concentration
- Reporting cadence (daily ops vs monthly board) and viewing environment (desk / meeting / mobile)
- Business-signed eligibility and resolved-status rules (docs mark draft awaiting sign-off)

**Assessment limit:** without audience + decisions locked, scores for alignment and actionability remain capped at partial / non-compliant.

### Reasonable assumptions (not treated as facts)

Intended primary readers are senior managers / analytics leads at Behzisti reviewing Didban caseload. Frequency assumed ad-hoc web, not a fixed board pack. These assumptions inform recommendations only.

---

## C. Assessment scorecard

Scoring: **2** = Compliant · **1** = Partially compliant · **0** = Non-compliant · **N/A** = Not applicable

| ID | Criterion | Score | Evidence observed | Severity |
|----|-----------|-------|-------------------|----------|
| C1.01 | Clear business purpose | 1 | Docs state M1 analytical platform for volume/resolution/category/knowledge; page shows source/period but no decision-framed purpose statement. | High |
| C1.02 | Identified target audience | 1 | IA maps Executive/Analytics Mgr/Supervisor roles in docs; UI is one undifferentiated executive view with no audience label. | High |
| C1.03 | Audience-aligned metrics | 1 | Volume KPIs (A1–A3) and answer coverage (D1≈6.3%) are relevant; SLA unavailable, several `needs_rules`, technical SubjectClass labels. | Medium |
| C1.04 | Appropriate complexity | 1 | ~9 KPI cards + 6+ charts + insights on one page; header filters decorative (not wired to queries). | Medium |
| C1.05 | Clear business questions | 1 | Header subtitle lists breadth; page does not state 1–3 prioritized questions. | High |
| C1.06 | Decision support | 1 | Feasibility badges reduce misuse risk; drill-down is stub; insights often meta rather than decision prompts. | High |
| C1.07 | Clearly identifiable Big Idea | 0 | Competing messages: total volume, resolution proxies, coverage 6.3%, taxonomy charts—no one-sentence takeaway. | Critical |
| C1.08 | Information prioritization | 1 | KPIs first is good; equal visual weight across feasible/`needs_rules`/unavailable; “emerging growth” often 0 in API mode. | Medium |
| C1.09 | Appropriate exploratory/explanatory approach | 1 | Platform is hybrid by design; this page mixes monitoring charts with stub exploration without an explanatory headline. | Medium |
| C1.10 | Three-minute understanding | 1 | User can grasp volume + low answer coverage; harder to know trusted vs provisional KPIs and what to do next. | High |
| C1.11 | Logical information sequence | 1 | Volume→class→subjects→org→status→channel→coverage roughly coherent; insights placed last; resolution chart often empty. | Medium |
| C1.12 | Sufficient reporting context | 1 | Source, periodLabel, domain note, feasibility, answer caveat present; filters ≠ live period; eligibility/resolved rules unsigned. | High |
| C1.13 | Appropriate delivery environment | 1 | Confirmed: RTL Next.js web. Missing: meeting vs desk vs mobile requirements; export control is non-functional stub. | Low |
| C1.14 | Actionability of information | 0 | No owners, thresholds, or recommended next actions tied to deviations; KPI drawer restates value without action path. | High |

---

## D. Detailed findings (score &lt; 2)

### F-01 · C1.07 — No identifiable Big Idea

| | |
|--|--|
| **Severity** | Critical |
| **Location** | Entire first viewport (KPI grid + first charts) |
| **Current** | Many equal-weight cards (volume, resolution proxies, coverage, SLA dash) plus distribution charts. No concise statement of “what happened / what matters.” |
| **Why it violates Ch.1** | Without a Big Idea, the page is a metric inventory, not a communication artifact. |
| **Impact** | Executives spend cognitive load reassembling a story; risk of focusing on decorative or `needs_rules` metrics. |
| **Recommended change** | Add a one-line situation summary above KPIs, grounded only in live feasible facts, e.g.: “در کل دوره: حدود ۱۹۳هزار پرونده؛ پوشش پاسخ شهروند ≈۶٫۳٪؛ SLA قابل محاسبه نیست.” Refresh from API meta + KPIs. |
| **Expected result** | Three-minute takeaway without scanning every card. |

### F-02 · C1.12 / C1.06 — Context controls do not drive the story

| | |
|--|--|
| **Severity** | High |
| **Location** | Header filters (period / org / class) + periodLabel |
| **Current** | Selects default to “۳۰ روز اخیر” / “همه واحدها” but live executive data uses unfiltered historical aggregates (“کل دوره تاریخی فیلترنشده”). Export is stub. |
| **Why** | Chapter 1 requires enough context to interpret numbers; mismatched period is materially misleading. |
| **Impact** | Users may believe they are viewing 30 days while seeing all-history counts. |
| **Recommended change** | Either wire filters to API query params, **or** disable/hide them and show only the true `periodLabel` until wired. |

### F-03 · C1.01 / C1.02 / C1.05 — Purpose & audience not on the page

| | |
|--|--|
| **Severity** | High |
| **Location** | Header title/subtitle + missing purpose strip |
| **Current** | “نمای سازمانی پرونده‌ها، شکایات، عملکرد و پوشش دانش تاریخی” — broad, not a decision brief. Roles exist only in IA docs. |
| **Recommended change** | Add “برای چه کسی / برای چه تصمیم” strip (after stakeholder confirm). Until then, label page as “نمای مدیریتی حجم و پوشش دانش — provisional.” |

### F-04 · C1.14 — Low actionability

| | |
|--|--|
| **Severity** | High |
| **Location** | Insights panel + KPI drawer |
| **Current** | Insights emphasize live connection / validity absence; drawer restates value with stub drill-down copy. |
| **Recommended change** | Convert insights to decision prompts only where evidence exists (e.g. low answer coverage → link to `/knowledge/answers`). Do not invent operational owners until named by stakeholders. |

### F-05 · C1.08 / C1.04 — Weak prioritization & density

| | |
|--|--|
| **Severity** | Medium |
| **Current** | Equal KPI card chrome for unavailable SLA and `needs_rules` resolution vs feasible volume. Emerging-topic “growth” badges often show +۰٪ in API mode (not a real growth signal). |
| **Recommended change** | Primary row = feasible volume + D1 coverage only; secondary row = `needs_rules`; collapse unavailable; remove growth badge until YoY computed. |

### F-06 · C1.09 / C1.11 — Hybrid without explanatory spine

| | |
|--|--|
| **Severity** | Medium |
| **Current** | Sequence is analytically sensible but explanatory “so what” arrives last. Resolution status chart frequently empty while occupying a full card. |
| **Recommended change** | Move Big Idea + 2–3 primary KPIs + volume trend first; demote empty/status charts; keep exploration links to Requests / Categories / Topics pages. |

### F-07 · C1.13 — Delivery assumptions incomplete

| | |
|--|--|
| **Severity** | Low |
| **Current** | Web RTL confirmed; meeting/mobile/print needs unstated. |
| **Recommended change** | Document intended desk-browser use explicitly in product brief. Do not redesign for mobile until requirements exist. |

---

## E. Recommended dashboard structure

Tuned for **explanatory executive monitoring** with links out for exploration — not a full redesign of platform IA.

| Order | Block | Why |
|-------|--------|-----|
| 1 | Context strip: audience · true period · data source · ruleSet | Establish Ch.1 context before numbers |
| 2 | Big Idea sentence (feasible facts only) | Three-minute story headline |
| 3 | Primary KPIs: A1 volume, A2 complaints, D1 answer coverage (+ SLA as unavailable badge only) | Prioritize decision-relevant feasible metrics |
| 4 | Volume trend (monthly live series) | Explain direction of the Big Idea |
| 5 | SubjectClass + top subjects | Where volume concentrates |
| 6 | Answer coverage caveat + link to `/knowledge/answers` | Validity-aware knowledge without overclaim |
| 7 | Secondary: channel / department / `needs_rules` resolution | Support, not compete with primary story |
| 8 | Actionable insights (evidence-tied) + links to deep pages | Decision support without fake NLP claims |

---

## F. Prioritized improvement plan

### 1. Must fix

1. Wire or disable header period/org/class filters; never mismatch `periodLabel`.
2. Add Big Idea line from live feasible KPIs only.
3. Stop showing fake emerging growth when growth is not computed.

### 2. Should improve

1. Reprioritize KPI rows (feasible → `needs_rules` → unavailable).
2. Move insights up; demote empty resolution chart.
3. Stakeholder-confirm audience + 2–3 decisions this page supports.

### 3. Optional enhancements

1. Role-based KPI subsets after IA roles are productized.
2. Real export once period filters work.
3. Align vision title language Social Security → Behzisti.

---

## G. Final verdict

**Partially meets Chapter 1 principles.**

Until must-fix items land, the page remains a capable **analytical inventory** rather than a context-complete executive communication.

---

## Remediations applied (post-audit)

| Finding | Change shipped |
|---------|----------------|
| F-01 Big Idea | Context strip + `bigIdea` sentence from feasible KPIs only |
| F-02 Filter/period mismatch | Period + SubjectClass filters wired to API query params; default period = **all**; org filter disabled; export disabled |
| F-03 Purpose/audience | Header subtitle + on-page audience provisional label |
| F-04 Actionability | Evidence-tied insights + links to answers/categories/KPI pages |
| F-05 Prioritization | Feasible KPIs primary row; needs_rules/unavailable secondary; fake growth badges removed |
| F-06 Sequence | Insights moved above secondary charts; empty resolution chart demoted |

Re-score after stakeholder sign-off on audience/decisions (C1.02 / C1.05 / C1.14 remain limited by missing business confirmation).

---

## Method notes

- Scores use observed UI / code / docs only.
- No claims about statistical accuracy of Didban beyond previously verified live API reads.
- Later *Storytelling with Data* chapters (clutter, focus, etc.) are intentionally excluded from this scorecard.
- Companion canvas (optional UI view): `ch1-context-executive-dashboard-audit.canvas.tsx`
