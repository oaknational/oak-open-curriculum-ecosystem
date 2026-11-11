import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Result } from '@oaknational/result';

import { SURFACE_OF } from '../subagent-declarations/adapter-spec.js';
import {
  SUBAGENT_PLATFORMS,
  type SubagentPlatform,
} from '../subagent-declarations/declaration-scalars.js';
import {
  readDeclaredAdapters,
  type DeclaredAdapter,
} from '../subagent-declarations/declared-adapters.js';
import {
  CODEX_CONFIG_PATH,
  readCodexAgentRegistrations,
  resolveCodexAgentConfigFilePath,
} from './codex-project-agent-registry.js';
import { CODEX_AGENTS_DIR, listBasenames } from './health-probe-shared.js';
import type { HealthCheckResult } from './health-probe-types.js';

interface ReviewerAdapterParityInputs {
  /** The adapters the declarations render, each with the platforms it names. */
  readonly declared: readonly DeclaredAdapter[];
  /** Reviewer adapter basenames present on each platform surface. */
  readonly present: Readonly<Record<SubagentPlatform, readonly string[]>>;
}

interface ReviewerRegistrationParityInputs {
  /** Repository root used to resolve project-relative registration paths. */
  readonly repoRoot: string;
  /** Reviewer adapter basenames present on the Codex surface. */
  readonly codexAdapterNames: readonly string[];
  /** Reviewer names and config paths read from the Codex project registry. */
  readonly registrations: readonly { readonly name: string; readonly configFile: string }[];
  /** Pure boundary for determining whether a resolved adapter path exists. */
  readonly pathExists: (path: string) => boolean;
}

const PLATFORM_LABEL: Readonly<Record<SubagentPlatform, string>> = {
  cursor: 'Cursor',
  claude: 'Claude Code',
  codex: 'Codex',
  gemini: 'Gemini',
};

export function evaluateParityChecks(repoRoot: string): readonly HealthCheckResult[] {
  return [evaluateReviewerAdapterParity(repoRoot), evaluateReviewerRegistrationParity(repoRoot)];
}

/** No surface listed: the declaration read refused, so the comparison never runs. */
const UNLISTED_SURFACES: ReviewerAdapterParityInputs['present'] = {
  cursor: [],
  claude: [],
  codex: [],
  gemini: [],
};

/** The adapter basenames present on one platform's surface. */
function surfaceBasenames(repoRoot: string, platform: SubagentPlatform): readonly string[] {
  const surface = SURFACE_OF[platform];
  return listBasenames(repoRoot, surface.dir, surface.extension);
}

/**
 * Adapter parity against the declarations: the templates' declarations are the one platform
 * truth (`subagent-declarations/declared-adapters.ts`), so a declaration that cannot be read
 * fails the check outright rather than comparing the surfaces against a partial truth.
 */
function evaluateReviewerAdapterParity(repoRoot: string): HealthCheckResult {
  const declared = readDeclaredAdapters(repoRoot);
  // A refusal fails the check before any surface is listed: listing is a read that can itself
  // throw, and the refusal is the whole verdict.
  if (!declared.ok) {
    return reviewerAdapterParityOf(declared, UNLISTED_SURFACES);
  }
  return reviewerAdapterParityOf(declared, {
    cursor: surfaceBasenames(repoRoot, 'cursor'),
    claude: surfaceBasenames(repoRoot, 'claude'),
    codex: surfaceBasenames(repoRoot, 'codex'),
    gemini: surfaceBasenames(repoRoot, 'gemini'),
  });
}

/**
 * The adapter-parity check over the declarations as read and the surfaces as listed: a
 * declaration read that refused fails the check outright, naming the refusal; otherwise the
 * declared adapters are compared with the surfaces (`evaluateReviewerAdapterParityFromInputs`).
 *
 * @param declared - The declared adapters, or the read's refusal.
 * @param present - The adapter basenames present on each platform surface.
 * @returns The check result.
 */
export function reviewerAdapterParityOf(
  declared: Result<readonly DeclaredAdapter[], string>,
  present: ReviewerAdapterParityInputs['present'],
): HealthCheckResult {
  if (!declared.ok) {
    return {
      key: 'reviewer-adapter-parity',
      label: 'Reviewer adapter parity',
      status: 'fail',
      summary:
        'The sub-agent declarations could not be read, so adapter parity has no truth to compare against.',
      details: [declared.error],
    };
  }
  return evaluateReviewerAdapterParityFromInputs({ declared: declared.value, present });
}

