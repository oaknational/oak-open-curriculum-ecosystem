Schema-Led Recovery Tasks

Regenerate exact descriptors, no safety nets

Revisit emit-schema.ts, generate-tool-descriptor-file.ts, generate-lib-file.ts, and any helpers. Strip every optional default, union widening, or runtime guard that isn’t spelled out by the OpenAPI schema.
Zero-parameter tools must emit interface ToolParams {} and interface ToolArgs { readonly params: ToolParams; }—no .default({}), no optional params.
Parameterised tools must carry the schema’s required keys verbatim; the generator is the only place that decides optionality.
Emit a single, total descriptor map

Generate MCP_TOOLS (and related operation-id maps) as complete, readonly literals keyed by tool name/operation id; each entry is as const satisfies ToolDescriptor<ExactClient, ExactArgs, ExactResult>.
Delete any concept of overrides or fallbacks—runtime code reads directly from these maps. A missing key or mismatch should never be “handled”; generator templates must guarantee total coverage.
Keep the contract precise

Ensure tool-descriptor.contract.ts exposes ToolDescriptor<TClient, TArgs, TResult> with the generics wired through; no unknown defaults beyond the JSON schema properties that are inherently untyped.
Remove helper types whose only purpose is to reconstruct client/arg/result types; the alias layer should be reading them straight off the literal descriptor map.
Regenerate and inspect

Run pnpm type-gen; stop immediately if it fails.
Spot-check representative generated files (zero-param tool, path/query tool, generated/runtime/lib.ts) to confirm: required keys are present, there are no optional fallbacks, and runtime utilities do nothing more than lookup → safeParse → invoke → validate.
Runtime stays wafer-thin

src/mcp/execute-tool-call.ts simply validates the tool name, reads the descriptor from MCP_TOOLS, calls tool.toolZodSchema.safeParse, invokes, and validates output. Any unexpected condition throws a McpToolError/McpParameterError immediately.
No per-name switches, no dynamic reconstruction, no optional registries.
Behavioural tests prove the contract

Update generator tests (generate-lib-file.unit.test.ts, mcp-tool-generator.unit.test.ts, etc.) to import the generated maps and assert behaviour: literal tool names, exact arg requirements, zero-param enforcement, getToolFromOperationId returning the identical descriptor.
Exercise execute-tool-call to show invalid args surface the generated describeToolArgs message and that unexpected tool names fail fast.
Quality gates and logging

Once generator/runtime tests are green, run the SDK gates in order (pnpm build/type-check/lint/test --filter @oaknational/oak-curriculum-sdk), logging outcomes in the plan/context.
Follow with unfiltered pnpm build, type-check, lint, test; record any cross-workspace issues for follow-up.
Re‑read the cardinal rule and snagging plan before closing; confirm every change keeps intelligence inside type-gen and runtime declarative.
Non-negotiable failure semantics

Any surprise (missing descriptor, schema mismatch) is a bug in the generator or schema; ensure error messages make that clear and crash early so the problem is fixed at the source.
