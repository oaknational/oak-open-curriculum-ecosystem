import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  activeClaimsWriteValidator,
  commitQueueIntentWriteValidator,
} from './state-io-write-validators.js';

/**
 * The composed write gates (contract check, then schema validation). The
 * anchored pin below is the write-gate half of the byte-identity guarantee:
 * the Err arm must carry the parser's ORIGINAL error — a slip to the
 * check's wrapper (whose message is path-prefixed) reddens the anchor. The
 * transaction fold's half (the unwrap that rethrows this Err's error by
 * identity) is pinned in transaction.integration.test.ts. Integration
 * classification: importing the gate module evaluates the schema-directory
 * walk at module level, and the Ajv-leg case below reads the real schema
 * files.
 */

const REGISTRY_PATH = '.agent/state/collaboration/active-claims.json';
const INTENT_PATH =
  '.agent/state/collaboration/commit-queue/33333333-3333-4333-8333-333333333333.json';

const IDLESS_INTENT_ROW = {
  intent_id: '33333333-3333-4333-8333-333333333333',
  claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  agent_id: {
    agent_name: 'Vintage Pre-Sunset Seat',
    platform: 'codex',
    model: 'gpt-4.9',
    session_id_prefix: '00aa11',
  },
  files: ['agent-tools/src/commit-queue/index.ts'],
  commit_subject: 'feat(queue): exercise the composed write gate',
  queued_at: '2026-04-27T07:20:00Z',
  updated_at: '2026-04-27T07:20:00Z',
  expires_at: '2026-04-27T07:35:00Z',
  phase: 'queued',
  queued_seq: 0,
};

function registryText(): string {
  return JSON.stringify({ schema_version: '1.4.0', claims: [] });
}

describe('activeClaimsWriteValidator', () => {
  it('returns the ORIGINAL parser error on a contract failure — anchored so a wrapper slip reddens', async () => {
    const result = await activeClaimsWriteValidator(REGISTRY_PATH)(
      JSON.stringify({ schema_version: '1.4.0', claims: ['not an object'] }),
    );

    expect(unwrapErr(result).message).toMatch(/^claim entries must be objects/);
  });

  it('returns the path-labelled JSON error on malformed text, before any schema validation', async () => {
    const result = await activeClaimsWriteValidator(REGISTRY_PATH)('---\nnot json');

    // Anchored: the check's MalformedJsonError wrapper carries the same
    // prefix WITHOUT the ": <detail>" tail, so a slip to the wrapper reddens.
    expect(unwrapErr(result).message).toMatch(
      /^\.agent\/state\/collaboration\/active-claims\.json is not valid JSON: /,
    );
  });

  it('rejects contract-valid text whose raw form violates the JSON schema — the Ajv leg reads the raw text', async () => {
    // The contract parser spreads the top level and PRESERVES unknown
    // fields, so it accepts this text; only the Ajv leg (raw text,
    // additionalProperties: false) can refuse it. Dropping the schema leg
    // would silently re-open the reconstruction-loss trap.
    const result = await activeClaimsWriteValidator(REGISTRY_PATH)(
      JSON.stringify({
        schema_version: '1.4.0',
        claims: [],
        unknown_extra: true,
      }),
    );

    expect(unwrapErr(result).message).toMatch(/must NOT have additional properties/);
  });

  it('accepts the canonical empty claims file', async () => {
    const result = await activeClaimsWriteValidator(REGISTRY_PATH)(registryText());

    expect(result.ok).toBe(true);
  });
});

describe('commitQueueIntentWriteValidator', () => {
  it('returns the ORIGINAL parser error for an id-less intent — anchored so a wrapper slip reddens', async () => {
    const result = await commitQueueIntentWriteValidator(INTENT_PATH)(
      JSON.stringify(IDLESS_INTENT_ROW),
    );

    expect(unwrapErr(result).message).toMatch(
      /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
    );
  });

  it('accepts a complete intent with the required routing id', async () => {
    const result = await commitQueueIntentWriteValidator(INTENT_PATH)(
      JSON.stringify({
        ...IDLESS_INTENT_ROW,
        agent_id: { ...IDLESS_INTENT_ROW.agent_id, id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50' },
      }),
    );

    expect(result.ok).toBe(true);
  });
});
