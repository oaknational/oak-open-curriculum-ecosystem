# Research Documents Index

**Last Updated**: 2025-12-26  
**Purpose**: Permanent record of research, discoveries, and insights  
**Maintained By**: AI agents and human collaborators

---

## How This Differs From Plans

| Document Type | Location | Nature | Purpose |
|---------------|----------|--------|---------|
| **Research** | `.agent/research/` | Permanent | Record discoveries, insights, analysis |
| **Plans** | `.agent/plans/` | Ephemeral | Track work in progress, acceptance criteria |
| **Prompts** | `.agent/prompts/` | Entry points | Start new sessions with context |
| **Experience** | `.agent/experience/` | Reflections | Metacognitive learnings |

**Key principle**: When a plan discovers something valuable, that discovery should be recorded in research. Plans can be archived; research persists.

---

## Research by Topic

### 🔍 Semantic Search & Elasticsearch

Core research on search implementation, optimization, and curriculum vocabulary.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[semantic-search/](semantic-search/)** | Semantic search discoveries | |
| ├─ [elasticsearch-optimization-opportunities.md](semantic-search/elasticsearch-optimization-opportunities.md) | Untapped data, ES patterns, new indices | 13K glossary terms, 12K misconceptions unindexed; 10 ES patterns for education |
| └─ [vocabulary-value-analysis.md](semantic-search/vocabulary-value-analysis.md) | Value scoring for synonyms | Top 100 terms have 0% synonym coverage; Value = Freq × Foundation × Cross-Subject |
| **[elasticsearch/](elasticsearch/)** | ES implementation research | |
| ├─ [README.md](elasticsearch/README.md) | ES research index | |
| ├─ [bm25-elser-rrf-rerank.md](elasticsearch/bm25-elser-rrf-rerank.md) | Hybrid search architecture | Four-retriever design, RRF fusion |
| ├─ [hybrid-search-reranking-evaluation.md](elasticsearch/hybrid-search-reranking-evaluation.md) | Reranking evaluation | Semantic reranking initially rejected (revisit) |
| └─ [natural-language-search-with-es-native-features.md](elasticsearch/natural-language-search-with-es-native-features.md) | ES-native NLP | ELSER, semantic_text, completion |
| [search-query-optimization-research.md](search-query-optimization-research.md) | Query optimization | Phrase boosting, noise filtering |

### 📚 Curriculum & Ontology

Understanding Oak's curriculum structure and knowledge representation.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| [curriculum-ontology.md](curriculum-ontology.md) | Curriculum knowledge model | Subjects, key stages, threads, units, lessons |
| [curriculum-structure-3d-model.md](curriculum-structure-3d-model.md) | 3D curriculum visualization | Spatial metaphor for curriculum navigation |
| [ONTOLOGY_RESEARCH_SUMMARY.md](ONTOLOGY_RESEARCH_SUMMARY.md) | Ontology research summary | |
| [official-api-ontology-comparison.md](official-api-ontology-comparison.md) | API vs ontology comparison | |
| **[open-curriculum-concept-graph/](open-curriculum-concept-graph/)** | Concept graph research | |
| **[ooc/](ooc/)** | Open Curriculum research | Bulk download analysis, data quality |
| [threads-analysis.md](threads-analysis.md) | Thread structure analysis | 164 threads, cross-year progressions |
| [tier-analysis.md](tier-analysis.md) | KS4 tier analysis | Foundation/Higher patterns |
| [SEQUENCE_VS_PROGRAMME_SUMMARY.md](SEQUENCE_VS_PROGRAMME_SUMMARY.md) | Sequence vs programme | |
| [sequence-vs-programme-analysis.md](sequence-vs-programme-analysis.md) | Detailed comparison | |
| [owa-programme-slug-analysis.md](owa-programme-slug-analysis.md) | Programme slug patterns | |

### 🤖 AI & MCP

