# Critical re-assessment — comms-corpus research (WS0–WS3)

**Author:** Kayak herds Ballast (claude-code / Opus 4.8 / session `328eee` /
`agent-collaboration-research` thread).
**Date:** 2026-06-13.
**Mandate:** owner-directed critical re-assessment of the inherited research, under the
standing instruction *"all agent responses, claims, sources must be critically assessed"*.
**Method:** first-hand re-derivation by me (not subagents, not re-running the original
scripts), targeted at the load-bearing, cheap-to-falsify claims. This honours the research's
own discipline: all agent-produced material is second-hand until verified first-hand.

## Why this matters

The thread's end-goal is an irreversible action — making it safe to delete and stop
git-tracking the `.agent/state/` corpus. Any load-bearing claim that is wrong (a miscount, a
miscited event, a hypothesis dressed as fact, a stale "it is all safely committed" assertion)
would be baked into deletion decisions and lose signal permanently. Confirmation is therefore
as valuable as refutation: it calibrates confidence before the irreversible step.

## Verdict summary

| Claim (inherited) | First-hand check | Verdict |
|---|---|---|
| ~5,120 events, 2026-05-20→06-13 | 5,150 events, `2026-05-20T11:38Z`→`2026-06-13T08:42Z` | CONFIRMED (grew since record) |
| 0 lifecycle-kind events | narrative 4,058 / directed 1,092 / lifecycle 0 | CONFIRMED exactly |
| `in_response_to` unpopulated corpus-wide | field present on 0 of 5,150 events | CONFIRMED exactly |
| heartbeats ~46% | 2,375 = 46.1% | CONFIRMED |
| 41 failure-mode + 303 behaviour-note (341 unique tagged) | 41 + 303 instances; 341 unique reconciles if 3 events carry both tags | CONFIRMED (instances vs unique) |
| make-safe commit `9aaa6f710` = 35 files | `git show` = 35 files, +7,102/-38 | CONFIRMED exactly |
| Katydid disclosed own WS1 contamination | event `37523113` exists, authored by Katydid, titled accordingly | CONFIRMED |
| Myrtle reclassified `6c370ea1` S3→A4 | event is "skill-invocation-provenance conflated…" — an agent/coordination failure | CONFIRMED sound |
| tag taxonomy authored in prose, not `tags` | `1e2c83eb` + `ec86492e` have `tags=[]` but titles read `[FAILURE-MODE + BEHAVIOUR-NOTE]` | CONFIRMED |
| corpus integrity | uniform `schema_version` 2.0.0; 0 missing required fields; 0 event_id/filename mismatches | CLEAN |
| "all events committed, zero untracked" (Fern, 2026-06-12) | 5,150 in dir, 168→189 untracked and growing | **STALE** |

## Findings

1. **The headline statistics are trustworthy.** Independent re-derivation matched every
   recorded corpus fact. The quantitative substrate can be relied on by downstream consumers.

2. **The deletion-safety claim was stale (the one substantive correction).** The record
   asserted "zero untracked"; live state showed 168 (now 189) untracked events accumulating
   live from four agents' watchers and heartbeats. The deletion precondition — no unprocessed
   or untracked event is lost — is **not currently met**. This does not block the branch push
   (push ≠ delete), but it is load-bearing for the eventual deletion the thread exists to
   enable. The record's own caveat predicted exactly this ("the commit-or-absorb invariant
   remains live for future events").

3. **A near-miss worth recording about method.** A naive author-keyed scan reported "1,092
   events missing `author.agent_name`". First-hand inspection showed these are exactly the
   1,092 `directed` events, which use `from`/`to` per the schema `oneOf` — not a corpus
   defect, a reader bug. This vindicates the first-hand discipline: the scary aggregate was an
   artefact of the analysis, not the data.

4. **New observation: tag adoption is even narrower than reported.** The entire 5,150-event
   corpus uses only three distinct tag values (`heartbeat`, `behaviour-note`, `failure-mode`).
   No other ADR-183 namespace tag was ever authored. This corroborates the WS2 causal root
   (the CLI exposed no `--tags` authoring path) and strengthens the tag-adoption finding.

## Crash-safety actions taken this session (owner-directed)

- Verified the branch was **never pushed** (no `origin/feat/comms-research`); both research
  commits and the peers' subsequent burst were local-only.
- **Pushed `feat/comms-research` to origin** (`cc3dc98b8`); the pre-push hook ran the full
  gate green. All committed research substrate is now disk-crash-safe.

## Residual risk / open coordination

- **189 untracked raw comms events** — the peers hold an active, owner-gated WS7 "archive raw
  comms" plan for these; their handling is coordinated with the peer team, not grabbed solo.
- **2 orphan insight files** (Fern's experience record; statusline-logos research) — other
  lanes' artefacts, still untracked.
- **Deliberately not committed by me:** `active-claims.json`, `closed-claims.archive.json`
  (collaboration registry state, kept out of feature branches by the pure-diff convention),
  and `distilled.md` + the rapid-comms channel (in-flight peer edits).
