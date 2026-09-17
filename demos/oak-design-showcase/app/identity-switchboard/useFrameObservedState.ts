'use client';

/**
 * The parent OBSERVES the frame instead of driving it (owner word
 * 2026-08-18: the embedded page owns its controls; the parent chrome is
 * width only). The specimen's strip switches identity and theme inside
 * the frame's own document; this hook watches that document — the brand
 * link set in <head> and the data-theme attribute on <html> — so the
 * parent's status line, blurb and full-page link stay truthful without
 * owning any of the state. One direction of data flow, the frame is the
 * single source of truth.
 *
 * The identity read takes the LAST link carrying the binder's APPLIED
 * marker (data-oak-brand-applied): the binder stamps it only at swap
 * completion, so a sheet that has merely been requested — DOM order is
 * not cascade state, and a link's .sheet object exists before its rules
 * apply — never reports early. Absence of any applied link means the
 * base identity (which loads no brand sheet).
 */
import { useCallback, useRef, useSyncExternalStore } from 'react';

import { BASE_IDENTITY, resolveIdentity, type IdentitySlug } from '../../components/useIdentity';

export interface FrameObservedState {
  readonly identity: IdentitySlug;
  readonly theme: string | null;
}

function readFrameState(target: Document): FrameObservedState {
  // Document-wide: the server-rendered marker link sits in the body (React
  // hoists stylesheets only under a `precedence` prop) while hook-created
  // ones land in head. Disabled links are retired sheets; links without
  // the applied marker are in-flight requests — neither is the identity.
  const links = [
    ...target.querySelectorAll<HTMLLinkElement>('link[data-oak-brand][data-oak-brand-applied]'),
  ].filter((link) => !link.disabled);
  const last = links.at(-1);
  const identity =
    last?.dataset['oakBrand'] === undefined
      ? BASE_IDENTITY
      : resolveIdentity(last.dataset['oakBrand']);
  const theme = target.documentElement.dataset['theme'] ?? null;
  return { identity, theme };
}

const AT_MOUNT: FrameObservedState = { identity: BASE_IDENTITY, theme: null };

export function useFrameObservedState(resolveTarget: () => Document | null): FrameObservedState {
  // External-store shape (never effect-setState): the observer refreshes a
  // referentially-stable cache and notifies; the snapshot IS the cache.
  // resolveTarget's identity changes when the frame becomes reachable,
  // which re-creates subscribe and resubscribes onto the live document.
  const cache = useRef<FrameObservedState>(AT_MOUNT);
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const target = resolveTarget();
      if (target === null) {
        return () => undefined;
      }
      const refresh = (): void => {
        const next = readFrameState(target);
        if (next.identity !== cache.current.identity || next.theme !== cache.current.theme) {
          cache.current = next;
          onStoreChange();
        }
      };
      refresh();
      // One subtree observation covers all three signals: link add/remove
      // (childList), the binder's swap-completion marker and adopted-sheet
      // retirement (data-oak-brand-applied / disabled — attribute writes,
      // invisible to childList), and the root's theme attribute.
      const observer = new MutationObserver(refresh);
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-oak-brand-applied', 'disabled', 'data-theme'],
      });
      return () => {
        observer.disconnect();
      };
    },
    [resolveTarget],
  );

  return useSyncExternalStore(
    subscribe,
    () => cache.current,
    () => AT_MOUNT,
  );
}
