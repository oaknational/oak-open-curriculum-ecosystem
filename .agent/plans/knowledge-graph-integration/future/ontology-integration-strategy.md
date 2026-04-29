---
name: "Ontology Integration Strategy"
overview: "Strategy for moving from static ontology data copies to dynamic integration — either via a published package or by incorporating the ontology repo as a workspace."
status: future
related_plans:
  - "../active/nc-knowledge-taxonomy-surface.plan.md"
  - "../active/open-education-knowledge-surfaces.plan.md"
  - "../current/kg-alignment-audit.execution.plan.md"
specialist_reviewer: "architecture-reviewer-betty, architecture-reviewer-barney, mcp-reviewer"
---

# Ontology Integration Strategy

**Status**: FUTURE — historical strategy, decision reopened
**Last Updated**: 2026-04-29
**Depends on**: WS-4 (Oak KG knowledge taxonomy surface) proving the
integration pattern works with a static copy first.

> **2026-04-29 update**: The earlier recommendation against a monorepo
> workspace is no longer treated as settled. Oak's organisational priority now
> requires re-examining how the MCP server, Oak knowledge graphs, semantic
> search, and API contract come together. Use
> [oak-curriculum-ontology-workspace-reassessment.plan.md](oak-curriculum-ontology-workspace-reassessment.plan.md)
> as the current decision-reopening brief; this document remains valuable
> historical context.

## Problem

The Oak Curriculum Ontology
([oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology))
is a separate repository with its own release cadence, authored
primarily by Mark Hodierne. It models Oak's curriculum structure
aligned to the National Curriculum for England (2014) using W3C
standards (RDF, OWL, SKOS, SHACL).

The current integration plan (WS-4) uses a **static copy** of
ontology `.ttl` files extracted at build time. This is acceptable
as a first step — it proves the integration pattern and delivers
immediate value. However, static copies create a maintenance
liability:

- **Staleness**: The ontology evolves independently. A static copy
  diverges silently as the upstream repo receives new commits.
- **Version ambiguity**: Without a versioned dependency, it's
  unclear which ontology version the MCP server is serving.
- **Manual sync**: Someone must remember to copy updated files,
  re-extract, and verify. This is error-prone and doesn't scale.
- **No CI gate**: There is no automated check that the copy matches
  any upstream version.

This plan defines the strategy for moving to dynamic integration.

## Relationship Constraints

The National Curriculum is a separate conceptual entity with
separate ownership (DfE). Oak's curriculum resources are
NC-compliant but are not the NC itself. The ontology repo is Oak's
representation of curriculum structure aligned to the NC — it is
not the NC. All integration work must preserve this distinction in
naming, descriptions, and data provenance signals (the `oak-kg-*`
namespace prefix).

## Options

### Option A: Published npm Package

The ontology repo publishes its data as an npm package (e.g.
`@oaknational/curriculum-ontology-data`). This repo consumes it
as a workspace dependency.

**How it works**:

1. The ontology repo adds a build step that extracts structured
   JSON from `.ttl` files (SKOS → JSON, programme structures →
   JSON, etc.)
2. Publishes to npm with semantic versioning
3. This repo adds the package as a dependency
4. The codegen pipeline (`pnpm sdk-codegen`) imports from the
   package instead of reading static files
5. Dependabot / Renovate PRs keep the version current
6. CI verifies type compatibility on version bumps

**Pros**:

- Clean dependency boundary — each repo stays independent
- Semantic versioning communicates breaking changes
- Standard npm tooling for updates (Dependabot/Renovate)
- The ontology repo can be consumed by other projects too
- No git submodule complexity
- Clear ownership boundary matches the organisational reality

**Cons**:

