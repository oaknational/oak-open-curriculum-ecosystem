/**
 * Output formatters for the `arc-metrics` topic (text + JSON).
 *
 * @remarks
 * Two modes only — human-readable text (default) and machine JSON (`--json`).
 * The JSON key order is fixed by the literal object construction so a future
 * edit cannot drift it silently. Hours are rounded to one decimal because the
 * active-time measure is a proxy; printing seconds would imply a precision the
 * threshold does not carry.
 *
 * @packageDocumentation
 */

import type { SessionMetrics } from './aggregate.js';

/** The emitted report: every session measured, plus the arc's totals. */
export interface ArcMetricsReport {
  readonly vendor: string;
  readonly gapSeconds: number;
  readonly projectDirectories: readonly string[];
  readonly sessions: readonly SessionMetrics[];
}

interface Totals {
  readonly sessions: number;
  readonly activeHours: number;
  readonly apiCalls: number;
  readonly toolCalls: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly compactions: number;
  readonly limitStalls: number;
  readonly ownerMessages: number;
  readonly ownerMessagesMidTurn: number;
  readonly ownerMessagesFiltered: number;
}

/**
 * Sum the per-session measures.
 *
 * @param sessions - The measured sessions.
 * @returns The arc's totals; active hours are summed across seats, so a total
 *   above the wall span is expected when seats ran in parallel.
 */
function totalsOf(sessions: readonly SessionMetrics[]): Totals {
  const sum = (pick: (session: SessionMetrics) => number): number =>
    sessions.reduce((running, session) => running + pick(session), 0);
  return {
    sessions: sessions.length,
    activeHours: round1(sum((session) => session.activeSeconds) / 3600),
    apiCalls: sum((session) => session.apiCalls),
    toolCalls: sum((session) => session.toolCalls),
    outputTokens: sum((session) => session.outputTokens),
    cacheReadTokens: sum((session) => session.cacheReadTokens),
    compactions: sum((session) => session.compactions),
    limitStalls: sum((session) => session.limitStalls),
    ownerMessages: sum((session) => session.ownerMessages),
    ownerMessagesMidTurn: sum((session) => session.ownerMessagesMidTurn),
    ownerMessagesFiltered: sum((session) => session.ownerMessagesFiltered),
  };
}

/** Format a report as human-readable text (trailing newline). */
export function formatText(report: ArcMetricsReport): string {
  const totals = totalsOf(report.sessions);
  const header = `arc-metrics  vendor ${report.vendor}  active-gap ${report.gapSeconds}s  sessions ${totals.sessions}`;
  const rows = report.sessions.map(
    (session) =>
      `  ${session.sessionId.slice(0, 8)}  active ${round1(session.activeSeconds / 3600)}h  ` +
      `calls ${session.apiCalls}  tools ${session.toolCalls}  out ${session.outputTokens}  ` +
      `cache-read ${session.cacheReadTokens}  median-context ${session.medianContextTokens}  ` +
      `compactions ${session.compactions}  ` +
      `limits ${session.limitStalls}  owner ${session.ownerMessages} ` +
      `(${session.ownerMessagesMidTurn} mid-turn, ${session.ownerMessagesFiltered} filtered)`,
  );
  const footer =
    `  total    active ${totals.activeHours}h  calls ${totals.apiCalls}  tools ${totals.toolCalls}  ` +
    `out ${totals.outputTokens}  cache-read ${totals.cacheReadTokens}  ` +
    `compactions ${totals.compactions}  limits ${totals.limitStalls}  ` +
    `owner ${totals.ownerMessages} (${totals.ownerMessagesMidTurn} mid-turn, ` +
    `${totals.ownerMessagesFiltered} filtered)`;
  return [header, ...rows, footer].join('\n') + '\n';
}

/** Format a report as pretty-printed JSON (fixed key order, trailing newline). */
export function formatJson(report: ArcMetricsReport): string {
  return (
    JSON.stringify(
      {
        vendor: report.vendor,
        gapSeconds: report.gapSeconds,
        projectDirectories: report.projectDirectories,
        totals: totalsOf(report.sessions),
        sessions: report.sessions,
      },
      undefined,
      2,
    ) + '\n'
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
