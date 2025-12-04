---
title: APIs and tools
description: This page is handy list of the most important APIs and tools you need to build, test, and manage your search app built with Elasticsearch. Access these...
url: https://www.elastic.co/docs/solutions/search/apis-and-tools
products:
  - Elastic Cloud Serverless
---

# APIs and tools

This page is handy list of the most important APIs and tools you need to build, test, and manage your search app built with Elasticsearch.

## API endpoints

### Query & search APIs

| Endpoint                                                                                                                           | Function                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ---------- |
| [`_search`](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-search)`_search`                                      | Searches and aggregations written in [Query DSL](https://www.elastic.co/docs/explore-analyze/query-filter/languages/querydsl)Query DSL and [retrievers](https://www.elastic.co/docs/solutions/search/retrievers-overview)retrievers syntax |
| [`_query`](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-esql)`_query`                                          | Endpoint for [ES                                                                                                                                                                                                                           | QL](https://www.elastic.co/docs/reference/query-languages/esql)ES | QL queries |
| [`_explain`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-explain)`_explain`                              | Provides detailed explanation of how a specific document matches a query with scoring breakdown                                                                                                                                            |
| [`_count`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-count)`_count`                                    | Returns count of documents matching a query without retrieving results                                                                                                                                                                     |
| [`_validate/query`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-validate-query)`_validate/query` | Validates query syntax without executing the search                                                                                                                                                                                        |
| [`_analyze`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze)`_analyze`                      | Performs analysis for [full-text search](https://www.elastic.co/docs/solutions/search/full-text)full-text search on a text string and returns the resulting tokens.                                                                        |

### Ingestion & mapping APIs

| Endpoint                                                                                                                      | Function                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`_mapping`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-get-field-mapping)`_mapping`       | Retrieves or updates field mappings with options for specific field inspection |
| [`_reindex`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex)`_reindex`                         | Copies documents from one index to another, useful for mapping changes         |
| [`_update_by_query`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-update-by-query)`_update_by_query` | Updates documents matching a query without reindexing                          |
| [`_bulk`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk)`_bulk`                                  | Performs multiple index/update/delete operations in a single request           |
| [`_refresh`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-refresh)`_refresh`                 | Forces a refresh to make recent operations searchable                          |
| [`_ingest/pipeline`](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-ingest)`_ingest/pipeline`               | Creates and manages document processing pipelines before indexing              |

### Search optimization APIs

| Endpoint                                                                                                             | Function                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [`_rank_eval`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-rank-eval)`_rank_eval`          | Evaluates search quality against known relevant documents                                                                    |
| [`_settings`](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-get-settings)`_settings` | Configures settings including slow logs, refresh intervals, and replicas (only index-level settings available in serverless) |
| [`_scripts`](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-script)`_scripts`                      | Creates or updates stored scripts for reuse in queries and aggregations                                                      |

## UI tools

### Dev tools

Access these specialized tools in Kibana and the Serverless UI to develop, debug, and refine your search queries while monitoring their performance and efficiency.
These tools are documented in the **Explore & Analyze** section:

| Tool                                                                                                             | Function                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Saved queries](https://www.elastic.co/docs/explore-analyze/query-filter/tools/saved-queries)Saved queries       | Save your searches and queries to reuse them later.                                                                |
| [Console](https://www.elastic.co/docs/explore-analyze/query-filter/tools/console)Console                         | Interact with the REST APIs of Elasticsearch and Kibana, including sending requests and viewing API documentation. |
| [Search Profiler](https://www.elastic.co/docs/explore-analyze/query-filter/tools/search-profiler)Search Profiler | Inspect and analyze your search queries.                                                                           |
| [Grok Debugger](https://www.elastic.co/docs/explore-analyze/query-filter/tools/grok-debugger)Grok Debugger       | Build and debug grok patterns before you use them in your data processing pipelines.                               |
| [Painless Lab](https://www.elastic.co/docs/explore-analyze/scripting/painless-lab)Painless Lab                   | Test and debug Painless scripts in real-time.                                                                      |

### Search UI

[Elastic Search UI](https://www.elastic.co/docs/solutions/search/site-or-app/search-ui) is a library of JavaScript and React tools for building search experiences, optimized for use with Elasticsearch.
<tip>
Check out the Elasticsearch Labs [blog](https://www.elastic.co/search-labs) to learn how to use Elastic to build advanced search experiences including generative AI, embedding models, reranking capabilities and more.The accompanying [GitHub repository](https://www.github.com/elastic/elasticsearch-labs) contains hands-on Python notebooks and sample apps to help you get started with these advanced search features.
</tip>

## Generative AI tools

### Agent Builder

[Agent Builder](https://www.elastic.co/docs/solutions/search/elastic-agent-builder) enables you to create AI agents that can interact with your Elasticsearch data, execute queries, and provide intelligent responses. It provides a complete framework for building conversational AI experiences on top of your search infrastructure.

### Playground

[Playground](https://www.elastic.co/docs/solutions/search/rag/playground) enables you to use large language models (LLMs) to understand, explore, and analyze your Elasticsearch data using retrieval augmented generation (RAG), via a chat interface. Playground is also very useful for testing and debugging your Elasticsearch queries, using the [retrievers](https://www.elastic.co/docs/solutions/search/retrievers-overview) syntax with the `_search` endpoint.

### Model Context Protocol (MCP)

The [Model Context Protocol (MCP)](https://www.elastic.co/docs/solutions/search/mcp) lets you connect AI agents and assistants to your Elasticsearch data to enable natural language interactions with your indices.
