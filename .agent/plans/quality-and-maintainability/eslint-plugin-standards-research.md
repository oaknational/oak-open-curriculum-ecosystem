# @oaknational/eslint-plugin-standards — Detailed Plan and Architecture

## Overview

This document describes the full plan for building the **@oaknational/eslint-plugin-standards** package — a reusable, modular ESLint plugin that encapsulates Oak National Academy's internal linting standards for TypeScript, React, and Next.js projects.

The goal is to create a **consistent, extensible foundation** for code quality and type-safety across multiple codebases, especially those integrating AI-driven or automated code generation workflows.

---

## 1. Package Purpose and Goals

### 🎯 Objectives

- Centralise ESLint standards in one shared plugin.
- Support multiple layers of configuration:
  - **`recommended`** → strict TypeScript baseline (no type checker required).
  - **`react`** → builds on `recommended`, adds React-specific rules.
  - **`next`** → builds on `react`, adds Next.js and framework-specific optimisations.
- Be future-proof for ESLint 9 and TypeScript ESLint 9.
- Maintain strong developer experience with type-safe configs and minimal boilerplate.

---

## 2. Folder Structure

```
eslint-plugin-standards/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts
│  ├─ configs/
│  │  ├─ typescript.ts
│  │  ├─ react.ts
│  │  └─ next.ts
│  └─ utils/
│     └─ shared.ts (optional for shared rules/constants)
└─ dist/ (build output)
```

---

## 3. `package.json` Template

```json
{
  "name": "@oaknational/eslint-plugin-standards",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "files": ["dist"],
  "exports": { ".": "./dist/index.js" },
  "peerDependencies": {
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint-plugin-import-x": "^4.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-plugin-sonarjs": "^3.0.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-next": "^14.0.0"
  },
  "devDependencies": { "typescript": "^5.6.0" }
}
```

---

## 4. TypeScript Base Config (`src/configs/typescript.ts`)

```ts
import { defineConfig } from 'eslint/config';
import base from '@eslint/js';
import { configs as tsEslintConfigs } from 'typescript-eslint';
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDir = path.dirname(fileURLToPath(import.meta.url));

export const typescriptConfig = defineConfig(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts', '**/*.typegen.ts', '**/coverage/**'],
  },
  base.configs.recommended,
  importX.flatConfigs.recommended,
  sonarjsConfigs.recommended,
  prettierRecommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.es2022 } },
  },
  ...tsEslintConfigs.recommended,
  ...tsEslintConfigs.stylistic,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
      'no-console': 'error',
      'no-debugger': 'error',
      curly: 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { projectService: true, tsconfigRootDir: baseDir },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
);
```

---

## 5. React Config (`src/configs/react.ts`)

```ts
import { defineConfig } from 'eslint/config';
import { typescriptConfig } from './typescript.js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export const reactConfig = defineConfig(
  ...typescriptConfig,
  react.configs.flat.recommended,
  reactHooks.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
```

---

## 6. Next.js Config (`src/configs/next.ts`)

```ts
import { defineConfig } from 'eslint/config';
import { reactConfig } from './react.js';
import nextPlugin from '@next/eslint-plugin-next';

export const nextConfig = defineConfig(...reactConfig, nextPlugin.configs.recommended, {
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
  },
});
```

---

## 7. Plugin Entrypoint (`src/index.ts`)

```ts
import { typescriptConfig } from './configs/typescript.js';
import { reactConfig } from './configs/react.js';
import { nextConfig } from './configs/next.js';

export const configs = {
  recommended: typescriptConfig,
  react: reactConfig,
  next: nextConfig,
};

export const rules = {};

export default { configs, rules };
```

---

## 8. Publishing and Usage

```bash
pnpm build
pnpm publish --access public
```

### In consuming projects

```bash
pnpm add -D @oaknational/eslint-plugin-standards
```

Then use it in ESLint:

```js
export default [
  { extends: ['plugin:@oaknational/standards/recommended'] },
  { extends: ['plugin:@oaknational/standards/react'] },
  { extends: ['plugin:@oaknational/standards/next'] },
];
```

---

## 9. Future Enhancements

- Add internal Oak-specific custom rules under `src/rules/`.
- Include project-specific presets (e.g. `ai`, `server`, `docs`).
- Add unit tests with `@eslint/plugin-utils` to validate configs.
- Remove `@ts-expect-error` once TS-ESLint v9 lands.

---

## 10. Summary

| Config        | Purpose                                   | Extends                                       |
| ------------- | ----------------------------------------- | --------------------------------------------- |
| `recommended` | Baseline TypeScript rules                 | `@eslint/js`, `typescript-eslint`, `prettier` |
| `react`       | Adds React/JSX rules and browser globals  | `recommended`                                 |
| `next`        | Adds Next.js plugin and performance rules | `react`                                       |
