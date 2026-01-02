# Search Operations and Governance

This note outlines operational fundamentals that keep search reliable and maintainable.

## 1. Synonyms Lifecycle

- Maintain synonyms in versioned sets.
- Prefer query-time synonyms so updates do not require reindexing.
- Test synonym expansions on the evaluation query set.

Prioritise synonyms using value scoring rather than ad-hoc fixes:

```
Value = Frequency x (1 + 1/Year) x (1 + 0.2 * (subjects - 1))
```

This favours foundational, cross-subject terms where teacher language diverges from curriculum language.

Prefer precision-safe mechanisms:

- Multi-word teacher phrases via phrase boosting rather than single-token expansion.
- Subject-scoped synonym sets for ambiguous terms (e.g. "gradient" in maths vs art).
- Remove overly broad synonyms that introduce false positives (for example, "total" for addition).

Use structured sources for candidate generation:

- Curriculum definitions (the definition often contains the natural synonym).
- Transcript mining for "also called" and "remember, X means" patterns (LLM extraction is more reliable than regex).
- Search logs: zero-hit and low-click queries are the highest-value synonym signals.

Definition-derived examples that regularly surface in primary search:

- adjective -> describing word
- noun -> naming word
- denominator -> bottom number
- prefix -> word beginning

An audit approach that removes risky synonyms and adds foundational ones can improve precision without regressing MRR when tested against the evaluation set. For example, the 2025-12-27 audit removed broad or category-error synonyms (e.g. "total" for addition, "gravity" for forces) and added KS1/KS2 grammar and fractions terms, with no MRR regression.

Coverage note: synonym sets often skew towards GCSE compound terms. Track coverage for high-value KS1/KS2 vocabulary to avoid leaving foundational queries unsupported.

## 2. Query Safety

- Avoid `query_string` unless you explicitly want full syntax.
- Keep wildcard and regex usage limited.
- Prefer filters for structured constraints.

## 3. Curation and Contextual Relevance

Operational relevance levers that work well in education domains:

- Curations (pinned results) for critical concepts or canonical "first lesson" queries.
- Context-aware boosting by audience (teacher vs student vs planner) when that context is known.
- Faceted navigation aligned to curriculum hierarchy (subject -> key stage -> year -> thread -> unit -> lesson).

## 4. Index Lifecycle

- Use aliases for zero-downtime reindexing.
- Keep index naming consistent and predictable.
- For read-only indices, consider force-merge and cache warm-up when appropriate.

## 5. Monitoring

Track:

- Search slow log for long queries.
- Zero-hit rate.
- Cache utilisation (request and query cache).

## 6. Oak Integration Notes (Current)

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
