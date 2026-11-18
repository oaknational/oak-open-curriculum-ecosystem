---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Thread: upstream-api-alignment

**Purpose**: Bring the Oak Open Curriculum ecosystem into alignment with the evolving
upstream Oak API + bulk export, and establish a repeatable, observable alignment process.
Trigger instance (2026-06-30/07-01): upstream added a `programmes` resource family (5 GET
endpoints + 5 schemas).

## Where the current state is

PAUSED 2026-09-06 by the fork ruling: no Oak-surface access from this line. The process the
thread set out to establish is a permanent runbook, `docs/engineering/upstream-api-alignment-runbook.md`,
registered in the Runbook Index; the plans are the sequencing authority for anything that
reactivates: `.agent/plans/delivery/upstream-update-lane-completion.plan.md` (the lane's resume
map; ADR-222 governs the bulk schema), `.agent/plans/delivery/lesson-search-freshness-and-error-envelope.plan.md`
(bucket 1, ratified 2026-08-12; slice 1 shipped as PR #871, slices 2 and 3 mapped), and the
lesson-retrieval gap analysis `.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md`
(the owner-decision-gated items in its routing section). Buckets 2 and 3 remain unratified
sketches. The binding owner constraint on type-layer work is kept below verbatim.

The journal from 2026-07-01 to 2026-09-07 (the programmes-family alignment on PR #291, the
bulk-ingest feasibility and the MCP-152 to MCP-153 arc, the 2026-08-03 upstream update lane,
the owner-private direction paper, the lesson-retrieval analysis and bucket rulings of
2026-08-12, MCP-590's slice 1, the thread-sequences change of 2026-09-03) was curated on
2026-09-20 by graduate, then archive. The whole pre-curation record is preserved at
`.agent/memory/operational/archive/upstream-api-alignment-thread-2026-09-20.md`, byte-identical
to the record committed at `SHA:dd372846f` (blob `37ae03883`). It was read by the split method
(one analyst, the join by grep; the head runs newest first and the tail oldest first). Its
lessons were found homed before the move: the runbook itself; "a thread is a tag; a tag needs
no order of its own when the thing it tags is already ordered" in ADR-086, ADR-123 and ADR-196
as amended; the documented-alignment-never-a-blind-expectation-edit disposition in the runbook;
the restricted-exclusion switch in the bucket 1 plan; the direction paper's handling in
`.agent/reference-local/` (owner-private).

## Landed arcs (the journal's sections, by their landings)

- The programmes family (2026-07-01): PR #291 merged; the runbook registered.
- Bulk ingest and search (2026-07-27, Swallow guards Tailwind): the reasonable-minimum bridge
  determined on MCP-153; PRs #584, #588, #589 merged; the index promoted (v2026-07-27-132106).
- The upstream update lane (2026-08-03/04, Birch holds Seedling then Galaxy weaves Latitude):
  ADR-222 landed at `SHA:612e60fe0`; MCP-462 delivered as draft PR #735 (its merge is not
  recorded in this line's history); #754 merged; responsibility passed whole to the Director.
- Lesson retrieval (2026-08-12): the gap analysis landed; the owner ratified bucket 1 only;
  slice 1 shipped as PR #871 and the seat closed, the lane carded to the Director (claim
  `2d76cc84`; the MCP-590 resume map was §COMPACTION FREEZE 10 of the director-handoff record,
  now in `archive/director-handoff-current-handoff-state-2026-09-08.md`).
- Thread sequences in curriculum order (2026-09-03/07): PR #965 (MCP-681) merged upstream as
  release 1.178.6 via sync #90; PR #966 (MCP-682) as release 1.181.1 (`SHA:216e64c15`).

## Open items the journal named, with no other home

1. The MCP pagination-header gap (P1, ADR-shaped): expose the next-page signal in the tool
   result, or strip the Link-header sentences at the generator; this record is the owning
   record; do not re-solve per tool. Confirmed still open, post-release (2026-08-03).
2. Two apparent upstream slug collisions treated as bug-report candidates, not cured (one
   Spanish unit tagged `meaning-and-purpose`, otherwise RE; one English unit tagged
   `nouns-and-determiners`, otherwise MFL), and `/threads/{slug}/units` advertising a
   `unitOrder` its payload omits (2026-09-03).
3. `editorial-tone.md` owes a scope-list clause for the internal decision-paper class (owner,
   2026-08-12, verbatim: "contractions are fine, but editorial flow is more important"); not yet
   made, and a directive edit.
4. The comms-routing CLI fix, the F-41-tail plan
   `.agent/plans-backlog-2026-07/agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`,
   awaits pickup on the primary checkout (2026-07-26).
5. Upstream items held as questions with evidence, not filed: the KS4-science subject-gate
   collateral question, the transcript-500 and quiz-silent-empty defects, optional
   message-differentiation restoration, spec vocabulary enumeration; the reporter reply sketched
   in the gap analysis was not sent (2026-08-12).

## 2026-08-03 ~08:45Z — BINDING lane constraint (owner word, verbatim-critical; Magnetar binds Oblivion, 74d914)

Owner, on the spec-alignment findings: "please be very careful before chasing
any type issues, there are correct and non-trivial approaches here, and I
will work with you to identify and apply them." BINDING on the lane: the
type-layer legs (the z.toJSONSchema examples round-trip contract, the
KeywordsResponseSchema promotion's generated types, anything in the zod/
openapi-zod-client-adapter layer) are OWNER-COLLABORATIVE — identified and
applied WITH him, never autonomously cured. The non-type legs (override
re-evaluation needs the live-API semantics probe first; served-tool-table
artefact regen) wait for routing. The probe worktree (upstream-spec-probe,
refreshed cache + regen uncommitted) is the lane's opening state; this
constraint rides any routing brief VERBATIM. (Homed from the napkin at the
2026-08-07 consolidation; the constraint was captured 2026-08-03 and had no
thread-record presence until now.)

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Vanilla stirs Spore | claude | claude-opus-4-8[1m] | 807471 | implementer | 2026-07-01 | 2026-07-01 |
| Katydid seeks Moonbeam | claude-code | claude-fable-5 | 477cba | status-verifier (drive-by) | 2026-07-06 | 2026-07-06 |
| Swallow guards Tailwind | claude-code | claude-fable-5 | 805902 | implementer — MCP-152/153 concept exploration + execution | 2026-07-26 | 2026-07-26 |
| Birch holds Seedling | claude-code | claude-fable-5 | e48fe2 | implementer — the 2026-08-03 upstream update lane (MCP-462/463/464); continues across a compaction boundary | 2026-08-03 | 2026-08-03 |

**Predecessor (identity fields not fully recorded):** *Bonfire turns Basalt* authored the
plan + process notes and landed WS0 (programmes regen) and WS1 (cached-schema-default,
`79364bbd1`), then handed the successor tasks to Vanilla stirs Spore via the plan's handoff
section (2026-07-01).
