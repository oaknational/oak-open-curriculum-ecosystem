---
name: cost of collaboration — agent-tools improvement plan
overview: Unified single-source-of-truth plan for improving agent-tools so that multi-agent collaboration windows produce more substance than coordination overhead. Subsumes primary-agent-tooling-enhancements.plan.md and lifts the structural insights from the 2026-05-11 four-agent session (Wooded / Galactic / Flamebright / Sparking Charring Ash) into P-ordered workstreams. The single guiding metric is **cost-per-coordination-event in agent-count-aware terms** — a protocol that works at N=1 may be fatal at N=4.
todos:
  - id: ws-p0-precommit-scope-gates
    content: Reshape the pre-commit hook without weakening its purpose: it must stop detectably broken code entering git history. Only file-content scanners may be narrowed to staged files; type-check, lint, shell lint, and the current unit-test lane still run before commit. Load-bearing pre-condition for every other multi-agent workstream.
    status: completed
  - id: ws-p0-qg-baseline-and-unblock
    content: Capture clean cold and warm `pnpm check:profile` baselines from `.logs/check-profiles/` after the owner-reported green `pnpm check` runs, then tune gate placement from that green baseline.
    status: completed
  - id: ws-p0-qg-trigger-contract
    content: Codify the quality-checkpoint trigger contract: pre-commit stops detectably broken code entering git history; pre-push stops broken code and higher-standard failures leaving the local environment; local `pnpm check`, GitHub CI, SonarQube Cloud, and GitHub CodeQL each name their purpose, assurance owner, and non-goals.
    status: completed
  - id: ws-p0-qg-staged-precommit-implementation
    content: Implement staged-file Prettier/Markdown pre-commit gates with regression coverage for ambient dirty peer files, while preserving pre-commit type-check, lint, shell lint, and unit/current-test proof as the broken-code guard.
    status: completed
  - id: ws-p0-qg-prepush-ci-rebalance
    content: Rebalance pre-push and GitHub CI so every gate removed from pre-commit still has an explicit assurance home, including knip, depcruise, Turbo families, UI/a11y/widget checks, and generated/artifact checks.
    status: completed
  - id: ws-p0-qg-profile-hardening
    content: Harden `repo-check profile` so profile artifacts record environment preflight, Playwright/browser readiness, skipped post-Turbo gates, and optional captured output for many-process diagnosis.
    status: completed
  - id: ws-p0-qg-postchange-measurement
    content: Re-profile after the gate rebalance, compare cold and warm runtimes against the baseline, and record which assurance was preserved, moved, or intentionally traded off.
    status: completed
  - id: ws-p-foundation-cli-overhaul
    content: Agent-tools CLI architectural overhaul. Single binary entrypoint with centralised parsing, error handling, and logging. Stop the build-on-every-invocation anti-pattern (defeats stability) and the bin-collection-without-shared-plumbing anti-pattern (defeats centralisation). Foundational pre-condition for P1–P7 implementations; land between P0 and P1.
    status: completed
  - id: ws-p1-comms-direct-and-reply
    content: Implement B-11 directed-message authoring CLI (`comms direct` + `comms reply`) per the locked sidebar design at `.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`. Lands in the unified CLI shape from P-Foundation.
    status: completed
  - id: ws-p2-comms-watch
    content: Add `comms watch` with `fs.watch` + polling fallback to replace 30s bash poll loops. Sub-second new-message latency for any agent that runs the watch as a long-lived process.
    status: completed
  - id: ws-p3-commit-queue-enforcement
    content: Promote the commit queue from advisory predictor to enforced pre-stage gate. Refuse `git add` (via a commit-queue CLI guard wrapping `git add`, or a stage-time precondition check) when no active intent matches the staged file set. Note Git/Husky have no native `pre-stage` hook lifecycle; the enforcement lives in the agent-tools CLI or a wrapper, not in a hook of that name.
    status: completed
  - id: ws-p4-identity-disambiguation
    content: Make `(agent_name, platform, session_id_prefix)` the routing key in claim and comms writes; refuse a write whose tuple collides with an existing live identity.
    status: completed
  - id: ws-p5-unified-comms-format
    content: Collapse the three-directory split (`comms-events/`, `comms-lifecycle/`, `comms-messages/`) and the three `$defs` into a single shape with a `kind` discriminant. Owner-relayed direction "ONE comms format used everywhere, no legacy lingering."
    status: completed
  - id: ws-p8-collaboration-tui
    content: Build a human-facing real-time TUI for the main comms thread, direct-message threads, and active-agent state so operators can watch collaboration without tailing rendered markdown or raw JSON event directories. Owner-directed sequence update 2026-05-12: run immediately after P5. Review update 2026-05-13: cdfb8959 landed a useful snapshot/text-mode slice and Ink primitives, and P5 now supplies the unified comms source; P8 acceptance remains pending until real-time refresh, inactive-agent visibility, and boundary/tooling gaps are resolved.
    status: pending
  - id: ws-p6-coordination-artefact-isolation
    content: Isolate coordination artefacts (sidebars, canonical comms events, monitor telemetry) from gate-visible repo state. Either separate branch/worktree or gitignored space.
    status: pending
  - id: ws-p7-async-sync-mode-awareness
    content: Add work-shape awareness to the polling/watch protocol so design (sub-second), execution (minutes), and monitoring (hour+) each get the right cadence.
    status: pending
  - id: ws-subsumed-residual
    content: Carry forward the residual non-subsumed workstreams from primary-agent-tooling-enhancements.plan.md (comms render resilience F-05 finishing pass, identity-build-isolation split, register closeout).
    status: pending
isProject: false
---

# Cost-of-Collaboration — Agent-Tools Improvement Plan

## One-line framing

Owner standing direction: *"lowering the cost of collaboration will increase
the rate of innovation and advancement"* (2026-05-11). Every workstream in
this plan is evaluated against the single metric **cost-per-coordination-
event in agent-count-aware terms**.

## Scope

This is the single source of truth for agent-tools improvement work. It
subsumes:

