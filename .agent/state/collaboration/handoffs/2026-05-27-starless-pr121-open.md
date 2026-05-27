---
agent_name: Starless Prowling Mask
id: a81f75bf-c3ce-52b2-a356-31b74d70aaf5
platform: claude
model: claude-opus-4-7
session_id_prefix: 13c7d5
created_at: 2026-05-27T17:30:00Z
last_updated_at: 2026-05-27T17:30:00Z
classification: post-PR-open-handoff
trigger: owner-anticipated-compaction
peer: Galactic Dancing Constellation (7efeec) — reviewer
---

# Handoff — EEF value-PR open (#121); ONE owner decision pending

## TOP PRIORITY on resume — the open feature-set question (owner decides)

**No feature-set decision has been made.** The gate-1a tool is **implemented**
to return the **whole connected EEF evidence graph** (all 30 strands + 37
edges) rather than a context-narrowed subset. This is a **potential direction
for owner discussion, NOT a decided choice** (owner stated this explicitly,
twice, 2026-05-27). Do not treat it as settled.

- It is **reversible** — only the seed-selection step in
  `execution.ts` (`runEefExploreTool`) + the substrate `strandIds` would change.
- Engineering/peer analysis that INFORMS (does not decide) it: server-side
  narrowing now overlaps the gate-1b scoring engine; the tag data is a poor fit
  for narrowing (`focus` enum → `feedback` has 0 tags; phase-narrowing would
  suppress the 14/30 strands with no phase tag, e.g. mentoring,
  reducing-class-size, summer-schools — they apply across phases).
- Alternatives to weigh with the owner: phase-aware seeding (accepting that
  suppression), or another product shape.
- Captured: task #18; PR #121 top section ("🔵 Potential direction").
- **Process lesson** (memory `feedback_feature_shaping_is_owner_decision`):
  feature/product-scope forks go to the owner early + prominently as potential
  directions, never as a verdict or buried default.

## Where things are

- **PR #121** open: `feat/eef-explore-evidence` → main.
  <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/121>
  Rebased clean onto origin/main (release 1.14.1 + PR #119). All push gates
  green (type-check, lint, knip, unit + integration + E2E, build, md, prettier).
- **Branch HEAD** `49317312`. 5 feature commits + 2 gate-fix commits
  (`5e8f404c` knip internal-const; `49317312` E2E list_tools parity).
- Worktree `/Users/jim/code/oak/oak-wt-eef` is clean; I hold it (one writer).
- CI on #121 will run on GitHub; check `gh pr checks 121` on resume.

## The feature (gate-1a, complete)

`eef-explore-evidence-for-context` MCP tool: teacher context → freshness-gated
real EEF corpus → whole-graph subgraph → structural citations + caveats +
attribution → typed telemetry span. Orchestrated by the landed
`eef-evidence-grounded-lesson-plan` prompt. Built on the
`graph-corpus-sdk/eef-strands` substrate (adapter + Zod loader + freshness).

## Review provenance (no backfill)

Every stage reviewed in-cycle (type/fred/test). Commit 4 had the full panel
(mcp + security + type + test, Galactic, turn 41) — carried into the PR as the
PR-boundary review. Substrate hardening had the betty + wilma panel (turn 31,
verified).

## Named follow-ons (non-blocking; gate-1b refresh path)

1. F3 — `schemaHash` = `schema_version` string, not a content hash.
2. Telemetry app-wiring — the `recordSpan` seam ships; Sentry runtime sink is
   the consuming app's job.
3. ADR-123 enumeration — tool/prompt counts hand-maintained; generate before a
   2nd corpus.
4. `school_context_relevance` sub-field modelling when first consumed.
5. projection shared-applier in graph-core before a 2nd adapter ships projection.

## Coordination

- Galactic = reviewer (ARC channel:
  `.agent/state/collaboration/experiments/agent-rapid-communication-and-gellings/README.md`,
  turns ≤43). I = driver. Roles owner-fixed.
- Register ledger lives in the PR #121 body (per-commit VER + follow-ons).

— Starless Prowling Mask (13c7d5)
