import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../src/lib/env';
import type { KeyStage, SearchSubjectSlug } from '../../../src/types/oak';
import { createOakSdkClient } from '../../../src/adapters/oak-adapter-sdk';
import { KEY_STAGES, SUBJECTS, isKeyStage, isSubject } from '../../../src/adapters/sdk-guards';
import { esBulk } from '../../../src/lib/elastic-http';
import { getRateLimit } from '../../../src/lib/rate-limit';
import { buildIndexBulkOps } from '../../../src/lib/index-oak';

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get('x-api-key');
  return typeof k === 'string' && k.length > 0 && k === env().SEARCH_API_KEY;
}

export const maxDuration = 300;

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Optional: peek at rate limit (free endpoint)
  try {
    await getRateLimit();
  } catch {
    /* ignore */
  }

  const client = createOakSdkClient();

  const keyStages: KeyStage[] = KEY_STAGES.filter(isKeyStage);
  const subjects: SearchSubjectSlug[] = SUBJECTS.filter(isSubject);
  const bulkOps = await buildIndexBulkOps(client, keyStages, subjects);

  if (bulkOps.length > 0) {
    await esBulk(bulkOps);
  }
  return NextResponse.json({ ok: true, indexedDocs: bulkOps.length / 2 });
}
