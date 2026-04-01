---
name: Learning Loop Refinement
overview: >
  Refine the knowledge management loop: unify consolidation and distillation
  into a coherent workflow, and make fitness limits actively managed rather
  than passively observed.
todos:
  - id: ll-audit
    content: "Audit overlap between consolidate-docs.md, distillation SKILL.md, and napkin SKILL.md — map shared responsibilities and gaps."
    status: pending
  - id: ll-unify
    content: "Design a unified learning-loop workflow that replaces the current split between consolidation command and distillation skill."
    status: pending
  - id: ll-fitness-management
    content: "Add active fitness limit management: analyse, refine, split, or extend limits as part of the workflow rather than just reporting."
    status: pending
  - id: ll-implement
    content: "Implement the refined workflow — update or replace consolidate-docs.md, distillation SKILL.md, and napkin SKILL.md as needed."
    status: pending
  - id: ll-review
    content: "Review the refined workflow with subagent-architect and docs-adr-reviewer."
    status: pending
---

# Learning Loop Refinement

## 1. Intent

The agent knowledge management loop has three artefacts that partially
overlap in responsibility:

- **napkin SKILL** — continuous session logging, triggers distillation
  at ~500 lines
- **distillation SKILL** — extracts from napkin to distilled.md,
  mentions graduation to permanent docs
- **consolidate-docs command** — step 7 duplicates distillation
  concerns, step 8 reports fitness but does not act on it

This plan refines the loop into a coherent workflow where graduation
to permanent docs is a first-class operation, not a side-note in two
different files. It also makes fitness limit management active rather
than passive.

## 2. Problems

### 2a. Consolidation and distillation overlap

Step 7 of `consolidate-docs.md` says: "The primary mechanism is
extracting established, well-defined concepts to permanent
documentation." The distillation SKILL says the same thing in §3
(Extract and Prune). Neither owns the process clearly. In practice,
graduation happens ad hoc during either workflow, with inconsistent
triggers and criteria.

### 2b. Fitness limits are passive signals

Step 8 of `consolidate-docs.md` runs fitness checks and reports the
status table. But it does not act on the results — files at ceiling
are reported, not managed. The actual response (split, refine, or
extend the limit) happens informally, if at all. The graduation
round that prompted this plan demonstrated that "approaching limits"
is a trigger for active refinement, not just observation.

### 2c. The false graduation barrier

The distillation SKILL describes distilled.md as holding content "not
yet matured into settled practice." But agent-operational and
domain-specific content IS what the Practice and Directives are for —
the distinction between "not yet mature" and "belongs in permanent
docs" was artificially restrictive. The graduation criteria should be
"stable and useful enough to place," not "no longer agent-operational."

## 3. Proposed Changes

### 3a. Unify the graduation pathway

One workflow, one set of criteria. Whether invoked as distillation
(napkin → distilled.md) or consolidation (distilled.md → permanent
docs), the same graduation criteria apply:

1. Is the entry stable? (Not contradicted by recent work)
2. Is there a natural home in permanent docs?
3. Does the permanent doc have capacity, or should it be split/extended?

### 3b. Make fitness management active

When a file is at or approaching its ceiling:

1. **Analyse** — is the content appropriately dense, or has it
   accumulated low-value entries?
2. **Refine** — compress, deduplicate, remove entries that are now
   covered elsewhere
3. **Split** — follow the file's `split_strategy` frontmatter
4. **Extend** — if the content is genuinely valuable and dense,
   raise the limit with a brief rationale in the frontmatter

The fitness check step should include these options, not just report.

### 3c. Merge or clearly separate the artefacts

Options to evaluate:

- **Merge**: consolidate-docs.md absorbs the distillation SKILL,
  becoming the single learning-loop workflow
- **Layer**: napkin SKILL stays as-is (continuous logging),
  consolidation becomes the single periodic workflow that handles
  both napkin rotation and graduation
- **Separate clearly**: distillation owns napkin → distilled.md,
  consolidation owns distilled.md → permanent docs, with explicit
  handoff criteria

## 4. Open Questions

1. Should the unified workflow be a command, a skill, or both?
2. Should fitness limit changes require an ADR amendment, or is
   frontmatter self-documenting enough?
3. What is the right trigger cadence — session-end, weekly, or
   threshold-based?

## 5. Non-Goals

- Changing the napkin's continuous-logging behaviour
- Removing fitness limits entirely
- Automating graduation decisions (these remain human-validated)
