---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface strategic open questions to the owner during consolidate-docs. Answer,
  withdraw, or leave open. A resolved question is removed — its answer lives in the
  permanent home it produced (PDR/ADR/plan/decision), which is the record. Do not
  keep a resolved-question ledger. During a DEDICATED consolidation this register is
  driven to zero exactly as pending-graduations is (owner directive 2026-06-28):
  every entry is decided — answered (graduate → remove), withdrawn, or
  explicitly kept open. "Leave open with deferral-honesty" is never an
  agent default in a dedicated pass; keep-open is a USER-ONLY grant given LIVE in
  the current pass. A recorded "keep-open granted by user, <date>" note from a
  prior session is a claim, not standing authority — it never satisfies a later
  dedicated pass by itself (precedence-is-not-approval; owner correction
  2026-07-02 after two recorded grants were found not to carry the owner's
  agreement). Where a question is genuinely long-lived, prefer re-homing it into
  the owning artefact (plan / PDR open-questions / thread record) over holding it
  here under a grant.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Open Questions

Register of **strategic, genuinely-open architectural / design questions** — the
kind that name a fork in future direction, have no decisive answer yet (the
[decision lenses](../../directives/principles.md#decision-lenses--order-of-resolution)
do not resolve them), and are not blocking a current cycle. Each names the
question, why it shapes future work, why it is not cheaply answerable now, its
owning artefact, and a status with a resolution trigger. They are surfaced to the
owner at each consolidation and either answered (then removed), withdrawn,
re-homed into their owning artefact, or kept open by a **live** user grant given
in that pass — a grant note recorded by a prior session is a claim to re-verify,
never standing authority.

## What belongs here — and what does not

**Belongs**: a strategic architectural / design question whose answer changes the
shape of future work and which nobody can decide now — it needs owner direction,
an incoming engineer's design, or evidence that does not yet exist.

- *"What is the content-structure graph's node/edge schema, and how does it join
  to atomic concepts and lesson slugs?"* (a question that shapes a whole domain's
  graph-of-graphs and is genuinely undecided by anyone available.)

**Does NOT belong** — route via
[`ephemeral-to-permanent-homing.md`](ephemeral-to-permanent-homing.md):

- **"What should we do next?"** (sequencing / operational priority) →
  [`repo-continuity.md`](repo-continuity.md) Next Safe Steps, or the owning plan.
- **An operational / coordination decision** (*"should we re-establish the
  Director seat?"*) → an owner decision recorded in `repo-continuity.md` Open
  Owner-Decision Items or the owning thread record — not a standing open question.
- **A design decision that just needs a session** (candidate options exist; it
  only needs the time to choose) → an exploration / research plan in `plans/`.
- **Learned doctrine awaiting a home** → [`pending-graduations.md`](pending-graduations.md).
- **A resolved question** → remove it; its answer lives in the permanent home it
  produced (the PDR / ADR / plan / decision), which is the record that it was
  answered.

The test: a genuine open question names a *fork in future direction nobody can
close yet* — not a task to schedule, not a decision the owner has effectively
already made, not a lesson already learned.

The register is currently empty. New entries append below as `## Q-NNN — <title>` sections;
continue the Q-numbering from the git history (Q-013 was the last minted).
