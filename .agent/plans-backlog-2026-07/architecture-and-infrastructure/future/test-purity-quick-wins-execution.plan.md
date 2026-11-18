---
name: test-purity-quick-wins-execution
overview: >-
  Rescued source-estate plan (private sibling Resonance estate; no public
  upstream URL): the owner-commissioned test-purity quick-wins set (suffix
  invariants, vitest config purity, CI relocation). NOT yet executable in
  this repo — file paths, censuses, and CI claims are source-estate facts;
  a consolidation/adaptation pass re-derives them here before any execution.
lane: future
status: "IMPORTED, PENDING ADAPTATION (rescued 2026-07-20 from the Resonance
  estate where it was planned 2026-07-17, Squally Washing Lighthouse 3795e7,
  owner decisions taken in-plan: ratchet ruled, full scope confirmed) — every
  repo-specific fact below is source-estate and must be re-derived here
  before execution"
todos:
  - id: qw-c1-hook-fix
    content: "Push-guard cwd-crash fix: lazy root derivation + CLAUDE_PROJECT_DIR-anchored root; TDD on extracted pure context-resolution"
    status: pending
  - id: qw-c2-renames-globs
    content: "The 7 bare .test.ts renames + tighten both vitest include globs to the two allowed suffixes (ONE commit; prose-docs grep first)"
    status: pending
  - id: qw-c3-config-keys
    content: "Delete pool/isolate/passWithNoTests from agent-tools/vitest.config.ts + the stale env-mutation comment; run suite, record observed time delta"
    status: pending
    depends_on: [qw-c2-renames-globs]
  - id: qw-c4-doctrine-text
    content: "testing-strategy.md: smoke tier + impossibility bar, ruling-8 vitest constraint, shared-state-of-any-kind wording, TUI e2e type documented"
    status: pending
  - id: qw-c5-test-purity-validator
    content: "ONE new blocking validator (suffix invariant + test-IO-import invariant) with recomputing shrink-only ratchet allowlist; wired into repo-validators:check"
    status: pending
    depends_on: [qw-c2-renames-globs, qw-c4-doctrine-text]
  - id: qw-c6-ci-relocation
    content: "Move Lint + Type-check steps from the unit-tests CI job to static-checks"
    status: pending
  - id: qw-c7-suite-parallel
    content: "INTERIM: parallelise the two vitest suites in the root test script (skip if C3's observation shows the step no longer dominates; dissolves at E3 unification)"
    status: pending
    depends_on: [qw-c3-config-keys]
  - id: qw-c8-next-cache
    content: "actions/cache for .next/cache in the CI build job"
    status: pending
---

# Test-Purity Quick Wins — Execution Plan

