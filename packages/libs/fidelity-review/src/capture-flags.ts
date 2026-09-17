/*
 * Shared capture policy: flag/env resolution for the matched-geometry
 * capture arms and the blank-render classifier. These three were
 * byte-identical (isSuspect) or divergent-only-by-drift (resolveWidth's
 * strictness fix, resolveBase's default port) across the demo apps'
 * copies — the canonical strict versions live here; each app keeps its
 * own default base constant and its app-specific classifiers (route
 * slugging, hydration witnesses, frame-aware render checks). Every
 * function here is pure and side-effect free.
 */
import { ok, err, type Result } from '@oaknational/result';

import { stripTrailing } from './support';

/** The raw width input: the `--width` value when the flag is present,
 *  else WIDTH from env. A `--width` with no following value is a
 *  stated error — a silent fall-through to env/default would hand the
 *  user a width they did not ask for. */
function rawWidthInput(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
): Result<string | undefined, Error> {
  const flagIdx = argv.indexOf('--width');
  if (flagIdx === -1) {
    return ok(env.WIDTH);
  }
  const fromFlag = argv.at(flagIdx + 1);
  if (fromFlag === undefined) {
    return err(new Error('--width requires a value (an integer 320..5000)'));
  }
  return ok(fromFlag);
}

/** Resolve the viewport CSS width (the matched-geometry standard, 1440).
 *  Override: `--width 1280` or WIDTH=1280. */
export function resolveWidth(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
): Result<number, Error> {
  const raw = rawWidthInput(argv, env);
  if (!raw.ok) {
    return raw;
  }
  // Number(), not parseInt: '1440px' and '1440.5' must be rejected, not
  // silently truncated to a plausible integer.
  const width = raw.value !== undefined && raw.value !== '' ? Number(raw.value) : 1440;
  if (!Number.isInteger(width) || width < 320 || width > 5000) {
    return err(
      new Error(`invalid --width ${JSON.stringify(raw.value)} (expected integer 320..5000)`),
    );
  }
  return ok(width);
}

/** The raw base input: the `--base` value when the flag is present, else
 *  BASE_URL from env, else the app's default. A `--base` with no
 *  following value is a stated error (mirror of rawWidthInput): the
 *  silent fall-through previously let `--base` at argv end run against
 *  a base the user did not ask for, and `--base --report-only` eat the
 *  mode flag as its value. */
function rawBaseInput(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
  defaultBase: string,
): Result<string, Error> {
  const flagIdx = argv.indexOf('--base');
  if (flagIdx === -1) {
    return ok(env.BASE_URL ?? defaultBase);
  }
  const fromFlag = argv.at(flagIdx + 1);
  if (fromFlag === undefined) {
    return err(new Error('--base requires a value (an http(s) loopback URL)'));
  }
  return ok(fromFlag);
}

/** Loopback hosts the capture tool may talk to — exact matches only, so
 *  a lookalike (`localhost.evil.example`) never passes. */
const LOOPBACK_HOSTS: ReadonlySet<string> = new Set(['localhost', '127.0.0.1', '[::1]']);

/** The capture-egress origin guard: this tool only ever drives a LOCAL
 *  dev/export server, so a base whose host is not exactly loopback is
 *  refused — an internal or cloud-metadata target must never become
 *  "evidence" (the SSRF class from the 2026-08-09 assurance round).
 *  Pure; also the origin authority the browser-request allowlist
 *  compares against. */
export function allowLoopbackOrigin(base: string): Result<URL, Error> {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return err(
      new Error(`invalid base URL ${JSON.stringify(base)} (expected http(s)://<loopback>)`),
    );
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return err(new Error(`base URL scheme must be http(s), got ${JSON.stringify(url.protocol)}`));
  }
  if (!LOOPBACK_HOSTS.has(url.hostname)) {
    return err(
      new Error(
        `base URL host ${JSON.stringify(url.hostname)} is not loopback — capture egress is confined to localhost, 127.0.0.1, [::1]`,
      ),
    );
  }
  return ok(url);
}

/** Resolve the base URL of the running app. Override: `--base <url>` or
 *  BASE_URL. `defaultBase` is the app's own dev port — and its host should
 *  be `localhost`, NOT `127.0.0.1`: `next dev` blocks cross-origin dev
 *  resources from 127.0.0.1, so hydration chunks never load and any
 *  hydration-dependent surface silently renders its SSR fallback — a
 *  wrong capture target the blank classifier cannot catch (hub team
 *  finding, 2026-07-02). Every accepted base is a validated loopback
 *  origin (allowLoopbackOrigin). */
export function resolveBase(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
  defaultBase: string,
): Result<string, Error> {
  const raw = rawBaseInput(argv, env, defaultBase);
  if (!raw.ok) {
    return raw;
  }
  const origin = allowLoopbackOrigin(raw.value);
  if (!origin.ok) {
    return err(origin.error);
  }
  return ok(stripTrailing(raw.value, '/'));
}

/** The device scale factor of the matched-geometry convention: every
 *  capture arm shoots at this scale AND the report meta declares it —
 *  one constant consumed at both ends, because an arm that drifted
 *  while the meta stayed hardcoded would make the rendered "scale 2" a
 *  lie about the PNGs. Peer of resolveWidth's 1440 default. */
export const MATCHED_GEOMETRY_SCALE = 2;

/** External origins the rendered surfaces are RATIFIED to reference —
 *  the kit-authored counter-brand sheets pull webfonts from these
 *  (provenance: the showcase's third-party-origin census in
 *  tests/apply-state.ts, consolidated here at its second consumer).
 *  The capture egress allowlist admits exactly declared-origin ∪ this
 *  set: stripping the fonts from capture would silently change every
 *  captured pixel on BOTH sides and void the registers' warrants. */
export const RATIFIED_EXTERNAL_ORIGINS: readonly string[] = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net',
];

/** The capture-egress request predicate: a browser request is allowed
 *  iff its origin is the declared (loopback) capture origin or a
 *  ratified external origin — anything else must never contribute to
 *  evidence (SSRF/exfil class). Unparseable URLs are refused. Pure. */
export function isAllowedRequestUrl(
  url: string,
  declaredOrigin: string,
  ratified: readonly string[] = RATIFIED_EXTERNAL_ORIGINS,
): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  return parsed.origin === declaredOrigin || ratified.includes(parsed.origin);
}

/** Blank-render classifier: a real page is HTTP 200 with meaningful body
 *  height AND visible text. Returns true when the capture is SUSPECT
 *  (looks blank / a placeholder). Pure — the self-check. */
export function isSuspect(status: number, bodyHeight: number, textLength: number): boolean {
  return !(status === 200 && bodyHeight > 400 && textLength > 200);
}
