/**
 * The token reference's READ CAUSES — everything that can change what a
 * token resolves to in the live document: stylesheet arrivals (load),
 * link mutations (add/disable/re-point), theme and motion attributes,
 * and the two OS preferences the kit computes tokens from
 * (prefers-color-scheme; prefers-reduced-motion collapses the motion
 * tokens at token level). Split from the store at the causes/values
 * seam; `observe` returns a teardown that releases every listener,
 * including load listeners that never fired.
 */
/** Narrowed by node name rather than by `instanceof`, so a document from
 *  another realm still narrows correctly. */
function isLinkElement(node: Node): node is HTMLLinkElement {
  return node.nodeName === 'LINK';
}

/**
 * A stylesheet link, whether or not it looks loaded.
 *
 * The readiness is deliberately NOT tested. `link.sheet` is non-null the
 * instant the element is appended — measured in Chromium, where the object
 * exists roughly 135ms before the `load` that actually puts the rules in the
 * cascade — so treating a non-null `sheet` as "already applied" skips the
 * listener on exactly the sheet that is about to change everything. A `load`
 * listener on a genuinely-loaded link simply never fires, and `once` clears
 * it either way, so attaching unconditionally costs nothing and cannot be
 * wrong.
 */
function stylesheetLink(node: Node): HTMLLinkElement | null {
  return isLinkElement(node) && node.rel === 'stylesheet' ? node : null;
}

/** Load listeners with a teardown that reaches the never-fired ones:
 *  `once` clears a listener only after it fires, and a listener on an
 *  already-loaded persistent stylesheet never fires — untracked, each
 *  visit would accumulate one more closure per layout sheet, and the
 *  store's teardown would not be one. */
function linkLoadTracker(onCause: () => void): {
  readonly listen: (link: Element) => void;
  readonly removeAll: () => void;
} {
  const listened = new Set<Element>();
  return {
    listen: (link) => {
      listened.add(link);
      link.addEventListener('load', onCause, { once: true });
    },
    removeAll: () => {
      for (const link of listened) {
        link.removeEventListener('load', onCause);
      }
      listened.clear();
    },
  };
}

/** Stylesheet arrivals and mutations. Existing links first:
 *  server-rendered stylesheet links (which React places in the BODY
 *  unless given a `precedence` prop) already exist when the subscription
 *  starts, and hydration can win their load race — an immediate read
 *  would record unbound or outgoing used values with no later event to
 *  correct them; a `load` listener on a genuinely-loaded link simply
 *  never fires (see stylesheetLink above), so listening to every current
 *  link is safe — tracked, so the teardown reaches it. The observer is
 *  document-wide, not head-only, for the same body-placement reason; the
 *  attribute legs catch the binder retiring an adopted sheet in place
 *  (disabled) and any href re-point. The mutation says a sheet was ASKED
 *  for; the load says it arrived — without the added-node listener the
 *  read chases an identity not yet in the cascade, and the page shows
 *  re-painted swatches beside stale numbers. */
function watchStylesheetLinks(
  document: Document,
  cause: () => void,
  listen: (link: Element) => void,
): () => void {
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    listen(link);
  }
  const linkObserver = new MutationObserver((records) => {
    cause();
    for (const record of records) {
      for (const node of record.addedNodes) {
        const link = stylesheetLink(node);
        if (link !== null) {
          listen(link);
        }
      }
    }
  });
  linkObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'href', 'data-theme', 'data-motion'],
  });
  return () => {
    linkObserver.disconnect();
  };
}

/** Media-query read causes: the two OS preferences the kit computes
 *  tokens from — colour scheme, and reduced motion (which collapses the
 *  motion tokens at token level, so a flip repaints via CSS while the
 *  printed durations would otherwise go stale). */
function observePreferences(document: Document, onCause: () => void): () => void {
  const scheme = document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
  scheme?.addEventListener('change', onCause);
  const motion = document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');
  motion?.addEventListener('change', onCause);
  return () => {
    scheme?.removeEventListener('change', onCause);
    motion?.removeEventListener('change', onCause);
  };
}

/** Watch everything that can change what a token resolves to, and report
 *  each occurrence to `onCause`. Returns the teardown; nothing here polls. */
export function observe(document: Document, onCause: () => void): () => void {
  // Each observe call gets its OWN callback identity: subscribers share
  // the store's scheduler callback, and the DOM deduplicates identical
  // (type, callback, capture) registrations — with the shared identity,
  // one subscriber's teardown would remove the registration every other
  // subscriber depends on.
  const cause = (): void => {
    onCause();
  };
  const loadTracker = linkLoadTracker(cause);

  const stopLinks = watchStylesheetLinks(document, cause, loadTracker.listen);
  const stopPreferences = observePreferences(document, cause);

  return () => {
    stopLinks();
    stopPreferences();
    loadTracker.removeAll();
  };
}
