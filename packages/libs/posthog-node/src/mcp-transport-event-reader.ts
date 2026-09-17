import type { JSONRPCMessage, JSONRPCRequest, RequestId } from '@modelcontextprotocol/sdk/types.js';

import type {
  ClientIdentityHeaders,
  OakClientFamily,
  UnknownProperties,
} from './event-policy-contract.js';
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

function readHeaderValue(headers: UnknownProperties, key: string): unknown {
  const value = readOwn(headers, key);
  return Array.isArray(value) ? value.at(0) : value;
}

const UNREADABLE_HEADERS: ClientIdentityHeaders = { readable: false };

/**
 * Whether an own-property read can actually see this container's entries.
 *
 * @remarks Being an object is not enough, and this is the load-bearing check. A
 * WHATWG `Headers` instance — what MCP SDK v2 supplies at `extra.http.req` — and
 * a `Map` are both objects that pass a plain `typeof` test, yet keep their
 * entries behind accessors that {@link readOwn} cannot reach, so every header
 * would read as absent while the container looked fine. Requiring a plain record
 * (own-property data, `Object.prototype` or a null prototype) means such a
 * container is reported as unreadable rather than as a request that carried no
 * headers — the difference between "the transport shape changed under us" and
 * "this client sent no User-Agent".
 */
function isOwnPropertyReadableRecord(value: unknown): value is UnknownProperties {
  if (!isUnknownProperties(value)) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Reads the ordered client-identity header values, reporting separately when the
 * container itself could not be read.
 *
 * @remarks The vendor-specific header is read before the User-Agent so a
 * query-time resolver can prefer whichever the vendor keeps stable. Values may be
 * `undefined` within a readable container: that is a client that sent no such
 * header, which is a different fact from an unreadable container. Never throws.
 */
export function readClientIdentityHeaders(extra: unknown): ClientIdentityHeaders {
  if (!isUnknownProperties(extra)) {
    return UNREADABLE_HEADERS;
  }
  const requestInfo = readOwn(extra, 'requestInfo');
  if (!isUnknownProperties(requestInfo)) {
    return UNREADABLE_HEADERS;
  }
  const headers = readOwn(requestInfo, 'headers');
  if (!isOwnPropertyReadableRecord(headers)) {
    return UNREADABLE_HEADERS;
  }
  return {
    readable: true,
    values: [
      readHeaderValue(headers, 'x-anthropic-client'),
      readHeaderValue(headers, 'user-agent'),
    ],
  };
}

/**
 * Flattens to the value list for axes whose vocabulary has no member for an
 * unreadable container (the form-factor axis), which therefore treats it exactly
 * as it treats a request carrying no client header.
 */
export function clientIdentityValues(headers: ClientIdentityHeaders): readonly unknown[] {
  return headers.readable ? headers.values : [];
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
