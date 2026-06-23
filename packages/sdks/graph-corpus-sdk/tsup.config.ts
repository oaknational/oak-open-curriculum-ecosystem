import { createSdkConfig } from '../../../tsup.config.base.js';

// Entry globs must cover every implementation module of every subpath, not just
// the barrels: with `bundle: false` (ADR-010) each entry is transpiled 1:1 and
// re-export statements are preserved, so a barrel-only entry list would emit
// `index.js` files whose `./graph-view.js` / `./loader.js` imports resolve to
// files that were never written to dist. Each exported subpath (`.`,
// `./eef-strands`, `./curriculum`) therefore needs its tree globbed — a subtree
// omitted here ships `.d.ts` only and its `default` condition resolves to a
// non-existent `.js` (the monorepo `development` condition masks this by
// resolving to `src/`). Globbing the trees emits each module.
export default createSdkConfig(
  [
    'src/*.ts',
    'src/eef-strands/**/*.ts',
    'src/curriculum/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  { external: ['zod'] },
);
