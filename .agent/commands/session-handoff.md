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

   The `<what prevented>` field MUST satisfy the **deferral-honesty
   discipline** per
   [PDR-026 §Deferral-honesty discipline](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline)
   (2026-04-22 Session 6 amendment): a named constraint (clock,
   cost, dependency, owner veto) or a named priority trade-off,
   plus evidence establishing it, plus falsifiability (how a
   future agent could check whether the constraint or trade-off
   held). Convenience phrasings — *"budget consumed"*, *"out of
   scope"*, *"for later"*, *"next session"*, *"ran out of time"*
   — are not acceptable; replace with the underlying constraint
   or trade-off and the falsifiability check.

   If the session was a declared exception (deep consolidation,
   Core-trinity refinement, or root-cause investigation), record the
   exception's shape-specific artefact (consolidation commit,
   trinity diff, investigation report).

   An unlanded case MUST propagate to step 2's `Next safe step` so
   the commitment persists across the session boundary.

2. **Refresh the canonical continuity contract.** Update
   `.agent/memory/operational/repo-continuity.md` using its documented field set:

   - `Active threads` (the per-thread summary table)
   - `Branch-primary lane state` (pointer to the branch-primary
     thread's next-session record)
   - `Current session focus` (if distinct from the branch-primary lane)
   - `Repo-wide invariants / non-goals`
   - `Next safe step`
   - `Deep consolidation status`

   Keep it compact and operational. Active plans remain authoritative for
   scope, sequencing, acceptance criteria, and validation.

   **Role-boundary check before writing:** classify every proposed addition
   before it enters `repo-continuity.md`.

   - Repo-level active state -> `repo-continuity.md`.
   - Per-thread identity, landing target, or lane state ->
     `threads/<slug>.next-session.md`.
   - Short-lived tactical coordination -> `tracks/*.md`.
   - Continuity strategy, rules, or process ->
     `.agent/directives/continuity-practice.md`.
   - Settled architecture or Practice governance -> ADR / PDR / rule /
     permanent doc.
   - Historical closeout prose -> archive or git history, unless it still
     changes the next safe step.

   If content does not answer "what is live right now?", do not place it in
   `repo-continuity.md`.

   *Workstream surface retired 2026-04-21 Session 5*: the
   `Active workstreams` and `Branch-primary workstream brief`
   fields that were previously listed here have been replaced by
   the thread-record pointers above. Lane state now folds into
   `.agent/memory/operational/threads/<slug>.next-session.md`.

3. **Refresh the relevant thread's next-session record (lane state
   included).** Update
   `.agent/memory/operational/threads/<slug>.next-session.md` for
   any thread that moved this session. The thread record carries
   identity + next-session landing + lane state. Fields (lane state
   section): `Owning plan(s)`, `Current objective`, `Current state`,
   `Blockers / low-confidence areas`, `Next safe step`, `Active
   track links`, `Promotion watchlist`.

4. **Resolve, promote, or delete any tactical track cards.** Cards in
   `.agent/memory/operational/tracks/` are short-horizon. At session close, each card is
   either: resolved (deleted), promoted (signal routed into the
   owning thread's next-session record's lane-state promotion
   watchlist or into the napkin), or deleted if no longer relevant.

5. **Sync the authoritative next-action surfaces.** Update any active plan
   whose status, preconditions, or immediate next safe step changed this
   session. Do not duplicate plan authority; clarify it.

