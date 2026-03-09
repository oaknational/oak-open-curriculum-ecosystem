# Semantic Search Research Index

**Last Updated**: 7 March 2026

---

## Purpose

This index is the navigation entry point for boundary-local semantic-search
research. These `*.research.md` documents are **evidence and analysis**, not
execution plans. They answer focused questions, surface constraints, and feed
the executable work in `active/`, `current/`, and `future/`.

Use this index when you need to understand:

- which curriculum signals exist in the bulk pipeline
- which signals are indexed, mined, flattened, or ignored
- where richer vocabulary, glossary, and synonym surfaces could come from
- how thread and sequence documents could become more useful search targets
- how graph-like curriculum assets could be operationalised in Elasticsearch
- how the Oak ontology in Neo4j should complement Elasticsearch search surfaces

---

## Reading Order

1. [Curriculum Asset Opportunity Map](curriculum-asset-opportunity-map.research.md)
2. [Elasticsearch, Neo4j, and Oak Ontology Synthesis](elasticsearch-neo4j-oak-ontology-synthesis.research.md)
3. [Bulk Metadata Opportunities](future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md)
4. [Vocabulary, Glossary, and Mining Surfaces](future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md)
5. [Thread and Sequence Derived Surfaces](future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md)
6. [Learning Graph Surfaces](future/04-retrieval-quality-engine/learning-graph-surfaces.research.md)

---

## Research Map

| Document | Boundary | Focus | Feeds |
|----------|----------|-------|-------|
| [curriculum-asset-opportunity-map.research.md](curriculum-asset-opportunity-map.research.md) | Cross-cutting | Executive synthesis, priority stack, boundary map | Roadmap and promotion decisions |
| [elasticsearch-neo4j-oak-ontology-synthesis.research.md](elasticsearch-neo4j-oak-ontology-synthesis.research.md) | Cross-cutting | Canonical synthesis of Elasticsearch, Neo4j, and ontology opportunities with real links | [oak-ontology-graph-opportunities.strategy.md](oak-ontology-graph-opportunities.strategy.md), graph-related promotion decisions |
| [bulk-metadata-opportunities.research.md](future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) | 03 vocabulary and semantic assets | Lesson/unit signal audit, bulk ingestion call chain, unused fields | [vocabulary-mining.md](future/03-vocabulary-and-semantic-assets/vocabulary-mining.md), [definition-retrieval.md](future/04-retrieval-quality-engine/definition-retrieval.md), [document-relationships.md](future/04-retrieval-quality-engine/document-relationships.md) |
| [vocabulary-glossary-and-mining-surfaces.research.md](future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) | 03 vocabulary and semantic assets | Domain vocabulary, glossary surfaces, synonyms, keyword identity | [vocabulary-mining.md](future/03-vocabulary-and-semantic-assets/vocabulary-mining.md), [natural-language-paraphrases.md](future/03-vocabulary-and-semantic-assets/natural-language-paraphrases.md), [definition-retrieval.md](future/04-retrieval-quality-engine/definition-retrieval.md) |
| [thread-sequence-derived-surfaces.research.md](future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | 04 retrieval quality engine | Derived thread/sequence signals, summaries, suggestions, small-index constraints | [document-relationships.md](future/04-retrieval-quality-engine/document-relationships.md), [modern-es-features.md](future/04-retrieval-quality-engine/modern-es-features.md) |
| [learning-graph-surfaces.research.md](future/04-retrieval-quality-engine/learning-graph-surfaces.research.md) | 04 retrieval quality engine | Prerequisite, thread, glossary, misconception, and coverage graph surfaces | [document-relationships.md](future/04-retrieval-quality-engine/document-relationships.md), [definition-retrieval.md](future/04-retrieval-quality-engine/definition-retrieval.md), future relationship work |

---

## Cross-Cutting Themes

| Theme | Primary Document | Important Companion |
|-------|------------------|---------------------|
| Elasticsearch and Neo4j working together around the Oak ontology | [Elasticsearch, Neo4j, and Oak Ontology Synthesis](elasticsearch-neo4j-oak-ontology-synthesis.research.md) | [oak-ontology-graph-opportunities.strategy.md](oak-ontology-graph-opportunities.strategy.md) |
| Bulk lesson and unit metadata not yet fully used | [Bulk Metadata Opportunities](future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) | [ADR-089](../../../docs/architecture/architectural-decisions/089-index-everything-principle.md) |
| Richer domain vocabulary and glossary assets | [Vocabulary, Glossary, and Mining Surfaces](future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) | [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) |
| Thread and sequence search becoming more than title search | [Thread and Sequence Derived Surfaces](future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | [ADR-110](../../../docs/architecture/architectural-decisions/110-thread-search-architecture.md) |
| High-level learning graph through the curriculum | [Learning Graph Surfaces](future/04-retrieval-quality-engine/learning-graph-surfaces.research.md) | [document-relationships.md](future/04-retrieval-quality-engine/document-relationships.md) |

---

## Contract

- `*.research.md` documents capture evidence, opportunity mapping, and
  constraints.
- `*.md` plan files in `future/` remain the promotion and execution backlog.
- `active/` and `current/` remain the authoritative execution lanes.

If a research finding becomes a committed delivery, promote it into a plan
rather than turning the research document into an execution checklist.
