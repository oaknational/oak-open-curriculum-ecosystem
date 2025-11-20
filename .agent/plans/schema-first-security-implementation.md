# MCP OAuth Security Implementation Plan

**Status**: Phase 0 Complete - Ready for Implementation  
**Date**: 2024-11-20  
**Last Updated**: 2025-11-20  
**Phase 0 Decision**: ✅ PROCEED (Clerk verified compatible)

## Executive Summary

This plan implements per-tool OAuth 2.1 security metadata for MCP tools to enable ChatGPT compatibility. Security policy is defined in a central configuration file, applied at type-generation time, and enforced at runtime through generated tool descriptors.

**Core Principle**: MCP server authentication policy is defined once in a configuration file. The generator reads this policy, emits security metadata in tool descriptors, and runtime enforces it. Single source of truth for all MCP OAuth requirements.

## Foundation Documents

This plan MUST be executed in strict compliance with:

- [`.agent/directives-and-memory/rules.md`](../directives-and-memory/rules.md) - Core rules, ALWAYS followed
- [`.agent/directives-and-memory/schema-first-execution.md`](../directives-and-memory/schema-first-execution.md) - Non-negotiable generator/runtime contract
- [`docs/agent-guidance/testing-strategy.md`](../../docs/agent-guidance/testing-strategy.md) - TDD approach

**Mandatory re-reading**: At the start of each phase and after any significant blocker, re-read these documents to ensure continued alignment.

## Problem Statement

### Current State (Architectural Violation)

```text
Runtime (hard-coded blanket auth middleware)
    ↓ [ALL /mcp requests blocked without Bearer token]
    ↓ [ChatGPT cannot discover tools]
Tool Descriptors (no security metadata)
Generator (no security policy application)
```

**Violations**:

1. Runtime uses blanket auth middleware instead of per-method routing
2. `ToolDescriptor` interface has no `securitySchemes` field
3. Generator doesn't apply MCP security policy to tools
4. ChatGPT cannot discover tools (requires `tools/list` without auth)
5. No generated protected resource metadata

### Target State (Policy-Driven, Generated)

```text
MCP Security Policy (config file)
    ↓ [READ at type-gen time]
Generator (applies policy → emits in descriptors)
    ↓ [SECURITY METADATA FLOWS]
Tool Descriptors (securitySchemes: [...])
    ↓ [THIN RUNTIME FACADE]
Runtime (reads descriptors, enforces per-tool)
    ↓ [DISCOVER without auth, EXECUTE with auth]
Protected Resource Metadata (generated from policy)
```

**Benefits**:

1. Single source of truth (policy configuration)
2. Type-safe security metadata
3. ChatGPT compatible (discovery without auth)
4. Per-tool authorization (not blanket)
5. Testable at every layer
6. Generated protected resource metadata

## Architecture Clarification

### Domain Boundaries: Schema-First vs. MCP-Derived Layer

**Schema-First SDK Domain:**

- The SDK's types, validators, and client methods flow from the OpenAPI schema
- The upstream Oak Curriculum API defines its own authentication (API keys)
- The SDK handles Oak API authentication transparently

**MCP Tools: A Derived Layer:**

- MCP tool descriptors are **generated artifacts** that bridge SDK → MCP protocol
- They already add MCP-specific concerns: flattening nested args, MCP input schemas, MCP validation
- **MCP security metadata is just another MCP-specific concern**
- This is orthogonal to (completely separate from) the upstream API's authentication

**Two separate authentication layers** (important to understand):

### Layer 1: Oak Curriculum API Authentication

- **What**: Token-based auth for Oak API
- **Where**: Upstream API, handled by SDK
- **How**: MCP server deployed with Oak API key
- **Schema-First**: Yes - flows from OpenAPI schema security definitions
- **Our concern**: None - SDK handles this transparently

### Layer 2: MCP Server OAuth 2.1 (This Plan)

- **What**: OAuth 2.1 for ChatGPT → MCP server
- **Where**: Our MCP server (the derived MCP layer)
- **How**: Clerk as authorization server
- **Schema-First**: No - this is MCP server policy, not API schema metadata
- **Our concern**: 100% - this is what we're implementing

**Key Insight:** MCP tool descriptors are already a derived layer with MCP-specific concerns. Adding `securitySchemes` fits naturally into this existing pattern. The generator translates "Oak API operations" → "MCP tools with MCP metadata".

## Acceptance Criteria (Overall)

**MUST achieve all**:

1. ✅ MCP security policy defined in configuration file
2. ✅ Generator reads policy and applies to all tools
3. ✅ `ToolDescriptor` interface includes `securitySchemes` field
4. ✅ Generated tool descriptors emit security metadata per policy
5. ✅ Runtime allows MCP `initialize` and `tools/list` without Bearer token
6. ✅ Runtime enforces security per tool based on generated metadata
7. ✅ Protected resource metadata generated from tool security metadata
8. ✅ ChatGPT can connect, discover tools, and authenticate
9. ✅ All quality gates pass (format, type-check, lint, test, build)
10. ✅ Zero regressions in existing functionality
11. ✅ All changes proven by tests written FIRST (TDD)
12. ✅ Documentation updated to reflect policy-driven security flow

## Quality Gates

After **every sub-phase**, run the complete quality gate sequence:

```bash
# From repo root
pnpm format:root        # Format code
pnpm type-check         # Type check all workspaces
pnpm lint -- --fix      # Lint with auto-fix
pnpm test               # Run unit + integration tests
pnpm build              # Build all workspaces
```

**Policy**: If any gate fails, fix it before proceeding. Never disable checks. Never skip tests.

## Phase 0: Clerk Capability Research

**Objective**: Verify Clerk supports all MCP authorization spec requirements before beginning implementation.

**Layer**: Research (pre-implementation validation)  
**Approach**: Manual research and documentation  
**Duration**: 1-2 days  
**Status**: **BLOCKING** - Must complete before Phase 1

### Problem Statement

The MCP authorization spec mandates specific OAuth 2.1 features:

- **RFC 7591**: Dynamic Client Registration (DCR)
- **RFC 8707**: Resource Indicators (the `resource` parameter)
- **RFC 9728**: Protected Resource Metadata
- **RFC 8414**: Authorization Server Metadata

**Unknown**: Does Clerk fully support these requirements?

**Risk**: If Clerk doesn't support critical features (especially DCR or resource parameter echo), the OAuth flow won't work as designed, requiring significant architecture changes.

### Research Requirements

The USER will conduct research to answer these questions. This section defines what needs to be validated.

#### 1. Dynamic Client Registration (DCR) Support

**Question**: Does Clerk support OAuth 2.0 Dynamic Client Registration (RFC 7591)?

**What to verify:**

- Does Clerk expose a `registration_endpoint` in its OAuth metadata?
- Can clients dynamically register without pre-configuration?
- Does Clerk's registration endpoint accept standard DCR parameters?
- What client metadata fields does Clerk require/support?
- Are there rate limits or restrictions on dynamic registration?

**Why it matters**: ChatGPT requires DCR to automatically register as an OAuth client. Without DCR, each user session would require manual client configuration, which is not feasible.

**Acceptance criteria:**

- [ ] Clerk documentation confirms DCR support
- [ ] Registration endpoint URL documented
- [ ] DCR parameters and response format documented
- [ ] Known limitations or restrictions documented

---

#### 2. Resource Parameter Support (RFC 8707)

**Question**: Does Clerk support the `resource` parameter in authorization and token requests?

**What to verify:**

- Can authorization requests include `resource=https://mcp.example.com`?
- Does Clerk preserve the `resource` parameter through the OAuth flow?
- Does Clerk echo `resource` into the access token's `aud` (audience) claim?
- How does Clerk handle multiple resource values?
- Does Clerk validate or restrict resource parameter values?

**Why it matters**: RFC 8707 Resource Indicators are **critical** for token audience binding. MCP servers must validate tokens were issued specifically for them. Without resource parameter support, tokens could be misused across different services (security vulnerability).

**Acceptance criteria:**

- [ ] Clerk documentation confirms resource parameter support
- [ ] Token audience claim (`aud`) behavior documented
- [ ] Resource parameter validation rules documented
- [ ] Known limitations or restrictions documented

---

#### 3. Authorization Server Metadata

**Question**: Does Clerk provide standards-compliant OAuth authorization server metadata?

**What to verify:**

- Does Clerk expose `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`?
- Does metadata include `registration_endpoint`?
- Does metadata include `code_challenge_methods_supported` with `S256` (PKCE)?
- Does metadata include `authorization_endpoint`, `token_endpoint`, `jwks_uri`?
- Are there any non-standard or Clerk-specific fields?

**Why it matters**: ChatGPT uses authorization server metadata to discover endpoints and capabilities. Missing or non-standard metadata will break the OAuth flow.

**Test endpoint**: If using Clerk development tenant, check:

```
https://[your-clerk-domain]/.well-known/openid-configuration
```

**Acceptance criteria:**

- [ ] Authorization server metadata endpoint confirmed
- [ ] All required fields present
- [ ] PKCE support (`S256`) confirmed
- [ ] Metadata structure documented

---

#### 4. Protected Resource Metadata

**Question**: Can our MCP server publish OAuth protected resource metadata that Clerk will respect?

**What to verify:**

- Is Clerk compatible with RFC 9728 protected resource metadata?
- Will Clerk's authorization flow work with resource metadata at `/.well-known/oauth-protected-resource`?
- Are there any Clerk-specific requirements for resource metadata?
- Does Clerk support WWW-Authenticate headers for discovery?

**Why it matters**: MCP servers publish protected resource metadata to advertise which authorization servers they trust. ChatGPT reads this metadata to discover Clerk as the auth provider.

