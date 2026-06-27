---
name: "Disambiguate an Overloaded Term Before Canonicalising or Sweeping"
polarity: pattern
use_this_when: "Defining a canonical list for a term, running a find-and-replace sweep, or collapsing a classification axis — any time one label is about to be treated as one thing."
category: process
proven_in: "MCP-app 'platform' canonicalisation (2026-06-26, Bonfire guards Temper); the memory/repo-state/local-state substrate-tracking axis (2026-06-25, Zephyr mends Bluff)"
proven_date: 2026-06-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A global string-replace or two-way classification cut that conflates several distinct concepts hiding under one label — flattening a deliberate, sometimes owner-ratified, distinction."
  stable: true
---

> **POLARITY: PATTERN.** A word that reads as one thing in prose often
> denotes several distinct concepts across a repo, and an axis that looks
> binary often has three or more positions. Enumerate before you collapse.

## The shape

Before defining a canonical list, running a find-and-replace sweep, or
collapsing a classification axis, **enumerate the distinct concepts the
term denotes and scope each separately**. A global replace conflates them;
a two-way cut on a multi-position axis crystallises prematurely.

- **"platform"** for the MCP app meant three different things —
  dev-agent platforms (Cursor/Claude Code/Gemini-CLI/Codex), illustrative
  MCP-client examples, and the target end-user assistants — and within the
  last, the support *principle* vs the owner-ratified *release surface*
  (K3). A naïve "replace every platform mention with the canonical four"
  would have flattened a ratified strategic distinction. The cure was a
  per-concept find-and-conform pass, never a global string-replace.
- **The substrate-tracking axis** was treated as two-valued (memory vs
  not-memory → migrate-to-untracked) when it has three positions: memory
  (portable, tracked), repo-state (repo-specific but checkout-portable,
  tracked), local-state (per-checkout, git-ignored). Collapsing to two
  proposed git-ignoring continuity surfaces that are correctly tracked.

## The cure

Name the distinct concepts the term/axis denotes; scope each; act per
concept. The defect is dissolved by enumeration, not by a careful
global replace. Sibling: [`inherited-framing-without-first-principles-check`](inherited-framing-without-first-principles-check.md).
