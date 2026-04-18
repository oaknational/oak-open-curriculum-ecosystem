---
pdr_kind: governance
---

# PDR-023: Documentation Structure Discipline — README as Index

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(plan documents follow the substance-before-fitness discipline;
this PDR defines the role separation between plans and their
index READMEs);
[PDR-016](PDR-016-claim-propagation-and-reference-quality.md)
(documentation propagation avoids drift; index/content separation
is one mechanism).

## Context

Plan directories, artefact collections, and documentation roots
typically carry a `README.md` as the entry point. Over time, the
README accumulates content beyond its natural role:

- Session-specific instructions ("for the next session, open the
  X plan and start at step Y").
- Outcome narratives ("the Phase 2 pass closed with these
  findings; the patterns extracted were...").
- Design rationale that duplicates content in the plans it
  indexes.
- Cross-tranche context that rots when tranches complete or move.

The accumulation produces two degradations:

1. **Index bloat**. The README grows beyond its role as an entry
   point; readers looking for a quick orientation receive a wall
   of narrative instead of a navigation surface.
2. **Staleness across tranche boundaries**. When a plan is
   promoted, archived, or completed, narrative content in the
   README about that plan becomes inaccurate. Table-row updates
   propagate cleanly; narrative rewrites do not. The README's
   narrative drifts from the plan state it purports to describe.

Underlying cause: the README is a convenient place to add
context; each addition seems locally justified; the cumulative
effect is an index that has ceased to index.

## Decision

**Every `README.md` serving as an index — in a plan directory, an
artefact collection, or a documentation root — is **strictly** an
index file. It lists, links, and navigates. It does not carry
plan content, outcome narratives, or design rationale that belongs
in the artefacts it indexes.**

### What an index README contains

An index README's legitimate content:

- **One-line domain description**: what this directory is for.
- **Table of artefacts**: name (linked) + one-line status or role.
- **Companion material**: links to templates, research notes,
  related directories.
- **Next-session entry point** (where applicable): a pointer —
  not a procedure — to the current-best starting place.
- **Recent archive links** (optional): the last few completed or
  superseded items, for continuity; full archives live in their
  own directory.

### What an index README does NOT contain

Content that belongs elsewhere:

- **Plan content** (phases, acceptance criteria, design rationale,
  session instructions) → lives in `.plan.md` files.
- **Outcome narratives** (what the phase produced, what patterns
  emerged) → lives in evaluation artefacts, research notes, or
  consolidation reports.
- **Design rationale** (why the architecture is this shape) →
  lives in ADRs, PDRs, or the plan's own rationale section.
- **Session instructions** (the specific steps for the next
  session) → lives in session continuation prompts or the active
  plan itself.
- **Cross-tranche context** (summaries of multiple plans' state)
  → lives in a consolidation report, a strategic index, or a
  roadmap document — not in the per-directory README.

### Update discipline

When a plan in an indexed directory is promoted, archived, or
completed, the README update is a **table-row edit**, not a
content rewrite. If the update requires rewriting narrative, the
narrative was in the wrong place to begin with.

### Applying beyond plan directories

The principle generalises beyond `.agent/plans/`. Any
directory-level `README.md` serving as a navigation surface
follows the same discipline:

- `.agent/memory/patterns/README.md` indexes patterns; substance
  lives in pattern files.
- `.agent/practice-core/decision-records/README.md` indexes PDRs;
  substance lives in PDRs.
- A package-level `README.md` indexes the package; substance lives
  in code, TSDoc, and any package-specific architecture docs.

Exception: **documentation roots that are themselves the
substance** (e.g. a standalone `CONTRIBUTING.md`, a
repository-root `README.md` that serves as the project's primary
introduction to external readers). These are not indexes; they
are their own artefact. The discipline applies to READMEs whose
role is navigation within a directory, not project-facing
introduction documents.

## Rationale

**Why the index/content separation matters.** An index answers
"what is here?" — a navigation question. Content answers "how
does this work?" / "why is it this way?" / "what happens next?"
— substance questions. Conflating them produces a document that
fails both roles: too much detail to serve as an index, too
scattered to serve as substance.

**Why narrative drifts but tables don't.** A table row with a
status field can be updated by editing one cell. Narrative about
the same plan requires re-reading, re-phrasing, re-positioning in
the prose. The update cost is different by an order of magnitude;
under update pressure, the narrative is the thing that doesn't
get updated.

**Why documentation roots are an exception.** The repo's
external-facing `README.md` serves humans arriving cold; its role
is introduction, not internal navigation. The same discipline
would under-serve that role. The exception is explicit.

Alternatives rejected:

- **Allow narrative in READMEs freely.** Produces the observed
  drift.
- **Forbid READMEs entirely.** Loses the entry-point function.
- **Maintain narrative with heavy discipline.** Works in theory;
  fails in practice because the discipline has no automatic
  enforcement mechanism short of reviewer invocation.

## Consequences

### Required

- Every directory-level README used as a navigation surface is
  strictly an index: tables, links, one-line descriptions.
- Promotions, archives, and completions update the README via
  table-row edits, not content rewrites.
- Narrative, rationale, and session instructions live in the
  artefacts they describe, not in the indexes.

### Forbidden

- Session-specific instructions in directory READMEs.
- Design rationale duplicated between a README and the ADR or
  PDR it describes.
- Outcome narratives accumulating in plan-directory READMEs.

### Accepted cost

- Index READMEs look sparse compared to content-heavy ones.
  Sparseness IS the intent; it is not a defect.
- Some readers will want to find narrative in the README and
  instead follow a link. The link cost is lower than the drift
  cost.

## Notes

### Host-local context (this repo only)

Proven instance retained with `related_pdr: PDR-023`:

- `.agent/memory/patterns/readme-as-index.md` — Plan architecture
  refactor (2026-03-23, algo-experiments); READMEs had
  accumulated session instructions and outcome narratives that
  drifted across tranche boundaries; the index-only discipline
  prevented the drift after refactor.