**Acceptance criteria:**

- [ ] Clerk compatibility with RFC 9728 confirmed
- [ ] Resource metadata format requirements documented
- [ ] Any Clerk-specific fields or requirements documented

---

#### 5. PKCE and Security Features

**Question**: Does Clerk properly support PKCE and other security features required by MCP?

**What to verify:**

- Does Clerk support PKCE with `S256` code challenge method?
- Does Clerk enforce PKCE for public clients?
- Does Clerk support refresh token rotation?
- What token expiration defaults does Clerk use?
- Does Clerk support token introspection or revocation?

**Why it matters**: PKCE is **mandatory** per MCP authorization spec. ChatGPT will refuse to complete the OAuth flow if PKCE support isn't advertised.

**Acceptance criteria:**

- [ ] PKCE support confirmed (S256 method)
- [ ] Token lifecycle (expiration, refresh, rotation) documented
- [ ] Security best practices documented

---

#### 6. MCP-Specific Integration Requirements

**Question**: Are there any Clerk-specific considerations for MCP server integration?

**What to verify:**

- Does Clerk have existing MCP integration guides or examples?
- Are there known issues with Clerk + MCP + ChatGPT?
- What Clerk application type should be used (Regular Web App, SPA, M2M)?
- Are there specific redirect URI requirements?
- What scopes does Clerk support (`openid`, `email`, `profile`)?

**Acceptance criteria:**

- [ ] Recommended Clerk application configuration documented
- [ ] Supported scopes documented
- [ ] Any known issues or workarounds documented
- [ ] Clerk support contact information obtained (if needed)

---

### Research Deliverables

**Document**: `apps/oak-curriculum-mcp-streamable-http/docs/clerk-mcp-research-findings.md`

#### Required sections:

1. **Executive Summary**
   - Clerk MCP compatibility: ✅ Compatible / ⚠️ Partial / ❌ Not Compatible
   - Critical blockers (if any)
   - Recommended next steps

2. **Feature Support Matrix**

| Feature                       | RFC       | Supported? | Notes      |
| ----------------------------- | --------- | ---------- | ---------- |
| Dynamic Client Registration   | RFC 7591  | ✅/⚠️/❌   | Details... |
| Resource Parameter            | RFC 8707  | ✅/⚠️/❌   | Details... |
| Authorization Server Metadata | RFC 8414  | ✅/⚠️/❌   | Details... |
| Protected Resource Metadata   | RFC 9728  | ✅/⚠️/❌   | Details... |
| PKCE (S256)                   | OAuth 2.1 | ✅/⚠️/❌   | Details... |

3. **Clerk Configuration Guide**
   - How to create Clerk application for MCP server
   - Required settings and configuration
   - Environment variables needed
   - Development vs production setup

4. **Known Limitations**
   - Any features Clerk doesn't support
   - Workarounds or alternatives
   - Impact on MCP implementation

5. **References**
   - Clerk documentation links
   - Test endpoints used
   - Support tickets or discussions (if any)

### Decision Point

**After research completion, evaluate:**

✅ **PROCEED**: If Clerk supports all critical features (DCR, resource parameter, PKCE)

- Continue to Phase 1 with confidence
- Use research findings to guide implementation

⚠️ **PROCEED WITH MODIFICATIONS**: If Clerk has partial support

- Document workarounds in plan
- Adjust implementation to accommodate limitations
- May require additional sub-phases

❌ **HALT**: If Clerk lacks critical features

- Escalate to team
- Evaluate alternative authorization servers (Auth0, Stytch, custom)
- Re-assess plan feasibility

### Acceptance Criteria

- [x] All 6 research questions answered
- [x] Research findings document created and reviewed
- [x] Feature support matrix completed
- [x] Go/No-Go decision made
- [x] Any plan modifications documented

### Definition of Done

- All research tasks completed
- Findings documented in `clerk-mcp-research-findings.md`
- Team consensus on proceed/modify/halt decision
- If proceeding: Phase 1 ready to start
- If halting: Alternative approach identified

**Next Action**: USER conducts research, documents findings, shares with team for decision

---

## Phase 0 Research Findings (COMPLETED)

**Research Date**: 2025-11-20  
**Researcher**: USER  
**Decision**: ✅ **PROCEED** (with one verification point)

### Summary

Clerk + `@clerk/mcp-tools` is confirmed MCP-compatible and meets all critical OAuth 2.1 requirements for ChatGPT integration. Research validated that Clerk passes the OpenAI checklist for MCP authorization servers.

### Verified Features

| Feature                                | Status                     | Evidence                                        |
| -------------------------------------- | -------------------------- | ----------------------------------------------- |
| Discovery metadata (RFC 8414)          | ✅ **VERIFIED**            | @clerk/mcp-tools provides .well-known endpoints |
| PKCE with S256                         | ✅ **VERIFIED**            | Documented in Clerk OAuth implementation        |
| Dynamic Client Registration (RFC 7591) | ✅ **VERIFIED**            | Supported by Clerk OAuth                        |
| Protected resource metadata (RFC 9728) | ✅ **VERIFIED**            | @clerk/mcp-tools provides RFC 9728 support      |
| Resource → aud claim (RFC 8707)        | ⚠️ **VERIFY IN PHASE 2.4** | Not explicitly documented, needs empirical test |

### Critical Finding

**All blocking requirements met.** Clerk provides everything ChatGPT needs for:

- Tool discovery without authentication
- Dynamic client registration
- PKCE-protected OAuth flow
- Protected resource metadata

### Open Question: Resource Parameter Behavior

The RFC 8707 resource parameter → `aud` claim echo behavior is **not explicitly documented** by Clerk. This is a Phase 2 concern, not a blocker.

**Verification Plan**:

- In Sub-Phase 2.4 (Resource Parameter Validation), issue a test token
- Decode JWT to inspect `aud` claim
- Verify if Clerk echoes resource parameter into audience

**If Clerk echoes resource → aud**: Perfect. Use as designed.  
**If Clerk uses different aud format**: Validate using issuer claim instead. Document deviation.  
**Either way**: Tokens remain cryptographically valid and secure.

### Decision Rationale

**Proceeding is the correct decision because:**

1. All 4 critical features confirmed (discovery, DCR, PKCE, protected resource)
2. The resource/aud behavior is testable during implementation
3. Multiple fallback strategies exist if RFC 8707 isn't exact
4. Clerk's OAuth implementation is fundamentally sound
5. Delaying for perfect documentation would be unnecessary risk aversion

### Impact on Implementation

**No changes required to plan.** The resource parameter verification was already included in Sub-Phase 2.4. We simply document that this sub-phase serves dual purpose:

1. Implement resource parameter validation (as designed)
2. Verify Clerk's actual resource/aud behavior (empirically)

### Documentation

Findings documented in:

- This section (plan document)
- `apps/oak-curriculum-mcp-streamable-http/docs/clerk-mcp-research-findings.md` (to be created)

### Go/No-Go Decision

**✅ GO** - Proceed to Phase 1, Sub-Phase 1.1

**Approved by**: USER  
**Date**: 2025-11-20

---

## Phase 1: Generator - Policy-Driven Security Metadata

**Objective**: Define MCP security policy, modify generator to apply policy to all tools, emit security metadata in tool descriptors.

**Layer**: Compile time (type-gen)  
**Approach**: TDD with pure functions

---

### Sub-Phase 1.1: Define MCP Security Policy Configuration

**Goal**: Create configuration file that defines which tools require OAuth and which are public.

#### Tasks

1. **Create security policy configuration**
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts`
   - Define `PUBLIC_TOOLS` list (tools that don't require auth)
   - Define `DEFAULT_AUTH_SCHEME` (oauth2 with scopes)
   - All data `readonly` with `as const`

2. **Write configuration validation tests** (tests first!)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.test.ts`
   - Test: PUBLIC_TOOLS is readonly array
   - Test: DEFAULT_AUTH_SCHEME has correct structure
   - Test: No duplicate tool names in PUBLIC_TOOLS

#### Expected Configuration

````typescript
// mcp-security-policy.ts
/**
 * MCP server OAuth 2.1 authentication policy.
 *
 * This file defines which tools require authentication and which are public.
 * Changes to this file trigger regeneration of all tool security metadata.
 *
 * @remarks
 * Tools NOT in PUBLIC_TOOLS require OAuth 2.1 authentication.
 * Tools in PUBLIC_TOOLS are publicly accessible without authentication.
 */

/**
 * List of tools that do not require OAuth authentication.
 *
 * These tools can be called without a Bearer token.
 * Typically used for discovery or public metadata endpoints.
 *
 * @example
 * ```typescript
 * // Make get-key-stages public
 * export const PUBLIC_TOOLS = ['get-key-stages'] as const;
 * ```
 */
export const PUBLIC_TOOLS: readonly string[] = [
  // Add tool names here to make them public
  // By default, all tools require authentication
] as const;

/**
 * Default OAuth 2.1 security scheme for protected tools.
 *
 * Applied to all tools NOT in PUBLIC_TOOLS list.
 */
export const DEFAULT_AUTH_SCHEME = {
  type: 'oauth2',
  scopes: ['openid', 'email'],
} as const;

/**
 * Determines if a tool requires authentication based on policy.
 *
 * @param toolName - MCP tool name
 * @returns true if tool requires auth, false if public
 */
export function toolRequiresAuth(toolName: string): boolean {
  return !PUBLIC_TOOLS.includes(toolName);
}
````

#### Acceptance Criteria

- [ ] Policy configuration file created
- [ ] `PUBLIC_TOOLS` defined as readonly array
- [ ] `DEFAULT_AUTH_SCHEME` defined with oauth2 type
- [ ] `toolRequiresAuth` helper function defined
- [ ] Configuration tests exist and pass
- [ ] TSDoc explains purpose and usage
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Configuration is single source of truth for MCP auth policy
- Committed with message: "feat(generator): add MCP OAuth security policy configuration"

---

### Sub-Phase 1.2: Define Security Schema Types

**Goal**: Create TypeScript types for MCP security schemes.

#### Tasks

1. **Create security types module**
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/security-types.ts`
   - Define MCP `SecurityScheme` union type
   - All types are `readonly`

2. **Write type tests** (tests first!)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/security-types.test.ts`
   - Prove types accept valid security schemes
   - Prove types reject invalid security schemes

#### Expected Types

```typescript
// security-types.ts
/**
 * MCP security scheme types.
 *
 * These types define the security metadata emitted in tool descriptors
 * and consumed by runtime authorization logic.
 */

export type SecuritySchemeType = 'noauth' | 'oauth2';

/**
 * No authentication required.
 */
export interface NoAuthScheme {
  readonly type: 'noauth';
}

/**
 * OAuth 2.1 authentication required.
 */
export interface OAuth2Scheme {
  readonly type: 'oauth2';
  readonly scopes?: readonly string[];
}

/**
 * Union of all supported security schemes.
 */
export type SecurityScheme = NoAuthScheme | OAuth2Scheme;
```

#### Acceptance Criteria

- [ ] Types defined with strict readonly modifiers
- [ ] Type tests exist and pass
- [ ] Types compiled by TypeScript (no `any`, no `as`)
- [ ] TSDoc comments explain each type
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Types support both public and authenticated tools
- Committed with message: "feat(generator): add MCP security scheme types"

---

### Sub-Phase 1.3: Apply Security Policy to Tools (Pure Function)

**Goal**: Write pure function that determines security scheme for a tool based on policy.

**TDD**: Write tests FIRST, then implementation.

#### Tasks

1. **Write tests FIRST** (Red)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/apply-security-policy.test.ts`
   - Test: tool NOT in PUBLIC_TOOLS → returns DEFAULT_AUTH_SCHEME
   - Test: tool in PUBLIC_TOOLS → returns noauth scheme
   - Test: PUBLIC_TOOLS empty → all tools get auth
   - Test: function is pure (same input = same output)
   - Run tests, watch them FAIL

2. **Implement pure function** (Green)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/apply-security-policy.ts`
   - Function: `getSecuritySchemeForTool(toolName: string): SecurityScheme[]`
   - NO side effects, NO I/O, NO mutation
   - Read from PUBLIC_TOOLS and DEFAULT_AUTH_SCHEME
   - Run tests, watch them PASS

3. **Refactor** (if needed)
   - Extract helpers if needed
   - Keep function pure
   - Run tests after each refactor

#### Expected Function

```typescript
import { PUBLIC_TOOLS, DEFAULT_AUTH_SCHEME, type SecurityScheme } from '../mcp-security-policy.js';

/**
 * Determines security scheme for a tool based on MCP security policy.
 *
 * Reads the PUBLIC_TOOLS list and applies:
 * - Tools in PUBLIC_TOOLS: noauth scheme (publicly accessible)
 * - Tools NOT in PUBLIC_TOOLS: DEFAULT_AUTH_SCHEME (requires OAuth)
 *
 * @param toolName - MCP tool name
 * @returns Array of security schemes for this tool
 *
 * @remarks
 * Pure function - always returns same result for same input.
 * Security policy is read from mcp-security-policy.ts configuration.
 */
export function getSecuritySchemeForTool(toolName: string): readonly SecurityScheme[] {
  if (PUBLIC_TOOLS.includes(toolName)) {
    return [{ type: 'noauth' }];
  }
  return [DEFAULT_AUTH_SCHEME];
}
```

#### Test Cases (Minimum)

```typescript
describe('getSecuritySchemeForTool', () => {
  it('returns noauth for tools in PUBLIC_TOOLS', () => {
    // Assume PUBLIC_TOOLS includes 'public-tool'
  });

  it('returns oauth2 with scopes for tools NOT in PUBLIC_TOOLS', () => {
    // Any tool not in PUBLIC_TOOLS
  });

  it('is pure - returns same result for same input', () => {
    // Call twice with same tool name, assert equal results
  });

  it('returns array (not single scheme)', () => {
    // Result is always array
  });
});
```

#### Acceptance Criteria

- [ ] Tests written FIRST and initially failing (Red)
- [ ] Implementation written to make tests pass (Green)
- [ ] All tests pass
- [ ] Function is pure (no side effects, no I/O, no mutation)
- [ ] TSDoc comments explain behaviour
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Function provides 100% branch coverage
- Committed with messages: "test: add tests for security policy application" then "feat: implement security policy application"

---

### Sub-Phase 1.4: Update ToolDescriptor Contract

**Goal**: Add `securitySchemes` field to the `ToolDescriptor` interface.

**Approach**: Contract-first (define interface, update generator template)

#### Tasks

1. **Update tool descriptor generator template**
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`
   - Add `readonly securitySchemes?: readonly SecurityScheme[];` to interface
   - Import `SecurityScheme` type
   - Update TSDoc to document field

2. **Re-generate tool descriptor contract**
   - Run: `pnpm type-gen` from repo root
   - Verify: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts` updated

3. **Update dependent types**
   - Any types that extend or reference `ToolDescriptor` must be updated
   - Use TypeScript compiler errors as guide

4. **Write contract validation test**
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.test.ts`
   - Test: generated contract includes `securitySchemes` field
   - Test: field is optional (tools can omit it)
   - Test: field is readonly array

#### Expected Interface (Generated)

```typescript
// tool-descriptor.contract.ts (generated)
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema, ZodType, ZodTypeDef } from 'zod';

export type SecuritySchemeType = 'noauth' | 'oauth2';

export interface NoAuthScheme {
  readonly type: 'noauth';
}

export interface OAuth2Scheme {
  readonly type: 'oauth2';
  readonly scopes?: readonly string[];
}

export type SecurityScheme = NoAuthScheme | OAuth2Scheme;

export interface ToolDescriptor<
  TName extends string,
  TClient,
  TArgs,
  TFlatArgs,
  TResult,
  TDocumentedStatus extends string,
  TStatus extends number | string = StatusDiscriminant<TDocumentedStatus>,
> extends Tool {
  readonly name: TName;
  readonly description?: string;
  readonly operationId: string;
  readonly path: string;
  readonly method: string;
  readonly toolZodSchema: ZodType<TArgs, ZodTypeDef, unknown>;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<TResult>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolMcpFlatInputSchema: ZodType<TFlatArgs, ZodTypeDef, unknown>;
  readonly transformFlatToNestedArgs: (flatArgs: TFlatArgs) => TArgs;
  readonly documentedStatuses: readonly TDocumentedStatus[];
  readonly securitySchemes?: readonly SecurityScheme[]; // ← NEW
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: TResult; readonly status: TStatus }
    | {
        readonly ok: false;
        readonly message: string;
        readonly issues: readonly unknown[];
        readonly attemptedStatuses: readonly {
          readonly status: TStatus;
          readonly issues: readonly unknown[];
        }[];
      };
  readonly invoke: (client: TClient, args: TArgs) => TResult | Promise<TResult>;
}
```

#### Acceptance Criteria

- [ ] `ToolDescriptor` interface includes `securitySchemes` field
- [ ] Field is optional (uses `?`)
- [ ] Field is readonly array
- [ ] TSDoc comments explain purpose and format
- [ ] Generated contract file compiles without errors
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Type-check passes across all workspaces
- Committed with message: "feat(generator): add securitySchemes to ToolDescriptor contract"

---

### Sub-Phase 1.5: Emit Security Metadata in Generated Tools

**Goal**: Modify tool file generator to call `getSecuritySchemeForTool` and emit `securitySchemes` in tool descriptors.

**TDD**: Integration test first (prove generated file contains security)

#### Tasks

1. **Write generator integration test FIRST** (Red)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.integration.test.ts`
   - Test: Generate tool NOT in PUBLIC_TOOLS
   - Assert: Generated tool file contains `securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }]`
   - Test: Generate tool in PUBLIC_TOOLS (mock policy)
   - Assert: Generated tool file contains `securitySchemes: [{ type: 'noauth' }]`
   - Run test, watch it FAIL

2. **Update tool file generator** (Green)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts` (or relevant file)
   - Import `getSecuritySchemeForTool`
   - Call function during tool generation with tool name
   - Emit `securitySchemes` field in tool descriptor literal
   - Run test, watch it PASS

3. **Update main generator orchestration**
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts`
   - Ensure tool name is available during generation
   - Wire up `getSecuritySchemeForTool` call

4. **Run full type-gen and validate output**
   - Run: `pnpm type-gen` from repo root
   - Inspect: Generated tool files in `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/`
   - Verify: ALL tools have `securitySchemes` field (oauth2 by default)
   - Verify: PUBLIC_TOOLS (if any) have noauth scheme

#### Expected Generated Tool (Example)

```typescript
// get-sequence-units.ts (generated)
import type { OakApiPathBasedClient } from '../../../../../client/oak-api-client.js';
import type { ToolDescriptor } from '../../contract/tool-descriptor.contract.js';
// ... other imports ...

export const getSequenceUnits = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    // ... existing implementation ...
  },
  toolZodSchema,
  toolInputJsonSchema,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }], // ← NEW (from policy)
  // ... other fields ...
  name: 'get-sequence-units',
  description: 'Units within a sequence',
  operationId: 'getSequences-getSequenceUnits',
  path: '/sequences/{sequence}/units',
  method: 'get',
  // ... rest ...
} as const satisfies ToolDescriptor<...>;
```

