---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Next-Session Record — `mcp-submission-drive`

> **Record created 2026-08-13**, at the drive's first wrap. The thread had been
> named in claims and comms since 2026-08-06 with **no record on disk** — five
> Director seats used it as a coordination key while its index of homes lived
> only in dead session context. That gap is this record's founding reason.

## Where the current state is

PAUSED 2026-09-06 by the fork ruling: no Oak-surface access from this line. The drive's board
(`MCP App: First Major Release`, target 2026-09-06), its tickets, the owner's asks and the
vendor consoles live on Oak's Linear, GitHub, Sentry, Pingdom and Cloudflare, and no seat on
this line acts on them. The open items the record carried at its last update (2026-08-18: the
connector-submission witness MCP-178, the uptime-provider spike MCP-614 and its dependants
MCP-597, MCP-493 and MCP-544, the carousel check MCP-458, the false M6 description, the two
reviewer billing limits, the plaintext token in a process list, MCP-617's Cloudflare scope) are
history in the archive; a seat on the Oak line recomputes each from the board, never from here.
Landed in the drive's window: #878 (MCP-580, the canonical `/healthz`, live), #880, #882
(`SHA:d5ee6dd2d`, this record's first landing), #883, #902 (`SHA:3002f4476`: the action-class
split in `bot-identity-on-third-party-systems` and the operator-local tier), #903 (this record's
second landing) and #906 (`foreign-board-write-discipline`).

The journal from 2026-08-13 to 2026-08-18 (the coverage map of the human OKR project, the index of
homes, the two wraps of 2026-08-17, the owner boundary of 2026-08-18, the MCP-611 reasoning
record, the next safe steps) was curated on 2026-09-20 by graduate, then archive. The whole
pre-curation record is preserved at
`.agent/memory/operational/archive/mcp-submission-drive-thread-2026-09-20.md`, byte-identical to
the record committed at `SHA:52c376002` (blob `8da54753e`). It was read by the split method (two
analysts, the join by grep). Its lessons were found homed before the move: the owner boundary
(links and status yes, descriptions and comments no) in `foreign-board-write-discipline`; the
action-class split and the minted token in `bot-identity-on-third-party-systems`; board state is
not work state as §Earlier instances of the `signal-read-as-fact` pattern (landed with this
curation); the zero from a filtered query and its control probe in
`observer-must-see-the-terminal-state`; the `…Z` timestamp against a local wall-clock in
`liveness-heartbeat-cron` and `re-derive-session-persistent-state`; a git identity is not a
session in `agent-collaboration.md`; the suppressed stderr in `comms-all-channels-watcher` and
`exit-codes-in-band-never-piped`; the spawn-built worktree in the start-right workflow §8 and
F-90; a review re-request verified on the new tip in `pr-lifecycle`; the `/mcp` accept gate's
406 in the health-endpoints integration test. The standing traps below are kept in the record's
own words as the drive's distilled set.

## Lessons with no other home (the record's words, 2026-08-13 to 08-18)

- Route anything the owner must do the same day it is discovered, never batched: an item held
  to Friday afternoon cost nine days; re-dating without answering produces schedule pressure
  without reducing risk.
- A precedence claim that names a position ("the block above") rather than a date inverts as
  soon as the document grows.
- Assignee is owner-of-record, not ownership of the doing.
- Vendor inventory lives only in the owner's head, so no amount of in-repo rigour reaches it:
  when writing a universal negative about the estate, put the scope in the sentence and ask.
- Prove a vendor check ran from its check history, never from a config field: a Sentry detector
  read `disabled` in one field while its `uptimeStatus` still read `ok`, and only the history
  (`period=7d` → "No checks found") showed it had never run.
- Exception trackers report crashes, not attacks: abuse is a flood of successful 200s emitting
  no error event, so Sentry structurally cannot see it (the MCP-611 → MCP-617 reasoning).

## Standing traps this thread has paid for

- **`agent-tools spawn`, never raw `git worktree add`.** Measured across four
  worktrees: spawn-created ones pass the pre-commit gate; a hand-rolled one
  cannot, and the failure presents as a `next/font/google` build error.
- **`gh` is authenticated as the owner even though git is ambient emgeebot.** A
  bare `gh pr create` authors as `mantagen` and silently drops the reviewer
  request, leaving the code-owner gate unsatisfiable. Mint a token; verify with
  `--json author,reviewRequests`. Five instances to date.
- **A non-existent path under `/mcp/` returns 406, not 404.** Any check written
  as "confirm it is not a 404" passes on a completely broken URL.
- **Board state is not work state.** Five of MCP-309's eight declared blockers
  were already Done while the board implied otherwise; one discharged gate read
  as the top launch risk. **Recurred 2026-08-17**: a `CHANGES_REQUESTED` flag was
  read as a work signal and nearly staffed an implementer lane against work that
  had been finished for four days — the cure commit post-dated the review by
  thirteen minutes.
- **A zero from a filtered query is only evidence if the filter is known to
  match something.** `reviewed-by:claude` → 0; `reviewed-by:claude[bot]` → 627.
  **GitHub renders bot logins as `claude` in GraphQL and `claude[bot]` in REST**,
  so a login carried across surfaces silently matches nothing and reads as a
  measured absence. Control probe: run the same query with a filter you know
  returns hits.
- **Never compare a `…Z` timestamp against a local wall-clock.** A `+0100` commit
  time read against a UTC clock turned 79 minutes into "15 minutes ago" and
  produced a false "actively working right now". Use epoch arithmetic. The
  Director brief carries the inverse instance.
- **A git identity is not a session.** Commit authorship was used to identify
  which live session held a branch; it was the wrong session entirely. Authorship
  tells you which credential signed, nothing about who is at the terminal.
- **Suppressing stderr on a watcher turns failure into apparent quiet.** A
  `2>/dev/null` on a review watcher made it see 5 items where a correct read sees
  53 — roughly 90% blind, silently. Capture stderr, report failed reads, and
  foreground-probe any watcher before arming it.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
|---|---|---|---|---|---|---|
| Wisteria lifts Verdure | claude-code | claude-opus-5 | c4294f | director | 2026-08-06 | 2026-08-06 |
| Schooner rides Marsh | claude | Opus-5 | d9d5b8 | director | 2026-08-12 | 2026-08-12 |
| Walrus herds Jetty | claude | Opus-5 | a9cd9a | director | 2026-08-12 | 2026-08-12 |
| Marlin binds Wave | copilot | GPT-5.6 Sol | a8a9e9 | pr-review-warden | 2026-08-12 | 2026-08-12 |
| Wildfire holds Quench | claude | Opus-5 | ee2764 | director | 2026-08-13 | 2026-08-13 |
| Tuna holds Ballast | claude-code | Opus-5 | a2ce03 | director | 2026-08-17 | 2026-08-17 |
| Wildfire spins Temper | claude | Opus-5 | 8e5eba | liaison | 2026-08-17 | 2026-08-17 |
| Orchid holds Bark | claude | Opus-5 | 2abbd1 | liaison | 2026-08-13 | 2026-08-13 |
| Skunk stirs Cavern | claude-code | claude-opus-5 | db8b9b | director | 2026-08-17 | 2026-08-17 |
| Dormouse turns Footfall | claude | claude-opus-5[1m] | a54547 | director | 2026-08-17 | 2026-08-18 |
| Sloop spins Spray | copilot | GPT-5.6 Sol | c42e7e | pr-review-warden | 2026-08-18 | 2026-08-18 |
| Raven turns Nocturne | claude | Opus-5 | 0aad1a | liaison | 2026-08-18 | 2026-08-18 |
