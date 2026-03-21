---
name: "Sequence Retrieval Architecture Follow-up"
overview: "Resolve the interim lexical-only sequence retrieval state by aligning mapping, ingestion, and retrieval around a strict, deterministic sequence semantic surface derived from ordered sub-content after P0 closes."
source_research:
  - "../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md"
  - "./thread-sequence-semantic-surfaces.execution.plan.md"
  - "../../../research/elasticsearch/methods/hybrid-retrieval.md"
  - "../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md"
depends_on:
  - "../active/f2-closure-and-p0-ingestion.execution.plan.md"
todos:
  - id: phase-0-lock-end-state
    content: "Phase 0: Lock the deterministic construction recipe for required `sequence_semantic`, built from ordered unit sub-content with explicit fail-fast rules."
    status: pending
  - id: phase-1-red
    content: "Phase 1 (RED): Add failing tests for retrieval shape, the strict `sequence_semantic` contract, deterministic semantic synthesis from ordered unit sub-content, and SDK-owned builder boundaries."
    status: pending
  - id: phase-2-green
    content: "Phase 2 (GREEN): Implement deterministic sequence semantic construction from sequence sub-content and align mapping, ingestion, and runtime behaviour."
    status: pending
  - id: phase-3-refactor
    content: "Phase 3 (REFACTOR): Collapse duplicated sequence retriever logic to one source of truth and update docs/ADR notes."
    status: pending
  - id: phase-4-gates-review
    content: "Phase 4: Run quality gates and required reviewer passes (architecture, Elasticsearch, test, docs, type as needed)."
    status: pending
---

# Sequence Retrieval Architecture Follow-up

**Last Updated**: 2026-03-21  
**Status**: 📋 QUEUED (post-P0, next-session candidate)  
**Scope**: Resolve the current sequence-search interim state without blocking the
active F2/P0 re-ingest lane.

---

## Why This Plan Exists

The immediate bug-fix session made sequence retrieval honest, but it did not yet
finish the structural cleanup:

1. `sequence_semantic` is still present in the generated schema/mapping but the
   current builder path does not set it.
2. Sequence retrieval is therefore lexical-only in behaviour today.
3. Retrieval ownership must stay canonical in the SDK per ADR-134; CLI harnesses
   and experiments must not become a second owner of sequence semantics.
4. `sequence_semantic` is staying in the schema/mapping and must be produced for
   every sequence. A dormant or optional-in-practice field is not acceptable
   under the repo's fail-fast, strict-contract discipline.
5. If semantic retrieval is restored later, it must use a real produced field
   and current Elasticsearch guidance rather than reviving the earlier query
   shape by habit.

That is acceptable as an interim P0-stabilisation state, but it is not the
final architecture.

---

## Current Recorded Facts

### Runtime facts now locked in code

- `createSequenceDocument()` does not currently set `sequence_semantic`.
- SDK and CLI sequence search are both lexical-only in practice.
- The generated sequence schema and mapping still declare `sequence_semantic`,
  which means the repo currently has contract drift between schema/mapping and
  produced documents.
- Staged validation for P0 now uses concrete versioned indexes via
  `field-readback-audit --target-version <version>`; this plan is separate from
  that operational fix.

### Strict contract facts for the follow-up

- No dormant optional field should survive this follow-up.
- `sequence_semantic` stays in the schema/mapping and must be populated for
  every sequence and validated as non-empty.
- Construction must be deterministic and derived from real sequence sub-content,
  not hand-written prose.
- Missing or empty required source content must fail fast.

### Documentation facts now aligned

- Public docs state that sequence retrieval is lexical-only today.
- Active runbooks no longer claim `admin count` can validate staged indexes.
- The Elastic hybrid-retrieval note now records the current sequence state and
  warns against blindly restoring the older semantic query shape.

---

## Locked End-State

The end-state is not open for debate:

1. `sequence_semantic` stays in the generated schema/mapping and becomes a
   required, non-empty field in produced sequence documents.
2. Semantic content is constructed deterministically by iterating the units in
   sequence order, extracting the required unit summaries, and
   concatenating/normalising them into a stable sequence semantic surface.
3. Retrieval returns to semantic/hybrid behaviour only after that producer
   exists and tests prove field production and query consumption together.
4. SDK retrieval helpers remain the canonical owner of sequence retrieval
   semantics; CLI harnesses and experiments must consume shared logic rather
   than define a competing contract.

