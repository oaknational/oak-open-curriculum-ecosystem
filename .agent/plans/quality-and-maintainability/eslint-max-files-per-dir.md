# Enforcing Directory Focus with ESLint: `max-files-per-dir` (ESLint v9)

**Purpose:** prevent “junk‑drawer” folders by enforcing a **maximum number of files** in any one directory (non‑recursive).  
**Defaults:** count _all_ files (`*`), ignore common build/vendor folders, and report when a directory exceeds **8** files.

---

## Why this plugin?

Large, catch‑all directories are a design smell: they blur domain boundaries, slow navigation, and make “where should this go?” a daily tax. Most teams already enforce limits **inside** files (cyclomatic complexity, max lines per file, max lines per function). But **nothing stops a folder from ballooning** into a hundred tiny, loosely related files. A simple “max files per folder” constraint nudges code toward clearer modular seams—split by feature, layer, or domain—without prescribing a specific architecture.

This rule is intentionally **scope‑agnostic**: it looks only at the **immediate files** in each directory (no subdirectories), with a configurable include glob (`*` by default).

---

## How it complements complexity & size rules

- **Cyclomatic complexity (`complexity`)** curbs in‑function branching, but a directory can still accumulate a maze of small “simple” files. This rule applies **across files**, encouraging teams to extract new feature folders when a folder grows past the threshold.
- **Max lines per file (`max-lines`)** and **max lines per function (`max-lines-per-function`)** reduce “blob” files; **max files per dir** reduces **“blob directories.”** Used together, they steer code toward small files **clustered in small, purposeful folders**.
- **Max depth (`max-depth`)** tames nested control flow; **max files per dir** tames **cross‑file sprawl**. When a folder breaches the limit, treat it as a signal to create a new module/folder (e.g., split `utils/` into `string/`, `date/`, `id/`).

> This plugin is a _structural_ guard‑rail that works alongside the micro‑level limits you already use.

---

## Rule behavior (what it does)

- **Counts files in the current file’s directory** only (non‑recursive).
- **Matches by glob** (`pattern`, default `*`) to decide which files to count.
- **Ignores directories** you specify (`ignoreDirs`), defaulting to common generated/vendor folders (examples below).
  > ESLint already globally ignores `**/node_modules/` and `.git/` unless you unignore them—your plugin options let you add more, like `dist/`, `build/`, etc.
- **Reports once per directory**, even though ESLint runs rules per file (see the “anchor file” pattern below).

### Options (with sensible defaults)

```ts
type Options = [
  {
    /** Glob for files to count in each directory. Defaults to "*" (all files). */
    pattern?: string;
    /** Maximum allowed files in a directory. Defaults to 8. */
    maxFiles?: number;
    /**
     * Directory patterns to ignore (globbed against the directory path
     * relative to the repo root). Defaults include vendor/build folders.
     */
    ignoreDirs?: string[];
  },
];
```

**Defaults** (you can tailor these per‑repo):

- `pattern: "*"` — count all files
- `maxFiles: 8`
- `ignoreDirs:`  
  `["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**", "**/.git/**"]`

---

## High‑level design

1. For the file being linted, derive its **directory path** using `context.filename` (ESLint v9 property).
2. **Skip** if that directory matches an ignored pattern (relative to the lint run’s `cwd`, available at `context.cwd`).
3. `fs.readdirSync(dir, { withFileTypes: true })` → **filter to files** (exclude subdirectories).
4. **Glob‑filter** those filenames using `minimatch` (default to `*`).
5. If the number of matched files **exceeds `maxFiles`**, report a single diagnostic for that directory.
6. **Report once per directory** by choosing an **anchor file**: the alphabetically first matched filename. Only that file’s lint pass emits the report.

Why anchor files? Rules run per file, and runs may be parallelized. Using a deterministic anchor avoids cross‑process state, duplicate reads, and duplicate reports.

---

## TypeScript implementation (ESLint v9, flat config)

> The examples below assume **ESM** output and ESLint v9’s **flat config**.

