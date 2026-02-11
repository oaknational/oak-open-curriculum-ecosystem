/**
 * Types for ground truth validation.
 *
 * These are validation-specific types, NOT API response types.
 * API response types are defined via Zod schemas in api-checkers.ts.
 */

/** A slug with the queries that reference it. */
export interface SlugEntry {
  readonly slug: string;
  readonly queries: readonly string[];
}

/** Result of validating a single slug. */
export interface ValidationResult {
  readonly slug: string;
  readonly exists: boolean;
  readonly usedBy: readonly string[];
}

/** A category of ground truth to validate. */
export interface ValidationCategory {
  readonly name: string;
  readonly entries: readonly SlugEntry[];
  readonly checker: (slug: string, apiKey: string) => Promise<boolean>;
}
