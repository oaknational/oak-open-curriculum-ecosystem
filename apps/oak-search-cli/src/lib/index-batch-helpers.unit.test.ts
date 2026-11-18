import { describe, expect, it } from 'vitest';
import { err, ok, type Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/curriculum-sdk';
import type { OakClient } from '../adapters/oak-adapter';
import type { SequenceUnitsResponse } from '../types/oak';
import { createSequenceUnitsFetcher } from './index-batch-helpers';

/** A client whose `getSequenceUnits` always answers with the given Result. */
function clientAnswering(
  result: Result<SequenceUnitsResponse, SdkFetchError>,
): Pick<OakClient, 'getSequenceUnits'> {
  return { getSequenceUnits: () => Promise.resolve(result) };
}

describe('createSequenceUnitsFetcher', () => {
  it('resolves with the sequence units when the client answers ok', async () => {
    const units: SequenceUnitsResponse = [{ year: 7, units: [] }];
    const fetchSequenceUnits = createSequenceUnitsFetcher(clientAnswering(ok(units)));

    await expect(fetchSequenceUnits('maths-secondary')).resolves.toEqual(units);
  });

  it('rethrows the cause of a network error', async () => {
    const cause = new Error('socket hang up');
    const fetchSequenceUnits = createSequenceUnitsFetcher(
      clientAnswering(err({ kind: 'network_error', resource: 'maths-secondary', cause })),
    );

    await expect(fetchSequenceUnits('maths-secondary')).rejects.toBe(cause);
  });

  it('throws the formatted SDK error for any other failure', async () => {
    const fetchSequenceUnits = createSequenceUnitsFetcher(
      clientAnswering(
        err({ kind: 'not_found', resource: 'maths-secondary', resourceType: 'sequence' }),
      ),
    );

    await expect(fetchSequenceUnits('maths-secondary')).rejects.toThrow(
      'sequence not found: maths-secondary',
    );
  });
});
