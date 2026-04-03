---
name: "OakUrlAugmentable Codegen Fix and Type Predicate ADR"
overview: "Replace widening Record<string, unknown> alias with schema-derived GET response body union; document the constant → type → predicate pattern in a new ADR."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "type-reviewer, architecture-reviewer-fred, code-reviewer"
isProject: false
todos:
  - id: phase-0-verify
    content: "Phase 0: Verify schemaPath availability and existing type infrastructure."
    status: completed
  - id: phase-1-codegen
    content: "Phase 1: Generate GetObjectResponseBody and GetArrayResponseElement types (TDD)."
    status: in_progress
  - id: phase-2-middleware
    content: "Phase 2: Honest middleware validation using schemaPath + isResponseJsonBody200."
    status: pending
  - id: phase-3-functions
    content: "Phase 3: Replace OakUrlAugmentable constraint in augmentation functions."
    status: pending
  - id: phase-4-tests
    content: "Phase 4: Rewrite test fixtures with as const satisfies and generated stubs."
    status: pending
  - id: phase-5-adr
    content: "Phase 5: Write ADR-152 (Constant-Type-Predicate Pattern) and update discoverability."
    status: pending
  - id: phase-6-validation
    content: "Phase 6: Full quality gates, reviewer cycle, and consolidation."
    status: pending
---

# OakUrlAugmentable Codegen Fix and Type Predicate ADR

**Last Updated**: 2026-04-03
**Status**: 🟠 IN PROGRESS — Phase 1 codegen done; Phases 2–3 BLOCKED by
TypeScript spread limitation (see Investigation Record below)
**Scope**: Replace `OakUrlAugmentable = Readonly<Record<string, unknown>>` with
schema-derived types; fix middleware validation; write ADR-152.

---

## Context

`OakUrlAugmentable` in `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts:168`
is defined as `Readonly<Record<string, unknown>>` — a widening violation. The
schema-first principle means every GET response type is known at codegen time.
Using `Record<string, unknown>` destroys that information.

The codegen already generates exhaustive type predicates (34 in total) following
the constant → type → type predicate pattern. The response-map has Zod schemas
for every operation. The validation infrastructure has `isResponseJsonBody200` —
a properly constructed type predicate using `safeParse`. The building blocks
exist; they just need to be connected.

### Partial Progress

During this session, the following changes were made but are incomplete:

- `ValidGetPath` and `GetResponseBody` generated in codegen (path-generators.ts)
- Exported from `api-schema.ts`
- `OakUrlAugmentable` alias removed, `GetResponseBody` used as constraint
- **Build fails** with three errors (see issues below)

### Investigation Record (2026-04-03 session)

#### What was completed

Phase 1 codegen is done (TDD, tests GREEN):

- `GetResponseBody` generated as an explicit union of direct `Paths` indexes
  (one `Paths[P]['get']['responses'][200]['content']['application/json']` per
  GET path). This was changed from the original mapped-type form because
  TypeScript cannot evaluate the mapped conditional chain for spread.
- `GetObjectResponseBody`, `GetArrayResponseBody`, `GetArrayResponseElement`
  generated with `Exclude`/`Extract`/`infer`.
- All three exported from the `api-schema` barrel.
- `generateRuntimeSchemaChecks` now accepts an optional `schema` parameter to
  enumerate paths. Call site in `codegen-core.ts` passes `schema`.
- `generateGetResponseDispatch` added (generates a per-path dispatch function)
  but NOT YET WORKING — see blocker below.
- `OakUrlAugmentable` alias removed from `response-augmentation.ts`.
- Tests: 833 codegen unit tests pass.

#### What was tried and why it failed

**Attempt 1: Mapped type `GetResponseBody`**

```typescript
type GetResponseBody = {
  [P in ValidGetPath]: JsonBody200<P, 'get'>
}[ValidGetPath];
```

**Why tried**: follows the existing pattern for `PathReturnTypes`.
**Why failed**: TypeScript cannot evaluate `JsonBody200` (6+ levels of
conditional/mapped types) when `P` is a union. The resulting type is opaque
to the spread checker → TS2698.

