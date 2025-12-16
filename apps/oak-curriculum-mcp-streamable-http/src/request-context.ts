/**
 * Request context propagation using AsyncLocalStorage.
 * Enables access to Express request object within tool handlers.
 * @packageDocumentation
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request } from 'express';

const requestStorage = new AsyncLocalStorage<Request>();

/**
 * Execute callback within request context.
 * Makes request available to getRequestContext() within callback.
 *
 * @param req - Express request to store in context
 * @param callback - Async function to execute with request context
 * @returns Result of callback execution
 */
export async function setRequestContext<T>(req: Request, callback: () => Promise<T>): Promise<T> {
  return requestStorage.run(req, callback);
}

/**
 * Retrieve current Express request from async context.
 * Returns undefined if called outside setRequestContext.
 *
 * @returns Current request or undefined
 */
export function getRequestContext(): Request | undefined {
  return requestStorage.getStore();
}
