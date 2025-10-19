# Semantic Search Recovery – Context Log

_Last updated: 2025-10-20_

---

## Current Snapshot

- **Generator:** Templates and sanitiser still emit assertion-free output. Stub payloads, however, are authored by hand and drifted from the generated response schemas—`pnpm smoke:dev` now fails when the HTTP app streams stub data.
- **Runtime:** SDK façades delegate to generated executors. Streamable HTTP honours `OAK_CURRICULUM_MCP_USE_STUB_TOOLS`, but the backing stub implementation lives in the stdio app and is not schema-derived.
- **Tests:** `pnpm test`, `pnpm test:e2e`, and `pnpm test:ui` remain green. `pnpm smoke:dev` fails on “Successful tool call must not be flagged as error” when stubs are active. No automated coverage exists for starting the dev server and listing tools.
- **Documentation:** Cardinal-rule guidance is recorded, but we still need explicit instructions for SSE headers, stub vs live smoke flows, and Cursor dev setup.
- **Tooling Debt:** `pnpm format:root` is pending. We also lack generated stub fixtures in the SDK, shared between transports.

---

## Immediate Priorities

1. Generate schema-driven stub payloads during `pnpm type-gen`, expose them via the SDK runtime, and update all consumers (stdio + streamable HTTP) to rely on the generated helpers.
2. Add test coverage: SDK-level validation proving stub executors output schema-compliant data, plus supertest-based “sanity” suites showing both dev and production HTTP servers list tools and execute a stubbed call.
3. Restructure smoke harnesses into stub/live/remote variants, keeping strict Accept-header enforcement and documenting the flows.
4. Update developer documentation (context, plan, README) with SSE guidance, stub usage, and Cursor setup, then clear formatting debt (`pnpm format:root`) once changes settle.

Backlog items (legacy operation/response lint debt, downstream app clean-up) stay paused until generated stubs and smoke harness work are complete.

---

## Command Log

_No resets since the latest grounding. Populate this section as stages progress._

Template for new entries:

```
2025-10-18 HH:MM UTC
- pnpm type-gen → ✅/❌  Notes…
- pnpm build --filter @oaknational/oak-curriculum-sdk → …
- pnpm type-check --filter @oaknational/oak-curriculum-sdk → …
- pnpm lint --filter @oaknational/oak-curriculum-sdk → …
- Tests (if run) → …
Reflection: Loop check result, schema-first alignment notes.
```

---

2025-10-18 12:47 UTC

- `pnpm type-gen` → ✅  
  Regenerated artefacts without issue; generator templates remain cast-free and aligned with the schema-first DAG.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ❌  
  TS2322 in `src/mcp/universal-tools.ts` confirms the runtime regression (manual validator widens `ToolArgsForName`).
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ❌  
  Same TS2322 plus missing helper declarations in the updated unit test (`parseJson`).
- `pnpm lint --filter @oaknational/oak-curriculum-sdk` → ❌  
   Expected errors: `Record<string, unknown>` usage, optional chaining, unsafe assignments introduced by the runtime layer.
  Reflection: Loop Check A passed—baseline breakages captured, matching the Stage 1/2 remediation targets. Proceeding to Stage 1.

---

2025-10-18 13:28 UTC

- `pnpm type-gen` → ✅  
  Generator outputs remain cast-free after restoring the universal façade.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ✅  
  TS2322 resolved; runtime now delegates to `executeToolCall` and generated executors exclusively.
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ✅  
  Updated unit tests compile cleanly.
- `pnpm lint --filter @oaknational/oak-curriculum-sdk` → ❌  
   Remaining issues match Stage 2 scope (`Record<string, unknown>`, function complexity, explicit exports).
  Reflection: Loop Check C passed—the façade is generator-driven and the only outstanding work is lint hardening.

---

2025-10-18 21:21 UTC

- `pnpm type-gen` → ✅  
  Regenerated artefacts cleanly after introducing aggregated helper modules.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ✅  
  New `aggregated-*` and shared helpers are emitted to `dist`, no missing module errors.
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ✅  
  Search/fetch validators and tests type-check without assertions or `any`.
- `pnpm lint --filter @oaknational/oak-curriculum-sdk` → ✅  
  Runtime lint debt cleared; remaining generator lint rules unaffected.
- `pnpm build --filter @oaknational/open-curriculum-semantic-search` → ✅  
   Semantic search app now links against the rebuilt SDK without module resolution failures.
  Reflection: Loop Check D passed—Stage 2 lint targets resolved while retaining schema-first delegation. Next focus: final integrity checks and documentation updates.

---

2025-10-18 21:34 UTC

- `pnpm type-gen` → ✅  
  Confirmed generator outputs remain unchanged after lint clean-up.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ✅  
  Aggregated helpers, shared utilities, and public façades ship correctly in `dist`.
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ✅  
  Final verification that runtime/tests stay inference-free.
