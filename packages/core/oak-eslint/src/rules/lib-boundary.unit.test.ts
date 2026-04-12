import { describe, expect, it } from 'vitest';
import type { Linter } from 'eslint';
import { minimatch } from 'minimatch';
import {
  ADAPTER_LIB_PACKAGES,
  FOUNDATION_LIB_PACKAGES,
  LIB_PACKAGES,
  createLibBoundaryRules,
} from './boundary.js';

function getRestrictedPathZones(
  rules: Partial<Linter.RulesRecord>,
): readonly { readonly from: string; readonly message: string }[] {
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
): readonly { readonly group: readonly string[]; readonly message?: string }[] {
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

function getRestrictedImportPaths(
  rules: Partial<Linter.RulesRecord>,
): readonly { readonly name: string; readonly message?: string }[] {
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
    !('paths' in options) ||
    !Array.isArray(options.paths)
  ) {
    throw new Error(`Expected options to have a 'paths' array, got: ${JSON.stringify(options)}`);
  }

  return options.paths;
}

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

function getMatchingPatternGroups(
  patterns: readonly { readonly group: readonly string[] }[],
  specifier: string,
): string[] {
  return patterns.flatMap((pattern) =>
    pattern.group.filter((group) => minimatch(specifier, group, { dot: true })),
  );
}

describe('createLibBoundaryRules', () => {
  it('keeps observability out of the library inventory', () => {
    expect(LIB_PACKAGES).toEqual([
      'env-resolution',
      'logger',
      'search-contracts',
      'sentry-node',
      'sentry-mcp',
    ]);
    expect(FOUNDATION_LIB_PACKAGES).toEqual(['env-resolution', 'logger', 'search-contracts']);
    expect(ADAPTER_LIB_PACKAGES).toEqual(['sentry-node', 'sentry-mcp']);
  });

  it('blocks foundation libraries from importing any other library', () => {
    const zones = getRestrictedPathZones(createLibBoundaryRules('logger'));
    const blockedLibs = zones
      .filter((zone) => zone.from.startsWith('../') && !zone.from.startsWith('../../../'))
      .map((zone) => zone.from)
      .sort();

    expect(blockedLibs).toEqual([
      '../env-resolution/**',
      '../search-contracts/**',
      '../sentry-mcp/**',
      '../sentry-node/**',
    ]);
    expect(zones.some((zone) => zone.message.includes('Foundation library'))).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../apps/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../agent-tools/**')).toBe(true);
  });

  it('blocks foundation libraries from importing other library package specifiers', () => {
    const patterns = getRestrictedImportPatterns(createLibBoundaryRules('logger'));
    const blockedLibPrefixes = [
      '@oaknational/env-resolution',
      '@oaknational/search-contracts',
      '@oaknational/sentry-mcp',
      '@oaknational/sentry-node',
    ] as const;
    const blockedImports = patterns
      .flatMap((pattern) => pattern.group)
      .filter((group) => blockedLibPrefixes.some((prefix) => group.startsWith(prefix)))
      .sort();

    expect(blockedImports).toEqual([
      '@oaknational/env-resolution',
      '@oaknational/env-resolution/*',
      '@oaknational/env-resolution/**',
      '@oaknational/search-contracts',
      '@oaknational/search-contracts/*',
      '@oaknational/search-contracts/**',
      '@oaknational/sentry-mcp',
      '@oaknational/sentry-mcp/*',
      '@oaknational/sentry-mcp/**',
      '@oaknational/sentry-node',
      '@oaknational/sentry-node/*',
      '@oaknational/sentry-node/**',
    ]);
    expect(
      patterns.some(
        (pattern) =>
          pattern.group.includes('@oaknational/sentry-node') &&
          pattern.message?.includes('Foundation library'),
      ),
    ).toBe(true);
  });

  it('allows adapter libraries to import foundation libraries but blocks adapter-to-adapter imports', () => {
    const zones = getRestrictedPathZones(createLibBoundaryRules('sentry-node'));
    const blockedLibs = zones
      .filter((zone) => zone.from.startsWith('../') && !zone.from.startsWith('../../../'))
      .map((zone) => zone.from);

    expect(blockedLibs).toEqual(['../sentry-mcp/**']);
    expect(
      zones.some(
        (zone) => zone.from === '../sentry-mcp/**' && zone.message.includes('Adapter library'),
      ),
    ).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../apps/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../agent-tools/**')).toBe(true);
  });

  it('allows adapter libraries to import foundation package specifiers but blocks adapter package specifiers', () => {
    const patterns = getRestrictedImportPatterns(createLibBoundaryRules('sentry-node'));
    const blockedImports = patterns
      .flatMap((pattern) => pattern.group)
      .filter((group) => group.startsWith('@oaknational/sentry-mcp'))
      .sort();

    expect(blockedImports).toEqual([
      '@oaknational/sentry-mcp',
      '@oaknational/sentry-mcp/*',
      '@oaknational/sentry-mcp/**',
    ]);
    expect(
      patterns.some(
        (pattern) =>
          pattern.group.includes('@oaknational/sentry-mcp') &&
          pattern.message?.includes('Adapter library'),
      ),
    ).toBe(true);
  });

  it('blocks libraries from importing SDK package specifiers', () => {
    const patterns = getRestrictedImportPatterns(createLibBoundaryRules('logger'));
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@oaknational/curriculum-sdk');
    expect(groups).toContain('@oaknational/sdk-codegen/**');
    expect(groups).toContain('@oaknational/oak-search-sdk/*');
  });

  it('allows search-contracts to consume approved sdk-codegen subpath exports only', () => {
    const rules = createLibBoundaryRules('search-contracts');
    const patterns = getRestrictedImportPatterns(rules);
    const paths = getRestrictedImportPaths(rules);
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@oaknational/sdk-codegen/*/*');
    expect(groups).toContain('@oaknational/sdk-codegen/*/*/**');
    expect(getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search')).toHaveLength(0);
    expect(getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/vocab-data')).toHaveLength(
      0,
    );
    expect(
      getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search/internal'),
    ).not.toHaveLength(0);
    expect(
      getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search/internal/types'),
    ).not.toHaveLength(0);
    expect(groups).toContain('@oaknational/curriculum-sdk');
    expect(groups).toContain('@oaknational/oak-search-sdk');
    expect(paths.some((path) => path.name === '@oaknational/sdk-codegen')).toBe(true);
  });

  it('blocks libraries from importing app package specifiers', () => {
    const patterns = getRestrictedImportPatterns(createLibBoundaryRules('logger'));
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@oaknational/oak-curriculum-mcp-streamable-http');
    expect(groups).toContain('@oaknational/search-cli/*');
  });

  it('blocks libraries from importing tooling package specifiers', () => {
    const patterns = getRestrictedImportPatterns(createLibBoundaryRules('logger'));
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@oaknational/agent-tools');
    expect(groups).toContain('@oaknational/agent-tools/**');
  });

  it('still blocks @workspace/* imports for libraries', () => {
    const rules = createLibBoundaryRules('search-contracts');
    const patterns = getRestrictedImportPatterns(rules);
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(groups).toContain('@workspace/*');
    expect(groups).toContain('@workspace/**');
    expect(getRuleSeverity(rules, 'import-x/no-relative-packages')).toBe('error');
  });

  it('fails fast when called with an unknown library name', () => {
    expect(() => {
      // @ts-expect-error - intentionally exercise the runtime guard
      createLibBoundaryRules('observability');
    }).toThrow("Unknown library package 'observability'");
  });
});
