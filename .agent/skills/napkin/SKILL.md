---
name: napkin
classification: passive
description: >-
  Maintain a per-repo napkin file at .agent/memory/active/napkin.md that tracks
  mistakes, corrections, surprises, and what works. Always active, every
  session, unconditionally. Read distilled.md and napkin.md before doing
  anything. Write to the napkin continuously as you work. Log your own
  mistakes, not just user corrections.
---

# Napkin

Maintain a per-repo markdown file that tracks mistakes, corrections,
and patterns that work or don't. Read it before doing anything and
update it continuously as you work.

**This skill is always active. Every session. No trigger required.**

## Session Start: Read Your Notes

First thing, every session — read both files before doing anything:

1. **`.agent/memory/active/distilled.md`** — Curated rules, patterns,
   and troubleshooting. This is the high-signal reference.
   Internalise and apply silently.
2. **`.agent/memory/active/napkin.md`** — Recent session log. Scan for
   context from the most recent sessions.

If neither file exists, create `napkin.md` at
`.agent/memory/active/napkin.md` with a session heading and start
logging. The distillation rotation in the
[consolidation command](../../commands/consolidate-docs.md)
handles creating `distilled.md` at rotation time.

## Knowledge Preservation Is Absolute — Fitness Is Never a Constraint

**Writing to shared-state records of knowledge is NEVER blocked by
fitness limits.** This applies to every shared-state knowledge surface:
the napkin, `distilled.md`, `patterns/*.md`, per-thread next-session
records, repo-continuity, the shared communication log, decision
threads, escalations, claims, and any other surface that records what
agents and the owner know together. The rule is to ALWAYS preserve
the knowledge and then flag that the file needs follow-up attention.

The only two valid responses when a write would push a file past its
fitness target or limit are:

1. **Write the full observation and flag the file for attention** —
   record the insight at the weight the signal deserves, add a note
   (`<!-- fitness exceeded by N lines; needs consolidation -->`) at the
   top of the new entry, and let the next consolidation pass route the
   structural pressure.
2. **Thoughtful, holistic promotion of mature concepts and knowledge**
   out of the file to permanent homes — ADRs, PDRs, principles, rules,
   patterns, READMEs, governance docs — applying the
   [`/jc-consolidate-docs`](../../commands/consolidate-docs.md)
   graduation scan (step 7) to specific entries that are stable and
   have a natural permanent home. This is the deeper response: not
   "make space" but "the knowledge has matured enough to leave the
   staging surface."

**What is NEVER valid**:

- Trimming, compressing, or "summarising" the new insight to fit the
  budget. Compressed capture is lossy capture.
- Naively cutting existing entries to make room. Each existing entry
  earned its place; removal is a graduation decision (does it have a
  permanent home?), not a space-making decision.
- Splitting the insight into shorter pieces purely to satisfy a line
  count. Split only when the substance genuinely separates into
  distinct concerns.
- Skipping or deferring the write because the file is full. The file
  being full is a structural signal, not a write veto.
- Drafting a "concise version" alongside the full version and choosing
  which to keep. Drop the budget, not the insight.

Capture is sacred; fitness is a signal that consolidation or
graduation is overdue, never a signal to write less.

**Why**: Owner-named twice in the 2026-04-29 sessions. First during
the TS6 migration session: the agent truncated a napkin entry because
the file was at 282/300 lines and pointed to deeper artefacts as a
substitute. Second during the consolidation refresh: "writing to the
napkin, distilled, and similar records of shared state is NEVER
blocked by fitness function limits, the rule is to ALWAYS preserve
knowledge, and then flag that the file needs follow-up attention;
never write less to stay under a limit, never naively cut content,
the only valid approach is a thoughtful and holistic promotion of
concepts and knowledge."

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
- **Something surprises you.** Capture the expectation failure while it is
  still fresh.
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
- **Practice/tooling feedback**: frustrations, friction, surprises,
  insights, ideas, wishlist items, or general impressions from using the
  Practice or a host-local tool that implements a Practice capability. In
  this repo that includes `agent-tools`; in other repos it includes the
  equivalent local implementation surface.
- **Positive surprises**: cases where a simpler or stronger approach
  worked better than expected.
- **Preferences**: how the user likes things done.
- **What worked**: approaches that succeeded, especially
  non-obvious ones.

Be specific. "Made an error" is useless. "Assumed the API
returns a list but it returns a paginated object with `.items`"
is actionable.

## Surprise Format

When something surprises you, capture it with this shape:

```markdown
### Surprise

- **Expected**: what you thought would happen
- **Actual**: what actually happened
- **Why expectation failed**: what was wrong or incomplete in the mental model
- **Behaviour change**: what you should do differently next time
- **Source plane**: `active` | `operational` | `executive` (optional — see
  Cross-Plane Origin Tag below)
```

Use this for both negative and positive surprise. If a surprise keeps
reappearing, it is a candidate for `distilled.md`, a reusable pattern, a
governance update, or an ADR.

### Cross-Plane Origin Tag (optional)

`Source plane: <plane>` is an optional origin tag naming the memory plane
whose content the observation is *about* (per the three-plane taxonomy in
[`.agent/directives/orientation.md`](../../../directives/orientation.md#layers)
and [PDR-030 Plane-Tag Vocabulary](../../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md)).

- **`Source plane: executive`** — the observation is about an
  executive-memory surface (artefact inventory, reviewer catalogue, adapter
  matrix, surface matrix, stable canonical paths). Routes through the
  executive-memory feedback loop defined in
  [PDR-028](../../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md).
  See [`.agent/rules/executive-memory-drift-capture.md`](../../../rules/executive-memory-drift-capture.md)
  for when the tag is required.
- **`Source plane: operational`** — the observation is about continuity
  state (thread next-session records, track cards, repo-continuity
  contract). Routes through `/session-handoff` refresh of the affected
  surface.
- **`Source plane: active`** — default when the observation is about
  learning-loop content (other napkin entries, distilled, patterns). Can be
  omitted as the napkin is itself an active-plane surface.

The origin tag is consumed at `/jc-consolidate-docs` step 5 cross-plane
scan; it does not mutate anything at capture time. Omit the field when the
observation is purely active-plane.

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
