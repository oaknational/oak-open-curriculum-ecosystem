---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested `distilled.md` processing through
  `oak-consolidate-docs`: the 2026-05-14 multi-agent deep-dive and 2026-05-17
  gate-stack entries graduated to permanent behavioural homes. The active file
  now carries only the conservation role, graduation pointers, and held
  validation entries; the larger 2026-05-17 envelope has served its purpose.
  Falsifiability: if future napkin rotations add high-signal learning that has
  no stable permanent home, preserve it first and revise the envelope by
  substance rather than trimming the lesson.
---

## 2026-06-01 — archived means archived: remove references, don't repoint (Hearthlit Stoking Cinder)

When quarantining a plan/doc to `archive/`, the live estate must STOP referencing
it — remove the references (delete frontmatter pointers; de-link prose to plain
text), never repoint them into the archive. Repointing N live references at the
archived copy is the "no redirects" anti-pattern: it keeps the archive
load-bearing in live navigation and dissolves the live/archived boundary. The
single sanctioned inbound pointer is ONE archive-index note (`completed-plans.md`)
recording where it went and what supersedes it. Caught mid-execution this session
(owner: "archived means archived … not a bunch of links that dissolve the meaning
of /archive/") after I had planned a uniform repoint. May merit a rule or PDR
("archive is a terminal sink; one index note; no live→archive redirects"). Source:
graph-spine quarantine, commit `5063456a`.

## 2026-05-31 — repair of invalid active-distilled archive move

The prior source-buffer pass moved this active register into
`archive/distilled-2026-05-31-eclipsed-source-processing.md`, replaced the active
file with a pointer, then deleted the failed archive copy during repair. That hid
live buffer content before an acceptable item-level disposition proof existed.
The content is restored here after owner correction. Do not archive or replace
this active buffer again unless every item has a valid `graduated`, `duplicate`,
`owner-gated`, or `stale-withdrawn` disposition under `consolidate-until-done`.

## 2026-05-31 — trace user value before tool design (EEF reframe, Fruited Regrowing Copse)

Trace the user journey and its value end to end before committing to a tool
design; ask "does the data support this value?" at each hop, not "can we build
this tool?" The EEF tools as first envisioned were impossible — they keyed on
curriculum subject/topic, but EEF strands carry no subject/topic axis, so the data
never supported the join. Months of data-shape engineering went into a tool that
could not deliver value: the data-shape work was the tail wagging the dog. Cure:
front-load the value/user-journey trace as a standing design-time guard (live
instance: `eef-value-trace.codex-brief.md`). Platform-memory mirror:
`feedback_trace_user_value_before_tool_design`.

**Deleting failed content is a contamination vector (2026-06-01, eef thread).**
When archiving or removing wrong/superseded work, default to saving NOTHING from
it; anything carried into a live doc must independently re-ground — cite a real
source-of-truth path, or be tagged agent-side — never trusted because it was in
the old artefact. A fabricated key-stage→phase concept rode out of a deleted EEF
prompt into the ratified plan, cross-cited to a real finding to look grounded,
caught only by chance. Pairs with no-tombstones: the corrective reframe must be
genuinely positive, not a negation of the removed thing (caught fixing a tombstone
with a tombstone this session). Auto-memory mirror:
`harvest-from-deleted-is-contamination-vector`.
