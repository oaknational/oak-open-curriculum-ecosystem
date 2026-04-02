# Continuity Adoption Evidence

**Opened**: 2026-04-02
**Purpose**: Live evidence log for continuity/session-handoff adoption in the
MCP App lane

## Evidence Window

Record evidence until all three conditions are satisfied:

1. 5 real MCP App resumptions after rollout
2. 3 `GO`-driven execution sessions
3. 2 deep consolidations after rollout

The window closes only after the last unmet condition is satisfied.

## Rollout Record

- 2026-04-02: `session-handoff` installed as the lightweight closeout surface
- 2026-04-02: `session-handoff` gained a consolidation gate that can escalate
  into `jc-consolidate-docs` when due and well-bounded
- 2026-04-02: `wrap-up` retired
- 2026-04-02: live continuity contract added to
  `.agent/prompts/session-continuation.prompt.md`
- 2026-04-02: `consolidate-docs` reframed as conditional deep convergence
- 2026-04-02: `GO` aligned to the continuity contract and active MCP App plans
- 2026-04-02: surprise capture formalised in the napkin skill

## Session Evidence Log

| Date | Session type | Continuity contract produced | Objective/invariants/next step recovered | Deep consolidation correctly skipped/triggered | Surprise captured with promotion target | Notes |
|---|---|---|---|---|---|---|
| pending | pending | pending | pending | pending | pending | pending |

## Deep Consolidation Evidence

| Date | Trigger(s) that fired | Did `consolidate-docs` run at the right depth? | Notes |
|---|---|---|---|
| pending | pending | pending | pending |

## Promotion Decision

Status: pending

Allowed outcomes:

- `promote`
- `adjust`
- `reject`

Decision rationale will be recorded here once the evidence window closes.
