import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import {
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type DirectedCommsMessage,
} from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// WS-B decision 2 of the ratified follow-on-cures plan (source, don't
// validate), as ruled 2026-08-01: `--to-session-prefix` is OPTIONAL on
// `comms direct` when `--to-id` resolves to a fresh CLAIM row in the live
// registry — claim identities are seed-derived at claim open, so they carry
// canonical provenance. Commit-queue identity fields are operator-typed
// flags (right type, hand-typed provenance) and are NEVER a derivation
// source; the claim∪queue union is read only as evidence — the all-agree
// disagreement test, a membership plausibility net over a supplied value,
// and the queue-only-vs-unresolvable error choice. The exact-match check
// binds only where a prefix was DERIVED; where no live row informs the
// value (queue-only, unresolvable) a supplied prefix is written as-is,
// exactly the pre-derivation contract. Routing is by id alone — a wrong
// prefix corrupts the cross-estate identity-join field, never delivery.

const NOW = '2026-08-01T18:00:00Z';
const COMMS_DIR = 'state/comms';
const ACTIVE = 'state/active-claims.json';

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const recipient = {
  agent_name: 'Sylvan Curving Brook',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '9d2e1a',
} as const;

const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const recipientWithId = deriveCollaborationIdentity({
  platform: recipient.platform,
  model: recipient.model,
  env: {
    PRACTICE_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: recipient.session_id_prefix,
  },
}).agentId;

const senderEnv = {
  PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
};

// A structurally valid UUID whose version nibble is 4, not 5 — right-shaped
// for a generic UUID check, wrong for the agent-id contract.
const V4_SHAPED_ID = '2f5a1c88-9d3e-4f6b-8a2c-0d1e2f3a4b5c';

interface RegistryState {
  readonly activeClaims: CollaborationRegistry;
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
}

function registryWith(input: {
  readonly claims?: readonly CollaborationClaim[];
  readonly queue?: readonly CollaborationCommitQueueEntry[];
}): RegistryState {
  return {
    activeClaims: {
      schema_version: '1.4.0',
      claims: input.claims ?? [],
    },
    commitQueue: input.queue ?? [],
  };
}

function recipientClaim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: 'claim-recipient-1',
    agent_id: recipientWithId,
    thread: 'agent-naming',
    areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
    claimed_at: '2026-08-01T17:30:00Z',
    intent: 'recipient lane under active claim',
    ...overrides,
  };
}

function recipientQueueEntry(
  overrides: Partial<CollaborationCommitQueueEntry> = {},
): CollaborationCommitQueueEntry {
  return {
    intent_id: 'intent-recipient-1',
    claim_id: 'claim-recipient-1',
    agent_id: recipientWithId,
    files: ['agent-tools/README.md'],
    commit_subject: 'docs: queue fixture',
    queued_at: '2026-08-01T17:40:00Z',
    updated_at: '2026-08-01T17:40:00Z',
    expires_at: '2026-08-01T19:00:00Z',
    phase: 'queued',
    queued_seq: 0,
    ...overrides,
  };
}

// Claim row prefix 9d2e1a (canonical) beside a queue row hand-typed zz9999 —
// the operator-typed-flag scenario the ruling names.
const disagreeingQueueRow = recipientQueueEntry({
  agent_id: { ...recipientWithId, session_id_prefix: 'zz9999' },
});

function directArgv(extra: readonly string[]): readonly string[] {
  return [
    '--',
    'comms',
    'direct',
    '--active',
    ACTIVE,
    '--comms-dir',
    COMMS_DIR,
    '--to-agent-name',
    recipientWithId.agent_name,
    '--to-platform',
    recipientWithId.platform,
    '--to-model',
    recipientWithId.model,
    '--kind',
    'coordination-request',
    '--subject',
    'Recipient prefix derivation arm',
    '--body',
    'Directed message exercising the registry-derived recipient prefix.',
    '--event-id',
    'directed-derivation-1',
    '--now',
    NOW,
    '--platform',
    sender.platform,
    '--model',
    sender.model,
    ...extra,
  ];
}

