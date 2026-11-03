/**
 * Hermetic CLI-boundary test for `identity audit`: file contents and comms
 * events reach the pure audit through the injected runtime IO seam, never
 * through direct filesystem reads.
 */
import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { collaborationAgentIdSchema } from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const anonymousAgent = collaborationAgentIdSchema.parse({
  agent_name: 'Codex',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: 'unknown',
});

describe('identity audit CLI', () => {
  it('audits comms events read through the runtime IO seam', async () => {
    const fake = createFakeCollaborationRuntime();
    fake.seedTextFile(
      'state/active-claims.json',
      JSON.stringify({ schema_version: '1.4.0', claims: [] }),
    );
    fake.seedTextFile(
      'state/closed-claims.json',
      JSON.stringify({ schema_version: '1.3.0', claims: [] }),
    );
    fake.seedTextFile('state/thread-record.md', '# Next-Session Record\n');
    fake.writeCommsEvent('state/comms', {
      schema_version: '2.0.0',
      event_id: 'anon-event',
      created_at: '2026-04-28T09:00:00Z',
      kind: 'narrative',
      author: anonymousAgent,
      title: 'old event',
      body: 'Anonymous historical event.',
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'identity',
        'audit',
        '--now',
        '2026-04-28T11:05:00Z',
        '--active',
        'state/active-claims.json',
        '--closed',
        'state/closed-claims.json',
        '--thread-record',
        'state/thread-record.md',
        '--comms-dir',
        'state/comms',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    // The audit consults the migrating claims reader before it parses the raw
    // text, so a legacy flat-queue file migrates on this first contact like
    // every other path instead of meeting the version pin.
    expect(fake.readActiveClaimsPaths()).toStrictEqual(['state/active-claims.json']);
    expect(JSON.parse(result.stdout)).toMatchObject({
      summary: {
        total: 1,
        by_classification: {
          'historical-no-repair': 1,
          'live-risk': 0,
          'needs-evidence': 0,
        },
      },
      findings: [
        {
          source: 'comms-event',
          record_ref: 'event:anon-event#author',
          classification: 'historical-no-repair',
        },
      ],
    });
  });
});
