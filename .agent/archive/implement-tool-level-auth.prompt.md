# Implement Tool-Level OAuth Authentication

## Context

We have an MCP HTTP server that currently implements **HTTP-level authorization** (middleware returning HTTP 401), but we need **tool-level authorization** (returning HTTP 200 with MCP errors containing `_meta["mcp/www_authenticate"]`) to work with ChatGPT and the OpenAI Apps SDK.

## Your Task

Implement tool-level OAuth authentication following the plan in @.agent/plans/auth-observability-and-completion.md, strictly adhering to the rules in @.agent/directives-and-memory/rules.md and @.agent/directives-and-memory/testing-strategy.md.

## Critical Requirements

### Architecture

- **MOVE** auth checking FROM middleware layer TO tool handlers
- **RETURN** HTTP 200 with MCP error results (not HTTP 401)
- **INCLUDE** `_meta["mcp/www_authenticate"]` in error results
- **PRESERVE** all observability infrastructure (logging, correlation IDs)
- **MAINTAIN** pure verification functions (don't rewrite what works)

### Implementation Standards

- ✅ **TDD at ALL levels**: E2E tests FIRST, then integration, then implementation
- ✅ **No V1/V2 versioning**: Update files in place, use git history
- ✅ **No compatibility layers**: Replace old approach with new approach
- ✅ **Maintain observability**: Comprehensive logging at all decision points
- ✅ **Fix type error**: Line 85 in `create-auth-log-context.unit.test.ts` as part of cleanup

## Reference Documents

### Primary Plan

- @.agent/plans/auth-observability-and-completion.md - **READ THIS FIRST**
  - Phase 1: Complete architectural fix (7 sub-phases)
  - Appendix B: Why tool-level auth (OpenAI vs MCP spec)
  - All acceptance criteria and validation steps

### Core Rules

- @.agent/directives-and-memory/rules.md - Architectural principles, TDD, refactoring rules
- @.agent/directives-and-memory/testing-strategy.md - TDD at all levels, test types

### Auth Specifications

- @.agent/reference-docs/openai-apps-auth.md - **Our target implementation**
  - Lines 175-266: Triggering authentication UI
  - Lines 243-266: Tool-level `_meta["mcp/www_authenticate"]`
- @.agent/reference-docs/mcp-auth-spec.md - For contrast (HTTP-level, not our approach)

### Current Implementation (to understand what exists)

- @apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.ts - KEEP (pure function)
- @apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.ts - KEEP (pure function)
- @apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-response-helpers.ts - ADAPT for tool-level
- @apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts - REMOVE (HTTP middleware)
- @apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts - REMOVE or simplify (conditional auth)

## Key Insights from Testing

**MCP Inspector Testing Revealed**:

- MCP Inspector doesn't support OAuth for HTTP transports yet
- Inspector expects HTTP 200 responses (not 401)
- Our HTTP 401 approach was correctly rejected
- Tool-level auth is the correct pattern for ChatGPT integration

**What the Logs Showed**:

```json
// Current (WRONG):
{"statusCode": 401, "error": "Unauthorized", "message": "Invalid JWT format"}

// Target (CORRECT):
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{"type": "text", "text": "Authentication required"}],
    "isError": true,
    "_meta": {
      "mcp/www_authenticate": [
        "Bearer resource_metadata=\"http://localhost:3333/.well-known/oauth-protected-resource\", error=\"insufficient_scope\", error_description=\"You need to login to continue\""
      ]
    }
  }
}
```

## Implementation Approach (TDD Workflow)

### Phase 1: Sub-Phase 1.1 - E2E Tests (RED Phase)

**Start here**: Update E2E tests to specify new behavior FIRST.

1. Read current E2E tests:
   - @apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts
   - @apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts

2. Update tests to expect:
   - HTTP 200 (not 401) for protected tools without auth
   - MCP error result with `isError: true`
   - `_meta["mcp/www_authenticate"]` present
   - Proper error codes and descriptions

3. Run tests - they MUST FAIL (RED phase, proving new spec)

### Phase 1: Sub-Phase 1.2 - Integration Tests (RED Phase)

1. Create new integration test:
   - `src/tool-handler-with-auth.integration.test.ts`
   - Specify how auth context flows to tool handlers
   - Specify MCP error result format

2. Run tests - they MUST FAIL (RED phase)

### Phase 1: Sub-Phase 1.3-1.7 - Implementation (GREEN Phase)

Follow the plan systematically:

- Sub-Phase 1.3: Remove HTTP-level auth middleware
- Sub-Phase 1.4: Implement tool-level auth checking
- Sub-Phase 1.5: Update unit tests (fix type error)
- Sub-Phase 1.6: Clean up dead code
- Sub-Phase 1.7: Final validation

Each step has detailed acceptance criteria in the plan.

## What to Keep (Already Working)

### Pure Functions (Reuse These)

- ✅ `verifyClerkToken()` - Token verification logic
- ✅ `validateResourceParameter()` - RFC 8707 validation
- ✅ `createAuthLogContext()` - Logging context creation
- ✅ Clerk integration setup
- ✅ Protected resource metadata endpoint

### Observability Infrastructure (Preserve This)

- ✅ Correlation IDs
- ✅ Sensitive data redaction
- ✅ Standardized log context
- ✅ Debug-level logging at all decision points

## What to Change

### Remove (HTTP-Level Auth)

- ❌ `src/auth/mcp-auth/mcp-auth.ts` - Middleware returning HTTP 401
- ❌ `src/mcp-router.ts` - Conditional auth middleware application
- ❌ Related middleware integration tests
- ❌ E2E tests expecting HTTP 401

### Add/Update (Tool-Level Auth)

- ✅ Auth context extraction in MCP request handler
- ✅ Tool handler wrapper checking auth before execution
- ✅ MCP error result builder with `_meta`
- ✅ Updated E2E tests expecting HTTP 200 + MCP errors
- ✅ New integration tests for tool-level auth flow

## Success Criteria

### Tests

- [ ] All E2E tests pass (expecting HTTP 200 + MCP errors)
- [ ] All integration tests pass (auth context flow)
- [ ] All unit tests pass (pure functions, type error fixed)
- [ ] ~350+ total tests passing

### Quality Gates

- [ ] `pnpm type-check` - 0 errors
- [ ] `pnpm lint` - 0 errors/warnings
- [ ] `pnpm test` - all pass
- [ ] `pnpm test:e2e` - all pass
- [ ] `pnpm build` - successful

### Observability

- [ ] Logs show auth context extraction
- [ ] Logs show auth verification (when present)
- [ ] Logs show "auth required but missing" (when applicable)
- [ ] Logs show "authentication successful" (when valid)
- [ ] All sensitive data redacted
- [ ] Correlation IDs present in all auth logs

### Behavior

- [ ] Discovery methods work without auth (already did, still do)
- [ ] Protected tools return HTTP 200 (not 401)
- [ ] Protected tools without auth return MCP error with `_meta`
- [ ] Protected tools with valid auth execute successfully
- [ ] Public tools (like `get-changelog`) work without auth

## Validation Commands

```bash
# After each sub-phase, run relevant checks:

# E2E tests (should fail initially, then pass)
pnpm test:e2e

# Integration tests
pnpm test src/tool-handler-with-auth.integration.test.ts

# All tests
pnpm test

# Type checking
pnpm type-check

# Final quality gate (run after Phase 1.7)
pnpm format:root && pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e && pnpm build
```

## Manual Testing After Implementation

```bash
# Start server
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev

# In another terminal:

# Test discovery (should work, no auth)
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Test protected tool without auth (should return HTTP 200 with MCP error)
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"test"}}}' | jq

# Expected: HTTP 200, result.isError=true, result._meta["mcp/www_authenticate"] present
```

## Common Pitfalls to Avoid

1. ❌ **Don't create V1/V2 files** - Update in place, use git history
2. ❌ **Don't create compatibility layers** - Replace old with new
3. ❌ **Don't skip E2E test updates** - They must be updated FIRST (TDD)
4. ❌ **Don't lose observability** - Maintain all logging throughout
5. ❌ **Don't rewrite pure functions** - Reuse `verifyClerkToken`, etc.
6. ❌ **Don't forget type error** - Fix line 85 in `create-auth-log-context.unit.test.ts`

## Questions to Ask During Implementation

1. **Before changing anything**: "Have I updated the E2E tests FIRST to specify the new behavior?"
2. **When removing middleware**: "Am I preserving the pure verification functions?"
3. **When implementing tool-level auth**: "Does this return HTTP 200 with `_meta`?"
4. **After each change**: "Do the tests at this level pass now?"
5. **Before considering done**: "Have I run all quality gates?"

## Timeline Expectation

**Estimated: 1-2 days** following strict TDD

- Sub-Phase 1.1 (E2E tests): 2-3 hours
- Sub-Phase 1.2 (Integration tests): 2-3 hours
- Sub-Phase 1.3 (Remove middleware): 1-2 hours
- Sub-Phase 1.4 (Implement tool-level): 3-4 hours
- Sub-Phase 1.5 (Unit tests): 1-2 hours
- Sub-Phase 1.6 (Cleanup): 1 hour
- Sub-Phase 1.7 (Validation): 1 hour

## Getting Started

1. **Read the plan**: @.agent/plans/auth-observability-and-completion.md (Phase 1 in detail)
2. **Read the rules**: @.agent/directives-and-memory/rules.md (TDD, refactoring)
3. **Read auth spec**: @.agent/reference-docs/openai-apps-auth.md (lines 175-266)
4. **Start with Sub-Phase 1.1**: Update E2E tests FIRST
5. **Follow TDD strictly**: Red → Green → Refactor at each level
6. **Validate continuously**: Run tests after each change
7. **Maintain observability**: Log all auth decisions with correlation IDs

## Ready to Begin?

Start with: "I'll implement tool-level OAuth authentication following Phase 1 of the plan, beginning with Sub-Phase 1.1 (E2E test updates)."

Then systematically work through each sub-phase, running tests at each step, until all quality gates pass and the implementation is complete.
