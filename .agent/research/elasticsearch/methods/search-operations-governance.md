# Search Operations and Governance

This note outlines operational fundamentals that keep search reliable and maintainable.

## 1. Synonyms Lifecycle

- Maintain synonyms in versioned sets.
- Prefer query-time synonyms so updates do not require reindexing.
- Test synonym expansions on the evaluation query set.

## 2. Query Safety

- Avoid `query_string` unless you explicitly want full syntax.
- Keep wildcard and regex usage limited.
- Prefer filters for structured constraints.

## 3. Index Lifecycle

- Use aliases for zero-downtime reindexing.
- Keep index naming consistent and predictable.
- For read-only indices, consider force-merge and cache warm-up when appropriate.

## 4. Monitoring

Track:

- Search slow log for long queries.
- Zero-hit rate.
- Cache utilisation (request and query cache).

## 5. Oak Integration Notes (Current)

These notes are system-specific and may drift; treat them as integration examples and check `../system/` for current status.

- The CLI `es:setup` command creates indices and the `oak-syns` synonym set from SDK ontology data (`src/lib/elasticsearch/setup/index.ts`).
- `es:status` reports index health and reads `oak_meta` version metadata (`src/lib/elasticsearch/setup/cli-commands.ts`, `src/lib/elasticsearch/index-meta.ts`).
- Ingestion writes index metadata (`oak_meta`) and supports primary/sandbox targets via `SEARCH_INDEX_TARGET` (`src/lib/elasticsearch/setup/ingest-output.ts`, `src/lib/search-index-target.ts`).

## References

- Synonyms: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html
- Search settings: https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/search-settings
- Slow log: https://www.elastic.co/docs/reference/elasticsearch/index-settings/slow-log
- Request cache: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/shard-request-cache
- Query cache: https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/node-query-cache-settings
