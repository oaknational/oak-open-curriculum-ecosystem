# Research Documents Index

**Last Updated**: 22 October 2026
**Purpose**: Permanent record of research, discoveries, and insights  
**Maintained By**: AI agents and human collaborators

---

## How This Differs From Plans

| Document Type | Location | Nature | Purpose |
|---------------|----------|--------|---------|
| **Research** | `.agent/research/` | Permanent | Record discoveries, insights, analysis |
| **Analysis** | `.agent/analysis/` | Evidence | Hold investigations, baselines, and evidence bundles |
| **Reports** | `.agent/reports/` | Promoted | Stable audits and formal syntheses once promoted |
| **Reference** | `.agent/reference/` | Curated library | Owner-vetted, evergreen read-to-learn material — promotion-gated per [PDR-032](../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md) |
| **Plans** | `.agent/plans/` | Ephemeral | Track work in progress, acceptance criteria |
| **Prompts** | `.agent/prompts/` | Entry points | Start new sessions with context |
| **Experience** | `.agent/experience/` | Reflections | Metacognitive learnings |

**Key principle**: When a plan discovers something valuable, that discovery should be recorded in research. Plans can be archived; research persists.

---
An ADR-226-class multi-file markdown import forms one link-closed component under
`validate-markdown-links` (broken-link class `tracked-source-to-untracked-target`): no subset
of its prose is committable alone, locally or as stacked PRs. Only members carrying no
outbound relative links — assets, scanner config, an index row, a review using absolute
permalinks — stand independently (907 of 16,235 lines on the 2026-09-06 import). Such an
import is atomic under the estate's gates — "split it into smaller PRs" is not available —
and only its link-free members are a valid partial-review surface for size-capped tools.

A research package imported from outside the repository keeps the exact original bytes
(an archive) beside its readable Markdown projections, and a manifest records each file's
source and projection hashes, the source revision, the archive's identity, every link
transformation, and the authority boundary: skills, directives and code copied inside a
package are frozen evidence, never active instructions. Projections are not claimed
byte-identical: reformatting (a footnote rewritten to the repository validator's multiline
form, line endings normalised) is listed in the manifest. The worked instance is
[`agent-capacities-2026-09-09/`](agent-capacities-2026-09-09/README.md).

## Research by Topic

### Cognitive systems and structured thinking

| Document | Purpose | Key insights |
| --- | --- | --- |
| [The foundations of experimental design](cognitive-systems/structured-thinking/experimental-design-foundations.md) | Six principles with sources: an answerable question, a fair comparison, meaningful measurement, informative evidence, an honest test, a claim within the evidence; a ten-item planning record | Fairness and informativeness are separate requirements; the independent unit is what was assigned, never what produced a row; the important rules are set before the result is seen |
| [Five foundations of statistical rigour](cognitive-systems/structured-thinking/statistical-rigour-foundations.md) | Meaning, data generation, comparison and conditioning, uncertainty, error control and correction — with the five-sentence compact form for any important quantitative claim | A number is only as useful as its connection to the question; more rows do not repair bias or dependence; a claim's strength matches the evidence, and the procedure must give error a fair chance to show. The always-loaded form is the rule `one-instance-is-an-observation` |

### Adaptive capacities and agent coordination

| Document | Purpose | Key insights |
| --- | --- | --- |
| [Adaptive capacities research package](agent-capacities-2026-09-09/README.md) | Self-contained literature review, framework, editable comparison matrix, twelve experimental families and exact source archive | Distinguish capacities, mechanisms, authority and outcomes across biological, computational and institutional arrangements; proposals remain unratified research |

### Graph foundations and algorithms

| Document | Purpose | Key insights |
| --- | --- | --- |
| [TypeScript graph foundations research](typescript-graph-foundations-2026-09-07/README.md) | Dated comparison of models, TypeScript libraries, capabilities and proposed OCE outcomes, with reproducible probes and recorded evidence | Select foundations by semantics, assurance and lifecycle value; current OCE choices carry no preservation requirement. Recommendations remain research proposals. |
| [Reliable Atoms workspace shape exploration](reliable-atoms-workspace-shape-exploration-2026-09-14.md) | Concept exploration behind the owner's 2026-09-14 ruling: a declared workspace class for atoms, a blocking directory-cardinality validator, stricter tiers; the warrant home for the programme's bar element 10 | The class is a design target shaped to its parameters, never calibrated against workspaces outside it; repository shape is a validator's subject, not an ESLint rule's or a test's; the estate-wide report-only signal question is untouched |

