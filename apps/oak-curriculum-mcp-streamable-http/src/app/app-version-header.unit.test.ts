import { describe, expect, it } from 'vitest';

import { createAppVersionHeaders } from './app-version-header.js';

describe('createAppVersionHeaders', () => {
  it('returns the x-app-version response header', () => {
    const headers = createAppVersionHeaders('0.0.0-test');

    expect(headers).toEqual({
      'x-app-version': '0.0.0-test',
    });
  });
});
