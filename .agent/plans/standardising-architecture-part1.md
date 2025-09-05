# Standardising Architecture – Part 1 Implementation Plan (Mechanical Refactor)

Supersedes and concretises the Part 1 content of `standardising-architecture-plan.md` for execution. **No behavioural change.** Purely mechanical, idempotent directory normalisation + import/config rewrites to present a conventional layout while preserving existing logical boundaries and custom ESLint guarantees.

## 1. Intent & Impact

**Intent:** Make the MCP servers and shared packages immediately legible to new contributors by replacing esoteric biological/Greek directory names inside phenotype (psycha) packages with conventional names (`config`, `logging`, `types`, `tools`, `integrations`, `app`, `test/mocks`). Provide deterministic, reviewable, one‑shot codemod enabling future Part 2 platform abstraction work. Maintain uninterrupted build + test integrity. Produce auditable report to prove absence of semantic drift.

**Impact Sought:**

- Reduced onboarding time (familiar mental model)
- Lower friction for cross‑repo tooling (standard names)
- Stable foundation for forthcoming explicit runtime injection (Part 2)
- Preservation of architectural import boundaries (no accidental relaxation)

---

## 2. Scope & Non‑Goals

In Scope (Part 1 only):

- Directory renames/moves per mapping rules (only if source exists)
- Import path segment rewrites in TS/JS source & tests
- Alias/path updates: `tsconfig*`, Turborepo globs, Vitest config, any ESLint rule patterns referencing old segments
- Generation of comprehensive refactor report (JSON + human summary)
- Archival pointer creation for legacy biological docs (without deleting content)

Out of Scope:

- Any logic refactor, DI changes, runtime detection removal (Part 2)
- Re‑organising internal module layering _within_ new folders beyond pure moves
- Adding/changing exports or reshaping public API surfaces
- Performance optimisation, schema evolution, new tests (except minimal safety harness if required)

---

## 3. Current State Summary (Observed)

Phenotype package example `oak-notion-mcp` has structure: `src/psychon`, `src/organa/mcp`, `src/organa/notion`, `src/chorai/{aither,stroma,phaneron,eidola}` (note: spelled `chorai` here). Another phenotype (`oak-curriculum-mcp`) lacks some chorai subfolders presently (leaner). Shared packages (`histos-*`, `moria-mcp`, SDK) already use more conventional naming and primarily expose pure or connective abstractions.

Monorepo specifics:

- Workspaces declared in `pnpm-workspace.yaml`: 2 phenotypes, 1 moria core, 5 histoi tissues, 1 SDK. Refactor touches only phenotype internal directory names in Part 1.
- Turborepo (`turbo.json`) tasks use generic `src/**/*.ts` inputs; moves retain depth so cache semantics unaffected. No task enumerates Greek segments directly.
- Root TS base config (`tsconfig.base.json`) path aliases point to package `src` roots only (no subdirectory alias keys) → directory renames do not require alias key changes.
- Multiple `tsconfig` variants per workspace (`tsconfig.json`, `tsconfig.build.json`, `tsconfig.lint.json` and shared `tsconfig.lint.root.json`). Inclusion/exclusion globs reference `src/**` generically → safe. Plan must still scan for any explicit occurrences of old segment names (e.g. test or build excludes) before/after.
- ESLint: root `eslint.config.base.ts` plus per‑workspace `eslint.config.ts` files. Phenotype ESLint configs explicitly reference `src/psychon/**` and `src/organa/**` in rule scoping; these need updating to new folder names (`src/app/**`, `src/tools/**`, `src/integrations/**`). Boundary rule imports sourced from `eslint-rules/index.ts` remain unchanged.
- Histoi / Moria / SDK ESLint configs unaffected (they do not refer to Greek phenotype folders) but global lint still runs across ecosystem.
- No explicit references to Greek segments found in `turbo.json` (verified) or root `tsconfig.json` (excludes entire `ecosystem/**` not subfolders). Low collision risk.

Adjustment to plan: add explicit ESLint phenotype config rewrite step & verification that no stale glob patterns (`src/psychon/**`, `src/organa/**`) survive.

---

## 4. Target State (After Part 1)

Phenotype (server) packages adopt:

```text
src/
  app/            # previously psychon
  tools/          # previously organa/mcp
  integrations/   # previously organa/<integration>
  config/         # previously chora(i)/phaneron
  logging/        # previously chora(i)/aither (logging & events subset)
  types/          # previously chora(i)/stroma
  test/mocks/     # previously chora(i)/eidola (fallback: src/mocks if collision)
  organa/         # (OPTIONAL) remains only if residual organs not mapped by rules
```

