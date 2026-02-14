/**
 * Asset-related API method factories.
 */

import type { OakApiClient } from '@oaknational/curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/curriculum-sdk';
import { ok, err } from '@oaknational/result';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isSubjectAssets } from '../sdk-guards';
import type { GetSubjectAssetsFn } from '../oak-adapter-types';
import { safeGet } from '../sdk-safe-get';

/**
 * Create getSubjectAssets method.
 * Fetches all assets for a subject/keystage in a single bulk call.
 * Used to determine video availability before fetching transcripts.
 */
export function makeGetSubjectAssets(client: OakApiClient): GetSubjectAssetsFn {
  return async (keyStage: KeyStage, subject: SearchSubjectSlug) => {
    const resource = `${keyStage}/${subject}/assets`;
    const getResult = await safeGet(
      () =>
        client.GET('/key-stages/{keyStage}/subject/{subject}/assets', {
          params: { path: { keyStage, subject } },
        }),
      resource,
      'other',
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
    if (isSubjectAssets(res.data)) {
      return ok(res.data);
    }
    return err(validationError(`${keyStage}/${subject}`, 'SubjectAssets', res.data));
  };
}
