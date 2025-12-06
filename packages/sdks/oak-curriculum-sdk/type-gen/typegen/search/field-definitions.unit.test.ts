/**
 * Unit tests for search index field definitions.
 * Tests the shared field definition types and constants used by both
 * Zod schema and ES mapping generators.
 */
import { describe, expect, it } from 'vitest';

import {
  type FieldDefinition,
  type IndexFieldDefinitions,
  THREADS_INDEX_FIELDS,
  LESSONS_INDEX_FIELDS,
  UNITS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
} from './field-definitions/index.js';

describe('FieldDefinition interface', () => {
  it('allows creating a required string field definition', () => {
    const field: FieldDefinition = {
      name: 'test_field',
      zodType: 'string',
      optional: false,
    };

    expect(field.name).toBe('test_field');
    expect(field.zodType).toBe('string');
    expect(field.optional).toBe(false);
  });

  it('allows creating an optional array-string field definition', () => {
    const field: FieldDefinition = {
      name: 'tags',
      zodType: 'array-string',
      optional: true,
    };

    expect(field.name).toBe('tags');
    expect(field.zodType).toBe('array-string');
    expect(field.optional).toBe(true);
  });

  it('allows creating a field with enum reference', () => {
    const field: FieldDefinition = {
      name: 'subject_slug',
      zodType: 'string',
      optional: false,
      enumRef: 'SUBJECT_TUPLE',
    };

    expect(field.enumRef).toBe('SUBJECT_TUPLE');
  });

  it('allows creating an object field definition', () => {
    const field: FieldDefinition = {
      name: 'title_suggest',
      zodType: 'object',
      optional: true,
    };

    expect(field.zodType).toBe('object');
  });
});

describe('IndexFieldDefinitions type', () => {
  it('accepts a readonly array of FieldDefinition', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'id', zodType: 'string', optional: false },
      { name: 'count', zodType: 'number', optional: false },
    ] as const;

    expect(fields).toHaveLength(2);
  });
});

describe('UNITS_INDEX_FIELDS', () => {
  it('has exactly 16 fields', () => {
    expect(UNITS_INDEX_FIELDS).toHaveLength(16);
  });

  it('contains all expected field names in order', () => {
    const expectedNames = [
      'unit_id',
      'unit_slug',
      'unit_title',
      'subject_slug',
      'key_stage',
      'years',
      'lesson_ids',
      'lesson_count',
      'unit_topics',
      'unit_url',
      'subject_programmes_url',
      'sequence_ids',
      'thread_slugs',
      'thread_titles',
      'thread_orders',
      'title_suggest',
    ];

    const actualNames = UNITS_INDEX_FIELDS.map((f) => f.name);
    expect(actualNames).toEqual(expectedNames);
  });

  it('marks unit_id as required string', () => {
    const unitId = UNITS_INDEX_FIELDS.find((f) => f.name === 'unit_id');
    expect(unitId).toBeDefined();
    expect(unitId?.zodType).toBe('string');
    expect(unitId?.optional).toBe(false);
  });

  it('marks subject_slug as required string with SUBJECT_TUPLE enum', () => {
    const subjectSlug = UNITS_INDEX_FIELDS.find((f) => f.name === 'subject_slug');
    expect(subjectSlug).toBeDefined();
    expect(subjectSlug?.zodType).toBe('string');
    expect(subjectSlug?.optional).toBe(false);
    expect(subjectSlug?.enumRef).toBe('SUBJECT_TUPLE');
  });

  it('marks key_stage as required string with KEY_STAGE_TUPLE enum', () => {
    const keyStage = UNITS_INDEX_FIELDS.find((f) => f.name === 'key_stage');
    expect(keyStage).toBeDefined();
    expect(keyStage?.zodType).toBe('string');
    expect(keyStage?.optional).toBe(false);
    expect(keyStage?.enumRef).toBe('KEY_STAGE_TUPLE');
  });

  it('marks years as optional array-string', () => {
    const years = UNITS_INDEX_FIELDS.find((f) => f.name === 'years');
    expect(years).toBeDefined();
    expect(years?.zodType).toBe('array-string');
    expect(years?.optional).toBe(true);
  });

  it('marks lesson_ids as required array-string', () => {
    const lessonIds = UNITS_INDEX_FIELDS.find((f) => f.name === 'lesson_ids');
    expect(lessonIds).toBeDefined();
    expect(lessonIds?.zodType).toBe('array-string');
    expect(lessonIds?.optional).toBe(false);
  });

  it('marks lesson_count as required number', () => {
    const lessonCount = UNITS_INDEX_FIELDS.find((f) => f.name === 'lesson_count');
    expect(lessonCount).toBeDefined();
    expect(lessonCount?.zodType).toBe('number');
    expect(lessonCount?.optional).toBe(false);
  });

  it('marks thread_orders as optional array-number', () => {
    const threadOrders = UNITS_INDEX_FIELDS.find((f) => f.name === 'thread_orders');
    expect(threadOrders).toBeDefined();
    expect(threadOrders?.zodType).toBe('array-number');
    expect(threadOrders?.optional).toBe(true);
  });

  it('marks title_suggest as optional object', () => {
    const titleSuggest = UNITS_INDEX_FIELDS.find((f) => f.name === 'title_suggest');
    expect(titleSuggest).toBeDefined();
    expect(titleSuggest?.zodType).toBe('object');
    expect(titleSuggest?.optional).toBe(true);
  });

  it('has correct required vs optional field counts', () => {
    const requiredFields = UNITS_INDEX_FIELDS.filter((f) => !f.optional);
    const optionalFields = UNITS_INDEX_FIELDS.filter((f) => f.optional);

    // Required: unit_id, unit_slug, unit_title, subject_slug, key_stage,
    //           lesson_ids, lesson_count, unit_url, subject_programmes_url
    expect(requiredFields).toHaveLength(9);

    // Optional: years, unit_topics, sequence_ids, thread_slugs,
    //           thread_titles, thread_orders, title_suggest
    expect(optionalFields).toHaveLength(7);
  });
});

