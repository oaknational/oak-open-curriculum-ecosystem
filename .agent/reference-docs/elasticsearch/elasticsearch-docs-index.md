---
title: Elasticsearch solution overview
description: The Elasticsearch solution and serverless project type enable you to build your own applications on top of the Elasticsearch platform's scalable data...
url: https://www.elastic.co/docs/solutions/search
products:
  - Elastic Cloud Serverless
  - Elasticsearch
  - Kibana
---

# Elasticsearch solution overview

The Elasticsearch solution and serverless project type enable you to build your own applications on top of the Elasticsearch platform's scalable data store, search engine, and vector database capabilities.
Elasticsearch is a distributed datastore that can ingest, index, and manage various types of data in near real-time, making them both searchable and analyzable.
With specialized user interfaces and tools, it provides the flexibility to create, deploy, and run a wide range of applications, from search to analytics to AI-driven solutions.

## Use cases

Here are a few common real-world applications:

| Use case                                                             | Business goals                                                     | Technical requirements                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Vector search/hybrid search**Vector search/hybrid search           | Run nearest neighbour search, combine with text for hybrid results | Dense embeddings, sparse embeddings, combined with text/BM25  |
| **Ecommerce/product catalog search**Ecommerce/product catalog search | Provide fast, relevant, and up-to-date results, faceted navigation | Inventory sync, user behavior tracking, results caching       |
| **Workplace/knowledge base search**Workplace/knowledge base search   | Search across range of data sources, enforcing permissions         | Third-party connectors, document-level security, role mapping |
| **Website search**Website search                                     | Deliver relevant, up-to-date results                               | Web crawling, incremental indexing, query caching             |
| **Customer support search**Customer support search                   | Surface relevant solutions, manage access controls, track metrics  | Knowledge graph, role-based access, analytics                 |
| **Chatbots/RAG**Chatbots/RAG                                         | Enable natural conversations, provide context, maintain knowledge  | Vector search, ML models, knowledge base integration          |
| **Geospatial search**Geospatial search                               | Process location queries, sort by proximity, filter by area        | Geo-mapping, spatial indexing, distance calculations          |

If you're new to Elasticsearch and want to try out some simple search use cases, go to [Get started with Elasticsearch](https://www.elastic.co/docs/solutions/search/get-started) and [Elasticsearch quickstarts](https://www.elastic.co/docs/solutions/search/get-started/quickstarts).

## Core concepts

For an introduction to core Elasticsearch concepts such as indices, documents, and mappings, refer to [The Elasticsearch data store](https://www.elastic.co/docs/manage-data/data-store).
To dive more deeply into the building blocks of Elasticsearch clusters, including nodes, shards, primaries, and replicas, refer to [Distributed architecture](https://www.elastic.co/docs/deploy-manage/distributed-architecture).

## Related reference

- [Elasticsearch reference documentation](https://www.elastic.co/docs/reference/elasticsearch)
- [Content connectors](https://www.elastic.co/docs/reference/search-connectors)
- [Elasticsearch API documentation](https://www.elastic.co/docs/api/doc/elasticsearch/)

<tip>
  Not sure whether Elasticsearch on Elastic Cloud Serverless is the right deployment choice for you?Check out the following resources to help you decide:
  - [What’s different?](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/differences-from-other-elasticsearch-offerings): Understand the differences between Elastic Cloud Serverless and other deployment types.
  - [Billing](https://www.elastic.co/docs/deploy-manage/cloud-organization/billing/elasticsearch-billing-dimensions): Learn about the billing model for Elasticsearch on Elastic Cloud Serverless.
</tip>
