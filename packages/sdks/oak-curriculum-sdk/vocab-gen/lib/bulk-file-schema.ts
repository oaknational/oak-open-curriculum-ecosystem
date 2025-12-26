/**
 * Zod schema for the top-level bulk download file structure.
 *
 * @remarks
 * Each bulk download file represents one subject-phase combination
 * (e.g., maths-primary, science-secondary). Contains:
 * - Sequence metadata (slug, title)
 * - Units in sequence order
 * - All lessons for the subject-phase
 *
 * @see 07-bulk-download-data-quality-report.md for data quality analysis
 */
import { z } from 'zod';

import { lessonSchema } from './lesson-schema.js';
import { unitSchema } from './unit-schemas.js';

/**
 * Schema for a complete bulk download file.
 *
 * @remarks
 * Each file represents one subject-phase combination (e.g., maths-primary).
 * Contains both sequence (units) and lessons arrays.
 */
export const bulkDownloadFileSchema = z.object({
  /** Sequence slug (e.g., "maths-primary") */
  sequenceSlug: z.string(),
  /** Subject title */
  subjectTitle: z.string(),
  /** Units in sequence order */
  sequence: z.array(unitSchema),
  /** All lessons for this subject-phase */
  lessons: z.array(lessonSchema),
});

// ============================================================================
// Derived Types
// ============================================================================

/** Type for a parsed bulk download file */
export type BulkDownloadFile = z.infer<typeof bulkDownloadFileSchema>;
