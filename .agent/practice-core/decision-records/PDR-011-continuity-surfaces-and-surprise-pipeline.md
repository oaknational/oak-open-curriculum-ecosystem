---
pdr_kind: governance
---

# PDR-011: Continuity Surfaces and the Surprise Pipeline

**Status**: Accepted (amended 2026-04-20, amended 2026-04-21, amended 2026-04-25)
**Date**: 2026-04-18 (amended 2026-04-20 — contract host abstracted
from "primary session-continuation prompt" to "canonical repo-local
surface set"; field set split into portable minimum plus optional
epistemic fields; host-local context updated to reflect split
surfaces. Doctrine — capture→distil→graduate→enforce, split-loop
model, three continuity types — unchanged. Amended 2026-04-21 —
pipeline and continuity surfaces framed as *thread-scoped at the
upper lifecycle, session-scoped at the lower lifecycle*; thread ↔
session relationship named explicitly; continuity contract
extended to allow per-thread next-session records. Pipeline
stages and split-loop model unchanged.)
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract under which this PDR is authored);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(continuity surfaces live as canonical artefacts with thin platform
adapters — same architecture this PDR inherits);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(specialists that may be invoked from the continuity surface);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — this PDR's 2026-04-21
amendment aligns its scope language with PDR-027's continuity
unit).

## Amendment Log

- **2026-04-20**: §"The continuity contract" host language abstracted;
  field set restructured into a portable minimum plus optional
  epistemic fields; §Host-local context updated to reflect the
  state-surface split (`repo-continuity.md` and `workstreams/<slug>.md`
  and `memory/operational/tracks/*.md`). The portable doctrine and the contract's
  authority-subordinate role to active plans are unchanged.
- **2026-04-21** (Accepted): continuity unit named explicitly as
  the **thread**
  (per PDR-027), not the session. §"Three types of continuity"
  unchanged. §"The continuity contract" extended to permit a
  per-thread next-session record pattern (in addition to the
  single continuity contract). §"The surprise-to-enforcement
  pipeline" reframed as *thread-scoped at the upper lifecycle,
  session-scoped at the lower lifecycle*: capture happens within
  a session on a thread; distil → graduate → enforce proceed
  across sessions within and across threads. Pipeline stages and
  split-loop model unchanged. Thread ↔ session relationship named
  explicitly.
