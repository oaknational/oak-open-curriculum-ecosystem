---
pdr_kind: governance
---

# PDR-038: Stated Principles Require Structural Enforcement

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-036](PDR-036-friction-as-structural-finding.md)
(friction-as-structural-finding — when justification prose grows, the
categorisation is incomplete; this PDR is the enforcement-side
companion: stated principles without enforcement surfaces are also
incomplete);
[PDR-039](PDR-039-external-findings-reveal-local-detection-gaps.md)
(external-system findings as signals of local detection gaps — sibling
PDR addressing the response-time discipline);
the host's self-reinforcing-improvement-loop concept (see
practice-index Concept ↔ ADR map) — the self-referential property:
the system that names a class of bug will eventually catch its own
author.

## Context

A principle named in a host's `principles.md`, a directive, an ADR,
or a PDR is a stated intention. Without a structural enforcement
surface — a rule file, a validator script, an ESLint rule, a type
guard, schema validation, a CI gate — the principle relies on every
contributor remembering it at the moment of authorship. Memory is
unreliable; the principle eventually catches its own author.

Empirical instances from the originating repo (host-local
identifiers omitted from this portable record; see the host repo's
commit history and the practice-index Rules section for the worked
mappings):

- **No-absolute-paths principle** (months-stable) caught its own
  author when an active pattern-library file was found containing
  reference-style markdown links pointing into a per-user
  platform-cache directory that does not exist for any other
  contributor and hardcoded the original author's username. The
  principle was sharpened to "no machine-local paths" and
  operationalised via a `no-machine-local-paths` rule with thin
  platform adapters and an entry in the host's rules index. The
  structural surface is what closed the loop.
- **Gate-off-fix-gate-on** was named in plan prose for weeks before
  an owner-directed graduation elevated it from pattern-candidate
  to anti-pattern doctrine, with a `never-disable-checks` rule
  (host-local; bridged via the practice-index Rules section) plus a
  `principles.md` §Code Quality amendment closing the gap.
- **Validation-scripts-are-not-tests** was named in the host's
  testing-strategy directive as a single paragraph and was bypassed
  during a PR closure when an integration test of repo state was
  authored alongside five sibling drift instances. The structural
  surface (a worked example in the host's testing-TDD-recipes
  document under §Validator Script vs Integration Test) was added
  to close the gap.

The cross-instance shape: stated principles are necessary but not
sufficient. The mechanical enforcement surface — a rule, a validator,
a lint rule, a type guard, a schema check — is what makes a principle
robust under cognitive pressure (recipe momentum, deadline pressure,
context blindness).

## Decision

**A principle stated as prose in `principles.md`, a directive, an ADR,
or a PDR MUST be paired with a structural enforcement surface — a
rule, a validator, a lint rule, a type guard, schema validation, a CI
gate, or an equivalent mechanical check — within the same arc of
work, or recorded as a deliberate exception in the
Pending-Graduations Register with a named trigger for closing the
gap.**

The discipline has three concrete moves:

1. **Pair principle with surface at authoring time.** When stating a
   principle, name the enforcement surface in the same edit. If no
   suitable surface exists, name the candidate (a new rule file, a
   new validator script, a new ESLint rule, a schema constraint).
2. **Close the gap structurally.** Authoring the rule file or
   validator is the work; the prose paragraph alone is not. The arc
   of work that names the principle either closes the gap or
   explicitly defers the closing with a trigger.
3. **Record the deferral honestly.** When closing the gap is
   genuinely out of scope for the current arc, record the principle
   as a `pending` candidate in the Pending-Graduations Register with
   `trigger: second instance OR owner direction`, the candidate
   enforcement surface named, and the principle text quoted so the
   register entry is self-contained.

## Consequences

- **Reviewer agents and consolidation passes gain a new question.**
  When a principle is stated in prose, the reviewer should ask: "what
  is the enforcement surface, and does it exist yet?" Missing
  surfaces become candidate work items.
- **Authorship time is the cheapest gap-closing time.** The cost of
  authoring the rule file alongside the principle is small. The cost
  of closing the gap after the principle has caught its own author is
  larger (the principle must now be sharpened *plus* enforced; two
  edits instead of one).
- **The host's rules index evolves alongside principles.** Each
  new rule file added under this discipline updates the host's rules
  index so the enforcement surface is discoverable.
- **Pending register entries get a stricter shape.** Bare "PDR
  candidate" entries are not self-contained — the candidate
  enforcement surface must be named (e.g. "trigger: second instance;
  surface: a host-local rule file under the host's canonical rules
  path").

## Implementation Notes

The principle is recursive: this PDR is a stated principle. Its
enforcement surface is the host's `consolidate-docs` graduation
scan step (which already asks "is this PDR-shaped?") plus the
Pending-Graduations Register's `surface:` field convention introduced
above. A future amendment may add a validator that scans the host's
principles directive and named directives for prose-stated rules and
flags those without a citation back to a rule file or validator.

## Compliance Triggers

- A principle is stated in the host's principles directive, another
  directive, an ADR, or a PDR with no enforcement surface named.
- A reviewer agent finds a principle that has caught its own author —
  evidence that the gap exists and needs closing.
- An external system (SonarCloud, Copilot, Cursor Bugbot) catches
  something that a stated principle should have prevented; route via
  PDR-039.

## Worked Instances

Three instances on the originating repo (2026-04-29 / 2026-04-30):
the no-machine-local-paths principle and rule, the
never-disable-checks principle and rule, and the
validation-scripts-are-not-tests principle and worked example.
Each illustrates the same shape: prose alone was insufficient; a
structural surface closed the loop. Host-local instance files are
bridged via the practice-index Rules section.

## Amendment Log

None yet.
