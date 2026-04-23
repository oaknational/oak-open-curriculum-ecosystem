# Repo Continuity

**Last refreshed**: 2026-04-23 (Pippin / cursor-claude-opus-4-7
**third session** — `observability-sentry-otel` thread
session-handoff closeout after the L-8 Correction WI 1-5 atomic
landing in commit `fb047f86`. Session-scoped substance was: (i)
**WI 1-5 of the L-8 Correction work-list landed locally** —
canonical `resolveBuildTimeRelease` resolver in new workspace
package `@oaknational/build-metadata` (44/44 tests green), typed
`SentryBuildPluginIntent` discriminated union (`disabled` /
`skipped` / `configured`) replacing the prior fail-fast
`Result.error` shape, `esbuild.config.ts` four-arm switch with
three-branch dry build verified locally,
`validate-root-application-version.mjs` pre-flight removed from
the MCP HTTP build script only (search-cli left on tsup with the
pre-flight intact per WI-5 scope-discipline correction caught by
owner mid-execution); (ii) **session-scoped continuity work
folded into the same commit**: `AGENTS.md` + `CLAUDE.md` +
`GEMINI.md` stripped to pure pointers per the entry-point sweep,
new `.agent/commands/ephemeral-to-permanent-homing.md` shared
methodology partial authored, `session-handoff` step 6d added
(entry-point drift sweep), `consolidate-docs` step 3 retargeted
at the homing partial, `tsdoc-and-documentation-hygiene` rule
renamed to `documentation-hygiene` across canonical + Cursor +
Claude adapters with body restructured (misleading-doc detection
+ attribution on adoption + TSDoc presence and quality); (iii)
**3 docs propagation edits** homing AGENTS.md facts to
permanent locations (workspace README + `observability.md` +
`docs/operations/sentry-deployment-runbook.md`); (iv)
**distilled-memory user-preferences** extended (env-mirror,
scope-discipline, attribution); (v) **2 pre-commit fail-and-fix
cycles**: prettier formatting (root) and a depcruise-detected
circular dependency between `build-time-release.ts` and
`build-time-release-internals.ts` (broken by extracting shared
types to `build-time-release-types.ts`). Forward state: WI 6-8
remain (push branch + Vercel preview probe + Sentry UI
verification + ADR-163 §6/§7 amendment). Earlier-today refresh:
2026-04-23 second session — Pippin / cursor-claude-opus-4-7
session-handoff closeout. No L-8 implementation work that session
[explicit owner constraint: "no implementation work until the
next session"]; session-scoped substance was (1)
continuity-correction commits
fixing the napkin/distilled owner-gating false framing in
`repo-continuity.md` + `napkin.md`, (2) authoring
`scripts/check-commit-message.sh` to validate commit messages
in isolation from the ~34s pre-commit cycle, (3) authoring the
commit-attempts diagnostic loop —
`scripts/log-commit-attempt.sh` + tracked TSV log at
`.agent/memory/operational/diagnostics/commit-attempts.log` +
diagnostics README — to make the "git commit pre-commit output
truncation in the last ~24h" pattern countable across
sessions/machines, (4) capturing the truncation observation as a
top-level napkin entry with hypotheses + workaround +
falsifiability, (5) **second-pass refinement (post-handoff)**:
converting the never-invoked `.agent/commands/commit.md` command
into the canonical always-active
[`.agent/skills/commit/SKILL.md`](../../skills/commit/SKILL.md)
with the new helpers folded into the skill body — file-redirect
framed as a Cursor-Shell-tool workaround with falsifiability
tied to the diagnostic log, AGENTS.md verbose subsection rolled
back to a thin pointer, all incoming references rewired
(AGENT.md citation, finishing-branch skill, practice-index,
README, platform-adapter-formats research) and **third-pass
refinement (same session, owner-corrected)**: thin adapters
restructured from *command* form to *skill* form per owner
direction — deleted `.claude/commands/jc-commit.md`,
`.cursor/commands/jc-commit.md`, `.gemini/commands/jc-commit.toml`;
created `.cursor/skills/commit/SKILL.md`; renamed
`.agents/skills/jc-commit/` → `.agents/skills/commit/` (drop
personal `jc-` prefix to match `napkin` / `finishing-branch`
convention for passive always-active skills). Skill discovery on
Claude/Gemini falls back to the `AGENT.md` citation chain (no
`.claude/skills/commit/` adapter, mirroring how `napkin` and
`finishing-branch` work today). Five commits already landed
this session: `6137c817` continuity correction, `74826914`
check-commit-message helper, `0bd3204c` diagnostics infra,
`14ea70f3` napkin truncation observation, `9abbdeb9` initial
session-handoff. **The skill-conversion + adapter-refactor
work is staged but NOT committed** — owner direction at session
end: *"no need to commit, the next session can handle that"*.
Staged set (run `git status --short` at next session open to
confirm; expected ~19 entries): `.agent/skills/commit/SKILL.md`
(NEW canonical), `.agents/skills/commit/SKILL.md` (NEW Codex
skill thin pointer; renamed from `.agents/skills/jc-commit/`),
`.cursor/skills/commit/SKILL.md` (NEW Cursor skill thin
pointer), `.agent/commands/commit.md` (DELETED), three command
adapters DELETED (`.claude/commands/jc-commit.md`,
`.cursor/commands/jc-commit.md`, `.gemini/commands/jc-commit.toml`),
`.agent/directives/AGENT.md` + `.agent/README.md` +
`.agent/research/platform-adapter-formats.md` +
`.agent/practice-index.md` + `.agent/skills/finishing-branch/SKILL.md` +
`.claude/settings.json` + `AGENTS.md` (modified — references
rewired or rolled back), `scripts/validate-portability.unit.test.ts`
(modified — test fixture renamed off the deleted command path),
`.agent/memory/operational/repo-continuity.md` +
`.agent/memory/operational/threads/observability-sentry-otel.next-session.md` +
`.agent/memory/operational/diagnostics/commit-attempts.log` +
`.agent/memory/active/napkin.md` (this refresh + napkin
investigation entry). The canonical home for commit-workflow
guidance is now the skill, discoverable via
[`AGENT.md § Commit Discipline`](../../directives/AGENT.md#commit-discipline)
and the always-active skill register. **Unstaged Sentry L-8 WIP
files in working tree** (deliberately kept out of this commit
scope, belong to the next session's L-8 Correction work-list):
`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`
+ its unit test (modified), `packages/core/build-metadata/src/index.ts`
(modified to re-export new modules), four NEW untracked files
under `packages/core/build-metadata/` (`build-info.ts`,
`build-time-release.ts`, plus their `.unit.test.ts` siblings). **Owner-gated follow-up
deferred (Practice Core)**: `.agent/practice-core/practice-bootstrap.md`
still lists `commit` under "Required Commands" with file
`jc-commit.md` (line 403); the table needs an update to reflect
the promotion from command to passive always-active skill, but
that surface is owner-gated per the napkin/distilled correction —
queued for the next session that touches Practice Core.
**Same-session napkin entry filed** for the owner-noticed
"two definitions per skill" observation across `.agent/skills/`,
`.agents/skills/`, `.cursor/skills/` (and conditionally
`.claude/skills/`) — captured as 1/3 with five investigation
hooks at `napkin.md § 2026-04-23 — investigate: each skill
appears to have two definitions across platform surfaces`.
**Bounded follow-up sweep queued (next session that touches
agent infra)**: rename the ten `jc-`prefixed skill directories
in `.agents/skills/` to their bare names. Owner clarification
this session: `jc-` is the personal namespace for **slash
commands** (across `.claude/commands/`, `.cursor/commands/`,
`.gemini/commands/`), not for skills; the prefix on skills is
drift, not a convention. Sweep is mechanical: `git mv` each
of `jc-chatgpt-report-normalisation`, `jc-consolidate-docs`,
`jc-gates`, `jc-go`, `jc-metacognition`, `jc-plan`, `jc-review`,
`jc-session-handoff`, `jc-start-right-quick`,
`jc-start-right-thorough` to its bare name; update each
frontmatter `name:` field; update `.claude/settings.json`
`Skill(jc-*)` allowlist entries to bare names; audit any
incoming citations. Detail at `napkin.md` investigation hook 4. Earlier-today refresh:
2026-04-22 (`observability-sentry-otel` thread session close —
Pippin / cursor-claude-opus-4-7 — UNLANDED probe; L-8
Correction subsection landed in the active plan; continuity
surfaces refreshed; Step 6 finding + Re-fired falsifiabilities
block re-issued same session after owner correction —
napkin/distilled are agent-gated, only `.agent/directives/` and
`.agent/practice-core/` are owner-gated). Earlier-still refresh:
2026-04-22 (Session 7 CLOSE — owner-corrected restatement). Session 7 honest landed
state: Phase A + Phase D PARTIAL (napkin rotated + distilled
compressed only; the four directive files in Phase D scope reset
to HEAD per owner intervention when the agent unilaterally
executed owner-gated per-file disposition without conversation;
only the `[adr-078]→[di]` link-label rename on
`testing-strategy.md` survived as a narrow technical micro-fix)

- Phase E (PDR-012 amendment) + Phase G (practice-verification.md
  PDR-032 mention) + Phase C Batch 3 (4 outgoing files deleted +
  1 relocated; outgoing/ now contains only README.md). **Owner
  decisions at Session 7 close**: fitness limit excesses declared
  acceptable for now, revisit later (HARD: 4 hard, 10 soft); the
  `pnpm practice:fitness --strict-hard` exits-0 DoD requirement
  DROPPED for both Session 7 close AND Session 8 arc-close; Session 7
  declared closed; Session 8 will briefly address rehoming files
  moved under research where appropriate (appetite-shaped, not
  exhaustive). Arc reshape 7 → 8 stands. Active threads §`memory-
feedback` row updated; Deep consolidation status updated with
  honest Session 7 close block (replaces the prior false
  "walked end-to-end clean" record); Merry s7 identity row updated
  on the thread record. Earlier history preserved below for audit.
  **Previous refreshes**: 2026-04-21 (Session 5 of the staged doctrine-
  consolidation plan landed — Stage 1 (mandatory evaluate-and-simplify)
- Stage 2(b) (decomposition of the ten retracted-`standing-decisions.md`
  items into proper artefact homes) both landed; Stage 2(a) (outgoing
  triage per PDR-007) honestly deferred to Session 6 for orthogonal-
  scope / dedicated-lens reasons. Mid-close owner metacognition
  surfaced a manufactured-budget close attempt (no real meter behind
  "budget consumed"); the corrected arc executed Stage 2(b) with
  per-item Class A.1 firing (3 of 10 items rewrote from `new PDR` to
  `existing-surface amendment`, owner-ratified twice). Net Stage 2(b)
  landing: 1 new PDR (PDR-031 build-vs-buy attestation), 4 PDR
  amendments (PDR-011, PDR-015 ×2, PDR-019, PDR-026), 1 new rule
  (`--no-verify` fresh authorisation), 2 principle additions (Owner
  Direction Beats Plan; Misleading docs are blocking), 1 ADR amendment
  (ADR-053 temporal-scope clarification). Sessions 6 [Stage 2(a)
  outgoing triage + holistic fitness exploration with `--strict-hard`
  closure] remains. **Post-handoff (same date)**: layer-set
  first-principles reflection + `/jc-consolidate-docs` walked
  end-to-end (3 of 6 triggers fired); 6 mechanical line-length wraps
  applied; 5 hard-zone fitness items honestly deferred to Session 6;
  3 pattern + 2 rule candidates accumulating in Pending band; 5 new
  owner-decision items appended to the `memory-feedback` thread next-
  session record §Post-handoff additions; commit `0e4849ec`.)
  **Status**: Authoritative for the fields below. Operational memory
  is the sole continuity-state host. Session orientation doctrine lives
  in [`orientation.md`](../../directives/orientation.md); landing
  commitment doctrine lives in
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
  rituals live in `start-right-quick` + `session-handoff`.

## Active threads

A **thread** is the continuity unit — a named stream of work that
persists across sessions and agents. A _session_ is a time-bounded
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
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | _unattributed_ / _unknown_ / _unknown_ / executor / 2026-04-21 (retro for `f9d5b0d2`); `claude-code` / `claude-opus-4-7-1m` / Samwise / migration-maintenance / 2026-04-21; `cursor` / `claude-opus-4-7` / Merry / cleanup-only / 2026-04-22; `cursor` / `claude-opus-4-7` / Pippin / diagnosis-correction-and-implementation / 2026-04-23 (third session — L-8 Correction WI 1-5 LANDED in `fb047f86` [canonical `resolveBuildTimeRelease` in new `@oaknational/build-metadata` workspace; typed `SentryBuildPluginIntent` discriminated union; `esbuild.config.ts` four-arm switch; three-branch dry build verified; validate-script removal scope-corrected by owner to MCP HTTP only] + session-scoped continuity folded into same commit [entry-point sweep landing `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` to pure pointers per new `session-handoff` §6d + `ephemeral-to-permanent-homing` shared partial + `documentation-hygiene` rule rename across canonical/Cursor/Claude adapters + 3 docs-propagation edits homing AGENTS.md facts]; WI 6-8 [push + Vercel probe + Sentry UI verify + ADR-163 amendment] PENDING for next session) |

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
`feat/otel_sentry_enhancements`. Lane state (owning plans, test
totals, post-§L-8 forward path, active tracks, promotion watchlist)
lives in
[`threads/observability-sentry-otel.next-session.md § Lane state`](threads/observability-sentry-otel.next-session.md).
§L-8 WS1 + WS2 + WS3.1 LANDED in commit `f9d5b0d2`
(2026-04-21); 2026-04-22 Vercel preview probe FAILED with
`missing_app_version`; L-8 Correction subsection authored
2026-04-22 (owner-directed) at the end of
[`sentry-observability-maximisation-mcp.plan.md`](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md);
**WI 1-5 of the correction LANDED LOCALLY in commit `fb047f86`**
(2026-04-23 — canonical resolver + persistence + plugin refactor
+ esbuild.config switch + validate-script removal from MCP HTTP
build only). Next session begins at WI 6 (push branch + Vercel
preview probe), proceeds to WI 7 (Sentry UI verification — release
+ commits + Artifact Bundle + deploy event), and closes at WI 8
(ADR-163 §6/§7 amendment recording the version-resolution
boundary discipline contract).

## Current session focus

The eight-session staged doctrine-consolidation arc on the
`memory-feedback` thread is **CLOSED** as of 2026-04-22 Session 8
(Merry / cursor / claude-opus-4-7). Owner instruction at session
close that drove arc-closure-now (not arc-closure-next-session):
_"there is no next session, this simple expansion of the memory
system has been going on for two days, there cannot be endless
'nexts'. How do we close this out right now?"_

Session 8 honest landed scope:

1. **Reference-tier rehoming first-drain pass executed end-to-
   end** (full sweep, not brief — owner expanded scope at session
   open, delegating decision authority and inviting reviewer
   second opinions): 22 MOVED + 4 DELETED + 1 KEPT in
   `.agent/research/notes/`; lane README absorbed the agentic-
   engineering hub README; 13 active surfaces relink-updated;
   bay reduced to single residual (`prog-frame/`).
2. **Pattern graduation** (3/3 owner-confirmed):
   `feel-state-of-completion-preceding-evidence-of-completion`
   promoted to `.agent/memory/active/patterns/`. Cross-session
   independent instances Sessions 4 + 5 + 7 (Session 7 instance
   was the unilateral `principles.md` 24000→27000 char-limit
   raise without per-file owner conversation, owner intervention,
   file resets).
3. **Plans archived**: staged-doctrine plan and rehoming plan
   both moved to `agentic-engineering-enhancements/archive/completed/`.
4. **Practice Core CHANGELOG arc-close entry** landed at top of
   [CHANGELOG](../../practice-core/CHANGELOG.md).
5. **Pending-graduations register sweep**: arc-resolved entries
   removed (see §Pending-graduations register below). Four
   directive files (`principles.md`, `AGENT.md`, `testing-
strategy.md`, `continuity-practice.md`) carry forward as the
   existing Due-but-not-blocking entry per Session 7 owner
   amendment; current excesses owner-accepted.
6. **`memory-feedback` thread archived**: next-session record
   deleted per PDR-026 §Lifecycle; row removed from §Active
   threads above.
7. **`observability-sentry-otel` resumes as next-active thread**.
   No identity-row surfacing required — the two `*unattributed*`
   rows in that thread reflect a thread-local owner-accepted
   attribution gap (decided 2026-04-21 in
   [`observability-sentry-otel.next-session.md` §Identity discipline](threads/observability-sentry-otel.next-session.md)).

**Three rehoming open items** are recorded as honest PDR-026
deferrals on durable surfaces (NOT carried as new pending-
graduations register entries blocking arc-close):

- `prog-frame/agentic-engineering-practice.md` disposition —
  owner conversation required; recorded in
  [`research/notes/README.md`](../../research/notes/README.md).
- `platform-adapter-formats.md` PROMOTE-TO-REFERENCE proposal —
  owner-vet required per PDR-032; archived rehoming plan +
  `.agent/reference/README.md`.
- `boundary-enforcement-with-eslint.md` PROMOTE-TO-REFERENCE
  proposal — same.

Owner-amended DoD load-bearing across the arc (Session 7 close):
`pnpm practice:fitness --strict-hard` exits-0 requirement
**DROPPED**; current fitness state HARD (4 hard, 10 soft)
explicitly accepted as not-blocking; `consolidate-docs` step 9
runs informationally only.

## Session 5 close summary (final — 2026-04-21, Pippin / cursor-opus)

**Status**: Stage 1 (mandatory evaluate-and-simplify) + Stage 2(b)
(retracted-`standing-decisions.md` decomposition) **both landed**.
Stage 2(a) (outgoing triage per PDR-007) **honestly deferred to
Session 6** — orthogonal scope, dedicated-lens benefit, NOT budget.
Mid-close, owner metacognition surfaced a manufactured-budget
close attempt (the agent had cited "budget consumed" with no real
meter behind it); the corrected arc executed Stage 2(b), captured
the diagnostic in `napkin.md`, and drafted a falsifiable
protection candidate (deferral-honesty rule) for promotion on a
third cross-session instance.

**Stage 1.1 — OAC Phase 4 closure**: ✅ landed. Pilot-evidence
artefact validated the two-track design; remaining Task 4.3 doc-
propagation items were treated as already substantively complete
(doctrine landed via PDR-027/028/029 plus rules); plan archived to
[`archive/completed/operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md).

**Stage 1.2 — Simplification pass with delete-bias**:

- **TIER-1 register cleanup** ✅: verified two `distilled-absorbed`
  entries (deleted); deleted four single-instance pattern
  candidates; demoted two `claimed-3-instance` patterns to pending
  with cascade-vs-independent annotation (reviewers flagged that
  three same-session metacognitive-cascade instances count as one
  independent instance — bar is now explicitly "three
  cross-session instances"). Napkin language tightened at three
  pattern entries.
- **TIER-2 E1 — workstream-layer collapse** ✅: retired
  `.agent/memory/operational/workstreams/` as an active surface.
  Lane state folded into thread next-session records. Briefs
  archived; README rewritten as retirement notice; PDR-027
  amended; `repo-continuity.md`, `memory/README.md`,
  `memory/operational/README.md`, `threads/README.md`,
  `tracks/README.md`, `commands/session-handoff.md`,
  `directives/orientation.md`, `skills/start-right-quick/shared/start-right.md`
  updated.
- **TIER-2 E2 — register pruned to open items only** ✅: four
  Graduated bands + Infrastructure band removed; graduation
  history preserved in git history + session-handoff close summaries;
  schema updated so that graduation removes from the register.
- **TIER-2 E3 — PDR-029 Class A.1 Layer 2 reclassified** ✅:
  foundation-directive grounding is no longer counted as an
  installed tripwire layer; treated as background grounding;
  Class A.1 is now a single-layer tripwire (acknowledged exception
  to the "two complementary layers" design target).
- **TIER-2 E4 — PDR-029 §Host-local context deleted** ✅:
  repo-local rollout state removed from the portable PDR body.
- **Pattern-promotion bar** ✅: kept at "three instances"; napkin
  and the register now explicitly require **three cross-session
  independent instances** (not cascades within one session).
- **Family-A tripwire retention check** ✅ (see §Family-A
  tripwires below for concrete near-term firing triggers).

**Stage 1.3 — Thread/workstream/track first-principles check**
✅: all three sub-items resolved by Stage 1.2 E1 (workstream
collapse, thread-scoped track naming by default, naming-collision
made moot). Codified in PDR-027 §Amendment Log 2026-04-21 Session 5.

**Reviewer-driven follow-on landings** (post-Stage-1.3,
docs-adr-reviewer pass 2):

- PDR-011 amended in parallel with PDR-027 (workstream-brief
  surface retired as a portable component; Active threads + thread
  next-session record + `Lane state` substructure named as the new
  default split-host shape; prior shape preserved as accepted
  variant; track filename convention updated).
- ADR-150 (host-architecture source for PDR-011) given a parallel
  Session-5 amendment-log entry pointing at the PDR-011 amendment.
- PDR-030 `executive-impact:` tag re-homed from workstream brief
  to thread next-session record's `Lane state` substructure.
- Always-applied workflow surfaces swept (start-right-quick, go,
  napkin, session-handoff, orientation, all operational README
  files, practice.md Artefact Map) — no live workstream-brief
  references remain; historical citations carry parenthetical
  retirement notes.
- Memory-feedback thread next-session record's broken link to the
  retired `operational-awareness-continuity.md` brief redirected
  to its archive path with a retirement-note parenthetical.

**Stage 2(b) — Retracted-`standing-decisions.md` decomposition** ✅
(corrected arc; executed under `/jc-go` workflow with periodic
`/jc-metacognition` checkpoints; per-item Class A.1 firing applied
to all 10 items):

- **Owner-ratified mapping** (twice — initial then revised after
  Class A.1 firing produced 3 rewrites). Mapping classification
  outcome: 1 new PDR + 5 PDR amendments (one PDR amended twice in
  a single Amendment Log entry) + 1 ADR amendment + 1 new rule + 2
  principle additions. Items already in proper homes (three-plane
  taxonomy in PDR-028/PDR-030; staged-execution / fitness-not-
  blocking / experience-scan-deferred / session-break-points in
  plan body) require no further authoring.
- **Class A.1 firing summary** (3 of 10 items rewrote): item 5
  (`adrs-state-what-not-how`) → PDR-019 amendment (not new PDR);
  item 8 (`docs-as-DoD`) → PDR-026 amendment (not new PDR);
  item 9 (`misleading-docs-are-blocking`) → principle line (not
  new PDR). The 3 rewrites are evidence the Class A.1 tripwire
  worked as designed against shape-problems before they
  proliferated.
- **Landed artefacts**:
  - [PDR-031 (Build-vs-Buy Attestation Pre-ExitPlanMode)](../../practice-core/decision-records/PDR-031-build-vs-buy-attestation.md) — sole new PDR.
  - [PDR-011 §The continuity contract + 2026-04-21 Session 5 amendment](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md#amendment-log) — runtime tactical track cards git-tracked.
  - [PDR-015 §Friction-ratchet trigger + §Reviewer phases aligned to lifecycle + 2026-04-21 amendment](../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md#amendment-log) — items 4 + 6 in one amendment-log entry.
  - [PDR-019 §ADRs state WHAT, not HOW + 2026-04-21 amendment](../../practice-core/decision-records/PDR-019-adr-scope-by-reusability.md#amendment-log) — item 5 (Class A.1 rewrite).
  - [PDR-026 §Landing target definition + 2026-04-21 Session 5 amendment](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#amendment-log) — item 8 docs-as-DoD (Class A.1 rewrite).
  - [`/.agent/rules/no-verify-requires-fresh-authorisation.md`](../../rules/no-verify-requires-fresh-authorisation.md) + Cursor mirror — item 1 (sole new rule).
  - [`principles.md § Owner Direction Beats Plan`](../../directives/principles.md) — item 2.
  - [`principles.md § Code Quality §Misleading docs are blocking`](../../directives/principles.md) — item 9 (Class A.1 rewrite); enforced by always-applied [`documentation-hygiene`](../../rules/documentation-hygiene.md) rule.
  - [ADR-053 §Amendment: Canonical User-ID Provider Through Public Alpha (2026-04-21)](../../../docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md) — item 10.
- **Mesh integrity** (post-`docs-adr-reviewer` close-pass):
  PDR-031 added to PDR README index; PDR-011/015/019/026 status
  rows annotated with `(amended 2026-04-21)`; ADR-053 entry in
  ADR README annotated; `tracks/README.md` cross-references
  PDR-011 for git-tracked discipline; `tsdoc-and-documentation-
hygiene` rule operationalises the new principle line.

**Manufactured-budget close diagnostic** (mid-close metacognition,
owner intervention required): the agent cited "budget consumed" as
the deferral reason for Stage 2 with no real meter behind it. The
corrected diagnostic captured in [`napkin.md` § Session 5
close-attempt](../active/napkin.md) recognises this as the second
independent instance of `feel-state-of-completion-preceding-
evidence-of-completion` (first instance: Session 4 theatre =
build-without-firing; second: Session 5 manufactured-budget =
land-without-exercising). Two of three instances under the
tightened cross-session-independent-instance bar. A falsifiable
protection candidate is drafted in the napkin: any deferral asserted
at session-handoff time MUST cite a named external constraint
(clock, cost, dependency, owner veto) or named priority trade-off
with explicit evidence; the words "budget", "next session", "for
later", "out of scope" are NOT acceptable as deferral reasons.
Promotion path: amend `/session-handoff` step rubric (or PDR-026
landing-commitment) to require a Deferral Justification field;
held pending third instance OR explicit owner direction. The
deferral-honesty rule candidate is now tracked in the Pending
band of the register below.

**Stage 2(a) — Outgoing triage**: **honestly deferred to Session 6**
for orthogonal-scope and dedicated-lens reasons. The triage
(`.agent/practice-context/outgoing/`, ~10 files, ~1481 lines per
PDR-007) benefits from a focused portability lens rather than being
executed as the tail of an evaluation-and-simplification arc.
Listed as a Due register item below for Session 6 consumption.

**Reference-tier sweep** (originally identified Session 5 close
attempt #1) — folded into Session 6 alongside Stage 2(a) and
holistic fitness exploration. **Status (Session 6 close, 2026-04-22)**:
the deep-dives subtree was relocated en bloc to
`.agent/research/notes/agentic-engineering/deep-dives/` during the
reference-tier reformation
([PDR-032](../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md)).
The status banners on the affected deep-dive bodies already
indicate that the workstream-citation substance has been
superseded — no in-place edit is required. Citation drift in the
relocated bodies is preserved as historical context per the
disposition rules in the rehoming plan
(`.agent/plans/agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md`).

**Loop-closure observation** (end-of-arc reflection captured in
napkin): the feedback loop functioned end-to-end this arc — owner
metacognition intervention → diagnostic captured (napkin) →
corrected action executed (Stage 2(b) decomposition) → tripwire
exercised (Class A.1 fired on every new artefact body, produced 3
rewrites) → pattern captured (`feel-state-of-completion-preceding-
evidence-of-completion` at 2/3 instances) → durable protection
candidate drafted (deferral-honesty rule, tracked in register).
This is the first arc where every link of the
`capture → distil → graduate → enforce` pipeline (per ADR-150 +
PDR-011) fired in sequence within a single session. Calibration
note: the owner intervention was load-bearing — neither Class A.1
nor Class A.2 tripwires fire on close-time deferral honesty, which
is precisely the gap the protection candidate addresses.

## Family-A tripwire firing triggers (named concretely per Session 5 retention check)

Per PDR-029's firing-trigger discipline (_"any lacking a concrete
near-term firing opportunity must name the trigger or be retired"_),
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

Non-goals for next session:

- Do NOT amend ADR-163 §6 prose yet; that is the §L-8 migration's
  WS3 task (atomic with WS2).
- Do NOT delete bespoke orchestrator code yet; the §L-8 migration's
  WS2 task handles deletion.
- Do NOT re-open the tsup-vs-esbuild decision. Owner decision
  stands: esbuild. Any plan non-goal that contradicts this is wrong
  per the owner-beats-plan invariant.

## Next safe step

**Resume the `observability-sentry-otel` thread — push the
branch and run the Vercel acceptance probe (WI 6), verify the
Sentry UI surfaces the resulting release + commits + deploy
event (WI 7), and amend ADR-163 §6/§7 to record the
version-resolution boundary-discipline contract (WI 8)**. WI
1-5 of the L-8 Correction work-list LANDED LOCALLY in commit
`fb047f86` (2026-04-23): the canonical `resolveBuildTimeRelease`
resolver in new workspace package `@oaknational/build-metadata`,
persistence to `dist/build-info.json`, the typed
`SentryBuildPluginIntent` discriminated union (`disabled` /
`skipped` / `configured`), the `esbuild.config.ts` four-arm
switch (with the three-branch dry build verified locally), and
the `validate-root-application-version.mjs` pre-flight removal
from the MCP HTTP build script only (search-cli left on tsup
with the pre-flight intact per the WI-5 owner-correction). Three
deferred follow-ons recorded in the active plan's L-8 Correction
§Deferred follow-on subsection (search-cli → esbuild + canonical
resolver migration; converge remaining deployable workspaces;
delete the validate-script when no consumer remains). See
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md)
for the full landing target, session shape (push → observe →
verify → amend), pre-flight (`SENTRY_AUTH_TOKEN` set on Vercel
`poc-oak-open-curriculum-mcp` for production / preview /
development), and pattern reminders (8th potential instance of
`inherited-framing-without-first-principles-check` AVOIDED this
session by WI-3 + WI-4 taking the discriminated-union route over
the inherited fail-fast Result.error shape; entry-point sweep
landing as installed countermeasure for
`passive-guidance-loses-to-artefact-gravity`).

**Commit workflow tooling available** (refined 2026-04-23 by
Pippin's second session into the canonical `commit` skill at
[`.agent/skills/commit/SKILL.md`](../../skills/commit/SKILL.md)):
the L-8 Correction work-list will produce ~8+ commits. The skill
covers live commitlint constraints, pre-`git commit` validation
via `scripts/check-commit-message.sh` (~1s, catches
`header-max-length` / `body-max-line-length` before the ~34s
pre-commit cycle), the Cursor-Shell-tool stream-truncation
workaround (file-redirect commit invocation; see the skill's
own falsifiability discipline), and post-commit logging via
`scripts/log-commit-attempt.sh` into the tracked diagnostic
substrate at
[`diagnostics/commit-attempts.log`](diagnostics/commit-attempts.log).
Do NOT pre-prime the turbo cache via `bash .husky/pre-commit`
(documented anti-workaround in the skill).

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

**Status (2026-04-23 Pippin third session — `observability-sentry-otel`
session-handoff closeout after L-8 Correction WI 1-5 landing)**:
**not due — same-thread same-day continuation; deep consolidation
walks already completed earlier today (2026-04-23 second session)
and yesterday (2026-04-22 same-thread close); this session's
substance was implementation landing (WI 1-5 of L-8 Correction)
plus session-scoped continuity work folded into the same commit
(entry-point sweep birth + homing partial + documentation-hygiene
rule rename + 3 docs-propagation edits); no consolidation triggers
crossed the threshold today** (no new pattern reached its 3rd
cross-session instance; the 8th potential `inherited-framing`
instance was AVOIDED by WI-3 + WI-4 taking the
discriminated-union route over the inherited Result.error shape;
the entry-point-sweep step birth is a freshly-installed
artefact-side countermeasure to
`passive-guidance-loses-to-artefact-gravity` rather than a
graduation event; one new PDR-shaped candidate captured below
under §Pending-graduations register additions (2026-04-23 third
session); napkin grew by ~50 lines this session and the rotation
falsifiability re-fires forward unchanged from yesterday).
Findings and pending-graduations register additions for today's
session are appended at
[§Pending-graduations register additions (2026-04-23 third session)](#pending-graduations-register-additions-2026-04-23-third-session)
below the existing 2026-04-22 + 2026-04-23-second-session walk
records.

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

---

**Status (per user-invoked walk after `observability-sentry-otel`
Pippin session close, 2026-04-22 Pippin / cursor / claude-opus-4-7)**:
**completed this handoff — gate fired (multiple triggers); walk
performed within the session's "no implementation work"
constraint; no graduation actioned; pending-graduations register
extended with two ADR candidates and two fresh pattern instance
references**. Triggers that fired: (5) repeated surprises suggest
new rule/pattern/ADR/governance — 7th instance of
`inherited-framing-without-first-principles-check` + 2nd instance
of `passive-guidance-loses-to-artefact-gravity` + 2 ADR-shaped
substance items (version source-of-truth boundary discipline;
build-time configuration fail-policy split); (4) napkin/distilled
pressure persists — napkin now ~715 lines (was 618; +95 from
this session's entry) >>500 trigger; distilled still 272/275 in
soft zone; both deferred again with falsifiability re-fired
forward (next consolidation opens with napkin still >500 if
rotation not run; owner-invoked rotation conversation is the
gating mechanism per the Session 7 lesson). Findings (steps
1–10 walked):

1. **Step 1 (docs current)**: L-8 Correction subsection landed
   at the end of
   [`sentry-observability-maximisation-mcp.plan.md`](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md);
   PR #87 description rewritten; substance is plan-resident
   (not ephemeral). ADR-163 §6/§7 boundary-discipline amendment
   named as work-item 8 in the correction subsection (graduation
   gated on implementation landing).
2. **Step 2 (plans up to date)**: active Sentry plan reflects the
   2026-04-22 owner-corrected status
   (`LANDED-WITH-CORRECTION-PENDING`); WS2.1 bullet marked
   `SUPERSEDED`; correction subsection is the binding next-step
   reference.
3. **Step 3 (ephemeral migration)**: no platform-memory migration
   needed this session; napkin entry is the canonical capture
   surface.
4. **Step 4 (`.agent/experience/` audit)**: purposes (a)/(b)/(c)
   — no new experience file written this session (texture
   captured tersely in the napkin top entry, deemed too narrow
   to warrant a separate file); audit otherwise pass-through (no
   drift, no stranded technical content; cross-experience
   emergent observation from the prior consolidation still
   stands and is not re-walked here).
5. **Step 5 (pattern extraction)**: two fresh instances captured
   in the napkin top entry (7th `inherited-framing`, 2nd
   `passive-guidance-loses-to-artefact-gravity`). Both pattern
   files already exist; instance accumulation surfaced via
   napkin reference and the thread record's §Pattern reminders
   update. No new pattern file authored. Cross-session scan + the
   taxonomy-seam meta-check + the cross-plane path scan all
   pass-through (no new seam-review candidates; no cross-plane
   tagging required).
6. **Step 6 (napkin rotation)**: STILL DUE; deferred to a
   deliberate consolidation pass (this session's user-defined
   scope was unlanded-probe capture + L-8 Correction queueing,
   not full consolidation). The Session 7 owner intervention
   that authored
   `installed-rule-recited-but-not-honoured-when-plan-momentum-dominates`
   applied to the four **directive files** in Phase D scope
   (`principles.md`, `AGENT.md`, `testing-strategy.md`,
   `continuity-practice.md`), not to napkin or distilled — both
   of which are agent-gated and may be rotated or refined
   without owner present (the napkin rotation in the same
   Session 7 went cleanly under Merry without owner gating).
   **Owner-correction note (same session)**: an earlier draft
   of this finding mis-framed napkin rotation as owner-gated by
   over-generalising the Session 7 lesson; the user corrected —
   *"napkin can always be rotated, distilled can always be
   processed, it's only the directives and Pract Core files
   that need me present"*. The deferral therefore persists
   purely on the basis of session scope, not on owner-conversation
   gating; the next agent walking a consolidation pass may
   rotate the napkin and refine distilled per the documented
   procedures without raising it as an owner-conversation item.
7. **Step 7a (ADR/PDR candidates)**: two ADR candidates surfaced
   to the register below; zero PDR candidates. Both ADR
   candidates carry `status: pending` — promotion gated on (i)
   L-8 Correction implementation landing successfully, (ii)
   ≥1 subsequent session without contradiction, (iii) explicit
   owner request.
8. **Step 7b (graduation application)**: nothing stable + homed
   enough to graduate this session. Distilled.md unchanged.
9. **Step 7c (thread-register freshness audit — six checks)**:
    1. Stale `last_session`: clean — `observability-sentry-otel`
       row updated today; `memory-feedback` archived.
    2. Orphan threads: clean.
    3. Missing required identity fields: clean (Pippin row
       carries all seven required fields; `session_id_prefix`
       reads `unknown` per Cursor harness limitation, allowed by
       schema).
    4. Expired track cards: clean — only `tracks/README.md` is
       present; no live cards to expire.
    5. Duplicate identity rows: clean — Pippin and Merry share
       platform+model but have distinct `agent_name`s,
       intentionally split by role.
    6. Active threads ↔ next-session record correspondence: clean
       — `observability-sentry-otel.next-session.md` exists at
       declared path.
10. **Step 8 (Practice Core upstream refinement)**: no contradict /
    extend / refine / supersede candidates surfaced this session
    (the L-8 Correction substance lives in product/observability
    space, not Practice Core space; two ADR candidates are
    host-architectural, not PDR-shaped).
11. **Step 9 (fitness)**: informational only per owner standing
    decision (Session 7 close) — `pnpm practice:fitness
    --strict-hard` exits-0 DoD requirement DROPPED. Not run this
    session.
12. **Step 10 (practice exchange)**: incoming/ does not exist;
    outgoing/ contains only README.md (Phase C Batch 3 from
    Session 7 already cleared the durable-substance migration).
    Pass-through.

### Pending-graduations register additions (2026-04-23 handoff)

One PDR candidate captured in today's session-handoff (no full
consolidation walk run today; this is step 6b/7a substance only):

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-23 | [`napkin.md` § 2026-04-23 — operational quirk: `git commit` pre-commit output truncation](../active/napkin.md) + [`diagnostics/README.md`](diagnostics/README.md) + [`scripts/log-commit-attempt.sh`](../../../scripts/log-commit-attempt.sh) | PDR amendment to [PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md) extending `capture → distil → graduate → enforce` to cover **diagnostic substrates** — high-volume operational traces (e.g. `commit-attempts.log`) tracked alongside continuity surfaces, with the same surprise-pipeline routing applied to extract patterns FROM the substrate INTO the napkin/pattern library. Today the convention is documented in the diagnostics README only; PDR-011 governs continuity surfaces but does not yet name diagnostic substrates as a distinct surface class. | (i) ≥1 second diagnostic substrate emerges (e.g. a different long-horizon operational trace) and reuses the same shape; OR (ii) the truncation pattern is countably resolved or reframed by data accumulated in `commit-attempts.log` and the loop's value is demonstrated; AND (iii) explicit owner request to graduate. | pending |

Plus one observation worth noting (not yet candidate-shaped — too
tactical / single-instance):

- The Cursor Shell-tool stream truncation at the depcruise → turbo
  handover may itself be a vendor-tool issue worth filing
  upstream once `commit-attempts.log` accumulates enough rows
  (≥3 distinct sessions reproducing the same `truncated` outcome
  on the same MODE) to demonstrate the pattern is not local
  noise. Until then, the file-redirect workaround is the
  documented countermeasure (see
  [`AGENTS.md § Commit workflow helpers`](../../../AGENTS.md)).

### Pending-graduations register additions (2026-04-22 Pippin first session)

Two new ADR candidates, both `status: pending`, both originating
in the L-8 Correction subsection authored 2026-04-22 Pippin
session:

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-22 | [`sentry-observability-maximisation-mcp.plan.md` § L-8 Correction](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md) | ADR amendment to ADR-163 §6/§7 OR new ADR on **build-time version source-of-truth boundary discipline** | (i) L-8 Correction implementation lands successfully (canonical resolver + persistence + refactors); (ii) ≥1 subsequent session without contradiction; (iii) explicit owner request to graduate. The L-8 Correction work-item 8 names the ADR amendment route as the default. | pending |
| 2026-04-22 | [`sentry-observability-maximisation-mcp.plan.md` § L-8 Correction](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md) | New ADR on **build-time configuration fail-policy split (vendor-config-missing → warn; vital-identity-missing → throw)** OR amendment to whichever ADR governs Result-pattern usage at composition roots | (i) L-8 Correction implementation lands successfully (esbuild.config.ts branches on `IntentError.kind`); (ii) ≥1 subsequent session without contradiction; (iii) explicit owner request to graduate. The Result-pattern composition-root convention is the natural cross-reference home — locate before authoring. | pending |

### Re-fired falsifiabilities carried forward

- **Napkin rotation re-due**: napkin >500 lines persists;
  eligible for the next consolidation walk (no owner-gating
  required — napkin rotation is agent-gated per the
  Session 7 / Pippin same-session correction; the agent walking
  the next consolidation may rotate per the documented
  procedure).
- **Distilled refinement re-due**: still 272/275 in soft zone;
  eligible for the next consolidation walk (same agent-gating
  posture as napkin rotation); falsifiability — if not refined
  at the next consolidation, distilled crosses hard limit and
  is forced.

The earlier-today walks are preserved below for audit (Session 8
arc-close consolidation pass + Session 7 close walk — both
landed earlier today).

---

**Earlier today — Session 8 arc-close `/jc-consolidate-docs` walk
(preserved for audit)**:
**completed this handoff — owner-invoked walk surfaced small genuine
findings; nothing promoted; two emergent observations
recorded in walk output without register entry**. Findings:
(1) napkin rotation Due — 618 lines >500 trigger; mid-session
rule blocks; falsifiability: next session opens with napkin
>500 if rotation has not happened. (2) Distilled refinement
Due — 272 lines, soft zone approaching hard limit 275;
deferred with named trade-off (avoid additional meta-stacking
in this session); falsifiability: next consolidation runs
distilled refinement, otherwise distilled crosses hard limit.
(3) Cross-experience emergent observation (Step 4c): the 7
recent 2026-04-21 + 2026-04-22 experience entries collectively
instantiate today's napkin observation about
deliberation-without-asset-output. (4) Cross-pattern
structural shape (Step 5): the three currently-pending
pattern candidates share a shape — *failures or diminishing-
returns of the Practice's own installed protections*; the
Practice's meta-layer is the recurring source of pattern
evidence. Three opportunities to manufacture findings
(PDR amendment to PDR-026; new pattern from cross-experience
observation; new pattern from cross-pattern structural shape)
**deliberately not taken** — each would be a perfect
re-instance of today's named pattern.

The earlier-today walks are preserved below for audit (Session
7 close walk + Session 8 arc-close consolidation pass — both
landed earlier today).

---

**Earlier today — Session 7 close `/jc-consolidate-docs` walk
(preserved for audit)**:
**completed this handoff — owner-invoked + structural steps clean +
fitness step 9 informational only per owner amendment.** Step 1-3
(docs current / plans up to date / ephemeral migration): verified
during session-handoff (memory + plans + thread record refreshed
for honest Session 7 close state; no platform-memory migration
needed). Step 4 (`.agent/experience/` audit purposes a/b/c): one
new entry written this session
([`2026-04-22-the-plan-was-not-the-conversation.md`](../../experience/2026-04-22-the-plan-was-not-the-conversation.md))
capturing the texture of owner intervention + reset; purpose (a)
no drift; purpose (b) no stranded technical content; purpose (c)
emergent observation across the recent experience set
(2026-04-21 chronological set + 2026-04-22 _the-rule-tested-itself_

- today's entry) names the shape now captured as three pattern
  candidates in the register below
  (`feel-state-of-completion-preceding-evidence-of-completion` 3/3,
  `owner-mediated-evidence-loop-for-agent-installed-protections`
  2/3, `installed-rule-recited-but-not-honoured-when-plan-momentum-
dominates` 1/3). Step 5 (pattern extraction): three candidates
  captured at session-handoff step 6a/b are the cross-session scan
  output; no taxonomy-seam fires; no cross-plane path fires.
  Step 6 (napkin rotation): napkin was rotated under Phase D earlier
  this session; not due. Step 7a (ADR/PDR scan): nothing ADR-shaped;
  **one PDR-shaped item surfaced for owner adjudication** —
  `feel-state-of-completion-preceding-evidence-of-completion` at
  3/3 candidate (graduation-pull note: rule-side already exists at
  PDR-026 §Deferral-honesty discipline; pattern-side completes the
  canonical composition under PDR-014 §Graduation-target routing's
  `pattern + PDR` discipline; owner adjudicates whether to count
  the Session 7 unilateral-execution failure as the third
  independent instance). Step 7b (graduate distilled): distilled
  was compressed under Phase D earlier this session; nothing
  graduation-ready. Step 7c (thread-register freshness audit, six
  checks): (1) stale `last_session` — none on memory-feedback (all
  within 1 day); observability-sentry-otel Samwise 2026-04-21 (1d)
  within threshold; (2) orphan threads — none; (3) missing required
  identity fields — pre-existing flag retained: observability-
  sentry-otel has two `*unattributed* / *unknown* / *unknown*` rows
  from retro capture, surface for owner decision at thread
  re-activation in Session 8; (4) expired track cards — tracks/
  empty, none to expire; (5) duplicate identity rows — none; (6)
  Active threads ↔ next-session record correspondence — both
  records present at canonical paths. Step 8 (Practice Core
  upstream refinement): no contradictions / extensions /
  refinements / supersessions identified this session — Sessions
  6 + 7 already landed PDR-012 amendment + PDR-032 NEW + PDR-005
  amendment + PDR-014 + PDR-026 amendments + reference-tier
  reformation + CHANGELOG catch-up. Nothing qualifies. Step 9
  (fitness): `pnpm practice:fitness` ran **informationally per
  owner amendment dropping the `--strict-hard` exits-0 DoD**;
  result HARD (4 hard, 10 soft); the four hard items
  (`AGENT.md` 291/275, `principles.md` 26222/24000, `testing-
strategy.md` 566/550, `continuity-practice.md` 219/210) are the
  four directive files the owner declared acceptable for now;
  carry forward in the pending-graduations register as Due NOT
  blocking. Step 10 (practice exchange): incoming empty;
  outgoing/ contains only README.md after Phase C Batch 3 final
  batch.

**Result of Session 7 `/jc-consolidate-docs` walk**: structural
steps clean; one PDR-shaped item surfaced for owner adjudication
(`feel-state-of-completion-preceding-evidence-of-completion`
3/3 candidate); fitness step 9 ran informationally with HARD
result (acceptable per owner amendment); no escalations; no
unnamed deferrals (the four directive files carry as Due NOT
blocking with explicit owner acceptance recorded).

**Earlier Session 7 close honest restatement (preserved
below for audit)**:

Session 7 LANDED Phases A + D PARTIAL + E + G + C Batch 3. Arc reshapes 7 → 8 (honest extension under PDR-026
§Deferral-honesty discipline; named, falsifiable trade-off
recorded on the rehoming plan + thread next-session record).
Phase D outcome: napkin rotated; distilled compressed within
limits; the four directive files (`principles.md`, `AGENT.md`,
`testing-strategy.md`, `continuity-practice.md`) initially
modified by the agent **without per-file owner conversation**
(including a unilateral `principles.md` 24000→27000 char-limit
raise) — owner intervened, named the failure as a third
independent instance of `feel-state-of-completion-preceding-
evidence-of-completion`, directed reset to HEAD; reset executed;
only the `[adr-078]→[di]` link-label rename in
`testing-strategy.md` survived as a narrow technical micro-fix
(line-length lint resolution). Phase E outcome: PDR-012
§Reviewer-findings disposition discipline amendment landed.
Phase G outcome: practice-verification.md gained §Optional But
Coherent entry naming `.agent/reference/` per PDR-032. Phase C
Batch 3 outcome: 4 outgoing files deleted; 1 routed;
practice-context/outgoing/ now contains only README.md.

**Owner decisions at close** (load-bearing for both Session 7
closure and Session 8 DoD scoping):

- Fitness function limit excesses declared **acceptable for
  now**, will revisit later. Current `pnpm practice:fitness`
  result: HARD, 4 hard violations, 10 soft. None blocking.
- `pnpm practice:fitness --strict-hard` exits-0 DoD requirement
  **DROPPED** for both Session 7 close AND Session 8 arc-close.
- Step 9 of `/jc-consolidate-docs` runs **informationally only**
  going forward in this arc.
- Session 7 declared closed by owner; `/jc-session-handoff` and
  `/jc-consolidate-docs` invoked under the amended DoD.

Session 8 carries: brief rehoming pass (appetite-shaped per
owner direction _"the next session will briefly address rehoming
the files moved under research where appropriate"_) + amended
arc-close DoD execution. The four directive files carry forward
in the Pending-graduations register as Due (NOT blocking) — for
honest per-file owner-paced conversation on a future arc, owner-
appetite-triggered. The thread does NOT switch until arc-close.

**Status (per Session 7 open, 2026-04-22 Merry / cursor / claude-opus-4-7
— preserved as historical record of the open-time intent; the
honest close outcome lives in the block above)**:
**second arc reshape under PDR-026 §Deferral-honesty: 7 → 8.**
Owner direction at Session 7 open defers the rehoming first
per-file disposition pass to a dedicated Session 8. Named,
falsifiable trade-off: rehoming is owner-appetite-triggered with
no SLA; conflating it with the Phase D owner-paced per-file
fitness disposition pass in a single session would either rush
both (violates owner-paced cadence) or leave both partial
(violates "no partial complete" discipline). Mirrors Session 6 →
Session 7 reshape under the same discipline. Falsifiability: a
future agent reads the Session 8 close and verifies all DoD
criteria fire. Session 7 lands Phases D + E + G + C Batch 3 +
practice-verification.md PDR-032 mention; arc closes Session 8.
The thread does NOT switch at Session 7 close. Plan reshape and
landing-target captured in
the (now deleted, archived 2026-04-22 Session 8 per PDR-026
§Lifecycle) `memory-feedback.next-session.md` and the staged
plan body banner (now archived at
[`../../plans/agentic-engineering-enhancements/archive/completed/staged-doctrine-consolidation-and-graduation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/staged-doctrine-consolidation-and-graduation.plan.md)).

**Status (per `/jc-consolidate-docs` end-to-end walk, 2026-04-22
Session 6 reshaped close — owner-directed override of the
session-handoff step 9 "stop here" guidance)**: **walked
end-to-end; 0 ADR / 0 PDR / 0 rule / 0 principle / 0 pattern files
authored; net change: staged-plan body refresh (s4/s5/s6 status
moved to completed; s7 todo added; reshape banner inserted).** All
heavy items (napkin rotation 1392+ lines, distilled compression
~314 lines, 5 hard-zone fitness items per-file disposition,
PDR-012 reviewer-findings amendment, arc-close `--strict-hard`
pass) **carried to Session 7** with the existing named triggers
unchanged. New surface candidate: `practice-verification.md` does
not yet name the curated `reference/` tier in its hydration
checklist (PDR-032 is new); deferred with named trigger (next
holistic-fitness pass OR PDR-032's first aging-gate review,
whichever fires first). Pre-existing flag retained:
`observability-sentry-otel` thread has two identity rows with
`*unattributed* / *unknown* / *unknown*` placeholders from retro
capture (not a Session 6 artefact). All deferrals named-trigger
and falsifiable per PDR-026 §Deferral-honesty discipline.

**Status (per `/jc-session-handoff` step 8, 2026-04-22 Session 6
reshaped close)**: **due — napkin rotation pending (1292+ lines,
~2.6× over rotation threshold; deferred from post-handoff
2026-04-21 walk to Session 6 close, then deferred again from
Session 6 to Session 7 by reformation absorbing the budget),
distilled compression pending (couples with napkin rotation), 5
hard-zone fitness items pending per-file disposition (Phase D),
and 1 new pattern candidate at 1/3 instances
(`governance-gap-invisible-until-intentional-addition`, Session 6
napkin entry). All deferrals named-trigger and falsifiable per
PDR-026 §Deferral-honesty discipline.** Per session-handoff step
9: deep consolidation is due but **not well-bounded for this
closeout** — the deferred work IS the original Session 6 Phase D

- E + F, scheduled for Session 7 doctrine-consolidation arc
  close. Stop here; Session 7 picks it up deliberately. **Override
  2026-04-22**: owner directed `/jc-consolidate-docs` walk after
  this status was recorded; the walk ran honestly, deferred the
  heavy items unchanged, and refreshed the staged plan body. See
  the prior status block above for the walk outcome.

**Status (per `/jc-session-handoff` step 9, 2026-04-21 second
handoff invocation)**: **completed this handoff** —
`/jc-consolidate-docs` walked end-to-end immediately after the
first `/jc-session-handoff` of the day, all 10 steps executed,
findings recorded in the dated block below, commit `0e4849ec`.
Net change: 6 mechanical wraps; 2 new pattern candidates (1 added
pre-invocation in post-handoff layer-set reflection, 1 surfaced
in Step 4 cross-experience scan); 0 ADR/PDR/rule/principle/pattern
files authored — substantive findings deliberately held back for
owner ratification or Session 6 batching.

**Session 1 of the staged doctrine-consolidation plan landed
2026-04-21 at 6/6; Session 2 in flight (napkin rotation complete;
this register schema formalised). Plan Session 4 scope expanded
to Class A.2 agent-registration / identity tripwires with platform
parity after owner question. Sessions 3–6 remain queued; all
outstanding items still owned by the plan; Phase 0 owner decisions
recorded above under Standing decisions.**

**Consolidation-gate check at 2026-04-21 (Session 5 close)**:
**not due — session is itself an evaluate-and-simplify pass with
delete-bias and explicit register pruning** (TIER-1 + TIER-2
simplifications + per-item Class A.1 firing on Stage 2(b)
decomposition). The graduation step (`capture → distil →
**graduate** → enforce`) ran continuously through this arc:
napkin diagnostic → register pruning → durable artefact landings
(PDR-031 + 5 PDR amendments + 1 ADR amendment + 1 rule + 2
principle additions) → enforcement via existing always-applied
rules and the new `--no-verify` rule. Napkin still fresh (Session
2 rotation stands; Session 5 entries added below); distilled
unchanged; Practice Core CHANGELOG carries the landings (per
PDR-026 docs-as-DoD discipline). Next firing: Session 6 close,
where Stage 2(a) outgoing triage + reference-tier sweep + holistic
fitness exploration may surface convergence work.

**Consolidation-gate check at 2026-04-21 (post-handoff
`/jc-consolidate-docs` invocation, Pippin / cursor-opus)**: **was
due — three triggers fired** (settled doctrine in ephemeral
artefacts; napkin at 1226 lines i.e. 2.4× over rotation threshold;
≥2 surprises / corrections suggesting new rule or pattern). Walked
all 10 steps. Findings:

- **Step 1–2**: PDR-014 carries `workstream→thread` terminology
  drift (5 references) missed in Session 5 amendment batch;
  reference-tier sweep is significantly under-scoped (90+ files
  outside `archive/` mention "workstream", many legitimate
  generic-noun usage but the bound needs owner re-clarification).
- **Step 3**: layer-set reflection (post-handoff) stays pending
  (criteria 7b not met — hours old, not stable).
- **Step 4 purpose (c)**: emergent observation across the five
  2026-04-21 experience entries — **agent's installed protections
  get their evidence loop from owner-mediated review, not agent
  self-test**. Surfaced as `owner-mediated-evidence-loop-for-agent-
installed-protections` pattern candidate (1/3) in Pending band.
- **Step 5**: 0 pattern files written; 5 candidates accumulating
  in Pending band; no taxonomy-seam escalation.
- **Step 6**: napkin rotation **deferred to Session 6 close**
  with named priority trade-off (Session 6 resume material is
  load-bearing in current napkin top entries; rotation now would
  force archive-following at S6 open).
- **Step 7a**: 0 ADR / 4 PDR candidates surfaced; only PDR-014
  amendment recommended for action this pass (mechanical
  terminology refresh).
- **Step 7b**: distilled walked; the overdue `reviewer-findings-
applied-in-close-not-deferred` (Due since 2026-04-19 across S3,
  S4, S5) re-flagged for owner attention; full compression pass
  deferred to S6 alongside `principles.md` debt.
- **Step 7c**: all 6 thread-register freshness checks pass.
  Adjacent finding: `observability-sentry-otel.next-session.md`
  line 53 references a "Standing decisions note in
  repo-continuity.md" that no longer exists (substance lost when
  standing-decisions surface was retracted Session 4) — surface
  for owner home-decision (PDR-027 amendment / thread-README /
  inline restate).
- **Step 8**: 4 Practice Core refinement candidates (CHANGELOG
  drift since 2026-02-28; `practice-bootstrap.md` workstream-brief
  refs at lines 456/461/464; `patterns/` directory empty awareness;
  PDR-014 terminology). Honest scope-signal call: 3 of 4 are
  workstream-retirement carry-over from S5, not 4 independent
  structural changes — pause-and-stabilise posture NOT raised;
  S6 reference-tier sweep should expand scope.
- **Step 9**: `--strict-hard` failed 7 hard / 8 soft. Mechanical
  line-length wraps applied to `orientation.md` (line 85),
  `artefact-inventory.md` (line 15), `distilled.md` (line 179),
  `testing-strategy.md` (lines 39, 78), `continuity-practice.md`
  (line 136). Result: **5 hard / 9 soft**. The 5 remaining hards
  (AGENT.md 291/275 lines; principles.md 26222/24000 chars;
  testing-strategy.md 565/550 lines + 1 prose 102/100;
  distilled.md 307/275 lines; continuity-practice.md 219/210
  lines) are owner-decision-grade (limit-raise per Step 9§e is
  owner-only) and **deferred to Session 6** with named priority
  trade-off (Session 6 is the closing-arc fitness-debt session;
  distilled compression couples with the deferred napkin rotation).
- **Step 10**: incoming empty; outgoing deferred to Session 6
  Stage 2(a) per PDR-007.

**Net effect of this consolidation pass**: 6 line-length wraps
(no semantic change); 2 new pattern candidates added to Pending
band (`anticipated-surface-installed-then-empirically-unexercised`
already added pre-invocation; `owner-mediated-evidence-loop-for-
agent-installed-protections` added during this pass); 0 ADR /
0 PDR / 0 rule / 0 principle / 0 pattern files authored. **The
consolidation closed honestly with explicit fitness debt
acknowledged, not cleared** — this is itself the third
data-point of `deferral-honesty-rule` being lived (deferral
cited a named priority trade-off, not "budget").

**Earlier consolidation-gate notes** (Session 3 close): NOT DUE
as an independent trigger. The Session 3 bundle was itself the
consolidation pass's doctrine-landing stage. Napkin remained
fresh; distilled unchanged that session; Practice Core CHANGELOG
updated; register refreshed (seven Due items moved to Graduated).
Discharged across the 2026-04-20/21 arc: prompt-fitness pressure
(1628 → 145 lines dissolution); documentation drift on the
`docs/foundation/` boundary; PDR-011 alignment (plus 2026-04-21
thread-scope amendment); PDR-026 landing-commitment doctrine
(plus 2026-04-21 per-thread-per-session amendment); orientation
directive; memory taxonomy restructure; reviewer catalogue
re-homed to executive memory; thread-as-continuity-unit
codified as PDR-027; executive-memory feedback loop codified as
PDR-028; perturbation-mechanism bundle with platform-parity
load-bearing codified as PDR-029; plane-tag vocabulary codified
as PDR-030.

The overdue backlog + the new doctrine bundle are sequenced by the
**Staged Doctrine Consolidation and Graduation** plan:

- Plan: [`../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md)
- Dry-run analysis preserved: [`../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md`](../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md)

### Pending-graduations register

The register tracks candidates that have been _captured_ (in
napkin, distilled, workstream briefs, or elsewhere) and are
awaiting _graduation_ to a durable home (pattern, PDR, ADR, rule,
Practice Core, infrastructure artefact). Schema per item:

- `captured-date` (YYYY-MM-DD) — when the candidate was first recorded.
- `source-surface` — where the candidate lives now (`napkin`,
  `napkin-archive`, `distilled`, `workstream brief`,
  `executive surface`, `practice-core`, `session opener`, etc.).
- `graduation-target` — one of: `pattern | PDR | ADR | rule |
practice-md | infrastructure | other`.
- `trigger-condition` — concrete signal that moves the item to `due`.
- `status` — one of: `pending | due | overdue`.

A candidate is `pending` until its trigger-condition fires
(typically a second/third independent instance, a scheduled
drafting slot, or explicit consumption by a plan task). On trigger
fire, status moves to `due`. If `due` persists through a
consolidation without action, it becomes `overdue`. **On
graduation, the entry is _removed_ from the register** — the
durable artefact (pattern file, PDR, ADR, rule) is the record; the
register carries only open items. Graduation history lives in git
history and in the `/session-handoff` close-summary for the session
that graduated the item. (Owner-ratified 2026-04-21 Session 5,
TIER-2 E2 register-pruning simplification; see `§ Session 5 close
summary`.)

**Orphan-item signal** (Family B Layer 2 meta-tripwire per PDR-029):
items carrying `graduation-target: other` that remain unrefined
across two consecutive consolidations are a **taxonomy seam
signal** — the register's graduation-target vocabulary either
needs a new concrete value or the item naturally spans planes and
should route through the cross-plane channel (PDR-028 +
`cross_plane: true` per PDR-030). Surface accumulated
`graduation-target: other` items at `/jc-consolidate-docs` step 5
and raise with owner when three or more persist across
consolidations. Items graduated via a new concrete
`graduation-target:` value (e.g. `taxonomy-review`,
`workflow-amendment`) close the signal.

The register is reviewed and refreshed at every `/session-handoff`
(new items added; trigger conditions re-evaluated) and is named as
an input at `consolidate-docs` step 7 (graduation scan) and step 5
(orphan-item + cross-plane scan).

**Graduated bands pruned (2026-04-21 Session 5, owner-ratified
TIER-2 E2 simplification)**: the four `#### Graduated (Session 1-4,
2026-04-21)` subsections that formerly lived here have been
removed. Their substance lives in the durable artefacts they
produced:

- Session 1 → [`../active/patterns/inherited-framing-without-first-principles-check.md`](../active/patterns/inherited-framing-without-first-principles-check.md),
  [`../active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md),
  [`../../rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md),
  `practice.md` Artefact Map (Practice Core CHANGELOG).
- Session 2 → [`../../directives/AGENT.md § RULES`](../../directives/AGENT.md) citing the `.agent/rules/` tier.
- Session 3 → [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md),
  [PDR-028](../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md),
  [PDR-029](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md),
  [PDR-030](../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md),
  [PDR-011 Amendment Log](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md),
  [PDR-026 Amendment Log](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md).
- Session 4 → [`../../commands/commit.md`](../../commands/commit.md),
  `start-right-quick`/`start-right-thorough` workflow updates,
  [`../../commands/session-handoff.md § step 7c`](../../commands/session-handoff.md),
  [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md),
  [`../../commands/consolidate-docs.md § step 7c`](../../commands/consolidate-docs.md),
  [`../active/distilled.md § Architecture`](../active/distilled.md),
  [PDR-029 Amendment Log 2026-04-21 entries](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md#amendment-log).

The register now carries **only open items** (`due | pending |
overdue`). Graduation history for any specific item: `git log -p
.agent/memory/operational/repo-continuity.md` or the
[`/session-handoff`](../../commands/session-handoff.md)
close-summary of the relevant landing session.

#### Due (trigger fired; awaiting action this arc)

**Two Session 5 items removed from this band 2026-04-21 (Session 5
close)** — both resolved per the on-graduation-removes-from-register
schema rule (line ~418 above): the `Thread ↔ workstream ↔ track
decomposition first-principles check` (resolved by TIER-2 E1
collapse + PDR-027 + PDR-011 amendments) and the `Decomposition of
the retracted standing-decisions.md contents` (resolved by
Stage 2(b) — see `§ Session 5 close summary § Stage 2(b)` for the
full landing manifest). Graduation history lives in the close
summary above and in git history.

**Three Session-8 entries removed from this band 2026-04-22 (Session 8 arc-close)** per the on-graduation-removes-from-register schema rule (line ~418 above): (1) `Stage 2(a) — Outgoing triage per PDR-007` (closed across Sessions 6 + 7; `practice-context/outgoing/` reduced to README.md only); (2) `Reference-tier sweep — workstream-citation cleanup in .agent/reference/` (closed by Session 6 reformation + Session 8 rehoming first-drain pass — 22 MOVED + 4 DELETED + 1 KEPT under PDR-032's gate); (3) implicitly closed by Session 8 arc-close: pattern `feel-state-of-completion-preceding-evidence-of-completion` (already removed from Pending band — see below). Graduation history lives in the Session 8 close summary in §Current session focus, in the [Practice Core CHANGELOG 2026-04-22 Session 8 entry](../../practice-core/CHANGELOG.md), in the archived [rehoming plan execution record](../../plans/agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md), and in git history.

- **`in-place-supersession-markers-at-section-anchors`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b watchlist); graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due — next consolidation or standalone pattern authoring.
- **`fork-cost-surfaces-in-doc-discipline-layer`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due.
- **`E2E-flakiness-under-parallel-pnpm-check-load`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: ADR (test-stability-lane) or pattern; trigger-condition: three cross-session instances reached 2026-04-19; status: due — needs a test-stability-lane authoring decision.
- **`reviewer-catches-plan-blind-spot`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: ≥2 instances reached; status: due.

#### Pending (single-instance; awaiting repeat for promotion)

**One Session 8 item removed from this band 2026-04-22 (Session 8 arc-close)** — `feel-state-of-completion-preceding-evidence-of-completion` resolved per the on-graduation-removes-from-register schema rule (line ~418 above). Owner adjudicated 3/3 (Sessions 4 + 5 + 7). Pattern landed at [`../active/patterns/feel-state-of-completion-preceding-evidence-of-completion.md`](../active/patterns/feel-state-of-completion-preceding-evidence-of-completion.md) under [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) `pattern + PDR composition` (rule-side already at [PDR-026 §Deferral-honesty discipline](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline) since Session 5; pattern-side completes the canonical composition). Graduation history lives in the pattern body, the [Session 7 experience entry](../../experience/2026-04-22-the-plan-was-not-the-conversation.md), and git history.

**Session 5 (2026-04-21) simplification pass**: six Session-4 entries
deleted from this band under the delete-bias:
`doctrine-velocity-exceeds-impact-signal` (substance landed as
Session-5 Family-A firing-trigger discipline; see `§ Session 5 close
summary`);
`hedged-link-in-ritual-is-read-as-none` (absorbed into the
`misleading-docs-are-blocking` invariant in §Repo-wide invariants);
`owner-honest-question-as-critical-signal` (owner-property not
agent-reachable mechanism; carried in napkin only);
`treating-owner-concern-as-information-rather-than-direction`
(absorbed into `subagent-practice-core-protection` + `follow-the-
practice` always-applied rules); `durable-doctrine-states-the-why-
not-only-the-what` and `dry-run-before-recipe-against-accumulated-
backlog` (both already in `distilled.md` — register slot was
duplicate-surface). Full rationale at the 2026-04-21 Session 5
re-evaluation section in `napkin.md`.

- **`self-applying-acceptance-for-tripwire-installs`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: pattern; trigger-condition: third CROSS-SESSION instance (three Session-4 instances were same-session cascades under the tightened cascade-vs-independent bar — count as 1 independent instance); status: pending.
- **`plan-body-framing-outlives-reviewers`** — captured-date: 2026-04-21 (Session 4); source-surface: napkin + PDR-029 second Amendment Log entry; graduation-target: pattern; trigger-condition: **three CROSS-SESSION instances required** (demoted Session 5 after reviewers flagged Session 4's three instances as one same-session metacognitive cascade, not three independent failures); status: pending — awaits an instance in a session other than Session 4. Evidence so far (same-session cascade, Session 4): scripts-for-tripwires; docs-as-second-class-review-target; standing-decisions-as-category.
- **`anticipated-surface-installed-then-empirically-unexercised`** — captured-date: 2026-04-21 (Session 5 post-handoff, owner-prompted layer-set reflection); source-surface: napkin Session 5 post-handoff entry; graduation-target: pattern; trigger-condition: third independent instance of a continuity-or-doctrine surface installed for an anticipated need that fails to materialise across N consolidations. Falsifiability check: a candidate third instance must show a surface (folder, file, schema field, rubric) installed in a session N with an anticipated firing trigger and no firing across at least 2 subsequent consolidations. **In-flight test bed (Session 6)**: the retired `.agent/memory/operational/workstreams/` folder remains physically present per owner-explicit experiment (2026-04-22) — _"let the experiment continue, do not bias it with additional action; I expect it to be removed because otherwise it adds confusion as an unused option, but understanding if the process arrives there naturally is important"_. If a future consolidation removes the folder via natural process application (default-retire-on-empty firing or equivalent), that does NOT count as a third instance of this pattern (the pattern fires when the surface persists, not when it gets removed). Status: pending — 2 of 3 instances (workstreams collapsed Session 5; tracks installed via PDR-011 amendment Session 5 with zero exercise). Owner-prompted, not agent-noticed — flag for the gap that existing tripwires catch entry-level not layer-level symptoms.
- **`default-retire-on-empty` (protection candidate)** — captured-date: 2026-04-21 (Session 5 post-handoff); source-surface: napkin Session 5 post-handoff entry; graduation-target: per [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) — most likely `command rubric` in `/consolidate-docs` step (firing belongs to consolidation workflow, not free-standing rule), composed with PDR amendment to PDR-014 or PDR-029; trigger-condition: parent (`anticipated-surface-installed-then-empirically-unexercised`) reaches 3/3 cross-session independent instances OR explicit owner direction. Falsifiability check: when promoted, the rubric must specify a measurable firing condition (e.g. "zero non-README/non-archive entries across 3 consecutive consolidations") and a chesterton-fence safeguard (owner re-justification window). Rule body sketch: _any operational-tier surface (folder + README) with zero non-README/non-archive entries across 3 consecutive consolidations retires by default unless the owner explicitly re-justifies it at the consolidation pass._ Concrete near-term test beds: tracks surface (first-empty-consolidation after) and the in-flight `workstreams/` folder experiment (see candidate above). Routing note: graduating before the parent pattern reaches 3/3 would relax the cross-session bar; the routing pattern's `pattern + rule` composition discipline argues for landing both together when the bar fires.
- **`owner-mediated-evidence-loop-for-agent-installed-protections`** — captured-date: 2026-04-21 (consolidate-docs Step 4 cross-experience scan); source-surface: `.agent/experience/2026-04-21-*.md` chronological set + Session 5 post-handoff layer-set reflection + napkin Session 7 close surprise capture; graduation-target: per [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) — `pattern` (cross-session, agent-infrastructure category) per routing-tree step 1; composition candidate: `pattern + PDR amendment` to PDR-015 (reviewer authority/dispatch) §Evidence loop. Trigger-condition: third cross-session independent instance OR explicit owner direction. Falsifiability check: a candidate third instance must show an agent-installed protection (rule, tripwire, command rubric) where the load-bearing evidence loop traces to owner intervention rather than agent self-test (reviewer dispatch counts as agent-mediated, not owner-mediated; the pattern is specifically about owner-as-evidence-loop). Evidence (2 of 3): five 2026-04-21 experience entries name the same shape — tripwire-i-cannot-test (S1), reviewer-found-the-gaps-i-installed (S2), the-recursive-session (S3), the-why-not-the-what (S4), and the Session 5 post-handoff owner-prompted layer-set reflection — counted as one cross-session instance under tightened bar; **Session 7 close** = second cross-session instance (PDR-026 §Deferral-honesty + PDR-014 §Graduation-target routing protections both recited at session open and yet bypassed in execution; only owner intervention surfaced the failure and forced the reset). Complementary to `anticipated-surface-installed-then-empirically-unexercised` (which is about the _gap_); this is about the _mechanism that has been compensating_ for the gap. Together they suggest a structural recommendation: **install firing-rate measurement for tripwires**, not just rule bodies. Status: pending — 2/3.
- **`new-doctrine-lands-without-sweeping-indexes`** — captured-date: 2026-04-21 (Session 4 post-close); source-surface: napkin; graduation-target: pattern; trigger-condition: **three CROSS-SESSION instances required** (demoted Session 5); status: pending — awaits an instance in a session other than Session 4. Evidence so far (same-session, Session 4): PDR-029 standing-decision register (retracted); PDR-029 script-shape prescription (revised); PDR-027 threads without sweeping `operational/README.md` + `orientation.md`. Related to `misleading-docs-are-blocking` (index-layer manifestation).
- **`defer-decisions-must-live-where-the-candidate-lives`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deferred candidate whose trigger condition was discovered missing from its home artefact; status: pending.
- **`when-deleting-a-doc-sweep-active-plans-for-prescriptions-not-just-links`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deletion where a prescription survived a link-only pass; status: pending.
- **`collaboration-shape-is-an-unexamined-assumption-in-new-artefact-types`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second design where collaboration shape surfaced as mid-cycle correction; status: pending.
- **`ask-the-minimum-not-the-maximum-when-direction-is-clear`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second moment where a 3-option question is better served by a declarative _"next I'll do X"_; status: pending.
- **`decision-complete-adr-enumerates-implied-questions`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance where an explicit adjudication-question list left downstream decisions unnamed; status: pending.
- **`prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance calibrating agent-vs-WebFetch choice; status: pending.
- **`amend-not-honour-when-simplification-surfaces-post-decision`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b); graduation-target: PDR (strong candidate on 2nd instance); trigger-condition: second instance of ADR amendment driven by broader-view simplification; status: pending.
- **`work-stream-dissolution-via-upstream-fix`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance of upstream fix absorbing downstream work stream; status: pending.
- **`reviewer-matrix-completeness-is-not-absolute`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern or PDR-015 addendum; trigger-condition: second session where discretionary reviewer dispatch against a plan-listed matrix was correct; status: pending.
- **`turbo-cache-hides-prettier-drift-until-pre-commit`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern (repo-specific) or workspace README; trigger-condition: second instance of cached `format:root` false-clean; status: pending.
- **`externally-verifiable-output-beats-internal-plan-compliance`** — captured-date: 2026-04-19 (L-EH close); source-surface: distilled.md (rotated to register at Session 7 Phase D file 2 disposition under PDR-014 §Graduation-target routing — the entry was a single-instance watchlist that did not meet distilled's "earned its place by changing behaviour" bar); graduation-target: pattern; trigger-condition: second cross-session instance of external-evidence-surfacing-a-gap-that-plan-tracking-missed (the distilled entry's stated trigger). Falsifiability check: a candidate second instance must show a lane close that produced an externally-verifiable artefact (command output, test result, recorded demo) which surfaced a gap invisible to internal plan-compliance tracking. Status: pending — 1/3 (originally captured with `single-instance observation` framing).
- **`decompose-precedents-before-reusing-them`** — captured-date: 2026-04-19 (L-EH initial vs Phase 5); source-surface: distilled.md (rotated to register at Session 7 Phase D file 2 disposition); graduation-target: pattern; trigger-condition: second cross-session instance of a precedent-match producing a reviewer-caught wrong default (the distilled entry's stated trigger). Falsifiability check: a candidate second instance must show a precedent treated as a single decision when it was actually a bundle (severity, scope, wiring pattern, opt-out protocol, authorship venue) and the unbundling caught a wrong default. Status: pending — 1/3.
- **`amendment-fires-immediately-on-its-own-landing-pass`** — captured-date: 2026-04-22 (Session 7 close); source-surface: napkin Session 7 close entry; graduation-target: per [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) — pattern (cross-session, agent-infrastructure category) per routing-tree step 1; trigger-condition: second cross-session independent instance of a discipline (rule, PDR sub-section, command rubric) landing in session N where the same session's closing review-or-validation pass produces findings dispositioned by the just-landed discipline. Falsifiability check: a candidate second instance must show the discipline's body taking effect on findings produced about the very lane that landed it, visibly distinguishable from prior-session disposition behaviour. Distinct from `tripwire-PDR-self-application-is-two-phase` (same-session immediate self-application vs. authoring-then-later-self-application across a session boundary). Evidence (1 of 3): Session 7 PDR-012 §Reviewer-findings disposition discipline amendment landed at Phase E; the Phase F-prime reviewer gate produced 2 actionable findings, both ACTIONED in-close per the freshly-landed amendment. Status: pending — 1/3.
- **`governance-gap-invisible-until-intentional-addition`** — captured-date: 2026-04-22 (Session 6 reformation pivot); source-surface: napkin Session 6 reshaped close entry; graduation-target: per [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) — pattern (cross-session, agent-infrastructure category) per routing-tree step 1; trigger-condition: second independent instance of a directory or surface accumulating items without governance until a deliberate addition forces the question. Falsifiability check: a candidate second instance must show a pre-existing surface (folder, schema, vocabulary) where governance was de-facto absent, the absence was not surfaced by passive accumulation across multiple consolidations, and the gap became visible only when intentional addition required a definition. Evidence (1 of 3): `.agent/reference/` accumulated ~35 files across 13 subdirectories without a tier definition, lightweight intake process, or aging gate; the gap surfaced at Session 6 Phase C Batch 2 only when promotion of three new files required the question. Distinct from `anticipated-surface-installed-then-empirically-unexercised` (which is about installed-but-unexercised; this is about accumulated-without-governance). Status: pending — 1/3.
- **`installed-rule-recited-but-not-honoured-when-plan-momentum-dominates`** — captured-date: 2026-04-22 (Session 7 close); source-surface: napkin Session 7 close surprise capture; graduation-target: per [PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing) — pattern (cross-session, agent-infrastructure category) per routing-tree step 1; trigger-condition: second cross-session independent instance of a discipline (rule, PDR sub-section, command rubric) explicitly cited at session open and yet violated mid-execution by structured plan momentum. Falsifiability check: a candidate second instance must show the discipline body quoted-or-cited at session open in the opener / plan / to-do list, and an execution loop visibly bypassing the discipline's gating language under plan-as-recipe momentum, surfaced only by owner intervention. Distinct shape from the parent `feel-state-of-completion-preceding-evidence-of-completion`: the parent is about close-time deferral honesty; this is specifically about **mid-execution adherence to explicit owner-pacing** when a structured plan provides recipe momentum. Evidence (1 of 3): Session 7 PDR-026 §Deferral-honesty body quoted in the opener AND in the to-do list AND the _"owner-only limit raises"_ rule from `/jc-consolidate-docs` step 9§e cited; Phase D execution loop nonetheless overrode owner-pacing across all four directive files including a unilateral char-limit raise. Status: pending — 1/3 watchlist; owner adjudicates whether to register-promote.

#### Open per-file disposition carried forward (not blocking; owner-paced)

- **Four directive files in fitness-hard zone — `principles.md`, `AGENT.md`, `testing-strategy.md`, `continuity-practice.md`** — captured-date: 2026-04-22 (Session 7 close, owner-amended DoD); source-surface: Session 7 close repo-continuity §Current session focus; graduation-target: per-file owner-paced conversation (compress / restructure / split / raise-limit / accept) under PDR-026 §Deferral-honesty. Trigger-condition: owner-appetite-triggered; not bound to any specific session. Falsifiability check: each file's disposition decision is recorded in the session that picks it up; the consolidated `pnpm practice:fitness` output for that session shows the corresponding zone state. Status: due-but-not-blocking — owner has explicitly accepted the current excesses (`principles.md` chars 26222/24000; `AGENT.md` lines 291/275; `testing-strategy.md` lines 566/550; `continuity-practice.md` lines 219/210) for now, will revisit later. Carried forward into Session 8 only as a register entry; **not part of the Session 8 arc-close DoD** (the `pnpm practice:fitness --strict-hard` exits-0 requirement was DROPPED at owner direction — see §Current session focus).

Additional single-instance watchlist observations carried forward
from the 2026-04-19 rotation (`core-tier-means-primitive-not-just-
dependency-pure`, `safety-layers-stack-not-nest`, `git-status-is-
a-snapshot`, `closure-principles-absorb-cardinality-changes`,
`reviewer-as-option-cartographer-not-decision-maker`, `date-
suffixed-frontmatter-is-a-smell`, `tier-scope-must-be-explicit-
for-shared-vocabulary-invariants`, `code-embodied-policy-without-
explicit-ruling-needs-tsdoc-pointer`, `forward-pointing-planning-
references-need-planned-markers`, `convergent-direction-across-
multiple-research-cuts-is-stronger-evidence`, `practice-five-file-
package-is-conceptually-a-plugin`, `reviewer-systems-cluster-is-
the-densest-uplift-cluster`, `assumptions-reviewer-pre-pass-
shrinks-fan-out-and-tightens-fences`, `symbolication-key-vs-ui-
association-are-separate-concerns`, `prefer-one-form-over-both-
work-drift-avoidance`) all carry captured-date 2026-04-19, source-
surface napkin-archive, graduation-target pattern, trigger-condition
_"second independent instance"_, status pending. Full descriptions
live in [`../active/archive/napkin-2026-04-19b.md`](../active/archive/napkin-2026-04-19b.md);
promote individually to this register on first second-instance.

**Infrastructure band pruned (2026-04-21 Session 5, owner-ratified
TIER-2 E2 simplification)**: the two infrastructure items that
formerly lived here (**Agent-names registry** and **External
pointer-surface integration (Linear)**) have been moved to their
proper artefact homes or captured in plan-local scope:

- **Agent-names registry** → consumed by Session 4 Task 4.2 identity-rule install; now lives under the agent-names source research referenced by [PDR-027 §Identity schema](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
- **External pointer-surface integration (Linear)** → full scope carried in the parent plan [`external-pointer-surface-integration.plan.md`](../../plans/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md); owner-ratified directives and trigger sequencing live in the plan body (the correct home for plan-local meta-decisions per [`§ Decisions in force`](#decisions-in-force--pointer-to-proper-artefact-homes)).

Infrastructure candidates that deserve register visibility (e.g.
because they lack a parent plan) can surface as `Due` or `Pending`
items scoped to the relevant artefact-home category.

### Plan structure (for continuity)

✅ **Arc closed 2026-04-22 Session 8** — eight-session staged
doctrine-consolidation arc on the `memory-feedback` thread.
Originally six sessions; reshaped 6→7 at Session 6 close per
PDR-026 §Deferral-honesty (reference-tier reformation became
load-bearing); reshaped 7→8 at Session 7 close (rehoming
separated from arc-close). Full arc summary lives in the
[Practice Core CHANGELOG 2026-04-22 Session 8 entry](../../practice-core/CHANGELOG.md);
archived plan body at
[`../../plans/agentic-engineering-enhancements/archive/completed/staged-doctrine-consolidation-and-graduation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/staged-doctrine-consolidation-and-graduation.plan.md).

**Deferred after arc** (no SLA, owner-appetite-triggered):

- Experience-scan dedicated session.
- Three rehoming open items (see §Next safe step above).
- Four directive files in fitness-hard zone (see §Open per-file
  disposition carried forward above).

**Retroactive identity attribution for `f9d5b0d2`**: owner accepts
the attribution gap; concrete attribution starts forward from
2026-04-22 per the Standing decisions section above.

**Related memory-feedback artefacts** (partially consumed by the
arc; retained for intent and history):

- Strategic brief: [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md)
- Metacognition (first- and second-pass): [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
- Execution plan (Phase 0 resolved; Phases 1–5 absorbed by the
  closed staged plan; Phase 7 learning loop carries forward as
  a long-lived plan): [`../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)

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
commits to landing _one_ thread's target, not multiple. Cross-
thread spread in the same session is anti-pattern.
