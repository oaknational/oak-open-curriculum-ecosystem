import { NextRequest, NextResponse } from 'next/server';
import { env } from '@lib/env';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '@adapters/sdk-guards';

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as { q: string; keyStage?: string; subject?: string };
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);

  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;

  const res = await client.GET('/search/transcripts', {
    params: {
      query: {
        q: body.q,
        keyStage,
        subject,
      },
    },
  });

  if (res.error) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data ?? []);
}