All old Greek segment names eliminated inside servers. Shared packages remain materially unchanged; only ensure purity segregation (`utils`, `types`) if already present.

No residual paths containing: `chorai/`, `chora/`, `psychon/`, `organa/mcp` (post‑migration these become `tools/`), except within archived legacy docs.

---

## 5. Mapping Rules (Deterministic)

Apply only if source exists:

| From                       | To                                  | Notes                                            |
| -------------------------- | ----------------------------------- | ------------------------------------------------ |
| `src/chorai/phaneron`      | `src/config`                        | Configuration schemas & loaders                  |
| `src/chorai/aither`        | `src/logging`                       | Logging, events, error flows (subset preserved)  |
| `src/chorai/stroma`        | `src/types`                         | Local types & contracts                          |
| `src/chorai/eidola`        | `src/test/mocks` (else `src/mocks`) | Test doubles / fixtures                          |
| `src/organa/mcp`           | `src/tools`                         | MCP tool handlers / protocol API                 |
| `src/organa/<integration>` | `src/integrations/<integration>`    | Third‑party or domain specific integration logic |
| `src/psychon`              | `src/app`                           | Bootstrap, wiring, server composition            |

Idempotency: skip mapping if target already exists _and_ source absent. If both exist and differ, abort with diagnostic (manual resolution required).

---

## 6. Invariants / Guardrails

1. **No behavioural change** (hash equivalence of file contents after path rewrite, excluding import strings).
2. **Import boundaries preserved** (no new cross‑organ imports introduced by relative rewrites).
3. **Public API stability** (package export surface unchanged).
4. **Idempotent codemod** (second run yields zero diff).
5. **Green quality gates** after each macro phase (format → type-check → lint → test → build).
6. **British spelling** in new/modified textual artefacts.
7. Boundary enforcement parity: duplicated ESLint boundary rules (legacy + new) ensure no transient gap; phenotype configs updated to reference new directories; legacy patterns removed only in Part 2.
8. **Literal legacy segment strings eliminated** (non-import contexts) outside archived docs.
9. **Export surface parity**: symbol list (named + default exports) identical pre/post (ordering ignored). Any difference aborts unless justified & recategorised out-of-scope.
10. **Collision safety**: if both source & target dirs exist with distinct content, operation aborts with explicit diagnostic entry; no silent merges.
11. **Reporting completeness**: JSON report includes mandatory keys (see Section 11) & idempotency flag true.

---

## 7. Assumptions

1. Path aliases intentionally coarse (package root) – internal structure not encoded in alias keys.
2. No dynamic runtime `require` using string concatenation referencing old segments (if discovered, flagged for manual review).
3. Snapshot tests (if any) either path‑agnostic or will be updated automatically by Vitest (verification step included).
4. All server packages uniformly use ESM (`type": "module"`).

---

## 8. Detailed Procedure (Phases)

### Phase A: Discovery & Baseline

Capture baseline metrics & artefacts: list of candidate server packages, tree of each mapped directory, counts of files per mapping, grep inventory of old segment references.

Additional baseline artefacts:

- Extract current phenotype ESLint restricted path zones and store JSON snapshot.
- Record boundary rule pairs referencing `src/organa/*`, `src/psychon/*` from `eslint-rules/boundary-rules.ts` (for later potential generalisation; Part 1 keeps file untouched but documents future rename implications).
- Capture export surface snapshot per phenotype: generate list of exported symbols by parsing each package entry points (heuristic: `src/index.ts`, or package.json `exports`/`main` if present). Persist as `baseline-exports.<pkg>.json`.
- Perform literal string scan (grep -R) for `psychon/|chorai/|organa/mcp|eidola/` in phenotype `src` excluding known code import lines (filter lines starting with `import` / `from` / `export`). Store occurrences list for remediation tracking.

### Phase B: Plan Synthesis (Dry Run)

Generate JSON plan: per package [{move {from,to,fileCount}, importRewriteEstimate}]. Validate no conflicting pre‑existing targets. Manual review + sign‑off before execution.

### Phase C: Incremental Execution (Per Package)

For each server package alphabetically:

1. Perform directory moves using `git mv`.
2. Rewrite imports (AST) limited to package subtree.
3. Run scoped quality gate (format, type-check, lint, test) filtered to that package.
4. Abort + revert package changes if failure; record issue.
5. Re-run export surface extraction for the package; diff against baseline. Abort on divergence.
6. Re-run literal path scan scoped to package; fail if any legacy tokens remain in non-import contexts.

