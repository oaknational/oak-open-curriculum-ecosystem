# Comprehensive Filter Testing

**Status**: 📋 Planned — HIGH PRIORITY before SDK extraction
**Priority**: HIGH — Must understand all filter combinations before extraction
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03

---

## Overview

Before extracting the Search SDK, we MUST comprehensively test all filter combinations across the curriculum. Different subjects and key stages have fundamentally different metadata structures, and we need to understand these differences before we can design robust filter handling.

**Why this is blocking SDK extraction**: The SDK must expose a clean API for filtering. If we don't understand all the edge cases, we'll either:

1. Over-engineer a complex API that handles cases that don't exist
2. Under-engineer and break when users hit unhandled combinations

---

## The Problem

**KS4 Maths is NOT representative of the whole curriculum.**

| Dimension | KS4 Maths | KS2 History | Implication |
|-----------|-----------|-------------|-------------|
| Tiers | Foundation/Higher | N/A | Tier filtering only applies to some subjects |
| Exam Boards | AQA, Edexcel, OCR | N/A | Exam board filtering is KS4-specific |
| Pathways | Core, Extended | N/A | Pathway filtering varies |
| Unit Options | N/A | Sometimes | Some subjects have unit variants |
| Categories | N/A | N/A | Only English, Science, RE have categories |
| Threads | Yes (164 total) | Yes | Universal but different structure |

### Known Metadata Differentiators

| Metadata | Subjects | Key Stages | Notes |
|----------|----------|------------|-------|
| `tiers` | Maths, Science | KS4 only | Foundation/Higher |
| `examBoards` | All | KS4 only | AQA, Edexcel, OCR, WJEC |
| `pathways` | Some | KS4 only | Core/Extended/etc. |
| `categories` | English, Science, RE | All | Grammar/Biology/Theology |
| `unitOptions` | Art, D&T, English, Geography, History, RE | KS4 | Specialisms, set texts |
| `threads` | All | All | Subject-specific |
| `years` | All | KS1-4 | 1-11 |

---

## Phase 1: Document All Filter Dimensions

### 1.1 Audit Bulk Data

For each subject and key stage combination:

1. What metadata fields are populated?
2. What are the valid values for each field?
3. Are there combinations that don't exist?

```bash
# Example audit approach
cd apps/oak-open-curriculum-semantic-search
pnpm tsx scripts/audit-filter-dimensions.ts --subject maths --keyStage ks4
pnpm tsx scripts/audit-filter-dimensions.ts --subject history --keyStage ks2
```

### 1.2 Create Filter Matrix

Document a matrix of all filter dimensions:

| Subject | KS | Tiers | Exam Boards | Pathways | Categories | Unit Options |
|---------|----|----|-------------|----------|------------|--------------|
| maths | ks1 | ❌ | ❌ | ❌ | ❌ | ❌ |
| maths | ks2 | ❌ | ❌ | ❌ | ❌ | ❌ |
| maths | ks3 | ❌ | ❌ | ❌ | ❌ | ❌ |
| maths | ks4 | ✅ | ✅ | ✅ | ❌ | ❌ |
| english | ks4 | ❌ | ✅ | ❌ | ✅ | ✅ |
| ... | ... | ... | ... | ... | ... | ... |

---

## Phase 2: Understand Search Behavior

### 2.1 Current Filter Implementation

Document how each filter currently works:

| Filter | ES Implementation | Edge Cases |
|--------|-------------------|------------|
| `subject` | Term query on `subject_slug` | Always present |
| `keyStage` | Term query on `key_stage` | Always present |
| `tier` | Term query on `tiers` | Only KS4 Maths/Science |
| `examBoard` | ?? | ?? |
| `year` | ?? | ?? |

### 2.2 Empty Filter Behavior

What happens when a filter is applied but no documents match?

- Does it return zero results?
- Does it fall back to broader search?
- Should it warn the user?

