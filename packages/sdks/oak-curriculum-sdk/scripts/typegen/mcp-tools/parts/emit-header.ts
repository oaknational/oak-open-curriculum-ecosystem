export function emitHeader(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
): string {
  const lines: string[] = [];
  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: ${toolName}
 * Path: ${path}
 * Method: ${method.toUpperCase()}
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";

const operationId= '${operationId}' as const;
const name= '${toolName}' as const;
const path= '${path}' as const;
const method= '${method.toUpperCase()}' as const;

`);
  return lines.join('\n');
}
