---
name: fix-the-class-through-the-revealing-lens
polarity: pattern
category: process
status: emerging
discovered: 2026-06-14
proven_by: "WS7 atomic-untrack ENOENT (Whirlwind rides Ridge): the untrack made .agent/state/collaboration/ absent in fresh CI checkouts; validate-collaboration-state crashed ENOENT. The first fix patched only the comms/ surface that crashed; CI failed again on the next class member (active-claims.json), and a third member existed (closed-claims.archive.json). Three members of one class — 'untracked-by-design surface absent in a fresh checkout' — only the fresh-checkout/CI lens revealed all three; the local tree (all files present) hid them."
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Fixing the single reported instance of a failure when the failure is one member of a class, so sibling members fail later (extra CI rounds, re-opened tickets) — compounded when the lens the agent has (local, all-files-present) cannot see the other members that only a different lens (fresh checkout, CI, a different environment) reveals."
  stable: false
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Fix the Class Through the Lens That Reveals It

## Pattern

When a fix addresses a *class* of defect rather than a single incident, do two things
before declaring it done:

1. **Enumerate every member of the class up front.** Name the property the class shares,
   then list all the surfaces/inputs/sites that have that property — fix them in one
   tranche, not the one that surfaced.
2. **Find the lens that reveals the whole class.** The instance that crashed is visible
   in the lens you already have. The other members are often visible only in a *different*
   lens — a fresh checkout, a CI run, a cold-start environment, a different OS, an empty
   registry. Run that lens deliberately; do not trust that "it works here" enumerated the
   class.

## Anti-pattern

A failure surfaces (e.g. one directory is absent in CI and a reader crashes `ENOENT`).
The agent fixes that one reader/surface, reruns, and ships. CI fails again on the next
member of the same class; the agent fixes that one; a third member waits. Each round
costs a full CI cycle. The agent's local tree never reproduces the failure because the
local lens (all files present) cannot see the class — so "passes locally" is mistaken
for "class handled."

## Why it matters

A class fix that patches only the reported instance is indistinguishable, in the moment,
from a complete fix — both go green on the lens that surfaced the problem. The cost lands
later and repeatedly. The cure is cheap: at fix time, ask "what is the *property* this
failure has, and what else in the system has that property?" then "which lens shows me all
of them?" The fresh-checkout / CI / cold-start lens earns its keep precisely because it
sees what the working lens hides.

## When to apply

- A reader/validator crashes on a surface that is absent, malformed, or empty in some
  environments but not others (untracked-by-design surfaces, optional config, first-run state).
- A migration changes a precondition that many call sites depend on.
- Any fix whose root cause is a shared property ("missing X", "wrong assumption about Y")
  rather than a one-off typo.

## Adjacent

- [[verify-before-propagating]] — verify against the source before asserting; here, verify
  against the *revealing* environment before asserting the class is handled.
- [[ground-convenient-claims]] — "fixed it" is a convenient completeness claim; the
  cheapest falsifying probe is the fresh-checkout lens.
