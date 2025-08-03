# ADR-013: Git Hooks with Husky and lint-staged

## Status

Accepted

## Context

To maintain code quality, we need to ensure that:

- Code is properly formatted before commit
- Linting rules are followed
- Commit messages follow conventions
- Tests pass before pushing

We need automated enforcement of these standards.

## Decision

Use Husky for Git hooks management and lint-staged for pre-commit checks.

## Rationale

- **Automation**: Catches issues before they enter the repository
- **Consistency**: Ensures all commits meet quality standards
- **Developer Experience**: Fast feedback on issues
- **Team Alignment**: Everyone follows same standards automatically
- **Configurable**: Easy to adjust rules as needed
- **Popular Tools**: Well-maintained with large community

## Consequences

### Positive

- Prevents poorly formatted code from being committed
- Catches linting errors early
- Ensures consistent commit messages
- Reduces code review feedback on style issues
- Improves overall code quality

### Negative

- Slightly slower commit process
- Can be frustrating if too strict
- Developers need to understand hook failures
- May need to bypass occasionally with --no-verify

## Implementation

- Configure Husky in package.json prepare script
- Set up pre-commit hook for lint-staged
- Configure commit-msg hook for commitlint
- Define lint-staged rules in .lintstagedrc.json
- Run only on staged files for performance
- Document how to bypass when necessary
