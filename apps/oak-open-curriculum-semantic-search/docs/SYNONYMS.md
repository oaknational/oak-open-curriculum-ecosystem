# Synonyms

This document explains the synonym system used for search query expansion.

## Single Source of Truth

All synonyms are defined in the SDK at:

```text
@oaknational/oak-curriculum-sdk → synonymsData
```

Location: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`

The synonyms are organised into themed modules:

| Module          | Content                              |
| --------------- | ------------------------------------ |
| `subjects.ts`   | Subject name variations              |
| `key-stages.ts` | Key stage aliases                    |
| `numbers.ts`    | Number words and mathematical terms  |
| `geography.ts`  | Geography concepts                   |
| `history.ts`    | History periods                      |
| `maths.ts`      | Maths operations                     |
| `english.ts`    | English terms                        |
| `science.ts`    | Science topics                       |
| `education.ts`  | Generic and educational acronyms     |
| `index.ts`      | Barrel file exporting `synonymsData` |

This ensures synonyms are consistent across:

- MCP tools (natural language understanding)
- Elasticsearch (query-time synonym expansion)
- Any other consumer needing term normalisation

## Synonym Categories

The ontology defines these synonym groups:

| Category              | Purpose                             | Examples                                  |
| --------------------- | ----------------------------------- | ----------------------------------------- |
| `subjects`            | Subject name variations             | maths → math, mathematics                 |
| `keyStages`           | Key stage aliases                   | ks4 → key stage 4, gcse, year 10, year 11 |
| `numbers`             | Number words and mathematical terms | squared → quadratic, quadratic equation   |
| `geographyThemes`     | Geography concepts                  | climate → climate change, global warming  |
| `historyTopics`       | History periods                     | world-war-1 → ww1, first world war        |
| `mathsConcepts`       | Maths operations                    | addition → add, plus, sum                 |
| `englishConcepts`     | English terms                       | grammar → syntax                          |
| `scienceConcepts`     | Science topics                      | photosynthesis → chlorophyll              |
| `generic`             | General educational terms           | assessment → quiz, test, exam             |
| `educationalAcronyms` | UK education acronyms               | sen → special educational needs           |

## Key Mathematical Synonyms

The `numbers` category includes important mathematical term mappings:

```typescript
squared: [
  'square number',
  'square root',
  'quadratic',
  'quadratic equation',
  'quadrature',
  'power of two',
  'raised to the power of two',
  'second power',
],
cubed: [
  'cube number',
  'cube root',
  'cubic',
  'cubic equation',
  'power of three',
  'raised to the power of three',
  'third power',
],
```

These enable queries like "how to solve equations with x squared" to match lessons about quadratic equations.

## How Synonyms Reach Elasticsearch

1. **Define**: Add/edit synonyms in `ontologyData.synonyms` in the SDK
2. **Export**: The SDK's `buildElasticsearchSynonyms()` generates ES-compatible format
3. **Deploy**: Run `elastic:setup` to push the `oak-syns` synonym set to ES
4. **Apply**: The `oak_text_search` analyser uses `synonym_graph` filter at query time

### Workflow to Update Synonyms

```bash
# 1. Edit the SDK ontology data
vim packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts

# 2. Rebuild the SDK
pnpm -C packages/sdks/oak-curriculum-sdk build

# 3. Push updated synonyms to Elasticsearch
pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup

# 4. Verify the update
curl "${ELASTICSEARCH_URL}/_synonyms/oak-syns" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.synonyms_set | length'
```

## Elasticsearch Configuration

The synonym set is used via the `oak_text_search` analyser:

```json
{
  "analysis": {
    "filter": {
      "oak_syns_filter": {
        "type": "synonym_graph",
        "synonyms_set": "oak-syns",
        "updateable": true
      }
    },
    "analyzer": {
      "oak_text_search": {
        "type": "custom",
        "tokenizer": "standard",
        "filter": ["lowercase", "asciifolding", "oak_syns_filter"]
      }
    }
  }
}
```

Key points:

- `updateable: true` allows synonym updates without reindexing
- Synonyms are applied at **query time**, not index time
- The `oak_text_search` analyser is used for search queries
- The `oak_text` analyser (without synonyms) is used at index time

## Adding New Synonyms

1. Identify the appropriate category in `ontologyData.synonyms`
2. Add the canonical term as a key with alternatives as an array
3. Ensure the `synonym-export.ts` includes the category in both:
   - `buildElasticsearchSynonyms()` for ES export
   - `buildSynonymLookup()` for programmatic lookups
4. Run quality gates and redeploy

### Example: Adding a New Mathematical Term

```typescript
// In ontologyData.synonyms.numbers
'x-squared': [
  'x²',
  'x to the power of 2',
  'x squared',
],
```

## Verifying Synonyms Work

Test synonym expansion with the ES analyse API:

```bash
curl -X POST "${ELASTICSEARCH_URL}/oak_lessons/_analyze" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "analyzer": "oak_text_search",
    "text": "x squared equations"
  }' | jq '.tokens[].token'
```

Expected output should include both the original terms and expanded synonyms.

## Troubleshooting

### Synonyms Not Expanding

1. **Check ES synonym set exists**:

   ```bash
   curl "${ELASTICSEARCH_URL}/_synonyms/oak-syns"
   ```

2. **Verify the category is exported**: Check `synonym-export.ts` includes the group

3. **Rerun elastic:setup**: The synonym set may need updating

### New Synonyms Not Working

1. Rebuild the SDK after editing `ontologyData.synonyms`
2. Run `elastic:setup` to push to ES
3. Clear any query caches (restart dev server)

### Performance Considerations

- Synonym expansion happens at query time, adding minimal latency
- Large synonym sets can slow queries; keep entries focused
- Use `updateable: true` to avoid reindexing when synonyms change
