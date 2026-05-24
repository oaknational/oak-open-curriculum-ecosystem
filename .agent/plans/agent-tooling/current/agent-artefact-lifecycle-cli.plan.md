---
name: "Agent Artefact Lifecycle CLI — Single Enforcement Surface for Skills, Rules, Commands, Hooks"
overview: >-
  Consolidate the full agent-artefact lifecycle (author, install, update,
  remove, inventory, verify) into a new agent-tools CLI section so the
  PDR-009 / ADR-125 contract becomes measurable, enforced, and trivially
  detectable when violated. Replaces scripts/validate-portability.ts with
  agent-tools artefacts verify; absorbs the future ingestion-tooling plan;
  sets a measurable skill-load budget.
todos:
  - id: 0-1-surface-confirmation
    content: "0.1 Owner-confirm CLI surface: subcommand list, pnpm script-name shape, supersede relationships."
    status: pending
    depends_on: []
  - id: 0-2-build-vs-buy
    content: "0.2 Build-vs-buy attestation; document npx-skills wrapping requirement."
    status: pending
    depends_on: []
  - id: 0-3-reviewer-alignment
    content: "0.3 Reviewer phase-alignment incl. config-expert + type-expert for migration safety."
    status: pending
    depends_on: []
  - id: 1-1-list-skill-cycle
    content: "1.1 Cycle: artefacts list --type skill (test + product, atomic landing)."
    status: pending
    depends_on: [0-1-surface-confirmation]
  - id: 1-2-list-other-types
    content: "1.2 Cycles: artefacts list for rule, command, hook, sub-agent, plugin."
    status: pending
    depends_on: [1-1-list-skill-cycle]
  - id: 1-3-inventory-output
    content: "1.3 Cycle: artefacts inventory --output writes deterministic markdown."
    status: pending
    depends_on: [1-2-list-other-types]
  - id: 2-1-verify-extraction
    content: "2.1 Cycle: extract runVerify(opts) with explicit repoRoot + suppression sets."
    status: pending
    depends_on: [1-3-inventory-output]
  - id: 2-2-shim-and-ci
    content: "2.2 Cycle: legacy script shim; resolve build-ordering with CI."
    status: pending
    depends_on: [2-1-verify-extraction]
  - id: 2-3-strict-spec-flag
    content: "2.3 Cycle: --strict-spec flag for agentskills.io checks."
    status: pending
    depends_on: [2-2-shim-and-ci]
  - id: 3-0-shared-helpers
    content: "3.0 Cycle: extract shared adapter-generation helpers (precondition for 3.1+)."
    status: pending
    depends_on: [2-3-strict-spec-flag]
  - id: 3-1-add-skill-vendor
    content: "3.1 Cycle: add-skill --source for vendor packs."
    status: pending
    depends_on: [3-0-shared-helpers]
  - id: 3-2-add-skill-canonical
    content: "3.2 Cycle: add-skill --canonical for native skills (parallel-safe with 3.3-3.5)."
    status: pending
    depends_on: [3-0-shared-helpers]
  - id: 3-3-add-rule
    content: "3.3 Cycle: add-rule with trigger generation."
    status: pending
    depends_on: [3-0-shared-helpers]
  - id: 3-4-add-command
    content: "3.4 Cycle: add-command with jc-* adapter generation."
    status: pending
    depends_on: [3-0-shared-helpers]
  - id: 3-5-add-hook
    content: "3.5 Cycle: add-hook with platform-specific entries."
    status: pending
    depends_on: [3-0-shared-helpers]
  - id: 4-1-update-skill
    content: "4.1 Cycle: update-skill (re-fetch + diff + regenerate)."
    status: pending
    depends_on: [3-1-add-skill-vendor]
  - id: 4-2-update-rule-command-hook
    content: "4.2 Cycle: update-rule / update-command / update-hook (regenerate adapters)."
    status: pending
    depends_on: [3-3-add-rule, 3-4-add-command, 3-5-add-hook]
  - id: 4-3-remove
    content: "4.3 Cycle: remove --type --name (symmetric; refuse on dependents)."
    status: pending
    depends_on: [4-1-update-skill, 4-2-update-rule-command-hook]
  - id: 5-1-name-format
    content: "5.1 Cycle: agentskills.io name-format check."
    status: pending
    depends_on: [2-3-strict-spec-flag]
  - id: 5-2-description-form
    content: "5.2 Cycle: description must include what + when."
    status: pending
    depends_on: [5-1-name-format]
  - id: 5-3-description-length
    content: "5.3 Cycle: description >1024 chars fails."
    status: pending
    depends_on: [5-2-description-form]
  - id: 5-4-body-advisory
    content: "5.4 Cycle: SKILL.md body >5000 tokens warns."
    status: pending
    depends_on: [5-3-description-length]
  - id: 6-1-budget-count
    content: "6.1 Cycle: skill-load count check (default TBD post-Phase-0 measurement)."
    status: pending
    depends_on: [5-4-body-advisory]
  - id: 6-2-budget-tokens
    content: "6.2 Cycle: token-budget estimate."
    status: pending
    depends_on: [6-1-budget-count]
  - id: 7-1-plugin-audit
    content: "7.1 Cycle: plugin-audit cross-references usage signals incl. hooks + active plans."
    status: pending
    depends_on: [6-2-budget-tokens]
  - id: 8-1-adr-125-amendment
    content: "8.1 ADR-125 amendment: strip count tables; reference CLI capability (not argv)."
    status: pending
    depends_on: [7-1-plugin-audit, 4-3-remove]
  - id: 8-2-archive-predecessor
    content: "8.2 Move canonical-first-skill-pack-ingestion-tooling.plan.md from future/ to archive/."
    status: pending
    depends_on: [8-1-adr-125-amendment]
  - id: 8-3-memory-updates
    content: "8.3 Memory entries reflect new operational shape."
    status: pending
    depends_on: [8-1-adr-125-amendment]
  - id: 9-1-consolidate
    content: "9.1 Run /jc-consolidate-docs and pattern-graduation review."
    status: pending
    depends_on: [8-2-archive-predecessor, 8-3-memory-updates]
