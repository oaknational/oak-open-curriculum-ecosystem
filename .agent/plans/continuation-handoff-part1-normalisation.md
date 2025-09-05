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

## Repository Snapshot

Phenotype packages (`ecosystem/psycha/`):

- `oak-curriculum-mcp` – MIGRATED (psychon→app, organa/mcp→tools). Imports rewritten. Gates green.
- `oak-notion-mcp` – LEGACY (still: `src/psychon`, `src/organa/mcp`, `src/organa/notion`, `src/chorai/{aither,stroma,phaneron,eidola}`).

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

| Risk                  | Mitigation                      | Verification                 |
| --------------------- | ------------------------------- | ---------------------------- |
| Missed import rewrite | ts-morph traversal + final grep | Type-check PASS + grep clean |
| Export drift          | Pre/post export snapshot diff   | Diff arrays empty            |
| Boundary relaxation   | Duplicate rules (legacy + new)  | Lint PASS                    |
| Non-idempotent script | Re-run expecting zero ops       | Second run no changes        |
| Residual tokens       | Global grep & remediate         | Residual array empty         |

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

1. Migrate `oak-notion-mcp`:

```bash
tsx scripts/refactor/part1-codemod-exec.ts --packages=oak-notion-mcp
```

2. Root gates: `pnpm type-check`, `pnpm lint`, `pnpm test`.
3. Export parity capture & diff.
4. Legacy token scan (non-import contexts); remediate.
5. Duplicate ESLint boundary rules & add new globs (legacy retained with `// TODO(Part2)` comments).
6. Secondary no-op import rewrite (expect zero changes).
7. Full gates including `pnpm build`.
8. Idempotency check: re-run codemod (zero ops) + random moved file sample (only specifier changes).
9. Global residual token grep (imports + non-import) confirm clean.
10. Generate `refactor-report.json` + pointer doc `docs/architecture/legacy-biological-mapping.md`.
11. Final gates.
12. Atomic commit & PR (attach report & acceptance checklist).

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

Perform migration of `oak-notion-mcp` (step 1) then run root gates (step 2) and record results in the master plan file.

---

Completion = all acceptance criteria satisfied + report + atomic commit + PR.
