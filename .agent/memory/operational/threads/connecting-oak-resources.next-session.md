# Next-Session Record — `connecting-oak-resources` thread

**Last refreshed**: 2026-05-07 (Lush Rustling Bark / codex /
GPT-5 / `019e03` — after the owner-directed PR #102 comment harvest, two new
live Copilot threads remained. The follow-up fixed branch-touched-files
CLI precedence/help and explicit Git executable portability with focused
tests. The same closeout resolved root lint failures from deprecated Oak
ESLint config helper usage by moving to ESLint core `defineConfig()`, while
keeping the local Oak plugin segment at the typed config boundary. Root
`pnpm lint` passes. **Next safe step after push**: re-check PR #102
comments/review threads, GitHub checks, and Sonar PR state on the new head;
then proceed only if no live feedback remains.)

**Prior refresh**: 2026-05-07 (Twigged Shedding Fern / codex /
GPT-5 / `019e03` — PR #102 snagging landed and pushed as `e8050400`.
The pass fixed the three graph-layer taxonomy review comments, the
primitive-wording comment, the branch-touched-files parser index issue,
and the Git subprocess-boundary Sonar hotspots. GitHub checks and
SonarCloud are green; Sonar MCP reports quality gate `OK`, zero open
issues, and zero `TO_REVIEW` hotspots. The four known Copilot review
threads are obsolete/outdated on the new head. **Owner direction for the
next session**: fetch remaining PR #102 comments and review threads,
then analyse whether any live reviewer feedback remains before editing.)

