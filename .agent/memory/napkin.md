# Napkin

## Session: 2026-02-28 — Full reindex and parameter tuning

### What was done

1. Ran full bulk reindex: `pnpm es:ingest --verbose` from
   `bulk-downloads/`. 16,443 docs across 114 chunks, ~20.8 min
2. Analysed ELSER failure pattern: 26 initial failures (0.16%),
   all recovered in single retry round. Failures clustered in
   chunks 64-89 (ELSER queue saturation mid-run)
3. Increased `DEFAULT_CHUNK_DELAY_MS` from 7001ms to 8000ms for
   headroom as curriculum grows
4. Updated ADR-096 with Run 7 data and new default
5. Updated release plan (reindex done, verification outstanding)
   and onboarding prompt (shifted from "Reindex and Validate" to
   "Verify and Ship")

### Learnings

- When presenting cost comparisons, account for the FULL cost of
  both alternatives. I initially said "15 seconds vs 2 minutes"
  for retry cost vs delay increase — the user rightly pointed out
  that worst-case retry (multiple rounds with progressive backoff)
  is ~125s, making the comparison much closer (125s vs 114s). The
  conclusion held but the margin was misrepresented
- ELSER failure rate varies between runs even with identical
  parameters (0.10% on Run 6 vs 0.16% on Run 7). The dominant
  factor is cluster-side queue state, not client-side delay. This
  means optimisation beyond the current range is chasing noise
- ADR-096's optimisation history table is genuinely useful as a
  decision record — it let us compare today's run against
  historical baselines and make an informed parameter choice
- The user's reasoning for the 8000ms change was about headroom
  for future growth (more lessons, more subjects), not about
  eliminating today's failures. Good reminder: parameter decisions
  should account for where the system is going, not just where it
  is now

## Session: 2026-02-28 — Ingest CLI refactor and consolidation

### What was done

1. Committed outstanding M1-S008 work (callTool type alignment + generated files)
2. Refactored ingest CLI: renamed `es:ingest-live` to `es:ingest`, made bulk mode default, added `--api` flag, per-index filtering for both bulk and API paths
3. Updated all 12+ doc files referencing the old command name
4. Updated release plan and onboarding prompt as standalone handoff
5. Revised ADR-093 with CLI interface changes
6. Deleted cursor plan (content integrated into release plan)

### Learnings

- When refactoring CLI defaults (inverting a flag), the blast radius
  extends to: unit tests, E2E tests, doc files, smoke test comments,
  source code comments, README examples, ADRs. Subagent batching the
  doc updates was effective — 12 files updated in one pass
- Per-index filtering is a "skip early" pattern: check what's needed
  at the top of the pipeline and avoid creating work that will be
  discarded. Applied in two places: bulk-ingestion.ts (skip processing
  phases) and index-batch-generator.ts (skip generator phases)
- `VocabularyMiningStats` has 11 fields — when creating a zero-value
  fallback, a factory function (`emptyVocabularyStats()`) is cleaner
  than an inline object literal that will fail if the interface changes.
  Pattern: zero-value factories co-located with the type definition
- distilled.md: 383 lines (target <200). Still overweight from prior
  sessions. Needs dedicated pruning session.

## Session: 2026-02-28 — Lint fix: complexity refactoring

### What was done

1. Fixed 3 ESLint errors from previous session's ingest CLI refactor:
   - `ingest-live.ts` (252→241 lines): removed unnecessary shebang,
     inlined single-use `generateLogFilePath`
   - `bulk-ingestion.ts` (284→96 lines, fn 62→28 lines): extracted
     processing phases to `bulk-ingestion-phases.ts`, created
     `collectPhaseResults` orchestrator function
   - Also removed unnecessary shebang from `ingest-bulk.ts`
2. Encoded refactoring lint awareness for future agents:
   - Updated `rules.md` Refactoring section with explicit ESLint
     thresholds (250 max-lines, 50 max-lines-per-function)
   - Created `.cursor/rules/lint-after-edit.mdc` — auto-attaches on
     `.ts` files, reminds agents to check lint after edits

### Learnings

- The previous session's agent didn't run lint after substantive
  changes — the system prompt says to use `ReadLints` after edits,
  but it wasn't followed. A Cursor rule auto-attached to `.ts` files
  is more effective than a directive buried in a long rules.md because
  rules are injected into every prompt for matching files
- When splitting a file by responsibility, check that vitest module
  mocks still resolve correctly: `vi.mock('../../adapters/foo')` works
  transitively when the mock target is imported by an extracted file
  in the same directory (same relative path)
- Shebangs (`#!/usr/bin/env npx tsx`) on non-executable files waste a
  line and are misleading. Only the CLI entry point needs them
- For a refactoring TDD cycle that doesn't change public API, the
  existing tests ARE the safety net — run them before and after the
  split, no new tests needed for internal restructuring
