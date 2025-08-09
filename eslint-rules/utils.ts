/**
 * Utility functions for ESLint configuration
 */

import { HISTOI_TISSUES } from './boundary-rules.js';

/**
 * Get list of other Histoi tissues (excluding the current one)
 * @param currentTissue - The name of the current tissue
 * @returns Array of other tissue names
 */
export function getOtherTissues(currentTissue: string): string[] {
  return HISTOI_TISSUES.filter(tissue => tissue !== currentTissue);
}