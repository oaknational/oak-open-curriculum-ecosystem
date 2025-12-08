# Semantic Search Planning Documents

**Git Version**: See `git log` for commit history  
**Status**: Active Implementation - Maths KS4 Ingested ✅, RRF API Update Required 🔴  
**Last Updated**: 2025-12-08

---

## 🎯 Strategic Goals

### Current Focus: Maths KS4 Proof of Concept

Validate Elasticsearch Serverless as the platform for intelligent curriculum search using Maths KS4 as a complete vertical slice.

### Future Roadmap

| Milestone             | Scope                                       | Purpose                                         |
| --------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Maths KS4**         | Single subject, single key stage            | Prove architecture, validate search quality     |
| **Full Maths**        | All Maths content (KS1-KS4)                 | Scale within subject, handle curriculum breadth |
| **All Subjects**      | Complete Oak Curriculum (~340 combinations) | Full production deployment                      |
| **Advanced Features** | RAG, knowledge graph, personalisation       | Differentiated teacher experience               |

**Full Curriculum Ingestion**: Given the **Oak API 1000 requests/hour limit**, systematic ingestion of all 340 subject/keystage combinations requires 17-24 hours. The ingestion infrastructure (`pnpm ingest:all`, `pnpm ingest:progress`) is ready for this when validation is complete.

---

## 🎯 Start Here

### For New Implementation Sessions

**Read these in order**:

1. **`.agent/prompts/semantic-search/semantic-search.prompt.md`** ⭐ START HERE
   - Complete context for fresh chat sessions
   - Prerequisites, environment setup, current state
   - Quick start guide for Phase 1

2. **`maths-ks4-implementation-plan.md`** 📋 MAIN BACKEND PLAN
   - Complete implementation roadmap
   - All phases with detailed tasks
   - TDD approach, ADRs, success criteria

3. **`search-ui-plan.md`** 📋 MAIN FRONTEND PLAN
   - React components, design system
   - Fixture testing, accessibility
   - Responsive layout

4. **Foundation Documents** (MUST READ)
   - `.agent/directives-and-memory/rules.md`
   - `.agent/directives-and-memory/schema-first-execution.md`
   - `.agent/directives-and-memory/testing-strategy.md`

---

## Implementation Philosophy: Simpler First

**First Question**: Could it be simpler without compromising quality?

We implement the **simpler approach first** and only add complexity when it delivers measurable value:

| Phase  | Focus                       | Complexity | Purpose                      |
| ------ | --------------------------- | ---------- | ---------------------------- |
| **1**  | Two-way hybrid (BM25+ELSER) | Low        | Establish baseline, validate |
| **2**  | Evaluate dense vectors      | Medium     | Only if Phase 1 insufficient |
| **3+** | Advanced features           | High       | ReRank, filtered kNN, RAG    |

**Key Insight**: Don't build three-way hybrid infrastructure before validating that two-way is insufficient.

---

## Document Hierarchy

### Implementation Plans

| Document                               | Purpose                                                                                   | When to Use                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation plan for Maths KS4 vertical slice with all ES Serverless features | Primary backend/search implementation |
| **`search-ui-plan.md`**                | Frontend implementation: components, theme, fixtures, accessibility, Playwright tests     | UI/frontend implementation            |

### Reference Documents

| Document                                        | Purpose                                                |
| ----------------------------------------------- | ------------------------------------------------------ |
| **`reference-data-completeness-policy.md`**     | Policy on what data we upload in full vs summarise     |
| **`reference-es-serverless-feature-matrix.md`** | Feature adoption tracking matrix with impact/cost/risk |

### Research Documents

| Document                                                                               | Purpose                               |
| -------------------------------------------------------------------------------------- | ------------------------------------- |
| **`.agent/research/elasticsearch/curriculum-schema-field-analysis.md`**                | Untapped API schema fields for search |
| **`.agent/research/elasticsearch/natural-language-search-with-es-native-features.md`** | ES-native NLP capabilities            |

### Archive

| Document/Directory                                                                        | Contents                                    |
| ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| **`.agent/prompts/semantic-search/archive/`**                                             | Archived prompts and completed phase guides |
| **`.agent/prompts/semantic-search/archive/phase-1a-complete.md`**                         | Phase 1A infrastructure TDD examples        |
| **`.agent/prompts/semantic-search/archive/curriculum-vocabulary-checkpoint-RESOLVED.md`** | Resolved checkpoint from Phase 1A           |

---

## Implementation Overview

### Strategic Goal

Create a **production-ready demo** of ES Serverless capabilities using Maths KS4 as a complete vertical slice, starting with the simplest approach that delivers value.

### Why Maths KS4?

- ✅ Maximum complexity (tiers, pathways, exam boards, threads)
- ✅ High teacher value (exam preparation)
- ✅ Complete feature coverage (all search capabilities)
- ✅ Manageable scope (~100-200 API requests, 10-20 minutes)
- ✅ Scalable patterns for full curriculum

### Implementation Phases

