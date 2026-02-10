---
name: Search Workspace Tidy-Up
overview: "Clean up the semantic search workspace before SDK extraction: delete dead code, centralise all process.env access in env.ts with zero exemptions, add ESLint enforcement, fix tests to use DI, and fix the misleading scripts/README."
todos:
  - id: delete-dead-code
    content: Delete semantic-reranking/, discover-lessons.ts, migrate-transcript-cache.ts; update referencing docs
    status: completed
  - id: fix-scripts-readme
    content: Rewrite scripts/README.md to correctly document the 3 active scripts
    status: completed
  - id: eslint-rule
    content: Add no-restricted-syntax rule for process.env to eslint.config.ts (only env.ts exempt)
    status: completed
  - id: refactor-env-di
    content: Make env() accept optional raw env param; refactor cli-commands, suggestions, reset-ttls, verify-ingestion to use DI
    status: completed
  - id: fix-tests-di
    content: Fix 3 test files to use DI instead of process.env mutations
    status: completed
  - id: fix-scripts-env
    content: Fix scripts/ and operations/ to call env() instead of process.env directly
    status: completed
  - id: gitignore-diagnostics
    content: Add diagnostics/ to .gitignore
    status: completed
  - id: quality-gates
    content: Run full quality gates, commit, push
    status: completed
isProject: false
---

# Search Workspace Tidy-Up

Pre-SDK-extraction cleanup of `apps/oak-open-curriculum-semantic-search/`. Zero exemptions from the `process.env` rule -- env.ts is the ONLY file that touches `process.env`. Everything else uses DI.

---

## Guiding principle

From [rules.md](.agent/directives-and-memory/rules.md):

> Environment variables MUST be read once at the entry point, then passed as configuration through the call stack. Product code MUST NOT read `process.env` directly.

From [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md):

> NEVER manipulate global state in tests -- no `process.env` mutations, no `vi.stubGlobal`, no `vi.doMock`. Product code must accept configuration as parameters.

---

## 1. Delete dead code

**Safe to delete (no active imports, no pnpm scripts):**

- `evaluation/experiments/historical/semantic-reranking/` (5 files) -- rejected experiment, no active references. Update `evaluation/experiments/README.md`.
- `operations/ingestion/discover-lessons.ts` -- unused utility, no pnpm script. Update `operations/ingestion/README.md`.
- `scripts/migrate-transcript-cache.ts` -- one-off Redis migration, no pnpm script. Update `src/adapters/sdk-cache/README.md`.

**verify-ingestion.ts -- keep but fix:**

Has active references: `package.json` script `ingest:verify`, `docs/INGESTION-GUIDE.md`, `operations/ingestion/README.md`, ADR-069, and a unit test. Keep it, but fix the rogue ES Client creation and direct `process.env` reads (see section 4).

---

## 2. Fix scripts/README.md

The README claims the entire directory is deprecated. 3 scripts were never migrated and remain active:

- `download-bulk.ts` -- `pnpm bulk:download`, referenced by 7 docs
- `diagnose-elser-failures.ts` -- `pnpm diagnose:elser`
- `analyze-elser-failures.ts` -- `pnpm analyze:elser`

Rewrite to document the 3 active scripts, keep the migration table as history, note what was deleted.

---

## 3. ESLint rule -- NO exemptions

Add `no-restricted-syntax` to [eslint.config.ts](apps/oak-open-curriculum-semantic-search/eslint.config.ts). Only `src/lib/env.ts` is exempt -- it is the single file that reads `process.env`.

```typescript
{
  files: ['**/*.ts'],
  ignores: ['src/lib/env.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
        message:
          'process.env is forbidden. Use env() from src/lib/env.ts in entry points, or accept config as a parameter.',
      },
    ],
  },
},
```

This applies everywhere: `src/`, `scripts/`, `operations/`, `evaluation/`, and tests. The only escape hatch is `env.ts`.

---

## 4. Refactor product code for DI

### 4a. Make env() accept an optional raw env parameter

In [src/lib/env.ts](apps/oak-open-curriculum-semantic-search/src/lib/env.ts), change:

```typescript
// Before
export function env(): EnvResult {
  return parseEnv(readProcessEnv());
}

// After
export function env(
  rawEnv: Record<string, string | undefined> = readProcessEnv(),
): EnvResult {
  return parseEnv(rawEnv);
}
```

This enables tests to call `env({ ELASTICSEARCH_URL: '...', ... })` without touching `process.env`. Also export `parseEnv` for direct unit testing.

### 4b. Fix src/lib/elasticsearch/setup/cli-commands.ts

Three functions (`executeStatusCommand`, `executeSetupOrResetCommand`, `executeSynonymsCommand`) all read `process.env.ELASTICSEARCH_URL` and `process.env.ELASTICSEARCH_API_KEY` directly. They already build an `ElasticsearchConfig` object and pass it down. Change them to accept config as a parameter:

```typescript
// Before
export async function executeStatusCommand(verbose: boolean): Promise<number> {
  const esUrl = process.env.ELASTICSEARCH_URL;
  ...

// After -- accept env, caller passes env()
export async function executeStatusCommand(
  config: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  verbose: boolean,
): Promise<number> {
  ...
```

The CLI entry point (`cli.ts`) calls `env()` and passes the values.

### 4c. Fix src/lib/suggestions/index.ts

`indexVersion()` reads `process.env.SEARCH_INDEX_VERSION` directly. `SEARCH_INDEX_VERSION` is already in the env schema. Change `runSuggestions()` to accept the index version as a parameter:

```typescript
// Before
function indexVersion(): string {
  return process.env.SEARCH_INDEX_VERSION ?? 'v1';
}

// After -- caller passes the value
// Delete indexVersion(), accept as param in runSuggestions()
```

### 4d. Move src/adapters/sdk-cache/reset-ttls.ts

This is a standalone dev tool script that lives in `src/` but behaves like an operations script. Move it to `operations/utilities/reset-ttls.ts`. At its entry point, call `env()` for the Redis config instead of reading `process.env` directly. Update `package.json` script path.

### 4e. Fix operations/ingestion/verify-ingestion.ts

Creates its own `new Client()` from `process.env`. Change to call `env()` at its entry point and pass credentials down:

```typescript
// Before
esUrl: process.env.ELASTICSEARCH_URL ?? 'http://localhost:9200',
...
const apiKey = process.env.ELASTICSEARCH_API_KEY;

// After
const config = env();
// pass config.ELASTICSEARCH_URL and config.ELASTICSEARCH_API_KEY
```

---

## 5. Fix tests to use DI

Three test files currently mutate `process.env`. All must be refactored to pass config as parameters.

### 5a. src/lib/env.unit.test.ts

Currently assigns to `process.env` and uses `vi.resetModules()`. With `env()` now accepting a raw env parameter, tests call `env({ ... })` or `parseEnv({ ... })` directly. No global state mutation needed.

### 5b. src/lib/search-index-target.unit.test.ts

Currently saves/restores/mutates `process.env` to test `currentSearchIndexTarget()`. After refactoring `currentSearchIndexTarget()` to accept an optional target parameter (or the env result), tests pass the value directly.

### 5c. src/lib/suggestions/index.unit.test.ts

Currently mutates `process.env.SEARCH_INDEX_VERSION`. After refactoring `runSuggestions()` to accept the index version as a parameter, tests pass it directly.

---

## 6. Fix scripts to call env()

Three scripts in `scripts/` currently use `dotenv.config()` then read `process.env` directly:

- **download-bulk.ts** -- reads `process.env.OAK_API_KEY`. Change to `config(); const e = env(); const apiKey = e.OAK_API_KEY;` (OAK_API_KEY is optional in the schema -- may need to use `optionalEnv()` or adjust).
- **diagnose-elser-failures.ts** -- reads `process.env.ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`. Change to `config(); const e = env();` and use `e.ELASTICSEARCH_URL`, `e.ELASTICSEARCH_API_KEY`.
- **analyze-elser-failures.ts** -- only reads `OAK_API_KEY` indirectly via bulk files, and uses `dotenv.config()` but doesn't actually read process.env directly for config. Verify and remove the dotenv import if unused.

Also fix `evaluation/validation/lib/api-helpers.ts` which reads `process.env['OAK_API_KEY']` -- change to accept the API key as a parameter.

---

## 7. Add diagnostics/ to .gitignore

Add `diagnostics/` to [.gitignore](apps/oak-open-curriculum-semantic-search/.gitignore).

---

## Dependency order

```text
1. Delete dead code (no deps)
2. Refactor env() for DI (enables everything else)
3. Fix product code (depends on 2)
4. Fix tests (depends on 3)
5. Fix scripts/operations/evaluation (depends on 2)
6. Add ESLint rule (must be LAST -- enforces all fixes are done)
7. Fix scripts/README, .gitignore (no deps)
8. Quality gates, commit, push
```
