<!-- markdownlint-disable -->

# MCP OAuth 2.1 Implementation Plan (Clerk Integration)

**Status**: Phase 3 (Authentication Behaviour Testing) – documentation and bypass audit completed; final quality gates outstanding  
**Last Reviewed**: 2025-11-01  
**Scope**: `apps/oak-curriculum-mcp-streamable-http`

## Snapshot

- Phases 0–2 (Clerk setup, integration, comprehensive testing) remain complete; last full `pnpm qg` pass was 2025-10-30.
- Automation strategy confirmed: `trace:oauth` retained for one-off Clerk validation; all routine auth verification is mock-based.
- Mock fixtures (`auth-scenarios.ts`, `mock-clerk-middleware.ts`) plus unit/integration/E2E suites are green; documentation now reflects the fixture catalogue and two-tier auth strategy.
- New smoke mode (`local-stub-auth`) and `pnpm smoke:dev:auth` cover auth enforcement with stub tools and mocks; README/TESTING link directly to these flows.
- `DANGEROUSLY_DISABLE_AUTH` usage audited – every bypass site documents its intent and references auth-enforcement coverage.
- Remaining work: rerun the repo-level quality gate and capture the results alongside the stub-auth smoke run.

## Two-Tier Testing Approach

### Tier 1: One-Off Clerk Configuration Validation

**Purpose**: Verify Clerk is wired correctly during initial setup or when Clerk configuration changes.

**Tool**: `pnpm trace:oauth` (manual browser flow with HAR + Playwright trace capture)

**Characteristics**:

- Manual browser interaction required
- Captures complete OAuth flow for analysis
- Validates that Clerk metadata endpoints, redirect URIs, and scopes are correctly configured
- Produces artefacts in `temp-secrets/` for troubleshooting

**Frequency**: Once during setup, or when Clerk config changes

**CI/CD Status**: Not required in automated pipelines

**Usage**: Run manually when:

- Setting up Clerk integration for the first time
- Changing Clerk application configuration
- Debugging OAuth flow issues

### Tier 2: Regular Authentication Behavior Testing (Mocked)

**Purpose**: Verify OUR code handles authentication correctly at each layer.

**Approach**: Mock Clerk responses at system boundaries using test fixtures

**Layers**:

- **Unit Tests**: `auth-scenarios.unit.test.ts` proves fixtures stay consistent across schema churn
- **Integration Tests**: `mock-clerk-middleware.integration.test.ts` validates middleware wiring and failure responses
- **E2E Tests**: `auth-enforcement.e2e.test.ts` documents enforcement path; future mocked-token happy-path to be layered on fixtures
- **Smoke Tests**: `smoke:dev:auth` (local-stub-auth) hits running server with stub tools while leaving auth enabled; it always uses the fake Clerk keys baked into `local-stub-auth` so the run never reaches out to Clerk. Use `smoke:dev:live:auth` when the real PKCE helper needs to be exercised.

**Characteristics**:

- Fast and deterministic (no external network calls)
- No dependency on external Clerk service
- Tests run on every commit in CI/CD
- Proves our code handles valid/invalid tokens, missing headers, etc. correctly

**Test Fixtures**: Located in `src/test-fixtures/`:

- `auth-scenarios.ts` – Predefined auth test scenarios
- `auth-scenarios.unit.test.ts` – Fixture regression tests (5 core scenarios)
- `mock-clerk-middleware.ts` – Mock Clerk middleware helpers
- `mock-clerk-middleware.integration.test.ts` – Middleware composition tests

## Objectives

1. Complete Phase 3 by rerunning the repo-level quality gate after documentation/audit updates
2. Keep auth scenario coverage aligned with SDK schema updates (extend fixtures as needed)
3. Maintain `DANGEROUSLY_DISABLE_AUTH` guidance (inline comments + TESTING/README) as new scenarios appear
4. Record outcomes of `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` alongside the repo-level `pnpm qg`

## Phase 3: Authentication Behavior Testing

### Status: In Progress (quality gates pending)

Mock coverage and documentation are aligned; bypass audit is complete. Final step is rerunning quality gates and recording the results.

### Tasks

1. ~~Remove headless OAuth automation code (no longer needed)~~ ✅ 2025-10-31
2. ~~Create authentication test fixtures for mocking Clerk behavior~~ ✅ (`auth-scenarios.ts`, `mock-clerk-middleware.ts`)
3. ~~Implement mock-based tests at unit, integration, E2E, and smoke levels~~ ✅ (`auth-scenarios.unit.test.ts`, `mock-clerk-middleware.integration.test.ts`, `smoke:dev:auth`)
4. ~~Audit and optimise `DANGEROUSLY_DISABLE_AUTH` usage~~ ✅ Inline comments now reference auth-enforcement coverage and rationale (2025-11-01)
5. ~~Update documentation to reflect two-tier approach~~ ✅ README + TESTING refreshed with manual vs mock strategy and command matrix (2025-11-01)
6. Run repo-level `pnpm qg` after tests/docs and record it with `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` ➡️ **Pending**

### When to Use DANGEROUSLY_DISABLE_AUTH

Based on what each test is trying to prove:

**Use it when**:

- Testing tool execution logic (auth not the focus)
- Testing MCP protocol compliance (auth not the focus)
- Testing Oak API integration (auth not the focus)
- Fast iteration during development

**Don't use it when**:

- Testing authentication behavior (auth is the focus)
- Testing OAuth discovery endpoints (auth is the focus)
- Testing security features (auth is the focus)
- Proving auth enforcement works correctly

All bypass usage is now annotated with inline comments describing the intent and naming the complementary auth-enforcing suite.

## Deliverables

- Authentication test fixtures (`src/test-fixtures/`)
- Mock-based tests covering all auth scenarios
- Updated documentation clearly explaining two-tier approach
- Clean removal of headless OAuth automation code
- Audit report on `DANGEROUSLY_DISABLE_AUTH` usage with refactoring recommendations

## Risks & Considerations

- Tests must properly simulate Clerk behavior to catch integration issues
- Mock middleware must continue to mirror Clerk’s observable behavior (headers, auth attachment, errors)
- Manual `trace:oauth` remains the single point of real Clerk validation; documentation must highlight when to run it
- Token expiry/refresh scenarios are not yet modelled; add fixtures when Clerk schema exposes them (tracked follow-up)

## References

- Detailed historical checklists and phase breakdowns: `.agent/plans/archive/mcp-oauth-implementation-plan.archive.md`
- Supporting docs: `apps/oak-curriculum-mcp-streamable-http/docs/clerk-oauth-trace-instructions.md`
- Auth refactor context: `.agent/plans/auth-architecture-refactor.md`
- Testing strategy: `apps/oak-curriculum-mcp-streamable-http/TESTING.md`

---

_For the full historical record and exhaustive task lists, see the archive file referenced above._