#### Acceptance Criteria

- [ ] Integration test written FIRST and failing (Red)
- [ ] Generator modified to call `getSecuritySchemeForTool` (Green)
- [ ] Generated tool files include `securitySchemes` for ALL tools
- [ ] Security schemes match policy configuration
- [ ] All integration tests pass
- [ ] Full `pnpm type-gen` completes successfully
- [ ] Generated files compile without errors
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Generator integration tests have comprehensive coverage
- Real generated tool files inspected manually for correctness
- Committed with message: "feat(generator): emit security metadata in tool descriptors"

---

### Sub-Phase 1.6: Generate Protected Resource Metadata

**Goal**: Create function that generates OAuth protected resource metadata by scanning tool descriptors.

**TDD**: Tests first, then implementation.

#### Tasks

1. **Write tests FIRST** (Red)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/generate-protected-resource-metadata.test.ts`
   - Test: Scan tools with oauth2 → includes in `scopes_supported`
   - Test: All tools have oauth2 → all scopes collected
   - Test: Some tools public → only oauth2 tool scopes included
   - Test: Deduplicates scopes
   - Run tests, watch them FAIL

2. **Implement function** (Green)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/generate-protected-resource-metadata.ts`
   - Function: `generateScopesSupported(tools: ToolDescriptor[]): string[]`
   - Scan all tool `securitySchemes`
   - Collect unique scopes from oauth2 schemes
   - Return deduplicated array
   - Run tests, watch them PASS

3. **Wire into generator output**
   - Generate metadata file alongside tool definitions
   - Export function that runtime can use

#### Expected Function

```typescript
import type { ToolDescriptor, SecurityScheme } from './contract/tool-descriptor.contract.js';

/**
 * Generates list of OAuth scopes supported by the MCP server.
 *
 * Scans all tool descriptors and collects scopes from oauth2 security schemes.
 * Used to generate OAuth protected resource metadata.
 *
 * @param tools - Array of tool descriptors
 * @returns Deduplicated array of supported scopes
 */
export function generateScopesSupported(
  tools: readonly ToolDescriptor<any, any, any, any, any, any>[],
): readonly string[] {
  const scopesSet = new Set<string>();

  for (const tool of tools) {
    if (!tool.securitySchemes) continue;

    for (const scheme of tool.securitySchemes) {
      if (scheme.type === 'oauth2' && scheme.scopes) {
        for (const scope of scheme.scopes) {
          scopesSet.add(scope);
        }
      }
    }
  }

  return Array.from(scopesSet).sort();
}
```

#### Acceptance Criteria

- [ ] Tests written FIRST (Red)
- [ ] Function implemented to pass tests (Green)
- [ ] Function scans all tools and collects scopes
- [ ] Scopes are deduplicated
- [ ] All tests pass
- [ ] TSDoc explains purpose
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Function can be used by runtime to generate metadata
- Committed with messages: "test: add tests for protected resource metadata generation" then "feat: implement protected resource metadata generation"

---

### Sub-Phase 1.7: Phase 1 Validation and Quality Gates

**Goal**: Prove Phase 1 complete and regression-free.

#### Tasks

1. **Run complete quality gate sequence**

   ```bash
   pnpm clean
   pnpm type-gen
   pnpm format:root
   pnpm type-check
   pnpm lint -- --fix
   pnpm test
   pnpm build
   ```

2. **Manual inspection of generated artefacts**
   - Inspect 5-10 generated tool files
   - Verify ALL tools have `securitySchemes` field
   - Verify security schemes match policy (oauth2 by default)
   - Check if PUBLIC_TOOLS (if any) have noauth

3. **Test policy modification**
   - Add a tool to PUBLIC_TOOLS
   - Re-run `pnpm type-gen`
   - Verify that tool now has noauth scheme
   - Remove from PUBLIC_TOOLS, verify reverts to oauth2

4. **Regression testing**
   - Run existing E2E tests: `pnpm test:e2e`
   - Verify existing MCP server functionality unchanged
   - Test with MCP Inspector (if available)

5. **Documentation**
   - Update `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md`
   - Document security policy configuration
   - Document how to make tools public
   - Provide examples

#### Acceptance Criteria

- [ ] All quality gates pass (format, type-check, lint, test, build)
- [ ] Generated tool files include security metadata
- [ ] Security metadata matches policy configuration
- [ ] Policy changes trigger correct regeneration
- [ ] Zero regressions in existing functionality
- [ ] E2E tests pass
- [ ] Documentation updated

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Phase 1 overall acceptance criteria achieved
- Ready to proceed to Phase 2

---

## Phase 2: Runtime - Method-Aware MCP Routing

**Objective**: Implement method-aware routing that allows discovery without authentication whilst enforcing per-tool authorization for execution methods. Runtime reads security metadata directly from generated tool descriptors.

**Layer**: Runtime (thin façade reading generated metadata)  
**Approach**: TDD with integration tests

**Key Architectural Principle**: Security metadata is defined at tool creation time (Phase 1) and stored in generated tool descriptors. The runtime layer simply **reads** this metadata - no duplicate policy definitions, no separate policy configuration files in the runtime layer. The generated tool descriptors are the single source of truth.

**What Runtime Does:**

1. Register tools with MCP SDK, passing `securitySchemes` from generated descriptors
2. Classify MCP method (discovery vs. execution)
3. For execution methods: read `descriptor.securitySchemes` to make auth decisions
4. Apply or skip auth middleware based on metadata
5. That's it - simple, testable, correct

---

### Sub-Phase 2.1: Update Tool Registration to Include Security Metadata

**Goal**: Modify tool registration to pass `securitySchemes` from generated descriptors to MCP SDK.

**TDD**: Integration test first.

**Special Case - Runtime-Defined Tools**: The aggregated tools (`search` and `fetch`) are currently defined in hand-written runtime code, not generated. There's a comprehensive plan (Phase 0 of `.agent/plans/sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md`) to move them to generated code. Until that work is complete, we need to manually apply the default OAuth security scheme to these tools at registration time.

#### Tasks

1. **Write integration test FIRST** (Red)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`
   - Test: Generated tools include `securitySchemes` from descriptors
   - Test: Tool with no PUBLIC_TOOLS entry → has oauth2 scheme
   - Test: Tool in PUBLIC_TOOLS (if any) → has noauth scheme
   - Test: Runtime-defined aggregated tools → receive default oauth2 scheme
   - Mock MCP server's `registerTool` to verify it receives `securitySchemes`
   - Run tests, watch them FAIL

2. **Update tool registration for generated tools** (Green)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
   - Modify `registerHandlers` function
   - Read `tool.securitySchemes` from descriptor
   - Pass to `server.registerTool()` in the options object
   - Run tests, watch them PASS

3. **Add default security to runtime-defined tools** (Temporary)
   - In SDK: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` and `aggregated-fetch.ts`
   - Add `securitySchemes` field to the tool descriptor objects
   - Apply default oauth2 scheme: `[{ type: 'oauth2', scopes: ['openid', 'email'] }]`
   - Add TODO comment referencing Phase 0 plan
   - This is a temporary workaround until Phase 0 moves these to generated code

#### Expected Changes

```typescript
// handlers.ts
export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    ...(options.overrides ?? {}),
  };
  const useStubTools = options.runtimeConfig.useStubTools;
  const stubExecutor = useStubTools ? createStubToolExecutionAdapter() : undefined;
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    server.registerTool(
      tool.name,
      {
        title: tool.name,
        description: tool.description ?? tool.name,
        inputSchema: input,
        securitySchemes: tool.securitySchemes, // ← NEW: Pass from descriptor (generated or runtime-defined)
      },
      async (params: unknown) => {
        const client = deps.createClient(options.runtimeConfig.env.OAK_API_KEY);
        const executor = deps.createExecutor({
          executeMcpTool: async (name, args) => {
            const execution = await (stubExecutor
              ? stubExecutor(name, args ?? {})
              : deps.executeMcpTool(name, args, client));
            logValidationFailureIfPresent(name, execution, options.logger);
            return execution;
          },
        });
        return executor(tool.name, params ?? {});
      },
    );
  }
}
```

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts (temporary)
// TODO: Remove when Phase 0 (comprehensive-mcp-enhancement-plan.md) moves this to generated code

export const aggregatedSearchTool = {
  name: 'search',
  description: 'Search across curriculum resources',
  inputSchema: SEARCH_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }], // ← NEW: Apply default oauth2
  // ... rest of tool definition
} as const;
```

#### Acceptance Criteria

- [ ] Integration test written FIRST (Red)
- [ ] Registration updated to pass `securitySchemes` (Green)
- [ ] Test proves security metadata flows to MCP SDK
- [ ] All tests pass
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Committed with message: "test: add integration test for tool registration with security" then "feat: register tools with security metadata from descriptors"

---

### Sub-Phase 2.2: MCP Method Classification (Pure Functions)

**Goal**: Create pure functions that classify MCP methods as "discovery" vs "execution".

**TDD**: Tests first, then implementation.

#### Tasks

1. **Write tests FIRST** (Red)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-method-classifier.test.ts`
   - Test: `initialize` → discovery (no auth required)
   - Test: `tools/list` → discovery (no auth required)
   - Test: `tools/call` → execution (check tool security)
   - Test: unknown method → default behaviour (require auth for safety)
   - Run tests, watch them FAIL

