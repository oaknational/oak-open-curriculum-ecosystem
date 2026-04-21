# Repo Continuity

**Last refreshed**: 2026-04-21 (Session 5 of the staged doctrine-
consolidation plan landed — Stage 1 (mandatory evaluate-and-simplify)
+ Stage 2(b) (decomposition of the ten retracted-`standing-decisions.md`
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
closure] remains.)
**Status**: Authoritative for the fields below. Operational memory
is the sole continuity-state host. Session orientation doctrine lives
in [`orientation.md`](../../directives/orientation.md); landing
commitment doctrine lives in
[PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
rituals live in `start-right-quick` + `session-handoff`.

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

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | *unattributed* / *unknown* / *unknown* / executor / 2026-04-21 (retro for `f9d5b0d2`); `claude-code` / `claude-opus-4-7-1m` / Samwise / migration-maintenance / 2026-04-21 (S4 Task 4.5 file migration; not substantive thread work) |
| `memory-feedback` | Practice — feedback loops across three-mode memory taxonomy; emergent-whole observation; doctrine landing | [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md) | `claude-code` / `claude-opus-4-7-1m` / `Samwise` / drafter/initiator/executor / 2026-04-21; `cursor` / `claude-opus-4-7` / `Pippin` / evaluator/simplifier/executor / 2026-04-21 (Session 5 evaluate-and-simplify Stage 1 + corrected Stage 2(b) standing-decisions decomposition arc) |

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
§L-8 esbuild-native migration is re-planned and ready for
execution; next session begins at WS1 RED.

## Current session focus

Session 5 of the staged doctrine-consolidation plan LANDED
2026-04-21 with Stage 1 (mandatory evaluate-and-simplify) + Stage
2(b) (decomposition of the ten retracted-`standing-decisions.md`
items into proper artefact homes) both closed. The arc also
exercised the Class A.1 plan-body first-principles tripwire
on every new artefact body authored — three of ten items
rewrote from `new PDR` to `existing-surface amendment` in
response, owner-ratified twice (initial mapping; Class-A.1
revised mapping). Mid-close, owner metacognition surfaced a
manufactured-budget close attempt (no real meter behind "budget
consumed"); the corrected arc executed Stage 2(b), captured the
diagnostic in `napkin.md`, and drafted a deferral-honesty rule
candidate as a protection candidate (promotion gate: 3rd
cross-session independent instance — currently 2).

Session 6 opens on the `memory-feedback` thread with two scoped
pieces of work, both honestly carried over (no manufactured budget
framing):

1. **Stage 2(a) — outgoing triage** (`.agent/practice-context/outgoing/`,
   ~10 files, ~1481 lines): per-file disposition per PDR-007.
   Deferred from Session 5 for orthogonal-scope / dedicated-lens
   reasons (the triage benefits from a dedicated portability lens
   rather than being executed as the tail of an evaluation arc).
2. **Holistic fitness exploration** (Session-6 originally-scoped
   work): owner-decides compress / raise / restructure / split per
   file; `pnpm practice:fitness --strict-hard` passes by close.
   Includes addressing the `principles.md` character-count fitness
   debt (currently 26222 / 24000 — worsened by +594 chars from
   Session 5's two principle additions; line count is at 525 / 525
   soft limit exactly).

The thread does not switch. The `observability-sentry-otel`
thread waits until the `memory-feedback` arc closes (Session 6).

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
  - [`principles.md § Code Quality §Misleading docs are blocking`](../../directives/principles.md) — item 9 (Class A.1 rewrite); enforced by always-applied [`tsdoc-and-documentation-hygiene`](../../rules/tsdoc-and-documentation-hygiene.md) rule.
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
attempt #1) — also folds into Session 6 alongside Stage 2(a) and
holistic fitness exploration. Concrete site:
`.agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md`
(line 83) still describes the track filename convention as
`<workstream>--<agent>--<branch>.md`; sweep the deep-dives folder
for similar references in one batched pass.

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
  Enforced by the always-applied `tsdoc-and-documentation-hygiene`
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

**Continue the `memory-feedback` thread to completion** per owner
direction (2026-04-21 Session 4 late close): *"there is no
alternative thread, we need this work to be FINISHED, properly,
carefully, fully, choosing long-term architectural excellence at
every point."* Sessions 1–5 of the staged plan are now landed.
**Session 6 is the closing session for this arc.**

Session 6 scope — three pieces, all honestly carried over (no
manufactured budget framing):

1. **Stage 2(a) — Outgoing triage per PDR-007** (10+ files,
   ~1481 lines): per-file disposition (ephemeral exchange /
   portable PDR / general abstract pattern → Practice Core /
   host-local reference / defect → delete). Owner-gated per file
   per PDR-003.
2. **Reference-tier sweep** (`.agent/reference/agentic-engineering/
   deep-dives/`): retire residual `<workstream>--` track-naming
   citations and adjacent stale references in one batched pass.
3. **Holistic fitness exploration**: owner-decides compress /
   raise / restructure / split per file; address `principles.md`
   character-count fitness debt (currently 26222 / 24000 — see
   Due register entry above); `pnpm practice:fitness --strict-hard`
   passes by close.

Full framing at
[`threads/memory-feedback.next-session.md § Next landing target`](threads/memory-feedback.next-session.md).

**The `observability-sentry-otel` thread** remains alive (§L-8
Vercel acceptance probe still the named next step on that thread
per
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md))
but is **not an alternative to `memory-feedback` Session 5**. It
is a separate thread that waits until the `memory-feedback` arc
closes. PDR-026 per-thread-per-session applies — `memory-feedback`
is the current thread until the arc finishes.

## Deep consolidation status

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

The register tracks candidates that have been *captured* (in
napkin, distilled, workstream briefs, or elsewhere) and are
awaiting *graduation* to a durable home (pattern, PDR, ADR, rule,
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
graduation, the entry is *removed* from the register** — the
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

- **Stage 2(a) — Outgoing triage per PDR-007** — captured-date: 2026-04-21 (Session 5 close, honest deferral); source-surface: Session 5 close summary; graduation-target: per-file disposition (ephemeral exchange / portable PDR / general abstract pattern → Practice Core / host-local reference → `.agent/reference/` / defect → delete) per [PDR-007](../../practice-core/decision-records/PDR-007-incoming-and-outgoing-practice-context.md); trigger-condition: Session 6 open (deferred from Session 5 for orthogonal-scope / dedicated-lens reasons, NOT budget); status: due.
- **Reference-tier sweep — workstream-citation cleanup in `.agent/reference/`** — captured-date: 2026-04-21 (Session 5 first close-attempt; docs-adr-reviewer); source-surface: Session 5 close summary; graduation-target: in-place edit; trigger-condition: Session 6 open (folds with Stage 2(a) and holistic fitness exploration); status: due. Concrete site: `.agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md` line 83 + sweep adjacent deep-dives folder.
- **`principles.md` character-count fitness debt** — captured-date: 2026-04-21 (Session 5 close); source-surface: `pnpm practice:fitness` output; graduation-target: principles-compression pass (in-place edit); trigger-condition: Session 6 holistic fitness exploration; status: due — pre-existing hard breach (25628 / 24000 before Session 5) worsened to 26222 / 24000 (+594 chars) by the two principle additions in Stage 2(b). Line count is at 525 / 525 soft limit exactly.
- **`in-place-supersession-markers-at-section-anchors`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b watchlist); graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due — next consolidation or standalone pattern authoring.
- **`fork-cost-surfaces-in-doc-discipline-layer`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due.
- **`E2E-flakiness-under-parallel-pnpm-check-load`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: ADR (test-stability-lane) or pattern; trigger-condition: three cross-session instances reached 2026-04-19; status: due — needs a test-stability-lane authoring decision.
- **`reviewer-catches-plan-blind-spot`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: ≥2 instances reached; status: due.
- **`reviewer-findings-applied-in-close-not-deferred`** (PDR-012 amendment) — captured-date: 2026-04-19; source-surface: distilled; graduation-target: PDR amendment (PDR-012); trigger-condition: three cross-session instances reached 2026-04-19; status: due — Session 3 doctrine bundle may absorb.

#### Pending (single-instance; awaiting repeat for promotion)

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

- **`feel-state-of-completion-preceding-evidence-of-completion`** — captured-date: 2026-04-21 (Session 5 close); source-surface: napkin Session 5 close-attempt entry; graduation-target: pattern (cross-session, cross-mechanism); trigger-condition: third independent instance OR a third distinct surface (e.g. deferral inside execution loop, not just at session boundary); status: pending — 2 of 3 cross-session independent instances (Session 4 theatre = build-without-firing; Session 5 manufactured-budget = land-without-exercising). Both required owner intervention to surface.
- **`deferral-honesty-rule` (protection candidate)** — captured-date: 2026-04-21 (Session 5 close); source-surface: napkin Session 5 close-attempt entry §Falsifiable protection candidate; graduation-target: rule (always-applied) OR `/session-handoff` step rubric amendment OR PDR-026 §Landing target definition amendment; trigger-condition: third instance of the parent `feel-state-of-completion-preceding-evidence-of-completion` pattern OR explicit owner direction to install at next consolidation; status: pending — drafted but not promoted (cost of close-time gate not yet weighed against benefit; relationship to Class A.1 / A.2 firing-trigger discipline needs first-principles check). Rule body: *any deferral asserted at session-handoff time MUST cite a named external constraint (clock, cost, dependency, owner veto) or named priority trade-off with explicit evidence; "budget", "next session", "for later", "out of scope" are NOT acceptable as deferral reasons; reason must be falsifiable.*
- **`self-applying-acceptance-for-tripwire-installs`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: pattern; trigger-condition: third CROSS-SESSION instance (three Session-4 instances were same-session cascades under the tightened cascade-vs-independent bar — count as 1 independent instance); status: pending.
- **`plan-body-framing-outlives-reviewers`** — captured-date: 2026-04-21 (Session 4); source-surface: napkin + PDR-029 second Amendment Log entry; graduation-target: pattern; trigger-condition: **three CROSS-SESSION instances required** (demoted Session 5 after reviewers flagged Session 4's three instances as one same-session metacognitive cascade, not three independent failures); status: pending — awaits an instance in a session other than Session 4. Evidence so far (same-session cascade, Session 4): scripts-for-tripwires; docs-as-second-class-review-target; standing-decisions-as-category.
- **`new-doctrine-lands-without-sweeping-indexes`** — captured-date: 2026-04-21 (Session 4 post-close); source-surface: napkin; graduation-target: pattern; trigger-condition: **three CROSS-SESSION instances required** (demoted Session 5); status: pending — awaits an instance in a session other than Session 4. Evidence so far (same-session, Session 4): PDR-029 standing-decision register (retracted); PDR-029 script-shape prescription (revised); PDR-027 threads without sweeping `operational/README.md` + `orientation.md`. Related to `misleading-docs-are-blocking` (index-layer manifestation).
- **`defer-decisions-must-live-where-the-candidate-lives`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deferred candidate whose trigger condition was discovered missing from its home artefact; status: pending.
- **`when-deleting-a-doc-sweep-active-plans-for-prescriptions-not-just-links`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deletion where a prescription survived a link-only pass; status: pending.
- **`collaboration-shape-is-an-unexamined-assumption-in-new-artefact-types`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second design where collaboration shape surfaced as mid-cycle correction; status: pending.
- **`ask-the-minimum-not-the-maximum-when-direction-is-clear`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second moment where a 3-option question is better served by a declarative *"next I'll do X"*; status: pending.
- **`decision-complete-adr-enumerates-implied-questions`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance where an explicit adjudication-question list left downstream decisions unnamed; status: pending.
- **`prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance calibrating agent-vs-WebFetch choice; status: pending.
- **`amend-not-honour-when-simplification-surfaces-post-decision`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b); graduation-target: PDR (strong candidate on 2nd instance); trigger-condition: second instance of ADR amendment driven by broader-view simplification; status: pending.
- **`work-stream-dissolution-via-upstream-fix`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance of upstream fix absorbing downstream work stream; status: pending.
- **`reviewer-matrix-completeness-is-not-absolute`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern or PDR-015 addendum; trigger-condition: second session where discretionary reviewer dispatch against a plan-listed matrix was correct; status: pending.
- **`turbo-cache-hides-prettier-drift-until-pre-commit`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern (repo-specific) or workspace README; trigger-condition: second instance of cached `format:root` false-clean; status: pending.

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
*"second independent instance"*, status pending. Full descriptions
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

The six-session staged plan summary:

1. ✅ **Session 1 — LANDED 2026-04-21 at 6/6.** Two patterns authored; first Family-A tripwire rule installed; `practice.md` Artefact Map refreshed; Standing decisions extended; brief experience entry. (Graduated items listed above.)
2. **Session 2 — IN FLIGHT 2026-04-21.** Napkin rotation (1611 → `archive/napkin-2026-04-21.md`); distilled merge-and-prune; pending-graduations register schema formalised (this section); register-to-workflow binding.
3. **Session 3** — Draft three new PDRs + two amendments (per Due section above). Owner-gated per PDR-003. Bundle rhythm is the default; sequential allowed if an earlier PDR materially changes a later one.
4. **Session 4 (EXPANDED 2026-04-21)** — Install Family A tripwires across both classes. Class A.1: plan-body rule forward-reference cleared; standing-decision register surface installed. Class A.2: session-open identity-registration rule with full platform parity (Claude + Cursor + AGENT.md citation); session-close identity gate in `/session-handoff` (hard gate) with `pnpm session-handoff:check` and unit tests; platform-neutral stale-identity health probe with five checks and unit coverage; derivable active-agent-register view as a named CLI subcommand. Consumes agent-names registry (Infrastructure item above). Install Family B tripwires; cross-plane path rules; Practice Core CHANGELOG; roadmap sync.
5. **Session 5** — Outgoing triage (PDR-007 enforcement on 10+ files, 1481 lines); promote or delete each.
6. **Session 6** — Holistic fitness exploration as final meta-consolidation; owner-decides compress / raise / restructure / split per file; `pnpm practice:fitness --strict-hard` passes.

**Deferred after arc**: experience-scan (dedicated session with
future plan after Session 6 closes).

**Retroactive identity attribution for `f9d5b0d2`**: owner accepts
the attribution gap; start forward from 2026-04-22 per the
Standing decisions section above.

**Related memory-feedback artefacts** (partially consumed by the
staged plan; retained for intent and history):

- Strategic brief: [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md)
- Metacognition (first- and second-pass): [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
- Execution plan (Phase 0 resolved; Phases 1–5 absorbed by the
  staged plan; Phase 6 doctrine landing in Session 3 of the
  staged plan): [`../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)

## Next-session opening statements (per thread)

There is no single next-session opener. The continuity unit is the
thread; each active thread holds its own next-session record. Pick
the thread the session is picking up before reading the opener.

- **`observability-sentry-otel` thread** (product): see
  [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md). Landing
  target: §L-8 WS1 Vercel preview acceptance probe (per the
  authoritative file; supersedes any earlier "WS1 RED" text on
  this page). Standing decisions (owner-beats-plan) and session
  shape specified in the opener.
- **`memory-feedback` thread** (Practice): see
  [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md).
  Landing target: Session 1 of the Staged Doctrine Consolidation
  and Graduation plan (record Standing decisions fully; author
  two patterns; refresh `practice.md` Artefact Map; brief
  experience entry). Phase 0 ratifications landed in the Standing
  decisions section above on 2026-04-21. Thread-scoped identity
  table and grounding order specified in the file.

**PDR-026 landing-commitment discipline**: a single session
commits to landing *one* thread's target, not multiple. Cross-
thread spread in the same session is anti-pattern.
