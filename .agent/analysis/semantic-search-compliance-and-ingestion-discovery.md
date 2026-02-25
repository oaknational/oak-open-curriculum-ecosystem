## Scope

Discovery-only review against rules/testing/schema-first for semantic search. No code changes made. Kibana access successful; ingestion state verified.

## Findings by Prompted Question

0. **Rules / no fallbacks or compatibility layers / fail fast**: Compatibility exports remain for legacy `SearchCompletionSuggest*` in both generated barrel and types index; **these** are explicitly retained via eslint-disables, violating the “no compatibility layers” rule and preventing fail-fast removal. Disabling checks is forbidden per rules—those eslint-disables must be removed. Generator still emits the legacy exports (see mismatch below).
1. **Dead code**: `SearchCompletionSuggestPayload`/`Schema` are only referenced as deprecated re-exports (rg shows no consumers beyond barrels). This is effectively dead compatibility surface.
2. **Versioning with git, not names**: Back-compat exports act as a naming-based compatibility layer rather than relying on git history; generator + emitted file divergence indicates the break isn’t clean.
3. **Tests prove behaviour, not implementation**: Completion-context regression tests exercise behaviour (context sets and ES/Zod alignment) rather than internals; no mock-heavy or implementation-detail assertions observed in sampled tests.
4. **Tests prove something useful**: The same completion-context tests assert alignment and guard against the original `sequence` context bug; they provide meaningful coverage. No evidence of “tests of tests” seen in the sampled area; full-suite audit not performed.
5. **Other mismatch / upload blockers**:
   - **Generator vs generated drift**: `generate-search-index.ts` still emits the old completion suggest export set (no per-index completion schemas, no inline lint-disables), while the generated file contains new per-index contexts plus deprecated exports. Running `pnpm sdk-codegen` today would revert to the generator’s older shape, dropping the new per-index completion exports and reintroducing lint failures. The fixes must be applied in the generator templates (schema-first), not by editing generated output.
   - **Deprecated compatibility surface**: Deprecated exports in both barrels keep the lint failure active; eslint-disables are impermissible and must be removed once the generator is corrected. This blocks quality gates and therefore ingestion/reset automation.
   - **Kibana state verified**: See "Kibana Exploration Results" section below. 142 docs indexed in `oak_unit_rollup` (105) and `oak_units` (37); `oak_lessons` empty (mapping exception). Synonym set `oak-syns` has 68 rules.
6. **TSDoc with examples**: Generated barrels (`src/types/generated/search/index.ts`, `src/types/index.ts`) contain only headers and no TSDoc/example blocks. Generator templates likewise emit no TSDoc, so coverage is not comprehensive.
7. **What's uploaded/ingested**: Verified via Kibana. Contrary to the "0 docs" expectation in `semantic-search.prompt.md`, **142 documents** are indexed: 105 in `oak_unit_rollup` and 37 in `oak_units`. Only `oak_lessons` is empty (consistent with the noted `strict_dynamic_mapping_exception`). Unit-level ingestion succeeded; lesson ingestion failed. The prompt's expected state section is outdated.

## Additional context from semantic-search prompt

- Foundation reminders: re-read rules, testing-strategy, schema-first directive, and AGENT.md; use `@oaknational/mcp-logger` (no console), enforce per-index completion contexts (ADR-068), and stick to TDD at all levels.
- Quality gates are all blocking; disabling lint or other checks is forbidden. Any prior edits to generated files must be moved into generator templates to preserve schema-first flow and remove eslint-disables.

## Evidence

Generator still emits legacy-only exports (no per-index completion contexts):

```1:67:packages/sdks/oak-sdk-codegen/code-generation/typegen/search/generate-search-index.ts
export {
  SearchCompletionSuggestPayloadSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  isSearchCompletionSuggestPayload,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
} from './index-documents.js';
export type {
  SearchCompletionSuggestPayload,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
} from './index-documents.js';
```

Generated barrel currently includes per-index contexts plus deprecated exports with lint-disables (generator mismatch):

```46:92:packages/sdks/oak-curriculum-sdk/src/types/generated/search/index.ts
export {
  SearchLessonsCompletionContextsSchema,
  SearchUnitsCompletionContextsSchema,
  SearchUnitRollupCompletionContextsSchema,
  SearchSequenceCompletionContextsSchema,
  SearchThreadCompletionContextsSchema,
  SearchLessonsCompletionPayloadSchema,
  SearchUnitsCompletionPayloadSchema,
  SearchUnitRollupCompletionPayloadSchema,
  SearchSequenceCompletionPayloadSchema,
  SearchThreadCompletionPayloadSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  SearchThreadIndexDocSchema,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
  isSearchThreadIndexDoc,
} from './index-documents.js';
// Legacy deprecated exports - kept for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-deprecated
export { SearchCompletionSuggestPayloadSchema, isSearchCompletionSuggestPayload } from './index-documents.js';
// eslint-disable-next-line @typescript-eslint/no-deprecated
export type { SearchCompletionSuggestPayload } from './index-documents.js';
```

