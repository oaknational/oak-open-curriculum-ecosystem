# EEF Teaching and Learning Toolkit

Dedicated subthread for integrating the [Education Endowment Foundation
Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
as an **evidence corpus** (composition: graph foundation + ranking
engine) on Oak's MCP server.

**Status**: Strategic brief landed; executable plan restructured 2026-04-30
into corpus-and-graph shape (CURRENT lifecycle bucket, awaiting
promotion to ACTIVE once foundation graph-query-layer plan reaches
ACTIVE — see [Promotion Rule](#promotion-rule)).
**Last Updated**: 2026-04-30
**Originating session branch**: `feat/eef_exploration`
**Conservation evidence**: semantic preservation map at
[`reference/conservation-map.md`](reference/conservation-map.md). The
predecessor was preserved byte-identically in `originals/` during the
restructure for a verification pass; after the verification confirmed
no semantic loss, `originals/` was deleted. Pre-session predecessor
state is permanently recoverable from git history (see conservation
map § Recovery path).

---

## Why This Subthread Exists

EEF material previously co-habited with `external-knowledge-sources/`
alongside education-skills and meta-strategy plans. As the EEF cluster grew
to four artefacts (executable plan + strategic brief + technical comparison +
dataset) and acquired its own attribution/credits commitments (John Roberts'
EEF MCP server prototype), it earned a dedicated home for discoverability and
ownership clarity.

Education skills, future third-party KGs, and the generic source-ingestion
intake model remain in the sibling
[`../external-knowledge-sources/`](../external-knowledge-sources/) subthread.

## Scope

In scope:

- the EEF Teaching and Learning Toolkit dataset snapshot;
- strategic and technical reference material describing how Oak should
  integrate that data;
- the executable plan to expose EEF resources, a recommendation tool, and a
  prompt through Oak's MCP server.

Out of scope:

- non-EEF education-skills material (lives in `../external-knowledge-sources/`);
- the formal Oak Curriculum Ontology integration (lives in
  `../../knowledge-graph-integration/`);
- the EEF MCP server prototype source code (read-only external artefact;
  attribution is captured here).

## The Five-Increment Architecture

The EEF integration is delivered across five increments, of which this
subthread owns Increment 2 plus the EEF-side of Increments 3 and 4. The
foundation (Increment 1) and the cross-source journey primitive design
(Increment 3) live in `knowledge-graph-integration/`.

| Inc | Plan home | Owns |
|---|---|---|
| 0 | already landed | misconception graph as JSON dump (baseline) |
| 1 | [`../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../knowledge-graph-integration/current/graph-query-layer.plan.md) | 7-operation graph layer with progressive disclosure, polymorphic over prerequisite + misconception + EEF strands |
| 2 | [`current/eef-evidence-corpus.plan.md`](current/eef-evidence-corpus.plan.md) | Evidence corpus extension on top of graph layer; `recommend`, `explain`, `compare` tools; two prompts; structural citation discipline; freshness gate; telemetry |
| 3 | [`../../knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../knowledge-graph-integration/future/cross-source-journeys.plan.md) | Cross-source journey primitive (search × misconception × EEF); first journey = `evidence-aware-lesson-sequencing` |
| 4 | within Inc 2 + Inc 1 | Telemetry + freshness + provenance (EEF-specific lives in Inc 2; graph-layer telemetry lives in Inc 1) |
| 5 | deferred | School-context overlay (gated on multi-tenant identity) |

## Documents

| Path | Type | Purpose |
|---|---|---|
| [current/eef-evidence-corpus.plan.md](current/eef-evidence-corpus.plan.md) | Executable plan (CURRENT) | Restructured successor to the original `eef-evidence-mcp-surface.plan.md`. 20 todos covering corpus shape, ranking engine, three tools, two prompts, structural citation enforcement, refresh gate, telemetry, negative-space documentation, and load-bearing credits to John Roberts. WS-3 of [`open-education-knowledge-surfaces.plan.md`](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md). |
| [reference/conservation-map.md](reference/conservation-map.md) | **Semantic preservation map** | Agent-judged mapping of every concept/requirement/credit/todo from the predecessor to its new home, with a verification log. Load-bearing artefact for "nothing lost". The predecessor itself is recoverable via `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md` (see conservation map § Recovery path). |
| [future/evidence-integration-strategy.md](future/evidence-integration-strategy.md) | Strategic brief | Three-layer architecture, R1–R8 impact-preserving requirements, four integration levels (1–3 independently deliverable; 4/4b need formal ontology). |
| [reference/oak-eef-technical-comparison.md](reference/oak-eef-technical-comparison.md) | Technical reference | Side-by-side comparison of the EEF Python prototype stack and Oak's HTTP MCP stack. |
| [reference/eef-toolkit.json](reference/eef-toolkit.json) | Data snapshot | EEF dataset v0.2.0 (last_updated 2026-04-02). 30 strands, 9 caveats, 17/30 with school-context relevance. Authoritative input for `current/`. |

## Read Order

1. This README (orientation)
2. [`future/evidence-integration-strategy.md`](future/evidence-integration-strategy.md)
   — *why* and *what*: impact requirements, integration levels, sequencing
3. [`../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../knowledge-graph-integration/current/graph-query-layer.plan.md)
   — *foundation* (Increment 1): the graph operations EEF strands sit on
4. [`current/eef-evidence-corpus.plan.md`](current/eef-evidence-corpus.plan.md)
   — *how* (Increment 2): the executable plan
5. [`reference/conservation-map.md`](reference/conservation-map.md)
   — *what was preserved and what was added* in the 2026-04-30
   restructure (read this if you want to know that nothing was lost)
6. [`../../knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../knowledge-graph-integration/future/cross-source-journeys.plan.md)
   — *future* (Increment 3): the journey primitive that cross-composes
   EEF with search and misconception data
7. [`reference/oak-eef-technical-comparison.md`](reference/oak-eef-technical-comparison.md)
   — comparative context for the EEF prototype design choices
8. [`reference/eef-toolkit.json`](reference/eef-toolkit.json) — the data itself

To read the predecessor, use `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`
(or follow the recovery instructions in the conservation map's
§ Recovery path).

## Snapshot Validation (2026-04-30)

The dataset was structurally validated at the time of relocation:

| Aspect | Claim in plan body | JSON reality |
|---|---|---|
| Schema version | 0.1.0 | 0.1.0 ✓ |
| Data version | 0.2.0 | 0.2.0 ✓ |
| Last updated | n/a | 2026-04-02 |
| Strand count | 30 | 30 ✓ |
| Null-impact strands | 4 (named in plan) | 4 with matching IDs ✓ |
| School-context coverage | 17/30 | 17 ✓ |
| Implementation blocks | 4/30 | 4 ✓ |
| Behind-the-average | 6/30 | 6 ✓ |
| Caveats | 9 (plan body); 8 (strategy + tech comparison, **drift fixed**) | 9 ✓ |

Currency note: snapshot is 28 days old at relocation. The EEF Toolkit is a
"living systematic review" updated roughly twice per year; caveat #8 inside the
JSON itself records that the data reflects "May 2025 and October 2025 living
systematic review updates where available." A fresh upstream check would be
prudent before the executable plan promotes from CURRENT to ACTIVE.

## Parent and Sibling Relationships

- **Parent (coordinator)**: [`../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md`](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md)
  — multi-source coordinating plan; this subthread owns its **WS-3**.
- **Sibling subthreads under `sector-engagement/`**:
  - [`../external-knowledge-sources/`](../external-knowledge-sources/) — education skills + future KGs.
  - [`../knowledge-graph-adoption/`](../knowledge-graph-adoption/) — outbound: external orgs using Oak's KG assets.
- **Cross-collection siblings**:
  - [`../../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md`](../../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md) — WS-2 (DONE), establishes graph factory pattern.
  - [`../../knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md`](../../knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md) — WS-4 (PENDING).
- **Authoritative ADR**: [`docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md`](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md) — typing discipline, URI scheme, namespace prefixes (`eef-*`), licensing.

## Credits and Attribution

- **EEF Toolkit data**: Education Endowment Foundation
  ([educationendowmentfoundation.org.uk](https://educationendowmentfoundation.org.uk/)).
  Original research authors: Higgins, Katsipataki, Kokotsaki, Coleman, Major, Coe.
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`. **When the executable plan ships, JR
  must be added to the repo's authors list per `evidence-integration-strategy.md`
  §Credits.**

## Promotion Rule

<a id="promotion-rule"></a>
Promote `current/eef-evidence-corpus.plan.md` from CURRENT to ACTIVE when:

1. The owner gives the go-ahead;
2. The plan body has been re-checked against current upstream EEF data
   (re-validate the snapshot before copying it into the SDK);
3. The plan-body first-principles check has been re-applied to the test
   shapes, file landing paths, and vendor literals.

## Foundation Documents

Before promoting any plan in this subthread:

1. [`principles.md`](../../../directives/principles.md)
2. [`testing-strategy.md`](../../../directives/testing-strategy.md)
3. [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
4. ADR-029 (cardinal rule — applies to Oak API types; EEF data has its own
   typing discipline per ADR-157)

First question: *Could it be simpler without compromising quality?*
