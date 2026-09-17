import { describe, expect, it } from 'vitest';

import { describeThrown, stripTrailing } from './support';

describe('stripTrailing', () => {
  it('strips every trailing occurrence of the character', () => {
    expect(stripTrailing('http://localhost:3020///', '/')).toBe('http://localhost:3020');
  });

  it('leaves a string without the trailing character untouched', () => {
    expect(stripTrailing('http://localhost:3020', '/')).toBe('http://localhost:3020');
  });

  it('strips leading occurrences never — only the tail', () => {
    expect(stripTrailing('//host//', '/')).toBe('//host');
  });

  it('empties a string made only of the character', () => {
    expect(stripTrailing('///', '/')).toBe('');
  });
});

describe('describeThrown', () => {
  it('prefers an Error stack when present', () => {
    const error = new Error('boom');

    expect(describeThrown(error)).toBe(error.stack);
  });

  it('falls back to the message when the stack is absent', () => {
    const error = new Error('boom');
    error.stack = undefined;

    expect(describeThrown(error)).toBe('boom');
  });

  it('stringifies a non-Error thrown value', () => {
    expect(describeThrown('raw failure')).toBe('raw failure');
    expect(describeThrown(42)).toBe('42');
  });
});
