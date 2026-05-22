import { describe, expect, it } from 'vitest';

import {
  runCollaborationStateCli,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationRegistry,
  type NarrativeCommsEvent,
} from '../../src/collaboration-state';
import { type CliRuntime } from '../../src/collaboration-state/cli-runtime';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const codexAgent: CollaborationAgentId = {
  agent_name: 'Mossy Blossoming Canopy',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e22',
};

describe('collaboration-state tui CLI integration', () => {
  it('renders text mode from injected collaboration-state IO', async () => {
    const fake = createFakeCollaborationRuntime({
      activeClaims: activeClaims(),
      comms: {
        'state/comms': [
          {
            schema_version: '2.0.0',
            event_id: 'event-1',
            created_at: '2026-05-13T17:47:10Z',
            kind: 'narrative',
            author: codexAgent,
            title: 'Starting P8 live collaboration TUI',
            body: 'No other active agents present in live claims at session open.',
          } satisfies NarrativeCommsEvent,
        ],
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'tui',
        '--format',
        'text',
        '--active',
        'state/active.json',
        '--closed',
        'state/closed.json',
        '--comms-dir',
        'state/comms',
        '--now',
        '2026-05-13T17:50:00Z',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Starting P8 live collaboration TUI');
    expect(result.stdout).toContain('Mossy Blossoming Canopy / codex / 019e22 [active/clear]');
  });

  it('uses repo-root defaults when state paths are not provided', async () => {
    const reads: string[] = [];
    const runtime: CliRuntime = {
      io: {
        readActiveClaimsFile: async (filePath) => {
          reads.push(filePath);
          return activeClaims();
        },
        readClosedClaimsFile: async (filePath) => {
          reads.push(filePath);
          return { schema_version: '1.3.0', claims: [] };
        },
        readCommsEvents: async (commsDir) => {
          reads.push(commsDir);
          return [];
        },
        readDirectedCommsMessages: async () => [],
        readSeenIds: async () => new Set<string>(),
        appendSeenMessageIds: async () => undefined,
        writeCommsEvent: async () => undefined,
        writeTextFile: async () => undefined,
        readTextFile: async () => '',
        ensureDirectory: async () => undefined,
        migrateLegacyCommsDirectories: async () => 0,
      },
    };

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'tui',
        '--format',
        'text',
        '--repo-root',
        '/workspace',
        '--now',
        '2026-05-13T17:50:00Z',
      ],
      env: {},
      io: runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(reads).toEqual([
      '/workspace/.agent/state/collaboration/active-claims.json',
      '/workspace/.agent/state/collaboration/closed-claims.archive.json',
      '/workspace/.agent/state/collaboration/comms',
    ]);
  });

  it('rejects non-positive live refresh intervals', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: ['--', 'tui', '--format', 'text', '--poll-ms', '0'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--poll-ms must be a positive integer');
  });
});

function activeClaims(): CollaborationRegistry {
  return {
    schema_version: '1.3.0',
    commit_queue: [],
    claims: [
      {
        claim_id: 'claim-1',
        agent_id: codexAgent,
        thread: 'agentic-engineering-enhancements',
        areas: [{ kind: 'files', patterns: ['agent-tools/src/collaboration-state/tui/**'] }],
        claimed_at: '2026-05-13T17:47:15Z',
        freshness_seconds: 14400,
        intent: 'Implement mandatory P8 live collaboration TUI slice.',
      } satisfies CollaborationClaim,
    ],
  };
}
