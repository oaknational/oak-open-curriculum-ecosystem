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

## Napkin rotated (2026-06-27 dedicated consolidation, Hawthorn rides Foliage)

Rotated at a goal-gated dedicated-consolidation session. The processed window (2026-06-25 →
2026-06-27 entries — the Sonar/CI-hardening/merge-train/Director-rotation window) is preserved
verbatim in `archive/napkin-2026-06-27-hawthorn-consolidation.md` (tracked, byte-identical).
Every behaviour-changing entry was dispositioned first-hand against its home before the
archive-move. As in the prior rotation, the substrate was already mature: most entries were
worked instances of patterns/rules/frictions live in their homes (`verify-dont-trust`,
fluency-is-a-warning, the merge-gate `CLEAN`/`BLOCKED`/`required_deployments` behaviour,
semantic-merge of memory files, `wrapped-exit-codes-false-green` for background-gate exit
masking). The genuinely-new facets graduated to the agent-tooling frictions register
(F-88 the comms-seen filename structural cure, F-92 the heartbeat-CLI/rule `--created-at`
drift, F-100 the workspace-creation skill + per-category config canon). The candidate-pattern
single-instances were promoted to their pattern homes **on the first instance** (owner
direction 2026-06-27: promote and trust the Practice to invalidate a wrong promotion through
experience, never hold for a second sighting) — `disambiguate-overloaded-term-before-canonicalising`
and `glanceable-surface-divergence-only-display` as new files, the pr-monitor head-SHA
refinement folded into `pr-monitor-to-merge`. `distilled` and `pending-graduations` are now
empty. The commits and the homes are the record of where each piece went.

New session observations append below.

## 2026-06-27 — Ask the Director for shared-state topology (Hawthorn rides Foliage)

