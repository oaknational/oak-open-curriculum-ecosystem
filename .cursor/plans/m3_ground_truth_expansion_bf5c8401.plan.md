---
name: M3 Ground Truth Expansion
overview: Expand ground truth coverage from KS4 Maths only (73 queries) to comprehensive cross-curriculum validation (200+ queries across 17 subjects and 4 key stages), enabling measurement and optimisation of search quality across the full indexed curriculum.
todos:
  - id: phase1-english
    content: Create English ground truths (40+ queries, all key stages, all slugs validated)
    status: completed
  - id: phase1-science
    content: Create Science ground truths (45+ queries, all key stages, all slugs validated)
    status: completed
  - id: phase1-baselines
    content: Measure and document English + Science baseline MRR per category
    status: completed
    dependencies:
      - phase1-english
      - phase1-science
  - id: phase2-humanities
    content: Create History/Geography/RE ground truths (45+ queries total)
    status: completed
    dependencies:
      - phase1-baselines
  - id: phase2-baselines
    content: Measure and document Humanities baseline MRR per subject
    status: completed
    dependencies:
      - phase2-humanities
  - id: phase3-languages
    content: Create French/Spanish/German ground truths (36+ queries total)
    status: completed
    dependencies:
      - phase2-baselines
  - id: phase3-baselines
    content: Measure and document Languages baseline MRR per subject
    status: completed
    dependencies:
      - phase3-languages
  - id: phase4-remaining
    content: Create remaining subjects ground truths (60+ queries total)
    status: completed
    dependencies:
      - phase3-baselines
  - id: phase4-baselines
    content: Measure and document all remaining subject baselines
    status: completed
    dependencies:
      - phase4-remaining
  - id: m3-complete
    content: Update current-state.md with full cross-curriculum metrics, verify 200+ total queries
    status: completed
    dependencies:
      - phase4-baselines
---

# M3: Search Quality Optimisation — Ground Truth Expansion Plan

## Impact Statement

**Users**: Teachers searching for curriculum-aligned content across all subjects (not just Maths)**Problem**: We have indexed 16,414 documents across 17 subjects but can only validate search quality for KS4 Maths (73 queries covering ~2,000 lessons)**Impact**: Without cross-curriculum ground truths, we are shipping untested search quality to 94% of the indexed content---

## Current State

| Dimension | Current | Required | Gap ||-----------|---------|----------|-----|| Subjects covered | 1 (Maths) | 17 | 16 subjects || Key Stages | 1 (KS4) | 4 | KS1-3 missing || Ground truth queries | 73 | 200+ | 127+ queries || Lessons validated | ~2,000 | 12,833 | ~84% uncovered |---

## Architecture Decision: Ground Truth File Structure

Extend the existing pattern in [`src/lib/search-quality/ground-truth/`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/):

```javascript
ground-truth/
├── types.ts                    # Existing - shared types
├── index.ts                    # Updated - exports all subjects
├── maths/                      # Restructured from flat files
│   ├── ks4/
│   │   ├── algebra.ts
│   │   ├── geometry.ts
│   │   ├── number.ts
│   │   ├── graphs.ts
│   │   ├── statistics.ts
│   │   └── hard-queries.ts
│   ├── ks3/
│   │   └── ...
│   └── index.ts
├── english/
│   ├── ks4/
│   │   ├── reading.ts
│   │   ├── writing.ts
│   │   └── hard-queries.ts
│   ├── primary/               # KS1+KS2 combined where appropriate
│   │   └── ...
│   └── index.ts
├── science/
│   └── ...
└── [other subjects]/
```

**Rationale**: Organising by subject/key-stage mirrors the curriculum structure and enables per-subject, per-key-stage MRR reporting.---

## Implementation Phases

### Phase 1: Core Subjects (English, Science)

**Priority**: HIGH — Core subjects have highest search volume

#### 1.1 English Ground Truth

Create ground truths for English (2,525 lessons indexed):| Key Stage | Standard Queries | Hard Queries | Total ||-----------|-----------------|--------------|-------|| KS4 (GCSE) | 10 | 5 | 15 || KS3 | 8 | 4 | 12 || KS2 | 6 | 3 | 9 || KS1 | 4 | 2 | 6 || **Total** | **28** | **14** | **42** |**Query Categories** (preserve existing):

- naturalistic: "how to teach persuasive writing"
- misspelling: "shakespere macbeth analysis"
- synonym: "comprehension skills" → reading comprehension
- multi-concept: "grammar and punctuation year 5"
- colloquial: "that poetry stuff about feelings"

