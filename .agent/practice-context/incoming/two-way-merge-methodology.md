# Two-Way Merge Methodology for Practice Integration

**Origin**: oak-open-curriculum-ecosystem, 2026-03-23
**Context**: Discovered during deep integration of 8 evolution rounds from
pine-scripts (index 8) and algo-experiments (indexes 9–15)

## The Problem

When both the sender and receiver have evolved independently since the last
common ancestor, the Integration Flow (practice-lineage.md §Integration Flow)
describes a one-way process: read the incoming, compare, adopt or reject. It
does not describe how to handle a **two-way merge** where the local Practice
has also evolved.

In our case:
- The incoming carried 8 rounds of structural innovation (provenance
  extraction, fitness rename, strict-completeness, tiering, etc.)
- The local Practice had independently added two principles (architectural
  excellence, layer role topology) and a diagnostic framework (Practice
  Maturity)
- Naively patching the local files with incoming changes would require
  tracking every delta across 500+ line files
- Naively replacing local files with incoming would lose local additions

## The Method

**Start from the incoming, merge local additions back.**

This is more reliable than patching because the incoming files carry the
cumulative evolution as a coherent whole. The steps:

1. **Backup** the local Practice Core (safety net for diffing)
2. **Copy the incoming trinity files** over the local ones
3. **Identify local-only additions** by diffing backup against the
   incoming's last common ancestor (the provenance chain tells you which
   index that is)
4. **Re-add local additions** to the incoming base — principles to
   §Principles and §Always-Applied Rules, structural sections to their
   correct positions, local adaptations to the artefact map
5. **Append a new provenance entry** recording the merge
6. **Verify nothing was lost** by diffing the backup against the result
7. **Run fitness checks** — two-way merges frequently push
   practice-lineage.md over its character ceiling because both sides added
   content

## Why This Order

The alternative — patching local files with incoming changes — requires
understanding every delta in the incoming files and applying them
individually. With 8 evolution rounds touching every section, this is
error-prone. The incoming files are already internally consistent (they
were evolved together). Starting from them preserves that consistency.

## Operational Learnings

- **practice-lineage.md is the bottleneck.** Both sides tend to add
  Learned Principles and §Principles entries. After our merge,
  practice-lineage.md was at 31964/32000 characters. The tiering mechanism
  (axioms vs active) was designed for this, but the practical pressure
  arrives faster than expected when both sides add to the same section.
- **The fitness rename has wide blast radius.** Renaming
  `fitness_ceiling` → `fitness_line_count` touched 11+ files beyond the
  trinity: directives, distilled.md, outgoing context, CONTRIBUTING.md,
  docs/foundation/, the validation script, and the consolidation command.
  Grep thoroughly before declaring the rename complete.
- **Handover prompts are invisible to the incoming.** If your repo uses
  `.agent/prompts/` for domain-specific stateful content, the incoming may
  have removed that category. Check the artefact map and workflow section
  before accepting the replacement.

## Proposed Practice Core Update

Consider adding a "Two-Way Merge" subsection to §Integration Flow in
practice-lineage.md:

> When the local Practice has also evolved since the last common ancestor,
> start from the incoming files (they carry cumulative evolution as a
> coherent whole) and merge local additions back. Verify by diffing the
> backup against the result. Fitness checks are mandatory — two-way merges
> frequently push files over their ceilings.
