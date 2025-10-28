/**
 * Ensures the generated search index uses `.js` specifiers for ESM compatibility.
 */
import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateSearchIndexModule } from './generate-search-index.js';

const MINIMAL_SCHEMA: OpenAPIObject = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {},
};

describe('generateSearchIndexModule', () => {
  it('emits .js specifiers for every relative export', () => {
    const files = generateSearchIndexModule(MINIMAL_SCHEMA);
    const content = files['../search/index.ts'];

    expect(content).toBeDefined();

    const specifiers = Array.from(content.matchAll(/from '(\.[^']+)'/g), (match) => match[1]);
    expect(specifiers.length).toBeGreaterThan(0);

    specifiers.forEach((specifier) => {
      expect(specifier.endsWith('.js')).toBe(true);
    });

    expect(content).toContain('SearchLessonsIndexDocSchema');
    expect(content).toContain('SearchUnitRollupDocSchema');
    expect(content).toContain('SearchCompletionSuggestPayloadSchema');
  });
});
