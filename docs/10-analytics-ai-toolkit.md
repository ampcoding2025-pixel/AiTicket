# Analytics, Algorithms & AI Toolkit (Mapped to Feasible KPIs)

Purpose: choose techniques that **improve or explain** KPIs we can actually measure on Didban — not collect algorithms for their own sake.

## Principles

1. M1 = descriptive + diagnostic analytics on verified fields.
2. M1.5 = offline NLP discovery (topics, similarity) feeding dashboards — no auto-answer claims.
3. M2 = supervised classification, retrieval, validity-aware RAG, human-in-the-loop.
4. Prefer Persian-capable models; evaluate on Behzisti labeled samples.
5. LLMs (ChatGPT/Claude/local) are **assistants for exploration, taxonomy labeling, report drafting** — not sources of truth for citizen answers without evidence + human approval.

---

## Layer 1 — Classical Analytics (Start Here)

| Technique | Tools | KPIs / questions |
|-----------|-------|------------------|
| Descriptive stats | SQL aggregates, pandas | A1–A7 volume, channel, region, department |
| Time series + seasonality | SQL + ECharts; later Prophet/statsmodels | Trends, backlog, throughput (C2) |
| Cohort / period compare | SQL window functions | MoM/YoY volume & resolution |
| Funnel / status transition | Cookie → CookieFlow status graph | B1/B5 reopen & referral |
| Pareto / concentration | Rank by Subject/Department | Workload hotspots (C1) |
| Outlier / anomaly on latency | IQR, z-score, Isolation Forest | B2 resolution time anomalies |
| Geo choropleth | Inform.RegionId | Geographic demand |

**No LLM required.** Highest ROI for Executive Dashboard truthfulness.

---

## Layer 2 — Text Mining & Unsupervised NLP (Validate “topics” claim)

Text sources: `CookieCaption`, `CookieText`, optionally `CookieFlowReplyCitizen` / pursuit comments (PII-scrubbed).

| Technique | Typical stack | Use |
|-----------|---------------|-----|
| Cleaning + normalize Persian | hazm / parsivar / custom | Prep |
| TF-IDF + cosine | scikit-learn | Baseline similar-case search; keyword clouds |
| Jaccard / n-gram overlap | custom | Near-duplicate / repeat proxy (F3 improvement) |
| LDA | gensim / sklearn | Baseline topic model (matches observed org presentation language) |
| BERTopic + Persian embeddings | BERTopic + `heydariAI/persian-*` / `sentence-transformers` multilingual | Better topics than LDA for emerging issues |
| Hierarchical clustering / HDBSCAN | scikit-learn / hdbscan | Cluster explorer page |
| Graph of subject co-occurrence / referral | networkx + ECharts graph | Only if edges = real transitions (CookieFlow), not decoration |
| Sentiment (weak) | Persian sentiment models | Only exploratory — **no reliable CSAT field** |

**Tracks/improves:** category concentration, emerging topics, weak repeat-complaint detection, explanation of volume spikes.

**Does not prove:** 70% answer reuse or legal validity.

---

## Layer 3 — Similarity & Historical Answer Intelligence

| Technique | Stack | KPI impact |
|-----------|-------|------------|
| Embedding retrieval | Sentence Transformers (Persian/multilingual), FAISS / pgvector | Candidate similar cases; D4 prototype |
| Hybrid BM25 + dense | Elasticsearch/OpenSearch or pgvector + FTS | Robust Persian search |
| Answer availability join | SQL on `CookieFlowReplyCitizen` | **D1 real ~6.3%** |
| Validity gate (later) | Metadata store: effective/expiry/version | D3 — **missing today** |
| LLM-as-judge (offline) | GPT/Claude/local LLM with rubrics | Score whether historical reply still applicable — **assistive only**, logged, sampled by experts |

**Critical product rule:** Similar ≠ Answer available ≠ Currently valid ≠ Expert-verified.

---

## Layer 4 — Supervised AI (M2)

| Model | Labels from Didban | KPI |
|-------|--------------------|-----|
| SubjectClass classifier | `SubjectClassId` | Auto complaint vs guidance assist; AI accuracy KPIs |
| Subject / SubjectGroup classifier | taxonomy ids | Routing assist; human correction rate |
| Priority classifier | `SubjectPriorityId` | Triage assist |
| Next-status / SLA risk | flow + delay proxy | Operational early warning (if delay semantics confirmed) |

Stack: scikit-learn baselines → Persian transformer fine-tune (Hugging Face). Serve via FastAPI; orchestrate from ASP.NET modular monolith.

Evaluation: precision/recall/F1, calibration, drift monitors — **Page 7 only with real eval**, else Mock badge.

---

## Layer 5 — LLM / Agents (Careful Use)

| Use case | Fit | Guardrails |
|----------|-----|------------|
| Persian executive narrative summaries of **already computed** KPIs | Good | Numbers come from SQL; LLM only phrases |
| Helping analysts label clusters / name topics | Good | Human accept names |
| Draft taxonomy mapping docs | Good | Version in git |
| Draft reply to citizen | **Only M2+ with RAG + citations + human approve** | Abstain if evidence weak |
| Free ChatGPT browsing as system of record | **Forbidden** | No authority, no audit, PII risk |
| Autonomous multi-agent ticket closer | **Out of scope for M1** | Premature |

Recommended pattern later: **RAG over versioned circulars + similar closed cases + operator SOPs**, with abstention + HITL — not bare ChatGPT.

---

## Mapping: KPI Group → Recommended Toolkit

| KPI group | Improve / track with |
|-----------|----------------------|
| A Volume | SQL + time series + geo; optional anomaly detection |
| B Resolution | SQL timelines from Cookie/CookieFlow; survival curves optional |
| C Operational | Dept workload SQL; process mining on CookieFlow; delay proxy validation |
| D Knowledge | Embedding retrieval + reply coverage SQL; LLM only for offline validity assist |
| E AI | Supervised metrics after labeled eval harness |
| F CX | Discontent proxy validation; NLP duplicate detection; do not invent CSAT |

---

## What Observed Org Presentation Tools Mean Here

| Mentioned | Our stance on Didban |
|-----------|----------------------|
| TF-IDF / Jaccard | Useful baselines for similarity & duplicates |
| LDA / Dirichlet | Useful baseline; prefer BERTopic for Persian quality |
| Clustering | Yes — for Topic Explorer, with stability checks over time |
| Graph theory | Use for **status/referral graphs**, not ornamental networks |
| Sentiment | Low value until satisfaction data exists |
| “70% historical answers” | **Not supported** by `CookieFlowReplyCitizen` (~6.3%); redesign claim as research question |
