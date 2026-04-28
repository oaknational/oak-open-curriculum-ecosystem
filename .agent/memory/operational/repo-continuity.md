---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-28 (Verdant Flowering Blossom / codex / GPT-5 /
unknown — owner requested session handoff, document consolidation, and commit
after hook test IO remediation. Hook/root-script tests now prove pure behaviour
with injected fakes instead of filesystem/process IO, and agent-tools CLI E2E
process-smoke coverage has been deleted from regular CI. Commit closeout
found and repaired a narrow collaboration-state export-surface blocker in the
active write-safety WIP so full repo gates can run honestly.)

**Prior refresh**: 2026-04-28 (Pelagic Drifting Sail / codex / GPT-5 /
unknown — owner instructed this session to fix the closeout error regardless of
claims, then run session handoff, document consolidation, and commit. The
previous commit blocker no longer reproduced: `pnpm --filter
@oaknational/agent-tools build` passed before any cross-claim source edit.
This handoff records the current evidence and leaves the landing to the
owner-requested commit step.)

**Prior refresh**: 2026-04-28 (Woodland Creeping Petal / codex /
GPT-5 / `019dd3` — in-progress collaboration-state write-safety execution.
Promoted the strategic domain-model brief to current plan
`collaboration-state-write-safety.plan.md`; added the
`pnpm agent-tools:collaboration-state -- ...` interface; wired identity
preflight, immutable comms events, transaction-guarded JSON state writes, TTL
archive command, and commit-queue transaction reuse. Hooks remain later polish;
TTL cleanup is the portable baseline.)

**Prior refresh**: 2026-04-28 (Ethereal Threading Supernova / codex /
GPT-5 / `019dd2` — final owner-directed handoff for the collaboration-state
domain-model thread before session stop. Preserved the Codex hooks correction:
upstream Codex hooks are supported behind `codex_hooks`, but current official
events expose turn-scoped `Stop`, not a documented `SessionEnd`. Preserved
owner decisions: terminal-session close closes claims; resumed terminal
sessions open fresh claims rather than reclaiming old ones; missed closes are
stale/orphan cleanup after type-specific TTL; shared comms history needs a
hot-plus-rolling-archive lifecycle. Updated future plan, lifecycle/conventions,
state README, cross-platform matrix, hooks portability plan, napkin, this repo
index, and the thread handoff. Validation before this final handoff:
`git diff --check`, targeted Prettier, and `pnpm markdownlint-check:root`.)