isProject: false
---

# Agent Artefact Lifecycle CLI — Single Enforcement Surface

**Last Updated**: 2026-05-06
**Status**: 🔴 NOT STARTED (decision-complete 2026-05-06)
**Decision-completion seal**: All Phase-N internal decisions are
recorded inline; no item awaits owner sign-off. Execution can begin at
Phase 1.1 without re-opening Phase 0 questions. The remaining "Phase 0"
work is purely the act of recording the build-vs-buy attestation as a
plan artefact, not a decision exercise.
**Scope**: Build a single `agent-tools artefacts` CLI section that owns the
authoring, installation, update, removal, inventory, and verification of
all agent-artefact types (skills, rules, commands, hooks, sub-agents) so
the PDR-009 / ADR-125 contract is enforced at the operational layer, not
just at the post-hoc validation layer.
**Source report**: [`agent-artefact-portability-audit-2026-05-06.report.md`](agent-artefact-portability-audit-2026-05-06.report.md)
**Companion (urgent)**: [`agent-artefact-load-pressure-relief.plan.md`](agent-artefact-load-pressure-relief.plan.md)
**Supersedes**: [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md)
(folded in as Phase 3 ingestion subset).

---

## Context

### Problem

The audit on 2026-05-06 (see source report) confirmed that the structural
contract (PDR-009 + ADR-125) is sound and validator-enforced post-hoc, but
the **operational** layer — install, update, remove, configure plugins,
emit inventory — is governed only by manual procedure. The drift modes
that result:

1. ADR-125's count tables drift because they are embedded, not emitted.
2. Vendor-skill installs require manual canonicalisation; step-omission
   slips past the validator window.
3. Plugin enable/disable lives outside the contract; redundant or unused
   plugins accumulate undetected.
4. Skill-load count grows unbounded; Claude Code silently truncates
   discovery once an effective context budget is exceeded.
5. Description-form spec compliance (`what` AND `when`) is not enforced.

### Intent

Move every operational interface inside one CLI surface. The contract
becomes:

- **Authoring**: `agent-tools artefacts add-<type>` — one command per
  type, generates canonical content + every required platform adapter.
- **Updating**: `agent-tools artefacts update <type> <name>` — diff
  upstream against canonical; regenerate adapters; refresh lock.
- **Removing**: `agent-tools artefacts remove <type> <name>` —
  symmetric across platforms; refuse if other artefacts depend on it.
- **Inventorying**: `agent-tools artefacts list [--type X]
  [--platform Y]`; `agent-tools artefacts inventory --output <path>`
  emits a generated inventory page (replaces ADR-125 count tables).
- **Verifying**: `agent-tools artefacts verify` (replaces
  `pnpm portability:check`); supersets it with description-form,
  budget, plugin-utilisation, and spec checks.

The CLI is the single source of operational truth. The validator becomes
the *engine* of the verify subcommand. ADR-125 keeps its structural
rules and loses its drift-prone count tables.

### Existing capabilities

- `agent-tools/` already hosts cli sections: `bin`, `claude`, `codex`,
  `collaboration-state`, `commit-queue`, `core`, `cursor`. The new
  section is `artefacts`.
- `scripts/validate-portability.ts` already encodes 12 contract checks;
  it migrates verbatim then expands.
- `skills-lock.json` already records vendor-skill provenance + hashes.
- `.agent/plans/agent-tooling/future/canonical-first-skill-pack-ingestion-tooling.plan.md`
  is folded in as the ingestion subset of Phase 3.

### Issue 1: Single source of operational truth

**Evidence**: validator at `scripts/validate-portability.ts`; install
flow documented in
`agent-infrastructure-portability-remediation.plan.md` §Phase 1; plugin
configuration in `.claude/settings.json`; inventory tables in ADR-125
(stale). Three different surfaces, three different drift modes.

**Root cause**: design surface (PDR-009 + ADR-125) and validation surface
(validate-portability.ts) are well-defined; *authoring and configuration*
surfaces are not.

### Issue 2: ADR-125 count drift

**Evidence**: ADR-125 documents 35 rules, 36 skills, 37 Cursor triggers
(2026-04-28 amendment). Live: 52 rules, 37 skills, 54 Cursor triggers.

**Root cause**: counts embedded in a permanent doc. Owner-stated rule:
moving targets belong in plans (ephemeral), not in permanent docs.

### Issue 3: Skill-load budget is unmeasured

