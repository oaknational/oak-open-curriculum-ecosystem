import { describe, expect, it } from 'vitest';
import { resolveFixtureMode, modeToCookieValue, resolveFixtureModeFromEnv } from './fixture-mode';

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

  it('translates mode values into cookie payloads', () => {
    expect(modeToCookieValue('fixtures')).toBe('on');
    expect(modeToCookieValue('live')).toBe('off');
  });

  it('respects environment defaults via resolveFixtureModeFromEnv', () => {
    const original = process.env.SEMANTIC_SEARCH_USE_FIXTURES;
    process.env.SEMANTIC_SEARCH_USE_FIXTURES = 'on';
    expect(resolveFixtureModeFromEnv()).toBe('fixtures');
    process.env.SEMANTIC_SEARCH_USE_FIXTURES = original;
  });
});