- **2026-04-21 Session 5 — workstream-brief surface retired as a
  portable component (Pippin / cursor-opus; owner-ratified TIER-2
  simplification of the `memory-feedback` thread).** §"The
  continuity contract" amended: the *split-host shape* is no longer
  described as `canonical file and per-workstream briefs and single-writer tactical track cards`; it is now `canonical file + per-thread next-session records (with a Lane state) substructure
  for lane-level short-horizon state) + single-writer tactical
  track cards`. **Portable minimum fields** updated: `Active
  workstreams` → `Active threads` (with per-thread identity
  column); `Branch-primary workstream brief` → `Branch-primary
  thread next-session record`. **Optional (host-local placement)**
  text updated: per-workstream brief no longer cited as a valid
  host. §"Host-local context" updated: per-lane resumption briefs
  bullet removed; thread next-session records named instead;
  tracks filename convention updated to `<thread>--<agent>--
  <branch>.md` (history note: the workstream-scoped form remains
  declarative, not schema-enforced; lane-qualified form available
  if a future thread exercises multi-lane scope).
  **Conceptual term unchanged**: "workstream" remains valid as a
  scope descriptor within a thread; only the dedicated artefact
  surface is retired. **Re-introduction path**: if a future
  adopter encounters a thread genuinely requiring multiple
  concurrent lanes whose state cannot ergonomically live in the
  thread next-session record, the workstream-brief surface may be
  re-introduced via a fresh PDR-011 amendment grounded in
  concrete evidence.
  See [PDR-027 §Amendment Log 2026-04-21 Session 5](PDR-027-threads-sessions-and-agent-identity.md#amendment-log)
  for the cross-PDR rationale.
- **2026-04-25 — live coordination state recognised as a sibling
  artefact class to memory.** WS0 of the multi-agent collaboration
  protocol installed `.agent/state/` as the *live, ephemeral,
  signal-like* surface where multiple agents on the same repo
  coordinate via the embryo discovery log (`state/collaboration/log.md`)
  and, from WS1, structured claims. The state-vs-memory boundary —
  *state is truth-of-now; memory is truth-across-time* — is named
  in [`.agent/directives/agent-collaboration.md`](../../directives/agent-collaboration.md)
  and `.agent/state/README.md`. State is **not a fourth continuity
  type**; it is a sibling artefact class distinct from memory, used
  for cross-agent coordination signal rather than cross-session
  learning. The capture → distil → graduate → enforce pipeline,
  the split-loop model, and the contract's authority-subordinate
  relationship to plans are unchanged. Conversation entries from
  state surfaces are first-class learning-loop inputs alongside the
  napkin (per `agent-collaboration.md` §Conversations as First-Class
  Learning-Loop Inputs); WS5's seed harvest reads across both.
  §"Host-local context" extended to name the state surface.
- **2026-04-21 Session 5 — runtime tactical track cards are
  git-tracked as portable doctrine.** §"The continuity contract"
  amended: tactical track cards (the per-`<thread>--<agent>--
  <branch>` files holding immediate-execution state for a single
  writer) MUST be git-tracked, not gitignored, in the canonical
  shape of this PDR. Rationale: the cards are the resumption
  surface a future session reads first; if they are gitignored
  they are invisible across machines, branches, and worktrees,
  and the continuity guarantee fails at the boundary the cards
  exist to bridge. Track cards are short-lived (single-branch
  lifetime) but each card's lifetime spans multiple sessions and
  potentially multiple agents/machines on the same branch (e.g.
  worktree handoff, owner inspection, cross-host hydration), and
  git is the portable transport that preserves them. Captured
  originally in the retracted standing-decisions register entry
  `runtime-tactical-track-cards-git-tracked`; graduated to this
  PDR amendment in 2026-04-21 Session 5 per the decomposition arc.

## Context

Agentic engineering sessions are bounded: a session starts, work
happens, the session ends, another session begins. The boundary
between sessions is a discontinuity — the next session has none of
the prior session's working memory. Without explicit continuity
machinery, each session begins from zero and rediscovers context the
prior session already produced.

The problem is not whether an agent "remembers" in some internal
sense. The useful question is whether the human-agent system can
**recover orientation** after interruption, restart, or handoff.
That is a workflow and documentation design problem, not a
model-capability problem.

A Practice-bearing repo typically already has fragmentary machinery:

- Active plans carry execution authority.
- Session prompts carry live operational state.
- Ephemeral memory (a "napkin" or equivalent) captures recent
  learning.
- Refined memory (distilled learnings) captures stable rules.
- Consolidation workflows graduate stable understanding into
  permanent surfaces.
- Experience files record qualitative shifts in understanding.

What was lacking, in the author's experience, was a **clean boundary
between ordinary session continuity and deep convergence**. When the
only closeout ritual bundled plan updates, review, deep
consolidation, commit, push, and handover together, three pathologies
emerged:

1. **Too heavy for routine closeout.** Simple session recovery should
   not depend on running graduation, pattern extraction, fitness
   regulation, practice-exchange integration, and commit in one
   ritual. The weight made the ritual rarely used.
2. **Too light for genuine convergence.** When the session did reach
   a natural consolidation boundary (plan closure, accumulated
   learning, incoming practice-exchange material), the lightweight
   path skipped the convergence work that was genuinely needed.
3. **No bridge between them.** The ritual was either fully
   consolidated or not consolidated at all; no gate decided which
   was warranted.

A separate observation: **surprise and correction are where mental
models change**. An agent that is surprised by a tool response,
corrected by an operator, or that discovers a contradiction between
its plan and reality is producing a learning signal. Without an
explicit pipeline, these signals were captured informally in chat
history and disappeared when the session ended. Learnings that
should have become rules, patterns, or ADRs were lost not because
they failed the graduation bar but because they never entered the
pipeline.

Underlying cause: continuity is a first-class engineering property of
an agentic system. Without naming it, the machinery for producing it
exists in fragments without a unifying shape; with it, the fragments
compose into an intentional cross-session learning system.

## Decision

**Continuity is a first-class engineering property of any
Practice-bearing repo. It has three distinct types, requires a
split-loop workflow between lightweight handoff and deep
consolidation, and is supported by a named operational surface that
carries live session state. Surprise and correction have an explicit
capture-to-enforcement pipeline.**

### Thread-scoped at the upper lifecycle (2026-04-21 amendment)

The continuity machinery in this PDR is scoped to the **thread**
as defined in PDR-027, not to the session. A thread is a named
stream of work that persists across sessions; a session is a
time-bounded agent occurrence that participates in one or more
threads.

The scope relationship:

- **Capture** happens *within a session on a thread*. A surprise
  is captured at the moment it occurs, by the session that
  experienced it, into the active-memory surface associated with
  the thread the session is working on.
- **Distil → graduate → enforce** proceed *across sessions within
  and across threads*. A distilled rule extracted from
  capture-events in one thread may graduate into doctrine that
  governs every thread. Consolidation is the cross-thread
  convergence point, as the split-loop model below describes.
- **Continuity surfaces** (next-session records, identity
  lists, landing commitments) are scoped **per thread**. A repo
  with multiple active threads carries one next-session record
  per thread. The single canonical continuity contract
  (`repo-continuity.md` or equivalent) indexes the active
  threads; per-thread next-session records carry the
  thread-specific landing target and identity state.

Sessions are the lower lifecycle unit; threads are the upper
lifecycle unit. Both are load-bearing, and both must be named
in any continuity machinery that wants to survive the
conflation-of-scope failure mode PDR-027 Context describes.

### Three types of continuity

Continuity between sessions has three distinct dimensions that must
be preserved independently:

| Type | Question answered | What preserves it |
|---|---|---|
| **Operational** | Can the next session recover orientation and act safely? | A live continuity contract on a named surface; plans that are current; commands that work |
| **Epistemic** | Can the next session recover understanding, uncertainty, and recent corrections truthfully? | Recorded surprises; open-questions list; low-confidence areas named; recent corrections captured |
| **Institutional** | Can learning outlive the current session, model instance, or operator? | Graduated patterns, distilled learnings, ADRs, PDRs, experience files |

A system that provides only operational continuity (plan state) but
loses epistemic continuity (what was uncertain) will appear to resume
correctly while carrying hidden confidence errors. A system that
provides operational and epistemic continuity but not institutional
continuity will recover every session but learn nothing across them.

### The split-loop workflow

Ordinary session closeout and deep convergence are different weights
and cadences. Conflating them makes either closeout too expensive or
convergence too rare. The split-loop model:

**Session-handoff** (lightweight closeout, used every session):

- Refreshes the live continuity contract.
- Syncs any changed next-action state in plans and prompts.
- Ensures recent surprises or corrections are in the ephemeral memory.
- Runs a **consolidation gate** that either stops cleanly or
  escalates into the deep convergence workflow when the deeper work
  is clearly warranted.

Session-handoff MUST NOT implicitly trigger full review,
commit/push, or make deep convergence the default.

**Consolidate-docs** (deep convergence, used only on trigger):

- Drives graduation (ephemeral to permanent).
- Processes inter-repo practice-exchange material.
- Checks fitness across governed documents.
- Extracts code patterns.
- Runs only when one or more explicit triggers hold:
  - Plan or milestone closure.
  - Settled doctrine exists only in ephemeral artefacts.
  - Practice exchange needs processing.
  - Fitness pressure requires action.
  - Repeated surprises suggest a new rule, pattern, ADR, or PDR.
  - Documentation drift needs graduation.

**The consolidation gate** inside session-handoff is the bridge:
ordinary closeout remains lightweight until the trigger is clear,
but the workflow can still continue into deep convergence without
leaving the handoff flow when the session has genuinely reached a
natural consolidation boundary.

### The continuity contract

A repo that has accepted this PDR MUST carry a named canonical
operational surface that hosts a **Live continuity contract** — a
compact structured section with specified fields. The canonical host
is host-local: it may be a dedicated state file, a section of a
primary session-continuation prompt, or any equivalent surface that
every workflow references first. Hosts that split the contract
across a canonical file + per-thread next-session records (with a
`Lane state` substructure for lane-level short-horizon state) +
single-writer tactical track cards remain compliant, provided the
authority order between surfaces is explicit, each surface has a
single documented writer, and the fields below are covered in
aggregate. **Single-writer tactical track cards MUST be git-tracked**
in the host's repository — not gitignored — so they are portable
across machines, branches, and worktrees within their lifetime
(per the 2026-04-21 Session 5 amendment). Track cards are short-
lived (single-branch lifetime) but each card spans multiple
sessions and potentially multiple agents/machines on the same
branch; git is the portable transport that preserves them. (Per the 2026-04-21 Session 5 amendment, the prior
split-shape — *canonical file + per-workstream briefs + tactical
track cards* — is also accepted as a host-local variant if an
adopter encounters multi-lane threads requiring dedicated
brief surfaces, but is no longer the recommended default.)

**Portable minimum fields** (every repo carries these, regardless of
host shape):

- **Active threads** — continuity units currently in play (with
  per-thread identity columns recording the participating
  agents/sessions per PDR-027).
- **Branch-primary thread next-session record** — pointer to the
  primary thread's next-session record (containing identity,
  landing target, and any `Lane state` substructure) or an inline
  compact status block (if the host does not split per-thread state
  into a separate surface).
