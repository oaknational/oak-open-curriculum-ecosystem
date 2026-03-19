# Cross-Repo Preservation Lessons

> **Date**: 2026-03-19
> **Source**: Final preservation sweep before removing `oak-mcp-ecosystem`
> **Status**: Analysis note only

This note captures what the final preservation sweep taught about preserving
agent infrastructure from one repo into another when the source repo is about
to disappear.

## Confirmed Lessons

### 1. Future strategy docs are not enough

The first preservation pass copied the obvious strategic material:
`practice-context/incoming/` and `agentic-engineering-enhancements/future/`.
That was useful, but incomplete.

The final pass showed that some of the highest-value material lived elsewhere:

- `agentic-engineering-enhancements/current/` and `active/`
- plan templates and components
- distilled memory and code patterns
- the source repo's Practice Core snapshot

The practical lesson is that "future plans + incoming notes" is too narrow as a
preservation heuristic.

### 2. Same-named collections may have diverged materially

It was tempting to assume that `pine-scripts/.agent/practice-core/` already
contained what mattered from oak's `practice-core/`, because the collection
already existed locally.

That assumption was wrong. The local copy had already diverged. Preserving the
oak snapshot separately was necessary to avoid losing source-state knowledge.

The lesson is simple: do not infer equivalence from shared directory names.
Compare before deciding not to preserve.

### 3. Distilled memory and templates are preservation hot-spots

The late discoveries were not obscure implementation files. They were:

- `memory/distilled.md`
- `memory/code-patterns/`
- `plans/templates/`

These are easy to overlook because they sit outside the most obviously
"strategic" folders, but they contain highly reusable operational knowledge.

### 4. A preservation bundle needs its own index

Once the imported material grew beyond a handful of files, it became important
to add a local `README.md` explaining:

- what was preserved
- what to mine first
- what should be used selectively
- what limitations remain

Without that, preservation risks turning into cold storage.

### 5. Content preservation and link-complete mirroring are different tasks

The final local bundle preserved the useful source material, but many copied
files still point at oak ADRs or oak-specific docs that were not mirrored
because they were too repo-specific.

That is acceptable if the bundle is treated as a reference snapshot, not as a
standalone clone. The important lesson is to state this explicitly so later
readers do not mistake a content snapshot for a self-contained mirror.

## Implications for Oak

These are implications, not mandatory actions:

- if oak is used again as a source substrate, preservation checklists should
  include `current/`, `active/`, templates, distilled memory, and code patterns
- future cross-repo transfer guidance may benefit from an explicit "preserve vs
  promote" distinction
- where a receiving repo already has local equivalents, verification of
  divergence should happen before deciding not to copy source snapshots
