---
classification: core
description: "When authoring new doctrine substance, classify it as new rule, PDR clause amendment, or new PDR before writing the first line. Prefer the lowest-cost route in order: existing PDR clause > new rule > new PDR."
---

# New Rule vs PDR Clause vs New PDR

When new doctrine substance arrives at write time, route it to the home that
matches its shape. Conflating the three homes — operational rules, PDR
clauses, and new PDRs — produces fragmented governance: rules drift into
narrative essays, PDRs gather operational checklists, and substance lands
where readers do not look.

## Trigger

A graduation, observation, or new substantive direction is about to be
authored as durable doctrine. The author has identified the substance is
worth keeping but has not yet committed to a specific destination file.

This rule fires before the first line of new doctrine is written. It is the
pre-author classification step that prevents drift between operational and
governance surfaces.

## Action

Run the substance through the three-way classifier below. Choose the FIRST
matching home; do not duplicate across multiple homes.

1. **Always-applied operational invariant → new rule under `.agent/rules/`.**
   Use when the substance is a per-session, agent-general discipline that
   must fire at a structural moment (session open, before stage, before
   commit, before broadcast, etc.). Rule files describe a Trigger, an
   Action, and the failure mode they prevent. The rule corpus is the
   always-applied behavioural-modifier tier — substance that lands here
   becomes context for every agent in every session.

2. **Amendment to an existing PDR → new clause in the PDR.**
   Use when the substance refines, extends, or constrains an existing PDR's
   contract. The PDR already owns the substrate; the new clause attaches to
   it. Add the clause inside the PDR's Decision section under a new
   numbered heading, update the PDR's Revision history, and add a
   Falsifiability axis if the new clause is falsifiable independently of
   the rest. A reading of an owner's word that changes what a Core record
   decides lands here, as an amendment of that record, dated and quoting the
   word, never as a rule sentence that contradicts the record while the
   record stands (2026-10-03).

