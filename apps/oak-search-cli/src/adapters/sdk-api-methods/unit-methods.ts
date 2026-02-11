/**
 * Unit-related API method factories.
 * @module sdk-api-methods/unit-methods
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { classifyHttpError, validationError } from '@oaknational/oak-curriculum-sdk';
import { ok, err } from '@oaknational/result';
import { isUnitSummary } from '../../types/oak';
import { isUnitsGrouped } from '../sdk-guards';
import type { GetUnitsFn, GetUnitSummaryFn } from '../oak-adapter-types';
import { safeGet } from '../sdk-safe-get';

/** Create getUnitsByKeyStageAndSubject method. */
export function makeGetUnitsByKeyStageAndSubject(client: OakApiClient): GetUnitsFn {
  return async (keyStage, subject) => {
    const resource = `${keyStage}/${subject}`;
    const getResult = await safeGet(
      () =>
        client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
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
    if (isUnitsGrouped(res.data)) {
      return ok(res.data.flatMap((group) => group.units));
    }
    return err(validationError(resource, 'UnitsGrouped', res.data));
  };
}

/** Create getUnitSummary method. */
export function makeGetUnitSummary(client: OakApiClient): GetUnitSummaryFn {
  return async (unitSlug) => {
    const getResult = await safeGet(
      () =>
        client.GET('/units/{unit}/summary', {
          params: { path: { unit: unitSlug } },
        }),
      unitSlug,
      'unit',
    );
    if (!getResult.ok) {
      return getResult;
    }
    const res = getResult.value;
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, unitSlug, 'unit', res.response.statusText));
    }
    if (isUnitSummary(res.data)) {
      return ok(res.data);
    }
    return err(validationError(unitSlug, 'UnitSummary', res.data));
  };
}
