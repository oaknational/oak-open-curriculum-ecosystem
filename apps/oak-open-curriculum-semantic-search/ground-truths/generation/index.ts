/**
 * Ground Truth Type Generation
 *
 * Exports all type generation utilities for ground truth validation.
 *
 * @packageDocumentation
 */

// Bulk data parsing
export {
  parseBulkDataFile,
  extractLessonSlugs,
  parsePhaseFromFilename,
  type BulkLesson,
  type BulkDataFile,
  type BulkDataParseError,
  type Phase,
} from './bulk-data-parser';

// TypeScript type emission
export {
  emitLessonSlugType,
  emitAllLessonSlugTypes,
  toPascalCase,
  type ParsedBulkData,
} from './type-emitter';

// Zod schema emission
export { emitSlugEnumSchema, emitGroundTruthSchemas } from './schema-emitter';
