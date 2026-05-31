/**
 * Public API surface for subagent validation helpers.
 *
 * Re-exports everything that consumers import from this module path, keeping
 * their import paths stable while the underlying implementation is split
 * across focused sibling modules:
 *
 * - `validate-subagents-codex-toml` — TOML decoding, registration parsing,
 *   path resolution.
 * - `validate-subagents-codex-instructions` — `developer_instructions`
 *   extraction, canonical path extraction.
 * - `validate-subagents-codex-registration-validation` — registration
 *   validation logic and its I/O-shape interfaces.
 * - `validate-subagents-codex-adapter-validation` — adapter validation logic,
 *   its I/O-shape interfaces, and the `REQUIRED_CODEX_SETTINGS` constant.
 *
 * Adding a new helper: place it in the module whose responsibility it best
 * fits, then add a re-export here.
 */

export type { CodexRegistration } from './validate-subagents-codex-toml.js';

export {
  CODEX_CONFIG_PATH,
  readTomlBasicStringValue,
  parseCodexRegistrations,
  resolveCodexConfigFilePath,
} from './validate-subagents-codex-toml.js';

export {
  readCodexDeveloperInstructions,
  extractCanonicalPaths,
} from './validate-subagents-codex-instructions.js';

export { getCodexRegistrationValidation } from './validate-subagents-codex-registration-validation.js';

export { getCodexAdapterValidation } from './validate-subagents-codex-adapter-validation.js';
