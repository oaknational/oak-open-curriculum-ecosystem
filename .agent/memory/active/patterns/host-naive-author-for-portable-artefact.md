---
name: "To Author a Host-Free Portable Artefact, Choose a Host-Naive Author"
polarity: pattern
use_this_when: "Authoring an artefact whose value depends on containing NO host/repo-specific concepts — a portable primer, a Practice-Core doc, a vendor-neutral spec."
category: architecture
proven_in: "the working-with-agentic-ai portable primer (2026-06-22, Orbit rides Horizon)"
proven_date: 2026-06-22
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Leaking host concepts into an artefact that must be host-free, then trying to catch the leaks by review — when the cleaner guard is an author that cannot leak what it has never seen."
  stable: true
---

> **POLARITY: PATTERN.** The strongest guard for a host-free artefact is
> not reviewing the output for leaks — it is an author that *cannot* leak
> what it has never seen. Dissolve the defect at source.

## The shape

When an artefact's value depends on containing no host/repo-specific
concepts, author it with a **Practice-naive author** (a separate
chat/checkout with no repo context) rather than writing it inside the
host and scrubbing afterwards.

**Caveat that bites:** a sub-agent launched from *inside* the repo
auto-loads `CLAUDE.md` → all Practice rules, and is contaminated before
it writes a word. The clean room needs genuinely no repo context — not
"a sub-agent I told to ignore the repo."

## The cure

Pick the author by what it has been exposed to, not by instructing a
context-loaded author to abstain. Sibling:
[`feedback_ask_would_this_be_simpler_if_the_system_changed`],
[`inherited-framing-without-first-principles-check`](inherited-framing-without-first-principles-check.md).
