import { createOakClient } from '@oaknational/curriculum-sdk';

/** Lightweight wrapper around the free `/rate-limit` endpoint. */
export async function getRateLimit(apiKey: string): Promise<unknown> {
  const client = createOakClient(apiKey);
  const res = await client.GET('/rate-limit');
  return res.data ?? null;
}
