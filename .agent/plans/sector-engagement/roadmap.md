# Sector Engagement Roadmap

**Status**: Reference collection created; strategic engagement threads forming
**Last Updated**: 2026-04-29

---

## Purpose

Sector engagement turns Oak's technical assets into usable public-sector and
partner-facing value. It coordinates external data-source reviews, upstream API
feedback, and support for organisations that may use Oak's pipelines, SDKs, MCP
servers, semantic search configuration, generated schemas, or related open
education resources.

The live opportunity is broader than publication. Oak's openly licenced,
fully sequenced and resourced curriculum can become a shared sector asset when
the SDK, MCP server, OpenAPI-to-MCP pipeline, hybrid search, and knowledge graph
surfaces are understandable, supportable, and safe to reuse.

The impact test for this roadmap is: could a credible external organisation use
or learn from an Oak resource because this plan made the route clear? File moves,
repo topology decisions, and partner reviews are only valuable when they reduce
the gap between Oak's internal infrastructure and a real external adopter,
partner, data-source steward, or public-sector collaborator.

Authoritative execution sources:

1. [active/README.md](active/README.md)
2. [current/README.md](current/README.md)
3. [future/README.md](future/README.md)
4. [oeai/README.md](oeai/README.md)
5. [external-knowledge-sources/README.md](external-knowledge-sources/README.md)
6. [knowledge-graph-adoption/README.md](knowledge-graph-adoption/README.md)

Implementation detail belongs in the owning engineering collection. This
roadmap owns the bridge from action to impact: who could use the work, what
support they need, what evidence is required, and when a partner-facing thread
should become executable work.

## Current State

- The former `external/` collection has been rehomed here because it already
  contained upstream API coordination, external issue reports, and a partner
  requirements pack for Castr.
- The Finnish national curriculum API demonstration brief now lives in this
  collection's `future/` lane as an external data-source and pipeline
  generalisation opportunity.
- External knowledge-source work has been split into
  [external-knowledge-sources/](external-knowledge-sources/), while internal
  Oak KG integration remains in
  [../knowledge-graph-integration/](../knowledge-graph-integration/).
- External organisation use of Oak's own KG assets now has a dedicated
  [knowledge-graph-adoption/](knowledge-graph-adoption/) thread.
- The sibling `oak-openapi` repo has a future integration brief because API,
  SDK, MCP, search, and KG convergence is now a sector-facing ecosystem concern.
- The OEAI thread has an initial review snapshot and can become a structured
  engagement plan if Oak decides there is sector value in follow-up.

## Execution Order

```text
Phase 0: Rehome existing sector-facing material             Done
Phase 1: Split KG/adoption/source taxonomy                  Done
Phase 2: API/KG convergence decision briefs                 Future
Phase 3: External data-source demonstrations                Future
Phase 4: Organisation-specific support playbooks            Future
```

## Phase Details

### Phase 0 - Rehome Existing Sector-Facing Material

- Done when: the former external planning material, upstream API reports, Castr
  requirements, Finnish pipeline brief, and OEAI initial review are discoverable
  from this collection, with the intended external user or data-source
  relationship visible from the collection index.
- Dependencies: no implementation dependencies.

### Phase 1 - Split KG/Adoption/Source Taxonomy

- Done when: internal Oak KG integration, ontology workspace decisions,
  external organisation KG adoption, and external knowledge-source ingestion
  have distinct homes and cross-links.
- Dependencies: owner prioritisation.

### Phase 2 - API/KG Convergence Decision Briefs

- Later strategic plans:
  [future/oak-openapi-monorepo-integration.plan.md](future/oak-openapi-monorepo-integration.plan.md),
  [../knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md](../knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md)
- Done when: Oak has decided how the public API repo, ontology repo, generated
  SDKs, MCP server, search service, and KG assets should relate at the repo and
  contract level.
- Dependencies: architecture review, owner decision, and current repo boundary
  evidence.

### Phase 3 - External Data-Source Demonstrations

- Later strategic plan:
  [future/finnish-national-curriculum-api-pipeline-demonstration.plan.md](future/finnish-national-curriculum-api-pipeline-demonstration.plan.md)
- Related source-ingestion thread:
  [external-knowledge-sources/](external-knowledge-sources/)
- Done when: at least one non-Oak data source can flow through the generalised
  OpenAPI -> SDK -> MCP pipeline without Oak-specific assumptions.
- Dependencies: generic SDK/codegen foundation work in
  [architecture-and-infrastructure](../architecture-and-infrastructure/).

### Phase 4 - Organisation-Specific Support Playbooks

- Candidate threads:
  [oeai/](oeai/),
  [knowledge-graph-adoption/](knowledge-graph-adoption/)
- Done when: a partner-facing review produces a concrete support playbook,
  adoption decision, explicit no-go rationale, or implementation handoff whose
  acceptance criteria are framed around the external organisation's ability to
  use the resource.
- Dependencies: partner needs, licensing/governance clarity, and implementation
  readiness of the relevant Oak resources.

## Quality Gates

For this collection's planning-only updates:

```bash
pnpm markdownlint:root
pnpm format:root
git diff --check
```

Executable implementation plans promoted from this collection must define their
own deterministic gates in the owning engineering collection.

## Related Documents

1. [High-Level Plan](../high-level-plan.md)
2. [Collection README](README.md)
3. [External Material Triage](external-material-triage.md)
4. [Open Education Knowledge Surfaces](../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md)
5. [Oak Surface Isolation and Generic Foundation Programme](../architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md)
