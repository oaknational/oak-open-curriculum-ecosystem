1. Keep vs discard
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

Re-read principles.md and schema-first-execution.md.
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
