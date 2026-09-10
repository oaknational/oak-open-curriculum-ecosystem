/**
 * `robots.txt` for the MCP host (MCP-703).
 *
 * Every other official Oak web app serves one — `www` and `open-api` both do
 * (measured 2026-09-09) — and the agent-readiness baseline `AR-A6` makes it a
 * requirement for *every* official Oak web app, not an apex nicety. This host
 * went live after that criterion was written, so until now it was the one
 * surface breaching it: `GET /robots.txt` returned 404 and a crawler arriving
 * here got no statement of intent at all.
 *
 * ## Why the body is not `www`'s body
 *
 * `www` is a content site: its file names six sitemaps. This host is a machine
 * surface — an MCP endpoint, its OAuth authorisation proxy, the discovery
 * documents, and one landing page describing them. It publishes no crawlable
 * page set, so it has no sitemap, and a `Sitemap:` directive copied across
 * would advertise a document that does not exist. `principles.md` forbids
 * stating what is not true of the thing in front of us, and a robots.txt is
 * read by machines that cannot tell a courtesy from a claim.
 *
 * ## Why `/.well-known/` is Allow-listed rather than merely unmentioned
 *
 * Those documents are how clients discover this server and authorise against
 * it. Nothing here disallows them today, so the `Allow` changes no behaviour
 * now — it is the invariant made mechanical rather than commented. Under
 * RFC 9309 §2.2.2 the longest matching rule wins, so a later `Disallow: /`
 * would still leave `/.well-known/` fetchable, and the `Allow` is emitted
 * first so a naive first-match parser reaches the same answer. The rule that
 * must not be broken is expressed in the file that would break it.
 * `open-api`'s file allows its own `.well-known` tree the same way.
 *
 * ## What the disallowed prefixes are
 *
 * The OAuth authorisation endpoints, the HMAC-signed expiring asset URLs
 * (ADR-126 — signed and time-limited, not single-use: there is no nonce and no
 * consumption record), and the two liveness probes. None holds anything to
 * index, and crawling the authorisation endpoints would manufacture junk auth
 * attempts. The landing page and its own static assets stay allowed: a
 * renderer needs the stylesheet, and the `/` and `/mcp` copies of that one
 * page already resolve through the page's own `rel="canonical"`.
 *
 * ## What is deliberately absent
 *
 * Content Signals values (`search`, `ai-input`, `ai-train`) and any
 * AI-crawler-specific group. Those are `AR-A7`: an editorial and legal
 * decision about *values*, undecided for this host. `open-api` already
 * publishes `Content-Signal: ai-train=yes, search=yes, ai-input=yes`
 * (observed 2026-09-09), so cross-host consistency is part of that decision
 * rather than something to settle here; the 2026-09-09 standards refresh also
 * recorded a view that the mechanism should be Cloudflare's managed
 * robots.txt, with `draft-ietf-aipref-vocab-06` the standards track to adopt
 * when it lands. Guessing a value here would pre-empt an owner ruling on both
 * the values and the mechanism. This module is the baseline file only.
 *
 * A sibling of `openai-domain-verification.ts`: its own module, one exported
 * path constant shared with the Clerk skip list, registered before Clerk
 * middleware and in every auth mode. It carries no origin, so it is served
 * identically from every host this app answers on and has no Host check to
 * fail.
 *
 * That identical body has no `Disallow: /` to keep preview deployments out of
 * an index, and it does not need one: Vercel sends `x-robots-tag: noindex` on
 * preview responses itself. Measured on the MCP-703 preview (2026-09-10) at
 * `/`, at a discovery document and at this path, with the canonical host's `/`
 * carrying no such header as the control.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9309.html — Robots Exclusion Protocol
 */
import type { Express } from 'express';
import type { Logger } from '@oaknational/logger';
import { HEALTH_PATHS } from './app/health-paths.js';

/**
 * The one path a crawler looks for, fixed by RFC 9309 §2.3 to the host root.
 *
 * The canonical owner of the path: the Clerk skip list consumes this constant
 * too, so the served route and the auth exemption cannot drift apart.
 */
export const ROBOTS_TXT_PATH = '/robots.txt';

/** Discovery documents: fetched by clients that have not authorised yet. */
const WELL_KNOWN_PREFIX = '/.well-known/';

/** The OAuth authorisation proxy (`/oauth/authorize`, `/token`, `/register`). */
const OAUTH_PROXY_PREFIX = '/oauth/';

/** HMAC-signed, expiring asset URLs (ADR-126). */
const SIGNED_DOWNLOAD_PREFIX = '/assets/download/';

/**
 * The served body.
 *
 * @remarks
 * Of the four prefixes, only the health paths are composed from the constant
 * the routes are registered from — `HEALTH_PATHS`, which
 * `clerk-skip-surfaces.ts` spreads for the same reason: there are two of them
 * and a change to the served health layout should move this file with it
 * rather than leave a line here naming a path that has moved. The other three
 * are literals declared above, because the routes they cover are themselves
 * registered from literals; deriving them would only move the literal.
 *
 * There is deliberately no `Disallow: /`. With no file at all, every path here
 * was permitted; this file withdraws only the four prefixes below, so it
 * forbids nothing a crawler could previously have usefully indexed.
 *
 * No `Cache-Control` accompanies the response. Caching policy for this host's
 * discovery surfaces is MCP-413's decision, and robots.txt has no reason to
 * differ from whatever that lane settles; crawlers cache the file on their own
 * conventions regardless. Volumetric control is owned at the edge (ADR-219).
 *
 * Not exported: the integration test pins this text verbatim rather than
 * importing it, so that an edit to the served body has to be restated in the
 * test and cannot be ratified silently.
 */
const ROBOTS_TXT_BODY = [
  '# Oak National Academy Model Context Protocol server. A machine surface:',
  '# the MCP endpoint, its OAuth authorisation proxy, the discovery documents,',
  '# and one landing page describing them with its own assets. Oak curriculum',
  '# pages written for people are on https://www.thenational.academy.',
  '#',
  '# No Sitemap: this host publishes no crawlable page set. The /.well-known/',
  '# documents are allowed explicitly because that is how clients discover',
  '# this server and authorise against it.',
  '',
  'User-agent: *',
  `Allow: ${WELL_KNOWN_PREFIX}`,
  `Disallow: ${OAUTH_PROXY_PREFIX}`,
  `Disallow: ${SIGNED_DOWNLOAD_PREFIX}`,
  ...HEALTH_PATHS.map((healthPath) => `Disallow: ${healthPath}`),
  '',
].join('\n');

/**
 * Registers the `robots.txt` route. Mount BEFORE clerkMiddleware, in every
 * auth mode.
 *
 * @remarks
 * An app route rather than a file in the served static root, because that
 * mount sits behind `clerkMiddleware`: a static `robots.txt` would answer a
 * crawler through the auth vendor, which is how a public file becomes an
 * unfetchable one. That is not hypothetical — the live 404 at this path today
 * carries `x-clerk-auth-status: signed-out`.
 */
export function registerRobotsTxt(app: Express, log: Logger): void {
  log.debug('Registering robots.txt (public, MCP-703)');
  app.get(ROBOTS_TXT_PATH, (_req, res) => {
    res.type('text/plain').send(ROBOTS_TXT_BODY);
  });
}
