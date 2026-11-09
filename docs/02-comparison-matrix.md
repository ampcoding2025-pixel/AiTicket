# Comparison Matrix — Observed System vs Proposed Platform

**Legend for existing system columns:** Observed | Claimed | Not demonstrated | Unknown

| Capability | Existing System | Evidence Status | Proposed Improved System |
|------------|-----------------|-----------------|--------------------------|
| Historical data analysis | Appears present (statistical/NLP on historical DB) | Observed | Yes — validated analytics with data-quality gates |
| Topic modeling | TF-IDF / Dirichlet / LDA mentioned | Claimed / Unknown depth | Improved, validated, with evaluation metrics |
| Clustering | Demonstrated conceptually | Observed | Yes — measurable quality (silhouette/coherence + expert review) |
| Hierarchical categorization | Healthcare / insurance examples shown | Partially observed | Structured, configurable taxonomy validated on Didban |
| Complaint vs request classification | Human operators decide | Observed | AI-assisted classification with human override |
| New request / real-time inference | Not shown | Not demonstrated | Planned inference pipeline (M2) |
| Semantic search | Not shown | Not demonstrated | Embedding-based retrieval (M2, prepared in M1 UX) |
| Similar historical case retrieval | Implied via ~70% claim | Claimed | Explicit similar-case explorer with scores and caveats |
| Historical answer reuse | ~70% already have answers | Claimed | Validity-checked retrieval (available ≠ valid ≠ verified) |
| Knowledge management | Not shown | Not demonstrated | Versioned knowledge base |
| Regulation / circular versioning | Not shown | Not demonstrated | Temporal document management |
| RAG | Not shown | Not demonstrated | Planned (M2) with abstain-when-uncertain |
| Automatic response generation | Not shown | Not demonstrated | Planned with citations + human approval |
| Human approval workflow | Not established | Not demonstrated | Human-in-the-loop (M2) |
| SLA monitoring | Not established | Not demonstrated | Full SLA tracking when fields exist |
| Operational dashboard | Basic HTML dashboard | Observed | Enterprise RTL operational dashboard |
| AI model monitoring | Not established | Not demonstrated | Model performance monitoring UI (demo-labeled until real) |
| KPI framework | Some concerns observed | Unknown / Incomplete | Formal KPI dictionary with formulas and data requirements |
| Drill-down analytics | Not established | Not demonstrated | Interactive drill-down to underlying records |
| Data freshness monitoring | Not established | Not demonstrated | Pipeline / freshness monitoring |
| Audit logging | Not established | Not demonstrated | Full audit trail |
| Security / access control | Not established | Unknown | RBAC by role |

## Interpretation Notes

- The ~70% historical answer claim is treated as a **hypothesis to validate**, not a product guarantee.
- Similarity does not imply legal correctness; regulations may supersede prior answers.
- Proposed system success is measured by decision usefulness, data trust, and operational outcomes—not by counting NLP techniques.
