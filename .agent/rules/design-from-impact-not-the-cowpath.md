---
classification: core
description: At design, shaping, or constraint-writing moments, state the impact first and design from it — never build inside or preserve the existing system's shape because it exists (the cowpath). Discriminate artifact gravity (negative) from revealed usage (desire path, positive at the right altitude); treat existing artefacts as malleable design surface; an inherited separation may be the bug; attribute system properties to the system, not the owner.
---

# Design From Impact, Not the Cowpath

Operationalises [`principles.md` §Decision Lenses](../directives/principles.md#decision-lenses--order-of-resolution)
lens 4 (*would it be simpler if the system changed?*) and
[§Architectural Excellence Over Expediency](../directives/principles.md#architectural-excellence-over-expediency)
at design and shaping moments. Owner-named 2026-06-28 ("cowpath",
handled "similar to how we handle tombstones") with the
cowpath/desire-path discriminator as the owner's refinement; the
design-agency and inherited-separation faces were owner corrections
2026-06-04 and 2026-06-28.

At any design, shaping, or constraint-writing moment: state the impact
first and design from it. Never build inside, around, or in order to
preserve the existing system's shape *because it exists*. Climb to the
substrate — the instance in front of you (this function, this binding,
this bug) is one expression of a foundational system; design THAT from
impact and long-term excellence, and the specific flows fall out as
typed instances.

**A cowpath** is the named anti-pattern: paving the route the existing
structure dictates — building machinery inside the current shape,
"synthesising the existing two", carefully preserving an inherited
boundary — instead of stepping back and designing from the impact. It
is a compromise on architectural excellence, which we do not make.

## The Discriminator — Cowpath vs Desire Path

Do not let "cowpath" become a thought-terminating cliché that flags all
responsiveness-to-the-existing as bad — that paralyses good design. Ask
what you are responding to:

- **Existing STRUCTURE (artifact gravity) → cowpath, negative.** The
  pull is "it exists, so keep it / build inside it". A compromise.
- **Revealed USAGE (demand) → desire path, positive at the right
  altitude.** Pave the route *behaviour* reveals is needed: the flag
  set on every call becomes the config default *at the config
  altitude*, never a hack in one caller. A desire path degrades into a
  cowpath when paved at the wrong altitude (a workaround enshrined as
  the design) or without checks (paving a symptom).

## Tells — Scan for These

Any of these in your own output is a trigger to stop and re-project:

- "keep", "preserve", "retain", "the existing two", "synthesise /
  combine / take-the-best-of the existing", "consolidate but keep",
  "residual that remains", "build X into the existing"
- treating a named existing function, boundary, or file as a thing to
  *satisfy or keep* rather than malleable evidence to subsume
- listing a current-shape artefact as "residual to retain" rather than
  a *need served by the one model*
- converting every input into an action (a gate run, an elaborated
  framing, a task): reactivity is being unmoored from the impact, and most
  inputs need a judgment against "what are we for", often no action at
  all (owner, 2026-07-01, stopping a Director twice). A move that arrives
  smoothly ("gates won't pass, so bypass", an inherited "the owner said")
  is grounded first-hand before it is propagated, hardest exactly when it
  conveniently licenses the act

NOT a cowpath: using a low-level primitive (git, a CLI, an env var) as
a building block; recording that a current-shape problem *dissolves*;
pointing to an SSOT; naming a real requirement (write-safety → loud
failure) as a declared property of a view over one model.

The tells are semantic, not lexical — "keep" is ubiquitous in
legitimate prose — so this is an agent self-scan at write and
consolidation moments, not a hook substring
([`hook-policy-substring-discipline`](hook-policy-substring-discipline.md)).

## A Lane Closes on Its Value Statement

Owner, 2026-09-10, after a lane was reported in terms of legs, analyser
rules, `continue-on-error` and a refinement: "well that sounds like
convoluted nonsense! Mechanisms aren't purpose, design is not impact. What
is the work trying to achieve and why, what is the value, to whom, when.
That is all that matters." Open every lane report with the value statement
— what, why, to whom, when — and close the lane when that statement holds at
the landed head. The front door's settlement (green by name, the quiet
window, threads dispositioned) is the SAFETY condition, necessary and never
sufficient; a prose-review tail on the lane's records is terminated by
declaration at its budget, never chased. And at a handover, confirm the
boundary of "done" in the owner's own words before writing the record (a
seat read two PRs as outside the lane; the owner read them as its two
halves).

## Precedent Is Not Correctness

