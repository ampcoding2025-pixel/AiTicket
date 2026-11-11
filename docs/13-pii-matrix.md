# Phase 2 — PII Minimization Matrix

Principle: dashboards show **aggregates**; drill-down shows **masked** fields by role.

## Column Sensitivity (Didban)

| Column / area | Sensitivity | Aggregate APIs | Expert drill-down | Admin |
|---------------|-------------|----------------|-------------------|-------|
| `InformerNationalCode`, `AgentNationalCode`, `GetterNationalCode` | Critical PII | Never | Never (hash only if required by legal) | Audit-only encrypted store TBD |
| Phone / cellphone / caller id | Critical PII | Never | Masked last-4 optional | Restricted |
| Names (`Informer*Name`, `Agent*Name`) | PII | Never | Initials or role-gated full | Restricted |
| Address / postal / lat-long device | PII / location | Region/Area counts only | Masked | Restricted |
| `CookieText` / `CookieCaption` | Possible PII in free text | Never raw in exec charts | Redacted snippet | Restricted |
| `CookieFlowReplyCitizen` | Possible PII | Counts only | Redacted excerpt | Restricted |
| `CookiePursuitComment` | Possible PII | Never | Redacted | Restricted |
| `DepartmentName`, taxonomy names | Org metadata | Allowed | Allowed | Allowed |
| Status / channel / class ids | Operational | Allowed | Allowed | Allowed |
| Attachments | High | No access currently | Future gated | — |

## Endpoint Policy

| Endpoint | Allowed identifiers | Forbidden |
|----------|---------------------|-----------|
| Executive / Request / Category aggregates | Counts, dim names, ids of org/taxonomy | Any citizen PII, raw case text |
| Category/Topic samples | Synthetic or heavily redacted caption, class, status, opaque case token | National code, phone, full narrative |
| Answer cases | Opaque id, redacted excerpt, org/subject names, validity enum | Full unredacted reply by default |
| Reports export | Same as aggregates unless elevated workflow | Full PII dumps |
| Audit logs | Actor display name, action, target token | Payload bodies with PII |
| AI training extract (offline) | Separate scrubbed corpus pipeline — not these APIs | Direct prod text pull via UI APIs |

## Redaction Guidelines (draft)

1. Replace 10-digit national-code patterns with `[کد ملی]`
2. Replace phone-like tokens with `[تلفن]`
3. Truncate excerpts to ≤160 chars for list views
4. Log access to any unredacted view in audit

## Implementation Hooks

- Backend: redaction middleware / SQL projections without PII columns
- Frontend: never request PII fields in aggregate hooks
- `X-Demo-Role` / JWT role claims gate sample endpoints
