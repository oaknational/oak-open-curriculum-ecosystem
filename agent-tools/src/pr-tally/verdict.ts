import type { Tally, TallyRow } from './rows.js';

/**
 * The step-back verdict exactly as the pr-lifecycle state machine's item 2
 * states it: over the settled cure-worthy counts of the current epoch,
 * `c[n] >= c[n-1] AND c[n-1] >= c[n-2]` or four settled rounds, either arm
 * firing only while the latest settled count is non-zero; a settled round at
 * cure-worthy zero is the terminal success state and takes precedence; a
 * push the seat marks as the class fix opens a new epoch at its head, whether
 * or not that head settles. Anything the machine cannot count blocks every
 * count-based verdict, and is checked before anything else: a signed
 * disposition with no marker on ANY head reads as manual tally required,
 * findings with no signed disposition on ANY head read as open, and a current
 * head still owed a reviewer reads as open — disposition obligations never
 * reset with an epoch, and an unsettled head's findings are obligations too.
 */

type VerdictKind =
  | 'terminal-success'
  | 'step-back'
  | 'converging'
  | 'open'
  | 'manual-tally-required'
  | 'no-settled-round';

export interface Verdict {
  readonly kind: VerdictKind;
  /** 1-based; increments at each class-fix head. */
  readonly epoch: number;
  /** The settled cure-worthy counts of the current epoch, in branch order. */
  readonly counts: readonly number[];
  readonly evidence: readonly string[];
}

export interface VerdictOptions {
  /** Heads (full or prefix) the seat marked as class-fix pushes; each opens a new epoch at its round. */
  readonly classFixHeads?: readonly string[];
}

/** The verdict's input: settled rows, every head in branch order, unsettled heads with their findings, and the current head's settlement. */
export interface VerdictInput {
  readonly rows: readonly TallyRow[];
  /** Every head in branch order; defaults to the rows' heads. */
  readonly heads?: readonly string[];
  /** Unsettled heads with their counts so far; their uncounted findings block like a settled row's. */
  readonly unsettled?: readonly TallyRow[];
  /** The current head when it is NOT settled; the verdict then reads open. */
  readonly unsettledHead?: string;
}

const isClassFix = (head: string, options: VerdictOptions): boolean =>
  (options.classFixHeads ?? []).some((prefix) => head.startsWith(prefix));

// A class fix opens a new epoch only once a settled round precedes it.
function settledBefore(rows: readonly TallyRow[], heads: readonly string[], head: string): boolean {
  const position = heads.indexOf(head);
  return rows.some((row) => heads.indexOf(row.head) < position);
}

// Epoch boundaries are found over EVERY head in branch order, so a class-fix
// head superseded before it settled still opens its epoch; only settled rows
// are counted.
function currentEpoch(
  rows: readonly TallyRow[],
  heads: readonly string[],
  options: VerdictOptions,
): { epoch: number; rows: TallyRow[] } {
  let epoch = 1;
  let current: TallyRow[] = [];
  for (const head of heads) {
    if (isClassFix(head, options) && settledBefore(rows, heads, head)) {
      epoch += 1;
      current = [];
    }
    const row = rows.find((candidate) => candidate.head === head);
    if (row !== undefined) {
      current.push(row);
    }
  }
  return { epoch, rows: current };
}

const at = (counts: readonly number[], fromEnd: number): number =>
  counts[counts.length - fromEnd] ?? 0;

// `c[n] >= c[n-1] AND c[n-1] >= c[n-2]` — two consecutive non-decreasing transitions.
function nonDecreasingTwice(counts: readonly number[]): boolean {
  return counts.length >= 3 && at(counts, 1) >= at(counts, 2) && at(counts, 2) >= at(counts, 3);
}

function stepBackArmed(counts: readonly number[]): boolean {
  if (at(counts, 1) === 0) {
    return false;
  }
  return nonDecreasingTwice(counts) || counts.length >= 4;
}

function uncountedEvidence(rows: readonly TallyRow[]): string[] {
  return rows
    .filter((row) => row.undispositioned > 0 || row.manual > 0)
    .map(
      (row) =>
        `${row.head.slice(0, 9)}${row.settled ? '' : ' (unsettled)'}: ${row.undispositioned} undispositioned, ${row.manual} manual — cure-worthy ${row.cureWorthy} is a floor`,
    );
}

// Blocking is checked over EVERY head, settled or not, before any count is read.
function blockedKind(input: VerdictInput): VerdictKind | undefined {
  const all = [...input.rows, ...(input.unsettled ?? [])];
  if (all.some((row) => row.manual > 0)) {
    return 'manual-tally-required';
  }
  if (all.some((row) => row.undispositioned > 0) || input.unsettledHead !== undefined) {
    return 'open';
  }
  return undefined;
}

/** The verdict over settled rows and the head order (pure over the row shape; the tally builder supplies them). */
export function verdictFromRows(input: VerdictInput, options: VerdictOptions): Verdict {
  const heads = input.heads ?? input.rows.map((row) => row.head);
  const { epoch, rows: epochRows } = currentEpoch(input.rows, heads, options);
  const counts = epochRows.map((row) => row.cureWorthy);
  const evidence = [
    ...(input.unsettledHead === undefined
      ? []
      : [`current head ${input.unsettledHead.slice(0, 9)} is not settled`]),
    ...uncountedEvidence([...input.rows, ...(input.unsettled ?? [])]),
  ];
  const blocked = blockedKind(input);
  if (blocked !== undefined) {
    return { kind: blocked, epoch, counts, evidence };
  }
  const latest = epochRows.at(-1);
  if (latest === undefined) {
    return { kind: 'no-settled-round', epoch, counts, evidence };
  }
  if (latest.cureWorthy === 0) {
    return { kind: 'terminal-success', epoch, counts, evidence };
  }
  return { kind: stepBackArmed(counts) ? 'step-back' : 'converging', epoch, counts, evidence };
}

/** The verdict over a built tally: its settled rows, every head in branch order, its unsettled heads, and whether the current head settled. */
export function verdict(tally: Tally, options: VerdictOptions): Verdict {
  const current = tally.heads.at(-1);
  const unsettledHead = tally.unsettled.some((row) => row.head === current) ? current : undefined;
  return verdictFromRows(
    { rows: tally.rows, heads: tally.heads, unsettled: tally.unsettled, unsettledHead },
    options,
  );
}
