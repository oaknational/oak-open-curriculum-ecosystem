import type { FileMap } from '../extraction-types.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Zod schemas for hybrid search facets derived from the Open Curriculum schema.
 */\n\n`;

/** Zod v4 accepts as const arrays directly. */
const KEY_STAGE_TUPLE = 'KEY_STAGES';
const SUBJECT_TUPLE = 'SUBJECTS';

function generateOutputModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS } from '../../../api-schema/path-parameters.js';\n\n` +
    `/** Unit entry within a sequence facet. */\n` +
    `export const SequenceFacetUnitSchema = z.object({\n` +
    `  unitSlug: z.string().min(1),\n` +
    `  unitTitle: z.string().min(1),\n` +
    `});\n\n` +
    `/** Sequence facet enriched for hybrid search presentation. */\n` +
    `export const SequenceFacetSchema = z.object({\n` +
    `  subjectSlug: z.enum(${SUBJECT_TUPLE}),\n` +
    `  sequenceSlug: z.string().min(1),\n` +
    `  keyStage: z.enum(${KEY_STAGE_TUPLE}),\n` +
    `  keyStageTitle: z.string().min(1).optional(),\n` +
    `  phaseSlug: z.string().min(1),\n` +
    `  phaseTitle: z.string().min(1),\n` +
    `  years: z.array(z.string().min(1)).default([]),\n` +
    `  units: z.array(SequenceFacetUnitSchema).default([]),\n` +
    `  unitCount: z.number().int().nonnegative(),\n` +
    `  lessonCount: z.number().int().nonnegative(),\n` +
    `  hasKs4Options: z.boolean(),\n` +
    `  sequenceUrl: z.string().min(1).optional(),\n` +
    `});\n\n` +
    `/** Facet collection returned by the hybrid search endpoints. */\n` +
    `export const SearchFacetsSchema = z.object({\n` +
    `  sequences: z.array(SequenceFacetSchema).default([]),\n` +
    `});\n`
  );
}

function generateOutputIndexModule(): string {
  return (
    HEADER +
    `export { SequenceFacetUnitSchema, SequenceFacetSchema, SearchFacetsSchema } from './sequence-facets.js';\n`
  );
}

function generateRootIndexModule(): string {
  return (
    HEADER +
    `export { SequenceFacetUnitSchema, SequenceFacetSchema, SearchFacetsSchema } from './output/index.js';\n`
  );
}

export function generateSearchFacetZodModules(): FileMap {
  return {
    '../zod/search/output/sequence-facets.ts': generateOutputModule(),
    '../zod/search/output/index.ts': generateOutputIndexModule(),
    '../zod/search/index.ts': generateRootIndexModule(),
  };
}
