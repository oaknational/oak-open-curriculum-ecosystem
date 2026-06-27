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

## 2026-06-27 — Read a tool-rule's actual criterion before dispositioning; a plausibility argument isn't proof (Gull tracks Eyrie)

- **A specialist subagent's blanket "all 18 regex findings are false-positives, dismiss all" was WRONG, and so was my own first analysis — both fixed by reading Sonar S8786's rule definition.** We both reasoned "delimited negated class (`{[^}]+}`) ⇒ linear." But S8786's documented criterion is *unanchored multi-position retry ⇒ O(n²) on non-match* (its noncompliant example is `/a+b/`; compliant `/^a+b/`). So those patterns ARE non-linear — NOT false positives; mass-dismissing 18 genuine findings would have been the error. Lesson: for a tool-rule disposition, read the RULE's criterion + examples first; a plausibility argument (yours OR a subagent's) is not proof. [[verify-dont-trust]], fluency-is-a-warning, owner's "critically assess subagent results" standing directive.
- **Phase-2 disposition (accept-with-rationale bar): 2 fixes + 16 accepts.** FIX = sitemap-scanner `\s*([^<]+)\s*` (real O(n²), network XML) and S6035 `(?:—|\))`→`[—)]`. ACCEPT = 14 S8786 (internal/build-time/generated inputs; JS has no possessive quantifiers so an atomic "fix" renumbers capture groups + forces consumer changes) + 2 S5843 canonical-semver (complexity, parity-locked). The Vercel `ignoreCommand` `.mjs` semver shim is irreducible: it runs before `pnpm install` (no node_modules, dist gitignored) so it can only use Node built-ins + committed source; parity-test-locked inline copy is correct. **Napkin near fitness limit — drain due (Cedar flagged).**

<!-- Merged from worktree-ws-b-explain (oak-under-the-hood reframe, 2026-06-27): the three entries below predate main's tail; reorder/drain at the next rotation. -->

## 2026-06-26 — Tests prove behaviour, never config or content; hashing a source to detect change is a config-pin (Skipper tracks Kelp)

- **Owner sharpening (absolute): a test/check must prove BEHAVIOUR without constraining
  implementation. The disqualifying screens: does it test configuration? assert content that can
  change (all content)? test test-code? test a third-party lib/service? use a complex mock instead
  of a trivial DI'd fake? Any "yes" → it is the wrong shape.** Hashing a source file and pinning the
  hash to detect change ("single-sourcing as a tested relationship") is the ANTITHESIS of
  prove-behaviour — it pins config, constrains the source's bytes, proves nothing about behaviour,
  and fails loud on a byte change that broke nothing. Content-grep tests
  (`expect(body).toContain('agent-first')` / `.not.toContain('Invite-Only Alpha')`) assert content
  that legitimately changes — brittle and circumventable. The cure for a content-quality invariant
  (a firewall: "no curriculum / no volatile status in the prose") is NOT a grep test — it is
  **construction + human review** (a PR-review checklist item). Worked instance: ripped the WS-B
  explain projection's two fingerprint drift-guards + two content-grep test files out (`03c279ca2`,
  +114/−605); kept only MCP-observable behaviour (resource registered with its metadata contract;
  read serves the wired body) + a DI'd assembler tested with trivial fakes. Sharpens
  [[feedback_test_the_flag_engine_not_the_configuration]] and
  [[feedback_never_pin_owner_tunable_values_in_tests]] (assert effects, not constants) into the
  6-screen checklist + the firewall-is-review rule. Candidate distilled/testing-strategy graduation.
- **A fresh git worktree needs `pnpm install` AND `pnpm build` before gates run.** type-check +
  vitest pass on install alone, but ESLint's flat config imports the internal
  `@oaknational/eslint-plugin-standards`, which must be BUILT (its package `exports` resolve to
  `dist/`) — so bare `eslint` exits 2 ("No exports main defined") in an install-only worktree. The
  main checkout is already built, masking this. Operational gotcha for any worktree-based lane.
  (Harness `EnterWorktree` places the worktree under `.claude/worktrees/` — gitignored, nested,
  sandbox-reachable — not as a sibling dir like the repo's `git worktree add` convention.)

## 2026-06-26 — Don't claim observable session state you haven't observed; build worktrees before session start (Cedar lifts Canopy)

- **Mistake: I told the owner "this session has its statusline" after `pnpm build` exited 0 — inferred,
  not observed. The owner's screenshot showed no statusline.** Two compounding errors: (1) I treated a
  build exit code as proof of a downstream observable (the statusline) — a convenient/fluent claim, the
  exact shape [[verify-dont-trust]] and the metacognition "fluency is a warning" note target; (2) I built
  the worktree MID-session, but the statusline initialises at session START (known primary-checkout
  statusline-resolution bug), so a mid-session build cannot restore the current session's statusline
  regardless. **Cure:** build every worktree BEFORE opening the session; never assert observable session
  state I have not actually seen. The owner's same-session directive — "all results from all subagents
  must be critically assessed, including claims and sources" — applies to my OWN claims too. Homed in
  [[feedback_worktree_needs_install_and_build]] + start-right §8.

## 2026-06-27 — Cross-worktree fragmentation; a state `.md` is still glob-linted (Cedar lifts Canopy)

- **Tracked `.agent/` files are PER-BRANCH, so they are invisible across worktrees — the F-41
  coordination home (`.agent/state/collaboration/`, the primary checkout) is the ONLY
  cross-worktree-visible surface.** A lane's state (thread record, plan, continuity) lives on its
  branch; from any other worktree it cannot be seen — so work on an unpushed feature branch is
  orphan-risk and a fresh session in another worktree can't find it. Worked instances: WS-B's D0
  state lived only on the unpushed `worktree-ws-b-explain` branch; the `data-sources-governance`
  branch is 38 behind main and lacks its OWN thread record (the grounding is on main). Cure: a
  cross-worktree work-state map at the coordination home
  (`.agent/state/collaboration/cross-worktree-work-state.md`) — the interim manual form of **F-98**
  (`agent-work-state-registry.plan.md`), which is the durable fix. Owner standing concern: never let
  work get forgotten/orphaned. Sibling: [[feedback_worktree_needs_install_and_build]].
- **A markdown file under `.agent/state/` IS linted by `markdownlint-root` — the glob does NOT
  respect `.gitignore`.** My new (git-ignored) cross-worktree map had an MD049 slip and blocked a
  PEER's tree-wide pre-push (markdownlint-root lints the whole working tree). Gitignoring the file
  did NOT exclude it from the lint (the glob `!`-excludes `shared-comms-log.md` by NAME, proving it
  ignores `.gitignore`). Cures: keep any state `.md` markdownlint-clean, AND the durable config fix
  is a glob exclude (e.g. `!.agent/state/**`) in the markdownlint-cli2 config (surfaced to the
  owner). A local-state file is not lint-exempt. Sibling: [[verify-dont-trust]].
