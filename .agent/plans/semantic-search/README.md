# Semantic Search Planning Documents

**Git Version**: See `git log` for commit history  
**Status**: Active Planning - Ready for Implementation  
**Last Consolidated**: 2025-12-08

---

## 🎯 Start Here

### For New Implementation Sessions

**Read these in order**:

1. **`.agent/prompts/semantic-search/semantic-search.prompt.md`** ⭐ START HERE
   - Complete context for fresh chat sessions
   - Prerequisites, environment setup, current state
   - Quick start guide for Phase 1A

2. **`maths-ks4-implementation-plan.md`** 📋 MAIN PLAN
   - Complete implementation roadmap
   - All 5 phases with detailed tasks
   - TDD approach, ADRs, success criteria

3. **Foundation Documents** (MUST READ)
   - `.agent/directives-and-memory/rules.md`
   - `.agent/directives-and-memory/schema-first-execution.md`
   - `.agent/directives-and-memory/testing-strategy.md`

---

## Document Hierarchy

### Core Documents (Flat Structure)

| Document                               | Purpose                                                                                   | When to Use                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation plan for Maths KS4 vertical slice with all ES Serverless features | Primary backend/search implementation        |
| **`search-ui-plan.md`**                | Frontend implementation: components, theme, fixtures, accessibility, Playwright tests     | UI/frontend implementation                   |
| **`data-completeness-policy.md`**      | Policy on what data we upload in full vs summarize                                        | Reference for ingestion decisions            |
| **`es-serverless-feature-matrix.md`**  | Feature adoption tracking matrix with impact/cost/risk analysis                           | Progress tracking and feature prioritization |

### Research Documents

| Document                                                                               | Purpose                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------- |
| **`.agent/research/elasticsearch/curriculum-schema-field-analysis.md`**                | Untapped API schema fields for search (NEW) |
| **`.agent/research/elasticsearch/natural-language-search-with-es-native-features.md`** | ES-native NLP capabilities                  |

### Archive

| Directory                 | Contents                                     |
| ------------------------- | -------------------------------------------- |
| **`archive/superseded/`** | Superseded plans (historical reference only) |
| **`archive/completed/`**  | Completed work from earlier phases           |

---

## Implementation Overview

### Strategic Goal

Create a **production-ready demo** of ES Serverless capabilities using Maths KS4 as a complete vertical slice.

### Why Maths KS4?

- ✅ Maximum complexity (tiers, pathways, exam boards, threads)
- ✅ High teacher value (exam preparation)
- ✅ Complete feature coverage (all search capabilities)
- ✅ Manageable scope (~100-200 API requests, 10-20 minutes)
- ✅ Scalable patterns for full curriculum

### What We're Building

- **Three-way hybrid search**: BM25 + ELSER + E5 Dense Vectors (Elastic-native, no external API)
- **AI-powered relevance**: Elastic Native ReRank, NER entity extraction
- **Knowledge graph**: ES Graph API for curriculum relationships
- **RAG infrastructure**: Chunked transcripts, ontology grounding, ES Playground
- **Advanced features**: Learning to Rank foundations, multi-vector search
- **Curriculum metadata**: Index all available API schema fields (priorKnowledge, nationalCurriculum, threads, quizzes, outcomes)

### Key Insight: Untapped Schema Fields

The Oak API provides **rich pedagogical metadata** not currently indexed. Phase 2B will leverage:

- `priorKnowledgeRequirements` - Prerequisite search and graph edges
- `nationalCurriculumContent` - Standards alignment search
- `threads` - Curriculum coherence graph
- `pupilLessonOutcome` - "I can..." outcome search
- `starterQuiz`, `exitQuiz` - Assessment content search

**See**: `.agent/research/elasticsearch/curriculum-schema-field-analysis.md` for complete analysis.

### Key Decision: Elastic-Native Dense Vectors (2025-12-07)

Chose `.multilingual-e5-small-elasticsearch` (384-dim) over OpenAI `text-embedding-3-small` (1536-dim):

- **No external API dependencies** for core search functionality
- **Included in ES Serverless subscription** (resource-based billing)
- **PRECONFIGURED** - ready to use immediately
- **Lower latency** - runs on ML nodes within cluster

See ADR-071 for full decision rationale.

---

## Implementation Phases

| Phase  | Duration | Focus                            | Key Features                                               |
| ------ | -------- | -------------------------------- | ---------------------------------------------------------- |
| **1A** | 2-3 days | Three-Way Hybrid + Dense Vectors | E5 dense vectors (Elastic-native), three-way RRF           |
| **1B** | 2-3 days | Relevance Enhancement            | Elastic Native ReRank, filtered kNN, query rules           |
| **1C** | 1 day    | Maths KS4 Ingestion              | Full content with enhanced schema                          |
| **2A** | 3-4 days | Entity Extraction & Graph        | NER, Graph API, enrich processor                           |
| **2B** | 2-3 days | Reference Indices & Threads      | 5 new indices, thread support                              |
| **3**  | 4-5 days | RAG Infrastructure               | ES Playground, semantic_text, chunking, Elastic Native LLM |
| **4**  | 5-6 days | Knowledge Graph                  | Triple store, entity resolution                            |
| **5**  | 3-4 days | Advanced Features                | LTR foundations, multi-vector                              |

