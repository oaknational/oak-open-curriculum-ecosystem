# Owner communication-preference candidates — pending owner review

**Status:** pending owner review (do not graduate or reject without owner decision).
**Assembled:** 2026-06-16, Snapper binds Coral, during the graduation drain.
**Why this doc exists:** the owner asked for all owner-comms-preference candidate
content to be extracted into one place for review, because it is unclear whether a
durable home is needed at all. These items encode the owner's own communication
preferences — only the owner can graduate or reject them. This doc is neutral
presentation, not a recommendation.

## Source

All three candidates originate from the same artefact:
`.agent/plans/agentic-engineering-enhancements/current/claude-insight-report-2026-05-10-disposition.plan.md`
(items 10, 19, 21), with the raw report under the gitignored
`.agent/reference-local/claude-insight-reports/`. They were held in
`pending-graduations.md` as two owner-gated entries; this doc supersedes those
register entries (which route here).

## The candidates

| # | Candidate | Substance | Verification against `user-collaboration.md` |
|---|-----------|-----------|-----------------------------------------------|
| 1 | Affirmation-phrase corpus | How to read the weight of positive feedback: phrases such as "exactly", "great", "perfect" may calibrate agent confidence **without** acting as re-grounding triggers. Observational. | Not enumerated; the existing course-correct vocabulary note partially overlaps. |
| 2 | Want / Don't reply table | A compact, two-column statement of communication preferences (what the owner wants in replies, what to avoid), intended to aid agent drafting at a glance. | Partial overlap with §Working Model; the compact table form is not present. |
| 3 | Default reply shape | "Lead with the answer", "one sentence of evidence", "no trailing summary". | Confirmed **absent**: `user-collaboration.md` §Working Model overlaps in spirit but does not enumerate this compact shape. |

## What graduating would mean

- Candidates 2 and 3 would most naturally become a short, named subsection of
  `.agent/directives/user-collaboration.md` (a compact reply-shape + want/don't
  table) that every agent reads at session open.
- Candidate 1 would become an observational note on reading affirmation weight —
  smaller, and closest to existing course-correct guidance.

## The open question for the owner

Is a durable, enumerated form **useful** (a compact shape genuinely aids agent
drafting and reduces mis-pitched replies), or does enumerating communication into a
fixed template **over-specify** and risk a rigid, menu-like voice that works against
adaptive, genuine communication? This is the owner's call. Three dispositions are
available per candidate: **graduate** (author the home), **reject** (the implicit
§Working Model doctrine is enough), or **refine the wording** before either.
