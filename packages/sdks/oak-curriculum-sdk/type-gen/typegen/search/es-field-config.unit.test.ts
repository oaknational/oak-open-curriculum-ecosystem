/**
 * Unit tests for ES field configuration.
 * Tests pure functions that map Zod types to ES field types.
 */
import { describe, expect, it } from 'vitest';

import {
  ES_ANALYZER_CONFIG,
  ES_NORMALIZER_CONFIG,
  ES_FILTER_CONFIG,
  zodTypeDescriptorToEsFieldType,
  buildEsFieldMapping,
  buildEsSettings,
  LESSONS_FIELD_OVERRIDES,
  UNITS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  type ZodTypeDescriptor,
  type EsFieldMapping,
} from './es-field-config.js';

describe('ES_ANALYZER_CONFIG', () => {
  it('defines oak_text_index analyzer with lowercase filter', () => {
    expect(ES_ANALYZER_CONFIG.oak_text_index).toEqual({
      type: 'custom',
      tokenizer: 'standard',
      filter: ['lowercase'],
    });
  });

  it('defines oak_text_search analyzer with synonym filter', () => {
    expect(ES_ANALYZER_CONFIG.oak_text_search).toEqual({
      type: 'custom',
      tokenizer: 'standard',
      filter: ['lowercase', 'oak_syns_filter'],
    });
  });
});

describe('ES_NORMALIZER_CONFIG', () => {
  it('defines oak_lower normalizer with lowercase and asciifolding', () => {
    expect(ES_NORMALIZER_CONFIG.oak_lower).toEqual({
      type: 'custom',
      filter: ['lowercase', 'asciifolding'],
    });
  });
});

describe('ES_FILTER_CONFIG', () => {
  it('defines oak_syns_filter for updateable synonyms', () => {
    expect(ES_FILTER_CONFIG.oak_syns_filter).toEqual({
      type: 'synonym_graph',
      synonyms_set: 'oak-syns',
      updateable: true,
    });
  });
});

describe('zodTypeDescriptorToEsFieldType', () => {
  it('maps string to keyword by default', () => {
    const descriptor: ZodTypeDescriptor = { type: 'string' };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('keyword');
  });

  it('maps number to integer', () => {
    const descriptor: ZodTypeDescriptor = { type: 'number' };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('integer');
  });

  it('maps boolean to boolean', () => {
    const descriptor: ZodTypeDescriptor = { type: 'boolean' };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('boolean');
  });

  it('maps date to date', () => {
    const descriptor: ZodTypeDescriptor = { type: 'date' };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('date');
  });

  it('maps array of strings to keyword (multi-value)', () => {
    const descriptor: ZodTypeDescriptor = { type: 'array', items: { type: 'string' } };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('keyword');
  });

  it('maps array of numbers to integer (multi-value)', () => {
    const descriptor: ZodTypeDescriptor = { type: 'array', items: { type: 'number' } };
    expect(zodTypeDescriptorToEsFieldType(descriptor)).toBe('integer');
  });
});

