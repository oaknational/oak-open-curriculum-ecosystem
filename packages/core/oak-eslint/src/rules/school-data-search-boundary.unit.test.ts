import { describe, expect, it } from 'vitest';
import type { Linter } from 'eslint';
import { createSchoolDataSearchBoundaryRules } from './boundary.js';

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

describe('createSchoolDataSearchBoundaryRules', () => {
  it('keeps contracts DB-free and independent from runtime school packages', () => {
    const rules = createSchoolDataSearchBoundaryRules('contracts');
    const patterns = getRestrictedImportPatterns(rules).flatMap((pattern) => pattern.group);
    const zones = getRestrictedPathZones(rules).map((zone) => zone.from);

    expect(patterns).toContain('@oaknational/school-data-search-sdk');
    expect(patterns).toContain('@oaknational/school-data-search-client/**');
    expect(patterns).toContain('drizzle-orm');
    expect(zones).toContain('../sdk/**');
    expect(zones).toContain('../../apps/**');
  });

  it('allows api to compose internal packages while blocking the unpublished api package edge', () => {
    const rules = createSchoolDataSearchBoundaryRules('api');
    const patterns = getRestrictedImportPatterns(rules).flatMap((pattern) => pattern.group);

    expect(patterns).not.toContain('@oaknational/school-data-search-contracts');
    expect(patterns).not.toContain('@oaknational/school-data-search-sdk');
    expect(patterns).not.toContain('@oaknational/school-data-search-client');
    expect(patterns).toContain('@oaknational/school-data-search-api');
  });

  it('blocks imports from existing app/sdk/tooling tiers for school packages', () => {
    const rules = createSchoolDataSearchBoundaryRules('sdk');
    const patterns = getRestrictedImportPatterns(rules).flatMap((pattern) => pattern.group);

    expect(patterns).toContain('@oaknational/oak-search-sdk');
    expect(patterns).toContain('@oaknational/search-cli/**');
    expect(patterns).toContain('@oaknational/agent-tools');
    expect(patterns).toContain('@workspace/**');
  });
});
