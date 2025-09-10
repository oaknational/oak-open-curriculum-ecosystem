/**
 * SDK guard integration.
 * We import input guards/allowed-values from the SDK root,
 * and provide structural fallbacks for response shapes.
 */
import {
  isKeyStage as sdkIsKeyStage,
  isSubject as sdkIsSubject,
  KEY_STAGES as SDK_KEY_STAGES,
  SUBJECTS as SDK_SUBJECTS,
} from '@oaknational/oak-curriculum-sdk';

export const isKeyStage = sdkIsKeyStage;
export const isSubject = sdkIsSubject;
export const KEY_STAGES = SDK_KEY_STAGES;
export const SUBJECTS = SDK_SUBJECTS;

/** Response-shape fallbacks (strict, no `any`). */
function isString(v: unknown): v is string {
  return typeof v === 'string';
}

export function isUnitsFlat(v: unknown): v is Array<{ unitSlug: string; unitTitle: string }> {
  return (
    Array.isArray(v) &&
    v.every(
      (u) =>
        typeof u === 'object' &&
        u !== null &&
        isString((u as Record<string, unknown>)['unitSlug']) &&
        isString((u as Record<string, unknown>)['unitTitle']),
    )
  );
}

export function isUnitsGrouped(
  v: unknown,
): v is Array<{ units: Array<{ unitSlug: string; unitTitle: string }> }> {
  return (
    Array.isArray(v) &&
    v.every(
      (g) =>
        typeof g === 'object' &&
        g !== null &&
        Array.isArray((g as Record<string, unknown>)['units']) &&
        (g as { units: unknown[] }).units.every(
          (u) =>
            typeof u === 'object' &&
            u !== null &&
            isString((u as Record<string, unknown>)['unitSlug']) &&
            isString((u as Record<string, unknown>)['unitTitle']),
        ),
    )
  );
}

export function isLessonGroups(v: unknown): v is Array<{
  unitSlug: string;
  unitTitle: string;
  lessons: Array<{ lessonSlug: string; lessonTitle: string }>;
}> {
  return (
    Array.isArray(v) &&
    v.every(
      (g) =>
        typeof g === 'object' &&
        g !== null &&
        isString((g as Record<string, unknown>)['unitSlug']) &&
        isString((g as Record<string, unknown>)['unitTitle']) &&
        Array.isArray((g as Record<string, unknown>)['lessons']) &&
        (g as { lessons: unknown[] }).lessons.every(
          (l) =>
            typeof l === 'object' &&
            l !== null &&
            isString((l as Record<string, unknown>)['lessonSlug']) &&
            isString((l as Record<string, unknown>)['lessonTitle']),
        ),
    )
  );
}

export function isTranscriptResponse(v: unknown): v is { transcript: string; vtt: string } {
  return (
    typeof v === 'object' &&
    v !== null &&
    isString((v as Record<string, unknown>)['transcript']) &&
    isString((v as Record<string, unknown>)['vtt'])
  );
}