**Attempt 2: `& object` intersection on `GetObjectResponseBody`**

```typescript
type GetObjectResponseBody = Exclude<GetResponseBody, readonly unknown[]> & object;
```

**Why tried**: tells TypeScript the result is an object without changing the
schema-derived semantics.
**Why failed**: user correction — `& object` is no better than
`Record<string, unknown>`. It destroys schema information at the constraint
point. The goal is schema-derived types all the way through.

**Attempt 3: `object` as generic constraint on augmentation functions**

```typescript
function augmentResponseWithOakUrl<T extends object>(response: T, ...): T & { oakUrl?: ... }
```

**Why tried**: `object` enables spread in generics.
**Why failed**: same user correction — `object` is equivalent to
`Record<string, unknown>`. Replaces one widening type with another.

**Attempt 4: Explicit union of `JsonBody200` per path literal**

```typescript
type GetResponseBody =
  | JsonBody200<'/changelog', 'get'>
  | JsonBody200<'/changelog/latest', 'get'>
  | ...;
```

**Why tried**: TypeScript should evaluate `JsonBody200` eagerly for a single
literal path.
**Why failed**: `JsonBody200<'/changelog', 'get'>` is STILL not spreadable.
The conditional chain (`JsonBody200 → NormalizedResponsesFor → Normalize200 →
ResponseForPathAndMethod`) remains opaque to the spread checker even for a
single path literal. Verified empirically in the curriculum-sdk build context.

**Attempt 5: Explicit union of direct `Paths` indexes**

```typescript
type GetResponseBody =
  | Paths['/changelog']['get']['responses'][200]['content']['application/json']
  | ...;
```

**Why tried**: direct type indexing (no conditional types) resolves eagerly.
**Result**: each individual member IS spreadable. A union of up to 20 members
IS spreadable. But 21+ members trigger TS2698. TypeScript has a hard
**20-member union spread evaluation limit**. The Oak API has 27 GET paths.
Verified empirically with inline types (not through barrels or aliases).

**Attempt 6: Remove generics from augmentation functions**

```typescript
function augmentResponseWithOakUrl(response: GetResponseBody, ...): GetResponseBody
```

**Why tried**: without generics, TypeScript evaluates the parameter type
directly rather than through generic constraint reasoning.
**Why failed**: `GetResponseBody` is a 27-member union → exceeds the
20-member spread limit.

**Attempt 7: Per-path dispatch with injected validator callback**
Generated a function with one `if` branch per path. Each branch narrows
`schemaPath` to a single literal, then validates body with an injected
`isValid` callback that narrows to `JsonBody200<P, 'get'>`.
**Why tried**: each branch spreads a single concrete type.
**Why failed**: the callback narrows to `JsonBody200<P, 'get'>` (the
conditional chain), which is NOT spreadable — even for a single literal P.
The direct `Paths[P]['get']['responses'][200]...` form IS spreadable, but
`JsonBody200` is not. There is no way to bridge from `JsonBody200<P, 'get'>`
to `Paths[P]['get']['responses'][200]...` without a type assertion.

#### Verified assumptions

1. ✅ All 27 Oak API paths are GET-only (read-only curriculum API)
2. ✅ `ValidGetPath` = `ValidPath` (all paths have GET)
3. ✅ `Paths[P]['get']['responses'][200]['content']['application/json']` for
   a single path P is a concrete object type that TypeScript can spread
4. ✅ A union of ≤20 such direct-index types is spreadable
5. ✅ A union of ≥21 such direct-index types is NOT spreadable (TS2698)
6. ✅ `JsonBody200<P, 'get'>` for a single literal P is NOT spreadable
   (conditional chain is opaque to spread checker)
7. ✅ `isResponseJsonBody200` narrows to `JsonBody200<P, M>`, not to the
   direct `Paths` index type
