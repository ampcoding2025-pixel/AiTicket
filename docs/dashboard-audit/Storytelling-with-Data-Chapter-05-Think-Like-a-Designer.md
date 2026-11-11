# BI Dashboard Assessment — Chapter 5: Think Like a Designer

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.5 |
| Chapter | 5 — Think Like a Designer |
| Scope | Executive Dashboard `/` (primary); shared shell Header / Sidebar / DemoBanner; light check of `/performance/kpi` for pattern consistency |
| Date | 2026-11-11 |
| Baseline | After Ch.1–4 remediations (context, chart choice, declutter, attention hierarchy) |
| Inspection method | Live UI at `http://localhost:3000` (API / Didban read-only) + source review; accessibility tree / keyboard tab stops observed via browser tools |
| Inspection limits | No formal WCAG lab contrast/CVD audit; no zoom/responsive lab matrix; no end-user interviews; chart canvas a11y limited by ECharts |
| Verdict | **Does not fully meet** Chapter 5 — **Significant redesign required** (driven by missing reset UX + unvalidated acceptance; aesthetics/affordances are stronger than the headline %) |
| Score | **23 / 40** → **58%** |

| Metric | Count |
|--------|------:|
| Criteria evaluated | 20 |
| N/A | 0 |
| Insufficient evidence (qualified within a scored criterion) | 3 (C5.09 contrast lab; C5.13 full keyboard matrix; zoom/responsive) |
| Score 0 | 2 |
| Score 1 | 13 |
| Score 2 | 5 |

---

## Section 1 — Executive summary

**Overall:** 58% — Significant redesign required under the stated thresholds. The product looks coherent and institutional after Ch.1–4, and many interactions *work* when tested (filters refresh data; KPI opens a detail modal; nav active/disabled maturity is clear). The Chapter 5 gap is less “ugly UI” and more **incomplete interaction design + unverified accessibility + no stakeholder acceptance evidence**.

**Three strongest design aspects**

1. **Consistent shell language** — shared Header filters, Sidebar maturity badges, ChartCard, fa-IR number formatting, Vazirmatn, restrained teal/slate palette.
2. **Color-independent status text** — feasibility chips, maturity labels (فعال / نمایشی / آینده), «استثناء» / «توجه» carry meaning beyond hue.
3. **Core insights without hover** — Big Idea, spotlight KPIs, and action list are readable on the page; charts have visible titles/axis labels.

**Three most important weaknesses**

1. **No filter reset / clear** — users must manually restore each control; no discoverable “بازگشت به پیش‌فرض”.
2. **Acceptance not demonstrated** — docs still mark audience/eligibility rules as provisional / awaiting sign-off; no user-test evidence.
3. **Affordances incomplete** — KPI cards are clickable `<button>`s but use `cursor: default` and lack a “جزئیات” cue; export looks like a solid CTA while disabled; chart canvases lack accessible names.

**Easy to use?** Partially — filter and navigation are understandable; discovery of KPI drill-down and recovery from filter combinations is weaker.

**Sufficiently accessible?** **Not confirmed.** Labels and text alternatives exist for many controls; contrast/keyboard/zoom were not formally certified. Score reflects observed partial support, not WCAG compliance.

**Coherent / professionally finished?** Largely yes for an M1 institutional BI shell.

**Stakeholder acceptance demonstrated?** **No.**

---

## Section 2 — Affordances and interaction assessment

### Discoverability

| Component | Observation |
|-----------|-------------|
| Period / SubjectClass selects | Bordered controls + icons; `aria-label` present — recognizable |
| Org unit filter | Dashed border, muted text, `disabled`, label includes «غیرفعال» — clear non-affordance |
| Export «خروجی گزارش» | Solid slate button, `disabled` + `title` — still *looks* like a primary action (**misleading affordance**) |
| KPI cards | Functional buttons; open modal on click (**confirmed**); visually card-like; **cursor:default** reduces clickability cue |
| Sidebar planned items | Non-link divs + «آینده» badge — good |
| Story links | Underlined on hover; slate (post-Ch.4) — recognizable as links |

### Filter clarity and active states

