/**
 * Error type generation for SDK fetch operations.
 *
 * Generates typed error definitions following ADR-088: Result Pattern.
 * These types encode failure modes in the type system for compile-time safety.
 *
 * @see {@link ../../../../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md}
 */

export { generateSdkErrorTypes } from './generate-error-types';
