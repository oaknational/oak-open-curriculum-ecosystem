---
name: "A Policy/Content Hook Firing While You Author Names a Concept, Not a Token"
polarity: pattern
use_this_when: "A content/policy hook or commit gate fires while you author a schema, contract, doctrine, or other artefact, and you are tempted to read it as an over-match to patch away."
category: process
proven_in: "2026-06-21/22 (Cutter, Petrel) — original. Re-fired 2026-06-27 (Hawthorn rides Foliage): the SHA-in-permanent-doc hook blocked a pattern file; the cure was removing the moving-target SHA dependence (structural), not swapping a synonym to bypass — and the block message itself said so."
proven_date: 2026-06-27
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reading a hook/gate block as a lexical over-match and patching the matched token to slip past it, instead of asking whether the artefact embodies the policed concept and applying the structural cure."
  stable: true
---

> **POLARITY: PATTERN.** When a content/policy hook fires while you author,
> the matched token is a **coordinate**, not the defect — it points at a
> concept to reappraise, not a word to rephrase.

## The shape

A content/policy hook (or a commit gate) fires while you are authoring a
schema, contract, doctrine, or pattern. The reflex is to treat it as an
over-match and patch the token — a synonym, a rephrase — to slip past.

That reads the firing at the wrong altitude. The matched token is a
coordinate: **before judging it an over-match, ask whether the artefact
embodies the policed concept ANYWHERE**, not only at the firing point. The
cure is often structural, not a lexical patch.

Relatedly, a gate that blocks a commit may be telling you the blocked thing is
itself the defect. **Understand the block before bypassing** — the clean fix
can be *removing what is blocked*, not skipping the gate.

## The cure

Treat the block as a question about the concept. Reappraise the artefact for
the policed concept as a whole; apply the structural fix that removes the
dependence on the policed thing. Reach for a bypass flag or a synonym only
after you have established the firing is a genuine false match — which is rare.

## Siblings

- [[feedback_hook_failures_are_questions]] — understand what a failing gate
  asks before engineering past it.
- [`hook-policy-substring-discipline`](../../../rules/hook-policy-substring-discipline.md)
  — the policy-authoring side of the same surface.
- [[feedback_no_sed_bypass_for_edit_failures]] — reaching for a bypass tool is
  the tell.
