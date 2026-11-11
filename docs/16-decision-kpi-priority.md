# Decision KPIs — priority to implement (signed as product owner)

Audience: Behzisti ops / analytics leads. Purpose: **decide where to fix reply capture and intake noise**, not run silent AI closers.

## Near-real-time rule

| Layer | Cadence | Meaning |
| --- | --- | --- |
| Didban OLTP | continuous | Source of truth (read-only) |
| AiTicket API cache | **3 minutes** | Aggregate snapshot; `generatedAt` is freshness |
| Executive UI | poll / manual refresh | Shows age; `?fresh=1` bypasses cache |

“Realtime” here = **fresh aggregates ≤ cache TTL**, not per-row streaming.

## Decision KPI set (feasible now)

| Code | Name | Formula | Decision use |
| --- | --- | --- | --- |
| **A1** | Volume | `COUNT(Cookie)` | Workload size |
| **A2** | Complaints | `SubjectClassId=1` | Complaint load |
| **A2s** | Complaint share | A2/A1 | Mix shift |
| **D1** | Blended Availability | share with `ReplyCitizen` | Context only — **do not manage to this** |
| **D1c** | Complaint Availability | D1 on شکایت | Primary ops health |
| **D1g** | Guidance Availability | D1 on راهنمایی | Policy: capture vs FAQ |
| **D1x** | Complaint ex-voice | D1c excluding SubjectId **357** | True complaint reply rate |
| **N1** | Voice-noise share | Subject 357 / complaints | Intake deflection |
| **N2** | Auto-register dead-end | شکایت on «ثبت خودکار» with reply% | Routing fix |

**Out of decision set until signed:** B1/B2/B3 FinishTime, C3 SLA, D3 Validity.

## Implementation priority (apply in order)

| P | Item | Status in this change |
| --- | --- | --- |
| **P0** | Compute D1c / D1g / D1x / N1 / N2 in executive API | Applied |
| **P0** | Executive story: Big Idea + insights from class-split, not blended D1 | Applied |
| **P0** | Freshness chip + refresh (`fresh=1`) | Applied |
| **P1** | Diagnosis board + action register (already shipped) | Done earlier |
| **P1** | Default exclude subject 357 from complaint D1 denominator (D1x primary) | Applied as KPI |
| **P2** | Persist actions server-side | Not yet |
| **P2** | Eligibility / resolved sign-off → promote B* | Blocked on business |
| **P3** | Embedding assist for high-D1c subjects | Later |

## Story spine (executive)

1. **Situation:** volume + complaint share  
2. **Tension:** blended D1 misleads; D1c vs D1g diverge  
3. **Evidence:** subjects, voice noise, auto-register  
4. **Action:** deflect voice · fix auto-register · answer packs on high-D1c topics · policy on guidance
