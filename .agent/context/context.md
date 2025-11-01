# Context: Oak MCP Ecosystem

**Updated**: 2025-11-01  
**Branch**: `feat/oauth_support`

## Current Focus

- Phase 3 clean-up: documentation refreshed, bypass audit complete, now awaiting quality-gate confirmation.
- Keep `DANGEROUSLY_DISABLE_AUTH` usage aligned with audit notes and ensure future tests document rationale.
- Run workspace + repo quality gates and capture results alongside `pnpm smoke:dev:auth`.

## State Snapshot

- Phases 0–2 remain complete; last full `pnpm qg` run passed on 2025-10-30.
- Unit, integration, and E2E auth tests now consume mock fixtures; smoke suite gained `local-stub-auth` mode via `pnpm smoke:dev:auth`.
- README + TESTING now describe the two-tier auth strategy and command matrix.
- All `DANGEROUSLY_DISABLE_AUTH` usages include inline rationale referencing auth-enforcement coverage.
- Outstanding item: rerun quality gates (`pnpm qg`, `pnpm smoke:dev:auth`, final repo `pnpm qg`) and record outcomes.

## Mock-Based Auth Testing Approach

Authentication behavior testing now relies on generated fixtures and mocks:

- **Fixtures**: `auth-scenarios.ts` (+ unit test) and `mock-clerk-middleware.ts` (+ integration test)
- **Layers**:
  - Unit: fixture validation (`auth-scenarios.unit.test.ts`)
  - Integration: mock middleware composition (`mock-clerk-middleware.integration.test.ts`)
  - E2E: enforcement coverage (`auth-enforcement.e2e.test.ts`); note about future mocked-token happy path
  - Smoke: `smoke:dev:auth` (local-stub-auth mode) keeps auth enabled while using stub tools
- **Benefits**: Deterministic, CI-friendly, no external Clerk dependency.

**`DANGEROUSLY_DISABLE_AUTH` guidance** (must be documented inline where used):

- ✅ Use when auth is explicitly out-of-scope (tool execution, protocol validation, Oak API surface checks, dev ergonomics).
- 🚫 Do not use when validating auth enforcement, OAuth discovery, or security posture.
- Where bypass remains, add comments stating the test intent and link to fixtures ensuring auth scenarios are covered elsewhere.

## Immediate Next Steps

1. Run repo-level `pnpm qg`, then `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`.
2. Capture both outcomes in the plan/context notes.
3. Track future work: extend fixtures for token expiry/refresh once the schema exposes the scenarios.

## Quality Gate Status

`pnpm qg` last passed on 2025-10-30. After documentation + bypass updates, rerun:

1. `pnpm qg` (repo root) – ensures all workspaces run their checks via Turborepo.
2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` – stub-auth smoke (network-free) to confirm enforcement wiring.

## References

- Plan: `.agent/plans/mcp-oauth-implementation-plan.md`
- Auth refactor notes: `.agent/plans/auth-architecture-refactor.md`
- Testing strategy: `apps/oak-curriculum-mcp-streamable-http/TESTING.md`
- Historical context: `.agent/context/archive/context.archive.md`
