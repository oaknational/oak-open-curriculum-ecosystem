import type { JSX } from 'react';
import { cookies } from 'next/headers';
import SearchPageClient from '../ui/search/SearchPageClient';
import { searchAction } from '../ui/search/structured/structured-search.actions';
import { resolveFixtureModeFromCookies } from '../lib/fixture-mode';
import { resolveFixtureToggleVisibility } from '../lib/fixture-toggle';

export default async function StructuredSearchPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const initialFixtureMode = resolveFixtureModeFromCookies(cookieStore);
  const showFixtureToggle = resolveFixtureToggleVisibility();

  return (
    <SearchPageClient
      searchStructured={searchAction}
      initialFixtureMode={initialFixtureMode}
      showFixtureToggle={showFixtureToggle}
      variant="structured"
    />
  );
}
