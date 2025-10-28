import { DEFAULT_SUGGESTION_CACHE, isSubject } from '@oaknational/oak-curriculum-sdk';
import {
  createSearchSequencesResponse,
  createSearchUnitsResponse,
  type SearchSequenceResult,
  type SearchSequencesResponse,
  type SearchUnitResult,
  type SearchUnitsResponse,
} from '@oaknational/oak-curriculum-sdk';
import type { SingleScopeDatasetKey } from './single-scope';
import {
  ks2MathsSequences,
  ks2MathsUnits,
  ks3ArtSequences,
  ks3ArtUnits,
  ks3HistorySequences,
  ks3HistoryUnits,
  ks4MathsSequences,
  ks4MathsUnits,
  ks4ScienceSequences,
  ks4ScienceUnits,
} from '../data';

/**
 * Available fixture datasets by scope.
 */
const UNIT_DATASETS: Record<SingleScopeDatasetKey, readonly UnitRecord[]> = {
  'ks2-maths': ks2MathsUnits,
  'ks4-maths': ks4MathsUnits,
  'ks3-history': ks3HistoryUnits,
  'ks3-art': ks3ArtUnits,
  'ks4-science': ks4ScienceUnits,
};

const SEQUENCE_DATASETS: Record<SingleScopeDatasetKey, readonly SequenceRecord[]> = {
  'ks2-maths': ks2MathsSequences,
  'ks4-maths': ks4MathsSequences,
  'ks3-history': ks3HistorySequences,
  'ks3-art': ks3ArtSequences,
  'ks4-science': ks4ScienceSequences,
};

type UnitRecord =
  | (typeof ks2MathsUnits)[number]
  | (typeof ks4MathsUnits)[number]
  | (typeof ks3HistoryUnits)[number]
  | (typeof ks3ArtUnits)[number]
  | (typeof ks4ScienceUnits)[number];

type SequenceRecord =
  | (typeof ks2MathsSequences)[number]
  | (typeof ks4MathsSequences)[number]
  | (typeof ks3HistorySequences)[number]
  | (typeof ks3ArtSequences)[number]
  | (typeof ks4ScienceSequences)[number];

/**
 * Build a deterministic unit scope response for the requested dataset key.
 */
export function buildUnitFixture(datasetKey: SingleScopeDatasetKey): SearchUnitsResponse {
  const units = UNIT_DATASETS[datasetKey];
  const results = units.map((unit, index) => mapUnitRecord(unit, index, units.length));

  return createSearchUnitsResponse({
    results,
    total: results.length,
    took: 16,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  });
}

function mapUnitRecord(unit: UnitRecord, index: number, total: number): SearchUnitResult {
  const rankScore = Math.max(1, total - index);
  return {
    id: unit.unitSlug,
    rankScore,
    unit: {
      unit_title: unit.unitTitle,
      subject_slug: assertSubjectSlug(unit.subjectSlug),
      key_stage: unit.keyStages[0],
    },
    highlights: buildUnitHighlights(unit),
  };
}

function buildUnitHighlights(unit: UnitRecord): string[] {
  const highlights: string[] = [];
  if (unit.yearGroups.length > 0) {
    highlights.push(`Years ${unit.yearGroups.join(', ')}`);
  }
  if (unit.keyStages.length > 0) {
    highlights.push(`Key stage ${unit.keyStages.join(' / ')}`);
  }
  return highlights;
}

function assertSubjectSlug(slug: string): NonNullable<SearchUnitResult['unit']>['subject_slug'] {
  if (isSubject(slug)) {
    return slug;
  }
  throw new Error(`Unrecognised subject slug in fixture data: ${slug}`);
}

/**
 * Build a deterministic sequence scope response for the requested dataset key.
 */
export function buildSequenceFixture(datasetKey: SingleScopeDatasetKey): SearchSequencesResponse {
  const sequences = SEQUENCE_DATASETS[datasetKey];
  const results = sequences.map((sequence) => mapSequenceRecord(sequence));

  return createSearchSequencesResponse({
    results,
    total: results.length,
    took: 14,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  });
}

function mapSequenceRecord(sequence: SequenceRecord): SearchSequenceResult {
  return {
    id: sequence.sequenceSlug,
    sequence: {
      sequence_title: sequence.phaseTitle,
      sequence_url: `/teachers/programmes/${sequence.sequenceSlug}`,
      phase_slug: sequence.phaseSlug,
    },
    highlights: buildSequenceHighlights(sequence),
  };
}

function buildSequenceHighlights(sequence: SequenceRecord): string[] {
  const highlights: string[] = [];
  highlights.push(sequence.phaseTitle);
  if (sequence.keyStages.length > 0) {
    const stages = sequence.keyStages.map((ks) => ks.keyStageSlug.toUpperCase()).join(', ');
    highlights.push(`Key stages ${stages}`);
  }
  if (sequence.years.length > 0) {
    highlights.push(`Years ${sequence.years.join(', ')}`);
  }
  return highlights;
}
