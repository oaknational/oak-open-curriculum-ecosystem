# Meta-Plan: Semantic Search Plan Consolidation

**Status**: 🔄 IN PROGRESS — Phases 1-4 complete, Phase 5 ready  
**Created**: 2025-12-28  
**Purpose**: Consolidate ~9,500 lines across 27 non-archive markdown files into a clear, linear path to success while preserving all key insights  
**Backup Location**: `.agent/plans/semantic-search-backup/`

---

## Objective

Transform the current sprawling plan structure into:

1. **A single authoritative roadmap** — Linear execution path with clear phases
2. **Permanent knowledge artifacts** — Insights moved to TSDoc, authored markdown, or ADRs
3. **Archived historical context** — Completed work moved to archive
4. **Zero information loss** — Every insight, discovery, and decision preserved

---

## Current State Analysis

### File Inventory (27 non-archive files, ~9,500 lines)

| Category                    | Files                              | Lines  | Content Type                                            |
| --------------------------- | ---------------------------------- | ------ | ------------------------------------------------------- |
| **Navigation/Status**       | README.md, current-state.md        | ~630   | Metrics, navigation, quality gates                      |
| **Master Plan**             | part-1-search-excellence/README.md | ~290   | Sub-plan coordination, thread search vision             |
| **Sub-Plans (Complete)**    | 01, 02a, 04                        | ~280   | Historical record of completed work                     |
| **Sub-Plans (In Progress)** | 02b, 11, 12                        | ~2,960 | Active vocabulary mining, synonym audit, pattern config |
| **Sub-Plans (Pending)**     | 03, 05-10, 13                      | ~1,760 | Future work with detailed specs                         |
| **Phase Plans**             | phase-3, phase-4, phase-9-11+      | ~2,350 | Detailed implementation plans                           |
| **Reference Docs**          | reference-docs/\*.md               | ~1,160 | Permanent reference material                            |
| **Acceptance Criteria**     | search-acceptance-criteria.md      | ~250   | Definition of done per tier                             |
| **Redirect**                | part-1-search-excellence.md        | ~40    | Historical redirect                                     |

### Key Observations

1. **Massive duplication** — Same concepts explained in 3-5 places (e.g., four-retriever architecture)
2. **Historical/future conflation** — Completed work mixed with pending tasks in same files
3. **Scattered insights** — Critical discoveries buried in plan addenda (e.g., synonym strategy inversion in 02b)
4. **Reference material trapped in plans** — IR metrics guide, ES feature matrix should be standalone
5. **Stale dependencies** — Phase 9 blocks Phase 11, but actual work order has diverged

---

## Consolidation Phases

### Phase 1: Audit and Categorize (READ-ONLY)

**Goal**: Create a complete inventory of content types across all files.

**Process**:

For each of the 27 files, extract and categorize:

1. **✅ Completed Work** — Historical record of done tasks
2. **🔄 Active Work** — Currently in-progress items
3. **📋 Pending Work** — Future tasks with specs
4. **💡 Key Insights** — Discoveries worth preserving permanently
5. **📊 Reference Data** — Reusable reference material (metrics, matrices, guides)
6. **📖 Explanatory Content** — Architecture explanations, how-tos
7. **❌ Dead Content** — Outdated, superseded, or redundant

**Output**: Detailed categorization table per file (below).

---

### Phase 2: Create Permanent Artifacts

**Goal**: Move key insights to their permanent homes.

#### 2A: Key Insights → ADRs or Research Documents

| Insight                                                         | Current Location                        | Target Location                                                         | Rationale                  |
| --------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- | -------------------------- |
| Synonym strategy is inverted (foundational terms lack coverage) | 02b Addendum D                          | `.agent/research/semantic-search/vocabulary-value-analysis.md` (exists) | Research finding, not plan |
| Definition text IS the synonym source                           | 02b Addendum D                          | Research doc + curated synonyms README                                  | Insight for future work    |
| Four-retriever ablation results                                 | phase-3                                 | ADR-082 appendix OR new ADR                                             | Architectural proof        |
| Hard queries: ELSER > Hybrid finding                            | phase-3                                 | ADR-082 or ADR-09X                                                      | Architectural decision     |
| Maths-style sequences have embedded tiers                       | phase-3                                 | ADR-080 (already done)                                                  | ✅ Already preserved       |
| IR metrics rubric (MRR interpretation)                          | phase-3 3e section                      | reference-docs/                                                         | Reference material         |
| 7 curriculum structural patterns                                | ontology-data.ts, traversal-strategy.md | ✅ Already in ontology-data.ts                                          | Already preserved          |

