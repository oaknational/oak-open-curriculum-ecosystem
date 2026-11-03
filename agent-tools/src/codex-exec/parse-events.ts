import type { CodexExecEvent, UnusedItemType } from './types.js';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

/**
 * Parse one JSONL line into a closed `CodexExecEvent`.
 *
 * Returns undefined for a blank or malformed line, for a top-level type
 * outside the documented set, and for a recognised event that lacks its
 * required field. So a vendor addition or shape change surfaces as an
 * unrecognised line, never as a silently ignored or empty event.
 */
export function parseCodexExecEvent(line: string): CodexExecEvent | undefined {
  const trimmed = line.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = safeJsonParse(trimmed);
  if (!isJsonObject(parsed)) {
    return undefined;
  }
  const type = parsed['type'];
  if (typeof type !== 'string') {
    return undefined;
  }
  return parseTypedEvent(type, parsed);
}

type EventParser = (event: JsonObject) => CodexExecEvent | undefined;

/**
 * One parser for each documented top-level type; any other type is
 * unrecognised.
 */
const EVENT_PARSERS: ReadonlyMap<string, EventParser> = new Map<string, EventParser>([
  [
    'thread.started',
    (event) => withString(event['thread_id'], (threadId) => ({ kind: 'thread-started', threadId })),
  ],
  ['turn.started', () => ({ kind: 'turn-started' })],
  ['turn.completed', () => ({ kind: 'turn-completed' })],
  ['turn.failed', (event) => parseTurnFailed(event)],
  [
    'error',
    (event) => withString(event['message'], (message) => ({ kind: 'stream-error', message })),
  ],
  ['item.started', (event) => parseItemProgress(event)],
  ['item.updated', (event) => parseItemProgress(event)],
  ['item.completed', (event) => parseCompletedItem(event['item'])],
]);

function parseTypedEvent(type: string, event: JsonObject): CodexExecEvent | undefined {
  return EVENT_PARSERS.get(type)?.(event);
}

function parseTurnFailed(event: JsonObject): CodexExecEvent | undefined {
  const error = event['error'];
  if (!isJsonObject(error)) {
    return undefined;
  }
  return withString(error['message'], (message) => ({ kind: 'turn-failed', message }));
}

const UNUSED_ITEM_TYPES: readonly UnusedItemType[] = ['reasoning', 'todo_list', 'error'];

/**
 * The item types a turn may carry under the envelope; any other type is
 * unexpected at every stage, so a prohibited call that starts and never
 * completes still counts.
 */
const KNOWN_ITEM_TYPES: readonly string[] = [
  'agent_message',
  'command_execution',
  ...UNUSED_ITEM_TYPES,
];

function readItemType(item: JsonValue | undefined): string | undefined {
  if (!isJsonObject(item)) {
    return undefined;
  }
  const itemType = item['type'];
  return typeof itemType === 'string' ? itemType : undefined;
}

function parseItemProgress(event: JsonObject): CodexExecEvent | undefined {
  const itemType = readItemType(event['item']);
  if (itemType === undefined) {
    return undefined;
  }
  return KNOWN_ITEM_TYPES.includes(itemType)
    ? { kind: 'item-progress' }
    : { kind: 'unexpected-item', itemType };
}

function parseCompletedItem(item: JsonValue | undefined): CodexExecEvent | undefined {
  const itemType = readItemType(item);
  if (itemType === undefined || !isJsonObject(item)) {
    return undefined;
  }
  if (itemType === 'agent_message') {
    return withString(item['text'], (text) => ({ kind: 'agent-message', text }));
  }
  if (itemType === 'command_execution') {
    return parseCommandExecution(item);
  }
  const unused = UNUSED_ITEM_TYPES.find((candidate) => candidate === itemType);
  return unused === undefined
    ? { kind: 'unexpected-item', itemType }
    : { kind: 'unused-item', itemType: unused };
}

function parseCommandExecution(item: JsonObject): CodexExecEvent | undefined {
  const command = item['command'];
  const output = item['aggregated_output'];
  const exitCode = item['exit_code'];
  if (typeof command !== 'string' || typeof output !== 'string') {
    return undefined;
  }
  return {
    kind: 'command-execution',
    command,
    output,
    exitCode: typeof exitCode === 'number' ? exitCode : undefined,
  };
}

/**
 * Build a value from a JSON field when the field is a string.
 */
function withString<T>(value: JsonValue | undefined, build: (text: string) => T): T | undefined {
  return typeof value === 'string' ? build(value) : undefined;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
