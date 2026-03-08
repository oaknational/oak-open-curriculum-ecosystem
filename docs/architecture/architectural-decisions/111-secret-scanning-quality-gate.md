# ADR-111: Secrets Scanning as a Quality Gate

## Status

Accepted

## Context

After history scrubbing, repository hygiene still depends on preventing re-introduction
of secrets in future commits. The policy requirements are:

- Real credentials are only held in local untracked `.env*` files.
- `.env.example` and other tracked docs/examples use placeholders.
- Full-history scans are required during CI and before pushes.

## Decision

Introduce secrets scanning as a mandatory quality gate across local workflow and CI:

- Keep `.env` and `.env.local` as local-only files for credentials.
- Enforce a repository-wide scan via `pnpm secrets:scan:all` (branches + tags,
  full history) in `pnpm check`.
- Enforce an additional forensic scan via `pnpm secrets:scan:all-refs` for
  repository forensics and audits.
- Add secrets scan to CI using checked-out full history.
- Add a pre-push Husky check to block pushes with detected secret-like values.
- Keep allowlisting strict:
  - Scoped path allowlist for `.agent/reference-docs/**`.
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
- Pre-push checks take longer due full-history scanning.

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
