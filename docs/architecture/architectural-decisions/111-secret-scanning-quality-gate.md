# ADR-111: Secrets Scanning as a Quality Gate

## Status

Accepted. Revised 2026-05-10 to align routine gate scope with ADR-121.

## Context

After history scrubbing, repository hygiene still depends on preventing re-introduction
of secrets in future commits. The policy requirements are:

- Real credentials are only held in local untracked `.env*` files.
- `.env.example` and other tracked docs/examples use placeholders.
- Routine gates must prevent new secret-like values from entering branch and
  tag history. Full-history scans remain required for bootstrap, incident
  response, and repository forensics.

## Decision

Introduce secrets scanning as a mandatory quality gate across local workflow and CI:

- Keep `.env` and `.env.local` as local-only files for credentials.
- Enforce routine branch/tag scanning via `pnpm secrets:scan` in normal gate
  surfaces, matching ADR-121.
- Retain `pnpm secrets:scan:all` for bootstrap and audit scans across branches
  and tags with full history.
- Enforce an additional forensic scan via `pnpm secrets:scan:all-refs` for
  repository forensics and audits.
- Add secrets scan to CI without requiring a routine full-history scan.
- Add a pre-push Husky check to block pushes with detected secret-like values.
- Keep allowlisting strict:
  - Scoped path allowlist for `.agent/reference/**`.
  - No broad allowlists.
  - Line-level allowlisting only where required and reviewed.

## Consequences

### Positive

- Prevents accidental re-introduction of credentials after history cleanup.
- Keeps developers from having to manually remember branch policy or full-history
  command arguments.
- Allows policy to be version-controlled and audited with the codebase.

### Negative

- Pushes from machines without `gitleaks` installed fail earlier unless installed.
- Pre-push checks take longer than a plain push, but do not pay the full-history
  scan cost on every routine run.

### Neutral

- Secret policy remains external to application runtime concerns and is enforced by
  tooling.

## Implementation

- Update `.gitleaks.toml` with strict rules and an explicit, narrow allowlist.
- Add CI history-depth configuration (`fetch-depth: 0`) in
  `.github/workflows/ci.yml`.
- Add CI step to run secret scan before build/test.
- Add pre-push check in `.husky/pre-push` for local scan enforcement.
- Document policy and workflow in README, CONTRIBUTING, agent security guidance,
  and environment documentation.
- Update WS1 in
  `.agent/plans/semantic-search/archive/completed/public-release-readiness.plan.md`.

## Related Decisions

- [ADR-016](./016-dotenv-for-configuration.md) — Dotenv for environment
  configuration
- [ADR-013](./013-husky-and-lint-staged.md) — Husky hooks for pre-push checks
