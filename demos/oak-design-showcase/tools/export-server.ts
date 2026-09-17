/*
 * The static server over the Claude Design canonical export for the fidelity
 * review's export-render arm (ported from the hub's export-server; the
 * overlay is new behaviour). The export pages are NOT self-contained under
 * `studio-source/`: the studio's layout was flat, so `specimen.html` and
 * `Identity Switchboard.html` link kit CSS (`../colors_and_type.css`,
 * `components.css`, …) that the repo homes at the design-system PACKAGE
 * root, not under `studio-source/` (studio-source/README.md: "the
 * consumable files map root ⇄ root"). Serving one directory therefore
 * renders both pages unstyled — and unstyled markup still passes the blank
 * classifier, a silently wrong diff target.
 *
 * Cure: a TWO-ROOT OVERLAY reproducing the studio's layout — resolve every
 * request against `studio-source/` first, then fall back to the package
 * root. The fallback is BOUNDED to the package's own declared exports
 * surface (its exports-map keys: kit CSS, fonts/, assets/, dtcg/ …), so
 * the server never exposes undeclared package internals (package.json,
 * docs, src/) on even an ephemeral port, and a kit-asset re-home that the
 * exports map absorbs for normal consumers fails HERE loudly instead of
 * silently un-styling the diff target. Path decisions are pure and
 * separately tested in export-paths.ts. Roots resolve lazily through the
 * declared `@oaknational/oak-design-system` dependency and return a
 * Result, so a broken workspace link reaches the tool's formatted failure
 * line instead of dying as a raw MODULE_NOT_FOUND at import time.
 */
import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';

import { exportsSurfaceAdmits, resolveAcrossRoots, type OverlayRoot } from './export-paths';
import { describeThrown } from '@oaknational/fidelity-review/support';

const CONTENT_TYPES = new Map<string, string>([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.ttf', 'font/ttf'],
  ['.woff2', 'font/woff2'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.pdf', 'application/pdf'],
]);

const PackageExportsSchema = z.object({ exports: z.record(z.string(), z.unknown()) });

/**
 * Resolve the overlay roots through the declared workspace dependency (its
 * exports map exposes `./styles.css` at the package root — the same idiom
 * as tools/dev-open.ts), bounding the package-root fallback to the
 * package's own declared exports surface. Every failure names its actual
 * cause — a broken link, a missing studio tree, an unreadable manifest —
 * because each is cured differently.
 */
export function resolveExportRoots(): Result<readonly OverlayRoot[], string> {
  let kitRoot: string;
  try {
    kitRoot = path.dirname(
      createRequire(import.meta.url).resolve('@oaknational/oak-design-system/styles.css'),
    );
  } catch (error) {
    return err(
      `export-server: cannot resolve @oaknational/oak-design-system — the workspace link is broken; re-run pnpm install. cause: ${describeThrown(error)}`,
    );
  }
  const studioRoot = path.join(kitRoot, 'studio-source');
  if (!fs.existsSync(studioRoot)) {
    return err(
      `export-server: ${studioRoot} is missing — the design-system package no longer carries the canonical export tree; the fidelity targets are gone, not un-installed`,
    );
  }
  let manifest: z.infer<typeof PackageExportsSchema>;
  try {
    manifest = PackageExportsSchema.parse(
      JSON.parse(fs.readFileSync(path.join(kitRoot, 'package.json'), 'utf8')),
    );
  } catch (error) {
    return err(
      `export-server: cannot read the design-system exports map (the fallback root's declared surface): ${describeThrown(error)}`,
    );
  }
  return ok([
    { dir: studioRoot },
    { dir: kitRoot, admits: exportsSurfaceAdmits(typeSafeKeys(manifest.exports)) },
  ]);
}

function handleStaticRequest(
  roots: readonly OverlayRoot[],
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const resolved = resolveAcrossRoots(
    roots,
    req.url ?? '/',
    (candidate) => fs.existsSync(candidate) && !fs.statSync(candidate).isDirectory(),
  );
  if (resolved === undefined) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, {
    'content-type':
      CONTENT_TYPES.get(path.extname(resolved).toLowerCase()) ?? 'application/octet-stream',
  });
  const stream = fs.createReadStream(resolved);
  // An unreadable file (EACCES, vanished after the lookup) emits 'error'
  // on the stream; without a listener that is an uncaught exception in
  // the HTTP callback, bypassing the tool's cleanup boundary. The
  // headers are already written, so DESTROY the socket — the browser
  // then records a failed subresource request, which the render arm's
  // required-resource watch turns into a mechanical failure instead of
  // a clean 200 with a truncated body passing the capture self-checks.
  stream.on('error', (error: unknown) => {
    res.destroy(error instanceof Error ? error : new Error(String(error)));
  });
  stream.pipe(res);
}

/** Serve the overlay roots on an ephemeral localhost port. */
export function serveRoots(roots: readonly OverlayRoot[]): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    handleStaticRequest(roots, req, res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

/** The bound TCP port of a listening server, narrowed from Node's address union. */
export function portOf(server: http.Server): Result<number, Error> {
  const address = server.address();
  if (address === null || typeof address === 'string') {
    return err(new Error('static server did not bind a TCP port'));
  }
  return ok(address.port);
}
