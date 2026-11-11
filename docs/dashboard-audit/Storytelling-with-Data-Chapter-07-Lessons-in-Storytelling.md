# BI Dashboard Assessment — Chapter 7: Lessons in Storytelling

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.7 |
| Chapter | 7 — Lessons in Storytelling |
| Scope | Executive Dashboard `/` (primary); shell Header context; outbound links to answers/categories/KPI as “next steps” |
| Date | 2026-11-11 |
| Baseline | After Ch.1–6 remediations |
| Intended use (assumption) | **Self-service** executive monitoring (Outside-In / Didban read-only), with an opening that can also support a short briefing |
| Inspection | Live `/` + `ExecutiveDashboard.tsx` + `apiProvider` Big Idea / insights builders |
| Verdict | **Partially meets** Chapter 7 — **Needs improvement** |
| Score | **26 / 40** → **65%** |

| Metric | Count |
|--------|------:|
| Criteria evaluated | 20 |
| N/A | 0 |
| Insufficient evidence | 0 (use-case assumed as above) |
| Score 0 | 0 |
| Score 1 | 14 |
| Score 2 | 6 |

---

## Section 1 — Executive summary

**Overall:** 65% — Needs improvement. The page **has** a story seed: Big Idea + «توجه» on low citizen-reply coverage, spotlight KPIs, and an actions list. It does **not** yet sustain a clean beginning→middle→end arc: feasibility KPI walls and late org/channel charts interrupt, while the “end” (اقدام بر اساس شواهد) sits in the **middle** of the scroll before more evidence.

**Main business message communicated (observed, not invented):**  
In the selected period, Didban shows large case volume, a substantial complaint share, **low citizen-reply coverage (~6.3% historically) that is Availability not Validity**, and **SLA not computable**. Next steps are investigate coverage samples and category structure; resolution KPIs await business rules.

**Coherent story?** Partially — opening is strong; middle fragments into inventory; closing is misplaced.

**Three strongest storytelling aspects**

1. Opening strip: audience + period + Big Idea + promoted attention insight.
2. Outcome-before-detail: spotlight volume + coverage before charts.
3. Appropriate certainty: caveats, `نیازمند قاعده`, Availability ≠ Validity, no invented causality/forecast.

**Three most important narrative weaknesses**

1. **End buried mid-page** — actions precede subjects/channels/org; story “concludes” then continues.
2. **Weak driver explanation** — low coverage is asserted with a link, not with on-page factors.
3. **Section labels are inventory topics** («حجم و طبقه»، «ساختار سازمانی») not story beats.

**Can users understand the main conclusion?** Yes, if they read the top strip.  
**Useful business implications?** Partially — links and “توجه” point next; implications stay investigation-oriented (correctly), not decision-complete.

---

## Section 2 — Beginning, middle, and end assessment

### Beginning — Establish the situation

| Element | Evidence | Assessment |
|---------|----------|------------|
| Business subject | Header subtitle + Big Idea (پرونده / شکایت / پوشش پاسخ) | Clear |
| Period / scope | Filter chips + strip `بازه:` | Clear |
| Audience | «مدیران ارشد / راهبران تحلیل (موقت)» | Clear (provisional) |
| Opening overview | Big Idea sentence from live KPIs | Strong |
| Business question | Implied: volume + knowledge coverage posture | Partial — not posed as an explicit question |

### Middle — Explain what happened

| Element | Evidence | Assessment |
|---------|----------|------------|
| Sequence of findings | Spotlight → other KPIs → needs_rules → unavailable → volume/class | Feasibility inventory interrupts story |
| Supporting evidence | Volume MoM subtitle + bars; coverage KPI | Volume/coverage supported; drivers thin |
| Trends / exceptions | Volume annotation; coverage «استثناء» | Present |
| Section connections | Weak explicit “why this chart next” | Partial |

### End — What it means

| Element | Evidence | Assessment |
|---------|----------|------------|
| Conclusion | Attention insight + insight #1 | Present but duplicated early |
| Implications | Caveats; not validity; rules pending | Cautious — good |
| Actions / next questions | Links to answers / categories / KPI | Present |
| Final takeaway | Page **ends** on channel/org/FinishTime, not on actions | Weak ending |

**Missing / weak:** A true closing beat; on-page coverage drivers; story-oriented section headings.

---

## Section 3 — Narrative flow assessment

**Current order (confirmed):**

1. Story strip (Big Idea + توجه)  
2. Spotlight KPIs  
3. Other feasible KPIs  
4. Needs-rules KPIs  
5. Unavailable KPIs  
6. Volume + class charts  
7. **Actions + links** ← narrative “end”  
8. Subjects + coverage detail  
9. Channel + department + FinishTime  

**Problems**

- Steps 3–5 are catalog, not story.
- Step 7 should follow supporting evidence (8–9) or sit last.
- Step 9 introduces resolution theme late without tying back to Big Idea (SLA already said unavailable).

