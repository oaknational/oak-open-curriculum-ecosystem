---
name: "Intent to Commit + Session Counter"
overview: "Add advisory intent_to_commit / commit-queue signalling to the active-claims registry, with the commit skill writing intent before staging and verifying staged ownership before commit. Queue order is first-class; session-count TTL is a follow-up unless a session-counter primitive lands in the same pass."
isProject: false
---

# Intent to Commit + Session Counter — Strategic Plan

**Status**: ✅ QUEUE SLICE COMPLETE; `session_counter` FUTURE-ONLY
(2026-04-27)
**Promotion signal**: queue signal satisfied and implemented in `5c39d1d4`;
queue governance graduated to PDR-029 Family A Class A.3 on 2026-04-27.
Remaining promotion signal is explicit owner direction for a real
`session_counter` primitive; do not make session-count TTL load-bearing without
that primitive.
**Domain**: Agentic Engineering Enhancements
**Parent**: [Multi-Agent Collaboration Protocol](../current/multi-agent-collaboration-protocol.plan.md) — extends WS1 (active claims) and the WS3A schema family
**Related**:
[`archive/completed/intent-to-commit-queue.execution.plan.md`](../archive/completed/intent-to-commit-queue.execution.plan.md);
[`agent-collaboration.md`](../../../directives/agent-collaboration.md);
[`active-claims.schema.json`](../../../state/collaboration/active-claims.schema.json);
[`closed-claims.schema.json`](../../../state/collaboration/closed-claims.schema.json);
[`commit/SKILL.md`](../../../skills/commit/SKILL.md);
[`register-active-areas-at-session-open.md`](../../../rules/register-active-areas-at-session-open.md);
[`consolidate-docs.md § 7e`](../../../commands/consolidate-docs.md);
[`napkin.md`](../../../memory/active/napkin.md);
[`collaboration log`](../../../state/collaboration/shared-comms-log.md)

---

## Implementation Boundary

This plan is **not** the already-landed commit-window claim refinement.
That completed refinement lets an agent claim the shared git transaction
surface with `areas.kind: "git"` and `patterns: ["index/head"]` before
staging or committing.

The queue-backed intent bundle layer is now complete. Owner clarification on
2026-04-27 was implemented as a **minimal ordered commit queue**, not just an
`intent_to_commit` field on a claim. Claims say who is active; the queue says
whose intended staged bundle owns the next advisory turn.

Closeout correction on 2026-04-27: the first implementation slice should not
make session-count TTL load-bearing unless it also lands a real session-counter
primitive. Prefer explicit wall-clock fields for queue freshness in v1.3, or
split `session_counter` into a separate follow-up. The queue and staged-bundle
verification are the high-impact part.

- Complete: `commit_queue` on the active-claims registry root, carrying ordered
  `intent_to_commit` entries with the intended file bundle, commit subject,
  phase, and staged-set fingerprint.
- Complete: optional `intent_to_commit` pointers on active claims, with the
  queue owning ordering and lifecycle.
- Future-only: `session_counter`. Do not add session-count expiry until a real
  session-counter primitive is deliberately designed and implemented.
- Complete: commit-skill queue and ownership checks compare
  `git diff --cached` exactly against the declared intent before durable
  history is written.

In short: **commit-window claim is done; queue-backed intent bundle declaration
is done; session-counter TTL is separate unless explicitly implemented as a
real primitive**.

## Problem and Intent

The WS3A protocol gives parallel agents three coordination surfaces: the
shared communication log (free-form discovery), the active-claims registry
(area-level "I'm working in this region"), and decision threads (structured
async coordination). None of these directly addresses the **commit window**:
the short-lived interval where an agent is staging files, the pre-commit
hook is running, and `.git/index.lock` is held. They also do not ensure that
the files in the index still belong to the agent whose commit message and
intent are about to become durable history.

Seven concrete pieces of evidence accumulated on `feat/otel_sentry_enhancements`
2026-04-26 through 2026-04-27:

1. **Three observed lock-contention events**: 15:36, 15:43, 15:59. Each was
   a parallel agent committing while another agent was staging or about to
   commit. The contention surfaced as `git commit` failing with
   `Unable to create '.git/index.lock'`.