#### 2B: Reference Material → Standalone Docs

| Content                      | Current Location                                         | Target Location              |
| ---------------------------- | -------------------------------------------------------- | ---------------------------- |
| IR Metrics Guide             | reference-docs/reference-ir-metrics-guide.md             | Keep as-is ✅                |
| ES Serverless Feature Matrix | reference-docs/reference-es-serverless-feature-matrix.md | Keep as-is, update status ✅ |
| Data Completeness Policy     | reference-docs/reference-data-completeness-policy.md     | Keep as-is ✅                |

#### 2C: Explanatory Content → Authored Docs or TSDoc

| Content                                | Current Location   | Target Location                                       |
| -------------------------------------- | ------------------ | ----------------------------------------------------- |
| Four-retriever architecture diagram    | README.md, phase-3 | `apps/.../docs/ARCHITECTURE.md`                       |
| Vocabulary mining pipeline explanation | 02b                | `packages/.../vocab-gen/README.md` (exists partially) |
| KS4 filtering implementation           | phase-3            | ADR-080 (already comprehensive)                       |
| Graph export pattern                   | 02b                | TSDoc in write-graph-file.ts (already done)           |

---

### Phase 3: Archive Completed Work

**Goal**: Move historical completed work to archive with summary.

| File                                                  | Completed Status       | Archive Action             |
| ----------------------------------------------------- | ---------------------- | -------------------------- |
| `01-tier-1-fundamentals.md`                           | ✅ Complete 2025-12-24 | Archive with summary       |
| `02a-synonym-architecture.md`                         | ✅ Complete 2025-12-24 | Archive with summary       |
| `04-documentation-debt.md`                            | ✅ Complete 2025-12-24 | Archive with summary       |
| Parts of `phase-3-multi-index-and-fields.md` (3.0-3d) | ✅ Complete 2025-12-18 | Extract summary to archive |

**Archive Format**:

```text
archive/
├── completed-2025-12-24/
│   ├── tier-1-fundamentals-summary.md
│   ├── synonym-architecture-resolution.md
│   └── documentation-debt-fixes.md
├── completed-2025-12-18/
│   └── four-retriever-implementation.md
```

Each archive file should have:

1. What was done
2. Key decisions made
3. Link to ADR if applicable
4. Key learnings

---

### Phase 4: Create Linear Roadmap

**Goal**: Replace fragmented sub-plans with single authoritative roadmap.

**Structure of New Roadmap** (`roadmap.md`):

```markdown
# Semantic Search Roadmap

## Current State (snapshot)

- Tier 1: EXHAUSTED
- MRR: 0.614 (hard), 0.938 (standard)
- Index: Maths KS4 only (~436 lessons)

## Linear Path to Success

### Milestone 1: Complete ES Ingestion [BLOCKING]

- Dependencies: None (can start immediately)
- Tasks: [from 05-complete-data-indexing.md]

### Milestone 2: Pattern-Aware Ingestion [BLOCKING for Science KS4]

- Dependencies: Milestone 1
- Tasks: [from 12-curriculum-pattern-config.md]

### Milestone 3: Synonym Quality Audit

- Dependencies: Milestone 1 (needs all subjects indexed)
- Tasks: [from 11-synonym-quality-audit.md]

### Milestone 4: Transcript Mining

- Dependencies: Milestone 1, 3
- Tasks: [from 10-transcript-mining.md]

### Milestone 5: Vocabulary Mining (Bulk)

- Dependencies: Milestone 1, 3, 4
- Tasks: [from 02b-vocabulary-mining.md]

### Milestone 6: Thread-Based Search

- Dependencies: Milestone 1, 2
- Tasks: [from 13-thread-based-search.md]

### Milestone 7: Reference Indices

- Dependencies: Milestone 1
- Tasks: [from 06-reference-indices.md]

### Milestone 8: Resource Types

- Dependencies: Milestone 1
- Tasks: [from 07-resource-types.md]

### Milestone 9: MCP Graph Tools

- Dependencies: Milestone 5
- Tasks: [from 08-mcp-graph-tools.md]

### Milestone 10: Knowledge Graph Evolution

- Dependencies: Milestone 5, 9
- Tasks: [from 09-knowledge-graph-evolution.md]

### Milestone 11: Search SDK + CLI Extraction

- Dependencies: All above
- Tasks: [from phase-4-search-sdk-and-cli.md]

## Future (Post-SDK)

- Phase 9-11+: Entity extraction, RAG, knowledge graph, LTR
```

