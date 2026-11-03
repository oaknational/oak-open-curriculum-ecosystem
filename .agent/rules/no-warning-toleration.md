---
classification: core
description: Warnings are never tolerated, never deferred, never silenced — anywhere in any system the repo influences (build, quality gates, runtime, monitoring).
---

# No Warning Toleration

Operationalises [`principles.md` §Code Quality](../directives/principles.md)
and the owner ruling of 2026-09-12 for this repository: no errors and no
warnings of any kind, in any gate.

Pattern reference:
`acknowledged-warnings-deferred-to-the-stage-they-explode-in`
(2026-04-23 napkin entry, first hard instance).

## Rule

**Warnings are not deferrable. Anywhere. Ever.**

In every system this repository can influence — build pipelines,
quality gates, runtime instrumentation, monitoring, vendor SDK
plugins, lint, type-check, test runners, dependency-cruiser, CI,
pre-commit hooks, the hosting platform's build output, runtime logs — a
**warning is the cheap, early version of the failure it names.**

A signal is information about an architectural tension — before any
response, interrogate what produced it (a bug, a half-finished change, a
misplaced abstraction, a leaky boundary), and cross-check where else the
same shape appears un-flagged. For an analyser finding (Sonar, CodeQL)
there is no dismissal route, since the owner's 2026-09-08 ruling ("We
don't dismiss issues, we fix them"): the finding is cured at source under
the one-outcome rule in `docs/governance/sonar-disposition-policy.md`. The
single exception to cure-at-source is the CodeQL query `js/missing-rate-limiting`, excluded permanently by the
tracked `query-filters` entry in `.github/codeql/codeql-config.yml` (owner,
2026-09-17, verbatim: "a permanent exclusion is allowed, but ONLY for that
one issue"). ADR-219 is its ground: rate limiting is an edge concern, and
the MCP server's route registrations carry comments citing it. The exclusion
removes the query for every file the analysis scans, so a new HTTP route
anywhere raises no alert; ADR-219's edge rule, not the analyser, is the
control for it. No other query id or finding class is excluded, filtered or
dismissed by any route, and an agent never dismisses an alert. Where a warning from another
system can only be suppressed, suppress per site with rationale, never by
a rule-level disable — per-site forces a fresh interrogation when the
shape recurs.

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
   capture it as a structured signal — a CI annotation or a napkin
   entry naming the source — and triage it during the next session.
   Recurring vendor warnings are a dependency-currency signal, not
   background noise.

Any failed check is a real failure. No category of expected failure exists for a check or a
workflow job (the owner's direction): a check that is allowed to fail is repaired or removed.

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

## Problem-hiding patterns

Fix the problem named by a gate; do not silence the signal that names it.
An unused symbol is a useful entropy signal; suppressing it preserves the
entropy while removing the alarm. Two recurring unused-code patterns are
forbidden because they hide dead state:

- **`void <expr>` to silence unused-variable lint.** `void` discards a
  value in expression position, but the unused binding remains. If a
  destructure produces a value you do not need, restructure the code so
  the value is not produced; if a parameter is unused, remove it from the
  signature; if a returned value is unused, do not bind it.
- **Underscore-prefixing unused identifiers.** Renaming `foo` to `_foo` is
  not a TypeScript language feature; it is an ESLint convention that
  suppresses `@typescript-eslint/no-unused-vars`. The variable is still
  bound and the dead state is still present.

Both are instances of the broader rule: fix it or delete it. Adapters,
compatibility layers and half measures are problem-hiding patterns when
their purpose is to make old or dead shapes appear acceptable. Investigate
the root cause before choosing a cure: often the missing wiring is the bug
(use it), or the dead branch is the bug (remove it); where retention is
genuinely justified, document the explicit architectural tension (for
example conformance to a generated signature) rather than renaming. When
a reviewer, sub-agent or auto-fix suggests the underscore rename, push
back — the auto-fix is the wrong shape for this codebase.

Concrete cures: when a destructure-rest produces an unused capture, build
the fixture positively (set the omitted field to `undefined` if the type
permits, or construct a minimal valid fixture by hand) rather than adding
an `omitProperty` helper; when a framework signature forces an unused
position, first ask whether the function is at the wrong abstraction
layer — use the parameter, remove the position, or fix the layer, never
add a shim; when a value-bind exists only to satisfy a type checker, use
`satisfies` directly on the value. Existing `void <unused>` or `_foo`
usages are remediation candidates, not licence to add new ones.

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
- Every monitoring surface MUST treat repeated warnings as a
  signal — the hosting platform's build and runtime logs included — and route them
  to triage alongside errors.
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
its configuration declares — for markdown, the set of paths matched by
the `globs` and not excluded by the `ignores` in
[`.markdownlint-cli2.jsonc`](../../.markdownlint-cli2.jsonc); for esbuild, the
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
   `.agent/practice-core/`, `.agent/rules/`,
   `.agent/skills/`, `.agent/sub-agents/`, plus
   workspace source, configs, and shared infrastructure) belong inside
   each relevant gate by default. Reference / synthesis / archive /
   third-party / generated material stays outside until someone
   deliberately moves it in. A gate-config edit that expands scope is
   a doctrine-application act and is reviewed accordingly
   (config-expert during planning, code-expert after fixes land).

Concretely for markdown: `.markdownlint-cli2.jsonc` is the canonical
record of the gate's footprint — its `globs` declare what is linted
(including `.agent/**/*.md`, since cli2 walks dot-directories) and its
`ignores` enumerate the non-canon surfaces excluded. `.agent/` is not
blanket-ignored: a new canon-shaped folder under `.agent/` lints
automatically (matched by the glob, absent from `ignores`), while a new
reference-shaped folder requires an explicit `ignores` line and the
governance act that implies. Note the hard constraint recorded in that
file: an `ignores` entry must never begin with `!` or `#` — in
markdownlint-cli2 such an entry silently zeroes the whole run to a
false-green, so exclusions are expressed positively only.

The root Markdown gate lints tracked files only (`repo-check markdownlint-tracked`), so a gitignored
transient under `.agent/state/` can never block a push; lint scope follows the tracked surface,
never the filesystem glob (OCE friction F-103, settled 2026-09-27). The same holds for every
validator of an AUTHORED repository surface (Markdown, links, lint, docs): its universe is the
tracked tree (`git ls-files`), never a disk walk; a link validator that walked a gitignored
session directory refused commits on scratch copies (OCE F-295, 2026-10-02), so the lesson
written once for the Markdown gate binds each later such validator at its second consumer.
The clause binds; it does not describe every validator yet: in this estate the
fitness-vocabulary walker reads directories (`walk.ts`, `readdir`) and the Markdown-links
validator collects `**/*.md` by glob with the tracked set used for target checks only
(read 2026-10-03), so each is a cure owed under this clause, never a licence for the next
validator to walk the disk.
State-integrity validators of the live tier (collaboration state, the practice substrate's
instance JSON) read their untracked state by design (`important-state-not-in-temp-files`) and
are outside this clause.

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

A newly authored ESLint rule lands at `error`, with its existing
violations fixed in the landing that introduces it
([PDR-126](../practice-core/decision-records/PDR-126-gates-land-strict-in-one-landing.md):
gates land strict, in one landing). `warn` is not a staging level: every
ESLint script runs with `--max-warnings 0`, so a rule left at `warn` fails
lint the moment it fires.

## Reviewer cadence

- `code-expert` enforces the rule on every PR that touches
  build scripts, quality-gate config, or vendor plugin
  integrations.
- `release-readiness-expert` enforces the rule at PR-ready
  gate: any warning surfaced by any gate is an automatic
  no-go.

## Cross-references

- Pattern: `acknowledged-warnings-deferred-to-the-stage-they-explode-in`
  (napkin 2026-04-23, first hard instance; no pattern file yet — the
  napkin archive is the record. Graduation-eligible per PDR-100's
  single-instance bar; this rule already carries the doctrine, so the
  pattern file adds value only if the shape recurs outside warnings).
- Adjacent: `passive-guidance-loses-to-artefact-gravity`
  (`patterns/passive-guidance-loses-to-artefact-gravity.md`) —
  why prose about warnings does not survive without an
  enforcement boundary; this rule supplies the enforcement.
- Adjacent: `inherited-framing-without-first-principles-check`
  — the inverse failure mode (acknowledging a diagnostic and
  then accepting an inherited convention as if it resolved the
  diagnostic). Both call for the same first-principles
  boundary check.
