# SDK Codegen Architecture: Reviewer Findings and Owner Response

**Date**: 2026-03-02
**Companion to**: [sdk-codegen-architecture-analysis.md](sdk-codegen-architecture-analysis.md)

---

## Purpose

This document records the findings from all four architecture reviewers
(Barney, Betty, Fred, Wilma) and the owner's corrections. The corrections
are substantive — they change the direction of the redesign.

---

## Owner Corrections

### Correction 1: ESLint ignores are not a solution

Betty recommended adding `src/generated/**` to ESLint's global `ignores` array
to fix the OOM. The owner rejected this:

> Turning off linting for generated files is not a solution, it is a copout,
> and strictly forbidden in the rules.

The rules are explicit: "NEVER disable checks. Fix the root cause. Never work
around it." Adding files to the ESLint `ignores` array is disabling a check.

**Exception granted**: The graph data files specifically (prerequisite,
misconception, vocabulary, NC coverage, thread progression — each 5K to 122K
lines of static data) may have linting disabled. These are not code in any
meaningful sense — they are serialised data structures. The exception applies
only to the large graph data files, not to all generated output. Generated
code (types, Zod schemas, MCP tool descriptors, search mappings) must
continue to be linted.

**Implication**: The OOM fix cannot rely on blanket ESLint ignores for
generated output. The fix must be:

1. Eliminate the data duplication (one copy, not two) — this halves the
   lint load from ~688K to ~344K lines
2. Disable linting only for the specific large graph data files
3. All other generated code remains fully linted

> **Resolved (M1)**: All three points addressed. vocab-gen writes to
> `src/generated/vocab/` (single copy), duplicates deleted, and the vocab
> barrel split (`./vocab` types-only, `./vocab-data` runtime data) breaks
> the import chain so TypeScript's project service never loads the large
> files during linting.

### Correction 2: Generated files outside `src/` is correct

Betty called it "a dangerous coupling risk" to keep generated output outside
`src/`. Fred said it "needs proof-of-concept validation". The owner disagreed:

> What is the problem with having the generated files kept outside of the
> source? They are not source code, they are a build artefact.

This reframes the architecture. Generated files are artefacts produced by the
build pipeline, not source code authored by humans. Source code is what humans
(and agents) write and maintain. Build artefacts are what pipelines produce.
The distinction matters:

- **Source code** (`src/`): hand-authored, linted, reviewed, tested, maintained
- **Build artefacts** (`generated/`): produced by pipelines, consumed by
  barrels, not edited, not reviewed line-by-line

The build system must accommodate this. If `tsconfig.build.json` requires
`rootDir: ./src` and barrels in `src/` need to import from `../generated/`,
then the build configuration needs to change — not the architecture. The
build serves the architecture, not the other way around.

**Implication**: The analysis report's "ideal separation" (Section 8) was
correct in placing generated output at `generated/` at the package root.
The reviewers' objections were about build tooling, not architecture. Build
tooling can be changed; architectural principles should not bend to tooling
constraints.

Concrete approaches to resolve the build boundary:

- Change `rootDir` to `.` (the package root) and adjust `outDir`/exports
- Use TypeScript path mappings (`paths` in tsconfig)
- Use tsup entry points that explicitly include generated paths
- Use a post-generation step that creates symlinks or barrel re-exports

The right approach will be determined during implementation, but the
architectural direction — generated output outside `src/` — stands.

### Correction 3: Missing separation of concerns — two data sources

All four reviewers missed a fundamental structural problem:

> We have a separation of concerns problem. We are mixing types and constants
> and guards derived from the upstream OpenAPI spec, with data, types, and
> guards derived from the bulk data — two related but separate sources of
> information.

The workspace conflates two distinct data lineages:

**Lineage A — OpenAPI API Schema**:

- Source: `https://open-api.thenational.academy/api/v0/swagger.json`
- Pipeline: `code-generation/codegen.ts`, `zodgen.ts`, `bulkgen.ts`
- Produces: TypeScript types, Zod schemas, MCP tool descriptors, path
  utilities, response maps, search index contracts, ES mappings
- Consumed via: `api-schema`, `mcp-tools`, `search`, `zod`, `observability`,
  `admin`, `query-parser`, `widget-constants`, parts of `.` (main)

