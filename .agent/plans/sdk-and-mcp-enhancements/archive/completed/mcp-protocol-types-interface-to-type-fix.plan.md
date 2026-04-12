---
name: "Remove unknown from ToolDescriptor via Omit<Tool, '_meta'>"
overview: "Replace `extends Tool` with `extends Omit<Tool, '_meta'>` in the generated ToolDescriptor contract to prevent `Record<string, unknown>` from leaking into our type system via the MCP SDK's `Tool._meta` field."
todos:
  - id: phase-1-fix
    content: "Phase 1: Change generator to emit Omit<Tool, '_meta'>, fix boundary in handlers.ts, run full gates."
    status: completed
  - id: phase-2-validate
    content: "Phase 2: Verify all gate failures resolved, update napkin."
    status: completed
---

# Remove `unknown` from ToolDescriptor via `Omit<Tool, '_meta'>`

**Last Updated**: 2026-04-11
**Status**: COMPLETE
**Scope**: Eliminate `unknown` leaking from the MCP SDK into our
type system via `ToolDescriptor extends Tool`.

---

## Context

### Root Cause

`packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`
declares `ToolMeta` and `ToolAnnotations` as `interface` despite
the TSDoc explicitly stating "Uses `type` (not `interface`) to
prevent accidental declaration merging." This mismatch was
identified by reviewers in session 2026-04-11d but the fix was
never actually applied to the file.

### The Error

```
error TS2430: Interface 'ToolDescriptor<...>' incorrectly extends
interface '{ ... }'.
  Types of property '_meta' are incompatible.
    Type 'ToolMeta | undefined' is not assignable to
    type '{ [x: string]: unknown; } | undefined'.
      Type 'ToolMeta' is not assignable to
      type '{ [x: string]: unknown; }'.
        Index signature for type 'string' is missing in
        type 'ToolMeta'.
```

### Why `interface` Fails and `type` Succeeds

TypeScript treats `interface` declarations as "open" — they can be
augmented via declaration merging, so the compiler cannot guarantee
that future merged declarations will satisfy an index signature.
A `type` alias is "sealed" — no merging possible — so TypeScript
CAN verify all declared properties satisfy the index signature at
declaration time.

The MCP SDK (v1.29.0) defines `Tool._meta` as
`z.ZodRecord(z.ZodString, z.ZodUnknown)` which infers to
`{ [x: string]: unknown } | undefined`. Our `ToolMeta` has fully
known fields — no `unknown` anywhere. Changing from `interface` to
`type` makes our well-typed `ToolMeta` structurally compatible with
the SDK's loose index signature without introducing `unknown` into
our types.

### Cascade

This single type error in `sdk-codegen` cascades to 11 gate
failures:

| Package | Failed Tasks |
|---------|-------------|
| `@oaknational/sdk-codegen` | build, type-check |
| `@oaknational/curriculum-sdk` | test |
| `@oaknational/oak-curriculum-mcp-streamable-http` | type-check, test, test:e2e, test:ui, test:a11y, test:widget:ui, test:widget:a11y, smoke:dev:stub |

### Type-Reviewer Analysis

The type-reviewer confirmed (session 2026-04-11d):

- `ToolMeta`: **must** change to `type` — this is the complete fix
  for TS2430. Verified with a minimal repro.
- `ToolAnnotations`: **not required** for this error
  (`Tool.annotations` uses a closed `z.ZodObject`, no index
  signature). Recommended for consistency with TSDoc and
  future-proofing.
- **No `unknown` needed**: the `type` alias approach satisfies the
  SDK constraint without adding `unknown`, `{ [key: string]: unknown }`,
  or any intersection with `Tool['_meta']`.

---

## Quality Gate Strategy

**Why full monorepo?** `sdk-codegen` is the foundational package —
build/type-check failures cascade through `curriculum-sdk` and the
app layer. Must verify all 11 failures resolve.

### After Each Task

```bash
pnpm --filter @oaknational/sdk-codegen type-check
```

### After Phase 1

```bash
pnpm check  # Canonical aggregate gate — all 88 tasks must pass
```

---

## Solution

### Principle (from principles.md §Compiler Time Types)

> "`unknown` is type destruction — `unknown`, `z.unknown()`, and
> `Record<string, unknown>` erase structural type information."

We have fully known types. The fix preserves them — no `unknown`
introduced, no type erasure.

### Key Insight

This is a TypeScript language-level distinction (`interface` vs
`type` for index-signature assignability), not an architectural
problem. The fix is two mechanical changes.

