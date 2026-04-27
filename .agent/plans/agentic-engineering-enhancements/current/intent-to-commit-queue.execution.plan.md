---
name: "Owner-Directed Intent-to-Commit Queue"
overview: "Promote the future queue plan into an executable implementation slice for advisory commit ordering and exact staged-bundle verification."
todos:
  - id: ws0-promotion
    content: "WS0: Promote/update the strategic source plan and record the latest queue-race evidence."
    status: complete
  - id: ws1-red
    content: "WS1 (RED): Add root-script tests for queue ordering, exact staged-file verification, staged fingerprint mismatch, and success cleanup. Tests MUST fail before implementation."
    status: complete
  - id: ws2-green
    content: "WS2 (GREEN): Implement schema v1.3.0 commit_queue plus repo-owned helper script for enqueue, phase, staged fingerprint, verification, and completion."
    status: complete
  - id: ws3-refactor-docs
    content: "WS3 (REFACTOR): Update commit, start-right, collaboration, and consolidation guidance without introducing session-counter TTL semantics."
    status: complete
  - id: ws4-quality-gates
    content: "WS4: Run targeted tests, JSON validation, markdown checks, practice vocabulary, and fitness gates."
    status: complete
  - id: ws5-handoff-consolidation
    content: "WS5: Run session handoff and requested consolidation, then close active claim without staging or committing."
    status: complete
isProject: false
---

# Owner-Directed Intent-to-Commit Queue

**Last Updated**: 2026-04-27
**Status**: 🔄 ACTIVE
**Scope**: Ordered advisory commit queue plus exact staged-bundle verification.

Source strategy:
[`future/intent-to-commit-and-session-counter.plan.md`](../future/intent-to-commit-and-session-counter.plan.md)

---

## Context

The completed `git:index/head` commit-window claim made commit collisions
visible, but the 2026-04-27 `2ccefad4` turn-race showed visibility is not
ordering. The implementation slice therefore installs a first-class ordered
`commit_queue` on the active-claims registry and a repo-owned helper that
verifies the staged bundle immediately before history is written.

### Problem Statement

Four clash types are now evidenced on this branch:

- A: foreign staged files substitute for the author's intended bundle.
- B: the author's staged files disappear and a no-op commit lands.
- C: foreign staged files accrete into the author's intended bundle.
- D: a commit-window claim exists, but another commit still wins the turn.

The queue reduces turn-races by making FIFO order explicit. Exact staged-bundle
verification catches any clash the advisory queue misses.

### Existing Capabilities

- `active-claims.json` already carries live advisory claims.
- `git:index/head` claims already mark short commit windows.
- The commit skill already validates commitlint before `git commit`.
- Consolidation already audits active claims, closure history, conversations,
  escalations, and schema parseability.

---

## Design Principles

1. **Advisory, not mechanical** — the queue informs judgement and the commit
   skill; it is not a mutex or refusal mechanism.
2. **Exact before durable** — staged files, staged fingerprint, and commit
   subject must match the queued intent immediately before `git commit`.
3. **Cross-vendor repo ownership** — JSON, scripts, skills, commands, and
   rules in the repo are sufficient; platform features are helpers only.
4. **No session-counter dependency** — v1.3.0 uses explicit wall-clock
   freshness. `session_counter` remains future work unless a real primitive
   lands in the same pass.

**Non-Goals**:

- No global mechanical commit lock.
- No compatibility layer for v1.2.0 authoring.
- No `session_counter` field or session-count TTL semantics.
- No staging, committing, or history rewrite in this implementation session.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

- Session entry: start-right thorough, active-claims scan, shared-log scan, and
  staged-index inspection ran before implementation edits.
- Work shape: this executable plan is the active work-shape artefact.
- Pre-edit coordination: active claim
  `fa936690-133c-4d49-a6e0-06bac78c9834` covers queue/schema/doc/state edits.
- During work: shared-log updates record queue implementation and staged-index
  avoidance.
- Session handoff: close this claim explicitly and update thread/continuity
  records.
- Deep consolidation: owner explicitly requested `jc-consolidate-docs`; run it
  before closing the session.

---

## WS1 — Queue Helper Tests (RED)

### 1.1: Root Script Behaviour

**Tests**:

- `scripts/commit-queue.unit.test.ts` proves FIFO entries ahead, ignores
  expired entries, accepts exact staged bundles, rejects accretion,
  disappearance, and fingerprint mismatch, and removes successful entries.

**Acceptance Criteria**:

1. Targeted test command fails before `scripts/commit-queue.mjs` exists.
2. Failure reason is missing implementation, not unrelated gate noise.

**Evidence**:

```bash
pnpm exec vitest run scripts/commit-queue.unit.test.ts --config vitest.config.ts
# Failed as expected: Cannot find module './commit-queue.mjs'
```

---

## WS2 — Queue Helper and Schema (GREEN)

### 2.1: Schema v1.3.0

**Files**:

- `.agent/state/collaboration/active-claims.schema.json`
- `.agent/state/collaboration/closed-claims.schema.json`
- `.agent/state/collaboration/active-claims.json`

**Changes**:

- Require root `commit_queue: []` for v1.3.0 registries.
- Add `$defs.intent_to_commit` with FIFO fields, explicit timestamps, phase,
  optional staged bundle fingerprint, and optional recorded name-status.
- Add optional claim pointer `intent_to_commit`.
- Bump active and closed schemas to `1.3.0`.

### 2.2: Repo-Owned Queue Helper

