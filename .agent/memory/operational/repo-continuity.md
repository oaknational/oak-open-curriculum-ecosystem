---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-30T07:30Z (Vining Ripening Leaf / claude-code /
claude-opus-4-7-1m / `bce99d` — `fix/sentry-identity-from-env` branch / PR #91
preview verification + observability-config-coherence strategic plan +
substrate-vs-axis-plans convention component + ADR-162 closure-property
ADR-to-plan bridge. No production code touched. Build `dpl_wTvPsL48u6bCn89Vscw29uot8M9H`
verified READY via Sentry MCP + Vercel MCP: release
`poc-oak-open-curriculum-mcp-git-fix-sentry-identity-from-env` correctly
attributed to commit `837fcfde` with env=preview, 5 bootstrap spans + 10 DEBUG
logs landed. Sentry-identity-from-env fix is working in production. No
remediation deemed urgent for this branch — observability-config-coherence
plan items all involve broader structural change. PDR candidate captured:
substrate-vs-axis-plans convention + working principle "invent-justification-
as-signal". Single commit landing all session artefacts at handoff close.)

**Earlier refresh**: 2026-04-29T21:30Z (Solar Threading Star / claude-code /
claude-opus-4-7-1m / `6d68d6` — PR #90 closure thread complete; owner manual
MCP validation confirmed; PR ready for squash-merge. 13 commits this session
across 7 phases: TS-invocation alignment (5 surfaces, 2 sibling drift sites
caught by Phase 0 audit beyond the handoff's 3 named), Sonar mechanical sweep
(12 issues), Cursor Bugbot napkin fix, local-detection gate (TDD pure helper +
unit + integration → refactored to canonical validator pattern + standalone
script after testing-strategy compliance challenge), MD024 enabled with
`siblings_only: true` (3 sibling-level duplicates surfaced and fixed; rule was
globally disabled), validator-pattern test-strategy refactor, future +
executable plans for `scripts/validate-*` family workspace migration (4
parallel reviewer consensus), future plan for Vercel build-warning elimination
(2 classes from full 4006-event log read), `.gitignore` for
scheduled_tasks.lock, owner-MCP-validation closeout. Plus end-of-session
sharpening: caught real bug in `breadth-as-evasion.md` (broken machine-local
link refs); principle "No absolute paths" graduated to "No machine-local paths"
with the three forbidden + three permitted shapes named explicitly; new
canonical rule `.agent/rules/no-machine-local-paths.md` with thin adapters
across all 4 platforms; `RULES_INDEX.md` updated. PR comments posted (5
total). Outstanding: owner squash-merge of PR #90.

**Earlier refresh**: 2026-04-29T17:30Z (Nebulous Illuminating Satellite /
claude-code / claude-opus-4-7-1m / `fe4acc` — deeper /jc-consolidate-docs
convergence run + deferred-items plan family + trinity Active Principles
extensions per-diff approval, landed across 6 commits (`123396e2`,
`8560df5a`, `4d01847f`, `b7844608`, `daa8e706`, `f7baea40`). Three
doctrine sharpenings (knowledge-preservation absolute; shared-state
always writable; gate-off-fix-gate-on anti-pattern); Practice Core
retirement complete (PDR-007/014/024 amendments; trinity nav updated;
practice-core/patterns + practice-context directories deleted via
`git rm`); 6 patterns graduated to memory/active/patterns/; displaced
doctrine extracted from 4 of 6 audited plans (ADR-121 Change Log;
ADR-162 Enforcement Principles; consolidate-docs Plan Supersession
Discipline; observability/archive/superseded README); 6 stale plans
archived; deferred-items plan family authored (parent + 4 children:
build-vs-buy PDR, multi-agent-collaboration concept-home refinement,
trinity extensions, pre-2026-02-15 experience corpus); five trinity
Active Principles extensions applied per-diff (practice.md +
practice-lineage.md + practice-bootstrap.md + practice-verification.md);
owner-approved fitness limit raises on practice.md / practice-verification.md /
repo-continuity.md to absorb the trinity extensions; six medium patterns,
two PDR-shaped candidates, and the experience-corpus backlog added to
register; Identity Candidates graduated from .remember/recent.md to
user-collaboration.md §Owner Working Style. Concurrent disjoint work:
Solar Threading Star (PR #90 product surfaces); Pearly Swimming Atoll
(repo-goal-narrative refresh, claim closed mid-session). Final fitness
SOFT-only.)

**Prior refresh**: 2026-04-29T12:35Z (Squally Diving Anchor / codex /
GPT-5 / `019dd8` — sector-engagement handoff and light consolidation after
commit `33b25495`. The sector-engagement collection now carries explicit
impact framing: external organisations should be able to understand, trust,
adapt, and build with Oak's pipelines, SDKs, MCP server, semantic-search
configuration, knowledge graphs, and generated artefacts. A new
`sector-engagement` thread record is live, and the owner-requested PR
lifecycle skill need is captured as a future Practice plan.)

Older 2026-04-28 / 2026-04-29 incremental refresh entries archived to
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md).
Even older history lives in the 2026-04-22, 2026-04-26, and 2026-04-28
archives in the same directory.

## Current State

+ Branch `fix/build_issues` carries the consolidated TS6 / Vercel-build /
  ADR-166-167-168 work; PR #90 is open against `main`. Solar Threading Star
  holds an active claim on PR #90 product surfaces (Sonar quality gate,
  Copilot review comments, Cursor Bugbot findings, ci.yml stale `.mjs`
  reference). Owner manual MCP server validation pending before merge.
+ Vercel release pipeline is unblocked: original 1.6.0 release-commit
  failure on `dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6` was a multi-document
  `pnpm-lock.yaml` corruption at `171a94fd`; commit `a34f8402` regenerated
  a clean lockfile and Vercel preview now passes.
+ ADRs landed in the recent arc: 166 (architectural budget system), 167
  (hook-execution-failure visibility), 168 (TS6 baseline +
  workspace-script architectural rules). TS6 plan archived to
  `archive/completed/`. Sonar partial fixes landed in `16743c69`; ~30
  Sonar issues remain mechanical for next session.
+ The branch is NOT mergeable until: zero Sonar, zero PR comments, ci.yml
  resolution, MCP manual validation. Solar Threading Star is currently
  working that closure.
+ WS3A decision-thread / claim-history / observability work is complete
  and archived. WS4A lifecycle integration is complete. Commit-window
  protocol refinement is implemented; intent-to-commit queue v1.3.0
  landed. Collaboration-state write safety landed as `11f0320f`.
  Codex-wide session identity plumbing landed; Cursor Composer has
  experimental project sessionStart hook. Workspace layer separation
  audit plan exists; first safe step is Phase 0 inventory.
+ Critical fitness pressure resolved this consolidation: napkin.md
  rotated; repo-continuity history archived. Remaining critical: prose
  line width on distilled.md (2 lines >100 chars; queued under fitness §9
  for refinement). All other fitness findings are SOFT.
+ Branch-primary product thread: `observability-sentry-otel`. Practice
  thread: `agentic-engineering-enhancements`. Branch-level success
  criterion remains the full repo-root gate sequence in
  [`.agent/commands/gates.md`](../../commands/gates.md).

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state
live in each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Most-recent: Vining Ripening Leaf / `claude-code` / `claude-opus-4-7-1m` / observability-config-coherence-plan-and-substrate-convention / 2026-04-30; Abyssal Cresting Compass / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-2.0.5 / 2026-04-28; Luminous Waning Aurora / `cursor` / `composer` / preview-sentry-mcp-oauth-triage / 2026-04-28. Full history in thread record. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Most-recent: Nebulous Illuminating Satellite / `claude-code` / `claude-opus-4-7-1m` / doctrine-sharpening + deeper-convergence + retirement + pattern graduations + trinity extensions / 2026-04-29; Pearly Swimming Atoll / `codex` / `GPT-5` / repo-goal-narrative-refresh / 2026-04-29; Squally Diving Anchor / `codex` / `GPT-5` / pr-lifecycle-skill-need-capture / 2026-04-29. Full history in thread record. |
| `architectural-budget-system` | Architecture/devx — cross-scale architectural budget doctrine, visibility, staged enforcement planning | [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md) | Nebulous Weaving Dusk / `codex` / `GPT-5` / architectural-budget-planning-and-adr-handoff / 2026-04-29. |
| `cloudflare-mcp-security-and-token-economy-plans` | Product/security — Cloudflare MCP public-beta gate and token-efficient MCP tool-use strategy | [`threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md`](threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md) | Glassy Ebbing Reef / `codex` / `GPT-5` / cloudflare-mcp-final-handoff / 2026-04-28. |
| `sector-engagement` | Planning — external organisation adoption, partner reviews, external data-source impact routing | [`threads/sector-engagement.next-session.md`](threads/sector-engagement.next-session.md) | Squally Diving Anchor / `codex` / `GPT-5` / sector-engagement-taxonomy-and-handoff / 2026-04-29. |
| `pr-90-build-fix-landing` | Branch closeout — PR #90 (`fix/build_issues` → `main`); all CI gates green, owner MCP manual validation confirmed; ready for squash-merge | [`threads/pr-90-build-fix-landing.next-session.md`](threads/pr-90-build-fix-landing.next-session.md) | Solar Threading Star / `claude-code` / `claude-opus-4-7-1m` / pr-90-landing-closure-and-machine-local-paths-rule / 2026-04-29 (and prior fix/build_issues sessions: Verdant Swaying Fern, Verdant Regrowing Pollen, Ethereal Illuminating Comet, Nebulous Weaving Dusk, Nebulous Illuminating Satellite). |

The old `memory-feedback` thread is archived. If doctrine-consolidation
work resumes, start a fresh thread or revive that record deliberately.

The 2026-04-29 7c audit's `pr-90-build-fix-landing` finding is now
**resolved**: thread is registered in this table and a thread record
file exists at the canonical path. Solar Threading Star authored the
thread record at session open; Nebulous Illuminating Satellite added
the registration entry during the 2026-04-29 deep consolidation pass.

## Branch-Primary Lane State

Branch-primary lane state for the observability thread lives in
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).
The PR #90 landing lane (Solar Threading Star) is not yet thread-bound
(see open finding above).

## Current Session Focus

**2026-04-29 (Nebulous Illuminating Satellite)**: doctrine sharpening on
knowledge-preservation absolutism and shared-state always-commitable;
deep `/jc-consolidate-docs` pass including napkin rotation,
repo-continuity history archive, ADR/PDR candidate surfacing, Practice
Core review, fitness disposition. Disjoint from Solar Threading Star's
PR #90 product-surface work.

**2026-04-29 (Solar Threading Star, in flight)**: PR #90 landing closure —
Sonar quality gate (12 new issues), Copilot review comments, Cursor
Bugbot findings, ci.yml stale `.mjs` reference. Owner manual MCP server
validation pending before merge.

**2026-04-29 (Squally Diving Anchor, completed)**: sector-engagement
taxonomy split into internal Oak KG integration, ontology workspace
reassessment, external KG adoption, external knowledge-source ingestion;
Oak OpenAPI monorepo integration brief; PR Lifecycle Skill future plan.

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs.
Resume with these branch-relevant constraints:

+ no compatibility layers; replace, do not bridge;
+ distinct architectural layers live in distinct workspaces; folders/modules
  inside one workspace do not satisfy layer separation;
+ TDD at all levels;
+ tests prove product behaviour, not configuration or file presence;
+ strict boundary validation only;
+ no `process.env` read/write in test files or setup files;
+ `--no-verify` requires fresh per-invocation owner authorisation;
+ no warning toleration;
+ owner direction beats plan;
+ curriculum data in this monorepo comes only through the published Oak
  Open Curriculum HTTP API and generated SDK, not direct
  Hasura/materialised views;
+ **knowledge preservation is absolute** — writing to shared-state
  knowledge surfaces is never blocked by fitness limits;
+ **shared-state files are always writable and always commit-includable**
  regardless of any active claim (deliberate anti-log-jam tradeoff).

Current branch non-goals:

+ do not implement intent-to-commit as claim metadata only; owner direction
  requires an explicit minimal queue mechanic;
+ do not reopen broader canonicalisation opportunistically;
+ do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work;
+ do not guess Vercel, Sentry, or GitHub state before checking primary
  evidence.

## Next Safe Step

Choose the lane deliberately:

**PR #90 landing lane (Solar Threading Star, active)**: continue Sonar
quality gate closure, Copilot/Bugbot resolution, ci.yml triage, owner
MCP validation. Plan:
[`pr-90-landing-closure.plan.md`](../../plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md).

**Branch-primary lane (PR-87 CodeQL alerts, owner-directed scope-lock to
CodeQL only)**: Open
[`plans/observability/current/pr-87-codeql-alerts.plan.md`](../../plans/observability/current/pr-87-codeql-alerts.plan.md)
as the single source of truth. **First action is a diff-size /
stale-instance probe**: PR-87 diff is 1,680 files / +167k lines, and an
open alert may be a CodeQL platform skip-by-size or stale-instance
artefact. For each open alert, check `most_recent_instance.commit_sha`
vs PR head and confirm the file/line still exists. If most alerts are
stale-instance, force a re-analysis before writing structural cures.
Sonar is **out of scope** for this plan; a separate plan opens after
CodeQL closes.

Other lanes:

+ **Sector engagement** — resume from
  [`threads/sector-engagement.next-session.md`](threads/sector-engagement.next-session.md).
  Next safe step is owner choice of exactly one external-impact target.
+ **Architectural budget system** — planning/doctrine landed in ADR-166
  and parent/child plans. Resume from
  [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md).
  Next safe step is owner choice: promote the visibility layer for one
  named consumer trigger, or start Phase 0 of the directory-cardinality
  child plan.
+ **Cloudflare MCP public-beta gate / token economy** — first either
  promote the security gate to `current/` with a Cloudflare control
  disposition table, or measure current Oak MCP `tools/list` and
  representative teacher-facing workflow token costs.
+ **Practice collaboration-state write safety** — first executable slice
  landed in `11f0320f`; current strict-hard fitness is soft-only with
  the napkin / repo-continuity rotations done by this consolidation. Next
  safe step is a deliberate closeout/archive pass for the write-safety
  plan.
+ **Workspace layer separation audit** — first safe step is Phase 0:
  re-ground ADR-154 / ADR-108 / surface isolation programme; produce
  workspace inventory before any package moves.
+ **PR-87 architectural cleanup (in flight)** — see archived plan and
  the active CodeQL-only replacement.
+ **Codex session identity plumbing** — high-impact current slice
  implemented and validated; remaining work is follow-up policy.

## Open Owner-Decision Items

Visible owner-appetite items, not blockers for the active lanes:

1. `prog-frame/agentic-engineering-practice.md` disposition, recorded in
   [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032.
3. `boundary-enforcement-with-eslint.md` promotion proposal under PDR-032.
4. *Resolved 2026-04-29*: `pr-90-build-fix-landing` thread registered
   in Active Threads; thread record at canonical path was authored by
   Solar Threading Star at session open.
5. ADR/PDR candidates surfaced by 2026-04-29 deep consolidation — see
   `Pending-Graduations Register` below for the full queue and the
   in-session summary at the consolidation closeout.

## Deep Consolidation Status

**Status (2026-04-29 Nebulous Illuminating Satellite, deeper convergence pass)**:
**completed this handoff** — deep consolidation already executed in this
session arc (two stages); session-handoff is the closing capture edge.
Next session: consolidation gate is `not due` unless a fresh trigger
fires (per consolidate-docs trigger checklist).

Two-stage pass: (1) initial run sharpened doctrine
(knowledge-preservation absolute; shared-state always-commitable),
rotated napkin/repo-continuity, moved 3 stale plans, surfaced
ADR/PDR candidates; (2) owner-directed deeper run addressed all
outstanding audit findings, executed the practice-core-surface-
retirement plan in full, and elevated `gate-off-fix-gate-on` from
pattern-candidate to anti-pattern doctrine. Outcomes:

+ **Doctrine elevation**: new `.agent/rules/never-disable-checks.md`
  rule + `principles.md` §Code Quality amendment + register flip
  (anti-pattern, not pattern) + Cursor/.agents wrappers + RULES_INDEX
  entry.
+ **Practice Core retirement (4 phases complete)**: PDR-007 / PDR-024 /
  PDR-014 amendments; trinity / verification / index navigation
  updated; `.agent/practice-core/patterns/` and `.agent/practice-context/`
  directories deleted via `git rm`; `practice-context/outgoing/README.md`
  routing log salvaged to
  `archive/practice-context-routing-log-2026-04-29.md`; validators /
  scripts updated; portability + fitness + vocabulary checks green.
+ **Pattern graduations from experience-audit**: 4 strong patterns
  promoted (`tool-error-as-question`, `scope-as-goal`,
  `install-session-blind-to-cold-start-gaps`,
  `reframing-before-hardening`,
  `recital-loses-to-recipe-momentum`, `breadth-as-evasion`); 6
  medium patterns + 2 PDR-shaped + experience-corpus-backlog added
  to register.
+ **Displaced doctrine extraction (4 of 6 plans)**: build-tools-
  workspace-extraction trimmed; quality-gate-hardening cited new
  ADR-121 Change Log entry; multi-sink-vendor-independence-conformance
  cited new ADR-162 § Enforcement Principles; sentry-observability-
  translation-crosswalk archived after migrating tables to new
  `archive/superseded/README.md` + plan-supersession discipline
  graduated to consolidate-docs. Plans 2 (PDR creation) and 6
  (~700-line plan-body trim) deferred to register for owner
  direction.
+ **Lifecycle moves**: `mcp-local-startup-release-boundary` plan +
  evidence files archived; `depcruise-triage-and-remediation`
  archived; `temp-agent-collaboration-continuation.md` deleted;
  `gate-recovery-cadence` flagged as operational reference (kept in
  active/ to preserve rule citation).
+ **PR-90 thread registered**: `pr-90-build-fix-landing` in §Active
  Threads; Solar Threading Star authored the thread record at
  session open.
+ **Identity register normalised**: dual identity tables in
  `observability-sentry-otel.next-session.md` merged to single
  canonical additive register at top.
+ **Identity Candidates promoted**: 6 owner-identity assertions from
  `.remember/recent.md` graduated to `user-collaboration.md`
  §Owner Working Style.
+ **PDR amendments**: PDR-018 (tool-error-as-question + reviewer-
  scope-equals-prompted-scope), PDR-015 (brief reviewers with full
  merge-gate scope), PDR-026 (knowledge preservation absolute),
  PDR-007 / PDR-024 / PDR-014 (retirement-related), testing-strategy
  directive (behaviour-shape classification + e2e no-IO discipline).

Falsifiability: `pnpm practice:fitness:informational` SOFT-only
(0 critical, 0 hard, 18 soft); `pnpm practice:vocabulary` clean;
`pnpm portability:check` 12 commands / 36 skills / 44 rules passed;
`pnpm test:root-scripts` 115/115 passed.

Concurrent independent work: Pearly Swimming Atoll (codex)
operating on sector-engagement narrative refresh on
`practice-core/practice.md` + `practice-core/README.md`; coordinated
via comms event at 2026-04-29T15:50Z; my Phase 1 trinity edits were
sequenced to minimise overlap (mechanical refinement + retirement
amendments only; major prose refactors deferred per Pearly's
narrative claim).

Earlier 2026-04-28 / 2026-04-29 status entries archived to
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md).

### Pending-Graduations Register

Schema: `captured-date`, `source-surface`, `graduation-target`,
`trigger-condition`, `status`. `consolidate-docs` uses this as the live
queue. Graduated and merged history is preserved in git and the archived
continuity snapshots.

+ 2026-04-29; PR-90 closure session — `breadth-as-evasion.md` machine-local
  link refs; principle "No absolute paths" → "No machine-local paths" with
  three forbidden + three permitted shapes; new canonical rule
  `.agent/rules/no-machine-local-paths.md` with worked-example catalogue;
  thin adapters across `.claude/`, `.cursor/`, `.agents/`; `RULES_INDEX.md`
  updated; status: graduated 2026-04-29 (this session).
+ 2026-04-29; PR-90 closure session — `scripts/validate-*` family is
  structural drift relative to ADR-041 / §Separate-Framework-from-Consumer /
  owner-direction "complex-with-tests must live in workspace"; 4 parallel
  architecture reviewers convergent; future + executable plans authored
  ([`current/scripts-validator-family-workspace-migration.plan.md`](../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md));
  Phase 0 of the executable plan graduates the owner-direction rule to
  `.agent/rules/no-workspace-evading-scripts.md` and authors ADR delta or
  peer ADR via docs-adr-reviewer; trigger: owner directs Phase 0 OR third
  validator class accumulated; status: pending.
+ 2026-04-29; PR-90 closure session — `external-systems-shouldnt-be-the-
  first-detector` principle introduced by owner mid-session, drove Phases 4
  and 5 (TS-invocation gate + MD024 enable). Recursively useful (caught its
  own meta-instances via Cursor Bugbot napkin finding). PDR candidate to
  graduate the principle to canonical Practice doctrine; trigger: owner
  direction OR second session where the principle applies; status: pending.
+ 2026-04-29; PR-90 closure session — testing-strategy.md §Test Types named
  "validation scripts that require external resources should be standalone
  scripts, not tests" caught my Phase 4 misclassification (vitest-as-
  validator-harness). The principle is sound but lives in one paragraph;
  worth elaborating in `docs/engineering/testing-tdd-recipes.md` with the
  contrast pattern (validator script + helper unit tests vs integration test
  on real-FS repo state); trigger: second similar misclassification OR
  owner direction; status: pending.