- Applied period appears in the select value **and** in the Big Idea strip (`بازه: …`). **Confirmed:** changing period to ۹۰ روز refreshed KPIs (e.g. ~۸٬۳۸۱ vs ۱۹۳٬۰۰۳) and strip dates.
- SubjectClass selection is visible only in the header select — no chip bar summarizing “فیلترهای فعال”.
- Active nav route uses brand-soft background + bold teal — clear.
- No dedicated “selected KPI” state after modal close.

### Feedback

- Loading copy exists (`در حال بارگذاری داشبورد برای بازه انتخابی...`) — brief; easy to miss on fast API.
- KPI click → modal with value + period — **confirmed**.
- Modal lacks `role="dialog"` / focus trap / Escape handling (code review) — feedback incomplete for keyboard users.
- Error/empty-network feedback path not exercised in this inspection (**insufficient evidence** for failure states).

### Reset behavior

- **No reset control** in Header or filter context. Defaults live only in code (`DEFAULT_FILTERS`). **Confirmed issue.**

### Misleading / nonfunctional elements

| Element | Issue | Severity |
|---------|-------|----------|
| خروجی گزارش | Looks actionable; disabled until later phase | High (affordance) |
| KPI cards | Work, but weak click affordance | Medium |
| Org filter | Correctly disabled (good) | — |

---

## Section 3 — Accessibility assessment

### Confirmed strengths

- Filter `<select>` elements expose accessible names (`بازه زمانی`, `طبقه درخواست`, `واحد سازمانی`).
- Logo has meaningful `alt` («لوگوی سازمان بهزیستی کشور»).
- Status meanings paired with text (feasibility, maturity, exception, attention).
- Essential story content is on-page (not hover-only).
- KPI controls are real `<button>` elements and appear in the accessibility tree.

### Confirmed / likely issues

| Issue | Evidence | Severity |
|-------|----------|----------|
| Chart canvases without accessible name/description | `EChart` renders canvas; no `aria-label` / title wiring | High |
| Small muted text (`text-[10px]`/`text-[11px]` chips, section labels) | Readability at desk distance | Medium |
| Select uses `outline-none` without a visible custom focus ring | Header selects | Medium |
| Modal dialog semantics incomplete | Overlay + «بستن» only; no `aria-modal` | Medium |
| KPI `cursor: default` | Computed style on spotlight button | Low–Medium (affordance / motor cue) |

### Requires further testing (do not claim pass)

