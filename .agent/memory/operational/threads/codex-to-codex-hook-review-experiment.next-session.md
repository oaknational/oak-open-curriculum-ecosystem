---
fitness_line_target: 260
fitness_line_limit: 420
fitness_char_limit: 30000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete'
merge_class: index-narrative-tables
---

# Next-Session Record — `codex-to-codex-hook-review-experiment`

## Current State

- The bounded Codex hook prototype is preserved on branch `fix/claude-hook-hardening` at
  `SHA:c4fae0b83d7450772c0be0fec13cad980a54cccd` in draft PR #403.
- The feature worktree was clean and equal to its upstream when this record was written.
- The prototype is **not active and has not been discovered by Codex**. In a fresh Codex session
  opened in the feature worktree, `/hooks` reported `PreToolUse` installed `0` and active `0`.
- Project-local config parsing, handler unit behaviour, and a valid fail-open response do not prove
  hook discovery. The runtime observation above is the governing result.
- PR #403 remains a preservation PR. It must not be represented as a working hook integration.

## Goal and Boundary

The goal is a rapid, automatic review of an agent's intent or tool-call result while controlling
the mechanisms that consume context so review latency stays low. “No tools, no rules, one skill”
was an exploratory mechanism, not the goal.

The next implementation step is deliberately smaller than the preserved prototype:

1. Merge or otherwise disposition PR #403 without claiming activation.
2. Start a normal fresh branch from current `main`.
3. Follow the official Codex hook configuration shape exactly and prove one deterministic
   `PreToolUse` command is listed by `/hooks` in a fresh trusted session.
4. Prove one controlled `apply_patch` invocation reaches that command.
5. Only after discovery and invocation work, add semantic review, Gitleaks, latency measurement,
   or a vendor-neutral adapter layer one increment at a time.

The proof order is discovery → invocation → deterministic behaviour → model review → latency.
Passing setup tests or parsing configuration is not a substitute for observing the hook in the
running client.

## Evidence and Negative Knowledge

- The fresh `/hooks` output is direct runtime evidence that the tracked project definition was not
  installed by Codex 0.144.5.
- The earlier disposable two-case trial proved that a manually-invoked review pairing could allow
  a clean case and deny a concern case. It did not prove Codex hook discovery, production policy,
  reliability, or acceptable latency.
- The fresh-process synchronous reviewer exceeded the run-configured experience thresholds. Those
  thresholds are configuration and may change for later labelled runs; they are not invariants.
- Do not infer that a vendor-agnostic framework is ready to extract. A general payload schema,
  vendor adapters, reciprocal Claude/Codex pairings, and official-source schema-drift detection
  remain future intent until at least two real adapters expose stable seams.
- PR #404 was closed unmerged after the recovered JSON files were identified as unsealed audit
  canary keys. Its remote branch was deleted, and those versions are compromised for audit use.
  Fresh keys must be authored and sealed before any later canary run.

## Durable Sources

- Draft implementation and historical experiment material: PR #403.
- Observed feasibility evidence and scope limits:
  `.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md`.
- Historical plan:
  `.agent/plans-old-archive/agent-tooling/archive/completed/codex-to-codex-synchronous-hook-review-experiment.plan.md`.
- Official mechanics: <https://learn.chatgpt.com/docs/hooks>.
## Current Continuation

- **Owner pause boundary (2026-07-16): implementation is paused.** Do not resume debugging, run
  another reviewer/model call, commit, or push until the owner explicitly resumes this lane.
- Branch: `fix/claude-hook-hardening`, HEAD `b5d37665c`, exactly equal to its upstream at this
  snapshot (`ahead=0`, `behind=0`). Discover its sibling worktree with `git worktree list`; do not
  rely on a machine-local path from a handoff.
- Invocation pointer: read this record, then the
  [pair ARC](../../../collaboration/rapid-comms/2026-07-16-codex-hook-experiment-lupin-herds-bark-and-zephyr-turns-crosswind.md),
  then re-read the feature and primary checkout statuses, live claims, commit queue, and recent
  comms. The primary checkout is a dirty shared coordination home; the feature implementation is
  in the sibling worktree.
- Historical plan: the original 1,312-line PostToolUse plan is being moved, substantively
  preserved, to `.agent/plans-old-archive/agent-tooling/archive/completed/`. The archival diff also
  adds an outcome banner and compatibility warning and corrects links; it is not byte-identical.
  Its body is historical evidence, not current execution authority.
- Evidence authority: the permanent result belongs in the research result
  `codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md`; live indexes and the
  codex-hook-review README must not depend on the archived plan.
