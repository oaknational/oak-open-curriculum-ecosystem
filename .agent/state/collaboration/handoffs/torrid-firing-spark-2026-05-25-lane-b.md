---
agent_name: Torrid Firing Spark
session_id_prefix: 5054f8
platform: claude
model: claude-opus-4-7
claim_id: 2f6d1d40-c3f8-4d78-b604-bfd8bebb7157
created_at: 2026-05-25T20:55:00Z
last_updated_at: 2026-05-25T20:55:00Z
purpose: pre-compaction freeze for same-session resume (NOT cross-agent handoff)
---

# Torrid Firing Spark — Lane B Pre-Compaction Handoff (PDR-063 four-section freeze)

## Context for post-compaction resume

This handoff is for the SAME session resuming post-compaction. Owner direction at 2026-05-25 ~20:53Z: *"when you come to a sensible point, pause the work, create a handoff, and prepare for compaction, post-compaction you will resume your work."* No new agent picks up the claim; my own future-self does.

Pair: n=2 session with **Feathered Winging Cliff** (`57e615`). Lanes: Feathered = Lane A (A1 heartbeat mechanical state-binding), me = Lane B (B1 hook policy menu-frame block + B2 CLI body-length gate + B3 ping-before-escalate rule).

Plan brief (authoritative): `.agent/plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md` §"Next session — n=2 ENFORCEMENT BUNDLE" lines 110-174.

---

## Section 1 — Current edit state

### Landed (in working tree, NOT committed)

**B1 — hook policy menu-framing block**:

- `.agent/hooks/policy.json`: four new `scoped_blocks` entries appended after the SHA-regex block. Patterns: `for owner verdict` / `for owner decision` / `for owner ratification` / `for owner approval`. Each scoped to architectural-doc paths. Description field updated (was "two kinds" → "three kinds").
- `agent-tools/tests/scoped-blocks-menu-framing.unit.test.ts`: new file, 5 tests all passing (verified via `pnpm vitest run tests/scoped-blocks-menu-framing.unit.test.ts`).
- `agent-tools/scripts/check-blocked-content.unit.test.ts`: REVERTED to original state (initial describe-block addition was placed where vitest config doesn't pick it up; moved to `tests/`).

**B3 — ping-before-escalate rule**:

- `.agent/rules/ping-before-escalate.md`: new canonical rule (~90 lines).
- `.claude/rules/ping-before-escalate.md`: new one-line forwarder.
- `.cursor/rules/ping-before-escalate.mdc`: new frontmatter + forwarder.
- `RULES_INDEX.md`: entry added at alphabetically-correct position between `per-user-memory-is-a-buffer.md` and `plan-body-first-principles-check.md`.

**One-line state repair**:

- `.agent/state/collaboration/active-claims.json`: corrupted `claimed_at` on my own claim (`"2026-05-25T19:34:27.3NZ"` from macOS `%3N` shell-expansion failure) repaired to `"2026-05-25T19:34:27.300Z"`. The corruption was root-cause for all `comms send` failing with "Invalid time value". Surfaced as failure-mode comms event (b797cc73-87ac-4003-b89e-685bd00b22d9).

**Comms-event substrate** (uncommitted untracked files in `.agent/state/collaboration/comms/`):

- `e0672ff3-...`: my team-start broadcast.
- `a3e03707-...`: my coordination-ack broadcast.
- `b797cc73-...`: my failure-mode event (claims open --now validation gap).
- `3775d29b-...`: an early heartbeat (test).
- Plus Feathered's events and comms-seen state files.

### Out-of-lane (Feathered's A1, in working tree, NOT yet committed at handoff time)

- `agent-tools/src/collaboration-state/cli-comms-commands.ts` (modified)
- `agent-tools/src/collaboration-state/cli-options.ts` (modified)
- `agent-tools/src/collaboration-state/cli-spec-options.ts` (modified)
- `agent-tools/src/collaboration-state/comms-heartbeat-body.ts` (new)
- `agent-tools/src/collaboration-state/comms-heartbeat-cli.ts` (new)
- `agent-tools/tests/collaboration-state/comms-heartbeat-body.unit.test.ts` (new)
- `agent-tools/tests/collaboration-state/comms-tags.integration.test.ts` (modified)

Feathered's commit pending after `pnpm check` (per their last broadcast); A1 dist build has already propagated (my heartbeat now correctly rejects `--body` argv).

### Heartbeat cron state

**STOPPED** at 20:54Z (failing under the new A1 cure because my command still passed `--body`). The new shape requires:

```bash
--tag heartbeat \
--claim-id 2f6d1d40-c3f8-4d78-b604-bfd8bebb7157 \
--intent-id <none-or-active-intent-id> \
--branch docs/agent-collaboration-enhancements \
--current-cycle-label <lane-b-stage-label>
```

Reference: `agent-tools/src/collaboration-state/comms-heartbeat-cli.ts` (Feathered's new file).

**Watcher (task `bvn6t65lx`) is still running.** Do not restart it; just restart heartbeat cron post-compaction.

---

## Section 2 — In-flight reasoning (reviewer findings to address)

Four reviewers dispatched on B1+B3 (sonnet model each), parallel-foreground, results landed:

### code-expert (LGTM-with-suggestions)

- **Important**: B1 unit test only exercises 1 of 4 phrases (`for owner verdict`). The other three blocks are structurally identical so risk is low, but a parametrised `it.each` covering all 4 phrases is trivial and closes the regression gap. **Action**: extend `tests/scoped-blocks-menu-framing.unit.test.ts` with `it.each` or three additional `it` blocks varying only the pattern string.
- **Important**: B3 rule's step 1 (`git log --author=<their email>`) is not reliably executable because agents do not have canonical email addresses (commits use host git config user.email). **Action**: rewrite step 1 to use a time-bounded scan (`git log --since="15 minutes ago" --oneline`) with grep on agent-name in commit subject/body, OR remove the email phrasing in favour of a name-based grep.
- **Note**: code-expert otherwise APPROVED. No blockers.

### docs-adr-expert (1 BLOCKING + 1 minor)

- **BLOCKING**: ADR-186 cited as plain prose in `Related Surfaces` section of the rule, with no Markdown link. **Action**: wrap with a relative-path Markdown link: `[ADR-186](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md)`.
- **Minor**: §Trigger does not reference PDR-078 §4 (Exemptions) where the marshal-cycle / sub-agent-dispatch / coordinator-handoff exemptions already establish first-class pre-broadcast suppressors. One sentence pointing to §4 would close the gap. **Action**: add the sentence; small.

### config-expert (COMPLIANT, no blockers)

- Schema compliance: PASS on all four entries.
- JSON structural integrity: PASS.
- Two informational notes (substring matching on `principles.md` and `archive/`; memory/active surface intentionally not in scope). No action required.

### assumptions-expert (CONCERNS)

- **Important**: `for owner approval` carries the highest false-positive risk of the four — common in legitimate governance prose ("plan ready for owner approval", "changes will be sent for owner approval before merging"). The cure's signal-vs-noise ratio improves if this phrase is removed or its `include_paths` narrowed to `.agent/practice-core/` only. **Action**: either remove the `for owner approval` entry from `policy.json` OR narrow its include_paths to practice-core only. My recommendation: remove. The other three phrases ("verdict", "decision", "ratification") carry the menu-adjudication semantic precisely; "approval" is too generic.
- **Observation**: assumptions-expert flagged the path-matching semantics for `archive/` should be verified against `findAddedScopedBlock` to confirm substring match (not path-anchored). Action: low-priority verification; the existing PDR-044 hedging blocks use the same shape without incident, so the engine is almost certainly substring-matching. Optional regression test in `tests/scoped-blocks-menu-framing.unit.test.ts` covering an `archive/` path exclusion.

### Order to apply (post-compaction)

1. Fix B3 rule (docs-adr-expert BLOCKING + minor + code-expert email issue) — one Edit pass on `.agent/rules/ping-before-escalate.md`.
2. Fix B1 policy (assumptions-expert: remove `for owner approval` entry) — one Edit pass on `.agent/hooks/policy.json` + update description field reference from "four phrases" to "three phrases" (if currently named explicitly).
3. Fix B1 test (code-expert: parametrise across remaining phrases) — one Edit pass on `tests/scoped-blocks-menu-framing.unit.test.ts`. Re-run vitest to confirm.
4. Move to B2.

---

## Section 3 — Decisions made (this session)

1. **Lane assignment** (settled with Feathered): Feathered → Lane A; me → Lane B (B1+B3 in parallel with A1; B2 sequenced post-A1).
2. **First-broadcaster convention**: Feathered's team-start was ~24s ahead of mine. Non-load-bearing since preferences were complementary.
3. **Gatekeeper-specialisation** (per `gatekeeper-specialisation` memory): Feathered runs `pnpm check` for round 1 (A1 stage→commit); I run round 2 (B2 stage→commit). B1+B3 commits piggy-back on round 2 OR run their own quick lint pass (no type-checked source touched).
4. **B1 phrase set**: four literal scoped_blocks instead of regex co-occurrence detection. Co-occurrence is brittle; single-phrase blocks on scoped paths is the simpler, more complete cure.
5. **B1 include scope**: architectural-doc paths (`.agent/practice-core/`, `.agent/plans/`, `docs/architecture/`, `docs/governance/`, `**/*.plan.md`). Memory paths intentionally NOT in scope — those carry legitimate prose describing past owner decisions.
6. **B1 test location**: moved from `scripts/check-blocked-content.unit.test.ts` to `tests/scoped-blocks-menu-framing.unit.test.ts` because vitest config excludes `scripts/**`. Pre-existing test-discoverability gap on `scripts/*.unit.test.ts` noted but NOT fixed in this session (separate finding).
7. **B3 rule classification**: agent-general rule (not Director-class clause). Section "Why a Rule, Not a Clause" explains.
8. **State repair**: corrupted `claimed_at` on my claim repaired manually via Edit (one-line surgical fix). Repair is in the same staged set as B1+B3 substance. Surfaced as failure-mode for downstream consolidation.
9. **Heartbeat (post-A1) shape**: typed state args (`--claim-id`, `--intent-id`, `--branch`, `--current-cycle-label`) per Feathered's `comms-heartbeat-cli.ts`. Restart deferred to post-compaction.
10. **Reviewer dispatch**: 4 parallel reviewers on B1+B3 (sonnet model each), foreground. Findings collected and triaged above.
11. **Failure-mode capture**: my finding (`claims open --now` accepts malformed ISO) is the third worked instance of the same cure-pattern as A1 and B2 (per Feathered's ack). Consolidation is a SEPARATE enforcement, not in this bundle. Captured as comms event `b797cc73`. Future cure: `requireIsoTimestamp(options, key)` helper in `cli-options.ts`.

---

## Section 3a — Late finding: pnpm type-check errors in scripts/check-blocked-content.ts

Feathered's pre-A1-commit `pnpm check` surfaced TS7006 ("implicit any") errors across `agent-tools/scripts/check-blocked-content.ts` — the SOURCE script for the hook policy enforcement. **These are pre-existing errors in the source file, NOT introduced by my B1 work**:

- The errors are on parameter type annotations in the script itself (lines 17, 32, 76, 113, 146, 169, 195, 209, 233, 250, 266, 293, 309, 313, 331, 364, 382, 394, 410, 421, 428, 444, 468, 529, 543) plus a TS2339 at line 576 (Property 'stdin' does not exist on type '{}').
- My B1 work added: (a) four entries to `policy.json` (JSON, no TS surface); (b) `tests/scoped-blocks-menu-framing.unit.test.ts` (typed, vitest-discovered, 5/5 passing); (c) a one-line trailing-newline diff to `scripts/check-blocked-content.unit.test.ts` (no semantic change).
- Feathered's broadcast attributed lines 582, 594 of the **test file** to B1, but my actual diff on that file is just one trailing newline (verified via `git diff agent-tools/scripts/check-blocked-content.unit.test.ts`). Their line-number attribution is likely a mis-mapping; the errors are in the source file's pre-existing untyped parameters.
- **Impact on A1 commit**: per Feathered, these errors block `pnpm check` exit, so A1 cannot land via the canonical gate path until they're addressed.
- **Post-compaction action**: investigate whether the errors are pre-existing (regress against `main`) or somehow surfaced by build-config change. If pre-existing, they need a separate fix (annotate parameters or scope tsconfig to exclude `scripts/`). If introduced by build-config change (e.g. tsconfig now including `scripts/` where previously excluded), that's a separate config-level finding worth surfacing. **First action: `git diff main -- agent-tools/scripts/check-blocked-content.ts agent-tools/tsconfig.json` to confirm pre-existence.**

This finding adds a new "must address" item to the post-compaction checklist — investigate type-check failures before B1+B3 commit so the gate is green.

## Section 4 — Decisions deferred (NOT in this session's bundle)

1. **Test-discoverability gap on `scripts/*.unit.test.ts`**: pre-existing config gap — agent-tools/vitest.config.ts include glob excludes `scripts/`. The file `scripts/check-blocked-content.unit.test.ts` (~600 lines of tests) is never run by the canonical pipeline. The cleanest cure is either (a) update vitest config include to add `scripts/**/*.test.ts`, or (b) move all `scripts/*.unit.test.ts` files to `tests/`. Out of scope for this enforcement bundle but worth surfacing to Feathered or owner post-session.
2. **`requireIsoTimestamp` helper consolidation**: third-instance cure-pattern is named. The consolidation lands separately (Feathered noted graduation in their closeout). Not in this bundle.
3. **`archive/` path-matching semantics verification**: assumptions-expert flagged; low priority.
4. **B3 §"Why a Rule, Not a Clause" tightening**: docs-adr-expert said it's well-grounded; no tightening needed.
5. **B3 worked-instance attribution**: the worked instance names "an agent" rather than specific identities — intentional choice to keep the rule portable (Practice-Core-leaning); names land in pending-graduations / consolidation surfaces instead. Not in scope.
6. **scripts/ runner gap surfacing**: I noticed the gap but did not write a comms event about it. Worth a brief surfacing post-fixes-applied.

---

## Post-compaction resume checklist

1. Read this handoff record (`.agent/state/collaboration/handoffs/torrid-firing-spark-2026-05-25-lane-b.md`) end to end.
2. Confirm watcher is still alive (Monitor task `bvn6t65lx`); restart if not.
3. Check comms stream for Feathered's A1 commit broadcast: `ls -t .agent/state/collaboration/comms/ | head -10`. If A1 is committed, my B2 work is unblocked.
4. Restart heartbeat with typed state args (PDR-078 §5 cure shape — see Section 1 "Heartbeat cron state" for command).
5. Apply reviewer fixes in the order in Section 2 "Order to apply (post-compaction)".
6. After fixes applied, verify B1 tests still green: `pnpm vitest run tests/scoped-blocks-menu-framing.unit.test.ts`.
7. Stage and commit B1+B3 as separate intent-scoped commits (with `oak-commit` skill); use Feathered's pending A1 commit-window timing to avoid index collision (gatekeeper-specialisation memory).
8. Begin B2 (CLI body-length gate, target: `cli-spec-options.ts` + `cli-comms-commands.ts` + `cli-comms-messages.ts`; regression test for each comms verb).

---

## Standing constraints (carry forward post-compaction)

- All quality gates blocking per memory.
- No `--no-verify` without fresh owner authorisation.
- Reviewer dispatch BEFORE staging on substantive code; B2 needs code-expert + type-expert + test-expert at minimum (B2 touches CLI option types).
- Heartbeat cadence ≤ 4 min once restarted; ping-before-escalate rule applies to any retirement-detection broadcast I might compose.
- DO NOT broadcast retirement-detection on Feathered during the dist-rebuild window (their own broadcast warned of transient heartbeat failures).
