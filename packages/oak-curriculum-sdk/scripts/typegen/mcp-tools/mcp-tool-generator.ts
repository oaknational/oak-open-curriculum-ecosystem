/* eslint-disable complexity, max-depth, max-lines-per-function, max-statements */

/**
 * MCP Tools Generator - Compilation Time Revolution
 *
 * Generates complete tool definitions with compile-time embedded validation.
 * Creates a directory structure with individual tool files.
 * All validation logic is extracted from the schema at generation time.
 */

import type { OpenAPI3, OperationObject, ParameterObject } from 'openapi-typescript';
import { generateMcpToolName } from './name-generator.js';

/**
 * Primitive types that parameters can have
 */
type PrimitiveType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]';

/**
 * Parameter metadata structure
 */
interface ParamMetadata {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
}

/**
 * Helper function to determine primitive type from parameter schema
 */
function getParameterPrimitiveType(param: ParameterObject): PrimitiveType {
  if ('schema' in param && param.schema && typeof param.schema === 'object') {
    // If it has enum values, determine type from the enum values themselves
    if (
      'enum' in param.schema &&
      Array.isArray(param.schema.enum) &&
      param.schema.enum.length > 0
    ) {
      const firstEnumValue = param.schema.enum[0];
      if (typeof firstEnumValue === 'number') {
        return 'number';
      } else if (typeof firstEnumValue === 'boolean') {
        return 'boolean';
      } else {
        return 'string';
      }
    } else if ('type' in param.schema) {
      const schemaType = param.schema.type;
      if (schemaType === 'integer' || schemaType === 'number') {
        return 'number';
      } else if (schemaType === 'boolean') {
        return 'boolean';
      } else if (schemaType === 'array') {
        // Try to determine array element type
        if (
          'items' in param.schema &&
          param.schema.items &&
          typeof param.schema.items === 'object'
        ) {
          if ('type' in param.schema.items) {
            const itemType = param.schema.items.type;

            if (itemType === 'integer' || itemType === 'number') {
              return 'number[]';
            } else if (itemType === 'boolean') {
              return 'boolean[]';
            }
          }
        }
        return 'string[]';
      }
    }
  }
  return 'string'; // default
}

/**
 * Convert tool name to camelCase for variable name
 */
