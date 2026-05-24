import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';

import { type AnySchema } from 'ajv';
import Ajv from 'ajv/dist/2020.js';

import {
  ACTIVE_CLAIMS_SCHEMA_PATH,
  CLOSED_CLAIMS_SCHEMA_PATH,
  COMMS_EVENT_SCHEMA_PATH,
  CONVERSATION_SCHEMA_PATH,
  ESCALATION_SCHEMA_PATH,
  absolutePath,
  isJsonFieldMap,
  parseFailureFinding,
  readNumber,
  readString,
} from './live-types.js';
import { evaluateParseState } from './structural-evaluators.js';
import { type JsonFieldMap, type MigrationLedgerEntrySnapshot } from './report-evaluators.js';
import { type SubstrateFinding } from './types.js';

export interface ParsedJsonText {
  readonly value?: unknown;
  readonly findings: readonly SubstrateFinding[];
}

export async function collaborationAjv(repoRoot: string): Promise<Ajv> {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  for (const path of [
    ACTIVE_CLAIMS_SCHEMA_PATH,
    CLOSED_CLAIMS_SCHEMA_PATH,
    COMMS_EVENT_SCHEMA_PATH,
    CONVERSATION_SCHEMA_PATH,
    ESCALATION_SCHEMA_PATH,
  ]) {
    const schema: unknown = JSON.parse(await readFile(absolutePath(repoRoot, path), 'utf8'));
    if (isAnySchema(schema)) {
      ajv.addSchema(schema);
    }
  }

  return ajv;
}

export function parseJsonText(surface: string, path: string, text: string): ParsedJsonText {
  try {
    return { value: JSON.parse(text), findings: [] };
  } catch (error) {
    return { findings: [parseFailureFinding(surface, path, error)] };
  }
}

export function validateWithAjv(
  ajv: Ajv,
  schemaId: string,
  surface: string,
  path: string,
  value: unknown,
): readonly SubstrateFinding[] {
  const validate = ajv.getSchema(schemaId);
  if (validate !== undefined && validate(value)) {
    return [];
  }

  return evaluateParseState({ surface, path, json: 'valid', schema: 'invalid' });
}

export function schemaValidationFindings(input: {
  readonly surface: string;
  readonly path: string;
  readonly schema: unknown;
  readonly value: unknown;
}): readonly SubstrateFinding[] {
  if (!isAnySchema(input.schema)) {
    return evaluateParseState({
      surface: input.surface,
      path: input.path,
      json: 'valid',
      schema: 'invalid',
    });
  }

  const validate = new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(
    input.schema,
  );
  return validate(input.value)
    ? []
    : evaluateParseState({
        surface: input.surface,
        path: input.path,
        json: 'valid',
        schema: 'invalid',
      });
}

export async function listJsonFiles(repoRoot: string, root: string): Promise<readonly string[]> {
  const entries = await readdir(absolutePath(repoRoot, root)).catch(() => []);
  return entries
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => `${root}${entry}`)
    .toSorted((left, right) => left.localeCompare(right));
}

export async function toMigrationLedgerEntry(
  repoRoot: string,
  entry: JsonFieldMap,
): Promise<MigrationLedgerEntrySnapshot> {
  const targetPath = readString(entry, 'target_path');
  const targetBytes = await readFile(absolutePath(repoRoot, targetPath)).catch(() => undefined);

  return {
    originalPath: readString(entry, 'original_path'),
    targetPath,
    recordedSha256: readString(entry, 'sha256'),
    actualSha256:
      targetBytes === undefined
        ? 'missing-target'
        : createHash('sha256').update(targetBytes).digest('hex'),
    recordedByteCount: readNumber(entry, 'byte_count'),
    actualByteCount: targetBytes?.byteLength ?? -1,
  };
}

function isAnySchema(value: unknown): value is AnySchema {
  return typeof value === 'boolean' || isJsonFieldMap(value);
}
