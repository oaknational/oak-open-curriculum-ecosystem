/**
 * Validation entry point for Codex subagent adapter TOML files.
 *
 * Orchestrates the full adapter validation: field checks (required TOML keys,
 * required settings, registry cross-reference) followed by developer-
 * instructions presence and canonical template reference checks.
 *
 * Field-level helpers live in the sibling module
 * `validate-subagents-codex-adapter-field-checks.ts`.
 *
 * Registration-level validation lives in the sibling module
 * `validate-subagents-codex-registration-validation.ts`.
 *
 * All logic is I/O-free — callers supply content as strings.
 */

import {
  createTopLevelTomlBasicStringReader,
  type TopLevelTomlBasicStringReader,
} from '../../core/toml-top-level-basic-string.js';
import { CODEX_CONFIG_PATH, type CodexRegistration } from './validate-subagents-codex-toml.js';

import {
  extractCanonicalPaths,
  readCodexDeveloperInstructions,
} from './validate-subagents-codex-instructions.js';

import {
  stripBasename,
  validateAdapterFields,
} from './validate-subagents-codex-adapter-field-checks.js';

// ---------------------------------------------------------------------------
// Module-private constants
// ---------------------------------------------------------------------------

/** Default base directory for Codex agent template files. */
const DEFAULT_TEMPLATE_DIR = '.agent/sub-agents/templates';

// ---------------------------------------------------------------------------
// Role contracts
// ---------------------------------------------------------------------------

/**
 * The settings shared by every Codex subagent adapter file.
 */
const COMMON_CODEX_SETTINGS: readonly (readonly [string, string])[] = [
  ['sandbox_mode', 'read-only'],
  ['approval_policy', 'never'],
];

interface CodexCricketRoleContract {
  readonly settings: readonly (readonly [string, string])[];
  readonly templatePath: string;
}

/** The model, effort, and method contract for each Codex Cricket panel role. */
const CODEX_CRICKET_ROLE_CONTRACTS: Readonly<Record<string, CodexCricketRoleContract>> = {
  'cricket-judgement-low': {
    settings: [
      ['model', 'gpt-5.6-sol'],
      ['model_reasoning_effort', 'low'],
    ],
    templatePath: '.agent/sub-agents/templates/cricket-judgement.md',
  },
  'cricket-judgement-medium': {
    settings: [
      ['model', 'gpt-5.6-terra'],
      ['model_reasoning_effort', 'medium'],
    ],
    templatePath: '.agent/sub-agents/templates/cricket-judgement.md',
  },
  'cricket-procedure-xhigh': {
    settings: [
      ['model', 'gpt-5.6-luna'],
      ['model_reasoning_effort', 'xhigh'],
    ],
    templatePath: '.agent/sub-agents/templates/cricket-procedure.md',
  },
};

/** Resolve the required settings for an adapter role. */
function getRequiredCodexSettings(adapterBasename: string): readonly (readonly [string, string])[] {
  const roleSettings = CODEX_CRICKET_ROLE_CONTRACTS[adapterBasename]?.settings ?? [
    ['model_reasoning_effort', 'high'] as const,
  ];
  return [...roleSettings, ...COMMON_CODEX_SETTINGS];
}

function getCricketMethodContractIssues(
  adapterBasename: string,
  codexAdapterFile: string,
  templatePaths: readonly string[],
): string[] {
  const cricketContract = CODEX_CRICKET_ROLE_CONTRACTS[adapterBasename];
  if (cricketContract === undefined) {
    return [];
  }
  if (templatePaths.length === 1 && templatePaths[0] === cricketContract.templatePath) {
    return [];
  }
  return [
    `${codexAdapterFile}: developer_instructions must reference exactly ${cricketContract.templatePath} for its Cricket method contract`,
  ];
}

function formatErrorMessage(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).trimEnd();
}

// ---------------------------------------------------------------------------
// I/O shape interfaces
// ---------------------------------------------------------------------------

/**
 * Inputs for {@link getCodexAdapterValidation}.
 */
export interface CodexAdapterValidationInput {
  /** Repository-relative path to the adapter TOML file being validated. */
  readonly codexAdapterFile: string;

  /** Full text content of the adapter TOML file. */
  readonly content: string;