2. **Owner correction**: "the git index lock is because another agent is
   committing, never delete a git lock without user permission. Perhaps we
   need to add committing claims to the log." Twice-flagged in two separate
   exchanges in the same session.
3. **Index wipe under contention**: an agent's staged set was lost when a
   parallel agent's commit landed on the same branch, requiring re-staging.
   Staging is not durable when contention is live; the registry surface is.
4. **Wrong-intent commit capture (clash type A — substitution)**: another
   agent's staged files landed under the wrong agent's commit message
   (commit `8f44a941`). The intended files were entirely **replaced** in
   the index by foreign-staged content during the long pre-commit-hook
   window, but the original author's commit message was applied to the
   resulting tree. The file contents were correct and the branch was not
   broken, but durable history described the wrong intent. This is worse
   than a lock failure because the commit succeeds while the authorial /
   intent bundle is misleading. Defended by: VERIFY OWNERSHIP step
   (§ 2.6) — the staged set is checked against `intent.files` immediately
   before `git commit` and the commit is aborted if foreign content is
   present.
5. **Empty no-op commit (clash type B — disappearance)**: an agent's
   staged set vanished entirely between `git add` and `git commit`
   finalization (commit `b014ca20`). The commit succeeded with the
   author's intended message but produced a tree identical to its parent
   — durable history records work that did not actually land. Distinct
   from clash type A because no foreign content arrives; the index is
   simply emptied of the agent's stages by a parallel commit consuming
   them. Defended by: same VERIFY OWNERSHIP step (§ 2.6) — an empty
   staged set or a staged set missing any of `intent.files` aborts the
   commit, preventing no-op history.
6. **Incidental foreign-content bundle (clash type C — accretion)**: the
   agent's intended files landed correctly **plus** unrelated
   foreign-staged content from a parallel agent's WIP was swept into the
   same commit (commit `9af63a84` bundled `.agent/state/collaboration/shared-comms-log.md`
   alongside the intended plan files). The intended history label is at
   least partially honest (the intended files are there) but additional
   foreign work is now attributed to the same commit and authorial bundle.
   Distinct from A and B: A is replacement, B is disappearance, C is
   over-inclusion. Defended by: `staged_fingerprint` field plus the
   strict-equality VERIFY OWNERSHIP step (§ 2.6) — the staged set must
   equal `intent.files` exactly, not just contain them.
7. **Commit-window claim without queue still collided (clash type D —
   turn-race)**: on 2026-04-27 Fragrant Sheltering Pollen opened an
   `index/head` commit-window claim and shared-log entry before trying to
   land the narrow Codex stable-name documentation row. While that claim was
   open, commit `2ccefad4` landed with another agent's scripts-fix message
   but also contained the Codex documentation row; `HEAD` then advanced again
   to `21abd2d4` before the collision was fully inspected. The claim/log made
   the risk visible after the fact, but no FIFO queue told agents whose
   commit turn owned the index/head transaction before staging and hook
   execution. Defended by: WAIT / QUEUE (§ 2.4) plus VERIFY OWNERSHIP (§ 2.6)
   — the queued head owns the next advisory commit turn, and the staged set
   must still match the declared intent exactly before history is written.

The four clash types (A substitution, B disappearance, C accretion, D
turn-race) form a small taxonomy the queue and verify-ownership steps must
defend against together. The queue (§ 2.4 WAIT/QUEUE) reduces the probability
of any clash by serialising commit windows; the verify step (§ 2.6 VERIFY
OWNERSHIP) is the strict last-line defence that catches any clash the queue
missed.

The intent of this plan is to install a **non-binding, advisory** intent
signal and lightweight commit queue on the active-claims registry, written by
the commit skill before staging, verified against the staged set immediately
before commit, and cleared after the commit lands. Freshness should use
explicit timestamps in the first queue slice unless a real session-counter
primitive lands in the same pass.

The signal is advisory because the WS3A doctrine is "knowledge and
communication, not mechanical refusals" — the lock itself remains the
synchronization primitive; intents are a discovery surface upstream of it.
The queue is likewise advisory: it tells agents whose intent owns the next
commit window, and it forces a self-check before making history durable.

