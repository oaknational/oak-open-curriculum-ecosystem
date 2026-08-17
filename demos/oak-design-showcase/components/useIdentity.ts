/**
 * Binder for the identity (white-label) axis: which brand override sheet is
 * loaded over the kit's base. Applies the choice by managing one
 * `<link rel="stylesheet" data-oak-brand>` element (held by ref — the hook
 * owns its node, never whatever a selector happens to match) appended at
 * the END of `document.head`, so the brand sheet loads after every bundled
 * sheet and wins the cascade at equal specificity — the kit brand contract
 * (consuming-nextjs.md §5: "import it last"; brand.css: load it AFTER
 * styles.css). Both counter-brand sheets are cache-warmed on mount with
 * react-dom's preload, so a swap resolves from cache instead of paying a
 * network round trip mid-switch.
 *
 * React 19's own `<link precedence>` stylesheet hoisting was considered and
 * rejected on its documented semantics (react.dev/reference/react-dom/
 * components/link): "React may leave the link in the DOM even after the
 * component that rendered it has been unmounted", and precedence values
 * "discovered later are 'higher'" — so switching creature → pds
 * would leave creature's higher-ranked sheet winning; and the rendering
 * component suspends while the sheet loads. None of that fits a live
 * switcher.
 *
 * Showcase-only mechanism: production identity is server-emitted, one
 * static sheet per tenant, per the kit's consuming-nextjs.md §5 ("no flash,
 * no client logic"). A cookie + router.refresh() shape would match §5 from
 * a layout, at the cost of a server round trip and dynamic rendering per
 * switch — wrong trade for a live switchboard, so the demo swaps the link
 * client-side. Identity deliberately does NOT persist across reloads:
 * persistence would need a second pre-paint bootstrap to avoid a flash of
 * Oak brand (the exact problem oak-theme.js solves for themes).
 */

/**
 * The closed identity vocabulary — the single definition every consumer
 * imports (the fidelity pairing map, the specimen route, the side-by-side
 * page). A slug is load-bearing in `?brand=` URLs and in the served brand
 * directory name, so adding one means adding its sheet and a row in
 * lib/identities.ts too.
 */

export const IDENTITIES = ['oak', 'pds', 'creature'] as const;
export type IdentitySlug = (typeof IDENTITIES)[number];

/** The identity that carries no override sheet — the kit's own tokens. */
export const BASE_IDENTITY: IdentitySlug = 'oak';

/** Owner-facing identity labels. They live in THIS framework-free module —
 *  not the client switchboard — because server components consume them too:
 *  an export from a 'use client' module crosses the RSC boundary as a
 *  client reference and evaluates to undefined in a server render (the
 *  side-by-side page shipped headings and iframe titles reading
 *  "undefined" until this moved). */
export const IDENTITY_LABELS: Readonly<Record<IdentitySlug, string>> = {
  oak: 'Oak',
  pds: 'Public Digital Service',
  creature: 'EMC²',
};

/**
 * Narrow an untrusted value to a roster member, falling back to the base
 * identity. Pure and framework-free, so the server route reading a query
 * string and the client control reading a form value share one definition of
 * "is this an identity".
 */
export function resolveIdentity(raw: string | string[] | undefined): IdentitySlug {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  return IDENTITIES.find((slug) => slug === candidate) ?? BASE_IDENTITY;
}

export interface IdentityState {
  identity: IdentitySlug;
  identities: readonly IdentitySlug[];
  setIdentity: (value: string) => void;
}
