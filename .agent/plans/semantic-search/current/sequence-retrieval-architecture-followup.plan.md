---
name: "Sequence Retrieval Architecture Follow-up"
overview: "Locked execution recipe for resolving the interim lexical-only sequence retrieval state. Work items are now executing via the active pre-reingest remediation plan, which must complete before re-indexing."
source_research:
  - "../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md"
  - "./thread-sequence-semantic-surfaces.execution.plan.md"
  - "../../../research/elasticsearch/methods/hybrid-retrieval.md"
  - "../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md"
depends_on:
  - "../active/pre-reingest-remediation.execution.plan.md"
todos:
  - id: phase-0-lock-end-state
    content: "Phase 0: Lock the deterministic construction recipe for required `sequence_semantic`, built from ordered unit sub-content with explicit fail-fast rules."
    status: done
  - id: phase-1-red
    content: "SUPERSEDED: consolidated into pre-reingest-remediation.execution.plan.md Tasks 1.1–1.2."
    status: cancelled
  - id: phase-2-green
    content: "SUPERSEDED: consolidated into pre-reingest-remediation.execution.plan.md Tasks 2.1–2.3."
    status: cancelled
  - id: phase-3-refactor
    content: "SUPERSEDED: consolidated into pre-reingest-remediation.execution.plan.md Tasks 3.1–3.3."
    status: cancelled
  - id: phase-4-gates-review
    content: "SUPERSEDED: consolidated into pre-reingest-remediation.execution.plan.md Phase 4."
    status: cancelled
---

# Sequence Retrieval Architecture Follow-up

**Last Updated**: 2026-03-22  
**Status**: 🔴 EXECUTING via [pre-reingest-remediation.execution.plan.md](../active/pre-reingest-remediation.execution.plan.md) (decisions locked 2026-03-21, promoted to pre-reingest blocking 2026-03-22)  
**Scope**: Resolve the current sequence-search interim state. Work items
consolidated into the active remediation plan; this document serves as the
locked execution recipe reference.

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
  but the schema keeps it optional today while produced documents omit it. This
  follow-up closes that gap by making schema, ingestion, and retrieval tell the
  same story.
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
- ADR-139 is now the permanent architecture source of truth for the sequence
  semantic contract and ownership split; this plan carries execution detail.
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

No architecture decisions remain open before coding.

## Locked Execution Recipe

The remaining implementation must follow this exact recipe:

1. **Ordered unit authority**: derive the concrete ordered unit slug list from
   the `getSequenceUnits()` / `SequenceUnitsResponse` payload. Flatten any
   `unitOptions` cases into concrete unit slugs at their source position and
   materialise that ordering contract in one shared helper rather than
   re-deriving it in multiple places.
2. **Per-unit source data**: for every ordered unit slug, resolve the
   corresponding `SearchUnitSummary` from a single shared ingest summary map.
   The current bulk-only sequence path does not do this yet; the implementation
   must refactor toward that shared source of truth rather than invent a second
   sequence-only path.
3. **Per-unit semantic text**: build each unit's contribution by reusing the
   existing `generateUnitSemanticSummary(summary, keyStageTitle, subjectTitle)`
   contract, or a shared helper extracted directly from it. Do not create a
   bespoke sequence-only summariser with different field selection rules.
4. **Sequence semantic construction**: prepend one deterministic sequence
   context line naming the sequence title, subject, phase, years, and key
   stages, then append the ordered unit semantic summaries using double-newline
   separators. The result must stay deterministic and contain no hand-written
   or model-generated prose.
5. **Fail-fast policy**: fail the sequence build if a sequence resolves to zero
   concrete unit slugs, if any required unit summary is missing, or if any
   generated unit or final sequence semantic segment normalises to the empty
   string after trimming.
6. **Retrieval shape and ownership**: once the producer lands, restore
   SDK-owned two-way RRF for sequences (BM25 over the current lexical fields
   plus semantic query on `sequence_semantic`) with the same shared filter on
   both retrievers and the existing small-corpus defaults
   `rank_constant: 40` / `rank_window_size: 40`. CLI paths must consume that
   SDK helper; the duplicate CLI builder is removed or reduced to a thin
   adapter.

---

## Phase Model

### Phase 0: Lock the execution recipe

Locked on 2026-03-21. Before touching implementation, treat the recipe above as
non-negotiable:

1. ordered concrete unit slugs from the sequence-units payload are the only
   ordering authority
2. `SearchUnitSummary` is the only allowed per-unit semantic source contract
3. `generateUnitSemanticSummary(...)` defines the per-unit semantic text
   contract unless extracted into a shared helper without changing behaviour
4. SDK retrieval helpers remain the canonical owner of sequence retrieval
   semantics; CLI harnesses must consume shared logic rather than define a
   competing contract

### Phase 1: Test Specification (RED)

Write failing tests before the fix.

Minimum required coverage:

1. retrieval-shape contract test proving SDK-owned two-way RRF
2. builder contract test for required `sequence_semantic`
3. deterministic semantic-synthesis tests over ordered unit summaries and the
   sequence context line
4. fail-fast tests for missing/empty required source material
5. CLI/SDK parity or shared-source test proving retrieval logic cannot drift
6. mapping/schema assertions proving `sequence_semantic` becomes required and
   aligned with produced documents

Important:

- test runtime and schema contracts, not prose
- do **not** write tests that assert documentation text
- retrieval-shape contract tests (item 1) depend on a populated
  `sequence_semantic` field, which is produced in Phase 2; use a fixture or
  test index with a pre-populated field, or assert query shape only without
  requiring live semantic results

### Phase 2: Implementation (GREEN)

Implement the chosen architecture with the smallest coherent set of changes.

Likely change areas:

1. `packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts`
2. `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts`
3. `apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts`
4. sequence ingestion/transform modules that need to carry ordered unit slugs
   plus a shared `SearchUnitSummary` map into sequence indexing
5. `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts` and
   `apps/oak-search-cli/src/lib/hybrid-search/sequences.ts`, only to remove
   drift against the SDK-owned canonical path
6. generated mapping/schema types so `sequence_semantic` stays required and
   aligned with the produced document contract
7. `apps/oak-search-cli/src/lib/indexing/sequence-facets.ts` and
   `sequence-facet-index.ts` if the ordered slug/source helper is extracted or
   strengthened there
8. any capability-surface exports needed for shared helpers

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
7. permanent architecture documentation is verified in sync with the
   implementation — ADR-139 already captures the locked contract; only
   a doc-sync check is needed, not a new ADR

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
- This work now blocks re-ingest (consolidated into remediation plan 2026-03-22).

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../active/pre-reingest-remediation.execution.plan.md](../active/pre-reingest-remediation.execution.plan.md) | Active remediation plan executing this recipe's work items |
| [../active/f2-closure-and-p0-ingestion.execution.plan.md](../active/f2-closure-and-p0-ingestion.execution.plan.md) | P0 lane — Phase 2 blocked until remediation completes |
| [search-contract-followup.plan.md](search-contract-followup.plan.md) | S4/S5 source — also executing via remediation plan |
| [thread-sequence-semantic-surfaces.execution.plan.md](thread-sequence-semantic-surfaces.execution.plan.md) | Broader enrichment plan for richer derived thread/sequence surfaces |
| [../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md](../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | Research evidence for richer future sequence semantic fields |
| [../../../research/elasticsearch/methods/hybrid-retrieval.md](../../../research/elasticsearch/methods/hybrid-retrieval.md) | Elastic method note updated with current Oak sequence state |
