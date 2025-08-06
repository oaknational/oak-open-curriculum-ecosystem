/**
 * @fileoverview ConfigProvider contract - cell membrane for configuration system
 * @module substrate/contracts/config
 *
 * This interface defines the boundary for all configuration access.
 * It controls how components retrieve configuration values.
 * Zero dependencies - pure contract.
 */

/**
 * ConfigProvider interface - the cell membrane for configuration
 * All configuration implementations must honor this contract
 */
export interface ConfigProvider {
  /**
   * Get a configuration value by key
   * @param key - The configuration key
   * @param defaultValue - Default value if key not found
   * @returns The configuration value
   */
  get<T = unknown>(key: string, defaultValue?: T): T;

  /**
   * Check if a configuration key exists
   * @param key - The configuration key to check
   * @returns True if the key exists
   */
  has(key: string): boolean;

  /**
   * Get all configuration keys
   * @returns Array of configuration keys
   */
  keys?(): string[];

  /**
   * Get all configuration as an object
   * @returns Configuration object
   */
  toObject?(): Record<string, unknown>;
}
