# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-03 (Phase 5a in progress)

This is a **standalone entrypoint** for semantic search sessions. Start here.

---

## 🚨 IMMEDIATE: Phase 5a Recovery Required

**Status**: Phase 5a ground truth restructure is **IN PROGRESS** but has **corrupted files** that need fixing.

### What Happened

A `sed` command timed out mid-execution, leaving some files with corrupted export names. The refactoring was to change from key-stage-based naming (`KS3_`) to phase-based naming (`SECONDARY_`).

### Files That Need Fixing

The following pattern was corrupted: `UNIT_GROUND_TRUTH_QUERIES` became `UNIT_MATHS_SECONDARY_STANDARD_QUERIES` (wrong).

**Run this fix first**:
```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# Fix corrupted UNIT names
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_GROUND_TRUTH_QUERIES/g' {} \;
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_HARD_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_HARD_GROUND_TRUTH_QUERIES/g' {} \;
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_ALL_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_ALL_GROUND_TRUTH_QUERIES/g' {} \;

# Verify no corruption remains
grep -r "UNIT_.*MATHS_SECONDARY_STANDARD" apps/oak-open-curriculum-semantic-search/
```

Then run quality gates:
```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

---

## 🚀 Current State: Phase 5a Partially Complete

### What's Been Completed ✅

| Task | Description | Status |
|------|-------------|--------|
| Directory rename | All `ks3/` → `secondary/`, `ks2/` → `primary/` | ✅ Done |
| Maths restructure | Created `maths/secondary/`, moved all files | ✅ Done |
| English restructure | Merged `ks3/` + `ks4/` → `secondary/` | ✅ Done |
| Export naming | KS3_ → SECONDARY_ in topic files | ✅ Done |
| Root index.ts | Removed deprecated aliases, clean exports | ✅ Done |
| analyze-cross-curriculum.ts | Updated imports to phase-based | ✅ Done |

### What's Partially Done ⚠️

| Task | Issue | Action Needed |
|------|-------|---------------|
| Consumer file updates | `sed` corrupted some UNIT_* names | Run fix commands above |
| Other smoke tests | May have incorrect imports | Verify after fix |

### What's Remaining (Phase 5a) 📋

1. **Run fix commands** for corrupted files
2. **Run full quality gates** to verify everything compiles
3. **Verify query counts** match expected totals

### What's Remaining (Phase 5b) 📋

| Task | Description |
|------|-------------|
| Discover KS1+KS2 maths | Use MCP tools to explore primary maths content |
| Create maths/primary/ | 30+ queries for: addition, subtraction, fractions, shapes, etc. |
| Validate slugs | Via MCP `get-lessons-summary` |
| Run quality gates | Full suite |

---

## 📁 Ground Truth Structure (Current)

```
ground-truth/
├── english/
│   ├── primary/           ✅ Exists (KS1+KS2 content)
│   ├── secondary/         ✅ NEW - merged from ks3/ + ks4/
│   └── types.ts
├── maths/
│   ├── primary/           ❌ NEEDS CREATING (Phase 5b)
│   ├── secondary/         ✅ NEW - moved from root
│   │   ├── units/         ✅ Unit ground truths
│   │   ├── algebra.ts
│   │   ├── geometry.ts
│   │   └── ...
│   └── index.ts
├── science/
│   ├── primary/           ✅ Exists
│   └── secondary/         ✅ RENAMED from ks3/
├── history/
│   ├── primary/           ✅ Exists
│   └── secondary/         ✅ RENAMED from ks3/
├── cooking-nutrition/
│   └── primary/           ✅ RENAMED from ks2/
└── [other subjects]/
    └── secondary/         ✅ RENAMED from ks3/
```

---

## 🎯 Ground Truth Philosophy

**Two types of queries** (2026-01-03 insight):

| Type | Example | Tests | Coupling |
|------|---------|-------|----------|
| **Curriculum concept** | "teaching fractions to year 4" | Semantic understanding | Low - stable |
| **Content discovery** | "Macbeth Lady Macbeth guilt" | Specific content findability | High - content-dependent |

A healthy ground truth set needs **both**:
- Curriculum concept queries test search intelligence (stable across content changes)
- Content discovery queries validate real content is findable (may break if content changes)

The **current set leans heavily toward content discovery**. When creating `maths/primary/`, include more curriculum concept queries.

---

## 📚 Key Exports (Phase-Aligned)

After restructure, the canonical exports are:

```typescript
// Subject-level (aggregates all phases)
import { ALL_MATHS_QUERIES } from './ground-truth/maths';
import { ENGLISH_ALL_QUERIES } from './ground-truth/english';

