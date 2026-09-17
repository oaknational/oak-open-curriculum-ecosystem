import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { verifyDetectorContractHashes } from './validated-detector-config.js';

const CONFIG_SHA256 = '54ace41d941d9fe190b1fd467a3c3ed8aac223953a2e28841b573830e83c7c2d';
const SCHEMA_SHA256 = 'cc052b863ff972b7cfaf03dc53098b6081dcaf9f67faf1984b7c8019d28c8016';

describe('detector contract identity', () => {
  it('accepts exactly the independently reviewed revision 2.6 config and schema identities', () => {
    expect(
      unwrapOrThrow(
        verifyDetectorContractHashes({
          configSha256: CONFIG_SHA256,
          schemaSha256: SCHEMA_SHA256,
        }),
      ),
    ).toBeUndefined();
  });

  it.each([
    { configSha256: '0'.repeat(64), schemaSha256: SCHEMA_SHA256 },
    { configSha256: CONFIG_SHA256, schemaSha256: '0'.repeat(64) },
  ])('refuses changed or unrelated contract bytes', (identity) => {
    const failure = unwrapErr(verifyDetectorContractHashes(identity));

    expect(failure.code).toBe('IDENTITY_INVALID');
    expect(failure.message).toContain('revision 2.6 detector contract');
  });
});
