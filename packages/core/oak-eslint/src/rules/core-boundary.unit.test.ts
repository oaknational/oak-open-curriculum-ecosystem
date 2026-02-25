import { describe, it, expect } from 'vitest';
import { coreBoundaryRules } from './boundary.js';

/**
 * Extracts the zones from the `import-x/no-restricted-paths` rule declaration.
 */
function getRestrictedPathZones(
  rules: typeof coreBoundaryRules,
): readonly { readonly target: string; readonly from: string; readonly message: string }[] {
  const rule = rules['import-x/no-restricted-paths'];
  if (!Array.isArray(rule) || rule.length < 2) {
    throw new Error(
      `Expected 'import-x/no-restricted-paths' to be [severity, options], got: ${JSON.stringify(rule)}`,
    );
  }
  const options: unknown = rule[1];
  if (
    typeof options !== 'object' ||
    options === null ||
    !('zones' in options) ||
    !Array.isArray(options.zones)
  ) {
    throw new Error(`Expected options to have a 'zones' array, got: ${JSON.stringify(options)}`);
  }
  return options.zones;
}

function getRestrictedImportPatterns(
  rules: typeof coreBoundaryRules,
): readonly { readonly group: readonly string[] }[] {
  const rule = rules['@typescript-eslint/no-restricted-imports'];
  if (!Array.isArray(rule) || rule.length < 2) {
    throw new Error(`Expected '@typescript-eslint/no-restricted-imports' to be tuple`);
  }
  const options: unknown = rule[1];
  if (
    typeof options !== 'object' ||
    options === null ||
    !('patterns' in options) ||
    !Array.isArray(options.patterns)
  ) {
    throw new Error(`Expected options to have a 'patterns' array, got: ${JSON.stringify(options)}`);
  }
  return options.patterns;
}

describe('coreBoundaryRules', () => {
  it('blocks imports from libraries', () => {
    const zones = getRestrictedPathZones(coreBoundaryRules);
    const libZone = zones.find((z) => z.from.includes('packages/libs'));
    expect(libZone).toBeDefined();
  });

  it('blocks imports from apps', () => {
    const zones = getRestrictedPathZones(coreBoundaryRules);
    const appZone = zones.find((z) => z.from.includes('apps'));
    expect(appZone).toBeDefined();
  });

  it('blocks imports from SDKs (F21)', () => {
    const zones = getRestrictedPathZones(coreBoundaryRules);
    const sdkZone = zones.find((z) => z.from.includes('packages/sdks'));
    expect(sdkZone).toBeDefined();
    expect(sdkZone?.message).toContain('Core cannot import from SDKs');
  });

  it('restricts @workspace/* alias imports', () => {
    const patterns = getRestrictedImportPatterns(coreBoundaryRules);
    const groups = patterns.flatMap((p) => p.group);
    expect(groups).toContain('@workspace/*');
  });
});
