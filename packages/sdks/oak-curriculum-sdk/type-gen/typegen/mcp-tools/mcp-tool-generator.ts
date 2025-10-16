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
import { generateLibFile } from './parts/generate-lib-file.js';
import { generateDefinitionsFile } from './parts/generate-definitions-file.js';
import { generateBarrelFile } from './parts/generate-index-file.js';
import { getParameterPrimitiveType } from './parts/param-utils.js';
import type { ParamMetadata, ParamMetadataMap } from './parts/param-metadata.js';
import { createMutableParamMetadata } from './parts/param-metadata.js';
import { generateToolDescriptorFile } from './parts/generate-tool-descriptor-file.js';

export type PrimitiveType = string | number | boolean | string[] | number[] | boolean[];
export type PrimitiveTypeLabel =
  | 'string'
  | 'number'
  | 'boolean'
  | 'string[]'
  | 'number[]'
  | 'boolean[]';

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

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
  // string representation of the primitive type
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

  return {
    typePrimitive: primitiveType,
    valueConstraint: hasAllowedValues,
    required: isRequired,
    allowedValues: hasAllowedValues ? [...primitiveEnumValues] : undefined,
    description: typeof schema?.description === 'string' ? schema.description : undefined,
    default: schema && 'default' in schema ? schema.default : undefined,
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
  'index.ts': string;
  'definitions.ts': string;
  'types.ts': string;
  'lib.ts': string;
  'tool-descriptor.ts': string;
  tools: Record<string, string>; // filename -> content
}

export interface McpToolGeneratorDeps {
  readonly responseMapImportPath?: string;
}

export function generateCompleteMcpTools(schema: OpenAPIObject): GeneratedMcpToolFiles {
  const result: GeneratedMcpToolFiles = {
    'index.ts': '',
    'definitions.ts': '',
    'types.ts': '',
    'lib.ts': '',
    'tool-descriptor.ts': '',
    tools: {},
  };

  const operationToToolEntries: { operationId: string; toolName: string }[] = [];
  const toolNamesSet = new Set<string>();
  for (const { path, method, operation } of iterOperations(schema)) {
    const toolName = generateMcpToolName(path, method);
    const operationId = operation.operationId ?? `${method}-${path.replace(/[{}]/g, '')}`;
    operationToToolEntries.push({ operationId, toolName });
    toolNamesSet.add(toolName);

    const { pathParamMetadata, queryParamMetadata } = buildParamMetadataForOperation(operation);
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

  const toolNames = Array.from(toolNamesSet).toSorted();

  result['types.ts'] = generateTypesFile({ toolNames });
  result['lib.ts'] = generateLibFile();
  result['definitions.ts'] = generateDefinitionsFile(toolNames, operationToToolEntries);
  result['index.ts'] = generateBarrelFile();
  result['tool-descriptor.ts'] = generateToolDescriptorFile();

  return result;
}
