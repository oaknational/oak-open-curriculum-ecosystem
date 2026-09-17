/*
 * The run-lease's real io (EI-3): same-host pid probing and the lease
 * file's lifecycle under demo-evidence/. The DECISION lives pure in
 * run-lease.ts; this module only feeds it observations and executes
 * its verdict.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { readTextIfExists } from './evidence-io';
import {
  judgeRunLease,
  LeaseFileSchema,
  RUN_LEASE_NAME,
  type HolderLiveness,
  type LeaseFileContent,
} from './run-lease';
import { describeThrown } from './support';

/** Same-host pid probe: signal 0 proves existence without touching the
 *  process; EPERM means alive-but-not-ours, so only ESRCH reads gone. */
function probePidLiveness(pid: number): HolderLiveness {
  try {
    process.kill(pid, 0);
    return 'alive';
  } catch (error: unknown) {
    const code =
      error !== null && typeof error === 'object' && 'code' in error ? error.code : undefined;
    return code === 'ESRCH' ? 'gone' : 'alive';
  }
}

/** Take the evidence-set run lease (EI-3), or refuse with the holder
 *  named. On success returns the release thunk the run's finally MUST
 *  call. A corrupt/unparseable lease file carries no trustworthy holder
 *  and is treated as absent. */
export function acquireRunLease(demoDir: string, runId: string): Result<() => void, string> {
  const leasePath = path.join(demoDir, 'demo-evidence', RUN_LEASE_NAME);
  const existing = readExistingLease(leasePath);
  if (!existing.ok) {
    return err(existing.error);
  }
  const self = { runId, pid: process.pid, hostname: os.hostname() };
  const verdict = judgeRunLease({
    nowMs: Date.now(),
    self,
    existing: existing.value,
    holderLiveness: livenessOf(existing.value, self.hostname),
    existingStartMs: startMsOf(existing.value),
  });
  if (!verdict.ok) {
    return err(verdict.error);
  }
  const wrote = writeLease(leasePath, self);
  if (!wrote.ok) {
    return wrote;
  }
  return ok(() => {
    // Release is best-effort by design: the lease's OWN lifecycle file,
    // and a stale one is reclaimed by the liveness probe next run.
    fs.rmSync(leasePath, { force: true });
  });
}

/** A corrupt/unparseable lease carries no trustworthy holder → absent. */
function readExistingLease(leasePath: string): Result<LeaseFileContent | undefined, string> {
  const raw = readTextIfExists(leasePath, 'run lease');
  if (!raw.ok) {
    return err(raw.error);
  }
  if (raw.value === undefined) {
    return ok(undefined);
  }
  try {
    const parsed = LeaseFileSchema.safeParse(JSON.parse(raw.value));
    return ok(parsed.success ? parsed.data : undefined);
  } catch {
    return ok(undefined);
  }
}

function livenessOf(existing: LeaseFileContent | undefined, selfHostname: string): HolderLiveness {
  if (existing === undefined || existing.hostname !== selfHostname) {
    return 'unknown';
  }
  return probePidLiveness(existing.pid);
}

function startMsOf(existing: LeaseFileContent | undefined): number | undefined {
  const ms = existing === undefined ? Number.NaN : Date.parse(existing.startedAt);
  return Number.isNaN(ms) ? undefined : ms;
}

function writeLease(
  leasePath: string,
  self: { runId: string; pid: number; hostname: string },
): Result<void, string> {
  try {
    fs.mkdirSync(path.dirname(leasePath), { recursive: true });
    fs.writeFileSync(
      leasePath,
      JSON.stringify({ ...self, startedAt: new Date().toISOString() }, null, 2),
    );
    return ok(undefined);
  } catch (error: unknown) {
    return err(`run lease write failed — ${describeThrown(error)}`);
  }
}
