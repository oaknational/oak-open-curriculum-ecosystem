# Sub-Phase 2.3: Auth Decision Logic - Pure Function Reading Tool Metadata

## Context

Implement Sub-Phase 2.3 from `@.agent/plans/schema-first-security-implementation.md` (starting at line 1703).

## What Just Completed

Sub-Phase 2.2: Created `isDiscoveryMethod()` pure function to classify MCP protocol methods as "discovery" (no auth) or "execution" (requires auth checks).

## Current Task

Create pure function `toolRequiresAuth(toolName: string): boolean` that reads security metadata from generated tool descriptors. This function will determine if a specific tool requires authentication by checking the `securitySchemes` field in its descriptor.

## Key Constraints

1. **Read plan first**: `@.agent/plans/schema-first-security-implementation.md` (Section: Sub-Phase 2.3)
2. **Follow TDD strictly**: Red → Green → Refactor (tests first, always)
3. **All quality gates must pass**: format, type-check, lint, test, build
4. **Schema-first architecture**: Security metadata flows from generated descriptors (already in place from Phase 1)
5. **Pure functions only**: No side effects, no I/O, deterministic
6. **Follow project rules**: `@.agent/directives-and-memory/rules.md` and `@docs/agent-guidance/testing-strategy.md`

## Starting Point

The security metadata is already generated and available:

- Tool descriptors have `securitySchemes?: readonly SecurityScheme[]` field
- Helper function: `getToolFromToolName(name)` in SDK
- All tools are registered with their security metadata

Create the pure function that reads this data and returns whether auth is required.

## Success Criteria

- Tests written first (Red phase complete)
- Implementation passes all tests (Green phase)
- All quality gates pass (Refactor phase)
- Zero regressions across 177 tests
- Function is pure (no side effects)

Begin with Red phase: write comprehensive unit tests first.
