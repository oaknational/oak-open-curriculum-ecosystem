# Curator Passes

Per-pass **metadata** records of knowledge-curation work in this repo.
Each file documents the structural facts of one curator pass: when, by
whom, what was in scope, what was routed where, what owner decisions
were captured, what carries forward. **Files in this directory do not
store curated content.** Substance lives at its permanent home (PDRs,
ADRs, rules, patterns, directives, skills, napkin, comms events,
archive); pass files point at those homes.

The role key is `curator`. `Knowledge Curator` is the owner-facing
session label for the same role when the knowledge-substrate lane needs
to be unambiguous in team-start, claim, or handoff prose.

The portable doctrine for the curator role lives in
[`PDR-081`](../../../practice-core/decision-records/PDR-081-curator-role-and-substrate-care-lane.md).
The actionable workflow for a single pass lives in the
[`curator-pass` SKILL](../../../skills/curator-pass/SKILL-CANONICAL.md).

## Metadata-only contract

A curator-pass file MAY name:

- pass identity (date, agent, platform, model, session_id_prefix)
- pass kind (e.g. due-drain, second-instance-graduation, defect-surfacing)
- surfaces surveyed (as a table with disposition pointers)
- knowledge routed (as a list of "<concept> → <permanent home>" pointers)
- owner decisions captured (as a table — name + verdict, no substance)
- carry-forward items (as pointers — what the next pass picks up)

A curator-pass file MUST NOT contain:

- the substance of any defect, observation, or insight surfaced
  during the pass (that substance belongs in napkin, comms events,
  or its permanent home)
- the substance of any concept being graduated (that lives at the
  destination PDR/ADR/rule/pattern/directive/skill)
- duplicate copies of substance from anywhere else

If a pass surfaces a substantive observation, the pass file names
*that* observation by short title and points at the comms event /
napkin entry / permanent home that carries the substance.

## File convention

- One markdown file per pass, named `<date>-<agent-codename-kebab>.md`.
- Example: `2026-05-24-vining-fruiting-dew.md`.
- A single agent running multiple passes on one day MAY use one file
  per day with the passes as `##` sections inside it, or one file
  per pass with a numeric suffix.
- Files are write-once across passes; corrections write a new file
  dated the correction day naming the corrected pass.

## Relationship to other surfaces

- `pending-graduations.md` is the buffer the curator drains. It is
  a buffer only, not a permanent location, and carries neither
  curation-work logs nor records of what graduated. Both belong
  elsewhere.
- `napkin.md` carries the curator's session-level observations
  about the substrate. Substance graduates from napkin to permanent
  homes via the standard capture/distil/graduate flow; the curator
  pass is the routing event.
- `repo-continuity.md` carries live operational state. Pass files
  do not duplicate state.
- `distilled.md` carries hard-won rules. The curator routes from
  distilled to permanent homes.
- Comms event stream `.agent/state/collaboration/comms/*.json`
  carries substantive routing events authored during the pass.
  Defect surfacings, adoption-gap findings, and other team-visible
  observations are emitted there. The comms log is read-only for
  curator purposes (owner-stated: preserved for separate mining of
  team-dynamics insights).

## Authority

Subordinate to plans (for scope), `repo-continuity.md` (for current
state), and PDRs/ADRs/rules (for doctrine). Curators do not author
principle-class changes here; PDRs/ADRs/rules remain the authority.

## Rotation

Pass files are individually small (typically tens of lines). The
directory grows linearly. When it exceeds operational scan-cost,
older passes rotate to `archive/curator-passes-<period>/`.

## Migration history

The first three retroactive entries (2026-05-12 Twigged disposition,
2026-05-23 Breezy first + second pass, 2026-05-23 Incandescent third
pass) were authored on 2026-05-24 by the first formal curator pass
under PDR-081. The substance of those earlier passes lives in
`archive/pending-graduations-archive-2026-05-23.md`; the new
metadata-only pass files point at the archive.
