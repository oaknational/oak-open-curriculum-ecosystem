# Filter Testing

**Stream**: sdk-api  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17

---

## Overview

After SDK extraction, we must comprehensively test all filter combinations across the curriculum. Different subjects and key stages have fundamentally different metadata structures, and we need to understand these differences to stabilise the SDK filter API.

**Note (2026-01-17)**: This work happens AFTER SDK extraction. The SDK API can evolve — we don't need perfect knowledge before extracting.

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

## Phase 2: Understand Search Behaviour

### 2.1 Current Filter Implementation

Document how each filter currently works:

| Filter | ES Implementation | Edge Cases |
|--------|-------------------|------------|
| `subject` | Term query on `subject_slug` | Always present |
| `keyStage` | Term query on `key_stage` | Always present |
| `tier` | Term query on `tiers` | Only KS4 Maths/Science |
| `examBoard` | ?? | ?? |
| `year` | ?? | ?? |

### 2.2 Empty Filter Behaviour

What happens when a filter is applied but no documents match?

- Does it return zero results?
- Does it fall back to broader search?
- Should it warn the user?

### 2.3 SDK API Evolution

Based on findings, propose SDK API changes:

```typescript
// Current: Simple filter object
search({ filters: { subject, keyStage, tier } })

// Evolved: Validated filter builder?
search({ filters: buildFilters({ subject, keyStage }).withTier('higher') })
```

---

## Phase 3: Design Test Suite

### 3.1 Test Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Valid combinations** | Filter combinations that should return results | maths + ks4 + tier:higher |
| **Invalid combinations** | Filter combinations that should be handled gracefully | history + tier:higher (no tiers in history) |
| **Edge cases** | Unusual but valid combinations | science + ks4 + examBoard:aqa |
| **Cross-subject** | Filters that mean different things in different subjects | "categories" in English vs Science |

### 3.2 Test Scope

| Level | Scope | Location |
|-------|-------|----------|
| Unit | Individual filter functions | `*.unit.test.ts` |
| Integration | Filter combinations against ES | `*.integration.test.ts` |
| E2E | Full search with filters | Smoke tests |

---

## Checklist

- [ ] Audit all 17 subjects × 4 key stages for filter dimensions
- [ ] Create filter matrix documentation
- [ ] Document current filter implementation
- [ ] Design SDK API for filter handling
- [ ] Create unit tests for valid combinations
- [ ] Create unit tests for invalid combinations
- [ ] Create integration tests against ES
- [ ] Propose SDK API changes based on findings

---

## Acceptance Criteria

- [ ] Filter matrix documented for all 17 subjects × 4 key stages
- [ ] All valid filter combinations have at least one test
- [ ] All invalid filter combinations are handled gracefully
- [ ] SDK API refined based on findings
- [ ] No filter combination causes errors or unexpected behaviour

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../roadmap.md](../roadmap.md) | Master plan |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md) | Tier definitions |
| [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) | KS4 denormalisation |
| [search-decision-model.md](search-decision-model.md) | How filters interact with confidence |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
