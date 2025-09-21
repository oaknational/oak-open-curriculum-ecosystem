/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * MCP Tools index
 * Aggregates all tool definitions and provides the MCP_TOOLS mapping
 */

// Import type helpers to satisfy TS2742 portable type naming
import type {} from 'openapi-typescript-helpers';

// Import types used to provide a stable, nameable export surface
import type { AllToolNames, ToolDescriptor } from './types.js';

// Import all tool definitions
import { getChangelog } from './tools/get-changelog.js';
import { getChangelogLatest } from './tools/get-changelog-latest.js';
import { getKeyStages } from './tools/get-key-stages.js';
import { getKeyStagesSubjectAssets } from './tools/get-key-stages-subject-assets.js';
import { getKeyStagesSubjectLessons } from './tools/get-key-stages-subject-lessons.js';
import { getKeyStagesSubjectQuestions } from './tools/get-key-stages-subject-questions.js';
import { getKeyStagesSubjectUnits } from './tools/get-key-stages-subject-units.js';
import { getLessonsAssets } from './tools/get-lessons-assets.js';
import { getLessonsAssetsByType } from './tools/get-lessons-assets-by-type.js';
import { getLessonsQuiz } from './tools/get-lessons-quiz.js';
import { getLessonsSummary } from './tools/get-lessons-summary.js';
import { getLessonsTranscript } from './tools/get-lessons-transcript.js';
import { getRateLimit } from './tools/get-rate-limit.js';
import { getSearchLessons } from './tools/get-search-lessons.js';
import { getSearchTranscripts } from './tools/get-search-transcripts.js';
import { getSequencesAssets } from './tools/get-sequences-assets.js';
import { getSequencesQuestions } from './tools/get-sequences-questions.js';
import { getSequencesUnits } from './tools/get-sequences-units.js';
import { getSubjectDetail } from './tools/get-subject-detail.js';
import { getSubjects } from './tools/get-subjects.js';
import { getSubjectsKeyStages } from './tools/get-subjects-key-stages.js';
import { getSubjectsSequences } from './tools/get-subjects-sequences.js';
import { getSubjectsYears } from './tools/get-subjects-years.js';
import { getThreads } from './tools/get-threads.js';
import { getThreadsUnits } from './tools/get-threads-units.js';
import { getUnitsSummary } from './tools/get-units-summary.js';

// Tool name to tool mapping
export const MCP_TOOLS: Readonly<Record<AllToolNames, ToolDescriptor>> = {
  'get-changelog': getChangelog,
  'get-changelog-latest': getChangelogLatest,
  'get-key-stages': getKeyStages,
  'get-key-stages-subject-assets': getKeyStagesSubjectAssets,
  'get-key-stages-subject-lessons': getKeyStagesSubjectLessons,
  'get-key-stages-subject-questions': getKeyStagesSubjectQuestions,
  'get-key-stages-subject-units': getKeyStagesSubjectUnits,
  'get-lessons-assets': getLessonsAssets,
  'get-lessons-assets-by-type': getLessonsAssetsByType,
  'get-lessons-quiz': getLessonsQuiz,
  'get-lessons-summary': getLessonsSummary,
  'get-lessons-transcript': getLessonsTranscript,
  'get-rate-limit': getRateLimit,
  'get-search-lessons': getSearchLessons,
  'get-search-transcripts': getSearchTranscripts,
  'get-sequences-assets': getSequencesAssets,
  'get-sequences-questions': getSequencesQuestions,
  'get-sequences-units': getSequencesUnits,
  'get-subject-detail': getSubjectDetail,
  'get-subjects': getSubjects,
  'get-subjects-key-stages': getSubjectsKeyStages,
  'get-subjects-sequences': getSubjectsSequences,
  'get-subjects-years': getSubjectsYears,
  'get-threads': getThreads,
  'get-threads-units': getThreadsUnits,
  'get-units-summary': getUnitsSummary,
};

export { 
  type AllOperationIds,
  type AllToolNames,
  isToolName,
  getToolNameFromOperationId
} from './types.js';