**Recommended sequence (reuse existing elements — no invented facts):**

1. Context + Big Idea + توجه (keep)  
2. Spotlight KPIs (keep)  
3. Volume + class (evidence for volume/complaint share)  
4. Subjects + coverage detail (evidence for coverage exception)  
5. Optional: one org/channel panel **only if** tied to a finding (“where volume concentrates”)  
6. Actions + links (true end)  
7. Demote needs_rules / unavailable / FinishTime to a collapsed «حدود داده و قواعد» appendix  

---

## Section 4 — Main message and evidence assessment

| Topic | Finding |
|-------|---------|
| Central message | Identifiable at top (volume + low coverage + SLA gap) |
| Titles | Mixed — volume subtitle insight-like; many section labels still topical |
| Supporting metrics | Spotlight KPIs align; FinishTime block less tied to opening message |
| Facts vs interpretation | Strong — insights cite %, validity disclaimer, rules pending |
| Unsupported causation | **None observed** — does not claim *why* coverage is low |
| Conclusions | Supported as descriptive summaries of displayed KPIs |

**No conclusion invented beyond what KPIs show.** Gap is explanatory depth (drivers), not overclaim.

---

## Section 5 — Repetition and message reinforcement

| Pattern | Assessment |
|---------|------------|
| Coverage in Big Idea + توجه + spotlight + insight #1 + mid panel | Useful reinforcement at top; **mid panel duplicates** after actions — clutterish |
| Terminology | Persian + English tokens (`Cookie`, `SubjectClass`, `Availability`, `FinishTime`) — inconsistent for executives |
| Color | Amber ≈ exception/attention — fairly consistent |
| Complaint share | In Big Idea; volume chart shows شکایت line — good reinforcement |

**Purposeful vs redundant:** Top triple reinforcement is purposeful; coverage card after actions is largely redundant for storytelling (keep caveat once near spotlight or move card before actions).

---

## Section 6 — Spoken and written communication assessment

**Assumption:** Primary = **self-service**; secondary = short executive briefing using the opening strip.

### Self-service (primary)

- Independent takeaway possible from strip alone → strength.  
- Long scroll + mid actions + late charts → users may miss the intended close.  
- Annotations (volume MoM, caveats) help without a presenter.  
- Navigation links support “what next.”

### Presenter-led (secondary)

- Opening supports “3-minute story.”  
- Presenter can ignore feasibility walls; audience scrolling the full page will get distracted.  
- Not slide-sequenced; no progressive disclosure for live talk.

**Limitation:** No observed live briefing; assessment is structural.

---

## Section 7 — Detailed checklist results

| Criterion ID | Criterion | Score | Evidence / Observation | Recommendation | Severity |
|--------------|-----------|------:|------------------------|----------------|----------|
| C7.01 | Clear opening context | 2 | Audience, period, Big Idea, Didban subject | Keep; optional explicit business question line | — |
| C7.02 | Clear central message | 2 | Big Idea + توجه on low coverage | Keep | — |
| C7.03 | Beginning-middle-end structure | 1 | Strong open; end mid-page; charts after “actions” | Move actions to close; appendix for meta-KPIs | High |
| C7.04 | Logical narrative sequence | 1 | Feasibility walls before evidence charts | Reorder per Section 3 | High |
| C7.05 | Outcome before detail | 2 | Spotlight before charts | Keep | — |
| C7.06 | Relevant supporting evidence | 1 | Volume/class support volume; coverage drivers missing | Place coverage evidence before actions | Medium |
| C7.07 | Explanation of drivers | 1 | Link to answers; no on-page factor breakdown | Add “چه چیزی در داده هست/نیست” note — no fake causes | High |
| C7.08 | Clear section relationships | 1 | Labels don’t state role in story | Story-beat headings | Medium |
| C7.09 | Effective transitions | 1 | Abrupt jumps catalog→charts→actions→more charts | Transitional one-liners under SectionLabels | Medium |
| C7.10 | Informative titles | 1 | Volume insight improved; many titles still topical | Finding-oriented section titles | Medium |
| C7.11 | Consistent terminology | 1 | Cookie/SubjectClass/Availability mixed with Persian | Gloss once; Persian primary in story strip | Medium |
| C7.12 | Purposeful repetition | 1 | Top coverage repeat OK; late duplicate panel weak | Deduplicate mid coverage or move earlier | Low |
| C7.13 | Consistent message reinforcement | 1 | Coverage/amber aligned; FinishTime competes | Demote FinishTime from main arc | Medium |
| C7.14 | Clear annotations | 1 | Volume MoM + توجه; sparse elsewhere | One annotation per story beat max | Medium |
| C7.15 | Facts versus interpretation | 2 | Caveats; needs_rules; ≠ Validity | Keep | — |
| C7.16 | Supported conclusions | 2 | Big Idea/insights built from KPI values | Keep; don’t add causal claims | — |
| C7.17 | Appropriate certainty | 2 | No forecast-as-fact; SLA unavailable stated | Keep | — |
| C7.18 | Self-service storytelling | 1 | Top readable alone; body digresses | Reorder for solo reading path | High |
| C7.19 | Presentation storytelling | 1 | Opening briefing-ready; full page less so | Optional “brief mode” / collapse appendix | Low |
| C7.20 | Clear business implication | 1 | Investigate coverage/categories; not a closed decision | End with numbered next questions (existing links) | High |

