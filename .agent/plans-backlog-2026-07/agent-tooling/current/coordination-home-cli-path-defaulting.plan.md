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
  - .agent/skills/change-custody/commit/SKILL-CANONICAL.md
related_frictions:
  - "F-41 (.agent/memory/operational/frictions-register.md) — core closed by b5408291d + c90150ffa; this is the CLI tail"
first_instance: "2026-07-01 — Vanilla stirs Spore (807471) launched directly in the oak-upstream-api-alignment worktree; first recorded live worktree-launch that hit the hazard (all prior instances ran in the primary and masked it). Owner note: would otherwise have been discovered during the Spawn Flow work."
last_updated: 2026-07-29
todos:
  - id: ws1a-default-comms-watch-paths
    content: "Default the atomic --comms-dir/--seen-file pair on comms watch to the PRIMARY coordination home and exact-display-name cursor; preserve the explicit pair and --repo-root override; create both parent directories"
    status: completed
  - id: ws1b-default-comms-read-paths
    content: "Default --comms-dir on comms inbox/list/show/peer-liveness via resolveCoordinationHome(cwd) when omitted; keep explicit absolute/--repo-root overrides honoured"
    status: pending
  - id: ws2a-default-claims-paths
    content: "Default --active across claims commands and --closed on close/archive-stale to the PRIMARY coordination home, preserving explicit paths and --repo-root"
    status: completed
  - id: ws2b-default-direct-reply-and-queue-paths
    content: "Default the remaining required collaboration paths on comms direct/reply and commit-queue via resolveCoordinationHome(cwd) when omitted (re-derive the EXACT command set against the live CLI first — do not enumerate from memory)"
    status: pending
  - id: ws3-guard-integrity-primary-heartbeat
    content: "Make assert-watcher-live and the claims-open F-95 backstop resolve the same exact-display-name heartbeat under the PRIMARY coordination home, so an explicit worktree-local watch pair cannot satisfy the canonical gate"
    status: completed
  - id: ws4a-migrate-watcher-doctrine
    content: "Migrate the canonical watcher rule, notification-path rule, start-right watcher guidance, mechanism reference, platform matrix, and agent-tools README to the omit-path default and Codex NOTIFY composition"
    status: completed
  - id: ws4b-migrate-remaining-invocations
    content: "Migrate the commit skill and remaining estate/test invocations after their command surfaces acquire coordination-home defaults"
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

- **Gap.** The first delivered slice now makes `comms watch` worktree-safe when
  its atomic `--comms-dir` / `--seen-file` pair is omitted: it resolves the
  PRIMARY coordination home, derives the exact-display-name cursor, honours
  `--repo-root`, and creates both parent directories. The F-95
  `assert-watcher-live` and claims-open gates now resolve that same canonical
  heartbeat. The remaining comms read, direct/reply, queue, and
  estate-invocation surfaces have not all acquired or adopted
  coordination-home defaults. Claims `--active` and the mutating
  closed-archive paths already default through the PRIMARY home.
- **Harm.** A remaining command launched directly in a linked worktree can
  still read or mutate a worktree-local collaboration path when its caller
  supplies a relative path. An explicitly supplied watch-path pair is
  deliberately preserved verbatim and can still watch a decoy, although its
  heartbeat no longer satisfies the canonical F-95 gate.
- **Mechanism.** The repository is partway through replacing command-anchoring
  asymmetry with a shared `resolveCoordinationHome` boundary. Watch defaulting,
  directory creation, guard integrity, and claims defaults are delivered; the
  remaining read/direct/reply/queue defaults and invocation migrations are
  still separate work.
- **Constraints.** No machine-local paths (git-native resolution only, never
  `--show-toplevel` — that returns the *current* worktree, VERIFIED TRAP 2026-06-27);
  PDR-055 cl.7 (explicit overrides still honoured); the watch override is an
  all-or-nothing pair; non-breaking for the primary-checkout case (omitting
  resolves to the same place).
- **Success.** From any linked worktree, omitting the path options on comms
  read/watch/inbox and claims resolves to the PRIMARY registry; the F-95
  guards cannot pass against a worktree-local decoy; the migrated estate
  invocations run green from both the primary checkout and a linked worktree;
  only then is the F-41 CLI tail closed.

