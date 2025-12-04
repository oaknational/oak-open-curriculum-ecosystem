import { type NextRequest, NextResponse } from 'next/server';
import {
  parseSearchRequest,
  buildStructuredQuery,
  handleStructuredSearchRequest,
} from './search-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest): Promise<Response> {
  const rawJson: unknown = await req.json();
  const parsed = parseSearchRequest(rawJson);
  if (!parsed.success) {
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- REFACTOR
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const body = parsed.data;
  const query = buildStructuredQuery(body);
  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';

  return handleStructuredSearchRequest({ req, body, query, indexVersion });
}
