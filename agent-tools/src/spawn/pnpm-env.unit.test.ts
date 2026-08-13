import { describe, expect, it } from 'vitest';

import { pnpmSpawnEnvironment } from './pnpm-env.js';

describe('pnpmSpawnEnvironment', () => {
  it.each([
    {
      label: 'strips the corepack selection variables and pins the download prompt off',
      env: {
        COREPACK_ROOT: '/corepack-root',
        COREPACK_HOME: '/corepack-home',
        COREPACK_ENABLE_AUTO_PIN: '1',
        COREPACK_ENABLE_DOWNLOAD_PROMPT: '1',
        UNRELATED: 'kept',
      },
      expected: { UNRELATED: 'kept', COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' },
    },
    {
      label: 'sets the download prompt off even when no corepack variable is present',
      env: { PATH: '/usr/bin' },
      expected: { PATH: '/usr/bin', COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' },
    },
    {
      label: 'passes unrelated keys through unchanged',
      env: { HOME: '/Users/<user>', PNPM_HOME: '/pnpm-home' },
      expected: {
        HOME: '/Users/<user>',
        PNPM_HOME: '/pnpm-home',
        COREPACK_ENABLE_DOWNLOAD_PROMPT: '0',
      },
    },
  ])('$label', ({ env, expected }) => {
    expect(pnpmSpawnEnvironment(env)).toEqual(expected);
  });

  it('does not mutate the caller-supplied environment object', () => {
    const env = { COREPACK_ROOT: '/corepack-root' };

    pnpmSpawnEnvironment(env);

    expect(env).toEqual({ COREPACK_ROOT: '/corepack-root' });
  });
});
