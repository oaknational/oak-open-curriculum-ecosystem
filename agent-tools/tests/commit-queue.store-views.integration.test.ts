import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  COMMIT_QUEUE_TTL_SECONDS,
  commitQueueDirForActivePath,
} from '../src/collaboration-state/commit-queue-store';
import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../src/collaboration-state/types';
import { runCommitQueueCli } from '../src/commit-queue';
import {
  ensureDirectory,
  listEntries,
  makeTempDirectory,
  readText,
  removeDirectory,
  writeText,
} from './test-helpers/temp-collaboration-state';

// Write commands take the wall clock (no --now), so the fixture is anchored
// half a TTL before the real clock and the view clock is derived from it —
// every duration below stays exact while the fixture stays live for writes.
const QUEUED_AT = new Date(Date.now() - (COMMIT_QUEUE_TTL_SECONDS / 2) * 1000).toISOString();
const NOW = new Date(Date.parse(QUEUED_AT) + (COMMIT_QUEUE_TTL_SECONDS / 2) * 1000).toISOString();
const EXPIRES_AT = new Date(Date.parse(QUEUED_AT) + COMMIT_QUEUE_TTL_SECONDS * 1000).toISOString();

const AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
};

const CLAIM = {
  claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  agent_id: AGENT_ID,
  thread: 'queue-ephemera',
  areas: [{ kind: 'git', patterns: ['index/head'] }],
  claimed_at: QUEUED_AT,
  intent: 'Land the queue re-shape.',
};

const INTENT = {
  intent_id: '11111111-1111-4111-8111-111111111111',
  claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  agent_id: AGENT_ID,
  files: ['agent-tools/src/commit-queue/index.ts'],
  commit_subject: 'feat(queue): add commit queue helper',
  queued_at: QUEUED_AT,
  updated_at: QUEUED_AT,
  expires_at: EXPIRES_AT,
  phase: 'queued',
  queued_seq: 0,
};

// The exact per-entry view shape the flat-registry implementation printed —
// the output-parity contract for the directory-backed views.
const VIEW_ENTRY = {
  intent_id: INTENT.intent_id,
  claim_id: INTENT.claim_id,
  agent_id: AGENT_ID,
  files: INTENT.files,
  commit_subject: INTENT.commit_subject,
  queued_at: QUEUED_AT,
  updated_at: QUEUED_AT,
  expires_at: EXPIRES_AT,
  phase: 'queued',
  queue_status: 'active',
  seconds_until_expiry: COMMIT_QUEUE_TTL_SECONDS / 2,
};

function stdoutBuffer(): { readonly stdout: { write(chunk: string): void }; text(): string } {
  const chunks: string[] = [];
  return {
    stdout: {
      write(chunk: string): void {
        chunks.push(chunk);
      },
    },
    text(): string {
      return chunks.join('');
    },
  };
}

