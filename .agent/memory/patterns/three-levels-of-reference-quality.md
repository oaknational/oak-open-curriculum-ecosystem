---
name: "Three Levels of Reference Quality"
use_this_when: "Documentation, portable content, or cross-repo material references concepts from another context — choose the right level of self-containment"
category: process
proven_in: ".agent/practice-core/ — ADR references replaced with exported concepts for portability"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Portable content that references host-repo-specific artefacts becomes opaque when it travels"
  stable: true
---

# Three Levels of Reference Quality

## Problem

Documentation and portable content references concepts from other
parts of a system. The reference can be opaque, descriptive, or
self-contained. Choosing the wrong level makes the content brittle
or unintelligible when it moves to a new context.

## The Three Levels

1. **Opaque pointer**: "See ADR-144." Requires the reader to have
   access to the host repo's specific artefact system. Fails completely
   in any other context.

2. **Descriptive name**: "The two-threshold fitness model." Better —
   the reader knows what the concept is about. But if they have never
   encountered the concept, the name alone is insufficient. A pointer
   with a better label is still a pointer.

3. **Exported concept**: "The fitness model uses two thresholds:
   a target (where to aim) and a limit (where to act). Content stays
   between them; crossing the limit triggers compression." The
   substance travels with the reference. The reader can act on it
   without access to the original source.

## Pattern

- **Internal references** (within the same repo, same team): Level 1
  is acceptable. The reader can follow the pointer.
- **Cross-team references** (same org, different repo): Level 2
  minimum. The reader may not have access to the source.
- **Portable content** (travels between repos, orgs, or contexts):
  Level 3 required. The content must carry its own meaning.

## When This Applies

- Practice Core and Context files that travel between repos
- READMEs that onboard contributors from different teams
- Architecture decision records that reference external standards
- Documentation that may outlive the artefacts it references
