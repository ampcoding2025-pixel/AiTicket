# BI Dashboard Assessment — Chapter 10: Final Thoughts (Continuous Improvement)

| Field | Value |
|-------|--------|
| Book | *Storytelling with Data* — Cole Nussbaumer Knaflic, Ch.10 (practical adaptation) |
| Chapter | 10 — Final Thoughts / continuous improvement & capability |
| Scope | AiTicket BI project practices (docs, `docs/dashboard-audit/`, git history, product remediations) — **not** Behzisti enterprise BI org as a whole |
| Date | 2026-11-11 |
| Evidence base | Product docs `01`–`14`; SWD Ch.1–9 audits + applied remediations; roadmap `09`; git log on `main` |
| Verdict | **Needs improvement** — strong project-level practice loop; weak end-user validation & formal QA ownership |
| Score | **24 / 40** → **60%** |
| Confidence | **Medium** for this repo/project; **Low** for broader organizational BI capability |

| Metric | Count |
|--------|------:|
| Total criteria | 20 |
| Applicable | 20 |
| N/A | 0 |
| Score 0 | 2 |
| Score 1 | 12 |
| Score 2 | 6 |
| Insufficient evidence (qualified, not scored as 0 solely for missing org docs) | Noted under C10.07, C10.14, C10.17 (partial) |

---

## Section 1 — Executive summary

**Overall:** 60% — Needs improvement (maturity of *process*, not of the executive UI alone).

This project demonstrates a rare, evidence-rich loop: **chapter audit → remediation → commit → re-audit**. Storytelling principles are applied in code, not only discussed. What is missing for Chapter 10 maturity is **sustainable organizational machinery**: named owners, end-user testing, peer review gates, and a periodic improvement cadence beyond the current book-driven sprint.

**Three strongest practices**

1. **Practical application** — Ch.1–9 remediations landed in the live executive/drill UI (git + audit “Remediations applied” tables).
2. **Iteration with recorded rationale** — each chapter audit documents scores, severity, and exact file changes.
3. **Shared terminology emerging** — Big Idea, clutter, feasibility, Availability≠Validity, spotlight, appendix — in UI + `docs/04` KPI dictionary + audits.

**Three largest capability gaps**

1. **No confirmed end-user involvement / UAT** (docs repeatedly: sign-off pending).
2. **No peer-review / release QA gate** visible (direct `main` commits; no review checklist artifact).
3. **Ownership & continuous schedule** not assigned beyond informal roadmap maintenance.

**Maturity:** Project = **forming → early performing** on SWD craft; Organization (beyond this repo) = **insufficient evidence**.

**Confidence:** Medium — strong for repo practices; cannot judge enterprise training, HR learning plans, or offline stakeholder workshops without interviews.

---

## Section 2 — Checklist results

