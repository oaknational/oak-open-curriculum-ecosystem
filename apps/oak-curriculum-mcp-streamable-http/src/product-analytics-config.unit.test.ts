import { describe, it, expect } from 'vitest';
import {
  resolveProductAnalyticsConfig,
  type ProductAnalyticsBootstrap,
} from './product-analytics-config.js';

const ZERO_KEY_BASE64URL = Buffer.alloc(32, 0).toString('base64url');
const ONE_KEY_BASE64URL = Buffer.alloc(32, 1).toString('base64url');

const validKeyring = JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY_BASE64URL }]);

const selectedEnv = {
  OBSERVABILITY_SINKS: ['sentry', 'posthog'] as const,
  POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
  POSTHOG_HOST: 'https://eu.i.posthog.com',
  POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
  POSTHOG_PSEUDONYM_KEYRING: validKeyring,
};

function assertSelected(
  bootstrap: ProductAnalyticsBootstrap,
): asserts bootstrap is Extract<ProductAnalyticsBootstrap, { selected: true }> {
  expect(bootstrap.selected).toBe(true);
}

describe('resolveProductAnalyticsConfig — off mode', () => {
  it('returns an unselected bootstrap when posthog is not in the selection', () => {
    const result = resolveProductAnalyticsConfig({
      OBSERVABILITY_SINKS: ['sentry'],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ selected: false });
    }
  });

  it('ignores PostHog variables entirely when posthog is not selected', () => {
    const result = resolveProductAnalyticsConfig({
      OBSERVABILITY_SINKS: [],
      POSTHOG_PROJECT_API_KEY: '',
      POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'missing-from-ring',
      POSTHOG_PSEUDONYM_KEYRING: 'not even json',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ selected: false });
    }
  });
});

