/*
 * The run lease (EI-3): one capture run per evidence set at a time.
 * Two concurrent runs previously interleaved freely — run A stopping
 * the shared server mid-B-capture, both writing fixed paths. The lease
 * file under demo-evidence/ names the holder; the DECISION about it is
 * pure and liveness-driven, never TTL-alone: a dead holder reclaims
 * immediately (no crash ever wedges the tool), a LIVE holder is never
 * reclaimed regardless of age (a long hub run is healthy, not stale),
 * and TTL governs only the one case liveness cannot answer — a holder
 * on a foreign host.
 */
import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/** The lease file's location under a demo root's evidence tree. */
export const RUN_LEASE_NAME = '.fidelity-run-lease.json';

/** How long a FOREIGN-host lease (liveness unknowable) holds before it
 *  may be reclaimed. Same-host decisions never consult this. */
export const RUN_LEASE_TTL_MS = 15 * 60 * 1000;

export const LeaseFileSchema = z.strictObject({
  runId: z.string().min(1),
  pid: z.number().int().positive(),
  hostname: z.string().min(1),
  startedAt: z.string().min(1),
});

export type LeaseFileContent = z.infer<typeof LeaseFileSchema>;

/** What the prober could learn about the recorded holder: `alive` /
 *  `gone` from a same-host pid probe; `unknown` for a foreign host. */
export type HolderLiveness = 'alive' | 'gone' | 'unknown';

export interface LeaseJudgement {
  /** Epoch ms now — injected, no hidden clock. */
  readonly nowMs: number;
  readonly self: { readonly runId: string; readonly pid: number; readonly hostname: string };
  readonly existing: LeaseFileContent | undefined;
  readonly holderLiveness: HolderLiveness;
  /** Epoch ms the existing lease was taken (parsed by the caller from
   *  `startedAt`; NaN-invalid dates count as age-unknowable). */
  readonly existingStartMs: number | undefined;
}

function isOwnLease(existing: LeaseFileContent, self: LeaseJudgement['self']): boolean {
  return (
    existing.runId === self.runId &&
    existing.pid === self.pid &&
    existing.hostname === self.hostname
  );
}

/** The one case liveness cannot answer: a foreign-host holder. TTL
 *  governs; an age-unknowable lease (invalid timestamp) never silently
 *  reclaims. */
function judgeForeignHold(
  judgement: LeaseJudgement,
  existing: LeaseFileContent,
): Result<'reclaim', string> {
  const age =
    judgement.existingStartMs === undefined
      ? undefined
      : judgement.nowMs - judgement.existingStartMs;
  if (age !== undefined && age > RUN_LEASE_TTL_MS) {
    return ok('reclaim');
  }
  return err(
    `a fidelity run on another host holds the evidence lease (runId ${existing.runId} on ${existing.hostname}, since ${existing.startedAt}) and is within the ${String(RUN_LEASE_TTL_MS / 60000)}-minute foreign-host TTL — wait or remove ${RUN_LEASE_NAME} if you know it is dead`,
  );
}

/**
 * Judge one acquisition attempt. Pure. `acquire` — no lease exists;
 * `refresh` — the lease is OURS; `reclaim` — the recorded holder is
 * provably dead, or foreign and older than the TTL. A live holder is a
 * refusal that names it, never a wait loop (loop-exit-criteria: the
 * caller fails loud and the operator decides).
 */
export function judgeRunLease(
  judgement: LeaseJudgement,
): Result<'acquire' | 'refresh' | 'reclaim', string> {
  const { existing, self } = judgement;
  if (existing === undefined) {
    return ok('acquire');
  }
  if (isOwnLease(existing, self)) {
    return ok('refresh');
  }
  if (judgement.holderLiveness === 'gone') {
    return ok('reclaim');
  }
  if (judgement.holderLiveness === 'alive') {
    return err(
      `another fidelity run holds the evidence lease (runId ${existing.runId}, pid ${existing.pid} on ${existing.hostname}, since ${existing.startedAt}) and is still alive — wait for it or stop it explicitly`,
    );
  }
  return judgeForeignHold(judgement, existing);
}