describe('commit-queue directory-backed views', () => {
  let repoRoot: string;
  let activePath: string;
  let queueDir: string;

  beforeEach(async () => {
    repoRoot = await makeTempDirectory('oak-commit-queue-views-');
    const collaborationDir = join(repoRoot, '.agent/state/collaboration');
    await ensureDirectory(collaborationDir);
    activePath = join(collaborationDir, 'active-claims.json');
    queueDir = commitQueueDirForActivePath(activePath);
    await ensureDirectory(queueDir);
    await writeText(
      activePath,
      `${JSON.stringify(
        { schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION, claims: [CLAIM] },
        null,
        2,
      )}\n`,
    );
    await writeText(
      join(queueDir, `${INTENT.intent_id}.json`),
      `${JSON.stringify(INTENT, null, 2)}\n`,
    );
  });

  afterEach(async () => {
    await removeDirectory(repoRoot);
  });

  async function runRead(command: string, options: Record<string, string>): Promise<string> {
    const output = stdoutBuffer();
    const exitCode = await runCommitQueueCli({
      command,
      options: { file: [], now: NOW, ...options },
      repoRoot,
      resolveGitRoot: () => {
        throw new Error('resolveGitRoot must not be consulted by read commands');
      },
      stdout: output.stdout,
    });
    expect(exitCode).toBe(0);
    return output.text();
  }

  it('status derives exactly the flat-registry report shape from the directory', async () => {
    expect(await runRead('status', {})).toBe(
      `${JSON.stringify({ total: 1, active: 1, abandoned: 0, entries: [VIEW_ENTRY] }, null, 2)}\n`,
    );
  });

  it('list derives exactly the flat-registry entry shape from the directory', async () => {
    expect(await runRead('list', {})).toBe(`${JSON.stringify([VIEW_ENTRY], null, 2)}\n`);
  });

  it('show reads one file and derives exactly the flat-registry entry shape', async () => {
    expect(await runRead('show', { 'intent-id': INTENT.intent_id })).toBe(
      `${JSON.stringify(VIEW_ENTRY, null, 2)}\n`,
    );
  });

  it('treats an expired intent file as absent from every view', async () => {
    const afterExpiry = new Date(
      Date.parse(QUEUED_AT) + (COMMIT_QUEUE_TTL_SECONDS + 1) * 1000,
    ).toISOString();
    const output = stdoutBuffer();
    await runCommitQueueCli({
      command: 'status',
      options: { file: [], now: afterExpiry },
      repoRoot,
      resolveGitRoot: () => {
        throw new Error('resolveGitRoot must not be consulted by read commands');
      },
      stdout: output.stdout,
    });

    expect(JSON.parse(output.text())).toStrictEqual({
      total: 0,
      active: 0,
      abandoned: 0,
      entries: [],
    });
  });

  it('phase writes rewrite the one intent file and sweep expired peers', async () => {
    const staleAt = new Date(
      Date.parse(QUEUED_AT) - 3 * COMMIT_QUEUE_TTL_SECONDS * 1000,
    ).toISOString();
    const expired = {
      ...INTENT,
      intent_id: '22222222-2222-4222-8222-222222222222',
      queued_at: staleAt,
      updated_at: staleAt,
      expires_at: new Date(Date.parse(staleAt) + COMMIT_QUEUE_TTL_SECONDS * 1000).toISOString(),
    };
    await writeText(
      join(queueDir, `${expired.intent_id}.json`),
      `${JSON.stringify(expired, null, 2)}\n`,
    );

    const exitCode = await runCommitQueueCli({
      command: 'phase',
      options: { file: [], 'intent-id': INTENT.intent_id, phase: 'staging' },
      repoRoot,
      resolveGitRoot: () => {
        throw new Error('resolveGitRoot must not be consulted by registry-only writes');
      },
    });

    expect(exitCode).toBe(0);
    expect(await listEntries(queueDir)).toStrictEqual([`${INTENT.intent_id}.json`]);
    const stored: unknown = JSON.parse(await readText(join(queueDir, `${INTENT.intent_id}.json`)));
    expect(stored).toMatchObject({ intent_id: INTENT.intent_id, phase: 'staging' });
  });

  it('complete deletes the intent file and leaves the claim row untouched', async () => {
    // The legacy pointer is preserved content: queue operations no longer
    // edit claim rows, so complete must leave the row exactly as found.
    const claimWithPointer = { ...CLAIM, intent_to_commit: INTENT.intent_id };
    await writeText(
      activePath,
      `${JSON.stringify(
        { schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION, claims: [claimWithPointer] },
        null,
        2,
      )}\n`,
    );

    const exitCode = await runCommitQueueCli({
      command: 'complete',
      options: { file: [], 'intent-id': INTENT.intent_id },
      repoRoot,
      resolveGitRoot: () => {
        throw new Error('resolveGitRoot must not be consulted by registry-only writes');
      },
    });

    expect(exitCode).toBe(0);
    expect(await listEntries(queueDir)).toStrictEqual([]);
    const written: unknown = JSON.parse(await readText(activePath));
    expect(written).toStrictEqual({
      schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
      claims: [claimWithPointer],
    });
  });

  it('enqueue creates a per-intent file that never enters the claims file', async () => {
    const output = stdoutBuffer();
    const exitCode = await runCommitQueueCli({
      command: 'enqueue',
      options: {
        file: ['agent-tools/src/commit-queue/index.ts'],
        'claim-id': CLAIM.claim_id,
        'agent-name': AGENT_ID.agent_name,
        platform: AGENT_ID.platform,
        model: AGENT_ID.model,
        'session-id-prefix': AGENT_ID.session_id_prefix,
        id: AGENT_ID.id,
        'commit-subject': 'feat(queue): enqueue via store',
        'intent-id': '44444444-4444-4444-8444-444444444444',
      },
      repoRoot,
      resolveGitRoot: () => {
        throw new Error('resolveGitRoot must not be consulted by registry-only writes');
      },
      stdout: output.stdout,
    });

    expect(exitCode).toBe(0);
    expect(output.text()).toBe('44444444-4444-4444-8444-444444444444\n');
    const files = await listEntries(queueDir);
    expect(files).toContain('44444444-4444-4444-8444-444444444444.json');
    const claimsFile: unknown = JSON.parse(await readText(activePath));
    expect(JSON.stringify(claimsFile)).not.toContain('commit_queue');
    expect(claimsFile).toStrictEqual({
      schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
      claims: [CLAIM],
    });
  });
});
