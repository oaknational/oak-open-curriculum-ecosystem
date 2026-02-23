---
name: SDK Separation Pre-Phase-1 Decisions
overview: >
  Architectural decisions and plan refinements required before Phase 1 of the
  SDK workspace separation begins. Captures issues surfaced by adversarial
  review, user direction on bulk-download architecture, and vocabulary mining
  convergence opportunity.
todos:
  - id: bulk-ownership-decision
    content: "Decide public/bulk ownership: generation-time pipeline vs runtime facade."
    status: pending
  - id: bulk-download-caching
    content: "Design bulk download caching at type-gen time with staleness detection."
    status: pending
  - id: vocabulary-convergence
    content: "Design single vocabulary/synonym mining pipeline replacing fragmented sources."
    status: pending
  - id: d1-scope-refinement
    content: "Refine Phase 3 move list: distinguish generated, authored, and runtime-composition files."
    status: pending
  - id: baseline-gate-strategy
    content: "Replace hard-coded baseline numbers with commit-anchored evidence."
    status: pending
  - id: phase-collapse-evaluation
    content: "Evaluate collapsing Phases 2+3+4 into one atomic move-and-rewire slice."
    status: pending
  - id: update-canonical-plan
    content: "Apply all resolved decisions back to sdk-workspace-separation.md."
    status: pending
isProject: false
---

# SDK Separation Pre-Phase-1 Decisions

Decisions required before Phase 1 of the
[canonical SDK workspace separation plan](sdk-workspace-separation.md) begins.

## Origin

- **Adversarial review** by architecture-reviewer-barney (22 Feb 2026):
  identified incomplete reverse-dependency inventory, `public/bulk` ownership
  gap, D1 scope overreach, brittle baseline gate, and phase-collapse
  opportunity.
- **User direction** (22 Feb 2026): bulk download and processing should move to
  type-gen time; vocabulary/synonym/alias mining should converge into a single
  pipeline mining all three sources (OpenAPI spec, bulk-downloads JSON Schema,
  bulk download data).

---

## D1. `public/bulk` Ownership and Bulk Download Architecture

### Current state

`src/bulk/` in the curriculum SDK contains:

- `reader.ts` — reads and Zod-validates bulk download JSON files from disk
- `processing.ts` — processes bulk data for downstream consumers
- `extractors/` — extracts keywords, misconceptions, etc. from bulk data
- `generators/` — generates TypeScript artefacts (synonym miner, graph data)

`src/public/bulk.ts` re-exports these as a public API surface. 22 files in
`apps/oak-search-cli/` import from `@oaknational/curriculum-sdk/public/bulk`.

`vocab-gen/` orchestrates the extractors and generators, producing files like
`definition-synonyms.ts`, `*-graph-data.ts`, and `thread-progression-data.ts`.

### User direction

Bulk download, caching, and processing should move to **type-gen time**. This
is currently ad-hoc (scripts in search CLI, manual `pnpm vocab-gen` runs). The
target is a deterministic generation pipeline that:

1. Downloads bulk data files (or uses a local disk cache)
2. Validates them against the bulk-downloads JSON Schema
3. Runs all extraction and generation (synonyms, graphs, vocabulary mining)
4. Produces TypeScript artefacts consumed by runtime and search SDKs

### Key questions

- **Cache location**: where on disk? `.cache/bulk-downloads/` in workspace root
  (gitignored)? Or within the generation workspace?
- **Staleness detection**: how does the pipeline know when to re-download?
  Options: `last-updated` API endpoint, ETag/If-Modified-Since headers, local
  manifest with timestamps, or manual invalidation.
- **Consumer contract**: does `public/bulk` remain a runtime API surface
  (runtime re-exports from generation), or does it become generation-owned with
  apps importing from the generation package directly?
- **Search CLI impact**: the search CLI currently reads bulk files at runtime
  for indexing. Does this become a generation-time pre-processing step, or does
  the search CLI continue to read bulk files directly for index operations?

### Decision needed before Phase 1

At minimum: decide whether `src/bulk/` moves to the generation workspace in
Step 1, or remains runtime with a rewire in a later step. The downstream
consumer surface (22 files in search CLI) makes this a high-impact decision.

---

## D2. Vocabulary / Synonym / Alias Mining Convergence

### Current fragmented landscape

| Source | Location | What it produces | When it runs |
|---|---|---|---|
| Curated synonyms | `src/mcp/synonyms/*.ts` (17 subject files) | ~580 hand-curated synonym entries | Manual edits |
| Mined definition synonyms | `src/mcp/synonyms/generated/definition-synonyms.ts` | 397 entries from keyword definitions | `pnpm vocab-gen` |
| Synonym miner code | `src/bulk/generators/synonym-miner.ts` AND `vocab-gen/generators/synonym-miner.ts` (duplicated) | Produces `definition-synonyms.ts` | `pnpm vocab-gen` |
| Planned bucket classification | `vocabulary-mining.md` Phase 1 | Classify ~580 entries into Alias/Paraphrase/Sense-bound/Relationship | Not started |
| Planned paraphrases | `natural-language-paraphrases.md` | Query-time expansions (Bucket B) | Not started |
| Search-SDK synonyms | Index configuration in `oak-search-sdk` | ES synonym sets for search indexes | Index creation |

### User direction

Converge into a **single, definitive mining pipeline** at type-gen time that
mines all three knowledge sources:

1. **OpenAPI spec** — endpoint names, parameter names, enum values, descriptions
2. **Bulk-downloads JSON Schema** — field names, type descriptions, enum values
3. **Bulk download data** — the actual curriculum content where implicit domain
   knowledge is encoded (definitions, transcript patterns, entity relationships)

This subsumes the current `vocab-gen`, the planned vocabulary-mining.md work,
and the planned natural-language-paraphrases.md work. The output is a single
set of typed artefacts consumed by MCP servers, search indexes, and query
processing.

### Relationship to `definition-synonyms.ts`

`definition-synonyms.ts` is a generated file (397 entries) produced by
`vocab-gen`'s synonym miner. It mines "also known as" and similar patterns
from keyword definitions in bulk data. Quality is variable — some entries are
noise (e.g., Spanish verb conjugations mapped as "synonyms"). This file would
be subsumed by the converged mining pipeline.

### Decision needed before Phase 1

This convergence is a larger effort than the SDK split itself. The question for
Phase 1 is: does the split plan need to account for this future convergence in
its boundary placement, or can it proceed with the current `vocab-gen` output
structure and refactor later?

Recommended: proceed with the split as planned, but ensure the generation
workspace's public API is designed to accommodate future convergence (i.e.,
don't hard-wire consumers to specific generated file paths).

---

## D3. Phase 3 Move List Refinement (D1 Scope)

### Issue

The canonical plan's Phase 3 lists files to move, but mixes three categories:

| File | Category | Action |
|---|---|---|
| `*-graph-data.ts` (misconception, prerequisite, vocabulary, nc-coverage, thread-progression) | Generated by `vocab-gen` | Move to generation workspace |
| `property-graph-data.ts` | **Authored** domain knowledge (explicitly states "authored" in JSDoc) | Remains runtime? Or move as authored content? |
| `definition-synonyms.ts` | Generated by `vocab-gen` | Move to generation workspace |
| `aggregated-thread-progressions.ts` | **Runtime composition** (wraps generated data) | Stays runtime per D3 |
| `aggregated-prerequisite-graph.ts` | **Runtime composition** (wraps generated data) | Stays runtime per D3 |

### Decision needed

1. Confirm `property-graph-data.ts` ownership. It's authored, not generated,
   but describes domain ontology that could logically belong to the generation
   pipeline. If it stays runtime, remove from Phase 3 list. If it moves,
   reclassify it.
2. Remove `aggregated-*` files from Phase 3 list — they are runtime composition
   per decision D3 and should not move.

---

## D4. Baseline Gate Strategy

### Issue

AC1 hard-codes file counts (`type-gen=192`, `src=302`, `generated=106`,
`imports=56`). The plan's own risk section says "refresh Section 4 metrics
before file moves." This creates a contradiction: the AC demands exact numbers
that will drift with unrelated branch work.

### Options

1. **Commit-anchored evidence**: replace fixed numbers with "snapshot evidence
   file committed at Phase 0 completion + command replay matches at Phase 1
   start."
2. **Range tolerance**: keep numbers but allow ±5% drift with mandatory refresh.
3. **Keep as-is**: accept that numbers may need updating before Phase 1 starts.

### Recommendation

Option 1 (commit-anchored evidence). Create a
`sdk-workspace-separation-baseline.json` committed alongside Phase 0
completion, and AC1 becomes "command replay matches committed baseline."

---

## D5. Phase Collapse Evaluation

### Issue

Barney recommended collapsing Phases 2+3+4 into one atomic
"move + rewire + boundary enforcement" slice to avoid fragile intermediate
states where the codebase is partially split.

### Trade-offs

| Approach | Pro | Con |
|---|---|---|
| Atomic (2+3+4 merged) | No fragile intermediate state; simpler rollback | Larger single change; harder to review; harder to TDD incrementally |
| Sequential (current) | Smaller reviewable units; TDD red-green-refactor per phase | Intermediate states may not compile; requires careful ordering |

### Recommendation

Keep the current sequential phases but add explicit **intermediate compilation
gates** between phases. Each phase must end with `pnpm build && pnpm type-check`
passing. This preserves incremental TDD while preventing fragile intermediate
states.

---

## Resolved Decisions (applied to canonical plan)

These items from Barney's review have been directly applied:

- [x] Reverse-dependency inventory expanded from 1 to 9 files (Section 5)
- [x] Auth ADRs moved to background context (Section 3)
- [x] "No deep imports" acceptance criterion added (AC5)
- [x] Root script wiring risk added (Section 11)
- [x] Legacy plan superseded, ADR-108 link updated
- [x] `property-graph-data.ts` added to Phase 3 file list (pending D3 decision
  above on whether it should stay or be reclassified)
- [x] Baseline src count refreshed from 300 to 302