| Phase  | Duration | Focus                       | Status                    | Key Features                            |
| ------ | -------- | --------------------------- | ------------------------- | --------------------------------------- |
| **1A** | ✅ Done  | Maths KS4 Ingestion         | ✅ Complete (2025-12-08)  | 173 docs, dense vectors, ELSER          |
| **1B** | 0.5 days | RRF API Update              | 🔴 Blocker (current)      | Update to ES 8.11+ retriever API        |
| **1C** | 0.5 days | Baseline Metrics            | ⏭️ Next (after 1B)        | MRR, NDCG@10, zero-hit, latency         |
| **2**  | 0.5 days | Evaluate Three-Way          | 🔵 Optional (if 1C fails) | Only if two-way insufficient            |
| **3**  | 2-3 days | Relevance Enhancement       | ⏸️ Future                 | Elastic Native ReRank, filtered kNN     |
| **4**  | 3-4 days | Entity Extraction & Graph   | ⏸️ Future                 | NER models, Graph API, enrich processor |
| **5**  | 2-3 days | Reference Indices & Threads | ⏸️ Future                 | 5 new indices, thread support           |
| **6**  | 4-5 days | RAG Infrastructure          | ⏸️ Future                 | ES Playground, semantic_text, chunking  |
| **7**  | 5-6 days | Knowledge Graph             | ⏸️ Future                 | Triple store, entity resolution         |
| **8**  | 3-4 days | Advanced Features           | ⏸️ Future                 | LTR foundations, multi-vector           |

**Note**: Phases 3+ only proceed after Phase 1C baseline is established and validated.

---

## Current System State

**Last verified**: 2025-12-08 (See `git log` for latest updates)

### Phase 1A Complete ✅

**Maths KS4 Ingestion** (2025-12-08):

- ✅ **100 lessons** indexed with ELSER semantic_text
- ✅ **36 units** indexed
- ✅ **36 unit rollups** indexed with dense vectors
- ✅ **1 sequence facet** indexed
- ✅ **Total: 173 documents**
- ✅ Dense vectors generated successfully (384-dim E5)
- ✅ Basic BM25 search validated
- ✅ All ES mappings compatible with app definitions
- ℹ️ Programme factors defined but not populated (expected)

**Infrastructure Complete**:

- ✅ ES Serverless deployed (ES 8.11.0) with 6 indexes
- ✅ ELSER sparse embeddings configured (`.elser-2-elasticsearch`)
- ✅ Dense vector generation working (`.multilingual-e5-small-elasticsearch`)
- ✅ SDK rate limiting (5 req/sec, ADR-070)
- ✅ Synonym set `oak-syns` with 68 rules
- ✅ Field definitions architecture (ADR-067)
- ✅ Per-index completion contexts (ADR-068)
- ✅ Systematic ingestion (ADR-069)
- ✅ Two-way RRF query builders (BM25 + ELSER) - **needs API update**
- ✅ Three-way RRF query builders (BM25 + ELSER + Dense) - **needs API update**
- ✅ Tier, exam_board, pathway field extraction
- ✅ ADRs 071-074 written
- ✅ All 10 quality gates passing (1,310+ tests)

### Current Blocker 🔴

**RRF API Update Required**:

- 🔴 RRF query builders use deprecated `rank` API
- 🔴 ES 8.11+ requires new `retriever` API
- 🔴 Blocking two-way hybrid testing

**Files to Update**:

- `apps/.../hybrid-search/rrf-query-builders.ts`
- `apps/.../hybrid-search/rrf-query-builders-three-way.ts`

### Next: Phase 1B (RRF API) → Phase 1C (Metrics) ⏭️

- 🔄 Fix RRF API deprecation
- 🔄 Test two-way hybrid search
- 🔄 Establish baseline metrics
- 🔄 Decide: two-way vs three-way

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
- E2E tests: Running system, real behaviour

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

### Phase 1A: Data Ingestion ✅ COMPLETE

- [x] Maths KS4 ingested (100 lessons, 36 units, 36 rollups)
- [x] Dense vectors generated
- [x] Basic BM25 search validated
- [x] All quality gates passing

### Phase 1B: RRF API Update (Current)

- [ ] Research ES 8.11+ `retriever` API syntax
- [ ] Update two-way RRF query builders
- [ ] Update three-way RRF query builders
- [ ] Test with Maths KS4 data

### Phase 1C: Baseline Metrics (Next)

- [ ] Two-way hybrid search working
- [ ] Baseline metrics established (MRR, NDCG@10, zero-hit, latency)
- [ ] Search quality validated
- [ ] Decision documented: two-way sufficient OR evaluate three-way

### Full Project

- [ ] Production-ready search for Maths KS4
- [ ] MRR: > 0.70
- [ ] NDCG@10: > 0.75
- [ ] Zero-hit rate: <10%
- [ ] p95 latency: <300ms
- [ ] Impressive stakeholder demo

---

## CLI Quick Reference

### Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search

# Check ES status
pnpm es:status

# Ingest Maths KS4 (Phase 1)
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
3. Check `.agent/prompts/semantic-search/semantic-search.prompt.md` for entry point
4. Re-read foundation documents for principles
5. Review relevant ADRs in `docs/architecture/architectural-decisions/`

### For Architecture Questions

1. Check existing ADRs (067-074 currently)
2. Review foundation documents
3. Consult `reference-es-serverless-feature-matrix.md` for feature decisions

### For Fresh Chat Sessions

1. Start with `.agent/prompts/semantic-search/semantic-search.prompt.md`
2. It contains ALL context needed to continue work
3. Points to this README and implementation plans

---

## Archive Policy

Documents are archived when:

- **Consolidated**: Multiple plans merged into one
- **Superseded**: Newer plan replaces older one
- **Completed**: Work finished and documented in ADRs

Archive location:

- **`.agent/prompts/semantic-search/archive/`** - All archived prompts and completed phase guides

Current archived files:

- `phase-1a-complete.md` - Phase 1A infrastructure TDD examples and implementation guide
- `curriculum-vocabulary-checkpoint-RESOLVED.md` - Resolved checkpoint from Phase 1A

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