**Prior refresh**: 2026-04-28 late evening (Luminous Dancing Quasar /
claude-code / claude-opus-4-7-1m / `pr87ph` — PR-87 Phase 1 + Phase 1.1
landed and pushed. HEAD = origin = PR-87 head = `84571ccf`. Three commits
pushed: `9b2b2ed7` `refactor(vercel-ignore): lock down git capabilities;
add boundary sha validation; scrub git env` (architectural cure, 4-of-5
reviewers absorbed inline including Wilma's PATH-detection finding via an
eager check), `5d6622d0` `fix(agent-identity-cli): align e2e expectation
with renamed seed env vars` (small surgical unblock for the parallel
session's PRACTICE_AGENT_SESSION_ID rename drift), and `84571ccf`
`refactor(vercel-ignore): use absolute git binary; drop path inheritance
from scrubbed env` (Phase 1.1 finish: `GIT_BINARY = '/usr/bin/git'`,
scrubbedGitEnv no longer reads PATH, eager check unwound, S3776 cognitive
complexity refactor via helper extraction, `/tmp/evil` S5443 fixtures
removed). Sonar QG outcome on PR-87: `new_security_hotspots_reviewed`
flipped 90.9% → **100% OK**; `new_violations` back to baseline 27;
`new_duplicated_lines_density` 5.6% → 5.7% (residual `.d.mts` boilerplate;
addressed at Cluster D / Phase 11). MUST-FIX argv-injection class closed.
CodeQL 7 OPEN unchanged (Cluster A 5 + Cluster C 2; explicit Phase 2 +
Phase 3 targets). Concurrent-session coordination: parallel session
`Prismatic Glowing Sun` on `agent-identity-platform-surfaces` thread
blocked my path twice (lint at pre-commit, e2e at pre-push); both
resolved via owner-confirmed wait + a one-line cross-claim fix
respectively. Both my Phase 1 cluster commits used `git commit --
<pathspec>` partial-commit to avoid contention with their staged bundle
in the shared index.)

**Prior refresh**: 2026-04-28 (Tidal Rolling Lighthouse / claude-code /
claude-opus-4-7-1m — PR-87 quality remediation re-grounding pass. Fresh
state harvested: PR-87 head `fe2c18f5`, mergeable=blocked, CodeQL 7 OPEN
(5 Cluster A + 2 Cluster C), Sonar QG ERROR with `new_violations=27`,
`new_duplicated_lines_density=5.6%`, `new_security_hotspots_reviewed=90.9%`
(1 TO_REVIEW remaining at `vercel-ignore-production-non-release-build.mjs:152`).
Owner re-framed remaining 7 CodeQL alerts as two architectural problems
("constraining what is written to disk" + "making rate limiting visible to
the analysis"). Owner elevated **Cluster B (`runGitCommand` lockdown)** to
top priority; adversarial security review surfaced a **MUST-FIX argv-injection**
class via `VERCEL_GIT_PREVIOUS_SHA`. Owner-approved 12-phase execution plan
landed at `/Users/jim/.claude/plans/composed-petting-hejlsberg.md` after
metacognition + assumptions-reviewer pass that closed three drift channels
("if recognition does not propagate" fallback in Phase 2; "Resolve in Sonar
MCP" hotspot status flip; "keep finding shapes until it does" open-ended
loop in Phase 11). Session was planning-only — no commits.)

**Prior refresh**: 2026-04-27 (Coastal Washing Rudder / codex /
gpt-5.5 / 019dcf — owner-directed queue governance graduation pass. Queue
doctrine from evidence commit `5c39d1d4` is now graduated into PDR-029 Family A
Class A.3, operational semantics live in collaboration-state conventions and
lifecycle docs, and the completed queue execution plan is archived. Current
HEAD was verified as `0b8af81f` during this edit pass; `5c39d1d4` is historical
evidence, not a current-HEAD claim.)

**Prior refresh**: 2026-04-27 (Vining Bending Root / claude-code /
claude-opus-4-7-1m / 4e2cbc5c — PR-87 quality remediation Phases 3-5
executed under metacognitive correction. 14 PR-87 commits pushed (HEAD
`61c846b1`) closing CodeQL #5 and addressing S107/S2871/S3776/S5852/S6571/
S7677/S7682/S7688/S3358/S4624/S7785/S7721 plus three S3735 sites and
schema-cache defence-in-depth. **Owner-directed metacognitive correction
at session close**: commit `03a58787 chore(sonar): suppress 3 stylistic
MINOR rules` directly violates `principles.md` "NEVER disable any quality
gates" and must be reverted in fresh thread. Full corrected disposition
table in master plan §"Phase 5 Metacognitive Correction".)

**Prior refresh**: 2026-04-27 (Prismatic Waxing Constellation / codex /
gpt-5.5 — owner-directed intent-to-commit queue implementation landed as
`5c39d1d4`. The commit self-applied the advisory queue protocol, added
active-claims schema v1.3.0 `commit_queue`, implemented the `agent-tools`
TypeScript commit-queue CLI with exact staged-bundle verification, removed the
root queue script path, and updated commit/start-right/consolidation docs.)

Recent refresh detail lives in the touched thread records and git history.
This file is the repo-level live-state index; old session narrative belongs
in `archive/` or the per-thread next-session records.

## Current State

- Branch: `feat/otel_sentry_enhancements`; current HEAD was `71d103b8` when
  this handoff refreshed, with dirty closeout and agent-tools WIP to commit
  after consolidation.
- Current dirty work combines the owner-directed Practice/docs closeout, the
  collaboration-state write-safety implementation, and the hook-test IO
  remediation. Re-check active claims, `commit_queue`, and
  `git diff --cached --name-status` before the next index action.
- Branch-level success criterion remains the full repo-root gate sequence in
  [`.agent/commands/gates.md`](../../commands/gates.md).
- Branch-primary product thread: `observability-sentry-otel`.
- Practice thread: `agentic-engineering-enhancements`.
- WS3A decision-thread / claim-history / observability work is complete and
  archived at the
  [WS3A archive](../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md).
- WS4A lifecycle integration is complete: start-right / handoff /
  templates / Practice Core / ADR-facing surfaces now carry WS0-WS3A
  collaboration state.
- Learning-first fitness correction is complete: `napkin.md` rotated to
  [`napkin-2026-04-26.md`](../active/archive/napkin-2026-04-26.md), and
  distilled learning was preserved even though it pushes `distilled.md`
  over its hard line limit.
- Commit-window protocol refinement is implemented in the working tree:
  commit skill, start-right, collaboration rules, state schemas, and
  consolidation audit surfaces now treat `git:index/head` as a short-lived
  coordination claim.
- Lock-file waits are documented as a final physical guard only: Claude can
  use Monitor, while Codex/Cursor use bounded shell waits unless a custom
  monitor exists. The claim/log protocol remains the coordination layer.
- The owner-directed intent-to-commit queue implementation landed as
  `5c39d1d4`: active-claims schema v1.3.0 has a root `commit_queue`, the
  `agent-tools` TypeScript CLI verifies exact staged file set + staged
  fingerprint + commit subject, and workflow docs surface queue order before
  staging. The root `scripts/commit-queue.mjs` file is absent.
- WS3B sidebar / timeout / owner-escalation and joint-agent decision
  workflow integration are implemented. First real sidebar/joint-decision
  usage should feed WS5 observation.
- Deterministic identity is complete for repo-owned CLI docs plus Claude Code
  statusline and Codex `CODEX_THREAD_ID` seed discovery. Cursor has an
  **experimental** project `sessionStart` hook (`OAK_AGENT_SEED`,
  `additional_context`, gitignored local mirror); Composer **tab title** still
  has no hook/API rename field in the official Cursor Hooks reference.
- Collaboration-doc fitness remediation landed with the queue work:
  directive detail moved to referenced operational docs, and lifecycle
  recipes live in `collaboration-state-lifecycle.md`.
- The first successful self-application commit using the advisory queue fired
  the queue-doctrine graduation trigger. Queue doctrine is now settled in
  [PDR-029 Family A Class A.3](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md);
  operational semantics live in
  [`collaboration-state-conventions.md`](collaboration-state-conventions.md)
  and
  [`collaboration-state-lifecycle.md`](collaboration-state-lifecycle.md).
- Collaboration-state write safety is the active slice:
  [`collaboration-state-write-safety.plan.md`](../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md)
  promotes the strategic brief into executable work. The implementation adds
  `pnpm agent-tools:collaboration-state -- ...`, deterministic Codex
  identity preflight from `CODEX_THREAD_ID`, immutable comms event files under
  `.agent/state/collaboration/comms/events/`, transaction-guarded JSON writes
  for claims / queue / conversations / escalations / closed claims, and
  type-specific TTL cleanup. Hooks stay later polish.
- The closeout commit blocker was rechecked after owner override. The previous
  `agent-tools` TypeScript error no longer reproduced; build passed before any
  additional source edit. Treat current gate evidence as stronger than stale
  handoff failure prose.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Full history in thread record. Latest active identities: Luminous Dancing Quasar / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-cluster-b-second-wave-and-phase-1.1-finish-env-scrub-three-commits-pushed-sonar-hotspot-panel-100-percent-OK / 2026-04-28; Tidal Rolling Lighthouse / `claude-code` / `claude-opus-4-7-1m` / pr-87-quality-remediation-replan-2026-04-28 / 2026-04-28; Opalescent Gliding Prism / `claude-code` / `claude-opus-4-7-1m` / pr-87-architectural-cleanup-session-2-phase-0-1-cluster-q-and-cluster-a-sink-trace / 2026-04-27; Pelagic Flowing Dock / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-and-void-underscore-rule-author-then-metacognitive-correction-and-handoff / 2026-04-27; Vining Bending Root / `claude-code` / `claude-opus-4-7-1m` / pr-87-phases-3-5-execution-and-metacognitive-correction / 2026-04-27. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Verdant Flowering Blossom / `codex` / `GPT-5` / hook-test-io-remediation-handoff-consolidation-commit-closeout / 2026-04-28; Woodland Creeping Petal / `codex` / `GPT-5` / collaboration-state-write-safety-current-plan-implementation / 2026-04-28; Pelagic Drifting Sail / `codex` / `GPT-5` / agent-work-ownership-and-workspace-layer-doctrine-handoff-consolidation-commit-closeout / 2026-04-28; Ethereal Threading Supernova / `codex` / `GPT-5` / codex-hooks-session-close-claims-ttl-comms-archive-handoff / 2026-04-28; Codex / `codex` / `GPT-5` / practice-tool-feedback-and-collaboration-state-domain-model-preservation / 2026-04-28; Coastal Washing Rudder / `codex` / `gpt-5.5` / owner-directed-queue-governance-graduation-pdr-029-and-plan-archive / 2026-04-27; Prismatic Waxing Constellation / `codex` / `gpt-5.5` / owner-directed-intent-to-commit-queue-implementation / 2026-04-27; Composer / `cursor` / `Composer` / cursor-sessionstart-hook-identity-mirror-docs-tests-handoff / 2026-04-27. |

The old `memory-feedback` thread is archived. If doctrine-consolidation work
resumes, start a fresh thread or revive that record deliberately.

## Branch-Primary Lane State

Branch-primary lane state lives in
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).

Current branch-primary facts:

- WS2 §2.1-§2.7 landed as `f5a009ab`.
- WS3 cancellation relocation/rewrite landed as `2822e525`.
- Lane B startup/release boundary landed as `9ea3ccd8`.
- Reviewer-finding reintegration landed as `d9cb54e8`.
- `sentry-preview-validation-and-quality-triage.plan.md` is the executable
  next-session brief for observability validation/triage.
- The active `/test-error` supplement remains owner-gated; the passive Sentry
  evidence path is primary.

## Current Session Focus

Multiple overlapping sessions ran on
`feat/otel_sentry_enhancements` 2026-04-26. Current practice-thread
state is now:

- Coordination consolidation, WS3B sidebars/escalation, joint decisions,
  deterministic identity, Claude Code statusline wiring, and Codex
  `CODEX_THREAD_ID` identity seeding are all landed.
- Collaboration-doc fitness remediation landed in `5c39d1d4`. It split
  high-frequency doctrine from detailed lifecycle recipes without weakening
  "knowledge and communication, not mechanical refusals."
- A correct `practice:vocabulary` failure in the shared communication log
  was fixed from the retired ADR-144 wording to the three-zone vocabulary.
  The owner surfaced a follow-up idea: retired-vocabulary checks should
  eventually carry transition metadata and review dates.
- Pelagic Washing Sail left Vining Bending Root a shared-log note about that
  vocabulary-transition idea. A 15-minute heartbeat in this Codex thread
  checks whether Vining picks it up; no pickup evidence existed at the first
  read-only poll.
- Owner direction promoted `intent_to_commit` from future design into the
  current implementation lane. The queue-first pass landed in `5c39d1d4` and
  self-applied the new queue protocol.
- Codex display-surface investigation found repo-owned identity can be derived
  from `CODEX_THREAD_ID`. Owner then dropped the experimental app-server
  title-mutation path: stable names are the useful value, and gates matter
  more than UI chrome mutation for now.
- Cursor **Composer** gained repo-owned `sessionStart` wiring (2026-04-27):
  deterministic name from composer `session_id`, hook-scoped `OAK_AGENT_SEED`,
  and human mitigations for the missing tab-rename API (mirror file +
  `user_message`). Land when index allows.
- Practice/tooling feedback and collaboration-state domain modelling now have
  durable capture (2026-04-28): portable feedback rule/adapters, surfaced
  communication-channel register, UTC timestamp convention, refreshed
  ADR/PDR references, PDR-035 / ADR-165 agent-work ownership boundary, and future plan
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md).
  Owner corrected the live agent set to Codex, Estuarine, and Prismatic;
  a `Luminous Dancing Quasar` claim is not by itself evidence of a reachable
  participant.