**Evidence**: ~112 active skills surfaced in current sessions; Claude
Code observed dropping skills.

**Root cause**: the architecture treats skill count as an unbounded
list. Need a measurable ceiling and a check that fails when exceeded.

### Issue 4: Plugin utilisation is ungoverned

**Evidence**: `mcp-apps`, `cloudflare`, `linear` enabled but
redundant/unused (urgent plan resolves the immediate cases). No
mechanism to detect future cases.

**Root cause**: plugin enable/disable is a settings concern; no contract
check exists for "is this plugin used?".

### Issue 5: Description-form spec drift

**Evidence**: `jc-go`, `parallel-agents`, `complex-merge` wrappers lack
the agentskills.io-required "Use when…" trigger.

**Root cause**: validator does not check description form. The form
matters because Claude (and other platforms) use the description for
skill-selection routing; descriptions without triggers reduce
selection accuracy.

---

## Quality Gate Strategy

Per cycle (during development, before Phase 2 completion):

```bash
pnpm test:root-scripts                     # script-level unit tests
pnpm exec tsx agent-tools/src/artefacts/cli.ts verify  # CLI under construction (tsx — pre-build)
pnpm portability:check                     # legacy script (until Phase 2 retirement)
pnpm type-check
pnpm lint:fix
pnpm test
```

**Gate-invocation transition (per `use-built-agent-tools-only`
memory rule):** the per-cycle `tsx` invocation above is a development
convenience only. After Phase 2 completes, the gate switches to the
built form (`pnpm agent-tools:artefacts -- verify` reads from
`dist/`). Phase 2.4 records this transition explicitly.

Per phase:

```bash
pnpm build
pnpm test:e2e        # if any artefact CLI integrates with e2e
pnpm subagents:check
```

---

## Architecture

### CLI shape

```text
pnpm agent-tools:artefacts -- <subcommand> [args]
```

| Subcommand | Purpose |
|---|---|
| `list [--type X] [--platform Y]` | Print inventory rows; --type ∈ skill\|rule\|command\|hook\|sub-agent\|plugin |
| `inventory --output <path>` | Write a fresh inventory markdown page (replaces ADR-125 tables) |
| `verify [--strict-spec] [--budget N]` | Run all contract checks; supersedes pnpm portability:check |
| `add-skill --source <ref> [--name <id>]` | Install vendor skill; canonicalise; write thin wrappers; update lock |
| `add-rule --canonical <path> [--triggers <list>]` | Author canonical rule; generate Layer-2 triggers |
| `add-command --canonical <path>` | Author canonical command; generate jc-* adapters |
| `add-hook --event <name> --command <cmd>` | Author hook; generate platform-specific entries |
| `update-skill --name <id>` | Re-fetch upstream; diff against canonical; regenerate adapters; refresh lock |
| `update-rule --name <id>` | Regenerate Layer-2 triggers from updated canonical rule |
| `update-command --name <id>` | Regenerate jc-* adapters from updated canonical command |
| `update-hook --event <name>` | Regenerate platform-specific hook entries from updated canonical |
| `remove --type X --name N` | Symmetric removal across all platforms; refuse if dependents exist |
| `plugin-audit` | Cross-reference enabled plugins with usage signals; flag redundant/unused |

Module location: `agent-tools/src/artefacts/`. Entry: `cli.ts`.
Builds to `dist/` per existing agent-tools convention. Invoked via
`pnpm agent-tools:artefacts -- <subcommand>` in `package.json` scripts.

### Contract invariants the CLI enforces

1. **Single canonical location.** Authoring writes only to `.agent/`.
   Adapters are generated, never hand-edited.
2. **DRY.** Duplication is permitted only to the minimum extent required
   for thin platform-specific wrappers. The CLI refuses to create
   substantive content in adapter directories.
3. **Symmetry.** Every authoring action across all platforms; every
   removal across all platforms. No partial state.
4. **Measurability.** Every contract check exits non-zero on violation
   with a precise pointer (file + line) to the cause.
5. **Reproducibility.** `agent-tools artefacts verify` plus
   `agent-tools artefacts inventory` is sufficient to detect drift; no
   human inspection of ADR tables required.

### Integration points

- **`scripts/validate-portability.ts`**: migrated into
  `agent-tools/src/artefacts/verify.ts`. The script becomes a
  4-line shim that imports `runVerify` and exits with its return
  code. (Alias detail in Phase 2.2.)
- **`skills-lock.json`**: read/written exclusively by the CLI's
  install/update/remove paths.
- **ADR-125**: amended to remove count tables; references the CLI
  capability for the live state (subcommand list and argv stay in
  this plan and CLI `--help`, not in the ADR).
- **`.claude/settings.json` enabled-plugin list**: read by `plugin-audit`
  but never mutated by the CLI (settings are owner-controlled).

---

## Phase 0: Design confirm

### 0.1 Surface confirmation — DECIDED

The CLI subcommand list above and the supersede relationship with the
future ingestion plan are decision-complete. Decisions recorded here
for the record:

- **pnpm script-name shape: `agent-tools:artefacts`** (single colon;
  follows existing convention used by `agent-tools:collaboration-state`
  and other sections). Subcommands invoked via
  `pnpm agent-tools:artefacts -- <subcommand>`.
