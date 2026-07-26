/**
 * The page's authored sections: hero, connect, and documentation.
 *
 * @remarks
 * The wording here is the owner's. It came verbatim from the page this
 * replaces, and changes only at his word — the 2026-07-26 pass applied the
 * `editorial-tone` directive's terminology and British-English spelling rules
 * to four strings. No wording on this page is agent-authored.
 *
 * The one value that is not authored is the connection snippet's URL, which
 * comes from {@link createSnippet}. It is derived from the deployment host,
 * resolved once at startup into `runtimeConfig.displayHostname` rather than
 * read per request — the endpoint is never hand-written, so the open domain
 * decision costs the app nothing.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';

import { createSnippet } from '../create-snippet.js';

const OAK_WEBSITE_URL = 'https://www.thenational.academy';
const OAK_API_TERMS_URL = 'https://open-api.thenational.academy/docs/about-oaks-api/terms';
const OAK_API_OVERVIEW_URL =
  'https://open-api.thenational.academy/docs/about-oaks-api/api-overview';
const WORKSPACE_GITHUB_URL =
  'https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/main/apps/oak-curriculum-mcp-streamable-http';

/**
 * The hero's explainer sentence as plain text, for the share card.
 *
 * @remarks
 * Not a second piece of copy. `<meta>` cannot hold the link the visible
 * sentence carries, so the same words exist here without it — and a test holds
 * the rendered hero to this string, so the card cannot drift away from the page
 * it describes. Editing the page's wording means editing this too, which is the
 * point: the owner's copy stays the only copy, here as everywhere else.
 */
export const PAGE_DESCRIPTION =
  'Designed for teachers, this service connects your AI assistant to Oak’s ' +
  'high quality, free, fully sequenced and openly licensed curriculum ' +
  'resources — thousands of lessons, units, and assets across subjects and ' +
  'key stages.';

/** Hero band: breadcrumbs, status tag, title, and the explainer sentence. */
export function PageHero(): JSX.Element {
  return (
    <section data-region="hero" className="oak-band">
      <div className="oak-container oak-stack oak-stack--l hero-copy">
        <nav className="breadcrumbs oak-cluster oak-cluster--s" aria-label="Breadcrumbs">
          <a className="oak-link" href={OAK_WEBSITE_URL}>
            Home
          </a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Oak Curriculum MCP</span>
        </nav>
        <span className="oak-tag oak-tag--white">Invite Only Private Beta</span>
        <h1 id="title" className="oak-heading-1">
          Oak Curriculum MCP
        </h1>
        <p className="oak-body-2 oak-prose">
          Designed for teachers, this service connects your AI assistant to Oak&apos;s high quality,
          free, fully sequenced and{' '}
          <a
            className="oak-link"
            target="_blank"
            rel="noopener noreferrer"
            href={OAK_API_TERMS_URL}
          >
            openly licensed
          </a>{' '}
          curriculum resources — thousands of lessons, units, and assets across subjects and key
          stages.
        </p>
      </div>
    </section>
  );
}

/**
 * Connection instructions, including the per-deployment config snippet.
 *
 * @param vercelHost - Deployment host used to derive the endpoint URL.
 */
export function ConnectSection({ vercelHost }: { readonly vercelHost?: string }): JSX.Element {
  return (
    <section className="oak-stack oak-stack--s oak-prose connect" aria-labelledby="connect-title">
      <h2 className="oak-heading-4" id="connect-title">
        Connect the Oak Curriculum MCP to your AI assistant
      </h2>
      {/* The design system's floor for a pastel fill is weight 400+, and its
          body floor is 16px. oak-body-3 is 14px at weight 300 and meets
          neither — an earlier comment here rejected oak-body-4 by citing that
          floor and then picked a class that breaches it too. oak-body-2-bold
          is 16px/700 and is the smallest class on this band that conforms. */}
      <p className="oak-body-2-bold">
        Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1
      </p>
      <p>Add this to your MCP client configuration:</p>
      {/* `overflow-x: auto` makes this a scroll container below ~500px, and a
          scroll container with no focusable descendant is unreachable by
          keyboard outside Chromium — SC 2.1.1, Level A, on the one string the
          page exists to convey. `tabIndex` supplies the affordance.

          A bare <pre> maps to role `generic`, which ARIA 1.2 §5.2.8.6 forbids
          naming — so `role="region"` is what makes `aria-label` legitimate
          here, not a workaround for it. That also retires the figure wrapper:
          a visually-hidden <figcaption> stays in the accessibility tree as
          CONTENT but yields no accessible NAME in Chromium, so it never did
          the naming job it was added for. */}
      <pre tabIndex={0} role="region" aria-label="JSON configuration snippet">
        <code>{`{${createSnippet(vercelHost)}}`}</code>
      </pre>
      <p>
        This server uses{' '}
        <a className="oak-link" href="/.well-known/oauth-protected-resource">
          OAuth 2.1 authorisation
        </a>
        {'. '}
        You will be prompted to log in. Access is currently for internal staff or by invitation.
      </p>
    </section>
  );
}

/** Pointers to the API documentation and the server's source. */
export function DocumentationCard(): JSX.Element {
  return (
    <section className="oak-card oak-card--aqua oak-stack oak-stack--s">
      <h2 className="oak-heading-5">Documentation</h2>
      <p>
        For details about the underlying curriculum data, see the{' '}
        <a className="oak-link" href={OAK_API_OVERVIEW_URL}>
          Oak Curriculum API documentation
        </a>
        {'.'}
      </p>
      <p>
        Browse the MCP server implementation:{' '}
        <a
          className="oak-link"
          target="_blank"
          rel="noopener noreferrer"
          href={WORKSPACE_GITHUB_URL}
        >
          code on GitHub
        </a>
        {'.'}
      </p>
    </section>
  );
}