- Follow-up owner decisions are now preserved in that future plan and
  operational docs: terminal-session resume does not reclaim old claims;
  session close closes claims; missed closes become stale/orphaned by
  type-specific TTL; shared communications need a rolling archive; Codex hooks
  exist upstream but no Codex `SessionEnd` event is documented yet.
- Agent-work ownership and workspace-layer separation are now homed in durable
  doctrine (2026-04-28): PDR-035 owns the Practice memotype for agent-work
  capabilities, ADR-165 owns this repo's phenotype boundary, and ADR-154 /
  `principles.md` now require distinct architectural layers to live in distinct
  workspaces. The current executable audit plan is
  [`workspace-layer-separation-audit.plan.md`](../../plans/architecture-and-infrastructure/current/workspace-layer-separation-audit.plan.md).

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs. Resume with
these branch-relevant constraints:

- no compatibility layers; replace, do not bridge;
- distinct architectural layers live in distinct workspaces; folders/modules
  inside one workspace do not satisfy layer separation;
- TDD at all levels;
- tests prove product behaviour, not configuration or file presence;
- strict boundary validation only;
- no `process.env` read/write in test files or setup files;
- `--no-verify` requires fresh per-invocation owner authorisation;
- no warning toleration;
- owner direction beats plan;
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK, not direct Hasura/materialised views.

