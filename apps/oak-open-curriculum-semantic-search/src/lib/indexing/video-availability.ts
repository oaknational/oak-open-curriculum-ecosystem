/**
 * Video availability detection for efficient transcript fetching.
 *
 * Uses the bulk `/key-stages/{ks}/subject/{subject}/assets` endpoint to
 * determine which lessons have videos BEFORE fetching individual transcripts.
 * This eliminates 404 errors and wasted API calls for lessons without videos.
 *
 * @see efficient-api-traversal.md for the full plan
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/oak-curriculum-sdk';
import { ok } from '@oaknational/result';
import type { SubjectAssetEntry } from '../../adapters/oak-adapter-types';
import type { OakClient } from '../../adapters/oak-adapter';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { ingestLogger } from '../logger';

/**
 * Video availability information for a subject/keystage.
 * Built from bulk assets endpoint data.
 */
export interface VideoAvailabilityMap {
  /**
   * Check if a lesson has a video.
   * Returns false for unknown lessons.
   */
  readonly hasVideo: (lessonSlug: string) => boolean;
  /** Total lessons in the assets response. */
  readonly totalLessons: number;
  /** Count of lessons with videos. */
  readonly lessonsWithVideo: number;
  /** All lesson slugs from assets endpoint (for cross-reference). */
  readonly lessonSlugs: ReadonlySet<string>;
}

/**
 * Checks if an asset entry has a video.
 * A lesson has a video if any of its assets has type "video".
 */
function lessonHasVideo(entry: SubjectAssetEntry): boolean {
  return entry.assets.some((asset) => asset.type === 'video');
}

/**
 * Builds video availability map from subject assets data.
 *
 * Pure function - takes data, returns map. No I/O.
 *
 * @param assets - Array of asset entries from bulk assets endpoint
 * @returns Video availability map with lookup functions and statistics
 *
 * @example
 * ```typescript
 * const assets = await client.getSubjectAssets('ks4', 'computing');
 * if (assets.ok) {
 *   const videoMap = buildVideoAvailabilityMapFromAssets(assets.value);
 *   console.log(`${videoMap.lessonsWithVideo}/${videoMap.totalLessons} have videos`);
 * }
 * ```
 */
export function buildVideoAvailabilityMapFromAssets(
  assets: readonly SubjectAssetEntry[],
): VideoAvailabilityMap {
  const videoLessonSlugs = new Set<string>();
  const allLessonSlugs = new Set<string>();

  for (const entry of assets) {
    allLessonSlugs.add(entry.lessonSlug);
    if (lessonHasVideo(entry)) {
      videoLessonSlugs.add(entry.lessonSlug);
    }
  }

  return {
    hasVideo: (lessonSlug: string) => videoLessonSlugs.has(lessonSlug),
    totalLessons: allLessonSlugs.size,
    lessonsWithVideo: videoLessonSlugs.size,
    lessonSlugs: allLessonSlugs,
  };
}

/**
 * Fetches assets and builds video availability map.
 *
 * Orchestration function that calls the OakClient and builds the map.
 * Logs statistics about video availability.
 *
 * @param client - Oak client instance
 * @param keyStage - Key stage to fetch assets for
 * @param subject - Subject to fetch assets for
 * @returns Result containing video availability map or error
 */
export async function fetchVideoAvailabilityMap(
  client: OakClient,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
): Promise<Result<VideoAvailabilityMap, SdkFetchError>> {
  ingestLogger.info('Fetching video availability map', { keyStage, subject });

  const result = await client.getSubjectAssets(keyStage, subject);

  if (!result.ok) {
    ingestLogger.error('Failed to fetch subject assets for video availability', {
      keyStage,
      subject,
      error: result.error,
    });
    return result;
  }

  const videoMap = buildVideoAvailabilityMapFromAssets(result.value);

  ingestLogger.info('Built video availability map', {
    keyStage,
    subject,
    totalLessons: videoMap.totalLessons,
    lessonsWithVideo: videoMap.lessonsWithVideo,
    percentageWithVideo:
      videoMap.totalLessons > 0
        ? Math.round((videoMap.lessonsWithVideo / videoMap.totalLessons) * 100)
        : 0,
  });

  return ok(videoMap);
}
