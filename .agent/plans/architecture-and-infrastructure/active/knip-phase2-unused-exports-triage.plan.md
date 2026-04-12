---
name: "Knip Phase 2: Unused Exports Triage"
overview: "Triage and remediate 850 unused exports/types across all workspaces by evidence-based investigation."
todos:
  - id: group1-gt-archive
    content: "Group 1: Trim ground-truth-archive barrel re-exports (~441 findings)"
    status: pending
  - id: group2-gt-new
    content: "Group 2: Trim ground-truth (non-archive) + generated barrel re-exports (~65 findings)"
    status: pending
  - id: group3-hybrid
    content: "Group 3: De-export hybrid-search module internals (~29 findings)"
    status: pending
  - id: group4-indexing
    content: "Group 4: De-export indexing module internals (~78 findings)"
    status: pending
  - id: group5-adapters
    content: "Group 5: De-export/trim adapters (~46 findings)"
    status: pending
  - id: group6-streamable
    content: "Group 6: De-export streamable-http internals (~110 findings)"
    status: pending
  - id: group7-agent-tools
    content: "Group 7: De-export agent-tools type re-exports (~28 findings)"
    status: pending
  - id: group8-packages
    content: "Group 8: De-export packages internals (~15 findings)"
    status: pending
  - id: group9-types-oak
    content: "Group 9: Trim types/oak.ts facade (~23 findings)"
    status: pending
  - id: quality-gates
    content: "Run full quality gates and verify knip reduction"
    status: pending
---

# Knip Phase 2: Unused Exports Triage

**Last Updated**: 2026-04-11
**Status**: Active
**Scope**: Triage and remediate 850 unused exports/exported types (614 + 236)
**Parent**: [knip-triage-and-remediation.plan.md](./knip-triage-and-remediation.plan.md)

## Investigation Summary

Evidence gathered via codebase-wide `rg` for each reported export.
Three dominant patterns identified:

1. **Barrel bloat** (~500 findings): Barrel `index.ts` files re-export
   symbols consumed only within the module. No external file imports
   them via the barrel.
2. **Same-file-only exports** (~250 findings): Functions/types exported
   but only consumed within the defining file.
3. **Duplicate facades** (~50 findings): `types/oak.ts` re-exports
   sdk-codegen types that consumers import directly from sdk-codegen.
4. **Dead code** (~50 findings): Functions/constants with zero consumers
   anywhere in the codebase.

**Remediation taxonomy**:

- **Drop `export`**: Remove the `export` keyword, keep the symbol as
  module-private. Used for same-file-only and internal helpers.
- **Trim barrel**: Delete re-export lines from barrel `index.ts` files.
  The underlying symbols remain accessible via direct import.
- **Delete dead code**: Remove functions/constants with zero consumers.
  Per principles.md: "If a function is not used, delete it."

## Quality Gate Strategy

After each group: `pnpm knip` to verify count decreased.
After all groups: `pnpm type-check && pnpm test`.

## Resolution Plan

### Group 1: Ground-truth-archive barrel trimming (~441 findings)

**Evidence**: 54 barrel `index.ts` files re-export per-query constants
(e.g. `ART_PRIMARY_PRECISE_TOPIC_QUERY`). Only 3 experiment files
import from the top-level barrel, and only `MATHS_SECONDARY_ALL_QUERIES`.
All other consumers import directly from sub-modules.

**Remediation**:
1. Delete re-export lines from each `{subject}/{phase}/index.ts` (keep
   only `*_ALL_QUERIES`)
2. Delete re-export lines from each `{subject}/index.ts` (keep only
   `*_ALL_QUERIES`)
3. Trim top-level barrel to only export: `ALL_GROUND_TRUTH_QUERIES`,
   `MATHS_SECONDARY_ALL_QUERIES`, registry functions, diagnostic
   queries. Remove unused type re-exports and subject-level re-exports.

### Group 2: Ground-truth (non-archive) + generated (~65 findings)

**Evidence**: Similar barrel patterns in `ground-truth/` and
`ground-truths/generated/`.

**Remediation**: Trim barrels; drop exports on types used only locally.

### Group 3: Hybrid-search de-export (~29 findings)

**Evidence**: ablation-query-builders 8 functions — no external
consumers, no tests. experiment-query-builders re-exports them
unnecessarily. Phase-filter-utils helpers used same-file-only.

**Remediation**: Delete ablation re-exports from experiment barrel.
Drop `export` on same-file-only helpers.

### Group 4: Indexing de-export (~78 findings)

**Evidence**: Mix of same-file-only exports and types only used as
function parameter types.

**Remediation**: Drop `export` on internal helpers and types.

### Group 5: Adapters trim (~46 findings)

**Evidence**: sdk-cache barrel re-exports unused (consumers import
sub-modules directly). `clearSdkCache`, `resetClientSingleton` dead.
`KEY_STAGES`, `SUBJECTS` constants internal only.

**Remediation**: Trim barrels, delete dead code, drop exports.

### Group 6: Streamable-HTTP de-export (~110 findings)

**Evidence**: auth-middleware-instrumentation all same-file-only.
auth-response-helpers dead (duplicate implementation in mcp-auth.ts).
Various barrel bloat. E2E helper types unused.

**Remediation**: Drop exports, delete dead code, trim barrels.

### Group 7: Agent-tools type re-exports (~28 findings)

**Evidence**: All unused type re-exports from barrels; consumers import
functions only. Zero structural usage of exported interface types.

**Remediation**: Remove barrel type re-exports, drop export on internal
interfaces.

### Group 8: Packages internals (~15 findings)

**Evidence**: Logger, sentry-mcp, eslint, openapi-zod-client-adapter
all export types/helpers consumed only within the file.

**Remediation**: Drop `export` on internal types and helpers.

### Group 9: Types/oak.ts facade (~23 findings)

**Evidence**: Re-exports sdk-codegen search types. Consumers import
directly from `@oaknational/sdk-codegen/search`, not via `types/oak`.

**Remediation**: Delete unused re-export lines from `types/oak.ts`.

## Risks

- **Barrel trimming may remove a symbol consumed by external packages**:
  oak-search-cli is an app, not a library — it has no downstream
  consumers. Safe to trim.
- **Removing `export` may break `.d.ts` generation**: Run `pnpm build`
  after changes to verify.
- **Some unused exports may be intentional public API surface**: The
  investigation found no evidence of intentional public API for any
  flagged symbol. All consumers use direct imports.

## Non-Goals

- Reorganising ground-truth module structure (separate concern)
- Changing consumption patterns from direct imports to barrel imports
- Adding new tests for currently untested code

## Consolidation

After completion, update parent plan status and run `/jc-consolidate-docs`.
