/**
 * Minimal OpenAPI 3.0 type definitions needed for type generation
 *
 * These are a subset of the full OpenAPI specification,
 * focused on what we need for the Oak Curriculum API
 */

export interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  enum?: string[];
  required?: string[];
  nullable?: boolean;
}

export interface OpenAPI3 {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, unknown>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
}
