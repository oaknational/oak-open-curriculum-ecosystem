/**
 * Human-readable documentation aliases for key generated OpenAPI types.
 *
 * These aliases ensure important generated types are present in the public
 * SDK documentation under stable, descriptive names.
 */

/**
 * OpenAPI `paths` map used by the Oak API clients.
 */
import type { paths as ApiPaths } from './generated/api-schema/api-paths-types';
export type DocPaths = ApiPaths;

/** Subject slug literal type. */
import type { Subject, KeyStage } from './generated/api-schema/path-parameters';
export type DocSubject = Subject;

/** Key stage literal type. */
export type DocKeyStage = KeyStage;
