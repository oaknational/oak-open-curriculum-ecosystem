Stage 3.2 – Generator Refinement (Discriminated Entries)
Objective: Emit discriminated entries so TypeScript keeps the literal association between tool names and descriptors, eliminating casts.

Grounding Check

Re-read .agent/directives/rules.md and .agent/directives/schema-first-execution.md.
Log in .agent/plans/semantic-search/context.md that Stage 3.2 is starting; note the build failure from Stage 3.1.
Design & Implementation

Update generate-definitions-file.ts to emit:
const MCP_TOOL_ENTRIES = [...] as const;
type ToolEntry = (typeof MCP_TOOL_ENTRIES)[number];
export type ToolDescriptors = { [E in ToolEntry as E['name']]: E['descriptor'] };
export const MCP_TOOL_DESCRIPTORS: ToolDescriptors = { ... }
Ensure helpers (toolNames, getToolFromToolName, operation-id mapping) derive from the new data structure.
Adjust generate-types-file.ts to base ToolDescriptorForName, ToolArgsForName, etc. on ToolEntry.
Regenerate & Verify

Run scripts/check-generator-scope.sh to ensure only generator files change.
Run pnpm type-gen, inspect regenerated artefacts (especially aliases/types.ts, runtime/execute.ts) to confirm no casts remain.
Run pnpm build --filter @oaknational/oak-curriculum-sdk; stop if failures persist.
Reflection

Record results, highlighting whether the executor is now cast-free and whether TypeScript errors are resolved. If the public API changed (MCP_TOOL_DESCRIPTORS map replaced), note downstream implications for Stage 4.
Stage 4 – Runtime Façade & Tests
Objective: Keep runtime thin, map errors, and ensure tests rely only on generated helpers.

Grounding Check

Re-read rules + schema-first directive (log the reflection).
Runtime Updates

Modify src/mcp/execute-tool-call.ts if necessary: ensure it calls the regenerated callTool directly and only maps errors (no re-validation).
Test Updates

Update execute-tool-call.unit.test.ts (and any related tests) to use the regenerated executor.
Add coverage for zero-parameter tools and error pathways based on new executor behaviour.
Targeted Commands & Verification

Run (in order):
pnpm build --filter @oaknational/oak-curriculum-sdk
pnpm type-check --filter @oaknational/oak-curriculum-sdk
pnpm lint --filter @oaknational/oak-curriculum-sdk
pnpm test --filter @oaknational/oak-curriculum-sdk
Log command outcomes and any failures. If runtime fixes are required, ensure they only map errors, not revalidate or widen types.
Reflection

Log whether runtime + tests remain generator-driven, referencing any adjustments.
Stage 5 – Repo-Wide Gates
Objective: Prove the generator-first changes integrate cleanly across the monorepo.

Grounding Check

Re-read directives, log readiness for repo-wide commands.
Run Commands in Sequence

pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test
Add pnpm test:ui, pnpm test:e2e, pnpm dev:smoke if required by plan.
Logging & Loop Checks

Capture results in .agent/plans/semantic-search/context.md, noting any loop-check failures (e.g. if a command forced runtime widening).
Stage 6 – Documentation & Knowledge Capture
Objective: Document the final architecture and lessons learned.

Grounding Check

Re-read directives to ensure documentation aligns with schema-first principles.
Updates

Update .agent/plans/semantic-search/context.md with final decisions and command logs.
Refresh docs (e.g. docs/architecture/...) to describe the generator → executor flow.
Update experience logs if required by the recovery plan.
Reflection

Log the final grounding note tying work back to the cardinal rule and confirming readiness for downstream consumers.
Stage 7 – Closeout & Follow-ups
Address remaining backlog items (lint fixes in other workspaces, outstanding tests like search-index-target.unit.test.ts).
Confirm no outstanding diffs outside the intended scope (git status clean).
Prepare a concise summary (for PR or handoff) emphasising generator-first changes and how schema-first execution is now enforced.
This plan keeps each stage grounded, enforces generator-only edits where appropriate, and carries us through to fully verified runtime/tests/docs. Let me know when to proceed with Stage 3.2 implementation.
