/**
 * Assembles bulk Elasticsearch operations from transformed documents.
 *
 * Pure function that interleaves index actions with document payloads
 * for the Elasticsearch bulk API.
 */
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc, SearchUnitRollupDoc } from '../types/oak';
import type { BulkIndexAction } from './bulk-data-adapter';

/** Bulk operation entry (action or document) */
export type BulkOperationEntry =
  | BulkIndexAction
  | SearchLessonsIndexDoc
  | SearchUnitsIndexDoc
  | SearchUnitRollupDoc;

/** Build bulk operations from transformed documents */
export function buildBulkOps(
  lessons: readonly SearchLessonsIndexDoc[],
  units: readonly SearchUnitsIndexDoc[],
  rollups: readonly SearchUnitRollupDoc[],
  lessonsIndex: string,
  unitsIndex: string,
  rollupIndex: string,
): BulkOperationEntry[] {
  const ops: BulkOperationEntry[] = [];
  for (const doc of lessons) {
    ops.push({ index: { _index: lessonsIndex, _id: doc.lesson_id } }, doc);
  }
  for (const doc of units) {
    ops.push({ index: { _index: unitsIndex, _id: doc.unit_id } }, doc);
  }
  for (const doc of rollups) {
    ops.push({ index: { _index: rollupIndex, _id: doc.unit_id } }, doc);
  }
  return ops;
}
