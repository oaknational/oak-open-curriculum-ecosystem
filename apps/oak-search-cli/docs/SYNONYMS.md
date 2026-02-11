# Synonyms

**Last Updated**: 2026-01-03

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
pnpm -C apps/oak-search-cli elastic:setup

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

## Two Complementary Mechanisms: Synonyms and Phrases

The SDK vocabulary supports **two parallel search mechanisms** — understanding this is critical for adding new terms.

### ES Synonym Expansion (Single-Word Tokens)

ES synonym filters apply **after tokenization**. This means they work for single-word synonyms:

```text
Query: "trigonometry basics"
After tokenization: ["trigonometry", "basics"]
Synonym filter expands: ["trigonometry", "trig", "sohcahtoa", "basics"]
```

### Phrase Detection + Boosting (Multi-Word Terms)

Multi-word synonyms cannot expand via the ES synonym filter because tokenization happens first:

```text
Query: "straight line equations"
After tokenization: ["straight", "line", "equations"]
Synonym rule: "straight line => linear" — never matches (already tokenized)
```

Approximately 40% of the SDK synonyms are multi-word phrases. These use a complementary mechanism: phrase detection + boosting.

### How Phrase Boosting Works

Phrase detection finds known multi-word curriculum terms and adds `match_phrase` boosting:

1. **Phrase Detection**: The `detectCurriculumPhrases()` function scans queries for known multi-word curriculum terms from the SDK vocabulary
2. **Phrase Boosters**: Detected phrases are added as `match_phrase` queries in the `bool.should` clause
3. **Combined Matching**: Documents matching the exact phrase get a relevance boost

### How It Works

```typescript
// Query preprocessing pipeline
const cleanedText = removeNoisePhrases(text); // B.4
const detectedPhrases = detectCurriculumPhrases(cleanedText); // B.5

// Detected phrases are passed to retriever builders
createLessonRetriever(cleanedText, filters, detectedPhrases);
```

When phrases like "straight line" are detected, the BM25 query structure changes:

```json
{
  "bool": {
    "must": [{ "multi_match": { ... } }],
    "should": [
      { "match_phrase": { "lesson_content": { "query": "straight line", "boost": 2.0 } } },
      { "match_phrase": { "lesson_title": { "query": "straight line", "boost": 2.0 } } }
    ]
  }
}
```

### Phrase Vocabulary Source

The phrase vocabulary is automatically derived from SDK synonyms:

- Any synonym term **containing a space** is considered a phrase
- The SDK's `buildPhraseVocabulary()` extracts all such terms
- Detection uses longest-match-first (greedy) to avoid partial matches

### Adding New Phrase Synonyms

When adding multi-word synonyms to the SDK, they automatically become part of the phrase vocabulary:

```typescript
// In maths.ts
'linear-graphs': [
  'straight line',        // ✅ Will be detected as phrase
  'straight line graph',  // ✅ Will be detected as phrase
  'y = mx + c',           // ✅ Will be detected as phrase
  'gradient',             // Single word - uses ES synonym filter
],
```

No additional configuration is needed — the phrase detection system picks up all multi-word terms automatically at import time.

### Verifying Phrase Detection

Run the unit tests:

```bash
pnpm test -- detect-curriculum-phrases
```

Or check manually in code:

```typescript
import { detectCurriculumPhrases } from './lib/query-processing';

detectCurriculumPhrases('straight line equations');
// Returns: ['straight line']

detectCurriculumPhrases('completing the square quadratics');
// Returns: ['completing the square']
```

### Related Documentation

- [ADR-084: Phrase Query Boosting](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)
- [ADR-063: SDK Domain Synonyms Source of Truth](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)
