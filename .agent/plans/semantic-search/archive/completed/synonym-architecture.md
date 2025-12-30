# Archive: Synonym Architecture Resolution

**Status**: ✅ Complete  
**Completed**: 2025-12-24  
**Original Location**: `part-1-search-excellence/02a-synonym-architecture.md`

---

## Summary

A suspected circular dependency in the synonym type-gen pipeline was resolved by discovering the offending file was **dead code** — never called from any execution path. The fix was simple: delete the dead code.

---

## What Was Done

### 1. Deleted Dead Code

**File deleted**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-synonyms-file.ts`

The file:
- Imported `ontologyData` from runtime (Cardinal Rule violation)
- Was never called from the type-gen pipeline
- Was dead code from historical refactoring

**Verification**: `grep 'generate-synonyms-file' packages/` returns no matches.

### 2. Documented Synonym Architecture

Updated `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md` with:
- Purpose of the synonyms module
- How synonyms are structured (canonical → alternatives)
- How to add new synonyms using TDD
- How synonyms flow to Elasticsearch
- Reference to ADR-063

---

## Current Synonym Architecture (Working)

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/*.ts  (hand-authored)
                    ↓
synonyms/index.ts → synonymsData
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
ontology-data.ts          synonym-export.ts
(AI agent context)        (ES export utilities)
        ↓                       ↓
get-ontology MCP tool     pnpm es:setup
        ↓                       ↓
AI agents                 Elasticsearch oak-syns
```

**No circular dependency** — type-gen code does not import from runtime.

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Delete `generate-synonyms-file.ts` | Dead code, never called |
| Synonyms remain hand-authored | Curated quality over mined quantity |

---

## Related ADRs

- [ADR-063: SDK Domain Synonyms Source of Truth](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)

---

## Key Learnings

1. **Always verify execution paths** — Code that exists but is never called is dead code.
2. **The Cardinal Rule must be maintained** — Type-gen must not import from runtime.
3. **Simple fixes beat complex workarounds** — Deleting dead code is better than fixing it.

---

## Successor Work

This resolution enabled vocabulary mining work in `02b-vocabulary-mining.md`, which explores enhancing synonyms through bulk download mining.



