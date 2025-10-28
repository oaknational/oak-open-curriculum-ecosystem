/**
 * Basic listener signature for media query change notifications.
 */
export type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;

/**
 * Collections used to track registered listeners.
 */
export interface MediaQueryListenerCollections {
  readonly listeners: Set<MediaQueryChangeListener>;
  readonly listenerMap: Map<EventListenerOrEventListenerObject, MediaQueryChangeListener>;
  readonly legacyListenerMap: Map<unknown, MediaQueryChangeListener>;
}

/**
 * Determine whether the provided listener is a function listener.
 */
function isEventListenerFunction(
  listener: EventListenerOrEventListenerObject,
): listener is EventListener {
  return typeof listener === 'function';
}

/**
 * Determine whether the provided listener exposes a `handleEvent` method.
 */
function isEventListenerObject(
  listener: EventListenerOrEventListenerObject,
): listener is EventListenerObject {
  return typeof listener === 'object' && listener !== null && 'handleEvent' in listener;
}

/**
 * Create a normalised change event handler for the supplied listener.
 */
function createMediaQueryChangeHandler({
  listener,
  mediaQueryList,
}: {
  listener: EventListenerOrEventListenerObject;
  mediaQueryList: MediaQueryList;
}): MediaQueryChangeListener | undefined {
  if (isEventListenerFunction(listener)) {
    return (event) => {
      listener.call(mediaQueryList, event);
    };
  }

  if (isEventListenerObject(listener) && typeof listener.handleEvent === 'function') {
    return (event) => {
      listener.handleEvent.call(listener, event);
    };
  }

  return undefined;
}

/**
 * Register the supplied listener once against the provided collections.
 */
export function registerMediaQueryListener({
  listener,
  listenerMap,
  listeners,
  mediaQueryList,
}: {
  listener: EventListenerOrEventListenerObject;
  listenerMap: Map<EventListenerOrEventListenerObject, MediaQueryChangeListener>;
  listeners: Set<MediaQueryChangeListener>;
  mediaQueryList: MediaQueryList;
}): void {
  if (listenerMap.has(listener)) {
    return;
  }

  const handler = createMediaQueryChangeHandler({ listener, mediaQueryList });
  if (!handler) {
    return;
  }

  listenerMap.set(listener, handler);
  listeners.add(handler);
}

/**
 * Remove a previously registered listener when present.
 */
export function unregisterMediaQueryListener({
  listener,
  listenerMap,
  listeners,
}: {
  listener: EventListenerOrEventListenerObject;
  listenerMap: Map<EventListenerOrEventListenerObject, MediaQueryChangeListener>;
  listeners: Set<MediaQueryChangeListener>;
}): void {
  const handler = listenerMap.get(listener);
  if (!handler) {
    return;
  }

  listenerMap.delete(listener);
  listeners.delete(handler);
}

/**
 * Register a legacy listener that uses the deprecated `addListener` API.
 */
export function registerLegacyMediaQueryListener({
  key,
  handler,
  legacyListenerMap,
  listeners,
}: {
  key: unknown;
  handler: MediaQueryChangeListener;
  legacyListenerMap: Map<unknown, MediaQueryChangeListener>;
  listeners: Set<MediaQueryChangeListener>;
}): void {
  if (legacyListenerMap.has(key)) {
    return;
  }

  legacyListenerMap.set(key, handler);
  listeners.add(handler);
}

/**
 * Remove a previously registered legacy listener when present.
 */
export function unregisterLegacyMediaQueryListener({
  key,
  legacyListenerMap,
  listeners,
}: {
  key: unknown;
  legacyListenerMap: Map<unknown, MediaQueryChangeListener>;
  listeners: Set<MediaQueryChangeListener>;
}): void {
  const handler = legacyListenerMap.get(key);
  if (!handler) {
    return;
  }

  legacyListenerMap.delete(key);
  listeners.delete(handler);
}

/**
 * Create the data-structures used to hold listener registrations.
 */
export function createListenerCollections(): MediaQueryListenerCollections {
  return {
    listeners: new Set<MediaQueryChangeListener>(),
    listenerMap: new Map<EventListenerOrEventListenerObject, MediaQueryChangeListener>(),
    legacyListenerMap: new Map<unknown, MediaQueryChangeListener>(),
  };
}
