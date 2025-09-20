/**
 * Response augmentation with canonical URLs
 *
 * Pure function that augments API responses with canonical URLs
 * based on content type and available context.
 */

/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-restricted-types */
/* eslint-disable complexity */

import { generateCanonicalUrlWithContext } from './types/generated/api-schema/routing/url-helpers.js';
import type {
  ResponseWithCanonicalUrl,
  ResponseContext,
  ContentType,
} from './types/response-augmentation.js';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

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
  if ('keyStageSlugs' in response && Array.isArray(response.keyStageSlugs)) {
    context.subject = {
      keyStageSlugs: response.keyStageSlugs as readonly string[],
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
 * Pure function that takes a response and returns it augmented with canonical URL
 * if the content type and context allow for URL generation.
 */
export function augmentResponseWithCanonicalUrl(
  response: unknown,
  path: string,
  method: string,
): ResponseWithCanonicalUrl {
  // Only process GET requests
  if (method.toLowerCase() !== 'get') {
    return response as ResponseWithCanonicalUrl;
  }

  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response as ResponseWithCanonicalUrl;
  }

  const id = extractIdFromResponse(response, path);
  if (!id) {
    const logger = createAdaptiveLogger({ name: 'response-augmentation' });
    logger.warn(`Could not extract ID from response`, { path, contentType });
    return response as ResponseWithCanonicalUrl;
  }

  const context = extractContextFromResponse(response);
  const canonicalUrl = generateCanonicalUrlWithContext(contentType, id, context);

  if (!canonicalUrl) {
    const logger = createAdaptiveLogger({ name: 'response-augmentation' });
    logger.warn(`Could not generate canonical URL`, { contentType, id, context });
    return response as ResponseWithCanonicalUrl;
  }

  return {
    ...(response as Record<string, unknown>),
    canonicalUrl,
  };
}