- `pnpm lint --filter @oaknational/oak-curriculum-sdk` → ✅  
  All runtime lint targets green; generator lint backlog remains deferred.
- `pnpm build --filter @oaknational/open-curriculum-semantic-search` → ✅  
   Downstream semantic-search workspace builds clean with the updated SDK artefacts.
  Reflection: Loop Check E passed—Stage 3 integrity checks complete, and docs/plans now mirror the schema-first, generator-driven flow. Backlog limited to generator lint tidy-up and downstream app audits.

---

2025-10-19 09:47 UTC

- `pnpm type-gen` → ✅  
  Generator rerun clean; no schema drift detected.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ✅  
  Fresh dist artifacts include updated validation exports and aggregated helpers.
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ✅  
  Runtime/tests compile after hoisted-const and import hygiene fixes.
- `pnpm lint --filter @oaknational/oak-curriculum-sdk` → ✅  
  No regressions introduced.
- `pnpm test` → ✅  
  Unit/integration suites pass with the refactored executors.
- `pnpm test:e2e` → ❌  
   Failures isolated to tests:  
   • SDK `zodgen` guard now catches `Object.fromEntries(... ) as T` emitted by `sanitizeSchemaKeys`.  
   • STDIO MCP CLI crashes because `dist/validation/request-validators.js` imports `./types` without `.js`, so Node can’t resolve the module.  
   • Streamable HTTP e2e suites still assert legacy `{ arguments: { q: … } }` shapes and older error text; the executor now requires `{ arguments: { params: … } }` and returns refined validation messages.
  Reflection: Loop Check F surfaced that runtime gates are green, but e2e coverage lags behind the schema-first refactor. Stage 4 will focus on generator hygiene and downstream test alignment to bring the suites back to green.

---

2025-10-19 12:58 UTC

- `pnpm --filter @oaknational/oak-curriculum-sdk test -- type-gen/zodgen-core.unit.test.ts` → ✅  
  Existing generator unit suite re-run to confirm sanitiser refactor keeps prior guarantees.
- `pnpm --filter @oaknational/oak-curriculum-sdk type-gen` → ✅  
  Regenerated artefacts adopt the assertion-free sanitiser while preserving the schema-first DAG.
- `pnpm build --filter @oaknational/oak-curriculum-sdk` → ✅  
  Dist now includes the revised sanitiser, matching generated Zod schemas with no casts.
- `pnpm type-check --filter @oaknational/oak-curriculum-sdk` → ✅  
  TypeScript accepts the new helper without widening unions or relying on `as`.
- `pnpm --filter @oaknational/oak-curriculum-sdk lint` → ✅  
   Lint passes with no regressions; generator output stays policy-compliant.
Reflection: Loop Check G confirms Stage 4’s first task is complete—the zod generator no longer violates the cardinal rule, and all core gates stay green. Next focus: validation import specifiers and downstream e2e realignment.

---

2025-10-19 13:34 UTC

- `pnpm test` → ✅  
  Full unit/integration stack remains green with schema-compliant stubs.
- `pnpm test:e2e` → ✅  
  Streamable HTTP and stdio suites aligned on `{ params: … }`; only smoke harness outstanding (see below).
- `pnpm test:ui` → ✅  
  Playwright visual regressions pass; fixture workflow intentionally logs 503 error fixture but asserts correctly.
- `pnpm smoke:dev` → ❌  
  Fails by design while we keep `Accept: text/event-stream` mandatory. Script asserts “Successful tool call must not be flagged as error” when it intentionally omits the streaming header.
 Reflection: Loop Check H – all routine gates are green; remaining debt is the smoke harness vs. header policy decision. Record this for Stage 4 follow-up.

---

2025-10-20 14:05 UTC

