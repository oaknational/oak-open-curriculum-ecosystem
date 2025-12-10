/**
 * @module oak-adapter-sdk-threads
 * @description Thread-related API client functions.
 *
 * Separated from oak-adapter-sdk.ts to keep file size manageable.
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';

/**
 * Thread data from the /threads API endpoint.
 * Note: canonicalUrl is always null for threads since they are data concepts
 * without corresponding pages on the website.
 */
export interface ThreadEntry {
  readonly slug: string;
  readonly title: string;
  readonly canonicalUrl?: null;
}

/**
 * Thread unit data from the /threads/{threadSlug}/units API endpoint.
 * Note: canonicalUrl is always null for thread units since they are data concepts
 * without corresponding pages on the website.
 */
export interface ThreadUnitEntry {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly unitOrder: number;
  readonly canonicalUrl?: null;
}

/**
 * Public shape for listing all threads.
 */
export type GetAllThreadsFn = () => Promise<readonly ThreadEntry[]>;

/**
 * Public shape for getting units belonging to a thread.
 */
export type GetThreadUnitsFn = (threadSlug: string) => Promise<readonly ThreadUnitEntry[]>;

/**
 * Asserts that an SDK response was successful.
 */
function assertSdkOk(res: { response: Response }): void {
  if (!res.response.ok) {
    const status = String(res.response.status);
    const statusText = res.response.statusText;
    const message = statusText
      ? `SDK request failed: ${status} ${statusText}`
      : `SDK request failed: ${status}`;
    throw new Error(message);
  }
}

/**
 * Creates a function to fetch all curriculum threads.
 */
export function makeGetAllThreads(client: OakApiClient): GetAllThreadsFn {
  return async () => {
    const res = await client.GET('/threads', {});
    assertSdkOk(res);
    const data = res.data ?? [];
    return data.map((thread) => ({
      slug: thread.slug,
      title: thread.title,
      canonicalUrl: thread.canonicalUrl,
    }));
  };
}

/**
 * Creates a function to fetch units for a specific thread.
 */
export function makeGetThreadUnits(client: OakApiClient): GetThreadUnitsFn {
  return async (threadSlug) => {
    const res = await client.GET('/threads/{threadSlug}/units', {
      params: { path: { threadSlug } },
    });
    assertSdkOk(res);
    const data = res.data ?? [];
    return data.map((unit) => ({
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      unitOrder: unit.unitOrder,
      canonicalUrl: unit.canonicalUrl,
    }));
  };
}
