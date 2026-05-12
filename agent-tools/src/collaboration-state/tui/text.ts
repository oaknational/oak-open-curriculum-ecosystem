import {
  type CollaborationTuiSnapshot,
  type TuiAgentEntry,
  type TuiMainEntry,
  type TuiQueueEntry,
} from './snapshot.js';

const MAX_BODY_LENGTH = 120;
const MAX_SECTION_ENTRIES = 10;

export function formatCollaborationTuiText(snapshot: CollaborationTuiSnapshot): string {
  return [
    'Collaboration TUI Snapshot',
    `Generated: ${snapshot.generated_at}`,
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
