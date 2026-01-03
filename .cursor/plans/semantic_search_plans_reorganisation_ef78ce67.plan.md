---
name: Semantic Search Plans Reorganisation
overview: "Reorganise the semantic search planning documents to provide clear, executable plans organised by concern boundaries. Key insight: M3 (Search Quality Optimization) must complete BEFORE bulk data analysis, which must complete BEFORE SDK extraction. ES native enhancements content merges into M3."
todos:
  - id: create-structure
    content: Create new directory structure (active/, pre-sdk-extraction/, post-sdk-extraction/, backlog/)
    status: completed
  - id: create-m3
    content: Create m3-search-quality-optimization.md in active/ (merge synonym-quality-audit + es-native-enhancements)
    status: completed
    dependencies:
      - create-structure
  - id: create-bulk-analysis
    content: Create bulk-data-analysis.md in pre-sdk-extraction/ (consolidated, M3 as prerequisite)
    status: completed
    dependencies:
      - create-structure
  - id: create-tier-plans
    content: Create tier-2-document-relationships.md and tier-3-modern-es-features.md in pre-sdk-extraction/
    status: completed
    dependencies:
      - create-structure
  - id: setup-sdk-extraction
    content: Move/update search-sdk-cli.md in sdk-extraction/ folder
    status: completed
    dependencies:
      - create-structure
  - id: create-post-sdk
    content: Create mcp-search-tool.md, tier-4-ai-enhancement.md, advanced-features.md in post-sdk-extraction/
    status: completed
    dependencies:
      - create-structure
  - id: create-backlog
    content: Populate backlog/ with reference-indices.md, resource-types.md
    status: completed
    dependencies:
      - create-structure
  - id: move-reference-docs
    content: Move IR metrics guide and data completeness policy to app/docs/
    status: completed
  - id: create-bulk-adr
    content: Create ADR for bulk data analysis architecture decisions
    status: cancelled
  - id: update-navigation
    content: Update README.md, roadmap.md, and all cross-references
    status: completed
    dependencies:
      - create-m3
      - create-bulk-analysis
      - create-tier-plans
      - create-post-sdk
  - id: cleanup
    content: Delete redundant files from planned/future/ and planned/sdk-extraction/
    status: completed
    dependencies:
      - update-navigation
---

# Semantic Search Plans Reorganisation (Revised)

## Key Sequencing Insight

The work has a clear dependency chain:

```javascript
M3: Search Quality Optimization (ground truths, synonyms, evaluation)
        ↓
Bulk Data Analysis (vocabulary, transcripts, entities)
        ↓
SDK Extraction (convert Next.js app to pure SDK + CLI)
        ↓
Post-SDK Work (MCP tools, AI enhancement, advanced features)
```

**Why this order?**

- Cannot meaningfully mine bulk data without knowing what search quality gaps exist
- Cannot extract SDK without stable, proven search functionality
- Post-SDK work requires the SDK to exist

## Proposed Directory Structure

```javascript
.agent/plans/semantic-search/
├── README.md                           # Navigation hub (update)
├── roadmap.md                          # Authoritative milestone sequence (update)
├── current-state.md                    # Current metrics snapshot (keep)
├── search-acceptance-criteria.md       # Tier definitions (keep)
│
├── active/                             # CURRENT work
│   └── m3-search-quality-optimization.md   # Ground truths + synonyms + ES tuning + benchmarks
│
├── pre-sdk-extraction/                 # Must complete before SDK extraction
│   ├── README.md                       # Overview of pre-extraction work
│   ├── bulk-data-analysis.md           # Consolidated: vocab, transcripts, entities (AFTER M3)
│   ├── tier-2-document-relationships.md    # Cross-referencing, threads
│   └── tier-3-modern-es-features.md        # RRF tuning, field boosting
│
├── sdk-extraction/                     # The migration itself
│   ├── README.md                       # Overview
│   └── search-sdk-cli.md               # The extraction plan
│
├── post-sdk-extraction/                # Requires SDK to exist first
│   ├── README.md                       # Overview
│   ├── mcp-search-tool.md              # MCP integration
│   ├── tier-4-ai-enhancement.md        # LLM pre-processing, reranking
│   └── advanced-features.md            # RAG, knowledge graph evolution
│
├── backlog/                            # No clear timeline, documented ideas
│   ├── README.md
│   ├── reference-indices.md
│   └── resource-types.md
│
└── archive/completed/                  # Existing completed plans (keep)
```



## Plan Consolidations and Merges

### 1. M3: Search Quality Optimization (active/)

**Merge these INTO M3**:

- [`synonym-quality-audit.md`](./planned/future/synonym-quality-audit.md) - main content
- [`es-native-enhancements.md`](./planned/future/es-native-enhancements.md) - ES tuning context (Phase A complete, Phase B deferred)

**M3 Phases**:

1. Comprehensive ground truths (all 17 subjects, all key stages)
2. Baseline benchmarks (per-subject, per-category MRR)
3. Synonym audit (remove noise, add high-impact terms)
4. ES tuning evaluation (query-time enhancements from es-native-enhancements)
5. Measure and iterate

**Exit criteria**: Search quality validated across full curriculum, not just KS4 Maths