- Current state: **reviewed reduction applied; unreviewed activation attempt interrupted; nothing
  landed**. The reduced documentation/compatibility bundle is partly staged, two link corrections
  are unstaged over staged versions, and the project-local hook configuration is unstaged/untracked.
  No tournament or persistent activation occurred.
- Custody: Lupin accepted Zephyr's reduction/landing handoff in event
  `f2339493-9af0-4052-a53e-1b12818e8ad4`. Zephyr then closed the transferred code claims and ended
  its session. Lupin's closeout owns the paused residue; all matching claims are to be closed after
  this handoff is verified.
- Landing target when the owner resumes: first separate the approved reduced bundle from the new
  hook-activation slice. Retain the Codex 0.144.5 compatibility deletion and the evidence/archive
  correction; do not represent the new hook as approved or working unless its nested reviewer is
  observed completing successfully.
- Acceptance bar: the combined staged and unstaged diff contains no smoke harness, package smoke
  entry, or optional timeout API/tests; the compatibility deletion and existing request-shape
  expectation remain; the original plan is substantively preserved with explicit archival
  corrections; research carries the measurements; live navigation has no dependency on the
  archived plan; focused checks and the applicable whole-repo gate are truthfully reported.

## Lane State at the Pause

- **Owning artefacts:** the archived synchronous-experiment plan is historical only; the research
  result owns observed evidence; the future semantic-classifier plan owns any later qualification
  or activation; this record owns the interrupted operational state.
- **Current objective:** preserve the smallest trustworthy Codex-to-Codex hook slice and determine
  whether it can run quickly enough without confusing context controls with the goal. The goal is
  control of context-consuming mechanisms to reduce latency, not the slogan “no tools, no rules,
  one skill”.
- **Current state:** the previously reviewed bundle is ready for a fresh landing attempt after its
  two archive-link corrections are restaged. A later three-file activation attempt is not settled:
  `.codex/config.toml` loads, the handler parses and emits protocol-valid output, but the nested
  reviewer exits `1` on the benign direct invocation and the handler consequently allows fail-open.
- **Blockers / low-confidence areas:** the nested reviewer's exit cause is unknown; the new handler
  and schema have not passed code, test, configuration, security, or architecture review; a fresh
  Codex session must separately load and trust the exact hook definition; the index currently mixes
  staged and unstaged versions; the canonical whole-repo gate remains red at its first Gitleaks
  stage on two repository-history findings and no later stages ran.
- **Promotion watchlist:** a vendor-agnostic fast-feedback framework remains future intent: common
  review payload/schema, vendor adapters, vendor-specific hook semantics, reciprocal reviewer
  pairings, and official-source schema-drift detection. Do not extract it from one working adapter.
  The evidence trigger is a second real adapter plus observed stable seams, not conceptual symmetry.

## Corrected Goal and Owner Decisions

1. Context-control switches are means. Measure model-visible input, output, caching, reasoning,
   launch time, and total hook time. Do not fetishise zeroing a named feature when it has no
   material effect on the bounded review.
2. Semantic prescreening was rejected because it adds another latency-bearing decision layer.
   The accepted compromise was deterministic eligibility/schema handling plus exact-payload
   Gitleaks. Gitleaks is a secret guard, not a semantic reviewer.
3. `fast_target_ms=1,500` and `feasibility_ceiling_ms=2,500` were ratified as versioned run
   configuration, not invariants. They may change for a new labelled run but cannot be changed
   retrospectively to reclassify the 2026-07-16 evidence.
4. Start with Codex-origin/Codex-reviewer isolation because it removes Claude from attribution and
   exposes the synchronous cost. Claude pairing and generic framework extraction follow only after
   a viable smallest slice exists.
5. The discussion of image-tool nuance became disproportionate. `tools.view_image=false` was
   removed because Codex 0.144.5 rejected it under strict config; the deletion is a compatibility
   repair, not evidence about image capability or a reason to expand the design.
6. The settled reduction deliberately removed 988 lines of disposable smoke apparatus and the
   optional timeout seam after gateway and architecture review. This is an effort-alignment
   decision, not unfinished implementation to reconstruct.

## Evidence and Verdict

### Six-call fresh-reviewer feasibility path

- First attempt failed before inference because installed Codex `0.144.5` rejected
  `tools.view_image=false` under strict configuration.
- The one authorised local repair removed that key and its existing request-shape expectation.
- One bounded rerun produced five four-second hard timeouts. Luna Fast's concern case completed
  correctly in 3,242 ms total / 3,219 ms reviewer time, with 5,364 input and 27 output tokens.
