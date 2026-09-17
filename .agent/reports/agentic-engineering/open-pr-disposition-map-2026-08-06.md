# Open-PR disposition map (2026-08-06 evening)

Owner frame, verbatim: "Let's start to decrease the entropy and
increase the order… There are many open PRs and part of the drive to
bring clarity and structure is to analyse and merge them, but not
while github is broken." This map is the analysis, ready to execute at
Actions recovery. 33 open PRs at composition, clustered by the effort
each actually belongs to — several that look disparate are one thread.
Verdicts are the Director's, grounded in the day's surveys and
first-hand ceremony work; every merge still runs the full ceremony
(undraft → Copilot leg → settled green → threads + suppressed-body
read → approve → sha-pinned REST merge, never squash).

Statuses are dated observations (2026-08-06 ~19:5xZ), not moving
targets. Strike rows as they discharge.

## A — In ceremony now (armed; blocked only by the Actions outage)

| PR | What | Verdict |
| --- | --- | --- |
| #800 | MCP-510 plan suppressed-findings amendment | Merge at settled (approval + Copilot bound earlier; re-verify state at recovery) |
| #781 | Vendor-memory audit (27 unlanded learnings) | Merge at settled (conflict cured, ratchet cured, approved; curator pass follows as work) |
| #767 | Practice operational-system syntheses | Merge at settled (threads cured, suppressed findings dispositioned, approved) |

## B — MCP-508 tooling chain (one effort: merge-bot → watch family → estate green)

| PR | What | Verdict |
| --- | --- | --- |
| #790 | merge-bot merge command (slice 1) | S1–S5 cure seat working now; then ONE review pass (owner's proportionality word: reviews must converge, not accelerate out), merge, then the dogfood merge act |
| #792 | watch-commands plan amendment | Merge after #790 (same lane, docs-only) |
| #788 | extraction-pilot opener | Merge-ready; held only by the paused-for-submission label — unpauses per the post-submission trigger ruling |
| #734 | estate-review measurement greening | Needs the Sonar cure to zero (15 issues) before merge — route a green-up seat; blocks nothing meanwhile |
| #745 | perishable-claim freshness pilot (MCP-476) | Feature code from 08-03; needs freshness re-verify + review round before ceremony — queue behind #790 |
| #731 | Parallax family generator | Hold: three recorded blockers red-first (jim-next harvest); a real work lane, not a merge candidate |

## C — Clerk/auth effort (mostly Matt's clock)

| PR | What | Verdict |
| --- | --- | --- |
| #809 | MCP-517 forwarded-host fix (Matt) | Matt's lane; review support on request only |
| #761 | MCP-143 PR-3 CANONICAL_HOST | Blocked on review state since 08-04; needs Matt/owner attention — surfaced, not ours to merge |
| #772 | MCP-143 PR-4 authorizedParties | Explicit DO-NOT-MERGE draft, gated on PR-3 — correct as-is |
| #768 | MCP-495 Sentry-live gate | Post-submission gate — opens per the trigger ruling; then needs review (feature code) |

## D — Plan-node docs (inert once re-trued; the bulk of the draft mass)

| PR | What | Verdict |
| --- | --- | --- |
| #766 | MCP-501 multi-subscription research | Merge-safe class; light freshness read at ceremony |
| #775 | Birch napkin-entry harvest | Merge-safe class; verify the entry still absent from the rotated napkin/archive first (the #781 lesson) |
| #769 | MCP-479 guard-truing plan | Merge-safe class; re-true pointers |
| #771 | MCP-504 observability-contract sketch | Merge-safe class; re-true pointers |
| #774 | MCP-506 SDK-v2 spike plan | Merge-safe class; re-true against the 2026-07-28 MCP spec revision note (MCP-518 finding) before merge |
| #755 + #764 | Gate-ledger pair: PDR-136 register + execution-plan import | One effort; merge #755 then #764 (jim-next order); then the lane's PR-1..6 become routable |
| #746 + #770 | Deploy-reliability node + its mergeability amendment | One effort; apply #770's steps to #746, then merge both — do not merge #746 alone |
| #750 | Matt's docs-pnpm-setup draft | Matt's; leave |

## E — Design lane (owner re-opening it now; its seats disposition these)

#783 (the floor draft), #784 (sitting records), #785 (re-review cures),
#787 (formation letter), #737 (Oak Components research — cured, needs
one re-review). The reopened lane inherits all five; the wake payload
is the combined-window mandate (event a729c466) + the shaping record
through §The v2 final shape + its axis-2 evidence addendum.

## F — Rescues and history (preservation previews)

| PR | What | Verdict |
| --- | --- | --- |
| #805 | Fleet-topology history + probes | Merge as history (its 2026-08-06 sibling record is already tracked on the coordination branch — together they are the fleet-strategies corpus seed) |
| #806 | MCP-372 hub theme-store fix | Real code; needs a review round; queue after the doc mass clears |
| #807 | Stryker mutation-canary spike | Hold as preserved spike; consumes into the future mutation-testing decision, not a merge |

## G — Coordination

#791 — the fold PR, carries the whole day's coordination commits
(napkin, attention map, conserved June map, engineering-directions
sketch, this map). Standing owner word: Matt merges; our approval
stands.

## Execution order at Actions recovery

1. Re-fire and merge cluster A (#800, #781, #767).
2. Unpause and merge #788 (if the trigger ruling fires it).
3. Ceremony the inert docs in D, batched: undraft + Copilot legs in
   one pass, settle in parallel, merge in sequence (#766, #775, #769,
   #771, #774, then #755→#764).
4. #790 at its cure + review pass; then #792; then the dogfood act.
5. #746 via #770's steps; #734 at Sonar zero; #745/#806 after review
   rounds; #731 when its lane runs.

Everything else is another seat's clock (C, E, #750) or a deliberate
hold (#772, #807).

## Strikes (2026-08-06 ~21:00Z)

Merged: #781 and #790 (owner's hand, 20:39/20:40 — cluster A's audit
and the whole S1–S5 tooling chain head); #755, #764, #770, #775, #780,
#785 (owner batch, 20:45–20:57 — the gate-ledger pair, the #746
amendment plan, the Birch harvest, the standing edits, and the design
cure round). Effects: #746's steps are now applicable (its amendment
is on main); the gate-ledger lane's PR-1..6 are routable; the design
lane's open set is #783/#784/#787/#737. Remaining in ceremony: #800
(suppressed-findings cured at fbd67e638) and #767 (third CodeQL
re-fire) — both merge at CLEAN. The owner also applied effort labels
across the estate; the label ledger
(`docs/engineering/pr-label-ledger.md`) is the authority from this
strike onward.
