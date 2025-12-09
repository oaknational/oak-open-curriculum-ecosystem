/**
 * Unit tests for ES mapping generator.
 * Tests that the generator produces valid ES mapping TypeScript modules.
 */
import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateEsMappingModules } from './generate-es-mappings.js';

const MINIMAL_SCHEMA: OpenAPIObject = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {},
};

describe('generateEsMappingModules', () => {
  it('generates all expected mapping module files', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const fileNames = Object.keys(files).sort();

    expect(fileNames).toEqual([
      '../search/es-mappings/index.ts',
      '../search/es-mappings/oak-curriculum-glossary.ts',
      '../search/es-mappings/oak-lessons.ts',
      '../search/es-mappings/oak-meta.ts',
      '../search/es-mappings/oak-ref-key-stages.ts',
      '../search/es-mappings/oak-ref-subjects.ts',
      '../search/es-mappings/oak-sequence-facets.ts',
      '../search/es-mappings/oak-sequences.ts',
      '../search/es-mappings/oak-threads.ts',
      '../search/es-mappings/oak-unit-rollup.ts',
      '../search/es-mappings/oak-units.ts',
      '../search/es-mappings/oak-zero-hit-telemetry.ts',
    ]);
  });

  it('generates index module with barrel exports', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const indexContent = files['../search/es-mappings/index.ts'];

    expect(indexContent).toContain('GENERATED FILE - DO NOT EDIT');
    expect(indexContent).toContain("export { OAK_LESSONS_MAPPING } from './oak-lessons.js'");
    expect(indexContent).toContain("export { OAK_UNITS_MAPPING } from './oak-units.js'");
    expect(indexContent).toContain(
      "export { OAK_UNIT_ROLLUP_MAPPING } from './oak-unit-rollup.js'",
    );
    expect(indexContent).toContain("export { OAK_SEQUENCES_MAPPING } from './oak-sequences.js'");
    expect(indexContent).toContain(
      "export { OAK_SEQUENCE_FACETS_MAPPING } from './oak-sequence-facets.js'",
    );
    expect(indexContent).toContain("export { OAK_META_MAPPING } from './oak-meta.js'");
  });
});

describe('oak_lessons mapping', () => {
  it('exports OAK_LESSONS_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('export const OAK_LESSONS_MAPPING');
    expect(content).toContain('as const');
  });

  it('includes settings with analyzers', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('settings:');
    expect(content).toContain('oak_text_index');
    expect(content).toContain('oak_text_search');
    expect(content).toContain('oak_lower');
    expect(content).toContain('oak_syns_filter');
  });

  it('includes mappings with dynamic strict', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('mappings:');
    expect(content).toContain("dynamic: 'strict'");
    expect(content).toContain('properties:');
  });

  it('includes lesson_id field as keyword', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('lesson_id:');
    expect(content).toContain("type: 'keyword'");
  });

  it('includes lesson_semantic field as semantic_text', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('lesson_semantic:');
    expect(content).toContain("type: 'semantic_text'");
  });

  it('includes thread_slugs and thread_titles fields', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('thread_slugs:');
    expect(content).toContain('thread_titles:');
  });

  it('includes title_suggest completion field with contexts', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-lessons.ts'];

    expect(content).toContain('title_suggest:');
    expect(content).toContain("type: 'completion'");
    expect(content).toContain('contexts:');
    expect(content).toContain("name: 'subject'");
    expect(content).toContain("name: 'key_stage'");
  });
});

describe('oak_units mapping', () => {
  it('exports OAK_UNITS_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-units.ts'];

    expect(content).toContain('export const OAK_UNITS_MAPPING');
    expect(content).toContain('as const');
  });

  it('includes thread fields', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-units.ts'];

    expect(content).toContain('thread_slugs:');
    expect(content).toContain('thread_titles:');
    expect(content).toContain('thread_orders:');
  });

  it('includes title_suggest completion field', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-units.ts'];

    expect(content).toContain('title_suggest:');
    expect(content).toContain("type: 'completion'");
  });
});

