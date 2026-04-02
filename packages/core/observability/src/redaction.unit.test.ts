import { describe, expect, it } from 'vitest';
import {
  REDACTED_VALUE,
  redactHeaderRecord,
  redactHeaderValue,
  redactTelemetryObject,
  redactTelemetryValue,
} from './redaction.js';

describe('redactTelemetryValue', () => {
  it('redacts nested secrets by key name', () => {
    const value = redactTelemetryObject({
      headers: {
        authorization: 'Bearer abc123',
      },
      payload: {
        nested: {
          refresh_token: 'refresh-secret',
        },
      },
    });

    expect(value).toStrictEqual({
      headers: {
        authorization: REDACTED_VALUE,
      },
      payload: {
        nested: {
          refresh_token: REDACTED_VALUE,
        },
      },
    });
  });

  it('redacts sensitive query-string parameters inside URLs', () => {
    expect(
      redactTelemetryValue(
        'https://example.test/callback?code=secret-code&state=opaque-state&safe=value',
      ),
    ).toBe('https://example.test/callback?code=%5BREDACTED%5D&state=%5BREDACTED%5D&safe=value');
  });

  it('redacts credentials embedded in URLs', () => {
    expect(redactTelemetryValue('https://user:secret@example.test/callback?safe=value')).toBe(
      'https://%5BREDACTED%5D:%5BREDACTED%5D@example.test/callback?safe=value',
    );
  });

  it('redacts CLI-style embedded secret arguments in strings', () => {
    expect(redactTelemetryValue('--api-key=super-secret --subject=maths')).toBe(
      '--api-key=[REDACTED] --subject=maths',
    );
  });

  it('redacts arrays recursively', () => {
    expect(
      redactTelemetryValue([
        {
          token: 'abc',
        },
        'Bearer xyz',
      ]),
    ).toStrictEqual([
      {
        token: REDACTED_VALUE,
      },
      'Bearer [REDACTED]',
    ]);
  });

  it('redacts OAuth code and code_verifier by key name', () => {
    const value = redactTelemetryObject({
      code: 'authorization-code-value',
      code_verifier: 'pkce-verifier-secret',
      grant_type: 'authorization_code',
    });

    expect(value).toStrictEqual({
      code: REDACTED_VALUE,
      code_verifier: REDACTED_VALUE,
      grant_type: 'authorization_code',
    });
  });

  it('redacts OAuth assertion credentials by key name', () => {
    const value = redactTelemetryObject({
      assertion: 'jwt-bearer-credential',
      client_assertion: 'signed-client-jwt',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    });

    expect(value).toStrictEqual({
      assertion: REDACTED_VALUE,
      client_assertion: REDACTED_VALUE,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    });
  });

  it('redacts OAuth state and nonce by key name', () => {
    const value = redactTelemetryObject({
      state: 'opaque-state',
      nonce: 'random-nonce',
      grant_type: 'authorization_code',
    });

    expect(value).toStrictEqual({
      state: REDACTED_VALUE,
      nonce: REDACTED_VALUE,
      grant_type: 'authorization_code',
    });
  });

  it('redacts sensitive fields inside OAuth form-encoded payload strings', () => {
    expect(
      redactTelemetryValue(
        'grant_type=authorization_code&code=secret-code&code_verifier=secret-verifier&client_id=oak-client&state=opaque-state&nonce=random-nonce',
      ),
    ).toBe(
      'grant_type=authorization_code&code=%5BREDACTED%5D&code_verifier=%5BREDACTED%5D&client_id=oak-client&state=%5BREDACTED%5D&nonce=%5BREDACTED%5D',
    );
  });

  it('redacts token-bearing OAuth form-encoded payload strings', () => {
    expect(
      redactTelemetryValue(
        'access_token=secret-access&refresh_token=secret-refresh&id_token=secret-id&client_assertion=signed-client-jwt&assertion=jwt-bearer-credential&client_secret=top-secret',
      ),
    ).toBe(
      'access_token=%5BREDACTED%5D&refresh_token=%5BREDACTED%5D&id_token=%5BREDACTED%5D&client_assertion=%5BREDACTED%5D&assertion=%5BREDACTED%5D&client_secret=%5BREDACTED%5D',
    );
  });

  it('redacts nonce in URL query strings', () => {
    expect(
      redactTelemetryValue(
        'https://auth.example.test/authorize?nonce=random-nonce-value&response_type=code',
      ),
    ).toBe('https://auth.example.test/authorize?nonce=%5BREDACTED%5D&response_type=code');
  });

  it('redacts sensitive OAuth values inside form-encoded payload strings', () => {
    expect(
      redactTelemetryValue(
        'grant_type=authorization_code&code=secret-code&code_verifier=pkce-secret&client_id=oak-client&state=opaque-state&nonce=random-nonce&client_assertion=signed-client-jwt',
        'data',
      ),
    ).toBe(
      'grant_type=authorization_code&code=%5BREDACTED%5D&code_verifier=%5BREDACTED%5D&client_id=oak-client&state=%5BREDACTED%5D&nonce=%5BREDACTED%5D&client_assertion=%5BREDACTED%5D',
    );
  });
});

describe('redactHeaderValue', () => {
  it('fully redacts sensitive header values', () => {
    expect(redactHeaderValue('authorization', 'Bearer abc123')).toBe(REDACTED_VALUE);
    expect(redactHeaderValue('x-api-key', 'secret')).toBe(REDACTED_VALUE);
  });

  it('partially redacts IP-like forwarding headers', () => {
    expect(redactHeaderValue('x-forwarded-for', '203.0.113.195')).toBe('203.....195');
  });
});

describe('redactHeaderRecord', () => {
  it('preserves safe headers while redacting sensitive ones', () => {
    expect(
      redactHeaderRecord({
        accept: 'application/json',
        authorization: 'Bearer secret',
      }),
    ).toStrictEqual({
      accept: 'application/json',
      authorization: REDACTED_VALUE,
    });
  });
});
