---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 25000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Next-Session Record — `statusline-enhancements` thread

The unified Claude Code statusline lane: the Oak-mark logo column plus the
session-shape indicators. Both render through the same `renderStatusline`, so
they are one lane, not two. The original lane (Oak mark + the narrow
solo/peer/directed + wing indicators) is **COMPLETE** on `feat/comms-research`
and its controlling plan is **already archived** (see below).

**The thread is LIVE, not closed — it has a successor.** A superseding plan,
[`team-state-register-and-session-shape-icons.plan.md`](../../../plans/agent-tooling/current/team-state-register-and-session-shape-icons.plan.md)
(current/, DRAFT, refined 2026-06-14, READY-WITH-CONDITIONS), replaces the narrow
resolver with a **team-state register** projected into a 4-position icon — its
active-agent set unions claims ∪ comms ∪ ArcAngel ∪ sidebar participants, so
read-only collaborators count (the claims-only limitation; PDR-095). An interim
improvement landed 2026-06-14 (Orbit stirs Spectrum) ahead of the register:
the resolver is now **session-relative** (team shape gated on a fresh own claim),
a new **`observing`** shape (dim eyes) covers non-member-with-others-active, and
the render module was split into `statusline-ansi.ts` / `statusline-indicators.ts`
/ `statusline-render.ts`.

## Thread scope — all the related surfaces are ONE thread

Owner question (2026-06-14): *are the statusline plans and the terminal Oak
logo/animation work part of the same thread?* **Yes — and this section makes
that explicit, because they were previously scattered with no cross-link.** This
one thread spans:

- **Session-shape indicators** (code): `renderStatusline` +
  `statusline-session-shape.ts` / `statusline-ansi.ts` / `statusline-indicators.ts` /
  `statusline-render.ts` + the successor register plan (below).
- **Oak-mark logo column** (code + research): the `OAK_STATUSLINE_LOGO` 4-row
  glyph column, derived from
  [`research/developer-experience/statusline-logos/statusline-logos.md`](../../../research/developer-experience/statusline-logos/statusline-logos.md)
  (SVG→glyph renderings; SVG is source of truth).
- **Terminal animation** (research, no plan yet): the redraw-free terminal
  animation toolkit at
  [`statusline-logos/terminal-animation-without-redraw/`](../../../research/developer-experience/statusline-logos/terminal-animation-without-redraw/)
  — a future lane of this same thread (animate the Oak mark / indicators), not a
  separate thread.

**Cross-thread note:** statusline lane state is also referenced from the
[`agentic-engineering-enhancements`](agentic-engineering-enhancements.next-session.md)
thread record (§Statusline lane) and from `repo-continuity.md`. This record is
the canonical home for the thread; the agentic-engineering reference is a
historical pointer, not a second owner. Consolidate any future statusline lane
state here.

## Current continuation

- **Controlling plan (narrow lane, now ARCHIVED)**:
  [`statusline-session-shape-indicators.plan.md`](../../../plans/agent-tooling/archive/completed/statusline-session-shape-indicators.plan.md)
  ("Statusline Enhancements — Oak Mark + Session-Shape Indicators") — in
  `archive/completed/`, not `current/` (the earlier link here was stale).
- **Successor plan (LIVE continuation)**:
  [`team-state-register-and-session-shape-icons.plan.md`](../../../plans/agent-tooling/current/team-state-register-and-session-shape-icons.plan.md)
  — the team-state register + 4-position projection that supersedes the narrow
  resolver. Originally earmarked for Clipper wakes Atoll (since rotated out, so
  the plan is unassigned — the next session that opens this thread picks it up);
  refined 2026-06-14, READY-WITH-CONDITIONS (Condition A owner-resolved: forward-
  design fields retained, marked no-consumer-yet for future review).
- **Landed (mark)**: the Oak acorn mark — a 4-row logo-column, default
  `braille-sharp` via `OAK_STATUSLINE_LOGO` (`braille` / `quad` / `sextant` /
  `none` alternatives). Commits `40ef58a06` + `5cc13977e` + `8efc58d83` on
  `feat/comms-research`, **pushed** (verified `@{u}..HEAD` level 2026-06-13 —
  the earlier "UNPUSHED" note was stale).
- **Landed (indicators re-fit, 2026-06-13, Skylark wakes Summit)**: WS1 (claim
  `role` field), WS2 (pure session-shape resolver), WS3 (render) — originally
  committed on `feat/statusline-enhancements` against the OLD single-line layout
  (`ac2901fe1` / `1ac430378` / `4270ea49d`) — were brought onto
  `feat/comms-research` and **re-fit into the 4-row layout**: Director demark on
  the identity row, team-icon + ArcAngel wing trailing it; `logo:'none'`
  preserves the single line byte-compatibly. WS5 green (1081 agent-tools tests).
  The old "WS1 paused on an sdk-codegen blocker (`7ca3eba2`)" note was wrong —
  the role-field commit touches no sdk/keywords files; mis-attributed.
