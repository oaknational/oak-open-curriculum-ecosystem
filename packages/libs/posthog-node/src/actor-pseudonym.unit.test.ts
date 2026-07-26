import { err, type Result } from '@oaknational/result';
import { assert, describe, expect, it } from 'vitest';

import {
  createPostHogPseudonymCapabilities,
  type PostHogActorPseudonym,
  type PostHogIdentityProjectionError,
  type PostHogPseudonymCapabilities,
  type PostHogPseudonymConfig,
  type PostHogPseudonymConfigurationError,
  type PostHogPseudonymEnvironment,
  type PostHogPseudonymKey,
} from './index.js';

const ZERO_KEY = new Uint8Array(32);
const GOLDEN_DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';

function keyWithByte(byte: number): Uint8Array {
  return new Uint8Array(32).fill(byte);
}

function validConfig(overrides: Partial<PostHogPseudonymConfig> = {}): PostHogPseudonymConfig {
  return {
    environment: 'production',
    activeKeyId: '2026-07',
    keyring: [{ id: '2026-07', key: ZERO_KEY }],
    ...overrides,
  };
}

function unwrapCapabilities(
  result: Result<PostHogPseudonymCapabilities, PostHogPseudonymConfigurationError>,
): PostHogPseudonymCapabilities {
  assert(result.ok, 'Expected valid PostHog pseudonym configuration');
  return result.value;
}

function unwrapProjection(
  result: Result<PostHogActorPseudonym, PostHogIdentityProjectionError>,
): PostHogActorPseudonym {
  assert(result.ok, 'Expected valid PostHog identity projection');
  return result.value;
}

function expectConfigurationError(config: PostHogPseudonymConfig): void {
  expect(createPostHogPseudonymCapabilities(config)).toStrictEqual(
    err({ kind: 'invalid_posthog_pseudonym_configuration' }),
  );
}

function expectProjectionError(result: Result<unknown, PostHogIdentityProjectionError>): void {
  expect(result).toStrictEqual(err({ kind: 'posthog_identity_projection_failed' }));
}

describe('createPostHogPseudonymCapabilities', () => {
  it('binds the canonical framed HMAC-SHA256 golden vector', () => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));

    expect(unwrapProjection(capabilities.active.project('user_example'))).toStrictEqual({
      environment: 'production',
      keyId: '2026-07',
      distinctId: GOLDEN_DISTINCT_ID,
    });
  });

  it.each([
    ['empty keyring', validConfig({ keyring: [] })],
    [
      'duplicate key IDs',
      validConfig({
        keyring: [
          { id: '2026-07', key: ZERO_KEY },
          { id: '2026-07', key: keyWithByte(1) },
        ],
      }),
    ],
    [
      'duplicate key material',
      validConfig({
        keyring: [
          { id: '2026-07', key: ZERO_KEY },
          { id: '2026-08', key: new Uint8Array(ZERO_KEY) },
        ],
      }),
    ],
    [
      'missing active key',
      validConfig({
        activeKeyId: 'missing',
        keyring: [{ id: '2026-07', key: ZERO_KEY }],
      }),
    ],
  ])('rejects %s with one fixed content-free error', (_label, config) => {
    expectConfigurationError(config);
  });

  it.each(['a', '2026-07', 'a_b', `a${'b'.repeat(31)}`])('accepts valid key ID %s', (keyId) => {
    const capabilities = unwrapCapabilities(
      createPostHogPseudonymCapabilities(
        validConfig({
          activeKeyId: keyId,
          keyring: [{ id: keyId, key: ZERO_KEY }],
        }),
      ),
    );
    expect(unwrapProjection(capabilities.active.project('actor')).keyId).toBe(keyId);
  });

  it.each(['', 'A', '-a', '_a', 'a.b', 'a b', 'a\nb', `a${'b'.repeat(32)}`])(
    'rejects invalid key ID %j',
    (keyId) => {
      expectConfigurationError(
        validConfig({
          activeKeyId: keyId,
          keyring: [{ id: keyId, key: ZERO_KEY }],
        }),
      );
    },
  );

  it.each([0, 31, 33])('rejects a %i-byte key', (length) => {
    expectConfigurationError(
      validConfig({
        keyring: [{ id: '2026-07', key: new Uint8Array(length) }],
      }),
    );
  });

  it('defensively copies the keyring, entries, and key bytes at bootstrap', () => {
    const key = keyWithByte(7);
    const entry = { id: 'active', key };
    const keyring: PostHogPseudonymKey[] = [entry];
    const config: {
      environment: PostHogPseudonymEnvironment;
      activeKeyId: string;
      keyring: PostHogPseudonymKey[];
    } = {
      environment: 'production',
      activeKeyId: 'active',
      keyring,
    };
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(config));
    const activeBefore = unwrapProjection(capabilities.active.project('actor'));
    const deletionBefore = capabilities.deletion.project('actor');

    key.fill(9);
    entry.id = 'mutated';
    keyring.push({ id: 'added', key: keyWithByte(3) });
    config.environment = 'preview';
    config.activeKeyId = 'added';

    expect(unwrapProjection(capabilities.active.project('actor'))).toStrictEqual(activeBefore);
    expect(capabilities.deletion.project('actor')).toStrictEqual(deletionBefore);
  });
});

