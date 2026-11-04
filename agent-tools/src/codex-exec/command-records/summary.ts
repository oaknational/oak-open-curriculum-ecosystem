import { typeSafeEntries } from '@oaknational/type-helpers';

import type { OutputFormat } from '../types.js';

import type { Hit } from './flag-command.js';
import { justificationOf } from './forbidden-shapes.js';

/**
 * One command the harness recorded as run, from its `CommandExecution` item.
 * The status and source sets are codex-cli 0.157.1's closed sets.
 */
export interface CommandRecord {
  readonly line: number;
  readonly turnId: string;
  /** The argv the harness handed the executor; never printed whole. */
  readonly command: readonly string[];
  /** How the harness closed the item. */
  readonly status: 'in_progress' | 'completed' | 'failed' | 'declined';
  /** Which path ran the command. */
  readonly source: 'agent' | 'user_shell' | 'unified_exec_startup' | 'unified_exec_interaction';
  readonly exitCode: number | undefined;
  /** What was typed into a running process, when the item is an interaction. */
  readonly interactionInput: string | undefined;
}

/** An evidence record the reader could not read; the reason never carries the raw value. */
export interface Malformed {
  readonly line: number;
  readonly reason: string;
}

/**
 * A command that carried a forbidden shape of the seat rules: one the harness
 * ran (`executed`), one typed into a running process (`interaction`), or one
 * the exec policy or the user refused before it ran (`refused`).
 */
export interface FlaggedCommand {
  readonly kind: 'executed' | 'interaction' | 'refused';
  readonly line: number;
  readonly turnId: string;
  /** The command by allowlist, one string per shell segment; never the argv. */
  readonly rendered: readonly string[];
  readonly hits: readonly Hit[];
}

/**
 * One turn's counts. The exec calls the turn made are each accounted (a
 * completed wrapper), refused (the exec policy's message) or unaccounted (a
 * failed, terminated, running or truncated output, a malformed output, or no
 * output at all): `calls === accounted + refused + unaccounted`. Beside them,
 * the `CommandExecution` items: the commands the harness ran, and the items
 * it recorded as declined.
 */
export interface TurnAccount {
  readonly turnId: string;
  readonly calls: number;
  readonly accounted: number;
  readonly refused: number;
  readonly unaccounted: number;
  readonly executed: number;
  readonly declined: number;
}

/**
 * What a rollout says about the commands its seat ran, as counts and the
 * records that could not be read. Never the command history itself.
 */
export interface CommandRecordsSummary {
  readonly turns: number;
  /** The commands the harness ran, over every turn. */
  readonly commands: number;
  /** The exec calls left unaccounted, over every turn. */
  readonly unaccounted: number;
  /** Every command that carried a forbidden shape, in stream order. */
  readonly flagged: readonly FlaggedCommand[];
  readonly accounts: readonly TurnAccount[];
  /** Every record type seen, counted; types the reader does not read included. */
  readonly recordTypes: Readonly<Record<string, number>>;
  readonly malformed: readonly Malformed[];
  readonly invalidLines: readonly number[];
}

function renderFlagged(entry: FlaggedCommand): string {
  const shapes = entry.hits.map((hit) => `${hit.kind}: ${justificationOf(hit.kind)}`).join(' ');
  const command = entry.rendered.join(' ; ');
  return `flagged: line ${entry.line}: ${entry.kind} in turn ${entry.turnId}: ${command} [${shapes}]`;
}

function renderAccount(account: TurnAccount): string {
  const calls = `calls ${account.calls}, accounted ${account.accounted}, refused ${account.refused}, unaccounted ${account.unaccounted}`;
  return `turn ${account.turnId}: ${calls}; executed ${account.executed}, declined ${account.declined}`;
}

function renderText(summary: CommandRecordsSummary): string {
  const lines = [
    `command records: ${summary.turns} turn(s), ${summary.commands} executed command(s), ${summary.flagged.length} flagged, ${summary.unaccounted} unaccounted`,
    ...summary.accounts.map(renderAccount),
    ...summary.flagged.map(renderFlagged),
    `record types: ${typeSafeEntries(summary.recordTypes)
      .map(([type, count]) => `${type}=${count}`)
      .join(' ')}`,
    ...summary.malformed.map((entry) => `malformed: line ${entry.line}: ${entry.reason}`),
  ];
  if (summary.invalidLines.length > 0) {
    lines.push(`invalid lines: ${summary.invalidLines.join(', ')}`);
  }
  return lines.join('\n');
}

/** The summary as a reader or a script takes it. */
export function renderSummary(summary: CommandRecordsSummary, format: OutputFormat): string {
  return format === 'json' ? JSON.stringify(summary) : renderText(summary);
}
