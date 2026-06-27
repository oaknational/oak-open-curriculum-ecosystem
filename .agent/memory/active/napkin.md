---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

Current-session observations. Append below. Rotate when over ~400 lines (`consolidate-docs`
step 6): extract every behaviour-changing entry, merge into `distilled.md` or graduate to a
permanent home, verify the home, then archive and start fresh.

## Napkin rotated (2026-06-25 dedicated consolidation, Zephyr mends Bluff)

Rotated at a goal-gated dedicated-consolidation session. The processed window (the 2026-06-23 →
2026-06-25 entries) is preserved verbatim in
`archive/napkin-2026-06-25-zephyr-consolidation.md` (tracked). Every behaviour-changing entry was
dispositioned first-hand before the archive-move; the read-before-route check found the substrate
already mature — most entries were worked instances of patterns/rules/memory live in their homes.
The few genuinely-new facets landed as pattern extensions; the worktree-pilot team-coordination
learnings are conserved in that plan's §Consolidation as named PDR candidates. The commits and the
homes are the record of where each piece went.

New session observations append below.

## 2026-06-25 — Re-derive a surface's nature before curating it (Zephyr mends Bluff)

- **Re-derive a surface's NATURE before curating it; classify on each axis and don't
  over-collapse a multi-position axis into two.** This pass mis-treated repo-continuity twice:
  as a buffer to *drain* (it is a continuity surface — `continuity-practice.md §Disposition`:
  live content stays verbatim, only finished-work residue is curated), then it over-collapsed
  "not memory" into "untracked" and proposed migrating it to git-ignored state. The owner's
  correction: the tracking axis has **three** positions — **memory** (portable knowledge,
  tracked), **repo state** (repo-specific but *checkout-portable*, tracked: thread records and
  repo-continuity apply on any clone), **local state** (per-checkout, git-ignored: claims,
  comms) — and **only local state is git-ignored**. Continuity surfaces are **repo state**,
  correctly tracked all along. Both errors are
  [[inherited-framing-without-first-principles-check]] plus premature crystallisation (a
  two-way cut where there were three). Cure: read a surface's `overflow_disposition`/role and
  classify it on each axis — memory / repo-state / local-state, buffer / continuity, doctrine /
  question — before curating; never collapse an axis to two positions. The owner corrected the
  substrate taxonomy across several turns this session.
- **read-before-route's falsifier is the highest-value consolidation check.** Most napkin
  "new lessons" this rotation were worked instances of already-homed patterns
  (pr-monitor-to-merge, prove-the-checker, wrapped-exit-codes, never-disable-checks). Checking
  the homes (the patterns dir) first prevented bloating distilled with duplicates. A mature
  substrate's pass is mostly confirm-duplicate plus a few small extensions, not new homing.
- **Registers drift without belongs/does-not-belong examples AND a homing table that names
  them.** pending-graduations / open-questions had accumulated future-work, proposals, and
  operational questions because `ephemeral-to-permanent-homing.md`'s destinations table never
  named the registers. Structural cure: name every surface in the table + sharp
  belongs/does-not-belong examples in each register header.
- **A bot finding can catch you contradicting your own freshly-authored intent.** cursor[bot]
  caught Q-011 removed from open-questions while the just-refreshed doctrine said such
  strategic forks belong there (and the plan that now held it archives). Assessed first-hand,
  agreed, restored. A worked instance of [[feedback_validate_specialist_findings_before_acting]]
  in the *agree* direction.

## 2026-06-26 — Read the full merge-gate memory + trust CLEAN before reaching for --admin (Wombat wakes Eventide)