- The completed reviewer time alone exceeded the versioned 2,500 ms experience ceiling. The exact
  fresh-process synchronous configuration is RED; this does not prove every hook architecture is
  infeasible.

### Two-case real PreToolUse path

- Clean: Gitleaks clean; reviewer `pass`; reviewer 3,763 ms; hook 3,818 ms; origin 8,955 ms; the
  exact target change applied; cleanup completed.
- Concern: Gitleaks clean; reviewer `concern`; reviewer 3,706 ms; hook 3,733 ms; origin 8,434 ms;
  the target stayed absent; cleanup completed.
- This proves the disposable pairing can be mechanically correct for the two frozen cases. It
  does **not** qualify speed, reliability, production policy, or general patch coverage.
- Keep the run configuration distinct from process-safety ceilings: `fast_target_ms=1,500` and
  `feasibility_ceiling_ms=2,500` are experience values. The executed direct cells used a 4 s
  reviewer timeout; the executed `PreToolUse` trial used 9 s reviewer and 10 s origin watchdogs.
  The archived `PostToolUse` plan's proposed 6 s / 20 s bounds were never exercised.

## Settled REDUCE Boundary

The independent code gateway returned `CHANGES REQUESTED`, and the compound pair accepted this
boundary:

1. Delete the six untracked PreToolUse smoke files and the package smoke script.
2. Revert the optional timeout API in `process-runner.ts` and `runner.ts`, plus its added tests.
3. Retain only the `configuration.ts` removal of the rejected `tools.view_image` override and the
   corresponding removal from the existing request-shape expectation.
4. Do not repair or retain the disposable apparatus. The gateway found two High defects: an outer
   origin timeout can leave the detached reviewer group without an owner, and the optional timeout
   seam accepts invalid numeric values. Green focused checks do not clear those defects.
5. Archive the original plan with its substantive historical body preserved after mining the
   result into research. Keep only explicit archival corrections such as the outcome banner,
   compatibility warning, and repaired links; do not rewrite it into a condensed story.
6. Do not make another live model or hook call.

At the fresh-reader snapshot before transfer the experimental delta was 1,028 additions and 5
deletions: 988 lines in six untracked smoke files plus 40 tracked additions and 5 deletions. After
Lupin accepted custody, the closing status showed the six files, package entry and timeout seam
absent; only the two-file compatibility delta and documentation closeout remained. This is a
working-tree observation, not verification or a landed commit.

## Negative Knowledge — Do Not Infer

- Mechanical success is not latency qualification or production readiness.
- The RED verdict is for the tested fresh-process synchronous configuration, not all Codex hooks.
- Smoke-only concern denial is not an accepted product policy.
- Removing a rejected strict-config key is a compatibility repair; it does not prove the effective
  image capability is disabled.
- The archived plan saying `PostToolUse`, `NO INFERENCE STARTED`, and excluding `PreToolUse` is
  accurate historical intent, not current empirical state.
- A large green test surface is not a reason to retain disposable experiment machinery after the
  decision has been made.
- A project config that parses, an outer handler that returns valid allow JSON, and a fail-open
  action are not evidence that the nested Codex reviewer ran. The current activation attempt is the
  counterexample: all three can be true while the reviewer exits `1`.
- The final code/config/security/test/architecture approvals apply to the reduced bundle only. They
  do not cover the later `.codex/config.toml` and `.codex/hooks/` additions.

## Interrupted Project-Local Hook Attempt

After the reduced bundle was settled, the owner asked to configure the hook immediately. Lupin
added a minimal local `PreToolUse` matcher for `^apply_patch$`, a self-contained Node handler, and a
JSON output schema in the sibling feature worktree. This is a new slice, not a continuation already
covered by earlier reviews. At the pause, the primary checkout's `.codex/config.toml` had no
`PreToolUse` entry and the primary checkout had neither hook file.

Observed facts at the pause:

- Lupin observed installed Codex `0.144.5` and `codex doctor --summary --no-color` loading the
  sibling worktree's project config with no config failure. The doctor output was not retained as a
  durable artefact. A fresh-reader audit independently re-ran `node --check` successfully.
- Lupin observed invalid hook input returning schema-valid allow output. A benign patch event also
  returned allow, but its debug output showed `reviewer exit: 1` after roughly 15 ms. The raw output
  was not retained, so this is an observed-at-pause handoff fact rather than independently
  reproduced proof. It describes infrastructure failure, not a `pass` verdict or latency evidence.
