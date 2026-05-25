import { type CollaborationStateCliIo } from './cli-runtime.js';

/**
 * Narrow IO surface for auto-seed — the function only needs to read the seen-file,
 * list current comms events, and append seen IDs. Pinning the surface to a
 * `Pick` type lets tests substitute a tiny fake without re-implementing the
 * full CLI IO interface.
 */
export type AutoSeedIo = Pick<
  CollaborationStateCliIo,
  'readSeenIds' | 'readCommsEvents' | 'appendSeenMessageIds'
>;

export interface AutoSeedRunInput {
  readonly io: AutoSeedIo;
  readonly commsDir: string;
  readonly seenFile: string;
  /** If `true`, always seed with current events regardless of seen-file state. */
  readonly seedFromNow: boolean;
  /** If `true`, skip auto-seed entirely (legacy replay-on-empty behaviour). */
  readonly noAutoSeed: boolean;
}

/**
 * Decision returned by {@link seedSeenStateIfNeeded}. Discriminated on
 * `outcome` (string literal) to match the codebase convention used by
 * `WatcherStalenessResult` and `DrainResult`. Callers `switch (decision.outcome)`
 * to branch.
 *
 * `reason` values:
 *  - `'no-auto-seed'` — `--no-auto-seed` flag bypassed the auto-seed entirely.
 *  - `'seed-from-now'` — `--seed-from-now` flag forced a seed regardless of file state.
 *  - `'auto-seed-empty-or-missing'` — default branch: seen-file was empty or missing.
 *  - `'existing-seen-content'` — seen-file already had IDs; idempotent skip on restart.
 *
 * When `outcome === 'seeded'`, `eventIds` carries the IDs that were appended to
 * the seen-file. An `eventIds: []` value means the seed branch fired but the
 * comms directory contained zero events, so no write occurred — preserving
 * the idempotent-restart guarantee on empty-comms scenarios.
 */
export type AutoSeedDecision =
  | { readonly outcome: 'skipped'; readonly reason: 'no-auto-seed' | 'existing-seen-content' }
  | {
      readonly outcome: 'seeded';
      readonly reason: 'seed-from-now' | 'auto-seed-empty-or-missing';
      readonly eventIds: readonly string[];
    };

/**
 * Pre-loop bootstrap for the `comms watch` CLI. Decides whether to seed the
 * seen-file with the current set of comms-event IDs so the watcher starts
 * forward from now rather than replaying full history.
 *
 * Precedence (most-specific first):
 *   1. `--no-auto-seed` returns immediately — legacy replay-on-empty preserved.
 *   2. `--seed-from-now` always seeds — overrides any existing seen-file content.
 *   3. Empty/missing seen-file → auto-seed.
 *   4. Existing seen-file content → no-op (idempotent restart).
 *
 * The "missing" and "empty" branches collapse: the production `readSeenIds`
 * returns an empty `Set` on `ENOENT` (see `readSeenIdsFile` in
 * `cli-runtime.ts`), so callers do not need to distinguish.
 *
 * Auto-seed-on-empty is the cycle-9 intentional behaviour change. Any caller
 * that wants the legacy replay-on-empty contract must pass `--no-auto-seed`.
 */
export async function seedSeenStateIfNeeded(input: AutoSeedRunInput): Promise<AutoSeedDecision> {
  if (input.noAutoSeed) {
    return { outcome: 'skipped', reason: 'no-auto-seed' };
  }
  if (input.seedFromNow) {
    return await applySeed(input, 'seed-from-now');
  }
  const seenIds = await input.io.readSeenIds(input.seenFile);
  if (seenIds.size === 0) {
    return await applySeed(input, 'auto-seed-empty-or-missing');
  }
  return { outcome: 'skipped', reason: 'existing-seen-content' };
}

async function applySeed(
  input: AutoSeedRunInput,
  reason: 'seed-from-now' | 'auto-seed-empty-or-missing',
): Promise<AutoSeedDecision> {
  const events = await input.io.readCommsEvents(input.commsDir);
  const eventIds = events.map((event) => event.event_id);
  if (eventIds.length === 0) {
    // No events to seed — skip the write so an empty comms-dir does not cause
    // the seen-file to grow by one trailing newline on every restart
    // (appendSeenMessageIds writes `eventIds.join('\n') + '\n'`).
    return { outcome: 'seeded', reason, eventIds: [] };
  }
  await input.io.appendSeenMessageIds(input.seenFile, eventIds);
  return { outcome: 'seeded', reason, eventIds };
}
