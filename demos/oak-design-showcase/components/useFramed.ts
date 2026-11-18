'use client';

/**
 * Whether this document renders inside a frame — the ownership fact the
 * showcase's stages key on: a FRAMED document's presentation is driven by
 * its parent stage, while a standalone visit owns itself. A stable
 * client-only fact, read as an external store (never an effect setState)
 * so the server snapshot stays honest and the client render cascade-free.
 */
import { useSyncExternalStore } from 'react';

/** The unsubscribe `subscribeNever` hands back: nothing was wired, so nothing is torn down. */
const unsubscribeNothing = (): void => undefined;

/** The framed fact never changes after load, so no subscriber is ever notified. */
const subscribeNever = (): (() => void) => unsubscribeNothing;

export function useFramed(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => globalThis.self !== globalThis.top,
    () => false,
  );
}