2. **Implement pure functions** (Green)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-method-classifier.ts`
   - Function: `isDiscoveryMethod(method: string): boolean`
   - NO side effects, NO I/O
   - Run tests, watch them PASS

#### Expected Functions

```typescript
/**
 * Determines if an MCP method is a discovery method.
 *
 * Discovery methods provide metadata about the server and its tools.
 * Per OpenAI ChatGPT requirements, these must work without authentication
 * to allow tool discovery before OAuth flow.
 *
 * @param method - MCP method name (e.g., 'tools/list')
 * @returns true if method is discovery, false otherwise
 */
export function isDiscoveryMethod(method: string): boolean {
  return method === 'initialize' || method === 'tools/list';
}
```

#### Acceptance Criteria

- [ ] Tests written FIRST (Red)
- [ ] Functions implemented to pass tests (Green)
- [ ] Functions are pure (no side effects)
- [ ] All tests pass
- [ ] TSDoc comments explain behaviour
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Committed with message: "test: add tests for MCP method classification" then "feat: implement MCP method classification"

---

### Sub-Phase 2.3: Auth Decision Logic (Pure Function Reading Tool Metadata)

**Goal**: Create pure function that decides whether authentication is required by reading security metadata directly from generated tool descriptors.

**TDD**: Tests first, then implementation.

**Key Insight**: We don't need a separate "resolver" function. Just read `descriptor.securitySchemes` directly.

#### Tasks

1. **Write tests FIRST** (Red)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-auth-decision.test.ts`
   - Test: `tools/list` → auth not required
   - Test: `initialize` → auth not required
   - Test: `tools/call` + tool with oauth2 scheme → auth required
   - Test: `tools/call` + tool with noauth scheme → auth not required
   - Test: `tools/call` + tool with no securitySchemes → auth required (safe default)
   - Test: `tools/call` + unknown tool → throws (tool not found)
   - Run tests, watch them FAIL

2. **Implement pure function** (Green)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-auth-decision.ts`
   - Function: `requiresAuth(method: string, toolName?: string): boolean`
   - Import `getToolFromToolName` from generated SDK
   - Read `descriptor.securitySchemes` directly
   - NO side effects, NO I/O
   - Run tests, watch them PASS

#### Expected Function

```typescript
import { isDiscoveryMethod } from './mcp-method-classifier.js';
import { getToolFromToolName } from '@oaknational/oak-curriculum-sdk/mcp-tools';

/**
 * Determines if an MCP request requires authentication.
 *
 * Reads security metadata directly from generated tool descriptors.
 *
 * Decision logic:
 * - Discovery methods (initialize, tools/list): NO auth
 * - Execution methods (tools/call): Read tool's securitySchemes from generated descriptor
 *   - If descriptor has oauth2 scheme → YES auth
 *   - If descriptor has only noauth scheme → NO auth
 *   - If descriptor has no securitySchemes → YES auth (safe default)
 *
 * @param method - MCP method name
 * @param toolName - Tool name (required for tools/call)
 * @returns true if auth required, false otherwise
 * @throws Error if tool name is unknown (tools/call only)
 */
export function requiresAuth(method: string, toolName?: string): boolean {
  // Discovery methods never require auth
  if (isDiscoveryMethod(method)) {
    return false;
  }

  // Execution methods: read security from generated tool descriptor
  if (method === 'tools/call' && toolName) {
    const descriptor = getToolFromToolName(toolName);
    const schemes = descriptor.securitySchemes;

    // No security schemes defined → require auth (safe default)
    if (!schemes || schemes.length === 0) {
      return true;
    }

    // Require auth if any scheme is oauth2
    return schemes.some((s) => s.type === 'oauth2');
  }

  // Unknown methods: default to requiring auth (safe)
  return true;
}
```

#### Acceptance Criteria

- [ ] Tests written FIRST (Red)
- [ ] Function implemented to pass tests (Green)
- [ ] Function reads directly from generated descriptors (no separate resolver)
- [ ] Function is pure (reads from generated data)
- [ ] All tests pass
- [ ] TSDoc comments explain decision logic
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Committed with message: "test: add tests for auth decision logic" then "feat: implement auth decision from tool metadata"

---

### Sub-Phase 2.4: MCP Router Middleware (Integration Point)

**Goal**: Create middleware that routes MCP requests based on method and applies auth selectively.

**Approach**: Integration test first (tests multiple units working together).

#### Tasks

1. **Write integration tests FIRST** (Red)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.integration.test.ts`
   - Test: POST /mcp with `tools/list` → passes without Bearer token
   - Test: POST /mcp with `tools/list` → passes with Bearer token (doesn't break auth)
   - Test: POST /mcp with `tools/call` (oauth2 tool) + no token → 401
   - Test: POST /mcp with `tools/call` (oauth2 tool) + valid token → passes
   - Test: POST /mcp with `tools/call` (noauth tool) + no token → passes
   - Use simple mocks for auth verification (injected as arguments)
   - NO complex mocks (keep simple)
   - Run tests, watch them FAIL

2. **Implement MCP router middleware** (Green)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts`
   - Create middleware that:
     - Parses MCP message from request body
     - Calls `requiresAuth(method, toolName)`
     - If auth required: calls auth middleware
     - If auth not required: proceeds to handler
   - Inject auth middleware as argument (dependency injection for testing)
   - Run tests, watch them PASS

2a. **Add resource parameter validation** (Enhancement)

- File: `apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.ts`
- Function: `validateResourceParameter(token: string, expectedResource: string): boolean`
- Parse JWT without verification (use `jsonwebtoken` library's `decode`)
- Extract `aud` (audience) claim from token
- Verify `aud` matches expected resource URL
- Return validation result

2b. **Integrate resource validation into auth middleware**

- File: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts`
- After Clerk token verification succeeds
- Call resource parameter validator
- If resource doesn't match: return 401 with appropriate error
- Add tests for resource parameter validation

2c. **Write resource parameter integration tests**

- File: `apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.integration.test.ts`
- Test: Token with correct `aud` → accepted
- Test: Token with wrong `aud` → rejected (401)
- Test: Token with missing `aud` → rejected (401)
- Test: Token with multiple `aud` values → accepted if one matches

3. **Wire into Express app**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
   - Replace: `app.post('/mcp', mcpAuthClerk, mcpHandler)`
   - With: `app.post('/mcp', createMcpRouter({ auth: mcpAuthClerk }), mcpHandler)`
   - Maintain backward compatibility (check feature flag?)

#### Expected Middleware

```typescript
import type { RequestHandler } from 'express';
import { requiresAuth } from './mcp-auth-decision.js';

export interface McpRouterOptions {
  readonly auth: RequestHandler; // Injected for testing
}

/**
 * Creates method-aware MCP routing middleware.
 *
 * Routes MCP requests based on method and tool security requirements:
 * - Discovery methods: pass through without auth
 * - Execution methods: apply auth if tool requires oauth2
 *
 * @param options - Router configuration
 * @returns Express middleware
 */
export function createMcpRouter(options: McpRouterOptions): RequestHandler {
  return (req, res, next) => {
    // Parse MCP message
    const message = req.body;
    const method = message?.method;
    const toolName = message?.params?.name;

    // Check if auth required
    if (requiresAuth(method, toolName)) {
      // Call auth middleware
      options.auth(req, res, next);
    } else {
      // Pass through without auth
      next();
    }
  };
}
```

```typescript
// resource-parameter-validator.ts
import jwt from 'jsonwebtoken';

/**
 * Validates that a JWT token's audience claim matches the expected resource.
 *
 * Per RFC 8707 (Resource Indicators for OAuth 2.0), the authorization server
 * should echo the `resource` parameter into the token's `aud` (audience) claim.
 * This function verifies that binding to prevent token misuse across services.
 *
 * @param token - JWT access token (Bearer token)
 * @param expectedResource - Expected resource URL (e.g., "https://mcp.example.com")
 * @returns Validation result with details
 *
 * @see https://www.rfc-editor.org/rfc/rfc8707.html
 */
export function validateResourceParameter(
  token: string,
  expectedResource: string,
): { readonly valid: boolean; readonly reason?: string } {
  try {
    // Decode JWT without verification (already verified by Clerk)
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded === 'string') {
      return { valid: false, reason: 'Invalid JWT format' };
    }

    const payload = decoded.payload;
    const aud = payload.aud;

    // aud can be string or string[] per JWT spec
    const audiences = Array.isArray(aud) ? aud : [aud];

    // Check if expected resource is in audience list
    if (audiences.includes(expectedResource)) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: `Token audience mismatch. Expected: ${expectedResource}, Got: ${audiences.join(', ')}`,
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Token decode error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
```

#### Acceptance Criteria

- [ ] Integration tests written FIRST (Red)
- [ ] Middleware implemented to pass tests (Green)
- [ ] Tests use simple mocks (injected as arguments)
- [ ] All tests pass
- [ ] Discovery methods work without auth
- [ ] Execution methods enforce per-tool auth
- [ ] Resource parameter validation implemented
- [ ] Tokens with wrong `aud` claim rejected
- [ ] Resource validation tests pass
- [ ] TSDoc comments explain routing logic
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Integration tests prove multiple units working together
- Committed with message: "test: add integration tests for MCP router" then "feat: implement method-aware MCP router"

---

### Sub-Phase 2.5: Update Application Wiring

**Goal**: Wire the new MCP router into the Express application, replacing blanket auth middleware.

**Approach**: Incremental replacement with feature flag (safe rollout).

#### Tasks

1. **Add feature flag** (optional but recommended)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/config/runtime-config.ts`
   - Add: `USE_METHOD_AWARE_AUTH: boolean` (default: false for now)
   - Allow override via environment variable

2. **Update application.ts to use router**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
   - Import `createMcpRouter`
   - Replace blanket auth with router (conditionally, if feature flag)
   - Keep old path available (for rollback)

3. **Write application-level integration test**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/application.integration.test.ts`
   - Test: Full request cycle for `tools/list` without auth
   - Test: Full request cycle for `tools/call` with auth
   - Use test instance of Express app
   - NO mocks (real integration)

4. **Update auth-routes.ts**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
   - Modify `setupAuthRoutes` to use router when flag enabled
   - Maintain backward compatibility

#### Expected Changes

```typescript
// application.ts
import { createMcpRouter } from './mcp-router.js';

function setupMcpRoutes(app: Express, config: RuntimeConfig, ...) {
  if (config.useMethodAwareAuth) {
    // New: method-aware routing
    app.post('/mcp', createMcpRouter({ auth: mcpAuthClerk }), mcpHandler);
  } else {
    // Old: blanket auth (for rollback)
    app.post('/mcp', mcpAuthClerk, mcpHandler);
  }
}
```

#### Acceptance Criteria

- [ ] Feature flag added (allows safe rollout)
- [ ] Application uses router when flag enabled
- [ ] Integration tests prove full request cycle works
- [ ] Backward compatibility maintained
- [ ] All tests pass
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Application-level tests prove end-to-end flow
- Committed with message: "feat: wire method-aware MCP router into application"

---

### Sub-Phase 2.6: Update Protected Resource Metadata Endpoint

**Goal**: Modify protected resource metadata endpoint to use generated scopes from tool descriptors.

#### Tasks

1. **Update metadata generation in auth-routes.ts**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
   - Import `generateScopesSupported` from SDK
   - Get all tool descriptors
   - Generate scopes dynamically
   - Replace hard-coded scopes

2. **Write tests for dynamic metadata generation**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.test.ts`
   - Test: Metadata includes scopes from tool descriptors
   - Test: Metadata updates when tools change

#### Expected Changes

```typescript
// auth-routes.ts
import {
  listToolDescriptors,
  generateScopesSupported,
} from '@oaknational/oak-curriculum-sdk/mcp-tools';

app.get('/.well-known/oauth-protected-resource', (req, res) => {
  const tools = listToolDescriptors();
  const scopes = generateScopesSupported(tools);

  const metadata = generateClerkProtectedResourceMetadata({
    publishableKey,
    resourceUrl,
    properties: {
      scopes_supported: scopes, // ← Generated from tools
    },
  });

  res.json(metadata);
});
```

#### Acceptance Criteria

- [ ] Protected resource metadata uses generated scopes
- [ ] Scopes reflect actual tool requirements
- [ ] Tests prove metadata generation works
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Protected resource metadata is generated, not hard-coded
- Committed with message: "feat: generate protected resource metadata from tool descriptors"

---

### Sub-Phase 2.7: Tool-Level Auth Error Handling and \_meta Emission

**Goal**: Implement tool-level authentication error detection and emit `_meta["mcp/www_authenticate"]` to trigger ChatGPT's OAuth linking UI.

**TDD**: Tests first, then implementation.

**Context**: Per OpenAI documentation, ChatGPT only surfaces its OAuth linking UI when the MCP server signals that OAuth is both available (via `securitySchemes` in tool registration) **and** necessary (via `_meta["mcp/www_authenticate"]` in error responses). Without both signals, ChatGPT won't show the "Connect" button.

#### Tasks

1. **Write tests FIRST** (Red)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-error-handler.test.ts`
   - Test: Tool execution without valid token → returns `_meta["mcp/www_authenticate"]`
   - Test: Tool execution with expired token → returns `_meta["mcp/www_authenticate"]`
   - Test: Tool execution with wrong scopes → returns `_meta["mcp/www_authenticate"]`
   - Test: `_meta` includes `error` and `error_description` parameters
   - Test: `_meta` includes `resource_metadata` URL
   - Run tests, watch them FAIL

2. **Implement auth error handler** (Green)
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-error-handler.ts`
   - Function: `createAuthErrorResponse(reason: string, req: Request): CallToolResult`
   - Generate WWW-Authenticate header value with error details
   - Format response with `_meta["mcp/www_authenticate"]` array
   - Include helpful error message in response content
   - Run tests, watch them PASS

3. **Integrate into tool execution**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
   - Modify tool handler to catch auth errors
   - Detect authentication failures (401, token validation errors)
   - Call auth error handler to generate MCP-compliant error response
   - Return error response instead of throwing

4. **Add integration tests**
   - File: `apps/oak-curriculum-mcp-streamable-http/src/auth-error-handler.integration.test.ts`
   - Test: Full request cycle with missing token → `_meta` emission
   - Test: Full request cycle with invalid token → `_meta` emission
   - Test: ChatGPT can parse the error response
   - Test: Error response format matches OpenAI documentation

#### Expected Implementation

```typescript
// auth-error-handler.ts
import type { Request } from 'express';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getPRMUrl } from './auth/mcp-auth/get-prm-url.js';

