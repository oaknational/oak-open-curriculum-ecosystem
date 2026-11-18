---
classification: situational
description: "Invoking any agent-tools CLI (agent-identity, collaboration-state, commit-queue, context-cost, and peers): bind to the built dist artefact via the pnpm agent-tools:* shortcuts, never rebuild per invocation; rebuild once after editing source, merging main, or a branch switch. Sequence CLI calls after any running check/build chain — a half-written dist kills the loader; a stale dist makes hooks fail open. A missing affordance is a friction to record, never a licence to fork. Failure shape: per-invocation rebuilds resolving one session seed to different agent names mid-conversation."
trigger: tool:agent-tools-cli
---

# Use Only The Built Agent-Tools CLI

When invoking any agent-tools CLI (`agent-identity`, `collaboration-state`,
`commit-queue`, `branch-touched-files`, `context-cost`, `claude-agent-ops`,
and any other agent-tools entrypoint), use only the **built** (`dist/`)
artefact, never a path that re-runs the build on each invocation. The
goal is decoupling: agent-tools can be developed (refactored, retyped,
re-shaped) on a separate branch or working tree without breaking the
agents that are *using* it concurrently.

## How To Apply

- Prefer pnpm scripts that point at `agent-tools/dist/...` directly
  without an inline `pnpm -s build && node dist/...` step. The unified
  `pnpm agent-tools <topic> <action>` entrypoint and the per-topic
  shortcuts (`pnpm agent-tools:agent-identity`,
  `pnpm agent-tools:collaboration-state`, `pnpm agent-tools:commit-queue`,
  `pnpm agent-tools:branch-touched-files`, `pnpm agent-tools:context-cost`,
  `pnpm agent-tools:claude-agent-ops`) all resolve to the built artefact
  per [`agent-tools/README.md` §Unified entrypoint](../../agent-tools/README.md#unified-entrypoint).
  After editing `agent-tools` source, run `pnpm agent-tools:build` once
  before the next invocation.
- The session-open hook persists only the seed (`PRACTICE_AGENT_SESSION_ID_*`)
  through the `$CLAUDE_ENV_FILE` / `$CURSOR_ENV_FILE` mechanism; every
  invocation re-derives `agent_name` and `session_id_prefix` from the live
  seed, never from a cached name (PDR-027, 2026-08-24). On a Claude Code CLI
  seat the shell also carries the harness-native `CLAUDE_CODE_SESSION_ID`,
  which the seed CLIs read when the env-file write did not reach the shell
  (PDR-027, 2026-09-12); pass `--seed` only when neither is present.
- During wordlist-, identity-, or collaboration-CLI refactors by other
  agents, identity drift will happen unless your session has bound to the
  built artefact at session start; if you observe mid-session identity
  drift (a name change between calls under the same `session_id_prefix`),
  apply the [`(name, prefix) pair`](register-identity-on-thread-join.md#identity-routing-uses-name-prefix-as-a-pair)
  routing discipline and surface the drift in comms.

## When The Built Tool Falls Short

A standard tool that does not do what you need is a **friction to RECORD**, never
a licence to fork bespoke infrastructure around it. Forking does two harms at
once: it **duplicates tested infrastructure** (now two code paths drift), and it
**hides the tool-gap** the owner needs surfaced so the shared tool can improve.
Per [PDR-060 (tooling friction is first-class user feedback)](../practice-core/decision-records/PDR-060-tooling-friction-is-first-class-user-feedback.md)
and [PDR-036 (friction as structural finding)](../practice-core/decision-records/PDR-036-friction-as-structural-finding.md):
when the built CLI is missing an affordance, add a
frictions-register entry (or
extend the tool), then use the smallest standard composition that works — not a
private re-implementation. If a one-off shell pipeline gets you unblocked now,
that is fine; the standing rule is that the **gap gets recorded**, so the fork is
never the silent end-state.

The same discipline has a create-side face (owner standing instruction,
2026-06-24): when you find yourself writing a script, loop, or helper to do a
job, first check whether an agent-tools command already does it (use it), and
if not and the capability is likely to recur, surface to the owner whether it
should become a permanent agent-tools command — a TypeScript command under
`agent-tools/src/`, TDD'd, with the hard-won lesson baked in — rather than
leaving it as a scratchpad one-off. A per-session script is a once-cure that
gets re-derived (often re-derived wrong); the permanent command amortises
across every future agent. The owner decides build-now vs backlog.

The owner closed the keep-scratchpad outcome on 2026-10-03, verbatim: "if a
script is used repeatedly it should be made into a standardised agent tool in
the agent tools workspace". The second use is the signal: the script is named
on the napkin with its usage line and routed to the Director for sizing and a
ledger row; the conversion is work with criteria, sizing and value like any
other, landing under `agent-tools/src/` with its tests through a pull request;
the script is never extended in place.

## "Re-create X" Inherits X's Old Form

An instruction to re-create an instrument is executed by re-deriving the
INSTRUMENT from the current `--help`, never by rebuilding the previous
invocation. A freeze map's "re-create the watch scripts from the resume
map's needs" was executed as recreating SCRIPTS — a PR poller hand-rolled
while the built `pr-watch` topic sat in the same `--help` output the seat
had read that morning (owner-caught 2026-08-17; the script was deleted
and four `pr-watch` monitors armed the same hour) — and the class
re-committed at a second seat with that entry loaded (2026-09-01: a
hand-rolled PR watch beside `pnpm agent-tools:pr-watch`). The
re-derive-from-current-surface discipline binds the instrument, not only
the invocation. A wrapper script is legitimate ONLY as hook-boundary
packaging around a built tool (the comms watcher's `$PPID` and
inline-command guard; a token-minting `gh` wrapper), never as the
instrument itself.

## Sequencing Around Dist Rebuilds

The built-artefact contract cuts both ways: a whole-repo `pnpm check` or
`pnpm build` rebuilds `agent-tools/dist` mid-run, and a concurrent agent-tools
CLI invocation dies on the module loader while the dist is half-written
(worked instance 2026-07-08: a `collaboration-state` call died at
`cjs/loader:1503` during a backgrounded closeout check). Sequence
CLI-dependent steps AFTER a running check/build chain completes; never
interleave them. The same family applies after a worktree branch switch:
rebuild agent-tools before trusting its CLIs from that tree (the
stale-dist-after-switch class; see the frictions register). The same
inversion in a FRESH worktree: dependency-cruiser and knip resolve through
`dist`, so an unbuilt worktree reports phantom violations (31 unresolvable
edges vanished after `pnpm turbo run build`, 2026-08-17) — `ls <pkg>/dist`
before diagnosing configuration. And the "primary untouched" discipline
binds the RESOLVED BINARY of every invocation, not only the files it
names: a worktree-resolved agent-tools binary run against the primary's
registry executed a migrate-on-first-contact hours before its code landed,
and every seat's heartbeat refused for three minutes (2026-08-18) — a
read-shaped command can carry a write-shaped migration, and cwd is
load-bearing mid-rollout.

## Why This Rule Exists

Observed live 2026-05-05: Pelagic Swimming Rudder was refactoring
`agent-tools/src/core/agent-identity/wordlists.ts` while other agents
were running. Per-invocation rebuilds resolved the same session seed to
different `agent_name`s mid-conversation (Twilit Beaming Aurora →
Ashen Banking Bellows; Opalescent Eclipsing Asteroid wiped from name
lookups entirely). The cure is structural: bind to the built artefact,
not to the in-progress source.

The built-artefact contract has a staleness dual — the **build/dist
inversion** (three instances, late July 2026): validators, gates, and
PreToolUse hooks that import an unbuilt or STALE dist silently misbehave or
fail OPEN — a hook that cannot load its guard blocks nothing. Consequences:
gate chains order the Turbo build before dist-importing checks, and **the
primary's dist is rebuilt immediately after merging main** — main may name
artefacts the old dist lacks, and every dist-binding surface degrades
silently until the rebuild.

## Probe Usage With `--help`, Never With a Well-Formed Call

A CLI "usage probe" with real arguments is a write. Diagnosing a `comms
direct` exit-2 (missing `--platform`/`--model`) by re-running it with
`--body test` and the missing flags WROTE a one-word directed event to a
peer before the real acknowledgement (2026-08-19); a second seat
re-derived the same discipline independently two weeks later after its
own usage errors (2026-09-02: `--help` before the first invocation of
any subcommand in the session). The rule: read `<topic> <action> --help`
before a subcommand's first use; the first well-formed invocation is the
real one. Where a subcommand rejects `--help` (the merge-bot token mint
does), read its source or the topic help — never invoke it to learn its
flags.

Build output has its own verb as well. A stale derived artefact that blocks a gate
(a `.next` directory, a `dist`) is cleared with the build graph's own clean
verb, `pnpm --filter <workspace> run clean`: never with a raw delete, and
never by asking the owner which to use (owner's correction, 2026-08-10, as
recorded: "you shouldn't have asked").

## Related Surfaces

- [`agent-tools/README.md`](../../agent-tools/README.md) §Unified entrypoint —
  how the built-artefact contract is realised in the pnpm script surface.
- [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md) —
  the routing-layer rule that handles drift gracefully when it does happen.
- [`use-agent-comms-log.md`](use-agent-comms-log.md) — comms-event author
  attribution depends on identity stability.
