import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { CODEX_CONFIG_PATH, readCodexAgentRegistrations } from './codex-project-agent-registry.js';
import {
  CLAUDE_AGENTS_DIR,
  CODEX_AGENTS_DIR,
  CURSOR_AGENTS_DIR,
  listBasenames,
} from './health-probe-shared.js';
import type { HealthCheckResult } from './health-probe-types.js';
import {
  getReviewerAdapterPlatformViolation,
  type ReviewerAdapterPlatform,
} from './reviewer-adapter-platform-contract.js';

interface ReviewerAdapterParityInputs {
  /** Reviewer adapter basenames present on the Cursor surface. */
  readonly cursorAgents: readonly string[];
  /** Reviewer adapter basenames present on the Claude Code surface. */
  readonly claudeAgents: readonly string[];
  /** Reviewer adapter basenames present on the Codex surface. */
  readonly codexAgents: readonly string[];
}

export function evaluateParityChecks(repoRoot: string): readonly HealthCheckResult[] {
  return [evaluateReviewerAdapterParity(repoRoot), evaluateReviewerRegistrationParity(repoRoot)];
}

function evaluateReviewerAdapterParity(repoRoot: string): HealthCheckResult {
  return evaluateReviewerAdapterParityFromInputs({
    cursorAgents: listBasenames(repoRoot, CURSOR_AGENTS_DIR, '.md'),
    claudeAgents: listBasenames(repoRoot, CLAUDE_AGENTS_DIR, '.md'),
    codexAgents: listBasenames(repoRoot, CODEX_AGENTS_DIR, '.toml'),
  });
}

/**
 * Evaluates reviewer-adapter parity from already enumerated platform surfaces.
 *
 * This pure seam keeps filesystem discovery in the production composition
 * while allowing unit tests to exercise role-aware parity directly.
 *
 * @param platformAgents - Adapter basenames present on each platform surface.
 * @returns A passing result when every adapter appears exactly where supported,
 *   otherwise a failing result with one detail per parity violation.
 */
export function evaluateReviewerAdapterParityFromInputs(
  platformAgents: ReviewerAdapterParityInputs,
): HealthCheckResult {
  const allAgentNames = [
    ...new Set([
      ...platformAgents.cursorAgents,
      ...platformAgents.claudeAgents,
      ...platformAgents.codexAgents,
    ]),
  ].sort((a, b) => a.localeCompare(b));
  const details = collectReviewerAdapterParityDetails(allAgentNames, platformAgents);

  if (details.length > 0) {
    return {
      key: 'reviewer-adapter-parity',
      label: 'Reviewer adapter parity',
      status: 'fail',
      summary: 'Reviewer adapters are not present on every supported platform surface.',
      details,
    };
  }

  return {
    key: 'reviewer-adapter-parity',
    label: 'Reviewer adapter parity',
    status: 'pass',
    summary: `${allAgentNames.length} reviewer adapters are aligned across their applicable platform surfaces.`,
    details: [],
  };
}

function collectReviewerAdapterParityDetails(
  allAgentNames: readonly string[],
  platformAgents: ReviewerAdapterParityInputs,
): string[] {
  const details: string[] = [];

  for (const agentName of allAgentNames) {
    collectPlatformParityDetail(
      details,
      agentName,
      'cursor',
      'Cursor',
      platformAgents.cursorAgents,
    );
    collectPlatformParityDetail(
      details,
      agentName,
      'claude-code',
      'Claude Code',
      platformAgents.claudeAgents,
    );
    collectPlatformParityDetail(details, agentName, 'codex', 'Codex', platformAgents.codexAgents);
  }

  return details;
}

function collectPlatformParityDetail(
  details: string[],
  agentName: string,
  platform: ReviewerAdapterPlatform,
  platformLabel: string,
  platformAgents: readonly string[],
): void {
  const hasAdapter = platformAgents.includes(agentName);
  const violation = getReviewerAdapterPlatformViolation(agentName, platform, hasAdapter);

  if (violation?.kind === 'missing') {
    details.push(`${platformLabel} is missing reviewer adapter ${violation.reviewerName}.`);
  }
  if (violation?.kind === 'unsupported') {
    details.push(`${platformLabel} has unsupported reviewer adapter ${violation.reviewerName}.`);
  }
}

function evaluateReviewerRegistrationParity(repoRoot: string): HealthCheckResult {
  const codexAdapterNames = listBasenames(repoRoot, CODEX_AGENTS_DIR, '.toml');

  try {
    const registrations = readCodexAgentRegistrations(repoRoot);
    const details = collectReviewerRegistrationDetails(repoRoot, codexAdapterNames, registrations);

    if (details.length > 0) {
      return {
        key: 'reviewer-registration-parity',
        label: 'Reviewer registration parity',
        status: 'fail',
        summary: 'Codex reviewer registrations and adapter files are out of sync.',
        details,
      };
    }

    return {
      key: 'reviewer-registration-parity',
      label: 'Reviewer registration parity',
      status: 'pass',
      summary: `${registrations.length} Codex reviewer registrations resolve cleanly to live adapters.`,
      details: [],
    };
  } catch (error) {
    return {
      key: 'reviewer-registration-parity',
      label: 'Reviewer registration parity',
      status: 'fail',
      summary: 'Codex reviewer registration could not be resolved cleanly.',
      details: [error instanceof Error ? error.message : String(error)],
    };
  }
}

function collectReviewerRegistrationDetails(
  repoRoot: string,
  codexAdapterNames: readonly string[],
  registrations: readonly { name: string; configFile: string }[],
): string[] {
  const registrationNames = registrations.map((registration) => registration.name);
  const details: string[] = [];

  for (const adapterName of codexAdapterNames) {
    if (!registrationNames.includes(adapterName)) {
      details.push(
        `Codex adapter ${adapterName} is missing a registry entry in ${CODEX_CONFIG_PATH}.`,
      );
    }
  }

  for (const registration of registrations) {
    if (!existsSync(join(repoRoot, registration.configFile))) {
      details.push(`${CODEX_CONFIG_PATH} points at missing adapter ${registration.configFile}.`);
    }
  }

  return details;
}
