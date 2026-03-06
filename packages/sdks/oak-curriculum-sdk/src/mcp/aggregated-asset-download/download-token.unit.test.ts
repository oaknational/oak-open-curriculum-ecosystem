import { describe, it, expect } from 'vitest';
import { createDownloadSignature, validateDownloadSignature } from './download-token.js';

const TEST_SECRET = 'test-oak-api-key-for-signing';
const FIVE_MINUTES_MS = 5 * 60 * 1000;

describe('createDownloadSignature', () => {
  it('produces a non-empty hex string', () => {
    const sig = createDownloadSignature(
      'my-lesson',
      'worksheet',
      Date.now() + FIVE_MINUTES_MS,
      TEST_SECRET,
    );

    expect(sig).toMatch(/^[a-f0-9]+$/);
    expect(sig.length).toBeGreaterThan(0);
  });

  it('produces different signatures for different lessons', () => {
    const exp = Date.now() + FIVE_MINUTES_MS;
    const sig1 = createDownloadSignature('lesson-a', 'worksheet', exp, TEST_SECRET);
    const sig2 = createDownloadSignature('lesson-b', 'worksheet', exp, TEST_SECRET);

    expect(sig1).not.toBe(sig2);
  });

  it('produces different signatures for different asset types', () => {
    const exp = Date.now() + FIVE_MINUTES_MS;
    const sig1 = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);
    const sig2 = createDownloadSignature('my-lesson', 'slideDeck', exp, TEST_SECRET);

    expect(sig1).not.toBe(sig2);
  });

  it('produces different signatures for different expiry times', () => {
    const now = Date.now();
    const sig1 = createDownloadSignature(
      'my-lesson',
      'worksheet',
      now + FIVE_MINUTES_MS,
      TEST_SECRET,
    );
    const sig2 = createDownloadSignature(
      'my-lesson',
      'worksheet',
      now + FIVE_MINUTES_MS + 1000,
      TEST_SECRET,
    );

    expect(sig1).not.toBe(sig2);
  });

  it('is deterministic for the same inputs', () => {
    const exp = Date.now() + FIVE_MINUTES_MS;
    const sig1 = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);
    const sig2 = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);

    expect(sig1).toBe(sig2);
  });
});

describe('validateDownloadSignature', () => {
  it('accepts a valid signature within the expiry window', () => {
    const now = Date.now();
    const exp = now + FIVE_MINUTES_MS;
    const sig = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);

    const result = validateDownloadSignature('my-lesson', 'worksheet', sig, exp, TEST_SECRET, now);

    expect(result).toEqual({ valid: true });
  });

  it('rejects an expired token', () => {
    const now = Date.now();
    const exp = now - 1000; // expired 1 second ago
    const sig = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);

    const result = validateDownloadSignature('my-lesson', 'worksheet', sig, exp, TEST_SECRET, now);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('expired');
    }
  });

  it('rejects a tampered lesson slug', () => {
    const now = Date.now();
    const exp = now + FIVE_MINUTES_MS;
    const sig = createDownloadSignature('original-lesson', 'worksheet', exp, TEST_SECRET);

    const result = validateDownloadSignature(
      'tampered-lesson',
      'worksheet',
      sig,
      exp,
      TEST_SECRET,
      now,
    );

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('signature');
    }
  });

  it('rejects a tampered asset type', () => {
    const now = Date.now();
    const exp = now + FIVE_MINUTES_MS;
    const sig = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);

    const result = validateDownloadSignature('my-lesson', 'slideDeck', sig, exp, TEST_SECRET, now);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('signature');
    }
  });

  it('rejects a tampered expiry', () => {
    const now = Date.now();
    const exp = now + FIVE_MINUTES_MS;
    const sig = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);
    const tamperedExp = exp + 60_000; // extended by 1 minute

    const result = validateDownloadSignature(
      'my-lesson',
      'worksheet',
      sig,
      tamperedExp,
      TEST_SECRET,
      now,
    );

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('signature');
    }
  });

  it('rejects a completely fabricated signature', () => {
    const now = Date.now();
    const exp = now + FIVE_MINUTES_MS;

    const result = validateDownloadSignature(
      'my-lesson',
      'worksheet',
      'fabricated',
      exp,
      TEST_SECRET,
      now,
    );

    expect(result.valid).toBe(false);
  });

  it('rejects a token at exactly the expiry boundary (strict >= comparison)', () => {
    const exp = 1000;
    const sig = createDownloadSignature('my-lesson', 'worksheet', exp, TEST_SECRET);

    const result = validateDownloadSignature('my-lesson', 'worksheet', sig, exp, TEST_SECRET, exp);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('expired');
    }
  });
});
