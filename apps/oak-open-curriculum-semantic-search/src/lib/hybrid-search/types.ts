import type { LessonsIndexDoc, UnitsIndexDoc, SubjectSlug, KeyStage } from '../../types/oak';

export interface StructuredQuery {
  scope: 'units' | 'lessons';
  text: string;
  subject?: SubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  size?: number;
  from?: number;
  highlight?: boolean;
}

export interface UnitResult {
  id: string;
  rankScore: number;
  unit: UnitsIndexDoc | null;
  highlights: string[];
}

export interface LessonResult {
  id: string;
  rankScore: number;
  lesson: LessonsIndexDoc;
  highlights: string[];
}

export type HybridSearchResult =
  | { scope: 'units'; results: UnitResult[] }
  | { scope: 'lessons'; results: LessonResult[] };
