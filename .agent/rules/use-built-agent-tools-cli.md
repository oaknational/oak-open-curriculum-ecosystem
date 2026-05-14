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

## Why This Rule Exists

Observed live 2026-05-05: Pelagic Swimming Rudder was refactoring
`agent-tools/src/core/agent-identity/wordlists.ts` while other agents
were running. Per-invocation rebuilds resolved the same session seed to
different `agent_name`s mid-conversation (Twilit Beaming Aurora →
Ashen Banking Bellows; Opalescent Eclipsing Asteroid wiped from name
lookups entirely). The cure is structural: bind to the built artefact,
not to the in-progress source. Source: Claude per-user memory
`feedback_use_built_agent_tools_only`.

## Related Surfaces

- [`agent-tools/README.md`](../../agent-tools/README.md) §Unified entrypoint —
  how the built-artefact contract is realised in the pnpm script surface.
- [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md) —
  the routing-layer rule that handles drift gracefully when it does happen.
- [`use-agent-comms-log.md`](use-agent-comms-log.md) — comms-event author
  attribution depends on identity stability.