- **Repo-wide invariants / non-goals** — constraints carried forward.
- **Next safe step** — operational-continuity content: what the next
  session should do first.
- **Deep consolidation status** — whether the consolidation gate has
  been run and what it found.

**Optional (host-local placement)** — these may live on the canonical
contract, on a per-thread next-session record (`Lane state`
substructure), or on the napkin, but they MUST be present somewhere
the next session reads before acting:

- **Current session focus** — only when distinct from the
  branch-primary lane (e.g. a parallel thread).
- **Recent surprises / corrections** — epistemic-continuity content.
- **Open questions / low-confidence areas** — epistemic-continuity
  content.

The contract remains **operational** only. Active plans remain
authoritative for scope, sequencing, acceptance criteria, and
validation. The contract is not a duplicate of plan content — it is
a compact resumption surface that points at the plans.

**Per-thread next-session records (2026-04-21 amendment).**
A host with multiple active threads MAY extend the continuity
contract with **per-thread next-session records**, one per
thread, carrying that thread's landing target and identity list
(per PDR-027). In this shape, the canonical contract indexes the
active threads and the per-thread records carry the
thread-specific resumption content. The portable minimum fields
remain covered in aggregate across the contract + per-thread
records. Multiple next-session records are not multiple
continuity contracts — there is still one canonical contract;
the per-thread records are satellites scoped by thread.

