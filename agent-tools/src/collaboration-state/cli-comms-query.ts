import { optional, required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import {
  type CollaborationAgentId,
  type CollaborationStateEnvironment,
  type CommsEvent,
} from './types.js';

/**
 * Default number of newest events `comms list` projects when `--tail` is
 * omitted — enough to orient a session-open or seat-takeover read without
 * regenerating the full shared log. Closes frictions-register F-07 (and the
 * read-back half of Windward's 2026-06-04 consolidated frictions): agents had
 * to fall back to `ls -t | jq` over raw event files to answer "what are the
 * last N titles" and "what is in event X".
 */
const DEFAULT_LIST_TAIL = 20;

/**
 * `comms list [--tail <n>]` — newest-first, one-line summary projection over
 * the comms event directory.
 *
 * Read-only orientation surface: unlike `comms inbox` / `comms watch` (which
 * self-exclude against the caller's identity and track a seen-file), `list`
 * needs no identity seed and mutates no state. Each line projects
 * `created_at`, `event_id`, `author/session_prefix`, `[kind]` (plus any
 * `[tags]`), and the title/subject — the fields needed to decide which event
 * to `comms show`.
 */
export async function listComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const commsDir = required(options, 'comms-dir');
  const tail = parseTail(optional(options, 'tail'));
  const events = await cliIo(runtime).readCommsEvents(commsDir);
  const newest = [...events].sort(byCreatedAtDescending).slice(0, tail);
  if (newest.length === 0) {
    return 'no comms events\n';
  }
  const header = `comms list — newest ${newest.length} of ${events.length} event(s), most recent first`;
  return `${[header, ...newest.map(formatSummaryLine)].join('\n')}\n`;
}

/**
 * `comms show --event-id <id>` — print the full canonical JSON event,
 * including its body, resolved by id. Read-only; mirrors the
 * `claims show --claim-id` shape. Fails clearly (and non-zero) when no event
 * carries the id.
 */
export async function showComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const commsDir = required(options, 'comms-dir');
  const eventId = required(options, 'event-id');
  const events = await cliIo(runtime).readCommsEvents(commsDir);
  const event = events.find((candidate) => candidate.event_id === eventId);
  if (event === undefined) {
    throw new Error(`comms event not found: ${eventId}`);
  }
  return `${JSON.stringify(event, null, 2)}\n`;
}

function parseTail(raw: string | undefined): number {
  if (raw === undefined) {
    return DEFAULT_LIST_TAIL;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--tail must be a positive integer (got: ${raw})`);
  }
  return value;
}

function byCreatedAtDescending(left: CommsEvent, right: CommsEvent): number {
  const byTime = Date.parse(right.created_at) - Date.parse(left.created_at);
  if (byTime !== 0) {
    return byTime;
  }
  return right.event_id.localeCompare(left.event_id);
}

function formatSummaryLine(event: CommsEvent): string {
  const author = summaryAuthor(event);
  const channel =
    event.tags !== undefined && event.tags.length > 0
      ? `[${event.kind}] [${event.tags.join(', ')}]`
      : `[${event.kind}]`;
  return `${event.created_at}  ${event.event_id}  ${author.agent_name}/${author.session_id_prefix}  ${channel}  ${summaryTitle(event)}`;
}

function summaryAuthor(event: CommsEvent): CollaborationAgentId {
  return event.kind === 'directed' ? event.from : event.author;
}

function summaryTitle(event: CommsEvent): string {
  return event.kind === 'directed' ? event.subject : event.title;
}
