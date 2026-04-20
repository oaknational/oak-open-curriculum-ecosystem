---
pdr_kind: governance
---

# PDR-011: Continuity Surfaces and the Surprise Pipeline

**Status**: Accepted (amended 2026-04-20)
**Date**: 2026-04-18 (amended 2026-04-20 — contract host abstracted
from "primary session-continuation prompt" to "canonical repo-local
surface set"; field set split into portable minimum plus optional
epistemic fields; host-local context updated to reflect split
surfaces. Doctrine — capture→distil→graduate→enforce, split-loop
model, three continuity types — unchanged.)
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract under which this PDR is authored);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(continuity surfaces live as canonical artefacts with thin platform
adapters — same architecture this PDR inherits);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(specialists that may be invoked from the continuity surface).

## Amendment Log

- **2026-04-20**: §"The continuity contract" host language abstracted;
  field set restructured into a portable minimum plus optional
  epistemic fields; §Host-local context updated to reflect the
  state-surface split (`repo-continuity.md` + `workstreams/<slug>.md`
  + `memory/operational/tracks/*.md`). The portable doctrine and the contract's
  authority-subordinate role to active plans are unchanged.

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
across a canonical file + per-workstream briefs + single-writer
tactical track cards remain compliant, provided the authority order
between surfaces is explicit, each surface has a single documented
writer, and the fields below are covered in aggregate.

**Portable minimum fields** (every repo carries these, regardless of
host shape):

- **Active workstreams** — lanes currently in play.
- **Branch-primary workstream brief** — pointer to the primary lane's
  resumption brief (if the host splits per-lane state into a separate
  surface) or an inline compact status block (if the host does not).
- **Repo-wide invariants / non-goals** — constraints carried forward.
- **Next safe step** — operational-continuity content: what the next
  session should do first.
- **Deep consolidation status** — whether the consolidation gate has
  been run and what it found.

**Optional (host-local placement)** — these may live on the canonical
contract, on a per-workstream brief, or on the napkin, but they MUST
be present somewhere the next session reads before acting:

- **Current session focus** — only when distinct from the
  branch-primary lane (e.g. a parallel thread).
- **Recent surprises / corrections** — epistemic-continuity content.
- **Open questions / low-confidence areas** — epistemic-continuity
  content.

The contract remains **operational** only. Active plans remain
authoritative for scope, sequencing, acceptance criteria, and
validation. The contract is not a duplicate of plan content — it is
a compact resumption surface that points at the plans.

### The surprise-to-enforcement pipeline

Surprise and correction follow a named pipeline:

```
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
- Per-lane resumption briefs: `.agent/memory/operational/workstreams/<slug>.md`
  (owning plan(s), current objective, current state, blockers, next
  safe step, active track links, promotion watchlist).
- Single-writer tactical track cards:
  `.agent/memory/operational/tracks/<workstream>--<agent>--<branch>.md`
  (git-tracked; collaborative tracks create multiple cards
  disambiguated by filename).
- Session-handoff workflow: canonical in `.agent/commands/` with
  platform adapters.
- Consolidate-docs workflow: canonical in `.agent/commands/` with
  platform adapters.
- Ephemeral memory: `.agent/memory/active/napkin.md` (rotates at ~500
  lines).
- Refined memory: `.agent/memory/active/distilled.md` (target 200 lines).
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
