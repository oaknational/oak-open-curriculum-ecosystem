/**
 * @fileoverview Event bus contract - hormonal system for inter-organ communication
 * @module substrate/contracts/event-bus
 */

/**
 * Edge-compatible event bus contract
 *
 * Like biological hormones, events carry untyped signals.
 * Receiving organs must validate/interpret the signals.
 *
 * Designed to work in all JavaScript environments:
 * - Node.js
 * - Cloudflare Workers
 * - Browsers
 * - Bun/Deno
 */
export interface EventBus {
  /**
   * Emit an event with arguments
   * @returns true if event had listeners, false otherwise
   */
  emit(event: string, ...args: unknown[]): boolean;

  /**
   * Add an event listener
   */
  on(event: string, handler: (...args: unknown[]) => void): void;

  /**
   * Add a one-time event listener
   */
  once(event: string, handler: (...args: unknown[]) => void): void;

  /**
   * Remove an event listener
   */
  off(event: string, handler: (...args: unknown[]) => void): void;

  /**
   * Remove all listeners for an event (or all events)
   */
  removeAllListeners(event?: string): void;
}
