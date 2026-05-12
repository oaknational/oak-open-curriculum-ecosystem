import { activeAgentReports } from './active-agents.js';
import { claimReport, sameAgent } from './claim-reports.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, type Options } from './cli-options.js';
import { readActiveClaimsFile, readClosedClaimsFile } from './state-io.js';
import { type CollaborationStateEnvironment } from './types.js';

export async function listClaims(options: Options): Promise<string> {
  const registry = await readActiveClaimsFile(required(options, 'active'));
  const nowIso = nowFromOptions(options);
  const reports = registry.claims.map((claim) => claimReport(claim, nowIso));

  return `${JSON.stringify(reports, null, 2)}\n`;
}

export async function mineClaims(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env).agent_id;
  const registry = await readActiveClaimsFile(required(options, 'active'));
  const nowIso = nowFromOptions(options);
  const reports = registry.claims
    .filter((claim) => sameAgent(claim.agent_id, identity))
    .map((claim) => claimReport(claim, nowIso));

  return `${JSON.stringify(reports, null, 2)}\n`;
}

export async function showClaim(options: Options): Promise<string> {
  const registry = await readActiveClaimsFile(required(options, 'active'));
  const claimId = required(options, 'claim-id');
  const claim = registry.claims.find((entry) => entry.claim_id === claimId);
  if (claim === undefined) {
    throw new Error(`unknown claim_id: ${claimId}`);
  }

  return `${JSON.stringify(claimReport(claim, nowFromOptions(options)), null, 2)}\n`;
}

export async function statusClaims(options: Options): Promise<string> {
  const registry = await readActiveClaimsFile(required(options, 'active'));
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
  const registry = await readActiveClaimsFile(required(options, 'active'));
  const closedPath = optional(options, 'closed');
  const closedArchive =
    closedPath === undefined ? undefined : await readClosedClaimsFile(closedPath);

  return `${JSON.stringify(
    activeAgentReports(registry, nowFromOptions(options), closedArchive),
    null,
    2,
  )}\n`;
}

function nowFromOptions(options: Options): string {
  return optional(options, 'now') ?? new Date().toISOString();
}