- Formal contrast ratios (WCAG AA) for `text-slate-400` / `--muted` (#64748b) on white and amber-on-amber chips.
- Full keyboard matrix (Tab order through long page, Escape closes modal, focus return).
- Zoom 200% / narrow mobile viewport usability.
- Screen-reader walkthrough of chart series (ECharts canvas).

**No WCAG compliance claim is made.**

---

## Section 4 — Aesthetics and design consistency

| Topic | Observation |
|-------|-------------|
| Typography | Vazirmatn consistently; hierarchy improved post-Ch.4 (Big Idea dominant, header quieter) |
| Palette | Teal brand, slate neutrals, amber for exception/story — coherent institutional look |
| Components | ChartCard / KpiCard / SectionLabel reuse; spotlight vs secondary weight differentiated |
| Icons | Lucide calendar/filter/building/download — consistent size |
| Number format | `fa-IR` via `formatFaNumber` / `formatFaPercent` — polished |
| Spacing | Generally even `space-y-8` / card padding; long page still dense vertically |
| Language mix | Persian UI with English technical tokens (`SubjectClass`, `Cookie`, `FinishTime`, `Availability`) — clarity cost for non-technical executives |
| Context fit | Behzisti logo, RTL, read-only Didban banner — appropriate for public-sector BI |

Decorative restraint is good; aesthetics support trust more than decoration.

---

## Section 5 — Acceptance and stakeholder validation

| Evidence sought | Finding |
|-----------------|---------|
| Stakeholder sign-off on audience / decisions | Ch.1 audit + roadmap: provisional audience; eligibility/resolved rules **awaiting business sign-off** (`docs/09`, `docs/12`) |
| End-user testing / prototype sessions | **None documented** |
| Feedback-driven iteration | Design-audit remediations Ch.1–4 **are** evidence of expert iteration — not end-user acceptance |
| Familiar conventions | Standard selects, sidebar nav, KPI cards — appropriate |
| Explained design decisions | DemoBanner mode chip; feasibility labels; caveats under coverage — help trust |

**Acceptance cannot be confirmed.**

### Practical validation plan (recommended)

1. **30-minute walkthrough** with 2–3 intended users (مدیر ارشد / راهبر تحلیل) on `/` only.
2. Tasks: (a) state the takeaway in one sentence; (b) filter to ۹۰ روز; (c) open coverage detail; (d) navigate to پاسخ تاریخی.
3. Capture: confusion points, desired reset, label language (Cookie/SubjectClass), whether export/disabled controls confuse.
4. Separate preference feedback from task failures; fix task failures first.
5. Sign off eligibility/resolved rules before promoting FinishTime KPIs as decision-grade.

---

## Section 6 — Detailed checklist results

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C5.01 | Recognizable interactive elements | 1 | Selects/links clear; KPI cards look static (`cursor:default`); disabled export still button-shaped | Add pointer + “جزئیات” cue on KPIs; style disabled export as ghost/text | High |
| C5.02 | Clear control labels | 1 | Persian aria-labels on filters; English domain tokens in chart/KPI titles | Prefer Persian glosses for executives; keep technical id in tooltip/subtitle | Medium |
| C5.03 | Discoverable interactions | 1 | Filters obvious; KPI modal not announced as interactive; charts static | Hint under spotlight row: «برای جزئیات کلیک کنید» | Medium |
| C5.04 | Visible interaction states | 1 | Active nav + disabled org clear; export muted but CTA-like; no KPI selected state | Stronger disabled styling; optional selected ring while modal open | Medium |
| C5.05 | Filter transparency | 1 | Select value + strip period update (**confirmed**); no summary chips for all filters | Add «فیلترهای فعال» chip row under Header | Medium |
| C5.06 | Clear reset behavior | 0 | No reset/clear control anywhere in filter context | Add «بازنشانی فیلترها» restoring `DEFAULT_FILTERS` | High |
| C5.07 | Consistent interaction patterns | 2 | Shared selects; KPI-as-button; list→detail patterns on other pages | Keep patterns as pages grow | — |
| C5.08 | Interaction feedback | 1 | Period change refreshes data (**confirmed**); loading text exists; modal opens; no robust error UI tested | Keep loading; add error banner; modal focus management | Medium |
| C5.09 | Sufficient color contrast | 1 | Dark text on white generally OK; small muted/`text-[10px]` chips **potential** issue — no lab measurement | Measure AA; enlarge chip text to ≥12px where critical | Medium |
| C5.10 | Color-independent communication | 2 | Text labels for feasibility, maturity, exception, attention | Retain text+color pairing | — |
| C5.11 | Readable typography | 1 | Big Idea/KPI values readable; section labels and 10–11px chips cramped | Raise minimum UI text for chips/labels | Medium |
| C5.12 | Accessible information | 2 | Story/KPIs/insights visible without hover; chart titles present | Keep; do not move KPIs into tooltips only | — |
| C5.13 | Keyboard accessibility | 1 | Native tab stops for links/selects/buttons (**observed**); modal/charts incomplete — **insufficient for full pass** | Focus trap + Escape on modal; skip-link optional | High |
| C5.14 | Accessible focus indication | 1 | KPI `focus-visible:ring-2` present; Header selects `outline-none` without replacement ring | Add focus ring on filter controls | Medium |
| C5.15 | Meaningful labels and descriptions | 1 | Control names + chart titles good; canvas charts unnamed | `aria-label` on chart container from ChartCard title | High |
| C5.16 | Consistent design language | 2 | Shared tokens, components, formatting after Ch.1–4 | Maintain design tokens as pages expand | — |
| C5.17 | Visual polish | 1 | Generally careful padding/borders; cursor/export/English tokens reduce finish | Fix affordance polish items above | Low |
| C5.18 | Appropriate aesthetics | 2 | Institutional RTL Behzisti look; restrained accents suit public BI | Keep restraint; avoid decorative chrome | — |
| C5.19 | Stakeholder validation | 0 | Docs: sign-off pending; no user-test records | Run validation plan (Section 5) | Critical |
| C5.20 | Feedback-driven improvement | 1 | Expert audit remediations Ch.1–4 applied; no end-user feedback loop documented | Log user-session findings → backlog | Medium |

---

## Section 7 — Prioritized remediation plan

| Priority | Severity | Component | Problem | Recommended change | Expected benefit | Criteria |
|----------|----------|-----------|---------|--------------------|------------------|----------|
| 1 | Critical | Acceptance process | No stakeholder/user validation | Run 3-user task walkthrough; sign audience + rules | Trust + product direction | C5.19, C5.20 |
| 2 | High | Header filters | No reset | Add «بازنشانی فیلترها» → `DEFAULT_FILTERS` | Recoverability | C5.06, C5.05 |
| 3 | High | KpiCard + export | Weak/misleading affordances | `cursor-pointer`; detail hint; ghost style for disabled export | Fewer dead-end clicks | C5.01, C5.04, C5.03 |
| 4 | High | EChart / ChartCard | Canvas unnamed for AT | Pass accessible name from chart title; consider data table alternative later | Screen-reader parity | C5.15, C5.13 |
| 5 | High | KPI modal | Incomplete dialog a11y | `role="dialog"`, `aria-modal`, Escape, focus trap/return | Keyboard usability | C5.13, C5.14, C5.08 |
| 6 | Medium | Header selects | Missing visible focus ring | Custom `focus-visible` ring matching KPI cards | Keyboard orientation | C5.14 |
| 7 | Medium | Filter transparency | Applied filters only in selects | Chip summary under header | Situational awareness | C5.05 |
| 8 | Medium | Typography / contrast | Tiny chips / muted text | Bump chip text; spot-check contrast | Readability | C5.09, C5.11 |
| 9 | Low | Label language | English technical tokens | Persian primary labels + technical subtitle | Executive comprehension | C5.02 |

Do **not** chase decorative restyling. Prefer interaction recoverability, honest disabled states, and validation with real users.

---

## Section 8 — Final verdict

| | |
|--|--|
| **Score** | **58%** (23/40) |
| **Assessment** | Significant redesign required — mainly interaction completeness + acceptance gap; visual system is already largely coherent |
| **Pass Chapter 5 design assessment?** | **No** |
| **Implement first** | Stakeholder/user validation session **and** filter reset control |
| **Most important accessibility improvement** | Accessible names for charts + proper modal keyboard behavior |
| **Most important usability improvement** | Honest affordances (KPI clickability + disabled export) and filter reset |
| **Additional testing required** | WCAG contrast sampling; full keyboard pass; 200% zoom / mobile; 3-user task test |

Chapter 1–4 topics were referenced only where they affect usability or design quality (e.g. attention accents aiding exception recognition; declutter aiding polish).

---

## Remediations

_Status: applied 2026-11-11 — Chapter 5 design / usability fixes (code). Stakeholder user-testing (C5.19) remains a process gap._

| # | Change | Files | Criteria addressed |
|---|--------|-------|--------------------|
| 1 | Filter reset («بازنشانی فیلترها») + `resetFilters` / `isDefaultFilters` | `DashboardFilterContext.tsx`, `Header.tsx` | C5.06 |
| 2 | Active-filter chip row under header | `Header.tsx` | C5.05 |
| 3 | Ghost/dashed disabled export («به‌زودی»); select focus rings | `Header.tsx` | C5.01, C5.04, C5.14 |
| 4 | KPI `cursor-pointer`, aria-labels, «جزئیات ←» cue; larger chip text | `KpiCard.tsx`, `ExecutiveDashboard.tsx` | C5.01, C5.03, C5.11 |
| 5 | Chart accessible name via ChartCard context + `role="img"`; section `aria-labelledby` | `ChartCard.tsx`, `EChart.tsx` | C5.15 |
| 6 | KPI modal: `role="dialog"`, `aria-modal`, Escape, focus trap/return, backdrop click | `ExecutiveDashboard.tsx` | C5.13, C5.14, C5.08 |
| 7 | Sidebar maturity chips → `text-xs` | `Sidebar.tsx` | C5.11 |

**Still open (process):** schedule 3-user walkthrough and eligibility/resolved sign-off (C5.19 / C5.20).
