# Semantic Search Roadmap

**Status**: ✅ **VERIFIED** — Full ingestion complete, sequence indexing pending
**Last Updated**: 2026-01-02
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative roadmap for semantic search work.

---

## ✅ MILESTONE 1 COMPLETE: Full Ingestion Verified

### Verification Results (2026-01-02)

| Metric | Value |
|--------|-------|
| **Documents indexed** | 16,327 (100%) |
| **Lessons** | 12,833 |
| **Units** | 1,665 |
| **Initial failures** | 21 (0.13%) |
| **Final failures** | 0 |
| **Retry rounds** | 1 |
| **Duration** | ~21 minutes |

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for optimisation history.

---

## 📋 NEXT TASK: Wire Sequence Ingestion

### Problem

The bulk download files contain sequence data (`sequenceSlug`, `sequence` array), but the bulk-first ingestion pipeline does not currently process sequences:

- `oak_sequences`: 0 documents (should have data)
- `oak_sequence_facets`: 0 documents (should have data)

### Solution

Wire sequence document building into the existing bulk ingestion pipeline.

**Key constraint from [rules.md](../../directives-and-memory/rules.md)**: One ingestion pipeline with thin adapters. Any duplication of pipeline logic is a DRY violation.

### Implementation Approach

1. **Existing builders**: `sequence-bulk-helpers.ts` already has:
   - `buildSequenceOps()`
   - `buildSequenceFacetOps()`

2. **Integration point**: `bulk-ingestion.ts` orchestrates document building:
   - Currently calls `buildLessonIndexDoc`, `buildUnitIndexDoc`, `buildThreadDocs`
   - Add calls to sequence builders

3. **Data source**: Bulk download files already contain sequence data:
   - Each file has `sequenceSlug` and `sequence` array
   - No additional API calls needed

4. **Single pipeline**: Use the same `dispatchBulk` flow — do NOT create separate sequence ingestion

### Acceptance Criteria

- [ ] `oak_sequences` populated from bulk data
- [ ] `oak_sequence_facets` populated from bulk data
- [ ] No duplication of ingestion pipeline logic
- [ ] All quality gates pass
- [ ] TDD: tests first

---

## ✅ Completed Work

### Milestone 1: Complete ES Ingestion (Bulk-First)

| Phase | Description | Status |
|-------|-------------|--------|
| SDK bulk export | Schema-first types | ✅ Complete |
| BulkDataAdapter | Lesson/Unit transforms | ✅ Complete |
| API supplementation | Maths KS4 tiers | ✅ Complete |
| HybridDataSource | Bulk + API + rollups | ✅ Complete |
| VocabularyMiningAdapter | Keyword extraction | ✅ Complete |
| Bulk thread transformer | Thread documents | ✅ Complete |
| CLI wiring | `--bulk` mode | ✅ Complete |
| Missing transcript handling | ADR-094, ADR-095 | ✅ Complete |
| ELSER retry implementation | ADR-096 | ✅ Complete |
| **Full ingestion verification** | 16,327 docs | ✅ **VERIFIED** |

### Two-Tier Retry System (ADR-096)

| Component | Status |
|-----------|--------|
| Tier 1 (HTTP-level) retry | ✅ Complete |
| Tier 2 (document-level) retry | ✅ Complete |
| Progressive chunk delay (×1.5) | ✅ Complete |
| Initial retry delay | ✅ Complete |
| CLI flags | ✅ Complete |
| JSON failure report | ✅ Complete |
| **Production verification** | ✅ **VERIFIED** |

---

## Future Milestones

### Milestone 2: Sequence Indexing
**Status**: 📋 Next task
**Specification**: This roadmap (above)

### Milestone 3: Synonym Quality Audit
**Status**: 📋 Pending (blocked on sequences)
**Specification**: [synonym-quality-audit.md](planned/future/synonym-quality-audit.md)

### Milestone 4-11: Future Work
See individual specification files in `planned/` directory.

### Milestone 12: Conversational Search (Tier 4)
**Status**: 📋 Deferred — Tier 4 work
**Specification**: [conversational-search.md](planned/future/conversational-search.md)

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | Authoritative metrics |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry (verified) |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
| [ADR-070](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | Retry pattern (reused) |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
