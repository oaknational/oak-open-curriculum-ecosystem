# Plan 08: OpenAI Apps SDK Feature Adoption

**Created**: 2025-11-30  
**Updated**: 2025-11-30 (Phase 0.6 + Phase 1 complete)  
**Status**: 🟡 IN PROGRESS  
**Duration**: ~4-6 days (across phases)  
**Focus**: Comprehensive adoption of OpenAI Apps SDK features for production readiness

**Supersedes**: `.agent/plans/openai-app/oak-openai-app-plan.md` (archived)

---

## Overview

This plan implements all OpenAI Apps SDK features not currently being used by the Oak Curriculum MCP server. These features are critical for production deployment, user experience, and token optimization.

### Goals

1. **Production Readiness**: Implement required security and CSP configurations
2. **Interactive Widgets**: Enable component-initiated tool calls and state persistence
3. **Token Optimization**: Use tool result `_meta` to reduce model token consumption
4. **Enhanced UX**: Add localization, display modes, and follow-up messages
5. **Compliance & Governance**: Privacy, metadata, and operational readiness

### Architectural Principles

These principles govern all implementation work:

- **Primary endpoint**: `apps/oak-curriculum-mcp-streamable-http` deployed at `https://curriculum-mcp-alpha.oaknational.dev/mcp`
- **Schema-first**: All tool metadata sourced from `pnpm type-gen` outputs
- **Pedagogical rigor**: Tool composition follows curriculum alignment → objectives → activities → assessment; outputs cite Oak resource IDs
- **Authentication stance**: Development mode operates unauthenticated (read-only); architecture leaves OAuth hook for production
- **State model**: Requests remain stateless; widget state for UI only
- **Observability**: MCP logging pipeline extended with Apps SDK telemetry (excludes sensitive learner data)

### Current State Analysis (as of 2025-11-30)

Based on codebase inspection:

**Generated Tools (Camp 1)**:

- 23 tools in `MCP_TOOL_DESCRIPTORS`
- **NO `_meta` fields** currently emitted - this is a significant gap
- `ToolDescriptor` contract doesn't define `_meta` interface
- `annotations` (readOnlyHint, etc.) ARE emitted ✅
- `securitySchemes` ARE emitted ✅

**Aggregated Tools (Camp 2)**:

- 4 tools: `search`, `fetch`, `get-help`, `get-ontology`
- `_meta` fields present ✅: `outputTemplate`, `toolInvocation/invoking`, `toolInvocation/invoked`
- Missing: `widgetAccessible`, `visibility`

**Type Safety Issue**:

- `ToolMeta` interface in `universal-tools/types.ts` has `readonly [x: string]: unknown` index signature
- This violates project rules: "Record<string, unknown> is NOT ALLOWED"
- Must be fixed by explicitly enumerating all known OpenAI `_meta` fields

### Foundational Commitments

All work MUST align with:

- [`.agent/directives-and-memory/rules.md`](../../directives-and-memory/rules.md) - Cardinal Rule, TDD, type safety
- [`.agent/directives-and-memory/schema-first-execution.md`](../../directives-and-memory/schema-first-execution.md) - Generator-first architecture
- [`.agent/directives-and-memory/testing-strategy.md`](../../directives-and-memory/testing-strategy.md) - TDD at all levels

### Reference Documentation

All OpenAI Apps SDK reference materials are in `../../reference-docs/openai-apps/`:

- [OpenAI Apps SDK Reference](../../reference-docs/openai-apps/openai-apps-sdk-reference.md) - Core API reference
- [OpenAI Apps SDK Quickstart](../../reference-docs/openai-apps/openai-apps-sdk-quickstart.md) - Getting started guide
- [OpenAI Apps Build MCP Server](../../reference-docs/openai-apps/openai-apps-sdk-build-mcp-server.md) - MCP server integration
- [OpenAI Apps Build UI](../../reference-docs/openai-apps/openai-apps-build-ui.md) - Widget development
- [OpenAI Apps State Management](../../reference-docs/openai-apps/openai-apps-build-state-management.md) - Widget state
- [OpenAI Apps Auth](../../reference-docs/openai-apps/openai-apps-auth.md) - Authentication patterns
- [OpenAI Apps Metadata](../../reference-docs/openai-apps/openai-apps-metadata.md) - Metadata optimization

---

## Two Camps: Universal Coverage Requirement

**CRITICAL PRINCIPLE**: ALL tools, resources, and prompts MUST maximally benefit from OpenAI Apps SDK features, regardless of their origin.

### Camp 1: Type-Gen Time (Schema-Derived)

These are generated at compile time from the Oak Curriculum OpenAPI schema via `pnpm type-gen`:

| Category                    | Count | Source                                                                       |
| --------------------------- | ----- | ---------------------------------------------------------------------------- |
| **Generated Tools**         | 23    | `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/` |
| **Documentation Resources** | TBD   | `DOCUMENTATION_RESOURCES` in SDK                                             |

**Implementation approach**: Update type-gen templates to emit OpenAI `_meta` fields.

**Key Files to Modify**:

1. **Contract Definition** (add `_meta` to `ToolDescriptor` interface):
   - `type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`

2. **Tool Emission** (emit `_meta` values in each tool file):
   - `type-gen/typegen/mcp-tools/parts/emit-index.ts` (contains `buildExports` function)

3. **Response Handling** (emit `_meta` in tool results):
   - `type-gen/typegen/mcp-tools/parts/generate-execute-file.ts`

**Current Generated Tool Structure** (from `get-subjects.ts`):

```typescript
export const getSubjects = {
  invoke: async (client, args) => { /* ... */ },
  name, description, path, method,
  operationId, documentedStatuses, securitySchemes,
  annotations: { readOnlyHint: true, /* ... */ },
  // ⚠️ NO _meta field currently emitted
} as const satisfies ToolDescriptor<...>;
```

### Camp 2: Runtime (Hand-Authored)

These are defined in authored code, not generated:

