---
name: "Remove vi.mock from tests and enforce type safety in test code"
overview: "Eliminate all vi.mock usage across the monorepo, remove type assertions from test code, and ban Object.assign — bringing tests into full compliance with ADR-078, principles.md, and the testing strategy."
status: "superseded"
superseded_on: 2026-03-03
superseded_by: ".//.agent/plans/developer-experience/active/devx-strictness-convergence.plan.md"
todos:
  - id: tier-1-remove-redundant
    content: "Tier 1: Remove redundant vi.mock from 4 E2E files that already use dangerouslyDisableAuth: true."
    status: done
  - id: tier-2-di-seam
    content: "Tier 2: Add clerkMiddlewareFactory DI seam to CreateAppOptions and setupGlobalAuthContext."
    status: done
  - id: tier-2-update-tests
    content: "Tier 2: Update 7 auth-enabled E2E test files to inject no-op middleware via DI instead of vi.mock. (mcp-connection-timeout.e2e.test.ts deleted — tested reimplemented code, not product code.)"
    status: done
  - id: tier-2-mcp-tools-mock
    content: "Tier 2: Removed vi.mock('@clerk/mcp-tools/server') from 2 E2E files — upstreamMetadata DI injection already skips the code path."
    status: done
  - id: verify-e2e
    content: "Run full E2E suite and quality gates to confirm zero regressions from vi.mock removal."
    status: done
  - id: rules-docs
    content: "Update principles.md and testing-strategy.md to explicitly ban vi.mock."
    status: done
  - id: eslint-type-assertions-warn
    content: "Set consistent-type-assertions to 'warn' in testRules (was 'off')."
    status: done
  - id: promote-type-assertions-error
    content: "Promote consistent-type-assertions from 'warn' to 'error' in testRules by fixing all ~218 type assertion warnings across 6 workspaces."
    status: cancelled
  - id: promote-restricted-types
    content: "Promote no-restricted-types from 'off' to 'warn' then 'error' in testRules."
    status: cancelled
  - id: add-vi-mock-ban
    content: "Add vi.mock/doMock/stubGlobal ESLint ban (no-restricted-syntax) and fix all 21 violations across 3 workspaces."
    status: cancelled
  - id: add-object-assign-ban
    content: "Add Object.assign ESLint restriction and fix all ~8 violations across 4 workspaces."
    status: cancelled
  - id: fix-global-req-auth-type
    content: "Fix global Request.auth type declaration in types.ts — currently MachineAuthObject but Clerk sets it as a callable function."
    status: cancelled
  - id: fix-inline-override
    content: "Remove /* eslint max-lines-per-function */ inline override from server.e2e.test.ts."
    status: cancelled
  - id: verify-all-gates
    content: "All quality gates green with zero warnings across the full monorepo."
    status: cancelled
---

> Superseded on 2026-03-03. Use the canonical plan:
> `active/devx-strictness-convergence.plan.md`.

# Remove vi.mock from tests and enforce type safety in test code

**Created**: 2026-03-03
**Last Updated**: 2026-03-03
**Status**: IN PROGRESS — E2E vi.mock removal complete, ESLint warnings enabled, promotion to errors pending
**Scope**: All test files across the monorepo
**Prerequisite**: None — self-contained.

---

## Problem

The workspace rules (`principles.md`, `testing-strategy.md`, ADR-078) explicitly
prohibit `vi.mock`, type assertions (`as`), broad types (`Record<string, unknown>`),
and `Object.*` methods. The ESLint configuration did not enforce these rules in
test files — `testRules` in `oak-eslint` set `consistent-type-assertions: 'off'`
and `no-restricted-types: 'off'`, `Object.assign` was not restricted, and there
was no ban on `vi.mock`.

This meant test code could silently violate the rules with green gates.

---

## What is done

### E2E vi.mock removal (streamable-http) — COMPLETE

All `vi.mock` calls removed from `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`.

