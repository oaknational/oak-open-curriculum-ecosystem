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
   the rest.

3. **New portable Practice contract → new PDR.**
   Use when the substance is a load-bearing contract with portable scope
   (applies beyond this repo's phenotype), no existing PDR owns it, and the
   substance survives the falsifiability discipline of PDR-026 (the
   substance must name conditions under which it would be shown wrong).
   New PDRs are governance-class artefacts and carry the highest authoring
   cost; reach for one only when an existing PDR cannot cleanly own the
   contract through amendment.

4. **Multi-instance cure shape → pattern file under
   `.agent/memory/active/patterns/` or
   `.agent/memory/collaboration/`.**
   Use when the substance is a recurring cure shape with two or more
   recorded instances and named cures, but it is neither an
   always-fired discipline (which would be a rule) nor a portable
   contract (which would be a PDR). Pattern files carry worked
   instances, failure shapes, and named cures. `patterns/` is the home
   for solo-work cures; `collaboration/` is the home for multi-agent
   coordination cures.

When two homes look plausible, prefer the lower-cost route in order:
pattern file > existing PDR clause > new rule > new PDR. Pattern files
are the cheapest home (no governance/contract obligations); a new PDR
is appropriate only when no other home can encode the substance because
the substance is structural contract rather than per-session discipline
or multi-instance cure.

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
