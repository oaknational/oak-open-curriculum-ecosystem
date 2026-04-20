# Track: OAC Phase 4 + Plugin Migration

**Agent**: Claude (this session, opus-4-7)
**Branch**: `feat/otel_sentry_enhancements`
**Created**: 2026-04-20
**Expires_at**: 2026-04-23

## Claimed territory

- `.agent/prompts/session-continuation.prompt.md` — retire `Live Continuity
  Contract` and ephemeral session-state sections.
- `.agent/prompts/archive/` — archive the retired prompt sections.
- `.agent/skills/go/shared/go.md` — retire OAC-pilot framing, promote state
  surfaces to baseline read order.
- `.agent/commands/session-handoff.md` — retire OAC-pilot framing, rewrite
  step 1 to target state surfaces directly.
- `.agent/state/repo-continuity.md` — pilot-evidence refinements (a).
- `.agent/state/README.md` — fix stale gitignored claim (line 47–48) +
  writer/authority updates.
- `.agent/plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md`
  — Phase 4 execution notes + authority-order refinement (b).
- `.agent/plans/observability/current/sentry-esbuild-plugin-migration.plan.md`
  — plan-density resolution (fold vs pair-archive).
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/*` — WS1 deletion
  scope.

## Current task

OAC Phase 4.1 — retire legacy prompt sections and align workflow docs with
the three-surface model.

## Blocker

None. Owner-set sequencing: Phase 4 close → plugin migration → Sentry
integration. Sequencing is an in-flight-drift-reduction choice, not a
technical block — the plugin-migration plan's actual dependency is OAC
Phase 2 scaffolding (already landed at `ffcad2aa`). Framing corrected
after `assumptions-reviewer` flagged it during Phase 4.3 closeout.

## Handoff note

Owner pushed back on the "stop reading the legacy prompt section" patch
and asked for the retirement itself. Phase 4.1 retired the section
(1628 → ~145 lines). Phase 4.2 recorded no-promotion portability
decision. Phase 4.3 propagated to ADR-150, `continuity-practice.md`,
`practice-bootstrap.md`, and the operational-awareness deep-dive;
reviewer findings were applied (ADR-150 rationale/consequences/§4
alignment; OAC plan §Goal + §Task 2.2 gitignored vestiges corrected;
repo-continuity + workstream brief staleness cleared; track card
blocking-chain overstatement corrected). PDR-011 alignment + the deep
consolidation pass remain as follow-up.

## Promotion needed

None yet. If the prompt retirement surfaces a durable pattern worth
promoting (e.g. "retire, don't patch, legacy surfaces"), record it here.
