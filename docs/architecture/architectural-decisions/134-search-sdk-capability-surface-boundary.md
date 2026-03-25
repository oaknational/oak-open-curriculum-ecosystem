# ADR-134: Search SDK Capability Surface Boundary

## Status

Accepted

## Date

2026-03-11

## Context

The Search CLI/SDK boundary diagnosis identified three structural problems:

1. The Search SDK root entrypoint exposes both read and privileged admin lifecycle
   capabilities through a single surface.
2. Internal SDK concerns can leak across the app boundary through re-exports,
   weakening encapsulation.
3. Canonical retrieval and query-preprocessing semantics have drift risk when
   duplicated or bypassed outside the SDK ownership boundary.

The owner constraints for this area are explicit:

- Admin functions should be semi-separate from default consumer flows.
- Most consumers should be non-admin by default.
- Future experimentation should be supported without reintroducing parallel
  canonical implementations.

## Decision

### 1. Capability-tiered Search SDK public surfaces

The Search SDK public API is split into explicit capability surfaces:

- `@oaknational/oak-search-sdk/read` for default retrieval consumption.
- `@oaknational/oak-search-sdk/admin` for privileged lifecycle/write operations.

The default root entrypoint must not transitively expose admin/write or internal
symbols.

### 2. Boundary ownership and import policy

- `oak-search-sdk` owns canonical retrieval and preprocessing semantics.
- `oak-search-cli` owns command orchestration, runtime policy, and operator UX.
- App code must not import SDK internal modules or deep implementation paths.
- Non-admin CLI modules must not import admin SDK surfaces.

These constraints are enforced by package surface design and lint fitness rules.

Amendment (2026-03-24): [ADR-140](140-search-ingestion-sdk-boundary.md)
moves Oak-specific ingestion runtime out of the CLI long term. This ADR still
governs Search SDK capability separation and thin CLI ownership; any remaining
CLI-local ownership for `src/lib/indexing/**` or `src/adapters/**` is
transitional until the extraction completes.

### 3. Experiments policy

Experiments are supported as a deliberate extension path, but no speculative
public experiments surface is introduced without a real consumer.

When the first experiment consumer is approved, a follow-on ADR must define:

- the experiment capability surface,
- blast-radius controls (read-default credentials, explicit elevated mode for writes),
- graduation path into canonical SDK semantics.

### 4. Enforcement and verification

Boundary compliance is a blocking quality concern and must be encoded in lint
configuration and rule tests:

- violating imports fail lint as errors,
- positive and negative fixtures prove each boundary class,
- boundary drift blocks merges.

Implementation evidence includes:

- CLI boundary lint policy in `apps/oak-search-cli/eslint.config.ts`
- fixture-backed integration proofs in `apps/oak-search-cli/eslint-boundary.integration.test.ts`
- admin-only lifecycle composition helper in `apps/oak-search-cli/src/cli/admin/shared/build-lifecycle-service.ts`
- default non-admin policy with explicit privileged subtree overrides in
  `apps/oak-search-cli/eslint.config.ts` (`src/cli/admin/**`, `src/lib/indexing/**`, `src/adapters/**`)
- mixed-capability safeguards for `evaluation/**` and `operations/**` in
  `apps/oak-search-cli/eslint.config.ts` (root/internal SDK imports blocked)
- shared index-resolver primitives exported by SDK read surface in
  `packages/sdks/oak-search-sdk/src/read.ts` and consumed by admin surface in
  `packages/sdks/oak-search-sdk/src/admin.ts`

### 5. Ownership matrix

| Module family                                                         | Owner                          | Boundary status                                            |
| --------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| `apps/oak-search-cli/src/cli/search/**`                               | CLI                            | Read-only (`/read`)                                        |
| `apps/oak-search-cli/src/cli/admin/**`                                | CLI                            | Admin (`/admin`)                                           |
| `apps/oak-search-cli/src/cli/shared/build-search-sdk-config.ts`       | CLI                            | Read-safe config                                           |
| `apps/oak-search-cli/src/cli/admin/shared/build-lifecycle-service.ts` | CLI admin lane                 | Admin-only orchestration                                   |
| `apps/oak-search-cli/src/lib/indexing/**`                             | Transitional CLI admin-support | Admin (`/admin`) today; moves to ingestion SDK per ADR-140 |
| `apps/oak-search-cli/src/adapters/**`                                 | Transitional CLI admin-support | Admin (`/admin`) today; moves to ingestion SDK per ADR-140 |
| `apps/oak-search-cli/src/lib/hybrid-search/**`                        | CLI                            | Request assembly only; delegates retriever shapes to SDK   |
| `packages/sdks/oak-search-sdk/src/retrieval/**`                       | SDK                            | Canonical owner                                            |
| `packages/sdks/oak-search-sdk/src/admin/**`                           | SDK                            | Canonical owner                                            |
| `packages/sdks/oak-search-sdk/src/internal/**`                        | SDK internal                   | No root leakage                                            |

