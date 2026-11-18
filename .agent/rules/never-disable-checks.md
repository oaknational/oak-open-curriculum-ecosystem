---
classification: core
description: Quality gates are NEVER disabled. The gate-off-fix-gate-on sequence is a named anti-pattern. Sequence the work, not the gate.
---

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

This rule binds the **agent** absolutely. The **owner** may change
gate policy by a recorded standing ruling — named session class,
substitute gates carrying every check at the original gate's scope,
and a reopen condition — per PDR-025 §Gate binding and policy
authority (the single home of that authority model). Within a
recorded ruling's exact scope the ruling is the governing policy;
everywhere else this rule stands unchanged, and an agent never
initiates, proposes, or widens such a ruling.

The forbidden shape: turn the gate off, do the work, turn the gate
back on. This is the `gate-off-fix-gate-on` anti-pattern. It surfaces
in many disguises:

- "Set the rule to `warn` while we triage; we'll set it back to
  `error` when done."
- "Add `eslint-disable` here so we can land the bigger refactor;
  we'll remove it in a follow-up."
- "Add this path to `.markdownlint-cli2.jsonc` `ignores` for now."
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
  silence a rule. The estate's ESLint plugin's `no-eslint-disable`
  rule already enforces this; the rule itself must never be exempted.
- **Adding `// @ts-expect-error` / `// @ts-ignore`** to bypass a
  type error. Fix the type flow upstream — see
  [type-expert](../sub-agents/templates/type-expert.md) and the schema-first
  doctrine.
- **Adding a path to `.markdownlint-cli2.jsonc` `ignores`, `.eslintignore`,
  or any ignore list** to dodge a finding. Per
  [`no-warning-toleration.md`](no-warning-toleration.md) §Scope
  discipline: narrowing the gate to dodge a warning is a doctrine
  violation. Expanding the gate is the normal way doctrine spreads.
- **Skipping or conditioning a test** with `it.skip`,
  `describe.skip`, `test.todo`, `it.todo`, `xit`, `xdescribe`,
  `it.skipIf`, `describe.skipIf`, `it.runIf`, `describe.runIf`,
  conditional `it`/`describe` registration, or runtime if-gating
  inside a test body. Either the test proves something and runs
  deterministically, or it does not exist. See
  [`testing-strategy.md`](../directives/testing-strategy.md) and
  [`no-conditional-tests.md`](no-conditional-tests.md).
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

Lengthening a test's time budget so a slow test passes is a disabled check: "Raising the timeout to
make it pass is disabling the check and is refused"; the cure is the algorithm or "a structural
assertion (the pass count, or an input size that proves linearity by ratio on two sizes with a
generous bound), not a longer `testTimeout`" (a Director's ruling, 2026-09-10, event b3057b7a).

## Required tactics (when a gate is failing on inherited debt)

When a gate fires on a backlog of pre-existing debt the current
work-item cannot fully clear, the legitimate response is **escalate
the gate, not disable it.** Three shapes:

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

The same discipline applies in reverse on **finding a gate already
masked** — a `passWithNoTests: true` hiding empty suites, a skipped
test, an ignore-list entry concealing findings. Removing the mask and
fixing what it hid are ONE work-item, never "remove now, fill later",
and never a deferral candidate on scope or ship-independence grounds:
the governing principle for a masking override is
[`no-warning-toleration.md`](no-warning-toleration.md), not scope
discipline.

## Configuring a check to express the architecture is not disabling it

