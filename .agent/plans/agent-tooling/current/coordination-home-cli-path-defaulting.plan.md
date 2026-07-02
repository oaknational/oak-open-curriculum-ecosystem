---
status: current
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent-tooling — worktree-per-seat topology (PDR-117)
  strategic_choice: one shared coordination home, git-resolved, worktree-safe (ADR-197 / F-41)
  derives_from: ../future/coordination-home-explicit-targeting-migration.plan.md
promoted_from: ../future/coordination-home-explicit-targeting-migration.plan.md
related_plans:
  - ./comms-and-worktree-operability.plan.md
  - ./agent-spawn-flow-tool.plan.md
related_doctrine:
  - docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md
  - .agent/practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md
  - .agent/rules/comms-all-channels-watcher.md
  - .agent/skills/commit/SKILL-CANONICAL.md
related_frictions:
  - "F-41 (frictions-register.md) — core closed by b5408291d + c90150ffa; this is the CLI tail"
first_instance: "2026-07-01 — Vanilla stirs Spore (807471) launched directly in the oak-upstream-api-alignment worktree; first recorded live worktree-launch that hit the hazard (all prior instances ran in the primary and masked it). Owner note: would otherwise have been discovered during the Spawn Flow work."
last_updated: 2026-07-01
todos:
  - id: ws1-default-comms-read-paths
    content: "Default --comms-dir (and --seen-file) on comms watch/inbox/list/show/peer-liveness via resolveCoordinationHome(cwd) when omitted; keep explicit absolute/--repo-root overrides honoured"
    status: pending
  - id: ws2-default-claims-and-queue-paths
    content: "Default --active/--closed on claims open/close/heartbeat, comms direct/reply, and commit-queue via resolveCoordinationHome(cwd) when omitted (re-derive the EXACT required-path command set against the live CLI first — do not enumerate from memory)"
    status: pending
  - id: ws3-guard-integrity-no-decoy-heartbeat
    content: "Close the guard-defeat: a worktree-launched watcher must not silently create a decoy comms dir and write a live heartbeat that passes assert-watcher-live + the claims-open backstop while watching an empty local dir"
    status: pending
  - id: ws4-migrate-doctrine-invocations
    content: "Migrate estate invocations to omit the defaultable paths: comms-all-channels-watcher.md canonical invocation, the commit skill, start-right, and the ~dozen tests that pass relative paths"
    status: pending
  - id: ws5-close-friction
    content: "Close F-41 in the frictions register with the B1 + fix + this-tail landing SHAs; reconcile the future/ brief and the comms-and-worktree-operability overlap"
    status: pending
---

# Coordination-Home CLI Path Defaulting — the F-41 CLI tail (worktree-safe comms/claims reads)

Promoted 2026-07-01 from
[`../future/coordination-home-explicit-targeting-migration.plan.md`](../future/coordination-home-explicit-targeting-migration.plan.md)
(the strategic brief; kept as the lineage source). Pickup home for the fix the owner
asked to be made discoverable after a live worktree-launch surfaced it.

## Problem (gap · harm · mechanism · constraints · success)

- **Gap.** `resolveCoordinationHome(cwd)` (git-resolves the PRIMARY checkout via
  `git worktree list --porcelain`, commit `c90150ffa`) is wired into `comms send` /
  `comms validate` / `tui`, but the **read/watch/claims** commands still
  `required(options, 'comms-dir' | 'active' | 'seen-file' | …)` with **no** primary
  default. The canonical watcher invocation in `comms-all-channels-watcher.md`
  hardcodes the worktree-relative `--comms-dir .agent/state/collaboration/comms` and
  `--seen-file .agent/state/collaboration/comms-seen/<codename>.json`.
