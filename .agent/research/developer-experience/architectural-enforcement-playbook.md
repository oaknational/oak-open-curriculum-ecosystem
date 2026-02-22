# Architectural Enforcement Playbook

This playbook defines a comprehensive, battle-tested system designed to prevent architectural decay, spaghetti dependencies, and monolith "God folders" in medium-to-large-scale TypeScript projects.

Instead of relying on human vigilance, this model uses a combination of explicit physical constraints, static analysis tools, and AI agent guardrails to enforce a **Domain-Driven, Modulithic Architecture**.

---

## 1. The Core Philosophy: Maximize Signal

The defining principle of this setup is **Maximized Signal over Suppressed Noise**. When a project scales, developers (and AI agents) tend to bypass architectural rules for expediency. They write suppressions, ignore directories, or disable rules because "it's too hard to fix right now."
This playbook reverses that pattern. We remove the exceptions, expose the drift, and strictly enforce the boundaries before code is committed.

---

## 2. The Tech Stack & Responsibilities

The system requires an interconnected suite of 4 tools alongside custom AI agent constraints:

| Component / Tool | Responsibility | Why it's Critical |
| :--- | :--- | :--- |
| **Custom ESLint (`max-files-per-dir`)** | **The Driver:** Enforces physical modularization. | Prevents "God Folders". Forces logical subdivision when a directory grows past ~10 source files. |
| **`eslint-plugin-boundaries`** | **The Director:** Enforces unidirectional data flow. | Prevents architectural cycles (e.g. Writers importing Parsers). It ensures the high-level layers of the application communicate in only one designated direction. |
| **`dependency-cruiser`** | **The Guardrail:** Enforces strict domain dependencies and barrel file boundaries. | Once folders are split by the ESLint rule, this prevents them from importing each other's internals haphazardly. |
| **`knip`** | **The Optimizer:** Detects dead code, unused exports, and unlisted dependencies. | Refactoring heavily leaves dead code behind. With strict barrel-file boundaries, `knip` proves internal functions are actually used. |
| **`madge`** | **The Assessor:** Visualizes graphs and warns on circular dependencies/orphans. | Essential fallback visualization when dependency-cruiser rejects a circular dependency and you need to untangle it. |

---

## 3. Installation

To set up the tools, install the following packages in your project:

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-boundaries
pnpm add -D dependency-cruiser
pnpm add -D knip
pnpm add -D madge
```

---

## 4. Implementation Playbook (Step-by-Step)

### Phase 1: Applying the "Pain Provider" (File Count Limits)

When introducing this to a new repo, start by turning on the physical constraints. This uses a custom ESLint rule that forces developers to create modular directories instead of single massive folders.

**1. Create the Custom ESLint Rule**

Create a file named `eslint-rules/max-files-per-dir.ts`:

```typescript
import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import fs from 'node:fs';
import path from 'node:path';

const dirFileCache = new Map<string, string[]>();
const createRule = ESLintUtils.RuleCreator(() => `https://github.com/your-org/your-repo`);

function getSortedFilesForDirectory(dirPath: string, ignoreSuffixes: string[]): string[] {
  const cacheKey = `${dirPath}::${ignoreSuffixes.join(',')}`;
  if (dirFileCache.has(cacheKey)) return dirFileCache.get(cacheKey) ?? [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name.match(/\.(ts|tsx|js)$/))
      .filter((entry) => !ignoreSuffixes.some((suffix) => entry.name.endsWith(suffix)))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    dirFileCache.set(cacheKey, files);
    return files;
  } catch {
    dirFileCache.set(cacheKey, []);
    return [];
  }
}

