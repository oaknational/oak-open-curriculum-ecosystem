# M3 Revised: Phase-Aligned Search Quality Architecture

**Status**: 📋 **PLANNED** — Replaces original M3
**Priority**: HIGH — Foundation for all future search work
**Parent**: [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03
**Replaces**: [m3-search-quality-optimization.md](m3-search-quality-optimization.md)

---

## Executive Summary

**Discovery**: The original M3 approach of testing per-key-stage (KS1, KS2, KS3, KS4 separately) is fundamentally misaligned with the curriculum structure. Primary ground truths span Years 1-6 (both KS1 and KS2), but testing them against a single key stage filter causes artificial failures.

**Solution**: Restructure ground truths and search filters around **phases** (primary/secondary) as the fundamental division, with additional granularity for GCSE edge cases.

**Scope**: This plan:
1. Restructures ground truths by phase (primary/secondary/gcse)
2. Enhances search filters to support multiple key stages, years, and phases
3. Achieves all original M3 goals (comprehensive baselines across full curriculum)
4. Incorporates comprehensive filter testing

---

## Problem Statement

### What We Discovered

When running English baselines:

| Key Stage | MRR | Issue |
|-----------|-----|-------|
| KS1 | 0.131 | ❌ BFG queries fail (BFG is KS2 content) |
| KS2 | 0.107 | ❌ Billy Goats queries fail (Billy Goats is KS1 content) |
| KS3 | 0.742 | ✅ Works because queries align with key stage |
| KS4 | 0.394 | ⚠️ Mixed — some content issues |

**Root Cause**: The same "Primary" ground truths were used for both KS1 and KS2 tests, but expected slugs are key-stage-specific:

| Query | Expected Slug | Actual Key Stage |
|-------|--------------|------------------|
| "The BFG reading comprehension" | `engaging-with-the-bfg` | **KS2** |
| "Three Billy Goats Gruff story" | `reading-and-responding-to-the-three-billy-goats-gruff` | **KS1** |

### The Architectural Insight

**Key stages are not the fundamental division** — they're an overlay on years:

```
Phase (primary | secondary)
├── Sequences (subject + phase + optional exam board)
│   ├── english-primary (Years 1-6, KS1+KS2)
│   ├── english-secondary-aqa (Years 7-11, KS3+KS4, AQA)
│   └── maths-secondary (Years 7-11, KS3+KS4)
├── Key Stages (overlay)
│   ├── KS1 = Years 1-2
│   ├── KS2 = Years 3-6
│   ├── KS3 = Years 7-9
│   └── KS4 = Years 10-11
└── Years (1-11)
```

**Ground truths should be organised by phase**, not key stage.

---

## Architecture

### 1. Ground Truth Structure (By Phase)

```
ground-truth/
├── types.ts                    # Shared types (unchanged)
├── index.ts                    # Updated exports
│
├── english/
│   ├── primary/                # Years 1-6 (KS1+KS2 combined)
│   │   ├── reading.ts          # Traditional tales, BFG, Iron Man
│   │   ├── writing.ts          # Narrative, diary, non-fiction
│   │   └── hard-queries.ts
│   ├── secondary/              # Years 7-11 (KS3+KS4 combined)
│   │   ├── literature.ts       # Lord of the Flies, Gothic, Tempest
│   │   ├── language.ts         # Non-fiction, persuasive writing
│   │   └── hard-queries.ts
│   └── gcse/                   # KS4 edge cases (set texts, exam skills)
│       ├── set-texts.ts        # An Inspector Calls, Macbeth
│       └── exam-techniques.ts
│
├── maths/
│   ├── primary/                # NEW - Years 1-6
│   │   ├── number.ts
│   │   ├── shape.ts
│   │   └── hard-queries.ts
│   ├── secondary/              # Years 7-11 (existing KS4 restructured)
│   │   ├── algebra.ts
│   │   ├── geometry.ts
│   │   ├── number.ts
│   │   ├── graphs.ts
│   │   ├── statistics.ts
│   │   └── hard-queries.ts
│   └── gcse/                   # Complex GCSE topics
│       └── advanced-topics.ts
│
├── science/
│   ├── primary/                # Existing (KS2)
│   └── secondary/              # Existing KS3 + KS4 when available
│
├── history/
│   ├── primary/                # Existing (KS2)
│   └── secondary/              # Existing (KS3)
│
├── [other subjects]/
│   └── secondary/              # Most subjects only have secondary
│
└── validation/
    └── validate-ground-truth.ts  # Updated to validate by phase
```

### 2. Search Filter Architecture

**Current** (single key stage):
```typescript
interface SearchFilters {
  subject: SubjectSlug;
  keyStage: KeyStage;
}
```

**Proposed** (flexible combinations):
```typescript
/** Phase of education */
type Phase = 'primary' | 'secondary';

/** Year groups 1-11 */
type Year = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Search filter criteria.
 * 
 * All fields are optional. Unspecified fields match all values.
 * Invalid combinations (e.g., year 7 + ks1) return empty results, not errors.
 */
interface SearchFilters {
  // Curriculum dimensions
  subjects?: SubjectSlug[];       // Filter by subject(s)
  keyStages?: KeyStage[];         // Filter by key stage(s)
  years?: Year[];                 // Filter by year(s)
  phases?: Phase[];               // Filter by phase(s)
  
  // Content dimensions
  threads?: ThreadSlug[];         // Filter by curriculum thread(s)
  categories?: CategorySlug[];    // Only English, Science, RE
  
  // KS4-specific dimensions
  tiers?: Tier[];                 // 'foundation' | 'higher'
  examBoards?: ExamBoard[];       // 'aqa' | 'edexcel' | 'ocr' | 'wjec' | 'eduqas'
  unitOptions?: string[];         // Set texts, specialisms
}
```

**Filter logic**:
- `phases: ['primary']` → equivalent to `keyStages: ['ks1', 'ks2']`
- `phases: ['secondary']` → equivalent to `keyStages: ['ks3', 'ks4']`
- `years: [3, 4, 5]` → filters to those specific years
- Invalid combinations (year 7 + ks1) → empty results (not an error)

### 3. Analysis Script Enhancement

Update `analyze-cross-curriculum.ts` to support:

```bash
# Phase-based analysis (primary = KS1+KS2, secondary = KS3+KS4)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase secondary

# GCSE-specific analysis
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --gcse

# Multiple key stages
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --keyStages ks3,ks4

# Year-specific analysis
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject science --years 7,8,9

# Legacy single key stage (still supported)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject french --keyStage ks3
```

### 4. Ground Truth Selection Logic

When running baselines:

| Command | Ground Truths Loaded | Search Filter |
|---------|---------------------|---------------|
| `--phase primary` | `{subject}/primary/` | `keyStages: ['ks1', 'ks2']` |
| `--phase secondary` | `{subject}/secondary/` | `keyStages: ['ks3', 'ks4']` |
| `--gcse` | `{subject}/gcse/` | `keyStage: 'ks4'` |
| `--keyStage ks3` | `{subject}/secondary/` (filtered) | `keyStage: 'ks3'` |

This ensures ground truths always align with the filter scope.

---

## Query Categories

| Category | Description | Priority |
|----------|-------------|----------|
| naturalistic | Teacher/student language | HIGH |
| misspelling | Typos, mobile errors | CRITICAL |
| synonym | Alternative terminology | HIGH |
| multi-concept | Topic intersections | MEDIUM |
| colloquial | Informal language | MEDIUM |
| intent-based | Pedagogical purpose | EXPLORATORY |

### User Story Groupings

| User Story | Example Queries |
|------------|-----------------|
| **Teacher planning** | "KS2 fractions introduction" |
| **Student revision** | "GCSE biology cell division" |
| **Curriculum navigation** | "what comes before quadratics" |
| **Resource discovery** | "worksheets for photosynthesis" |

---

## Ground Truth Creation Methodology

Use **two complementary data sources** when creating new ground truths:

### 1. Bulk Download Data

Location: `reference/bulk_download_data/`

- Browse `{subject}-{primary|secondary}.json` files
- Identify lesson slugs and titles for candidate queries
- Cross-reference unit structure and thread relationships

### 2. Oak Curriculum MCP Tools

Server: `ooc-http-dev-local`

- `search` — Find lessons by topic
- `get-lessons-summary` — Get lesson details for relevance scoring
- `get-key-stages-subject-lessons` — List all lessons for a subject/key-stage
- `get-key-stages-subject-units` — Understand unit structure
- `fetch` — Get detailed unit/lesson information by ID

### Workflow

```text
1. DISCOVER: Search bulk data or use MCP `search` to find relevant lessons
2. VALIDATE: Use MCP `get-lessons-summary` to confirm slug exists
3. SCORE: Assign relevance (3=highly relevant, 2=relevant, 1=marginally relevant)
4. DOCUMENT: Add query with TSDoc explaining the test scenario
```

### TDD Approach for Ground Truths

For each subject/phase ground truth:

1. **RED**: Add new queries to validation script — test fails (no queries yet)
2. **GREEN**: Create ground truth files with validated slugs — test passes
3. **REFACTOR**: Ensure consistent structure, comprehensive TSDoc

---

## Implementation Phases

### Phase 1: Filter Architecture Enhancement

**Goal**: Support flexible filter combinations in the search API.

#### 1.1 Update ES Query Builder

File: `src/lib/hybrid-search/rrf-query-builders.ts`

```typescript
// Before
interface RrfRequestParams {
  keyStage: KeyStage;
  subject: SearchSubjectSlug;
  // ...
}

// After
interface RrfRequestParams {
  keyStages?: KeyStage[];         // Array support
  subjects?: SearchSubjectSlug[]; // Array support
  years?: Year[];                 // NEW
  phases?: Phase[];               // NEW (translates to keyStages)
  // ...existing fields
}
```

#### 1.2 Update Filter Logic

```typescript
function buildFilters(params: RrfRequestParams): ESFilterClause[] {
  const filters: ESFilterClause[] = [];
  
  // Phase → keyStages translation
  if (params.phases) {
    const keyStages = expandPhasesToKeyStages(params.phases);
    filters.push({ terms: { key_stage: keyStages } });
  } else if (params.keyStages) {
    filters.push({ terms: { key_stage: params.keyStages } });
  }
  
  // Years filter
  if (params.years) {
    filters.push({ terms: { year: params.years } });
  }
  
  // Subjects filter
  if (params.subjects) {
    filters.push({ terms: { subject_slug: params.subjects } });
  }
  
  return filters;
}

function expandPhasesToKeyStages(phases: Phase[]): KeyStage[] {
  const keyStages: KeyStage[] = [];
  if (phases.includes('primary')) {
    keyStages.push('ks1', 'ks2');
  }
  if (phases.includes('secondary')) {
    keyStages.push('ks3', 'ks4');
  }
  return keyStages;
}
```

#### 1.3 Acceptance Criteria

| Criterion | Measurement |
|-----------|-------------|
| `keyStages: ['ks1', 'ks2']` returns union | Manual test |
| `phases: ['primary']` equivalent to above | Manual test |
| `years: [7, 8, 9]` filters correctly | Manual test |
| Invalid combinations return empty, not error | Manual test |
| Existing single-keyStage API still works | Existing tests pass |

### Phase 2: Ground Truth Restructure

**Goal**: Reorganise ground truths by phase.

#### 2.1 English Restructure

| Current | New Location | Action |
|---------|--------------|--------|
| `english/primary/reading.ts` | `english/primary/reading.ts` | Review & update |
| `english/primary/writing.ts` | `english/primary/writing.ts` | Review & update |
| `english/ks3/` | `english/secondary/literature.ts` | Merge |
| `english/ks4/` | `english/secondary/language.ts` | Merge |
| — | `english/gcse/set-texts.ts` | NEW: An Inspector Calls, Macbeth |

#### 2.2 Maths Restructure

| Current | New Location | Action |
|---------|--------------|--------|
| Root files (algebra.ts, etc.) | `maths/secondary/` | Move |
| — | `maths/primary/` | NEW: Create |
| — | `maths/gcse/advanced-topics.ts` | NEW: Complex topics |

#### 2.3 Other Subjects

Most subjects only have KS3 content → becomes `{subject}/secondary/`

#### 2.4 Acceptance Criteria

| Criterion | Measurement |
|-----------|-------------|
| All existing queries preserved | Count comparison |
| Primary queries validated against KS1+KS2 slugs | Validation script |
| Secondary queries validated against KS3+KS4 slugs | Validation script |
| GCSE queries validated against KS4 slugs | Validation script |

### Phase 3: Analysis Script Update

**Goal**: Update `analyze-cross-curriculum.ts` for phase-based analysis.

#### 3.1 CLI Parameter Updates

```typescript
const { values } = parseArgs({
  options: {
    subject: { type: 'string', short: 's' },
    keyStage: { type: 'string', short: 'k' },      // Legacy, single
    keyStages: { type: 'string' },                  // NEW: comma-separated
    phase: { type: 'string', short: 'p' },          // NEW: primary|secondary
    gcse: { type: 'boolean' },                      // NEW: GCSE edge cases
    years: { type: 'string' },                      // NEW: comma-separated
    verbose: { type: 'boolean', short: 'v' },
  },
});
```

#### 3.2 Ground Truth Loading Logic

```typescript
function loadGroundTruths(
  subject: SubjectSlug,
  mode: 'primary' | 'secondary' | 'gcse' | 'legacy-ks'
): GroundTruthQuery[] {
  switch (mode) {
    case 'primary':
      return GROUND_TRUTHS_BY_PHASE[subject].primary;
    case 'secondary':
      return GROUND_TRUTHS_BY_PHASE[subject].secondary;
    case 'gcse':
      return GROUND_TRUTHS_BY_PHASE[subject].gcse;
    case 'legacy-ks':
      // For backwards compatibility with single key stage
      return selectQueriesForKeyStage(subject, keyStage);
  }
}
```

#### 3.3 Acceptance Criteria

| Criterion | Measurement |
|-----------|-------------|
| `--phase primary` loads primary ground truths | Manual test |
| `--phase secondary` loads secondary ground truths | Manual test |
| `--gcse` loads GCSE ground truths | Manual test |
| `--keyStage ks3` still works (backwards compat) | Manual test |
| Output shows phase/keyStages used | Console output |

### Phase 4: Run Comprehensive Baselines

**Goal**: Establish baselines for all subjects by phase.

**Protocol**: Follow [EXPERIMENTAL-PROTOCOL.md](../../../evaluations/EXPERIMENTAL-PROTOCOL.md) for all baseline runs:
1. Document hypothesis and scope in EXPERIMENT-LOG.md
2. Run baseline with verbose output
3. Record per-category MRR breakdown
4. Analyse failures for patterns
5. Update current-state.md with results

#### 4.1 Baseline Matrix

| Subject | Primary | Secondary | GCSE | Total Queries |
|---------|---------|-----------|------|---------------|
| **English** | ✅ | ✅ | ✅ | ~66 |
| **Maths** | ✅ | ✅ | ✅ | ~100 |
| **Science** | ✅ | ✅ | — | ~35 |
| **History** | ✅ | ✅ | — | ~16 |
| **Geography** | — | ✅ | — | ~9 |
| **RE** | — | ✅ | — | ~7 |
| **French** | — | ✅ | — | ~6 |
| **Spanish** | — | ✅ | — | ~6 |
| **German** | — | ✅ | — | ~6 |
| **Computing** | — | ✅ | — | ~9 |
| **Art** | — | ✅ | — | ~9 |
| **Music** | — | ✅ | — | ~9 |
| **D&T** | — | ✅ | — | ~9 |
| **PE** | ✅ | ✅ | — | ~9 |
| **Citizenship** | — | ✅ | — | ~6 |
| **Cooking** | ✅ | — | — | ~6 |

#### 4.2 Commands to Run

```bash
cd apps/oak-open-curriculum-semantic-search

# Core subjects
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --gcse

pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --gcse

pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject science --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject science --phase secondary

# Humanities
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject history --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject history --phase secondary

# Languages (secondary only)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject french --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject spanish --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject german --phase secondary

# Creative (secondary only)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject computing --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject art --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject music --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject design-technology --phase secondary

# Other
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject physical-education --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject physical-education --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject citizenship --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject cooking-nutrition --phase primary
```

#### 4.3 Recording Results

For each baseline run, record in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md):

