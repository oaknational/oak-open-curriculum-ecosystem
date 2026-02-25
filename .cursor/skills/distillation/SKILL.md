---
name: distillation
description: >-
  Extract high-signal patterns from the napkin into a curated
  distilled.md rulebook. Triggered when the napkin exceeds
  ~800 lines. Handles archival, deduplication, and rotation.
version: 1.0.0
date: 2026-02-16
---

# Distillation

Extract actionable rules, patterns, and troubleshooting from
the session napkin into a compact, curated reference. This
skill complements the [napkin skill](../napkin/SKILL.md).

**Trigger**: When `.agent/memory/napkin.md` exceeds ~1,200
lines, or when the user requests distillation.

## File Layout

```text
.agent/memory/
  distilled.md                    # Curated rulebook (read every session)
  napkin.md                       # Current session log
  archive/
    napkin-YYYY-MM-DD.md          # Archived napkins (historical reference)
```

## Distillation Protocol

### 1. Extract

Read every "Patterns to Remember", "Mistakes Made", "Key
Insight", and "Lessons" section from the outgoing napkin.
Collect all entries that would change behaviour if read next
session.

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

### 3. Extract and Prune

The primary mechanism for keeping `distilled.md` within size
constraints is **extracting established concepts to permanent
documentation** (ADRs, `/docs/`, READMEs), then removing the
entry. Permanent docs are discoverable without specialist
knowledge; `distilled.md` is a specialist refinement flow and
should hold only what has NOT yet matured into settled practice.

For each entry, ask: has this pattern become established enough
to belong in a permanent doc? If so, create the permanent doc
first, then remove the distilled entry. Common destinations:

- Rules codified in `.agent/directives/rules.md`
- Patterns documented in ADRs
- Tooling documented in `docs/engineering/build-system.md`
- Domain knowledge documented in architecture docs
- Workspace-specific gotchas in workspace READMEs

Also remove entries that are already captured in existing
permanent documentation — no duplication across the two tiers.

### 4. Archive

Move the outgoing napkin to the archive:

```bash
cp .agent/memory/napkin.md \
   .agent/memory/archive/napkin-YYYY-MM-DD.md
```

Use the current date for the filename.

### 5. Start Fresh

Create a new `.agent/memory/napkin.md` with a session heading
documenting the distillation itself.

## distilled.md Structure

Target: under 200 lines of high-signal content. Every entry
earns its place by being actionable.

```markdown
# Distilled Learnings

## User Preferences
## Repo-Specific Rules
## TypeScript and Type Safety
## Elasticsearch
## Testing
## TSDoc
## Documentation and Markdown
## Architecture
## Domain Knowledge
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
- Do not distil if the napkin is under 600 lines — there
  is not enough content to justify the overhead
- Do not distil "What Was Done" sections — those are
  session history, not learnings
