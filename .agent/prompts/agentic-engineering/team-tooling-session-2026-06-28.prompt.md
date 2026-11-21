# Team Session Opener — Team-Tooling Session (2026-06-28)

> When working with other agents, all responses, work, claims and sources
> must be critically assessed before being accepted.

**Type**: instance (instantiated 2026-06-28 from
[`team-session-opener.prompt.md`](team-session-opener.prompt.md)) for the
team-tooling session. Director move-0 artefact (PDR-117); the BLOCKING
precursor to any implementer source edit.

**Plan authority** (authoritative for scope, sequencing, acceptance, validation):

- Cohesion anchor: [`team-tooling-session-2026-06-28.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/team-tooling-session-2026-06-28.plan.md)
- Lane A (O3): [`agent-spawn-flow-tool.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-spawn-flow-tool.plan.md)
- Lane B (O1/O2): [frictions register](../../memory/operational/frictions-register.md) (batch home for F-82/F-101/F-75/F-85 + the comms+claims batch) and [`cost-of-collaboration.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/cost-of-collaboration.plan.md)
- O5: [`under-the-hood-mcp-discovery-pointer.plan.md`](../../plans-backlog-2026-07/sdk-and-mcp-enhancements/current/under-the-hood-mcp-discovery-pointer.plan.md)
- Locked scope: [`cost-of-collaboration.plan.md` §Locked scope](../../plans-backlog-2026-07/agent-tooling/current/cost-of-collaboration.plan.md)

## Entry ritual (every seat, before any other move)

1. Run [`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md) (Director) or
   [`start-right-quick`](../../skills/start-right-quick/shared/start-right.md) (implementers) end to
   end — First Moves order is non-negotiable (watcher, heartbeat, team-start, coordination, claims).
   **Done for all three seats** as of 2026-06-28T16:35Z (team-starts on the comms stream).
2. **Single-identity check.** PDR-027 identity preflight; confirm exactly ONE name on every surface;
   carry the full tuple on every event. A second rendered name is a P1 — report it and open no claim.
3. Read this brief end to end before any source edit.
4. **Handoff pickup contract.** A seat continuing another session's lane reads that lane's latest
   handoff record under `.agent/state/collaboration/handoffs/` end to end first (PDR-063), and
   re-verifies its pinned facts first-hand. (No mid-cycle pickups at session open — all three seats
   are fresh.)

## Team shape

One **Director** — Firefly binds Slag (`claude-opus-4-8[1m]`, `887889`) — plus **2 implementers**,
each session in its **own git worktree**:

- **Implementer A** — Beluga turns Shoal (`claude-opus-4-8[1m]`, `581401`) → Lane A (O3, critical path).
- **Implementer B** — Pangolin weaves Nightfall (`claude-opus-4-8[1m]`, `c680e4`) → Lane B (O1 + O2).

The Director does **pure direction only** (PDR-117): no implementer-level work, no fact-finding;
sub-agent launches are implementer-class work, routed to a team member. The owner is hands-off this
session — there are **no owner go-aheads**; the Director drives to completion and routes all questions,
escalating to the owner only what is constitutively the owner's.

## Worktrees and the coordination home (critical convention)

Per-session worktrees dissolve the shared-tree failure modes (index/HEAD races, foreign-lock
collisions, full-tree pre-commit coupling, within-one-file sweep, HEAD moving under a session).

Exactly ONE checkout — the **Director's primary checkout** — is the coordination home for all
`.agent/state/` and `.agent/memory/` writes. The collaboration CLIs are path-parameterised; each
implementer resolves the coordination home deterministically (the primary checkout via
`git worktree list` / the `resolveCoordinationHome` helper — WS-3 F-41) and points every comms/claims
invocation at it with explicit `--active <coordination-home>/.agent/state/collaboration/active-claims.json`
and `--comms-dir <coordination-home>/.agent/state/collaboration/comms`. **Never write a machine-local
absolute path into a versioned file** — resolve it at runtime.

By construction:

- Implementer PRs are **pure source diffs** — no collaboration-registry or continuity files ride a
  feature branch.
- The Director owns ALL `.agent/state/`, `.agent/memory/`, and continuity writes, landed from the
  coordination home as `docs(continuity)` commits.

### Worktree setup (each implementer, once)

```bash
git fetch origin
git worktree add <worktrees-root>/wt-<seat> -b feat/<first-deliverable> origin/main
cd <worktrees-root>/wt-<seat> && pnpm install && pnpm build   # required for gates (incl. eslint plugin dist/)
```

Feature branches rotate inside the worktree per deliverable — one small pure-diff PR each, flat,
always based on current `origin/main`. After a PR merges, pull `main` and cut the next branch.

## Branching strategy (three classes)

- **Implementer feature branches**: one per deliverable, cut from current `origin/main`, landed as one
  small pure-diff PR, deleted at merge.
