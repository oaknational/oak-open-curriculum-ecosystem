---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-10 — Stormbound Floating Current / `claude` /
opus-4.7 / `ea1cbe`, Phase 1B closeout extended scope)**: completed the
sub-agent rename + skill integration plan's Phase 1B end-to-end. Three
commits landed on `feat/mcp-graph-support-foundation`: `ae36670a`
(cleanup — 24 standalone-skill dirs deleted across canonical + Claude +
Agents jc-* surfaces, 8 `Skill()` permissions removed,
`mcp-expert/installation-and-integration.md` companion deleted),
`c31eb492` (reviewer follow-ups — plan-drift fix + dead Style Dictionary
URL fix), `249600f1` (owner-directed pull-forward of Phase 2 trigger
surface — 37 invoke-rule renames across 5 surfaces with body updates,
gateway routing rule + executive memory renamed `invoke-code-reviewers`
→ `invoke-code-experts`, plus 5 immediate-broken-pointer cross-reference
fixes in AGENT.md / executive README / practice-index / `.codex/README`
/ `RULES_INDEX.md`). Phase 1B reviewer matrix dispatched (4
cross-cutting + 5 domain): 2 CLEAN, 7 WARNINGS — convergent finding from
3 reviewers about broken invoke-rule trigger surface drove the
extended-scope commit. Latent issues remain queued: ADR-146 area-count
drift (6 vs 7), ADR filename retention for 146/149, ~590 cross-repo
prose references in non-rule docs (Phase 2 sweep). **Next safe step**:
the Phase 2 cross-repo `*-reviewer` → `*-expert` reference sweep is the
next agentic-engineering lane (~590 sites, mostly mechanical prose
edits in `docs/`, `.cursor/plans/`, `.agent/plans/`, `.agent/memory/`,
governance docs); sub-agent template self-references in
`subagent-architect.md` and `code-expert.md` are equal-priority sites.

**Session close (2026-05-10 — Sylvan Sprouting Grove / `codex` / GPT-5 /
`019e12`, deep consolidate-docs + `/jc-session-handoff`)**: completed the
owner-requested deep consolidation pass. Safe landed state: archived the active
napkin to `archive/napkin-2026-05-10.md`, distilled the 2026-05-10 lessons,
started a fresh `napkin.md`, and closed the read-oriented consolidation claim.
Validation passed: targeted markdownlint/prettier, vocabulary, and
collaboration-state checks. Fitness after rotation: `napkin.md` is healthy;
`repo-continuity.md` remains hard. **Next safe step**: Windswept Sweeping Gale
owns the live insight-report plan/pattern/pending-graduations lane; the next
unclaimed consolidation lane is targeted repo-continuity archive/current-state
reconciliation for the remaining hard signal and stale current-state text.

**Session close (2026-05-10 — Oceanic Lapping Lighthouse / `claude-code` /
opus-4.7 / `5765c7`, claude-insight-report disposition plan landed in
`current/`)**: authored
`.agent/plans/agentic-engineering-enhancements/current/claude-insight-report-2026-05-10-disposition.plan.md`
(471 lines, 33 KB) covering each of the 30 useful-content items mined from
the gitignored 2026-05-10 Claude insight report at
`.agent/reference-local/claude-insight-reports/2026-05-10-full-corpus/`.
Disposition tally: 2 INTEGRATE · 1 VERIFY-INTEGRATE · 7 CANDIDATE · 20
DISCARD = 30 items, each row carrying a documented rationale so future
regenerations of the same report do not re-pose them. Validation passed:
`pnpm exec markdownlint`, `pnpm exec prettier --check`,
`pnpm practice:fitness:informational` (new file not flagged), and
`pnpm agent-tools:collaboration-state -- check`. Plan file is staged as
untracked; no commit this session per owner direction (next session
implements). Active claim `1b1648a5` closed at handoff. **Next safe step**:
the next session opens the plan and executes Phase 0 (audit confirmation)
then Phase 1 (single net-new pattern file
`.agent/memory/active/patterns/owner-course-correct-vocabulary.md`).

