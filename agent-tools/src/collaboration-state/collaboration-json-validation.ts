import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

import { err, ok, type Result } from '@oaknational/result';
import type { AnySchema } from 'ajv';
import Ajv from 'ajv/dist/2020.js';
import { z } from 'zod';

import { failureAsError } from '../core/failure-as-error.js';

export const SCHEMA_FILENAMES = [
  'active-claims.schema.json',
  'closed-claims.schema.json',
  'comms-event.schema.json',
  'commit-queue-intent.schema.json',
  'conversation.schema.json',
  'escalation.schema.json',
] as const;

/** One collaboration schema filename — the surface-identity vocabulary. */
export type CollaborationSchemaId = (typeof SCHEMA_FILENAMES)[number];

/**
 * Absolute path to the collaboration schemas
 * (`agent-tools/src/collaboration-state/schemas/`), resolved by walking from
 * this module up to the agent-tools package root. Works from both the `tsx`
 * source path and the compiled `dist/` path — both resolve to the source
 * `schemas/` directory, which always exists (`tsc` ships no JSON to `dist/`).
 *
 * Decoupled from the validated data file's location (WS7): the schemas no
 * longer live beside the `.agent/state/collaboration/` data they validate, so
 * the schema root is fixed at this module's package, not derived from the data
 * path.
 */
function resolveSchemasDir(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  const filesystemRoot = parse(dir).root;
  while (dir !== filesystemRoot) {
    if (existsSync(join(dir, 'package.json'))) {
      return join(dir, 'src', 'collaboration-state', 'schemas');
    }
    dir = dirname(dir);
  }
  throw new Error('collaboration schema resolution: agent-tools package root not found');
}

const SCHEMAS_DIR = resolveSchemasDir();

let cachedValidator: Promise<CollaborationJsonSchemaValidator> | undefined;

export interface CollaborationJsonSchemaValidator {
  // Result-typed by design (ADR-088): the old bare-void slot accepted a
  // Result-returning implementation silently — the compiler-silent seam
  // class the surface-contract story exists to kill.
  readonly validateText: (schemaId: string, text: string) => Result<void, Error>;
}

export async function validateCollaborationJsonFileText(
  filePath: string,
  text: string,
): Promise<Result<void, Error>> {
  const validator = await cachedSchemaValidator();
  return validator.validateText(collaborationJsonSchemaId(filePath), text);
}

/**
 * The ONE Ajv construction for collaboration-state schema validation —
 * exported so in-suite schema gates mirror the product write validator by
 * construction (same options, same format set). A separately-built test
 * Ajv drifts: `validateFormats: false` is blind to a malformed
 * `date-time` or `uuid`, exactly the class the formats cover.
 */
export function createCollaborationAjv(): Ajv {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: true });
  addCollaborationFormats(ajv);
  return ajv;
}

export async function createCollaborationJsonSchemaValidator(
  schemaDir: string = SCHEMAS_DIR,
): Promise<CollaborationJsonSchemaValidator> {
  const ajv = createCollaborationAjv();
  for (const schemaPath of SCHEMA_FILENAMES) {
    const schema: unknown = JSON.parse(await readFile(join(schemaDir, schemaPath), 'utf8'));
    if (isAnySchema(schema)) {
      ajv.addSchema(schema);
    }
  }

  return {
    validateText(schemaId, text): Result<void, Error> {
      // Malformed text enters the Err channel like every other failure: a
      // throw here would be an undeclared second failure channel on a
      // Result-typed slot (the compiler-silent class this module names).
      let value: unknown;
      try {
        value = JSON.parse(text);
      } catch (failure) {
        return err(failureAsError(failure, 'the collaboration schema-validation JSON boundary'));
      }
      const validate = ajv.getSchema(schemaId);
      if (validate === undefined) {
        return err(new Error(`missing schema ${schemaId}`));
      }
      if (!validate(value)) {
        return err(new Error(ajvError(validate.errors)));
      }
      return ok(undefined);
    },
  };
}

function ajvError(errors: Ajv['errors']): string {
  const first = errors?.[0];
  if (first === undefined) {
    return 'schema validation failed';
  }
  return `schema validation failed at ${first.instancePath || '/'}: ${first.message ?? 'invalid'}`;
}

async function cachedSchemaValidator(): Promise<CollaborationJsonSchemaValidator> {
  cachedValidator ??= createCollaborationJsonSchemaValidator();
  return cachedValidator;
}

function collaborationJsonSchemaId(filePath: string): string {
  const file = basename(filePath);
  if (file === 'active-claims.json') {
    return 'active-claims.schema.json';
  }
  if (file === 'closed-claims.archive.json') {
    return 'closed-claims.schema.json';
  }

  const directory = basename(dirname(filePath));
  if (directory === 'comms') {
    return 'comms-event.schema.json';
  }
  if (directory === 'commit-queue') {
    return 'commit-queue-intent.schema.json';
  }
  if (directory === 'conversations') {
    return 'conversation.schema.json';
  }
  if (directory === 'escalations') {
    return 'escalation.schema.json';
  }

  throw new Error(`unsupported collaboration JSON state path ${filePath}`);
}

function addCollaborationFormats(ajv: Ajv): void {
  ajv.addFormat('date-time', {
    type: 'string',
    validate: (value: string) => z.iso.datetime({ offset: true }).safeParse(value).success,
  });
  ajv.addFormat('date', {
    type: 'string',
    validate: (value: string) => z.iso.date().safeParse(value).success,
  });
  ajv.addFormat('uuid', {
    type: 'string',
    validate: (value: string) => z.uuid().safeParse(value).success,
  });
}

function isAnySchema(value: unknown): value is AnySchema {
  return typeof value === 'boolean' || (typeof value === 'object' && value !== null);
}
