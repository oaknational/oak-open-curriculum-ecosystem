/**
 * Test fixture that loads the canonical `comms-event.schema.json` from disk
 * once and exposes it as a typed `AnySchemaObject`. The schema file is the
 * authority under test, so reading it in a test fixture (rather than a test
 * file directly) keeps `node:fs` out of test files while preserving the
 * schema-meets-reality property the tests assert.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { type AnySchemaObject } from 'ajv';

const schemaUrl = new URL(
  '../../../.agent/state/collaboration/comms-event.schema.json',
  import.meta.url,
);

function isAnySchemaObject(value: unknown): value is AnySchemaObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function loadCommsEventSchema(): AnySchemaObject {
  const parsed: unknown = JSON.parse(readFileSync(fileURLToPath(schemaUrl), 'utf8'));
  if (!isAnySchemaObject(parsed)) {
    throw new Error('comms-event.schema.json must be a JSON object');
  }
  return parsed;
}

export const commsEventSchema: AnySchemaObject = loadCommsEventSchema();
