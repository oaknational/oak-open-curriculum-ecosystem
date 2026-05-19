---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at [`napkin-2026-05-17.md`][archive-pass].
Prior rotations are [`napkin-2026-05-14.md`][previous-pass] and
[`napkin-2026-05-13.md`][previous-previous-pass]. The 2026-05-17 rotation was
the output of Solar Orbiting Asteroid's gate-green cascade session plus
consolidation pass on Luminous Waxing Twilight's 2026-05-15 entries.
Behaviour-changing entries were merged into [`distilled.md`](distilled.md)
under "Recently Distilled — 2026-05-17"; the full session-by-session capture
lives in the archived napkin.

[archive-pass]: archive/napkin-2026-05-17.md
[previous-pass]: archive/napkin-2026-05-14.md
[previous-previous-pass]: archive/napkin-2026-05-13.md

## 2026-05-19 — Shaded Passing Candle (claude / opus-4.7-1m / `ab4290`)

### Surprise: portable reference doc arrived without an integration plan slot

Inbound `.agent/reference/comms-watch-mechanism.md` landed in `reference/`
ready to analyse but with no plan slot, no owning workstream, and no
trigger to integrate. The reasonable next move was not "draft an integration
plan" — it was a three-question grounding pass: where are we, where were we
going, what does the reference add. The two grounding reads reframed
integration entirely: substrate is mostly present already (event-file dir,
schema, seen-events, `comms watch` CLI subcommand exists); deltas are
watcher-liveness primitive + full-tuple identity filter + `/loop` experiment.

Falsifiable: future portable refs arriving into `reference/` with no owning
plan should trigger the three-question grounding pass before drafting scope.
Skipping it is guesswork dressed as readiness.

### Surprise: lens applied to paused queue dissolved most of it

User direction to apply the broken/accelerator lens to all sequenced work
for graph priority dissolved most of the paused token-remediation tail.
P8 TUI, cost-of-collab P6/P7, hardening waves 2–6 are neither broken nor
graph-accelerators. The honest answer was to surface the program advancement
rule itself as superseded for graph priority. The thread record was written
before the lens existed and was baking in a sequence that doesn't survive it.

Falsifiable: when a priority shift is stated, the program advancement rule
in the active thread record is a primary candidate for re-evaluation, not a
load-bearing constraint to honour blindly.

### Working pattern: questions before edits at decision-completeness boundaries

Asking three concrete decisions (singleton-lane scope; identity filter
placement; arch-session ratification) via structured options *before* editing
the plan files closed three gates in one round. Each option had a default
leaning that kept owner cost low. The alternative — drafting plans first
and asking for sign-off after — would have produced cascade rework.

Confirmation: owner explicitly approved the question-first shape this session
("ask me the questions that need answering for decision completeness, once
we have all the information required, continue").

candidate: pattern — *portable-reference-arrives-without-plan-slot* — the
three-question grounding pass (substrate / thread / delta) before drafting
integration. Surfaced once this session; promote on second instance.

candidate: amendment to existing ADR (or new ADR) ratifying the
leaf-to-root reachability invariant for `.agent/plans/` plus the obligated
CI validator. Captured in `pending-graduations.md` 2026-05-19.
