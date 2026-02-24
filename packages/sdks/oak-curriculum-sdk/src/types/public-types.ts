/**
 * Public wrapper types for the OpenAPI-generated SDK types.
 *
 * These wrappers make important generated types first-class citizens in the
 * documentation without coupling downstream code to generator file paths.
 *
 * Long-term: see `.agent/plans/generated-document-enhancements-plan.md` for
 * the plan to further curate and annotate public API shapes.
 */

/**
 * OpenAPI paths map for the Oak Curriculum API.
 *
 * @remarks
 * All client operations and request/response types are resolved from this map.
 * It is generated from the API schema at build time.
 */
import type {
  paths as ApiPaths,
  Subject as GeneratedSubject,
  KeyStage as GeneratedKeyStage,
  AssetType as GeneratedAssetType,
} from '@oaknational/curriculum-sdk-generation/api-schema';
export type OakApiPaths = ApiPaths;

/** Subject slug literal type (curated alias). */
export type OakSubject = GeneratedSubject;

/** Key stage literal type (curated alias). */
export type OakKeyStage = GeneratedKeyStage;

/** Asset type literal (curated alias). */
export type OakAssetType = GeneratedAssetType;
