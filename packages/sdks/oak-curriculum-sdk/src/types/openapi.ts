/**
 * Re-export OpenAPI types from openapi-typescript
 *
 * We use the library types directly instead of defining our own.
 * This ensures we have complete type information after schema validation.
 */

export type {
  OpenAPI3,
  PathsObject,
  PathItemObject,
  OperationObject,
  ParameterObject,
  ResponseObject,
  RequestBodyObject,
  SchemaObject,
  ComponentsObject,
  ReferenceObject,
  ResponsesObject,
  MediaTypeObject,
  HeaderObject,
  SecurityRequirementObject,
  ServerObject,
  ExternalDocumentationObject,
  TagObject,
} from 'openapi-typescript';
