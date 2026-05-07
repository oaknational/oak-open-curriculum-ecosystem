---
merge_class: index-narrative-tables
---

# main-critical-sonar-remediation Next Session

## Thread Identity

Thread: `main-critical-sonar-remediation`  
Branch: `fix/sonar-fixes-20260506`  
Primary plan:
[`main-critical-sonar-rebuild-from-updated-main.plan.md`](../../../plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md)

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| codex | GPT-5 | 019dfd | Silvered Masking Owl | executor | 2026-05-06 | 2026-05-06 |
| codex | GPT-5 | 019dfd | Moonless Vanishing Lantern | evaluator | 2026-05-06 | 2026-05-06 |
| codex | GPT-5 | 019dfd | Ethereal Ascending Twilight | executor | 2026-05-06 | 2026-05-06 |
| claude-code | claude-opus-4-7-1m | 228bc5 | Stormy Drifting Harbour | executor | 2026-05-06 | 2026-05-06 |
| codex | GPT-5 | 019dfe | Choppy Washing Archipelago | executor | 2026-05-06 | 2026-05-07 |
| codex | GPT-5 | 019e03 | Embered Roasting Flame | executor | 2026-05-07 | 2026-05-07 |

## Landing Target For Next Session

Target: **wait for PR #97 CI / review feedback, then close residual
coordination artefacts**. The vendor-switch handoff below has been executed:
the branch contains a real merge commit (`6683f918`) with `origin/main` as a
parent, followed by `deec6a00` for the CodeQL/Sonar bot cures. The branch was
pushed to `origin/fix/sonar-fixes-20260506` after the full pre-push gate passed.

Current follow-up: merge/process documentation now explicitly says semantic
memory/state resolution must occur inside a proper git merge operation and
must preserve merge topology unless the owner explicitly chooses otherwise.
Residual artefacts observed during the audit: one Git autostash from the merge
remains, and post-push collaboration-state bookkeeping is local until this
follow-up lands.

The 2026-05-06 vendor-switch snapshot is retained below as historical evidence
of what was handed off and executed.

## Vendor-Switch Handoff Snapshot (2026-05-06 Stormy Drifting Harbour)

### Branch state

- **Branch**: `fix/sonar-fixes-20260506`
- **HEAD**: `6b2b972c docs(practice): land PDR-049 memory and state file merge semantics`
- **Pushed**: up to `5b5b9d4a` (one commit ahead of origin)
- **Working tree**: clean (merge aborted)
- **Open PR**: #97 (DRAFT)

### Local commits ahead of origin

| SHA | Subject | Pushed? |
|---|---|---|
| `6b2b972c` | `docs(practice): land PDR-049 memory and state file merge semantics` | **NO — push when ready** |

Everything earlier (`5b5b9d4a` and back) is on `origin/fix/sonar-fixes-20260506`.

### In-progress merge (currently aborted)

A `git merge --no-commit --no-ff origin/main` was started this session
to integrate ~19 commits from main, then **aborted** to leave the
working tree clean for the vendor switch. The merge auto-resolves
most files; **5 files conflict** and require manual resolution per
[PDR-049 (Memory and State File Merge Semantics)][pdr-049]:

[pdr-049]: ../../../practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md

| File | `merge_class` per PDR-049 | Diagnosed | Action |
|---|---|---|---|
| `.agent/state/collaboration/closed-claims.archive.json` | `append-only-structured-by-claim_id` | **Clean union** — 9 ours-added + 25 theirs-added; **zero duplicate `claim_id` values** (per `comm -12` of the diff). No legitimate-concurrent-archival case. | Pure JSON-array union by `claim_id`; preserve top-level `schema_version` |
| `.agent/state/collaboration/shared-comms-log.md` | `append-only-narrative` | Both sides appended timestamped event entries (ours +36 lines, theirs +48); newest-first ordering convention | Union by entry identity (timestamp + agent prefix in heading); chronological sort |
| `.agent/memory/active/napkin.md` | `append-only-narrative` | Ours added the Stormy entry at top (+180 lines); theirs added a Pelagic entry + archive split (+76 lines) | Union; both sides' new H2 sections survive; preserve archive pointer edits |
| `.agent/memory/operational/pending-graduations.md` | `mostly-append-register` | Ours +18 lines (no register-entry edits this session), theirs +25 lines (drain-due-queue + recalibrate-for-queue-lifecycle commits on main) | Theirs likely supersedes; verify entries my session referenced still exist; per-entry investigation if any same-entry edits |
| `.agent/memory/operational/repo-continuity.md` | `index-narrative-tables` | Largest delta (ours +81, theirs +224). Both sides edited active-threads table, session-close note, current-session-focus, deep-consolidation-status. | Section-by-section reconciliation: tables merge row-by-row by thread name; status fields prefer most-recent-timestamped |

