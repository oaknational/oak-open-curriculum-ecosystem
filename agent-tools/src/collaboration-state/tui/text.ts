import {
  type CollaborationTuiSnapshot,
  type TuiAgentEntry,
  type TuiMainEntry,
  type TuiQueueEntry,
} from './snapshot.js';

const MAX_BODY_LENGTH = 120;
const MAX_SECTION_ENTRIES = 10;
type OperatorValue = NonNullable<CollaborationTuiSnapshot['operator_value']>;

export function formatCollaborationTuiText(snapshot: CollaborationTuiSnapshot): string {
  return [
    'Collaboration TUI Snapshot',
    `Generated: ${snapshot.generated_at}`,
    ...(snapshot.operator_value === undefined
      ? []
      : ['', formatOperatorValue(snapshot.operator_value)]),
    '',
    section('Main comms', snapshot.main, formatMainEntry, MAX_SECTION_ENTRIES),
    '',
    section(
      'Directed messages',
      snapshot.directed,
      (entry) =>
        [
          `${entry.created_at} [${entry.kind}] ${entry.subject}`,
          `  ${entry.from} -> ${entry.to}`,
          `  ${oneLine(entry.body)}`,
        ].join('\n'),
      MAX_SECTION_ENTRIES,
    ),
    '',
    section('Active agents', snapshot.agents, formatAgentEntry),
    '',
    section('Commit queue', snapshot.queue, formatQueueEntry),
    '',
  ].join('\n');
}

function formatOperatorValue(value: OperatorValue): string {
  return [
    'Operator value',
    `  Ownership active=${value.ownership.active} stale=${value.ownership.stale} inactive=${value.ownership.inactive} uncertain=${value.ownership.uncertain} collisions=${value.ownership.collisions}`,
    `  Queue pressure ${value.queue_pressure.status} active=${value.queue_pressure.active} expired=${value.queue_pressure.expired} total=${value.queue_pressure.total}`,
    `  Directed pressure needs_attention=${value.directed_thread_pressure.needs_attention} total=${value.directed_thread_pressure.total}`,
    formatRecentChanges(value),
    formatNeedsAttention(value),
  ].join('\n');
}

function formatRecentChanges(value: OperatorValue): string {
  if (value.recent_changes.length === 0) {
    return '  Recent changes\n    (none)';
  }

  return `  Recent changes\n${value.recent_changes
    .map((entry) => `    ${entry.created_at} [${entry.kind}] ${oneLine(entry.summary)}`)
    .join('\n')}`;
}

function formatNeedsAttention(value: OperatorValue): string {
  if (value.needs_attention.length === 0) {
    return '  Needs attention\n    (none)';
  }

  return `  Needs attention\n${value.needs_attention
    .map((entry) => `    [${entry.severity}] ${oneLine(entry.summary)}`)
    .join('\n')}`;
}

function section<TEntry>(
  title: string,
  entries: readonly TEntry[],
  formatEntry: (entry: TEntry) => string,
  maxEntries = entries.length,
): string {
  if (entries.length === 0) {
    return `${title}\n  (none)`;
  }

  const visibleEntries = entries.slice(0, maxEntries);
  const hiddenCount = entries.length - visibleEntries.length;
  const hiddenLine = hiddenCount === 0 ? '' : `\n  ... ${hiddenCount} more`;
  return `${title}\n${visibleEntries
    .map((entry) => indent(formatEntry(entry)))
    .join('\n')}${hiddenLine}`;
}

function formatMainEntry(entry: TuiMainEntry): string {
  return [
    `${entry.created_at} [${entry.kind}] ${entry.title}`,
    `  ${entry.author}`,
    `  ${oneLine(entry.body)}`,
  ].join('\n');
}

function formatAgentEntry(entry: TuiAgentEntry): string {
  const counts = `claims=${entry.claim_count} queue=${entry.queue_count} closed=${entry.closed_claim_count}`;
  const latestIntent =
    entry.latest_intent === undefined ? '' : `\n  ${oneLine(entry.latest_intent)}`;
  return `${entry.routing_key} [${entry.visibility_status}/${entry.collision_status}] ${counts}${latestIntent}`;
}

function formatQueueEntry(entry: TuiQueueEntry): string {
  return [
    `${entry.intent_id} [${entry.status}/${entry.phase}] ${entry.commit_subject}`,
    `  ${entry.agent}`,
    `  expires ${entry.expires_at}`,
  ].join('\n');
}

function indent(text: string): string {
  return text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

function oneLine(value: string): string {
  const normalized = value.replaceAll(/\s+/g, ' ').trim();
  if (normalized.length <= MAX_BODY_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_BODY_LENGTH - 3)}...`;
}
