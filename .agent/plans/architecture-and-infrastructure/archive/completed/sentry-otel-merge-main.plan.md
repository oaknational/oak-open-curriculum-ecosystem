---
name: "Merge main into feat/full-sentry-otel-support"
overview: >
  Safe merge plan for bringing origin/main (PR #70 MCP Apps adoption, 708 files)
  into feat/full-sentry-otel-support (19 commits, 342 files). 22 content conflicts
  plus ~14 clerk skill dir/file conflicts. Includes characterisation tests,
  phased resolution, and post-merge verification.
status: completed
last_updated: 2026-03-30
completed: 2026-03-30
parent_plan: ../../active/sentry-otel-integration.execution.plan.md
---

# Plan: Safe Merge of `origin/main` into `feat/full-sentry-otel-support`

## Context

Branch `feat/full-sentry-otel-support` (19 commits, 342 files) must merge with
`origin/main` which received PR #70 (708 files, ~366k insertions) — the MCP Apps
standard adoption. A dry-run merge reveals **22 content conflicts** + ~14 clerk
skill directory/file conflicts (symlinks on branch vs real dirs on main; main is
correct).

The two PRs touch overlapping code in the HTTP MCP server app but with different
concerns: this branch adds observability wiring; main simplifies the runtime,
refactors auth to use explicit `AuthInfo` DI, and adopts SDK `toRegistrationConfig`.

## Critical Conflicts and Hazards

### Hazard 1: `request-context.ts` deletion (architectural)

**Main deleted `request-context.ts` (AsyncLocalStorage-based request
propagation).** Branch still uses it — imported in `handlers.ts` and
`check-mcp-client-auth.ts`. Main replaced this pattern with explicit `AuthInfo`
passing via `extra.authInfo` from the MCP SDK's tool callback.

**Resolution**: Adopt main's `extra.authInfo` pattern (it is the correct
architectural direction — explicit DI over ambient state). Remove
`request-context.ts` and its test. Adapt the branch's observability `withSpan`
wrapper in `createMcpHandler` to work without `setRequestContext`.

### Hazard 2: ADR-143 numbering collision

Both branches independently created ADR-143 for different decisions:

- **Branch**: `143-coherent-structured-fan-out-for-observability.md` — the
  observability logger architecture
- **Main**: `141-mcp-apps-standard-primary.md` — MCP Apps as only UI surface

Main also added ADR-142 (`142-clerk-mcp-tools-adopt-or-explain.md`). Both ADR
files have different filenames so Git merges them without conflict — but the
numbering is broken.

**Resolution**: Renumber the branch's observability ADR to **ADR-143**. Update
the file, the ADR index, and all references in plans, prompts, and code
comments.

### Hazard 3: `express-fakes.ts` imports deleted type

Branch added `src/test-helpers/express-fakes.ts` which imports
`RequestWithAuthContext` from `../auth/tool-auth-context.js`. Main **deleted**
`tool-auth-context.ts`. This file is branch-only, so it auto-merges cleanly
but will fail type-check.

Branch's `fakes.ts` re-exports from `express-fakes.ts`, creating a cascade.

**Resolution**: Delete `express-fakes.ts` or rewrite it to use main's narrow
`McpHandlerRequest`/`McpHandlerResponse` interfaces from `handlers.ts`.

### Hazard 4: `handleToolWithAuthInterception` signature change