async function runDirect(input: {
  readonly registry?: RegistryState;
  readonly extra: readonly string[];
}): Promise<{
  readonly exitCode: number;
  readonly stderr: string;
  readonly fake: ReturnType<typeof createFakeCollaborationRuntime>;
}> {
  const fake = createFakeCollaborationRuntime({
    activeClaims: input.registry?.activeClaims,
    commitQueue: input.registry?.commitQueue,
  });
  const result = await runCollaborationStateCli({
    argv: [...directArgv(input.extra)],
    env: senderEnv,
    io: fake.runtime.io,
  });

  return { exitCode: result.exitCode, stderr: result.stderr, fake };
}

describe('comms direct recipient-prefix derivation (WS-B decision 2)', () => {
  it('derives the recipient prefix from a fresh claim row when the flag is omitted, reading the named registry exactly once', async () => {
    const { exitCode, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(0);
    // Strict equality pins the recipient block to the five wire fields: the
    // derivation takes the prefix STRING only, never the claim row — so the
    // claim's naming_schema_version cannot launder into the `to` block.
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'directed-derivation-1',
        created_at: NOW,
        kind: 'directed',
        message_kind: 'coordination-request',
        from: senderWithId,
        to: {
          agent_name: recipientWithId.agent_name,
          platform: recipientWithId.platform,
          model: recipientWithId.model,
          session_id_prefix: recipientWithId.session_id_prefix,
          id: recipientWithId.id,
        },
        subject: 'Recipient prefix derivation arm',
        body: 'Directed message exercising the registry-derived recipient prefix.',
      },
    ]);
    // The sender write-guard already reads the registry the operator named;
    // the derivation must reuse that exact read, not open a second one and
    // not resolve a different registry.
    expect(fake.readActiveClaimsPaths()).toStrictEqual([ACTIVE]);
  });

  it('honours a supplied prefix that exactly matches the derived value', async () => {
    const { exitCode, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: [
        '--to-id',
        recipientWithId.id,
        '--to-session-prefix',
        recipientWithId.session_id_prefix,
      ],
    });

    expect(exitCode).toBe(0);
    const [event] = fake.readCommsEvents(COMMS_DIR);
    expect(event).toMatchObject({
      to: { session_id_prefix: recipientWithId.session_id_prefix },
    });
  });

  it('rejects a supplied prefix that contradicts the registry-derived value', async () => {
    const { exitCode, stderr, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', recipientWithId.id, '--to-session-prefix', 'zz9999'],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain(
      `'zz9999' does not match the registry-derived prefix '${recipient.session_id_prefix}'`,
    );
    expect(stderr).toContain('Routing is by id alone');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('skips derivation and requires the flag when live rows disagree on the prefix', async () => {
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()], queue: [disagreeingQueueRow] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('disagree');
    expect(stderr).toContain('9d2e1a');
    expect(stderr).toContain('zz9999');
  });

  it('requires the flag when two fresh claim rows disagree on the prefix', async () => {
    const secondClaim = recipientClaim({
      claim_id: 'claim-recipient-2',
      agent_id: { ...recipientWithId, session_id_prefix: 'bb0000' },
    });
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [recipientClaim(), secondClaim] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('9d2e1a');
    expect(stderr).toContain('bb0000');
  });

  it('honours a supplied prefix matching the claim-side row when live rows disagree', async () => {
    const { exitCode, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()], queue: [disagreeingQueueRow] }),
      extra: [
        '--to-id',
        recipientWithId.id,
        '--to-session-prefix',
        recipientWithId.session_id_prefix,
      ],
    });

    expect(exitCode).toBe(0);
    const [event] = fake.readCommsEvents(COMMS_DIR);
    expect(event).toMatchObject({
      to: { session_id_prefix: recipientWithId.session_id_prefix },
    });
  });

  it('honours a supplied prefix matching the queue-side row when live rows disagree (membership, never claim-validation)', async () => {
    const { exitCode, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()], queue: [disagreeingQueueRow] }),
      extra: ['--to-id', recipientWithId.id, '--to-session-prefix', 'zz9999'],
    });

    expect(exitCode).toBe(0);
    const [event] = fake.readCommsEvents(COMMS_DIR);
    expect(event).toMatchObject({ to: { session_id_prefix: 'zz9999' } });
  });

  it('rejects a supplied prefix that matches no live row when live rows disagree', async () => {
    const { exitCode, stderr, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()], queue: [disagreeingQueueRow] }),
      extra: ['--to-id', recipientWithId.id, '--to-session-prefix', 'qq7777'],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain("'qq7777' matches no live registry row");
    expect(stderr).toContain('9d2e1a');
    expect(stderr).toContain('zz9999');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('requires the flag when the id resolves only through commit-queue rows', async () => {
    const { exitCode, stderr, fake } = await runDirect({
      registry: registryWith({ queue: [recipientQueueEntry()] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('commit-queue');
    expect(stderr).toContain('operator-typed');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('writes a supplied prefix as-is when the id resolves only through commit-queue rows', async () => {
    const { exitCode, fake } = await runDirect({
      registry: registryWith({ queue: [recipientQueueEntry()] }),
      extra: ['--to-id', recipientWithId.id, '--to-session-prefix', 'qq7777'],
    });

    expect(exitCode).toBe(0);
    const [event] = fake.readCommsEvents(COMMS_DIR);
    expect(event).toMatchObject({ to: { session_id_prefix: 'qq7777' } });
  });

  it('requires the flag when the id has no live row at all', async () => {
    const { exitCode, stderr } = await runDirect({
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('no fresh claim row');
  });

  it('ignores a stale claim row when deriving (freshness is the liveness bar)', async () => {
    const staleClaim = recipientClaim({ claimed_at: '2026-08-01T10:00:00Z' });
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [staleClaim] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('no fresh claim row');
  });

  it('never derives from an id-less legacy claim row', async () => {
    const idlessClaim = recipientClaim({
      agent_id: {
        agent_name: recipientWithId.agent_name,
        platform: recipientWithId.platform,
        model: recipientWithId.model,
        session_id_prefix: recipientWithId.session_id_prefix,
      },
    });
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [idlessClaim] }),
      extra: ['--to-id', recipientWithId.id],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix is required');
    expect(stderr).toContain('no fresh claim row');
  });

  it('rejects a malformed --to-id before resolution instead of reading it as unresolvable', async () => {
    const { exitCode, stderr, fake } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', V4_SHAPED_ID],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('UUID v5');
    expect(stderr).not.toContain('--to-session-prefix is required');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('rejects a case-variant --to-id instead of misreading it as unresolvable', async () => {
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', recipientWithId.id.toUpperCase()],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('canonical lowercase');
    expect(stderr).not.toContain('no fresh claim row');
  });

  it('rejects an empty --to-id', async () => {
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', '  '],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-id must not be empty');
  });

  it('rejects a supplied empty prefix instead of writing it', async () => {
    const { exitCode, stderr } = await runDirect({
      registry: registryWith({ claims: [recipientClaim()] }),
      extra: ['--to-id', recipientWithId.id, '--to-session-prefix', '  '],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain('--to-session-prefix must not be empty');
  });
});

describe('comms direct and peer-liveness help document the derivation contract', () => {
  it('documents the optional flag and the token warning in comms direct help', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'direct', '--help'],
      env: {},
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('[--to-session-prefix <prefix>]');
    expect(result.stdout).toContain('fresh CLAIM row');
    expect(result.stdout).toContain('never the rendered visual-disambiguator token');
  });

  it('documents the display-only token warning in comms peer-liveness help', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'peer-liveness', '--help'],
      env: {},
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('visual-disambiguator token');
    expect(result.stdout).toContain('display-only, never the --to-session-prefix value');
  });
});

describe('comms reply under the widened sender resolution', () => {
  const antecedent: DirectedCommsMessage = {
    schema_version: '2.0.0',
    event_id: 'antecedent-1',
    created_at: '2026-08-01T17:50:00Z',
    kind: 'directed',
    message_kind: 'coordination-request',
    from: recipientWithId,
    to: senderWithId,
    subject: 'Original coordination ask',
    body: 'Original coordination body.',
  };

  it('still guards the sender and reads the named registry exactly once', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [COMMS_DIR]: [antecedent] } });
    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'reply',
        '--active',
        ACTIVE,
        '--comms-dir',
        COMMS_DIR,
        '--to-event-id',
        'antecedent-1',
        '--kind',
        'coordination-request',
        '--body',
        'Reply carrying the antecedent recipient block unchanged.',
        '--event-id',
        'reply-1',
        '--now',
        NOW,
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readActiveClaimsPaths()).toStrictEqual([ACTIVE]);
  });
});
