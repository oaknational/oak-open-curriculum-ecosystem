import type { CodexExecEvent, CodexExecEventItem, LastMessageOutcome } from './types.js';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

/**
 * Parse one JSONL line into a CodexExecEvent, returning undefined on malformed input.
 */
export function parseCodexExecEvent(line: string): CodexExecEvent | undefined {
  const trimmed = line.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = safeJsonParse(trimmed);
  if (parsed === undefined || !isJsonObject(parsed)) {
    return undefined;
  }
  const type = parsed['type'];
  if (typeof type !== 'string') {
    return undefined;
  }

  const rawItem = parsed['item'];
  if (rawItem === undefined || rawItem === null) {
    return { type };
  }
  if (!isJsonObject(rawItem)) {
    return undefined;
  }

  const item: CodexExecEventItem = {
    id: stringOrUndefined(rawItem['id']),
    type: stringOrUndefined(rawItem['type']),
    text: stringOrUndefined(rawItem['text']),
    message: stringOrUndefined(rawItem['message']),
  };
  return { type, item };
}

/**
 * Extract the last agent message from a sequence of JSONL lines.
 *
 * The final assistant text is on `type === "item.completed"` events
 * where `item.type === "agent_message"`, at `item.text`.
 */
export function extractLastAgentMessage(lines: readonly string[]): LastMessageOutcome {
  let lastText: string | undefined;

  for (const line of lines) {
    const event = parseCodexExecEvent(line);
    if (event === undefined) {
      continue;
    }
    if (event.type !== 'item.completed') {
      continue;
    }
    if (event.item?.type !== 'agent_message') {
      continue;
    }
    if (event.item.text !== undefined) {
      lastText = event.item.text;
    }
  }

  if (lastText === undefined) {
    return { found: false };
  }
  return { found: true, text: lastText };
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

/**
 * Returns the value when it is a string, otherwise undefined. Used to read
 * optional string fields off a narrowed `JsonObject` without type assertions.
 */
function stringOrUndefined(value: JsonValue | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