+ 2026-04-29; PR-90 closure session — Vercel build emits 2 warning classes
  (pnpm `@humanfs/node` bin defect; 3 env vars not in `turbo.json`).
  Captured in
  [`future/vercel-build-warning-elimination.plan.md`](../../plans/architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md).
  Trigger: third warning class accumulates OR owner direction; status:
  pending (future plan).
+ 2026-04-29; doctrine sharpening on knowledge-preservation absolutism +
  shared-state always-commitable; surfaces graduated to napkin SKILL,
  consolidate-docs command, respect-active-agent-claims rule, distilled.md;
  status: graduated 2026-04-29 (this consolidation pass).
+ 2026-04-29; owner-requested PR lifecycle skill note;
  `.agent/skills/pr-lifecycle/SKILL.md` plus possible PDR amendment for
  gate-honest PR stewardship; trigger: first real PR shepherding run using
  the skill OR second repeated PR feedback / CI / Sonar / reviewer-wait
  friction instance; status: pending. Evidence:
  [`pr-lifecycle-skill.plan.md`](../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
+ 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second
  plugin-managed in-repo capture surface or owner direction; status:
  pending.
+ 2026-04-24; Sonar activation/backlog plan; pattern candidate
  `gate-off-fix-gate-on` — **REJECTED 2026-04-29 as anti-pattern,
  not pattern, per owner direction**. Quality gates are NEVER
  disabled. The framing was wrong from the outset: a plan whose
  phase-0 turns a gate off is the anti-pattern's exact phenotype.
  Doctrine elevated 2026-04-29 to:
  [`principles.md` §Code Quality](../../directives/principles.md#code-quality)
  amendment naming the anti-pattern,
  [`never-disable-checks.md`](../../rules/never-disable-checks.md)
  rule operationalising it; status: graduated 2026-04-29 as
  anti-pattern doctrine.
+ 2026-04-23; ADR-163 release/version boundary and vendor passthrough
  audit; trigger: observability-thread consolidation audit; status:
  pending-audit.
+ 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: pending.
+ 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: pending.
+ 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: pending.
+ 2026-04-26; workspace-first failure cluster; rule or
  recurrence-prevention amendment for workspace inventory before external
  tooling/new infra; trigger: second cross-session instance or owner
  direction; status: pending.
+ 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner
  direction; status: pending.
+ 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: pending.
+ 2026-04-26; WS3A closeout; protocol observability by consolidation
  audit before new visible surfaces; trigger: second protocol slice with
  the same shape or owner direction; status: pending.
+ 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`);
  future strategic plan candidate for promotion to `current/`; trigger:
  second instance OR owner direction; status: pending. Evidence + plan:
  agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md.
+ 2026-04-28; cross-thread comms event request/response correlation gap
  (no `audience`, no `in_response_to`, no TTL/escalation timer);
  minimal correlation primitive on the comms event schema as recommended
  first promotion slice; trigger: second silently-rotted cross-thread
  request OR owner direction; status: pending.
+ 2026-04-28; stance-staleness within a single conversation
  (parallel-agent state moves between forming a stance and reporting it);
  doctrine candidate for `agent-collaboration.md` and start-right
  skills; trigger: second instance OR owner direction; status: pending.
+ 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as MUST-FIX; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope`; trigger: second
  cross-session instance OR owner direction; status: pending.
+ 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to
  *first edit* rather than to thread join; trigger: owner-flagged AND
  named for separate investigation; status: pending. Cross-reference:
  [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
+ 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions);
  testing-strategy amendment to classify tests by behaviour shape, not
  by filename suffix; trigger: second observed instance OR owner
  direction; status: pending.
+ 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default); PDR candidate
  extracting the canonical contract from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform implementing a thin
  wrapper, OR owner direction; status: pending.
+ 2026-04-29; TypeScript 6 migration + workspace-script architectural
  rules; ADR candidate; status: graduated 2026-04-29 to ADR-168 (commit
  `dcd45776`).
+ 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass); pattern
  candidate or PDR amendment for "tool-error-as-question" meta-pattern;
  trigger: third surface OR owner direction; status: pending. Evidence:
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md).
+ 2026-04-29; scope-as-goal anti-pattern (treating instrumental work as
  terminal because the work-list was full; reviewer "GO WITH CONDITIONS"
  reading as green light when arc-scope ≠ branch-scope); pattern or
  PDR-018 amendment about reviewer-scope-equals-prompted-scope;
  trigger: second cross-session instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  session-end summary in
  [`archive/napkin-2026-04-29.md`](../active/archive/napkin-2026-04-29.md).
