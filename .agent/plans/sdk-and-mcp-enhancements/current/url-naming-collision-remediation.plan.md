---
name: "URL Naming Collision Remediation"
overview: "Fix the decorator overwrite, type widening, and naming collision between SDK-generated canonicalUrl and upstream-provided canonicalUrl/oakUrl; rename SDK concept to oakUrl (aligning with upstream); relocate search-CLI domain logic to the SDK."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions and map the blast radius."
    status: pending
  - id: phase-1-decorator-fix
    content: "Phase 1: Fix decorateCanonicalUrls to preserve upstream-defined fields."
    status: pending
  - id: phase-2-rename
    content: "Phase 2: Rename SDK concept from canonicalUrl to oakUrl (aligning with upstream) across codegen, SDK, and apps."
    status: pending
  - id: phase-3-search-cli-boundary
    content: "Phase 3: Relocate search-CLI canonical-url-generator domain logic to the SDK."
    status: pending
  - id: phase-4-adr
    content: "Phase 4: Write successor ADR to ADR-047 documenting the collision and resolution."
    status: pending
  - id: phase-5-quality-gates
    content: "Phase 5: Full quality gate chain."
    status: pending
  - id: phase-6-adversarial-review
    content: "Phase 6: Adversarial specialist reviews."
    status: pending
isProject: false
---

# URL Naming Collision Remediation

**Last Updated**: 2026-04-01
**Status**: QUEUED
**Scope**: Fix five architectural violations in URL handling: schema overwrite,
type widening, naming inconsistency, stale ADR, and search-CLI boundary
violation. Rename the SDK concept from `canonicalUrl` to `oakUrl`, aligning
with the upstream's naming for the same semantic concept. No new features —
this is corrective work to restore alignment with the cardinal rule, consistent
naming principle, and layer role topology.

---

## Context

### Three Distinct URL Concepts Have Collided

The upstream Oak Curriculum API has introduced two new URL fields on
`LessonSummaryResponseSchema`: `canonicalUrl` (required, `format: "uri"`) and
`oakUrl` (required, `format: "uri"`). The SDK already had its own concept of
"canonical URL" — a simpler, slug-based URL generated at codegen time. The
three concepts are:

| # | Concept | Origin | Example URL | Field Name |
|---|---------|--------|-------------|------------|
| 1 | **SDK-generated URL** (slug-only, template-based) | `url-helpers.ts` via `generate-url-helpers.ts` | `/teachers/lessons/{slug}` | `canonicalUrl` |
| 2 | **Upstream canonical URL** (context-rich, programme-path) | Upstream API, `LessonSummaryResponseSchema` | `/teachers/programmes/{prog}/units/{unit}/lessons/{lesson}` | `canonicalUrl` |
| 3 | **Upstream oak URL** (simple, slug-based) | Upstream API, `LessonSummaryResponseSchema` + `LessonAssetsResponseSchema` | `/teachers/lessons/{slug}` | `oakUrl` |

Concepts 1 and 3 are semantically identical but use different names.
Concepts 1 and 2 are semantically different but share the same name.

### How the Collision Manifests

1. **Schema overwrite**: `decorateCanonicalUrls` in
   `schema-separation-decorators.ts` unconditionally adds/overwrites
   `canonicalUrl` on all `*Response*`/`*Schema*` components. For
   `LessonSummaryResponseSchema`, this replaces the upstream's
   `{ type: "string", format: "uri" }` with `{ type: "string" }`, losing the
   `format` and changing the description.

2. **Type widening**: The generated Zod has `canonicalUrl: z.string()` instead
   of `canonicalUrl: z.url()`. `oakUrl` correctly gets `z.url()` because the
   decorator does not touch it.

3. **Runtime masking**: The idempotency guard in `response-augmentation.ts`
   preserves the upstream's `canonicalUrl` value when present, so runtime
   behaviour is correct. But the schema/type contract is wrong, and correctness
   depends on undocumented ordering assumptions.

4. **Naming inconsistency**: The same field name `canonicalUrl` denotes
   different concepts on different endpoints — a direct violation of the
   consistent naming principle.

5. **Stale ADR**: ADR-047 was written when the upstream did not define
   `canonicalUrl`. Its assumptions are now false.

### Search-CLI Boundary Violation

`apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` contains
domain logic for URL generation. While it delegates most work to the SDK's
`generateCanonicalUrlWithContext`, it also:

