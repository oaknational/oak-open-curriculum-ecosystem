import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
  KeyStage,
  SequenceFacet,
  SearchFacets,
  SearchScope,
} from '../../types/oak';
import type { estypes } from '@elastic/elasticsearch';

export interface StructuredQuery {
  scope: SearchScope;
  text: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  phaseSlug?: string;
  /** Filter lessons to a specific unit by unit slug. */
  unitSlug?: string;
  size?: number;
  from?: number;
  highlight?: boolean;
  includeFacets?: boolean;
  // KS4 and metadata filter fields (Phase 3 completion)
  /** Filter by tier (foundation/higher). */
  tier?: string;
  /** Filter by exam board (aqa/edexcel/ocr/etc). */
  examBoard?: string;
  /** Filter by exam subject (biology/chemistry/physics). */
  examSubject?: string;
  /** Filter by KS4 option programme slug. */
  ks4Option?: string;
  /** Filter by year group. */
  year?: string;
  /** Filter by curriculum thread slug. */
  threadSlug?: string;
  /** Filter by category. */
  category?: string;
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

export interface HybridSearchMeta {
  total: number;
  took: number;
  timedOut: boolean;
  aggregations?: SearchAggregations;
  facets?: SearchFacets;
}

/**
 * @internal Helper type for mapping search scopes to their result types
 */
export interface ScopeResultMap {
  units: UnitResult[];
  lessons: LessonResult[];
  sequences: SequenceResult[];
}

export type HybridSearchResult = {
  [Scope in SearchScope]: HybridSearchMeta & {
    scope: Scope;
    results: ScopeResultMap[Scope];
  };
}[SearchScope];

export type { SequenceFacet, SearchFacets };
