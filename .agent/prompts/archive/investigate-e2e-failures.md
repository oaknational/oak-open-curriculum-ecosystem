---
description: Investigation into E2E test failures in oak-curriculum-mcp-streamable-http
---

# Investigation: E2E Test Failures in `oak-curriculum-mcp-streamable-http`

## Context

We are investigating widespread failures in the `test:e2e` suite for `apps/oak-curriculum-mcp-streamable-http`.
The tests are failing primarily due to `Invalid environment` errors during application startup, specifically missing `OAK_API_KEY`, `CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.

## Current State

- **Failing Tests**: ~27 test files are failing with `Error: Invalid environment`.
- **Root Cause**: The application (`src/application.ts`) validates environment variables on startup. The test environment does not provide these variables.
- **Constraints**:
  - **No Global State**: We MUST NOT create global `.env` files or rely on global environment variables that might leak or cause side effects.
  - **No Network IO**: E2E tests MUST NOT make real network calls (e.g., to Clerk or other external services). They must use mocks.
  - **Strict Adherence**: We must follow `@[.agent/directives/rules.md]` and `@[.agent/directives/testing-strategy.md]`.

## Experiments & Findings

1. **Attempt 1 (Rejected)**: Creating a `.env.e2e` file. This was rejected as "injecting global state" and "bypassing safeguards".
2. **Attempt 2 (Successful Prototype)**: Refactoring a single test file (`e2e-tests/web-security-selective.e2e.test.ts`) to:
   - Mock `@clerk/express` to avoid network calls and valid key requirements.
   - Inject a mock `RuntimeConfig` into `createApp()` to bypass environment validation.
   - This resulted in the test passing successfully without external dependencies.

## Objective

We need to systematically apply the successful pattern (or a better, more architectural one) across the entire E2E test suite.

**Key Questions to Answer:**

1. How can we apply the `RuntimeConfig` injection and Clerk mocking globally or systematically for all E2E tests without duplicating code in every file?
2. Is there a way to configure `vitest` or the application bootstrap to handle this "test mode" cleanly?
3. Are there other "hidden" network calls or side effects we need to mock?

## Directives

- **Read**: `@[.agent/directives/rules.md]` and `@[.agent/directives/testing-strategy.md]` before proposing any changes.
- **Plan**: Create a detailed plan to refactor the test suite to be hermetic and self-contained.
- **Refactor**: Implement the solution, prioritizing a clean, DRY approach (e.g., a test helper or setup file) over copy-pasting mocks.
