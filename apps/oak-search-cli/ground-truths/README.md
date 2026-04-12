# Ground Truth Type Generation

This folder contains the type generation infrastructure for ground truth validation.

## Overview

Ground truths define expected search results for evaluating search quality. This system:

1. **Parses bulk download data** from Oak's curriculum API
2. **Generates TypeScript types** for valid lesson slugs
3. **Generates Zod schemas** for runtime validation
4. **Validates ground truth entries** against the generated types

## Directory Structure

```text
ground-truths/
├── README.md                    # This file
├── generation/                  # Type generation source code
│   ├── index.ts                 # Barrel exports
│   ├── generate-ground-truth-types.ts  # Main generator script
│   ├── bulk-data-parser.ts      # Parse bulk download JSON
│   ├── type-emitter.ts          # Emit TypeScript types
│   ├── schema-emitter.ts        # Emit Zod schemas
│   └── *.unit.test.ts           # Unit tests
└── generated/                   # Generated output (see below)
    ├── index.ts                 # Re-exports all generated types
    ├── lesson-slugs-by-subject.ts  # Slug Sets and type guards
    ├── ground-truth-schemas.ts  # Zod validation schemas
    └── bulk-data-manifest.ts    # Generation metadata
```

## Usage

### Generate Types

After downloading fresh bulk data, regenerate the types:

```bash
# Download bulk data (optional, if not already present)
pnpm bulk:download

# Generate types from bulk data
pnpm bulk:codegen
```

### Validate Ground Truths

Check all ground truth entries against the generated types:

```bash
pnpm ground-truth:validate
```

The validator performs 12 checks:

1. **Slug existence** - All slugs exist in bulk data
2. **Non-empty relevance** - No empty `expectedRelevance` objects
3. **Valid scores** - Relevance scores are 1, 2, or 3
4. **No duplicate queries** - Each query is unique
5. **No duplicate slugs** - No repeated slugs in a query
6. **Query length** - Queries are 3-10 words (warning)
7. **Category presence** - Categories are specified (warning)
8. **Priority distribution** - Priorities are set (warning)
9. **Slug format** - Slugs are lowercase with hyphens
10. **Cross-subject contamination** - Slugs match subject
11. **Phase consistency** - Key stages match phase
12. **KS4 consistency** - KS4 only in secondary

### Import Generated Types

```typescript
import {
  ALL_LESSON_SLUGS,
  TOTAL_LESSON_SLUG_COUNT,
  getSubjectForSlug,
} from '../ground-truths/generated';

import { validateGroundTruthQuery } from '../ground-truths/generated';
```

Zod schemas (`RelevanceScoreSchema`, `QueryCategorySchema`, etc.) are internal
building blocks of `validateGroundTruthQuery` and are not directly exported.
Re-exporting is a one-line emitter change if a future consumer needs direct access.

## Design Decisions

### Runtime Validation

Zod schemas provide runtime validation via `validateGroundTruthQuery`:

- Schema validation at ground truth load time
- Detailed error messages for debugging
- Integration with the validation script

### Generated Code

Generated files are marked with `@generated - DO NOT EDIT`:

- Automatically regenerated from bulk data
- Changes are overwritten on next generation
- Source of truth is the generator code

## Workflow

1. **Download bulk data**: `pnpm bulk:download`
2. **Generate types**: `pnpm bulk:codegen`
3. **Create/edit ground truths** in `src/lib/search-quality/ground-truth/`
4. **Validate**: `pnpm ground-truth:validate`
5. **Run benchmarks**: `pnpm benchmark`

## Related Documentation

- [GROUND-TRUTH-GUIDE.md](../src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) - Guide for designing and evaluating ground truths
- [IR-METRICS.md](../docs/IR-METRICS.md) - Information retrieval metrics explanation
- [ADR-085: Ground Truth Validation Discipline](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)
- [ADR-098: Ground Truth Registry as Single Source of Truth](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)
- [ADR-106: Known-Answer-First Ground Truth Methodology](../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)

## Troubleshooting

### "Generated types not found"

Run `pnpm bulk:codegen` to create the types.

### "Slug not found in bulk data"

The slug in your ground truth doesn't exist. Either:

- The slug is misspelled
- The lesson was removed from the curriculum
- You need to re-download bulk data

### Type errors after bulk data update

Regenerate types: `pnpm bulk:codegen`