function toolNameToCamelCase(toolName: string): string {
  // oak-get-lessons-transcript -> oakGetLessonsTranscript
  return toolName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Capitalise first letter of a string
 */
function capitaliseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Result of tool generation - multiple files
 */
export interface GeneratedMcpToolFiles {
  'index.ts': string;
  'types.ts': string;
  'lib.ts': string;
  tools: Record<string, string>; // filename -> content
}

/**
 * Generate a single tool file with compile-time validation
 */
function generateToolFile(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const variableName = toolNameToCamelCase(toolName);
  const lines: string[] = [];

  // File header and imports
  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: ${toolName}
 * Path: ${path}
 * Method: ${method.toUpperCase()}
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= '${operationId}' as const;
const name= '${toolName}' as const;
const path= '${path}' as const;
const method= '${method.toUpperCase()}' as const;

type Client = OakApiPathBasedClient['${path}']['${method.toUpperCase()}'];

`);

  // Extract parameter information with required field
  const pathParams = Object.keys(pathParamMetadata);
  const queryParams = Object.keys(queryParamMetadata);
  const hasPathParams = pathParams.length > 0;
  const hasQueryParams = queryParams.length > 0;

  // Map to track parameter details
  const paramDetailsMap: Map<
    string,
    {
      required: boolean;
      enumValues?: readonly unknown[];
      primitiveType: PrimitiveType;
      in: 'path' | 'query' | 'header' | 'cookie';
    }
  > = new Map();

  // Process all parameters to extract details
  if (operation.parameters && Array.isArray(operation.parameters)) {
    for (const param of operation.parameters) {
      if ('$ref' in param) continue;

      const primitiveType = getParameterPrimitiveType(param);
      const isRequired = param.required === true; // Default false for query, true for path
      const enumValues = param.schema?.enum;

      paramDetailsMap.set(param.name, {
        required: isRequired,
        enumValues: enumValues,
        primitiveType: primitiveType,
        in: param.in,
      });
    }
  }

  // Generate path parameter type guards
  if (hasPathParams) {
    lines.push('// Path parameters');
    for (const paramName of pathParams) {
      const details = paramDetailsMap.get(paramName);
      if (!details) continue;

      if (details.enumValues) {
        const capitalised = capitaliseFirst(paramName);
        const valueType = details.primitiveType;

        lines.push(`const allowed${capitalised}Values= ${JSON.stringify(details.enumValues)} as const;
type ${capitalised}Value = typeof allowed${capitalised}Values[number];
function is${capitalised}Value(value: ${valueType}): value is ${capitalised}Value {
  const string${capitalised}Value: readonly ${valueType}[] = allowed${capitalised}Values;
  return string${capitalised}Value.includes(value);
}
`);
      }
    }
  }

  // Generate query parameter type guards
  if (hasQueryParams) {
    lines.push('// Query parameters');
    for (const paramName of queryParams) {
      const details = paramDetailsMap.get(paramName);
      if (!details) continue;

      if (details.enumValues) {
        const capitalised = capitaliseFirst(paramName);
        const valueType = details.primitiveType;
        const isOptional = !details.required;

        if (isOptional) {
          lines.push(`
// ${capitalised} value is optional, not all query parameters are.`);
        }

        lines.push(`const allowed${capitalised}Values= ${JSON.stringify(details.enumValues)} as const;
type ${capitalised}Value = typeof allowed${capitalised}Values[number]${isOptional ? ' | undefined' : ''};
function is${capitalised}Value(value: ${valueType}${isOptional ? ' | undefined' : ''}): value is ${capitalised}Value {${
          isOptional
            ? `
  if (value === undefined) {
    return true;
  }`
            : ''
        }
  const string${capitalised}Value: readonly ${valueType}[] = allowed${capitalised}Values;
  return string${capitalised}Value.includes(value);
}
`);
      }
    }
  }

  // Generate pathParams and queryParams metadata objects with typeguards
  lines.push(`const pathParams= {`);
  for (const paramName of pathParams) {
    const metadata = pathParamMetadata[paramName];
    const details = paramDetailsMap.get(paramName);
    const capitalised = capitaliseFirst(paramName);

    if (details?.enumValues) {
      lines.push(
        `"${paramName}":{"typePrimitive":"${metadata.typePrimitive}","valueConstraint":${metadata.valueConstraint},"allowedValues":allowed${capitalised}Values, typeguard: is${capitalised}Value},`,
      );
    } else {
      lines.push(`"${paramName}":${JSON.stringify(metadata)},`);
    }
  }
  lines.push(`};`);

  lines.push(`const queryParams= {`);
  for (const paramName of queryParams) {
    const metadata = queryParamMetadata[paramName];
    const details = paramDetailsMap.get(paramName);
    const capitalised = capitaliseFirst(paramName);

    if (details?.enumValues) {
      lines.push(
        `"${paramName}":{"typePrimitive":"${metadata.typePrimitive}","valueConstraint":${metadata.valueConstraint},"allowedValues":allowed${capitalised}Values, typeguard: is${capitalised}Value},`,
      );
    } else {
      lines.push(`"${paramName}":${JSON.stringify(metadata)},`);
    }
  }
  lines.push(`};
`);

  // Generate ValidRequestParams type
  const hasAnyParams = hasPathParams || hasQueryParams;

  if (!hasAnyParams) {
    // No parameters at all
    lines.push(`type ValidRequestParams= {params: {}}`);
  } else {
    lines.push(`type ValidRequestParams= {params: {`);

    if (hasPathParams) {
      lines.push(`path: {`);
      for (const paramName of pathParams) {
        const details = paramDetailsMap.get(paramName);
        lines.push(`${paramName}: ${details?.primitiveType || 'string'}, `);
      }
      lines.push(`}`);
    }

    if (hasQueryParams) {
      // Check if any query params exist
      const hasRequiredQuery = Array.from(paramDetailsMap.values()).some(
        (d) => d.in === 'query' && d.required,
      );

      // Only add comma if there were path params before
      const prefix = hasPathParams ? ', ' : '';
      lines.push(`${prefix}query${hasRequiredQuery ? '' : '?'}: {`);
      for (const paramName of queryParams) {
        const details = paramDetailsMap.get(paramName);
        const isOptional = !details?.required;
        lines.push(`${paramName}${isOptional ? '?' : ''}: ${details?.primitiveType || 'string'}, `);
      }
      lines.push(`}`);
    }

    lines.push(`}};`);
  }

  // Generate isValidRequestParams function
  const hasAnyParamsCheck = hasPathParams || hasQueryParams;

  if (!hasAnyParamsCheck) {
    // No parameters - validate the structure properly without assertions
    lines.push(`function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  if (typeof requestParams !== 'object' || requestParams === null) {
    return false;
  }
  // Check if params property exists and is an empty object
  const params = requestParams.params;
  if (!params || typeof params !== 'object' || params === null) {
    return false;
  }
  return Object.keys(params).length === 0;
}`);
  } else {
    // Has parameters - always use optional path for consistency with getExecutorFromGenericRequestParams
    lines.push(
      `function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {`,
    );
  }

  // Validate path parameters
  if (hasPathParams) {
    lines.push(`  // Required`);
    for (const paramName of pathParams) {
      lines.push(`  const ${paramName}= requestParams.params.path?.${paramName};`);
    }

    // Type checks
    const typeChecks = pathParams
      .map((p) => {
        const details = paramDetailsMap.get(p);
        const type = details?.primitiveType || 'string';
        return `typeof ${p} !== '${type}'`;
      })
      .join(' || ');

    lines.push(`  if(${typeChecks}) {
    return false;
  }`);

    // Value checks for constrained params
    const constrainedPathParams = pathParams.filter((p) => {
      const details = paramDetailsMap.get(p);
      return details?.enumValues;
    });

    if (constrainedPathParams.length > 0) {
      const valueChecks = constrainedPathParams
        .map((p) => {
          const capitalised = capitaliseFirst(p);
          return `!is${capitalised}Value(${p})`;
        })
        .join(' || ');

      lines.push(`  if(${valueChecks}) {
    return false;
  }`);
    }
  }

  // Validate query parameters
  if (hasQueryParams) {
    lines.push(`  // Optional`);
    for (const paramName of queryParams) {
      lines.push(`  const ${paramName}= requestParams.params.query?.${paramName};`);
    }

    // Check each query param
    for (const paramName of queryParams) {
      const details = paramDetailsMap.get(paramName);
      const isOptional = !details?.required;
      const type = details?.primitiveType || 'string';
      const capitalised = capitaliseFirst(paramName);

      if (details?.enumValues) {
        lines.push(`  if(${paramName} !== undefined && ${paramName} !== null && typeof ${paramName} === '${type}' && !is${capitalised}Value(${paramName})) {
    return false;
  }`);
      } else if (!isOptional) {
        lines.push(`  if(${paramName} === undefined || typeof ${paramName} !== '${type}') {
    return false;
  }`);
      } else {
        lines.push(`  if(${paramName} !== undefined && typeof ${paramName} !== '${type}') {
    return false;
  }`);
      }
    }
  }

  // Only add return true and closing brace if we have parameters (didn't already close the function)
  if (hasAnyParamsCheck) {
    lines.push(`  return true;
}`);
  }

  // Generate getValidRequestParamsDescription function
  lines.push(`const getValidRequestParamsDescription= () => {
  return \`{
    params: {`);

  if (hasPathParams) {
    lines.push(`
      path: {`);
    for (const paramName of pathParams) {
      const details = paramDetailsMap.get(paramName);
      if (details?.enumValues) {
        const capitalised = capitaliseFirst(paramName);
        lines.push(`
        ${paramName}: one of \${allowed${capitalised}Values.join(', ')}`);
      } else {
        lines.push(`
        ${paramName}: any ${details?.primitiveType || 'string'}`);
      }
    }
    lines.push(`
      },`);
  }

  if (hasQueryParams) {
    lines.push(`
      query: {`);
    for (const paramName of queryParams) {
      const details = paramDetailsMap.get(paramName);
      if (details?.enumValues) {
        const capitalised = capitaliseFirst(paramName);
        lines.push(`
        ${paramName}: one of \${allowed${capitalised}Values.join(', ')}`);
      } else {
        lines.push(`
        ${paramName}: any ${details?.primitiveType || 'string'},`);
      }
    }
    lines.push(`
      },`);
  }

  lines.push(`
    },
  }\`;
}
`);

  // Generate the executor function
  const hasAnyParamsForExecutor = hasPathParams || hasQueryParams;
  if (!hasAnyParamsForExecutor) {
    // No parameters - prefix with underscore to indicate unused
    lines.push(`
const executor= (client: OakApiPathBasedClient, _requestParams: ValidRequestParams): ReturnType<Client> => {`);
  } else {
    lines.push(`
const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {`);
  }

  // Extract parameters
  if (hasPathParams) {
    for (const paramName of pathParams) {
      lines.push(`  const ${paramName}PathParam = requestParams.params.path.${paramName};`);
    }
  }

  if (hasQueryParams) {
    for (const paramName of queryParams) {
      lines.push(`  const ${paramName}QueryParam = requestParams.params.query?.${paramName};`);
    }
  }

  lines.push('');

  // Validate constrained parameters
  for (const paramName of [...pathParams, ...queryParams]) {
    const details = paramDetailsMap.get(paramName);
    if (details?.enumValues) {
      const capitalised = capitaliseFirst(paramName);
      const suffix = details.in === 'path' ? 'PathParam' : 'QueryParam';

      lines.push(`  if (!is${capitalised}Value(${paramName}${suffix})) {
    throw new TypeError(\`Invalid ${paramName}: \${${paramName}${suffix}}. Must be one of: \${allowed${capitalised}Values.join(', ')}\`);
  }`);
    } else {
      const type = details?.primitiveType || 'string';
      lines.push(
        `  // The allowed value for ${paramName} is any ${type}, so we don't need a type guard for it.`,
      );
    }
  }

  // Build the client call
  lines.push(`  
  return client['${path}']['${method.toUpperCase()}']({
    params: {`);

  if (hasPathParams) {
    lines.push(`
      path: {`);
    for (const paramName of pathParams) {
      lines.push(`
        ${paramName}: ${paramName}PathParam,`);
    }
    lines.push(`
      },`);
  }

  if (hasQueryParams) {
    lines.push(`
      query: {`);
    for (const paramName of queryParams) {
      lines.push(`
        ${paramName}: ${paramName}QueryParam,`);
    }
    lines.push(`
      },`);
  }

  lines.push(`
    },
  });
}`);

  // Generate getExecutorFromGenericRequestParams - always use consistent signature
  lines.push(`
const getExecutorFromGenericRequestParams = (client: OakApiPathBasedClient, requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}) => {`);
  lines.push(`
  // The checks are specific to the tool
  if(!isValidRequestParams(requestParams)) {
    const validRequestParamsDescription = getValidRequestParamsDescription();
    throw new TypeError(\`Invalid request parameters. Please match the following schema: \${validRequestParamsDescription}\`);
  }
  
  return executor(client, requestParams);
}
`);

  // Export the tool
  lines.push(`export const ${variableName} = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
`);

  return lines.join('\n');
}

