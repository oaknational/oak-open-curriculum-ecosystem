import type { OperationObject } from 'openapi3-ts/oas31';
import { emitHeader, emitSchema, emitIndex } from './emitters.js';
import type { ParamMetadataMap, ParamMetadata } from './param-metadata.js';

export type { ParamMetadata };

function buildImports(paginated: boolean): string {
  return [
    "import { z } from 'zod';",
    '',
    "import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';",
    ...(paginated
      ? [
          "import { derivePaginationFromLinkHeader } from '../contract/tool-descriptor.contract.js';",
        ]
      : []),
    "import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';",
    "import { getResponseDescriptorsByOperationId } from '../../response-map.js';",
    "import type { OakApiPathBasedClient } from '../../client-types.js';",
  ].join('\n');
}

/**
 * Pagination is a property of the operation's schema: offset/limit query
 * parameters mark the upstream endpoints that page and send Link headers.
 */
export function isPaginatedQueryMetadata(queryParamMetadata: ParamMetadataMap): boolean {
  return 'offset' in queryParamMetadata && 'limit' in queryParamMetadata;
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
  const paginated = isPaginatedQueryMetadata(queryParamMetadata);
  const parts: string[] = [];
  parts.push(
    buildImports(paginated),
    emitHeader(toolName, path, method, operationId),
    emitSchema(pathParamMetadata, queryParamMetadata),
    emitIndex(toolName, path, method, operationId, operation, paginated),
  );
  return parts.join('\n');
}
