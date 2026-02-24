/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search facet TypeScript types derived from the Open Curriculum schema.
 */

import type { KeyStage, Subject } from '../api-schema/path-parameters.js';

/** Represents a unit option within a sequence facet. */
export interface SequenceFacetUnit {
  unitSlug: string;
  unitTitle: string;
}

/** Sequence facet enriched for hybrid search presentation. */
export interface SequenceFacet {
  subjectSlug: Subject;
  sequenceSlug: string;
  keyStage: KeyStage;
  keyStageTitle?: string;
  phaseSlug: string;
  phaseTitle: string;
  years: string[];
  units: SequenceFacetUnit[];
  unitCount: number;
  lessonCount: number;
  hasKs4Options: boolean;
  sequenceUrl?: string;
}

/** Facet collection returned by the hybrid search endpoints. */
export interface SearchFacets {
  sequences: SequenceFacet[];
}
