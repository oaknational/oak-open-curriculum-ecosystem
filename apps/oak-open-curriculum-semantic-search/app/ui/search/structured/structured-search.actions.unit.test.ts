import { describe, expect, it } from 'vitest';
import { buildApiUrl, resolveFixtureQueryParam } from './structured-search.actions.helpers';

describe('resolveFixtureQueryParam', () => {
  it('maps fixture modes to query values understood by the API', () => {
    expect(resolveFixtureQueryParam('fixtures')).toBe('on');
    expect(resolveFixtureQueryParam('fixtures-empty')).toBe('empty');
    expect(resolveFixtureQueryParam('fixtures-error')).toBe('error');
    expect(resolveFixtureQueryParam('live')).toBeUndefined();
  });
});

describe('buildApiUrl', () => {
  it('returns the base URL when no fixture override is supplied', () => {
    expect(buildApiUrl('http://localhost:3000', '/api/search')).toBe(
      'http://localhost:3000/api/search',
    );
  });

  it('appends the fixture query parameter when provided', () => {
    expect(buildApiUrl('http://localhost:3000', '/api/search', 'empty')).toBe(
      'http://localhost:3000/api/search?fixtures=empty',
    );
  });
});