- Defines its own `OAK_BASE_URL` constant
- Has `generateLessonCanonicalUrl` that duplicates the template
  (`${OAK_BASE_URL}/lessons/${lessonSlug}`) rather than delegating
- Has `generateSubjectProgrammesUrl` that builds URLs directly
- Has `generateThreadCanonicalUrl` with `void threadSlug` (a no-op)

Per the layer role topology (principles.md): "Apps own CLI commands, request
assembly... These are integration concerns, not domain logic." URL generation
is domain logic — two consumers would need the same logic. It belongs in the
SDK, not an app.

---

## Governing Constraints

- **Cardinal Rule** (principles.md): Types flow from the upstream OpenAPI
  schema via `pnpm sdk-codegen`. The decorator must not override upstream fields.
- **Never widen types** (principles.md): `format: "uri"` to plain `string` is
  type widening. Preserve type information.
- **Consistent Naming** (principles.md): If the concepts are different, the
  names must be different.
- **Layer Role Topology** (principles.md): SDKs own domain logic. Apps compose
  SDK capabilities.
- **Schema-First Execution** (schema-first-execution.md): Runtime files are
  thin facades; they do not duplicate logic.
- **ADR-047**: Canonical URL generation at codegen time.
- **ADR-030**: SDK as single source of truth.

---

## Naming Decision: `canonicalUrl` → `oakUrl` (Resolved)

### Decision

The SDK concept formerly called `canonicalUrl` is renamed to **`oakUrl`**,
aligning with the upstream API's naming for the same semantic concept.

### Rationale

The SDK's slug-based URL (concept 1) and the upstream's `oakUrl` (concept 3)
are **semantically identical**: both are the direct, slug-only URL for a
resource — constructable from a template and the resource's slug alone, without
curriculum context. The consistent naming principle requires that identical
concepts share the same name.

Alternatives considered:

- `isolatedUrl` — rejected because it would duplicate `oakUrl` semantically,
  creating a new naming collision while fixing the old one
- `slugUrl` — rejected because it introduces terminology that neither the SDK
  nor the upstream uses

### Two URL Concepts After Remediation

After this plan executes, the system has exactly **two** URL concepts with
**distinct names** and **distinct semantics**:

#### `oakUrl` — The Direct Resource URL

The `oakUrl` is the simplest URL for a resource on the Oak website. It is
constructed from the resource's slug alone, using a fixed template with no
curriculum context.

- **Construction**: Template + slug → `/teachers/lessons/{lessonSlug}`
- **Context required**: Slug only
- **Uniqueness**: One per resource (each lesson has exactly one `oakUrl`)
- **Purpose**: Direct linking, search results, sharing — when you want to
  link to a resource regardless of how it fits into a particular curriculum
  programme
- **Example**: `https://www.thenational.academy/teachers/lessons/photosynthesis-a3b4c5`
- **Source**: On schemas where the upstream provides `oakUrl`, use it directly.
  On schemas where the upstream does not provide it, the SDK generates it via
  the codegen decorator.
- **Field name**: `oakUrl` everywhere — upstream responses, SDK-generated
  schemas, search index, MCP tool output.

#### `canonicalUrl` — The Contextualised Curriculum URL

The `canonicalUrl` is the full curriculum-path URL for a resource within a
specific programme of study. It encodes the curriculum context: subject, key
stage, exam board, unit, and tier.

- **Construction**: Programme path + slug → `/teachers/programmes/{prog}/units/{unit}/lessons/{lesson}`
- **Context required**: Subject, key stage, exam board, tier, unit, programme
- **Uniqueness**: One per resource *per programme* (a lesson may appear in
  multiple programmes, giving it multiple canonical URLs)
- **Purpose**: SEO, curriculum navigation, breadcrumbs — when you want the
  URL that situates a resource within its curricular context
- **Example**: `https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-aqa/units/cell-biology/lessons/photosynthesis-a3b4c5`
- **Source**: Upstream API only. The SDK does not generate these — they require
  curriculum context that only the upstream API knows.
- **Field name**: `canonicalUrl` — upstream responses only. The SDK never
  injects this field; it passes through from the upstream unchanged.

### Decorator Behaviour After Remediation

The decorator checks **both** `canonicalUrl` and `oakUrl` in upstream
properties before deciding whether to inject:

| Upstream has `canonicalUrl`? | Upstream has `oakUrl`? | Decorator action |
|------------------------------|------------------------|------------------|
| No | No | Inject `oakUrl` (SDK-generated) |
| No | Yes | Skip injection (upstream provides `oakUrl`) |
| Yes | No | Inject `oakUrl` (different field from `canonicalUrl`) |
| Yes | Yes | Skip `oakUrl` injection (upstream provides it) |

