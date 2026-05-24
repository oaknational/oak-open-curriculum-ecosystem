/**
 * Unit tests for `formatConfigError` — the pure formatter behind
 * `printConfigError`. The wrapper itself is a one-line side-effect
 * shim; tests target the formatter.
 *
 * Per `tdd-as-design.md`: each test describes a user-observable
 * property of the formatted output, not the function's internal
 * dispatch. Optional-missing keys must not appear in the user-facing
 * surface; the validation `error.message` already names failing keys
 * cleanly.
 */

import { describe, it, expect } from 'vitest';
import { formatConfigError, type ConfigError } from './runtime-config-support.js';

describe('formatConfigError', () => {
  it('prefixes the env validation message and appends a trailing newline', () => {
    const error: ConfigError = {
      message: 'Failing keys: FOO',
      diagnostics: [],
    };

    expect(formatConfigError(error)).toBe('Environment validation failed: Failing keys: FOO\n');
  });

  it('does not emit per-key MISSING lines for absent keys', () => {
    const error: ConfigError = {
      message: 'Validation failed.',
      diagnostics: [
        { key: 'BULK_DOWNLOAD_DIR', present: false },
        { key: 'NODE_ENV', present: false },
        { key: 'SENTRY_DEBUG', present: false },
      ],
    };

    const formatted = formatConfigError(error);

    expect(formatted).not.toContain('BULK_DOWNLOAD_DIR: MISSING');
    expect(formatted).not.toContain('NODE_ENV: MISSING');
    expect(formatted).not.toContain('SENTRY_DEBUG: MISSING');
  });

  it('does not emit per-key lines for present keys either', () => {
    const error: ConfigError = {
      message: 'Validation failed.',
      diagnostics: [
        { key: 'OAK_API_KEY', present: true },
        { key: 'ELASTICSEARCH_URL', present: true },
      ],
    };

    const formatted = formatConfigError(error);

    expect(formatted).not.toContain('OAK_API_KEY');
    expect(formatted).not.toContain('ELASTICSEARCH_URL');
  });

  it('preserves multi-line error messages verbatim', () => {
    const error: ConfigError = {
      message: 'Line 1\nLine 2\nLine 3',
      diagnostics: [],
    };

    expect(formatConfigError(error)).toBe(
      'Environment validation failed: Line 1\nLine 2\nLine 3\n',
    );
  });
});