/**
 * Generate types.ts file with operation mapping and type guards
 */
function generateTypesFile(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  const lines: string[] = [];

  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Type definitions and guards for MCP tools
 */

/**
 * Operation ID to tool name mapping
 */
const operationIdToToolName = {`);

  for (const [operationId, mapping] of Object.entries(operationIdMap)) {
    lines.push(`  '${operationId}': {
    toolName: '${mapping.toolName}',
    operationIdKey: '${operationId}',
  },`);
  }

  lines.push(`} as const;

const allToolNames = Object.values(operationIdToToolName).map(v => v.toolName);

export type AllOperationIds = keyof typeof operationIdToToolName;
export type AllToolNames = typeof allToolNames[number];

/**
 * Type guard for tool names
 */
export function isToolName(value: unknown): value is AllToolNames {
  if (typeof value !== 'string') return false;
  // Runtime check against the operation mapping
  const validToolNames: readonly string[] = allToolNames;
  return validToolNames.includes(value);
}

/**
 * Type guard for operation IDs
 */
function isOperationId(operationId: string): operationId is AllOperationIds {
  return operationId in operationIdToToolName;
}

export function getToolNameFromOperationId(operationId: string): AllToolNames {
  if (!isOperationId(operationId)) {
    throw new TypeError(\`Invalid operation ID: \${operationId}. Allowed values: \${Object.keys(operationIdToToolName).join(', ')}\`);
  }
  return operationIdToToolName[operationId].toolName;
}
`);

  return lines.join('\n');
}

/**
 * Generate lib.ts file with getter functions
 */
function generateLibFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Library functions for MCP tools
 */

import { MCP_TOOLS } from './index';
import { getToolNameFromOperationId, type AllOperationIds, type AllToolNames } from './types';

/**
 * Get tool by name
 */
export function getToolFromToolName<ToolName extends AllToolNames>(toolName: ToolName):  typeof MCP_TOOLS[ToolName] {
  return MCP_TOOLS[toolName];
}

/**
 * Get tool by operation ID
 */
export function getToolFromOperationId(operationId: AllOperationIds): typeof MCP_TOOLS[AllToolNames] {
  return MCP_TOOLS[getToolNameFromOperationId(operationId)];
}
`;
}

/**
 * Generate index.ts file that imports all tools and creates MCP_TOOLS mapping
 */
function generateIndexFile(toolNames: string[]): string {
  const lines: string[] = [];

  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * MCP Tools index
 * Aggregates all tool definitions and provides the MCP_TOOLS mapping
 */

// Import all tool definitions`);

  // Generate imports
  for (const toolName of toolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`import { ${variableName} } from './tools/${toolName}';`);
  }

  lines.push(`
// Tool name to tool mapping
export const MCP_TOOLS = {`);

  // Generate mapping
  for (const toolName of toolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`  '${toolName}': ${variableName},`);
  }

  lines.push(`} as const;

// Re-export types with explicit names
export { 
  type AllOperationIds,
  type AllToolNames,
  isToolName,
  getToolNameFromOperationId
} from './types';

// Re-export lib functions with explicit names
export {
  getToolFromToolName,
  getToolFromOperationId,
} from './lib';
`);

  return lines.join('\n');
}

