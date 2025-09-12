import type { OpenAPI3, OperationObject, ParameterObject } from 'openapi-typescript';
import {
  typeSafeEntries,
  typeSafeKeys,
  isPlainObject,
  getOwnValue,
} from '../../../src/types/helpers.js';
import { generateMcpToolName } from './name-generator.js';
import { emitHeader } from './parts/emit-header.js';
import { emitParams } from './parts/emit-params.js';
import { emitSchema } from './parts/emit-schema.js';
import { emitIndex } from './parts/emit-index.js';
import { generateTypesFile } from './parts/generate-types-file.js';
import { generateLibFile } from './parts/generate-lib-file.js';
import { generateIndexFile } from './parts/generate-index-file.js';
import { getParameterPrimitiveType } from './parts/param-utils.js';

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]';

export interface ParamMetadata {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
  description?: string;
  default?: unknown;
}

function generateToolFile(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const parts: string[] = [];
  parts.push(emitHeader(toolName, path, method, operationId));
  parts.push(emitParams(operation, pathParamMetadata, queryParamMetadata));
  parts.push(emitSchema(operation, pathParamMetadata, queryParamMetadata));
  parts.push(
    emitIndex(
      toolName,
      path,
      method,
      operation,
      typeSafeKeys(pathParamMetadata),
      typeSafeKeys(queryParamMetadata),
    ),
  );
  return parts.join('\n');
}

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

function isPathItemObject(value: unknown): boolean {
  return isPlainObject(value) && getOwnValue(value, '$ref') === undefined;
}

function isOperationObject(value: unknown): value is OperationObject {
  return isPlainObject(value) && getOwnValue(value, '$ref') === undefined;
}

function iterOperations(
  schema: OpenAPI3,
): { path: string; method: (typeof HTTP_METHODS)[number]; operation: OperationObject }[] {
  const out: { path: string; method: (typeof HTTP_METHODS)[number]; operation: OperationObject }[] =
    [];
  if (!schema.paths) return out;
  for (const [path, pathItem] of typeSafeEntries(schema.paths)) {
    if (!isPathItemObject(pathItem)) continue;
    for (const method of HTTP_METHODS) {
      const op: unknown = getOwnValue(pathItem, method);
      if (!isOperationObject(op)) continue;
      out.push({ path, method, operation: op });
    }
  }
  return out;
}

function extractDefaultValue(schemaObj: unknown): unknown {
  return getOwnValue(schemaObj, 'default');
}

function extractEnumValues(schemaObj: unknown): readonly unknown[] | undefined {
  const raw: unknown = getOwnValue(schemaObj, 'enum');
  return Array.isArray(raw) ? raw : undefined;
}

function extractParamMetadata(param: ParameterObject): ParamMetadata {
  const primitiveType = getParameterPrimitiveType(param);
  const isRequired = param.required === true;
  const metadata: ParamMetadata = {
    typePrimitive: primitiveType,
    valueConstraint: false,
    required: isRequired,
  };
  const schemaObj = param.schema;
  if (schemaObj && typeof schemaObj === 'object') {
    const descDesc = Object.getOwnPropertyDescriptor(schemaObj, 'description');
    if (typeof descDesc?.value === 'string') {
      metadata.description = descDesc.value;
    }
    const defaultValue = extractDefaultValue(schemaObj);
    if (defaultValue !== undefined) {
      metadata.default = defaultValue;
    }
    const e = extractEnumValues(schemaObj);
    if (e !== undefined) {
      metadata.valueConstraint = true;
      metadata.allowedValues = e;
    }
  }
  return metadata;
}

function buildParamMetadataForOperation(operation: OperationObject): {
  pathParamMetadata: Record<string, ParamMetadata>;
  queryParamMetadata: Record<string, ParamMetadata>;
} {
  const pathParamMetadata: Record<string, ParamMetadata> = {};
  const queryParamMetadata: Record<string, ParamMetadata> = {};
  const parameters = operation.parameters;
  if (!parameters || !Array.isArray(parameters)) {
    return { pathParamMetadata, queryParamMetadata };
  }
  for (const param of parameters) {
    if ('$ref' in param) continue;
    const metadata = extractParamMetadata(param);
    if (param.in === 'path') {
      pathParamMetadata[param.name] = metadata;
    } else if (param.in === 'query') {
      queryParamMetadata[param.name] = metadata;
    }
  }
  return { pathParamMetadata, queryParamMetadata };
}

export interface GeneratedMcpToolFiles {
  'index.ts': string;
  'types.ts': string;
  'lib.ts': string;
  tools: Record<string, string>; // filename -> content
}

export function generateCompleteMcpTools(schema: OpenAPI3): GeneratedMcpToolFiles {
  const result: GeneratedMcpToolFiles = {
    'index.ts': '',
    'types.ts': '',
    'lib.ts': '',
    tools: {},
  };

  const operationIdMap: Record<string, { toolName: string; operationId: string }> = {};
  const toolNames: string[] = [];

  for (const { path, method, operation } of iterOperations(schema)) {
    const toolName = generateMcpToolName(path, method);
    const operationId = operation.operationId ?? `${method}-${path.replace(/[{}]/g, '')}`;
    operationIdMap[operationId] = { toolName, operationId };
    toolNames.push(toolName);

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

  result['types.ts'] = generateTypesFile(operationIdMap);
  result['lib.ts'] = generateLibFile();
  result['index.ts'] = generateIndexFile(toolNames);

  return result;
}
