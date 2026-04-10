---
name: "Scoped Gitignore for Colliding Directory Names"
use_this_when: "Adding or tightening `.gitignore` rules for a generically named directory (`reference`, `data`, `output`, `tmp`) and more than one subtree uses that name for different purposes"
category: process
proven_in: ".gitignore (scoped `packages/sdks/oak-sdk-codegen/reference/*.json`); .agent/reference/README.md (where-this-fits table)"
proven_date: 2026-04-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A repo-wide `**/dirname/*` rule silently ignores new tracked docs under an unrelated `dirname/` tree, or blocks committing long-lived material until someone force-adds or adds ad hoc negations"
  stable: true
---

# Scoped Gitignore for Colliding Directory Names

## Problem

A pattern such as `**/reference/*` treats every directory named `reference`
the same way. In a monorepo, unrelated trees often reuse common folder
names:

- generated validation artefacts (JSON maps)
- long-lived human-written reference docs
- future packages that adopt the same folder label for a third reason

One broad rule couples those concerns. New files under the wrong subtree
appear ignored; negation lists grow; documentation and checkout behaviour
diverge from contributor expectations.

## Pattern

1. **Prefer path-scoped rules** — e.g. `packages/some-pkg/reference/*.json`
   rather than `**/reference/*` when only one subtree holds generated blobs.
2. **Prefer extension or filename** when it matches the real invariant
   (generated JSON only, not every file in the folder).
3. **Reserve generic `**/dirname/` rules** for cases where every instance
   of that directory name truly shares the same ignore contract.
4. **Document the table** — a short "where this fits" matrix in the nearest
   README reduces rediscovery cost when the layout is not obvious from
   `.gitignore` alone.

## Anti-pattern

Using a single `**/common-name/*` ignore plus growing `!` exceptions for
each tracked exception file. That is a signal the rule is scoped at the
wrong level.

## See also

- [`.agent/reference/README.md`](../../reference/README.md) — agent vs SDK
  reference layout in this repo.