---

### Phase 5: Consolidate Sub-Plans

**Goal**: Reduce 13 sub-plans to essential active/pending work.

**Proposed New Structure**:

```text
.agent/plans/semantic-search/
├── roadmap.md                          # NEW: Single authoritative roadmap
├── current-state.md                    # KEEP: Snapshot of metrics
├── search-acceptance-criteria.md       # KEEP: Definition of done
├── active/                             # NEW: Currently active work
│   ├── complete-data-indexing.md       # From 05, actively blocking
│   ├── pattern-aware-ingestion.md      # From 12
│   └── synonym-quality-audit.md        # From 11
├── planned/                            # NEW: Future work specs
│   ├── transcript-mining.md            # From 10
│   ├── vocabulary-mining-bulk.md       # From 02b (reduced)
│   ├── thread-based-search.md          # From 13
│   ├── reference-indices.md            # From 06
│   ├── resource-types.md               # From 07
│   ├── mcp-graph-tools.md              # From 08
│   ├── knowledge-graph-evolution.md    # From 09
│   └── search-sdk-cli.md               # From phase-4
├── reference-docs/                     # KEEP: Reference material
│   ├── reference-ir-metrics-guide.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-data-completeness-policy.md
├── archive/                            # KEEP + EXPAND: Historical
│   ├── completed/                      # NEW
│   │   ├── tier-1-fundamentals.md
│   │   ├── synonym-architecture.md
│   │   ├── documentation-debt.md
│   │   ├── four-retriever-impl.md
│   │   └── phase-3e-es-enhancements.md
│   └── [existing archive files]
└── README.md                           # SIMPLIFIED: Just navigation
```

**Files to Delete After Consolidation**:

| File                                                       | Action                  | Reason                    |
| ---------------------------------------------------------- | ----------------------- | ------------------------- |
| `part-1-search-excellence.md`                              | Delete                  | Redirect no longer needed |
| `part-1-search-excellence/README.md`                       | Merge to roadmap.md     |                           |
| `part-1-search-excellence/01-tier-1-fundamentals.md`       | Archive                 | Complete                  |
| `part-1-search-excellence/02a-synonym-architecture.md`     | Archive                 | Complete                  |
| `part-1-search-excellence/02b-vocabulary-mining.md`        | Reduce + Move           | Keep active parts only    |
| `part-1-search-excellence/03-evaluation-infrastructure.md` | Move to planned/        |                           |
| `part-1-search-excellence/04-documentation-debt.md`        | Archive                 | Complete                  |
| `phase-3-multi-index-and-fields.md`                        | Archive 3.0-3d, keep 3e | Partial complete          |
| `phase-9-entity-extraction.md`                             | Move to planned/future/ | Future work               |
| `phase-10-reference-indices.md`                            | Merge to 06             | Duplicate                 |
| `phase-11-plus-future.md`                                  | Move to planned/future/ | Future work               |

---

### Phase 6: Update Cross-References

**Goal**: Ensure all links point to new locations.

**Files that reference semantic-search plans**:

1. `.agent/prompts/semantic-search/semantic-search.prompt.md`
2. `.agent/evaluations/README.md`
3. `docs/architecture/architectural-decisions/*.md` (various ADRs)
4. `.agent/plans/curriculum-traversal-strategy.md`
5. `.agent/plans/curriculum-structure-analysis.md`

**Update Strategy**:

- Run grep for all `semantic-search/` references
- Update to new structure
- Verify no broken links

---

### Phase 7: Verify No Information Loss

**Goal**: Confirm every piece of content is accounted for.

**Verification Checklist**:

For each original file:

- [ ] Completed work → Archived with summary
- [ ] Active work → In active/ or roadmap
- [ ] Pending work → In planned/
- [ ] Key insights → Permanent artifact (ADR, research, TSDoc)
- [ ] Reference material → reference-docs/
- [ ] Duplicate content → Single source of truth
- [ ] Dead content → Documented why removed

---

## Detailed File Analysis

### README.md (381 lines)

