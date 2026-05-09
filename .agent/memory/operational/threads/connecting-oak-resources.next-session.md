# Next-Session Record — `connecting-oak-resources` thread

**Last refreshed**: 2026-05-09 (owner direction via `jc-session-handoff` /
Fronded Bending Blossom / `cursor` / Composer / `60775a` — **next engineering
arc**: implement **graph MVP features** per slice plans after PR #102 merge
prep completes (post-merge type-check + gates). **Parked until later**:
monorepo workspace topology ADR / **S0–S6** programme
(`architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`).
Prior evidence block below remains authoritative for PR #102 state until
refreshed against live GitHub.)

**Prior refresh**: 2026-05-08 (Opalescent Shimmering Orbit / codex /
GPT-5 / `019e06` — PR #102 graph planning closeout is decision-complete and
pushed as head `309d9e5e44cebecb1be2478d2fb084a54f39b6b2`. GitHub checks pass,
SonarCloud Code Analysis passes through PR checks, and all known review threads
are resolved. Branch-touched-files reports `107`, so PR #102 is not
merge-ready until the final clean-worktree dry-run merge/abort is run. Latest
owner decisions applied in this pass: EEF verification is structural-only for
slice 1; LLM/outcome eval is follow-on infrastructure; practice-facing graph
tooling lives under `agent-graphs/practice-graph/`. Current plan:
[`2026-05-08-pr102-graph-decision-complete-closeout.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md).
Historical note at time of that refresh: next session was framed as clearing
the final merge blocker before implementation.)

```text
Decision-complete: YES
Merge-ready with respect to graph planning: NO
Remaining blocker: the 107-file branch requires the final pre-merge workflow
on a clean worktree. Current unrelated local scratch state in
.agent/plans/notes/ must be preserved or isolated before the dry-run.
Owner decisions resolved: structural-only EEF slice 1 evaluation; LLM/outcome
eval follow-on; `agent-graphs/practice-graph/`; slice 3a 16k budget +
20-context fixture; slice 3b Thread IRI substrate-only runtime; ADR-173 remains
Proposed.
Validation: markdownlint, format-check, git diff --check, branch-touched-files,
gh pr checks on pushed head 309d9e5e, Sonar PR surface through PR checks,
review-thread refresh with all threads resolved, non-mutating divergence probe.
Next safe step after merge: **graph MVP feature implementation** per
`knowledge-graph-integration/current/*` slice plans (owner sequencing
2026-05-09). Defer monorepo topology ADR work until after that tranche.
```

**Prior refresh**: 2026-05-08 (Fronded Branching Grove / codex /
GPT-5 / `019e06` — PR #102 technical closeout is green on
`a8ef3ad1be343d2b786416ce12dcfeca270fb56e`: GitHub merge state `CLEAN`,
root `run-quality-gates`, CodeQL, SonarCloud Code Analysis, and Vercel pass;
Sonar MCP reports quality gate `OK`, zero open PR issues, and zero new
violations; unresolved review threads are zero. Owner direction after that
closeout: PR #102 must not merge until the graph plans are finalised and
decision-complete. New current plan:
[`2026-05-08-pr102-graph-decision-complete-closeout.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md).
**Next session starts with final graph decision-completeness closeout, not
merge and not slice implementation.**)