**Important note on `repo-continuity.md`**: the file has a *malformed
YAML frontmatter on this branch* (line 3 reads `## fitness_line_target: 400`
as an H2 instead of a YAML key; closing `---` missing). This is
pre-existing damage to the frontmatter, NOT the conflict markers.
The next agent should consider whether to fix the frontmatter as
part of the merge resolution or leave for a separate cleanup. If
fixing, it has to interleave with theirs' significant edits to other
sections.

### Recommended merge process

```bash
git merge --no-commit --no-ff origin/main
# Resolve each UU file per the table above and PDR-049 §Per-file-class merge semantics
# After each file:
#   1. Verify the merged file end-to-end by reading it (per PDR-049 step 3)
#   2. Run validators (markdownlint for *.md; jq parse + node -e for JSON)
git add <each-file>
git commit  # default merge commit message is fine; reference PDR-049 in body
```

For `closed-claims.archive.json` specifically, `jq` makes the union easy:

```bash
MB=$(git merge-base origin/main HEAD)
F=.agent/state/collaboration/closed-claims.archive.json
jq -s '
  {
    schema_version: .[0].schema_version,
    claims: ([.[].claims[]] | unique_by(.claim_id))
  }
' <(git show :2:$F) <(git show :3:$F) > $F
git add $F
```

### Custom git config — not yet needed

PDR-049 §Investment Staircase commits the Practice to **level 1
(codify only)**. Custom git merge drivers (level 3) are an
architectural option but require driver authoring + per-checkout
`git config` registration + ongoing maintenance. **No git config
changes are needed for this merge.** Consider promoting to level 3
only after evidence at N≥3 hosts or ≥5 collisions on this host.

### `merge_class:` metadata application — pending

PDR-049 §File-Level Metadata Contract names the per-file metadata
mechanism. Application to in-scope files in this repo was started
this session but interrupted before any edits landed. Next agent
should fold metadata application into the merge resolution itself —
when reading napkin/pending-graduations/etc. for the merge, add the
`merge_class:` frontmatter at the same time.

In-scope inventory:

| File | Proposed `merge_class:` |
|---|---|
| `.agent/memory/active/napkin.md` | `append-only-narrative` |
| `.agent/state/collaboration/shared-comms-log.md` | `append-only-narrative` |
| `.agent/state/collaboration/closed-claims.schema.json` (`$merge_class`) | `append-only-structured-by-claim_id` |
| `.agent/state/collaboration/conversation.schema.json` (`$merge_class`) | `append-only-structured-by-entry_id` |
| `.agent/state/collaboration/escalation.schema.json` (`$merge_class`) | `append-only-structured-by-escalation_id` |
| `.agent/memory/operational/pending-graduations.md` | `mostly-append-register` |
| `.agent/memory/operational/repo-continuity.md` | `index-narrative-tables` |
| `.agent/memory/operational/threads/*.next-session.md` (10 files) | `index-narrative-tables` |
| `.agent/state/collaboration/comms-events/README.md` (does not exist; create) | `exclusive-create-fragments` |

### Open PR #97 review-bot findings (post-`5b5b9d4a` push)

CI rolled five checks; three pass, two fail. Each failure has been
diagnosed; both need a code fix in the next session.

#### CodeQL — 2 HIGH `js/polynomial-redos` (still OPEN)

| # | Location | Status |
|---|---|---|
| 87 | `packages/sdks/oak-sdk-codegen/src/bulk/generators/synonym-miner.ts:140` (`alsoKnownAs` regex pattern) | Still open after `5b5b9d4a` |
| 88 | `packages/sdks/oak-sdk-codegen/src/bulk/generators/synonym-miner.ts:148` (`sometimesCalled` regex pattern) | Still open after `5b5b9d4a` |

