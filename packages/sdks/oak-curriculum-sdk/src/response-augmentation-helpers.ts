/** Helper functions for response augmentation - ID and path extraction. */

import type { ContentType } from './types/response-augmentation.js';

/**
 * Checks if path is a search endpoint
 */
export function isSearchEndpoint(path: string): ContentType | undefined {
  if (path === '/search/lessons' || path === '/search/transcripts') {
    return 'lesson';
  }
  return undefined;
}

/**
 * Checks if path is a key-stage scoped endpoint
 */
export function isKeyStageScopedEndpoint(path: string): ContentType | undefined {
  if (!path.includes('/key-stages/') || !path.includes('/subjects/')) {
    return undefined;
  }
  if (path.endsWith('/lessons')) {
    return 'lesson';
  }
  if (path.endsWith('/units')) {
    return 'unit';
  }
  return undefined;
}

/**
 * Checks if path is a single entity endpoint.
 *
 * Note: Order matters for paths like `/subjects/{subject}/sequences` which
 * contains both `/subjects/` and ends with `/sequences`. We prioritise based
 * on what the endpoint actually returns.
 */
export function isSingleEntityEndpoint(path: string): ContentType | undefined {
  if (path.includes('/lessons/')) {
    return 'lesson';
  }
  if (path.includes('/units/')) {
    return 'unit';
  }
  if (path.includes('/sequences/')) {
    return 'sequence';
  }
  // /subjects/{subject}/sequences returns sequences, not subjects
  // Check for sequences endpoint before subjects
  if (path.endsWith('/sequences')) {
    return 'sequence';
  }
  if (path.includes('/subjects/')) {
    return 'subject';
  }
  if (path.includes('/threads/')) {
    return 'thread';
  }
  return undefined;
}

/**
 * Determines content type from API path
 *
 * Recognises paths for:
 * - Single entity endpoints (e.g., /lessons/{lesson}/summary)
 * - Search endpoints (e.g., /search/lessons, /search/transcripts)
 * - Key-stage scoped endpoints (e.g., /key-stages/{ks}/subjects/{subj}/lessons)
 */
export function getContentTypeFromPath(path: string): ContentType | undefined {
  return isSearchEndpoint(path) ?? isKeyStageScopedEndpoint(path) ?? isSingleEntityEndpoint(path);
}

/**
 * Extracts lesson slug from response
 */
export function extractLessonSlug(response: object): string | undefined {
  if ('lessonSlug' in response) {
    return typeof response.lessonSlug === 'string' ? response.lessonSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts unit slug from response
 */
export function extractUnitSlug(response: object): string | undefined {
  if ('unitSlug' in response) {
    return typeof response.unitSlug === 'string' ? response.unitSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts subject slug from response
 */
export function extractSubjectSlug(response: object): string | undefined {
  if ('subjectSlug' in response) {
    return typeof response.subjectSlug === 'string' ? response.subjectSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts sequence slug from response
 */
export function extractSequenceSlug(response: object): string | undefined {
  if ('sequenceSlug' in response) {
    return typeof response.sequenceSlug === 'string' ? response.sequenceSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts thread slug from response
 */
export function extractThreadSlug(response: object): string | undefined {
  if ('threadSlug' in response) {
    return typeof response.threadSlug === 'string' ? response.threadSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts content-type-specific ID from response
 */
export function extractContentTypeSpecificId(
  response: object,
  contentType: ContentType | undefined,
): string | undefined {
  if (contentType === 'lesson') {
    return extractLessonSlug(response);
  }
  if (contentType === 'unit') {
    return extractUnitSlug(response);
  }
  if (contentType === 'subject') {
    return extractSubjectSlug(response);
  }
  if (contentType === 'sequence') {
    return extractSequenceSlug(response);
  }
  if (contentType === 'thread') {
    return extractThreadSlug(response);
  }
  return undefined;
}

/**
 * Extracts generic ID fields (slug or id) from response
 */
export function extractGenericId(response: object): string | undefined {
  if ('slug' in response && typeof response.slug === 'string') {
    return response.slug;
  }
  if ('id' in response && typeof response.id === 'string') {
    return response.id;
  }
  return undefined;
}
