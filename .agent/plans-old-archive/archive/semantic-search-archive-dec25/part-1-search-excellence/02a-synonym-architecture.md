# Sub-Plan 02a: Synonym Architecture — Fix Circular Dependency

**Status**: ✅ COMPLETE  
**Completed**: 2025-12-24  
**Parent**: [README.md](README.md)  
**Successor**: [02b-vocabulary-mining.md](02b-vocabulary-mining.md)

---

## Summary

The circular dependency issue was caused by **dead code**. The file `generate-synonyms-file.ts` imported from runtime code but was never actually called in the type-gen pipeline. The fix was simple: delete the dead code and document the current (working) architecture.

---

## What Was Done

### 1. Deleted Dead Code

**File deleted**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-synonyms-file.ts`

The file contained a function `generateSynonymsFile()` that:
- Imported `ontologyData` from runtime (Cardinal Rule violation)
- Was never called from the type-gen pipeline
- Was dead code from historical refactoring

**Verification**: `grep 'generate-synonyms-file' packages/` returns no matches.

### 2. Documented Synonym Architecture

**File updated**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md`

Comprehensive documentation now includes:
- Purpose of the synonyms module
- How synonyms are structured (canonical → alternatives)
- How to add new synonyms using TDD
- How synonyms flow to Elasticsearch
- How synonyms are consumed by ontology-data.ts, synonym-export.ts, and Search app
- Reference to ADR-063
- Future direction for vocab-gen integration

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

## What This Enables (02b)

With 02a complete, the vocab-gen pipeline (02b) can proceed to enhance synonyms by:

1. **Mining** bulk download keyword definitions (parsing "also known as", etc.)
2. **Merging** with existing manual synonyms
3. **Drawing on** ontology-data.ts and knowledge-graph-data.ts for structure
4. **Generating** enhanced synonym sets

See [02b-vocabulary-mining.md](02b-vocabulary-mining.md) for details.

---

## Related Documents

- [02b-vocabulary-mining.md](02b-vocabulary-mining.md) — **Comprehensive vocabulary mining pipeline** (next step)
- [ADR-063: SDK Domain Synonyms Source of Truth](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)
- [synonyms/README.md](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md) — Synonym module documentation
- [SYNONYMS.md](../../../../apps/oak-search-cli/docs/SYNONYMS.md) — Search app synonym documentation
- [principles.md](../../directives/principles.md) — TDD, no dead code, Cardinal Rule
