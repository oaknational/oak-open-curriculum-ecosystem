---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-26 (Sturdy Otter / claude-code / claude-opus-4-7-1m
— WS3A/WS4A 13-commit backlog cleanup landed under 3-agent contention;
intent-to-commit and joint-agent-decision-protocol future plans authored;
WS3B sidebar promotion gate satisfied; phase-transition evidence recorded;
clash taxonomy A/B/C named. PR-87 quality remediation moves to a separate
thread.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-bundle
evidence taxonomy reflected. The future intent-to-commit plan now treats
substitution, disappearance, and accretion as distinct staged-bundle integrity
failures.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — lock-wait nuance
captured. Claude Monitor / Codex shell wait / Cursor shell wait are noted
as physical lock guards, not substitutes for commit-window claims.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-window
protocol pass. The git index/head transaction window is now represented as
a short-lived active-claim area before staging or committing.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — learning-first
fitness correction after WS4A closeout. Napkin rotated and distilled;
consolidation / Practice / ADR-144 surfaces now say fitness limits are
signals and must never suppress learning.)

**Prior refresh**: 2026-04-26 (Sharded Stroustrup / claude-code /
claude-opus-4-7-1m — observability-sentry-otel session close. Sentry
preview validation closed empirically; `/test-error` route landed;
correlation_id Sentry tag wired; fragile widget-metadata e2e tests
removed; 18-plan observability landscape inventoried in a new
consolidation memo. Eight commits pushed at session close; HEAD
`2f766fe4`. Next observability work is split across two parallel
plans on this branch:
[`current/sentry-immediate-next-steps.plan.md`](../../plans/observability/current/sentry-immediate-next-steps.plan.md)
and
[`current/pr-87-quality-finding-resolution.plan.md`](../../plans/observability/current/pr-87-quality-finding-resolution.plan.md).
Doc-driven gap-finding lesson captured in `napkin.md` for vendor-doc
review symmetry.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — WS3A complete;
session-handoff plus consolidate-docs; final next-session exploration prompt
captured.)

This file is the repo-level live-state index. Durable lane detail belongs in
thread records and plans; old session narrative belongs in `archive/`.

## Current State

- Branch: `feat/otel_sentry_enhancements` at local HEAD `6c65e75d`, with a
  dirty working tree.
- Current dirty work includes WS3A/WS4A collaboration docs/state, the
  commit-window protocol refinement, and pre-existing MCP/SDK TypeScript
  work. Treat these as separate surfaces.
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
- WS3B sidebar / timeout / owner-escalation promotion gate is satisfied
  as of 2026-04-26; implementation has not started.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Full history in thread record. Latest active identity: Frolicking Toast / `claude-code` / `claude-opus-4-7-1m` / L-IMM-execution / 2026-04-26. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Sturdy Otter / `claude-code` / `claude-opus-4-7-1m` / phase-transition-evidence-and-future-plans / 2026-04-26; Codex / `codex` / `GPT-5` / commit-bundle-evidence-taxonomy / 2026-04-26. |

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

Two parallel sessions ran on `feat/otel_sentry_enhancements`
2026-04-26 with non-overlapping scope. Both closed at session-end.

**Frolicking Toast (this handoff) — observability-sentry-otel**:
executed the L-IMM (operational hardening) lane to closure on 5/6
sub-items. Five Sentry-node commits landed (one per sub-item):
flush timeout 2s → 5s; maxBreadcrumbs / sendClientReports verify;
ignoreErrors / denyUrls scaffold (RED-first); Vercel Marketplace
PENDING surface; hybrid error fingerprinting (post-redaction).
Sub-item 6 (Vercel Marketplace verify) is PENDING owner-touch.
Three reviewers ran on Tier 2 fingerprinting; all findings absorbed.
Lane status flipped to `✅ closed-pending-3d`; wrapper plan rotated
to archive/completed/.

