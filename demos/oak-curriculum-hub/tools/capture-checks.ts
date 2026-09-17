/*
 * Pure capture policy for capture-live-demo.ts — the route set, flag/env
 * resolution, and the two self-check classifiers (blank render + hydration
 * witness). Split from the Playwright driving so the policy (what to capture
 * and what counts as a bad capture) lives apart from the mechanism (how the
 * browser is driven); every function here is pure and side-effect free.
 */
/** Strip every leading and trailing occurrence of `char` — a linear scan.
 *  Lives here, not in the shared package: `routeToBase` below is this
 *  helper's only consumer in the whole repo. */
function trimEdges(value: string, char: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && value.charAt(start) === char) {
    start += 1;
  }
  while (end > start && value.charAt(end - 1) === char) {
    end -= 1;
  }
  return value.slice(start, end);
}

/** The stable content routes that exist and are §D-capturable by default. /course (hydration-
 *  witnessed player) and /curriculum (the E3 showcase) joined at build-complete; /lesson/[slug]
 *  stays opt-in via --routes (needs a live slug). Evidence lands at the tool-relative OUT_DIR —
 *  never write screenshots to cwd-relative paths (a run from another directory nests them in the
 *  wrong tree; a train had to relocate exactly that, 2026-07-02). */
const DEFAULT_ROUTES = [
  '/',
  '/standards',
  '/rubrics',
  '/exemplars',
  '/wiki',
  '/course',
  '/curriculum',
];

/** Slug a route into an output basename: '/' → 'home', '/standards' → 'standards',
 *  '/lesson/[slug]' → 'lesson-slug'. */
export function routeToBase(route: string): string {
  const trimmed = trimEdges(route, '/');
  if (trimmed === '') {
    return 'home';
  }
  return trimEdges(trimmed.replaceAll(/[^a-zA-Z0-9]+/g, '-'), '-').toLowerCase();
}

/** This app's own dev base for the shared `resolveBase` (the host is
 *  `localhost`, never `127.0.0.1` — see the shared capture-flags doc for
 *  the hydration lore behind that). Width/base flag resolution and the
 *  blank classifier live in `@oaknational/fidelity-review/capture-flags`. */
export const DEFAULT_BASE = 'http://localhost:3010';

/** The app's own start-it advice, rendered into the shared
 *  reachability assertion's failure line. */
/** The app-identity sentinel the shared reachability checks judge —
 *  pairs with the oak-app meta in app/layout.tsx. */
export const APP_SENTINEL = { path: '/', marker: 'oak-curriculum-hub' } as const;

export const SERVER_HINT =
  'Start it first (from the app dir: pnpm dev -> :3010) and coordinate the port with the styling lane, or pass --base <url>.';

/** Resolve the route list (default DEFAULT_ROUTES). Override: `--routes /a,/b`. */
export function resolveRoutes(argv: readonly string[]): string[] {
  const flagIdx = argv.indexOf('--routes');
  const raw = flagIdx === -1 ? undefined : argv.at(flagIdx + 1);
  if (raw === undefined || raw === '') {
    return DEFAULT_ROUTES;
  }
  return raw
    .split(',')
    .map((r) => r.trim())
    .filter((r) => r !== '')
    .map((r) => (r.startsWith('/') ? r : `/${r}`));
}

/** Routes whose §D capture depends on client hydration. The /course paginated player HIDES the
 *  inactive sections post-hydration, while its SSR fallback ships ZERO `hidden` attributes by
 *  design (proven by the shell's renderToString test) — so the presence of `[hidden]` elements is
 *  the hydration witness. An unhydrated player page is full of text and passes the blank
 *  classifier, which is exactly why this separate check exists. */
const HYDRATION_GATED_ROUTES: ReadonlySet<string> = new Set(['/course']);

/** Hydration classifier for HYDRATION_GATED_ROUTES: SUSPECT when no element is `[hidden]`
 *  (the player never mounted — e.g. a 127.0.0.1 base blocking the dev chunks). Pure. */
export function isUnhydrated(route: string, hiddenCount: number): boolean {
  return HYDRATION_GATED_ROUTES.has(route) && hiddenCount === 0;
}
