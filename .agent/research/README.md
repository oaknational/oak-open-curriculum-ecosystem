# Research Documents Index

**Last Updated**: 19 April 2026  
**Purpose**: Permanent record of research, discoveries, and insights  
**Maintained By**: AI agents and human collaborators

---

## How This Differs From Plans

| Document Type | Location | Nature | Purpose |
|---------------|----------|--------|---------|
| **Research** | `.agent/research/` | Permanent | Record discoveries, insights, analysis |
| **Analysis** | `.agent/analysis/` | Evidence | Hold investigations, baselines, and evidence bundles |
| **Reports** | `.agent/reports/` | Promoted | Stable audits and formal syntheses once promoted |
| **Reference** | `.agent/reference/` | Permanent | Long-lived supporting material for agents and developers (not ADRs) |
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
| **[elasticsearch/](elasticsearch/)** | ES research index | Methods, system notes, and feature studies |
| ├─ [README.md](elasticsearch/README.md) | ES research index | Entry point for methods/features/system |
| ├─ [methods/hybrid-retrieval.md](elasticsearch/methods/hybrid-retrieval.md) | Hybrid retrieval | RRF vs linear retriever, query routing, reranking |
| ├─ [methods/query-understanding-native.md](elasticsearch/methods/query-understanding-native.md) | Query understanding | Suggestions, phonetic matching, synonyms |
| ├─ [methods/ai-capabilities-elastic.md](elasticsearch/methods/ai-capabilities-elastic.md) | Elastic AI features | Reranking and LLM query expansion |
| ├─ [methods/search-operations-governance.md](elasticsearch/methods/search-operations-governance.md) | Search operations | Synonym lifecycle, value scoring, curation |
| ├─ [methods/evaluation-quality-gates.md](elasticsearch/methods/evaluation-quality-gates.md) | Evaluation | Stratified query sets, MRR bands |
| ├─ [system/curriculum-schema-field-analysis.md](elasticsearch/system/curriculum-schema-field-analysis.md) | Field analysis | Bulk-only fields, proposed indices |
| └─ [system/graph-rag-integration-vision.md](elasticsearch/system/graph-rag-integration-vision.md) | Graph/RAG vision | Instance graph + RAG layers |

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

### Companion Surfaces Outside Research

These are not research artefacts, but they are important adjacent documents for
the ontology lane.

