/**
 * Lesson-related API method factories.
 */

import type { OakApiClient } from '@oaknational/curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/curriculum-sdk';
import { ok, err } from '@oaknational/result';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import { isTranscriptResponse, isLessonGroups } from '../sdk-guards';
import type {
  GetTranscriptFn,
  GetLessonSummaryFn,
  GetLessonsByKeyStageAndSubjectFn,
} from '../oak-adapter-types';
import { safeGet } from '../sdk-safe-get';

/** Create getLessonTranscript method. */
export function makeGetLessonTranscript(client: Pick<OakApiClient, 'GET'>): GetTranscriptFn {
  return async (lessonSlug) => {
    const getResult = await safeGet(
      () =>
        client.GET('/lessons/{lesson}/transcript', {
          params: { path: { lesson: lessonSlug } },
        }),
      lessonSlug,
      'transcript',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, lessonSlug, 'transcript', res.response.statusText),
      );
    }
    if (isTranscriptResponse(res.data)) {
      return ok(res.data);
    }
    return err(validationError(lessonSlug, 'TranscriptResponse', res.data));
  };
}

/** Create getLessonSummary method. */
export function makeGetLessonSummary(client: Pick<OakApiClient, 'GET'>): GetLessonSummaryFn {
  return async (lessonSlug) => {
    const getResult = await safeGet(
      () =>
        client.GET('/lessons/{lesson}/summary', {
          params: { path: { lesson: lessonSlug } },
        }),
      lessonSlug,
      'lesson',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, lessonSlug, 'lesson', res.response.statusText),
      );
    }
    if (isLessonSummary(res.data)) {
      return ok(res.data);
    }
    return err(validationError(lessonSlug, 'LessonSummary', res.data));
  };
}

/** Create getLessonsByKeyStageAndSubject method. */
export function makeGetLessonsByKeyStageAndSubject(
  client: Pick<OakApiClient, 'GET'>,
): GetLessonsByKeyStageAndSubjectFn {
  return async (keyStage: KeyStage, subject: SearchSubjectSlug, options = {}) => {
    const { limit = 100, offset = 0, unit } = options;
    const resource = `${keyStage}/${subject}`;
    const getResult = await safeGet(
      () =>
        client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
          params: { path: { keyStage, subject }, query: { limit, offset, unit } },
        }),
      resource,
      'lesson',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, resource, 'other', res.response.statusText),
      );
    }
    if (!res.data) {
      return ok([]);
    }
    if (isLessonGroups(res.data)) {
      return ok(res.data);
    }
    return err(validationError(resource, 'LessonGroups', res.data));
  };
}