| Section             | Lines   | Category     | Action                            |
| ------------------- | ------- | ------------ | --------------------------------- |
| Current State       | 1-50    | Status       | Move to current-state.md (dedupe) |
| Quality Gates       | 37-52   | Reference    | Keep in README                    |
| Quick Navigation    | 55-90   | Navigation   | Simplify for new structure        |
| Strategic Direction | 93-110  | Architecture | Move to ADR-082 or keep summary   |
| Part Overview       | 128-165 | Status       | Replace with roadmap link         |
| Metrics             | 166-200 | Status       | Keep in current-state.md          |
| Ingestion Complete  | 204-214 | Status       | Keep in current-state.md          |
| Architecture        | 215-235 | Reference    | Move to architecture doc          |
| Key ADRs            | 236-245 | Reference    | Keep                              |
| Document Index      | 305-330 | Navigation   | Update for new structure          |
| Development Rules   | 332-355 | Reference    | Keep                              |
| Change Log          | 369-382 | Historical   | Archive                           |

**Unique Content to Preserve**:

- Strategic direction quote ("We should be able to do an excellent job...")
- Four-retriever architecture diagram
- "What we preserve" table

---

### current-state.md (248 lines)

| Section             | Lines   | Category    | Action                         |
| ------------------- | ------- | ----------- | ------------------------------ |
| TRUE BASELINE       | 10-40   | ✅ Complete | Archive baseline establishment |
| Quality Gate Status | 40-60   | Status      | Keep                           |
| Current Metrics     | 60-105  | Status      | Keep (primary source)          |
| What We Preserve    | 105-120 | Reference   | Keep or move to archive        |
| Index Status        | 120-145 | Status      | Keep                           |
| Ground Truth Status | 145-170 | Status      | Keep                           |
| Current Tier Status | 170-185 | Status      | Keep                           |
| Experiment Status   | 185-200 | Historical  | Archive                        |
| Next Steps          | 200-225 | Planning    | Move to roadmap                |
| Historical Context  | 225-235 | Reference   | Keep                           |

**Action**: Keep as authoritative metrics source, trim historical sections.

---

### search-acceptance-criteria.md (251 lines)

**Action**: Keep as-is — authoritative definition of done.

**Unique Content**: Per-category thresholds, intent-based exception documentation.

---

### part-1-search-excellence/README.md (290 lines)

| Section                       | Lines   | Category   | Action                               |
| ----------------------------- | ------- | ---------- | ------------------------------------ |
| Current Focus                 | 10-35   | Status     | Move to roadmap                      |
| Sub-Plans table               | 50-70   | Navigation | Replace with roadmap milestones      |
| Index EVERYTHING principle    | 70-80   | 💡 Insight | Preserve in architecture doc         |
| Thread-Based Search           | 155-185 | 📋 Pending | Already in 13-thread-based-search.md |
| Vocabulary Mining Opportunity | 190-210 | 📋 Pending | Already in 02b                       |
| New Plans section             | 235-270 | Navigation | Replace with roadmap                 |
| Change Log                    | 272-290 | Historical | Archive                              |

**Unique Content to Preserve**:

- "Index EVERYTHING" principle (→ architecture doc or ADR)
- Thread data availability table

---

### part-1-search-excellence/02b-vocabulary-mining.md (2095 lines)

**This is the largest file and needs significant reduction.**

