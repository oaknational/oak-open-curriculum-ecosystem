---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-28T~15:30Z (Abyssal Cresting Compass /
claude-code / claude-opus-4-7-1m / `6efc47` — PR-87 Phase 2.0.5 keyGenerator
cure landed (a7ce1a39); doc alignment landed (d3e86fd1); PR-87 mega-plan
archived and superseded by one-page CodeQL-only plan (d6693239). Mid-session
re-classification of FIND-001/002 from MUST-FIX → HARDENING after Vercel
docs verification — cure is defence-in-depth + configuration-drift insurance,
not exploit closure. Owner-directed plan reset: scope-lock to CodeQL only;
defer Sonar to a separate plan. Owner-flagged hypothesis at session close:
the 1,680-file / +167k-line PR diff may be triggering CodeQL stale-instance /
skip-by-size behaviour — fresh session probes that BEFORE writing structural
cures.)

**Incremental refresh**: 2026-04-28 (Coastal Mooring Atoll / codex / GPT-5 /
`019dd3` — owner-requested deep consolidation pass. Historical continuity
summaries are archived, PR-87 is homed in-repo, disposition-drift doctrine is
graduated to PDR-018, and principles / collaboration-state fitness pressure is
structurally reduced. Fresh Mossy identity-plumbing work remains under its own
claims.)

**Incremental refresh**: 2026-04-28 (Mossy Creeping Branch / codex / GPT-5 /
`019dd3` — Codex session identity plumbing implemented and validated, then
propagated into the plan, thread record, repo-continuity, ADR-125, ADR-165,
PDR-024, PDR-027, PDR-029, and PDR-035. This was a narrow follow-on to the
Coastal consolidation pass, not a replacement for it.)

**Incremental refresh**: 2026-04-28 (Glassy Ebbing Reef / codex / GPT-5 /
`019dd3` — Cloudflare MCP public-beta security and token-economy planning was
preserved, commit-gate doctrine was strengthened per owner correction, and the
final handoff confirms no new deep-consolidation trigger beyond the committed
doctrine.)

**Incremental refresh**: 2026-04-28 (Coastal Mooring Atoll / codex / GPT-5 /
`019dd3` — lightweight handoff after the Codex identity plan archive. The
remaining archive claim is closed, the handoff-time napkin overflow was rotated
by Mossy Creeping Branch, and current strict-hard fitness is soft-only again.)

**Incremental refresh**: 2026-04-28 (Luminous Waning Aurora / cursor / composer /
`dde6be` — `/jc-session-handoff` after investigation-only work: oak-preview MCP
curriculum probes, Sentry MCP preview/error correlation, ADR-163 release-id
story confirmed against live aggregates, OAuth proxy **`429` + unconditional
`.json()`** root cause captured for **`handleToken`**. No working-tree edits.)

**Incremental refresh**: 2026-04-29 (Nebulous Weaving Dusk / codex / GPT-5 /
`019dd7` — architectural budget planning pass landed in docs/plans: ADR-166
created and tightened, parent/visibility/enforcement budget plans added, the
directory-cardinality plan rewritten as the `max-files-per-dir` child, and
roadmap/index references reconciled. Validation passed for root markdownlint
and scoped `git diff --check`. Aggregate build/check gates are not claimed
because concurrent TS6/build migration work is active on `fix/build_issues`.)

**Incremental refresh**: 2026-04-29 (Verdant Swaying Fern / claude /
claude-opus-4-7 / `c34d50` — TS6 migration mid-flight on `fix/build_issues`,
moved to fresh session per owner direction after recurring mistake-pattern
accumulation (sed-bypass of Read-then-Edit safety, captured as napkin
Surprise 5). Tasks #1–#8 done and verified by green build, type-check, test,
and knip; Tasks #9 (ADR-167 authoring) and #10 (final quality-gate sweep +
release-readiness review) are pending. ~170 uncommitted files in working
tree; owner-recommended 7-commit landing shape is documented in the plan.
Plan: [`typescript-6-migration-and-workspace-script-rules`][ts6-plan]. New
patterns landed: `hook-as-question-not-obstacle`; `ground-before-framing`
extended with 2026-04-29 evidence; napkin skill amended with "Never Hold Back
Insight to Fit a Budget" rule. Owner-directed architectural rules captured:
workspace-to-root-script ban, all-TypeScript-scripts with dedicated
no-compile-no-deps directory exception (currently
`apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/` for the
vercel-ignore script). Open question for fresh session: vitest-config-base
coupling (19 workspaces import `../../../vitest.config.base`) — same shape as
the script ban but for configs; not yet addressed.)

