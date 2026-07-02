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

The fire points: a task/owner-pointer arrives; an elaboration boundary; doctrine
sharpens; **and the moment of declaring "done".**

**Completeness criterion:** *no consumer arriving through any entry point meets a
stale or wrong state, and nothing relevant to the goal is left unwalked.*

## Proportionality (this is not plan-theatre)

- **Trivial** (a typo, a one-line answer): skip the artefact.
- **Bounded**: one `GOAL · IN · OUT` line.
- **Multi-surface / governance / cross-cutting**: the set is the deliverable — name it.

**Impact test** (per `feedback_metacognition_impact_test`): if producing the artefact
never changes the approach, it is ceremony. Its job is to catch a too-narrow scope or
an ungrounded gate *before* you act — not to decorate the turn.

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
