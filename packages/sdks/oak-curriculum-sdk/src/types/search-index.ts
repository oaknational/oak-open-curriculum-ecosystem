/**
 * Search index document types for the hybrid search service.
 *
 * These are colocated in the SDK so downstream apps can import a
 * single source of truth for types and guards.
 */

import type { KeyStage, Subject } from './generated/api-schema/path-parameters.js';

/** Alias used by search index types. */
export type SearchSubjectSlug = Subject;

/** Completion suggestion payload used across search documents. */
export interface SearchCompletionSuggestPayload {
  input: string[];
  weight?: number;
  contexts?: {
    subject?: string[];
    key_stage?: string[];
    sequence?: string[];
    phase?: string[];
  };
}

/** ES lesson document (search index shape). */
export interface SearchLessonsIndexDoc {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  subject_slug: SearchSubjectSlug;
  key_stage: KeyStage;
  years?: string[];
  unit_ids: string[];
  unit_titles: string[];
  unit_count?: number;
  lesson_keywords?: string[];
  key_learning_points?: string[];
  misconceptions_and_common_mistakes?: string[];
  teacher_tips?: string[];
  content_guidance?: string[];
  transcript_text: string;
  lesson_semantic?: string;
  lesson_url: string;
  unit_urls: string[];
  title_suggest?: SearchCompletionSuggestPayload;
}

/** ES unit document (search index shape). */
export interface SearchUnitsIndexDoc {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SearchSubjectSlug;
  key_stage: KeyStage;
  years?: string[];
  lesson_ids: string[];
  lesson_count: number;
  unit_topics?: string[];
  unit_url: string;
  subject_programmes_url: string;
  sequence_ids?: string[];
  title_suggest?: SearchCompletionSuggestPayload;
}

/** ES rollup document (search index shape). */
export interface SearchUnitRollupDoc {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SearchSubjectSlug;
  key_stage: KeyStage;
  years?: string[];
  lesson_ids: string[];
  lesson_count: number;
  unit_topics?: string[];
  rollup_text: string;
  unit_semantic?: string;
  unit_url: string;
  subject_programmes_url: string;
  sequence_ids?: string[];
  title_suggest?: SearchCompletionSuggestPayload;
}

/** ES sequence document (search index shape). */
export interface SearchSequenceIndexDoc {
  sequence_id: string;
  sequence_slug: string;
  sequence_title: string;
  subject_slug: SearchSubjectSlug;
  subject_title?: string;
  phase_slug?: string;
  phase_title?: string;
  category_titles?: string[];
  key_stages?: string[];
  years?: string[];
  unit_slugs?: string[];
  sequence_semantic?: string;
  sequence_url: string;
  title_suggest?: SearchCompletionSuggestPayload;
}
