import { dirname, join } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';

import { activeAgentReports } from './active-agents.js';
import { claimReport, sameAgent } from './claim-reports.js';
import { commitQueueDirForActivePath, readCommitQueueEntries } from './commit-queue-store.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, type Options } from './cli-options.js';
import { readActiveClaimsFile, readClosedClaimsFile } from './state-io.js';
import { type CollaborationStateEnvironment } from './types.js';
import { projectWorkState } from './work-state-view.js';

export async function listClaims(options: Options): Promise<string> {
  const registry = unwrapOrThrow(await readActiveClaimsFile(required(options, 'active')));
  const nowIso = nowFromOptions(options);
  const reports = registry.claims.map((claim) => claimReport(claim, nowIso));

  return `${JSON.stringify(reports, null, 2)}\n`;
}

export async function mineClaims(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env).agent_id;
  const registry = unwrapOrThrow(await readActiveClaimsFile(required(options, 'active')));
  const nowIso = nowFromOptions(options);
  const reports = registry.claims
    .filter((claim) => sameAgent(claim.agent_id, identity))
    .map((claim) => claimReport(claim, nowIso));

  return `${JSON.stringify(reports, null, 2)}\n`;
}

export async function showClaim(options: Options): Promise<string> {
  const registry = unwrapOrThrow(await readActiveClaimsFile(required(options, 'active')));
  const claimId = required(options, 'claim-id');
  const claim = registry.claims.find((entry) => entry.claim_id === claimId);
  if (claim === undefined) {
    throw new Error(`unknown claim_id: ${claimId}`);
  }

  return `${JSON.stringify(claimReport(claim, nowFromOptions(options)), null, 2)}\n`;
}

export async function statusClaims(options: Options): Promise<string> {
  const registry = unwrapOrThrow(await readActiveClaimsFile(required(options, 'active')));
  const nowIso = nowFromOptions(options);
  const reports = registry.claims.map((claim) => claimReport(claim, nowIso));

  return `${JSON.stringify(
    {
      total: reports.length,
      fresh: reports.filter((claim) => claim.freshness_status === 'fresh').length,
      stale: reports.filter((claim) => claim.freshness_status === 'stale').length,
      claims: reports,
    },
    null,
    2,
  )}\n`;
}

export async function activeAgents(options: Options): Promise<string> {
  const activePath = required(options, 'active');
  const registry = unwrapOrThrow(await readActiveClaimsFile(activePath));
  const nowIso = nowFromOptions(options);
  const commitQueue = await readCommitQueueEntries({
    queueDir: commitQueueDirForActivePath(activePath),
    nowIso,
  });
  const closedPath = optional(options, 'closed');
  const closedArchive =
    closedPath === undefined ? undefined : unwrapOrThrow(await readClosedClaimsFile(closedPath));

  return `${JSON.stringify(
    activeAgentReports(registry, commitQueue, nowIso, closedArchive),
    null,
    2,
  )}\n`;
}

/**
 * Render the derived cross-worktree work-state view (F-98, spawn-flow Phase 2):
 * one row per `git worktree list` worktree, each bound to its agent via the
 * heartbeat-branch link and enriched with the claim intent and a `lastSeen`
 * recency. The `--active`/`--comms-dir` paths default to the coordination home
 * so a worktree-isolated seat sees the whole team. Replaces the hand-maintained
 * `cross-worktree-work-state.md` roster with a projection over ground truth.
 */
export async function workState(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const activePath = required(options, 'active');
  const collaborationDir = dirname(activePath);
  const commsDir = optional(options, 'comms-dir') ?? join(collaborationDir, 'comms');
  const nowIso = nowFromOptions(options);
  const nowMs = Date.parse(nowIso);
  if (Number.isNaN(nowMs)) {
    throw new Error(`--now must be an ISO-8601 timestamp (got: ${nowIso})`);
  }

  const registry = unwrapOrThrow(await io.readActiveClaimsFile(activePath));
  const commitQueue = await io.readCommitQueueEntries({
    queueDir: commitQueueDirForActivePath(activePath),
    nowIso,
  });
  const closedPath = optional(options, 'closed');
  const closedArchive =
    closedPath === undefined ? undefined : unwrapOrThrow(await io.readClosedClaimsFile(closedPath));
  const [events, worktrees] = await Promise.all([
    io.readCommsEvents(commsDir),
    io.readWorktrees(collaborationDir),
  ]);

  const rows = projectWorkState({
    worktrees,
    events,
    activeAgents: activeAgentReports(registry, commitQueue, nowIso, closedArchive),
    nowMs,
  });

  return `${JSON.stringify(rows, null, 2)}\n`;
}

function nowFromOptions(options: Options): string {
  return optional(options, 'now') ?? new Date().toISOString();
}
