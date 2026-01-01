# Elasticsearch Research

Last updated: 1 January 2026

## Purpose

This directory is for method-focused research: approaches, processes, and feature capabilities that can inform our search and AI work. It is not a record of our system state, except where a minimal integration example helps explain a method.

## Structure

- `methods/` - reusable approaches and patterns (lexical + semantic + graph search, AI features, RAG, MCP).
- `system/` - system-specific notes kept for reference only, not research guidance.
- `archive/` - superseded or low-quality sources retained for traceability.

## Methods Index

- `methods/hybrid-retrieval.md` - combining lexical, semantic, and graph-friendly retrieval, plus reranking considerations.
- `methods/query-understanding-native.md` - ES-native query parsing and suggestions without custom NLP.
- `methods/ai-capabilities-elastic.md` - AI and inference features available in Elastic.
- `methods/conversational-rag.md` - conversational retrieval and RAG patterns.
- `methods/graph-elastic.md` - Elastic Graph API, significant terms, transforms, and entity-centric indexing.
- `methods/graph-elastic-neo4j.md` - when to pair Elastic with Neo4j and how to integrate.
- `methods/mcp-agent-integration.md` - MCP tool design patterns for AI agents.
- `methods/elser-ingestion-scaling.md` - ELSER ingestion throughput and backpressure practices.

## References

- `.agent/reference-docs/elasticsearch/` - local reference material for Elasticsearch APIs and features.