In all cases, the upstream's `canonicalUrl` passes through unchanged — the
decorator never touches it.

---

## Non-Goals (YAGNI)

- Changing the upstream API's field names — that is external
- Implementing URL validation enforcement — separate plan
  (`canonical-url-enforcement.plan.md`)
- Changing runtime behaviour of response augmentation beyond the rename
- Adding new URL fields to schemas that the upstream does not define
- Backward compatibility layers — replace, not wrap

---

## Quality Gate Strategy

**Critical**: Run ALL quality gates across ALL workspaces after EACH task to
catch regressions immediately. SDK changes propagate across workspaces; filtered
runs miss cross-workspace regressions.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After Each Phase

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/testing-strategy.md`
3. **Re-read** `.agent/directives/schema-first-execution.md`
4. **Ask**: Does this deliver system-level value, not just fix the immediate
   issue?
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
   if impacted
2. Update `.agent/practice-core/practice.md` if impacted
3. Update any additionally impacted ADRs, `/docs/` pages, or README files
4. Apply `.cursor/commands/jc-consolidate-docs.md` to ensure settled
   documentation is not trapped in plans

If no update is needed for a required surface, record an explicit no-change
rationale.

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions

**Foundation Check-In**: Re-read principles.md §Cardinal Rule, §Consistent
Naming, §Layer Role Topology.

#### Task 0.1: Map the Full Blast Radius of `canonicalUrl`

Enumerate every file that references `canonicalUrl` as a field name, function
name, variable name, or concept. Group by:

- Generated code (will change automatically after codegen)
- Generator templates (must be edited)
- Hand-authored SDK code (must be edited)
- Hand-authored app code (must be edited)
- Tests (must be updated)
- Fixtures/sandbox data (must be updated)
- Documentation (must be updated)

**Acceptance Criteria**:

1. Complete inventory of `canonicalUrl` usage across the monorepo
2. Each usage classified as generated vs hand-authored
3. Dependencies between changes identified (order of operations)
4. No files missed — validated by `rg canonicalUrl` returning only inventoried
   files

**Deterministic Validation**:

```bash
rg -l "canonicalUrl" --type ts --type json --type md | sort
# Expected: all results are in the inventory
```

#### Task 0.2: Confirm Upstream Schema State

Verify the current upstream schema defines `canonicalUrl` and `oakUrl` on
`LessonSummaryResponseSchema`, and confirm which other schemas have
upstream-defined `canonicalUrl` or `oakUrl`.

Pay particular attention to `LessonAssetsResponseSchema`, which defines `oakUrl`
but not `canonicalUrl`. Since this plan renames the SDK concept to `oakUrl`
(aligning with the upstream), the decorator must check for existing `oakUrl`
and skip injection when the upstream already provides it. This is the
simplest case — the upstream provides the field with the same name and same
semantics, so no decoration is needed.

**Acceptance Criteria**:

1. Exact list of schemas where upstream defines `canonicalUrl` (with `format`)
2. Exact list of schemas where upstream defines `oakUrl` (with `format`)
3. Mapping of which schemas have both, one, or neither upstream URL field
4. Decision documented for each case: does the decorator inject, skip, or
   delegate to the upstream field?

**Deterministic Validation**:

```bash
rg '"canonicalUrl"' packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json
rg '"oakUrl"' packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json
```

**Task Complete When**: Both inventories are complete and validated.

---

### Phase 1: Fix `decorateCanonicalUrls` to Preserve Upstream Fields

**Foundation Check-In**: Re-read principles.md §Cardinal Rule, §Never Widen
Types.

**Key Principle**: The upstream schema is the source of truth. The decorator
adds fields where the upstream does not provide them; it must never overwrite
upstream-defined properties.

#### Task 1.1: Write RED Tests for Conditional Decoration

**File**: `schema-separation-decorators.unit.test.ts` (extend existing or
create)

Tests:

- Given a schema where `canonicalUrl` already exists with `format: "uri"`,
  `decorateCanonicalUrls` preserves the upstream definition unchanged
- Given a schema where `canonicalUrl` does not exist,
  `decorateCanonicalUrls` adds the SDK's `canonicalUrl` field
- Given a thread schema where `canonicalUrl` exists with `format: "uri"`,
  `decorateCanonicalUrls` preserves the upstream definition (not null)
- Given a thread schema where `canonicalUrl` does not exist,
  `decorateCanonicalUrls` adds `type: "null"`

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests FAIL (current decorator overwrites unconditionally)
3. No existing tests broken

#### Task 1.2: Make the Decorator Conditional

**File**: `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`

**Change**: In `decorateObjectWithCanonicalUrl`, check whether
`schema.properties` already contains a `canonicalUrl` key. If it does, skip
decoration — preserve the upstream's definition including `format`,
`description`, and any other metadata.

**Target Implementation**:

```typescript
function decorateObjectWithCanonicalUrl(
  schema: SchemaObject & { properties: SchemaProperties },
  useNullType: boolean,
): SchemaObject {
  if ('canonicalUrl' in schema.properties) {
    return schema;
  }
  // ... existing decoration logic for schemas without upstream canonicalUrl
}
```

**Acceptance Criteria**:

1. All new tests from Task 1.1 PASS
2. All existing tests PASS
3. `api-schema-sdk.json` preserves `format: "uri"` on `LessonSummaryResponseSchema.canonicalUrl`
4. Generated Zod produces `z.url()` for `canonicalUrl` on `LessonSummaryResponseSchema`
5. Other schemas still get the SDK-injected `canonicalUrl` field

#### Task 1.3: Regenerate and Validate

Run `pnpm sdk-codegen` and verify the generated artefacts reflect the fix.

**Deterministic Validation**:

```bash
pnpm sdk-codegen
# Verify format preserved in SDK schema
rg '"canonicalUrl"' packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-sdk.json -A 3 | grep format
# Expected: "format": "uri" appears for LessonSummaryResponseSchema

