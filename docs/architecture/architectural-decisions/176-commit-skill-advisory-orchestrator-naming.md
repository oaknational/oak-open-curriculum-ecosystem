# ADR-176: Commit-Skill Advisory Orchestrator — Naming and Surface Polarity

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[ADR-118](118-commit-skill-as-canonical-pre-commit-flow.md) — commit skill
as canonical pre-commit flow;
[ADR-144](144-fitness-vocabulary-three-zone.md) — three-zone fitness
vocabulary consistency;
PDR-053 (Orchestrator-vs-Gate Structural Cure) — this ADR is the host-repo
operational application of PDR-053's three-surface polarity discipline.

## Context

The repo carries two distinct enforcement surfaces in the commit flow,
sharing configuration and vocabulary but with fundamentally different
authority:

1. The **agent-invoked orchestrator** exposed as
   `pnpm agent-tools:check-commit-skill-advisories` — runs the commit skill's
   pre-`git commit` discipline checks: `practice:fitness:strict-hard`,
   `practice:vocabulary`, and `pnpm agent-tools:check-commit-message`. It is
   _advisory_. Its non-zero exit is information to read and route, not a
   commit verdict.
2. The **git-invoked blocking hook chain** at `.husky/pre-commit` — runs
   format, markdownlint, lint, type-check, depcruise, knip, test (per the
   live `.husky/pre-commit` body). It is _blocking_. Its non-zero exit is
   the commit verdict. Notably, `practice:fitness:strict-hard` is in the
   advisory orchestrator but is NOT in the blocking hook chain.

In the 2026-05-05 evidence corpus, five distinct agent sessions in a
single 24-hour window conflated the two surfaces — agents under failure
pressure rounded the orchestrator's identity into the blocking hook
chain's identity (the `gates` token in the filename pulled the
rounded-off whole back into place). The conflation produced bypass
framings (`--no-verify` proposals, doctrinal-collision constructions)
that the substance did not require.

PDR-053 codifies the structural cure: encode the advisory polarity at
three surfaces (filename, banner, skill-doctrine) so the polarity is
impossible to round off under context pressure.

## Decision

Apply PDR-053's three-surface polarity cure to this repo's commit-skill
advisory orchestrator:

1. **Command naming**. Expose the orchestrator as
   `pnpm agent-tools:check-commit-skill-advisories` with its implementation
   owned by the `agent-tools` workspace. The command token "advisories" names
   the polarity directly.

2. **Exported API**. Rename the orchestrator's exported function
   `runCommitSkillGates` → `runCommitSkillAdvisories` and the result
   types correspondingly (`CommitSkillGatesResult` →
   `CommitSkillAdvisoriesResult`). API renames preserve the polarity
   signal across importers and TypeScript symbol-search.

3. **Banner**. The orchestrator prints
   `[ADVISORY ONLY — NOT A COMMIT GATE]` at the top of every invocation
   before any other output. Under failure pressure the banner is read
   before any rounding-off can fire.

4. **Skill-doctrine**. The commit skill's `SKILL-CANONICAL.md` is updated
   to (a) name the advisory orchestrator's advisory polarity in the same
   paragraph that names the blocking hook chain, (b) enumerate the actual
   commands in `.husky/pre-commit`, and (c) name explicitly that
   `practice:fitness:strict-hard` is an advisory check, NOT in the
   blocking chain.

A non-zero advisory orchestrator exit is **never** licence to propose
`--no-verify`, construct a doctrinal-collision framing, or reshape the
commit. Per
[`no-verify-requires-fresh-authorisation`](../../.agent/rules/no-verify-requires-fresh-authorisation.md),
`--no-verify` is owner-initiated only.

## Consequences

**Required**:

- The rename is a single coordinated change set: filename, test file,
  internal function name, exported types, banner output, and all
  references in `SKILL-CANONICAL.md` and active plans.
- Historical references in archived napkins, experience files,
  pending-graduations archive, and shared-comms-log archive PRESERVE
  the historical filename — they record what was at the time. Live
  references update.
- New advisory enforcement surfaces in this repo MUST follow the
  three-surface polarity shape by default.

**Forbidden**:

- Reverting any of the three surfaces. The single-surface cure is the
  failure mode this ADR closes.
- Adding gate-coded vocabulary to advisory enforcement surfaces in
  this repo (`gates`, `pre-commit-validation`, `commit-skill-checks`
  in advisory contexts).

## Verification

`rg "check-commit-skill-gates" .agent/skills .agent/plans .claude
agent-tools docs` returns only archived / historical hits after this ADR's
change set lands. Live references are all to
`pnpm agent-tools:check-commit-skill-advisories`.

The unit test (`agent-tools/scripts/check-commit-skill-advisories.unit.test.ts`)
asserts the orchestrator's behaviour under the new symbol names.

## Source

This ADR is the host-repo operational application of PDR-053
(Orchestrator-vs-Gate Structural Cure). The substance is portable
(any Practice-bearing repo with a similar two-surface commit flow);
the host-specific filenames and command list are encoded here.
