import { describe, expect, it } from 'vitest';

import { childEnvironment } from './child-environment.js';

/**
 * The environment an inherited-stdio child is spawned with. A pnpm child gets
 * the corepack scrub; extra variables join before the scrub, so they reach
 * the child and can never bring a corepack variable back.
 */

const AMBIENT = { PATH: '/usr/bin', COREPACK_ROOT: '/ambient/corepack' };

describe('childEnvironment', () => {
  it('gives a pnpm child its extra variables, scrubbed like the rest', () => {
    const environment = childEnvironment({
      pnpm: true,
      ambient: AMBIENT,
      extra: { GATE_MARKER: '23918', COREPACK_HOME: '/extra/corepack' },
      platform: 'darwin',
    });

    expect(environment).toMatchObject({ PATH: '/usr/bin', GATE_MARKER: '23918' });
    expect(environment).not.toHaveProperty('COREPACK_ROOT');
    expect(environment).not.toHaveProperty('COREPACK_HOME');
  });

  it('gives any other child the ambient environment with its extra variables', () => {
    expect(
      childEnvironment({
        pnpm: false,
        ambient: AMBIENT,
        extra: { GATE_MARKER: '23918' },
        platform: 'darwin',
      }),
    ).toStrictEqual({ ...AMBIENT, GATE_MARKER: '23918' });
  });

  it('scrubs a pnpm child with no extra variables', () => {
    expect(
      childEnvironment({ pnpm: true, ambient: AMBIENT, extra: undefined, platform: 'darwin' }),
    ).not.toHaveProperty('COREPACK_ROOT');
  });

  it('leaves any other child with no extra variables to inherit', () => {
    expect(
      childEnvironment({ pnpm: false, ambient: AMBIENT, extra: undefined, platform: 'darwin' }),
    ).toBeUndefined();
  });
});
