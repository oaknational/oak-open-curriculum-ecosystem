/**
 * The page's authored sections: hero, connect, and documentation.
 *
 * @remarks
 * The wording here is the owner's. It came verbatim from the page this
 * replaces, and changes only at his word — the 2026-07-26 pass applied the
 * `editorial-tone` directive's terminology and British-English spelling rules
 * to four strings. No wording on this page is agent-authored.
 *
 * The 2026-08-06 pass retired the invite-only positioning at the owner's word
 * (MCP-509, carrying the copy work raised under MCP-128): the status tag now
 * reads "Public Beta", and the access line asks the reader to sign in with
 * their Oak account rather than naming internal staff or an invitation. Both
 * statements are true as read — Clerk is on production and sign-in is open,
 * which the owner verified against production with a non-Oak email and no
 * invitation. That is the condition these words depend on: if access is ever
 * narrowed again, this page states something false and both strings must
 * change with it.
 *
 * The one value that is not authored is the connection snippet's URL, which
 * arrives through the view-props seam (`mcpEndpointUrl`), derived ONCE at
 * BUILD time by `derive-view-props.ts` from the build environment — the
 * endpoint is never hand-written and never re-derived below the seam, so
 * the canonical link and the snippet cannot disagree.
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
 * The hero's explainer sentence — the single source for both the visible
 * paragraph and the share card's description.
 *
 * @remarks
 * The owner's copy, held once. `<meta>` cannot carry the link the visible
 * sentence contains, so an earlier version kept the words twice and used a
 * test to hold the copies equal. That test had to strip tags out of the
 * rendered hero to compare them, which CodeQL correctly flagged as incomplete
 * sanitisation — a regex tag-stripper is unsafe whatever it is pointed at.
 *
 * The duplication was the actual defect. The hero now composes this string
 * around the link, so the visible sentence and the card's description cannot
 * differ: they are the same characters.
 */
export const PAGE_DESCRIPTION =
  "Designed for teachers, this service connects your AI assistant to Oak's " +
  'high quality, free, fully sequenced and openly licensed curriculum ' +
  'resources — thousands of lessons, units, and assets across subjects and ' +
  'key stages.';

/** The words inside the hero sentence that link to Oak's API terms. */
const TERMS_LINK_TEXT = 'openly licensed';

const [heroBeforeLink = '', heroAfterLink = ''] = PAGE_DESCRIPTION.split(TERMS_LINK_TEXT);

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
        <span className="oak-tag oak-tag--white">Public Beta</span>
        <h1 id="title" className="oak-heading-1">
          Oak Curriculum MCP
        </h1>
        <p className="oak-body-2 oak-prose">
          {heroBeforeLink}
          <a
            className="oak-link"
            target="_blank"
            rel="noopener noreferrer"
            href={OAK_API_TERMS_URL}
          >
            {TERMS_LINK_TEXT}
          </a>
          {heroAfterLink}
        </p>
      </div>
    </section>
  );
}

/**
 * Connection instructions, including the per-deployment config snippet.
 *
 * @param mcpEndpointUrl - The endpoint URL, derived once on the build side.
 * @param protectedResourceMetadataUrl - Path-qualified PRM URL, likewise derived
 *   once (MCP-511): the RFC 9728 §3.1 discovery URI for a resource at `/mcp`,
 *   and the form that survives a path-scoped edge. The unqualified path is a
 *   compatibility alias serving the identical document.
 */
export function ConnectSection({
  mcpEndpointUrl,
  protectedResourceMetadataUrl,
}: {
  readonly mcpEndpointUrl: string;
  readonly protectedResourceMetadataUrl: string;
}): JSX.Element {
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
        <code>{`{${createSnippet(mcpEndpointUrl)}}`}</code>
      </pre>
      <p>
        This server uses{' '}
        <a className="oak-link" href={protectedResourceMetadataUrl}>
          OAuth 2.1 authorisation
        </a>
        {'. '}
        You will be prompted to sign in with your Oak account.
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