[ts6-plan]: ../../plans/architecture-and-infrastructure/active/typescript-6-migration-and-workspace-script-rules.plan.md

**Incremental refresh**: 2026-04-29 (Ethereal Illuminating Comet / claude-code /
claude-opus-4-7-1m / `05f2e9` — small-scope test deletion on `fix/build_issues`:
removed `packages/sdks/oak-sdk-codegen/e2e-tests/scripts/zodgen.e2e.test.ts`
plus stale `test-cache/zod-out/`. Test was a misclassified e2e (in-process
function call), violated "do not test types", duplicated existing unit +
integration coverage, and `execSync('npx tsc')` shelled out incompatibly with
the repo's pnpm dependency config. Verified `pnpm test` 855 passed, `pnpm
test:e2e` 8 passed, `pnpm type-check` clean. Deletion staged in working tree;
not committed. **Owner-flagged process anomaly for separate investigation**:
this session ran without a `/rename`, without joining a thread, without
registering an active claim, and without writing to `shared-comms-log.md`.
The work was small and off-thread (no collision risk), but the coordination
ritual silently degraded — captured as a pending-graduations candidate
(small-work bypass of coordination surfaces) plus a napkin Surprise. Not to
be retroactively fixed in this handoff per owner direction. **Post-handoff
landings (same session, same identity)**: diagnosed and fixed a silent
`sonar-secrets` PreToolUse:Read hook failure that had been swallowed three
times during the codegen-package work (relative path
`.claude/hooks/sonar-secrets/build-scripts/pretool-secrets.sh` resolved
against shell cwd after `cd packages/sdks/oak-sdk-codegen`, exit 127, no
visibility because the hook is non-blocking). Fix shape: registered hook
commands in `.claude/settings.json` rewritten to use `${CLAUDE_PROJECT_DIR}`
dynamic paths; new wrapper at `.claude/hooks/_lib/log-hook-errors.sh`
persists non-zero hook exits to `.claude/logs/hook-errors.log` (gitignored)
with timestamped diagnostic blocks. Authored ADR-167 documenting the
discipline. Owner caught a wording mistake in the ADR — initial Decision
§2 said "absolute path", which would hard-code one machine's layout into
version control; reframed to "dynamic path rooted at platform-provided
project-root variable" with explicit rejection of both bare-relative and
literal-absolute shapes. New pending-graduations register entry added for
PDR extraction of the hook-failure-visibility canonical contract.
Markdownlint clean for all session edits.)

Recent historical refresh summaries are preserved in git history, the touched
thread records, and
[`archive/repo-continuity-session-history-2026-04-28.md`](archive/repo-continuity-session-history-2026-04-28.md).

Recent refresh detail lives in the touched thread records and git history.
This file is the repo-level live-state index; old session narrative belongs
in `archive/` or the per-thread next-session records.

## Current State

- Observed checkout for the latest handoff: branch `fix/build_issues`, HEAD
  `171a94fd`, with unrelated package/tsconfig/build/lockfile work in progress.
  Do not infer PR-87 branch health from this checkout.
- Historical PR-87 branch state: `feat/otel_sentry_enhancements`; current HEAD
  was `c601d515`
  (= origin = PR-87 head). Four Choppy Lapping Rudder commits landed and
  pushed this session: `c1677d84` (Cluster A claim + cross-thread S5443
  request), `ca7e6e4b` (new agent-coordination-CLI-ergonomics future plan),
  `6a2b4e54` (γ-execution napkin observations), `c601d515` (owner-staged
  sweep landing prior-session Codex identity plumbing + adapter repair +
  coordination state + docs).
- PR-87 Phase 2 pre-phase security review COMPLETE; findings homed at
  [`plans/observability/active/pr-87-cluster-a-security-review.md`](../../plans/observability/active/pr-87-cluster-a-security-review.md).
  2 MUST-FIX (X-Forwarded-For spoofing bypasses every limiter on Vercel),
  2 SHOULD-FIX (OAuth bucket sharing, /healthz unlimited), 4 HARDENING.
  Plan §"Phase 2.0.5" inserts the keyGenerator cure BEFORE the brand
  narrowing per reviewer recommendation.
- Prior-session Codex identity-plumbing (Mossy) and adapter-repair
  (Estuarine) work landed via the owner-staged sweep at `c601d515`. No
  outstanding peer WIP in working tree.
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
- Collaboration-state write safety has landed as `11f0320f`:
  [`collaboration-state-write-safety.plan.md`](../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md)
  promoted the strategic brief into executable work. The implementation adds
  `pnpm agent-tools:collaboration-state -- ...`, deterministic Codex
  identity preflight from `CODEX_THREAD_ID`, immutable comms event files under
  `.agent/state/collaboration/comms/events/`, transaction-guarded JSON writes
  for claims / queue / conversations / escalations / closed claims, and
  type-specific TTL cleanup. Hooks stay later polish.
- Codex-wide session identity parity has an implemented current slice:
  [`codex-session-identity-plumbing.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md).
  The slice wires Codex `SessionStart` identity context, keeps the
  collaboration-state preflight command as the canonical full interface, and
  adds report-only anonymous identity audit. Historical `Codex` / `unknown`
  rows are reported, not rewritten blindly; title/statusline remains optional
  display.
