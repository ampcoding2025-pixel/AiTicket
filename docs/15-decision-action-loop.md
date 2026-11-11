# Decision → action → remeasure (M1 slice)

## Intent

Close the gap between **honest diagnosis** (Didban Availability / volume) and **operational follow-up**, without treating agents or dashboards as silent decision-makers.

Loop: **finding (SQL/dashboard) → proposed action + owner + due date → remeasure the same KPI**.

## What shipped

| Piece | Where | Notes |
| --- | --- | --- |
| Coverage by department / subject | API `AnswerIntelligence` + `/knowledge/answers` | TOP 12 by eligible volume; `%` = citizen reply Availability — **not** Validity |
| Diagnosis board | `HistoricalAnswerIntelligence` | Bars + table; CTA seeds action form |
| Action register | `/performance/actions` | Browser `localStorage` only; **no Didban writes** |

## Explicit non-goals (this slice)

- TF-IDF / LDA / embedding retrieval as decision engines
- Fake Validity, expert-review %, or “70% answer” claims
- Server-side action persistence or workflow engine
- Agents that auto-close tickets or change Didban data

## How to use

1. Open **پوشش پاسخ تاریخی** with the period/unit filters you care about.
2. Read coverage-by-unit / subject; pick the high-volume / low-coverage gap.
3. **ثبت اقدام از این یافته** → fill owner, action, due date, expected effect, remeasure date.
4. After the remeasure date, re-open the same filters and compare D1 / dimension coverage — update action status.

## Next (optional)

- Persist actions to an org store once ownership is signed off
- Eligibility / FinishTime rules before promoting B2/B3 as decision-grade
- Embedding-assisted similar-case **assist** (human-in-the-loop), still Availability≠Validity
