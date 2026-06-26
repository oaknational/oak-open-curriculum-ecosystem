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
