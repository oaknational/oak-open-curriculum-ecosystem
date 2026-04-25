---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and the most recent session summary"
---

# Repo Continuity

**Last refreshed**: 2026-04-25 (Codex / codex / GPT-5 — session handoff
after reviewer-finding reintegration was packaged as `d9cb54e8` and the
owner pushed `feat/otel_sentry_enhancements`. Branch is in sync with origin at
`cc71507b`; the pushed history includes WS3 `2822e525`, Lane B `9ea3ccd8`, and
the reviewer-reintegration / MD040 sidecar package `d9cb54e8`. Focused tests,
`pnpm type-check`, `pnpm lint`, `pnpm knip`, `pnpm test`, `pnpm build`,
targeted markdownlint, `pnpm portability:check`, `pnpm markdownlint-check:root`,
and `git diff --check` passed before the final handoff edits. Full
`pnpm check` was not rerun after those final doc-only edits.)

**Prior refresh**: 2026-04-25 (Codex / cursor / GPT-5.5 — session
handoff after completing gate recovery for the startup-boundary lane
and landing partial Phase 2 GREEN in the working tree. Focused tests,
build, type-check, knip, and depcruise pass; lint/markdownlint
residuals are isolated to the staged WS3 release-identifier lane.)

This file carries the repo-level active state needed to resume work.
It is not a doctrine store, historical log, or plan substitute.

## Current State

- Branch: `feat/otel_sentry_enhancements` (in sync with origin at
  `cc71507b`; observability package commit `d9cb54e8` is pushed).
- Branch-level success criterion: the full repo-root gate sequence in
  [`.agent/commands/gates.md`](../../commands/gates.md).
- Branch-primary product thread:
  `observability-sentry-otel`.
- Completed repo-owned observability repair lane:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
- Owner-handled validation stages remain external to repo-plan work:
  manual preview `/healthz`, preview-release, preview-traffic,
  Sentry evidence collection, monitor creation, and uptime validation.
- Broader runtime simplification remains separate future work:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md).

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane
state live in each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | `claude-code` / `claude-opus-4-7-1m` / Frodo / release-identifier-implementation / 2026-04-24; `cursor` / `claude-opus-4-7` / Pippin / release-identifier-plan-review / 2026-04-24; `codex` / `GPT-5` / Codex / startup-boundary-plan-author; startup-boundary-gate-green-committer; reviewer-finding-reintegration; pushed-handoff / 2026-04-24→2026-04-25; `cursor` / `GPT-5.5` / Codex / startup-boundary-phase2-partial-green / 2026-04-25; `claude-code` / `claude-sonnet-4-6` / Jazzy / release-identifier-WS3-drafting-paused / 2026-04-25 |
| `agentic-engineering-enhancements` | Practice — documentation roles, continuity surfaces, and fitness-pressure remediation | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | `codex` / `GPT-5` / Codex / practice-docs-consolidation; markdown-code-block-rule / 2026-04-24→2026-04-25; `cursor` / `GPT-5.5` / Codex / grouped-commit-closeout / 2026-04-24; `claude-code` / `claude-sonnet-4-6` / Jazzy / multi-agent-collaboration-protocol-plan-author / 2026-04-25; `claude-code` / `claude-opus-4-7-1m` / Jiggly Pebble / multi-agent-collaboration-protocol-WS0-landed-as-63c66c88 / 2026-04-25; `claude-code` / `claude-opus-4-7-1m` / Fresh Prince / multi-agent-collaboration-protocol-WS1-landed-as-a5d33519 / 2026-04-25 |

The `memory-feedback` thread is archived as of 2026-04-22 Session 8.
If doctrine-consolidation work resumes, start a new thread or revive
that one with a fresh next-session record.

## Branch-Primary Lane State

The branch-primary lane state lives in
[`threads/observability-sentry-otel.next-session.md § Lane state`](threads/observability-sentry-otel.next-session.md).