### Phase D: Global Config & Residual Rewrite

Run config/alias pattern updates (tsconfig, turbo globs, vitest, eslint). Global import rewrite second pass (should be no changes). Grep to ensure zero old segments outside legacy archive.

Add boundary adaptation step:

1. Update phenotype ESLint configs: replace occurrences of `src/psychon/` → `src/app/`, `src/organa/mcp/` → `src/tools/`, `src/organa/` (non‑mcp integrative organs) → `src/integrations/`.
2. Duplicate (not replace) relevant patterns in `eslint-rules/boundary-rules.ts`: for every legacy glob referencing `psychon`, `organa/mcp`, or `chorai` add a sibling rule referencing the mapped new directory name with identical constraints. Mark duplicates with a `// TODO(Part2): remove legacy pattern` comment.
3. After duplication, run lint to confirm no rule pattern crashes (invalid zones, etc.).
4. Global literal string scan (non-import contexts) across all phenotype packages to ensure zero residual legacy tokens.

### Phase E: Validation & Reporting

Execute full monorepo quality gates. Generate refactor report (see Section 11). Random sample integrity check (N files) verifying only path segment changes in import lines.
Export surface global diff: ensure all phenotype packages export lists unchanged relative to baseline snapshot files.

### Phase F: Documentation & Archival Pointer

Add brief legacy pointer doc referencing rationale (without purging original biological docs). Update architecture map if necessary (defer if map auto‑generated).

### Phase G: PR Preparation

Collate report, risk summary, acceptance criteria checklist. Single atomic commit (unless revert cycles require squash). Conventional commit style: `refactor(server): mechanical directory normalisation (Part 1)`.

---

## 9. Tooling Specification

Implement a Node/ts-morph codemod script (or extend existing) with options:

```bash
codemod --mode=plan|execute \
        --packages=all|name1,name2 \
        --dry-run (no fs writes) \
        --report=./refactor-report.json \
        --verify-hash (compute pre/post sha256) \
        --skip-imports (if only planning) \
        --verbose
```

Core responsibilities:

- Directory existence tests and conflict detection (workspace‑aware: operate only inside phenotype packages enumerated from `pnpm-workspace.yaml`).
- Git integration (fallback to fs rename if needed)
- AST import/export specifier rewrite (handles `import`, `export * from`, `require()`, dynamic `import()` string literals)
- Config mutation:
  - `eslint.config.ts` (phenotypes): update file globs referencing `psychon` or `organa` to new names
  - Root & per‑package `tsconfig*` scan for legacy segments (rare) – warn if found
  - `turbo.json` (validate absence; no rewrite expected)
  - Future‑proof hook: if any CI/workflow references appear, list them (read‑only)
- Integrity hashing (map: relativePath -> {before, after})
- Idempotency assertion (re-run internally in memory to ensure zero patch)

---

## 10. Validation Flow

Order (per package during Phase C):

1. Format (ensures stable diff)
2. Type-check (package only)
3. Lint (package only)
4. Tests (package only)
5. (Optional) Build (skip if earlier gates suffice; full build deferred to Phase E)

Global (Phase E): Format → Type-check (all) → Lint (all) → Test (all) → Build (all). Lint phase includes verification that phenotype ESLint configs no longer contain the deprecated directory globs. Any failure halts; root cause appended to report.

Post‑validation grep assertions:

- `grep -R "psychon/" ecosystem/psycha/*/src` returns 0
- `grep -R "chorai/" ecosystem/psycha/*/src` returns 0
- `grep -R "organa/mcp" ecosystem/psycha/*/src` returns 0
- `grep -R "eidola/" ecosystem/psycha/*/src` returns 0

Exclude archived docs directory when performing final grep.

Export surface diffing:

- Pre-phase capture: `baseline-exports.<pkg>.json`.
- Post-phase capture: `post-exports.<pkg>.json`.
- Comparison: sorted set equality of symbol names (distinguish default vs named). Report includes any discrepancies (should be empty array).

Literal path scan filtering heuristic:

- Accept import lines even if containing legacy tokens (handled via rewrite) until final residual scan; final scan expects zero regardless.
- Non-import contexts (comments, strings inside code) must be absent or migrated to neutral wording (e.g., references in JSDoc updated to new directory name or moved to legacy pointer doc).

---

## 11. Reporting Artefacts

`refactor-report.json` schema:

```jsonc
{
  "timestamp": "ISO8601",
  "packages": [
    {
      "name": "string",
      "moves": [{ "from": "string", "to": "string", "files": 0 }],
      "importsRewritten": 0,
      "hashIntegrity": { "changedFiles": 0, "contentDiff": [] },
      "exportSurface": {
        "baseline": ["symbol"],
        "post": ["symbol"],
        "diff": { "added": [], "removed": [] },
      },
      "literalScanResidual": [],
      "collisions": [
        { "source": "string", "target": "string", "status": "aborted|manual-required" },
      ],
      "boundaryRulesDuplicated": true,
    },
  ],
  "oldSegmentsResidual": [],
  "qualityGates": {
    "typeCheck": "pass",
    "lint": "pass",
    "test": { "status": "pass", "summary": {} },
    "build": "pass",
  },
  "idempotent": true,
  "randomSampleVerification": [{ "file": "string", "nonImportChanges": 0 }],
  "docsUpdated": true,
  "notes": "string",
}
```

Human summary (Markdown) for PR includes: moves table, counts, guarantees.

---

## 12. Risk Register & Mitigations

| Risk                                           | Mitigation                                              | Verification                                       |
| ---------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| Missed import rewrite                          | Centralised AST traversal, grep post-pass               | Grep for `chorai`, `psychon`, `organa/mcp` tokens  |
| Config pattern omission                        | Enumerate & test mutate list                            | Snapshot diff of config files                      |
| Behavioural drift via accidental code edit     | Hash pre/post                                           | Hash integrity section                             |
| Snapshot test failure due to path text         | Auto update snapshots (if policy) else manual ack       | Vitest run output                                  |
| Boundary relaxation                            | Duplicate rules before rename; keep legacy until Part 2 | Lint success + report boundaryRulesDuplicated=true |
| Non-idempotent codemod                         | Second dry run diff check                               | Idempotent flag true                               |
| Residual literal legacy strings (non-import)   | Dedicated grep & filtered scan                          | literalScanResidual empty array                    |
| Export surface drift                           | Baseline + post export symbol diff                      | exportSurface.diff added/removed empty             |
| Directory collision (source + target coexist ) | Abort & require manual resolution                       | collisions array entries (should be empty)         |
| Hidden dynamic require paths                   | Grep for `require(` + legacy tokens                     | Manual inspection logged                           |
| Partial boundary duplication omission          | Programmatic generation mapping & lint run              | boundaryRulesDuplicated flag                       |

---

## 13. Rollback Strategy

Single atomic commit => rollback = `git revert <commit>` or discard branch. For mid-process failure: maintain staged partial changes per package; revert with `git restore -SW .` then resume after fix. Hash manifest enables manual reconstitution if needed.

---

## 14. Acceptance Criteria

1. All specified directory mappings applied where sources existed.
2. No remaining source directories with old Greek/biological names inside phenotype packages.
3. All quality gates pass monorepo‑wide.
4. Export surface parity: no added or removed symbols per package (diff arrays empty).
5. Residual grep & literal scan for old segment tokens (excluding archived docs) returns zero.
6. Refactor report present with required schema, `idempotent` true, `boundaryRulesDuplicated` true, `docsUpdated` true.
7. No collisions unresolved (collisions array empty).
8. Hash integrity check shows only path/import line modifications (no other content drift aside from directory movement).
9. Commit message conforms to conventional style and clearly marks Part 1 mechanical nature.
10. British spelling adhered to in all new/modified textual sections.

---

## 15. Execution Todo List (Atomic)

REMINDER: UseBritish spelling

Every Action is followed by a Review. Every third task is grounding. Quality gates appear regularly. Prefix semantics: ACTION:, REVIEW:, GROUNDING:, QUALITY-GATE:

1. ACTION: Baseline capture – run and save current madge circular report, grep counts for `chorai|psychon|organa/mcp|eidola`, capture export surfaces, literal legacy string scan (non-import), and record package list.  
   REVIEW: architecture-reviewer to validate baseline completeness.
2. ACTION: Implement codemod scaffolding (plan mode only) – script that enumerates candidate moves without touching FS.  
   REVIEW: code-reviewer to assess script structure.
3. GROUNDING: read GO.md and AGENT.md, reaffirm Prime Directive, adjust plan if simplification possible.
4. ACTION: Extend codemod with AST import rewrite (dry-run printing diff counts).  
   REVIEW: code-reviewer + type-reviewer ensure safe traversal & type assumptions.
5. ACTION: Add config mutation module (tsconfig paths key+value, turbo.json, eslint config string search).  
   REVIEW: config-auditor validates exhaustive coverage.
