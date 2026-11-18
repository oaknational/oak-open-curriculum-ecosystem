---
id: rules-operationalises-line-enforcement
node_type: delivery
name: "Every canonical rule names the decision it operationalises, and a scanner keeps it so"
overview: >-
  Every file under the rules tier opens with the Operationalises line the
  extending guide already requires, and a repo validator refuses a rule
  without one, so the contract stops being prose that seventy-one rules
  quietly missed.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-09
---

# Every canonical rule names the decision it operationalises, and a scanner keeps it so

## Goal

The engineering guide says every canonical rule must cite the decision it
operationalises with a leading "Operationalises ADR-NNN" line (ADR-131 §Self-
Referential Property). Measured 2026-09-08 during a review round on the
worktree-hygiene family: seventy-one of one hundred and twenty-five rules carried
no such line and nothing enforced the contract — a universal governance claim with
no scanner behind it. When this lands, every rule under `.agent/rules/` opens with
the line naming the ADR, PDR or directive it operationalises, and the repo
validator chain refuses a rule that does not.

## User groups and value

- **A seat reading a rule at its action moment** learns in one line which decision
  the rule enforces, so a misfit case routes to the decision record rather than
  arguing with the rule (`rules-have-no-exceptions` step 4).
- **A seat authoring or reviewing a rule** gets the contract as a check, not a
  sentence in a guide: the validator names the file and the missing line.
- **The owner** gets the rules tier as a traceable enforcement layer over the
  decision records, the shape ADR-131 asked for.

## Mechanism

1. A sweep, one PR per family of rules (grouped by the decision they serve), adds
   the leading line to each rule that lacks one — the line names the governing
   record where one exists and the directive section where the rule enforces a
   principle rather than a numbered decision; a rule with no identifiable authority
   is surfaced on the PR as a rule to re-ground or retire, never given an invented
   citation.
2. A validator under the repo-validators chain reads every `.agent/rules/*.md`,
   requires the line as the first non-frontmatter paragraph, checks that the record
   it names exists (an ADR or PDR number resolves to a file; a directive anchor
   resolves), and exits non-zero naming each offender — the `governance-claim-
   needs-a-scanner` shape, proven by `validate-fitness-vocabulary`.
3. The extending guide's contract is amended in the same step to the grammar
   the validator accepts — `Operationalises ADR-NNN`, `Operationalises
   PDR-NNN`, or `Operationalises <directive> §<section>` — and names the
   validator as its check, so the documented authoring contract and the
   scanner agree.

## Acceptance criteria (each with a proof — required)

1. Every file under `.agent/rules/` opens with an Operationalises line whose
   target resolves. Proof: `repo-safe` — the validator green on the full tier,
   wired into `pnpm repo-validators:check`.
2. A rule without the line, or naming a record that does not exist, fails the
   validator with the file path and the reason. Proof: `repo-safe` — red-first unit
   tests over fixtures (missing line; unresolvable ADR number; a directive anchor
   that does not exist), no IO.
3. The extending guide states the accepted target grammar and names the validator
   as its check. Proof: `repo-safe` — the markdown-links validator and a read of the
   sentence on the landing PR.

## Todos (optional; proofs on todos optional)

1. The validator with its fixtures and the chain wiring, landing green because it
   runs in report mode until the sweep completes (adoption-forward, no red-gate
   window); one PR.
2. The sweep, one PR per rule family, each naming the rules it re-grounds and any it
   surfaces for retirement; the validator flips to blocking in the last one.

## Out of scope

- Rewriting any rule's substance: the sweep adds the citation line and nothing
  else; a rule whose authority cannot be named is surfaced, not edited.
- Skills, directives and PDRs: the Operationalises contract binds the rules tier
  only (ADR-131); the other tiers have their own reference discipline.
