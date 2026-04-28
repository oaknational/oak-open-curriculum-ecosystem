---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-28 (Coastal Mooring Atoll / codex / GPT-5 /
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

Recent historical refresh summaries are preserved in git history, the touched
thread records, and
[`archive/repo-continuity-session-history-2026-04-28.md`](archive/repo-continuity-session-history-2026-04-28.md).

Recent refresh detail lives in the touched thread records and git history.
This file is the repo-level live-state index; old session narrative belongs
in `archive/` or the per-thread next-session records.

## Current State

- Branch: `feat/otel_sentry_enhancements`; current HEAD is `7c589a0a`.
- Latest landed docs/state bundle is `7c589a0a`: Cloudflare MCP handoff state
  plus strengthened commit-gate doctrine. Re-check active claims,
  `commit_queue`, and `git diff --cached --name-status` before the next index
  action.
- Fresh Mossy Codex identity-plumbing WIP is present in the worktree under
  separate claims. It implements `.codex` SessionStart identity context,
  report-only anonymous identity audit, and doctrine/continuation propagation;
  preserve it as its own bundle, not part of the Coastal consolidation bundle.
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
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Full history in thread record. Latest active identities: Luminous Dancing Quasar / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-cluster-b-second-wave-and-phase-1.1-finish-env-scrub-three-commits-pushed-sonar-hotspot-panel-100-percent-OK / 2026-04-28; Tidal Rolling Lighthouse / `claude-code` / `claude-opus-4-7-1m` / pr-87-quality-remediation-replan-2026-04-28 / 2026-04-28; Opalescent Gliding Prism / `claude-code` / `claude-opus-4-7-1m` / pr-87-architectural-cleanup-session-2-phase-0-1-cluster-q-and-cluster-a-sink-trace / 2026-04-27; Pelagic Flowing Dock / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-1-and-void-underscore-rule-author-then-metacognitive-correction-and-handoff / 2026-04-27; Vining Bending Root / `claude-code` / `claude-opus-4-7-1m` / pr-87-phases-3-5-execution-and-metacognitive-correction / 2026-04-27. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, and continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Full history in thread record. Latest active identities: Coastal Mooring Atoll / `codex` / `GPT-5` / session-handoff-codex-identity-archive-claim-closeout / 2026-04-28; Glassy Ebbing Reef / `codex` / `GPT-5` / cloudflare-planning-and-commit-gate-doctrine-handoff / 2026-04-28; Mossy Creeping Branch / `codex` / `GPT-5` / codex-session-identity-plumbing-current-slice-and-doctrine-propagation / 2026-04-28; Verdant Flowering Blossom / `codex` / `GPT-5` / hook-test-io-remediation-and-shared-state-sweep-policy-closeout / 2026-04-28; Woodland Creeping Petal / `codex` / `GPT-5` / collaboration-state-write-safety-current-plan-implementation / 2026-04-28; Pelagic Drifting Sail / `codex` / `GPT-5` / agent-work-ownership-and-workspace-layer-doctrine-handoff-consolidation-commit-closeout / 2026-04-28; Ethereal Threading Supernova / `codex` / `GPT-5` / codex-hooks-correction-session-close-claims-ttl-comms-archive-handoff / 2026-04-28; Codex / `codex` / `GPT-5` / practice-tool-feedback-and-collaboration-state-domain-model-preservation / 2026-04-28; Coastal Washing Rudder / `codex` / `gpt-5.5` / owner-directed-queue-governance-graduation-pdr-029-and-plan-archive / 2026-04-27; Prismatic Waxing Constellation / `codex` / `gpt-5.5` / owner-directed-intent-to-commit-queue-implementation / 2026-04-27; Composer / `cursor` / `Composer` / cursor-sessionstart-hook-identity-mirror-docs-tests-handoff / 2026-04-27. |
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

New planning lane from this session:

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
