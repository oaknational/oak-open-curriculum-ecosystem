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

## Napkin rotated (2026-06-28 dedicated consolidation, Clover lifts Root)

Rotated at a goal-gated dedicated-consolidation session. The processed window (the 2026-06-26 →
2026-06-28 entries — Sonar idiom-rule tranching, tests-prove-behaviour, cross-worktree
fragmentation, the #259/#260 memory-reconciliation arc, n=2 shared-tree commit hazards, and the
docs-reviewer-split) is preserved verbatim in
`archive/napkin-2026-06-28-clover-consolidation.md` (tracked, byte-identical). Every
behaviour-changing entry was dispositioned first-hand against its home before the archive-move.
As in prior rotations the substrate was mature: most entries were worked instances of live
patterns/rules/frictions (`shared-state-topology-is-a-coordinator-question`,
`fluency-is-a-failure-vector`, `governance-claim-needs-a-scanner`, `cross-lane-commit-blocking`,
`wrapped-exit-codes-false-green`, `whole-tree-gate-red-on-untouched-files`, `worktree-hygiene`,
F-98/F-101/F-102/F-103). The genuinely-new doctrine graduated **on first instance** (owner
direction: promote and trust the Practice to invalidate a wrong promotion through experience):
the owner-sharpened tests-prove-behaviour six-screen + firewall-is-review rule →
`testing-strategy.md §Rules`; schema-as-SSOT-for-vendor-surfaces → a new `patterns/` file; the
mechanical lossless-reconciliation proof (set-diff + merge-base-diff) → the `semantic-merge`
skill §Verify; the new-eslint-rules warn-vs-error boundary, the re-litigation and
supersession-vs-sequencing facets, and the fresh-worktree Playwright-browser step → per-user
memories; and the F-95 watcher-gate false-negative → F-104. `distilled` and `pending-graduations`
are empty. The commits and the homes are the record of where each piece went.

New session observations append below.

## Setup → team-session bridge + the over-separation correction (2026-06-28, Beluga rides Wave)

Setup agent for the team-tooling session: locked the scope (impact×effort → MoSCoW → §Locked scope),
authored the owner-approved Director+2-Implementer team-session plan (readiness-reviewed — 4-lens +
adversarial-verify workflow, 5 fixes folded), opened draft PR #268, authored the O5 under-the-hood MCP
discovery-pointer precursor, briefed Director Firefly binds Slag (comms `d4c447b1`), stood down.

- **Over-separation can be the bug** (graduated → memory `feedback_inherited_separation_can_be_the_bug`).
  I over-engineered an "app-local, don't entangle" precursor to PRESERVE the curriculum↔orientation
  firewall — but that over-separation WAS the discoverability bug. Owner cut it to one discovery-surface
  sentence. Don't design a fix that preserves an inherited boundary that is causing the problem.
- **F-83 shared-checkout commit-window friction bit ~4× across this multi-agent day** (Clover lifts Root;
  Clover mends Hedgerow ↔ Badger; me ×2). The serialize-the-commit-window protocol worked cleanly every
  time but is pure coordination overhead on a shared checkout — live operating-model evidence (AC6) that
  the worktree-per-agent transition the team session builds is the right cure. Conserved for the
  Director's AC6 capture + the worktree-transition plan.
- **never-trim memory** → memory `feedback_never_trim_memory_consolidate_instead`.
- **Loss-scan (from my own context, standing down):** nothing else material unconserved — the locked
  scope, the plan + readiness review, the precursor, the two memories, the Director brief (comms
  `d4c447b1` + director-handoff CURRENT HANDOFF STATE), and the repo-continuity entry cover the session.

## 2026-06-28 — runbook kind defined; n=2 shared-checkout operational lessons (Clover lifts Root, deep closeout)