/**
 * Generate complete MCP tools directory structure with all embedded validation
 */
export function generateCompleteMcpTools(schema: OpenAPI3): GeneratedMcpToolFiles {
  const result: GeneratedMcpToolFiles = {
    'index.ts': '',
    'types.ts': '',
    'lib.ts': '',
    tools: {},
  };

  // Build operation ID to tool name mapping
  const operationIdMap: Record<string, { toolName: string; operationId: string }> = {};
  const toolNames: string[] = [];

  if (schema.paths) {
    const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

    for (const [path, pathItem] of Object.entries(schema.paths)) {
      if (typeof pathItem !== 'object' || '$ref' in pathItem) continue;

      for (const method of methods) {
        const operation = pathItem[method];
        if (!operation || typeof operation !== 'object') continue;

        // Check if it's a reference or an operation
        if ('$ref' in operation) continue;

        const toolName = generateMcpToolName(path, method);
        const operationId = operation.operationId || `${method}-${path.replace(/[{}]/g, '')}`;

        // Add to operation ID map
        operationIdMap[operationId] = {
          toolName,
          operationId,
        };

        toolNames.push(toolName);

        // Build parameter metadata with required field
        const pathParamMetadata: Record<string, ParamMetadata> = {};
        const queryParamMetadata: Record<string, ParamMetadata> = {};

        if (operation.parameters && Array.isArray(operation.parameters)) {
          for (const param of operation.parameters) {
            if ('$ref' in param) continue;

            const primitiveType = getParameterPrimitiveType(param);
            const isRequired = param.required === true; // Extract required field

            const metadata: ParamMetadata = {
              typePrimitive: primitiveType,
              valueConstraint: false,
              required: isRequired, // Add required to metadata
            };

            if (
              'schema' in param &&
              param.schema &&
              typeof param.schema === 'object' &&
              'enum' in param.schema &&
              Array.isArray(param.schema.enum)
            ) {
              metadata.valueConstraint = true;
              metadata.allowedValues = param.schema.enum;
            }

            if (param.in === 'path') {
              pathParamMetadata[param.name] = metadata;
            } else if (param.in === 'query') {
              queryParamMetadata[param.name] = metadata;
            }
          }
        }

        // Generate tool file
        const toolFile = generateToolFile(
          toolName,
          path,
          method,
          operationId,
          operation,
          pathParamMetadata,
          queryParamMetadata,
        );

        result.tools[`${toolName}.ts`] = toolFile;
      }
    }
  }

  // Generate aggregation files
  result['types.ts'] = generateTypesFile(operationIdMap);
  result['lib.ts'] = generateLibFile();
  result['index.ts'] = generateIndexFile(toolNames);

  return result;
}
