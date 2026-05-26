/**
 * Validates the `agent_id` `$def` in the two canonical JSON schemas
 * (`comms-event.schema.json` and `active-claims.schema.json`) for Phase 0B
 * Cycle 2 of the collaboration-identity-doctrine-enforcement remediation:
 * post-amendment identity blocks carry an optional UUID v5 `id`, and the
 * schema must (a) accept legacy rows without `id`, (b) accept rows with a
 * valid v5 `id`, (c) reject rows with a malformed `id`.
 *
 * The Zod-side enforcement lives in `collaborationAgentIdSchema` /
 * `collaborationAgentIdWriteSchema`; this test asserts the JSON-schema gate
 * at the storage boundary mirrors that contract.
 */
import Ajv, { type AnySchemaObject } from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

import { activeClaimsSchema } from './active-claims-schema-fixture.js';
import { commsEventSchema } from './comms-event-schema-fixture.js';

function ajv(): Ajv {
  return new Ajv({ allErrors: true, strict: false, validateFormats: false });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Compile a validator that targets just the `agent_id` `$def` in isolation,
 * dropping the schema's top-level `oneOf` (comms-event) or `properties`
 * (active-claims) so the validator checks only the identity block itself.
 */
function agentIdValidator(schema: AnySchemaObject): (value: unknown) => boolean {
  if (!isRecord(schema.$defs)) {
    throw new Error('schema $defs must be an object');
  }
  if (!isString(schema.$schema)) {
    throw new Error('schema $schema must be a string URI');
  }
  const validate = ajv().compile({
    $schema: schema.$schema,
    $defs: schema.$defs,
    $ref: '#/$defs/agent_id',
  });
  return (value) => validate(value) === true;
}

const legacyAgentId = {
  agent_name: 'Legacy Agent',
  platform: 'claude',
  model: 'opus-4-7',
  session_id_prefix: 'abc123',
} as const;

const agentIdWithV5 = {
  ...legacyAgentId,
  id: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
} as const;

const agentIdWithMalformedId = {
  ...legacyAgentId,
  id: 'not-a-uuid',
} as const;

const agentIdWithV4 = {
  ...legacyAgentId,
  // version nibble at position 14 is '4', not '5'
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
} as const;

describe('comms-event.schema.json $defs.agent_id (PDR-076a §Cascade item 1)', () => {
  const validate = agentIdValidator(commsEventSchema);

  it('accepts a legacy identity block without id (additive migration path)', () => {
    expect(validate(legacyAgentId)).toBe(true);
  });

  it('accepts a post-amendment identity block carrying a valid UUID v5 id', () => {
    expect(validate(agentIdWithV5)).toBe(true);
  });

  it('rejects a malformed id string (non-UUID)', () => {
    expect(validate(agentIdWithMalformedId)).toBe(false);
  });

  it('rejects a UUID v4 (version nibble at position 14 must be 5)', () => {
    expect(validate(agentIdWithV4)).toBe(false);
  });
});

describe('active-claims.schema.json $defs.agent_id (PDR-076a §Cascade item 1)', () => {
  const validate = agentIdValidator(activeClaimsSchema);

  it('accepts a legacy identity block without id (additive migration path)', () => {
    expect(validate(legacyAgentId)).toBe(true);
  });

  it('accepts a post-amendment identity block carrying a valid UUID v5 id', () => {
    expect(validate(agentIdWithV5)).toBe(true);
  });

  it('rejects a malformed id string (non-UUID)', () => {
    expect(validate(agentIdWithMalformedId)).toBe(false);
  });

  it('rejects a UUID v4 (version nibble at position 14 must be 5)', () => {
    expect(validate(agentIdWithV4)).toBe(false);
  });
});