| Criterion ID | Criterion | Score | Evidence source | Findings | Recommendation |
|--------------|-----------|------:|-----------------|----------|----------------|
| C10.01 | Tool competency | 2 | `web/` Next.js+ECharts; `api/` Dapper; Ch.5 a11y/dialog; Ch.9 `sortedHorizontalBar` | Creators (project team/agents) exercise platform capabilities beyond defaults | Keep a short “how we chart” note next to helper modules |
| C10.02 | Data storytelling knowledge | 2 | `docs/dashboard-audit` Ch.1–9 | Audience, Big Idea, clutter, attention, narrative explicitly assessed | Maintain audit folder as living reference |
| C10.03 | Practical application | 2 | Commits `5e48246`…`9ba3635` + applied remediation sections | Principles changed product, not only docs | Continue audit→fix for remaining pages |
| C10.04 | Iterative design | 2 | Multi-chapter fix cycles on `/` then drills | Multiple redesign passes with evidence | Capture iteration notes in roadmap after book series ends |
| C10.05 | Feedback collection | 1 | Chapter audits as expert feedback; `09` open stakeholder items | Expert feedback active; **end-user feedback not evidenced** | Run 3-user walkthrough; log findings |
| C10.06 | Feedback implementation | 2 | Audit remediations → code → push | Useful findings became UI changes | Keep remediations table + commit link |
| C10.07 | Design time allocation | 1 | Substantial SWD work in session/history; no formal hours in plan | Time was spent, but not reserved as a named workstream in `09` | Add “communication design” line to roadmap P-items |
| C10.08 | Inspiration and learning | 1 | Systematic use of SWD book | Strong book learning; few external exemplar galleries | Optional: 1–2 reference dashboards in `docs/` |
| C10.09 | Experimentation | 1 | Pies→bars; layout reorder Ch.7; emphasis Ch.4/6 | Alternatives tried across iterations; no formal A/B | Keep spike branches for risky chart changes |
| C10.10 | Shared design standards | 1 | Helpers (`sortedHorizontalBar`, `KpiCard`, `ChartCard`); audits | Conventions in code; **no standalone design-standards.md** | Extract 1-page standard from Ch.8/9 remediations |
| C10.11 | Shared terminology | 2 | `04` KPI dict; UI gloss; audit vocabulary | Common language for KPI/Big Idea/feasibility/clutter | Publish glossary stub in `docs/` |
| C10.12 | Peer review | 0 | Git: commits to `main`; no PR review artifacts in repo | **Confirmed gap** for this project’s visible process | Require second reviewer or checklist before release tags |
| C10.13 | User involvement | 0 | `09`/`12` awaiting sign-off; Ch.5/8 audits: no UAT records | **Confirmed gap** | Schedule business + end-user review of `/` |
| C10.14 | Team learning | 1 | SWD chapter series as structured learning | Effective for this project; no workshop/training evidence beyond it | Insufficient evidence for org training — collect from stakeholders |
| C10.15 | Reusable examples | 1 | Shared chart helper; ChartCard; audit remediations | Seed of a pattern library | Add `docs/15-visual-patterns.md` pointing at helpers |
| C10.16 | Continuous improvement | 1 | Rapid improvement during Ch.1–9; no calendar review trigger | Event-driven improvement works now; not yet periodic | Define review trigger (release / quarterly / KPI change) |
| C10.17 | Ownership and accountability | 1 | Roadmap exists; Behzisti context; no named dashboard owner | Implicit ownership only | Assign product owner + analytics owner in roadmap |
| C10.18 | Business relevance | 1 | Didban Outside-In; 6.3% coverage truth; provisional audience | Strong domain alignment; unsigned questions | Close eligibility / audience workshop |
| C10.19 | Quality review process | 1 | Informal SWD chapter QA | Repeatable *during this series*; not a release SOP | Adopt Section 7 process as lightweight gate |
| C10.20 | Organizational adoption | 1 | Embedded in AiTicket recent practice | Not evidenced as Behzisti-wide BI policy | Pilot standards only for this product first |

**Points:** 12 + 12 + 0 = **24 / 40 = 60%**.

---

## Section 3 — Individual and project practices

| Area | Assessment |
|------|------------|
| Tool competency | Confirmed strong for current stack |
| Storytelling knowledge | Confirmed via chapter audits |
| Practical application | Confirmed via remediations |
| Iteration | Confirmed multi-pass |
| Feedback | Partial — expert yes, users no |
| Time allocation | Partial — done in practice, not planned as a named stream |
| Experimentation / learning | Partial — book-driven experiments; limited external inspiration library |

**Strength:** The project already *behaves* like a learning team on SWD craft.  
**Gap:** Learning is concentrated in one intensive book series, not yet converted into standing habits (peer review, UAT, owners).

---

## Section 4 — Team and organizational maturity

| Area | Documented? | Used in practice? |
|------|-------------|-------------------|
| Shared standards | Partially (audits + code) | Yes on `/` and recently drills |
| Terminology | Yes (`04`, UI gloss) | Yes |
| Peer review | No | No evidence |
| User involvement | Called out as pending | Not done |
| Training | SWD series only | Project-local |
| Reusable examples | Helpers emerging | Informal |
| Continuous improvement | Roadmap + audits | Event-driven |
| Ownership | Roadmap authors implicit | Unclear named roles |
| QA before release | Informal chapter gates | Not a formal checklist |

**Distinction:** High-quality *project craft* ≠ mature *organizational system*. Chapter 10 scores the latter more harshly—and correctly so.

---

## Section 5 — Evidence gaps

| Criterion | Missing evidence | Why needed | Who could provide | How to resolve |
|-----------|------------------|------------|-------------------|----------------|
| C10.05 / C10.13 | User interview notes, UAT checklist | Prove consumers understand the story | Intended managers / analysts | 3-user walkthrough with task list from Ch.5 audit |
| C10.07 | Project plan hours for “communication design” | Show intentional time allocation | Project lead | Add line item to `09` |
| C10.12 | PR reviews / review sign-offs | Prove second-person QA | Tech lead | Enable PR workflow or signed checklist |
| C10.14 | Training attendance / curriculum | Org learning beyond this repo | HR / BI lead | Interview: what training exists? |
| C10.17 | Named RACI for dashboard quality | Accountability | Product owner | Name owners in `09` |
| C10.20 | Enterprise BI standards | Org adoption | Architecture / BI CoE | If none, keep scope = this product |

