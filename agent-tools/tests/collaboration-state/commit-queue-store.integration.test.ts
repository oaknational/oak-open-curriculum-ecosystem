import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import {
  COMMIT_QUEUE_TTL_SECONDS,
  commitQueueDirForActivePath,
  deleteCommitQueueEntry,
  readCommitQueueEntries,
  readCommitQueueEntry,
  writeCommitQueueEntry,
} from '../../src/collaboration-state/commit-queue-store';
import { type CollaborationCommitQueueEntry } from '../../src/collaboration-state/types';
import {
  createDanglingSymlink,
  ensureDirectory,
  listEntries,
  makeTempDirectory,
  readText,
  removeDirectory,
  writeText,
} from '../test-helpers/temp-collaboration-state';

const NOW = '2026-08-17T12:00:00.000Z';
// Three hours before NOW: a queued_at already well past one TTL, so any
// liveness or expiry arithmetic reading queued_at instead of updated_at
// reddens the TTL proofs below instead of passing by coincidence.
const STALE_QUEUED_AT = '2026-08-17T09:00:00.000Z';

function entry(
  overrides: Partial<CollaborationCommitQueueEntry> = {},
): CollaborationCommitQueueEntry {
  return {
    intent_id: '11111111-1111-4111-8111-111111111111',
    claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    agent_id: {
      agent_name: 'Prismatic Waxing Constellation',
      platform: 'codex',
      model: 'gpt-5.5',
      session_id_prefix: '019dcd',
      id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
    },
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): add commit queue helper',
    queued_at: NOW,
    updated_at: NOW,
    expires_at: '2026-08-17T13:00:00.000Z',
    phase: 'queued',
    queued_seq: 0,
    ...overrides,
  };
}

function secondsAfter(iso: string, seconds: number): string {
  return new Date(Date.parse(iso) + seconds * 1000).toISOString();
}

describe('commit-queue per-intent store — write validation backstop', () => {
  let root: string;
  let queueDir: string;

  beforeEach(async () => {
    root = await makeTempDirectory('oak-commit-queue-store-validate-');
    queueDir = join(root, 'commit-queue');
  });

  afterEach(async () => {
    await removeDirectory(root);
  });

  it('refuses to write an entry whose intent_id is not a UUID, creating no file', async () => {
    // The schema's lowercase-UUID pattern on intent_id is the write
    // validator's own refusing leg (the CLI boundary refuses earlier):
    // prove the backstop bites so neither leg silently becomes the only
    // one. The pattern subsumes the `uuid` format here — it is what the
    // validator reports, because the case-insensitive format alone would
    // admit the aliasing uppercase variant.
    await expect(
      writeCommitQueueEntry({
        queueDir,
        entry: entry({ intent_id: 'not-a-uuid' }),
        nowIso: NOW,
      }),
    ).rejects.toThrow(/must match pattern/i);

    expect(await listEntries(queueDir)).toStrictEqual([]);
  });

  it('refuses to write an entry whose intent_id is not lowercase, creating no file', async () => {
    // Uppercase hex satisfies the `uuid` FORMAT, so only the schema's
    // lowercase pattern refuses it. Two case variants are one file on a
    // case-insensitive filesystem: the second write would silently replace
    // the first live intent, and every later read of the directory would
    // then fail the store's filename/id equality check.
    await expect(
      writeCommitQueueEntry({
        queueDir,
        entry: entry({ intent_id: '11111111-1111-4111-8111-11111111111A' }),
        nowIso: NOW,
      }),
    ).rejects.toThrow(/must match pattern/i);

    expect(await listEntries(queueDir)).toStrictEqual([]);
  });

  it('refuses an exclusive create onto an occupied path, naming the collision', async () => {
    // The create path is defence-in-depth behind the queue's own duplicate
    // refusal: `link` EEXISTs on a path already taken, which is the only
    // check that can see a case-ALIAS the in-memory queue cannot. The
    // occupied path is planted directly so the proof is identical on a
    // case-sensitive host.
    await ensureDirectory(queueDir);
    await writeText(
      join(queueDir, '11111111-1111-4111-8111-111111111111.json'),
      `${JSON.stringify(entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS) }), null, 2)}\n`,
    );

    await expect(
      writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW, publish: 'create' }),
    ).rejects.toThrow(/11111111-1111-4111-8111-111111111111.*already exists/s);
  });
});