/**
 * Authentication error types that trigger OAuth linking UI in ChatGPT.
 */
export type AuthErrorType =
  | 'invalid_token'
  | 'insufficient_scope'
  | 'token_expired'
  | 'missing_token';

/**
 * Creates MCP tool result with _meta["mcp/www_authenticate"] for auth errors.
 *
 * Per OpenAI Apps SDK documentation, ChatGPT triggers its OAuth linking UI when:
 * 1. Tool has securitySchemes in registration (done in Phase 2.1)
 * 2. Tool returns error with _meta["mcp/www_authenticate"] (this function)
 *
 * Both conditions must be met for "Connect" button to appear.
 *
 * @param errorType - Type of authentication error
 * @param description - Human-readable error description
 * @param req - Express request (for generating resource metadata URL)
 * @returns MCP CallToolResult with _meta field
 *
 * @see https://platform.openai.com/docs/guides/apps-authentication
 */
export function createAuthErrorResponse(
  errorType: AuthErrorType,
  description: string,
  req: Request,
): CallToolResult {
  const prmUrl = getPRMUrl(req);

  // Format WWW-Authenticate header value per RFC 6750
  const wwwAuthenticate =
    `Bearer resource_metadata="${prmUrl}", ` +
    `error="${errorType}", ` +
    `error_description="${description}"`;

  return {
    content: [
      {
        type: 'text',
        text: `Authentication required: ${description}`,
      },
    ],
    isError: true,
    _meta: {
      'mcp/www_authenticate': [wwwAuthenticate],
    },
  };
}
```

```typescript
// handlers.ts (enhanced)
export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  // ... existing setup ...

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.name,
        description: tool.description ?? tool.name,
        inputSchema: input,
        securitySchemes: tool.securitySchemes, // ← Phase 2.1
      },
      async (params: unknown) => {
        try {
          // ... existing execution logic ...
          return executor(tool.name, params ?? {});
        } catch (error) {
          // Detect authentication errors
          if (isAuthError(error)) {
            // Return MCP-compliant auth error with _meta
            return createAuthErrorResponse(
              getAuthErrorType(error),
              getAuthErrorDescription(error),
              // Need request context - may require refactoring handler signature
            );
          }
          // Re-throw non-auth errors
          throw error;
        }
      },
    );
  }
}
```

#### Acceptance Criteria

- [ ] Tests written FIRST (Red)
- [ ] Auth error handler implemented (Green)
- [ ] `_meta["mcp/www_authenticate"]` format matches OpenAI spec
- [ ] Error messages are user-friendly
- [ ] All auth error types handled (invalid, missing, expired, insufficient scope)
- [ ] Integration tests prove end-to-end flow
- [ ] Quality gates pass

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Tool-level auth errors trigger ChatGPT linking UI
- Committed with messages: "test: add tests for tool-level auth error handling" then "feat: implement \_meta emission for OAuth linking"

#### Notes

**Request Context Challenge**: The current tool handler signature doesn't include Express `Request`. We may need to:

- Store request in async context (Node.js AsyncLocalStorage)
- Pass request through tool execution context
- Or refactor handler registration to include request access

Choose simplest approach that doesn't compromise quality.

---

### Sub-Phase 2.8: Phase 2 Validation and Quality Gates

**Goal**: Prove Phase 2 complete and regression-free.

#### Tasks

1. **Run complete quality gate sequence**

   ```bash
   pnpm format:root
   pnpm type-check
   pnpm lint -- --fix
   pnpm test
   pnpm build
   ```

2. **Run E2E tests**

   ```bash
   pnpm test:e2e
   ```

   - Verify existing flows unchanged (with flag OFF)
   - Verify new flows work (with flag ON)

3. **Manual testing with MCP Inspector**
   - Start server with feature flag ON
   - Connect MCP Inspector
   - Test `tools/list` without auth → should work
   - Test `tools/call` without auth → should fail (if tool requires auth)
   - Test `tools/call` with auth → should work

4. **Documentation**
   - Update `apps/oak-curriculum-mcp-streamable-http/README.md`
   - Document method-aware routing
   - Document feature flag
   - Provide examples

#### Acceptance Criteria

- [ ] All quality gates pass
- [ ] E2E tests pass (both flag states)
- [ ] Manual testing with MCP Inspector successful
- [ ] Zero regressions with flag OFF
- [ ] New behaviour works with flag ON
- [ ] Documentation updated

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Phase 2 overall acceptance criteria achieved
- Ready to proceed to Phase 3

---

## Phase 3: Validation - Real-World Client Testing

**Objective**: Validate the implementation with real MCP clients, especially ChatGPT.

**Layer**: System validation (E2E)  
**Approach**: Manual testing + automated E2E tests

---

### Sub-Phase 3.1: MCP Inspector Testing

**Goal**: Prove the server works with MCP Inspector (reference implementation).

#### Tasks

1. **Set up test environment**
   - Deploy server locally with feature flag ON
   - Install MCP Inspector (if not already)
   - Configure authentication (Clerk development tenant)

2. **Test discovery flow**
   - Connect MCP Inspector to server
   - Verify: `tools/list` returns all tools
   - Verify: Tool metadata includes security schemes
   - Verify: No auth errors during discovery

3. **Test authentication flow**
   - Verify: OAuth metadata endpoint accessible
   - Verify: Inspector can discover Clerk auth server
   - Verify: Inspector can register client (DCR)
   - Verify: Inspector can complete OAuth flow

4. **Test execution flow**
   - Verify: Calling tool without auth fails (for oauth2 tools)
   - Verify: Calling tool with auth succeeds
   - Verify: Token validation works
   - Verify: Calling noauth tool without auth succeeds (if any in PUBLIC_TOOLS)

5. **Document findings**
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/testing-with-mcp-inspector.md`
   - Include screenshots or command outputs
   - Note any issues or edge cases

