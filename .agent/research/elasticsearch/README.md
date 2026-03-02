# Elasticsearch Research

Last updated: 1 January 2026

## Purpose

This directory is for method-focused research: approaches, processes, and feature capabilities that can inform our search and AI work. It is not a record of our system state, except where a minimal integration example helps explain a method.

## Navigation

- Start with `methods/README.md` for reusable approaches and capability notes.
- Use `features/` for multi-view architecture and the Elastic + Neo4j future-state (derived subjects, C4 diagrams).
- Use `system/` for current system notes and decisions (CLI/SDK-only, ingestion status).

## Phasing: ES-only now, Neo4j later

- **Near-term**: ES-native, graph-adjacent features (Graph Explore API, significant terms, transforms, entity-centric indices) to improve discovery and relevance quickly.
- **Later**: Neo4j for true multi-hop traversal; export graph-derived views back into Elasticsearch to enhance retrieval and enable novel subjects.

## Structure

- `methods/` - reusable approaches and patterns (lexical + semantic + graph search, AI features, RAG, MCP).
- `features/` - multi-view architecture and derived-subject design (Elastic + Neo4j future-state).
- `system/` - system-specific notes kept for reference only, not research guidance.

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

- Internal method notes under `methods/` and system notes under `system/`.
