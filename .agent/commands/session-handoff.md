# Session Handoff

**Scope**: **SESSION-SCOPED.** This workflow runs at the end of a
single session and acts on session-scoped artefacts — the session's
surprises, the session's subjective experience, ADR/PDR candidates
surfaced during the session, the thread record the session touched.
Cross-session convergence (pattern extraction, doctrine graduation,
napkin rotation, fitness management) belongs to
[`consolidate-docs`](consolidate-docs.md), which is thread-scoped.

**Governance**: This command operationalises
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
(host architecture) and
[PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(portable Practice governance). These name the learning path for
surprise and correction as `capture → distil → graduate → enforce`,
with the napkin as the capture surface, `distilled.md` as the
refinement surface, `consolidate-docs` as the graduation convergence
point, and ADRs / PDRs / rules / permanent docs as the enforcement
surface. Session handoff is the **capture edge** of this pipeline —
it produces the surface `consolidate-docs` later distils.

Lightweight end-of-session continuity update with a conditional
consolidation gate.

Use this command for ordinary session closeout. It replaces `wrap-up`.

Do **not** treat this as a full closeout ritual. Unless the user explicitly
asks for more, this command must not trigger:

- full review
- commit or push
- deep convergence by default

## Steps

1. **Record the landed outcome (or unlanded case).** Report against
   the session's opening landing target per
   [PDR-026](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md).
   If the target landed:

   > Landed: `<outcome>` — `<evidence link>` (commit SHA, test,
   > artefact path).

   If the target did not land:

   > `<what was attempted>` — `<what prevented>` — `<what next
   > session re-attempts>`.

   If the session was a declared exception (deep consolidation,
   Core-trinity refinement, or root-cause investigation), record the
   exception's shape-specific artefact (consolidation commit,
   trinity diff, investigation report).

   An unlanded case MUST propagate to step 2's `Next safe step` so
   the commitment persists across the session boundary.

2. **Refresh the canonical continuity contract.** Update
   `.agent/memory/operational/repo-continuity.md` using its documented field set:

   - `Active workstreams`
   - `Branch-primary workstream brief`
   - `Current session focus` (if distinct from the branch-primary lane)
   - `Repo-wide invariants / non-goals`
   - `Next safe step`
   - `Deep consolidation status`

   Keep it compact and operational. Active plans remain authoritative for
   scope, sequencing, acceptance criteria, and validation.

3. **Refresh the relevant workstream brief.** Update
   `.agent/memory/operational/workstreams/<slug>.md` for any lane that moved this session.
   Required fields: `Owning plan(s)`, `Current objective`, `Current state`,
   `Blockers / low-confidence areas`, `Next safe step`, `Active track links`,
   `Promotion watchlist`.

4. **Resolve, promote, or delete any tactical track cards.** Cards in
   `.agent/memory/operational/tracks/` are short-horizon. At session close, each card is
   either: resolved (deleted), promoted (signal routed into the workstream
   brief's promotion watchlist or napkin), or deleted if no longer relevant.

5. **Sync the authoritative next-action surfaces.** Update any active plan
   whose status, preconditions, or immediate next safe step changed this
   session. Do not duplicate plan authority; clarify it.

6. **Capture session-scoped reflection and candidates.** This
   step has three sub-steps; all session-scoped:

   **6a. Capture surprises and corrections.** Record any new
   surprises, corrections, or expectation failures from this
   session in `.agent/memory/active/napkin.md`. Use the structured
   surprise format from the napkin skill.

   **6b. Surface ADR/PDR candidates.** Ask explicitly at every
   session close: *"Has this session surfaced an architectural
   decision worth an ADR? A Practice-governance decision worth a
   PDR? An amendment to an existing ADR or PDR?"* If yes, note the
   candidate (one-line summary + link to the session-handoff
   context) in the pending-graduations register at
   `.agent/memory/operational/repo-continuity.md § Deep
   consolidation status`, OR as a distinct napkin entry with a
   `candidate:` tag. This is capture only; graduation happens at
   `consolidate-docs` step 7a. If nothing qualifies, say so and
   move on — *"nothing qualifies"* is a valid answer reached by
   asking, not by skipping.

   **6c. Record subjective experience (optional).** If the session
   produced a reflective surplus, capture it in
   `.agent/experience/<date>-<slug>.md` per the
   [`.agent/experience/` convention](../experience/README.md).

   **The experience file is for *subjective experience* — what the
   work was like, not what was done.** Texture, shifts, surprises,
   what went differently from expectation, what emerged that was
   not planned. Applied technical patterns and settled doctrine
   belong elsewhere: distilled entries in `distilled.md`, pattern
   candidates in `.agent/memory/active/patterns/`, PDR/ADR
   candidates surfaced under step 6b above, permanent docs in
   `docs/` or workspace READMEs. If a session produces both
   subjective reflection and technical insight, split them — write
   a short experience file for the texture, and record the
   technical insight in its proper durable home.

   Subjective experience belongs to a session; this step is the
   session-scoped capture edge. Cross-session audit of accumulated
   experience files lives at `consolidate-docs` step 4, which exists
   to protect the subjective register, recover any stranded
   technical content, and surface emergent insight across
   experiences.

7. **Run the consolidation gate.** Check the trigger checklist in
   `.agent/commands/consolidate-docs.md`.

   - If no trigger fires, set `Deep consolidation status` to
     `not due — <reason>` in `.agent/memory/operational/repo-continuity.md` and stop here.
   - If one or more triggers fire, set `Deep consolidation status` to
     `due — <reason>` and continue to step 8.

8. **Escalate only when the deeper loop is clearly warranted.**

   - If the triggered work is already well-bounded and belongs to this
     closeout, continue immediately into `jc-consolidate-docs`.
   - If deep consolidation is due but not well-bounded for this closeout,
     stop after marking `due — <reason>` so the next session can pick it up
     deliberately.
   - If `jc-consolidate-docs` runs now, refresh `Deep consolidation status`
     to `completed this handoff — <reason>`.

9. **Keep the boundary clean.** `session-handoff` includes the consolidation
   gate and can escalate into `jc-consolidate-docs` when appropriate, but
   ordinary sessions remain lightweight. It does not smuggle in review or git
   actions.
