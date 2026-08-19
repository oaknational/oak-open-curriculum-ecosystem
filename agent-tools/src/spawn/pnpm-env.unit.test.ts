import { describe, expect, it } from 'vitest';

import { pnpmSpawnEnvironment } from './pnpm-env.js';

// Every result carries exactly these two set variables: the download prompt
// pinned off (an absent value re-enables a prompt that fails in a non-TTY
// child) and the env file disabled (corepack would otherwise read
// `.corepack.env` from the child's cwd and restore every scrubbed name).
const PINNED = { COREPACK_ENABLE_DOWNLOAD_PROMPT: '0', COREPACK_ENV_FILE: '0' };

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
      expected: { UNRELATED: 'kept', ...PINNED },
    },
    {
      label: 'strips the registry and integrity-key variables — a stronger code-selection knob',
      env: {
        COREPACK_NPM_REGISTRY: 'https://attacker.example',
        COREPACK_INTEGRITY_KEYS: '{"npm":[]}',
        COREPACK_ENABLE_PROJECT_SPEC: '0',
      },
      expected: PINNED,
    },
    {
      label: 'replaces an inherited env-file pointer with the opt-out',
      env: { COREPACK_ENV_FILE: '/tmp/attacker.env' },
      expected: PINNED,
    },
    {
      label: 'sets the pinned variables even when no corepack variable is present',
      env: { PATH: '/usr/bin' },
      expected: { PATH: '/usr/bin', ...PINNED },
    },
    {
      label: 'passes unrelated keys through unchanged, including a near-miss prefix',
      env: { HOME: '/Users/<user>', PNPM_HOME: '/pnpm-home', NOT_COREPACK_X: 'kept' },
      expected: {
        HOME: '/Users/<user>',
        PNPM_HOME: '/pnpm-home',
        NOT_COREPACK_X: 'kept',
        ...PINNED,
      },
    },
    // POSIX environment names are case-sensitive: a lower-case `corepack_root`
    // is a variable corepack never reads, so it is an unrelated key and passes
    // through — scrubbing it would break the pass-through contract.
    {
      label: 'passes differently-cased corepack names through on posix (case-sensitive names)',
      env: { corepack_root: '/attacker', Corepack_Home: '/attacker-home' },
      expected: { corepack_root: '/attacker', Corepack_Home: '/attacker-home', ...PINNED },
    },
  ])('$label (linux)', ({ env, expected }) => {
    expect(pnpmSpawnEnvironment(env, 'linux')).toEqual(expected);
  });

  // Windows environment names are case-insensitive: the child reads
  // `corepack_root` as `COREPACK_ROOT`, so every case variant of the prefix
  // must go, or a mixed-case inherited value redirects which package-manager
  // build runs despite the scrub.
  it.each([
    {
      label: 'strips lower-case corepack variables',
      env: { corepack_root: 'D:/attacker', corepack_home: 'D:/attacker-home', KEEP: '1' },
      expected: { KEEP: '1', ...PINNED },
    },
    {
      label: 'strips mixed-case corepack variables',
      env: {
        Corepack_Root: 'D:/attacker',
        Corepack_Npm_Registry: 'https://attacker.example',
        Corepack_Enable_Auto_Pin: '1',
      },
      expected: PINNED,
    },
    {
      label: 'replaces differently-cased pinned names with the canonical ones',
      env: { corepack_enable_download_prompt: '1', Corepack_Env_File: 'D:/attacker.env' },
      expected: PINNED,
    },
    {
      label: 'strips every case variant when several coexist',
      env: { COREPACK_ROOT: 'C:/a', corepack_root: 'C:/b', CorePack_Root: 'C:/c' },
      expected: PINNED,
    },
    {
      label: 'passes unrelated keys through unchanged, including a near-miss prefix',
      env: { Path: 'C:/Windows', PNPM_HOME: 'C:/pnpm-home', not_corepack_x: 'kept' },
      expected: {
        Path: 'C:/Windows',
        PNPM_HOME: 'C:/pnpm-home',
        not_corepack_x: 'kept',
        ...PINNED,
      },
    },
  ])('$label (win32)', ({ env, expected }) => {
    expect(pnpmSpawnEnvironment(env, 'win32')).toEqual(expected);
  });

  it('does not mutate the caller-supplied environment object', () => {
    const env = { COREPACK_ROOT: '/corepack-root' };

    pnpmSpawnEnvironment(env, 'linux');

    expect(env).toEqual({ COREPACK_ROOT: '/corepack-root' });
  });
});
