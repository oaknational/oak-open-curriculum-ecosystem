import type { JSONRPCMessage, JSONRPCRequest, RequestId } from '@modelcontextprotocol/sdk/types.js';

import type { OakClientFamily, UnknownProperties } from './event-policy-contract.js';
import {
  isSupportedProtocolVersion,
  isUnknownProperties,
  readOwn,
  sortedCanonicalToolIntersection,
} from './event-policy-helpers.js';

export type ObservedMcpMethod = 'initialize' | 'tools/list' | 'tools/call';

export interface ObservedMcpRequest {
  readonly method: ObservedMcpMethod;
  readonly request: JSONRPCRequest;
}

function isRequestId(value: unknown): value is RequestId {
  return typeof value === 'string' || typeof value === 'number';
}

function isJsonRpcRequest(message: JSONRPCMessage): message is JSONRPCRequest {
  return (
    'method' in message &&
    typeof message.method === 'string' &&
    'id' in message &&
    isRequestId(message.id)
  );
}

export function readObservedRequest(message: JSONRPCMessage): ObservedMcpRequest | null {
  if (!isJsonRpcRequest(message)) {
    return null;
  }
  if (
    message.method !== 'initialize' &&
    message.method !== 'tools/list' &&
    message.method !== 'tools/call'
  ) {
    return null;
  }
  return { method: message.method, request: message };
}

export function readResponseId(message: JSONRPCMessage): RequestId | undefined {
  if ('method' in message || !('id' in message) || !isRequestId(message.id)) {
    return undefined;
  }
  return message.id;
}

export function readParams(request: JSONRPCRequest): UnknownProperties {
  return isUnknownProperties(request.params) ? request.params : {};
}

export function readProtocolVersion(value: unknown): string | undefined {
  return isSupportedProtocolVersion(value) ? value : undefined;
}

export function readClientFamily(value: unknown): OakClientFamily | undefined {
  return value === 'chatgpt' || value === 'claude' || value === 'other' ? value : undefined;
}

export function normaliseDuration(startedAt: number, endedAt: number): number {
  const duration = Math.trunc(endedAt - startedAt);
  if (!Number.isFinite(duration)) {
    return 0;
  }
  return Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, duration));
}

export function canonicalToolName(value: unknown, servedToolNames: ReadonlySet<string>): string {
  return typeof value === 'string' && servedToolNames.has(value) ? value : 'unknown';
}

export function readListedToolNames(
  message: JSONRPCMessage,
  servedToolNames: ReadonlySet<string>,
): string[] | null {
  if (!('result' in message) || !isUnknownProperties(message.result)) {
    return null;
  }

  const tools = readOwn(message.result, 'tools');
  if (!Array.isArray(tools)) {
    return null;
  }

  const names = tools.map((tool) =>
    isUnknownProperties(tool) ? readOwn(tool, 'name') : undefined,
  );
  return [...(sortedCanonicalToolIntersection(names, servedToolNames) ?? [])];
}

export function responseIsError(message: JSONRPCMessage): boolean {
  if ('error' in message) {
    return true;
  }
  return (
    'result' in message &&
    isUnknownProperties(message.result) &&
    readOwn(message.result, 'isError') === true
  );
}
