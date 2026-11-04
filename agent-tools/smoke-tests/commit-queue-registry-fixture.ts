/**
 * Shared fixtures for the commit-queue registry and store smokes: the
 * legacy id-less claim row, the valid intent identity, and the temp
 * claims-file + per-intent-store scaffolding both suites prove against.
 */
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { COMMIT_QUEUE_TTL_SECONDS } from '../src/collaboration-state/commit-queue-store';

export const LEGACY_CLAIM = {
  claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  agent_id: {
    agent_name: 'Vintage Pre-Sunset Seat',
    platform: 'codex',
    model: 'gpt-4.9',
    session_id_prefix: '00aa11',
  },
  thread: 'legacy-thread',
  areas: [{ kind: 'files', patterns: ['notes/**'] }],
  claimed_at: '2026-04-27T07:00:00Z',
  intent: 'Pre-sunset legacy row exercising the write-back preservation contract.',
  // Fields OUTSIDE the parsers' reconstructed set: a parser that rebuilds
  // claim rows field-by-field (instead of spreading) drops these, and the
  // raw-JSON preservation proofs redden.
  freshness_seconds: 14400,
  role: 'implementer',
};

export const VALID_INTENT_AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
};

export const INTENT_ID = '33333333-3333-4333-8333-333333333333';

interface RawAgentIdRow {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
  readonly id?: string;
}

/** The pre-1.4.0 (schema 1.3.0) queue row: no order key — the field postdates it. */
export interface LegacyIntentRow {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly agent_id: RawAgentIdRow;
  readonly files: readonly string[];
  readonly commit_subject: string;
  readonly queued_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly phase: string;
  readonly staged_bundle_fingerprint?: string;
  readonly staged_name_status?: string;
  readonly notes?: string;
}

// Store-live timestamps: the per-intent store treats entries expired one
// TTL after updated_at as absent, so the fixture anchors to the wall clock.
// queued_at is deliberately EARLIER than updated_at — a consumer that reads
// queued_at where the store reads updated_at reddens instead of agreeing by
// coincidence.
const QUEUED_AT = new Date(Date.now() - 180 * 1000).toISOString();
const UPDATED_AT = new Date(Date.parse(QUEUED_AT) + 120 * 1000).toISOString();
const EXPIRES_AT = new Date(Date.parse(UPDATED_AT) + COMMIT_QUEUE_TTL_SECONDS * 1000).toISOString();

export interface RawIntentRow extends LegacyIntentRow {
  readonly queued_seq: number;
}

/** The current (1.4.0) store row: the legacy shape plus its order key. */
export function validIntentRow(): RawIntentRow {
  return { ...legacyIntentRow(), queued_seq: 0 };
}

export function legacyIntentRow(): LegacyIntentRow {
  return {
    intent_id: INTENT_ID,
    claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    agent_id: VALID_INTENT_AGENT_ID,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): exercise the registry round trip',
    queued_at: QUEUED_AT,
    updated_at: UPDATED_AT,
    expires_at: EXPIRES_AT,
    phase: 'queued',
    // Exercises ALL THREE conditional-extras branches of intent
    // reconstruction: a parser that stops carrying any optional field drops
    // it, and the raw-JSON preservation proof reddens.
    staged_bundle_fingerprint: 'fingerprint-preservation-probe',
    staged_name_status: 'M\tagent-tools/src/commit-queue/index.ts',
    notes: 'optional-field preservation probe',
  };
}

export function claimsFileText(): string {
  return `${JSON.stringify({ schema_version: '1.4.0', claims: [LEGACY_CLAIM] }, null, 2)}\n`;
}

export interface TempRegistry {
  readonly registryPath: string;
  readonly queueDir: string;
}

export async function withTempRegistry(
  intents: readonly RawIntentRow[],
  run: (paths: TempRegistry) => Promise<void>,
): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'commit-queue-registry-'));
  try {
    const registryPath = join(dir, 'active-claims.json');
    const queueDir = join(dir, 'commit-queue');
    await mkdir(queueDir, { recursive: true });
    await writeFile(registryPath, claimsFileText(), 'utf8');
    for (const intent of intents) {
      await writeFile(
        join(queueDir, `${intent.intent_id}.json`),
        `${JSON.stringify(intent, null, 2)}\n`,
        'utf8',
      );
    }
    await run({ registryPath, queueDir });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
