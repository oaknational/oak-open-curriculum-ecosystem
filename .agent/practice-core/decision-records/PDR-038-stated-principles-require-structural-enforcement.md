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
[ADR-131](../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
(self-referential property — the system that names a class of bug
will eventually catch its own author).

## Context

A principle named in `principles.md`, a directive, an ADR, or a PDR is
a stated intention. Without a structural enforcement surface — a rule
file, a validator script, an ESLint rule, a type guard, schema
validation, a CI gate — the principle relies on every contributor
remembering it at the moment of authorship. Memory is unreliable; the
principle eventually catches its own author.

Empirical instances on `oak-open-curriculum-ecosystem`:

- **No-absolute-paths in `principles.md`** (months-stable) caught its
  own author 2026-04-29 when `breadth-as-evasion.md` lines 105–106 were
  found containing reference-style markdown links pointing into
  `../../../.claude/projects/-Users-jim-code-oak-...` — a per-user
  Claude memory directory that does not exist for any other
  contributor and hardcodes the original author's username. The
  principle was sharpened to "no machine-local paths" and
  operationalised via `.agent/rules/no-machine-local-paths.md` with
  thin platform adapters and a `RULES_INDEX.md` entry. The structural
  surface is what closed the loop.
- **Gate-off-fix-gate-on** was named in plan prose for weeks before the
  owner-directed graduation 2026-04-29 elevated it from
  pattern-candidate to anti-pattern doctrine, with
  [`.agent/rules/never-disable-checks.md`](../../rules/never-disable-checks.md)
  plus a `principles.md` §Code Quality amendment closing the gap.
- **Validation-scripts-are-not-tests** was named in
  `testing-strategy.md §Test Types` as a single paragraph and was
  bypassed during PR-90 closure when an integration test of repo state
  was authored alongside five sibling drift instances. The structural
  surface (the worked example in
  [`testing-tdd-recipes.md § Validator Script vs Integration Test`](../../../docs/engineering/testing-tdd-recipes.md#validator-script-vs-integration-test))
  was added 2026-04-30 to close the gap.

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
- **`.agent/rules/RULES_INDEX.md` evolves alongside principles.** Each
  new rule file added under this discipline updates the index so the
  enforcement surface is discoverable.
- **Pending register entries get a stricter shape.** Bare "PDR
  candidate" entries are not self-contained — the candidate
  enforcement surface must be named (e.g. "trigger: second instance;
  surface: `.agent/rules/<slug>.md`").

## Implementation Notes

The principle is recursive: this PDR is a stated principle. Its
enforcement surface is the consolidate-docs §7a graduation scan
(which already asks "is this PDR-shaped?") plus the
Pending-Graduations Register's `surface:` field convention introduced
above. A future amendment may add a validator that scans
`principles.md` and named directives for prose-stated rules and flags
those without a citation back to a rule file or validator.

## Compliance Triggers

- A principle is stated in `principles.md`, a directive, an ADR, or a
  PDR with no enforcement surface named.
- A reviewer agent finds a principle that has caught its own author —
  evidence that the gap exists and needs closing.
- An external system (SonarCloud, Copilot, Cursor Bugbot) catches
  something that a stated principle should have prevented; route via
  PDR-039.

## Worked Instances

Three instances on this repo (2026-04-29 / 2026-04-30):
no-machine-local-paths, never-disable-checks, validation-scripts-are-not-tests.
Each illustrates the same shape: prose alone was insufficient; a
structural surface closed the loop.

## Amendment Log

None yet.
