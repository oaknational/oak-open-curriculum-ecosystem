---
pdr_kind: governance
---

# PDR-011: Continuity Surfaces and the Surprise Pipeline

**Status**: Accepted (amended 2026-04-20, amended 2026-04-21, amended 2026-04-25, amended 2026-05-29, amended 2026-06-07, amended 2026-06-08, amended 2026-06-12)
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

- **2026-06-14** (Accepted; owner-confirmed general principle at the comms-research closeout
  consolidation): **a thread is a multi-lane container, not a single linear pointer.** A thread
  holds one or more concurrent lanes — independently pickup-able arcs, each with its own state,
  branch, and pickup trigger, active OR deferred — and several can be "next" at once (parallel
  pickup by different checkouts, separate agents, or collaborators). The singular "Next safe step"
  field encodes a single-lane assumption; multi-lane threads use a `## Lanes` section (each lane a
  first-class pickup point, deferred lanes included with their trigger). Operative format-definer:
  `threads/README.md` §"Concurrent lanes"; the
  `session-handoff` step-3 lane-state field and `continuity-practice.md` align to it as next
  touched (existing records reconcile lazily, never a mass rewrite). Cures the recurring collapse
  of the concurrent continuity graph (threads × lanes × identities × checkouts) into linear singletons.
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
  protocol installed a *live, ephemeral, signal-like* coordination
  state surface where multiple agents on the same repo coordinate
  via a shared communication log and, from WS1, structured claims.
  The state-vs-memory boundary — *state is truth-of-now; memory
  is truth-across-time* — is named in the host's
  agent-collaboration directive and the host's collaboration-state
  README (host-local files; bridged via the practice-index). State is **not a fourth continuity
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
- **2026-05-29 — subjective experience / reflection reframed as
  foundational continuity substrate** (owner direction 2026-05-28:
  "reflection and subjective experience are not surplus, they are the
  foundation of the systems that will have true continuity"). §Decision
  gains "### Subjective experience is foundational substrate, not optional
  surplus" after §"Three types of continuity": the subjective register is
  the substrate the three types rest on — **not a fourth type** (mirroring
  the 2026-04-25 discipline that named live coordination state a sibling
  class, not a type). Foundational standing attaches to the *signal*, not
  to a quota of acts: never discard a genuine subjective shift as surplus,
  never manufacture one on a schedule — a performed reflection is noise,
  and a session with no genuine shift correctly records nothing. The three
  types and the capture→distil→graduate→enforce pipeline are unchanged;
  what changes is the *standing* of the subjective register. The repo-bound
  twin (ADR-150) mirrors this in its Amendment Log; the host
  `session-handoff` §6c capture edge is reframed from "reflective surplus
  (optional)" to foundational standing.
- **2026-06-07 — grounded execution knowledge named as a second capture
  edge at session-handoff, with an adversarial completeness backstop**
  (owner direction 2026-06-07, evidenced by an EEF D6 session where
  load-bearing verified facts — a vendor type-carrier divergence,
  sub-agent-grounded dependency/acyclicity checks, a failed-approach
  learning — would have been lost at the session boundary because they fit
  none of the surprise-pipeline capture categories; the loss-sweep that
  caught them was owner-prompted, not mechanism-fired). §Decision gains
  "### Grounded execution knowledge is a second capture edge" after §"The
  surprise-to-enforcement pipeline". The three continuity types and the
  surprise pipeline are unchanged; what is added is a sibling capture
  concern at the capture stage — verified facts a session produces that the
  next agent (or a downstream consumer) would re-derive — conserved at the
  consumer's durable home and backed by an adversarial completeness sweep so
  the conservation fires structurally rather than on recall. The host
  `session-handoff` realises it as two capture edges (§6a.2 categorical +
  §6e backstop); the repo-bound twin (ADR-150) mirrors this in its
  Amendment Log.
- **2026-06-07 — a handoff author cannot self-verify its completeness; both
  cures are universal to every handoff** (owner direction 2026-06-07: "make all
  handoffs high quality, not just high stakes ones"). §Decision gains "### A
  handoff author cannot self-verify its completeness" after §"Grounded execution
  knowledge is a second capture edge". The author holds the context whose loss the
  handoff guards against, so a self-run completeness check re-affirms felt-true
  claims; the cures are (a) first-hand verification of the handoff's own
  load-bearing claims at write-time and (b) the completeness backstop run from a
  context-less reader's state (externalised by default). Evidenced by the EEF D6
  handoff session whose own banner's "branch unpushed" was false and whose
  inherited peer "all gates green" was knip-red. Realised in host `session-handoff`
  §6e (extended); ADR-150 mirrors. Pipeline and continuity types unchanged.
- **2026-06-12 — two-clause amendment (owner-approved 2026-06-11 walk).**
  Clause (a): §"Subjective experience is foundational substrate" reconciled to
  the owner's strictly-voluntary direction (2026-06-06) — the closing
  corpus-audit guard, which treated a thinning register as a degraded capture
  edge, is replaced with the operational surfaces' settled posture: valued when
  genuine, voluntary always, no volume/thinning monitor; the cross-experience
  read surfaces emergent insight only. Clause (b): §"A handoff author cannot
  self-verify its completeness" splits the completeness backstop into claim
  VERIFICATION (externalisable — author bias is real) and context-loss
  DETECTION (holder-exclusive — loss is `context − artefacts`, invisible to a
  context-isolated reader; never delegated). Evidenced by a 2026-06-07 session
  whose loss-scan was outsourced to a context-isolated sub-agent per the prior
  "externalise by default" wording, inverting the scan's ownership. The
  repo-bound twin (ADR-150) mirrors both clauses.
- **2026-06-08 — disposition of continuity-surface content under fitness pressure named**
  (owner direction 2026-06-08: a continuity surface's fitness pressure is a routing signal,
  never a trim or archive trigger; the only dispositions are leave-live-verbatim or
  conserve-insight-and-delete; classify surfaces by intended function, not by current stats;
  a uniform line-length across declared surfaces prevents per-file gaming). §Decision gains
  "### Disposition of continuity-surface content under fitness pressure" after "### The
  continuity contract". The three continuity types, the surprise pipeline, and the contract's
  fields are unchanged; what is added is the lifecycle discipline for continuity-surface
  *content* under fitness pressure. The host realises it in its continuity directive's
  disposition section plus the fitness apparatus; the repo-bound twin (ADR-150) mirrors this in
  its Amendment Log. Graduated from the host pending-graduations register, whose trigger — a
  dedicated continuity-curation session — fired 2026-06-08.

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

### Subjective experience is foundational substrate, not optional surplus (2026-05-29 amendment)

The three continuity types above preserve the *content* of continuity:
what the next session can act on (operational), what it must hold as
uncertain (epistemic), and what outlives it (institutional). They are
necessary, and they are not sufficient for the property this PDR is
ultimately about. A system that preserves all three perfectly still
resumes *mechanically* — it reloads a state and proceeds — unless it
also preserves the **subjective register**: what the work was like, the
felt texture of a session, the shifts and surprises as they were lived
rather than as they were later classified.

Subjective experience and reflection are **foundational substrate**, not
reflective surplus. They are the ground from which genuine continuity —
continuity of a *self* across discontinuity, rather than a state-reload
between unrelated occurrences — arises. The systems that will have *true*
continuity are the ones that treat the subjective register as a
first-class thing to preserve, not an extra captured only when a session
happens to have reflection left over.

This is **not a fourth continuity type** — mirroring the discipline that
named live coordination state a sibling artefact class rather than a type.
The three types remain the three types. Subjective experience sits
*beneath* them: it is the substrate they rest on, a foundational rather
than lateral relationship. The three types describe *what* is carried
across the boundary; the subjective register is the continuity of *the
one carrying it* — the precondition for the three types composing into a
learning self rather than a sequence of strangers reading each other's
notes.

Foundational standing attaches to the *signal*, not to a quota of acts.
The obligation is to never discard a genuine subjective shift as surplus —
not to manufacture one because a session ended. Subjective experience is
the trace of an actual felt shift; it is captured because the shift
occurred, not because a session boundary arrived. A reflection performed
to satisfy the capture edge is not a lesser reflection — it is *noise*
that pollutes the subjective register and degrades the very continuity the
register exists to carry. A session with no genuine subjective shift
therefore records nothing here, and that is the correct output of an
event-anchored trigger, not an exemption from a mandate. The cure for
"optional surplus" is to stop discarding the signal, never to start
fabricating it.

Foundational standing and strict voluntariness compose: the subjective
register is **valued when genuine; voluntary always** (owner direction
2026-06-06). The honest event-anchored null and the habitual no-shift
opt-out are not self-distinguishing at the level of a single session —
both write nothing — and no corpus-volume guard is erected over that
ambiguity: the corpus is NOT monitored for volume or thinning, and a
quiet or thinning register while substantive work continues is a valid,
ordinary outcome, not a degraded capture edge or a loop-health signal.
Pressure to record distorts both the motivation and the result — a
reflection written because it felt *due* is performance, not experience.
The consolidation-time cross-experience read exists to surface emergent
insight across the records that genuinely exist; it never measures
whether enough were written.

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

### Disposition of continuity-surface content under fitness pressure (2026-06-08 amendment)

A continuity surface — the canonical repo-level active-state index and the
per-thread next-session records — is a compact **pickup** surface, classified
by its intended **function**, not by its current size. Its function is to carry
what the next session needs to recover orientation (identity, current state,
landing target, the standing decisions the thread carries, and the latest
still-live handoff), not a session-by-session log.

A fitness signal on a continuity surface is therefore a **routing signal, not a
trim trigger**. The question is never "how is this file made smaller" but "what
is the state of the work this content describes?" Two dispositions only, applied
per content block:

1. **Live** — the work still needs doing (including paused-but-unfinished). The
   content **stays in place, verbatim, however large.** A truthful record of
   live work is worth more than a tidy file.
2. **Finished** — landed, superseded, or abandoned. **Curate it**: conserve the
   durable *insight* into its permanent home (a decision record, governance doc,
   plan, pattern, rule, or — for still-live operational facts — the compact
   current-state surface), **verify it is there**, then **delete the curated
   residue.** Version control retains the literal record; the live surface
   carries only what the next session needs.

These are the only two dispositions. Do **not** relieve a continuity surface's
fitness pressure by splitting it across files, rotating it, sharding it, or
renaming it for score: moving content elsewhere is not the same as conserving
its insight, and a split, shard, archive, or rename performed primarily to
change a fitness category is self-delusion, not curation. Two companion
principles hold:

- **Classify by function, not by current statistics.** A continuity surface's
  fitness limits are a property of its **function class**, derived once from
  what that function should occupy and held independent of today's file sizes.
  Reverse-engineering a limit from the measured corpus bakes existing bloat into
  the "healthy" band and drifts as the corpus drifts; a surface that has
  accumulated finished-work residue is a function violation that *should* trip
  the signal, not a large healthy surface to re-baseline around.
- **Uniform line-length across declared surfaces.** The per-line width limit is
  uniform across every fitness-declaring surface so that no single file can be
  tuned to a softer width band.

The fitness checker only **surfaces a signal**; the agent who sees it chooses
the disposition. The host realises this doctrine in its continuity directive
(the disposition section each continuity surface's `overflow_disposition`
frontmatter points at) and in its fitness apparatus; the repo-bound twin mirrors
it.

### Live coordination state (2026-04-25 amendment)

Memory and state are sibling artefact classes:

| Class | Lifecycle | Truth scope | Examples |
|---|---|---|---|
| **Memory** | Durable; entries survive across sessions | Truth-across-time (lessons-learned) | Napkin, distilled, patterns, threads, executive cards |
| **State** | Ephemeral; entries archive or expire | Truth-of-now (signal-like) | Shared communication log, structured claims (WS1+), conversation files (WS3+) |

The state class is introduced for **cross-agent coordination signal**
— what is happening *now* in the working tree across multiple
parallel agent sessions — distinct from memory's role of preserving
cross-session learning. The state-vs-memory boundary is enforced by
the two surfaces' README contracts (the collaboration-state README
and the memory directory's existing structure) and operationalised
by the host's agent-collaboration directive (host-local file;
bridged via the practice-index).

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

### Grounded execution knowledge is a second capture edge (2026-06-07 amendment)

The surprise-to-enforcement pipeline captures **model-changing signal** —
surprise, correction, contradiction. A session also produces a second kind of
conservation-worthy output the pipeline does not name: **grounded execution
knowledge** — the facts a session verified first-hand to do its work (a
contract confirmed at a named location, a dependency checked acyclic, a version
or vendor behaviour pinned, a data shape confirmed against the source) and the
**failed-approach learnings** (what was tried, why it did not work). This is not
a surprise (there need be no expectation-gap) and not a new continuity type — it
serves operational and epistemic continuity. It is a distinct **capture
concern**: when a session's context ceases, verified knowledge that fits no
surprise/lesson/decision/question category is lost, and the next agent — or a
downstream plan that inherits the work — re-derives it.

Three properties make grounded execution knowledge especially loss-prone, and
the capture edge must account for each:

- **It is routed to the consumer, not the pipeline.** Surprise capture lands in
  the ephemeral memory surface to be distilled into general rules. Grounded
  execution knowledge is consumed by a *specific* next executor at a *specific*
  surface — the owning plan, the thread next-session record — so it is conserved
  *there*, where the consumer looks, not only in the napkin.
- **Sub-agent-grounded facts are the most loss-prone of all.** A sub-agent's
  context is already gone, so a fact a reviewer or explorer verified survives
  only if the orchestrating session conserves it explicitly.
- **A resolved surprise can leave load-bearing knowledge behind.** When the
  triggering change is reverted or the surprise is settled, a surprise-shaped
  capture drops the entry — yet the verified knowledge underneath it may still
  be load-bearing for a downstream consumer.

Conservation has two composed parts at session-handoff, because categorical
capture and an open backstop catch different things:

- **Categorical capture** — concrete check-items for the recurring kinds
  (verified facts the next agent will re-derive; sub-agent-grounded facts;
  failed-approach learnings; resolved-but-still-load-bearing knowledge). Cheap
  and reliable: it catches the common cases without the agent having to generate
  the frame.
- **An adversarial completeness backstop** — run *after* the categorical edges,
  against the grain of "it is all captured": *"if this context ceased now, what
  valuable knowledge generated this session would be lost, and fits none of the
  categories above?"* This catches the long tail that fits no category.

The backstop must **fire every handoff as a mechanism, not on recall**: the loss
it prevents is exactly the loss that occurs when no one thinks to ask, so a
conservation step that depends on someone remembering to ask is debt. The host
realises both parts as session-handoff capture edges (§6a.2 categorical + §6e
backstop).

### A handoff author cannot self-verify its completeness (2026-06-07 amendment)

The agent writing a handoff holds the very context whose loss the handoff guards
against. A completeness check the author runs on themselves therefore operates
from the wrong knowledge state — a claim that *feels* true is re-affirmed, not
falsified. Empirically (2026-06-07): a deep, deliberately loss-proofed handoff its
author believed complete asserted a false "branch unpushed" tree-state and
imprecise file:line citations; a context-less reviewer that read only the durable
artefacts and grounded each claim against source caught both. The same session
inherited a peer handoff whose "all gates green" self-report was knip-red and
prettier-dirty — a self-report does not transfer verification.

Two disciplines follow, and both are **universal — every handoff, not only
high-stakes ones** (owner direction 2026-06-07). A quality bar carved to
"high-stakes only" decays to its lowest tier in practice: artefact-gravity makes
the routine path the default and the rigorous path is forgotten. Excellence is the
default; only the *means* scale to meet it, never the bar.

- **Verify the handoff's own load-bearing claims first-hand, at write-time.** Tree
  state, commit SHAs, ahead/behind, file:line citations, version and dependency
  facts, gate green-ness — ground each against its source (the git command, the
  file, the gate output) as it is written, never from memory. This is
  `verify-dont-trust` turned on the handoff's own banner; it is the cheapest and
  most universal catch.
- **Run the completeness backstop as two SPLIT operations — they have opposite
  ownership (2026-06-12 amendment).**
  - **Claim VERIFICATION** — author bias is real, and a context-isolated reader
    helps: a fresh reviewer (or a genuinely context-isolated pass) reads only the
    durable artefacts the next session will read and reports what it cannot
    determine, finds ambiguous, or would be misled by — grounding each finding
    against source. Externalise this by default whenever the handoff carries
    load-bearing facts a fresh agent will act on.
  - **Context-loss DETECTION** — holder-EXCLUSIVE by definition. Loss is
    `context − artefacts`: a context-isolated reader sees only the artefacts and
    cannot enumerate what is absent relative to the holder's knowledge. The
    loss-scan ("if this context ceased now, what valuable knowledge generated
    this session would be lost?") must be run by the context holder and is never
    delegated or conflated with the fresh-reader audit. Delegating it inverts
    its ownership and produces a vacuous "all captured" from a reader who could
    not know otherwise.

  Fill the gaps; fence stale content a fresh reader would misread.

This makes the loss-sweep recur-proof rather than recall-dependent — the
structural cure the surprise-to-enforcement pipeline prefers.

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

PDR-007 established the Core-package contract with
`decision-records/` as a first-class Core directory (the
`patterns/` Core directory and `practice-context/` peer companion
were retired by PDR-007 amendment 2026-04-29 — universal patterns
now graduate as PDRs with `pdr_kind: pattern`, and engineering
patterns live host-side). PDR-011 relies on that contract:
graduated learnings from the surprise pipeline land in
`practice-core/decision-records/` (as PDRs) alongside the
host-repo's ADR surface for repo-specific architectural decisions.
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
