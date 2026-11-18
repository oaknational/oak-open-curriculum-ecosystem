import { isErr, isOk, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveTrustedBinary, type TrustedBinarySpec } from './trusted-binary.js';

/** A fixture binary with one location per family. */
const TOOL: TrustedBinarySpec = {
  name: 'tool',
  paths: {
    posix: ['/opt/homebrew/bin/tool', '/usr/bin/tool'],
    win32: [String.raw`C:\Program Files\Tool\tool.exe`],
  },
  remedyFor: (platform) => (platform === 'win32' ? 'install it system-wide.' : 'symlink it.'),
};

/** A fixture binary with no protected location on win32. */
const POSIX_ONLY: TrustedBinarySpec = {
  name: 'posixtool',
  paths: { posix: ['/usr/bin/posixtool'], win32: [] },
  remedyFor: () => 'run it on a POSIX host.',
};

describe('resolveTrustedBinary', () => {
  it('returns the first candidate of the platform family that exists, in order', () => {
    const result = resolveTrustedBinary(TOOL, () => true, 'linux');
    expect(unwrap(result)).toBe('/opt/homebrew/bin/tool');
  });

  it('on win32 consults only the Windows family', () => {
    const windowsOnly = resolveTrustedBinary(
      TOOL,
      (candidate) => candidate === String.raw`C:\Program Files\Tool\tool.exe`,
      'win32',
    );
    expect(unwrap(windowsOnly)).toBe(String.raw`C:\Program Files\Tool\tool.exe`);
    const posixPresent = resolveTrustedBinary(
      TOOL,
      (candidate) => candidate === '/usr/bin/tool',
      'win32',
    );
    expect(isErr(posixPresent)).toBe(true);
  });

  it('on POSIX never consults the Windows family', () => {
    const result = resolveTrustedBinary(
      TOOL,
      (candidate) => candidate === String.raw`C:\Program Files\Tool\tool.exe`,
      'darwin',
    );
    expect(isErr(result)).toBe(true);
  });

  it('refuses by naming the binary, every searched path, the absolute-path reason and the remedy', () => {
    const error = unwrapErr(resolveTrustedBinary(TOOL, () => false, 'linux'));
    expect(error.message).toBe(
      'No trusted tool binary found. Searched: /opt/homebrew/bin/tool, /usr/bin/tool. ' +
        'tool is resolved by a fixed absolute path from these well-known locations (never via PATH) ' +
        'to defeat PATH-search hijacking (SonarCloud S4036). symlink it.',
    );
  });

  it('refuses loudly on a platform whose family is empty, and never probes', () => {
    const result = resolveTrustedBinary(POSIX_ONLY, () => true, 'win32');
    expect(isOk(result)).toBe(false);
    expect(unwrapErr(result).message).toMatch(
      /Searched: nothing \(no trusted location on this platform\)/u,
    );
    expect(unwrapErr(result).message).toMatch(/run it on a POSIX host\./u);
  });
});