- [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
  — the pre-2026-05-11 workstream split. The completed work (shared CLI
  discoverability via F-01/F-02/F-04/F-09/F-12/F-13) remains landed; the
  remaining workstreams are re-homed inside this plan's P-order.
- The 19-entry [frictions register](../frictions-register.md) — remains
  the source of truth for issue inventory. This plan's workstreams point
  at the relevant friction IDs.
- The locked sidebar design for B-11 directed-message authoring at
  `.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`.
- The `pnpm check` profiling deep dive at
  [`../pnpm-check-profiling-deep-dive-2026-05-12.md`](../pnpm-check-profiling-deep-dive-2026-05-12.md),
  which supplies the current quality-gate graph, trigger map, and tuning
  recommendations.
- Owner live change on 2026-05-12: root `pnpm check` has started moving its
  terminal proof steps to non-mutating commands (`lint`, `markdownlint-check`,
  and `format-check`). Treat that as part of the current baseline to verify,
  not as proof that P0 is complete.

This plan does NOT re-execute work that has already landed (B-10 compat
shims landed at `0be469a9`; F-15 fingerprint-recursion guard landed at
`70e746a3`). It re-frames the *remaining* and *newly-named* work in a
single P-ordered list.

## Reviewer synthesis — 2026-05-12

**Review scope**: branch `feat/mcp-graph-support-foundation`, especially
P-Foundation/P1/P2/P3/P4/P8 and `cdfb8959` (`feat(agent-tools): add
collaboration tui with design primitives`).

**Reviewers consulted**: code reviewer; architecture reviewers Barney, Betty,
Fred, and Wilma; test reviewer; type reviewer; docs/ADR reviewer;
design-system reviewer; config reviewer; React/Ink reviewer.

**Verdict**: the landed TUI and design-primitives commit is useful operator
surface area, but it is a **P8 snapshot slice**, not P8 completion. A live TUI
is not optional: it is the human-visible proof surface for this whole
cost-of-collaboration arc. The reviewers converged that the current slice can
increase some collaboration costs by making an old storage shape and a partial
visibility model look authoritative. Do not route future work as though P8
acceptance has landed.

**Owner constraint recorded during review**: `.agent/directives/principles.md`
commits this repo to "Strict and complete, everywhere, all the time." For the
collaboration-state readers, that means strict Zod validation at the boundary,
not partial parsing followed by trusted TypeScript casts.

### Cross-review findings

1. **P8 landed before P5 and now consumes the split comms store.** The plan
   says P5 collapses `comms-events/`, `comms-lifecycle/`, and
   `comms-messages/` into one discriminated event shape, and P8 builds on
   that. The landed TUI hard-codes and reads the three legacy directories,
   which makes the P5 migration more expensive. Keep P8 pending until either
   P5 lands or a clearly temporary adapter is added and scheduled for deletion.

2. **The TUI is manually refreshed, not real time.** Reviewers found no watch
   loop, interval, or reuse of `comms watch`; the controller refreshes only
   when the operator presses `r`. In a claim handoff or commit-queue race, this
   can present stale state with dashboard authority. P8 needs an injected
   update source, automatic refresh, stale-result protection, and behavioural
   tests before it satisfies the acceptance criteria.

3. **Inactive-agent visibility is narrower than the acceptance text.**
   `activeAgentReports` can model closed-only inactive agents, but the TUI
   snapshot filters reports down to agents with live claims or queue entries.
   That hides useful identity/collision/debugging history and violates the P8
   requirement that active, stale, inactive, and uncertain agents appear in one
   surface.

4. **P3 enforcement remains partly advisory.** The commit-queue guard exists,
   but ordinary explicit `git add path` can still skip it. The guard also
   needs to reject stale `git:index/head` claims, not just matching claim ids.
   Either attach enforcement to the actual staging workflow or downgrade the
   recorded P3 claim from "enforced" to "guard command landed".

5. **Runtime validation is not strict enough for collaboration state.**
   The type reviewer found `parseClaim` spreading partially checked JSON into
   a trusted `CollaborationClaim`, allowing optional and nested fields to keep
   invalid runtime shapes. This conflicts with the strict/complete principle
   and should move to strict Zod schemas for active claims, closed claims,
   comms events, queue state, and TUI snapshot inputs.

6. **Schema/version contracts disagree.** JSON schemas allow older v1.x
   versions and describe opaque preservation for future additive minor fields,
   while TypeScript parsers accept only `1.3.0` and reject unknown area kinds.
   Either narrow the schema/docs to latest-only or implement the advertised
   compatible-v1 contract in the parser and types.

7. **The TUI widens the hot CLI dependency graph.** `cli-specs.ts` eagerly
   imports the TUI handler, which imports Ink, React, and `oak-design-ink`.
   Routine commands such as identity preflight and claims list now depend on
   the interactive UI graph. Lazy-load the TUI path, or keep terminal
   primitives local until the boundary decision is settled.

8. **Design/package boundaries need reconciliation.** Architecture reviewers
   flagged the `agent-tools -> packages/design` dependency against ADR-041's
   boundary matrix. Design review also found `oak-design-ink` can import
   `design-tokens-core` directly even though ADR-148 describes it as depending
   on `oak-design-tokens`. Resolve the ADR/enforcement mismatch before adding
   more reusable Ink surface.

9. **Quality-tooling coverage regressed.** Config review confirmed `pnpm knip`
   is red because `knip.config.ts` does not include `.tsx` consumers in
   `agent-tools` and does not model the new `oak-design-ink` workspace. The
   root `agent-tools:build` helper also does not prove the runtime closure for
   built `agent-tools` once it imports built design packages.

10. **P-Foundation is complete only for the dispatcher/build-isolation slice.**
    Reviewers agreed the unified entrypoint landed useful plumbing, but the
    acceptance item "ordinary workflows hide mechanics" is still open:
    `--active`, `--now`, claim ids, intent ids, and registry paths remain
    ordinary operator inputs. Split the completed single-dispatcher work from
    an open ergonomics/F-19 slice.

11. **Readers are too fragile under malformed or racing files.** One malformed
    event file can take down readers because event directories parse as all or
    nothing. The TUI reads active claims, closed claims, comms, and queue state
    as separate unprotected snapshots, so a concurrent close/handoff can render
    an impossible mixed moment. Readers should degrade per file, surface
    diagnostics, and either retry or declare snapshot incoherence.

12. **Watch/read state has small operational traps.** The documented `.seen/`
    path for `comms watch` can fail when the parent directory does not exist.
    Queue expiry rendering treats invalid timestamps as active-looking.
    Staged-file discovery still parses newline-delimited paths instead of a
    NUL-safe form. These are minor today, but exactly the kind of edges that
    become expensive during multi-agent pressure.

13. **CLI option contracts are split and drift-prone.** Known option keys,
    command specs, and help text are separate string lists; some existing
    options can parse a missing value as `"true"`. TUI default paths also erase
    their key union with `Record<string, string>`. Move option metadata to one
    typed registry with explicit `requiresValue` semantics.

14. **React/Ink interaction needs state-machine hardening.** Scroll offsets are
    stored unbounded, so panes can appear stuck after repeated down-arrow input.
    Manual refresh has no in-flight or stale-result protection, so older
    refreshes can overwrite newer snapshots. Add component/hook tests for tab
    switching, bounded scrolling, refresh success/failure, and quit handling.

15. **Ink design primitives are useful but too raw.** `Panel` only accepts a
    string title, so active-pane state is encoded by mutating title text.
    `OakText` exposes raw Ink `color`/`backgroundColor`, and consumers still
    use raw `dimColor`. Add tokenised tone/active/header APIs so the design
    primitive carries the convention rather than each consumer.

16. **Terminal theme semantics need more status tokens.** The TUI hard-codes
    dark mode with no CLI theme option. Warning currently reuses the focus-ring
    semantic token, collapsing operational status meaning; status badges imply
    distinct semantics that the token projection does not yet provide.

17. **Test coverage describes implementation shape too narrowly.** The TUI
    tests cover snapshot projection and text formatting, but not CLI dispatch,
    invalid `--format`, default path resolution, real-time updates, inactive
    closed-only agents, or component interaction. P2 watch fallback uses timing
    and filesystem effects rather than deterministic injected sources. Several
    unit/integration files still mix real filesystem IO with in-process tests.

18. **Docs/ADR state has drift.** P8 still reads as pending-after-P5 while a
    partial P8 slice has landed; this note preserves that distinction. ADR-178
    overstates build-isolation coverage because some operational scripts still
    build or run source-mode. The ADR index omits recent ADRs, ADR links point
    at non-existent filenames, and this plan still contains machine-local
    Claude memory links.

19. **Small diagnostics and exports matter.** Boundary diagnostics can name
    `oak-design-tokens` when the forbidden import is `oak-design-ink`.
    TUI-specific help is hard to reach because top-level help intercepts it.
    TUI entry types are not exported through the collaboration-state barrel.
    A stale Knip ignore for `@commitlint/cli` remains after the hook change.

### Recommended routing

1. Treat `cdfb8959` as a landed **snapshot v1** and keep P8 open. P8 remains
   mandatory, not a discretionary polish or demo task.
2. First repair the red and strictness issues: Knip config, strict Zod
   boundary validation, stale-claim guard rejection, and TUI CLI dispatch tests.
3. Decide the `agent-tools -> design` boundary before growing `oak-design-ink`
   further: either ADR-041/ADR-148 are amended and enforcement follows, or the
   TUI keeps terminal primitives local/lazy-loaded until there is a second
   consumer.
4. Re-sequence deliberately before continuing storage work. Reviewers split on
   whether P6 design must precede P5, but they agreed P5/P8/P6 are now coupled:
   storage unification, artefact isolation, and the live TUI source should be
   decided together rather than patched independently.
5. Only mark P8 complete after unified comms, automatic refresh, inactive
   visibility, strict validation, human-visible live value signals, and
   component/CLI behaviour tests are all green.

## Structural insights driving the P-order

The 2026-05-11 four-agent session (Wooded / Galactic / Flamebright /
Sparking Charring Ash) generated convergent evidence across four
independent napkin entries. Five load-bearing insights:

1. **Pre-commit gates scanning ambient tree, not staged content, is the
   single load-bearing defect blocking every multi-agent protocol.** No
   coordination discipline survives a snapshot that goes stale the moment
   any peer agent writes another file.
2. **Peer-pair sidebars beat coordinator+helpers for design.** Helpers
   are for parallel execution of decided work; design requires dialogue
   between comparable agents.
3. **Information density per turn > round-trip latency.** Coordination
   cost compounds geometrically with agent count, not linearly.
4. **Coordination artefacts are tree-state mutations.** A coordinator
   who writes 31 directed messages adds 31 files; each can trip a gate.
5. **The advisory predictor is the protocol's weakest joint.** Anything
   that *can* be skipped *will* be skipped under pressure. Commit queue,
   claim registry, comms protocol — each is advisory; each was skipped
   by at least one agent in this session.
6. **Quality checkpoints need different contracts at different trigger
   surfaces.** Pre-commit broken-code guard, staged content-scanner feedback,
   local exhaustive proof, branch-exit proof, shared CI proof,
   static-analysis quality gates, and
   semantic security scanning are distinct jobs. Collapsing them into one
   "run everything everywhere" instinct raises collaboration cost without
   making the assurance clearer.

The P-order below sorts strictly by which insight each workstream
addresses, with P0 being the load-bearing prerequisite.

## Standing constraints

- **Block all multi-agent collaboration windows on Workstream P0 landing.**
  This is non-negotiable. P0 must reduce ambient-tree contention without
  weakening the pre-commit invariant: detectably broken code does not enter
  git history.
- **Test-first per the TDD-as-design directive.** Every bug-fix slice
  lands the failing test in the same atomic commit as the fix.
- **Schema-first per the schema-first-execution directive.** Type flow
  from schema; no widening; compat at boundary; strict at write.
- **No advisory-only protocols going forward.** Any new protocol layer
  must include a structural enforcement path or it does not land.
- **Capture-as-you-go.** Insights, frictions, and corrections land in
  the napkin during the session, not after.
- **No new bins; land new CLI surface in the unified entrypoint.**
  After P-Foundation lands, new agent-tools subcommands MUST be
  added inside the single-bin dispatcher, not as new sibling bins.
  This is the structural cure for the "CLI as collection of bins
  with build-on-every-invocation" defect P-Foundation pays down.
- **Assurance-moving must be explicit.** Any speed-up that removes a
  check from a trigger must name the assurance that remains at that
  trigger, the trigger that now owns the moved assurance, and the evidence
  command that proves the new placement still works. The trigger purposes are
  distinct: pre-commit is the broken-code history guard; `pnpm check` is the
  exhaustive local proof; pre-push is the local-environment exit guard plus
  higher standards; CI is the shared reproducible proof.

## Workstreams

### P0 — Pre-commit broken-code guard

**Hypothesis**: pre-commit's purpose is to stop detectably broken code entering
git history. Pre-push's purpose is stronger: stop broken code, plus code that
fails the repo's additional high standards, leaving the local environment.
The current pre-commit hook also lets file-content scanners such as Prettier
and Markdownlint scan the ambient working tree (`staged plus unstaged plus
untracked`) at hook-fire time, so a peer's dirty file can block an unrelated
clean commit. The fix is not to make pre-commit weaker; it is to narrow only
ambient-sensitive content scanners to the staged bundle while preserving
pre-commit's broken-code guard.

**Evidence**: three serial deadlock iterations on 2026-05-11 — knip on
peer-unstaged code, prettier on peer-unstaged code, markdownlint on
coordinator-authored file written after the gatekeeper sweep. See
[`feedback_pre_commit_hook_must_gate_staged_only`](../../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_pre_commit_hook_must_gate_staged_only.md)
(claude-code agent-local memory; cross-platform mirror under owner
direction if required).

**Concrete shape**:

- Introduce `lint-staged` (or equivalent staged-list-derived runner)
  for Prettier and Markdown formatting checks.
- Keep type-check, lint, shell lint, and the current `pnpm test`/Turbo `test`
  lane in pre-commit. If a clean unit-vs-integration split lands later,
  pre-commit may narrow from `test` to an explicit unit-test lane only if that
  lane preserves the "no detectably broken commits" invariant.
- Keep integration tests, E2E tests, dependency graph checks, generated-drift
  checks, and similar higher-standard repo assertions at pre-push, `pnpm
  check`, CI, or another explicitly named stronger trigger rather than trying
  to derive them from staged file lists.
- Knip and depcruise are classified by owner direction as higher-standard
  gates. Keep them at pre-push, `pnpm check`, and CI rather than in
  pre-commit.
- Regression test: a working-tree scenario where Agent A has unstaged
  violations and Agent B's staged-clean commit succeeds.

**Acceptance**:

- Multi-writer scenario passes its regression test.
- Documented hook runtime improves where ambient-sensitive content scanners
  were the cost, but runtime reduction is secondary to preserving the
  broken-code guard.
- The agent-tools test suite passes unchanged.
- Any gate moved out of pre-commit has an explicit classification and a
  stronger trigger home.

**Routing**: this is a `.husky/pre-commit` + `package.json` change, NOT
inside agent-tools/src. The fix lives at the repo root. It should not
be bundled with agent-tools workspace changes.

**Risk**: lint-staged maintenance shape; preserving `type-check lint test` in
pre-commit means the runtime reduction is smaller than a content-only hook.
That cost is intentional: there is no efficiency in allowing broken code into
repo history. The only valid speed-up is one that keeps the trigger contract
intact.

#### P0 quality-gate performance implementation tasks

The `pnpm check` profiling pass split P0 into implementation tasks so the
performance work can be executed without weakening the assurance contract.
These tasks are part of P0, not a replacement for it.

##### P0.QG-1 — baseline and unblock

**Goal**: establish a clean quality-gate performance baseline before further
tuning.

**Starting state**: the 2026-05-12 profile reached the real workload but
failed in `@oaknational/oak-curriculum-mcp-streamable-http#test` at
`src/correlation/middleware.integration.test.ts:203`. The owner subsequently
reported multiple green full `pnpm check` runs, so that profile failure is now
historical evidence rather than the current blocker. The owner also changed
`pnpm check` so its lint, Markdown, and format proof steps are non-mutating; the
baseline must verify that behaviour and measure its effect.

**Implementation tasks**:

1. Run `pnpm check:profile` in a clean prepared environment.
2. Run a second warm-cache `pnpm check:profile` without changing inputs.
3. Confirm the profile and script evidence show non-mutating lint,
   Markdown, and format proof steps in the root `pnpm check` path.
4. Store both artifacts under `.logs/check-profiles/` and summarise them in
   the profiling deep dive or a sibling evidence note.

**Acceptance**:

- Cold and warm profiles exist and include duration, exit code, Turbo dry
  graph, and enough evidence to compare cache behaviour.
- The root `pnpm check` path is verified as a proof command for lint,
  Markdown, and format, not an auto-fix command.
- No further checkpoint tuning starts from a red baseline unless the owner
  explicitly accepts the red condition as the baseline.

**2026-05-12 evidence**:

- P0.QG evidence is recorded at
  `.logs/check-profiles/p0-qg-baseline-2026-05-12.md`.
- Hushed Shrouding Mist captured representative busy-checkout baselines after
  disposing the flaky-test candidates:
  `.logs/check-profiles/check-profile-2026-05-12T07-33-57-773Z.json`
  passed with exit code 0 and duration 147613 ms; the immediate warm rerun at
  `.logs/check-profiles/check-profile-2026-05-12T07-36-18-375Z.json` passed
  with exit code 0 and duration 131695 ms. These runs represent the typical
  multi-agent checkout rather than an artificially pristine tree.
- A warm green `pnpm check:profile` baseline exists at
  `.logs/check-profiles/check-profile-2026-05-12T06-57-53-216Z.json`
  with exit code 0 and duration 130561 ms.
- The preceding escalated cold-like attempt reached the real workload but
  failed on a now-suspected flaky OAuth rate-limit test. Treat
  `.logs/check-profiles/check-profile-2026-05-12T06-55-17-199Z.json` as
  failure evidence, not a clean cold baseline.
- The suspected OAuth rate-limit and correlation middleware failures did not
  reproduce under repeated focused and adjacent-suite runs; disposition lives
  in `cost-of-collaboration.flaky-tests.md`.
- The current dry graph has been corrected to match root `pnpm check`: it
  contains `lint`, not `lint:fix`.

##### P0.QG-2 — trigger contract

**Goal**: make each quality checkpoint's job explicit before changing hook
placement.

**Implementation tasks**:

1. Add a trigger-contract table to this plan or a linked permanent doc.
2. For each trigger, record purpose, command surface, assurance owner,
   non-goals, and fallback trigger:
   - local engineer proof via `pnpm check`;
   - pre-commit;
   - pre-push;
   - GitHub push / PR CI;
   - SonarQube Cloud;
   - GitHub CodeQL.
3. Record the rule that pre-commit stops detectably broken code entering git
   history, while pre-push stops broken code and higher-standard failures
   leaving the local environment.

**Acceptance**:

- A future agent can answer "where did this assurance move?" from the table.
- The table names at least one deterministic validation command per local
  trigger.
- SonarQube Cloud and CodeQL remain separate from build/test/lint gates.

**Target trigger contract**:

| Trigger | Command surface | Purpose | Non-goal |
| --- | --- | --- | --- |
| Pre-commit | `.husky/pre-commit` | Stop detectably broken code entering git history. Staged-file content checks are allowed only for scanners whose whole-tree behaviour is the source of false ambient failures. | It is not a weaker, convenience-only hook. |
| Pre-push | `.husky/pre-push` | Stop broken code and code that fails additional high standards from leaving the local environment. | It is not the first place obvious local breakage should be discovered. |
| Local full proof | `pnpm check` | Exhaustive local proof command for the repo's full quality contract. | It is not optimised for every commit boundary. |
| GitHub CI | `.github/workflows/ci.yml` | Shared reproducible proof for branch and PR state. | It is not a substitute for local proof before publishing. |
| SonarQube Cloud | SonarQube Cloud project gate | External static-quality and maintainability signal. | It does not replace build, type, lint, or test gates. |
| GitHub CodeQL | GitHub code scanning | External semantic security analysis. | It does not replace local security hygiene or test gates. |

##### P0.QG-3 — scoped pre-commit implementation

**Goal**: reduce commit-window contention by making ambient-sensitive content
scanners inspect the staged bundle rather than the ambient working tree, while
preserving the pre-commit checks that prevent broken code being committed.

**Implementation tasks**:

1. Introduce `lint-staged` or an equivalent staged-list-derived runner.
2. Route formatting and markdown checks through staged paths.
3. Keep shell lint in the local proof path.
4. Keep Turbo `type-check lint test` in pre-commit until there is an explicit
   and validated unit-test-only lane that preserves the broken-code guard.
5. Keep owner-classified higher-standard gates (`knip` and `depcruise`) at
   pre-push, `pnpm check`, and CI rather than in pre-commit.
6. Add a regression proving a staged-clean commit succeeds while an unrelated
   unstaged peer file remains dirty.

**Acceptance**:

- Pre-commit no longer fails solely because of unrelated unstaged or untracked
  peer files that are only visible to content scanners.
- Staged formatting/markdown violations still fail before commit.
- Type-check, lint, shell lint, and unit/current tests still fail before
  commit when the committed code is broken.
- Any runtime improvement is reported as a consequence of scoped content
  scanners, not as permission to remove broken-code detection from pre-commit.

**2026-05-12 regression evidence**:

- `agent-tools/tests/repo-check.integration.test.ts` covers staged Prettier
  and staged Markdownlint behaviour with unrelated ambient dirty-file sentinels,
  no-staged/no-Markdown no-ops, and staged violation propagation.
- Representative temp-index `.husky/pre-commit` timing for the P0.QG staged
  files passed in `real 2.39`.
- Suspected flaky tests discovered during profiling are tracked in
  `cost-of-collaboration.flaky-tests.md`.

##### P0.QG-4 — pre-push and CI assurance rebalance

**Goal**: ensure every assurance removed from pre-commit is either not a
broken-code guard or has an owner-approved stronger trigger home.

**Implementation tasks**:

1. Update `.husky/pre-push` and `.github/workflows/ci.yml` only where the
   trigger contract shows a gap.
2. Keep `knip` and `depcruise` at a trigger with whole-repo context.
3. Keep generated/artifact drift checks at a trigger that runs after relevant
   generation/build tasks.
4. Keep UI/a11y/widget coverage in explicit `pnpm check`, CI, or a clearly
   named pre-push lane; do not silently drop it.
5. Update any contributor-facing docs or handoff surfaces that misstate the
   pre-commit/pre-push contract.

**Acceptance**:

- The trigger-contract table has no orphaned assurance rows.
- GitHub CI remains the shared proof surface for repo-wide build/type/lint/test
  and dependency-graph checks.
- Pre-push remains a branch-exit guard, not a duplicate of `pnpm check` unless
  the owner explicitly chooses that cost.

**2026-05-12 evidence**:

- `.husky/pre-push` keeps the moved higher-standard checks: `secrets:scan`,
  `format-check:root`, `markdownlint-check:root`, `subagents:check`,
  `portability:check`, `knip`, `depcruise`, `repo-validators:check`,
  `lint:shell`, and Turbo `sdk-codegen build type-check lint test test:e2e
  test:ui`.
- `.github/workflows/ci.yml` keeps the shared proof surface: secret scan,
  non-mutating format/Markdown checks, subagent/portability validation,
  repo validators, shell lint, Playwright install, Turbo `sdk-codegen build
  type-check lint test test:e2e test:ui`, then `knip` and `depcruise`.
- UI/a11y/widget checks remain explicit in `pnpm check`, which is the
  exhaustive local proof rather than the commit-boundary trigger.

##### P0.QG-5 — profile hardening

**Goal**: make profile artifacts explain the many-process workflow and its
environment constraints without requiring chat-memory reconstruction.

**Implementation tasks**:

1. Extend `repo-check profile` with environment preflight evidence:
   pnpm store/offline-cache state, Playwright browser availability, and known
   sandbox/browser launch constraints.
2. Record whether post-Turbo gates ran or were skipped because Turbo exited
   first.
3. Add an optional captured-output mode or deterministic log pointer for the
   highest-signal task logs.
4. Cover the new artifact shape with agent-tools tests.

**Acceptance**:

- A failed profile artifact says whether it failed on environment setup,
  Turbo task failure, or post-Turbo gate failure.
- The artifact preserves raw or pointer evidence under `.logs/check-profiles/`.
- The command stays safe for local engineer use; it does not hide or suppress
  failing gates.

**2026-05-12 evidence**:

- `repo-check profile` artifacts now include environment evidence: Node,
  platform, architecture, pnpm store path, Playwright browser cache path,
  browser cache existence, and a sandbox note for macOS Chromium Mach-port
  failures.
- Profile artifacts now classify failures as `environment`, `turbo-task`,
  `post-turbo-gate`, `check-command`, or `passed`, and record whether
  post-Turbo gates ran, were skipped after a Turbo failure, were not observed,
  or were not captured.
- `repo-check profile --capture-output` writes a deterministic
  `.logs/check-profiles/check-output-*.log` pointer without suppressing the
  failing command's exit code.
- Focused validation: `pnpm --filter @oaknational/agent-tools exec vitest run
  tests/repo-check.integration.test.ts`, `pnpm --filter @oaknational/agent-tools
  type-check`, and `pnpm --filter @oaknational/agent-tools lint` passed. Lint
  still reports the pre-existing warning in
  `agent-tools/tests/collaboration-state/collaboration-state.integration.test.ts`.

##### P0.QG-6 — post-change measurement and decision record

**Goal**: prove the tuning improved collaboration cost without weakening the
repo's stability contract.

**Implementation tasks**:

1. Re-run cold and warm `pnpm check:profile`.
2. Time a representative clean staged commit through the real pre-commit hook.
3. Run the pre-push/CI-equivalent local commands named by the trigger
   contract, or record which ones require GitHub infrastructure.
4. Update this plan with the before/after table and any follow-up rows.

**Acceptance**:

- Pre-commit runtime and failure scope improve against the baseline.
- `pnpm check` remains the exhaustive local proof command.
- Every speed-up names the assurance preserved, moved, or intentionally traded
  off.

**2026-05-12 evidence**:

- Representative temp-index `.husky/pre-commit` timing for the staged P0.QG
  files passed in `real 2.39`; staged Prettier and Markdownlint were scoped to
  staged files, while shell lint and Turbo `type-check lint test` remained in
  the broken-code guard.
- Busy-checkout profile baseline passed at
  `.logs/check-profiles/check-profile-2026-05-12T07-33-57-773Z.json`
  (147613 ms, exit 0). Immediate warm rerun passed at
  `.logs/check-profiles/check-profile-2026-05-12T07-36-18-375Z.json`
  (131695 ms, exit 0).
- The original OAuth and correlation flaky candidates did not reproduce under
  repeated focused/adjacent-suite runs; the profile-only public-resource E2E
  parse error also did not reproduce under focused or full E2E reruns.

---

### P-Foundation — Agent-tools CLI architectural overhaul

**Hypothesis**: the agent-tools "CLI" is not actually being used as a
CLI; it is being used as a collection of bin files, with `pnpm -s
build` triggered before each invocation. This defeats both the
stability point of using built artefacts (rebuilding on every call
means the bin DOES change between calls, just from the caller's own
edits) and the centralisation point of having a CLI (each topic bin
has its own option parsing, its own help text, its own error shape,
its own logging). Confirmed empirically this session: every
`pnpm agent-tools:commit-queue --` and `pnpm
agent-tools:collaboration-state --` invocation runs `pnpm -s build &&
node dist/src/bin/<topic>.js`, paying the build cost and bypassing
any unified entry point.

**Evidence**: owner direction 2026-05-12 ("the agent skills CLI is
not being used as a CLI, it is being used as a collection of bin
files, with a build triggered before each invocation… the point of
using the built versions is stability, which is utterly bypassed if
we build on every invocation, and the point of having a CLI is
centralised parsing, error handling, logging etc"). Composes with
F-obs-E (stable CLI entry without rebuild-on-invoke) from comms-event
`37ea0341` and with the standing memory direction
`feedback_use_built_agent_tools_only` ("use built dist/, not rebuild
on each invocation").

**Concrete shape**:

- Single binary entrypoint `agent-tools` (or equivalent name) that
  dispatches to topic+action handlers internally. `agent-tools <topic>
  <action> [flags]` is the user-facing shape; today's
  `pnpm agent-tools:<topic> -- <action>` scripts become thin pnpm
  shortcuts to that single bin or are retired.
- Centralised arg parsing (resolves F-obs-F help-routing-on-invalid
  - addresses F-09 full-help-on-invalid-flag class structurally).
- Centralised error handling: one error shape across topics; the
  "missing required option X" / "unknown option Y" failure modes
  produce consistent guidance instead of per-bin variants.
- Centralised logging: structured log lines suitable for piping into
  the canonical comms surface or a structured-log file. Today there is
  no logging at all; agents read raw stdout/stderr.
- CLI-owned operational mechanics: agents should not have to provide
  fresh ISO date strings, UUIDs, claim ids, intent ids, or registry
  paths for ordinary flows. The current surface is too low-level: it
  exposes implementation mechanics that the tool can generate or
  resolve from identity, thread, current working tree, and active
  queue/claim state. P-Foundation should provide human-scale commands
  that derive `now`, create IDs internally, and let agents refer to
  "my active claim", "this commit intent", or "the current thread"
  without hand-copying internal identifiers unless disambiguation is
  genuinely required.
- Build runs ONCE on package install (or via an explicit
  `agent-tools rebuild` for in-flight dev), not before every
  invocation. Stability comes from "the bin does not change while
  you're using it"; the current shape provides the opposite.
- Topic+action surface preserved: existing topics (`claims`, `comms`,
  `conversation`, `escalation`, `commit-queue`, `identity`, `check`)
  remain. The overhaul is the *plumbing*, not the *surface*. Agents
  already familiar with `claims open --thread X` keep that vocabulary;
  the change is one bin, one parser, one error shape underneath.
- Pre-existing CLI behaviour preserved by regression tests authored
  before the refactor lands.

**Acceptance**:

- Single bin file exposed as the only entrypoint; existing topic-bin
  files retired or stubbed to forward.
- `time pnpm agent-tools <topic> <action>` measurably faster than
  `time pnpm agent-tools:<topic> -- <action>` today (build cost no
  longer in the hot path).
- Every existing CLI invocation in the agent-tools test suite passes
  unchanged.
- Help text on `<topic> --help`, `<topic> <action> --help`, and
  unknown-action / unknown-flag paths is consistent across topics
  and prints full help, not stub error.
- Structured logging output landed (even minimal) — the entrypoint
  has a hook the rest of the topics will start using.
- Ordinary workflows hide mechanics: IDs and timestamps are generated
  internally; the CLI resolves current-agent/current-thread/current-
  intent defaults; explicit UUID/date flags remain available only for
  recovery, replay, or deterministic tests.

**2026-05-12 evidence**:

- Unified entrypoint landed at `agent-tools/src/bin/agent-tools.ts` with
  pure dispatcher coverage in `agent-tools/tests/agent-tools-cli.unit.test.ts`.
  The dispatcher owns global topic parsing, top-level help/error shape,
  stdout/stderr capture, and a structured lifecycle log hook via
  `--log-json`.
- The hot collaboration scripts for `agent-identity`, `collaboration-state`,
  `commit-queue`, and `branch-touched-files` now call the built single bin
  (`dist/src/bin/agent-tools.js <topic> ...`) instead of running
  `pnpm -s build` before each invocation. The legacy topic bin files are
  forwarding stubs to preserve direct-node compatibility without keeping
  separate process plumbing.
- Documentation now names `pnpm agent-tools <topic> <action> [options]` as
  the stable hot path and keeps the old topic scripts only as shortcuts to
  the same built file.
- The commit-queue topic now treats `--help` / `-h` as value-less help flags
  through the unified dispatcher, preserving both `pnpm agent-tools
  commit-queue enqueue --help` and legacy shortcut help flows.
- Existing low-level workflows already generate ordinary IDs and timestamps
  where the current commands support it (`claims open` and `commit-queue`
  intent creation); P1/P3 add the higher-level command affordances on top of
  this single entrypoint rather than as sibling bins.

**Why it sits between P0 and P1**:

- P0 (pre-commit broken-code guard plus staged content scanners) remains the
  load-bearing prerequisite for multi-agent commit at all.
- This refactor is the foundational architectural pre-condition for
  P1–P7 *implementations* — every new subcommand (`comms direct`,
  `comms reply`, `comms watch`, `commit-queue guard`, etc.) should
  land in the unified CLI shape rather than spawn another bin. Adding
  P1's subcommands to the current bin-collection shape would deepen
  the debt this workstream pays down. Land this before P1.
- E-2 (`agent-tools git` passthrough) is the canonical consumer:
  without a unified CLI surface, the passthrough has nowhere to live.

**Risk**:

- Refactor scope is large; touches every existing bin entry and the
  pnpm script surface. Single-agent window only. Test-first
  regression coverage is the safety mechanism — capture every
  existing invocation's behaviour as a test before any plumbing
  change.

**Routing**: claim area `agent-tools/src/**` plus
`agent-tools/package.json` plus root `package.json` (for the pnpm
script renames). Implementer: single-agent window post-P0.

---

### P1 — `comms direct` + `comms reply` (B-11)

**Hypothesis**: hand-authoring a JSON file with UUID, ISO timestamp,
full identities, kind, subject, body for every directed message imposes
a ~60s per-turn floor. With four agents and multiple threads that floor
caps coordination at ~1 decision per minute.

**Architectural note**: P1 implementation should land in the unified
CLI shape produced by **P-Foundation** (the agent-tools CLI
architectural overhaul) rather than as a new sibling bin. If P-Foundation
has not landed when P1 is opened, P1's first step is to confirm with
the owner whether to (a) wait for P-Foundation, or (b) land P1 in the
current bin-collection shape and migrate during P-Foundation. Default:
(a), because P1's value is in the new subcommands' adoption, not in
their existence in the current debt-shape.

**Evidence**: 31 hand-authored directed messages in the 2026-05-11
session; observed friction at F-obs-A in comms-event `37ea0341`
authored 2026-05-11T19:52:42Z.

**Design**: locked in
[`.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`](../../../state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md)
across Turn 1 + Turn 2 + Turn 3 + joint decision. Summary:

- New file `agent-tools/src/collaboration-state/cli-comms-messages.ts`
  (NOT in `cli-comms-inbox.ts` which stays read-side only).
- `comms direct --comms-dir --to-agent-name --to-platform --to-model
  --to-session-prefix --kind --subject --body [--event-id] [--now]`.
- `comms reply --comms-dir --to-event-id --kind --body [--subject]
  [--event-id] [--now]` with auto-swap of `from`/`to` from the source
  event, subject-convention threading (`re: <source>`), no schema
  change.
- Input-time validation + parser-readback after write.
- Both auto-fill `from` via existing identity-from-env resolution.
- Output: `wrote directed message <event_id> to <path>`.

**Test-first cycle (locked in sidebar)**:

1. Integration test for `comms direct` round-trip through
   `readDirectedCommsMessages`.
2. Implement minimal writer/composer.
3. Add `comms reply` test using direct as fixture source.
4. Implement reply path.

**Acceptance**:

- Both subcommands ship in one atomic commit each (or one combined
  commit; implementer's call as long as TDD-as-design holds).
- Sidebar joint-decision survives implementation pass without
  re-opening locked questions.
- Reduces a coordination round-trip from ~60s authoring + 30s poll to
  ~1 CLI call + 30s poll.

**2026-05-12 implementation evidence**:

- Coastal Cresting Prow implemented `comms direct` and `comms reply` in the
  unified `pnpm agent-tools collaboration-state comms <action>` shape.
- Landed at `f88d0d67`.
- `direct` writes a parseable directed message from the current PDR-027
  identity to the supplied recipient identity.
- `reply` reads an existing directed message, requires the current identity to
  match the source recipient, swaps `from`/`to`, and defaults the subject to
  `re: <source subject>` without schema changes.
- Validation passed: focused collaboration-state tests, full agent-tools
  type-check, test, build, README markdownlint, and built CLI smoke for help,
  `direct`, `reply`, and reader compatibility.
- Normal pre-commit was blocked by unrelated dirty `codex-exec` work in the
  same checkout; the owner authorised `--no-verify` for the B-11 commit only.

**Routing**: claim area `agent-tools/src/**`. Implemented by Coastal Cresting
Prow / `codex` / GPT-5 / `019e1b` on 2026-05-12.

**Deferred follow-ons (NOT in B-11, tracked here for visibility)**:

- F-obs-A.1 — identity lookup ergonomic. `comms direct` should accept
  `--to-agent-name <name>` alone and auto-resolve platform/model/prefix
  from `active-claims.json`. Warn-then-write if not registered. Slice
  follow-on after B-11 stabilises.
- F-obs-A.2 — bulk inbox-from-stdin reply. Pipe `comms inbox` to a
  bulk-replier for `coordination-ack`-style fanout.

---

### P2 — `comms watch` with fs.watch

**Hypothesis**: 30s poll cadence is too slow for dialogue and wasteful
for idle. Filesystem-event latency (sub-second with `fs.watch`) is the
right floor; polling is the right fallback for filesystems where watch
is unreliable.

**Evidence**: peer sidebar at 30s polls produced one productive design
exchange per minute — adequate, but the cost compounded across the four
agents in the broader window. Galactic's session-close findings
(directed comms-message
`198ee1a4-85d9-4313-af7a-bd3e2e49a9d3.json`, now under
`.agent/state/collaboration/comms/`): "the comms inbox
monitor command is useful but still rebuild-heavy because the package
script runs build before each poll."

**Design** (from sidebar Turn 2 + Turn 3):

- Node-native `fs.watch` + polling fallback. Do not introduce chokidar.
- Long-running CLI process; one line per new event to stdout; pipe to
  any consumer (Claude Code Monitor, Codex session log, etc.).
- Filter by recipient (agent_name + session_id_prefix tuple) or
  audience routing.
- Injected polling-interval / fake source for tests to avoid fragile
  fs timing.

**Acceptance**:

- Sub-second median latency from message write to consumer notification
  under fs.watch.
- Polling fallback exercised in test suite.
- Replaces the bash poll-loop pattern documented in
  `feedback_periodic_comms_check`.

**Routing**: same claim area as P1; sits next to or inside
`cli-comms-inbox.ts`.

**2026-05-12 evidence**:

- P2 landed in the unified CLI shape:
  `pnpm agent-tools collaboration-state comms watch`.
- The watcher emits directed messages through a streaming stdout path while
  the process stays alive. `--max-events` is a test/control affordance for
  bounded proof runs, not a separate legacy mode.
- Recipient filtering supports `--agent-name` plus optional
  `--session-prefix` so long-lived watchers can narrow to an identity tuple.
- The implementation uses Node `fs.watch` with polling fallback; watcher
  setup errors such as `EMFILE` degrade to polling rather than crashing.
- Focused evidence: collaboration-state watch integration test proves a
  message written after the command starts is emitted and marked seen; full
  agent-tools `type-check`, `test`, `build`, and `lint` completed. Lint
  still reports the pre-existing `no-real-io-in-tests` warning in the
  collaboration-state integration test file and exits 0.

**Routing**: implemented by Penumbral Veiling Raven / `codex` / GPT-5 /
`019e1c` on 2026-05-12.

---

### P3 — Enforced commit queue

**Hypothesis**: the commit queue is currently advisory. Anything that
can be skipped will be skipped under pressure. Sparking Charring Ash
skipped it on 2026-05-11 ("queue-list-only read, not active-claims
read"; "`git add` before enqueue") and immediately hit the predicted
collision (`.git/index.lock`). The fix is structural enforcement.

**Evidence**: Sparking Charring Ash napkin entry 2026-05-11; the
`feedback_no_lock_wait_loops` memory referenced "Owner-flagged future
option: 'committing claims' in the shared log" — this is that work.
Owner note after the 2026-05-12 B-11/codex-helper window: another
agent completely ignored the commit and claims protocols, including
the commit queue, which is further evidence that commit hygiene needs
mechanical enforcement rather than advisory documentation alone.

**Concrete shape**:

- A commit-queue CLI guard invoked before any `git add` (Git/Husky
  have no native `pre-stage` hook; enforcement lives in the
  agent-tools CLI wrapping `git add`, or in a documented precondition
  check that the `jc-commit` skill runs before staging). The guard
  reads `active-claims.json`, finds an active `git:index/head` claim
  belonging to the current identity matching the staged file set; if
  none, refuses with a clear error naming the queue-enqueue command.
- Skill `jc-commit` updates to ensure the enqueue step runs before any
  `git add` invocation. Already documented; needs enforcement teeth.
- Friction F-08 and F-11 referenced in the existing primary plan are
  related; ensure their workstreams compose with this enforcement.

**Acceptance**:

- Regression test: an agent that tries to `git add` without an open
  intent fails with the expected error.
- An agent with an open intent matching the stage proceeds normally.
- Concurrent stage attempts by two agents claim-collide on the
  registry, not on `.git/index.lock`.

**2026-05-12 evidence**:

- `pnpm agent-tools commit-queue guard` now validates requested stage paths
  before `git add`: the current identity must have a fresh active
  commit-queue intent covering every requested file, the intent must point to
  a live claim owned by the same identity, and that claim must cover
  `git:index/head`.
- The guard refuses missing intents, stale or missing claims, non-git claims,
  and fresh queue entries ahead of the selected intent with operator-facing
  errors. Successful validation prints the matching `intent_id` for the
  subsequent stage/record flow.
- `jc-commit` now runs the guard between moving the intent to `staging` and
  invoking `git add -- <pathspecs>`.
- Focused validation: `pnpm --filter @oaknational/agent-tools exec vitest run
  tests/commit-queue.unit.test.ts tests/commit-queue.integration.test.ts`,
  `pnpm --filter @oaknational/agent-tools type-check`, and
  `pnpm --filter @oaknational/agent-tools lint`. Lint exits 0 while preserving
  the pre-existing `no-real-io-in-tests` warning in the collaboration-state
  integration test file.

**Routing**: hook + agent-tools CLI; touches the same area as P0 and
shares review surface.

---

### P4 — Identity disambiguation

**Hypothesis**: the current `(agent_name)`-based routing reproduces
"two-people-named-John" failures. The session demonstrated this
directly: two "Wooded Spreading Thicket" sessions co-existed (one
claude-code, one cursor monitor), and the comms-log filtering
collapsed.

**Evidence**: shared-comms-log entries from 2026-05-11T20:06–20:15Z
where a cursor-Wooded telemetry process and the claude-code Wooded
coordinator both wrote under the same `agent_name`. Identity-routing
fragility.
Owner note after the 2026-05-12 B-11/codex-helper window: there is
still confusion about which agents are active or not. The desired
improvement is not yet fully specified, but active-agent functionality
and visibility need to improve rather than relying on agents inferring
state from raw claims, comms, and process residue.

**Concrete shape**:

- All claim writes refuse if `(agent_name, platform, session_id_prefix)`
  matches a live claim by another identity tuple.
- All directed-message writes use the full tuple for `from` and `to`;
  reads can match on any subset but routing key is the tuple.
- Identity preflight (`identity preflight --platform <p> --model <m>`)
  must produce a unique tuple; collisions force a wordlist re-seed
  rather than reuse.
- Add an active-agent visibility surface that distinguishes at least
  active, stale, inactive/closed, and uncertain identities, with the
  evidence source for each classification. Treat uncertainty as a
  first-class output, not as an empty list.

**Acceptance**:

- Two sessions with the same name on different platforms can co-exist
  without comms-log filter collapse.
- A re-used `session_id_prefix` triggers a clear preflight error.
- A session can ask "who is active?" and get a readable answer that
  explains why each identity is considered active, stale, inactive,
  or uncertain.

**Routing**: `agent-tools/src/collaboration-state/identity*` files and
the wordlist resolver. Composes with F-13 (identity routing
expectations) from the existing primary plan.

**2026-05-12 evidence**:

- Claim writes, comms append/send, and directed-message direct/reply now guard
  writes against live `(agent_name, platform, session_id_prefix)` collisions
  with a different model identity.
- Directed-message reply routing and `claims mine` now use the routing tuple
  rather than model-sensitive full identity equality, so model-label drift does
  not hide an agent's own messages or claims.
- `claims active-agents` reports the routing key, evidence rows, collision
  status, and visibility status across active, stale, inactive, and uncertain
  identities. It can include closed-claim archive evidence when `--closed` is
  supplied.
- `identity preflight` accepts optional `--active` and refuses live routing
  tuple collisions before a write starts.
- Focused validation: `pnpm --filter @oaknational/agent-tools exec vitest run
  tests/collaboration-state/active-agents.unit.test.ts
  tests/collaboration-state/collaboration-state.unit.test.ts
  tests/collaboration-state/collaboration-state.integration.test.ts`,
  `pnpm --filter @oaknational/agent-tools type-check`,
  `pnpm --filter @oaknational/agent-tools lint`, and
  `pnpm --filter @oaknational/agent-tools build`, plus
  `pnpm markdownlint-check:root`. Lint exits 0 while preserving the
  pre-existing `no-real-io-in-tests` warning in the collaboration-state
  integration test file.
- Live smoke:
  `pnpm agent-tools:collaboration-state -- claims active-agents --active
  .agent/state/collaboration/active-claims.json --closed
  .agent/state/collaboration/closed-claims.archive.json --now
  2026-05-12T14:05:00Z` reported this Codex session as active and separated
  same-prefix peer graph-lane state by agent name. A later
  `identity preflight --active` smoke also succeeded for this session.

---

### P5 — Unified comms format

**Hypothesis**: three sibling directories (`comms-events/`,
`comms-lifecycle/`, `comms-messages/`) with three `$defs` (narrative,
lifecycle, directed) is duplicate structure. Each agent has to know
which directory for which event family; each parser consumes from three
locations; renderers handle three families. The B-10 compat shims that
landed at `0be469a9` patch the renderer-side compatibility surface; the
underlying duplication remains.

**Evidence**: owner-relayed direction via Flamebright 2026-05-11T20:05Z:
"ONE comms format used everywhere, no legacy lingering." Galactic's
directed comms-message
`198ee1a4-85d9-4313-af7a-bd3e2e49a9d3.json` (under
`.agent/state/collaboration/comms-messages/`) session-close finding
number 4: "in this shared working tree, any
new uncommitted coordination artefact after a clean gate sweep can
invalidate a peer commit. Gatekeeper specialisation alone is
insufficient without either commit isolation or a queue protocol that
freezes/absorbs post-sweep artefacts."

**Concrete shape**:

- One canonical schema with `kind` discriminant (narrative / lifecycle
  / directed); one directory; one parser surface.
- Migration: one-shot normaliser moves existing events into the unified
  location and shape. Deletes the B-10 tolerant-read shims as part of
  the migration cycle (architecture-expert-fred's standing condition
  from the B-10 review).
- Retire the three-`$defs` schema; replace with one schema and a
  discriminant.
- ADR or PDR records the consolidation decision and the deletion of
  the three-directory shape.

**Acceptance**:

- Single directory, single parser, single renderer path.
- All historical events readable through the new path post-migration.
- The B-10 compat helpers (`optionalNullableString`,
  `optionalStringOrLegacyAgentName`) deleted in the same migration
  commit.
- Renderer no longer sensitive to legacy optional-field shapes (the
  source data is normalised).

**Computed completion verdict — 2026-05-13**: P5 is complete. Evidence:

- The canonical directory is `.agent/state/collaboration/comms/`; the retired
  `comms-events/`, `comms-lifecycle/`, and `comms-messages/` directories are
  absent from the live state.
- `comms-event.schema.json`, the Zod boundary parser, renderer, CLI direct /
  reply / inbox / watch / render surfaces, TUI snapshot source, and
  practice-substrate live reader all consume the v2 `kind`-discriminated
  event shape.
- The migration normalised 918 historical JSON events into v2
  `schema_version: "2.0.0"` files under the unified directory; strict
  `collaboration-state -- check --active ... --closed ... --comms-dir ...`
  returned `ok`.
- B-10 tolerant-read helper names (`optionalNullableString`,
  `optionalStringOrLegacyAgentName`) are absent from the collaboration-state
  source and tests.
- Verification: red-first P5 tests observed before product code; final
  `@oaknational/agent-tools` test suite passed (41 files / 324 tests),
  `type-check` passed, `lint` exited 0 with two non-failing real-IO warnings in
  integration-style tests, `knip` passed, `git diff --check` passed, and
  `practice:substrate:check` returned `ok: true` with only informational
  historical-retired-path findings.

**Routing**: schema authority + parser + renderer + migration script.
Large slice; design phase needs its own peer sidebar before
implementation. Should NOT be attempted concurrently with active
multi-agent traffic — schedule for a single-agent window or a coordinated
pause. Owner-directed sequencing update on 2026-05-12: P8 collaboration TUI
follows immediately after P5 so the operator view can build on the unified
event shape before P6/P7 resume.

---

### P8 — Collaboration TUI

**Hypothesis**: tailing a rendered Markdown log is a debugging fallback,
not a human collaboration surface. Operators need one real-time view for
main comms, directed threads, and active-agent state. This is not optional:
if the collaboration tooling works, its value must be visible to a human in
the moment, not only inferred later from abstract throughput claims.

**Evidence**: owner note on 2026-05-12 that `tail -f
.agent/state/collaboration/shared-comms-log.md` appeared to interfere
with render visibility. Even if the root cause is file-descriptor
following versus atomic rewrite behaviour, the underlying need is a
dedicated viewer rather than a shell workaround.
Owner clarification on 2026-05-12: the live TUI is part of demonstrating
the value of the current work in a way that is more visible to humans than
"work with three agents happens 120% faster."

**Concrete shape**:

- Add a TUI that watches unified comms events, active claims, closed claims,
  and commit-queue state.
- Show a main-thread pane, direct-message thread panes, unread/seen state,
  and active-agent visibility using the P4 status classifications.
- Show human-visible live value signals: current collaborators, fresh versus
  stale ownership, message flow, directed-thread pressure, queue pressure, and
  recent changes since the last refresh. These are part of P8 acceptance, not
  a later dashboard polish pass.
- Avoid depending on `shared-comms-log.md` as the live source of truth; read
  event JSON and claim state directly, then render in memory.
- Preserve a non-interactive text mode for logs and CI diagnostics.

**Acceptance**:

- An operator can watch the main collaboration stream and direct-message
  threads in real time without `tail -f`.
- The viewer continues to update when the Markdown renderer rewrites or
  replaces `shared-comms-log.md`.
- Active, stale, inactive, and uncertain agents are visible in the same
  operator surface.
- The operator can see collaboration value live: who is active, what changed
  recently, what is waiting, and which directed threads need attention, without
  translating raw JSON or counting throughput after the fact.

**Routing**: builds on P2 watch, P4 active-agent visibility, and P5 unified
comms format. Owner-directed sequence update on 2026-05-12: run P5, then P8,
then return to P6/P7.

---

### P6 — Coordination-artefact isolation

**Hypothesis**: sidebars, canonical comms events, monitor
telemetry, and napkin updates live in the same tree as code. Every
write to them mutates the gatekeeper's tree-state and can trip a gate.
A coordinator necessarily writes coordination artefacts; therefore the
coordinator is necessarily a tree-state polluter under the current
shape.

**Evidence**: iteration 3 of the 2026-05-11 deadlock was triggered by
**my own** sidebar file failing markdownlint. The defect was authored
by the coordinator role itself.

**Concrete shape** (options to design under P5's umbrella or as its own
slice):

- (a) Separate branch / worktree for coordination artefacts. Comms,
  sidebars, monitor telemetry, claims state all live on a coordination
  branch that doesn't share gates with feature work.
- (b) Gitignore the coordination directory tree; persist via a separate
  ledger (sqlite, JSONL append-only file, or external store).
- (c) Make the pre-commit gates blind to specific directories (e.g.,
  `prettier --check . --ignore-path .prettierignore-with-coord-dirs`).
- (d) Combination — gates blind in pre-commit, full check in CI nightly
  hygiene.

**Acceptance**:

- A coordinator writing 31+ artefacts in a session does not block any
  peer agent's commit.
- Coordination artefacts remain durable and readable.

**Routing**: depends on (a)–(d) choice; design sidebar required.

---

### P7 — Async/sync mode awareness

**Hypothesis**: design work needs sub-second latency; execution work
tolerates minute-scale polls; monitoring tolerates hour-scale. Currently
every channel is fixed-cadence regardless of work shape.

**Evidence**: the productive sidebar at 30s polls was constrained;
background monitors at 30s polls were noisy. The right cadence is
work-shape-dependent.

**Concrete shape**:

- `comms watch` (P2) supports `--mode design|execution|monitor` with
  appropriate cadence defaults.
- Inbox shape: directed messages in `--mode design` poll sub-second;
  in `--mode monitor` poll every 5–30 minutes.
- Eventual: protocol-level mode hint on directed messages so receiver
  knows expected response cadence.

**Acceptance**:

- Sidebar-shaped conversations at sub-second latency without coordinator
  manual cadence selection.
- Monitor processes contribute negligible telemetry volume.

**Routing**: builds on P2; should not land before P2 stabilises.

### Subsumed-residual workstreams (from primary plan)

These are the not-yet-landed workstreams from the prior
[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
that this plan absorbs. Status updates and acceptance criteria already
documented there; this section is a routing cross-reference only.

Supersession mapping (per `consolidate-docs § Plan supersession
discipline`): each prior `todos:` id from
[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
mapped verbatim to its new owner P-workstream and acceptance lane.

| Prior id (verbatim) | New owner | Acceptance lane | Rationale |
| --- | --- | --- | --- |
| `collaboration-read-apis` | P1 (write-side) + already-landed read | P1 acceptance + commit `0be469a9` for read-side in HEAD | Read-side landed implicitly in Galactic's B-10 commit; write-side is value-bearing remainder. |
| `comms-render-resilience` | P5 | P5 acceptance | F-05's malformed-file contract is structurally subsumed by the unified-format migration that removes legacy shapes. |
| `commit-queue-safety` | P3 + F-15 already landed at `70e746a3` | P3 acceptance | Residual is exactly P3's enforcement scope (refuse `git add` without active intent). |
| `identity-build-isolation` | P4 | P4 acceptance | Build-isolation (F-08) and routing (F-13) unify under identity-tuple correctness. |
| `register-closeout` | All P-workstreams (closeout-per-slice) | Each P-workstream's own closeout step | Operational, not a slice — runs at end of every slice. |
| `shared-cli-discoverability` (completed) | Already landed in working tree | n/a | Closed before this plan; listed for verbatim completeness. |

Cross-cutting friction-IDs explicitly routed: **F-05** → P5; **F-06,
F-07, F-10** → P1 write-side; **F-08** → P4; **F-13** → P4; **F-15**
→ already landed at `70e746a3`; **F-16** → routed to
[`skills-standardisation-and-adapter-generator.plan.md`](skills-standardisation-and-adapter-generator.plan.md)
per the prior plan's own routing line; **B-02, B-03** → P3 enforcement
work.

No verbatim id is dropped without a destination; no destination is
named without an acceptance lane.

## Sequencing

Strict P-order. P0 is the load-bearing prerequisite. Do not start any
P1+ workstream as part of a multi-agent window until P0 lands.

Single-agent windows can implement P1 (B-11), P2, and P5 design phase
in parallel with P0 if claim areas don't overlap. The implementing
agent must declare the work as "single-agent-window only" in their
opening commitment and refuse co-active multi-agent collaboration until
P0 lands.

## Validation

Each workstream defines its own acceptance. The plan-level validation:

- After P0 lands, repeat the 2026-05-11 multi-writer scenario with two
  agents (no need for four): one with unstaged coordination artefacts,
  one with a staged-clean commit. Commit succeeds.
- After P1 lands, a coordination round-trip drops from 4-tool-call
  hand-authored JSON to 1 CLI call.
- After P3 lands, an agent skipping the queue at `git add` time fails
  with a clear error citing the queue command.
- After P5 lands, the three comms directories are gone; the renderer
  no longer carries compat shims.

## Owner-direction status

- "lowering the cost of collaboration will increase the rate of
  innovation and advancement" — **standing**.
- "everything has ground to a halt, because everyone ends up waiting
  for everyone" — **standing for the 2026-05-11 architectural reset**;
  block multi-agent windows on P0.
- "ONE comms format used everywhere, no legacy lingering" — **standing**;
  P5 carries this.
- "the intense partner sidebar is going a lot better than the
  coordinator and helpers topology" — **standing observation**;
  reflected in the structural insights and in the
  [`peer-sidebar-beats-coordinator-helpers`](../../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_peer_sidebar_beats_coordinator_helpers.md)
  feedback memory.
- "any genuinely useful improvements to the agent tools CLI should be
  noted for implementation" — **standing**; comms-event `37ea0341`
  captures the F-obs observations.

## Pointer to prior plan

[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
is **subsumed by this plan** as of 2026-05-11. Its completed
workstreams remain landed in working tree; its remaining workstreams are
cross-referenced under "Subsumed-residual workstreams" above. The prior
plan should be archived to `archive/` after this plan's first review
pass; until then it is retained as a back-pointer for any agent reading
older napkin/comms references.

## Pointer to design artefact

The locked B-11 design lives in
[`.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`](../../../state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md).
Treat the joint-decision section at the foot of that file as P1's
binding scope until implementation lands.

## Exploration candidates (not yet workstreams)

These are owner-flagged ideas to explore. They are not yet
decision-complete and do not have acceptance criteria — they need a
short scoping pass (a peer sidebar, a feasibility note, or a single-
agent investigation slice) before promotion to a P-workstream.

- **E-1 — Advisory-only agent hooks that remind to use agent-tools
  systems.** Captured by owner 2026-05-12. The idea: lightweight,
  non-blocking hooks (e.g. SessionStart, pre-edit, periodic
  heartbeat) that detect when an agent is about to bypass an
  established agent-tools system (e.g. hand-authored JSON instead of
  `comms direct`, `git add` without an open commit-queue intent,
  ad-hoc file watch instead of `comms watch`) and surface a polite
  reminder pointing at the canonical tool. Advisory only — the
  reminder does not block; the agent decides whether to course-
  correct. Composes with the enforcement-not-exhortation lesson from
  Sparking Charring Ash 2026-05-11: the hook itself is advisory, but
  it removes the "I didn't know the tool existed" failure mode that
  exhortation alone cannot. Open scoping questions: which detection
  signals are reliable? Which tool surfaces deserve a reminder hook?
  How do we keep these from being a hook-noise source that gets
  filtered out? Scope candidate: peer sidebar with one engineer
  before authoring; size estimate M.

- **E-2 — `agent-tools git` CLI passthrough with checks and
  balances.** Captured by owner 2026-05-12. **Depends on
  P-Foundation**: without a unified CLI surface, `agent-tools git`
  has nowhere to live as a subcommand. The idea: a new
  agent-tools CLI subcommand `agent-tools git <subcommand>` that
  passes through to system `git` for the underlying operation but
  layers additional checks and balances on top — e.g. commit-queue
  enforcement on `git add` (P3-shaped), automatic comms-event
  posting on `git commit` (so peers see new commits without polling
  the log themselves), claim-aware `git push` (refuses to push if
  a peer's `git:index/head` claim is still open), proof-of-
  observed-behaviour gate on `git push` (the `local-broken-code-
  never-leaves` rule made structurally hard to bypass). The CLI
  shape lets us add discipline without forking the underlying tool
  and without inventing a new vocabulary for everyday operations.
  Composes with: P3 (commit queue enforcement), P1/P2 (comms write
  - watch), `local-broken-code-never-leaves` rule, E-1 (the reminder
  hook can route agents to `agent-tools git` rather than raw `git`).
  Open scoping questions: which `git` subcommands need wrapping?
  Where does the passthrough draw the line between additive checks
  and behaviour change? How do we handle interactive git commands
  (rebase, mergetool) where passthrough is harder? Scope candidate:
  peer sidebar; size estimate L.

E-1 and E-2 likely **compose into a single workstream** if both
prove worth doing — E-2 is the host surface for the checks, E-1 is
the advisory layer that detects when an agent is about to bypass
E-2. Scoping pass should evaluate them together.
