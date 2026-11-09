# Didban Inspection Notes (Read-Only Policy)

## Policy

- **No INSERT / UPDATE / DELETE / DDL** on Didban
- Prefer metadata queries and limited SELECT profiling only after host access is confirmed
- Do not invent schema; document only verified objects

## Current Access Status

| Item | Status |
|------|--------|
| Username | Provided out-of-band (not stored in repo) |
| Password | Provided out-of-band (not stored in repo) — **rotate recommended** |
| Host / IP | **Missing** |
| Port | **Missing** |
| Engine | **Missing** |
| Database name | **Missing** |
| Network path (VPN/jump) | **Missing** |

## What Will Be Inspected When Connected

1. Engine version and collation / charset (Persian text implications)
2. Schemas, tables, views (names + row estimates if permitted)
3. Candidate request/complaint entities and status fields
4. Category / org unit / branch dimensions
5. Answer / response history fields
6. Date fields for trend and SLA feasibility
7. PII-heavy columns to exclude from aggregate dashboards
8. Data quality: nulls, duplicates, orphan FKs (read-only)

## Required From Stakeholders

Please provide connection endpoint details (host, port, engine, database, VPN requirement) so read-only discovery can begin. Credentials must be supplied via secure local env, not Git.
