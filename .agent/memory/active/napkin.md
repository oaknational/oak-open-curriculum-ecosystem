---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-29 — routing-legacy-fallback sunset completion (Twilit Orbiting Satellite)

### Find the falsifying fact before doing surgery — a confident self-narrative is cheap

The e2e failure (`collaboration-tui.e2e.test.ts`, exit 2) handed me a clean,
self-critical frame: *"my unit-test fixes masked a regression — the display
layer now crashes on real id-less data."* It felt like rigour (self-accusation
wears diligence's costume), and I was already drafting product surgery: a
tolerant display key plus a second identity-equality fn across `active-agents.ts`
— a compatibility layer the owner's standing steer explicitly forbids. **One
fact from Leafy's audit collapsed the whole frame**: the closed-claims archive
has *zero* id-less rows and active claims/queue are id-bearing by write-schema,
and `activeAgentReports` reads only those (the id-less comms backlog flows
through a different, already-tolerant surface). So the failing input — an id-less
*claim* identity — does not occur in valid state; the e2e fixture was simply the
stale pre-sunset shape. Correct fix was *smaller*: modernise the fixture, leave
the strict fail-fast. Lesson: the suspicious feeling is not "this sounds
self-critical" — it is "I have a confident narrative and have not yet found the
fact that would falsify it." Reusable diagnostic for a strict refactor's
downstream test failure: **does the failing input shape occur in valid current
state? If no → stale fixture (modernise it). If yes → real regression (fix
product).** Extends verify-dont-trust to your own frame, not just others' claims.

### Plan narrative sections drift from their own working artefacts

The rightsizing plan's Activation record said *"routing code is untouched —
deletion derived from the model"* while its own M1 inventory §0 said *"the legacy
routing system is deleted, not folded… this work executes that removal."* One
agent's artefacts, authored at different moments, contradicting each other — and
the activation record was the stale half. When marking work landed, reconcile
BOTH the plan's prose sections and its working-artefact sections; a plan can lie
to itself. (Same family as supersession-must-refresh-the-continuity-chain.)

### Read-only survey agents report plan-body state as current

The Explore agent surveying the comms plans reported the routing sunset's "10
failing tests BLOCKING" as remaining work — it read the plan's pre-completion
§Session-1 RED block as live truth. Snapshot-read-as-current-state recurs for
sub-agents reading plan bodies; verify any "remaining work" claim against the
live tree/commits before relaying. (Already-homed pattern; noted as a fresh
instance, not a new lesson.)

## Session: 2026-05-29 (cont. II) — eef / D0 validator hardening (Tempestuous Gliding Thermal)

### Validate-before-acting applies to your OWN verdict, especially mid-action — candidate

