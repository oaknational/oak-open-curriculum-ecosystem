---
name: "Finnish National Curriculum API — SDK and MCP Pipeline Demonstration"
overview: "Strategic brief to evaluate routing the Opetushallitus (Finnish National Agency for Education) public curriculum APIs through the same OpenAPI → SDK → MCP pipeline that currently produces Oak's SDK and MCP, once the pipeline has been generalised out of Oak-specific code."
specialist_reviewer: "architecture-reviewer-betty, mcp-reviewer, code-reviewer"
isProject: false
todos:
  - id: scope-and-api-selection
    content: "Confirm first-wave API scope (public anonymous ePerusteet / TOTSU-Amosaa / OPS-Ylops) and defer authenticated surfaces (Kouta External, Organisaatiopalvelu, Koski) to a second lane."
    status: pending
  - id: pipeline-readiness-check
    content: "Confirm the generic OpenAPI/codegen/runtime foundation from Tranche 4 of the Oak Surface Isolation Programme has landed and can ingest a non-Oak OpenAPI 3.x document without Oak-specific code paths."
    status: pending
  - id: feasibility-spike
    content: "Run a feasibility spike against the three ePerusteet-family raw specs, record generation outputs, and capture any pipeline assumptions that still leak Oak semantics."
    status: pending
  - id: consumer-surface-decision
    content: "Decide whether to produce one combined Finnish-curriculum SDK/MCP or per-service siblings, and whether the result is a capability demonstration or a shipped product surface."
    status: pending
  - id: prepare-promotion-to-current
    content: "Write the executable tranche scope, acceptance checks, and deterministic validation commands for a current-lane implementation plan."
    status: pending
---

# Finnish National Curriculum API — SDK and MCP Pipeline Demonstration

**Last Updated**: 2026-04-17
**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Collection**: `sector-engagement/`
**Related plans**:

- [Oak Surface Isolation and Generic Foundation Programme](../../architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md) (strategic pre-requisite — Tranche 4 "SDK and Codegen")
- [SDK Codegen Workspace Decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md) (companion codegen strategy absorbed by Tranche 4)
- [Open Education Knowledge Surfaces](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) (multi-source open-education narrative this plan extends)
- [EEF Evidence MCP Surface](../external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md),
  [Education Skills MCP Surface](../external-knowledge-sources/future/education-skills-mcp-surface.plan.md),
  [NC Knowledge Taxonomy Surface](../../knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md) (sibling open-education integrations already in flight)

## Source Research

The Opetushallitus API landscape has been mapped in an imported research report,
now normalised to a source-faithful clean copy:

- Source: `.agent/research/finnish-national-curriculum-api/Opetushallitus Public and Likely Public API Landscape.md`
- Paired DOCX: `.agent/research/finnish-national-curriculum-api/Opetushallitus Public and Likely Public API Landscape.docx`
- Clean copy: `.agent/research/finnish-national-curriculum-api/Opetushallitus Public and Likely Public API Landscape-clean.md`

The clean copy is the authoritative summary of the six API surfaces and their
access postures, and is the citation target for everything below.

## Problem and Intent

Oak's SDK and MCP server are generated today by an Oak-specific pipeline that
conflates:

1. generic OpenAPI → TypeScript/Zod/MCP-tool code generation, and
2. Oak-specific curriculum semantics, URL augmentation, vocabulary assets, and
   brand/runtime defaults.

Routing an unrelated national-curriculum OpenAPI document through the same
pipeline today would either fail or silently import Oak assumptions into a
non-Oak output. The strategic intent of this plan is to use the Finnish
national curriculum APIs as the first external consumer of the generalised
pipeline once Tranche 4 of the Oak Surface Isolation Programme has split the
Oak curriculum leaves from the generic OpenAPI/codegen/runtime foundations.

The Finnish surface is a strong candidate for this role because:

1. Three of the six documented APIs — **ePerusteet external**, **TOTSU/Amosaa
   external**, and **OPS/Ylops external** — ship directly-retrievable raw
   OpenAPI 3.x JSON, expose stable `virkailija.opintopolku.fi` server URLs,
   declare no OpenAPI security schemes, and are read-only public endpoints.
   They are the cleanest possible test that the pipeline can consume a
   non-Oak OpenAPI document end-to-end without Oak-specific code paths.
