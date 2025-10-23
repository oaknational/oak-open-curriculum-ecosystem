# OpenAI Connector Alias Retirement Plan

## Mission

Decommission the legacy `/openai_connector` alias from the Streamable HTTP MCP server without losing any functionality currently exposed via `/mcp`. The resulting deployment must present a single `/mcp` surface with full tool coverage, consistent Accept-header enforcement, and updated smoke/e2e coverage. Remote verification targets the preview already live at `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp` (auto-refreshes ~5 minutes after each push).

## Acceptance Criteria

1. No application code, tests, or documentation references `/openai_connector`.
2. `/mcp` continues to expose the complete tool set, including the aggregated search and fetch tools, with identical behaviour and metadata.
3. Local stub, local live, remote preview, and production deployments pass the Streamable HTTP smoke suite without alias-related warnings.
4. Documentation (README, architecture notes, deprecation guide) reflects the removal and provides a migration note.
5. Remote smoke harness accepts both positional and `--remote-base-url` flag inputs (via `commander`) so preview checks remain ergonomic post-removal.
6. The remote smoke tests are fully green and, when taken alongside the E2E tests, confirm that the remote deployment is fully and correctly operational.

## Status Summary (23 October 2025 14:35 BST)

- ✅ Phase 1 – Inventory captured and logged in the context plan.
- ✅ Phase 2 – Alias runtime removed from `index.ts`, `auth.ts`, and the OpenAI connector module.
- ✅ Phase 3 – Vitest, smoke assertions, and documentation updated to reference `/mcp` only.
- ✅ Phase 4 – Commander-based CLI adopted with positional + flag coverage.
- ✅ Phase 5 – Local E2E plus remote smoke (preview) both green, demonstrating production readiness.
- ✅ Phase 6 – Quality gates (`lint`, `type-check`, `test`, `test:e2e`, `smoke:dev:*`, `smoke:remote`) re-run; context updated with verification notes.
- ✅ Acceptance criteria satisfied; preview `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp` validated via both CLI invocation styles.

## Phase 1 – Inventory and Design Confirmation

### Implementation Tasks

1. Catalogue all references to `/openai_connector` across source, tests, docs, and deployment scripts using `rg`, recording the current hits (index/auth wiring, OpenAI connector module, smoke assertions, E2E coverage, README + architecture docs, and the deprecation note).
2. Verify which handlers, auth guards, or logging paths are alias-specific (`registerOpenAiConnectorHandlers`, bearer bypass for `REMOTE_MCP_ALLOW_NO_AUTH_OPENAI`, smoke assertion warnings, etc.).
3. Confirm – via `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` and the existing `/mcp` E2E suite – that the tool catalogue already includes the OpenAI facade tools so removing the alias does not drop coverage.

### Validation

- Document findings (affected files, remaining consumers if any) in the plan context.
- No code changes yet—pure analysis.

## Phase 2 – Runtime Removal

### Implementation Tasks