- **Default skill-load budget rule**: the value is set at Phase 6.1
  execution as `claude /doctor` reported maximum × 0.85 (15% headroom
  margin). The rule is fixed; the value is computed from authoritative
  measurement at execution time, not estimated now.
- **Supersede relationship**: this plan supersedes
  `canonical-first-skill-pack-ingestion-tooling.plan.md`; archive
  happens in Phase 8.2.

No owner sign-off step is required at execution; this section is a
record of decisions already made at plan-decision-completion
(2026-05-06).

### 0.2 `npx skills` wrapping shape

`npx skills` (vercel-labs/skills) is the cross-platform agent-skills
ecosystem standard; it ships add / list / find / update / remove / init
end-to-end. The decision to wrap it is fixed by owner direction
("pnpx skills is the standard approach; we need to wrap it because we
have a different internal structure; pnpx skills brings the content
into the realm where we can manage it, then we manage it"). This phase
records the wrapping shape, not a build-vs-buy decision.

- **Wrap target**: `npx skills add <ref>`, `npx skills update <name>`,
  `npx skills remove <name>`, `npx skills list`.
- **Wrapping invocation: DECIDED — install `vercel-labs/skills` as a
  dev dependency under `agent-tools/` and call its programmatic API.**
  Rationale: gives version-pin + testability + no shell-escaping risk;
  aligns with the use-built-agent-tools-only and use-repo-scripts-over-npx
  rules; pnpm-script shell-out path is rejected as brittle (PATH
  dependence + stdout parsing).
- **Canonicalisation post-step** (the value-add the wrapper provides):
  - `npx skills add` writes content into the platform adapter
    directory matching the calling agent's convention (typically
    `.agents/skills/<name>/`).
  - The wrapper then moves content to `.agent/skills/<name>/`,
    generates thin wrappers in `.cursor/skills/`, `.claude/skills/`,
    `.agents/skills/`, records the entry in `skills-lock.json` with
    `source` / `sourceType` / `computedHash`, and runs `verify`.
  - The user's framing: file-shuffling is the only complexity beyond
    the lock; the lock may "just work" with read-modify-write.
- **Acceptance**: chosen wrapping invocation recorded inline in this
  phase; risk register updated with the lock-write strategy.

### 0.3 Reviewer phase-alignment

Pulled forward to Phase 0 (was previously mid-phases) on the
recommendation of the code-expert review of this plan: Findings P1#1
and P1#2 are architectural and must be resolved before any code lands.

- **Pre-Phase-1**:
  - `assumptions-expert` — challenge plan assumptions about CLI
    shape and migration scope; cover the lock-file concurrency gap
    flagged in §Risks.
  - `architecture-expert-fred` — ADR compliance check on the
    runVerify migration boundary (ADR-024 / ADR-038 implications);
    pulled forward from mid-phases.
  - `architecture-expert-barney` — boundary and dependency mapping
    for the new `agent-tools/src/artefacts/` module.
  - `config-expert` — CI build-ordering implications of Phase 2
    (the legacy shim importing from `dist/`).
  - `type-expert` — `skills-lock.json` schema-validated parsing
    per ADR-038; the lock file is an external data boundary.
- **Mid-phases**: `code-expert` per phase; `test-expert` per
  cycle; `architecture-expert-wilma` at Phase 3 (failure-mode
  probe on adapter-generation).
- **Post**: `docs-adr-expert` after Phase 8 ADR amendment;
  `code-expert` final pass.

---

## Phase 1: Inventory CLI

Goal: replace ADR-125 count tables with CLI-emitted output.

### 1.1 (Red) Test: `artefacts list --type skill` returns canonical skills

- **Test**: `agent-tools/src/artefacts/list.unit.test.ts` — given a
  fixture canonical tree (4 skills under `.agent/skills/`), the
  command prints exactly 4 rows in tabular form with `name`,
  `classification`, `adapter-platforms`.
- **Test landed in same commit as product code (atomic-landing
  invariant).**

### 1.2 (Green) Implement `list`

- **Product**: `agent-tools/src/artefacts/list.ts` — reads `.agent/`
  subdirectories per artefact type; emits stable-sorted rows.
- **Acceptance**: tests pass; `pnpm agent-tools:artefacts -- list --type skill`
  prints the live 37-skill inventory.

### 1.3 (Red→Green) Add `--platform` filter and other types

- **Cycles**: rule, command, hook, sub-agent, plugin variants.
- **Acceptance**: each type has a dedicated test fixture and
  green test.

### 1.4 (Red→Green) `inventory --output <path>`

- **Test**: writes a markdown file at the given path with current
  counts and per-platform parity tables.
- **Product**: invokes `list` for every type; renders markdown.
- **Acceptance**: command produces a deterministic output file from a
  fixed input tree (golden-file test acceptable per project conventions).

### 1.5 Phase-1 gate

- All cycles green; `pnpm agent-tools:artefacts -- inventory --output .agent/memory/executive/artefact-inventory.md`
  generates a fresh inventory page.
- Reviewer dispatch: `code-expert`, `test-expert`,
  `architecture-expert-barney` (boundary check on the new module).

---

## Phase 2: Verify migration

Goal: `validate-portability.ts` becomes the engine of
`agent-tools artefacts verify`. Old script becomes a thin compatibility
shim. New checks added.

