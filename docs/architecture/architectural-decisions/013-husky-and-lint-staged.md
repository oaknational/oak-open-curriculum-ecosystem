# ADR-013: Git Hooks with Husky and lint-staged

## Status

Accepted; revised 2026-05-10 by
[ADR-121: Quality Gate Surfaces](121-quality-gate-surfaces.md).

The original decision to use Husky for local Git hook orchestration still
stands. The original lint-staged/staged-file-only implementation detail is
historical: the current repository standard is verify-only root/package quality
gates, not staged-file mutation during hooks.

## Context

To maintain code quality, we need to ensure that:

- Code is properly formatted before commit
- Linting rules are followed
- Commit messages follow conventions
- Tests pass before pushing

We need automated enforcement of these standards.

## Decision

Use Husky for Git hooks management.

Use repository quality-gate scripts for hook enforcement, with the hook surface
defined by [ADR-121](121-quality-gate-surfaces.md). Staged-file-only
lint-staged checks are no longer the canonical model for this repository.

## Rationale

- **Automation**: Catches issues before they enter the repository
- **Consistency**: Ensures all commits meet quality standards
- **Developer Experience**: Fast feedback on issues before code reaches shared
  branches
- **Team Alignment**: Everyone follows same standards automatically
- **Configurable**: Easy to adjust rules as needed
- **Popular Tools**: Husky is well-maintained and keeps hook orchestration
  explicit

## Consequences

### Positive

- Prevents quality-gate failures from reaching shared branches
- Catches linting errors early
- Ensures consistent commit messages
- Reduces code review feedback on mechanical gate failures
- Improves overall code quality

### Negative

- Slightly slower commit process
- Can be frustrating if too strict
- Developers need to understand hook failures
- Bypassing hooks is not an agent-default escape hatch; it requires fresh,
  explicit owner authorisation for the exact operation

## Implementation

- Configure Husky in the root package lifecycle.
- Keep `commit-msg` wired to commit-message validation.
- Keep local hook gates verify-only: hooks should run repository scripts and
  should not mutate files as part of commit/push enforcement.
- Use ADR-121 as the source of truth for which scripts are blocking in
  pre-push, `pnpm check`, CI, and branch-protection surfaces.
- Full repository and package gates take precedence over staged-file-only
  linting when the two models diverge.
- Document bypass procedures for owners, but agents must not use `--no-verify`
  unless the owner has freshly authorised that exact invocation.
