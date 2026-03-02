/* GENERATED FILE - DO NOT EDIT */
import { stubGetChangelogResponse } from './get-changelog.js';
import { stubGetChangelogLatestResponse } from './get-changelog-latest.js';
import { stubGetKeyStagesResponse } from './get-key-stages.js';
import { stubGetKeyStagesSubjectAssetsResponse } from './get-key-stages-subject-assets.js';
import { stubGetKeyStagesSubjectLessonsResponse } from './get-key-stages-subject-lessons.js';
import { stubGetKeyStagesSubjectQuestionsResponse } from './get-key-stages-subject-questions.js';
import { stubGetKeyStagesSubjectUnitsResponse } from './get-key-stages-subject-units.js';
import { stubGetLessonsAssetsResponse } from './get-lessons-assets.js';
import { stubGetLessonsQuizResponse } from './get-lessons-quiz.js';
import { stubGetLessonsSummaryResponse } from './get-lessons-summary.js';
import { stubGetLessonsTranscriptResponse } from './get-lessons-transcript.js';
import { stubGetRateLimitResponse } from './get-rate-limit.js';
import { stubGetSequencesAssetsResponse } from './get-sequences-assets.js';
import { stubGetSequencesQuestionsResponse } from './get-sequences-questions.js';
import { stubGetSequencesUnitsResponse } from './get-sequences-units.js';
import { stubGetSubjectDetailResponse } from './get-subject-detail.js';
import { stubGetSubjectsResponse } from './get-subjects.js';
import { stubGetSubjectsKeyStagesResponse } from './get-subjects-key-stages.js';
import { stubGetSubjectsSequencesResponse } from './get-subjects-sequences.js';
import { stubGetSubjectsYearsResponse } from './get-subjects-years.js';
import { stubGetThreadsResponse } from './get-threads.js';
import { stubGetThreadsUnitsResponse } from './get-threads-units.js';
import { stubGetUnitsSummaryResponse } from './get-units-summary.js';

export const stubbedToolResponses = {
  'get-changelog': () => stubGetChangelogResponse,
  'get-changelog-latest': () => stubGetChangelogLatestResponse,
  'get-key-stages': () => stubGetKeyStagesResponse,
  'get-key-stages-subject-assets': () => stubGetKeyStagesSubjectAssetsResponse,
  'get-key-stages-subject-lessons': () => stubGetKeyStagesSubjectLessonsResponse,
  'get-key-stages-subject-questions': () => stubGetKeyStagesSubjectQuestionsResponse,
  'get-key-stages-subject-units': () => stubGetKeyStagesSubjectUnitsResponse,
  'get-lessons-assets': () => stubGetLessonsAssetsResponse,
  'get-lessons-quiz': () => stubGetLessonsQuizResponse,
  'get-lessons-summary': () => stubGetLessonsSummaryResponse,
  'get-lessons-transcript': () => stubGetLessonsTranscriptResponse,
  'get-rate-limit': () => stubGetRateLimitResponse,
  'get-sequences-assets': () => stubGetSequencesAssetsResponse,
  'get-sequences-questions': () => stubGetSequencesQuestionsResponse,
  'get-sequences-units': () => stubGetSequencesUnitsResponse,
  'get-subject-detail': () => stubGetSubjectDetailResponse,
  'get-subjects': () => stubGetSubjectsResponse,
  'get-subjects-key-stages': () => stubGetSubjectsKeyStagesResponse,
  'get-subjects-sequences': () => stubGetSubjectsSequencesResponse,
  'get-subjects-years': () => stubGetSubjectsYearsResponse,
  'get-threads': () => stubGetThreadsResponse,
  'get-threads-units': () => stubGetThreadsUnitsResponse,
  'get-units-summary': () => stubGetUnitsSummaryResponse,
} as const;

export type StubbedToolName = keyof typeof stubbedToolResponses;