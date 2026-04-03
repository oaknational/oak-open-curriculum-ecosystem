# Reviewer Gateway Operations

**Type**: Transferable Pattern
**Origin**: oak-mcp-ecosystem (2026-04-03)
**Related**: `invoke-code-reviewers`, `parallel-agents`, `production-reviewer-scaling.md`

## Summary

Once the reviewer roster grows beyond a handful of specialists, the gateway
needs explicit operating doctrine, not just a list of agent names.

## Key Moves

### 1. Layered triage

Route in three passes:

1. change category
2. domain signal
3. cross-cutting concerns

This keeps a large roster usable without every review turning into "invoke
everything".

### 2. Explicit review depth

Every specialist is invoked as either:

- `focused` — one bounded concern
- `deep` — concern tracing across boundaries and interacting layers

Depth is part of the request, not an implicit guess.

### 3. Delegation snapshot

Every delegated lane gets the same minimum snapshot:

- goal
- owned surface
- non-goals
- required evidence
- acceptance signal
- reintegration owner
- stop or escalate rule

### 4. Reintegration discipline

Mailbox delivery is not enough. Findings count only when the parent lane
absorbs them back into the authoritative plan or dialogue and records any
non-invoked specialists as `N/A` with rationale.

## Why It Matters

Reviewer systems usually fail operationally before they fail conceptually:
people stop knowing whom to invoke, specialist requests are underspecified, and
results arrive without being integrated. The gateway doctrine fixes the
coordination layer around the reviewers rather than only expanding the roster.

## Adoption Guidance

This pattern is portable even for smaller reviewer systems. Start with the
triage layers and review-depth distinction early; add the full delegation
snapshot once reviews or worker lanes are happening in parallel.
