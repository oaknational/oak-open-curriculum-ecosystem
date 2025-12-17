# Config Architecture Standardisation Plan

**Status**: 📋 READY TO START  
**Priority**: High - Blocks global state elimination work  
**Estimated Effort**: 3-4 hours  
**Created**: 2025-12-16

---

## Related Plans

- **Parent**: [Global State Elimination Plan](./global-state-elimination-plan.md) - This plan unblocks Phase 3 and subsequent phases
- **ADR**: [ADR-078: Dependency Injection for Testability](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)

---

## Foundation Documents (Re-read Before Starting)

- [rules.md](../../directives-and-memory/rules.md) - No compatibility layers, clean breaks
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) - DI for testability
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) - Generator is source of truth

---

## Overview

### The Problem

The `oak-notion-mcp` app uses an ad-hoc config/env pattern that:

1. **Reads `process.env` directly** in utility functions
2. **Creates module-level constants** evaluated at import time
3. **Requires `vi.doMock`** to test, causing race conditions

This blocks the global state elimination work and diverges from the established patterns in other apps.

### The Opportunity

Rather than adding parameters to bespoke functions (compatibility layer), we should:

1. **Delete** the ad-hoc `env-utils.ts` utilities
2. **Adopt** the established pattern from `oak-curriculum-mcp-streamable-http`
3. **Achieve** consistency across all apps

### Current State Analysis

| App                                  | Pattern                                                                              | Quality           |
| ------------------------------------ | ------------------------------------------------------------------------------------ | ----------------- |
| `oak-curriculum-mcp-streamable-http` | Zod schema + `readEnv(source)` + `loadRuntimeConfig(source)`                         | **Canonical**     |
| `oak-curriculum-mcp-stdio`           | Interface + `loadRuntimeConfig(source)`                                              | **Good**          |
| `oak-notion-mcp`                     | Module-level const + `getString/getBoolean/getNumber` reading `process.env` directly | **Non-compliant** |

### Target Architecture

```text
oak-notion-mcp/src/
├── env.ts              # Zod schema + readEnv(source)
├── runtime-config.ts   # loadRuntimeConfig(source) factory
└── index.ts            # Entry point calls loadRuntimeConfig(process.env)
```

---

## Phases

| Phase   | Scope                            | Effort    | Dependencies |
| ------- | -------------------------------- | --------- | ------------ |
| Phase 1 | Create new config architecture   | 1.5 hours | None         |
| Phase 2 | Migrate consumers                | 1 hour    | Phase 1      |
| Phase 3 | Delete legacy code and fix tests | 1 hour    | Phase 2      |

---

## Phase 1: Create New Config Architecture

### Goal

Create a Zod-validated, DI-compatible config layer for `oak-notion-mcp` following the canonical pattern.

### Intended Impact

- Config is validated at startup
- All functions receive config as parameters
- Tests can pass config directly without mocking

### Tasks

#### 1.1 Create `env.ts` with Zod Schema

**File**: `apps/oak-notion-mcp/src/env.ts`

```typescript
import { z } from 'zod';
import { parseLogLevel, LOG_LEVEL_KEY, ENABLE_DEBUG_LOGGING_KEY } from '@oaknational/mcp-logger';

const EnvSchema = z.object({
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  MAX_SEARCH_RESULTS: z.coerce.number().min(1).max(1000).default(100),
  LOG_LEVEL: z.string().optional(),
  ENABLE_DEBUG_LOGGING: z.enum(['true', 'false']).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Reads and validates environment variables.
 *
 * @param source - Environment variables object, defaults to process.env
 * @returns Validated environment configuration
 * @throws Error if required variables are missing or invalid
 */
export function readEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join('; ');
    throw new Error(`Invalid environment: ${message}`);
  }
  return parsed.data;
}
```

**Acceptance Criteria**:

- File exists at `apps/oak-notion-mcp/src/env.ts`
- `readEnv()` accepts optional source parameter
- `readEnv({})` throws with descriptive error
- `readEnv({ NOTION_API_KEY: 'test' })` returns valid config

#### 1.2 Create `runtime-config.ts` Factory

**File**: `apps/oak-notion-mcp/src/runtime-config.ts`

```typescript
import { readEnv, type Env } from './env.js';
import { parseLogLevel, type LogLevel } from '@oaknational/mcp-logger';

/**
 * Runtime configuration derived from environment variables.
 */
export interface RuntimeConfig {
  readonly env: Env;
  readonly logLevel: LogLevel;
  readonly enableDebugLogging: boolean;
}

/**
 * Loads runtime configuration from environment variables.
 *
 * @param source - Environment variable source (defaults to process.env)
 * @returns Validated runtime configuration
 */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const env = readEnv(source);

  return {
    env,
    logLevel: parseLogLevel(env.LOG_LEVEL),
    enableDebugLogging: env.ENABLE_DEBUG_LOGGING === 'true',
  };
}
```

**Acceptance Criteria**:

- File exists at `apps/oak-notion-mcp/src/runtime-config.ts`
- `loadRuntimeConfig()` accepts optional source parameter
- All config values derived from validated `Env`

---

## Phase 2: Migrate Consumers

### Goal

Update all code that uses the legacy `env` constant or `env-utils.ts` functions to use the new `RuntimeConfig`.

### Intended Impact

- Single source of config truth
- All consumers receive config via parameters
- Entry point is the only place that reads `process.env`

### Tasks

#### 2.1 Update Entry Point

**File**: `apps/oak-notion-mcp/src/index.ts`

```typescript
import { loadRootEnv } from '@oaknational/mcp-env';
import { loadRuntimeConfig } from './runtime-config.js';

// Load .env from repo root if needed
loadRootEnv({
  requiredKeys: ['NOTION_API_KEY'],
  startDir: process.cwd(),
  env: process.env,
});

const config = loadRuntimeConfig();
// Pass config to all consumers...
```

**Acceptance Criteria**:

- Entry point loads config once
- Config is passed to all downstream code
- No other file reads `process.env` directly

#### 2.2 Update Server Wiring

**File**: `apps/oak-notion-mcp/src/app/wiring.ts`

Update to accept `RuntimeConfig` as parameter instead of reading from module-level `env` constant.

**Acceptance Criteria**:

- `createServer()` or equivalent accepts `config: RuntimeConfig`
- No direct `process.env` access

#### 2.3 Update Any Other Consumers

Search for remaining `process.env` access and update.

```bash
rg "process\.env\." apps/oak-notion-mcp/src --glob "*.ts" --glob "!*.test.ts"
```

**Acceptance Criteria**:

- Only entry point and test setup files access `process.env`
- All product code receives config as parameters

---

## Phase 3: Delete Legacy Code and Fix Tests

### Goal

Remove the legacy config utilities and update tests to use the new pattern.

### Intended Impact

- No dead code
- Tests are pure function tests
- `vi.doMock` eliminated

### Tasks

#### 3.1 Delete Legacy Files

**Files to delete**:

- `apps/oak-notion-mcp/src/config/notion-config/env-utils.ts`
- `apps/oak-notion-mcp/src/config/notion-config/env-utils.unit.test.ts`
- `apps/oak-notion-mcp/src/config/notion-config/environment.ts`

**Note**: Keep `notion-config.ts` if it contains other configuration.

**Acceptance Criteria**:

- Legacy files deleted
- No imports of deleted files
- Build passes

#### 3.2 Rewrite `index.unit.test.ts`

**File**: `apps/oak-notion-mcp/src/app/index.unit.test.ts`

Replace `vi.doMock` with pure function testing:

```typescript
import { describe, it, expect } from 'vitest';
import { loadRuntimeConfig } from '../runtime-config';

describe('loadRuntimeConfig', () => {
  it('loads config from provided env source', () => {
    const testEnv = {
      NOTION_API_KEY: 'test_key',
      MAX_SEARCH_RESULTS: '50',
      LOG_LEVEL: 'DEBUG',
    };

    const config = loadRuntimeConfig(testEnv);

    expect(config.env.NOTION_API_KEY).toBe('test_key');
    expect(config.env.MAX_SEARCH_RESULTS).toBe(50);
    expect(config.logLevel).toBe('DEBUG');
  });

  it('throws for missing required env vars', () => {
    expect(() => loadRuntimeConfig({})).toThrow('NOTION_API_KEY is required');
  });

  it('uses defaults for optional values', () => {
    const config = loadRuntimeConfig({ NOTION_API_KEY: 'key' });
    expect(config.env.MAX_SEARCH_RESULTS).toBe(100);
  });
});
```

**Acceptance Criteria**:

- No `vi.doMock` in the test
- No `process.env` mutation
- All tests pass

#### 3.3 Verify Global State Elimination Metrics

```bash
# MUST pass - zero vi.doMock in unit tests
rg "vi\.doMock" --glob "*.unit.test.ts" apps/oak-notion-mcp/ | wc -l
# Expected: 0

# MUST pass - zero process.env in product code (except entry point)
rg "process\.env\." apps/oak-notion-mcp/src --glob "*.ts" --glob "!*.test.ts" --glob "!index.ts" | wc -l
# Expected: 0
```

**Acceptance Criteria**:

- Zero `vi.doMock` in `oak-notion-mcp` unit tests
- `process.env` only in entry point

---

## Quality Gates (Post-Implementation)

After all phases, run the complete quality gate suite:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Acceptance Criteria Summary

### Phase 1

- [ ] `env.ts` exists with Zod schema and `readEnv(source)` function
- [ ] `runtime-config.ts` exists with `loadRuntimeConfig(source)` factory
- [ ] Unit tests for both files pass

### Phase 2

- [ ] Entry point uses `loadRuntimeConfig()`
- [ ] All consumers receive config as parameters
- [ ] No product code reads `process.env` directly

### Phase 3

- [ ] Legacy `env-utils.ts` and `environment.ts` deleted
- [ ] `index.unit.test.ts` rewritten without `vi.doMock`
- [ ] Zero `vi.doMock` in `oak-notion-mcp` unit tests
- [ ] All quality gates pass

---

## Related Work

After this plan completes:

1. **Return to Global State Elimination Plan** - Phase 3 is unblocked
2. **Consider deleting `createAdaptiveEnvironment`** from `@oaknational/mcp-env` (dead code)
3. **Document the canonical pattern** in developer guide (Phase 6 of global state plan)

---

## Risk Mitigation

| Risk                            | Likelihood | Impact | Mitigation                      |
| ------------------------------- | ---------- | ------ | ------------------------------- |
| Breaking existing functionality | Low        | High   | Run tests after each change     |
| Missing a consumer              | Medium     | Low    | Grep for `env-utils` imports    |
| Zod schema too strict           | Low        | Medium | Start permissive, tighten later |

---

## References

- Foundation: `.agent/directives-and-memory/rules.md`
- Testing: `.agent/directives-and-memory/testing-strategy.md`
- ADR: `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`
- Canonical example: `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
- Canonical example: `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
