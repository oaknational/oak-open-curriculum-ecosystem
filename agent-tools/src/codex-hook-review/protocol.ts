import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseProtocolJson } from './protocol-json.js';
import { toCodexUsage, usageSchema, type CodexUsage } from './protocol-usage.js';
const DYNAMIC_ITEM_TYPES = [
  'command_execution',
  'file_change',
  'mcp_tool_call',
  'web_search',
  'plan',
  'todo_list',
  'context',
  'context_compaction',
  'dynamic_tool_call',
] as const;
const ORPHAN_EVENT_TYPES = ['item.started', 'item.updated', 'turn.failed', 'error'] as const;
const eventEnvelopeSchema = z.object({ type: z.string().min(1) });
const threadStartedSchema = z.object({
  type: z.literal('thread.started'),
  thread_id: z.string().min(1),
});
const turnStartedSchema = z.object({ type: z.literal('turn.started') });
const itemEnvelopeSchema = z.object({
  type: z.literal('item.completed'),
  item: z.object({ type: z.string().min(1) }),
});
const reasoningSchema = z.object({
  type: z.literal('item.completed'),
  item: z.object({
    id: z.string().min(1),
    type: z.literal('reasoning'),
    text: z.string(),
  }),
});
const agentMessageSchema = z.object({
  type: z.literal('item.completed'),
  item: z.object({
    id: z.string().min(1),
    type: z.literal('agent_message'),
    text: z.string(),
  }),
});
const turnCompletedSchema = z.object({ type: z.literal('turn.completed'), usage: usageSchema });
export type { CodexUsage } from './protocol-usage.js';
export interface CodexProtocolOutput {
  readonly agentMessage: string;
  readonly usage: CodexUsage;
  readonly reasoningItemCount: number;
}
export interface CodexProtocolError {
  readonly kind: 'schema-failure' | 'dynamic-tool-event' | 'unknown-event' | 'orphan-event';
}

/** Inspect one complete JSONL event so capability drift can terminate a live process early. */
export function inspectCodexJsonlLine(line: string): CodexProtocolError | undefined {
  if (line.trim().length === 0) {
    return undefined;
  }
  const event = parseProtocolEvent(line.endsWith('\r') ? line.slice(0, -1) : line);
  return event.ok ? undefined : event.error;
}
type ProtocolEvent =
  | { readonly kind: 'thread-started' }
  | { readonly kind: 'turn-started' }
  | { readonly kind: 'reasoning' }
  | { readonly kind: 'agent-message'; readonly text: string }
  | { readonly kind: 'turn-completed'; readonly usage: CodexUsage };
type ProtocolState =
  | { readonly phase: 'await-thread' }
  | { readonly phase: 'await-turn' }
  | { readonly phase: 'items'; readonly reasoningItemCount: number }
  | {
      readonly phase: 'await-completion';
      readonly agentMessage: string;
      readonly reasoningItemCount: number;
    }
  | { readonly phase: 'complete'; readonly output: CodexProtocolOutput };