- **Harm.** A session launched **directly in a linked worktree** (the PDR-117 /
  Spawn-Flow topology) writes outgoing events to the correct primary home (`comms send`
  resolves it) but **watches an empty worktree-local directory** — blind to every
  broadcast / directed / group event the team emits. It is invisible-to-itself of the
  team while appearing live. **Worse (new finding, this instance):**
  `cli-comms-watch.ts:86` calls `ensureDirectory(commsDir)`, which **silently creates a
  decoy empty comms dir** in the worktree, auto-seeds from empty, and writes a watcher
  liveness heartbeat to the (also worktree-relative) seen-file. So
  `assert-watcher-live` and the `claims open` comms-blindness backstop — the two
  mechanical F-95 guards that exist to make this un-skippable — **both PASS against the
  decoy**. The guard cannot catch the failure it was built to catch.
- **Mechanism (causal hypothesis).** Command-anchoring asymmetry: only the write path
  (`comms send`) was migrated onto `resolveCoordinationHome`; the read/watch/claims
  commands take REQUIRED explicit paths, so a relative path resolves against cwd = the
  worktree's own (empty) copy. The F-41 core fix reached `send` but not the tail.
- **Constraints.** No machine-local paths (git-native resolution only, never
  `--show-toplevel` — that returns the *current* worktree, VERIFIED TRAP 2026-06-27);
  PDR-055 cl.7 (explicit overrides still honoured); non-breaking for the
  primary-checkout case (omitting resolves to the same place).
- **Success.** From any linked worktree, omitting the path options on comms
  read/watch/inbox and claims resolves to the PRIMARY registry; the F-95 guards cannot
  pass against a worktree-local decoy; the migrated doctrine invocations run green from
  both the primary checkout and a linked worktree; F-41 closed.

## End goal · mechanism · means

- **End goal.** Every collaboration-state command is worktree-safe by construction, so
  the worktree-per-seat topology (the thing this whole arc serves) has no silent
  coordination-blindness footgun.
- **Mechanism.** Default the path options via the one git-resolved home the write path
  already uses — remove the cwd-sensitivity at the source rather than documenting around
  it — and make the liveness guards resolve the same home so they cannot be fooled.
- **Means.** WS1–WS5 below.

## Verified findings (first-hand, 2026-07-01)

1. **Asymmetry confirmed in code.** `cli-comms-query.ts:43` (`list`/`show`/`peer-liveness`),
   `cli-comms-inbox.ts:13` (`inbox`), `cli-comms-watch.ts:68` (`watch`) all
   `required(options, 'comms-dir')`; `cli-comms-send.ts:54` resolves
   `optional(options,'repo-root') ?? resolveCoordinationHome(cwd)`.
2. **Decoy-dir creation.** `cli-comms-watch.ts:86` `await io.ensureDirectory(commsDir)`
   creates the missing worktree-local dir instead of failing loud.
3. **Guard defeat.** The watcher's default liveness heartbeat lands at the (worktree-relative)
   `<seen-file>.heartbeat.json`, so `assert-watcher-live` and the `claims open` backstop
   both classify a decoy watcher as live.
