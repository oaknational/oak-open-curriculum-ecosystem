/**
 * Unit tests verifying that completion context definitions are consistent
 * across Zod schemas and ES mapping overrides.
 *
 * These tests ensure that:
 * 1. ES field overrides consume contexts from the single source of truth
 * 2. Generated Zod completion context schemas match ES mapping contexts
 * 3. Per-index context sets are intentionally different (not just copy-paste errors)
 */
import { describe, expect, it } from 'vitest';

import {
  ALL_COMPLETION_CONTEXTS,
  LESSONS_COMPLETION_CONTEXTS,
  UNITS_COMPLETION_CONTEXTS,
  UNIT_ROLLUP_COMPLETION_CONTEXTS,
  SEQUENCES_COMPLETION_CONTEXTS,
  THREADS_COMPLETION_CONTEXTS,
  INDEX_COMPLETION_CONTEXTS,
} from './completion-contexts.js';
import {
  LESSONS_FIELD_OVERRIDES,
  UNITS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  SEQUENCES_FIELD_OVERRIDES,
} from './es-field-overrides.js';
import { generateCompletionContextsSchema } from './zod-schema-generator.js';

/**
 * Extracts context names from ES completion field override.
 */
function extractEsCompletionContexts(overrides: Record<string, unknown>): string[] {
  const titleSuggest = overrides.title_suggest;
  if (!titleSuggest || typeof titleSuggest !== 'object') {
    return [];
  }

  // Check for contexts property
  if (!('contexts' in titleSuggest)) {
    return [];
  }

  const contextsValue = (titleSuggest as { contexts: unknown }).contexts;
  if (!Array.isArray(contextsValue)) {
    return [];
  }

  // Type guard for context item
  const isContextItem = (item: unknown): item is { name: string } =>
    typeof item === 'object' && item !== null && 'name' in item && typeof item.name === 'string';

  const validContexts = contextsValue.filter(isContextItem);
  return validContexts.map((ctx) => ctx.name);
}

/**
 * Extracts context names from generated Zod completion contexts schema code.
 */
function extractZodContextNames(schemaCode: string): string[] {
  const contextPattern = /^\s+(\w+): z\.array/gm;
  const matches: string[] = [];
  let match;

  while ((match = contextPattern.exec(schemaCode)) !== null) {
    const contextName = match[1];
    if (contextName) {
      matches.push(contextName);
    }
  }

  return matches;
}

describe('Completion Context Alignment: ES Overrides consume source of truth', () => {
  it('LESSONS_FIELD_OVERRIDES title_suggest contexts match LESSONS_COMPLETION_CONTEXTS', () => {
    const esContexts = extractEsCompletionContexts(LESSONS_FIELD_OVERRIDES);
    const sourceContexts = [...LESSONS_COMPLETION_CONTEXTS];

    expect(esContexts).toEqual(sourceContexts);
  });

  it('UNITS_FIELD_OVERRIDES title_suggest contexts match UNITS_COMPLETION_CONTEXTS', () => {
    const esContexts = extractEsCompletionContexts(UNITS_FIELD_OVERRIDES);
    const sourceContexts = [...UNITS_COMPLETION_CONTEXTS];

    expect(esContexts).toEqual(sourceContexts);
  });

  it('UNIT_ROLLUP_FIELD_OVERRIDES title_suggest contexts match UNIT_ROLLUP_COMPLETION_CONTEXTS', () => {
    const esContexts = extractEsCompletionContexts(UNIT_ROLLUP_FIELD_OVERRIDES);
    const sourceContexts = [...UNIT_ROLLUP_COMPLETION_CONTEXTS];

    expect(esContexts).toEqual(sourceContexts);
  });

  it('SEQUENCES_FIELD_OVERRIDES title_suggest contexts match SEQUENCES_COMPLETION_CONTEXTS', () => {
    const esContexts = extractEsCompletionContexts(SEQUENCES_FIELD_OVERRIDES);
    const sourceContexts = [...SEQUENCES_COMPLETION_CONTEXTS];

    expect(esContexts).toEqual(sourceContexts);
  });
});

describe('Completion Context Alignment: Zod schemas match source of truth', () => {
  it('generated lessons Zod schema has exactly subject and key_stage', () => {
    const schema = generateCompletionContextsSchema(
      'TestLessonsContextsSchema',
      LESSONS_COMPLETION_CONTEXTS,
    );
    const zodContexts = extractZodContextNames(schema);

    expect(zodContexts).toEqual(['subject', 'key_stage']);
    expect(zodContexts).not.toContain('sequence');
    expect(zodContexts).not.toContain('phase');
  });

  it('generated units Zod schema has exactly subject, key_stage, and sequence', () => {
    const schema = generateCompletionContextsSchema(
      'TestUnitsContextsSchema',
      UNITS_COMPLETION_CONTEXTS,
    );
    const zodContexts = extractZodContextNames(schema);

    expect(zodContexts).toEqual(['subject', 'key_stage', 'sequence']);
    expect(zodContexts).not.toContain('phase');
  });

  it('generated sequences Zod schema has exactly subject and phase', () => {
    const schema = generateCompletionContextsSchema(
      'TestSequencesContextsSchema',
      SEQUENCES_COMPLETION_CONTEXTS,
    );
    const zodContexts = extractZodContextNames(schema);

    expect(zodContexts).toEqual(['subject', 'phase']);
    expect(zodContexts).not.toContain('key_stage');
    expect(zodContexts).not.toContain('sequence');
  });
});

