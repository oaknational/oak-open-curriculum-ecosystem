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
  CODEX_CONFIG_PATH,
  type CodexRegistration,
  readTomlBasicStringValue,
} from './validate-subagents-codex-toml.js';

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
// Public constants
// ---------------------------------------------------------------------------

/**
 * The required TOML settings for every Codex subagent adapter file.
 *
 * Each entry is a `[key, expectedValue]` pair.  An adapter file must declare
 * all of these keys with exactly these values to be considered valid.
 */
const REQUIRED_CODEX_SETTINGS: readonly (readonly [string, string])[] = [
  ['model_reasoning_effort', 'high'],
  ['sandbox_mode', 'read-only'],
  ['approval_policy', 'never'],
];

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
   * Defaults to {@link REQUIRED_CODEX_SETTINGS}.
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
 * - Required TOML keys `name` and `description` are present.
 * - The `name` value matches the adapter's filename (without `.toml`).
 * - A matching entry exists in `.codex/config.toml`, and both `name` and
 *   `description` are consistent with that registration.
 * - All required settings (e.g. `model_reasoning_effort`, `sandbox_mode`,
 *   `approval_policy`) are set to their mandated values.
 * - A `developer_instructions` triple-quoted block is present.
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
  requiredSettings = REQUIRED_CODEX_SETTINGS,
  configPath = CODEX_CONFIG_PATH,
}: CodexAdapterValidationInput): CodexAdapterValidationResult {
  const adapterBasename = stripBasename(codexAdapterFile, '.toml');
  const declaredName = readTomlBasicStringValue(content, 'name');
  const declaredDescription = readTomlBasicStringValue(content, 'description');
  const issues: string[] = validateAdapterFields(
    codexAdapterFile,
    adapterBasename,
    declaredName,
    declaredDescription,
    registeredAgent,
    content,
    requiredSettings,
    configPath,
  );
  const developerInstructions = readCodexDeveloperInstructions(content);
  if (!developerInstructions) {
    issues.push(`${codexAdapterFile}: missing triple-quoted developer_instructions block`);
    return { issues, templatePaths: [], canonicalPaths: [] };
  }
  const canonicalPaths = extractCanonicalPaths(developerInstructions);
  const templatePaths = canonicalPaths.filter((p) => p.startsWith(`${templateDir}/`));
  if (templatePaths.length === 0) {
    issues.push(
      `${codexAdapterFile}: developer_instructions must reference at least one canonical template inside ${templateDir}`,
    );
  }
  return { issues, templatePaths, canonicalPaths };
}
