---
name: "Oak Knowledge Graph External Adoption"
overview: "Define how external organisations can use Oak's ontology, graph exports, SDKs, MCP resources, and search projections responsibly in their own projects."
status: future
related_plans:
  - "../../../knowledge-graph-integration/README.md"
  - "../../../knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md"
specialist_reviewer: "docs-adr-reviewer, security-reviewer, architecture-reviewer-betty"
---

# Oak Knowledge Graph External Adoption

**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Collection**: `sector-engagement/knowledge-graph-adoption/`
**Last updated**: 2026-04-29

## Problem and Intent

Oak's knowledge graph assets are becoming more than internal implementation
details. External organisations may want to use the Oak Curriculum Ontology,
graph exports, SDK surfaces, MCP resources, and semantic search projections in
their own tools, analytics, AI workflows, or research.

The intent is to define a partner-facing adoption model that makes Oak's KG
assets understandable, usable, and safe to consume without confusing internal
integration work with external support obligations.

## Domain Boundaries and Non-Goals

In scope:

- external adopter profiles such as MATs, edtech vendors, researchers, and
  public-sector partners;
- packaging, documentation, provenance, licensing, update cadence, and support
  expectations for Oak KG assets;
- feedback routes from external adoption needs into the internal KG/API/search
  roadmap.

Explicit non-goals:

- implementing new KG runtime features;
- moving the ontology repo into this monorepo;
- promising production support before Oak chooses a support model;
- importing third-party knowledge graphs into Oak applications.

## Dependencies and Sequencing Assumptions

1. Internal KG integration remains owned by
   [knowledge-graph-integration/](../../../knowledge-graph-integration/).
2. The ontology repo integration model affects how external consumers should
   depend on KG assets, so this plan should read the workspace reassessment
   before promotion.
3. The first adopter profile should be selected before any playbook is written;
   MAT analytics, edtech integration, AI-tool orientation, and research reuse
   need different packaging.

## Success Signals

Promotion is justified when Oak can name:

1. the first external adopter profile;
2. the KG assets they should use;
3. the provenance and licensing boundaries they must understand;
4. the support artefact needed first, such as a playbook, example project,
   reference export, or partner-call brief;
5. the engineering collection that owns any implementation follow-up.

## Risks and Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| External users treat early KG assets as stable production contracts | High | Use version/status labels, explicit compatibility promises, and no-go language |
| Adoption guidance duplicates internal implementation docs | Medium | Keep this plan partner-facing and link to internal plans for implementation detail |
| Licensing and National Curriculum provenance are misunderstood | High | Include provenance, OGL, and Oak-vs-DfE distinctions in every support artefact |
| Support expectations outrun Oak capacity | Medium | Define supported, experimental, and reference-only surfaces separately |

## Promotion Trigger Into `current/`

Promote when Oak selects a first external adopter profile or partner scenario
and wants a concrete support artefact with acceptance criteria.

## Reference-Context Rule

This is a strategic adoption brief. Execution decisions, support commitments,
and partner deliverables are finalised only during promotion.