### 2.1 (Red) Test: `runVerify(opts)` reports the same issues as legacy script

- **Test**: shared fixture tree; both invocations produce identical
  issue lists.
- **Test landing**: red test in same commit as the green product
  code (atomic-landing invariant).

### 2.2 (Green) Extract `runVerify(opts)` with explicit dependency injection

The migration must NOT preserve the legacy script's module-level state
(`process.cwd()`, top-level await, module-level `SUPERSEDED_COMMANDS` /
`PARTIAL_COMMANDS` sets). These are global-state reads that block
fixture-injection in tests and violate ADR-024.

- **Product signature**:

  ```ts
  export interface VerifyOptions {
    repoRoot: string;
    suppressedCommands?: ReadonlySet<string>;
    partialCommands?: ReadonlySet<string>;
  }
  export async function runVerify(opts: VerifyOptions): Promise<number>;
  ```

- **Product**: `agent-tools/src/artefacts/verify.ts` exports
  `runVerify` and the existing helper functions. The CLI subcommand
  wraps it: `runVerify({ repoRoot: process.cwd(), … })` is called by
  the CLI binary, not inside the library.
- **Acceptance (legacy shim)**: `scripts/validate-portability.ts`
  becomes:

  ```ts
  // scripts/validate-portability.ts (post-Phase 2)
  import { runVerify } from '../agent-tools/dist/artefacts/verify.js';
  process.exit(await runVerify({ repoRoot: process.cwd() }));
  ```

- **CI build-ordering: DECIDED — Option B.** The legacy
  `scripts/validate-portability.ts` shim continues to invoke via `tsx`
  and imports the `runVerify` function from `agent-tools/src/` (not
  `dist/`). Rationale: minimises CI change; the `use-built-agent-tools-only`
  rule applies to interactive agent-tool CLIs (the new
  `pnpm agent-tools:artefacts -- verify` invocation, which DOES use
  `dist/`), not to a script that imports the library directly. Option A
  (pre-script chain forcing build) is rejected as adding an avoidable
  CI dependency for no functional gain.
- **Acceptance**: `pnpm portability:check` continues to pass after
  Phase 2 lands.

### 2.3 (Red→Green) Add `--strict-spec` flag for agentskills.io checks

- **Test**: a fixture with a description lacking "Use when…" must fail
  with `--strict-spec` and pass without.
- **Product**: spec checks run only when flag set.
- **Acceptance**: known existing non-conformant skills (`jc-go`,
  `parallel-agents`, `complex-merge` wrappers) flagged.

### 2.4 Phase-2 gate

- Legacy script is now a 4-line shim; new CLI is the truth.
- Quality gates transition from `tsx src/` invocation to built
  `dist/` invocation per the `use-built-agent-tools-only` memory rule.
- Reviewer dispatch: `code-expert`, `architecture-expert-fred`,
  `config-expert` (CI gate change), `docs-adr-expert` (verify
  behaviour is moving).

---

## Phase 3: Authoring CLI

Goal: every artefact type has an `add-<type>` subcommand. Canonical
authoring + adapter generation are atomic.

### 3.0 (Red→Green) Extract shared adapter-generation helpers

This cycle is a precondition for 3.1+ and is called out explicitly to
preserve cycle independence (the code-expert flagged 3.1 → 3.2
helper-dependency as an atomic-landing risk; this 3.0 cycle resolves
it).

- **Test**: helper functions (`generatePlatformAdapter`,
  `writeThinWrapper`, `validateAdapterForm`) operate on fixture inputs
  and produce expected adapter content for each platform.
- **Product**: `agent-tools/src/artefacts/adapter-helpers.ts`
  containing the shared generators. Pure functions; no side-effects;
  no `process.cwd()`.
- **Cycle landing**: atomic.
- **Acceptance**: 3.1, 3.2, 3.3, 3.4, 3.5 can each red-test
  independently against these helpers.

### 3.1 (Red→Green) `add-skill --source <ref>` — wrap + canonicalise

This cycle wraps `npx skills add <ref>` (per Phase 0.2) and adds the
canonicalisation post-step. There is no bespoke fetcher.

- **Test**: given a fixture upstream pack, the command:
  - invokes the wrapped `npx skills add` to bring content into the
    adapter directory it natively writes to
  - moves content to `.agent/skills/<name>/`
  - generates thin wrappers in `.cursor/skills/`, `.claude/skills/`,
    `.agents/skills/`
  - records entry in `skills-lock.json` with `source`, `sourceType`,
    `computedHash`
  - all post-state passes `verify`
- **Test**: the wrap is idempotent — re-running on an already-installed
  vendor skill produces no diff.
- **Cycle landing**: per pack-shape variation.

### 3.2 (Red→Green) `add-skill --canonical <path>` for native skills

- **Test**: native skill (no upstream source) — adapter generation only.
- **Product**: re-uses helpers from 3.0; this cycle adds the native
  authoring entry-point only.
- **Independence**: parallel-safe with 3.3, 3.4, 3.5 (all build on 3.0).

### 3.3 (Red→Green) `add-rule --canonical <path> [--triggers <activation-list>]`

- **Test**: a rule with `globs: "**/*.test.ts"` produces a Cursor
  trigger with that frontmatter and Claude/`.agents` rule wrappers
  with bare-pointer form.