- Requires changes to the ontology repo (build + publish pipeline)
- Adds a publish step to the ontology repo's workflow
- Version lag between ontology commit and package availability
- Type extraction must happen in the ontology repo (or this repo
  must parse the package's JSON at build time)

### Option B: Monorepo Workspace

Move the ontology repo into this repo as a pnpm workspace, or use
a git submodule that appears as a workspace.

**How it works**:

1. Add `oak-curriculum-ontology` as a workspace in `pnpm-workspace.yaml`
2. Either: (a) move the repo contents into a directory here, or
   (b) use a git submodule
3. The codegen pipeline references the workspace directly
4. Changes to ontology files trigger rebuilds via Turborepo

**Pros**:

- Zero-lag integration — ontology changes are immediately visible
- Single `pnpm install` / `pnpm check` validates everything
- Turborepo dependency graph handles rebuild cascading
- No publish step needed

**Cons**:

- The ontology repo has a Python toolchain (validation, SPARQL,
  documentation generation) — adding it to a Node.js monorepo
  creates toolchain friction
- Blurs ownership boundary — the ontology is a distinct project
  with a distinct author and should remain so
- Git submodules have well-known ergonomic issues
- Moving the repo loses git history (or requires a subtree merge)
- Other consumers of the ontology would need to pull from this
  repo or the package would still need publishing

### Option C: Git Submodule with Build-Time Extraction

A lightweight hybrid: the ontology repo is a git submodule, but
this repo's codegen pipeline extracts what it needs at build time.

**How it works**:

1. Add `oak-curriculum-ontology` as a git submodule in a
   designated directory (e.g. `external/oak-curriculum-ontology`)
2. Pin to a specific commit/tag for reproducibility
3. The codegen pipeline reads `.ttl` files from the submodule
   directory and extracts JSON
4. CI initialises the submodule and runs extraction as part of
   `pnpm sdk-codegen`

**Pros**:

- No changes required to the ontology repo
- Pinned to a specific version (commit/tag)
- The ontology repo remains fully independent
- Simpler than Option B, more dynamic than static copies

**Cons**:

- Git submodule ergonomics (must remember `--recurse-submodules`)
- Submodule version bumps are manual (though scriptable)
- CI must handle submodule initialisation
- Still requires this repo to parse `.ttl` files

## Previous Recommendation

The following recommendation is historical context from before the
2026-04-29 reopening. It should not be treated as the current decision
authority; use
[oak-curriculum-ontology-workspace-reassessment.plan.md](oak-curriculum-ontology-workspace-reassessment.plan.md)
for the live decision frame.

**Option A (published npm package)** was the preferred long-term strategy. It
preserves the independence of both repos, uses standard tooling, and creates a
reusable asset that other projects can consume. The ontology repo already has a
Python build pipeline; adding a JSON extraction + npm publish step is a natural
extension.

**Option C (git submodule)** was an acceptable interim step if Option A is
blocked by ontology repo capacity. It's strictly better than static copies
because the version is pinned and the update mechanism is explicit.

**Option B (monorepo workspace)** was not recommended in this earlier analysis.
That conclusion is now reopened because the organisational priority around MCP,
Oak KGs, semantic search, and API convergence may change the trade-off.

## Migration Path

```text
Phase 0: Static copy (current WS-4 plan)
  ↓ proves the integration pattern works
Phase 1: Git submodule (Option C) — interim
  ↓ if ontology repo can't publish yet
Phase 2: Published package (Option A) — target
  ↓ ontology repo adds JSON extraction + npm publish
Phase 3: Dependabot/Renovate keeps versions current
```

Each phase is independently valuable. Phase 0 is already planned.
Phase 1 can happen whenever the static copy becomes stale. Phase 2
requires coordination with the ontology repo author.

## NC Symbol Rename (Related)

The codegen pipeline contains NC-prefixed symbols from the bulk
data extraction (`NCCoverageGraph`, `NCStatementNode`,
`extractNCStatements`, etc.). These extract `nationalCurriculumContent`
strings from the Oak API — genuinely NC content recorded in Oak's
data. However, the naming implies these are NC's own data
structures rather than Oak's coverage mapping. A future rename
session should align these with the provenance principle:

- `NCStatementNode` → e.g. `CurriculumStatementNode`
- `NCCoverageGraph` → e.g. `CurriculumStatementCoverageGraph`
- `nc-statement-extractor.ts` → e.g. `curriculum-statement-extractor.ts`
- `nc-coverage-generator.ts` → e.g. `curriculum-coverage-generator.ts`
- `nc-coverage-graph/` → e.g. `curriculum-statement-coverage/`

The upstream API field name `nationalCurriculumContent` is
untouchable (cardinal rule, ADR-029). Only Oak's derived symbols
need renaming. ~25 files affected, all internal to codegen — no
MCP surface impact.

## Exit Criteria

1. Ontology data consumed dynamically (not static copy)
2. Version pinned and visible in dependency graph
3. CI validates type compatibility on version changes
4. `oak-kg-*` namespace preserved on all ontology-sourced surfaces
5. No implication that Oak = NC in any naming or description
