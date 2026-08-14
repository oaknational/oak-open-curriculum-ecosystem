import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';

import {
  OAK_MCP_SERVER_NAME,
  POSTHOG_MCP_SOURCE,
  type OakClientFamily,
  type OakClientSurface,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const ACTOR_PSEUDONYM_PATTERN = /^oakph:v1:[a-z0-9][a-z0-9_-]{0,31}:[A-Za-z0-9_-]{43}$/u;

export function isUnknownProperties(value: unknown): value is UnknownProperties {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readOwn(record: UnknownProperties, key: string): unknown {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

export function reportSafely(
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void,
  kind: PostHogOperationalErrorKind,
): void {
  try {
    reportOperationalError(kind);
  } catch {
    // Operational reporting must never change an MCP response.
  }
}

export function isActorPseudonym(value: unknown): value is string {
  return typeof value === 'string' && ACTOR_PSEUDONYM_PATTERN.test(value);
}

export function isValidDuration(value: unknown): value is number {
  return (
    typeof value === 'number' && Number.isFinite(value) && Number.isSafeInteger(value) && value >= 0
  );
}

export function isValidTimestamp(value: unknown): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime());
}

export function isValidOptionalUuid(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === 'string' && UUID_V7_PATTERN.test(value));
}

function asciiLower(value: string): string {
  return value.replaceAll(/[A-Z]/gu, (character) => character.toLowerCase());
}

function hasClientFamilyPrefix(value: string, prefix: 'chatgpt' | 'claude'): boolean {
  if (!value.startsWith(prefix)) {
    return false;
  }

  const boundary = value.at(prefix.length);
  return boundary === undefined || boundary === ' ' || boundary === '/' || boundary === '-';
}

export function normaliseOakClientFamily(value: unknown): OakClientFamily {
  if (typeof value !== 'string') {
    return 'other';
  }

  const normalised = asciiLower(value.trim());
  if (hasClientFamilyPrefix(normalised, 'chatgpt')) {
    return 'chatgpt';
  }
  if (hasClientFamilyPrefix(normalised, 'claude')) {
    return 'claude';
  }
  return 'other';
}

// Tokens must stay evidence-backed: self-declaring client strings, or values
// verified first-hand in live traffic. Unmatched traffic lands in 'other';
// the correction path is a token row plus its derivation-table test row.
const CLIENT_SURFACE_TOKEN_RULES: readonly (readonly [string, OakClientSurface])[] = [
  ['sdk', 'sdk'],
  ['vscode', 'vscode'],
  ['claude-code', 'cli'],
  ['mozilla', 'web'],
];

function isAsciiAlphanumeric(character: string | undefined): boolean {
  return character !== undefined && /[a-z0-9]/u.test(character);
}

function hasTokenSegment(value: string, token: string): boolean {
  let index = value.indexOf(token);
  while (index !== -1) {
    const before = index === 0 ? undefined : value.at(index - 1);
    const after = value.at(index + token.length);
    if (!isAsciiAlphanumeric(before) && !isAsciiAlphanumeric(after)) {
      return true;
    }
    index = value.indexOf(token, index + 1);
  }
  return false;
}

function readClientSurfaceToken(value: unknown): OakClientSurface | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalised = asciiLower(value);
  for (const [token, surface] of CLIENT_SURFACE_TOKEN_RULES) {
    if (hasTokenSegment(normalised, token)) {
      return surface;
    }
  }
  return undefined;
}

export function normaliseOakClientSurface(headerValues: readonly unknown[]): OakClientSurface {
  for (const value of headerValues) {
    const surface = readClientSurfaceToken(value);
    if (surface !== undefined) {
      return surface;
    }
  }
  return 'other';
}

export function isOakClientSurface(value: unknown): value is OakClientSurface {
  return (
    value === 'cli' || value === 'sdk' || value === 'vscode' || value === 'web' || value === 'other'
  );
}

export function commonProperties(snapshot: PolicySnapshot): UnknownProperties {
  return {
    $mcp_source: POSTHOG_MCP_SOURCE,
    $mcp_server_name: OAK_MCP_SERVER_NAME,
    $mcp_server_version: snapshot.serverVersion,
    oak_environment: snapshot.environment,
    oak_release: snapshot.release,
  };
}

function hasExpectedProjection(properties: UnknownProperties, snapshot: PolicySnapshot): boolean {
  return (
    readOwn(properties, 'oak_environment') === snapshot.environment &&
    readOwn(properties, 'oak_release') === snapshot.release
  );
}

export function hasExpectedCommonProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): boolean {
  return (
    hasExpectedProjection(properties, snapshot) &&
    readOwn(properties, '$mcp_source') === POSTHOG_MCP_SOURCE &&
    readOwn(properties, '$mcp_server_name') === OAK_MCP_SERVER_NAME &&
    readOwn(properties, '$mcp_server_version') === snapshot.serverVersion
  );
}

export function isSupportedProtocolVersion(value: unknown): value is string {
  return typeof value === 'string' && SUPPORTED_PROTOCOL_VERSIONS.includes(value);
}

export function isOakClientFamily(value: unknown): value is OakClientFamily {
  return value === 'chatgpt' || value === 'claude' || value === 'other';
}

function compareNames(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

export function sortedCanonicalToolIntersection(
  value: unknown,
  servedToolNames: ReadonlySet<string>,
): readonly string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const names = value.filter(
    (candidate): candidate is string =>
      typeof candidate === 'string' && servedToolNames.has(candidate),
  );
  return [...new Set(names)].sort(compareNames);
}
