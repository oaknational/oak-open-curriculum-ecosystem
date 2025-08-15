/**
 * Parameter validation using schema definitions
 *
 * This validates and transforms MCP parameters to OpenAPI structure
 * using the schema's parameter definitions directly.
 */

import { schema } from '../types/generated/api-schema/api-schema.js';

/**
 * Type predicate for parameters object
 */
function isParametersObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate and transform parameters from MCP flat structure to OpenAPI structure
 *
 * MCP sends: { sequence: "abc", year: "2023" }
 * OpenAPI expects: { path: { sequence: "abc" }, query: { year: "2023" } }
 */
export function validateParams(
  path: string,
  method: string,
  params: unknown,
): { path?: Record<string, string>; query?: Record<string, unknown> } | null {
  // Get operation from schema
  const pathItem = schema.paths[path as keyof typeof schema.paths];
  if (!pathItem) return null;

  const operation = pathItem[method.toLowerCase() as keyof typeof pathItem];
  if (!operation || typeof operation !== 'object') return null;

  // If no parameters defined, return empty object
  if (!('parameters' in operation) || !Array.isArray(operation.parameters)) {
    return {};
  }

  // Validate params is an object
  if (!isParametersObject(params)) {
    // If no params provided and no required params, that's OK
    if (params === undefined || params === null) {
      const hasRequired = operation.parameters.some(
        (p) => typeof p === 'object' && p !== null && 'required' in p && p.required === true,
      );
      return hasRequired ? null : {};
    }
    return null;
  }

  const result: {
    path?: Record<string, string>;
    query?: Record<string, unknown>;
  } = {};

  const pathParams: Record<string, string> = {};
  const queryParams: Record<string, unknown> = {};

  // Process each parameter definition
  for (const paramDef of operation.parameters) {
    if (typeof paramDef !== 'object' || !paramDef) continue;

    const param = paramDef as {
      name: string;
      in: string;
      required?: boolean;
      schema?: { type?: string };
    };

    const value = params[param.name];

    // Check required parameters
    if (param.required && value === undefined) {
      return null; // Missing required parameter
    }

    // Skip optional parameters that aren't provided
    if (value === undefined) continue;

    // Validate and add parameter based on location
    if (param.in === 'path') {
      // Path parameters must be strings
      if (typeof value !== 'string') return null;
      pathParams[param.name] = value;
    } else if (param.in === 'query') {
      // Query parameters can be various types
      queryParams[param.name] = value;
    }
  }

  // Build result structure
  if (Object.keys(pathParams).length > 0) {
    result.path = pathParams;
  }
  if (Object.keys(queryParams).length > 0) {
    result.query = queryParams;
  }

  return result;
}
