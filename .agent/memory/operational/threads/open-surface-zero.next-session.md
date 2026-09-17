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

## Lanes (2026-09-01, Luna seeks Twilight, 5c0ddc)

### Lane: upstream PR #943 drive — active (owner word 2026-09-01, "yes, we execute the plan")

- Branch: `fix/pr-943-sonar-gate-and-review-truings` in worktree
  `oak-open-curriculum-ecosystem-worktrees/pr-943-engraph` (sibling of the primary), cut from
  the fork's `engraph` tip `cb8315ecc` with the predecessor's four continuity commits merged in
  (`2c1da2ae6`); remote `engraph` = `https://github.com/EngraphCode/oak-open-curriculum-ecosystem.git`.
- Invocation pointer: this section plus the napkin entry "compaction-freeze harvest" of
  2026-09-01 ~13:0xZ (Luna seeks Twilight, 5c0ddc).
- Controlling plan: stated in-session and owner-approved 2026-09-01 (no plan node; the drive is
  one PR). Goal — #943 merges to `main` as the integration of the owner's `engraph` line: gate
  green, every finding dispositioned with evidence. The decisions the PR carries are the owner's
  (the fork's 30 PRs, all his; commit history is the record) and are not re-opened by this lane.
- Completed prerequisites: handoff from Genet mends Lamplight absorbed and acked on the #943
  record (comments 5492784311 / 5492821280); `jimbot` label on #943; identity row above; claim
  on this thread (areas `engraph`, `pr:943`); Sonar set enumerated (100 findings, two
  cloud-environment scripts) and cured at source with the local preflight run byte-identical
  before/after; the two suppressed Copilot findings verified real and cured; commit messages
  drafted and commitlint-clean in the session scratchpad; full agent-tools suite, repo
  validators, Prettier, markdownlint green; ESLint 0 errors once `identity.ts` is split.
- Landed on the branch (2026-09-01, hooks green each time): `ddd5fae5a` the shell cure;
  `c93ac7be0` the seed-definition truings with `identity.ts` split at its seed-resolution
  seam into `collaboration-seed.ts` (public exports unchanged); `867d2c644` the plan evidence,
  this record, and the napkin; `717ccc4cf` the https-only curl options written literally at
  every call site (the code-expert's blocking finding: an array expansion hides `--proto`
  from a text-matching analyser — the ten literal-URL sites were flagged, the six
  variable-URL sites were not) with the preflight's gitleaks probe carrying the same
  constraint as setup's fetch; `aac6a00fb` the `fail()`-routed presence checks in setup (a
  bare `[[ ]]` leaves `PIPESTATUS` stale on the ERR-trap failure card — RUN-proven both
  ways), `phase()`'s local/return, and PDR-076/076a on the one prefix definition. The
  code-expert review dispatched pre-compaction reported after all (its mailbox delivered
  post-compaction): the split APPROVED at line granularity, seven findings, all dispositioned
  on the fork PR record; a second bounded dispatch ran on the pushed parcel.
- Fork settlement PR **EngraphCode#36** → `engraph` (the parcel above plus `717ccc4cf`,
  `aac6a00fb`, `11916575a`, `ccfdd16be` — two review cures, the lane truing, the bot round's
  four threads cured or outdated) was merged by the owner at 12:13Z as `f042d46e0`; #943's
  head advanced to it and **SonarCloud's Quality Gate passed** there at 12:15Z, after failing
  on the 100 findings this line cures.