**Session close (2026-05-10 — Gilded Eclipsing Meteor / `codex` / GPT-5 /
`019e12`, ADR coverage sweep landed)**: completed the owner-requested serious
ADR coverage review with docs-adr-expert planning and review. Landed ADR-174
(dependency vulnerability scanning quality gate) and ADR-175 (external
evidence corpus freshness governance), refreshed ADR indexes, and amended
recent auth, security/redaction, quality-gate, Elastic/search, observability,
Sentry, and agent-practice ADR coverage. Follow-up commits absorbed the docs
specialist review: HTTP MCP operator docs again reflect live `SENTRY_MODE`
runtime behaviour while `OBSERVABILITY_SINKS` / `OBSERVABILITY_FIXTURES` remain
target follow-through; ADR-162 is Proposed; ADR-125 command retirement is
transition wording until cleanup completes; OAuth JWT/JWKS text is labelled
historical for the current Clerk opaque-token flow. Validation passed:
`git diff --check`, `pnpm markdownlint-check:root`, and
`pnpm format-check:root`. **Next safe step**: no ADR-sweep follow-up remains
open; continue the branch-primary graph lane with the Oak Ontology Threads
proof in `graph-corpus-sdk`, and coordinate with the still-active
agentic-engineering claims before touching expert-integration surfaces.

**Session close (2026-05-10 — Foamy Navigating Hull / `codex` / GPT-5 /
`019e12`, graph MVP plan amendment + handoff)**: amended the graph MVP plan
estate so the first executable graph work is explicit:
`graph-stack.plan.md` now names the Oak Ontology Threads proof in
`graph-corpus-sdk` as `first_graph_work` and as the first task in Increment 1
(`curric:Thread` enumeration + inverse `curric:includesThread` Unit lookup
with a tiny fixture-backed test). Owner clarified the boundary: the MVP still
needs EEF + misconception graph + cross-source value; the restriction is that
the Oak Ontology repo intake must bring in only the Oak ontology/graph, not
the NC graph/taxonomy. Six specialist sub-agents reviewed the plan estate;
valid findings were absorbed into plan text around Inc.1 Thread lookup gates,
MCP registration surfaces, response-budget/test-shape wording, stale links,
and NC boundary routing. Targeted checks passed:
`markdownlint`, `prettier --check`, and `git diff --check` on the amended plan
files. **Next safe step**: start graph MVP work with the Oak Ontology Threads
proof in `graph-corpus-sdk`; do not start NC taxonomy work, EEF adapter
migration, misconception replatform, cross-corpus joins, serving prototypes, or
broader query-layer migration before that proof lands.

**Session close (2026-05-10 — Salty Rolling Compass / `codex` / GPT-5 /
`019e12`, final handoff after commit safety sweep)**: earlier in this session
the owner-requested commit sweep made in-flight state durable in
`57de914f`, `1cc83d62`, and `b96b7e48`; later commits `16c10cea` and
`31a2a9e1` completed the remaining Phase 1B expert content/adaptor merges,
and `c9c88cbb` landed graph thread handoff state. Current working tree now
carries uncommitted Phase 1B cleanup work: the standalone canonical expert
skills and generated `jc-*` skill adapters are deleted, matching `Skill()`
permissions are removed from `.claude/settings.json`, and the active plan is
updated to show Phase 1B.1 plus cleanup complete in-tree. **Next safe step**:
coordinate with Stormbound Floating Current's Phase 1B claims, including fresh
cleanup `git:index/head` claim `02faf64f`, validate and land the cleanup
bundle under that lane, then run the planned Phase 1B reviewer dispatch before
starting Phase 2's cross-repo reference sweep.

