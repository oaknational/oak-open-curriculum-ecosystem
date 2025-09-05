# Handoff Prompt: Continue Part 1 Mechanical Architecture Normalisation

This document equips a successor agent to complete the purely mechanical Part 1 directory normalisation in the `oak-mcp-ecosystem` monorepo. Master reference: `.agent/plans/standardising-architecture-part1.md`.

## Core Directives

- Mechanical only – no behavioural change.
- Run quality gates from repo root only: format (if needed) → type-check → lint → test (unit + e2e) → build.
- Single invocation per gate; wait for completion.
- Maintain export surface parity (symbols unchanged) per phenotype.
- Codemod idempotent (second execution = no ops).
- Preserve architectural boundaries; do not relax ESLint rules.
- British spelling (REMINDER: UseBritish spelling).

## Core References

- Read and follow `GO.md` for grounding, TODO structuring, and quality gates. Replace references to external review agents with self-reviews.
- Read `.agent/directives-and-memory/AGENT.md` and linked documents.

## Repository Snapshot

Phenotype packages (`ecosystem/psycha/`):

- `oak-curriculum-mcp` – MIGRATED (psychon→app, organa/mcp→tools). Imports rewritten. Gates green.
- `oak-notion-mcp` – MIGRATED (psychon→app, organa/mcp→tools, organa/notion→integrations/notion, chorai/\*→config/logging/types/test/mocks). Imports rewritten; minimal post‑fixes applied (dynamic import `.js` suffixes, layered barrel targets).

Baseline export surface & filtered legacy token scan: partial (needs completion for `oak-notion-mcp` pre/post migration).

## Mapping Rules

| From                       | To                                      |
| -------------------------- | --------------------------------------- |
| `src/chorai/phaneron`      | `src/config`                            |
| `src/chorai/aither`        | `src/logging`                           |
| `src/chorai/stroma`        | `src/types`                             |
| `src/chorai/eidola`        | `src/test/mocks` (fallback `src/mocks`) |
| `src/organa/mcp`           | `src/tools`                             |
| `src/organa/<integration>` | `src/integrations/<integration>`        |
| `src/psychon`              | `src/app`                               |

Abort if both source and target exist and differ.

## Tooling

- Execution codemod: `scripts/refactor/part1-codemod-exec.ts` (git mv + import rewrite + integration folder mapping + idempotent skips).

## Non‑Goals

- No logic changes or public API modifications.
- Do not delete legacy docs; instead add a pointer doc.
- Do not remove legacy ESLint boundary patterns (duplicate with TODO markers).

## Export Surface Parity

1. Capture baseline exports for `oak-notion-mcp` (before migration) from `src/index.ts` (or declared entry). Treat `default` separately.
2. Capture post-migration exports; compare sets.
3. Abort on any added/removed symbols.

## Legacy Tokens

`psychon/`, `chorai/`, `organa/mcp`, `eidola/`.

After full migration these must only appear in archived docs or the pointer doc (not in active code/comments/imports).

## Risks & Mitigations

| Risk                             | Mitigation                                                     | Verification                            |
| -------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| Missed import rewrite            | ts-morph traversal + final grep                                | Type-check PASS + grep clean            |
| Export drift                     | Pre/post export snapshot diff                                  | Diff arrays empty                       |
| Boundary relaxation              | Duplicate rules (legacy + new)                                 | Lint PASS                               |
| Non-idempotent script            | Re-run expecting zero ops                                      | Second run no changes                   |
| Naming collisions across layers  | Prefer explicit deep imports; disambiguate barrel export names | Type-check PASS; clear symbol ownership |
| Confusing nested tools directory | Rename deferred to Part 2 (`tools/tools` → `tools/runtime`)    | Tracked in Part 2 acceptance            |
| Residual tokens                  | Global grep & remediate                                        | Residual array empty                    |

## Acceptance Criteria

1. All mappings applied where sources existed (both phenotypes).
2. No legacy directory names under phenotype `src/` trees.
3. Root gates PASS (type-check, lint, test, build).
4. Export surface parity (no added/removed symbols).
5. Residual token scan clean (exempt: archived + pointer doc).
6. `refactor-report.json` present: required schema, `idempotent:true`, `boundaryRulesDuplicated:true`.
7. No collisions unresolved.
8. Only import path segment edits + relocations (no semantic drift).
9. Single atomic commit message: `refactor(server): mechanical directory normalisation (Part 1)`.
10. British spelling maintained.

