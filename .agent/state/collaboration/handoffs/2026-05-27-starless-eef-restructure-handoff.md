---
agent_name: Starless Prowling Mask
id: a81f75bf-c3ce-52b2-a356-31b74d70aaf5
platform: claude
model: claude-opus-4-7
session_id_prefix: 13c7d5
created_at: 2026-05-27T00:00:00Z
last_updated_at: 2026-05-27T00:00:00Z
classification: pre-compaction-handoff
trigger: owner-requested compaction after EEF delivery-restructure
---

# Handoff — EEF Delivery Restructure (Definition of Delivery + gate-1a rebuild)

## Read these first

1. **The owning meta-plan (in repo, survives compaction):**
   `.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`
   — increments A–H, the full Part 5 surface-restructure inventory, open owner
   decisions, branch coordination. This is the roadmap.
2. **The new doctrine (LANDED this session):**
   `.agent/directives/definition-of-delivery.md` + PDR-085. Delivery = value
   received by a named beneficiary; LANDED vs RELEASED; the not-delivery list.

## Landed this session (feat/graph-foundations, primary checkout)

- **Increment A — Definition of Delivery doctrine: `27956bb6`.** Directive +
  PDR-085 (Status: Proposed — owner to elevate to Accepted) + practice-index
  Directives row + decision-records README + AGENT.md anchor. All gates green.
- **Plan restructure: `a60b51ce`.** Meta-plan brought into repo + indexed in
  EEF README; `eef-first-feature.plan.md` gate-1a contract SUPERSEDED via banner
  that retracts three false-delivery claims (sequencing-not-scope-reduction,
  ff4 "t10 landed" orphaned prompt, "WS4.5 LANDED" stub).

## POST-COMPACTION NEXT STEP (do in this order)

### Step 1 — Finish the forward plan-restructure (the remainder of "all related plans")

Budget ran short this session; only `eef-first-feature.plan.md` got its banner.
Apply the SAME forward-restructure (retract false claims; repoint to the
meta-plan + Definition of Delivery) to the rest, per meta-plan §Part 5
**do-now forward subset only**:

- `eef-evidence-corpus.plan.md` — gate-grouping table wrongly defers selection
  (t5/t6/t7/t8) to gate-1b; `t10` `status: completed` is false (orphaned prompt).
- `graph-mvp-arc.plan.md` — gate-1a scope omits selection; "no scope reduction".
- `feat-mcp-graph-support-foundation-meta.md` — stale (missing this meta-plan +
  please-do-a-deep-mighty-peach in related_plans; last_updated 2026-05-22).
- `eef.next-session.md` — annotate the 2026-05-21 entry as the **unratified**
  selection-removal.

**Do NOT** apply the F-dependent items now (ADR-123 inventory amendment;
gate-1a-closed marking) — those are inc-g, after F ships. Adding delivery
claims before delivery violates the Definition of Delivery.

### Step 2 — Apply increments B → C → D → E → F → G → H per the meta-plan

Critical value path: **E → F → G → H**. First value increment: F at LANDED.
B and A-adjacent doc work parallel. C→D is gate-1b, non-blocking for gate-1a.

## Branch coordination (CRITICAL — land each increment on the right branch)

- **A + the plan restructure (Step 1):** primary checkout
  `/Users/jim/code/oak/oak-open-curriculum-ecosystem`, branch
  **`feat/graph-foundations`**.
- **EEF increments B / E / F (code):** worktree `/Users/jim/code/oak/oak-wt-eef`,
  branch **`feat/eef-explore-evidence`** (the PR #121 branch).
- **Open landing-vehicle question for the owner:** the doctrine + restructure
  currently ride `feat/graph-foundations`. Decide whether they reach `main` via
  that branch or as their own PR (the doctrine is independent of the
  graph-foundations feature work — ship-independent-coordinate-dependent).

## PR #121 disposition (important)

PR #121 (`feat/eef-explore-evidence`) carries the EEF tool as **whole-graph, no
projection, no feature flag, no co-registered prompt**. Under the new gate-1a
contract it is NOT mergeable as-is — it is the **basis for increment F** (rework
to selection + projection + 10k budget + flag co-gating the tool+prompt). Do not
merge #121 as-is; reshape it into F.

## Open owner decisions (from the meta-plan)

1. `focus` enum data gaps — `numeracy` maps to nothing (rename to `mathematics`
   / crosswalk to `improving_maths`?); accept literacy/feedback tag/slug fallbacks?
2. Include or exclude the 13 strands with no `school_context_relevance`?
3. Un-stub `enumerateNodes` at gate-1a, or accept loader-level filtering?
4. PDR-085 → Accepted (recommended) or keep Proposed pending first exercise?
5. Release timing (H) vs gate-1a closure (G) — LANDED-only is a valid resting state.

## Pre-existing gate debt (NOT introduced this session; none commit-blocking; none blind-fixable)

- `practice:substrate:check` blocking: `active-claims.json` +
  `closed-claims.archive.json` schema-incoherence — 2049-line backlog of stale
  `abandoned` claims from 2026-05-22; degraded **multi-writer state**, repair
  classified `manual-with-provenance`. Needs a careful claim-lifecycle cleanup,
  not a blind edit. Route to a dedicated collaboration-state cleanup.
- `practice:vocabulary` fail: `session-open-env-freshness-check.plan.md:221`
  — "not a blocking gate" flagged by the ADR-144 three-zone gate, but the
  sentence is a legitimate **ADR-176 advisory-vs-blocking polarity** statement.
  Cross-ADR boundary question; do not silence by forcing fitness-zone words.
- `practice:fitness` 1 hard: `repo-continuity.md` 543 > 525 lines — wants
  thoughtful promotion (knowledge-preservation), its own consolidation piece.

— Starless Prowling Mask (13c7d5)
