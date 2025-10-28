import { type NextRequest, NextResponse } from 'next/server';
import { GET as runRebuildRollup } from '../../rebuild-rollup/route';
import { resolveFixtureModeFromRequest, applyFixtureModeCookie } from '../../../lib/fixture-mode';
import { buildAdminStreamFixture, createStreamResponse } from '../../../lib/admin-fixtures';

export async function GET(request: NextRequest): Promise<Response> {
  const { mode, persist } = resolveFixtureModeFromRequest(request);

  if (mode !== 'live') {
    const fixture = buildAdminStreamFixture('rebuild-rollup', mode);
    const response = createStreamResponse(fixture);
    applyFixtureModeCookie(response, persist);
    return response;
  }

  const live = await runRebuildRollup(request);
  if (live instanceof NextResponse) {
    applyFixtureModeCookie(live, persist);
    return live;
  }

  const body = await live.text();
  const response = new NextResponse(body, {
    status: live.status,
    statusText: live.statusText,
    headers: live.headers,
  });
  applyFixtureModeCookie(response, persist);
  return response;
}