| Category             | Items                                         | Source                                                                  |
| -------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| **Aggregated Tools** | `search`, `fetch`, `get-help`, `get-ontology` | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-*/`                |
| **MCP Prompts**      | `lesson-planner`, etc.                        | `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`               |
| **Widget Resource**  | `oak-json-viewer`                             | `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` |

**Implementation approach**: Update definition files directly, following existing patterns.

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

### Parity Requirements

Every phase of this plan MUST ensure BOTH camps receive equivalent treatment:

| OpenAI Feature                   | Generated Tools (23) | Aggregated Tools (4) | Resources             |
| -------------------------------- | -------------------- | -------------------- | --------------------- |
| `openai/outputTemplate`          | ❌ NOT IMPLEMENTED   | ✅ Already present   | N/A                   |
| `openai/toolInvocation/invoking` | ❌ NOT IMPLEMENTED   | ✅ Already present   | N/A                   |
| `openai/toolInvocation/invoked`  | ❌ NOT IMPLEMENTED   | ✅ Already present   | N/A                   |
| `openai/widgetAccessible`        | ❌ NOT IMPLEMENTED   | ❌ NOT IMPLEMENTED   | N/A                   |
| `openai/visibility`              | ❌ NOT IMPLEMENTED   | ❌ NOT IMPLEMENTED   | N/A                   |
| `openai/widgetCSP`               | N/A                  | N/A                  | ✅ Phase 1 COMPLETE   |
| `openai/widgetPrefersBorder`     | N/A                  | N/A                  | ✅ Phase 1 COMPLETE   |
| `openai/widgetDescription`       | N/A                  | N/A                  | ✅ Phase 1 COMPLETE   |
| Tool result `_meta`              | ❌ NOT IMPLEMENTED   | ❌ NOT IMPLEMENTED   | N/A                   |
| `annotations.readOnlyHint`       | ✅ Already present   | ✅ Already present   | N/A                   |
| `securitySchemes`                | ✅ Already present   | ✅ Already present   | N/A                   |
| Server HTTP security headers     | N/A                  | N/A                  | ✅ Phase 0.6 COMPLETE |

**Legend**: ✅ = implemented, ❌ = needs work, N/A = not applicable

### Verification Matrix

Each phase completion requires verification across BOTH camps:

```
For each OpenAI feature F being implemented:
  ✓ Generated tools emit F via type-gen
  ✓ Aggregated tools include F in definitions
  ✓ Prompts include F where applicable
  ✓ Resources include F where applicable
  ✓ Unit tests verify F on representative items from each camp
  ✓ Integration tests verify F flows through to MCP registration
```

---

## Feature Gap Analysis

| Feature                               | Priority | Phase | Rationale                                  |
| ------------------------------------- | -------- | ----- | ------------------------------------------ |
| `openai/widgetCSP`                    | CRITICAL | 1     | **Required for production/public release** |
| `openai/widgetPrefersBorder`          | HIGH     | 1     | Better visual presentation                 |
| `openai/widgetDescription`            | HIGH     | 1     | Reduces redundant assistant narration      |
| Full `_meta` on generated tools       | HIGH     | 2     | **Currently missing entirely**             |
| `openai/widgetAccessible`             | HIGH     | 2     | Enables interactive widgets                |
| `window.openai.callTool()`            | HIGH     | 2     | Pagination, refresh, actions               |
| `window.openai.setWidgetState()`      | HIGH     | 2     | UI state persistence                       |
| Tool result `_meta`                   | HIGH     | 3     | Token cost reduction                       |
| `structuredContent` separation        | HIGH     | 3     | Model vs widget data split                 |
| `openai/visibility: private`          | MEDIUM   | 4     | Hidden admin/diagnostic tools              |
| `openai/locale` support               | MEDIUM   | 4     | Internationalization                       |
| `window.openai.sendFollowUpMessage()` | LOW      | 5     | Conversational continuity                  |
| `window.openai.requestDisplayMode()`  | LOW      | 5     | Fullscreen/PiP modes                       |
| `window.openai.openExternal()`        | LOW      | 5     | External links                             |

---

## Open Questions & Decisions

### Resolved

| Question                                             | Decision                                   | Rationale                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Should `widgetAccessible` be universal or selective? | **Universal (`true` for all)**             | All Oak tools are read-only; no security risk from widget-initiated calls; enables pagination/refresh everywhere |
| How to handle `ToolMeta` index signature?            | **Remove it; explicitly enumerate fields** | Index signatures violate project rules; all OpenAI fields are documented and finite                              |

### To Be Confirmed

| Question                                                       | Options                  | Recommendation                                                  |
| -------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------- |
| What's the minimum `structuredContent` for token optimization? | Full data / Summary only | Define per-tool guidelines; recommend ≤5 items + summary counts |

### Confirmed Decisions

| Question                | Decision                          | Notes                                                         |
| ----------------------- | --------------------------------- | ------------------------------------------------------------- |
| Google Fonts CSP        | **Yes, required**                 | Widget uses Google Fonts                                      |
| Oak domains CSP         | **Allow `*.thenational.academy`** | For Oak website links/embeds                                  |
| Iframe CSP              | **Allow iframes**                 | Required for widget functionality                             |
| Private tools (Phase 4) | **Defer**                         | No concrete use case yet; document capability but don't build |

---

## Phase 0: Prerequisites & Developer Mode Setup

**Duration**: ~2-4 hours  
**Priority**: PREREQUISITE - Required before other phases  
**Status**: Partially complete

### Objective

Establish working Developer Mode connector and validation methodology.

### 0.1: Deployment Verification ✅ COMPLETE

- MCP server deployed at `https://curriculum-mcp-alpha.oaknational.dev/mcp`
- Verified via MCP Inspector
- `initialize` and `listTools` handshakes confirmed

### 0.2: Fix STDIO Tool Description Bug

**Intent**: STDIO server overrides rich OpenAPI descriptions with "GET /path" strings, breaking tool discovery.

**File**: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

**Change**:

```typescript
// Replace
const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;
// With
const description =
  descriptor.description ?? `${descriptor.method.toUpperCase()} ${descriptor.path}`;
```

**Validation**: `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`

### 0.3: Developer Mode Connector Setup

**Instructions** (for team reference):