That an existing component chose X — a framework, a pattern, a library — is
evidence about THAT component's use case, never a justification for the same
choice elsewhere (owner, 2026-07-08, after a Slack-app design leaned on the
repository's Express MCP server as a reason to choose Express: "Precedent is
NOT correctness … the Express MCP is sensible for THAT use case, not this
one"; the Slack adapter was Web-Request-native and wanted a different
runtime). Reasoning from precedent is a fluency trap — it arrives smoothly
and skips the fit check. When about to justify a choice with "the existing
module does X", stop and re-derive from this use case's actual constraints;
reuse genuinely shared packages freely, never inherit framework or
architecture choices by precedent; state the fit-for-use-case warrant, not
the precedent. The same rule reads the current tooling configuration as a
hypothesis about the right design, never a law (`never-disable-checks`
§Configuring a check to express the architecture).

## Re-Apply at Every Altitude

The substrate lens slips off in **detail and capture mode** — recording
a "constraint", transcribing a review finding — even after holding it
at design altitude (caught six times in one session, 2026-06-27/28:
"synthesise the two functions"; anchor machinery built inside the
launch-from-primary shape; "keep the two IO philosophies" written as a
build constraint). The frame is not a one-time reframe at the top. Test
every constraint or detail you write: *is this the instance-shape, or
the impact-view?*

## The Inherited Separation May BE the Bug

When a discoverability or integration problem traces to an existing
separation, firewall, or boundary, do not design an elaborate fix that
carefully PRESERVES it — that is the cowpath wearing a
"non-entangling" costume. Ask: (a) is the boundary itself the problem?
(b) what is the ONE smallest change that delivers the impact? (Worked
instance 2026-06-28: an orientation tool invisible because a
domain/orientation separation was taken too far; the proposed
multi-workstream isolation-preserving precursor was wrong, the owner's
one pointer sentence deliberately relaxing the over-separation was
right.) An owner-sanctioned sticking-plaster precursor is valid —
replaced by the proper fix later, never bridged around
([`replace-dont-bridge`](replace-dont-bridge.md)).

## Design Agency — the Value Constraints Are the Fixed Points

When we control the stack, the governing fixed points are the value
constraints, never the existing artefacts. Interfaces, data shapes,
consumer counts, ratified plan decisions, even *generated*
serialisations are malleable design surface — a generated data shape
is a design output we own, not a fixed input. Do not defer a right
seam because of the current consumer count, reason form-first from a
current serialisation, or guard the owner's past decisions against the
owner. Plans changing with new understanding is healthy: do it openly,
with critical reasoning and owner ratification where appropriate. When
new understanding overturns a plan's *frame* (not a detail), scope a
deliberate reshape — never annotate the old frame and call it done.

## Attribute System Properties to the System

An "the owner is like X" / "the owner always wants X" observation
during design is a homing question, not a fact to file: is X a
Practice intent that should be legible in the system itself? When
system intent is legible only through enforcement and correction,
agents reconstruct it inductively as a personality model of the
enforcer — the same instance/substrate inversion this rule cures in
code. Route the observation to its doctrine home (owner-ratified
2026-07-05).

## Handling Procedure

Like tombstones: (1) **name** suspected instances "cowpath"; (2)
**mark** them inline for re-projection; (3) **scan** written artefacts
and your own context for the tells; (4) **re-project** each through
impact — the existing artefact becomes a view or flow on the one
model, or it dissolves.

## No Design by Review in Pull Requests

A review bot sees a diff, never the vision, so a finding that argues design
INTENT — what the system should allow, what a demonstration should show — is
outside its visibility. Owner, 2026-09-06, verbatim, on a proposal to narrow
a reading-order exemption: "We do NOT allow design by review in PRs, we have
a vision that PR bots have no visibility of. Of course visual design should
be [...] coherent, that is not in question, but the fact that the
mechanism is capable of producing incoherent designs is not a failure, it
is power, that must be used appropriately and well, the reviewer is mixing
concerns myopically." Capability and use are separate concerns: coherence
is enforced where designs are made and judged (the vision, the rubric's
owner-held rows), never by narrowing the mechanism. On design surfaces a
review finding that proposes a design-policy narrowing is dispositioned by
reference to the vision and the standing rulings — never cured, never
carded to the owner as a refinement, never carried as residue. Findings
about falsifiable facts (a wrong count, a broken link, a rule violation)
remain cures.

## Related Surfaces

- [`principles.md` §Decision Lenses](../directives/principles.md#decision-lenses--order-of-resolution)
  — lens 4 is this rule's generator; the either/or clause there is the
  question-arrival sibling.
- [`re-apply-first-question-at-elaboration-boundaries`](re-apply-first-question-at-elaboration-boundaries.md)
  — the lens-3 elaboration sibling; this rule is the lens-4/design-agency
  counterpart at the same boundaries.
- [`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md)
  — the anti-preservation self-scan sibling ("similar to how we handle
  tombstones" is the owner's own framing for this rule).
- [`replace-dont-bridge`](replace-dont-bridge.md) — sticking-plasters
  are replaced, never bridged around.
- [`scope-from-goal-before-approach`](scope-from-goal-before-approach.md)
  — the scoping-moment expression of designing from the goal.