| Change | Status |
|--------|--------|
| Deleted `mcp-connection-timeout.e2e.test.ts` (tested reimplemented code, not product code) | Done |
| Removed dead `vi.mock('@clerk/express')` from 4 Tier 1 files using `dangerouslyDisableAuth: true` | Done |
| Added `clerkMiddlewareFactory?: () => RequestHandler` DI seam to `CreateAppOptions` and `setupGlobalAuthContext` | Done |
| Created `createNoOpClerkMiddleware()` in `e2e-tests/helpers/test-config.ts` | Done |
| Migrated 7 Tier 2 auth-enabled test files to use DI instead of `vi.mock` | Done |
| Removed `vi.mock('@clerk/mcp-tools/server')` from 2 files — `upstreamMetadata` DI already skips that path | Done |
| 22 E2E test files, 183 tests, all passing | Done |

### Documentation — COMPLETE

| Change | Status |
|--------|--------|
| `principles.md`: added `vi.mock` to the explicit banned list | Done |
| `testing-strategy.md`: added `vi.mock` to both banned-pattern lists | Done |

### ESLint warning — COMPLETE

| Change | Status |
|--------|--------|
| `testRules`: set `consistent-type-assertions` to `'warn'` (was `'off'`) | Done |

This surfaces **218 warnings across 6 workspaces** — all type assertion
violations that were previously invisible. Zero errors, gates green.

---

## What is NOT done

### Current warning inventory (218 warnings)

| Workspace | Warnings | Primary violations |
|-----------|-------:|-------------------|
| `oak-curriculum-mcp-streamable-http` | 110 | Type assertions in test files |
| `curriculum-sdk` | 37 | Type assertions in test files |
| `oak-curriculum-mcp-stdio` | 27 | Type assertions in test files |
| `search-cli` | 20 | Type assertions in test files |
| `logger` | 13 | Type assertions in test files |
| `sdk-codegen` | 11 | Type assertions in test files |
| **Total** | **218** | |

### Rules not yet enforced by ESLint

These rules are documented in `principles.md` and `testing-strategy.md` but have
no ESLint enforcement yet. Each requires both adding the rule AND fixing the
existing violations before the gate can enforce it.

| Rule | Violations | Blocker |
|------|-----------|---------|
| `no-restricted-types` in tests (ban `Record<string, unknown>` etc.) | ~25 across monorepo | Currently `'off'` in `testRules`. Cannot set to `'warn'` without duplicating the types config from the parent. Needs architecture decision on how to share the config. |
| `vi.mock` / `vi.doMock` / `vi.stubGlobal` ban | 21 calls across 8 files in 3 workspaces | Cannot mix severity in `no-restricted-syntax` (ExportAllDeclaration is already `'error'`). Needs either a separate rule or fixing all violations first so it can go straight to `'error'`. |
| `Object.assign` ban | ~8 calls across 4 workspaces (product + test code) | Cannot add to `no-restricted-properties` at `'warn'` (other entries are `'error'`). Needs a separate enforcement mechanism or fixing all violations first. |
| Inline ESLint overrides | 1 in `server.e2e.test.ts` | No `noInlineConfig` in linter options. |

### Blocking issues requiring sequenced fixes

1. **Global `Request.auth` type declaration** (`types.ts:45`) — declares
   `req.auth` as `MachineAuthObject<'oauth_token'>` but Clerk sets it as a
   callable function `(options?) => SignedInAuthObject | SignedOutAuthObject`.
   This blocks fixing `Object.assign` in `test-config.ts` because direct
   property assignment fails type-check against the wrong declared type.
   **Fix sequence**: correct the global type, then replace `Object.assign`
   with explicit assignment, then the lint violation resolves.

2. **`check-mcp-client-auth.unit.test.ts`** — uses 5 `vi.mock()` calls for
   module-level mocking. Requires refactoring the product code
   (`check-mcp-client-auth.ts`) to accept dependencies as parameters.

3. **`tool-auth-context.ts:60-63`** — `getValidUserId` checks
   `typeof auth !== 'object'` but at runtime `req.auth` is a function
   (typeof returns `'function'`). Related to issue #1 above. Dead code
   or unreachable in current flow.

---

## Promotion schedule

Each phase fixes violations and promotes rules from `'warn'` (or `'off'`) to
`'error'`. Gates must be green at the end of each phase.

### Phase 1: Fix type assertions (promote `consistent-type-assertions` to `'error'`)

