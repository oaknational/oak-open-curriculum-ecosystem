/**
 * Response augmentation with canonical URLs
 *
 * Pure function that augments API responses with canonical URLs
 * based on content type and available context.
 */

/* eslint-disable complexity */

import { generateCanonicalUrlWithContext } from './types/generated/api-schema/routing/url-helpers.js';
import type { ResponseContext, ContentType } from './types/response-augmentation.js';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/mcp-logger';
import type { HttpMethod } from './validation/types.js';

// Module-level logger for warnings (browser-compatible)
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('WARN'),
  resourceAttributes: buildResourceAttributes({}, 'response-augmentation', '1.0.0'),
  context: {},
  stdoutSink: {
    write: (line: string) => {
      console.log(line);
    },
  },
  fileSink: null,
});

function isReadonlyStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

/**
 * Extracts context from response data for units and subjects
 */
function extractContextFromResponse(response: unknown): ResponseContext {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return {};
  }

  const context: ResponseContext = {};

  // Extract unit context from response data
  if ('subjectSlug' in response && 'phaseSlug' in response) {
    context.unit = {
      subjectSlug: typeof response.subjectSlug === 'string' ? response.subjectSlug : undefined,
      phaseSlug: typeof response.phaseSlug === 'string' ? response.phaseSlug : undefined,
    };
  }

  // Extract subject context from response data
  if ('keyStageSlugs' in response && isReadonlyStringArray(response.keyStageSlugs)) {
    context.subject = {
      keyStageSlugs: response.keyStageSlugs,
    };
  }

  return context;
}

/**
 * Determines content type from API path
 *
 * Recognises paths for:
 * - Single entity endpoints (e.g., /lessons/{lesson}/summary)
 * - Search endpoints (e.g., /search/lessons, /search/transcripts)
 * - Key-stage scoped endpoints (e.g., /key-stages/{ks}/subjects/{subj}/lessons)
 */
function getContentTypeFromPath(path: string): ContentType | undefined {
  // Search endpoints - must check before /subjects/ to avoid false matches
  if (path === '/search/lessons' || path === '/search/transcripts') {
    return 'lesson';
  }

  // Key-stage scoped endpoints - check the suffix to determine content type
  if (path.includes('/key-stages/') && path.includes('/subjects/')) {
    if (path.endsWith('/lessons')) {
      return 'lesson';
    }
    if (path.endsWith('/units')) {
      return 'unit';
    }
  }

  // Single entity endpoints
  if (path.includes('/lessons/')) {
    return 'lesson';
  }
  if (path.includes('/units/')) {
    return 'unit';
  }
  if (path.includes('/subjects/')) {
    return 'subject';
  }
  if (path.includes('/sequences/')) {
    return 'sequence';
  }
  if (path.includes('/threads/')) {
    return 'thread';
  }
  return undefined;
}

/**
 * Checks if the path is an array endpoint (returns multiple items)
 */
function isArrayEndpointPath(path: string): boolean {
  return (
    path === '/search/lessons' ||
    path === '/search/transcripts' ||
    (path.includes('/key-stages/') && (path.endsWith('/lessons') || path.endsWith('/units')))
  );
}

/**
 * Extracts ID from response data or path
 *
 * For array endpoints, only extracts from response data (each item must have its own slug).
 * For single-entity endpoints, falls back to path extraction if response data lacks ID.
 */
function extractIdFromResponse(response: unknown, path: string): string | undefined {
  const contentType = getContentTypeFromPath(path);
  // Try to extract ID from response data first, passing content type for context
  const idFromResponse = extractIdFromResponseData(response, contentType);
  if (idFromResponse) {
    return idFromResponse;
  }

  // Only use path fallback for single-entity endpoints
  if (isArrayEndpointPath(path)) {
    return undefined;
  }

  // Fallback to path extraction for single-entity endpoints
  return extractIdFromPath(response, path);
}

/**
 * Extracts ID from response data
 *
 * Checks for generic slug/id fields first, then content-type-specific slug fields.
 * Only extracts entity-specific slugs when the content type matches.
 */
function extractIdFromResponseData(
  response: unknown,
  contentType: ContentType | undefined,
): string | undefined {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    // Generic fields take priority
    if ('slug' in response && typeof response.slug === 'string') {
      return response.slug;
    }
    if ('id' in response && typeof response.id === 'string') {
      return response.id;
    }
    // Content-type-specific slug fields
    if (contentType === 'lesson') {
      const v = 'lessonSlug' in response ? response.lessonSlug : undefined;
      if (typeof v === 'string') {
        return v;
      }
    }
    if (contentType === 'unit') {
      const v = 'unitSlug' in response ? response.unitSlug : undefined;
      if (typeof v === 'string') {
        return v;
      }
    }
    if (contentType === 'sequence') {
      const v = 'sequenceSlug' in response ? response.sequenceSlug : undefined;
      if (typeof v === 'string') {
        return v;
      }
    }
  }
  return undefined;
}

/**
 * Extracts ID from path as fallback
 */
function extractIdFromPath(response: unknown, path: string): string | undefined {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const pathParts = path.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart !== '') {
      return lastPart;
    }
  }
  return undefined;
}

/** Augments an array response with canonical URL on each item */
export function augmentArrayResponseWithCanonicalUrl<TItem extends object>(
  response: TItem[],
  path: string,
  method: HttpMethod,
): (TItem & { canonicalUrl?: string })[] {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return response.map((item) => ({
    ...item,
    ...extractCanonicalUrlFields(item, path, contentType),
  }));
}

/** Augments a single object response with canonical URL */
export function augmentResponseWithCanonicalUrl<T extends object>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { canonicalUrl?: string } {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return Object.assign({}, response, extractCanonicalUrlFields(response, path, contentType));
}

function extractCanonicalUrlFields(
  response: object,
  path: string,
  contentType: ContentType,
): { canonicalUrl?: string } {
  const id = extractIdFromResponse(response, path);
  if (!id) {
    logger.warn(`Could not extract ID from response`, { path, contentType });
    return {};
  }
  const context = extractContextFromResponse(response);
  const canonicalUrl = generateCanonicalUrlWithContext(contentType, id, context);
  if (!canonicalUrl) {
    logger.warn(`Could not generate canonical URL`, { contentType, id, context });
    return {};
  }
  return { canonicalUrl };
}
