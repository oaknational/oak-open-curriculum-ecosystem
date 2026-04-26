# Don't Break the Build Without a Fix Plan

Operationalises the green-gate invariant from
[`gate-recovery-cadence.plan.md`](../plans/observability/active/gate-recovery-cadence.plan.md)
for the cross-agent context introduced by
[`agent-collaboration.md`](../directives/agent-collaboration.md).

## Authority (verbatim)

From `gate-recovery-cadence.plan.md` `## Intent`:

> Restore the invariant that build, type-check, lint, format, markdown,
> depcruise, knip, and static checks stay green even during TDD. RED is
> allowed only as intentional failing behavioural tests, not as missing
> imports, broken types, lint warnings, or build failures.

The procedural application lives in `## Recovery Sequence` point 2 of the
same plan ("Make non-test gates green first"): replace missing-symbol
failures with typed minimal seams that compile and fail behaviourally.

## Rule

**Do not commit, push, or leave the working tree in a state that breaks
build/type-check/lint/format/markdownlint/depcruise/knip without a named,
in-flight fix plan owned by you in the current session.**

In a single-agent context this is a personal-discipline rule. In the
multi-agent context introduced by `agent-collaboration.md`, breaking the
build couples a local quality issue into a *coupling failure across
parallel agent sessions*: another agent's pristine staged work depends
on the same gates passing on the same working tree.

## What "fix plan" means

- A named workstream / TDD slice you are actively working through;
- Recoverable in the current session — not a "I'll get to it" deferral;
- Surfaced to other agents through the shared communication log
  (`.agent/state/collaboration/shared-comms-log.md`) when the breakage will outlive
  the immediate edit;
- Aligned with the gate-recovery-cadence plan's recovery sequence: typed
  seams that compile and fail behaviourally, not missing-symbol REDs.

## What is forbidden

- Missing-import REDs that break type-check or build at the working-tree
  level;
- Lint or markdownlint warnings left in place because "tests still pass";
- Disabling a gate (eslint-disable, `--no-verify`, `--quiet`) to make a
  warning go away (cross-cutting:
  [`no-warning-toleration.md`](no-warning-toleration.md));
- Leaving a partial-state intermediate where two parallel agents'
  pre-commit hooks both fail because of one agent's WIP.

## Cross-references

- Authority surface:
  [`gate-recovery-cadence.plan.md`](../plans/observability/active/gate-recovery-cadence.plan.md)
  `## Intent` and `## Recovery Sequence` point 2.
- Adjacent doctrine:
  [`no-warning-toleration.md`](no-warning-toleration.md) — warnings are
  not deferrable.
- Containing directive:
  [`agent-collaboration.md`](../directives/agent-collaboration.md) §Scope
  Discipline Across Agent Boundaries.
- Operational pattern: `parallel-track-pre-commit-gate-coupling` —
  founding instances recorded in
  [`.agent/memory/active/napkin.md`](../memory/active/napkin.md)
  under the 2026-04-24 and 2026-04-25 entries; pattern file pending
  graduation at WS2 of the multi-agent collaboration protocol.

## Bidirectional reference

The authority plan
[`gate-recovery-cadence.plan.md`](../plans/observability/active/gate-recovery-cadence.plan.md)
cites this rule as the cross-agent operationalisation. The bidirectional
reference is validated at consolidation time per
[`consolidate-docs.md`](../commands/consolidate-docs.md).
