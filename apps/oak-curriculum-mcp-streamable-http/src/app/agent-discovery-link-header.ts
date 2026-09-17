/**
 * RFC 8288 `Link` response header pointing agents at this host's own
 * description (MCP-734).
 *
 * ## What it advertises, and why only that
 *
 * This host already publishes RFC 9728 protected-resource metadata, and that
 * document names the MCP endpoint in its `resource` field — so one relation
 * carries an agent from the bare origin to the endpoint in a single hop.
 * Nothing new is published here: the header advertises a document that
 * already exists and already answers 200, and the integration suite proves
 * that rather than assuming it. A `Link` pointing at a 404 is worse than no
 * `Link` at all, because a machine cannot tell a stale pointer from a live
 * one.
 *
 * The relation is `describedby` and not `service-desc`. Both are registered,
 * and the agent-readiness scanner accepts either, but they promise different
 * things: `service-desc` (RFC 8631) advertises a machine-consumable
 * description of the *service's interface* — an OpenAPI document or its
 * equivalent — which an agent could expect to drive calls from. The
 * protected-resource metadata is not that. It describes how this resource is
 * protected, so `describedby` states exactly what is true and over-claims
 * nothing. `principles.md` forbids stating what is not true of the thing in
 * front of us, and a `Link` header is read only by machines, which cannot
 * discount a courtesy.
 *
 * `api-catalog` — how `open-api.thenational.academy`, Hugging Face and
 * `modelcontextprotocol.io` each satisfy this check — is deliberately absent:
 * it would mean publishing a new `/.well-known/api-catalog` linkset, a served
 * surface with its own consistency obligations, and Oak already has two
 * RFC 9727 catalogues that disagree (MCP-721). Advertising what exists is the
 * honest, removable step; publishing an index is a separate decision.
 *
 * ## Why the target is derived rather than spelled
 *
 * The path comes from {@link PROTECTED_RESOURCE_METADATA_PREFIX}, the same
 * constant `auth-routes.ts` mounts the metadata on, for the reason
 * `static-asset-paths.ts` and `health-paths.ts` each record: an independent
 * literal here could drift to a path nothing serves while the whole suite
 * stayed green, which is precisely the 404-pointer this module exists to
 * avoid. One copy, so the header cannot outlive a move of the route.
 *
 * The unqualified prefix is advertised rather than the path-qualified
 * `…/mcp` form. Both are served by the same handler and return an identical
 * document (`auth-routes.ts`), and this header hangs off the origin, so the
 * origin-level form is the one whose meaning matches where it is published.
 *
 * ## Why app-level middleware rather than a route
 *
 * Registered with `app.use` alongside `mountAppVersionHeader`, so the header
 * is set before routing and therefore rides every response — including the
 * default 404. That is load-bearing rather than incidental: the owner's
 * 2026-08-20 instruction makes this host the MCP server alone, and the
 * landing-page teardown removes the root route entirely. A header bound to
 * `GET /` would vanish with it; this one does not.
 *
 * Removing this costs one call site and this file.
 *
 * @see https://www.rfc-editor.org/rfc/rfc8288 — Web Linking
 * @see https://www.rfc-editor.org/rfc/rfc9728 — OAuth 2.0 Protected Resource Metadata
 * @see https://www.rfc-editor.org/rfc/rfc8631 — service-desc / service-doc link relations
 */
import { PROTECTED_RESOURCE_METADATA_PREFIX } from '../served-origin.js';
import type { ExpressWithAppId } from './bootstrap-helpers.js';

/**
 * The single `Link` field-value this host serves.
 *
 * @remarks
 * A relative reference in angle brackets, resolved by the client against the
 * request URI (RFC 8288 §3), so the header carries no origin and is correct
 * on every host this app answers on — the canonical host, the legacy
 * deployment host, previews, and a local `curl` alike.
 *
 * Module-local deliberately. The integration suite asserts the literal
 * field-value it reads off the wire rather than importing this constant: a
 * test that compared the response against the same expression that produced
 * it would restate the configuration instead of describing the served state,
 * and would stay green through a change to both.
 */
const AGENT_DISCOVERY_LINK_HEADER =
  `<${PROTECTED_RESOURCE_METADATA_PREFIX}>; rel="describedby"; ` +
  `type="application/json"; title="OAuth 2.0 protected resource metadata"`;

/**
 * Mount middleware setting the agent-discovery `Link` header on every
 * response.
 */
export function mountAgentDiscoveryLinkHeader(app: ExpressWithAppId): void {
  app.use((_req, res, next) => {
    res.set('Link', AGENT_DISCOVERY_LINK_HEADER);
    next();
  });
}
