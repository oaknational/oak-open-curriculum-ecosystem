# Legacy Biological Mapping (Pointer)

This document records the purely mechanical mapping applied in Part 1 to replace legacy biological names with conventional folders. No behaviour changed.

Mappings applied (where sources existed):

- `src/psychon` → `src/app`
- `src/organa/mcp` → `src/tools`
- `src/organa/<integration>` → `src/integrations/<integration>`
- `src/chorai/phaneron` → `src/config`
- `src/chorai/aither` → `src/logging`
- `src/chorai/stroma` → `src/types`
- `src/chorai/eidola` → `src/test/mocks` (fallback `src/mocks`)

Notes:

- Naming collisions were resolved by preferring explicit deeper imports to authoritative modules and rationalising barrels (e.g., use `tools/tools/core/types` for runtime registry API and consider aliasing as `CoreToolRegistry`).
- ESM `.js` suffix retained where runtime requires it; type‑only imports remain extensionless.
- Part 2 will remove duplicated legacy ESLint boundaries and complete barrel rationalisation.

Status: Part 1 complete for `oak-notion-mcp` and `oak-curriculum-mcp`.