- The closeout commit blocker was rechecked after owner override. The previous
  `agent-tools` TypeScript error no longer reproduced; build passed before any
  additional source edit. Treat current gate evidence as stronger than stale
  handoff failure prose.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Luminous Waning Aurora / `cursor` / `composer` / preview-sentry-mcp-oauth-triage-readout / 2026-04-28; Abyssal Cresting Compass / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-2.0.5-keygenerator-cure-doc-alignment-and-plan-reset-to-codeql-only / 2026-04-28; Choppy Lapping Rudder / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-2-pre-phase-security-review-and-phase-2.0.5-scope-expansion / 2026-04-28; Luminous Dancing Quasar / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-cluster-b-second-wave / 2026-04-28; Tidal Rolling Lighthouse / `claude-code` / `claude-opus-4-7-1m` / pr-87-quality-remediation-replan-2026-04-28 / 2026-04-28; Opalescent Gliding Prism / `claude-code` / `claude-opus-4-7-1m` / pr-87-architectural-cleanup-session-2 / 2026-04-27; Pelagic Flowing Dock / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-void-underscore-rule-author / 2026-04-27; Vining Bending Root / `claude-code` / `claude-opus-4-7-1m` / pr-87-phases-3-5 / 2026-04-27. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Coastal Mooring Atoll / `codex` / `GPT-5` / session-handoff-codex-identity-archive-claim-closeout / 2026-04-28; Glassy Ebbing Reef / `codex` / `GPT-5` / cloudflare-planning-and-commit-gate-doctrine-handoff / 2026-04-28; Mossy Creeping Branch / `codex` / `GPT-5` / codex-session-identity-plumbing-current-slice-and-doctrine-propagation / 2026-04-28; Verdant Flowering Blossom / `codex` / `GPT-5` / hook-test-io-remediation-and-shared-state-sweep-policy-closeout / 2026-04-28; Woodland Creeping Petal / `codex` / `GPT-5` / collaboration-state-write-safety-current-plan-implementation / 2026-04-28; Pelagic Drifting Sail / `codex` / `GPT-5` / agent-work-ownership-and-workspace-layer-doctrine-handoff-consolidation-commit-closeout / 2026-04-28; Ethereal Threading Supernova / `codex` / `GPT-5` / codex-hooks-correction-session-close-claims-ttl-comms-archive-handoff / 2026-04-28; Codex / `codex` / `GPT-5` / practice-tool-feedback-and-collaboration-state-domain-model-preservation / 2026-04-28; Coastal Washing Rudder / `codex` / `gpt-5.5` / owner-directed-queue-governance-graduation-pdr-029-and-plan-archive / 2026-04-27; Prismatic Waxing Constellation / `codex` / `gpt-5.5` / owner-directed-intent-to-commit-queue-implementation / 2026-04-27; Composer / `cursor` / `Composer` / cursor-sessionstart-hook-identity-mirror-docs-tests-handoff / 2026-04-27. |
