import { describe, expect, it } from 'vitest';

import defaultDeployEntryHandler, { deployEntryHandler } from './server.js';

describe('deployEntryHandler', () => {
  it('is function-valued at the source deploy boundary', () => {
    expect(typeof deployEntryHandler).toBe('function');
  });

  it('default-exports the same deploy boundary handler', () => {
    expect(defaultDeployEntryHandler).toBe(deployEntryHandler);
  });
});