Current branch-primary objective:

- WS2 §2.1-§2.7 **landed** as `f5a009ab` (unified `resolveRelease`,
  sentry-node thin adapter, atomic old-shape replacement, validator
  alignment, composition-root snapshot-env).
- WS3 cancellation relocation/rewrite **landed** as `2822e525`.
- Lane B startup/release boundary **landed** as `9ea3ccd8`, with
  `pnpm check` green before the reviewer-finding reintegration pass.
- Owner-authorized reviewer-finding reintegration **landed as `d9cb54e8`** and
  is pushed. The markdown-code-block sidecar added the MD040 rule and fixed the
  known unlanguaged fence. Root markdownlint-check passes; full `pnpm check`
  has not been rerun after the final handoff-only doc updates.

## Current Session Focus

The latest observability focus is handoff after the pushed reviewer-finding
reintegration package:

- [`mcp-local-startup-release-boundary.plan.md`](../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
  is active in Phase 3 reintegration. Phase 0/1 evidence, gate recovery, and
  Lane B implementation are landed.
- Owner clarified the build-identity model: build identity is the canonical
  build/release fact for the app; observability consumes it but does not create
  it; `resolveRelease` is the Sentry projection from build identity plus
  Sentry context. First-class `RuntimeConfig.buildIdentity` remains a named
  future canonicalisation task, not forgotten scope.
- Reviewer findings handled in `d9cb54e8`: build-time Sentry env projection resolves
  canonical app version; runtime env includes `VERCEL_GIT_COMMIT_REF`; local
  no-auth paths strip inherited production labels; Search CLI ingest-harness
  tests are no longer excluded; continuity/ADR/operator docs no longer claim
  WS3 is pending.
- The next Sentry-focused session should start from deployed-state validation
  for the pushed branch, not from packaging. If aggregate repo health is to be
  claimed, rerun full `pnpm check` first.

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs.
This operational file repeats only the constraints needed to resume
the current branch safely:

- no compatibility layers; replace, don't bridge;
- TDD at all levels;
- tests prove product behaviour, not configuration or file presence;
- strict boundary validation only;
- no `process.env` read/write in test files or setup files; smoke runner
  composition roots may read, validate, and inject ambient env;
- `--no-verify` requires fresh per-invocation owner authorisation;
- no warning toleration;
- owner direction beats plan.

Current branch non-goals:

- do not start a new repo-owned workstream unless owner-run
  validation surfaces a fresh defect;
- do not reopen broader canonicalisation work opportunistically;
- do not recreate a repo monitoring lane or treat monitor setup as
  in-repo acceptance work;
- do not invent a replacement follow-through cycle now that the
  bounded corrective lane is archived complete;
- do not guess the Vercel import contract before checking primary
  evidence.

## Next Safe Step

Expected next session, per owner direction:

1. Read
   [`observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).
2. Preserve unrelated/parallel working-tree changes if they reappear; do not
   reset, restage broadly, or claim staged WS3 residue exists.
3. Confirm the pushed branch produced the expected Vercel deployment, then
   collect WS6 deployed-state evidence: release name, environment, deploy
   linkage, `git.commit.sha`, source maps / Debug IDs, and event attribution
   in Sentry for the pushed observability package.
4. If the next session needs to claim aggregate repo health before or after
   deployed-state validation, rerun full `pnpm check`. The latest package only
   claims focused gates plus repo-level `type-check`, `lint`, `knip`, `test`,
   `build`, root markdownlint, portability, and `git diff --check`.
5. Keep `RuntimeConfig.buildIdentity`, `HttpObservability.release` public-surface
   cleanup, and remaining smoke composition-root global mutation cleanup routed
   to
   [`mcp-http-runtime-canonicalisation.plan.md`](../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
   unless the owner explicitly broadens this slice.
6. Do not continue into soft-fitness or deep-consolidation work by default.
   Napkin rotation remains due, but the owner explicitly directed the next
   session to be Sentry focused.

## Open Owner-Decision Items

These are visible owner-appetite items, not blockers for
`observability-sentry-otel`:

1. `prog-frame/agentic-engineering-practice.md` disposition —
   recorded in [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032 —
   recorded in `.agent/reference/README.md` and the archived
   reference/notes rehoming plan.
3. `boundary-enforcement-with-eslint.md` promotion proposal under
   PDR-032 — same destination set as above.

## Deep Consolidation Status

**Status (2026-04-25 Jiggly Pebble handoff + consolidate-docs run)**:
**completed this handoff** — `/jc-consolidate-docs` ran on owner direction
after the WS0-handoff cycle, satisfying the prior Codex handoff's
falsifiability check ("if the owner gives consolidation priority, run
`/jc-consolidate-docs`"). Findings:

- **Step 1 / 2 documentation currency**: clean. Source plan
  `multi-agent-collaboration-protocol.plan.md` has WS0 marked
  `completed` with `landed_at: 63c66c88`. Active plans contain only
  status / next-step / execution content, not documentation drift.
- **Step 3 ephemeral sweep**: `.remember/now.md` content already
  captured in the 2026-04-25 Jazzy napkin entries — no new insight
  to extract. Entry-points (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`)
  are canonical heading + AGENT pointer (verified by session-handoff
  6d sweep).
- **Step 4 experience cross-scan**: 10 experience files since
  2026-04-21 cluster strongly around the *the-frame-was-the-fix*
  pattern (6 instances flagged in the prior consolidation;
  2026-04-25 jiggly-pebble adds a 7th-instance variant —
  *frame-held* / *frame-travels*: when the prior session's reframing
  is inherited cleanly by a different identity, the surface-fix loop
  is short-circuited entirely). The pattern is past graduation
  threshold; surfaced as ready for promotion to
  `.agent/memory/active/patterns/the-frame-was-the-fix.md` at owner
  direction.
- **Step 5 pattern extraction + taxonomy / cross-plane scans**: no
  napkin entries this rotation resisted classification into
  `active`/`operational`/`executive`; no `cross_plane: true` tags
  surfaced. Family B Layer 1 / Family B complement: clean. Pattern
  candidates retained in this register; nothing graduated to
  `memory/active/patterns/` this pass.
- **Step 6 napkin rotation**: outgoing napkin (1422 lines) archived
  to `archive/napkin-2026-04-25.md`; fresh napkin written; three
  new sections merged into `distilled.md` (multi-agent
  collaboration, reviewer phasing, ADR/PDR citation discipline);
  `distilled.md` now 134 lines (within 200 target).
- **Step 7a ADR/PDR scan**: nothing rises to immediate ADR or PDR
  promotion. The pending register's many candidates (frame-was-the-fix,
  advisory-not-enforced, operational-seed-per-WS,
  discussion-before-absorption, tripwire-rules-need-observable-artefacts)
  remain pending against their stated trigger conditions.
