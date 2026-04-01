/**
 * Subpath barrel: `@oaknational/sdk-codegen/api-schema`
 *
 * OpenAPI-derived types, path parameters, routing helpers, error types,
 * request/response validation, and schema base.
 */

export type {
  paths,
  webhooks,
  components,
  $defs,
  operations,
} from './types/generated/api-schema/api-paths-types.js';

export {
  PATHS,
  isValidPath,
  apiPaths,
  allowedMethods,
  isAllowedMethod,
  KEY_STAGES,
  isKeyStage,
  SUBJECTS,
  isSubject,
  ASSET_TYPES,
  isAssetType,
  PATH_PARAMETERS,
  isValidParameterType,
  isValidPathParameter,
  VALID_PATHS_BY_PARAMETERS,
  PATH_OPERATIONS,
  OPERATIONS_BY_ID,
  isOperationId,
  getOperationIdByPathAndMethod,
  RESPONSE_CODES,
  VALID_RESPONSE_CODES,
  isValidResponseCode,
  areValidResponseCodes,
  isUnknownResponseCode,
  ERROR_RESPONSE_CODES,
  isErrorResponseCode,
  getResponseCodesForPathAndMethod,
} from './types/generated/api-schema/path-parameters.js';
export type {
  ValidPath,
  RawPaths,
  AllowedMethods,
  HttpMethodKeys,
  AllowedMethodsForPath,
  Normalize200,
  NormalizedResponsesFor,
  JsonBody200,
  PathReturnTypes,
  KeyStages,
  KeyStage,
  Subjects,
  Subject,
  AssetTypes,
  AssetType,
  PathParameters,
  PathParameterValues,
  PathGroupingKeys,
  ValidParameterCombination,
  ValidPathAndParameters,
  ValidPathGroupings,
  PathOperation,
  OperationIdToOperationMap,
  OperationId,
  ResponsesForPath,
  ResponseForPathAndMethod,
  PossibleResponseCode,
  ValidResponseCode,
  ValidNumericResponseCode,
  UnknownResponseCode,
  ErrorResponseCode,
} from './types/generated/api-schema/path-parameters.js';

export {
  toColon,
  toCurly,
  isColon,
  isCurly,
} from './types/generated/api-schema/path-utils.js';

export { schemaBase } from './types/generated/api-schema/api-schema-base.js';
export type { SchemaBase } from './types/generated/api-schema/api-schema-base.js';

export {
  CONTENT_TYPE_PREFIXES,
  extractSlug,
  generateOakUrlWithContext,
} from './types/generated/api-schema/routing/url-helpers.js';
export type { ContentType } from './types/generated/api-schema/routing/url-helpers.js';

export {
  classifyHttpError,
  classifyException,
  validationError,
  isRecoverableError,
  formatSdkError,
} from './types/generated/api-schema/error-types/sdk-error-types.js';
export type {
  SdkFetchError,
  SdkNotFoundError,
  SdkLegallyRestrictedError,
  ResourceType,
  SdkServerError,
  ServerErrorStatus,
  SdkRateLimitError,
  SdkNetworkError,
  SdkValidationError,
} from './types/generated/api-schema/error-types/sdk-error-types.js';

export {
  isAllowedId,
  getResponseSchemaByOperationIdAndStatus,
  getResponseSchemaByPathAndMethodAndStatus,
  getResponseSchemaForEndpoint,
  getResponseDescriptorSchema,
  getDescriptorSchemaForEndpoint,
  getResponseDescriptorsByOperationId,
} from './types/generated/api-schema/response-map.js';
export type {
  AllowedId,
  ResponseSchemaByOperationIdAndStatus,
} from './types/generated/api-schema/response-map.js';

export {
  REQUEST_PARAMETER_SCHEMAS,
  getRequestParameterSchema,
} from './types/generated/api-schema/validation/request-parameter-map.js';
export type {
  RequestParameterSchemas,
  RequestParameterKey,
} from './types/generated/api-schema/validation/request-parameter-map.js';

export type { OakApiPathBasedClient } from './types/generated/api-schema/client-types.js';