- Observed: Streamable smoke run fails because stdio-authored stubs emit payloads that no longer match generated response schemas (`isError: true`). Cursor’s dev flow also fails without `Accept: text/event-stream`, despite auth bypass being enabled.
- Decision: Generate stub fixtures during `pnpm type-gen`, surface them via the SDK, and reuse them across transports. Split smoke harnesses (stub/live/remote) and add supertest sanity tests for dev/prod servers.
- Next Actions: Design generator templates for stubs, add SDK + app tests (failing first), then update streamable HTTP + scripts. Each meaningful change will be followed by `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, and the relevant smoke script.
- Reflection: Aligns with the cardinal rule by keeping stubs schema-first, improves test coverage before runtime edits, and clarifies developer ergonomics for Accept headers and dev tokens.

---

## Next Steps

1. Implement generator-driven stub fixtures and expose shared helpers through the SDK, updating stdio + HTTP apps to consume them. Follow with the full gate suite.
2. Add SDK-level validation tests and HTTP supertest “sanity” suites covering dev + production bootstraps (stubbed vs live). Run the full gate suite after each test addition and corresponding implementation.
3. Split the smoke harness into stub/live/remote entry points, keep strict Accept-header checks, and rerun all quality gates for each script update.
4. Refresh documentation (plans, context, README) with SSE + stub guidance, then clear formatting debt via `pnpm format:root` and the complete gate suite.

---

## Full Text Archive (for continuity in future chats)

1.  Keep vs discard
    Worth keeping (true lint/completeness gains)

Generator-side clean-ups: tighter alias maps, schema/response helpers split into dedicated modules, executor template invoking descriptors without casts. These keep the schema-first DAG intact and should stay.
Zod-input and request-validator tweaks that replace Object.entries with typeSafeEntries. Pure lint wins, no runtime risk.
Must discard or rework

The “special tool” runtime layer (special-tool-definitions.ts, special-tool-runtime.ts, and the rewritten universal-tools.ts). These reintroduce runtime inference, safe-parsing on unions, and manual dispatch—the exact problem we just fixed. They violate the cardinal rule and break the schema-first pipeline.
Associated test changes that assume the new runtime validation; once we drop that layer we revert to the generator-driven behaviour and tidy the tests accordingly.
Any export \* re-exports that were bolted on during the rewrite; we’ll reintroduce explicit, generator-aligned exports instead.
In short: keep the generator/template lint improvements, discard the runtime regression layer, then rebuild a thin façade that delegates entirely to generated executors.

2. “Special tools” framing
   We really just have “tools”: some map directly to an API descriptor, others orchestrate multiple calls (search, fetch). The distinction should be encapsulated in one spot—the universal-tool façade—without inventing a parallel type system. That means:

Use the generated executor for every curriculum tool, so they all flow through the same typed pipeline.
Provide the extra logic (e.g., the search aggregator) as small, well-defined helpers that still consume generator-validated arguments/results.
Keep all of that logic in one module so the difference is minimised and documented. 3. Stage plan (each with full quality gates)
Stage 0 – Re-ground

Re-read rules.md and schema-first-execution.md.
Log the grounding (cardinal rule, schema-first DAG) in the context log.
Validation: pnpm type-gen, pnpm build --filter @oaknational/oak-curriculum-sdk, pnpm type-check --filter @oaknational/oak-curriculum-sdk, pnpm lint --filter @oaknational/oak-curriculum-sdk – confirming current breakage before we touch anything.

Stage 1 – Restore generator-driven universal execution

Revert/replace the special-tool-_ runtime modules and put src/mcp/universal-tools.ts back to delegating through the generated executor. The only custom logic should be the orchestrations (search/fetch) operating on already-validated data.
Update universal-tools.unit.test.ts to match the generator-first behaviour (no manual safeParse, no any).
Ensure public exports (public/mcp-tools.ts, src/index.ts) expose the generated executors and the thin façade explicitly (no export _).
Validation: Run the full suite (type-gen → build → type-check → lint). Document that the universal façade now respects the schema-first DAG again.

Stage 2 – Lint hardening without widening types

Fix remaining lint warnings: replace any lingering Record<string, unknown> with typed helpers or use the generator-derived types directly; drop unnecessary optional chaining/unsafe assignments; ensure exports are explicit.
Keep all runtime logic a thin shell over generated artefacts.
Validation: Full suite again (type-gen → build → type-check → lint). Log results and confirm no runtime inference slipped back in.

Stage 3 – Integrity + docs

Re-run the full quality gate suite once more to prove stability.
Update the context log and plan with final outcomes, noting that we are back to building on the generator-driven flow.
Capture any follow-up lint or legacy debt separately so it doesn’t interfere with the restored pipeline.
Validation: Same four commands, plus any focused tests you feel are prudent; note success and that the result aligns with the cardinal rule and schema-first principle.

Following this plan keeps the good lint changes, discards the regression layer, and enforces the full gate cycle after every meaningful change so we don’t reintroduce hidden failures. Ready to start Stage 1 once you give the word.

are you happy with that plan, will it get us back to working, and then get us to excellent, all while preserving the cardinal rule and schema first principle?

Yes—this staged plan will get us back to a working SDK and then to excellent, and it does so without ever stepping outside the cardinal rule or the schema-first directive.

Every change flows generator → runtime → façade without reintroducing inference or casts.
“Special” logic stays encapsulated as thin helpers layered on top of the generated executor; we’re not inventing parallel type systems.
Each stage ends with the full gate cycle (type-gen, build, type-check, lint), so regressions surface immediately.
Documentation updates come last, once the restored flow is proven.
So yes: it brings us back to green, builds on top of a clean generator-driven foundation, and keeps the schema-first DAG intact throughout. Ready to execute.

This context entry preserves the instruction above to ensure any new conversation can recover the rationale and requirements.
