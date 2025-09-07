/**
 * Utility functions for ESLint configuration
 */

import { LIB_PACKAGES } from './boundary-rules.js';

/**
 * Get list of other libraries (excluding the current one)
 * @param currentLib - The name of the current library
 * @returns Array of other library names
 */
export function getOtherTissues(currentLib: string): string[] {
  return LIB_PACKAGES.filter((lib) => lib !== currentLib);
}
