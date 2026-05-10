---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-10 — Iridescent Dancing Nebula /
`claude-code` / Opus 4.7 / `04cca8`, Wave 2 plan-file pivot)**: landed
Wave 2 Item 1 as commit `fae57312` on `feat/mcp-graph-support-foundation`
(6 SKILL-CANONICAL.md as thin pointers + 86 generated adapters; reviewer
dispatch returned APPROVED from both code-reviewer and architecture-reviewer-fred
with Wave 1 trust-boundary WARN concretely closed). Owner observation
post-landing — *".agent/commands still exists; I expected that to be gone
by now"* — reframed the work: Item 1's pointer-shape preserves the very
surface PDR-051 + ADR-125 §2026-05-09 retire. Plan-time code-reviewer
dispatch on the proposed full-retirement migration returned APPROVED
WITH SUGGESTIONS with five critical findings (incl. reclassifying
`chatgpt-report-normalisation.md` from delete-only to inline; reversing
commit order to land validator refactor first; fixing pre-existing
validator drift in same commit). Surface deeper than initial estimate:
realistic ~3–4 focused hours. Honoured `feedback_no_speed_pressure` +
`feedback_ground_state_before_planning`: stopped Wave 2 punch-list mode;
opened plan in `current/`. Landed handoff as `3ecbc4dc`. **Next safe step**:
execute `.agent/plans/agent-tooling/current/agent-commands-retirement.plan.md`
phase 1 (validator + health-probe refactor + pre-existing drift fixes).
Wave 2 Items 3–6 (lock.ts wiring, rendering.ts extraction, parseFlags
strict, clearGeneratedAdapters tests) queued separately as agent-tools
quality work.

**Session close (2026-05-10 — Woodland Shedding Moss /
`claude-code` / Opus 4.7 / `5869e0`, onboarding flow integration +
good-first-issues index)**: synthesised `/team-onboarding` slash-command
draft (root `ONBOARDING.md`) into the existing layered onboarding flow
per parallel `onboarding-reviewer` and `docs-adr-reviewer` audit
verdicts. Landed commit `9752892d` on `feat/mcp-graph-support-foundation`
with 10 files: deleted root `ONBOARDING.md` (mixed personal stats +
durable team guidance + Claude prompt; competed with README/CONTRIBUTING
as entry point), gitignored future slash-command output, created
`.agent/prompts/onboarding-claude-teammate.md` (per ADR-117 §3 prompt
type), `docs/engineering/sibling-repos.md`, `docs/engineering/mcp-servers-for-contributors.md`
(Vercel-CLI prohibition called out), `.agent/plans/good-first-issues.md`
(top-level plan index sibling to `high-level-plan.md`, primarily routing
to GitHub `good first issue` label), and updated README, CONTRIBUTING,
high-level-plan, plus the engineering and prompts indices. Reviewer
findings honoured: no personal usage stats in tracked docs
(no-moving-targets-in-permanent-docs); canonical unprefixed skill names
(`/start-right-quick`) not personal `/jc-*` aliases; ADR-117 lifecycle
respected. Pre-existing `practice.md` HARD char-count surfaced again at
the orchestrator pre-screen, not introduced by this bundle. **Next safe
step**: unchanged from the prior session — graph MVP work + PR #102
merge-prep on `connecting-oak-resources`; the onboarding artefacts are
now durable and ready for the next teammate to use.

**Session close (2026-05-10 — Blooming Ripening Glade /
`claude-code` / Opus 4.7 / `0730a8`, agent-collaboration directive
evolution + repo-continuity archive plan)**: applied five edits to
`.agent/directives/agent-collaboration.md` (full enumeration in the
thread record). Drafted current-lifecycle plan at
[`repo-continuity-archive-and-invariants-role.plan.md`][rc-archive-plan]
— Phase 1 mechanical archive sweep, Phase 2 owner-gated role-decision
for the §Repo-Wide Invariants enumeration. **No commit in this
session**. **Next safe step**: owner-directed commit of the
agent-collaboration.md edits + new plan via the commit skill
(pathspec-stage + pathspec-commit per the cure now named in §c);
Phase 1 of the plan is unblocked and agent-executable next session.

