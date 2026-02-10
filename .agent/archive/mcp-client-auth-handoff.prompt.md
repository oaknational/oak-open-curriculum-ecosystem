# MCP Client Auth Implementation - Fresh Session Handoff

## What This Work Is About

We need to implement **MCP client authentication** - allowing ChatGPT to authenticate to our MCP server using OAuth. This is completely separate from how our server authenticates to the Oak Curriculum API (which already works).

## Critical Understanding: Two Separate Auth Systems

**Never confuse these**:

1. **MCP Client Auth** (ChatGPT → our MCP server)
   - This is what we need to implement
   - ChatGPT authenticating to use our server
   - Uses Clerk OAuth with Bearer tokens
   - Auth checking happens BEFORE calling the SDK
   - Returns HTTP 200 with MCP error containing `_meta` on failure
   - OpenAI Apps SDK pattern required

2. **Upstream API Auth** (our server → Oak Curriculum API)
   - Already implemented via ADR-054
   - Our server authenticating to Oak's API using API key
   - Auth error interception happens AFTER SDK execution
   - Do NOT modify this - it's a separate concern

## Key Documents to Review

**Foundation documents** (read these first):

- `.agent/directives/rules.md` - Core rules, TDD, quality gates
- `.agent/directives/testing-strategy.md` - TDD at all levels, test types
- `.agent/directives/schema-first-execution.md` - Schema-first for SDK

**Implementation plan**:

- `.agent/plans/auth-observability-and-completion.md` - Detailed plan with phases

**Auth specifications**:

- `.agent/reference-docs/mcp-auth-spec.md` - MCP Authorization spec
- `.agent/reference-docs/openai-apps-auth.md` - OpenAI Apps SDK auth requirements

**Existing architecture**:

- `apps/oak-curriculum-mcp-streamable-http/docs/architectural-decisions/054-tool-level-auth-error-interception.md` - ADR-054 (upstream API auth)

## Core Principles from Foundation Docs

From `rules.md`:

- TDD at ALL levels - tests FIRST, always RED → GREEN → REFACTOR
- ALL quality gate failures are BLOCKING (no exceptions)
- No type shortcuts (`as`, `any`, `Record<string, unknown>`)
- No V1/V2 versioning - update files in place
- Run ALL quality gates after changes

From `testing-strategy.md`:

- Unit tests: Pure functions, no I/O, no mocks
- Integration tests: Code units working together, simple mocks injected
- E2E tests: Running system, out of process
- Tests MUST be written BEFORE implementation

From `schema-first-execution.md`:

- SDK types flow from OpenAPI schema at type-gen time
- Okay to add metadata to MCP tools at type-gen time
- No manual type overrides in SDK-related code

## Technical Approach

**Problem**: Current implementation uses HTTP-level auth (middleware returning 401), but ChatGPT needs tool-level auth (HTTP 200 with MCP error containing `_meta`).

**Solution**: AsyncLocalStorage pattern

- Flow Express request context through async call chain
- Check MCP client auth BEFORE SDK execution in tool handler
- Return HTTP 200 with `_meta["mcp/www_authenticate"]` on auth failure
- Keep ADR-054 code unchanged (upstream API auth after SDK execution)

## Key Files to Examine

Current auth infrastructure (reusable):

- `apps/oak-curriculum-mcp-streamable-http/src/auth/tool-auth-context.ts` - Auth context extraction
- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.ts` - Token verification
- `apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.ts` - RFC 8707 validation
- `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts` - Check if tool requires auth
- `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts` - Create MCP errors with `_meta`

Files to modify:

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - Add request context wrapping
- `apps/oak-curriculum-mcp-streamable-http/src/tool-handler-with-auth.ts` - Add preventive MCP client auth check

## Next Steps

1. **Review the plan** in `.agent/plans/auth-observability-and-completion.md`
2. **Check current state** - what tests exist? What's implemented?
3. **Follow TDD strictly** - if tests don't exist, write them FIRST
4. **Run quality gates** - establish baseline before making changes
5. **Implement Phase 0** from the plan (quality gate baseline & foundation review)

## Quality Gates Commands

```bash
# Run individually to identify failures
pnpm format-check:root
pnpm type-check
pnpm lint
pnpm markdownlint-check:root
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm test:e2e:built
pnpm smoke:dev:stub
pnpm build
```

Any failure is BLOCKING - must fix before proceeding.

## Command to Agent

Please:

1. Read the foundation documents listed above
2. Review the implementation plan
3. Assess current state (what exists, what doesn't)
4. Follow the plan starting from Phase 0 if ready, or identify what needs to be done first
5. Maintain strict TDD - tests FIRST, always
