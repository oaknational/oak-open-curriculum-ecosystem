import { createOakClient } from '@oaknational/curriculum-sdk';
import { env } from './env';

/** Lightweight wrapper around the free `/rate-limit` endpoint. */
export async function getRateLimit(): Promise<unknown> {
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);
  const res = await client.GET('/rate-limit');
  return res.data ?? null;
}