Fix 218 warnings across 6 workspaces. Strategy per file:

- Replace `as SomeType` with Zod `parse()`, type guards, or `satisfies`
- For response parsing in E2E tests, create Zod schemas for response shapes
- For test helper type coercion, use properly typed factory functions

Priority order (most violations first):

| Workspace | Warnings | Key files |
|-----------|-------:|-----------|
| `oak-curriculum-mcp-streamable-http` | 110 | `tool-handler-with-auth.integration.test.ts` (18), `sdk-client-stub.e2e.test.ts` (10), `web-security-selective.e2e.test.ts` (10) |
| `curriculum-sdk` | 37 | `rate-limit.integration.test.ts` (16), `retry.integration.test.ts` (13) |
| `oak-curriculum-mcp-stdio` | 27 | `mcp-protocol.e2e.test.ts` (4) |
| `search-cli` | 20 | `ingestion-validation.smoke.test.ts` (3) |
| `logger` | 13 | `error-context.unit.test.ts` (9) |
| `sdk-codegen` | 11 | Various unit tests |

### Phase 2: Fix `no-restricted-types` (promote from `'off'` to `'error'`)

~25 violations. Decide on config architecture (how to share the restricted
types list between parent config and testRules at different severity levels),
fix the violations, then set to `'error'`.

### Phase 3: Fix `vi.mock` (add ban at `'error'`)

21 calls in 8 files across 3 workspaces. Each requires DI refactoring of the
product code the test file exercises. This is the most labour-intensive phase
because it changes product code, not just test code.

| Workspace | Files | `vi.mock` calls |
|-----------|------:|-------:|
| `search-cli` | 5 | 14 |
| `streamable-http` | 1 | 5 |
| `stdio` | 1 | 1 |
| `eslint-plugin` (test infra) | 1 | 1 |

Add the `vi.mock` / `vi.doMock` / `vi.stubGlobal` selectors to
`no-restricted-syntax` in `testRules` once all violations are fixed.
Since `ExportAllDeclaration` is already `'error'` in that rule, the vi.mock
selectors will also be `'error'` — which is the desired end state.

### Phase 4: Fix `Object.assign` (add ban)

~8 calls across 4 workspaces. Fix the global `Request.auth` type declaration
first (blocker), then replace all `Object.assign` calls with spread syntax
or explicit typed assignment. Add to `no-restricted-properties` in the
strict config.

### Phase 5: Inline ESLint override prevention

Remove the `/* eslint max-lines-per-function */` override in
`server.e2e.test.ts` by splitting or restructuring the file. Consider adding
`linterOptions: { noInlineConfig: true }` to workspace configs (tracked in
the [eslint-override-removal plan](./eslint-override-removal.plan.md)).

---

## Cross-references

- **[eslint-override-removal.plan.md](./eslint-override-removal.plan.md)** —
  the broader plan for removing all ESLint overrides. Phase 4 of that plan
  covers the streamable-http and search-cli workspaces. The `testRules`
  changes here are complementary — they close gaps in the shared config.

- **ADR-078** — dependency injection for testability. The rationale for
  banning `vi.mock`, `vi.doMock`, and `vi.stubGlobal`.

- **Napkin session 2026-03-03g** — documents the E2E vi.mock removal work,
  the Clerk middleware DI pattern, and lessons learned.

---

## Success criteria

- Zero `vi.mock`, `vi.doMock`, `vi.stubGlobal` calls in ALL test files
- Zero type assertions (`as`) in ALL test files
- Zero `Record<string, unknown>` in ALL test files
- Zero `Object.assign` in ALL source files
- Zero inline ESLint overrides in test files
- Global `Request.auth` type matches Clerk's callable-function contract
- `pnpm lint` passes with zero errors AND zero warnings across ALL workspaces
- All other quality gates remain green

---

## References

- ADR-078: Dependency injection for testability
- `.agent/directives/principles.md` — "No type shortcuts", "Never disable checks"
- `.agent/directives/testing-strategy.md` — "No global state manipulation"
- Napkin session 2026-03-03f: root cause analysis of intermittent E2E failures
- Napkin session 2026-03-03g: E2E vi.mock removal and Clerk DI pattern
