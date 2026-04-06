---
fitness_line_target: 100
fitness_line_limit: 150
fitness_char_limit: 9000
fitness_line_length: 100
split_strategy: "This is a focused directive; if it grows, extract implementation details to the SDK README"
---

# Schema-First MCP Execution Directive

> **Status**: Mandatory. Applies to all code paths that deal with MCP tool registration, argument validation, invocation, and response handling.

## Cardinal Intent

Per the cardinal rule (`.agent/directives/principles.md` §Cardinal Rule): every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts that flow directly from the Open Curriculum OpenAPI schema. Runtime files act only as very thin façades; they do **not** duplicate logic, infer types, or widen unions. The generator is the single source of truth.

## Required Flow

1. **Contract** – `ToolDescriptor<TName, TClient, TArgs, TResult>` defines the generic contract without importing generated data.
2. **Definitions** – `MCP_TOOL_DESCRIPTORS` (or equivalent) is the canonical literal map keyed by tool name. It exports only readonly data and satisfies the `ToolDescriptor` contract for each tool.
3. **Aliases** – `ToolArgsForName`, `ToolClientForName`, `ToolResultForName`, etc. are derived from the literal descriptor map. They never guess or widen types.
4. **Runtime** – Generated helper(s) (e.g. `callTool`, `callToolWithValidation`) validate arguments, invoke descriptors, and validate output using nothing but the descriptor literal and the alias types. Response handling is keyed by **method + path + status**, so every HTTP status documented in the schema maps to a readonly descriptor generated at sdk-codegen time.
5. **Facade** – Authored runtime files (e.g. `src/mcp/execute-tool-call.ts`) simply call the generated helpers, adding repository-specific error mapping if necessary.

## Prohibited Practices

- Hand-authoring helper functions that widen types (returning `unknown`, omitting generics, or unionising tool names).
- Editing generated files manually instead of updating the generator templates.
- Introducing overrides, registries, or fallbacks that “cope” with missing descriptors—missing data is a generator bug, so fail fast.
- Re-validating or re-parsing tool arguments in authored runtime code.

## Expectations

- **Generator-first mindset**: When behaviour needs to change, update the templates under `code-generation/typegen/mcp-tools/**/*` and rerun `pnpm sdk-codegen`. If the change cannot be expressed there, reconsider the approach.
- **Comprehensive TSDoc**: Generator templates must emit TSDoc comments that describe the dependency order and the role of each layer. Authored runtime files must reference the generated helpers explicitly (e.g. `@see ../../types/generated/.../execute.ts`).
- **Tests import generated helpers**: Behavioural tests should import the generated executors to prove correctness. Avoid string/snapshot tests that hide the real flow.
- **Documentation**: Any generator or runtime change affecting this pipeline must also update the architectural notes and plan context so future agents recognise the constraint.

## Type Predicates in the Schema-First Flow

The Constant-Type-Predicate Pattern
([ADR-153](../../docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md))
is how schema-first types bridge to runtime. Constants extracted at
generation time produce type predicates that validate `unknown` input
at system boundaries. This is the mechanism by which the Cardinal Rule
is satisfied at runtime: data enters as `unknown`, passes through a
generated predicate, and emerges with full schema-derived type
information. See
[typescript-practice.md](../../docs/governance/typescript-practice.md)
for the implementation pattern and decision tree.

## Compliance

- All Pull Requests and agent tasks must confirm adherence to this directive.
- If a proposed change cannot satisfy this directive, the task should be escalated or rejected—never waive the rule.
