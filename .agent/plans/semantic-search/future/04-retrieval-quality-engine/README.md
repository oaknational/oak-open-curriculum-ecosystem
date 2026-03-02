# Retrieval Quality Engine

**Domain**: Improving search result relevance through retrieval architecture  
**Intent**: Users find what they're looking for  
**Impact**: Better MRR, reduced zero-hit rate, higher user satisfaction

---

## Search Quality Levels

Search quality work follows a **sequential progression** (from [ADR-082](../../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

| Level | Focus | Approach Type |
|-------|-------|---------------|
| **1** | Fundamentals | Synonyms, phrase boosting, noise filtering |
| **2** | Document Relationships | Threads, prerequisites, cross-referencing |
| **3** | Modern ES Features | Semantic reranking, query rules (Elastic-native) |
| **4** | AI Enhancement | LLM preprocessing, intent classification |

**Core principle**: Exhaust lower levels before moving up. Don't use complex/expensive solutions for problems simpler approaches could solve.

**Level 1 is complete and validated** (see [ADR-120](../../../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)).

---

## Plan Sequence

Plans are **sequential** — complete one level before starting the next:

```
Level 2: Document Relationships
         ↓
Level 3: Modern ES Features (includes definition-retrieval; aligned with query policy boundary)
         ↓
Level 4: AI Enhancement (DESTINATION, not optional)
```

Supporting plans can run in parallel:

- `mfl-multilingual-embeddings.md` — Specific quality fix, can run alongside Level 3

---

## Plans

### Sequential (by level)

| Plan | Level | Status |
|------|-------|--------|
| [document-relationships.md](document-relationships.md) | 2 | 📋 Pending |
| [modern-es-features.md](modern-es-features.md) | 3 | 📋 Pending |
| [definition-retrieval.md](definition-retrieval.md) | 3 | 📋 Pending |
| [ai-enhancement.md](ai-enhancement.md) | 4 | 📋 Pending |

### Supporting

| Plan | Description | Status |
|------|-------------|--------|
| [mfl-multilingual-embeddings.md](mfl-multilingual-embeddings.md) | Fix MFL search (0.19-0.29 MRR) | 📋 Pending |

## Cross-Boundary Dependencies

| Boundary Plan | Why It Matters Here |
|---------------|---------------------|
| [search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md) | Defines query-shape routing and retriever-profile policy used by Level 3/4 retrieval |
| [paraphrase-policy-and-application.md](../05-query-policy-and-sdk-contracts/paraphrase-policy-and-application.md) | Defines confidence-gated runtime use of Bucket B paraphrases |
| [mfl-synonym-architecture.md](../03-vocabulary-and-semantic-assets/mfl-synonym-architecture.md) | Provides cleaned synonym artefacts that influence MFL retrieval quality outcomes |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Defines evidence and ground-truth methodology for all retrieval experiments |

### Future Investigation

| Topic | Context | When |
|-------|---------|------|
| **Reranking** | With fuzziness and score filtering in place ([ADR-120](../../../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)), the ranking within results is driven by RRF score ordering. Reranking (e.g. Elastic's semantic reranker, cross-encoder models, or LLM-based reranking) could improve within-result ordering — particularly for polysemous queries like "tree" where maths tree diagrams still interleave with science trees. Investigate as part of Level 3. | After Level 2 is exhausted |

---

## "Exhausted" Definition

A level is **exhausted** when:

1. All standard approaches in its checklist are attempted
2. Each approach is **measured** with validated ground truths
3. ≤5% MRR improvement across 3 consecutive experiments (plateau)
4. OR no more experiments possible at this level

---

## Dependencies

- Ground truth review complete (validates measurements)
- SDK extraction complete
- MCP integration complete (for testing in real agent context)

---

## Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Aggregate MRR (legacy 120-query baseline, 2026-01-13) | 0.513 | ≥ 0.75 (after Level 4) |
| Zero-hit rate (legacy 120-query baseline, 2026-01-13) | 24.2% | ≤ 10% |
| Intent-based MRR | Re-baseline required under ADR-106 methodology | ≥ 0.70 (requires Level 4) |

Stage 0 in [modern-es-features.md](modern-es-features.md) re-baselines these with the current validated ground truth system before further tuning.
