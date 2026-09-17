/**
 * Latest-run-per-check reduction of a status-check rollup.
 *
 * GitHub evaluates a check through its LATEST run on the head commit;
 * superseded runs (concurrency-cancelled twins of a duplicated trigger
 * delivery, re-runs) stay in the rollup as residue. This module mirrors
 * that semantic for Actions check runs, and ONLY for them: exactly the
 * items with `__typename === 'CheckRun'`, a real name, AND a workflow
 * identity participate, keyed per (workflow, name). Checks from
 * non-workflow providers carry no `workflowName` (and this read has no
 * app identity to namespace them), so they pass through unreduced rather
 * than conflate across providers — as do StatusContexts (already
 * collapsed per context by GitHub) and unnamed items.
 *
 * Recency is ordered by START time — execution order — because a
 * slow-to-cancel superseded run can COMPLETE after its fast green twin;
 * completion time serves only when start is absent. An unparseable
 * timestamp counts as absent (never "latest-known").
 *
 * The per-key reduction is ORDER-INDEPENDENT of the API array: among
 * dated runs the latest anchor wins (more-blocking on an exact tie);
 * undated runs reduce by blocking rank alone; and the two survivors
 * cross-compare once, more-blocking winning. Unknown is never
 * latest-known, in either direction, so no green survives a failure — or
 * a still-queued re-run — that it cannot prove it superseded (the same
 * doctrine as checksGreenAt's partial-anchor null).
 *
 * Worked instance (PR #846, 2026-08-13): a duplicated pull_request
 * delivery left one CI run cancelled beside its green twin on the SAME
 * sha, and the undeduped read held CHECKS-RED against a head GitHub
 * itself evaluated as green.
 */

export interface RollupCheckShape {
  readonly __typename: string;
  readonly name?: string | null;
  readonly workflowName?: string | null;
  readonly completedAt?: string | null;
  readonly startedAt?: string | null;
}

/** Blocking order for survivor ties: failed outranks pending outranks passed. */
const BLOCKING_RANK: Record<'failed' | 'pending' | 'passed', number> = {
  failed: 2,
  pending: 1,
  passed: 0,
};

export function blockingRank(bucket: 'failed' | 'pending' | 'passed'): number {
  return BLOCKING_RANK[bucket];
}

// Epoch anchor from the START time (execution order); completion only
// when start is absent. Unparseable counts as absent.
function anchorOf(item: RollupCheckShape): number | null {
  const raw = item.startedAt ?? item.completedAt ?? null;
  if (raw === null || raw === undefined) {
    return null;
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

function participates(item: RollupCheckShape): boolean {
  return (
    item.__typename === 'CheckRun' &&
    typeof item.name === 'string' &&
    item.name.length > 0 &&
    typeof item.workflowName === 'string' &&
    item.workflowName.length > 0
  );
}

function reductionKey(item: RollupCheckShape): string {
  return `${item.workflowName ?? ''}\u0000${item.name ?? ''}`;
}

// The more-blocking of an incumbent (possibly absent) and a candidate.
function moreBlocking<T>(incumbent: T | undefined, candidate: T, rank: (item: T) => number): T {
  return incumbent === undefined || rank(candidate) > rank(incumbent) ? candidate : incumbent;
}

// Completion anchor for full-tie survivors. The survivor's completion
// feeds checksGreenAt, which waives owed-review quiet windows — so on a
// start-and-rank tie the LATER completion is the conservative survivor
// (a green moment is never reported earlier than the last twin's).
function completionAnchorOf(item: RollupCheckShape): number {
  const raw = item.completedAt ?? item.startedAt ?? null;
  if (raw === null || raw === undefined) {
    return Number.NEGATIVE_INFINITY;
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

// A dated candidate displaces the dated incumbent on a strictly newer
// start anchor; on an exact tie, when it is more blocking; and on a full
// start-and-rank tie, when its completion anchor is later.
function displacesDated<T extends RollupCheckShape>(
  candidate: { anchor: number; item: T },
  incumbent: { anchor: number; item: T } | undefined,
  rank: (item: T) => number,
): boolean {
  if (incumbent === undefined || candidate.anchor > incumbent.anchor) {
    return true;
  }
  if (candidate.anchor < incumbent.anchor) {
    return false;
  }
  const rankDelta = rank(candidate.item) - rank(incumbent.item);
  if (rankDelta !== 0) {
    return rankDelta > 0;
  }
  return completionAnchorOf(candidate.item) > completionAnchorOf(incumbent.item);
}

// The order-independent survivor of one key's runs: latest dated run
// (more-blocking on an exact anchor tie), then one cross-compare against
// the most-blocking undated run.
function survivorOf<T extends RollupCheckShape>(
  items: readonly [T, ...T[]],
  rank: (item: T) => number,
): T {
  let dated: { anchor: number; item: T } | undefined;
  let undated: T | undefined;
  for (const item of items) {
    const anchor = anchorOf(item);
    if (anchor === null) {
      undated = moreBlocking(undated, item, rank);
    } else if (displacesDated({ anchor, item }, dated, rank)) {
      dated = { anchor, item };
    }
  }
  if (dated === undefined) {
    // Every item was undated, so the most-blocking undated one stands;
    // items is non-empty by the group type, hence the ?? never fires.
    return undated ?? items[0];
  }
  return undated !== undefined && rank(undated) > rank(dated.item) ? undated : dated.item;
}

function groupByKey<T extends RollupCheckShape>(items: readonly T[]): Map<string, [T, ...T[]]> {
  const groups = new Map<string, [T, ...T[]]>();
  for (const item of items.filter(participates)) {
    const key = reductionKey(item);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, [item]);
    } else {
      group.push(item);
    }
  }
  return groups;
}

/**
 * Reduce rollup items to the latest run per (workflow, check name), each
 * key's survivor emitted at the position of the key's first occurrence;
 * non-participating items pass through in place.
 */
export function latestRunPerCheck<T extends RollupCheckShape>(
  items: readonly T[],
  rank: (item: T) => number,
): T[] {
  const groups = groupByKey(items);
  const emitted = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (!participates(item)) {
      out.push(item);
      continue;
    }
    const key = reductionKey(item);
    const group = groups.get(key);
    if (group !== undefined && !emitted.has(key)) {
      emitted.add(key);
      out.push(survivorOf(group, rank));
    }
  }
  return out;
}
