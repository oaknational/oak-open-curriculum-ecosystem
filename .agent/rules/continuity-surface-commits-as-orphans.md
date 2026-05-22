# Continuity-Surface Commits Are Session-End Orphans

Operationalises
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
and
[PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md).

## Rule

**Continuity-surface edits land as their own session-end commit, never bundled with the cycle commit that produced them.**

Continuity-surface edits include: `napkin.md`, `repo-continuity.md`, thread next-session records under `threads/`, `pending-graduations.md`, experience files under `.agent/experience/`, comms-event drift, `comms-seen/*.json` watcher state, `active-claims.json` after closures, `closed-claims.archive.json`, and the regenerated `shared-comms-log.md`.

At session-end, the closing agent commits continuity-surface drift with a `chore(continuity)` subject, OR explicitly hands off the drift to a follow-on agent in a directed comms-event naming the unstaged files.

## Why orphan, not bundled

Continuity edits are structurally produced AFTER the cycle's product code. They cannot ride with the cycle commit because they do not exist when the cycle commits.

Bundling continuity drift into a cycle commit also conflates two different ratifications:

- Cycle commit ratifies a **tested change**: gates pass, reviewer cadence absorbed, atomic-landing invariant met.
- Continuity commit ratifies an **observation about the session**: napkin entries are surprises, thread records are state snapshots, experience files are subjective texture.

Different acceptance criteria. Bundling them obscures both.

## Commit-subject convention

```text
chore(continuity): land <YYYY-MM-DD> <agent-codename> session reflection
```

Body should name:

- The thread(s) touched.
- The continuity surfaces edited (one-line list).
- Whether the closing agent is the committer OR the follow-on receiver.

## Topology-independence

Applies across all team topologies:

- **Solo**: the agent who closes the session commits.
- **Hub-and-spoke (coordinator + helpers)**: the coordinator at session-end commits.
- **Peer-primary**: each agent at their own session-close commits, OR explicitly hands off.
- **Rotating-cast / mid-cycle retirement**: the retiring agent's continuity drift is handed off per PDR-063's mid-cycle retirement protocol.

## When handoff (not commit) is correct

A closing agent hands off rather than commits when:

- Another agent has the commit window (e.g., owner directed the commit to a peer per the Mistbound → Stormbound t12 handoff case).
- The closing agent's session has been instructed to skip git operations (compaction-pause boundary, owner direction).
- A subsequent cycle is imminent and the receiving agent will commit continuity-drift bundled with their own session-end commit.

The handoff message must name the unstaged files explicitly (per `handoff-messages-self-contained.md`).

## Source attribution

Graduated 2026-05-22 from `.agent/memory/operational/pending-graduations.md` candidate `continuity-surface-orphan-commit-pattern`. Worked instance: Mistbound Slipping Night session 2026-05-22, where t12-citation-shape cycle's continuity drift (napkin entries + thread record + repo-continuity edit + pending-graduations entries + experience file) was structurally separate from the t12 product-code commit (handed to Stormbound) and required its own commit-or-handoff disposition.

## Cross-references

- Composes with [`session-handoff` SKILL](../skills/session-handoff/SKILL-CANONICAL.md) step 8 (close collaboration lifecycle surfaces) — this rule extends the closeout contract with the orphan-commit disposition.
- Composes with [`handoff-messages-self-contained.md`](handoff-messages-self-contained.md) — when handoff is the chosen disposition.
- Adjacent to [PDR-063](../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md) — mid-cycle retirement is one of the cases where handoff (not commit) is correct.