#### Acceptance Criteria

- [ ] MCP Inspector can connect to server
- [ ] Discovery works without authentication
- [ ] OAuth flow completes successfully
- [ ] Tool execution respects security schemes
- [ ] All findings documented

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Documentation with evidence (logs, screenshots)

---

### Sub-Phase 3.2: ChatGPT Integration Testing

**Goal**: Validate the server works as a ChatGPT app (primary requirement).

#### Tasks

1. **Register MCP server in ChatGPT**
   - Follow ChatGPT Apps SDK registration process
   - Configure server URL
   - Configure OAuth settings (Clerk)

2. **Test ChatGPT discovery**
   - Open ChatGPT
   - Verify: ChatGPT can discover tools
   - Verify: ChatGPT shows OAuth "Connect" button
   - Verify: No errors during discovery

3. **Test ChatGPT authentication**
   - Click "Connect" in ChatGPT
   - Verify: OAuth flow launches
   - Verify: User can authenticate with Clerk
   - Verify: ChatGPT receives access token
   - Verify: ChatGPT stores token for subsequent requests

4. **Test ChatGPT tool execution**
   - Invoke a tool via ChatGPT chat
   - Verify: Tool executes successfully
   - Verify: Results returned to ChatGPT
   - Verify: Token reused across multiple tool calls

5. **Document findings**
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/chatgpt-integration.md`
   - Include screenshots of ChatGPT UI
   - Note any issues or limitations

#### Acceptance Criteria

- [ ] Server registers successfully in ChatGPT
- [ ] ChatGPT discovers tools without auth
- [ ] OAuth "Connect" UI appears in ChatGPT
- [ ] User can authenticate successfully
- [ ] Tool execution works in ChatGPT
- [ ] All findings documented

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Documentation with evidence (screenshots, chat logs)

---

### Sub-Phase 3.3: Automated E2E Tests

**Goal**: Create automated E2E tests that prove ChatGPT-compatible behaviour.

#### Tasks

1. **Write E2E test for discovery without auth**
   - File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/chatgpt-compat.e2e.test.ts`
   - Test: POST /mcp with `tools/list` (no Bearer token)
   - Assert: 200 response with tools array
   - Assert: Each tool includes `securitySchemes`

2. **Write E2E test for protected resource metadata**
   - Test: GET `/.well-known/oauth-protected-resource`
   - Assert: 200 response with metadata
   - Assert: Metadata includes `authorization_servers`
   - Assert: Metadata includes `scopes_supported` (generated from tools)

3. **Write E2E test for OAuth flow**
   - Test: OAuth metadata endpoint
   - Test: Token verification with invalid token → 401
   - Test: Token verification with valid token → success

4. **Write E2E test for per-tool authorization**
   - Test: Call oauth2 tool without token → 401
   - Test: Call oauth2 tool with valid token → success
   - Test: Call noauth tool without token → success (if PUBLIC_TOOLS has any)

5. **Add to CI pipeline**
   - Update CI config to run E2E tests
   - Ensure tests use test Clerk tenant (not production)

#### Acceptance Criteria

- [ ] E2E tests written for all ChatGPT-compatible behaviours
- [ ] All E2E tests pass locally
- [ ] E2E tests integrated into CI
- [ ] Tests use test credentials (no production secrets)

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- E2E tests provide regression protection

---

### Sub-Phase 3.4: Performance and Security Validation

**Goal**: Ensure the implementation doesn't introduce performance regressions or security issues.

#### Tasks

1. **Performance testing**
   - Measure: Time to serve `tools/list` (with/without auth)
   - Measure: Time to execute tool (with auth)
   - Compare: Before/after implementation
   - Target: No significant regression (< 10% slower)

2. **Security review**
   - Review: All auth decision points
   - Verify: No auth bypass vulnerabilities
   - Verify: Token validation still robust
   - Verify: No secrets in logs or errors
   - Verify: PUBLIC_TOOLS list is intentional

3. **Load testing** (optional but recommended)
   - Test: Concurrent `tools/list` requests
   - Test: Concurrent `tools/call` requests
   - Verify: Server handles load gracefully
   - Verify: No race conditions in auth logic

4. **Document findings**
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/performance-and-security.md`
   - Include metrics, graphs, analysis
   - Note any concerns or recommendations

#### Acceptance Criteria

- [ ] Performance metrics collected and acceptable
- [ ] Security review completed with no issues
- [ ] Load testing passed (if performed)
- [ ] All findings documented

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- No performance or security regressions

---

### Sub-Phase 3.5: Phase 3 Validation and Final Sign-Off

**Goal**: Prove entire implementation complete, tested, and production-ready.

#### Tasks

1. **Run complete quality gate sequence**

   ```bash
   pnpm clean
   pnpm type-gen
   pnpm format:root
   pnpm type-check
   pnpm lint -- --fix
   pnpm test
   pnpm build
   pnpm test:e2e
   ```

2. **Review all acceptance criteria**
   - Go through Phases 1, 2, 3 acceptance criteria
   - Verify all checked off
   - Verify all DoD met

3. **Update architecture documentation**
   - File: `docs/architecture/mcp-authentication.md`
   - Document policy-driven security flow
   - Include diagrams (sequence, architecture)
   - Explain design decisions
   - Document PUBLIC_TOOLS configuration

4. **Create deployment plan**
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/deployment.md`
   - Document feature flag rollout strategy
   - Document rollback procedure
   - Document monitoring and observability
   - Document how to update PUBLIC_TOOLS if needed

