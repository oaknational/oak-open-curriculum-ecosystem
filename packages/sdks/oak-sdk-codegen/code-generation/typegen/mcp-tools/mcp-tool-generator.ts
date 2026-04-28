import type {
  OperationObject,
  ParameterObject,
  PathItemObject,
  SchemaObject,
  OpenAPIObject,
} from 'openapi3-ts/oas31';

import { generateMcpToolName } from './name-generator.js';
import { generateToolFile } from './parts/generate-tool-file.js';
import { generateTypesFile } from './parts/generate-types-file.js';
import { generateExecuteFile } from './parts/generate-execute-file.js';
import { generateRuntimeIndexFile } from './parts/generate-runtime-index-file.js';
import { generateDefinitionsFile } from './parts/generate-definitions-file.js';
import { generateScopesSupportedFile } from './parts/generate-scopes-supported-file.js';
import { generateRootIndexFile } from './parts/generate-index-file.js';
import { getParameterPrimitiveType, extractExampleValue } from './parts/param-utils.js';
import type { ParamMetadata, ParamMetadataMap } from './parts/param-metadata.js';
import { createMutableParamMetadata } from './parts/param-metadata.js';
import { generateToolDescriptorFile } from './parts/generate-tool-descriptor-file.js';
import { generateUndocumentedResponseErrorFile } from './parts/generate-undocumented-response-error-file.js';
import { applyParamDescriptionOverrides } from './parts/param-description-overrides.js';
import { generateStubModules } from './stub-modules.js';
import { sampleSchemaObject } from './schema-sample-core.js';
import { createSchemaResolver, resolveResponseSchemaForOperation } from './response-schema.js';
export type PrimitiveType = string | number | boolean | string[] | number[] | boolean[];
export type PrimitiveTypeLabel =
  | 'string'
  | 'number'
  | 'boolean'
  | 'string[]'
  | 'number[]'
  | 'boolean[]';

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

/** Paths excluded from MCP tool generation — superseded by ES search or non-transportable. */
const SKIPPED_PATHS: readonly string[] = [
  '/search/lessons',
  '/search/transcripts',
  '/lessons/{lesson}/assets/{type}',
];

function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !('$ref' in value);
}

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if ('$ref' in value) {
    return false;
  }
  const maybeOperation = value;
  if ('operationId' in maybeOperation && typeof maybeOperation.operationId !== 'string') {
    return false;
  }
  if ('parameters' in maybeOperation && !Array.isArray(maybeOperation.parameters)) {
    return false;
  }
  return (
    'responses' in maybeOperation &&
    typeof maybeOperation.responses === 'object' &&
    maybeOperation.responses !== null
  );
}

function iterOperations(
  schema: OpenAPIObject,
): { path: string; method: (typeof HTTP_METHODS)[number]; operation: OperationObject }[] {
  const out: { path: string; method: (typeof HTTP_METHODS)[number]; operation: OperationObject }[] =
    [];
  if (!schema.paths) {
    return out;
  }
  for (const [path, pathItem] of Object.entries(schema.paths)) {
    if (SKIPPED_PATHS.some((skipped) => path === skipped)) {
      continue;
    }
    if (!isPathItemObject(pathItem)) {
      continue;
    }
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!isOperationObject(op)) {
        continue;
      }
      out.push({ path, method, operation: op });
    }
  }
  return out;
}

function getSchema(param: ParameterObject): SchemaObject | undefined {
  if (!param.schema) {
    return undefined;
  }
  if (typeof param.schema !== 'object') {
    return undefined;
  }
  if ('$ref' in param.schema) {
    return undefined;
  }
  return param.schema;
}

function extractParamMetadata(param: ParameterObject): ParamMetadata {
  const primitiveType = getParameterPrimitiveType(param);
  const isRequired = param.required === true;
  const schema = getSchema(param);
  const enumValues = Array.isArray(schema?.enum) ? schema.enum : undefined;
  const primitiveEnumValues = enumValues
    ?.map((value) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
      return undefined;
    })
    .filter((value): value is string | number | boolean => value !== undefined);
  const hasAllowedValues = Array.isArray(primitiveEnumValues) && primitiveEnumValues.length > 0;

  // Parameter-level description/example takes precedence over schema-level
  const paramDescription = typeof param.description === 'string' ? param.description : undefined;
  const schemaDescription =
    typeof schema?.description === 'string' ? schema.description : undefined;
  const paramExample = extractExampleValue(param);
  const schemaExample = schema ? extractExampleValue(schema) : undefined;

  return {
    typePrimitive: primitiveType,
    valueConstraint: hasAllowedValues,
    required: isRequired,
    allowedValues: hasAllowedValues ? [...primitiveEnumValues] : undefined,
    description: paramDescription ?? schemaDescription,
    default: schema && 'default' in schema ? schema.default : undefined,
    example: paramExample ?? schemaExample,
  };
}