```markdown
### YYYY-MM-DD: {Subject} {Phase} Baseline

**Context**: M3 Revised Phase 4 — {Subject} {phase} baseline

**Method**: `analyze-cross-curriculum.ts --subject {subject} --phase {phase}`

**Results**:

| Category | Queries | MRR | Status |
|----------|---------|-----|--------|
| naturalistic | N | X.XXX | ✅/⚠️/❌ |
| misspelling | N | X.XXX | ✅/⚠️/❌ |
| ... | ... | ... | ... |
| **Overall** | **N** | **X.XXX** | **Status** |

**Key Findings**:
1. ...
2. ...

**Decision**: ✅ BASELINE ESTABLISHED
```

After all baselines, update [current-state.md](../current-state.md) with the phase-based matrix.

#### 4.4 Acceptance Criteria

| Criterion | Measurement |
|-----------|-------------|
| All subjects with primary content baselined | EXPERIMENT-LOG entries |
| All subjects with secondary content baselined | EXPERIMENT-LOG entries |
| Core subjects GCSE baselined | EXPERIMENT-LOG entries |
| Per-category MRR breakdown for each | EXPERIMENT-LOG entries |
| current-state.md updated with phase matrix | File updated |

### Phase 5: Comprehensive Filter Testing

**Goal**: Test all valid filter combinations.

