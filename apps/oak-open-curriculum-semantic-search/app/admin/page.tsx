import type { JSX } from 'react';
import { cookies } from 'next/headers';
import { resolveFixtureModeFromCookies } from '../lib/fixture-mode';
import { resolveFixtureToggleVisibility } from '../lib/fixture-toggle';
import { AdminPageClient } from './AdminPageClient';

export default async function AdminPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const initialFixtureMode = resolveFixtureModeFromCookies(cookieStore);
  const showFixtureToggle = resolveFixtureToggleVisibility();

  return (
    <AdminPageClient
      initialFixtureMode={initialFixtureMode}
      showFixtureToggle={showFixtureToggle}
    />
  );
}
