import type { OperationObject } from 'openapi-typescript';
import { typeSafeKeys } from '../../../../src/types/helpers.js';
import type { PrimitiveType } from './param-utils.js';
import { emitHeader, emitParams, emitSchema, emitIndex, emitOakTool } from './emitters.js';

export interface ParamMetadata {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
}

// primitive type resolution moved to param-utils

export function generateToolFile(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const pathParams = typeSafeKeys(pathParamMetadata);
  const queryParams = typeSafeKeys(queryParamMetadata);

  const parts: string[] = [];
  parts.push(emitHeader(toolName, path, method, operationId));
  parts.push(emitParams(operation, pathParamMetadata, queryParamMetadata));
  parts.push(emitSchema(operation, pathParamMetadata, queryParamMetadata));
  parts.push(emitIndex(toolName, path, method, operation, pathParams, queryParams));
  parts.push(
    emitOakTool(
      toolName,
      path,
      method,
      operationId,
      operation,
      pathParamMetadata,
      queryParamMetadata,
    ),
  );

  return parts.join('\n');
}