Types barrel re-exports deprecated symbols (keeps lint failure alive):

```55:61:packages/sdks/oak-curriculum-sdk/src/types/index.ts
// Legacy deprecated exports - kept for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-deprecated
export { SearchCompletionSuggestPayloadSchema, isSearchCompletionSuggestPayload } from './generated/search/index';
// eslint-disable-next-line @typescript-eslint/no-deprecated
export type { SearchCompletionSuggestPayload } from './generated/search/index';
```

Docs export generator also retains deprecated surface:

```21:56:packages/sdks/oak-sdk-codegen/code-generation/typegen/search/index-doc-exports.ts
export {
  SearchLessonsCompletionContextsSchema,
  SearchUnitsCompletionContextsSchema,
  SearchUnitRollupCompletionContextsSchema,
  SearchSequenceCompletionContextsSchema,
  SearchThreadCompletionContextsSchema,
  SearchLessonsCompletionPayloadSchema,
  SearchUnitsCompletionPayloadSchema,
  SearchUnitRollupCompletionPayloadSchema,
  SearchSequenceCompletionPayloadSchema,
  SearchThreadCompletionPayloadSchema,
  SearchCompletionSuggestPayloadSchema,
  SearchThreadIndexDocSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  isSearchCompletionSuggestPayload,
  isSearchThreadIndexDoc,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
} from '../../../src/types/generated/search/index-documents.js';
```

Behaviour-focused regression tests (example):

```1:104:packages/sdks/oak-sdk-codegen/code-generation/typegen/search/completion-context-alignment.unit.test.ts
describe('Completion Context Alignment: ES Overrides consume source of truth', () => {
  it('LESSONS_FIELD_OVERRIDES title_suggest contexts match LESSONS_COMPLETION_CONTEXTS', () => {
    const esContexts = extractEsCompletionContexts(LESSONS_FIELD_OVERRIDES);
    const sourceContexts = [...LESSONS_COMPLETION_CONTEXTS];

    expect(esContexts).toEqual(sourceContexts);
  });
});
```

## Kibana Exploration Results (2025-12-06)

Successfully authenticated and explored ES Serverless Kibana at [poc-open-curriculum-api-search](https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud/).

### Index State (Actual vs Expected)

| Index                 | Actual Docs | Expected (per prompt) | Storage   | Notes                      |
| --------------------- | ----------- | --------------------- | --------- | -------------------------- |
| `oak_unit_rollup`     | **105**     | 0                     | 503.39 kb | **SURPRISE**: Data exists! |
| `oak_units`           | **37**      | 0                     | 125.24 kb | **SURPRISE**: Data exists! |
| `oak_lessons`         | 0           | 0                     | 0 b       | Empty as expected          |
| `oak_sequences`       | 0           | 0                     | 0 b       | Empty as expected          |
| `oak_sequence_facets` | 0           | 0                     | 0 b       | Empty as expected          |
| `oak_meta`            | 0           | 0                     | 0 b       | Empty as expected          |

**Total indexed documents: 142** (contrary to the "0 docs" expectation in semantic-search.prompt.md)

### Synonyms

| Synonym Set | Rule Count | Notes                           |
| ----------- | ---------- | ------------------------------- |
| `oak-syns`  | 68         | Matches expectation from prompt |

### Discover Observations

- Data view: `default:all-data`
- Discover shows **74 docs** with 15-minute time filter (curriculum docs lack timestamp fields, causing the filter to behave unexpectedly)
- Available fields (14): `key_stage`, `lesson_count`, `lesson_ids`, `rollup_text`, `sequence_ids`, `subject_programmes_url`, `subject_slug`, `title_suggest` (unknown type), `unit_id`, `unit_semantic`, `unit_slug`, `unit_title`, `unit_url`, `years`
- Empty fields: 34 (including lesson-specific fields not present in unit_rollup docs)
- Meta fields: 4 (`_id`, `_index`, `_score`, `_ignored`)
- Sample doc content: Maths KS1 unit rollups with rich `rollup_text` (keywords, learning points, teacher tips, misconceptions)

### Key Finding: Ingestion Succeeded (Partially)

The semantic-search.prompt.md states "0 docs (ingestion failed with strict_dynamic_mapping_exception)" for `oak_lessons` and expected all indices empty. However:

1. **`oak_unit_rollup` and `oak_units` HAVE data** — 142 docs total
2. **`oak_lessons` is empty** — consistent with the mapping exception note
3. Ingestion appears to have succeeded for unit-level documents but not lessons

This suggests the completion context mismatch bug affected `oak_lessons` ingestion but not unit rollups/units. The prompt's "expected state" section needs updating.