**Prior refresh**: 2026-05-07 (Breezy Navigating Sail / cursor /
claude-opus-4.7 / `9edbd1` — closed the MVP-arc PLANNING arc in a
single session per owner direction. Pre-flight + Phase 0 (spine drift
remediation, commit `d740baa0`) + Phase 1 (3-reviewer parallel batch
over 5 MVP-arc artefacts + topology) + Phase 2 (4 spine remediations,
commit `82b3a792`) + Phase 3 (3 slice plans authored, commit
`776df6b7` — `oak-kg-threads-surface.plan.md`,
`oak-misconceptions-subgraph-mcp-surface.plan.md`,
`oak-misconceptions-eef-cross-corpus-surface.plan.md`) + Phase 4
(2 BLOCKERs remediated, 6 FINDINGS deferred, commit `0899ba93`) +
Phase 5 (spine + thread record updates). Reviewer scope reduced per
owner direction: `code-reviewer` + `assumptions-reviewer` in series
across phases 1 + 4; `architecture-reviewer-betty` for topology in
parallel; out-of-scope reviewers (`mcp-reviewer`, `docs-adr-reviewer`,
`architecture-reviewer-fred`) explicitly skipped this session.
**Next session = decision-completeness closeout (per owner direction
2026-05-07; implementation OUT of scope for this branch)**: absorb
topology BLOCKERs into `graph-stack.plan.md` and ADR-173, absorb
remaining Phase 4 FINDINGS into the three slice plans and slice 1,
owner-resolve the EEF plan internal contradiction, then verify
decision-complete state across the full MVP plan (spine, 3 slice
plans, slice 1, substrate, ADR-173). NO slice execution; NO
graph-stack ACTIVE promotion; NO ADR-173 ratification.
**Prior**: 2026-05-07 — Windward Darting Horizon / cursor /
claude-opus-4.7 / `dd084d` — authored
[`graph-mvp-arc.plan.md`](../../../plans/graph-mvp-arc.plan.md) at
top-level as a cross-collection coordination spine sequencing three
vertical slices: (1) EEF evidence corpus MCP surface; (2) Oak ontology
Threads MCP surface; (3) misconception sub-graph queries +
EEF×misconceptions cross-corpus composition. Coordination amendments
landed: ADR-157 namespace table extended (`oak-misconceptions-*` +
compound prefix + explicit-source-attribution discipline);
[`eef-evidence-corpus.plan.md`](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md)
tool/prompt names re-prefixed `eef-*` (19 occurrences via 5
replace-alls); [`graph-portfolio-index.md`](../../../plans/graph-portfolio-index.md)
gained `## Vertical-slice arc` section pointing at the spine;
[`high-level-plan.md`](../../../plans/high-level-plan.md) cross-links
the spine from the Cross-cutting Threads section. **Course
corrections in same session**: (a) added unsequenced
`mvp_arc_status: deferred` annotation to NC SKOS taxonomy plan —
reverted by owner direction *"sequence properly or admit not-doing"*;
(b) re-introduced under different framing as `mvp_arc_sequencing` +
out-of-arc tracking — reverted by owner direction *"the NC work is
explicitly NOT part of the MVP"*. Final state: NC plan carries its
own `promotion_trigger` (demand-tripwire on SKOS-specific demand) in
its own frontmatter; spine plan tracks ONLY what's IN the MVP. No
commits during planning; commit chunks landed at session close.
**Prior**: 2026-05-04 — Cosmic Glowing Dawn / claude-code /
claude-opus-4-7-1m / `d11500` — authored
[`graph-stack.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md)
in `current/` as the topology-decision-plus-foundation-increment
spine plan for graph work. Eight active workspaces plus one deferred
(`graph-future`); reserves a workspace home for every layer in
`.agent/research/graph-library.research.md` (renamed 2026-05-07 from `graph-iibrary.md`). Foundation increment ingests the
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
- **Branch**: `planning/graph-tooling` for the current MVP-arc planning
  closeout branch.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `thread-bootstrap-and-light-scan` | 2026-05-01 | 2026-05-01 |
| `Cosmic Glowing Dawn` | `claude-code` | `claude-opus-4-7-1m` | `d11500` | `graph-stack-spine-plan-author` | 2026-05-04 | 2026-05-04 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `mvp-arc-spine-plan-author-and-coordination-amendments` | 2026-05-07 | 2026-05-07 |
| `Breezy Navigating Sail` | `cursor` | `claude-opus-4.7` | `9edbd1` | `mvp-arc-planning-closure-single-session` | 2026-05-07 | 2026-05-07 |
| `Tidal Surfing Lighthouse` | `codex` | `GPT-5` | `019e03` | `decision-completeness-closeout-fixer` | 2026-05-07 | 2026-05-07 |
| `Twigged Shedding Fern` | `codex` | `GPT-5` | `019e03` | `pr-102-snagging-and-pr-comment-refresh-handoff` | 2026-05-07 | 2026-05-07 |
| `Lush Rustling Bark` | `codex` | `GPT-5` | `019e03` | `pr-102-live-thread-follow-up-and-lint-hardening-closeout` | 2026-05-07 | 2026-05-07 |

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

**MVP-arc PLANNING is CLOSED on substance**. Spine + three slice
plans + topology review + reviewer-driven BLOCKER remediation all
landed 2026-05-07 in a single session (Breezy Navigating Sail). The
2026-05-07 opener for parallel specialist-reviewer pass is
**superseded** — that pass ran in Phase 1 of the closure session; do
NOT re-run. The slice-2 / slice-3a / slice-3b plan-authoring work is
**complete** in `current/`; do NOT re-author.

**Owner direction 2026-05-07**: the next session is **planning
decision-completeness closeout**, NOT implementation. Implementation
is **not in scope for this branch**. The session ends with the full
MVP plan — spine + three slice plans + slice 1 + substrate
(`graph-stack.plan.md` + ADR-173) — at decision-complete state, with
sealed frontmatter and no open questions.

**Post-push first task — PR #102 verification on the new head (no
editing before evidence refresh)**:

1. Re-check PR #102 feedback surfaces on the pushed head:
   - top-level PR comments;
   - review summaries;
   - review threads with `isResolved`, `isOutdated`, path, line, and
     comment `databaseId`;
   - latest GitHub checks and Sonar PR state.
2. Classify any remaining comment/thread as resolved, obsolete/outdated,
   already fixed by the latest closeout commits, live/actionable, or
   owner-decision-needed.
3. Only after that analysis, decide whether another narrow snagging pass is
   needed. Do not widen into graph implementation.

**Canonical next planning task — decision-completeness closeout (no
implementation)**:

1. **Absorb the two topology BLOCKERs into `graph-stack.plan.md` +
   ADR-173** (see `## Topology BLOCKERs Surfaced 2026-05-07` below).
   - WS4 sequencing: re-order so `ws4-graph-corpus-sdk-scaffold`
     lands before `ws4-skos-extractor`; SKOS extractor moves into
     the consumer SDK.
   - `practice-graph` workspace tier: relocate from `packages/libs/`
     to `packages/sdks/` or `packages/apps/` per workspace-tier
     semantics; ADR-173 topology entry follows.
   - Outcome: `graph-stack.plan.md` and ADR-173 reach
     decision-complete; no CURRENT → ACTIVE transition or
     ratification this session (those are owner gates).
2. **Absorb the four remaining Phase 4 FINDINGS into the three slice plans + slice 1**
   (see `## Phase 4 FINDINGS for Execution-Prep Absorption` below).
   The prior trivial command/path fixes landed in this closeout
   pass; the remaining work is small substantive edit work: slice 2
   adapter timing; slice 3a topic-context tightening + budget
   concretisation; slice 3b implementation-audit test-shape reshape.
   After absorption all three slice plans should be decision-complete.
3. **Owner-resolve the EEF plan internal contradiction**. The owner
   needs to decide whether t19's LLM/outcome verification
   out-of-scope position holds (and the §`Promotion Trigger from
   CURRENT to ACTIVE` + closing acceptance lines must shed their
   outcome-condition language), or whether outcome conditions are
   load-bearing (and t19 needs revising). This is owner work, not
   agent work; agent surfaces the contradiction with the two
   resolution shapes and waits for direction. Slice 1 IS the EEF
   plan, so its decision-completeness depends on this resolution.
4. **Decision-completeness verification across the full MVP plan**.
   With BLOCKERs absorbed (1), FINDINGS absorbed (2), and EEF
   contradiction owner-resolved (3), confirm sealed-frontmatter
   state and no open questions across:
   - `graph-mvp-arc.plan.md` (spine)
   - `eef-evidence-corpus.plan.md` (slice 1)
   - `oak-kg-threads-surface.plan.md` (slice 2)
   - `oak-misconceptions-subgraph-mcp-surface.plan.md` (slice 3a)
   - `oak-misconceptions-eef-cross-corpus-surface.plan.md` (slice 3b)
   - `graph-stack.plan.md` (substrate)
   - ADR-173 (topology)

   Any artefact NOT decision-complete after steps 1-3 is named
   explicitly in the next-session record with the named blocking
   condition; do not paper over with "ready enough".

**Out of scope for this branch (per owner direction 2026-05-07)**:

- Slice 1 execution; slice 2/3a/3b execution.
- `graph-stack.plan.md` CURRENT → ACTIVE transition.
- ADR-173 ratification.
- Any production code changes.

Queued (not blocked by MVP arc; appropriate for a separate session
on a separate branch):

5. Address EEF thread Promotion Packet (sibling thread).
6. Promote the external-oak-references plan to `current/`.
7. Do a deep read of `oak-curriculum-ontology` to extract the
   vocabulary alignment opportunities for the post-promotion graph
   adapters.

## Topology BLOCKERs Surfaced 2026-05-07 (For Next Session — Execution Prep)

Phase 1 of the single-session planning closure (Breezy Navigating Sail
/ cursor / claude-opus-4.7 / `9edbd1`) ran `architecture-reviewer-betty`
in parallel with the MVP-arc reviewer batch. The topology surface
itself is out of scope for this session per owner direction
(graph-stack ACTIVE promotion + ADR-173 ratification both happen at the
graph-stack CURRENT → ACTIVE transition, **not** here). Two findings
must be absorbed before that transition.

1. **BLOCKER — `graph-stack.plan.md` WS4 sequencing (Principle 7 leakage)**:
   `ws4-skos-extractor` (Oak-specific NC taxonomy extractor) is
   sequenced **before** `ws4-graph-corpus-sdk-scaffold` (the consumer
   SDK). This forces domain-specific ingestion logic into a substrate
   workspace, contradicting the public-asset infrastructure boundary
   (Principle 7, lines 156-157). Fix direction: re-order so the
   consumer SDK scaffold lands first; the SKOS extractor then lives
   in the consumer SDK (where it belongs as Oak-specific code), not
   in the substrate.
2. **FINDING — `practice-graph` workspace tier**: Placed in
   `packages/libs/` but is an Oak-specific consumer, not pure
   substrate. Risks future domain-coupled imports out of `libs/`.
   Fix direction: relocate to `packages/sdks/` or `packages/apps/`
   per workspace-tier semantics; ADR-173 topology entry updates to
   match.

The topology-blocker fixes did not land in Breezy Navigating Sail's
single-session planning closure. They remain the first execution-prep
step, ahead of the graph-stack CURRENT → ACTIVE transition.

## Phase 4 FINDINGS for Execution-Prep Absorption (Surfaced 2026-05-07)

Phase 4 of the single-session planning closure ran `code-reviewer` +
`assumptions-reviewer` in parallel over the three slice plans
authored at `776df6b7`. Two BLOCKERs were remediated same-session
(commit `0899ba93` — slice-3b composition-by-name conceptual mistake
across slices 2, 3a, and 3b). Two trivial FINDINGS were absorbed by
Tidal Surfing Lighthouse on 2026-05-07: the dead smoke gate command was
removed from the graph MVP and graph-stack quality-gate chains, and the
ADR-123 path was corrected to
`docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`.
Four FINDINGS remain for execution-prep absorption.

1. **Slice 2 adapter timing inconsistency** (`oak-kg-threads-surface.plan.md`
   L115-117 asserts the Oak Curriculum Ontology adapter lands in
   "Inc.2 or early Inc.3", but `graph-stack.plan.md` Inc.1-Inc.3
   only names the adapter in Inc.3). Reconcile by either updating
   the slice 2 plan to match `graph-stack.plan.md`, or by adding a
   named adapter gate in `graph-stack.plan.md`.
2. **Slice 3a topic ambiguity** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L167-169 acceptance #1 mentions "topic context" while
   non-goals at L160-161 cut topic-string sub-graph). Tighten
   acceptance #1 to thread/unit context.
3. **Slice 3a budget concretisation** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L197-203 says "standard context windows" + "N representative
   responses" without numbers). Execution prep needs a concrete
   numeric budget (e.g. 32k / 64k token target) and the rule for
   selecting the N representative thread/unit fixtures.
4. **Slice 3b implementation-audit test shape** (`oak-misconceptions-eef-cross-corpus-surface.plan.md`
   L223-226 + L232-235 contain test cycles framed around
   implementation-audit assertions: file-scope import audits, "the
   primitive (not bespoke composition logic) is responsible", file
   size + cyclomatic complexity bounds). Reshape as state-describing
   behavioural tests, or move structural enforcement to lint /
   architecture gates and document accordingly.

These remaining FINDINGS did not retroactively block Breezy Navigating
Sail's single-session planning closure. They are execution-prep work for
the next session and should be absorbed before slice execution starts.

## Closeout Reviewer Pass 2026-05-07

Tidal Surfing Lighthouse ran `docs-adr-reviewer`, `code-reviewer`, and
`assumptions-reviewer` after the initial closeout fixes. Actionable
follow-ups absorbed in the same pass:

- ADR-173 made self-contained: no permanent ADR links to ephemeral
  `.agent/` plan or research surfaces.
- Superseded 2026-05-08 specialist-review opener marked historical, with
  the broken thread link corrected and the `53698ce0` ADR-168/ADR-173
  history clarified.
- Collaboration claim corrected to cover the deleted ADR-168 path plus
  the added template/napkin/comms surfaces.
- Active napkin memory now points namespace/topology checks to ADR-173.
- Plan templates no longer generate `pnpm smoke:dev:stub`.
- `graph-stack.plan.md` no longer depends on nonexistent
  `ws4-mcp-wiring`; `ws5-coordination-amendments` depends on
  `ws4-query-proof`.
- The Phase 4 findings note now says these findings belong before slice
  execution, while not retroactively blocking Breezy's planning closure.

The EEF plan contradiction remains owner-owned and unresolved here.

## References

- Plan: `.agent/plans/connecting-oak-resources/external-oak-references/future/external-oak-references-deep-research.plan.md`
- Existing strategy: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
- Related thread record: `.agent/memory/operational/threads/eef.next-session.md`
- Sibling thread record: `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`
