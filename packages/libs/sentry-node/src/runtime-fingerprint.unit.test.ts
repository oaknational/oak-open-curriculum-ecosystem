import { describe, expect, it } from 'vitest';
import { applyFingerprint, SENTRY_DEFAULT_FINGERPRINT } from './runtime-fingerprint.js';
import type { SentryErrorEvent } from './types.js';

// L-IMM Sub-item 1 — custom error fingerprinting. The MCP HTTP server
// throws a small set of named error classes (the test-error route's
// three modes plus the MCP protocol's `McpError`). Without explicit
// fingerprinting, Sentry's default groups by stack-trace coincidence;
// the empirical baseline (issues OAK-OPEN-CURRICULUM-MCP-7/8/9 from
// the 2026-04-26 validation walk) shows the default already produces
// three distinct issues for the three TestError modes — but that
// alignment is incidental, not load-bearing. This module locks the
// behaviour in by emitting an explicit fingerprint keyed on the
// error-class name.

function buildErrorEvent(overrides: Partial<SentryErrorEvent> = {}): SentryErrorEvent {
  return {
    type: undefined,
    event_id: '0123456789abcdef0123456789abcdef',
    timestamp: 1_700_000_000,
    ...overrides,
  };
}

function buildExceptionEvent(typeName: string): SentryErrorEvent {
  return buildErrorEvent({
    exception: {
      values: [
        {
          type: typeName,
          value: '[fixture] error message',
        },
      ],
    },
  });
}

describe('applyFingerprint — augments Sentry default grouping for known error families', () => {
  it('emits the hybrid fingerprint for TestErrorUnhandled', () => {
    const event = buildExceptionEvent('TestErrorUnhandled');
    const result = applyFingerprint(event);
    expect(result.fingerprint).toEqual([SENTRY_DEFAULT_FINGERPRINT, 'TestErrorUnhandled']);
  });

  it('emits the hybrid fingerprint for TestErrorHandled', () => {
    const event = buildExceptionEvent('TestErrorHandled');
    const result = applyFingerprint(event);
    expect(result.fingerprint).toEqual([SENTRY_DEFAULT_FINGERPRINT, 'TestErrorHandled']);
  });

  it('emits the hybrid fingerprint for TestErrorRejected', () => {
    const event = buildExceptionEvent('TestErrorRejected');
    const result = applyFingerprint(event);
    expect(result.fingerprint).toEqual([SENTRY_DEFAULT_FINGERPRINT, 'TestErrorRejected']);
  });

  it('emits the hybrid fingerprint for McpError', () => {
    const event = buildExceptionEvent('McpError');
    const result = applyFingerprint(event);
    expect(result.fingerprint).toEqual([SENTRY_DEFAULT_FINGERPRINT, 'McpError']);
  });

  it('leaves the fingerprint untouched for unknown error classes', () => {
    const event = buildExceptionEvent('SomeOtherError');
    const result = applyFingerprint(event);
    expect(result).not.toHaveProperty('fingerprint');
  });

  it('leaves the fingerprint untouched when no exception is attached (e.g. messages)', () => {
    const event = buildErrorEvent({ message: 'hello' });
    const result = applyFingerprint(event);
    expect(result).not.toHaveProperty('fingerprint');
  });

  it('leaves the fingerprint untouched when exception.values is empty', () => {
    const event = buildErrorEvent({ exception: { values: [] } });
    const result = applyFingerprint(event);
    expect(result).not.toHaveProperty('fingerprint');
  });

  it('does not mutate the input event when assigning a fingerprint', () => {
    const event = buildExceptionEvent('TestErrorHandled');
    const result = applyFingerprint(event);
    expect(event).not.toHaveProperty('fingerprint');
    expect(result).not.toBe(event);
  });

  it('overwrites a pre-existing fingerprint for matched classes; preserves it for unmatched', () => {
    // The matcher takes precedence on known families because the
    // whole point of the policy is to anchor those families.
    // Unknown classes flow through unchanged, including any
    // upstream-supplied fingerprint.
    const knownEvent = buildExceptionEvent('TestErrorHandled');
    const knownWithFingerprint = { ...knownEvent, fingerprint: ['legacy-key'] };
    expect(applyFingerprint(knownWithFingerprint).fingerprint).toEqual([
      SENTRY_DEFAULT_FINGERPRINT,
      'TestErrorHandled',
    ]);

    const unknownEvent = buildExceptionEvent('SomeOtherError');
    const unknownWithFingerprint = { ...unknownEvent, fingerprint: ['legacy-key'] };
    expect(applyFingerprint(unknownWithFingerprint).fingerprint).toEqual(['legacy-key']);
  });
});
