/**
 * ESLint configuration for the Curriculum Hub demo (Next.js + React).
 *
 * Consumes the shared next + strict configs from the oak-eslint standards
 * plugin (Next.js + React + TypeScript). `next lint` is deprecated in Next 16,
 * so this workspace lints with ESLint directly via `eslint .`.
 *
 * The demo is ordinary repo code held to the repo's full strict ruleset —
 * no rule relaxations, no per-path exemptions. Linting scope is the tracked
 * repo files: untracked vendor reference data and regenerable output sit
 * outside the lint corpus via gitignore-awareness (see below), not via
 * per-path exceptions.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globalIgnores, includeIgnoreFile } from 'eslint/config';
import { configs } from '@oaknational/eslint-plugin-standards';

const thisDir = dirname(fileURLToPath(import.meta.url));

export default [
  // Owner-ratified 2026-07-02: linting scope = tracked repo files; untracked
  // vendor reference data and regenerable output are outside the lint corpus
  // by gitignore, not by per-path exception.
  includeIgnoreFile(join(thisDir, '.gitignore')),
  // Build outputs, plus the design system's vanilla-JS theme runtime: tracked
  // as a served asset in public/ (byte-parity with the workspace package is
  // gated by demos/oak-design-showcase/tools/validate-kit-assets.ts, in the
  // root repo-validators:check chain); served assets are not typed-lint
  // sources.
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'node_modules/**', 'public/oak-theme.js']),
  // `configs.strict` is the TypeScript base (typescript-eslint parser + strict
  // rules); `configs.next` adds React + Next.js rules on top (react-only, no
  // parser). Both are needed for a TS + React workspace.
  ...configs.strict,
  ...configs.next,
  {
    // One block (and one projectService options object — the service is
    // created once per run, from the first options it sees) covering every
    // lintable source kind. postcss.config.mjs is tracked source and stays in
    // the lint corpus under the full ruleset; it sits outside the tsconfig
    // project (no allowJs), so the type-aware rules get their type
    // information from the project service's default project instead —
    // inclusion, not exemption.
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: thisDir,
      },
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
      'tools/capture-live-demo.ts',
      'tools/capture-live-sections.ts',
      'tools/render-canonical-targets.ts',
      'tools/drive-export-sections.ts',
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