# Verify Zod uses z.url() for LessonSummaryResponseSchema.canonicalUrl
rg 'LessonSummaryResponseSchema' packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts -A 5
# Expected: canonicalUrl: z.url() (not z.string())

pnpm type-check
pnpm lint
pnpm test
```

**Task Complete When**: Upstream `canonicalUrl` definition is preserved through
the decoration pipeline, and `z.url()` is generated for it.

---

### Phase 2: Rename SDK Concept from `canonicalUrl` to `oakUrl`

**Foundation Check-In**: Re-read principles.md §Consistent Naming.

**Key Principle**: "Use consistent naming conventions for... CONCEPTS. If you
need to add nuance, use TSDoc to provide context, links, and examples."

The SDK's slug-based URL concept is renamed from `canonicalUrl` to `oakUrl`,
aligning with the upstream API's name for the same semantic concept. After this
phase, `canonicalUrl` refers exclusively to the upstream's context-rich
curriculum URL, and `oakUrl` refers to the direct slug-based resource URL
(whether upstream-provided or SDK-generated).

#### Task 2.1: Write RED Tests for the Rename

Update existing tests to reference `oakUrl` instead of `canonicalUrl` where
the SDK-generated concept is being tested. Tests should fail because the
production code still uses `canonicalUrl`.

Key test files:

- `generate-url-helpers.unit.test.ts`
- `url-helpers.unit.test.ts`
- `response-augmentation.unit.test.ts`
- `aggregated-fetch.integration.test.ts`

**Acceptance Criteria**:

1. Tests reference `oakUrl` for SDK-generated (slug-based) URLs
2. Tests reference `canonicalUrl` only for upstream-provided context-rich URLs
3. All renamed tests FAIL (production code not yet changed)

**Deterministic Validation**:

```bash
pnpm type-check  # Tests should compile
pnpm test        # New tests should FAIL
```

#### Task 2.2: Rename in the Generator Template

**File**: `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts`

**Changes**:

- Rename `generateCanonicalUrl` → `generateOakUrl`
- Rename `generateCanonicalUrlWithContext` → `generateOakUrlWithContext`
- Update TSDoc to explain the semantic distinction:

```typescript
/**
 * Generate the Oak URL for a resource — the direct, slug-based URL
 * constructable from a template and the resource's slug alone.
 *
 * This is distinct from the upstream's `canonicalUrl`, which is a
 * context-rich curriculum URL encoding programme, unit, key stage,
 * and exam board. The `oakUrl` does not require curriculum context.
 *
 * @example
 * generateOakUrl('lesson', 'photosynthesis-a3b4c5')
 * // → 'https://www.thenational.academy/teachers/lessons/photosynthesis-a3b4c5'
 *
 * @see ADR-[successor] for the naming decision and rationale
 */
