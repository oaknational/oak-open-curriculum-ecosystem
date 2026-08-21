---
name: cut-coordination-branch
classification: active
description: Cut or name a coordination branch with the date + base-sha6 name minted by the agent-tools coordination topic. The suffix usually separates cuts from DIFFERENT base tips (successor folds, recovery re-cuts) — a probabilistic lineage signal, never a uniqueness proof — and does not discriminate parallel same-tip cuts. Use at the fold ceremony's successor cut or a recovery re-cut, and never hand-transcribe the name.
---

# Cut Coordination Branch

## Why the name has a suffix

Coordination branches are named `coordination/<UTC date>-<sha6>`, where
`sha6` is the first six hex characters of the base commit the branch is
cut from. The suffix is deliberate owner policy (2026-08-17, restated at
the convention break that motivated this skill): this is a real repo
with many live checkouts, and a date-only name lets two checkouts
cutting from DIFFERENT tips mint the same branch and collide silently.
The sha suffix makes a checkout cutting from a different tip almost
always mint a different name instead — six hex characters trade
absolute uniqueness for name legibility, so distinct commits CAN share
a prefix; the suffix is lineage signal, never a uniqueness proof. It
also usually disambiguates same-day rotations and usually makes the
lineage walkable from names alone — each fold's successor carries the
fold-merge commit that birthed it (`…-ca6b0f → …-c8586f` in the
2026-08-13 chain), with git the authority whenever a prefix collides.

The guarantee's boundary, stated exactly: the suffix usually
discriminates base TIPS (distinct tips can share a six-character
prefix) and never discriminates cutting INSTANCES. Two checkouts
cutting from the same `origin/main` tip on the same UTC day mint the
identical name. That case is out of this mechanism's scope by design
— the estate runs one
coordination branch at a time (the no-parallel-long-lived-branches
rule), so a deliberate second same-tip surface is a coordination event
to arrange explicitly between seats, never something the name alone
makes safe.

## The mechanism

Mint the name with the tool — never by hand, never from memory:

```bash
pnpm --silent agent-tools coordination successor-name
```

It prints `coordination/<today UTC>-<sha6 of origin/main>` and nothing
else (pass `--base <ref>` to cut from another commit; an unresolvable
ref is a typed refusal). Cut tree-preserving and publish:

```bash
git fetch origin main
BASE="$(git rev-parse origin/main)"
git switch -c "$(pnpm --silent agent-tools coordination successor-name --base "$BASE")" "$BASE"
git push -u origin HEAD
```

Resolve the base ONCE and pass the same full sha to both the mint and
the cut: two separate `origin/main` resolutions race a concurrent fetch
(name encodes tip A, branch starts at tip B), and the lineage the name
carries is then false from birth.

## When this fires

- The [coordination-fold ceremony](../coordination-fold/SKILL-CANONICAL.md)
  step 9 — the successor cut after the fold merge.
- Recovery after a broken rotation — the outside-the-ceremony case
  where a fresh cut is needed and the base tip is expected to differ
  from the broken branch's.

## Failure the mechanism prevents

The convention previously lived only in continuity records while the
fold skill named a different form; the first seat to read the skill
literally minted an unsuffixed name (2026-08-17, frictions register
F-161). A convention that must be transcribed is vigilance; this skill
plus the tool make it structure.
