import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveTrustedGh } from './trusted-gh.js';

describe('resolveTrustedGh', () => {
  it('returns ok with the absolute path to gh from the first trusted directory that has it', () => {
    // Homebrew's bin is searched before the system dirs, so it wins when present.
    const result = resolveTrustedGh((candidate) => candidate === '/opt/homebrew/bin/gh');
    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe('/opt/homebrew/bin/gh');
  });

  it('searches the trusted directories in priority order, taking the first hit', () => {
    // Both exist; the earlier-listed directory must win (deterministic resolution).
    const result = resolveTrustedGh(
      (candidate) => candidate === '/opt/homebrew/bin/gh' || candidate === '/usr/local/bin/gh',
    );
    expect(unwrap(result)).toBe('/opt/homebrew/bin/gh');
  });

  it('resolves by absolute path only — never a bare "gh" (S4036 PATH-hijack defence)', () => {
    const path = unwrap(resolveTrustedGh((candidate) => candidate === '/usr/local/bin/gh'));
    expect(path).toBe('/usr/local/bin/gh');
    expect(path.startsWith('/')).toBe(true);
  });

  it('returns err naming the remedy when gh is in none of the trusted directories', () => {
    const result = resolveTrustedGh(() => false);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/gh.*not found|No trusted gh/u);
    }
  });
});
