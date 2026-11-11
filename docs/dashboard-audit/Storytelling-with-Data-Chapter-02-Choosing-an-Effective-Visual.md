# BI Dashboard Assessment — Chapter 2: Choosing an Effective Visual

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic (2015), Ch.2 pp. 35–69 |
| Chapter | 2 — Choosing an Effective Visual |
| Scope | Executive Dashboard (`داشبورد مدیریتی`, `/`) — post Chapter 1 remediation |
| Date | 2026-11-11 |
| Method | Code/UI inventory of chart types and encodings; no claim about raw Didban accuracy beyond known live fields |
| Verdict | **Partially meets** Chapter 2 principles |
| Score | **16 / 24** applicable points → **67%** (Needs improvement) |

Scoring key: **2** compliant · **1** partial · **0** non-compliant · **N/A** not present / not applicable.

---

## Section 1 — Executive summary

Overall Chapter 2 compliance is **Needs improvement (67%)**.

| Count | Result |
|------:|--------|
| Visualizations assessed | **13** |
| Largely appropriate | **6** (V01, V06, V07, V08, V11, V13) |
| Partially appropriate | **5** (V02, V03, V04, V09, V12) |
| Poor chart–purpose fit | **2** (V05 SubjectClass donut, V10 Channel donut) |

**Main strengths**

- Time series for volume uses a **line chart** (correct family).
- Long Persian category labels use **horizontal bars** for subjects and departments.
- Big Idea and KPI cards use **simple text** rather than charts for single numbers.
- No 3D charts and no secondary Y-axis.

**Most important weaknesses**

1. **Three part-to-whole pies/donuts** (SubjectClass, Channel, FinishTime status) for categorical *comparison* — sorted horizontal bars are clearer (High).
2. **Coverage gauge** encodes one percentage — simple large text (already partly duplicated below the gauge) is enough (Medium).
3. **KPI delta arrows** show `0%` with an “up” trend when no real period-over-period delta is supplied — visually invents improvement (High / near-Critical for trust).
4. Volume line uses **smooth + area fill** on total series — mild distortion / dual encoding (Low–Medium).

---

## Section 2 — Visualization inventory

| Visual ID | Dashboard section | Visualization type | Business purpose | Assessment |
|-----------|-------------------|--------------------|------------------|------------|
| V01 | Context strip | Simple text (Big Idea) | One-sentence situation summary | Compliant |
| V02 | Primary KPI row | KPI cards | Spotlight feasible volume/coverage metrics | Partial |
| V03 | Secondary KPI row | KPI cards | Show needs_rules / unavailable metrics | Partial |
| V04 | Volume trend | Line (+ area under total) | Trend of cases & complaints over months | Partial |
| V05 | SubjectClass | Donut / pie | Share of request classes | Non-compliant fit |
| V06 | Actions / insights | Text cards + links | Point to next decisions | Compliant |
| V07 | Top subjects | Ranked list | Precise ranked counts | Compliant |
| V08 | Top subjects (chart) | Horizontal bar | Compare subject volumes | Compliant |
| V09 | Answer coverage | Gauge + text | Single % availability | Partial |
| V10 | CookieChannel | Donut / pie | Compare intake channels | Non-compliant fit |
| V11 | Departments | Horizontal bar | Compare unit volumes | Compliant |
| V12 | FinishTime open/closed | Pie | Composition of finished vs open | Partial |
| V13 | KPI drawer | Simple text | Inspect one KPI value | Compliant |

---

## Section 3 — Detailed visualization audit

### V01 — Big Idea text

| | |
|--|--|
| **Type** | Simple text |
| **Purpose** | Communicate the period story in one sentence |
| **Data** | Derived from feasible KPIs (counts, complaint share, coverage, SLA unavailable) |
| **Score** | 2 |
| **Problems** | None material for Ch.2 |
| **Recommendation** | Keep |
| **Severity** | — |

### V02 / V03 — KPI cards

| | |
|--|--|
| **Type** | Simple text / KPI cards |
| **Purpose** | Present key measures with feasibility honesty |
| **Data** | Cookie aggregates; units count / percent / days |
| **Score** | 1 |
| **Problems** | (1) When `deltaPercent` is null/0, UI still shows a green up-arrow and `۰٪` — implies change that was not measured. (2) Period unit is on the page strip, not repeated on each card. (3) Secondary row still uses full card chrome for `—` unavailable SLA. |
| **Why ineffective** | Chapter 2 prefers simple text for one/two numbers — cards are fine, but **misleading comparison glyphs** violate effective visual communication. |
| **Recommendation** | Hide delta entirely unless a real prior-period value exists; show unit + period under value; for unavailable, use a compact text row instead of a fake gauge-like card. |
| **Severity** | High |

### V04 — Volume trend (line + area)

