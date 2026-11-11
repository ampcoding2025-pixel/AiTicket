# BI Dashboard Assessment — Chapter 9: Case Studies

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.9 (practical adaptation) |
| Chapter | 9 — Case Studies (dark color, animation, ordering, spaghetti, pies) |
| Scope | Executive `/` + live drill pages `/analytics/requests`, `/knowledge/answers`, `/performance/kpi` (code + UI); other pages sampled via chart config |
| Date | 2026-11-11 |
| Baseline | After Ch.1–8 work on executive narrative |
| Method | Live Next.js UI + source chart options; ECharts default motion noted |
| Verdict | **Needs improvement** — executive page strong; residual **pies** and cross-page color/order inconsistencies |
| Score | **21 / 30** applicable → **70%** |

| Metric | Count |
|--------|------:|
| Total criteria | 20 |
| Applicable | 15 |
| N/A | 5 |
| Score 0 | 1 |
| Score 1 | 7 |
| Score 2 | 7 |

N/A set: **C9.02, C9.04** (no dark theme), **C9.05, C9.06** (no purposeful story animation to control), **C9.15** (no overcrowded multi-series line requiring alternatives).

---

## Section 1 — Executive summary

**Overall:** 70% — Needs improvement.

The **executive dashboard** already embodies most Ch.9 lessons that apply: light readable canvas, no dark-theme contrast risk, chronological volume line with **two** emphasized series (not spaghetti), sorted horizontal bars instead of pies, and no decorative story animation.

The product still fails the chapter’s pie case study on **drill pages**: `/analytics/requests`, `/knowledge/answers`, and `/performance/kpi` still ship **donut/pie** charts for category or composition views that are easier as sorted bars.

**Three strongest design decisions**

1. Light canvas (`#f4f7f7`) + dark text — data-first, not decorative dark chrome.
2. Executive volume chart: 2 lines, thick primary / thin شکایت, end labels — anti-spaghetti.
3. Executive categorical charts: sorted horizontal bars (pies removed on `/`).

**Three most important problems**

1. **Confirmed pies** remain on requests / answers / KPI monitoring.
2. **Semantic color drift** — amber means exception on `/`, but multi-hue pies elsewhere; feasibility greens reappear on KPI pie.
3. **Ordering story incomplete across pages** — ranking bars OK on `/`; pie slices unordered; filter-driven rank changes unexplained.

**Assessment:** Ready for business use on the **executive story page** for these five case themes; **not** fully ready product-wide until pies are replaced and color/order conventions are unified.

---

## Section 2 — Checklist results