- **Product**: trigger-template per platform.

### 3.4 (Red→Green) `add-command --canonical <path>`

- **Test**: a new canonical command produces 10-style `jc-*` adapters
  across Cursor, Claude, Gemini, Codex.
- **Product**: per-platform adapter templates.

### 3.5 (Red→Green) `add-hook --event <name> --command <cmd>`

- **Test**: a Claude `PreToolUse` hook produces a `.claude/settings.json`
  entry plus any portable Layer-1 hook policy entry per
  `hooks-portability.plan.md`.
- **Product**: per-platform hook templates.

### 3.6 Phase-3 gate

- All authoring commands green; the manual canonicalisation flow
  documented in `agent-infrastructure-portability-remediation.plan.md`
  §Phase 1 is provably no longer needed.
- Reviewer dispatch: `code-expert`, `test-expert`,
  `architecture-expert-fred`, `architecture-expert-wilma`
  (failure-mode probe on adapter-generation).

---

## Phase 4: Update / remove CLI

### 4.1 (Red→Green) `update-skill --name <id>` — wrap + canonicalise

Wraps `npx skills update <name>` and re-runs the canonicalisation
post-step.

- **Test**: simulated upstream change; the wrap re-fetches via
  `npx skills update`, the canonicalisation post-step diffs against
  canonical, regenerates adapters only when source hash changes,
  refreshes lock.
- **Product**: idempotent; safe to re-run.
- **Concurrency**: writes to `skills-lock.json` use read-modify-write
  with an optimistic-concurrency check on `version`. Owner direction:
  "managing the lock file might just work" — start with the simplest
  shape and only escalate to advisory locking if the multi-agent
  collaboration model surfaces a real corruption case.

### 4.2 (Red→Green) `update-rule` / `update-command` / `update-hook`

- **Test**: editing a canonical rule + invoking `update-rule`
  regenerates Layer-2 triggers across Cursor, Claude, `.agents`. Same
  shape for command (across Cursor, Claude, Gemini, Codex) and hook
  (across applicable platforms).
- **Product**: re-uses helpers from 3.0.
- **Acceptance**: round-trip test for each artefact type.

### 4.3 (Red→Green) `remove --type X --name N`

- **Test**: removing a skill deletes canonical + every adapter + lock
  entry. Removing a rule deletes canonical + every trigger. Removing
  a command deletes canonical + every jc-* adapter. Removing a hook
  deletes canonical + every platform entry.
- **Product**: refuses removal if any other artefact references the
  target; outputs the dependents list.

### 4.4 Phase-4 gate

- Lifecycle is symmetric end to end across all artefact types;
  round-trip test
  (add → verify → update → verify → remove → verify) green for
  skills, rules, commands, AND hooks.

---

## Phase 5: Spec compliance

Goal: agentskills.io standard is enforced.

### 5.1 (Red→Green) `name` format check

- **Test**: a SKILL.md with uppercase / consecutive hyphens / >64 chars
  fails verify.
- **Product**: regex per spec.

### 5.2 (Red→Green) `description` form check

- **Test**: descriptions without explicit "Use when…" or
  "This skill should be used when…" trigger fail with `--strict-spec`.
- **Product**: heuristic match plus an allow-list for skills that
  already convey "when" implicitly (judgement-call cases documented
  in the test fixtures).

### 5.3 (Red→Green) `description` length check

- **Test**: descriptions >1024 chars fail.

### 5.4 (Red→Green) Body length advisory

- **Test**: SKILL.md body >5000 tokens warns (does not fail).
- **Product**: token estimate via tiktoken-equivalent heuristic.

---

## Phase 6: Skill-load budget

Goal: skill count is treated as a measurable ceiling.

### 6.1 (Red→Green) Active-skill count check

The skill-load ceiling is a measured fact, not a hypothesis: Claude
Code's `/doctor` command reports the discovery surface and confirms
the project currently exceeds the workable budget. The urgent plan's
prune is the immediate response; this cycle installs a check so the
budget cannot drift back over the ceiling silently.

- **Test**: configurable threshold; when exceeded, verify exits
  non-zero with the budget breach and the list of "consider for prune"
  candidates.
- **Default threshold rule (DECIDED)**: at Phase 6.1 execution, run
  `claude /doctor`; read the reported maximum supported skill count;
  set the budget default to that value × 0.85 (15% headroom margin).
  The rule is fixed; the numeric value is computed from authoritative
  measurement at execution time.
- **Authoritative measurement source**: `claude /doctor` output is
  the truth; the CLI's count must agree with it (or document why it
  diverges, e.g. plugin-declared skill counts vs. surfaced ones).
- **Product**: counts canonical skills + each enabled plugin's
  declared skill count (read from each plugin's manifest where
  available; estimated otherwise).

### 6.2 (Red→Green) Token-budget estimate

- **Test**: aggregate frontmatter token estimate; warn when projected
  discovery surface exceeds a configurable threshold.
- **Product**: per-skill token estimate; aggregate report.

### 6.3 Phase-6 gate

- Budget violations reported as actionable in `verify` output.
- Owner-tunable threshold; default written into config from the
  urgent-plan baseline measurements with a margin appropriate to
  expected steady-state growth.

