---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-09 — `claude-code` / Opus 4.7 / `00dc26`, skills-standardisation plan re-issue)**:
landed PDR-051 (vendor-agnostic skills standardisation, portability-pure),
amended ADR-125 in place with the 2026-05-09 entry recording the two-surface
contract + retired `.cursor/skills/`/`.gemini/skills/`/`.codex/skills/`/
`.windsurf/skills/`, added friction F-16 to the agent-tooling register, and
authored a canonical repo plan at
[`agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](../../plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md).
Attempt 1 of the implementation failed by skipping TDD discipline (700 LOC
of unverified product code before any test); code was binned, plan moved to
[`archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md`](../../plans/agent-tooling/archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md)
with a Failure Note. The new plan embeds cycle-by-cycle TDD discipline,
WS0 mandatory pre-execution review by four specialist reviewers
(`assumptions-reviewer`, `test-reviewer`, `architecture-reviewer-fred`,
`docs-adr-reviewer`), a WS2.5 pre-migration plan-direction check, and
plan-direction reviews at every workstream boundary. **No commit in this
session.** **Next safe step**: open the new plan in the next session and
dispatch the WS0 four-reviewer parallel pass before any implementation.

**Session update (2026-05-09 — owner direction / `jc-session-handoff`)**:
next sessions **prioritise implementing graph MVP features** (per
`connecting-oak-resources` slice plans) **after** any remaining PR #102 merge
prep completes. The **monorepo workspace topology** programme
(`architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`,
superseding-ADR-108 candidate in `pending-graduations.md`) is **parked** —
no ADR drafting or topology execution until the owner returns to that arc
**after** the graph MVP implementation tranche.

**Session close (2026-05-09 — Fronded Bending Blossom / `cursor` /
Composer / `60775a`, workspace topology strategic planning)**:
refined
`.agent/plans/architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`
with pipeline stages **S0–S6** (replacing monolithic “codegen”), three
producer roles (primitive emitters / library authors / app consumers),
stage×workspace matrix with **multi-stage non-substrate packages** as
explicit triage signals, **substrate** (`core` first) participation tags,
and a metacognition delta; updated
`.agent/plans/architecture-and-infrastructure/future/README.md` plan index.
Capture: ADR candidate **supersedes ADR-108** (expansive topology, links
ADR-154) registered in `pending-graduations.md`. **Evidence**: working-tree
paths above; **no commit** in this session. **Branch-primary next step**
unchanged: PR #102 merge prep on `planning/graph-tooling` — see **Next safe
step** below. **Follow-on**: owner locks stage list; then draft ADR per
plan todos.

**Session close (2026-05-08 — Fronded Branching Grove / `codex` /
`GPT-5` / `019e06`, PR #102 final closeout + decision-complete session
planning)**:
closed the PR #102 technical merge blockers and then captured the owner's
pre-merge graph-planning requirement. PR #102 is green on
`a8ef3ad1be343d2b786416ce12dcfeca270fb56e`: GitHub merge state is `CLEAN`,
root `run-quality-gates`, CodeQL, SonarCloud Code Analysis, and Vercel passed;
Sonar MCP reports quality gate `OK`, `new_violations=0`, and zero open PR
issues; unresolved review threads are zero. Owner direction after that closeout:
do not merge until the graph plans are finalised and decision-complete. New
current plan:
[`2026-05-08-pr102-graph-decision-complete-closeout.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md).

**Session update (2026-05-08 — Opalescent Shimmering Orbit / `codex` /
`GPT-5` / `019e06`, PR #102 graph decision-complete closeout)**:
applied the latest owner discussion to the graph plan estate. EEF slice 1 is
structural-only for evaluation now: citation/data/caveat/freshness/MCP-shape
preservation is load-bearing; LLM/outcome evaluation is follow-on
infrastructure outside Vitest. Practice-facing graph tooling is now planned
under `agent-graphs/practice-graph/`, with
`agent-tooling/future/agent-graphs-workspace-organisation.plan.md` owning the
future top-level workspace organisation. Refreshed evidence on PR head
`309d9e5e44cebecb1be2478d2fb084a54f39b6b2`: GitHub checks pass; Sonar quality
gate is green through PR checks; branch touched files remain `107`, so
pre-merge divergence analysis is required. The `emit-index.ts` whitespace
thread was fixed in `2de81a4c` and resolved on GitHub. The only remaining
merge blocker recorded by this handoff is the final clean-worktree dry-run
merge/abort required by the 107-file branch scope; `.agent/plans/notes/` still
has unrelated local scratch state and is not part of the closeout.

**Session close (2026-05-08 — Lush Rustling Bark / `codex` /
`GPT-5` / `019e03`, PR #102 fresh-session handoff)**:
ran the owner-requested `jc-session-handoff` refresh for PR #102. Current PR
evidence is explicit: title/body are stale and must be rewritten against
`origin/main...HEAD`; PR head is `df66b742694d1bfdd757019c97414945540eabf5`;
the branch differs from `origin/main` by 93 files, 6595 insertions, and 770
deletions; GitHub merge state is `BLOCKED`; SonarCloud Code Analysis is
failing; Sonar PR quality gate is `ERROR` on four open issues and zero
`TO_REVIEW` hotspots; nine review threads remain unresolved, with graph
taxonomy/wording threads outdated-and-fixed, three fixed-but-undismissed live
threads, one schema docstring mismatch still live, and one PR metadata thread
still live. No implementation edits were made in this handoff.

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
Phase 4 findings into the slice plans, and resolve the EEF t19 contradiction.
That historical queue is superseded by the 2026-05-08 structural-only EEF
decision above. Slice execution, graph-stack ACTIVE promotion, and ADR-173
ratification remain out of scope for this branch.

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
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Solar Glimmering Eclipse / `claude-code` / Opus 4.7 / `00dc26` / 2026-05-09 |
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

**Status (2026-05-08 Lush Rustling Bark, codex, GPT-5, `019e03`,
PR #102 fresh-session handoff): `not due — owner requested a session-scoped
handoff/update of current PR/Sonar surfaces; no plan closed, no new doctrine or
ADR/PDR candidate surfaced, and the next work is tactical PR closeout`.**

**Status (2026-05-08 Opalescent Shimmering Orbit, codex, GPT-5, `019e06`,
PR #102 graph decision-complete closeout): `due — the PR #102 graph planning
closeout plan completed and pushed; run consolidate-docs after merge or in a
bounded follow-up to mine durable decisions/follow-ons without delaying the
merge blocker cleanup`.**

**Status (2026-05-09 Fronded Bending Blossom, cursor, Composer, `60775a`,
workspace topology plan refinement handoff): `not due — strategic plan and
register capture only; no plan closure, no napkin rotation, no new graduated
doctrine; ADR candidate appended to pending-graduations for drafting after
owner locks S0–S6`.**

**Status (2026-05-09 owner sequencing note, cursor handoff): `not due — owner
directed next arcs to graph MVP implementation; topology ADR programme parked;
continuity-only updates to repo-continuity + thread record`.**