describe('resolveProductAnalyticsConfig — selected mode', () => {
  it('produces the closed bootstrap value from a complete valid configuration', () => {
    const result = resolveProductAnalyticsConfig(selectedEnv);

    expect(result.ok).toBe(true);
    if (result.ok) {
      assertSelected(result.value);
      const bootstrap = result.value;
      expect(bootstrap.projectApiKey).toBe('phc_test_project_key');
      expect(bootstrap.host).toBe('https://eu.i.posthog.com');
      expect(bootstrap.activeKeyId).toBe('k2026_01');
      expect(bootstrap.keyring).toHaveLength(1);
      expect(bootstrap.keyring[0]?.id).toBe('k2026_01');
      expect(bootstrap.keyring[0]?.key).toBeInstanceOf(Uint8Array);
      expect(bootstrap.keyring[0]?.key).toHaveLength(32);
      expect([...(bootstrap.keyring[0]?.key ?? [])].every((byte) => byte === 0)).toBe(true);
    }
  });

  it('backs each returned key with its own exactly-sized store, never a shared Buffer pool', () => {
    const result = resolveProductAnalyticsConfig(selectedEnv);
    expect(result.ok).toBe(true);
    if (result.ok) {
      assertSelected(result.value);
      // A pooled Node Buffer exposes a ~64KiB shared backing store through
      // `.buffer`; a consumer reading it would see unrelated pooled memory,
      // including sibling ring keys. The copy's store is exactly 32 bytes.
      expect(result.value.keyring[0]?.key.buffer.byteLength).toBe(32);
    }
  });

  it('accepts a multi-key ring, decoding each entry to its own material in order', () => {
    const result = resolveProductAnalyticsConfig({
      ...selectedEnv,
      POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([
        { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
        { id: 'k2026_02', key: ONE_KEY_BASE64URL },
      ]),
      POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_02',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      assertSelected(result.value);
      const bootstrap = result.value;
      expect(bootstrap.activeKeyId).toBe('k2026_02');
      expect(bootstrap.keyring.map((entry) => entry.id)).toEqual(['k2026_01', 'k2026_02']);
      expect([...(bootstrap.keyring[0]?.key ?? [])].every((byte) => byte === 0)).toBe(true);
      expect([...(bootstrap.keyring[1]?.key ?? [])].every((byte) => byte === 1)).toBe(true);
    }
  });
});

describe('resolveProductAnalyticsConfig — selected-mode rejections', () => {
  it.each([
    [
      'a missing project key',
      { ...selectedEnv, POSTHOG_PROJECT_API_KEY: undefined },
      'project API key is required',
    ],
    [
      'an empty project key',
      { ...selectedEnv, POSTHOG_PROJECT_API_KEY: '' },
      'project API key is required',
    ],
    [
      'a missing host',
      { ...selectedEnv, POSTHOG_HOST: undefined },
      'host must be the exact EU ingestion host',
    ],
    [
      'a non-EU host',
      { ...selectedEnv, POSTHOG_HOST: 'https://us.i.posthog.com' },
      'host must be the exact EU ingestion host',
    ],
    [
      'a missing active key id',
      { ...selectedEnv, POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: undefined },
      'active pseudonym key id is required',
    ],
    [
      'an empty active key id',
      { ...selectedEnv, POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: '' },
      'active pseudonym key id is required',
    ],
    [
      'a missing keyring',
      { ...selectedEnv, POSTHOG_PSEUDONYM_KEYRING: undefined },
      'pseudonym keyring is required',
    ],
  ])('rejects %s with its own rule', (_label, env, discriminator) => {
    const result = resolveProductAnalyticsConfig(env);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain(discriminator);
    }
  });
});

describe('resolveProductAnalyticsConfig — which keyring guard refused', () => {
  // Every ring below carries the selected active id (k2026_01) where its
  // shape allows one, so the ACTIVE-ID rule cannot mask the keyring rule
  // under test; the asserted fragments pin WHICH guard fired.
  //
  // The four guards — JSON, strict shape, base64url canonicality, and
  // id/key-material uniqueness — used to collapse into one opaque
  // message, which cost about an hour of guesswork in a live incident
  // (MCP-480). Each arm now names its guard plus safe shape facts.
  it.each([
    ['malformed JSON', 'not json', ['POSTHOG_PSEUDONYM_KEYRING is not valid JSON']],
    [
      'a JSON object rather than an array',
      JSON.stringify({ id: 'k2026_01', key: ZERO_KEY_BASE64URL }),
      ['must be a JSON array of key records'],
    ],
    ['an empty array', '[]', ['must hold at least one key record']],
    [
      'an entry that is not an object',
      JSON.stringify(['k2026_01']),
      ['entry 0 of 1', 'must be an object with exactly the properties'],
    ],
    [
      'two unrecognised properties on one record',
      JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY_BASE64URL, extra: true, another: 1 }]),
      ['entry 0 of 1', '2 unrecognised properties'],
    ],
    [
      'a record with unknown fields',
      JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY_BASE64URL, extra: true }]),
      ['entry 0 of 1', '1 unrecognised property'],
    ],
    [
      'a record missing the key field',
      JSON.stringify([{ id: 'k2026_01' }]),
      ['entry 0 of 1', 'has no string "key"'],
    ],
    [
      'a record with a non-string id',
      JSON.stringify([{ id: 7, key: ZERO_KEY_BASE64URL }]),
      ['entry 0 of 1', 'has no string "id"'],
    ],
    [
      'an empty id',
      JSON.stringify([{ id: '', key: ZERO_KEY_BASE64URL }]),
      ['entry 0 of 1', '"id" outside the key-id rule'],
    ],
    [
      'an id outside the adapter key-id contract (uppercase)',
      JSON.stringify([{ id: 'K2026_01', key: ZERO_KEY_BASE64URL }]),
      ['entry 0 of 1', '"id" outside the key-id rule'],
    ],
    [
      'an id outside the adapter key-id contract (leading separator)',
      JSON.stringify([{ id: '-k2026', key: ZERO_KEY_BASE64URL }]),
      ['entry 0 of 1', '"id" outside the key-id rule'],
    ],
    [
      'an id outside the adapter key-id contract (33 characters)',
      JSON.stringify([{ id: `k${'a'.repeat(32)}`, key: ZERO_KEY_BASE64URL }]),
      ['entry 0 of 1', '"id" outside the key-id rule'],
    ],
    [
      'duplicate ids',
      JSON.stringify([
        { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
        { id: 'k2026_01', key: ONE_KEY_BASE64URL },
      ]),
      ['entry 1 of 2', 'repeats the "id" of entry 0'],
    ],
    [
      'duplicate key material under distinct ids',
      JSON.stringify([
        { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
        { id: 'k2', key: ZERO_KEY_BASE64URL },
      ]),
      ['entry 1 of 2', 'repeats the key material of entry 0'],
    ],
    [
      'padded base64',
      JSON.stringify([{ id: 'k2026_01', key: Buffer.alloc(32, 0).toString('base64') }]),
      ['entry 0 of 1', '"key" of 44 characters', '43 unpadded base64url characters'],
    ],
    [
      'a non-canonical encoding that decodes to the same bytes',
      JSON.stringify([{ id: 'k2026_01', key: `${ZERO_KEY_BASE64URL.slice(0, 42)}B` }]),
      ['entry 0 of 1', 'non-canonical base64url "key"'],
    ],
    [
      'key material shorter than 32 bytes',
      JSON.stringify([{ id: 'k2026_01', key: Buffer.alloc(31, 0).toString('base64url') }]),
      ['entry 0 of 1', '"key" of 42 characters'],
    ],
    [
      'key material longer than 32 bytes',
      JSON.stringify([{ id: 'k2026_01', key: Buffer.alloc(33, 0).toString('base64url') }]),
      ['entry 0 of 1', '"key" of 44 characters'],
    ],
    [
      'a bad record after a good one',
      JSON.stringify([
        { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
        { id: 'k2026_02', key: 'too-short' },
      ]),
      ['entry 1 of 2', '"key" of 9 characters'],
    ],
  ])('names the guard that rejected a keyring with %s', (_label, keyring, fragments) => {
    const result = resolveProductAnalyticsConfig({
      ...selectedEnv,
      POSTHOG_PSEUDONYM_KEYRING: keyring,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      for (const fragment of fragments) {
        expect(result.error.message).toContain(fragment);
      }
    }
  });

  it('gives each of the four keyring guards a message of its own', () => {
    const messages = [
      'not json',
      JSON.stringify([{ id: 'k2026_01' }]),
      JSON.stringify([{ id: 'k2026_01', key: `${ZERO_KEY_BASE64URL.slice(0, 42)}B` }]),
      JSON.stringify([
        { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
        { id: 'k2', key: ZERO_KEY_BASE64URL },
      ]),
    ].map((keyring) => {
      const result = resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_KEYRING: keyring,
      });
      expect(result.ok).toBe(false);
      return result.ok ? '' : result.error.message;
    });

    expect(new Set(messages).size).toBe(messages.length);
  });

  it('rejects an active key id that resolves no keyring entry', () => {
    const result = resolveProductAnalyticsConfig({
      ...selectedEnv,
      POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k_absent',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('resolves no keyring entry');
    }
  });

  it('never includes supplied values in a failure — no key material, no api key, no raw keyring', () => {
    // Canaries planted in every position an operator-supplied value can
    // occupy: the id, the key material, the unrecognised property name,
    // and the raw keyring text itself.
    const canaryKeyring = JSON.stringify([
      { id: 'canary-id-9f31', key: `${ZERO_KEY_BASE64URL.slice(0, 42)}B`, canaryProp: 1 },
    ]);
    const failures = [
      resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_KEYRING: 'not json canary-raw-77a2',
      }),
      resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_KEYRING: canaryKeyring,
      }),
      resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k1', key: 'short' }]),
      }),
      resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([
          { id: 'k2026_01', key: ZERO_KEY_BASE64URL },
          { id: 'k2026_02', key: ZERO_KEY_BASE64URL },
        ]),
      }),
      resolveProductAnalyticsConfig({ ...selectedEnv, POSTHOG_HOST: 'https://us.i.posthog.com' }),
      resolveProductAnalyticsConfig({
        ...selectedEnv,
        POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k_absent',
      }),
    ];

    for (const result of failures) {
      expect(result.ok).toBe(false);
      if (!result.ok) {
        const serialised = JSON.stringify(result.error);
        expect(serialised).not.toContain(ZERO_KEY_BASE64URL);
        expect(serialised).not.toContain(ZERO_KEY_BASE64URL.slice(0, 42));
        expect(serialised).not.toContain('canary-id-9f31');
        expect(serialised).not.toContain('canaryProp');
        expect(serialised).not.toContain('canary-raw-77a2');
        expect(serialised).not.toContain('phc_test_project_key');
        expect(serialised).not.toContain('us.i.posthog.com');
        expect(serialised).not.toContain('k_absent');
        expect(serialised).not.toContain('short');
      }
    }
  });
});
