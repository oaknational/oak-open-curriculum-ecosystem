/**
 * @fileoverview Node.js-specific context storage implementation
 * @module @oak-notion-mcp/context-storage
 *
 * This is the phenotype implementation that provides Node.js-specific
 * context storage using AsyncLocalStorage. This file contains runtime
 * dependencies and is only loaded in Node.js environments.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type {
  registerContextStorageFactory,
  ContextStorage,
  ErrorContext,
} from '@oaknational/mcp-core';

/**
 * Adapter for Node.js AsyncLocalStorage
 * Provides automatic context propagation across async boundaries
 */
export class AsyncLocalStorageAdapter<T> implements ContextStorage<T> {
  private readonly als: AsyncLocalStorage<T>;

  constructor() {
    this.als = new AsyncLocalStorage<T>();
  }

  run<R>(context: T, callback: () => R): R {
    return this.als.run(context, callback);
  }

  getStore(): T | undefined {
    return this.als.getStore();
  }
}

/**
 * Create a Node.js context storage instance
 * Uses AsyncLocalStorage for automatic async context propagation
 */
export function createNodeContextStorage<T>(): ContextStorage<T> {
  return new AsyncLocalStorageAdapter<T>();
}

/**
 * Initialize Node.js context storage factories
 * Call this during application startup to register Node.js implementations
 */
export function initializeNodeContextStorage(register: typeof registerContextStorageFactory): void {
  // Register the Node.js implementation as the default
  register('default', createNodeContextStorage);

  // Register specifically for error context
  register('error', () => createNodeContextStorage<ErrorContext>());
}
