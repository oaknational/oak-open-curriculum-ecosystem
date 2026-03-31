import { describe, it, expect } from 'vitest';
import type { Linter } from 'eslint';
import { minimatch } from 'minimatch';
import { createSdkBoundaryRules } from './boundary.js';

/**
 * Extracts the restricted import patterns from a rules record's
 * `@typescript-eslint/no-restricted-imports` declaration.
 *
 * Fails fast with a descriptive error if the rule structure is
 * unexpected, rather than silently returning empty results.
 */
function getRestrictedImportPatterns(
  rules: Partial<Linter.RulesRecord>,
): readonly { readonly group: readonly string[]; readonly message: string }[] {
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
): readonly { readonly name: string }[] {
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

describe('createSdkBoundaryRules', () => {
  describe('generation role', () => {
    it('restricts imports from runtime SDK package at all depths', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);

      const groups = patterns.flatMap((p) => p.group);
      expect(groups).toContain('@oaknational/curriculum-sdk');
      expect(groups).toContain('@oaknational/curriculum-sdk/**');
    });

    it('does not restrict imports from the generation package itself', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).not.toContain('@oaknational/sdk-codegen');
      expect(groups).not.toContain('@oaknational/sdk-codegen/**');
    });

    it('restricts @workspace/* alias imports', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@workspace/*');
      expect(groups).toContain('@workspace/**');
      expect(getRuleSeverity(rules, 'import-x/no-relative-packages')).toBe('error');
    });

    it('blocks app package specifier imports', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/search-cli');
    });

    it('blocks tooling package specifier imports', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/agent-tools');
    });

    it('blocks oak-search-sdk package specifier imports', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/oak-search-sdk');
    });

    it('blocks imports from apps and runtime workspace via no-restricted-paths', () => {
      const rules = createSdkBoundaryRules('generation');
      const zones = getRestrictedPathZones(rules);

      expect(zones.some((z) => z.from === '../../../apps/**')).toBe(true);
      expect(zones.some((z) => z.from === '../oak-curriculum-sdk/**')).toBe(true);
      expect(zones.some((z) => z.from === '../oak-search-sdk/**')).toBe(true);
      expect(zones.some((z) => z.from === '../../../agent-tools/**')).toBe(true);
    });

    it('uses error severity for enforcement', () => {
      const rules = createSdkBoundaryRules('generation');
      const rule = rules['@typescript-eslint/no-restricted-imports'];

      if (!Array.isArray(rule)) {
        throw new Error(`Expected rule to be an array, got: ${JSON.stringify(rule)}`);
      }
      expect(rule[0]).toBe('error');
    });

    it('provides messages referencing ADR-108', () => {
      const rules = createSdkBoundaryRules('generation');
      const patterns = getRestrictedImportPatterns(rules);
      const sdkPattern = patterns.find((p) => p.group.includes('@oaknational/curriculum-sdk'));

      if (!sdkPattern) {
        throw new Error('Expected to find a pattern restricting @oaknational/curriculum-sdk');
      }
      expect(sdkPattern.message).toContain('ADR-108');
    });
  });

  describe('runtime role', () => {
    it('restricts deep imports into generation internals (two or more levels)', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);

      const groups = patterns.flatMap((p) => p.group);
      expect(groups).toContain('@oaknational/sdk-codegen/*/*');
      expect(groups).toContain('@oaknational/sdk-codegen/*/*/**');
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/mcp-tools/runtime'),
      ).not.toHaveLength(0);
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/mcp-tools/runtime/execute'),
      ).not.toHaveLength(0);
    });

    it('allows public sdk-codegen package surfaces', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);

      expect(getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen')).toHaveLength(0);
      expect(getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/mcp-tools')).toHaveLength(
        0,
      );
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/api-schema'),
      ).toHaveLength(0);
    });

    it('does not restrict its own runtime SDK package', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).not.toContain('@oaknational/curriculum-sdk');
      expect(groups).not.toContain('@oaknational/curriculum-sdk/**');
    });

    it('restricts @workspace/* alias imports', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@workspace/*');
      expect(groups).toContain('@workspace/**');
      expect(getRuleSeverity(rules, 'import-x/no-relative-packages')).toBe('error');
    });

    it('blocks app package specifier imports', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/oak-curriculum-mcp-streamable-http');
    });

    it('blocks tooling package specifier imports', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/agent-tools');
    });

    it('blocks oak-search-sdk package specifier imports', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/oak-search-sdk');
    });

    it('blocks imports from apps and other forbidden relative workspace paths without banning sdk-codegen surfaces', () => {
      const rules = createSdkBoundaryRules('runtime');
      const zones = getRestrictedPathZones(rules);

      expect(zones.some((z) => z.from === '../../../apps/**')).toBe(true);
      expect(zones.some((z) => z.from === '../oak-sdk-codegen/**')).toBe(false);
      expect(zones.some((z) => z.from === '../oak-search-sdk/**')).toBe(true);
      expect(zones.some((z) => z.from === '../../../agent-tools/**')).toBe(true);
    });

    it('uses error severity for enforcement', () => {
      const rules = createSdkBoundaryRules('runtime');
      const rule = rules['@typescript-eslint/no-restricted-imports'];

      if (!Array.isArray(rule)) {
        throw new Error(`Expected rule to be an array, got: ${JSON.stringify(rule)}`);
      }
      expect(rule[0]).toBe('error');
    });

    it('provides messages referencing ADR-108', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const genPattern = patterns.find((p) => p.group.includes('@oaknational/sdk-codegen/*/*'));

      if (!genPattern) {
        throw new Error('Expected to find a pattern restricting @oaknational/sdk-codegen/*/*');
      }
      expect(genPattern.message).toContain('ADR-108');
    });
  });

  describe('search role', () => {
    it('blocks curriculum-sdk base import via paths (not patterns)', () => {
      const rules = createSdkBoundaryRules('search');
      const paths = getRestrictedImportPaths(rules);
      expect(paths.some((p) => p.name === '@oaknational/curriculum-sdk')).toBe(true);
    });

    it('blocks all curriculum-sdk subpath imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/curriculum-sdk/**');
    });

    it('blocks deep sdk-codegen imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/sdk-codegen/*/*');
      expect(groups).toContain('@oaknational/sdk-codegen/*/*/**');
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search/internal'),
      ).not.toHaveLength(0);
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search/internal/types'),
      ).not.toHaveLength(0);
    });

    it('allows approved single-level sdk-codegen surfaces', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);

      expect(getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/search')).toHaveLength(0);
      expect(
        getMatchingPatternGroups(patterns, '@oaknational/sdk-codegen/observability'),
      ).toHaveLength(0);
    });

    it('blocks @workspace/* alias imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@workspace/*');
      expect(groups).toContain('@workspace/**');
      expect(getRuleSeverity(rules, 'import-x/no-relative-packages')).toBe('error');
    });

    it('blocks app package specifier imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/oak-curriculum-mcp-stdio');
    });

    it('blocks tooling package specifier imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@oaknational/agent-tools');
    });

    it('blocks imports from apps and curriculum-sdk relative paths without banning sdk-codegen surfaces', () => {
      const rules = createSdkBoundaryRules('search');
      const zones = getRestrictedPathZones(rules);

      expect(zones.some((z) => z.from === '../../../apps/**')).toBe(true);
      expect(zones.some((z) => z.from === '../oak-curriculum-sdk/**')).toBe(true);
      expect(zones.some((z) => z.from === '../oak-sdk-codegen/**')).toBe(false);
      expect(zones.some((z) => z.from === '../../../agent-tools/**')).toBe(true);
    });

    it('provides messages referencing ADR-108', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const sdkPattern = patterns.find((p) => p.group.includes('@oaknational/sdk-codegen/*/*'));

      if (!sdkPattern) {
        throw new Error('Expected to find a pattern restricting @oaknational/sdk-codegen/*/*');
      }
      expect(sdkPattern.message).toContain('ADR-108');
    });
  });
});
