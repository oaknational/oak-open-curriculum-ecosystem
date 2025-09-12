/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Response validator map built from OpenAPI schema at compile-time.
 */

import type { z } from 'zod';
import { schemas } from '../zod/schemas.js';

const responseSchemaMap = new Map<string, z.ZodSchema>();
responseSchemaMap.set('getSequences-getSequenceUnits:200', schemas.SequenceUnitsResponseSchema);
responseSchemaMap.set('getLessonTranscript-getLessonTranscript:200', schemas.TranscriptResponseSchema);
responseSchemaMap.set('searchTranscripts-searchTranscripts:200', schemas.SearchTranscriptResponseSchema);
responseSchemaMap.set('getAssets-getSequenceAssets:200', schemas.SequenceAssetsResponseSchema);
responseSchemaMap.set('getAssets-getSubjectAssets:200', schemas.SubjectAssetsResponseSchema);
responseSchemaMap.set('getAssets-getLessonAssets:200', schemas.LessonAssetsResponseSchema);
responseSchemaMap.set('getAssets-getLessonAsset:200', schemas.LessonAssetResponseSchema);
responseSchemaMap.set('getSubjects-getAllSubjects:200', schemas.AllSubjectsResponseSchema);
responseSchemaMap.set('getSubjects-getSubject:200', schemas.SubjectResponseSchema);
responseSchemaMap.set('getSubjects-getSubjectSequence:200', schemas.SubjectSequenceResponseSchema);
responseSchemaMap.set('getSubjects-getSubjectKeyStages:200', schemas.SubjectKeyStagesResponseSchema);
responseSchemaMap.set('getSubjects-getSubjectYears:200', schemas.SubjectYearsResponseSchema);
responseSchemaMap.set('getKeyStages-getKeyStages:200', schemas.KeyStageResponseSchema);
responseSchemaMap.set('getKeyStageSubjectLessons-getKeyStageSubjectLessons:200', schemas.KeyStageSubjectLessonsResponseSchema);
responseSchemaMap.set('getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits:200', schemas.AllKeyStageAndSubjectUnitsResponseSchema);
responseSchemaMap.set('getQuestions-getQuestionsForLessons:200', schemas.QuestionForLessonsResponseSchema);
responseSchemaMap.set('getQuestions-getQuestionsForSequence:200', schemas.QuestionsForSequenceResponseSchema);
responseSchemaMap.set('getQuestions-getQuestionsForKeyStageAndSubject:200', schemas.QuestionsForKeyStageAndSubjectResponseSchema);
responseSchemaMap.set('getLessons-getLesson:200', schemas.LessonSummaryResponseSchema);
responseSchemaMap.set('getLessons-searchByTextSimilarity:200', schemas.LessonSearchResponseSchema);
responseSchemaMap.set('getUnits-getUnit:200', schemas.UnitSummaryResponseSchema);
responseSchemaMap.set('getThreads-getAllThreads:200', schemas.AllThreadsResponseSchema);
responseSchemaMap.set('getThreads-getThreadUnits:200', schemas.ThreadUnitsResponseSchema);
responseSchemaMap.set('getRateLimit-getRateLimit:200', schemas.RateLimitResponseSchema);

export { responseSchemaMap };