### ✨ Oak Innovation Kit & demonstrations

Research that informs the fourth value stream's open-ended demonstration portfolio,
idea-to-evidence path, and exercised-reuse discipline. Strategy authority remains in
[`docs/strategy/`](../../docs/strategy/README.md).

| Document | Purpose | Key insights |
| --- | --- | --- |
| [innovation-kit/README.md](innovation-kit/README.md) | Local entry point for the proposed definition, dated evidence, worked scenarios, bounded investigations and historical deconstruction | The Kit as the governed, portable part of a complete product-creation system; fast and good through governed compression, explicit obligations, truthful operation and stewardship |

### Public-service AI tuition

| Document | Purpose | Key insights |
| --- | --- | --- |
| [public-service-ai-tuition/README.md](public-service-ai-tuition/README.md) | Entry point for the 17-file reconstructed tuition research collection; [AUTHORITY.md](public-service-ai-tuition/AUTHORITY.md) states what placement confers, the owner's rulings and the deltas from the imported bytes; qualified by two dated reviews, the [author-lineage review](../reports/public-service-ai-tuition/pr-66-review-2026-09-06.md) (R1 to R7) and the [independent review](../reports/public-service-ai-tuition/pr-66-independent-review-2026-09-06.md) (F1 to F9), and by the [8 September Oak curriculum-infrastructure delta](../reports/public-service-ai-tuition/oak-curriculum-infrastructure-delta-2026-09-08.md) | Service and educational design, learner profiles, inclusion, evaluation, capability proofs, engineering findings, public infrastructure and comparative research, with historical source bytes and current-state boundaries preserved |

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
| [curriculum-structure-3d-model.md](curriculum-structure-3d-model.md) | Spatial curriculum model | Three-axis metaphor for curriculum navigation |
| [ONTOLOGY_RESEARCH_SUMMARY.md](ONTOLOGY_RESEARCH_SUMMARY.md) | Ontology research summary | |
| [official-api-ontology-comparison.md](official-api-ontology-comparison.md) | API vs ontology comparison | |
| [kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md) | Graph-serving platform comparison | Direct-use baseline plus Neo4j/Stardog strengths, weaknesses, unknowns, and prototype-worthy use cases for external features |
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
| [../plans-backlog-2026-07/connecting-oak-resources/knowledge-graph-integration/README.md](../plans-backlog-2026-07/connecting-oak-resources/knowledge-graph-integration/README.md) | Collection hub | Main discovery surface for ontology integration, direct-use baseline, platform comparison, and adjacent pedagogy work |
| [../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Formal report | Cross-boundary synthesis of the official Oak ontology against current MCP orientation, direct ontology surfaces, search projections, QA, and governance/update needs |
| ../plans-old-archive/connecting-oak-resources/knowledge-graph-integration/archive/completed/ontology-repo-fresh-perspective-review.plan.md (`../plans-old-archive/connecting-oak-resources/knowledge-graph-integration/archive/completed/ontology-repo-fresh-perspective-review.plan.md`) | Future short plan | Upstream-first neutral review plan for re-reading the ontology repo and testing current local assumptions |
| ../plans-old-archive/connecting-oak-resources/knowledge-graph-integration/archive/superseded/direct-ontology-use-and-graph-serving-prototypes.plan.md (`../plans-old-archive/connecting-oak-resources/knowledge-graph-integration/archive/superseded/direct-ontology-use-and-graph-serving-prototypes.plan.md`) | Future strategic plan | Direct-use-first comparison plan for testing whether Neo4j or Stardog adds enough downstream serving value to justify adoption |

### 🤖 AI & MCP

Research on AI integration, MCP tools, and agent patterns.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[aila-modular-extraction/](aila-modular-extraction/)** | AILA prompt engineering | Lesson generation, quiz design, safety patterns (partially archived) |
| ├─ [prompt-architecture.md](aila-modular-extraction/prompt-architecture.md) | Prompt design patterns | |
| ├─ [quiz-design-principles.md](aila-modular-extraction/quiz-design-principles.md) | Quiz generation rules | |
| └─ [safety-patterns.md](aila-modular-extraction/safety-patterns.md) | Content safety | |
| [mcp_agent_guidance_provision.md](mcp_agent_guidance_provision.md) | MCP agent guidance | Tool descriptions for AI agents |
| [public-alpha-teacher-workflows-concept-exploration.md](public-alpha-teacher-workflows-concept-exploration.md) | Public-alpha teacher workflows through MCP | Natural-language entry, agent-facing workflow delivery, teacher authority, and a localisation gradient |
| [mcp-sdk-type-reuse-investigation.md](mcp-sdk-type-reuse-investigation.md) | MCP SDK types | |
| [mcp-tool-description-schema-flow-analysis.md](mcp-tool-description-schema-flow-analysis.md) | Tool schema flow | |
| [openai_claude_gemini_apps_sdk_comparison.md](openai_claude_gemini_apps_sdk_comparison.md) | AI SDK comparison | OpenAI, Claude, Gemini patterns |
| [openai-app-ui.research.md](openai-app-ui.research.md) | OpenAI app UI | |
| [openai-apps-sdk-data-return-optimization.md](openai-apps-sdk-data-return-optimization.md) | Data return patterns | |
| **[openapi-app-sdk/](openapi-app-sdk/)** | OpenAPI app SDK patterns | |
| [claude-design-integration.md](claude-design-integration.md) | Claude Design nature + Claude Code integration | MCP server (`/v1/design/mcp`), `/design-sync` (code→design), design→code handoff, DesignSync tool surface, kit-reconcile + integration proposals |

### 🧭 Developer Experience & Agentic Engineering

Research on onboarding quality, architectural enforcement, and external
developer-experience inputs used to improve Oak's agentic engineering system.

| Document | Purpose | Key Insights |
|----------|---------|--------------|
| **[agentic-engineering/](agentic-engineering/README.md)** | Agentic-engineering lane index | Theme-based routing for operating model, reviewer systems, safety/evidence, continuity, and graph-memory research |
| [agentic-engineering/concept-intake/](agentic-engineering/concept-intake/README.md) | Concept inventory and candidate intake | Research-only catalogues; entries may restate current authority, which remains governed by canonical sources |
| **[developer-experience/](developer-experience/)** | Developer-experience research index | Onboarding, enforcement, and external research guide |
| ├─ [README.md](developer-experience/README.md) | Developer-experience index | Entry point for local DX research and the local novel repair lane |
| ├─ [architectural-enforcement-playbook.md](developer-experience/architectural-enforcement-playbook.md) | Architectural enforcement | Guardrails, prompts, and enforcement posture |
| ├─ [2026-02-20-onboarding-review.md](developer-experience/2026-02-20-onboarding-review.md) | Onboarding review | Friction points and onboarding improvements |
| └─ local `developer-experience/novel/` lane | Ignored repair lane | Raw imports and sibling clean copies; stable promotion deferred |
| [concept-exploration-practice-transfer-2026-07.md](concept-exploration-practice-transfer-2026-07.md) | Concept Exploration Practice transfer | Adoption context, retained workflow, local differences, and replication guidance |
| [graphify-oak-practice-analysis.md](graphify-oak-practice-analysis.md) | Derived graph memory exploration | Navigation layer over the practice estate, explicit attribution requirement |
| [mcp_agent_guidance_provision.md](mcp_agent_guidance_provision.md) | MCP help-surface design | Start-here resources, help tools, and prompt-oriented discoverability |
| [openai_claude_gemini_apps_sdk_comparison.md](openai_claude_gemini_apps_sdk_comparison.md) | Cross-vendor app surface comparison | Host/UI surface differences around MCP and embedded experiences |
| [user-value-method-review-2026-09-26.md](user-value-method-review-2026-09-26.md) | Framing and correction record of the `user-value` skill | The service-first framing corrected to use value across levels; three complementary bases with their bridges and crosswalks; two fresh-context exercises of the earlier draft and the limits of what they show |
| [comprehensive-specification-framework-2026-09-26.md](comprehensive-specification-framework-2026-09-26.md) | Comprehensive specification framework and ratified three-skill delivery scope | Common records, profiles, connection contracts, evidence and change; Appendix E requires complete skill implementation and evals in PR #250; effectiveness remains provisional |
| [practice-nature-and-lights-on-comparison-2026-10-22.md](practice-nature-and-lights-on-comparison-2026-10-22.md) | The nature of the Practice read through PDR-143's five layers, a reviewed read of Gojko Adzic's lights-on software factory boilerplate, and a concept-level comparison | The Practice is nine systems at once (constitution, learning loop, species, family contract, organisation, epistemology, enforced doctrine, multi-vendor substrate, product); lights-on is one deterministic family-level mechanism with reproduced fail-open defects in its regulator; five concepts OCE could take, led by run records derived from per-position agent schemas |

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
| [provider-independent-capability-architecture.md](provider-independent-capability-architecture.md) | Provider-independent capabilities and storage options | Semantic capability contracts, explicit omission, provider bindings, and behaviour/state portability |
| [typescript-data-structures-and-algorithms-2026-09-07.md](typescript-data-structures-and-algorithms-2026-09-07.md) | Non-graph TypeScript data structures and algorithms | Native facilities, ecosystem candidates and open research questions; no dependency selection |
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

## Recent Additions (2026-10-22)

- [The nature of the Practice, a review of lights-on, and their comparison](practice-nature-and-lights-on-comparison-2026-10-22.md):
  the Practice read through its layers and the systems it is at once, a reproduced review of the
  lights-on software factory, and a concept-level comparison closing with the concepts each could
  take from the other.

## Recent Additions (2026-09-09)

- [Adaptive capacities research package](agent-capacities-2026-09-09/README.md):
  the complete 9 September review and experimental programme, with readable
  projections, exact archived source bytes and an explicit import-authority boundary.

## Recent Additions (2026-09-08)

- [Oak curriculum infrastructure delta](../reports/public-service-ai-tuition/oak-curriculum-infrastructure-delta-2026-09-08.md):
  supplement on the state on 2026-09-08: upstream OCE `1.178.6`, this line's
  `1.178.5` boundary at that date and Curriculum API `0.11.1`; preserves open consumer,
  reproducibility, deployment and impact gaps without rewriting the imported collection.

## Recent Additions (2026-09-07)

- [TypeScript data structures and algorithms](typescript-data-structures-and-algorithms-2026-09-07.md):
  research on the non-graph primitives available to TypeScript — the general tier of the
  foundations inquiry; its graph tier landed as the
  [TypeScript graph foundations research](typescript-graph-foundations-2026-09-07/README.md)
  (PR 72), whose section 12 hands this survey eleven graph-specific contracts.

## Recent Additions (2026-09-06)

| Document | Summary |
| --- | --- |
| [public-service-ai-tuition/README.md](public-service-ai-tuition/README.md) | Faithful import of the completed 6 September 2026 reconstruction: README, 13 substantive chapters and three assets. Historical probe files retain their pinned reproduction context; this import does not refresh their runtime findings or ratify the proposed work programme. |

## Recent Additions (2026-08-30)

| Document | Summary |
| --- | --- |
| [innovation-kit/README.md](innovation-kit/README.md) | Local router for the decomposed Innovation Kit definition, dated current-estate evidence, source/provenance map, worked analytical scenarios, bounded investigations and analysis-only web-app deconstruction. |

## Recent Additions (2026-08-13)

| Document | Summary |
| --- | --- |
| [provider-independent-capability-architecture.md](provider-independent-capability-architecture.md) | Research supporting PostgreSQL as the technology seam with Neon as one replaceable provider binding: storage-model fit, capability-specific absence, an exercised independent composition for every named provider, and separate behaviour/state portability. |

## Recent Additions (2026-07-13)

| Document | Summary |
|----------|---------|
| [concept-exploration-practice-transfer-2026-07.md](concept-exploration-practice-transfer-2026-07.md) | Practice transfer record for the Concept Exploration skill, including adoption context, conserved workflow, local differences, and replication guidance. |

## Recent Additions (2026-07-01)

| Document | Summary |
|----------|---------|
| [claude-design-integration.md](claude-design-integration.md) | Deep, source-validated research on Claude Design (nature, project/design-system model, research-preview status) and its **Claude Code integration surface** — the MCP server (`https://api.anthropic.com/v1/design/mcp`), `/design-sync` (code→design), the design→code handoff, the shared usage pool, and the DesignSync tool + `/design-sync` skill mechanics (read first-hand on disk). Includes six labelled integration/reconcile proposals grounded in first-hand-verified capabilities. Author: Frigate holds Estuary. |

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

### Importing External Research Records

An externally authored research record enters this surface as a faithful public
projection
([ADR-226](../../docs/architecture/architectural-decisions/226-agent-research-surface-for-imported-records.md)):

1. **Copy content faithfully** — a record is evidence; its documents keep their
   source bytes and stay exempt from house prose formatting.
2. **Exclude owner-directed private material** — the presumption is publication;
   only content with a specific shown harm is withheld.
3. **Reduce private-repository permalinks to plain-text citations** — keep the
   file name, line range and pinned revision; point to a stable index in the
   private source repository that resolves the citations and records the withheld
   minimum. Permalinks into public repositories stay live.
4. **Keep the record self-contained and its integrity discipline authoritative**
   — no product workspace imports from a record and a record imports no product
   workspace; any executable content is held to OCE gates, and only
   dependency-free leaf packages are registered in the workspace.

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