- **Step 7b graduation**: no settled-with-natural-home entries
  required moves this pass. The new distilled sections are at the
  right level (process knowledge with directive references).
- **Step 7c thread-register freshness audit (six checks)**: clean.
  No stale `last_session` (max 4 days); no orphan threads; no
  missing fields; no expired track cards (none exist); no duplicate
  identity rows within thread; thread ↔ next-session correspondence
  intact.
- **Step 7d bidirectional citation audit**:
  `dont-break-build-without-fix-plan.md` ↔
  `gate-recovery-cadence.plan.md` — both directions resolve (4 rule→plan
  citations; 1 plan→rule citation under plan's `## Cross-references`).
  Clean.
- **Step 8 Practice Core refinement candidate** (owner-approval
  required per PDR-003): WS0 introduced `.agent/state/` as a live
  signal-like surface distinct from `.agent/memory/`. PDR-011
  (Continuity Surfaces and Surprise Pipeline) names napkin /
  distilled / patterns / threads / executive surfaces but does not
  yet acknowledge `.agent/state/` as a continuity-state class.
  Candidate amendment: extend PDR-011's continuity-surface map to
  include `.agent/state/` with the state-vs-memory boundary cited
  to the new `agent-collaboration.md` directive. Surfaced for owner
  decision; not edited.
- **Step 9 fitness check (strict-hard)**: SOFT (12 soft, 0 hard, 0
  critical). Strict-hard exits 0; consolidation closure is unblocked.
- **Step 10 practice exchange**: `practice-core/incoming/` empty;
  `practice-context/outgoing/` has README only. Nothing to process.

**Deferred from this consolidation pass with deferral-honesty**:

- **Practice Core PDR-011 amendment** (the `.agent/state/`
  candidate above): **constraint** — PDR-003 requires owner approval
  for any Core surface edit; surfaced as candidate, not edited.
  **Falsifiability**: owner reviews the candidate and either
  approves the amendment (next consolidation lands the diff) or
  rejects it with rationale (entry removed from candidate list).

**Prior status (2026-04-25 Codex handoff)**: due — napkin rotation remains over the
~500-line convention (`wc -l` now reports 1222 lines). Not run in this handoff
because the owner explicitly directed the next session back to the original
observability plan work and the working tree contains active parallel
practice/collaboration edits. Falsifiability: the next agent can check
`wc -l .agent/memory/active/napkin.md` and `git status --short`; if the
parallel memory/doc surfaces are owned in that session, run
`jc-consolidate-docs`.

**Prior status (2026-04-25 Jazzy handoff + consolidate-docs run)**:
**completed this handoff** — `/jc-consolidate-docs` ran post-handoff
per explicit owner direction. Findings:

- **Step 4c cross-experience scan**: identified `the-frame-was-the-fix`
  pattern candidate (6 instances across 5 sessions in 5 days);
  added to pending-graduations register.
- **Step 7a ADR/PDR scan**: this session surfaced four register
  candidates (discussion-before-absorption gate, operational-seed-
  per-WS pattern, advisory-not-enforced principle, frame-was-the-fix
  pattern) — all are first-instance-only in their respective
  scopes and stay pending. Nothing surfaced as PDR-ready in this
  pass.
- **Step 7c thread-register freshness audit (six checks)**: clean.
  No stale `last_session`, no orphan threads, no missing fields,
  no expired track cards (none exist), no duplicate identity rows,
  no thread ↔ next-session correspondence breaks. Both threads
  (observability-sentry-otel, agentic-engineering-enhancements)
  fully refreshed for Jazzy.
- **Step 9 fitness check**: 11 soft warnings, 0 hard, 0 critical.
  All within hard limits; no urgent action. Practice Core files
  (practice-bootstrap, practice-lineage) hover near soft target —
  routine compression candidates for a future consolidation, not
  blocking.
- **Step 10 practice exchange**: `practice-core/incoming/` empty;
  `practice-context/outgoing/` has README only. Nothing to process.

**Deferred from this consolidation pass with deferral-honesty**:

- **Step 6 napkin rotation**: napkin at 1221 lines, rotation
  overdue per the ~500-line convention. **Constraint**: another
  agent (Codex/cursor/GPT-5.5) is currently working on quality-
  gate remediation and commits in the working tree; rotation
  creates a new archive file + modifies napkin.md + modifies
  distilled.md, all of which risks file-level collisions with the
  parallel agent's pre-commit gate runs. **Falsifiability**: a
  future agent at session-open checks `git log --oneline | head -5`
  to confirm the parallel agent's commits have landed cleanly,
  then runs rotation as the first consolidate-docs step. If
  rotation cannot complete cleanly even after the parallel work
  lands, the constraint was misjudged.
- **Step 8 Practice Core review**: PDR-003 requires owner approval
  for Core edits; the session is closing per owner direction
  (cold start for WS0 in fresh session). **Constraint**: owner
  attention not available for Core-edit approval cycle in this
  consolidation. **Falsifiability**: next consolidation pass after
  WS0 lands re-examines whether any of the four register candidates
  surfaced this session (advisory-not-enforced, frame-was-the-fix,
  etc.) require immediate Core amendment vs. continued register
  pending status.

**Prior status (2026-04-25 Cursor/GPT-5.5 handoff)**: due — `napkin.md` is
still above the rotation threshold (`wc -l` reports 1045 lines), and that
session added fresh correction/learning entries around gate-cadence RED shape,
underscore-as-unused-variable avoidance, and production-owned seams vs
test-only seams. Not run in that handoff because the owner explicitly requested
deep continuity refresh plus manual context compression before continuing the
same implementation lane. Falsifiability: after compression, the next agent can
re-run `wc -l .agent/memory/active/napkin.md`, inspect `git status --short`,
and decide whether to run `jc-consolidate-docs` before additional
documentation churn.

Live classification decisions from this session:

- `continuity-practice.md` carries stable strategy, rules, and
  process;
- `repo-continuity.md` carries active operational state and the
  pending-graduations register;
- historical closeout prose is not active state and should remain in
  archives or git history unless it still drives a current decision.

### Pending-Graduations Register

The register schema is: `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, `status`. `consolidate-docs`
step 7 uses this section as its primary queue.

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-24 | Napkin + owner correction during Practice closeout | Fitness-compression discipline: fitness warnings must be analysed and routed, not answered by opportunistic trimming. Candidate home: ADR-144 amendment, `consolidate-docs` step 9 clarification, or Practice-verification note. | Explicit owner direction, or a second instance of opportunistic trimming after a fitness warning. | pending |
| 2026-04-24 | Napkin + owner direct-answer feedback memory | Practice-governance rule or PDR amendment for direct-answer discipline on verification questions. | Second cross-session observation of the same evasion shape, or explicit owner direction; enforcement cost must be proportionate. | pending |
| 2026-04-24 | Napkin + `.remember/` wiring commits | PDR-011 amendment naming plugin-managed ephemeral capture surfaces as a first-class category distinct from napkin and platform memory. | Second plugin-managed in-repo capture surface, or explicit owner direction. | pending |
| 2026-04-24 | Napkin + `sonarjs-activation-and-sonarcloud-backlog.plan.md` | Pattern candidate: gate-off, fix, gate-on for quality-tool activation with an existing backlog. | Second ecosystem instance, or explicit owner direction to promote first instance. | pending |
| 2026-04-24 | Owner correction during observability plan placement | Practice-planning governance: plan placement should follow ownership and actionability, not arbitrary plan-count/density limits. Candidate home: `plan.md`, plan templates, or a PDR amendment if the rule generalises. | Second instance of a numeric plan cap steering work away from its owner, or explicit owner direction to generalise beyond observability. | pending |
| 2026-04-23 | Thread record + napkin pattern instance for review-cascade spiral | PDR-015 amendment: assumption-challenge gate before absorbing architectural-review output into a plan body. | Trigger (i) met 2026-04-24; still needs gate-cost design or explicit owner direction. | pending |
| 2026-04-23 | Warning-toleration rule + archived observability repair plan | ADR-163 amendment covering release/version boundary, vendor-config passthrough, deploy-entry contract, and realistic production-build gate. | Owner wants the doctrine promoted into ADR-163. | pending |
| 2026-04-23 | `session-handoff` entry-point sweep + homing partial | PDR-014 amendment naming platform-specific entry points as a first-class homing substance class. | Second entry-point drift/homing instance, second platform-specific entry point, and explicit owner request. | pending |
| 2026-04-25 | Napkin (Jazzy) + Wilma adversarial review of multi-agent collaboration plan | Sibling to PDR-015 candidate above: discussion-before-absorption gate per adversarial-review output. When a Wilma-class adversarial review surfaces BLOCKING findings, dispatch an owner-led discussion about whether the design's central claim is right BEFORE absorbing findings as binding work items. Some findings dissolve under reframing rather than requiring hardening. Candidate home: PDR-015 amendment alongside the assumption-challenge gate. | Second cross-session instance of adversarial-review findings being absorbed mechanically without claim-level discussion producing a worse outcome than reframing would have. | pending |
| 2026-04-25 | Napkin (Jazzy) + multi-agent collaboration plan WS-architecture | Pattern candidate: *operational-seed-per-workstream for protocol plans*. Plans that introduce new behavioural / cultural / protocol surfaces (vs purely-technical refactors) benefit from per-WS operational seeds (named questions for subsequent observation) alongside mechanical acceptance. Candidate home: `.agent/memory/active/patterns/` + amendment to plan-template / `jc-plan` skill if it generalises. | Second protocol-plan instance using the per-WS-seed structure, or explicit owner direction to promote. | pending |
| 2026-04-25 | Napkin (Jazzy) + multi-agent collaboration plan Design Principle 1 | Pattern candidate: *advisory-not-enforced for agent-participating systems*. When designing systems where agents participate as reasoning peers (not as constrained subjects), default to information surfaces, not enforcement gates. Mechanical refusals will be routed around at the cost of architectural excellence. The Practice's existing no-bypass discipline (`--no-verify` per-commit authorisation) is evidence the repo already encodes this preference. Candidate home: PDR amendment to PDR-029 (tripwires fire as "consult and decide" not "refuse"); also lands as Design Principle 1 of the multi-agent collaboration plan when WS0 lands. | Second cross-system instance where agent-participating design considered enforcement and chose advisory, or explicit owner direction to elevate beyond the multi-agent collaboration plan's directive-level home. | pending |
| 2026-04-25 | Napkin (Jiggly Pebble) + assumptions-reviewer finding on `respect-active-agent-claims` rule (WS0 landing) | Pattern candidate: *tripwire-rules-need-observable-artefacts*. Tripwire rules whose firing condition is "decided X" need an artefact-leaving step (e.g. "log your decision") or they are unobservable post-hoc. Compare against rules that are mechanically observable post-hoc (e.g. build-breakage rule — the build is or is not green). Candidate home: PDR-029 amendment alongside the existing tripwire-pattern rules, OR `.agent/memory/active/patterns/` if the pattern proves recurrent. | Second instance of a tripwire rule being adjusted to add an observable-artefact step after a reviewer / consolidation surfaces unobservability. | pending |
| 2026-04-25 | Consolidate-docs step 4c (cross-experience scan, Jazzy session) | Pattern candidate: *reflexive-shape-correction across sessions*. Recent experience files (2026-04-21 reviewer-found-the-gaps, 2026-04-22 plan-was-not-the-conversation, 2026-04-23 three-reviewers-collapse, 2026-04-24 evasion-called-out, 2026-04-24 the-spiral-i-could-not-see, 2026-04-25 from-locks-to-knowledge) cluster around the same shape: agent reaches for the obvious / mechanical / enforcement-shaped tool; external feedback (owner, reviewer, parallel agent's experience) arrives as a question that exposes the framing rather than fixing the surface; agent reframes; the original "fix the surface" work dissolves. The pattern's name candidate: *the-frame-was-the-fix*. Six instances across five sessions in five days is well above pattern-graduation threshold. Candidate home: `.agent/memory/active/patterns/the-frame-was-the-fix.md` as a process pattern, possibly with PDR-shaped governance framing if the practice doctrine wants it elevated. | Second cross-experience scan reaches the same conclusion, or explicit owner direction to graduate. | pending |

Historical deep-consolidation findings and session-close summaries are
preserved in git history and
[`archive/repo-continuity-session-history-2026-04-22.md`](archive/repo-continuity-session-history-2026-04-22.md).
