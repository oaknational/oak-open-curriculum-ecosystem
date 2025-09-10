import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { env } from '@lib/env';

/** Lightweight wrapper around the free `/rate-limit` endpoint. */
export async function getRateLimit() {
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);
  const res = await client.GET('/rate-limit');
  return res.data ?? null;
}
