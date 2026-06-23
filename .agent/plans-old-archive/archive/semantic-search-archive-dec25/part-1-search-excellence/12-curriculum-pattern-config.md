# 12: Curriculum Pattern Static Configuration

**Status**: 📋 PLANNED  
**Priority**: High (Required for complete ingestion)  
**Created**: 2025-12-28  
**Prerequisite For**: Complete ES ingestion of all 17 subjects  
**Related**:

- [ADR-080: Comprehensive Curriculum Data Denormalisation Strategy](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)
- [Curriculum Traversal Strategy](../../../curriculum-traversal-strategy.md)
- [Curriculum Structure Analysis](../../../curriculum-structure-analysis.md)

---

## Problem Statement

The Oak Curriculum API has **7 distinct structural patterns** that require different traversal strategies. Currently, the ingestion pipeline does not account for these patterns, leading to:

1. **Missing data**: Science KS4 returns empty via `/key-stages/ks4/subject/science/lessons`
2. **Missing metadata**: Maths KS4 tier associations not captured
3. **Incomplete relationships**: Unit options in English/Geography not tracked

### Current State

The ingestion pipeline uses a single traversal strategy:

```typescript
// Current: Simple approach that doesn't handle patterns
const lessons = await getLessonsForSubject(subject, keyStage);
```

### Target State

Pattern-aware traversal with static configuration and runtime validation:

```typescript
// Target: Pattern-aware approach
const pattern = CURRICULUM_PATTERNS[`${subject}:${keyStage}`];
const lessons = await traverseWithPattern(subject, keyStage, pattern);
validateResponseMatchesPattern(response, pattern);
```

---

## Why Static Configuration Over Dynamic Detection

### Recommendation: Static Pattern Config with Validation

**Static encoding is preferred** because:

| Factor | Static Config | Dynamic Detection |
|--------|--------------|-------------------|
| Type Safety | ✅ Discriminated unions, exhaustive matching | ❌ Runtime type narrowing |
| Performance | ✅ No detection overhead | ❌ Pattern sniffing on every call |
| Predictability | ✅ Known at compile time | ❌ May vary with API changes |
| Breaking Changes | ✅ Build-time failure if config stale | ❌ Silent runtime failures |
| Maintainability | ✅ Single source of truth | ❌ Detection logic scattered |

### Assumptions

1. **Patterns are stable**: Oak would need to restructure their entire curriculum database to change patterns
2. **Breaking changes should fail loudly**: If patterns change, we want build-time or startup-time failure
3. **API contract is stable**: The API schema defines the response shapes we expect
4. **Schema-first applies**: Pattern config should be derivable from API schema where possible

---

## Implementation Plan

### Phase 1: Pattern Type Definitions (SDK)

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/curriculum-patterns.ts`

```typescript
/**
 * Curriculum structural patterns.
 * Defines how to traverse the API for different subject × key stage combinations.
 *
 * @see ADR-080 for full documentation
 */

/** The 7 identified structural patterns */
export type CurriculumPattern =
  | 'simple-flat'        // Patterns 1 & 2: year → units[] → lessons[]
  | 'tier-variants'      // Pattern 3: year → tiers[] → units[]
  | 'exam-board-variants'// Pattern 4: Multiple sequences per subject
  | 'exam-subject-split' // Pattern 5: year → examSubjects[] → tiers[] → units[]
  | 'unit-options'       // Pattern 6: units have unitOptions[]
  | 'no-ks4'            // Pattern 7: No KS4 content
  | 'empty';             // Edge case: No content for this combination

/** Key stage slugs */
export type KeyStageSlug = 'ks1' | 'ks2' | 'ks3' | 'ks4';

/** Subject × KeyStage combination key */
export type SubjectKeyStageKey = `${string}:${KeyStageSlug}`;

/** Pattern configuration for a subject × key stage combination */
export interface PatternConfig {
  /** Primary pattern for this combination */
  pattern: CurriculumPattern;
  
  /** Additional patterns that combine with the primary */
  combinesWith?: CurriculumPattern[];
  
  /** Required traversal approach */
  traversal: 'key-stage-lessons' | 'sequence-units' | 'skip';
  
