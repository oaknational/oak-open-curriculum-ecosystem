# Production Readiness Plan — oak-mcp-ecosystem (quality gates only)

REMINDER: Use British spelling

## Purpose

Get the full set of quality gates passing consistently across the repository with minimal, surgical refactors and corrections only. No new functionality. Follow `.agent/directives-and-memory/AGENT.md` and `rules.md` strictly. Ignore Notion-specific feature work; only fix linting, types, and tests where needed to pass gates.

## Quality Gates (canonical order)

Run from the repo root, one at a time, always in this order:

- format
- build
- type-gen
- type-check
- lint
- test
- test:e2e

When working on a later gate, re-run all prior gates first to avoid regressions. After any change, prefer running the full sequence.

## Scope

- In scope: `oak-notion-mcp`, `oak-curriculum-mcp`, `oak-curriculum-sdk`, `histoi` packages, and `moria` interfaces used by these packages.
- Out of scope: Feature work, observability/security/release tasks, documentation expansions, and any Notion-specific enhancements beyond what is strictly required to fix linting/types/tests.

## Rules of Engagement

- No type assertions (`as`, non-null `!`, `any`, `Record<string, unknown>`). Use schema-derived types and guards only. `unknown` is allowed only at external boundaries and must be validated and refined immediately.
- Enforce architectural boundaries per ESLint; no cross-organ imports; respect dependency injection.
- Keep diffs minimal and focused on passing gates. Do not change error/logging unless a simple adjustment is required to pass lint/types/tests.
- Use pnpm and turbo only (Node ≥22, pnpm ≥10.14.0). Always run from repo root.
- If you run into permissions issues, stop and ask the user for help.

## Working Loop

1. Run the Quality Gates (format → build → type-gen → type-check → lint → test → test:e2e).
2. Fix failures with the smallest, type-safe changes possible:
   - Replace assertions with precise types/guards that already exist at build time (schema as source of truth).
   - Prefer existing typed helpers when lint rules restrict `Object.keys/entries/fromEntries`.
   - Adjust tests (not functionality) for determinism and correctness; ensure e2e tests cleanly skip when required env keys are absent.
3. Repeat until all gates are green.

## Plan of Action (tight, incremental)

- Baseline: Run the full Quality Gates; capture failures for ordering and priority.
- Type Safety: Remove assertions/forbidden types; add or use existing guards and schema-derived types to satisfy the type checker.
- Lint Clean-up: Resolve ESLint violations (import boundaries, helper usage, complexity/length where applicable) with minimal refactors.
- Tests: Fix unit/integration/e2e tests to be deterministic and aligned with current schemas and behaviours. Networked e2e remain env-gated and must skip cleanly when keys are absent.

## Reviews

- Self-checks: types, lint, tests, architectural boundaries after each change set.
- Human review: one reviewer confirms gates pass locally and changes are minimal/surgical.

## Exit Criteria

- All Quality Gates pass locally in the canonical order without flakiness.
- No type assertions or forbidden types remain; boundaries enforced by ESLint.
- Tests (unit/integration/e2e) pass deterministically; e2e skip cleanly when env keys are absent.

## Notes

- Keep patches minimal and focused; avoid broad rewrites.
- Re-run the full gates after each meaningful change set.

---

## Progress Update — 2025-09-02

Quality gates executed in canonical order from repo root. Current status:

- format: pass
- build: pass
- type-gen: pass
- type-check: pass (fixed SDK structural access error)
- lint: partially failing (reduced surface; remaining violations in SDK generators, curriculum MCP, and some Notion/Histoi files)
- test: pass (unit and integration across packages)
- test:e2e: pass (SDK API calls correctly skip without `OAK_API_KEY`)

Completed changes (surgical, no new features):

- Fixed TypeScript structural access in SDK param introspection to remove unsafe property access.
- Ensured emitter exports use camelCase tool names; aligned unit tests accordingly.
- Updated Notion MCP startup logger tests to assert stderr (stdout reserved for MCP JSON-RPC).
- Replaced many Object.\* usages in SDK scripts with typed helpers; removed `require()` in SDK e2e tests; reduced unsafe types.
- Replaced forbidden `Record<string, unknown>` with `JsonObject`/precise shapes across Moria and Histoi; tightened runtime-boundary guards; preserved JSON-safe contexts.
- Included `bin/**/*.ts` in Curriculum MCP lint TS config to fix project parsing.

Impact: repository builds cleanly; deterministic tests green; type safety improved; lint surface narrowed and ready for the next focused passes.

### Update — SDK lint wave 1 completed (structural safety), wave 2 planned

- SDK: replaced unsafe Object.\* in writers/extraction/validators/executor; removed assertions in param utilities/introspection; introduced emitter-based composition points for generator.
- Current gates: type-check pass; tests pass; lint reduced but remaining issues relate to max-lines/complexity in generator and a few helpers (no functional changes required).
- Alignment: all types flow from the OpenAPI schema; generator/validators operate strictly on schema-derived artefacts. No ad-hoc type invention.

### Update — SDK generator refactor in progress (later on 2025-09-02)

- Modularised generator: `mcp-tool-generator.ts` delegates to `emit-*` parts (header/params/schema/index).
- Ran canonical formatting pass: `pnpm format && pnpm lint --force -- --fix` from repo root.
- Build surfaced a codegen string interpolation bug in emitted guards (literal `string${cap}Value` in generated files). Root cause: emitter string assembly; requires pure string fix in `emit-params.ts`.
- Lint reduced to a small set: max-lines/complexity (generator, emit-params, path-generators), plus the above emission issue.

## TODOs (Grounded, Atomic, Actionable)

REMINDER: UseBritish spelling

1. ACTION: SDK generator — split monolith into parts (delegate to `emit-*`), remove legacy path, and drop below max-lines without behaviour changes
2. REVIEW: code-reviewer + type-reviewer audit the generator split; confirm types still schema-derived
3. GROUNDING: read GO.md and follow all instructions
4. QUALITY-GATE: run format → build → type-gen → type-check → lint → test (for formatting issues, always run `pnpm format && pnpm lint --force -- --fix` from repo root)
5. ACTION: SDK `emit-params.ts` — extract small helpers to satisfy max-lines, max-statements, complexity; no functional changes
6. REVIEW: test-auditor ensure generated content expectations still hold (unit tests)
7. QUALITY-GATE: run format → build → type-gen → type-check → lint → test (include `pnpm format && pnpm lint --force -- --fix`)
8. ACTION: SDK `paths/path-generators.ts` — split `generateRuntimeSchemaChecks` into smaller helpers (e.g., allowed methods builder + guards) to meet limits
9. REVIEW: type-reviewer confirm no type shortcutting; ensure guards remain faithful to schema
10. QUALITY-GATE: run full sequence (include `pnpm format && pnpm lint --force -- --fix`)
11. ACTION: SDK `param-utils.ts` — reduce `primitiveFromType` complexity via early-return helper; keep structural descriptor checks only
12. REVIEW: code-reviewer verify no `as/any/!`; confirm branch coverage by existing tests
13. QUALITY-GATE: run full sequence and confirm SDK lint fully green (include `pnpm format && pnpm lint --force -- --fix`)
14. ACTION: Curriculum MCP — remove `any` access and assertions in `src/organa/mcp/tools/index.ts`; refactor `src/psychon/wiring.ts` (use `??`, split `createLogger`)
15. REVIEW: architecture-reviewer ensure boundaries respected and functions simplified per rules
16. QUALITY-GATE: run full sequence including test:e2e
17. ACTION: Notion MCP — replace remaining `Record<string, unknown>` with `JsonObject` or concrete shapes in query builders/types/transformers
18. REVIEW: config-auditor verify no cross-organ imports; test-auditor check determinism remains
19. QUALITY-GATE: run full sequence and confirm workspace lint fully green

### Immediate Next Steps (surgical)

- REMINDER: UseBritish spelling
- ACTION: SDK generator — emit real executor and parameter validator
  - Implement executor emission to call `client[PATH][METHOD](request)` with zero assertions.
  - Emit `isValidRequestParams(..)` using generated `pathParams`/`queryParams` metadata and enum typeguards.
  - Include helpful TypeError on invalid inputs: `Invalid request parameters. Please match the following schema:`
- REVIEW: test-auditor validate SDK unit tests (execute-tool-call) pass deterministically
- QUALITY-GATE: run format → build → type-gen → type-check → lint → test
- GROUNDING: read GO.md and follow all instructions
- ACTION: Histos logger — reduce `mergeLogContext` complexity via tiny pure helpers (no behaviour change)
- REVIEW: code-reviewer confirm behaviour preserved and complexity below threshold
- QUALITY-GATE: run full sequence (include `pnpm format && pnpm lint --force -- --fix`)
- ACTION: Notion MCP — replace forbidden `Record<string, unknown>` with `JsonObject` or precise shapes at boundaries with guards
- REVIEW: type-reviewer/architecture-reviewer validate boundary guards and no cross-organ imports
- QUALITY-GATE: run full sequence and confirm workspace lint is fully green

## Progress Update — 2025-09-03

Quality gates re-run after focused fixes across SDK, Histoi, and Notion MCP.

- format: pass; build: pass; type-gen: pass; type-check: pass
- lint: partially failing (remaining violations isolated in Curriculum MCP)
- test: pass (SDK + Notion MCP; Curriculum MCP unit tests passing)
- test:e2e: Curriculum MCP previously failed on param validation; to re-check after lint refactors

Completed changes (surgical, no new features):

- SDK generator now emits real executors and request param validators; execute-tool-call unit tests green without assertions.
- Histoi logger `mergeLogContext` simplified via tiny helpers; JSON-safe contexts; complexity under threshold.
- Notion MCP replaced forbidden `Record<string, unknown>` with `JsonObject`/precise shapes; error context logging made JSON-safe; builds and lints cleanly.
- Curriculum MCP input schema builder aligned to JSON-safe description emission (no unsafe enum attachment); build passes. Prettier issues fixed; many `||` replaced with `??`.

Open items (focused):

- Curriculum MCP lint:
  - `createLogger` too long (max-lines-per-function): extract tiny helpers, keep behaviour identical.
  - `generateInputSchema` complexity: split into pure helpers; no behavioural change.
  - Add explicit return type for exported `_resetClient` (module boundary rule).
  - `createMcpOrgan` avoid assertion and unsafe returns; ensure safe shaping and parsing.

### Next Actions (tight, incremental)

- REMINDER: UseBritish spelling
- ACTION: Curriculum MCP — refactor `createLogger` into tiny helper(s) to drop below max-lines without behaviour change
- REVIEW: code-reviewer confirm logger behaviour preserved; verify `??` usage
- GROUNDING: read GO.md and follow all instructions
- ACTION: Curriculum MCP — extract `toJsonSchemaProperty` in tools index; reduce `generateInputSchema` complexity; no assertions
- REVIEW: type-reviewer validate types flow from SDK metadata; forbid `Record<string, unknown>`
- QUALITY-GATE: run full sequence (format → build → type-gen → type-check → lint → test → test:e2e)
- ACTION: Curriculum MCP — add explicit return type for `_resetClient`; update `createMcpOrgan.handleTool` to avoid assertion and unsafe returns
- REVIEW: architecture-reviewer validate boundaries and MCP protocol alignment
- QUALITY-GATE: run full sequence and analyse; iterate until green

Notes on execution:

- Keep diffs minimal; prefer extracting tiny pure helpers to satisfy complexity rules without changing behaviour.
- Re-run earlier gates before later ones to catch regressions.
- Schema is the single source of truth for types; all generated/runtime types must ultimately derive from the OpenAPI schema.
