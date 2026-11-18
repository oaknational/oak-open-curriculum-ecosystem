---
name: distillation
classification: active
description: >-
  Distil high-signal patterns from napkin and AGENTS.md into
  distilled.md, then graduate settled entries to permanent
  docs. Handles archival, deduplication, and rotation.
---

# Distillation

Extract actionable rules, patterns, and troubleshooting from
two feeds into a compact, curated reference (`distilled.md`),
then promote settled entries to permanent documentation.

**Trigger**: When `.agent/memory/active/napkin.md` exceeds ~500
lines, or when the user requests distillation.

## The pipeline

Three feeds converge on permanent documentation. Two flow
through `distilled.md` as a staging area; the third flows
directly during consolidation:

```text
napkin.md ──────────┐
                    ├──► distilled.md ──► permanent docs
AGENTS.md ──────────┘    (staging)        (principles.md, AGENT.md,
(learning-loop                             the host's directives,
 landing pad)                              ADRs, PDRs, docs/)
                                               ▲
plans & prompts ───────────────────────────────┘
(ephemeral — mined during consolidation)
```

**Feed 1 — napkin**: Session-level mistakes, corrections,
and patterns logged during active work. Distilled when the
napkin exceeds ~500 lines.

**Feed 2 — AGENTS.md**: Insights mined from conversation
transcripts by the Practice learning loop. `AGENTS.md` is a
landing pad, not a permanent home. Entries are processed
during distillation and replaced with **anchors** — brief
pointers to where the content now lives, preventing the
same insights from being rediscovered and re-added.

**Feed 3 — plans and prompts**: Ephemeral work documents
that accumulate settled knowledge during collaborative
sessions. Mined during consolidation (the `consolidate-docs` skill);
settled content moves directly to permanent docs.

**Graduation**: During consolidation (the `consolidate-docs` skill),
entries in `distilled.md` that have become settled, and
content in plans that now functions as permanent
documentation, are moved to their canonical homes.
`distilled.md` should contain only what is NOT already in
permanent documentation.

## File Layout

```text
.agent/memory/active/
  distilled.md                    # Staging area (read every session)
  napkin.md                       # Current session log
  archive/
    napkin-YYYY-MM-DD.md          # Archived napkins (historical reference)
```

## Distillation Protocol

### 1. Extract

**From the napkin**: Read every "Patterns to Remember",
"Mistakes Made", "Key Insight", and "Lessons" section.
Collect entries that would change behaviour if read next
session.

**From AGENTS.md**: Check for new (non-anchored) entries
added by the Practice learning loop. Move high-signal
entries to `distilled.md`. Replace moved entries in
`AGENTS.md` with anchors. Flag low-signal entries for
review and possible deletion.

**Also check** (for recently added memories):

- `CLAUDE.md`
- `.agent/directives/AGENT.md`

### 2. Merge

Compare extracted entries against existing `distilled.md`.
For each entry:

- **New insight**: Add it to the appropriate section.
- **Duplicate of existing rule**: Skip it — the rule is
  already captured.
- **Refinement of existing rule**: Update the existing entry
  with the sharper formulation.
- **Contradiction**: Investigate. The more recent finding
  usually wins, but verify before overwriting.

### 3. Prune

The distilled file should not exceed about 200 lines. When
it does, move insights into permanent documentation — see
the `consolidate-docs` skill (`.agent/skills/knowledge/consolidate-docs/SKILL-CANONICAL.md`).

Note: **IMPORTANT!** — Do not delete any information, only
move and/or edit. Information loss is unacceptable. If you
are not sure where to put something, ask the user.

Remove from `distilled.md` anything that is now captured in
permanent repo documentation:

- Rules codified in `.agent/directives/principles.md`
- Patterns documented in ADRs or PDRs
- Editorial principles in the host's editorial guidance directive, where it
  keeps one
- Architecture documented in `docs/architecture/`

The distilled file should contain only what is NOT already
in permanent documentation.

### 4. Archive

Move the outgoing napkin to the archive:

```bash
cp .agent/memory/active/napkin.md \
   .agent/memory/active/archive/napkin-YYYY-MM-DD.md
```

Use the current date for the filename.

### 5. Start Fresh

Create a new `.agent/memory/active/napkin.md` with a session heading
documenting the distillation itself.

## distilled.md Structure

Target: under 200 lines of high-signal content. Every entry
earns its place by being actionable.

```markdown
# Distilled Learnings

## User Preferences

## Content and Editorial

## Quality Gates

## Testing

## Documentation

## Troubleshooting
```

Adapt sections to the repo's domain. Add or remove sections
as the project evolves. The structure should make it easy to
find what you need quickly.

## Quality Criteria

A good `distilled.md` entry is:

- **Specific**: "ES client v9 uses `document` not `body`"
  not "ES API changed"
- **Actionable**: tells you what to DO, not just what
  happened
- **Non-obvious**: captures something you would not know
  from reading the code
- **Terse**: one to two lines maximum per entry

A good `distilled.md` overall is:

- Under 200 lines
- Zero redundancy with permanent documentation
- Readable in under 2 minutes
- Updated after every distillation, not between them

## When NOT to Distil

- Do not distil mid-session — the napkin is a working
  document during active work
- Do not distil if the napkin is under 500 lines — there
  is not enough content to justify the overhead
- Do not distil "What Was Done" sections — those are
  session history, not learnings
