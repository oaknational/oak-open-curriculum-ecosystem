/**
 * @deprecated This file is deprecated. Import directly from semantic modules:
 * - json-sanitisation: sanitiseForJson, isJsonValue, sanitiseObject
 * - log-level-conversion: convertLogLevel, toConsolaLevel
 * - context-merging: mergeLogContext
 * - error-normalisation: normalizeError
 *
 * Pure functions extracted from ConsolaLogger for testability
 * This file now re-exports from semantic modules for backward compatibility.
 */

// Re-export from semantic modules with old names for backward compatibility
export {
  sanitiseForJson as toAttachableValue,
  sanitiseObject as toJsonSafeObject,
} from './json-sanitisation';
export { convertLogLevel, toConsolaLevel } from './log-level-conversion';
export { mergeLogContext } from './context-merging';
export { normalizeError } from './error-normalisation';

/**
 * Checks if a log level is enabled
 */
export function isLevelEnabled(currentLevel: number, checkLevel: number): boolean {
  return currentLevel >= checkLevel;
}
