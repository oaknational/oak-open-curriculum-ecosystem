/**
 * Response augmentation with Oak URLs
 *
 * Pure function that augments API responses with Oak URLs (direct,
 * slug-based resource URLs) based on content type and available context.
 * The upstream's `canonicalUrl` (context-rich curriculum URL) passes
 * through untouched.
 */
import {
  CONTENT_TYPE_PREFIXES,
  generateOakUrlWithContext,
} from '@oaknational/sdk-codegen/api-schema';
import type { ResponseContext, ContentType } from './types/response-augmentation.js';
import type { HttpMethod } from './validation/types.js';
import {
  getContentTypeFromPath,
  extractEntityIdFromPath,
  extractGenericId,
  extractContentTypeSpecificId,
  isNonNullObject,
} from './response-augmentation-helpers.js';
import { deriveSequenceSlug } from './sequence-slug-derivation.js';
import { rawCurriculumSchemas } from '@oaknational/sdk-codegen/zod';

/**
 * Key stage entry schema derived from the generated SubjectResponseSchema.
 * Uses `.shape.keyStages` to anchor validation to the schema, ensuring
 * property names stay in sync with the upstream API contract.
 */
const keyStagesSchema = rawCurriculumSchemas.SubjectResponseSchema.shape.keyStages;

interface SubjectContext {
  readonly keyStageSlugs: readonly string[];
}

function endsWithEntityCollection(path: string, contentType: ContentType): boolean {
  return path.endsWith(`/${CONTENT_TYPE_PREFIXES[contentType].pathSegment}`);
}

/**
 * Extracts unit context from response data.
 *
 * Derives `sequenceSlug` from unit context by normalising `phaseSlug` and
 * combining it with `subjectSlug` (e.g. `maths` + `ks1` → `maths-primary`).
 */
function extractUnitContext(response: unknown): { readonly sequenceSlug?: string } | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('subjectSlug' in response && 'phaseSlug' in response) {
    const subjectSlug = typeof response.subjectSlug === 'string' ? response.subjectSlug : undefined;
    const phaseSlug = typeof response.phaseSlug === 'string' ? response.phaseSlug : undefined;
    if (subjectSlug && phaseSlug) {
      return { sequenceSlug: deriveSequenceSlug(subjectSlug, phaseSlug) };
    }
  }
  return undefined;
}

/**
 * Extracts subject context from response data.
 *
 * Validates the `keyStages` field against the schema derived from the
 * generated `SubjectResponseSchema`, then maps to slug strings.
 */
function extractSubjectContext(response: unknown): SubjectContext | undefined {
  if (!isNonNullObject(response) || !('keyStages' in response)) {
    return undefined;
  }
  const parsed = keyStagesSchema.safeParse(response.keyStages);
  if (!parsed.success || parsed.data.length === 0) {
    return undefined;
  }
  return { keyStageSlugs: parsed.data.map((ks) => ks.keyStageSlug) };
}

function shouldExtract(targetType: ContentType, contentType: ContentType | undefined): boolean {
  return contentType === undefined || contentType === targetType;
}

/**
 * Extracts context from response data for units and subjects.
 * Exported for shared use by the response augmentation middleware
 * and `runFetchTool` in `aggregated-fetch.ts`.
 */
export function extractContextFromResponse(
  response: unknown,
  contentType?: ContentType,
): ResponseContext {
  if (!isNonNullObject(response)) {
    return {};
  }

  const context: ResponseContext = {};

  if (shouldExtract('unit', contentType)) {
    context.unit = extractUnitContext(response);
  }

  if (shouldExtract('subject', contentType)) {
    context.subject = extractSubjectContext(response);
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
    endsWithEntityCollection(path, 'sequence') ||
    (path.includes('/key-stages/') &&
      (endsWithEntityCollection(path, 'lesson') || endsWithEntityCollection(path, 'unit')))
  );
}

/**
 * Extracts ID from response data or path
 *
 * For array endpoints, only extracts from response data (each item must have its own slug).
 * For single-entity endpoints, uses the concrete entity segment from the request path
 * if the response body does not carry its own slug.
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

  return extractIdFromPath(path);
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
 * Extracts an entity ID from a concrete single-entity path.
 */
function extractIdFromPath(path: string): string | undefined {
  const contentType = getContentTypeFromPath(path);
  return extractEntityIdFromPath(path, contentType);
}

/**
 * Augments an array response with Oak URL on each item.
 *
 * Returns `unknown` because the result flows to `JSON.stringify` at
 * the middleware boundary — there is no typed downstream consumer.
 * Uses `Object.assign` to avoid the TypeScript 20-member union
 * spread limit (TS2698).
 */
export function augmentArrayResponseWithOakUrl(
  response: readonly unknown[],
  path: string,
  method: HttpMethod,
): unknown {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return response.map((item) => {
    return Object.assign({}, item, extractOakUrlFields(item, path, contentType));
  });
}

/**
 * Augments a single object response with Oak URL.
 *
 * Returns `unknown` because the result flows to `JSON.stringify` at
 * the middleware boundary — there is no typed downstream consumer.
 * Uses `Object.assign` to avoid the TypeScript 20-member union
 * spread limit (TS2698).
 */
export function augmentResponseWithOakUrl(
  response: unknown,
  path: string,
  method: HttpMethod,
): unknown {
  if (method !== 'get') {
    return response;
  }
  const contentType = getContentTypeFromPath(path);
  if (!contentType) {
    return response;
  }
  return Object.assign({}, response, extractOakUrlFields(response, path, contentType));
}

/**
 * Extracts Oak URL fields from a response.
 *
 * The `oakUrl` is the direct, slug-based URL for the resource.
 * When the upstream already provides `oakUrl`, it is preserved
 * (idempotent). The upstream's `canonicalUrl` is a separate field
 * and passes through untouched.
 *
 * @returns The oakUrl field for the response, which is null for threads (no website equivalent)
 * @throws An error if the content type is unsupported or no result is generated
 */
function extractOakUrlFields(
  response: unknown,
  path: string,
  contentType: ContentType,
): { oakUrl: string | null } {
  if (isNonNullObject(response) && 'oakUrl' in response && typeof response.oakUrl === 'string') {
    return { oakUrl: response.oakUrl };
  }
  const id = extractIdFromResponse(response, path);
  if (!id) {
    throw new TypeError(
      `Could not extract ID for path: ${path} from response: ${JSON.stringify(response)}`,
    );
  }
  const context = extractContextFromResponse(response, contentType);
  const oakUrl = generateOakUrlWithContext(contentType, id, context);
  return { oakUrl };
}
