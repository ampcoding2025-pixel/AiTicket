# BI Dashboard Assessment — Chapter 4: Focus Your Audience’s Attention

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.4 |
| Chapter | 4 — Focus Your Audience’s Attention |
| Scope | Executive Dashboard `/` (primary); shell Header/DemoBanner; light note on other pages for C4.18 |
| Date | 2026-11-11 |
| Baseline | After Ch.1–3 remediations (Big Idea, chart choice, declutter) |
| Inspection limit | Code/UI structure + known live KPI behavior; no formal color-vision lab test; desktop-first assumption |
| Verdict | **Partially meets** Chapter 4 — **Needs improvement** |
| Score | **26 / 40** → **65%** |

| Metric | Count |
|--------|------:|
| Criteria evaluated | 20 |
| N/A | 0 |
| Score 0 | 0 |
| Score 1 | 14 |
| Score 2 | 6 |

---

## Section 1 — Executive summary

**Overall:** 65% — Needs improvement. The page is calmer after Ch.3, and it *has* a Big Idea plus feasibility grouping, but **attention is still split**: the header title and equal KPI cards compete with the story, while the mid-page coverage figure (`text-4xl`) is visually stronger than the Big Idea (`text-base`) and primary KPI values (`text-2xl`). Exception emphasis for low answer coverage and “توجه” insights is weak.

**Three strongest aspects**

1. Feasible vs needs_rules vs unavailable are **separated by section** (proximity/hierarchy of content).
2. Color is largely restrained (brand teal, muted slate); Ch.3 removed multi-color insight tiles.
3. Supporting caveats sit next to coverage; chart subtitles stay near charts.

**Three most important weaknesses**

1. **First impression** likely lands on Header “داشبورد مدیریتی” or the equal KPI grid — not the Big Idea punch line.
2. **Size hierarchy inverted**: coverage % is larger than primary KPIs and Big Idea.
3. **Exceptions under-emphasized**: ~6.3% coverage and “توجه” items lack a deliberate accent that says “look here first for risk.”

**Does it successfully direct attention to the most important information?**  
**Partially.** Viewers can find the story if they read the strip, but the visual system does not *force* the eye to the Big Idea / key exception ahead of chrome and peer KPIs.

---

## Section 2 — Attention and visual hierarchy assessment

### “Where are your eyes drawn?” (desktop, RTL)

| Order | Likely attractor | Why |
|------:|------------------|-----|
| 1 | Header title `داشبورد مدیریتی` (`text-xl font-bold`) + filter controls | Top-of-viewport, large type, interactive chrome |
| 2 | Primary KPI grid (`text-2xl` values, bordered cards, green/amber chips) | Dense equal-weight blocks |
| 3 | Volume chart (large plot area ~300px) | Visual mass |
| Later | Big Idea (`text-base`) — already above KPIs but quieter than header | Under-weighted |
| Mid-page | Coverage `text-4xl` | Strongest numeric type size on page |

**Is this sequence appropriate?**  
No — for a communication page whose Ch.1 message is volume + low answer coverage + SLA unavailable, the **first** stop should be the Big Idea (and/or one spotlight KPI), not the page chrome or a flat KPI wall.

**Primary vs secondary**  
Content sections exist (SectionLabel), but **primary and secondary KPI cards share the same visual weight** (same border, same value size). Unavailable is correctly quieter (text rows). Coverage later accidentally becomes a “hero” number without being framed as the primary exception.

**Assumption (labeled):** Intended primary message ≈ Big Idea string built from feasible KPIs (volume, complaint share, coverage ~6.3%, SLA unavailable). Stakeholders have not signed a single “north star” KPI.

---

## Section 3 — Detailed checklist results

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C4.01 | Clear primary focus | 1 | Big Idea present but smaller/quieter than header + KPI grid | Raise Big Idea size/weight; optional single accent underline or left rule | High |
| C4.02 | Visual hierarchy | 1 | Sections help; primary vs secondary KPI cards nearly identical; coverage 4xl jumps hierarchy | Differentiate card weight; demote coverage type size unless spotlighted | High |
| C4.03 | Purposeful emphasis | 1 | Equal emphasis across feasible KPIs; no spotlight for coverage exception | Spotlight 1–2 story KPIs (e.g. volume + coverage) | High |
| C4.04 | Strategic use of color | 1 | Mostly muted; green feasibility chips + teal links/filters still accent | Reserve strong accent for exceptions/story only | Medium |
| C4.05 | Consistent color meaning | 1 | Teal = brand, links, filter icons; green chip = “feasible” not “good outcome” | Document legend; avoid green-as-performance implication | Medium |
| C4.06 | Appropriate status colors | 1 | Insight severity is grey text; no dedicated risk accent for low coverage | Use one warning accent + text label for attention items | Medium |
| C4.07 | No excessive highlighting | 2 | Post-Ch.3: few competing fills | Retain restraint | — |
| C4.08 | Color-independent meaning | 2 | Feasibility and severity have text labels | Keep text with any future color accent | — |
| C4.09 | Color accessibility | 1 | Teal/amber/slate on white generally OK; no formal CVD test in evidence | Verify contrast; pair icons/text with color | Low |
| C4.10 | Meaningful size hierarchy | 1 | Coverage `text-4xl` > KPI `text-2xl` > Big Idea `text-base` | Align sizes to importance: Big Idea ≥ spotlight KPI ≥ support | Critical |
| C4.11 | Proportional representation | 2 | Chart scales start at 0; type size not used as fake magnitude of counts | Keep | — |
| C4.12 | Appropriate text prominence | 1 | Page H2 header outranks Big Idea | Soften header relative to story strip, or shrink header | Medium |
| C4.13 | Strategic placement | 1 | Big Idea at top (good) but weak; key exception (coverage) mid-page | Move spotlight coverage next to Big Idea or first KPI row | High |
| C4.14 | Logical reading sequence | 1 | Top→down RTL sensible; long page delays secondary story | Keep order; strengthen early focus so scroll is optional for takeaway | Medium |
| C4.15 | Related content grouping | 2 | Volume with class; coverage near subjects; actions grouped | Keep | — |
| C4.16 | Supporting information placement | 2 | Caveat under coverage; period on strip | Keep | — |
| C4.17 | Exception highlighting | 1 | Low coverage not marked as exception at top; “توجه” is low-contrast | Accent + position for exceptions | High |
| C4.18 | Consistent hierarchy across pages | 1 | Shared Header/DemoBanner; other pages not fully hierarchy-audited | Apply same story→KPI→chart pattern on live API pages | Medium |
| C4.19 | Intended first impression | 1 | Likely header/KPIs, not Big Idea | Make Big Idea the dominant first block | Critical |
| C4.20 | Attention at actual display size | 1 | Desktop assumed; mobile stacks header then strip — insufficient mobile screenshot evidence | Test 1366×768 and mobile; ensure Big Idea visible without scroll past chrome | Medium |

---

## Section 4 — Color assessment

| Topic | Observation | Change |
|-------|-------------|--------|
| Accent usage | Brand teal on filter icons and links; feasibility green/amber chips | Keep teal for interactive chrome only; use **one** story/exception accent (e.g. amber) sparingly |
| Semantic consistency | Green chip = computable, not “performance up” | Rename chip styling toward neutral slate for “feasible”, amber for needs_rules |
| Status conventions | No clear positive/negative performance palette on executive page (good — avoids fake status) | For true exceptions only: amber/rose **plus** text |
| Excessive highlighting | Largely controlled after Ch.3 | Do not reintroduce multi-color insight tiles |
| Accessibility | Text labels exist; chip greens may be weak for CVD | Prefer slate/amber patterns; never color-only status |
| Guiding attention | Color currently does **not** pull eye to Big Idea or low coverage | Add selective accent on story strip / spotlight KPI |

---

## Section 5 — Size and typography hierarchy

| Element | Current size/weight | Role vs importance |
|---------|---------------------|--------------------|
| Header title | `text-xl font-bold` | Chrome > story — too strong |
| Big Idea | `text-base font-semibold` | Should be primary — under-weighted |
| Primary KPI value | `text-2xl font-bold` | Peer wall — OK if one is spotlighted |
| Coverage value | `text-4xl font-bold` | Stronger than story KPIs — overpowers |
| Section labels | `text-[11px]` | Appropriately quiet |
| Insight body | `text-xs` | Supporting — OK |

**Misleading size?** Type size does not fake bar magnitudes (good). Risk is **importance** exaggeration: coverage looks more “official” than the Big Idea.

**Recommendation:** Big Idea → `text-lg`/`text-xl`; spotlight KPI → `text-3xl`; other primary KPIs → `text-xl`; coverage in-place → `text-2xl` **or** move coverage into spotlight row and drop the orphan hero size.

---

## Section 6 — Layout and position assessment

| Topic | Observation | Recommendation |
|-------|-------------|----------------|
| Placement of most important | Big Idea is high but weak; coverage mid-page | Story block: Big Idea + 1–2 spotlight metrics in first viewport |
| Reading sequence | Header → strip → many KPIs → charts → actions → coverage | Compress first viewport to story + spotlights; push peer KPIs below |
| Grouping | Strong by section | Keep |
| Annotations | Caveats near coverage | Keep; add short “چرا مهم است” next to spotlight |
| Overlooked insights | Actions list mid-page; severity easy to miss | Promote top “توجه” item into story strip when severity=attention |

**Viewing environment assumption:** Desk browser ~1366px+; RTL. Mobile not verified with screenshot.

---

## Section 7 — Prioritized remediation plan

| Priority | Severity | Component | Problem | Recommended change | Expected benefit | Criteria |
|----------|----------|-----------|---------|--------------------|------------------|----------|
| 1 | Critical | Big Idea strip | First look ≠ story | Increase type weight/size; optional left accent bar; reduce header visual weight | Eye lands on message | C4.01, C4.19, C4.12 |
| 2 | Critical | Size hierarchy | Coverage 4xl > story | Cap coverage size or relocate into spotlight row | Importance matches emphasis | C4.10, C4.02 |
| 3 | High | Primary KPI grid | All feasible KPIs equal | Spotlight volume + coverage (larger card / accent); others secondary visual weight | Purposeful emphasis | C4.03, C4.13 |
| 4 | High | Exception: low coverage | Not marked as risk at top | Warning accent + label «استثناء» near story | Faster risk scan | C4.17, C4.06 |
| 5 | Medium | Feasibility chips | Green reads as “good” | Neutral slate for feasible; keep amber for needs_rules | Color meaning ≠ performance | C4.05, C4.04 |
| 6 | Medium | Secondary KPI cards | Same chrome as primary | Flatter/smaller secondary cards | Clearer hierarchy | C4.02 |
| 7 | Medium | Insights “توجه” | Low contrast | Accent marker + bold title for attention only | Exception visibility | C4.17 |
| 8 | Low | Cross-page | Hierarchy not standardized | Reuse story→spotlight→support pattern | C4.18 |

Do **not** highlight everything. One story accent + one exception accent maximum.

---

## Section 8 — Final verdict

| | |
|--|--|
| **Score** | **65%** (26/40) |
| **Assessment** | Needs improvement — Partially meets Chapter 4 |
| **Pass Ch.4 attention test?** | **No** — first impression and size hierarchy are not reliably aligned with the intended Big Idea / coverage exception |
| **Implement first** | Make the **Big Idea the dominant first visual**, and fix the **coverage type-size / spotlight** so importance and attention match |

Chapter 1–3 topics (context completeness, chart family, clutter volume) were referenced only where they affect attention.

---

## Remediations

_Status: applied 2026-11-11 — Chapter 4 attention fixes._

| # | Change | Files | Criteria addressed |
|---|--------|-------|--------------------|
| 1 | Big Idea strip: amber right-border accent, `text-xl`/`text-2xl font-bold`, promote top «توجه» insight into strip | `ExecutiveDashboard.tsx` | C4.01, C4.12, C4.19 |
| 2 | Soften Header page title to `text-base font-semibold text-slate-700`; filter icons slate | `Header.tsx` | C4.12, C4.19 |
| 3 | Spotlight KPIs: volume (`total-requests`) + coverage (`answer-coverage`) with `emphasis="spotlight"` (`text-3xl`, amber border) | `ExecutiveDashboard.tsx`, `KpiCard.tsx` | C4.03, C4.13 |
| 4 | Demote mid-page coverage from `text-4xl` → `text-2xl`; note that spotlight already shows it | `ExecutiveDashboard.tsx` | C4.10, C4.02 |
| 5 | Exception: «استثناء» on low coverage (&lt;15%); amber highlight on attention insights | `KpiCard.tsx`, `ExecutiveDashboard.tsx` | C4.17, C4.06 |
| 6 | Feasible chips → neutral slate (not green-as-good); secondary cards flatter/`text-lg` | `KpiCard.tsx` | C4.04, C4.05, C4.02 |
| 7 | Story links muted to slate (less teal competition with exception accent) | `ExecutiveDashboard.tsx` | C4.04 |

**Post-fix attention order (intended):** Big Idea strip → spotlight volume + coverage → other feasible KPIs → charts → actions (attention accented) → demoted coverage detail.
