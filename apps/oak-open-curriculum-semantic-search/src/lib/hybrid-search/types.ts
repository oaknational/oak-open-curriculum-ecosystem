import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
  KeyStage,
} from '../../types/oak';
import type { estypes } from '@elastic/elasticsearch';

export interface StructuredQuery {
  scope: 'units' | 'lessons' | 'sequences';
  text: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  phaseSlug?: string;
  size?: number;
  from?: number;
  highlight?: boolean;
  includeFacets?: boolean;
}

export interface UnitResult {
  id: string;
  rankScore: number;
  unit: SearchUnitsIndexDoc | null;
  highlights: string[];
}

export interface LessonResult {
  id: string;
  rankScore: number;
  lesson: SearchLessonsIndexDoc;
  highlights: string[];
}

export interface SequenceResult {
  id: string;
  rankScore: number;
  sequence: SearchSequenceIndexDoc;
}

export type SearchAggregations = Record<string, estypes.AggregationsAggregate>;

export interface SequenceFacet {
  subjectSlug: SearchSubjectSlug;
  sequenceSlug: string;
  keyStage: KeyStage;
  keyStageTitle?: string;
  phaseSlug: string;
  phaseTitle: string;
  years: string[];
  units: { unitSlug: string; unitTitle: string }[];
  unitCount: number;
  lessonCount: number;
  hasKs4Options: boolean;
  sequenceUrl?: string;
}

export interface SearchFacets {
  sequences: SequenceFacet[];
}

export interface HybridSearchMeta {
  total: number;
  took: number;
  timedOut: boolean;
  aggregations?: SearchAggregations;
  facets?: SearchFacets;
}

export type HybridSearchResult =
  | (HybridSearchMeta & { scope: 'units'; results: UnitResult[] })
  | (HybridSearchMeta & { scope: 'lessons'; results: LessonResult[] })
  | (HybridSearchMeta & { scope: 'sequences'; results: SequenceResult[] });