export const maxFilesPerDir = createRule({
  name: 'max-files-per-dir',
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce a maximum number of files per directory to encourage modularity.' },
    messages: {
      directoryComplexitySupportive: 'Directory "{{dirName}}" has grown to {{actual}} files (limit: {{max}}), indicating it might represent multiple sub-domains. Consider extracting cohesive modules into subdirectories.',
    },
    schema: [{
      type: 'object',
      properties: {
        maxFiles: { type: 'number', minimum: 1 },
        ignoreSuffixes: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
  },
  defaultOptions: [{ maxFiles: 8, ignoreSuffixes: ['.test.ts', '.spec.ts', '.d.ts', '.map', 'index.ts'] }],
  create(context) {
    const currentFilePath = context.filename || context.physicalFilename;
    if (!currentFilePath || currentFilePath === '<input>') return {};

    const dirPath = path.dirname(currentFilePath);
    const fileName = path.basename(currentFilePath);
    const options = context.options[0] ?? { maxFiles: 8, ignoreSuffixes: ['.test.ts', '.spec.ts', '.d.ts', '.map', 'index.ts'] };

    return {
      Program(node: TSESTree.Program): void {
        const sortedFiles = getSortedFilesForDirectory(dirPath, options.ignoreSuffixes ?? []);
        if (sortedFiles.length <= options.maxFiles) return;

        // Anchor File Pattern: Only report the error on the very first file alphabetically.
        if (sortedFiles.length > 0 && sortedFiles[0] === fileName) {
          context.report({
            node,
            messageId: 'directoryComplexitySupportive',
            data: { dirName: path.basename(dirPath), actual: sortedFiles.length, max: options.maxFiles },
          });
        }
      },
    };
  },
});
```

**2. Configure your `eslint.config.ts`**

Register the custom plugin and set the threshold low (e.g., 8-12).

```typescript
import { maxFilesPerDir } from './eslint-rules/max-files-per-dir.js';

export default [
  // ... your other configs
  {
    files: ['src/**/*.ts'],
    plugins: {
      local: {
        rules: {
          'max-files-per-dir': maxFilesPerDir,
        },
      },
    },
    rules: {
      'local/max-files-per-dir': ['error', { maxFiles: 10, ignoreSuffixes: ['.test.ts', '.spec.ts', 'index.ts'] }],
    },
  },
];
```

_Result:_ The project will immediately fail linting on its largest directories. You are now forced to analyze the folder, identify the implicit domains within it, and extract them into sub-directories.

### Phase 2: Directing the Flow (`eslint-plugin-boundaries`)

Once directories are split, you must define how they are allowed to interact at a high level.

**1. Define the Flow in `eslint.config.ts`**

Map file paths to semantic architectural layers (e.g., `shared`, `domain-a`, `domain-b`) and enforce unidirectional dependencies.

```typescript
import eslintPluginBoundaries from 'eslint-plugin-boundaries';

export default [
  // ...
  {
    files: ['src/**/*.ts'],
    plugins: { boundaries: eslintPluginBoundaries },
    settings: {
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**/*' },
        { type: 'parsers', pattern: 'src/parsers/**/*' },
        { type: 'writers', pattern: 'src/writers/**/*' },
        { type: 'core', pattern: 'src/core/**/*' },
      ],
      'boundaries/include': ['src/**/*.ts'],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'shared', allow: ['shared'] },
            { from: 'core', allow: ['core', 'shared'] },
            { from: 'parsers', allow: ['parsers', 'core', 'shared'] },
            { from: 'writers', allow: ['writers', 'core', 'shared'] },
            // Notice: parsers cannot import writers, and writers cannot import parsers.
          ],
        },
      ],
    },
  }
];
```

### Phase 3: Locking the Boundaries (Dependency-Cruiser)

Breaking up a large directory into three smaller directories is useless if they all intimately import each other's internals (e.g., `moduleA/internal.ts` importing `moduleB/helper.ts`).

1. **Mandate Barrel Files:** Every sub-domain MUST have an `index.ts` file acting as its public API.
2. **Configure `.dependency-cruiser.cjs`:**

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'encapsulate-parsers',
      severity: 'error',
      comment: 'Parser internals MUST only be accessed via their specific index.ts barrel files.',
      from: { pathNot: '^src/parsers/' },
      to: {
        path: '^src/parsers/.+',
        pathNot: '^src/parsers/[^/]+/index\\.(ts|js)$',
      },
    },
    {
      name: 'encapsulate-writers',
      severity: 'error',
      comment: 'Writer internals MUST only be accessed via their specific index.ts barrel files.',
      from: { pathNot: '^src/writers/' },
      to: {
        path: '^src/writers/.+',
        pathNot: '^src/writers/[^/]+/index\\.(ts|js)$',
      },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are forbidden.',
      from: {},
      to: { circular: true },
    }
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' }
  }
};
```

