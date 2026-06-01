import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { type CollaborationStateCliIo } from '../../src/collaboration-state/cli-runtime';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readCommsEvents,
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
    readActiveClaimsFile,
    readClosedClaimsFile,
    writeCommsEvent,
    readCommsEvents,
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
