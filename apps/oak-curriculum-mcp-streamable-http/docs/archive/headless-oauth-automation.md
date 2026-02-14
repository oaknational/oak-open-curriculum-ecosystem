> **ARCHIVED**: This document describes a headless OAuth automation approach that was explored but not implemented. The project uses mock-based testing for authentication behavior instead. See `TESTING.md` for current auth testing strategy. This document is retained for historical reference only.

# Headless OAuth Automation – Feasibility Notes

## Goals

- Automate Clerk OAuth access token acquisition for CI smoke tests.
- Avoid manual browser interaction while respecting Clerk security constraints (bot detection, short-lived tokens).
- Produce artefacts compatible with the existing smoke harness (`SMOKE_USE_HEADLESS_OAUTH=true`).

## Status (2025-10-31)

- ✅ `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http headless:oauth` provisions a Clerk user/session/OAuth app via the backend API, drives Playwright headlessly with testing cookies, and emits artefacts under `apps/oak-curriculum-mcp-streamable-http/temp-secrets/`.
- ✅ `SMOKE_USE_HEADLESS_OAUTH=true` switches the smoke harness to the new helper; the legacy API flow remains available when the flag is unset.
- 🔜 Update README/TESTING/trace instructions and the continuation/context prompts so team members know how to enable the helper locally/CI and when to fall back to manual traces.
- 🔜 Re-run workspace + repo quality gates to demonstrate the helper and harness wiring are lint/type/test clean.

## Candidate Approaches

### 1. Playwright + Stored Session State

| Aspect         | Notes                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Summary        | Capture a Playwright storage state from a manual login (`trace:oauth`) and replay it in headless mode.                 |
| Pros           | Simple implementation; reuses existing trace scripts; avoids CAPTCHA once state captured.                              |
| Cons           | Stored cookies expire; requires periodic refresh; risky for CI if provider invalidates sessions.                       |
| Considerations | Need automated refresh (maybe nightly `trace:oauth --connect-chrome --no-cleanup`); secrets handling for storage file. |

### 2. Playwright UI Automation with Testing Tokens (Recommended)

| Aspect         | Notes                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Summary        | Use Playwright to drive the hosted login screen end-to-end in headless Chromium, primed with Clerk Testing Tokens to bypass bot detection.                     |
| Pros           | Fully automated; no dependency on long-lived cookies; mirrors the real OAuth flow; Testing Tokens mitigate CAPTCHA/anti-bot friction.                          |
| Cons           | Requires scripting provider login form (email/password); credentials must be injected via CI secrets; token TTL still 60s.                                     |
| Considerations | Use headless Chromium with deterministic selectors; inject `__clerk_testing_token` via query parameters; ensure login credentials are dedicated test accounts. |

### 3. Playwright Device Code Flow

| Aspect         | Notes                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Summary        | Use provider's device authorization flow (if available) triggered via Playwright HTTP calls; poll for approval.         |
| Pros           | Fully headless; no stored cookies; deterministic.                                                                       |
| Cons           | Depends on provider supporting device code; adds polling complexity; still needs human approval unless service account. |
| Considerations | Google device code requires manual approval; might be unsuitable without service account.                               |

### 4. Clerk Backend Session Token Flow

| Aspect         | Notes                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Summary        | Use Clerk Backend API to create session + session token, then exchange for OAuth access token via DCR. |
| Pros           | Pure API; deterministic; no Playwright.                                                                |
| Cons           | Need to confirm Clerk supports exchanging session tokens for OAuth bearer; documentation limited.      |
| Considerations | Research whether `oauth/token` endpoint accepts client credentials + session ID for DCR clients.       |

## Constraints & Risks

- **Token TTL**: Clerk access tokens are short-lived (60s default); automation must refresh per run.
- **Bot Protection**: Using Playwright in headless mode may trigger bot detection; mitigations include testing tokens (`__clerk_testing_token`) and Chrome attachment.
- **Secrets Management**: Device credentials or storage state must not leak; use `temp-secrets/` + CI secrets.

## Recommendation

- Proceed with **Playwright UI automation + testing tokens** (Option 2). It keeps the flow realistic, avoids reliance on expiring storage snapshots, and has built-in mitigations for automation detection.
- Defer device code flow until a provider service account is available.
- Continue monitoring Clerk documentation for a first-class machine token exchange; if exposed, re-evaluate Option 4.

## Next Steps

1. Document the helper usage (CLI + harness flag), prerequisites, and troubleshooting in README/TESTING/trace docs.
2. Add CI guidance for exporting `SMOKE_USE_HEADLESS_OAUTH=true` alongside Clerk credentials and confirm artefact retention policy.
3. Run workspace + repo `pnpm qg` to validate the new helper and harness wiring.
