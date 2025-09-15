import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '../../../../src/lib/env';
import { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

const BodySchema = z.object({
  q: z.string().min(1),
  keyStage: z.string().optional(),
  subject: z.string().optional(),
  unit: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export async function POST(req: NextRequest): Promise<Response> {
  const parseBody = async () => BodySchema.safeParse(await req.json());
  function toOptional<T extends string>(guard: (v: string) => v is T, v?: string): T | undefined {
    if (typeof v !== 'string' || v.length === 0) return undefined;
    if (guard(v)) return v;
    return undefined;
  }
  const coerceNum = (v: unknown, d: number) => (typeof v === 'number' ? v : d);

  const parsed = await parseBody();
  if (!parsed.success)
    return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });

  const body = parsed.data;
  const client = createOakPathBasedClient(env().OAK_EFFECTIVE_KEY);

  const keyStage = toOptional(isKeyStage, body.keyStage);
  const subject = toOptional(isSubject, body.subject);
  const unit = typeof body.unit === 'string' && body.unit.length > 0 ? body.unit : undefined;

  const res = await client['/search/lessons'].GET({
    params: {
      query: {
        q: body.q,
        keyStage,
        subject,
        unit,
        limit: coerceNum(body.limit, 20),
        offset: coerceNum(body.offset, 0),
      },
    },
  });

  if (!res.response.ok)
    return NextResponse.json({ error: res.response.statusText }, { status: res.response.status });
  return NextResponse.json(res.data ?? []);
}
