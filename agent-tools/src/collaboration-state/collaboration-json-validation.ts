import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AnySchema } from 'ajv';
import Ajv from 'ajv/dist/2020.js';
import { z } from 'zod';

const SCHEMA_FILENAMES = [
  'active-claims.schema.json',
  'closed-claims.schema.json',
  'comms-event.schema.json',
  'conversation.schema.json',
  'escalation.schema.json',
] as const;

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
  readonly validateText: (schemaId: string, text: string) => void;
}

export async function validateCollaborationJsonFileText(
  filePath: string,
  text: string,
): Promise<void> {
  const validator = await cachedSchemaValidator();
  validator.validateText(collaborationJsonSchemaId(filePath), text);
}

export async function createCollaborationJsonSchemaValidator(
  schemaDir: string = SCHEMAS_DIR,
): Promise<CollaborationJsonSchemaValidator> {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: true });
  addCollaborationFormats(ajv);
  for (const schemaPath of SCHEMA_FILENAMES) {
    const schema: unknown = JSON.parse(await readFile(join(schemaDir, schemaPath), 'utf8'));
    if (isAnySchema(schema)) {
      ajv.addSchema(schema);
    }
  }

  return {
    validateText(schemaId, text): void {
      const value: unknown = JSON.parse(text);
      const validate = ajv.getSchema(schemaId);
      if (validate === undefined) {
        throw new Error(`missing schema ${schemaId}`);
      }
      if (!validate(value)) {
        throw new Error(ajvError(validate.errors));
      }
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
