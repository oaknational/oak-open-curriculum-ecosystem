import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSubjectSlug,
  KeyStage,
} from '../../types/oak';

export interface StructuredQuery {
  scope: 'units' | 'lessons';
  text: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  size?: number;
  from?: number;
  highlight?: boolean;
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

export type HybridSearchResult =
  | { scope: 'units'; results: UnitResult[] }
  | { scope: 'lessons'; results: LessonResult[] };
