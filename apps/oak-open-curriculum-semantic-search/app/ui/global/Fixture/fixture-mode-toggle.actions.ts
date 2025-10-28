'use server';

import { cookies } from 'next/headers';
import {
  FIXTURE_MODE_COOKIE,
  modeToCookieValue,
  type FixtureMode,
} from '../../../lib/fixture-mode';

export async function setFixtureMode(mode: FixtureMode): Promise<void> {
  const store = await cookies();
  store.set({
    name: FIXTURE_MODE_COOKIE,
    value: modeToCookieValue(mode),
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
}
