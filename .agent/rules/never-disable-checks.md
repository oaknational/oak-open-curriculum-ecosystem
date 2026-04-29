# Never Disable Checks

Operationalises [`principles.md` §Code Quality](../directives/principles.md#code-quality)
"NEVER disable checks" rule. Anti-pattern named:
**`gate-off-fix-gate-on`**.

## Rule

**Quality gates are NEVER disabled. Not temporarily, not as a tactic,
not "while we work on it." Problems are fixed at source with every
gate in its full configured state — or, when scope genuinely justifies
it, the work is escalated to a dedicated plan that owns the fix while
the gate remains active and blocking.**

The forbidden shape: turn the gate off, do the work, turn the gate
back on. This is the `gate-off-fix-gate-on` anti-pattern. It surfaces
in many disguises:

- "Set the rule to `warn` while we triage; we'll set it back to
  `error` when done."
- "Add `eslint-disable` here so we can land the bigger refactor;
  we'll remove it in a follow-up."
- "Add this path to `.markdownlintignore` for now."
- "Skip this test until we figure out why it's flaky."
- "`@ts-expect-error` until the type-flow upstream is fixed."
- "Use `--no-verify` once to land this; the hook can pick it up
  later."
- "Disable the failing CI step temporarily; re-enable after merge."

All have the same shape: the gate is the cheap, early version of the
failure it names; disabling the gate moves the failure into a more
expensive surface (production bug, broken preview, accumulated debt
that compounds, future contributors inheriting a misleading "green"
state). The gate-off-fix-gate-on framing is itself the failure — it
treats the gate as friction rather than as a question about repo
state.

## Forbidden tactics

- **Setting a rule severity to `warn`** when the gate's vocabulary
  includes `error` (per [`no-warning-toleration.md`](no-warning-toleration.md),
  warnings are not deferrable; downgrading to `warn` is suppression
  with extra steps).
- **Adding `eslint-disable` / `eslint-disable-next-line`** to
  silence a rule. The
  [`no-eslint-disable`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/eslint-rules/eslint-rules/lib/rules/no-eslint-disable.ts)
  rule already enforces this; the rule itself must never be exempted.
- **Adding `// @ts-expect-error` / `// @ts-ignore`** to bypass a
  type error. Fix the type flow upstream — see
  [type-reviewer](../sub-agents/type-reviewer.md) and the schema-first
  doctrine.
- **Adding a path to `.markdownlintignore`, `.eslintignore`, or any
  ignore list** to dodge a finding. Per
  [`no-warning-toleration.md`](no-warning-toleration.md) §Scope
  discipline: narrowing the gate to dodge a warning is a doctrine
  violation. Expanding the gate is the normal way doctrine spreads.
- **Skipping a test** with `it.skip`, `describe.skip`, `test.todo`,
  or `xit`. Either the test proves something and runs, or it does
  not exist. See [`testing-strategy.md`](../directives/testing-strategy.md).
- **Using `--no-verify`** without fresh per-invocation owner
  authorisation. See
  [`no-verify-requires-fresh-authorisation.md`](no-verify-requires-fresh-authorisation.md).
- **Stubbing global state in tests** (`vi.stubGlobal`, `vi.mock`,
  process.env mutation). See `testing-strategy.md`.
- **Disabling a CI step** in `.github/workflows/*.yml` to land work.
  Either the step is wrong (fix the step) or the work needs to pass
  the step (fix the work) — there is no third option.
- **Removing a quality gate from the local pre-commit chain**
  because it slows down iteration. The pre-commit chain is the
  cheap version of CI; bypassing it pushes the failure to the
  expensive version.
- **"Quality gate hardening" plans that begin by disabling the
  gates they intend to harden.** The right shape is: the gate is
  on, the team fixes findings under it; the plan tracks the
  remediation work, not a gate-off period.

## Required tactics (when a gate is failing on inherited debt)

When a gate fires on a backlog of pre-existing debt the current
work-item cannot fully clear, the legitimate response is **escalate
the gate, not disable it.** Two shapes:

1. **Same-commit escalation** — fix what you can, escalate the
   remaining warnings to errors in the same commit so the next
   contributor cannot accidentally re-introduce the same shape.
   See `no-warning-toleration.md` §"Required" — every gate's
   strictness boundary is owned by the gate's config; raising it is
   how the gate hardens.

2. **Dedicated remediation plan with the gate still on** — open an
   executable plan in `current/` with the migration scoped, named
   acceptance criteria, owner-assigned, and a deadline. The gate
   stays on; the plan IS the resolution. The plan cannot include a
   "phase 0: disable gate" step. If the gate is currently failing
   and the work cannot land while it fails, then **the plan IS the
   work that must land first** — it is not a parallel track that
   unblocks other work by disabling the gate.

3. **Never "gate-off, fix, gate-on" as a sequenced phase plan.**
   This shape was a candidate pattern in the Pending-Graduations
   Register; it is now formally rejected as an anti-pattern. A plan
   whose phase 0 turns a gate off, phase N fixes findings, and phase
   N+1 turns it back on is the anti-pattern's exact phenotype. The
   gate stays on throughout; if the gate is producing too many
   findings to address in one work-item, sequence the work itself
   (one finding at a time, one commit at a time, gate green at each
   step), but never sequence the gate.

## Definition of "check" / "gate"

For this rule, a check or gate is any of:

- A lint rule (ESLint, Prettier, markdownlint, custom eslint-rules).
- A type-checker invocation (`tsc`, `pnpm type-check`).
- A test in any test suite (`pnpm test`, `pnpm test:e2e`,
  `pnpm test:widget`, `pnpm test:a11y`, etc.).
- A static analysis tool (knip, depcruise, Sonar, CodeQL).
- A pre-commit hook (`.husky/`, `.claude/hooks/`,
  `pre-tool-use` / `post-tool-use` agentic hooks).
- A CI step (any job in `.github/workflows/*.yml`).
- A build assertion (`esbuild` warnings count, `tsc --noEmitOnError`,
  etc.).
- A practice-fitness threshold (`pnpm practice:fitness`).
- A schema validation step (Zod, JSON-schema, OpenAPI codegen
  output validation).
- A monitoring / observability assertion (Sentry uptime checks,
  Sentry release boundary, CI deployment-validation steps).

If it produces a pass/fail signal, it is a gate, and the rule applies.

## Why this discipline exists

Gates are the cheap version of failures. Disabling a gate moves the
failure to the expensive version. The
[`no-warning-toleration.md`](no-warning-toleration.md) rule's recorded
falsification (2026-04-23 esbuild warnings → next-deploy lambda
crash, 24-hour debug arc, full canonical refactor) is one instance.
The same shape recurs at every gate surface: the cost of honouring
the diagnostic in real time is small; the cost of deferring it
through gate-disablement compounds.

The `gate-off-fix-gate-on` anti-pattern is the same shape at
plan-scale: a plan that schedules the gate to be off for some
interval is scheduling diagnostic blindness for that interval. Any
debt accruing during the interval lands silently; any new
contribution made under the disabled gate inherits a misleading
"green" state. Even when the plan succeeds at re-enabling the gate,
it has produced a window of debt that the gate cannot retroactively
catch unless the team re-runs the gate against every change made
during the window — which they will not.

## Reviewer cadence

- `code-reviewer` enforces the rule on every PR.
- `config-reviewer` enforces the rule on every PR that touches
  ESLint, Prettier, vitest, tsconfig, husky, or CI workflow
  configuration. A config diff that weakens any check (rule
  severity, ignore-list growth, test-file exclusion, hook
  removal) is a hard reject.
- `release-readiness-reviewer` enforces the rule at PR-ready gate.
- `architecture-reviewer-fred` (principles-first) enforces the rule
  on any architectural decision that proposes a gate-off-fix-gate-on
  shape.

## Cross-references

- Authority: [`principles.md` §Code Quality](../directives/principles.md#code-quality)
  — "NEVER disable checks", "Never work around checks", "Never
  weaken a gate to solve a testing problem".
- Sibling rule: [`no-warning-toleration.md`](no-warning-toleration.md)
  — warnings are not deferrable; same shape at warning severity.
- Sibling rule: [`no-verify-requires-fresh-authorisation.md`](no-verify-requires-fresh-authorisation.md)
  — gate skipping requires fresh per-invocation owner authorisation.
- Sibling rule: [`dont-break-build-without-fix-plan.md`](dont-break-build-without-fix-plan.md)
  — broken builds are first-priority work, not deferrable.
- Adjacent pattern: [`tool-error-as-question.md`](../memory/active/patterns/tool-error-as-question.md)
  — the meta-pattern. A failing gate is a question being asked; the
  forbidden response is to silence the question.
- Adjacent pattern: [`hook-as-question-not-obstacle.md`](../memory/active/patterns/hook-as-question-not-obstacle.md)
  — instance pattern at the pre-commit-hook surface.
