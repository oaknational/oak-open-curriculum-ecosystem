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
 */
function getContentTypeFromPath(path: string): ContentType | undefined {
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
 * Extracts ID from response data or path
 */
function extractIdFromResponse(response: unknown, path: string): string | undefined {
  // Try to extract ID from response data first
  const idFromResponse = extractIdFromResponseData(response);
  if (idFromResponse) {
    return idFromResponse;
  }

  // Fallback to path extraction
  return extractIdFromPath(response, path);
}

/**
 * Extracts ID from response data
 */
function extractIdFromResponseData(response: unknown): string | undefined {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    if ('slug' in response && typeof response.slug === 'string') {
      return response.slug;
    }
    if ('id' in response && typeof response.id === 'string') {
      return response.id;
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

/**
 * Augments response with canonical URL
 *
 * Returns the same response type, augmented with an optional canonicalUrl.
 */
export function augmentResponseWithCanonicalUrl<T extends object>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { canonicalUrl?: string } {
  // Only process GET requests
  if (method !== 'get') {
    return response;
  }

  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }

  const id = extractIdFromResponse(response, path);
  if (!id) {
    logger.warn(`Could not extract ID from response`, { path, contentType });
    return response;
  }

  const context = extractContextFromResponse(response);
  const canonicalUrl = generateCanonicalUrlWithContext(contentType, id, context);

  if (!canonicalUrl) {
    logger.warn(`Could not generate canonical URL`, { contentType, id, context });
    return response;
  }

  const augmented: T & { canonicalUrl: string } = { ...response, canonicalUrl };
  return augmented;
}
