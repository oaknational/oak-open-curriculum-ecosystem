---
name: "Ontology Repo Fresh-Perspective Review"
overview: "Revisit the official Oak ontology repo from an upstream-first starting point, without inheriting search-first or current-plan-first assumptions, and write up what that fresh read changes."
status: complete
related_reports:
  - "../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md"
related_plans:
  - "ontology-integration-strategy.md"
  - "../active/open-education-knowledge-surfaces.plan.md"
  - "../current/kg-alignment-audit.execution.plan.md"
specialist_reviewer: "docs-adr-reviewer, assumptions-reviewer, onboarding-reviewer"
todos:
  - id: fp-1-source-lock
    content: "Pin the ontology repo commit or release being reviewed, and record the exact files, scripts, and generated artefacts used in the review."
    status: complete
  - id: fp-2-neutral-inventory
    content: "Inventory the ontology repo from first principles: ontology model, instance-data slices, validation surfaces, distributions, export scripts, and repo-level documentation."
    status: complete
  - id: fp-3-consumer-classification
    content: "Classify findings by consumer without privileging search: MCP orientation, standalone MCP resources, search projections, QA/editorial workflows, and external interoperability."
    status: complete
  - id: fp-4-assumption-audit
    content: "Identify where existing local plans or service assumptions have over-fit the ontology to current repo shapes, and record what becomes visible when those assumptions are removed."
    status: complete
  - id: fp-5-write-up
    content: "Write a short neutral synthesis of the fresh-perspective findings and propagate the results into the relevant plan and report navigation surfaces."
    status: complete
---

# Ontology Repo Fresh-Perspective Review

**Status**: COMPLETE  
**Last Updated**: 19 April 2026  
**Completed**: 19 April 2026

## Purpose

The repo now has a strong local synthesis of ontology implications for MCP and
search in
[oak-ontology-mcp-search-integration-report-2026-04-19.md](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md).
That report is intentionally useful for current repo decisions, but it is still
anchored in the shapes and needs of this repo.

This plan exists to create a second, deliberately neutral pass over the official
ontology repo itself.

The goal is to answer:

- what the ontology repo reveals when read as its own product
- what opportunities are visible outside a search-first frame
- which current local assumptions are helpful, and which ones are narrowing the
  ontology too early

## Review Rules

- Start from the ontology repo's own documentation, data layout, validation
  surfaces, and exports.
- Do not assume search is the primary consumer.
- Do not assume MCP orientation is the primary consumer either.
- Classify every opportunity by consumer and maturity rather than by whichever
  local plan discovered it first.
- Keep source ontology, transformed operational graph, and repo-local
  projections clearly separate.

## Expected Output

Produce a short write-up that:

1. inventories the ontology repo neutrally
2. identifies opportunities and blind spots that were easy to miss from inside
   current local plans
3. records which existing local plans should be widened, narrowed, or left
   alone

## Initial Reading Surfaces (Upstream First)

### First-pass source surfaces

1. [oaknational/oak-curriculum-ontology README](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md)
2. [standards-compliance.md](https://github.com/oaknational/oak-curriculum-ontology/blob/main/docs/standards-compliance.md)
3. [data/](https://github.com/oaknational/oak-curriculum-ontology/tree/main/data),
   [ontology/](https://github.com/oaknational/oak-curriculum-ontology/tree/main/ontology),
   and
   [scripts/export_to_neo4j_config.json](https://github.com/oaknational/oak-curriculum-ontology/blob/main/scripts/export_to_neo4j_config.json)

### Second-pass local comparison surfaces

1. [oak-ontology-mcp-search-integration-report-2026-04-19.md](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
2. [ontology-integration-strategy.md](ontology-integration-strategy.md)
3. [open-education-knowledge-surfaces.plan.md](../active/open-education-knowledge-surfaces.plan.md)
4. [kg-alignment-audit.execution.plan.md](../current/kg-alignment-audit.execution.plan.md)

## Completion Note

Executed 19 April 2026 as a narrowed single-deliverable synthesis rather
than five independent documents, following an assumptions-reviewer
assessment that the existing integration report already covered ~80% of
the plan's stated purpose. The synthesis was appended as a
"Fresh-Perspective Addendum" section to the
[integration report](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
rather than creating a standalone document, to avoid a parallel
maintenance surface.

### Key findings

- The integration report's consumer classification is defined by this
  repo's service boundaries. The ontology serves a wider audience (8
  upstream use cases vs 4 local consumer categories).
- Five assumptions in local plans were tested; three should be kept
  (with explicit justification), one should be modified (npm package
  assumption), and one flagged for investigation (namespace separation).
- Three tooling surfaces were under-weighted: SHACL validation as
  consumable CI, JSON-LD distributions as simpler consumption path,
  and the Neo4j export config as a design document.
- Plan-level recommendations: widen the integration strategy, add a
  framing caveat to the graph opportunities strategy, leave the
  knowledge surfaces plan and alignment audit alone.
