/**
 * Sequence and subject-related API method factories.
 */

import type { OakApiClient } from '@oaknational/curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/curriculum-sdk';
import { ok, err } from '@oaknational/result';
import { isSubjectDetail, isSequenceUnitsResponse } from '../../types/oak';
import type { GetSubjectDetailFn, GetSequenceUnitsFn } from '../oak-adapter-types';
import { safeGet } from '../sdk-safe-get';

/**
 * Create getSubjectDetail method.
 *
 * Fetches `/subjects/{subject}` — the subject detail response whose
 * `sequenceSlugs` field is the per-subject sequence enumeration
 * (e.g. science → science-primary, science-secondary-aqa/edexcel/ocr).
 */
export function makeGetSubjectDetail(client: Pick<OakApiClient, 'GET'>): GetSubjectDetailFn {
  return async (subject) => {
    const getResult = await safeGet(
      () =>
        client.GET('/subjects/{subject}', {
          params: { path: { subject } },
        }),
      subject,
      'other',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, subject, 'other', res.response.statusText));
    }
    if (isSubjectDetail(res.data)) {
      return ok(res.data);
    }
    return err(validationError(subject, 'SubjectDetail', res.data));
  };
}

/** Create getSequenceUnits method. */
export function makeGetSequenceUnits(client: Pick<OakApiClient, 'GET'>): GetSequenceUnitsFn {
  return async (sequenceSlug) => {
    const getResult = await safeGet(
      () =>
        client.GET('/sequences/{sequence}/units', {
          params: { path: { sequence: sequenceSlug } },
        }),
      sequenceSlug,
      'sequence',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, sequenceSlug, 'other', res.response.statusText),
      );
    }
    const data = res.data ?? [];
    if (isSequenceUnitsResponse(data)) {
      return ok(data);
    }
    return err(validationError(sequenceSlug, 'SequenceUnitsResponse', data));
  };
}