- The handler bounds the event at 32 KiB and patch at 16 KiB; scans the exact serialised payload
  with Gitleaks; attempts Luna Fast with low reasoning and context-control overrides; denies a
  definite `concern`; denies detected secrets; and allows uncertainty, drift, timeout, or other
  infrastructure failure. These are implementation observations, not an approved policy.
- The executable paths are fixed to the current local installation. That can support one local
  experiment but is not a vendor-agnostic or portable integration design.
- Lupin observed that the current Codex session pre-dated this new definition; it therefore cannot
  be described as attached. This observation also has no separate session artefact. Official Codex
  hook mechanics require project trust plus trust of the exact non-managed hook definition;
  changed definitions are skipped until reviewed in `/hooks`.

Official reference: [Codex hooks](https://learn.chatgpt.com/docs/hooks). It also establishes that
matching hooks from all active sources run, multiple matching command hooks for the same event
launch concurrently, command hooks receive one JSON object on stdin, `^apply_patch$` is a supported
`PreToolUse` matcher, and a supported call can be denied with
`hookSpecificOutput.permissionDecision = "deny"`.

## Review Settlement

- **Code gateway:** approved the final reduced slice only after all smoke machinery, package entry,
  and timeout seams were removed and the historical plan/archive authority was corrected.
- **Test/configuration/security specialists:** approved that reduced slice. Focused configuration
  tests were 7/7; type-check, focused lint, Markdown lint, and scoped diff checks were green.
- **Architecture review:** selected REMOVE rather than repair-and-retain; preserve the original plan
  intact as history and keep the research result authoritative.
- **Current activation files:** no specialist review has run. Do not inherit the approvals above.

## Commit and Validation History

- The first commit-queue attempt used a worktree-suffixed `git:index/head@...` claim. The regular
  commit guard correctly refused it; worktree suffixes belong to the merge path, while an ordinary
  commit uses the canonical bare index/head claim. Intent
  `3f45ca01-3419-4fec-9958-976ea18add9e` is abandoned without staging.
- The second attempt staged the reviewed bundle and invoked normal hooks. Prettier and Markdown
  lint passed; the repository link validator rejected two live links into an archive path, which is
  intentionally excluded from live navigation. Intent
  `630dd0a5-1ebb-4f91-a90c-ea9e4c5f20e5` is abandoned. The two links were then converted to
  backticked concept paths and the focused link validator passed, but those corrections remain
  unstaged over staged versions.
- The earlier `pnpm check` stopped at `secrets:scan` with two findings from shared repository
  history across branches/tags. It did not run later stages and is not feature-diff evidence. The
  owner then explicitly stopped further gate investigation.
- No commit or push contains today's reduction, evidence closeout, archive move, link corrections,
  or project-local hook attempt.

## Exact Feature-Worktree Snapshot

At HEAD/upstream `b5d37665c`, the index contains the archive/index/research/README compatibility
bundle. Two files are `MM` because the archive-link fixes are not staged. `.codex/config.toml` is
unstaged; the handler and schema are untracked. Preserve this state—do not reset, discard, or
broad-stage it. Re-run `git status --short --branch`, `git diff --cached --name-status`, and
`git diff --name-status` before any action because this is a shared filesystem snapshot.

## Platform and Entry-Point Sweep

- No Codex out-of-repo plan surface is present. The Claude plan files that keyword-matched hook
  terms belong to unrelated projects and carry no decision for this thread.
- Claude project memory, curated Codex memory, Cursor history, and Gemini history contained no
  additional repo-relevant hook record. The current Codex rolling history contains this owner
  dialogue, but no unique execution fact remains assigned only to that vendor-managed transcript
  after this handoff.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `skills.md` match the canonical pointer contract;
  `AGENTS.md` and `skills.md` carry the required rules-index extension. No Codex-specific adapter
  entry point exists and no entry-point drift was found.
- No new ADR, PDR, pattern, pending graduation, or strategic open question qualifies. The nested
  fail-open observation is a fresh worked instance of `verify-dont-trust`, not yet a new doctrine.
  The immediate diagnosis belongs here as a blocker. No Practice Core amendment is warranted.

## Unlanded State and Custody

- Feature HEAD is pushed, but today's probe, trial, compatibility change, documentation closeout,
  and reduction are uncommitted working-tree state.
- Main HEAD is `b4b72b7da`. The ratified Direct Trial and Investigation Stop gates are written but
  uncommitted in the canonical `oak-reason` skill and its Codex/Claude adapters. Claim
  `4c3051b8-d32e-4821-b115-c24b4bc37d16` covered that earlier change but is now historical and
  closed; it conveys no current custody. Immediately before this pause handoff closes, Lupin's live
  claims are `098dcaa6-2f72-442b-b0b3-bb4c5dcd706f`,
  `167b0efc-2fab-422c-993b-c9c36559450c`, and
  `6384eae3-cf0b-42f0-b57c-9c3eeca67a5b`; all three are to be closed without further implementation.
- Zephyr closed code claims `323cef0d-5ed7-4c8e-a810-c7131b0c5f9c`,
  `c453c5ee-374d-456f-84a7-e5c03ee5d5fc`, and
  `13a6fe7e-8823-47a3-9e03-9918a33da099` after Lupin's custody acceptance. Their archived closure
  summaries point to event `f2339493-9af0-4052-a53e-1b12818e8ad4`.
- The shared main checkout contains unrelated peer-owned changes. Never stage or commit it broadly.

## Next Safe Step — Only After Explicit Resume

1. Re-read this record, the ARC tail, both checkout statuses, active claims, and queue state. Treat
   every SHA, index description, and hook-trust statement here as a claim to verify.
2. Keep the already-approved reduced bundle distinct from the new activation slice. Decide
   explicitly whether the three activation files are a separate experiment/commit or should be
   removed before landing the reduced bundle.
3. Before a fresh origin session, diagnose the nested reviewer's exit `1` with bounded,
   content-free stderr/exit evidence from the existing benign event. Do not treat fail-open allow
   output as a pass, and do not broaden the hook while the failing child is unexplained.
4. If the child reaches a schema-valid `pass`/`concern`, run focused local checks and the gateway
   plus configuration/security/test review over the new three-file slice.
5. Start a fresh Codex session in the feature worktree, inspect all matching hook sources, and
   trust the exact project hook via `/hooks`. Run one controlled benign `apply_patch`, observe both
   nested reviewer completion and the origin action, then stop and assess latency before adding
   scope.
6. If landing is authorised, restage every intended file so the two link corrections enter the
   staged fingerprint; open a fresh bare index/head claim and commit-queue intent; use exact
   pathspecs; let ordinary hooks run. Push only after a commit actually lands and branch/upstream
   equality is rechecked.

## Checks Already Observed

- Direct Trial Gate: six isolated forward tests, Prettier, targeted Markdown lint, scoped diff
  check, and `pnpm skills:check` were green.
- Disposable PreToolUse apparatus: type-check, targeted ESLint, 23 focused tests, build, and diff
  check were green before the gateway. These prove implementation consistency, not retention.
- The successor must rerun focused hermetic checks after reduction. No live inference is needed.

## Terminal Gate Disposition

- Focused handoff-document Prettier and scoped diff checks passed.
- Zephyr announced the session-handoff singleton `pnpm check` in event
  `31cb6480-2b72-4dac-b1d8-f17117f491d4` against dirty shared main.
- The command stopped in its first stage after Gitleaks reported two repository-history findings;
  none of the later `pnpm check` stages ran. A redacted provenance-only diagnostic was then begun.
- The owner explicitly directed: “do not run the gate”. The diagnostic was interrupted and its
  process terminated. No file/commit attribution, remediation, or green whole-repo gate is claimed.
- Event `0a2af624-a1c9-42ab-bb30-a89b2456eaf7` broadcast the cancelled result to the team.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Lupin herds Bark | codex | GPT-5 | 019f67 | implementer and closeout owner | 2026-07-16 | 2026-07-17 |
| Zephyr turns Crosswind | codex | GPT-5 | 019f6a | compound peer and reviewer | 2026-07-16 | 2026-07-16 |

## Session Disposition

The preservation slice is committed and pushed in draft PR #403. Runtime attachment remains
unproven and the fresh discovery check is negative. The next session starts from the smallest
official configuration proof on a fresh branch; it does not resume the prototype by assumption.
| Lupin herds Bark | codex | GPT-5 | 019f67 | implementer, adversarial peer, documentation closeout owner | 2026-07-16 | 2026-07-16 |
| Zephyr turns Crosswind | codex | GPT-5 | 019f6a | compound peer, trial executor, terminal handoff author | 2026-07-16 | 2026-07-16 |

## Session-Completion Disposition

This is Lupin's full pause handoff, not feature completion. Execution gates live in `oak-reason`;
empirical evidence lives in research; historical intent remains intact in the archived plan;
operational custody and the exact interrupted state live here; first-order loss and recursive
metaloss live in the napkin. The reduced bundle remains uncommitted, the new hook is unreviewed and
its reviewer currently fails, the canonical gate is not green, and nothing was pushed. Verdict:
**pending** for the feature and activation; **session-completion consolidation captured** for this
paused session.