1. Delete alias registration from `apps/oak-curriculum-mcp-streamable-http/src/index.ts` (remove additional transport wiring) and drop the `openai/connector.ts` module if nothing else consumes it.
2. Remove `registerOpenAiConnectorHandlers` usage, migrating any reusable logic into the primary MCP registration only if absolutely necessary to preserve behaviour parity.
3. Update auth middleware (`auth.ts`) to drop alias-specific branches (including `REMOTE_MCP_ALLOW_NO_AUTH_OPENAI`) and ensure bypass logic still complies with the testing strategy.
4. Ensure health endpoints, Accept enforcement (`ensureMcpAcceptHeader`), and logging still behave for `/mcp` once the alias routes disappear.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check`

## Phase 3 – Tests, Harnesses, and Docs

### Implementation Tasks

1. Update Vitest suites (`e2e-tests/server.e2e.test.ts`, any alias-focused specs) to remove `/openai_connector` probes while retaining `/mcp` aggregated tool assertions.
2. Adjust smoke harness modules (`smoke-tests/smoke-assertions/health.ts`, `validation.ts`, `tools.ts`, and shared types) so only `/mcp` is exercised, expect 404s for legacy routes, and tighten remote warning copy.
3. Refresh documentation: README, architecture ADRs, open connector deprecation note—replace references with a migration note, highlight the removal date, and confirm developer guidance references `/mcp` only.
4. Regenerate any recorded analysis snapshots or fixtures impacted by the removal, ensuring logs reference the single `/mcp` surface.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
- Remote preview check: `SMOKE_REMOTE_BASE_URL=<preview>/mcp pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote`

## Phase 4 – CLI Ergonomics (Commander Adoption)

### Implementation Tasks

1. Introduce `commander` in `smoke-tests/smoke-remote.ts` (and any shared CLI helpers) so `--remote-base-url` and future flags are parsed reliably; add the dependency in `package.json`.
2. Maintain support for the existing positional argument to avoid breaking scripts, covering both styles in tests.
3. Add unit coverage (or integration smoke harness tests) that exercises both the positional and flag styles, ensuring `SmokeSuiteOptions` stay schema-aligned.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote -- --remote-base-url <preview-url>`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote -- <preview-url>`

## Phase 5 - Burden of Proof

We need to prove that the remote deployment is fully and correctly operational. The E2E tests and remote smoke tests are already in place, we need to make sure that they are

1. sufficient to prove that the remote deployment is fully and correctly operational.
2. Fully green.

Phase 5 point 1 above requires further investigation and planning before we can proceed, flag this to the user at the appropriate time. Confirm the preview domain (`https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp`) serves the latest build before running the burden-of-proof checks.

## Phase 6 – Final Verification

### Implementation Tasks

1. Run the full quality gates: `pnpm qg`.
2. Run remote smoke against the latest preview deployment and confirm it is fully green (via both commander flag and positional invocation).

### Validation

- Confirm `pnpm qg` green.
- Remote smoke run against the preview deployment (flag + positional) is fully green.
- Context log updated with the removal summary and any follow-up actions.

---

## Phase 7 – Schema Enhancement for Legitimate 404 Responses

### Mission

Enhance the SDK schema generation pipeline to gracefully handle endpoints that return legitimate 404 responses (e.g., lessons without transcripts). This temporary enhancement will patch the SDK-generated schema until the upstream OpenAPI specification is updated to document these expected error responses.

### Problem Statement

The `get-lessons-transcript` tool (and potentially others) fails with validation errors when the upstream API returns `HTTP 404` for resources that legitimately don't exist. The current OpenAPI schema only documents `200` success responses, causing the SDK's validation layer to reject 404 responses as invalid. Some lessons (e.g., non-video lessons) legitimately do not have transcripts, so 404 is expected behavior, not an error state.

**Example failure:**

```
Lesson: "making-apple-flapjack-bites" (maths-primary-ks1/year-2/addition-subtraction-review)
Error: "Execution failed: Invalid response payload. Please match the generated output schema."
Actual API Response: HTTP 404 with { "message": "NOT_FOUND", "statusCode": 404, "error": "Not Found" }
```

### Investigation Summary

1. **Root Cause**: Upstream OpenAPI schema (`packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json`) only defines `200` responses for `/lessons/{lesson}/transcript`.
2. **Actual API Behavior**: Returns `404` for lessons without videos/transcripts (verified via `curl`).
3. **Validation Failure**: SDK's `validateOutput` function (generated from schema) only accepts payloads matching the `200` response schema (`{ transcript: string, vtt: string, canonicalUrl?: string }`).
4. **Current Workaround**: None—tool fails completely for any lesson without a transcript.

### Acceptance Criteria

1. ✅ The `get-lessons-transcript` tool returns a successful result with explicit `null` or empty data when API returns 404.
2. ✅ The enhanced schema includes a documented `404` response with appropriate schema definition.
3. ✅ Fail-fast mechanism prevents silently overwriting upstream documentation if API team adds 404 responses to their schema.
4. ✅ Configuration is centralized, explicit, and includes rationale for each enhanced endpoint.
5. ✅ Full test coverage: unit tests for decorator, integration tests verifying 404 handling, and documentation of the temporary enhancement.
6. ✅ All quality gates remain green throughout implementation.
7. ✅ Upstream API wishlist updated to track the need for proper error response documentation.

### Status Summary

- ✅ **Phase 7.1** – Design and planning (completed 24 October 2025)
- ✅ **Phase 7.2** – Core decorator implementation (completed 24 October 2025)
- ✅ **Phase 7.3** – Pipeline integration (completed 24 October 2025)
- ✅ **Phase 7.4** – Test coverage (completed 24 October 2025)
- ✅ **Phase 7.5** – Documentation and upstream tracking (completed 24 October 2025)
- ✅ **Phase 7.6** – Final validation (completed 24 October 2025)

---

## Phase 7.1 – Design and Planning

**Status (24 October 2025):** Completed. Investigation findings, solution trade-offs, and upstream coordination notes have been locked in, providing the blueprint for schema decoration plus fail-fast expectations.

### Context

The SDK schema generation pipeline follows this flow:

```
typegen.ts
  └─> loadSchema() (from schema-separation-core.ts)
       ├─> fetches & validates original schema
       └─> createOpenCurriculumSchema()
            ├─> original: structuredClone(validated)
            ├─> sdk: decorateCanonicalUrls(validated)
            └─> returns { original, validated, sdk }