---

## Section 6 — Prioritized improvement roadmap

### Critical

| Problem | Evidence | Action | Suggested role | Benefit | Success measure | ID |
|---------|----------|--------|----------------|---------|-----------------|-----|
| No end-user validation | Ch.5/8 audits; `09` open sign-off | Run 3-user task walkthrough on `/` | Product owner + 2–3 users | Avoid elegant but unused story | ≥2/3 complete tasks without help | C10.13, C10.05 |
| Eligibility/audience unsigned | `09`, `12` | Workshop to sign rules + audience | Business stakeholder | Decision-grade KPIs | Signed `eligibility-v0.1` | C10.18 |

### High

| Problem | Evidence | Action | Suggested role | Benefit | Success measure | ID |
|---------|----------|--------|----------------|---------|-----------------|-----|
| No peer review gate | Git to `main` without review artifacts | Checklist or PR review before release tags | Tech lead | Catch regressions | 100% releases have checklist | C10.12, C10.19 |
| No named quality owner | Roadmap unsigned roles | Assign dashboard owner + analytics owner | Project sponsor | Sustained improvement | Names in `09` | C10.17 |

### Medium

| Problem | Evidence | Action | Suggested role | Benefit | Success measure | ID |
|---------|----------|--------|----------------|---------|-----------------|-----|
| Standards only in code/audits | No design-standards doc | Write 1–2 page visual standard from Ch.8–9 | BI developer | Onboarding & consistency | Doc linked from README | C10.10, C10.15 |
| No periodic review trigger | Improvement only via book sprint | Quarterly or post-KPI-change review of `/` | Dashboard owner | Continuity after Ch.10 | Calendar entry + notes | C10.16 |
| Design time not planned | Ad hoc intensive work | Explicit “communication design” tasks in roadmap | Project lead | Protect craft time | Tasks in next P-phase | C10.07 |

### Low

| Problem | Evidence | Action | Suggested role | Benefit | Success measure | ID |
|---------|----------|--------|----------------|---------|-----------------|-----|
| Limited external inspiration | Only SWD used | Collect 2 exemplar links in docs | Any designer | Broader taste | 2 links documented | C10.08 |

**Immediate:** user walkthrough + eligibility workshop.  
**Short-term:** peer checklist, named owners, visual-standards page.  
**Long-term:** periodic review cadence; optional org-wide adoption only after this product is stable.

---

## Section 7 — Proposed BI quality-assurance process

Lightweight process proportionate to a small team (no heavy bureaucracy):

| Stage | Activity | Evidence to record |
|------:|----------|--------------------|
| 1 | Audience, purpose, Big Idea (who / what / so what) | Short note in PR or `docs/` (≤10 lines) |
| 2 | Metrics + chart choice vs question | Link to KPI dict feasibility |
| 3 | Build with shared helpers (`ChartCard`, `sortedHorizontalBar`, Kpi emphasis) | Code review against visual standard |
| 4 | Design + data-accuracy review | Second person or checklist: scales, labels, caveats |
| 5 | Usability with ≥1 representative user | Task results + confusion notes |
| 6 | Feedback → changes | Checklist items closed or deferred with reason |
| 7 | Approve & release | Tag / changelog mentioning communication risks |
| 8 | Monitor relevance | Filter usage notes; open questions in `07`/`09` |
| 9 | Periodic review | Quarterly or when Didban rules change |

This mirrors the successful **audit → remediate** loop already used for Ch.1–9, made durable after the book series ends.

---

## Section 8 — Final verdict

| | |
|--|--|
| **Maturity** | Strong *project craft*; early *process maturity* (60%) |
| **Largest gaps** | End-user involvement; peer/release QA; named ownership |
| **Repeatable & sustainable?** | **Repeatable during the SWD series** — **not yet sustainable** without owners + schedule + UAT |
| **Three highest-priority actions** | (1) 3-user walkthrough (2) eligibility/audience sign-off (3) release checklist + named owners |
| **More evidence needed** | Interviews on training; RACI; whether offline stakeholder reviews already happened |

Chapter 10’s message: keep practicing. AiTicket has practiced hard on the executive product; the next leap is making that practice **institutional** so quality does not depend on another intensive audit marathon.

---

## Remediations

_Status: audit only — process recommendations; no code change required for Chapter 10 itself._

Suggested first doc follow-ups (when requested): `docs/15-visual-patterns.md`, roadmap owner names, UAT notes template.