When a check flags a legitimate design as a violation — an ESLint boundary
rule, a tier matrix, a config gate — hold two hypotheses, never one: (a)
the design is wrong; (b) the check's configuration is wrong for this case.
Test the configuration against the actual architectural intent (the ADRs,
the tier's purpose) before choosing. The current config is a hypothesis
about the right design, never the verdict — blindly obeying it is the same
failure class as treating precedent as correctness. Worked instance
(2026-07-08): the lib-tier boundary rule ("an adapter must not depend on
another adapter") was read as immutable, so a framework was judged unable
to consume the Sentry-backed logging adapter and an injection workaround was
proposed; the owner corrected that apps taking adapters backed by services
IS the intended architecture — "I wonder if you took the current eslint
boundary rules and tried to obey them rather than configure them
appropriately." Reconfiguring a rule so it permits a legitimate dependency
and still fires on real violations is correct and is not a disable; an
`eslint-disable`, a skip, or a workaround designed around a wrong
configuration is the forbidden shape.

## A warranted exemption is an alarm bell, never a resting state

Owner, 2026-08-11, on a dependency-cruiser exemption for a `libs` to `sdks`
import: "warranted exemption is a huge alarm bell, either we need to change
policy, or fix the problem. Strict, everywhere, all the time, is not for
fun, it is for survival of a complex system in the face of entropy and
time." And in the same message: "if things are at error they need fixing."
On 2026-09-29, of a local-cache environment a seat set so that one commit
passed a lint step: "we don't do workarounds, we fix problems"; the
environment was withdrawn and the cure went to the step that consulted the
remote cache (one instance).
An exemption inside an enforcement configuration (a `pathNot`, an eslint
disable, a census row, an allowlist entry) is a bypass surface where entropy
compounds silently while the gate reads green; a dated warrant makes it
legible, not acceptable, and "warranted and routed" is a queue entry, never
a disposition. The moment an exemption enters any gate it is a live work
item with exactly two exits, fix the violation or change the policy at its
owning level; route the fork immediately with a clock, and the exemption
dies in the cure PR. Never present a warranted exemption to the owner as a
settled state. The vocabulary is part of the alarm: "standing cure",
"standing workaround", "honest bypass" and "live with it for now" are
the acceptance-shaped euphemisms `no-hedging-vocabulary` bans, and their
harm is memetic (owner, 2026-08-12: "once those cognitive shapes are in the
team they will propagate to other decisions"); a mitigation is lawful only
spoken with its owning ticket and retirement condition in the same breath.

## Definition of "check" / "gate"

For this rule, a check or gate is any of:

- A lint rule (ESLint, Prettier, markdownlint, custom eslint-rules).
- A type-checker invocation (`tsc`, `pnpm type-check`).
- A test in any test suite (`pnpm test`, the end-to-end checks, the
  host's rendering-proof instrument, etc.).
- A static analysis tool (knip, depcruise, Sonar, CodeQL).
- A pre-commit hook (`.husky/`, `.claude/hooks/`,
  `pre-tool-use` / `post-tool-use` agentic hooks).
- A CI step (any job in `.github/workflows/*.yml`).
- A build assertion (`esbuild` warnings count, `tsc --noEmitOnError`,
  etc.).
- A practice-fitness threshold (`pnpm practice:fitness`).
- A schema validation step (Zod, JSON-schema, OpenAPI codegen
  output validation).
- A monitoring / observability assertion (uptime checks, CI
  deployment-validation steps).

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

- `code-expert` enforces the rule on every PR.
- `config-expert` enforces the rule on every PR that touches
  ESLint, Prettier, vitest, tsconfig, husky, or CI workflow
  configuration. A config diff that weakens any check (rule
  severity, ignore-list growth, test-file exclusion, hook
  removal) is a hard reject. The same hard reject covers the
  LANDING-time shape: a NEW gate arriving at `warn`, or arriving
  with a violation-allowlist / grandfather inventory, violates
  PDR-126 (gates land strict, in one landing) — a new rule is not
  a "weakening" diff, so this clause names it explicitly.
- `release-readiness-expert` enforces the rule at PR-ready gate.
- `assumptions-expert` enforces the rule on any plan or proposal
  that schedules a gate-off-fix-gate-on shape.

## Cross-references

- Authority: [`principles.md` §Code Quality](../directives/principles.md#code-quality)
  — "NEVER disable checks", "Never work around checks", "Never
  weaken a gate to solve a testing problem".
- Sibling rule: [`no-warning-toleration.md`](no-warning-toleration.md)
  — warnings are not deferrable; same shape at warning severity.
- Landing-time complement:
  [PDR-126](../practice-core/decision-records/PDR-126-gates-land-strict-in-one-landing.md)
  — this rule governs gates once live; PDR-126 governs how they arrive
  (at error, with conformance, in one landing).
- Sibling rule: [`no-verify-requires-fresh-authorisation.md`](no-verify-requires-fresh-authorisation.md)
  — gate skipping requires fresh per-invocation owner authorisation.
- Sibling rule: [`dont-break-build-without-fix-plan.md`](dont-break-build-without-fix-plan.md)
  — broken builds are first-priority work, not deferrable.
- Adjacent pattern: `tool-error-as-question.md`
  — the meta-pattern. A failing gate is a question being asked; the
  forbidden response is to silence the question.
- Adjacent pattern: `hook-as-question-not-obstacle.md`
  — instance pattern at the pre-commit-hook surface.
