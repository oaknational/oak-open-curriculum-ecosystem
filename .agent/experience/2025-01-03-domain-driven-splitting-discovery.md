# Domain-Driven Splitting: Finding Balance in Biological Architecture

## Date: 2025-01-03

## Context

During Phase 3 of the biological architecture transformation, we attempted to flatten the deeply nested logging module (5 levels deep) by consolidating related files. This led to an unexpected discovery about the nature of modular boundaries.

## The Problem

Initial consolidation created monolithic files:

- Pretty formatter: 621 lines (from 15 files)
- Console transport: 309 lines (from 7 files)
- File transport: 380 lines (from 6 files)

These violated our linting rules (190 line limit) but more importantly, they felt wrong - too much complexity in single files.

## The Discovery

**Domain-driven splitting** emerged as the solution. Instead of arbitrary file size limits or deep nesting, we split along natural responsibility boundaries:

### Pretty Formatter Example

```
pretty.ts (621 lines) →
  - pretty-types.ts (type definitions)
  - pretty-colors.ts (color utilities)
  - pretty-levels.ts (level formatting)
  - pretty-text.ts (text utilities)
  - pretty-serializers.ts (object/error serialization)
  - pretty-layouts.ts (layout implementations)
  - pretty-factories.ts (factory functions)
  - pretty-index.ts (public API)
```

Each file now has a single, clear responsibility - like organelles within a cell.

## Key Insights

### 1. Balance Through Natural Boundaries

Neither extreme works:

- Deep nesting (5 levels) = artificial complexity
- Massive consolidation (600+ lines) = cognitive overload

The sweet spot: files split along domain boundaries, typically 50-180 lines.

### 2. Lint Warnings as Architecture Detectors

The 94 parent import warnings aren't failures - they're **architectural truth detectors**. They show where modules are reaching across boundaries that shouldn't exist, revealing the natural fault lines in the codebase.

### 3. Cellular Architecture Emerges Naturally

When we split by domain rather than size:

- Each file becomes a "cell" with clear purpose
- Barrel exports (index.ts) form the "cell membrane"
- Pure functions inside are "organelles"
- No arbitrary boundaries, only natural ones

### 4. The Refactoring Pattern

1. Consolidate deeply nested files
2. Identify distinct responsibilities within the large file
3. Extract each responsibility to its own module
4. Create barrel export as public API
5. Let import warnings guide system boundaries

## Implications

This discovery validates the biological architecture metaphor. Just as biological cells have optimal sizes determined by physics (surface area to volume ratio), software modules have optimal sizes determined by cognitive load and responsibility boundaries.

The 2-level depth limit isn't arbitrary - it's the natural boundary between:

- Level 0: System/organ boundary
- Level 1: Module/cell boundary
- Level 2: Implementation/organelle details

## Application to Next Phases

For the Systems Phase, we should:

1. Use the 94 import warnings as a map of where to create system boundaries
2. Don't force consolidation - let domain boundaries emerge
3. Trust the biological metaphor - it's revealing deep truths about software organization

## Mathematical Connection

This aligns with the stability principles from complex systems theory - heterogeneity at appropriate scales is essential for stability. Our domain-driven modules provide the right level of heterogeneity, neither too fine-grained nor too coarse.

The import warnings are like chemical gradients in biology - they show where different systems meet and where membranes should form.
