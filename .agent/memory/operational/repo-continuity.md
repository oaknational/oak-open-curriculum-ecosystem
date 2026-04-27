---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-27 (Vining Bending Root / claude-code /
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

- Branch: `feat/otel_sentry_enhancements` at local HEAD `5c39d1d4`, ahead of
  origin.
- Current dirty work is session-handoff state from the just-landed queue
  migration commit: active-claim closure, shared-log closeout, and continuity
  refreshes. Active claims and `commit_queue` are empty after handoff; re-check
  both plus `git diff --cached --name-status` before the next index action.
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
- The first successful self-application commit using the advisory queue has
  fired the queue-doctrine graduation trigger; deep consolidation is due before
  queue doctrine is treated as fully settled governance.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Full history in thread record. Latest active identities: Vining Bending Root / `claude-code` / `claude-opus-4-7-1m` / pr-87-phases-3-5-execution-and-metacognitive-correction / 2026-04-27; Frolicking Toast / `claude-code` / `claude-opus-4-7-1m` / L-IMM-execution / 2026-04-26; Codex / `codex` / `GPT-5` / marketplace-verification-closeout-and-handoff / 2026-04-26. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Prismatic Waxing Constellation / `codex` / `gpt-5.5` / owner-directed-intent-to-commit-queue-implementation / 2026-04-27; Fragrant Sheltering Pollen / `codex` / `gpt-5.5` / owner-directed-codex-app-server-rollback-agent-tools-gates-and-commit-queue-evidence / 2026-04-27; Composer / `cursor` / `Composer` / cursor-sessionstart-hook-identity-mirror-docs-tests-handoff / 2026-04-27; Pelagic Washing Sail / `codex` / `gpt-5` / collaboration-fitness-vocabulary-cross-vendor-note-commit-queue-handoff-and-closeout / 2026-04-27; Riverine Navigating Hull / `claude-code` / `claude-opus-4-7-1m` / agent-identity-derivation-phase-8-claude-code-statusline-wiring / 2026-04-27. |

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

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs. Resume with
these branch-relevant constraints:

- no compatibility layers; replace, do not bridge;
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

1. **Deep consolidation for queue governance** — the queue self-application
   trigger fired in `5c39d1d4`. Run `jc-consolidate-docs` or an
   owner-directed governance amendment pass to graduate the queue doctrine into
   the relevant PDR / collaboration-state governance surface.
2. **Strict exact-optional cleanup** — the stricter
   `--exactOptionalPropertyTypes` probe is clean for identity files but still
   reports the pre-existing `agent-tools/src/bin/codex-reviewer-resolve.ts`
   optional typing issue.
3. **First real sidebar / joint-decision seed** — when a real overlap uses
   the new entries, capture whether it reached resolution without becoming a
   permission gate or default owner escalation.
4. **Observability branch-primary (L-IMM closed 2026-04-26 at 6/6;
   PR-87 quality lane in flight under corrected disposition)** —
   - L-IMM lane (operational hardening): closed at 6/6 after owner
     verification that the Vercel Sentry Marketplace plugin is active
     and configured. The execution wrapper rotated to
     [`archive/completed/sentry-immediate-next-steps.plan.md`](../../plans/observability/archive/completed/sentry-immediate-next-steps.plan.md).
   - [`current/pr-87-quality-finding-resolution.plan.md`](../../plans/observability/current/pr-87-quality-finding-resolution.plan.md):
     **14 PR-87 commits pushed 2026-04-27 under Vining Bending Root**
     (HEAD `61c846b1`). CI test, Vercel preview, CodeQL language analyses,
     Cursor Bugbot all green. CodeQL combined and SonarCloud Code
     Analysis remain RED. **Fresh thread MUST start by reverting commit
     `03a58787`** (DISABLE block violating `principles.md` "NEVER disable
     any quality gates"). Master plan now carries §"Phase 5 Metacognitive
     Correction" at the head with the full corrected per-finding
     disposition table; Phase 0 Task 0.2 + Phase 5 + Phase 6 Task 6.3
     marked SUPERSEDED.
   - Deployed-state validation of the new fingerprint on the next
     preview deploy: hit `/test-error?mode=...` via the existing probe
     script and confirm new Sentry issues carry the hybrid fingerprint
     `['{{ default }}', 'TestError*']`. Note the issue-merge
     discontinuity callout — existing OAK-OPEN-CURRICULUM-MCP-{7,8,9}
     issues retain old grouping; new occurrences attach to NEW issue
     IDs.
   - The prior substrate plan
     [`sentry-preview-validation-and-quality-triage.plan.md`](../../plans/observability/current/sentry-preview-validation-and-quality-triage.plan.md)
     closed 2026-04-26 with full Phase 1-5 findings tables; rotate to
     archive/completed/ on next consolidate-docs.
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
- 2026-04-27; intent-to-commit queue v1.3.0 implementation; likely PDR-029 /
  collaboration-state governance amendment; trigger: first successful
  self-application commit using the queue helper or second real queue cleanup;
  status: due — first successful self-application commit landed as `5c39d1d4`.
- 2026-04-27; investigation-mode drifts into disposition-mode under context
  pressure (Vining Bending Root, PR-87 Phase 5); PDR candidate around
  master-plan ACCEPT/DISABLE tables as structural enablers of this drift,
  triggers for re-reading principles.md at phase boundaries, and detection
  language for the drift; trigger: second cross-session instance OR owner
  direction; status: pending. Source surface: `napkin.md` 2026-04-27 entry +
  master plan §"Phase 5 Metacognitive Correction".