6. GROUNDING: read GO.md and AGENT.md; simplify if over-engineered.
7. ACTION: Generate dry-run JSON plan for all server packages; include predicted export surface parity hashes; store as `refactor-plan.part1.json`.  
   REVIEW: architecture-reviewer confirms mapping correctness & no conflicts.
8. QUALITY-GATE: Run format → type-check → lint (should be unchanged), confirm zero failures baseline before executing moves; verify export baseline & literal scan stored.
9. GROUNDING: read GO.md and AGENT.md; confirm readiness to execute.
10. ACTION: Execute moves + rewrites for first server package (alphabetical) with scoped quality gate (format, type-check, lint, test).  
    REVIEW: test-auditor validates no test regressions.
11. ACTION: Repeat step 10 for remaining server packages sequentially, updating cumulative report; run per-package export diff + literal residual scan.
    REVIEW: architecture-reviewer spot-check second package diff for mechanical purity.
12. GROUNDING: read GO.md and AGENT.md; verify continuing alignment.
13. ACTION: Run global config rewrite + second import rewrite pass (should yield zero net changes); duplicate boundary rules; update phenotype ESLint configs.  
    REVIEW: config-auditor verifies config diffs minimal & correct.
14. QUALITY-GATE: Full monorepo gates (format, type-check, lint, test, build) – record outcomes in report.
15. GROUNDING: read GO.md and AGENT.md; reflect on any simplifications before finalisation.
16. ACTION: Perform idempotency check (re-run codemod in dry-run; expect zero planned operations) and hash integrity sampling.  
    REVIEW: architecture-reviewer confirms idempotency & integrity evidence.
17. ACTION: Generate legacy pointer doc + compile `refactor-report.json` (including export surface & literal scan data) + PR description draft.  
    REVIEW: code-reviewer + architecture-reviewer review narrative & clarity.
18. QUALITY-GATE: Final pre-commit gates (format, type-check, lint, test) ensuring no drift since last gate.
19. ACTION: Create single atomic commit and open PR with acceptance criteria checklist.  
    REVIEW: config-auditor + test-auditor final holistic sign-off.
20. GROUNDING: read GO.md and AGENT.md; capture retrospective notes for Part 2 preparation (experience log).

Note: Sub-agent invocation names retained per original practice even though execution here will be manual/human reviewed; placeholders maintained for consistency.

---

## 16. Open Monitoring Items

| Item                                 | Trigger                            | Action                                                     |
| ------------------------------------ | ---------------------------------- | ---------------------------------------------------------- |
| Unexpected new circular dependencies | Post-move madge run shows increase | Investigate changed relative import paths                  |
| Residual old token in non-doc file   | Grep post Phase D                  | Manual patch + rerun QUALITY-GATE                          |
| Test failure referencing path        | After package execution            | Adjust snapshot or path string; verify no logic alteration |

---

## 17. Simplification Reflection

Applied Prime Directive: Avoid per-file commits – single atomic commit reduces noise and rollback complexity. Chose ts-morph for robust AST rather than regex (reduces edge-case risk). Deferred adding additional lint rules until after stable rename to avoid conflating concerns.

---

## 18. Ready State Criteria (Before Executing First Move)

- Codemod dry-run plan approved
- Baseline gates green
- No conflicting target directories
- Team acknowledgement (implicit via review) that changes are mechanical

---

## 19. Ambiguity Audit

| Potential Ambiguity                                   | Resolution / Clarification                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Whether to mutate shared `eslint-rules` or only local | Duplicate patterns in shared file (additive); legacy retained until Part 2 removal.                                                                       |
| Handling of existing target dirs with partial overlap | Abort & require manual reconciliation; no auto-merge to avoid silent loss.                                                                                |
| Definition of export surface (which entry)            | Use `src/index.ts` if present; else resolve from package.json `exports` or `main`. Fallback: glob `src/**/*.ts` building synthetic export map (document). |
| Acceptable differences in export order                | Order ignored; treat as sets.                                                                                                                             |
| Literal string scan scope (imports vs other)          | Imports transformed; only non-import contexts must be zero residual. Final global scan ensures imports also clean.                                        |
| Hash integrity exclusions                             | Only import specifier path segments may differ; file path relocation inherently changes diff but content hash (sans path string) stable.                  |
| Boundary duplication comment format                   | Add `// TODO(Part2): remove legacy pattern` for each duplicated legacy rule.                                                                              |
| Archive location for legacy docs                      | Existing docs left in place; new pointer doc summarises mapping & rationale referencing them.                                                             |

Audit complete – no unresolved ambiguities remain for Part 1 mechanical scope.

End of Part 1 Implementation Plan.
