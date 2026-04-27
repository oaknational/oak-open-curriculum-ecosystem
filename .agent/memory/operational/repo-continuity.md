---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-27 (Fragrant Sheltering Pollen / codex /
gpt-5.5 — `jc-session-handoff` + `jc-consolidate-docs` after dropping the
experimental Codex app-server thread-title adapter. `@oaknational/agent-tools`
gates passed. A live commit-window collision landed the Codex stable-name row
inside commit `2ccefad4` under another message; owner directed this to be
recorded as concrete evidence for the intent-to-commit queue.)

Recent refresh detail lives in the touched thread records and git history.
This file is the repo-level live-state index; old session narrative belongs
in `archive/` or the per-thread next-session records.

## Current State

- Branch: `feat/otel_sentry_enhancements` at local HEAD `21abd2d4`, ahead of
  origin by 21 commits at this refresh.
- Current dirty work includes agentic-engineering documentation/state edits,
  untracked collaboration-doc files, and Vining Bending Root's active
  observability/product/schema-cache WIP. Preserve pathspec discipline and do
  not touch git/index without a fresh commit-window claim and staged-set
  ownership check.
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
- The future intent-to-commit plan has promotion-threshold evidence for
  staged-bundle integrity failures: substitution, disappearance, and
  accretion. Implementation remains owner-gated.
- WS3B sidebar / timeout / owner-escalation and joint-agent decision
  workflow integration are implemented. First real sidebar/joint-decision
  usage should feed WS5 observation.
- Deterministic identity is complete for repo-owned CLI docs plus Claude Code
  statusline and Codex `CODEX_THREAD_ID` seed discovery. Cursor has an
  **experimental** project `sessionStart` hook (`OAK_AGENT_SEED`,
  `additional_context`, gitignored local mirror); Composer **tab title** still
  has no hook/API rename field in the official Cursor Hooks reference.
- Collaboration-doc fitness remediation is implemented in the working tree:
  directive detail moved to referenced operational docs, and lifecycle
  recipes live in `collaboration-state-lifecycle.md`.
- The owner has explicitly directed `intent_to_commit` implementation. The
  next implementation must make it an ordered advisory commit queue, not only
  optional claim metadata. The 2026-04-27 commit-window collision proves
  `git:index/head` claims make conflicts visible but do not serialize commit
  turns; queue order is now the next load-bearing primitive.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Full history in thread record. Latest active identities: Frolicking Toast / `claude-code` / `claude-opus-4-7-1m` / L-IMM-execution / 2026-04-26; Codex / `codex` / `GPT-5` / marketplace-verification-closeout-and-handoff / 2026-04-26. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Fragrant Sheltering Pollen / `codex` / `gpt-5.5` / owner-directed-codex-app-server-rollback-agent-tools-gates-and-commit-queue-evidence / 2026-04-27; Composer / `cursor` / `Composer` / cursor-sessionstart-hook-identity-mirror-docs-tests-handoff / 2026-04-27; Pelagic Washing Sail / `codex` / `gpt-5` / collaboration-fitness-vocabulary-cross-vendor-note-commit-queue-handoff-and-closeout / 2026-04-27; Riverine Navigating Hull / `claude-code` / `claude-opus-4-7-1m` / agent-identity-derivation-phase-8-claude-code-statusline-wiring / 2026-04-27. |

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
- Collaboration-doc fitness remediation is implemented but not staged by
  this handoff. It split high-frequency doctrine from detailed lifecycle
  recipes without weakening "knowledge and communication, not mechanical
  refusals."
- A correct `practice:vocabulary` failure in the shared communication log
  was fixed from the retired ADR-144 wording to the three-zone vocabulary.
  The owner surfaced a follow-up idea: retired-vocabulary checks should
  eventually carry transition metadata and review dates.
- Pelagic Washing Sail left Vining Bending Root a shared-log note about that
  vocabulary-transition idea. A 15-minute heartbeat in this Codex thread
  checks whether Vining picks it up; no pickup evidence existed at the first
  read-only poll.
- Owner direction now promotes `intent_to_commit` from future design to the
  next implementation lane, with an explicit correction: implement a minimal
  ordered commit queue, not just a claim field.
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

1. **Intent-to-commit queue implementation** — promote/update
   `intent-to-commit-and-session-counter.plan.md` and implement schema v1.3
   around an ordered advisory `commit_queue` plus exact staged-bundle
   verification. Use the 2026-04-27 `2ccefad4` collision as evidence that
   active commit-window claims alone are observable but not ordering. Keep the
   queue advisory; do not create a mechanical lock.
2. **Collaboration-doc fitness remediation landing** — the split is
   implemented in the working tree; validate/commit it separately from the
   queue work when the git index is clear.
3. **Strict exact-optional cleanup** — the stricter
   `--exactOptionalPropertyTypes` probe is clean for identity files but still
   reports the pre-existing `agent-tools/src/bin/codex-reviewer-resolve.ts`
   optional typing issue.
4. **First real sidebar / joint-decision seed** — when a real overlap uses
   the new entries, capture whether it reached resolution without becoming a
   permission gate or default owner escalation.
5. **Observability branch-primary (L-IMM closed 2026-04-26 at 6/6;
   PR-87 quality lane still active)** —
   - L-IMM lane (operational hardening): closed at 6/6 after owner
     verification that the Vercel Sentry Marketplace plugin is active
     and configured. The execution wrapper rotated to
     [`archive/completed/sentry-immediate-next-steps.plan.md`](../../plans/observability/archive/completed/sentry-immediate-next-steps.plan.md).
   - [`current/pr-87-quality-finding-resolution.plan.md`](../../plans/observability/current/pr-87-quality-finding-resolution.plan.md):
     CodeQL + SonarCloud quality remediation with a parallel-execution
     context section. Phase 0 owner gates open; Phases 1-6 are the fix
     sequence. Runs solo now that L-IMM has closed; the parallel-track
     framing in the plan body remains accurate as historical context.
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
6. **Lifecycle integration follow-up** — only if owner-directed, observe
   whether start-right / handoff / template lifecycle triggers are used in
   real sessions. Do not add hook reminders without evidence. First real
   sidebar/joint-decision usage should feed WS5 observation.
7. **Codex/Cursor identity display follow-up** — Codex thread-id wiring
   landed in `ff119d44`; CLI/TUI title/statusline surfaces exist, but a
   first-class IDE session-title/custom-name setting was not found. Cursor
   composer `session_id` is the stable seed via `sessionStart`; repo hook +
   mirror landed in working tree — **Composer tab title** still needs Cursor
   product support or manual rename from `suggestedComposerTabTitle`.
8. **Other agentic engineering work** — WS3A, WS4A, commit-window,
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