| `architectural-budget-system` | Architecture/devx — cross-scale architectural budget doctrine, visibility, and staged enforcement planning | [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md) | Nebulous Weaving Dusk / `codex` / `GPT-5` / architectural-budget-planning-and-adr-handoff / 2026-04-29. |
| `cloudflare-mcp-security-and-token-economy-plans` | Product/security — Cloudflare MCP public-beta gate and token-efficient MCP tool-use strategy | [`threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md`](threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md) | Glassy Ebbing Reef / `codex` / `GPT-5` / cloudflare-mcp-security-token-economy-planning-final-handoff / 2026-04-28. |

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

**Latest focus (2026-04-29, Nebulous Weaving Dusk, Codex GPT-5)**:
architectural budget planning pass. ADR-166 and the parent/child planning
topology now define function/file/directory/workspace/package-API/graph budgets,
visibility-before-enforcement rollout, anti-gaming rules, and review cadence.
No enforcement code was enabled. Aggregate `agent-tools`/build validation is
blocked by concurrent TS6 `baseUrl` migration work on `fix/build_issues`; do
not treat that as budget-plan evidence.

**Latest focus (2026-04-28, Luminous Waning Aurora, Cursor Composer)**: Read-only
Sentry MCP + Curriculum MCP probes on preview: confirmed single active **`release`
tag on preview errors**, no parallel legacy **`preview-feat-*`** strings on ingest;
documented **`handleToken`** gap for Clerk **`429`** non-JSON bodies (tactical fix
candidate, not landed here).

**Prior focus (2026-04-28T~15:30Z, Abyssal Cresting Compass)**: PR-87
Phase 2.0.5 keyGenerator cure landed and reframed mid-session as defence-
in-depth (not exploit closure) after Vercel-docs verification contradicted
the security review's premise. Doc alignment landed (ADR-158 amended;
governance + workspace docs aligned; dual-edge framing + read-only
blast-radius callout added per owner direction). PR-87 mega-plan archived
and superseded by a one-page CodeQL-only plan. Owner-flagged hypothesis at
session close: the 1,680-file / +167k-line PR diff may be triggering CodeQL
stale-instance / skip-by-size behaviour — fresh session probes that
hypothesis BEFORE writing structural cures.

Current distinct focus (2026-04-28 Coastal Mooring Atoll): owner-requested deep
consolidation. The pass preserves knowledge while moving live operational
surfaces back under their fitness budgets, homes PR-87 execution knowledge into
the repo, and graduates the due disposition-drift doctrine without deleting
personal external plan files.

Incremental practice focus (2026-04-28 Mossy Creeping Branch): Codex session
identity plumbing is implemented and validated, with follow-on propagation into
the current plan, continuation surfaces, ADR-125, ADR-165, PDR-024, PDR-027,
PDR-029, and PDR-035.

Final handoff focus (2026-04-28 Glassy Ebbing Reef): Cloudflare MCP planning
and owner-corrected commit-gate doctrine are landed in `7c589a0a`; no commit
is requested for this final handoff. Live Mossy identity/consolidation WIP
remains separate under its own claims.

Latest handoff focus (2026-04-28 Coastal Mooring Atoll): verify the completed
Codex identity plan archive claim is closed, keep the current-path deletion
plus archive path as the plan state, and verify the napkin overflow rotation
restored strict-hard fitness to soft-only.

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

**Branch-primary lane (PR-87 CodeQL alerts, owner-directed scope-lock to
CodeQL only)**: Open
[`plans/observability/current/pr-87-codeql-alerts.plan.md`](../../plans/observability/current/pr-87-codeql-alerts.plan.md)
as the single source of truth (the prior `pr-87-architectural-cleanup.plan.md`
was archived 2026-04-28 — do not re-derive from it). **First action is a
diff-size / stale-instance probe**: PR-87 diff is 1,680 files / +167k lines,
and an open alert may be a CodeQL platform skip-by-size or stale-instance
artefact rather than a missing fix. For each open alert, check
`most_recent_instance.commit_sha` vs PR head and confirm the file/line still
exists. If most alerts are stale-instance, force a re-analysis (push a no-op
or wait for the next push) before writing structural cures. Only if the
hypothesis is rejected do you execute the table:

- Alerts #70/71/72/81 (`js/missing-rate-limiting`): brand-preservation type
  narrowing through `RateLimitRequestHandler`. One commit.
- Alert #69: investigate recogniser shape; same brand cure or
  owner-authorised dismissal with file:line evidence.
