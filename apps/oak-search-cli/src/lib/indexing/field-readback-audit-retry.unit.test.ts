import { describe, expect, it } from 'vitest';
import {
  getStatusCode,
  isRetryableStatusCode,
  shouldRetryForZeroCount,
  withTransientRetry,
} from '../../../operations/ingestion/field-readback-audit-retry.js';

describe('field readback audit retry helpers', () => {
  it('extracts numeric status codes safely', () => {
    expect(getStatusCode(null)).toBeUndefined();
    expect(getStatusCode('error')).toBeUndefined();
    expect(getStatusCode({})).toBeUndefined();
    expect(getStatusCode({ statusCode: '429' })).toBeUndefined();
    expect(getStatusCode({ statusCode: 429 })).toBe(429);
    expect(getStatusCode({ meta: { statusCode: 503 } })).toBe(503);
  });

  it('classifies retryable status codes', () => {
    expect(isRetryableStatusCode(429)).toBe(true);
    expect(isRetryableStatusCode(502)).toBe(true);
    expect(isRetryableStatusCode(503)).toBe(true);
    expect(isRetryableStatusCode(504)).toBe(true);
    expect(isRetryableStatusCode(400)).toBe(false);
    expect(isRetryableStatusCode(undefined)).toBe(false);
  });

  it('retries zero-count only when the field must be populated', () => {
    expect(shouldRetryForZeroCount(true, 0, 1, 3)).toBe(true);
    expect(shouldRetryForZeroCount(true, 0, 3, 3)).toBe(false);
    expect(shouldRetryForZeroCount(true, 1, 1, 3)).toBe(false);
    expect(shouldRetryForZeroCount(false, 0, 1, 3)).toBe(false);
  });

  it('retries transient failures and eventually succeeds', async () => {
    let attemptsMade = 0;
    const result = await withTransientRetry(
      async () => {
        attemptsMade += 1;
        if (attemptsMade < 3) {
          throw Object.assign(new Error('Transient gateway'), { statusCode: 502 });
        }
        return 'ok';
      },
      3,
      1,
      async () => Promise.resolve(),
    );

    expect(result).toBe('ok');
    expect(attemptsMade).toBe(3);
  });

  it('rethrows non-retryable failures without swallowing', async () => {
    await expect(
      withTransientRetry(
        async () => {
          throw Object.assign(new Error('Bad request'), { statusCode: 400 });
        },
        3,
        1,
        async () => Promise.resolve(),
      ),
    ).rejects.toThrow('Bad request');
  });

  it('rethrows after retryable failures exhaust all attempts', async () => {
    let attemptsMade = 0;
    await expect(
      withTransientRetry(
        async () => {
          attemptsMade += 1;
          throw Object.assign(new Error('Still failing'), { statusCode: 502 });
        },
        3,
        1,
        async () => Promise.resolve(),
      ),
    ).rejects.toThrow('Still failing');
    expect(attemptsMade).toBe(3);
  });

  it('retries transport errors from the elastic client', async () => {
    let attemptsMade = 0;
    const result = await withTransientRetry(
      async () => {
        attemptsMade += 1;
        if (attemptsMade === 1) {
          throw Object.assign(new Error('temporary timeout'), { name: 'TimeoutError' });
        }
        return 'ok';
      },
      2,
      1,
      async () => Promise.resolve(),
    );

    expect(result).toBe('ok');
    expect(attemptsMade).toBe(2);
  });
});
