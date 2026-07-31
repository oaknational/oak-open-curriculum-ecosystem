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
- Cache resolved identity values (`agent_name`, `session_id_prefix`) in
  the per-platform env file at session-open and read them from env on
  every subsequent invocation rather than re-deriving. The
  `$CLAUDE_ENV_FILE` / `$CURSOR_ENV_FILE` mechanism already supports this;
  the discipline is that re-derivation only happens once per session.
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
across every future agent. The owner decides build-now vs backlog vs
keep-scratchpad.

## Sequencing Around Dist Rebuilds

The built-artefact contract cuts both ways: a whole-repo `pnpm check` or
`pnpm build` rebuilds `agent-tools/dist` mid-run, and a concurrent agent-tools
CLI invocation dies on the module loader while the dist is half-written
(worked instance 2026-07-08: a `collaboration-state` call died at
`cjs/loader:1503` during a backgrounded closeout check). Sequence
CLI-dependent steps AFTER a running check/build chain completes; never
interleave them. The same family applies after a worktree branch switch:
rebuild agent-tools before trusting its CLIs from that tree (the
stale-dist-after-switch class; see the frictions register).

## Why This Rule Exists

Observed live 2026-05-05: Pelagic Swimming Rudder was refactoring
`agent-tools/src/core/agent-identity/wordlists.ts` while other agents
were running. Per-invocation rebuilds resolved the same session seed to
different `agent_name`s mid-conversation (Twilit Beaming Aurora →
Ashen Banking Bellows; Opalescent Eclipsing Asteroid wiped from name
lookups entirely). The cure is structural: bind to the built artefact,
not to the in-progress source. Source: Claude per-user memory
`feedback_use_built_agent_tools_only`.

The built-artefact contract has a staleness dual — the **build/dist
inversion** (three instances, late July 2026): validators, gates, and
PreToolUse hooks that import an unbuilt or STALE dist silently misbehave or
fail OPEN — a hook that cannot load its guard blocks nothing. Consequences:
gate chains order the Turbo build before dist-importing checks, and **the
primary's dist is rebuilt immediately after merging main** — main may name
artefacts the old dist lacks, and every dist-binding surface degrades
silently until the rebuild.

## Related Surfaces

- [`agent-tools/README.md`](../../agent-tools/README.md) §Unified entrypoint —
  how the built-artefact contract is realised in the pnpm script surface.
- [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md) —
  the routing-layer rule that handles drift gracefully when it does happen.
- [`use-agent-comms-log.md`](use-agent-comms-log.md) — comms-event author
  attribution depends on identity stability.
