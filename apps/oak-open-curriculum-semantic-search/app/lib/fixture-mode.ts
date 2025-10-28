import type { NextRequest, NextResponse } from 'next/server';

export type FixtureMode = 'fixtures' | 'fixtures-empty' | 'fixtures-error' | 'live';

const FIXTURE_QUERY_PARAM = 'fixtures';
export const FIXTURE_MODE_COOKIE = 'semantic-search-fixtures';

const MODE_LOOKUP = buildModeLookup();

function buildModeLookup(): Map<string, FixtureMode> {
  const entries: Array<[FixtureMode, readonly string[]]> = [
    ['fixtures', ['1', 'true', 'on', 'fixture', 'fixtures', 'success']],
    ['fixtures-empty', ['empty', 'none', 'no-results', 'fixtures-empty']],
    ['fixtures-error', ['error', 'fail', 'failure', 'fixtures-error']],
    ['live', ['0', 'false', 'off', 'live']],
  ];
  const lookup = new Map<string, FixtureMode>();
  for (const [mode, values] of entries) {
    for (const value of values) {
      lookup.set(value, mode);
    }
  }
  return lookup;
}

function parseMode(value: string | null | undefined): FixtureMode | undefined {
  if (!value) {
    return undefined;
  }
  const normalised = value.trim().toLowerCase();
  return MODE_LOOKUP.get(normalised);
}

export function resolveFixtureMode({
  queryValue,
  cookieValue,
  envValue,
}: {
  queryValue?: string | null;
  cookieValue?: string | null;
  envValue?: string | undefined;
}): {
  mode: FixtureMode;
  persist?: FixtureMode;
} {
  const queryMode = parseMode(queryValue);
  if (queryMode) {
    return { mode: queryMode, persist: queryMode };
  }

  const cookieMode = parseMode(cookieValue);
  if (cookieMode) {
    return { mode: cookieMode };
  }

  const envMode = parseMode(envValue);
  if (envMode) {
    return { mode: envMode };
  }

  return { mode: 'live' };
}

export function resolveFixtureModeFromRequest(req: NextRequest): {
  mode: FixtureMode;
  persist?: FixtureMode;
} {
  const url = new URL(req.url);
  const queryValue = url.searchParams.get(FIXTURE_QUERY_PARAM);
  const cookieValue = req.cookies.get(FIXTURE_MODE_COOKIE)?.value ?? null;
  return resolveFixtureMode({
    queryValue,
    cookieValue,
    envValue: process.env.SEMANTIC_SEARCH_USE_FIXTURES,
  });
}

export function resolveFixtureModeFromEnv(): FixtureMode {
  return resolveFixtureMode({ envValue: process.env.SEMANTIC_SEARCH_USE_FIXTURES }).mode;
}

export function applyFixtureModeCookie(
  response: NextResponse,
  persist: FixtureMode | undefined,
): void {
  if (!persist) {
    return;
  }
  response.cookies.set(FIXTURE_MODE_COOKIE, modeToCookieValue(persist), {
    sameSite: 'lax',
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
}

export function resolveFixtureModeFromCookies(cookieStore: {
  get(name: string): { value: string } | undefined;
}): FixtureMode {
  const cookieValue = cookieStore.get(FIXTURE_MODE_COOKIE)?.value ?? null;
  return resolveFixtureMode({
    cookieValue,
    envValue: process.env.SEMANTIC_SEARCH_USE_FIXTURES,
  }).mode;
}

export function modeToCookieValue(mode: FixtureMode): string {
  switch (mode) {
    case 'fixtures':
      return 'on';
    case 'fixtures-empty':
      return 'empty';
    case 'fixtures-error':
      return 'error';
    case 'live':
    default:
      return 'off';
  }
}
