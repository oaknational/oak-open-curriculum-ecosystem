import { secondsUntilExpiry } from './time.js';
import {
  type CommitIntent,
  type CommitQueueEntryStatus,
  type CommitQueuePhase,
  type CommitQueueRegistry,
} from './types.js';

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

interface CommitQueueListFilters {
  readonly prefix?: string;
  readonly phase?: CommitQueuePhase;
  readonly agentName?: string;
  readonly queueStatus?: CommitQueueEntryStatus;
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

/**
 * Format filtered commit-queue entries for exact operator inspection.
 */
export function formatCommitQueueListText(
  registry: CommitQueueRegistry,
  nowIso: string,
  filters: CommitQueueListFilters = {},
): string {
  const entries = registry.commit_queue
    .map((entry) => statusEntry(entry, nowIso))
    .filter((entry) => matchesListFilters(entry, filters));

  return `${JSON.stringify(entries, null, 2)}\n`;
}

/**
 * Format a single commit-queue entry by exact intent id.
 */
export function formatCommitQueueShowText(
  registry: CommitQueueRegistry,
  nowIso: string,
  intentId: string,
): string {
  const entry = registry.commit_queue.find((candidate) => candidate.intent_id === intentId);
  if (entry === undefined) {
    throw new Error(`unknown intent_id: ${intentId}`);
  }

  return `${JSON.stringify(statusEntry(entry, nowIso), null, 2)}\n`;
}

export function writeCommitQueueStatus(
  registry: CommitQueueRegistry,
  nowIso: string,
  stdout: { write(chunk: string): void } = process.stdout,
): number {
  stdout.write(formatCommitQueueStatusText(registry, nowIso));
  return 0;
}

/**
 * Write filtered commit-queue entries to stdout.
 */
export function writeCommitQueueList(
  registry: CommitQueueRegistry,
  nowIso: string,
  filters: CommitQueueListFilters,
  stdout: { write(chunk: string): void } = process.stdout,
): number {
  stdout.write(formatCommitQueueListText(registry, nowIso, filters));
  return 0;
}

/**
 * Write one exact commit-queue entry to stdout.
 */
export function writeCommitQueueShow(
  registry: CommitQueueRegistry,
  nowIso: string,
  intentId: string,
  stdout: { write(chunk: string): void } = process.stdout,
): number {
  stdout.write(formatCommitQueueShowText(registry, nowIso, intentId));
  return 0;
}

function matchesListFilters(
  entry: CommitQueueStatusEntry,
  filters: CommitQueueListFilters,
): boolean {
  return (
    (filters.prefix === undefined || startsWithIgnoreCase(entry.intent_id, filters.prefix)) &&
    (filters.phase === undefined || entry.phase === filters.phase) &&
    (filters.agentName === undefined ||
      startsWithIgnoreCase(entry.agent_id.agent_name, filters.agentName)) &&
    (filters.queueStatus === undefined || entry.queue_status === filters.queueStatus)
  );
}

function statusEntry(entry: CommitIntent, nowIso: string): CommitQueueStatusEntry {
  const secondsUntilExpiryValue = secondsUntilExpiry(entry.expires_at, nowIso);

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
    queue_status: queueStatus(entry, secondsUntilExpiryValue),
    seconds_until_expiry: secondsUntilExpiryValue,
    ...(entry.staged_bundle_fingerprint === undefined
      ? {}
      : { staged_bundle_fingerprint: entry.staged_bundle_fingerprint }),
    ...(entry.staged_name_status === undefined
      ? {}
      : { staged_name_status: entry.staged_name_status }),
    ...(entry.notes === undefined ? {} : { notes: entry.notes }),
  };
}

function startsWithIgnoreCase(value: string, prefix: string): boolean {
  return value.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase());
}

function queueStatus(entry: CommitIntent, secondsUntilExpiry: number): CommitQueueEntryStatus {
  if (entry.phase === 'abandoned') {
    return 'abandoned';
  }
  return secondsUntilExpiry < 0 ? 'expired' : 'active';
}