---

## Proposed Solution

### 1. Schema bump — `active-claims.schema.json` v1.2.0 → v1.3.0

Queue-first additive changes (compatible with v1.x readers per the
`$comment_compatibility` discipline):

**1a. New top-level `commit_queue`** field on the registry root. Array
order is FIFO; the head of queue is the first fresh non-terminal entry
(`queued`, `staging`, or `pre_commit`). Completed entries are removed in
the same write that records success; abandoned/stale entries are reported
and cleared by the commit skill or consolidation.

**1b. Optional later top-level `session_counter`** field on the registry root.
Do **not** include this in the first queue slice. Session-count TTL only becomes
load-bearing if a future pass implements session-open increment semantics and
validation. A possible later shape:

```json
"session_counter": {
  "type": "integer",
  "minimum": 0,
  "description": "Monotonically increasing session counter; incremented atomically by start-right skills at session-open. The TTL primitive for intent_to_commit (and an option for future claim-staleness work)."
}
```

**1c. Queue entry shape** in `$defs/intent_to_commit`:

```json
"commit_queue": {
  "type": "array",
  "items": { "$ref": "#/$defs/intent_to_commit" },
  "description": "Advisory FIFO queue for commit-window ownership. Array order is the queue order; this is not a mechanical lock."
},
"$defs": {
  "intent_to_commit": {
  "type": "object",
  "additionalProperties": false,
  "required": [
    "intent_id",
    "claim_id",
    "agent_id",
    "files",
    "commit_subject",
    "queued_at",
    "updated_at",
    "expires_at",
    "phase"
  ],
  "properties": {
    "intent_id":                 { "type": "string", "format": "uuid" },
    "claim_id":                  { "type": "string", "format": "uuid",
                                   "description": "Active claim this queue entry belongs to." },
    "agent_id":                  { "$ref": "#/$defs/agent_id" },
    "files":                     { "type": "array", "minItems": 1,
                                   "items": { "type": "string", "minLength": 1 },
                                   "description": "Repository-relative file paths the agent intends to stage." },
    "staged_bundle_fingerprint": { "type": "string",
                                   "description": "Optional SHA-256 over git diff --cached --name-status plus git diff --cached --full-index --binary." },
    "staged_name_status":        { "type": "string",
                                   "description": "Recorded git diff --cached --name-status output for staged-bundle inspection." },
    "commit_subject":            { "type": "string", "minLength": 1,
                                   "description": "Draft commit subject so peers can see the intended durable history label before it lands." },
    "queued_at":                 { "type": "string", "format": "date-time" },
    "updated_at":                { "type": "string", "format": "date-time",
                                   "description": "Refreshed by the owning agent on commit-skill phase changes." },
    "expires_at":                { "type": "string", "format": "date-time",
                                   "description": "Explicit wall-clock stale-reporting timestamp for handoff/consolidation; expiry does not auto-remove or auto-resolve the queue entry." },
    "phase":                     { "type": "string", "enum": ["queued","staging","pre_commit","abandoned"] },
    "notes":                     { "type": "string" }
  }
  }
}
```

Successful commits remove the queue entry in the same write that clears the
claim pointer. The durable commit is the completion record; v1.3.0 does not
preserve `phase=complete`.

**1d. Optional claim pointer**: claims may carry
`"intent_to_commit": "<intent_id>"` as a convenience pointer for discovery,
but the queue remains authoritative for ordering and lifecycle.

**1e. `closed-claims.schema.json`** reuses
`active-claims.schema.json#/$defs/claim` via `allOf`, so closed claims
naturally carry `intent_to_commit` if it was set at close time. Bump
`closed-claims.schema.json` to v1.3.0 in lockstep so the version line
remains coherent.

### 2. Commit-skill protocol changes — `commit/SKILL.md`

The skill already says it "coordinates the short-lived git index/head
commit window." Extend that coordination to write and clear the intent:

```text
1. Draft commit message; validate via scripts/check-commit-message.sh.
2. Read .agent/state/collaboration/active-claims.json. Find or register a
   claim for this agent identity covering the staging area.
3. POST INTENT — atomic update to active-claims.json:
     registry.commit_queue.push({
       intent_id: <uuid>,
       claim_id: <this claim>,
       agent_id: <this agent>,
       files: <about-to-stage list>,
       commit_subject: <draft subject>,
       queued_at: now(),
       updated_at: now(),
       expires_at: now() + <short explicit commit-window TTL>,
       phase: "queued"
     })
     claim.intent_to_commit = <intent_id>  # optional pointer
4. WAIT / QUEUE — if another fresh intent is phase=queued/staging/pre_commit,
   and appears ahead of this intent in commit_queue, wait or coordinate
   before staging. This is advisory, not refusal, but default discipline is
   one commit owner at a time.
5. UPDATE PHASE — phase: "staging"; git add <files>.
6. VERIFY OWNERSHIP — compute git diff --cached --name-only,
   git diff --cached --name-status, and git diff --cached --full-index
   --binary. If the staged file set is not exactly this intent's files, the
   staged-bundle fingerprint changed, or the commit subject differs from
   `commit_subject`, abort before commit and coordinate.
   This prevents wrong-intent commits.
7. UPDATE PHASE — phase: "pre_commit" (advisory: "hooks running, expect lock soon").
8. git commit (pre-commit hooks fire, lock held).
9a. ON SUCCESS — atomic update:
       remove this entry from registry.commit_queue
       remove claim.intent_to_commit
    The commit landing IS the durable record; clearing keeps the registry small.
9b. ON FAILURE — leave phase at "staging" or "pre_commit" and decide:
       - Retry: refresh updated_at + expires_at, keep going.
       - Abandon: set phase: "abandoned" so other agents see the dead intent
         until cleanup explicitly clears it.
```

### 3. Optional later session-counter increment — start-right skills

Do not implement this section in the queue-first pass unless the owner and
reviewers explicitly keep the session-counter primitive in scope.
If kept, `.agent/skills/start-right-quick/shared/start-right.md` and
`.agent/skills/start-right-thorough/shared/start-right-thorough.md` add two
short steps in the live-state reading order:

1. **Atomic increment**: `registry.session_counter += 1` (atomic
   read-modify-write under `.git/index.lock` would over-couple; better
   pattern is a separate `.agent/state/collaboration/session-counter.lock`
   advisory lockfile, OR accept lossy increment — see §6 race conditions).
2. **Refresh own intents**: for every claim owned by this agent identity
   carrying an `intent_to_commit`, set
   `intent_to_commit.session_counter_last_seen = registry.session_counter`.
   Presence proxy: each session the owning agent is alive, all their
   intents stay fresh.

Other agents do **not** touch another agent's intents.

### 4. Stale-intent reporting — `consolidate-docs.md § 7e`

Existing § 7e (collaboration-state audit) already reports stale active
claims, recent closures, decision-thread state, and schema validation.
Extend it with a fifth report:

> **Intent-to-commit snapshot**: for each claim with
> `intent_to_commit` or each `commit_queue` entry, compare `expires_at` to
> now. Report `[intent] <claim_id> <files> phase=<phase> fresh|stale`.
> Stale entries are owner-review and cleanup signals, not automatic blocks.
> Action: clear or mark abandoned only through the owning commit-skill or
> explicit consolidation cleanup; never block another agent on a stale intent.

### 5. Discovery contract for other agents

At session-open (start-right), agents read intents alongside claims.
Surface as discovery hits in the same form as active-claim discovery,
e.g.:

```text
[discovery] Codex (codex / GPT-5) intent_to_commit:
    files: [src/foo.ts, src/bar.ts]
    phase: staging
    queued_at: 2026-04-26T15:36:00Z
    expires_at: 2026-04-26T16:06:00Z (fresh)
```

Pre-commit overlap (an agent about to stage a file in another agent's
fresh `intent_to_commit`): three discipline-aligned options, choose
contextually:

1. **Proceed** (knowledge over refusal — WS3A default): post a shared-log
   note, attempt the commit, expect lock contention, retry on failure.
2. **Wait** via the Monitor pattern (`until [ ! -e .git/index.lock ]; do
   sleep 3; done` in a Monitor task) — appropriate when overlap is
   imminent and a few seconds saves a contention round.