### 2. Bulk Data Analysis (pre-sdk-extraction/)

**Consolidate these into ONE plan**:

- [`vocabulary-mining-bulk.md`](./planned/sdk-extraction/vocabulary-mining-bulk.md)
- [`transcript-mining.md`](./planned/future/transcript-mining.md)
- [`entity-extraction.md`](./planned/future/entity-extraction.md)

**Key points to document**:

- **Prerequisite**: M3 must complete first (need to know what quality gaps exist)
- Code lives in Search SDK runtime (separate folder for manual process)
- Types MUST come from Curriculum SDK type-gen OR Search SDK Elastic types
- API and bulk downloads are two views of SAME data
- Outputs: generated TypeScript files consumed at ingestion/runtime

### 3. Tier-based Plans (pre-sdk-extraction/)

**Tier 2: Document Relationships** - extract from:

- [`thread-based-search.md`](./planned/future/thread-based-search.md) (partially complete)
- Search acceptance criteria (Tier 2 checklist)

**Tier 3: Modern ES Features** - extract from:

- Search acceptance criteria (Tier 3 checklist)
- RRF parameter tuning notes

### 4. Post-SDK Plans (consolidated)

**Tier 4: AI Enhancement** - from:

- [`conversational-search.md`](./planned/future/conversational-search.md)
- Semantic reranking reassessment notes

**Advanced Features** - consolidate:

- [`advanced-features.md`](./planned/future/advanced-features.md)
- [`knowledge-graph-evolution.md`](./planned/future/knowledge-graph-evolution.md)
- [`mcp-graph-tools.md`](./planned/future/mcp-graph-tools.md)

## Reference Document Disposition

### Move to `apps/oak-open-curriculum-semantic-search/docs/`

- `reference-ir-metrics-guide.md` → `docs/IR-METRICS.md`
- `reference-data-completeness-policy.md` → `docs/DATA-COMPLETENESS.md`

### Delete (after extracting useful content)

- `reference-es-serverless-feature-matrix.md` - significantly outdated

## ADR Extraction Required

| Source | ADR Topic | Action ||--------|-----------|--------|| es-native-enhancements.md | Phase A query-time decisions | Extract to ADR or merge into existing || vocabulary-mining-bulk.md | Bulk analysis architecture | NEW ADR needed || Thread-based search findings | Thread context value | Check ADR-097 coverage |

## Execution Order

1. **Create directory structure** (active/, pre-sdk-extraction/, post-sdk-extraction/, backlog/)
2. **Create M3 plan** in active/ (merge synonym-quality-audit + es-native-enhancements)
3. **Create bulk-data-analysis plan** in pre-sdk-extraction/ (consolidated)
4. **Create tier plans** in pre-sdk-extraction/ (tier-2, tier-3)
5. **Move SDK extraction plan** to sdk-extraction/
6. **Create post-SDK plans** (mcp-search-tool, tier-4, advanced-features)
7. **Populate backlog/** with deferred items
8. **Move reference docs** to app/docs/
9. **Create ADRs** for architectural decisions
10. **Update navigation** (README, roadmap, cross-references)
11. **Delete redundant files** from planned/future/ and planned/sdk-extraction/

## Files to Create

| File | Content Source ||------|----------------|| `active/m3-search-quality-optimization.md` | synonym-quality-audit.md + es-native-enhancements.md || `pre-sdk-extraction/README.md` | New overview || `pre-sdk-extraction/bulk-data-analysis.md` | vocabulary-mining + transcript-mining + entity-extraction || `pre-sdk-extraction/tier-2-document-relationships.md` | thread-based-search + acceptance criteria || `pre-sdk-extraction/tier-3-modern-es-features.md` | acceptance criteria Tier 3 || `sdk-extraction/README.md` | Update existing || `post-sdk-extraction/README.md` | New || `post-sdk-extraction/mcp-search-tool.md` | New from research || `post-sdk-extraction/tier-4-ai-enhancement.md` | conversational-search.md || `post-sdk-extraction/advanced-features.md` | Consolidated || `backlog/README.md` | New || ADR for bulk analysis architecture | New |

## Files to Delete (after content extracted)

- `planned/future/` directory entirely
- `planned/sdk-extraction/` directory entirely  
- `reference-docs/reference-es-serverless-feature-matrix.md`

## Files to Move

| From | To ||------|-----|| `reference-docs/reference-ir-metrics-guide.md` | `apps/.../docs/IR-METRICS.md` || `reference-docs/reference-data-completeness-policy.md` | `apps/.../docs/DATA-COMPLETENESS.md` |

## Success Criteria

- [ ] `active/` contains only M3 (current executable work)
- [ ] Dependency chain is clear: M3 → Bulk Analysis → SDK Extraction → Post-SDK
- [ ] ES native enhancements merged into M3 (not separate plan)
- [ ] Bulk data analysis is ONE consolidated plan with M3 as prerequisite
- [ ] No plan conflates Curriculum SDK with Search SDK
- [ ] Cross-references updated throughout
- [ ] No information lost (all learnings preserved or in ADRs)
- [ ] Research methods referenced where appropriate

## Documentation Standards

Each plan must include:

- Clear scope and concern boundaries
- Prerequisites (what must complete first)
- Acceptance criteria