**Why the previous fix did not satisfy CodeQL**: the input-length
guard (`MAX_DEFINITION_LENGTH_FOR_PATTERN_MATCHING = 5000`) added in
`5b5b9d4a` is in `extractSynonymFromDefinition` (the entry function),
but CodeQL's static analyser flags the **regex pattern itself**
(lines 140, 148) and does not trace data flow from the guard to the
regex. CodeQL's analysis is conservative: any caller that bypasses the
guard would re-expose the polynomial path.

**Recommended cure**: add a `(?=\S)` positive lookahead immediately
after the `\s+(?:an?\s+)?` prefix in both regexes. Forces the next
position to be non-whitespace; eliminates the polynomial backtracking
path on adversarial whitespace input. Existing tests should still pass
because all valid inputs have non-whitespace content after the
prefix.

```ts
// Before:
alsoKnownAs: /also known as\s+(?:an?\s+)?['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
sometimesCalled: /sometimes called\s+(?:an?\s+)?['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
// After:
alsoKnownAs: /also known as\s+(?:an?\s+)?(?=\S)['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
sometimesCalled: /sometimes called\s+(?:an?\s+)?(?=\S)['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
```

The length guard remains as defence-in-depth — keep it; do not remove.

#### github-code-quality bot — `zodgen-core.ts:33` (not yet investigated)

> Variable 'value' is of type date, object or regular expression, but
> it is compared to an expression of type null.

Comment landed on `68529ac6`; the file may not have changed since,
so the finding likely still applies. **Action**: read line 33 of
`packages/sdks/oak-sdk-codegen/code-generation/zodgen-core.ts`,
classify as either real bug (fix) or false-positive (dismiss with
rationale).

#### SonarCloud — only `new_duplicated_lines_density: 39.3%` remaining RED

This is the pre-existing codegen-duplication concern routed to the
separate codegen-decomposition plan. **Out of scope** for this
session and the next; do not address as part of this PR.

All other Sonar QG conditions are OK on PR #97 (HEAD `5b5b9d4a`):
`reliability_rating`, `security_rating`, `security_hotspots_reviewed`
(100%), `new_security_hotspots_reviewed` (100%), `new_violations` (0).

### Pull-request comments — full list as of 2026-05-06 ~20:30 UTC

Issue comments (`gh api repos/oaknational/oak-open-curriculum-ecosystem/issues/97/comments`):

- vercel[bot] @ 15:21Z — preview deployment ready
- sonarqubecloud[bot] @ 20:00Z — Quality Gate failed; only `39.3%
  Duplication on New Code` listed as failing condition

Review comments (`gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/97/comments`):

- github-code-quality[bot] @ 18:59Z on `zodgen-core.ts:33` — type-comparison finding (above)
- github-advanced-security[bot] @ 18:59Z on `synonym-miner.ts:140` — CodeQL alert #87 (above)
- github-advanced-security[bot] @ 18:59Z on `synonym-miner.ts:148` — CodeQL alert #88 (above)

Reviews:

- github-code-quality[bot] — COMMENTED (no body)
- github-advanced-security[bot] — COMMENTED (no body)

### Next safe step (vendor-switch handoff)

1. Pick up branch `fix/sonar-fixes-20260506` at HEAD `6b2b972c` on a different vendor system.
2. Read [PDR-049][pdr-049] before merging anything.
3. Re-initiate the merge: `git merge --no-commit --no-ff origin/main`.
4. Resolve the 5 conflict files per the table above. Add `merge_class:` frontmatter to the in-scope files as you go (per the metadata-application table).
5. Verify each merged file end-to-end + run validators; commit the merge.
6. Address the two PR-comment findings (CodeQL ReDoS regex fix; zodgen-core type-comparison investigation).
7. Push when ready; let CI re-run; expected outcome is CodeQL clean + Sonar still RED only on duplication.
8. Either mark PR #97 ready for review or land it as DRAFT for owner review depending on owner direction.

## Lane State

**Owning plan**:
`.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md`

**Current objective**: rebuild Sonar remediation from updated main and fix the
current project/main HIGH issues plus security hotspots on the branch. PR-scoped
Sonar is used only to verify the branch does not add regressions.

**Current state** (after session 2026-05-06 by Stormy Drifting Harbour):