[rc-archive-plan]: ../../plans/agentic-engineering-enhancements/current/repo-continuity-archive-and-invariants-role.plan.md

Historical session summaries and old next-safe-step queues moved to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md)
and
[repo-continuity-session-history-2026-05-10.md](archive/repo-continuity-session-history-2026-05-10.md).

## Current State

- Branch `planning/graph-tooling` is in final pre-merge planning closeout. Last
  pushed/refreshed PR #102 head is
  `309d9e5e44cebecb1be2478d2fb084a54f39b6b2`.
- PR #102 technical gates are clean on that pushed head: GitHub checks pass,
  SonarCloud Code Analysis passes through PR checks, and all known review
  threads are resolved.
- Owner direction 2026-05-08: PR #102 must not merge until the graph plans are
  finalised and decision-complete. Closeout docs now record
  `Decision-complete: YES`; merge-ready remains `NO` until the final
  clean-worktree dry-run merge/abort is run.
- Latest eval/structure decisions: EEF slice 1 structural-only now; LLM/outcome
  eval is follow-on infrastructure; Practice graph home is
  `agent-graphs/practice-graph/`.
- Branch-touched-files is `107`, so pre-merge divergence analysis is required.
- The live final-session plan is
  `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md`.
- Remaining merge blocker: run the final pre-merge divergence workflow for the
  107-file branch on a clean worktree. Current unrelated local scratch state in
  `.agent/plans/notes/` should be preserved or isolated before that dry-run.
- Opalescent Shimmering Orbit's closeout collaboration claims are closed;
  `claims status` reports zero active claims. The advisory commit queue only
  contains stale/abandoned historical entries.
- Residual Practice fitness pressure is routed, not hidden: `practice.md`
  remains HARD on character count and needs an owner-approved Core edit or
  threshold decision before a strict-hard fitness gate can be clean.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Twilit -> Ashen / `claude-code` / `7cf730` / 2026-05-05 |
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Iridescent Dancing Nebula / `claude-code` / Opus 4.7 / `04cca8` / 2026-05-10 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Fronded Bending Blossom / `cursor` / Composer / `60775a` / 2026-05-09 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Opalescent / `codex` / `019e06` / 2026-05-08 |

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Branch-Primary Lane State

Current branch-primary lane state for `planning/graph-tooling` lives in
[threads/connecting-oak-resources.next-session.md](threads/connecting-oak-resources.next-session.md).
This branch also depends on the Practice/tooling substrate work from main in
[threads/agentic-engineering-enhancements.next-session.md](threads/agentic-engineering-enhancements.next-session.md).

## Current Session Focus

**Next up (owner 2026-05-09)**:
**graph MVP implementation** on the `connecting-oak-resources` thread once
PR #102 merge blockers are cleared — slice plans drive execution. **Deferred**:
monorepo topology ADR / stage-matrix work (strategic plan remains in `future/`
until re-opened).

*Historical context:*

**2026-05-09 (skills standardisation WS0 — Cosmic Glowing Star)**:
WS0 review remediations landed as commit `989375a8` on `feat/mcp-graph-support-foundation`.
Four reviewers ran in parallel; 3 BLOCKER reshapes (WS1.4/1.5 structural body
assertions, WS1.7 structural help-text assertion, WS2.3 subprocess delegation),
7 must-fix WARN reshapes, 4 new WS5 propagation cycles. Plan body records WS0
Outcome paragraph. WS1.1 (Ajv schema + loader) is the next-session opening task.

**2026-05-09 (workspace topology / pipeline stages)**:
strategic plan only — monorepo supply-chain model for superseding ADR-108;
execution intentionally sequenced after graph MVP tranche.