8. ✅ The codegen has access to the schema and all paths at generation time
9. ✅ `isResponseJsonBody200` lives in curriculum-sdk (circular dependency
   if the dispatch function is generated in sdk-codegen)

#### Architectural tension (user insight)

The investigation surfaces a layer boundary problem. The response body
**types** live in sdk-codegen (generated from the schema). The response body
**validation** (`isResponseJsonBody200`, Zod-backed type predicates) lives in
curriculum-sdk. The **augmentation** (spread + oakUrl) also lives in
curriculum-sdk.

The validation narrows to `JsonBody200<P, M>` — a conditional chain that
TypeScript cannot evaluate for spread. The direct `Paths` index form IS
spreadable. But bridging from one to the other without a type assertion
requires the validation and the type narrowing to live in the same layer.

**Something in the curriculum-sdk needs moving back into the codegen layer.**
The next session should investigate which piece moves:

- The validation (`isResponseJsonBody200` → codegen)?
- The augmentation (spread → codegen-generated per-path function)?
- The type chain (`JsonBody200` simplified to use direct `Paths` indexes)?

#### Most promising lead

`ResponseForPathAndMethod` is defined via `PathOperation` — a flattened union
of all operations. This forces `JsonBody200` through a conditional type chain:
`PathOperation['path'] extends P ? PathOperation['method'] extends M ? ...`.
TypeScript cannot resolve this even for a single literal P.

If `JsonBody200` were instead defined as direct `Paths` indexing:

```typescript
type JsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Paths[P][M]['responses'][200]['content']['application/json'];
```

...the entire conditional chain disappears. TypeScript resolves simple
indexing eagerly. This might make `JsonBody200` spreadable for single paths,
and (combined with the explicit per-path union for `GetResponseBody`) could
resolve the whole problem without moving any code between packages.

This is the generator-first fix: change the template that defines
`JsonBody200` in `runtimeTypeDerivations()`. The `Normalize200` step may
still be needed if some paths use string `'200'` vs numeric `200` keys, but
the investigation confirmed the generated `Paths` interface uses numeric
`200` throughout.

**Start here.** If this works, the per-path dispatch, the architectural
move, and all the workarounds become unnecessary.

#### Unverified assumptions (for next session)

1. ❓ **HIGHEST PRIORITY**: Could `JsonBody200` be redefined using direct
   `Paths[P][M & keyof Paths[P]]['responses'][200]['content']['application/json']`
   indexing? If so, does it remain spreadable for a single path? For 27 paths?
   Does `Normalize200` become unnecessary?
2. ❓ Can `isResponseJsonBody200` (or its core validation logic) be moved to
   sdk-codegen? The Zod schemas it uses are already generated there.
3. ❓ Can the codegen generate per-path augmentation functions that do the
   spread internally (each function handles one path → one concrete type →
   always spreadable)?
4. ❓ Is there a way to avoid spread entirely? E.g., restructure augmentation
   so that `oakUrl` is injected during JSON serialisation in the middleware.
5. ❓ Is the 20-member spread limit a TypeScript version issue? The repo uses
   TypeScript 5.x. Has this been fixed or configurable in later versions?
6. ❓ Does the `ResponseForPathAndMethod` type need to exist at all? It uses
   `PathOperation` (a flattened union) rather than direct `Paths` indexing.
   If `JsonBody200` were rewritten as
   `Paths[P][M]['responses'][200]['content']['application/json']`, would it
   evaluate eagerly and be spreadable?

#### Current branch state

The branch has UNCOMMITTED changes across multiple files. Build currently
FAILS. The codegen changes (Phase 1) are correct and tested but downstream
consumers are broken because Phases 2–3 are blocked by the spread limitation.