/** Parse the bounded Codex JSONL stream and reject every capability-bearing event. */
export function parseCodexJsonl(stdout: string): Result<CodexProtocolOutput, CodexProtocolError> {
  const lines = splitLines(stdout);
  if (lines.length === 0) {
    return err({ kind: 'schema-failure' });
  }
  let state: ProtocolState = { phase: 'await-thread' };
  for (const line of lines) {
    const event = parseProtocolEvent(line);
    if (!event.ok) {
      return event;
    }
    const next = transition(state, event.value);
    if (!next.ok) {
      return next;
    }
    state = next.value;
  }
  return state.phase === 'complete' ? ok(state.output) : err({ kind: 'orphan-event' });
}
function splitLines(stdout: string): readonly string[] {
  return stdout
    .split('\n')
    .map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line))
    .filter((line) => line.trim().length > 0);
}
function parseProtocolEvent(line: string): Result<ProtocolEvent, CodexProtocolError> {
  const json = parseProtocolJson(line);
  if (!json.ok) {
    return json;
  }
  const envelope = eventEnvelopeSchema.safeParse(json.value);
  if (!envelope.success) {
    return err({ kind: 'schema-failure' });
  }
  if (ORPHAN_EVENT_TYPES.some((eventType) => eventType === envelope.data.type)) {
    return err({ kind: 'orphan-event' });
  }
  if (envelope.data.type === 'thread.started') {
    return parseThreadStarted(json.value);
  }
  if (envelope.data.type === 'turn.started') {
    return parseTurnStarted(json.value);
  }
  if (envelope.data.type === 'item.completed') {
    return parseItemCompleted(json.value);
  }
  if (envelope.data.type === 'turn.completed') {
    return parseTurnCompleted(json.value);
  }
  return err({ kind: 'unknown-event' });
}
function parseThreadStarted(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  return threadStartedSchema.safeParse(value).success
    ? ok({ kind: 'thread-started' })
    : err({ kind: 'schema-failure' });
}
function parseTurnStarted(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  return turnStartedSchema.safeParse(value).success
    ? ok({ kind: 'turn-started' })
    : err({ kind: 'schema-failure' });
}
function parseItemCompleted(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  const envelope = itemEnvelopeSchema.safeParse(value);
  if (!envelope.success) {
    return err({ kind: 'schema-failure' });
  }
  const itemType = envelope.data.item.type;
  if (DYNAMIC_ITEM_TYPES.some((dynamicType) => dynamicType === itemType)) {
    return err({ kind: 'dynamic-tool-event' });
  }
  if (itemType === 'reasoning') {
    return parseReasoning(value);
  }
  if (itemType === 'agent_message') {
    return parseAgentMessage(value);
  }
  return err({ kind: 'unknown-event' });
}
function parseReasoning(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  return reasoningSchema.safeParse(value).success
    ? ok({ kind: 'reasoning' })
    : err({ kind: 'schema-failure' });
}
function parseAgentMessage(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  const parsed = agentMessageSchema.safeParse(value);
  return parsed.success
    ? ok({ kind: 'agent-message', text: parsed.data.item.text })
    : err({ kind: 'schema-failure' });
}
function parseTurnCompleted(value: unknown): Result<ProtocolEvent, CodexProtocolError> {
  const parsed = turnCompletedSchema.safeParse(value);
  return parsed.success
    ? ok({ kind: 'turn-completed', usage: toCodexUsage(parsed.data.usage) })
    : err({ kind: 'schema-failure' });
}
function transition(
  state: ProtocolState,
  event: ProtocolEvent,
): Result<ProtocolState, CodexProtocolError> {
  switch (state.phase) {
    case 'await-thread':
      return transitionAwaitThread(event);
    case 'await-turn':
      return transitionAwaitTurn(event);
    case 'items':
      return transitionItems(state, event);
    case 'await-completion':
      return transitionAwaitCompletion(state, event);
    case 'complete':
      return err({ kind: 'orphan-event' });
    default:
      return err({ kind: 'orphan-event' });
  }
}
function transitionAwaitThread(event: ProtocolEvent): Result<ProtocolState, CodexProtocolError> {
  return event.kind === 'thread-started'
    ? ok({ phase: 'await-turn' })
    : err({ kind: 'orphan-event' });
}
function transitionAwaitTurn(event: ProtocolEvent): Result<ProtocolState, CodexProtocolError> {
  return event.kind === 'turn-started'
    ? ok({ phase: 'items', reasoningItemCount: 0 })
    : err({ kind: 'orphan-event' });
}
function transitionItems(
  state: Extract<ProtocolState, { readonly phase: 'items' }>,
  event: ProtocolEvent,
): Result<ProtocolState, CodexProtocolError> {
  if (event.kind === 'reasoning') {
    return ok({ phase: 'items', reasoningItemCount: state.reasoningItemCount + 1 });
  }
  if (event.kind === 'agent-message') {
    return ok({
      phase: 'await-completion',
      agentMessage: event.text,
      reasoningItemCount: state.reasoningItemCount,
    });
  }
  return err({ kind: 'orphan-event' });
}
function transitionAwaitCompletion(
  state: Extract<ProtocolState, { readonly phase: 'await-completion' }>,
  event: ProtocolEvent,
): Result<ProtocolState, CodexProtocolError> {
  if (event.kind !== 'turn-completed') {
    return err({ kind: 'orphan-event' });
  }
  return ok({
    phase: 'complete',
    output: {
      agentMessage: state.agentMessage,
      usage: event.usage,
      reasoningItemCount: state.reasoningItemCount,
    },
  });
}
