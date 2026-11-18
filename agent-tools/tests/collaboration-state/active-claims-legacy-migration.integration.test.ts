import { join } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  isLegacyActiveClaimsText,
  migrateLegacyActiveClaimsFile,
} from '../../src/collaboration-state/active-claims-legacy-migration';
import {
  COMMIT_QUEUE_TTL_SECONDS,
  commitQueueDirForActivePath,
  readCommitQueueEntries,
} from '../../src/collaboration-state/commit-queue-store';
import { readActiveClaimsFile } from '../../src/collaboration-state/state-file-readers';
import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../../src/collaboration-state/types';
import {
  listEntries,
  makeTempDirectory,
  readText,
  removeDirectory,
  writeText,
} from '../test-helpers/temp-collaboration-state';

const NOW = '2026-08-17T12:00:00.000Z';
// The live row's timestamps DISAGREE across the TTL boundary: queued_at is
// three hours before NOW (expired if it were the clock) while updated_at is
// half an hour before NOW (live). The expired row inverts them. Liveness
// read from queued_at would therefore keep and drop exactly the wrong rows.
const STALE_QUEUED_AT = '2026-08-17T09:00:00.000Z';
const LIVE_UPDATED_AT = '2026-08-17T11:30:00.000Z';
const AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
};

// A claim row carrying legacy content (an id-less agent and an unrecognised
// field) that must survive the migration unchanged.
const LEGACY_CLAIM = {
  claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  agent_id: {
    agent_name: 'Woodland Creeping Petal',
    platform: 'codex',
    model: 'GPT-5',
    session_id_prefix: '019dd3',
  },
  thread: 'legacy-thread',
  areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
  claimed_at: '2026-08-17T11:00:00Z',
  intent: 'Legacy claim preserved through migration.',
  notes: 'unrecognised-content-preserved',
};

function legacyEntry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    intent_id: '11111111-1111-4111-8111-111111111111',
    claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    agent_id: AGENT_ID,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): live entry',
    queued_at: STALE_QUEUED_AT,
    updated_at: LIVE_UPDATED_AT,
    expires_at: '2026-08-17T11:45:00.000Z',
    phase: 'queued',
    ...overrides,
  };
}

// A queue row with no intent_id: non-conforming to the intent schema, and
// unrepresentable in a store whose filenames ARE the intent ids.
const LEGACY_ENTRY_WITHOUT_INTENT_ID = {
  claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  agent_id: AGENT_ID,
  files: ['agent-tools/src/commit-queue/index.ts'],
  commit_subject: 'feat(queue): row carrying no intent_id',
  queued_at: STALE_QUEUED_AT,
  updated_at: LIVE_UPDATED_AT,
  expires_at: '2026-08-17T11:45:00.000Z',
  phase: 'queued',
};

function legacyRegistry(): Record<string, unknown> {
  return {
    schema_version: '1.3.0',
    commit_queue: [
      legacyEntry(),
      legacyEntry({
        intent_id: '22222222-2222-4222-8222-222222222222',
        commit_subject: 'feat(queue): expired entry',
        queued_at: '2026-08-17T11:45:00.000Z',
        updated_at: '2026-08-17T09:00:00.000Z',
        expires_at: '2026-08-17T10:00:00.000Z',
      }),
    ],
    claims: [LEGACY_CLAIM],
  };
}

