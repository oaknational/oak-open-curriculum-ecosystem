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

1. **Refresh the canonical continuity contract.** Update
   `.agent/memory/operational/repo-continuity.md` using its documented field set:

   - `Active workstreams`
   - `Branch-primary workstream brief`
   - `Current session focus` (if distinct from the branch-primary lane)
   - `Repo-wide invariants / non-goals`
   - `Next safe step`
   - `Deep consolidation status`

   Keep it compact and operational. Active plans remain authoritative for
   scope, sequencing, acceptance criteria, and validation.

2. **Refresh the relevant workstream brief.** Update
   `.agent/memory/operational/workstreams/<slug>.md` for any lane that moved this session.
   Required fields: `Owning plan(s)`, `Current objective`, `Current state`,
   `Blockers / low-confidence areas`, `Next safe step`, `Active track links`,
   `Promotion watchlist`.

3. **Resolve, promote, or delete any tactical track cards.** Cards in
   `.agent/memory/operational/tracks/` are short-horizon. At session close, each card is
   either: resolved (deleted), promoted (signal routed into the workstream
   brief's promotion watchlist or napkin), or deleted if no longer relevant.

4. **Sync the authoritative next-action surfaces.** Update any active plan
   whose status, preconditions, or immediate next safe step changed this
   session. Do not duplicate plan authority; clarify it.

5. **Capture surprises and corrections.** Record any new surprises,
   corrections, or expectation failures from this session in
   `.agent/memory/active/napkin.md`. Use the structured surprise format from the
   napkin skill.

6. **Run the consolidation gate.** Check the trigger checklist in
   `.agent/commands/consolidate-docs.md`.

   - If no trigger fires, set `Deep consolidation status` to
     `not due — <reason>` in `.agent/memory/operational/repo-continuity.md` and stop here.
   - If one or more triggers fire, set `Deep consolidation status` to
     `due — <reason>` and continue to step 7.

7. **Escalate only when the deeper loop is clearly warranted.**

   - If the triggered work is already well-bounded and belongs to this
     closeout, continue immediately into `jc-consolidate-docs`.
   - If deep consolidation is due but not well-bounded for this closeout,
     stop after marking `due — <reason>` so the next session can pick it up
     deliberately.
   - If `jc-consolidate-docs` runs now, refresh `Deep consolidation status`
     to `completed this handoff — <reason>`.

8. **Keep the boundary clean.** `session-handoff` includes the consolidation
   gate and can escalate into `jc-consolidate-docs` when appropriate, but
   ordinary sessions remain lightweight. It does not smuggle in review or git
   actions.
