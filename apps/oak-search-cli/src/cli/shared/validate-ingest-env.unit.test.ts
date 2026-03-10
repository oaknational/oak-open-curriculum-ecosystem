/**
 * Unit tests for `validateIngestEnv`.
 *
 * Verifies that the Oak API key precondition is checked before
 * resource creation in lifecycle ingest commands.
 */

import { describe, it, expect } from 'vitest';
import { validateIngestEnv } from './validate-ingest-env.js';

describe('validateIngestEnv', () => {
  it('returns ok when oakApiKey is present', () => {
    const result = validateIngestEnv({ oakApiKey: 'placeholder' });
    expect(result.ok).toBe(true);
  });

  it('returns err when oakApiKey is undefined', () => {
    const result = validateIngestEnv({ oakApiKey: undefined });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('missing_env');
      expect(result.error.message).toContain('OAK_API_KEY');
    }
  });

  it('returns err when oakApiKey is empty string', () => {
    const result = validateIngestEnv({ oakApiKey: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('missing_env');
    }
  });
});
