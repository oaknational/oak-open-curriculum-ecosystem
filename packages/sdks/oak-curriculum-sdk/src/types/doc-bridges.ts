/**
 * Human-readable documentation aliases for key generated OpenAPI types.
 *
 * These aliases ensure important generated types are present in the public
 * SDK documentation under stable, descriptive names.
 */

import type { Paths as ApiPaths, Subject, KeyStage } from '@oaknational/sdk-codegen/api-schema';

/**
 * The OpenAPI document's `paths` object as a type, used by the Oak API clients.
 */
export type DocPaths = ApiPaths;

/** Subject slug literal type. */
export type DocSubject = Subject;

/** Key stage literal type. */
export type DocKeyStage = KeyStage;