Main changed `tool-handler-with-auth.ts` (76 insertions, 35 deletions) to
accept `authInfo` as an explicit parameter instead of reading it from request
context. This file auto-merges from main (branch didn't touch it), but the
merged `handlers.ts` must call it with the new signature.

**Impact**: The merged `registerHandlers` in `handlers.ts` must pass
`authInfo: extra.authInfo` to `handleToolWithAuthInterception`. The old
request-context pattern will not work.

### Hazard 5: `mcp-fakes.ts` uses wide SDK types (low risk)

Branch added `src/test-helpers/mcp-fakes.ts` importing `McpServer` and
`StreamableHTTPServerTransport` directly from the SDK. Main narrowed
`McpRequestContext` to use `McpRequestServer` / `McpRequestTransport`
interfaces. The file auto-merges and compiles (narrow types are structural
subtypes of the full SDK types) but violates main's intent of narrow
interfaces for testability (ADR-078).

**Resolution**: Optional. Update `mcp-fakes.ts` to use main's narrow
interfaces for consistency. Not a build blocker.

## Pre-Merge Characterisation Tests

Before starting the merge, create characterisation tests that capture the
branch's observability behaviour at key integration boundaries. These tests
verify that observability wiring survives the merge — they are the safety net.

### Test 1: Tool handler observability wrapping

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers-observability.characterisation.test.ts`

Verify that `registerHandlers` wraps each tool handler with `wrapToolHandler`
from `@oaknational/sentry-mcp`. This is the branch's core contribution to
`handlers.ts` and the part most at risk during the merge with main's
`toRegistrationConfig` changes.

- Call `registerHandlers` with a fake `McpServer` and fake `HttpObservability`
- Assert that `createMcpObservationOptions()` was called
- Assert that registered tool callbacks are wrapped (call one, verify
  observation recorded)

### Test 2: MCP handler span and error capture

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers-mcp-span.characterisation.test.ts`

Verify that `createMcpHandler` creates a span (`oak.http.request.mcp`) and
captures errors via `observability.captureHandledError` on cleanup failure.

- Call `createMcpHandler` with fake observability
- Assert `withSpan` is called with correct span name and attributes
- Simulate cleanup error, assert `captureHandledError` is called

### Test 3: Resource and prompt observability threading

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources-observability.characterisation.test.ts`

Verify that `registerAllResources` and `registerPrompts` receive and thread the
`observability` parameter.

- Call with fake observability
- Assert the parameter is passed through (not lost during merge)

### Why these three and not others?

The existing unit and e2e tests already cover:

- Sentry package behaviour (`@oaknational/sentry-node`, `sentry-mcp` — no
  conflicts)
- Logger fan-out (`@oaknational/logger` — no conflicts)
- Redaction (`@oaknational/observability` — no conflicts)
- HTTP observability modules (split files — no conflicts with main)
- Smoke tests (already fragile, already tested)

The risk is specifically at the **integration seams** where branch's
observability meets main's refactored runtime. The three characterisation tests
target exactly those seams.

## Merge Execution Plan

### Phase 0: Pre-flight

1. `pnpm check` on current branch — confirm green baseline
2. Fix C1/C2 regex backtracking findings (per
   [PR73 remediation plan](./sentry-otel-pr73-codeql-remediation.plan.md)) —
   unrolled-loop pattern in `agent-tools/src/core/codex-project-agent-registry.ts`
   and `scripts/validate-subagents-helpers.mjs`. Run targeted tests, commit.
3. Create characterisation tests (Test 1-3 above)
4. Run characterisation tests — confirm they pass on current branch
5. Commit characterisation tests

### Phase 1: Start the merge

```bash
git fetch origin main
git merge origin/main --no-commit
```

This stages all auto-resolved files and leaves conflicts unresolved.

### Phase 2: Resolve trivial conflicts (8 files)

Resolve in this order — each is independent, low risk:

| # | File | Resolution |
| --- | --- | --- |
| 1 | `.agent/memory/napkin.md` | Accept main (`git checkout origin/main -- .agent/memory/napkin.md`) |
| 2 | `.agent/prompts/README.md` | Accept main, then re-add observability prompt entry |
| 3 | `.agent/reference/cross-platform-agent-surface-matrix.md` | Accept main |
| 4 | `docs/architecture/architectural-decisions/README.md` | Accept main, add ADR-143 observability entry (renumbered — see Hazard 2) |
| 5 | `packages/sdks/oak-sdk-codegen/package.json` | Accept main |
| 6 | `create-test-logger.ts` (modify/delete) | Delete — main removed it |
| 7 | `check-mcp-client-auth.unit.test.ts` (modify/delete) | Delete — main replaced with DI integration test |
| 8 | Clerk skill directories (~14 items) | Accept main (real dirs, not symlinks) |

### Phase 3: Resolve mechanical conflicts (4 files)

Both sides made independent changes to different parts of the same file:

| # | File | Approach |
| --- | --- | --- |
| 1 | `auth-response-helpers.ts` | Accept both hunks |
| 2 | `bootstrap-helpers.unit.test.ts` | Accept main's test patterns, add branch's observability params |
| 3 | `register-prompts.integration.test.ts` | Accept main's fixtures, add branch's observability param |
| 4 | `handlers-auth-errors.integration.test.ts` | Accept main's simplified auth, add branch's observability param |

### Phase 4: Resolve semantic conflicts — the keystone files

**This is the hardest phase.** Work in dependency order.

#### 4a. `handlers.ts` (keystone — everything else depends on this)

Main's changes to adopt:

- `toRegistrationConfig(tool)` replaces manual config object construction
- `ToolHandlerDependencies` moved to `tool-handler-types.ts` with
  `createRequestExecutor` factory
- `stubExecutor` moved into `buildToolHandlerDependencies`
- `extra.authInfo` passed to `handleToolWithAuthInterception` (no more
  `setRequestContext`)
- Narrow `McpHandlerRequest` / `McpHandlerResponse` interfaces (ADR-078
  compliant)
- `req.auth` cleared on close for defence-in-depth

Branch's changes to preserve:

- `observability: HttpObservability` parameter in `RegisterHandlersOptions`
- `wrapToolHandler()` around each tool handler in the registration loop
- `mcpObservation` from `observability.createMcpObservationOptions()`
- `observability` passed to `registerAllResources` and `registerPrompts`
- `observability.withSpan()` in `createMcpHandler`
- `observability.captureHandledError()` in cleanup error path
- `extractCorrelationId` from response locals

Merged result:

- Use main's `toRegistrationConfig`, `tool-handler-types.ts`, narrow interfaces
- Use main's `extra.authInfo` pattern (remove `setRequestContext` /
  `request-context.ts`)
- Layer branch's `wrapToolHandler`, `observability.withSpan`, and
  `captureHandledError` on top
- `createMcpHandler` signature: add `observability: HttpObservability` param
  to main's version
- **Important (Hazard 4)**: `handleToolWithAuthInterception` auto-merges from
  main with a new signature that expects `authInfo` as an explicit parameter.
  The merged `registerHandlers` must pass `authInfo: extra.authInfo` — the old
  `setRequestContext` pattern will not work.

#### 4b. `check-mcp-client-auth.ts`

Main already did the DI refactor this branch deferred (F10). Main's version:

- Accepts explicit `AuthInfo` and `CheckMcpClientAuthDeps`
- No `getRequestContext()` / `getAuth()` ambient imports
- Has new DI integration test (`check-mcp-client-auth.di.integration.test.ts`)

Branch's changes to preserve:

- None that conflict — branch's version still used the old ambient pattern

Resolution: **Accept main entirely.** The branch's only modification was the
deferred F10 finding, which main resolved properly. Delete
`request-context.ts` and `request-context.unit.test.ts`.

#### 4c. `register-prompts.ts`

Main: consolidated the registration loop, introduced `PromptRegistrar` narrow
interface. Branch: added `observability` parameter.

Resolution: Accept main's consolidated loop and narrow interface, add
`observability` parameter threading.

#### 4d. `register-resources.ts`

Main: consolidated all resource registration, updated SDK imports
(`registerAppResource`, `RESOURCE_MIME_TYPE`, `WIDGET_URI`), simplified CSP to
`resourceDomains` only, converted `ResourceRegistrar` to interface. Branch:
added `observability` parameter threading.

Resolution: Accept main's consolidated registration and SDK patterns, add
`observability` parameter.

#### 4e. `test-helpers/fakes.ts`

Main: consolidated fakes, added re-exports from `fakes-clerk.ts` and
`fakes-mcp-server.ts`, uses `node-mocks-http`, narrow `McpHandlerRequest` /
`McpHandlerResponse` interfaces, `AuthInfo` from MCP SDK. Branch: modularised
fakes differently.

Resolution: Accept main's consolidated fakes. Add any observability fakes from
branch that are not covered.

#### 4f. `handlers.integration.test.ts`

Main: updated fixtures for new DI/auth pattern, uses narrow interfaces.
Branch: added observability assertions.

Resolution: Accept main's test structure, add observability parameter and
assertions.

### Phase 5: Resolve e2e test conflicts (4 files)

All 4 e2e tests have the same pattern conflict: main migrated to
`createRequestExecutor` factory + `stubSearchRetrieval`; branch added
`observability` param to `createApp`.

For each:

1. Accept main's test body (factory pattern, imports)
2. Add `observability: createMockObservability(runtimeConfig)` to `createApp`
   calls
3. Ensure `createMockObservability` is exported from test-config helpers

### Phase 6: Adapt main's non-conflicting test files

Main added new test files that auto-merge cleanly but will **fail type-check**
after the merge because `registerHandlers` and `createApp` gain a required
`observability` parameter from the branch. These are NOT in the conflict list
but must be adapted:

| File | What to add |
| --- | --- |
| `handlers-auth-errors-observability.integration.test.ts` | `observability` param to 2 `registerHandlers` calls |
| `handlers-tool-registration.integration.test.ts` | `observability` param to 3 `registerHandlers` calls |
| `check-mcp-client-auth.di.integration.test.ts` | May need observability in test helpers if signatures changed |

For each: import `createFakeHttpObservability` (or similar) from observability
test fakes, and pass it as the `observability` option to `registerHandlers`.
Pattern: follow the same approach used in Phase 4f for
`handlers.integration.test.ts`.

### Phase 7: Clean up stale files, types, and ADR numbering

#### 7a. Remove files that main deleted but branch still has

- `src/request-context.ts`
- `src/request-context.unit.test.ts`

Verify no remaining imports reference them (grep for `request-context`).

#### 7b. Fix or remove `express-fakes.ts` (Hazard 3)

Branch added `src/test-helpers/express-fakes.ts` which imports
`RequestWithAuthContext` from `../auth/tool-auth-context.js` — a file main
deleted. This will fail type-check.

Options:

1. **Delete** `express-fakes.ts` if main's `fakes.ts` (which uses
   `McpHandlerRequest`/`McpHandlerResponse` and `node-mocks-http`) covers all
   use cases. Remove the re-export from `fakes.ts`.
2. **Rewrite** to use main's narrow `McpHandlerRequest`/`McpHandlerResponse`
   interfaces instead of the deleted `RequestWithAuthContext`.

Check who imports from `express-fakes.ts` (currently only `fakes.ts`) to
decide.

#### 7c. Optional: narrow `mcp-fakes.ts` types (Hazard 5)

Branch's `src/test-helpers/mcp-fakes.ts` imports `McpServer` and
`StreamableHTTPServerTransport` directly from the SDK. Main narrowed
`McpRequestContext` to `McpRequestServer`/`McpRequestTransport`. Consider
updating `mcp-fakes.ts` to use the narrow interfaces for ADR-078 consistency.
Not a build blocker — can be deferred.

#### 7d. Renumber ADR-143 to ADR-143 (Hazard 2)

Both branches created ADR-143 for different decisions. Main's ADR-143 (MCP
Apps standard) and ADR-142 (Clerk mcp-tools) take priority as they are already
merged. Renumber the branch's observability ADR:

1. `git mv docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md`
2. Update the ADR's own title and any internal "ADR-143" self-references
3. Update the ADR index (`docs/architecture/architectural-decisions/README.md`)
4. Grep the repo for remaining references to the old number and path:
   - `.agent/plans/` (execution plan, prompt, remediation plans)
   - `.agent/prompts/`
   - `docs/` (any cross-references)
   - Code comments (if any)

### Phase 8: Regenerate lockfile

```bash
pnpm install
```

This resolves the `pnpm-lock.yaml` conflict mechanically.

### Phase 9: Verify

1. `pnpm build` — confirm compilation
2. `pnpm type-check` — confirm no type errors
3. `pnpm lint:fix` — confirm no lint violations
4. `pnpm test` — confirm all unit/integration tests pass
5. Run characterisation tests — confirm observability wiring survived
6. `pnpm test:e2e` — confirm e2e tests pass
7. `pnpm smoke:dev:stub` — confirm smoke tests pass
8. `pnpm check` — full clean rebuild + verification (81+ tasks)

### Phase 10: Commit the merge

```bash
git commit
```

The merge commit message will be auto-generated by Git. Push to update PR #73.

### Phase 11: Post-merge review

Invoke specialist reviewers on the merge result:

- `code-reviewer` (gateway)
- `sentry-reviewer` (observability wiring survived?)
- `architecture-reviewer-fred` (boundary discipline after main's refactor)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Observability wiring lost during merge | Medium | High | Characterisation tests catch it |
| Auth flow broken (request-context removal) | Low | High | Main's DI tests + e2e tests catch it |
| Type errors from mismatched interfaces | Medium | Medium | `pnpm type-check` catches it immediately |
| ADR-143 numbering collision missed | High | Medium | Phase 7d renumbers explicitly |
| `express-fakes.ts` breaks on deleted type | High | Medium | Phase 7b removes or rewrites it |
| `handleToolWithAuthInterception` signature mismatch | Medium | Medium | Phase 4a documents the new signature |
| Lockfile conflict causes dependency issues | Low | Medium | `pnpm install` regenerates cleanly |
| Clerk skill structure wrong | Low | Low | `pnpm portability:check` catches it |

## Estimated Conflict Complexity

- **Trivial**: 8 files + ~14 clerk dirs = ~22 resolutions (minutes)
- **Mechanical**: 4 files (straightforward hunk merging)
- **Semantic**: 6 files (careful reading required)
- **E2E**: 4 files (pattern application, mechanical once handlers.ts is done)
- **Non-conflicting adaptations**: 3 files (add observability param to main's
  new tests)
- **Stale file cleanup**: 4 items (request-context, express-fakes, mcp-fakes
  optional, ADR renumber)
- **Lockfile + verify**: regeneration + full gate suite
