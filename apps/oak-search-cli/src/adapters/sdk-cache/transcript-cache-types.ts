/**
 * Transcript cache categorization types.
 *
 * Provides structured cache entries to distinguish WHY a transcript
 * is or isn't available, enabling observability during ingestion.
 *
 * ## Cache Entry Statuses
 *
 * | Status | Meaning | Cached? |
 * |--------|---------|---------|
 * | `available` | Transcript data exists | Yes |
 * | `no_video` | Lesson has no video asset | Yes |
 * | `not_found` | API 404 or empty response | Yes |
 *
 * **Note**: Transient errors (5xx, network) are NOT cached to allow retry.
 *
 * @see ADR-092 Transcript Cache Categorization Strategy
 * @see {@link TranscriptCacheEntry} for the main type
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Possible statuses for cached transcript entries.
 *
 * | Status | Meaning | When Used |
 * |--------|---------|-----------|
 * | `available` | Transcript data exists | API 200 with content |
 * | `no_video` | Lesson has no video asset | `hasVideo === false` from assets endpoint |
 * | `not_found` | API 404 or empty response | TPC-blocked, missing, or empty transcript |
 *
 * **Note**: Transient errors (5xx, network) are NOT cached to allow retry.
 */
export type TranscriptCacheStatus = 'available' | 'no_video' | 'not_found';

/**
 * Structured cache entry for transcript availability.
 *
 * Uses discriminated union pattern for type-safe status handling.
 * Each variant contains only the fields relevant to that status.
 *
 * @example Available transcript
 * ```typescript
 * const available: TranscriptCacheEntry = {
 *   status: 'available',
 *   transcript: 'Welcome to today\'s lesson on fractions.',
 *   vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nWelcome...'
 * };
 * ```
 *
 * @example No video asset (from bulk assets endpoint)
 * ```typescript
 * const noVideo: TranscriptCacheEntry = { status: 'no_video' };
 * ```
 *
 * @example API 404 or empty response
 * ```typescript
 * const notFound: TranscriptCacheEntry = { status: 'not_found' };
 * ```
 */
export type TranscriptCacheEntry =
  | TranscriptCacheEntryAvailable
  | TranscriptCacheEntryNoVideo
  | TranscriptCacheEntryNotFound;

/**
 * Cache entry for an available transcript.
 * Contains the full transcript text and VTT caption data.
 */
export interface TranscriptCacheEntryAvailable {
  /** Discriminant for available transcript. */
  readonly status: 'available';
  /** The transcript text content. */
  readonly transcript: string;
  /** WebVTT caption data for video synchronization. */
  readonly vtt: string;
}

/**
 * Cache entry indicating the lesson has no video asset.
 * Determined from the bulk assets endpoint (`hasVideo === false`).
 */
export interface TranscriptCacheEntryNoVideo {
  /** Discriminant for no video asset. */
  readonly status: 'no_video';
}

/**
 * Cache entry indicating the transcript was not found.
 * Used for API 404 responses and empty transcript responses (200 with no content).
 */
export interface TranscriptCacheEntryNotFound {
  /** Discriminant for not found / empty transcript. */
  readonly status: 'not_found';
}

// =============================================================================
// Type Guards
// =============================================================================

/** Minimal shape for status checking. @internal */
interface MaybeStatusObject {
  readonly status?: unknown;
  readonly transcript?: unknown;
  readonly vtt?: unknown;
}

/** Check if value is a non-null object (not an array). @internal */
function isNonNullObject(value: unknown): value is MaybeStatusObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Check if the object has a valid status field. @internal */
function hasValidStatus(obj: MaybeStatusObject): obj is { status: TranscriptCacheStatus } {
  const s = obj.status;
  return s === 'available' || s === 'no_video' || s === 'not_found';
}

/** Check if the object has required fields for 'available' status. @internal */
function hasAvailableFields(obj: MaybeStatusObject): obj is TranscriptCacheEntryAvailable {
  return typeof obj.transcript === 'string' && typeof obj.vtt === 'string';
}

/**
 * Type guard to validate a TranscriptCacheEntry.
 *
 * Validates the discriminated union structure, ensuring:
 * - Object has a valid `status` field
 * - For `available` status, `transcript` and `vtt` are present strings
 *
 * @param value - Value to check
 * @returns true if value is a valid TranscriptCacheEntry
 *
 * @example
 * ```typescript
 * const cached = await redis.get(key);
 * const parsed = JSON.parse(cached);
 * if (isTranscriptCacheEntry(parsed)) {
 *   // TypeScript knows parsed is TranscriptCacheEntry
 *   if (parsed.status === 'available') {
 *     return parsed.transcript;
 *   }
 * }
 * ```
 */
export function isTranscriptCacheEntry(value: unknown): value is TranscriptCacheEntry {
  if (!isNonNullObject(value)) {
    return false;
  }
  if (!hasValidStatus(value)) {
    return false;
  }
  // For 'available' status, require transcript and vtt fields
  if (value.status === 'available') {
    return hasAvailableFields(value);
  }
  // For 'no_video' and 'not_found', no additional fields required
  return true;
}

// =============================================================================
// Serialization
// =============================================================================

/**
 * Serialize a TranscriptCacheEntry to JSON string for Redis storage.
 *
 * @param entry - The cache entry to serialize
 * @returns JSON string representation
 *
 * @example
 * ```typescript
 * const entry: TranscriptCacheEntry = { status: 'no_video' };
 * const json = serializeTranscriptCacheEntry(entry);
 * await redis.setex(key, ttl, json);
 * ```
 */
export function serializeTranscriptCacheEntry(entry: TranscriptCacheEntry): string {
  return JSON.stringify(entry);
}

/**
 * Deserialize a cached string to TranscriptCacheEntry.
 *
 * @param cached - Raw string from Redis cache (or null if not found)
 * @returns Parsed TranscriptCacheEntry, or null if invalid/missing
 *
 * @example
 * ```typescript
 * const cached = await redis.get(key);
 * const entry = deserializeTranscriptCacheEntry(cached);
 * if (entry === null) {
 *   // Cache miss or invalid data
 * } else if (entry.status === 'available') {
 *   return entry.transcript;
 * }
 * ```
 */
export function deserializeTranscriptCacheEntry(
  cached: string | null,
): TranscriptCacheEntry | null {
  if (cached === null || cached === '') {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cached);
  } catch {
    return null;
  }

  if (isTranscriptCacheEntry(parsed)) {
    return parsed;
  }

  return null;
}
