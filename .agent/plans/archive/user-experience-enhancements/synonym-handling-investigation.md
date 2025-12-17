# Synonym Handling Investigation

## Status: Complete (Option B implemented)

## Context

The codebase contains synonym infrastructure that isn't wired in:

- `type-gen/typegen/mcp-tools/synonym-config.ts` - defines mappings (e.g., "fine art" → "art", "key stage four" → "ks4")
- `type-gen/typegen/mcp-tools/parts/generate-synonyms-file.ts` - generator for lookup functions
- Neither is connected to the type-gen pipeline or tool handlers

## Question

**Should we wire this in, or delete it?**

Input is always via an LLM. LLMs are inherently better at synonym resolution than any static mapping we could write. They understand context, typos, abbreviations, and natural language variations.

## Options

### Option A: Delete the synonym infrastructure

- Remove `synonym-config.ts` and `generate-synonyms-file.ts`
- Simpler codebase, less maintenance
- Trust the LLM to normalise user intent

### Option B: Add synonyms to the ontology tool

- Keep the config as documentation
- Expose synonym mappings via `get-ontology` tool response
- LLM can reference these when constructing tool calls
- No runtime code changes needed, just metadata

### Option C: Wire synonyms into tool input validation

- Generate and use `standardiseKeyStage()` / `standardiseSubject()` functions
- Normalise inputs before Zod validation
- More code, more maintenance, marginal benefit over LLM capability

## Recommendation

**Option B** - Add to ontology as documentation for LLMs.

This provides value without complexity. The ontology already teaches agents about the domain; adding synonyms helps them understand alternative terminology users might employ.

## Next Steps

1. Decide on approach
2. If Option A: Delete the files
3. If Option B: Update ontology generator to include synonym section
4. If Option C: Wire generator into type-gen and update tool handlers

## Implementation (2025-11-28)

Option B was implemented:

- Added `synonyms` section to `ontology-data.ts` with subjects and keyStages mappings
- Unit test added to `universal-tools.unit.test.ts`
- LLMs can now reference synonym information when constructing tool calls

## Related Files

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` (synonyms section added)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts` (test added)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/synonym-config.ts` (source, can be deleted later)
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-synonyms-file.ts` (unused, can be deleted later)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-assertions/synonyms.ts` (updated to use canonical values)
