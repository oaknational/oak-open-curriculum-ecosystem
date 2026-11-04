---
classification: situational
description: Record every change that makes an element of the Practice more general or more portable with a Practice-Generalisation trailer in the commit that makes it, naming the element and saying in one sentence what became more general and why (owner direction 2026-09-13). Use when a change under agent-tools/, the Practice Core, rules, skills, directives or the platform adapters derives what it used to list, stops naming its host, replaces a host record's number with the concept, states a general form, or takes a sibling estate's more general text (marked received from that estate). Not for fixes to this repository's own product or paths, and never added later from memory. Failure shapes — a register file beside the commits that stopped getting rows after ten days while qualifying moves kept landing; a list rebuilt from commit subjects that keeps the changes but loses the reasons.
trigger: surface:practice-substrate ∪ ceremony:commit
globs:
  - agent-tools/**
  - .agent/practice-core/**
  - .agent/rules/**
  - .agent/skills/**
  - .agent/directives/**
  - .claude/**
  - .cursor/**
  - .agents/**
  - .gemini/**
---

# Record Generalisation Moves

Owner direction (2026-09-13, verbatim; given in a transplanted estate, so "OCE" names the
lineage): "where we take action to make an element of the Practice more general, more
portable, make a note, that will be important in future work when we 1. send these
improvements back to OCE 2. update our Practice with the enhancements from OCE 3. transplant
the Practice to more repos 4. In a later and separate thread, not necessarily in this repo,
look at extracting the Practice as a standalone system with installable elements".

## The Rule

When a change makes an element of the Practice more general or more portable — an instrument
that derives what it used to list, a validator that asks the repository instead of the disk,
a surface that no longer names a host, a host record's number replaced by the concept it
stands for, doctrine that states a general form — the commit that makes the change carries a
`Practice-Generalisation:` trailer naming the element and, in one sentence, what became more
general and why:

```text
Practice-Generalisation: cited-paths validator — resolution asks git, never the
  local disk, so CI and a local checkout agree
```

A text taken from a sibling estate that makes this estate's copy more general carries the
same trailer with `(received from <estate>)` after the element, so the record holds both
directions of the exchange. The trailer is written in the commit that makes the change, never
added later from memory. A value longer than the 100-character footer line limit folds onto
indented continuation lines.

## Why

Four later pieces of work need the list of what became portable and why: offering
improvements to sibling estates, taking theirs, the next transplant, and the extraction of the
Practice as an installable package. Rebuilt from commit subjects after the fact, the list
loses the reason, and the reason is the part that travels.

The note lives in the commit because the commit already holds the date, the diff and the
change's identity; a register beside it restates those by hand, and an append-only register
cannot record that a move has since been offered. The list is computed where it is needed:

```bash
git log --format='%as %h %(trailers:key=Practice-Generalisation,valueonly,unfold,separator=; )' | awk 'NF > 2'
```

An estate that kept a register before the trailer closes it and keeps its rows. Its full list
is those rows, then the trailer query over the commits after the register closed.

What a sibling estate has been offered or has taken is exchange state; the exchange's own
records hold it, and the trailer never does.

## Scope

Fires on changes under `agent-tools/`, `.agent/practice-core/`, `.agent/rules/`,
`.agent/skills/`, `.agent/directives/` and the platform adapters, when the change's effect is
generality or portability. A fix to this repository's own product or paths is not a
generalisation move and carries no trailer.

## Provenance

The owner's direction and the rule were first written in the jimcresswell.net Practice on
2026-09-13, in a register form: `.agent/rules/record-generalisation-moves.md` as that
repository's history holds it before 2026-09-24.
The open-curriculum-ecosystem Practice took it through the Practice Box exchange of
2026-09-24 (batch one). The adaptation: the note moves from an append-only register file into
a commit trailer, and the list is computed from git history. The register form stopped
getting rows after ten days while qualifying moves kept landing, and a register cannot keep a
lineage status true.
