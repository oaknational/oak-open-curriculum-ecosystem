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
