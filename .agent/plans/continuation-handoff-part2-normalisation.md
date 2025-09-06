# Handoff Prompt: Continue Part 2 – Core, Providers, Explicit Injection

Status: IN PROGRESS. Branch: `feat/standardising_architecture_part_2`.

Scope: Implement Part 2 per `.agent/plans/standardising-architecture-part2.md`.

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

## Current Progress (up to date)

- Nested tools rename completed in both servers: `src/tools/tools` → `src/tools/runtime`; imports updated; gates PASS.
- Baseline captured: detection inventory (adaptive env + direct `process.env`), ESLint boundary snapshot.
- Core package scaffolded at `packages/core/mcp-core` with minimal `createRuntime` and provider contracts; build PASS.
- Added `ecosystem/psycha/oak-notion-mcp/src/config/runtime.json`; Notion server wiring now reads config (logger level/name and server identity). Detection logic removed from wiring; lint/type-check/build PASS.
- Alias policy corrected: no `@oaknational/*` for internal aliases; intra-package imports use relative paths; `@workspace/*` reserved for cross-workspace imports; `.js` suffix only for external deep ESM imports. Monorepo build now PASS.
- Refined wiring: static `createAdaptiveLogger` import; minimal `validateRuntimeConfig` extracted; runtime composed via core factory; all gates PASS; committed.
- Barrel rationalisation: core registry interface renamed to `CoreToolRegistry`; imports/exports updated; lint PASS.
- Providers: `packages/providers/mcp-providers-node` scaffolded with in‑memory storage, console logger, and time‑based clock; unit tests PASS; monorepo gates PASS.
- Provider contracts: shared helper at `@oaknational/mcp-core/testing/provider-contract` with consumer integration test in providers‑node; PASS.
- Docs: `docs/architecture/provider-contracts.md` and `docs/architecture/greek-ecosystem-deprecation.md` added; package READMEs link to contracts doc.

## Immediate Next Actions

1. Barrel rationalisation (avoid layered collisions; export runtime registry as `CoreToolRegistry`; keep schema types local). (PARTIAL COMPLETE)
2. Introduce configuration schema (`src/config/runtime.json`) and server DI refactor to explicit provider injection via core factory. (CONFIG READ + MINIMAL VALIDATION COMPLETE; runtime composed; injection into tools/integrations deferred to avoid behaviour drift)
3. Core package extraction to `packages/core/mcp-core/` (publish: `@oaknational/mcp-core`) and provider contract tests (Node, Cloudflare). (CORE MINIMAL COMPLETE; NODE PROVIDER SCAFFOLDED; CONTRACT TESTS ADDED FOR NODE)
4. Adopt strict import‑x hygiene after alias setup (alias‑only, no parent relatives, approved public subpaths). (PENDING – phenotype rules present; strict flags currently OFF pending alias adoption)
5. Workspace taxonomy rename and `@workspace/*` alias adoption (mechanical, later in phase). (PENDING)
6. Greek ecosystem deprecation: remove all traces in active code/comments/imports; single reference doc `docs/architecture/greek-ecosystem-deprecation.md` created (DONE); residual scan and pointer linking PENDING.

Abort if both source and target exist and differ.

## References

- Provider contracts: `docs/architecture/provider-contracts.md` (purpose, guarantees, mechanics, design principles).
- Greek ecosystem deprecation: `docs/architecture/greek-ecosystem-deprecation.md` (context and rationale; only allowed legacy reference).

- Plan: `.agent/plans/standardising-architecture-part2.md` (single source of truth for Part 2).
- High-level: `.agent/plans/standardising-architecture-high-level-plan.md`.

## Non‑Goals (for this handoff note)

- Restating Part 1 details; see Part 1 plan if needed.

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
| Config typing issues             | Use `with { type: 'json' }` and import-x rules                 | Build/lint PASS                         |

## Quality Gates

Run from repo root, single invocation per gate (wait for completion): `pnpm format`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build` after each material change. Build currently PASS; lint has known follow-up fixes pending.

## Remaining Work Sequence

None — Part 1 is complete. See `.agent/plans/standardising-architecture-part2.md` for next steps.

## Report JSON (Shape Example)

```json
{
  "timestamp": "ISO8601",
  "packages": [
    {
      "name": "oak-notion-mcp",
      "moves": [
        "packages/core/mcp-core (added)",
        "ecosystem/psycha/oak-notion-mcp/src/config/runtime.json (added)"
      ],
      "importsRewritten": 2,
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
  "notes": "Core scaffolding and config introduction complete; DI factory wiring and provider contracts next."
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
- Residual legacy tokens found in active code/comments/imports.

## Immediate Next Action

Barrel rationalisation in servers (runtime vs schema types), then DI/config introduction.

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

## Additional Acceptance & Reporting Notes

- Core package path is `packages/core/mcp-core/`; the core must not import providers.
- Export surface parity must be preserved; capture baseline and post snapshots; abort on diff.
- Legacy tokens (`psychon/`, `chorai/`, `organa/mcp`, `eidola/`) must only exist in archived docs or pointer docs after migration; include residual scan output in the report.
- Alias‑only cross‑boundary imports enforced with `eslint-plugin-import-x`; approved public subpaths documented in package READMEs and ESLint config comments.
