---
name: napkin
classification: passive
description: >-
  Maintain a per-repo napkin file at .agent/memory/napkin.md that tracks
  mistakes, corrections, and what works. Always active, every session,
  unconditionally. Read distilled.md and napkin.md before doing anything.
  Write to the napkin continuously as you work. Log your own mistakes,
  not just user corrections.
---

# Napkin

Maintain a per-repo markdown file that tracks mistakes, corrections,
and patterns that work or don't. Read it before doing anything and
update it continuously as you work.

**This skill is always active. Every session. No trigger required.**

## Session Start: Read Your Notes

First thing, every session — read both files before doing anything:

1. **`.agent/memory/distilled.md`** — Curated rules, patterns,
   and troubleshooting. This is the high-signal reference.
   Internalise and apply silently.
2. **`.agent/memory/napkin.md`** — Recent session log. Scan for
   context from the most recent sessions.

If neither file exists, create `napkin.md` at
`.agent/memory/napkin.md` with a session heading and start
logging. The distillation rotation in the
[consolidation command](../../commands/consolidate-docs.md)
handles creating `distilled.md` at rotation time.

## Continuous Updates

Update the napkin as you work, not just at session start and
end. Write to it whenever you learn something worth recording:

- **You hit an error and figure out why.** Log it immediately.
- **The user corrects you.** Log what you did and what they
  wanted instead.
- **You catch your own mistake.** Log it. Your mistakes count
  the same as user corrections — maybe more.
- **You try something and it fails.** Log the approach and why.
- **You try something and it works well.** Log the pattern.
- **You re-read the napkin mid-task** because you are about to
  do something you have gotten wrong before. Good. Do this.

## What to Log

Log anything that would change your behaviour if you read it
next session:

- **Your own mistakes**: wrong assumptions, bad approaches,
  misread code, failed commands, incorrect fixes.
- **User corrections**: anything the user told you to do
  differently.
- **Tool/environment surprises**: things about this repo, its
  tooling, or its patterns that you did not expect.
- **Preferences**: how the user likes things done.
- **What worked**: approaches that succeeded, especially
  non-obvious ones.

Be specific. "Made an error" is useless. "Assumed the API
returns a list but it returns a paginated object with `.items`"
is actionable.

## Napkin Structure

Each session gets a heading and subsections:

```markdown
## Session: YYYY-MM-DD — Brief Title

### What Was Done
- (summary of work completed)

### Patterns to Remember
- (actionable insights from this session)
```

Add `### Mistakes Made` or `### Fixes` subsections as needed.

## Rotation

When the napkin exceeds ~500 lines, follow step 6 of the
[consolidation command](../../commands/consolidate-docs.md) to
extract high-signal content into `distilled.md`, archive the
napkin, and start fresh.

## Example

**Early in a session** — you misread a function signature and
pass args in the wrong order. You catch it yourself. Log it
under "Patterns to Remember":

- `createUser(id, name)` not `createUser(name, id)` — this
  codebase does not follow conventional arg ordering

**Mid-session** — user corrects your import style. Log it:

- This repo uses absolute imports from `src/` — always

**Later** — you re-read the napkin before editing another file
and use absolute imports without being told. That is the loop
working.
