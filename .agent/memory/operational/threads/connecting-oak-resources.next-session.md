# Next-Session Record — `connecting-oak-resources` thread

**Last refreshed**: 2026-05-04 (Cosmic Glowing Dawn / claude-code /
claude-opus-4-7-1m / `d11500` — authored
[`graph-stack.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md)
in `current/` as the topology-decision-plus-foundation-increment
spine plan for graph work. Eight active workspaces plus one deferred
(`graph-future`); reserves a workspace home for every layer in
`.agent/research/graph-iibrary.md`. Foundation increment ingests the
NC knowledge taxonomy end-to-end via SKOS-on-`graph-core`; no
surfacing in the increment (graph workspaces are MCP-agnostic per
owner direction; surfacing is consumer-side, at most one workspace
per transport). Plan is `current` — owner explicitly stated no
promotion now. Substrate-path supersession declared for
`nc-knowledge-taxonomy-surface.plan.md` and `graph-query-layer.plan.md`
in coordination map; their MCP-surfacing concerns remain independent
owner decisions. Collection README updated to register the spine plan
and reflect substrate-vs-surfacing split. Transport-agnostic-substrate
principle saved to platform memory
(`feedback_infrastructure_workspaces_transport_agnostic.md`); also a
PDR candidate (see ADR/PDR candidates below). No commits this session.
**Foreign stage observed**: `Ferny Spreading Petal` (`d0d13f`,
agentic-engineering-enhancements thread) has files staged from a
commit window that expired at 15:09:49Z (~40 min before this handoff)
without committing; underlying claim still fresh until 18:35:05Z.
Surfaced for owner attention. **Prior**: 2026-05-01 — Gnarled
Fruiting Root / claude-code / claude-opus-4-7-1m / `e18e2c` — created
the thread by owner direction; light scan of the three external Oak
repos; no blocking findings for Increment 1 graph-query-layer
promotion.)

---

## Thread Identity

- **Thread**: `connecting-oak-resources`
- **Thread purpose**: Connect Oak's own resources into this repo.
  Two complementary streams:
  - **Internal Oak knowledge-graph work** — the existing
    knowledge-graph-integration plans (graph-query-layer,
    graph-resource-factory, misconception/NC/open-education
    surfaces, kg-integration-quick-wins, kg-alignment-audit,
    cross-source-journeys, ontology-integration-strategy,
    ontology-repo-fresh-perspective-review, oak-curriculum-ontology-
    workspace-reassessment, direct-ontology-use-and-graph-serving-
    prototypes, agent-guidance-consolidation).
  - **External Oak references** — research and selective adoption
    from Oak's other public repos (oak-curriculum-ontology, Aila /
    oak-ai-lesson-assistant) plus concepts-only learning from Oak's
    private repos (oak-ai-moderation-service, aila-atomic-concepts).
- **Branch**: TBD per workstream.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `thread-bootstrap-and-light-scan` | 2026-05-01 | 2026-05-01 |
| `Cosmic Glowing Dawn` | `claude-code` | `claude-opus-4-7-1m` | `d11500` | `graph-stack-spine-plan-author` | 2026-05-04 | 2026-05-04 |

## Plan Locations

- `.agent/plans/connecting-oak-resources/knowledge-graph-integration/`
  — internal Oak KG work (was `.agent/plans/knowledge-graph-integration/`
  pre-2026-05-01 restructure).
- `.agent/plans/connecting-oak-resources/external-oak-references/` —
  external Oak repo research and selective adoption.

## Cross-Plan Links

- **EEF subthread** (`sector-engagement/eef/`) consumes the graph
  layer (Increment 1: graph-query-layer.plan.md). EEF is *not* part
  of this thread (it is open-education evidence, not Oak-internal).
- **External (third-party) knowledge sources** live in the sibling
  thread `exploring-open-education-resources/` —
  `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`.

## Adoption-Rule Summary (owner direction 2026-05-01)

For external Oak repos:

- **Public repo + permissive license + attribution**: adoption-eligible.
  Acknowledgement mechanism approved (per-file header + repo-level
  NOTICE + README acknowledgement of Oak National Academy).
- **Private repo**: concepts-only. We can learn patterns and apply
  them in our own implementation, but cannot copy code, prompts,
  schemas, or distinctive content into this public repo —
  doing so would bypass the upstream privacy choice.

## Light-Scan Findings (2026-05-01)

- `oaknational/oak-curriculum-ontology` — public, dual MIT/OGL-3.
  OWL ontology with classes including `Misconception`, `Thread`,
  `Programme`, `Unit`, `Lesson`, etc. Vocabulary overlap with
  Increment 1's adapter names (e.g. `MisconceptionGraphView`),
  but no structural collision (ontology has no edges between
  misconceptions; this repo's data has no misconception edges
  either — already a Phase B finding). Adoption-eligible.
  Alignment is informational, not blocking.
- `oaknational/oak-ai-lesson-assistant` (Aila) — public, MIT.
  Monorepo with `apps/` and `packages/`. Likely contains prompts
  relevant to Increment 3 (cross-source-journeys). Adoption-eligible.
  Highest plan-altering potential of the three.
- `oaknational/oak-ai-moderation-service` — **private**. Concepts-
  only. Relevant to plans that produce LLM prose (none of the
  current Increment 1/2 plans).
- Adjacent (private, concepts-only): `oaknational/aila-atomic-
  concepts` — "prerequisite derivation, and curriculum graph
  construction. Science KS3 pilot." Direct conceptual relevance
  to Increment 1's PrerequisiteGraph.

## Implication for Increment 1 (graph-query-layer) Promotion

**No blocking findings.** Promote when owner approves the Promotion
Packet in the EEF thread record. Vocabulary alignment with the
ontology is a post-`pnpm sdk-codegen` decision, not a pre-promotion
gate.

## First Task of Next Session

Owner-decided. Candidates:

1. Address EEF thread Promotion Packet (sibling thread).
2. Promote the external-oak-references plan (this thread) to
   `current/`; first per-repo executable plan would be the **Aila
   deep-research plan**.
3. Do a deep read of `oak-curriculum-ontology` to extract the
   vocabulary alignment opportunities for the post-promotion graph
   adapters.
4. **Topology approval for `graph-stack.plan.md`** — owner-gated
   review of the eight-workspace topology before any execution.
   Plan-phase reviewers named in the spine: `assumptions-reviewer`,
   `architecture-reviewer-betty`, `architecture-reviewer-fred`,
   `architecture-reviewer-barney`. No promotion until all four have
   run.

## References

- Plan: `.agent/plans/connecting-oak-resources/external-oak-references/future/external-oak-references-deep-research.plan.md`
- Existing strategy: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
- Related thread record: `.agent/memory/operational/threads/eef.next-session.md`
- Sibling thread record: `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`
