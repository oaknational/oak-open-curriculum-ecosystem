/**
 * Pure aggregation of one session transcript into the arc's cost measures.
 *
 * @remarks
 * The measures exist because an arc's cost was reconstructed by hand at the
 * second estate's transplant retrospective (2026-09-15) and three counting
 * errors were made on the way; each is closed here by a rule applied once:
 *
 * - **Model calls and tokens are counted per API message id.** One response is
 *   recorded across several entries repeating the same `usage` block, so
 *   summing entries over-counts (three to four times over in the measured arc).
 * - **Owner messages come from two entry classes**, and the excluded ones are
 *   counted rather than dropped (see `owner-messages.ts`).
 * - **Active time is a proxy, and says so.** It sums each gap between
 *   consecutive events that is at most the threshold: it cannot see
 *   thinking before a burst's first event, and it counts a long tool call as
 *   active. The threshold travels with the report. An event is any timestamped
 *   entry except the harness's idle recap (see `eventTimeOf`), and the session
 *   spans its first event to its last. Transcript lines are not in time order —
 *   a queued command's attachment carries the time it was queued — so the event
 *   times are sorted before the gaps are taken; one number per event is held
 *   to do it.
 *
 * @packageDocumentation
 */

import { eventTimeOf, parseEntry, type Entry } from './entry.js';
import { createOwnerMessageCounter, type OwnerMessageCounter } from './owner-messages.js';

/** One session's measures. */
export interface SessionMetrics {
  readonly sessionId: string;
  readonly firstAt: string;
  readonly lastAt: string;
  readonly wallSeconds: number;
  readonly activeSeconds: number;
  readonly apiCalls: number;
  readonly toolCalls: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly medianContextTokens: number;
  readonly compactions: number;
  readonly limitStalls: number;
  readonly ownerMessages: number;
  readonly ownerMessagesMidTurn: number;
  /** User-shaped entries excluded as harness or peer traffic, never silently. */
  readonly ownerMessagesFiltered: number;
}

/** Inputs for {@link aggregateSession}. */
export interface AggregateSessionInput {
  readonly sessionId: string;
  readonly lines: AsyncIterable<string>;
  readonly gapSeconds: number;
}

interface Accumulator {
  readonly times: number[];
  readonly callIds: Set<string>;
  output: number;
  cacheRead: number;
  readonly contexts: number[];
  tools: number;
  compactions: number;
  limits: number;
  readonly owner: OwnerMessageCounter;
}

/**
 * Aggregate one transcript's lines into its measures.
 *
 * @param input - The session id, its lines, and the active-time gap threshold.
 * @returns The session's measures; an empty transcript yields zeroed measures
 *   with empty timestamps rather than an error.
 */
export async function aggregateSession(input: AggregateSessionInput): Promise<SessionMetrics> {
  const acc = emptyAccumulator();
  for await (const line of input.lines) {
    const entry = parseEntry(line);
    if (entry !== undefined) {
      absorb(acc, entry);
    }
  }
  return report(input.sessionId, acc, input.gapSeconds);
}

function absorb(acc: Accumulator, entry: Entry): void {
  const at = eventTimeOf(entry);
  if (at !== null) {
    acc.times.push(at);
  }
  absorbMarkers(acc, entry);
  if (entry.type === 'assistant') {
    absorbAssistant(acc, entry);
  }
  acc.owner.absorb(entry);
}

function absorbMarkers(acc: Accumulator, entry: Entry): void {
  if (entry.isCompactSummary === true) {
    acc.compactions += 1;
  }
  if (entry.type === 'system' && /usage limit reached/i.test(JSON.stringify(entry.content ?? ''))) {
    acc.limits += 1;
  }
}

function absorbAssistant(acc: Accumulator, entry: Entry): void {
  const message = entry.message;
  if (message === undefined) {
    return;
  }
  acc.tools += countToolUses(message.content);
  const { id, usage } = message;
  if (id === undefined || usage === undefined || acc.callIds.has(id)) {
    return;
  }
  acc.callIds.add(id);
  acc.output += usage.output_tokens;
  acc.cacheRead += usage.cache_read_input_tokens;
  acc.contexts.push(
    usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens,
  );
}

function countToolUses(content: unknown): number {
  return Array.isArray(content) ? content.filter(isToolUse).length : 0;
}

function isToolUse(block: unknown): boolean {
  return (
    typeof block === 'object' && block !== null && 'type' in block && block.type === 'tool_use'
  );
}

function emptyAccumulator(): Accumulator {
  return {
    times: [],
    callIds: new Set<string>(),
    output: 0,
    cacheRead: 0,
    contexts: [],
    tools: 0,
    compactions: 0,
    limits: 0,
    owner: createOwnerMessageCounter(),
  };
}

function report(sessionId: string, acc: Accumulator, gapSeconds: number): SessionMetrics {
  const times = [...acc.times].sort((left, right) => left - right);
  const first = times.at(0);
  const last = times.at(-1);
  const owner = acc.owner.tally();
  return {
    sessionId,
    firstAt: first === undefined ? '' : new Date(first).toISOString(),
    lastAt: last === undefined ? '' : new Date(last).toISOString(),
    wallSeconds: first === undefined || last === undefined ? 0 : Math.round((last - first) / 1000),
    activeSeconds: Math.round(activeSecondsOf(times, gapSeconds)),
    apiCalls: acc.callIds.size,
    toolCalls: acc.tools,
    outputTokens: acc.output,
    cacheReadTokens: acc.cacheRead,
    medianContextTokens: median(acc.contexts),
    compactions: acc.compactions,
    limitStalls: acc.limits,
    ownerMessages: owner.messages,
    ownerMessagesMidTurn: owner.midTurn,
    ownerMessagesFiltered: owner.filtered,
  };
}

function activeSecondsOf(sortedTimes: readonly number[], gapSeconds: number): number {
  let active = 0;
  let previous: number | undefined;
  for (const at of sortedTimes) {
    if (previous !== undefined) {
      const gap = (at - previous) / 1000;
      if (gap > 0 && gap <= gapSeconds) {
        active += gap;
      }
    }
    previous = at;
  }
  return active;
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? 0;
  }
  return Math.round(((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2);
}