| Surface | Type | Why it matters |
|---------|------|----------------|
| [../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Formal report | Cross-boundary synthesis of the official Oak ontology against current MCP orientation, direct ontology surfaces, search projections, QA, and governance/update needs |
| [../plans/kgs-and-pedagogy/future/ontology-repo-fresh-perspective-review.plan.md](../plans/kgs-and-pedagogy/future/ontology-repo-fresh-perspective-review.plan.md) | Future short plan | Upstream-first neutral review plan for re-reading the ontology repo and testing current local assumptions |

### 🤖 AI & MCP

Research on AI integration, MCP tools, and agent patterns.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[aila-modular-extraction/](aila-modular-extraction/)** | AILA prompt engineering | Lesson generation, quiz design, safety patterns (partially archived) |
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

### 🧭 Developer Experience & Agentic Engineering

Research on onboarding quality, architectural enforcement, and external
developer-experience inputs used to improve Oak's agentic engineering system.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[agentic-engineering/](agentic-engineering/README.md)** | Agentic-engineering lane index | Theme-based routing for operating model, reviewer systems, safety/evidence, continuity, and graph-memory research |
| **[developer-experience/](developer-experience/)** | Developer-experience research index | Onboarding, enforcement, and external research guide |
| ├─ [README.md](developer-experience/README.md) | Developer-experience index | Entry point for local DX research and the local novel repair lane |
| ├─ [architectural-enforcement-playbook.md](developer-experience/architectural-enforcement-playbook.md) | Architectural enforcement | Guardrails, prompts, and enforcement posture |
| ├─ [2026-02-20-onboarding-review.md](developer-experience/2026-02-20-onboarding-review.md) | Onboarding review | Friction points and onboarding improvements |
| └─ local `developer-experience/novel/` lane | Ignored repair lane | Raw imports and sibling clean copies; stable promotion deferred |
| [graphify-oak-practice-analysis.md](graphify-oak-practice-analysis.md) | Derived graph memory exploration | Navigation layer over the practice estate, explicit attribution requirement |
| [mcp_agent_guidance_provision.md](mcp_agent_guidance_provision.md) | MCP help-surface design | Start-here resources, help tools, and prompt-oriented discoverability |
| [openai_claude_gemini_apps_sdk_comparison.md](openai_claude_gemini_apps_sdk_comparison.md) | Cross-vendor app surface comparison | Host/UI surface differences around MCP and embedded experiences |

### 🔐 Authentication & Security

Research on auth patterns and security.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[auth/clerk-production-migration.md](auth/clerk-production-migration.md)** | **Clerk production migration** | **Shared vs independent instance decision, phased social provider rollout, access control strategy, operational security controls, go-live gates** |
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

## Recent Additions (2026-04-06)

| Document | Summary |
|----------|---------|
| [../reference/README.md](../reference/README.md) | Scoped SDK `reference/*.json` ignore; long-lived agent reference under `.agent/reference/`; machine-local drops are intentionally not documented in tracked files (see root `.gitignore`). |

## Recent Additions (2026-04-03)

| Document | Summary |
|----------|---------|
| [developer-experience/README.md](developer-experience/README.md) | Developer-experience topic index covering local doctrine, onboarding, and the local ignored novel repair lane. |

External protocol/interoperability report recoveries currently remain in the
ignored `developer-experience/novel/` lane as local clean copies pending a
later promotion session into stable tracked homes.

## Recent Additions (2026-02-22)

| Document | Summary |
|----------|---------|
| [auth/clerk-production-migration.md](auth/clerk-production-migration.md) | Comprehensive research on migrating Clerk from development to production for public alpha. Covers shared vs independent instance decision, phased social provider rollout, access control strategy, operational security controls, edge rate limiting, and go-live gates. Reviewed by architecture, security, and docs specialists. |

## Earlier Additions (2025-12-26 & 2025-12-27)

| Document | Summary |
|----------|---------|
| [elasticsearch/system/graph-rag-integration-vision.md](elasticsearch/system/graph-rag-integration-vision.md) | Property graph vs instance graph, transcript mining opportunities, unified export guidance |
| [elasticsearch/system/curriculum-schema-field-analysis.md](elasticsearch/system/curriculum-schema-field-analysis.md) | Untapped bulk data, proposed reference indices (glossary, misconceptions, NC coverage, prerequisites) |
| [elasticsearch/methods/search-operations-governance.md](elasticsearch/methods/search-operations-governance.md) | Synonym value scoring, candidate pipelines, precision audit notes |

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

The vocab-gen pipeline has generated 5 graph datasets:

| Dataset | Content | Format |
|---------|---------|--------|
| `thread-progression-data.ts` | 164 threads across 14 subjects | `as const` TS file |
| `prerequisite-graph/` | 1,601 units, 3,408 prerequisite edges | JSON loader |
| `vocabulary-graph/` | 13,452 terms with definitions | JSON loader |
| `misconception-graph/` | 12,858 misconceptions with responses | JSON loader |
| `nc-coverage-graph/` | 7,473 NC statement mappings | JSON loader |

**Location**: `packages/sdks/oak-sdk-codegen/src/generated/vocab/`

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

- [aila-modular-extraction/](aila-modular-extraction/) (4 stale files archived to `archive/aila-modular-extraction/`)
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
| `planned/vocabulary-mining-bulk.md` | `elasticsearch/methods/search-operations-governance.md`, `elasticsearch/system/curriculum-schema-field-analysis.md` |
| `archive/completed/four-retriever-implementation.md` | `elasticsearch/methods/hybrid-retrieval.md` |

### From Prompts to Research

| Prompt | References Research |
|--------|---------------------|
| `semantic-search.prompt.md` | `elasticsearch/` folder |

---

## Maintenance

This index should be updated when:
- New research documents are created
- Research is reorganized
- Major discoveries are made

**Last reviewed**: 6 April 2026