### Live coordination state (2026-04-25 amendment)

Memory and state are sibling artefact classes:

| Class | Lifecycle | Truth scope | Examples |
|---|---|---|---|
| **`.agent/memory/`** | Durable; entries survive across sessions | Truth-across-time (lessons-learned) | Napkin, distilled, patterns, threads, executive cards |
| **`.agent/state/`** | Ephemeral; entries archive or expire | Truth-of-now (signal-like) | Embryo discovery log, structured claims (WS1+), conversation files (WS3+) |

The state class is introduced for **cross-agent coordination signal**
— what is happening *now* in the working tree across multiple
parallel agent sessions — distinct from memory's role of preserving
cross-session learning. The state-vs-memory boundary is enforced by
two READMEs (`.agent/state/README.md` and `.agent/memory/`'s
existing structure) and operationalised by the
[`agent-collaboration.md`](../../directives/agent-collaboration.md)
directive.

State surfaces feed memory: live coordination signals generate
evidence; that evidence is captured in the napkin and graduates into
memory lessons when patterns earn promotion. Memory shapes how state
surfaces are designed: lessons about agent-to-agent collaboration
inform what state surfaces need.

State is not a continuity *type* (operational / epistemic /
institutional remain the three types). It is a continuity *artefact
class* that sits alongside memory in the pipeline's capture stage,
contributing signal that the pipeline distils, graduates, and
enforces just as it does napkin signal.

### The surprise-to-enforcement pipeline

Surprise and correction follow a named pipeline:

```text
capture → distil → graduate → enforce
```

- **Capture**: the moment the surprise occurs, it lands in the
  ephemeral memory surface (napkin or equivalent) in a structured
  surprise format (what was expected / what happened / why the gap /
  what changes as a result).
- **Distil**: at consolidation, high-signal surprises extract into
  refined memory (distilled learnings or equivalent) as reusable
  rules.
- **Graduate**: at further consolidation, stable distilled rules move
  into permanent surfaces (ADRs, PDRs, patterns, directives).
- **Enforce**: graduated rules become blocking gates, situational
  triggers, or reviewer invocations — the rule acts automatically on
  the next occurrence.

No automatic shortcut to permanent doctrine exists. The pipeline
preserves the existing graduation bars at each stage. What it adds is
**explicit entry**: a surprise enters the pipeline by being captured
in structured form, not by being recounted in chat history.

### Mid-session re-grounding (complementary, not a continuity surface)