| Criterion ID | Criterion | Score | Dashboard location | Evidence | Recommendation |
|--------------|-----------|------:|--------------------|----------|----------------|
| C9.01 | Background suitability | 2 | Global shell | `--canvas: #f4f7f7`, white cards; attention on amber strip/data | Keep light theme |
| C9.02 | Contrast on dark backgrounds | N/A | — | No dark dashboard theme | Do not add dark theme without a palette pass |
| C9.03 | Semantic color consistency | 1 | `/` vs requests/KPI | `/`: teal brand + amber exception; KPI pie uses emerald/amber/orange/purple; requests pie multi-hue | Document palette: teal=brand measure, amber=exception only |
| C9.04 | Dark-theme readability | N/A | — | Light theme only | N/A |
| C9.05 | Purposeful animation | N/A | Charts | No designed story animation; only ECharts default entrance | Do not add animation for decoration |
| C9.06 | Animation control | N/A | — | No controllable sequence animation | N/A |
| C9.07 | Animation accessibility | 2 | Product-wide | No flashing loops; essentials not animation-only | Keep; respect `prefers-reduced-motion` if custom motion added later |
| C9.08 | Static comprehension | 2 | `/` and drills | Message readable in static view/export of charts | Keep |
| C9.09 | Logical category order | 2 | `/` bars | Sorted by value; max highlighted | Apply same sort helper on drill bars |
| C9.10 | Logical time order | 2 | `/` volume; answers trend | Category time axis chronological | Keep; assert API sort in tests |
| C9.11 | Consistent ordering | 1 | `/` vs requests | Executive ranked bars; requests class as **pie** (weak order) | Replace pies; share sort convention |
| C9.12 | Stable interactive sorting | 1 | Global filters | Ranked charts re-order with filters (expected) without explaining “مرتب بر اساس حجم” | Add subtitle “مرتب‌سازی بر اساس حجم فعلی فیلتر” |
| C9.13 | Line-chart readability | 2 | `/` volume | Two series, distinguishable | Keep |
| C9.14 | Strategic line emphasis | 2 | `/` volume | Width 3 vs 1.5 + end labels | Keep; avoid adding more series without filter |
| C9.15 | Alternatives for many series | N/A | — | No 5+ series line chart present | If added later: filter / small multiples |
| C9.16 | Appropriate use of pie charts | 0 | `/analytics/requests` class donut; `/knowledge/answers` coverage breakdown pie; `/performance/kpi` feasibility pie | Pies used where comparison/ranking is the task (esp. SubjectClass) | Replace with sorted horizontal bars (or 100% stack only if proportion-over-groups is the question) |
| C9.17 | Appropriate alternatives to pies | 1 | `/` yes; drills no | Executive already uses bars/text | Port executive bar helper to drills |
| C9.18 | Accurate comparison | 1 | Mix | Bars enable length comparison; pies hinder similar-slice compare | Bars for class/feasibility counts |
| C9.19 | Clear labels and values | 1 | `/` + drills | End labels/max bar values on `/`; pies label name only; long labels truncate | Value on max or tooltip + sort label |
| C9.20 | Fit to analytical purpose | 1 | Product | `/` fit strong; drills still use Ch.2 anti-patterns | Align drills with executive visual rules |

**Math:** 21 points / (2×15) = **70%**.

---

## Section 3 — Case study findings

### 1. Background and color

**Inspected:** `globals.css` tokens; executive amber strip; chart palettes on `/`, requests, answers, KPI.

**Works well:** Light canvas keeps focus on data; executive amber reserved for exception/story.

**Needs improvement:** Drill-page pies reintroduce multi-color “rainbow” encoding; KPI feasibility pie uses emerald that can read as “good performance.”

**Criteria:** C9.01–C9.04  
**Change:** Publish a short color legend in docs/UI; constrain chart `color` arrays to brand + slate + amber-exception.

### 2. Animation and motion

**Inspected:** No custom Framer/CSS story sequences; ECharts default draw animation on option update.

**Works well:** No autoplay storytelling; static comprehension intact (C9.07–C9.08).

**Needs improvement:** None critical. Optional: disable ECharts animation when `prefers-reduced-motion: reduce`.

**Criteria:** C9.05–C9.08 (05–06 N/A)

### 3. Logical ordering

**Inspected:** Executive `horizontalBarOption` sorts by value; volume time categories; requests group/region reverse arrays; pies unordered slices.

**Works well:** Executive ranking + chronology.

**Needs improvement:** Document sort rule under charts; unify drill bars; eliminate pie order ambiguity.

**Criteria:** C9.09–C9.12

### 4. Spaghetti graphs

**Inspected:** Executive dual-line volume; answers single coverage line; KPI single trend; TopicCluster evolution (single/few series in code).

**Works well:** No spaghetti on inspected live charts; executive emphasizes one series.

**Needs improvement:** Guardrails if multi-department lines are added later.

**Criteria:** C9.13–C9.15

### 5. Pie charts and alternatives

**Inspected (confirmed in code + routes):**

| Page | Component | Chart |
|------|-----------|-------|
| `/analytics/requests` | `classOption` | Donut of SubjectClass |
| `/knowledge/answers` | `breakdownOption` | Donut of reply text mix |
| `/performance/kpi` | `feasibilityDistOption` | Donut of feasibility counts |

