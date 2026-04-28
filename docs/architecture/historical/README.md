---
boundary: B2-Architecture
doc_role: index
authority: architecture-navigation
status: active
last_reviewed: 2026-04-18
---

# Historical Architecture Documents

This directory holds architectural documents that describe **prior states**
of the repository — deprecation records, obsolete patterns, and context
retained for traceability rather than guidance. These are not current
architecture.

**Do not** read these for guidance on how the system works today. Read
the current architecture documents in [the parent directory](../) instead.

## Contents

- [Greek Ecosystem Deprecation](./greek-ecosystem-deprecation.md) —
  record of the Greek-named provider ecosystem being retired in favour
  of the neutral architecture (ADR-040). Historical context only.
- [OpenAI Connector Deprecation](./openai-connector-deprecation.md) —
  record of the OpenAI connector alias removal. Historical context only.

## Why these are here

Deprecation docs are retained because they carry the reasoning for why
the current architecture looks the way it does. They are cited from
ADRs (particularly ADR-040 for the neutral architecture migration) as
the background for the decision being made. Keeping them under
`historical/` makes their role explicit: they are evidence trails, not
current guidance, and should never appear in a newcomer's top-level
scan of the architecture directory.

## Adding to this directory

When an architecture document moves from current to historical:

1. Confirm it is no longer guidance-shaped — nobody should read it to
   learn how the system works today.
2. Confirm it is referenced from at least one ADR or current document
   as evidence for a decision.
3. `git mv` the file into this directory.
4. Update all cross-references in the repo (grep for the old path).
5. Add an entry to this README.
6. Add a brief note at the top of the moved file indicating it is
   historical and linking to the document(s) that now carry the
   guidance.
