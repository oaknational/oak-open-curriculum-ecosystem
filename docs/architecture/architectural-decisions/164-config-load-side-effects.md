# ADR-164: Config-Load Side Effects Must Not Require Test-Execution Resources

**Status**: Accepted
**Date**: 2026-04-26
**Related**:
[ADR-078](078-dependency-injection-for-testability.md) — DI discipline,
the seam through which tests receive their inputs at execution time
(not at config-load time);
[ADR-161](161-network-free-pr-check-ci-boundary.md) — network-free
PR-check CI boundary, which this ADR reinforces by ensuring static
analysis tools can load configs without test-time resources;
[`apps/oak-search-cli/vitest.smoke.config.ts`](../../../apps/oak-search-cli/vitest.smoke.config.ts) —
canonical instance of the corrected pattern (commit `f4bf2fa1`).

## Context

Static analysis tools — `pnpm knip`, IDE indexing, `pnpm depcruise`,
`pnpm lint` — load test configuration files (`vitest.config.ts`,
`vitest.smoke.config.ts`, `eslint.config.mjs`, prettier configs, and
similar) to discover entry points, but they do **not** run the tests
those configs describe. The configs are evaluated as JavaScript
modules during static analysis; whatever that evaluation does at module
load is performed by the static-analysis tool, regardless of whether
any test will ever execute.

A vitest config that calls `process.env.ELASTICSEARCH_URL` at module
load and throws when the value is missing is a config-load side
effect with a test-execution-time dependency. The side effect breaks
static analysis even when the tests it describes are correctly
excluded from CI runs:

- `pnpm knip` fails to discover entry points because the config
  module crashes at load.
- IDE indexing produces incomplete results.
- `pnpm depcruise` reports false orphans because the config-driven
  entry-point set is not built.
- The CI test job is unaffected because the test-execution path
  is the only correct path that runs the validation.

Empirical instance: `apps/oak-search-cli/vitest.smoke.config.ts`
threw at module load when `ELASTICSEARCH_URL` and related env vars
were missing. The config was correctly excluded from CI test runs
(no Elasticsearch instance in PR-check CI per ADR-161), but `pnpm
knip` failed all day because it loaded the config to discover entry
points. The fix landed in commit `f4bf2fa1` and the surrounding
diagnostic work is the canonical reference instance.

The discipline applies symmetrically across every tool config that
performs work at module-evaluation time: vitest configs, ESLint flat
configs (`eslint.config.mjs`), Prettier configs, depcruise configs,
and any other tool config in the repo's monorepo workspaces.

## Decision

**Test-time credential and environment validation MUST defer to the
config's `setupFiles` (or equivalent execution-time hook), never run
at module-evaluation time.** The validation IS still required at
test execution time; it just MUST NOT execute when the config module
is merely loaded.

Three implementation rules follow:

1. **No `process.env` reads at config top-level** that throw on
   missing values. Reading values is fine; throwing is not. If a
   value is missing, propagate the absence into a defaulted
   value or a flag the setup file consumes.

2. **`provide` block is the channel for setup-file validation**.
   When a config needs to declare a missing-credential signal that
   `setupFiles` should re-check and throw on, propagate the message
   via the `provide` block rather than throwing at module load. The
   setup file then re-checks and throws with a clear message at the
   point where the test is actually about to use the credential.

3. **Symmetric application**. Every tool config in the monorepo
   that does work at module-evaluation time MUST follow the same
   discipline — including ESLint flat configs, Prettier configs,
   and any future tool config that performs work at module load.

A tool's reachability for static analysis is a load-bearing CI
property; breaking it on test-time credentials breaks the discipline
named in ADR-161 (network-free PR-check CI boundary) at the
config-evaluation layer.

## Consequences

### Positive

- `pnpm knip`, `pnpm depcruise`, IDE indexing, and `pnpm lint` all
  succeed regardless of whether test-time credentials are populated
  in the current shell.
- Configs are loadable in any environment that runs static analysis
  (developer workstation, CI, sandbox, security review).
- Setup-file validation still produces clear errors at the point
  where the test is about to use the missing value, with a stack
  frame that names the actual test rather than the config-load.

### Negative

- A small additional indirection: validation logic that "feels like
  it belongs in the config" gets routed through `provide`. This is
  acceptable cost for the static-analysis property.
- Reviewers and authors of new config files MUST remember the
  discipline; a custom ESLint rule banning `throw` at config-module
  top level would mechanise this. Tracked under a future
  recurrence-prevention plan.

### Neutral

- Test-execution behaviour is unchanged: tests that need
  credentials still fail clearly when those credentials are
  missing.
- The discipline is "no throw at config load" not "no validation at
  config load". Configs may still validate values they read; they
  just must not crash on absence.

## Alternatives Rejected

- **Validate at config load, accept the static-analysis breakage**
  — produces silent CI degradation for non-test tasks. Static
  analysis is part of the test pyramid (ADR-161) and breaking it
  to validate test credentials is a layering violation.
- **Wrap config bodies in try/catch** — mutes the validation
  signal and lets configs load with broken state. The setup-file
  pattern is the cleaner shape: validation is deferred, not
  suppressed.
- **Single config-loader script that handles env missingness** —
  centralises an implementation detail across configs that have
  different shapes; the per-config `provide` channel is more
  composable.

## Notes

This ADR captures a discipline that emerged from a specific incident
on `apps/oak-search-cli/vitest.smoke.config.ts` (commit `f4bf2fa1`).
Future tool config additions in this repo should be reviewed against
this ADR before landing.

The discipline is **repo-specific** in its toolchain choices
(vitest, ESLint flat configs, depcruise, knip) and is therefore an
ADR rather than a PDR. Other repos with different toolchains apply
the same underlying principle but to different config surfaces.
