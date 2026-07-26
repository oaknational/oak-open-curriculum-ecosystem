/**
 * The page's references into the design system.
 *
 * @remarks
 * Two kinds of thing live here, and they are here for the same reason: each is
 * a value the page cannot express as a token at its point of use, so each is a
 * place the page could silently drift away from the system.
 *
 * `OAK_DS_BASE` is the URL prefix the build's asset copy publishes to
 * (`build-scripts/copy-oak-ds.ts`). Every `/oak-ds/…` URL in the rendered
 * markup is built from it, so the served page and the copy step cannot disagree
 * about where the design system lives.
 *
 * `OAK_MINT` is a raw colour, and the only one on the page. A `<meta>` element
 * takes no `var()`, so the hero band's fill has to appear literally in
 * `theme-color`. Its provenance is the design system's `colour.mint` DTCG
 * token, and a unit test holds the two equal — the literal is pinned, not
 * copied.
 *
 * @packageDocumentation
 */

/** Where `copy-oak-ds.ts` publishes the design system's runtime files. */
export const OAK_DS_BASE = '/oak-ds';

/**
 * `--oak-mint` as a literal, for the one attribute that cannot resolve a
 * custom property. Equality with `dtcg/palette.json` is test-enforced.
 */
export const OAK_MINT = '#bef2bd';

/** The name Oak is known by, for the share card's site attribution. */
export const OAK_SITE_NAME = 'Oak National Academy';

/**
 * The page's share-card image.
 *
 * @remarks
 * Square, so the card is a `summary` rather than a `summary_large_image`. That
 * is the whole reason it stays simple: a large card wants purpose-built
 * 1200×630 artwork, and a square logo already exists.
 *
 * Served from `@oaknational/oak-design-assets` via the build's copy step, not
 * vendored into this app. It used to sit in `public/` with no reference
 * anywhere in the repo, next to a source comment claiming the app vendored no
 * logo artwork.
 */
export const SHARE_IMAGE_PATH = '/oak-assets/assets/oak-national-academy-logo-512.png';

/** Edge length of {@link SHARE_IMAGE_PATH}, declared for the card. */
export const SHARE_IMAGE_SIZE = 512;