```

**Current decorator:** `decorateCanonicalUrls` (in `schema-separation-decorators.ts`) adds `canonicalUrl` fields to response schemas.

**Proposed decorator:** `add404ResponsesWhereExpected` will add 404 response definitions to specific endpoints.

### Design Decision: Approach 1 (Schema Enhancement)

**Rationale:**

- ✅ Keeps all type information flowing from the schema (Cardinal Rule)
- ✅ No runtime shims or bypasses
- ✅ Self-documenting through explicit configuration
- ✅ Temporary by design—fails fast when upstream improves
- ✅ Maintains fail-fast validation throughout the SDK

### Implementation Strategy

1. **Create new decorator**: `schema-enhancement-404.ts` with fail-fast divergence detection
2. **Configuration-driven**: Explicit list of endpoints needing 404 handling with rationale
3. **Compose decorators**: Chain `decorateCanonicalUrls` → `add404ResponsesWhereExpected`
4. **Fail-fast on collision**: Throw clear error if 404 already exists in upstream schema
5. **Test coverage**: Unit tests for decorator logic, integration tests for end-to-end behavior

---

## Phase 7.2 – Core Decorator Implementation

**Status (24 October 2025):** Completed. `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.ts` now defines the configuration, collision detection, and response injection for legitimate 404s, with each entry citing `.agent/plans/upstream-api-metadata-wishlist.md` item #4. The decorator emits a standardised Oak error envelope and an explicit clean-up message for future upstream fixes.

### Implementation Tasks

#### Task 1: Create Configuration Schema

**File:** `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.ts`

```typescript
/**
 * Configuration for endpoints that return legitimate 404 responses
 * not yet documented in the upstream OpenAPI schema.
 *
 * This is a TEMPORARY enhancement. Each entry should have a tracking
 * issue in .agent/plans/upstream-api-metadata-wishlist.md
 */

import type { HttpMethods } from 'openapi-typescript-helpers';

export interface EndpointConfig {
  /** OpenAPI path with {param} syntax */
  readonly path: string;

  /** HTTP method (lowercase) */
  readonly method: HttpMethods;

  /** Why this endpoint legitimately returns 404 */
  readonly reason: string;

  /**
   * Description for the 404 response in generated docs.
   * Should explain when and why 404 is returned.
   */
  readonly responseDescription: string;
}

/**
 * Endpoints that return legitimate 404 responses.
 *
 * ⚠️ REMOVE entries when upstream schema is updated!
 * The decorator will FAIL FAST if it detects upstream has added 404 docs.
 */
export const ENDPOINTS_WITH_LEGITIMATE_404S: readonly EndpointConfig[] = [
  {
    path: '/lessons/{lesson}/transcript',
    method: 'get',
    reason: 'Lessons without videos do not have transcripts',
    responseDescription:
      'Returned when the requested lesson does not have a video transcript. ' +
      'This is expected for non-video lessons and is not an error condition.',
  },
] as const;
```

#### Task 2: Implement Fail-Fast Validator

```typescript
/**
 * Validates that configured endpoints don't already have 404 responses.
 * Fails fast if upstream schema has been updated.
 *
 * @throws TypeError if any configured endpoint already has 404 documented
 */
