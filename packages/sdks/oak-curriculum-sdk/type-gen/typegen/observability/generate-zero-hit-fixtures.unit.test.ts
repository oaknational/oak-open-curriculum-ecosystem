import { describe, expect, it } from 'vitest';
import type { OpenAPI3 } from 'openapi-typescript';

import { generateZeroHitFixtureModules } from './generate-zero-hit-fixtures.js';

const MINIMAL_SCHEMA: OpenAPI3 = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {},
};

describe('zero-hit fixture module generation', () => {
  it('emits builder and index modules with validation helpers', () => {
    const files = generateZeroHitFixtureModules(MINIMAL_SCHEMA);
    expect(Object.keys(files).sort()).toEqual(
      ['../observability/index.ts', '../observability/zero-hit-fixtures.ts'].sort(),
    );

    const fixtures = files['../observability/zero-hit-fixtures.ts'];
    expect(fixtures).toContain('ZeroHitTelemetrySchema');
    expect(fixtures).toContain('createZeroHitTelemetry');
    expect(fixtures).toContain('summariseZeroHitEvents');

    const index = files['../observability/index.ts'];
    expect(index).toContain('export {\n  ZERO_HIT_SCOPES');
    expect(index).toContain('createZeroHitTelemetry');
    expect(index).toContain('ZeroHitTelemetry');
  });
});
