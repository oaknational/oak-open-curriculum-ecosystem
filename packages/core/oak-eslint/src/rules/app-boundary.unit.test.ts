import { describe, expect, it } from 'vitest';
import type { Linter } from 'eslint';
import { appArchitectureRules, appBoundaryRules } from './boundary.js';

function getRuleSeverity(
  rules: Partial<Linter.RulesRecord>,
  ruleName: keyof Linter.RulesRecord,
): string {
  const rule = rules[ruleName];

  if (typeof rule === 'string') {
    return rule;
  }

  if (Array.isArray(rule)) {
    return String(rule[0]);
  }

  throw new Error(`Expected '${ruleName}' to be configured, got: ${JSON.stringify(rule)}`);
}

function getRestrictedPathZones(
  rules: Partial<Linter.RulesRecord>,
): readonly { readonly from: string; readonly message?: string }[] {
  const rule = rules['import-x/no-restricted-paths'];

  if (!Array.isArray(rule) || rule.length < 2) {
    throw new Error(
      `Expected 'import-x/no-restricted-paths' to be a [severity, options] tuple, got: ${JSON.stringify(rule)}`,
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
  rules: Partial<Linter.RulesRecord>,
): readonly { readonly group: readonly string[] }[] {
  const rule = rules['@typescript-eslint/no-restricted-imports'];

  if (!Array.isArray(rule) || rule.length < 2) {
    throw new Error(
      `Expected '@typescript-eslint/no-restricted-imports' to be a [severity, options] tuple, got: ${JSON.stringify(rule)}`,
    );
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

describe('appBoundaryRules', () => {
  it('blocks relative imports that cross package boundaries', () => {
    expect(getRuleSeverity(appBoundaryRules, 'import-x/no-relative-packages')).toBe('error');
  });

  it('blocks app package specifier imports and workspace aliases', () => {
    const patterns = getRestrictedImportPatterns(appBoundaryRules);
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@workspace/*');
    expect(groups).toContain('@workspace/**');
    expect(groups).toContain('@oaknational/search-cli');
    expect(groups).toContain('@oaknational/oak-curriculum-mcp-streamable-http/**');
    expect(groups).toContain('@oaknational/agent-tools');
  });
});

describe('appArchitectureRules', () => {
  it('keeps the cross-app relative-package guard in the final app ruleset', () => {
    expect(getRuleSeverity(appArchitectureRules, 'import-x/no-relative-packages')).toBe('error');
  });

  it('keeps the internal app no-restricted-paths guard in the final app ruleset', () => {
    const zones = getRestrictedPathZones(appArchitectureRules);

    expect(zones.some((zone) => zone.from === 'src/tools/**')).toBe(true);
    expect(zones.some((zone) => zone.from === 'src/integrations/**')).toBe(true);
  });

  it('blocks app package specifier imports, workspace aliases, and private module imports', () => {
    const patterns = getRestrictedImportPatterns(appArchitectureRules);
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@workspace/*');
    expect(groups).toContain('@workspace/**');
    expect(groups).toContain('@oaknational/search-cli');
    expect(groups).toContain('@oaknational/oak-curriculum-mcp-streamable-http/**');
    expect(groups).toContain('@oaknational/agent-tools');
    expect(groups).toContain('**/internal/**');
  });
});