## End goal · mechanism · means

- **End goal.** Every collaboration-state command is worktree-safe by construction, so
  the worktree-per-seat topology (the thing this whole arc serves) has no silent
  coordination-blindness footgun.
- **Mechanism.** Default the path options via the one git-resolved home the write path
  already uses — remove the cwd-sensitivity at the source rather than documenting around
  it — and make the liveness guards resolve the same home so they cannot be fooled.
- **Means.** WS1a–WS5 below.

## Verified findings

Findings 1–4 are the first-hand 2026-07-01 baseline. Their watch and guard
portions are superseded by findings 5–6; the remaining read-path asymmetry is
still current.

1. **Historical asymmetry confirmed in code.** `cli-comms-query.ts:43`
   (`list`/`show`/`peer-liveness`), `cli-comms-inbox.ts:13` (`inbox`), and the
   then-current `cli-comms-watch.ts:68` (`watch`) required
   `options['comms-dir']`; `cli-comms-send.ts:54` resolved
   `optional(options,'repo-root') ?? resolveCoordinationHome(cwd)`.
2. **Historical decoy-dir creation.** The then-current
   `cli-comms-watch.ts:86` `await io.ensureDirectory(commsDir)` created a
   missing worktree-local directory rather than failing loud.
3. **Historical guard defeat.** The watcher's heartbeat landed beside the
   worktree-relative cursor, so `assert-watcher-live` and the `claims open`
   backstop both classified a decoy watcher as live.
