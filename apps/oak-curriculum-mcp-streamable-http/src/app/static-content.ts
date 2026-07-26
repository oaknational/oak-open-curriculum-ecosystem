/**
 * Static content route mounting: landing page and public assets.
 *
 * Extracted from `application.ts` to keep each module under the
 * file-length lint ceiling.
 */

import { static as expressStatic } from 'express';
import type { Express, RequestHandler } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import type { Logger } from '@oaknational/logger';

import { OAK_DS_PUBLIC_DIRNAME } from '../../build-scripts/copy-oak-ds.js';
import { renderLandingPageHtml, type LandingPageOptions } from '../landing-page/index.js';

function addRootLandingPage(
  app: Express,
  dnsRebindingMw: RequestHandler,
  log: Logger,
  landingPage: LandingPageOptions,
): void {
  app.get('/', dnsRebindingMw, (req, res) => {
    log.debug('landing.get', { path: req.path, method: req.method });
    res.type('text/html').send(renderLandingPageHtml(landingPage));
  });
}

/**
 * Mounts the static asset root, refusing to serve without it.
 *
 * @remarks
 * The root is located by trying `process.cwd()`-relative candidates, because
 * the app runs from the workspace directory locally and from the repository
 * root on Vercel. That heuristic used to fail open: no candidate meant no
 * mount, and the server came up healthy.
 *
 * Since the design system is delivered from this directory, failing open now
 * costs every stylesheet, both fonts, every mask icon, the logo, and both page
 * scripts — a page that returns 200 and renders as unstyled HTML, with nothing
 * in the logs. A missing asset root is a broken deployment, so it is treated as
 * one at boot rather than discovered by a visitor.
 */
function mountStaticAssets(app: Express, log: Logger): void {
  const candidates = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/oak-curriculum-mcp-streamable-http/public'),
  ];
  const chosen = candidates.find((p) => fs.existsSync(p));

  if (chosen === undefined) {
    log.error('static.root.missing', { cwd: process.cwd(), candidates });
    throw new Error(
      `No static asset root found. Tried: ${candidates.join(', ')} (cwd: ${process.cwd()}). ` +
        'The design system, fonts, icons, and page scripts are all served from this directory.',
    );
  }

  const designSystemMarker = path.join(chosen, OAK_DS_PUBLIC_DIRNAME, 'styles.css');
  if (!fs.existsSync(designSystemMarker)) {
    log.error('static.design-system.missing', { root: chosen, expected: designSystemMarker });
    throw new Error(
      `Static root ${chosen} carries no design system at ${OAK_DS_PUBLIC_DIRNAME}/styles.css. ` +
        'Run the build so copy-oak-ds populates it; serving without it renders the page unstyled.',
    );
  }

  // Revalidate-always, not a freshness window: these are mutable URLs
  // (`/oak-ds/styles.css`, `/landing-page.css`), so any positive maxAge lets
  // a browser pair pre-deploy assets with post-deploy HTML for that long.
  // ETag keeps the steady state cheap (304, no body). Content-hashed URLs
  // are the durable cure and belong to the asset-versioning follow-up.
  app.use(expressStatic(chosen, { etag: true, maxAge: 0 }));
}

export function mountStaticContentRoutes(
  app: Express,
  dnsRebindingMw: RequestHandler,
  log: Logger,
  landingPage: LandingPageOptions,
): void {
  addRootLandingPage(app, dnsRebindingMw, log, landingPage);
  mountStaticAssets(app, log);
}
