/**
 * Unit tests for ES mapping generation from field definitions.
 * Tests the pure function that converts IndexFieldDefinitions + overrides to ES field mappings.
 */
import { describe, expect, it } from 'vitest';

import { type IndexFieldDefinitions } from './field-definitions/index.js';
import {
  generateEsFieldsFromDefinitions,
  fieldDefinitionToEsMapping,
} from './es-mapping-from-fields.js';
import type { EsFieldMapping } from './es-field-config.js';

describe('fieldDefinitionToEsMapping', () => {
  it('maps string field to keyword with normalizer', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'unit_id',
      zodType: 'string',
      optional: false,
    });

    expect(mapping).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });

  it('maps number field to integer', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'lesson_count',
      zodType: 'number',
      optional: false,
    });

    expect(mapping).toEqual({
      type: 'integer',
    });
  });

  it('maps array-string field to keyword with normalizer', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'lesson_ids',
      zodType: 'array-string',
      optional: false,
    });

    expect(mapping).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });

  it('maps array-number field to integer', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'thread_orders',
      zodType: 'array-number',
      optional: true,
    });

    expect(mapping).toEqual({
      type: 'integer',
    });
  });

  it('maps object field to keyword as default (expects override)', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'title_suggest',
      zodType: 'object',
      optional: true,
    });

    // Object fields get keyword as default, but should be overridden
    expect(mapping).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });

  it('ignores optional flag for ES mapping (ES handles multi-value)', () => {
    const required = fieldDefinitionToEsMapping({
      name: 'tags',
      zodType: 'array-string',
      optional: false,
    });

    const optionalField = fieldDefinitionToEsMapping({
      name: 'tags',
      zodType: 'array-string',
      optional: true,
    });

    expect(required).toEqual(optionalField);
  });

  it('ignores enumRef for ES mapping (enum is Zod-only)', () => {
    const mapping = fieldDefinitionToEsMapping({
      name: 'subject_slug',
      zodType: 'string',
      optional: false,
      enumRef: 'SUBJECT_TUPLE',
    });

    expect(mapping).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });
});

describe('generateEsFieldsFromDefinitions', () => {
  it('generates field mappings for all fields', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'id', zodType: 'string', optional: false },
      { name: 'count', zodType: 'number', optional: false },
      { name: 'tags', zodType: 'array-string', optional: true },
    ];

    const result = generateEsFieldsFromDefinitions(fields, {});

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(['id', { type: 'keyword', normalizer: 'oak_lower' }]);
    expect(result[1]).toEqual(['count', { type: 'integer' }]);
    expect(result[2]).toEqual(['tags', { type: 'keyword', normalizer: 'oak_lower' }]);
  });

  it('applies overrides when provided', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'unit_title', zodType: 'string', optional: false },
      { name: 'unit_url', zodType: 'string', optional: false },
    ];

    const overrides: Readonly<Record<string, EsFieldMapping>> = {
      unit_title: { type: 'text', analyzer: 'standard' },
      unit_url: { type: 'keyword', ignore_above: 1024 },
    };

    const result = generateEsFieldsFromDefinitions(fields, overrides);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(['unit_title', { type: 'text', analyzer: 'standard' }]);
    expect(result[1]).toEqual(['unit_url', { type: 'keyword', ignore_above: 1024 }]);
  });

  it('mixes defaults and overrides correctly', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'unit_id', zodType: 'string', optional: false },
      { name: 'unit_title', zodType: 'string', optional: false },
      { name: 'lesson_count', zodType: 'number', optional: false },
    ];

    const overrides: Readonly<Record<string, EsFieldMapping>> = {
      unit_title: { type: 'text', analyzer: 'oak_text_index', search_analyzer: 'oak_text_search' },
    };

    const result = generateEsFieldsFromDefinitions(fields, overrides);

    expect(result).toHaveLength(3);
    // unit_id uses default
    expect(result[0]).toEqual(['unit_id', { type: 'keyword', normalizer: 'oak_lower' }]);
    // unit_title uses override
    expect(result[1]).toEqual([
      'unit_title',
      { type: 'text', analyzer: 'oak_text_index', search_analyzer: 'oak_text_search' },
    ]);
    // lesson_count uses default
    expect(result[2]).toEqual(['lesson_count', { type: 'integer' }]);
  });

  it('applies completion field override for title_suggest', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'title_suggest', zodType: 'object', optional: true },
    ];

    const overrides: Readonly<Record<string, EsFieldMapping>> = {
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'key_stage', type: 'category' },
        ],
      },
    };

    const result = generateEsFieldsFromDefinitions(fields, overrides);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([
      'title_suggest',
      {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'key_stage', type: 'category' },
        ],
      },
    ]);
  });

  it('preserves field order from definitions', () => {
    const fields: IndexFieldDefinitions = [
      { name: 'field_z', zodType: 'string', optional: false },
      { name: 'field_a', zodType: 'string', optional: false },
      { name: 'field_m', zodType: 'string', optional: false },
    ];

    const result = generateEsFieldsFromDefinitions(fields, {});

    expect(result.map(([name]) => name)).toEqual(['field_z', 'field_a', 'field_m']);
  });

  it('generates correct mapping for full UNITS_INDEX_FIELDS with overrides', () => {
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

    const overrides: Readonly<Record<string, EsFieldMapping>> = {
      unit_url: { type: 'keyword', ignore_above: 1024 },
      subject_programmes_url: { type: 'keyword', ignore_above: 1024 },
      thread_slugs: { type: 'keyword', normalizer: 'oak_lower' },
      thread_titles: { type: 'keyword', normalizer: 'oak_lower' },
      thread_orders: { type: 'integer' },
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'key_stage', type: 'category' },
          { name: 'sequence', type: 'category' },
        ],
      },
    };

    const result = generateEsFieldsFromDefinitions(fields, overrides);

    expect(result).toHaveLength(16);

    // Check specific fields
    const unitUrl = result.find(([name]) => name === 'unit_url');
    expect(unitUrl?.[1]).toEqual({ type: 'keyword', ignore_above: 1024 });

    const titleSuggest = result.find(([name]) => name === 'title_suggest');
    expect(titleSuggest?.[1]).toHaveProperty('type', 'completion');
    expect(titleSuggest?.[1]).toHaveProperty('contexts');

    // Check default fields
    const unitId = result.find(([name]) => name === 'unit_id');
    expect(unitId?.[1]).toEqual({ type: 'keyword', normalizer: 'oak_lower' });
  });
});
