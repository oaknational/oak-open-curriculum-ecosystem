import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseCommitQueueIntentText } from './registry-entry-parser.js';
import {
  parseClosedClaimsArchive,
  parseCollaborationRegistry,
  parseCommsEvent,
} from './state-parsers.js';

describe('parseCollaborationRegistry', () => {
  it('rejects a non-JSON file (e.g. a markdown file mistakenly passed to --active) with an actionable boundary error naming --active', () => {
    // A markdown file begins with `---` (YAML frontmatter); JSON.parse reads `-`
    // as the start of a number and fails with the position-only V8 message
    // "No number after minus sign in JSON at position 1" — which gives the
    // caller no clue they passed the wrong file. The boundary must explain it.
    const markdown = '---\nfitness_line_target: 400\n---\n\n# Repo Continuity\n';

    expect(unwrapErr(parseCollaborationRegistry(markdown)).message).toMatch(
      /active-claims registry[\s\S]*--active[\s\S]*not valid JSON/,
    );
  });

  it('parses a valid empty registry', () => {
    const registry = unwrapOrThrow(
      parseCollaborationRegistry(JSON.stringify({ schema_version: '1.4.0', claims: [] })),
    );

    expect(registry.claims).toEqual([]);
  });

  it('rejects a foreign schema_version with the exact loud message', () => {
    expect(
      unwrapErr(
        parseCollaborationRegistry(
          JSON.stringify({ schema_version: '1.3.0', commit_queue: [], claims: [] }),
        ),
      ).message,
    ).toBe('active claims registry must use schema_version 1.4.0');
  });

  it('rejects a registry without a claims array with the exact loud message', () => {
    expect(
      unwrapErr(parseCollaborationRegistry(JSON.stringify({ schema_version: '1.4.0' }))).message,
    ).toBe('active claims registry must contain a claims array');
  });

  it.each([
    ['an array', []],
    ['a string', 'legacy'],
    ['an object', {}],
    ['null', null],
  ])('rejects a current-version registry carrying commit_queue as %s', (_label, commitQueue) => {
    // The parser reconstructs {schema_version, claims}, so a non-array
    // admitted here would be dropped in silence on the next write.
    expect(
      unwrapErr(
        parseCollaborationRegistry(
          JSON.stringify({ schema_version: '1.4.0', commit_queue: commitQueue, claims: [] }),
        ),
      ).message,
    ).toContain('must not carry a commit_queue property');
  });
});

describe('parseClosedClaimsArchive', () => {
  it('rejects a non-JSON file with an actionable boundary error naming --closed', () => {
    expect(unwrapErr(parseClosedClaimsArchive('not json at all')).message).toMatch(
      /closed-claims archive[\s\S]*--closed[\s\S]*not valid JSON/,
    );
  });

  it('rejects a foreign schema_version with the exact loud message', () => {
    expect(
      unwrapErr(parseClosedClaimsArchive(JSON.stringify({ schema_version: '1.2.0', claims: [] })))
        .message,
    ).toBe('closed claims archive must use schema_version 1.3.0');
  });

  it('rejects an archive without a claims array with the exact loud message', () => {
    expect(
      unwrapErr(parseClosedClaimsArchive(JSON.stringify({ schema_version: '1.3.0' }))).message,
    ).toBe('closed claims archive must contain a claims array');
  });
});

describe('what parseCommsEvent reports for unusable input', () => {
  it('returns the RAW SyntaxError on malformed JSON: the substrate finding classifier narrows on instanceof', () => {
    // live-types parseFailureFinding distinguishes invalid-json from
    // schema-incoherence via `error instanceof SyntaxError`; a wrapped or
    // relabelled JSON error silently reclassifies every malformed file.
    expect(unwrapErr(parseCommsEvent('not json at all'))).toBeInstanceOf(SyntaxError);
  });

  it('rejects valid non-object JSON with the exact loud message', () => {
    expect(unwrapErr(parseCommsEvent('[]')).message).toBe(
      'communication event must be a JSON object',
    );
  });

  it('labels a schema-invalid object with the single-home failed-validation literal', () => {
    expect(unwrapErr(parseCommsEvent(JSON.stringify({ kind: 'narrative' }))).message).toMatch(
      /^communication event failed validation:/,
    );
  });
});

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

function validIntentRow() {
  return {
    intent_id: '33333333-3333-4333-8333-333333333333',
    claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    agent_id: VALID_INTENT_AGENT_ID,
    files: ['agent-tools/src/collaboration-state/index.ts'],
    commit_subject: 'feat(state): exercise the intent identity boundary',
    queued_at: '2026-04-27T07:20:00Z',
    updated_at: '2026-04-27T07:20:00Z',
    expires_at: '2026-04-27T07:35:00Z',
    phase: 'queued',
    queued_seq: 0,
  };
}

function legacyClaimRow() {
  return {
    claim_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    agent_id: LEGACY_IDLESS_AGENT_ID,
    thread: 'legacy-thread',
    areas: [{ kind: 'files', patterns: ['notes/**'] }],
    claimed_at: '2026-04-27T07:00:00Z',
    intent: 'Pre-sunset legacy row exercising the claim preservation contract.',
    // Fields OUTSIDE parseClaim's reconstructed set: a parser that rebuilds
    // claim rows field-by-field (instead of spreading) drops these, and the
    // whole-row preservation assertions redden.
    freshness_seconds: 14400,
    role: 'implementer',
  };
}