+ 2026-04-29; lockfile-corruption diagnosis discipline (read build log
  before extending speculation list; speculation lists are negative
  hypotheses, not narrowing tools); pattern candidate or distilled
  process entry; trigger: second instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  Surprise 1.
+ 2026-04-29; reviewer-scope-equals-prompted-scope (a reviewer's
  "GO WITH CONDITIONS" reads as green only if reviewer scope ≡ branch
  merge-gate scope; brief reviewers with full merge gate when
  gating merge); PDR-015 amendment OR new pattern; trigger: second
  cross-session instance OR owner direction; status: pending. Evidence:
  napkin 2026-04-29 Verdant Regrowing Pollen Surprise 4.
+ 2026-04-29; experience-audit emergent patterns (medium strength,
  ≥3 instances each, surfaced by 2026-04-29 deep consolidation pass);
  pattern candidates for promotion at second-instance OR owner
  direction; status: pending. Evidence: experience-audit report
  in 2026-04-29 deep consolidation closeout. Six candidates:
  + **silent-degradation-in-green-systems** — tests pass while
    running system is broken (tsx vs dist, characterisation tests
    that never ran, mapping promises a builder never delivers).
  + **plans-are-load-bearing-and-age** — plans encode world-state
    at authoring time and drift; mischaracterisations have the same
    structural risk as bugs.
  + **verify-the-premise-before-solving** — reviewer findings are
    hypotheses about the system, not facts; the fact lives in code.
    Pairs with `ground-before-framing`.
  + **complexity-cascade-feels-productive** — over-engineering
    feels like progress; the simple solution is invisible while in
    the spiral. Pairs with `workaround-gravity`.
  + **bridging-language-smuggles-old-shapes** — "deprecated notice",
    "follow-up", "compatibility layer", "stretch goal" perform
    preservation while preventing the new shape from existing.
  + **fix-the-producer-not-the-consumer** — when a consumer cannot
    use a type/function/structure correctly, the fix is in the
    producer; one template fix → 24 generated files cleaned.
