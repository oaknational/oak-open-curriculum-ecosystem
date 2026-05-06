---
status: opener
authored: 2026-05-06
authored_by: Embered Melting Kiln (claude-code, claude-opus-4-7-1m, 4044d1)
thread: agentic-engineering-enhancements
target_session_shape: process napkin (rotate/graduate) then process pending-graduations register
context_budget_for_directives: <30% reserved (this work may touch directives, principles, governance docs)
---

# Next session opener — Napkin processing + pending-graduations drain

**Thread**: `agentic-engineering-enhancements`.

**Target**: process the two oversized cross-session-state surfaces in
sequence:

1. `.agent/memory/active/napkin.md` — currently 382 lines (HARD against
   limit 300, char-HARD too).
2. `.agent/memory/operational/pending-graduations.md` — currently
   2047 lines (HARD against limit 1400, critical at 2100).

The 2026-05-06 fitness-limit audit explicitly classified BOTH as
**function-overflow, not limit-undersizing**. The right action is to
*process* — graduate, archive, or close — until each file fits its
declared role. **Do not raise the limits to clear the HARD signals.**
That is the exact anti-pattern the user named in the directive
("NEVER limit knowledge retention to meet fitness function limits, that
is already a rule" — distilled.md preamble).

## Boundary — fitness pressure on destination files

Owner direction at this opener's authoring time: **process the napkin
without worrying about the limits in the destination files**.

That means: when graduating substance from `napkin.md` and
`pending-graduations.md` into permanent homes
(`distilled.md`, rules, ADRs, PDRs, governance docs, patterns),
do not let destination-file fitness limits gate the move. The
graduation moves substance toward its correct home; if the destination
becomes soft or HARD as a result, that is the diagnostic surface for a
follow-up calibration audit (mirroring the 2026-05-06 audit just
landed in commit `ca0794fc`), not a reason to truncate or hold back the
graduation.

The rule precedence is unambiguous: substance > destination fitness.
Every legitimate piece of understanding moves to its proper home, full
stop. The fitness signals on destination files become the next
function-vs-limit audit's input.

## Sequence

### Step 1 — Process the napkin

Open `.agent/memory/active/napkin.md`. For each session entry (today's
napkin carries five 2026-05-06 sessions: Briny Plumbing Fjord,
Cindery Charring Pyre, Umbral Cloaking Silhouette, Hidden Slipping
Moth, Embered Melting Kiln), apply the standard napkin → distilled →
permanent flow:

1. **Stable insights with named permanent home** — graduate to
   `distilled.md` or directly to a rule / governance doc / ADR / PDR
   if the substance is settled.
2. **Pattern-shaped observations** — extract to
   `.agent/memory/active/patterns/` if the pattern is at instance ≥2,
   or capture as a pattern candidate.
3. **Mistakes with already-existing rule** — fold into the rule's
   "why" section as a worked instance, then archive the napkin entry.
4. **Subjective / texture observations** — move to
   `.agent/experience/<date>-<slug>.md` if reflective surplus warrants;
   otherwise archive.
5. **Stable but no permanent home yet** — keep in distilled.md with
   the held-pending-X marker that the entry already carries (or add
   one); do not delete useful understanding without a home.

Then archive the entire current `napkin.md` to
`.agent/memory/active/archive/napkin-2026-05-06-<slot>.md` with the
top frontmatter and the rotation summary preserved, leaving a fresh
napkin shell with only the active-session header convention and the
archive pointer line. **The archive directory is excluded from
fitness validation** (verified in the audit:
`scripts/validate-practice-fitness.ts` line 26 lists `/archive/` in
`EXCLUDED_PATH_SEGMENTS`), so archiving is a clean release.

After Step 1, `napkin.md` should drop to its rotation-shell size
(roughly 20–30 lines: frontmatter + section heading + archive
pointer + first new entry of the next session).

### Step 2 — Process pending-graduations.md

Open `.agent/memory/operational/pending-graduations.md`. Walk every
entry by `status` (`pending`, `due`, `graduated`):

1. **`graduated` entries** — confirm cross-reference to the
   destination artefact resolves. If destination exists, archive the
   entry (move to a dated snapshot file under
   `.agent/memory/operational/archive/`) and remove from the live
   register.
2. **`due` entries** — execute the graduation. Trigger conditions
   already fired; the work is to land the substance in the named
   destination, then mark `graduated` with the cross-reference.
3. **`pending` entries** — re-evaluate the trigger condition against
   today's repo state. If the trigger has fired but status was not
   updated, move to `due` and execute. If the trigger genuinely has
   not fired, leave `pending`. If the trigger is vaporware-shaped (per
   distilled.md §Sequenced-Deferral Discipline — pointing at unmet
   `future/` plan promotion gates), re-route the entry: either land
   the substance now without the gating, or close as
   `not-graduating-here` with a rationale.

Same boundary applies: destination fitness limits do not gate the
graduation. If `distilled.md`, `principles.md`, or any other target
goes soft / HARD as a result, log for follow-up calibration audit;
do not truncate the graduation.

After Step 2, `pending-graduations.md` should drop substantially — the
2047-line file likely contains many `graduated` entries that have
been waiting for archive cleanup, plus `due` entries whose
substance is owed. If the file lands inside its limits (≤1400
lines), that is the right outcome. If genuine queue substance still
exceeds the limit after honest processing, surface for owner direction
on whether to enlarge the queue file, split by domain, or escalate
the queue draining cadence.

## Reviewer dispatch

After Steps 1 and 2, dispatch:

- `docs-adr-reviewer` — verify graduations landed substance in correct
  homes per the placement contract analogue (substance-kind → canonical
  home), no doctrine-as-prose in operational files, no recipe-as-prose
  in directives.
- `code-reviewer` — verify any rule, ADR, or PDR additions are
  syntactically valid markdown / yaml frontmatter, links resolve.

Framing: execution-legitimacy, not decision-validation. The decisions
to graduate were owner-directed; reviewer remit is *did the
graduations apply the substance correctly*.

## Validation

Per quality-gate cadence (one gate at a time):

1. `pnpm practice:fitness:informational` — expect `napkin.md` to drop
   from HARD to ok. `pending-graduations.md` HARD may persist if the
   genuine queue substance still exceeds 1400 lines — surface as
   diagnostic, do not raise limit.
2. `pnpm practice:vocabulary` — expect green.
3. `pnpm markdownlint:root` — expect clean.
4. `pnpm agent-tools:collaboration-state -- check` — expect ok.

## Companion items (deferred to other sessions, do not pull in)

- **`agent-collaboration.md` extraction question** — surfaced in
  commit `40f7da45`'s body. Today's calibration commit
  (`ca0794fc`) raised the limit to 240/320, accommodating the
  current size. The question of whether to also extract Communication
  Channels content to `agent-collaboration-channels.md` is
  independent and can land any future session.
- **`practice-bootstrap.md` recalibration question** — surfaced in
  commit `ca0794fc`'s body. Target 680, actual 317 — possibly
  miscalibrated, possibly aspirational. Owner direction needed.
- **`testing-patterns.md` stub** — surfaced in commit `ca0794fc`'s
  body. Either content owed or file should be removed.

## Run

`/jc-start-right-thorough` (this session may edit directives via
graduation moves; the standing 30%-context rule applies). Apply the
napkin skill at session-open. The boundary rule for this session is:
**substance > destination fitness**. Land legitimate graduations
without truncating; the fitness signals that result are the next
audit's input, not this session's brake.
