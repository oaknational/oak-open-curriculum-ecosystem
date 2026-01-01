# Query Understanding with Native Elasticsearch Features

This note outlines ES-native features that support query understanding without custom NLP services. The goal is robust parsing, suggestion, and expansion with predictable behaviour.

## 1. Prefer Structured Queries Over Free-Form Syntax

- Use `match` or `multi_match` for user text.
- Avoid exposing `query_string` unless you explicitly want advanced syntax from power users.
- If you must allow syntax, prefer `simple_query_string` for safer parsing.

## 2. Suggestions and Query Assistance

Use dedicated suggesters for interactive experiences:

- Completion suggester for fast prefix suggestions.
- `search_as_you_type` for field-backed typeahead.
- Term suggest for spell correction (if you want a "did you mean").

## 3. Synonym Expansion

Synonyms are the most reliable way to normalise:

- Numeric forms: "2" vs "two".
- Domain labels: "KS2" vs "Key Stage 2".
- Common variants: "GCSE" vs "Key Stage 4".

Use query-time synonyms if you want to update synonym sets without reindexing.

## 4. Query-Time Enrichment (Cautious Use)

Runtime fields can help when you need derived values for filtering or ranking, but:

- Keep scripts simple and deterministic.
- Use them for short-lived experiments, not as a long-term substitute for indexed fields.
- Avoid dynamic scripts that parse user language; do that in the application or agent layer.

## 5. Query Expansion Patterns

If you need lightweight expansion without external NLP:

- Use `significant_terms` on top results to discover related terms.
- Use Graph Explore API to expand entities based on co-occurrence.
- Apply expansions with low boosts to avoid query drift.

## References

- Query string query: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
- Simple query string query: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html
- Completion suggester: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html
- Search as you type: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html
- Runtime fields: https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime.html
- Significant terms aggregation: https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation
