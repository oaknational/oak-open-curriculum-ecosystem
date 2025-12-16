/**
 * Type definitions for endpoint extraction.
 *
 * @packageDocumentation
 */

/**
 * Options for extracting endpoint definitions from OpenAPI.
 */
export interface EndpointDefinitionOptions {
  /** Whether to export all schemas (default: true) */
  readonly shouldExportAllSchemas?: boolean;
  /** Whether to export all types (default: true) */
  readonly shouldExportAllTypes?: boolean;
  /** Strategy for grouping endpoints (default: 'none') */
  readonly groupStrategy?: 'none' | 'tag' | 'tag-file' | 'method' | 'method-file';
  /** Whether to use aliases (default: false) */
  readonly withAlias?: boolean;
  /**
   * Enforce strict object validation - unknown properties cause errors (default: true).
   * When true, schemas use `.strict()` to fail fast on unknown keys.
   */
  readonly strictObjects?: boolean;
  /**
   * Default behavior for additionalProperties when not specified in schema.
   * Set to false to disable `.passthrough()` generation (default: false).
   * This ensures unknown keys are rejected, not silently ignored.
   */
  readonly additionalPropertiesDefaultValue?: boolean;
}

/**
 * A single endpoint parameter definition with Zod v4 schema code.
 */
export interface EndpointParameter {
  /** Parameter name */
  readonly name: string;
  /** Parameter type (path, query, header, body) */
  readonly type: string;
  /** Zod v4 schema code string for the parameter */
  readonly schema: string;
}

/**
 * An error response definition for an endpoint.
 */
export interface EndpointError {
  /** HTTP status code or 'default' */
  readonly status: string | number;
  /** Description of the error */
  readonly description?: string;
  /** Zod v4 schema code string for the error response */
  readonly schema: string;
}

/**
 * A single endpoint definition with all schemas transformed to Zod v4.
 */
export interface EndpointDefinition {
  /** HTTP method (get, post, put, delete, etc.) */
  readonly method: string;
  /** API path (e.g., '/users/:id') */
  readonly path: string;
  /** Operation description from OpenAPI */
  readonly description?: string;
  /** Request format (e.g., 'json') */
  readonly requestFormat?: string;
  /** Zod v4 schema code string for the response */
  readonly response: string;
  /** Error response definitions with Zod v4 schemas */
  readonly errors?: readonly EndpointError[];
  /** Request parameter definitions with Zod v4 schemas */
  readonly parameters?: readonly EndpointParameter[];
}

/**
 * Result of extracting endpoint definitions from OpenAPI.
 */
export interface EndpointDefinitionResult {
  /** List of endpoint definitions with Zod v4 schemas */
  readonly endpoints: readonly EndpointDefinition[];
}

/**
 * Default options for endpoint extraction.
 *
 * IMPORTANT: strictObjects and additionalPropertiesDefaultValue defaults enforce
 * the fail-fast principle - unknown keys cause validation errors, never silently ignored.
 */
export const DEFAULT_ENDPOINT_OPTIONS: Required<EndpointDefinitionOptions> = {
  shouldExportAllSchemas: true,
  shouldExportAllTypes: true,
  groupStrategy: 'none',
  withAlias: false,
  strictObjects: true,
  additionalPropertiesDefaultValue: false,
};

/**
 * Raw parameter shape from openapi-zod-client.
 */
export interface RawParameter {
  readonly name: string;
  readonly type: string;
  readonly schema: unknown;
}

/**
 * Raw error shape from openapi-zod-client.
 */
export interface RawError {
  readonly status: string | number;
  readonly description?: string;
  readonly schema: unknown;
}

/**
 * Raw endpoint shape from openapi-zod-client.
 */
export interface RawEndpoint {
  readonly method: string;
  readonly path: string;
  readonly description?: string;
  readonly requestFormat?: string;
  readonly response: unknown;
  readonly errors?: readonly unknown[];
  readonly parameters?: readonly unknown[];
}