// Phase-specific
import { MATHS_SECONDARY_STANDARD_QUERIES } from './ground-truth/maths';
import { MATHS_SECONDARY_HARD_QUERIES } from './ground-truth/maths';
import { ENGLISH_PRIMARY_ALL_QUERIES } from './ground-truth/english';
import { ENGLISH_SECONDARY_ALL_QUERIES } from './ground-truth/english';

// Unit ground truths (maths only)
import { UNIT_GROUND_TRUTH_QUERIES } from './ground-truth/maths';
import { UNIT_HARD_GROUND_TRUTH_QUERIES } from './ground-truth/maths';
```

**Old names removed** (clean break, no compatibility):
- ~~`GROUND_TRUTH_QUERIES`~~ → `MATHS_SECONDARY_STANDARD_QUERIES`
- ~~`HARD_GROUND_TRUTH_QUERIES`~~ → `MATHS_SECONDARY_HARD_QUERIES`
- ~~`ALL_MATHS_GROUND_TRUTH_QUERIES`~~ → `ALL_MATHS_QUERIES`
- ~~`ENGLISH_KS3_ALL_QUERIES`~~ → `ENGLISH_SECONDARY_ALL_QUERIES`
- ~~`SCIENCE_KS3_ALL_QUERIES`~~ → `SCIENCE_SECONDARY_ALL_QUERIES`

---

## 🛠️ MCP Server Tools

The Oak Curriculum MCP server (`ooc-http-dev-local`) is available. Key tools for Phase 5b:

```bash
# Explore KS1 and KS2 maths units
get-key-stages-subject-units --keyStage ks1 --subject maths
get-key-stages-subject-units --keyStage ks2 --subject maths

# List lessons in a unit
get-key-stages-subject-lessons --keyStage ks2 --subject maths --unit fractions

# Validate slugs exist
get-lessons-summary --lesson <slug>

# Search for content
search --q "fractions year 3" --subject maths --keyStage ks2
```

---

## 📊 Baseline Status

These baselines used the old per-key-stage approach. After Phase 5b, run phase-based baselines.

| Subject | Primary | Secondary | Notes |
|---------|---------|-----------|-------|
| **Maths** | ❌ No GTs | ✅ 0.894 | Phase 5b creates Primary |
| **English** | ✅ Exists | ✅ Exists | Now properly merged |
| **Science** | ✅ 0.852 | ✅ 0.899 | Good |
| **History** | ✅ 0.667 | ✅ 0.950 | Good |
| Other | — | Various | Mostly KS3 only |

---

## 📋 Full Plan Reference

**Plan file**: [.cursor/plans/phase_5_ground_truth_restructure_8bf86d73.plan.md](../../../.cursor/plans/phase_5_ground_truth_restructure_8bf86d73.plan.md)

**M3 Revised plan**: [m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md)

---

## Before You Start

### 1. Read Foundation Documents (MANDATORY)

- **[rules.md](../../directives-and-memory/rules.md)** — First Question, TDD, no type shortcuts, **NO COMPATIBILITY LAYERS**
- **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
- **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

**Key rule**: Clean breaks only. No deprecated aliases, no backwards compatibility.

### 2. Fix Corrupted Files First

See the "IMMEDIATE" section at the top of this document.

### 3. Verify Environment

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check  # Must pass
pnpm test        # Must pass
```

---

## Quality Gates

Run after every change:

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

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/` | Ground truths (restructured) |
| `src/lib/search-quality/ground-truth/index.ts` | Root exports (clean, no deprecated) |
| `src/lib/search-quality/ground-truth/maths/` | Maths GT (secondary only, needs primary) |
| `evaluation/analysis/analyze-cross-curriculum.ts` | Baseline analysis |
| `src/lib/hybrid-search/phase-filter-utils.ts` | Phase expansion utilities |

---

## Next Steps After Phase 5a

1. **Phase 5b**: Create `maths/primary/` ground truths
   - Use MCP to discover KS1+KS2 content
   - Create 30+ queries mixing curriculum concepts and content discovery
   - Validate all slugs

2. **Phase 6**: Add `phase_slug` to ES documents via update-by-query

3. **Phase 7**: Run comprehensive phase-based baselines

4. **Documentation**: Update this prompt, create ADR if needed

---

## Navigation

| Document | Purpose |
|----------|---------|
| **This file** | Session entry point |
| [m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | Current plan |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master roadmap |
| [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) | How to run experiments |
| [DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md) | Curriculum data differences |
