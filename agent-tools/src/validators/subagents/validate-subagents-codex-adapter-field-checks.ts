/**
 * Field-level validation helpers for Codex adapter TOML files.
 *
 * Provides the lower-level checks that `getCodexAdapterValidation` composes:
 * - `stripBasename` — derives the agent name from the adapter file path.
 * - `validateRequiredSettings` — checks that each mandated TOML setting is
 *   present with its required value.
 * - `validateRegistrationSync` — cross-checks the adapter's declared fields
 *   against its corresponding entry in `.codex/config.toml`.
 * - `validateAdapterFields` — orchestrates the above to produce the full set
 *   of field-level issues for an adapter file.
 *
 * Developer-instructions validation is handled by the consuming module
 * `validate-subagents-codex-adapter-validation.ts`, which imports from here.
 */

import type { TopLevelTomlBasicStringReader } from '../../core/toml-top-level-basic-string.js';
import {
  type CodexRegistration,
  resolveCodexConfigFilePath,
} from './validate-subagents-codex-toml.js';

// ---------------------------------------------------------------------------
// Basename helper
// ---------------------------------------------------------------------------

/**
 * Returns the base filename of `filePath` with `extension` stripped.
 *
 * Strips the directory prefix first, then removes the extension suffix if
 * present.
 *
 * @param filePath - A POSIX-style file path (e.g. `.codex/agents/foo.toml`).
 * @param extension - The extension to strip (e.g. `".toml"`).
 * @returns The base filename without the extension (e.g. `"foo"`).
 */
export function stripBasename(filePath: string, extension: string): string {
  const lastSlash = filePath.lastIndexOf('/');
  const base = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
  return base.endsWith(extension) ? base.slice(0, -extension.length) : base;
}

// ---------------------------------------------------------------------------
// Required settings check
// ---------------------------------------------------------------------------

/**
 * Validates that each required TOML setting key in `requiredSettings` is
 * present in the parsed adapter with exactly the expected value.
 *
 * @param adapterFile - Repository-relative path to the adapter (for messages).
 * @param readValue - Reader for the adapter's parsed top-level string values.
 * @param requiredSettings - Pairs of `[settingKey, expectedValue]` to verify.
 * @returns Array of issue strings for any settings that are missing or wrong.
 */
function validateRequiredSettings(
  adapterFile: string,
  readValue: TopLevelTomlBasicStringReader,
  requiredSettings: readonly (readonly [string, string])[],
): string[] {
  const issues: string[] = [];
  for (const [settingKey, expectedValue] of requiredSettings) {
    const state = readValue.inspect(settingKey);
    if (state.kind !== 'string' || state.value !== expectedValue) {
      issues.push(
        `${adapterFile}: ${settingKey} must be "${expectedValue}" (found: ${formatSettingState(state)})`,
      );
    }
  }
  return issues;
}

function formatSettingState(state: ReturnType<TopLevelTomlBasicStringReader['inspect']>): string {
  if (state.kind === 'string') {
    return state.value;
  }
  return state.kind === 'missing' ? 'missing' : 'non-string';
}

function validateOptionalModelType(
  adapterFile: string,
  readValue: TopLevelTomlBasicStringReader,
  requiredSettings: readonly (readonly [string, string])[],
): string[] {
  if (requiredSettings.some(([settingKey]) => settingKey === 'model')) {
    return [];
  }
  if (readValue.inspect('model').kind !== 'non-string') {
    return [];
  }
  return [`${adapterFile}: model must be a TOML string when present (found: non-string)`];
}

// ---------------------------------------------------------------------------
// Registry cross-reference check
// ---------------------------------------------------------------------------

/**
 * Validates the cross-reference consistency between an adapter file and its
 * corresponding entry in `.codex/config.toml`.
 *
 * Checks:
 * - A registration exists for `adapterBasename`.
 * - The registration's resolved path matches `adapterFile`.
 * - The adapter's declared `name` (if present) matches the registration name.
 * - The adapter's declared `description` (if present) matches the
 *   registration description.
 *
 * @param adapterFile - Repository-relative path to the adapter TOML file.
 * @param adapterBasename - Filename without extension (used as the agent name
 *   and for registry lookup).
 * @param declaredName - The `name` value from the adapter TOML, or `null`.
 * @param declaredDescription - The `description` value from the adapter TOML,
 *   or `null`.
 * @param registeredAgent - The matching registry entry, or `null` if none.
 * @param configPath - Repository-relative path to the Codex config file.
 * @returns Array of cross-reference issue strings.
 */