3. **Append a decision-thread entry** if the overlap is non-trivial and
   needs structured async coordination.

The lock itself remains the synchronization primitive in all three
cases. The intent is upstream signal, not downstream gate.

Pre-commit ownership check (an agent about to run `git commit`): compare
`git diff --cached --name-status` with the agent's own fresh
`intent_to_commit.files`. If the staged set contains files outside that
intent, stop before commit. The correct next step is to unstage only with
owner/author coordination, wait for the owning agent to commit, or open a
decision thread. This check prevents correct file contents from landing under
the wrong commit description.

---

## Build-vs-Buy Attestation

Internal coordination protocol; no third-party vendor surface. Section
deliberately marked N/A.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

This is multi-session, Practice-domain, schema-changing work. When
promoted to `current/` and then `active/`, the executable plan will:

- declare a bounded simple plan at session entry per PDR-026;
- register an active claim covering the schema files, commit skill,
  start-right skills, consolidate-docs, and active-claims registry;
- post `intent_to_commit` entries via the commit skill (self-application:
  the implementation uses the protocol it installs);
- close own claims at session-handoff with `closure.kind: "explicit"`;
- run consolidate-docs § 7e at closure with the new intent-snapshot
  step exercised against the landed implementation.

---

## Promotion Trigger

Promote from `future/` → `current/` when **either**:

1. Owner explicitly directs promotion, **or**
2. A fourth lock-contention incident is logged on `main` or any active
   feature branch (three are already on `feat/otel_sentry_enhancements`
   2026-04-26), **or**
3. A second observed instance of an agent's staged set being wiped by
   parallel-commit churn is recorded in the napkin or shared log, **or**
4. Any observed instance of another agent's staged files landing under the
   wrong agent's commit message / intent description.

Threshold reasoning: three is already on the branch as of 2026-04-26;
the trigger is "next instance, wrong-intent capture, OR the owner says go".
The wrong-intent capture threshold is lower because it creates misleading
durable history even when the branch remains green.

---

## Prerequisites

1. WS3A claim-history schemas already landed (✅ as of commits
   `382ba258`, `2e2f49dc`).
2. WS3A consolidate-docs § 7e already extended for collaboration-state
   audit (✅ as of commit `83608407`).
3. Commit skill exists with explicit "coordinates the short-lived git
   index/head commit window" responsibility (✅ as of the
   parallel-agent commit-skill update landing on this branch — verify
   on promotion).
4. No WS3B sidebar / timeout / owner-escalation dependency: this plan
   sits inside WS3A's evidence-based lane, not WS3B's paused mechanics.

---

## Reviewer Scheduling (phase-aligned)

When promoted, follow the standard three-phase reviewer rhythm:

### Plan-phase (PRE-ExitPlanMode in `current/`) — challenges solution-class

- `assumptions-reviewer` — race-condition assumptions (lossy counter
  increment if retained, last-write-wins on registry); TTL-semantics assumptions;
  proportionality (do we genuinely need a fifth structured surface, or
  is shared-log free-form sufficient?).
- `architecture-reviewer-fred` — boundary discipline: does the
  intent_to_commit field belong on `active-claims.json` or in a dedicated
  `commit-intents.json`? Does the session counter belong on the registry
  root or in its own file?

### Mid-cycle (DURING execution) — challenges solution-execution

- `architecture-reviewer-wilma` — adversarial failure modes: agent
  crashes between phase=staging and phase=pre_commit; two agents
  increment the counter simultaneously; intent left behind by SIGKILL;
  registry write race during high-contention windows.
- `test-reviewer` — RED fixtures for the new schema validation, the
  intent lifecycle phases, and the stale-intent § 7e report.
- `code-reviewer` — gateway routing.

### Close (POST-execution) — verifies coherence

- `docs-adr-reviewer` — directive, rule, and command updates align with
  the schema.
- `release-readiness-reviewer` — GO / GO-WITH-CONDITIONS / NO-GO with
  explicit migration note (v1.2.0 → v1.3.0 schema bump).

---

## Risk and Tradeoffs

