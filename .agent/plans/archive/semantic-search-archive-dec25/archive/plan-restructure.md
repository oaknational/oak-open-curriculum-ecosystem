# Plan: Restructure Semantic Search Plans

**Status**: ✅ Complete  
**Priority**: High (unblocks further planning)  
**Estimated Effort**: 2-4 hours  
**Created**: 2025-12-18  
**Completed**: 2025-12-19

---

## Read First (Foundation Documents)

Before starting this work, read and commit to:

1. [principles.md](../../directives/principles.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — Test types and approach
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator-first architecture

**Note**: This plan is documentation-only (no code changes), but foundation principles still apply to documentation quality.

---

## Purpose

Restructure the semantic search plan collection from the legacy Phase-based structure (Phase 1, 2, 3...) to the Part → Stream → Task hierarchy, incorporating learnings from recent research and the new evaluation framework.

---

## Why Now?

1. **Research has matured** — [search-query-optimization-research.md](../../research/search-query-optimization-research.md) defines a clear experimentation path
2. **Evaluation framework exists** — [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) provides decision criteria
3. **Parallel work is emerging** — Relevance, Infrastructure, and Intelligence are distinct streams
4. **MCP integration is next** — Need clear "done" definition before Part 2

---

## References

### Internal Documents

| Document | Purpose |
|----------|---------|
| [Plans README - Hierarchy Guide](../README.md#plan-hierarchy-part--stream--task) | Part → Stream → Task structure |
| [search-query-optimization-research.md](../../research/search-query-optimization-research.md) | Techniques, experiments, NL-First pipeline |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Metrics, decision criteria, evaluation framework |
| [Evaluations README](../../evaluations/README.md) | Experiment documentation conventions |
| [Search Experiment Guidance](../../evaluations/guidance/search-experiment-guidance.md) | Practical how-to for experiments |

### Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| Semantic Reranking | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |
| Inference API | <https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html> |

### Current Plan Documents (to be restructured)

| Document | Path | Current Role | Mapping |
|----------|------|--------------|---------|
| README.md | `.agent/plans/semantic-search/README.md` | Navigation hub | Rewrite |
| requirements.md | `.agent/plans/semantic-search/requirements.md` | Success criteria | Update |
| phase-3 | `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` | Core search ✅ | Reference (keep) |
| phase-4 | `.agent/plans/semantic-search/phase-4-search-sdk-and-cli.md` | SDK extraction | Part 1, Stream D |
| phase-5 | `.agent/plans/semantic-search/phase-5-search-ui.md` | UI patterns | Archive |
| phase-6 | `.agent/plans/semantic-search/phase-6-cloud-functions.md` | HTTP endpoints | Archive |
| phase-7 | `.agent/plans/semantic-search/phase-7-admin-dashboard.md` | Admin UI | Archive |
| phase-8 | `.agent/plans/semantic-search/phase-8-query-enhancement.md` | Query patterns | Archive (superseded) |
| phase-9 | `.agent/plans/semantic-search/phase-9-entity-extraction.md` | NER, concepts | Part 3 |
| phase-10 | `.agent/plans/semantic-search/phase-10-reference-indices.md` | Reference data | Part 3 |
| phase-11+ | `.agent/plans/semantic-search/phase-11-plus-future.md` | RAG, KG, LTR | Part 3 |

### Other Documents to Update

| Document | Path | Action |
|----------|------|--------|
| high-level-plan.md | `.agent/plans/high-level-plan.md` | Update semantic search references |

---

## Target Structure

Based on [Plans README hierarchy guidelines](../README.md#plan-hierarchy-part--stream--task):

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

Stream A: Foundation                                [✅ Complete]
───────────────────────────────────────────────────────────────────
  A.1  4-way hybrid implementation                         ✅
  A.2  KS4 filtering                                       ✅
  A.3  Content-type-aware BM25                             ✅
  A.4  Ground truth queries defined                        ✅

Stream B: Relevance Optimization                    [Can start now]
───────────────────────────────────────────────────────────────────
  B.1  Baseline documentation                       B-001  📋
  B.2  Semantic reranking experiment                E-001  📋
  B.3  Linear retriever experiment                  E-003  📋
  B.4  Implement winning approaches                        📋
  B.5  Validate MRR ≥0.50                                  📋

Stream C: Query Intelligence                        [Start after B.2]
───────────────────────────────────────────────────────────────────
  C.1  Query expansion experiment                   E-002  📋
  C.2  Phonetic enhancement experiment              E-004  📋
  C.3  Query classification design                  ADR-082 📋
  C.4  Implement classification routing                    📋

Stream D: Infrastructure                            [Can start now]
───────────────────────────────────────────────────────────────────
  D.1  Extract Search SDK                                  📋
  D.2  Create CLI workspace                                📋
  D.3  Retire Next.js app                                  📋
  D.4  Documentation                                       📋

Dependencies:
  • C.1-C.4 depend on B.2 results (reranking may obviate expansion)
  • Part 2 depends on D.1-D.3 (SDK must exist for MCP to consume)
  • Stream D can start immediately (no blockers)

═══════════════════════════════════════════════════════════════════
Part 2: MCP Natural Language Tools
═══════════════════════════════════════════════════════════════════
Done when: Agents can search Oak curriculum effectively via MCP

(Cross-reference: .agent/plans/sdk-and-mcp-enhancements/)

Stream A: Structured Search Tools
───────────────────────────────────────────────────────────────────
  A.1  Lesson search tool (consume SDK)
  A.2  Unit search tool
  A.3  Filter tools (KS4, subject, keystage)

Stream B: Natural Language Pipeline
───────────────────────────────────────────────────────────────────
  B.1  NL→Search routing
  B.2  Intent detection
  B.3  Answer generation (RAG)

Stream C: Agent Guidance
───────────────────────────────────────────────────────────────────
  C.1  Tool prompts
  C.2  Workflow prompts
  C.3  Error handling guidance

═══════════════════════════════════════════════════════════════════
Part 3: Future Enhancements
═══════════════════════════════════════════════════════════════════

Stream A: Reference Indices (phase-10)
Stream B: Entity Extraction (phase-9)
Stream C: Learning to Rank (phase-11)
Stream D: Full Curriculum Coverage
Stream E: Search UI (phase-5, deferred)
```

---

## Tasks

### 1. Create New README.md

Replace the current README.md with a new version using Part → Stream → Task structure.

**Inputs**:
- Current README.md (preserve useful content)
- Target structure above
- Research findings from search-query-optimization-research.md

**Outputs**:
- New README.md with Part 1 detailed, Parts 2-3 outlined

### 2. Archive Legacy Phase Documents

Move superseded phase documents to archive:

| Document | Action |
|----------|--------|
| `phase-8-query-enhancement.md` | Archive (superseded by research) |
| `phase-5-search-ui.md` | Archive (defer to Part 3) |
| `phase-6-cloud-functions.md` | Archive (defer to Part 3) |
| `phase-7-admin-dashboard.md` | Archive (defer to Part 3) |

### 3. Create Part 1 Plan Document

Create `part-1-search-excellence.md` with:

- Detailed Stream definitions
- Task breakdowns with experiment references
- Success criteria (MRR targets from ADR-081)
- Dependencies documented

### 4. Update requirements.md

Align success criteria with ADR-081:

| Current | Updated |
|---------|---------|
| MRR > 0.70 | Standard MRR ≥0.92, Hard MRR ≥0.50 |
| NDCG@10 > 0.75 | NDCG@10 per category |
| p95 < 300ms | p95 ≤1500ms (allow for reranking) |

### 5. Create Experiment Cross-References

Ensure all tasks link to experiment documents:

```text
B.2  Semantic reranking experiment                E-001  📋
     └── .agent/evaluations/experiments/E-001-semantic-reranking.experiment.md
```

### 6. Update high-level-plan.md

Update references to semantic search:

- Change "Phase 3, 4, 5..." to "Part 1: Search Excellence"
- Update milestone table
- Update directory structure section

---

## Acceptance Criteria

- [x] New README.md uses Part → Stream → Task structure
- [x] Legacy phase documents archived appropriately
- [x] Part 1 plan document exists with all streams/tasks
- [x] All tasks reference experiments (E-XXX) or ADRs where appropriate
- [x] requirements.md aligned with ADR-081 metrics
- [x] high-level-plan.md updated
- [x] Markdownlint passes on all new/modified files
- [x] Cross-references between documents are valid

---

## Risks

| Risk | Mitigation |
|------|------------|
| Loss of useful content from legacy docs | Review each before archiving, extract valuable content |
| Inconsistent references | Search for "phase-" references across codebase |
| Confusion during transition | Keep legacy docs available in archive |

---

## Notes

- This restructure is documentation only — no code changes
- Experiments (E-001, B-001) already exist in `.agent/evaluations/experiments/`
- ADR-081 is the authoritative source for metrics and decision criteria
- Research document has the detailed technical approaches

---

## Quality Gates

After completing all tasks, run from repo root:

```bash
pnpm markdownlint:root   # Markdown lint (primary gate for doc changes)
```

All modified markdown files must pass linting before work is complete.

---

## File Locations Summary

For quick reference:

```text
Files to CREATE:
  .agent/plans/semantic-search/part-1-search-excellence.md

Files to REWRITE:
  .agent/plans/semantic-search/README.md

Files to UPDATE:
  .agent/plans/semantic-search/requirements.md
  .agent/plans/high-level-plan.md

Files to ARCHIVE (move to .agent/plans/semantic-search/archive/):
  phase-5-search-ui.md
  phase-6-cloud-functions.md
  phase-7-admin-dashboard.md
  phase-8-query-enhancement.md

Files to KEEP (reference only, no changes):
  phase-3-multi-index-and-fields.md  (completed work)
  phase-4-search-sdk-and-cli.md      (fold into Part 1 Stream D)
  phase-9-entity-extraction.md       (reference for Part 3)
  phase-10-reference-indices.md      (reference for Part 3)
  phase-11-plus-future.md            (reference for Part 3)

Key REFERENCE docs (read but don't modify):
  .agent/plans/README.md                          # Hierarchy guide
  .agent/research/search-query-optimization-research.md
  .agent/evaluations/README.md
  .agent/evaluations/guidance/search-experiment-guidance.md
  docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-18 | Plan created |
| 2025-12-19 | Plan executed and completed — all acceptance criteria met |