Research on AI integration, MCP tools, and agent patterns.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[aila-modular-extraction/](aila-modular-extraction/)** | AILA prompt engineering | Lesson generation, quiz design, safety patterns |
| ├─ [README.md](aila-modular-extraction/README.md) | AILA research index | |
| ├─ [prompt-architecture.md](aila-modular-extraction/prompt-architecture.md) | Prompt design patterns | |
| ├─ [quiz-design-principles.md](aila-modular-extraction/quiz-design-principles.md) | Quiz generation rules | |
| └─ [safety-patterns.md](aila-modular-extraction/safety-patterns.md) | Content safety | |
| [mcp_agent_guidance_provision.md](mcp_agent_guidance_provision.md) | MCP agent guidance | Tool descriptions for AI agents |
| [mcp-sdk-type-reuse-investigation.md](mcp-sdk-type-reuse-investigation.md) | MCP SDK types | |
| [mcp-tool-description-schema-flow-analysis.md](mcp-tool-description-schema-flow-analysis.md) | Tool schema flow | |
| [openai_claude_gemini_apps_sdk_comparison.md](openai_claude_gemini_apps_sdk_comparison.md) | AI SDK comparison | OpenAI, Claude, Gemini patterns |
| [openai-app-ui.research.md](openai-app-ui.research.md) | OpenAI app UI | |
| [openai-apps-sdk-data-return-optimization.md](openai-apps-sdk-data-return-optimization.md) | Data return patterns | |
| **[openapi-app-sdk/](openapi-app-sdk/)** | OpenAPI app SDK patterns | |

### 🔐 Authentication & Security

Research on auth patterns and security.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| [clerk-testing-patterns.md](clerk-testing-patterns.md) | Clerk testing | Test patterns for Clerk auth |
| [clerk-unified-auth-mcp-nextjs.md](clerk-unified-auth-mcp-nextjs.md) | Unified auth architecture | MCP + Next.js + Clerk |
| [http-level-auth-architecture.md](http-level-auth-architecture.md) | HTTP auth patterns | |
| [mcp-demo-auth-approach.md](mcp-demo-auth-approach.md) | MCP demo auth | |
| [mcp-inspector-oauth-testing-findings.md](mcp-inspector-oauth-testing-findings.md) | OAuth testing | |
| [chatgpt-oauth-speculation-and-guessing.md](chatgpt-oauth-speculation-and-guessing.md) | ChatGPT OAuth | |

### 🛠️ Engineering Practices

Research on code quality, testing, and architecture.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[eslint-enhancements/](eslint-enhancements/)** | ESLint configuration | |
| ├─ [index.md](eslint-enhancements/index.md) | ESLint research index | |
| └─ [roadmap-phases.md](eslint-enhancements/roadmap-phases.md) | ESLint roadmap | |
| **[error_handling/](error_handling/)** | Error handling patterns | |
| [deep-reflection-schema-first-and-findings.md](deep-reflection-schema-first-and-findings.md) | Schema-first insights | Cardinal rule learnings |
| [vi-mock-audit-report.md](vi-mock-audit-report.md) | Vitest mock audit | |
| [zod3-zod4-openapi-implementation-plan.md](zod3-zod4-openapi-implementation-plan.md) | Zod migration | |

### 🎨 UI & Components

Research on UI patterns and components.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[oak-components/](oak-components/)** | Oak component library | |
| [oak-widget-svg-implementation-analysis.md](oak-widget-svg-implementation-analysis.md) | SVG widget patterns | |
| [world-bank-graphing-demo-svg-patterns.md](world-bank-graphing-demo-svg-patterns.md) | Graphing patterns | |

### 📊 API & Data

Research on API structure and data analysis.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| [api-deep-dive-findings.md](api-deep-dive-findings.md) | API analysis | |
| [feature-parity-analysis.md](feature-parity-analysis.md) | Feature parity | SDK vs API coverage |
| [roadmap-feature-parity-alignment.md](roadmap-feature-parity-alignment.md) | Roadmap alignment | |
| [approaches-to-knowledge-strategic-report.md](approaches-to-knowledge-strategic-report.md) | Knowledge strategy | |

---

## Recent Additions (2025-12-26 & 2025-12-27)

| Document | Summary |
|----------|---------|
| [semantic-search/knowledge-graph-integration-opportunities.md](semantic-search/knowledge-graph-integration-opportunities.md) | **NEW (2025-12-27)**: Property graph vs knowledge graph distinction. Connecting bulk-mined instances to schema would create true KG. Transcript mining opportunities. Weighting functions for synonym prioritization. |
| [semantic-search/elasticsearch-optimization-opportunities.md](semantic-search/elasticsearch-optimization-opportunities.md) | Comprehensive ES optimization research: untapped bulk data (13K glossary, 12K misconceptions), 10 idiomatic ES approaches, 4 proposed new indices, 8+ novel ideas |
| [semantic-search/vocabulary-value-analysis.md](semantic-search/vocabulary-value-analysis.md) | Value scoring framework for synonym prioritization. Discovery: top 100 terms have 0% synonym coverage |