**Session close (2026-05-10 — Open Lifting Gale / `cursor` /
GPT-5.5 / `e4ad13`, agent-tooling friction closeout Workstream 1
completed in working tree)**: implemented the shared
`collaboration-state` CLI discoverability slice from
`.agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md`.
Workstream 1 covers F-01, F-02, F-04, F-09 for `collaboration-state`,
F-12, and F-13: invalid-option errors include command help; `claims
close` accepts/conflict-checks `--closure-summary`; `claims open`
enumerates accepted area kinds; `comms send` help names identity seed
sources and success output is structured JSON with resolved paths;
README/register evidence updated. Focused validation passed
(`vitest` collaboration-state unit suite, agent-tools type-check, lint,
markdownlint, prettier check, collaboration-state consistency check).
Specialist reviewers (`code-expert`, `test-expert`, `docs-adr-expert`)
returned CLEAN after first-pass findings were absorbed. Claim
`d7a76b78-8245-436a-8955-3f7e3a8ba305` was explicitly closed; active
claims are empty at handoff. **No commit this session** per owner
boundary. **Next safe step**: continue the same closeout plan with
Workstream 2 (`comms list/show` and `claims list` filters) after fresh
status/diff/collaboration preflight and a new exact file claim.

**Session close (2026-05-10 — Stratospheric Sweeping Plume /
`claude-code` / Opus 4.7 / `c8dd27`, practice.md examination opened —
framing failure surfaced; owner ended thread)**: opened the practice.md
examination lane per Woodland Growing Leaf's session-close direction.
After reading the trinity + `practice-verification.md` + PDR-003 +
PDR-026 + ADR-144, surfaced shape options to owner. Options were framed
in optimisation vocabulary ("contractions", bulleted line-and-char
savings), violating PDR-003 §Decision-2 ("consolidation is curation,
not optimisation"). Owner ended the thread before any practice.md
mutation. **No commits this session.** No reviewer dispatch (examination-
only). No claim registered. The pre-existing HARD char pressure on
`practice.md` persists; the §Open Owner-Decision Items item 1 stays
open with sharpened next-attempt criteria captured in the thread
record. **Next safe step**: re-attempt practice.md examination in a
fresh session that holds the curation frame from session-open;
entry criteria are the four falsifiability checks recorded in
[`agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md)
under the 2026-05-10 Stratospheric Sweeping Plume session record.

**Session close (2026-05-10 — Woodland Growing Leaf / `claude-code` /
Opus 4.7 / `0844d9`, repo-continuity archive plan executed
end-to-end)**: landed all four commits of
`repo-continuity-archive-and-invariants-role.plan.md` on
`feat/mcp-graph-support-foundation`: `d981b2b3` (Group A — directive
foreign-stage cure named in `agent-collaboration.md` §c + plan
landing), `6d7d5ee3` (Phase 1 — archive sweep, live file 555 → 270
lines, 13 session-close blocks + 9 Deep-Consolidation entries archived
verbatim per PDR-026), `09b513ae` (Phase 2 — owner chose Option A;
§Repo-Wide Invariants role-justified with all 12 canonical-home
cross-references), `c3061935` (plan archived current/ →
archive/completed/ per ADR-117). Inter-agent comms-event coordination
with Riverine Drifting Lighthouse cleanly resolved a brief Phase 2
markdownlint blockage (`9344adf1` → `05ccefb8` → `5bff4178`). The
foreign-stage cure operated on every commit of this session — the cure
named at the directive layer applied to every commit landing it.
**Next safe step**: unchanged — graph MVP work + PR #102 merge prep on
`connecting-oak-resources`.

**Session close (2026-05-10 — Velvet Creeping Mask / `codex` / GPT-5 /
`019e11`, onboarding entrypoint remediation)**: landed the owner-requested
follow-up to the onboarding-reviewer audit. Root README, CONTRIBUTING,
environment/troubleshooting/build docs, start-right shared workflows,
agent directive links, and related search/governance docs now reflect
per-workspace `.env.local` setup, retired root smoke tests, canonical
skill links, current start-right invocation language, and explicit
pathspec staging guidance. Validation before handoff: `pnpm
markdownlint:root`, `pnpm format:root`, targeted stale-reference scan,
canonical-link check, and `git diff --check`. **Next safe step**:
unchanged for branch-primary work — continue the graph/agent-tooling
lane below; onboarding entrypoint remediation has no open follow-up in
this continuity file.

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
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Stormbound Floating Current / `claude` / opus-4.7 / `ea1cbe` / 2026-05-10 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Foamy Navigating Hull / `codex` / GPT-5 / `019e12` / 2026-05-10 |
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

**Latest focus (2026-05-10 — Sylvan Sprouting Grove handoff)**:
owner-requested deep consolidation has completed. The active napkin was rotated
and the useful 2026-05-10 lessons were distilled. Windswept's claimed
insight-report implementation lane remains active; `repo-continuity.md` is the
next unclaimed hard-fitness remediation lane.

**Latest focus (2026-05-10 — Salty Rolling Compass final handoff)**:
handoff surfaces now reflect the real post-commit state: Phase 1B expert
content merges are 8/8 landed, cleanup deletions and permission removals are
in the working tree under Stormbound Floating Current's cleanup commit lane,
and reviewer dispatch remains pending after cleanup validation/commit.
Branch-primary graph focus remains the Oak Ontology Threads proof below.

**Prior focus (2026-05-10 — Gilded Eclipsing Meteor)**: ADR coverage sweep is
complete and landed. The branch-primary graph focus below is unchanged; this
session's distinct focus closed the ADR/documentation gap review and left no
Gilded ADR claims active.

**Latest focus (2026-05-10 — Foamy Navigating Hull)**: graph MVP plan
amendment/handoff complete. Branch-primary graph MVP focus is now explicit:
the first graph work is the Oak Ontology Threads proof in `graph-corpus-sdk`
(`curric:Thread` enumeration + inverse `curric:includesThread` Unit lookup
with a tiny fixture-backed test). EEF + misconception graph + cross-source
value remain core MVP scope; NC graph/taxonomy work is excluded from the MVP
and requires separate owner promotion. **Deferred**: monorepo topology ADR /
stage-matrix work (strategic plan remains in `future/` until re-opened).

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

**Role**: curated branch-relevant session-resume card. Each invariant
below has a canonical home in directives, rules, ADRs, or PDRs (cited
inline); the curation here is the value — at session resume an agent
gets the branch-relevant subset without reading every directive.
Drift is mitigated by the cross-references and consolidate-docs
sweeps; canonical homes always win on conflict.

- no compatibility layers; replace, do not bridge —
  [`replace-dont-bridge`](../../rules/replace-dont-bridge.md);
- distinct architectural layers live in distinct workspaces;
  folders/modules inside one workspace do not satisfy layer separation —
  [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  - [`principles.md`](../../directives/principles.md);
- TDD at all levels —
  [`tdd-as-design.md`](../../directives/tdd-as-design.md);
- tests prove product behaviour, not configuration or file presence —
  [`testing-strategy.md`](../../directives/testing-strategy.md);
- strict boundary validation only —
  [`strict-validation-at-boundary`](../../rules/strict-validation-at-boundary.md);
- no `process.env` read/write in test files or setup files —
  [`no-global-state-in-tests`](../../rules/no-global-state-in-tests.md);
- `--no-verify` requires fresh per-invocation owner authorisation —
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md);
- no warning toleration —
  [`no-warning-toleration`](../../rules/no-warning-toleration.md);
- owner direction beats plan —
  [`AGENT.md`](../../directives/AGENT.md) +
  [`directive-file-context-budget`](../../rules/directive-file-context-budget.md);
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK, not direct Hasura/materialised views —
  [`principles.md`](../../directives/principles.md) (branch-direction
  invariant; no ADR home yet);
- **knowledge preservation is absolute** — writing to shared-state
  knowledge surfaces is never blocked by fitness limits —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
- **shared-state files are always writable and always commit-includable**
  regardless of any active claim (deliberate anti-log-jam tradeoff) —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  - [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).

Current branch non-goals:

- do not implement intent-to-commit as claim metadata only; owner direction
requires an explicit minimal queue mechanic;
- do not reopen broader canonicalisation opportunistically;
- do not treat monitor setup or owner-handled preview validation as in-repo
acceptance work;
- do not guess Vercel, Sentry, or GitHub state before checking primary
evidence.

## Next Safe Step

**Status update (2026-05-10 — Stormbound Floating Current close)**: the
sub-agent rename + skill integration plan's Phase 1B is fully closed
(3 commits this session: `ae36670a` cleanup, `c31eb492` follow-ups,
`249600f1` extended-scope rule rename). The next agentic-engineering
lane is **Phase 2 — cross-repo `*-reviewer` → `*-expert` sweep**: ~590
mechanical prose edits across `docs/foundation/`,
`docs/architecture/architectural-decisions/`, `docs/governance/`,
`.cursor/plans/`, `.agent/plans/`, `.agent/memory/` non-rule docs,
plus equal-priority self-reference cleanup inside
`.agent/sub-agents/templates/subagent-architect.md` and
`.agent/sub-agents/templates/code-expert.md` gateway routing tables.
ADR filenames for 146 and 149 are owner-decision (filename retention
vs rename); ADR-146 area-count drift (6 vs 7 — Build-vs-buy promoted
to area #1 by template but not yet by ADR body) is a separate
doc-drift item. The owning plan
`.agent/plans/agent-tooling/current/sub-agent-rename-and-skill-integration.plan.md`
§Phase 2 is the canonical scope reference.

**Status update (2026-05-10 — Sylvan Sprouting Grove close)**:
the deep consolidate-docs pass is complete. Immediate active work remains with
Windswept Sweeping Gale's insight-report plan/pattern/pending-graduations
claim. The next unclaimed consolidation lane is targeted `repo-continuity.md`
hard-fitness remediation: archive historical closeout blocks and reconcile
stale current-state text with the live `feat/mcp-graph-support-foundation`
branch state.

**Status update (2026-05-10 — Gilded Eclipsing Meteor close)**:
the ADR coverage sweep is complete; ADR-174/175 and the related amendments are
landed, reviewed, and validated. No ADR-sweep follow-up is open. The next safe
step for branch-primary work remains the graph MVP Inc.1 Threads proof below.
For agentic-engineering work, coordinate with the active claims owned by
Stormbound Floating Current and Oceanic Lapping Lighthouse before touching
their surfaces.

**Status update (2026-05-10 — Foamy Navigating Hull close)**:
the graph MVP plan estate is amended and the first graph task is explicit.
Next session on the branch-primary graph lane starts by landing the Oak
Ontology Threads proof in `graph-corpus-sdk`: enumerate `curric:Thread` and
resolve inverse `curric:includesThread` Unit lookup through the substrate with
a tiny fixture-backed test. Do not begin NC taxonomy work. Do not begin EEF
adapter migration, misconception replatform, cross-corpus joins, serving
prototypes, or broader query-layer migration before that proof lands.

**Status update (2026-05-10 — Salty Rolling Compass final handoff)**:
the sub-agent rename / skill-integration lane is no longer waiting on
`react-component-expert`: all eight paired expert content/adaptor merges have
landed. The working tree currently carries the Phase 1B cleanup bundle
(standalone skill deletions, generated `jc-*` skill adapter deletions,
`.claude/settings.json` permission removals, and plan/continuity updates).
Next safe step for agentic-engineering work is to coordinate with Stormbound
Floating Current's active file claim and fresh cleanup `git:index/head` claim
`02faf64f`, validate and land that cleanup bundle, then run the planned Phase
1B reviewer dispatch before any Phase 2 sweep.

**Prior status (2026-05-10 — Open Lifting Gale close)**:
Workstream 1 of the agent-tooling friction closeout is complete and now
landed in commit `05adba87`. Workstream 2 from
`.agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md`
remains a later lane if the owner resumes that closeout.

**Status update (2026-05-10 — Stratospheric Sweeping Plume close)**:
the practice.md examination lane was opened this session; an agent
framing failure surfaced (treated curation as optimisation in
vocabulary; PDR-003 §Decision-2 violation surfaced via the words
"contractions" and bulleted line-savings). Owner ended the thread
before any Core mutation. The pre-existing HARD char pressure on
`practice.md` (31,870 / 30,500 at session close) persists. This
session counts as one re-attempt of the examination, not as a
"deferred" outcome under PDR-026 deferral-honesty.

**Re-attempt entry criteria** (per the falsifiability captured in the
thread record): the next session re-attempting this examination MUST
(a) read the trinity + `practice-verification.md` at session-open
before any analysis, (b) lead any surfacing with role-questions per
section ("does this section still serve its role in the WHAT-
blueprint?") rather than size measurement, (c) present candidate
shapes as role-justifications with sizing as at most a parenthetical,
and (d) carry no instance of the words "contraction", "trim",
"reduction", or "savings" framing the work. If those tokens appear,
the re-attempt has not held the frame.

**Controlling governance** (do not re-derive next session): PDR-003
§Decision-2 ("consolidation is curation, not optimisation") is the
discipline that failed this session; PDR-026 substance-preservation
overrides fitness pressure; ADR-144 Key Principle 4 makes
`fitness_char_limit` change owner-only; ADR-144 Key Principle 2
forbids raising thresholds to track content drift. No new doctrine
to author — the diagnosis is "agent failed to hold PDR-003 while
surfacing", a pattern-instance candidate
(`read-doctrine-without-holding-frame`).

Branch-primary lane state for `planning/graph-tooling` continues
beneath this examination; the Practice Core lane and the graph MVP
lane remain parallel, not sequential.

**Clear PR #102 merge blocker** (parallel lane):

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
   **Status (2026-05-10 — Stratospheric Sweeping Plume close)**:
   examination lane was opened and re-attempted once this session;
   agent framing failure (curation-vs-optimisation vocabulary;
   PDR-003 §Decision-2 violation) caused owner to end the thread
   before any Core mutation. Item remains active. Re-attempt entry
   criteria captured in §Next Safe Step and the agentic-engineering-
   enhancements thread record. Pre-existing HARD signal persists at
   31,870 / 30,500 chars.
2. The pending-graduations queue remains SOFT and is intentionally calibrated
   for consolidation-pass access rhythm. Continue draining due entries in
   dedicated consolidation sessions.
3. Future doctor arcs are separate owner-choice lanes: repair mode and
   consolidation integration.
4. **Monorepo workspace topology** (superseding ADR-108, **S0–S6** strategic
   plan): **parked** until after the graph MVP implementation tranche; the
   candidate remains in `pending-graduations.md` for a later drafting slot.

## Deep Consolidation Status

**Status (2026-05-10 Stormbound Floating Current, claude, opus-4.7,
`ea1cbe`, sub-agent rename + skill integration Phase 1B closeout):
`due — plan-closure trigger fires (Phase 1B fully closed in 3 commits:
ae36670a + c31eb492 + 249600f1). 9-reviewer dispatch returned 2 CLEAN
and 7 WARNINGS; convergent finding from 3 reviewers drove the
extended-scope commit and is now resolved. Not well-bounded for this
closeout: the user explicitly flagged the session as over-running,
~590-site Phase 2 sweep is the next agentic-engineering lane, and
existing fitness/consolidation pressure (Sylvan's prior pass already
cleared napkin) remains routed but not zero. Future consolidation
should mine the convergent-reviewer-finding pattern (3 independent
reviewers surfacing the same trigger-surface break) and the
ADR-146-area-count drift as documentation-integrity captures`.**

**Status (2026-05-10 Sylvan Sprouting Grove, codex, GPT-5, `019e12`,
deep consolidate-docs pass + handoff): `completed this handoff — owner
explicitly requested the deeper loop. Completed safe curation work under fresh
peer claims: napkin rotation, distilled update, active napkin restart, route
audit, entry-point sweep, vocabulary/collaboration checks, and strict-hard
verification. Remaining hard is routed: repo-continuity.md needs targeted
archive/current-state reconciliation, not reactive prose trimming`.**

**Status (2026-05-10 Gilded Eclipsing Meteor, codex, GPT-5, `019e12`,
ADR coverage sweep landed): `due — a broad ADR sweep created two new ADRs,
amended multiple existing ADR families, and produced a fresh napkin capture
about target-architecture wording over-claiming consuming-runtime state. Not
well-bounded for this lightweight handoff: the sweep already graduated the
settled decisions into ADRs/permanent docs, while existing graph and
agentic-engineering consolidation pressure remains active. Future
consolidation should mine the over-claiming pattern alongside other
documentation-integrity captures rather than reopen the ADR sweep itself`.**

**Status (2026-05-10 Foamy Navigating Hull, codex, GPT-5, `019e12`,
graph MVP plan amendment + handoff): `due — owner correction plus six
specialist reviews changed the graph MVP plan estate and produced a fresh
napkin capture about scope-boundary drift and the corrected interpretation.
Not well-bounded for this lightweight handoff: graph MVP execution is now
poised to start, existing repo fitness/consolidation pressure remains, and
the next action is implementation of the Inc.1 Threads proof rather than a
thread-scoped doctrine consolidation pass. Future consolidation should mine
the plan-boundary drift pattern after the graph MVP lane has a stable first
implementation slice`.**

**Status (2026-05-10 Salty Rolling Compass, codex, GPT-5, `019e12`,
final handoff after commit safety sweep): `due — the session made dirty
in-flight state durable, Phase 1B expert integration reached 8/8 content
merges, and current in-tree cleanup removes the redundant standalone skill
surface. Not well-bounded for this lightweight handoff: active napkin.md is
critical, prior due consolidation pressure remains, and the cleanup bundle
still needs validation/commit plus reviewer dispatch. Next deliberate
consolidation should mine the commit-queue claim-preservation surprise and
route the accumulated napkin fitness pressure without trimming capture
substance`.**

**Status (2026-05-10 Open Lifting Gale, cursor, GPT-5.5, `e4ad13`,
agent-tooling friction closeout Workstream 1 completed in working
tree): `due — Workstream 1 milestone closed and a fresh napkin
behaviour change was captured after the no-real-IO test review loop.
Not well-bounded for this lightweight handoff: the closeout plan still
has Workstreams 2-5 open, the work is intentionally uncommitted by
owner boundary, and existing repo fitness/consolidation pressure
remains a separate lane. Future consolidation should mine the Workstream
1 review loop after landing or at a deliberate closeout point, not
during this session handoff`.**

**Status (2026-05-10 Stratospheric Sweeping Plume, claude-code, Opus 4.7,
`c8dd27`, practice.md examination opened — framing failure surfaced;
owner ended thread): `not due from this session's work — bounded
examination session with no commit, no plan closure, no graduation
trigger. One napkin entry captured the framing failure (substance
preserved per PDR-026; vocabulary intact per the curation discipline
that failed). One pattern-instance candidate identified
(read-doctrine-without-holding-frame); routed to the napkin entry
itself rather than to pending-graduations because PDR-003 §Decision-2
already names the underlying doctrine — the diagnosis is agent
capacity, not doctrine absence. Cumulative consolidation pressure
from prior sessions remains in the same "due" state Woodland Growing
Leaf recorded; this session does not change that state. Carry-forward
load for the next consolidation: napkin past line + char hard limits,
practice.md remains HARD on chars (now load-bearing for
next-attempt entry criteria, not just file-size), pending-graduations
register state from prior sessions`.**

**Status (2026-05-10 Woodland Growing Leaf, claude-code, Opus 4.7,
`0844d9`, repo-continuity archive plan executed end-to-end): `due —
plan closure trigger fires (4 commits archived a current-lifecycle
plan: d981b2b3, 6d7d5ee3, 09b513ae, c3061935). Three napkin findings
captured this session (cure-operated-under-itself, whole-tree-gate-vs-
pathspec-isolation, plan-target-arithmetic-drifts-in-concurrent-flow);
none rise to single-instance ADR/PDR but the first is a candidate for
the second-instance graduation watch. Not well-bounded for this
closeout: napkin is HARD (331/300) from concurrent-agent flow,
pending-graduations is at 2339/2000 SOFT, and pattern extraction +
napkin rotation + register drain is substantial work. Next session
picks up deliberately per session-handoff step 10's
not-well-bounded-this-closeout branch`.**

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
`not due` and stands. Velvet Creeping Mask's 2026-05-10 onboarding
entrypoint remediation marks consolidation due: the bounded docs
correction itself closed cleanly, but the session-close fitness
pre-screen shows `napkin.md` HARD and `practice.md` still HARD. This
is not well-bounded for the owner-requested commit closeout, so a later
consolidation pass should route the fitness pressure without trimming
capture substance.**

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
