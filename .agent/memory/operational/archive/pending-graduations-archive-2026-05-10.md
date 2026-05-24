---
archive_kind: pending-graduations-snapshot
archived_on: 2026-05-10
archived_by: Quiet Lurking Mask (claude-code / claude-opus-4-7-1m / 88b0a5)
archive_reason: pending-graduations.md HARD char zone (157,255 / 150,000) after the QUAR-1 graduation; substance preserved for audit trail per the graduation discipline (graduated entries retain inline body until snapshot pass).
---

# Pending-Graduations Archive — 2026-05-10 Drain

This archive holds the bodies of graduated pending-graduations
entries that were retained inline as audit trail through the
2026-05-10 drains (Sylvan Fruiting Glade + Quiet Lurking Mask
sessions). The live register at
[`../pending-graduations.md`](../pending-graduations.md) replaces
each archived entry with a one-line graduated-pointer.

The graduations log table at the head of `pending-graduations.md`
remains the canonical index of which entry graduated to which
target.

## Entries

### 2026-05-05 — pattern surface needs polarity discipline

**Graduated to**: PDR-014 amendment + bulk sweep across ~93 pattern
files; `.agent/memory/active/patterns/README.md` §Polarity.
**Source**: pending-graduations.md L437–495 prior to 2026-05-10
snapshot.

