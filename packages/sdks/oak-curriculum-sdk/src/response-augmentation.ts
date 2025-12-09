<<<<<<< HEAD
/**
 * Response augmentation with canonical URLs
 *
 * Pure function that augments API responses with canonical URLs
 * based on content type and available context.
 */
/* eslint-disable complexity */ // REFACTOR
=======
/** Pure function that augments API responses with canonical URLs. */

>>>>>>> 4655543e (fix(type-safety): eliminate type shortcuts and improve error messages)
import { generateCanonicalUrlWithContext } from './types/generated/api-schema/routing/url-helpers.js';
import type { ResponseContext, ContentType } from './types/response-augmentation.js';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/mcp-logger';
import type { HttpMethod } from './validation/types.js';
import {
  getContentTypeFromPath,
  extractGenericId,
  extractContentTypeSpecificId,
} from './response-augmentation-helpers.js';

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

interface UnitContext {
  readonly subjectSlug?: string;
  readonly phaseSlug?: string;
}

interface SubjectContext {
  readonly keyStageSlugs: readonly string[];
}

/**
 * Extracts unit context from response data
 */
function extractUnitContext(response: object): UnitContext | undefined {
  if ('subjectSlug' in response && 'phaseSlug' in response) {
    return {
      subjectSlug: typeof response.subjectSlug === 'string' ? response.subjectSlug : undefined,
      phaseSlug: typeof response.phaseSlug === 'string' ? response.phaseSlug : undefined,
    };
  }
  return undefined;
}

/**
 * Extracts subject context from response data
 */
function extractSubjectContext(response: object): SubjectContext | undefined {
  if ('keyStageSlugs' in response && isReadonlyStringArray(response.keyStageSlugs)) {
    return { keyStageSlugs: response.keyStageSlugs };
  }
  return undefined;
}

/**
 * Extracts context from response data for units and subjects
 */
function extractContextFromResponse(response: unknown): ResponseContext {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return {};
  }

  const context: ResponseContext = {};

  const unit = extractUnitContext(response);
  if (unit) {
    context.unit = unit;
  }

  const subject = extractSubjectContext(response);
  if (subject) {
    context.subject = subject;
  }

  return context;
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
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return undefined;
  }

  return extractGenericId(response) ?? extractContentTypeSpecificId(response, contentType);
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
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
export function augmentArrayResponseWithCanonicalUrl<TItem extends object>(
  response: TItem[],
  path: string,
  method: HttpMethod,
): (TItem & { canonicalUrl?: string | null })[] {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return response.map((item) => {
    return { ...item, ...extractCanonicalUrlFields(item, path, contentType) };
  });
}

/** Augments a single object response with canonical URL */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
export function augmentResponseWithCanonicalUrl<T extends object>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { canonicalUrl?: string | null } {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return Object.assign({}, response, extractCanonicalUrlFields(response, path, contentType));
}

/**
 * Extracts canonical URL fields from a response
 * @param response - The response to extract canonical URL fields from
 * @param path - The path to extract canonical URL fields from
 * @param contentType - The content type to extract canonical URL fields from
 * @returns The canonical URL fields for the response, which is null for threads (no website equivalent)
 * @throws An error if the content type is unsupported or no result is generated
 *
 * @todo Refactor to return a Result<string, Error> instead of throwing errors
 */
function extractCanonicalUrlFields(
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  response: object,
  path: string,
  contentType: ContentType,
): { canonicalUrl: string | null } {
  // Idempotent: preserve existing canonicalUrl
  if ('canonicalUrl' in response && typeof response.canonicalUrl === 'string') {
    return { canonicalUrl: response.canonicalUrl };
  }
  const id = extractIdFromResponse(response, path);
  if (!id) {
    const message = `Could not extract ID for path: ${path} from response: ${JSON.stringify(response)}`;
    logger.error(message);
    throw new TypeError(message);
  }
  const context = extractContextFromResponse(response);
  const canonicalUrl = generateCanonicalUrlWithContext(contentType, id, context);
  return { canonicalUrl };
}
