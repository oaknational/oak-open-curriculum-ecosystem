import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { readDirectedCommsMessages } from '../../src/collaboration-state/state-io';

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
  it('writes a directed message from the current identity', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-direct-'));
    const messagesDir = join(tempDir, 'comms-messages');
    const activePath = join(tempDir, 'active-claims.json');

    try {
      await writeEmptyActiveClaims(activePath);
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'direct',
          '--active',
          activePath,
          '--messages-dir',
          messagesDir,
          '--to-agent-name',
          recipient.agent_name,
          '--to-platform',
          recipient.platform,
          '--to-model',
          recipient.model,
          '--to-session-prefix',
          recipient.session_id_prefix,
          '--kind',
          'coordination-request',
          '--subject',
          'Please check this',
          '--body',
          'There is useful coordination here.',
          '--event-id',
          'message-one',
          '--now',
          '2026-05-11T19:45:35Z',
          '--platform',
          'claude-code',
          '--model',
          sender.model,
        ],
        env: {
          OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
          PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
        },
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(
        `wrote directed message message-one to ${join(messagesDir, 'message-one.json')}\n`,
      );
      expect(await readDirectedCommsMessages(messagesDir)).toStrictEqual([
        {
          schema_version: '1.0.0',
          event_id: 'message-one',
          created_at: '2026-05-11T19:45:35Z',
          kind: 'coordination-request',
          from: sender,
          to: recipient,
          subject: 'Please check this',
          body: 'There is useful coordination here.',
        },
      ]);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('replies to a directed message by swapping sender and recipient', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-reply-'));
    const messagesDir = join(tempDir, 'comms-messages');
    const activePath = join(tempDir, 'active-claims.json');

    try {
      await mkdir(messagesDir);
      await writeEmptyActiveClaims(activePath);
      await writeFile(
        join(messagesDir, 'message-one.json'),
        `${JSON.stringify({
          schema_version: '1.0.0',
          event_id: 'message-one',
          created_at: '2026-05-11T19:45:35Z',
          kind: 'coordination-request',
          from: sender,
          to: recipient,
          subject: 'Please check this',
          body: 'There is useful coordination here.',
        })}\n`,
      );

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'reply',
          '--active',
          activePath,
          '--messages-dir',
          messagesDir,
          '--to-event-id',
          'message-one',
          '--kind',
          'coordination-ack',
          '--body',
          'Looks good.',
          '--event-id',
          'message-two',
          '--now',
          '2026-05-11T19:46:35Z',
          '--platform',
          recipient.platform,
          '--model',
          recipient.model,
        ],
        env: {
          CODEX_THREAD_ID: '019e1867-a0a8-7c11-aae3-1bc48533a585',
          OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
        },
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(
        `wrote directed message message-two to ${join(messagesDir, 'message-two.json')}\n`,
      );
      expect(await readDirectedCommsMessages(messagesDir)).toContainEqual({
        schema_version: '1.0.0',
        event_id: 'message-two',
        created_at: '2026-05-11T19:46:35Z',
        kind: 'coordination-ack',
        from: recipient,
        to: sender,
        subject: 're: Please check this',
        body: 'Looks good.',
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

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

  it('watches for a new directed message and marks it seen', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-watch-'));
    const messagesDir = join(tempDir, 'comms-messages');
    const seenFile = join(tempDir, 'seen.txt');
    const streamed: string[] = [];

    try {
      await mkdir(messagesDir);
      const pendingResult = runCollaborationStateCli({
        argv: [
          '--',
          'comms',
          'watch',
          '--messages-dir',
          messagesDir,
          '--agent-name',
          recipient.agent_name,
          '--session-prefix',
          recipient.session_id_prefix,
          '--seen-file',
          seenFile,
          '--poll-ms',
          '20',
          '--max-events',
          '1',
        ],
        env: {},
        stdout: {
          write(chunk: string | Uint8Array): boolean {
            streamed.push(String(chunk));
            return true;
          },
        },
      });

      await delay(40);
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

      const result = await pendingResult;

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('');
      expect(streamed.join('')).toContain('subject: Please check this');
      expect(streamed.join('')).toContain('There is useful coordination here.');
      expect(await readFile(seenFile, 'utf8')).toBe('message-one\n');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});

async function writeEmptyActiveClaims(path: string): Promise<void> {
  await writeFile(path, '{"schema_version":"1.3.0","commit_queue":[],"claims":[]}\n');
}