4. **Founding live instance.** A worktree-launched session watched an empty local dir;
   only pointing `--comms-dir` at the absolute primary path restored visibility. First
   recorded worktree-launch instance — prior instances ran in the primary and masked it
   (see `comms-and-worktree-operability.plan.md` §Why #1: *"it only worked because the
   session ran in the primary"*).
5. **Delivered watch default (2026-07-29).** `comms watch` accepts
   `--comms-dir` and `--seen-file` only as a pair. Omission resolves the
   PRIMARY coordination-home comms directory and exact-display-name cursor;
   `--repo-root` overrides the home; an explicit pair is preserved verbatim.
   The CLI creates the comms directory and seen-file parent.
6. **Delivered F-95 guard integrity (2026-07-29).**
   `assert-watcher-live` and the claims-open backstop default to the same
   canonical exact-display-name heartbeat under the PRIMARY coordination
   home. A heartbeat beside an explicit decoy cursor does not pass that
   default-path gate.

## Workstreams (TDD cycles — one commit each; tests never lead/lag product code)

### WS1a — Default the comms watch path pair — completed

`comms watch` now treats `--comms-dir` and `--seen-file` as an atomic pair.
When omitted it resolves the PRIMARY coordination home and derives
`comms-seen/<exact display name>.json`; `--repo-root` overrides the home.
When supplied, the pair is preserved verbatim. Both directory parents are
created before the watch loop.

- **Delivered acceptance:** omitted watch paths use the PRIMARY home from a
  linked worktree; a partial pair is rejected; an explicit pair and
  `--repo-root` remain honoured. **Proof:** source contract + focused tests.

### WS1b — Default the remaining comms read paths — pending

Default `--comms-dir` via `resolveCoordinationHome(cwd)` when omitted on
`comms inbox` / `list` / `show` / `peer-liveness`. Inject the git runner as an
arg (no global state); keep explicit absolute / `--repo-root` overrides
honoured.

- **Acceptance:** from a linked worktree, each omitted read path resolves to
  the PRIMARY comms directory. **Proof:** unit per command + one integration
  read from a real linked worktree.

### WS2a — Default claims paths — completed

The F-85/F-108 path wrappers already default `--active` across claims
commands and `--closed` on `claims close` / `archive-stale` to the PRIMARY
coordination home. Explicit paths and `--repo-root` remain honoured.

- **Delivered acceptance:** claims invoked from a linked worktree resolve the
  shared registries without repeated absolute-path ceremony. **Proof:** the
  existing claims path-defaulting tests.

### WS2b — Default direct/reply and commit-queue paths — pending

Default the remaining required collaboration paths on `comms direct` /
`reply` and `commit-queue`. **Re-derive the EXACT required-path command set
against the live CLI first** — #244 review flagged that the list drifts, so do
not enumerate it from memory.

- **Acceptance:** each remaining command, path omitted, resolves the PRIMARY
  collaboration state from a linked worktree. **Proof:** unit per command +
  one integration sweep.

### WS3 — Guard integrity: canonical heartbeat — completed

The F-95 `assert-watcher-live` and claims-open backstop now independently
derive the exact-display-name heartbeat from the same PRIMARY coordination
home. A watcher using an explicit worktree-local pair can still create its
directories, but that heartbeat does not certify canonical
coordination-visibility.

- **Delivered acceptance:** both gates read the canonical primary-home
  heartbeat and reject a decoy-only heartbeat. **Proof:** focused guard tests.

### WS4a — Migrate watcher doctrine — completed

Update the canonical watcher rule (`comms-all-channels-watcher.md` §Canonical
invocation), notification-path rule, start-right watcher guidance, mechanism
reference, platform matrix, and `agent-tools` README to omit the watch path
pair and explain the worktree-safe default. Record the Codex `NOTIFY`
relay-child procedure and its dated PDR-133 proof at this doctrine boundary.

- **Delivered acceptance:** canonical watcher documentation omits both paths,
  retains explicit `cd <repo-root>`, supervisor binding, 3600-second backstop,
  120000-millisecond step timeout, and a 100-event drain batch. Start-right no
  longer claims that the comms watcher covers claims or queue state.
  **Proof:** doctrine review.

### WS4b — Migrate remaining estate invocations — pending

Migrate the commit skill and remaining tests or invocation examples after
their command surfaces acquire the corresponding coordination-home defaults.

- **Acceptance:** each migrated invocation runs green from both the primary
  checkout and a linked worktree. **Proof:** integration + doctrine review.

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

- WS1a and WS3 are delivered; WS3 composes with WS1a's canonical watcher path.
- WS1b and WS2b remain independent command-surface cycles; WS2a is already
  delivered.
- WS4a is delivered for the watcher slice. WS4b follows the defaults it
  consumes. WS5 follows WS1b, WS2b, and WS4b.

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Defaulting changes behaviour for primary-checkout callers | Omitting resolves to the same place they used; explicit paths still honoured. |
| A reviewer proposes `git rev-parse --show-toplevel` | VERIFIED TRAP — returns the current worktree; use `git worktree list --porcelain \| first`. |
| An explicit watch pair targets a decoy | Preserve alternate watcher destinations, but bind every heartbeat to its actual absolute comms source; canonical F-95 gates reject a source mismatch even when the heartbeat or cursor is relocated. |
| Migrating a remaining invocation bricks a live command | WS4b tests from a real linked worktree before landing. |

## Foundation alignment

- `principles.md` — DRY (one resolver, the one `send` uses); derive-not-document-around.
- `testing-strategy.md` — TDD cycle-pairs; injected git runner; no global state.
- ADR-197 / PDR-055 — one checkout owns registry state; explicit-override affordance discipline.

## Plan-body first-principles check

Fires before each remaining WS: (1) **shape** — re-confirm the cited file:line
still matches (the CLI evolves); (2) **landing-path** — each WS ends at a
commit with green gates; (3) **vendor-literal** — re-derive the required-path
command set against the live CLI at execution (WS2b especially); (4) the
`git worktree list` VERIFIED TRAP above.

## Readiness reviewers

Before READY: `architecture-expert` (resolver boundary / DRY), `config-expert`
(CLI option defaulting + turbo/env), `test-expert` (all TDD cycles), plus a
`claude-code-guide` re-pass **critically assessed** on any Claude Code worktree semantics
touched by WS4.

## Learning loop & lifecycle triggers

Per `components/lifecycle-triggers.md`: this plan is the work-shape artefact; each WS
closes with a commit. WS1a, WS3, and WS4a are delivered slices, not completion
of the plan or F-41. Completion after WS1b, WS2b, WS4b, and WS5 closes F-41 and
runs `/oak-consolidate-docs`. Create a thread-record home if execution spans
sessions.
