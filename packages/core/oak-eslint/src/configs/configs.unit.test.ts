import { describe, it, expect } from 'vitest';
import { recommended } from './recommended.js';
import { strict } from './strict.js';
import { react } from './react.js';
import { next } from './next.js';

import type { Linter } from 'eslint';

/**
 * Extracts the restricted type names from a flat config array's
 * `@typescript-eslint/no-restricted-types` rule declaration.
 *
 * Walks all config entries (last-writer-wins in flat config)
 * and returns the type names from the final declaration.
 */
function hasTypesProperty(value: unknown): value is { readonly types: object } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'types' in value &&
    typeof value.types === 'object' &&
    value.types !== null
  );
}

function getRestrictedTypeNames(configs: Linter.Config[]): string[] {
  let lastTypes: object | undefined;
  for (const config of configs) {
    const rule = config.rules?.['@typescript-eslint/no-restricted-types'];
    if (Array.isArray(rule) && rule.length >= 2) {
      const options: unknown = rule[1];
      if (hasTypesProperty(options)) {
        lastTypes = options.types;
      }
    }
  }
  if (!lastTypes) {
    return [];
  }
  const names: string[] = [];
  for (const key in lastTypes) {
    names.push(key);
  }
  return names.sort();
}

describe('ESLint Configs', () => {
  it('should export recommended config', () => {
    expect(recommended).toBeDefined();
    expect(Array.isArray(recommended)).toBe(true);
    expect(recommended.length).toBeGreaterThan(0);
  });

  it('should export strict config', () => {
    expect(strict).toBeDefined();
    expect(Array.isArray(strict)).toBe(true);
    expect(strict.length).toBeGreaterThan(0);
  });

  it('should export react config', () => {
    expect(react).toBeDefined();
    expect(Array.isArray(react)).toBe(true);
    expect(react.length).toBeGreaterThan(0);
  });

  it('should export next config', () => {
    expect(next).toBeDefined();
    expect(Array.isArray(next)).toBe(true);
    expect(next.length).toBeGreaterThan(0);
  });
});

describe('strict restricted types superset of recommended', () => {
  it('strict includes every type restricted in recommended', () => {
    const recommendedTypes = getRestrictedTypeNames(recommended);
    const strictTypes = getRestrictedTypeNames(strict);

    expect(recommendedTypes.length).toBeGreaterThan(0);
    expect(strictTypes.length).toBeGreaterThanOrEqual(recommendedTypes.length);

    for (const typeName of recommendedTypes) {
      expect(strictTypes).toContain(typeName);
    }
  });
});
