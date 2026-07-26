import { describe, expect, it } from 'vitest';
import type { Linter } from 'eslint';
import { createDesignBoundaryRules } from './boundary.js';

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

describe('createDesignBoundaryRules', () => {
  it('keeps design-tokens-core independent from apps, SDKs, tooling, and oak-design-tokens', () => {
    const rules = createDesignBoundaryRules('design-tokens-core');
    const zones = getRestrictedPathZones(rules);
    const patterns = getRestrictedImportPatterns(rules);
    const groups = patterns.flatMap((pattern) => pattern.group);

    expect(zones.some((zone) => zone.from === '../../../apps/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/sdks/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/libs/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../agent-tools/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../oak-design-tokens/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../oak-design-ink/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../oak-design-system/**')).toBe(true);
    expect(groups).toContain('@oaknational/oak-design-tokens');
    expect(groups).toContain('@oaknational/oak-design-ink');
    expect(groups).toContain('@oaknational/oak-design-system');
    expect(groups).toContain('@oaknational/curriculum-sdk');
    expect(groups).toContain('@oaknational/search-cli');
    expect(groups).toContain('@oaknational/logger');
    expect(groups).toContain('@oaknational/posthog-node');

    const inkPattern = patterns.find((pattern) =>
      pattern.group.includes('@oaknational/oak-design-ink'),
    );
    const tokensPattern = patterns.find((pattern) =>
      pattern.group.includes('@oaknational/oak-design-tokens'),
    );
    expect(inkPattern?.message).toContain('@oaknational/oak-design-ink');
    expect(inkPattern?.message).toContain('@oaknational/oak-design-tokens');
    expect(inkPattern?.message).toContain('@oaknational/oak-design-system');
    expect(tokensPattern?.message).toContain('@oaknational/oak-design-ink');
    expect(tokensPattern?.message).toContain('@oaknational/oak-design-tokens');
    expect(tokensPattern?.message).toContain('@oaknational/oak-design-system');
  });

  it('allows oak-design-tokens to depend on design-tokens-core while still blocking apps, SDKs, libs, and tooling', () => {
    const rules = createDesignBoundaryRules('oak-design-tokens');
    const zones = getRestrictedPathZones(rules);
    const groups = getRestrictedImportPatterns(rules).flatMap((pattern) => pattern.group);

    expect(zones.some((zone) => zone.from === '../design-tokens-core/**')).toBe(false);
    expect(zones.some((zone) => zone.from === '../../../apps/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/sdks/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/libs/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../agent-tools/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../oak-design-ink/**')).toBe(true);
    // The absent oak-design-system restriction IS the configured legitimate
    // edge (ADR-041 §2026-07-19 amendment; ADR-213 §4): oak-design-tokens
    // consumes the design system's dtcg export as validator input.
    expect(zones.some((zone) => zone.from === '../oak-design-system/**')).toBe(false);
    expect(groups).not.toContain('@oaknational/design-tokens-core');
    expect(groups).not.toContain('@oaknational/oak-design-system');
    expect(groups).toContain('@oaknational/oak-design-ink');
    expect(groups).toContain('@oaknational/oak-search-sdk');
    expect(groups).toContain('@oaknational/agent-tools');
    expect(groups).toContain('@oaknational/env-resolution');
  });

  it('allows oak-design-ink to consume Oak tokens while blocking apps, SDKs, libs, and tooling', () => {
    const rules = createDesignBoundaryRules('oak-design-ink');
    const zones = getRestrictedPathZones(rules);
    const groups = getRestrictedImportPatterns(rules).flatMap((pattern) => pattern.group);

    expect(zones.some((zone) => zone.from === '../design-tokens-core/**')).toBe(false);
    expect(zones.some((zone) => zone.from === '../oak-design-tokens/**')).toBe(false);
    // Ink reaches design tokens through the projection layer, never the
    // design system directly (ADR-041 §2026-07-19 amendment; ADR-213 §4).
    expect(zones.some((zone) => zone.from === '../oak-design-system/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../apps/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/sdks/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../packages/libs/**')).toBe(true);
    expect(zones.some((zone) => zone.from === '../../../agent-tools/**')).toBe(true);
    expect(groups).not.toContain('@oaknational/design-tokens-core');
    expect(groups).not.toContain('@oaknational/oak-design-tokens');
    expect(groups).toContain('@oaknational/oak-design-system');
    expect(groups).toContain('@oaknational/oak-search-sdk');
    expect(groups).toContain('@oaknational/agent-tools');
    expect(groups).toContain('@oaknational/env-resolution');
  });
});
