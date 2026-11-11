# Didban Inspection Notes (Read-Only — Verified)

## Policy

- **No INSERT / UPDATE / DELETE / DDL** on Didban
- Metadata + limited SELECT profiling only
- Do not invent schema; document only verified objects
- Secrets stay in local env / secret manager — **never commit credentials**
- Credentials shared in chat should be **rotated**

## Connection (Verified 2026-11-11)

| Item | Verified Value |
|------|----------------|
| Engine | Microsoft SQL Server 2016 Enterprise (SP3) |
| Host | `10.1.0.156` (internal) |
| Default DB | `DidehbanDb` |
| Login | provided out-of-band |
| Access mode | Read SELECT works; TrustServerCertificate required for ODBC 18 |
| `DidehbanAttachment` | **Login failed** for current user — attachments not inspectable yet |

## Critical Domain Correction

The live Didban schema and taxonomy are clearly **سازمان بهزیستی (State Welfare Organization)**, not Iranian Social Security (تأمین اجتماعی).

Evidence: `Zone`/`SubjectNature`/`SubjectGroup` naming (توانبخشی، اورژانس اجتماعی، مستمری توانبخشی، همیار، …) and province `Region` list.

**Action:** Treat the master brief’s “Social Security” wording as **product framing to reconcile with stakeholders**. Analytical design must follow **Behzisti Didban reality**.

## Core Entity Model (Verified)

| Concept | Table | Rows (approx) | Role |
|---------|-------|---------------|------|
| Case / ticket | `Cookie` | **192,937** | Primary request unit |
| Citizen / informer + geo | `Inform` | 192,937 | 1:1 with Cookie; Region/Area/lat-long |
| Workflow step | `CookieFlow` | ~632,460 | Status transitions + operator text + citizen reply |
| Workbasket snapshot | `Cartable` | ~30,073 | Open/active work items |
| Follow-up | `CookiePursuit` | ~150,110 | Pursuit comments (replies mostly empty) |
| Topic leaf | `Subject` | 420 | Hierarchical leaf subjects |
| Topic group | `SubjectGroup` | 93 | Mid taxonomy |
| Domain / nature | `SubjectNature` | 30 | Organizational domain |
| Class | `SubjectClass` | 4 | شکایت / راهنمایی / گزارش / پیشنهاد |
| Org unit | `Department` | 1,710 | Assignment target |
| Province | `Region` | 33 | Geographic |
| Channel | `CookieChannel` | 10 | پیام، اینترنت، صوتی، PWA، بله، … |
| Status | `CookieStatus` | 30 | Lifecycle + satisfaction outcomes |
| Outbound SMS | `Sentbox` | ~208k | Delivery messages — **not** knowledge base answers |
| FAQ | `FAQ` | 5 | Negligible for coverage KPIs |

### Time span

`Cookie.CookieTime`: **2020-01-25 → 2026-11-11** (live growth).

Yearly volume (Cookie): 2020: 3.9k → 2021: 25k → 2022: 32k → 2023: 42k → 2024: 35k → 2025: 30k → 2026 YTD: 24.5k.

## Classification Dimensions (Use These — Do Not Hardcode Healthcare/Insurance)

### SubjectClass (complaint vs non-complaint)

| Id | Name | Count |
|----|------|------:|
| 3 | راهنمایی و ارشاد | 136,513 |
| 1 | شکایت | 48,555 |
| 4 | گزارش | 6,844 |
| 5 | پیشنهاد | 1,025 |

### CookieType

All current Cookies are `CookieTypeId = 1` (پیام). Other types exist in lookup but are unused in Cookie fact table.

### CookieStatus (top)

| Id | Name | Count |
|----|------|------:|
| 37 | رسیدگی توسط پردازش | 137,877 |
| 38 | تایید نهایی | 26,818 |
| 12 | قابلیت توزیع ندارد | 25,347 |
| 40 | توزیع مجدد زمانبر - پیگیری ویژه | 1,019 |
| 31 | ارجاع شد | 926 |

Satisfaction statuses exist (`رضایت` / `عدم رضایت`) but are **almost unused** on Cookie (only 2 rows for status 21).

### Top Subjects (examples)

1. حق پرستاری و مددکاری افراد دارای معلولیت شدید و خیلی شدید — 28,912  
2. پیامهای صوتی غیر قابل پیگیری — 24,457  
3. افزایش مبلغ، میزان و زمان واریز مستمری توانبخشی — 19,019  
4. کمک موردی توانبخشی — 11,160  
5. برقراری مستمری توانبخشی — 9,984  

## Field Feasibility Snapshot

| Need | Field(s) | Quality |
|------|----------|---------|
| Case id + created | `CookieId`, `CookieTime` / Solar | Excellent |
| Caption/text NLP | `CookieCaption`, `CookieText` (~99.9% filled) | Excellent |
| Finish / resolution time | `CookieFinishTime` (~98.5% filled) | Strong |
| Class complaint/request | `SubjectClassId` | Strong |
| Taxonomy | `SubjectId` → `SubjectGroupId` → `SubjectNatureId` / `ZoneId` | Strong |
| Org unit | `DepartmentId` (100% filled on Cookie) | Strong |
| Channel | `CookieChannelId` | Strong (مرکز پیام dominant ~161k) |
| Geo | `Inform.RegionId` (100%), `AreaId` (~87%), lat/long sparse | Strong for province |
| Critical flag | `CookieIsCritical` | Present (rare) |
| Linked / referring | `ReferringCookieId` (409 only) | Weak for “repeat” KPI |
| Pursuit count | `CookiePersuitsCount` (~29k > 0) | Useful proxy |
| Citizen-facing answer text | `CookieFlow.CookieFlowReplyCitizen` | **Only ~12,220 distinct Cookies (~6.3%)** |
| Flow operator text | `CookieFlowText` / `CookieFlowDesc` | Abundant but **not validated as reusable legal answers** |
| SLA deadline on Cookie | `CookieDeadlineTime` | **0 populated** |
| SLA deadline on Cartable/Flow | `*DeadlineTime` | **0 populated** |
| Delay signal | `CookieFlow.CookieFlowDelayTime` (>0 on ~350k flows) | Candidate delay KPI — semantics need business confirm |
| Discontent | `CookieFlowDiscontentCount` | ~136k flows with >0 — candidate CX signal |
| Satisfaction score | `SatisfactionScore`, `CookieScore` | **Not usable** (null/zero) |
| FAQ knowledge | `FAQ` | 5 rows — not a knowledge base |
| Attachments | `DidehbanAttachment` | **No access yet** |
| Regulation versioning | — | **Not found** in inspected objects |

## PII Warning

`Inform`, `Agent`, and reply texts contain national codes, phones, names, addresses. Aggregate dashboards must **exclude raw PII**. Drill-down tables require RBAC + masking.

## Next Inspection Tasks (Still Open)

1. Agree closed-status set for “Resolved” (37/38/15/19/6/…?)
2. Confirm meaning of `CookieFlowDelayTime` and discontent counters
3. Map `Department` hierarchy (`DepartmentChart`) for org performance
4. Gain read-only access to attachments DB if needed for evidence
5. Locate any circular/regulation store outside Didban (not present here)
6. Sample quality of `CookieFlowReplyCitizen` vs operator notes for “historical answer” study
