import { describe, expect, it } from 'vitest';

import { stripSessionIdTag } from '../../src/core/agent-identity/session-seed.js';

describe('stripSessionIdTag', () => {
  it('strips the env-form cse_ tag from a platform session id', () => {
    expect(stripSessionIdTag('cse_01FV6rZz5BjSkApAUL6FAj72')).toBe('01FV6rZz5BjSkApAUL6FAj72');
  });

  it('strips the URL-form session_ tag to the same payload', () => {
    expect(stripSessionIdTag('session_01FV6rZz5BjSkApAUL6FAj72')).toBe('01FV6rZz5BjSkApAUL6FAj72');
  });

  it('returns an untagged id unchanged', () => {
    expect(stripSessionIdTag('01FV6rZz5BjSkApAUL6FAj72')).toBe('01FV6rZz5BjSkApAUL6FAj72');
  });

  it('returns a harness UUID unchanged (no lowercase tag prefix)', () => {
    expect(stripSessionIdTag('d36e5cf3-6bcc-51db-9823-a91546b618f7')).toBe(
      'd36e5cf3-6bcc-51db-9823-a91546b618f7',
    );
  });

  it('strips exactly one tag, never recursively', () => {
    expect(stripSessionIdTag('session_cse_abc')).toBe('cse_abc');
  });

  it('leaves a bare tag with an empty payload unchanged rather than emptying the seed', () => {
    expect(stripSessionIdTag('session_')).toBe('session_');
  });

  it('trims surrounding whitespace before matching', () => {
    expect(stripSessionIdTag('  cse_abc123  ')).toBe('abc123');
  });

  it('does not treat an underscore-only or uppercase-tagged value as tagged', () => {
    expect(stripSessionIdTag('_abc')).toBe('_abc');
    expect(stripSessionIdTag('CSE_abc')).toBe('CSE_abc');
  });
});
