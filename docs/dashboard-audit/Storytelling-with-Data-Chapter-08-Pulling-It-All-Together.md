# BI Dashboard Assessment — Chapter 8: Pulling It All Together

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.8 |
| Chapter | 8 — Pulling It All Together |
| Scope | Executive `/` as the primary communication product; shell + light cross-page check (`/analytics/*`, `/performance/kpi`, `/knowledge/answers`) for consistency |
| Date | 2026-11-11 |
| Baseline | **After** Ch.1–7 remediations (context, visuals, declutter, attention, designer/a11y, model-visual craft, narrative order) |
| Inspection | Live Didban API mode at `http://localhost:3000/` + code; filters/KPI modal/appendix exercised in prior sessions |
| Verdict | **Good** — lessons largely integrated on the executive page; product-wide readiness still limited |
| Score | **34 / 40** → **85%** |

| Metric | Count |
|--------|------:|
| Total criteria | 20 |
| Applicable | 20 |
| N/A | 0 |
| Insufficient evidence (qualified inside a score) | 2 (formal WCAG; stakeholder UAT) |
| Score 0 | 0 |
| Score 1 | 6 |
| Score 2 | 14 |

This audit evaluates the **complete product experience**, not a re-run of Ch.1–7 checklists. Prior chapters are referenced only where integration or residual conflict remains.

---

## Section 1 — Executive summary

**Overall:** 85% — Good. The executive dashboard now behaves as one communication product: identifiable audience and question, Big Idea, appropriate charts, reduced clutter, amber-led attention, usable filters, and a beginning→evidence→actions arc.

**Intended purpose (from evidence):** Self-service (and briefing-capable) executive view of **Didban case volume + citizen-reply coverage posture**, with honest feasibility limits — not a closed operational decision system.

**Main business message (observed):** In the selected period, volume is large (~۱۹۳٬۰۱۶), complaint share ≈ ۲۵٫۲٪, **citizen-reply coverage ≈ ۶٫۳٪ (Availability ≠ Validity)**, SLA not computable; next steps are investigate samples/categories/KPI rules.

**Three strongest aspects**

1. Integrated opening: question + Big Idea + توجه + terminology gloss.
2. Story order after Ch.7: نتیجهٔ اصلی → شواهد حجم → شواهد پوشش → نتیجه و اقدام; appendix collapsed.
3. Honest certainty: needs_rules, caveats, no invented causality/forecast.

**Five most important residual weaknesses**

1. **Stakeholder acceptance not demonstrated** (audience/eligibility still provisional).
2. **Accessibility not WCAG-certified** (canvas charts; contrast lab pending).
3. **Cross-page narrative uneven** — other live pages remain analytical galleries vs story products.
4. **Coverage drivers still unavailable in data** — honest note exists; investigation depth limited on-page.
5. **Mild text density** from storytelling aids (gloss, leads, هست/نیست) — useful but heavier for glancing users.

**Effective as a complete communication product?** **Yes for `/` investigation briefings.**  
**Ready for intended business use?** **Conditionally** — ready as M1 Outside-In executive monitoring; **not** ready as signed decision tooling until eligibility rules and user walkthrough sign-off.

---

## Section 2 — Assessment of the six lessons

| Lesson | Assessment | Key strengths | Main weaknesses | Recommended improvements |
|--------|------------|---------------|-----------------|--------------------------|
| 1. Context | Strong | Audience, period, question, gloss, Didban mode chip | Provisional audience; unsigned rules | Stakeholder sign-off on who/what |
| 2. Visual selection | Strong | Line trend; sorted h-bars; text coverage | Other pages may still mix conventions | Align secondary pages to same chart helpers |
| 3. Clutter | Good | Flat panels, collapsed appendix, no pies | Story text + «جزئیات ←» on every KPI | Soften secondary cues; optional compact mode |
| 4. Attention | Strong | Amber strip, spotlight KPIs, max-bar highlight | Header chrome still above strip | Keep header quiet (already softened) |
| 5. Designer / usability | Good | Reset, chips, modal a11y, focus rings | Formal a11y/UAT gaps | WCAG sample + 3-user test |
| 6. Story | Strong | B→M→E on `/`; next-step checklist | Cross-page story not unified | Apply story shell pattern to 2–3 key drill pages |

**How they work together:** Context supplies the Big Idea; visuals and declutter make evidence scannable; attention and design make the exception (coverage) findable; storytelling places actions last. Remaining gaps are mostly **organizational** (sign-off, other pages, formal a11y), not a broken executive narrative.

---

## Section 3 — End-to-end dashboard experience

### First impression (“Where are your eyes drawn?”)

| Order | Likely attractor | Matches intent? |
|------:|------------------|-----------------|
| 1 | Amber Big Idea / توجه strip | **Yes** |
| 2 | Spotlight volume + coverage KPIs | **Yes** |
| 3 | Volume trend (mass) | Acceptable as evidence |