describe('Completion Context Alignment: Index differentiation is intentional', () => {
  it('lessons and units have different context sets (units has sequence)', () => {
    expect(LESSONS_COMPLETION_CONTEXTS).not.toEqual(UNITS_COMPLETION_CONTEXTS);
    expect(UNITS_COMPLETION_CONTEXTS).toContain('sequence');
    expect(LESSONS_COMPLETION_CONTEXTS).not.toContain('sequence');
  });

  it('sequences uses phase instead of key_stage', () => {
    expect(SEQUENCES_COMPLETION_CONTEXTS).toContain('phase');
    expect(SEQUENCES_COMPLETION_CONTEXTS).not.toContain('key_stage');
  });

  it('units and unit_rollup share the same context structure', () => {
    expect(UNITS_COMPLETION_CONTEXTS).toEqual(UNIT_ROLLUP_COMPLETION_CONTEXTS);
  });

  it('threads has the minimal context set (subject only)', () => {
    expect(THREADS_COMPLETION_CONTEXTS).toEqual(['subject']);
    expect(THREADS_COMPLETION_CONTEXTS).toHaveLength(1);
  });
});

describe('Completion Context Alignment: All contexts are valid', () => {
  it('all index contexts are subsets of ALL_COMPLETION_CONTEXTS', () => {
    const allValid = new Set(ALL_COMPLETION_CONTEXTS);

    for (const ctx of LESSONS_COMPLETION_CONTEXTS) {
      expect(allValid.has(ctx)).toBe(true);
    }
    for (const ctx of UNITS_COMPLETION_CONTEXTS) {
      expect(allValid.has(ctx)).toBe(true);
    }
    for (const ctx of UNIT_ROLLUP_COMPLETION_CONTEXTS) {
      expect(allValid.has(ctx)).toBe(true);
    }
    for (const ctx of SEQUENCES_COMPLETION_CONTEXTS) {
      expect(allValid.has(ctx)).toBe(true);
    }
    for (const ctx of THREADS_COMPLETION_CONTEXTS) {
      expect(allValid.has(ctx)).toBe(true);
    }
  });

  it('INDEX_COMPLETION_CONTEXTS provides type-safe lookup', () => {
    expect(INDEX_COMPLETION_CONTEXTS.lessons).toEqual(LESSONS_COMPLETION_CONTEXTS);
    expect(INDEX_COMPLETION_CONTEXTS.units).toEqual(UNITS_COMPLETION_CONTEXTS);
    expect(INDEX_COMPLETION_CONTEXTS.unit_rollup).toEqual(UNIT_ROLLUP_COMPLETION_CONTEXTS);
    expect(INDEX_COMPLETION_CONTEXTS.sequences).toEqual(SEQUENCES_COMPLETION_CONTEXTS);
    expect(INDEX_COMPLETION_CONTEXTS.threads).toEqual(THREADS_COMPLETION_CONTEXTS);
  });
});

describe('Completion Context Alignment: Regression guard for original bug', () => {
  it('lessons documents CANNOT have sequence context (the original bug)', () => {
    // This test documents the bug that was caught by strict ES mapping
    // Lessons should NOT have sequence context - it's a unit-level concept
    const lessonsContexts = new Set(LESSONS_COMPLETION_CONTEXTS);

    expect(lessonsContexts.has('sequence' as never)).toBe(false);

    // Verify the ES override also lacks sequence
    const esContexts = extractEsCompletionContexts(LESSONS_FIELD_OVERRIDES);
    expect(esContexts).not.toContain('sequence');
  });

  it('strict dynamic mapping would reject extra contexts at runtime', () => {
    // This test verifies that our type system alignment would catch the bug
    // If someone tries to add 'sequence' to lessons contexts, the types would fail
    type LessonsContext = (typeof LESSONS_COMPLETION_CONTEXTS)[number];

    // @ts-expect-error - 'sequence' is not assignable to lessons context
    const invalidContext: LessonsContext = 'sequence';

    // This line exists to use the variable and avoid linter errors
    // The real test is the @ts-expect-error above
    expect(invalidContext).toBe('sequence');
  });
});
