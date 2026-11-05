---
classification: core
description: Before approach and before declaring done, restate the goal and derive the full relevant surface set — emit a proportionate Goal/In/Out artefact; the pointer is evidence about the goal, not the task
---

# Scope From the Goal Before Approach

Operationalises [PDR-103](../practice-core/decision-records/PDR-103-scope-from-goal-before-approach.md).
Sibling to [`re-apply-first-question-at-elaboration-boundaries`](re-apply-first-question-at-elaboration-boundaries.md):
that rule re-asks the **pruning** question ("could it be simpler?"); this one re-asks
the **scoping** question ("what is the goal, and what is the full relevant set?").

## The Rule

A task usually arrives as a **pointer** — "fix this file", "handle this", "is X
right?". The pointer is evidence *about* a goal; it is **not** the task. Before
starting the approach, and before declaring an examination or verification done:

1. **Restate the goal** the pointer serves.
2. **Derive the full relevant set** from that goal — every surface, work item, and
   downstream consumer that sits in the goal's context, not just the thing pointed at.
3. **Emit a proportionate artefact** before the first substantive tool call:

   ```text
   GOAL  <what this serves>
   IN    <the full relevant set>
   OUT   <what is deliberately excluded, and why>
   ```

4. **Walk the in-scope set** before claiming done.

A value the owner set is always OUT of a "fix the nits" or "tidy the metadata"
scope: a licence field, a package name, a description, an author line. Changing
one is a decision, never a nit, and it happens only on the owner's explicit word
(owner, 2026-09-29, after a seat rewrote `UNLICENSED` and four other fields it
read as inconsistent metadata). The tell to stop at is writing "the owner can
veto it in the summary": that sentence marks a decision being taken in the
owner's place; the check is a diff against the owner's version, never against
the seat's intent.

**Standing capabilities are in the IN set.** Everything that observes, guards, or
serves today — every third-party integration, sink, allowlist, CI leg, permission —
is part of the goal state, not background. A proposal that adds X and silently
narrows Y shifts the catch burden onto the owner (owner, 2026-07-29, after
sink-selection proposals omitted Sentry while adding PostHog: "I shouldn't have to
say things like 'Sentry needs to keep working'" — and the class-level form, "Sentry,
Posthog, Elasticsearch and all third party integrations need to keep working in the
production instance, obviously"). When proposing or altering configuration, diff the
proposal against the capability baseline and carry every standing capability forward
explicitly; an omission must be argued, never silent. Where the owner declares
something non-negotiable, encode it as a validator the same day, so the sentence
never needs saying again — the test is whether the correction could have been
prevented by a mechanical check; if so, that check is the correction's real
deliverable.

The fire points: a task/owner-pointer arrives; an elaboration boundary; doctrine
sharpens; **and the moment of declaring "done".**

**Completeness criterion:** *no consumer arriving through any entry point meets a
stale or wrong state, and nothing relevant to the goal is left unwalked.*

Under an instruction to fix, or to fix the nits, a value the owner typed is out of scope unless
the owner's explicit word puts it in: a licence, a name, a description. Leave it and say what was noticed
(owner ruling, 2026-09-29, after a licence field the owner had set was changed to agree with
another file). The check is a diff of the file against the owner's version, never against the
seat's intent: the intent always agrees with itself.

## Proportionality (this is not plan-theatre)

- **Trivial** (a typo, a one-line answer): skip the artefact.
- **Bounded**: one `GOAL · IN · OUT` line.
- **Multi-surface / governance / cross-cutting**: the set is the deliverable — name it.

**Impact test**: if producing the artefact never changes the approach, it is
ceremony. Its job is to catch a too-narrow scope or an ungrounded gate *before*
you act — not to decorate the turn.

**Depth is earned by the decision in front of you, never by the interestingness
of what turns up.** Owner, 2026-07-25, after a dependency sweep grew into a
security engagement: "this MCP is a means of putting free educational material in
the hands of teachers, not preventing terrible things — I asked for an update of
deps, not an overhaul of settled architecture." The drift is seductive because
each step is individually defensible — an audit surfaces advisories, advisories
invite exposure questions, those invite import-graph tracing and environment
probing — and a defensible discovery is not a mandate to keep digging. The threat
model is the product's own. Re-read the literal ask before each new investigative
step; "update the deps" ends when the deps are updated; when something genuinely
alarming turns up outside scope, state it in one sentence and route it — open no
lane, probe no deployed environment, file no finding requiring disposition. Once a
landing is in reach, every further edit to the records must change what a
successor would DO (owner, 2026-09-02: "not important enough to spend a cycle
on!") — a factual cure yes, a pointer or a heading date no.

**Light-scan-before-deep applies to BUILD goals, not only to analysis.** Given a
concrete build goal, the proportionate first move is the simplest working thing
that delivers it — not a deep architecture review before any code exists. Scoping
from the goal tells you *what* the build must cover; it does not licence
front-loading design ceremony the goal does not need. Build the simplest thing
that works, ship it, then let real friction (not anticipated friction) drive the
next increment.

## The Two Failure Modes It Catches

| Face | Symptom | Cure |
|---|---|---|
| **Under-scope** | Examine exactly what was pointed at; declare done; the owner points at the co-located surface you skipped | Derive the full relevant set from the goal; walk it before "done" |
| **Over-gate** | Invent a constraint/permission from inherited doctrine ("X is owner-ratified") | Ground the gate against current policy; cite it or drop it (`gates-must-be-citable`) |

Both are the same defect: a frame (the pointer's implied scope; an inherited gate)
accepted **fluently** and acted on before it is grounded against the goal. The fluent
arrival is itself the trigger to scope (see `fluency-is-a-failure-vector`).

## The Forced-Answer Test (solution-shaped pointers)

A pointer often arrives already shaped as a **solution** — "introduce X", "add a guard",
"refuse bare-relative paths", "fix it this way". A solution-shaped pointer hides its problem,
and you can execute it faithfully — full TDD, reviews, a green commit — while answering a
**mis-posed** question. Before building on one, restate the *problem* as a one-line question and
check whether the answer is **forced**:

- A **ripe** question has one obvious answer (as a precise schema forces the types). Build.
- If you find yourself *designing, comparing options, or weighing trade-offs*, the question is
  **unripe** — sharpen it (with the owner when the framing is theirs) before building. The
  proper question usually makes the answer adjacent and dissolves most of the apparatus.

Reviewers must check the solution's **frame**, not only its quality — a solution-framing makes
every reviewer route *around* the simpler answer. (Source: 2026-06-21 WS-3 F-41, owner-taught.)

## Enforcement

Active-by-artefact: the `GOAL · IN · OUT` output is observable (owner, reviewer,
statusline) and falsifiable, which is stronger than a passive reminder
(`passive-guidance-loses-to-artefact-gravity`). It is **not yet hook-enforced**: per
PDR-103, a harness hook is the evidence-gated escalation if the artefact is shown
skipped under pressure (a second recorded instance) — the same firing-surface question
as `open-questions.md` Q-001.

## Doctrinal Anchors

- [PDR-103](../practice-core/decision-records/PDR-103-scope-from-goal-before-approach.md)
  (the decision this operationalises)
- [PDR-029](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  (tripwire-as-artefact doctrine)
- `re-apply-first-question-at-elaboration-boundaries.md` (the sibling pruning question)
- `directives/metacognition.md` §Two Modes (generative / purpose-by-default — this is
  that mode made routine)
