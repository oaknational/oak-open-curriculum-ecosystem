---
name: "Intent to Commit + Session Counter"
overview: "Add advisory intent_to_commit / commit-queue signalling to the active-claims registry, gated by a session-count TTL, with the commit skill writing intent before staging and verifying staged ownership before commit."
isProject: false
---

# Intent to Commit + Session Counter — Strategic Plan

**Status**: 🟡 NOT STARTED (future / strategic intent)
**Promotion signal**: 🟠 EVIDENCE THRESHOLD MET (2026-04-26 staged-bundle
integrity failures now include substitution, disappearance, and accretion;
promote only when owner explicitly asks to implement the queue)
**Domain**: Agentic Engineering Enhancements
**Parent**: [Multi-Agent Collaboration Protocol](../current/multi-agent-collaboration-protocol.plan.md) — extends WS1 (active claims) and the WS3A schema family
**Related**:
[`agent-collaboration.md`](../../../directives/agent-collaboration.md);
[`active-claims.schema.json`](../../../state/collaboration/active-claims.schema.json);
[`closed-claims.schema.json`](../../../state/collaboration/closed-claims.schema.json);
[`commit/SKILL.md`](../../../skills/commit/SKILL.md);
[`register-active-areas-at-session-open.md`](../../../rules/register-active-areas-at-session-open.md);
[`consolidate-docs.md § 7e`](../../../commands/consolidate-docs.md);
[`napkin.md`](../../../memory/active/napkin.md);
[`collaboration log`](../../../state/collaboration/shared-comms-log.md)

---

## Problem and Intent

The WS3A protocol gives parallel agents three coordination surfaces: the
shared communication log (free-form discovery), the active-claims registry
(area-level "I'm working in this region"), and decision threads (structured
async coordination). None of these directly addresses the **commit window**:
the short-lived interval where an agent is staging files, the pre-commit
hook is running, and `.git/index.lock` is held. They also do not ensure that
the files in the index still belong to the agent whose commit message and
intent are about to become durable history.

Six concrete pieces of evidence accumulated on `feat/otel_sentry_enhancements`
2026-04-26:

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

The three clash types (A substitution, B disappearance, C accretion) form a
small taxonomy the queue and verify-ownership steps must defend against
together. The queue (§ 2.4 WAIT/QUEUE) reduces the probability of any
clash by serialising commit windows; the verify step (§ 2.6 VERIFY
OWNERSHIP) is the strict last-line defence that catches any clash the
queue missed.

The intent of this plan is to install a **non-binding, advisory** intent
signal and lightweight commit queue on the active-claims registry, written by
the commit skill before staging, verified against the staged set immediately
before commit, and cleared after the commit lands, gated by a
**session-count TTL** that tracks agent activity rather than wall-clock time.

The signal is advisory because the WS3A doctrine is "knowledge and
communication, not mechanical refusals" — the lock itself remains the
synchronization primitive; intents are a discovery surface upstream of it.
The queue is likewise advisory: it tells agents whose intent owns the next
commit window, and it forces a self-check before making history durable.

---

## Proposed Solution

### 1. Schema bump — `active-claims.schema.json` v1.2.0 → v1.3.0

Two additive changes (compatible with v1.x readers per the
`$comment_compatibility` discipline):

**1a. New top-level `session_counter`** field on the registry root:

```json
"session_counter": {
  "type": "integer",
  "minimum": 0,
  "description": "Monotonically increasing session counter; incremented atomically by start-right skills at session-open. The TTL primitive for intent_to_commit (and an option for future claim-staleness work)."
}
```

**1b. New optional `intent_to_commit` field** on each claim entry, plus a
matching `$defs/intent_to_commit`:

```json
"intent_to_commit": {
  "type": "object",
  "additionalProperties": false,
  "required": [
    "files",
    "commit_subject",
    "started_at",
    "session_counter_started",
    "session_counter_last_seen",
    "ttl_sessions",
    "phase"
  ],
  "properties": {
    "files":                     { "type": "array", "minItems": 1,
                                   "items": { "type": "string", "minLength": 1 },
                                   "description": "Repository-relative file paths the agent intends to stage." },
    "staged_fingerprint":        { "type": "string",
                                   "description": "Optional stable summary of git diff --cached --name-status after staging; used to detect foreign staged content before commit." },
    "commit_subject":            { "type": "string", "minLength": 1,
                                   "description": "Draft commit subject so peers can see the intended durable history label before it lands." },
    "started_at":                { "type": "string", "format": "date-time" },
    "session_counter_started":   { "type": "integer", "minimum": 0 },
    "session_counter_last_seen": { "type": "integer", "minimum": 0,
                                   "description": "Refreshed by the owning agent only, at every session-open and on every commit-skill invocation. Stale = (registry.session_counter - this) > ttl_sessions." },
    "ttl_sessions":              { "type": "integer", "minimum": 1, "default": 3 },
    "phase":                     { "type": "string", "enum": ["queued","staging","pre_commit","complete","abandoned"] },
    "completed_at":              { "type": "string", "format": "date-time" },
    "completed_commit":          { "type": "string", "minLength": 7,
                                   "description": "Commit SHA when phase=complete." },
    "notes":                     { "type": "string" }
  }
}
```

