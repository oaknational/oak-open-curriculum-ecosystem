import type { OperationObject } from 'openapi3-ts/oas31';
import { emitHeader, emitSchema, emitIndex } from './emitters.js';
import type { ParamMetadataMap, ParamMetadata } from './param-metadata.js';

export type { ParamMetadata };

function buildImports(): string {
  return [
    "import { z } from 'zod';",
    '',
    "import type { ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';",
    "import { getDescriptorSchemaForEndpoint } from '../../../../response-map.js';",
    "import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';",
  ].join('\n');
}

export function generateToolFile(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  const parts: string[] = [];
  parts.push(buildImports());
  parts.push(emitHeader(toolName, path, method, operationId));
  parts.push(emitSchema(operation, pathParamMetadata, queryParamMetadata));
  parts.push(emitIndex(toolName, path, method, operation));
  return parts.join('\n');
}
