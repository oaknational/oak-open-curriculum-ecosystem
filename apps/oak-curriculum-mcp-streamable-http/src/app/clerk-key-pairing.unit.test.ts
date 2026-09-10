import { describe, it, expect, vi } from 'vitest';
import { verifyClerkKeyPairing, type JwksFetchFn } from './clerk-key-pairing.js';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

const PUBLIC_JWKS_URL = 'https://instance-a.clerk.example/.well-known/jwks.json';
const BACKEND_API_URL = 'https://api.clerk.example';
const BACKEND_JWKS_URL = `${BACKEND_API_URL}/v1/jwks`;
const INSTANCE_A = 'ins_instanceAAAAAAAAAAAAAAAA';
const INSTANCE_B = 'ins_instanceBBBBBBBBBBBBBBBB';
const SECRET_KEY = 'sk_test_never_in_any_message';
const INPUT = {
  publicJwksUrl: PUBLIC_JWKS_URL,
  secretKey: SECRET_KEY,
  backendApiUrl: BACKEND_API_URL,
} as const;

function jwksOf(...kids: readonly string[]): unknown {
  return { keys: kids.map((kid) => ({ kid, kty: 'RSA', alg: 'RS256', use: 'sig' })) };
}

type FakeResponse = { readonly status: number; readonly body: unknown };

function fakeFetch(responses: Readonly<Record<string, FakeResponse>>) {
  return vi.fn<JwksFetchFn>().mockImplementation((url) => {
    const response = responses[url];
    if (!response) {
      return Promise.reject(new TypeError(`fetch failed: no fake response for ${url}`));
    }
    return Promise.resolve({
      ok: response.status < 400,
      status: response.status,
      json: () => Promise.resolve(response.body),
    });
  });
}

/** A recording span: the attributes the check emits, keyed by name. */
function fakeObservability(): {
  observability: Pick<HttpObservability, 'withSpan'>;
  attributes: Record<string, unknown>;
} {
  const attributes: Record<string, unknown> = {};
  const span: HttpSpanHandle = {
    setAttribute(name, value) {
      attributes[name] = value;
    },
    setAttributes(values) {
      Object.assign(attributes, values);
    },
  };
  return {
    attributes,
    observability: { withSpan: (options) => Promise.resolve(options.run(span)) },
  };
}

describe('verifyClerkKeyPairing', () => {
  it('returns ok with the shared instance id when both JWKS carry the same kid', async () => {
    const fetchFn = fakeFetch({
      [PUBLIC_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
      [BACKEND_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
    });
    const { observability, attributes } = fakeObservability();

    const result = await verifyClerkKeyPairing(INPUT, fetchFn, observability);

    const value = result.ok ? result.value : null;
    expect(result.ok).toBe(true);
    expect(value?.instanceId).toBe(INSTANCE_A);
    expect(attributes['oak.clerk.instance_id']).toBe(INSTANCE_A);
  });

  it('presents the secret key to the Backend API as a bearer credential and nowhere else', async () => {
    const fetchFn = fakeFetch({
      [PUBLIC_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
      [BACKEND_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
    });

    await verifyClerkKeyPairing(INPUT, fetchFn, fakeObservability().observability);

    const [publicCall, backendCall] = fetchFn.mock.calls;
    expect(publicCall?.[0]).toBe(PUBLIC_JWKS_URL);
    expect(publicCall?.[1]?.headers).toBeUndefined();
    expect(backendCall?.[0]).toBe(BACKEND_JWKS_URL);
    expect(backendCall?.[1]?.headers?.Authorization).toBe(`Bearer ${SECRET_KEY}`);
  });

  it('returns err with unpaired_keys naming both instance ids when the kids differ', async () => {
    const fetchFn = fakeFetch({
      [PUBLIC_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
      [BACKEND_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_B) },
    });
    const { observability, attributes } = fakeObservability();

    const result = await verifyClerkKeyPairing(INPUT, fetchFn, observability);

    const error = result.ok ? null : result.error;
    expect(result.ok).toBe(false);
    expect(error?.type).toBe('unpaired_keys');
    expect(error?.message).toContain(INSTANCE_A);
    expect(error?.message).toContain(INSTANCE_B);
    expect(error?.message).not.toContain(SECRET_KEY);
    expect(attributes['oak.clerk.pairing_error']).toBe('unpaired_keys');
  });

  it('returns err with jwks_fetch_failed when the Backend API rejects the secret key', async () => {
    const fetchFn = fakeFetch({
      [PUBLIC_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
      [BACKEND_JWKS_URL]: { status: 401, body: { errors: [{ code: 'clerk_key_invalid' }] } },
    });

    const result = await verifyClerkKeyPairing(INPUT, fetchFn, fakeObservability().observability);

    const error = result.ok ? null : result.error;
    expect(result.ok).toBe(false);
    expect(error?.type).toBe('jwks_fetch_failed');
    expect(error?.message).toContain('401');
    expect(error?.message).not.toContain(SECRET_KEY);
  });

  it('returns err with invalid_shape when a JWKS document has no key ids', async () => {
    const fetchFn = fakeFetch({
      [PUBLIC_JWKS_URL]: { status: 200, body: { keys: [{ kty: 'RSA' }] } },
      [BACKEND_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
    });

    const result = await verifyClerkKeyPairing(INPUT, fetchFn, fakeObservability().observability);

    const error = result.ok ? null : result.error;
    expect(result.ok).toBe(false);
    expect(error?.type).toBe('invalid_shape');
    expect(error?.message).toContain(PUBLIC_JWKS_URL);
  });

  it('returns err with jwks_fetch_failed when the network call itself fails', async () => {
    const fetchFn = fakeFetch({
      [BACKEND_JWKS_URL]: { status: 200, body: jwksOf(INSTANCE_A) },
    });

    const result = await verifyClerkKeyPairing(INPUT, fetchFn, fakeObservability().observability);

    const error = result.ok ? null : result.error;
    expect(result.ok).toBe(false);
    expect(error?.type).toBe('jwks_fetch_failed');
    expect(error?.message).toContain(PUBLIC_JWKS_URL);
  });
});
