/**
 * @fileoverview Simple edge-compatible event bus
 * @module systems/events/event-bus
 *
 * While EventTarget is now available in Node.js 15+, we use a simple
 * implementation to avoid the complexities of wrapping handlers and
 * to maintain full compatibility with our EventBus interface.
 */

import type { EventBus } from '../../stroma/contracts/event-bus.js';

type Handler = (...args: unknown[]) => void;

/**
 * Simple event bus implementation
 */
export function createEventBus(): EventBus {
  const events = new Map<string, Set<Handler>>();

  return {
    emit(event: string, ...args: unknown[]): boolean {
      const handlers = events.get(event);
      if (!handlers || handlers.size === 0) return false;

      for (const handler of handlers) {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in handler for "${event}":`, error);
        }
      }
      return true;
    },

    on(event: string, handler: Handler): void {
      let handlers = events.get(event);
      if (!handlers) {
        handlers = new Set();
        events.set(event, handlers);
      }
      handlers.add(handler);
    },

    once(event: string, handler: Handler): void {
      const onceHandler: Handler = (...args) => {
        this.off(event, onceHandler);
        handler(...args);
      };
      this.on(event, onceHandler);
    },

    off(event: string, handler: Handler): void {
      events.get(event)?.delete(handler);
    },

    removeAllListeners(event?: string): void {
      if (event) {
        events.delete(event);
      } else {
        events.clear();
      }
    },
  };
}