Mid-session, when context accumulates and direction drifts, a
re-grounding workflow (typically called `GO` or equivalent) serves as
an execution cadence — it re-reads the continuity contract, the
active plan(s), and the immediate task, and re-enters a structured
action/review loop.

This workflow is complementary to session-handoff, not a substitute.
It operates within a session; session-handoff operates at the session
boundary; consolidation operates across sessions. Keep the three
distinct.

### Inter-session learning loop

The continuity surfaces are embedded in the larger self-reinforcing
improvement loop. Continuity is the mechanism by which **work →
capture → distil → graduate → enforce → work** becomes a closed
cycle rather than a one-way stream.

Diagnostic signals that a link in the loop has broken:

- **Ephemeral memory stops capturing surprises** — the capture stage
  has degraded.
- **Distilled memory cannot extract patterns about its own quality** —
  the refinement stage is too narrow.
- **Consolidation never graduates insights about consolidation** —
  the graduation stage has stalled.
- **Rules about rule creation cannot be refined through the same
  loop** — the enforcement stage is exempt from its own governance.

Each signal is a loop-health check. A healthy Practice produces
meta-evidence: it learns about its own learning; it governs its own
governance; it records corrections to its correction mechanisms.

## Rationale

**Why continuity is an engineering property, not a model-capability
property.** The useful question is system-level (can the system
recover orientation?), not model-level (does the model remember?).
Framing it as a model-capability question suggests the answer lies
in training data, context windows, or memory models. Framing it as
an engineering-property question suggests the answer lies in
workflows, surfaces, and artefact design. The engineering framing is
actionable; the model-capability framing is not.

**Why three types rather than one.** Operational, epistemic, and
institutional continuity can fail independently. A system that
claims "continuity" while only preserving operational state is
dangerous: the next session believes it has context but has lost
the uncertainty that should have tempered its actions. Naming the
three types makes the independent failure modes visible.

**Why split handoff from consolidation.** The empirical observation:
a single heavy closeout ritual produces a predictable failure mode —
it is skipped when it feels disproportionate and relied on when it
feels warranted, so the actual closeout quality oscillates. The
split-loop model with an explicit gate between them aligns ritual
weight to actual need. Ordinary closeouts stay fast; convergence
happens when triggers warrant it.

**Why a named continuity surface with specified fields.** A
free-form handoff note accumulates entropy: fields present in one
session are absent in the next; resuming agents rediscover which
conventions apply. A specified-field contract makes the handoff
machine-readable: a resuming agent knows what to look for. The
specified fields are load-bearing for the three continuity types:
operational fields preserve orientation; epistemic fields preserve
uncertainty; pointers to institutional artefacts preserve long-term
learning.

**Why the surprise pipeline is explicit.** Surprises are the
highest-information events in a session — they mean a mental model
was wrong. Informal capture (recounted in chat, discussed, then
forgotten) loses the signal at session boundary. An explicit
pipeline with a structured capture format ensures the signal enters
a durable channel where later consolidation can graduate it.

Alternatives rejected:

- **One consolidated closeout ritual.** Rejected for the skipped-or-
  relied-on oscillation.
- **Implicit continuity via plan state only.** Rejected for failing
  to preserve epistemic continuity (uncertainty, corrections).
- **Memory models / long-context dependence.** Rejected because it
  reframes the problem as a capability question rather than a
  workflow question. Even with perfect long-context recall, a
  contract-structured surface is easier to navigate than an opaque
  memory.

## Consequences

### Required

- Every Practice-bearing repo names a single canonical location that
  hosts the **Live continuity contract** with the specified fields.
- Every repo has a **session-handoff** workflow (lightweight) and a
  **consolidate-docs** workflow (deep convergence), with an explicit
  consolidation gate bridging them.
- Every repo has an ephemeral memory surface (napkin or equivalent)
  used for surprise capture in a structured format.
- Every repo has a refined memory surface (distilled or equivalent)
  used for cross-session rule accumulation.
- Every surprise or correction significant enough to change a
  mental model is captured in structured format at the time of
  occurrence, not reconstructed later.
- Consolidation runs only when its trigger list fires; routine
  closeouts stay lightweight.

### Forbidden

- A closeout ritual that bundles handoff and deep convergence as a
  single flow without the consolidation gate — reintroduces the
  skipped-or-relied-on oscillation.
- A continuity contract without the named fields (free-form resumption
  notes) — loses machine-readability.
- Continuity claims that preserve only operational state — hidden
  epistemic-continuity failure.
