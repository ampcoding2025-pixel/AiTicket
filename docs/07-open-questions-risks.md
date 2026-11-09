# Missing Requirements, Assumptions, Risks & Open Questions

## Blockers for Didban Inspection (Current)

Credentials provided (username only referenced in ops notes — **never commit secrets**).

Still required before any read-only schema discovery:

1. **Host / IP** (and whether VPN or internal network is required)
2. **Port**
3. **Database engine** (SQL Server / Oracle / PostgreSQL / MySQL / other)
4. **Database / schema name**
5. **Read-only confirmation** and allowed object types (tables/views only)
6. **Connection method** (direct TCP, SSH tunnel, jump host, ODBC DSN)

Until these are provided, Didban design inspection cannot proceed. No CRUD will be performed when access is granted—only metadata and SELECT profiling as approved.

## Assumptions (Explicit)

- First release is **historical analytics**, not live ticket operations.
- Mock data in the UI is **synthetic** and labeled as demo until integration.
- Organizational taxonomy examples (Healthcare/Insurance) are **illustrative**, not final.
- Persian is the default UI language; Gregorian + Jalali dates may both be needed.
- Preferred stack: Next.js frontend + ASP.NET Core modular monolith later.

## Unresolved Product Questions

1. Exact definition of “complaint” vs “request” in Didban fields?
2. Which organizational unit hierarchy is authoritative?
3. Is location/branch data available for geographic charts?
4. Are historical answers stored as structured fields or free text?
5. Are circulars/regulations available as linkable documents?
6. Who owns KPI definition sign-off (business vs IT)?
7. What PII fields must never appear in aggregate dashboards?
8. What is the acceptance threshold for the “~70% historical answer” validation study?

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema unknown / undocumented | Integration delay | Read-only discovery phase before KPI wiring |
| Treating similarity as validity | Wrong operational decisions | Validity/version/expert-status model |
| Over-promising AI automation | Stakeholder distrust | Clear M1 vs M2 labeling in UI |
| PII leakage in charts/tables | Compliance failure | Aggregation + RBAC + minimization |
| KPI invented from available columns | Misleading metrics | KPI dictionary first; mark unavailable when fields missing |
| Secrets in repo / chat reuse | Security incident | `.env` local only; rotate if exposed |

## Security Note

Database credentials shared in chat should be treated as **potentially exposed**. Prefer rotating the password after this engagement and storing secrets only in a secure local/secret manager—not in Git.
