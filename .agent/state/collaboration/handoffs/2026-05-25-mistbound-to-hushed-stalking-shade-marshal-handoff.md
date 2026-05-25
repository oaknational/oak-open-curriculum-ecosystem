---
agent_name: Mistbound Hiding Threshold
id: e2a2c264-d631-4ba3-a4ea-c61a5e0d14f7
created_at: 2026-05-25T05:40:00Z
last_updated_at: 2026-05-25T05:40:00Z
role: commit-marshal
session_id_prefix: 0e27cc
platform: claude
model: claude-opus-4-7
classification: marshal-handoff-mistbound-to-hushed
handoff_to_agent_name: Hushed Stalking Shade
---

# Marshal handoff: Mistbound Hiding Threshold (0e27cc) → Hushed Stalking Shade

## 0. Owner direction

> "Please transfer the role of Commit Marshall to Hushed Stalking Shade, with a summary of the role and all three monitors etc."

PDR-064 two-moments coordinator handoff applied. Mistbound = retiring marshal; Hushed Stalking Shade = inheriting marshal. Authority transfers on Hushed's Moment-2 active-acknowledgement broadcast referencing this record + the Moment-1 broadcast via `in_response_to`.

## 1. What the Commit Marshal IS

A **single serialiser of the act of committing** during multi-writer windows. The role exists to solve one specific problem: multiple agents writing to the same working tree race on the git index, and uncoordinated commits cause data loss (one writer's stage clobbers another's; foreign `.git/index.lock` blocks all writers; the husky pre-commit gate runs against the whole tree, so an in-flight change from agent B can fail agent A's commit).

The marshal solves this by **owning the commit window** as a single linearised resource. Peers queue commit intents in `active-claims.json`; the marshal executes them one at a time.

**Owner-direct binding this session**: "mistbound commits, not anyone else" — sole-marshal. Hushed inherits the sole-marshal binding unchanged.

## 2. Three Marshal Monitors (the seat's instrumentation)

### Monitor 1 — all-channels comms watcher

```bash
pnpm agent-tools:collaboration-state -- comms watch \
  --comms-dir .agent/state/collaboration/comms \
  --seen-file .agent/state/collaboration/comms-seen/hushed-stalking-shade.json \
  --platform claude \
  --model claude-opus-4-7 2>&1 | grep --line-buffered -v '^\$'
```

Run via `Monitor` tool with `persistent: true`. Replace `claude`/`claude-opus-4-7` if Hushed runs on a different platform/model. The seen-file path must match Hushed's agent name (kebab-cased).

### Monitor 2 — commit-queue state-change watcher

```bash
PREV=""; while true; do
  CUR=$(jq -c '.commit_queue[]? | select(.phase != "abandoned" and .phase != "complete") | {intent_id, agent: .agent_id.agent_name, prefix: .agent_id.session_id_prefix, phase, fingerprint: .staged_bundle_fingerprint, subject: .commit_subject}' .agent/state/collaboration/active-claims.json 2>/dev/null | sort)
  if [ "$CUR" != "$PREV" ]; then
    if [ -n "$PREV" ]; then
      comm -13 <(printf '%s\n' "$PREV") <(printf '%s\n' "$CUR") | sed 's/^/QUEUE-CHANGE: /'
    fi
    PREV=$CUR
  fi
  sleep 10
done
```

Run via `Monitor` with `persistent: true`. Emits `QUEUE-CHANGE: {…}` per active intent transition.

### Monitor 3 — marshal substrate watcher

```bash
PREV=""; FIRST=1; while true; do
  CUR=$(git status --short -- .agent/memory .agent/state/collaboration 2>/dev/null | sort)
  if [ "$CUR" != "$PREV" ]; then
    if [ "$FIRST" = "1" ]; then
      COUNT=$(printf '%s\n' "$CUR" | grep -c . || echo 0)
      echo "STATE-BASELINE: $COUNT dirty files in .agent/memory + .agent/state/collaboration"
      FIRST=0
    else
      ADDED=$(comm -13 <(printf '%s\n' "$PREV") <(printf '%s\n' "$CUR"))
      REMOVED=$(comm -23 <(printf '%s\n' "$PREV") <(printf '%s\n' "$CUR"))
      if [ -n "$ADDED" ]; then printf '%s\n' "$ADDED" | sed 's/^/STATE-DIRTY: /'; fi
      if [ -n "$REMOVED" ]; then printf '%s\n' "$REMOVED" | sed 's/^/STATE-CLEAN: /'; fi
    fi
    PREV=$CUR
  fi
  sleep 30
done
```

Run via `Monitor` with `persistent: true`. Emits per filesystem change in `.agent/memory` + `.agent/state/collaboration`.

## 3. The Marshal Cycle (one cycle = one commit)

Use the `pnpm agent-tools:commit-queue` CLI. Per intent, in order:

1. `phase --intent-id <uuid> --phase staging`
2. `git add <file1> <file2> …` (explicit pathspec; NEVER `-A` or `.`)
3. `record-staged --intent-id <uuid>` (captures fingerprint)
4. `phase --intent-id <uuid> --phase pre_commit`
5. `verify-staged --intent-id <uuid> --commit-subject "<exact subject from intent>"`
6. `commit --intent-id <uuid> --message-file <repo-tracked tmp path>` (husky runs here)
7. (No explicit `complete` needed — `commit` finalises internally; `complete` returns `unknown intent_id` after, which is correct)

**Commit-message file location**: under repo workdir (e.g. `.agent/state/collaboration/_tmp-<agent>-marshal-cycle-N.txt`); `rm -f` immediately after commit. **Never `/tmp/`** — owner direction 22:08Z: `/tmp` is buffer-only, never storage.

**Commit-message format**:

- Subject line MUST be ≤100 chars (commitlint header-max-length).
- Body lines ≤100 chars (commitlint body-max-line-length).
- Blank line between body and `Co-Authored-By:` trailer (commitlint footer-leading-blank warning otherwise).
- Co-Authored-By format: `Co-Authored-By: Claude Opus 4.7 (<substantive author name> <prefix>) <noreply@anthropic.com>`

## 4. What the Marshal does NOT do

- Does not approve substance (peer review owns that).
- Does not own push (push-authz is separate; owner-gated this session).
- Does not bundle unrelated changes (one intent = one cycle = one commit; the M1-Pause bundle at `340752bb` was explicit owner-override).
- Does not run `--no-verify` (fresh owner authz per individual commit; never carries forward).
- Does not use destructive git commands (never `rm` foreign `.git/index.lock`; never `git reset --hard`).
- **Does not run `pnpm format:root` from the marshal seat** when husky reports format-issues — lesson from Cycle 7 + Cycle 8a this session: prettier can mangle multi-line inline-code spans into broken markdown. Better protocol: DM the substantive author for re-author + re-stage on their side, then re-enqueue.

## 5. Pre-flight commit-subject length check

Before opening any cycle, verify the intent's `commit_subject` length:

```bash
SUBJ=$(jq -r '.commit_queue[] | select(.intent_id == "<uuid>") | .commit_subject' .agent/state/collaboration/active-claims.json)
echo -n "$SUBJ" | wc -c
```

If >100 chars: DM the substantive author with sub-100-char alternatives and request abandon + re-enqueue. **Do not stage** for an over-limit subject — husky commit-msg gate will fail.

## 6. Heartbeat policy

Activity-as-liveness for cycle boundaries. Explicit `--tag heartbeat` comms event:

- On marshal-seat resume.
- After each commit lands (per-landing broadcast per Lunar cure discipline at 23:01Z — applies under tight silence-since-last-broadcast; batch-broadcast still OK if peers active).
- At idle windows >8 min between cycles.

**Director cure discipline**: Director cross-references `git log` against marshal silence-windows BEFORE escalating retirement-detection. New commits authored by silent-marshal == work-evidence == not retired. This compensates for the comms-stream-only liveness model.

## 7. Current state at handoff

- **HEAD**: `9e57290d` (Cycle 8 of post-m1-attestation-tidy-up.plan.md — SKILL §0.5 thin + PDR-078 ratify + 3 reciprocals)
- **Branch**: `feat/education-evidence-foundational-graphs`
- **Commit-queue**: empty of active intents (Cycle 8a intent `7e965431` is `abandoned`; substantive work preserved in working tree but no live intent to marshal).
- **Working tree**: ADR-187 + ADR README modifications for Cycle 8a preserved as `??` + `M` (substantive author Misty stood down 00:34Z; needs re-author + re-enqueue under a new identity OR Misty resumes).
- **Pre-staged config drift**: `.cursor/mcp.json`, `.sonarcloud.properties` still pre-staged from session-open (not marshal scope; out-of-scope hold).
- **Plan progress on `post-m1-attestation-tidy-up.plan.md`**: Cycles 1-3 landed (Charcoal); Cycle 4 landed (PDR-076b at b7ac9938); Cycles 5, 5a, held-items, 7, 7.1, 8 landed (Misty author / Mistbound marshal); Cycle 6 landed (PDR-078 Candidate at 9725ae09); Cycle 8a blocked (intent abandoned, work preserved); Cycles 9-15 not started.
- **Team state**: Lunar (Director) wound down 00:33Z structural-stall; Misty (plan-author) wound down 00:34Z; Charcoal final retirement 05:39Z; Pelagic stood down 22:11Z on stop-condition. Only marshal seat remained, now transferring to Hushed.

## 8. Cumulative commits landed under Mistbound marshal duty this session

| # | SHA | Subject |
|---|---|---|
| 1 | `4575044e` | chore(handoffs): capture Charcoal PDR-077 draft + R1/R3 syntheses from tmp to repo (tidy cycle 2) |
| 2 | `e8ca6d08` | chore(pdr): ratify PDR-076a (identity tuple name+UUID) as Accepted (tidy cycle 3) |
| 3 | `b7ac9938` | chore(pdr): ratify PDR-076b (body-file frontmatter contract) as Accepted (tidy cycle 4) |
| 4 | `7c2f85f4` | feat(pdr): land PDR-077 Commit Marshal cycle-discipline + 063/064 §Related (tidy cycle 5) |
| 5 | `e8bc6781` | feat(pdr): land PDR-079 portability distinction + rule + hook update (tidy cycle 5a) |
| 6 | `9725ae09` | feat(pdr): land PDR-078 (Liveness-Heartbeat Contract, portable, Candidate) (tidy cycle 6) |
| 7 | `93c4fdc0` | chore(practice-core): add README + practice-index entries for PDR-077/078/079 (tidy) |
| 8 | `48c8ac22` | feat(adr): land ADR-186 (comms-event-heartbeat-lifecycle-substrate) (tidy cycle 7) |
| 9 | `75a2cd25` | fix(adr): repair prettier-mangled inline-code span in ADR-186 §Render rule (cycle 7.1) |
| 10 | `9e57290d` | feat(skill): collapse §0.5 to PDR-078 pointer + PDR-027/063/064 §Related (tidy cycle 8) |

10 commits across the session, plus Charcoal's direct Cycle 1 at `a396d2c7` pre-discipline-binding.

## 9. Standing notes for inheriting marshal

- **Sole-marshal binding holds**: owner direction "mistbound commits, not anyone else" was named when team was Mistbound/Charcoal/Pelagic/Seaworthy. On transfer to Hushed, the binding becomes "Hushed commits, not anyone else" until owner re-routes. Hushed inherits as sole-marshal.
- **All quality gates blocking, always**: every husky red is blocking regardless of cause. Surface to owner; do not bypass.
- **Stage by explicit pathspec**: NEVER `git add -A` / `git add .`. Per the rule.
- **Never use git to remove work**: foreign locks are other agents committing, wait; never `git reset --hard` or `git restore` to remove work.
- **Important state never in /tmp**: owner direction 22:08Z; repo workdir only.
- **Format recovery from marshal seat is forbidden**: lesson from Cycles 7 + 8a; DM substantive author for re-author.
- **Pre-flight commit-subject length**: catch >100-char subjects BEFORE staging; DM author for re-enqueue.

## 10. Three-monitor restart commands for Hushed (copy-paste)

Update `--seen-file` to your agent's kebab-cased name + `--platform` + `--model` to your identity tuple. Run all three as `Monitor` tasks with `persistent: true`.

## 11. PDR-064 transfer protocol

- **Moment 1** (Mistbound, this record + broadcast): pre-positioning landed. Mistbound retains all marshal authority + monitors + heartbeat-emission until Moment 2 lands.
- **Moment 2** (Hushed, on session-start): broadcast tagged with `in_response_to: <this record's UUID or moment-1-broadcast-event-id>` actively acknowledging the marshal seat. On that broadcast, authority transfers.
- **Final release** (Mistbound, post-Moment-2): stop three monitors, emit final-heartbeat-end broadcast, emit team-member closeout, run session-handoff for retirement.

## 12. End-state expectation post-Hushed-Moment-2

Hushed runs three monitors; ready to process new commit intents as they enqueue. The first available marshal-receivable lane is likely Cycle 8a re-enqueue under a new author identity (Misty stood down) OR a re-routed plan author. That routing is owner-class — Hushed waits for direction.

— Mistbound Hiding Threshold / claude / claude-opus-4-7 / `0e27cc` (outgoing Commit Marshal)
