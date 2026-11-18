import { describe, expect, it } from 'vitest';

import {
  pinnedShellcheckVersion,
  SHELLCHECK_INSTALLER,
  shellcheckVersion,
} from './repo-check-shellcheck-version.js';

/**
 * The shellcheck gate's version verdict: the pin read from the installer's
 * text, and whether the `shellcheck --version` probe shows that version
 * running. The installer file and the probe run are read at the process edge.
 */

const PINNED = '0.11.0';

/** How a message names the probed binary; any label the gate passes. */
const SOURCE = 'the probed shellcheck';

describe('pinnedShellcheckVersion', () => {
  it('reads the version the installer pins', () => {
    const installer = '#!/usr/bin/env bash\nset -eu\n\nSHELLCHECK_VERSION=0.11.0\nSHA=abc\n';
    expect(pinnedShellcheckVersion(installer)).toStrictEqual({ ok: true, value: '0.11.0' });
  });

  it('fails an installer text that pins no version', () => {
    expect(
      pinnedShellcheckVersion('#!/usr/bin/env bash\n# SHELLCHECK_VERSION=0.1\n'),
    ).toStrictEqual({
      ok: false,
      error: `${SHELLCHECK_INSTALLER} has no SHELLCHECK_VERSION= line pinning a version`,
    });
  });
});

describe('shellcheckVersion', () => {
  it('passes a probe that ran the pinned version', () => {
    const probe = {
      status: 0,
      signal: null,
      stdout: 'ShellCheck - shell script analysis tool\nversion: 0.11.0\nlicense: GPLv3\n',
      stderr: '',
    };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toStrictEqual({ ok: true, value: '0.11.0' });
  });

  it('fails a probe that ran another version, naming the binary, both versions and the installer', () => {
    const probe = { status: 0, signal: null, stdout: 'version: 0.9.0\n', stderr: '' };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toStrictEqual({
      ok: false,
      error:
        `${SOURCE} is shellcheck 0.9.0, and ${SHELLCHECK_INSTALLER} pins 0.11.0: run ${SHELLCHECK_INSTALLER}, ` +
        'which installs it into .tools/bin, where the gate looks before PATH; or move the pin (its version ' +
        'and every digest together) and fix what the new version reports',
    });
  });

  it('fails a probe that could not run, naming the cause and how to install shellcheck', () => {
    const probe = {
      status: 1,
      signal: null,
      stdout: '',
      stderr: 'shellcheck: spawn shellcheck ENOENT\n',
    };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toStrictEqual({
      ok: false,
      error:
        `${SOURCE} could not run (shellcheck: spawn shellcheck ENOENT): run ${SHELLCHECK_INSTALLER}, ` +
        'which installs it into .tools/bin, where the gate looks before PATH. The gate never skips a missing linter',
    });
  });

  it('fails a probe that exited non-zero even when it printed a version line', () => {
    const probe = { status: 2, signal: null, stdout: 'version: 0.11.0\n', stderr: '' };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toHaveProperty(
      'error',
      expect.stringContaining(`${SOURCE} could not run (exit 2): `),
    );
  });

  it('fails a probe killed by a signal, naming the signal', () => {
    const probe = { status: null, signal: 'SIGKILL' as const, stdout: '', stderr: '' };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toHaveProperty(
      'error',
      expect.stringContaining(`${SOURCE} could not run (killed by SIGKILL): `),
    );
  });

  it('fails a probe that exited 0 without a version line', () => {
    const probe = { status: 0, signal: null, stdout: 'usage: something else\n', stderr: '' };
    expect(shellcheckVersion(probe, PINNED, SOURCE)).toHaveProperty(
      'error',
      expect.stringContaining(`${SOURCE} printed no version line: `),
    );
  });
});