5. **Document Clerk-specific configuration** (NEW)
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/clerk-configuration-guide.md`

   **Required content:**

   a. **Clerk Application Setup**
   - Step-by-step Clerk Dashboard navigation
   - Create new application (or use existing)
   - Select correct application type
   - Configure OAuth settings
   - Screenshots of each critical screen

   b. **OAuth Configuration**
   - Enable OAuth 2.0 / OpenID Connect
   - Configure redirect URIs (development and production)
   - Enable required OAuth grant types (authorization code + PKCE)
   - Configure token lifetimes
   - Enable Dynamic Client Registration (if not default)
   - Configure resource parameter handling (if configurable)

   c. **MCP-Specific Settings**
   - Configure allowed scopes (`openid`, `email`, `profile`)
   - Set up JWKS endpoint for token validation
   - Configure CORS settings for MCP server domain
   - Set up webhook endpoints (if needed)

   d. **Environment Variables**
   - `CLERK_PUBLISHABLE_KEY` - where to find, how to set
   - `CLERK_SECRET_KEY` - where to find, how to secure
   - `CLERK_ISSUER_URL` - format and discovery
   - Any other Clerk-specific env vars

   e. **Development vs Production**
   - Using Clerk development instance for testing
   - Migrating configuration to production
   - Domain and redirect URI differences
   - Testing strategies for each environment

   f. **Verification Steps**
   - How to test Clerk configuration
   - Using Clerk's built-in testing tools
   - Verifying OAuth metadata endpoints
   - Testing token issuance and validation

6. **Create Clerk integration troubleshooting guide** (NEW)
   - File: `apps/oak-curriculum-mcp-streamable-http/docs/clerk-troubleshooting.md`

   **Required content:**

   a. **Common Error Scenarios**
   - "Invalid redirect URI" - causes and fixes
   - "Token verification failed" - debugging steps
   - "Resource parameter not found in token" - Clerk configuration issue
   - "Dynamic client registration failed" - Clerk settings to check
   - "PKCE validation failed" - common misconfigurations

   b. **OAuth Flow Debugging**
   - Enable verbose logging for OAuth flow
   - Inspect authorization requests (browser DevTools)
   - Inspect token responses (structure and claims)
   - Validate JWT tokens manually (jwt.io)
   - Check Clerk Dashboard logs for errors

   c. **Clerk-Specific Debug Techniques**
   - Using Clerk Dashboard's "Logs" view
   - Understanding Clerk error codes
   - Clerk session inspection and management
   - Testing with Clerk's OAuth playground (if available)

   d. **MCP + ChatGPT Specific Issues**
   - ChatGPT can't discover tools → check metadata endpoints
   - ChatGPT "Connect" button doesn't appear → verify securitySchemes + \_meta
   - OAuth flow starts but fails → check redirect URIs
   - Tokens rejected by MCP server → verify resource parameter
   - Token works initially but fails later → check token expiration

   e. **Support Resources**
   - Clerk documentation links (relevant pages)
   - Clerk community forum or Discord
   - Clerk support contact (if enterprise customer)
   - OpenAI Apps SDK documentation
   - MCP authorization spec reference

   f. **Known Issues and Workarounds**
   - Document any Clerk limitations discovered in Phase 0
   - Workarounds for partial feature support
   - Plans for future improvements
   - Alternative approaches if certain features unavailable

7. **Final review**
   - Code review with team
   - Architecture review
   - Security review
   - Sign-off from stakeholders

#### Acceptance Criteria

- [ ] All quality gates pass
- [ ] All phase acceptance criteria met
- [ ] Architecture documentation complete
- [ ] Deployment plan documented
- [ ] Clerk configuration guide complete with screenshots
- [ ] Clerk troubleshooting guide complete
- [ ] All Clerk-specific documentation reviewed and tested
- [ ] Stakeholder sign-off received

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Implementation ready for production deployment

---

## Risk Management

### Identified Risks

| Risk                                   | Likelihood | Impact   | Mitigation                                                                      |
| -------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------- |
| Clerk lacks required OAuth features    | Medium     | Critical | **Phase 0 research validates Clerk compatibility before implementation starts** |
| Generator changes break existing tools | Medium     | High     | Comprehensive tests, gradual rollout with feature flag                          |
| ChatGPT has undocumented requirements  | Medium     | High     | Test with real ChatGPT early (Phase 3), iterate if needed                       |
| Performance regression                 | Low        | Medium   | Performance testing in Phase 3, load testing                                    |
| Security vulnerability in auth logic   | Low        | Critical | Security review, pure functions (easier to reason about), E2E tests             |
| Type generation breaks                 | Low        | High     | Extensive integration tests, run `pnpm type-gen` frequently                     |
| Wrong tools in PUBLIC_TOOLS            | Medium     | Medium   | Security review, documentation, tests                                           |
| Runtime-defined tools inconsistency    | Low        | Low      | Temporary manual security metadata for `search`/`fetch` until Phase 0 complete  |

### Risk Response

**If Clerk lacks required OAuth features (Phase 0 finding):**

- Halt implementation immediately
- Escalate to team for architecture decision
- Evaluate alternatives: Auth0, Stytch, Okta, custom OAuth implementation
- Document required features and gap analysis
- Create new plan with chosen alternative
- **Do not proceed to Phase 1 without GO decision**

**If generator changes break tools:**

- Roll back to previous generator version
- Fix issue with TDD
- Re-run full quality gates

**If ChatGPT doesn't work:**

- Check logs for auth errors
- Test with MCP Inspector first (reference implementation)
- Consult OpenAI documentation
- Consult Clerk support if OAuth flow issue
- Adjust implementation based on findings

**If performance unacceptable:**

- Profile to find bottleneck
- Optimise hot path
- Consider caching generated metadata

**If security issue found:**

- Fix immediately
- Add test that would have caught it
- Security review before deploy

**If PUBLIC_TOOLS misconfigured:**

- Review security implications
- Update configuration
- Re-run type-gen
- Test thoroughly

---

## Success Metrics

### Technical Metrics

- [ ] 100% of MCP security policy flows to tool descriptors
- [ ] Zero hard-coded security logic in runtime (except PUBLIC_TOOLS config)
- [ ] All quality gates pass (format, type-check, lint, test, build)
- [ ] E2E test coverage for all auth scenarios
- [ ] Performance: < 10% regression vs baseline
- [ ] Code coverage: > 90% for new code

### Functional Metrics

- [ ] ChatGPT can discover tools without authentication
- [ ] ChatGPT can complete OAuth flow successfully
- [ ] ChatGPT can execute authenticated tools
- [ ] MCP Inspector compatibility maintained
- [ ] Cursor compatibility maintained (if applicable)

### Process Metrics

- [ ] All work done with TDD (tests first)
- [ ] All commits atomic and well-described
- [ ] All quality gates run after each sub-phase
- [ ] Zero skipped tests
- [ ] Zero commented-out code
- [ ] All documentation complete

---

## Timeline Estimate

**Assumptions:**

- Single developer, full-time focus
- Access to ChatGPT for testing
- Clerk supports all required OAuth features (validated in Phase 0)
- No major blockers

| Phase       | Sub-Phases | Estimated Time | Notes                                           |
| ----------- | ---------- | -------------- | ----------------------------------------------- |
| **Phase 0** | Research   | **1-2 days**   | **BLOCKING** - Clerk capability validation      |
| Phase 1     | 1.1 - 1.7  | 3-4 days       | Generator changes (can start if Phase 0 passes) |
| Phase 2     | 2.1 - 2.8  | 4-5 days       | Runtime changes (includes new sub-phases)       |
| Phase 3     | 3.1 - 3.5  | 2-3 days       | Validation and documentation                    |
| **Total**   |            | **10-14 days** | Excludes Phase 0 decision time                  |

**Note:** Timeline assumes TDD discipline (tests first). May be faster once patterns established.

**Critical Path:** Phase 0 must complete with GO decision before Phase 1 begins. Phase 1 has no runtime dependencies and can proceed in parallel with Phase 2 planning if Phase 0 validates Clerk compatibility.

---

## Rollout Strategy

### Step 1: Development (Feature Flag OFF)

- Implement all phases
- Run all tests
- Verify backward compatibility

### Step 2: Staging (Feature Flag ON)

- Deploy to staging environment
- Test with MCP Inspector
- Test with ChatGPT (if available in staging)
- Monitor logs for errors

### Step 3: Production (Gradual Rollout)

- Deploy with feature flag OFF initially
- Enable for 10% of requests (if traffic-based rollout possible)
- Monitor metrics (errors, latency, auth success rate)
- Gradually increase to 50%, then 100%
- Remove feature flag code once stable

### Rollback Plan

- Turn feature flag OFF immediately
- Deploy previous version if flag doesn't work
- Fix issue in development
- Re-test before re-deploy

---

## Appendix A: Key Files Modified

### Generator (Phase 1)

- `packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts` (new)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/security-types.ts` (new)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/apply-security-policy.ts` (new)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/generate-protected-resource-metadata.ts` (new)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts` (modified)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts` (modified)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts` (modified)

### Runtime (Phase 2)

- `apps/oak-curriculum-mcp-streamable-http/src/mcp-method-classifier.ts` (new)
- `apps/oak-curriculum-mcp-streamable-http/src/mcp-auth-decision.ts` (new)
- `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts` (new)
- `apps/oak-curriculum-mcp-streamable-http/src/application.ts` (modified)
- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (modified)
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` (modified - adds securitySchemes at registration)

### Tests (All Phases)

- Comprehensive unit, integration, and E2E tests (see sub-phases for details)

---

## Appendix B: Commit Message Format

Follow conventional commits:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `test`: Test only (written before feat)
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `chore`: Build, tooling

**Examples:**

```text
test(generator): add tests for MCP security policy application

Prove function applies policy to tools based on PUBLIC_TOOLS list.

Part of Phase 1.3 - TDD red phase
```

```text
feat(generator): implement MCP security policy application

Pure function that determines security scheme for each tool
based on PUBLIC_TOOLS configuration.

Part of Phase 1.3 - TDD green phase
Closes: #123
```

---

## Appendix C: Re-reading Checkpoints

**Mandatory re-reading** of foundation documents at these points:

1. **Before Phase 0 research begins**: Re-read all three foundation docs to understand architectural constraints
2. **After Phase 0 completes (GO decision)**: Re-read all three foundation docs before starting implementation
3. **Start of Phase 1**: Re-read all three foundation docs
4. **Before Sub-Phase 1.5**: Re-read schema-first-execution.md
5. **Start of Phase 2**: Re-read all three foundation docs
6. **Before Sub-Phase 2.4**: Re-read testing-strategy.md
7. **Start of Phase 3**: Re-read all three foundation docs
8. **After any major blocker**: Re-read all three foundation docs

**Purpose**: Ensure continued alignment with principles, especially when tired or frustrated. Phase 0 research must be informed by architectural principles to ask the right questions about Clerk capabilities.

---

## Appendix D: PUBLIC_TOOLS Configuration Guide

### When to Add Tools to PUBLIC_TOOLS

**Guideline**: Only add tools to PUBLIC_TOOLS if there is a clear business requirement for public access.

**Examples of tools that might be public:**

- Discovery/metadata tools (key stages, subjects, year groups)
- Health check endpoints
- Public content that doesn't require auth

**Default**: All tools require OAuth unless explicitly in PUBLIC_TOOLS.

### How to Update PUBLIC_TOOLS

1. Edit `packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts`
2. Add tool name to `PUBLIC_TOOLS` array
3. Run `pnpm type-gen` to regenerate
4. Test thoroughly (security review)
5. Deploy with security sign-off

### Security Considerations

- **Principle of least privilege**: Only make tools public if necessary
- **Review regularly**: Audit PUBLIC_TOOLS list quarterly
- **Document decisions**: Note why each tool is public

---

## Conclusion

This plan implements policy-driven OAuth 2.1 security for MCP tools, enabling ChatGPT compatibility whilst maintaining strict adherence to the Cardinal Rule and TDD principles.

**Key success factors:**

1. **Policy-driven**: Security configuration in one place (PUBLIC_TOOLS)
2. **Generator-first**: Security flows from policy at compile time
3. **TDD always**: Tests written first, red-green-refactor
4. **Pure functions**: Domain logic is pure, testable, and composable
5. **Quality gates**: Run after every sub-phase, fix before proceeding
6. **No shortcuts**: No skipped tests, no disabled checks, no commented code

**Remember the First Question**: Could it be simpler without compromising quality?

The simplest approach: A single configuration file defines policy. Generator applies it. Runtime enforces it. That's it.

---

**Status**: Phase 0 Complete - Ready for Implementation  
**Next Action**: AI agent proceeds to Phase 1, Sub-Phase 1.1 (after re-reading foundation documents).

**Phase 0 Outcome**: ✅ Clerk verified compatible. All critical OAuth 2.1 features confirmed. Resource parameter behavior will be verified empirically in Phase 2.4.