**Lineage B — Bulk Curriculum Data**:

- Source: Bulk download JSON files (`apps/oak-search-cli/bulk-downloads/`)
- Pipeline: `vocab-gen/` (to be `graph-gen/`)
- Produces: Curriculum knowledge graphs (prerequisite, misconception,
  vocabulary, NC coverage, thread progression), mined synonym data
- Consumed via: `vocab` (to be `curriculum-graphs`), parts of `bulk`

These lineages share a workspace but have different:

- **Sources**: HTTP API schema vs local bulk JSON files
- **Triggers**: API schema changes vs curriculum content changes
- **Pipelines**: `pnpm sdk-codegen` vs `pnpm vocab-gen`
- **Output characteristics**: Code (types, schemas, guards) vs data
  (large static graphs)
- **Change frequency**: API schema changes rarely; curriculum data changes
  with each content update
- **Consumers**: Different downstream workspaces for each

Currently, both lineages produce output into the same `src/` tree, are
linted by the same ESLint config, are built by the same tsconfig, and are
exported through the same `package.json`. The workspace name
(`oak-sdk-codegen`) implies it is about SDK code generation (Lineage A),
but it also houses the curriculum graph pipeline (Lineage B) and the bulk
data infrastructure that supports both search indexing and graph generation.

**Why this matters**: The OOM is not just about data duplication. It is
about a workspace that is trying to lint 39K lines of generated code
(appropriate) AND 344K+ lines of generated data (inappropriate) with the
same tooling. Even after eliminating the duplication, a single copy of the
graph data is ~344K lines. Linting that is wasteful — not because linting
is unimportant, but because these are serialised data files, not code.

The separation of concerns also affects:

- **Build times**: Generated data files are enormous; rebuilding them when
  only the API schema changed is wasted work
- **Lint configuration**: Code needs full linting; data files need only
  formatting and structural checks
- **Testing**: Generated code should have conformance tests; generated data
  files should have structural validation (schema conformance), not unit tests
- **Mental model**: A developer looking at `sdk-codegen` should understand
  "this generates types from the API" without also needing to understand
  curriculum graph mining

---

## Reviewer Findings — Complete Record

### Barney (Simplification and Boundaries)

#### Critical

1. `vocab` barrel imports data from `src/generated/vocab/` but pipeline
   writes to `src/mcp/` — live split-brain, already stale (different
   timestamps confirmed)
2. Generator logic duplicated across `vocab-gen/generators/` and
   `src/bulk/generators/`, plus core processing and 7 extractors
3. `src/vocab.ts` exports values from `generated/vocab` and types from
   `bulk` — reverse coupling, unclear ownership
4. Release plan Phase 4 risks breaking search CLI because
   `generateMinedSynonyms` import path is undefined after generator removal

#### High

5. Analysis report's "generators outside src is the root cause" is
   overstated — `code-generation/` works fine outside `src/`; the root cause
   is specifically the vocab-gen pipeline's incomplete integration
6. Analysis report's "not first-class" claim is partially wrong —
   `code-generation/` and `vocab-gen/` are already type-checked, linted, and
   tested; they are not in the build output but are in the quality gate scope
7. Phase 0 (remove NODE_OPTIONS) before Phase 2 (remove duplication) creates
   a CI gap with no fallback
8. `pnpm sdk-codegen` and `pnpm vocab-gen` are disconnected — no single
   command regenerates everything
9. `pnpm clean` removes `src/types/generated` but NOT graph outputs — stale
   artefacts persist across cleans
10. ESLint relaxation configured for `src/generated/vocab/**` and
    `src/types/generated/**` but NOT for `src/mcp/**` — inconsistent, adds
    to OOM pressure
11. `vocab-gen/lib/index.ts` imports from `../../src/bulk/...` — generation
    pipeline cross-wired to runtime export structure

#### Medium/Low

12. `run-vocab-gen.ts` comments reference old workspace name
    (`oak-curriculum-sdk`)
13. README says "11 subpath exports" but `package.json` has 12
14. README says both pipelines run during `sdk-codegen` but they are separate
15. Generated graph naming inconsistent (`thread-progression-data` vs others)
16. Turbo `sdk-codegen` task tracks `vocab-gen` inputs but doesn't execute
    `vocab-gen` — task semantics misaligned
