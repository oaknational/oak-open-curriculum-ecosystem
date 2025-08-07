/**
 * @fileoverview EventBus interface - pure abstraction for event-driven communication
 * @module moria/interfaces/event-bus
 *
 * Zero-dependency event bus contract that can be implemented by any event system.
 * This is a pure abstraction with no implementation details.
 */

/**
 * Handler function for events
 * @template T The type of data the event carries
 */
export type EventHandler<T = unknown> = (data?: T) => void;

/**
 * Function to unsubscribe from an event
 */
export type EventUnsubscribe = () => void;

/**
 * EventBus interface - defines the contract for all event bus implementations
 *
 * This interface provides a minimal pub/sub pattern abstraction that can be
 * implemented by EventEmitter, EventTarget, or any custom event system.
 */
export interface EventBus {
  /**
   * Emit an event with optional data
   * @param event - The event name
   * @param data - Optional data to pass to handlers
   */
  emit(event: string, data?: unknown): void;

  /**
   * Subscribe to an event
   * @param event - The event name
   * @param handler - The handler function to call when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on(event: string, handler: EventHandler): EventUnsubscribe;

  /**
   * Unsubscribe from an event
   * @param event - The event name
   * @param handler - The handler function to remove
   */
  off(event: string, handler: EventHandler): void;

  /**
   * Subscribe to an event for one emission only
   * @param event - The event name
   * @param handler - The handler function to call once
   * @returns A function to unsubscribe from the event
   */
  once(event: string, handler: EventHandler): EventUnsubscribe;

  /**
   * Remove all listeners for a specific event or all events (optional)
   * @param event - The event name, or undefined to remove all listeners
   */
  removeAllListeners?(event?: string): void;

  /**
   * Get the number of listeners for an event (optional)
   * @param event - The event name
   * @returns The number of listeners
   */
  listenerCount?(event: string): number;

  /**
   * Get all event names that have listeners (optional)
   * @returns Array of event names
   */
  eventNames?(): string[];

  /**
   * Set the maximum number of listeners (optional)
   * @param max - The maximum number of listeners
   */
  setMaxListeners?(max: number): void;

  /**
   * Get the maximum number of listeners (optional)
   * @returns The maximum number of listeners
   */
  getMaxListeners?(): number;
}