**First Question**: Could it be simpler? **Yes — it already is.**
Two `interface` keywords become `type` with `= {` syntax.

**Non-Goals** (YAGNI):

- Do not add index signatures to `ToolMeta` or `ToolAnnotations`
- Do not intersect with `Tool['_meta']`
- Do not change `ToolDescriptor extends Tool`
- Do not refactor security scheme types (tracked separately)

---

## Resolution Plan

### Phase 0: Verify Assumption (~2 min)

#### Task 0.1: Confirm `interface`→`type` fixes TS2430

**Validation**: Change `interface ToolMeta` to `type ToolMeta = {`
(and closing `};`), then run `pnpm --filter @oaknational/sdk-codegen type-check`.

**Acceptance Criteria**:

1. `type-check` exits 0 (no TS2430 on `_meta`)
2. No new type errors introduced

**If it fails**: Investigate whether the SDK's `Tool` type has
additional constraints. Consult the type-reviewer.

**If it passes**: Proceed to Phase 1 with confidence.

---

### Phase 1: Apply Fix (~5 min)

#### Task 1.1: Change `ToolMeta` from `interface` to `type`

**File**: `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`

**Current** (line 116):

```typescript
export interface ToolMeta {
  readonly ui?: { ... };
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly attribution?: SourceAttribution;
}
```

**Target**:

```typescript
export type ToolMeta = {
  readonly ui?: { ... };
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly attribution?: SourceAttribution;
};
```

**Changes**: `export interface ToolMeta {` → `export type ToolMeta = {`
and closing `}` → `};`

#### Task 1.2: Change `ToolAnnotations` from `interface` to `type`

**File**: Same file, line 95.

**Current**:

```typescript
export interface ToolAnnotations {
  readonly readOnlyHint?: boolean;
  // ...
}
```

**Target**:

```typescript
export type ToolAnnotations = {
  readonly readOnlyHint?: boolean;
  // ...
};
```

**Rationale**: Not required for the TS2430 fix (the SDK's
`annotations` field uses a closed schema), but the TSDoc already
says "Uses `type`" and the original plan specified `type`. Apply
for consistency and future-proofing.

#### Task 1.3: Regenerate contract and run full gates

```bash
pnpm sdk-codegen  # Regenerate (no contract change expected)
pnpm check        # Full gate — all 88 tasks must pass
```

**Acceptance Criteria**:

1. `pnpm check` exits 0
2. All 11 previously-failing tasks now pass
3. No new failures introduced
4. TSDoc and code now agree (both say `type`)

---

### Phase 2: Validate and Document (~3 min)

#### Task 2.1: Record in napkin

Add a brief entry to `.agent/memory/napkin.md` documenting:

- The reviewer fix that was noted as "Fixed" but never applied
- The `interface` vs `type` index-signature rule as a gotcha
- Pattern: verify reviewer fixes are actually in the file, not
  just noted in the review summary

#### Task 2.2: Foundation compliance check

- **principles.md — No Type Shortcuts**: No `as`, `any`,
  `Record<string, unknown>`, or `{ [key: string]: unknown }` added
- **principles.md — `unknown` is type destruction**: No `unknown`
  introduced — the SDK's `unknown` stays in the SDK
- **schema-first-execution.md**: Generator output unchanged —
  `ToolDescriptor` still `extends Tool`

---

## Testing Strategy

### Existing Coverage (Sufficient)

- `generate-tool-descriptor-file.unit.test.ts` — verifies
  generated contract structure
- `mcp-tool-generator.unit.test.ts` — integration test for
  generated output
- All existing tests continue to pass — this is a type-level fix
  with zero runtime impact

### New Tests Required

None. The type-check itself IS the test — TS2430 failing was the
regression; TS2430 passing is the fix.

---

## Success Criteria

1. `pnpm check` exits 0 (88/88 tasks pass)
2. Zero `unknown` added to `mcp-protocol-types.ts`
3. TSDoc and code agree on `type` for `ToolMeta` and
   `ToolAnnotations`
4. Napkin documents the gotcha

---

## References

- `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`
  — the file to fix
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`
  — the generated contract that extends `Tool`
- `.agent/directives/principles.md` §Compiler Time Types
- `.cursor/plans/extract_mcp_protocol_types_b9d696d0.plan.md`
  — the plan that created the hand-authored module

---

## Consolidation

After fix is applied and gates pass, run `/jc-consolidate-docs`
only if the napkin entry surfaces a pattern worth extracting
(the `interface` vs `type` gotcha may qualify if it recurs).
