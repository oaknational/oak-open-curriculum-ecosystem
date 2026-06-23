/**
 * Validates the `claim` `$def` in `active-claims.schema.json` for the
 * additive optional `role` field (session-role marker, owner-directed
 * 2026-06-12): the schema must (a) accept legacy claims without `role`,
 * (b) accept claims carrying a non-empty string `role`, (c) reject empty
 * or non-string `role` values, and (d) keep rejecting unknown fields so
 * the additive extension does not loosen the authored shape.
 *
 * The runtime type lives on `CollaborationClaim.role`; this test asserts
 * the JSON-schema gate at the storage boundary mirrors that contract.
 */
import Ajv, { type AnySchemaObject } from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

import { activeClaimsSchema } from './active-claims-schema-fixture.js';

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
 * Compile a validator that targets just the `claim` `$def` in isolation,
 * dropping the schema's top-level `properties` so the validator checks
 * only the claim entry shape itself.
 */
function claimValidator(schema: AnySchemaObject): (value: unknown) => boolean {
  if (!isRecord(schema.$defs)) {
    throw new Error('schema $defs must be an object');
  }
  if (!isString(schema.$schema)) {
    throw new Error('schema $schema must be a string URI');
  }
  const validate = ajv().compile({
    $schema: schema.$schema,
    $defs: schema.$defs,
    $ref: '#/$defs/claim',
  });
  return (value) => validate(value) === true;
}

function claimEntry(overrides: Readonly<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    claim_id: '11111111-1111-4111-8111-111111111111',
    agent_id: {
      agent_name: 'Woodland Creeping Petal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019dd3',
    },
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/shared-comms-log.md'] }],
    claimed_at: '2026-06-12T15:00:00Z',
    intent: 'Exercise the claim schema contract.',
    ...overrides,
  };
}

describe('active-claims.schema.json claim $def role field', () => {
  const validates = claimValidator(activeClaimsSchema);

  it('accepts a legacy claim without a role field', () => {
    expect(validates(claimEntry())).toBe(true);
  });

  it('accepts a claim carrying a well-known role value', () => {
    expect(validates(claimEntry({ role: 'director' }))).toBe(true);
  });

  it('accepts a claim carrying an open-vocabulary role value', () => {
    expect(validates(claimEntry({ role: 'gatekeeper' }))).toBe(true);
  });

  it('rejects an empty-string role', () => {
    expect(validates(claimEntry({ role: '' }))).toBe(false);
  });

  it('rejects a non-string role', () => {
    expect(validates(claimEntry({ role: 7 }))).toBe(false);
  });

  it('still rejects unknown fields on the authored claim shape', () => {
    expect(validates(claimEntry({ rank: 'director' }))).toBe(false);
  });
});