  /** For exam board variants: the sequence slugs to query */
  sequences?: string[];
  
  /** Human-readable notes for debugging */
  notes?: string;
}

/** Complete pattern configuration map */
export type CurriculumPatternConfig = Record<SubjectKeyStageKey, PatternConfig>;
```

### Phase 2: Static Configuration Data

**Location**: `packages/sdks/oak-curriculum-sdk/src/data/curriculum-pattern-config.ts`

```typescript
import type { CurriculumPatternConfig } from '../types/curriculum-patterns.js';

/**
 * Static curriculum pattern configuration.
 *
 * This is the SINGLE SOURCE OF TRUTH for how to traverse the curriculum API.
 * If the API structure changes, this file must be updated and all downstream
 * consumers will fail validation until updated.
 *
 * @see ADR-080 for pattern documentation
 * @see .agent/plans/curriculum-traversal-strategy.md for traversal algorithm
 */
export const CURRICULUM_PATTERN_CONFIG: CurriculumPatternConfig = {
  // ========== MATHS ==========
  'maths:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks4': {
    pattern: 'tier-variants',
    traversal: 'sequence-units',
    sequences: ['maths-secondary'],
    notes: 'Must extract tier from response.tiers[]. No exam boards.',
  },

  // ========== SCIENCE ==========
  'science:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks4': {
    pattern: 'exam-subject-split',
    combinesWith: ['exam-board-variants', 'tier-variants'],
    traversal: 'sequence-units',
    sequences: ['science-secondary-aqa', 'science-secondary-edexcel', 'science-secondary-ocr'],
    notes: 'CRITICAL: /key-stages/ks4/subject/science/lessons returns EMPTY. Must traverse examSubjects → tiers → units.',
  },

  // ========== ENGLISH ==========
  'english:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks4': {
    pattern: 'exam-board-variants',
    combinesWith: ['unit-options'],
    traversal: 'sequence-units',
    sequences: ['english-secondary-aqa', 'english-secondary-edexcel', 'english-secondary-eduqas'],
    notes: 'Has unit options for text choices (e.g., different novels)',
  },

  // ... (continue for all 17 subjects × 4 key stages = 68 combinations)

  // ========== COOKING-NUTRITION (Pattern 7: No KS4) ==========
  'cooking-nutrition:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks4': { pattern: 'no-ks4', traversal: 'skip' },
} as const;
```

### Phase 3: Validation Functions

**Location**: `packages/sdks/oak-curriculum-sdk/src/lib/curriculum-pattern-validation.ts`

```typescript
import type { CurriculumPattern, PatternConfig } from '../types/curriculum-patterns.js';

/**
 * Validate that an API response matches the expected pattern.
 *
 * @throws CurriculumContractViolationError if response doesn't match pattern
 */
export function validateResponseMatchesPattern(
  response: unknown,
  expectedPattern: PatternConfig,
  context: { subject: string; keyStage: string }
): void {
  const detectedPattern = detectPatternFromResponse(response);

  if (detectedPattern !== expectedPattern.pattern) {
    throw new CurriculumContractViolationError({
      subject: context.subject,
      keyStage: context.keyStage,
      expectedPattern: expectedPattern.pattern,
      detectedPattern,
      response: JSON.stringify(response, null, 2).slice(0, 500),
      resolution: `API structure for ${context.subject}:${context.keyStage} has changed. Update CURRICULUM_PATTERN_CONFIG and ADR-080.`,
    });
  }
}

/**
 * Detect pattern from response shape.
 * Used for validation, NOT for primary traversal logic.
 */
export function detectPatternFromResponse(response: unknown): CurriculumPattern {
  if (!response || typeof response !== 'object') return 'empty';

  const data = 'data' in response ? (response as { data: unknown[] }).data : [];
  if (!Array.isArray(data) || data.length === 0) return 'empty';

  const yearData = data[0] as Record<string, unknown>;

  if ('examSubjects' in yearData && Array.isArray(yearData.examSubjects)) {
    return 'exam-subject-split';
  }

  if ('tiers' in yearData && Array.isArray(yearData.tiers)) {
    return 'tier-variants';
  }

  const units = 'units' in yearData ? (yearData.units as unknown[]) : [];
  if (Array.isArray(units) && units.some((u) => 'unitOptions' in (u as object))) {
    return 'unit-options';
  }

  return 'simple-flat';
}