| Risk | Mitigation |
|---|---|
| **Race condition on session-counter increment**: two agents read N, both write N+1, lost update. | Accept lossy increment as advisory: the only consequence is TTL fires one session later than ideal, which is benign. Mitigation if observed in practice: read-modify-write under a `session-counter.lock` advisory file. |
| **Premature session-counter coupling**: queue semantics depend on a session primitive that is not yet proven. | Queue-first pass uses explicit timestamps. Session counter remains a separate follow-up unless deliberately implemented with start-right semantics and validation. |
| **Race on intent write**: two agents update `active-claims.json` concurrently, last writer wins. | Each agent only writes their own claim's intent, so collision is rare. When it happens, the lost intent post is recoverable on the next commit-skill invocation. |
| **Surface proliferation**: now five structured collaboration surfaces (shared log, active claims, closed claims, decision threads, intents) — cognitive load for new agents. | Intent reuses the existing claims file and `$ref`s existing definitions. The discovery contract is taught once at start-right; specific intent semantics are taught only at the commit skill. |
| **Premature optimisation**: only 3 contention events observed; could be a 2026-04-26 anomaly rather than a recurring pattern. | Promotion trigger is explicit: a fourth incident or owner-direct promotion. If the contention rate stays at three forever, the plan stays in `future/`. |
| **Self-application during landing**: the commit skill that lands the protocol must use the protocol it's landing. | Stage the schema bump in a single atomic commit before the commit-skill update lands; manually post the first intent for the implementation commit if needed. |
| **Drift between intent and reality**: agent posts intent, then changes their mind about which files to stage. | Intent is advisory; refreshing it before each `git add` is part of the commit-skill workflow. Mismatched intent vs actual stage is not a failure mode that breaks anything — only the commit-skill self-discipline. |
| **Wrong-intent commit capture**: one agent's staged set lands under another agent's commit message. | Commit skill verifies staged files against the posting agent's fresh intent immediately before `git commit`; mismatch aborts before history is written. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md §First Question** — could it be simpler? Yes: shared-log
  free-form entries instead. But the structured surface is justified by
  (a) the commit skill needing to read it programmatically, (b)
  consolidate-docs needing to validate it, and (c) the queue needing exact
  staged-bundle ownership checks. Free-form would not satisfy these.
- **principles.md §Strict and Complete** — additive schema bump (1.2.0 →
  1.3.0), explicit phase enum, no optional/permissive fallback.
- **principles.md §Owner Direction Beats Plan** — owner already flagged
  the gap twice; this plan formalises their direction.
- **agent-collaboration.md §Knowledge and Communication, Not Mechanical
  Refusals** — intents are advisory discovery surface; they never block.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

When promoted, update propagation surfaces:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
   — extend artefact taxonomy with intent_to_commit.
2. `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
   — note the schema bump in the practice-index bridge link list if a
   v1.3.0 example is added.
3. `.agent/practice-core/practice.md` — Collaboration State surface
   already names "active claims, closed claim history, and decision
   threads"; add intent-to-commit when implementation lands.
4. `.agent/practice-core/CHANGELOG.md` — record the v1.3.0 schema bump
   and intent-to-commit installation.
5. `.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md`
   — collaboration-state row already names the relevant files; either
   extend the row or add a sibling row depending on outcome of Fred's
   boundary review.
6. `.agent/memory/operational/collaboration-state-conventions.md` — add
   the intent-to-commit lifecycle; add session-counter details only if that
   primitive lands.
7. `.agent/skills/start-right-quick/shared/start-right.md` and
   `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   — surface open queue entries; register counter-increment steps only if
   that primitive lands.
8. `.agent/skills/commit/SKILL.md` — add the post-intent / clear-intent
   protocol.
9. `.agent/commands/consolidate-docs.md` — extend § 7e with the
   intent-snapshot report.

---

## Open Design Questions

These are deliberately deferred to plan-phase reviewer dispatch when the
plan is promoted, not resolved in this strategic intent:

1. **Counter location (if retained)**: top-level field on `active-claims.json` (cohesive
   with claims, fewer files) vs dedicated `session-counter.json` (atomic
   increment scope is trivial). Default in this plan: embedded.
   Architecture reviewer (Fred) decides at promotion.
