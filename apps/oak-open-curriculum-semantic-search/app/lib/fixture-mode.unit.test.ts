import { describe, expect, it } from 'vitest';
import { resolveFixtureMode, modeToCookieValue, type FixtureMode } from './fixture-mode';

describe('fixture mode resolution', () => {
  it('prefers query value when present', () => {
    const result = resolveFixtureMode({
      queryValue: 'on',
      cookieValue: 'off',
      envValue: 'false',
    });
    expect(result).toEqual({ mode: 'fixtures', persist: 'fixtures' });
  });

  it('falls back to cookie when query is absent', () => {
    const result = resolveFixtureMode({ cookieValue: 'on' });
    expect(result).toEqual({ mode: 'fixtures' });
  });

  it('falls back to environment configuration when neither query nor cookie are set', () => {
    const result = resolveFixtureMode({ envValue: 'true' });
    expect(result).toEqual({ mode: 'fixtures' });
  });

  it('returns live mode when no signals are provided', () => {
    const result = resolveFixtureMode({});
    expect(result).toEqual({ mode: 'live' });
  });

  it('parses alternative fixture modes from query values', () => {
    const emptyResult = resolveFixtureMode({ queryValue: 'empty' });
    expect(emptyResult).toEqual({ mode: 'fixtures-empty', persist: 'fixtures-empty' });

    const errorResult = resolveFixtureMode({ queryValue: 'error' });
    expect(errorResult).toEqual({ mode: 'fixtures-error', persist: 'fixtures-error' });
  });

  it('parses alternative fixture modes from cookies', () => {
    const emptyResult = resolveFixtureMode({ cookieValue: 'empty' });
    expect(emptyResult).toEqual({ mode: 'fixtures-empty' });

    const errorResult = resolveFixtureMode({ cookieValue: 'error' });
    expect(errorResult).toEqual({ mode: 'fixtures-error' });
  });

  it('translates mode values into cookie payloads', () => {
    const expectations: Record<FixtureMode, string> = {
      fixtures: 'on',
      'fixtures-empty': 'empty',
      'fixtures-error': 'error',
      live: 'off',
    };

    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const [mode, cookieValue] of Object.entries(expectations) as [FixtureMode, string][]) {
      expect(modeToCookieValue(mode)).toBe(cookieValue);
    }
  });

  it('respects environment values via resolveFixtureMode', () => {
    expect(resolveFixtureMode({ envValue: 'on' }).mode).toBe('fixtures');
    expect(resolveFixtureMode({ envValue: 'empty' }).mode).toBe('fixtures-empty');
    expect(resolveFixtureMode({ envValue: 'error' }).mode).toBe('fixtures-error');
  });
});