_Result:_ The build will fail if any domain imports an internal file (`foo.ts`) of another domain instead of its public `index.ts`. All inter-domain traffic must formally traverse barrel files.

### Phase 4: The Cleanup (Knip & Madge)

After massive restructuring, the codebase will be littered with abandoned implementations and over-exported functions. Because `dependency-cruiser` forced all inter-domain traffic through barrels, any function not exported by a barrel, and not used by a sibling inside the same folder, is easily identifiable as dead code.

**1. Configure `knip.ts`**

```typescript
/** @type {import('knip').KnipConfig} */
const config = {
  entry: ['src/index.ts', 'src/cli.ts', 'tests/**/*.test.ts'],
  project: ['src/**/*.ts'],
  ignoreBinaries: ['eslint', 'madge', 'dependency-cruiser'],
};

export default config;
```

**2. Configure `package.json` Scripts**

Bring the entire suite together into a Definition of Done script block:

```json
"scripts": {
  "lint": "eslint .",
  "type-check": "tsc --noEmit",
  "test": "vitest run",
  "knip": "knip",
  "depcruise": "depcruise src --config .dependency-cruiser.cjs",
  "madge:circular": "madge --circular --warning --extensions ts src/**/*",
  "madge:orphans": "madge --orphans --warning --extensions ts src/**/*",
  "qg": "pnpm type-check && pnpm lint && pnpm test && pnpm depcruise && pnpm knip && pnpm madge:circular"
}
```

---

## 5. Agentic Guardrails (The AI Layer)

AI coding assistants are highly effective at implementation but naturally prone to architectural degradation if unguided. To make this playbook work autonomously, you must provide the agent with rigid, unavoidable system constraints.

### 1. The Directives

You must instantiate explicit markdown directives that the agent reads automatically. Example: `.agent/directives/RULES.md`

> **Rule:** Maximize signal. Do not disable linters. If a file is too large, use the 'Extract -> Test -> Compose' pattern to break it apart.

Create `.agent/directives/architectural-file-system-structure.md`:

> Define the exact hierarchy of domains (e.g., `parsers`, `ir`, `writers`, `shared`) so the agent never guesses where a new utility belongs.

### 2. The Definition of Done

The single most important agent mechanism is the synchronous Quality Gate.

- Mandate in a `DEFINITION_OF_DONE.md` file that the agent _must_ run `pnpm qg` and verify it exits with `0` before completing a task.
- Because the quality gate contains the ESLint file limit and the dependency-cruiser boundary checks, **the agent cannot cheat**. If it writes an 11th file into a directory, `pnpm qg` fails, and the agent must autonomously refactor its own work.

---

## Conclusion & Benefits

By following this playbook, you create an environment where the architecture actively fights its own decay.

- You eliminate the need for endless code-reviews arguing about where a file should go; the linters reject it if it breaks the graph.
- You eliminate 2000-line god-files; the linter forces the AI to create modular, composed functions.
- You achieve near 100% test coverage naturally, because small, isolated modules are trivially easy to unit test.
- And most importantly, you harness the AI agent's immense refactoring capability to maintain absolute architectural purity, rather than degrading it.
