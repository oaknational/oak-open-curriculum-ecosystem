import { NextResponse } from 'next/server';
import { TextEncoder } from 'node:util';
import type { FixtureMode } from './fixture-mode';
import {
  ADMIN_STREAM_ACTIONS,
  type AdminStreamAction,
  type AdminStreamFixture,
  createAdminStreamEmptyFixture,
  createAdminStreamErrorFixture,
  createAdminStreamFixtureMap,
  createZeroHitTelemetry,
} from '@oaknational/oak-curriculum-sdk';

type ZeroHitTelemetry = ReturnType<typeof createZeroHitTelemetry>;

const encoder = new TextEncoder();

const STREAM_FIXTURES = createAdminStreamFixtureMap();

export function buildZeroHitTelemetryFixture(mode: FixtureMode): ZeroHitTelemetry | null {
  switch (mode) {
    case 'fixtures':
      return createZeroHitTelemetry();
    case 'fixtures-empty':
      return createZeroHitTelemetry({ recent: [] });
    case 'fixtures-error':
      return null;
    default:
      return createZeroHitTelemetry();
  }
}

export function buildAdminStreamFixture(
  action: AdminStreamAction,
  mode: FixtureMode,
): AdminStreamFixture {
  if (mode === 'fixtures-error') {
    return createAdminStreamErrorFixture();
  }
  if (mode === 'fixtures-empty') {
    return createAdminStreamEmptyFixture();
  }
  return STREAM_FIXTURES[action];
}

export function createStreamResponse(result: AdminStreamFixture): NextResponse {
  const { status } = result;

  if ('lines' in result) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const line of result.lines) {
          controller.enqueue(encoder.encode(`${line}\n`));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }

  return new NextResponse(result.errorText, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

export function isAdminStreamAction(value: string): value is AdminStreamAction {
  return ADMIN_STREAM_ACTIONS.some((action) => action === value);
}
