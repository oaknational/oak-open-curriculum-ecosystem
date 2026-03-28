import { describe, it, expect } from 'vitest';
import { coreBoundaryRules, coreTestConfigRules } from './boundary.js';

function getRuleSeverity(
  rules: typeof coreBoundaryRules,
  ruleName: keyof typeof coreBoundaryRules,
): string {
  const rule = rules[ruleName];
  if (typeof rule === 'string') {
    return rule;
  }
  if (Array.isArray(rule)) {
    return String(rule[0]);
  }
  throw new Error(`Expected '${String(ruleName)}' to be configured`);
}

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

  it('blocks imports from tooling workspaces', () => {
    const zones = getRestrictedPathZones(coreBoundaryRules);
    const toolingZone = zones.find((z) => z.from.includes('agent-tools'));
    expect(toolingZone).toBeDefined();
  });

  it('blocks relative imports that cross package boundaries', () => {
    expect(getRuleSeverity(coreBoundaryRules, 'import-x/no-relative-packages')).toBe('error');
  });

  it('restricts @workspace/* alias imports', () => {
    const patterns = getRestrictedImportPatterns(coreBoundaryRules);
    const groups = patterns.flatMap((p) => p.group);
    expect(groups).toContain('@workspace/*');
    expect(groups).toContain('@workspace/**');
  });

  it('blocks @oaknational package specifiers for libraries, SDKs, apps, and tooling', () => {
    const patterns = getRestrictedImportPatterns(coreBoundaryRules);
    const groups = patterns.flatMap((p) => p.group);

    expect(groups).toContain('@oaknational/logger');
    expect(groups).toContain('@oaknational/curriculum-sdk');
    expect(groups).toContain('@oaknational/oak-curriculum-mcp-streamable-http');
    expect(groups).toContain('@oaknational/agent-tools');
  });
});

describe('coreTestConfigRules', () => {
  it('relaxes dev-dependency and internal-module rules only', () => {
    expect(coreTestConfigRules['import-x/no-extraneous-dependencies']).toBe('off');
    expect(coreTestConfigRules['import-x/no-internal-modules']).toBe('off');
    expect(coreTestConfigRules['import-x/no-restricted-paths']).toBeUndefined();
    expect(coreTestConfigRules['@typescript-eslint/no-restricted-imports']).toBeUndefined();
  });
});
