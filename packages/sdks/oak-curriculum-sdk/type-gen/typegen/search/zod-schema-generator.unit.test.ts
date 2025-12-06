/**
 * Unit tests for Zod schema generation from field definitions.
 * Tests the pure function that converts IndexFieldDefinitions to Zod schema code.
 */
import { describe, expect, it } from 'vitest';

import { type IndexFieldDefinitions } from './field-definitions.js';
import {
  LESSONS_COMPLETION_CONTEXTS,
  SEQUENCES_COMPLETION_CONTEXTS,
  UNITS_COMPLETION_CONTEXTS,
} from './completion-contexts.js';
import {
  generateZodFieldCode,
  generateZodSchemaFromFields,
  generateCompletionContextsSchema,
  ZOD_ENUM_EXPRESSIONS,
} from './zod-schema-generator.js';

describe('generateZodFieldCode', () => {
  it('generates required string field as z.string().min(1)', () => {
    const code = generateZodFieldCode({
      name: 'unit_id',
      zodType: 'string',
      optional: false,
    });

    expect(code).toBe('unit_id: z.string().min(1),');
  });

  it('generates optional string field with .optional()', () => {
    const code = generateZodFieldCode({
      name: 'description',
      zodType: 'string',
      optional: true,
    });

    expect(code).toBe('description: z.string().min(1).optional(),');
  });

  it('generates required number field as z.number().int().nonnegative()', () => {
    const code = generateZodFieldCode({
      name: 'lesson_count',
      zodType: 'number',
      optional: false,
    });

    expect(code).toBe('lesson_count: z.number().int().nonnegative(),');
  });

  it('generates optional number field with .optional()', () => {
    const code = generateZodFieldCode({
      name: 'order',
      zodType: 'number',
      optional: true,
    });

    expect(code).toBe('order: z.number().int().nonnegative().optional(),');
  });

  it('generates required array-string field as z.array(z.string().min(1))', () => {
    const code = generateZodFieldCode({
      name: 'lesson_ids',
      zodType: 'array-string',
      optional: false,
    });

    expect(code).toBe('lesson_ids: z.array(z.string().min(1)),');
  });

  it('generates optional array-string field with .optional()', () => {
    const code = generateZodFieldCode({
      name: 'years',
      zodType: 'array-string',
      optional: true,
    });

    expect(code).toBe('years: z.array(z.string().min(1)).optional(),');
  });

  it('generates required array-number field as z.array(z.number())', () => {
    const code = generateZodFieldCode({
      name: 'scores',
      zodType: 'array-number',
      optional: false,
    });

    expect(code).toBe('scores: z.array(z.number()),');
  });

  it('generates optional array-number field with .optional()', () => {
    const code = generateZodFieldCode({
      name: 'thread_orders',
      zodType: 'array-number',
      optional: true,
    });

    expect(code).toBe('thread_orders: z.array(z.number()).optional(),');
  });

  it('generates enum field using enumRef without expressions', () => {
    const code = generateZodFieldCode({
      name: 'subject_slug',
      zodType: 'string',
      optional: false,
      enumRef: 'SUBJECT_TUPLE',
    });

    // Without enumExpressions, uses the ref as-is
    expect(code).toBe('subject_slug: z.enum(SUBJECT_TUPLE),');
  });

  it('generates enum field with resolved expression when provided', () => {
    const code = generateZodFieldCode(
      {
        name: 'subject_slug',
        zodType: 'string',
        optional: false,
        enumRef: 'SUBJECT_TUPLE',
      },
      { enumExpressions: ZOD_ENUM_EXPRESSIONS },
    );

    expect(code).toBe(
      'subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),',
    );
  });

  it('generates optional enum field with .optional()', () => {
    const code = generateZodFieldCode(
      {
        name: 'optional_key_stage',
        zodType: 'string',
        optional: true,
        enumRef: 'KEY_STAGE_TUPLE',
      },
      { enumExpressions: ZOD_ENUM_EXPRESSIONS },
    );

    expect(code).toBe(
      'optional_key_stage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]).optional(),',
    );
  });

  it('generates object field referencing SearchCompletionSuggestPayloadSchema', () => {
    const code = generateZodFieldCode({
      name: 'title_suggest',
      zodType: 'object',
      optional: true,
    });

    expect(code).toBe('title_suggest: SearchCompletionSuggestPayloadSchema.optional(),');
  });

  it('generates required object field without .optional()', () => {
    const code = generateZodFieldCode({
      name: 'metadata',
      zodType: 'object',
      optional: false,
    });

    expect(code).toBe('metadata: SearchCompletionSuggestPayloadSchema,');
  });
});

