# ADR-161: Network-Free PR-Check CI Boundary

**Status**: Accepted (2026-04-17)
**Date**: 2026-04-17
**Related**: [ADR-078](078-dependency-injection-for-testability.md) — the DI
discipline that makes in-process tests deterministic;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) —
coherent structured fan-out for observability, including the redaction
barrier that vendor-network CLIs would bypass if invoked in PR checks;
[ADR-159](159-per-workspace-vendor-cli-ownership.md) — per-workspace
vendor CLI ownership and repo-tracked configuration;
[`.agent/directives/testing-strategy.md`](../../../.agent/directives/testing-strategy.md) — the testing taxonomy this
ADR operationalises at the pipeline level.

## Context

Oak runs several distinct pipelines that each have different side-effect
tolerances. The current testing taxonomy names the tests (unit,
integration, E2E, smoke) but does not explicitly name which **pipelines**
may produce which side effects. As a result, when a new capability is
added (for example, `sentry-cli releases set-commits` for the Sentry
maximisation work, or an analogous `clerk` CLI invocation for the
planned Clerk CLI adoption), the natural question "where does this
run?" is answered ad-hoc each time.

Concretely, the outgoing `sentry-observability-maximisation-mcp.plan.md`
proposed adding `sentry-cli releases set-commits` and
`sentry-cli releases deploys new` into the scope. The first draft
implicitly assumed these might run as part of CI. The owner corrected:
GitHub Actions PR checks must not make real network calls. That
correction is correct and generalises beyond Sentry, but the
generalisation has no recorded home.

Without an ADR, the rule can drift:

- A new vendor CLI adoption can introduce a PR-check network call under
  the rationale "it's just a one-off API call, it's fine."
- A test may be placed at the wrong level (E2E vs smoke) for the IO it
  actually does.
- CI reliability can degrade silently — a vendor outage breaks PR
  gating for reasons unrelated to code quality.

Vendor CLIs on the current and near-term horizon:

- `sentry-cli` (source-map upload, release linkage, deploy
  registration, event send).
- `clerk` CLI (per `future/clerk-cli-adoption.plan.md`).
- Future Elasticsearch management CLIs (per `search-observability.plan.md`).

Each one will re-raise the same question unless the rule is captured.

## Decision

**PR-check CI is network-free. Deploy-pipeline CI is network-capable.
Smoke tests are on-demand with full IO. E2E tests run in-process with
stdio IO only, never network.**

In pipeline terms:

| Pipeline                                              | What runs                                                                                                      | Network calls permitted?                                                                                                 |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| GitHub Actions PR / push checks                       | `pnpm check` → unit + integration tests + type-check + lint + format + knip + depcruise + build + fitness gate | **No.** Unit + integration tests are in-process, no IO. No vendor CLI invocations.                                       |
| GitHub Actions PR / push checks                       | E2E tests (`*.e2e.test.ts`) when run by the PR-check workflow                                                  | **No** (stdio IO only, per testing-strategy.md).                                                                         |
| Vercel deploy pipeline (predeploy / postdeploy hooks) | Source-map upload, release-commit linkage, deploy registration, any operational vendor-CLI invocation          | **Yes.** This is the correct home for deploy-time network side effects. Secrets supplied via Vercel project environment. |
| Smoke tests (`smoke:*` scripts)                       | A fully running local or deployed system, all IO types                                                         | **Yes**, explicitly triggered by a human or a scheduled workflow that is NOT the PR-check path.                          |
| Local operator-initiated scripts                      | Evidence generation, debugging, one-off vendor-CLI invocations                                                 | **Yes**, operator context.                                                                                               |

Consequences:

1. Any `sentry-cli`, `clerk`, or analogous vendor CLI invocation that
   reaches the network MUST run in the Vercel deploy pipeline, a smoke
   test, or a local operator context — **never** in a PR-check
   GitHub Actions workflow.
2. Any test that would need to reach the network to prove its claim
   MUST be named `*.smoke.*` (or similar on-demand discriminant) and
   MUST NOT be wired into the PR-check workflow's test runs.
3. An E2E test (`*.e2e.test.ts`) that reaches the network is a
   category error: it is a smoke test wearing the wrong name, and
   either the test moves to smoke or the network reach is mocked at
   the E2E seam. This is the correct reading of
   `testing-strategy.md`'s "E2E tests CAN trigger STDIO IO but NOT
   filesystem or network IO" clause.
4. CI workflow files (`.github/workflows/*.yml`) are themselves
   subject to this rule. A code review or a lint rule that greps for
   vendor-CLI invocations in those files is a future enforcement
   mechanism (see §Enforcement).