function validateNoUpstreamCollisions(
  schema: OpenAPIObject,
  configs: readonly EndpointConfig[],
): void {
  const collisions: string[] = [];

  for (const config of configs) {
    const pathItem = schema.paths?.[config.path];
    if (!pathItem || typeof pathItem !== 'object' || '$ref' in pathItem) {
      continue;
    }

    const operation = pathItem[config.method];
    if (!operation || typeof operation !== 'object') {
      continue;
    }

    const responses = operation.responses as ResponsesObject | undefined;
    if (responses?.['404']) {
      collisions.push(`${config.method.toUpperCase()} ${config.path}`);
    }
  }

  if (collisions.length > 0) {
    const plural = collisions.length > 1;
    throw new TypeError(
      `\n` +
        `╔════════════════════════════════════════════════════════════════╗\n` +
        `║  🎉 Schema Enhancement Cleanup Required!                      ║\n` +
        `╚════════════════════════════════════════════════════════════════╝\n\n` +
        `The upstream API schema now documents 404 response${plural ? 's' : ''} for:\n\n` +
        collisions.map((path) => `  • ${path}`).join('\n') +
        `\n\n` +
        `This is GREAT NEWS! The API team has updated their schema.\n\n` +
        `┌─ Action Required ────────────────────────────────────────────┐\n` +
        `│ 1. Remove ${plural ? 'these entries' : 'this entry'} from:                                    │\n` +
        `│    type-gen/schema-enhancement-404.ts                        │\n` +
        `│    (ENDPOINTS_WITH_LEGITIMATE_404S config)                   │\n` +
        `│                                                               │\n` +
        `│ 2. Verify upstream 404 responses match expected behavior     │\n` +
        `│                                                               │\n` +
        `│ 3. Update .agent/plans/upstream-api-metadata-wishlist.md     │\n` +
        `│    (mark item #4 as completed for ${plural ? 'these' : 'this'} endpoint${plural ? 's' : ''})          │\n` +
        `└───────────────────────────────────────────────────────────────┘\n\n` +
        `This error prevents silently overwriting upstream documentation.\n` +
        `Once you remove the config ${plural ? 'entries' : 'entry'}, type generation will succeed.\n`,
    );
  }
}
```

#### Task 3: Implement Core Decorator

```typescript
import type { OpenAPIObject, ResponsesObject } from 'openapi-typescript';

/**
 * Adds 404 response definitions to specific endpoints that legitimately
 * return 404 but aren't yet documented in the upstream OpenAPI schema.
 *
 * This is a TEMPORARY enhancement that will fail fast if/when the upstream
 * schema is updated to include these 404 responses.
 *
 * @param schema - The OpenAPI schema to enhance
 * @returns Enhanced schema with 404 responses added
 * @throws TypeError if any configured endpoint already has 404 documented
 */
export function add404ResponsesWhereExpected(schema: OpenAPIObject): OpenAPIObject {
  // FAIL FAST: Check for upstream collisions before making any changes
  validateNoUpstreamCollisions(schema, ENDPOINTS_WITH_LEGITIMATE_404S);

  const clone = structuredClone(schema);

  if (!clone.paths) {
    return clone;
  }

  for (const config of ENDPOINTS_WITH_LEGITIMATE_404S) {
    add404ToEndpoint(clone, config);
  }

  return clone;
}

/**
 * Adds a 404 response to a specific endpoint
 */
function add404ToEndpoint(schema: OpenAPIObject, config: EndpointConfig): void {
  const pathItem = schema.paths?.[config.path];
  if (!pathItem || typeof pathItem !== 'object' || '$ref' in pathItem) {
    return;
  }

  const operation = pathItem[config.method];
  if (!operation || typeof operation !== 'object') {
    return;
  }

  if (!operation.responses) {
    return;
  }

  const responses = operation.responses as ResponsesObject;

  // Add 404 response definition
  responses['404'] = {
    description: config.responseDescription,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'NOT_FOUND',
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 404,
            },
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Not Found',
            },
          },
          required: ['message', 'statusCode', 'error'],
        },
      },
    },
  };
}
```

**Outcome:** Implemented via `schema-enhancement-404.ts`, using `PathsObject` guards, Oak error envelope examples, and a structured collision summary that points directly to `.agent/plans/upstream-api-metadata-wishlist.md`. The decorator now ships alongside the configuration entry for `/lessons/{lesson}/transcript`.

### Validation

- Create the file with all three components
- Run `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- Run `pnpm --filter @oaknational/oak-curriculum-sdk type-check`

---

## Phase 7.3 – Pipeline Integration

**Status (24 October 2025):** Completed. `createOpenCurriculumSchema` now chains `decorateCanonicalUrls` and `add404ResponsesWhereExpected`, the ingest pipeline notes have been updated, and `pnpm --filter @oaknational/oak-curriculum-sdk type-gen` confirms the generated SDK schema carries the temporary 404 response.

### Implementation Tasks

#### Task 1: Update `schema-separation-core.ts`

**File:** `packages/sdks/oak-curriculum-sdk/type-gen/schema-separation-core.ts`

```typescript
import { decorateCanonicalUrls } from './schema-separation-decorators.js';
import { add404ResponsesWhereExpected } from './schema-enhancement-404.js';

export function createOpenCurriculumSchema(validated: OpenAPIObject): SeparatedSchema {
  assertSchemaHasComponentsSchemas(validated);

  const original = structuredClone(validated);

  // Apply decorators in sequence:
  // 1. Add canonicalUrl fields to response schemas
  // 2. Add legitimate 404 responses where upstream docs are incomplete
  const withCanonicalUrls = decorateCanonicalUrls(validated);
  const sdk = add404ResponsesWhereExpected(withCanonicalUrls);

  return { original, validated, sdk };
}
```