describe('active actor projection', () => {
  it.each([
    ['one byte', 'a'],
    ['exactly 512 ASCII bytes', 'a'.repeat(512)],
    ['exactly 512 multi-byte UTF-8 bytes', '😀'.repeat(128)],
  ])('accepts a principal at the %s boundary', (_label, principal) => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));
    expect(capabilities.active.project(principal).ok).toBe(true);
  });

  it.each([
    ['empty', ''],
    ['over 512 ASCII bytes', 'a'.repeat(513)],
    ['over 512 multi-byte UTF-8 bytes', '😀'.repeat(129)],
    ['lone high surrogate', '\uD800'],
    ['lone low surrogate', '\uDC00'],
  ])('rejects a %s principal with one fixed content-free error', (_label, principal) => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));
    const result = capabilities.active.project(principal);

    expectProjectionError(result);
  });

  it('does not serialise rejected principal content', () => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));
    const principal = `hostile-principal-${'x'.repeat(512)}`;

    expect(JSON.stringify(capabilities.active.project(principal))).not.toContain(
      'hostile-principal',
    );
  });

  it('does not trim, case-fold, or Unicode-normalise the principal', () => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));
    const variants = ['actor', ' actor', 'actor ', 'Actor', 'é', 'e\u0301'];
    const projections = variants.map(
      (principal) => unwrapProjection(capabilities.active.project(principal)).distinctId,
    );

    expect(new Set(projections).size).toBe(variants.length);
  });

  it('changes when environment, key ID, key bytes, or principal changes', () => {
    const baseline = unwrapProjection(
      unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig())).active.project('actor'),
    ).distinctId;
    const variants: readonly [PostHogPseudonymEnvironment, string, Uint8Array, string][] = [
      ['preview', '2026-07', ZERO_KEY, 'actor'],
      ['production', '2026-08', ZERO_KEY, 'actor'],
      ['production', '2026-07', keyWithByte(1), 'actor'],
      ['production', '2026-07', ZERO_KEY, 'actor-2'],
    ];

    for (const [environment, keyId, key, principal] of variants) {
      const capabilities = unwrapCapabilities(
        createPostHogPseudonymCapabilities({
          environment,
          activeKeyId: keyId,
          keyring: [{ id: keyId, key }],
        }),
      );
      expect(unwrapProjection(capabilities.active.project(principal)).distinctId).not.toBe(
        baseline,
      );
    }
  });

  it('is stable and stateless across repeated and interleaved calls', () => {
    const capabilities = unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig()));
    const actorOne = unwrapProjection(capabilities.active.project('actor-one'));
    const actorTwo = unwrapProjection(capabilities.active.project('actor-two'));

    expect(unwrapProjection(capabilities.active.project('actor-one'))).toStrictEqual(actorOne);
    expect(unwrapProjection(capabilities.active.project('actor-two'))).toStrictEqual(actorTwo);
    expect(actorOne.distinctId).not.toBe(actorTwo.distinctId);
  });

  it('retains the full unpadded base64url SHA-256 digest', () => {
    const projection = unwrapProjection(
      unwrapCapabilities(createPostHogPseudonymCapabilities(validConfig())).active.project(
        'user_example',
      ),
    );
    const digest = projection.distinctId.split(':').at(-1);

    expect(digest).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(digest).not.toContain('=');
  });
});

describe('rotation and deletion projection', () => {
  const keyring: readonly PostHogPseudonymKey[] = [
    { id: 'k3', key: keyWithByte(3) },
    { id: 'k1', key: keyWithByte(1) },
    { id: 'k2', key: keyWithByte(2) },
  ];

  it('projects only the configured active key and rotates atomically at bootstrap', () => {
    const first = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k1',
        keyring,
      }),
    );
    const second = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k2',
        keyring,
      }),
    );

    const firstProjection = unwrapProjection(first.active.project('actor'));
    const secondProjection = unwrapProjection(second.active.project('actor'));
    expect(firstProjection.keyId).toBe('k1');
    expect(secondProjection.keyId).toBe('k2');
    expect(firstProjection.distinctId).not.toBe(secondProjection.distinctId);
  });

  it('returns every retained deletion projection once in key-ID order', () => {
    const capabilities = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k2',
        keyring,
      }),
    );
    const result = capabilities.deletion.project('actor');
    assert(result.ok, 'Expected deletion projections');

    expect(result.value.map(({ keyId }) => keyId)).toStrictEqual(['k1', 'k2', 'k3']);
    expect(new Set(result.value.map(({ distinctId }) => distinctId)).size).toBe(3);
    expect(keyring.map(({ id }) => id)).toStrictEqual(['k3', 'k1', 'k2']);
  });

  it('rejects malformed deletion principals with one fixed content-free error', () => {
    const capabilities = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k2',
        keyring,
      }),
    );

    expectProjectionError(capabilities.deletion.project('\uD800'));
  });

  it('matches each deletion projection to an equivalent active-only configuration', () => {
    const capabilities = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k2',
        keyring,
      }),
    );
    const result = capabilities.deletion.project('actor');
    assert(result.ok, 'Expected deletion projections');

    for (const projection of result.value) {
      const sourceKey = keyring.find(({ id }) => id === projection.keyId);
      assert(sourceKey, 'Expected retained source key');
      const activeOnly = unwrapCapabilities(
        createPostHogPseudonymCapabilities({
          environment: 'production',
          activeKeyId: sourceKey.id,
          keyring: [sourceKey],
        }),
      );
      expect(unwrapProjection(activeOnly.active.project('actor'))).toStrictEqual(projection);
    }
  });

  it('returns fresh immutable-by-value projection records on every deletion call', () => {
    const capabilities = unwrapCapabilities(
      createPostHogPseudonymCapabilities({
        environment: 'production',
        activeKeyId: 'k2',
        keyring,
      }),
    );
    const first = capabilities.deletion.project('actor');
    const second = capabilities.deletion.project('actor');
    assert(first.ok && second.ok, 'Expected deletion projections');

    expect(second.value).toStrictEqual(first.value);
    expect(second.value).not.toBe(first.value);
    for (const [index, projection] of second.value.entries()) {
      expect(projection).not.toBe(first.value[index]);
    }
  });
});
