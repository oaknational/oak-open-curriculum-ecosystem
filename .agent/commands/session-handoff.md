# Session Handoff

**Governance**: This command operationalises
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
(host architecture) and
[PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(portable Practice governance). These name the learning path for
surprise and correction as `capture → distil → graduate → enforce`,
with the napkin as the capture surface, `distilled.md` as the
refinement surface, `consolidate-docs` as the graduation convergence
point, and ADRs / PDRs / rules / permanent docs as the enforcement
surface. Session handoff is the regular touch-point that keeps this
pipeline moving.

Lightweight end-of-session continuity update with a conditional
consolidation gate.

Use this command for ordinary session closeout. It replaces `wrap-up`.

Do **not** treat this as a full closeout ritual. Unless the user explicitly
asks for more, this command must not trigger:

- full review
- commit or push
- deep convergence by default

## Steps

1. **Refresh the live continuity contract.** Update the `Live continuity
   contract` section in `.agent/prompts/session-continuation.prompt.md` using
   these exact fields:

   - `Workstream`
   - `Active plans`
   - `Current state`
   - `Current objective`
   - `Hard invariants / non-goals`
   - `Recent surprises / corrections`
   - `Open questions / low-confidence areas`
   - `Next safe step`
   - `Deep consolidation status`

   Keep it compact and operational. Active plans remain authoritative for
   scope, sequencing, acceptance criteria, and validation.

2. **Sync the authoritative next-action surfaces.** Update the active plan and
   any relevant prompt sections if the session changed status, preconditions, or
   the immediate next safe step. Do not duplicate plan authority; clarify it.

3. **Capture surprises and corrections.** Make sure any new surprises,
   corrections, or expectation failures from this session are recorded in
   `.agent/memory/napkin.md`. Use the structured surprise format from the
   napkin skill.

4. **Run the consolidation gate.** Check the trigger checklist in
   `.agent/commands/consolidate-docs.md`.

   - If no trigger fires, set `Deep consolidation status` to
     `not due — <reason>` and stop here.
   - If one or more triggers fire, set `Deep consolidation status` to
     `due — <reason>` and continue to step 5.

5. **Escalate only when the deeper loop is clearly warranted.**

   - If the triggered work is already well-bounded and belongs to this
     closeout, continue immediately into `jc-consolidate-docs`.
   - If deep consolidation is due but not well-bounded for this closeout,
     stop after marking `due — <reason>` so the next session can pick it up
     deliberately.
   - If `jc-consolidate-docs` runs now, refresh `Deep consolidation status`
     to `completed this handoff — <reason>`.

6. **Keep the boundary clean.** `session-handoff` now includes the
   consolidation gate and can escalate into `jc-consolidate-docs` when
   appropriate, but ordinary sessions remain lightweight. It still must not
   smuggle in review or git actions.
