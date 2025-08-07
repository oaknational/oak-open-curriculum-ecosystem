/**
 * @fileoverview Tests for EventBus interface
 * @module moria/interfaces/event-bus.test
 */

import { describe, it, expect, vi } from 'vitest';
import type { EventBus, EventHandler, EventUnsubscribe } from './event-bus';

describe('EventBus interface', () => {
  it('should define emit method for publishing events', () => {
    const mockEventBus: EventBus = {
      emit: (event: string, data?: unknown) => {
        // Mock implementation
      },
      on: (event: string, handler: EventHandler) => {
        return () => {}; // Return unsubscribe function
      },
      off: (event: string, handler: EventHandler) => {
        // Mock implementation
      },
      once: (event: string, handler: EventHandler) => {
        return () => {}; // Return unsubscribe function
      },
    };

    expect(mockEventBus.emit).toBeDefined();
    expect(typeof mockEventBus.emit).toBe('function');
  });

  it('should define on method for subscribing to events', () => {
    const mockEventBus: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {}; // Return unsubscribe function
      },
      off: (event: string, handler: EventHandler) => {},
      once: (event: string, handler: EventHandler) => {
        return () => {};
      },
    };

    expect(mockEventBus.on).toBeDefined();
    expect(typeof mockEventBus.on).toBe('function');

    const unsubscribe = mockEventBus.on('test', () => {});
    expect(typeof unsubscribe).toBe('function');
  });

  it('should define off method for unsubscribing from events', () => {
    const mockEventBus: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {};
      },
      off: (event: string, handler: EventHandler) => {
        // Mock implementation
      },
      once: (event: string, handler: EventHandler) => {
        return () => {};
      },
    };

    expect(mockEventBus.off).toBeDefined();
    expect(typeof mockEventBus.off).toBe('function');
  });

  it('should define once method for one-time subscriptions', () => {
    const mockEventBus: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {};
      },
      off: (event: string, handler: EventHandler) => {},
      once: (event: string, handler: EventHandler) => {
        return () => {}; // Return unsubscribe function
      },
    };

    expect(mockEventBus.once).toBeDefined();
    expect(typeof mockEventBus.once).toBe('function');

    const unsubscribe = mockEventBus.once('test', () => {});
    expect(typeof unsubscribe).toBe('function');
  });

  it('should support optional removeAllListeners method', () => {
    const mockEventBusWithRemoveAll: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {};
      },
      off: (event: string, handler: EventHandler) => {},
      once: (event: string, handler: EventHandler) => {
        return () => {};
      },
      removeAllListeners: (event?: string) => {
        // Mock implementation
      },
    };

    expect(mockEventBusWithRemoveAll.removeAllListeners).toBeDefined();
    expect(typeof mockEventBusWithRemoveAll.removeAllListeners).toBe('function');
  });

  it('should support optional listenerCount method', () => {
    const mockEventBusWithCount: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {};
      },
      off: (event: string, handler: EventHandler) => {},
      once: (event: string, handler: EventHandler) => {
        return () => {};
      },
      listenerCount: (event: string) => {
        return 0;
      },
    };

    expect(mockEventBusWithCount.listenerCount).toBeDefined();
    expect(typeof mockEventBusWithCount.listenerCount).toBe('function');
    expect(mockEventBusWithCount.listenerCount!('test')).toBe(0);
  });

  it('should support typed event handlers', () => {
    interface MyEventData {
      id: string;
      value: number;
    }

    const handler: EventHandler<MyEventData> = (data) => {
      // TypeScript should know data is MyEventData | undefined
      if (data) {
        expect(data.id).toBeDefined();
        expect(data.value).toBeDefined();
      }
    };

    const mockEventBus: EventBus = {
      emit: (event: string, data?: unknown) => {},
      on: (event: string, handler: EventHandler) => {
        return () => {};
      },
      off: (event: string, handler: EventHandler) => {},
      once: (event: string, handler: EventHandler) => {
        return () => {};
      },
    };

    const unsubscribe = mockEventBus.on('typed-event', handler);
    expect(typeof unsubscribe).toBe('function');
  });
});
