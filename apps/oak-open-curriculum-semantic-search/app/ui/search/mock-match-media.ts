import { vi } from 'vitest';
import {
  createListenerCollections,
  registerLegacyMediaQueryListener,
  registerMediaQueryListener,
  unregisterLegacyMediaQueryListener,
  unregisterMediaQueryListener,
  type MediaQueryChangeListener,
  type MediaQueryListenerCollections,
} from './mock-match-media-registries';

/**
 * Media query change event used for dispatching notifications.
 */
class MatchMediaChangeEvent extends Event implements MediaQueryListEvent {
  readonly matches: boolean;
  readonly media: string;

  constructor(matches: boolean, media: string) {
    super('change');
    this.matches = matches;
    this.media = media;
  }
}

/**
 * Create an `addEventListener` implementation that registers change listeners.
 */
function createAddEventListener({
  collections,
}: {
  collections: MediaQueryListenerCollections;
}): MediaQueryList['addEventListener'] {
  return function addEventListener(
    this: MediaQueryList,
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) {
    if (type !== 'change') {
      return;
    }

    registerMediaQueryListener({
      listener,
      listenerMap: collections.listenerMap,
      listeners: collections.listeners,
      mediaQueryList: this,
    });
  };
}

/**
 * Create a `removeEventListener` implementation that unregisters change listeners.
 */
function createRemoveEventListener({
  collections,
}: {
  collections: MediaQueryListenerCollections;
}): MediaQueryList['removeEventListener'] {
  return function removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    if (type !== 'change') {
      return;
    }

    unregisterMediaQueryListener({
      listener,
      listenerMap: collections.listenerMap,
      listeners: collections.listeners,
    });
  };
}

/**
 * Create a legacy `addListener` implementation backed by the main listener set.
 */
function createAddLegacyListener({
  collections,
}: {
  collections: MediaQueryListenerCollections;
}): MediaQueryList['addListener'] {
  return function addListener(
    this: MediaQueryList,
    listener: (this: MediaQueryList, event: MediaQueryListEvent) => unknown,
  ) {
    const handler: MediaQueryChangeListener = (event) => {
      listener.call(this, event);
    };

    registerLegacyMediaQueryListener({
      key: listener,
      handler,
      legacyListenerMap: collections.legacyListenerMap,
      listeners: collections.listeners,
    });
  };
}

/**
 * Create a legacy `removeListener` implementation backed by the main listener set.
 */
function createRemoveLegacyListener({
  collections,
}: {
  collections: MediaQueryListenerCollections;
}): MediaQueryList['removeListener'] {
  return function removeListener(
    listener: (this: MediaQueryList, event: MediaQueryListEvent) => unknown,
  ) {
    unregisterLegacyMediaQueryListener({
      key: listener,
      legacyListenerMap: collections.legacyListenerMap,
      listeners: collections.listeners,
    });
  };
}

/**
 * Create a `dispatchEvent` implementation that broadcasts change notifications.
 */
function createDispatchEvent({
  collections,
  matches,
  query,
}: {
  collections: MediaQueryListenerCollections;
  matches: boolean;
  query: string;
}): MediaQueryList['dispatchEvent'] {
  return function dispatchEvent(this: MediaQueryList, event: Event) {
    if (event.type !== 'change') {
      return true;
    }

    const changeEvent =
      event instanceof MatchMediaChangeEvent ? event : new MatchMediaChangeEvent(matches, query);

    collections.listeners.forEach((listener) => listener(changeEvent));

    if (typeof this.onchange === 'function') {
      this.onchange.call(this, changeEvent);
    }

    return true;
  };
}

/**
 * Build a media query list for the supplied query string.
 */
function createMediaQueryList({
  matches,
  query,
}: {
  matches: boolean;
  query: string;
}): MediaQueryList {
  const collections = createListenerCollections();

  return {
    matches,
    media: query,
    onchange: null,
    addEventListener: createAddEventListener({ collections }),
    removeEventListener: createRemoveEventListener({ collections }),
    addListener: createAddLegacyListener({ collections }),
    removeListener: createRemoveLegacyListener({ collections }),
    dispatchEvent: createDispatchEvent({ collections, matches, query }),
  };
}

/**
 * Provide a deterministic mock `matchMedia` implementation for UI tests.
 */
export function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => createMediaQueryList({ matches, query })),
  });
}
