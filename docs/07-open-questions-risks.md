# Missing Requirements, Assumptions, Risks & Open Questions

## Access Status (Updated 2026-11-11)

| Item | Status |
|------|--------|
| SQL Server host | Verified `10.1.0.156` |
| Engine | Verified SQL Server 2016 Enterprise |
| Database | Verified `DidehbanDb` |
| Read SELECT | Works (TrustServerCertificate) |
| `DidehbanAttachment` | **Denied** for current login |
| Secrets in Git | Forbidden — rotate chat-shared password |

## Assumptions (Explicit)

- First release is **historical analytics**, not live ticket operations.
- Mock data in the UI is **synthetic** and labeled as demo until integration.
- Live taxonomy is **Behzisti** (`SubjectClass` / `SubjectNature` / `SubjectGroup` / `Subject`) — not Healthcare/Insurance examples from the brief.
- Persian is the default UI language; Gregorian + Jalali dates may both be needed.
- Preferred stack: Next.js frontend + ASP.NET Core modular monolith later.
- LLM assistants may help analysis offline; they are **not** authoritative answer engines in M1.

## Unresolved Product Questions (Prioritized)

1. Confirm product branding: Social Security framing vs **Behzisti Didban** operational reality?
2. Exact closed-status set for “Resolved” (candidates include 37, 38, 15, 19, 6, …)?
3. Business meaning of `CookieFlowDelayTime` and `CookieFlowDiscontentCount`?
4. Who signs off KPI dictionary (business vs IT)?
5. Is location for charts province (`Inform.RegionId`) sufficient, or branch-level required?
6. Should “historical answer” mean `CookieFlowReplyCitizen` only, or also operator `CookieFlowDesc`?
7. Where do circulars/regulations live if not in Didban?
8. What PII masking rules apply for expert drill-down?
9. Acceptance method to replace the “~70% historical answer” claim with a measured study?
10. Can read-only access to `DidehbanAttachment` be granted?

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrong domain narrative (SSO vs Behzisti) | Stakeholder distrust | Documented in `08`/`09`; confirm naming |
| Treating similarity / operator notes as valid answers | Wrong decisions | Availability vs validity split; D3 unavailable |
| Promoting unverified 70% claim | Misleading exec KPIs | Measured D1 ≈ 6.3% citizen reply; study in P4 |
| Empty SLA deadlines shown as compliance | Fake performance | Mark C3 Unavailable |
| PII in text/replies | Compliance failure | Aggregation + RBAC + scrubbing before NLP |
| Premature LLM auto-replies | Legal/operational harm | M2 HITL only |
| Secrets in chat/repo | Security incident | Local env only; rotate password |

## Security Note

Database credentials shared in chat should be treated as **potentially exposed**. Prefer rotating the password and storing secrets only in a secure local/secret manager—not in Git.