## Consequences

### Positive

- **CI reliability is decoupled from vendor uptime.** A Sentry,
  Clerk, or Elasticsearch outage does not break PR gating.
- **PR checks remain reproducible.** A passing `pnpm check` locally
  implies a passing `pnpm check` in CI, because neither depends on
  external network state.
- **Cost and rate-limit exposure is bounded.** Vendor API calls
  happen at well-known points (deploy + smoke), not on every commit.
- **The rule generalises to every future vendor CLI adoption**, not
  just the current Sentry and planned Clerk work.

### Negative / trade-offs

- **No in-PR signal for deploy-only failures.** If a CI-level
  regression would only manifest through a deploy-pipeline vendor
  call, it will only be caught at deploy time. Mitigation: deploy
  to preview environments is still gated by successful deploy-pipeline
  execution, and smoke tests can be run against preview before
  production promotion.
- **E2E coverage is narrower than an "integration-against-a-live-service"
  approach would give.** Oak accepts this trade-off per
  `testing-strategy.md`: E2E tests prove the system's contract
  against itself; smoke tests prove the system's contract against
  its real dependencies.
- **Naming discipline is required**. `*.e2e.test.ts` that touches
  network is a violation, not an escape hatch. Teams must consciously
  choose smoke over E2E when a network reach is needed.

## Alternatives Considered

1. **Permit vendor-CLI calls in PR checks with a circuit breaker.**
   Rejected: adds complexity (the breaker itself becomes a source of
   flakes) and still couples CI reliability to vendor uptime during
   the "healthy" path.
2. **Permit vendor-CLI calls in PR checks but only against a
   staging/sandbox vendor account.** Rejected: staging sandboxes
   don't exist uniformly across vendors; the rule cannot be applied
   consistently; and the PR-check latency cost is real regardless of
   which account is hit.
3. **Keep the rule as an operational note in `testing-strategy.md`
   rather than an ADR.** Rejected: the rule applies to multiple
   vendor CLIs (Sentry, Clerk, Elasticsearch) and intersects with
   multiple ADRs (078 test discipline, 143 redaction barrier, 159
   per-workspace ownership). ADR scope is correct per "ADR-worthiness
   scopes by reusability, not diff size"
   (`patterns/adr-by-reusability-not-diff-size.md`).
4. **Permit E2E tests to reach the network as long as they are
   marked `@slow`.** Rejected: `testing-strategy.md` already names
   E2E as stdio-only. Remarking an E2E test as `@slow` reopens the
   IO boundary and collides with the existing taxonomy. The correct
   move is to name it a smoke test.

## Enforcement

1. **Code review**. Any PR that adds a `sentry-cli`, `clerk`, or
   other vendor-network invocation to a GitHub Actions workflow is
   flagged.
2. **Future lint rule**. A workspace-boundary lint rule in
   `@oaknational/eslint-plugin-standards` (or a `depcruise` rule)
   could forbid vendor-CLI binary invocations in
   `.github/workflows/*.yml` paths once those become first-class
   scanned surfaces.
3. **`sentry-cli-usage.md` § "Pipeline boundary"** operationalises
   this ADR for the Sentry CLI specifically and is cross-linked from
   here.
4. **`sentry-deployment-runbook.md`** (and its Clerk-CLI sibling
   when that work lands) owns the deploy-pipeline invocation
   documentation.

## Related Work

- Graduated from the 2026-04-17 maximisation pivot session's
  distillation (see `.agent/memory/napkin.md` § "CI pipeline framing
  had never been named explicitly").
- Operationalises
  [`docs/operations/sentry-cli-usage.md § "Pipeline boundary: where
sentry-cli runs — and where it does not"`](../../operations/sentry-cli-usage.md#pipeline-boundary-where-sentry-cli-runs--and-where-it-does-not).
- Cross-referenced from
  [`sentry-observability-maximisation-mcp.plan.md § L-7 Release + commits + deploy linkage`](../../../.agent/plans/architecture-and-infrastructure/active/sentry-observability-maximisation-mcp.plan.md).
- Will be cross-referenced from
  [`clerk-cli-adoption.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md)
  when Clerk CLI work lands.

## Open Questions

- Should E2E vs smoke naming be reconsidered in favour of industry-standard
  vocabulary (e.g. "integration tests" as the in-process collaboration
  category, a different name for "no-IO single-function" tests, "smoke"
  retained for full-system)? That is a broader testing-vocabulary
  question tracked separately from this ADR — this ADR encodes the
  pipeline boundary regardless of which naming we settle on.