#### SDK-owned capability families

The following capability families are owned by the SDK and exported on
`@oaknational/oak-search-sdk/read`. The CLI must import these rather than
maintaining local copies. This was enforced in the 2026-03-23 boundary
clarification after fuzziness drift was detected between CLI and SDK
retriever implementations.

| Family                 | SDK module                                             | `/read` exports                                                                                                                               | CLI may NOT reimplement                                        |
| ---------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Retriever shapes       | `rrf-query-builders.ts`, `retrieval-search-helpers.ts` | `buildLessonRetriever`, `buildUnitRetriever`, `buildSequenceRetriever`, `buildThreadRetriever`, `buildFourWayRetriever`, `buildBm25Retriever` | Any function returning `RetrieverContainer` for a search scope |
| BM25 field inventories | `rrf-query-builders.ts`                                | `LESSON_BM25_CONTENT`, `LESSON_BM25_STRUCTURE`, `UNIT_BM25_CONTENT`, `UNIT_BM25_STRUCTURE`, `LESSON_BM25_CONFIG`, `UNIT_BM25_CONFIG`          | BM25 field lists or tuning parameters                          |
| Semantic field names   | `rrf-query-builders.ts`                                | `LESSON_CONTENT_SEMANTIC`, `LESSON_STRUCTURE_SEMANTIC`, `UNIT_CONTENT_SEMANTIC`, `UNIT_STRUCTURE_SEMANTIC`                                    | ELSER field name constants                                     |
| Query processing       | `query-processing/`                                    | `removeNoisePhrases`, `detectCurriculumPhrases`                                                                                               | Noise phrase removal or curriculum phrase detection            |
| Score processing       | `rrf-score-processing.ts`                              | `normaliseTranscriptScores`, `filterByMinScore`, `DEFAULT_MIN_SCORE`, `clampSize`, `clampFrom`                                                | Score normalisation or filtering                               |
| Highlight configs      | `rrf-query-helpers.ts`                                 | `buildLessonHighlight`, `buildUnitHighlight`                                                                                                  | Highlight shape construction                                   |

The CLI retains ownership of **filter construction** (`createLessonFilters`,
`createUnitFilters` with phase expansion), **facet aggregations**, and
**request assembly** (combining SDK-built retrievers with CLI-specific index
resolution and pagination). These are operational concerns, not domain logic.

### 6. Fitness functions

The boundary is healthy only when all of the following are true and blocking:

1. No duplicate canonical retrieval/preprocessing module families across CLI and SDK.
2. No app imports from SDK `internal/*` or deep implementation paths.
3. Non-admin CLI modules cannot import SDK admin surface.
4. Default SDK root entrypoint does not expose admin/write or internal symbols.
5. Any future experiment seam is introduced only with its own ADR and boundary tests.
6. Boundary fitness failures break lint/type gates and block merges.

## Consequences

### Positive

- Read-only consumption becomes the default and easiest integration path.
- Privileged admin capability is explicit and reviewable at import boundaries.
- Internal SDK concerns remain encapsulated and harder to misuse.
- Boundary violations are caught statically rather than discovered during incidents.
- Canonical search semantics remain owned by the SDK, reducing drift.

### Negative

- Migration effort was required to move existing imports and tighten package exports.
- Additional lint rule complexity and fixtures were introduced and must be maintained.
- Some utility modules were refactored to keep read/admin boundaries clean.

### Neutral

- This ADR defines boundary policy. The implementation plan that delivered it
  is archived at `.agent/plans/semantic-search/archive/completed/search-cli-sdk-boundary-migration.execution.plan.md`.

### Amendment (2026-03-23): Capability family matrix

Boundary enforcement audit discovered that the CLI's `lib/hybrid-search/`
layer duplicated 7 SDK capability families with active configuration drift
(BM25 fuzziness `AUTO` in CLI vs ADR-120 tuned `AUTO:6,9` in SDK). Four
architecture reviewers independently identified the violation. Resolution:

- Added capability family matrix to §5 listing all SDK-owned families.
- Exported all capability families on `/read` surface.
- CLI retriever builders (`buildLessonRrfRequest`, `buildUnitRrfRequest`,
  `buildSequenceRrfRequest`, `buildThreadRrfRequest`) now delegate all
  retriever shape construction to the SDK.
- Deleted ~500 lines of CLI-local duplicated code (sub-retrievers, BM25
  constants, query processing, score normalisation, highlights).
- Migrated experiment/ablation builders to import SDK building blocks.
- Added "Layer Role Topology" principle to `principles.md` and Practice Core.

## Related

- ADR-030: SDK as Single Source of Truth
- ADR-041: Workspace Structure Option A
- ADR-078: Dependency Injection for Testability
- ADR-108: SDK Workspace Decomposition
- ADR-130: Zero-Downtime Blue/Green Elasticsearch Index Swapping
- ADR-133: CLI Resource Lifecycle Management
- ADR-139: Sequence Semantic Contract and Ownership
