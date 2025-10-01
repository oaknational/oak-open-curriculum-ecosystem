import { describe, expect, it } from 'vitest';
import { resolveFixtureToggleVisibility } from './fixture-toggle';

describe('resolveFixtureToggleVisibility', () => {
  it('defaults to visible when no explicit flag is provided', () => {
    expect(resolveFixtureToggleVisibility({})).toBe(true);
  });

  it.each(['false', 'FALSE', 'False', '0', 'off', 'OFF', 'Off'])(
    'treats %s as disabled',
    (value) => {
      expect(resolveFixtureToggleVisibility({ NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: value })).toBe(
        false,
      );
    },
  );

  it.each(['true', 'TRUE', 'True', '1', 'on', 'ON', 'On'])('treats %s as enabled', (value) => {
    expect(resolveFixtureToggleVisibility({ NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: value })).toBe(true);
  });

  it('ignores surrounding whitespace when evaluating the flag', () => {
    expect(
      resolveFixtureToggleVisibility({ NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: '   false   ' }),
    ).toBe(false);
  });
});
