import { describe, expect, it } from 'vitest';

import {
  shellcheckInstallerEnv,
  shellcheckProvisionSkip,
  shellcheckProvisionWarning,
} from './shellcheck-provision.js';

/**
 * The install-time shellcheck step's pure parts: where the bootstrap leaves
 * the install to another surface, the environment the installer runs under,
 * and what the bootstrap says when the installer did not end in the pin. The
 * installer's own run is the bootstrap's edge, proved by `pnpm install` over a
 * checkout.
 */

describe('shellcheckProvisionSkip', () => {
  it('provisions on a developer checkout, where neither CI nor Vercel is set', () => {
    expect(shellcheckProvisionSkip({})).toBeNull();
    expect(shellcheckProvisionSkip({ CI: '', VERCEL: '' })).toBeNull();
  });

  it('leaves a Vercel build alone, which runs no shell lint', () => {
    expect(shellcheckProvisionSkip({ VERCEL: '1' })).toBe(
      'a Vercel build, which runs no shell lint',
    );
  });

  it('leaves CI to the static-checks step that installs the pin before the gate', () => {
    expect(shellcheckProvisionSkip({ CI: 'true' })).toBe(
      'CI, where the static-checks job installs it before the gate',
    );
  });
});

describe('shellcheckInstallerEnv', () => {
  it('takes the bin directories pnpm puts first off PATH and keeps the rest of the environment', () => {
    const env = {
      LANG: 'C.UTF-8',
      PATH: [
        '/work/repo/node_modules/.bin',
        '/opt/pnpm/global/node_modules/@pnpm/exe/dist/node-gyp-bin',
        '/opt/homebrew/bin',
        '/usr/bin',
        '/bin',
      ].join(':'),
    };
    expect(shellcheckInstallerEnv(env)).toStrictEqual({
      LANG: 'C.UTF-8',
      PATH: '/opt/homebrew/bin:/usr/bin:/bin',
    });
  });

  it('keeps a directory whose name only contains node_modules', () => {
    const env = { PATH: '/opt/node_modules-tools/bin:/work/packages/a/node_modules/.bin:/usr/bin' };
    expect(shellcheckInstallerEnv(env)).toStrictEqual({
      PATH: '/opt/node_modules-tools/bin:/usr/bin',
    });
  });

  it('leaves an environment without PATH as it is', () => {
    expect(shellcheckInstallerEnv({ LANG: 'C.UTF-8' })).toStrictEqual({ LANG: 'C.UTF-8' });
  });
});

describe('shellcheckProvisionWarning', () => {
  it('says nothing when the installer ends in the pin', () => {
    expect(shellcheckProvisionWarning({ error: undefined, signal: null, status: 0 })).toBeNull();
  });

  it.each([
    [{ error: undefined, signal: null, status: 1 }, 'install-shellcheck.sh exited with code 1'],
    [
      { error: undefined, signal: 'SIGTERM' as const, status: null },
      'install-shellcheck.sh was killed by signal SIGTERM',
    ],
    [
      { error: new Error('spawn EACCES'), signal: null, status: null },
      'failed to start install-shellcheck.sh: spawn EACCES',
    ],
  ])(
    'warns, naming the cause and the remedy, when the installer did not end in the pin',
    (outcome, cause) => {
      expect(shellcheckProvisionWarning(outcome)).toBe(
        `[bootstrap-agent-tools] the pinned shellcheck was not installed (${cause}); ` +
          'the install goes on, and the shell lint gate asks for it at the first commit: ' +
          'run .agent/setup/install-shellcheck.sh',
      );
    },
  );
});
