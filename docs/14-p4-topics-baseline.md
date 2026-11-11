# P4 Topics Baseline (v0.1)

Date: 2026-11-11  
Status: **taxonomy baseline live** — unsupervised NLP still planned

## What shipped

`GET /api/v1/analytics/topics` returns Didban **Subject** volume clusters (top 12), yearly evolution, redacted `CookieCaption` samples, and weak same-`SubjectGroup` edges.

Web Topic Explorer (`DATA_PROVIDER=api`) consumes this and labels status as **taxonomy_baseline (not NLP)**.

## Explicit non-claims

| Claim | Status |
|-------|--------|
| BERTopic / LDA clusters | Not run |
| Textual co-occurrence graph | Not computed |
| Topic coherence / noise KPIs | `unavailable` |
| Inter-period topic stability | `unavailable` |
| Similar-case embeddings | Not started |

## Next P4 steps

1. Offline batch: scrub `CookieCaption`/`CookieText` → TF-IDF similar-case prototype  
2. BERTopic (Persian embeddings) on sampled years → expert naming  
3. Stability metric across years  
4. Replace taxonomy edges with CookieFlow / similarity edges when measured  
