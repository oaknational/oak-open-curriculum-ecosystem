---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and the most recent session summary"
---

# Repo Continuity

**Last refreshed**: 2026-04-24 (Pippin / cursor / claude-opus-4-7 —
meta-session sweep at `ffec98b0` landed the previously-uncommitted
release-identifier plan-body refinement alongside cross-cutting
practice/process restructuring, vendor-skills expansion, and three
new parallel plans, per explicit owner direction "commit all files
including from other threads"; thread record refreshed for the
post-meta-session landscape).

The current state is:

- The only branch-level success criterion remains the full repo-root
  gate sequence in [`.agent/commands/gates.md`](../../commands/gates.md).
  Workspace-local green runs are diagnostic only.
- The strict corrective pass that replaced the workaround-heavy
  follow-through is now landed: strict sitemap validation is restored,
  the `oaksearch` wrapper path is gone, the configured Sentry build
  gate loads its canonical env source, and the bounded repo-owned lane
  is archived complete at
  [`archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
- L-8 Correction WI 1-5 remain landed in `fb047f86`, the real
  `@vercel/node` deploy contract is verified from primary evidence, and
  the dedicated `src/server.ts` / `dist/server.js` deploy boundary
  remains the verified deploy shape.
- Shared Step 4 foundation work, the `require-observability-emission`
  `warn` → `error` escalation, and the former
  `oak-search-sdk` / `sdk-codegen` / `search-cli` backlog remain
  retired as authoritative history after the green repo-root rerun and
  the later strict corrective pass.
- Manual preview `/healthz`, preview-release, preview-traffic, and
  Sentry evidence collection are now explicitly owner-handled
  validation stages, not active repo-plan work.
- Broader runtime simplification remains separate future work:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md).
- Monitor creation and ongoing uptime validation remain owner-external:
  [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md).

## Active threads

A **thread** is the continuity unit — a named stream of work that
persists across sessions and agents. A *session* is a time-bounded
agent occurrence that participates in one or more threads.
Convention and identity schema documented at
[`threads/README.md`](threads/README.md) and ratified in
[PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).

**This table IS the right-now active-agent register** per PDR-029 (as
amended 2026-04-21). The `Active identities` column summarises each
thread's current participating identities in `platform / model /
agent_name / role / last_session` form — a compact readable register
any agent on any platform can read. Per-thread full identity tables
live in each thread's next-session record; this column carries the
most recent session's identities for at-a-glance continuity.

| Thread                      | Purpose                                        | Next-session record                                                                                      | Active identities                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | *unattributed* / *unknown* / *unknown* / executor / 2026-04-21; `claude-code` / `claude-opus-4-7-1m` / Samwise / migration-maintenance / 2026-04-21; `cursor` / `claude-opus-4-7` / Merry / cleanup-only / 2026-04-22; `codex` / *unknown* / Codex / repo-owned-repair-closeout-and-doc-consolidation / 2026-04-23; `cursor` / `claude-opus-4-7` / Pippin / WS0-amendment-landing-then-post-WS0-WS3-cancellation-rewrite-design-into-plan-body-and-meta-session-sweep-commit / 2026-04-24 (latest — landed ADR-163 §1 + §10 amendment + reviewer dispositions in `06bf25d7`; later same date refined the plan body to encode WS3 cancellation-script rewrite using canonical `semver` + WS2 validator denylist correction; later same date landed the deferred plan-body refinement inside the cross-cutting meta-session sweep at `ffec98b0` per explicit owner direction; thread record refreshed — next session opens the plan, reads WS3 + WS2.5 as authoritative, proceeds straight to WS1 RED) |

The `memory-feedback` thread is **archived** as of 2026-04-22
Session 8 (Merry / cursor / claude-opus-4-7) following the close
of the eight-session staged doctrine-consolidation arc. Its
next-session record (`threads/memory-feedback.next-session.md`)
was deleted per [PDR-026 §Lifecycle](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md).
The arc-close summary lives in the
[Practice Core CHANGELOG](../../practice-core/CHANGELOG.md)
2026-04-22 Session 8 entry. Thread history is preserved in git
log; if doctrine-consolidation work resumes in future, a new
thread starts (or this one is revived via a fresh next-session
record). `observability-sentry-otel` resumes as the next-active
thread.

**Workstream layer retired (2026-04-21 Session 5)**: the
`.agent/memory/operational/workstreams/` surface is retired as an
active operational-memory surface. Lane state folds into each
thread's next-session record directly. See
[`workstreams/README.md`](workstreams/README.md) for retirement
rationale and [PDR-027 §Amendment Log](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md#amendment-log)
for the governance amendment.

**Identity discipline**: sessions joining an active thread **add**
identity rows to each thread's next-session record; they do not
overwrite or rename existing ones. See
[`threads/README.md`](threads/README.md) and
[PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).

**Refresh cadence**: the `Active identities` column is refreshed as
part of [`/session-handoff` step 7b](../../commands/session-handoff.md) —
every session that touches a thread updates both the thread's own
next-session record (full identity table) and this summary column
(compact per-thread view).

## Branch-primary lane state

The `observability-sentry-otel` thread is branch-primary on
`feat/otel_sentry_enhancements`. Lane state (owning plans, current
objective, blockers, next safe step, active tracks, promotion
watchlist) lives in
[`threads/observability-sentry-otel.next-session.md § Lane state`](threads/observability-sentry-otel.next-session.md).

**Timeline**: §L-8 WS1 + WS2 + WS3.1 LANDED in `f9d5b0d2`
(2026-04-21); 2026-04-22 Vercel preview probe FAILED with
`missing_app_version`; L-8 Correction WI 1-5 LANDED in `fb047f86`
(2026-04-23); the next preview reached a green build but the function
crashed at runtime with `FUNCTION_INVOCATION_FAILED` because the
deployed artefact did not satisfy Vercel's import contract; later
2026-04-23 work verified that contract from primary evidence, landed
the dedicated `dist/server.js` boundary, replaced the workaround-heavy
follow-through with a strict corrective pass, and then archived that
repo-owned lane as complete.

**Repo-owned corrective lane closure record**:
[`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
is now the authoritative archive for the completed repo-owned repair
lane. No active repo-owned follow-through plan remains on this branch.

**Separate future work**:
[`mcp-http-runtime-canonicalisation.plan.md`](../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
owns broader runtime simplification once owner-run validation is done
and there is appetite to simplify deliberately.

**Closed repo monitoring work**:
[`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)
records that monitor creation and ongoing uptime validation are
owner-external. Manual preview `/healthz` and preview/Sentry proof are
also owner-handled validation stages.

## Current session focus

**2026-04-24 (latest, Pippin / cursor / claude-opus-4-7)**: meta-
session sweep landed at `ffec98b0` (80 files, +12732/-3970), per
explicit owner direction "commit all files including from other
threads". The sweep folded together:

- This thread's previously-uncommitted plan-body refinement
  (WS3 cancellation-script rewrite + WS2 validator denylist
  correction in
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md));
- The 2026-04-22 meta-session's portability audit + consolidation
  outputs (now-committed plans for portability remediation,
  practice/process structural improvements, and aggregated-tool
  result-type remediation);
- Practice surface relocation (`continuity-practice.md` from
  `docs/governance/` to `.agent/directives/`) plus principles
  update;
- Vendor-skills expansion (Clerk backend API, custom-ui core-2/
  core-3 variants, orgs references and evals across `.agents/` and
  `.claude/`); canonicalisation removed obsolete
  `.claude-plugin/plugin.json` shells under `.agents/skills/clerk-*`;
- Engineering-doc refreshes (ADR-078, build-system, testing-
  patterns, typescript-gotchas, governance/MCP/oak-eslint READMEs);
- Continuity surfaces refreshed (this file +
  `observability-sentry-otel.next-session.md`) for the post-sweep
  landscape.

Pre-commit gates passed in 104s; working tree clean post-commit.

**Prior session (2026-04-24 Pippin / cursor — earlier same date)**:
WS0 of the release-identifier plan landed at `06bf25d7`; subsequent
post-WS0 design discussion produced the WS3 cancellation-script
rewrite design that was originally deferred-to-handoff and is now
committed inside the sweep above.

**Prior session (2026-04-22 `claude-code` / `claude-opus-4-6-1m`)**:
portability audit + two consolidation passes — napkin rotated
(2,323→65); distilled graduated (281→177, 19+ entries to permanent
homes); repo-continuity compressed (1,355→473, fitness tracked);
`continuity-practice.md` moved to directives; structural gap
analysis produced two new plans. All outputs were uncommitted at
the time and have now landed in `ffec98b0`.

Next on `observability-sentry-otel` thread: WS1 RED contract tests
(separate commit per turn-boundary discipline; no plan-authority
debt to settle first).

Next on agent infrastructure portability: implementation of the 7
phases in the remediation plan, on a new branch.

## Session history

Session close summaries (Sessions 5-8, 2026-04-21 through
2026-04-24) archived to
[`archive/repo-continuity-session-history-2026-04-22.md`](archive/repo-continuity-session-history-2026-04-22.md).
Full audit trail preserved in git history and the archive file.

## Family-A tripwire firing triggers (named concretely per Session 5 retention check)

Per PDR-029's firing-trigger discipline (*"any lacking a concrete
near-term firing opportunity must name the trigger or be retired"*),
the installed Family-A tripwires each name a concrete near-term
firing opportunity:

**Class A.1 — plan-body first-principles check** (single layer
post-Session-5 E3): fires on every new or materially-amended plan
body's "Context/Background/Framing" section per
[`.agent/rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md).
**First firing recorded**: Session 5 Stage 2(b) executed per-item
Class A.1 firing on all 10 retracted-`standing-decisions.md`
items; 3 rewrites produced (items 5, 8, 9 — `new PDR` →
`existing-surface amendment` for items 5 + 8; `new PDR` →
`principle line` for item 9). All 3 rewrites owner-ratified. The
tripwire worked as designed against shape-problems before they
proliferated. **Next concrete firing opportunity**: Session 6
authoring of any new PDR / ADR / rule / plan body (e.g. the
deferral-honesty rule candidate if promoted, or any artefact
emerging from Stage 2(a) outgoing triage). Retention: **keep**.

**Class A.2 Layer 1 — session-open identity registration**: fires
on every session open per [`.agent/rules/register-identity-on-thread-join.md`](../../rules/register-identity-on-thread-join.md).
**Concrete near-term firing opportunity**: every session-open
from Session 6 onwards. Session 5 itself exercised this rule —
Pippin/cursor-opus was added as a new identity row. Retention:
**keep**.

**Class A.2 Layer 2 — session-close identity gate**: fires on
every `/session-handoff` invocation per [`.agent/commands/session-handoff.md § step 7b`](../../commands/session-handoff.md).
**Concrete near-term firing opportunity**: every session-close
from Session 6 onwards. Session 5's own close will exercise the
gate. Retention: **keep**.

Neither class is retired. The two-layer design target is preserved
for Class A.2 and acknowledged as a single-layer exception for
Class A.1 (background grounding via
[`.agent/directives/principles.md`](../../directives/principles.md)
is not an installed tripwire layer per PDR-029 Session-5
reclassification).

## Decisions in force — pointer to proper artefact homes

**Per PDR-029's second 2026-04-21 Amendment Log entry**: there is no
dedicated "standing-decisions" surface. "Standing" is not a category; it is
a default property of any ratified artefact. Decisions that govern current
and future sessions live in their proper homes and are read at session
open via the grounding order.

**Where ratified decisions live**:

- **Architectural decisions** → [ADR index](../../../docs/architecture/architectural-decisions/README.md).
- **Practice-governance decisions** → [PDR index](../../practice-core/decision-records/) (portable doctrine).
- **Always-applied procedural rules** → [`.agent/rules/`](../../rules/) tier.
- **Meta-principles** → [`.agent/directives/principles.md`](../../directives/principles.md).
- **Plan-local meta-decisions** (scope, shape, fitness tolerance,
  session counts, deferrals) → the owning plan body itself.

Session 4 (2026-04-21) removed the prior `standing-decisions.md` misc
bucket after owner-metacognition surfaced that every item in it had a
proper home (or needed one authored). Decomposition items tracked under
the Deep consolidation status register as Due items for Session 5 /
next consolidation authoring.

**Repo-wide invariants that read as decisions** (e.g. cardinal rule, owner-
beats-plan, docs-as-DoD, `--no-verify` fresh authorisation) live below
at [§ Repo-wide invariants / non-goals](#repo-wide-invariants--non-goals).
Their long-term home is per classification in the list above; invariants
already documented in `principles.md`, PDRs, or rules carry citations
forward from those homes.

## Repo-wide invariants / non-goals

Invariants in force for any session regardless of workstream (the
set is additive; previous invariants still apply):

- **Cardinal rule**: `pnpm sdk-codegen && pnpm build` brings all
  workspaces into alignment with an upstream OpenAPI schema change.
- **No compatibility layers, no backwards compatibility** — replace,
  don't bridge. See `.agent/directives/principles.md`.
- **TDD at all levels** — tests first, fail-green-refactor.
- **Tests prove product behaviour, not configuration** — never
  assert on file structure, section headings, or field names when
  what you need to prove is the system's observable behaviour. See
  `.agent/directives/testing-strategy.md`.
- **Strict boundary validation** only — product code does not read
  `process.env`; boundary validation is schema-driven.
- **Tests never touch global state** — no `process.env` read/write
  in any test type; pass explicit literal inputs via DI.
- **Clerk is canonical user-ID provider through public alpha.**
- **`--no-verify` requires fresh per-commit owner authorisation** —
  no carry-forward.
- **Build-vs-buy attestation required pre-ExitPlanMode** for any
  vendor-integration plan (installed 2026-04-20, commit `4bccba71`).
  Sunk-cost reasoning is not a valid "why bespoke" answer.
- **Friction-ratchet counter** — 3+ independent friction signals
  against the same shape escalates to `assumptions-reviewer` for
  solution-class review, not another tactical fix (installed
  `4bccba71`).
- **ADRs state WHAT, not HOW** — argv shapes, per-step postures, and
  file paths belong in the realising plan, not the ADR (installed
  `4bccba71`).
- **Reviewer phases aligned** — plan-time (solution-class) →
  mid-cycle (solution-execution) → close (coherence). Close-only
  scheduling is the anti-pattern (installed `4bccba71`).
- **Runtime tactical track cards are git-tracked** — graduated
  2026-04-21 Session 5 to [PDR-011 §The continuity contract +
  2026-04-21 Session 5 amendment](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md#amendment-log).
  Cards live at `.agent/memory/operational/tracks/`; filename
  convention `<thread>--<agent>--<branch>.md` per
  [`tracks/README.md § Naming convention`](tracks/README.md).
- **Owner's word beats plan. Always.** — graduated 2026-04-21
  Session 5 to [`principles.md § Owner Direction Beats Plan`](../../directives/principles.md).
  Currently a foundational invariant only; no always-applied rule
  operationalises it yet (operationalisation is a candidate
  follow-up if the principle is observed to drift in practice).
- **Docs-as-definition-of-done** — graduated 2026-04-21 Session 5
  to [PDR-026 §Landing target definition (2026-04-21 Session 5
  amendment)](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#amendment-log).
  A change is not landed while documentation it invalidates
  remains stale; doc updates compose into the landing commit.
- **Misleading docs are blocking** — graduated 2026-04-21 Session 5
  to [`principles.md § Code Quality`](../../directives/principles.md).
  Enforced by the always-applied `documentation-hygiene`
  rule. Symmetric with PDR-026 §Landing target definition (above):
  the principle says misleading docs cannot ship; PDR-026 says
  doc updates compose into landings.
- **No child-process proof in tests** — production-path-only branches
  are covered by DI-friendly code tests plus a realistic
  production-build gate under representative env, not by test-owned
  subprocess proof.

Non-goals for next session:

- Do NOT start a new repo-owned workstream unless owner-run validation
  surfaces a fresh defect.
- Do NOT reopen broader canonicalisation work opportunistically.
- Do NOT recreate a repo monitoring lane or treat monitor setup as
  in-repo acceptance work.
- Do NOT invent a replacement "one more repo session" narrative now
  that the bounded corrective lane is archived complete.
- Do NOT guess the Vercel import contract before checking primary
  evidence.

## Next safe step

Pick up
[`sentry-release-identifier-single-source-of-truth.plan.md`](../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
at WS0: amend ADR-163 to record both owner-direction rules (truth
tables included), then run the assumptions / sentry / fred reviewers
against the proposed amendment text BEFORE landing. WS1 (RED contract
tests) cannot start until the amendment lands.

If owner-run validation of the previously-archived corrective lane
surfaces a fresh repo defect in parallel, that takes priority — open
the smallest targeted repair lane that names that defect explicitly.
Otherwise, do not invent another repo-owned follow-through cycle
beyond the queued release-identifier plan.

**Commit workflow tooling available** (refined 2026-04-23 by
Pippin's second session into the canonical `commit` skill at
[`.agent/skills/commit/SKILL.md`](../../skills/commit/SKILL.md)):
the L-8 Correction work-list will produce ~8+ commits. The skill
covers live commitlint constraints, pre-`git commit` validation
via `scripts/check-commit-message.sh` (~1s, catches
`header-max-length` / `body-max-line-length` before the ~34s
pre-commit cycle), the Cursor-Shell-tool stream-truncation
workaround (file-redirect commit invocation; see the skill's
own falsifiability discipline). Commit-attempt logging is now
paused; `scripts/log-commit-attempt.sh` and
[`diagnostics/commit-attempts.log`](diagnostics/commit-attempts.log)
remain only as dormant/historical surfaces. Do NOT pre-prime the
turbo cache via `bash .husky/pre-commit` (documented anti-workaround
in the skill).

**Three rehoming open items** await owner attention but do NOT
block any thread (recorded as honest PDR-026 deferrals on
durable surfaces, owner-appetite-triggered, no SLA):

1. `prog-frame/agentic-engineering-practice.md` disposition —
   owner conversation required; recorded in
   [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` PROMOTE-TO-REFERENCE proposal
   under PDR-032 — owner-vet required; archived rehoming plan
   `agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md`
   §Open items + `.agent/reference/README.md`.
3. `boundary-enforcement-with-eslint.md` PROMOTE-TO-REFERENCE
   proposal under PDR-032 — same.

These do NOT need to be resolved before resuming
`observability-sentry-otel`; they are owner-decision items that
will be picked up when the owner has appetite. If left
indefinitely, they remain visible in the surfaces above.

## Deep consolidation status

**Status (2026-04-22 final session-handoff)**: **completed
this pass** — two consolidation passes run. Napkin rotated
(2,323→65); distilled graduated (281→177, 19+ entries to
permanent homes in build-system.md, testing-patterns.md,
typescript-gotchas.md, ADR-078, development-practice.md,
architecture README, MCP app README, eslint-plugin README);
repo-continuity compressed (1,355→473, fitness tracked);
continuity-practice.md moved to directives. Structural gap
analysis produced a new Practice improvements plan (4 phases)
and a separate aggregated tool debt plan. All remaining
distilled entries mapped to plan phases with named graduation
destinations. No new ADR/PDR candidate promoted. 0 critical,
3 hard (owner-deferred), 12 soft.

**Status (2026-04-23 Pippin session-handoff after release-identifier
plan rewrite under owner direction — preserved for audit)**: **due —
not well-bounded for this closeout, defer to a dedicated consolidation
pass.** Standing triggers continue to fire: napkin still >>500 lines
(the prior pass recorded ~1985 lines and this session adds one fresh
surprise entry); distilled refinement remains soft-zone-due from the
prior closeout. This session was a focused planning rewrite (~1 hour
scope), not a consolidation pass — escalating now would exceed the
closeout boundary per session-handoff step 10. Ratchet forward with
falsifiability: next session opens with napkin still >500 if rotation
has not happened, which prompts dedicated consolidation work; the
queued release-identifier plan does not depend on consolidation
landing first.

**Status (2026-04-23 Codex session-handoff + consolidate-docs closeout
after owner-declared lane completion — preserved for audit)**:
**completed this pass** — the completed observability follow-through
plan was archived, live references were reconciled to the archive
path, repo/thread continuity now reflects that manual validation
stages are owner-handled separately, and no new ADR/PDR candidate or
thread-register freshness finding surfaced.

Falsifiability:

- the archive record exists at
  [`archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md);
- the repo/thread/high-level surfaces now point at that archive record
  rather than a stale `current/` path;
- no new pending-graduations row was added in this closeout.

This closeout explicitly asked the ADR/PDR question. Answer: **no new
register row**. The owner correction tightened the lane, but it does
not yet justify a distinct ADR/PDR candidate beyond the existing
pending items below.

### Pending-graduations register additions (2026-04-23 latest plan-rewrite session)

One PDR-shape candidate surfaced this plan-rewrite session
(captured as Deferred Lane DL-7 in the plan body and recorded
here per the §Deep consolidation status §Pattern-extraction
discipline):

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-23 (latest, plan-rationalisation session) | [`threads/observability-sentry-otel.next-session.md` § Earlier Landed Substance Still In Force](threads/observability-sentry-otel.next-session.md) + [`napkin.md` § 2026-04-23 (latest, operational-plan rationalisation session)](../active/napkin.md) — the cross-session pattern instance #8 candidate of `inherited-framing-without-first-principles-check` (Fred + Betty convergence treated as decision-complete; Barney's simplification-first lens and the assumption challenge arrived only after the plan body had already overgrown) | PDR amendment to [PDR-015 (Reviewer Authority and Dispatch)](../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md) installing an **assumption-challenge gate per architectural-review output**: when an architectural review produces output that proposes design changes, dispatch `assumptions-reviewer` against that output BEFORE absorbing it into a plan body. Today the gate exists at the plan-body level but not at the architectural-review-output level where inherited framing hardens cheapest. | (i) ≥1 second cross-session instance of an architectural review's output entering a plan body without an intervening assumption audit and producing a downstream rewrite; OR (ii) explicit owner direction; AND (iii) the gate's marginal cost can be shown not to dominate the cost it averts. | pending |

### Pending-graduations register additions (2026-04-23 prior session — WI-7 lambda crash + warnings doctrine)

One amendment-candidate surfaced in the prior 2026-04-23 session:

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-23 (latest) | [`.agent/rules/no-warning-toleration.md`](../rules/no-warning-toleration.md) + [`principles.md` §Code Quality](../../directives/principles.md) + [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md) + napkin latest Step-4 entry | ADR amendment to [ADR-163 §6 / §7](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md) folding four lessons together — version-resolution boundary discipline, vendor-config passthrough discipline (`turbo.json` `globalPassThroughEnv` proven 2026-04-23), deploy-entry contract discipline (the repaired Vercel import/export shape), and the **realistic production-build gate** required for env-gated Sentry esbuild-plugin paths once child-process proof is rejected by testing doctrine — with a gate-mapping table showing which build-time / runtime gate enforces each contract. | The archived closure record is sufficient to draft the ADR-163 amendment and the owner wants the doctrine promoted into the ADR. | pending |

### Pending-graduations register additions (2026-04-23 third session)

One PDR-shaped candidate surfaced this session:

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-23 | [`session-handoff` step 6d](../../commands/session-handoff.md) + [`ephemeral-to-permanent-homing` partial](../../commands/ephemeral-to-permanent-homing.md) + the `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` strip in `fb047f86` | PDR amendment to [PDR-014 (Consolidation and Knowledge-Flow Discipline)](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md) extending the homing methodology to **platform-specific entry points** as a distinct substance class. Today the homing partial documents this in workflow form; PDR-014 governs the homing flow at the practice-governance level but does not yet name platform-specific entry points (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.codex/AGENTS.md`, etc.) as a substance-class first-class consideration. | (i) ≥1 second session that catches and homes drift in a platform-specific entry point via the `session-handoff` step 6d sweep, demonstrating the workflow holds; (ii) ≥1 second platform-specific entry point added to the repo (e.g. `.codex/AGENTS.md`) and confirmed to follow the pure-pointer convention; (iii) explicit owner request to graduate. | pending |

Plus one observation worth noting (not yet candidate-shaped —
single-instance, structural-not-pattern):

- `fb047f86` is itself a structurally interesting commit shape:
  one logical implementation lane (L-8 Correction WI 1-5) folded
  in the same atomic commit with one structural meta-lane
  (entry-point sweep + homing partial + rule rename). The owner
  direction was explicit ("just do one commit for all files,
  we are picking up the pace here"). The shape contradicts the
  conventional small-commits / single-concern guidance, but is
  consistent with PDR-026's per-session landing commitment
  applied at thread cadence rather than commit cadence. Worth
  noting if a second instance of this shape arises and the
  owner-cadence-vs-commit-cadence trade-off needs explicit
  governance (would be a PDR-026 amendment candidate, not a
  new PDR).

Historical consolidation walk findings (Sessions 7-8,
2026-04-22) archived to
[`archive/repo-continuity-session-history-2026-04-22.md`](archive/repo-continuity-session-history-2026-04-22.md).

## Next-session opening statements (per thread)

There is no single next-session opener. The continuity unit is the
thread; each active thread holds its own next-session record. Pick
the thread the session is picking up before reading the opener.

- **`observability-sentry-otel` thread** (product) — **next-active
  as of 2026-04-22 Session 8 close**: see
  [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).
  Landing target: §L-8 WS1 Vercel preview acceptance probe (per
  the authoritative file). Standing decisions (owner-beats-plan)
  and session shape specified in the opener.
- ~~`memory-feedback` thread~~ — **archived 2026-04-22 Session 8**.
  Eight-session staged doctrine-consolidation arc closed; next-
  session record deleted per PDR-026 §Lifecycle. If
  doctrine-consolidation work resumes, a new thread starts (or
  this one is revived via a fresh next-session record).

**PDR-026 landing-commitment discipline**: a single session
commits to landing *one* thread's target, not multiple. Cross-
thread spread in the same session is anti-pattern.
