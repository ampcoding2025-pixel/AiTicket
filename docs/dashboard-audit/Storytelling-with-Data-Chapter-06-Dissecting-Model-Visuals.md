# BI Dashboard Assessment — Chapter 6: Dissecting Model Visuals

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.6 |
| Chapter | 6 — Dissecting Model Visuals |
| Scope | Executive Dashboard `/` chart suite (primary); design choices measured against Ch.6 model lessons (line, annotated line, stacked / horizontal bars) |
| Date | 2026-11-11 |
| Baseline | After Ch.1–5 remediations (context, chart family, declutter, attention, designer/a11y) |
| Method | Live UI + `ExecutiveDashboard` / ECharts option code; compare each visual to Ch.6 model design *choices* (not copy the book’s datasets) |
| Inspection limit | No forecast series in product; stacked-bar models only partially applicable; no formal eye-tracking |
| Verdict | **Partially meets** Chapter 6 — **Needs improvement** |
| Score | **24 / 40** → **60%** |

| Metric | Count |
|--------|------:|
| Criteria evaluated | 20 |
| N/A | 0 |
| Score 0 | 1 |
| Score 1 | 14 |
| Score 2 | 5 |

Chapter 6 studies five model visuals and extracts recurring design decisions. This audit asks: **do our executive visuals make those same kinds of choices?** It does not re-score Ch.2 chart-type catalogs, Ch.3 clutter volume, Ch.4 page hierarchy, or Ch.5 controls—except where a model lesson is about the graph itself.

---

## Section 1 — Executive summary

**Overall:** 60% — Needs improvement. After Ch.2–4, the executive page uses the right *families* (lines for trend; horizontal bars for ranked categories; simple text for coverage). It still falls short of Ch.6 **model quality**: graphs rarely carry an on-chart takeaway, series are peer-weighted (no emphasized line), bars hide values in tooltips only, and there is no annotated “so what” on the volume trend comparable to the book’s annotated line models.

**Three strongest aspects**

1. Volume trend is a **clean dual line** (`smooth: false`, no area fill) with baseline 0 — closer to model #1 than earlier smooth/area versions.
2. Category charts are **sorted horizontal bars** with truncated Persian labels — aligned with model #5 thinking (horizontal encoding for long category names).
3. Page-level Big Idea + attention strip supply narrative *above* charts (partial substitute for graph annotation).

**Three most important weaknesses**