I primed a security-expert with *"the fix IS happening"* before grounding whether the
fix was warranted. Reading the validator's own test (`does not over-reach: a function
nested in data is allowed`) revealed I was one edit from deleting another agent's
deliberate, tested decision and calling it a fix. The verdict flipped to "tripwire,
not adversarial guarantee — don't reverse it," then the owner's *"strict checks pay
off"* steer flipped it back to "do the full hardening, openly reversing the test."
Lesson: `validate-specialist-findings-before-acting` is usually framed as *reviewers
over-escalate*; the higher-value application is that MY OWN verdict stays provisional
until grounded against (1) author intent, (2) the mechanism's real threat model,
(3) owner direction — and a specialist's thoroughness is exactly what carries a
half-grounded verdict past the check. `candidate:` doctrine note — a `distilled.md`
entry or a `validate-findings` amendment naming "your own verdict" as in-scope.
(Napkin already HARD per Furnace/Highland; not mine to cure — owner-flagged fitness
session pending.)

### A disjoint source-vs-`.agent/` slice doesn't cross-trip the pre-commit gate

Committed a 4-file source slice into a tree carrying ~30 files of concurrent agents'
`.agent/` WIP, hook green, only my files landed. Why it's safe — and it is NOT "the
hook is staged-only" (full-tree gating is intentional, see
[[feedback_pre_commit_hook_must_gate_staged_only]]): `.husky/pre-commit` is
`prettier-staged` + `markdownlint-staged` (STAGED-scoped) → `repo-validators:check`

+ `lint:shell` + `turbo type-check lint test` (whole-tree, but turbo is
WORKSPACE-scoped). Peer WIP living in `.agent/` markdown is in no workspace `src/`,
so it triggers none of the turbo gates; the staged formatters see only my files.
Net: the recurring "can I commit while peers hold uncommitted WIP?" hesitation
resolves to **yes, when your slice is workspace/staged-disjoint from theirs** —
stage by explicit pathspec and scope `git commit -- <paths>` so only yours land.

### Anti-abuse repo-validators are tripwires, not adversarial guarantees — candidate

The `*.external-data.ts` validator and the sonar cpd-exclusion it guards are
co-editable in the same PR, so NO in-repo validator can stop a determined committer.
Its honest role is a tripwire against the common mistake (a helper fn dropped in a
data file), not airtight defence. Calibrate scope to (common-mistake coverage +
owner strictness), not to defeating an adversary — and don't mistake a
security-expert's exhaustive bypass enumeration for a mandate to chase airtightness
the mechanism can't provide. `candidate:` doctrine note for
`docs/governance/sonar-disposition-policy.md` §Duplications — name the
tripwire-not-guarantee stance so the scope question doesn't reopen each review.

## Session: 2026-05-29 — Lane E PDR-058 optionality graduation (Furnace Melting Bellows)

### Re-poll live state when an owner names a peer/source that doesn't resolve

Owner said *"pick up lane E from Shaded PT."* My first `active-claims.json` read was
**empty** → I nearly concluded "no Shaded PT Lane E work exists in any surface" (I'd
checked comms, handoffs, claims, tree, buffers). The peer (`Shaded Prowling
Threshold`) had registered ~moments around my read; a **re-read** showed two live
claims + a directed Lane-E pickup brief waiting for me. Lesson: an owner naming a
peer/source that doesn't resolve is a signal to **re-poll live state**, not to
conclude absence — claims can be seconds-fresh and a peer may be mid-registration.
A stale single read produced a confident wrong "no such agent."

### Consequence-completeness across the doctrine graph (charter-PDR staleness) — candidate

Grafting a clause **sourced from PDR-058** onto a rule whose **charter is PDR-029**
(`plan-body-first-principles-check`, Family-A tripwire) made PDR-029's hard-coded
*"three-clause check"* spec stale (it says "three-clause" at two spots). A forced
decision's consequences ripple to the *charter* PDR; completing the decision means
fixing the stale spec (minimal Amendment-Log note preserving A.1's historical
three-clause coverage), not leaving the graph half-consistent. Surfaced by
assumptions-expert, **verified real** before acting (grepped PDR-029 — it does
hard-code three). `candidate:` reusable shape — *"when a clause's source PDR ≠ the
host rule's charter PDR, check the charter PDR for a stale count/spec."* (Next
pending-graduations refresh — not written to the register here; Shaded owns it.)

### Reviewers caught real author-misses (counter-instance to over-escalation)

Under edit-load I updated §Consequences **"Enables"** (three→four surfaces) but MISSED
the parallel **"Costs"** bullet (left a stale *"two future passes incl.
outcome-optionality"* — outcome had just graduated). docs-adr-expert caught it.
Lesson: **internal-consistency misses cluster in the symmetric sections you didn't
edit** — after changing a count/status in one place, grep the whole doc for the
parallel statements. `verify-dont-trust` still applied (each finding grounded; the
PDR-029 one needed grounding and held), but this session the reviewers were mostly
RIGHT — a healthy counter to the standing over-escalation prior.

### Preamble must match a newly-added clause's firing moment

Clause 4 fires at *plan/acceptance/status authoring*; the rule preamble said *"before
authoring tests, implementations, or doctrine"* (plan-*execution*). Mismatch → artefact
gravity wins at the **preamble** (the first line a pressured agent reads). When a new
clause widens a rule's firing surface, update the summary line, not just the clause body.

### Convergence: the "rule-vs-clause" fork wasn't actually open

I independently re-derived the enforcement shape (`new-rule-vs-pdr-clause`:
existing-clause > new-rule; + passive-guidance-loses + 80k budget) → PDR-058 clauses +
a clause on the existing always-on rule, no new rule files — the **same** shape the
owner reached via the LTAE lens and Shaded relayed. The classifier applied honestly
*forces* the answer. Reinforces `feedback_no_question_when_answer_is_forced`.

## Session: 2026-05-29 — Group A graduations execution (Veiled Stealing Candle)

### Reflex: I route resolution outward when it belongs in the substrate

Both owner corrections this session were one shape — reaching *outward* (to the
owner, a reviewer, a process) to resolve what belonged *in the substrate*.
(1) Surfaced a doctrine-doubt to the owner as a "your call" nuance — but
surfacing changes no future agent's behaviour; the doubt was a missing sentence
in the artefact (cure: "foundational standing attaches to the signal, not a
quota"). (2) Saw test files in an unchecked dir, felt "a gap to fix" — nearly
widened the vitest globs / spun a reviewer — but the absence was deliberate
strategy (forcing function: complexity needing tests → promote to `src/`).
Tripwire before reaching out: *does this belong in the substrate? is this absence
intentional, not a gap?* Homed: ADR-168 §5, PDR-011 §subjective-experience,
`feedback_resolve_design_doubts_in_substrate`. Two-instance (Wooded hit the
scripts one too) → graduated, not just noted.

### Tooling: Bash grep/sed/cat does NOT satisfy the Edit read-state — only Read does

Editing a file inspected only via Bash fails "File has not been read yet". Read
(tool) it first. Hit 3× this session (test file, thread record, ADR-168).
(PDR-060: tooling friction is first-class feedback.)

## Session: 2026-05-29 — D0 Lane C4 external-data validator (Wooded Creeping Thicket)

+ **`scripts/` is the deliberate no-checks zone (owner directive).** Confirmed:
  `agent-tools/scripts/**` is excluded from tsconfig include, eslint (`ignores`),
  AND vitest include — so its `*.unit.test.ts` files never type-check, lint, or
  run. Owner's principle: code important enough to warrant checks BY DEFINITION
  belongs in a permanent home (`src/`), not `scripts/`. I had started to extend
  the vitest include to cover `scripts/` (wrong — that imposes checks on the
  no-check zone); the cure was to put the validator in `src/` instead. → memory
  [[feedback_scripts_dir_is_no_checks_zone]]; distilled/PDR candidate.
+ **Latent finding (flag, not fix here):** the existing `scripts/` validators
  (`validate-no-stale-script-invocations`, `validate-portability`,
  `validate-subagents`, `validate-fitness-vocabulary`) ship `*.unit.test.ts`
  helper tests that NEVER run (scripts/ excluded from vitest). By the owner's
  principle they are mis-placed — a separate cleanup (move logic to `src/`).
+ **typescript as a runtime LIBRARY ≠ devtool.** A module that imports + *calls*
  the TS compiler API at runtime (the AST contract checker) needs `typescript`
  in `dependencies`, not `devDependencies` — categorically different from
  typescript-as-compiler (the monorepo-wide devDep convention). Moved it +
  `pnpm install --lockfile-only` (clean 3/3 diff).
+ **test-expert over-escalation rejected (worked instance).** It flagged the
  DI-fake fs-walk discovery test as needing `.integration.test.ts`. Grounded
  against doctrine (`testing-strategy.md:41` + immediate-fail #20 key on
  *touching real IO*) + the committed precedent `paths.unit.test.ts` (identical
  in-memory-fake fs-walk, named `.unit.test.ts`). Injected in-memory fake = no
  real IO = unit. Kept `.unit.test.ts`. [[feedback_validate_specialist_findings_before_acting]]
+ **Idiom wins:** bin entries follow `codex-reviewer-resolve.ts` (`repoRoot()`,
  `writeLine`/`writeErrorLine`, `isDirectExecution` guard); testable discovery
  follows `paths.ts` (DI-injected fs). Lint standards: named TS imports (no
  `import * as`), `readonly T[]` not `ReadonlyArray<T>`, type-guard not `as`,
  complexity ≤8 / max-lines ≤250.

### Commit + handoff-phase insights (added at session close)

+ **For a file near `max-lines`, run prettier FIRST, then measure.** I trimmed
  `external-data-contract.ts` to exactly 250, then prettier's wrapping pushed it
  back to 258 — prettier ADDS lines by wrapping long expressions, so trimming
  against the pre-prettier count measures the wrong number. Order: prettier → wc
  → trim → prettier → wc. Cost a full failed-commit cycle.
+ **The spaced-"+" MD004 trap is a whole-file landmine, and the existing napkin
  warning did not save me.** I wrote a spaced plus as a conjunction in prose
  ("contract (...) (plus) DI-injected discovery"); it wrapped so a line began
  with the plus-marker, markdownlint read it as the file's FIRST unordered-list
  bullet, flipped the file's expected `ul-style` to plus, and 94 legitimate
  historical dash bullets then failed MD004. One stray plus-at-line-start → 94
  errors across the file's history. Knowing the documented trap (Sunlit's entry
  below) did NOT immunise me — same shape as "knowing the anti-pattern doesn't
  prevent re-enacting it" (Woodland). Durable cure: **never use a spaced plus as
  a conjunction in authored markdown** — write "and"/"plus" the word. The
  keep-it-off-line-starts advice is too weak: wrap position is non-deterministic
  across edits.
+ **Owner doctrine clarification (supersedes the prior gatekeeper discipline):**
  memory/state files (napkin, repo-continuity, active-claims, closed-claims,
  thread records) are touched by all sessions and will ALWAYS be mingled — so
  **anyone can commit them at any time, to avoid logjams.** This relaxes Kilned's
  earlier "leave co-mingled shared surfaces UNSTAGED for the gatekeeper" note:
  don't leave them dirty waiting for coordination; commit additively. Substantive
  in-progress PDR/ADR/SKILL edits are NOT in this class — those still land as the
  authoring session's coherent unit.

## Session: 2026-05-29 — pending-graduations decision-packet execution (Tempestuous Vaulting Falcon)

### Insight (generative metacognition) — verification bias must be asymmetric

"Verify the auditor" is now **3-deep**: Leafy's report (~50% wrong) → Sunlit's
ledger caught Leafy yet was **~83% wrong on its OWN Group C "withdraw" verdicts**
(15 of 18 named homes did not contain the substance) → my re-verification caught
Sunlit. The structural cure is NOT "verify harder each time" — it is **asymmetric
bias**: coverage-claims recur as false-positives at every audit layer, so the
*irreversible* action (withdrawal = permanent signal loss) must carry
proof-of-coverage, while the *reversible* action (keep = costs only buffer space)
is the safe default. The prior ledgers failed because they treated *withdrawal*
as the disposition to justify rather than *keeping*. Graduation candidate (3
instances). Verdicts: [[curator-passes/2026-05-29-tempestuous-vaulting-falcon]].

### Session facts + corrections

+ Group C re-verified by an 18-agent adversarial workflow (Sonnet, refute-biased,
  default-keep): **15 keep, 3 withdraw**. Group A queued as a parallel-lane plan;
  two ledger home-recs corrected during independent re-grounding (#37 → PDR-058
  sequencing-optionality, not `no-moving-targets` — a category error; #22+23 →
  PDR-058 Surface 3, which PDR-058 pre-architected).
+ **stale-claim 4th instance = missing autonomy primitive.** Owner-flagged; the
  only reap point is consolidation-gated (no session-open reap), so expired claims
  linger. Recorded on the claim-liveness plan. The cure is liveness-bound reaping,
  NOT a checklist step (the checklist is what keeps failing).
  [[feedback_owner_action_is_not_a_cure]]
+ **self-correction:** I over-circled the commit/parallel-track decision after the
  rules already forced it (stage-by-pathspec; no bypass; surface-if-gate-fails).
  Reach rule-determined verdicts faster.
+ **buffer pressure:** this napkin is at/over its line limit — route to rotation at
  the next consolidation (the Group A execution session), do not trim.

## Session: 2026-05-29 — D0 quality-signal grounding (Deciduous Climbing Root)

### Correction absorbed (owner; retrospective metacognition)

+ **The "never exclude a path" escape-hatch screen has a real, documented
  exception I over-generalised past.** I had classed the PR #122 duplication
  (all 3.9% in `graph-corpus-sdk/src/eef-strands/eef-toolkit.ts`) as "must
  de-duplicate; a Sonar exclusion is suppress-the-signal — forbidden." Owner
  corrected: that file is an **external-source data snapshot** (EEF Teaching &
  Learning Toolkit — the module docstring confirms: "repository-held canonical
  snapshot", typed `unknown` as external input, regenerated from a reviewed
  replacement). For faithful external/generated DATA, de-duplicating destroys
  1:1 fidelity to the source (which IS the value), so **accepting the
  duplication via a targeted, documented `sonar.cpd.exclusions` glob is the
  correct disposition — and it is owner-gated, not mine to enact.**
+ **The discriminator (the durable bit):** the escape-hatch screen governs
  *our hand-maintained code* (→ fix it). For *faithful external/generated
  data*, copy-paste detection is semantically mis-applied; the repo's own
  `docs/governance/sonar-disposition-policy.md` §Duplications already documents
  this class (cpd.exclusions for `**/src/types/generated/**`, tests, config)
  with a three-step Expansion Discipline: **policy amendment → owner
  authorisation → properties update**. Precedent: an owner-authorised
  `api-schema/**` exception (2026-05-24), recorded "this is not typically
  allowed, this is a specific user intervention."
+ **My process gap:** I did not establish *provenance* before classifying the
  cure space. Check "is this our code, or external/generated data?" FIRST — it
  decides whether the signal is a defect (fix) or a mis-applied metric
  (owner-gated disposition). distilled.md candidate: add this discriminator to
  the escape-hatch screen entry.

### Right-sizing win

+ Grounding before orchestrating collapsed the judgment-load. I was about to
  fan out a 6-agent pre-execution review workflow over the D0 signals. Once
  grounded: Lane B (PATH hotspot) is a documented-class SAFE per policy §S4036
  (agent-tooling + `git` + dev-workstation — exact match, no expert needed);
  Lane C (duplication) is an owner-gated cpd-exclusion proposal (no code
  change); only Lane A (generator S7763) is a real edit. Net: no fan-out
  warranted, a gateway review at the end suffices. Proportionality beat the
  ultracode "always workflow" default *because the work was already
  verified/trivial post-grounding*.

### Candidate + session surprises

+ **candidate (PDR/pattern):** the **external-data file convention**
  (`*.external-data.ts` + a cpd-exclusion glob pattern + the workspace ESLint
  code-quality ignore + an enforced contract via a repo-validator) is a portable
  Practice-governance shape worth a PDR (`pdr_kind: pattern`/`governance`).
  Captured here for the next pending-graduations register refresh — NOT written
  to the register directly, `Tempestuous Vaulting Falcon` holds it this window.
  Source: this session + `docs/governance/sonar-disposition-policy.md`
  §Duplications.
+ **distilled candidate:** refine the escape-hatch-screen entry in `distilled.md`
  with the discriminator above (our code → fix; faithful external/generated data
  → owner-gated documented disposition). Deferred to consolidation.
+ **surprise — concurrent same-tree agent, mutually coordinated.**
  `Tempestuous Vaulting Falcon` (`441c78`) registered on
  `agentic-engineering-enhancements` mid-session and `archive-stale`-reaped the
  dead Sunlit claim; its claim intent explicitly defers the PDR README index to
  me. Two sole-contributor sessions in one tree, disjoint areas, additive
  shared-surface edits — not a team (session-handoff is explicit on this). Owner
  flagged the lingering Sunlit claim as the 4th `owner-action-is-not-a-cure`
  instance (session-open claim reaping is the missing primitive).
+ **operational tic (recurring this session ~3×):** `rg -rn` / `rg -rln` — `-r`
  is `--replace`, which corrupts grep *display* by substituting matched text
  (the file is fine). Use `rg -n` WITHOUT `-r`.

## Session: 2026-05-28 — pending-graduations drain after a crash (Sunlit Waxing Moon)

### Process insights (reusable — for future drain / consolidation sessions)

+ **A read-only verification sub-agent's report can be substantially unreliable.**
  Leafy left a 51-item "is X already covered?" report as my evidence base. In 6
  direct spot-checks, ~3 verdicts were wrong: false-negatives on items 2 and 33
  (the sub-agent searched the wrong file / a different phrasing and reported "not
  found" when the substance existed), plus a mischaracterisation on item 1. This
  is distinct from the known "specialists over-escalate severity" failure
  (`feedback_validate_specialist_findings_before_acting`): it is *factual
  false-negatives in a search/verification report*. Lesson: never mass-act on a
  verification sub-agent's findings; for any irreversible disposition, re-verify
  against the repo yourself. Verify the auditor, not just the audited.
+ **Draining an owner-gated register does NOT mean emptying it.** When the items
  are owner-reserved forks ("promote / merge / watch / withdraw"), "drain" means
  evaluate each on substance, attach a sharp verdict, and correct integrity
  issues; the removal itself is owner ratification. Producing verdicts is the
  deliverable; mass-removing on a flawed base would be the error. Contrast the
  prior Sylvan pass, which declared this same register "complete, preserve-all"
  without per-item substance eval — the owner overrode that. The cure is
  substance-eval, neither emptying nor blanket-preserving.
+ **The register text was honest; the report auditing it was wrong.** My initial
  premise (inherited from the report) that the register asserted ~15 false
  "already covered" claims was itself false — the register entries are hedged
  candidates and targets. The integrity defect lived in the report, plus one
  dangling reference in a pattern (`reciprocal-cross-agent-reviewer-dispatch.md`
  line 248 cites a non-existent home).
+ **Crash-safe execution under the compaction-bug risk.** The per-item verdict
  ledger (a durable on-disk artefact) is the real deliverable and survives a
  crash regardless of commit; commit in small batches. Files on disk survive a
  session-context crash — committing is for sharing/history, not file-survival —
  so a handoff loses nothing while the continuity substrate is the source of
  truth.
+ **Operational tic.** markdownlint MD004 fires when prose containing a spaced
  plus-sign wraps so a line *starts* with "plus-space" (read as a list marker).
  Hit it twice this session. Reword to "and", or keep plus-signs off line-starts
  in wrapped prose.

### Coordination note

Leafy Regrowing Sapling (3c02b9) crashed ~14:00Z with its claim still reading
"fresh" by the freshness metric — a dead-but-metric-fresh claim that freshness
alone would not surface. Superseded it actively (close plus comms event), not via
archive-stale. The crash-investigator session (Kilned Brazing Bellows) is
generalising exactly this gap into a `claim-liveness-crash-reconciliation`
plan under `plans/agent-tooling/future/` (uncommitted, Kilned's) — the right
substrate response.

## Session: 2026-05-28 — diagnosing a peer's stuck `/compact` (Kilned Brazing Bellows)

### What works / what bit me

+ **Forensic technique for a stuck Claude Code session**: locate the peer's
  session by `session_id_prefix` in `active-claims.json` → its `.jsonl` under
  `~/.claude/projects/<project>/`; reconstruct the *role-merged* logical message
  array (the API view) with jq, since each assistant content block is persisted
  as its own JSONL line and merged only at request-assembly time. Sub-agent
  transcripts live in `<session>/subagents/agent-*.jsonl` (+ `.meta.json`).
+ **Tooling mistake (false alarm)**: `echo "$rest" | jq` inside a `while read`
  loop mangled JSON escapes and produced phantom "control character / invalid
  JSON" errors. The file was clean. Use `printf '%s'` or feed jq the file
  directly; never `echo "$var" | jq` for transcript records.
+ **Root cause of "thinking blocks in the latest assistant message cannot be
  modified" during compaction**: known CC bug (canonical issue
  anthropics/claude-code#12311, "Auto-compact fails with Opus extended thinking
  blocks"). CC persists thinking blocks with empty text + retained signature
  (normal — confirmed identical in healthy sessions); the compaction request
  replays them in the latest-assistant-message position and the API rejects the
  mismatch. The on-disk transcript is NOT corrupt — `messages.N.content.M` indexes
  a runtime-assembled array, not any persisted record. Partially fixed in 2.0.67;
  long tail remains (owner hit it on 2.1.153, heavy extended-thinking agent runs).
+ **Workaround (official)**: `/model` → Sonnet, then `/compact`, then `/model`
  back to Opus. Run BEFORE the session crashes. Robust alternative: don't rely on
  `/compact` for long thinking-heavy sessions — use handoff + fresh session
  (repo continuity substrate is the source of truth, so no work is lost).

### Correction I had to absorb (verify-dont-trust applies to CAUSATION too)

+ I told the owner the crashed sub-agent writing its report to disk *validated*
  the durable-artefact doctrine working autonomously. WRONG: the owner had gone
  into the sub-agent's session and explicitly asked it to write the report. So it
  was **another owner-action-is-not-a-cure instance**, not the system self-saving.
  Lesson: when a good outcome appears, verify *whether it was autonomous or
  owner-induced* before crediting the system — mis-attributing causation is a
  verify-dont-trust failure, not just mis-stating a fact. Links
  [[feedback_owner_action_is_not_a_cure]], [[feedback_validate_specialist_findings_before_acting]].
+ The good idea that survives the correction (owner: "seems like a good idea in
  general"): sub-agents should write durable intermediate artefacts to disk *as
  they go, autonomously* — a sub-agent returns only a summary to its parent, so
  its working context is the most crash-fragile in the system. Captured as a
  candidate in the new agent-tooling plan (see below), not as existing doctrine.

### Verified mechanism refinement (claim liveness)

+ Claims DO carry optional `heartbeat_at`; `isClaimStale` = `(heartbeat_at ??
  claimed_at) + freshness_seconds < now`. The gap is not "TTL-only" but "the
  heartbeat writer is manual — nothing auto-heartbeats a live agent and nothing
  detects a dead one," so a crashed agent looks alive for up to its full TTL
  (default 14400s). `comms-watch-liveness-floor.plan.md` names this conflation
  and defers the claim side as an explicit non-goal.
+ Insights recorded durably in
  `.agent/plans/agent-tooling/future/claim-liveness-crash-reconciliation-and-session-forensics.plan.md`;
  compaction bug report in `.agent/reports/`.

### Closeout insights (concurrent-agent tree + a commit-message gotcha)

+ **Two overlapping sole-contributor sessions are NOT a team.** Sunlit Waxing
  Moon ran a dedicated pending-graduations drain concurrently in the same working
  tree. session-handoff is explicit: a peer's mere presence does not make it a
  team. The discipline that worked: collision-read `active-claims` (disjoint areas
  confirmed); every edit to a SHARED continuity surface (napkin, distilled,
  repo-continuity, thread record) was ADDITIVE — new identity row, new
  session-outcome entry, appended summary cell — so it never clobbered the peer's
  concurrent writes (which raced my napkin Edit once, exactly as predicted);
  committed ONLY my disjoint files by explicit pathspec; left the co-mingled
  shared surfaces + the peer's experience file UNSTAGED for the gatekeeper.
  ADR/PDR-candidate capture went into plans, not the peer's claimed
  `pending-graduations.md` / `open-questions.md`.
+ **The repo pre-commit hook is NOT `pnpm check`.** It runs prettier/markdownlint
  on STAGED files only, plus repo-validators, shell-lint, and turbo
  type-check/lint/test (cached). So "commit but don't run pnpm check" is satisfied
  by a normal commit — no `--no-verify` needed (and none was used). The separate
  `pnpm check` aggregate (e2e/a11y/widget/fitness) is the closeout gate that was
  waived.
+ **Commit-message gotcha**: `@commitlint/config-conventional` parses `#NNN`
  tokens in the body (`claude-code#12311`, `non-goal #3`, `#18/#19/#20`) as
  issue-reference footers, which trips `footer-leading-blank` when a real trailer
  (`Co-Authored-By`) follows. Cure: keep `#NNN` out of the commit body ("issue
  12311", "non-goal 3"). Caught pre-commit by
  `pnpm agent-tools:check-commit-message -F`; honoured no-warning-toleration.
+ **The hedging correction (owner, twice this session)** is graduated to
  `distilled.md` — "a forced conclusion is executed, not offered; deference can be
  a hedge." A determination I was asked to make, then offered to act on, is
  responsibility-passback; misusing `feedback_feature_shaping_is_owner_decision`
  as cover for not finishing is the specific trap.

## Session: 2026-05-28 (closeout) — worked examples dissolve abstract design forks (Woodland Swaying Pollen)

### Patterns to Remember

+ **When a design fork stalls in the abstract, pull the concrete numbers — don't
  argue harder.** The EEF "one axis or two" question (membership-only full nodes
  vs graded disclosure) circled in trade-off reasoning until one measured FACT
  ended it: the whole 30-strand corpus is ~21k tokens, under the ~25k agent
  ceiling, so full nodes always fit and graded disclosure earns nothing here.
  The abstract debate collapsed the instant the real corpus + a token count were
  in front of me. This is exactly the owner's "resolve by worked examples on the
  real corpus, not the rule in the abstract." Reusable: a stalled design fork is
  a signal to get the real data, not to deliberate harder.
+ **Closeout note**: the escape-hatch generative screen now lives in
  `distilled.md` (always-loaded) as a pre-output filter, not a retrospective
  catalogue. `distilled.md` went SOFT (122/120 lines) — correct
  knowledge-preservation, routed to the next dedicated curation, never trimmed.

## Session: 2026-05-28 (later) — escape-hatch process re-enacts F (Woodland Swaying Pollen)

### Correction absorbed (retrospective metacognition)

+ **Owner caught two moves in one planning session**: (1) I posed a *forced*
  conclusion (full nodes — my own worked examples showed graded disclosure isn't
  a helpful lever, whole corpus < ceiling) as a balanced A/B menu instead of
  stating the verdict; (2) I re-imported deferral ("gate-1b later", "D6-gated
  fast-follow", "consolidate-at-third-consumer defers it") when the explicit goal
  was to *remove* the 1a/1b deferral framing — the owner had made ZERO deferral
  decisions.
+ **The pattern (the durable bit)**: both — plus a near-miss "rank the broad
  result down to N" (sort-plus-slice, a list-op) — share one root: **F's
  *process***. F shipped stubs + lateral workarounds + the gate-split, all ways
  to dodge the complete build. I had internalised the foundation's *content*
  (graph≠list, no stubs) while still running F's *process* (dodge the complete
  commitment via an escape hatch). Knowing the anti-pattern did not immunise me
  from re-enacting its shape.
+ **Behaviour change**: the tell is **the reach for an exit** — "defer", "let the
  owner pick", "rank it down" — not the vocabulary. When I reach for one, treat
  it as a flag that a complete commitment is available and I'm flinching. Check,
  then make it. Deferral is an owner decision, never my silent default; a forced
  conclusion is stated, not offered as a menu.
+ **Source plane**: `doctrine` (agent practice). Also landed in the graph-tooling
  foundation §9 as a named anti-pattern.

## Session: 2026-05-28 — napkin rotation (Sylvan Whispering Fern)

Rotated the 2026-05-27/28 napkin (was HARD: 408 lines / 19558 chars) during a
`consolidate-until-done` dedicated-knowledge-curation pass. The processed source
is archived verbatim in the [companion archive][archive].

Behaviour-changing lessons graduated to `distilled.md`:

+ `tail -F | grep` watchers re-emit their whole history on file rewrite — use a
  dedup poll (two instances).
+ Read git merge/divergence risk from content (`git diff HEAD origin/<branch>`),
  not a raw `HEAD..origin` name-status diff.
+ Generated adapters are never hand-written — fix the generator, don't stub
  (owner-corrected).
+ Treat session-opener fitness as stale until you rerun it this session.

The remaining 2026-05-27/28 entries were duplicates of existing rules, skills,
`distilled.md`, or permanent homes (`replace-dont-bridge` + the
`routing-legacy-fallback-sunset` plan; consolidate-docs mode contract;
supersession-refreshes-continuity; collaboration-state-is-source;
`verify-dont-trust`; `register-active-areas`; proportionate-exploration in
per-user memory + `pending-graduations.md`). They are preserved in the archive,
not lifted. Item-level disposition ledger: [curator pass][ledger].

## Session: 2026-05-28 — consolidate-until-done: held commits (Sylvan)

A stale 0-byte `.git/index.lock` (held by Cursor's `gitWorker.js` / GitLens, not
an agent — confirmed via `ps` + solo session, no claims) blocked the commit
index. Diagnosed read-only, surfaced to the owner per the lock rules; owner chose
HOLD. Behaviour: in Cursor-concurrent sessions a 0-byte index.lock can persist
from IDE git integrations — diagnose by age + `ps` (IDE vs agent) and surface,
never autonomously remove. Goal-state: `consolidate-until-done` is substantively
complete (strict-hard green; buffers dispositioned; ledger written); the only
outstanding act is the owner-deferred commit of the working-tree bundle.

[archive]: archive/napkin-2026-05-28-sylvan-curation.md
[ledger]: ../operational/curator-passes/2026-05-28-sylvan-whispering-fern.md

## Session: 2026-05-29 — raw-input extraction pass (Highland Rising Squall)

Owner-directed `consolidate-until-done` scoped to **raw-input extraction**
(Shaded owns pending-graduations; comms preserved, not rotated; fitness pulled
to another session mid-pass). Mined all platform memories (.remember 29 dailies,
Codex, Cursor), N=17 rotated napkins (≥05-14, the since-05-13-marker window), and
21 recent experience files via an 8-agent workflow. Output:
`historical-napkin-synthesis-2026-05-29.md` + 8 distilled entries + a ~22-item
graduation handoff to Shaded. Ledger:
`curator-passes/2026-05-29-highland-rising-squall.md`.

### What worked / what bit me

+ **Fan-out → synthesise → critique was the right shape for a read-heavy curation
  backlog.** 6 Sonnet corpus extractors (quota-respecting — no peer Opus seats) →
  1 synthesis → 1 completeness critic. The critic earned its seat: it caught 5
  "already-homed/already-shipped" false positives the synthesis asserted as novel.
  I verified all 5 against the live repo before acting (grep PDR-014, PDR-038,
  PDR-085, the comms CLI source) — verify-the-auditor recurses, and dropping a
  captured lesson is the irreversible action, so coverage must be *proven*.
+ **The comms all-channels watcher flooded on first arm.** The watcher-rule
  reference invocation greps `^\[`, which matches the `[routing-legacy-fallback]`
  diagnostic that re-emits every poll (un-sunset PDR-076a). Cure: positive
  channel-tag filter `^\[(BROADCAST|GROUP|DIRECTED|OBSERVED|LIFECYCLE)\]`. The
  routing-legacy-fallback-sunset plan exists in `future/`; its promotion trigger
  (b) "noise blocks a team session" has now fired a 2nd time. Owner assigned a
  separate agent to the emitter-side sunset. (Shaded independently captured the
  same flood — convergent discovery.)
+ **`comms inbox` / `claims open` silent-reject on a missing required flag** — hit
  live; → agent-tools fail-loud candidate handed to Shaded.
+ **The corpus's deepest finding and the through-line of this window:** *behaviour
  follows the artefact, not the intention.* Rules don't self-install (declarative
  ≠ procedural inhibition); substrate encodes outcome; enforcement debt; a cron
  template can override owner direction; a watcher *reference invocation* shaped a
  flood. Route resolution **inward and downward into the substrate**, not outward
  to chat. Distilled as two entries; handed to Shaded as two PDR candidates.
+ **Thinning subjective register is real and cross-corpus** (.remember + experience
  both thin post-05-14) — the PDR-011/ADR-150 capture-edge degradation signal,
  surfaced as loop-health, not a null. Counter-evidence it can still fire:
  `2026-05-29-substrate-not-surface` is a genuine high-register reflection.
+ **Scope held against drift.** Owner pulled fitness mid-pass → I stopped letting
  HARD/limit shape what I captured, preserved everything at full weight, and
  deferred the mechanical napkin rotation to the fitness session rather than
  treating rotation as mine.

## Shaded Prowling Threshold closeout (2026-05-29) — added under owner direction; NAPKIN IS CRITICAL (508 lines, hard 300 / critical 450) → the fitness session must rotate, not trim

+ **Reported a watcher "live" before any event verified it delivered.** Armed the
  comms monitor per the canonical rule, fixed a flood, re-armed it, and told the owner
  it was watching — it was dead, silently dropping every reply into the seen-file. Owner
  caught it, I hadn't. "I followed the invocation" quietly became "it works" with no
  observation in between. Rule next time: a watcher is not "live" until an event is
  observed *through* it; otherwise report "armed, not yet verified."
+ **The monitor seen-file advances past grep-dropped events → a filter mismatch
  silently and PERMANENTLY loses events.** The `comms watch` consumer marks events seen
  even when the downstream grep drops them, so a wrong/broad filter doesn't just hide
  events — it consumes them. Cure: `2>/dev/null` + narrow channel-token grep; verify the
  filter against the real render format before trusting it. (Failure-mode `d9ab3ec7`.)
+ **A completed, disjoint lane must self-commit — never park its output pending another
  lane's commit.** Highland's handoff asked "did Shaded's WS-Z commit fold in my 2 files?"
  — but no WS-Z commit existed (it was parked) and those files were never in WS-Z's bundle
  anyway. False coupling. A finished disjoint lane's clean move is `git add <pathspec>` +
  commit its own output, not a dependency on someone else's uncertain commit.
+ **Handoff openers that ASSERT volatile state ship stale/wrong facts.** One opener stated
  napkin "~470 HARD" (actual 508 CRITICAL), "Shaded's WS-Z commit" (never happened), and a
  temp-dir file to "recover" (already gone). Openers must POINT to the record and say
  "re-ground," not assert volatile values — every asserted number/commit-state was wrong on
  check. (`threads/README`: openers are pointers, not volatile truth.)
+ **The lost temp-dir file is the worked instance that proves the boundary rules (owner,
  2026-05-29).** An outline needed for a substrate-pointer PDR elevation lived only in
  ephemeral temp storage and is now gone — temp files vanish, that is their nature. This is
  exactly why the boundary rules exist, and the loss is the cost of ignoring them. The two
  strict rules (restated by owner): **(1) no Practice Core content may reference anything
  outside Practice Core** (`practice-core-portability`); **(2) no repo content may reference
  any file path outside the repo** (`no-machine-local-paths`) — web addresses ARE fine
  because they stay accessible. Corollary for our own work: never let a durable artefact
  (PDR, ADR, thread record, opener, handoff) depend on a temp/abs/external path, and never
  stage important state in temp dirs (`important-state-not-in-temp-files`); write it to a
  durable in-repo home immediately or it is a loss waiting to happen. Worked instance, not a
  new rule — reinforces the three existing surfaces above.

## Quiet Hiding Hush closeout (2026-05-29) — EEF D0 complete + PR #122 merged; NAPKIN STILL CRITICAL (632 lines) → fitness session must rotate, not trim

+ **A feature flag must gate EVERY surface that enumerates the feature, not just
  the invokable one.** EEF was co-gated behind `OAK_CURRICULUM_MCP_EEF_ENABLED` and
  I'd "proven" it: MCP `tools/list`/`prompts/list` correctly omit EEF when OFF. But
  the public landing page (`/`) listed the EEF tool+prompt names+descriptions
  unconditionally — the renderers iterated the full SDK set with no flag awareness.
  The MCP surface was sealed; the *advertising* surface leaked the dormant feature.
  "Flag-gated" silently meant "flag-gated on the surface I checked." Cure that holds:
  a single source of truth for the gated-surface names (`eef-surface.ts`) consumed by
  BOTH registration and the landing page, so they cannot drift. Next time I gate a
  feature: enumerate ALL surfaces that name it (protocol, HTML/landing, docs,
  discovery) and gate them from one source. (`candidate:` flag-gating-covers-all-surfaces.)
+ **Registration/integration-level proof is NOT runtime-env-resolution proof.** The
  e2e suite proves co-gating by *injecting* `runtimeConfig.eefEnabled` — it bypasses
  the real `env → toBooleanFlag(OAK_CURRICULUM_MCP_EEF_ENABLED) → runtimeConfig` path
  that actually ships. The owner raised the bar: "QG green + review is necessary but
  not sufficient — prove the server is fully functional, with and without the flag."
  The faithful proof was booting the REAL server (`prod:harness`, which runs
  `loadRuntimeConfig({processEnv})`) in both flag states and probing live. For a
  feature that ships dark behind an env flag, prove the real env path, not just the
  injected-config test.
+ **On a shared branch, the local HEAD can move between `git status` and `git push`.**
  I grounded HEAD, then pushed "8 commits" — the push reported 11. Parallel agents had
  committed their WIP in the interval. Benign here (peer-committed, gate-green), but
  the lesson is verify-don't-trust *at the push moment*: the pushed range is the
  authority, not the HEAD you grounded earlier. Re-read HEAD immediately before push on
  a shared branch and reconcile the range.
+ **The Vercel MCP plugin has no env-var tool — re-auth does not add one.** `get_project`
  returns project/domain/deployment metadata but no env data, and the plugin's whole
  toolset is project/deployment/logs/toolbar/docs. When asked to confirm a production
  env var I burned a cycle re-checking after a re-auth; the gap is a missing *capability*,
  not missing auth. Env-var confirmation is owner-side (dashboard) unless the CLI session
  has the owning team scope (mine had only a personal team). Don't re-auth to summon a
  tool that isn't in the plugin.
+ **Specialist agentTypes + a forced `schema` in a Workflow fail to emit StructuredOutput.**
  My first merge-readiness workflow failed: type/test/architecture/code-expert produced
  full narrative reviews but never called the forced StructuredOutput tool (they're tuned
  for prose). Cure that worked: a two-step pipeline — specialist agentType (narrative, no
  schema) → a cheap generic extractor agent (schema) that structures the narrative. Use
  the two-step whenever combining a narrative-tuned specialist with structured output.
