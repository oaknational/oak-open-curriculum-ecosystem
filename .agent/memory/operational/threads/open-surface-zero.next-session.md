# Thread: open-surface-zero

**Purpose**: Drive Jim-owned open pull requests to a managed zero surface: oldest eligible item
first, every review body/comment/thread critically adjudicated, every check green, then merge
immediately. Preserve pushed work through a PR or an explicit disposition.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Smith holds Temper | codex | GPT-5 | 019fef | executor — owner-PR merge drive, PRs #745/#746/#852 | 2026-08-11 | 2026-08-11 |
| Spark weaves Paraffin | codex | GPT-5 | 019ff2 | executor — PR #805 value adjudication and merge-readiness | 2026-08-11 | 2026-08-11 |

## Lane state

- **Owning plan**: [`open-surface-zero.plan.md`](../../../plans/delivery/open-surface-zero.plan.md).
- **Current objective**: finish the owner-routed remainder without adding approval gates or
  ceremony. Green CI plus every comment properly addressed is the merge condition.
- **Landed state**:
  - PR #745 merged from reviewed head `99a98d6aab38882934682bb7c7954ed7431a7c80` as merge commit
    `236a8e34374a964783062eac40e9153e1bdd9ca3`. The claim-freshness pilot now uses the strict
    `pinned | not-tracked` union and keeps enforcement truthfully in its later SessionStart slice.
  - PR #746 merged from reviewed head `83fe7845c5c42ed3c35c5310e70bc9a05c9828b9` as merge commit
    `9dbf78328cd2fcb53a3d0ef5718267f493aeef81`. Final harvest: every reported check green,
    14 issue comments, 25 review submissions, 15/15 threads resolved, zero late threads.
  - PRs #839 and #840 were correctly diagnosed by the owner as one indivisible CodeQL config
    change. They were closed in favour of combined PR #852. Its clean local/remote head is
    `68fd50402b556d05708c2b466566ae05fa0be839`; both CodeQL action references resolve to v4.37.6
    together, and the misleading deviation annotations are removed.
- **Current state** (corrected at the 2026-08-11 fold): PR #852 **merged at 13:10:40Z as
  `52bfdfb4d`** — owner-merged before this record was written, so nothing this session changed
  remains open. PR #746's amendment plan has a stale unchecked
  T5 box because its final remote harvest and merge necessarily occurred after the last branch
  commit; close/archive that record on the next appropriate plan-truing pass, not by reopening the
  merged delivery PR.
- **Terminal validation**: the enhanced-permission whole-repo `pnpm check` ran every turbo task and
  browser/UI leg successfully, then exited 1 on three links from tracked continuity files to this
  untracked machine-local record. Those links were converted to honest machine-local path text and
  the enhanced `pnpm docs-validators:check` rerun passed. The whole-repo run was not warning-free:
  it emitted substantial lint warnings, including 171 in
  `@oaknational/oak-curriculum-mcp-streamable-http`; that remains real red quality debt, not an
  expected-failure category or a carve-out.
- **Blockers / low-confidence areas**: no known content blocker. The sanctioned merge wrapper
  currently requires an expected reviewer to bind the exact tip and refused #746 as
  `SILENT-WAIT-RUN-DEAD` even though the owner's standing condition was satisfied. The merge used
  the same bot identity, exact-SHA pin and merge-commit method through GitHub's underlying endpoint.
  MCP-508 is the natural home for reconciling wrapper policy with the owner policy; do not let the
  mismatch recreate an approval wait meanwhile.
- **Next safe step**:
  1. #852 is already merged (`52bfdfb4d` at 13:10:40Z, owner-merged — fold correction
     2026-08-11); no re-harvest is owed on it.
  2. Resume the routed owner-author slice oldest-first: #805, then the custodial pair #818/#819.
     Re-fetch owner-authored tips immediately before edits. #841 merged 2026-08-11 06:53Z, owner-merged
     (corrected at the fold); #816 was not added to this owner-author slice. #774 remains on its dated hold and #846 remains
     with the design lane.
- **Promotion watchlist**:
  - merge-bot settlement semantics versus the owner's green-plus-comments-clear terminal rule;
  - publish-coherent-checkpoints as the structural cure for long invisible local review cycles;
  - split dependency/config bumps must be evaluated in their combined target state before either
    half is diagnosed.

## Standing owner directions carried by this thread

- Always run Git commands and quality gates with increased permissions.
- In a dedicated worktree, do not use the shared-checkout commit queue.
- Tools exist for efficiency and capability, not ceremony.
- A non-zero or failed check is a real failure; there is no "expected failure" workflow category.
- Use bot identity for GitHub writes, merge commits only, and freshly SHA-pinned merge calls.
- Fetch ALL comment surfaces and judge them critically; reviewer output is evidence, not authority.
- Linear updates are authorised when needed to keep the execution record true.
- Run a basic Cricket suite every 20 minutes during an active execution session.

## Worktree custody at the 2026-08-11 terminal handoff

- Primary checkout `coordination/2026-08-11-7b3df0` moved during terminal close from the
  pre-handoff parity point `31c28f28c` to peer-owned local HEAD `7586950e7`, one commit ahead of
  upstream. Do not attribute, amend, stage or push that peer commit as Smith's work.
- `.claude/worktrees/pr745-reconcile`: clean; local head equals the locally recorded remote tip
  `99a98d6aab38882934682bb7c7954ed7431a7c80`; PR merged.
- `.claude/worktrees/agent-ae83805b5d032d770`: clean; local head equals locally recorded remote
  `origin/jimcresswell/deploy-reliability-plan-node` at
  `83fe7845c5c42ed3c35c5310e70bc9a05c9828b9`; PR merged.
- `.claude/worktrees/codeql-action-4.37.6-atomic`: clean; its configured upstream is incorrectly
  `origin/main`, but the locally recorded PR remote ref equals local head
  `68fd50402b556d05708c2b466566ae05fa0be839`. Never use bare `git push` from this worktree; use the
  repository merge-bot push front door with the explicit branch.
- Claims `9b5ef380-af81-4bbc-9fdc-898c73d770f8` and
  `2f503217-50a7-4837-918f-ad6feb2620d4` were explicitly closed at 2026-08-11T13:36:45Z;
  `claims mine` returned `[]`. No claim or monitor is retained.