- Branch `fix/sonar-fixes-20260506` has commits:
  - `457fa1f0 fix(sonar): remediate quality gate blockers`
  - `b903554b chore(collaboration): close commit window state`
  - `c2f5402b fix(sonar): preserve useful remediation cleanups`
  - `5f6a7ae2 test(http-mcp): pin X-Powered-By absence; SAFE 6 sonar hotspots`
  - Sonar Disposition Policy commit (this session, see commit log).
- Sonar dispositions applied this session: **121 hotspots** moved
  TO_REVIEW → REVIEWED/SAFE with site-specific rationales, raising
  `security_hotspots_reviewed` from 7.1% (11/154) to ~85.7% (132/154).
- 22 S1313 hardcoded-IP hotspots in 3 test files **deliberately
  deferred** to next session: `header-redaction.e2e.test.ts` (2),
  `header-redaction.unit.test.ts` (13),
  `rate-limiter-factory.unit.test.ts` (7). All test fixtures; with the
  new policy in place they apply by class.
- Slice 1 (Sonar high-priority hotspots: 1 RCE + 3 PRNG + 2 weak-crypto)
  shipped with a regression-guard E2E test that pins the X-Powered-By
  absence at the application layer.
- Slice 2 (this session) shipped the
  [Sonar Disposition Policy](../../../../docs/governance/sonar-disposition-policy.md)
  codifying class-level dispositions for 9 hotspot rule classes.
- HIGH-issue backlog: 133 OPEN as queried at session-open; sampling of 6
  files showed all are zombie findings from a stale main-branch
  analysis that pre-dates commit `457fa1f0`. The push from this session
  triggers CI SonarCloud re-analysis; the bulk of the 133 are expected
  to auto-resolve to FIXED.

**Blockers / low-confidence areas**:

- The generated MCP executor refactor is broken local work and must be removed
  first. It was not committed or pushed.
- Generated files are still shipped code and must stay inside local and remote
  quality-gate scanning. Excluding generated files from Sonar or lint is not an
  acceptable remediation route.
- Do not change core MCP tool aliases or descriptor types without owner
  participation.
- Sonar issues are either fixed or marked false positive when genuinely false.
  They are never accepted as a pressure-release move.
- Security hotspots are fixed when unsafe, or marked `SAFE` only with exact
  site-specific rationale. `ACKNOWLEDGED` requires explicit owner acceptance of
  residual risk.

**Next safe step**:

1. Wait for CI SonarCloud re-analysis on the pushed branch to complete.
2. Re-query project/main Sonar HIGH issues — most should now be FIXED.
3. Re-query hotspots — the 22 S1313 should be the only TO_REVIEW
   residual in the test-fixture classes; any new hotspots from this
   branch's commits will appear here.
4. Apply [Sonar Disposition Policy
   §S1313](../../../../docs/governance/sonar-disposition-policy.md#s1313--hardcoded-ip-addresses)
   to the 22 deferred sites: short rationales of the form
   `SAFE per Sonar Disposition Policy §S1313: <file>:<line> — test-
   fixture IP literal driving header-redaction/rate-limit test`.
5. Address any genuine remaining HIGH issues with TDD per the policy's
   two-outcome rule.
6. Run the smallest relevant gates, then root `pnpm check` before
   committing.

**Promotion watchlist**:

- Candidate practice lesson: branch-scoped quality-gate analysis is a
  regression guard, not a backlog source for a branch whose purpose is to fix an
  existing main/project backlog. Treating it as the source creates circular work.
- Candidate practice lesson: once remediation enters core generated/type
  surfaces, stop at the first type-system resistance and reframe the problem
  before chasing errors outward.
- Owner correction reinforced that generated files remain first-class checked
  code; quality-gate exclusion is not a valid route to green.
- Candidate practice lesson (2026-05-06): for a *static analyser's*
  HIGH issues against a moving target, the cure is `push + re-analyse`,
  not manual disposition; for *security hotspots* whose decision
  requires context the analyser cannot see, the cure is human review
  with site-specific rationale; for both, doctrine (a class-level
  policy artefact) compounds where per-site comments do not.
- Candidate practice lesson (2026-05-06): activity-bias diagnostic —
  when a sequence of mechanical tool calls becomes procedurally
  identical, that is the prompt to re-ask the first question, not to
  continue. The simpler shape may be a single durable artefact rather
  than N individual calls.
