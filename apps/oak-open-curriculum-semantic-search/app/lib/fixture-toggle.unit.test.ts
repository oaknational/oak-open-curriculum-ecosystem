import { describe, expect, it } from 'vitest';
import { resolveFixtureToggleVisibility, resolveFixtureToggleState } from './fixture-toggle';

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
    expect(resolveFixtureToggleVisibility({ NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: ' OFF ' })).toBe(
      false,
    );
  });
});

describe('resolveFixtureToggleState', () => {
  it('prefers cookie value when determining the initial mode', () => {
    const result = resolveFixtureToggleState({
      cookieValue: ' On ',
    });
    expect(result).toEqual({ visible: true, initialMode: 'fixtures' });
  });

  it('treats cookie values for empty and error fixture modes as enabled', () => {
    expect(resolveFixtureToggleState({ cookieValue: 'empty' })).toEqual({
      visible: true,
      initialMode: 'fixtures',
    });

    expect(resolveFixtureToggleState({ cookieValue: 'error' })).toEqual({
      visible: true,
      initialMode: 'fixtures',
    });
  });

  it('respects env override for visibility even when cookie enables fixtures', () => {
    const result = resolveFixtureToggleState({
      env: { NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: 'false' },
      cookieValue: 'on',
    });
    expect(result).toEqual({ visible: false, initialMode: 'fixtures' });
  });

  it('falls back to env defaults when cookie is absent', () => {
    const result = resolveFixtureToggleState({
      env: { NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: 'TrUe' },
    });
    expect(result).toEqual({ visible: true, initialMode: 'fixtures' });
  });

  it('defaults to live mode when neither cookie nor env force fixtures', () => {
    const result = resolveFixtureToggleState({});
    expect(result).toEqual({ visible: true, initialMode: 'live' });
  });
});
