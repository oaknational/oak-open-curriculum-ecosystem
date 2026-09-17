---
id: mutation-testing-core-canary
node_type: delivery
name: "Mutation-testing capability canary on the simplest core package"
overview: "Complete the proven Stryker canary rapidly: one small PR restores the conserved spike configs in a shape that clears the type-check blocker, runs the full mutation pass on type-helpers, and lands a doctrine-bound survivor ledger."
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-09
ratified_where: "Owner card at the Director seat 2026-08-09 ~07:4xZ (card answer: 'Ratify as scoped' — the re-scope supersession was surfaced on the card; session Plover lifts Troposphere b10c37)"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets:
  - MCP-540
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

> **ARCHIVED 2026-08-11 — completed.** Both todos landed and every
> acceptance criterion is proven: slice 1's canary run is banked and
> was then RE-RUN against the real `vitest.config.ts` by the
> isolation plan's todo 3 (PR #848, merge `bb40ecdf5`, 2026-08-11 —
> 18/18 mutants killed, 100% score, zero warnings, plus the
> reversible config-load sentinel probe as provenance), retiring the
> duplicate-config mechanism per the 2026-08-10 amendment below; the
> survivor-disposition criterion is satisfied over an EMPTY survivor
> list (100% kill); the evidence-artefact list in the first criterion
> is governed by the 2026-08-09 dated ruling in slice 1
> (`report.html` deliberately not banked — regenerable from
> `report.json`); todo 2's pilot-plan re-point landed (pre-work item
> (c) of `shared-construct-extraction-pilot.plan.md` carries the
> dated pointer). Estate-wide roll-out is owner-committed future work
> ("everywhere, but later, and in stages", 2026-08-11), carried at
> the isolation plan's Out of scope — never by this archived node.

# Mutation-testing capability canary on the simplest core package

## Goal

