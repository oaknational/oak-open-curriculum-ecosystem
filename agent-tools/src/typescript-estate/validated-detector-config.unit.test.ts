import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { verifyDetectorContractHashes } from './validated-detector-config.js';

const CONFIG_SHA256 = '38c4c8d4d83789659dbd23fb72637cd32861499fcfcd2726be6826c329567557';
const SCHEMA_SHA256 = 'd896be3afa6b1fdb5e397a472cd4bc05cea49351230304d154f22a53f8460aa5';

describe('detector contract identity', () => {
  it('accepts exactly the pinned revision 2.7 config and schema identities', () => {
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
    expect(failure.message).toContain('revision 2.7 detector contract');
  });
});
