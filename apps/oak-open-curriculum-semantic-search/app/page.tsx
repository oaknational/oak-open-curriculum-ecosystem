import type { JSX } from 'react';
import { cookies } from 'next/headers';
import SearchPageClient from './ui/client/SearchPageClient';
import { searchAction } from './ui/structured-search.actions';
import { resolveFixtureModeFromCookies } from './lib/fixture-mode';

export default async function Page(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const initialFixtureMode = resolveFixtureModeFromCookies(cookieStore);
  const showFixtureToggle = process.env.NODE_ENV !== 'production';
  const toggleFlag = process.env.NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE;
  const isToggleEnabled = toggleFlag ? toggleFlag.toLowerCase() !== 'false' : true;

  return (
    <SearchPageClient
      searchStructured={searchAction}
      initialFixtureMode={initialFixtureMode}
      showFixtureToggle={showFixtureToggle && isToggleEnabled}
    />
  );
}
