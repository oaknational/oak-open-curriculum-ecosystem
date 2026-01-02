# Search Optimisation Fundamentals (Elastic Docs)

This note summarises Elastic’s fundamentals for search performance and relevance tuning. It is a short checklist grounded in the official documentation.

## 1. Performance Basics

Key guidance from Elastic’s search speed recommendations:

- Use fast hardware and give memory to the filesystem cache.
- Search as few fields as possible and pre-index derived values.
- Map identifiers as `keyword` for fast exact matching.
- Avoid scripts in hot queries.
- Use index sorting to speed up conjunctions.
- Warm up the filesystem cache and global ordinals where it helps.

## 2. Query Controls

- Use filters for structured constraints and caching.
- Avoid deep pagination; use `search_after` where possible.
- Set sensible search timeouts and `track_total_hits` thresholds.

## 3. Profiling and Diagnostics

- Use the search profile API to understand query costs.
- Use the search slow log to catch pathological queries.

## 4. Caches

- Request cache helps repeated identical queries.
- Query cache helps repeated filters.

## References

- Search speed guidance: https://www.elastic.co/docs/deploy-manage/production-guidance/optimize-performance/search-speed
- Search settings: https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/search-settings
- Pagination guidance: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results
- Search profile API: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile
- Slow log: https://www.elastic.co/docs/reference/elasticsearch/index-settings/slow-log
- Request cache: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/shard-request-cache
- Query cache: https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/node-query-cache-settings