## Key Lessons Recorded (2025-12-27)

**Regex-based synonym mining is insufficient for language processing.**

The vocab-gen experiment mined 393 synonym candidates using regex patterns. After LLM agent review:
- 93% were noise (language translations, phoneme patterns, examples)
- Only 27 entries (~7%) were genuinely useful synonyms

**Key insight**: Synonym extraction requires semantic understanding. LLM-powered agents are essential for language processing tasks — regex finds text patterns, not semantic relationships.

The 27 useful synonyms were manually curated into:
- `music.ts` (NEW): semibreve/whole note, semiquaver/sixteenth note
- `computing.ts` (NEW): raster/bitmap, colour-depth/bit-depth  
- `science.ts`: artificial-selection/selective breeding
- `history.ts`: royalist/cavaliers, paleolithic/neolithic eras
- `maths.ts`: upper/lower quartile
- `education.ts`: sweating/perspiration, PPE, BSI

The regex-mined file was archived to `.agent/archive/vocab-gen/`.

---

## Generated Curriculum Data (2025-12-27)

The vocab-gen pipeline has generated 5 graph data files:

| File | Content | Size |
|------|---------|------|
| `thread-progression-data.ts` | 164 threads across 14 subjects | ~2K lines |
| `prerequisite-graph-data.ts` | 1,601 units, 3,408 prerequisite edges | ~58K lines |
| `vocabulary-graph-data.ts` | 13,349 terms with definitions | ~112K lines |
| `misconception-graph-data.ts` | 12,777 misconceptions with responses | ~121K lines |
| `nc-coverage-graph-data.ts` | NC statement coverage mapping | ~57K lines |

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/`

**MCP Tools Complete**:
- `aggregated-thread-progressions.ts` — Thread progression queries
- `aggregated-prerequisite-graph.ts` — "What comes before X?" queries

**Pending**:
- ES glossary index (13K terms)
- ES misconception index (12K entries)
- Remaining MCP tools (deferred to plan 08)

---

## How to Use This Index

### Finding Research

1. **By topic**: Browse the topic sections above
2. **By file search**: Use `grep` or IDE search
3. **From plans**: Plans should link to relevant research

### Adding Research

When you discover something valuable:

1. **Create in `.agent/research/`** — Not in plans
2. **Add to this index** — Categorize appropriately
3. **Link from plans** — Reference the research
4. **Update "Recent Additions"** — Date and summarize

### Research Document Template

```markdown
# [Topic] Research

**Created**: YYYY-MM-DD  
**Context**: [Why this research exists]  
**Status**: 🔬 RESEARCH — [Active/Complete/Superseded]

---

## Purpose

[What question does this answer?]

---

## Key Findings

[The discoveries]

---

## Related Documents

- [Link to related research]
- [Link to relevant plan]
```

---

## Subdirectory Indices

Some subdirectories have their own README files:

- [aila-modular-extraction/README.md](aila-modular-extraction/README.md)
- [elasticsearch/README.md](elasticsearch/README.md)
- [eslint-enhancements/index.md](eslint-enhancements/index.md)
- [ooc/README.md](ooc/README.md) (if exists)
- [open-curriculum-concept-graph/README.md](open-curriculum-concept-graph/README.md) (if exists)

---

## Cross-References

### From Plans to Research

Key planning documents reference research:

| Plan | References Research |
|------|---------------------|
| `02b-vocabulary-mining.md` | `semantic-search/vocabulary-value-analysis.md`, `semantic-search/elasticsearch-optimization-opportunities.md` |
| `phase-3-multi-index-and-fields.md` | `elasticsearch/bm25-elser-rrf-rerank.md` |

### From Prompts to Research

| Prompt | References Research |
|--------|---------------------|
| `semantic-search.prompt.md` | `semantic-search/` folder |

---

## Maintenance

This index should be updated when:
- New research documents are created
- Research is reorganized
- Major discoveries are made

**Last reviewed**: 2025-12-26