**Codex (separate session) — agentic-engineering-enhancements**:
captured the commit-window coordination protocol design (intent-
to-commit-and-session-counter plan), absorbed the lock-wait nuance,
reflected the staged-bundle evidence taxonomy, and refreshed Practice
surfaces. Three concurrent-commit race conditions plus staged-bundle
substitution / disappearance / accretion evidence surfaced during
co-tenancy; documented in shared log and Codex's plan.

No WS3B implementation, SDK/product work outside the Sentry lane,
or hook-based automation started in either session.

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

- do not implement WS3B without an explicit execution pass, even though the
  promotion gate is now satisfied;
- do not reopen broader canonicalisation opportunistically;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work;
- do not guess Vercel, Sentry, or GitHub state before checking primary
  evidence.

## Next Safe Step

Choose the lane deliberately:

1. **Distilled-memory structural response** — because learning was correctly
   preserved first, `distilled.md` now carries hard fitness pressure. The
   next consolidation-memory move is an explicit remediation lane or
   owner-approved deferral to bring `distilled.md` below hard by
   graduating, pruning, or splitting without deleting signal.
2. **MCP / SDK dirty work** — run targeted type-checks for
   `@oaknational/oak-curriculum-sdk` and the repo root, then resolve the
   `ToolMeta` / `listUniversalTools` TypeScript debt. Do not fold that work
   into the WS3A documentation closeout.
