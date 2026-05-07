---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-07 — Lush Rustling Bark / `codex` /
`GPT-5` / `019e03`, PR #102 follow-up + lint hardening)**:
completed the owner-directed PR #102 comment harvest before editing, found two
new live Copilot threads after `e8050400`, and fixed them narrowly in
`branch-touched-files`: positional branch/ref is now exclusive with
`--head`/`--branch`, `--branch` and `--git` are documented, repo-root
resolution uses the CLI cwd, and explicit Git overrides must be absolute paths
to an executable named `git`. The same closeout replaced deprecated
`typescript-eslint.config()` calls in the Oak ESLint configs with ESLint core
`defineConfig()`, preserved the local `@oaknational` plugin at the typed config
boundary, accepted the owner's additional candidate-rule activation, cleared
the resulting single-call lint findings, and re-ran `pnpm lint` successfully.

**Session close (2026-05-07 — Twigged Shedding Fern / `codex` /
`GPT-5` / `019e03`, PR #102 snagging)**:
implemented and pushed the narrow PR #102 snagging pass on
`planning/graph-tooling` as `e8050400`. The pass fixed the three
graph-layer taxonomy comments, the primitive-wording comment, the
branch-touched-files parser index issue, and the Git subprocess-boundary
hotspots. Local focused gates, `pnpm check`, pre-commit hooks, pre-push
hooks, GitHub checks, and SonarCloud are green. Sonar PR quality gate is
`OK` with zero open issues and zero `TO_REVIEW` hotspots. The four known
Copilot review threads are obsolete/outdated on the new head, but the
owner-directed next session must still fetch remaining PR #102 comments and
review threads before editing, then analyse whether any live reviewer
comments remain.

**Session close (2026-05-07 — Silvered Masking Moth / `codex` /
`GPT-5` / `019e03`, Doctor safe-merge gate implemented)**:
completed the memory/state substrate doctor safe-merge gate. Starting from
`bc56562c` on `fix/sonar-fixes-20260506`, the session reviewed `44c73e4d`,
normalised the closed-claims archive and two conversation files to satisfy the
collaboration schemas without deleting historical evidence, added strict mode
to the built `agent-tools` substrate CLI, added the root
`practice:substrate:check` alias through built output, refreshed the generated
shared comms log, and archived the doctor plan. Report mode now returns
`ok: true` with `blocking: 0`; strict mode returns `0` on the clean live
substrate. Follow-up owner direction deleted the whole legacy collaboration
comms tree and removed it from the live manifest/read-model header. The
requested `code-reviewer` pass found stale
live references and too-narrow retired-root scanning; those findings are fixed.
Repair mode, `--apply`, `--dry-run`, and consolidation integration remain
future arcs.

Historical session summaries and old next-safe-step queues moved to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md).

**Session close (2026-05-07 — Breezy Navigating Sail / `cursor` /
`claude-opus-4.7` / `9edbd1`, graph MVP-arc planning)**:
closed the `connecting-oak-resources` graph MVP-arc PLANNING arc in one
session per owner direction. Six commits landed the spine remediation, reviewer
pass, three slice plans, BLOCKER remediation, owner-decision log, and refreshed
thread handoff. Remaining execution-prep work is deliberately planning-only:
absorb topology BLOCKERs into `graph-stack.plan.md` + ADR-173, absorb four
Phase 4 findings into the slice plans, owner-resolve the EEF t19 contradiction,
and verify decision-complete state. Slice execution, graph-stack ACTIVE
promotion, and ADR-173 ratification remain out of scope for this branch.

## Current State

+ Branch `planning/graph-tooling` is in closeout for the PR #102 follow-up
  after `e8050400`.
+ PR #102 comment harvest after `e8050400` found two new live Copilot
  branch-touched-files threads. Both have local fixes with focused tests.
+ Root `pnpm lint` passes after replacing deprecated ESLint config helper usage
  and clearing the resulting single-call lint findings.
+ No active collaboration claims remain. The advisory commit queue only contains
  stale/abandoned historical entries.
+ Residual Practice fitness pressure is routed, not hidden: `practice.md`
  remains HARD on character count and needs an owner-approved Core edit or
  threshold decision before a strict-hard fitness gate can be clean.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Twilit -> Ashen / `claude-code` / `7cf730` / 2026-05-05 |
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Lush / `codex` / `019e03` / 2026-05-07 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Lush / `codex` / `019e03` / 2026-05-07 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Windward / `cursor` / `dd084d` / 2026-05-07 |

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

**2026-05-07 (PR #102 post-snagging follow-up + lint hardening)**:
close out and push the remaining PR #102 live-review-thread fixes plus the
root lint remediation requested by the owner.

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
+ curriculum data in this monorepo comes only through the published Oak Open
Curriculum HTTP API and generated SDK, not direct Hasura/materialised views;
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

**After this closeout is pushed**: re-check PR #102 comments/review threads,
GitHub checks, and Sonar PR state on the new head. If clean, continue to the
graph lane's planning decision-completeness closeout; if not clean, classify
remaining feedback before editing.

After that comment analysis, the graph lane's planning step remains
decision-completeness closeout, not slice execution: absorb the two topology
BLOCKERs into `graph-stack.plan.md` + ADR-173, absorb the four Phase 4 findings
into the slice plans, owner-resolve the EEF t19 contradiction, and verify the
full MVP plan reaches decision-complete state.

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

## Deep Consolidation Status

**Status (2026-05-07 Breezy Navigating Sail, cursor, claude-opus-4.7,
`9edbd1`, graph MVP-arc PLANNING closeout): `not due — capture-edge
planning closure; two owner-correction candidates already captured in
pending-graduations`.** Three additional napkin observations remain for future
consolidation: reviewer convergence can point to an upstream conceptual mistake;
owner-bounded reviewer scope may be another instance of over-broadening;
session-handoff JSON edits require agent mode.

**Status (2026-05-07 Silvered Masking Moth, codex, GPT-5, `019e03`,
owner-requested `jc-session-handoff` + `jc-consolidate-docs`):
`completed this handoff — explicit owner request triggered deep convergence`.**
Completed actions: active napkin rotated to
[napkin-2026-05-07-doctor-safe-merge.md](../active/archive/napkin-2026-05-07-doctor-safe-merge.md),
repo-continuity historical material archived to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md),
active-thread register compacted, and collaboration-state schema checks passed.
No new ADR/PDR was promoted: the memory/state doctrine already lives in
PDR-049, PDR-050, the local substrate contract, and the archived doctor plan.
Residual hard pressure on `practice.md` is routed to owner-approved Core
remediation rather than edited reactively.

**Status (2026-05-07 Twigged Shedding Fern, codex, GPT-5, `019e03`,
PR #102 snagging handoff): `not due — tactical PR snagging closure is already
recorded in the plan and checks; no new doctrine, ADR/PDR candidate, or
cross-session convergence work surfaced. Next session is evidence refresh and
PR comment analysis, not consolidation`.**

**Status (2026-05-07 Lush Rustling Bark, codex, GPT-5, `019e03`,
PR #102 follow-up + lint hardening handoff): `not due — the session produced
local code/config fixes, plan/continuity refresh, and a napkin tooling note;
no new ADR/PDR candidate or cross-session convergence trigger fired`.**