### `src/rules/max-files-per-dir.ts`

```ts
import fs from 'node:fs';
import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Rule } from 'eslint';

type Options = [
  {
    /** Glob for files to count (relative to each directory). Defaults to "*" */
    pattern?: string;
    /** Maximum allowed files in a directory. Defaults to 8 */
    maxFiles?: number;
    /**
     * Directory patterns to ignore (match against path relative to cwd).
     * Defaults include node_modules, dist, build, coverage, .git.
     */
    ignoreDirs?: string[];
  },
];

type MessageIds = 'tooManyFiles';

function toPosix(p: string) {
  return p.split(path.sep).join('/');
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a maximum number of files in a directory (non-recursive).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: { type: 'string' },
          maxFiles: { type: 'integer', minimum: 1 },
          ignoreDirs: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    // ESLint v9 will merge user options on top of these:
    defaultOptions: [
      {
        pattern: '*',
        maxFiles: 8,
        ignoreDirs: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/coverage/**',
          '**/.git/**',
        ],
      },
    ],
    messages: {
      tooManyFiles:
        '{{dir}} contains {{actual}} files matching "{{pattern}}", exceeding max {{max}}.',
    },
  },

  create(context) {
    // Merged with defaults by ESLint v9 when meta.defaultOptions is present
    const [{ pattern = '*', maxFiles = 8, ignoreDirs = [] } = {}] = context.options as Options;

    // Prefer physical path when processors might change virtual filenames
    const filePath = (context as any).physicalFilename ?? context.filename;
    if (!filePath) return {};

    const dirPath = path.dirname(filePath);
    const cwd = (context as any).cwd ?? process.cwd();
    const relDir = toPosix(path.relative(cwd, dirPath)) || '.';

    // Ignore configured directories (match against repo-relative dir path)
    if (ignoreDirs.some((glob) => minimatch(relDir, glob, { dot: true }))) {
      return {};
    }

    return {
      Program(node) {
        let entries: fs.Dirent[];
        try {
          entries = fs.readdirSync(dirPath, { withFileTypes: true });
        } catch {
          // Virtual file or directory not on disk; ignore gracefully.
          return;
        }

        const files = entries.filter((e) => e.isFile()).map((e) => e.name);
        const matched = files.filter((name) => minimatch(name, pattern, { dot: true })).sort();

        const actual = matched.length;
        if (actual <= maxFiles) return;

        // Report once per directory: only the alphabetically-first matched file reports
        const base = path.basename(filePath);
        if (base !== matched[0]) return;

        context.report({
          node,
          messageId: 'tooManyFiles',
          data: { dir: relDir, actual: String(actual), pattern, max: String(maxFiles) },
        });
      },
    };
  },
};

export default rule;
```

### `src/index.ts` (plugin entry)

```ts
import maxFilesPerDir from './rules/max-files-per-dir.js';

const plugin = {
  meta: {
    name: '@acme/eslint-plugin-structure',
    version: '0.1.0',
  },
  rules: {
    'max-files-per-dir': maxFilesPerDir,
  },
};

export default plugin;
```

### `package.json` (ESM, Node ≥ 18, ESLint v9 peer)

```json
{
  "name": "@acme/eslint-plugin-structure",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "peerDependencies": {
    "eslint": "^9.0.0"
  },
  "dependencies": {
    "minimatch": "^10.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^20.0.0"
  },
  "engines": { "node": ">=18.18" }
}
```

### `tsconfig.json` (NodeNext ESM)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Consumer setup (flat config)

```js
// eslint.config.js in the consuming project
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import structure from '@acme/eslint-plugin-structure';

export default defineConfig([
  // Add any global ignore globs (on top of defaults: **/node_modules/, .git/)
  globalIgnores(['**/dist/**', '**/coverage/**']),

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { structure },
    rules: {
      // Use defaults: pattern="*", maxFiles=8, ignoreDirs as in rule
      'structure/max-files-per-dir': 'error',

      // Or customize:
      // "structure/max-files-per-dir": ["error", {
      //   maxFiles: 12,
      //   pattern: "*.ts",
      //   ignoreDirs: ["**/dist/**", "**/scripts/**"]
      // }],
    },
  },
]);
```