**Points:** 12 + 14 = **26 / 40 = 65%**

---

## Section 8 — Recommended narrative structure

| # | Purpose | Include (existing) | Move / change | Missing (collect later — do not invent) |
|---|---------|--------------------|---------------|----------------------------------------|
| 1 | Situation & context | Audience, period, filters, DemoBanner | — | Signed audience/question from stakeholders |
| 2 | Main performance result | Big Idea | Keep dominant | — |
| 3 | Most important finding | توجه coverage | Keep under Big Idea | — |
| 4 | Evidence — volume | Volume chart + class bars + complaint KPI | Immediately after spotlights | — |
| 5 | Evidence — coverage / topics | Spotlight coverage, subjects, coverage caveat | **Before** actions; drop redundant second hero | Optional: coverage by class *if* API supports |
| 6 | Implications | Insight list (attention/opportunity/info) | Relabel as «نتیجه و اقدام» at **end** | Owner/action owners when named by business |
| 7 | Next steps | Existing three links | Anchor at end as checklist | — |
| Appendix | Data limits | Needs_rules, unavailable, FinishTime panels | Collapse / foot | Eligibility sign-off |

---

## Section 9 — Prioritized remediation plan

| Priority | Severity | Component | Problem | Recommended change | Storytelling benefit | Criteria |
|----------|----------|-----------|---------|--------------------|----------------------|----------|
| 1 | High | Section order | Actions mid-page; charts after “end” | Reorder: spotlights → volume/class → subjects/coverage → actions/links; appendix meta-KPIs | True beginning–middle–end | C7.03, C7.04, C7.18 |
| 2 | High | Coverage drivers | Finding without factors | Short factual note: what Availability measures + link; **no causal story** | Honest middle | C7.07, C7.06, C7.15 |
| 3 | High | Closing | Implications not last | End on «نتیجه و اقدام» + next questions | Memorable takeaway | C7.20, C7.03 |
| 4 | Medium | SectionLabels | Inventory headings | Story-beat titles (شواهد حجم، شواهد پوشش، نتیجه) | Flow / transitions | C7.08, C7.09, C7.10 |
| 5 | Medium | Terminology | English tokens in story path | Persian primary + technical gloss once | Self-service clarity | C7.11 |
| 6 | Low | Coverage panel | Duplicate after actions | Single placement in evidence middle | Purposeful repetition | C7.12 |
| 7 | Low | Briefing | Long page | Collapse appendix by default | Presenter focus | C7.19 |

---

## Section 10 — Final verdict

| | |
|--|--|
| **Score** | **65%** (26/40) |
| **Assessment** | Needs improvement — strong opening and honest certainty; weak sustained arc and closing |
| **Most important storytelling correction** | Reorder so evidence precedes actions and the page **ends** on implications/next steps |
| **Coherent B/M/E?** | Beginning yes; middle fragmented; end misplaced |
| **Conclusion supported?** | Yes, as descriptive KPI synthesis — not as causal explanation |
| **Pass Chapter 7?** | **No** |
| **Additional needs** | Stakeholder-confirmed business question; optional coverage-by-dimension data for true “drivers” without speculation |

---

## Remediations

_Status: applied 2026-11-11 — Chapter 7 narrative reorder and closing beat._

| # | Change | Files | Criteria |
|---|--------|-------|----------|
| 1 | Story order: Big Idea → نتیجهٔ اصلی → شواهد حجم → شواهد پوشش/موضوعات → **نتیجه و اقدام** (last) | `ExecutiveDashboard.tsx` | C7.03, C7.04, C7.05, C7.18 |
| 2 | Coverage «چه چیزی هست/نیست» note (Availability vs Validity; no causal claim) | `ExecutiveDashboard.tsx` | C7.07, C7.15, C7.06 |
| 3 | End checklist «پرسش‌ها / گام‌های بعدی» with existing links | `ExecutiveDashboard.tsx` | C7.20 |
| 4 | Story-beat SectionLabels + lead transitions | `ExecutiveDashboard.tsx` | C7.08, C7.09, C7.10 |
| 5 | Terminology gloss once under Big Idea | `ExecutiveDashboard.tsx` | C7.11 |
| 6 | Removed duplicate coverage hero; single evidence placement | `ExecutiveDashboard.tsx` | C7.12 |
| 7 | Collapsed appendix for needs_rules / unavailable / FinishTime | `ExecutiveDashboard.tsx` | C7.13, C7.19 |