Files modified (uncommitted):
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/path-generators.ts`
  — `generateRuntimeSchemaChecks` accepts schema, explicit union generation,
  `generateGetResponseDispatch` added (not yet working)
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/path-generators.unit.test.ts`
  — new tests for explicit union and dispatch
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/index.ts` — new export
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/index.ts` — new export
- `packages/sdks/oak-sdk-codegen/code-generation/codegen-core.ts` — passes schema, calls dispatch gen
- `packages/sdks/oak-sdk-codegen/src/api-schema.ts` — new exports
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` — `OakUrlAugmentable`
  removed, imports `GetObjectResponseBody`/`GetArrayResponseElement`, constraints
  restored (build fails on spread)
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`
  — `schemaPath` destructured, `isResponseJsonBody200` validation added,
  `isAugmentableObject` deleted, `augmentBody` accepts `unknown`
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts`
  — `invokeOnResponse` updated to accept `schemaPath` parameter (test fixtures
  not yet updated)

### Issue 1: Array types in GetResponseBody union

Some GET 200 responses are arrays (e.g., `/sequences/{sequence}/units`).
`GetResponseBody` includes these. `augmentResponseWithOakUrl` does
`{ ...response, ...extractOakUrlFields(...) }` — arrays cannot be spread.

**Error**: `TS2698: Spread types may only be created from object types.`

**Fix**: Generate `GetObjectResponseBody` (non-array members) and
`GetArrayResponseElement` (element types of array members) in the codegen.

### Issue 2: Middleware type guard is dishonest

The middleware has `isAugmentableObject(body: unknown): body is GetResponseBody`
which only checks `typeof body === 'object'`. This is a lying type predicate —
the runtime check does not prove the asserted return type.

**Existing infrastructure**: `isResponseJsonBody200(path, method, value)` in
`packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts`
is the properly constructed type predicate. It uses Zod `safeParse` against the
generated schema.

**Key discovery**: openapi-fetch middleware provides `schemaPath: string` in the
callback context (confirmed at `node_modules/openapi-fetch/dist/index.d.ts:143`).
This is the OpenAPI template path (e.g., `/lessons/{lesson}/transcript`) — a
`ValidPath`. The middleware can destructure it, narrow with `isValidPath()`, and
use `isResponseJsonBody200(schemaPath, 'get', body)` for honest validation.

### Issue 3: Test fixtures don't match GetResponseBody

~30 test call sites use ad-hoc objects like `{ slug: 'x', title: 'y' }`. These
don't satisfy `GetResponseBody`. Generated stub fixtures exist in
`packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/`
with `as const` and full response shapes.

**Fix**: Rewrite fixtures using `as const satisfies JsonBody200<Path, 'get'>`,
seeded from generated stubs. Error-path tests that intentionally pass incomplete
data should use the middleware integration test (where `unknown` is the honest
input type).

---

## Solution Architecture

### Principle

> "ALL static data structures, types, type guards, Zod schemas, Zod validators,
> and other type related information MUST flow from the Open Curriculum OpenAPI
> schema." — principles.md, Cardinal Rule

> "`unknown` is not permitted except at incoming external boundaries — it is the
> destruction of hard-won understanding." — User correction, this session

### Key Insight

The generated type system is **exhaustive**. Every GET response body type, every
Zod schema, every type predicate is already generated from the OpenAPI spec. The
middleware simply wasn't using this infrastructure — it was bypassing it with a
hand-written `Record<string, unknown>` alias and a lying type guard. The fix
connects the existing pieces; it does not add new plumbing.

### Strategy

1. **Codegen**: Generate object/array variants of the response body union
2. **Middleware**: Use `schemaPath` from openapi-fetch + `isResponseJsonBody200`
3. **Functions**: Constraint to `GetObjectResponseBody` (objects) and
   `GetArrayResponseElement` (array items)
4. **Tests**: Anchor fixtures to generated types with `as const satisfies`
5. **ADR**: Document the constant → type → predicate pattern and its role

**Non-Goals** (YAGNI):

- ❌ Concrete-to-template path converter (schemaPath provides the template path)
- ❌ New boundary-safe augmentation function (existing infrastructure suffices)
- ❌ Changing how `extractOakUrlFields` works internally (it correctly accepts
  `unknown` at the internal implementation level — it IS the boundary)
- ❌ Migrating all type predicates to Zod (ADR-028 defers this)

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — Cardinal Rule, No Type Shortcuts
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD, KISS in tests
3. **Re-read** `.agent/directives/schema-first-execution.md` — Generator-first
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No `as`, no `any`, no `Record<string, unknown>`, no disabled checks

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions

#### Task 0.1: Confirm schemaPath availability

**Validation Required**: Verify that the openapi-fetch `Middleware` type exposes
`schemaPath` in the `onResponse` callback context.

**Acceptance Criteria**:

1. ✅ `schemaPath: string` exists in the middleware callback params type
2. ✅ At runtime, `schemaPath` contains the OpenAPI template path
   (e.g., `/lessons/{lesson}/transcript`)
3. ✅ `isValidPath(schemaPath)` narrows it to `ValidPath`

**Deterministic Validation**:

```bash
# 1. Confirm schemaPath in openapi-fetch types
grep -n "schemaPath" node_modules/openapi-fetch/dist/index.d.ts
# Expected: line with `readonly schemaPath: string;`

