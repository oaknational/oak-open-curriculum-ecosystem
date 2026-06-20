---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested processing through `oak-consolidate-docs`.
  The active file carries the conservation role, graduation pointers, and held
  validation entries. Falsifiability: if future napkin rotations add high-signal
  learning that has no stable permanent home, preserve it first and revise the
  envelope by substance rather than trimming the lesson.
---

# Distilled Cross-Session Lessons

Refined cross-session lessons, conserved between napkin rotation and graduation to
a permanent home. Each entry earns its place by being specific, actionable,
non-obvious, and terse.

Entries below are staged cross-session lessons whose substance is conserved but
whose final home is not yet fixed (a graduation candidate surfaced to the owner, or
a single-instance technique awaiting a second instance). New napkin rotations append
below.

## A directive that conflicts with an Accepted ADR → directive supersedes; amend the ADR

When an owner directive (e.g. "increase strictness — convert every throw") conflicts
with an **Accepted** ADR (ADR-088 §"Keep Exceptions For" keeps exhaustiveness/invariant
throws), the resolution is neither to paper over the conflict nor to over-dramatise it
as a fork needing a big decision. The owner ruling (2026-06-19, no-throw migration):
*"I author the ADRs; increase strictness, update the ADRs to match."* So: the directive
supersedes, and the **ADR is amended to match** in the same arc — the ADR stays the
architectural source of truth, never left silently contradicted by live practice.
**Graduation candidate** (surfaced to owner): this is portable directive-vs-ADR
precedence governance — candidate home is a `development-practice.md` clause or a PDR
on decision-record authority. Stable, owner-stated; held here pending the owner's
shape-call on its home (the substance is about the owner's own authority over ADRs).
Siblings: repo-continuity invariant "owner direction beats plan"; PDR-091
(precedence-is-not-approval).

## Parsing interleaved/parallel tool output: key by a stable prefix, cross-check sums

When parsing stateful logs from a parallel/interleaved runner (e.g. `turbo` running
tasks concurrently, with CR line-endings), "nearest-header" file attribution is unsafe:
interleaving and CR endings can misattribute lines, producing phantom aggregates (a
"307 warnings in one file" that was really a misparse — the workspace's true total was
77). Cure: key the stateful parse by the **stable workspace/task prefix** the runner
emits, and **cross-check** per-file sums against the gate's authoritative per-workspace
totals as an independent checksum. Single-instance debugging tactic (2026-06-19, Siren
mends Rudder); staged for a second instance to confirm the general shape before
graduating to a pattern. Sibling: [`tool-output-framing-bias`](patterns/tool-output-framing-bias.md).

## "Education = pupils" is a contaminating prior; this repo's subjects are teachers, the ecosystem, and our teams

Across the vision/strategy work, pupils were repeatedly elevated to a strategy *component* (an
amplifier "three levels (pupil ← teacher ← our teams)", a vision "for pupils" boundary) despite the
owner's standing "this isn't about pupils." The owner named the mechanism: the semantic prior
education=students overrides explicit direction — fluency-is-a-warning at its deepest, recurring even
in a file written minutes earlier. **Guard:** this repo's subjects are teachers (the app), the
ecosystem (tools/framework), and our own teams (the transformation). Pupils legitimately appear ONLY in
(a) Oak's mission quoted verbatim (Oak's end, reached *through* teachers) and (b) external compliance
gates where law forces naming child-access (Children's Code, safeguarding, the "nothing is aimed at
pupils" audience boundary). Everywhere else treat "pupil" / "learner" / "student" as a tripwire to
delete or reframe to the teacher. Source: 2026-06-20 (Kiln guards Patina), owner correction.
Graduation candidate: a vision/strategy authoring guard (home TBD — possibly `editorial-tone.md` or a
strategy-authoring note). Sibling: [[passive-guidance-loses-to-artefact-gravity]].
