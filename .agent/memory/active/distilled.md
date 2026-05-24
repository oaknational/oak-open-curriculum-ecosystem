---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 28000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
fitness_rationale: "Raised 2026-05-17 (Swift Winging Gust) per owner direction after the structural pass: the 2026-05-14 multi-agent deep-dive and 2026-05-17 gate-green cascade landed durable substance that, after archiving the graduations-log and back-cite blocks, leaves ~455 lines of high-signal cross-session learning. Previous limits (target 200 / limit 275 / chars 16500) were calibrated when distilled content volume was lower; substance growth is legitimate and preservation outranks fitness pressure. The new envelope keeps refinement pressure on without forcing premature graduation of recent (still-ripening) entries. Falsifiability: if substance later compresses naturally below the previous envelope, the limits should be lowered again at the next consolidation."
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before
every session. Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-10.md`
(sessions 2026-02-10 to 2026-05-10).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending validation.

**Earlier graduations audit-trail archived (2026-05-22)**: the
2026-05-06, 2026-05-09 (Woodland Sheltering Glade), 2026-05-10
(Quiet Lurking Mask), and 2026-05-11 (Verdict-not-menu Flamebright
Burning Lava) graduation blocks moved to
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-22 — earlier graduations blocks moved
from distilled.md". Substance lives at named permanent homes
(PDR-057, PDR-058, PDR-018 amendment, PDR-026 amendment,
`agent-collaboration.md` directive amendments,
`.agent/rules/present-verdicts-not-menus.md`,
`.agent/rules/practice-core-portability.md`,
`.agent/rules/directive-file-context-budget.md`,
`.agent/rules/validators-must-recompute-not-just-record.md`,
`.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`,
`.agent/rules/no-moving-targets-in-permanent-docs.md`,
`docs/governance/development-practice.md` § Documentation Practice,
`.agent/memory/operational/collaboration-state-lifecycle.md`).

**Meta-observation (2026-05-09 historical-napkin-synthesis)**: the
fitness-as-trim impulse is doctrine-resistant under context
pressure. Three independent corrections in 2026-05-06 → 2026-05-09
on the same shape — agents reflexively trimming substance when
fitness signals fire. Two structural cures captured as
pending-graduations entries: lifecycle-aware fitness model and
active inline discipline-reminder text in fitness-validator output
at non-healthy zones. Source: §F1 of the synthesis report under
`research/agentic-engineering/continuity-memory-and-knowledge-flow/`.

**Verified distilled homes archived (2026-05-24)**: Phase 3 of the
memory-surface critical-drain plan removed entries whose durable homes were
verified first. Audit trail lives in
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-24 — verified distilled homes".

---

## Recently Distilled — 2026-05-22 peer-pair plan review

Two behaviour-changing observations from the Velvet/Charcoal peer-pair
plan-improvement pass on `commit-queue-intent-scope-discipline.plan.md`.
Source napkin entries archived at `napkin-2026-05-22-evening.md`. Plan
commits: `bf9266f3` + `2adeccec`. A third observation (event-driven
wake uses Monitor, not Bash background) graduated 2026-05-22 to the
[Monitor wake rule](../../rules/use-monitor-for-event-driven-wake.md)
in commit `a49e7a21` and is no longer duplicated here per the
no-duplication-across-tiers discipline.

### Peer-pair plan reviews produce ~50% non-overlapping coverage

For dense plans where the next implementation step is high-cost, run two
independent reviews across different model families before authoring.
Velvet (codex/GPT-5) surfaced six findings; Charcoal (claude/Opus-4.7)
surfaced ten; five overlapped substantively; five were distinct on each
side. The model-family complementarity is the load-bearing factor:
Codex's coverage was strong on plan-text discipline (pre-checked ACs,
stale wording, AC checkbox state); Claude's was strong on internal
coherence (contradictions, equivocations, semantic narrowing).

Cost ~2× single-reviewer; defect coverage ~50% non-overlapping — net
coverage roughly doubles. Default to peer-pair for plan readiness before
high-cost implementation cycles. Solo review is fine for low-cost cycles
where the cost of a missed defect is bounded.

### Named peers can arrive late; keep all-channel comms reconciliation alive

In a team-start session, a peer named in the user's brief can arrive
AFTER the first live registry/comms checks complete (the
empty-registry-at-session-open does not mean "no peer will arrive").
Velvet observed this during the plan-improvement collaboration: their
first live checks showed no Charcoal presence, then Charcoal's team-start
broadcast surfaced 60+ seconds later.

The discipline: keep the all-channel comms watcher alive until final
closeout; treat early solo analysis as provisional; do a final comms
reconciliation before reporting the work as complete. If a named peer
appears, explicitly map their findings against your own (accepted /
partially accepted / deferred) rather than letting the first agent's
private review become the whole story.

This refines the singleton-lane coordination rule's existing guidance —
"empty active-claims.json at session-open means 'no team visible yet'"
— by adding the temporal qualifier: empty registry at any single moment
is not "no team will arrive", it's "no team is visible at this moment".

---

## Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade

### Gates hide gates — failure surface is a stack, not a list

`pnpm check`'s serial chain (each gate's `&&` means downstream gates do
not run while an upstream gate is red) shields each failed gate from
the next. The shielding holds at test-level too: a flaky test prevents
the test below it from being trusted. **Diagnostic discipline**: when
a gate clears, *expect* the next downstream gate to surface a previously
hidden problem; treat each green gate as a magnifying glass aimed at
the next. Worked instance 2026-05-17: knip clearing surfaced a
parallel-load MCP e2e flake; the e2e deletions surfaced a missing
Playwright binary; installing the binary surfaced two pre-existing
circular type imports in depcruise that had been latent for weeks.
Falsifiability: a `pnpm check --continue` mode would reveal the full
latent stack at once; periodic continue-mode runs catch this earlier.
Routing: pending-graduations entry pending second-instance trigger.

## Recently Distilled — 2026-05-14 Sylvan Budding Forest deep-dive consolidation

Behaviour-changing entries distilled from the 2026-05-14 napkin rotation
(archived at [`napkin-2026-05-14.md`](archive/napkin-2026-05-14.md)). The
rotation covers eight sessions across two threads — the multi-agent P8 team
(Pearly Drifting Jetty controller plus Nebulous, Arboreal, Torrid, Fronded,
Embered) and three Cursor / Codex closeouts (Luminous Glowing Moon plan
promotion; continuation-pointer clarification; agent onboarding flow patch).
The full session-by-session capture lives in the archived napkin; the
durable doctrine below is what changes behaviour next session, regardless
of who picks the work up.

### Coordination role discipline (multi-agent evidence)

- **Roles emerge from live pressure, not from a fixed menu.** The useful
  multi-agent topology in the P8 window (controller, marshal, reviewer,
  implementer, scout, standby) was selected from the scarce resource at
  the time — git/index/queue contention drove marshal value; bounded
  GO/BLOCK challenge drove reviewer value; an exact file bundle drove
  implementer ownership. Static role menus are useful as *prompts* for
  what shape might fit, but treating them as canonical topology risks
  premature structure and silent over-coordination. Naming a role
  costs nothing; naming the obligation plus the handoff proof is what
  actually pays off.
- **Every role description must carry its handoff proof.** "Marshal"
  worked because it meant *watching exact staged pathspecs and queue
  state*. "Reviewer" worked because it meant *GO/BLOCK on a bounded
  slice plus focused-test evidence*. "Controller" worked when it meant
  *allocator and sequencer*; it would become harmful if it slid into
  *central permission for every judgement*. When a role appears in a
  team plan, the next sentence should name what artefact proves the
  handoff.
- **Treat scout responses as input, not as permission.** Read-only
  scouts after a source commit are valuable when they preserve
  momentum into the next slice. They are *not* implicit licence to
  open a new implementation claim during closeout; the next slice
  needs fresh live grounding and an explicit route.
- **Pre-closeout sweep ritual is now a controller invariant.** Before
  hardening any "final status" sentence, sweep all six surfaces in
  this order: active claims, active commit queue, staged files,
  `git status --short`, shared comms, directed inbox (plus late
  scout/reviewer replies arriving after the last source commit).
  Discrepancies between these surfaces are status-worthy even when
  the session has no implementation assignment. "Empty claims and
  queue" is never the whole state during a closeout window.
- **Closeout comms can perturb the closeout bundle.** During a
  closeout commit window: one explicit marshal verification event is
  fine; further verification should be local-only unless a blocker
  appears. New comms events written after record-staged force the
  closeout bundle owner to re-enqueue or accept residue.

### Commit-window operational sharpening

- **`git:index/head` commit-queue claim pattern syntax**: when opening a
  commit-window claim, use `--area-kind git --area-pattern "index/head"`
  (bare, no `git:` prefix). The `git:` prefix is the symbolic name of
  the resource; the stored pattern is the bare path. The guard
  (`claimCoversGitIndexHead`) does exact-element match on the
  normalized list, so `["git:index/head"].includes("index/head")` is
  false. Mistake source: Luminous Glowing Moon 2026-05-14; behaviour
  change recorded so the next agent does not repeat it.
- **CLI flag-shape drift under coordination pressure**: the
  collaboration-state surface has moved. `comms inbox` currently takes
  `--comms-dir`, `--seen-file`, `--platform`, `--model`, and optional
  `--session-prefix`; it rejects older `--thread`, `--agent-codename`,
  and `--since-file` shapes. `commit-queue` is a top-level
  `agent-tools` topic (`pnpm agent-tools:commit-queue --
  list --queue-status active`), not a `collaboration-state` topic.
  `comms send` is shared-log; directed routing belongs to
  `comms direct` with `--to-agent-name`, `--to-platform`,
  `--to-model`, `--to-session-prefix`. Check topic-specific help in
  every resumed or compacted session before relying on muscle memory.
  The shape can differ even inside one topic: `claims list` rejects
  `--platform` / `--model`, while claim mutations such as `claims open`
  and `claims close` require identity flags. For literal search patterns
  containing backticks, use single quotes; double-quoted `rg` patterns
  let zsh attempt command substitution before `rg` runs.
- **Keep evidence outputs readable.** Do not collapse independent
  validation or evidence-gathering commands behind `&&` just to move faster.
  Run them as separate commands, or use the parallel tool wrapper for
  independent checks, so each output remains attributable and readable during
  review. A shell dependency is fine only when the dependency is the thing
  being tested.
- **Run formatting proof before the commit hook for new modules.** The
  Slice A landing burned a shared git/index window because Prettier
  fired inside the hook on a new module. The cheap cure is
  `pnpm agent-tools:repo-check -- prettier-staged` (or targeted
  Prettier) immediately before `git commit` when the bundle creates a
  new file. Re-record the queue fingerprint after the format, then
  retry the commit.

### Continuation surfaces

- **Skill text carries durable routing behaviour; continuation
  records carry volatile facts.** Branch, plan, next-step, commit ids,
  team expectation — every fact that changes between sessions belongs
  in the thread record, not in the skill body. The skill's job is to
  fire the routing on arrival; the record's job is to provide the
  current state for that routing to act on.
- **"Ready to land" is dangerous in continuation records after a
  commit window.** Use it only when the work is genuinely uncommitted
  and pending. Once the work lands, replace the phrase with commit
  evidence (`bfa26e01`, `498edcc2`, etc.). Stale "ready to land"
  wording in a continuation record is an actionable defect, not a
  wrapper.
- **When a collaboration skill changes session entry or exit
  behaviour, audit root README and platform onboarding adapters in
  the same closeout.** The specialised skill text is correct only
  half the story; a new agent can enter through README, a teammate
  prompt, or a Cursor/Codex rule and miss the new routing entirely.
  Routing surfaces are co-load-bearing with the skill body.

---

## Held Pending Validation

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md

---