1. Enable Developer Mode: ChatGPT → **Settings → Apps & Connectors → Advanced settings**
2. Create connector: **Settings → Connectors → Create**
3. Configure:
   - **Name**: "Oak Curriculum Explorer"
   - **Description**: "Search and explore Oak National Academy's curriculum - lessons, units, quizzes, and teaching resources across all UK key stages and subjects. Use when educators need curriculum content."
   - **Connector URL**: `https://curriculum-mcp-alpha.oaknational.dev/mcp`
4. Activate in chat: Click **+ → More…**, select the connector
5. Refresh metadata after MCP tool changes

**Docs**: [Developer Mode Setup](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)

### 0.4: Golden Prompt Test Suite

**Intent**: Systematic evaluation of tool discovery following [OpenAI metadata optimization guidance](https://developers.openai.com/apps-sdk/guides/optimize-metadata).

**File**: Create `docs/development/openai-app-golden-prompts.md`

**Content structure**:

| Category        | Example Prompt                               | Expected Tool     | Success Criteria              |
| --------------- | -------------------------------------------- | ----------------- | ----------------------------- |
| **Direct**      | "Find KS3 science lessons on photosynthesis" | `search`          | Tool selected, params correct |
| **Indirect**    | "Help me teach photosynthesis to year 8"     | `search`          | Infers subject/key stage      |
| **Negative**    | "Create a new lesson plan from scratch"      | None              | Our tools NOT invoked         |
| **Composition** | "Show me a quiz for this lesson"             | `get-lesson-quiz` | Correct follow-up tool        |

**Acceptance**: ≥90% correct tool selection; responses cite Oak resource IDs.

### 0.5: Walkthrough Documentation

**Intent**: Shareable artifact proving viability.

**Deliverables** (store under `docs/development/`):

- Connector creation screenshots
- Short video of successful chat interaction
- Sanitized server logs showing tool invocations

### Acceptance Criteria - Phase 0

| Criterion                           | Verification Method                         |
| ----------------------------------- | ------------------------------------------- |
| STDIO bug fixed                     | Unit tests pass                             |
| Connector created in Developer Mode | Manual verification                         |
| Golden prompts documented           | File exists with ≥8 prompts                 |
| Walkthrough captured                | Reviewable artifacts in `docs/development/` |

---

## Phase 0.6: Server-Level HTTP Security Headers ✅ COMPLETE

**Duration**: ~2-3 hours  
**Priority**: HIGH - Protects landing page from XSS/clickjacking  
**Status**: ✅ COMPLETE (2025-11-30)

### Objective

Add comprehensive HTTP security headers to the MCP server using `helmet` middleware.

### Implementation Summary

**Files created/modified**:

| File                                           | Change                                   |
| ---------------------------------------------- | ---------------------------------------- |
| `package.json`                                 | Added `helmet@^8.1.0` dependency         |
| `src/security-headers.ts`                      | NEW - Helmet CSP config and middleware   |
| `src/security-headers.unit.test.ts`            | NEW - Unit tests for CSP directives      |
| `src/security-headers.integration.test.ts`     | NEW - Integration tests for HTTP headers |
| `src/application.ts`                           | Integrated helmet into bootstrap         |
| `src/app/bootstrap-helpers.ts`                 | Added `createSecurityHeaders` phase      |
| `e2e-tests/web-security-selective.e2e.test.ts` | Added security header E2E tests          |

**Security headers enabled**:

| Header                         | Value                                 | Purpose                  |
| ------------------------------ | ------------------------------------- | ------------------------ |
| `Content-Security-Policy`      | Restrictive CSP (see below)           | XSS protection           |
| `X-Content-Type-Options`       | `nosniff`                             | MIME-sniffing prevention |
| `X-Frame-Options`              | `SAMEORIGIN`                          | Clickjacking protection  |
| `Strict-Transport-Security`    | `max-age=15552000; includeSubDomains` | HTTPS enforcement        |
| `Cross-Origin-Resource-Policy` | `cross-origin`                        | MCP client compatibility |
| `Cross-Origin-Opener-Policy`   | `same-origin-allow-popups`            | OAuth flow support       |

**CSP directives for landing page**:

```
default-src 'self';
script-src 'none';          # No JavaScript on landing page
style-src 'self' 'unsafe-inline' fonts.googleapis.com;
font-src fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';          # Chrome DevTools compatibility
frame-ancestors 'self';
```

### Acceptance Criteria - Phase 0.6 ✅

| Criterion                                       | Status |
| ----------------------------------------------- | ------ |
| `helmet` dependency added                       | ✅     |
| CSP blocks scripts on landing page              | ✅     |
| CSP allows Google Fonts                         | ✅     |
| X-Content-Type-Options on all responses         | ✅     |
| Cross-Origin-Resource-Policy allows MCP clients | ✅     |
| Unit tests pass                                 | ✅     |
| Integration tests pass                          | ✅     |
| E2E tests pass                                  | ✅     |
| MCP protocol endpoints still work               | ✅     |

---

## Phase 1: Widget Resource Metadata ✅ COMPLETE

**Duration**: ~4-6 hours  
**Priority**: CRITICAL - Required for production  
**Status**: ✅ COMPLETE (2025-11-30)

### Objective

Add required `_meta` fields to the widget resource registration for production deployment.

### Implementation Summary

**Files modified**:

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` - Added `WIDGET_CSP`, `WIDGET_DESCRIPTION` constants and `_meta` fields to widget resource
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts` - Added 8 integration tests for `_meta` fields

### 1.1: Add Widget CSP Configuration

**Why**: `openai/widgetCSP` is **required before broad distribution** according to OpenAI documentation.

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation** (following TDD):

1. **RED**: Write integration test specifying widget resource includes `_meta` with CSP

```typescript
// register-resources.integration.test.ts
describe('registerWidgetResource', () => {
  it('includes openai/widgetCSP in resource _meta', async () => {
    // ... test widget resource has CSP configuration
  });

  it('includes openai/widgetPrefersBorder in resource _meta', async () => {
    // ...
  });

  it('includes openai/widgetDescription in resource _meta', async () => {
    // ...
  });
});
```

2. **GREEN**: Implement `_meta` on widget resource contents

```typescript
// In register-resources.ts
contents: [
  {
    uri: AGGREGATED_TOOL_WIDGET_URI,
    mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
    text: AGGREGATED_TOOL_WIDGET_HTML,
    _meta: {
      'openai/widgetPrefersBorder': true,
      'openai/widgetDescription':
        'Oak National Academy curriculum explorer showing lessons, units, quizzes, and teaching resources.',
      'openai/widgetCSP': {
        // Allow connections to Oak domains for API calls
        connect_domains: ['https://*.thenational.academy'],
        // Allow Google Fonts (Lexend) and Oak domains for resources
        resource_domains: [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'https://*.thenational.academy',
        ],
        // Note: Widget is inherently protected from arbitrary iframe embedding
        // because it's served via MCP resources, not a public URL.
        // Only ChatGPT can access MCP resources through the protocol.
      },
    },
  },
];
```

3. **REFACTOR**: Extract constants to dedicated module if needed

### 1.2: Type Definitions for Widget Metadata

**Files to create/modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/widget-metadata.ts` (new)

**Implementation**:

Define strongly-typed interfaces for widget `_meta` fields:

```typescript
/**
 * OpenAI Apps SDK widget resource metadata.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */
export interface WidgetResourceMeta {
  /** Human-readable summary to reduce assistant narration */
  readonly 'openai/widgetDescription'?: string;
  /** Hint for bordered card rendering */
  readonly 'openai/widgetPrefersBorder'?: boolean;
  /** Content Security Policy for the widget sandbox */
  readonly 'openai/widgetCSP'?: WidgetCSP;
  /** Dedicated subdomain for the widget */
  readonly 'openai/widgetDomain'?: string;
}

export interface WidgetCSP {
  /** Domains allowed for fetch/XHR (connect-src) */
  readonly connect_domains: readonly string[];
  /** Domains allowed for images, fonts, etc. (resource-src) */
  readonly resource_domains: readonly string[];
}
```

### Acceptance Criteria - Phase 1 ✅

| Criterion                                                   | Status                     |
| ----------------------------------------------------------- | -------------------------- |
| Widget resource includes `openai/widgetCSP`                 | ✅                         |
| CSP allows Google Fonts domains                             | ✅                         |
| CSP allows `*.thenational.academy` domains                  | ✅                         |
| Widget resource includes `openai/widgetPrefersBorder: true` | ✅                         |
| Widget resource includes `openai/widgetDescription`         | ✅                         |
| Description is ≤200 characters and meaningful               | ✅                         |
| `WidgetResourceMeta` type exported from SDK                 | ⏭️ Deferred (not blocking) |
| Documentation resources have appropriate `_meta`            | ⏭️ Deferred (not blocking) |
| All existing tests pass                                     | ✅                         |
| Type-check passes                                           | ✅                         |
| Lint passes                                                 | ✅                         |

**Camp Coverage - Phase 1**:

- Resources: Widget resource ✅, Documentation resources ⏭️ (deferred)

---

## Phase 2: Interactive Widget Capabilities

**Duration**: ~8-12 hours  
**Priority**: HIGH - Enables rich UX

### Objective

Enable the widget to call tools directly and persist UI state across renders.

### 2.1: Fix Type Interface Index Signatures (TYPE SAFETY PREREQUISITE)

**Why**: Both `ToolMeta` and `ToolAnnotations` interfaces have `readonly [x: string]: unknown` which violates project rules.

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`

**Current (INVALID)**:

```typescript
export interface ToolAnnotations {
  readonly [x: string]: unknown; // ❌ VIOLATES RULES
  readonly readOnlyHint?: boolean;
  // ...
}

export interface ToolMeta {
  readonly [x: string]: unknown; // ❌ VIOLATES RULES
  readonly 'openai/outputTemplate'?: string;
  // ...
}
```

**Fixed (EXPLICIT ENUMERATION)**:

```typescript
/**
 * MCP tool annotations providing hints about tool behavior.
 *
 * All annotation fields are explicitly enumerated per MCP specification.
 * No index signature - every field must be known at compile time.
 *
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/#annotations-object
 */
export interface ToolAnnotations {
  /** Whether the tool only reads data and doesn't modify state */
  readonly readOnlyHint?: boolean;
  /** Whether the tool might cause destructive/irreversible changes */
  readonly destructiveHint?: boolean;
  /** Whether repeated calls with same args produce same result */
  readonly idempotentHint?: boolean;
  /** Whether the tool interacts with external systems beyond the MCP server */
  readonly openWorldHint?: boolean;
  /** Human-readable title for the tool */
  readonly title?: string;
}

/**
 * OpenAI Apps SDK metadata for tool descriptors.
 *
 * All known OpenAI _meta fields are explicitly enumerated per project rules.
 * No index signature - every field must be known at compile time.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */
export interface ToolMeta {
  /** URI of widget resource to render tool output (text/html+skybridge) */
  readonly 'openai/outputTemplate'?: string;
  /** Status text shown while tool is running (max 64 characters) */
  readonly 'openai/toolInvocation/invoking'?: string;
  /** Status text shown after tool completes (max 64 characters) */
  readonly 'openai/toolInvocation/invoked'?: string;
  /** Allow widget to call this tool via window.openai.callTool() */
  readonly 'openai/widgetAccessible'?: boolean;
  /** Tool visibility: 'public' (default) or 'private' (hidden from model) */
  readonly 'openai/visibility'?: 'public' | 'private';
  /** Mirror securitySchemes for clients that only read _meta */
  readonly securitySchemes?: readonly SecurityScheme[];
}
```

### 2.2: Enable `widgetAccessible` on Tools

**Why**: Required for `window.openai.callTool()` to work from the widget.

**Schema-First Approach** (per `schema-first-execution.md`):

The `_meta["openai/widgetAccessible"]` field must be added at **type-gen time**, not runtime.

**Files to modify (Camp 1 - Generated Tools)**:

1. **Contract**: `type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`
   - Add `_meta` field to `ToolDescriptor` interface

2. **Emission**: `type-gen/typegen/mcp-tools/parts/emit-index.ts`
   - Emit `_meta` object in `buildExports()` function

**Implementation Pattern for Generated Tools**:

```typescript
// In emit-index.ts buildExports() function, add _meta emission:
export const ${descriptorName} = {
  // ... existing fields ...
  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': '${generateInvokingText(toolName)}',
    'openai/toolInvocation/invoked': '${generateInvokedText(toolName)}',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
    securitySchemes: ${securitySchemesLiteral},
  },
} as const satisfies ToolDescriptor<...>;
```

**Design Decision: `widgetAccessible` Default**

OpenAI's default is `false`. We set `true` for ALL tools because:

- All Oak tools are read-only (curriculum browsing)
- Widget refresh/pagination benefits all tools
- No security risk from widget-initiated calls

If selective control is needed later, add a configuration to type-gen.

**Verification**: After `pnpm type-gen`, check that ALL 23 generated tool descriptors include `_meta` with all fields.

### 2.3: Update Aggregated Tool Definitions (Camp 2)

**Files to update** (already have partial `_meta`, need new fields):

| File                                   | Current `_meta`                      | Add                              |
| -------------------------------------- | ------------------------------------ | -------------------------------- |
| `aggregated-search/tool-definition.ts` | ✅ outputTemplate, invoking, invoked | `widgetAccessible`, `visibility` |
| `aggregated-fetch.ts`                  | ✅ outputTemplate, invoking, invoked | `widgetAccessible`, `visibility` |
| `aggregated-help/definition.ts`        | ✅ outputTemplate, invoking, invoked | `widgetAccessible`, `visibility` |
| `aggregated-ontology.ts`               | ✅ outputTemplate, invoking, invoked | `widgetAccessible`, `visibility` |

**Pattern**:

```typescript
// Example: aggregated-search/tool-definition.ts
_meta: {
  'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
  'openai/toolInvocation/invoking': 'Searching curriculum…',
  'openai/toolInvocation/invoked': 'Search complete',
  'openai/widgetAccessible': true,   // ← ADD
  'openai/visibility': 'public',      // ← ADD
},
```

### 2.4: Implement Widget Tool Calling

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation** (TDD):

1. **RED**: Write Playwright test for widget tool calling

```typescript
// tests/widget/widget-tool-calls.spec.ts
test.describe('Widget tool calls', () => {
  test('refresh button calls search tool with same query', async ({ page }) => {
    // Setup: render widget with search results
    // Action: click refresh button
    // Assert: callTool was invoked with expected args
  });
});
```

2. **GREEN**: Add tool-calling capability to widget HTML:

```javascript
// In widget script
async function refreshSearch() {
  if (!window.openai?.callTool) return;
  const currentQuery = window.openai.toolInput?.query;
  if (!currentQuery) return;

  const response = await window.openai.callTool('search', { query: currentQuery });
  // Response updates toolOutput automatically via set_globals event
}
```

3. **REFACTOR**: Add error handling and loading states

### 2.5: Implement Widget State Persistence

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
// Widget state management
let widgetState = window.openai?.widgetState ?? {
  expandedSections: [],
  scrollPosition: 0,
};

function updateState(newState) {
  widgetState = { ...widgetState, ...newState };
  window.openai?.setWidgetState?.(widgetState);
}

// Restore state on render
function restoreState() {
  if (widgetState.scrollPosition > 0) {
    document.documentElement.scrollTop = widgetState.scrollPosition;
  }
}

// Save scroll position on interaction
document.addEventListener(
  'scroll',
  () => {
    updateState({ scrollPosition: document.documentElement.scrollTop });
  },
  { passive: true },
);
```

### Acceptance Criteria - Phase 2

| Criterion                                                    | Verification Method |
| ------------------------------------------------------------ | ------------------- |
| `ToolMeta` type includes `widgetAccessible` and `visibility` | Type compilation    |
| Widget can call `search` tool                                | Playwright test     |
| Widget persists scroll position                              | Playwright test     |
| Widget restores state on re-render                           | Playwright test     |
| No regression in existing tests                              | `pnpm test:all`     |

**Camp Coverage - Phase 2** (BOTH camps must have full `_meta`):

| Camp           | Tool           | Full `_meta`    | Verification                        |
| -------------- | -------------- | --------------- | ----------------------------------- |
| **Generated**  | All 23 tools   | ☐ via type-gen  | Unit test on `MCP_TOOL_DESCRIPTORS` |
| **Aggregated** | `search`       | ☐ in definition | Unit test on descriptor             |
| **Aggregated** | `fetch`        | ☐ in definition | Unit test on descriptor             |
| **Aggregated** | `get-help`     | ☐ in definition | Unit test on descriptor             |
| **Aggregated** | `get-ontology` | ☐ in definition | Unit test on descriptor             |

**Type-Gen Verification** (for Camp 1):

```bash
# After implementation:
pnpm type-gen
# Verify generated file has _meta:
grep -l "openai/widgetAccessible" packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/*.ts | wc -l
# Should output: 23 (all generated tools)
```

**Unit Test Requirement**:

```typescript
// universal-tools.unit.test.ts
describe('generated tool _meta fields', () => {
  const allTools = Object.values(MCP_TOOL_DESCRIPTORS);

  it.each(allTools)('$name has complete _meta', (tool) => {
    expect(tool._meta).toBeDefined();
    expect(tool._meta['openai/outputTemplate']).toBe('ui://widget/oak-json-viewer.html');
    expect(tool._meta['openai/widgetAccessible']).toBe(true);
    expect(tool._meta['openai/visibility']).toBe('public');
  });
});
```

---

## Phase 3: Tool Result Token Optimization

**Duration**: ~6-8 hours  
**Priority**: HIGH - Reduces API costs

### Objective

Use tool result `_meta` to send large/detailed data only to the widget, keeping `structuredContent` minimal for the model.

### 3.1: Define Tool Result Structure

**Schema-First Approach**:

Tool result types must be defined in SDK type-gen, not hand-authored.

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-result.ts` (new)
- Update aggregated tool handlers

**Implementation**:

```typescript
/**
 * MCP tool result with OpenAI Apps SDK optimizations.
 *
 * - `structuredContent`: Minimal data the model needs to understand the result
 * - `content`: Human-readable summary for conversation
 * - `_meta`: Full data for widget rendering (hidden from model)
 *
 * @see https://developers.openai.com/apps-sdk/reference#tool-results
 */
export interface OptimizedToolResult<TStructured, TMeta = unknown> {
  /** Minimal structured data for model reasoning */
  readonly structuredContent: TStructured;
  /** Human-readable summary */
  readonly content: readonly ContentItem[];
  /** Full data for widget only (not sent to model) */
  readonly _meta?: TMeta;
}

export interface ContentItem {
  readonly type: 'text';
  readonly text: string;
}
```

### 3.2: Update Search Tool to Use `_meta`

**Current** (all data goes to model):

```typescript
return {
  structuredContent: {
    status: 'success',
    data: { lessons: fullLessonData, transcripts: fullTranscriptData },
  },
};
```

**Optimized** (minimal to model, full to widget):

```typescript
return {
  structuredContent: {
    status: 'success',
    summary: `Found ${lessons.length} lessons and ${transcripts.length} transcripts`,
    lessonTitles: lessons.slice(0, 5).map((l) => l.lessonTitle),
    hasMore: lessons.length > 5,
  },
  content: [
    {
      type: 'text',
      text: `Found ${lessons.length} lessons matching "${query}".`,
    },
  ],
  _meta: {
    fullResults: { lessons, transcripts },
    query,
    timestamp: Date.now(),
  },
};
```

### 3.3: Update Widget to Read `_meta`

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
function render() {
  // Prefer _meta for full data, fall back to structuredContent
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};

  const fullResults = meta.fullResults ?? output.data;
  // ... render using fullResults
}
```

### Acceptance Criteria - Phase 3

| Criterion                                              | Verification Method |
| ------------------------------------------------------ | ------------------- |
| Widget renders from `_meta.fullResults`                | Playwright test     |
| Widget falls back to `structuredContent` if no `_meta` | Playwright test     |
| Model token usage reduced by ≥50% for large results    | Manual verification |
| No regression in search functionality                  | Integration test    |

**Camp Coverage - Phase 3** (BOTH camps must optimize results):

| Camp           | Tool           | `_meta` in Results | Verification                                    |
| -------------- | -------------- | ------------------ | ----------------------------------------------- |
| **Generated**  | All API tools  | ✅ via execute.ts  | Integration test on tool execution              |
| **Aggregated** | `search`       | ✅ in handler      | Unit test - `structuredContent` ≤10 items       |
| **Aggregated** | `fetch`        | ✅ in handler      | Unit test - summary in content, full in `_meta` |
| **Aggregated** | `get-help`     | ✅ in handler      | Unit test - concise structured, full in `_meta` |
| **Aggregated** | `get-ontology` | ✅ in handler      | Unit test - summary in content, full in `_meta` |

**Token Optimization Pattern** (apply to ALL tools):

```typescript
// Minimal for model reasoning
structuredContent: { summary: '...', count: N, topItems: [...].slice(0,5) }
// Full for widget rendering
_meta: { fullData: [...], query: '...', timestamp: Date.now() }
```

---

## Phase 4: Tool Visibility and Localization

**Duration**: ~4-6 hours  
**Priority**: MEDIUM  
**Status**: 🟡 PARTIALLY DEFERRED - Private tools deferred until use case emerges

### Objective

Add private tool support and basic localization.

### 4.1: Private Tool Support (DEFERRED)

> **Decision**: Private tools capability is documented but NOT implemented until a concrete use case emerges. The type infrastructure (`openai/visibility`) is added in Phase 2, but no private tools are created.

**Use Case** (future): Internal diagnostic/admin tools hidden from model but callable from widget.

**Example Pattern** (for future reference):

```typescript
// Example: Rate limit info tool (widget-only) - NOT IMPLEMENTED YET
const RATE_LIMIT_INFO_DEF = {
  name: 'get-rate-limit-info',
  description: 'Internal: Returns current rate limit status',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true },
  _meta: {
    'openai/widgetAccessible': true,
    'openai/visibility': 'private', // Hidden from model
  },
};
```

**When to implement**: When we identify a tool that should be callable from widget but NOT shown to the model (e.g., diagnostics, admin functions, rate limit checks).

### 4.2: Locale Support

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
// Read locale from OpenAI client context
const locale = window.openai?.locale ?? 'en-GB';

// Format dates according to locale
function formatDate(dateStr) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(dateStr));
}

