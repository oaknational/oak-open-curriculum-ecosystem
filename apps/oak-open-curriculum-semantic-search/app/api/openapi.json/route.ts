import { NextResponse, type NextRequest } from 'next/server';
import { buildOpenAPIDocument } from '../../../src/lib/openapi';

/** Serves the generated OpenAPI JSON (OAS 3.1). */
export function GET(req: NextRequest): Response {
  const origin = new URL(req.url).origin;
  const doc = buildOpenAPIDocument(origin);
  return NextResponse.json(doc, {
    headers: {
      'cache-control': 'public, max-age=60',
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