| Section                         | Lines     | Category                 | Action                                   |
| ------------------------------- | --------- | ------------------------ | ---------------------------------------- |
| Next Step: Bulk Mining          | 17-45     | 🔄 Active                | Keep in reduced active plan              |
| Purpose: User Value             | 46-75     | 📖 Explanatory           | Move to vocab-gen README                 |
| Pipeline Architecture           | 75-155    | 📖 Explanatory           | Move to vocab-gen README                 |
| Implementation Progress         | 155-265   | ✅ Complete              | Archive completed extractors             |
| Executive Summary               | 275-290   | 📖 Explanatory           | Keep summary in active plan              |
| Core Principle: Repeatable      | 295-360   | 📖 Explanatory           | Move to vocab-gen README                 |
| Data Quality Handling           | 360-485   | 📖 Explanatory           | Move to vocab-gen README                 |
| Vision                          | 485-530   | 📖 Explanatory           | Keep summary                             |
| Audience & Context              | 530-560   | 📖 Explanatory           | Move to vocab-gen README                 |
| Proposed Indices (6)            | 635-865   | 📋 Pending               | Move to planned spec                     |
| Graph Exports for MCP           | 865-985   | 📋 Pending               | Move to 08-mcp-graph-tools               |
| Categorization Strategy         | 985-1065  | 📋 Pending               | Move to planned spec                     |
| Implementation Phases           | 1125-1425 | 📋 Pending + ✅ Complete | Split: complete→archive, pending→planned |
| Documentation Requirements      | 1425-1510 | 📖 Explanatory           | Move to vocab-gen README                 |
| Success Metrics                 | 1535-1560 | 📊 Reference             | Keep in active plan                      |
| Related Documents               | 1560-1570 | Navigation               | Update                                   |
| Pipeline Directory Structure    | 1565-1640 | 📖 Explanatory           | Already in vocab-gen (dedupe)            |
| Addendum D: Vocabulary Analysis | 1770-1895 | 💡 Key Insight           | Move to research doc (exists)            |
| Addendum E: Future Ideas        | 1960-2080 | 💡 Ideas                 | Move to research doc (exists)            |
| Addendum C: Type Preservation   | 2085-2095 | ✅ Complete              | Archive                                  |

**Reduction Target**: 2095 → ~400 lines (active work only)

**Unique Content to Preserve**:

- Value Score Framework (already in research doc)
- Synonym strategy inversion insight (already in research doc)
- Pipeline architecture diagram
- MCP tool size considerations table

---

### part-1-search-excellence/11-synonym-quality-audit.md (377 lines)

| Section             | Lines   | Category   | Action |
| ------------------- | ------- | ---------- | ------ |
| Problem Statement   | 10-40   | 📋 Pending | Keep   |
| Current State table | 40-75   | Status     | Keep   |
| Implementation Plan | 75-200  | 📋 Pending | Keep   |
| Weighting Function  | 200-250 | 📋 Pending | Keep   |
| LLM Agent Review    | 250-300 | 📋 Pending | Keep   |
| Acceptance Criteria | 300-350 | 📋 Pending | Keep   |
| Related Documents   | 350-377 | Navigation | Update |

**Action**: Keep as-is in active/ — this is well-structured pending work.

---

### part-1-search-excellence/12-curriculum-pattern-config.md (489 lines)

| Section               | Lines   | Category   | Action |
| --------------------- | ------- | ---------- | ------ |
| Problem Statement     | 10-60   | 📋 Pending | Keep   |
| Rationale             | 60-120  | 📋 Pending | Keep   |
| Assumptions           | 120-180 | 📋 Pending | Keep   |
| Implementation Plan   | 180-350 | 📋 Pending | Keep   |
| Acceptance Criteria   | 350-420 | 📋 Pending | Keep   |
| Risks/Mitigations     | 420-460 | 📋 Pending | Keep   |
| Future Considerations | 460-489 | 📋 Pending | Keep   |

**Action**: Keep as-is in active/ — this is well-structured pending work.

---

### part-1-search-excellence/13-thread-based-search.md (511 lines)

| Section                        | Lines   | Category     | Action |
| ------------------------------ | ------- | ------------ | ------ |
| Vision                         | 10-70   | 📋 Pending   | Keep   |
| Thread Data Inventory          | 70-120  | 📊 Reference | Keep   |
| Implementation Plan (5 phases) | 120-340 | 📋 Pending   | Keep   |
| Implicit Relationships         | 340-400 | 📋 Pending   | Keep   |
| Search UX Enhancements         | 400-450 | 📋 Pending   | Keep   |
| MCP Tool Enhancements          | 450-470 | 📋 Pending   | Keep   |
| Acceptance Criteria            | 470-500 | 📋 Pending   | Keep   |
| Metrics                        | 500-511 | 📋 Pending   | Keep   |

**Action**: Keep as-is in planned/ — this is well-structured pending work.

---

### phase-3-multi-index-and-fields.md (1299 lines)