6. **Capture session-scoped reflection and candidates.** This
   step has three sub-steps; all session-scoped:

   **6a. Capture surprises and corrections.** Record any new
   surprises, corrections, or expectation failures from this
   session in `.agent/memory/active/napkin.md`. Use the structured
   surprise format from the napkin skill.

   **Auxiliary input: plugin-managed capture buffers.** The remember
   plugin maintains `.remember/now.md`, `.remember/today-*.md`, and
   sibling buffers as a separate ephemeral capture surface. Scan
   them at session close for entries that would change next-session
   behaviour; mirror any such entry into `napkin.md` using the
   structured surprise format. Do not rotate, archive, or delete
   `.remember/` files — lifecycle is owned by the plugin. This
   surface is a read-source for extraction, not a surface we
   maintain.

   **6b. Surface ADR/PDR candidates.** Ask explicitly at every
   session close: *"Has this session surfaced an architectural
   decision worth an ADR? A Practice-governance decision worth a
   PDR? An amendment to an existing ADR or PDR?"* If yes, add the
   candidate to the pending-graduations register at
   `.agent/memory/operational/repo-continuity.md § Deep
   consolidation status` per its schema (`captured-date`,
   `source-surface`, `graduation-target`, `trigger-condition`,
   `status`), OR as a distinct napkin entry with a `candidate:`
   tag that the next register refresh promotes. This is capture
   only; graduation happens at `consolidate-docs` step 7a. If
   nothing qualifies, say so and move on — *"nothing qualifies"*
   is a valid answer reached by asking, not by skipping.

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

   **6d. Sweep platform-specific entry points for drift.** Open
   each of the platform-specific entry-point files at the repo root
   — `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, and any analogous
   platform entry point present in the repo — plus any host-specific
   adapter entry-point (`.codex/AGENTS.md`, etc.). Each MUST contain
   ONLY a heading + a one-line pointer to
   [`.agent/directives/AGENT.md`](../directives/AGENT.md) (or the
   host's canonical equivalent). Anything else is **drift**: an
   instruction, fact, preference, or operational note that an agent
   or user added directly to the entry point instead of routing it
   through the canonical surfaces. Entry-point drift is particularly
   insidious because every platform reads only its own entry point
   first; a fact that lives only in `AGENTS.md` is invisible to
   Claude, and vice versa.

   For every piece of drift found, apply the
   [ephemeral-to-permanent-homing methodology](ephemeral-to-permanent-homing.md):
   classify the substance shape, match to a destination, surface
   non-trivial moves to the owner, move the content, then strip the
   entry point back to its canonical pointer shape. Per the user's
   standing direction codified in that partial: *all content must be
   moved to permanent homes or, if not useful, removed* — silent
   deletion without homing is not the default.

   The sweep is session-scoped because entry-point drift accrues
   incrementally during sessions (a "quick note added to AGENTS.md"
   is a recurring failure mode). Catching it at session close keeps
   the canonical surfaces authoritative and prevents the slower
   accumulation that `consolidate-docs` would otherwise discover at
   thread-scoped depth.

7. **Refresh cross-session coordination surfaces** (session-scoped
   touch on cross-session artefacts the session affected).

   **7a. Refresh the pending-graduations register.** Open
   `.agent/memory/operational/repo-continuity.md § Deep
   consolidation status` and, for each item whose state this
   session's work affects:

   - If a trigger condition fired this session (a second instance
     observed; a drafting slot reached; a consumption point hit):
     move the item from `pending` → `due`, or from `due` →
     `graduated` with a cross-reference to the destination
     artefact.
   - If a new candidate was captured at step 6b, ensure it now
     appears in the register per the schema (`captured-date`,
     `source-surface`, `graduation-target`, `trigger-condition`,
     `status`). Napkin `candidate:` entries from step 6b that
     were not directly written to the register surface here.
   - Do *not* review the whole register for stale items — that
     is consolidation work (`consolidate-docs` step 7). The
     session-scoped action here is *this session touched these
     items; update them*.

   **7b. Update thread-record identity rows AND the active-agent
   register column.** Two edits, both required:

   1. **Thread next-session record** — for every thread this
      session touched
      (`.agent/memory/operational/threads/<slug>.next-session.md`):
      set `last_session` on the matching identity row to today's
      date per the additive-identity rule at
      [`threads/README.md`](../memory/operational/threads/README.md)
      and [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
      If you are a new identity on the thread (different platform /
      model / `agent_name`), add a new row instead of updating.
   2. **Active-agent register column** — refresh the `Active
      identities` column for each touched thread in
      [`repo-continuity.md § Active threads`](../memory/operational/repo-continuity.md#active-threads).
      Summary form: `platform / model / agent_name / role /
      last_session` per identity, comma-separated when multiple
      identities are currently active on the thread. That column
      IS the right-now register per PDR-029 (as amended
      2026-04-21); it must reflect the thread record or the
      audit in `/jc-consolidate-docs` step 7c will flag a
      mismatch.

   This is the session-close counterpart to the session-open
   registration step in
   [`threads/README.md § Starting a session on a thread`](../memory/operational/threads/README.md#starting-a-session-on-a-thread)
   — together with the session-open rule at
   [`.agent/rules/register-identity-on-thread-join.md`](../rules/register-identity-on-thread-join.md)
   they form the Family-A Class-A.2 rule layer per PDR-029.

   **7c. Verify every touched thread is updated — hard gate.** <a id="hard-gate"></a>
   This step is a **documentation-first, platform-agnostic gate**
   per the 2026-04-21 amendment to PDR-029 (active tripwires are
   ritual-moment markdown steps that name authoritative sources,
   not code). Any agent on any platform can perform it.

   **Ordering assertion**: step 7b MUST have run in this session
   before step 7c. 7b refreshes the per-thread next-session record
   AND the `Active identities` column; 7c validates those
   refreshes against the thread's next-session file. Running 7c
   without 7b reads stale data and self-validates — the exact
   passive-guidance failure mode this gate counters. If 7b has not
   run this session, run it first, then 7c.

   1. Open
      [`.agent/memory/operational/repo-continuity.md § Active threads`](../memory/operational/repo-continuity.md#active-threads).
      That table is the structural source — enumerate active
      threads from it, not from memory. Self-reporting is not
      sufficient (the very failure mode this gate exists to
      counter per the
      [`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
      pattern).
   2. For each thread the session touched (by edit, read-and-
      reference, or commit), open its next-session record at the
      `Next-session record` path listed in the Active threads row
      (canonical `threads/<slug>.next-session.md`).
   3. Confirm the `Participating agent identities` row matching
      your platform / model / `agent_name` has `last_session`
      equal to today's date (per the additive-identity rule in
      [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)).
      If you are a new identity on the thread, add a new row.
   4. Fix any missing or outdated `last_session` values. Do not
      proceed to step 8 until every touched thread's identity row
      shows today's date. "Do not proceed" is the hard-gate force
      — same authority as a script `exit(1)`, no platform
      coupling.

   The enforcement comes from **the ritual itself**, not from code:
   the agent running `/session-handoff` reads this step, follows
   the enumeration, and cannot honestly mark handoff complete
   while any touched thread remains un-updated.