+ 2026-05-05; **pattern surface needs polarity discipline — every
  pattern entry must be explicit about whether it is a pattern to
  repeat, an anti-pattern to avoid, or whether the substance is a
  recurring observation that does not yet have an actionable shape
  and belongs elsewhere** (Owner-asked aside during Opalescent
  Threading Nebula's promotion pass, 2026-05-05).
  `[captured: 2026-05-05 | source: owner-direction | target: multi:pattern:patterns/README.md+pattern-sweep+pdr:PDR-014-amendment | trigger: owner-direction | size: L | status: graduated 2026-05-10]`
  The existing
  `patterns/README.md` taxonomy splits by category (code /
  architecture / process / testing / agent) but not by polarity.
  The `prevents_recurring_mistake` frontmatter criterion implicitly
  covers anti-patterns without distinguishing them from patterns
  to repeat — the freshly-authored
  `eager-rounding-off-on-partial-structures.md` is type
  *anti-pattern* but reads as if it could be either at first
  glance. Recurring observations that are neither directly
  repeatable nor failure modes to avoid (e.g. *"the cyclical
  learning-loop is a full-time process"*) belong in distilled.md
  (cross-session refinements) or pending-graduations (queued
  candidates) rather than in patterns/. Source surface: owner
  message during this session's promotion pass; immediate fix
  applied to `eager-rounding-off-on-partial-structures.md` (added
  `polarity: anti-pattern` frontmatter field + explicit POLARITY
  blockquote in the body). Graduation-target options: (a)
  amendment to `.agent/memory/active/patterns/README.md` adding
  polarity discipline to the taxonomy and frontmatter schema with
  the three categories explicit *(landed in this same commit;
  status partially graduated)*; (b) sweep over existing pattern
  files to backfill polarity markers *(deferred to fresh restart
  session — bulk edit across ~70 files exceeds current session's
  context budget)*; (c) Practice-Core promotion (PDR-014
  amendment to the routing discipline naming polarity as a
  required field at pattern-graduation time) after the host
  operational form stabilises and a second Practice-bearing repo
  surfaces the same recording-shape question. Note: PDR-014
  rather than PDR-007, because polarity is a routing concern (how
  substance is classified into the patterns surface) rather than
  a Core-pattern-shape concern (the former Core patterns directory
  was retired 2026-04-29 per PDR-007 amendment, so PDR-007 cannot
  carry polarity-of-Core-patterns substance).
  Trigger: owner direction in this turn (do this in the same
  promotion pass) OR queue for fresh restart session if scope
  exceeds context budget. Status: `partially graduated 2026-05-07`
  (Pelagic Rolling Harbour) — option (a) README amendment landed
  in [`patterns/README.md`](../active/patterns/README.md)
  §Polarity (required, every pattern), §Frontmatter Schema
  `polarity: pattern | anti-pattern` field. **Fully graduated
  2026-05-10 (Sylvan Fruiting Glade)** — option (b) bulk
  backfill sweep landed across ~93 pattern files; option (c)
  PDR-014 amendment landed in the same session.

### 2026-05-05 — 30% context budget for directive-file processing

**Graduated to**: PDR-052 (Directive-File Context Budget).
**Source**: pending-graduations.md L447–492 prior to 2026-05-10
snapshot.

+ 2026-05-05; **30% context budget for directive-file processing
  is a standing rule, not a session-scoped suggestion** (Owner-
  stated during Opalescent Threading Nebula's promotion pass with
  explicit "this is always true").
  `[captured: 2026-05-05 | source: owner-direction | target: pdr:directive-file-context-budget | trigger: owner-direction | size: XL | status: graduated 2026-05-10]`
  Files under
  `.agent/directives/` (principles.md, AGENT.md, orientation.md,
  tdd-as-design.md, testing-strategy.md, schema-first-execution.md)
  are deep, dense, and structurally load-bearing — every agent
  reads them at every session open; mistakes compound across the
  entire Practice. The error rate of editing operations rises
  sharply under context pressure; the disposition that produces
  *"I'll just be careful"* under pressure is the rounding-off
  failure mode named at
  `.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md`.
  The 30% threshold leaves headroom for full-depth file reading,
  existing-structure comprehension, and editing without
  crowding-out. The cure is structural: directive-file work is
  sequenced as the FINAL step of any consolidation pass (napkin →
  other capture surfaces → distilled → pending-graduations →
  directives, in that order); at the boundary before directive
  work, the context-usage check fires; if context is at or above
  30%, finish current-step work, write a session-handoff opener,
  and queue the directive work for a fresh session. Source
  surface: owner direction this session; user-memory
  `feedback_30_percent_context_for_directives.md`; distilled.md
  §Process entry. Graduation-target: PDR in
  `practice-core/decision-records/` covering high-stakes-editing
  context-budget discipline (adopter scope: every Practice-bearing
  repo with directive files; the rule is portable). Trigger: owner
  direction has fired ("this is always true" = standing).
  **Status: due — but PDR landing is itself directive-shaped work
  that requires <30% context**, which this session does not have.
  Queued for the fresh restart session per owner direction
  *"likely the starting again will need to happen in a fresh
  session"*. Self-applying graduation: the rule queues itself for
  the session where it can be safely landed. **Sequenced-deferral
  pointer (2026-05-07, Pelagic Rolling Harbour)**: dedicated
  PDR-authoring session — Phase 1 — author PDR
  `directive-file-context-budget` in
  `practice-core/decision-records/`; Phase 2 — register in
  CHANGELOG and decision-records/README.md; Phase 3 — graduate
  user-memory `feedback_30_percent_context_for_directives.md`
  reference to PDR-NNN. **Fully graduated 2026-05-10 (Sylvan
  Fruiting Glade)** as PDR-052.

### 2026-05-05 — orchestrator-vs-gate structural cure

**Graduated to**: PDR-053 + ADR-176 + script rename
(`check-commit-skill-gates.ts` → `check-commit-skill-advisories.ts`)
+ commit-skill SKILL update.
**Source**: pending-graduations.md L804–832 prior to 2026-05-10
snapshot.

+ 2026-05-05; **PDR candidate — orchestrator-vs-gate structural cure**
  (5 instances today across 4 distinct agents: Ethereal Transiting Comet,
  Dawnlit Transiting Galaxy, Opalescent Threading Nebula, Twilit Beaming
  Aurora, Fronded Climbing Pollen).
  `[captured: 2026-05-05 | source: napkin+distilled.md | target: multi:pdr+adr+script:check-commit-skill-advisories+skill:commit | trigger: n>=3-validation+owner-implicit | size: XL | status: graduated 2026-05-10]`
  Distilled.md addition just landed at
  `368e5aff` (advisory-vs-blocking authority distinction). The pattern
  fires under failure pressure regardless of agents having read the
  doctrine — Threading Nebula authored the cure pattern AND fired the
  cure pattern same session; Fronded fired it AFTER my landing of the
  doctrine into HEAD. Reading does not inoculate; structural cure
  required. Cure shapes: (a) rename `scripts/check-commit-skill-gates.ts`
  → `scripts/check-commit-skill-advisories.ts` (sever the
  linguistic invariant); (b) banner `[ADVISORY ONLY — NOT A COMMIT GATE]`
  at top of every script invocation output; (c) SKILL.md clarification
  in commit skill that lists the actual blocking hooks
  (`.husky/pre-commit` chain) explicitly without the fitness gate. Source-
  surface: distilled.md just-landed plus napkin Surprise 2. Graduation-
  target: PDR + companion ADR + cure-implementation commit. Trigger:
  graduation-ready (5 instances >= threshold for behaviour-changing
  structural cure). **Fully graduated 2026-05-10 (Sylvan Fruiting
  Glade)** as PDR-053 + ADR-176 + script rename + skill update.

### 2026-05-01 — `stop inventing optionality` / apply-don't-ask (QUAR-1)

**Graduated to**: PDR-057 (empirical-answerability) + PDR-058
(three-tier optionality decomposition).
**Source**: pending-graduations.md L1989–2050 prior to 2026-05-10
snapshot.

+ 2026-05-01; **`stop inventing optionality` / apply-don't-ask** —
  **QUARANTINE CLEARED 2026-05-10 by graduation to PDR-057 + PDR-058
  (Quiet Lurking Mask session)**. The original candidates remain
  DO NOT APPLY in their original shapes; the substance is now
  governed by the supersessor PDRs. Quarantine record at
  [`quarantine/apply-dont-ask-doctrine.md`](../quarantine/apply-dont-ask-doctrine.md)
  is preserved as historical evidence of the 2026-05-01
  destructive incident and the owner reformulations that followed.
  `[captured: 2026-05-01 | source: owner-direction-after-incident | target: PDR-057 + PDR-058 | trigger: owner-direction(rejection-OR-reformulation) | size: XL | status: graduated 2026-05-10]`
  The doctrine
  contributed to (or ran alongside) a destructive `git checkout --`
  that discarded parallel-agent uncommitted work; the bias toward
  action lacks a destructive-operation guard. The candidate was
  removed from active circulation pending deep human review.
  Substance, evidence trail, and pointers preserved at
  [`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../quarantine/apply-dont-ask-doctrine.md).

  **2026-05-01 owner-direction reframe (both candidates)**:

  + *apply-don't-ask*: the rule needs reworking into something like
    **"can this question be answered empirically?"** The action-bias
    framing was wrong; the load-bearing distinction is whether the
    question has a determinate answer reachable by reading code,
    data, vendor docs, or generator output, versus genuinely
    requiring owner judgement. Reformulation is owed before any
    re-graduation attempt.

  + *stop inventing optionality*: rule moves in the right direction
    but **not necessarily at the right layer, level of abstraction,
    or mechanism**. We need to name the impact first and re-think
    from there — drafting the rule before naming the impact is
    itself an instance of the failure mode the doctrine was trying
    to name. Three distinct surfaces of "invented optionality" are
    observed in the existing evidence trail and may decompose into
    separate rules with different impacts:
    + *Decision optionality* — bouncing forks to the owner that
      have a determinate empirical answer (the apply-don't-ask
      surface above; impact: wastes owner judgement, fragments
      decision authority).
    + *Design optionality* — adding configurable / optional /
      extensible surface to a design that doesn't need it
      (impact: erodes types, bakes in fragility).
    + *Outcome optionality* — writing acceptance criteria that
      hedge ("if X then Y else Z") when there is a single right
      answer, or that depend on infrastructure that doesn't exist
      (e.g. fantasy LLM-graded evals; impact: produces
      unfalsifiable plans, see the don't-shoehorn-a-value-claim
      doctrine candidate above).

    **Status update 2026-05-10 (Quiet Lurking Mask)**: both
    reformulations drafted and graduated. *apply-don't-ask* →
    [PDR-057 (empirical-answerability)](../../../practice-core/decision-records/PDR-057-empirical-answerability.md).
    *stop-inventing-optionality* → [PDR-058 (three-tier optionality
    decomposition)](../../../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md);
    Surface 1 (decision optionality) is fully subsumed by PDR-057;
    Surfaces 2 (design optionality) and 3 (outcome optionality) are
    routed to standalone graduation candidates below.
