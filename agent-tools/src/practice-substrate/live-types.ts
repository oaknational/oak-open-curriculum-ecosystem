import { join } from 'node:path';

import { finding } from './finding.js';
import { type JsonFieldMap } from './report-evaluators.js';
import { type SubstrateFinding } from './types.js';

export const MANIFEST_PATH =
  '.agent/memory/executive/memory-state-substrate-contracts.manifest.json';
export const MANIFEST_SCHEMA_PATH =
  '.agent/memory/executive/memory-state-substrate-contracts.schema.json';
export const CANONICAL_COMMS_ROOT = '.agent/state/collaboration/comms/';
export const LEGACY_COMMS_ROOTS = [
  '.agent/state/collaboration/comms-events/',
  '.agent/state/collaboration/comms-lifecycle/',
  '.agent/state/collaboration/comms-messages/',
] as const;
export const COMMS_EVENT_SCHEMA_PATH = '.agent/state/collaboration/comms-event.schema.json';
export const SHARED_COMMS_LOG = '.agent/state/collaboration/shared-comms-log.md';
export const ACTIVE_CLAIMS_PATH = '.agent/state/collaboration/active-claims.json';
export const ACTIVE_CLAIMS_SCHEMA_PATH = '.agent/state/collaboration/active-claims.schema.json';
export const CLOSED_CLAIMS_PATH = '.agent/state/collaboration/closed-claims.archive.json';
export const CLOSED_CLAIMS_SCHEMA_PATH = '.agent/state/collaboration/closed-claims.schema.json';
export const CONVERSATIONS_ROOT = '.agent/state/collaboration/conversations/';
export const CONVERSATION_SCHEMA_PATH = '.agent/state/collaboration/conversation.schema.json';
export const ESCALATIONS_ROOT = '.agent/state/collaboration/escalations/';
export const ESCALATION_SCHEMA_PATH = '.agent/state/collaboration/escalation.schema.json';

export interface ManifestReadResult {
  readonly manifest?: ManifestDocument;
  readonly findings: readonly SubstrateFinding[];
}

export interface ManifestDocument {
  readonly discovery?: ManifestDiscovery;
  readonly surface_defaults?: {
    readonly required_contract_fields?: readonly string[];
  };
  readonly surfaces?: readonly JsonFieldMap[];
}

interface ManifestDiscovery {
  readonly fixture_roots?: readonly string[];
  readonly historical_roots?: readonly string[];
  readonly live_roots?: readonly string[];
  readonly doctrine_roots?: readonly string[];
  readonly plan_roots?: readonly string[];
  readonly migration_ledgers?: readonly string[];
  readonly exclusions?: readonly { readonly pattern?: string }[];
}

export interface MigrationLedgerDocument {
  readonly entries?: readonly JsonFieldMap[];
}

export function absolutePath(repoRoot: string, path: string): string {
  return join(repoRoot, path);
}

export function parseFailureFinding(
  surface: string,
  path: string,
  error: unknown,
): SubstrateFinding {
  const invalidJson = error instanceof SyntaxError;
  return finding({
    id: invalidJson ? 'invalid-json' : 'schema-incoherence',
    surface,
    severity: 'blocking',
    repair: 'manual-with-provenance',
    message: invalidJson
      ? `JSON surface ${path} does not parse.`
      : `JSON surface ${path} does not satisfy its schema.`,
    evidence: [path],
  });
}

export function parseManifestDocument(value: unknown): ManifestDocument {
  if (!isJsonFieldMap(value)) {
    return {};
  }

  return {
    discovery: parseManifestDiscovery(value.discovery),
    surface_defaults: parseSurfaceDefaults(value.surface_defaults),
    surfaces: parseJsonObjectArray(value.surfaces),
  };
}

export function parseMigrationLedgerDocument(value: unknown): MigrationLedgerDocument {
  if (!isJsonFieldMap(value)) {
    return {};
  }

  return { entries: parseJsonObjectArray(value.entries) };
}

export function readString(input: JsonFieldMap, field: string): string {
  const value = input[field];
  return typeof value === 'string' ? value : '';
}

export function readOptionalString(input: JsonFieldMap, field: string): string | undefined {
  const value = input[field];
  return typeof value === 'string' ? value : undefined;
}

export function readNumber(input: JsonFieldMap, field: string): number {
  const value = input[field];
  return typeof value === 'number' ? value : -1;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isJsonFieldMap(value: unknown): value is JsonFieldMap {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseManifestDiscovery(value: unknown): ManifestDiscovery | undefined {
  if (!isJsonFieldMap(value)) {
    return undefined;
  }

  return {
    fixture_roots: parseStringArray(value.fixture_roots),
    historical_roots: parseStringArray(value.historical_roots),
    live_roots: parseStringArray(value.live_roots),
    doctrine_roots: parseStringArray(value.doctrine_roots),
    plan_roots: parseStringArray(value.plan_roots),
    migration_ledgers: parseStringArray(value.migration_ledgers),
    exclusions: parseExclusions(value.exclusions),
  };
}

function parseSurfaceDefaults(value: unknown): ManifestDocument['surface_defaults'] {
  if (!isJsonFieldMap(value)) {
    return undefined;
  }

  return { required_contract_fields: parseStringArray(value.required_contract_fields) };
}

function parseExclusions(value: unknown): ManifestDiscovery['exclusions'] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter(isJsonFieldMap).map((entry) => ({
    pattern: readOptionalString(entry, 'pattern'),
  }));
}

function parseStringArray(value: unknown): readonly string[] | undefined {
  return Array.isArray(value) && value.every(isString) ? value : undefined;
}

function parseJsonObjectArray(value: unknown): readonly JsonFieldMap[] | undefined {
  return Array.isArray(value) && value.every(isJsonFieldMap) ? value : undefined;
}