| | |
|--|--|
| **Type** | Line chart (total with areaStyle; complaints as line) |
| **Purpose** | How volume and complaints move over time |
| **Data** | Monthly `CookieTime` counts + complaint counts |
| **Score** | 1 (suitability 2 for family; execution partial) |
| **Problems** | Smoothing can hide sharp monthly jumps; area fill emphasizes total magnitude but can distract from dual-series comparison; ~80 monthly points can get dense on small widths. |
| **Recommendation** | Keep line chart; remove smooth (or make optional); drop area fill or use it only in a single-series view; consider brushing/zoom for long history. |
| **Severity** | Medium |

### V05 — SubjectClass donut

| | |
|--|--|
| **Type** | Donut / pie |
| **Purpose** | Compare shares of شکایت / راهنمایی / گزارش / پیشنهاد |
| **Data** | Named counts by `SubjectClass` |
| **Score** | 0 |
| **Problems** | Task is **category comparison**, not a single “part of whole” storytelling moment; angle comparisons are harder than bar lengths; labels without % on slice. |
| **Recommendation** | **Sorted horizontal bar** (absolute counts) + optional % labels; or 100% stacked bar only if the question is strictly composition. |
| **Severity** | High |

### V06 — Insight / action cards

| | |
|--|--|
| **Type** | Text |
| **Purpose** | Direct attention to next steps |
| **Score** | 2 |
| **Recommendation** | Keep (not a chart-selection issue) |
| **Severity** | — |

### V07 — Ranked subject list

| | |
|--|--|
| **Type** | Ranked list (table-like) |
| **Purpose** | Precise top subjects with counts |
| **Score** | 2 |
| **Note** | Appropriate where exact values matter; aligns with Ch.2 table guidance for precision. |
| **Severity** | — |

### V08 — Subject volume horizontal bars

| | |
|--|--|
| **Type** | Horizontal bar |
| **Purpose** | Compare category magnitudes |
| **Score** | 2 |
| **Note** | Good choice for long Persian labels; baseline at zero (ECharts value axis). Truncation of labels is a readability risk (Medium if names collide). |
| **Severity** | Low |

### V09 — Answer coverage gauge

| | |
|--|--|
| **Type** | Gauge + duplicate text |
| **Purpose** | Show historical reply availability % |
| **Data** | One measure 0–100 |
| **Score** | 1 |
| **Problems** | Gauge is decorative for a single number already expressible as text; implies a “speed/dial” metaphor not asked by the business question; duplicates the percent under the chart. |
| **Recommendation** | **Simple large text** (e.g. `۶٫۳٪`) with caveat; optional bullet vs 100% as a thin progress bar if a visual is required — not a radial gauge. |
| **Severity** | Medium |

### V10 — Channel donut

| | |
|--|--|
| **Type** | Donut / pie |
| **Purpose** | Compare intake channels |
| **Score** | 0 |
| **Problems** | Same as V05; channel cardinality can exceed comfortable pie limits; hard to compare mid-size slices. |
| **Recommendation** | Horizontal bar sorted by volume (Top N + “سایر” if needed). |
| **Severity** | High |

### V11 — Department horizontal bars

| | |
|--|--|
| **Type** | Horizontal bar |
| **Purpose** | Compare unit **volume** (not scored performance) |
| **Score** | 2 |
| **Note** | Subtitle correctly warns this is volume — good to avoid causal misread. |
| **Severity** | — |

### V12 — FinishTime open/closed pie

| | |
|--|--|
| **Type** | Pie |
| **Purpose** | Composition finished vs unfinished |
| **Data** | Two aggregates from KPI ids `resolved` / `unresolved` (FinishTime proxy) |
| **Score** | 1 |
| **Problems** | Only two categories — pie is usable but **two big numbers or a single 100% stacked bar / progress** is clearer; still marked needs_rules so visual authority is overstated if pie looks “final.” |
| **Recommendation** | Two KPI-style numbers side by side, or one horizontal 100% stacked bar with clear needs_rules badge. |
| **Severity** | Medium |

### V13 — KPI detail drawer

| | |
|--|--|
| **Type** | Simple text |
| **Score** | 2 |
| **Recommendation** | Keep |
| **Severity** | — |

---

## Section 4 — Formal checklist