1. **No on-graph annotation** on the key line chart (model #2 lesson) — peaks, complaint share shifts, or coverage linkage are not labeled on the plot.
2. **Equal visual weight** for “کل پرونده” and “شکایت” — model lines typically thicken/color the series that carries the point.
3. **Values via tooltip only** on bars — model bars often show key values or direct labels for the insight category.

**Closest model match today:** Model #1 (line) and Model #5 (horizontal bars) in structure. **Farthest:** Model #2 (annotated line + forecast) — no annotations, no forecast band.

---

## Section 2 — Mapping to Chapter 6 model visuals

| Model (book) | Intent of the model | Closest AiTicket visual | Fit |
|--------------|---------------------|-------------------------|-----|
| #1 Line graph | Clear trend comparison; restrained styling | روند حجم پرونده و شکایت | Partial — type OK; emphasis/labels weaker |
| #2 Annotated line + forecast | Call out *what changed* and forward look | Volume trend | Weak — no annotations; no forecast (N/A product) |
| #3 100% stacked bars | Part-to-whole over categories/time | — | Not used on executive (OK after Ch.2 killed donuts); FinishTime is two big numbers, not stacked % |
| #4 +/- stacked bars | Deviation / opposing components | — | Not present; no signed deviation story |
| #5 Horizontal stacked / horizontal bars | Long labels; composition or ranking | SubjectClass, subjects, channels, departments | Partial — horizontal + sorted ranking yes; stacked composition no |

---

## Section 3 — Design-choice assessment (cross-cutting)

### Graph type & ordering

- Line for monthly volume: **appropriate**.
- Horizontal bars sorted ascending (small→large bottom-up in ECharts category axis): **supports comparison**.
- Channel “top 8 + سایر”: **good ordering hygiene**.

### Emphasis / de-emphasis

- Brand teal + amber on the two lines — amber draws the eye to شکایت, which can help, but **neither line is annotated as the takeaway**.
- All category bars same teal — ranking by length only; **no highlight of top subject or exception category**.
- Coverage exception uses amber in KPI strip (page-level), not echoed on a related chart.

### Alignment & positioning

- Shared ChartCard title/subtitle pattern — consistent.
- Volume chart spans 2/3 width beside SubjectClass — reasonable primary/secondary mass.
- Legend at bottom of volume chart — usable; **direct end-of-line labels** (model preference) not used.

### Words on the graph

- Chart titles describe *content* (“روند حجم…”) more than *insight* (“شکایت هم‌مسیر کل حجم مانده / پوشش جداگانه خطر است”).
- Big Idea and «توجه» sit above KPIs, **not anchored to a point on the line**.
- Bar labels: category names on axis; **magnitudes tooltip-only** (Ch.3 declutter tradeoff that Ch.6 models often reverse for the key number).

---

## Section 4 — Visual-by-visual notes

| ID | Visual | Model lesson gaps | Severity |
|----|--------|-------------------|----------|
| V-line | Volume trend (2 lines) | No callout at recent peak/trough; legend not direct labels; equal series weight | High |
| V-class | SubjectClass bars | Title still English token; no “سهم شکایت” callout on bar | Medium |
| V-subject | Top subjects | No highlight of #1 subject; values tooltip-only | Medium |
| V-channel | Channels | Same as subjects | Low–Medium |
| V-org | Departments | Same; long labels truncated — OK | Low |
| V-coverage | Text % + caveat | Matches “simple text” better than a fake gauge — strong vs models that over-chart | — |
| V-finish | Finish/open numbers | Readable; not a stacked model; caveat present | Low |

---

## Section 5 — Detailed checklist results

Scoring: **2** fully meets model-style choice · **1** partial · **0** not met. Criteria focus on Ch.6 dissection lessons.

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C6.01 | Graph type matches the point | 2 | Line for trend; h-bars for categories; text for coverage | Keep | — |
| C6.02 | Data ordered to aid comparison | 2 | Bars sorted by value; channel top-N + other | Keep | — |
| C6.03 | Primary series visually emphasized | 1 | Amber on شکایت helps slightly; no explicit “focus series” weight/annotation | Thicken + annotate the series that supports Big Idea | High |
| C6.04 | Non-essential series de-emphasized | 1 | Only two series — OK; gridlines light — OK; legend competes | Prefer end labels; mute grid further if annotating | Low |
| C6.05 | Color used to mean something | 1 | Teal brand + amber second series; not tied to a written takeaway on-chart | Tie amber to annotated insight (“شکایت”) | Medium |
| C6.06 | Line weight / size hierarchy on chart | 0 | Both lines default weight; `showSymbol: false` | Emphasize one line; optional last-point marker | High |
| C6.07 | Direct labels over legends where practical | 1 | Bottom legend on volume; bars use axis names | End-of-line labels for دو سری | Medium |
| C6.08 | On-graph annotation of the takeaway | 1 | Page Big Idea exists; **plot has no annotation** | Annotate 1–2 points or a band note on volume chart | Critical |
| C6.09 | Title states the finding (not just topic) | 1 | Titles are descriptive topics | Optional insight subtitle under volume title | High |
| C6.10 | Axis baselines honest (bars/lines from 0) | 2 | `min: 0` on value axes | Keep | — |
| C6.11 | Alignment of chart elements | 2 | Consistent ChartCard / grid padding | Keep | — |
| C6.12 | Positioning guides reading order | 1 | Volume before actions good; coverage detail late | Optional spark annotation linking coverage story to trend section | Medium |
| C6.13 | Key values visible without hover | 1 | KPIs yes; bar magnitudes tooltip-only | Show value on top 1–3 bars or top category only | Medium |
| C6.14 | Forecast / scenario treatment (if any) | 1 | No forecast — acceptable; don’t invent | If planning projection later, use model #2 style band + note | Low |
| C6.15 | Stacked composition used only when needed | 2 | No decorative 100% stacks; FinishTime is explicit counts | Keep avoiding vanity stacks | — |
| C6.16 | Horizontal layout for long labels | 2 | Persian category names on y-axis | Keep; watch truncation width | — |
| C6.17 | Visual supports a single primary message | 1 | Big Idea is single; charts still “gallery” of equal peers | One annotated hero chart tied to Big Idea | High |
| C6.18 | De-emphasized chrome inside plot | 1 | Light split lines; no chart border clutter beyond card | Acceptable; avoid adding markers everywhere | Low |
| C6.19 | Consistency of model choices across charts | 1 | Shared bar helper; line is one-off | Extract shared emphasis helpers (highlight category id) | Medium |
| C6.20 | Visual would pass a “model dissection” walkthrough | 1 | Solid basics; missing annotation + emphasis craft of Ch.6 examples | Implement remediation #1–3 | High |

**Points:** (5×2) + (14×1) + (1×0) = 10 + 14 + 0 = **24 / 40 = 60%**

---

## Section 6 — Prioritized remediation plan

| Priority | Severity | Component | Problem | Recommended change | Expected benefit | Criteria |
|----------|----------|-----------|---------|--------------------|------------------|----------|
| 1 | Critical | Volume line | No on-chart takeaway | Add 1 annotation (e.g. recent period note) or insight subtitle under title derived from Big Idea fragment | Matches model #2 lesson without fake forecast | C6.08, C6.09, C6.17 |
| 2 | High | Volume series | Equal line weight | Emphasize primary series (thicker brand line *or* amber شکایت if that’s the point); mute the other | Eyes land on the story series | C6.03, C6.06 |
| 3 | High | Volume labels | Legend-only | Direct end labels «کل پرونده» / «شکایت» | Faster read, less legend hunting | C6.07 |
| 4 | Medium | Horizontal bars | All peers; values hidden | Highlight top category; optional label on max bar | Model-like emphasis | C6.05, C6.13 |
| 5 | Medium | Chart titles | Topic titles | Insight-oriented subtitle on hero chart only | Ties graph to Big Idea | C6.09 |
| 6 | Low | FinishTime / stacks | — | Do **not** add 100% stack for decoration | Preserve Ch.2/Ch.6 honesty | C6.15 |
| 7 | Low | Forecast | Absent | Only if product asks — annotated band, never silent extrapolation | Model #2 fidelity | C6.14 |

Do **not** rebuild unrelated pages to look like the book’s Excel models. Apply lessons to the **hero volume chart** first.

---

## Section 7 — Final verdict

| | |
|--|--|
| **Score** | **60%** (24/40) |
| **Assessment** | Needs improvement — structure echoes models #1 and #5; craft of emphasis + annotation (models #1–2) is incomplete |
| **Pass Ch.6 model-visual test?** | **No** — a dissection walkthrough would still ask “where is the takeaway on the graph?” |
| **Implement first** | Annotate / subtitle the volume trend and emphasize one series |
| **Do not do** | Invent forecast; reintroduce pies/100% stacks for polish |

Ch.1–5 topics referenced only where they affect whether a visual behaves like a Ch.6 model (e.g. declutter removing labels that models would put back strategically).

---

## Remediations

_Status: audit only — implementation not yet applied._
