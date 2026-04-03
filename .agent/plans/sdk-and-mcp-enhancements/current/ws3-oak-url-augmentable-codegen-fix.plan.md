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
    status: completed
  - id: phase-2-middleware
    content: "Phase 2: Honest middleware validation using schemaPath + isResponseJsonBody200."
    status: completed
  - id: phase-3-functions
    content: "Phase 3: Replace OakUrlAugmentable constraint — Object.assign + unknown return."
    status: completed
  - id: phase-4-tests
    content: "Phase 4: Rewrite test fixtures with as const satisfies and schema-anchored data."
    status: completed
  - id: phase-5-adr
    content: "Phase 5: Write ADR-153 (Constant-Type-Predicate Pattern) and update discoverability."
    status: completed
  - id: phase-6-validation
    content: "Phase 6: Full quality gates, reviewer cycle, and consolidation."
    status: completed
---

# OakUrlAugmentable Codegen Fix and Type Predicate ADR

**Last Updated**: 2026-04-03
**Status**: 🟢 PHASES 0–5 COMPLETE — ADR-153 written, quality gates remaining
**Scope**: Replace `OakUrlAugmentable = Readonly<Record<string, unknown>>` with
schema-derived types; fix middleware validation; write ADR-153.

## What Was Actually Implemented (vs Original Plan)

The original Phase 2–3 plan proposed type-preserving generics
(`T extends GetObjectResponseBody`, return `T & { oakUrl }`) with spread.
This was blocked by TypeScript's 20-member union spread limit (TS2698).

The actual implementation took a different, simpler approach:

1. **`JsonBody200` redefined** — from 6-layer `PathOperation` conditional
   chain to single conditional on direct `Paths[P][M]` indexing. This makes
   `JsonBody200` spreadable for single literal paths (empirically verified).
2. **Augmentation functions use `Object.assign` + `unknown` return** — the
   result flows to `JSON.stringify` at the middleware boundary. No typed
   downstream consumer exists, so type-preserving spread was compile-time
   ceremony. `Object.assign({}, response, fields)` avoids TS2698 entirely.
3. **6 dead types removed** — `Normalize200`, `NormalizedResponsesFor`,
   `PathReturnTypes`, `ResponsesForPath`, `ResponseForPathAndMethod`,
   `augmentGetResponseBody`.
4. **Middleware validation honest** — `isResponseJsonBody200(schemaPath, 'get', body)`
   with `schemaPath` from openapi-fetch context. Body passed as `unknown`.
5. **Test fixtures schema-anchored** — `as const satisfies JsonBody200<P, M>`
   in integration tests. Unit test assertions use `toHaveProperty` path form.

For the investigation record (7 failed attempts, verified assumptions,
architectural analysis), see `.agent/experience/2026-04-03-workaround-gravity.md`
and git history on commit `1b44b6a9`.

---

## Remaining Work

### Phase 5: ADR-153 and Discoverability

#### Task 5.1: Write ADR-153 — Constant-Type-Predicate Pattern

**File**: `docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md`

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
- Add cross-reference to ADR-153
- Expand the `unknown` boundary guidance: checklist of acceptable
  boundary types

#### Task 5.3: Update schema-first-execution.md

- Add a section on how type predicates fit into the schema-first flow
- Reference ADR-153 for the implementation pattern

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
| ADR-153 scope too broad | Low | Scope to pattern + decision tree only |

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