**File**: `scripts/commit-queue.mjs`

**Commands**:

- `enqueue` posts a queued intent and points the owning claim at it.
- `phase` moves an intent through `queued`, `staging`, `pre_commit`, or
  `abandoned`.
- `record-staged` records `git diff --cached --name-status` plus the
  SHA-256 fingerprint over name-status and binary patch.
- `verify-staged` verifies no fresh FIFO entries are ahead, the staged file set
  equals declared files exactly, the subject matches, and the staged fingerprint
  has not changed.
- `complete` removes the successful queue entry and clears the claim pointer.

**Deterministic Validation**:

```bash
pnpm exec vitest run scripts/commit-queue.unit.test.ts --config vitest.config.ts
node -e "JSON.parse(await import('node:fs/promises').then(fs => fs.readFile('.agent/state/collaboration/active-claims.json', 'utf8')))"
```

---

## WS3 — Workflow Documentation (REFACTOR)

Update these workflow surfaces so agents can use the queue without platform
coupling:

- `.agent/skills/commit/SKILL.md`
- `.agent/skills/start-right-quick/shared/start-right.md`
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
- `.agent/rules/register-active-areas-at-session-open.md`
- `.agent/rules/respect-active-agent-claims.md`
- `.agent/memory/operational/collaboration-state-conventions.md`
- `.agent/memory/operational/collaboration-state-lifecycle.md`
- `.agent/commands/consolidate-docs.md`

Acceptance criteria:

1. Commit flow posts intent before staging, records staged fingerprint, verifies
   exactly before commit, then clears successful intent.
2. Start-right surfaces open queue entries as discovery signals.
3. Consolidation §7e reports commit queue entries and stale/abandoned state.
4. No doc makes session-count TTL load-bearing.

---

## WS4 — Quality Gates

Run one gate at a time:

```bash
pnpm exec vitest run scripts/commit-queue.unit.test.ts --config vitest.config.ts
pnpm test:root-scripts
node -e "JSON.parse(await import('node:fs/promises').then(fs => fs.readFile('.agent/state/collaboration/active-claims.json', 'utf8')))"
node -e "JSON.parse(await import('node:fs/promises').then(fs => fs.readFile('.agent/state/collaboration/active-claims.schema.json', 'utf8')))"
node -e "JSON.parse(await import('node:fs/promises').then(fs => fs.readFile('.agent/state/collaboration/closed-claims.schema.json', 'utf8')))"
pnpm markdownlint-check:root
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
git diff --check
```

If a gate fails due to pre-existing unrelated dirty work, record the exact
failure and avoid broad fixes outside this claim.

**Evidence**:

- `pnpm exec vitest run scripts/commit-queue.unit.test.ts --config vitest.config.ts`
  passed.
- `pnpm test:root-scripts` passed (12 files / 120 tests).
- JSON parse checks passed for active-claims, active-claims schema, and
  closed-claims schema.
- `pnpm markdownlint-check:root`, `pnpm practice:vocabulary`,
  `pnpm practice:fitness:informational`,
  `pnpm practice:fitness:strict-hard`, `git diff --check`, and targeted
  Prettier checks passed.
- Direct `pnpm exec eslint scripts/commit-queue.mjs
  scripts/commit-queue.unit.test.ts` failed on the repo's typed-rule
  parser-services configuration for `.mjs`; `pnpm test:root-scripts` is the
  recorded supported root-script validation path.

---

## Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Queue treated as a lock | Every workflow surface states advisory ordering, not mechanical refusal. |
| Stale queue entries strand agents | Expiry is reporting only; consolidation and commit skill can mark abandoned or clear deliberately. |
| Fingerprint false confidence | Verification checks both exact staged file set and SHA-256 over name-status plus binary patch. |
| Registry write races | The helper is repo-owned and narrow, but still advisory; lost queue writes are recoverable by re-enqueue before staging. |
| Dirty shared index | This session does not stage or commit, and the plan requires a fresh `git:index/head` claim later. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md §Strict and Complete** — exact file-set and fingerprint
  equality before commit.
- **principles.md §Owner Direction Beats Plan** — owner explicitly promoted
  queue-first implementation.
- **testing-strategy.md** — RED test existed before helper implementation.
- **schema-first-execution.md** — not an SDK/OpenAPI surface; JSON schema is
  the repo-owned protocol contract.
- **agent-collaboration.md** — knowledge and communication remain the
  mechanism; the queue does not become a refusal gate.

---

## Consolidation

Run `jc-session-handoff` and `jc-consolidate-docs` at close because the owner
explicitly requested both and this session changes collaboration doctrine.

**Evidence**:

- `repo-continuity.md` and this thread record now identify the queue
  implementation as working-tree complete, unstaged, and awaiting
  self-application under a fresh `git:index/head` claim.
- Consolidation archived stale claim
  `9c7f4e51-bd1a-4dba-9f2e-3c6e8a4d2f10` with `closure.kind: "stale"`.
- This session's active claim
  `fa936690-133c-4d49-a6e0-06bac78c9834` was closed explicitly after
  validation. No staging or commit was performed.

---

## Dependencies

**Blocking**: none for unstaged implementation.

**Related Plans**:

- [Multi-Agent Collaboration Protocol](multi-agent-collaboration-protocol.plan.md)
  — parent collaboration plan.
- [Future source plan](../future/intent-to-commit-and-session-counter.plan.md)
  — strategic evidence and wider session-counter follow-up.