/**
 * Error thrown when API response doesn't match expected pattern.
 * Designed to provide actionable debugging information.
 */
export class CurriculumContractViolationError extends Error {
  constructor(public readonly details: {
    subject: string;
    keyStage: string;
    expectedPattern: CurriculumPattern;
    detectedPattern: CurriculumPattern;
    response: string;
    resolution: string;
  }) {
    super(
      `Curriculum contract violation: ${details.subject}:${details.keyStage}\n` +
      `Expected pattern "${details.expectedPattern}" but detected "${details.detectedPattern}".\n\n` +
      `This indicates the Oak API structure has changed.\n` +
      `${details.resolution}\n\n` +
      `See: docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md\n\n` +
      `Response snapshot:\n${details.response}`
    );
    this.name = 'CurriculumContractViolationError';
  }
}
```

### Phase 4: Startup Validation

**Location**: `apps/oak-search-cli/src/lib/indexing/validate-curriculum-patterns.ts`

```typescript
import { CURRICULUM_PATTERN_CONFIG } from '@oakai/curriculum-sdk/data/curriculum-pattern-config.js';
import { validateResponseMatchesPattern } from '@oakai/curriculum-sdk/lib/curriculum-pattern-validation.js';
import { getSequenceUnits } from '@oakai/curriculum-sdk/client.js';

/**
 * Validate that the static pattern configuration matches the live API.
 *
 * Run this:
 * 1. At ingestion startup (before processing)
 * 2. As a scheduled health check
 * 3. After Oak API version updates
 *
 * @throws If any pattern configuration is stale
 */