/**
 * Evaluates reviewer-adapter parity from the declared adapters and the enumerated surfaces.
 *
 * This pure seam keeps filesystem discovery in the production composition while allowing
 * unit tests to exercise declaration-driven parity directly: an adapter is expected on
 * exactly the platforms its declaration names, so a surface missing a declared adapter and
 * a surface carrying an adapter no declaration renders there are both violations.
 *
 * @param input - The declared adapters and the basenames present on each surface.
 * @returns A passing result when every adapter appears exactly where declared, otherwise a
 *   failing result with one detail per parity violation.
 */
export function evaluateReviewerAdapterParityFromInputs(
  input: ReviewerAdapterParityInputs,
): HealthCheckResult {
  const details = collectReviewerAdapterParityDetails(input);

  if (details.length > 0) {
    return {
      key: 'reviewer-adapter-parity',
      label: 'Reviewer adapter parity',
      status: 'fail',
      summary: 'Reviewer adapters are not present exactly where their declarations name them.',
      details,
    };
  }

  return {
    key: 'reviewer-adapter-parity',
    label: 'Reviewer adapter parity',
    status: 'pass',
    summary: `${input.declared.length} declared reviewer adapters are aligned across their declared platform surfaces.`,
    details: [],
  };
}

function collectReviewerAdapterParityDetails(input: ReviewerAdapterParityInputs): string[] {
  const details: string[] = [];

  for (const platform of SUBAGENT_PLATFORMS) {
    const label = PLATFORM_LABEL[platform];
    const expected = input.declared
      .filter((adapter) => adapter.platforms.includes(platform))
      .map((adapter) => adapter.name);
    const present = input.present[platform];
    for (const name of expected) {
      if (!present.includes(name)) {
        details.push(`${label} is missing reviewer adapter ${name}.`);
      }
    }
    for (const name of present) {
      if (!expected.includes(name)) {
        details.push(`${label} has unsupported reviewer adapter ${name}.`);
      }
    }
  }

  return details;
}

function evaluateReviewerRegistrationParity(repoRoot: string): HealthCheckResult {
  const codexAdapterNames = listBasenames(repoRoot, CODEX_AGENTS_DIR, '.toml');

  try {
    const registrations = readCodexAgentRegistrations(repoRoot);
    return evaluateReviewerRegistrationParityFromInputs({
      repoRoot,
      codexAdapterNames,
      registrations,
      pathExists: existsSync,
    });
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

/**
 * Evaluates Codex reviewer-registration parity from discovered adapters and registrations.
 *
 * This pure seam keeps registry and filesystem reads in the production composition while
 * preserving the Codex path-resolution contract for repository-relative and absolute paths.
 *
 * @param input - Repository context, discovered adapters, registrations, and path boundary.
 * @returns A passing result when every adapter is registered and every registration resolves to
 *   an existing adapter, otherwise a failing result with one detail per parity violation.
 */
export function evaluateReviewerRegistrationParityFromInputs(
  input: ReviewerRegistrationParityInputs,
): HealthCheckResult {
  const details = collectReviewerRegistrationDetails(input);
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
    summary: `${input.registrations.length} Codex reviewer registrations resolve cleanly to live adapters.`,
    details: [],
  };
}

function collectReviewerRegistrationDetails(input: ReviewerRegistrationParityInputs): string[] {
  const registrationNames = new Set(input.registrations.map((registration) => registration.name));
  const details: string[] = [];

  for (const adapterName of input.codexAdapterNames) {
    if (!registrationNames.has(adapterName)) {
      details.push(
        `Codex adapter ${adapterName} is missing a registry entry in ${CODEX_CONFIG_PATH}.`,
      );
    }
  }

  for (const registration of input.registrations) {
    const resolvedPath = resolve(
      input.repoRoot,
      resolveCodexAgentConfigFilePath(registration.configFile),
    );
    if (!input.pathExists(resolvedPath)) {
      details.push(`${CODEX_CONFIG_PATH} points at missing adapter ${registration.configFile}.`);
    }
  }

  return details;
}