| ID | Criterion | Score | Evidence | Severity |
|----|-----------|------:|----------|----------|
| C2.01 | Visual appropriateness | 1 | Strong bars/lines mixed with weak pies/gauge | High |
| C2.02 | Visual simplicity | 1 | Multiple encodings (donut, gauge, area+line) for similar compare tasks | Medium |
| C2.03 | KPI presentation | 1 | Values clear; fake 0% delta arrows; unit/period not on every card | High |
| C2.04 | Table appropriateness | N/A | No formal data grid; ranked list assessed under V07 | — |
| C2.05 | Table readability | N/A | — | — |
| C2.06 | Heatmap suitability | N/A | No heatmap | — |
| C2.07 | Color scale | N/A | No sequential/diverging quantitative color scale; pie colors categorical only | — |
| C2.08 | Scatter plot suitability | N/A | No scatter | — |
| C2.09 | Axis correctness | 1 | Time categories chronological; bar value axes OK; truncated Y labels | Low |
| C2.10 | Line chart suitability | 2 | Volume over months is a correct line use | — |
| C2.11 | Time-series integrity | 1 | Ordered months from API; smooth may distort; long series density | Medium |
| C2.12 | Slopegraph suitability | N/A | No slopegraph | — |
| C2.13 | Bar chart suitability | 2 | Horizontal bars for subjects/org fit purpose | — |
| C2.14 | Bar chart baseline | 2 | Value axes start at 0 by default | — |
| C2.15 | Stacked bar suitability | N/A | None | — |
| C2.16 | Waterfall correctness | N/A | None | — |
| C2.17 | Area chart suitability | 1 | Area under total line is secondary/decorative | Low |
| C2.18 | Pie and donut usage | 0 | Three pies used for category comparison (V05, V10, V12) | High |
| C2.19 | 3D visualization | 2 | None present (compliant) | — |
| C2.20 | Secondary axis usage | 2 | None present (compliant) | — |

**Calculation:** Applicable criteria = 12 (exclude 8× N/A). Earned = 16. Max = 24. **Score = 67%.**

Interpretation band: **60–74% Needs improvement.**

---

## Section 5 — Visualization replacement recommendations

| Current | Proposed | Reason | Advantages | Possible loss |
|---------|----------|--------|------------|---------------|
| V05 SubjectClass donut | Sorted horizontal bar (+ % annotation) | Compare classes by magnitude | Shared baseline; easier ranking | Instant “part-of-whole” look — add % labels |
| V10 Channel donut | Sorted horizontal bar (Top N + Other) | Many categories | Readable labels; stable order | Compact circular footprint |
| V12 FinishTime pie | Two big numbers or 100% stacked bar | Only 2 parts; needs_rules | Clearer; less “final” authority | Pie familiarity |
| V09 Coverage gauge | Large text % (+ optional thin bar) | Single number | Faster cognition; less chrome | Decorative dial |
| V04 Line+area+smooth | Straight dual line, no area | Trend integrity | Honest month-to-month shape | Soft aesthetic |
| V02/V03 delta chip | Show delta only when computed | Avoid false trend | Trust | None if no delta exists |
| V07 list + V08 bars | Keep one primary (bars) OR list | Redundant subject encoding | Less duplication | Slightly less precision if list removed — keep tooltip values on bars |

---

## Section 6 — Priority improvement plan

### 1. Critical fixes

- None that mathematically invert totals; closest trust issue is **fake KPI deltas** — treat as **Critical-for-trust / High** and remove immediately.

### 2. High-priority improvements

1. Replace SubjectClass and Channel donuts with **sorted horizontal bars**.
2. Remove or gate KPI delta arrows unless prior-period delta is real.
3. Replace FinishTime pie with **two numbers** or a single 100% stacked bar + needs_rules badge.

### 3. Medium-priority improvements

1. Replace coverage gauge with simple text (keep caveat).
2. Remove line smoothing and area fill on volume trend.
3. Deduplicate subject list vs subject bars (pick one primary visual).

### 4. Optional refinements

1. Zoom/brush on long monthly history.
2. Show units and period under each KPI value.
3. Compact unavailable metrics as text, not full cards.

---

## Section 7 — Final verdict

**Partially meets Chapter 2 principles.**

The dashboard already chooses **good families** for time (line) and long-label categories (horizontal bars), and uses **simple text** for the Big Idea and many KPIs. It falls short where **pies/donuts and a gauge** are used for tasks that Chapter 2 steers toward bars or plain numbers, and where **non-existent deltas** are visualized as trends.

No Chapter 3+ clutter/focus criteria were scored here.

---

## Remediations applied (2026-11-11)

| Finding | Change shipped |
|---------|----------------|
| V05 / V10 pies | SubjectClass & Channel → sorted horizontal bars (Top N + سایر for channels) |
| V12 FinishTime pie | Two big numbers + 100% stacked bar; needs_rules subtitle kept |
| V09 Coverage gauge | Large text % + thin progress bar + caveat |
| V04 Line+area+smooth | Dual straight lines, `min: 0`, no area fill |
| V02/V03 fake deltas | Delta chip only when `deltaPercent` is a real number; else «بدون مقایسه دوره قبل» |
| V07+V08 duplication | Single subject horizontal bar chart |
| Unavailable KPIs | Compact dashed rows instead of full cards |
| KPI context | Unit + periodLabel under primary values |

Re-score target after UI refresh: expect C2.03 / C2.18 / C2.17 to move toward compliant.
