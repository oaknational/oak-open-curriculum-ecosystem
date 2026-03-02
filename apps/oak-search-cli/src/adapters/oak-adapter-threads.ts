/**
 * Thread-related API client functions.
 *
 * Separated from `../../adapters/oak-adapter.ts` to keep file size manageable per rules.md.
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 *
 * @remarks
 * See `docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`
 * for the full architectural decision record.
 */

import type { OakApiClient, SdkFetchError } from '@oaknational/curriculum-sdk';
import { classifyHttpError } from '@oaknational/curriculum-sdk';
import { ok, err, type Result } from '@oaknational/result';

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
 * Thread unit data from the /threads/\{threadSlug\}/units API endpoint.
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
 * Public shape for listing all threads. Returns Result per ADR-088.
 */
export type GetAllThreadsFn = () => Promise<Result<readonly ThreadEntry[], SdkFetchError>>;

/**
 * Public shape for getting units belonging to a thread. Returns Result per ADR-088.
 */
export type GetThreadUnitsFn = (
  threadSlug: string,
) => Promise<Result<readonly ThreadUnitEntry[], SdkFetchError>>;

/**
 * Creates a function to fetch all curriculum threads.
 * Returns Result per ADR-088.
 */
export function makeGetAllThreads(client: Pick<OakApiClient, 'GET'>): GetAllThreadsFn {
  return async () => {
    const res = await client.GET('/threads', {});
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, 'threads', 'other', res.response.statusText),
      );
    }
    const data = res.data ?? [];
    return ok(
      data.map((thread) => ({
        slug: thread.slug,
        title: thread.title,
        canonicalUrl: thread.canonicalUrl,
      })),
    );
  };
}

/**
 * Creates a function to fetch units for a specific thread.
 * Returns Result per ADR-088.
 */
export function makeGetThreadUnits(client: Pick<OakApiClient, 'GET'>): GetThreadUnitsFn {
  return async (threadSlug) => {
    const res = await client.GET('/threads/{threadSlug}/units', {
      params: { path: { threadSlug } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, threadSlug, 'other', res.response.statusText),
      );
    }
    const data = res.data ?? [];
    return ok(
      data.map((unit) => ({
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        unitOrder: unit.unitOrder,
        canonicalUrl: unit.canonicalUrl,
      })),
    );
  };
}