```

- Update the comment block at the top of the generated file

**Acceptance Criteria**:

1. Generated `url-helpers.ts` exports `generateOakUrl` and
   `generateOakUrlWithContext`
2. TSDoc explains the `oakUrl` vs `canonicalUrl` distinction
3. No references to `generateCanonicalUrl` remain in the template

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.3: Rename in the Schema Decorator

**File**: `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`

**Changes**:

- The decorator now injects `oakUrl` (not `canonicalUrl`) on schemas where the
  upstream does not provide its own `oakUrl` field
- Thread schemas get `oakUrl: null`
- **Critical**: The Phase 1 conditional guard must be updated. The decorator
  now injects `oakUrl`, so the guard checks for `'oakUrl' in schema.properties`
  to prevent double injection. The upstream's `canonicalUrl` is a separate,
  unrelated field — the guard does not check for it.
- Rename `decorateCanonicalUrls` → `decorateOakUrls` and
  `decorateObjectWithCanonicalUrl` → `decorateObjectWithOakUrl`
- Update the description on the injected field:

```typescript
const oakUrlField: SchemaObject = useNullType
  ? {
      type: 'null',
      description: 'Threads are data concepts without Oak URLs on the website. Always null for thread resources.',
    }
  : {
      type: 'string',
      format: 'uri',
      description: 'The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.',
      example: 'https://www.thenational.academy/teachers/lessons/example-lesson',
    };
```

**Note**: The SDK-injected `oakUrl` now includes `format: "uri"` — matching
the upstream's definition and preventing type widening. This means `z.url()`
is generated for both upstream-provided and SDK-injected `oakUrl` fields.

**Acceptance Criteria**:

1. Decorator injects `oakUrl`, not `canonicalUrl`
2. Guard checks for `oakUrl` presence before injecting
3. SDK-injected `oakUrl` includes `format: "uri"`
4. Upstream `canonicalUrl` passes through untouched

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.4: Rename in Response Augmentation

**File**: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`

**Changes**:

- `augmentResponseWithCanonicalUrl` → `augmentResponseWithOakUrl`
- `augmentArrayResponseWithCanonicalUrl` → `augmentArrayResponseWithOakUrl`
- `extractCanonicalUrlFields` → `extractOakUrlFields`
- Return type changes from `{ canonicalUrl: string | null }` to
  `{ oakUrl: string | null }`
- The idempotency guard now checks for `oakUrl` (not `canonicalUrl`), because
  the field being injected is `oakUrl`. When the upstream already provides
  `oakUrl`, the guard preserves it. The upstream's `canonicalUrl` is a
  different field and passes through untouched.

**Acceptance Criteria**:

1. All function names use `OakUrl` not `CanonicalUrl`
2. Return types reference `oakUrl` not `canonicalUrl`
3. Idempotency guard preserves upstream `oakUrl` when present

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.5: Rename in Response Augmentation Helpers and Types

Update all supporting types, helper functions, and type definitions that
reference `canonicalUrl` as the SDK-generated concept.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.6: Rename in Aggregated Fetch

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`

Update references to use `oakUrl` for the SDK-generated field.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.7: Rename in Public API Surface

Update barrel files, re-exports, and any public API that exposes the renamed
functions.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.8: Regenerate and Update Fixtures

```bash
pnpm sdk-codegen
pnpm build
```

Update all test fixtures and sandbox data to use `oakUrl` instead of
`canonicalUrl` where the field represents the SDK-generated concept. Upstream
`canonicalUrl` fixtures remain unchanged.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

#### Task 2.9: Update Search-CLI References

**Files**: All files in `apps/oak-search-cli/src/lib/indexing/` that reference
`canonicalUrl` as the SDK-generated concept.

Update to `oakUrl`. Elasticsearch field names in the search index are a
separate concern — the ES mapping currently uses `canonicalUrl` as the field
name. Document the mapping from the SDK's `oakUrl` field to the ES index's
field name. The ES field name may remain unchanged if re-indexing is not
desired, but the SDK↔ES mapping must be explicit and documented. A concrete
criterion for when re-indexing must happen (e.g. "before any external consumer
uses the ES index") should be recorded.

**Deterministic Validation**:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:e2e
```

**Phase 2 Complete When**: The SDK concept is consistently named `oakUrl`
everywhere. The upstream's `canonicalUrl` passes through unchanged. No
`canonicalUrl` references remain in SDK-generated or SDK-authored code except
where they refer to the upstream's context-rich curriculum URL field.

---