#### 5.1 Filter Matrix Audit

For each subject, document available filter dimensions:

| Subject | Phases | Years | Tiers | Exam Boards | Categories | Unit Options |
|---------|--------|-------|-------|-------------|------------|--------------|
| Maths | P, S | 1-11 | F/H (KS4) | ✅ (KS4) | ❌ | ❌ |
| English | P, S | 1-11 | ❌ | ✅ (KS4) | ✅ | ✅ (KS4 texts) |
| Science | P, S | 1-9 | F/H (KS4) | ✅ (KS4) | ✅ | ❌ |
| ... | ... | ... | ... | ... | ... | ... |

#### 5.2 Test Generation

```typescript
// Generate tests from filter matrix
for (const subject of subjects) {
  const validFilters = getValidFiltersFor(subject);
  
  for (const combination of generateCombinations(validFilters)) {
    createTest({
      subject,
      filters: combination,
      expectResults: true,
    });
  }
}
```

#### 5.3 Acceptance Criteria

| Criterion | Measurement |
|-----------|-------------|
| Filter matrix documented | Markdown table |
| All valid combinations tested | Test count |
| Invalid combinations handled gracefully | No errors, empty results |
| Filter-specific MRR baselines | EXPERIMENT-LOG entries |

---

## Exit Criteria (ALL Required)

