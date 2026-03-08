/** Helper functions for response augmentation - ID and path extraction. */

import { CONTENT_TYPE_PREFIXES } from '@oaknational/sdk-codegen/api-schema';
import type { ContentType } from './types/response-augmentation.js';

/**
 * A non-null object response that can be narrowed via property checks.
 * This type is used internally by type guards to narrow unknown values
 * to something compatible with the `in` operator.
 */
interface ObjectResponse {
  readonly [Symbol.toStringTag]?: string;
}

const subjectCollectionPattern = new RegExp(
  `/${CONTENT_TYPE_PREFIXES.subject.pathSegment}(/[^/]+)?$`,
);

function includesEntityCollection(path: string, contentType: ContentType): boolean {
  return path.includes(`/${CONTENT_TYPE_PREFIXES[contentType].pathSegment}/`);
}

function endsWithEntityCollection(path: string, contentType: ContentType): boolean {
  return path.endsWith(`/${CONTENT_TYPE_PREFIXES[contentType].pathSegment}`);
}

/**
 * Type guard that narrows unknown to a non-null object.
 * Used to enable the `in` operator for property checking.
 */
export function isNonNullObject(value: unknown): value is ObjectResponse {
  return typeof value === 'object' && value !== null;
}

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
  if (endsWithEntityCollection(path, 'lesson')) {
    return 'lesson';
  }
  if (endsWithEntityCollection(path, 'unit')) {
    return 'unit';
  }
  return undefined;
}

/**
 * Checks if path is a single entity endpoint.
 *
 * Note: Order matters for paths like `/subjects/\{subject\}/sequences` which
 * contains both `/subjects/` and ends with `/sequences`. We prioritise based
 * on what the endpoint actually returns.
 *
 * Subject paths use positive exact-depth matching to prevent sub-resource
 * paths like `/subjects/maths/key-stages` or `/subjects/maths/years` from
 * being misclassified as subject entities. Lesson and unit paths retain
 * `includes()` matching because they have valid deeper paths (e.g.,
 * `/lessons/\{l\}/summary`, `/units/\{u\}/summary`).
 */
export function isSingleEntityEndpoint(path: string): ContentType | undefined {
  if (includesEntityCollection(path, 'lesson')) {
    return 'lesson';
  }
  if (includesEntityCollection(path, 'unit')) {
    return 'unit';
  }
  if (includesEntityCollection(path, 'sequence')) {
    return 'sequence';
  }
  if (endsWithEntityCollection(path, 'sequence')) {
    return 'sequence';
  }
  if (subjectCollectionPattern.test(path)) {
    return 'subject';
  }
  if (includesEntityCollection(path, 'thread')) {
    return 'thread';
  }
  return undefined;
}

/**
 * Determines content type from API path
 *
 * Recognises paths for:
 * - Single entity endpoints (e.g., /lessons/\{lesson\}/summary)
 * - Search endpoints (e.g., /search/lessons, /search/transcripts)
 * - Key-stage scoped endpoints (e.g., /key-stages/\{ks\}/subjects/\{subj\}/lessons)
 */
export function getContentTypeFromPath(path: string): ContentType | undefined {
  return isSearchEndpoint(path) ?? isKeyStageScopedEndpoint(path) ?? isSingleEntityEndpoint(path);
}

function isPathTemplateSegment(segment: string): boolean {
  return segment.startsWith('{') && segment.endsWith('}');
}

/**
 * Extracts the entity identifier that immediately follows the entity collection
 * segment in a concrete API path.
 *
 * For example, `/lessons/add-fractions/summary` resolves to `add-fractions`.
 * OpenAPI template placeholders such as `\{lesson\}` are intentionally ignored
 * because they are not usable website slugs.
 */
export function extractEntityIdFromPath(
  path: string,
  contentType: ContentType | undefined,
): string | undefined {
  if (contentType === undefined) {
    return undefined;
  }

  const entityPathSegment = CONTENT_TYPE_PREFIXES[contentType].pathSegment;
  const pathSegments = path.split('/');
  const entityPathIndex = pathSegments.indexOf(entityPathSegment);
  const candidateId = pathSegments[entityPathIndex + 1];

  if (candidateId === undefined || candidateId.length === 0 || isPathTemplateSegment(candidateId)) {
    return undefined;
  }

  return candidateId;
}

/**
 * Extracts lesson slug from response
 */
export function extractLessonSlug(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('lessonSlug' in response) {
    return typeof response.lessonSlug === 'string' ? response.lessonSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts unit slug from response
 */
export function extractUnitSlug(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('unitSlug' in response) {
    return typeof response.unitSlug === 'string' ? response.unitSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts subject slug from response
 */
export function extractSubjectSlug(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('subjectSlug' in response) {
    return typeof response.subjectSlug === 'string' ? response.subjectSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts sequence slug from response
 */
export function extractSequenceSlug(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('sequenceSlug' in response) {
    return typeof response.sequenceSlug === 'string' ? response.sequenceSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts thread slug from response
 */
export function extractThreadSlug(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('threadSlug' in response) {
    return typeof response.threadSlug === 'string' ? response.threadSlug : undefined;
  }
  return undefined;
}

/**
 * Extracts content-type-specific ID from response
 */
export function extractContentTypeSpecificId(
  response: unknown,
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
export function extractGenericId(response: unknown): string | undefined {
  if (!isNonNullObject(response)) {
    return undefined;
  }
  if ('slug' in response && typeof response.slug === 'string') {
    return response.slug;
  }
  if ('id' in response && typeof response.id === 'string') {
    return response.id;
  }
  return undefined;
}
