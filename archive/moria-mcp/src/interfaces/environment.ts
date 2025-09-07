/**
 * @fileoverview EnvironmentProvider interface - pure abstraction for environment variables
 * @module moria/interfaces/environment
 *
 * Zero-dependency environment contract that can be implemented by any environment system.
 * This is a pure abstraction with no implementation details.
 */

/**
 * EnvironmentProvider interface - defines the contract for environment variable access
 *
 * This interface provides a minimal abstraction for accessing environment variables
 * that can be implemented differently across Node.js, Edge, Browser, or test environments.
 */
export interface EnvironmentProvider {
  /**
   * Get a single environment variable
   * @param key - The environment variable name
   * @returns The value or undefined if not set
   */
  get(key: string): string | undefined;

  /**
   * Get all environment variables
   * @returns An object containing all environment variables
   */
  getAll(): Record<string, string | undefined>;

  /**
   * Check if an environment variable exists (optional)
   * @param key - The environment variable name
   * @returns True if the variable exists, false otherwise
   */
  has(key: string): boolean;
}