**1c. `closed-claims.schema.json`** reuses
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
     claim.intent_to_commit = {
       files: <about-to-stage list>,
       commit_subject: <draft subject>,
       started_at: now(),
       session_counter_started: registry.session_counter,
       session_counter_last_seen: registry.session_counter,
       ttl_sessions: 3,
       phase: "queued"
     }
4. WAIT / QUEUE — if another fresh intent is phase=queued/staging/pre_commit,
   wait or coordinate before staging. This is advisory, not refusal, but
   default discipline is one commit owner at a time.
5. UPDATE PHASE — phase: "staging"; git add <files>.
6. VERIFY OWNERSHIP — compute git diff --cached --name-status. If the staged
   set is not exactly this intent's files, abort before commit and coordinate.
   This prevents wrong-intent commits.
7. UPDATE PHASE — phase: "pre_commit" (advisory: "hooks running, expect lock soon").
8. git commit (pre-commit hooks fire, lock held).
9a. ON SUCCESS — atomic update:
       phase: "complete"
       completed_at: now()
       completed_commit: <new HEAD SHA>
    Then, in the same atomic write, REMOVE the intent_to_commit field
    (the commit landing IS the durable record; clearing keeps the
    registry small).
9b. ON FAILURE — leave phase at "staging" or "pre_commit" and decide:
       - Retry: refresh started_at + session_counter_last_seen, keep going.
       - Abandon: set phase: "abandoned" so other agents see the dead intent
         until TTL clears it.
```

### 3. Session-counter increment — start-right skills

`.agent/skills/start-right-quick/shared/start-right.md` and
`.agent/skills/start-right-thorough/shared/start-right-thorough.md` add
two short steps in the live-state reading order:

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
> `intent_to_commit`, compute
> `staleness = registry.session_counter - intent.session_counter_last_seen`.
> Report `[intent] <claim_id> <files> phase=<phase> staleness=<n>`.
> Items with `staleness > ttl_sessions` surface as
> `[intent-stale]`. Action: clear the `intent_to_commit` field if the
> parent claim is still active; archive the whole claim if it is also
> stale (existing § 7e archival path); never block another agent on a
> stale intent.

### 5. Discovery contract for other agents

At session-open (start-right), agents read intents alongside claims.
Surface as discovery hits in the same form as active-claim discovery,
e.g.:

```text
[discovery] Codex (codex / GPT-5) intent_to_commit:
    files: [src/foo.ts, src/bar.ts]
    phase: staging
    started_at: 2026-04-26T15:36:00Z
    staleness: 0 sessions (fresh)
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
  increment, last-write-wins on registry); TTL-semantics assumptions;
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
  consolidate-docs needing to validate it, (c) the session-count TTL
  needing schema-grounded fields. Free-form would not satisfy any of the
  three.
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
   the intent-to-commit lifecycle and the session-counter increment
   ritual.
7. `.agent/skills/start-right-quick/shared/start-right.md` and
   `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   — register the counter-increment + intent-refresh steps.
8. `.agent/skills/commit/SKILL.md` — add the post-intent / clear-intent
   protocol.
9. `.agent/commands/consolidate-docs.md` — extend § 7e with the
   intent-snapshot report.

---

## Open Design Questions

These are deliberately deferred to plan-phase reviewer dispatch when the
plan is promoted, not resolved in this strategic intent:

1. **Counter location**: top-level field on `active-claims.json` (cohesive
   with claims, fewer files) vs dedicated `session-counter.json` (atomic
   increment scope is trivial). Default in this plan: embedded.
   Architecture reviewer (Fred) decides at promotion.
2. **Default `ttl_sessions`**: 3 or 5? 3 means "if I miss 3+ sessions in
   a row, my intent is stale"; 5 is more lag-tolerant. Default in this
   plan: 3.
3. **Areas vs files in `intent_to_commit`**: pure files (matches `git add`
   argument list) vs globs/areas (matches active-claim shape). Default:
   files only for v1.3.0; revisit if commit batches grow large.
4. **Audit trail of completed intents**: discard on commit (current
   design — git log + closed claims are the durable record) vs preserve
   in `closed-claims.archive.json`. Default: discard.
5. **Counter increment semantics**: every session-open vs only sessions
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

When implemented, the very commit landing the protocol MUST itself post
and clear an `intent_to_commit` per the new commit skill — exercising
the schema, the commit-skill flow, and the registry write path against
the implementation that creates them. The commit message MUST cite the
intent_id (or at least state "intent posted via the new commit skill,
cleared on success") so a future audit can verify the self-application
landed.

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

When promoted to `current/`:

- [ ] Move file from `future/` to `current/`; rename if scope tightens.
- [ ] Add Phase 0 owner gates (counter location, default `ttl_sessions`,
      areas vs files) — resolve via `assumptions-reviewer` +
      `architecture-reviewer-fred` dispatch before WS1.
- [ ] Add WS1 RED fixtures for the schema bump and intent lifecycle.
- [ ] Update parent
      [`multi-agent-collaboration-protocol.plan.md`](../current/multi-agent-collaboration-protocol.plan.md)
      to reference this child as the WS1 extension.
- [ ] Update collection
      [`README.md`](../current/README.md) and
      [`roadmap.md`](../roadmap.md) with the lane entry.
- [ ] Move this plan's listing in the [`future/README.md`](README.md)
      to "Promoted to `current/` <date>" form (matching the convention
      already used for `planning-specialist-capability.plan.md`).