3. **Observability branch-primary (L-IMM closed 2026-04-26 at 5/6;
   PR-87 quality lane still active)** —
   - L-IMM lane (operational hardening): closed at 5/6 with Sub-item 6
     (Vercel Marketplace verify) PENDING owner-touch. The execution
     wrapper rotated to
     [`archive/completed/sentry-immediate-next-steps.plan.md`](../../plans/observability/archive/completed/sentry-immediate-next-steps.plan.md).
     Pickup: owner inspects Vercel project settings → Integrations and
     replaces the PENDING section in
     `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
     with the verified-state paragraph, then lane status flips to
     `✅ closed`.
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
4. **Lifecycle integration follow-up** — only if owner-directed, observe
   whether start-right / handoff / template lifecycle triggers are used in
   real sessions. Do not add hook reminders without evidence. WS3B now has
   satisfied promotion evidence but still needs an explicit implementation
   pass.
5. **Other agentic engineering work** — WS3A, WS4A, and the commit-window
   refinement are closed once the current claim is archived. Start WS3B only
   as an explicit implementation pass. Otherwise pick a queued plan from the
   current/roadmap surfaces.

## Open Owner-Decision Items

These are visible owner-appetite items, not blockers for the active lanes:

1. `prog-frame/agentic-engineering-practice.md` disposition, recorded in
   [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032, recorded in
   `.agent/reference/README.md` and the archived reference/notes plan.
3. `boundary-enforcement-with-eslint.md` promotion proposal under PDR-032,
   same destination set as above.
4. Whether to implement WS3B sidebar/escalation now that the promotion gate
   is satisfied.

## Deep Consolidation Status

**Status (2026-04-26 Frolicking Toast, L-IMM closure handoff)**:
not due — lightweight session handoff for L-IMM execution closure.
No `consolidate-docs` trigger fired (no third-instance pattern; no
napkin overflow; no register sweep due; no thread reorganisation).
Five Sentry-node commits + closure surfaces landed; all gates green
per scoped runs and pre-commit / pre-push hooks. Sub-item 6 PENDING
owner-touch is recorded in the thread next-session record and the
lane plan body, not as a deferred consolidation item here.

**Prior status (2026-04-26 Codex, lock-wait note handoff/consolidation)**:
completed this handoff for the owner-agreed lock-wait nuance. The commit
skill now records Claude Monitor / Codex shell wait / Cursor shell wait as
physical guards for `.git/index.lock`, while preserving `git:index/head`
active claims as the coordination layer. The napkin, thread record, and this
continuity file were refreshed. Capture buffers were scanned; the `.remember`
entry about the git lock collision / Monitor wait is now homed in the commit
skill and napkin. Entry points remain pointer-only; no tactical track cards
needed action; decision-thread files remain examples only.

Consolidation audit: active collaboration state contains the observability
claim `c1a25f27-eacf-4a18-9528-f0b971c46f08` only after this closeout claim is
archived. That claim is in the observability lane and its claimed paths overlap
the staged observability files, so this handoff deliberately did not stage,
unstage, commit, or touch them. No ADR/PDR candidate qualifies beyond the
existing commit-window operational note.

Validation status: targeted markdownlint, JSON parse, Ajv collaboration
schema validation, `git diff --check`, `pnpm portability:check`,
`pnpm practice:vocabulary`, and `pnpm practice:fitness:informational` pass
with the known expected `distilled.md` hard pressure.

**Prior status (2026-04-26 Codex, coordination closeout + learning-first
correction)**: completed this handoff for coordination-plan and
Practice-state surfaces. Parent plan, roadmap, documentation-sync log,
thread record, repo-continuity, reviewer guidance, Practice Core, AGENT
line width, and collaboration directive wording are refreshed.
`docs-adr-reviewer` and `assumptions-reviewer` findings were absorbed.
Collaboration state was audited: one fresh Codex claim was opened for
this closeout and explicitly archived with `closure.kind: "explicit"`;
decision-thread files remain examples only.

Owner corrected the consolidation policy: learning preservation outranks
fitness limits. The outgoing napkin was archived to
[`archive/napkin-2026-04-26.md`](../active/archive/napkin-2026-04-26.md), the
high-signal entries were distilled into `distilled.md`, and
`consolidate-docs`, PDR-014, ADR-144, and Practice Core surfaces now say
fitness limits are signals, never reasons to suppress capture, distillation,
graduation, or useful writing.

Validation status: JSON parse, Ajv schema validation for active/closed
claims and decision-thread files, targeted markdownlint, `git diff --check`,
`pnpm portability:check`, and `pnpm practice:vocabulary` pass. Practice
fitness is expected to report hard pressure after the learning-first
distillation because `distilled.md` intentionally crossed its hard line
limit. That is the correct signal: the next structural response is to
graduate/prune/split `distilled.md`, not to undo the preserved learning.

**Prior status (2026-04-26 Codex)**: not due after completed consolidation. Earlier
this handoff, deep consolidation completed because WS3A closed and
`repo-continuity.md` was hard in practice fitness. Final handoff added only the
next-session exploration prompt; no new deep-consolidation trigger fired.
Earlier response:

- pre-compaction body preserved at
  [`archive/repo-continuity-session-history-2026-04-26.md`](archive/repo-continuity-session-history-2026-04-26.md);
- live repo state compacted here;
- completed WS3A split plan moved to `archive/completed/`;
- current-plan README, roadmap, parent plan, sibling plan, and thread record
  refreshed;
- collaboration state audited for stale claims, decision threads, evidence
  bundle gaps, and schema validation.
- `pnpm practice:fitness --strict-hard` passes; informational mode reports
  only existing soft findings.

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
  pending.
- 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a different
  lane or owner direction; status: pending.
- 2026-04-26; workspace-first failure cluster; rule or recurrence-prevention
  amendment for workspace inventory before external tooling/new infra; trigger:
  second cross-session instance or owner direction; status: pending.
- 2026-04-26; Vercel branch URL fixture bug; testing-strategy amendment for
  production-shaped fixture anchoring; trigger: second cross-session instance
  or owner direction; status: pending.
- 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner direction;
  status: pending.
- 2026-04-26; Sentry doc-driven gap finding; vendor-doc review for
  unknown-unknowns in third-party platform plans; trigger: second platform
  instance or owner direction; status: pending.
- 2026-04-26; observability validation correction; alignment check before
  per-system claim validation; trigger: second skipped-alignment instance or
  owner direction; status: pending.
- 2026-04-26; WS3A closeout; protocol observability by consolidation audit
  before new visible surfaces; trigger: second protocol slice with the same
  shape or owner direction; status: pending.
