import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

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

const schemaValidators = new Map<string, Promise<CollaborationJsonSchemaValidator>>();

export interface CollaborationJsonSchemaValidator {
  readonly validateText: (schemaId: string, text: string) => void;
}

export async function validateCollaborationJsonFileText(
  filePath: string,
  text: string,
): Promise<void> {
  const surface = collaborationJsonSurface(filePath);
  const validator = await cachedSchemaValidator(surface.schemaRoot);
  validator.validateText(surface.schemaId, text);
}

export async function createCollaborationJsonSchemaValidator(
  schemaRoot: string,
): Promise<CollaborationJsonSchemaValidator> {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: true });
  addCollaborationFormats(ajv);
  for (const schemaPath of SCHEMA_FILENAMES) {
    const schema: unknown = JSON.parse(await readFile(join(schemaRoot, schemaPath), 'utf8'));
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

async function cachedSchemaValidator(
  schemaRoot: string,
): Promise<CollaborationJsonSchemaValidator> {
  const cached = schemaValidators.get(schemaRoot);
  if (cached !== undefined) {
    return cached;
  }
  const created = createCollaborationJsonSchemaValidator(schemaRoot);
  schemaValidators.set(schemaRoot, created);
  return created;
}

function collaborationJsonSurface(filePath: string): {
  readonly schemaRoot: string;
  readonly schemaId: string;
} {
  const file = basename(filePath);
  if (file === 'active-claims.json') {
    return { schemaRoot: dirname(filePath), schemaId: 'active-claims.schema.json' };
  }
  if (file === 'closed-claims.archive.json') {
    return { schemaRoot: dirname(filePath), schemaId: 'closed-claims.schema.json' };
  }

  const directory = basename(dirname(filePath));
  if (directory === 'comms') {
    return { schemaRoot: dirname(dirname(filePath)), schemaId: 'comms-event.schema.json' };
  }
  if (directory === 'conversations') {
    return { schemaRoot: dirname(dirname(filePath)), schemaId: 'conversation.schema.json' };
  }
  if (directory === 'escalations') {
    return { schemaRoot: dirname(dirname(filePath)), schemaId: 'escalation.schema.json' };
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
