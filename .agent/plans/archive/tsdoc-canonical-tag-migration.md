# TSDoc Canonical Tag Migration

> **Status**: complete  
> **Priority**: Medium (documentation quality)  
> **Foundation Alignment**: Standards compliance, maintainability

## Problem Statement

The codebase uses `@description` in 548 places across 101 files. Per the [TSDoc specification](https://tsdoc.org/pages/tags/remarks/), `@description` is **not a valid TSDoc tag**.

### Current Non-Standard Tags

| Tag            | Count | TSDoc Valid? | Canonical Alternative             |
| -------------- | ----- | ------------ | --------------------------------- |
| `@description` | 548   | No           | Summary (first paragraph, no tag) |
| `@module`      | ~100  | No           | `@packageDocumentation`           |

### Why This Matters

1. **Tool compatibility**: TSDoc parsers may ignore or warn about unknown tags
2. **Documentation generation**: TypeDoc and other tools expect standard tags
3. **Consistency**: Mixed JSDoc/TSDoc syntax creates confusion
4. **Future-proofing**: Avoiding custom tag proliferation

## Breakdown by Source

| Category                                      | Files | Occurrences | Action                                 |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Generated from OpenAPI (`api-paths-types.ts`) | 1     | 433         | Handled by existing `sanitize-docs.ts` |
| Hand-written source files                     | ~70   | ~80         | Manual migration                       |
| Generators that output `@description`         | ~10   | ~20         | Update generator templates             |
| Test files                                    | ~20   | ~15         | Manual migration                       |

## Canonical TSDoc Pattern

### Before (Current)

```typescript
/**
 * @module sdk-cache
 * @description Redis caching utilities for Oak SDK responses.
 */
```

### After (Canonical TSDoc)

```typescript
/**
 * Redis caching utilities for Oak SDK responses.
 *
 * @packageDocumentation
 */
```

### Key Principles

1. **Summary first**: The first paragraph (before any tag) is the summary
2. **@remarks for detail**: Additional documentation goes in `@remarks` block
3. **@packageDocumentation**: Marks file-level documentation (replaces `@module`)
4. **No @description**: Simply remove the tag, keep the text as the summary

## Implementation Plan

### Phase 1: Update Generators

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-reference.ts`
- Any other generators producing `@description` in output

**Change**: Update template strings to use canonical TSDoc format.

### Phase 2: Migrate Hand-Written Files

**Scope**: ~70 files in `apps/` and `packages/` (excluding generated)

**Transformation rules**:

1. `@packageDocumentation foo` + `@description Bar` → `Bar\n\n@packageDocumentation`
2. `@description Bar` alone → `Bar` (just the text, no tag)
3. Preserve `@see`, `@param`, `@returns`, `@throws`, `@example` (all valid TSDoc)

**Files by area**:

| Area                                                | Est. Files |
| --------------------------------------------------- | ---------- |
| `apps/oak-search-cli/src/`     | ~40        |
| `apps/oak-search-cli/scripts/` | ~10        |
| `packages/sdks/oak-curriculum-sdk/src/`             | ~10        |
| `packages/sdks/oak-curriculum-sdk/type-gen/`        | ~15        |
| `packages/libs/result/`                             | 2          |

### Phase 3: Extend Sanitizer (Optional)

The existing `sanitize-docs.ts` only processes `types/generated/api-schema/` for TypeDoc. Consider extending to run on all source files during a lint/format step.

**Decision**: Defer - manual migration is more controlled and allows review.

### Phase 4: Add ESLint Rule (Future)

After migration, add `eslint-plugin-tsdoc` to prevent regression:

```json
{
  "plugins": ["eslint-plugin-tsdoc"],
  "rules": {
    "tsdoc/syntax": "warn"
  }
}
```

**Decision**: Separate follow-up task after migration complete.

## Execution Strategy

### Approach: Incremental by Directory

1. Start with `packages/libs/result/` (2 files, easy win)
2. Then `packages/sdks/oak-curriculum-sdk/src/config/` (small, self-contained)
3. Then generators in `type-gen/typegen/search/`
4. Finally bulk migration of `apps/oak-search-cli/`

### Per-File Checklist

- [ ] Replace `@packageDocumentation foo` with `@packageDocumentation` (at end of block)
- [ ] Move `@description` text to be the first paragraph (no tag)
- [ ] If both `@packageDocumentation` and `@description` exist, combine appropriately
- [ ] Preserve all other valid TSDoc tags
- [ ] Run quality gates after each batch

## Acceptance Criteria

| Criterion                                       | Measurement                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| No `@description` in hand-written code          | `grep -r "@description" --include="*.ts" \| grep -v generated \| wc -l` returns 0          |
| No `@packageDocumentation` in hand-written code | `grep -r "@packageDocumentation" --include="*.ts" \| grep -v generated \| wc -l` returns 0 |
| Generated files handled by sanitizer            | Existing behaviour preserved                                                               |
| All quality gates pass                          | Full suite green                                                                           |

## Risk Assessment

| Risk                  | Likelihood | Impact | Mitigation                           |
| --------------------- | ---------- | ------ | ------------------------------------ |
| Doc generation breaks | Low        | Medium | Test TypeDoc output before/after     |
| Semantic meaning lost | Low        | Low    | Review each file individually        |
| Large diff noise      | Medium     | Low    | Batch by directory, separate commits |

## Related Documents

- [TSDoc @remarks](https://tsdoc.org/pages/tags/remarks/)
- [TSDoc @packageDocumentation](https://tsdoc.org/pages/tags/packagedocumentation/)
- [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc)

## Estimated Effort

| Phase                 | Files  | Effort      |
| --------------------- | ------ | ----------- |
| Phase 1: Generators   | ~5     | 30 min      |
| Phase 2: Hand-written | ~70    | 2-3 hours   |
| Phase 3: Sanitizer    | 1      | Deferred    |
| Phase 4: ESLint       | Config | Future task |

**Total**: ~3 hours for immediate migration