8. **Close collaboration lifecycle surfaces.** This is the session-close
   counterpart to
   [`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md).
   It keeps WS1/WS3A state clean without waiting for a stale-claim
   consolidation pass.

   1. Read `.agent/state/collaboration/active-claims.json` and find
      claims matching your PDR-027 identity and any thread touched this
      session.
   2. For every matching claim, copy the full claim entry into
      `.agent/state/collaboration/closed-claims.archive.json`, add
      `archived_at`, and add `closure.kind: "explicit"`,
      `closure.closed_at`, `closure.closed_by`, `closure.summary`, and
      at least one `closure.evidence[]` reference. Evidence can cite the
      shared communication log, the touched thread record, a plan, a
      command output, or another durable artefact that explains the
      closure.
   3. Remove the closed claim from `active-claims.json`. If no matching
      active claim exists, state that explicitly in the handoff output so
      "no claim to close" is observable.
   4. Scan `.agent/state/collaboration/conversations/*.json` for open
      decision threads on touched threads or entries where your agent
      participated. If this session changed the decision state, append the
      appropriate `message`, `claim_update`, `decision`, `resolution`,
      `evidence`, sidebar, `joint_decision`, or
      `joint_decision_acknowledgement` entry. Close, resolve,
      acknowledge, evidence, or explicitly hand off obligations your
      session created. If no relevant open decision-thread handoff is
      needed, state that explicitly.
   5. Scan `.agent/state/collaboration/escalations/*.json` for open
      escalations on touched threads or conversations where your agent
      participated. If the owner resolved an escalation this session,
      write the durable result back to the conversation first, then close
      the escalation by referencing that conversation entry. If the
      escalation remains open, carry the owner-facing next action into the
      thread record instead of duplicating the whole case file.
   6. For sidebars, expired `expires_at` values are stale-reporting
      signals only. They do not auto-resolve; append
      `sidebar_resolution` with `outcome: "expired"` only when an agent
      deliberately closes the sidebar as expired.
   7. For joint decisions, unacknowledged proposals are not settled
      commitments. Recorder/actor completion requires evidence; role
      handoff requires `handoff_to` plus evidence or a durable
      `next_action` reference.

9. **Run the consolidation gate.** Check the trigger checklist in
   `.agent/commands/consolidate-docs.md`.

   - If no trigger fires, set `Deep consolidation status` to
     `not due — <reason>` in `.agent/memory/operational/repo-continuity.md` and stop here.
   - If one or more triggers fire, set `Deep consolidation status` to
     `due — <reason>` and continue to step 10.

10. **Escalate only when the deeper loop is clearly warranted.**

    - If the triggered work is already well-bounded and belongs to this
      closeout, continue immediately into `jc-consolidate-docs`.
    - If deep consolidation is due but not well-bounded for this closeout,
      stop after marking `due — <reason>` so the next session can pick it up
      deliberately.
    - If `jc-consolidate-docs` runs now, refresh `Deep consolidation status`
      to `completed this handoff — <reason>`.

11. **Keep the boundary clean.** `session-handoff` includes the consolidation
    gate and can escalate into `jc-consolidate-docs` when appropriate, but
    ordinary sessions remain lightweight. It does not smuggle in review or git
    actions.