4. **Live instance.** A worktree-launched session (this one) watched an empty local dir;
   only pointing `--comms-dir` at the absolute primary path restored visibility. First
   recorded worktree-launch instance — prior instances ran in the primary and masked it
   (see `comms-and-worktree-operability.plan.md` §Why #1: *"it only worked because the
   session ran in the primary"*).

## Workstreams (TDD cycles — one commit each; tests never lead/lag product code)

### WS1 — Default the comms read/watch path options

Default `--comms-dir` (and derive `--seen-file` as
`<home>/.agent/state/collaboration/comms-seen/<codename>.json`) via
`resolveCoordinationHome(cwd)` when omitted, on `comms watch` / `inbox` / `list` /
`show` / `peer-liveness`. Inject the git runner as an arg (no global state); keep
explicit absolute / `--repo-root` overrides honoured.

- **Acceptance:** from a linked worktree, omitting `--comms-dir` resolves to the PRIMARY
  comms dir (resolver unit test + an integration read from a real linked worktree).
  **Proof:** unit + integration.

### WS2 — Default the claims / commit-queue / direct-reply path options

Same defaulting for `claims open/close/heartbeat` (`--active`/`--closed`), `comms
direct`/`reply`, and `commit-queue`. **Re-derive the EXACT required-path command set
against the live CLI first** — #244 review flagged that `direct`/`reply` and others also
require explicit paths; the list drifts, do not enumerate from memory.

- **Acceptance:** each command, path omitted, resolves the PRIMARY registry from a linked
  worktree. **Proof:** unit per command + one integration sweep.

### WS3 — Guard integrity: no decoy heartbeat

A worktree-launched watcher must not silently create a decoy dir and write a "live"
heartbeat that defeats the F-95 guards. Once WS1 defaults the watcher and its seen-file
to the primary home the omit-path case is cured; this cycle adds the **non-regression
lock** — an explicit relative `--comms-dir` that resolves worktree-local (or a
just-created empty dir) must not yield a heartbeat that `assert-watcher-live` /
`claims open` read as live coordination-visibility.

- **Acceptance:** a test proves the guards do NOT pass for a watcher over a worktree-local
  decoy; `ensureDirectory` no longer masks the misroute silently. **Proof:** unit.

### WS4 — Migrate doctrine invocations to omit the defaultable paths

Update the canonical watcher rule (`comms-all-channels-watcher.md` §Canonical
invocation), the commit skill, start-right, and the ~dozen tests that pass relative
paths, to omit the now-defaultable options. Non-breaking for the primary case; fixes the
worktree case.

- **Acceptance:** the migrated invocations run green from both the primary checkout and a
  linked worktree; no live watcher bricked. **Proof:** integration + doctrine review.

### WS5 — Close the friction and reconcile

Close F-41 in the frictions register with the B1 + core + this-tail SHAs; mark the
future/ brief promoted (pointer to this plan); note in
`comms-and-worktree-operability.plan.md` §B1 that its command-anchoring item is executed
here (drive/reference, do not duplicate).

## Non-goals (YAGNI)

- Statusline binary pinning + markdownlint `.agent/state` scheme — owned by
  `comms-and-worktree-operability.plan.md` §B2 / §Open questions (deep-review-gated).
- Refusing bare-relative paths outright — the future brief settled that defaulting via
  the git-resolved home removes the need; WS3 adds the guard-integrity lock instead.
- Cross-machine coordination (the collaboration filesystem is not shared across machines).

## Prerequisite classification

- WS1, WS2, WS3 independent (separate command surfaces; WS3 layers on WS1's watcher path).
- WS4 beneficial-after WS1/WS2 (migrate once the defaults exist). WS5 after WS1–WS4.

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Defaulting changes behaviour for primary-checkout callers | Omitting resolves to the same place they used; explicit paths still honoured. |
| A reviewer proposes `git rev-parse --show-toplevel` | VERIFIED TRAP — returns the current worktree; use `git worktree list --porcelain \| first`. |
| Migrating the watcher rule bricks a live watcher | WS4 tests from a real linked worktree before landing; seen-file cursor means no missed events on re-arm. |

## Foundation alignment

- `principles.md` — DRY (one resolver, the one `send` uses); derive-not-document-around.
- `testing-strategy.md` — TDD cycle-pairs; injected git runner; no global state.
- ADR-197 / PDR-055 — one checkout owns registry state; explicit-override affordance discipline.

## Plan-body first-principles check

Fires before each WS: (1) **shape** — re-confirm the cited file:line still matches (the
CLI evolves); (2) **landing-path** — each WS ends at a commit with green gates; (3)
**vendor-literal** — re-derive the required-path command set against the live CLI at
execution (WS2 especially); (4) the `git worktree list` VERIFIED TRAP above.

## Readiness reviewers

Before READY: `architecture-expert` (resolver boundary / DRY), `config-expert`
(CLI option defaulting + turbo/env), `test-expert` (all TDD cycles), plus a
`claude-code-guide` re-pass **critically assessed** on any Claude Code worktree semantics
touched by WS4.

## Learning loop & lifecycle triggers

Per `components/lifecycle-triggers.md`: this plan is the work-shape artefact; each WS
closes with a commit; completion closes F-41 and runs `/oak-consolidate-docs`. Create a
thread-record home if execution spans sessions.
