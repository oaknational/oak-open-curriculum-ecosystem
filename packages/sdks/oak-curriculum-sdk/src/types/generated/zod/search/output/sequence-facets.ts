/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Zod schemas for hybrid search facets derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../../../api-schema/path-parameters.js';

/** Unit entry within a sequence facet. */
export const SequenceFacetUnitSchema = z.object({
  unitSlug: z.string().min(1),
  unitTitle: z.string().min(1),
});

/** Sequence facet enriched for hybrid search presentation. */
export const SequenceFacetSchema = z.object({
  subjectSlug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
  sequenceSlug: z.string().min(1),
  keyStage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]),
  keyStageTitle: z.string().min(1).optional(),
  phaseSlug: z.string().min(1),
  phaseTitle: z.string().min(1),
  years: z.array(z.string().min(1)).default([]),
  units: z.array(SequenceFacetUnitSchema).default([]),
  unitCount: z.number().int().nonnegative(),
  lessonCount: z.number().int().nonnegative(),
  hasKs4Options: z.boolean(),
  sequenceUrl: z.string().min(1).optional(),
});

/** Facet collection returned by the hybrid search endpoints. */
export const SearchFacetsSchema = z.object({
  sequences: z.array(SequenceFacetSchema).default([]),
});
