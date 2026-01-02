# Retrieval Representation: Field Design and Chunking

This note covers how to represent content for reliable lexical, semantic, and reranking performance.

## 1. Separate Fields by Purpose

Use distinct fields for:

- Lexical retrieval (titles, keywords, short summaries).
- Semantic retrieval (`semantic_text` or dense vectors).
- Reranking (a medium-length, high-signal summary).

Avoid reusing a single field for all purposes; it forces poor trade-offs.

## 2. Summary Fields

Create a concise, information-dense summary field for:

- Reranking.
- Snippet generation.

Keep the summary short enough for inference models and long enough for meaning (roughly 100–300 tokens).

## 3. Chunking Strategy

Options:

- Manual chunking by section or paragraph.
- Automatic chunking via `semantic_text`.

Use chunking to avoid large, low-signal fields dominating retrieval.

## 4. Reference Indices for Domain Knowledge

Some high-value queries are better served by dedicated indices rather than by overloading lesson/unit documents:

- Glossary terms with definitions (definition lookup, "what does X mean").
- Misconceptions with responses (teacher guidance search).
- National curriculum statements with coverage links (standards alignment).
- Prerequisite edges for learning-path discovery.

These indices can be queried directly or used to enrich lesson/unit retrieval.

## 5. Typeahead and Suggestions

Use `search_as_you_type` or completion suggester fields for:

- Prefix search.
- Search-as-you-type UI.

## 6. Field Types

Recommended types:

- `text` + `keyword` multi-fields for lexical.
- `semantic_text` for sparse semantic retrieval.
- `dense_vector` for dense semantic retrieval.
- `search_as_you_type` for suggestions.

## 7. Progression and Safety Signals

Representation can encode progression and safeguarding signals:

- Use `firstYear` and prerequisite depth to approximate concept difficulty.
- Track vocabulary progression across years for "when is this introduced" queries.
- Index supervision level and content guidance as filterable fields to support safe lesson planning.

## References

- Semantic text field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text
- Dense vector field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
- Search as you type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/search-as-you-type
