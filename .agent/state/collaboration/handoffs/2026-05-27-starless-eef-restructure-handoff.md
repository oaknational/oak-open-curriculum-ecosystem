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
- **Forward plan-restructure: `cc3fad3c`.** Retraction banners on
  `eef-evidence-corpus.plan.md` + `graph-mvp-arc.plan.md`; `feat-mcp-meta`
  freshened; `eef.next-session.md` 2026-05-21 entry annotated. **Step 1 below is
  now COMPLETE this session** (was originally deferred; finished before compaction).

## POST-COMPACTION NEXT STEP (do in this order)

### Step 1 — Finish the forward plan-restructure — ✅ DONE (`cc3fad3c`, this session)

COMPLETE. Retraction banners landed on `eef-first-feature.plan.md` (`a60b51ce`),
`eef-evidence-corpus.plan.md`, and `graph-mvp-arc.plan.md`; `feat-mcp-meta`
freshened; `eef.next-session.md` 2026-05-21 entry annotated. The forward
restructure carried the correct selection-vs-ranking boundary (selection restored
to gate-1a; scoring engine + recommend/explain/compare stay gate-1b). Nothing
remains here — proceed to Step 2.

**Still held for inc-g (after F ships):** the ADR-123 inventory amendment and the
gate-1a-closed marking — adding delivery claims before delivery violates the
Definition of Delivery.

### Step 2 (now the FIRST post-compaction action) — Apply increments B → C → D → E → F → G → H per the meta-plan

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

## Gate debt (status after this session)

- `practice:substrate:check` `active-claims.json`: **FIXED** — the 65 stale
  `abandoned` commit_queue entries (expired 2026-05-22) were cleared; the file
  is now schema-valid.
- `practice:vocabulary` `session-open-env-freshness-check.plan.md`: **FIXED** —
  the retired fitness phrasing reworded to the ADR-176 advisory-vs-enforcing
  polarity; gate green.
- `practice:substrate:check` `closed-claims.archive.json`: **OPEN — needs a
  decision, not a blind fix.** ~1090 archived claims carry `closure.evidence`
  that predates the tightened `evidence_ref` shape (free-form `kind`, no
  per-evidence `summary`). Two honest options: a tolerant archive evidence
  shape in `closed-claims.schema.json` (substrate-schema change), or a
  deliberate bulk migration. Do NOT fabricate 1090 `summary` fields. This is an
  owner / substrate-architecture decision.
- `practice:fitness` 1 hard: `repo-continuity.md` 543 > 525 lines — wants
  thoughtful promotion (knowledge-preservation), its own consolidation piece.

— Starless Prowling Mask (13c7d5)