describe('parseCommitQueueIntentText — PDR-076a intent identity boundary', () => {
  it('rejects an id-less intent agent_id loudly, naming the intent and the owner-run recovery', () => {
    const intentText = JSON.stringify({ ...validIntentRow(), agent_id: LEGACY_IDLESS_AGENT_ID });

    expect(
      unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message,
    ).toMatch(
      // Anchored at the message head: an identity-losing wrap PREFIXES the
      // message, so only an anchored pin catches the slip.
      /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id[\s\S]*owner-run/,
    );
  });

  it('round-trips a valid intent row whole, with its routing id intact', () => {
    const parsed = unwrapOrThrow(
      parseCommitQueueIntentText(JSON.stringify(validIntentRow()), 'commit-queue intent'),
    );

    expect(parsed).toEqual(validIntentRow());
  });

  it('rejects a non-ISO updated_at: the TTL clock must never parse to NaN', () => {
    const intentText = JSON.stringify({ ...validIntentRow(), updated_at: 'not-a-timestamp' });

    expect(
      unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message,
    ).toContain('updated_at');
  });

  // The rejection legs below pinned the claims-file intent rows before the
  // per-intent store (registry schema 1.4.0); they are the store file's
  // public failure surface now, so they live at this parser.
  it('rejects an intent without a recognised phase, naming the leg', () => {
    const intentText = JSON.stringify({ ...validIntentRow(), phase: 'mystery' });

    expect(unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message).toBe(
      'unsupported commit queue phase',
    );
  });

  it('rejects an intent without a files array, naming the field', () => {
    const withoutFiles = Object.fromEntries(
      Object.entries(validIntentRow()).filter(([key]) => key !== 'files'),
    );
    const intentText = JSON.stringify(withoutFiles);

    expect(unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message).toBe(
      'files must be an array of strings',
    );
  });

  it('rejects a sparse files array: a hole is never admitted as a string', () => {
    // JSON.stringify renders a hole as null, and null is not a string — the
    // dense check must refuse it rather than let `every` skip the hole.
    const intentText = JSON.stringify({ ...validIntentRow(), files: new Array(1) });

    expect(unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message).toBe(
      'files must be an array of strings',
    );
  });

  it.each([
    ['an empty files array', []],
    ['a files array holding an empty path', ['']],
  ])('rejects %s: an intent names at least one file, as the schema requires', (_label, files) => {
    const intentText = JSON.stringify({ ...validIntentRow(), files });

    expect(unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message).toBe(
      'files must be a non-empty array of non-empty strings',
    );
  });

  it.each([
    ['a negative order key', -1],
    ['a fractional order key', 1.5],
    ['a string order key', '0'],
    ['a missing order key', undefined],
  ])(
    'rejects %s: the order key that keeps queue order alive across rewrites',
    (_label, queuedSeq) => {
      const intentText = JSON.stringify({ ...validIntentRow(), queued_seq: queuedSeq });

      expect(unwrapErr(parseCommitQueueIntentText(intentText, 'commit-queue intent')).message).toBe(
        'queued_seq must be a non-negative integer',
      );
    },
  );
});

describe('parseCollaborationRegistry — claim preservation', () => {
  it('preserves an id-less legacy claim row whole — claims narrow at the comparator, never at parse', () => {
    const parsed = unwrapOrThrow(
      parseCollaborationRegistry(
        JSON.stringify({ schema_version: '1.4.0', claims: [legacyClaimRow()] }),
      ),
    );

    expect(parsed.claims[0]).toEqual(legacyClaimRow());
  });
});

describe('parseClosedClaimsArchive — PDR-076a legacy preservation', () => {
  it('parses an archived id-less claim whole: archive rows keep preservation semantics', () => {
    const parsed = unwrapOrThrow(
      parseClosedClaimsArchive(
        JSON.stringify({
          schema_version: '1.3.0',
          claims: [{ ...legacyClaimRow(), archived_at: '2026-04-28T07:00:00Z' }],
        }),
      ),
    );

    expect(parsed.claims[0]).toEqual({ ...legacyClaimRow(), archived_at: '2026-04-28T07:00:00Z' });
  });
});

describe('parseCollaborationRegistry — reconstruction lossiness (documented divergence)', () => {
  it('DROPS unknown top-level keys: the reconstruction is a domain product, never the raw value schema validation takes', () => {
    // Pins the live lossiness behind the surface-contract module's trap
    // note (and the key-preservation rider): Ajv with
    // additionalProperties:false must always validate the raw parse of the
    // text — validating this reconstruction would pass files it must reject.
    const parsed = unwrapOrThrow(
      parseCollaborationRegistry(
        JSON.stringify({
          schema_version: '1.4.0',
          claims: [],
          custodian_note: 'top-level preservation probe',
        }),
      ),
    );

    expect(parsed).not.toHaveProperty('custodian_note');
  });
});
