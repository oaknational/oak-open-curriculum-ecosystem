# Outgoing Patterns

This directory is the sender's half of the **pattern exchange** — the
mechanism named in the Practice Core (see `practice-lineage.md §Pattern
Exchange`).

## What lives here

Patterns from `.agent/memory/patterns/` that are:

- **Broadly applicable** across multiple codebases, tech stacks, and
  team shapes.
- **Proven** by at least one implementation in this repo (ideally
  more than one).
- **Practice-relevant** — they change how sessions unfold, not just
  how a specific domain problem is solved.
- **Stable** — have survived at least one subsequent session without
  revision.

These patterns are the portable subset of `.agent/memory/patterns/`.
Repo-specific patterns (curriculum-shaped gotchas, codegen-specific
tricks) stay in `.agent/memory/patterns/` only.

## What does NOT live here

- Topic notes explaining a structural or process innovation (those
  live in the parent `outgoing/` directory).
- Reviewer roster material (parent `outgoing/`).
- Platform-specific guides (parent `outgoing/`).
- Unproven patterns awaiting cross-session validation (those stay in
  `.agent/memory/patterns/` until they clear the bar).

## Adoption in a receiving repo

Receiving repos apply the same three-part bar from `practice-lineage.md`:

1. Validated by real work?
2. Would its absence cause a recurring mistake?
3. Stable?

Adopted patterns move to the receiver's local
`.agent/memory/patterns/`. Rejected patterns are recorded in the
receiver's napkin with a note that they were reviewed and found
inapplicable to that context.

## Current contents

| Pattern | Category | Cross-layer instances | Primary use |
|---------|----------|----------------------|-------------|
| `findings-route-to-lane-or-rejection.md` | process | review layer | Every reviewer finding routes to ACTIONED / TO-ACTION (named lane) / REJECTED (rationale); no deferred-without-a-home |
| `nothing-unplanned-without-a-promotion-trigger.md` | process | planning layer | Every `future/` plan carries a named testable promotion trigger |
| `ground-before-framing.md` | process | scope-analysis | Read the composition root before proposing integration pivots |
| `test-claim-assertion-parity.md` | testing | test-discipline | Test narrative and assertion must prove the same thing |
| `non-leading-reviewer-prompts.md` | agent | reviewer-invocation | Non-leading prompts surface wider finding surfaces than leading ones |
| `adr-by-reusability-not-diff-size.md` | process | ADR-worthiness | ADR-worthiness scopes by reusability across future adopters, not by diff size |

New patterns are added to this directory when their source pattern
file in `.agent/memory/patterns/` has cleared the three-part bar.
Maintain this index table in lock-step with the directory contents.