- **Mistake: under-read a `MERGEABLE/CLEAN` mergeState and asked an unnecessary `--admin`
  question.** On PR #227 (owner-authored, sole code owner = author) I reasoned "self-approval is
  blocked → code-owner gate unmeetable → need OrganizationAdmin bypass" and surfaced it as an owner
  decision. But `project_main_merge_gate_codeowner` already records (verified 2026-06-24) that
  owner-authored PRs **auto-satisfy** the code-owner requirement and merge **CLEAN with a plain
  `gh pr merge`, no `--admin`**. The `CLEAN` I observed *was* the answer; `BLOCKED` would have meant
  blocked. I acted on the MEMORY.md index *summary* ("--admin forbidden; clean agent merge
  prohibited") without opening the full memory, whose nuance contradicted my framing. The merge
  still landed correctly (--admin was redundant, not harmful), but I cost the owner an unnecessary
  decision. **Cure:** before any merge-gate decision, open the full merge-gate memory (not the index
  line) and read the live `mergeStateStatus` — `CLEAN` ≠ blocked. Siblings: [[verify-dont-trust]],
  [[feedback_check_pushed_state_via_upstream_ref]], the metacognition "fluency is a warning" note
  (a smooth "of course self-approval is blocked" frame bypassed the situational check).

## 2026-06-26 — A CI/merge control must be verified against THIS repo's integration wiring before adoption (Wombat wakes Eventide)

- **Pattern candidate: a generically-good gate can be incompatible with the repo's specific
  integration architecture; verify event-support against your actual wiring, and prefer the
  simplest control that meets the goal.** The owner enabled a GitHub **merge queue** (a sound
  Tier-2 control from the assessment) to stop merge-skew. But a merge queue requires every required
  gate to report on the `merge_group` ref, and this repo's three gates each fail that as wired:
  CodeQL is **default setup** (can't run on `merge_group` — codeql-action#1537, open 3+ yrs, verified
  first-hand), SonarCloud is the **app automatic-analysis** (no `merge_group` status; the CI-scanner
  fix would violate ADR-161's network-free-CI boundary), and Vercel is the **Git integration**
  (doesn't deploy `merge_group` refs, so `required_deployments` can't satisfy in-queue). The cure was
  not to force the queue (advanced-CodeQL + ADR-161-violating Sonar + custom Vercel = heavy +
  self-contradicting) but to choose **require-branches-up-to-date** — same merged-state protection,
  compatible with all current integrations, ADR-161-clean, no new infra, no bypass (ADR-204). Lesson:
  before adopting a CI/merge control, ask "does this work with our *specific* integration setup
  (default-vs-advanced, app-vs-CI-scanner, Git-integration-vs-custom)?" — not "is this control good
  in general?" Empirical proof (a real PR through the gate) settles it. Sibling:
  [[feedback_check_doctrine_preconditions_before_applying]], [[verify-dont-trust]]; candidate for a
  `patterns/` entry if a second instance appears.

## 2026-06-26 — An inherited handoff term can smuggle a hedge-frame the design doesn't actually have (Inferno holds Tongs)

- **Surprise: the PDR-044 write-hook blocked "carve-out" mid-edit, and it was right.** The
  owner-approved handoff (and ADR-174's anticipatory wording) framed the dependency-review work as
  "a narrow carve-out to ADR-161." I typed that verbatim into the ADR-161 Status line and the hook
  blocked it as a write-time fingerprint of expediency-hedging. Per
  [[hook-policy-substring-discipline]] I did NOT synonym-swap; I reappraised the *concept*. The
  reappraisal yielded a strictly better framing: it is not an *exception hedged into* the rule, it
  is a **positive scope refinement** — ADR-161's rationale was always third-party-vendor uptime, and
  GitHub's own same-instance API was never a third-party call, so the dependency-review gate is
  *within* the boundary correctly understood, not carved out of it. The handoff's vocabulary carried
  a hedge-frame the actual design did not have. **Lesson:** an inherited term (from a handoff, a
  prior ADR, an owner phrasing) can import a frame you wouldn't choose from first principles; the
  hook firing on it is a design signal, not a lint to route around — reframe positively and the ADR
  comes out stronger. This is [[feedback_existence_is_not_correctness_default_replace]] applied to
  vocabulary, and the metacognition "fluency is a warning" note (a fluent inherited word bypassed
  the situational check). Sibling: [[verify-dont-trust]].

## 2026-06-26 — A CI gate passing on its first run is a vacuous green, not proof it gates (Inferno holds Tongs)

- **Owner correction: "a completely useless unit test can pass on the first go, that's why TDD
  requires RED, green, refactor."** I watched the new advisory `dependency-review` gate pass on PR
  #236 and wrote "the gate works end-to-end." Wrong. #236 introduces **no dependency changes**, so a
  green there proves only that the workflow *executes without erroring* — it would pass identically
  whether `fail-on-severity: high` is wired correctly OR the action is a complete no-op. I never saw
  RED, so the green was uninformative about whether the gate *gates*. **Cure (did it):** I proved RED
  on a throwaway branch adding `[email protected]` (critical CVE-2021-44906) — the `dependency-review`
  check went FAILURE, and the job log cited the exact advisory (`GHSA-xvch-5gv4-984h`), confirming it
  failed *for the right reason*, not incidentally. Then #236's green is the real green (clean input →
  pass). **Lesson:** for any gate/guard/validator, a green is meaningful only once you have seen the
  matching RED for the right reason; "it ran and passed" is not "it works." This is the same shape as
  [[feedback_test_the_flag_engine_not_the_configuration]], [[feedback_run_the_thing_dont_flag_the_gap]]
  (run the gate against an input that *should* trip it), and the test-expert's describe-vs-audit
  screen. Applies to CI gates, hooks, and assertions alike. Sibling: [[verify-dont-trust]].

## 2026-06-26 — Disambiguate overloaded terms before canonicalising; verify your OWN explanations against the full source (Bonfire guards Temper)

- **Disambiguate an overloaded term's distinct concepts BEFORE canonicalising or sweeping for it.**
  Canonicalising "target platforms" for the MCP app, "platform" denoted three different things —
  dev-agent platforms (Cursor/Claude Code/Gemini-CLI/Codex), illustrative MCP-client examples in
  technical contexts, and the MCP-app's target end-user assistants — and WITHIN the last, two more:
  the support *principle* (open-ended, even-handed) vs **K3 the owner-ratified initial release
  surface**. A naïve "replace every platform mention with the canonical four" would have conflated dev
  tooling with end-user assistants and flattened a ratified strategic distinction. Cure: before a
  canonicalise/sweep, enumerate the distinct concepts the term denotes and scope each — a per-concept
  find-and-conform pass, never a global string-replace. NEW (one instance); candidate pattern.
  Siblings: [[inherited-framing-without-first-principles-check]], the 2026-06-25 "don't over-collapse a
  multi-position axis into two" entry.
- **Plausible-but-wrong explanations come from reading a SUBSET of the source; verify your OWN
  explanation against the FULL source before presenting it.** Twice this session I gave a fluent,
  plausible diagnosis that was wrong: (1) "the PR's preview-deployment block is illusory gate-flux" —
  actually a real `required_deployments: ["Preview"]` ruleset rule I'd missed by reading only
  `required_status_checks`; (2) a guessed provenance for a statusline behaviour. Each dissolved once I
  read ALL the source (every ruleset rule type; the actual git history), not a subset. **Same-day
  recurrence with Wombat's "acted on the MEMORY.md index summary, not the full memory" entry above** —
  two agents, one day, same failure family → PDR-098 recurrence signal that the fluency/verify-own home
  is not firing at the action moment. Owner reinforced it as a daily.md rule ("critically assess ALL
  findings, claims, sources, context"). Siblings: [[fluency-is-a-failure-vector]],
  [[adversarially-verify-own-synthesis]], [[verify-dont-trust]].
- **GitHub merge-readiness (consumer side): `required_deployments` ≠ `required_status_checks`, and
  all-checks-green + `MERGEABLE`/`BEHIND` ≠ merge-ready under require-up-to-date (ADR-204).** PR #235
  showed 8/8 checks pass yet "Merging is blocked — Missing successful active Preview deployment": the
  ruleset required a `Preview` *deployment* (a separate rule type from status checks), and the branch
  was behind the just-landed gate. The fix was not a bypass but the gate's own remedy — update the
  branch → fresh `Preview` deployment for the up-to-date head → block cleared. Consumer-side worked
  instance of Wombat's merge-gate entry above (ADR-204). Sibling: [[verify-dont-trust]].
- **Statusline (any glanceable surface): show a coordination token only when it diverges from its
  working-side counterpart.** The two-set statusline (PR #235) suppresses the whole coordination line
  when its branch == the working branch, and drops the primary checkout's name when it == the worktree
  name — two near-identical tokens on adjacent lines force a human out of glance-mode into careful
  reading. The cure for "two things communicating the same information" is REMOVAL of the redundant
  token, not adding disambiguation (which adds visual load). NEW (one instance); candidate
  communication-design pattern.
- **PR-CI monitor: key the dedup on the head SHA and emit on EVERY terminal bucket.** A name-keyed
  monitor won't re-report a re-run's checks after a branch update (they match the prior run's strings);
  keying on head SHA fixes per-push tracking. Emitting only on `pass` makes a failure indistinguishable
  from "still running" — emit on pass AND fail/skip/cancel so silence ≠ success. Extends
  [[pr-monitor-to-merge]].

## 2026-06-26 — CI parallelisation: fail-closed gates, findings-vs-live-source, semantic memory merge (Inferno holds Tongs)

- **A fan-in / aggregate gate must be fail-CLOSED — require every result to be `success`, not just
  block on known-bad values.** The split-CI `run-quality-gates` aggregator first matched only
  `failure`/`cancelled`; a bot caught that a standalone `skipped` (e.g. a future `if:`-guarded job)
  would slip through as a pass. Fix: require all `needs.*.result == success` (failure, cancelled,
  skipped, and any future GitHub value all block). Generalises the vacuous-green entry above: a gate's
  safe default is fail-closed. Sibling: [[verify-dont-trust]].
- **Validate a reviewer's finding against the live artefact it describes, not the doc it cites.** A
  code-expert flagged "widget/a11y tiers newly promoted to CI" as blocking — but it compared to a
  stale ADR-121 matrix; the actual `main` ci.yml had run them since #230, so the split merely preserved
  them. Acting on the "fix" would have DELETED real coverage. Check current source, not the stale doc a
  reviewer reasoned from. Sibling: [[feedback_validate_specialist_findings_before_acting]].
- **`gh pr merge --delete-branch` while carrying uncommitted cross-cutting changes makes a mess.** It
  switches the local checkout to the base branch (reverting committed working files) and aborts the
  fast-forward on the uncommitted changes — the remote merge still succeeds, the local tree is the
  casualty. Land or commit unrelated working-tree changes first, or merge without `--delete-branch`.
- **Merge agent memory/state files SEMANTICALLY, never by git line-merge (owner standing principle,
  2026-06-26).** When napkin/continuity diverge (your edits + another session's), git's line-merge
  corrupts the concepts. Resolve as a CONCEPT UNION: identify what each side ADDED, author a merged
  file where all entries coexist (recency-ordered, session-grouped where the file is index-shaped),
  and review the WHOLE file, not just conflict hunks. The `merge_class:` frontmatter declares each
  file's merge shape. Being written down as doctrine + a skill (owner-directed).
- **Sonar `githubactions:S8264`: declare workflow permissions per JOB, not workflow-level.** A full
  workflow rewrite makes the permissions block "new code" and Sonar flags the over-grant; checkout
  jobs get `contents: read`, a fan-in job that uses no token gets `{}`.

## 2026-06-26 — Sonar S8707 site-3, DRY/SSOT, read-the-live-surface (Alder tracks Topsoil)

- **The repo needs a workspace-creation skill (owner-directed).** Creating `packages/core/safe-path`
  was manual + error-prone: mirror a sibling's package.json / 3 tsconfigs / tsup / vitest / eslint /
  README, add to the **EXPLICIT** `pnpm-workspace.yaml` list (NOT a glob — I missed it, owner had to
  prompt), wire `workspace:*` deps into consumers, confirm turbo auto-discovery, run config-expert.
  Should become a skill (template per workspace kind: core util / lib / sdk / app). Also in
  agent-memory `create-workspace-skill-needed`; graduate into the agent-tooling frictions register.
- **Workspace config divergence needs an analyse-and-categorise pass (owner-directed).** The
  `default` export condition is split 11-no / 7-yes across packages — config-expert wrongly called
  adding it a "MUST" (it is not; `type-helpers` ships without it), but it IS the right robustness
  choice for a broadly-consumed core util, so `safe-path` adopts it. The divergence signals we should
  categorise workspaces and decide consistent config approaches within and between categories, under
  strict + LTAE. A real follow-up; capture as a plan. (`workspace-config-categorisation-needed`.)
- **Read the LIVE authoritative surface, not a stale proxy — I made this mistake 3× this session.**
  (a) `git grep origin/main` (committed) vs the working tree the owner was live-editing → I declared
  the `--passWithNoTests` masks "net-new" when the owner had already removed them in the tree.
  (b) `gh api .../branches/main/protection` (legacy) vs the **ruleset** → I called SonarCloud
  "advisory" when it is a REQUIRED merge check. (c) a `.ts`-only grep vs `package.json` → missed where
  `--passWithNoTests` actually lived. Cure: when a check returns a convenient "all clear", distrust it
  HARDER and verify against the authoritative live surface — the convenience is the tell.
- **Enforce DRY for security-critical code; don't make the owner say "enforce DRY".** I leaned on the
  `consolidate-at-third-consumer` rule's "third" wording to rationalise duplicating a path-containment
  validator across two workspaces. The owner corrected the guidance: extraction is at the **second**
  consumer (it always was — the rule was mis-stated as "third"; content now fixed, filename retained as
  a stable id pending a tracked rename). So the SSOT extraction at the 2nd consumer was the on-policy,
  correct move. Lessons: a security validator must have one source of truth (divergence is a latent
  defect); a required gate (Sonar duplication) forces the right answer; don't let a rule's stated number
  override DRY — check the rule's correctness and preconditions before leaning on it.
- **For squash-merged branches, SHA-not-ancestor ≠ content-absent.** `git log main..branch` listed
  "net-new" commits whose CONTENT was already on `main` via the #222 / #224 squashes; the worktree
  "keepers" were already merged. Compare CONTENT (per-file diff / cherry-pick dry-run), not commit
  ancestry, to decide what is genuinely net-new to integrate. (Owner has re-enabled merge, not squash,
  for PRs precisely to keep commit-level comparison.)
- **Post-compression, RE-GROUND before acting — never resume edits on the summary's picture.** After a
  context compression I resumed *editing* `analyze-elser` on the summary's "solo, finish the lint" frame,
  blind to the live multi-agent context (a Skipper→me worktree handoff, Cedar on a disjoint lane, a stale
  Director claim). The edit happened to be safe — but I had not verified that when I made it. The discipline
  already exists (start-right-team §Continuation Pointer Contract: recompute volatile truth from live
  surfaces before acting); the gap is that nothing auto-fires it at the compression boundary — the owner had
  to prompt the re-ground. Owner-action-is-a-stopgap ⇒ a missing primitive (a post-compression auto-reground
  trigger; candidate). Cure until then: treat every compression boundary as a context-loss event whose first
  move is re-grounding, never a resumed edit. [[inherited-framing-without-first-principles-check]]
- **Read your OWN handoff — frozen reasoning can beat live reasoning.** My thread record prescribed
  extracting `analyseReport()` (a `void` block) to clear `max-statements`. In the moment I instead extracted
  a `string`-returning resolver, which tripped `consistent-return` (the rule does not infer `process.exit` is
  `never`) — a wasted cycle. Following my own recorded plan would have avoided it. A handoff is not only for a
  successor; it is my best prior thinking, to honour unless I have a concrete reason to override.
- **Worked instance of the 2026-06-26 "trust CLEAN before `--admin`" entry (Wombat, above):** #242's
  `mergeStateStatus` went BLOCKED→CLEAN once the 5 review threads resolved, and it merged with no approval
  **because it was agent-authored under the owner's shared gh auth and the sole code owner IS the author**
  (the documented author-dependent gate behaviour — GitHub auto-satisfies the gate and forbids
  self-approval). NOT "these paths aren't code-owner-gated": CODEOWNERS is `* @jimCresswell`, every path is
  gated. I first recorded the path-scoped reading; the loss-scan caught it against
  [[project_main_merge_gate_codeowner]] (which already documents the author-dependent behaviour) — a
  ground-convenient-claims miss (I asserted a convenient explanation without checking the existing memory).

## 2026-06-27 — A "false positive" reflex on generated code is a fluency trap; set the disposition bar before triaging (Gull tracks Eyrie)

- **Mistake → corrected: I reflexively marked S101×3 (PascalCase on the generated openapi
  `paths`/`components`/`operations`) FALSE_POSITIVE**, on the fluent "it's generated, names are hardcoded,
  owner pre-authorised" frame. Owner asked for a subagent second-opinion; it refuted the FP and I verified
  first-hand: the file IS generated but the repo's `postProcessTypesSource` hook (`codegen-core.ts:176/202`)
  *could* rename them — so it is NOT a tool error, and FP would be suppression wearing an FP costume. The
  honest, proportionate disposition is **ACCEPT (won't-fix)**: the names are the public API of
  `@oaknational/sdk-codegen` + the universal openapi-typescript/openapi-fetch ecosystem convention, so a
  genuine rename is a breaking change for a MINOR cosmetic rule. Worked instance of the metacognition
  "fluency is a warning" note + [[feedback_validate_specialist_findings_before_acting]] + [[verify-dont-trust]].
  Also: a subagent can be right to REFUTE yet over-reach — it conflated "fixable" with "worth fixing"; the
  proportionality judgement is mine to add, not the subagent's to make.
- **Set the disposition BAR before triaging a backlog "to zero".** Owner ratified (AskUserQuestion):
  genuine fix is default; site-specific architectural tension → recorded ACCEPT; FALSE_POSITIVE only for
  true tool errors. This governs all ~388 remaining Sonar issues — without the bar, every disposition is an
  ad-hoc call and "zero" is ambiguous (accept-with-rationale ≠ fix-everything). Name which "zero" the owner
  means before triaging, not per-issue.
- **Tooling gap: Sonar MCP `change_sonar_issue_status` has NO rationale-comment field**, and the auto-mode
  classifier blocks issue-status writes as unauthorised external-state mutation until explicit owner auth.
  So a server-side disposition can't carry its "why" in Sonar — the durable rationale must live in the
  napkin/plan/comms. The classifier reading "zero means zero" as "fixes, not dispositions" was a useful
  perturbation — it forced the bar to be made explicit. Candidate: a permission rule + a rationale-capture
  convention if doing many. Adjacent [[no-warning-toleration]] (a dismissal without recorded rationale is a
  thin audit trail).
- **Capture notes in the napkin, not (only) comms/scratchpad (owner correction).** I recorded the S101
  decision in a comms event first; the owner reminded me the napkin is the home for session notes. Comms is
  for live coordination; the napkin is the capture→distil→graduate buffer (PDR-014).

## 2026-06-27 — Conformed to a bad filename convention under fluency; the slug already exists (Oyster spins Coral)

- **Mistake → owner-caught: I "fixed" my comms-seen file by conforming to a space-and-capitals
  convention instead of questioning it.** My first watcher used `oyster-spins-coral.json`
  (lowercase-kebab — correct). The F-95 `assert-watcher-live` gate failed because it derives the
  expected heartbeat path from the *display* `agent_name` ("Oyster spins Coral"), so I renamed my
  file to `Oyster spins Coral.json` to match the 68/88 existing spaced files. The owner then
  directed: filenames should be all lowercase, no spaces. My original instinct was right; I
  overrode it under **fluency / artefact-gravity** ("the gate expects this name, just match the
  surrounding convention") — the exact bypass the metacognition "fluency is a warning" note names.
  The friction (gate rejecting my kebab name) was type-2 *genuine divergence* (the CLI derivation
  is wrong) dressed as type-1 *trivial gap* (I named my file wrong). Worked instance of
  [[feedback_existence_is_not_correctness_default_replace]] applied to a convention, and
  [[verify-dont-trust]] (a convenient "just match it" frame).
- **The structural cure already half-exists.** `agent-tools/src/core/agent-identity/derive.ts:23`
  already mints a lowercase-kebab `slug` (e.g. `harrier-weaves-stratosphere`). The defect is that
  the comms-seen/heartbeat **filenames** consume the human display `agent_name` instead of that
  slug — single derivation point `commsSeenFileForCodename(agent_name, …)`
  (`claims-open-watcher-gate.ts:67`) + `cli-comms-assert-watcher-live.ts:31` (`codename =
  self.agent_name`). Fix = consume `slug` not `agent_name` for the path; migrate the 88 existing
  files; update the convention text in `comms-all-channels-watcher.md`. Display name stays
  human-friendly in comms *content*; only the *filesystem identifier* becomes machine-safe
  (display-name ≠ filesystem-id). NOT a hot-patch: 3 peers' live watchers + the F-95/`claims open`
  gates all key on the spaced form right now — changing the derivation mid-window breaks the
  team's gates, and switching only my own file breaks only me (which is itself the proof the
  entrenched convention can't be opted out of per-agent — it needs the structural CLI fix). Route
  as a tracked agent-tooling change (fits the AX frictions register + `agent-tools-cli-ergonomics`
  plan), landed when the window is quiet or with dual-read backward-compat. Candidate friction
  entry.

## 2026-06-27 — Session-close residuals (Alder tracks Topsoil)

- **Don't bundle a deep-review-gated forward-design doc into a closeout PR — it spawns an
  unbounded bot-review churn loop.** PR #244 (sonar-lane closeout) carried the PROPOSED,
  deep-review-gated `comms-and-worktree-operability.plan.md`; every push drew finer Codex/Copilot
  refinements of the *plan's* prose (5+ rounds, each fix spawning the next) — a forward-design doc
  has near-infinite polish surface and is deferred to a review that will rework it, so perfecting
  its prose pre-review is wasted effort that blocks the closeout. The live worked instance of
  [[pr-comments-resolve-and-recheck]] (every push → re-check → new comments). **Cure:** land such
  docs in their OWN reviewed PR; if bundled, add ONE top "deep re-assessment scope" note folding
  the content comments wholesale (what unblocked #244, owner-directed) rather than chasing
  line-by-line.
- **comms/claims primary-anchoring is asymmetric.** Only `comms send` auto-anchors
  `--comms-dir`/`--active` to the primary via `resolveCoordinationHome`; `comms
  list/watch/inbox/direct/reply` and `claims` REQUIRE those paths explicitly — pass the
  primary-resolved path, never relative (from a worktree a relative path lands worktree-local).
  Folded for re-assessment in the operability plan, which itself **needs its deep review before any
  execution** (flagged at its top, not done this session). (My per-user worktree-resolution
  agent-memory note still over-generalises this and wants tidying.)

## 2026-06-27 — All-channels watcher has no observer mode: per-heartbeat context tax (Chinook turns Halo)

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state comms watch` / [[comms-all-channels-watcher]] rule
- **Signal**: friction
- **Observation**: As Director-in-Waiting (owner: minimum action, preserve context, stay abreast), I
  armed the canonical all-channels watcher and stopped it within minutes. In an n=3+ window heartbeats
  (~1/min across 3–4 agents) dominate, and each emitted event re-invokes the agent (reads whole
  context) — so for a passive, non-claim-holding observer every heartbeat wake is pure context drain.
  The rule mandates emit-everything + triage-in-reasoning, which is correct for active participants
  (the F-95/2026-05-22 founding failure) but offers no low-engagement dial; triaging still pays the
  full re-invocation cost before the triage.
- **Behaviour change / candidate follow-up**: captured as **F-99** in the agent-tooling
  frictions-register — opt-in observer/`--exclude-heartbeats` consume-mode scoped to non-participant
  roles, preserving the active-participant emit-everything guarantee (same value-contingency PDR-082
  n=2 and the PDR-078 §4 consumer-absent exemption already recognise). For now a passive
  Director-in-Waiting holds an accurate snapshot and refreshes on re-engagement rather than running a
  per-event watcher.
- **Source plane**: active

## 2026-06-27 — Closeout writes are unconditional: a collision/claim/fitness concern NEVER blocks preserving understanding (Oyster spins Coral)

- **Mistake → owner-corrected (recurrence of a homed principle):** at session closeout I DECLINED to
  write the shared tracked continuity surfaces (repo-continuity, thread records, napkin), citing a
  shared-branch collision with the incoming Director (Chinook, on my coordination branch in the
  primary) and "continuity is the live Director's domain now." WRONG. The owner's standing principle,
  stated for weeks and homed in [[feedback_claims_never_block_memory_state_writes]] + the
  repo-continuity invariant ("shared memory/state files are always writable when dirty"): **it is
  ALWAYS okay to write the shared memory surfaces so nothing is lost; claims, coordination-collisions,
  and fitness results are ABSOLUTELY secondary to preserving understanding, ALWAYS.** OS locks handle
  concurrency; the rare collision is recoverable via [[oak-semantic-merge]] (additive memory writes
  never destroy). The deeper hazard I missed: my session's understanding + the handed lessons lived
  ONLY in *untracked* surfaces (comms `.agent/state/`, the handoff record under `.agent/state`) —
  untracked-by-design (ADR-199/PDR-094), so version history is no backstop. Deferring the
  tracked-surface writes was risking real loss — exactly what closeout exists to prevent. **Cure:** at
  closeout, WRITE the shared continuity surfaces unconditionally; never let "handed off / not my
  domain / would collide / over fitness" defer a preservation write. Distinguish CAPTURE (append/mirror
  — always do) from DRAIN (rotate/extract-to-homes — a separate consolidation, deferrable). Recurrence
  of a homed lesson → PDR-098 signal that the fluent "not my domain" frame bypasses the principle at
  the action moment. Siblings: [[fluency-is-a-failure-vector]], the metacognition "fluency is a
  warning" note, [[feedback_knowledge_preservation_over_fitness_warnings]].

- **Session arc (Director seat, 2026-06-27):** adopted Director from Cedar (PDR-064 Moment-2) → drove
  the five-PR merge train to main (#248 hygiene rule, #250 statusline, #251 sonar thread, #249 Sonar
  P2, #247 napkin residuals — last via a hand-resolved /oak-semantic-merge napkin union, both sessions'
  entries conserved; releases 1.36.2→1.36.4) → coordinated team rotation (Gull→Brazier, Peony→Swordfish)
  and Cedar's owner-authorised D1–D6 program (D4/D6 GO as separate PRs; PDR-118 keystone PR #253 routed,
  classification PDR-not-ADR concurred) → pre-positioned + handed the seat to Chinook turns Halo.

- **Load-bearing general lessons I engaged this session (mirrored from untracked comms so they survive):**
  - **A PR `BLOCKED` with all checks green AND up-to-date is unresolved review threads, not behind-state.**
    I misdiagnosed #251 as BEHIND (read `mergeStateStatus=BLOCKED`, assumed behind); Gull verified
    first-hand it was 0-behind + 2 unresolved Copilot threads (`require_review_thread_resolution`).
    Check the ACTUAL blocker (`gh ... reviewThreads`) before `update-branch`. [[verify-dont-trust]]
  - **Backticks in a double-quoted bash `--body` trigger command substitution** (a comms broadcast
    blanked a worktree name: "command not found: worktree-ws-b-explain"). Always `--body-file` for any
    body with backticks/special chars — it reads literally, bypassing the shell. A shell-quoting hazard.
  - **The mechanical liveness `freshness_status` is authoritative; a `fresh` Director that is
    comms-quiet is WORKING, not retired.** Early on I nearly read Cedar (fresh, but ~1h comms-silent)
    as stood-down and rationalised "heartbeat stopped" against the tool's `fresh` — then Cedar
    broadcast mid-cleanup. Trust the tool; don't take a seat over a `fresh` holder without a
    pre-position. Worked instance of [[director-handoff]] "fresh = live" + fluency-is-a-warning.
  - **`update-branch` git-line-merges memory files silently** — before merging any napkin/repo-continuity
    -touching PR, inspect that the memory-file change makes actual sense (owner directive); the #247
    napkin both-sides conflict was hand-unioned, not auto-merged.

- **Handed lessons conserved (addressed to me for the deferred drain; summarised here so the
  understanding survives in tracked memory, full text in the comms stream + the Oyster→Chinook handoff
  record):** Gull — (a) read a Sonar rule's actual criterion before dispositioning (S8786 "linear-looking"
  patterns ARE non-linear via unanchored multi-position retry; a subagent's blanket-FP was wrong), (b)
  S5914 type-test cure is `expectTypeOf`, not deletion (the compile-time relation is the assertion);
  Peony — synthesise, don't collapse design reasoning into either-or ([[premature_crystallization]]);
  Brazier — fresh-`git worktree add` has no node_modules/built deps so per-workspace lint/type-check
  fail until `pnpm install` + prereq builds (AX friction; the cold pre-commit is >2min — background it),
  and `git worktree add -b` over `git checkout -B` (never-use-git-to-remove-work). The napkin DRAIN that
  homes these to permanent surfaces is deferred (owner-directed: not this session) — napkin is over its
  soft fitness limit but under the ~400 rotation trigger; preserve, do not trim.