describe('THREADS_INDEX_FIELDS', () => {
  it('has exactly 7 fields', () => {
    expect(THREADS_INDEX_FIELDS).toHaveLength(7);
  });

  it('contains expected field names', () => {
    const fieldNames = THREADS_INDEX_FIELDS.map((f) => f.name);
    expect(fieldNames).toContain('thread_slug');
    expect(fieldNames).toContain('thread_title');
    expect(fieldNames).toContain('unit_count');
    expect(fieldNames).toContain('title_suggest');
  });

  it('has 4 required and 3 optional fields', () => {
    const required = THREADS_INDEX_FIELDS.filter((f) => !f.optional);
    const optional = THREADS_INDEX_FIELDS.filter((f) => f.optional);
    // Required: thread_slug, thread_title, unit_count, thread_url
    expect(required).toHaveLength(4);
    // Optional: subject_slugs, thread_semantic, title_suggest
    expect(optional).toHaveLength(3);
  });
});

describe('LESSONS_INDEX_FIELDS', () => {
  it('has exactly 21 fields', () => {
    expect(LESSONS_INDEX_FIELDS).toHaveLength(21);
  });

  it('contains expected field names', () => {
    const fieldNames = LESSONS_INDEX_FIELDS.map((f) => f.name);
    expect(fieldNames).toContain('lesson_id');
    expect(fieldNames).toContain('lesson_title');
    expect(fieldNames).toContain('transcript_text');
    expect(fieldNames).toContain('lesson_semantic');
    expect(fieldNames).toContain('title_suggest');
  });

  it('has subject_slug with SUBJECT_TUPLE enum', () => {
    const field = LESSONS_INDEX_FIELDS.find((f) => f.name === 'subject_slug');
    expect(field?.enumRef).toBe('SUBJECT_TUPLE');
  });

  it('has key_stage with KEY_STAGE_TUPLE enum', () => {
    const field = LESSONS_INDEX_FIELDS.find((f) => f.name === 'key_stage');
    expect(field?.enumRef).toBe('KEY_STAGE_TUPLE');
  });
});

describe('UNIT_ROLLUP_INDEX_FIELDS', () => {
  it('has exactly 18 fields', () => {
    expect(UNIT_ROLLUP_INDEX_FIELDS).toHaveLength(18);
  });

  it('contains expected field names', () => {
    const fieldNames = UNIT_ROLLUP_INDEX_FIELDS.map((f) => f.name);
    expect(fieldNames).toContain('unit_id');
    expect(fieldNames).toContain('rollup_text');
    expect(fieldNames).toContain('unit_semantic');
    expect(fieldNames).toContain('title_suggest');
  });

  it('includes rollup_text as required', () => {
    const field = UNIT_ROLLUP_INDEX_FIELDS.find((f) => f.name === 'rollup_text');
    expect(field?.optional).toBe(false);
  });

  it('includes unit_semantic as optional', () => {
    const field = UNIT_ROLLUP_INDEX_FIELDS.find((f) => f.name === 'unit_semantic');
    expect(field?.optional).toBe(true);
  });
});

describe('SEQUENCES_INDEX_FIELDS', () => {
  it('has exactly 14 fields', () => {
    expect(SEQUENCES_INDEX_FIELDS).toHaveLength(14);
  });

  it('contains expected field names', () => {
    const fieldNames = SEQUENCES_INDEX_FIELDS.map((f) => f.name);
    expect(fieldNames).toContain('sequence_id');
    expect(fieldNames).toContain('sequence_title');
    expect(fieldNames).toContain('sequence_semantic');
    expect(fieldNames).toContain('title_suggest');
  });

  it('has subject_slug with SUBJECT_TUPLE enum', () => {
    const field = SEQUENCES_INDEX_FIELDS.find((f) => f.name === 'subject_slug');
    expect(field?.enumRef).toBe('SUBJECT_TUPLE');
  });

  it('has 5 required and 9 optional fields', () => {
    const required = SEQUENCES_INDEX_FIELDS.filter((f) => !f.optional);
    const optional = SEQUENCES_INDEX_FIELDS.filter((f) => f.optional);
    // Required: sequence_id, sequence_slug, sequence_title, subject_slug, sequence_url
    expect(required).toHaveLength(5);
    // Optional: subject_title, phase_slug, phase_title, category_titles, key_stages,
    //           years, unit_slugs, sequence_semantic, title_suggest
    expect(optional).toHaveLength(9);
  });
});