17. Duplicated tests across both generator trees can mask drift

#### Simplification Direction

- Keep `src/bulk` as canonical for generators; make `vocab-gen` a thin
  orchestration layer importing from `src/bulk`
- One canonical generated graph location
- Types from graph modules, not via `bulk` re-exports
- Align command semantics

---

### Betty (Cohesion, Coupling, Change Cost)

#### Critical

1. **[OWNER REJECTED]** Analysis Option A ("generated output outside `src/`")
   creates dangerous coupling risk — fragile path-mapping, runtime
   `MODULE_NOT_FOUND` risk. Recommended keeping generated data at
   `src/generated/curriculum-graphs/` and fixing OOM via ESLint ignores.
   **Owner response**: Generated files are build artefacts, not source code.
   They belong outside `src/`. Build tooling must adapt.
2. Release plan sequencing inversion — Phase 4 fails because build boundary
   constraint blocks generator consolidation before data consolidation.
   Must bring generators into `src/` first.

#### Warnings

3. Hand-authored `property-graph-data.ts` mixed with generated data in
   `src/mcp/` — move to `src/domain-models/` immediately
4. 7 duplicated extractors should merge into `src/graph-gen/extractors/`;
   search CLI imports via `bulk` barrel re-export

#### Recommendations

5. Adopt the 5-domain split: `src/api-codegen/`, `src/graph-gen/`,
   `src/bulk/`, `src/synonyms/`, `src/domain-models/`
6. Keep `rootDir: ./src`, keep generated output inside `src/generated/`
   **[OWNER REJECTED — generated output goes outside `src/`]**
7. Invoke `config-reviewer` for tsconfig/package.json/eslint alignment

---

### Fred (ADR Compliance and Boundary Discipline)

#### Critical Violations

1. **CV-1**: Generator duplication violates DRY, ADR-030, and Cardinal Rule.
   8 generators in two locations, manual parallel maintenance, silent drift
   risk.
2. **CV-2**: Generated data duplication (~688K lines) violates ADR-031
   (generation-time extraction). Manual copy between pipeline output and
   barrel import.
3. **CV-3**: `NODE_OPTIONS=--max-old-space-size=4096` violates
   never-disable-checks rule.
4. **CV-4**: Inline `eslint-disable max-lines` in `property-graph-data.ts`
   violates never-disable-checks rule. Should use `eslint.config.ts`
   targeted override.
5. **CV-5**: Domain mixing in `src/mcp/` (generated + hand-authored) violates
   ADR-108 §File Placement.

#### Warnings

6. **W-1**: Extractor duplication (7 files) — DRY breach.
7. **W-2**: `vocab-gen/lib/index.ts` couples generation to runtime structure.
8. **W-3**: `pnpm sdk-codegen` and `pnpm vocab-gen` disconnected.
9. **W-4**: ESLint blanket disable for `code-generation/**` (6 rules off) —
   should be narrowed to file-specific overrides.
10. **W-5**: `src/types/generated/**` has 12 rules disabled, including
    `consistent-type-assertions` and `no-unsafe-assignment` — weakens
    type-safety guarantee.

#### ADR Compliance Summary

| ADR | Status |
|-----|--------|
| ADR-029 (No Manual API Data) | Spirit violation — manual copy |
| ADR-030 (SDK Single Source of Truth) | Violation — generators in two locations |
| ADR-031 (Generation-Time Extraction) | Violation — manual copy required |
| ADR-034 (System Boundaries) | Warning — assertion checks disabled |
| ADR-038 (Compilation-Time Revolution) | Compliant |
| ADR-108 (Workspace Decomposition) | Partial violation |

#### Assessment of Analysis Report

- Factually accurate across all claims verified against filesystem
- "Ideal separation" requires ADR-108 revision
- **[OWNER OVERRULED]** Recommended keeping generated output inside `src/`
  as "architecturally safer". Owner directed generated output outside `src/`.
- Sided with release plan ordering (data first, generators second) for
  pragmatic reasons

---

### Wilma (Resilience, Failure Modes, Operational Safety)

#### Critical (P0)

1. Phase 4 breaks search CLI — `generateMinedSynonyms` has no defined
   export path after `src/bulk/generators/` is removed.

#### High (P1)