Execution detail still needs to be locked before coding:

1. the exact normalisation/concatenation recipe for unit-summary content
2. any additional stable high-signal fields allowed beyond unit summaries
3. fail-fast rules for missing or empty source content
4. the exact shared helper boundaries between ingestion and retrieval

---

## Phase Model

### Phase 0: Lock the execution recipe

Before touching implementation, record:

1. the exact deterministic construction recipe for `sequence_semantic` from
   ordered unit sub-content, including concatenation and normalisation rules
2. the concrete acceptance criteria for a required, non-empty field
3. the fail-fast conditions for missing or empty source content
4. SDK retrieval helpers as the canonical owner of sequence retrieval semantics;
   CLI harnesses must consume shared logic rather than define a competing
   contract

### Phase 1: Test Specification (RED)

Write failing tests before the fix.

Minimum required coverage:

1. retrieval-shape contract test for the chosen architecture
2. builder contract test for required `sequence_semantic`
3. deterministic semantic-synthesis tests over ordered sequence sub-content
4. fail-fast tests for missing/empty required source material
5. CLI/SDK parity or shared-source test proving retrieval logic cannot drift
6. mapping/schema assertions proving `sequence_semantic` remains required and
   aligned with produced documents

Important:

- test runtime and schema contracts, not prose
- do **not** write tests that assert documentation text

### Phase 2: Implementation (GREEN)

Implement the chosen architecture with the smallest coherent set of changes.

Likely change areas:

1. `packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts`
2. `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts`
3. `apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts`
4. sequence ingestion/transform modules that already iterate units and can read
   unit summaries in sequence order
5. `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts` and
   `apps/oak-search-cli/src/lib/hybrid-search/sequences.ts`, only to remove
   drift against the SDK-owned canonical path
6. generated mapping/schema types so `sequence_semantic` stays required and
   aligned with the produced document contract
7. any capability-surface exports needed for shared helpers

### Phase 3: Refactor and Simplification

Acceptance criteria:

1. mapping, ingestion, and retrieval tell the same story
2. `sequence_semantic` is required and non-empty for every sequence
3. sequence semantic content is built deterministically from ordered unit-level
   sub-content rather than ad-hoc prose
4. CLI and SDK do not each carry independent sequence-retrieval logic without a
   deliberate boundary reason, and SDK ownership remains explicit
5. temporary comments are removed or converted into durable documentation
6. docs are updated directly, not indirectly "tested"

### Phase 4: Quality Gates and Review

Minimum reviewer set:

- `architecture-reviewer-barney`
- `elasticsearch-reviewer`
- `test-reviewer`
- `docs-adr-reviewer`
- `type-reviewer` if type or capability-surface changes expand

Run the canonical quality gate chain from
[roadmap.md](../roadmap.md#quality-gates) once the implementation lands.

---

## Guardrails

- Do not reintroduce a semantic retriever unless the same change also ships the
  corresponding produced field and tests.
- Do not treat `sequence_semantic` as optional, best-effort, or "nice to have".
- Construct sequence semantic content from deterministic sub-content traversal:
  iterate the units in sequence order, extract the required unit summaries (and
  only other stable high-signal fields as needed), then concatenate/normalise
  into a non-empty semantic surface.
- If the required source content for `sequence_semantic` is missing or empty,
  fail fast; do not silently emit partial documents.
- Do not keep duplicate CLI/SDK sequence builder logic without an explicit
  architectural reason.
- Keep thread behaviour out of scope unless the chosen simplification or
  extraction genuinely requires shared thread/sequence changes.
- Do not block the active re-ingest lane on this work.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../active/f2-closure-and-p0-ingestion.execution.plan.md](../active/f2-closure-and-p0-ingestion.execution.plan.md) | Active P0 lane that this follow-up must not block |
| [search-contract-followup.plan.md](search-contract-followup.plan.md) | Separate post-P0 contract/smoke follow-up |
| [thread-sequence-semantic-surfaces.execution.plan.md](thread-sequence-semantic-surfaces.execution.plan.md) | Broader enrichment plan for richer derived thread/sequence surfaces |
| [../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md](../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | Research evidence for richer future sequence semantic fields |
| [../../../research/elasticsearch/methods/hybrid-retrieval.md](../../../research/elasticsearch/methods/hybrid-retrieval.md) | Elastic method note updated with current Oak sequence state |
