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
 *
 * IMPORTANT: The assets endpoint returns incomplete data (~15-35% of lessons).
 * See 00-overview-and-known-issues.md "Subject Assets Endpoint Returns Incomplete Lesson Data".
 * The hasVideo function returns `undefined` for lessons not in the assets response,
 * which causes transcript fetching to use the safe default (fetch transcript).
 */
export interface VideoAvailabilityMap {
  /**
   * Check if a lesson has a video.
   *
   * Returns:
   * - `true` if lesson is in assets response and has video asset
   * - `false` if lesson is in assets response but has no video asset
   * - `undefined` if lesson is NOT in assets response (unknown - use safe default)
   *
   * IMPORTANT: Due to upstream API bug, the assets endpoint returns only ~15-35%
   * of lessons. Most lessons will return `undefined`. Callers should treat
   * `undefined` as "assume video exists" (safe default to avoid missing transcripts).
   */
  readonly hasVideo: (lessonSlug: string) => boolean | undefined;
  /** Total lessons in the assets response (may be incomplete!). */
  readonly totalLessons: number;
  /** Count of lessons with videos in the response. */
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
    hasVideo: (lessonSlug: string): boolean | undefined => {
      // If lesson is not in the assets response at all, return undefined
      // This signals "unknown" - caller should use safe default (assume video exists)
      if (!allLessonSlugs.has(lessonSlug)) {
        return undefined;
      }
      // Lesson is in assets response - return whether it has a video
      return videoLessonSlugs.has(lessonSlug);
    },
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

// ============================================================================
// Report Generation (uses same code as ingestion)
// ============================================================================

/**
 * Video availability statistics for a single subject/keystage combination.
 */
export interface VideoAvailabilityStats {
  readonly subject: SearchSubjectSlug;
  readonly keyStage: KeyStage;
  readonly totalLessons: number;
  readonly lessonsWithVideo: number;
  readonly lessonsWithoutVideo: number;
  readonly percentageWithVideo: number;
}

/**
 * Full video availability report across all subjects and key stages.
 */
export interface VideoAvailabilityReport {
  readonly stats: readonly VideoAvailabilityStats[];
  readonly totals: {
    readonly totalLessons: number;
    readonly lessonsWithVideo: number;
    readonly lessonsWithoutVideo: number;
    readonly percentageWithVideo: number;
  };
}

/**
 * Generates a video availability report for all subject/keystage combinations.
 *
 * Reuses the same fetchVideoAvailabilityMap function used during ingestion.
 *
 * @param client - Oak client instance
 * @param subjects - Subjects to check
 * @param keyStages - Key stages to check
 * @returns Report with statistics for each combination
 */
export async function generateVideoAvailabilityReport(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
  keyStages: readonly KeyStage[],
): Promise<VideoAvailabilityReport> {
  const stats: VideoAvailabilityStats[] = [];

  for (const subject of subjects) {
    for (const keyStage of keyStages) {
      const result = await fetchVideoAvailabilityMap(client, keyStage, subject);
      if (!result.ok) {
        continue;
      } // Silently skip (logged by fetchVideoAvailabilityMap)

      const map = result.value;
      if (map.totalLessons === 0) {
        continue;
      }

      stats.push({
        subject,
        keyStage,
        totalLessons: map.totalLessons,
        lessonsWithVideo: map.lessonsWithVideo,
        lessonsWithoutVideo: map.totalLessons - map.lessonsWithVideo,
        percentageWithVideo:
          map.totalLessons > 0 ? Math.round((map.lessonsWithVideo / map.totalLessons) * 100) : 0,
      });
    }
  }

  const totalLessons = stats.reduce((sum, s) => sum + s.totalLessons, 0);
  const lessonsWithVideo = stats.reduce((sum, s) => sum + s.lessonsWithVideo, 0);

  return {
    stats,
    totals: {
      totalLessons,
      lessonsWithVideo,
      lessonsWithoutVideo: totalLessons - lessonsWithVideo,
      percentageWithVideo:
        totalLessons > 0 ? Math.round((lessonsWithVideo / totalLessons) * 100) : 0,
    },
  };
}
