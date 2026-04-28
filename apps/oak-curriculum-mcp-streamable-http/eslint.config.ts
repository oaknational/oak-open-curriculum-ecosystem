import {
  configs,
  appArchitectureRules,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import globals from 'globals';
import eslint from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

const thisDir = dirname(fileURLToPath(import.meta.url));
const widgetDir = fileURLToPath(new URL('./widget', import.meta.url));
const workspaceImportResolverSettings = createImportResolverSettings({
  project: thisDir,
});
const widgetImportResolverSettings = createImportResolverSettings({
  project: widgetDir,
});
const javaScriptRuleOverrides = Object.fromEntries(
  configs.strict
    .flatMap((config) => Object.keys(config.rules ?? {}))
    .filter((ruleName) => ruleName.startsWith('@typescript-eslint/'))
    .map((ruleName) => [ruleName, 'off']),
);
// const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfigArray(
  {
    ignores: [
      ...globalIgnores,
      'dist/**',
      '*.log',
      '.turbo/**',
      '.widget-build/**',
      '.logs/**',
      'temp-secrets/**',
      'smoke-tests/auth/**',
      '../../.agent/reference/**',
    ],
  },
  configs.strict,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        program: null,
        project: false,
        projectService: false,
      },
    },
    rules: {
      ...javaScriptRuleOverrides,
      ...tseslint.configs.disableTypeChecked.rules,
      ...eslint.configs.recommended.rules,
      ...importX.flatConfigs.recommended.rules,
    },
  },
  // no special ignores for vitest.e2e.config.ts; treat as config file below
  {
    files: ['**/*.ts', '**/*.d.mts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        // project: wsTsProject,
        tsconfigRootDir: thisDir,
        // Allow files not explicitly included in the project to still be linted
        // allowDefaultProject: true,
      },
    },
    settings: workspaceImportResolverSettings,
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      ...appArchitectureRules,
      'max-lines-per-function': ['error', { max: 50, skipComments: true, skipBlankLines: true }],
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
    files: ['operations/**/*.ts'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    // TODO: remove once config DI standardisation is complete (see .agent/plans/architecture/config-architecture-standardisation-plan.md)
    ignores: [
      '**/*.test.ts',
      '**/*.spec.ts',
      'operations/**',
      'smoke-tests/**',
      'e2e-tests/**',
      // Runtime composition root for Vercel's request handler import
      // contract. Like `src/index.ts`, this boundary legitimately
      // reads `process.env` once, then passes typed runtime config
      // into the app factory so the rest of the codebase stays under
      // env-library / DI policy.
      'src/server.ts',
      'src/index.ts',
      // Esbuild composition root invoked by Vercel Build Command via
      // `tsx`. process.env is the legitimate boundary-crossing read
      // (Vercel injects build env); the typed factories it calls
      // (`createSentryBuildPlugin`, `createMcpEsbuildOptions`) take
      // env as a parameter so all policy logic stays test-driven.
      // See ADR-163 §6 (amended by §L-8 WS3.1) and the file's module
      // TSDoc for the rationale.
      'esbuild.config.ts',
      // Repo-owned pre-preview build gate: reads process.env once, seeds
      // representative Vercel defaults, then shells into esbuild.config.ts.
      // The rest of the gate logic stays in pure helpers under
      // build-scripts/sentry-configured-build-gate.ts.
      'build-scripts/run-sentry-configured-build.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
          message:
            'Avoid using process.env directly. In product code use the runtime config provided by the env library instead. In test code pass simple values directly via DI.',
        },
      ],
    },
  },
  {
    files: ['widget/**/*.ts', 'widget/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: widgetImportResolverSettings,
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      ...appArchitectureRules,
      'max-lines-per-function': ['error', { max: 50, skipComments: true, skipBlankLines: true }],
    },
  },
  {
    files: ['widget/**/*.test.tsx', 'widget/**/*.test.ts'],
    rules: {
      ...testRules,
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      'max-lines-per-function': ['error', { max: 220, skipComments: true, skipBlankLines: true }],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      ...testRules,
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      'max-lines-per-function': ['error', { max: 220, skipComments: true, skipBlankLines: true }],
    },
  },
  {
    files: ['e2e-tests/**/*.test.ts'],
    rules: {
      'max-lines-per-function': ['error', { max: 300, skipComments: true, skipBlankLines: true }],
    },
  },
  {
    // Smoke tests are explicitly permitted real IO per ADR-161 (on-demand
    // pipeline, out of CI). The hermetic-test restrictions do not apply.
    files: ['smoke-tests/**/*.test.ts', '**/*.smoke.test.ts'],
    rules: {
      'no-restricted-syntax': 'off',
      'no-restricted-properties': 'off',
    },
  },
  {
    // Test-ceremony migration backlog (per
    // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`).
    // Each file listed here is a known violation of the hermetic-test
    // boundary rules — either importing a production factory it does not
    // test (runtime-config / http-observability) or using vi.mock /
    // vi.stubGlobal / vi.doMock. Delete a line as each file migrates.
    // Flip to empty allowlist at plan WS5 close.
    files: [
      // production-factory imports (not subject under test)
      'src/oauth-proxy/oauth-proxy-routes.integration.test.ts',
      'src/handlers-observability.integration.test.ts',
      'src/app/setup-error-handlers.integration.test.ts',
      'src/app/oauth-and-caching-setup.unit.test.ts',
      'src/app/bootstrap-helpers.unit.test.ts',
      'src/handlers-mcp-span.integration.test.ts',
      'src/asset-download/asset-download-route.integration.test.ts',
      'src/check-mcp-client-auth.di.integration.test.ts',
      'src/server-runtime.unit.test.ts',
      'src/tool-handler-with-auth.integration.test.ts',
      'src/handlers.integration.test.ts',
      // vi.mock family
      'src/auth/mcp-auth/mcp-auth-clerk.integration.test.ts',
      'src/correlation/middleware.integration.test.ts',
      'src/handlers-tool-registration.integration.test.ts',
      'src/observability/sentry-observability-delegates.unit.test.ts',
      'src/register-resources-observability.integration.test.ts',
    ],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
  {
    files: ['build-scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Esbuild composition root invoked by Vercel Build Command via `tsx`.
    // process.env is the legitimate boundary-crossing read (Vercel
    // injects build env), the typed factories `createSentryBuildPlugin`
    // and `createMcpEsbuildOptions` then take env as a parameter, and
    // console.* output is how Vercel's build log sees what the
    // composition root decided. See ADR-163 §6 (amended by §L-8 WS3.1)
    // and the file's module TSDoc.
    files: ['esbuild.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['scripts/**/*.ts', 'smoke-tests/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['operations/**/*.unit.test.ts', 'operations/**/*.integration.test.ts'],
    rules: {
      ...testRules,
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      'max-lines-per-function': ['error', { max: 220, skipComments: true, skipBlankLines: true }],
    },
  },
  {
    files: ['build-scripts/**/*.js', 'build-scripts/**/*.mjs'],
    rules: {
      complexity: 'off',
      'import-x/no-relative-parent-imports': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
    rules: {
      complexity: 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-console': 'off',
    },
  },
  {
    files: [
      '**/*.config.ts',
      'eslint.config.ts',
      'eslint.config.base.ts',
      'vitest.config.ts',
      'vitest.e2e.config.ts',
      'vitest.widget.config.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        // project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-array-delete': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-named-as-default-member': 'off',
      'max-lines-per-function': ['error', { max: 200, skipComments: true, skipBlankLines: true }],
      'max-lines': 'off',
      'no-restricted-properties': 'off',
    },
  },
);

export default config;
