# BI Dashboard Assessment — Chapter 6: Dissecting Model Visuals

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.6 |
| Chapter | 6 — Dissecting Model Visuals |
| Scope | Executive Dashboard `/` (primary); chart suite vs five model types |
| Date | 2026-11-11 |
| Baseline | After Ch.1–5 remediations |
| Method | Live UI + `ExecutiveDashboard` ECharts options; do not invent forecasts/stacks |
| Verdict (pre-fix) | **Needs improvement** |
| Score (pre-fix, applicable only) | **11 / 16** → **69%** on 8 applicable criteria |
| Score note | 12 criteria **N/A** (no forecast; no 100% / ± / horizontal *stacked* bars — and not required for current questions) |

| Metric | Count |
|--------|------:|
| Criteria in checklist | 20 |
| Applicable | 8 |
| N/A | 12 |
| Score 0 | 1 |
| Score 1 | 3 |
| Score 2 | 4 |

---

## Section 1 — Executive summary

**Overall (pre-fix):** 69% on applicable criteria — Needs improvement. Charts that exist are mostly the right *type*; they under-deliver on **message-on-the-graph** (annotation, series emphasis, direct labels) relative to Ch.6 models.

**Three strongest visualizations**

1. Volume **line** for monthly trend (correct continuous-time use).
2. Sorted **horizontal bars** for SubjectClass / subjects / channels / departments.
3. Coverage as **simple text** (avoids fake gauge / unnecessary stack).

**Three most important weaknesses (pre-fix)**

1. Volume lines equal weight; legend-only; no takeaway on the plot.
2. Bar magnitudes tooltip-only; no highlighted top category.
3. No forecast visuals — correct absence, but must not be confused with “incomplete model coverage.”

**Interpretation risk:** Low for axis scale (zero baseline). Medium for viewers missing the latest-month change without annotation.

---

## Section 2 — Line graph assessment