> **Import status (2026-07-20, rescued at Siren's consolidation tail):** this
> plan was authored IN and FOR the private sibling Resonance estate — its file
> paths (`kengraph`, `baxtersgallery`, `.agent/plans/resonance/...`), test
> censuses, and CI-chain observations are source-estate facts that do NOT
> resolve in this repository. It is conserved here as the owner-commissioned
> quick-wins design (the invariants and sequencing carry); the adaptation pass
> (consolidation lane) re-derives every repo-specific fact against THIS tree
> before any todo executes. The investigation source named below is a
> source-estate path, present only in the Resonance repo.

## Context

The 2026-07-17 investigation (findings + matrix:
`.agent/plans/resonance/current/test-purity-and-ci-caching.debt.plan.md`)
found the test estate 87% DI-compliant but structurally unenforced: bare
test suffixes are collectable, ~50 in-process test files perform real IO,
the agent-tools vitest config sets all three owner-forbidden keys, the
local/CI gate chains carry avoidable weight, and the kengraph push-guard
hook crashes every Bash call from a non-git cwd (live-fired repeatedly in
the planning session). This plan executes ONLY the owner-commissioned
high-impact/low-effort set. The deep DI programme (debt rows ST1–ST5,
ST8) is out of scope and follows separately.

**End goal**: the pure-test doctrine becomes self-enforcing (new
violations impossible), the estate's config drops to the owner-ruled
standard shape, and the gate chains shed dead weight — without expanding
scope into the DI refactor.
**Mechanism**: rename + tighten so nonconforming names cannot run; one
recomputing validator with a shrink-only ratchet so violations cannot
land; three-line config deletion observed by its own suite run; small CI
placement/caching edits.
**Means**: the eight cycles below.

Owner decisions already taken (2026-07-17, recorded here and in the debt
plan): **ratchet ruled** (gates land now with a committed shrink-only
allowlist); **full scope confirmed** (C6/C7/C8 included); vitest
constraint pinned to exactly `passWithNoTests`/`isolate`/`pool` (ruling
8); act-and-observe governs (ruling 9, owner-tempered).

## Cycles (TDD; each cycle = one landing/commit; C1 first, then any order respecting depends_on)

### C1 — Push-guard cwd fix (`qw-c1-hook-fix`)

Files: `agent-tools/src/bin/claude-kengraph-push-guard.ts`,
`agent-tools/src/core/primary-repo-root-io.ts` (unchanged contract),
tests in `agent-tools/src/hook-policy/check-push-wiring.unit.test.ts` +
`agent-tools/src/core/primary-repo-root.unit.test.ts`.

Defect: the bin derives `primaryRoot` at MODULE LOAD
(`derivePrimaryRepoRoot({ cwd: process.cwd(), … })`) before any
command-relevance match; `readGitCommonDirIo` throws on non-git cwd →
wrapper fails closed → every Bash call blocked.

Cure (both moves):

1. Lazy: derivation moves inside the gated (remote-touching) branch —
   ordinary commands never derive a root.
2. cwd-independent: derive from `process.env.CLAUDE_PROJECT_DIR` when
   set (the wrapper guarantees it), `process.cwd()` fallback. Model on
   the injected-projectDir precedent in `agent-tools/src/core/repo-root.ts`
   (`resolveRepoRoot`).

TDD (red first): extract a pure `resolveGuardRoot({ env, cwd,
readGitCommonDir })` (or equivalent) into helpers; failing tests: (a)
non-remote command at non-git cwd → no derivation call at all (inject a
throwing fake and assert it is never invoked); (b) remote-touching
command + `CLAUDE_PROJECT_DIR` set + non-git cwd → root derived from the
project dir; (c) remote-touching command, no derivable root → fail
closed (the existing `resolveGuardExitCode` semantics untouched).
Green: refactor the bin to consume it. NOTE: the live hook runs from
gitignored `dist/` — the executing session rebuilds agent-tools after
landing (the build script in `agent-tools/package.json`) and proves the
fix by running one Bash command from a non-git cwd.

Acceptance: proof `unit` (the three tests) + `value-proxy` (the non-git
cwd live probe passes). Validation: agent-tools vitest run green;
the live probe.

### C2 — Renames + include-tightening (`qw-c2-renames-globs`, ONE commit)

Pre-step (the planning-session gap): `rg --hidden -g '!node_modules' -g
'!dist' -g '!.git'` for the 7 basenames — machine-consumed configs are
verified ZERO-reference (knip/vitest/tsconfig/depcruise all glob-based);
this sweep covers prose docs only; true any hit found.

`git mv` (behaviour-true suffixes; census-verified pure):

- `agent-tools/tests/claude/{statusline-identity-input,statusline-logo-cycle,statusline-render-session-shape,statusline-session-shape,engraph-logo}.test.ts` → `.unit.test.ts`
- `agent-tools/src/core/repo-root.test.ts` → `repo-root.unit.test.ts`
- `baxtersgallery/lib/auth.test.ts` → `auth.unit.test.ts` (collected by
  the ROOT vitest run today and after)

Same commit — tighten includes:

- root `vitest.config.ts`: `include: ["**/*.unit.test.{ts,tsx}", "**/*.integration.test.{ts,tsx}"]`
- `agent-tools/vitest.config.ts`: the same two suffixes over `src/**` +
  `tests/**`; DELETE the `.spec` patterns.

Order-coupling rationale: tightening without the renames silently
orphans 7 files (a silent-skip window —
`every-test-file-reachable-from-a-gate`).

Acceptance: proof `unit` — both suites green AND collected-file counts
read from the run output equal the pre-change counts (root count
unchanged incl. the baxtersgallery file; agent-tools count unchanged at
221 + renamed 6 = no file lost). Validation: `pnpm test` with the counts
read, not just exit codes.

### C3 — Delete the three forbidden config keys (`qw-c3-config-keys`)

File: `agent-tools/vitest.config.ts` — delete `pool: "forks"`,
`isolate: true`, `passWithNoTests: true` AND the stale justifying
comment ("many tests mutate process.env" — grep-proven false, zero env
assignments estate-wide). Ruling 9: the suite run IS the measurement —
record the observed agent-tools suite duration delta in this plan's
completion record (baseline: 70.7s wall / 12.0s tests in CI run
29594241466). No other keys change (ruling 8 tolerates the rest).

Acceptance: proof `unit` (suite green on default isolation — zero env
mutation is already grep-proven so green is EXPECTED; a red here is
information: name the failing file in the completion record and stop —
do not re-add the keys without owner word). Validation: `pnpm test`,
duration recorded.

### C4 — Doctrine text (`qw-c4-doctrine-text`)

File: `.agent/directives/testing-strategy.md`. Four additions, each
citing its owner ruling (2026-07-17):

1. §Test Types gains the **smoke tier**: `*.smoke.test.ts` — in-process
   tests that require real IO; permitted ONLY where a lower-level
   DI-based test CANNOT provide the same assurance (the impossibility
   bar); expected steady-state population ZERO (the thin-adapter
   discipline covers even script-shaped subjects); location beside the
   subject; runner `pnpm test` (collected by a suffix include added ONLY
   when the first owner-approved smoke test exists — not before).
2. §Rules gains the **vitest config constraint**: no values for
   `passWithNoTests`, `isolate`, or `pool` in any vitest config.
3. The global-state rule extends to **shared state of any kind**:
   module-level mutable state, shared `beforeAll` fixtures,
   `process.chdir`, and any inter-test ordering dependence.
4. §Out-of-process tests documents the **agent-tools TUI e2e type**:
   `*.e2e.test.ts`, location `agent-tools/e2e-tests/`, runner
   `pnpm --filter @engraph/agent-tools test:e2e` (a vitest-driven
   out-of-process suite, distinct from the root Playwright suites).

Acceptance: proof `non-code` (text present, rulings cited); prettier +
markdownlint green. Validation: `pnpm check:docs` docs gates.

### C5 — The test-purity validator + ratchet (`qw-c5-test-purity-validator`)

New: `agent-tools/src/validators/test-purity/` following the exemplar
layout exactly (`validate-no-machine-local-paths` shape):
`validate-test-purity.ts` (thin IO entry: `resolveRepoRoot`,
`git ls-files -z` via `resolveTrustedGit()`, `process.exit`),
`validate-test-purity-helpers.ts` (pure), colocated
`validate-test-purity-helpers.unit.test.ts` (injected file lists + fake
readers — the validator's own tests are themselves doctrine-pure).

Two invariants over tracked files:

1. **Suffix invariant**: every `*.test.{ts,tsx,js,jsx}` file must match
   the allowed set — `*.unit.test.*` / `*.integration.test.*` anywhere;
   `*.e2e-ui.test.ts` / `*.e2e-api.test.ts` only under `e2e/`;
   `*.e2e.test.ts` only under `agent-tools/e2e-tests/`;
   `*.smoke.test.ts` recognised (population expected zero). Everything
   else: violation. (Zero violators after C2 — no allowlist entries
   needed for this invariant.)
2. **Test-IO-import invariant**: `*.unit.test.*` and
   `*.integration.test.*` files, plus files under
   `agent-tools/tests/test-helpers/`, must not import (static import,
   `require`, or dynamic `import()` specifier literal) any of:
   `fs`, `fs/promises`, `child_process`, `net`, `http`, `https`, `dns`,
   `tls` (bare and `node:`-prefixed). Stated bound (printed in the
   validator's own output contract docs): direct specifiers only —
   transitive IO through non-helper modules is the DI programme's
   domain.

**Ratchet allowlist** (owner-ruled): committed
`test-purity-allowlist.json` in the validator dir; entries
`{ path, invariant }`. The validator RECOMPUTES
(`validators-must-recompute-not-just-record`): a violation not in the
list → exit 1; a list entry whose file is now clean or absent → exit 1
(stale entry — shrink the list in the same change); exact counts in
output (the WS2 no-floor-assertions lesson). Exit 2 reserved for
misconfiguration (unreadable allowlist). **The allowlist content is
derivation-anchored: seed it by RUNNING the validator at execution time
and capturing its violation list — do NOT copy the planning session's
~43-file census list (same-day staleness doctrine).**

Wiring (explorer-verified, two package.json edits, no CI change): add
`"validate-test-purity"` to `agent-tools/package.json` scripts
(`cd .. && pnpm exec tsx agent-tools/src/validators/test-purity/validate-test-purity.ts`)
and append to the root `repo-validators:check` chain. Rides the existing
`static-checks` CI job and `pnpm check`; `CHECK_CHAIN_STEPS` untouched;
the quality-gates fan-in pin untouched (no new CI job).

TDD: helpers red-first with injected fixtures — suffix cases (allowed ×
each tier/location, bare name, wrong-location e2e suffix), IO cases
(each banned specifier form incl. `node:` prefix + dynamic import; clean
file; helper-dir file), ratchet cases (new violation fails; allowlisted
passes; stale entry fails; exact-count output). Green: implement. Then
wire scripts and run the full chain.

Acceptance: proof `unit` (helper matrix incl. the
cheapest-wrong-implementation defeats: an allowlist that would pass on
count-only must fail on identity mismatch) + `integration`-by-gate
(`pnpm repo-validators:check` green with the seeded allowlist).
Validation: `pnpm repo-validators:check`; then a deliberate-break probe
(add a banned import in a scratch test file, watch the gate bite, revert
forward).

### C6 — CI step relocation (`qw-c6-ci-relocation`)

File: `.github/workflows/ci.yml` — move the `Lint` and `Type-check`
steps from `unit-tests` into `static-checks` (after the format/markdown
steps, before the validators). Explorer-verified: the fan-in pin test
asserts only the JOB-level `needs` set — intra-job step moves cannot
trip it; no new job is created. Expected effect: unit-tests job ≈
30s + tests; critical path −~26s while unit-tests remains the pole.

Acceptance: proof `value-proxy` — the next CI run green with both steps
executing in `static-checks`. Validation: the CI run's job/step listing.

### C7 — Interim suite parallelisation (`qw-c7-suite-parallel`)

GATED ON C3's observation (ruling 9): if the post-C3 suite time no
longer makes the `test` step the local/CI pole, SKIP this cycle and
record the skip with the observed numbers (deferral-honesty satisfied by
the measurement). If it still dominates: root `package.json` `test`
becomes a concurrent run of the two suites (add `concurrently` as a
devDep, `--group` output, fail-fast) — explicitly INTERIM, deleted at
the E3 config unification (debt plan §E3). knip note: new devDep must be
consumed by the script or knip flags it — same commit.

Acceptance: proof `unit` (both suites green under concurrent run; exit
non-zero when either fails — prove with a deliberate-break probe) +
recorded wall-time delta. Validation: `pnpm test` twice (green + timed).

### C8 — Next build cache (`qw-c8-next-cache`)

File: `.github/workflows/ci.yml` `build` job — `actions/cache` (same
pinned SHA as the Playwright cache block) on `.next/cache`, key
`nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('src/**', 'public/**') }}`,
restore-key on the lockfile-only prefix. Root `.next` location
explorer-verified; baxtersgallery is not built in CI (not a Next app,
not a workspace member) — untouched.

Acceptance: proof `value-proxy` — a second CI run shows the cache
restored and a shorter `Build` step. Validation: two consecutive CI
runs' timings.

## Sequencing

C1 first (it un-wedges Bash for every session including the executing
one). Then C2 → C3 → C5 on the coupled path (C4 anywhere before C5);
C6/C7/C8 independent, C7 after C3's observation. Bundle-per-cycle, one
push window each per the estate's Codex-review race discipline
(merge-at-settle; resolutions with SHA evidence at push read-back).

## Risk + first-principles check

- Re-derive ALL violator lists and counts at execution time (same-day
  staleness is the estate's weather — the planning census is an
  accelerant, never an input).
- C3 green is expected but not assumed: a red on default isolation is
  new information, stop-and-name, never re-add keys silently.
- The axe-fence exemplar's exact filename was not pinned during
  planning (the W10 wedge); C5's ratchet mechanics are specified
  self-sufficiently above — the fence is precedent, not a dependency.
  (Locate via `grep -rln "target-size" e2e/` if wanted.)
- The validator's own test file must be reachable from a gate
  (agent-tools vitest collects `src/**/*.unit.test.ts` — verified glob).
- Hook edits affect only local tooling (dist rebuild required); CI
  hooks are unaffected.

## Non-goals

- The DI refactor programme (ST1–ST5, ST8) and the E3 config
  unification — the follow-on plan.
- No smoke test is created; the tier is doctrine-only until an
  owner-approved occupant exists.
- No eslint changes (the validator carries enforcement; eslint-disable
  is forbidden and therefore cannot host the ratchet).
- No turbo; no vitest config changes beyond the named deletions and
  include-tightening.

## Landing + lifecycle

This plan lands at
`.agent/plans/architecture-and-infrastructure/future/test-purity-quick-wins-execution.plan.md`
(its home in THIS estate after the 2026-07-20 rescue and the ADR-117 lane
correction — non-executable material lives in `future/`; the source-estate
landing path was `.agent/plans/resonance/current/…` — historical). The
adaptation pass is the promotion trigger to `current/`; it moves to
`active/` when the executing session starts. Completion runs
the consolidation touchpoint per the plan architecture; the debt plan's
matrix rows QW1–QW7/FI2/ST7-immediate flip to executed with SHA
evidence; observed timings (C3, C7, C8) are recorded in a completion
note in this file.

## Homing note (2026-07-20, Siren lifts Trench, dedicated consolidation)

Rescued verbatim from the authoring platform's machine-local plan surface
(`~/.claude/plans/`, authored 2026-07-17 by Squally Washing Lighthouse,
`3795e7`) into the canonical plan estate — an owner-decided, ready-for-
execution plan existed only machine-locally and would not have survived a
host change. The canonical copy is this file; the machine-local original
is superseded by it.