3. **New portable Practice contract → new PDR.**
   Use when the substance is a load-bearing contract with portable scope
   (applies beyond this repo's phenotype), no existing PDR owns it, and the
   substance survives the falsifiability discipline of PDR-026 (the
   substance must name conditions under which it would be shown wrong).
   New PDRs are governance-class artefacts and carry the highest authoring
   cost; reach for one only when an existing PDR cannot cleanly own the
   contract through amendment.

4. **Cure-shape substance → pattern file under
   `.agent/memory/active/patterns/` or
   `.agent/memory/collaboration/`.**
   Use when the substance is a cure shape with recorded instances and
   named cures, but it is neither an always-fired discipline (which
   would be a rule) nor a portable contract (which would be a PDR).
   Two-or-more instances is the default heuristic, NOT a gate: per
   PDR-100 and the patterns README barrier reconciliation, a
   single-instance cure shape graduates when the decision lenses give
   a clear answer (broadly applicable, proven by implementation,
   stable). Pattern files carry worked instances, failure shapes, and
   named cures. `patterns/` is the home for solo-work cures;
   `collaboration/` is the home for multi-agent coordination cures.

When two homes look plausible, prefer the lower-cost route in order:
pattern file > existing PDR clause > new rule > new PDR. Pattern files
are the cheapest home (no governance/contract obligations); a new PDR
is appropriate only when no other home can encode the substance because
the substance is structural contract rather than per-session discipline
or multi-instance cure.

## Scope the substance to the circumstance before choosing a home

A correction is evidence about one situation's structural shape, and the
cure is the move that makes the next EQUIVALENT decision right. Before the
classifier runs, write (a) the exact circumstance, (b) what was actually
wrong, (c) the specific cure, and scope "how to apply" to the circumstance
class the owner named. Universal never-rules minted from one instance carry
costs the instance never priced — ceremony, refusals of legitimate moves,
waiting on peers who do not exist — and drift the Practice. Owner,
2026-09-02, verbatim: "you are over generalising from single instances of
corrections in specific circumstances", rejecting within a minute three
never-rules ("seats may be live without comms presence", "never any cwd =
primary", "never use nested worktrees") minted from two corrections whose
causes were specific: a stale-stream liveness reading (the seat's later
compaction-freeze event had revoked its closeout), and lane work planned
from a nested checkout with the primary as cwd. The instance-scoped cures
were the substance: read the stream to its END before a liveness statement;
land a lane from its own sibling worktree; keep long event bodies out of
shell heredocs.

An amendment to a rule that operationalises a decision record is written
with that record open. Second instance, 2026-09-19 to 2026-09-20: from one
incident (six directives read during a fold's waits) a seat added "the read
is budgeted too" to `directive-file-context-budget` without reading PDR-052,
which lists "Reading a directive as input to other work" as outside
directive-file work; the next day the seat declined a directive read the
owner's own skill directed, citing its clause, and carried the same gate onto
memory files it never named. Owner, verbatim: "you are taking the 30% too
literally and too strictly, if I give you a skill to read then read it". The
instance-scoped cure was the substance: read the meter again before the
first directive edit.

Then apply the structure test before writing the lesson down at all (owner
reframing, 2026-09-11: "you've described mechanical fixes, but what you have
implemented is prose … We are using lower powered models now, so we need to
rely more on the structure of the Practice than we have been doing"): **could
a lower-powered seat comply without recalling this lesson?** If not, the
lesson is unfinished — find the gate, the validator, the seam or the template
field that makes compliance the default and build that. The worked
conversions: a conditional test skip → a lint rule that names the conditional
APIs, with the identical probe as its negative control; a plan node pinning
text that does not run → the corpus validator parsing every fenced block;
tests reaching for the filesystem → the injected ops seam. A lesson that can
only be recalled is the weak form.

## Worked Instance

The 2026-05-26 pre-pose viability check graduated from
`pending-graduations.md` to an existing rule
(`.agent/rules/present-verdicts-not-menus.md`) as an amendment clause, not
a new rule and not a new PDR. The substance refined an already-rule-shaped
discipline (verdict-not-menu before AskUserQuestion); the matching home
was an additional clause in the existing rule's Action section, plus a
worked-instance entry.

The same 2026-05-26 curator pass graduated the heartbeat-only stall
diagnostic to PDR-078 as a new clause (§6) plus a falsifiability axis —
not a rule — because the substance refined the liveness contract's
observation contract, which PDR-078 already owned.

In contrast, the 2026-05-26 cross-lane commit blocking pattern graduated
to a new pattern file under `.agent/memory/collaboration/`, not a rule and
not a PDR clause, because the substance was a multi-instance pattern with
named cures rather than an always-fired discipline or a portable contract.
The pattern home is the correct destination for cure-shape substance with
worked instances; rules and PDRs name structural moves at structural
moments.

## Why a Rule, Not a Clause

This meta-rule is agent-general — every doctrine-authoring moment is a
potential mis-routing moment, and the classification step applies
uniformly to every author. Folding the classifier into PDR-026 (the
falsifiability PDR) was considered; it was rejected because the
classifier covers all three home types, not just the PDR-falsifiability
path. The rule-class home keeps the classifier visible at every authoring
moment, regardless of which doctrine surface is being authored.

## Related Surfaces

- [PDR-026 (per-session landing commitment and falsifiability discipline)](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  — falsifiability is the screen new PDR substance must pass.
- [`RULES_INDEX.md`](../../RULES_INDEX.md) — canonical enumeration of
  rule-class destinations.
- [`.agent/practice-core/decision-records/README.md`](../practice-core/decision-records/README.md)
  — PDR catalogue and authoring conventions.
- [`.agent/memory/active/patterns/`](../memory/active/patterns/) —
  pattern-class destination for multi-instance cure-shape substance that
  is neither rule nor PDR.
- [`.agent/memory/collaboration/`](../memory/collaboration/) —
  collaboration-pattern destination (cure shapes around multi-agent
  coordination).

## Enforcement

Behavioural at the authoring moment. The classifier is the named
pre-author step; the discipline is to run substance through it before the
first line of doctrine lands. Future hardening could add an automated
home-fit check at PR review time, but the first-line discipline is what
prevents drift.