export async function validateCurriculumPatternConfig(): Promise<void> {
  const errors: string[] = [];

  // Sample validation: Test one combination per unique pattern
  const patternSamples = [
    { key: 'maths:ks1', sequences: null }, // simple-flat
    { key: 'maths:ks4', sequences: ['maths-secondary'] }, // tier-variants
    { key: 'science:ks4', sequences: ['science-secondary-aqa'] }, // exam-subject-split
    { key: 'english:ks4', sequences: ['english-secondary-aqa'] }, // unit-options
  ];

  for (const sample of patternSamples) {
    const [subject, keyStage] = sample.key.split(':') as [string, KeyStageSlug];
    const config = CURRICULUM_PATTERN_CONFIG[sample.key as SubjectKeyStageKey];

    if (!config) {
      errors.push(`Missing pattern config for ${sample.key}`);
      continue;
    }

    if (config.traversal === 'skip') continue;

    try {
      // Fetch a sample response
      const sequence = config.sequences?.[0] ?? `${subject}-${keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary'}`;
      const year = keyStage === 'ks4' ? 10 : keyStage === 'ks3' ? 7 : keyStage === 'ks2' ? 3 : 1;
      const response = await getSequenceUnits(sequence, year);

      validateResponseMatchesPattern(response, config, { subject, keyStage });
    } catch (error) {
      errors.push(`${sample.key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Curriculum pattern validation failed:\n\n${errors.join('\n\n')}\n\n` +
      `The static pattern configuration is out of sync with the live API.\n` +
      `See: docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md`
    );
  }
}
```

### Phase 5: Pattern-Aware Traversal

**Location**: `apps/oak-search-cli/src/lib/indexing/pattern-aware-traversal.ts`

```typescript
import { CURRICULUM_PATTERN_CONFIG } from '@oakai/curriculum-sdk/data/curriculum-pattern-config.js';
import { validateResponseMatchesPattern } from '@oakai/curriculum-sdk/lib/curriculum-pattern-validation.js';

/**
 * Traverse curriculum data using the appropriate pattern for each subject × key stage.
 *
 * This replaces the current simple traversal with pattern-aware logic.
 */
export async function traverseWithPattern(
  subject: string,
  keyStage: KeyStageSlug,
  options: TraversalOptions
): Promise<TraversalResult> {
  const key = `${subject}:${keyStage}` as SubjectKeyStageKey;
  const config = CURRICULUM_PATTERN_CONFIG[key];

  if (!config) {
    throw new Error(`No pattern configuration for ${key}. Add to CURRICULUM_PATTERN_CONFIG.`);
  }

  switch (config.traversal) {
    case 'skip':
      return { lessons: [], units: [], skipped: true };

    case 'key-stage-lessons':
      return traverseViaKeyStage(subject, keyStage, options);

    case 'sequence-units':
      return traverseViaSequences(subject, keyStage, config, options);

    default:
      throw new Error(`Unknown traversal type: ${config.traversal}`);
  }
}

async function traverseViaSequences(
  subject: string,
  keyStage: KeyStageSlug,
  config: PatternConfig,
  options: TraversalOptions
): Promise<TraversalResult> {
  const results: TraversalResult = { lessons: [], units: [], skipped: false };

  for (const sequence of config.sequences ?? []) {
    const years = getYearsForKeyStage(keyStage);

    for (const year of years) {
      const response = await getSequenceUnits(sequence, year);

      // Validate response matches expected pattern
      validateResponseMatchesPattern(response, config, { subject, keyStage });

      // Process according to pattern
      switch (config.pattern) {
        case 'tier-variants':
          await processTierVariants(response, results, { subject, keyStage, sequence });
          break;

        case 'exam-subject-split':
          await processExamSubjectSplit(response, results, { subject, keyStage, sequence });
          break;

        case 'unit-options':
          await processUnitOptions(response, results, { subject, keyStage, sequence });
          break;

        default:
          await processSimpleUnits(response, results, { subject, keyStage, sequence });
      }
    }
  }

  return results;
}
```

---

## Acceptance Criteria

### Must Have

- [ ] Pattern types defined in SDK (`CurriculumPattern`, `PatternConfig`)
- [ ] Complete static configuration for all 68 subject × key stage combinations
- [ ] Validation function that detects pattern from response
- [ ] `CurriculumContractViolationError` with actionable error messages
- [ ] Pattern-aware traversal replaces current simple traversal
- [ ] All quality gates pass

### Should Have

- [ ] Startup validation that samples each unique pattern
- [ ] CLI flag to run validation without full ingestion
- [ ] Documentation updated (ADR-080, README)

### Could Have

- [ ] Scheduled health check for pattern validation
- [ ] Telemetry for pattern mismatches (non-throwing mode)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pattern config becomes stale | Missing/incorrect data | Startup validation + actionable errors |
| New subject added to API | 404 or incomplete data | Validation fails loudly; add to config |
| Pattern changes mid-ingestion | Partial data corruption | Atomic batch ingestion (ADR-087) |
| Config file grows large | Maintenance burden | Group by subject; consider code generation |

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| ADR-080 | ✅ Complete | Documents all 7 patterns |
| Curriculum traversal strategy | ✅ Complete | Documents traversal algorithm |
| ADR-087 Batch-atomic ingestion | 📋 Planned | Ensures partial failures don't corrupt |

---

## Future Considerations

### Code Generation

The pattern config could be partially generated from the API schema at `pnpm type-gen` time:

1. Query `/subjects` to get all subjects and their sequences
2. Query each sequence to detect pattern shape
3. Generate `curriculum-pattern-config.ts` automatically

This would align with the Cardinal Rule (all type info from schema at compile time).

### Pattern Discovery Mode

For initial population or verification, a "discovery mode" could:

1. Query every subject × key stage combination
2. Detect patterns from responses
3. Generate suggested config file
4. Human reviews and commits

---

## Related Documents

- [ADR-080: Comprehensive Curriculum Data Denormalisation Strategy](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)
- [Curriculum Traversal Strategy](../../../curriculum-traversal-strategy.md)
- [Curriculum Structure Analysis](../../../curriculum-structure-analysis.md)
- [05-complete-data-indexing.md](./05-complete-data-indexing.md)
- [Cardinal Rule](../../../directives/principles.md)