**Works well:** Executive `/` already replaced pies with bars/text (Ch.2/6).

**Needs improvement:** Replace the three remaining pies with **sorted horizontal bars** (counts) — primary analytical need is comparison, not ornamental part-to-whole.

**Criteria:** C9.16–C9.18, C9.20

---

## Section 4 — Cross-page consistency

| Topic | Status |
|-------|--------|
| Background | Consistent light theme |
| Category colors | **Inconsistent** — executive restrained; pies multi-hue |
| Category ordering | Ranked bars on `/`; pies unordered on drills |
| Similar questions | Class distribution: bars on `/`, pie on `/analytics/requests` |
| Interactive filters | Shared Header — predictable |
| Metric presentation | fa-IR shared; chart families diverge |

**Affected pages:** `/analytics/requests`, `/knowledge/answers`, `/performance/kpi` vs `/`.

---

## Section 5 — Prioritized recommendations

### Critical

| # | Problem | Where | Why it matters | Solution | Benefit | ID |
|---|---------|-------|----------------|----------|---------|-----|
| 1 | SubjectClass as donut | `/analytics/requests` | Comparison harder than sorted bars | Sorted horizontal bar (share executive helper) | Accurate compare | C9.16, C9.18 |

### High

| # | Problem | Where | Why it matters | Solution | Benefit | ID |
|---|---------|-------|----------------|----------|---------|-----|
| 2 | Coverage breakdown pie | `/knowledge/answers` | 3-part mix better as bars | Horizontal bars for ReplyCitizen / operator / none | Clear magnitudes | C9.16, C9.17 |
| 3 | Feasibility catalog pie | `/performance/kpi` | Count comparison; green≠good | Sorted bars + slate/amber chip colors | Honest encoding | C9.03, C9.16 |

### Medium

| # | Problem | Where | Why it matters | Solution | Benefit | ID |
|---|---------|-------|----------------|----------|---------|-----|
| 4 | Color semantics drift | Drill charts | Exception meaning diluted | Shared palette module | Consistency | C9.03, C9.11 |
| 5 | Sort rule unspoken | Ranked charts | Filter reorders silently | Subtitle «مرتب بر اساس حجم» | Predictability | C9.12 |

### Low

| # | Problem | Where | Why it matters | Solution | Benefit | ID |
|---|---------|-------|----------------|----------|---------|-----|
| 6 | Default ECharts motion | All charts | Minor a11y polish | Honor `prefers-reduced-motion` | Comfort | C9.07 |
| 7 | Smooth+area on some drill lines | answers/KPI trends | Mild distortion vs executive | Match executive `smooth: false`, no area unless intentional | Consistency | C9.20 |

---

## Section 6 — Proposed visualization improvements

1. **Replace requests class donut** → sorted horizontal bar of SubjectClass volumes (same data `byClass`). *Why:* ranking/comparison task.  
2. **Replace answers breakdown donut** → three horizontal bars (or one stacked 100% **only if** teaching composition; prefer simple bars for counts). *Why:* magnitudes matter.  
3. **Replace KPI feasibility donut** → sorted bars of dictionary counts with neutral slate for “feasible.” *Why:* avoid performance-green implication.  
4. **Do not introduce dark background** unless product requires it with a full contrast redesign.  
5. **Do not add storytelling animation**; keep static-first.  
6. **Keep executive dual-line pattern** as the template for any new multi-series time charts (max ~2–3 highlighted; rest muted or filtered).

---

## Section 7 — Final verdict

| | |
|--|--|
| **Overall Chapter 9** | **70%** — Needs improvement |
| **Implement first** | Remove remaining pies on requests / answers / KPI pages |
| **Ready for business use?** | **Executive `/` yes** for these case themes; **full product no** until pies + palette alignment |
| **Limitations** | Static ECharts canvas motion not user-tested with reduced-motion; TopicCluster graph not fully dissected for spaghetti (few series observed in code) |

---

## Remediations

_Status: audit only — implementation not yet applied._