| Section                 | Lines    | Category                      | Action                                  |
| ----------------------- | -------- | ----------------------------- | --------------------------------------- |
| Progress Summary        | 25-40    | Status                        | Archive                                 |
| Part 3d Complete        | 40-135   | ✅ Complete                   | Archive with summary                    |
| Tier Metadata Bug Fix   | 95-145   | 💡 Insight                    | Already in ADR-080                      |
| Four-Retriever Ablation | 145-230  | 💡 Key Insight                | Move to ADR or research doc             |
| KS4 Filtering Complete  | 250-310  | ✅ Complete                   | Archive                                 |
| Parts 3.0-3c            | 265-500  | ✅ Complete                   | Archive                                 |
| Implementation Files    | 500-550  | 📖 Explanatory                | Archive                                 |
| Verification Sequence   | 550-580  | 📖 Explanatory                | Archive                                 |
| Data Strategy           | 590-605  | 📖 Explanatory                | Archive                                 |
| TDD Requirements        | 605-625  | 📖 Explanatory                | Reference in testing-strategy.md        |
| Related Documents       | 625-660  | Navigation                    | Archive                                 |
| Quality Gates           | 660-685  | Reference                     | Already in other docs                   |
| Phase 3e                | 685-1299 | 📋 Pending + partial complete | Split: results→archive, pending→planned |

**Key Insight to Preserve**:

- Four-retriever ablation study results
- Phase 3e findings (stemming/stop words regressed, fuzzy improved)
- MRR interpretation rubric

---

### phase-4-search-sdk-and-cli.md (194 lines)

| Section                 | Lines   | Category   | Action            |
| ----------------------- | ------- | ---------- | ----------------- |
| Purpose                 | 10-25   | 📋 Pending | Keep              |
| Scope                   | 45-80   | 📋 Pending | Keep              |
| Architectural Decisions | 80-100  | 📋 Pending | Keep              |
| Checkpoints             | 100-145 | 📋 Pending | Keep              |
| Quality Gates           | 145-165 | Reference  | Already elsewhere |
| Notes                   | 165-194 | Reference  | Keep              |

**Action**: Move to planned/search-sdk-cli.md

---

### phase-9-entity-extraction.md (266 lines)

**Action**: Move to planned/future/ — not on critical path.

---

### phase-10-reference-indices.md (272 lines)

**Action**: Merge unique content into 06-reference-indices.md, archive rest.

**Overlap**: ~80% with 06-reference-indices.md

---

### phase-11-plus-future.md (323 lines)

**Action**: Move to planned/future/ — roadmap for post-SDK work.

**Unique Content to Preserve**:

- RAG infrastructure plan
- Knowledge graph triple store plan
- LTR foundations plan
- Upstream API blocking features table

---

### reference-docs/\*.md (3 files, ~1160 lines)

**Action**: Keep all as-is — these are properly structured reference material.

---

## Execution Checklist

### Before Starting

- [x] Verify `.agent/plans/semantic-search-backup/` exists and is complete
- [x] Run `git status` to ensure clean working directory
- [x] Read this entire meta-plan

### Phase 1: Audit ✅ COMPLETE

- [x] Create detailed categorization for each file (use tables above)
- [x] Identify all unique content that must not be lost
- [x] Verify all key insights have target destinations

### Phase 2: Create Permanent Artifacts ✅ COMPLETE

- [x] Create/update research docs for key insights
- [x] Add ablation study results to appropriate ADR
- [x] Add IR metrics rubric to reference-docs
- [ ] Update vocab-gen/README.md with pipeline explanation (deferred - partial content exists)

### Phase 3: Archive Completed Work ✅ COMPLETE

- [x] Create `archive/completed/` directory
- [x] Archive 01-tier-1-fundamentals.md with summary
- [x] Archive 02a-synonym-architecture.md with summary
- [x] Archive 04-documentation-debt.md with summary
- [x] Archive phase-3 completed sections with summary

### Phase 4: Create Linear Roadmap ✅ COMPLETE

- [x] Create `roadmap.md` with milestone structure
- [x] Define dependencies between milestones
- [x] Add acceptance criteria per milestone

### Phase 5: Consolidate Sub-Plans ✅ COMPLETE

- [x] Create `active/` directory with 3 active plans
- [x] Create `planned/` directory with pending plans
- [x] Reduce 02b from 2095 to ~200 lines (`planned/vocabulary-mining-bulk.md`)
- [x] Merge phase-10 into 06 (`planned/reference-indices.md`)

### Phase 6: Simplify Navigation Documents — PENDING

- [ ] Simplify README.md (~381 → ~150 lines)
- [ ] Trim current-state.md (~248 → ~150 lines)
- [ ] Delete part-1-search-excellence.md (redirect)
- [ ] Delete part-1-search-excellence/README.md (merged into roadmap)

### Phase 7: Update Cross-References — PENDING

