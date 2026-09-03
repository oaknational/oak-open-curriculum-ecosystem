/**
 * Reviewed post-baseline semantic deltas — App auth-surface governed sources
 * (auth routes, the MCP auth middleware family, and public-resource sets).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_AUTH_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // MCP-517: two bootstrap step names added to the measured-step union so the
  // canonical-forwarded-headers install is billed to itself rather than to
  // Clerk's. Boot-time diagnostics only; serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/auth-instrumentation.ts': excluded(
    'edb46bf7322dd0396c25ac7b4e254fb8bb94dc92f579b9a0c6666a5cc3569ea1',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-655: the upstream OAuth-metadata fetch now requires the document's
  // `issuer` to equal the base URL it was fetched from (RFC 8414 §3.3) —
  // the value the PRM publishes as the authorization server — and
  // classifies the mismatch as `issuer_mismatch`. Boot-time boundary
  // validation only; serves no agent-facing content. Homed here, with the
  // auth surface it guards, because the app map sits at its line limit.
  'apps/oak-curriculum-mcp-streamable-http/src/app/metadata-fetch-error.ts': excluded(
    'cf2cfb9f0f7763e5657ed2c2379196e4e27cd152b6914700fa245e48e7de924a',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/upstream-metadata-fetch.ts': excluded(
    '06e90c915721be676bb603c583bfc020fb57a0b1490754350a0de5f73c1d47b6',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-655: the Clerk key-pairing guard — the secret key must belong to the
  // instance the publishable key names (a shared JWKS `kid`), or bootstrap
  // fails instead of every sign-in being refused after it succeeds. Boot-time
  // boundary validation only; serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/app/clerk-key-pairing.ts': excluded(
    '916664a0ff27167375629179970db20207357d8f9d2a739a2264b2f0703ba754',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-351: the published PRM resource composes the shared
  // MCP_RESOURCE_PATH constant; the served document is byte-identical.
  // MCP-545: both GET /mcp mounts now serve the 405 standalone-stream
  // refusal; its body mirrors the SDK's own refusal idiom verbatim (a
  // vendor-shaped wire error, no new Oak-authored agent-facing copy) and
  // the C705–C708 metadata rows are untouched by the delta.
  // MCP-655: the PRM (C706) names the upstream authorization server's
  // issuer instead of this origin, so a PRM-following client holds the
  // issuer the authorization response's `iss` carries (RFC 9207 §2.4);
  // C705, C707 and C708 are untouched.
  'apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts': reviewed(
    'ace7a9c10712382d219d986b24696ab94f11ef1717df1654e39244ae8838efad',
    ['C705', 'C706', 'C707', 'C708'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-mcp-resource-url.ts': excluded(
    '1bac2a8ec91a09fb51dce02ec3f943bd76c9c3c4ee0097cc9bd318e8b716d2b0',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-prm-url.ts': excluded(
    'bf56a81ce02610f788fd3ceee1518bc7b6bf9a711d272b6fad6a18fbc78e41b4',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts': excluded(
    '86cc00d1dea41e43cf51bba107b0505e4728e7498f28d7bdadf91dff44a42a72',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-351: the response senders relocated to mcp-auth-responses.ts (file
  // split at the line limit); C399's fallback string stays with the
  // validation branch that composes it. Every sender body is verbatim.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts': reviewed(
    '62a933c1e0d11be1831fda411f4ff32da49694e6ea49078b3d15a13c4394b7ec',
    ['C395', 'C396', 'C397', 'C398', 'C400'],
  ),
  // MCP-392: the Authorization header now parses once into a closed
  // missing/malformed/bearer result (dismissals withdrawn at owner word);
  // C399's fallback string is untouched by the change.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts': reviewed(
    '4b7d0c6cd44d480b9e4a4679744c5d570bd1d37bb7cc1d1e31d3ff7565825d13',
    ['C399'],
  ),
  // MCP-242: canonical verified-userId derivation for analytics identity —
  // pure auth-context plumbing, serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verified-user-id.ts': excluded(
    'cfdd95b3968921c4dabcb48248e40cd18028eb386535019f77fe2dd79c29a586',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-353: the under-the-hood allowlist row (C413) retired with the deleted
  // resource (MCP-242's re-review of the pre-deletion file is superseded by
  // that retirement); the file now composes SDK-owned URI sets only.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts': excluded(
    '75bbea61c4b91c53a1ec93133852f9841844f94eb448973f9bbecfd855239227',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-518: the public-path sets, and the case-normalisation rule they are
  // compared under, extracted from the Clerk conditional. Path literals for a
  // routing decision; serves no agent-facing content.
  //
  // MCP-580 re-review: the health entry is now spread from `HEALTH_PATHS`, so
  // the routed `/mcp/healthz` the canonical host reaches is auth-exempt exactly
  // as the root path already was. Still a routing decision over path literals.
  'apps/oak-curriculum-mcp-streamable-http/src/clerk-skip-surfaces.ts': excluded(
    'c96fa6a897a638088c9841c8a4dbb85229ae7f800a14ac52c57b25cce91b9203',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-518: the Clerk conditional now forks on the request's surface before
  // its MCP method, so a browser view of the fully public page — at `/mcp` and
  // at `/` alike — and the page's own static asset trees skip Clerk entirely.
  // Routing and header reading only: the file serves no agent-facing content,
  // and every MCP protocol request still reaches Clerk unchanged.
  'apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts': excluded(
    '075f96234f69d44fa7429d3d818bf5520f1bd9f54737342cd40805063cd36de4',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-517: mounts the canonical-forwarded-headers shim immediately ahead of
  // the global Clerk middleware so Clerk perceives the served address. Mount
  // order and header plumbing only; no served content changes.
  'apps/oak-curriculum-mcp-streamable-http/src/global-auth-context.ts': excluded(
    '8b2b566c8acc474aae9191216f8154a1d31ccae70f2d0bc585a157fdcc8c481c',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-518: the surface-fork predicate, composing the negotiation's own
  // selectsHtmlLeg with the auth vendor's document-navigation eligibility.
  // A routing decision over method and negotiation headers; serves nothing.
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-public-browser-leg.ts': excluded(
    '959581bc8a8ca60e63e6badef9a0d74914a3b8bf6108f9640ef6d55deb2d3ffb',
    IMPLEMENTATION_ONLY,
  ),
};
