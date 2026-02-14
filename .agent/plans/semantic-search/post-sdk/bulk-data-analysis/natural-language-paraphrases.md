# Natural Language Paraphrases

**Stream**: bulk-data-analysis  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-23  
**Last Updated**: 2026-01-23  
**Research**: [aliases-and-equivalances.md](../../../research/elasticsearch/oak-data/aliases-and-equivalances.md)

---

## Overview

This plan addresses **Bucket B: Pedagogy Paraphrase** from the vocabulary mining architecture. It creates mappings from natural language queries (how teachers/students actually speak) to curriculum vocabulary (the terms used in lesson content).

**Key distinction**: These are NOT synonyms (Bucket A). They are weak query-time expansions that BOOST curriculum terms when natural language is detected.

---

## The Problem

Ground truth analysis for Science identified queries where:

1. Search finds the correct lesson at #1
2. But returns unrelated lessons at #2-10
3. Because natural language doesn't expand to curriculum vocabulary

| Query | Finds | Misses | Gap |
|-------|-------|--------|-----|
| "why do things fall down" | `introduction-to-gravity` (#1) | pushes-and-pulls, air-resistance | No expansion: "fall" → "gravity" |
| "what makes ice turn into water" | Water cycle content (#1-3) | `changing-state-solid-to-liquid` | No expansion: "ice" → "melting" |
| "why do some things feel hotter" | Random content | `thermal-conductors` | No expansion: "feel hotter" → "thermal" |

**Root cause**: ELSER handles semantic similarity but doesn't bridge everyday vocabulary to curriculum terminology when the gap is too large.

---

## Architecture: Where This Fits

### The Four Buckets (from vocabulary-mining.md)

| Bucket | Name | Definition | ES Treatment |
|--------|------|------------|--------------|
| **A** | Alias | Strict equivalence | `synonym_graph` sets |
| **B** | Paraphrase | Teacher/student vernacular | **Query-time weak expansion** ← THIS PLAN |
| **C** | Sense-bound | Context-dependent meaning | Gated by subject filter |
| **D** | Relationship | Related but not equivalent | Relationship channel |

### Location in Codebase

| Component | Location |
|-----------|----------|
| Paraphrase data | `packages/sdks/oak-curriculum-sdk/src/mcp/paraphrases/` |
| Query detection | `apps/.../src/lib/hybrid-search/paraphrase-detection.ts` |
| Query boosting | `apps/.../src/lib/hybrid-search/rrf-query-helpers.ts` |

---

## Design

### Data Structure

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/paraphrases/science.ts

/**
 * Natural language → curriculum vocabulary mappings for Science.
 *
 * These are Bucket B paraphrases: weak query-time expansions.
 * NOT synonyms — "fall down" is not equivalent to "gravity".
 *
 * Categories of paraphrase (examples, not exhaustive):
 *
 * 1. SENSORY DESCRIPTIONS → PHYSICS CONCEPTS
 *    "fall down" → gravity, "feel hot" → thermal conductor
 *
 * 2. EVERYDAY PROCESSES → CURRICULUM TERMINOLOGY
 *    "turn into water" → melting, "go rusty" → oxidation
 *
 * 3. COLLOQUIAL SUBSTANCE NAMES → STATE CHANGE VOCABULARY
 *    "ice" → solid/melting, "steam" → gas/evaporation
 *
 * 4. QUESTION PHRASES → DOMAIN CONCEPTS
 *    "what makes X" → mechanism terms, "why does X" → cause terms
 */
export const scienceParaphrases = {
  // ============================================================================
  // Category 1: SENSORY DESCRIPTIONS → PHYSICS CONCEPTS
  // ============================================================================
  
  // Gravity/weight perception
  'fall down': ['gravity', 'gravitational'],
  'fall': ['gravity', 'gravitational', 'unsupported'],
  'drop': ['gravity', 'gravitational'],
  'heavy': ['weight', 'mass', 'gravity'],

  // Thermal perception
  'feel hot': ['thermal conductor', 'thermal conductivity', 'heat transfer'],
  'feel cold': ['thermal conductor', 'thermal insulator'],
  'hotter': ['thermal', 'temperature', 'heat transfer'],
  'colder': ['thermal', 'temperature', 'heat transfer'],

  // ============================================================================
  // Category 2: EVERYDAY PROCESSES → CURRICULUM TERMINOLOGY  
  // ============================================================================
  
  // Oxidation (everyday → chemistry)
  'rusty': ['rusting', 'oxidation', 'corrosion'],
  'rust': ['oxidation', 'corrosion', 'iron oxide'],
  'go rusty': ['rusting', 'oxidation', 'corrosion'],

  // Photosynthesis (everyday → biology)
  'make food': ['photosynthesis', 'glucose', 'plant nutrition'],
  'plants make food': ['photosynthesis', 'glucose'],

  // ============================================================================
  // Category 3: COLLOQUIAL SUBSTANCE NAMES → STATE CHANGE VOCABULARY
  // Query "what makes ice turn into water" matches "water cycle" instead of "melting"
  // because "water" is a strong match. These paraphrases boost the correct terms.
  // ============================================================================
  
  'turn into water': ['melting', 'melt', 'solid to liquid', 'state change'],
  'turn to ice': ['freezing', 'freeze', 'liquid to solid', 'state change'],
  'ice': ['melting', 'melt', 'solid', 'freezing', 'state change'],
  'steam': ['evaporation', 'gas', 'boiling', 'state change'],

  // ============================================================================
  // Category 4: QUESTION PHRASES → DOMAIN CONCEPTS
  // (future expansion - patterns like "what makes", "why does", "how do")
  // ============================================================================
  
} as const;
```

### Query-Time Detection

```typescript
// apps/.../src/lib/hybrid-search/paraphrase-detection.ts

import { scienceParaphrases } from '@oaknational/curriculum-sdk';

/**
 * Detects natural language phrases and returns curriculum terms to boost.
 *
 * @param query - User query text
 * @param subject - Subject filter (determines which paraphrase set to use)
 * @returns Array of curriculum terms to add as weak boosts
 */
export function detectParaphrases(
  query: string,
  subject: string,
): readonly string[] {
  const paraphrases = getParaphrasesForSubject(subject);
  const detected: string[] = [];

  for (const [phrase, terms] of Object.entries(paraphrases)) {
    if (query.toLowerCase().includes(phrase)) {
      detected.push(...terms);
    }
  }

  return [...new Set(detected)]; // Deduplicate
}
```

### Query Boosting Integration

Extend existing `createPhraseBoosters()` pattern:

```typescript
// In rrf-query-helpers.ts

export function createParaphraseBoosters(
  terms: readonly string[],
  fields: readonly string[],
  boost: number = 0.5, // WEAK boost — not strong like phrase matching
): QueryDslQueryContainer[] {
  return terms.flatMap((term) =>
    fields.map((field) => ({
      match: {
        [stripBoost(field)]: {
          query: term,
          boost,
        },
      },
    })),
  );
}
```

---

## Implementation Plan

### Phase 1: Data Creation

- [ ] Create `packages/sdks/oak-curriculum-sdk/src/mcp/paraphrases/` directory
- [ ] Create `science.ts` with initial paraphrase mappings
- [ ] Create `index.ts` aggregating all subject paraphrases
- [ ] Add type exports to SDK

### Phase 2: Detection Logic

- [ ] Create `paraphrase-detection.ts` in hybrid-search
- [ ] Add unit tests for detection
- [ ] Handle multi-word phrase matching (longest match first)

### Phase 3: Query Integration

- [ ] Add `createParaphraseBoosters()` to rrf-query-helpers
- [ ] Integrate into `buildLessonRrfRequest()`
- [ ] Add integration tests

### Phase 4: Validation

- [ ] Re-run Science benchmarks
- [ ] Measure impact on problematic queries
- [ ] Validate no regression on working queries

---

## Success Metrics

| Query | Before | Target |
|-------|--------|--------|
| "why do things fall down" | MRR 1.000, R@10 0.250 | R@10 ≥ 0.500 |
| "what makes ice turn into water" | MRR 0.250 | MRR ≥ 0.500 |
| "why do some things feel hotter" | R@10 0.250 | R@10 ≥ 0.500 |

**Aggregate target**: Science primary MRR improvement of +0.05

---

## Constraints

### MUST

- Use weak boosts (0.3-0.5), not strong boosts
- Be subject-scoped (paraphrases don't cross subjects)
- Be additive (never replace query terms)
- Pass all quality gates

### MUST NOT

- Treat paraphrases as synonyms
- Apply paraphrases without subject filter
- Use boost > 1.0 (would dominate BM25)

---

## Dependencies

- [ ] Ground truth review complete (to validate measurements)
- [x] Synonym architecture stable (`science.ts` Bucket A complete)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [vocabulary-mining.md](vocabulary-mining.md) | Parent plan |
| [aliases-and-equivalances.md](../../../research/elasticsearch/oak-data/aliases-and-equivalances.md) | Bucket definitions |
| [rrf-query-helpers.ts](../../../../apps/oak-search-cli/src/lib/hybrid-search/rrf-query-helpers.ts) | Query building |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../directives/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives/schema-first-execution.md) — Generator is source of truth