Purpose and main message are identifiable without scrolling past the first beat.

### Exploration

- Filters: period + class usable; reset + active chips present; org disabled honestly.  
- Navigation: maturity badges (فعال/نمایشی/آینده) clear.  
- Supporting info: هست/نیست box + appendix for limits.  
- KPI modal + Escape/focus trap (Ch.5) support detail without leaving the story.

### Interpretation

- Trends/comparisons: volume MoM subtitle + dual line; ranked bars with max highlight.  
- Findings supported by displayed KPIs; caveats visible.  
- Limitations explicit (Validity absent; rules pending).

### Decision support

- Implications = **investigation**, not approved operational actions — appropriate.  
- Next-step checklist links to answers / categories / KPI catalog.  
- Does **not** claim capacity allocation or legal validity decisions.

---

## Section 4 — Detailed integrated checklist

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C8.01 | Audience definition | 2 | Strip: مدیران ارشد / راهبران تحلیل (موقت) | Confirm with stakeholders; drop «موقت» when signed | Low |
| C8.02 | Business purpose | 2 | Explicit «پرسش بازه» on volume + coverage | Keep | — |
| C8.03 | Big Idea | 2 | Dominant sentence from live KPIs | Keep | — |
| C8.04 | Contextual completeness | 2 | Period chips, gloss, caveats, DemoBanner API mode | Keep | — |
| C8.05 | Appropriate visual selection | 2 | Line; h-bars; text % — post Ch.2/6 | Keep on `/`; sync helpers elsewhere | — |
| C8.06 | Data representation accuracy | 1 | Scales/labels honest; eligibility/FinishTime unsigned | Sign rules before promoting resolution KPIs | High |
| C8.07 | Effective comparison | 2 | Sorted bars; chrono line; MoM annotation | Keep | — |
| C8.08 | Clutter elimination | 1 | Much cleaner; storytelling prose + per-KPI «جزئیات ←» add load | Compact mode or show detail cue on hover/focus only | Medium |
| C8.09 | Visual organization | 2 | Story-beat sections + collapsed appendix | Keep | — |
| C8.10 | Strategic attention | 2 | Amber strip first; spotlight exception | Keep | — |
| C8.11 | Visual hierarchy | 2 | Spotlight > primary > appendix | Keep | — |
| C8.12 | Meaningful emphasis | 2 | Amber exception; thick primary line; max bar | Keep | — |
| C8.13 | Interaction usability | 2 | Selects, reset, chips, modal, appendix toggle (**confirmed**) | Keep | — |
| C8.14 | Accessibility | 1 | Labels, dialog, chart `role=img`; no WCAG lab | Contrast sample + SR pass on charts | High |
| C8.15 | Design consistency | 1 | Shell/tokens coherent; drill pages less story-shaped | Reuse SectionLabel/story order on top 3 drill pages | Medium |
| C8.16 | Narrative structure | 2 | Context → results → evidence → actions | Keep | — |
| C8.17 | Evidence-supported conclusions | 2 | Descriptive KPI synthesis; no fake causes | Keep | — |
| C8.18 | Clear business implications | 1 | Next questions clear; decision owners unnamed | Add owners only when business provides them | Medium |
| C8.19 | Overall communication effectiveness | 2 | Main message readable in first viewport | Keep | — |
| C8.20 | Integrated design quality | 1 | `/` integrates six lessons; product + UAT incomplete | Close acceptance + cross-page parity | High |

**Points:** 28 + 6 = **34 / 40 = 85%**

---

## Section 5 — Cross-page consistency assessment

| Topic | Observation |
|-------|-------------|
| Colors / tokens | Shared brand teal, slate, amber exception — consistent |
| KPI formatting | fa-IR via shared utils; feasibility chips shared on executive; monitoring page has its own catalog UI |
| Typography / spacing | Vazirmatn + ChartCard shared |
| Chart conventions | Executive uses shared `horizontalBarOption` / EChart a11y; other pages have local options — **partial** |
| Filters | Global Header filters apply across pages — strength |
| Narrative | `/` has story beats; `/analytics/requests`, `/performance/kpi` are exploration layouts without Big Idea/end actions |
| Coherent overall product | Shell yes; **communication depth concentrated on executive** |

**Unified approach:** Treat `/` as the narrative home; drill pages open with a one-line “you came from: coverage/volume” context + same filter chips (already global) + avoid reintroducing pie/gauge patterns.

---

## Section 6 — Critical findings and design conflicts

| Conflict | Why it matters | Resolution |
|----------|----------------|------------|
| Strong storytelling text vs glanceability | Gloss + leads + هست/نیست help self-service but slow skimmers | Keep for default; optional «نمای فشرده» later |
| Coverage exception emphasized vs drivers unavailable | Attention says “look here” but factors aren’t in Didban | Keep honest هست/نیست; don’t invent drivers |
| FinishTime in appendix vs users may never open it | Hides unsigned metrics (good) but also hides caution | Leave collapsed; mention once in insight #3 (already) |
| Executive story excellence vs gallery drill pages | Users leaving `/` lose narrative scaffolding | Add thin context strip on drill pages |
| “Decision-making” header subtitle vs investigation reality | Header still says تصمیم‌گیری سطح سازمان; body is investigation | Soften header subtitle to match investigation posture |