2. Phase 0 before Phase 2 creates CI gap with no fallback
3. Vocab barrel type dependency on `bulk` — removing generator re-exports
   before re-routing types breaks `vocab`
4. Extractor consolidation: `processBulkData` needs new import path if
   shared extractors move
5. Silent data staleness: no CI check that pipeline output matches barrel
   imports

#### Medium (P2)

6. `run-vocab-gen.ts` has no startup validation for bulk data path
7. Stale comments reference `oak-curriculum-sdk` not `oak-sdk-codegen`
8. ESLint lints `src/mcp/` generated files with full rules (no override)
9. No explicit "generation complete" check before build
10. Partial build can leave some subpath exports present, others missing

#### Hidden Coupling (P1)

11. Vocab barrel imports from three locations — moving one without
    updating barrel causes partial breakage
12. Search CLI runtime dependency on `generateMinedSynonyms` from a
    "generation-time" workspace
13. Extractor overlap creates undeclared cross-domain dependency

#### Phase 4 Preconditions

Before Phase 4 can proceed:

1. Define export path for `generateMinedSynonyms`
2. Update `vocabulary-mining-adapter.ts` to new import
3. Re-route vocab barrel types from `bulk` to generated data files
4. Decide extractor consolidation direction

---

## Cross-Reviewer Consensus

| Finding | B | Be | F | W |
|---------|---|-----|---|---|
| Generator duplication is the root structural problem | Y | Y | Y | Y |
| Data duplication causes OOM, must be eliminated | Y | Y | Y | Y |
| Phase 4 breaks search CLI (`generateMinedSynonyms`) | Y | — | — | Y |
| Phase 0 before Phase 2 creates CI gap | Y | — | — | Y |
| Vocab barrel type/value split is a risk | Y | — | — | Y |
| `sdk-codegen` and `vocab-gen` should connect | Y | — | Y | — |
| `pnpm clean` doesn't clean graph outputs | Y | — | — | — |
| ADR-108 needs revision | — | — | Y | — |
| Inline eslint-disable in property-graph must go | — | — | Y | — |

## What the Reviewers Missed

### The two-source separation of concerns

No reviewer identified that the workspace conflates two distinct data
lineages:

1. **OpenAPI API schema** → types, Zod schemas, guards, MCP tool
   descriptors, search contracts
2. **Bulk curriculum data** → knowledge graphs, mined synonyms, extractors,
   curriculum-specific processing

These have different sources, different triggers, different output
characteristics, different change frequencies, and partially different
consumers. Mixing them in one workspace creates:

- Lint tooling that must accommodate both 39K lines of generated code AND
  344K+ lines of generated data
- A build that must rebuild everything when either source changes
- A mental model that conflates "SDK code generation" with "curriculum data
  mining"
- Subpath exports that serve two unrelated purposes (`api-schema` for one
  lineage, `vocab` for the other) through the same package

This separation of concerns problem is more fundamental than the
duplication. The duplication is a symptom of trying to serve two masters
in one workspace without acknowledging they are different.

### Build artefact vs source code distinction

All four reviewers treated generated output as source code that must live
inside `src/`. Betty explicitly argued against moving it outside `src/`
on build-tooling grounds. None distinguished between:

- Source code (what you write and maintain)
- Build artefacts (what pipelines produce)

This distinction is the key architectural insight. `src/` is for source
code. Generated output is a build artefact. The build system should be
configured to serve the architecture, not the other way around.

---

## Impact on the Plan

These corrections change the plan direction:

1. **Generated output goes outside `src/`** at `generated/` at the package
   root (or equivalent). The build configuration changes to accommodate this.
2. **Large graph data files may have linting disabled** as a specific
   exception. All other generated code (types, schemas, guards) must be
   linted.
3. **The two-source separation** should be reflected in the directory
   structure, potentially in separate generation commands, and in the way
   lint and build are configured.
4. **The Phase 4 precondition** (define `generateMinedSynonyms` export path)
   is confirmed as a hard blocker regardless of sequencing direction.

---

## References

- [Architecture analysis](sdk-codegen-architecture-analysis.md)
- [Release Plan M1](../../archive/completed/release-plan-m1.plan.md) — §ESLint OOM Fix
- [Session Continuation](../../../prompts/archive/session-continuation.prompt.md)
- [Rules](../../../directives/principles.md) — never disable checks
