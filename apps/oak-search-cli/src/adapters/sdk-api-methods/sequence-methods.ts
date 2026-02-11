/**
 * Sequence and subject-related API method factories.
 * @module sdk-api-methods/sequence-methods
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/oak-curriculum-sdk';
import { ok, err } from '@oaknational/result';
import { isSubjectSequences } from '../../types/oak';
import type { GetSubjectSequencesFn, GetSequenceUnitsFn } from '../oak-adapter-types';
import { safeGet } from '../sdk-safe-get';

/** Create getSubjectSequences method. */
export function makeGetSubjectSequences(client: OakApiClient): GetSubjectSequencesFn {
  return async (subject) => {
    const getResult = await safeGet(
      () =>
        client.GET('/subjects/{subject}/sequences', {
          params: { path: { subject } },
        }),
      subject,
      'sequence',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
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
    return ok(res.data ?? []);
  };
}
