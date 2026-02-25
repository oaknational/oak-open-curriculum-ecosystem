# Architecture Decision Record: MCP Tool Generation Layering - Directional Acyclic Graph

- **Date:** 2025-10-19
- **Status:** Proposed

## Context

We are refactoring the MCP tool generation pipeline to enforce a unidirectional dependency flow:

```text
contract (generic interfaces)
  ➜ generated/data (literal map + helpers)
    ➜ generated/aliases (types derived from the map)
      ➜ generated/runtime (registry + tool descriptors)
        ➜ consuming runtime code
```

Previous iterations allowed the generic contract to import helper types, creating circular references and making it easy to leak the literal `MCP_TOOLS` map. Build failures (`ToolDescriptor` collapsing to `never`, missing runtime imports) highlighted the need for clear separation.

## Decision

1. **Directory structure**
   - Emit the generic contract into `contract/tool-descriptor.contract.ts` (name may vary) with zero imports from generated data. Add guard comments explaining the restriction.
   - Place the literal descriptor data under `generated/data/` — includes `definitions.ts`, the curated `index.ts`, and the per-tool descriptor files beneath `generated/data/tools/`. These modules may depend on the contract but nothing else.
   - Emit derived types (`types.ts`) under `generated/aliases/`, with naming that reflects their source (e.g., `ToolArgsForName`).
   - Emit runtime affordances (`lib.ts`) under `generated/runtime/`, importing only from the alias layer.

2. **Naming conventions**
   - Contract file exports `ToolDescriptorContract` (or similar) to emphasise its generic nature.
   - Literal map constant named `MCP_TOOL_DEFINITIONS` (internal) while preserving existing public helper names.
   - Alias types suffixed `ForName`/`ForOperationId` to show their provenance.
   - Guard comments at the top of contract files to document the allowed dependency direction.

3. **Template updates**
   - Modify generator templates to emit files into the new directories with the chosen names.
   - Adjust import paths to match the new structure and ensure all references respect the one-way flow.

4. **Testing**
   - Regenerate artefacts via `pnpm sdk-codegen`.
   - Ensure `pnpm build --filter @oaknational/curriculum-sdk` succeeds after restructuring.
   - Update generator tests to load the output modules and assert behaviour instead of string snapshots.

## Consequences

- Clear layering prevents future circular imports and makes it obvious where each concern lives.
- Runtime and registry code consume derived helpers rather than the raw literal map, keeping the literal internal.
- The generator codebase becomes slightly more complex due to additional directories and imports, but the resulting clarity outweighs the cost.
