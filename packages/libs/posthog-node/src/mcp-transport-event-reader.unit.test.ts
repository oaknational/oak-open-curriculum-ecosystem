import { describe, expect, it } from 'vitest';

import { normaliseOakClientSurface } from './event-policy-helpers.js';
import { readClientSurfaceHeaderValues } from './mcp-transport-event-reader.js';

describe('readClientSurfaceHeaderValues', () => {
  it('reads the x-anthropic-client and user-agent header values in that order', () => {
    const extra = {
      requestInfo: {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'x-anthropic-client': 'claude-code/2.0',
        },
      },
    };

    expect(readClientSurfaceHeaderValues(extra)).toEqual(['claude-code/2.0', 'Mozilla/5.0']);
  });

  it('takes the first element of a multi-valued header', () => {
    const extra = {
      requestInfo: { headers: { 'user-agent': ['Mozilla/5.0', 'ignored/2.0'] } },
    };

    expect(readClientSurfaceHeaderValues(extra)).toEqual([undefined, 'Mozilla/5.0']);
  });

  it.each([
    ['no extra', undefined],
    ['a non-object extra', 'extra'],
    ['no requestInfo', {}],
    ['a non-object requestInfo', { requestInfo: 'request' }],
    ['no headers', { requestInfo: {} }],
    ['non-object headers', { requestInfo: { headers: 'user-agent' } }],
  ])('returns no values for %s', (_label, extra) => {
    expect(readClientSurfaceHeaderValues(extra)).toEqual([]);
  });

  it('composes with normalisation to the safe default when headers are absent', () => {
    expect(normaliseOakClientSurface(readClientSurfaceHeaderValues(undefined))).toBe('other');
  });
});
