/**
 * Logging exports for oak-notion-mcp application
 *
 * This contains runtime-specific implementations
 * that extend the genotype's abstract patterns.
 */

// Data scrubbing utilities (required for PII protection)
export { scrubEmail, scrubSensitiveData } from './scrubbing';
