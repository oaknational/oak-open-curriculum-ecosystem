/**
 * Runtime response-shape guards for SDK endpoints used by the search app.
 *
 * Centralised here so downstream apps do not define their own guards.
 */

import { schemas } from './generated/zod/zodSchemas.js';

export function isUnitsGrouped(
  v: unknown,
): v is { units: { unitSlug: string; unitTitle: string }[] }[] {
  return schemas.AllKeyStageAndSubjectUnitsResponseSchema.safeParse(v).success;
}

export function isLessonGroups(v: unknown): v is {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
}[] {
  return schemas.KeyStageSubjectLessonsResponseSchema.safeParse(v).success;
}

export function isTranscriptResponse(v: unknown): v is { transcript: string; vtt: string } {
  return schemas.TranscriptResponseSchema.safeParse(v).success;
}
