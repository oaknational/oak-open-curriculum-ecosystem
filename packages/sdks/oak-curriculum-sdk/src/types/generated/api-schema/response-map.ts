
/**
* GENERATED FILE - DO NOT EDIT
*
* Response validator map built from OpenAPI schema at compile-time.
*/
import { curriculumSchemas, type CurriculumSchemaDefinition } from '../zod/curriculumZodSchemas.js';
import { type AllowedMethodsForPath, type OperationId, type ValidNumericResponseCode, type ValidPath, type ValidResponseCode, getOperationIdByPathAndMethod } from './path-parameters.js';

const RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS: Record<
  string,
  {
    schema: CurriculumSchemaDefinition;
    operationId: OperationId;
    status: ValidResponseCode | ValidNumericResponseCode;
  }
> = {
"getSequences-getSequenceUnits:200": {schema: curriculumSchemas.SequenceUnitsResponseSchema, operationId: 'getSequences-getSequenceUnits', status: '200'},
"getLessonTranscript-getLessonTranscript:200": {schema: curriculumSchemas.TranscriptResponseSchema, operationId: 'getLessonTranscript-getLessonTranscript', status: '200'},
"searchTranscripts-searchTranscripts:200": {schema: curriculumSchemas.SearchTranscriptResponseSchema, operationId: 'searchTranscripts-searchTranscripts', status: '200'},
"getAssets-getSequenceAssets:200": {schema: curriculumSchemas.SequenceAssetsResponseSchema, operationId: 'getAssets-getSequenceAssets', status: '200'},
"getAssets-getSubjectAssets:200": {schema: curriculumSchemas.SubjectAssetsResponseSchema, operationId: 'getAssets-getSubjectAssets', status: '200'},
"getAssets-getLessonAssets:200": {schema: curriculumSchemas.LessonAssetsResponseSchema, operationId: 'getAssets-getLessonAssets', status: '200'},
"getAssets-getLessonAsset:200": {schema: curriculumSchemas.LessonAssetResponseSchema, operationId: 'getAssets-getLessonAsset', status: '200'},
"getSubjects-getAllSubjects:200": {schema: curriculumSchemas.AllSubjectsResponseSchema, operationId: 'getSubjects-getAllSubjects', status: '200'},
"getSubjects-getSubject:200": {schema: curriculumSchemas.SubjectResponseSchema, operationId: 'getSubjects-getSubject', status: '200'},
"getSubjects-getSubjectSequence:200": {schema: curriculumSchemas.SubjectSequenceResponseSchema, operationId: 'getSubjects-getSubjectSequence', status: '200'},
"getSubjects-getSubjectKeyStages:200": {schema: curriculumSchemas.SubjectKeyStagesResponseSchema, operationId: 'getSubjects-getSubjectKeyStages', status: '200'},
"getSubjects-getSubjectYears:200": {schema: curriculumSchemas.SubjectYearsResponseSchema, operationId: 'getSubjects-getSubjectYears', status: '200'},
"getKeyStages-getKeyStages:200": {schema: curriculumSchemas.KeyStageResponseSchema, operationId: 'getKeyStages-getKeyStages', status: '200'},
"getKeyStageSubjectLessons-getKeyStageSubjectLessons:200": {schema: curriculumSchemas.KeyStageSubjectLessonsResponseSchema, operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons', status: '200'},
"getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits:200": {schema: curriculumSchemas.AllKeyStageAndSubjectUnitsResponseSchema, operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits', status: '200'},
"getQuestions-getQuestionsForLessons:200": {schema: curriculumSchemas.QuestionForLessonsResponseSchema, operationId: 'getQuestions-getQuestionsForLessons', status: '200'},
"getQuestions-getQuestionsForSequence:200": {schema: curriculumSchemas.QuestionsForSequenceResponseSchema, operationId: 'getQuestions-getQuestionsForSequence', status: '200'},
"getQuestions-getQuestionsForKeyStageAndSubject:200": {schema: curriculumSchemas.QuestionsForKeyStageAndSubjectResponseSchema, operationId: 'getQuestions-getQuestionsForKeyStageAndSubject', status: '200'},
"getLessons-getLesson:200": {schema: curriculumSchemas.LessonSummaryResponseSchema, operationId: 'getLessons-getLesson', status: '200'},
"getLessons-searchByTextSimilarity:200": {schema: curriculumSchemas.LessonSearchResponseSchema, operationId: 'getLessons-searchByTextSimilarity', status: '200'},
"getUnits-getUnit:200": {schema: curriculumSchemas.UnitSummaryResponseSchema, operationId: 'getUnits-getUnit', status: '200'},
"getThreads-getAllThreads:200": {schema: curriculumSchemas.AllThreadsResponseSchema, operationId: 'getThreads-getAllThreads', status: '200'},
"getThreads-getThreadUnits:200": {schema: curriculumSchemas.ThreadUnitsResponseSchema, operationId: 'getThreads-getThreadUnits', status: '200'},
"getRateLimit-getRateLimit:200": {schema: curriculumSchemas.RateLimitResponseSchema, operationId: 'getRateLimit-getRateLimit', status: '200'},
};

const ALLOWED_IDS = [
"getSequences-getSequenceUnits:200",
"getLessonTranscript-getLessonTranscript:200",
"searchTranscripts-searchTranscripts:200",
"getAssets-getSequenceAssets:200",
"getAssets-getSubjectAssets:200",
"getAssets-getLessonAssets:200",
"getAssets-getLessonAsset:200",
"getSubjects-getAllSubjects:200",
"getSubjects-getSubject:200",
"getSubjects-getSubjectSequence:200",
"getSubjects-getSubjectKeyStages:200",
"getSubjects-getSubjectYears:200",
"getKeyStages-getKeyStages:200",
"getKeyStageSubjectLessons-getKeyStageSubjectLessons:200",
"getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits:200",
"getQuestions-getQuestionsForLessons:200",
"getQuestions-getQuestionsForSequence:200",
"getQuestions-getQuestionsForKeyStageAndSubject:200",
"getLessons-getLesson:200",
"getLessons-searchByTextSimilarity:200",
"getUnits-getUnit:200",
"getThreads-getAllThreads:200",
"getThreads-getThreadUnits:200",
"getRateLimit-getRateLimit:200"
] as const;

export type AllowedId = typeof ALLOWED_IDS[number];
export function isAllowedId(value: string): value is AllowedId {
const stringIds: readonly string[] = ALLOWED_IDS;
  return stringIds.includes(value);
}


export type ResponseSchemaByOperationIdAndStatus = typeof RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS;

function getResponseSchemaById(id: AllowedId): ResponseSchemaByOperationIdAndStatus[AllowedId]['schema'] {
  const found = RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS[id];
  if (!found) {
    throw new TypeError('No response schema for id: ' + String(id));
  }
  return found.schema;
}

export function getResponseSchemaByOperationIdAndStatus(operationId: OperationId, statusCode: ValidResponseCode | ValidNumericResponseCode): CurriculumSchemaDefinition {
  const key = operationId + ':' + String(statusCode);
  if (!isAllowedId(key)) {
    throw new TypeError('Invalid id: ' + String(key));
  }
  return getResponseSchemaById(key);
}

export function getResponseSchemaByPathAndMethodAndStatus(path: ValidPath, method: AllowedMethodsForPath<ValidPath>, statusCode: ValidResponseCode | ValidNumericResponseCode): CurriculumSchemaDefinition {
  const operationId = getOperationIdByPathAndMethod(path, method);
  if (!operationId) {
    throw new TypeError('Invalid operationId: ' + String(operationId));
  }
  return getResponseSchemaByOperationIdAndStatus(operationId, statusCode);
}