// Adjust terminology for locale
function getKeyStageLabel(ks) {
  // UK-specific terminology
  return `Key Stage ${ks.replace('ks', '')}`;
}
```

### Acceptance Criteria - Phase 4

| Criterion                                                  | Verification Method |
| ---------------------------------------------------------- | ------------------- |
| Private tools not listed in `tools/list` response to model | E2E test            |
| Private tools callable via widget `callTool()`             | Playwright test     |
| Widget reads `window.openai.locale`                        | Playwright test     |
| Dates formatted according to locale                        | Playwright test     |

**Camp Coverage - Phase 4** (visibility support in BOTH camps):

| Camp           | Implementation                              | Verification                       |
| -------------- | ------------------------------------------- | ---------------------------------- |
| **Generated**  | Type-gen template emits `openai/visibility` | Unit test on generated descriptors |
| **Aggregated** | Definitions include `openai/visibility`     | Unit test on each aggregated tool  |
| **Prompts**    | N/A (prompts always visible)                | -                                  |

**Private Tool Examples**:

- `get-rate-limit-info` (diagnostic, widget-only)
- `debug-ontology` (admin, widget-only)

---

## Phase 5: Enhanced Widget Runtime Features

**Duration**: ~4-6 hours  
**Priority**: LOW - Nice-to-have UX improvements

### Objective

Implement remaining widget runtime APIs for enhanced user experience.

### 5.1: Follow-Up Messages

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
// Add "Ask about this" button for lessons
async function askAboutLesson(lesson) {
  await window.openai?.sendFollowUpMessage?.({
    prompt: `Tell me more about the lesson "${lesson.lessonTitle}" - what are the key learning objectives?`,
  });
}
```