---

## Phase 7: Plugin policy

Goal: enabled-but-unused and canonicalisation-shadowed plugins are
detectable.

### 7.1 (Red→Green) `plugin-audit`

- **Test**: a fixture with an enabled plugin and zero hits in any
  usage-signal source reports the plugin as `candidate-for-removal`.
- **Test**: a plugin whose skills are all present in
  `skills-lock.json` reports as `shadowed-by-canonical`.
- **Test**: a plugin referenced by an active plan under
  `.agent/plans/*/active/` or `*/current/` is NOT flagged for removal
  even if other signals are absent.
- **Test**: a plugin whose hook commands appear in
  `.claude/settings.json` `hooks.PreToolUse[*].command` is NOT flagged
  for removal.
- **Product**: usage signals as a finite, documented list:
  1. `.claude/settings.json` and `.claude/settings.local.json`
     `permissions.allow` MCP grants matching the plugin's tool prefix.
  2. `.agent/` references to the plugin name (Markdown grep).
  3. `skills-lock.json` entries that match the plugin's skill set
     (positive: plugin canonicalised; negative: plugin is shadowed).
  4. `.claude/settings.json` `hooks.*[*].command` references to
     the plugin's commands.
  5. References from `active/` and `current/` plans (ephemeral but
     active context).
- **False-positive guard**: owner-gate before any actual removal is
  taken (the CLI reports; it never auto-removes).

### 7.2 Phase-7 gate

- Run on the live tree; expected output (after the urgent plan
  has executed) includes any newly-shadowed plugins.

---

## Phase 8: Documentation amendment

Goal: ADR-125 sheds count tables; CLI inventory replaces them. Predecessor
plans archived.

### 8.1 ADR-125 amendment

- **Action**: remove all numeric count columns from the per-artefact-type
  tables in ADR-125 §Layer 2.