**Files to create**:

- [`ground-truth/english/ks4/reading.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/ks4/reading.ts)
- [`ground-truth/english/ks4/writing.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/ks4/writing.ts)
- [`ground-truth/english/ks4/hard-queries.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/ks4/hard-queries.ts)
- Similar structure for KS1-3

#### 1.2 Science Ground Truth

Create ground truths for Science (1,277 lessons indexed):| Key Stage | Standard Queries | Hard Queries | Total ||-----------|-----------------|--------------|-------|| KS4 (Biology) | 6 | 3 | 9 || KS4 (Chemistry) | 6 | 3 | 9 || KS4 (Physics) | 6 | 3 | 9 || KS3 | 8 | 4 | 12 || KS1-2 | 6 | 3 | 9 || **Total** | **32** | **16** | **48** |**Files to create**:

- [`ground-truth/science/ks4/biology.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/ks4/biology.ts)
- [`ground-truth/science/ks4/chemistry.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/ks4/chemistry.ts)
- [`ground-truth/science/ks4/physics.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/ks4/physics.ts)
- Similar structure for KS1-3

---

### Phase 2: Humanities (History, Geography, RE)

**Priority**: MEDIUM — Significant content volume| Subject | Lessons | Standard | Hard | Total ||---------|---------|----------|------|-------|| History | 684 | 10 | 5 | 15 || Geography | 683 | 10 | 5 | 15 || Religious Education | 612 | 10 | 5 | 15 || **Total** | **1,979** | **30** | **15** | **45** |---

### Phase 3: Languages (French, Spanish, German)

**Priority**: MEDIUM — Unique vocabulary challenges| Subject | Lessons | Standard | Hard | Total ||---------|---------|----------|------|-------|| French | 522 | 8 | 4 | 12 || Spanish | 525 | 8 | 4 | 12 || German | 411 | 8 | 4 | 12 || **Total** | **1,458** | **24** | **12** | **36** |---

### Phase 4: Arts, Technology, and Other

**Priority**: LOWER — Smaller content volume| Subject | Lessons | Standard | Hard | Total | Notes ||---------|---------|----------|------|-------|-------|| Computing | 528 | 6 | 3 | 9 | || Art | 403 | 6 | 3 | 9 | || Music | 434 | 6 | 3 | 9 | || D&T | 360 | 6 | 3 | 9 | || PE | 992 | 6 | 3 | 9 | || Citizenship | 318 | 4 | 2 | 6 | || RSHE/PSHE | TBD | 4 | 2 | 6 | **API only** — see note below || Cooking | 108 | 4 | 2 | 6 | || **Total** | **~3,143** | **42** | **21** | **63** | |**RSHE/PSHE Note**: This subject is missing from bulk download data. Ground truths will be created using MCP API tools only. **Benchmarks for RSHE are deferred** until curriculum data is included in bulk downloads and indexed in ES.---

## Acceptance Criteria (Explicit and Measurable)

### Phase 1 Exit Criteria

| Criterion | Target | Measurement ||-----------|--------|-------------|| English ground truth queries | >= 40 | Count in index.ts || Science ground truth queries | >= 45 | Count in index.ts || All slugs validated | 100% | `pnpm tsx evaluation/validation/validate-ground-truth.ts` passes || English baseline MRR measured | Value recorded | Per-category breakdown in EXPERIMENT-LOG.md || Science baseline MRR measured | Value recorded | Per-category breakdown in EXPERIMENT-LOG.md || Quality gates pass | All green | Full gate sequence (see below) |

### Phase 2 Exit Criteria

| Criterion | Target | Measurement ||-----------|--------|-------------|| History/Geography/RE ground truth | >= 45 total | Count in index.ts || All slugs validated | 100% | Validation script passes || Baselines measured | 3 subjects | EXPERIMENT-LOG.md entries |

### Phase 3 Exit Criteria

| Criterion | Target | Measurement ||-----------|--------|-------------|| French/Spanish/German ground truth | >= 36 total | Count in index.ts || All slugs validated | 100% | Validation script passes || Baselines measured | 3 subjects | EXPERIMENT-LOG.md entries |

### Phase 4 Exit Criteria

| Criterion | Target | Measurement ||-----------|--------|-------------|| Remaining subjects ground truth | >= 60 total | Count in index.ts || All slugs validated | 100% | Validation script passes || Baselines measured | All subjects except RSHE | EXPERIMENT-LOG.md entries || RSHE ground truths created | >= 6 queries | Using MCP API tools || RSHE benchmarks | DEFERRED | Until bulk data available and indexed |