describe('legacy active-claims migration', () => {
  let root: string;
  let activePath: string;
  let queueDir: string;

  beforeEach(async () => {
    root = await makeTempDirectory('oak-active-claims-migration-');
    activePath = join(root, 'active-claims.json');
    queueDir = commitQueueDirForActivePath(activePath);
    await writeText(activePath, `${JSON.stringify(legacyRegistry(), null, 2)}\n`);
  });

  afterEach(async () => {
    await removeDirectory(root);
  });

  it('detects a legacy file by its commit_queue array', async () => {
    expect(isLegacyActiveClaimsText(await readText(activePath))).toBe(true);
    expect(
      isLegacyActiveClaimsText(
        `{ "schema_version": "${ACTIVE_CLAIMS_SCHEMA_VERSION}", "claims": [] }`,
      ),
    ).toBe(false);
    expect(isLegacyActiveClaimsText('{ not json')).toBe(false);
  });

  it('moves live entries to per-intent files and drops expired entries', async () => {
    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });

    expect(await listEntries(queueDir)).toStrictEqual([
      '11111111-1111-4111-8111-111111111111.json',
    ]);
    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });
    expect(entries).toHaveLength(1);
    expect(entries[0].intent_id).toBe('11111111-1111-4111-8111-111111111111');
    expect(entries[0].expires_at).toBe(
      new Date(Date.parse(LIVE_UPDATED_AT) + COMMIT_QUEUE_TTL_SECONDS * 1000).toISOString(),
    );
  });

  it('refuses a legacy file carrying an unparseable queue row, migrating nothing', async () => {
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), commit_queue: [legacyEntry(), LEGACY_ENTRY_WITHOUT_INTENT_ID] },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    // The migration collects the queue rows STRICTLY and plans before it
    // writes, so one row that cannot be represented in the store fails the
    // whole read rather than being silently dropped on the way through.
    // Anchored on the file path plus the parser's own message: the failure
    // must point an operator at the offending machine-local file, and a
    // wrap that swallowed the parser's diagnosis would redden here.
    await expect(readActiveClaimsFile(activePath)).rejects.toThrow(
      `${activePath} commit_queue: missing required string field: intent_id`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('refuses a legacy file carrying an unknown top-level field loudly, never dropping it on the way through', async () => {
    // The migration spreads the top level like every sibling write, so a
    // field the schema does not know reaches the write gate and is refused
    // there (the gate's own additional-properties verdict at the document
    // root); a reconstruction that rebuilt {schema_version, claims} would
    // have dropped it in silence and migrated anyway. Driven at NOW, so the
    // fixture's live row IS live: the empty store below proves the claims
    // document is judged before the first store write, not that the row
    // happened to be expired by the wall clock.
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), unexpected_top_level: 'kept, then refused' },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW })).rejects.toThrow(
      /schema validation failed at \/: must NOT have additional properties/,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('refuses a legacy file whose live rows share an intent_id, migrating nothing', async () => {
    // The legacy array never required unique ids; the store keeps one file
    // per id, so two live rows sharing one would collapse to a single file
    // and the later row would silently replace the earlier.
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), commit_queue: [legacyEntry(), legacyEntry()] },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW })).rejects.toThrow(
      `${activePath} commit_queue: two live entries share intent_id 11111111-1111-4111-8111-111111111111`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('refuses a live legacy row carrying a field the intent schema does not know, migrating nothing', async () => {
    // The parser reconstructs known fields only; without a schema check on
    // the raw row, the unknown field would be destroyed in silence.
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), commit_queue: [legacyEntry({ stowaway: true })] },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW })).rejects.toThrow(
      `${activePath} commit_queue[0]: schema validation failed at /: must NOT have additional properties`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('refuses a live legacy row whose optional note is not a string, instead of dropping it', async () => {
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), commit_queue: [legacyEntry({ notes: 123 })] },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW })).rejects.toThrow(
      `${activePath} commit_queue[0]: schema validation failed at /notes: must be string`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it("carries a live row's optional note into the store", async () => {
    await writeText(
      activePath,
      `${JSON.stringify(
        { ...legacyRegistry(), commit_queue: [legacyEntry({ notes: 'carry me' })] },
        null,
        2,
      )}\n`,
    );

    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });

    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });
    expect(entries.map((entry) => entry.notes)).toStrictEqual(['carry me']);
  });

  it('refuses a live legacy row that already carries queued_seq, instead of overwriting it with the position', async () => {
    const legacyText = `${JSON.stringify(
      { ...legacyRegistry(), commit_queue: [legacyEntry({ queued_seq: 7 })] },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW })).rejects.toThrow(
      `${activePath} commit_queue[0]: legacy rows carry no queued_seq`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('refuses a legacy queue row with a malformed timestamp instead of silently deleting it', async () => {
    // A malformed updated_at parses to NaN, and NaN fails every liveness
    // comparison — without strict timestamp validation the row reads as
    // expired and the migration rewrites the file WITHOUT it: silent
    // deletion of a row that is not provably expired. The migration must
    // refuse loudly, path-labelled, leaving the file untouched.
    const legacyText = `${JSON.stringify(
      {
        ...legacyRegistry(),
        commit_queue: [legacyEntry({ updated_at: 'not-a-timestamp' })],
      },
      null,
      2,
    )}\n`;
    await writeText(activePath, legacyText);

    await expect(readActiveClaimsFile(activePath)).rejects.toThrow(
      `${activePath} commit_queue: invalid ISO date-time for updated_at: not-a-timestamp`,
    );

    expect(await readText(activePath)).toBe(legacyText);
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('carries the legacy array order across as the order key', async () => {
    // The legacy schema declared the ARRAY order to be the queue order, so
    // the migration must carry that position across. Both other candidate
    // orderings are made to disagree with it here: the first array element
    // has the LATER queued_at and the HIGHER intent_id, so a migration that
    // let either decide reverses the queue the agents were relying on.
    const later = '2026-08-17T11:50:00.000Z';
    const earlier = '2026-08-17T11:20:00.000Z';
    await writeText(
      activePath,
      `${JSON.stringify(
        {
          ...legacyRegistry(),
          commit_queue: [
            legacyEntry({
              intent_id: '99999999-9999-4999-8999-999999999999',
              queued_at: later,
              updated_at: LIVE_UPDATED_AT,
            }),
            legacyEntry({
              intent_id: '22222222-2222-4222-8222-222222222222',
              queued_at: earlier,
              updated_at: LIVE_UPDATED_AT,
            }),
          ],
        },
        null,
        2,
      )}\n`,
    );

    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });

    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });
    expect(entries.map((entry) => [entry.intent_id, entry.queued_seq])).toStrictEqual([
      ['99999999-9999-4999-8999-999999999999', 0],
      ['22222222-2222-4222-8222-222222222222', 1],
    ]);
  });

  it('rewrites the claims file in the new shape with the claims text unchanged', async () => {
    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });

    // Raw file text, not a deepEqual on parsed values: the migrated file is
    // byte-identical to the new-shape serialisation of the legacy claims, so
    // a migration that reordered keys or reformatted the rows it does not
    // own reddens here.
    expect(await readText(activePath)).toBe(
      `${JSON.stringify(
        { schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION, claims: legacyRegistry().claims },
        null,
        2,
      )}\n`,
    );
  });

  it('migrates exactly once: a second invocation meets the new shape and no-ops', async () => {
    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });
    const firstText = await readText(activePath);

    await migrateLegacyActiveClaimsFile({ activePath, nowIso: NOW });

    expect(await readText(activePath)).toBe(firstText);
    expect(await listEntries(queueDir)).toStrictEqual([
      '11111111-1111-4111-8111-111111111111.json',
    ]);
  });

  it('migrates transparently on the first read of a legacy file', async () => {
    // The reader hook uses the wall clock for TTL liveness, so the live
    // entry's updated_at must be recent relative to the real clock — while
    // its queued_at stays long expired, so a wall-clock liveness decision
    // reading queued_at drops the entry and reddens this proof.
    const recent = new Date(Date.now() - 60 * 1000).toISOString();
    const legacy = {
      ...legacyRegistry(),
      commit_queue: [legacyEntry({ queued_at: '2026-01-01T00:00:00.000Z', updated_at: recent })],
    };
    await writeText(activePath, `${JSON.stringify(legacy, null, 2)}\n`);

    const registry = unwrapOrThrow(await readActiveClaimsFile(activePath));

    expect(registry).toStrictEqual({
      schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
      claims: [LEGACY_CLAIM],
    });
    expect(await listEntries(queueDir)).toStrictEqual([
      '11111111-1111-4111-8111-111111111111.json',
    ]);
  });
});
