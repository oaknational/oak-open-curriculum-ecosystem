# Semantic Search Roadmap

**Status**: ✅ **VERIFIED** — Full ingestion complete including sequences
**Last Updated**: 2026-01-02
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope note**: The `app/api` layer is no longer in scope. Search delivery will be via a separate UI and MCP tool (potentially in a separate repository). This roadmap focuses on SDK/CLI and search data capabilities only.

This is THE authoritative roadmap for semantic search work.

---

## ✅ MILESTONE 1 COMPLETE: Full Ingestion Verified

### Verification Results (2026-01-02)

| Metric                | Value         |
| --------------------- | ------------- |
| **Documents indexed** | 16,414        |
| **Lessons**           | 12,833        |
| **Units**             | 1,665         |
| **Sequences**         | 30            |
| **Sequence facets**   | 57            |
| **Threads**           | 164           |
| **Initial failures**  | 17 (0.10%)    |
| **Final failures**    | 0             |
| **Retry rounds**      | 1             |
| **Duration**          | ~22 minutes   |

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for optimisation history.

---

## ✅ MILESTONE 2 COMPLETE: Sequence Indexing

### Verification Results (2026-01-02)

| Index | Count | Status |
|-------|-------|--------|
| `oak_sequences` | 30 | ✅ Verified |
| `oak_sequence_facets` | 57 | ✅ Verified |

### Architecture Pattern (DRY/SRP Compliant)

```text
[Bulk Data] → [Extractor] → [Params] → [Shared Builder] → [ES Doc]
[API Data]  → [Adapter]   → [Params] → [Shared Builder] → [ES Doc]
```

**Key files**:
- `sequence-document-builder.ts` — shared `createSequenceDocument()` function
- `sequence-facets.ts` — shared `createSequenceFacetDoc()` function
- `bulk-sequence-transformer.ts` — bulk-specific extractor

### Acceptance Criteria

- [x] `oak_sequences` populated from bulk data (30 docs)
- [x] `oak_sequence_facets` populated from bulk data (57 docs)
- [x] No duplication of ingestion pipeline logic (DRY)
- [x] Clear separation of concerns (SRP)
- [x] All quality gates pass (835 tests)
- [x] TDD: tests first
- [x] **Verified with live ingestion**

---

## ✅ Completed Work

### Milestone 1: Complete ES Ingestion (Bulk-First)

| Phase                           | Description            | Status          |
| ------------------------------- | ---------------------- | --------------- |
| SDK bulk export                 | Schema-first types     | ✅ Complete     |
| BulkDataAdapter                 | Lesson/Unit transforms | ✅ Complete     |
| API supplementation             | Maths KS4 tiers        | ✅ Complete     |
| HybridDataSource                | Bulk + API + rollups   | ✅ Complete     |
| VocabularyMiningAdapter         | Keyword extraction     | ✅ Complete     |
| Bulk thread transformer         | Thread documents       | ✅ Complete     |
| CLI wiring                      | `--bulk` mode          | ✅ Complete     |
| Missing transcript handling     | ADR-094, ADR-095       | ✅ Complete     |
| ELSER retry implementation      | ADR-096                | ✅ Complete     |
| **Full ingestion verification** | 16,327 docs            | ✅ **VERIFIED** |

### Milestone 2: Sequence Indexing (Complete)

| Phase                           | Description                       | Status          |
| ------------------------------- | --------------------------------- | --------------- |
| Input-agnostic params interface | `CreateSequenceFacetDocParams`    | ✅ Complete     |
| Shared document builders        | `createSequenceFacetDoc()`        | ✅ Complete     |
| Bulk extractor                  | `bulk-sequence-transformer.ts`    | ✅ Complete     |
| Pipeline integration            | `bulk-ingestion.ts`               | ✅ Complete     |
| TDD tests                       | 20 transformer + 3 pipeline tests | ✅ Complete     |
| Quality gates                   | All passing                       | ✅ Complete     |
| **Ingestion verified**          | 30 sequences, 57 facets           | ✅ **VERIFIED** |

### Two-Tier Retry System (ADR-096)