- **Coordination home**: `coordination/team-tooling-session-2026-06-28` (off `main`), Director-owned,
  sole writer; pushed at waypoints (carries this opener + the setup + the dedicated consolidation; draft
  PR #268); never PR'd mid-arc, never rebased; merged at arc end after a divergence analysis, via the
  **code-owner gate** (no `--admin`, no `--no-verify`).
- **Coordination ⇇ main merges**: Director merges `origin/main` INTO the coordination home
  (forward-only, merge commit) when Director tooling needs landed source or drift accumulates;
  divergence analysis first.

## Seat briefs

| Seat | Lane (deliverables in order) | Owned surfaces | Must not touch / sequencing gates |
| --- | --- | --- | --- |
| **Director** (Firefly binds Slag) | Direct; comms + PR + CI monitoring; merge sequencing; reviewer-dispatch routing; `.agent/state` + `.agent/memory` + continuity + prompt/plan status writes; frame + adjudicate the OQ5 decision; AC6 evidence | `.agent/state/`, `.agent/memory/`, this opener, plan/prompt status lines | Product code and tests (agent-tools/src) |
| **Implementer A** (Beluga turns Shoal) → **O3** | spawn-flow Phase 0 (launch-in-worktree convention, codified *after* the first spawn E2E) → Phase 1 (`agent spawn <lane>` E2E) → Phase 2 (F-98 binding view) → F-98 heartbeat-age column | **NEW** `agent-tools/src/spawn/**` (greenfield module) + a new spawn command/bin file; A's own tests | Must NOT edit `agent-tools/src/collaboration-state/**` (B's surface). A **reads** B's liveness surface (`active-agents.ts`, `claim-reports.ts`, `watcher-staleness.ts`) for the F-98 last-seen/heartbeat-age column — read-only; if A needs a new export there, request it via comms (B provides it in B's lane). The F-98 column is the clean slip and lands **after** B's liveness merges, so the read is against a stable surface. |
| **Implementer B** (Pangolin weaves Nightfall) → **O1, O2** | O1: F-82 verify (**FIRST — opening gate**) → F-101 watcher kill-tree/lease → F-75 heartbeat-silence alert. Then O2: F-85 `--active`→home default → comms+claims ergonomics batch (F-72/F-89/F-70/F-77/F-79/F-80) | Existing `agent-tools/src/collaboration-state/**` (the `cli-*.ts`, `claim-reports.ts`, `active-agents.ts`, `watcher-*.ts`, `coordination-home.ts`, `comms-*.ts`) + B's own tests | Must NOT create/edit `agent-tools/src/spawn/**` (A's surface). F-75 starts **after** F-101 (it makes heartbeat-silence truthful). |
| **Shared seam** (both) | Top-level CLI dispatch registry: `agent-tools/src/bin/agent-tools-cli.ts`, `agent-tools-cli-topics.ts`, `agent-tools.ts`, `collaboration-state.ts` | — | **Resolving rule: additive edits at distinct locations only** (A registers the `spawn` topic; B wires ergonomics). ADR-204 require-up-to-date serialises merges — the second merger rebases onto the first. For any **structural rewrite** of a dispatch file, coordinate a micro-window via comms naming the file before editing. |

**Hard sequencing gates** (a dependent deliverable starts only after the blocking PR is MERGED):
A's launch-in-worktree convention is codified after its own first spawn E2E (Phase 0); B's F-75 starts
after F-101 merges; A's F-98 heartbeat-age column reads B's merged liveness surface.

## Coordination cadence

- **Heartbeats**: [`liveness-heartbeat-cron`](../../rules/liveness-heartbeat-cron.md) — ≤4-min cadence,
  10-min retirement threshold. Relabel at lane transitions; stop-loop-first at closeout.
- **Asks**: bounded-deadline + default-action on directed comms; route to the lowest-authority
  resolver. Implementer questions route to the **Director**, never the owner (owner is hands-off).
- **Director monitoring**: persistent watchers on the comms stream and every open PR (checks AND review
  comments AND merge state); every loop has an explicit exit criterion.
- **Reviews**: every bot/reviewer comment adjudicated first-hand (refute with source grounding or apply
  — never relay, never dismiss); verdicts replied on the PR.
- **Merges**: Director-serialised; gate state and reviewer-comment state both settle before merge; the
  code-owner click is the owner's.
- **Retirement**: PDR-063 (freeze record → claim pointer → directed `mid-cycle-handoff` → heartbeat-end
  + retirement broadcast). B's lane is full (5 deliverables) — seat rotation for B is expected as
  context deepens; slip-order if short: F-75 → ergonomics tail → F-98 column.
- **Closeout**: Director is closeout owner; runs full `session-handoff` + `consolidate-docs` BEFORE the
  final coordination-branch PR merges. Implementers leave boundary-scoped closeout notes and close their
  own claims.

## Known costs and cautions (instance-specific)

- Per-worktree `pnpm install && pnpm build` is real minutes, paid once per seat (incl. the Playwright
  browser step if a lane runs UI/a11y gates).
- The innate-immunity write-hook fires per-session in every worktree; false positives are by design —
  read the reappraisal, do not reword around the wall.
- **The shared `agent-tools/src` tree is the central seam.** The partition above keeps A (greenfield
  `spawn/`) and B (existing `collaboration-state/`) naturally disjoint; the only contact points are the
  bin dispatch registry (additive-only) and A's read of B's merged liveness surface. Worktree isolation
  + ADR-204 prevent silent clobber; this boundary minimises merge conflicts.
- **Residual (stall-detection)**: until OQ5 is built, liveness cannot structurally distinguish
  "working" from "wedged" — treat freshness / claim-staleness as **input-to-verify** (F-44);
  primary cross-check is ping-before-escalate against the heartbeat-event stream.
