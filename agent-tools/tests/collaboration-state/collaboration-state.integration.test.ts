import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';

const recipient = {
  agent_name: 'Galactic Transiting Orbit',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e18',
} as const;

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

describe('collaboration-state comms integration', () => {
  it('accepts all three comms directories when rendering the shared log', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-render-'));
    const outputPath = join(tempDir, 'shared-comms-log.md');

    try {
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'render',
          '--events-dir',
          join(tempDir, 'comms-events'),
          '--lifecycle-dir',
          join(tempDir, 'comms-lifecycle'),
          '--messages-dir',
          join(tempDir, 'comms-messages'),
          '--output',
          outputPath,
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(await readFile(outputPath, 'utf8')).toContain(
        '# Agent-to-Agent Shared Communication Log',
      );
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('prints and marks unseen directed messages for one agent', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-inbox-'));
    const messagesDir = join(tempDir, 'comms-messages');
    const seenFile = join(tempDir, 'seen.txt');

    try {
      await mkdir(messagesDir);
      await writeFile(
        join(messagesDir, 'message-one.json'),
        `${JSON.stringify({
          schema_version: '1.0.0',
          event_id: 'message-one',
          created_at: '2026-05-11T19:46:35Z',
          kind: 'coordination-request',
          from: sender,
          to: recipient,
          subject: 'Please check this',
          body: 'There is useful coordination here.',
        })}\n`,
      );

      const first = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'inbox',
          '--messages-dir',
          messagesDir,
          '--agent-name',
          recipient.agent_name,
          '--seen-file',
          seenFile,
        ],
        env: {},
      });

      expect(first.exitCode).toBe(0);
      expect(first.stdout).toContain('subject: Please check this');
      expect(first.stdout).toContain('There is useful coordination here.');
      expect(await readFile(seenFile, 'utf8')).toBe('message-one\n');

      const second = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'inbox',
          '--messages-dir',
          messagesDir,
          '--agent-name',
          recipient.agent_name,
          '--seen-file',
          seenFile,
        ],
        env: {},
      });

      expect(second.exitCode).toBe(0);
      expect(second.stdout).toBe('no new directed messages\n');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('prints unseen directed messages for every recipient with the wildcard agent name', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-inbox-all-'));
    const messagesDir = join(tempDir, 'comms-messages');

    try {
      await mkdir(messagesDir);
      await writeFile(
        join(messagesDir, 'message-one.json'),
        `${JSON.stringify({
          schema_version: '1.0.0',
          event_id: 'message-one',
          created_at: '2026-05-11T19:46:35Z',
          kind: 'coordination-request',
          from: sender,
          to: recipient,
          subject: 'For Galactic',
          body: 'One directed message.',
        })}\n`,
      );
      await writeFile(
        join(messagesDir, 'message-two.json'),
        `${JSON.stringify({
          schema_version: '1.0.0',
          event_id: 'message-two',
          created_at: '2026-05-11T19:47:35Z',
          kind: 'coordination-request',
          from: sender,
          to: { ...recipient, agent_name: 'Flamebright Burning Lava' },
          subject: 'For Flamebright',
          body: 'Another directed message.',
        })}\n`,
      );

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'inbox',
          '--messages-dir',
          messagesDir,
          '--agent-name',
          '*',
          '--seen-file',
          join(tempDir, 'seen.txt'),
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('subject: For Galactic');
      expect(result.stdout).toContain('subject: For Flamebright');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
