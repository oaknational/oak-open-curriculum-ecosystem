# Cross-Repo Transfer: Operational Lessons

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Source evidence**: pine-scripts integration and final preservation sweep
> **Status**: Reference material for future Practice transfers

## Purpose

Operational knowledge for anyone performing a cross-repo Practice transfer —
whether hydration (installing a living Practice) or preservation (retaining
source knowledge during separation). These lessons are about the *mechanics*
of transfer, not the Practice's structure.

## Lessons

### 1. The obvious material is not the most valuable material

First-pass transfers gravitate towards strategic documents and incoming notes.
The final preservation sweep showed that the highest-value material often lives
elsewhere: distilled memory, code patterns, plan templates, and scoped work in
`current/` or `active/`. Preservation checklists should explicitly include
these.

### 2. Same-named directories may have diverged

Do not infer equivalence from shared directory names. If the receiving repo
already has `practice-core/`, compare the contents directly — both repos may
have evolved the same-named files independently. Preserve or diff source
snapshots deliberately when divergence matters.

### 3. Content preservation is not link-complete mirroring

A content snapshot preserves knowledge but not navigability. Copied files will
reference ADRs, docs, and paths that don't exist in the receiving repo. State
this explicitly in any bundle's README so readers treat it as reference, not a
self-contained clone.

### 4. Preservation bundles need an index

Once imported material exceeds a handful of files, add a local README
explaining: what was preserved, what to mine first, what to use selectively,
and what limitations remain. Without this, preservation becomes cold storage.

### 5. Three-state promotion model

Seeded material should move through explicit states:

1. **Received** — present in incoming, not yet reviewed
2. **Promoted** — integrated into local canon
3. **Rejected** — deleted with rationale recorded

This prevents a permanent "shadow layer" of half-adopted infrastructure.

## When to consult this document

- Before performing a cross-repo Practice transfer
- When building a preservation bundle from a repo that will be archived
- When a receiving repo is unsure whether imported material has been fully
  processed
