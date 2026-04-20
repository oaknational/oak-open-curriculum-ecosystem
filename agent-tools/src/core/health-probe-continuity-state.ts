import {
  calculateAgeDays,
  CONTINUITY_CONTRACT_PATH,
  FRESHNESS_WARNING_DAYS,
  readFrontmatterValue,
  readOptionalText,
} from './health-probe-shared';
import type { HealthCheckResult } from './health-probe-types';

const CHECK_KEY = 'continuity-contract-freshness';
const CHECK_LABEL = 'Continuity contract freshness';

/**
 * Behaviour-level check: does operational memory carry a recent
 * continuity contract at the canonical path?
 *
 * This probe asserts presence and freshness only. The structure of
 * the contract (sections, fields) is the write-side responsibility
 * of `session-handoff`; duplicating structural checks here would be
 * configuration-assertion (see `.agent/directives/testing-strategy.md`).
 */
export function evaluateContinuityContractFreshness(
  repoRoot: string,
  now: Date,
): HealthCheckResult {
  const contractText = readOptionalText(repoRoot, CONTINUITY_CONTRACT_PATH);
  if (contractText === null) {
    return missingContractResult();
  }

  const lastRefreshed = readContinuityLastRefreshed(contractText);
  if (!lastRefreshed) {
    return missingFreshnessMarkerResult();
  }

  const ageDays = calculateAgeDays(lastRefreshed, now);
  if (ageDays === null) {
    return invalidFreshnessDateResult(lastRefreshed);
  }

  if (ageDays > FRESHNESS_WARNING_DAYS) {
    return staleContractResult(lastRefreshed, ageDays);
  }

  return {
    key: CHECK_KEY,
    label: CHECK_LABEL,
    status: 'pass',
    summary: 'The live continuity contract is present and recent.',
    details: [],
  };
}

function missingContractResult(): HealthCheckResult {
  return {
    key: CHECK_KEY,
    label: CHECK_LABEL,
    status: 'fail',
    summary: `${CONTINUITY_CONTRACT_PATH} is missing.`,
    details: [
      `The live continuity contract must exist at ${CONTINUITY_CONTRACT_PATH} (operational memory).`,
    ],
  };
}

function missingFreshnessMarkerResult(): HealthCheckResult {
  return {
    key: CHECK_KEY,
    label: CHECK_LABEL,
    status: 'fail',
    summary: 'The continuity contract has no `Last refreshed` marker.',
    details: [
      'Add a `**Last refreshed**: YYYY-MM-DD` line (or a `last_updated:` frontmatter field) so freshness can be tracked.',
    ],
  };
}

function invalidFreshnessDateResult(lastRefreshed: string): HealthCheckResult {
  return {
    key: CHECK_KEY,
    label: CHECK_LABEL,
    status: 'fail',
    summary: 'The continuity contract freshness marker is not a valid ISO date.',
    details: [`\`Last refreshed\` value \`${lastRefreshed}\` is not a valid ISO date.`],
  };
}

function staleContractResult(lastRefreshed: string, ageDays: number): HealthCheckResult {
  return {
    key: CHECK_KEY,
    label: CHECK_LABEL,
    status: 'warn',
    summary: 'The continuity contract is older than the freshness target and should be refreshed.',
    details: [
      `\`${CONTINUITY_CONTRACT_PATH}\` Last refreshed: ${lastRefreshed} (${ageDays} days old).`,
    ],
  };
}

function readContinuityLastRefreshed(contractText: string): string | null {
  const match = contractText.match(/\*\*Last refreshed\*\*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  if (match?.[1]) {
    return match[1];
  }
  return readFrontmatterValue(contractText, 'last_updated');
}