function validateRegistrationSync(
  adapterFile: string,
  adapterBasename: string,
  declaredName: string | null,
  declaredDescription: string | null,
  registeredAgent: CodexRegistration | null,
  configPath: string,
): string[] {
  if (registeredAgent === null) {
    return [
      `${adapterFile}: no matching agent registration exists in .codex/config.toml for "${adapterBasename}"`,
    ];
  }
  const issues: string[] = [];
  const registeredPath = resolveCodexConfigFilePath(registeredAgent.configFile, configPath);
  if (registeredPath !== adapterFile) {
    issues.push(
      `${adapterFile}: .codex/config.toml resolves "${adapterBasename}" to ${registeredPath}, expected ${adapterFile}`,
    );
    return issues;
  }
  if (declaredName !== null && declaredName !== registeredAgent.name) {
    issues.push(
      `${adapterFile}: name "${declaredName}" must match .codex/config.toml registration "${registeredAgent.name}"`,
    );
  }
  if (declaredDescription !== null && declaredDescription !== registeredAgent.description) {
    issues.push(
      `${adapterFile}: description must match .codex/config.toml registration for "${registeredAgent.name}"`,
    );
  }
  return issues;
}

// ---------------------------------------------------------------------------
// Composite field validation
// ---------------------------------------------------------------------------

/**
 * Inputs for {@link validateAdapterFields}, bundled into a single object so
 * the field validator stays within the project parameter-count budget.
 */
export interface ValidateAdapterFieldsParams {
  /** Repository-relative path to the adapter TOML file. */
  adapterFile: string;
  /** Filename without extension (the expected agent name). */
  adapterBasename: string;
  /** The `name` value from the adapter TOML, or `null`. */
  declaredName: string | null;
  /** The `description` value from the adapter TOML, or `null`. */
  declaredDescription: string | null;
  /** The matching registry entry, or `null`. */
  registeredAgent: CodexRegistration | null;
  /** Reader for the adapter's parsed top-level string values. */
  readValue: TopLevelTomlBasicStringReader;
  /** Settings pairs to validate. */
  requiredSettings: readonly (readonly [string, string])[];
  /** Repository-relative path to the Codex config file. */
  configPath: string;
}

/**
 * Validates the top-level TOML fields (`name`, `description`, required
 * settings, and registry cross-reference) of a Codex adapter file.
 *
 * Composes {@link validateRequiredSettings} and
 * {@link validateRegistrationSync} into a single collected-issues array.
 * Developer-instructions validation is handled separately by the caller.
 *
 * @param params - The adapter fields to validate; see
 *   {@link ValidateAdapterFieldsParams}.
 * @returns Array of issue strings collected from all field checks.
 */
export function validateAdapterFields(params: ValidateAdapterFieldsParams): string[] {
  const {
    adapterFile,
    adapterBasename,
    declaredName,
    declaredDescription,
    registeredAgent,
    readValue,
    requiredSettings,
    configPath,
  } = params;
  const nameIssues: string[] = [];
  if (declaredName === null) {
    nameIssues.push(`${adapterFile}: missing required TOML key "name"`);
  } else if (declaredName !== adapterBasename) {
    nameIssues.push(
      `${adapterFile}: name must match filename "${adapterBasename}" (found: ${declaredName})`,
    );
  }
  return [
    ...nameIssues,
    ...(declaredDescription === null
      ? [`${adapterFile}: missing required TOML key "description"`]
      : []),
    ...validateOptionalModelType(adapterFile, readValue, requiredSettings),
    ...validateRegistrationSync(
      adapterFile,
      adapterBasename,
      declaredName,
      declaredDescription,
      registeredAgent,
      configPath,
    ),
    ...validateRequiredSettings(adapterFile, readValue, requiredSettings),
  ];
}
