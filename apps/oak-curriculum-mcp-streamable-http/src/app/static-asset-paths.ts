/**
 * Served-path layout of the build-time asset copies.
 *
 * @remarks
 * Runtime-neutral by design: both the deployed server (`static-content.ts`)
 * and the build-time copier (`build-scripts/copy-oak-ds.ts`) need these
 * names, and the server must not import a build script onto the deploy
 * bundle's graph — the shared constants live here, on the `src/` side of
 * that boundary, and the build script imports downward from it.
 */
import { MCP_RESOURCE_PATH } from '../served-origin.js';

/**
 * URL prefix every first-party asset reference sits beneath.
 *
 * @remarks
 * MCP-509. The canonical deployment reaches this app through a Cloudflare
 * origin rule scoped to `/mcp` and `/mcp/*`; a root-relative asset request
 * never arrives here at all, it stays on the main website and gets that
 * site's 404 HTML. So the page's own references must live inside the routed
 * surface, and the static mount must answer there.
 *
 * **Derived, not a fourth copy of `'/mcp'`.** The edge rule is scoped to the
 * path this app publishes as its MCP resource, so that path — not a literal
 * spelled here — is what the asset base has to equal. Deriving it means a
 * change to the resource path moves the assets with it, and cannot leave the
 * markup pointing somewhere the edge does not forward. Spelling it again
 * would rebuild the MCP-509 defect in miniature: every consumer and every
 * test composes from this constant, so an independent literal here could
 * drift to a value the edge never routes while the whole suite stayed green.
 * `MCP_RESOURCE_PATH` is itself pinned to a literal by the published
 * protected-resource metadata (`auth-routes.integration.test.ts`).
 *
 * Widening the Cloudflare rule instead — claiming root-level `/oak-ds/*` or
 * `/favicons/*` on `www` — would put this app in the main website's
 * namespace, a collision review nobody has done. Staying inside the existing
 * contained route needs no edge change at all.
 *
 * Assets survive the shared prefix because the static mount is registered
 * BEFORE the `/mcp` accept-header gate (see `application.ts` ordering): a
 * browser sends `Accept: text/css` with no `text/event-stream`, which that
 * gate answers with a 406. `express.static` calls `next()` on a miss, so
 * `POST /mcp` still reaches the MCP handler untouched (asserted in
 * `oak-ds-static.integration.test.ts`) and `GET /mcp` still reaches its
 * identity-independent 405 stream refusal (MCP-545, asserted in
 * `mcp-html-negotiation.integration.test.ts`).
 *
 * Clerk is not part of that ordering, despite the shared prefix, and no mount
 * order produces a 401 on an asset: enforcement is bound to the exact `/mcp`
 * routes, which no asset path can match.
 *
 * It does NOT follow that Clerk merely attaches context here — this comment
 * said so and was wrong (MCP-518). Its middleware runs ahead of the static
 * mount and can answer the request itself: `@clerk/backend`'s handshake
 * eligibility fires on any GET whose `Sec-Fetch-Dest` is `document` or
 * `iframe`, or — with that header absent — whose `Accept` starts with
 * `text/html`, and a fetch matching that shape was measured being 307'd to
 * the Clerk handshake before ever reaching this mount. That is why these
 * asset prefixes are named in `clerk-skip-surfaces.ts`: the ordering argument
 * above rules out a 401, not a redirect. Both mounted copies of each tree are
 * named there — the routed one and the root one the alpha host serves from.
 */
export const ROUTED_ASSET_BASE = MCP_RESOURCE_PATH;

/** Directory name the copied design system occupies under the served root. */
export const OAK_DS_PUBLIC_DIRNAME = 'oak-ds';

/** Where the brand-asset copy is published, relative to the served root. */
export const OAK_ASSETS_PUBLIC_DIRNAME = 'oak-assets';

/**
 * Boot markers: one file per copied tree whose presence proves the copy ran.
 *
 * @remarks
 * `styles.css` is the design system's root stylesheet; the logo is the one
 * brand asset the landing page's masthead references today (it is also the
 * only entry in the copier's `OAK_ASSETS_MANIFEST` — keep the two in step).
 */
export const OAK_DS_MARKER = `${OAK_DS_PUBLIC_DIRNAME}/styles.css`;
export const OAK_ASSETS_MARKER = `${OAK_ASSETS_PUBLIC_DIRNAME}/assets/oak-national-academy-logo-512.png`;