The repository can run trustworthy, report-only mutation testing on a
workspace and has proven it end to end on the simplest pure-unit core
package, with every surviving mutant carrying a recorded disposition.
This is the admission evidence the foundational building-block
excellence contract requires (mutation assurance is a core-promotion
gate in the estate review's promotion frame), and it is the capability
evidence the shared-construct extraction pilot's assurance step
consumes.

## Provenance — what the spike proved and where it stopped

This node extracts and completes the work preserved on branch
`jimcresswell/mutation-testing-core-canary` (orphan-rescue `4ffef19a0`,
tidied `b12197181`, WIP preview PR #807). Commissioning word 2026-08-05
in session Drake spins Obsidian ("I want the mutation testing set up on
the simplest core package we have" + card answer "Tonight, full canary
sequence", comms event `690e92d8-1c69-408f-9e89-a346b4eb4987`);
extraction word 2026-08-09 ("a small, rapidly deliverable plan").
**Supersession note (2026-08-09)**: the branch copy of this node
carried the 2026-08-05 commissioning citation in its ratification
fields while still `status: sketch`; this re-scope (dropping the
second canary — see Out of scope) starts a fresh born-sketch cycle,
and the owner's ratification of THIS node is a re-ratification of a
narrower shape than the 2026-08-05 sequence.

Proven first-hand by the spike (`mechanics-report.md` on the branch is
the evidence record):

- **Canary selection verified live**: `@oaknational/type-helpers` — one
  pure source file (70 lines, no imports beyond TS), one unit-test
  file. The smaller-by-lines `safe-path` was rejected as an I/O
  boundary, matching the 2026-07-15 exploration's criterion.
- **A working config shape**: production-only mutate globs, explicit
  unit/integration test selection, `allowEmpty: false`,
  `thresholds.break: null` (report-only), reporters into
  `mutation-evidence/`. The root `buildCommand` was unnecessary for
  the DRY RUN (the per-mutant run path was never exercised, so the
  finding is dry-run-scoped; note the turbo `mutate` task carries
  `dependsOn: ["^build"]`, so it does not transfer to the root
  `pnpm mutate` path).
- **Obstacle 1 solved — sandbox reachability**: Stryker's sandbox
  crawls only the workspace cwd (first-hand source read of
  `ProjectReader`), so the shared `../../../vitest.config.base` import
  in the workspace's real vitest config is structurally unreachable
  from a per-workspace sandbox. Cure proven in the dry run: a
  self-contained `vitest.config.stryker.ts` duplicating only the
  discovery fields; the real `vitest.config.ts` untouched.
- **Obstacle 2 diagnosed — config discovery**: Stryker auto-discovers
  only `json|js|mjs|cjs` config names (first-hand source read), so a
  bare `stryker run` with a `.ts` config silently falls back to the
  command runner.
- **Dry run succeeded and is banked** (`dry-run.log.txt`): config
  loads, 1 file / 18 mutants instrumented, 10/10 tests pass, the
  integration glob warned-empty rather than silently admitting
  anything.

**Where it stopped**: the spike froze mid-build. Its configs were
conserved as `.txt` copies (`stryker.config.ts.txt`,
`vitest.config.stryker.ts.txt`) — **no live config file exists on the
branch** — because `stryker.config.ts` imports
`@stryker-mutator/api/core`, which is installed nowhere in the repo,
and the workspace's `tsconfig.lint.json` includes `*.config.ts`, so
restoring it as-is turns the workspace type-check red. The
`package.json` `mutate` script on the branch is the bare form Obstacle
2 breaks. The session itself ended at a harness worktree-pinning
fault whose named faulting worktree no longer exists — the condition
has changed and does not carry forward.

**Zero drift since the freeze** (verified 2026-08-09): the branch is
~347 commits behind `origin/main`, yet `git merge-tree` reports a
fully clean merge, and neither `packages/core/type-helpers/` nor
`vitest.config.base.ts` has a single commit since the merge-base — the
18-mutant / 10-test facts are current, which is the strongest evidence
the remaining work is genuinely small.

## Design constraint — owner doctrine (2026-08-05, binding)

Mutants are killed through higher-quality testing, never through
highly-targeted testing. A surviving mutant routes to (a)
classification as equivalent or unreachable under the public contract,
or (b) an assessment that the suite's description of the public
behavioural contract is incomplete — cured, if at all, by a
behaviour-describing test that would have been correct to write anyway,
authored against the contract, not against the mutant. The mutation
score is evidence, never a target; no threshold gates anything in this
plan.

## Mechanism

One config-format decision clears every remaining blocker at once, and
the rest is a minutes-scale run plus a small ledger. The spike's `.ts`
config format is the sole cause of both its workarounds: authored as
**`stryker.config.mjs`** instead, the config is auto-discovered (no
positional argument, Obstacle 2 retired), needs no
`@stryker-mutator/api` type import (the type-check blocker never
fires), and sits outside the `*.config.ts` type-check include (typing
preserved via a JSDoc `@type` annotation) — and the root
`tsconfig.json` include list already anticipates exactly this filename.
The per-workspace invocation shape is retained: the surveyed
alternative (running Stryker from the repo root so the sandbox reaches
`vitest.config.base.ts`) would retire Obstacle 1 outright but sandboxes
the whole monorepo per run — an unmeasured cost not worth buying for a
one-workspace canary; it is the natural first question if rollout is
ever decided.

## Todos (definite order; each a single-story PR within its PDR-132 budget)

> **Amendment (2026-08-10)**: slice 1's duplicate-config mechanism
> (`vitest.config.stryker.ts`, restored below because the real config's
> repo-root reach could not resolve in Stryker's sandbox) is RETIRED by
> the workspace-config-isolation plan's todo 3 (PR #847): the real
> `vitest.config.ts` now imports `@oaknational/workspace-config/vitest`,
> which resolves in the sandbox, so `stryker.config.mjs` points at the
> real config, the duplicate is deleted, and
> `mutation-evidence/run-real-config.log.txt` banks the re-run (18/18
> killed, 100%, zero errors). The restore language below is historical
> record of slice 1 as executed, not live instruction.

1. **Slice 1 — complete and land the type-helpers canary (the rapid
   deliverable, lands via PR #807 re-cut on fresh main).** In the
   existing clean `mutation-canary` worktree: merge current
   `origin/main` into the branch (verified clean, zero conflicts);
   author `stryker.config.mjs` from the conserved
   `stryker.config.ts.txt` content (JSDoc-typed, no api import);
   restore `vitest.config.stryker.ts` from its conserved copy (vitest
   loads `.ts` natively — proven in the dry run); set the `mutate`
   script to the bare `stryker run` (auto-discovery now works);
   re-prove the dry run; run the full mutation pass; bank `run.log`
   and `report.json` under
   `packages/core/type-helpers/mutation-evidence/` (dated amendment
   2026-08-09, Director ruling at execution: `report.html` is NOT
   banked — it is machine-generated markup fully regenerable from
   `report.json` via Stryker's report app, and committing it drew two
   MAJOR Sonar findings on generated content; dropping it preserves
   all knowledge with no exclusion and no hand-edit of a generated
   artefact); author the
   survivor-disposition ledger under the design constraint above;
   verify `pnpm check` green in the workspace (type-check and
   `knip:gate` both — if knip flags the string-referenced
   `vitest.config.stryker.ts` as unreferenced, configure the entry
   honestly, never suppress); **drop the branch's copy of this
   plan-node file**; un-draft #807 and land it at full condition.
   **Landing precondition**: the #807 merge waits until THIS node is
   on `origin/main` (it rides the next coordination fold; verify with
   `git cat-file -e origin/main:.agent/plans/delivery/mutation-testing-core-canary.plan.md`
   at the merge recount). Once this node is on main, the branch's
   stale copy becomes an add/add conflict at merge time — loud, not
   silent; dropping it in this slice removes the conflict AND the
   revert path a wrong "ours" resolution would open. The drop is safe
   only under the precondition — never before the node is on main.
2. **Reconcile the pilot plan** (docs-only, rides the coordination
   branch at slice 1's landing): a dated in-place amendment to the
   ratified `shared-construct-extraction-pilot.plan.md` re-pointing
   its pre-work item (c) at this node — a scope-reduction pointer
   (the pilot consumes this node's evidence; it no longer restates the
   completion steps).

## Acceptance criteria (each with a proof)

- The type-helpers canary runs to completion with a preserved report —
  `repo-safe`: the committed evidence artefacts (`run.log`,
  `report.json`, `report.html`) in
  `packages/core/type-helpers/mutation-evidence/`.
- Every surviving mutant carries a recorded disposition naming
  contract-completeness or equivalence/unreachability, never a
  mutant-targeted test — `owner-held` (reviewer judgement at the PR:
  the ledger is complete over the report's survivor list, and any
  added test cites the public-contract gap it describes independently
  of the mutant).
- No quality gate, CI job, `pnpm check` membership, or threshold
  changed anywhere — `repo-safe`: `pnpm check` green on the slice-1
  PR with the diff scoped to canary-workspace files and evidence
  artefacts (scope confirmed by reviewer at the merge recount —
  `owner-held` for the scope reading).
- The extraction closes its own stale-copy vector — `owner-held`:
  reviewer confirms at the merge recount that the slice-1 diff drops
  the branch plan-node copy and the landing precondition held.

## Out of scope

- **The search-contracts integration canary** (the 2026-08-05
  sequence's second canary). Dropped from this node at the 2026-08-09
  re-scope: its headline proof is unfalsifiable in that workspace
  (search-contracts has zero E2E test files, so "no E2E discovered"
  cannot fail), it is an order of magnitude larger than slice 1, and
  it carries an undecided config-drift fork. Integration-selection
  proof returns via the value-led rollout decision like every other
  workspace — chosen, when chosen, in a workspace that actually has
  E2E tests to exclude.
- Any blocking gate, threshold, or CI scheduling — promotion to a gate
  is a separate owner decision with its own evidence.
- Mutation runs on any workspace beyond the named canary — rollout is
  value-led and separately decided.
- Editing the conserved backlog mutation plans
  (`.agent/plans-backlog-2026-07/`) — append-never corpus; this node
  owns current truth.
- Expanding `validation-strategy.md` — the canary evidence is an input
  to that later crystallisation, not a licence to author it now.
- A Linear ticket at authoring time — the ticket embargo (owner ruling
  2026-08-04) lifts 2026-08-10; mint then and backfill `tickets`.