  /**
   * The `CodexRegistration` that declares this adapter in
   * `.codex/config.toml`, or `null` when no matching registration was found.
   */
  readonly registeredAgent?: CodexRegistration | null;

  /**
   * Repository-relative path prefix for canonical template files.
   * Defaults to `.agent/sub-agents/templates`.
   */
  readonly templateDir?: string;

  /**
   * List of required `[key, expectedValue]` TOML basic-string settings that
   * must be present in the adapter file.
   * Defaults to the role-aware Codex contract: ordinary reviewers retain
   * their current high-effort setting, while Cricket roles pin their named
   * model and effort.
   */
  readonly requiredSettings?: readonly (readonly [string, string])[];

  /**
   * Repository-relative path to the Codex config file.
   * Used when resolving the registered adapter path for cross-reference
   * checks.  Defaults to `.codex/config.toml`.
   */
  readonly configPath?: string;
}

/**
 * Outputs from {@link getCodexAdapterValidation}.
 */
export interface CodexAdapterValidationResult {
  /** Validation issues collected for this adapter file. */
  readonly issues: string[];

  /**
   * The subset of canonical paths extracted from `developer_instructions`
   * that reside inside the `templateDir`.
   */
  readonly templatePaths: string[];

  /**
   * All canonical `.agent/...` paths extracted from `developer_instructions`.
   */
  readonly canonicalPaths: string[];
}

// ---------------------------------------------------------------------------
// Public validation entry point
// ---------------------------------------------------------------------------

/**
 * Validates a single Codex subagent adapter TOML file.
 *
 * Checks performed:
 * - The adapter is valid TOML; malformed input produces one file-scoped issue.
 * - Required TOML keys `name` and `description` are present.
 * - The `name` value matches the adapter's filename (without `.toml`).
 * - A matching entry exists in `.codex/config.toml`, and both `name` and
 *   `description` are consistent with that registration.
 * - All required settings (e.g. `model_reasoning_effort`, `sandbox_mode`,
 *   `approval_policy`) are set to their mandated values.
 * - A top-level string-valued `developer_instructions` field is present.
 * - The `developer_instructions` body references at least one canonical
 *   template path inside `templateDir`.
 *
 * @param input - The adapter file path, its content, and optional overrides
 *   for the registered agent, template directory, required settings, and
 *   config path.
 * @returns A result object with collected issues, the template paths
 *   referenced in `developer_instructions`, and all canonical paths found.
 */
export function getCodexAdapterValidation({
  codexAdapterFile,
  content,
  registeredAgent = null,
  templateDir = DEFAULT_TEMPLATE_DIR,
  requiredSettings,
  configPath = CODEX_CONFIG_PATH,
}: CodexAdapterValidationInput): CodexAdapterValidationResult {
  let readValue: TopLevelTomlBasicStringReader;
  try {
    readValue = createTopLevelTomlBasicStringReader(content);
  } catch (error) {
    return {
      issues: [`${codexAdapterFile}: invalid TOML: ${formatErrorMessage(error)}`],
      templatePaths: [],
      canonicalPaths: [],
    };
  }

  const adapterBasename = stripBasename(codexAdapterFile, '.toml');
  const declaredName = readValue('name');
  const declaredDescription = readValue('description');
  const issues: string[] = validateAdapterFields({
    adapterFile: codexAdapterFile,
    adapterBasename,
    declaredName,
    declaredDescription,
    registeredAgent,
    readValue,
    requiredSettings: requiredSettings ?? getRequiredCodexSettings(adapterBasename),
    configPath,
  });
  const developerInstructions = readCodexDeveloperInstructions(readValue);
  if (!developerInstructions) {
    issues.push(`${codexAdapterFile}: missing top-level developer_instructions string`);
    return { issues, templatePaths: [], canonicalPaths: [] };
  }
  const canonicalPaths = extractCanonicalPaths(developerInstructions);
  const templatePaths = canonicalPaths.filter((p) => p.startsWith(`${templateDir}/`));
  if (templatePaths.length === 0) {
    issues.push(
      `${codexAdapterFile}: developer_instructions must reference at least one canonical template inside ${templateDir}`,
    );
  }
  issues.push(...getCricketMethodContractIssues(adapterBasename, codexAdapterFile, templatePaths));
  return { issues, templatePaths, canonicalPaths };
}
