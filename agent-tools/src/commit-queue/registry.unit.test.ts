import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseIntentAgentId } from '../collaboration-state/agent-id.js';
import { parseRegistry, parseRegistryText, readRegistry } from './registry.js';

/**
 * Pure-value description of the commit-queue claims-file parse layer's
 * Result contract (ADR-088). Every error literal below is the layer's
 * public failure surface: consumers (the commit workflow's `load-intent`
 * stage, the CLI boundary, the transaction adapter) relay these messages
 * verbatim, so a reword is a behaviour change and must redden here. The
 * matchers pin the FULL message (`toBe`, or `^`/`$`-anchored regexes) — an
 * unanchored substring match cannot catch a wrapping slip such as `unwrap`
 * in place of `unwrapOrThrow`, which prefixes rather than replaces the
 * message. Intent rows live in the per-intent store since registry schema
 * 1.4.0; their parse contract is pinned at `parseCommitQueueIntentText`.
 */

const REGISTRY_PATH = 'active-claims.json';
const INTENT_ID = '33333333-3333-4333-8333-333333333333';

const VALID_INTENT_AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
};

const LEGACY_IDLESS_AGENT_ID = {
  agent_name: 'Vintage Pre-Sunset Seat',
  platform: 'codex',
  model: 'gpt-4.9',
  session_id_prefix: '00aa11',
};

function legacyClaimRow(): Record<string, unknown> {
  return {
    claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    agent_id: LEGACY_IDLESS_AGENT_ID,
    thread: 'legacy-thread',
    areas: [{ kind: 'files', patterns: ['notes/**'] }],
    claimed_at: '2026-04-27T07:00:00Z',
    intent: 'Pre-sunset legacy row exercising the write-back preservation contract.',
    // Fields OUTSIDE any reconstructed set: field-by-field rebuilding of
    // claim rows drops these and the whole-row equality reddens.
    freshness_seconds: 14400,
    role: 'implementer',
  };
}

function withoutKey(record: Record<string, unknown>, key: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([entryKey]) => entryKey !== key));
}

function registryValue(): Record<string, unknown> {
  return {
    schema_version: '1.4.0',
    claims: [legacyClaimRow()],
    // Unknown top-level key: parseRegistry spreads the top level, so the key
    // survives PARSING (pinned here). Under the latest-only schema contract
    // it is out of schema (additionalProperties false), and the composed Ajv
    // write gate refuses any write-back that still carries it.
    custodian_note: 'top-level preservation probe',
  };
}

describe('parseRegistry', () => {
  it('round-trips a full claims-file value, preserving unknown top-level keys and whole legacy claim rows', () => {
    const value = registryValue();

    const parsed = unwrapOrThrow(parseRegistry(value, REGISTRY_PATH));

    expect(parsed).toEqual(registryValue());
  });

  it('rejects a non-object value naming the registry path', () => {
    const result = parseRegistry('not an object', REGISTRY_PATH);

    const error = unwrapErr(result);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe('active-claims.json must contain a JSON object');
  });

  it('rejects a foreign schema_version naming the registry path', () => {
    const result = parseRegistry({ ...registryValue(), schema_version: '1.3.0' }, REGISTRY_PATH);

    expect(unwrapErr(result).message).toBe(
      'active-claims.json must use schema_version 1.4.0 before commit queue writes',
    );
  });

  it.each([
    ['an array', []],
    ['a string', 'legacy'],
    ['an object', {}],
    ['null', null],
  ])(
    'rejects a claims file carrying commit_queue as %s, naming the per-intent store',
    (_label, commitQueue) => {
      // The write path strips the key by name, so a non-array admitted here
      // would be dropped in silence on the next queue write.
      const result = parseRegistry(
        { ...registryValue(), commit_queue: commitQueue },
        REGISTRY_PATH,
      );

      const error = unwrapErr(result);
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toBe(
        'active-claims.json must not carry a top-level commit_queue property: the queue is ' +
          'machine-local ephemera in the commit-queue/ per-intent store',
      );
    },
  );

  it('rejects a missing claims array naming the registry path', () => {
    const result = parseRegistry(withoutKey(registryValue(), 'claims'), REGISTRY_PATH);

    const error = unwrapErr(result);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe('active-claims.json must contain a top-level claims array');
  });

  it('rejects a non-object claim row', () => {
    const result = parseRegistry({ ...registryValue(), claims: ['not an object'] }, REGISTRY_PATH);

    expect(unwrapErr(result).message).toBe('claims entries must be objects');
  });

  it('rejects a sparse claims hole as a non-object claim row instead of throwing', () => {
    // A hole is not JSON-reachable, but parseRegistry takes `unknown` and its
    // Result contract is exception-freedom for ANY input (ADR-088): the dense
    // mapping must feed the hole to the total parser as undefined.
    const result = parseRegistry({ ...registryValue(), claims: new Array(1) }, REGISTRY_PATH);

    expect(unwrapErr(result).message).toBe('claims entries must be objects');
  });

  it('rejects a claim row without a claim_id, naming the field', () => {
    const result = parseRegistry(
      { ...registryValue(), claims: [{ agent_id: LEGACY_IDLESS_AGENT_ID }] },
      REGISTRY_PATH,
    );

    expect(unwrapErr(result).message).toBe('missing required string field: claim_id');
  });
});

