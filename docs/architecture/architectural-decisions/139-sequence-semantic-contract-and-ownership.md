# ADR-139: Sequence Semantic Contract and Ownership

## Status

Accepted

## Date

2026-03-21

## Context

Sequence search is temporarily lexical-only. The generated schema and mapping
still carry `sequence_semantic`, but the current sequence document builder does
not populate it and SDK retrieval therefore stays on the lexical path.

Before the implementation executes, the repository needs one permanent
architectural source of truth for:

1. whether `sequence_semantic` stays or is removed,
2. how the field is constructed,
3. which layer owns document production versus retrieval semantics,
4. what must be true before sequence retrieval returns to hybrid behaviour.

ADR-077, ADR-097, and ADR-110 all touch adjacent history, but none of them
define the full replacement contract for sequences.

## Decision

### 1. `sequence_semantic` stays and becomes required in produced documents

`sequence_semantic` remains part of the generated sequence schema/mapping and is
the target production contract. When the implementation lands, produced
sequence documents must populate it as a required, non-empty field.

### 2. Ownership split is explicit

- `apps/oak-search-cli` ingestion/indexing owns production and validation of
  `sequence_semantic` in indexed documents.
- `@oaknational/oak-search-sdk/read` owns sequence retrieval shape, filters, and
  query semantics.
- CLI runtime search must consume SDK retrieval helpers. Any remaining
  CLI-local sequence retriever is legacy compatibility only and may be removed
  or reduced to a thin adapter.

### 3. Construction is deterministic and schema-driven

`sequence_semantic` is constructed deterministically from real sequence
sub-content, not hand-written or model-generated prose.

The construction contract is:

1. derive the ordered concrete unit slug list from the sequence-units payload
   via one shared helper,
2. resolve shared `SearchUnitSummary` data for every ordered slug,
3. build each unit contribution by reusing the existing unit semantic summary
   contract (`generateUnitSemanticSummary(...)` or a behaviour-preserving shared
   helper extracted from it),
4. prepend one deterministic sequence context line,
5. join the ordered unit contributions with double newlines.

### 4. Missing required source material is a build failure

Sequence production must fail fast if:

- a sequence resolves to zero concrete unit slugs,
- any required unit summary is missing,
- any required semantic segment normalises to the empty string after trimming.

### 5. Retrieval returns to hybrid only after producer and tests land together

Sequence retrieval returns to two-way RRF only after the producer exists and the
tests prove producer and consumer together.

The locked retrieval shape is:

- BM25 over the existing lexical sequence fields,
- semantic query over `sequence_semantic`,
- the same shared filter on both retrievers,
- `rank_constant: 40`,
- `rank_window_size: 40`.

## Consequences

### Positive

- Sequences now have a permanent architectural contract rather than relying on
  plan prose.
- Ownership is split cleanly between document production and retrieval
  semantics.
- The repository avoids a dormant optional semantic field as the intended
  end-state.

### Negative

- Sequence indexing must be refactored to consume ordered unit data and shared
  unit summaries coherently.
- Until the implementation lands, documentation must describe both the current
  lexical-only interim state and the locked target state.

### Neutral

- The active remediation plan is the execution document for tests, task
  ordering, and change sequencing, but it must not contradict this ADR.

## Related

- ADR-077: Local Semantic Summary Generation at Ingest Time
- ADR-097: Context Enrichment Architecture for Curriculum Search
- ADR-110: Thread Search Architecture
- ADR-134: Search SDK Capability Surface Boundary