#### Task 2: Update `schema-separation-decorators.ts` Export

Ensure the decorator file properly exports its function:

```typescript
export { decorateCanonicalUrls } from './schema-separation-decorators.js';
```

#### Task 3: Verify Generated Artifacts

After integration, run `pnpm type-gen` and verify:

1. `api-schema-original.json` – unchanged (no 404 for transcript)
2. `api-schema-sdk.json` – includes 404 response for `/lessons/{lesson}/transcript`
3. `response-map.ts` – includes entry for `getLessonTranscript-getLessonTranscript:404`
4. Generated Zod schemas include 404 response validation

### Validation

- `pnpm --filter @oaknational/oak-curriculum-sdk type-gen`
- `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- `pnpm --filter @oaknational/oak-curriculum-sdk type-check`
- Inspect generated files to confirm 404 response appears in SDK schema only

---

## Phase 7.4 – Test Coverage

**Status (24 October 2025):** Completed. Coverage now lives inside `schema-separation.unit.test.ts`, asserting both the injected 404 payload and the fail-fast behaviour, with fixtures updated to expose the transcript path.

### Completed Work

- Extended `packages/sdks/oak-curriculum-sdk/type-gen/schema-separation.unit.test.ts` to prove the SDK-only 404 envelope and the fail-fast collision error.
- Enriched `packages/sdks/oak-curriculum-sdk/type-gen/test-fixtures.ts` so shared fixtures expose the transcript endpoint required by the decorator tests.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-sdk test -- schema-separation`
- `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- `pnpm --filter @oaknational/oak-curriculum-sdk type-check`

---

## Phase 7.5 – Documentation and Upstream Tracking

**Status (24 October 2025):** Completed. Documentation now signposts the temporary decorator, its clean-up trigger, and the upstream wishlist thread, keeping future maintainers aligned with the schema-first contract.

### Completed Work

- Added comprehensive JSDoc to `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.ts`, including temporary status, wishlist reference, and fail-fast description.
- Extended `packages/sdks/oak-curriculum-sdk/type-gen/utils/ingest-pipeline.md` with a dedicated "Schema Enhancement: Legitimate 404 Responses" section covering behaviour, lifecycle, and the celebratory collision error.
- Confirmed `.agent/plans/upstream-api-metadata-wishlist.md` item #4 already tracks the upstream change; decorator text links back to it.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- `pnpm markdownlint:root`

---

## Phase 7.6 – Final Validation

**Status (24 October 2025):** Completed. Remote smoke against the preview build and the full gate sweep (`pnpm make`, `pnpm qg`) both succeeded, so Phase 7 is now closed.

### Implementation Tasks

#### Task 1: End-to-End Verification

Test the actual failing case:

```bash
# Using MCP tool directly
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live

# Should now succeed for lessons without transcripts

# Remote preview (flag and positional)
# First run proved both invocation styles; ongoing verification uses the flag form
LOG_LEVEL=info pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp
```

#### Task 2: Quality Gates

```bash
# Full monorepo validation
pnpm make
pnpm qg

# SDK-specific
pnpm --filter @oaknational/oak-curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-sdk type-check
pnpm --filter @oaknational/oak-curriculum-sdk test
pnpm --filter @oaknational/oak-curriculum-sdk type-gen

# MCP apps
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

#### Task 3: Verify Fail-Fast Mechanism

Manually test fail-fast by temporarily adding a 404 to the original schema:

```bash
# Edit schema-cache/api-schema-original.json
# Add 404 to /lessons/{lesson}/transcript responses
# Run type-gen
pnpm --filter @oaknational/oak-curriculum-sdk type-gen

# Should fail with helpful error message
# Revert change
```

### Validation

- ✅ Remote smoke (flag invocation): `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp`
- ✅ All quality gates green (`pnpm make`, `pnpm qg`)
- ✅ Original failing case now works
- ✅ Fail-fast mechanism verified
- ✅ Documentation complete
- ✅ Context log updated

### Success Criteria

When this phase is complete:

1. `get-lessons-transcript` works for all lessons (with/without transcripts)
2. Generated SDK schema includes 404 responses where configured
3. Pipeline fails fast if upstream adds 404 documentation
4. Full test coverage demonstrates correctness
5. Documentation explains temporary nature and cleanup process
6. All quality gates remain green
