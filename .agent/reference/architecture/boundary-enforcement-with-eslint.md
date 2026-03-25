# Enforcing Import Boundaries with ESLint and `eslint-plugin-import-x`

These notes show how to keep **bounded contexts** isolated, forbid “up‑ward” `../` imports, and expose **cross‑cutting concerns** (e.g. logging) only through a public API.

---

## 1. Example Project Layout

This is for illustration purposes only. You must adapt it to your own project layout and organisational philosophy.

```text
src/
  contexts/
    accounts/**    # bounded context A
    catalog/**     # bounded context B
    search/**      # bounded context C
  lib/
    logging/       # cross-cutting concern – public API in index.ts
      index.ts
      internal/**
  ui/**             # other layers (presentation etc.)
```

_Rule of thumb: anything under `src/contexts/_` must **not** import from any sibling context.\*

---

## 2. Key Rules

| Goal                                                                        | Rule                                                                                     | Why                                                                                             |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Block imports _between_ bounded contexts                                    | `import-x/no-restricted-paths` (zones)                                                   | Define **targets** that may **not** import from specific `from` paths.                          |
| Block `../` “up‑ward” imports                                               | `import-x/no-relative-parent-imports`                                                    | Stops code escaping its own directory tree.                                                     |
| Expose logging (or other cross‑cutting) **only** via its public entry‑point | `no-restricted-imports` with negation patterns <br>_(or)_ `import-x/no-internal-modules` | Prevents `@lib/logging/internal/*` deep‑imports; allows `@lib/logging` or `@lib/logging/index`. |
| Catch accidental package‑to‑package relative imports in a monorepo          | `import-x/no-relative-packages`                                                          | Encourages `@scope/pkg` instead of `../../pkg`.                                                 |
| Catch cyclic dependencies (optional)                                        | `import-x/no-cycle`                                                                      | Import cycles often appear when boundaries weaken.                                              |

_(All rules come from **eslint-plugin-import-x** except `no-restricted-imports`, which is a core ESLint rule; a TypeScript‑aware variant exists in `@typescript-eslint/no-restricted-imports`.)_

---

## 3. Example **flat-config** (`eslint.config.js`)

```js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { importX } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      // Make import-x understand TS path aliases / workspaces
      'import/resolver': createTypeScriptImportResolver({
        project: true,
        alwaysTryTypes: true,
      }),
    },
    rules: {
      /* 1) No up‑ward imports */
      'import-x/no-relative-parent-imports': 'error',

      /* 2) Keep contexts isolated */
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // Accounts ↔ Catalog ↔ Search isolation
            {
              target: 'src/contexts/accounts/**',
              from: ['src/contexts/catalog/**', 'src/contexts/search/**'],
            },
            {
              target: 'src/contexts/catalog/**',
              from: ['src/contexts/accounts/**', 'src/contexts/search/**'],
            },
            {
              target: 'src/contexts/search/**',
              from: ['src/contexts/accounts/**', 'src/contexts/catalog/**'],
            },
          ],
        },
      ],

      /* 3) Public‑API‑only logging */
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@lib/logging/*', // block deep paths
            '!@lib/logging', // allow root
            '!@lib/logging/index', // allow explicit index
          ],
        },
      ],

      /* 4) Monorepo hygiene */
      'import-x/no-relative-packages': 'error',

      /* 5) Safety nets */
      'import-x/no-cycle': ['warn', { ignoreExternal: true }],
      'import-x/no-unresolved': 'error',
      'import-x/no-extraneous-dependencies': 'error',
    },

    overrides: [
      // Inside logging package: still forbid up‑ward imports
      {
        files: ['src/lib/logging/**'],
        rules: { 'import-x/no-relative-parent-imports': 'error' },
      },
      // Tests often need broader access – relax as needed
      {
        files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**'],
        rules: { 'import-x/no-restricted-paths': 'off' },
      },
    ],
  },
];
```

> **Tip**: If you have dozens of contexts, generate the `zones` array with a small script to keep this config readable.

---

## 4. Pass / Fail Examples

| Import Statement                                                                              | From where?      | Result          | Why                                                                                        |
| --------------------------------------------------------------------------------------------- | ---------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `import { log } from '@lib/logging'`                                                          | anywhere         | ✅ **OK**       | Uses the public API.                                                                       |
| `import { write } from '@lib/logging/internal/adapter'`                                       | anywhere         | ❌ **Error**    | Deep import blocked by `no-restricted-imports`.                                            |
| `import { foo } from '@contexts/catalog/domain'`<br>inside `src/contexts/accounts/service.ts` | Accounts context | ❌ **Error**    | Cross‑context import blocked by zone.                                                      |
| `import bar from '../some/parent/module'`                                                     | any file         | ❌ **Error**    | Up‑ward import blocked.                                                                    |
| `import type { Adapter } from '@lib/logging/internal'`                                        | any file         | ✅/❌ depending | Allow if you switch to `@typescript-eslint/no-restricted-imports` with `allowTypeImports`. |

---

## 5. Variations & Scaling Tips

- **Generating zones** – loop through `src/contexts/*` and emit a symmetric matrix of “cannot import” pairs.
- **Type‑only deep imports** – replace the core rule with `@typescript-eslint/no-restricted-imports` and set `allowTypeImports: true` per pattern when you want to allow type‑only exceptions.
- **Resolvers** – if `no-relative-parent-imports` misreads path aliases as `../`, check your resolver config and `tsconfig`.
- **Monorepo** – use `import-x/no-relative-packages` to stop sneaky `../../other-pkg` imports when the proper package name exists.

---

## 6. Installation & Usage

```bash
pnpm add -D   eslint @eslint/js eslint-plugin-import-x   @typescript-eslint/parser eslint-import-resolver-typescript
# (or npm / yarn)
```

Run ESLint:

```bash
pnpm eslint .
```

---

### Further Reading

- **eslint-plugin-import‑x** — <https://github.com/import-js/eslint-plugin-import-x>
- **Zones docs** (`no-restricted-paths`) — <https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-restricted-paths.md>
- **`no-relative-parent-imports`** — <https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-relative-parent-imports.md>
- **Core `no-restricted-imports`** — <https://eslint.org/docs/latest/rules/no-restricted-imports>
- **TypeScript variant** — <https://typescript-eslint.io/rules/no-restricted-imports/>
