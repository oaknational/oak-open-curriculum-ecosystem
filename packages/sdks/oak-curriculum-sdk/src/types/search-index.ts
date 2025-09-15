/**
 * Search index document types for the hybrid search service.
 *
 * These are colocated in the SDK so downstream apps can import a
 * single source of truth for types and guards.
 */

import type { KeyStage, Subject } from './generated/api-schema/path-parameters.js';

/** Alias used by downstream apps. */
export type SubjectSlug = Subject;

/** ES lesson document (search index shape). */
export interface LessonsIndexDoc {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  unit_ids: string[];
  unit_titles: string[];
  transcript_text: string;
}

/** ES unit document (search index shape). */
export interface UnitsIndexDoc {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  unit_topics?: string;
}

/** ES rollup document (search index shape). */
export interface UnitRollupDoc {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  rollup_text: string;
}