**Total**: 4-5 weeks (22-29 days)

---

## Foundation Document Alignment

All work MUST adhere to:

### Schema-First (Mandatory)

- All types, Zod schemas, ES mappings flow from field definitions
- Run `pnpm type-gen` after field definition changes
- Never edit generated files
- Update generators only

### TDD at ALL Levels (Mandatory)

- Write tests FIRST (RED → GREEN → REFACTOR)
- Unit tests: Pure functions, no IO, no mocks
- Integration tests: Code units together, simple mocks injected
- E2E tests: Running system, real behavior

### Documentation (Mandatory)

- TSDoc with examples on all functions
- Authored docs in `apps/oak-open-curriculum-semantic-search/docs/`
- ADRs for architectural decisions
- Update continuation prompt with new capabilities

---

## Quality Gates

**ALL phases must pass ALL gates**:

```bash
# From repo root, one at a time, with no filters
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**No exceptions. All gates must be green.**

---

## Success Criteria

### Technical

- [ ] 23 new ES features integrated
- [ ] 15 ADRs written (071-085)
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] Zero type shortcuts
- [ ] All quality gates passing

### Search Quality

- [ ] MRR: 0.65 → 0.80 (+23%)
- [ ] NDCG@10: 0.70 → 0.85 (+21%)
- [ ] Zero-hit rate: 15% → <5%
- [ ] p95 latency: <300ms

### Business

- [ ] Impressive stakeholder demo
- [ ] Production-ready code
- [ ] Scalable to full curriculum
- [ ] <$100/month operational cost

---

## Current System State

**Last verified**: See `git log` for latest updates

### Completed ✅

- ES Serverless deployed with 6 indexes
- ELSER sparse embeddings configured
- SDK rate limiting implemented (5 req/sec, ADR-070)
- Synonym set `oak-syns` with 68 rules
- Field definitions architecture (single source of truth, ADR-067)
- Per-index completion contexts (ADR-068)
- Systematic ingestion with progress tracking (ADR-069)
- All 10 quality gates passing (1,310+ tests)
- Test data: English KS2 (~350 documents)

### Phase 1A Complete ✅ (2025-12-08)

- ✅ E5 endpoint verified (`.multilingual-e5-small-elasticsearch` PRECONFIGURED)
- ✅ Dense vector field definitions added (384-dim)
- ✅ ES field overrides configured
- ✅ Extraction functions implemented (tier, exam_board, pathway)
- ✅ Dense vector generation implemented
- ✅ Three-way RRF query builders implemented
- ✅ All quality gates passing
- ✅ ADRs 071-074 written

### Ready for Phase 1B/1C ⏭️

- 🔄 **Phase 1B**: Elastic Native ReRank, filtered kNN (2-3 days)
- 🔄 **Phase 1C**: Maths KS4 ingestion (1 day)
- 🔄 E2E test proving three-way beats two-way (requires Phase 1C)

---

## CLI Quick Reference

### Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search

# Check ES status
pnpm es:status

# Ingest Maths KS4 (Phase 1C)
pnpm es:ingest-live --subject maths --keystage ks4 --verbose

# Systematic ingestion (all combinations, 17-24 hours)
pnpm ingest:all
pnpm ingest:progress
```

### Elasticsearch

```bash
# Kibana
open https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud

# Reset indexes (destructive)
npx tsx src/lib/elasticsearch/setup/cli.ts reset
```

### Development

```bash
# Enable Redis caching
pnpm redis:up
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --dry-run
```

---

## Getting Help

### For Implementation Questions

1. Review `maths-ks4-implementation-plan.md` for backend/search phase details
2. Review `search-ui-plan.md` for frontend implementation
3. Check `semantic-search.prompt.md` for TDD examples and quick start
4. Re-read foundation documents for principles
5. Review relevant ADRs in `docs/architecture/architectural-decisions/`

### For Architecture Questions

1. Check existing ADRs (067-074 currently)
2. Review foundation documents
3. Consult `es-serverless-feature-matrix.md` for feature decisions

### For Fresh Chat Sessions

1. Start with `.agent/prompts/semantic-search/semantic-search.prompt.md`
2. It contains ALL context needed to continue work
3. Points to this README and main plan

---

## Archive Policy

Documents are archived when:

- **Consolidated**: Multiple plans merged into one
- **Superseded**: Newer plan replaces older one
- **Completed**: Work finished and documented in ADRs

Archive directories:

- `archive/superseded-YYYY-MM/` - Superseded plans by month
- `archive/completed/` - Completed work
- `archive/` - General archive

Archived documents are kept for historical reference but not used for active work.

---

## Document Maintenance

### When to Update

- **After each phase completes**: Update status, mark TODOs complete
- **When plans change**: Archive old version, create new with git commit reference
- **After ADR creation**: Link ADR in relevant plan sections
- **After docs creation**: Add to references section

### Version Control

- Use git commit hashes, not dates/version numbers in document headers
- Archive old documents with descriptive directory names (superseded-YYYY-MM)
- Keep one clear entry point (semantic-search.prompt.md)
- Keep one main plan (maths-ks4-implementation-plan.md)

---

**Ready to start? Read `.agent/prompts/semantic-search/semantic-search.prompt.md` next.**

---

**End of README**