describe('oak_unit_rollup mapping', () => {
  it('exports OAK_UNIT_ROLLUP_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-unit-rollup.ts'];

    expect(content).toContain('export const OAK_UNIT_ROLLUP_MAPPING');
    expect(content).toContain('as const');
  });

  it('includes unit_semantic field as semantic_text', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-unit-rollup.ts'];

    expect(content).toContain('unit_semantic:');
    expect(content).toContain("type: 'semantic_text'");
  });

  it('includes rollup_text with term_vector', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-unit-rollup.ts'];

    expect(content).toContain('rollup_text:');
    expect(content).toContain('term_vector:');
    expect(content).toContain("'with_positions_offsets'");
  });

  it('includes thread fields', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-unit-rollup.ts'];

    expect(content).toContain('thread_slugs:');
    expect(content).toContain('thread_titles:');
    expect(content).toContain('thread_orders:');
  });
});

describe('oak_sequences mapping', () => {
  it('exports OAK_SEQUENCES_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-sequences.ts'];

    expect(content).toContain('export const OAK_SEQUENCES_MAPPING');
    expect(content).toContain('as const');
  });

  it('includes sequence_semantic field as semantic_text', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-sequences.ts'];

    expect(content).toContain('sequence_semantic:');
    expect(content).toContain("type: 'semantic_text'");
  });
});

describe('oak_sequence_facets mapping', () => {
  it('exports OAK_SEQUENCE_FACETS_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-sequence-facets.ts'];

    expect(content).toContain('export const OAK_SEQUENCE_FACETS_MAPPING');
    expect(content).toContain('as const');
  });
});

describe('oak_meta mapping', () => {
  it('exports OAK_META_MAPPING const', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-meta.ts'];

    expect(content).toContain('export const OAK_META_MAPPING');
    expect(content).toContain('as const');
  });

  it('includes version field', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-meta.ts'];

    expect(content).toContain('version:');
  });

  it('includes ingested_at field as date', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const content = files['../search/es-mappings/oak-meta.ts'];

    expect(content).toContain('ingested_at:');
    expect(content).toContain("type: 'date'");
  });
});

describe('generated code quality', () => {
  it('includes GENERATED FILE header in all modules', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);

    for (const content of Object.values(files)) {
      expect(content).toContain('GENERATED FILE - DO NOT EDIT');
    }
  });

  it('includes TSDoc documentation in mapping modules', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const lessonsContent = files['../search/es-mappings/oak-lessons.ts'];

    expect(lessonsContent).toContain('@module');
    expect(lessonsContent).toContain('@description');
  });

  it('uses .js file extension in imports', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const indexContent = files['../search/es-mappings/index.ts'];

    const specifiers = Array.from(indexContent.matchAll(/from '(\.[^']+)'/g), (match) => match[1]);
    expect(specifiers.length).toBeGreaterThan(0);

    for (const specifier of specifiers) {
      expect(specifier.endsWith('.js')).toBe(true);
    }
  });
});

describe('oak_meta mapping', () => {
  it('includes all fields from META_INDEX_FIELDS', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toContain('version: {');
    expect(metaContent).toContain('ingested_at: {');
    expect(metaContent).toContain('subjects: {');
    expect(metaContent).toContain('key_stages: {');
    expect(metaContent).toContain('duration_ms: {');
    expect(metaContent).toContain('doc_counts: {');
  });

  it('uses correct ES field types', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toMatch(/version:\s*\{\s*type:\s*'keyword'/);
    expect(metaContent).toMatch(/ingested_at:\s*\{\s*type:\s*'date'/);
    expect(metaContent).toMatch(/subjects:\s*\{\s*type:\s*'keyword'/);
    expect(metaContent).toMatch(/key_stages:\s*\{\s*type:\s*'keyword'/);
    expect(metaContent).toMatch(/duration_ms:\s*\{\s*type:\s*'integer'/);
    expect(metaContent).toMatch(/doc_counts:\s*\{\s*type:\s*'object'/);
  });

  it('disables indexing for doc_counts object', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toMatch(/doc_counts:\s*\{[^}]*enabled:\s*false/);
  });

  it('uses strict dynamic mapping', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toContain("dynamic: 'strict'");
  });

  it('exports OAK_META_MAPPING constant', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toContain('export const OAK_META_MAPPING');
    expect(metaContent).toContain('as const');
  });

  it('exports OakMetaMapping type', () => {
    const files = generateEsMappingModules(MINIMAL_SCHEMA);
    const metaContent = files['../search/es-mappings/oak-meta.ts'];

    expect(metaContent).toContain('export type OakMetaMapping = typeof OAK_META_MAPPING');
  });
});
