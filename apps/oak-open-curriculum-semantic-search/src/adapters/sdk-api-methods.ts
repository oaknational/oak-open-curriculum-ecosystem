/**
 * API method factories for Oak SDK client.
 *
 * Pure functions that create typed API methods from the base client.
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 *
 * @see {@link ../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md}
 * @packageDocumentation
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/oak-curriculum-sdk';
import { ok, err } from '@oaknational/result';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import { isLessonSummary, isUnitSummary, isSubjectSequences } from '../types/oak';
import { isUnitsGrouped, isTranscriptResponse, isLessonGroups } from './sdk-guards';
import type {
  GetUnitsFn,
  GetTranscriptFn,
  GetLessonSummaryFn,
  GetUnitSummaryFn,
  GetSubjectSequencesFn,
  GetSequenceUnitsFn,
  GetLessonsByKeyStageAndSubjectFn,
} from './oak-adapter-types';

/** Create getUnitsByKeyStageAndSubject method. */
export function makeGetUnitsByKeyStageAndSubject(client: OakApiClient): GetUnitsFn {
  return async (keyStage, subject) => {
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
      params: { path: { keyStage, subject } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(
          res.response.status,
          `${keyStage}/${subject}`,
          'other',
          res.response.statusText,
        ),
      );
    }
    if (!res.data) {
      return ok([]);
    }
    if (isUnitsGrouped(res.data)) {
      return ok(res.data.flatMap((group) => group.units));
    }
    return err(validationError(`${keyStage}/${subject}`, 'UnitsGrouped', res.data));
  };
}

/** Create getLessonTranscript method. */
export function makeGetLessonTranscript(client: OakApiClient): GetTranscriptFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/transcript', {
      params: { path: { lesson: lessonSlug } },
    });
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
export function makeGetLessonSummary(client: OakApiClient): GetLessonSummaryFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/summary', {
      params: { path: { lesson: lessonSlug } },
    });
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

/** Create getUnitSummary method. */
export function makeGetUnitSummary(client: OakApiClient): GetUnitSummaryFn {
  return async (unitSlug) => {
    const res = await client.GET('/units/{unit}/summary', {
      params: { path: { unit: unitSlug } },
    });
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, unitSlug, 'unit', res.response.statusText));
    }
    if (isUnitSummary(res.data)) {
      return ok(res.data);
    }
    return err(validationError(unitSlug, 'UnitSummary', res.data));
  };
}

/** Create getSubjectSequences method. */
export function makeGetSubjectSequences(client: OakApiClient): GetSubjectSequencesFn {
  return async (subject) => {
    const res = await client.GET('/subjects/{subject}/sequences', {
      params: { path: { subject } },
    });
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, subject, 'other', res.response.statusText));
    }
    const data = res.data ?? [];
    if (isSubjectSequences(data)) {
      return ok(data);
    }
    return err(validationError(subject, 'SubjectSequences', data));
  };
}

/** Create getSequenceUnits method. */
export function makeGetSequenceUnits(client: OakApiClient): GetSequenceUnitsFn {
  return async (sequenceSlug) => {
    const res = await client.GET('/sequences/{sequence}/units', {
      params: { path: { sequence: sequenceSlug } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, sequenceSlug, 'other', res.response.statusText),
      );
    }
    return ok(res.data ?? []);
  };
}

/** Create getLessonsByKeyStageAndSubject method. */
export function makeGetLessonsByKeyStageAndSubject(
  client: OakApiClient,
): GetLessonsByKeyStageAndSubjectFn {
  return async (keyStage: KeyStage, subject: SearchSubjectSlug, options = {}) => {
    const { limit = 100, offset = 0, unit } = options;
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
      params: { path: { keyStage, subject }, query: { limit, offset, unit } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(
          res.response.status,
          `${keyStage}/${subject}`,
          'other',
          res.response.statusText,
        ),
      );
    }
    if (!res.data) {
      return ok([]);
    }
    if (isLessonGroups(res.data)) {
      return ok(res.data);
    }
    return err(validationError(`${keyStage}/${subject}`, 'LessonGroups', res.data));
  };
}