- **Action**: add an "Inventory" section that references the **CLI
  capability** ("inventory is emitted by `agent-tools artefacts
  inventory` and lives at `.agent/memory/executive/artefact-inventory.md`")
  WITHOUT embedding the subcommand list, flag set, or argv shape.
  Subcommand details remain in this plan and in the CLI's `--help`
  output. Per PDR-019, ADRs state outcomes (the capability), not how
  (the argv).
- **Action**: ADR-125 must NOT cite this plan's filename (per the
  ADRs-permanent-plans-ephemeral memory rule: permanent docs do not
  cite plan names).
- **Action**: add an amendment-log entry dated at execution.
- **Reviewer**: `docs-adr-expert` MID + POST.

### 8.2 Predecessor plan archival

- **Action**: move `canonical-first-skill-pack-ingestion-tooling.plan.md`
  from `future/` to `archive/` with a note that this plan superseded it.
- **Action**: update `agent-infrastructure-portability-remediation.plan.md`
  with a closing note pointing at this plan as the structural successor.

### 8.3 Memory updates

- **Action**: add memory entries (or update existing) for the three
  patterns surfaced in the source report:
  - inventory-as-output, not as-document (refines existing
    no-moving-targets-in-permanent-docs rule with the plans-are-OK
    nuance);
  - vendor-plugin-redundancy-after-canonicalisation policy;
  - skill-load-budget is real.

### 8.4 Phase-8 gate

- ADR-125 has zero count cells.
- Inventory regenerable via one command.
- Memory entries reflect the new operational shape.

---

## Phase 9: Handoff and consolidation

### 9.1 Run `/jc-consolidate-docs`

- Standard close-of-plan consolidation pass.
- Pattern-graduation review for the three patterns above.

### 9.2 Pattern graduation — DECIDED

The three patterns from the source report (§6) graduate to the
following surfaces:

- **Inventory-as-output, not as-document** → graduate as a PDR-009
  amendment. This is a structural refinement of the canonical-first
  cross-platform architecture (counts emit from a verifier; do not
  embed in permanent docs); the right home is PDR-009's amendment log.
- **Skill-load budget is real** → already a memory feedback entry
  (`feedback_skill_load_budget.md`); no further graduation needed
  unless the budget mechanism evolves into a Practice-Core pattern,
  which is a separate evidence-gated decision.
- **Vendor plugin redundancy after canonicalisation** → already a
  project memory entry (`project_vendor_plugin_redundancy_after_canonicalisation.md`);
  the policy ("default = remove plugin") may graduate to ADR-125 as a
  named amendment if the policy is invoked twice more in 90 days.

Acceptance: PDR-009 amendment commit drafted in 9.2; the two memory
entries are confirmed already in place by 9.1 consolidation.

---

## Acceptance criteria (overall)

1. `pnpm agent-tools:artefacts -- verify` exists and supersedes
   `pnpm portability:check`. The legacy script is a thin shim.
2. Every artefact type (skill, rule, command, hook) has explicit
   `add-<type>`, `update-<type>`, and `remove --type <type>` CLI
   commands. Sub-agents are covered by the `add-command` /
   `update-command` flow plus the existing `subagents:check` gate;
   no separate sub-agent CLI is required.
3. `pnpm agent-tools:artefacts -- inventory --output .agent/memory/executive/artefact-inventory.md`
   regenerates the inventory page deterministically.
4. ADR-125 has no embedded count tables; references the CLI for
   live state.
5. The agentskills.io spec is enforced: `name` format, `description`
   form (what + when), `description` length, body-length advisory.
6. Skill-load budget check exists; default threshold tuned empirically.
7. Plugin-utilisation check exists and is part of `verify` output.
8. The full add → verify → update → verify → remove → verify
   round-trip is tested for skills, rules, commands, and hooks.
9. The 8 Clerk vendor skills are re-validated via the new CLI's
   `verify` and round-trip-able via `update-skill`.
10. Reviewer dispatch happened at every phase boundary covering the
    domain set: assumptions, architecture, code, test, docs, config,
    type. Specific persona names (Fred / Barney / Wilma) are
    convenience pointers; domain coverage is the contract.

---

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scope creep — CLI grows beyond artefact lifecycle | Medium | Phase boundaries; reviewer gates; non-goals list |
| Migration breaks `pnpm portability:check` consumers | Medium | Phase 2's compatibility shim; CI-side aliasing; build-ordering decision recorded in 2.2 |
| Authoring CLI generates malformed adapters under edge inputs | Medium | TDD on each adapter template; round-trip test |
| Spec checks (Phase 5) flag false-positives on legitimate skills | Medium | Allow-list mechanism documented in test fixtures |
| Skill-load budget threshold becomes a target rather than a ceiling | Low | Config-driven; reviewer-gated raise |
| Plugin-audit produces false-positive removal candidates | Medium | Usage-signal list is finite and documented (incl. hooks + active plans); owner gate before any actual removal |
| Path-handling regression on Windows CI | Low | All path construction uses `path.join` / `path.resolve`; no string-concatenated paths. CI matrix currently macOS/Linux; document if Windows is ever added. |
| Concurrent writes to `skills-lock.json` corrupt the lock | Medium | Write-serialisation strategy in 4.1: advisory lock file (e.g. `skills-lock.json.lock`) acquired before read-modify-write; release on commit window close. Multi-agent collaboration model is in active use, so this is not a hypothetical risk. |
| Reviewer dispatch blocked because reviewer adapters are themselves under refactor | Low | Acceptance criterion 10 names reviewers by domain (assumptions, architecture, code, test, docs, config, type); persona-specific names (Fred/Barney/Wilma) are convenience pointers — domain coverage is the contract. |

---

## Foundation alignment

- **PDR-009** §Decision: canonical-first three-layer model. CLI
  enforces Layer 1 as authoritative; Layer 2 as generated thin wrappers
  only.
- **ADR-125** §Thin Wrapper Contract, §Skills Structure Contract,
  §Plan Template Contract: CLI templates implement these contracts
  literally.
- **agentskills.io specification**: spec checks (Phase 5) are direct
  encodings.
- **PDR-035**: agent-work capabilities belong to the Practice; CLI
  resides in `agent-tools/` per the Practice substance boundary.
- **Tests-never-touch-global-state**: test fixtures use explicit literal
  inputs, never `process.env`.
- **No-moving-targets-in-permanent-docs** (refined): counts live in
  CLI output and in plans (ephemeral); ADRs lose count tables.

---

## Non-goals (YAGNI)

- A graphical UI for artefact management.
- Autonomous removal of plugins (`plugin-audit` reports; owner acts).
- Ingestion from sources outside the agentskills.io standard.
- Replacing Cursor / Claude / Codex / Gemini native settings; the CLI
  generates content under the existing platform-adapter directories,
  not in any new private surface.
- Touching `principles.md` or `directives/AGENT.md` content.
- Replacing reviewer sub-agent invocation (separate concern).

---

## Predecessor / successor relationships

The links below point to the **current** locations as of plan
authoring. Phase 8.2 will move the superseded plan to
`.agent/plans/agent-tooling/archive/`; until that phase executes, the
`future/` location is the live one and these references must not be
prematurely rewritten.

- **Supersedes**: [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md)
  — narrower scope (vendor-skill ingestion only); folded into Phase 3.1.
- **Closes**: [`agent-infrastructure-portability-remediation.plan.md`](agent-infrastructure-portability-remediation.plan.md)
  Phase 6 mitigation option 1 ("script the canonicalisation as an
  agent-tool — flagged as future work and never built").
- **Adjacent**: [`hooks-portability.plan.md`](../future/hooks-portability.plan.md)
  — hook subset of Phase 3.5 derives from this plan; reconcile during
  Phase 3 design.
- **Adjacent**: [`adapter-generation.plan.md`](../future/adapter-generation.plan.md)
  — generates wrappers for internally-authored canonical artefacts;
  Phase 3 absorbs.

---

## Lifecycle triggers

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Pre-edit per phase**: assumptions-expert dispatch.
- **Mid-phase**: code-expert + architecture domain coverage
  (boundaries, ADR compliance, failure modes) per the Phase 0.3
  matrix.
- **Phase-close**: test-expert; consolidate insights into
  `.remember/now.md`.
- **Plan close**: `/jc-consolidate-docs`; Phase 8 ADR amendment.

---

## Learning loop

- Per-phase: capture surprises in `.agent/memory/active/napkin.md`.
- At plan close: graduate the three patterns from the source report
  via `/jc-consolidate-docs`.
- Friction register: any drift caught by the new CLI in its first
  month of use is candidate evidence for further check additions.
