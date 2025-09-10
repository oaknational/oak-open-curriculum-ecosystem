import type { components } from '@oaknational/oak-curriculum-sdk';

export type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
export type SubjectSlug = components['schemas']['AllSubjectsResponseSchema'][number];

/** ES lesson document (search index shape). */
export type LessonsIndexDoc = {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  unit_ids: string[];
  unit_titles: string[];
  transcript_text: string;
};

/** ES unit document (search index shape). */
export type UnitsIndexDoc = {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  unit_topics?: string;
};

/** ES rollup document (search index shape). */
export type UnitRollupDoc = {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  rollup_text: string;
};