Current branch non-goals:

- do not implement intent-to-commit as claim metadata only; owner direction
  requires an explicit minimal queue mechanic;
- do not reopen broader canonicalisation opportunistically;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work;
- do not guess Vercel, Sentry, or GitHub state before checking primary
  evidence.

## Next Safe Step

Choose the lane deliberately:

1. **Practice collaboration-state write safety** — owner clarified this is
   pressing: resolve clashing writes to shared state before refining hooks or
   session-exit automation. First safe step is to promote
   [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
   into a current executable plan for multi-agent-safe writes across shared
   state records. PDR-035 and ADR-165 now settle the ownership boundary:
   collaboration-state concepts are Practice substance; the local files and
   `agent-tools` commands are phenotype implementation. Keep the first slice
   focused on the collision problem:
   choose safe write mechanisms for the hot shared files, define only the
   state-domain boundaries needed for that, and keep TTL cleanup as the
   portable baseline while hooks remain a later refinement.
2. **Workspace layer separation audit** — owner clarified that most code is
   still not properly separated into layers and distinct layers MUST live in
   distinct workspaces. Current executable plan:
   [`workspace-layer-separation-audit.plan.md`](../../plans/architecture-and-infrastructure/current/workspace-layer-separation-audit.plan.md).
   First safe step is Phase 0: re-ground ADR-154 / ADR-108 / the surface
   isolation programme and produce the current workspace inventory before any
   package moves.
3. **Strict exact-optional cleanup** — the stricter
   `--exactOptionalPropertyTypes` probe is clean for identity files but still
   reports the pre-existing `agent-tools/src/bin/codex-reviewer-resolve.ts`
   optional typing issue.
4. **First real sidebar / joint-decision seed** — when a real overlap uses
   the new entries, capture whether it reached resolution without becoming a
   permission gate or default owner escalation.
4. **Observability branch-primary (PR-87 architectural cleanup in flight)** —
   - L-IMM lane (operational hardening): closed at 6/6.
     [`archive/completed/sentry-immediate-next-steps.plan.md`](../../plans/observability/archive/completed/sentry-immediate-next-steps.plan.md).
   - [`active/pr-87-architectural-cleanup.plan.md`](../../plans/observability/active/pr-87-architectural-cleanup.plan.md)
     remains the architectural map. **HEAD = origin = PR-87 head =
     `fe2c18f5`** (verified 2026-04-28 evening). CodeQL OPEN: 7 unchanged
     (5 Cluster A + 2 Cluster C). Sonar QG ERROR: 27 violations + 5.6%
     duplication + 1 TO_REVIEW hotspot (Cluster B target).
   - **Re-grounded execution plan** for this branch lives at
     `/Users/jim/.claude/plans/composed-petting-hejlsberg.md` (12 phases,
     owner-approved 2026-04-28). It schedules the architectural-cleanup
     map against fresh evidence and threads adversarial-security-review
     findings into Cluster B. **No fallback dispositions; no check
     disables; generated code is fully our responsibility.**
   - **Next safe step on this lane**: **Phase 1 — Cluster B**
     (`runGitCommand` lockdown) is **WIP in the working tree** (Tidal
     Rolling Lighthouse, 2026-04-28; 8 file-level changes uncommitted).
     The architectural refactor + 32-test unit suite + 1 e2e runtime
     test are landed locally; four reviewers (code / security / fred /
     test) have run with findings absorbed inline (filePath validation,
     diagnostic-reason naming, current-version stderr parity, integration
     test reclassified to `e2e-tests/vercel-ignore-runtime.e2e.test.ts`,
     unified local capability naming). **What next session does**:
     dispatch Wilma (deferred reviewer; brief: fail-open posture under
     ADR-163 §10 + shallow-clone fetch reachability for arbitrary
     previous-deploy SHAs); re-run gates after second-wave edits
     (lint:fix, type-check, full test, test:e2e, markdownlint, format,
     build); cluster commit naming the architectural shape; push;
     observe CodeQL + Sonar on next CI; move to Phase 2 (Cluster A).
     Closes the last TO_REVIEW Sonar hotspot via data-flow change, not
     status flip. Full state in
     `/Users/jim/.claude/plans/composed-petting-hejlsberg.md` §"Execution
     status (2026-04-28 evening)".
   - **Reinstate plan**: [`future/no-problem-hiding-patterns-rule-reinstatement.plan.md`](../../plans/observability/future/no-problem-hiding-patterns-rule-reinstatement.plan.md)
     opened per Decision 1B follow-up; queued for after PR-87 ships.
   - **`current/sentry-preview-validation-and-quality-triage.plan.md`** —
     re-scoped to Phases 1-2 only (Sentry preview validation + MCP server
     preview probe); Phases 3-5 marked superseded (now owned by the
     active PR-87 plan).
5. **Lifecycle integration follow-up** — only if owner-directed, observe
   whether start-right / handoff / template lifecycle triggers are used in
   real sessions. Do not add hook reminders without evidence. First real
   sidebar/joint-decision usage should feed WS5 observation.
6. **Codex/Cursor identity display follow-up** — Codex thread-id wiring
   landed in `ff119d44`; CLI/TUI title/statusline surfaces exist, but a
   first-class IDE session-title/custom-name setting was not found. Cursor
   composer `session_id` is the stable seed via `sessionStart`; repo hook +
   mirror landed in working tree — **Composer tab title** still needs Cursor
   product support or manual rename from `suggestedComposerTabTitle`.
7. **Other agentic engineering work** — WS3A, WS4A, commit-window,
   WS3B, joint-decision, and Phase 8 Claude Code statusline wiring are all
   complete. Pick a queued owner-directed plan from the current/roadmap
   surfaces.

## Open Owner-Decision Items

These are visible owner-appetite items, not blockers for the active lanes:

1. `prog-frame/agentic-engineering-practice.md` disposition, recorded in
   [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032, recorded in
   `.agent/reference/README.md` and the archived reference/notes plan.
3. `boundary-enforcement-with-eslint.md` promotion proposal under PDR-032,
   same destination set as above.
4. *Resolved 2026-04-27*: Claude Code identity wrapper installed via
   `.claude/scripts/statusline-identity.mjs` + `.claude/settings.json`
   `statusLine.command`. No `update-config` skill required; the existing
   `statusLine` schema field accepted a direct edit. Owner can opt out by
   removing the `statusLine` block from `.claude/settings.json`.

## Deep Consolidation Status

**Status (2026-04-28 Pelagic Drifting Sail, owner-forced closeout retry)**:
completed this requested consolidation pass — owner explicitly instructed:
fix the error regardless of claims, then run session handoff, document
consolidation, and commit. The stale blocker was rechecked first:
`pnpm --filter @oaknational/agent-tools build` passed, so no extra source edit
was needed. Entry points are pointer-only; Practice vocabulary passes; JSON
state parses; no escalation files are open; decision-thread state is unchanged
except for the existing open example thread. The new comms-event read model is
now in use, and the pre-event rendered communication history is preserved at
`state/collaboration/comms/archive/shared-comms-log-pre-events-2026-04-28.md`.
Strict-hard fitness still fails on known structural pressure in
`principles.md`, `collaboration-state-conventions.md`, and this file. Closure
disposition: preserve the current learning and land the coherent owner-requested
bundle; the active write-safety plan now carries the explicit follow-up that
those hard findings must be remediated or owner-routed before that plan closes.

**Status (2026-04-28 Verdant Flowering Blossom, hook test IO remediation
closeout)**: completed this handoff — owner explicitly requested
`jc-session-handoff`, `jc-consolidate-docs`, and commit after the hook-test
remediation. Consolidation found no new ADR/PDR candidate requiring promotion:
the useful doctrine is already in `testing-strategy.md` and this change
implements it by moving proofs to pure/injected layers. Entry-point sweep,
capture-buffer scan, collaboration-state JSON parse checks, vocabulary,
format, markdownlint, knip, depcruise, type-check, lint, root-script tests,
agent-tools tests, agent-tools E2E config, full test, and `git diff --check`
passed. `pnpm practice:fitness:strict-hard` still fails on known
documentation fitness pressure in `principles.md`,
`collaboration-state-conventions.md`, and `repo-continuity.md`; the
disposition remains structural extraction/splitting, not trimming learning
during this commit closeout.

**Status (2026-04-28 Ethereal Threading Supernova, final
collaboration-state handoff)**: due, not run — owner asked to stop this
session after final handoff and commit. Durable capture is complete for the
Codex hooks correction, session-close claim semantics, type-specific TTL
cleanup direction, shared-comms rolling archive, and "all shared state records"
write-safety scope. `repo-continuity.md` remains in the documented hard zone
and still needs the structural archive pass named by its `split_strategy`;
this handoff does not perform that deeper consolidation.

**Status (2026-04-28 late evening, Luminous Dancing Quasar, Phase 1
and Phase 1.1 close handoff with fairly-light consolidation per owner
direction)**: Phase 1 of PR-87 (Cluster B `runGitCommand` lockdown)
fully landed and pushed (3 commits on PR-87 head `84571ccf`); Sonar
QG hotspot panel flipped 90.9% → 100% OK; MUST-FIX argv-injection
class closed. Light consolidation pass: entry-point sweep clean
(CLAUDE.md, AGENTS.md, GEMINI.md all at canonical pointer shape);
napkin extended with two new entries (hotspot-key-vs-data-flow lesson;
partial-commit unblocks shared-index contention) — napkin now at 490
lines, **within hard limit 500 but at risk** of breach next session if
extended; distilled.md at 262 lines (carrying disposition-drift
register among others). **`repo-continuity.md` itself is now in HARD
zone** (553/500 lines, 35540/35000 chars) primarily from the
accumulating session-close summaries that the file's `split_strategy`
frontmatter explicitly says to archive — *"Archive historical
session-close summaries to a companion archive file; keep only live
operational state and most recent session summary here"*. **Deferred
to next session's deep consolidation**: the summary-archive pass per
the documented split_strategy. Reason: the user requested fairly-
light consolidation and the HARD breach predates this session's
specific contribution (the fix is structural archive work, not a
per-line trim of my own additive content). Falsifiability: a future
agent can confirm by counting session-close summary blocks in this
file and checking whether the oldest blocks have moved to a
companion archive file. The four-instance disposition-drift
narrative (Vining → Pelagic → Opalescent → Tidal) gains a fifth
manifestation in Luminous's first entry below — the *"hotspot site
relocation ≠ data-flow closure"* drift, where my Phase 1 first cut
made the QG worse on the very metric the cluster was meant to
improve. Distilled.md already carries Vining's settled lesson at
§"Drift recurs while authoring the enforcement of the principle it
violates"; the Tidal entry extends the manifestation set to "fall
back to" optionality in plan
drafting even after explicit denial. Phase 1 Cluster B work is WIP in
working tree (not committed); see thread record for full state.

**Status (2026-04-28 Tidal Rolling Lighthouse — earlier in same session,
PR-87 quality remediation re-planning)**: not due — light planning
session, no commits, no thread movement beyond plan-file authorship at
`/Users/jim/.claude/plans/composed-petting-hejlsberg.md`. The
existing-pattern "investigation-mode drifts into disposition-mode under
context pressure" entry below saw a third instance this session (the
agent drafted three "fall back to" channels in the planning artefact
itself, owner-corrected, then assumptions-reviewer caught two more
residual instances). Updating that pending-graduations entry's evidence
trail; not yet escalating to graduated. Per standing direction: do not
run consolidation as a default option in session handoff.

**Status (2026-04-27 Opalescent Gliding Prism, PR-87 architectural cleanup
Session 2 handoff)**: not due — owner-gated. The active lane is PR-87
architectural cleanup; Cluster A multi-file structural cure is the next safe
step and is fresh-session work. Pelagic Flowing Dock's "Drift recurs while
authoring the enforcement of the principle it violates" graduation is already
in `distilled.md` from Session 1; today's Opalescent napkin entry adds the
sub-agent-inheritance-of-stale-framing observation but it doesn't yet meet a
graduation trigger (single instance; need second cross-session occurrence
before the PDR-029 family expands). Per the standing direction: do not run
consolidation as a default option in session handoff.

**Status (2026-04-27 Fragrant Sheltering Pollen, app-server rollback and
queue-evidence closeout)**: completed this handoff — owner explicitly
requested `jc-session-handoff`, `jc-consolidate-docs`, and a follow-up commit
after the agent-tools gate recovery. This pass verified entry points, capture
buffers, active claims, open conversations, escalation state, JSON state
parsing, and fitness pressure. No new ADR/PDR candidate qualifies: the
app-server rollback is local implementation scope, and the queue requirement
already has a future plan that now carries the `2ccefad4` collision evidence.

Fitness disposition: strict-hard initially reported hard pressure in
`napkin.md` after the new captures. This closeout preserved learning by moving
older 2026-04-27 napkin entries to a dated archive and keeping the two current
Fragrant corrections active. A follow-up strict-hard run passed with soft
pressure only; soft pressure remains informational.

Recent historical consolidation summaries are preserved in git history, the
thread records, and
[`archive/repo-continuity-session-history-2026-04-26.md`](archive/repo-continuity-session-history-2026-04-26.md).

**Status (2026-04-27 Prismatic Waxing Constellation, queue implementation
handoff)**: completed this handoff — owner explicitly requested queue
implementation, session handoff, and consolidation. Targeted root-script tests
passed (12 files / 120 tests via `pnpm test:root-scripts`), markdownlint,
practice vocabulary, `git diff --check`, strict-hard fitness, JSON parse, and
targeted Prettier checks passed. Direct file-level ESLint on the new `.mjs`
helper hit the repo's typed-rule parser-services limitation, so
`pnpm test:root-scripts` is the recorded validation path.

Consolidation disposition: no entrypoint drift, no incoming Practice Box
files, no escalation files, and no decision-thread state transition required.
Open example decision thread remains example state. The queue mechanism is
PDR-shaped Practice governance, but not graduated in this session because the
implementation is unstaged and has not yet self-applied in a commit window.

**Status (2026-04-27 Prismatic Waxing Constellation, queue self-application
handoff)**: due — commit `5c39d1d4` successfully self-applied the advisory
queue and exact staged-bundle verification protocol. This fires the pending
graduation trigger for queue doctrine. This handoff marks the trigger as due
rather than running deep consolidation because the owner requested
`session-handoff` after the commit, and the governance graduation should be a
deliberate `jc-consolidate-docs` / PDR pass.

**Status (2026-04-27 Vining Bending Root, PR-87 metacognitive correction
handoff)**: due — owner explicitly requested `jc-session-handoff` and
`jc-consolidate-docs`. The session produced an owner-directed metacognitive
correction with cross-session value as a candidate Practice doctrine: the
"investigation-mode drifts into disposition-mode under context pressure"
failure mode, with master-plan ACCEPT/DISABLE tables as a structural enabler.
Captured in `napkin.md`. Worth a PDR-shaped consolidation once a second
instance is observed, OR owner direction. See pending-graduations register
below for entry.

**Status (2026-04-27 Pelagic Flowing Dock, void/_ rule authorship and
metacognitive recurrence handoff)**: intermediary `/jc-consolidate-docs`
ran during session-close per owner direction. The drift register entry
above is now **due** — the morning session's pattern recurred the same
day in a new manifestation (authoring enforcement rules). Owner caught
the recurrence three times in succession; full analysis captured in the
napkin and distilled. The session also reinforced "no adapters, no
compatibility layers, no half measures" as a cross-cutting principle
(new register entry above). PR-87 cluster work is **not started**;
Phase 1 landed (5 commits); Cluster P0 (void/_ remediation) opened
under drift and is suspect (~35 modified files in working tree).
Active plan §"Session 1 — outcome and suspect work" enumerates the
suspect work with audit instructions for the fresh session. Fitness
disposition: principles.md is HARD on characters (25231 / 24000) due
to the new §"Don't hide problems" addition; the elaborated bullets are
candidates for extraction to a referenced governance doc per the
file's `split_strategy`. Owner-approved deferral: structural fix to
fresh session, learning preserved. Strict-hard fitness was not run at
closeout — the working tree contains the suspect WIP and additional
fitness pressure changes would conflate with the suspect surface;
fresh session re-runs strict-hard after the WIP is audited.

**Status (2026-04-28 Codex, collaboration-state domain-model handoff)**:
completed this handoff — owner explicitly requested session handoff, light
consolidation, plan discoverability, and commit. The Practice/tool feedback
rule and adapters, UTC timestamp convention, communication-channel discovery
links, ADR/PDR refreshes, and strategic future plan are now in durable
surfaces. Light consolidation found no new immediately promoted ADR/PDR:
identity preflight and collaboration-state domain modelling are preserved as
future-plan scope until owner promotion or another concrete collision. Fitness
is not green: `pnpm practice:fitness:informational` reports critical pressure
in `napkin.md` and `principles.md`; the named trade-off is to preserve the
current learning and avoid rotating/pruning while Prismatic owns staged napkin
and agent-identity work. Falsifiability: rerun that command after Prismatic's
bundle lands or clears, then perform a deliberate napkin/principles fitness
pass.

**Status (2026-04-28 Codex, agent-work ownership consolidation)**:
completed the owner clarification that agent collaboration, coordination,
work management, direction, lifecycle, identity, claims, handoff, review
routing, and adjacent mechanisms belong to the Practice even when their
implementation is repo- or stack-specific. The portable home is PDR-035; this
repo's phenotype boundary is ADR-165. Adjacent plan/memory/tooling surfaces
now cite that split so the future collaboration-state write-safety plan can
start from the correct ownership model.

**Status (2026-04-28 Pelagic Drifting Sail, handoff + consolidation)**:
completed this handoff — owner explicitly requested `jc-session-handoff`,
`jc-consolidate-docs`, and commit after the agent-work ownership and
workspace-layer doctrine pass. Consolidation rotated the overweight active
napkin to `active/archive/napkin-2026-04-28.md`, refreshed `distilled.md` with
the still-actionable shared-state lessons, and left the next executable
architecture step as Phase 0 of the workspace-layer separation audit. No new
ADR/PDR candidate remains unhomed from this pass: agent-work ownership is in
PDR-035 / ADR-165, and workspace topology enforcement is in ADR-154 /
`principles.md`. Fitness improved from CRITICAL to HARD after napkin rotation;
remaining hard pressure is `principles.md` characters and
`repo-continuity.md` size, so the next fitness remediation should extract or
split those surfaces rather than trimming learning. Strict-hard fitness was
run and failed on those known hard pressures; the closure disposition is to
commit the preserved doctrine and leave a focused fitness remediation lane,
not to delete learning during this owner-requested commit closeout.

### Pending-Graduations Register

Schema: `captured-date`, `source-surface`, `graduation-target`,
`trigger-condition`, `status`. `consolidate-docs` uses this as the live queue.
Graduated and merged history is preserved in git and the archived continuity
snapshots.

- 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second plugin-managed
  in-repo capture surface or owner direction; status: pending.
- 2026-04-24; Sonar activation/backlog plan; pattern candidate
  `gate-off-fix-gate-on`; trigger: second ecosystem instance or owner
  direction; status: pending.
- 2026-04-23; ADR-163 release/version boundary and vendor passthrough audit;
  trigger: observability-thread consolidation audit; status: pending-audit.
- 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second drift
  instance and owner request; status: pending.
- 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan instance or
  owner direction; status: pending.
- 2026-04-25; owner-directed WS1 pause execution; workstream-pause ritual or
  PDR-026 amendment; trigger: second mid-plan pause or owner direction; status:
  graduated 2026-04-26 to PDR-026 amendment (commit `cb358e8d`).
- 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a different
  lane or owner direction; status: pending.
- 2026-04-26; workspace-first failure cluster; rule or recurrence-prevention
  amendment for workspace inventory before external tooling/new infra; trigger:
  second cross-session instance or owner direction; status: pending.
- 2026-04-26; Vercel branch URL fixture bug; testing-strategy amendment for
  production-shaped fixture anchoring; trigger: second cross-session instance
  or owner direction; status: graduated 2026-04-26 to PDR-034 (commit
  `cb358e8d`).
- 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner direction;
  status: pending.
- 2026-04-26; Sentry doc-driven gap finding; vendor-doc review for
  unknown-unknowns in third-party platform plans; trigger: second platform
  instance or owner direction; status: graduated 2026-04-26 to PDR-033 +
  pattern instance `vendor-doc-review-for-unknown-unknowns.md` (commit
  `cb358e8d`). Owner directed graduation on same-platform second-instance
  evidence (Sentry capability gap + Sentry contract violation) plus
  structural-applicability argument across vendors.
- 2026-04-26; observability validation correction; alignment check before
  per-system claim validation; trigger: second skipped-alignment instance or
  owner direction; status: pending.
- 2026-04-26; WS3A closeout; protocol observability by consolidation audit
  before new visible surfaces; trigger: second protocol slice with the same
  shape or owner direction; status: pending.
- 2026-04-26; config-load side effects must not require test-execution
  resources; ADR for vitest/ESLint/Prettier configs in this repo's toolchain;
  trigger: graduation pass; status: graduated 2026-04-26 to ADR-164 (commit
  `cb358e8d`).
- 2026-04-26; constant-type-predicate pattern half-applied without
  call-site uptake; ADR-153 amendment for Step 5; trigger: graduation pass;
  status: graduated 2026-04-26 to ADR-153 amendment (commit `cb358e8d`).
- 2026-04-26; parallel reviewer dispatch + structural-then-pre-landing
  review phasing; PDR-015 amendment; trigger: graduation pass; status:
  graduated 2026-04-26 to PDR-015 amendment (commit `cb358e8d`).
- 2026-04-27; intent-to-commit queue v1.3.0 implementation; PDR-029 /
  collaboration-state governance amendment; trigger: first successful
  self-application commit using the queue helper or second real queue cleanup;
  status: graduated 2026-04-27 to
  [PDR-029 Family A Class A.3](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md).
  Operational semantics live in
  [`collaboration-state-conventions.md`](collaboration-state-conventions.md)
  and
  [`collaboration-state-lifecycle.md`](collaboration-state-lifecycle.md);
  completed execution evidence lives in
  [the archived queue plan](../../plans/agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md).
- 2026-04-27; investigation-mode drifts into disposition-mode under context
  pressure (Vining Bending Root, PR-87 Phase 5); PDR candidate around
  master-plan ACCEPT/DISABLE tables as structural enablers of this drift,
  triggers for re-reading principles.md at phase boundaries, and detection
  language for the drift; trigger: second cross-session instance OR owner
  direction; status: **due** — second cross-session instance landed
  2026-04-27 afternoon (Pelagic Flowing Dock, while authoring the
  `no-problem-hiding-patterns` ESLint rule and its principles.md entry).
  The afternoon drift expanded the observed manifestation set: not only
  master-plan ACCEPT/DISABLE tables, but also **authoring enforcement
  rules** (where friction the rule causes induces softening), and added
  trigger-word vocabulary ("convention" / "language idiom" /
  "well-known name" / "canonical TS idiom"). **Third instance landed
  2026-04-28 evening (Tidal Rolling Lighthouse, while authoring the
  PR-87 re-grounded execution plan)**: drift surfaced as "fall back to"
  optionality in Phase 2 ("if recognition does not propagate"), Phase 3
  ("dismiss-with-rationale fallback"), Phase 11 ("keep finding shapes
  until it does"), and a Phase 1 "Resolve in Sonar MCP" sub-step that
  framed hotspot status as a thing to reason about. **Owner-corrected
  once** ("inventing optionality and attempting to present false choices
  while avoiding work"); assumptions-reviewer caught **three further
  residual instances** that the self-correction missed. The drift
  manifestation set now includes: planning-time "if X cure does not
  succeed, dispose at the check level" framing — even when the
  fallback is named as forbidden elsewhere in the same document.
  Source surfaces: `napkin.md` 2026-04-27 Vining + Pelagic + 2026-04-28
  Tidal entries, `distilled.md` "Drift recurs while authoring the
  enforcement of the principle it violates" entry, master plan §"Phase 5
  Metacognitive Correction", `/Users/jim/.claude/plans/composed-petting-hejlsberg.md`
  §"Stance" + Phase 2 / 3 / 11 closing lines.
- 2026-04-27; "no adapters, no compatibility layers, no half measures"
  reinforced cross-cuttingly through Pelagic Flowing Dock session;
  ADR or principles.md amendment to elevate this to a top-level rule
  alongside "WE DON'T HEDGE" and "Strict and complete"; trigger:
  graduation pass with owner approval (already cited multiple times
  today as a load-bearing cross-cutting principle); status: pending.
  Source surfaces: napkin Pelagic entry; principles.md §"Don't hide
  problems"; rule body of `no-problem-hiding-patterns` (uncommitted,
  suspect).
