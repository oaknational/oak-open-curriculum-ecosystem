import { describe, expect, it } from 'vitest';
import { parseResponse } from './NaturalSearch.helpers';

describe('parseResponse', () => {
  it('returns the server-provided message for fixture-triggered errors', () => {
    const response = parseResponse(
      false,
      JSON.stringify({
        error: 'FIXTURE_ERROR',
        message: 'Fixture mode requested an error response for natural-language search.',
      }),
    );

    expect(response).toEqual({
      error: 'Fixture mode requested an error response for natural-language search.',
      payload: null,
    });
  });

  it('falls back to mapped copy when the error code is known but no message is supplied', () => {
    const response = parseResponse(false, JSON.stringify({ error: 'LLM_DISABLED' }));

    expect(response).toEqual({
      error:
        'Natural-language parsing is disabled on this deployment. Use /api/search with a structured body.',
      payload: null,
    });
  });

  it('falls back to a generic message when parsing fails and the response was not ok', () => {
    const response = parseResponse(false, '<html>Error</html>');

    expect(response).toEqual({ error: 'Search failed', payload: null });
  });
});
