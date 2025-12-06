import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';
import {
  LESSONS_INDEX_FIELDS,
  UNITS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
  THREADS_INDEX_FIELDS,
  META_INDEX_FIELDS,
  ZERO_HIT_INDEX_FIELDS,
} from './field-definitions/index.js';
import {
  LESSONS_COMPLETION_CONTEXTS,
  UNITS_COMPLETION_CONTEXTS,
  UNIT_ROLLUP_COMPLETION_CONTEXTS,
  SEQUENCES_COMPLETION_CONTEXTS,
  THREADS_COMPLETION_CONTEXTS,
} from './completion-contexts.js';
import { generateCompletionContextsSchema } from './zod-schema-generator.js';
import {
  generateCompletionPayloadSchema,
  generateDocSchemaWithTypedCompletion,
  generateSimpleDocSchema,
  generateTypeGuard,
} from './index-doc-code-gen.js';
import { createIndexDocumentsDocsModule } from './index-doc-exports.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 * Per-index completion context schemas enforce compile-time safety.
 */

`;

const IMPORTS = `import { z } from 'zod';
import { KEY_STAGES, SUBJECTS, type Subject } from '../api-schema/path-parameters.js';
export type SearchSubjectSlug = Subject;

`;

function createContextSchemas(): string {
  const c = generateCompletionContextsSchema;
  return (
    '// Per-Index Completion Context Schemas\n' +
    c('SearchLessonsCompletionContextsSchema', LESSONS_COMPLETION_CONTEXTS) +
    '\nexport type SearchLessonsCompletionContexts = z.infer<typeof SearchLessonsCompletionContextsSchema>;\n' +
    c('SearchUnitsCompletionContextsSchema', UNITS_COMPLETION_CONTEXTS) +
    '\nexport type SearchUnitsCompletionContexts = z.infer<typeof SearchUnitsCompletionContextsSchema>;\n' +
    c('SearchUnitRollupCompletionContextsSchema', UNIT_ROLLUP_COMPLETION_CONTEXTS) +
    '\nexport type SearchUnitRollupCompletionContexts = z.infer<typeof SearchUnitRollupCompletionContextsSchema>;\n' +
    c('SearchSequenceCompletionContextsSchema', SEQUENCES_COMPLETION_CONTEXTS) +
    '\nexport type SearchSequenceCompletionContexts = z.infer<typeof SearchSequenceCompletionContextsSchema>;\n' +
    c('SearchThreadCompletionContextsSchema', THREADS_COMPLETION_CONTEXTS) +
    '\nexport type SearchThreadCompletionContexts = z.infer<typeof SearchThreadCompletionContextsSchema>;\n\n'
  );
}

function createPayloadSchemas(): string {
  const p = generateCompletionPayloadSchema;
  return (
    '// Per-Index Completion Payload Schemas\n' +
    p('SearchLessonsCompletionPayloadSchema', 'SearchLessonsCompletionContextsSchema') +
    '\nexport type SearchLessonsCompletionPayload = z.infer<typeof SearchLessonsCompletionPayloadSchema>;\n' +
    p('SearchUnitsCompletionPayloadSchema', 'SearchUnitsCompletionContextsSchema') +
    '\nexport type SearchUnitsCompletionPayload = z.infer<typeof SearchUnitsCompletionPayloadSchema>;\n' +
    p('SearchUnitRollupCompletionPayloadSchema', 'SearchUnitRollupCompletionContextsSchema') +
    '\nexport type SearchUnitRollupCompletionPayload = z.infer<typeof SearchUnitRollupCompletionPayloadSchema>;\n' +
    p('SearchSequenceCompletionPayloadSchema', 'SearchSequenceCompletionContextsSchema') +
    '\nexport type SearchSequenceCompletionPayload = z.infer<typeof SearchSequenceCompletionPayloadSchema>;\n' +
    p('SearchThreadCompletionPayloadSchema', 'SearchThreadCompletionContextsSchema') +
    '\nexport type SearchThreadCompletionPayload = z.infer<typeof SearchThreadCompletionPayloadSchema>;\n\n'
  );
}

function createDocSchemas(): string {
  const d = generateDocSchemaWithTypedCompletion;
  const g = generateTypeGuard;
  return (
    '// Index Document Schemas\n' +
    d('SearchThreadIndexDocSchema', THREADS_INDEX_FIELDS, 'SearchThreadCompletionPayloadSchema') +
    '\nexport type SearchThreadIndexDoc = z.infer<typeof SearchThreadIndexDocSchema>;\n' +
    g('isSearchThreadIndexDoc', 'SearchThreadIndexDocSchema', 'SearchThreadIndexDoc') +
    '\n' +
    d('SearchLessonsIndexDocSchema', LESSONS_INDEX_FIELDS, 'SearchLessonsCompletionPayloadSchema') +
    '\nexport type SearchLessonsIndexDoc = z.infer<typeof SearchLessonsIndexDocSchema>;\n' +
    g('isSearchLessonsIndexDoc', 'SearchLessonsIndexDocSchema', 'SearchLessonsIndexDoc') +
    '\n' +
    d('SearchUnitsIndexDocSchema', UNITS_INDEX_FIELDS, 'SearchUnitsCompletionPayloadSchema') +
    '\nexport type SearchUnitsIndexDoc = z.infer<typeof SearchUnitsIndexDocSchema>;\n' +
    g('isSearchUnitsIndexDoc', 'SearchUnitsIndexDocSchema', 'SearchUnitsIndexDoc') +
    '\n' +
    d(
      'SearchUnitRollupDocSchema',
      UNIT_ROLLUP_INDEX_FIELDS,
      'SearchUnitRollupCompletionPayloadSchema',
    ) +
    '\nexport type SearchUnitRollupDoc = z.infer<typeof SearchUnitRollupDocSchema>;\n' +
    g('isSearchUnitRollupDoc', 'SearchUnitRollupDocSchema', 'SearchUnitRollupDoc') +
    '\n' +
    d(
      'SearchSequenceIndexDocSchema',
      SEQUENCES_INDEX_FIELDS,
      'SearchSequenceCompletionPayloadSchema',
    ) +
    '\nexport type SearchSequenceIndexDoc = z.infer<typeof SearchSequenceIndexDocSchema>;\n' +
    g('isSearchSequenceIndexDoc', 'SearchSequenceIndexDocSchema', 'SearchSequenceIndexDoc') +
    '\n'
  );
}

function createMetaDocSchema(): string {
  const s = generateSimpleDocSchema;
  const g = generateTypeGuard;
  return (
    '// Index Metadata Schema\n' +
    s('IndexMetaDocSchema', META_INDEX_FIELDS) +
    '\nexport type IndexMetaDoc = z.infer<typeof IndexMetaDocSchema>;\n' +
    g('isIndexMetaDoc', 'IndexMetaDocSchema', 'IndexMetaDoc') +
    '\n'
  );
}

function createZeroHitDocSchema(): string {
  const s = generateSimpleDocSchema;
  const g = generateTypeGuard;
  return (
    '// Zero-Hit Telemetry Schema\n' +
    s('ZeroHitDocSchema', ZERO_HIT_INDEX_FIELDS) +
    '\nexport type ZeroHitDoc = z.infer<typeof ZeroHitDocSchema>;\n' +
    g('isZeroHitDoc', 'ZeroHitDocSchema', 'ZeroHitDoc') +
    '\n'
  );
}

function createIndexDocumentsModule(): string {
  return (
    HEADER +
    IMPORTS +
    createContextSchemas() +
    createPayloadSchemas() +
    createDocSchemas() +
    createMetaDocSchema() +
    createZeroHitDocSchema()
  );
}

export function generateSearchIndexDocumentModules(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/index-documents.ts': createIndexDocumentsModule(),
    '../../../../docs/_typedoc_src/types/search-index.ts': createIndexDocumentsDocsModule(),
  };
}
