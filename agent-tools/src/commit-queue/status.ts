import { type CommitIntent, type CommitQueueRegistry } from './types.js';

type CommitQueueEntryStatus = 'active' | 'expired' | 'abandoned';

interface CommitQueueStatusEntry {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly agent_id: CommitIntent['agent_id'];
  readonly files: readonly string[];
  readonly commit_subject: string;
  readonly queued_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly phase: CommitIntent['phase'];
  readonly queue_status: CommitQueueEntryStatus;
  readonly seconds_until_expiry: number;
  readonly staged_bundle_fingerprint?: string;
  readonly staged_name_status?: string;
  readonly notes?: string;
}

interface CommitQueueStatusReport {
  readonly total: number;
  readonly active: number;
  readonly expired: number;
  readonly abandoned: number;
  readonly entries: readonly CommitQueueStatusEntry[];
}

/**
 * Format the advisory commit queue for machine-readable operator inspection.
 */
export function formatCommitQueueStatus(
  registry: CommitQueueRegistry,
  nowIso: string,
): CommitQueueStatusReport {
  const entries = registry.commit_queue.map((entry) => statusEntry(entry, nowIso));

  return {
    total: entries.length,
    active: entries.filter((entry) => entry.queue_status === 'active').length,
    expired: entries.filter((entry) => entry.queue_status === 'expired').length,
    abandoned: entries.filter((entry) => entry.queue_status === 'abandoned').length,
    entries,
  };
}

export function formatCommitQueueStatusText(registry: CommitQueueRegistry, nowIso: string): string {
  return `${JSON.stringify(formatCommitQueueStatus(registry, nowIso), null, 2)}\n`;
}

export function writeCommitQueueStatus(
  registry: CommitQueueRegistry,
  nowIso: string,
  stdout: { write(chunk: string): void } = process.stdout,
): number {
  stdout.write(formatCommitQueueStatusText(registry, nowIso));
  return 0;
}

function statusEntry(entry: CommitIntent, nowIso: string): CommitQueueStatusEntry {
  const secondsUntilExpiry = Math.floor((Date.parse(entry.expires_at) - Date.parse(nowIso)) / 1000);

  return {
    intent_id: entry.intent_id,
    claim_id: entry.claim_id,
    agent_id: entry.agent_id,
    files: entry.files,
    commit_subject: entry.commit_subject,
    queued_at: entry.queued_at,
    updated_at: entry.updated_at,
    expires_at: entry.expires_at,
    phase: entry.phase,
    queue_status: queueStatus(entry, secondsUntilExpiry),
    seconds_until_expiry: secondsUntilExpiry,
    ...(entry.staged_bundle_fingerprint === undefined
      ? {}
      : { staged_bundle_fingerprint: entry.staged_bundle_fingerprint }),
    ...(entry.staged_name_status === undefined
      ? {}
      : { staged_name_status: entry.staged_name_status }),
    ...(entry.notes === undefined ? {} : { notes: entry.notes }),
  };
}

function queueStatus(entry: CommitIntent, secondsUntilExpiry: number): CommitQueueEntryStatus {
  if (entry.phase === 'abandoned') {
    return 'abandoned';
  }
  return secondsUntilExpiry < 0 ? 'expired' : 'active';
}