- [ ] Grep for all `semantic-search/` references
- [ ] Update paths in prompts
- [ ] Update paths in evaluations
- [ ] Update paths in ADRs
- [ ] Update paths in other plans

### Phase 8: Verification — PENDING

- [ ] For each original file, verify content disposition
- [ ] Run all quality gates
- [ ] Verify no broken links
- [ ] Document any intentionally removed content

---

## Dependencies and Blocking Order

```text
Phase 1 (Audit)
    ↓
Phase 2 (Permanent Artifacts) → Can run in parallel with Phase 3
    ↓
Phase 3 (Archive) → Can run in parallel with Phase 2
    ↓
Phase 4 (Roadmap) → Requires Phase 2+3 complete
    ↓
Phase 5 (Consolidate) → Requires Phase 4 complete
    ↓
Phase 6 (Cross-References) → Requires Phase 5 complete
    ↓
Phase 7 (Verification) → Final step
```

---

## Risk Mitigation

| Risk             | Mitigation                                              |
| ---------------- | ------------------------------------------------------- |
| Information loss | Backup exists; verification phase confirms nothing lost |
| Broken links     | Systematic grep-and-update in Phase 6                   |
| Work disruption  | All changes in single commit; can revert                |
| Missing context  | Archive files include summaries and links to ADRs       |

---

## Success Criteria

1. **Single roadmap document** with clear linear path
2. **≤10 active/pending plan files** (down from 27)
3. **All key insights** in permanent locations (ADRs, research, TSDoc)
4. **No broken links** in workspace
5. **Quality gates pass** after consolidation
6. **Agent in fresh chat** can navigate to any task quickly

---

## Notes for Executing Agent

1. **Go slow** — This is about preservation, not speed
2. **Verify at each step** — Check nothing is lost before proceeding
3. **Use backup** — `.agent/plans/semantic-search-backup/` is the safety net
4. **Create commits** — One logical commit per phase for easy rollback
5. **Document removals** — If content is intentionally removed, note why

---

## Appendix: File Disposition Summary

| Original File                       | Lines | Disposition                                   |
| ----------------------------------- | ----- | --------------------------------------------- |
| README.md                           | 381   | Reduce, update navigation                     |
| current-state.md                    | 248   | Keep, trim historical                         |
| search-acceptance-criteria.md       | 251   | Keep as-is                                    |
| part-1-search-excellence.md         | 41    | Delete (redirect)                             |
| part-1-search-excellence/README.md  | 290   | Merge to roadmap.md                           |
| 01-tier-1-fundamentals.md           | 109   | Archive                                       |
| 02a-synonym-architecture.md         | 84    | Archive                                       |
| 02b-vocabulary-mining.md            | 2095  | Reduce to ~400, move bulk to vocab-gen README |
| 03-evaluation-infrastructure.md     | 155   | Move to planned/                              |
| 04-documentation-debt.md            | 85    | Archive                                       |
| 05-complete-data-indexing.md        | 84    | Move to active/                               |
| 06-reference-indices.md             | 112   | Merge with phase-10, move to planned/         |
| 07-resource-types.md                | 106   | Move to planned/                              |
| 08-mcp-graph-tools.md               | 175   | Move to planned/                              |
| 09-knowledge-graph-evolution.md     | 241   | Move to planned/                              |
| 10-transcript-mining.md             | 244   | Move to planned/                              |
| 11-synonym-quality-audit.md         | 377   | Move to active/                               |
| 12-curriculum-pattern-config.md     | 489   | Move to active/                               |
| 13-thread-based-search.md           | 511   | Move to planned/                              |
| phase-3-multi-index-and-fields.md   | 1299  | Archive 3.0-3d, keep 3e for planned/          |
| phase-4-search-sdk-and-cli.md       | 194   | Move to planned/                              |
| phase-9-entity-extraction.md        | 266   | Move to planned/future/                       |
| phase-10-reference-indices.md       | 272   | Merge to 06, archive                          |
| phase-11-plus-future.md             | 323   | Move to planned/future/                       |
| reference-docs/ir-metrics.md        | 568   | Keep as-is                                    |
| reference-docs/es-serverless.md     | 345   | Keep as-is                                    |
| reference-docs/data-completeness.md | 243   | Keep as-is                                    |

**Estimated Final State**: ~3,500 lines across ~15 files (down from ~9,500 across 27 files)

---

**End of Meta-Plan**