# 2. Confirm isValidPath works with template paths
grep -n "isValidPath" packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts | head -5
# Expected: function definition with `value is ValidPath`
```

#### Task 0.2: Confirm isResponseJsonBody200 signature

**Validation Required**: The existing type predicate accepts `ValidPath` and
narrows `unknown` to `JsonBody200<P, M>`.

**File**: `packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts`

**Acceptance Criteria**:

1. ✅ Function signature is `<P extends ValidPath, M extends AllowedMethodsForPath<P>>(path: P, method: M, value: unknown): value is JsonBody200<P, M>`
2. ✅ Internally uses `getResponseSchemaByOperationIdAndStatus` + `safeParse`
3. ✅ Returns `false` (not throws) when operationId lookup fails

---

### Phase 1: Generate Object and Array Response Types (TDD)

**File**: `packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/path-generators.ts`

#### Task 1.1: RED — tests for GetObjectResponseBody and GetArrayResponseElement

Add tests to `path-generators.unit.test.ts` asserting the generator emits:

- `GetObjectResponseBody` — non-array members of `GetResponseBody`
- `GetArrayResponseBody` — array members of `GetResponseBody`
- `GetArrayResponseElement` — element types of array response bodies

**Run test, confirm FAIL.**

#### Task 1.2: GREEN — implement in runtimeTypeDerivations()

Add to the `tail` string in `runtimeTypeDerivations()`:

```typescript
/** GET 200 response bodies that are objects (safe to spread). */
export type GetObjectResponseBody = Exclude<GetResponseBody, readonly unknown[]>;

/** GET 200 response bodies that are arrays. */
export type GetArrayResponseBody = Extract<GetResponseBody, readonly unknown[]>;

/** Element type of array-valued GET 200 response bodies. */
export type GetArrayResponseElement =
  GetArrayResponseBody extends readonly (infer E)[] ? E : never;
```

**Run test, confirm PASS. Run `pnpm sdk-codegen`, confirm regeneration.**

#### Task 1.3: Export from api-schema barrel

Add `GetObjectResponseBody`, `GetArrayResponseBody`, and
`GetArrayResponseElement` to the type export block in
`packages/sdks/oak-sdk-codegen/src/api-schema.ts`.

**Deterministic Validation**:

```bash
pnpm sdk-codegen
# Expected: exit 0, types regenerated

grep "GetObjectResponseBody\|GetArrayResponseElement" \
  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts
# Expected: both types present in generated output
```

---

### Phase 2: Honest Middleware Validation

**File**: `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`

#### Task 2.1: Destructure schemaPath from onResponse context

Change the middleware callback to destructure `schemaPath`:

```typescript
async onResponse({ request, response, schemaPath }) {
```

#### Task 2.2: Replace isAugmentableObject with isResponseJsonBody200

Remove the lying `isAugmentableObject` type guard. In `augmentBody`, validate
using the existing infrastructure:

1. Narrow `schemaPath` with `isValidPath(schemaPath)`
2. Validate body with `isResponseJsonBody200(schemaPath, 'get', body)`
3. For arrays: validate the full response, then pass items to augmentation

The `isResponseJsonBody200` call narrows `body` to
`JsonBody200<ValidPath, 'get'>` which is structurally equivalent to
`GetResponseBody`. TypeScript can then see it satisfies
`GetObjectResponseBody` (after the `Array.isArray` split).

**Imports to add**:

```typescript
import { isValidPath } from '@oaknational/sdk-codegen/api-schema';
import { isResponseJsonBody200 } from '../../validation/curriculum-response-validators.js';
```

**Acceptance Criteria**:

1. ✅ `isAugmentableObject` function is deleted
2. ✅ `schemaPath` destructured from middleware context
3. ✅ Body validated with `isResponseJsonBody200` (honest Zod-backed predicate)
4. ✅ No `unknown` passed to augmentation functions
5. ✅ Error containment preserved (try/catch around augmentation)

---

### Phase 3: Replace OakUrlAugmentable Constraint

**File**: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`

#### Task 3.1: Update augmentResponseWithOakUrl

```typescript
export function augmentResponseWithOakUrl<T extends GetObjectResponseBody>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { oakUrl?: string | null } {
```

Import `GetObjectResponseBody` from `@oaknational/sdk-codegen/api-schema`.

#### Task 3.2: Update augmentArrayResponseWithOakUrl

```typescript
export function augmentArrayResponseWithOakUrl<TItem extends GetArrayResponseElement>(
  response: TItem[],
  path: string,
  method: HttpMethod,
): (TItem & { oakUrl?: string | null })[] {
```

Import `GetArrayResponseElement` from `@oaknational/sdk-codegen/api-schema`.

#### Task 3.3: Remove OakUrlAugmentable export

Delete the `export type OakUrlAugmentable` line (already done in current session).
Verify no remaining references in `.ts` files.

**Deterministic Validation**:

```bash
grep -r "OakUrlAugmentable" --include="*.ts" packages/
# Expected: no matches (only docs/memory may reference it)

pnpm build 2>&1 | grep "error TS"
# Expected: no type errors
```

---

### Phase 4: Rewrite Test Fixtures

**File**: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts`

#### Task 4.1: Import generated stubs and types

```typescript
import type { JsonBody200 } from '@oaknational/sdk-codegen/api-schema';
import { stubGetLessonsSummaryResponse } from '@oaknational/sdk-codegen/mcp-tools';
// ... other stubs as needed
```

#### Task 4.2: Rewrite fixtures with as const satisfies

Replace ad-hoc objects with schema-anchored fixtures:

```typescript
// Before (widened, unvalidated):
const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };

// After (schema-anchored):
const response = {
  ...stubGetLessonsSummaryResponse,
  lessonSlug: 'add-two-numbers',
} as const satisfies JsonBody200<'/lessons/{lesson}/summary', 'get'>;
```

Tests that intentionally pass incomplete/wrong data (error paths) should
test the **middleware** (where `unknown` is the honest input type), not the
typed augmentation functions directly.

#### Task 4.3: Move error-path tests to middleware integration tests

Tests that pass objects without required fields (e.g., missing slug) are
testing middleware boundary behaviour. Move them to the middleware test file
or a new integration test where `unknown` is honest.

**Acceptance Criteria**:

1. ✅ No ad-hoc untyped objects passed to augmentation functions
2. ✅ All test fixtures use `as const satisfies` with generated types
3. ✅ Error-path tests live at the boundary (middleware) level
4. ✅ Tests prove augmentation behaviour, not type compliance
5. ✅ `pnpm test` passes with all tests

---

### Phase 5: ADR-152 and Discoverability

#### Task 5.1: Write ADR-152 — Constant-Type-Predicate Pattern

**File**: `docs/architecture/architectural-decisions/152-constant-type-predicate-pattern.md`

Document the foundational pattern used 34+ times in the generated code:

1. **Runtime constant** with `as const` — the source of truth
2. **Strict type** derived with `typeof ... [number]` — exact matching
   where values on the left match ONE value on the right, not a union
3. **Type predicate function** — `value is NarrowedType` backed by honest
   runtime check (`.includes()` or `.safeParse()`)
4. **Optional `satisfies`** — when the constant needs to prove it
   implements an interface without losing literal types

Include:

- Decision tree: when to use type predicates vs Zod vs discriminated
  union checks vs compile-time-only types
- The intermediate narrowing trick (`const strings: readonly string[] = CONST`)
- Common violations and how to recognise them
- Cross-references to ADR-031, ADR-034, ADR-038
- Relationship to `unknown` boundary rule

#### Task 5.2: Update typescript-practice.md

- Name the pattern ("Constant-Type-Predicate Pattern")
- Add cross-reference to ADR-152
- Expand the `unknown` boundary guidance: checklist of acceptable
  boundary types

#### Task 5.3: Update schema-first-execution.md

- Add a section on how type predicates fit into the schema-first flow
- Reference ADR-152 for the implementation pattern

---

### Phase 6: Validation and Review

#### Task 6.1: Full quality gate sequence

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:widget
pnpm test:e2e
```