**2026-05-08 (PR #102 graph decision-complete planning)**:
absorb remaining graph-plan findings and apply the latest structural-only EEF
evaluation decision before PR #102 merges. This is a planning closeout session,
not implementation.

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs.
Resume with these branch-relevant constraints:

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
Curriculum HTTP API and generated SDK, not direct Hasura/materialised views;
- **knowledge preservation is absolute** — writing to shared-state
knowledge surfaces is never blocked by fitness limits;
- **shared-state files are always writable and always commit-includable**
regardless of any active claim (deliberate anti-log-jam tradeoff).

Current branch non-goals:

- do not implement intent-to-commit as claim metadata only; owner direction
requires an explicit minimal queue mechanic;
- do not reopen broader canonicalisation opportunistically;
- do not treat monitor setup or owner-handled preview validation as in-repo
acceptance work;
- do not guess Vercel, Sentry, or GitHub state before checking primary
evidence.

## Next Safe Step

**Clear PR #102 merge blocker**:

1. Preserve or isolate the unrelated dirty `.agent/plans/notes/` scratch state
   so the worktree is clean.
2. Because branch-touched-files is `107`, run the final pre-merge divergence
   workflow on a clean worktree before merge. The 2026-05-08 non-mutating probe
   found no changed-both files, no ADR/plan numbering add/add collisions, and
   no merge-tree conflict signal.
3. After PR #102 merges, **start graph MVP feature implementation** per the
   slice plans in `connecting-oak-resources/knowledge-graph-integration/` — that
   arc is now the **primary** engineering focus.
4. **Defer** monorepo workspace topology ADR drafting and stage-matrix audits
   until the owner explicitly returns to that programme **after** the graph
   MVP implementation tranche (see `monorepo-workspace-topology-adr-and-canonical-plan.plan.md`).

**Sequencing (owner 2026-05-09)**:
while PR #102 is still open, finish merge prep (clean worktree, divergence) on
`planning/graph-tooling` before implementation work. **After merge**, the
**primary** arc is **graph MVP feature implementation** per slice plans.
**Park** monorepo topology ADR / **S0–S6** enforcement until the owner
returns to that programme after the MVP tranche.

## Open Owner-Decision Items

Visible owner-appetite items, not blockers for the current branch state:

1. Residual `practice.md` HARD character pressure needs an owner-approved
   Core edit, threshold decision, or dedicated remediation lane. Constraint:
   Practice Core edits require owner approval under the Core care-and-consult
   rule; falsifiability is `pnpm practice:fitness --strict-hard`.
2. The pending-graduations queue remains SOFT and is intentionally calibrated
   for consolidation-pass access rhythm. Continue draining due entries in
   dedicated consolidation sessions.
3. Future doctor arcs are separate owner-choice lanes: repair mode and
   consolidation integration.
4. **Monorepo workspace topology** (superseding ADR-108, **S0–S6** strategic
   plan): **parked** until after the graph MVP implementation tranche; the
   candidate remains in `pending-graduations.md` for a later drafting slot.

## Deep Consolidation Status

**Status (2026-05-10 Woodland Shedding Moss, claude-code, Opus 4.7,
`5869e0`, onboarding-flow integration + good-first-issues index):
`not due — bounded reviewer-driven docs synthesis (10 files,
commit 9752892d); pre-existing ADR-117 + no-moving-targets governance
already covered the design decisions; no plan closure, no napkin
rotation, no new graduated doctrine; no ADR/PDR candidate qualifies
for pending-graduations`. The earlier 2026-05-10 Blooming Ripening
Glade closeout (agent-collaboration directive evolution; tactical
directive-edit pass on a single file; three findings captured in
napkin as session-scoped observations; foreign-stage cure-naming
reinforced an already partially-graduated entry) also recorded
`not due` and stands.**

**Status (2026-05-09 Mistbound Glimmering Threshold, claude-code,
Opus 4.7, `03f9bc`, skills-standardisation follow-up): `due — 3rd
instance of --clear regression in 2 sessions plus auto-classifier
substring-match shape question; both already captured in napkin and
thread record. Not well-bounded for this closeout (22 min over
budget); next session picks up canonicalise-the-six (closes the
structural gap) and surfaces the auto-classifier matcher-shape
question as an ADR/PDR candidate`.** This handoff stops after
marking `due` per session-handoff step 10's
not-well-bounded-this-closeout branch.

**Status (2026-05-08 Opalescent Shimmering Orbit, codex, GPT-5, `019e06`,
PR #102 graph decision-complete closeout): `due — the PR #102 graph planning
closeout plan completed and pushed; run consolidate-docs after merge or in a
bounded follow-up to mine durable decisions/follow-ons without delaying the
merge blocker cleanup`.**
