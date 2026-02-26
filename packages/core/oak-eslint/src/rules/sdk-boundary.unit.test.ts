import { describe, it, expect } from 'vitest';
import type { Linter } from 'eslint';
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
): readonly { readonly from: string }[] {
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
      expect(groups).toContain('@oaknational/sdk-codegen/*/**');
    });

    it('allows single-level subpath exports from generation', () => {
      const rules = createSdkBoundaryRules('runtime');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).not.toContain('@oaknational/sdk-codegen');
      expect(groups).not.toContain('@oaknational/sdk-codegen/**');
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
      const genPattern = patterns.find((p) => p.group.includes('@oaknational/sdk-codegen/*/**'));

      if (!genPattern) {
        throw new Error('Expected to find a pattern restricting @oaknational/sdk-codegen/*/**');
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

      expect(groups).toContain('@oaknational/sdk-codegen/*/**');
    });

    it('blocks @workspace/* alias imports', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const groups = patterns.flatMap((p) => p.group);

      expect(groups).toContain('@workspace/*');
    });

    it('blocks imports from apps via import-x/no-restricted-paths', () => {
      const rules = createSdkBoundaryRules('search');
      const zones = getRestrictedPathZones(rules);
      expect(zones.some((z) => z.from.includes('apps'))).toBe(true);
    });

    it('provides messages referencing ADR-108', () => {
      const rules = createSdkBoundaryRules('search');
      const patterns = getRestrictedImportPatterns(rules);
      const sdkPattern = patterns.find((p) => p.group.includes('@oaknational/sdk-codegen/*/**'));

      if (!sdkPattern) {
        throw new Error('Expected to find a pattern restricting @oaknational/sdk-codegen/*/**');
      }
      expect(sdkPattern.message).toContain('ADR-108');
    });
  });
});
