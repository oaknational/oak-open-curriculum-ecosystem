/**
 * ESLint Configuration for oak-sdk-codegen
 *
 * Applies strict Oak standards plus SDK boundary rules that prevent
 * generation from importing runtime SDK concerns (ADR-108).
 */

import {
  configs,
  defineConfigArray,
  ignores,
  testRules,
  createImportResolverSettings,
  createSdkBoundaryRules,
} from '@oaknational/eslint-plugin-standards';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfigArray(
  {
    ignores: [
      ...ignores,
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      'test-cache/**',
      'src/generated/vocab/**',
      'src/vocab-data.ts',
    ],
  },

  configs.strict,
  {
    // The owner's ruling of 2026-09-08 on `no-throw-statement`: off where the
    // throw debt lives (this workspace), error everywhere else and in every new
    // workspace; the migration waits for the merge-back into the upstream. The
    // ruling is quoted in the plugin's configs/recommended.ts; the
    // no-throw-remediation plan owns the migration.
    rules: { '@oaknational/no-throw-statement': 'off' },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: thisDir }),
  },

  {
    files: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('generation'),
    },
  },
  // ADR-162 observability-first: require structured emission in newly
  // exported async functions. Rule is path-scoped internally to apps/**
  // and packages/sdks/**.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@oaknational/require-observability-emission': 'error',
    },
  },
  // ADR-088 Result pattern + ADR-162 engineering-axis: preserve caught
  // error context when throwing new errors inside catch blocks.
  //  Enforcement surface matches the observability emitter
  // surface because both are the same trust-boundary class — apps +
  // SDK runtime entry points; packages/core/* and packages/libs/* are
  // leaf layers whose error ergonomics differ. ESLint built-in rule
  // (added in 9.35.0) supersedes the originally planned custom
  // `require-error-cause` rule — the built-in is a documented superset
  // covering missing cause, cause-mismatch, destructured loss, and
  // variable shadowing. `requireCatchParameter: true` forbids no-param
  // catch blocks so every caught error is available as a cause.
  // See ADR-162 History 2026-04-19 addendum for the re-scoping
  // rationale and the opt-out protocol.
  {
    files: ['src/**/*.ts'],
    rules: {
      'preserve-caught-error': ['error', { requireCatchParameter: true }],
    },
  },

  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-*.ts',
      '**/__tests__/**',
    ],
    rules: {
      ...testRules,
    },
  },

  // All of these exceptions need removing now that the codegen workspace is separate
  {
    files: ['code-generation/**'],
    rules: {
      'no-restricted-properties': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-depth': 'off',
      complexity: 'off',
    },
  },

  // MCP-489: the widget address is one published value, the same on every
  // build (ADR-141, widget URI identity amendment). No typegen source reads
  // the environment, whichever file a read would move into. Tests run without
  // deployment variables, so no test sees an address that differs only on a
  // deployed build; the post-deploy UAT probes are that check.
  // The four selectors below ban the whole route rather than one spelling of
  // it: any reference to the identifier `process`, any static import of the
  // process module, any dynamic `import()`, and any `require()`. Between them
  // they reject `process.env`, `process['env']`, `process[key]`,
  // `const {env} = process`, `globalThis.process.env`,
  // `Reflect.get(process, 'env')`, `import {env} from 'node:process'`,
  // `import proc from 'process'`, `await import('node:process')` and
  // `require('node:process')`. An earlier pair of `MemberExpression`
  // selectors matched only the two dotted spellings, so the rest stayed green
  // (pull request 978, Copilot review).
  // `ImportExpression` and `require` are banned outright rather than by
  // module name, because a computed specifier — `import('node:' + 'proc' +
  // 'ess')` — defeats any name match. No typegen source loads a module
  // dynamically, so the whole construct is closed and the residual hole with
  // it.
  // A per-file rule value replaces the inherited one rather than merging, so
  // the ExportAllDeclaration selector from `recommended` is re-included. Test
  // files keep the test rules' own value.
  {
    files: ['code-generation/typegen/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
        {
          selector: 'ImportDeclaration[source.value=/^(node:)?process$/]',
          message:
            'Typegen sources read no environment, so generated constants such as the widget address are the same on every build. Importing the process module is a route to it (ADR-141, widget URI identity amendment, MCP-489).',
        },
        {
          selector: 'ImportExpression',
          message:
            'Typegen sources load every module statically, so a dynamic import here would be a route to the environment that no name-matching selector can close (ADR-141, widget URI identity amendment, MCP-489).',
        },
        {
          selector: 'CallExpression[callee.name="require"]',
          message:
            'Typegen sources load every module statically, so a require() here would be a route to the environment that no name-matching selector can close (ADR-141, widget URI identity amendment, MCP-489).',
        },
        {
          selector: 'Identifier[name="process"]',
          message:
            'Typegen sources read no environment, so generated constants such as the widget address are the same on every build. Every reference to `process` is banned here, computed and destructured access included (ADR-141, widget URI identity amendment, MCP-489).',
        },
      ],
    },
  },

  {
    files: ['code-generation/zodgen-core.ts'],
    rules: {
      'max-lines': 'off',
    },
  },

  {
    files: ['src/bulk/generators/analysis-report-generator.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },

  {
    files: ['src/bulk/generators/synonym-miner.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      complexity: 'off',
    },
  },

  {
    files: ['src/mcp/property-graph-data.ts', 'src/synonyms/maths.ts'],
    rules: {
      'max-lines': 'off',
    },
  },

  // The vocab-gen orchestrator still exceeds structural limits while the
  // remaining pipeline consolidation is in progress.
  {
    files: ['vocab-gen/vocab-gen.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      complexity: 'off',
    },
  },

  {
    files: ['src/types/generated/**'],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'no-restricted-properties': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      complexity: 'off',
      'max-statements': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-irregular-whitespace': 'off',
      curly: 'off',
    },
  },

  {
    files: ['e2e-tests/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);

export default config;