### Architecture

| Criterion | Target |
|-----------|--------|
| Search filters support arrays | `keyStages`, `years`, `phases` |
| Phase expansion works | `phases: ['primary']` → `keyStages: ['ks1', 'ks2']` |
| Invalid combinations handled | Empty results, no errors |
| Backwards compatibility | Single keyStage still works |

### Ground Truths

| Criterion | Target |
|-----------|--------|
| Restructured by phase | All subjects |
| Primary queries align with KS1+KS2 | Validation passes |
| Secondary queries align with KS3+KS4 | Validation passes |
| GCSE queries align with KS4 | Validation passes |
| Total query count preserved | 263+ queries |

### Baselines

| Criterion | Target |
|-----------|--------|
| Primary baselines | All applicable subjects |
| Secondary baselines | All 16 subjects |
| GCSE baselines | Core subjects |
| Per-category breakdown | All combinations |

### Documentation

| Criterion | Target |
|-----------|--------|
| current-state.md | Phase-based matrix |
| EXPERIMENT-LOG.md | All baselines recorded |
| Filter matrix | Documented |
| semantic-search.prompt.md | Updated |

---

## Quality Gates

Run after each phase:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Foundation Document Re-Read Schedule

| Checkpoint | Re-read |
|------------|---------|
| Before Phase 1 | rules.md, testing-strategy.md |
| Before Phase 2 | rules.md (First Question), schema-first-execution.md |
| Before Phase 3 | testing-strategy.md |
| Before Phase 4 | rules.md |
| Before Phase 5 | All three |
| Before sign-off | All three |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Filter changes break existing API | Backwards compatibility tests |
| Ground truth restructure loses queries | Count validation before/after |
| Primary content sparse | Document gaps, note in baselines |
| GCSE content complexity | Separate GCSE ground truths |
| Scope creep | Phase gates with explicit exit criteria |

