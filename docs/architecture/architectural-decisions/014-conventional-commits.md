# ADR-014: Conventional Commits Standard

## Status

Accepted

## Context

Consistent commit messages are important for:

- Understanding project history
- Generating changelogs automatically
- Triggering semantic versioning
- Facilitating code reviews
- Onboarding new developers

We need a standard format for commit messages.

## Decision

Adopt the Conventional Commits specification for all commit messages, enforced by commitlint.

## Rationale

- **Industry Standard**: Widely adopted specification
- **Automation Friendly**: Enables automatic changelog generation
- **Semantic Versioning**: Can determine version bumps from commits
- **Clear Communication**: Structured format improves clarity
- **Tool Support**: Many tools understand this format
- **Enforced Consistency**: commitlint prevents non-conforming commits

## Consequences

### Positive

- Clear, consistent commit history
- Automatic changelog generation possible
- Better understanding of change impact
- Easier to find specific types of changes
- Supports semantic-release automation

### Negative

- Learning curve for developers new to the format
- More thought required when writing commits
- Can feel restrictive initially
- Need to rewrite commits if they fail validation

## Implementation

- Use @commitlint/config-conventional preset
- Common types: feat, fix, docs, style, refactor, test, chore
- Format: `type(scope): description`
- Configure with commitlint.config.js
- Enforce via Husky commit-msg hook
- Document examples in contributing guide