2. **Default `expires_at` duration**: choose the explicit wall-clock stale
   reporting window for a commit queue entry. Default should be short and
   advisory; expiry is a reporting signal, not an auto-clear.
3. **Areas vs files in `intent_to_commit`**: pure files (matches `git add`
   argument list) vs globs/areas (matches active-claim shape). Default:
   files only for v1.3.0; revisit if commit batches grow large.
4. **Audit trail of completed intents**: discard on commit (current
   design — git log + closed claims are the durable record) vs preserve
   in `closed-claims.archive.json`. Default: discard.
5. **Counter increment semantics (if retained)**: every session-open vs only sessions
   that touch claims. Default: every session-open (semantically
   correct, slightly more writes).
6. **Cross-platform increment idempotency**: if the same agent runs
   start-right twice in one logical session (e.g. crash and restart
   without `/jc-session-handoff`), does the counter increment twice?
   Strict answer: yes — each start-right is a session by ritual. Lazy
   answer: dedupe by agent_id within a 60s window. Default: strict.

---

## Non-Goals

- **No mechanical refusal mechanic**: agents read intents but never
  refuse work based on them. The lock and the shared log do the
  enforcement.
- **No mechanical global commit serialization**: this is not a mutex. The
  queue is advisory and exists to preserve intent/ownership before history is
  written.
- **No WS3B mechanics**: no sidebar, no timeout, no owner-escalation
  triggered by intents. Those remain paused.
- **No extension to product-level commits outside this branch's
  multi-agent context**: the protocol is for parallel-agent coordination
  on the same git tree; single-agent sessions on isolated branches
  don't benefit and shouldn't pay the registry-write cost.
- **No retroactive coverage of past commits**: intents are forward-only;
  consolidate-docs does not back-fill historical intent records.

---

## Self-Application Test

The queue implementation self-application test completed in commit `5c39d1d4`.
That commit posted and cleared an `intent_to_commit` per the new commit skill,
exercising the schema, the commit-skill flow, and the registry write path
against the implementation that created them.

The remaining `session_counter` idea has no self-application evidence and no
real primitive. Keep it future-only unless the owner deliberately promotes that
slice.

This mirrors the WS1 self-application pilot
([`a5d33519`](.agent/state/collaboration/closed-claims.archive.json#claim-fbde22cf))
where the WS1 claim was opened and closed within the same atomic
landing commit.

---

## Dependencies

**Blocking**: none (all prerequisites listed above are met).

**Related plans**:

- [Multi-Agent Collaboration Protocol](../current/multi-agent-collaboration-protocol.plan.md)
  — parent plan; this is an extension of WS1's claims registry.
- [Sidebar and Escalation (WS3B, paused)](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
  — independent; intents do not promote WS3B mechanics.
- [WS3A Decision Thread + Claim History (archived completed)](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
  — schema lineage; v1.3.0 builds on v1.2.0's `git` area kind.

---

## Promotion Checklist

Queue slice outcome:

- [x] Promoted into `current/`, implemented, and archived as
      [`intent-to-commit-queue.execution.plan.md`](../archive/completed/intent-to-commit-queue.execution.plan.md).
- [x] Resolved Phase 0 owner gates for queue file/root location, default
      explicit expiry, areas vs files, and session-counter exclusion.
- [x] Added RED/GREEN coverage for the schema bump and queue lifecycle in the
      completed execution plan.
- [x] Updated parent
      [`multi-agent-collaboration-protocol.plan.md`](../current/multi-agent-collaboration-protocol.plan.md)
      to reference the archived child as the completed WS1 extension.
- [x] Updated collection
      [`README.md`](../current/README.md) and
      [`roadmap.md`](../roadmap.md) with the lane entry.
- [x] Updated this plan's listing in the [`future/README.md`](README.md)
      to identify the queue slice as archived and the residual
      `session_counter` slice as future-only.

Future `session_counter` promotion checklist:

- [ ] Owner explicitly confirms a real session-counter primitive is wanted.
- [ ] Define the primitive's source of truth, freshness semantics, and failure
      mode before making TTL depend on it.
- [ ] Keep queue freshness timestamp-based until the primitive exists.
