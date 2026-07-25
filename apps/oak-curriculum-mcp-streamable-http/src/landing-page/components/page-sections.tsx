/**
 * The page's authored sections: hero, connect, and documentation.
 *
 * @remarks
 * Every word here is carried verbatim from the page this replaces. The one
 * value that is not authored is the connection snippet's URL, which comes
 * from {@link createSnippet} and stays request-host-derived — the endpoint
 * is never hand-written, so the open domain decision costs the app nothing.
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
          Designed for educators, this service connects your AI assistant to Oak&apos;s high
          quality, free, fully sequenced and{' '}
          <a
            className="oak-link"
            target="_blank"
            rel="noopener noreferrer"
            href={OAK_API_TERMS_URL}
          >
            openly licenced
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
export function ConnectSection({ vercelHost }: { vercelHost?: string }): JSX.Element {
  return (
    <section className="oak-stack--s connect" aria-labelledby="connect-title">
      <h2 className="oak-heading-4" id="connect-title">
        Connect the Oak Curriculum MCP to your AI assistant
      </h2>
      {/* oak-body-4 is 12px/300; on this tinted band that breaches the design
          system's own floors (body >= 16px, never weight 300 below 18px on a
          pastel fill), so the meta line takes the smallest conforming class. */}
      <p className="oak-body-3">
        Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1
      </p>
      <p>Add this to your MCP client configuration:</p>
      {/* `aria-label` is naming-prohibited on <pre>; a figure caption names
          the region legitimately and stays available to assistive tech. */}
      <figure>
        <figcaption className="oak-visually-hidden">JSON configuration snippet</figcaption>
        <pre>
          <code>{`{${createSnippet(vercelHost)}}`}</code>
        </pre>
      </figure>
      <p>
        This server uses{' '}
        <a className="oak-link" href="/.well-known/oauth-protected-resource">
          OAuth 2.1 authorization
        </a>
        . You will be prompted to log in. Access is currently for internal staff or by invitation.
      </p>
    </section>
  );
}

/** Pointers to the API documentation and the server's source. */
export function DocumentationCard(): JSX.Element {
  return (
    <section className="oak-card oak-card--aqua oak-stack--s">
      <h2 className="oak-heading-5">Documentation</h2>
      <p>
        For details about the underlying curriculum data, see the{' '}
        <a className="oak-link" href={OAK_API_OVERVIEW_URL}>
          Oak Curriculum API documentation
        </a>
        .
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
        .
      </p>
    </section>
  );
}
