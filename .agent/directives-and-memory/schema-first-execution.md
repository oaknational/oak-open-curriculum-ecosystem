# Schema-First MCP Execution Directive

> **Status**: Mandatory. Applies to all code paths that deal with MCP tool registration, argument validation, invocation, and response handling.

## Cardinal Intent

Every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts that flow directly from the Open Curriculum OpenAPI schema. Runtime files act only as very thin façades; they do **not** duplicate logic, infer types, or widen unions. The generator is the single source of truth.

## Required Flow

1. **Contract** – `ToolDescriptor<TName, TClient, TArgs, TResult>` defines the generic contract without importing generated data.
2. **Definitions** – `MCP_TOOL_DESCRIPTORS` (or equivalent) is the canonical literal map keyed by tool name. It exports only readonly data and satisfies the `ToolDescriptor` contract for each tool.
3. **Aliases** – `ToolArgsForName`, `ToolClientForName`, `ToolResultForName`, etc. are derived from the literal descriptor map. They never guess or widen types.
4. **Runtime** – Generated helper(s) (e.g. `callTool`, `callToolWithValidation`) validate arguments, invoke descriptors, and validate output using nothing but the descriptor literal and the alias types.
5. **Facade** – Authored runtime files (e.g. `src/mcp/execute-tool-call.ts`) simply call the generated helpers, adding repository-specific error mapping if necessary.

## Prohibited Practices

- Hand-authoring helper functions that widen types (returning `unknown`, omitting generics, or unionising tool names).
- Editing generated files manually instead of updating the generator templates.
- Introducing overrides, registries, or fallbacks that “cope” with missing descriptors—missing data is a generator bug, so fail fast.
- Re-validating or re-parsing tool arguments in authored runtime code.

## Expectations

- **Generator-first mindset**: When behaviour needs to change, update the templates under `type-gen/typegen/mcp-tools/**/*` and rerun `pnpm type-gen`. If the change cannot be expressed there, reconsider the approach.
- **Comprehensive TSDoc**: Generator templates must emit TSDoc comments that describe the dependency order and the role of each layer. Authored runtime files must reference the generated helpers explicitly (e.g. `@see ../../types/generated/.../execute.ts`).
- **Tests import generated helpers**: Behavioural tests should import the generated executors to prove correctness. Avoid string/snapshot tests that hide the real flow.
- **Documentation**: Any generator or runtime change affecting this pipeline must also update the architectural notes and plan context so future agents recognise the constraint.

## Compliance

- All Pull Requests and agent tasks must confirm adherence to this directive.
- If a proposed change cannot satisfy this directive, the task should be escalated or rejected—never waive the rule.