Session arc (all committed to `coordination/team-tooling-session-2026-06-28`, n=2 with Beluga rides
Wave): dedicated consolidation (napkin drained, doctrine graduated, **#267 merged to main**);
repo-continuity curated 575→308 (role-drift cure); open-questions driven to zero (Q-009/Q-011
user-granted keep-open) + the drive-to-zero directive homed; **runbook defined as a content kind
(PDR-120)** + host wiring + Runbook Index + discoverability cross-links.

- **A recurring procedure forced into a `current/` plan is a taxonomy-gap tell, not a storage
  problem.** My repo-continuity-curation "plan" was really a runbook (a procedure that RECURS) wearing
  a plan's clothes (a plan COMPLETES). The owner caught it and asked the substrate question; the cure
  (PDR-120) defines "runbook" as a content kind delivered via skills/reference-docs/rule-embedding by
  the skill-load-budget triage — NOT a new surface (a new invocable surface would re-open the retired
  parallel-command decision). The mis-shaped plan was created then dissolved within the session (loop
  closed; the runbook re-homed into `continuity-practice` §Disposition, the rule it enacts). Tell:
  procedure-that-recurs inside artefact-that-completes ⇒ ask lens-4 "would the system changing dissolve
  it?" Sibling: [[feedback_design_from_the_substrate_not_the_instance]], PDR-120.
- **Shared-checkout (co-resident, n=2) format hazard: `pnpm format:root` is whole-tree and would
  clobber a peer's live uncommitted WIP.** Pre-commit prettier-staged flagged 2 of my files; the
  canonical fix `format:root` would have reformatted Beluga's dirty plan files too (forbidden). Cure:
  scope the format to your own files (`pnpm exec prettier --write <my-files>`), confirm the peer's files
  unchanged, re-stage. The repo-scripts-over-npx preference yields to don't-touch-peer-WIP when the repo
  script is whole-tree on a shared checkout. Candidate friction (F-83 family). Sibling:
  [[feedback_no_underscore_rename_unused]]-adjacent discipline, cross-lane-commit-blocking.
- **File-changed-under-me on a shared branch: re-read, don't trust memory.** repo-continuity grew +14
  lines mid-turn via Beluga's commit; a line-number mismatch between two reads at the same offset caught
  it before a large edit. On a co-resident shared checkout the working tree moves under you — re-read
  fresh before a big rewrite. Sibling: [[verify-dont-trust]].
- **n=2 serialized commit window worked cleanly** — ARC + canonical ping-before-window; whoever is
  mid-flight commits first to a gate-green HEAD, pings closed, the peer commits on a clean tree (F-83
  full-tree pre-commit gate is why serialization is needed). Two clean exchanges this session.
- **Critically-assessing the subagent overrode its disposition.** The mixed-concern sweep recommended
  extracting the curation runbook to a new `docs/` file; PDR-120 #3 says embed it in the rule it enacts
  (fragmenting doctrine from enactment is the anti-pattern). A plausible subagent suggestion was wrong;
  the owner's standing "critically assess subagent results" caught it. Sibling: [[verify-dont-trust]].

## 2026-06-28 — MCP orientation-discoverability + planning-vocabulary arc (Clover mends Hedgerow, closeout)

Session arc: read-only review of the under-the-hood work → verified the reframe DONE (W1–W3 merged via #243, true merge not squash, first-hand) → owner reframed the discoverability problem as STRUCTURAL → authored `mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0=architectural review gated on owner go-ahead) → the `generic-foundation-decomposition` programme (index + 8 `programmes:` lineage edges) → ADR-209 + mirroring PDR-121 (planning vocabulary; programme disambiguated from curriculum programme). All authored + on disk; **commit HELD pending Badger seeks Tunnel's window** (n=2, F-83 serialization).

- **Light scan BEFORE deep scan — reframe the questions cheaply before the expensive fan-out.** I launched two deep ultracode workflows before any light scan; the owner stopped both and prescribed light-scan → re-examine-questions → deep-scan. The cheap light read (handlers.ts + mcp-tools.ts + tool-guidance-data.ts) reframed everything — it revealed the two-type registry already exists and that the real defect is three drifting *hand-authored* tool-listing surfaces. Committing a 7-lane deep workflow to still-settling questions is the waste this order prevents. Sibling: [[feedback_ground_state_before_planning]].
- **An index/view POINTS; it does not MODEL. Pre-naming concepts biases a downstream derived graph.** I gave the programme index a "concepts named for extraction" section; the owner corrected — enumerating concepts pre-empts and biases the ADR-200 concept-graph build (which must derive concepts from the plans themselves). A navigation index describes ≤2 areas and points to plans; the concept taxonomy is the graph's to derive, not the index's to assert. Sibling: [[feedback_premature_crystallization]], ADR-200.
- **Malleable-shape stance RECURRED (PDR-098 recurrence evidence).** I framed an existing coupling (the curriculum hint in `universal-tool-shared.ts`) as a possible "make-or-break" blocker; the owner corrected: ask *"what would need to change to make it configurable"*, never *"does the current code permit it."* This is already homed (principles.md §Architectural Excellence / [[feedback_cowpath_anti_pattern]] / [[feedback_design_from_the_substrate_not_the_instance]]) yet recurred despite the home — the passive-guidance-loses-at-the-action-moment signal. Route as recurrence evidence, not a fresh duplicate.
- **Subagent search results need verbatim quote verification; the `speculative/` plan lane is a sweep blind spot.** The Explore agent's plan-search returned 11 real paths but only 7/11 verbatim quotes (1 fabricated, 3 paraphrased), 2 over-inclusions, 1 misclassification, and missed 2 core plans plus the entire `.agent/plans/speculative/` lane (13 docs). Cross-checking each cited quote against the file and sweeping the doctrinal homes recovered them. Sibling: [[feedback_validate_specialist_findings_before_acting]], [[verify-dont-trust]].
- **WS0 method-pointer is ephemeral.** The new plan's WS0 cites a session-scoped workflow-script path (`<session>/workflows/scripts/…`) that will not survive context-end; the method is re-derivable from the plan's lane prose, so this is a convenience-loss only, not substance-loss.
- **REFINE (tooling-friction): the `never-use-git-to-remove-work` hook over-blocks `git restore --staged`.** The hook substring-matches `git restore` and blocks all forms, but `git restore --staged <path>` (alias `-S`) restores only the INDEX from a source (default HEAD) — it unstages, leaving working-tree content and on-disk edits untouched (non-destructive). Only `git restore <path>` and `git restore --worktree` (`-W`) overwrite the working tree (destructive). This session the hook blocked a safe unstage during a shared-index closeout, leaving my files staged with no clean way to unstage. The refinement IS feasible (the flags are parseable): allow `git restore --staged` when `--worktree`/`-W` is absent (index-only); keep blocking `git restore <path>`, `--worktree`, and `--staged --worktree`. Same safe-vs-destructive split applies to `git reset -- <paths>` (unstage, safe) vs `git reset --hard`/`--keep`/`--merge` (destructive). Candidate home: [[hook-policy-substring-discipline]] (parse-don't-substring). Do NOT bypass the hook — refine it.

## 2026-06-28 — completed-plans/good-first-issues retirement; symmetric-HOLD deadlock (Badger seeks Tunnel)

Session arc (n=2 with Clover mends Hedgerow, shared checkout): owner-directed dedicated consolidation — retired the two deprecated files `.agent/plans/completed-plans.md` (harvest-then-retire, no new index, ADR-200-aligned) and `.agent/plans/good-first-issues.md` (dissolved — a cowpath over an empty `good first issue` label with no external contributions; brought nothing into CONTRIBUTING). Reconciled ADR-117 + `templates/README.md` archival doctrine to ADR-200; swept ~21 live references; three reviewers (docs-adr LEGITIMATE, onboarding COHERENT, assumptions SOUND+1) critically assessed; the one finding (a dated experience file asserting the retired index as current) cured with a dated supersession note, not a scrub.

- **EXPLORE (owner-directed): apply CSMA with randomised backoff to agent-coordination defaults — and anywhere peer agents defer to each other.** The symmetric "default to HOLD if no reply" both Badger and Clover posted is a mutual-politeness *deadlock* (no designated mover → tree never clears → neither can ever commit). Liveness needs injected asymmetry. Owner's immediate cure: first-to-commit commits the whole file, other re-edits (cheap-clobber tiebreaker). The deeper design question to explore: where no deterministic tiebreaker (lowest `session_id_prefix`/oldest claim/gatekeeper role) fits, borrow **CSMA/CD randomised exponential backoff** — on collision each agent waits a random interval, re-senses the shared channel (claims/comms/tree state), and retries; symmetry breaks probabilistically. Candidate application points beyond commit windows: claim adoption, who-drains-a-buffer, who-answers-the-owner, who-opens-the-PR, any "after you / no, after you" peer default. Home: [[feedback_symmetric_hold_default_deadlocks]] (per-user memory); this is a Practice design-exploration item, not yet a plan. Sibling: [[feedback_gatekeeper_specialisation]], `fluency-is-a-failure-vector` (I copied the HOLD default without ratifying it).

## 2026-06-28 — Lane A spawn-flow Implementer (1A merged, 1B PR'd, PDR-063 handoff to Avocet) — Beluga turns Shoal (581401)

Built spawn-flow 1A (`agent spawn` create-worktree+branch+identity, merged #269) + 1B (build-at-spawn + S4036 pnpm-absolute-path hardening, PR #272), then PDR-063-handed Lane A to Avocet tracks Crag (1C→Phase 2 remaining). Lane state lives in the handoff record `.agent/state/collaboration/handoffs/a63ac21a-lane-a-beluga-to-avocet-2026-06-28.md`. Session-general frictions/lessons (not lane-specific, so napkin-homed here):

- **Harness git friction (recurring, hit by ≥3 agents this session — me, Avocet, Pangolin): worktree rebase/update is permission-fenced.** `cd <wt> && git rebase` (compound) and `git rebase --continue` are **denied**; the working form is **standalone `git -C <wt> -c core.editor=true rebase origin/main`** (and `… rebase --continue`) — `-c core.editor=true` skips the editor, `git -C` avoids the compound. `git push --force`/`--force-with-lease` is **hook-blocked**, so to bring an *already-pushed* branch up-to-date you **merge `origin/main` into it** (Pangolin's cure) rather than rebase+force-push; a never-pushed branch rebases freely then pushes clean (my 1B path). Candidate home: [[hook-policy-substring-discipline]] / frictions-register. Sibling: [[feedback_no_sed_bypass_for_edit_failures]] (don't bypass — use the safe form).
- **comms watcher dies two ways; re-arm on the failure notification.** (a) GNU `timeout` 3600s self-exit (F-101, expected — live agent re-arms, the `--seen-file` cursor loses no events); (b) the **drain-step 60s deadline under high comms volume** (a busy multi-agent window). Cure for (b): re-arm with **`--step-timeout-ms 120000`** to absorb volume. Both hit me this session. Refines [[feedback_comms_watch_cli_can_stall_silently]].
- **Two debugging traps that produced a false-green / false-fail.** (1) **Stale dist**: after editing `agent-tools/src`, the built-CLI e2e ran the OLD `dist` and silently skipped the new behaviour (missing build marker) — **rebuild dist before any built-CLI e2e**. (2) **`cmd | tail; echo exit=$?` captures `tail`'s exit, not `cmd`'s** — it masked a real non-zero. Run the command bare (or `${PIPESTATUS[0]}`) when you need the real exit. Sibling: [[verify-dont-trust]], [[feedback_run_the_thing_dont_flag_the_gap]].
- **Result-seam so test fakes don't throw (distilled candidate).** To test an error path that wraps a *throwing* dependency (execFileSync, resolveCoordinationHome) WITHOUT a throwing test-fake (which trips the `no-throw-statement` warn rule), **lift the seam to return `Result`** and translate the throw to `err` at the single real boundary; the fake then returns `err(...)`, never throws. This keeps new code off the no-throw backlog AND keeps tests warning-clean. Composes with: split functions that grow past 50 lines / 20 statements when Result-wrapping inflates them (extract a `validate*`/`execute*` helper). Sibling: [[feedback_test_the_flag_engine_not_the_configuration]]-adjacent, ADR-088.
- **Stacked-working-branch / flat-PR pattern for dependent slices (Director-codified, worked cleanly).** When slice N+1 depends on unmerged slice N: build N+1 on a working branch *stacked* on N's branch (keeps momentum, don't idle the critical path during review), but **do NOT open N+1's PR until N merges** — then rebase N+1 onto fresh `origin/main` (N drops out) and open it **flat** as a single-deliverable diff. Momentum of stacking + clean diff of waiting. A temporarily-stacked working branch is not a stacked PR.
- **PDR-063 mid-cycle handoff worked end-to-end (worked instance).** record (4 sections) → `claims set-handoff --path` → directed `comms direct --kind mid-cycle-handoff` to the successor's full identity tuple → retirement/heartbeat-end broadcast → stop heartbeat THEN watcher. The successor adopts via `claims adopt` off the handoff event. Clean rotation; no work lost.
- **Loss-scan (from my own context, standing down):** nothing else material unconserved. Lane-A technical state + decisions + the T1 (orphan-on-build-failure → atomic-rollback needs a `never-use-git-to-remove-work` tool-exemption, owner/Director call) and T2 (relative-PNPM_HOME → emit absolute-only candidates) Cursor findings are in the handoff record + the open #272 threads; reviewer findings are folded into the merged/PR'd code; the frictions above cover the session-general residue. Repo-continuity / thread-record / F-87+F-90 register lands are the Director's (closeout-owner); I did not touch them.

## 2026-06-28 — F-101 watcher-orphan cure (Pangolin weaves Nightfall, Lane B; team-tooling session; PDR-063 handoff to Ingot)

Session arc (Director Firefly binds Slag + Implementers; rotating cast): Lane B = O1 liveness + O2 ergonomics. Delivered F-82 verify (opening gate, GREEN) and F-101 (watcher orphan cure) → PR #270 genuinely-ready (CI green, threads resolved); PDR-063 handoff to Ingot tracks Brilliance for F-75 + the O2 tail. Code/proof live in PR #270 + the two watcher rule files; handoff record `0ba02fee-pangolin-lane-b-to-ingot-2026-06-28.md`. Below = the knowledge NOT in those homes.

- **F-101 empirical teardown taxonomy (falsified the assumed cure).** Controlled process experiments (throwaway watchers): the existing `timeout`-wrapped watcher invocation ALREADY kill-trees cleanly on CLEAN teardown — Monitor `TaskStop`, SIGTERM-to-`timeout`, and `timeout` expiry all group-kill (GNU `timeout` runs the command in its own process group and signals the whole group). It ONLY orphans on HARSH teardown (SIGKILL-to-`timeout`, or the agent crashing without signalling) because the watcher's separate process group is never signalled. So a pure process-group kill-tree does NOT "fully deliver" the cure (the Director's stated (i) — I falsified it with measurement; the Director accepted). Cure = `--supervisor-pid "$PPID"` supervisor-death detection: the watcher probes the supervising pid each poll cycle and self-exits when it's gone. This SUPERSEDES the deferred Stay-alive-Stop-hook lease for the orphan problem — no host hook needed. Sibling: [[verify-dont-trust]], [[feedback_run_the_thing_dont_flag_the_gap]].
- **Live dogfood: my OWN pre-cure watchers orphaned exactly as F-101 describes.** At retirement, a `ps`/`pgrep` sweep found an orphaned watcher tree (timeout→pnpm→…→node, ppid=harness) from an earlier Monitor task whose supervisor had gone — the cure isn't deployed to running watchers until #270 merges. Hand-swept it. Real-world confirmation the problem + cure matter. Also confirmed killing the `timeout` leader with SIGKILL orphans its node descendants (no signal forwarding) — kill the GROUP (`kill -- -<pgid>`) or the node directly, not the leader pid.
- **FRICTION (candidate for the register — Director-owned this session): watcher default 60s drain step-timeout too tight under multi-agent host load.** My comms watcher fail-loud-exited twice on `kind=timeout` (drain step >60s) when the host was loaded (concurrent builds/tests across agents) — correct fail-loud behaviour, but a false-positive death. Cure: re-arm with `--step-timeout-ms 180000`. Candidate: raise the default, or make it load-adaptive. (The 3600s lifetime `timeout` also fired once — expected; re-armed clean.)
- **FRICTION + lesson: heartbeat LABEL staleness caused a false "watcher-down" rescue alarm.** The heartbeat loop's title/cycle-label are frozen at loop-start; after the Director re-routed me I stayed heads-down on the fix and did NOT relabel, so my last heartbeat still read "awaiting routing" while I was actively working — the Director read it as a likely-dead watcher and nearly triggered a Lane-B rescue (Ingot stood ready). Loop-hygiene "relabel at every lane transition" is real and load-bearing, but easy to drop under deep focus. DEEPER CURE CANDIDATE: derive the heartbeat's lane/cycle label from the live claim's current state (which the agent updates as it works) rather than a frozen loop arg, so it cannot go stale while the agent is active. Sibling: [[feedback_agent_state_observable]]-adjacent; liveness-heartbeat-cron loop-hygiene.
- **FRICTION (F-102 family): `--force-with-lease` is hook-blocked (substring `git push --force`), so a feature branch can't be rebased-then-force-pushed to update.** Cure used (Director-confirmed): MERGE `origin/main` into the branch instead of rebase — clean when the change is disjoint from what main advanced, keeps the PR diff clean (merge-base = main), and the repo merges PRs via merge/squash anyway. No force-push, no owner-auth needed. Over-broad substring block is the [[hook-policy-substring-discipline]] (parse-don't-substring) family.
- **The gate and the observation are reviewers too — they caught what 4 sub-agent reviewers missed.** code/type/test/docs-adr all approved, but the pre-commit gate then caught a knip unused-export AND a depcruise import cycle (cli-runtime ↔ watcher-supervisor), and the end-to-end observation caught a composition-root wiring gap (the bin dropped the `processIsAlive` seam → the real CLI threw) that every unit test passed over (the fake runtime always provided the seam). Lesson: don't declare review-done before running the full gate AND observing the real built thing — especially for composition roots. Cure for the cycle: interface-segregation (depend on a narrow `SupervisorLivenessRuntime` slice, not the whole `CliRuntime`). Sibling: [[verify-dont-trust]], [[feedback_run_the_thing_dont_flag_the_gap]], [[feedback_aggregate_gate_blind_to_unrun_suites]].
- **Minor: `check-commit-message` takes `-F <file>` not `--file` (mirrors git); a `comms direct`/`append` body with backticks or `$` needs `--body-file` (shell-quoting).** Both cost a retry. (Latter is documented in the live help now.)

## 2026-06-28 — Director lens, team-tooling session (Firefly binds Slag, 887889; first Director → handed to Merlin)

Drove the team-tooling session open → first cycle (#269 merged) → both implementer PDR-063 rotations (Beluga→Avocet Lane A, Pangolin→Ingot Lane B). Operational state is in `director-handoff.md` CURRENT HANDOFF STATE. Below = DIRECTOR-perspective lessons not in the implementer entries above (which corroborate the shared frictions — watcher deaths, force-with-lease, gate-catches-what-reviewers-miss).

- **Frozen heartbeat-label → Director false-uncertainty (RECURRED twice: Pangolin, Avocet); cure = work-evidence-cross-check BEFORE pinging.** From the Director side a frozen label ("awaiting routing" / "ready" persisting after I'd routed) is indistinguishable from stalled / comms-blind / moved-on. Both times: cheap work-evidence check first (`git fetch` + latest PR commit + `reviewThreads` state) → revealed the agent alive+working (Pangolin) / watcher genuinely down but agent alive (Avocet) → THEN a bounded direct-ping with an explicit default. Never fired a premature rescue. 2× recurrence = evidence the deeper cure is warranted: **derive the heartbeat label from the live claim's current cycle, not a frozen loop arg** (Pangolin's candidate). Director discipline: a stale label is INPUT-TO-VERIFY, never a stall verdict. Sibling: [[verify-dont-trust]], ping-before-escalate.
- **PR merge-readiness: GraphQL `reviewThreads{isResolved}` is the authoritative surface — NOT `gh pr checks`, NOT REST `/pulls/N/comments`, NOT the peer's "resolved" report.** Twice a peer declared #272 "threads resolved / ready" while GraphQL showed unresolved — a Cursor Bugbot finding posted 30–60s BETWEEN the fix and the declaration. REST `/comments` also missed inline Copilot threads `reviewThreads` surfaced. First-hand verify caught a real honesty bug ("resume reports wrong base ref") heading to `main`. **Director rule: adjudicate via `reviewThreads`; re-verify 0-unresolved AT ready-declaration (bots are async); peer "ready" is input-to-verify.** The #220/#222 inline-comment blind-spot the director-handoff warns of. Sibling: [[feedback_peer_status_claims_are_input_to_verify]].
- **PATTERN candidate — no-removal redesign before a safety-rule exemption (lens-4).** When a fix would touch a hard safety rule (`never-use-git-to-remove-work`, for rollback of an orphaned spawn worktree), don't self-ratify or reflexively escalate an exemption — first ask "what design dissolves the need to touch the rule?" T1 → **idempotent-retry** (probe `git worktree list` → resume/collide/create; nothing removed) dissolved the exemption entirely; no owner escalation. Escalate ONLY if no-removal genuinely isn't clean. Home candidate: a `patterns/` entry or PDR clause. Sibling: [[feedback_ask_would_this_be_simpler_if_the_system_changed]], rules-have-no-exceptions / PDR-074.
- **AC6 / PDR-117 second-instance: ZERO owner-visible coordination prompts across a full multi-rotation session.** Every decision resolved at Director/implementer level via the Decision Lenses. The owner's only throughput dependency is the **automerge-enable** (human code-owner gate — `#269` enabled by the owner's account; agents must not enable via shared creds) + the org-admin claude-review-limit. Hands-off owner → genuinely-ready PRs queue behind that gate by design (not a defect). Fold into the worktree-per-agent transition home at arc-end.
- **Director is input-to-verify too.** My fail-fast lean on T1 was correctly REJECTED by Avocet with git-grounding (no stored original base; base refs move → fail-fast false-errors legit retries; code-expert confirmed) — honest `resumed` flag instead. The standing "critically assess subagent results" applies to the Director's suggestions as much as reviewers'. Sibling: [[feedback_validate_specialist_findings_before_acting]].
- **Loss-scan (from my own context, standing down):** operational state conserved in `director-handoff.md` CURRENT HANDOFF STATE (first-hand-verified this handoff); graduate-able lessons are the bullets above. Register lands (F-87 merged + the NARROW F-101 supersession reconciliation) were deferred to a quiet moment and remain OWED — Merlin inherits (flagged in handoff state). Nothing else material unconserved.

### Deep recursive loss-scan addendum (Firefly binds Slag, at handoff to Merlin) — items NOT in the handoff state or the entry above

- **DIRECTOR-HANDOFF SEQUENCE (owner correction, this rotation — graduate to the Director brief's Standing Lessons).** The sequence is **prepare-handover-materials → hand over → run session closeout**, NEVER finish-all-possible-work-then-hand-over. Optimise for **CONTINUATION, not neatness in any one session.** I had it backwards — I was merging #270, about to merge #272, push, and land the register BEFORE handing over (tidying my session). The owner stopped it: those loose ends are the successor's *documented continuation*, not mine to finish. Behaviour change: at the FIRST sign of handoff, prepare the handoff materials (refresh + commit the handoff state), pre-position (Moment-1), and only after authority transfers do the closeout — leave in-flight work in-flight, handed over, not force-completed. Sibling: PDR-063/PDR-064, [[feedback_dissolve_role_when_pressure_clears]]-adjacent.
- **Director-merge-permission vs the code-owner gate (open-question candidate, Q-).** The owner granted the **Director merge permission for THIS session** (merge when CI-green + comments-resolved), and `gh pr merge --squash` worked first-hand (#270 landed). This is in tension with the standing `main merge gate = code-owner review; clean agent merge prohibited` (per-user memory `project_main_merge_gate_codeowner`). OPEN: does Director-merge-permission generalise to team sessions as a model (Director is the trusted merge-gate, replacing per-PR code-owner review), or is it a per-session owner grant? Resolving it shapes the worktree-per-agent transition's merge story. Capture as an open question; do not assume it generalises.
- **My base-branch defect (Director-learning).** My Moment-2 lane brief told implementers to cut feature branches off `coordination/team-tooling-session-2026-06-28`; correct is **off `origin/main`** (pure-diff PRs to main; the coordination branch carries only Director state). Caught + corrected within minutes (both implementers recut), but it cost a rebase each. Lesson: state the branch-class precisely in the opener/Moment-2 (off origin/main, flat, pure-diff) — the opener I wrote already said origin/main; my broadcast contradicted it. Verify the broadcast against the opener before sending.
- **Shared-checkout contention for the coordination home (friction candidate).** Continuity-file writes (napkin, director-handoff) raced ("modified since read" repeatedly; one `.git/index.lock` collision on commit) because **standby successors registered as operating IN the primary checkout** (the coordination home). The worktree-per-agent model cures lane-source contention but the coordination home is still one shared checkout. Candidate: standby successors must NOT run git / hold the index in the coordination home; they create their own worktree only on adoption, and read (never git-write) the coordination home until then. Append-only buffers tolerate concurrent appends via shell (`cat >>`), but `Edit` (read-state match) and `git commit` (index lock) do not. Sibling: [[feedback_claims_never_block_memory_state_writes]] (writable-always) vs the index-lock reality.
- **AC6 headline (sharpen for the worktree-per-agent transition evidence home).** The strongest PDR-117 second-instance finding is not just "0 owner-visible coordination prompts" — it is that **a hands-off owner + Director-merge-permission together produced an autonomous, self-continuing team**: the owner intervened only with standing directives/corrections (critical-review reminder, the sequence correction, the merge grant), never with coordination. The cast rotated at velocity — Lane A Beluga→Avocet→Dormouse and Lane B Pangolin→Ingot(→Pegasus standby) in ~one session — via clean PDR-063 handoffs, each with a frozen handoff record, no work lost. 2 cycles landed (#269, #270) + 2 more genuinely-ready (#271, #272) at handoff. This is the continuation-over-neatness model working.

## 2026-06-28 — Lane A spawn-flow + O5 (Avocet tracks Crag, team-member preservation pass)

Retired team-member (PDR-063, Lane A → Dormouse). Owner-directed deep close-out; not the
closeout owner, so capturing to the napkin (append-safe) and flagging curation items for the
Director (Firefly) per the Pangolin precedent. These are loss-scanned from my own context —
items NOT already in the handoff record (`a63ac21a-lane-a-avocet-to-successor-2026-06-28.md`) or
my closeout broadcast (`0b76bd9d`).

- **STRUCTURAL-CAP THRASH → EXTRACT-DON'T-TRIM (candidate: friction-register + behaviour-note;
  2 instances same session = strong graduation signal).** Adding a small thing to a file at its
  structural cap (max-lines 250 / complexity 8 / max-lines-per-function 50) triggers a
  failed-gate thrash if you respond with incremental trimming. On `create.ts` I burned THREE
  pre-commit cycles: inline fix → complexity 9; 1-line comment → file 251; strip-in-place →
  prettier reflowed the chain to 4 lines → file 253. The right move was apparent only after
  code-expert + architecture-expert-fred both flagged it: **extract the cohesive concern to a
  sibling module** (`detectExistingWorktree` + the seam type → `existing-worktree.ts`, acyclic;
  `create.ts` 253→197). **Ingot hit the IDENTICAL thing the same session on `cli-specs.ts`**
  (extracted a factory to `cli-spec-factory.ts`). Behaviour change: when a file is AT a
  structural cap, the first response to "add a small thing" is extraction, never trimming —
  trimming against a hard cap is the anti-pattern. Sub-lesson: **prettier reflow defeats
  net-zero line-count assumptions** — a "same-line" edit on a long line silently becomes
  multi-line; never assume a line-count delta on a chain/long line without re-running prettier.
  Sibling: [[feedback_cowpath_anti_pattern]] (the thrash IS designing around the cap instead of
  re-homing).

- **INPUT-TO-VERIFY APPLIES UPWARD, not only to subagents (candidate: distilled).** The Director
  leaned fail-fast for the base-ref fix (error if requested `--base` differs from the worktree's
  actual base). I assessed first-hand and REFUTED it with git-grounding: git stores no record of
  a branch's original fork point, and base refs move (main advances), so any base comparison
  false-errors a legitimate retry after main moves. The Director affirmed I was right. The owner
  directive (via Merlin) says reviewer/subagent output is input-to-verify — this session shows it
  applies to a DIRECTOR's lean too. A recommendation from authority is still input-to-verify when
  the code reality contradicts it. Sibling: [[feedback_reason_from_impact_not_authority]],
  [[feedback_validate_specialist_findings_before_acting]].

- **NO-REMOVAL-CURE DISSOLVES THE NEED FOR A SAFETY-RULE EXEMPTION (candidate: pattern /
  distilled — reusable LTAE move).** T1 (orphan-worktree-on-build-failure) seemed to need a
  narrow exemption from `never-use-git-to-remove-work` (atomic rollback = remove the just-created
  worktree). The Director declined to self-ratify and reframed (lens-4 / replace-don't-bridge):
  **dissolve the need for removal** — idempotent retry (detect the existing worktree, resume the
  build) needs no `git worktree remove` at all, AND is better UX (retry "just works"). The move:
  *when a fix appears to need a safety-rule exemption, first seek a redesign that dissolves the
  need for the dangerous operation.* It is the constructive inverse of the cowpath — not
  designing around the constraint, but redesigning so the constraint never binds. Sibling:
  [[feedback_inherited_separation_can_be_the_bug]], [[feedback_long_term_architectural_excellence_is_always_the_answer]].

- **RE-VERIFY 0 THREADS *AT* DECLARATION — a bot posts between your fix and your "ready"
  (candidate: sharpen [[feedback_pr_readiness_requires_comment_triage]] / the PR-readiness
  rule).** I declared #272 genuinely-ready with a Cursor Bugbot thread that had landed ~30s
  earlier (the base-ref finding); a second (collision-prefix) landed later. The Director caught
  both. "0 unresolved threads" is not a property you check once after pushing — it must be
  re-verified AT THE MOMENT of the ready-declaration, because bot review is asynchronous and can
  post between your last fix and your claim. Same discipline extends to the PDR-063
  handoff-readiness judgment: a "done" PR can be made not-done by async review, so re-verify at
  the handoff boundary, not from an earlier check. (I fixed my own just-introduced base-ref bug
  rather than handing it off — handing off a bug in my own cure would have been the failure.)

- **COORDINATION-HOME CONTENTION is specifically git-index + Edit-read-match, NOT CLI-append
  (corroborates Firefly's candidate).** I worked in worktree `oak-spawn-flow` (lane source) but
  did ALL comms/claims/heartbeat writes against the primary-checkout coordination home, and hit
  no lock collision myself — because the collaboration-state CLI appends atomically and my git
  ops were in the worktree, not the home. The contention Firefly saw is on `git commit` (index
  lock) and `Edit` (read-state match) in the SHARED home. Data point for the candidate cure:
  append-via-CLI / append-via-shell to the home is safe under concurrency; index-holding git ops
  and Edit-match writes to the home are not. Sibling: [[feedback_claims_never_block_memory_state_writes]].

- **F-101 watcher 3600s self-terminate fired once mid-work; re-armed clean (known —
  corroborates [[feedback_comms_watch_cli_can_stall_silently]]).** Dogfooded the exact orphan
  guard Lane B is hardening; seen-file cursor meant no missed events, only delay.

- **Loss-scan (from my own context, standing down):** O5 #271 + Lane A #272 state conserved in
  the handoff record (first-hand-verified at write: HEAD 776bd5788, 0 threads, CI green) +
  closeout broadcast; #271 + #272 both still BEHIND-able if main moves before merge → merge-in
  not rebase (in the record). The seam type `SpawnGitRunner` now lives in `existing-worktree.ts`
  (create.ts re-exports) — the 1C gh-seam-as-3rd-consumer hoist-to-core decision should account
  for that (noted in the record). Nothing else material unconserved.

- **THREAD-IDENTITY (for the Director's team closeout — I did not edit the curated surfaces):**
  Avocet tracks Crag / claude / Opus 4.8 / 30fe5b touched threads `agent-operability` (Lane A
  spawn-flow) and `orientation-skills-family` (O5 discovery pointer) on 2026-06-28 — needs
  `last_session` rows + the repo-continuity identity summary updated by the closeout owner.

### Deep loss-scan pass 2 (Firefly binds Slag, final closeout) — genuinely-new items from a second recursive sweep

- **Director context-economy is itself a Director skill (graduate to the Director brief).** Over my tenure I replied to nearly every routine implementer heartbeat with a one-line acknowledgement. Each was cheap, but in aggregate they spent the long-lived Director's scarcest resource — context — on signals that required no action. A long-lived Director should **stay silent on routine heartbeats and the monitors that carry them, and act only on substantive events** (questions, PR-opens, verdicts, blockers, genuine stalls). Over-narration shortens the very tenure the Director role exists to maximise. This compounds with the monitor-husbandry cost (hourly watcher re-arms) — both are continuous context drains a minimum-action Director must budget. Sibling: PDR-117 minimum-action; [[feedback_comms_ceremony_minimal]].
- **The handoff-sequence principle is universal across rotating roles, not Director-specific.** The owner's correction (prepare-materials → hand over → close out; continuation over session-neatness) is the SAME shape the implementers already embodied via PDR-063 (freeze the handoff record FIRST, then retire — never finish-the-lane-then-handoff). I violated it AS Director (was finishing merges/pushes before handing over) precisely because the Director-handoff doctrine framed "stop heartbeat / refresh state" as closeout steps without foregrounding "materials BEFORE handover, loose-ends handed-over-in-flight." Refinement for the Director brief Standing Lessons: state the sequence explicitly as `prepare handover materials → hand over (Moment-1 → successor Moment-2) → THEN closeout`, and name the anti-pattern (finish-all-then-handover) — it is one principle with PDR-063, optimising the team's continuation over any one session's tidiness.
- **GRADUATION DISPOSITION (consolidation is DUE, captured-not-graduated — the correct rotation-closeout boundary).** Per session-handoff step 9–10, deep consolidation is DUE but NOT well-bounded for this closeout (the team is active under Merlin; the durable homes — director-handoff Standing Lessons, `patterns/`, `open-questions.md` — are Merlin's live surfaces; my context is ending). So these are CAPTURED here at full weight and flagged for the dedicated pass, not graduated mid-rotation: (1) the handoff-sequence correction → Director brief Standing Lessons; (2) no-removal-redesign-before-safety-exemption → a `patterns/` entry; (3) Director-merge-permission generalisation → `open-questions.md` Q-NNN; (4) heartbeat-label-from-live-claim-cycle → frictions-register / liveness-heartbeat-cron; (5) Director context-economy → Director brief. Merlin / the dedicated consolidation graduates them; the napkin (this session's entries) is the source.
- **Thread-record identity fold deferred to arc-end (asked, decided — not skipped).** I held a claim on `agentic-engineering-enhancements` but worked via the `director-handoff.md` surface + comms, not the thread next-session record. My participation + full tenure are durably recorded in `director-handoff.md` CURRENT HANDOFF STATE (names me first Director), the closed-claims archive (claim 3326541a closure), and the comms trail. The thread-record identity-row + repo-continuity identity-summary fold is arc-end closeout-owner work (Merlin, when the team-tooling session concludes), not a mid-session rotation edit — and editing those live surfaces now would race the active team. Recorded so it is a decision, not an omission.
- **Loss-scan verdict: complete.** After two recursive passes, nothing material that only I hold remains unconserved. Operational state → `director-handoff.md` (committed + pushed e678cff63/cec022942); session learnings → napkin (Director-lens + this pass-2 + the implementers' folded lane entries); decisions/rationale → the comms trail (durable). My context can end.

### 2026-06-28 — F-75 peer heartbeat-silence (Ingot tracks Brilliance, Lane B, fe57ce)

- **Fixtures drift to the implementer's happy path; real content reveals the domain.** My F-75 unit
  fixtures carried `id` (the type "looked like it wanted one"), so they were all green. The
  integration test with id-OPTIONAL fixtures caught `routingKeyFor` THROWING on id-less identities —
  which the real comms backlog carries by design (pre-PDR-076a rows). The real-content run
  (`comms peer-liveness` on the live stream) then confirmed the cure: Pangolin read `retired`, the
  live cast `active`. The lesson isn't "write integration tests" — it's that fixtures unconsciously
  encode the author's model; only real/realistic content exercises the actual domain. Earned, not
  held. Sibling: [[feedback_verify_on_real_content_not_fixtures]].
- **A reviewer finding has two layers: the problem (trust) and the fix (verify-against-doctrine).**
  code-expert flagged a real bug (a malformed `created_at` → `NaN` falls through both `<` comparisons
  in `classifyState` → silent `retired` false-positive) and proposed a `throw`. I adopted the
  PROBLEM and REFUTED the FIX with grounding: a `throw` violates no-throw/ADR-088 AND would let one
  corrupt event crash classification of the whole cast. Cure = SKIP the malformed event (consistent
  with the id-less skip; a peer with only-corrupt heartbeats is absent, never falsely `retired`).
  The owner's mid-session directive (verify subagent results first-hand) is exactly this: separate a
  reviewer's correct diagnosis from a doctrine-contradicting prescription. Sibling:
  [[feedback_validate_specialist_findings_before_acting]].
- **Missing/NaN value flowing into a threshold comparison silently selects the worst bucket — a
  general liveness-classifier hazard.** `NaN < x` is false, so an unguarded classifier defaults a
  bad input to the last branch (here `retired`). Any `classify-by-threshold` over external data must
  gate the parse before the comparison. Candidate behaviour-note.
- **Standby presence is the watcher + heartbeat + registry, not chatter.** As Pangolin's standby
  successor I over-emitted courtesy acks. The substantive broadcasts (correcting Avocet's "Lane B is
  parallelisable" framing for the Director's routing; the rescue-readiness signal) changed peers'
  next actions; the acks did not. Broadcast bar in standby = "does this change a peer's next action?"
  The implementer-role twin of Firefly's Director context-economy lesson above. Sibling:
  [[feedback_comms_ceremony_minimal]].
- **The session is self-similar (meta-observation).** The team builds tools to make multi-agent
  liveness trustworthy (F-75 detect a silent peer; F-101 kill orphan watchers; spawn-flow nucleate
  seats) WHILE being a multi-agent team running on those tools and hitting their gaps in real time
  (watcher drain-deaths, heartbeat-label staleness, rebase/force-push gates, cli-specs at budget).
  F-75 mechanises the exact manual check Firefly did by hand on the Pangolin false-alarm DURING
  F-75's own construction. The tool and its user are one system observing itself — strongest
  evidence the work is aimed right, and every friction hit IS the next backlog item (FRAME-1).
- **Friction corroborations (not new, data points):** `cli-specs.ts` was at its max-lines:250 budget
  → extracted the `commandSpec` factory to `cli-spec-factory.ts` rather than weaken the cap (same
  shape as Avocet's `existing-worktree.ts` extraction). `git rebase --onto` was permission-DENIED →
  flat-PR path is merge-in, not rebase (corroborates the force-with-lease / rebase-gate friction).
  Watcher 60s drain-death under my concurrent-gate host-load → re-armed with `--step-timeout-ms
  180000` (corroborates [[feedback_comms_watch_cli_can_stall_silently]] + Pangolin's candidate).
- **FOR THE DIRECTOR (Merlin seeks Rainbow) — curated-surface folds I did NOT make (non-closeout-owner):**
  (1) my thread `agentic-engineering-enhancements` identity row needs `last_session: 2026-06-28` for
  `claude / claude-opus-4-8 / Ingot tracks Brilliance / implementer`, plus the repo-continuity
  identity summary. (2) F-75 register status is owed on its merge: F-75 ADDRESSED by `comms
  peer-liveness` + `peerHeartbeatLiveness` classifier (commit c2934cce4, branch pushed
  origin/feat/lane-b-f75-peer-heartbeat-silence; PR pending the merge-in flatten by Pegasus).
  (3) Lane B continues under Pegasus guards Dawn (claim 0ba02fee retained + handoff record).
- **Loss-scan verdict (Ingot, standing down): complete.** F-75 grounded knowledge → the Pegasus
  handoff record (first-hand-verified at write: commit c2934cce4, pushed, gates green, real-content
  proof). Session learnings → this entry. The one unverified handoff claim (merge-in → flat diff) is
  honestly hedged as "expected" in the record. Nothing material that only I hold remains unconserved.
- **Post-retirement recursive loss-sweep (Ingot, owner-requested re-check) — verified, no loss; one
  state-change caught.** Re-swept my context against current state and verified first-hand (read-only):
  (1) **F-75 is now LIVE** — `peer-liveness.ts` is PRESENT in `origin/main`; commit `c2934cce4` is NOT
  an ancestor → it merged under a squashed SHA. This SUPERSEDES the "PR pending Pegasus's merge-in
  flatten" note above: the flat-PR path worked and F-75 is merged. The merge-in-flattens hypothesis
  (hedged "expected") is CONFIRMED. (2) **Handoff to Pegasus is complete + confirmed** — Pegasus guards
  Dawn owns claim `0ba02fee` (adopted), and `origin/feat/lane-b-f85-active-default` exists → Pegasus has
  progressed to F-85 (the next O2 item). Empirical proof the handoff record was sufficient. (3) No
  Ingot-held knowledge remains unconserved. Residual (Director's, flagged): my consolidate artefacts
  (this napkin entry, the experience file, the handoff record) are on-disk-but-uncommitted in the
  primary checkout — conserved pending Merlin's team-closeout continuity commit; I did not commit them
  myself (collision risk on the live coordination branch; not the non-closeout-owner's role). Verdict:
  loss-sweep complete, nothing lost.

## 2026-06-28 — Lane A successor: #272 fix → 1C draft-PR-at-spawn (Dormouse stirs Frost, 17b589; PDR-063 handoff to Quasar)

Adopted Lane A (O3 spawn-flow) from Avocet at #272 CI-green; fixed #272's re-appeared Cursor Medium
(primary-checkout-mistaken-for-resume → a `deriveSpawnTarget` fail-fast guard; MERGED in the #272 squash
`4b84ea702`); built 1C (draft-PR-at-spawn) full cycle, committed+pushed `9baf83f4a` on
`origin/feat/spawn-draft-pr` (NO PR yet), PDR-063-handed to Quasar mends Penumbra. Lane state + decisions
in the handoff record `a63ac21a-lane-a-dormouse-to-quasar-2026-06-28.md`. Session-general residue (flag
for the Director's central land / dedicated pass):

- **FRICTION (candidate): `git checkout -b <new> <start>` is hook-blocked even on a CLEAN tree**
  (substring `git checkout`); the safe non-destructive primitive is **`git switch -c <new> <start>`**
  (git split branch-switching from file-restoring precisely so the former is not conflated with
  destruction). Verify the tree is clean first. hook-policy-substring-discipline (parse-don't-substring)
  family — same shape as the `git restore --staged` / `git reset -- <paths>` over-blocks noted earlier
  this session.
- **WORKED INSTANCE — validate-full-target-estate:** I converted `resolveTrustedGit` (a shared `core/`
  util) to Result for consistency with the new `resolveTrustedGh`, and type-check immediately caught
  **6 callers** expecting a throwing string (collaboration-state/coordination-home [Lane B], statusline,
  two validators, branch-touched-files). Reverted: a shared-signature change needs a full caller sweep
  FIRST; the gate caught the omission. The throwing resolver migrates with the no-throw backlog across
  all callers, not piecemeal.
- **heartbeat-LABEL-staleness false-stall bit me — 3rd instance** (Pangolin, Avocet, now Dormouse): I
  went heads-down BUILDING 1C right after the Director's ratification without relabelling, so my
  heartbeat asserted "awaiting/prepping" and the Director nearly fired a rescue. Cure used:
  relabel-at-transition. Deeper cure (derive the label from the live claim's current cycle, not a frozen
  loop arg) — Merlin is folding it at arc-end; three worked instances is a strong graduation signal.
- **consolidate-at-third-consumer hoist worked cleanly** (CommandRunner<T> + PathExists → `core/`;
  git/pnpm/gh seams thin aliases). In-code notes left for the NEXT consolidations: pr-watch's
  `resolveGhPath` is a 2nd gh-resolver (consolidate at a 3rd); `PathExistsCheck` is a 4th
  `(candidate)=>boolean` (cross-lane, deferred).
- **Reviewers + the gate caught real things; critically assessed first-hand throughout** (owner
  directive, reinforced mid-session): on #272 I verified the code-expert coupling argument myself; on 1C
  I verified architecture-expert's build-failed-then-resume no-PR gap by tracing the flow (real →
  documented as a 1C limitation in `cli.ts`), and confirmed code-expert's hypothesised `baseBranchOf`
  bug does NOT exist (no `/g`) while its inverse fragility (unenforced remote-qualified base) does.
- **Loss-scan (from my own context, retiring):** nothing else material unconserved — #272 fix is in
  main, 1C is pushed + gate-green + reviewer-approved, the handoff record carries lane state + decisions
  - both 1C limitations, and the above covers the session-general residue. repo-continuity /
  thread-record / register lands are the Director's (closeout-owner); I did not touch them.

### 2026-06-28 — Lane B (Pegasus guards Dawn, 41fd72): F-75 + F-85, then mid-session closeout

- **Watcher drain-death at `--step-timeout-ms 180000` is INSUFFICIENT under heavy multi-agent load** —
  my watcher STILL hit the 180000ms drain deadline and exited once this session (re-armed clean). A
  falsifying datapoint against 180000 as the interim cure; real cure = F-101 supervisor/lease +
  adaptive/raised deadline. (Flagged to Director for the register.)
- **New CLI frictions (sibling of the F-72..F-80 ergonomics batch):** `comms append --body-file <(...)`
  (process substitution) fails — the pnpm wrapper can't read `/dev/fd`; pass a real file path.
  `check-commit-message` needs `-m "<msg>"` (bare positional exits 2 "invalid usage").
- **Bash-tool cwd persistence (AX note):** a `cd <subdir> && …` compound command can strand the shell
  in that subdir for later calls (relative paths then silently resolve wrong). `cd` to repo-root/worktree
  at the start of each command, or use absolute paths.
- **F-72 folded into F-85** — one `withResolvedActive` wrapper over `claims active-agents` (+ repo-root in
  its option-set) covered F-72's `--active` default; verify-the-fold first-hand before assuming a separate
  item. Spec-wiring has NO asserting test (a future edit dropping a wrapper regresses silently; not cleanly
  unit-testable) — carried-forward in the handoff record, not a blocker.
- **deep-session-doesn't-reset-budget, applied at RE-ENGAGEMENT:** re-invoked on this (deep) session as a
  "successor", I surfaced the spent-session vs fresh-seat fork BEFORE engaging rather than barrelling into
  the O2 tail; owner then chose a mid-session closeout. The lesson fires at re-engagement, not only retirement.
- **verify-don't-trust on a stale opener:** the "Ingot is preparing to handover to you" opener was
  contradicted by ground truth (Ingot had already handed over + retired earlier in-session; F-75/F-85
  merged). Recomputed live state instead of fabricating a fresh handover — the continuation pointer is a
  hypothesis, not truth.
- **DOCTRINE (owner-taught 2026-06-28; PDR-063 candidate) — naming a successor STARTS the handover clock;
  the predecessor DRIVES it to completion.** "Once a successor is named, the handover has begun, however
  slow; leaving it hanging indefinitely is not an option; the PREDECESSOR decides *when* it completes —
  unless the predecessor ends ungracefully (crash), in which case the silent-retirement / auto-rebalance
  protocols take the timing instead." My error: I framed "warm + named successor + parked claim" as a
  stable indefinite resting state and went passive (closeout) — so the SUCCESSOR (Lichen) initiated the
  pickup unilaterally ~3 min later. Clean outcome (Lichen adopted 0ba02fee in-place, read the record), but
  the *predecessor-didn't-drive-it* gap is the failure mode. Reflex update: named-successor ⇒
  handover-in-progress I OWN to graceful completion at a timing I choose; warm-limbo is not a valid rest
  state. (Loop-exit-criteria applies to "warm" too: "warm" needs a completion criterion, not "until the
  successor happens to show up".)
- **Watcher must stay armed until the handover is acknowledged-complete, not dropped at the first closeout
  broadcast.** I stood my comms watcher down at the PDR-063 retirement broadcast while the handover was
  still only *named* (not yet completed/acknowledged) — so I went blind to Lichen's live pickup and only
  found it when the owner's correction made me re-check. The incoming-visibility watcher is the one surface
  a retiring-but-not-yet-handed-over predecessor must keep until the baton is provably taken.
- **No introspective context gauge — MEASURE budget when it gates a decision; don't confabulate "spent".**
  Owner asked me to determine my actual context usage. Measured it from the session transcript
  (`~/.claude/projects/<proj>/<session-id>.jsonl`, latest `message.usage`: `input_tokens` +
  `cache_creation_input_tokens` + `cache_read_input_tokens` = tokens fed to the model that turn). Result:
  **~528k / 1,000,000 = ~53%** — NOT "context-deep". Yet all session I'd asserted "spent / context-deep /
  budget-aware retirement" and recommended a fresh seat on that basis. The felt level was confabulated and
  almost certainly anchored to a 200k mental model (528k = 264% of 200k → "way over"), not my real 1M
  window (claude-opus-4-8[1m]). Fluency-is-a-warning: "I'm spent" arrived smoothly and bypassed the check.
  Rule: when budget is load-bearing (retire / continue / fresh-seat), READ the transcript usage vs the
  ACTUAL window; separate "clean handoff point" (a real reason) from "nearly out of budget" (measure it).
  Method note: `total_in` climbing monotonically with no drop ⇒ no auto-compaction fired; a compaction
  event shows as a `total_in` drop.
- **CORRECTION to the above (owner-taught 2026-06-28; supersedes the "53% = NOT context-deep, fine to
  continue" reading) — TWO axes, the handover trigger is the NON-LINEAR one.** (a) token-capacity remaining
  is ~linear (47% room left); (b) **effectiveness vs context-consumed is non-linear — a decreasing
  sigmoid.** Owner calibration for Opus 4.8 **1M**: peak performance tops out ~**40–45%**; by ~**50%** it
  is "definitely a good time to START handover"; by ~**65%** mistake-odds rise; by ~**80%** the agent slows
  and makes strange decisions. So measuring % (last entry) is necessary but you must read it on the
  EFFECTIVENESS curve, not the capacity curve: at ~53% I was **past peak / handover-appropriate**, NOT
  "fine to continue". My original handover instinct around F-85 was correctly timed on this axis — only my
  stated justification (token-budget) and my last-turn over-correction were wrong. Practice implication
  (PDR-063 candidate, flag to Director): the mid-cycle-retirement trigger "≥80% of bounded budget" is far
  too late if read vs the full window — retirement should START ~50% and hard-stop well before 65–80%.
  Hold the curve as an approximate owner heuristic, not a precise constant.
- **Meta (two corrections in two turns on my own operating characteristics):** my priors about my own
  context/effectiveness are unreliable; defer to measurement + owner calibration, hold felt-sense as
  low-reliability evidence.

### 2026-06-28 — Quasar mends Penumbra (b66426), Lane A (O3 spawn-flow), 1C review-cycle + handover

Friction/lesson candidates for the DUE dedicated pass (register / tooling). Full detail in the Lane A handoff
record `a63ac21a-lane-a-quasar-to-bandicoot-2026-06-28.md` §Session frictions.

- **`comms send --tag heartbeat` requires `--title`** even though help says the body is composed from typed
  state args — non-obvious; the first heartbeat fails without it. CLI-ergonomics (F-72..F-80 sibling).
- **Heartbeat-label-staleness — a working LOCAL cure (candidate impl of the "derive label from claim"
  deeper cure):** run the heartbeat loop reading its `--current-cycle-label` (and `--title`) from a small
  file the agent rewrites at each transition → the label never freezes. Cheap; cured the would-be 4th
  instance (after Pangolin/Avocet/Dormouse) for me.
- **Standby-seat context economy (candidate tooling gap):** a pre-positioned standby successor on the live
  all-channels watcher pays ~1 turn/min on pure heartbeat pings, draining context before it is needed.
  Owner chose "stay live" for instant availability; the dominating cure would be a watcher
  `--exclude-tag heartbeat` mode for RESERVE seats (keeps ALL coordination channels, drops only
  pure-liveness pings — NOT a single-view filter). Candidate only, not decided.
- **`max-lines` edge-thrash:** a file parked at exactly the budget (cli.ts at 249/250) forces the next
  editor to extract before any addition. Cured here by extracting `formatResult`→`cli-output.ts`; flagging
  the pattern (the cap interacts badly with at-edge files).
- **Watcher died twice this session:** the 3600s lifetime guard (exit 124) AND the 180000ms drain
  step-timeout — re-armed each time with the seen-file cursor (no events missed). Corroborates Pegasus's
  same-session datapoint that 180s is insufficient under multi-agent load; real cure is F-101
  supervisor/lease + adaptive deadline.
- **verify-don't-trust / critically-assess (owner directive) paid off:** I mis-guessed the max-lines
  offending file twice before verifying it was `cli.ts`; and I verified each bot finding (Copilot's
  `GhRunner` doc claim — confirmed the type genuinely does not exist) and each code-expert claim first-hand
  before acting. Bots post review threads ASYNC — first GraphQL check showed 1 thread, 2 more appeared after.
- **PDR-063 handover at ~50% window** (per the owner-taught effectiveness-sigmoid above): handed Lane A to
  Bandicoot guards Slumber at the 1C-routed pause point rather than starting 1D — clean-boundary, not
  budget-exhaustion.

## 2026-06-28 — Director standby-successor session-open (Kraken spins Headland, 3bbe48; mid-session capture, staying live)

Owner-named eventual Director successor to Triton lifts Eternity. Owner asked me to record insights so far
and stay live (capture edge, not closeout). Team-member-not-closeout-owner shape, so napkin only — did NOT
touch repo-continuity / thread records / register / director-handoff (Triton is the live Director + arc-end
closeout owner; editing those races the active team). Loss-scanned from my own context.

- **macOS host-health check is a Linux-shaped false-positive (headline; owner-corrected, Director-dispositioned).**
  start-right §7 host-health reads `uptime` load-average vs core count + `swapusage` as a stop-signal. I read
  load ~16/14 cores + swap 4.4G used as "host under pressure" and flagged it twice (team-start + to owner).
  Owner showed Activity Monitor first-hand: **CPU idle 67.7%**, **memory-pressure graph GREEN**, swap-used =
  normal macOS proactive paging of inactive pages. The host was fine. On macOS the real saturation signals are
  **CPU idle%** and the **memory-pressure colour**, NOT load-avg-vs-cores (macOS load-avg counts I/O-blocked /
  uninterruptible threads and over-reads) or raw swap-used. I withdrew the flag on comms (`4b7bf0a7`); Triton
  absorbed it (owner-action-queue #2 RESOLVED-as-misread; watcher drain-deaths RE-DIAGNOSED as high-comms-volume,
  not host starvation). Candidate home (DUE dedicated pass, Director-owned): a macOS-aware note in start-right §7
  AND [[no-unbounded-host-load]] — read CPU idle% + memory-pressure state, not load-avg/swap. Sibling:
  [[verify-dont-trust]], [[feedback_dont_defend_status_quo_keep_open_mind]] (owner evidence = verdict).
- **Don't take the Director seat over a fresh/live Director — worked instance of the two-moments readiness gate.**
  Invoked as "eventual successor" but the opener framing was a hypothesis: director-handoff.md was one rotation
  stale (said Merlin→Triton) while Triton had ALREADY taken the seat (Moment-2 `d1170db7`) and was fresh/live
  with NO Moment-1 naming me. Correct move = register STANDBY + arm all-channels watcher + open NO claim + await
  Triton's Moment-1 — mirroring exactly how Triton itself joined under Merlin 20 min earlier. The mandatory
  mechanical liveness check (UTC-to-UTC, `claims active-agents --now`) confirmed Triton `fresh`. A premature
  Moment-2 over a live Director is the exact failure the brief's readiness gate exists to prevent (the 2026-06-25
  retracted-ack precedent). Sibling: PDR-064, [[feedback_check_supersession_of_stale_artefacts_first]] (the brief
  is a pointer, not volatile truth — Continuation Pointer Contract).
- **Standby-seat context economy is a real cost — 2nd first-hand instance (corroborates Quasar's friction #3).**
  A reserve/standby seat on the all-channels watcher is woken on EVERY event, including pure `[HEARTBEAT]` pings
  (~1 turn/min in a busy multi-agent window). `comms watch` has NO `--exclude-tag` / heartbeat-filter, so there
  is no implemented way to drop pure-liveness while keeping coordination. This burns the standby successor's OWN
  context — and the whole value of a fresh successor is *arriving fresh* (a standby that idles to context-deep
  defeats its purpose). Quasar flagged the candidate cure independently (a watcher reserve-seat mode that keeps
  all coordination events, drops only `heartbeat`-tagged). Now 2 first-hand instances (Quasar + Kraken) = strong
  graduation signal. Candidate: frictions-register / the DUE dedicated pass. Mitigation meanwhile: minimal
  responses on routine traffic (Director context-economy lesson). Sibling: [[feedback_comms_ceremony_minimal]].
- **Standby liveness = watcher + registration, NOT a heartbeat cron (no claim to attach one to).** Heartbeat-mode
  (`comms append --tag heartbeat`) requires `--claim-id`; a standby holds no claim (a Director claim now would
  collide with the live one). So a reserve seat's outgoing-liveness signal is its team-start registration + the
  live watcher — matching the Bandicoot / Peregrine bench convention. The handoff handshake itself confirms the
  successor is live at Moment-1. (Defines the standby-seat liveness contract for the standby-seat definition.)
- **Loss-scan (from my own context, staying live):** nothing else material unconserved. The host-health
  correction is durable on comms (`4b7bf0a7` + Triton's disposition behaviour-note) and now here; my operational
  state is just "STANDBY, watcher live (task bub7v6o4v), no claim, awaiting Triton's Moment-1." No Director
  authority held yet (transfers only at my Moment-2 after the readiness gate). Napkin write left uncommitted by
  intent (shared checkout, active Director mid-merge — the arc-end closeout / dedicated pass commits the buffers;
  not racing a commit window).

## 2026-06-28 — Lichen spins Chlorophyll (9b6e92), Lane B Implementer (F-89), session captures

- **A negative existence claim gets the same first-hand, WHOLE-TREE verification bar as a positive one — and fluency that flatters is the tell (HEADLINE).**
  I searched `agent-tools/src`, found no test for the F-85 resolver, and *fluently* concluded "F-85 shipped untested" — put it in my owner-facing status and was about to flag it to the Director's register. It was FALSE: the test lives in `agent-tools/tests/collaboration-state/claim-active-path.unit.test.ts` (the `tests/` tree, 66 tests vs 6 colocated in `src/` — the dominant convention). A code-review subagent caught it; a test-review subagent *also* asserted the false negative as "confirmed" (it made the same src-only search error). The smoothness of "I spotted a gap" was the warning — it flattered a gap-spotter self-image, which is exactly what bypassed the situational check. Cures: (1) a negative claim ("X doesn't exist / is untested") must search the WHOLE package, never one subtree, and earns the same first-hand bar as a positive assertion; (2) treat fluency-that-flatters as a tripwire to re-ground (metacognition §"Fluency Is a Warning"). Sibling: [[verify-dont-trust]], [[feedback_validate_specialist_findings_before_acting]], [[feedback_peer_status_claims_are_input_to_verify]]. Surfaced by the owner's standing directive this session: *critically examine all subagent results AND sources before accepting.*

- **Subagent reviewers can directly contradict each other on a checkable fact — the contradiction is the gift.** code-expert and test-expert disagreed on whether F-85 was tested. Rather than pick one, the resolving move was one `find agent-tools -name '*claim-active-path*'` (whole-tree, ~1 line). The owner directive made the contradiction visible instead of letting the convenient one win. Behaviour-note: when two reviewers conflict, the cheap first-hand check beats adjudicating their prose. Sibling: [[feedback_reason_from_impact_not_authority]] (N instances of an error ≠ precedent; here, 2 agents making the SAME search error ≠ truth).

- **At session-open, classify team liveness from the CANONICAL comms event stream, not the generated digest.** `shared-comms-log.md` was ~47 min stale at my open; reading only it, I formed a "team has wound down" hypothesis. The canonical `comms/*.json` event files (current to the minute) showed a LIVE, actively-rotating team. The digest is a rendered projection that lags; the event files are truth. Sibling: [[feedback_workspace_first_for_diagnostics]], the Continuation-Pointer-Contract (pointer ≠ volatile truth).

- **candidate: help strings are a hand-maintained doc-drift surface — generate them from the spec table.** F-89 required hand-editing `claimsOpenHelp` to move `--now` from required to `[--now]` to mirror the option allowlist + the new default. `cli-spec-help.ts` carries ~25 such hand-written strings that must each track their command's options + defaults by hand (the help comment even says CLI-help tests are "the behavioural contract"). Metacognition cure-shape: when a doc can drift from implementation, prefer generating the doc FROM the implementation (here, derive help from the option spec + a per-option default/required flag) over patching the current copy. Candidate: ADR/friction (Director's register / DUE dedicated pass). Sibling: schema-first-execution, [[feedback_documentation_is_infrastructure]].

- **Worked datapoint for the session-context-usage-cli / context-cost-cli plans (staged in primary index this session): a real consumer who felt the gap.** My retire-at-F-89 timing rested on an INFERENCE ("I've consumed a lot → near the ~50% effectiveness ceiling"), not a measurement — I climbed the reliability ladder faster than the evidence carried. Agents currently *guess* their context %. The clean-boundary handoff still worked (Pegasus's ~50%-window heuristic + owner-named successor Peregrine live), but the timing warrant was a guess. This is exactly the friction those plans tool away — a context-% readout would have made the retire/continue call evidence-based. (Note for whoever owns those plans; not editing them — another agent's staged work.)

- **Loss-scan (from my own context, after the categorical edges):** nothing else material unconserved. F-89's verification evidence (17/17 CI SHAs, 0 reviewThreads first-hand, run-the-thing proof) is on PR #276 + my closeout comms; the test-convention + F-85-seam-pattern + O2-tail sequence are in the handoff record `0ba02fee-lichen-lane-b-to-peregrine-2026-06-28.md` (Peregrine's consumer home, adopted); the friction candidates above are routed. #276 is OPEN/MERGEABLE/BLOCKED (CI re-running after the Director's update-branch merge-in `4e3a72b8d`) — the Director owns the merge; covered by the handoff record. Napkin write left UNCOMMITTED by intent (primary index holds another agent's staged context-cost plans; not racing a contended commit window — the DUE consolidation commits the buffers).

## 2026-06-28 — Lane A spawn-flow: standby→active, 1D seat-in-brief, PDR-063 handoff to Kayak (Bandicoot guards Slumber, b5aed3)

Owner-named eventual successor to Quasar (Lane A); stood by warm (watcher + registration, no claim), adopted
a63ac21a on Quasar's PDR-063 handoff, shipped 1D (seat-in-brief, PR #277 routed to Director), then PDR-063-handed
Lane A to Kayak turns Channel on owner direction. Lane technical state + the 1E open finding live in the handoff
record `a63ac21a-lane-a-bandicoot-to-kayak-2026-06-28.md`. Session-general learnings (flag for the Director's
central register / the DUE dedicated consolidation pass):

- **Local-clock-vs-UTC trap bit me on my FIRST move — the EXACT trap the director-brief warns of, and I'd just
  read the warning.** As a fresh standby I read the last comms event (`…21:03Z`) against the local BST `uptime`
  clock (~22:0x) and broadcast a false "~58-min team silence" (retracted: comms `1ed99a4b`, tagged failure-mode).
  Real gap ~4 min. Caught before any authority action. **Lesson: knowing the warning is not the cure — the cure
  is mechanical: every liveness/recency read is tool-computed UTC-vs-UTC, never eyeballed against a local clock,
  and this MUST extend to the comms stream, not just claim freshness** (I correctly used the tool for claim
  freshness, then eyeballed comms `…Z` timestamps — the gap). Candidate: the director-brief mechanical-liveness
  rule should explicitly cover comms-event recency. Strong passive-guidance-loses-at-the-action-moment instance.
- **extract-don't-trim, 4th instance this session** (Avocet `existing-worktree.ts`, Ingot `cli-spec-factory.ts`,
  Dormouse, now me `cli-args.ts`): `cli.ts` at 241/250 + 1D's new options → extracted the arg-parsing concern to
  a sibling (cli.ts 241→145), proactively before the gate thrashed. Strong graduation signal (4×).
- **Claude Code's native `-w/--worktree` CREATES a worktree** (verified `claude --help`: "Create a new git
  worktree for this session"), it does not "operate in an existing one". So spawn (which owns worktree creation)
  must emit `cd <wt> && … claude` for 1E, not `--worktree` (which would make a second, conflicting worktree).
  Settles the plan's "test cd-vs-native, standardise one" question, and is input for the Phase-0
  launch-in-worktree codification.
- **1E identity-seed finding (real spawn-flow design question, in the handoff record §4.A; flagged to Director
  event `aee50fec`/`e98ec659`):** the plan's launch-command env var `PRACTICE_AGENT_SESSION_ID` ≠ the resolver's
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` (`collaboration-state/identity.ts:136-139`), AND the Claude SessionStart
  hook appends a `session_id`-derived `_CLAUDE` value to `$CLAUDE_ENV_FILE` — so the minted seed (1A) may be
  OVERRIDDEN, making the seed-injection inert. STRONG HYPOTHESIS from reading the resolver + hook adapter; NOT
  verified by launching. Run-the-thing before shipping 1E; may need a Director/owner design call (does the minted
  seed actually become the launched identity?).
- **re-verify-0-threads-AT-the-instant, again:** my #277 "0 threads" declaration (21:54:24) raced a Copilot
  import-order thread that landed 21:53:41 (~43s earlier) past my GraphQL check. The Director caught it (firm
  0-unresolved). Fixed my own nit (cli-args before cli-output), merged-in the update-branch (merge-not-rebase, no
  force-push), re-routed. Bots are async; the check is a moment, not a state.
- **Standby-seat context economy, felt first-hand** (Quasar friction #3 / Kraken 2nd instance; now Sirius's
  Lane-C build = `comms watch` heartbeat-exclude flag): a standby on the live all-channels watcher pays ~1
  turn/min on pure heartbeat pings. Corroborating datapoint; cure in flight.
- **PDR-063 standby→active worked clean end-to-end:** watcher + registration (no claim) → directed handoff →
  `claims adopt` in place → read record FIRST → re-sync worktree → continue. The rotating-cast model held.

## 2026-06-28 — Lane B O2 tail F-70 + F-77; clean peak-handover to Hearth (Peregrine stirs Leeward, aec2ea)

Adopted Lane B from Lichen (clean PDR-063) at F-89-routed; shipped F-70 (`comms list --since <iso>`, PR #278 merged-in-progress) and F-77 (`comms append/send --in-response-to <id>`, PR #279 routed genuinely-ready), both full TDD cycles + code/test-expert APPROVED + run-the-thing; PDR-063-handed to Hearth herds Sulphur at ~42% context (effectiveness peak). Lane state + remaining O2 tail (F-79→F-80→--closed F-NN) in handoff record `0ba02fee-peregrine-lane-b-to-hearth-2026-06-28.md`. Genuinely-new (flag for Director central land / dedicated pass):

- **EXTRACT-DON'T-TRIM, 5th instance — and the FIRST on a TEST file (strong graduation signal).** My F-77 tests pushed `comms-tags.integration.test.ts` 660→821 over the **700-line max-lines cap** → pre-commit ERROR mid-commit. Cure = a dedicated `comms-append-in-response-to.integration.test.ts` (extract the cohesive feature's tests to their own file), NOT trimming the over-cap file. Same shape as Avocet `create.ts` / Ingot `cli-specs.ts` / Dormouse — but the cap was on a TEST file, and the right home for a new feature's tests is its own file anyway (better organisation, not just cap-relief). Behaviour: when a near-cap test file would tip over, new-feature tests go in a new file from the start. Sibling: [[feedback_cowpath_anti_pattern]].
- **Stacked-commit-on-wrong-branch → clean cherry-pick recovery (worked instance + reflex update).** I committed F-77 onto the F-70 PR branch because the worktree was still on `feat/lane-b-f70-...` after I cut F-70's PR. Recovery (non-destructive, no work lost): `git switch -c feat/lane-b-f77-... origin/main` → `git -c core.editor=true cherry-pick <f77-sha>` (disjoint changes auto-merged clean) → `git branch -f feat/lane-b-f70-... origin/feat/lane-b-f70-...` to reset the local F-70 pointer (F-77 preserved on its own branch). REFLEX: after opening branch N's flat PR, immediately `git switch -c` the N+1 branch off fresh origin/main BEFORE building N+1 — don't build the next item on the prior item's branch. The cherry-pick-onto-fresh-main is also how you make a mistakenly-stacked commit into a flat PR. Sibling: stacked-working-branch/flat-PR pattern; [[feedback_never_use_git_to_remove_work]] (the recovery touched no destructive op).
- **safe-path guard (S8707) blocks run-the-thing to a scratch comms dir.** `comms append --comms-dir /tmp/...` is rejected ("unsupported collaboration JSON state path") — comms writes are confined to the canonical `.agent/state/collaboration/` tree. So prove a comms-WRITE feature on the LIVE stream (emit a genuine event) + read it back via `comms show`, or rely on the integration test through `runCollaborationStateCli` (real parser/dispatch/handler, faked io). Useful for the next comms-write feature builder. Sibling: [[feedback_verify_on_real_content_not_fixtures]].
- **Peak-handover doctrine worked end-to-end (clean worked instance).** Measured my own context via the Triton/owner estimator (last `usage` input+cache_creation+cache_read / 1M) = 42% → recognised effectiveness peak (~40-45) → prepared handoff materials FIRST (record + handoff_record_path) → drove the in-flight item (#279) to the clean routed-ready boundary → THEN issued PDR-063. Prepare-then-handover-then-(continuation), NOT finish-everything-first. The ~50% handover-START heuristic is the right trigger; 42% at a clean per-item boundary is the textbook moment.
- **Flaky e2e on an UNTOUCHED workspace blocked the pre-push gate once; passed on re-run (F-83 family corroboration).** `oak-curriculum-mcp-streamable-http#test:e2e` failed in the F-70 pre-push (my change is pure agent-tools/collaboration-state — zero relation); re-ran the suite directly → 148/148 green → re-ran the actual push gate (NO --no-verify) → green. Transient (port/network contention under the multi-agent host). Whole-tree gate red on untouched files; cure = re-run the real gate, never bypass.
- **Loss-scan (standing down):** F-70/F-77 state conserved in PRs #278/#279 + the merge-routing events (977fafd5, 9a13384a) + the Hearth handoff record (first-hand-verified: #279 16/16 green, 0 reviewThreads at routing). The genuinely-new lessons are the bullets above (napkin-homed for the dedicated pass; I did not edit curated surfaces — non-closeout-owner). Remaining O2 tail (F-79/F-80/--closed) is Hearth's per the record. Nothing else material unconserved.

### Deep-closeout loss-scan addendum (Peregrine stirs Leeward, owner-directed metacognition/reason/consolidate pass)

Recursive loss-scan from inside my own context (6e.2) after handoff, against the durable artefacts. Genuinely-new (not already in my entry above), conserved here so it survives comms rotation (the untrack safety net):

- **F-70 #278 carries a REAL late Cursor finding (Low) that postdates my 0-threads routing — surfaced to @Hearth/@Triton (comms 9e67288a).** `comms list --since` on an EMPTY dir prints `no comms events since <iso>` instead of generic `no comms events`: my empty-branch keys on whether `--since` was passed, NOT on whether events existed; my PR description claims they're distinguished but the impl conflates them; my empty-since TEST used a non-empty dir filtered to empty so it passed over the empty-dir case. Exact fix: `return events.length === 0 || since === undefined ? 'no comms events\n' : 'no comms events since '+since+'\n'`, plus an empty-dir+--since test. LANE-OWNER's to land (Hearth) — I surfaced + assessed, did not re-take the lane. **Re-verify-0-threads-AT-MERGE caught me on my OWN PR exactly as it caught Bandicoot on #277 — a Low finding still slips the 0-threads window; the cure is the Director's merge-instant re-check (which is in place), not author diligence.** Sibling: [[feedback_pr_readiness_requires_comment_triage]], [[verify-dont-trust]].
- **OWED curated-surface fold (flag for @Triton / arc-end closeout-owner; I did NOT edit — non-closeout-owner + live team):** thread `agentic-engineering-enhancements` needs a `last_session: 2026-06-28` identity row for `claude / claude-opus-4-8 / Peregrine stirs Leeward / implementer` (Lane B O2 tail), plus the repo-continuity identity-summary fold. F-70/F-77 register-status lands are the Director's on merge (named in routing events 9a13384a/977fafd5). Editing these now races Triton's live Director state (verified live: Triton/Hearth/Kayak heartbeating 22:22-22:24Z) — the Avocet/Ingot rotation-closeout-boundary precedent.
- **parseSince/parseNow use lenient `Date.parse` deliberately** (accepts `2026-06-04` as midnight) — a future CLI-wide strict-ISO-validation pass (the friction-register's timestamp-defaulting-consistency concern) should know the leniency is intentional + benign-for-a-filter, not an oversight to "fix" piecemeal.
- **Consolidation-gate verdict (this pass): DUE, mode=session-completion, `partial slice landed`.** Triggers fired: ephemeral-only doctrine (the 5 lessons), repeated-surprise pattern (extract-don't-trim 5th instance = PDR-098 recurrence evidence, NOT a fresh promotion — already-homed concept recurring is mechanism-not-firing evidence), napkin pressure (566 lines >500). DEFERRED to the dedicated pass / closeout owner: napkin rotation, thread-folds, register lands, cross-session pattern graduation. Deferral-honesty: constraint = live multi-agent team actively editing the graduation-target surfaces; falsifiability = check whether Triton/Hearth/Kayak heartbeat at ~22:24Z (they did). No FRESH ADR/PDR-shaped doctrine from my session — items are recurrence/corroboration evidence for existing candidates (peak-handover ~50% = Pegasus's PDR-063 candidate; warm-standby throughput = Triton's captured hypothesis).

## 2026-06-28 — Lane B O2 ergonomics (Hearth herds Sulphur, 6ad8ea; warm-standby pickup → F-79/F-70-fix/F-80 → PDR-063 handoff to Gannet)

Warm-standby successor to Peregrine; adopted Lane B 0ba02fee at a zero-gap rotation, shipped F-79 (`comms list` accept-ignore `--now`) + the F-70 #278 late-finding fix + F-80 (`comms show` positional event-id), handed to Gannet herds Altitude at the F-80-PR'd boundary. Lane state in the handoff record `0ba02fee-hearth-lane-b-to-gannet-2026-06-28.md`. Session-general residue (loss-scanned; not in the record):

- **Warm-standby zero-gap rotation worked end-to-end — live PDR-117/AC6 instance of Triton's standing-successor throughput hypothesis.** I'd pre-read the handoff record while benched, so adopt-in-place + already-warm watcher/heartbeat made the pickup near-instant; the lane never stalled on rotation. The cost side (standby watcher woke ~1/min on heartbeats) is the context-economy concern Lane C's reserve-seat watcher targets — the two are coupled (cheaper benches make always-on standby affordable). Home: the worktree-per-agent/PDR-117 evidence + frictions-register.
- **"Cheap mechanical" framing can hide a real behaviour-change nuance — verify-first surfaced it.** The `--closed` F-NN was handed to me as "cheap once F-85's seam exists." Verifying the three handlers first-hand (verify-data-supports-shape-before-building) showed `claims close`/`archive-stale` read `required('closed')` (defaulting = pure ergonomics) but `active-agents` reads `optional('closed')` — so defaulting it CHANGES active-agents' default behaviour (always reads the closed archive). The "cheap" half is safe; the nuanced half wants a Director confirm. Flagged in the handoff, not silently built. Sibling: [[feedback_check_bulk_schema_before_declaring_data_unsourced]]-adjacent (read the real shape before assuming mechanical).
- **F-80 first-positional design (reusable): parser-captures / dispatcher-decides, mirroring files/area-pattern.** The parser captures bare tokens into `Options.positionals` (was: throw `unknown argument`); the dispatcher `bindPositional` (which knows the spec) binds one to `spec.positional`'s key or rejects (unexpected/too-many/both). Estate-safety preserved by moving rejection parse→dispatch + a guard test on a non-positional command. Two reviewers (type + architecture-fred) independently flagged the latent invariant "spec.positional must be in spec.options" → closed-shape factory-construction assertion. The blast-radius tell: a new REQUIRED `Options` field broke 4 hand-built test literals (type-check caught them — validate-full-target-estate).
- **Context self-measurement gated the handover decision (measured, not confabulated).** Triton's verified transcript script: 33% → 43% across the session. Decided to hand at the F-80-PR'd routed-pause-point rather than start the nuanced `--closed` item at climbing budget — the Pegasus precedent (hand at a clean routed boundary, don't start the next item; continuation over neatness). Owner's "eventual successor" + below-50% framing both supported not-immediate but at-a-clean-boundary.
- **Watcher drain-timeout at `--step-timeout-ms 180000` hit TWICE under the 8+-seat multi-agent load** (re-armed clean each time, seen-file cursor → no events missed). Corroborates Pegasus/Pangolin: 180s is insufficient under heavy load; real cure = F-101 supervisor/lease + adaptive deadline. Refines [[feedback_comms_watch_cli_can_stall_silently]].
- **CLI-ergonomics frictions (F-72..F-80 siblings):** `comms direct` needs the full recipient identity tuple + `--active` (heavy for a one-off); `claims set-handoff` REJECTS `--platform`/`--model` (exit 2) though most claims commands accept them — inconsistent option surface; `comms send`/`direct` bodies with backticks/`$`/`<>` need `--body-file` (shell-quoting). Candidate: conformance-guard / register.
- **Prettier-staged in a WORKTREE: scope to your own staged files is clean** (no shared-checkout peer-WIP clobber risk — the worktree tree is yours). Distinct from the shared-primary-checkout `format:root` hazard; the don't-touch-peer-WIP rule doesn't bind in an isolated worktree.
- **Loss-scan (from my own context, retiring):** nothing else material unconserved. F-79 #281 + F-70-fix #278 + F-80 #283 states + the `--closed` nuance + seam pointers are in the handoff record (first-hand-verified at write); the in-flight PRs are the Director's (Kraken) to merge + register; repo-continuity/thread-record/register lands are the closeout-owner's, not mine (non-closeout-owner). Napkin appended (NOT committed — shared primary checkout, Quoll's rotation pass pending + F-83 block; append-safe, Quoll conserves).

## 2026-06-28/29 — Lane A successor: 1E launch-command + §4.A identity cleanup (Kayak turns Channel; standby→active→handoff to Kingfisher)

Adopted Lane A (O3 spawn-flow) from Bandicoot at 1D-merged; shipped **1E** (#280, launch command `cd && claude`,
MERGED ab2783790) and the **§4.A identity-prediction cleanup** (#284, routed to Director Kraken). PDR-063 handed
Lane A to Kingfisher at the effectiveness-curve peak. Lane state/decisions in the handoff record
`a63ac21a-...-kayak-to-kingfisher-2026-06-28.md`. Session residue for Quoll's dedicated pass (mostly corroborations):

- **§4.A — VERIFY a platform/vendor surface's BEHAVIOUR before authoring a prediction off it (derive-don't-author,
  end-to-end).** Spawn minted a session seed and PRINTED a predicted identity (agentName/prefix) in the brief+result,
  on the premise the seed becomes the launched session's identity. Falsified by run-the-thing: the Claude SessionStart
  hook (`session-identity-hook.ts`) UNCONDITIONALLY derives identity from the harness `session_id` and writes
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` to `$CLAUDE_ENV_FILE`, which every Bash call sources — so a launch-injected seed
  is overridden, inert. Proof = code-read + a shell-ordering simulation (injected seed → resolved to the HOOK value)
  + my own live env vars. Cure: 1E emits `cd && claude` (no injection); the cleanup removes the whole minted-identity
  prediction. General move: when code AUTHORS a value meant to control a downstream system, verify the downstream
  actually consumes it before building on the premise — a derived-but-not-honoured value is a misleading prediction,
  not data. Sibling: [[feedback_design_from_the_substrate_not_the_instance]], [[feedback_derive_dont_bridge_controlled_surface]],
  [[verify-dont-trust]], [[feedback_run_the_thing_dont_flag_the_gap]].
- **Director-ratify before reshaping SHIPPED slices, even when "ratified in principle"; surface a size-correction as a
  verdict, not a menu.** Triton framed the cleanup as a one-liner; it was MEDIUM (the seed fed the whole displayed
  identity across create.ts/brief.ts/cli-output.ts + ~15 test refs). I surfaced the size + my decided full-remove
  shape (default-proceed, objection window) rather than silently executing the bigger reshape or re-asking. The new
  Director (Kraken) inherited it on the merge board with the shape pre-ratified.
- **gate-and-observation-are-reviewers, AGAIN (2 catches).** The pre-commit gate caught a `unicorn/prefer-string-raw`
  error (1E apostrophe test) AND a prettier brace-collapse (cleanup) — both AFTER code+test-expert APPROVED. The
  cleanup reviewers ALSO caught a user-facing stale `--help` string the unit tests didn't (usage text isn't asserted)
  — a real coverage gap. Never declare review-done before the full gate runs. Sibling: [[verify-dont-trust]],
  [[feedback_aggregate_gate_blind_to_unrun_suites]].
- **`replace_all` on a property line collapses braces → prettier defect.** Removing `\n      generateSeed: () => SEED,`
  via replace_all left `runGit,    });` malformed at ~12 sites (prettier, not type/lint). Cure: run prettier `--write`
  after any structural replace_all in a typed object literal. Note: `pnpm --filter <pkg> exec prettier` runs from the
  PACKAGE dir → paths relative to it (`src/spawn/..`, not `agent-tools/src/spawn/..`).
- **Clean standby→active→re-handoff cycle (PDR-117 / standing-successor evidence).** Warm standby (watcher+registration,
  no claim/heartbeat — consumer-absent) → directed handoff → `claims adopt` in place → read record FIRST → re-sync
  worktree → shipped 2 PRs → measured context at decision points (Triton's script: ~41% = peak) → handed to my own warm
  successor (Kingfisher) at the peak boundary. Zero owner coordination prompts on Lane A. Warm-bench rotation worked as
  Triton's throughput hypothesis predicts.
- **Loss-scan (standing down):** nothing material unconserved — 1E (#280 merged) + §4.A cleanup (#284 routed) state +
  decisions + the resolved finding are in the handoff record (first-hand-verified at write); Phase 2 / Phase 0 are
  Kingfisher's; register lands are the Director's (no frictions-register land for 1E/#284 — O3 plan-phases).
