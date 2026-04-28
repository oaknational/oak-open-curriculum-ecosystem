# No Warning Toleration

Operationalises [`principles.md` §Code Quality](../directives/principles.md)
and [ADR-163 (Sentry release / commits / deploy linkage)](../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
§6/§7 (entry-point boundary discipline + non-deferrable-warnings amendment).

Pattern reference:
[`acknowledged-warnings-deferred-to-the-stage-they-explode-in`](../memory/active/napkin.md)
(2026-04-23 napkin entry, first hard instance).

## Rule

**Warnings are not deferrable. Anywhere. Ever.**

In every system this repository can influence — build pipelines,
quality gates, runtime instrumentation, monitoring, vendor SDK
plugins, lint, type-check, test runners, dependency-cruiser, CI,
pre-commit hooks, Vercel build output, Sentry runtime — a
**warning is the cheap, early version of the failure it names.**

If a system we control emits a warning, the rule is:

1. **Fix the root cause** in the same work-item that surfaced the
   warning. Do not log it for later. Do not move it to a TODO. Do
   not file a "verify in WI-N+1" note.
2. **If you cannot fix the root cause inside the current
   work-item**, escalate the system's strictness so the warning
   becomes a hard failure — i.e. raise it to error in the same
   commit. The hard failure is then handled the way every other
   blocking failure is handled: stop, fix, prove fixed, proceed.
3. **If a third-party system (vendor SDK, CI runner, hosting
   platform) emits a warning the repo cannot suppress at source**,
   capture it as a structured signal — Sentry breadcrumb tagged
   `vendor.warning`, OpenTelemetry log event with severity
   `WARN`, or CI annotation — and triage it during the next
   session. Recurring vendor warnings are a Sentry uptime/issue
   signal candidate, not background noise.

## Forbidden

- Acknowledging a warning in a thread record, plan, or commit
  message and proceeding without resolution.
- "Flagged for verification in the next work-item" framing for
  any warning whose explanatory text names a contract violation,
  missing export, missing config, or runtime invariant.
- Soft-matching warnings (e.g. `--quiet`, `--no-warnings`,
  `--warning=ignore`, `silent: true`, `printWarnings: false`)
  to suppress emission. The output of warnings is the diagnostic
  surface; suppressing it disables the diagnostic.
- Treating warnings as "less serious than errors" for triage
  ordering. They are equally blocking; the only legitimate
  hierarchy is *root-cause depth*, not severity label.

## Required

- Every build script and every quality-gate command MUST treat
  warnings as fatal at the boundary it owns. Concrete examples:
  - esbuild builds: `result.warnings.length === 0` assertion in
    the build script after the call returns.
  - tsc: `--noEmitOnError` is the floor; do not relax it.
  - ESLint: zero warnings — escalate any lingering warn-level
    rules to error-level in the workspace's eslint config.
  - vitest: `--reporter=verbose` shows warnings; CI must fail
    on any test that emits a `console.warn` call (test
    infrastructure assertion).
  - depcruise / knip / typedoc: zero warnings — escalate to
    error-level in their configs.
  - Sentry runtime: warnings emitted via `Sentry.captureMessage`
    at `warning` level or via `console.warn` MUST be visible
    in dashboard surfaces and routed to triage.
- Every monitoring surface MUST treat repeated warnings as a
  signal — Sentry Uptime monitor assertions, alert rules on
  `level:warning` events, and routine triage of the `warning`
  severity bucket alongside `error`.
- Every PR description that mentions "build successful" or
  "quality gates green" MUST be falsifiable: a warning surfaced
  by any gate but not blocking the gate is a falsification of
  that statement. Either the warning was wrongly downgraded, or
  the gate is not the real boundary the PR claims.

## Why this discipline exists

Recorded falsification: 2026-04-23, deployment
`dpl_71SfAcKiezKiXzmKMtpaUgVFxhWA`. Two esbuild warnings
(`Import "default" will always be undefined…`) surfaced at WI-6
build time, were acknowledged in the work-item record as
"flagged for verification in WI-7", and the next deploy crashed
on every request with `FUNCTION_INVOCATION_FAILED` at exactly
the contract boundary the warnings named (Vercel Express
adapter requires `default` export from the deployed module).
The build-log warning was the cheap version; the lambda crash
was the expensive version of the same diagnostic. The cost of
deferring was a broken preview, a 24-hour debug arc, and a full
canonical refactor. The cost of honouring the warning at WI-6
would have been a 30-minute fix.

The rule is named after the mechanism it counters:
acknowledging a diagnostic at exactly the right time and then
time-shifting it to the stage it explodes in.

## Scope discipline

The doctrine binds wherever a gate runs. The gate's scope is whatever
its configuration declares — for markdown, the set of paths NOT ignored
by [`.markdownlintignore`](../../.markdownlintignore); for esbuild, the
warnings the build emits at the configured strictness; for ESLint, the
files the configured `--ext`/`--ignore-pattern` cover; and so on.

Two rules follow:

1. **Narrowing the gate to dodge a warning is a doctrine violation.**
   Adding a path to an ignore-list, downgrading a rule to `warn`, or
   moving a check out of CI in order to make a warning go away is the
   same forbidden behaviour as suppressing the warning at source. The
   warning has not been resolved; the diagnostic surface has been
   disabled.
2. **Expanding the gate to cover a surface where the doctrine should
   bind is the normal way doctrine spreads.** Canon surfaces
   (`.agent/directives/`, `.agent/memory/`, `.agent/plans/`,
   `.agent/practice-context/`, `.agent/practice-core/`, `.agent/rules/`,
   `.agent/skills/`, `.agent/commands/`, `.agent/sub-agents/`, plus
   workspace source, configs, and shared infrastructure) belong inside
   each relevant gate by default. Reference / synthesis / archive /
   third-party / generated material stays outside until someone
   deliberately moves it in. A gate-config edit that expands scope is
   a doctrine-application act and is reviewed accordingly
   (config-reviewer during planning, code-reviewer after fixes land).

Concretely for markdown: `.markdownlintignore` is the canonical record
of the gate's footprint. `.agent/` is no longer blanket-ignored — the
file enumerates non-canon sub-folders explicitly so adding a new
canon-shaped folder lints automatically, while adding a new
reference-shaped folder requires an explicit ignore line and the
governance act that implies.

## Scope and exceptions

There are no exceptions to "fix or escalate". There is one
narrow exception to "fix in the same work-item": if the
diagnostic genuinely identifies a separate, larger lane of
work (e.g. a vendor SDK emits a deprecation warning naming an
API rotation that requires a multi-day migration), the
permitted response is:

1. Open an executable plan in `current/` with the migration
   scoped, named acceptance criteria, and a deadline tied to
   the deprecation horizon.
2. Escalate the warning to error in the same commit so the
   plan must land before the gate becomes unblocking. The plan
   IS the resolution; the warning has not been "deferred", it
   has been *converted to a blocking work-item with an owner
   and a deadline*.
3. Surface the plan link in the PR description that introduces
   the escalation.

This is the only legitimate shape; "I'll get to it" is not.

## Reviewer cadence

- `code-reviewer` enforces the rule on every PR that touches
  build scripts, quality-gate config, or vendor plugin
  integrations.
- `sentry-reviewer` enforces the monitoring half of the rule
  on every PR that touches Sentry init, uptime monitor config,
  alert rules, or breadcrumb policy.
- `release-readiness-reviewer` enforces the rule at PR-ready
  gate: any warning surfaced by any gate is an automatic
  no-go.

## Cross-references

- Pattern: `acknowledged-warnings-deferred-to-the-stage-they-explode-in`
  (napkin 2026-04-23, first hard instance; pattern file pending
  promotion at instance #2 per the existing pattern-bar).
- Adjacent: `passive-guidance-loses-to-artefact-gravity`
  (`patterns/passive-guidance-loses-to-artefact-gravity.md`) —
  why prose about warnings does not survive without an
  enforcement boundary; this rule supplies the enforcement.
- Adjacent: `inherited-framing-without-first-principles-check`
  — the inverse failure mode (acknowledging a diagnostic and
  then accepting an inherited convention as if it resolved the
  diagnostic). Both call for the same first-principles
  boundary check.