---

## Testing the rule

Use `@typescript-eslint/rule-tester` (a typed wrapper around ESLint’s `RuleTester`) to write deterministic, framework‑agnostic tests.

```ts
// tests/max-files-per-dir.test.ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../src/rules/max-files-per-dir.js';

// If your test runner doesn't install globals, wire them up once:
// import * as test from "node:test";
// RuleTester.afterAll = test.after; RuleTester.describe = test.describe; RuleTester.it = test.it;

const rt = new RuleTester();

function withTmpDir(setup: (dir: string) => string[]) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'max-files-'));
  const files = setup(tmp);
  return {
    dir: tmp,
    files,
    cleanup: () => fs.rmSync(tmp, { recursive: true, force: true }),
  };
}

rt.run('max-files-per-dir', rule as any, {
  valid: [
    (() => {
      const { dir, cleanup } = withTmpDir((d) => {
        fs.writeFileSync(path.join(d, 'a.ts'), 'export {};');
        fs.writeFileSync(path.join(d, 'b.ts'), 'export {};');
        fs.writeFileSync(path.join(d, 'c.ts'), 'export {};');
        return ['a.ts', 'b.ts', 'c.ts'];
      });
      const t = {
        filename: path.join(dir, 'a.ts'),
        code: 'export {};',
        options: [{ maxFiles: 8, pattern: '*.ts' }],
        after: cleanup,
      };
      return t;
    })(),
  ],
  invalid: [
    (() => {
      const { dir, cleanup } = withTmpDir((d) => {
        for (let i = 0; i < 10; i++) {
          fs.writeFileSync(path.join(d, `f${i}.ts`), 'export {};');
        }
        return [];
      });
      const t = {
        // Report anchors on alphabetical first matched file
        filename: path.join(dir, 'f0.ts'),
        code: 'export {};',
        options: [{ maxFiles: 8, pattern: '*.ts' }],
        errors: [{ messageId: 'tooManyFiles' }],
        after: cleanup,
      };
      return t;
    })(),
  ],
});
```

---

## Operational guidance

- **Start with a warning** at 8–12 to uncover hotspots (`utils/`, `components/`, `api/`). Stabilize and then **tighten to error** at 8.
- **Pair with**: `complexity`, `max-depth`, `max-lines`, `max-lines-per-function` to keep both _within‑file_ complexity and _cross‑file_ sprawl in check.
- **Ignore generated content** (e.g., SDKs, codegen, build outputs) via rule `ignoreDirs` or flat config `globalIgnores([...])`.
- **Don’t count subfolders:** if a sub‑area grows, create a new **feature folder**—that’s the behavior this rule encourages.

### Performance notes

- Reading a single directory is cheap; using an **anchor file** ensures we only report once per folder.
- Keep the include glob simple. The default `*` is fast; complex globs are evaluated with `minimatch`.

### Limitations

- **Parallel linting:** the anchor strategy avoids duplicates without shared state.
- **Symlinks:** `Dirent.isFile()` decides whether a symlink is counted as a file; adapt if your repo relies on linked sources.
- **Monorepos:** configure different thresholds per package by scoping the rule in separate `files` blocks.

---

## References & further reading

- ESLint v9: context properties (`context.filename`, `context.cwd`, etc.) — _ESLint v8.40 release notes_  
  https://eslint.org/blog/2023/05/eslint-v8.40.0-released/
- Preparing custom rules for ESLint v9 (API changes)  
  https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/
- Plugin migration & recommended plugin structure for flat config  
  https://eslint.org/docs/latest/extend/plugin-migration-flat-config
- Flat config ignores & `globalIgnores()`  
  https://eslint.org/docs/latest/use/configure/ignore
- Rule testing with `@typescript-eslint/rule-tester`  
  https://typescript-eslint.io/packages/rule-tester/
