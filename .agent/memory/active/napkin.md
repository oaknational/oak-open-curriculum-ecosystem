---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

## 2026-05-04 (Fronded Climbing Thicket, `8da3d3`) — Three-plan arc descope + unification

**Surprise 1 — "atomic, NOT parallelisable" misread as "single commit"**.
Plan 2's `Atomic, NOT parallelisable` framing got conflated with
"the whole rename in one commit". The real meaning was *no
producer-first sequencing leaving RED consumer tests across
commits* — clean TDD cycles each landing green were always
permissible per `tdd-as-design.md`. Owner correction:
*you are making things up and then treating them as blockers*.
Cure: re-ground in `tdd-as-design.md`'s atomic-landing-per-cycle
definition (test + product code in same commit) before treating
plan-body imperatives as universal constraints.

**Surprise 2 — foreign-stage absorption recurrence**.
Moonlit's `git commit` (without `--only`) on a shared `.git/`
index swept Fronded's staged files into commit `8fa339f4` —
exact instance of `stage-by-explicit-pathspec.md`'s named
failure mode. Substance landed but under a misleading commit
subject. Cure for this branch's remaining commits is codified
in the unified plan §Discipline: every `git commit` MUST use
`-- <pathspec>` filter; every commit goes through commit-skill
protocol.

**Surprise 3 — verification overlap as coordination cost**.
Two parallel plans (mine + Moonlit's) each owned dev-boot, MCP
tool exercise, divergence analysis. Coordination on the overlap
introduced more friction than the work itself. Owner direction:
*turn the two plans into one simple, linear, comprehensive,
straightforward plan that actually makes sense*. Cure: when
two plans share verification scope, unify; do not coordinate
duplicate work across sessions.

**Surprise 4 — first-question discipline applied to scope, not
just shape**. Owner asked *what is the intent of this session,
what value is it trying to create, what complexity can we
remove?* — the meta-question that exposed plan 2 (SENTRY_MODE
rename) as wasted critical-path work. Plan 2 was real future
work but not a merge prerequisite; the dev server boots fine
with legacy `SENTRY_MODE`. Owner identified an unnamed
foundational tension and directed pause. Cure: at every
plan-execution boundary, re-ask *is this on the actual
critical path, or is it adjacent work I'm treating as
critical?*

**ADR/PDR candidates** (not yet captured to register):

- The "atomic single-commit vs atomic-landing-per-cycle"
  ambiguity in plan-body framings is a documentation pattern
  worth naming; could be a PDR or a rule extension to
  `testing-strategy.md` distinguishing the two.
- The "unnamed foundational tension" diagnostic on plan 2 is
  itself a meta-pattern: when a plan keeps causing issues
  during execution, the right move is *pause + name the
  tension* rather than push through. Could graduate to a PDR
  on plan-quality lifecycle.

**Out of scope this session**: capturing the above to
`pending-graduations.md` register — owner directed brief
session-handoff, not deep consolidation.

## 2026-05-04 (Ferny Spreading Petal, `d0d13f`) — Curation-first napkin rotation

Owner directed napkin rotation mid-session after the PDR-046
graduation pass surfaced new napkin critical pressure (517 lines).
Owner priority: *prioritise knowledge curation over meeting
numerical standards.* Per the just-landed PDR-046 §Move 3 (a
layer's residual fitness pressure is addressed by graduating
substance upward, not by compression), this rotation routes
substance to durable homes rather than compressing the napkin
to fit budget.

Previous active napkin archived to
[`archive/napkin-2026-05-04-evening.md`](archive/napkin-2026-05-04-evening.md)
in full — no compression, no opportunistic trimming. The archive
carries: Fronded Flowering Thicket's three Layer-1/Layer-2
processing entries (napkin rotation under owner-relaxed fitness;
the layered-processing principle owner-stated mid-pass; Layer-2
autonomous track complete) plus PDR-045 graduation entry; Ferny
Spreading Petal's Layer-2 second pass entry covering PDR-046
drafting; Vining Spreading Seed / Briny Sailing Lagoon's
doctrine-enforcement-quick-wins WS3/WS4/WS6 landing including
worked-instance lessons (peer-staged renames bleed via git add;
pre-commit hooks scan whole working tree; trip-list-defines-itself
paradox; hex-class regexes match decimals; CLAUDE_ENV_FILE empty
in subshells; agent-tools:collaboration-state flag conventions);
Fronded's "Open observations from this consolidation pass"; the
WS3/WS4/WS6 audit findings; the self-violation discovery on hook
spirit > hook implementation; and both end-of-session owner
corrections (session-handoff §6d softening; hook tightening
direction).

High-signal entries graduated this rotation:

- `PDR-046 § Notes` — *Layer-1 pre-processing made Layer-2
  graduation cheap* worked instance added as the second Notes
  bullet, sharpening the existing self-application observation.
  The capture surface that became PDR-046's source preserved the
  failure-mode triad and two of three cures verbatim across the
  session boundary; Layer-2 drafting was largely a structural
  lift. The methodology validates itself in miniature.
- `pending-graduations.md` — three new candidate entries opened:
  (a) *the PDR shape forces the rationale to surface that the
  capture surface did not have to* (PDR-014 amendment or new
  pattern; trigger: second instance); (b) *cross-Core PDR↔PDR
  connective tissue is load-bearing, not decorative* (PDR-007
  amendment or decision-records README extension; trigger: second
  instance); (c) *host-local consolidate-docs extension to point
  at PDR-046 as the orchestration rule* (host-local; trigger:
  PDR-046 lands; status: due).

The Vining/Briny worked-instance lessons preserved in the
archive are not re-routed to pending-graduations.md this pass —
the substance is preserved by the archive itself plus the
existing graduation entries that captured the same arc, and
adding six single-instance candidates to the register would
partially undo the same-pass remediation prune. Future agents
encountering second instances of any Vining/Briny lesson can
reference the archive directly.

### Quality-gate state at rotation (continuation of in-flight pass)

- `pending-graduations.md` after this rotation's three additive
  entries: ~1180 lines / ~73000 chars (estimate; was 1140 / 71206
  at remediation close, +~40 lines from three new candidates).
  Remains in critical zone. Owner has held fitness pressure on
  this surface relaxed for the full layered-processing arc;
  per PDR-046 §Move 3 the residual is structural feedback for
  Layer 3 (the file's own size targets / split strategy is the
  next pass's subject), not in-process material to compress.
- `napkin.md` (this fresh file): well under target — by
  construction, since the rotation just happened.
- `principles.md`, `distilled.md`: unchanged from session-open;
  pre-existing hard pressure, owner-relaxed throughout the arc.

### Layered-processing methodology in continued application

This rotation IS Layer-1 work (capture surface → archive +
distillation/graduation) underway during the Layer-2 second pass
(PDR-046 drafting → Practice Core landing). Per PDR-046 §Move 1,
processing one layer does not interrupt to remediate higher
layers; per Move 2, in-process form-keeping on the active layer
is suspended; per Move 3, residual pressure at rest is addressed
by graduating substance upward. The rotation honours all three
Moves: the previous napkin's substance graduated upward (to
PDR-046 Notes + three pending-graduations entries + the full
archive); the fresh napkin starts at natural size by virtue of
the rotation, not compression; the Layer-2 second pass continues
toward PDR-046 commit + PDR-047/PDR-048 drafting.
