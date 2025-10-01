import { NextResponse, type NextRequest } from 'next/server';
import {
  handleZeroHitSummary,
  handleZeroHitWebhook,
} from '../../../../src/lib/observability/api/zero-hit-api';
import { resolveFixtureModeFromRequest, applyFixtureModeCookie } from '../../../lib/fixture-mode';
import { buildZeroHitTelemetryFixture } from '../../../lib/admin-fixtures';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<Response> {
  const { mode, persist } = resolveFixtureModeFromRequest(request);

  if (mode !== 'live') {
    if (mode === 'fixtures-error') {
      const response = NextResponse.json(
        {
          error: 'FIXTURE_ERROR',
          message: 'Fixture mode requested an error response for zero-hit telemetry.',
        },
        { status: 503 },
      );
      applyFixtureModeCookie(response, persist);
      return response;
    }

    const fixture = buildZeroHitTelemetryFixture(mode);
    if (fixture) {
      const response = NextResponse.json(fixture);
      applyFixtureModeCookie(response, persist);
      return response;
    }
  }

  const live = await handleZeroHitSummary(request);
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

export async function POST(request: NextRequest): Promise<Response> {
  return handleZeroHitWebhook(request);
}
