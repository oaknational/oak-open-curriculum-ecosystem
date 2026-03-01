---
name: Onboarding fixes and audit
overview: Fix all P1 findings (F1-F5), fix P2 items 1-4 and 7-8, and present the eslint-disable audit results. Nine dispositioned items require no changes.
todos:
  - id: f1-f5
    content: "Fix F1-F5: env-vars.md stale command, ghost variables, missing .env.example entry, CONTRIBUTING.md contradiction"
    status: completed
  - id: p2-1
    content: "Fix P2-1: Remove E2E from env-var-required list in environment-variables.md"
    status: completed
  - id: p2-2
    content: "Fix P2-2: Rename docs/README.md 'AI Agent Guidance' section to 'Code Standards and Testing'"
    status: completed
  - id: p2-3
    content: "Fix P2-3: Annotate source-code links in docs/README.md Curriculum Data section"
    status: completed
  - id: p2-4
    content: "Fix P2-4: Reconcile setup paths across README, quick-start, CONTRIBUTING"
    status: completed
  - id: p2-7
    content: "Fix P2-7: Add TODO note about globalThis as any in widget test files"
    status: completed
  - id: p2-8
    content: "Fix P2-8: Remove hardcoded test counts from HTTP MCP README"
    status: completed
  - id: p2-9-report
    content: Present eslint-disable audit results to user (done in plan)
    status: completed
isProject: false
---

# Onboarding Review Fixes and eslint-disable Audit

## Dispositions (no code changes)

- **P2-5** ("11 quality gates"): Correct as-is. Build is a quality gate.
- **P2-6** (type assertion docs): No change. Policy is "never use type assertions"; centralised helpers don't change the rule.
- **P2-9** (eslint-disable audit): Complete — results presented below.

---

## F1-F5: Environment Variables Documentation Drift

All in `[docs/operations/environment-variables.md](docs/operations/environment-variables.md)` and `[CONTRIBUTING.md](CONTRIBUTING.md)`.

- **F1** (line 165): Change `elastic:setup` to `es:setup`
- **F2** (line 78): Remove `AI_PROVIDER` row from the Required table — zero hits in search CLI source
- **F3** (lines 84, 88-89): Remove `OPENAI_API_KEY` "Required when AI_PROVIDER=openai" row from Optional table. Remove `SEMANTIC_SEARCH_USE_FIXTURES` and `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` rows from Optional table.
- **F4**: Add `SEARCH_INDEX_VERSION=v2026-03-01` to `[apps/oak-search-cli/.env.example](apps/oak-search-cli/.env.example)`
- **F5** (CONTRIBUTING.md line 100): Change `# Populate OAK_API_KEY, SEARCH_API_KEY, ELASTICSEARCH_* etc. as needed` to `# Populate OAK_API_KEY (see below for which variables go where)`

## P2-1: E2E Test Env Var Contradiction

`[docs/operations/environment-variables.md](docs/operations/environment-variables.md)` lines 191 and 258 claim E2E tests require env vars. `[CONTRIBUTING.md](CONTRIBUTING.md)` line 163 correctly states E2E tests use mocks and DI. Fix env-vars.md:

- Line 191: Remove `- E2E tests` from the "Environment variables are only required for" list
- Line 258: Change `pnpm test:e2e       # E2E tests (requires env vars)` to `pnpm test:e2e       # E2E tests (uses mocks and DI — no env vars needed)`

## P2-2: docs/README.md "AI Agent Guidance" Section Header

`[docs/README.md](docs/README.md)` lines 55-63: The section contains Development Practice, TypeScript Practice, Testing Strategy, and Safety and Security — all relevant to human developers. Rename from "AI Agent Guidance" to "Code Standards and Testing" (or similar). Move the AI-specific entry points (start-right, AGENT.md) which are already in the "Getting Started" section at the top.

## P2-3: Source Code Files Linked as Documentation

`[docs/README.md](docs/README.md)` lines 47-48: Annotate the two source-code links:

```
- [Ontology Data](../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) (TypeScript source — domain model and structural patterns)
- [Knowledge Graph](../packages/sdks/oak-sdk-codegen/src/mcp/property-graph-data.ts) (TypeScript source — canonical entity-relationship data)
```

## P2-4: Three Overlapping Setup Paths

The README quick start (lines 48-84), `[docs/foundation/quick-start.md](docs/foundation/quick-start.md)` (lines 62-76), and `[CONTRIBUTING.md](CONTRIBUTING.md)` (lines 82-111) all describe setup with subtle differences. The fix is to make the README and CONTRIBUTING.md defer to quick-start.md for the full sequence, and ensure the quality gate command lists are consistent. Specifically:

- CONTRIBUTING.md line 100: already being fixed in F5
- Ensure all three recommend the same verification command (`pnpm test` as first check)

## P2-7: Widget Test `globalThis as any` TODO

Add a TODO note near the existing eslint-disable comments in both widget test files explaining this should be addressed with a typed OpenAI widget interface:

- `[apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts](apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts)` (lines 81, 165-166, 171)
- `[apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts](apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts)` (lines 56, 68)

## P2-8: Remove Test Counts from HTTP MCP README

`[apps/oak-curriculum-mcp-streamable-http/README.md](apps/oak-curriculum-mcp-streamable-http/README.md)` lines 164-193: Remove the specific test count numbers from the Testing section. Keep the test layer descriptions and file references but strip the counts (e.g. "53 tests", "20 tests", "63 tests", "200+ tests").

---

## P2-9: eslint-disable Audit Results

**Totals**: 98 eslint-disable | 1 @ts-expect-error | 0 @ts-ignore | 0 @ts-nocheck

### By category

- `**@typescript-eslint/consistent-type-assertions`** (24 occurrences)
  - 8 in `type-helpers/src/index.ts` — the centralised assertion module. Justified.
  - 1 in `oak-eslint/src/configs/react.ts` — react-hooks plugin type mismatch. Justified.
  - 3 in search CLI indexing files (`curriculum-pattern-config.ts`, `pattern-aware-fetcher.ts`, `pattern-config-validator.ts`). These need investigation.
  - 12 in test fakes/helpers across 5 files (Express Request/Response/NextFunction mocks, MCP SDK type mocks). Common pattern — ISP refactor would eliminate these.
- `**@typescript-eslint/no-restricted-types`** (20 occurrences)
  - 11 in `logger/json-sanitisation.ts` — WeakSet and sanitisation boundary. Justified (operates on genuinely unknown objects).
  - 4 in `logger/error-normalisation.ts` — unknown thrown objects. Justified.
  - 2 in `response-augmentation.ts` — generic type capture. Justified.
  - 3 in widget/script files — external boundary. Justified.
- `**max-lines`** (18 occurrences)
  - 8 on static data files (ontology, property graph, synonyms, validation types). Justified — data is inherently long.
  - 5 on generated files. Justified — generators emit this.
  - 3 on search CLI modules. Need extraction.
  - 2 on generator scripts. Justified — generator code.
- `**no-restricted-properties`** (12 occurrences)
  - 4 marked `-- REFACTOR` explicitly. These are known debt.
  - 5 in logger (Object.keys/values at sanitisation boundary). Justified.
  - 2 in search CLI (JSON boundary, Record iteration). Justified.
  - 1 in smoke-test environment mutation. Documented architectural debt.
- `**max-lines-per-function`** (9 occurrences)
  - Spread across server, CLI, and generator code. Some justified (OAuth verification, generators), some extractable.
- `**@typescript-eslint/no-explicit-any`** (4 occurrences)
  - All in widget Playwright specs (`globalThis as any`). Covered by P2-7 TODO.
- `**complexity`**(3), `**max-statements`** (3), `**no-restricted-syntax**` (3), `**@typescript-eslint/no-misused-promises**` (2), `**no-console**` (1), `**@typescript-eslint/no-namespace**` (1), `**no-restricted-globals**` (1): All justified with documented reasons.

### Items flagged as needing attention

- **4 REFACTOR markers**: `logger/log-levels.unit.test.ts:21`, `elastic-http.ts:213`, `ingest-harness-ops.ts:77`, `zero-hit-api.unit.test.ts:66`, `create-stubbed-stdio-server.ts:50`
- **3 search CLI assertion casts**: `curriculum-pattern-config.ts:357`, `pattern-aware-fetcher.ts:63`, `pattern-config-validator.ts:66`
- **12 test fake casts**: ISP refactor pattern (already proven in SDK) would eliminate these
- **3 extractable max-lines modules**: `index-oak-helpers.ts`, `index-batch-helpers.ts`, `cache-wrapper.ts`