2. The wider set of six APIs in the research report (adding the
   authenticated **Kouta External**, **Organisaatiopalvelu**, and **Koski**
   surfaces) gives a graduated adoption ramp — basic auth, CAS ticket flows,
   and OAuth2 + mTLS — each of which stresses a different seam of the
   generalised pipeline if and when it is ready to handle authenticated
   OpenAPI sources.
3. Demonstrating the pipeline against a national curriculum authority other
   than Oak materially strengthens the "multi-source open education knowledge
   infrastructure" narrative already articulated in the Open Education
   Knowledge Surfaces plan. International curriculum comparability is the
   obvious next axis after Oak API + Oak ontology + EEF evidence.

## Domain Boundaries and Non-Goals

### In scope

1. Deciding whether to commission the Finnish APIs as the first external
   consumer of the generalised OpenAPI → SDK → MCP pipeline.
2. Prioritising the three anonymous public surfaces (ePerusteet, Amosaa,
   Ylops) for the first demonstration lane.
3. Identifying the pipeline seams and pipeline outputs (typed client, Zod
   schemas, MCP tool descriptors, optional search index contracts) that must
   work without Oak-specific code.
4. Articulating how a Finnish-curriculum consumer surface fits into the
   Open Education Knowledge Surfaces narrative.

### Explicit non-goals

1. This plan does not commit Oak to running a production Finnish MCP service.
2. This plan does not attempt to support the three authenticated Finnish APIs
   (Kouta External, Organisaatiopalvelu, Koski) in the first lane. They are
   deferred until the generalised pipeline proves out anonymous OpenAPI
   ingestion, and until authenticated-OpenAPI support is a first-class
   feature of the generic foundation rather than an Oak-shaped special case.
3. This plan does not commit to any translation, pedagogy mapping, or
   cross-jurisdictional ontology alignment. Those belong in later
   semantic-search or ontology plans if the demonstration succeeds.
4. This plan does not grant itself editorial freedom over the source research
   report. The clean copy is the citation target; factual updates belong in
   a separate research-refresh task.

## Candidate Scope — First Lane

Targeted at the three anonymous public APIs only:

| API | Raw OpenAPI JSON | Base URL | Pipeline role in first lane |
|---|---|---|---|
| ePerusteet external | `https://raw.githubusercontent.com/Opetushallitus/eperusteet/master/generated/eperusteet-ext.spec.json` | `https://virkailija.opintopolku.fi/eperusteet-service` | Canonical test: national curriculum / qualification basis content |
| TOTSU / Amosaa external | `https://raw.githubusercontent.com/Opetushallitus/eperusteet-amosaa/master/generated/amosaa-ext.spec.json` | `https://virkailija.opintopolku.fi/eperusteet-amosaa-service` | Second test: published teaching / implementation-plan content |
| OPS / Ylops external | `https://raw.githubusercontent.com/Opetushallitus/eperusteet-ylops/master/generated/ylops-ext.spec.json` | `https://virkailija.opintopolku.fi/eperusteet-ylops-service` | Third test: published local curriculum / OPS content |

The three authenticated surfaces (Kouta External, Organisaatiopalvelu, Koski)
are deferred to a second lane and are not in scope here.

## Dependencies and Sequencing Assumptions

1. **Hard pre-requisite** — Tranche 4 of the Oak Surface Isolation Programme
   must have landed before this plan promotes. That tranche separates the
   generic OpenAPI/codegen/runtime infrastructure in
   `packages/sdks/oak-sdk-codegen` from Oak-specific curriculum generators
   and augmenters, absorbing the existing
   [SDK Codegen Workspace Decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md)
   rather than competing with it.
2. **Soft pre-requisite** — Tranche 1 (platform and runtime foundations) of
   the same programme should also have landed, because the Finnish
   demonstration will use the generic env-contracts, logger, and
   observability seams rather than Oak-specific defaults.
3. Active Milestone 2 observability and MCP Apps work takes priority over
   this plan; promotion is not appropriate until those blockers close.
4. Any active work in
   [Open Education Knowledge Surfaces](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md)
   should be at or near a stable seam before the Finnish demonstration
   promotes, so the multi-source narrative stays coherent.
5. The first lane assumes anonymous OpenAPI ingestion only. Any attempt to
   take the authenticated Finnish surfaces on must wait for a first-class
   authenticated-OpenAPI capability in the generic pipeline.

