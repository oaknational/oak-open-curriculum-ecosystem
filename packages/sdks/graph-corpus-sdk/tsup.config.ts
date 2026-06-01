import { createSdkConfig } from '../../../tsup.config.base.js';

// Entry globs must cover every implementation module, not just the subpath
// barrels: with `bundle: false` (ADR-010) each entry is transpiled 1:1 and
// re-export statements are preserved, so a barrel-only entry list would emit
// `index.js` files whose `./graph-view.js` / `./loader.js` imports resolve to
// files that were never written to dist. Globbing the trees emits each module.
export default createSdkConfig(
  ['src/*.ts', 'src/eef-strands/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
  { external: ['zod'] },
);