describe('buildEsFieldMapping', () => {
  it('creates simple keyword field mapping', () => {
    const descriptor: ZodTypeDescriptor = { type: 'string' };
    const result = buildEsFieldMapping(descriptor);

    expect(result).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });

  it('creates integer field mapping without normalizer', () => {
    const descriptor: ZodTypeDescriptor = { type: 'number' };
    const result = buildEsFieldMapping(descriptor);

    expect(result).toEqual({
      type: 'integer',
    });
  });

  it('creates boolean field mapping', () => {
    const descriptor: ZodTypeDescriptor = { type: 'boolean' };
    const result = buildEsFieldMapping(descriptor);

    expect(result).toEqual({
      type: 'boolean',
    });
  });

  it('creates date field mapping', () => {
    const descriptor: ZodTypeDescriptor = { type: 'date' };
    const result = buildEsFieldMapping(descriptor);

    expect(result).toEqual({
      type: 'date',
    });
  });

  it('applies field override when provided', () => {
    const descriptor: ZodTypeDescriptor = { type: 'string' };
    const override: EsFieldMapping = { type: 'semantic_text' };
    const result = buildEsFieldMapping(descriptor, override);

    expect(result).toEqual({
      type: 'semantic_text',
    });
  });

  it('applies text field with analyzers when override specifies text type', () => {
    const descriptor: ZodTypeDescriptor = { type: 'string' };
    const override: EsFieldMapping = {
      type: 'text',
      analyzer: 'oak_text_index',
      search_analyzer: 'oak_text_search',
    };
    const result = buildEsFieldMapping(descriptor, override);

    expect(result).toEqual({
      type: 'text',
      analyzer: 'oak_text_index',
      search_analyzer: 'oak_text_search',
    });
  });

  it('applies completion field with contexts when override specifies', () => {
    const descriptor: ZodTypeDescriptor = { type: 'object' };
    const override: EsFieldMapping = {
      type: 'completion',
      contexts: [
        { name: 'subject', type: 'category' },
        { name: 'key_stage', type: 'category' },
      ],
    };
    const result = buildEsFieldMapping(descriptor, override);

    expect(result).toEqual({
      type: 'completion',
      contexts: [
        { name: 'subject', type: 'category' },
        { name: 'key_stage', type: 'category' },
      ],
    });
  });
});

describe('buildEsSettings', () => {
  it('produces settings with analyzers, normalizers, and filters', () => {
    const settings = buildEsSettings();

    expect(settings.analysis.analyzer).toEqual(ES_ANALYZER_CONFIG);
    expect(settings.analysis.normalizer).toEqual(ES_NORMALIZER_CONFIG);
    expect(settings.analysis.filter).toEqual(ES_FILTER_CONFIG);
  });
});

describe('LESSONS_FIELD_OVERRIDES', () => {
  it('defines semantic_text for lesson_content_semantic field (Phase 3 nomenclature)', () => {
    expect(LESSONS_FIELD_OVERRIDES.lesson_content_semantic).toEqual({
      type: 'semantic_text',
    });
  });

  it('defines text with analyzers for lesson_title field', () => {
    expect(LESSONS_FIELD_OVERRIDES.lesson_title.type).toBe('text');
    expect(LESSONS_FIELD_OVERRIDES.lesson_title.analyzer).toBe('oak_text_index');
    expect(LESSONS_FIELD_OVERRIDES.lesson_title.search_analyzer).toBe('oak_text_search');
  });

  it('defines completion for title_suggest field', () => {
    expect(LESSONS_FIELD_OVERRIDES.title_suggest.type).toBe('completion');
    expect(LESSONS_FIELD_OVERRIDES.title_suggest.contexts).toBeDefined();
  });

  it('defines text with analyzers for thread_titles field', () => {
    expect(LESSONS_FIELD_OVERRIDES.thread_titles.type).toBe('text');
    expect(LESSONS_FIELD_OVERRIDES.thread_titles.analyzer).toBe('oak_text_index');
  });
});

describe('UNITS_FIELD_OVERRIDES', () => {
  it('defines thread_slugs as keyword', () => {
    expect(UNITS_FIELD_OVERRIDES.thread_slugs).toEqual({
      type: 'keyword',
      normalizer: 'oak_lower',
    });
  });

  it('defines thread_orders as integer', () => {
    expect(UNITS_FIELD_OVERRIDES.thread_orders).toEqual({
      type: 'integer',
    });
  });
});

describe('UNIT_ROLLUP_FIELD_OVERRIDES', () => {
  it('defines semantic_text for unit_content_semantic field (Phase 3 nomenclature)', () => {
    expect(UNIT_ROLLUP_FIELD_OVERRIDES.unit_content_semantic).toEqual({
      type: 'semantic_text',
    });
  });

  it('defines text with term_vector for unit_content field (Phase 3 nomenclature)', () => {
    expect(UNIT_ROLLUP_FIELD_OVERRIDES.unit_content.type).toBe('text');
    expect(UNIT_ROLLUP_FIELD_OVERRIDES.unit_content.term_vector).toBe('with_positions_offsets');
  });
});