describe('parseRegistryText', () => {
  it('parses valid claims-file JSON text end to end', () => {
    const text = JSON.stringify(registryValue());

    const parsed = unwrapOrThrow(parseRegistryText(text, REGISTRY_PATH));

    expect(parsed).toEqual(registryValue());
  });

  it('labels malformed JSON with the registry path instead of a bare position-only SyntaxError', () => {
    const result = parseRegistryText('---\nnot json', REGISTRY_PATH);

    expect(unwrapErr(result).message).toMatch(/^active-claims\.json is not valid JSON: /);
  });
});

describe('readRegistry (IO failure contract, injected read seam)', () => {
  it('enriches ENOENT into the verify-then-seed instructions for the untracked-by-design registry', async () => {
    const result = await readRegistry(REGISTRY_PATH, {
      readTextFile: async () => {
        throw Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' });
      },
    });

    const message = unwrapErr(result).message;
    expect(message).toMatch(/^active-claims registry not found at active-claims\.json\./);
    expect(message).toContain('untracked-by-design');
    expect(message).toContain('{ "schema_version": "1.4.0", "claims": [] }');
  });

  it('passes a non-ENOENT read failure through as the original error object', async () => {
    const failure = Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' });

    const result = await readRegistry(REGISTRY_PATH, {
      readTextFile: async () => {
        throw failure;
      },
    });

    expect(unwrapErr(result)).toBe(failure);
  });

  it('crashes at detection on a non-Error throwable instead of admitting it to the Result channel', async () => {
    await expect(
      readRegistry(REGISTRY_PATH, {
        readTextFile: async () => {
          throw 'not an error object';
        },
      }),
    ).rejects.toThrow('non-Error value thrown at the state-file read boundary');
  });

  it('crashes at detection on a non-Error throwable even when it carries an ENOENT-shaped code', async () => {
    // The code never buys enrichment: only a real Error takes the
    // verify-then-seed branch; a code-carrying non-Error is a seam defect.
    const structural: Error = { name: 'Error', message: 'shaped like fs, not an instance' };

    await expect(
      readRegistry(REGISTRY_PATH, {
        readTextFile: () => Promise.reject(Object.assign(structural, { code: 'ENOENT' })),
      }),
    ).rejects.toThrow('non-Error value thrown at the state-file read boundary');
  });
});

describe('parseIntentAgentId (Err channel)', () => {
  it('returns the valid write-shape identity untouched', () => {
    const parsed = unwrapOrThrow(parseIntentAgentId(VALID_INTENT_AGENT_ID, INTENT_ID));

    expect(parsed).toEqual(VALID_INTENT_AGENT_ID);
  });

  it('rejects an id-less identity with the full loud message: head names the intent, tail names the owner-run recovery', () => {
    const result = parseIntentAgentId(LEGACY_IDLESS_AGENT_ID, INTENT_ID);

    const message = unwrapErr(result).message;
    expect(message).toMatch(
      /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id \(PDR-076a requires the UUID v5 id on intents\): /,
    );
    expect(message).toMatch(
      /recovery is removing intent 33333333-3333-4333-8333-333333333333 \(owner-run\)\.$/,
    );
  });
});
