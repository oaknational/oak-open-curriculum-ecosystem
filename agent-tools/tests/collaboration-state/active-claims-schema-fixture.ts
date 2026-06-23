/**
 * Test fixture exposing the canonical `active-claims.schema.json` as a typed
 * `AnySchemaObject`. The schema is imported as a compile-time JSON module, not
 * read from disk, so the tests that assert schema-meets-reality stay IO-free
 * (per `testing-strategy.md`: unit and integration tests trigger no IO). The
 * import resolves the same canonical file the product validator loads at
 * runtime, so the schema-meets-reality property holds. Shared with
 * `agent-id-jsonschema.unit.test.ts`.
 */
import { type AnySchemaObject } from 'ajv';

import activeClaimsSchemaJson from '../../src/collaboration-state/schemas/active-claims.schema.json';

function isAnySchemaObject(value: unknown): value is AnySchemaObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

if (!isAnySchemaObject(activeClaimsSchemaJson)) {
  throw new Error('active-claims.schema.json must be a JSON object');
}

export const activeClaimsSchema: AnySchemaObject = activeClaimsSchemaJson;