| Component                      | Status          |
| ------------------------------ | --------------- |
| Tier 1 (HTTP-level) retry      | ✅ Complete     |
| Tier 2 (document-level) retry  | ✅ Complete     |
| Progressive chunk delay (×1.5) | ✅ Complete     |
| Initial retry delay            | ✅ Complete     |
| CLI flags                      | ✅ Complete     |
| JSON failure report            | ✅ Complete     |
| **Production verification**    | ✅ **VERIFIED** |

---

## Future Milestones

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending
**Specification**: [synonym-quality-audit.md](planned/future/synonym-quality-audit.md)

### Milestone 4: Document Builder DRY/SRP Refactoring

**Status**: 📋 Pending
**Priority**: 🔴 **HIGH** — Complete immediately after sequence ingestion verified

Apply the sequence architecture pattern to other document types.

**Note**: All document types have both API and bulk data sources available (per OpenAPI spec).
The issue is **duplicated document creation logic**, not missing data paths.

| Document Type    | Shared Builder           | Bulk Transformer              | Issue                  |
| ---------------- | ------------------------ | ----------------------------- | ---------------------- |
| **Sequences**    | `createSequenceDocument` | ✅ Calls shared builder       | None (done)            |
| **Threads**      | `createThreadDocument`   | ❌ `transformThreadToESDoc`   | Duplicates logic       |
| **Lessons**      | `createLessonDocument`   | ❌ `transformBulkLessonToESDoc` | Duplicates logic     |
| **Units**        | `createUnitDocument`     | ❌ `transformBulkUnitToESDoc` | Duplicates logic       |
| **Unit Rollups** | `createRollupDocument`   | TBD                           | Needs analysis         |

**Pattern to apply**:

```text
[Bulk Data] → [Extractor] → [Params Interface] → [Shared Builder] → [ES Doc]
[API Data]  → [Adapter]   → [Params Interface] → [Shared Builder] → [ES Doc]
```

**Benefits**:

- Single source of truth for document creation logic (DRY)
- Clear separation between data extraction and document building (SRP)
- Easier testing: shared builders can be tested with simple params
- Flexibility: any data source can produce documents via the params interface

**Implementation approach**:

1. Define `Create<DocType>Params` interface (input-agnostic)
2. Extract pure `create<DocType>Doc(params)` function
3. Create source-specific extractors/adapters that produce params
4. Update existing code to use new pattern

### Milestone 5-11: Future Work

See individual specification files in `planned/` directory.

### Milestone 12: Conversational Search (Tier 4)

**Status**: 📋 Deferred — Tier 4 work
**Specification**: [conversational-search.md](planned/future/conversational-search.md)

### Milestone 13: Search Delivery Parity (SDK/CLI + External UI/MCP)

**Status**: 📋 Pending
**Purpose**: Provide the same end-user value as the current system, without building `app/api`.

**Acceptance Criteria**:

- Stable, versioned search contract in the SDK (schema-first) for UI/MCP consumers.
- Multi-select filters for subject, key stage, year group, exam board, and content type.
- Cohort filtering (explicit cohort values, no hidden defaults).
- Mixed content ranking (lessons + units interleaved for parity with current UX expectations).
- Deterministic intent hints (rule-based suggestions) consumable by UI/MCP.

### Milestone 14: Collaborative Improvements Beyond the Current API

**Status**: 📋 Pending
**Purpose**: Build on the strong foundations of the current system with shared improvements that benefit end users.

**Acceptance Criteria**:

- Pedagogical intent enrichment (e.g. intro, extension, visual) to support queries that are not consistently served today.
- Relationship-aware ranking using sequences/threads for clearer progression-based discovery.
- Measured search quality improvements using the acceptance criteria and evaluation tools.
- Typeahead integration using existing ES data, surfaced via SDK contract for UI/MCP use.

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

| Document                                                                                           | Purpose                  |
| -------------------------------------------------------------------------------------------------- | ------------------------ |
| [current-state.md](current-state.md)                                                               | Authoritative metrics    |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)               | Session context          |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)        | ES Bulk Retry (verified) |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy      |
| [ADR-070](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md)   | Retry pattern (reused)   |

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
