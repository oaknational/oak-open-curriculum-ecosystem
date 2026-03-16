# Task 2.2 Retrieval Semantics

## Mapping-aware Filter Contract

- `sequences.category_titles` is mapped as `text` in generated mappings.
- Retrieval filters for `category_titles` use `match_phrase`, not `term`.
- This is intentional phrase semantics for analysed text.

## Regression Coverage

- `packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.unit.test.ts`
- `packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.integration.test.ts`
