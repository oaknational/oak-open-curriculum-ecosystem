/**
 * Test fixture exposing the canonical `comms-event.schema.json` as a typed
 * `AnySchemaObject`. The schema is imported as a compile-time JSON module, not
 * read from disk, so the tests that assert schema-meets-reality stay IO-free
 * (per `testing-strategy.md`: unit and integration tests trigger no IO). The
 * import resolves the same canonical file the product validator loads at
 * runtime, so the schema-meets-reality property holds.
 */
import { type AnySchemaObject } from 'ajv';

import commsEventSchemaJson from '../../src/collaboration-state/schemas/comms-event.schema.json';

function isAnySchemaObject(value: unknown): value is AnySchemaObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

if (!isAnySchemaObject(commsEventSchemaJson)) {
  throw new Error('comms-event.schema.json must be a JSON object');
}

export const commsEventSchema: AnySchemaObject = commsEventSchemaJson;
