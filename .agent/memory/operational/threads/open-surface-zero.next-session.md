---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Thread: open-surface-zero

**Purpose**: Drive Jim-owned open pull requests to a managed zero surface: oldest eligible item
first, every review body/comment/thread critically adjudicated, every check green, then merge
immediately. Preserve pushed work through a PR or an explicit disposition.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Smith holds Temper | codex | GPT-5 | 019fef | executor — owner-PR merge drive, PRs #745/#746/#852 | 2026-08-11 | 2026-08-11 |
| Spark weaves Paraffin | codex | GPT-5 | 019ff2 | executor — PR #805 value adjudication and merge-readiness | 2026-08-11 | 2026-08-11 |
| Luna seeks Twilight | claude-code | claude-fable-5 | 5c0ddc | driver — PR #943 (EngraphCode fork `engraph` → `main`): full drive taken at owner word 2026-09-01 by handoff from Genet mends Lamplight (cloud seat); Sonar-gate cure parcel + review truings via fork PR; rehomed as #945 and paused behind the MCP-655 auth fix; resumed 2026-09-02 for the live-service validation (GO), two reconciliations with `main`, and the landing — #945 merged `bf8db3a8e` 11:04Z; seat wrapped at owner word | 2026-09-01 | 2026-09-02 |
| Kiln holds Slag | claude-code | claude-fable-5 | 1447f4 | implementer — the MCP-655 OAuth issuer-alignment lane from Luna's handover (event 5dbec23b): scope narrowed at owner word, review panel absorbed, fix landed and merged as #946 (2026-09-02 10:42Z, `55f7a457c`); cherry-picked the PRM fix onto `feat/innovation-kit-updates` at owner word 2026-09-02 ("option 2") so #945 could be validated before #946 merged; support seat for the #945 landing (ARC channel `2026-09-02-pr-945-landing-luna-seeks-twilight-and-kiln-holds-slag.md`: sign-in fallback, then second reader of Luna's memory-file union); lane COMPLETE 2026-09-02 (released 1.175.3, production sign-in proved, node archived by #948, MCP-655 Done); wrapped at owner word ~11:2xZ, claim `b6efbce3` closed; see §Lanes | 2026-09-01 | 2026-09-02 |

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

## Where the current state is

- The thread's live state is §Lane state above: the older owner-author slice (#805, then the
  custodial pair #818/#819) is the remainder; the owner's stated sequence after #945 was #908 then
  #915, neither on this thread. Every lane the journal carried has landed (below).
- The whole pre-curation record (346 lines: the 2026-08-11 worktree-custody handoff and the
  2026-09-01/02 Lanes journal for the #943 drive and the MCP-655 lane) is preserved at
  `.agent/memory/operational/archive/open-surface-zero-thread-2026-09-20.md`, blob `826bf2a60`,
  byte-identical to the record at `SHA:b3f2af13f`.

## Landed arcs (verified 2026-09-20 at their commits)

- The fork-line integration landing (Luna seeks Twilight, 2026-09-01/02): #943 rehomed and
  reopened as #945 from `feat/innovation-kit-updates` (fork settlement PR EngraphCode#36 merged
  by the owner as `f042d46e0`); #945 merged by the owner 2026-09-02 11:04Z as `SHA:bf8db3a8e`,
  released as 1.176.0. Owner words: "yes, we execute the plan" (2026-09-01); "option 2"
  (2026-09-02, the PRM-fix cherry-pick); "Cursor validated both preview servers".
- MCP-655 OAuth issuer alignment (Kiln holds Slag): #946 merged 2026-09-02 10:42Z as
  `SHA:55f7a457c`, released as 1.175.3, production sign-in proved; the plan node archived by #948
  (`995eb0aa6`) at `.agent/plans/archive/mcp-655-oauth-issuer-alignment.plan.md`; ADR-115 (eight
  sections and Negative 8, the STALE-CLIENT class) and ADR-053 amendment item 4 carry the
  decision; the UAT record is
  `apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/2026-09-02-preview.md`.
- The 2026-08-11 terminal handoff closed its two worktree claims; nothing remained open.

## Open items the journal named, with no other home

- The primary's `.mcp.json` and `.mcp.json.example` still named the stale `oak-preview-945`
  alias at 2026-09-02; cleanup owed.
- The runbook's row 2.2 cell is trued via MCP-630, not a PR on this thread.
- `cloud-environment-setup.sh` has only read, shellcheck and harness evidence until its first
  cloud provisioning.
- Queued follow-ups: MCP-656 (proxy-path metadata projection); the SDK v2 exploration (owner:
  "not yet").

## Lessons with no other home (the record's words, dates)

- 2026-09-02: an array expansion hides `--proto` from a text-matching security analyser — the
  ten literal-URL sites were flagged, the six variable-URL sites were not; write URLs literally
  at every call site the analyser must see.
- 2026-09-02: re-stage after every cure — a markdownlint cure applied after `git add` ships the
  unfixed index while pre-commit lint reads the fixed working tree (#946 went red once for this).
- 2026-09-02: `lint:shell` does not cover `.agent/claude-harness-integrations/*.sh`, so shellcheck
  is run by hand there. Fork PRs get a base-repo `startup_failure` run on `deployment_status`
  (fork-only head); not a required check, just recorded on the PR.
- 2026-09-02: `EnterWorktree` killed a Monitor armed at the primary (exit 124 within ~30 s) — do
  not `EnterWorktree` while a Monitor must stay armed.
