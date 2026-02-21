---
name: Review — Docs, Search CLI, and OAuth/Auth Follow-Ups (2026-02-20)
overview: >
  Consolidated review findings from the onboarding/docs/search-cli/auth pass,
  plus maintainer-confirmed direction on script ownership, historical review
  handling, and canonical health endpoint policy.
todos:
  - id: add-oauth-spec-script
    content: >
      Add `smoke:oauth:spec` script to
      `apps/oak-curriculum-mcp-streamable-http/package.json` so the documented
      command in `smoke-tests/smoke-oauth-spec.ts` works exactly as written.
    status: completed
  - id: fix-adr-113-adr-057-links
    content: >
      Fix ADR-113 links to ADR-057 filename
      (`057-selective-auth-public-resources.md`), replacing the non-existent
      path currently referenced.
    status: completed
  - id: fix-quick-start-anchor
    content: >
      Fix `docs/quick-start.md` links to the onboarding caveat anchor
      (`#known-gate-caveat`), or rename the onboarding heading to match the
      existing linked plural anchor.
    status: completed
  - id: preserve-historical-review-cleanly
    content: >
      Keep `.agent/research/developer-experience/2026-02-20-onboarding-review.md`
      as historical, but add a clear historical snapshot note and create a
      fresh follow-up review pass soon.
    status: completed
  - id: canonical-health-endpoint-alignment
    content: >
      Adopt and document one canonical health endpoint policy (recommended:
      `/healthz`), then align comments, skip-path docs, and middleware logging
      language with that canonical endpoint.
    status: completed
isProject: false
---

## Context

This document captures the current review state after staged diff analysis and
targeted verification runs, and records maintainer decisions made after the
review.

## Maintainer Decisions (Confirmed)

1. `smoke:oauth:spec` must be runnable via package script (not ad-hoc only).
2. The onboarding review in `.agent/research/...` remains historical, but a new
   pass is needed soon.
3. Health endpoints should follow the idiomatic, canonical, standards-compliant
   approach.

These decisions are treated as binding direction for follow-up work.

## Findings (Severity Ordered)

### Medium

1. Documented command does not run:
   - `apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-oauth-spec.ts`
     documents:
     `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http smoke:oauth:spec`
   - `apps/oak-curriculum-mcp-streamable-http/package.json` currently has no
     `smoke:oauth:spec` script, so the command fails.

2. ADR-113 contains broken file links to ADR-057:
   - `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md`
     references `057-selective-authentication-for-public-mcp-resources.md`
   - Actual file is
     `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md`.

### Low

3. Quick-start anchor mismatch:
   - `docs/quick-start.md` links to `#known-gate-caveats`
   - `docs/development/onboarding.md` heading is singular:
     `### Known Gate Caveat`
   - Result: in-page link mismatch.

4. Historical review drift:
   - `.agent/research/developer-experience/2026-02-20-onboarding-review.md`
     now contains statements that no longer reflect current code/test state.
   - Decision is to keep it historical; therefore it needs explicit historical
     framing rather than being silently interpreted as current-state truth.

5. Health endpoint naming/docs mismatch:
   - Runtime endpoint is `/healthz` in
     `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
   - Auth middleware comments/skip path docs still discuss `/health` and
     `/ready` in
     `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`.

## Canonical Health Endpoint Recommendation

Recommendation: treat `/healthz` as canonical (current implementation), and
align auth/middleware docs and comments to that canonical route.

Why:

- It is already the live route used by the app.
- It avoids introducing additional route aliases unless there is a specific
  integration requirement.
- It keeps behavior, docs, and operational checks consistent.

If standards/compliance requirements from deployment targets require `/health`
or `/ready`, add aliases deliberately and document why.

## Verification Snapshot

Targeted validation already run and passing in this review cycle:

- Streamable HTTP:
  - unit/integration auth-router-middleware suites
  - e2e auth/resource/security suites
  - `src/auth-routes.integration.test.ts`
- Search CLI:
  - `e2e-tests/bulk-retry-cli.e2e.test.ts`
- Type-check:
  - `@oaknational/oak-curriculum-mcp-streamable-http`
  - `@oaknational/search-cli`

## Next Review Pass

A fresh onboarding/developer-experience review should be scheduled after the
pending documentation/script fixes above are merged, so we can replace the
historical snapshot with an updated current-state assessment.

## Closure Notes (21 February 2026)

### Validation Outcomes

On review, 2 of 5 findings were already resolved (smoke script existed,
ADR links already correct). The remaining 3 were confirmed and fixed:

- **Anchor mismatch**: `docs/development/onboarding.md` heading changed from
  singular to plural (`Known Gate Caveats`) to match `docs/quick-start.md` links.
- **Health endpoint**: `CLERK_SKIP_PATHS` contained phantom `/health` and `/ready`
  (no routes existed for either). Replaced with `/healthz` (the actual endpoint).
  Updated TSDoc, comments in `auth-routes.ts`, and both unit and integration tests.
  All 37 tests pass.
- **Historical review**: Added historical snapshot framing note to
  `.agent/research/developer-experience/2026-02-20-onboarding-review.md`.

