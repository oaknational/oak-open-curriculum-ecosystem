/**
 * ESLint configuration for the design-showcase demo (Next.js + React).
 *
 * Consumes the shared next + strict configs from the oak-eslint standards
 * plugin. The demo is ordinary repo code held to the repo's full strict
 * ruleset — no rule relaxations, no per-path exemptions.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globalIgnores, includeIgnoreFile } from 'eslint/config';
import { configs } from '@oaknational/eslint-plugin-standards';

const thisDir = dirname(fileURLToPath(import.meta.url));

export default [
  // Linting scope = tracked repo files (owner-ratified 2026-07-02, hub
  // precedent): regenerable output sits outside the lint corpus by
  // gitignore, not by per-path exception — the workspace .gitignore is the
  // single ignore authority here.
  includeIgnoreFile(join(thisDir, '.gitignore')),
  // The one tracked exception (hub precedent): the design system's
  // vanilla-JS theme runtime is a served asset in public/, byte-parity-tested
  // against the workspace package — served assets are not typed-lint sources.
  globalIgnores(['public/oak-theme.js']),
  // `configs.strict` is the TypeScript base (typescript-eslint parser +
  // strict rules); `configs.next` adds React + Next.js rules on top.
  ...configs.strict,
  ...configs.next,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
  },
  {
    // The owner's no-hardcoded-values invariant, TSX half (test-expert
    // ruling, 2026-07-29): the style ATTRIBUTE is banned outright — no
    // value allow-list to erode. Inline styles cap what a brand's
    // expression layer can transform (kit specimen HOOK-CLEAN CONTRACT);
    // the authored-CSS half is gated by tools/validate-authored-css.ts.
    // Deliberately a shallow tripwire: style values reached through a
    // variable or spread are not seen — those shapes simply do not appear
    // in this workspace, and review owns the residue.
    // NOTE: rule options REPLACE, never merge (oak-eslint shared.ts records
    // the trap), so the ExportAllDeclaration ban from `recommended` is
    // re-included here verbatim.
    files: ['**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            'Inline styles cap what a brand’s expression layer can transform (kit specimen HOOK-CLEAN CONTRACT). Move the declaration into app/globals.css as a single-class hook composed from token roles.',
        },
        {
          selector: "JSXElement[openingElement.name.name='style']",
          message:
            'Authored CSS in a style element bypasses both halves of the no-hardcoded-values instrument (the .css walk and the style-attribute ban). Author it in app/globals.css instead.',
        },
      ],
    },
  },
  {
    // The comparability invariant's structural gate (assurance-round
    // CC-1, 2026-08-09): a capture arm cannot shoot around the one
    // settle recipe — captureShot/captureElementShot in
    // @oaknational/fidelity-review/capture-settle are the only
    // sanctioned shutters, so "every arm settles identically" holds by
    // construction (two-sided: skipping the settle leaves no way to
    // shoot). Scoped to the ENUMERATED capture arms — other tools'
    // interaction waits and measurement shots are not capture evidence.
    // Rule options REPLACE, never merge, so the ExportAllDeclaration
    // ban from `recommended` is re-included verbatim.
    files: [
      'tools/capture-live-pages.ts',
      'tools/render-export-targets.ts',
      'tools/capture-shared.ts',
      'tools/capture-pair.ts',
      'tools/capture-null.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
        {
          selector: "CallExpression[callee.property.name='screenshot']",
          message:
            'Capture arms shoot through captureShot/captureElementShot (@oaknational/fidelity-review/capture-settle) — the shared settle is the comparability warrant behind every recorded disposition.',
        },
      ],
    },
  },
];