**Prior refresh**: 2026-05-08 (Lush Rustling Bark / codex /
GPT-5 / `019e03` — owner-requested `jc-session-handoff` refresh for PR #102.
Current head is `df66b742694d1bfdd757019c97414945540eabf5`; PR title/body
are stale and must be rewritten after comparing `origin/main...HEAD`; the
branch differs from `origin/main` by 93 files, 6595 insertions, and 770
deletions. GitHub merge state is `BLOCKED` because SonarCloud Code Analysis
fails; Sonar MCP reports quality gate `ERROR`, four open issues, and zero
`TO_REVIEW` hotspots. Nine review threads remain unresolved: four are
outdated-and-fixed graph comments, three are fixed-but-undismissed current
threads, one schema docstring mismatch is live, and one PR metadata mismatch is
live. **Next session starts with PR #102 closeout, not graph planning work.**)

**Prior refresh**: 2026-05-07 (Lush Rustling Bark / codex /
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
resolve the EEF plan internal contradiction, then verify
decision-complete state across the full MVP plan (spine, 3 slice
plans, slice 1, substrate, ADR-173). This historical queue is superseded by
the 2026-05-08 structural-only EEF decision. NO slice execution; NO
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
spine plan for graph work. Historical topology was eight active workspaces
plus one deferred; PR #102 closeout updates this to seven active graph
workspaces plus one deferred
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
| `Lush Rustling Bark` | `codex` | `GPT-5` | `019e03` | `pr-102-live-thread-follow-up-lint-hardening-and-handoff` | 2026-05-07 | 2026-05-08 |
| `Fronded Branching Grove` | `codex` | `GPT-5` | `019e06` | `pr-102-final-closeout` | 2026-05-08 | 2026-05-08 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-graph-decision-complete-closeout-updater` | 2026-05-08 | 2026-05-08 |
| `Fronded Bending Blossom` | `cursor` | `Composer` | `60775a` | `owner-sequencing-graph-mvp-next-topology-parked` | 2026-05-09 | 2026-05-09 |

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

**Owner direction 2026-05-08 supersedes older merge notes**:
PR #102 must not merge until graph planning is decision-complete. The topology,
slice-plan, and EEF evaluation findings below were absorbed in the PR #102
closeout. Do not restart that absorption work; use the closed-disposition
sections below as history.

**Immediate first task — clear merge blockers only (no implementation)**:

1. Commit and push the local planning closeout bundle, then re-check GitHub and
   Sonar on the final pushed head.
2. Dispose the live Copilot `emit-index.ts` thread by fixing or explicitly
   rejecting it outside this planning-only closeout.
3. Run the final pre-merge divergence workflow for the 107-file branch scope.
   The non-mutating probe on 2026-05-08 found `origin/main` unchanged since
   merge-base `91e73d3c95066c9670b000648c547592d1334bd0`, no changed-both
   files, no ADR/plan numbering add/add collisions, and no merge-tree conflict
   signal; the actual dry-run merge/abort step remains for a clean worktree.
4. Collaboration claims are closed; verify `claims status` stays at zero before
   opening any new work.

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

## Topology Findings Surfaced 2026-05-07 (Closed Dispositions)

Phase 1 of the single-session planning closure (Breezy Navigating Sail
/ cursor / claude-opus-4.7 / `9edbd1`) ran `architecture-reviewer-betty`
in parallel with the MVP-arc reviewer batch. The topology surface
itself was out of scope for that session per owner direction. PR #102 closeout
absorbed the planning-doc side of both findings without promoting graph-stack
ACTIVE or ratifying ADR-173.

1. **BLOCKER — `graph-stack.plan.md` WS4 sequencing (Principle 7 leakage)**:
   `ws4-skos-extractor` (Oak-specific NC taxonomy extractor) is
   sequenced **before** `ws4-graph-corpus-sdk-scaffold` (the consumer
   SDK). This forces domain-specific ingestion logic into a substrate
   workspace, contradicting the public-asset infrastructure boundary
   (Principle 7, lines 156-157). Fix direction: re-order so the
   consumer SDK scaffold lands first; the SKOS extractor then lives
   in the consumer SDK (where it belongs as Oak-specific code), not
   in the substrate. **ACTIONED 2026-05-08**: graph-stack WS4 now scaffolds
   `graph-corpus-sdk` before the NC adapter/extractor, and query proof depends
   on the adapter.
2. **FINDING — `practice-graph` workspace tier**: Placed in
   `packages/libs/` but is a practice-facing consumer, not pure
   substrate. Owner decision: relocate the planned workspace to
   `agent-graphs/practice-graph/`, with the top-level `agent-graphs/`
   organisation and workspace globs sequenced through
   `agent-tooling/future/agent-graphs-workspace-organisation.plan.md`.

ADR-173 ratification and graph-stack ACTIVE promotion still require their own
future owner approval, but these two topology findings are no longer live
execution-prep blockers.

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
Four FINDINGS remained for execution-prep absorption. PR #102 closeout applies
the following dispositions:

1. **Slice 2 adapter timing inconsistency** (`oak-kg-threads-surface.plan.md`
   L115-117 asserts the Oak Curriculum Ontology adapter lands in
   "Inc.2 or early Inc.3", but `graph-stack.plan.md` Inc.1-Inc.3
   only names the adapter in Inc.3). **ACTIONED 2026-05-08**: slice 2 now
   gates on the named graph-stack Oak Curriculum Ontology Thread adapter
   cycle.
2. **Slice 3a topic ambiguity** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L167-169 acceptance #1 mentions "topic context" while
   non-goals at L160-161 cut topic-string sub-graph). **ACTIONED
   2026-05-08**: acceptance now requires Thread IRI context, with Unit IRI
   only if the optional unit variant is explicitly authorised.
3. **Slice 3a budget concretisation** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L197-203 says "standard context windows" + "N representative
   responses" without numbers). **ACTIONED 2026-05-08**: slice 3a now uses
   `maxResponseTokens = 16000` and a deterministic `20`-context fixture
   manifest selected from reachable-misconception counts.
4. **Slice 3b implementation-audit test shape** (`oak-misconceptions-eef-cross-corpus-surface.plan.md`
   L223-226 + L232-235 contain test cycles framed around
   implementation-audit assertions: file-scope import audits, "the
   primitive (not bespoke composition logic) is responsible", file
   size + cyclomatic complexity bounds). **ACTIONED 2026-05-08**: TDD cycles
   are behavioural; no-legacy-import, thin-body, file-size, and complexity
   constraints moved to lint/depcruise/architecture/code-review gates.

These remaining FINDINGS did not retroactively block Breezy Navigating Sail's
single-session planning closure. They are now closed for PR #102 planning-doc
decision-completeness.

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

The old EEF plan contradiction note is superseded by the 2026-05-08
structural-only decision: structural citation/data/caveat preservation is
load-bearing now; LLM/outcome evaluation is follow-on infrastructure.

## References

- Plan: `.agent/plans/connecting-oak-resources/external-oak-references/future/external-oak-references-deep-research.plan.md`
- Existing strategy: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
- Related thread record: `.agent/memory/operational/threads/eef.next-session.md`
- Sibling thread record: `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`