## Remaining Work Sequence

1. Migration status: `oak-notion-mcp` migrated with codemod (directories moved; imports rewritten). Post-fixes applied:
   - ESM `.js` suffix added to runtime internal imports where required (e.g., dynamic/server wiring and barrels exporting concrete files).
   - Layered barrels resolved to correct layers (e.g., `createToolHandlers` now exported from `src/tools/tools/handlers` via `src/tools/index.ts`).
   - `ToolRegistry` ambiguity resolved: runtime registry API imported from `tools/tools/core/types`; schema mapping kept local to `tools/tools/types`.

2. Root gates: all PASS (type‑check, lint, tests, build). Export parity verified (no diff). Residual scans clean. Idempotency confirmed (codemod no‑op). Report and pointer doc generated.
3. Export parity capture & diff for `oak-notion-mcp` (pre/post snapshots) – should be identical.
4. Legacy token scan (non-import contexts) and remediate.
5. Duplicate ESLint boundary rules & add new globs (legacy retained with `// TODO(Part2)` comments). Note: central rules already updated to reflect tools↔integrations isolation; per‑package config aligned to enforce zones only for Part 1 (defer strict `no-internal-modules` and `no-relative-parent-imports` to Part 2).
6. Idempotency check: re-run codemod (`tsx scripts/refactor/part1-codemod-exec.ts --packages=oak-notion-mcp`) expecting zero ops.
7. Global residual token grep (imports + non-import) confirm clean (exclude archived/pointer docs).
8. Generate `refactor-report.json` + pointer doc `docs/architecture/legacy-biological-mapping.md`. (Generated)
9. Final full gates and atomic commit & PR (attach report & acceptance checklist).

## Report JSON (Shape Example)

```json
{
  "timestamp": "ISO8601",
  "packages": [
    {
      "name": "oak-notion-mcp",
      "moves": [],
      "importsRewritten": 0,
      "exportSurface": { "baseline": [], "post": [], "diff": { "added": [], "removed": [] } },
      "literalScanResidual": [],
      "collisions": [],
      "hashIntegrity": { "changedFiles": 0, "contentDiff": [] },
      "boundaryRulesDuplicated": true
    }
  ],
  "oldSegmentsResidual": [],
  "qualityGates": {
    "typeCheck": "pass",
    "lint": "pass",
    "test": { "status": "pass", "summary": {} },
    "build": "pass"
  },
  "idempotent": true,
  "randomSampleVerification": [],
  "docsUpdated": true,
  "notes": ""
}
```

## Commands (root)

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm format
```

## Abort Conditions

- Export parity diff non-empty.
- Collision during migration.
- Idempotency re-run produces planned operations.
- New boundary lint failures after duplication.

## Immediate Next Action

Run remaining quality gates from repo root (`pnpm lint`, `pnpm test`, `pnpm build`). Then perform export parity, ESLint boundary duplication, idempotency check, residual scans, and reporting. Record outcomes in the master plan file.

---

Completion = all acceptance criteria satisfied + report + atomic commit + PR.

## Queued Part 2 Work (Workspace taxonomy)

- Rename workspace taxonomy (mechanical):
  - `ecosystem/psycha/<server>` → `apps/<server>`
  - `ecosystem/moria/moria-mcp` → `packages/core/mcp-core`
  - `ecosystem/histoi/histos-logger` → `packages/libs/logger`
  - `ecosystem/histoi/histos-transport` → `packages/libs/transport`
  - `ecosystem/histoi/histos-storage` → `packages/libs/storage`
  - `ecosystem/histoi/histos-env` → `packages/libs/env`
  - `ecosystem/histoi/histos-runtime-abstraction` → `packages/libs/runtime`
  - `packages/oak-curriculum-sdk` → `packages/sdks/oak-curriculum-sdk`

- Introduce internal alias scope distinct from publish scope:
  - Reserve `@oaknational/*` for published packages only
  - Add `@workspace/*` aliases in `tsconfig.base.json`:
    - `@workspace/apps/*` → `apps/*/src/*`
    - `@workspace/core/*` → `packages/core/*/src/*`
    - `@workspace/libs/*` → `packages/libs/*/src/*`
    - `@workspace/sdks/*` → `packages/sdks/*/src/*`

- Update configs (ESLint boundaries, Turbo, test globs) accordingly and run idempotent codemod (git mv + AST import rewrite). Full gates must be green post‑rename.
