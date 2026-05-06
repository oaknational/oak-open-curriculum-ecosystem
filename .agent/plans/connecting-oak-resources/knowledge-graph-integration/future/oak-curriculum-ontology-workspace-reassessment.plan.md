---
name: "Oak Curriculum Ontology Workspace Reassessment"
overview: "Re-open the earlier decision not to integrate the Python ontology repo into this pnpm/Turbo monorepo now that joining the MCP, Oak Knowledge Graphs, and API threads is an organisational priority."
status: future
source_repos:
  - "oak-curriculum-ontology sibling checkout"
related_plans:
  - "ontology-integration-strategy.md"
  - "ontology-repo-fresh-perspective-review.plan.md"
  - "../current/kg-alignment-audit.execution.plan.md"
specialist_reviewer: "architecture-reviewer-betty, architecture-reviewer-barney, type-reviewer, docs-adr-reviewer"
---

# Oak Curriculum Ontology Workspace Reassessment

**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Collection**: `knowledge-graph-integration/`
**Last updated**: 2026-04-29

## Problem and Intent

The previous local strategy preferred a published ontology artefact or
submodule-style integration over moving the sibling `oak-curriculum-ontology`
repo into this monorepo. The reason was pragmatic: the ontology repo is a
Python 3.12 workspace with RDF/OWL/SKOS, SHACL, Neo4j export, and validation
tooling, while this repo is a
TypeScript/pnpm/Turbo monorepo. Asking most developers to learn Python
workspace operations inside the TypeScript repo would add cognitive load and
could weaken day-to-day delivery.

That decision needs re-examination. Oak now needs the MCP server, Oak knowledge
graphs, semantic search, and the public API contract to converge into a
coherent organisational capability. The integration model should be chosen
against that organisational priority, not only against local developer
ergonomics.

## Domain Boundaries and Non-Goals

In scope:

- reassessing separate repo, published package, git submodule/subtree, generated
  artefact dependency, and full workspace integration models;
- identifying how ontology validation, generated distributions, graph exports,
  API/schema contracts, MCP resources, and search projections should align;
- naming developer-experience safeguards if Python tooling enters the monorepo.

Explicit non-goals:

- moving the ontology repo during this strategic brief;
- adding Python build steps to `pnpm check` before the architecture decision;
- changing the ontology source of truth or weakening its RDF/SHACL standards
  posture;
- treating the local checkout path as a permanent repository path.

## Dependencies and Sequencing Assumptions

1. The owner-provided local checkout of `oak-curriculum-ontology` is the
   immediate review source when available, but promotion must pin an upstream
   commit or release.
2. The KG alignment audit should inform the decision, because measured overlap
   changes whether tight repo coupling creates enough value.
3. The Oak OpenAPI integration plan in
   [../../sector-engagement/future/oak-openapi-monorepo-integration.plan.md](../../sector-engagement/future/oak-openapi-monorepo-integration.plan.md)
   is a sibling convergence question; the two should not be decided in
   isolation.
4. Any monorepo option must include explicit developer workflow containment:
   isolated Python commands, clear ownership, no hidden Python failures in
   TypeScript-only work, and documented recovery paths.

## Candidate Models

| Model | What it optimises | Primary concern |
|---|---|---|
| Separate repo + generated artefact contract | Low cognitive load in this repo | Integration lag and weaker end-to-end verification |
| Published package/distribution | Clear dependency boundary and reusable asset | Requires ontology release/publish discipline |
| Git submodule/subtree | Pinned source with less publication overhead | Developer ergonomics and update discipline |
| Monorepo workspace with isolated Python lane | Strongest MCP/KG/API/search convergence | Highest cognitive-load and build-topology risk |
| Hybrid generated workspace | Close generated artefacts, separate Python source | Two-source navigation and regeneration governance |

## Success Signals

Promotion is justified when Oak can answer:

1. Which integration model best serves the MCP + KG + API convergence priority?
2. Which developers need to touch ontology source versus generated artefacts?
3. Which commands prove ontology validation, API generation, MCP surfaces, and
   search projections remain aligned?
4. Which parts of the ontology repo must remain independently releasable for
   external consumers?
5. How will developer cognitive load be contained if Python enters the monorepo?

## Risks and Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| Monorepo integration creates Python tooling burden for TypeScript-only contributors | High | Require isolated command surfaces, explicit ownership, and no accidental coupling to default TS checks |
| Separate-repo strategy preserves current fragmentation | High | Define contract tests across generated artefacts, API output, MCP resources, and search projections |
| Published artefact strategy lags organisational convergence | Medium | Evaluate release automation and whether generated artefacts can be consumed directly between releases |
| Submodule/subtree creates update friction | Medium | Require scripted update and verification path before adoption |
| Ontology and API contracts diverge silently | High | Make cross-contract validation a promotion acceptance criterion |

## Promotion Trigger Into `current/`

Promote when the owner wants an architecture decision and can allocate time for
a bounded comparison of the candidate models against real repo commands,
developer workflows, and cross-contract verification.

The executable plan should include:

1. pinned ontology repo source revision;
2. current ontology command inventory;
3. candidate integration-model scoring;
4. proof commands for at least one thin generated artefact path;
5. reviewer pass from architecture, type-safety, and documentation reviewers;
6. a final ADR or decision note.

## Reference-Context Rule

Implementation detail in this brief is reference context only. The integration
model, command surfaces, and workspace topology are finalised only during
promotion to `current/` or `active/`.
