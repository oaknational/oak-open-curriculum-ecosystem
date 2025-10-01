import { describe, expect, it } from 'vitest';
import type { OpenAPI3 } from 'openapi-typescript';

import { generateAdminStreamFixtureModules } from './generate-admin-fixtures.js';

const MINIMAL_SCHEMA: OpenAPI3 = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {},
};

describe('admin stream fixture module generation', () => {
  it('emits builder and index modules with validation helpers', () => {
    const files = generateAdminStreamFixtureModules(MINIMAL_SCHEMA);
    expect(Object.keys(files).sort()).toEqual(
      ['../admin/index.ts', '../admin/stream-fixtures.ts'].sort(),
    );

    const fixtures = files['../admin/stream-fixtures.ts'];
    expect(fixtures).toContain('ADMIN_STREAM_ACTIONS');
    expect(fixtures).toContain('createAdminStreamFixture');
    expect(fixtures).toContain('createAdminStreamErrorFixture');

    const index = files['../admin/index.ts'];
    expect(index).toContain('AdminStreamActionSchema');
    expect(index).toContain('AdminStreamFixtureMap');
  });
});
