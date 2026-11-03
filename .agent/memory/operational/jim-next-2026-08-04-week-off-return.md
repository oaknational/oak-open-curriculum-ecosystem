# Jim-next — the week-off return map (frozen 2026-08-04)

The single surface to open on returning from the week off (or when peeking
mid-week). It combines the paused PRs, the plan-corpus states, the paused
team's lanes, and the day's owner-held items into one ordered map. Pointers,
not duplication: seat rehydration mechanics live in
[`team-resume-2026-08-03-matt-clear-run.md`](team-resume-2026-08-03-matt-clear-run.md);
per-PR comment detail lives in
[`../../reports/pr-comment-triage-2026-08-04.md`](../../reports/pr-comment-triage-2026-08-04.md).
Recompute anything time-sensitive first-hand — this froze on 2026-08-04.

## During the week (nothing owed)

Matt holds the submission lane solo with bypass permissions; the fleet is
extricated (standing ruling: agents review and may approve his PRs when he
asks, and NEVER merge them). #751 sits with him ready+optional; #752 closed
on its own recorded case. One agent seat (Petrel holds Turbulence, a0892f)
idles with an hourly read-only watch over PRs and recently active Linear
tickets. Nothing routes to you unless it is a genuine owner-only blocker.

## On return — your word only, in rough priority order

1. **Reopening declaration** — "the first-submission window is closed" fires
   the team-resume doc's gate: #729/#731 ready, the temporary Matt note out of
   `start-right.md` §6a, the paused labels lifted, lanes rehydrated.
2. **The Director seat** — empty since 2026-08-03 (Magnetar's claims are
   stale). The 2026-08-04 tempo incident showed the fleet resonates without
   its damping seat; refill it or redesign the duty before the next
   multi-seat window.
3. **ADR-204 vs the live ruleset** — a QUESTION, not an alarm: live
   `strict_required_status_checks_policy` is false against the ADR's decision
   text, there are four required contexts (the fourth, Vercel, documented
   nowhere), and no `required_deployments` rule is visible on the rules API.
   Deliberate settings or drift? Your call decides whether ADR-204 is
   superseded or the ruleset re-trued.
4. **pnpm distribution** — this machine runs corepack's pnpm while a
   standalone install cohabits at `~/Library/pnpm` (the misconfiguration
   behind the 2026-08-04 incident). Choose one distribution; then the
   accidental 1.2G store at `~/Library/pnpm/bin/store/v11` is deletable at
   your word.
5. **Primary's foreign dirty files** — `.gitignore` (adds `.env*`) and
   `research/web-app-deconstruction/package.json`: complete or discard; no
   live seat owns them.
6. **MCP-495 sequencing** — preview/development Sentry env values remain
   unverified (encrypted, CLI read-only); production is proven live.
7. **Sketch ratifications** — 13 delivery sketches + the design-system
   strategic sketch await your word; none carries work until ratified.

## Resume queue — agent-executable at your word (suggested order)

1. **Gate-ledger lane** (Petrel's claim dd3f640f): un-draft #755 (PDR-136),
   then the imported execution plan's PR-1..6 — ADR-224 first. Plan node
   carries everything (§Execution plan, §Tier-2 shape superseded).
2. **#746** deployment-reliability node: findings 3 (bootstrap-reporter
   safety proof) and 4 (uptime build-vs-buy — the one open instrument
   question is whether a Sentry uptime monitor can send custom headers).
3. **#745** perishable-claim freshness (MCP-476) — early: it cures the
   stale-claim class that misled two seats on 2026-08-04.
4. **#731** Parallax: three recorded blockers red-first, then the three
   queued validator defects; the owner-ruled skill-creator deletion
   discharges its three findings.
5. **#729** census validator → the public-digital-service-identity lane.
6. **#737** Oak Components research — cured; needs one re-review.
7. **#734** Lichen corpus green-up (3 lint errors + type/build/test), any
   capable seat; then the typescript-estate review lane proper.
8. **Vanilla's ws-a-cycle-2** (usage gauges on the MODEL row).
9. Housekeeping: archive the completed `upstream-update-lane-completion`
   node per the plan-estate archival convention; relabel claim dd3f640f's
   area to the PDR-136 path; land #758 and #764 at convenience.

## Dates on the horizon

- **2026-08-10 08:00 London** — Linear embargo lifts (design ticket,
  pnpm-CLI story, MCP true-ups, ARC-colour frontmatter stamp).
- **2026-08-16** — codex-dialogues window closes.
- **2026-08-23** — skills gate expiry.

## Seat state at the 2026-08-04 compaction (resume anchor)

Petrel holds Turbulence (a0892f) continues post-compaction. Claim dd3f640f
(quality-gate-ledger, implementer) held through the boundary; all monitors
and the comms watcher stopped at the owner's word before compaction; the
post-compaction watch regime is ONE hourly read-only monitor over open PRs
and recently active Linear tickets (owner-specified). Primary checkout on
`main`, clean except the two foreign files above. Everything this seat
produced is tracked and pushed: the fold (main `97c444ee1`), the doctrine
fix, the D7 supersession, PR #764 (plan import), and this document.