---

## Related Documents

### Planning

| Document | Purpose |
|----------|---------|
| [../roadmap.md](../roadmap.md) | Master roadmap |
| [../current-state.md](../current-state.md) | Current metrics (update after baselines) |
| [../pre-sdk-extraction/comprehensive-filter-testing.md](../pre-sdk-extraction/comprehensive-filter-testing.md) | Filter testing (incorporated into Phase 5) |

### Evaluation Framework

| Document | Purpose |
|----------|---------|
| **[../../evaluations/EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md)** | **How to run experiments** — READ FIRST |
| [../../evaluations/EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Record all baselines here |
| [../../evaluations/experiments/template-for-search-experiments.md](../../evaluations/experiments/template-for-search-experiments.md) | Experiment template |

### Technical Documentation

| Document | Purpose |
|----------|---------|
| [../../../../docs/data/DATA-VARIANCES.md](../../../../docs/data/DATA-VARIANCES.md) | Curriculum data differences |
| [../../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR, NDCG definitions |
| [../../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md](../../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md) | Hybrid search queries |
| [../../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) | Synonym expansion strategy |

### ADRs

| ADR | Purpose |
|-----|---------|
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
| [ADR-084](../../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase boosting |

---

## Getting Started (New Session Entry Point)

### 1. Read Foundation Documents (MANDATORY)

Before ANY work, read these three documents:

- **[rules.md](../../../directives-and-memory/rules.md)** — First Question, TDD, no type shortcuts
- **[testing-strategy.md](../../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
- **[schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

### 2. Verify Environment

```bash
cd apps/oak-open-curriculum-semantic-search

# Check ES connectivity (should show 7 indices, 16,414 documents)
pnpm es:status

# If this fails, check .env has valid ELASTICSEARCH_* credentials
```

### 3. Understand Current State

- Read [current-state.md](../current-state.md) for current metrics
- Read [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md) for history
- Note: English KS1/KS2 baselines are marked as TEST FLAW (this plan fixes that)

### 4. Identify Next Phase

Check which phase is next:
1. Filter architecture enhancement — Array support in ES query builders
2. Ground truth restructure — Reorganise by phase
3. Analysis script update — Add `--phase` parameter
4. Run comprehensive baselines — All subjects by phase
5. Comprehensive filter testing — All valid combinations

### 5. Follow TDD Approach

For each phase:
1. **RED**: Write failing test for new functionality
2. **GREEN**: Implement minimum to pass
3. **REFACTOR**: Clean up, add TSDoc
4. **QUALITY GATES**: Run full suite before proceeding

### 6. Record Everything

- All baseline runs → [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)
- Final metrics → [current-state.md](../current-state.md)
- Decisions → This plan or ADRs as appropriate