describe('generateZodSchemaFromFields', () => {
  it('generates a complete Zod schema with all fields', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'id', zodType: 'string', optional: false },
      { name: 'count', zodType: 'number', optional: false },
      { name: 'tags', zodType: 'array-string', optional: true },
    ];

    const code = generateZodSchemaFromFields('TestSchema', fields);

    expect(code).toContain('export const TestSchema = z');
    expect(code).toContain('.object({');
    expect(code).toContain('id: z.string().min(1),');
    expect(code).toContain('count: z.number().int().nonnegative(),');
    expect(code).toContain('tags: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('})');
    expect(code).toContain('.strict();');
  });

  it('uses correct indentation for fields', () => {
    const fields: IndexFieldDefinitions = [{ name: 'id', zodType: 'string', optional: false }];

    const code = generateZodSchemaFromFields('TestSchema', fields);

    // Field should be indented with 4 spaces
    expect(code).toContain('    id: z.string().min(1),');
  });

  it('generates schema with enum references (resolved)', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
      { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
    ];

    const code = generateZodSchemaFromFields('FilterSchema', fields, ZOD_ENUM_EXPRESSIONS);

    expect(code).toContain('subject_slug: z.enum(SUBJECTS as unknown as');
    expect(code).toContain('key_stage: z.enum(KEY_STAGES as unknown as');
  });

  it('generates units schema matching expected structure', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'unit_id', zodType: 'string', optional: false },
      { name: 'unit_slug', zodType: 'string', optional: false },
      { name: 'unit_title', zodType: 'string', optional: false },
      { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
      { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
      { name: 'years', zodType: 'array-string', optional: true },
      { name: 'lesson_ids', zodType: 'array-string', optional: false },
      { name: 'lesson_count', zodType: 'number', optional: false },
      { name: 'unit_topics', zodType: 'array-string', optional: true },
      { name: 'unit_url', zodType: 'string', optional: false },
      { name: 'subject_programmes_url', zodType: 'string', optional: false },
      { name: 'sequence_ids', zodType: 'array-string', optional: true },
      { name: 'thread_slugs', zodType: 'array-string', optional: true },
      { name: 'thread_titles', zodType: 'array-string', optional: true },
      { name: 'thread_orders', zodType: 'array-number', optional: true },
      { name: 'title_suggest', zodType: 'object', optional: true },
    ];

    const code = generateZodSchemaFromFields(
      'SearchUnitsIndexDocSchema',
      fields,
      ZOD_ENUM_EXPRESSIONS,
    );

    // Verify structure
    expect(code).toContain('export const SearchUnitsIndexDocSchema = z');
    expect(code).toContain('.object({');
    expect(code).toContain('.strict();');

    // Verify key fields
    expect(code).toContain('unit_id: z.string().min(1),');
    expect(code).toContain('subject_slug: z.enum(SUBJECTS as unknown as');
    expect(code).toContain('key_stage: z.enum(KEY_STAGES as unknown as');
    expect(code).toContain('lesson_count: z.number().int().nonnegative(),');
    expect(code).toContain('title_suggest: SearchCompletionSuggestPayloadSchema.optional(),');
  });
});

describe('generateCompletionContextsSchema', () => {
  it('generates schema with only subject and key_stage for lessons', () => {
    const code = generateCompletionContextsSchema(
      'SearchLessonsCompletionContextsSchema',
      LESSONS_COMPLETION_CONTEXTS,
    );

    expect(code).toContain('export const SearchLessonsCompletionContextsSchema = z');
    expect(code).toContain('.object({');
    expect(code).toContain('subject: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('key_stage: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('.strict();');

    // Must NOT include sequence or phase (they are not in LESSONS_COMPLETION_CONTEXTS)
    expect(code).not.toContain('sequence:');
    expect(code).not.toContain('phase:');
  });

  it('generates schema with subject, key_stage, and sequence for units', () => {
    const code = generateCompletionContextsSchema(
      'SearchUnitsCompletionContextsSchema',
      UNITS_COMPLETION_CONTEXTS,
    );

    expect(code).toContain('subject: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('key_stage: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('sequence: z.array(z.string().min(1)).optional(),');

    // Must NOT include phase
    expect(code).not.toContain('phase:');
  });

  it('generates schema with subject and phase for sequences', () => {
    const code = generateCompletionContextsSchema(
      'SearchSequenceCompletionContextsSchema',
      SEQUENCES_COMPLETION_CONTEXTS,
    );

    expect(code).toContain('subject: z.array(z.string().min(1)).optional(),');
    expect(code).toContain('phase: z.array(z.string().min(1)).optional(),');

    // Must NOT include key_stage or sequence
    expect(code).not.toContain('key_stage:');
    expect(code).not.toContain('sequence:');
  });

  it('produces properly indented schema code', () => {
    const code = generateCompletionContextsSchema('TestContextsSchema', [
      'subject',
      'key_stage',
    ] as const);

    // Check proper indentation (4 spaces for fields)
    expect(code).toContain('    subject:');
    expect(code).toContain('    key_stage:');
  });

  it('uses .strict() to reject extra contexts at runtime', () => {
    const code = generateCompletionContextsSchema('TestContextsSchema', ['subject'] as const);

    expect(code).toContain('.strict();');
  });
});
