/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * MCP Tools index
 * Aggregates all tool definitions and provides the MCP_TOOLS mapping
 */

// Import all tool definitions
import { oakGetSequencesUnits } from './tools/oak-get-sequences-units';
import { oakGetLessonsTranscript } from './tools/oak-get-lessons-transcript';
import { oakGetSearchTranscripts } from './tools/oak-get-search-transcripts';
import { oakGetSequencesAssets } from './tools/oak-get-sequences-assets';
import { oakGetKeyStagesSubjectAssets } from './tools/oak-get-key-stages-subject-assets';
import { oakGetLessonsAssets } from './tools/oak-get-lessons-assets';
import { oakGetLessonsAssetsByType } from './tools/oak-get-lessons-assets-by-type';
import { oakGetSubjects } from './tools/oak-get-subjects';
import { oakGetSubjectDetail } from './tools/oak-get-subject-detail';
import { oakGetSubjectsSequences } from './tools/oak-get-subjects-sequences';
import { oakGetSubjectsKeyStages } from './tools/oak-get-subjects-key-stages';
import { oakGetSubjectsYears } from './tools/oak-get-subjects-years';
import { oakGetKeyStages } from './tools/oak-get-key-stages';
import { oakGetKeyStagesSubjectLessons } from './tools/oak-get-key-stages-subject-lessons';
import { oakGetKeyStagesSubjectUnits } from './tools/oak-get-key-stages-subject-units';
import { oakGetLessonsQuiz } from './tools/oak-get-lessons-quiz';
import { oakGetSequencesQuestions } from './tools/oak-get-sequences-questions';
import { oakGetKeyStagesSubjectQuestions } from './tools/oak-get-key-stages-subject-questions';
import { oakGetLessonsSummary } from './tools/oak-get-lessons-summary';
import { oakGetSearchLessons } from './tools/oak-get-search-lessons';
import { oakGetUnitsSummary } from './tools/oak-get-units-summary';
import { oakGetThreads } from './tools/oak-get-threads';
import { oakGetThreadsUnits } from './tools/oak-get-threads-units';
import { oakGetChangelog } from './tools/oak-get-changelog';
import { oakGetChangelogLatest } from './tools/oak-get-changelog-latest';
import { oakGetRateLimit } from './tools/oak-get-rate-limit';

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
} from './types';

// Re-export lib functions with explicit names
export {
  getToolFromToolName,
  getToolFromOperationId,
} from './lib';
