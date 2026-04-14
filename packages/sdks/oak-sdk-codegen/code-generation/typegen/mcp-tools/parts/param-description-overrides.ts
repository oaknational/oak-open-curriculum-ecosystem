/**
 * Parameter description overrides for known upstream OpenAPI spec bugs.
 *
 * Each override corrects a specific parameter description that is wrong in the
 * upstream schema. Overrides are keyed by `{path}:{paramName}` and include the
 * incorrect upstream description so that a schema-cache test can detect when the
 * upstream bug is fixed and flag the override for removal.
 *
 * @see upstream-param-description-overrides.unit.test.ts — removal-condition test
 */

import type { ParamMetadataMap } from './param-metadata.js';

interface ParamDescriptionOverride {
  /** The correct description to use instead of the upstream one */
  readonly correctDescription: string;
  /** The known-incorrect upstream description (used by the removal-condition test) */
  readonly upstreamBuggyDescription: string;
}

/**
 * Map of `{openApiPath}:{paramName}` to override definitions.
 *
 * When the upstream spec is fixed, the schema-cache test will detect that
 * the cached description no longer matches `upstreamBuggyDescription` and
 * fail, signalling that the override should be removed.
 */
const PARAM_DESCRIPTION_OVERRIDES: Readonly<Record<string, ParamDescriptionOverride>> = {
  '/key-stages/{keyStage}/subject/{subject}/lessons:offset': {
    correctDescription: 'Offset applied to lessons within each unit (not to the unit list).',
    upstreamBuggyDescription:
      'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
  },
  '/key-stages/{keyStage}/subject/{subject}/lessons:limit': {
    correctDescription:
      'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
    upstreamBuggyDescription: 'Offset applied to lessons within each unit (not to the unit list).',
  },
};

/**
 * Apply parameter description overrides to correct known upstream spec bugs.
 *
 * Mutates the metadata maps in place — call after `buildParamMetadataForOperation`.
 */
export function applyParamDescriptionOverrides(
  path: string,
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): void {
  for (const [key, override] of Object.entries(PARAM_DESCRIPTION_OVERRIDES)) {
    const [overridePath, paramName] = key.split(':');
    if (overridePath !== path || !paramName) {
      continue;
    }
    for (const map of [pathParamMetadata, queryParamMetadata]) {
      const target = map[paramName];
      if (target) {
        map[paramName] = { ...target, description: override.correctDescription };
      }
    }
  }
}

/**
 * Exported for the removal-condition test only.
 *
 * The test reads the schema cache and checks whether each override's
 * `upstreamBuggyDescription` still matches the cached description. When it
 * no longer matches, the upstream bug has been fixed and the override can
 * be removed.
 */
export { PARAM_DESCRIPTION_OVERRIDES };
