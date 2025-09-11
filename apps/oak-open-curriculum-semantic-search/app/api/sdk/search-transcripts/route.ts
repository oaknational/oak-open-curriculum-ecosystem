import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '../../../../src/lib/env';
import { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

const BodySchema = z.object({
  q: z.string().min(1),
  keyStage: z.string().optional(),
  subject: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
  const body = parsed.data;
  const e = env();
  const client = createOakPathBasedClient(e.OAK_EFFECTIVE_KEY);

  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;

  const res = await client['/search/transcripts'].GET({
    params: {
      query: {
        q: body.q,
        keyStage,
        subject,
      },
    },
  });

  if (!res.response.ok)
    return NextResponse.json({ error: res.response.statusText }, { status: res.response.status });
  return NextResponse.json(res.data ?? []);
}