function buildParamMetadataForOperation(operation: OperationObject): {
  pathParamMetadata: ParamMetadataMap;
  queryParamMetadata: ParamMetadataMap;
} {
  const pathParamMetadata: ParamMetadataMap = {};
  const queryParamMetadata: ParamMetadataMap = {};
  const parameters = operation.parameters;
  if (!parameters || parameters.length === 0) {
    return { pathParamMetadata, queryParamMetadata };
  }
  for (const param of parameters) {
    if ('$ref' in param) {
      continue;
    }
    const metadata = createMutableParamMetadata(extractParamMetadata(param));
    if (param.in === 'path') {
      pathParamMetadata[param.name] = metadata;
      continue;
    }
    if (param.in === 'query') {
      queryParamMetadata[param.name] = metadata;
    }
  }
  return { pathParamMetadata, queryParamMetadata };
}

export interface GeneratedMcpToolFiles {
  index: string;
  contract: Record<string, string>;
  data: {
    'definitions.ts': string;
    'scopes-supported.ts': string;
    tools: Record<string, string>;
  };
  aliases: Record<string, string>;
  runtime: Record<string, string>;
  stubs: {
    'index.ts': string;
    'tools/index.ts': string;
    tools: Record<string, string>;
  };
}

export interface McpToolGeneratorDeps {
  readonly responseMapImportPath?: string;
}

export function generateCompleteMcpTools(schema: OpenAPIObject): GeneratedMcpToolFiles {
  const result: GeneratedMcpToolFiles = {
    index: '',
    contract: {},
    data: {
      'definitions.ts': '',
      'scopes-supported.ts': '',
      tools: {},
    },
    aliases: {},
    runtime: {},
    stubs: {
      'index.ts': '',
      'tools/index.ts': '',
      tools: {},
    },
  };

  const operationToToolEntries: { operationId: string; toolName: string }[] = [];
  const toolNamesSet = new Set<string>();
  const stubPayloads = new Map<string, unknown>();
  const resolveSchemaRef = createSchemaResolver(schema);

  for (const { path, method, operation } of iterOperations(schema)) {
    const toolName = generateMcpToolName(path, method);
    const operationId = operation.operationId ?? `${method}-${path.replace(/[{}]/g, '')}`;
    operationToToolEntries.push({ operationId, toolName });
    toolNamesSet.add(toolName);

    const { pathParamMetadata, queryParamMetadata } = buildParamMetadataForOperation(operation);
    applyParamDescriptionOverrides(path, pathParamMetadata, queryParamMetadata);
    const toolFile = generateToolFile(
      toolName,
      path,
      method,
      operationId,
      operation,
      pathParamMetadata,
      queryParamMetadata,
    );
    result.data.tools[`${toolName}.ts`] = toolFile;

    const responseSchema = resolveResponseSchemaForOperation(schema, operation, resolveSchemaRef);
    if (responseSchema) {
      const sampled = sampleSchemaObject(responseSchema, resolveSchemaRef);
      stubPayloads.set(toolName, sampled ?? null);
    }
  }

  const toolNames = Array.from(toolNamesSet).toSorted();

  result.aliases['types.ts'] = generateTypesFile();
  result.runtime['execute.ts'] = generateExecuteFile(toolNames);
  result.runtime['index.ts'] = generateRuntimeIndexFile();
  result.data['definitions.ts'] = generateDefinitionsFile(toolNames, operationToToolEntries);
  result.data['scopes-supported.ts'] = generateScopesSupportedFile();
  result.index = generateRootIndexFile();
  result.contract['tool-descriptor.contract.ts'] = generateToolDescriptorFile();
  result.contract['undocumented-response-error.ts'] = generateUndocumentedResponseErrorFile();
  result.stubs = generateStubModules(toolNames, stubPayloads);

  return result;
}