+ 2026-04-29; doctrine-tests-itself-on-the-session-of-its-landing
  (the strongest test of a newly-authored rule is whether the
  session that authored it obeys it; corollary: install-session
  self-application is the acid test); PDR candidate (sibling of
  PDR-029 / install-session-blind-to-cold-start-gaps); trigger:
  owner direction (≥4 cross-session instances already documented);
  status: pending. Evidence: experience-audit report; instance
  patterns include 2026-04-22-the-rule-tested-itself,
  2026-04-21-the-recursive-session,
  2026-04-25-fresh-prince-the-protocol-applied-to-itself,
  2026-04-21-installing-a-tripwire-i-cannot-test.
+ 2026-04-29; open-up-the-value-early (when extra work closes a
  coordination gap that the surrounding decisions would otherwise
  ship with, the move is to open up that value within the current
  arc rather than ship the original arc and defer); PDR candidate
  (strategic test about composability of surrounding decisions,
  distinct from "do it now"); trigger: owner direction OR fourth
  cross-session instance; status: pending. Evidence: experience-
  audit report; instance patterns include
  2026-04-21-session-3-doctrine-bundle-opening-up-value-early
  (canonical naming), 2026-04-22-the-rule-tested-itself,
  2026-04-18-observability-as-principle.
+ 2026-04-29; sentry-observability-maximisation-mcp.plan.md displaced
  doctrine (build-vs-buy attestation + six metacognition guardrails);
  PDR creation candidate ("Build-vs-Buy Attestation as Plan Authoring
  Discipline"), plus ADR-163 §6 amendment to outcome-not-CLI form;
  trigger: owner direction (PDR creation needs explicit approval per
  PDR-003 care-and-consult posture); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep
  consolidation pass.
+ 2026-04-29; multi-agent-collaboration-protocol.plan.md concept-home
  refinement; doctrine has graduated to canonical surfaces
  (agent-collaboration directive, respect-active-agent-claims rule,
  distilled.md, consolidate-docs §7e, PDR-029 Family A.3); plan body
  still narrates the doctrine alongside execution status; the work is
  routing each section to its canonical home (or keeping it as
  plan-scoped substance), not a size-target trim — line count falls
  because duplication is removed; trigger: owner direction (preserves
  audit-trail role for WS5 evidence harvest); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep consolidation
  pass; child plan at
  [`multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md).
+ 2026-04-29; trinity Active Principles + bootstrap structural
  extensions for the five 2026-04-29 doctrine sharpenings (knowledge-
  preservation absolute, shared-state always-writable, tool-error-as-
  question, scope-as-goal, behaviour-shape testing classification);
  amendments queue for `practice.md` §Philosophy + Collaboration,
  `practice-lineage.md` Active Principles, `practice-bootstrap.md`
  §Napkin + §Sub-agents, `practice-verification.md` shared-state
  smoke-test addition; trigger: owner direction (per PDR-003 care-
  and-consult; sub-agent assessed as healthy-lag, not silent rot);
  status: pending. Evidence: trinity-drift sub-agent report from
  2026-04-29 deep consolidation pass.
+ 2026-04-30; substrate-vs-axis-plans convention + working principle
  "invent-justification-as-signal"; PDR candidate (Practice-governance
  shape: convention applies to any multi-axis plan collection — security,
  semantic-search, agentic-engineering — so the next Practice-bearing repo
  re-derives without it). Recorded as plan-collection component at
  [`templates/components/substrate-vs-axis-plans.md`](../../plans/templates/components/substrate-vs-axis-plans.md);
  first applied instance in observability collection's
  [`high-level-observability-plan.md §Substrate`](../../plans/observability/high-level-observability-plan.md);
  ADR-162 history entry records the trigger. Trigger: owner direction for
  PDR promotion OR second multi-axis collection adopting the substrate
  shape; status: pending. Evidence:
  [`observability-config-coherence.plan.md`](../../plans/observability/future/observability-config-coherence.plan.md)
  is the first applied substrate plan; the convention component captures
  the criterion + working principle.
+ 2026-04-29; pre-2026-02-15 experience corpus extraction backlog
  (~80 files dating from 2025-01 through 2026-02-15 contain
  inline doctrine, code blocks, principle catalogues that displace
  the subjective register; healthy post-2026-02-15 corpus shows
  the audit discipline now works as intended); one-time extraction
  task; trigger: owner direction; status: pending. Evidence:
  experience-audit report. Recommended extraction approach:
  preserve subjective texture, strip technical content, link to
  canonical homes; group by similar source files (phase-* cluster,
  2025-01 cluster, 2025-08 cluster) for batch processing.

Older graduated entries (PDR-018, PDR-026, PDR-029, PDR-033, PDR-034,
ADR-153, ADR-164, etc.) are preserved in
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md)
and earlier archive files for full audit trail.