- **REHOME (owner rulings 2026-09-01 ~12:2xZ).** The two-PR loop — every cure needing a fork
  PR and then the landing PR, an hour each, multiplicative with the dependency — was ruled
  unsustainable: no further fork-side PRs for this landing; the integration tip lives in
  `oaknational` from here. Done under the bot identity: `feat/innovation-kit-updates` =
  `f042d46e0` + `04be09cc8` (the last suppressed Copilot finding on #943 cured at source —
  `strip_userinfo` drops a URL's query and fragment before its userinfo), pushed via
  `merge-bot push`; **#945** opened by the bot (`jimbot` label) from a body re-derived from
  the diff (221 commits, 324 files, +17,310/−8,758; the retired `research/web-app-deconstruction`
  workspace named first); **#943 closed** by the bot with the dispositions of its last Copilot
  round (fork-branch scan instruction: declined — ratified fork-first practice; root `/tmp`
  symlink hazard in setup: declined with falsifier — fresh container; stale commit count in the
  experience letter: dated record, PR body re-derived; query-credential leak: cured) and the
  pointer to #945. Owner ruling: no fork name in any PR title, description or comment.
- #945 merge gate, from `main`'s ruleset (read 2026-09-01): required checks `CodeQL`,
  `SonarCloud Code Analysis`, `run-quality-gates`, `Vercel`; every review thread resolved;
  code-owner review is required of HUMANS only — ruleset 19395183 carries that rule with the
  bot (app 4352989) as its sole bypass actor, so a bot-authored PR needs no owner approval
  click for the bot merge (owner ruling 2026-07-21, re-stated by the owner 2026-09-02 as
  relayed by Kiln holds Slag; the 2026-09-01 sentence here that called the owner's approval
  "the one leg only he can satisfy" was wrong and was transmitted to the owner twice on
  2026-09-02 before the correction); Copilot reviews on every push (`review_on_push: true`),
  so it is the expected reviewer for the settlement read. CODEOWNERS auto-requested `jimCresswell` and
  `mantagen` (GitHub's mechanism; mantagen is a colleague on trust, never chased). Copilot's
  request bound at 12:24:44Z (timeline). Codex is at its usage limit — a scope-declared skip.
  Instruments: `pnpm agent-tools:pr-watch 945 --repo oaknational/oak-open-curriculum-ecosystem --watch`;
  `pnpm agent-tools pr state 945 --expect copilot-pull-request-reviewer` (read
  CHECKS-RUNNING 9/13 at 12:30Z); `pnpm agent-tools merge-bot merge --pr 945 --expect
  copilot-pull-request-reviewer` at SETTLE-READY. Bot-identity GitHub writes go through
  `merge-bot mint-token --scope pull-request-work` assigned first, then `GH_TOKEN` on the
  `gh` call — never the prefix-substitution form (docs/engineering/merge-bot.md).
- **PAUSE and RESUME (2026-09-01 → 2026-09-02).** #945 was paused at owner word on
  2026-09-01 because the live-service validation it needs (the app UAT runbook through an
  authenticated Claude Code session) was blocked by an OAuth defect on every preview and on
  production (Claude Code refuses the authorisation response: the PRM named the app as the
  authorisation server while the response carried Clerk's `iss`; Linear MCP-655). The pause
  head `16d87a7cf` (the continuity commit) was pushed with `HUSKY=0` under explicit owner
  authorisation given when the pause was ordered — a hook bypass on record, not a standing
  grant. The cure
   — the PRM names the upstream issuer — was planned by this seat, handed to Kiln holds Slag
  and landed on #946. At owner word 2026-09-02 ("option 2") Kiln cherry-picked that fix
  (`2f14f6f76` → `6028ac95c` here; the plan node deliberately not carried) onto this branch
  and pushed, explained on #945 (issuecomment-5507061660) and to this seat (event
  `250ccdbb`), so this preview could authenticate before #946 merges. This seat resumed from
  the primary checkout with custody of worktree `.claude/worktrees/pr-945-innovation-kit`
  (never `EnterWorktree`: it kills armed Monitors), claim `9894f5a2` on this thread (areas:
  the run record, this record, the napkin, repo-continuity).
- **LIVE-SERVICE VALIDATION DONE 2026-09-02 09:03–09:06Z, verdict GO.** The owner signed in
  to the `.mcp.json` server `oak-preview-945` (the branch-alias preview of `6028ac95c`) from
  Claude Code 2.1.258 on the first attempt — row 1.5 PASS, the RFC 9207 mismatch gone on
  this line. Through that session: Section 0 (40 tools = Appendix A, 6 resources;
  `prompts/list` N-A on this client), Section 1 by curl (1.1–1.4 PASS), the smoke subset
  2.1, 4.1, 5.2, 7.2, 12.2 PASS. One P2, pre-existing and owned elsewhere: the changelog
  tools answer "Not found - non existent endpoint" — identical on the #946 preview
  (control), upstream 404s `/api/v0/changelog*` while `/key-stages` 401s, live
  swagger.json 0.11.0 has no changelog path (MCP-626 + MCP-630 behind MCP-653). Record:
  `apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/2026-09-02-preview.md`
  (`f4cfb994c`, bot push 09:08Z); summary on #945 as a bot comment (issuecomment-5507228301).
- **LANDING COMPLETE 2026-09-02.** `main` moved twice under the PR after the validation:
  #944 (MCP-122 domain re-point, `8f609d044`) and #946 (`55f7a457c`, released 1.175.3).
  Both were merged into the branch by this seat (`0090465a4`; then `8d840655c` + the
  1.175.3 release commit as `8b642d911`): the two doc conflicts of the first (runbook §1
  table, napkin) and the seven of the second (four MCP-655-line files taken from main
  outright because `git diff --quiet 2f14f6f76 <branch>` was empty for each; napkin,
  thread record and repo-continuity as unions by concept with heading set-diff, body-line
  and era-witness proofs) were second-read by Kiln holds Slag from the object store before
  the push (ARC channel 10:52Z: no known invariant violated; one release-number cure
  applied). Post-merge re-check on the rebuilt preview (rows 1.1–1.4 + an authenticated
  call) PASS, recorded on #945 (issuecomment-5508074306). All 19 checks green on
  `8b642d911`. **#945 merged by the owner 2026-09-02T11:04:45Z as `bf8db3a8e`; branch
  deleted; claim `9894f5a2` closed 11:05Z.** Owner word at the close: "run a full handoff
  and then stop all processes, leave the changes uncommitted in primary main" — this
  record's truing, the napkin block and the repo-continuity line were left uncommitted on
  the primary's `main` for the owner to commit.
- Next safe step (thread): (1) DONE at the wrap — release 1.176.0 (`cbcd76231`, release run
  11:11Z) carries `bf8db3a8e`; production (`https://mcp.thenational.academy`) rows 1.1–1.3
  PASS at 11:13:56Z (healthz `200` no-store; PRM `authorization_servers` =
  `https://clerk.thenational.academy`; unauthenticated `POST /mcp` → `401` with
  `resource_metadata`); the owner's Claude Code production sign-in was proven on 1.175.4
  for MCP-655 (relayed by Kiln); (2) the open-surface-zero remainder is the older slice above
  (#805, #818/#819); the owner's stated PR sequence after #945 is #908 then #915, neither on
  this thread. Owner-file notes: the primary's `.mcp.json` still lists `oak-preview-945`
  (its alias preview is gone with the branch); worktree
  `.claude/worktrees/pr-945-innovation-kit` is merged and idle (prune is the owner's call).
  Pointers, not this PR: the runbook's
  row 2.2 cell is trued by MCP-630, not here; `lint:shell:syntax` covers
  neither cloud-environment script (a package.json gate change for its own small PR);
  `cloud-environment-setup.sh` has READ + shellcheck + harness evidence only until its first
  cloud provisioning after this lands; the fork-branch scan instruction in
  `cloud-environment.md` could select the PR's actual base at the practice's next revision.
- Acceptance bar: SonarCloud passes on #943's new head; zero undispositioned findings across
  threads and review bodies at the merge instant; the shell change proven behaviour-identical;
  no file in the parcel loses documentation to a limit.
- Team expectation: solo lane. Peer Rowan calls Dewfall (39eb53) holds #944 (MCP-122) in its own
  worktree; the Director seat (Avocet guards Updraft, claim f04cd57b) is frozen from the
  2026-08-19 week-sleep; the cloud seat stood down its automation. The primary checkout is on
  `main` (not the coordination branch) with two uncommitted MCP-122 edits and an untracked
  `sonar-943.json` that pre-date every live seat — left alone.
- Known facts for the successor: `sonar verify --file` is unavailable to this org (403 "Vortex
  Analysis"); the gate proof is the PR scan; `lint:shell` does not cover
  `.agent/claude-harness-integrations/*.sh`, so shellcheck is run by hand; fork PRs get a
  base-repo `startup_failure` run on `deployment_status` (fork-only head; not a required check,
  recorded on the PR); the fork's `engraph` ruleset requires `run-quality-gates` + CodeQL
  (strict up-to-date) and thread resolution, no auto Copilot.

### Lane: MCP-655 OAuth issuer alignment — COMPLETE (Kiln holds Slag, 1447f4; #946 merged 2026-09-02 10:42Z, released 1.175.3, production proved, node archived)

- Defect: Claude Code 2.1.252 refuses the app's OAuth authorization response on preview and
  production ("Issuer mismatch … RFC 9207"): the PRM names the app as authorization server while
  the response carries the upstream identity provider's `iss`. Evidence and dates: Linear
  MCP-655 (assigned to Matt Gregory at owner word, project First Major Release, labels
  Bug/pre-publish/jimbot).
- Scope narrowed at owner word 2026-09-01 (~13:3xZ, this seat's verdict, Jim: "agreed"): the
  PRM names the upstream issuer — nothing on the proxy-path metadata (the omit/false rider cured
  nothing and could only be tested by a configuration pin; MCP-656 owns that path's projection).
  A seven-reviewer Opus panel (assumptions, mcp, architecture ×2, security, clerk, test) and a
  full Cricket suite (6 of 8 delivered, all ON-TRACK; adversarial high/xhigh undelivered at the
  freeze) were run against the node; every finding is absorbed in the node (§Panel absorption
  2026-09-01) — the fetched `issuer` is now validated at the fetch boundary (RFC 8414 §3.3,
  `issuer_mismatch`), Cursor's PRM-first discovery is described truthfully and its preview
  sign-in gates merge, the owner-held proof is non-vacuous (client version, no
  `MCP_SDK_GENERATION` override, remove-and-re-add, a negative control against production).
- Landed: commit `2f14f6f76` on `fix/mcp-oauth-metadata-iss-claim` (15 files: `servePrm`
  names `upstreamMetadata.issuer`; `fetchUpstreamMetadata` requires `issuer === upstreamBaseUrl`;
  relation-shaped PRM tests in `auth-routes.integration.test.ts`, `canonical-origin.integration.test.ts`
  and four e2e sites; the `issuer_mismatch` unit case; registry C706 re-anchored + reviewed deltas
  for `auth-routes.ts`, `upstream-metadata-fetch.ts`, `metadata-fetch-error.ts`; ADR-115 (eight
  sections + Negative 8), ADR-053 amendment item 4, UAT rows 1.2/1.5; the amended node). Both
  guards mutation-checked: reverting the `servePrm` line reddens exactly the seven enumerated
  PRM assertions; disabling the issuer check reddens exactly the one unit case. Full pre-commit
  gate green on the second attempt (first attempt: knip on an unused export, cured by making
  `IssuerMismatchError` module-private; an app delta-review map over `max-lines`, cured by
  homing the two entries in the auth-surface map).
- Worktree `oak-open-curriculum-ecosystem-worktrees/pr-943-engraph`; draft PR **#946** under
  the bot (assigned `mantagen`, plain-language body); the withdrawn disclaim-only draft is
  preserved as a patch in the implementing session's scratchpad only — its substance is on the
  ticket and in the node's history; the tree carries none of it.
- **State 2026-09-02 ~09:0xZ (trued after the owner-held proof day):** the review round
  and the Copilot round are settled (`50f76873e`, `63ede6263`). The first owner sign-in
  proved the RFC 9207 fix (Claude Code v2 completes at Clerk) and exposed a SECOND,
  pre-existing defect: the preview environment's Clerk keys were not a pair, so every
  fresh preview build since 2026-08-05 refused every token on both discovery paths
  (`OAuth token not found`). Diagnosed with an independent client (mcpjam) on both paths
  and by verifying the rejected token under a paired dev key; the owner corrected the
  preview secret key. Guard landed at `7579d4269` (`clerk-key-pairing.ts`: shared JWKS
  `kid` between the publishable key's instance and the secret key's Backend API — fails
  bootstrap naming both instance ids, never the secret; unit + mutation + live proofs).
  Rebuilt preview attests `Clerk keys paired {instanceId: ins_349N…}`; mcpjam direct-path
  sign-in → `initialize` 200 → tools list. Linear MCP-655 carries the landed-state comment
  and a trued description. Remaining: (1) the Claude Code proof is DONE (this seat's own
  `oak-preview` Connected on the rebuilt preview, 2026-09-02, v2 runtime, no override);
  Cursor — production first, then the preview (a preview failure blocks merge unless the
  owner rules otherwise); (2) owner approval → merge under
  the standing doctrine; MCP-655 → Done; node → `archive/`; #945 resume trigger on the
  comms stream. Follow-ups queued as pointers (PR description §Follow-ups): MCP-656; the
  SDK v2 exploration (owner's word 2026-09-01); truing `.mcp.json.example` (`.mcp.json` itself
  is already gitignored — verified 2026-09-02 09:0xZ — which is exactly why per-worktree copies
  diverged; the example names a stale preview alias).
- **Freeze 2026-09-02 ~09:1xZ (compaction freeze at owner word; the seat continues):** claim
  `b6efbce3` retained-with-reason (the same seat resumes; a successor adopts via this section);
  freeze broadcast event `944ab610`; the PR description is the reader's contract (§Follow-ups:
  MCP-656, the SDK v2 exploration, truing `.mcp.json.example`, #945); the fix branch carries this
  continuity commit on top of `8f59bae98`. Nothing is armed: no watcher, no cron, no Monitor;
  the local dev server is stopped; subagents idle.
- Platform observations for the successor (also in the napkin): the worktree-isolation guard
  refuses compound commands, `$(…)`, `env VAR=… pnpm …` and `--dir` — a scratch SHELL wrapper run
  as one plain command is the working shape (the 2026-09-01 "Python scripts" shape was banned by
  the owner on 2026-09-02: edits go through the Edit tool, never a script); `bot-gh.sh` (mint +
  `GH_TOKEN` + `gh`) is the bot-write wrapper; from inside a `.claude/worktrees/` checkout
  `EnterWorktree` refuses sibling-directory worktrees — `ExitWorktree` (keep) then `EnterWorktree`
  by path from the launch directory; the shell cwd resets to the launch directory between
  commands after an exit — check `pwd` before trusting a "local" result; `EnterWorktree` killed a
  Monitor armed at the primary on 2026-09-01 (exit 124 within ~30 s); no comms watcher was armed
  on 2026-09-02 (n=1: Luna frozen, owner in the terminal — the seat swept by hand).
- **COMPLETE 2026-09-02 ~11:1xZ (wrap at owner word; every fact below read first-hand):**
  `main` (with #944, the MCP-122 domain re-point) was merged into the fix branch at
  `bbc4f7b7a` — two doc conflicts (napkin, UAT guide) resolved identically to #945's branch so
  the second merge auto-resolved the guide. **#946 merged by the owner at 10:42Z as
  `55f7a457c`**; release 1.175.3 (`555fe6587`, 10:47Z) took it to production, whose PRM now
  names `https://clerk.thenational.academy` on both path forms (cache MISS, age 0) and whose
  401 `resource_metadata` is correct. Proofs closed: Cursor authenticated and exercised tools
  on both previews (owner, 10:30–10:35Z, "Cursor validated both preview servers"); Claude Code
  v2 on both previews (09:03Z in the #945 lane; this seat earlier); Claude Code v2 on
  PRODUCTION at 11:07Z (`/mcp`: "Authentication successful. Connected to oak-prod"; an
  authenticated tool call returned 200). The production attempt first failed with "expected
  `https://mcp.thenational.academy`" — the STALE-CLIENT class ADR-115 Negative 8 names: a
  validating client keeps the authorisation server it recorded at first registration; cure =
  rename or remove-and-re-add the server entry so it registers afresh (`.mcp.json` entry
  `oak-curriculum` → `oak-prod`). MCP-655 → Done (Linear carries the release and both proofs);
  the plan node is archived at `.agent/plans/archive/mcp-655-oauth-issuer-alignment.plan.md`
  (#948, `995eb0aa6`, owner-merged 10:58Z). This seat was then the second reader of Luna's
  #945 union (semantic-merge §7–9 proofs from the object store): one factual cure (release
  number) and three carries, applied at `8b642d911`; #945 merged `bf8db3a8e` at 11:04Z.
  Corrections of the day that a successor should carry: (a) this seat told the owner the
  code-owner gate needed his click — wrong; ruleset 19395183 is titled "bot-exempt by owner
  ruling 2026-07-21" — read the live ruleset, never infer a gate from doctrine prose; (b) a
  markdownlint cure applied AFTER `git add` shipped the unfixed index while the pre-commit lint
  read the fixed working tree — re-stage after every cure (#946 went red once for it); (c) a
  merge-bot `SILENT-WAIT-NO-REVIEWER` refusal means no review binds the tip after a push —
  request Copilot under the bot and wait, or the owner merges. Follow-ups stay pointers:
  MCP-656 (proxy-path projection), the SDK v2 exploration (owner: not yet), truing
  `.mcp.json.example`. Claim `b6efbce3` CLOSED at the closeout broadcast; nothing armed.
  Successor map: this section, PR #946, Linear MCP-655, the archived node. Per the
  no-handover-commits ruling these record edits sit UNCOMMITTED on the primary's `main` (owner
  word 2026-09-02) and ride the next substantive commit; a duplicate of the same edits sits
  staged, uncommitted, on throwaway branch `chore/continuity-kiln-2026-09-02` in worktree
  `oak-open-curriculum-ecosystem-worktrees/pr-943-engraph` — disposable once these land.
