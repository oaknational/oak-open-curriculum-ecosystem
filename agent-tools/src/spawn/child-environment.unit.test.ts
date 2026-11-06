import { describe, expect, it } from 'vitest';

import { childEnvironment } from './child-environment.js';

/**
 * The environment an inherited-stdio child is spawned with: the ambient
 * environment with the caller's extra variables over it, or inheritance when
 * the caller adds none.
 */

const AMBIENT = { PATH: '/usr/bin', GATE_MARKER: 'ambient' };

describe('childEnvironment', () => {
  it('gives the child the ambient environment with its extra variables over it', () => {
    expect(childEnvironment({ ambient: AMBIENT, extra: { GATE_MARKER: '23918' } })).toStrictEqual({
      PATH: '/usr/bin',
      GATE_MARKER: '23918',
    });
  });

  it('leaves a child with no extra variables to inherit', () => {
    expect(childEnvironment({ ambient: AMBIENT, extra: undefined })).toBeUndefined();
  });
});