### 5.2: External Links

**Implementation**:

```javascript
// Use openExternal for Oak website links
function openOnOakWebsite(url) {
  if (window.openai?.openExternal) {
    window.openai.openExternal({ href: url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
```

### 5.3: Display Mode Requests

**Implementation**:

```javascript
// Request fullscreen for curriculum browsing
async function requestFullscreen() {
  const result = await window.openai?.requestDisplayMode?.({ mode: 'fullscreen' });
  if (result?.mode === 'fullscreen') {
    document.body.classList.add('fullscreen');
  }
}
```

### Acceptance Criteria - Phase 5

| Criterion                                        | Verification Method |
| ------------------------------------------------ | ------------------- |
| "Ask about this" triggers follow-up message      | Playwright test     |
| External links use `openExternal` when available | Playwright test     |
| Fullscreen mode request handled gracefully       | Playwright test     |
| Fallback behavior works when APIs unavailable    | Playwright test     |

---

## Phase 6: Production Readiness & Compliance

**Duration**: ~4-8 hours  
**Priority**: REQUIRED for public release  
**Dependencies**: Phases 1-3 complete

### Objective

Ensure compliance with [OpenAI App Developer Guidelines](https://developers.openai.com/apps-sdk/app-developer-guidelines) and prepare operational documentation.

### 6.1: App Metadata Requirements

**Deliverables** (store in `docs/openai-app/`):

| Field           | Content                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | "Oak Curriculum Explorer"                                                                                                                                         |
| **Description** | "Access Oak National Academy's openly licensed curriculum - search lessons, units, quizzes, and teaching resources across UK key stages. Designed for educators." |
| **Categories**  | Education, Teaching Resources                                                                                                                                     |
| **Icon**        | Oak logo (verify licensing)                                                                                                                                       |

**Guidelines compliance**:

- ❌ No impersonation of other educational platforms
- ✅ Clear identification as Oak National Academy tool
- ✅ Accurate capability description

### 6.2: Privacy & Data Governance

**Audit checklist**:

| Check                            | Status | Notes                    |
| -------------------------------- | ------ | ------------------------ |
| No location fields requested     | ☐      | Verify all tool inputs   |
| No sensitive categories          | ☐      | No health/finance/etc.   |
| No chat history reconstruction   | ☐      | Tools are stateless      |
| Telemetry matches privacy policy | ☐      | Only resource IDs logged |
| No PII in tool outputs           | ☐      | Curriculum data only     |

**Deliverables**:

- Data flow diagram in `docs/architecture/data-flow.md`
- Privacy policy addendum if needed
- Support contact channel: `curriculum-support@thenational.academy`

### 6.3: Architectural Documentation

**Deliverables** (create in `docs/architecture/`):

1. **openai-app-architecture.md**: Diagram showing:

   ```
   OpenAPI Schema → type-gen → SDK → MCP Server → ChatGPT
   ```

2. **tool-composition-patterns.md**: Pedagogical workflows:
   - **Lesson discovery**: `search` → browse results
   - **Lesson deep-dive**: `get-lesson-summary` → `get-lesson-quiz` → `get-lesson-downloads`
   - **Curriculum exploration**: `get-ontology` → `get-subjects` → `get-units`

### 6.4: Operational Runbook

**File**: `docs/development/openai-app-runbook.md`

**Content**:

| Scenario              | Action                                               |
| --------------------- | ---------------------------------------------------- |
| Tool metadata changes | Refresh connector in ChatGPT Settings                |
| New tool added        | Run `pnpm type-gen`, redeploy, refresh connector     |
| Widget HTML changes   | Redeploy app, no connector refresh needed            |
| Breaking API change   | Version bump, update tool descriptions, notify users |
| Incident response     | Disable connector, investigate, redeploy             |

**Re-submission triggers**:

- New tools added
- Security scheme changes
- Major capability changes
- Privacy policy updates

### 6.5: Developer Verification

**Requirements** (when App Store opens):

| Requirement             | Status                                     |
| ----------------------- | ------------------------------------------ |
| Legal entity verified   | ☐ Oak National Academy                     |
| Support mailbox active  | ☐ `curriculum-support@thenational.academy` |
| Contact details current | ☐ Verify quarterly                         |

### Acceptance Criteria - Phase 6

| Criterion                     | Verification Method               |
| ----------------------------- | --------------------------------- |
| App metadata documented       | File exists in `docs/openai-app/` |
| Privacy audit complete        | Checklist signed off              |
| Architecture diagrams created | Files in `docs/architecture/`     |
| Runbook documented            | File exists with all scenarios    |
| No sensitive fields in tools  | Automated lint check              |

---

## Implementation Order and Dependencies

```
Phase 0: Prerequisites & Developer Mode Setup
    ↓ (PREREQUISITE - partially complete)
Phase 0.6: Server-Level HTTP Security Headers ✅ COMPLETE
    ↓
Phase 1: Widget Resource Metadata ✅ COMPLETE
    ↓
Phase 2: Interactive Widget Capabilities ← NEXT
    ↓ (depends on Phase 1 for CSP)
Phase 3: Tool Result Token Optimization
    ↓ (can run parallel to Phase 2)
Phase 4: Tool Visibility and Localization
    ↓ (depends on Phase 2 for widgetAccessible)
Phase 5: Enhanced Widget Runtime Features
    ↓ (depends on Phase 2 for interactive capabilities)
Phase 6: Production Readiness & Compliance
    (depends on Phases 1-3; required for public release)
```

**Recommended execution**:

1. Phase 0 first (complete prerequisites, fix STDIO bug)
2. Phase 1 immediately after (blocks production)
3. Phases 2 and 3 in parallel
4. Phase 4 after Phase 2
5. Phase 5 as time permits
6. Phase 6 before any public release

---

## Testing Strategy

Per [testing-strategy.md](../../directives-and-memory/testing-strategy.md):

### Unit Tests (Pure Functions)

- Widget metadata constant validation
- Tool result structure validation
- Locale formatting functions

**Location**: `*.unit.test.ts` next to source files

### Integration Tests (Code Units Working Together)

- Widget resource registration with `_meta`
- Tool handlers returning optimized results

**Location**: `*.integration.test.ts` next to source files

### E2E Tests (Running System)

- Widget renders correctly in ChatGPT sandbox
- Tool calls from widget work end-to-end

**Location**: `e2e-tests/*.e2e.test.ts`

### Playwright Tests (UI)

- Widget state persistence
- Tool refresh functionality
- Follow-up message buttons

**Location**: `tests/widget/*.spec.ts`

---

## Schema-First Compliance

Per [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md):

| Requirement                               | Current State | After Implementation |
| ----------------------------------------- | ------------- | -------------------- |
| `_meta` fields generated at type-gen time | ❌ NOT YET    | ✅ Phase 2           |
| No hand-authored type widening            | ⚠️ Fix needed | ✅ Phase 2           |
| Runtime files are thin facades            | ✅ Compliant  | ✅ Maintained        |
| Generator is single source of truth       | ✅ Compliant  | ✅ Maintained        |

**Current Issue**: `ToolMeta` interface has index signature `[x: string]: unknown` which is hand-authored type widening. This MUST be fixed in Phase 2.

### Prohibited Practices to Verify

- ❌ No `as unknown` or type assertions
- ❌ No manual editing of generated files
- ❌ No fallbacks for missing descriptors
- ❌ No re-validation in runtime code
- ❌ No index signatures on metadata interfaces

---

## Risk Mitigation

| Risk                                    | Mitigation                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| CSP blocks Google Fonts                 | Test in MCP Inspector before deployment                                        |
| `callTool` not available in all clients | Graceful degradation, check for API presence                                   |
| Widget state lost on client update      | Persist minimal state, rebuild from tool output                                |
| Token optimization breaks clients       | Feature flag, gradual rollout                                                  |
| **Type drift**                          | Ground all interfaces in `pnpm type-gen`; fail build on manual schema changes  |
| **Privacy non-compliance**              | Automated lint to reject sensitive fields; periodic reviews                    |
| **App review rejection**                | Pre-flight checklist against guideline clauses; evidence of each control       |
| **Distribution risk**                   | Apps SDK in preview; restrict to Developer Mode testers until submission opens |
| **Admin dependency**                    | Document workspace admin steps; identify backup admins                         |
| **Tool discovery failures**             | Golden prompt test suite; iterate on descriptions per metadata guide           |

---

## Success Metrics

| Metric                             | Target             | Measurement              |
| ---------------------------------- | ------------------ | ------------------------ |
| Production CSP configured          | 100%               | Deployment checklist     |
| Generated tools have `_meta`       | 23/23 tools        | Unit test on descriptors |
| Aggregated tools have full `_meta` | 4/4 tools          | Unit test on descriptors |
| Widget accessibility enabled       | All 27 tools       | Tool descriptor audit    |
| `ToolMeta` type safety fixed       | No index signature | Type-check passes        |
| Token reduction for large results  | ≥50%               | Before/after comparison  |
| Widget state persistence           | Works              | Playwright test suite    |
| All tests passing                  | 100%               | CI pipeline              |
| Golden prompt accuracy             | ≥90%               | Manual testing           |
| Privacy audit complete             | 100%               | Signed checklist         |
| Architecture docs created          | 100%               | File existence           |
| Operational runbook complete       | 100%               | All scenarios documented |

---

## Universal Coverage Checklist

**Before marking any phase complete**, verify ALL items from BOTH camps:

### Tools Checklist

| Feature                          | Generated Tools (23)   | Aggregated Tools (4)            |
| -------------------------------- | ---------------------- | ------------------------------- |
| `openai/outputTemplate`          | ☐ Type-gen (Phase 2)   | ✅ Already present              |
| `openai/toolInvocation/invoking` | ☐ Type-gen (Phase 2)   | ✅ Already present              |
| `openai/toolInvocation/invoked`  | ☐ Type-gen (Phase 2)   | ✅ Already present              |
| `openai/widgetAccessible`        | ☐ Type-gen (Phase 2)   | ☐ search, fetch, help, ontology |
| `openai/visibility`              | ☐ Type-gen (Phase 2)   | ☐ search, fetch, help, ontology |
| Tool result `_meta`              | ☐ execute.ts (Phase 3) | ☐ Each handler (Phase 3)        |
| `annotations.readOnlyHint`       | ✅ Already done        | ✅ Already done                 |
| `securitySchemes`                | ✅ Already done        | ✅ Already done                 |

### Resources Checklist

| Feature                      | Widget Resource | Documentation Resources |
| ---------------------------- | --------------- | ----------------------- |
| `openai/widgetCSP`           | ✅              | N/A                     |
| `openai/widgetPrefersBorder` | ✅              | N/A                     |
| `openai/widgetDescription`   | ✅              | ☐ (if applicable)       |

### Prompts Checklist

| Feature                 | MCP Prompts            |
| ----------------------- | ---------------------- |
| Proper argument schemas | ☐ lesson-planner, etc. |
| Integration with widget | ☐ If applicable        |

---

## Final Verification

Run these commands after ALL phases complete:

```bash
# 1. Type-gen produces all metadata
pnpm type-gen

# 2. All tests pass (both camps covered)
pnpm test:all

# 3. Lint passes
pnpm lint

# 4. Type-check passes
pnpm type-check

# 5. E2E tests verify runtime behavior
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# 6. Playwright tests verify widget functionality
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui
```

---

## References

### Internal Documentation

- [Rules](../../directives-and-memory/rules.md)
- [Schema-First Execution](../../directives-and-memory/schema-first-execution.md)
- [Testing Strategy](../../directives-and-memory/testing-strategy.md)
- [Plan 01: Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md)
- [Plan 02: Curriculum Ontology Resource](./02-curriculum-ontology-resource-plan.md)

### Archived Plans (Superseded)

- [Oak OpenAI App Plan](../archive/oak-openai-app-plan.archived.md) - Original implementation plan, consolidated into this document

### External Documentation (Authoritative Sources)

- [OpenAI Apps SDK Reference](https://developers.openai.com/apps-sdk/reference)
- [OpenAI Apps SDK: Build MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)
- [OpenAI Apps SDK: Build ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [OpenAI Apps SDK: State Management](https://developers.openai.com/apps-sdk/build/state-management)
- [OpenAI Apps SDK: Optimize Metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata)
- [OpenAI Apps SDK: App Developer Guidelines](https://developers.openai.com/apps-sdk/app-developer-guidelines)
- [Developer Mode Setup](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)
- [MCP Specification: Tools](https://spec.modelcontextprotocol.io/specification/server/tools/)

**Note**: Local copies of OpenAI docs are maintained in `../../reference-docs/openai-apps/` for offline reference.