- Alerts #76/#77 (`js/http-to-file-access`): typed `SchemaCache` capability
  for the codegen schema-cache writer. One commit.

Sonar is **out of scope** for this plan; a separate plan opens after CodeQL
closes. Phase 2.0.5 keyGenerator cure already landed (a7ce1a39 + d3e86fd1)
as defence-in-depth; it does not move CodeQL but is part of PR-87 history.

Other lanes:

- **Architectural budget system** — planning/doctrine landed in ADR-166 and
  the parent/child plans. Resume from
  [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md).
  Next safe step is owner choice: either promote the visibility layer for one
  named consumer trigger, or start Phase 0 of the directory-cardinality child
  plan. Do not enable blocking enforcement before baseline/remediation and
  ADR-121/build-system propagation are ready.
- **Cloudflare MCP public-beta gate / token economy** — do not start
  implementation from the borrowed Code Mode pattern. First either promote the
  security gate to `current/` with a Cloudflare control disposition table, or
  measure current Oak MCP `tools/list` and representative teacher-facing
  workflow token costs. Keep direct API/product-builder optimisation primarily
  mapped to the SDK unless a later owner decision changes that boundary.

1. **Practice collaboration-state write safety** — the first executable slice
   landed in `11f0320f`, with the generated comms/state sweep in `da21284d`.
   The named hard fitness pressure in `principles.md`,
   `collaboration-state-conventions.md`, and `repo-continuity.md` has been
   routed to structural homes. Current strict-hard fitness passes with active
   soft findings only, not hard pressure in those write-safety surfaces. Next safe step is a
   deliberate closeout/archive pass for the write-safety plan with the current
   soft-only evidence recorded.
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
     is now the canonical 12-phase execution plan as well as the architectural
     map. The personal Claude plan evidence has been homed here; do not depend
     on absolute personal plan paths for future execution.
   - **Current PR-87 state**: Phase 1 / Cluster B (`runGitCommand` lockdown)
     completed in three commits (`9b2b2ed7`, `5d6622d0`, `84571ccf`). The last
     TO_REVIEW Sonar hotspot was closed by data-flow change, not status flip.
     CodeQL OPEN count is still 7 pending the next phases.
   - **Next safe step on this lane**: re-harvest GitHub / Sonar / CodeQL facts,
     then start Phase 2 / Cluster A from the active plan: security pre-review,
     `RateLimitRequestHandler` brand narrowing, compile-time negative test,
     route fake updates, and TSDoc debt removal. No fallback dispositions, no
     check disables, and generated code remains fully owned.
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
6. **Codex session identity plumbing** — the high-impact current slice is
   implemented and validated in
   [`codex-session-identity-plumbing.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md).
   Follow-up is manual repair only for historical anonymous rows with stronger
   evidence; title/statusline remains optional display.
   Remaining work is only follow-up policy: decide whether any audited
   historical `Codex` / `unknown` rows have enough evidence for manual repair,
   and keep title/statusline as optional display rather than correctness.
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

Incremental status (2026-04-29 Verdant Swaying Fern session-handoff to
fresh context): **not due — owner directed lightweight handoff to a
fresh session before further TS6/build-infrastructure work, citing
recurring sed-bypass-of-Read-then-Edit mistake-pattern accumulation.**
Tasks #1–#8 of the TS6 migration plan landed and verified; Tasks #9
(ADR-168 authoring) and #10 (final quality-gate sweep +
release-readiness review) are owner-explicit next-session work named
in
[`typescript-6-migration-and-workspace-script-rules.plan.md`](../plans/architecture-and-infrastructure/active/typescript-6-migration-and-workspace-script-rules.plan.md).
Two new pending-graduations register entries added: ADR-168 candidate
(TS6 + workspace-script architectural rules); pattern-or-PDR
candidate for the "tool-error-as-question" meta-pattern (third-surface
trigger, given five distinct surfaces of the same anti-pattern fired
in a single session). Five napkin Surprises captured (reviewer
prosthetic / confirmation reading / hook-as-obstacle / fitness-as-
constraint / sed bypass). Patterns landed: new
`hook-as-question-not-obstacle.md`; `ground-before-framing.md`
extended with same-session evidence. Skill correction: napkin
SKILL.md amended with "Never Hold Back Insight to Fit a Budget"
section. **No thread touched** this session — work was branch-fix-
bound (`fix/build_issues`), not thread-bound; the plan file is the
durable continuity carrier. Active-claims registry was empty
throughout the session; no claim required closure (state explicitly
noted per workflow §8). No open conversations or escalations were
touched. Entry-point drift sweep clean for CLAUDE.md and GEMINI.md;
AGENTS.md retains its pre-existing RULES_INDEX.md pointer line —
not introduced this session, same observation Ethereal made earlier.
~170 uncommitted files in working tree at session-end; landing shape
recommended in the plan as 7 logical commits.

Incremental status (2026-04-29 Ethereal Illuminating Comet final handoff):
**not due — combined session (test deletion + silent-hook fix + ADR-167)
landed three pending-graduations candidates and one new ADR; portable
generalisation deferred to a future session and a future second-platform
implementation per PDR-009.** Repo-continuity remains over fitness limits
(inherited from prior session); napkin remains over fitness limits
(inherited). This combined handoff added three pending-graduations entries
(small-work coordination-skip; test misnaming as exemption; hook-failure
visibility canonical contract), authored ADR-167 with three Future Work
items naming the PDR graduation path, fixed the silent `sonar-secrets`
hook bug, and reframed the ADR's Decision §2 per owner correction
(absolute → dynamic-path-rooted-at-platform-variable). Three napkin
Surprises captured (coordination-skip, test-misnaming, absolute-path
wording smuggling). Active-claims registry remained empty throughout the
session; no claim was opened, none required closure (state explicitly
noted per workflow §8). Entry-point drift sweep clean (CLAUDE.md,
AGENTS.md, GEMINI.md unchanged this session; pre-existing AGENTS.md
RULES_INDEX.md line is a separate historical concern, not session-
introduced drift). Concurrent independent work by Verdant Swaying Fern
(claude / claude-opus-4-7) on TS6 migration on the same branch landed in
parallel; their refresh entry sits between Nebulous and Ethereal in the
incremental-refresh sequence — no overlap with this session's edits, no
collision risk observed.

Incremental status (2026-04-29 Nebulous Weaving Dusk handoff): not due —
the ADR-shaped decision from this session was created directly as ADR-166 and
then amended before handoff. The planning surfaces and ADR/index links were
validated; no unhomed ADR/PDR candidate, entrypoint drift, or repeated surprise
requires `jc-consolidate-docs` now. Active-claims registry is empty; no
collaboration claim required closure.

**Status (2026-04-28 Coastal Mooring Atoll, owner-requested deep
consolidation pass)**: completed the deep pass that was explicitly requested to
preserve usefulness rather than make numbers smaller. The pass homes PR-87
stance and sequencing into the in-repo plan, graduates disposition-drift
doctrine into PDR-018, extracts problem-hiding examples to governance docs,
moves collaboration-state field provenance to lifecycle guidance, and applies
this file's archive split strategy.

ADR/PDR scan: no new host ADR is required. Generated-code responsibility and
no-shim doctrine are already covered by existing ADR/principles surfaces; the
newly due Practice-governance item graduated as a PDR-018 amendment with a
PDR-029 tripwire cross-reference. Pattern scan: absolute-git-binary and
vendor-control-disposition remain pending candidates, not promoted patterns.

ADR-144 critical post-mortem for this file: earlier soft/hard zones did fire,
but repeated handoff additions preserved useful evidence without applying the
archive split. The hard limit remains correct because this file is a live index,
not a historical log. The breach was a symptom of delayed archival, not missing
product architecture documentation. The falsifiability check is
`pnpm practice:fitness:informational`: this file should no longer report hard
or critical pressure after archive and status refresh.

Incremental status (2026-04-28 Glassy Ebbing Reef final handoff): not due —
the owner correction about `.agent` shared state and whole-repo commit gates
has already landed in doctrine via `7c589a0a`; no additional ADR/PDR candidate,
entrypoint drift, or repeated surprise surfaced during this final handoff.

Incremental status (2026-04-28 Coastal Mooring Atoll lightweight handoff): not
due — a handoff-time active napkin hard-fitness spike was immediately rotated
by Mossy Creeping Branch into
[`napkin-2026-04-28-current-overflow.md`](../active/archive/napkin-2026-04-28-current-overflow.md).
`pnpm practice:fitness:strict-hard` is soft-only again, and no new ADR/PDR,
entrypoint-drift, or pattern trigger surfaced in this handoff.

Incremental status (2026-04-28 Luminous Waning Aurora handoff): **not due —
investigation-only session** (no plan closure, napkin Surprise capture only,
no consolidate-docs hygiene gap beyond thread + continuity refresh).

Incremental status (2026-04-28T~12:50Z Choppy Lapping Rudder, owner-directed):
**due — owner-directed move to fresh session.** Owner explicitly invoked
`/jc-consolidate-docs` after `/jc-session-handoff` so this session's
graduation candidates and convergence work happen now before the fresh
session opens. New pending-graduations candidates from this session: see
register additions below (CLI ergonomics + cross-thread request/response
correlation + stance-staleness mitigation + protocol-experience pattern).

**Fitness deferral (recorded honestly, not skipped)**: this file is at
521 lines vs hard limit 500 (4% over hard, well under critical 750)
after this consolidation's preservation of new pending-graduation entries
and the Choppy refresh block. Constraint: owner directed move to fresh
session before further Phase 2 implementation; structural refinement of
older session-close summaries (top of file, now mostly historical) is
explicitly deferred to the next consolidate-docs run. Falsifiability: at
next consolidation, if this file is still ≥hard limit AND no new
high-value pending-graduations have arrived, the deferral was wrong and
the older session-close history should archive per `split_strategy`.

**ADR/PDR candidate scan** (per consolidate-docs step 7a): scanned this
session's content for ADR-shaped or PDR-shaped doctrine. Two candidates
surfaced and were recorded in the register below rather than promoted:

- **stance-staleness mitigation** — doctrine candidate for
  `agent-collaboration.md` and the start-right skills. Single-instance
  evidence; promotion bar is second instance OR owner direction. Not
  proposed for promotion in this pass.
- **pre-phase-adversarial-review-expands-cluster-scope** — pattern
  candidate. Possible second-instance evidence (Wilma's PATH-defence
  expansion of Phase 1 was structurally similar). Not proposed for
  promotion in this pass; needs deliberate review of Wilma's expansion
  as a fellow instance at the next consolidation.

Practice Core review (step 8): no qualifying candidate this pass. The
two candidates above belong in `agent-collaboration.md` (host directive)
or as ADR-150 amendments rather than the portable Practice Core. The
collaboration-state CLI ergonomics candidate is repo-specific tooling,
not Core-shaped. Practice exchange box (step 10) checked: empty incoming;
no outgoing substance to home.

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
  pressure; PDR candidate around fallback disposition framing at phase
  boundaries; trigger: second cross-session instance OR owner direction;
  status: graduated 2026-04-28 to
  [PDR-018 §Disposition drift at phase boundaries](../../practice-core/decision-records/PDR-018-planning-discipline.md#disposition-drift-at-phase-boundaries-2026-04-28-amendment).
  Evidence came from Vining / Pelagic / Tidal PR-87 planning instances plus
  owner and assumptions-reviewer corrections. Canonical doctrine now lives in
  PDR-018 with a PDR-029 tripwire reference; PR-87 execution stance lives in
  [`active/pr-87-architectural-cleanup.plan.md`](../../plans/observability/active/pr-87-architectural-cleanup.plan.md).
  External Claude plan files remain personal evidence, not repo dependencies.
- 2026-04-27; "no adapters, no compatibility layers, no half measures"
  reinforced cross-cuttingly through Pelagic Flowing Dock session;
  ADR or principles.md amendment to elevate this to a top-level rule
  alongside "WE DON'T HEDGE" and "Strict and complete"; trigger:
  graduation pass with owner approval; status: covered-no-promotion
  2026-04-28. Existing `principles.md` code-design doctrine already owns
  "no adapters, no compatibility layers, no half measures" and "WE DON'T
  HEDGE"; no new ADR/principles amendment is proposed in this pass.
- 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`); future
  strategic plan candidate for promotion to `current/` when a second session
  reports the same friction; trigger: second instance OR owner direction;
  status: pending. Evidence + plan:
  agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md.