### M3 Complete Exit Criteria

| Criterion | Target | Measurement ||-----------|--------|-------------|| Total ground truth queries | >= 200 | `ALL_GROUND_TRUTH_QUERIES.length` || Subject coverage | 17/17 | Index.ts exports || Key stage coverage | All 4 | At least 1 subject per KS || Overall MRR documented | Per-subject table | current-state.md updated || Synonym gaps identified | List created | Analysis documented || Quality gates | All pass | Full sequence |---

## TDD Approach

For each subject's ground truth:

1. **RED**: Add new subject queries to validation script — test fails (no queries yet)
2. **GREEN**: Create ground truth files with validated slugs — test passes
3. **REFACTOR**: Ensure consistent structure, comprehensive TSDoc

**Ground Truth Creation Methodology**:Use **two complementary data sources**:

1. **Bulk Download Data** (`reference/bulk_download_data/`) — For broad exploration:

- Browse `{subject}-{primary|secondary}.json` files to understand topic coverage
- Identify lesson slugs and titles for candidate queries
- Cross-reference unit structure and thread relationships

2. **Oak Curriculum MCP Tools** (`ooc-http-dev-local`) — For targeted lookup and validation:

- `search` — Find lessons by topic ("photosynthesis KS3")
- `get-lessons-summary` — Get lesson details (keywords, learning objectives) for relevance scoring
- `get-key-stages-subject-lessons` — List all lessons for a subject/key-stage
- `get-key-stages-subject-units` — Understand unit structure
- `fetch` — Get detailed unit/lesson information by ID

**Workflow for each ground truth query**:

```javascript
1. DISCOVER: Search bulk data or use MCP `search` to find relevant lessons
2. VALIDATE: Use MCP `get-lessons-summary` to confirm slug exists and get metadata
3. SCORE: Assign relevance (3=highly relevant, 2=relevant, 1=marginally relevant)
4. DOCUMENT: Add query with TSDoc explaining the test scenario
```

**Example using MCP tools**:

```typescript
// Query: "lessons about photosynthesis"
// 1. MCP search: { q: "photosynthesis", subject: "science", keyStage: "ks3" }
// 2. MCP get-lessons-summary for top results to verify slugs
// 3. Score based on lesson keywords and learning objectives
```

---

## Quality Gates (Run After Each Phase)

From repo root, one at a time:

```bash
pnpm type-gen        # If types changed
pnpm build           # Build all workspaces
pnpm type-check      # TypeScript validation
pnpm lint:fix        # ESLint with auto-fix
pnpm format:root     # Prettier
pnpm markdownlint:root  # Markdown lint
pnpm test            # Unit + integration tests
pnpm test:e2e        # E2E tests
pnpm test:e2e:built  # E2E on built output
pnpm test:ui         # UI tests (if applicable)
pnpm smoke:dev:stub  # Smoke tests
```

**All gates must pass before proceeding to next phase.**---

## Documentation Deliverables

| Document | Purpose | Location ||----------|---------|----------|| TSDoc on all ground truth files | Explain query intent, validation method | Inline in .ts files || Per-subject baseline | MRR by category | [EXPERIMENT-LOG.md](/.agent/evaluations/EXPERIMENT-LOG.md) || Updated current-state.md | Cross-curriculum metrics | [current-state.md](/.agent/plans/semantic-search/current-state.md) || Synonym gap analysis | Identified missing terms | New file in evaluations/ |---

## Foundation Document Re-Read Schedule

| Checkpoint | Re-read ||------------|---------|| Before Phase 1 | rules.md, testing-strategy.md || Before Phase 2 | schema-first-execution.md || Before Phase 3 | rules.md (First Question) || Before Phase 4 | testing-strategy.md || Before M3 sign-off | All three foundation documents |---

## Risk Mitigation

| Risk | Mitigation ||------|------------|| Invalid slugs in ground truth | Use MCP tools to validate slugs before adding; validation script runs in CI; TDD approach || Subject-specific vocabulary gaps | Document gaps; defer to synonym audit phase || Quality gate regression | Run gates after each phase; no exceptions || Scope creep into optimisation | Phase 1-4 are measurement only; optimisation is separate || RSHE missing from bulk data | Create ground truths via MCP API; defer benchmarks until bulk data available |---

## Next Steps After M3