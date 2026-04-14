/**
 * Removal-condition test for parameter description overrides.
 *
 * This test reads the schema cache and verifies that each override's
 * `upstreamBuggyDescription` still matches what the upstream spec provides.
 * When the upstream bug is fixed, this test will FAIL — that failure is the
 * signal to remove the corresponding override from param-description-overrides.ts.
 *
 * @see param-description-overrides.ts
 * @see docs/spikes/upstream-offset-limit-description-swap.md
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { PARAM_DESCRIPTION_OVERRIDES } from './param-description-overrides.js';

const SCHEMA_CACHE_PATH = resolve(
  import.meta.dirname,
  '../../../../schema-cache/api-schema-original.json',
);

interface SchemaParam {
  readonly name: string;
  readonly schema?: { readonly description?: string };
  readonly description?: string;
}

interface SchemaOperation {
  readonly parameters?: readonly SchemaParam[];
}

interface SchemaCache {
  readonly paths: Record<string, Record<string, SchemaOperation>>;
}

function isSchemaCache(value: unknown): value is SchemaCache {
  if (typeof value !== 'object' || value === null || !('paths' in value)) {
    return false;
  }
  const { paths } = value;
  return typeof paths === 'object' && paths !== null;
}

function loadSchemaCache(): Record<string, Record<string, SchemaOperation>> {
  const raw = readFileSync(SCHEMA_CACHE_PATH, 'utf-8');
  const parsed: unknown = JSON.parse(raw);
  if (!isSchemaCache(parsed)) {
    throw new Error('Schema cache does not contain expected paths structure');
  }
  return parsed.paths;
}

function getParamDescription(
  paths: Record<string, Record<string, SchemaOperation>>,
  apiPath: string,
  paramName: string,
): string | undefined {
  const pathItem = paths[apiPath];
  if (!pathItem) {
    return undefined;
  }
  for (const operation of Object.values(pathItem)) {
    if (!operation.parameters) {
      continue;
    }
    const param = operation.parameters.find((p) => p.name === paramName);
    if (param) {
      return param.description ?? param.schema?.description;
    }
  }
  return undefined;
}

describe('upstream parameter description overrides — removal conditions', () => {
  const paths = loadSchemaCache();

  for (const [key, override] of Object.entries(PARAM_DESCRIPTION_OVERRIDES)) {
    const separatorIndex = key.lastIndexOf(':');
    const apiPath = key.slice(0, separatorIndex);
    const paramName = key.slice(separatorIndex + 1);

    it(`override for ${apiPath} param "${paramName}" is still needed (upstream bug persists)`, () => {
      const cachedDescription = getParamDescription(paths, apiPath, paramName);

      // When this assertion fails, the upstream spec has been fixed.
      // Remove the override entry from PARAM_DESCRIPTION_OVERRIDES and delete
      // or update this test case.
      expect(
        cachedDescription,
        `Upstream description for "${paramName}" on ${apiPath} no longer matches ` +
          `the known-buggy value. The upstream bug appears to be FIXED. ` +
          `Remove the override from param-description-overrides.ts and re-run ` +
          `pnpm sdk-codegen to pick up the corrected upstream descriptions.`,
      ).toBe(override.upstreamBuggyDescription);
    });
  }
});
