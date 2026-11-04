import { createVerify, generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  mintInstallationToken,
  resolveInstallationId,
  signAppJwt,
  type GithubApiFetch,
} from './mint-installation-token.js';
import { TOKEN_SCOPES } from './token-scopes.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

function decodeSegment(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

const PAYLOAD_SCHEMA = z.object({ iat: z.number(), exp: z.number(), iss: z.string() });

function decodePayload(jwt: string): { iat: number; exp: number; iss: string } {
  return PAYLOAD_SCHEMA.parse(decodeSegment(jwt.split('.')[1]));
}

function fakeFetch(
  responses: readonly { status: number; body: unknown }[],
  calls: { url: string; method: string; authorization: string; body?: string }[],
): GithubApiFetch {
  let index = 0;
  return (url, init) => {
    calls.push({
      url,
      method: init.method,
      authorization: init.headers['authorization'] ?? '',
      body: init.body,
    });
    const response = responses[Math.min(index, responses.length - 1)];
    index += 1;
    return Promise.resolve({
      status: response.status,
      json: () => Promise.resolve(response.body),
    });
  };
}

describe('signAppJwt', () => {
  it('produces an RS256 JWT with backdated iat, bounded exp, and a verifiable signature', () => {
    const now = 1_800_000_000;
    const jwt = signAppJwt({ appId: '4242', privateKeyPem: privateKey, nowEpochSeconds: now });
    const [header, payload, signature] = jwt.split('.');

    expect(decodeSegment(header)).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(decodeSegment(payload)).toEqual({ iat: now - 60, exp: now + 540, iss: '4242' });

    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${header}.${payload}`);
    expect(verifier.verify(publicKey, Buffer.from(signature, 'base64url'))).toBe(true);
  });

  it('keeps exp under GitHub’s ten-minute ceiling measured from NOW (iat backdating must not eat into it)', () => {
    const now = 1_800_000_000;
    const jwt = signAppJwt({ appId: '1', privateKeyPem: privateKey, nowEpochSeconds: now });
    const payload = decodePayload(jwt);
    expect(payload.exp - now).toBeLessThan(600);
    expect(payload.iat).toBeLessThanOrEqual(now);
  });
});

describe('resolveInstallationId', () => {
  it('returns the installation id and sends the app JWT as the bearer', async () => {
    const calls: { url: string; method: string; authorization: string }[] = [];
    const result = await resolveInstallationId({
      appJwt: 'the-jwt',
      owner: 'jimCresswell',
      repo: 'jimcresswell.net',
      fetchImpl: fakeFetch([{ status: 200, body: { id: 987 } }], calls),
    });

    expect(result).toEqual({ ok: true, value: 987 });
    expect(calls[0].url).toBe(
      'https://api.github.com/repos/jimCresswell/jimcresswell.net/installation',
    );
    expect(calls[0].method).toBe('GET');
    expect(calls[0].authorization).toBe('Bearer the-jwt');
  });

  it('returns an install-hinting error on a non-200 status', async () => {
    const result = await resolveInstallationId({
      appJwt: 'j',
      owner: 'o',
      repo: 'r',
      fetchImpl: fakeFetch([{ status: 404, body: { message: 'Not Found' } }], []),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('HTTP 404');
      expect(result.error.message).toContain('installed');
    }
  });
});

describe('mintInstallationToken', () => {
  it('sends the permissions it was GIVEN, and scopes the mint to one repository', async () => {
    const calls: { url: string; method: string; authorization: string; body?: string }[] = [];
    // The READ-ONLY scope on purpose. The permission set this mint used to
    // hardcode was the three writes, so passing that scope here could pass
    // against a surviving hardcode by coincidence; this one cannot.
    const result = await mintInstallationToken({
      appJwt: 'the-jwt',
      installationId: 987,
      repoName: 'widgets',
      permissions: TOKEN_SCOPES['code-scanning-alerts'],
      fetchImpl: fakeFetch(
        [{ status: 201, body: { token: 'ghs_abc', expires_at: '2026-07-21T07:30:00Z' } }],
        calls,
      ),
    });

    expect(result).toEqual({
      ok: true,
      value: { token: 'ghs_abc', expiresAt: '2026-07-21T07:30:00Z' },
    });
    expect(calls[0].url).toBe('https://api.github.com/app/installations/987/access_tokens');
    expect(calls[0].method).toBe('POST');
    // Whole-body toEqual, not toHaveProperty: it pins the permissions AND
    // the 2026-07-21 repository scoping, and unlike a property check it also
    // catches a field being ADDED to the mint request.
    expect(JSON.parse(calls[0].body ?? '{}')).toEqual({
      repositories: ['widgets'],
      permissions: { security_events: 'read' },
    });
  });

  // Live provenance (2026-07-29, MCP-385): requesting `{administration: read}`
  // against the real installation returned exactly this 422 and this message.
  // That is why no post-mint verification of the granted set exists — an
  // ungranted permission fails the mint itself rather than narrowing silently.
  it("carries GitHub's explanation on a 422, so a permission gap names its own fix", async () => {
    const result = await mintInstallationToken({
      appJwt: 'j',
      installationId: 1,
      repoName: 'r',
      permissions: TOKEN_SCOPES['pull-request-work'],
      fetchImpl: fakeFetch(
        [
          {
            status: 422,
            body: {
              message: 'The permissions requested are not granted to this installation.',
              documentation_url: 'https://docs.github.com/rest',
            },
          },
        ],
        [],
      ),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('HTTP 422');
      expect(result.error.message).toContain(
        'The permissions requested are not granted to this installation.',
      );
    }
  });

  it('still reports the status when the error body is not the documented shape', async () => {
    const result = await mintInstallationToken({
      appJwt: 'j',
      installationId: 1,
      repoName: 'r',
      permissions: TOKEN_SCOPES['pull-request-work'],
      fetchImpl: fakeFetch([{ status: 500, body: { unexpected: 'shape' } }], []),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('HTTP 500');
    }
  });

  it('rejects a 201 whose body fails the schema (strict boundary)', async () => {
    const result = await mintInstallationToken({
      appJwt: 'j',
      installationId: 1,
      repoName: 'r',
      permissions: TOKEN_SCOPES['pull-request-work'],
      fetchImpl: fakeFetch([{ status: 201, body: { nope: true } }], []),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('failed validation');
    }
  });

  it('surfaces a 201 whose body is not JSON as an error, never a throw', async () => {
    const result = await mintInstallationToken({
      appJwt: 'j',
      installationId: 1,
      repoName: 'r',
      permissions: TOKEN_SCOPES['pull-request-work'],
      fetchImpl: () =>
        Promise.resolve({ status: 201, json: () => Promise.reject(new Error('bad body')) }),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('non-JSON body');
    }
  });

  it('surfaces non-201 statuses as errors', async () => {
    const result = await mintInstallationToken({
      appJwt: 'j',
      installationId: 1,
      repoName: 'r',
      permissions: TOKEN_SCOPES['pull-request-work'],
      fetchImpl: fakeFetch([{ status: 401, body: {} }], []),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('HTTP 401');
    }
  });
});
