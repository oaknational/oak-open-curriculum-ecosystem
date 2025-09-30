import type { NextRequest, NextResponse } from 'next/server';

export type FixtureMode = 'fixtures' | 'live';

const FIXTURE_QUERY_PARAM = 'fixtures';
export const FIXTURE_MODE_COOKIE = 'semantic-search-fixtures';

const ENABLED_VALUES = new Set(['1', 'true', 'on']);
const DISABLED_VALUES = new Set(['0', 'false', 'off']);

function parseMode(value: string | null | undefined): FixtureMode | undefined {
  if (!value) {
    return undefined;
  }
  const normalised = value.trim().toLowerCase();
  if (ENABLED_VALUES.has(normalised)) {
    return 'fixtures';
  }
  if (DISABLED_VALUES.has(normalised)) {
    return 'live';
  }
  return undefined;
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
  persist?: 'fixtures' | 'live';
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
  persist?: 'fixtures' | 'live';
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
  persist: 'fixtures' | 'live' | undefined,
): void {
  if (persist === 'fixtures') {
    response.cookies.set(FIXTURE_MODE_COOKIE, 'on', {
      sameSite: 'lax',
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });
    return;
  }
  if (persist === 'live') {
    response.cookies.set(FIXTURE_MODE_COOKIE, 'off', {
      sameSite: 'lax',
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });
    return;
  }
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
  return mode === 'fixtures' ? 'on' : 'off';
}
