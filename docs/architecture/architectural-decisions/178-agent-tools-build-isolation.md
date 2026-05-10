# ADR-178: Agent-Tools Build Isolation — Built Dist, Not Source-on-Each-Invocation

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[ADR-122](122-pnpm-workspace-as-package-source-of-truth.md) — pnpm
workspaces are the package source of truth (build outputs travel with
the workspace);
[ADR-168](168-typescript-6-baseline-and-workspace-script-architectural-rules.md)
— TypeScript 6 baseline and workspace script rules (workspace-internal
build discipline);
PDR-055 (CLI Affordance-Set Discipline for Coordination Tooling) — this
ADR is the host-repo operational application of PDR-055's built-CLI
discipline corollary.

## Context

The `agent-tools/` workspace ships a set of coordination CLIs:
`collaboration-state` (claims open/close/list/show), `commit-queue`
(intent enqueue/verify-staged/clear), `agent-identity` (display/preflight),
and `comms` (event new/render/list). These CLIs are invoked frequently
during multi-agent sessions.

The current invocation pattern in `package.json` scripts is shaped like:

```text
pnpm -s build && cd .. && node agent-tools/dist/src/bin/<cli>.js
```

The leading `pnpm -s build` rebuilds the workspace on _every_ invocation.
Under stable conditions this is harmless. Under in-flight tooling refactor
(when `agent-tools/src/` is being edited live by a developer or a
parallel agent), the rebuild produces _behavioural drift across a single
session_: a CLI invoked early in the session was built from one source
state; a CLI invoked later in the session was built from a _different_
source state. Identity preflights, claims operations, and commit-queue
state can produce inconsistent results across invocations within the
same session.

The 7-agent coordinator session of 2026-05-05 surfaced this directly:
identity drift between early and late CLI invocations under tooling
refactor pressure produced confusing state-routing behaviour.

The owner-stated cure: _"all agents use only the built agent tools, so
that development work can happen on them without causing this issue
again"_.

PDR-055 codifies this as part of the portable CLI affordance-set
discipline; this ADR is the host-repo operational application.

## Decision

Agent-tools CLIs are invoked via their **built dist artefact only**. The
build happens as a separate, explicit step — not as a side effect of
each invocation.

The implementation:

1. **Workspace `package.json` scripts** for CLI invocation drop the
   `pnpm -s build &&` prefix. They invoke the built artefact directly
   from `agent-tools/dist/src/bin/<cli>.js`.

2. **Build is a separate explicit step**: `pnpm --filter @oaknational/agent-tools build` is invoked on demand (after `agent-tools/src/`
   edits) or on a watch loop during agent-tools development work. CI
   builds the workspace as part of the standard build chain.

3. **A built artefact is required at invocation time**. If the dist
   directory is missing, the CLI's invocation fails with a clear error
   instructing the operator to run the build. The CLI does not silently
   rebuild.

4. **Agents use the published `pnpm agent-tools:*` command names**. They
   do not invoke `tsx agent-tools/src/...` directly, which would
   re-introduce the source-on-each-invocation drift.

This applies to every coordination CLI the workspace ships:
`agent-tools:collaboration-state`, `agent-tools:commit-queue`,
`agent-tools:agent-identity`, `agent-tools:comms`, and any analogous
future CLI.

## Consequences

**Required**:

- The root `package.json` `agent-tools:*` scripts and any internal
  workspace scripts that delegate to them invoke the built dist; they
  do not include `pnpm -s build` as a side effect.
- Agent-tools development workflows include an explicit build step or
  watch loop documented in the workspace README.
- CI build chain produces the dist before any test or lint that depends
  on the CLI behaviour.
- A missing dist produces a clear actionable error, not a silent
  rebuild.

**Forbidden**:

- Adding `pnpm -s build` (or equivalent) as a hidden side effect to
  CLI invocation scripts that agents call frequently.
- Documenting `tsx agent-tools/src/...` invocation patterns as the
  default. Source-mode invocation is for workspace-internal development
  only.

**Costs**:

- Operators must run a build after editing `agent-tools/src/` before
  the changes take effect. This is a one-time cognitive cost; the
  alternative (rebuild-on-each-invocation drift) is far costlier in
  multi-agent sessions.
- The agent-tools workspace owns documentation explaining the build
  step and the rationale.

## Verification

`grep -E 'pnpm.*build && .*node.*agent-tools.*dist' package.json` returns
empty after this ADR's change set lands. The CLI scripts invoke the
built artefact directly.

A staged tooling-refactor scenario test: edit `agent-tools/src/` to
change a behaviour, invoke the CLI without rebuilding, observe the
unchanged behaviour. Run `pnpm --filter @oaknational/agent-tools build`,
re-invoke the CLI, observe the new behaviour. The CLI's behaviour
matches the most-recent build, not the most-recent source.

## Source

This ADR is the host-repo operational application of PDR-055 (CLI
Affordance-Set Discipline). The substance of build-isolation discipline
is portable; the host-specific choice (drop the `pnpm -s build`
prefix from invocation scripts; require explicit build) is the
operational form. User-memory `feedback_use_built_agent_tools_only`
references this ADR.
