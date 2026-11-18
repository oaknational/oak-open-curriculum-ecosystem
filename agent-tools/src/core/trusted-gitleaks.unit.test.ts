import { isErr, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveTrustedGitleaks } from './trusted-gitleaks.js';

describe('resolveTrustedGitleaks', () => {
  it.each([['linux'], ['darwin']] as const)(
    'on %s returns the trusted POSIX path that holds gitleaks, Homebrew first',
    (platform) => {
      expect(unwrap(resolveTrustedGitleaks(() => true, platform))).toBe(
        '/opt/homebrew/bin/gitleaks',
      );
      expect(
        unwrap(
          resolveTrustedGitleaks((candidate) => candidate === '/usr/local/bin/gitleaks', platform),
        ),
      ).toBe('/usr/local/bin/gitleaks');
    },
  );

  it('on win32 refuses even when a POSIX path exists, naming the platform refusal', () => {
    const result = resolveTrustedGitleaks(() => true, 'win32');
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result).message).toMatch(
      /no administrator-protected install location on Windows/u,
    );
  });

  it('on POSIX the refusal names every searched path and the install remedy', () => {
    const error = unwrapErr(resolveTrustedGitleaks(() => false, 'linux'));
    expect(error.message).toMatch(
      /^No trusted gitleaks binary found\. Searched: \/opt\/homebrew\/bin\/gitleaks, \/usr\/local\/bin\/gitleaks, \/usr\/bin\/gitleaks\./u,
    );
    expect(error.message).toMatch(/brew install gitleaks/u);
  });
});