| Item | Finding |
|------|---------|
| Purpose | روند حجم پرونده و شکایت — monthly volume |
| Suitability | Appropriate (model #1 family) |
| Chronology | Category axis from API trend points in time order (**confirmed** in live series labels) |
| Scale | `min: 0`; unit implied as count |
| Series | دو خط — distinguishable by color; pre-fix equal weight |
| Labels | Pre-fix: bottom legend |
| Annotations | Pre-fix: none on plot |

**Corrections applied:** thicker primary line (کل پرونده), thinner amber شکایت, end labels, markPoint on latest total, insight subtitle with MoM delta. Explicit “بدون پیش‌بینی” in subtitle.

---

## Section 3 — Forecast visualization assessment

**No forecast series on the executive dashboard** (or elsewhere in live scope). Historical volume only.

| Topic | Status |
|-------|--------|
| Actual vs forecast distinction | N/A — no forecast |
| Boundary / horizon / uncertainty / assumptions | N/A |
| Risk of presenting forecasts as certain | None observed |

**Do not invent** forecast bands. If product later adds projection, follow model #2 (dashed/distinct style + labeled boundary + non-guarantee wording).

---

## Section 4 — 100% stacked bar assessment

**Not used.** Composition questions today use ranking bars or KPI text. Absolute volumes matter for executives — avoiding 100% stacks that hide totals is appropriate.

All C6.11–C6.15 → **N/A**.

---

## Section 5 — Positive and negative stacked bar assessment

**Not used.** No signed contribution / variance waterfall on `/`.

C6.16–C6.18 → **N/A**.

---

## Section 6 — Horizontal stacked bar assessment

**Horizontal bars are present but not stacked** (single measure per category). Model #5’s stacked composition lessons therefore **N/A**.

Simple horizontal bars: sorted, Persian labels, zero baseline — sound. Pre-fix gap: no max highlight / value label (addressed in remediation).

C6.19 → **N/A** (stacked form absent; not required).

---

## Section 7 — Detailed checklist results

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C6.01 | Visual matches analytical task | 2 | Line=trend; h-bars=rank; text=coverage | Keep | — |
| C6.02 | Clear chart message | 1 | Big Idea on page; chart titles topical pre-fix | Insight subtitle + annotation on volume | High |
| C6.03 | Appropriate line graph use | 2 | Monthly continuous trend | Keep | — |
| C6.04 | Chronological ordering | 2 | Time labels left→right in series | Keep; guard API sort | — |
| C6.05 | Line readability | 1 | Two colors OK; equal weight pre-fix | Emphasize primary series | High |
| C6.06 | Forecast distinction | N/A | No forecast | Do not invent | — |
| C6.07 | Forecast boundary | N/A | No forecast | — | — |
| C6.08 | Forecast uncertainty | N/A | No forecast | — | — |
| C6.09 | Forecast context | N/A | No forecast | — | — |
| C6.10 | Meaningful annotations | 0 | No on-graph callouts pre-fix | Annotate latest point + MoM subtitle | Critical |
| C6.11 | Appropriate 100% stacked bars | N/A | Not used; not needed | Keep absolute bars/KPIs | — |
| C6.12 | Percentage accuracy | N/A | No 100% stacks | — | — |
| C6.13 | Consistent segment ordering | N/A | No stacked segments | — | — |
| C6.14 | Composition readability | N/A | No 100% stacks | — | — |
| C6.15 | Absolute-total awareness | N/A | No 100% stacks | — | — |
| C6.16 | Positive/negative baseline | N/A | No diverging stacks | — | — |
| C6.17 | Correct sign representation | N/A | No diverging stacks | — | — |
| C6.18 | Clear direction and magnitude | N/A | No diverging stacks | — | — |
| C6.19 | Horizontal stacked bar readability | N/A | H-bars are non-stacked | Optional later if composition-by-group needed | — |
| C6.20 | Consistent visual encoding | 1 | Shared bar helper; line one-off; English SubjectClass title | Shared highlight + Persian titles | Medium |

**Pre-fix math:** 11 points / (2×8) = **68.75% ≈ 69%**.

---

## Section 8 — Prioritized remediation plan

| Priority | Severity | Component | Problem | Recommended change | Benefit | Criteria |
|----------|----------|-----------|---------|--------------------|---------|----------|
| 1 | Critical | Volume line | No annotation | Latest-point mark + MoM insight subtitle | Takeaway on the graph | C6.10, C6.02 |
| 2 | High | Volume series | Equal weight / legend | Thicker کل پرونده; thinner شکایت; end labels | Model #1 readability | C6.05 |
| 3 | Medium | Horizontal bars | Peer bars; tooltip-only values | Amber highlight + label on max | Faster rank read | C6.02, C6.20 |
| 4 | Medium | Titles | Topic / English tokens | Persian insight-oriented subtitles | Clearer message | C6.02, C6.20 |
| 5 | — | Forecast / stacks | Absent | **Do not add** without business need | Avoid false model-completeness | N/A set |

---

## Section 9 — Final verdict

| | |
|--|--|
| **Pre-fix score** | **69%** (11/16 applicable) |
| **Pass Ch.6?** | **No** (annotation gap) until remediations |
| **Most important correction** | Annotate volume trend (latest point + MoM context) |
| **Chart-specific** | Emphasize primary line + end labels |
| **Extra testing** | Confirm API volume points remain chronological under all period filters |

Forecast/stacked criteria are N/A — absence is not a failure when those chart types are not required.

---

## Remediations

_Status: applied 2026-11-11 — Chapter 6 model-visual execution fixes._

| # | Change | Files | Criteria |
|---|--------|-------|----------|
| 1 | Volume insight subtitle (MoM delta) + «بدون پیش‌بینی» | `ExecutiveDashboard.tsx` | C6.02, C6.10 |
| 2 | Primary line thicker; شکایت thinner; end labels; latest markPoint value | `ExecutiveDashboard.tsx` | C6.05, C6.10 |
| 3 | Horizontal bars: amber max + value label on max; wider right grid | `ExecutiveDashboard.tsx` | C6.02, C6.20 |
| 4 | Persian titles/subtitles for طبقه / موضوعات | `ExecutiveDashboard.tsx` | C6.20 |

**Not added (intentional):** forecast series; 100% or ± stacked bars.
