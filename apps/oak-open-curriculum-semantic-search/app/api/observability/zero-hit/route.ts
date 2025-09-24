import type { NextRequest } from 'next/server';
import {
  handleZeroHitSummary,
  handleZeroHitWebhook,
} from '../../../../src/lib/observability/api/zero-hit-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<Response> {
  return handleZeroHitSummary(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  return handleZeroHitWebhook(request);
}
