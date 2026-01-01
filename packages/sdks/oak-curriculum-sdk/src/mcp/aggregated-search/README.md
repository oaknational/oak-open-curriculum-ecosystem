# Aggregated Search

The Aggregated Search tool is a tool that allows you to search the curriculum data. It is a composite tool that combines the `get-search-lessons` and `get-search-transcripts` tools.

## Future: Semantic Search Integration

Once the Elasticsearch Serverless instance is deployed and populated, the aggregated search tool will be enhanced to:

1. **Add `mode` parameter** - `basic` (current API-based) or `semantic` (ES-based hybrid RRF search)
2. **Support thread filtering** - Filter by conceptual progression strands
3. **Support programme factors** - Filter by tier, exam board, pathway (KS4)
4. **Enable faceted navigation** - Subject, key stage, year, thread facets in responses

See `.agent/research/elasticsearch/system/expanded-architecture-analysis.md` for the full architecture proposal.
