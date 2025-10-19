# Semantic Search SDK Recovery Plan

## Mission

Re-align the Oak Curriculum SDK with the schema-first, generator-driven DAG so that _every_ runtime consumer is a thin delegate of generated artefacts. No casts, no widened unions, no runtime re-validation.

## Cardinal Rule Checklist

Before every coding session:

1. Re-read `.agent/directives-and-memory/rules.md`
2. Re-read `.agent/directives-and-memory/schema-first-execution.md`
3. Re-read this plan and the latest context log

If the intent of a change is even slightly unclear, stop and re-ground.

## DAG Reminder

```
OpenAPI Schema
      ↓
type-gen templates (type-gen/typegen/**)
      ↓
Generated contracts, descriptors, aliases, executors
      ↓
Runtime façade (sdk src/mcp/**)
      ↓
Apps & tests
```

All fixes must flow _down_ this DAG. If we touch something higher in the chain, we regenerate and reverify before moving on.

---

## Stage 0 – Grounding & Baseline

**Objective:** Confirm the current state and capture it in the context log.

- Re-read the directives (see checklist above).
- Run the full quality suite:
  - `pnpm type-gen`
  - `pnpm build --filter @oaknational/oak-curriculum-sdk`
  - `pnpm type-check --filter @oaknational/oak-curriculum-sdk`
  - `pnpm lint --filter @oaknational/oak-curriculum-sdk`
- Record results + observations in `context.md`.

**Exit Criteria:** We have an up-to-date log of breakages (most notably the regression in `src/mcp/universal-tools.ts`) and a clear restatement of the schema-first target.

---

## Stage 1 – Restore Generator-Driven Universal Execution

**Objective:** Remove the runtime “special tool” detour and route everything back through generated executors.

Tasks:

- Delete/replace `special-tool-*.ts` runtime layers with thin helpers that only add orchestration (e.g. search/fetch) on top of generator-validated data.
- Revert `src/mcp/universal-tools.ts` to:
  - Delegate curriculum tools directly to the generated dispatcher.
  - Use the small orchestration helpers _after_ argument validation.
  - Avoid `safeParse` / unions / casts in runtime code.
- Update `universal-tools.unit.test.ts` to reflect the restored behaviour (no `any`, no optional chaining on known values).
- Ensure public exports (`src/public/mcp-tools.ts`, `src/index.ts`) expose the generator executors and façade explicitly—no `export *`.

Validation (run in this order, capturing notes in context log):

1. `pnpm type-gen`
2. `pnpm build --filter @oaknational/oak-curriculum-sdk`
3. `pnpm type-check --filter @oaknational/oak-curriculum-sdk`
4. `pnpm lint --filter @oaknational/oak-curriculum-sdk`

**Exit Criteria:** Build/type-check succeed, lint only reports the known style issues (export star, Record<…>, etc.), and the context log confirms the universal executor once again delegates to generator output (Loop Check C).

---

## Stage 2 – Lint Compliance Without Widening Types

**Objective:** Clear remaining lint warnings while keeping the schema-first flow untouched.

Tasks:

- Replace `export *` with explicit named exports in `src/index.ts`, `src/mcp/special-tools.ts`, and any other public entry points.
- Swap remaining `Record<string, unknown>` usage for strongly-typed helpers (`typeSafeEntries`, generated aliases, explicit interfaces).
- Remove unnecessary optional chaining/unsafe assignments in tests and runtime code (e.g. use typed JSON parse helper in `universal-tools.unit.test.ts`).
- Add explicit return types where lint demands them without loosening structural types.

Validation (same sequence as Stage 1, log results):

1. `pnpm type-gen`
2. `pnpm build --filter @oaknational/oak-curriculum-sdk`
3. `pnpm type-check --filter @oaknational/oak-curriculum-sdk`
4. `pnpm lint --filter @oaknational/oak-curriculum-sdk`

**Exit Criteria:** Lint is green, runtime remains a thin delegate, and the context log notes the successful lint clean-up (Loop Check D).

---

## Stage 3 – Final Integrity & Documentation

**Objective:** Prove the restored pipeline is stable and document the outcome.

Status: ✅ complete (see context log 2025-10-18 21:34 UTC).

Tasks (for reference):

- Re-run the full suite once more:
  1. `pnpm type-gen`
  2. `pnpm build --filter @oaknational/oak-curriculum-sdk`
  3. `pnpm type-check --filter @oaknational/oak-curriculum-sdk`
  4. `pnpm lint --filter @oaknational/oak-curriculum-sdk`
  5. Targeted tests as needed (e.g. `pnpm test --filter @oaknational/oak-curriculum-sdk`)
- Update `.agent/plans/semantic-search/context.md` with:
  - Command outcomes
  - Loop check reflections
  - Any residual backlog items (legacy ops/response lint debt, downstream apps)
- Verify documentation references (architecture notes, DAG explanation) align with the final state.

**Exit Criteria:** All gates pass, documentation is synced, and the context log closes with a Loop Check E tying the work back to the cardinal rule.

---

## Stage 4 – Downstream Test Alignment

**Objective:** Bring all downstream MCP integrations back to green using the generated executor semantics.

- Update `type-gen/zodgen-core.ts` so `sanitizeSchemaKeys` no longer emits `as` assertions in generated output (use typed helpers instead).
- Regenerate SDK artefacts (`pnpm type-gen`) and ensure the zod e2e guard passes.
- Patch validation modules to emit `.js` specifiers (e.g. `./types.js`) so Node’s ESM loader resolves them in downstream apps, then rebuild.
- Refresh stdio/streamable HTTP e2e suites to use the new `{ params: … }` argument envelopes and updated error text.
- After each corrective change: rerun `pnpm type-gen`, `pnpm build --filter @oaknational/oak-curriculum-sdk`, `pnpm type-check --filter ...`, `pnpm lint --filter ...`, and the targeted e2e suite.
- Once both MCP apps and the SDK e2e suites are green, rerun `pnpm test:e2e` for the workspace and capture the results in the context log.
- Resolve the `pnpm smoke:dev` failure: either keep the strict `text/event-stream` requirement and update the smoke harness/docs, or relax the server to fall back to JSON; record the decision and rerun the smoke check.

**Exit Criteria:** All e2e suites pass (SDK, stdio, streamable HTTP); no outstanding module-resolution errors; context log records the green run.

---

## Backlog (post-plan)

- Legacy operations/response-map lint debt (`type-gen/typegen/operations/**`, `type-gen/typegen/response-map/**`) once e2e suites are stable.
- Downstream app adjustments after the SDK exports settle (e.g. UI clients).
- Broader test coverage for complex orchestration tools (search/fetch) if needed.

_Do not pick up backlog items until Stage 4 is complete and logged._