## Strategic Questions For Promotion Time

These are explicitly unresolved and must be answered before a `current/`
plan can be promoted:

1. Does the Finnish demonstration produce **one combined SDK** spanning
   ePerusteet + Amosaa + Ylops, or **three sibling SDKs**? The three
   repositories already publish as independent OpenAPI specs; combining
   them is a consumer-surface choice, not a pipeline requirement.
2. Does the demonstration end with **one Finnish-curriculum MCP server**,
   three servers, or an in-repo capability demonstration that is not
   deployed at all?
3. Does the resulting SDK/MCP live inside this repository (mirroring the
   Oak structure), in a separate repository, or as an optional workspace
   that is built but not published?
4. How does the Finnish surface relate to Oak's own curriculum semantics —
   is it a co-equal international comparator in the Open Education
   Knowledge Surfaces narrative, or a reference/demonstration-only artefact?
5. Is there a credible Oak consumer for any Finnish-curriculum data in
   lesson-planning or pedagogy, or is the value purely to prove pipeline
   generality and to strengthen the multi-source open-education story?

None of these questions are blocking the `future/` brief, but all must be
answered when drafting an executable `current/` plan.

## Success Signals

This brief would justify promotion to `current/` when:

1. Tranche 4 of the Oak Surface Isolation Programme has landed and the
   generic OpenAPI/codegen/runtime workspace can ingest a non-Oak OpenAPI
   3.x document without importing any Oak-specific constants, defaults,
   telemetry namespaces, or curriculum semantics.
2. A low-risk feasibility spike against the three ePerusteet-family raw
   specs has produced a typed client, Zod schemas, and MCP tool
   descriptors that compile and pass boundary tests, with no Oak strings
   in the generated artefacts.
3. The strategic questions above have been answered.
4. The resulting plan has a deterministic validation set covering at least:
   non-Oak OpenAPI ingestion, Oak SDK regression, and package-boundary
   proofs that generic foundations still never import Oak leaves.

## Risks and Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| Oak-specific assumptions leak into the Finnish output (URL augmentation, vocabulary, curriculum-specific typing) | High | Do not promote until Tranche 4 has shipped with enforced package-boundary tests and import-graph checks; run the feasibility spike against a generic workspace, not against `oak-sdk-codegen` |
| Upstream OpenAPI specs drift (Opetushallitus publishes as v3.0.0 today but pins could slip) | Medium | Pin to a specific commit SHA in the spike; re-resolve at promotion time |
| Authenticated surfaces pulled in prematurely, distorting the first lane | Medium | Explicit non-goal in this brief; do not adopt Kouta External / Organisaatiopalvelu / Koski until an anonymous-first lane has landed |
| MCP consumer-surface decision made by default (one combined vs three sibling SDKs) | Medium | Flag as a promotion-time decision (see strategic questions above); do not pre-commit in the `future/` brief |
| Cross-jurisdictional semantics misread as editorial endorsement by Oak | Medium | Keep the output framed as capability demonstration; any pedagogical cross-mapping is out of scope and owned by a separate ontology plan |
| Tranche 4 timeline moves (this plan depends on it) | Low/Medium | Keep the brief in `future/` until the dependency closes; do not attempt to compensate by forking the Oak pipeline |

## Promotion Trigger Into `current/`

Promote only when all of the following are true:

1. Tranche 4 (SDK and Codegen) of the Oak Surface Isolation Programme has
   landed, with package-boundary tests proving the generic foundation
   contains no Oak-specific contracts, defaults, namespaces, or emitted
   surfaces.
2. A feasibility spike has confirmed that at least one ePerusteet-family
   raw OpenAPI spec flows through the generic pipeline end-to-end.
3. The strategic questions above have resolved answers recorded either in
   this brief or in a linked decision note.
4. Discoverability is wired: this plan appears in the SDK-and-MCP future
   index, the architecture future README cross-references it as a Tranche 4
   downstream demonstration, and the high-level plan's potential
   enhancements section references it.
5. The Open Education Knowledge Surfaces narrative has been updated to
   reflect the Finnish surface as an additional data source in the
   multi-source story.

## Reference-Context Rule

Implementation detail in this brief (spec URLs, endpoint tables, API
characteristics) is reference context only. Execution commitments — target
workspace shape, whether to deploy the MCP, combined vs sibling SDKs — are
finalised during promotion to `current/`.
