/**
 * Schema generation functions
 * Pure functions for generating schema files
 */

import type { OpenAPI3 } from 'openapi-typescript';
import { generateMcpToolName } from '../mcp-tools/name-generator.js';

/**
 * Generate JSON schema file content
 * @param schema - The OpenAPI schema object
 * @returns Formatted JSON string with MCP tool names and metadata embedded
 */
export function generateJsonContent(schema: OpenAPI3): string {
  // Create a deep copy to avoid mutating the original
  const schemaWithTools = JSON.parse(JSON.stringify(schema)) as OpenAPI3;
  
  if (schemaWithTools.paths) {
    const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
    
    for (const [path, pathItem] of Object.entries(schemaWithTools.paths)) {
      if (typeof pathItem !== 'object' || '$ref' in pathItem) continue;
      
      for (const method of methods) {
        const operation = pathItem[method];
        if (!operation || typeof operation !== 'object') continue;
        
        // Check if it's a reference or an operation
        if ('$ref' in operation) continue;
        
        // Add the MCP tool name to the operation
        const toolName = generateMcpToolName(path, method);
        // Use Object.assign to add properties without type assertions
        Object.assign(operation, { operationToolName: toolName });
        
        // Extract parameter metadata
        const pathParams: string[] = [];
        const queryParams: string[] = [];
        
        // Now TypeScript knows operation is OperationObject, not ReferenceObject
        if (operation.parameters && Array.isArray(operation.parameters)) {
          for (const param of operation.parameters) {
            // Skip reference objects
            if ('$ref' in param) continue;
            
            if (param.in === 'path') {
              pathParams.push(param.name);
            } else if (param.in === 'query') {
              queryParams.push(param.name);
            }
          }
        }
        
        // Add comprehensive tool metadata
        Object.assign(operation, {
          operationToolMetadata: {
            name: toolName,
            path: path,
            method: method.toUpperCase(),
            pathParams: pathParams,
            queryParams: queryParams,
          }
        });
      }
    }
  }
  
  return JSON.stringify(schemaWithTools, undefined, 2);
}

/**
 * Generate TypeScript schema file content
 * @param jsonSchema - The JSON schema as a string
 * @returns TypeScript file content with schema export
 */
export function generateTsSchemaContent(jsonSchema: string): string {
  return `/**
 * The API schema.
 *
 * This is a runtime object that can be used to access the API definition programmatically.
 */

export const schema = ${jsonSchema} as const;

export type Schema = typeof schema;
`;
}