### 2.3 Implicit vs Explicit Filters

| Filter | Behavior | Example |
|--------|----------|---------|
| Implicit | Auto-applied based on context | Year derived from keyStage |
| Explicit | User specifies | tier=higher |

---

## Phase 3: Design Test Suite

### 3.1 Test Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Valid combinations** | Filter combinations that should return results | maths + ks4 + tier:higher |
| **Invalid combinations** | Filter combinations that should be handled gracefully | history + tier:higher (no tiers in history) |
| **Edge cases** | Unusual but valid combinations | science + ks4 + examBoard:aqa |
| **Cross-subject** | Filters that mean different things in different subjects | "categories" in English vs Science |

### 3.2 Test Generation Strategy

Rather than manually writing all tests, generate them from the filter matrix:

```typescript
// Pseudo-code
for (const subject of subjects) {
  for (const keyStage of keyStages) {
    const validFilters = getValidFiltersFor(subject, keyStage);
    const invalidFilters = getInvalidFiltersFor(subject, keyStage);
    
    // Generate valid combination tests
    for (const combination of generateCombinations(validFilters)) {
      createTest({ subject, keyStage, filters: combination, expectResults: true });
    }
    
    // Generate invalid combination tests
    for (const filter of invalidFilters) {
      createTest({ subject, keyStage, filters: [filter], expectResults: false });
    }
  }
}
```

### 3.3 Test Scope

| Level | Scope | Location |
|-------|-------|----------|
| Unit | Individual filter functions | `*.unit.test.ts` |
| Integration | Filter combinations against ES | `*.integration.test.ts` |
| E2E | Full search with filters | Smoke tests |

---

## Phase 4: Create Ground Truth for Filters

### 4.1 Filter-Specific Ground Truth

Create ground truth queries that exercise filters:

```typescript
const FILTER_GROUND_TRUTHS = [
  {
    query: "quadratic equations",
    filters: { subject: "maths", keyStage: "ks4", tier: "higher" },
    expectedResults: ["solving-quadratic-equations-higher-tier", ...],
    category: "filter-validation",
  },
  {
    query: "photosynthesis",
    filters: { subject: "science", keyStage: "ks3" },
    expectedResults: ["photosynthesis-ks3", ...],
    category: "filter-validation",
  },
];
```

### 4.2 MRR by Filter Combination

Track MRR not just by subject, but by filter combination:

| Subject | KS | Tier | MRR | Notes |
|---------|----|----|-----|-------|
| maths | ks4 | foundation | 0.XXX | |
| maths | ks4 | higher | 0.XXX | |
| maths | ks4 | (none) | 0.XXX | No tier filter |

---

## Acceptance Criteria

Before SDK extraction can proceed:

- [ ] Filter matrix documented for all 17 subjects × 4 key stages
- [ ] All valid filter combinations have at least one ground truth query
- [ ] All invalid filter combinations are handled gracefully (documented behavior)
- [ ] Filter-specific MRR baselines established
- [ ] No filter combination causes errors or unexpected behavior
- [ ] SDK filter API design reviewed against matrix

---

## Implementation Tasks

| Task | Description | Status |
|------|-------------|--------|
| Create audit script | `scripts/audit-filter-dimensions.ts` | 📋 Planned |
| Document filter matrix | Spreadsheet or MD table | 📋 Planned |
| Review current filter code | Document edge cases | 📋 Planned |
| Generate filter tests | From matrix | 📋 Planned |
| Create filter ground truths | Per-combination | 📋 Planned |
| Establish filter MRR baselines | Per-combination | 📋 Planned |
| Document invalid combinations | Expected behavior | 📋 Planned |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../roadmap.md](../roadmap.md) | Master plan |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENTAL-PROTOCOL.md](../../../evaluations/EXPERIMENTAL-PROTOCOL.md) | How to measure |
| [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) | KS4 denormalization |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels

