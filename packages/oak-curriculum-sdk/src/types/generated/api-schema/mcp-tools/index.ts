/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * MCP Tools index
 * Aggregates all tool definitions and provides the MCP_TOOLS mapping
 */

// Import type helpers to satisfy TS2742 portable type naming
import type {} from 'openapi-typescript-helpers';

// Import all tool definitions
import { oakGetSequencesUnits } from './tools/oak-get-sequences-units.js';
import { oakGetLessonsTranscript } from './tools/oak-get-lessons-transcript.js';
import { oakGetSearchTranscripts } from './tools/oak-get-search-transcripts.js';
import { oakGetSequencesAssets } from './tools/oak-get-sequences-assets.js';
import { oakGetKeyStagesSubjectAssets } from './tools/oak-get-key-stages-subject-assets.js';
import { oakGetLessonsAssets } from './tools/oak-get-lessons-assets.js';
import { oakGetLessonsAssetsByType } from './tools/oak-get-lessons-assets-by-type.js';
import { oakGetSubjects } from './tools/oak-get-subjects.js';
import { oakGetSubjectDetail } from './tools/oak-get-subject-detail.js';
import { oakGetSubjectsSequences } from './tools/oak-get-subjects-sequences.js';
import { oakGetSubjectsKeyStages } from './tools/oak-get-subjects-key-stages.js';
import { oakGetSubjectsYears } from './tools/oak-get-subjects-years.js';
import { oakGetKeyStages } from './tools/oak-get-key-stages.js';
import { oakGetKeyStagesSubjectLessons } from './tools/oak-get-key-stages-subject-lessons.js';
import { oakGetKeyStagesSubjectUnits } from './tools/oak-get-key-stages-subject-units.js';
import { oakGetLessonsQuiz } from './tools/oak-get-lessons-quiz.js';
import { oakGetSequencesQuestions } from './tools/oak-get-sequences-questions.js';
import { oakGetKeyStagesSubjectQuestions } from './tools/oak-get-key-stages-subject-questions.js';
import { oakGetLessonsSummary } from './tools/oak-get-lessons-summary.js';
import { oakGetSearchLessons } from './tools/oak-get-search-lessons.js';
import { oakGetUnitsSummary } from './tools/oak-get-units-summary.js';
import { oakGetThreads } from './tools/oak-get-threads.js';
import { oakGetThreadsUnits } from './tools/oak-get-threads-units.js';
import { oakGetChangelog } from './tools/oak-get-changelog.js';
import { oakGetChangelogLatest } from './tools/oak-get-changelog-latest.js';
import { oakGetRateLimit } from './tools/oak-get-rate-limit.js';

// Tool name to tool mapping
export const MCP_TOOLS = {
  'oak-get-sequences-units': oakGetSequencesUnits,
  'oak-get-lessons-transcript': oakGetLessonsTranscript,
  'oak-get-search-transcripts': oakGetSearchTranscripts,
  'oak-get-sequences-assets': oakGetSequencesAssets,
  'oak-get-key-stages-subject-assets': oakGetKeyStagesSubjectAssets,
  'oak-get-lessons-assets': oakGetLessonsAssets,
  'oak-get-lessons-assets-by-type': oakGetLessonsAssetsByType,
  'oak-get-subjects': oakGetSubjects,
  'oak-get-subject-detail': oakGetSubjectDetail,
  'oak-get-subjects-sequences': oakGetSubjectsSequences,
  'oak-get-subjects-key-stages': oakGetSubjectsKeyStages,
  'oak-get-subjects-years': oakGetSubjectsYears,
  'oak-get-key-stages': oakGetKeyStages,
  'oak-get-key-stages-subject-lessons': oakGetKeyStagesSubjectLessons,
  'oak-get-key-stages-subject-units': oakGetKeyStagesSubjectUnits,
  'oak-get-lessons-quiz': oakGetLessonsQuiz,
  'oak-get-sequences-questions': oakGetSequencesQuestions,
  'oak-get-key-stages-subject-questions': oakGetKeyStagesSubjectQuestions,
  'oak-get-lessons-summary': oakGetLessonsSummary,
  'oak-get-search-lessons': oakGetSearchLessons,
  'oak-get-units-summary': oakGetUnitsSummary,
  'oak-get-threads': oakGetThreads,
  'oak-get-threads-units': oakGetThreadsUnits,
  'oak-get-changelog': oakGetChangelog,
  'oak-get-changelog-latest': oakGetChangelogLatest,
  'oak-get-rate-limit': oakGetRateLimit,
} as const;

// Re-export types with explicit names
export { 
  type AllOperationIds,
  type AllToolNames,
  isToolName,
  getToolNameFromOperationId
} from './types.js';

// Re-export lib functions with explicit names
export {
  getToolFromToolName,
  getToolFromOperationId,
} from './lib.js';
