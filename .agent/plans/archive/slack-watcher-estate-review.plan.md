---
id: slack-watcher-estate-review
node_type: delivery
name: "Slack Watcher estate review — skills, guidance, and mechanisms for the Watcher and agents communicating with or via it"
overview: "Owner-commissioned review of the Slack Watcher organ: the slack-watcher and talk-to-slack-watcher skills, the comms-all-channels-watcher rule, the environment coupling, liveness and lifecycle mechanics, and the guidance agents follow to communicate with or via the Watcher — verdicts and routed proposals, not execution."
status: archived
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-08-24
ratified_where: "In-session ratification word to Raven stirs Murmur (c4031b), 2026-08-24 — recorded verbatim in the thread record slack-watcher-estate-review.next-session.md §History"
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-24
---

# Slack Watcher estate review

Commissioned by the owner 2026-08-24 ("a review of the skills, guidance
and mechanisms behind the The Watcher of Slack and agents communicating
with or via The Watcher"), for a fresh session, in parallel with the
proof-programme loop review running in castr. Independent scopes: a
finding that belongs to the other estate routes there as a pointer,
never absorbed.

## Goal

The owner can trust the Watcher as the estate's comms organ: a fresh
Watcher seat can start, run, and hand off reliably from the written
surfaces alone, and any agent can communicate with or via the Watcher
without drift, double-delivery, or silent loss.

## Mechanism

The Watcher is an unattended organ, like the castr loop — so the review
tests reflexes, not paperwork: liveness (what proves the Watcher is
alive; silence-is-never-liveness), lifecycle (start, heartbeat, hand-off,
death), routing coherence (when a message goes s2s, to a channel file,
to the comms stream, or via the Watcher — oak-comms-channels is the
overlay, the agent-collaboration-channels card the authority), and
configuration coupling (the SLACK_WATCHER_* environment variables live
in the cloud environment per cloud-environment.md — write-only dialog
caveats apply). The 2026-08-24 retrospective is the evidence lens:
instruments that exist as prose and never fire are the measured failure
class of unattended organs.

## Review legs

1. **Ground on primary sources, in full — inventory by discovery, not
   hand enumeration** (refined 2026-08-24 pre-ratification from the
   PR #14 routed finding): the inventory is produced by a sweep for
   watcher-named artefacts across every platform projection tier —
   canonical (`.agent/skills/`, `.agent/rules/`), the `.agents/`
   adapter tier (`.agents/skills/`, `.agents/rules/`), the Claude tier
   (`.claude/skills/`, plus the `.claude/settings.json` permission
   entries naming watcher skills), the Cursor tier (`.cursor/rules/`),
   and any projections living outside the repo (account-synced skills
   such as `oce-slack-watcher` under the harness's synced-skills store;
   plugin marketplaces). The report publishes the sweep method and the
   resulting enumeration, so absence claims are backed by a published
   sweep. Seed checklist, known at authoring (a floor, never the
   bound): this repo's canonical bodies
   (`.agent/skills/slack-watcher/SKILL-CANONICAL.md`,
   `.agent/skills/talk-to-slack-watcher/SKILL-CANONICAL.md`) and
   wrappers (`.claude/skills/oak-slack-watcher/`,
   `.claude/skills/oak-talk-to-slack-watcher/`), plus castr's twins at
   <https://github.com/EngraphCode/castr/blob/main/.agent/skills/slack-watcher/SKILL-CANONICAL.md>
   and
   <https://github.com/EngraphCode/castr/blob/main/.agent/skills/talk-to-slack-watcher/SKILL-CANONICAL.md>
   (wrappers under
   <https://github.com/EngraphCode/castr/tree/main/.claude/skills>) —
   the
   `comms-all-channels-watcher` and `liveness-heartbeat-cron` and
   `silence-is-never-liveness` rules (all their projections),
   `oak-comms-channels`,
   `cloud-environment.md` § environment variables, the
   `plans-backlog-2026-07/slack-assistants` backlog, the speculative
   `watcher-liveness-self-heal.md` plan, and the
   `slack-assistant-logging-observability-design.md` research note.
   Record drift between surfaces as findings.
2. **Liveness and lifecycle mechanics**: what starts a Watcher, what
   proves it alive (heartbeat cadence, who consumes the heartbeat, what
   happens when it stops), what a hand-off or death looks like, and
   whether each claim is backed by an ACTIVE instrument or by prose.
   Verify any stand-down or self-heal predicate against the mechanism's
   real output (loop-exit-criteria-required).
3. **Communication routing coherence**: for each flow (agent→Watcher,
   Watcher→agent, agent-via-Watcher→Slack, Slack→Watcher→estate), which
   surface owns it, whether the fast lane mirrors decision-bearing
   content to its durable home, and where double-delivery or silent-drop
   windows exist. Test the guidance by walking each flow's written
   instructions as a fresh agent would.
4. **Configuration and environment coupling**: the SLACK_WATCHER_*
   variables' single-sourcing, the metered-chrome ruling's bearing on
   Watcher sessions (oak-chrome-session-is-metered), and what a broken or
   absent configuration does to a starting Watcher (fail-fast or silent
   limp?).
5. **Synthesis**: a dated report under
   `.agent/reports/agentic-engineering/` (with the reports README review
   contract near the top), verdicts per surface (KEEP / FIX / RETIRE),
   findings with evidence, proposals with warrant + falsifier routed per
   PDR-130, thread record and this plan updated, wrap run.

## Acceptance criteria

1. Every surface in leg 1's inventory has a recorded verdict with
   evidence — proof: the leg-5 report enumerates them (repo-safe).
2. Every liveness/lifecycle claim is classified instrument-backed or
   prose-only — proof: the report's leg-2 table (repo-safe).
3. Every communication flow in leg 3 has a routing-coherence row —
   owning surface, mirror-to-durable verdict, and any double-delivery
   or silent-drop window named — proof: the report's leg-3 table
   (repo-safe).
4. Leg 4 records a single-sourcing verdict per SLACK_WATCHER_* variable
   and a fail-fast-or-silent-limp finding for a broken or absent
   configuration — proof: the report's leg-4 section (repo-safe).
5. Each proposal carries warrant, falsifier, and PDR-130 lane — proof:
   report §proposals (repo-safe); adoption is the owner's consolidation
   decision (owner-held).

## Out of scope

Executing any proposal; amending the Watcher skills or rules in this
lane; the castr loop review's territory (route pointers); building new
Watcher features. Bot review findings against this review's own PR
follow the bounds-not-cures disposition where the reference surface is
unbounded.

## Todos

Sliced at pickup by the implementing session per the legs above; each
slice a single-story PR within its round budget (PDR-132), with the
pr-lifecycle round tally built at PR-open.

## Completion record (2026-08-24)

All five legs executed by Raven stirs Murmur (c4031b) in one session;
every acceptance criterion is proven by the report's tables
(`.agent/reports/agentic-engineering/slack-watcher-estate-review-2026-08-24.md`).
The owner adopted all six proposals the same day ("agreed to all",
in-session); P1–P5 were executed under that word (the out-of-scope
guard held until adoption discharged it), and P6 — the owner's
account-side deletion — was completed by the owner during the same
arc (2026-08-24). Cross-estate pointers L1-F2/F4 were delivered as
castr PR #53 (merged 2026-08-25, `e62891ee`). Nothing remains open;
archived complete.
