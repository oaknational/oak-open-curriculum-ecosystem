import type { FileMap } from '../extraction-types.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search facet TypeScript types derived from the Open Curriculum schema.
 */\n\n`;

function generateFacetsModule(): string {
  return (
    HEADER +
    `import type { KeyStage, Subject } from '../api-schema/path-parameters.js';\n\n` +
    `/** Represents a unit option within a sequence facet. */\n` +
    `export interface SequenceFacetUnit {\n` +
    `  unitSlug: string;\n` +
    `  unitTitle: string;\n` +
    `}\n\n` +
    `/** Sequence facet enriched for hybrid search presentation. */\n` +
    `export interface SequenceFacet {\n` +
    `  subjectSlug: Subject;\n` +
    `  sequenceSlug: string;\n` +
    `  keyStage: KeyStage;\n` +
    `  keyStageTitle?: string;\n` +
    `  phaseSlug: string;\n` +
    `  phaseTitle: string;\n` +
    `  years: string[];\n` +
    `  units: SequenceFacetUnit[];\n` +
    `  unitCount: number;\n` +
    `  lessonCount: number;\n` +
    `  hasKs4Options: boolean;\n` +
    `  sequenceUrl?: string;\n` +
    `}\n\n` +
    `/** Facet collection returned by the hybrid search endpoints. */\n` +
    `export interface SearchFacets {\n` +
    `  sequences: SequenceFacet[];\n` +
    `}\n`
  );
}

function generateIndexModule(): string {
  return (
    HEADER + `export type { SequenceFacetUnit, SequenceFacet, SearchFacets } from './facets.js';\n`
  );
}

export function generateSearchFacetTypeModules(): FileMap {
  return {
    '../search/facets.ts': generateFacetsModule(),
    '../search/index.ts': generateIndexModule(),
  };
}
