# Open Questions — Archive (2026-06-23, Narwhal tracks Lagoon)

Resolved entries moved out of the live `open-questions.md` register at the
2026-06-23 dedicated consolidation. Each was RESOLVED with the owner; the
resolution substance is live in the named owning artefact (verified first-hand
this pass: Q-002 → the vision-strategy plan; Q-008 → ADR-200 §8). Preserved
verbatim as historical record.

## Q-002 — The nature of the strategy layer and the vision→strategy→planning flow

**Question:** What *is* the strategy layer (its shape, content, and granularity), and how exactly
does vision derive strategy, and strategy derive planning? The controlling plan assumes a
2A (align-on-impact) → 2B (gap analysis) → 2C (execution spine) structure, but the owner wants the
nature of the strategy layer and the derivation flow settled before more strategy work proceeds.

**Why it shapes future work:** it governs the whole Phase 2 (and the Phase 3 estate restructure
that serves the strategy). If "the strategy layer" means something different from the current
2A/2B/2C breakdown, that breakdown is provisional and may be reshaped — so authoring more strategy
documents now risks building on an unsettled frame.

**Why not cheaply answerable now:** it's a design discussion the owner wants to hold directly in a
fresh session; it isn't an artefact an agent should settle unilaterally.

**Owning artefact:** [`vision-strategy-and-plan-estate.plan.md`](../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md)
(Phase 2 — carries the owner-directed gate); thread `strategy-and-plan-estate-holistic-review`.

**Status:** RESOLVED (2026-06-18). The discussion happened. Outcome: the strategy layer is a
**cohesive system-strategy** (choices + measures; portfolio tier + per-stream sections, cohesive
across and within), homed at `docs/strategy/`. The vision→strategy→planning relationship is
**informational dependence, not execution order**, sitting under a fourth top layer — **Oak's own
strategy**, which our vision services (align, not fulfil). The 2A/2B/2C phase breakdown is
superseded by three co-equal, first-class bodies of work (vision / strategy / plan estate). Full
outcome recorded in the controlling plan
[`vision-strategy-and-plan-estate.plan.md`](../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md)
(reconceived 2026-06-18). Surfaced by owner direction; resolved with the owner.

## Q-003 — Is the app's data-availability gate a missing materialised view, or TPC-filter assurance?

**Question:** The MCP-app launch-readiness names a "lesson-level data-availability" gate as "the
missing materialised view the API needs" (stream-mcp-app.md release-readiness hand-offs; controlling
plan Body 2). The owner (2026-06-21) framed the same area as the **third-party-content (TPC) filter
not yet proven** for public release — the open-data subset (TPC removed) the Open Curriculum API
serves. Are these the same gate (the MV *is* the proven-open filter), two facets of one gate, or two
distinct gates?

**Why it shapes future work:** it is a production-release blocker for the app stream and the
marketing gate (TPC-risk mitigation). Whether the work is "build a missing MV", "prove the existing
filter", or both changes the hand-off owner and the acceptance criteria.

**Why not cheaply answerable now:** needs the data/API team's first-hand knowledge of the actual
data infrastructure; an agent must not assert the data shape from docs.

**Owning artefact:** [`stream-mcp-app.md`](../../../docs/strategy/stream-mcp-app.md)
§release-readiness hand-offs; controlling plan §Body 2; the launch-readiness framework.

**Status:** RESOLVED (2026-06-21, owner). Same conceptual area — surfacing the lesson-level TPC data
in the database (upstream, **not our scope**) and an appropriate materialised view are the
*mechanisms* that enable access to the safely-filtered (TPC-removed) data via the upstream Oak Open
Curriculum API. The "missing materialised view" and the "TPC filter not yet proven" describe one
gate: the safely-filtered open-data availability the app depends on. Surfaced by Plover wakes
Sundog's first-hand context-loss scan; resolved by owner direction.

## Q-008 — The human-authoring workflow for the co-equal documents

**Question:** ADR-200 makes the human-navigable documents a **co-equal** embodiment (§Non-goals forbids
mechanically-derived stubs) and §7 says "the tools reconcile every edit back into the graph", with the §8
prose↔frontmatter agent-gate catching drift at handoff. But the *proactive human* side is under-specified:
when a human edits a document's prose, is there a human-facing tool that keeps its frontmatter↔graph edges
consistent as they write, or does the human always pair with an agent and rely on the after-the-fact gate?

**Why it shapes future work:** co-equal-human-embodiment is a first-class ADR-200 constraint. If the only
path for graph-consistent human edits is agent-pairing, that is an acceptable answer — but it should be a
*decided* one, because it shapes the authoring tooling WS5/WS7 build and the human's actual experience of
the corpus.

**Why not cheaply answerable (when open):** it had a product/UX dimension (the human authoring experience)
that edged toward the owner. (Answered by owner direction — see Status. The WS5 / dedup dependency it noted
applies to the *build*, not the now-decided *approach*.)

**Owning artefact:** [ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
§2/§7/§8; the rewrite plan WS5 (projection-type schemas) and WS7 (co-authoring).

**Status:** RESOLVED (owner, 2026-06-22) — the **approach** is decided: the owner chose the
**agent-workflow-at-handoff** horn over a live as-you-type human tool. The mechanism is a **prose→graph
reconciliation workflow**: a human edits prose freely; an agent workflow (triggered by a skill such as
`session-handoff` or `plan`) semantically analyses the edited prose, extracts ideas, matches them against
the idea-graph, decides per §7's history-preserving ops (edit / supersede / mint-new), updates the
idea-graph and the document frontmatter to match the prose, after which the graph resumes as the source of
truth. Homed in
[ADR-200 §8](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md). The
**build** is not yet detailed: its match step reuses the still-open de-duplication / same-idea mechanism
(WS5) and it is wired at WS4's thin-slice proof — so the *approach* is resolved, the *build* is gated on WS5.