- **Landed (WS4 glyphs + unknown/solo, 2026-06-13, Skylark wakes Summit)**: WS4
  glyph terminal verification is **COMPLETE** — all five verified rendering in the
  owner's terminals: Director `🧭` U+1F9ED, directed-team `👪` U+1F46A, peer-team
  `🤝` U+1F91D (replaced `👥` U+1F465, which rendered nowhere), solo `🧍` U+1F9CD,
  ArcAngel wing `🪶` U+1FAB6. Plus a resolver **correctness** fix: an unreadable
  registry now resolves to `unknown` (no team icon — honest absence) instead of a
  false `solo`; a confident solo carries its own marker (`c456cda0d`). WS5 green
  (1081 agent-tools tests).

## Next safe step (the fresh session's first move)

The **narrow** lane is COMPLETE on `feat/comms-research` (all workstreams landed,
five glyphs verified, 1081 agent-tools tests green; commits this arc `a1fb8e9c4`
`5c01ee7ee` `221ee4a9f` test-IO, `c456cda0d` unknown/solo + glyphs). The live
next step is the **successor register plan** (queued, READY-WITH-CONDITIONS —
resolve Conditions A/B/C-D before DECISION-COMPLETE; earmarked for Clipper). The
interim 2026-06-14 resolver improvement (session-relative + `observing` + module
split) is on the working tree, pending commit on `feat/comms-research`.

Carried-over note: `statusline-identity.ts` `listExperiments` uses
`Dirent.parentPath` (Node ≥ 20.12 / 21.4); no engines floor is declared, runtime
is Node 24 — fine in practice, worth pinning a floor. (The earlier WS1
`cli-claim-role.integration.test.ts` real-IO item is RESOLVED — that test was
deleted and its dispatch-allowlist guard re-expressed IO-free; see
`agent-tools-test-io-compliance.plan.md` for the remaining pre-existing test-IO
elsewhere in agent-tools.)

Open hypothesis (routed from the comms-research napkin, 2026-06-14 dedicated
consolidation — UNVERIFIED): the ArcAngel **wing indicator went DARK while two
agents collaborated heavily on a channel** (owner read it as "not in a channel").
Hypothesis: the wing keys on channel **recency** and/or only re-evaluates on a
turn-render, so it goes stale-dark during idle "holding" gaps; it should reflect
channel **membership** (filename substring — both full names are in the channel
filename), static, not render-recency. Needs first-hand verification against
`resolveArcActive` **as it stands after the `da8cbd7d6` resolver/module split** (a
later resolver correctness fix may already have addressed it). Cure direction:
detect on membership independent of render-recency, or re-evaluate the wing on a
cadence. Also a research-relevant collaboration-visibility failure mode.

## Participating agent identities

| Platform | Model | Agent name | Role on this thread | last_session |
| --- | --- | --- | --- | --- |
| claude-code | Opus 4.8 | Orbit stirs Spectrum | Interim session-relative resolver + `observing` shape + ansi/indicators/render module split; refined the successor register plan (claim-independent active-agent set) + readiness pass; seeded PDR-095 | 2026-06-14 |
| claude-code | Opus 4.8 | Skylark wakes Summit | Re-fit WS1–WS3 onto the 4-row layout; unknown-vs-solo resolver fix; WS4 glyphs verified; test-IO compliance; corrected this record + plan | 2026-06-13 |
| claude-code | Opus 4.8 | Bilby hunts Eventide | Oak mark landed; lane unified; thread opened | 2026-06-13 |

Prior, on the indicators half (pre-unification, `feat/statusline-enhancements`):
Monsoon guards Cirrus authored WS1–WS3 against the single-line layout, and the
2026-06-12 statusline redesign merged as PR #198.

## Landing target for the next session

The narrow lane is complete and rides `feat/comms-research`'s push/merge, but
**do NOT archive this record** — the thread is live via the successor register
plan. The narrow controlling plan is already archived. A fresh session opening
this thread picks up the register plan (resolve its readiness Conditions A/B/C-D)
or commits the pending interim resolver improvement. Archive this record only
when the register plan itself completes. Unrelated follow-on: the pre-existing
agent-tools test-IO compliance tracked in
[`agent-tools-test-io-compliance.plan.md`](../../../plans/agent-tooling/current/agent-tools-test-io-compliance.plan.md).