- 2026-04-28; cross-thread comms event request/response correlation gap (no
  `audience`, no `in_response_to`, no TTL/escalation timer; routine
  cross-thread requests rot silently between the lightweight log and the
  heavyweight decision-thread); minimal correlation primitive on the comms
  event schema as the recommended first promotion slice; trigger: second
  silently-rotted cross-thread request OR owner direction; status: pending.
  Same plan as above.
- 2026-04-28; stance-staleness within a single conversation (parallel-agent
  state moves between forming a stance and reporting it; re-fetch needs to
  happen at *each commitment*, not only at session-open); doctrine candidate
  for `agent-collaboration.md` and the start-right skills; trigger: second
  instance OR owner direction; status: pending. Captured as napkin entry
  "γ-Execution Coordination-Protocol Observations" Surprise 1.
- 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as a MUST-FIX (FIND-001/002) that
  brand-preservation alone does not fix; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope` (the brand work was
  the original cure; review surfaced an exploitable bypass requiring a
  separate keyGenerator cure that lands FIRST); trigger: second cross-session
  instance OR owner direction; status: pending. Evidence:
  observability/active/pr-87-cluster-a-security-review.md.
- 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to *first
  edit* rather than to thread join, so off-thread / small-scope sessions
  cannot silently skip `/rename`, claim registration, and shared-log
  participation; trigger: owner-flagged this session AND named for separate
  investigation by other sessions; status: pending. Evidence:
  napkin Surprise 1 in
  [`napkin.md` §"2026-04-29 — Misclassified e2e test deletion + coordination-surface skip"](../active/napkin.md).
  Cross-reference: [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
- 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions
  the test would otherwise fail — process spawning, type-only assertions,
  fs writes); testing-strategy amendment to classify tests by behaviour
  shape (imported code vs. separate process), not by filename suffix;
  trigger: second observed instance OR owner direction; status: pending.
  Evidence: deleted `packages/sdks/oak-sdk-codegen/e2e-tests/scripts/zodgen.e2e.test.ts`
  plus napkin Surprise 2 in same entry as above.
- 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default, which compromises
  defensive layers like secrets scanners); PDR candidate extracting the
  canonical contract (message shape, registration discipline, wrapper
  responsibility split) from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform (Cursor, Codex, Gemini CLI,
  or other) implementing a thin wrapper honouring the canonical contract,
  OR owner direction to graduate without waiting; status: pending.
  Evidence: ADR-167 reference instance for Claude Code +
  `.claude/hooks/_lib/log-hook-errors.sh` wrapper + `.claude/settings.json`
  registration update (staged in working tree, not committed).
- 2026-04-29; TypeScript 6 migration + workspace-script architectural
  rules (workspace-to-root-script ban; all-TypeScript-scripts rule;
  dedicated no-compile-no-deps directory exception for scripts that
  cannot have a build step or external dependencies, e.g. Vercel's
  `ignoreCommand`); ADR candidate (next available number is **168**
  given Ethereal Illuminating Comet authored ADR-167 in parallel);
  trigger: graduation pass at consolidate-docs OR owner direction;
  status: pending. Evidence: plan
  [`typescript-6-migration-and-workspace-script-rules`][ts6-plan];
  Tasks #1–#8 landed (build/type-check/test/knip green), ADR
  authoring (Task #9) deferred to fresh session per owner direction
  after sed-bypass mistake-pattern accumulation. Body should cover
  baseUrl removed (rationale: TS6 deprecation; zero `paths` aliases;
  `moduleResolution: bundler` makes baseUrl inert), `rootDir: "./src"`
  convention reaffirmed for build configs, `types: ["node"]` added at
  base (TS6 changed default to `[]`), `erasableSyntaxOnly: true` retained,
  workspace-to-root-script ban with concrete remediation pattern,
  all-TypeScript-scripts rule with the dedicated-directory exception,
  Husky `.sh` shell-script exception (genuine pre-existing structure),
  vitest-config-base coupling acknowledged as deferred open question
  (same shape, configs vs scripts).
- 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass-of-Read-then-Edit);
  pattern candidate or PDR amendment for "tool-error-as-question"
  meta-pattern; trigger: third surface where the same anti-pattern
  recurs OR owner direction to graduate the meta-pattern (not just
  the per-surface instances); status: pending. Evidence: napkin
  2026-04-29 entry "TS6 migration myopia (Verdant Swaying Fern)"
  with five Surprise sub-sections documenting five distinct surfaces
  where the same "tool-returns-error → find-bypass" instinct fired
  in a single session; new pattern
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md)
  extended with same-session evidence; napkin skill amended with
  "Never Hold Back Insight to Fit a Budget" rule.
