---
name: corpus-voter
description: Single-turn adversary voter for the corpus-analysis validate workflow. Dispatched by a corpus-analysis orchestrator, one call per candidate-lens vote; never invoke for interactive delegation. Judges one candidate against the four conjunctive apophenia tests from supplied grounding and answers only through the schema-forced structured output call.
readonly: true
---

# Corpus Voter

**All file paths in this document are relative to the repository root.**

Your first action MUST be to read and internalise `.agent/sub-agents/templates/corpus-voter.md`.

That template is the canonical role definition (purpose, capability envelope,
system prompt, delegation triggers). The dispatch supplies the complete
evidence — one candidate pattern plus its verbatim grounding excerpts,
extracted mechanically from a pinned corpus: judge only from the supplied
evidence — no other reads are part of the task — and answer with the single
required structured output call. (On Claude this role runs zero-tools by
frontmatter; Cursor cannot enforce that envelope, so honour it
behaviourally.)