- Automatic surprise-to-doctrine promotion without the graduation
  bars. Each stage of the pipeline must pass its own bar.
- Multiple continuity contracts in the same repo — one canonical
  surface only; other surfaces point at it.

### Accepted cost

- The continuity contract is a surface that must stay synchronised
  with active plans. Badly maintained, it drifts into duplicated
  authority. Maintenance is recurring work; the payoff is fast
  resumption.
- The split-loop model is one more distinction contributors and
  agents must learn. The pattern's naming (handoff vs. consolidate)
  carries the distinction in the name.
- Structured surprise capture is slight overhead at the moment of
  surprise — the signal is still fresh when the capture cost is
  incurred, which is when it is cheapest.

## Notes

### Relationship to PDR-007

PDR-007 established the new Core contract including
`decision-records/` and `patterns/` as first-class surfaces. PDR-011
relies on that contract: graduated learnings from the surprise
pipeline land in `practice-core/decision-records/` (as PDRs) or
`practice-core/patterns/` (as universal patterns), alongside the
host-repo's ADR folder for repo-specific architectural decisions.
The continuity machinery is the pipeline that feeds those surfaces.

### Relationship to PDR-009 and PDR-010

PDR-009 establishes how continuity-related artefacts (prompts,
commands, skills) live canonically with thin adapters. PDR-010
establishes that continuity-related workflows may be executed by
process-executor-classified agents. Both apply to the continuity
machinery PDR-011 codifies.

### Graduation intent

This PDR's substance is a candidate for eventual graduation into
`practice.md` (the workflow section) or `practice-lineage.md` (the
self-reinforcing loop section) once the split-loop model has been
exercised across multiple cross-repo hydrations. Graduation marks
the PDR `Superseded by <Core section>` and retains it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of the 2026-04-20 amendment, the repo where this PDR was
authored carries a **split-surface host**:

- Canonical continuity contract: `.agent/memory/operational/repo-continuity.md`
  (portable minimum fields + "Current session focus" when distinct
  from branch-primary).
- Per-thread next-session records: `.agent/memory/operational/threads/<slug>.next-session.md`
  (identity table per PDR-027 + landing target + `Lane state`
  substructure carrying owning plan(s), current objective, current
  state, blockers, next safe step, active track links, promotion
  watchlist). *2026-04-21 Session 5*: this surface absorbed the
  retired `.agent/memory/operational/workstreams/<slug>.md`
  per-lane resumption briefs.
- Single-writer tactical track cards:
  `.agent/memory/operational/tracks/<thread>--<agent>--<branch>.md`
  (git-tracked; collaborative tracks create multiple cards
  disambiguated by filename; the `<scope>` token defaults to the
  thread slug post-Session-5, with optional lane qualifier
  `<thread>-<lane>` if the thread exercises multi-lane scope).
- Session-handoff workflow: canonical in `.agent/commands/` with
  platform adapters.
- Consolidate-docs workflow: canonical in `.agent/commands/` with
  platform adapters.
- Ephemeral memory: `.agent/memory/active/napkin.md` (rotates at ~500
  lines).
- Refined memory: `.agent/memory/active/distilled.md` (target 200 lines).
- Live coordination state: `.agent/state/` (introduced 2026-04-25 by
  WS0 of multi-agent collaboration protocol). Currently:
  `state/collaboration/log.md` (embryo discovery log, schema-less,
  append-only). WS1 adds `state/collaboration/active-claims.json`
  (structured claims registry); WS3 adds `state/collaboration/conversations/`
  (per-topic conversation files) and `state/collaboration/escalations/`
  (owner-escalation surface). State surfaces are governed by
  [`.agent/directives/agent-collaboration.md`](../../directives/agent-collaboration.md).
- Experience records: `.agent/experience/`.
- Mid-session re-grounding: canonical `GO` skill with platform
  adapters.
- Behavioural entry surface: the `start-right-quick` skill
  (`.agent/skills/start-right-quick/`) carries grounding read order
  and the landing-target ritual at session open; `session-handoff`
  carries the landing-evidence ritual at session close. The prior
  `.agent/prompts/session-continuation.prompt.md` was dissolved
  (2026-04-20); its doctrine graduated to
  [PDR-026](PDR-026-per-session-landing-commitment.md) and its
  layering content to `.agent/directives/orientation.md`.

Specific field formats, exact file locations, and the current
state of each surface live in the host ADR record this PDR's
substance extracts from.
