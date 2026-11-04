import { join } from 'node:path';

import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { type CollaborationStateCliIo } from '../../src/collaboration-state/cli-runtime';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readCommsEvents,
  readCommsEventsExcluding,
  readDirectedCommsMessages,
  writeCommsEvent,
} from '../../src/collaboration-state/state-io';
import { writeTextFileAtomically } from '../../src/collaboration-state/transaction';
import { type CommsEvent } from '../../src/collaboration-state/types';
import {
  listEntries,
  makeTempCollaborationRepo,
  readText,
  removeDirectory,
  writeText,
} from '../test-helpers/temp-collaboration-state';

describe('collaboration comms event IO', () => {
  it('round-trips adversarial body text through the real comms writer', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    const body = [
      'control:\u0001',
      'raw newline follows',
      'line two with "quotes", `ticks`, $HOME, and unicode snowman \u2603',
      'long segment:',
      'x'.repeat(12000),
    ].join('\n');
    try {
      await writeCommsEvent({
        commsDir,
        nowIso: '2026-06-01T10:00:00Z',
        event: narrativeEvent({ event_id: 'adversarial-body', body }),
      });

      const events = await readCommsEvents(commsDir);

      expect(events).toHaveLength(1);
      expect(events[0]?.body).toBe(body);
      expect(JSON.parse(await readText(join(commsDir, 'adversarial-body.json')))).toHaveProperty(
        'body',
        body,
      );
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('creates no target or temp file when comms event serialization fails schema validation', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    const invalidEvent = {
      ...narrativeEvent({ event_id: 'extra-field' }),
      extra: true,
    };
    try {
      await expect(
        writeCommsEvent({
          commsDir,
          nowIso: '2026-06-01T10:00:00Z',
          event: invalidEvent,
        }),
      ).rejects.toThrow('communication event failed validation');

      expect(await listEntries(commsDir)).toStrictEqual([]);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('hard-fails readCommsEvents and names a malformed event path', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    const badPath = join(commsDir, 'bad-event.json');
    try {
      await writeText(badPath, '{ "schema_version": "2.0.0", "body": "unterminated');

      await expect(readCommsEvents(commsDir)).rejects.toThrow(
        `failed to parse collaboration JSON file ${badPath}`,
      );
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('hard-fails comms render and names a malformed event path', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    const badPath = join(commsDir, 'bad-event.json');
    try {
      await writeText(badPath, '{ "schema_version": "2.0.0", "body": "unterminated');

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'render',
          '--comms-dir',
          commsDir,
          '--output',
          join(repoRoot, 'shared-comms-log.md'),
        ],
        env: {},
        io: filesystemIo(),
      });

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain(`failed to parse collaboration JSON file ${badPath}`);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('hard-fails when the canonical comms directory is missing', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const missingCommsDir = join(repoRoot, '.agent/state/collaboration/missing-comms');
    try {
      await expect(readCommsEvents(missingCommsDir)).rejects.toThrow(missingCommsDir);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

describe('incremental comms drain (MCP-198)', () => {
  it('reads only the events absent from the exclusion set', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    try {
      for (const id of ['seen-one', 'seen-two', 'fresh-one']) {
        await writeCommsEvent({
          commsDir,
          nowIso: '2026-06-01T10:00:00Z',
          event: narrativeEvent({ event_id: id }),
        });
      }

      const events = await readCommsEventsExcluding(commsDir, new Set(['seen-one', 'seen-two']));

      expect(events.map((event) => event.event_id)).toEqual(['fresh-one']);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('does not read an excluded file at all — an unreadable seen event cannot break the drain', async () => {
    // The point of the cure: excluded files are never opened. Corrupting one
    // and still draining successfully is the observable proof that the read
    // is incremental rather than full-then-filtered.
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    try {
      await writeCommsEvent({
        commsDir,
        nowIso: '2026-06-01T10:00:00Z',
        event: narrativeEvent({ event_id: 'fresh-one' }),
      });
      await writeText(join(commsDir, 'already-seen.json'), 'this is not valid json at all');

      const events = await readCommsEventsExcluding(commsDir, new Set(['already-seen']));

      expect(events.map((event) => event.event_id)).toEqual(['fresh-one']);
      await expect(readCommsEvents(commsDir)).rejects.toThrow();
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('returns every event when nothing is excluded', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const commsDir = join(repoRoot, '.agent/state/collaboration/comms');
    try {
      await writeCommsEvent({
        commsDir,
        nowIso: '2026-06-01T10:00:00Z',
        event: narrativeEvent({ event_id: 'only-one' }),
      });

      const events = await readCommsEventsExcluding(commsDir, new Set());

      expect(events.map((event) => event.event_id)).toEqual(['only-one']);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

function narrativeEvent(input: { readonly event_id: string; readonly body?: string }): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: input.event_id,
    created_at: '2026-06-01T10:00:00Z',
    kind: 'narrative',
    author: {
      agent_name: 'Woodland Creeping Petal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019dd3',
    },
    title: 'Valid event',
    body: input.body ?? 'Valid body.',
  };
}

function filesystemIo(): CollaborationStateCliIo {
  return {
    // ok([]) deliberately disables the gate for these IO-focused tests — the
    // fail-closed validation lives in the production loader behind this seam.
    loadCommsConceptGateBlocks: async () => ok([]),
    readActiveClaimsFile,
    readClosedClaimsFile,
    readCommitQueueEntries: async () => [],
    writeCommsEvent,
    readCommsEvents,
    readCommsEventsExcluding,
    readWorktrees: async () => [],
    readDirectedCommsMessages,
    writeTextFile: writeTextFileAtomically,
    readTextFile: readText,
    readSeenIds: async () => new Set(),
    appendSeenMessageIds: async () => undefined,
    migrateLegacyCommsDirectories: async () => {
      throw new Error('migration is not used in this test');
    },
    ensureDirectory: async () => undefined,
  };
}