#### Task 6.2: Specialist review cycle

Invoke: `type-reviewer`, `architecture-reviewer-fred`, `code-reviewer`

#### Task 6.3: Foundation compliance checklist

- [ ] **Cardinal Rule**: Types flow from schema, `pnpm sdk-codegen` regenerates
- [ ] **No Type Shortcuts**: No `as`, `any`, `Record<string, unknown>` added
- [ ] **No Lying Predicates**: All type guards prove their asserted type
- [ ] **unknown Only at Boundaries**: No `unknown` in internal function params
- [ ] **Schema-First**: Generator-first mindset, no manual type definitions
- [ ] **TDD**: Tests written before implementation at all levels

#### Task 6.4: Consolidation

Run `/jc-consolidate-docs` to graduate settled content.

---

## Testing Strategy

### Unit Tests (modified)

- `path-generators.unit.test.ts` — new tests for generated types
- `response-augmentation.unit.test.ts` — rewritten fixtures

### Integration Tests (new)

- Middleware integration test validating `schemaPath` threading and
  `isResponseJsonBody200` validation

### Existing Coverage

- `curriculum-response-validators.ts` tests (existing, unchanged)
- `response-map` tests (existing, unchanged)

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `schemaPath` not available at runtime | Low (confirmed in types) | Phase 0 validates at runtime before proceeding |
| `JsonBody200<ValidPath, 'get'>` not assignable to `GetObjectResponseBody` | Medium | Test at type level with `satisfies` in Phase 1 |
| Zod validation performance overhead in middleware | Low | Augmentation is best-effort; validation is lightweight |
| Generated stubs insufficient for all test scenarios | Medium | Create additional fixtures with `satisfies` from scratch |
| ADR-152 scope too broad | Low | Scope to pattern + decision tree only |

---

## Dependencies

**Blocking**: None (this is a prerequisite for Phase 4 of WS3)

**Related Plans**:

- `ws3-widget-clean-break-rebuild.plan.md` — parent plan
- `ws3-contrast-validation-prerequisite.plan.md` — sibling prerequisite

**Prerequisites**:

- ✅ `GetResponseBody` and `ValidGetPath` already generated in codegen
- ✅ Exported from `api-schema.ts`

---

## References

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/path-generators.ts` — codegen template
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` — augmentation functions
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts` — middleware
- `packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts` — existing validation
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts` — generated types
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/response-map.ts` — Zod schemas
- `docs/governance/typescript-practice.md` — type practice documentation
- `.agent/directives/principles.md` — Cardinal Rule, No Type Shortcuts
- `.agent/directives/schema-first-execution.md` — Generator-first mindset
- ADR-031: Generation-time extraction
- ADR-034: System boundaries and type assertions
- ADR-038: Compilation-time revolution

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.
