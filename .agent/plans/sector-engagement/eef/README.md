# EEF Teaching and Learning Toolkit

> **2026-05-30 — one live plan.** The ONLY EEF plan is
> [`current/eef-graph-tool-completion.plan.md`](current/eef-graph-tool-completion.plan.md)
> (impact-led D0–D7, decision-complete, in execution). The earlier
> `eef-evidence-corpus` / `eef-delivery-restructure` / `eef-first-feature`
> list-era estate and the 2026-05-28 graph-tooling-rebuild design docs were
> **quarantined** to [`archive/`](archive/) as superseded broken-concept work —
> do not resume or cite them.

Dedicated subthread for integrating the [Education Endowment Foundation
Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
as a typed **evidence graph** on Oak's MCP server.

**Status**: One decision-complete plan in execution
([`current/eef-graph-tool-completion.plan.md`](current/eef-graph-tool-completion.plan.md),
D0–D7). The EEF corpus substrate lives in `packages/sdks/graph-corpus-sdk`
(`eef-strands`); the typed foundation, graph tool/resource surface, prompt,
evidence-preservation obligations, and telemetry are sequenced in the live plan.
**Originating session branch**: `feat/eef_exploration`.
**Conservation evidence**: semantic preservation map at
[`reference/conservation-map.md`](reference/conservation-map.md) — a historical
record of the 2026-04-30 restructure, itself since superseded. Predecessor
plans are recoverable from git history.

---

## Why This Subthread Exists

EEF material previously co-habited with the education-skills and meta-strategy
plans. As the EEF cluster grew (executable plan + strategic brief + technical
comparison + dataset) and acquired its own attribution/credits commitments
(John Roberts' EEF MCP server prototype), it earned a dedicated home for
discoverability and ownership clarity.

Education skills, future third-party knowledge graphs, and the generic
source-ingestion intake model live in sibling subthreads under
`sector-engagement/`.

## Scope

In scope:

- the EEF Teaching and Learning Toolkit dataset snapshot;
- strategic and technical reference material describing how Oak should
  integrate that data;
- the executable plan to expose EEF graph tools/resources and prompt support
  through Oak's MCP server.

Out of scope:

- non-EEF education-skills material (lives in a sibling subthread under
  `sector-engagement/`);
- the formal Oak Curriculum Ontology integration (lives in
  [`../../connecting-oak-resources/knowledge-graph-integration/`](../../connecting-oak-resources/knowledge-graph-integration/));
- the EEF MCP server prototype source code (read-only external artefact;
  attribution is captured here).

## The Live Plan and Where EEF Sits

The EEF integration is one strand of Oak's broader multi-source graph work (see
the [`knowledge-graph-integration/`](../../connecting-oak-resources/knowledge-graph-integration/)
collection). The single live EEF plan finishes the EEF graph tooling end to
end:

- **[`current/eef-graph-tool-completion.plan.md`](current/eef-graph-tool-completion.plan.md)**
  — impact-led D0–D7, decision-complete. D0 corrects the known-vs-unknown data
  doctrine and the corpus substrate (the EEF snapshot is a fully-known `as
  const` constant; its types are derived from it, not validated against a
  schema); D1–D7 deliver the typed foundation, graph tool/resource surface,
  prompt, evidence-preservation obligations, and telemetry.

The broader increment context (graph-query foundation, cross-corpus
combinatorial primitives, cross-source journeys) lives in the
`knowledge-graph-integration/` collection and the graph-estate plans; those are
not owned here.

## Reference Material

| Path | Type | Purpose |
|---|---|---|
| [`future/evidence-integration-strategy.md`](future/evidence-integration-strategy.md) | Strategic brief | Three-layer architecture, R1–R8 impact-preserving requirements, four integration levels (1–3 independently deliverable; 4/4b need formal ontology). |
| [`reference/oak-eef-technical-comparison.md`](reference/oak-eef-technical-comparison.md) | Technical reference | Side-by-side comparison of the EEF Python prototype stack and Oak's HTTP MCP stack. |
| [`reference/eef-toolkit.json`](reference/eef-toolkit.json) | Data snapshot | EEF dataset v0.2.0 (last_updated 2026-04-02). 30 strands, 9 caveats, 17/30 with school-context relevance. Source for the in-repo `as const` corpus. |
| [`reference/conservation-map.md`](reference/conservation-map.md) | Historical preservation map | Record of the 2026-04-30 restructure (since superseded). Retained for the "nothing lost" audit trail. |
| [`future/eef-outcome-evaluation-infrastructure.plan.md`](future/eef-outcome-evaluation-infrastructure.plan.md) | Future plan | EEF outcome-evaluation infrastructure (deferred). |
| [`future/eef-school-leadership-evidence.plan.md`](future/eef-school-leadership-evidence.plan.md) | Seed plan | School-leadership / SLT EEF strands, split out of the teacher plan 2026-05-31; gated on establishing clear school-leader value before any design. |
| [`future/eef-standalone-evidence-workflows.plan.md`](future/eef-standalone-evidence-workflows.plan.md) | Seed plan | EEF-only MCP-app workflows that deliver value without intersecting Oak's tools; captured 2026-05-31, gated on establishing standalone teacher value. |
| [`archive/`](archive/) | Superseded | The quarantined list-era estate and graph-tooling-rebuild design docs. Do not resume or cite. |

## Read Order

1. This README (orientation)
2. [`future/evidence-integration-strategy.md`](future/evidence-integration-strategy.md)
   — _why_ and _what_: impact requirements, integration levels, sequencing
3. [`current/eef-graph-tool-completion.plan.md`](current/eef-graph-tool-completion.plan.md)
   — _how_: the live, decision-complete D0–D7 finishing plan
4. [`reference/eef-toolkit.json`](reference/eef-toolkit.json) — the data itself
5. [`reference/oak-eef-technical-comparison.md`](reference/oak-eef-technical-comparison.md)
   — comparative context for the EEF prototype design choices

To read a quarantined predecessor plan, see [`archive/`](archive/); pre-archive
state is recoverable from git history.

## Snapshot Validation (2026-04-30, historical)

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

Currency note: the snapshot was 28 days old at relocation. The EEF Toolkit is a
"living systematic review" updated roughly twice per year; caveat #8 inside the
JSON records that the data reflects "May 2025 and October 2025 living systematic
review updates where available." A fresh upstream check is taken before the
corpus is copied into the SDK. The snapshot is a fully-known `as const` constant
and types derive from it — see the live plan's D0 doctrine and the generalised
ADR-038.

## Parent and Sibling Relationships

- **Parent (coordinator)**:
  [`../../connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md`](../../connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md)
  — the multi-source coordinating plan; this subthread owns the EEF strand.
- **Cross-collection context**: the
  [`knowledge-graph-integration/`](../../connecting-oak-resources/knowledge-graph-integration/)
  collection (graph query layer, misconception graph, NC knowledge taxonomy)
  and the graph-estate plans.
- **Related ADR (proposed, not constraining)**:
  [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  — typing discipline (`as const` derivation), `curriculum://` URI scheme,
  namespace prefixes (`eef-*`), licensing. In **Proposed** status; it documents
  a direction the in-flight work explores, not a constraint that gates the work.

## Credits and Attribution

- **EEF Toolkit data**: Education Endowment Foundation
  ([educationendowmentfoundation.org.uk](https://educationendowmentfoundation.org.uk/)).
  Original research authors: Higgins, Katsipataki, Kokotsaki, Coleman, Major, Coe.
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`. **When the executable plan ships, JR
  must be added to the repo's authors list per `evidence-integration-strategy.md`
  §Credits.**

## Status of the Live Plan

The live plan is decision-complete and in execution. D0 is complete and committed
at `ce9745c7`; D1 is complete and owner-ratified in the live plan. On 2026-05-31
the value model was reframed: EEF is evidence about teaching strategies and
decisions, and relevance is a function of the pedagogical move (on EEF's own
finite axes), with the value intersecting Oak's tools — the misconception and
prior-knowledge graphs — at the workflow level. The user-value trace has been
folded into the live plan; its brief/report are archived as historical scratch
artefacts. The next implementation move is D2, or D3's written MCP contract and
SDK/app verification record if the owner chooses that lane.

The working Codex briefs and reports that de-risked D1/D3/D4 are archived as
historical scratch artefacts. Their useful substance is folded into the live plan;
do not resume or cite them as live sources.

Before any refreshed EEF data is copied into the SDK:

1. re-validate the snapshot against current upstream EEF data;
2. re-apply the plan-body first-principles check to test shapes, file landing
   paths, and vendor literals.

## Foundation Documents

Before promoting any plan in this subthread:

1. [`principles.md`](../../../directives/principles.md)
2. [`testing-strategy.md`](../../../directives/testing-strategy.md)
3. [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
4. ADR-029 (cardinal rule — applies to Oak API types; EEF data has its own
   typing discipline per ADR-157)

First question: _Could it be simpler without compromising quality?_
