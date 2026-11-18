---
name: Amending Doctrine Binds the Editor
polarity: anti-pattern
use_this_when: Editing any skill, rule, directive, or governance doc while running live work the same document governs
category: agent
layer: general
proven_in: .agent/memory/active/archive/napkin-2026-07-20.md (2026-07-16, two instances in two days at one Director seat)
proven_date: 2026-07-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Doctrine-blindness while editing doctrine — violating a document's adjacent sections in live actions taken the same hour the document was being amended"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is treating a doctrine file as
> an append target rather than a contract binding the editor's own in-flight
> actions.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

A seat amending a skill/rule holds the document open as a WRITING surface and
stops reading it as a BEHAVIOURAL contract. Two instances in two days at one
seat (2026-07-16): a PR squash-merged against the merge-commit-never-squash
rule sitting ~60 lines below the section being amended the same hour; a PR
merged with a forbidden `--admin` flag while editing the very file whose
Phase 7 forbids it — the breach read only AFTER the merge.

## Cure

Before landing any amendment to a doctrine document, run a **mechanical
compliance read of the amended document's adjacent sections against your own
in-flight work** — a checklist pass, not a skim: for each adjacent
prohibition or gate, name the live action of yours it binds and confirm
compliance. Where the violated clause is mechanically guardable (a merge
method, a forbidden flag), the stronger cure is a mechanical guard rather
than diligence — route that as a tooling candidate. The metacognition
directive's fluency warning names the generator: editing a document produces
the strongest possible feeling of knowing it.
