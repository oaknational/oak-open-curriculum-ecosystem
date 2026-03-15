---
name: "Milestone 2 Public Alpha Blockers"
overview: "Execute production Clerk migration and edge rate limiting for OAuth proxy endpoints as the canonical Milestone 2 blocker plan."
source_research:
  - "../../research/auth/clerk-production-migration.md"
  - "../high-level-plan.md"
todos:
  - id: phase-0-decision-lock
    content: "Phase 0: Lock Clerk tenancy decision, provider rollout order, and host/header controls from research evidence."
    status: pending
  - id: phase-1-clerk-prod-cutover
    content: "Phase 1: Implement production Clerk migration, authorized parties, and public sign-up controls."
    status: pending
  - id: phase-2-oauth-edge-rate-limit
    content: "Phase 2: Enforce edge rate limiting for /oauth/register, /oauth/authorize, /oauth/token with abuse-safe defaults."
    status: pending
  - id: phase-3-validation-gates
    content: "Phase 3: Run auth/OAuth regression, type/lint/test gates, and capture go-live evidence."
    status: pending
  - id: phase-4-doc-propagation
    content: "Phase 4: Update roadmap/high-level/docs and archive blocker plan once Milestone 2 gates are met."
    status: pending
---

# Milestone 2 Public Alpha Blockers

**Last Updated**: 2026-03-11
**Status**: 📋 READY (current)
**Scope**: Canonical execution tracker for Milestone 2 blocker work only: production Clerk migration and OAuth proxy edge rate limiting.

> **Freshness note (2026-03-11)**: PR #54 shipped milestone restructuring and
> release workflow (invite-only alpha), not the production Clerk/rate-limit
> hardening described here. This plan remains the canonical tracker for the
> outstanding auth/rate-limit work required before open public alpha.

---

## Problem

Milestone 2 (Open Public Alpha) cannot ship safely until two blocker streams are complete:

1. Production Clerk migration with public sign-up controls.
2. Edge rate limiting on unauthenticated OAuth proxy endpoints.

These decisions and controls were researched, but no single executable plan currently owns implementation and evidence closure.

---

## Phase Model

### Phase 0: Decision Lock (RED)

Acceptance criteria:

1. Shared vs independent Clerk tenancy decision is explicit and signed off.
2. Provider rollout order is fixed (Phase 1 social providers).
3. Canonical host/header enforcement preconditions are recorded as blocking checks.

Validation commands:

```bash
rg --line-number "Option A|Option B|recommended|Host header|CLERK_AUTHORIZED_PARTIES|rate limiting" .agent/research/auth/clerk-production-migration.md
```

### Phase 1: Clerk Production Cutover (GREEN)

Acceptance criteria:

1. Runtime configuration supports production Clerk keys and authorized parties.
2. Public sign-up controls are implemented (including disposable-email policy).
3. Auth flows remain MCP/OAuth compliant after cutover.

### Phase 2: OAuth Edge Rate Limiting (GREEN)

Acceptance criteria:

1. Edge limits are enforced for `/oauth/register`, `/oauth/authorize`, `/oauth/token`.
2. Limits are observable (metrics/logging) and include safe retry semantics.
3. Abuse scenarios are tested without degrading normal sign-in flows.

### Phase 3: Validation Gates (REFACTOR)

Validation commands:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

### Phase 4: Documentation and Closure

Acceptance criteria:

1. `high-level-plan.md` and `semantic-search/roadmap.md` reference this plan while in progress.
2. Completion evidence is recorded before archive move.
3. Milestone 2 blocker status is unambiguous across plan indexes.

---

## Non-Goals

- Broader Milestone 3 hardening streams.
- Extension-surface work unrelated to public-alpha blockers.
- Search-quality roadmap work beyond blocker dependencies.
