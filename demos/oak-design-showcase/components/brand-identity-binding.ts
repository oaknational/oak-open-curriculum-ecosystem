'use client';

/**
 * The client half of the identity axis: the live brand-sheet binder.
 *
 * Split from `useIdentity.ts` when the specimen route became the first
 * SERVER-side consumer of the roster. That module imported React hooks at
 * module scope, which put the whole module in the client graph, so a server
 * component could not read the identity list without the build refusing it.
 *
 * The HOOK moved and the ROSTER stayed. Moving the framework-DEPENDENT half
 * is the cheap direction and remains the right call: it leaves the
 * identity-naming census untouched, because no slug declaration changes file.
 *
 * CORRECTION (2026-08-10) to this docblock's earlier reasoning, which claimed
 * the other direction was FORBIDDEN — that relocating the slug declarations
 * would necessarily be a ratchet event during a live rename. That was wrong,
 * and it was wrong in a way worth naming here rather than quietly deleting.
 * The ratchet refused ONE new path invented for the purpose; the refusal was
 * about that instance, not about the pattern. A tracked `lib/identities.ts`
 * already exists and is already carried by the census, so a move into it was
 * available the whole time. Reading a gate's refusal as a prohibition on the
 * category is the error; the cure is to test the specific move rather than
 * reason about what the gate will allow.
 *
 * `useIdentity.ts` therefore keeps its name while holding constants — now a
 * deferred consolidation rather than a forced one, and the identity-vocabulary
 * slice is where the move gets attempted and the census left to answer.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';

import { BASE_IDENTITY, IDENTITIES, type IdentitySlug, type IdentityState } from './useIdentity';

interface BrandLinkOwnership {
  /** Every link the hook has created and not yet removed — the hook owns
   *  its nodes; nothing here addresses head elements by selector. */
  readonly owned: Set<HTMLLinkElement>;
  readonly applied: { current: HTMLLinkElement | null };
  readonly generation: { current: number };
}

/** LOAD-THEN-SWAP: the incoming sheet is appended ALONGSIDE the outgoing
 *  one and the swap completes only when it has loaded — a first-hand frame
 *  sampler proved that an in-place href update drops the outgoing sheet a
 *  frame before the incoming one joins the cascade, flashing the Oak base
 *  between two counter-brands. Both sheets coexisting is safe: the
 *  incoming link is later in head, so it wins the cascade the moment it
 *  applies. The generation counter keeps a fast second switch from letting
 *  a stale load win. */
function applyBrandIdentity(
  identity: IdentitySlug,
  ownership: BrandLinkOwnership,
  target: Document,
): void {
  const thisGeneration = (ownership.generation.current += 1);
  const previous = ownership.applied.current;
  if (identity === BASE_IDENTITY) {
    if (previous !== null) {
      previous.remove();
      ownership.owned.delete(previous);
      ownership.applied.current = null;
    }
    return;
  }
  // The node must be created BY the target document: a link minted from the
  // host and adopted into a frame is a cross-document node, and the frame is
  // the second consumer this function was parameterised for.
  const link = target.createElement('link');
  link.rel = 'stylesheet';
  link.dataset['oakBrand'] = identity;
  link.href = `/brands/${identity}/brand.css`;
  link.addEventListener('load', () => {
    if (ownership.generation.current !== thisGeneration) {
      link.remove();
      ownership.owned.delete(link);
      return;
    }
    previous?.remove();
    if (previous !== null) {
      ownership.owned.delete(previous);
    }
    ownership.applied.current = link;
  });
  link.addEventListener('error', () => {
    // Failed load: keep the previous brand applied rather than flashing to
    // a half state (the served sheets are validator-guaranteed in-repo;
    // the select-vs-page mismatch on a live 404 is a recorded follow-up on
    // MCP-371).
    link.remove();
    ownership.owned.delete(link);
  });
  ownership.owned.add(link);
  target.head.append(link);
}

/**
 * `resolveTarget` names WHICH document the brand sheet is bound into.
 *
 * Omitted, it is the host document — the showcase page re-skinning itself.
 * Supplied, it is typically a framed specimen's `contentDocument`, which is
 * what makes the picker's transition an IN-PLACE re-skin: the frame is never
 * re-navigated, so nothing reloads, and the swap is the whole demonstration.
 * It returns `null` while the frame is still loading; the effect simply waits
 * for a render in which it does not.
 */
function useBrandSheet(identity: IdentitySlug, resolveTarget?: () => Document | null): void {
  const ownedLinks = useRef<Set<HTMLLinkElement>>(new Set());
  const appliedLink = useRef<HTMLLinkElement | null>(null);
  const generation = useRef(0);

  // Preload warms the HTTP cache from the host regardless of target, so a
  // framed swap still gets the load-then-swap path's fast completion.
  useEffect(() => {
    for (const slug of IDENTITIES) {
      if (slug !== BASE_IDENTITY) {
        preload(`/brands/${slug}/brand.css`, { as: 'style' });
      }
    }
  }, []);

  useEffect(() => {
    const target = resolveTarget === undefined ? document : resolveTarget();
    if (target === null) {
      return;
    }
    applyBrandIdentity(
      identity,
      { owned: ownedLinks.current, applied: appliedLink, generation },
      target,
    );
  }, [identity, resolveTarget]);

  // Unmount-only removal, deliberately separate from the [identity] effect:
  // a per-change cleanup would run between two brands and defeat the
  // load-then-swap above.
  useEffect(() => {
    const owned = ownedLinks.current;
    return () => {
      for (const link of owned) {
        link.remove();
      }
      owned.clear();
      appliedLink.current = null;
    };
  }, []);
}

export function useIdentity(resolveTarget?: () => Document | null): IdentityState {
  const [identity, setIdentity] = useState<IdentitySlug>(BASE_IDENTITY);

  useBrandSheet(identity, resolveTarget);

  // The public setter narrows the select's string through the closed slug
  // list before touching state; the raw useState setter stays value-paired
  // (identity/setIdentity) per the hooks naming convention.
  const chooseIdentity = useCallback((value: string): void => {
    const next = IDENTITIES.find((slug) => slug === value);
    if (next !== undefined) {
      setIdentity(next);
    }
  }, []);

  return { identity, identities: IDENTITIES, setIdentity: chooseIdentity };
}
