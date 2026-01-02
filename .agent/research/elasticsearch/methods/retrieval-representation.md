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

## 4. Typeahead and Suggestions

Use `search_as_you_type` or completion suggester fields for:

- Prefix search.
- Search-as-you-type UI.

## 5. Field Types

Recommended types:

- `text` + `keyword` multi-fields for lexical.
- `semantic_text` for sparse semantic retrieval.
- `dense_vector` for dense semantic retrieval.
- `search_as_you_type` for suggestions.

## References

- Semantic text field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text
- Dense vector field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
- Search as you type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/search-as-you-type