### Phase 3: Relocate Search-CLI Domain Logic to the SDK

**Foundation Check-In**: Re-read principles.md §Layer Role Topology.

**Key Principle**: "SDKs own query shapes, query processing, data contracts,
and type definitions. If two consumers would need the same logic, it belongs
in an SDK. Apps own CLI commands, request assembly, operational tooling."

#### Task 3.1: Identify What Moves

The file `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts`
contains:

| Function | Domain Logic? | Action |
|----------|---------------|--------|
| `OAK_BASE_URL` | Yes — shared constant | Move to SDK (already exists in `url-helpers.ts` as inline) |
| `generateLessonCanonicalUrl` | Yes — duplicates `urlForLesson` | Delete, import from SDK |
| `generateUnitCanonicalUrl` | Thin wrapper — delegates to SDK | Move the convenience API to SDK |
| `generateUnitCanonicalUrlFromSequence` | Thin wrapper | Move to SDK |
| `generateSequenceCanonicalUrl` | Thin wrapper | Move to SDK |
| `generateThreadCanonicalUrl` | No-op returning null | Delete, use SDK directly |
| `generateSubjectProgrammesUrl` | Yes — hand-authored template | Move to SDK |

#### Task 3.2: Write RED Tests for SDK-Hosted Convenience Functions

Write tests in the SDK for convenience functions that the search-CLI currently
hosts:

- `generateLessonOakUrl(lessonSlug)` → full URL string
- `generateUnitOakUrl(unitSlug, subjectSlug, phaseSlug)` → full URL string
- `generateUnitOakUrlFromSequence(unitSlug, sequenceSlug)` → full URL string
- `generateSequenceOakUrl(sequenceSlug)` → full URL string
- `generateSubjectProgrammesUrl(subjectSlug, keyStageSlug)` → full URL string
- `generateThreadOakUrl(threadSlug)` → `null`

These are convenience wrappers around `generateOakUrlWithContext` that accept
domain-specific parameters instead of the generic content-type/id/context
triple. They should live in the SDK because they encode domain knowledge
(sequence slug derivation, key-stage preference order) that any consumer would
need.

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests FAIL (functions not yet in SDK)
3. No existing tests broken

#### Task 3.3: Move Functions to the SDK

**Layer decision**: `oak-sdk-codegen`. The convenience functions are pure
(no runtime data needed), they wrap `generateOakUrlWithContext` which lives in
`oak-sdk-codegen`, and they encode domain knowledge (slug patterns, content
type mappings) that is codegen-time, not runtime. They belong alongside the
generated `url-helpers.ts`, either as additional generated output from the
template or as a hand-authored companion module.

For `generateSubjectProgrammesUrl`: the generated `urlForSubject` already
exists in `url-helpers.ts`. The convenience function should delegate to it, not
duplicate the template. If the generated function has the right signature,
delete the convenience wrapper and use the generated function directly.

Export the convenience functions from the SDK's public API.

#### Task 3.4: Update Search-CLI to Import from SDK

Replace `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` with
a thin re-export or delete it entirely, updating all import sites to use the
SDK's public API.

**Acceptance Criteria**:

1. No domain logic remains in the search-CLI for URL generation
2. All search-CLI tests pass using SDK imports
3. The search-CLI file is either deleted or reduced to a re-export barrel

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
```

**Phase 3 Complete When**: URL generation domain logic lives exclusively in the
SDK. The search-CLI imports from the SDK's public API. No duplication.

---

### Phase 4: Write Successor ADR to ADR-047

**Foundation Check-In**: Re-read ADR-047.

#### Task 4.1: Draft ADR

Write a new ADR (next available number) documenting:

1. **Context**: The upstream API introduced `canonicalUrl` and `oakUrl` fields,
   creating a naming collision with the SDK's pre-existing `canonicalUrl`
   concept. The SDK's concept (slug-based, contextless URL) is semantically
   identical to the upstream's `oakUrl`, not its `canonicalUrl`.
2. **Decision**: Rename the SDK concept from `canonicalUrl` to `oakUrl`,
   aligning with the upstream's naming. Make the schema decorator conditional
   — skip injection when the upstream already provides `oakUrl`. Relocate
   convenience URL functions from the search-CLI to the SDK. Document the
   semantic distinction: `oakUrl` = direct slug-based URL; `canonicalUrl` =
   context-rich curriculum-path URL.
3. **Rationale**: Cardinal rule compliance, type preservation, naming
   consistency (same concept → same name), layer topology.
4. **Consequences**: Breaking change to SDK public API (function and field
   renames). ES index field names may diverge from SDK field names until
   re-indexed. On schemas where the upstream provides `oakUrl`, the decorator
   no longer injects — eliminating duplication.

#### Task 4.2: Update ADR-047

Add a "Superseded By" section pointing to the new ADR, explaining which
assumptions changed.

#### Task 4.3: Update Related Documentation

- `packages/sdks/oak-sdk-codegen/README.md` — URL helpers section
- `packages/sdks/oak-curriculum-sdk/README.md` — response augmentation section
- `docs/architecture/architectural-decisions/132-sitemap-scanner-canonical-url-validation.md`
  — terminology review: ADR-132 builds on ADR-047 and uses "canonical URL"
  throughout; must be updated to reflect the `oakUrl` rename and link to
  the successor ADR
- `docs/architecture/architectural-decisions/README.md` — add successor ADR
  entry and annotate ADR-047 as superseded
- `docs/operations/troubleshooting.md` — canonical URL troubleshooting
- `canonical-url-enforcement.plan.md` — update references to renamed concepts

**Note**: `docs/architecture/openapi-pipeline.md` currently contains no
canonical URL references. Verify whether it *should* describe decorator
behaviour (add content) or is correctly silent on this topic (no update needed).
Document the decision.

**Deterministic Validation**:

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
```

---

### Phase 5: Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm subagents:check
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

### Phase 6: Adversarial Review and Compliance

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

#### Task 6.1: Foundation Document Compliance Checklist

- [ ] **Cardinal Rule**: All types derive from OpenAPI schema via
  `pnpm sdk-codegen`; no upstream fields overwritten
- [ ] **No Type Shortcuts**: No `as`, `any`, `Record<string, unknown>`, `!`
  added
- [ ] **No Compatibility Layers**: Replaced old `canonicalUrl` SDK concept,
  not wrapped it
- [ ] **Consistent Naming**: `oakUrl` used consistently for the slug-based URL
  concept (both upstream-provided and SDK-generated); `canonicalUrl` used only
  for the upstream's context-rich curriculum URL
- [ ] **Layer Role Topology**: No domain logic remains in apps; all URL
  generation functions live in the SDK
- [ ] **Quality Gates**: All gates pass across all workspaces
- [ ] **Test Behaviour**: Tests validate behaviour, not implementation details
- [ ] **Simple Mocks**: Fakes injected as arguments, no complex mock frameworks
- [ ] **Generator First**: Decorator and template changes made in source, not
  generated output
- [ ] **System-Level Impact**: Schema fidelity, naming clarity, and boundary
  discipline are measurably improved

**Task Complete When**: All checklist items checked. Any unchecked items have
documented justification OR are immediately fixed.

#### Task 6.2: Specialist Reviews

Invoke specialist reviewers. Document findings. Create follow-up plan if
blockers found.

Recommended reviewers:

- `architecture-reviewer-fred` — boundary discipline: verify the decorator no
  longer overrides upstream fields; verify the rename is complete
- `architecture-reviewer-wilma` — resilience: what happens when the upstream
  adds `oakUrl` or `canonicalUrl` to more schemas? Verify the decorator
  handles all four cases in the decision matrix correctly
- `architecture-reviewer-betty` — cohesion: verify the search-CLI no longer
  contains domain logic; verify the sitemap scanner pipeline still works
- `type-reviewer` — verify no type widening remains; verify `z.url()` is
  generated for all `format: "uri"` fields
- `test-reviewer` — fixture strategy: are fixtures anchored to the schema?
- `docs-adr-reviewer` — ADR-047 supersession, successor ADR quality, ADR-132
  terminology update
- `code-reviewer` — gateway review for all changes

---

## Testing Strategy

### Unit Tests

**Existing Coverage** (to be updated):

- `generate-url-helpers.unit.test.ts` — generator output validation
- `url-helpers.unit.test.ts` — runtime URL helper behaviour
- `response-augmentation.unit.test.ts` — augmentation per content type
- `response-validators.unit.test.ts` — Zod validation of responses

**New Tests Required**:

- Conditional decorator tests (Phase 1)
- SDK-hosted convenience URL function tests (Phase 3)
- Rename verification tests (Phase 2)

### Integration Tests

**Existing Coverage** (to be updated):

- `aggregated-fetch.integration.test.ts` — MCP fetch + URL injection

### E2E Tests

**Modified Tests**:

- `server.e2e.test.ts` — field name changes in response assertions

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Wide blast radius of rename | Phase 0 maps the full inventory before any code changes |
| ES index field names diverge from SDK | Document the mapping explicitly; defer re-indexing to a separate plan |
| Downstream consumers break on field rename | This repo is the only consumer; no published npm packages yet |
| Generator output changes unexpectedly | Phase 1 validates with `pnpm sdk-codegen` + diff |
| Existing `canonical-url-enforcement.plan.md` references old names | Update that plan's references after this plan completes |

---

## Dependencies

**Blocking**: None — this is corrective work that can proceed independently.

**Related Plans**:

- `canonical-url-enforcement.plan.md` — URL validation enforcement; will need
  reference updates after this plan's rename, but is not blocked by it
- `ws3-phase-3-schema-fallout-closure.plan.md` (archived) — recent fixture
  alignment; this plan addresses the architectural issues that the closure
  plan did not
- ADR-047 — will be updated by this plan

**Relationship to `canonical-url-enforcement.plan.md`**: That plan promotes URL
validation from warn to enforcement. This plan fixes the naming, typing, and
boundary violations. They are complementary. This plan should execute first
because it changes the field names that the enforcement plan references.

---

## Success Criteria

### Phase 0

- Complete blast radius inventory validated by grep
- Upstream schema state confirmed

### Phase 1

- `decorateCanonicalUrls` preserves upstream-defined `canonicalUrl` fields
- Generated Zod uses `z.url()` for `canonicalUrl` on `LessonSummaryResponseSchema`
- No type widening remains for upstream-defined URL fields

### Phase 2

- The SDK concept is consistently named `oakUrl`
- No `canonicalUrl` references in SDK-generated or SDK-authored code except
  where they refer to the upstream's context-rich curriculum URL field
- On schemas where the upstream provides `oakUrl`, the decorator skips
  injection (no duplication)
- All quality gates pass

### Phase 3

- No URL generation domain logic in the search-CLI
- All URL generation functions live in the SDK's public API
- Search-CLI imports from the SDK

### Phase 4

- Successor ADR documents the collision and resolution
- ADR-047 updated with "Superseded By" reference
- All affected documentation updated

### Overall

- Cardinal rule compliance restored for URL fields
- Type precision restored (`z.url()` for `format: "uri"`)
- Naming consistency restored (distinct names for distinct concepts)
- Layer topology compliance restored (domain logic in SDK, not apps)
- ADR drift addressed

---

## Notes

### Why This Matters (System-Level Thinking)

**Immediate Value**:

- **Type safety**: Consumers can trust that `canonicalUrl` validates as a URI
- **Clarity**: Developers and AI agents can distinguish between the upstream's
  context-rich URL and the SDK's slug-based URL
- **Boundary discipline**: URL generation logic has one home, not two

**System-Level Impact**:

- **Schema-first integrity**: Restores the cardinal rule — upstream fields flow
  through unchanged
- **Future-proofing**: When the upstream adds `canonicalUrl` to more schemas,
  the decorator handles it correctly by default
- **Reduced drift**: One source of truth for URL generation eliminates
  duplication between SDK and search-CLI

**Risk of Not Doing**:

- **Silent type widening**: `canonicalUrl` continues to accept non-URI strings
  where the upstream requires URIs
- **Naming confusion**: AI agents and developers continue to conflate two
  different URL concepts
- **Compounding violations**: Each new upstream `canonicalUrl` field triggers
  the same overwrite + idempotency dance

### Alignment with Principles

**From principles.md**:

> "Strict and complete, everywhere, all the time. Prefer explicit, total, fully
> checked systems over permissive, partial, or hand-wavy ones."
>
> "Always choose long-term architectural clarity over short-term convenience."
>
> "Use consistent naming conventions for files, modules, functions, data
> structures, classes, constants, type information and CONCEPTS."

**This Plan**:

- Restores strict type information on URL fields
- Chooses architectural clarity (rename) over convenience (leave as is)
- Establishes consistent naming for distinct URL concepts
- Relocates domain logic to the correct architectural layer

---

## References

- `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`
  — the decorator that overwrites upstream fields
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts`
  — the generator template for URL helpers
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts`
  — the generated URL helpers
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
  — the runtime augmentation layer
- `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts`
  — the search-CLI domain logic that should move to the SDK
- `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`
  — the upstream schema with `canonicalUrl` and `oakUrl`
- `docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md`
  — the ADR that needs updating
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
