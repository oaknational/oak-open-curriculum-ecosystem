/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Request parameter schemas derived from the OpenAPI specification.
 */
import { z } from 'zod';
import type { AllowedMethods, ValidPath } from '../path-parameters.js';

export const REQUEST_PARAMETER_SCHEMAS = {
  "GET:/sequences/:sequence/units": z.object({
    "sequence": z.string(),
    "year": z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"]).optional(),
  }),
  "GET:/lessons/:lesson/transcript": z.object({
    "lesson": z.string(),
  }),
  "GET:/search/transcripts": z.object({
    "q": z.string(),
  }),
  "GET:/sequences/:sequence/assets": z.object({
    "sequence": z.string(),
    "year": z.number().optional(),
    "type": z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"]).optional(),
  }),
  "GET:/key-stages/:keyStage/subject/:subject/assets": z.object({
    "keyStage": z.enum(["ks1", "ks2", "ks3", "ks4"]),
    "subject": z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"]),
    "type": z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"]).optional(),
    "unit": z.string().optional(),
  }),
  "GET:/lessons/:lesson/assets": z.object({
    "lesson": z.string(),
    "type": z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"]).optional(),
  }),
  "GET:/lessons/:lesson/assets/:type": z.object({
    "lesson": z.string(),
    "type": z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"]),
  }),
  "GET:/subjects": z.object({}),
  "GET:/subjects/:subject": z.object({
    "subject": z.string(),
  }),
  "GET:/subjects/:subject/sequences": z.object({
    "subject": z.string(),
  }),
  "GET:/subjects/:subject/key-stages": z.object({
    "subject": z.string(),
  }),
  "GET:/subjects/:subject/years": z.object({
    "subject": z.string(),
  }),
  "GET:/key-stages": z.object({}),
  "GET:/key-stages/:keyStage/subject/:subject/lessons": z.object({
    "keyStage": z.enum(["ks1", "ks2", "ks3", "ks4"]),
    "subject": z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"]),
    "unit": z.string().optional(),
    "offset": z.number().optional().default(0),
    "limit": z.number().lte(100).optional().default(10),
  }),
  "GET:/key-stages/:keyStage/subject/:subject/units": z.object({
    "keyStage": z.enum(["ks1", "ks2", "ks3", "ks4"]),
    "subject": z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"]),
  }),
  "GET:/lessons/:lesson/quiz": z.object({
    "lesson": z.string(),
  }),
  "GET:/sequences/:sequence/questions": z.object({
    "sequence": z.string(),
    "year": z.number().optional(),
    "offset": z.number().optional().default(0),
    "limit": z.number().lte(100).optional().default(10),
  }),
  "GET:/key-stages/:keyStage/subject/:subject/questions": z.object({
    "keyStage": z.enum(["ks1", "ks2", "ks3", "ks4"]),
    "subject": z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"]),
    "offset": z.number().optional().default(0),
    "limit": z.number().lte(100).optional().default(10),
  }),
  "GET:/lessons/:lesson/summary": z.object({
    "lesson": z.string(),
  }),
  "GET:/search/lessons": z.object({
    "q": z.string(),
    "keyStage": z.enum(["ks1", "ks2", "ks3", "ks4"]).optional(),
    "subject": z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"]).optional(),
    "unit": z.string().optional(),
  }),
  "GET:/units/:unit/summary": z.object({
    "unit": z.string(),
  }),
  "GET:/threads": z.object({}),
  "GET:/threads/:threadSlug/units": z.object({
    "threadSlug": z.string(),
  }),
  "GET:/changelog": z.object({}),
  "GET:/changelog/latest": z.object({}),
  "GET:/rate-limit": z.object({}),
} as const;

export type RequestParameterSchemas = typeof REQUEST_PARAMETER_SCHEMAS;
export type RequestParameterKey = keyof RequestParameterSchemas;

export function getRequestParameterSchema(
  method: AllowedMethods,
  path: ValidPath,
): RequestParameterSchemas[RequestParameterKey] | undefined {
  const key = method.toUpperCase() + ':' + path;
  return REQUEST_PARAMETER_SCHEMAS[key as RequestParameterKey];
}
