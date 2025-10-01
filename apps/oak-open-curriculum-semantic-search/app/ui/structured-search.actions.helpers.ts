import type { FixtureMode } from '../lib/fixture-mode';

/**
 * Maps the fixture mode into the query parameter shape understood by the API routes.
 */
export function resolveFixtureQueryParam(mode: FixtureMode): string | undefined {
  switch (mode) {
    case 'fixtures':
      return 'on';
    case 'fixtures-empty':
      return 'empty';
    case 'fixtures-error':
      return 'error';
    case 'live':
    default:
      return undefined;
  }
}

/**
 * Builds an internal API URL, applying fixture overrides where relevant.
 */
export function buildApiUrl(base: string, pathname: string, fixtureQuery?: string): string {
  const url = new URL(pathname, base);
  if (fixtureQuery) {
    url.searchParams.set('fixtures', fixtureQuery);
  }
  return url.toString();
}
