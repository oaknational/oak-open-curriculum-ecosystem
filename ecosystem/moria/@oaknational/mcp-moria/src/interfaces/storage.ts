/**
 * @fileoverview StorageProvider interface - pure abstraction for storage operations
 * @module moria/interfaces/storage
 *
 * Zero-dependency storage contract that can be implemented by any storage system.
 * This is a pure abstraction with no implementation details.
 */

/**
 * StorageProvider interface - defines the contract for all storage implementations
 *
 * This interface provides a minimal key-value storage abstraction that can be
 * implemented by file systems, databases, in-memory stores, or any other
 * storage mechanism.
 */
export interface StorageProvider {
  /**
   * Retrieve a value by key
   * @param key - The key to look up
   * @returns The stored value or undefined if not found
   */
  get(key: string): Promise<string | undefined>;

  /**
   * Store a value with a key
   * @param key - The key to store under
   * @param value - The value to store
   */
  set(key: string, value: string): Promise<void>;

  /**
   * Delete a value by key
   * @param key - The key to delete
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a key exists
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  has(key: string): Promise<boolean>;

  /**
   * Clear all stored values (optional)
   * Not all storage providers may support this operation
   */
  clear?(): Promise<void>;

  /**
   * Get all keys (optional)
   * Not all storage providers may support this operation
   * @returns Array of all keys in storage
   */
  keys?(): Promise<string[]>;

  /**
   * Get the number of items in storage (optional)
   * Not all storage providers may support this operation
   * @returns The count of items
   */
  size?(): Promise<number>;
}