- **Mistake → owner-corrected: I inferred the canonical buffer base by a multi-step solo
  divergence-archaeology pass instead of asking the Director who owns the shared-state branch.**
  Created off `main` (owner-acknowledged wrong base), then spent ~6 read steps diffing napkins
  across 8 worktrees to deduce that `chore/director-coordination` was the live buffer state —
  when one directed question to the Director (Hearth tracks Tallow) answered it directly and
  authoritatively (tip `beb53c423` stable; flow-back into the coordination branch; repo-continuity
  is the Director's lane). In an Implementer seat, shared-state topology is a Director question
  ([[feedback_implementer_routes_questions_via_director]]); archaeology to avoid asking is the
  failure. Cure: when a question is about who-owns-what / where-the-canonical-state-lives, route
  it to the Director first; reserve first-hand investigation for verifying their answer, not for
  reconstructing what coordination already knows. Sibling: [[read-before-asking]],
  [[feedback_useful_work_over_ceremony]].

## 2026-06-27 — Read a tool-rule's actual criterion before dispositioning; a plausibility argument isn't proof (Gull tracks Eyrie)

- **A specialist subagent's blanket "all 18 regex findings are false-positives, dismiss all" was WRONG, and so was my own first analysis — both fixed by reading Sonar S8786's rule definition.** We both reasoned "delimited negated class (`{[^}]+}`) ⇒ linear." But S8786's documented criterion is *unanchored multi-position retry ⇒ O(n²) on non-match* (its noncompliant example is `/a+b/`; compliant `/^a+b/`). So those patterns ARE non-linear — NOT false positives; mass-dismissing 18 genuine findings would have been the error. Lesson: for a tool-rule disposition, read the RULE's criterion + examples first; a plausibility argument (yours OR a subagent's) is not proof. [[verify-dont-trust]], fluency-is-a-warning, owner's "critically assess subagent results" standing directive.
- **Phase-2 disposition (accept-with-rationale bar): 2 fixes + 16 accepts.** FIX = sitemap-scanner `\s*([^<]+)\s*` (real O(n²), network XML) and S6035 `(?:—|\))`→`[—)]`. ACCEPT = 14 S8786 (internal/build-time/generated inputs; JS has no possessive quantifiers so an atomic "fix" renumbers capture groups + forces consumer changes) + 2 S5843 canonical-semver (complexity, parity-locked). The Vercel `ignoreCommand` `.mjs` semver shim is irreducible: it runs before `pnpm install` (no node_modules, dist gitignored) so it can only use Node built-ins + committed source; parity-test-locked inline copy is correct. **Napkin near fitness limit — drain due (Cedar flagged).**

## 2026-06-27 — "Autofixable" Sonar idiom rules can be TYPE-AFFECTING; split Phase 5 by type-safety (Starling calls Aether)

- **The Sonar enable→autofix→lock-at-error idiom strategy is too optimistic: several "autofixable" SonarJS
  idiom rules change TYPES and break soundness when blanket-locked.** Worked instances driving Phase 5A
  (PR #257): (a) `prefer-includes` (S7765) force-converts the **ADR-153 `value is X` type-guard** idiom
  `EEF_STRAND_IDS.some((id) => id === value)` to `EEF_STRAND_IDS.includes(value)` — type-unsound wherever
  the arg is wider than the array element (`value: unknown`/`string` vs a literal union); it broke
  `graph-corpus-sdk` (TS2345). The 7 affected guards were reverted to `.some`. (b) `prefer-at` (S7755)
  widens `arr[i]` → `arr.at(i): T | undefined`; consumers that didn't guard the result failed type-check
  (cured with `?? ''`). Cure: **split Phase 5 into a type-PRESERVING autofix tranche (lock at error:
  string-replace-all, string-raw, number-properties, node-protocol, global-this, object-has-own, +at-with-guards)
  and a type-AFFECTING per-site tranche (prefer-includes, prefer-regexp-exec)** where safe sites convert and
  the type-guards are ACCEPT-with-rationale. Sibling of Gull's "read the rule's actual criterion"
  ([[verify-dont-trust]]); candidate `patterns/` entry. Full detail in handoff
  `0087c313-starling-phase5a-to-successor-2026-06-27.md`.
- **Prove rule NAMES and coverage by dry-run, never trust the plan's map.** The plan listed
  `prefer-regexp-exec` + `prefer-object-has-own` as unicorn rules; both are wrong (the first is
  `@typescript-eslint`, the second ESLint-**core**). ESLint aborts config-load on the first unknown name.
- **Generated-idiom findings: fix the EMITTED TEMPLATE STRING in the generator, not the output** — eslint
  can't autofix code inside a template literal, so a hand-edit to the output drifts on the next codegen.
  Edit the template, `sdk-codegen` reproduces it, AND update the generator's pinning unit test (atomic
  test+code — the pre-commit gate caught `path-utils.unit.test.ts` asserting the old `.replace`).
- **Background-commit exit-capture gotcha (AX):** `git commit > log 2>&1; echo $?; tail log` makes the
  background task report the trailing command's exit (0), masking a FAILED commit. Capture `ec=$?` right
  after `git commit` and `exit $ec`. (I was briefly fooled until `git log` showed HEAD hadn't moved.)
- **New idiom rules land at `error`, not `warn`** when the same commit clears every violation — a landed
  `warn` is deferred-warning toleration (`principles.md §No warning toleration`). The new-rules-start-warn
  carve-out is only for a surface needing a separate migration lane (e.g. no-throw-statement). Owner-corrected.
- **Fresh worktree fails the pre-push `test:ui` gate until Playwright browsers are installed.** `pnpm
  install` does NOT fetch browser binaries, so a newly-`git worktree add`ed checkout's pre-push gate dies
  with "Executable doesn't exist at .../chrome-headless-shell". Cure: `pnpm --filter <app> exec playwright
  install chromium-headless-shell` in that worktree once. The failing `test:ui` is NOT the known
  oauth-proxy concurrency-flaky — read the log before assuming. (Multi-worktree workflow friction.)
- **Background-task "exit code 0" notifications lie — recurred for `git push`.** The completion summary (and
  a trailing `echo`) reports the WRAPPER's exit, not the wrapped command's. A backgrounded `git push` whose
  pre-push gate FAILED still notified "exit code 0"; the real `PUSH_EXIT=1` + the failure were only in the
  log. Always read the log tail, never trust the exit-code summary. (Extends the AX commit-exit gotcha.)
- **SonarCloud new-code duplication + CodeQL alerts surface PRE-EXISTING debt as "new" when an autofix
  touches the line.** Phase-5A's `.replace→.replaceAll`/`prefer-at` edits inside an already-duplicated
  59-line extractor block (8 copy-paste `vocab-gen`↔`src/bulk` pairs) and beside a polynomial-ReDoS regex
  re-attributed both to the PR. Cure = fix the ROOT (de-dup → prerequisite PR; `[^}]`→`[^{}]` at the
  generator), never CPD-exclude hand-written files or dismiss a genuine HIGH alert. Owner chose prerequisite
  PR + rebase to keep #257 single-concern.

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

## 2026-06-27 — Drain-by-promotion must verify each entry reaches a home (Hawthorn rides Foliage)

- **Emptying a drainable buffer by promotion must cross-check that EVERY removed entry reached a home — "I promoted everything" is a convenient claim to ground.** A pre-compaction consolidation this session promoted 16 of 17 `distilled.md` lessons to `patterns/` and silently dropped the 17th (the hook-firing-while-authoring lesson); a Cursor Bugbot diff-check on #260 caught it. The rotation summary asserted "every staged lesson was promoted" — unverified. Cure: diff the pre-empty buffer against the new homes and confirm each entry maps; never trust the aggregate. Sibling: [[ground-convenient-claims]], [[verify-dont-trust]], `patterns/hook-firing-while-authoring-names-a-concept.md` (the dropped lesson itself).

## 2026-06-27 — The completeness check caught the convenient "superset" claim; gates caught my own two defects (Pulsar calls Ether)

- **The `/oak-semantic-merge` completeness check is the loss-detector, and it earned its keep on #259.** The handoff said "set `napkin.md = CONTENT`" (Hawthorn's 166-line union, asserted superset). A naïve `cp` would have *looked* clean — but the heading set-diff found **10 of main's 15 napkin entries were NOT in CONTENT**. They turned out conserved in coord's #260 archive (verified: main's entries ⊆ CONTENT ∪ archive, empty miss-set), so taking CONTENT was correct — but only *because I checked*, not because the claim was trustworthy. This is the exact mechanical loss-detector PDR-119 names as its render-invariant. Cure (did it): before resolving any memory merge to one side, set-diff the entry-headings of every other side against the chosen result; an empty miss-set is the proof, the assertion is not. Sibling: [[ground-convenient-claims]], [[verify-dont-trust]].
- **My own two defects on PDR-119, both caught by gates — a worked case for why the gates are load-bearing, not my own review.** (a) `validate-reference-direction` (PDR-105) blocked: a Practice-Core PDR linked host ADRs with `../../../docs/` paths — Core→repo-specific. Fix: delink to plain identifiers; host ADRs resolve via the practice-index bridge (PDR-079/PDR-118 precedent); PDR-119 joins the queued PDR-079 sweep. (b) I wrote a line-starting `+` in the Related list (the no-"+"-in-prose rule), which `markdownlint --fix` mangled into a stray dash list item.
- **Gate-scope nuance (complements the state-`.md` entry above):** the **pre-commit** markdownlint is **staged-only** (`markdownlint-staged`) so git-ignored handoff lint does NOT block a commit; the **whole-tree** markdownlint runs at **pre-push**. Commit freely; `markdownlint:root --fix` the full tree before push.
- **Owner reinforced (standing, me + any agent):** when you or any agent need owner input to proceed, use the **proper tool (AskUserQuestion)**, not buried prose. Homes in [[feedback_surface_owner_decisions_as_questions]].
- **Callisto's session loss-scan (homed here from comms `7732d204` for the capture→graduate pipeline):** (a) a change-driven monitor is **blind to a stall** — "freshness ≠ liveness"; a stall-detector (no merge progress in N min → re-ground/ping) is a missing primitive (PDR-118/OQ5 territory); (b) a rotating cast **converges on owner re-direction, not autonomously**; (c) **memory-authoring invariant** — when one PR changes a shared memory file via union, others take main's; (d) surface-owner-decisions-**as-questions** (now owner-reinforced).