describe('commit-queue per-intent store', () => {
  let root: string;
  let queueDir: string;

  beforeEach(async () => {
    root = await makeTempDirectory('oak-commit-queue-store-');
    queueDir = commitQueueDirForActivePath(join(root, 'active-claims.json'));
  });

  afterEach(async () => {
    await removeDirectory(root);
  });

  it('resolves the store directory as a commit-queue sibling of the claims file', () => {
    expect(commitQueueDirForActivePath('/repo/.agent/state/collaboration/active-claims.json')).toBe(
      join('/repo', '.agent', 'state', 'collaboration', 'commit-queue'),
    );
  });

  it('round-trips one intent through its per-intent file', async () => {
    await writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW });

    expect(await listEntries(queueDir)).toStrictEqual([
      '11111111-1111-4111-8111-111111111111.json',
    ]);
    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });
    expect(entries).toStrictEqual([
      entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS) }),
    ]);
  });

  it('keeps expires_at derived from updated_at at exactly one TTL on every write', async () => {
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({ queued_at: STALE_QUEUED_AT, expires_at: '2030-01-01T00:00:00.000Z' }),
      nowIso: NOW,
    });

    const stored = await readCommitQueueEntry({
      queueDir,
      intentId: '11111111-1111-4111-8111-111111111111',
      nowIso: NOW,
    });
    expect(stored?.expires_at).toBe(secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS));
  });

  it('treats an entry as live just under the TTL boundary', async () => {
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({ queued_at: STALE_QUEUED_AT }),
      nowIso: NOW,
    });

    const justUnder = secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS - 1);
    expect(await readCommitQueueEntries({ queueDir, nowIso: justUnder })).toHaveLength(1);
    expect(
      await readCommitQueueEntry({
        queueDir,
        intentId: '11111111-1111-4111-8111-111111111111',
        nowIso: justUnder,
      }),
    ).toBeDefined();
  });

  it('treats an entry as absent just over the TTL boundary', async () => {
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({ queued_at: STALE_QUEUED_AT }),
      nowIso: NOW,
    });

    const justOver = secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS + 1);
    expect(await readCommitQueueEntries({ queueDir, nowIso: justOver })).toStrictEqual([]);
    expect(
      await readCommitQueueEntry({
        queueDir,
        intentId: '11111111-1111-4111-8111-111111111111',
        nowIso: justOver,
      }),
    ).toBeUndefined();
  });

  it('sweeps expired files it encounters on every write operation', async () => {
    await writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW });

    const later = secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS + 60);
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({
        intent_id: '22222222-2222-4222-8222-222222222222',
        queued_at: later,
        updated_at: later,
      }),
      nowIso: later,
    });

    expect(await listEntries(queueDir)).toStrictEqual([
      '22222222-2222-4222-8222-222222222222.json',
    ]);
  });

  it('sweeps expired files on delete operations', async () => {
    await writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW });
    const later = secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS + 60);
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({
        intent_id: '22222222-2222-4222-8222-222222222222',
        queued_at: later,
        updated_at: later,
      }),
      nowIso: later,
    });
    const evenLater = secondsAfter(later, COMMIT_QUEUE_TTL_SECONDS + 60);

    await deleteCommitQueueEntry({
      queueDir,
      intentId: '99999999-9999-4999-8999-999999999999',
      nowIso: evenLater,
    });

    expect(await listEntries(queueDir)).toStrictEqual([]);
  });

  it('reads an absent directory as an empty queue', async () => {
    expect(await readCommitQueueEntries({ queueDir, nowIso: NOW })).toStrictEqual([]);
  });

  it('orders live entries by queued_seq alone', async () => {
    // The flat registry expressed queue order as ARRAY POSITION. The store
    // has no array, so `queued_seq` carries it — and it is the sole key:
    // `queued_at` ties at machine speed and stays for TTL and display only,
    // while intent_id orders by whichever random UUID was drawn. Both are
    // made to disagree with the seq here.
    const earlier = '2026-08-17T11:59:00.000Z';
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({ intent_id: '99999999-9999-4999-8999-999999999999', queued_seq: 0 }),
      nowIso: NOW,
    });
    await writeCommitQueueEntry({
      queueDir,
      entry: entry({
        intent_id: '22222222-2222-4222-8222-222222222222',
        queued_at: earlier,
        updated_at: earlier,
        queued_seq: 1,
      }),
      nowIso: NOW,
    });

    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });
    expect(entries.map((stored) => stored.intent_id)).toStrictEqual([
      '99999999-9999-4999-8999-999999999999',
      '22222222-2222-4222-8222-222222222222',
    ]);
  });

  it('reads a file deleted between enumeration and read as an absent entry, never a crash', async () => {
    // The unlocked-reader race (TUI, active-agents, comms identity guard):
    // a concurrent LOCKED complete/sweep deletes a file after readdir listed
    // it. The dangling symlink is the deterministic stand-in — listed by the
    // enumeration, ENOENT at the read.
    await writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW });
    await createDanglingSymlink(join(queueDir, '55555555-5555-4555-8555-555555555555.json'));

    const entries = await readCommitQueueEntries({ queueDir, nowIso: NOW });

    expect(entries.map((stored) => stored.intent_id)).toStrictEqual([
      '11111111-1111-4111-8111-111111111111',
    ]);
  });

  it('fails loudly naming the file when an intent file is corrupt', async () => {
    await ensureDirectory(queueDir);
    const path = join(queueDir, '11111111-1111-4111-8111-111111111111.json');
    await writeText(path, '{ not json');

    await expect(readCommitQueueEntries({ queueDir, nowIso: NOW })).rejects.toThrow(path);
  });

  it('rejects an intent file whose name disagrees with its intent_id', async () => {
    await ensureDirectory(queueDir);
    const mismatched = join(queueDir, '33333333-3333-4333-8333-333333333333.json');
    await writeText(
      mismatched,
      `${JSON.stringify(entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS) }), null, 2)}\n`,
    );

    await expect(readCommitQueueEntries({ queueDir, nowIso: NOW })).rejects.toThrow(
      '33333333-3333-4333-8333-333333333333.json',
    );
  });

  it('rejects an intent file whose stored expires_at disagrees with updated_at plus the TTL', async () => {
    // Liveness reads updated_at while the guards and views read expires_at:
    // a file where the two disagree would be live to one and expired to the
    // other, so the read boundary refuses it by name.
    await ensureDirectory(queueDir);
    const path = join(queueDir, '11111111-1111-4111-8111-111111111111.json');
    await writeText(
      path,
      `${JSON.stringify(entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS + 1) }), null, 2)}\n`,
    );

    await expect(readCommitQueueEntries({ queueDir, nowIso: NOW })).rejects.toThrow(
      /carries expires_at .* which disagrees with updated_at plus the TTL/,
    );
  });

  it('rejects an intent file carrying a field the intent schema does not know, before any rewrite could drop it', async () => {
    // Per-intent files carry no version pin of their own; the read boundary
    // validates the raw text against the intent schema so an unknown key
    // fails loudly instead of vanishing on the next phase rewrite.
    await ensureDirectory(queueDir);
    const path = join(queueDir, '11111111-1111-4111-8111-111111111111.json');
    const consistent = entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS) });
    await writeText(path, `${JSON.stringify({ ...consistent, stowaway: true }, null, 2)}\n`);

    await expect(readCommitQueueEntries({ queueDir, nowIso: NOW })).rejects.toThrow(
      /must NOT have additional properties/,
    );
  });
});

// Re-read after write proves durable content, not in-memory echo.
async function readStoredText(queueDir: string, intentId: string): Promise<string> {
  return readText(join(queueDir, `${intentId}.json`));
}

describe('commit-queue store file format', () => {
  it('writes two-space-indented JSON with a trailing newline, comms-store style', async () => {
    const root = await makeTempDirectory('oak-commit-queue-store-format-');
    const queueDir = commitQueueDirForActivePath(join(root, 'active-claims.json'));
    await writeCommitQueueEntry({ queueDir, entry: entry(), nowIso: NOW });

    const text = await readStoredText(queueDir, '11111111-1111-4111-8111-111111111111');
    expect(text.endsWith('\n')).toBe(true);
    expect(JSON.parse(text)).toStrictEqual(
      entry({ expires_at: secondsAfter(NOW, COMMIT_QUEUE_TTL_SECONDS) }),
    );

    await removeDirectory(root);
  });
});
