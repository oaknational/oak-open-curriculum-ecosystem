/**
 * Zod schemas for content guidance fields in Oak bulk download data.
 *
 * @remarks
 * Content guidance indicates lessons that may need supervision or
 * contain sensitive content. The field has mixed types in the data:
 * - String "NULL" for most lessons (no guidance)
 * - Array of guidance objects for lessons needing supervision
 *
 * @see 07-bulk-download-data-quality-report.md for data quality analysis
 */
import { z } from 'zod';

/**
 * Schema for content guidance items.
 *
 * @remarks
 * The actual structure in bulk download is more complex than initially assumed.
 * Fields include area, level ID, label, and description.
 */
export const contentGuidanceItemSchema = z.object({
  /** Content guidance area category */
  contentGuidanceArea: z.string(),
  /** Supervision level ID */
  supervisionlevel_id: z.number(),
  /** Human-readable label for the guidance */
  contentGuidanceLabel: z.string(),
  /** Detailed description of the guidance */
  contentGuidanceDescription: z.string(),
});

/**
 * Schema for content guidance field which can be "NULL", null, or an array.
 *
 * @remarks
 * Handles the mixed type issue where contentGuidance is either:
 * - String "NULL" (most lessons)
 * - Actual array of guidance objects (rare)
 */
export const contentGuidanceSchema = z.union([
  z.literal('NULL').transform(() => undefined),
  z.null().transform(() => undefined),
  z.array(contentGuidanceItemSchema),
]);

// ============================================================================
// Derived Types
// ============================================================================

/** Type for a parsed content guidance item */
export type ContentGuidanceItem = z.infer<typeof contentGuidanceItemSchema>;

/** Type for parsed content guidance (undefined or array) */
export type ContentGuidance = z.infer<typeof contentGuidanceSchema>;
