import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  MalformedJsonError,
  SurfaceContractError,
  checkCollaborationSurfaceContract,
} from './surface-contract.js';

/**
 * The one collaboration-state-owned surface-contract gate. Failure kinds are
 * a closed union narrowed on the literal `kind` — consumers map them to
 * their own finding vocabularies without instanceof sniffing — and every
 * failure carries the original parser error as a typed `causeError`. The
 * composed write gates return that `causeError` as their Err and the
 * transaction layer rethrows it by identity; that half is pinned anchored
 * in state-io-write-validators.integration.test.ts.
 */

const REGISTRY_PATH = '.agent/state/collaboration/active-claims.json';

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
  commit_subject: 'feat(queue): exercise the contract gate',
  queued_at: '2026-04-27T07:20:00Z',
  updated_at: '2026-04-27T07:20:00Z',
  expires_at: '2026-04-27T07:35:00Z',
  phase: 'queued',
  queued_seq: 0,
};

const INTENT_PATH =
  '.agent/state/collaboration/commit-queue/33333333-3333-4333-8333-333333333333.json';

function registryText(): string {
  return JSON.stringify({ schema_version: '1.4.0', claims: [] });
}

describe('checkCollaborationSurfaceContract', () => {
  it('passes a contract-satisfying registry — the Ok arm IS the parsed domain product', () => {
    const result = checkCollaborationSurfaceContract({
      schemaId: 'active-claims.schema.json',
      path: REGISTRY_PATH,
      text: registryText(),
    });

    const checked = unwrapOrThrow(result);
    expect(checked.schema_version).toBe('1.4.0');
    expect(checked.claims).toEqual([]);
  });

  it('passes a contract-satisfying commit-queue intent file — the store surface has its own contract', () => {
    const result = checkCollaborationSurfaceContract({
      schemaId: 'commit-queue-intent.schema.json',
      path: INTENT_PATH,
      text: JSON.stringify({
        ...IDLESS_INTENT_ROW,
        agent_id: { ...IDLESS_INTENT_ROW.agent_id, id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50' },
      }),
    });

    expect(unwrapOrThrow(result).intent_id).toBe('33333333-3333-4333-8333-333333333333');
  });

  it('passes the other two contract surfaces on satisfying text', () => {
    expect(
      checkCollaborationSurfaceContract({
        schemaId: 'closed-claims.schema.json',
        path: '.agent/state/collaboration/closed-claims.archive.json',
        text: JSON.stringify({ schema_version: '1.3.0', claims: [] }),
      }).ok,
    ).toBe(true);
    expect(
      checkCollaborationSurfaceContract({
        schemaId: 'comms-event.schema.json',
        path: '.agent/state/collaboration/comms/e.json',
        text: JSON.stringify({
          schema_version: '2.0.0',
          event_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          created_at: '2026-04-27T07:20:00Z',
          kind: 'narrative',
          author: {
            agent_name: 'Vintage Pre-Sunset Seat',
            platform: 'codex',
            model: 'gpt-4.9',
            session_id_prefix: '00aa11',
          },
          title: 'contract gate probe',
          body: 'contract gate probe body',
        }),
      }).ok,
    ).toBe(true);
  });

  it('classifies a contract violation with kind, path-labelled message, and the ORIGINAL error as causeError', () => {
    const result = checkCollaborationSurfaceContract({
      schemaId: 'commit-queue-intent.schema.json',
      path: INTENT_PATH,
      text: JSON.stringify(IDLESS_INTENT_ROW),
    });

    const failure = unwrapErr(result);
    expect(failure.kind).toBe('contract-failure');
    expect(failure.causeError.message).toMatch(
      /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
    );
    expect(failure.message).toBe(
      `${INTENT_PATH} does not satisfy its surface contract: ${failure.causeError.message}`,
    );
  });

  it('classifies text that is not JSON at all as malformed-json carrying the path-labelled JSON error', () => {
    const result = checkCollaborationSurfaceContract({
      schemaId: 'active-claims.schema.json',
      path: REGISTRY_PATH,
      text: '---\nnot json',
    });

    const failure = unwrapErr(result);
    expect(failure.kind).toBe('malformed-json');
    expect(failure.message).toBe(`${REGISTRY_PATH} is not valid JSON`);
    expect(failure.causeError.message).toMatch(
      /^\.agent\/state\/collaboration\/active-claims\.json is not valid JSON: /,
    );
  });

  it('the failure classes compose path-labelled messages and expose the original error as causeError', () => {
    const original = new Error('the original loud message');

    const contract = new SurfaceContractError({ path: REGISTRY_PATH, causeError: original });
    expect(contract.kind).toBe('contract-failure');
    expect(contract.name).toBe('SurfaceContractError');
    expect(contract.message).toBe(
      `${REGISTRY_PATH} does not satisfy its surface contract: the original loud message`,
    );
    expect(contract.causeError).toBe(original);

    const malformed = new MalformedJsonError({ path: REGISTRY_PATH, causeError: original });
    expect(malformed.kind).toBe('malformed-json');
    expect(malformed.name).toBe('MalformedJsonError');
    expect(malformed.message).toBe(`${REGISTRY_PATH} is not valid JSON`);
    expect(malformed.causeError).toBe(original);
  });
});