No confirmed case of the dashboard asserting an unsupported causal business conclusion.

---

## Section 7 — Prioritized remediation plan

### Critical corrections

| Priority | Severity | Component | Problem | Recommended change | Benefit | Criteria | Prior lesson |
|----------|----------|-----------|---------|--------------------|---------|----------|--------------|
| 1 | High | Governance | Eligibility/audience unsigned | Business sign-off on rules + audience | Trust for resolution KPIs | C8.06, C8.01 | Ch.1 / Ch.5 acceptance |

### High-priority improvements

| Priority | Severity | Component | Problem | Recommended change | Benefit | Criteria | Prior lesson |
|----------|----------|-----------|---------|--------------------|---------|----------|--------------|
| 2 | High | A11y | No formal test | Contrast + keyboard/SR sample on `/` | Inclusive access | C8.14 | Ch.5 |
| 3 | High | Cross-page | Drill pages lack story shell | One-line context + shared chart helpers | Product coherence | C8.15, C8.20 | Ch.7/8 |

### Medium-priority improvements

| Priority | Severity | Component | Problem | Recommended change | Benefit | Criteria | Prior lesson |
|----------|----------|-----------|---------|--------------------|---------|----------|--------------|
| 4 | Medium | Header copy | «تصمیم‌گیری» overstates | Align subtitle to monitoring/investigation | Message match | C8.02, C8.18 | Ch.1/7 |
| 5 | Medium | KPI cards | Always-on «جزئیات ←» | Show on focus/hover only | Less clutter | C8.08 | Ch.3 |
| 6 | Medium | Implications | No named owners | Add only after business names them | Actionability | C8.18 | Ch.7 |

### Optional refinements

| Priority | Severity | Component | Problem | Recommended change | Benefit | Criteria | Prior lesson |
|----------|----------|-----------|---------|--------------------|---------|----------|--------------|
| 7 | Low | Density | Long self-service copy | Compact / briefing toggle | Dual use-case | C8.08, C8.19 | Ch.5/7 |
| 8 | Low | Coverage depth | No factor split | If API later supports coverage-by-class, add one chart | Stronger middle | C8.07 | Ch.6/7 |

---

## Section 8 — Proposed improved dashboard structure

Current `/` structure already matches the recommended narrative. Proposed **target** (mostly already implemented):

| Section | Business purpose | Audience question | KPIs / visuals | Main message | Supporting | Filters |
|---------|------------------|-------------------|----------------|--------------|-----------|---------|
| Opening strip | Situation | What is the posture this period? | Big Idea text | Volume + coverage + SLA gap | Gloss, توجه | Global period/class |
| نتیجهٔ اصلی | Outcomes | What are the two numbers? | Spotlight volume + coverage | Exception on coverage | KPI modal | — |
| شواهد حجم | Evidence | How does volume behave? | Line + class bars + complaint/non-complaint | Trend + mix | MoM subtitle | — |
| شواهد پوشش و موضوعات | Evidence | Where to look next on coverage/topics? | Subjects + channel/org; هست/نیست | Availability low; no Validity | Caveat | — |
| نتیجه و اقدام | Close | What should we do/investigate? | Insights + checklist links | Investigate, don’t overclaim | — | — |
| پیوست | Limits | What can’t we decide yet? | needs_rules / unavailable / FinishTime | Rules pending | Collapsed | — |

**Assumptions / missing (do not invent):** signed audience; coverage-by-dimension; named action owners.

Drill pages: keep analytical; add only a context strip (“بازگشت به داستان مدیریتی: پوشش پاسخ”).

---

## Section 9 — Final verdict

| | |
|--|--|
| **Score** | **85%** (34/40) |
| **Assessment** | Good — six lessons largely pull together on the executive page |
| **Most important correction first** | Stakeholder sign-off (audience + eligibility/resolved rules) |
| **Three highest-value improvements** | (1) Sign-off (2) formal a11y sample (3) thin story shell on key drill pages |
| **Combines all six lessons?** | **Yes on `/`**; partially across the wider IA |
| **Ready for intended audience?** | **Conditionally yes** for M1 investigation monitoring; **no** for signed operational decisions |
| **Further testing required** | 3-user walkthrough; WCAG contrast/keyboard; eligibility workshop |

---

## Remediations

_Status: audit only — no further code remediations required for Chapter 8 integration on `/` beyond residual plan above (governance / a11y / cross-page)._

Chapter 8 is a synthesis chapter: executive narrative integration is largely complete via Ch.1–7 fixes. Remaining work is **acceptance, accessibility verification, and product-wide consistency**, not another full redesign of `/`.
