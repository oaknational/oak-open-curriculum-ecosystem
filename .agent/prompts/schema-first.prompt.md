Cardinal Alignment Workflow

Stage 0 – Anchor

Re-read .agent/directives-and-memory/rules.md and .agent/directives-and-memory/schema-first-execution.md.
Log a short grounding note in .agent/plans/semantic-search/context.md confirming current repo state and the cardinal-rule goalposts.

Stage 1 – Diagnose

Inspect generate-types-file.ts and generate-definitions-file.ts to understand how ToolArgsForName is currently derived.
Review the generated artefacts (definitions.ts, aliases/types.ts, runtime/execute.ts) to map where argument types become widened.
Summarise the findings and suspected root cause in the context log.
Checkpoint 1 – Reflection (MANDATORY)

Re-read the rules + schema-first directive.
Write a reflection in the context log: does the diagnosis point to a generator-first fix? Are we avoiding runtime patches?

Stage 2 – Design the Generator Fix

Sketch (in the log or a scratch file) how to emit descriptor-specific invocation helpers or narrowed arg types at generation time.
Validate that the design fits the schema-first DAG (contract → descriptors → aliases → executor).
Checkpoint 2 – Reflection (MANDATORY)

Re-read rules + directive again.
Confirm the proposed design keeps runtime code thin and avoids casting. Record the decision.

Stage 3 – Implement Generator Changes

Update generator templates (generate-definitions-file.ts, generate-types-file.ts, generate-execute-file.ts) to produce the refined types/helpers.
Run pnpm type-gen.
Inspect regenerated artefacts to ensure callTool and parseToolArguments now work without casts or widened unions.
Checkpoint 3 – Reflection (MANDATORY)

Re-read rules + directive.
Note whether any generated file hints at runtime widening; if so, loop back before moving on.

Stage 4 – Runtime Façade & Tests

Adjust src/mcp/execute-tool-call.ts to consume the new executor surface, keeping logic minimal.
Update unit/integration tests to import the regenerated helpers and assert zero-parameter/error handling behaviour.
Run targeted commands: pnpm build --filter @oaknational/oak-curriculum-sdk, pnpm type-check --filter …, pnpm lint --filter …, pnpm test --filter ….
Checkpoint 4 – Reflection (MANDATORY)

Re-read rules + directive.
Evaluate whether the façade and tests remain generator-driven. Document the assessment.

Stage 5 – Repo-wide Verification

Execute the full quality suite (pnpm build, pnpm type-check, pnpm lint, pnpm test).
Capture command outcomes and any deviations in .agent/plans/semantic-search/context.md.

Checkpoint 5 – Reflection (MANDATORY)

Final re-read of rules + directive.
Summarise how the end state satisfies the cardinal rule and schema-first approach; note any follow-up actions.

Stage 6 – Documentation & Wrap-up

Update relevant docs/experience notes to describe the new generator-to-runtime flow.
Add a concise change summary to the context log, ready for review.
