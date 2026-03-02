# Type Remediation — Strict Type Discipline

**Status**: ✅ ARCHIVED — Complete  
**Priority**: CRITICAL — Architectural integrity  
**Plan**: [type-remediation.plan.md](../plans/archive/type-remediation.plan.md)  
**Created**: 2025-12-26  
**Updated**: 2025-12-26 (implementation complete)  
**Archived**: 2025-12-26

---

## Current State

A previous attempt at type remediation was made. It achieved:

- ✅ Type information flows from call site to `structuredContent`
- ✅ All quality gates pass
- ✅ Consumers can access typed properties
- ✅ No compatibility layers

But it **violated the cardinal rules** by:

- ❌ Adding `eslint-disable` comments in `format-optimized-result.ts`
- ❌ Using type assertions (`as`) in multiple places
- ❌ Not creating the required ADR

**The work is functionally correct but architecturally non-compliant.**

This prompt guides fixing those violations properly.

---

## The Cardinal Rules (Zero Exceptions)

From `rules.md`:

> "Never use `as`, `any`, `!`, or `Record<string, unknown>` — they ALL disable the type system"

> "NEVER disable checks — Never disable any quality gates, never disable type checks, never disable any linting"

> "Never work around checks — ALWAYS fix the root cause, never work around it"

**These rules have NO exceptions. "Never" means never.**

If you find yourself thinking "in this case it's justified" — STOP. That is exactly the thinking pattern that creates technical debt.

---

## Foundation Documents (MUST READ FIRST)

Before ANY work:

1. **[rules.md](../directives/rules.md)** — Especially "No type shortcuts" and "NEVER disable checks"
2. **[testing-strategy.md](../directives/testing-strategy.md)** — TDD at all levels
3. **[schema-first-execution.md](../directives/schema-first-execution.md)** — Types flow from source

Read them fully. Internalise them. They are not guidelines — they are constraints.

---

## The Problem

The MCP SDK types `CallToolResult.structuredContent` as `{ [key: string]: unknown }`. This is an **external library boundary**.

The question is: how do we preserve type information **internally** while still being compatible with this external type?

### Wrong Approach (What Was Done)

```typescript
// ❌ WRONG: Used eslint-disable to hide the violation
/* eslint-disable @typescript-eslint/no-restricted-types */

// ❌ WRONG: Used type assertion to satisfy TypeScript
return result as T & StructuredContentMetadata;

// ❌ WRONG: Used type assertion for serialisation
const serialisedFullData = serialiseArg(options.fullData) as T;
```

This "works" but violates the rules. It's the **quick path**, not the **correct path**.

### Correct Approach (What Must Be Done)

If TypeScript complains, **restructure the code** rather than assert away the error.

Options to explore:

1. **Build the object differently** — Avoid spread operators that lose type info
2. **Use runtime type construction** — Build the result piece by piece with known types
3. **Accept the SDK boundary differently** — Return our typed result, convert at transport layer only
4. **Use declaration merging or module augmentation** — Extend the SDK type if truly necessary

The key insight: there IS a way to do this without assertions. The previous attempt chose the quick path. This attempt must find the correct path.

---

## Specific Violations to Fix

### File: `format-optimized-result.ts`

Current violations:

```typescript
// Line 22-23: eslint-disable comment
/* eslint-disable @typescript-eslint/no-restricted-types, @typescript-eslint/consistent-type-assertions */

// buildMeta function: Type assertions for optional property assignment
(meta as { toolName: string }).toolName = toolName;

// buildStructuredContent function: Type assertion for return
return result as T & StructuredContentMetadata;

// formatOptimizedResult function: Type assertion after serialisation
const serialisedFullData = serialiseArg(options.fullData) as T;
```

### Fix Strategy

1. **Remove the eslint-disable comment entirely**
2. **Restructure `buildMeta`** — Use object literal with conditional spreading, or builder pattern
3. **Restructure `buildStructuredContent`** — Build the object in a way TypeScript understands
4. **Fix serialisation typing** — Either make `serialiseArg` generic, or handle the type flow differently

---

## Implementation Approach

### Do NOT

- Add `eslint-disable` comments — This hides problems, doesn't fix them
- Use type assertions (`as`) — This overrides the type checker
- Use `extends Record<string, unknown>` — This is the same problem repackaged
- Use `object` as a generic constraint if ESLint complains — Find another way
- Accept "it's necessary for SDK compatibility" — There IS another way

### DO

- Restructure code until TypeScript accepts it without assertions
- Use runtime type construction if spread doesn't work
- Create typed builders that construct objects step by step
- Push the SDK boundary to the absolute edge (transport layer only)
- Ask: "What is TypeScript telling me about my design?"

---

## TDD Requirement

**All changes must follow strict TDD:**

1. **RED**: Write a test that demonstrates the desired type behaviour WITHOUT assertions
2. **GREEN**: Modify implementation until test compiles and passes
3. **REFACTOR**: Clean up while maintaining green tests

The test itself is the specification. If the test needs `as`, the solution is wrong.

---

## Quality Gates

After EACH change:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

Wait for ALL gates to complete. Analyse in aggregate.

---

## Success Criteria (All Must Be Met)

| Criterion | Verification |
|-----------|--------------|
| 0 uses of `as` in format-optimized-result.ts | Manual inspection |
| 0 `eslint-disable` for type rules | `grep -r "eslint-disable.*type" src/` returns 0 |
| 0 `Record<string, unknown>` (except rules.md) | `grep -r "Record<string, unknown>"` returns 0 |
| Tests compile without assertions | Code review |
| All 11 quality gates pass | Full gate run |
| ADR documented | File exists at specified path |

---

## ADR Requirement

After completion, create:

```
docs/architecture/architectural-decisions/087-type-preserving-mcp-results.md
```

Document:
- The problem (SDK types structuredContent as unknown)
- The solution (how type preservation was achieved WITHOUT assertions)
- Why assertions were rejected (they violate cardinal rules)
- The correct pattern for future MCP result formatting

---

## First Steps for Fresh Chat

1. Read this prompt fully
2. Read `rules.md` — internalise "NEVER disable checks"
3. Read current `format-optimized-result.ts`
4. Identify each type assertion and eslint-disable
5. For EACH violation, ask: "How can I restructure to avoid this?"
6. Write failing test first (TDD RED)
7. Implement until test passes without assertions (TDD GREEN)
8. Run all quality gates
9. Create ADR documenting the pattern

---

## Key Principle

**Choose the correct path over the quick path. Always.**

If fixing something properly takes 10x longer than working around it, take the 10x longer path. The quick path creates debt. The correct path creates value.

The rules exist because they encode hard-won lessons. "Never" means never.
