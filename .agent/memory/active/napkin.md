---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-29 — D0 Lane C4 external-data validator (Wooded Creeping Thicket)

- **`scripts/` is the deliberate no-checks zone (owner directive).** Confirmed:
  `agent-tools/scripts/**` is excluded from tsconfig include, eslint (`ignores`),
  AND vitest include — so its `*.unit.test.ts` files never type-check, lint, or
  run. Owner's principle: code important enough to warrant checks BY DEFINITION
  belongs in a permanent home (`src/`), not `scripts/`. I had started to extend
  the vitest include to cover `scripts/` (wrong — that imposes checks on the
  no-check zone); the cure was to put the validator in `src/` instead. → memory
  [[feedback_scripts_dir_is_no_checks_zone]]; distilled/PDR candidate.
- **Latent finding (flag, not fix here):** the existing `scripts/` validators
  (`validate-no-stale-script-invocations`, `validate-portability`,
  `validate-subagents`, `validate-fitness-vocabulary`) ship `*.unit.test.ts`
  helper tests that NEVER run (scripts/ excluded from vitest). By the owner's
  principle they are mis-placed — a separate cleanup (move logic to `src/`).
- **typescript as a runtime LIBRARY ≠ devtool.** A module that imports + *calls*
  the TS compiler API at runtime (the AST contract checker) needs `typescript`
  in `dependencies`, not `devDependencies` — categorically different from
  typescript-as-compiler (the monorepo-wide devDep convention). Moved it +
  `pnpm install --lockfile-only` (clean 3/3 diff).
- **test-expert over-escalation rejected (worked instance).** It flagged the
  DI-fake fs-walk discovery test as needing `.integration.test.ts`. Grounded
  against doctrine (`testing-strategy.md:41` + immediate-fail #20 key on
  *touching real IO*) + the committed precedent `paths.unit.test.ts` (identical
  in-memory-fake fs-walk, named `.unit.test.ts`). Injected in-memory fake = no
  real IO = unit. Kept `.unit.test.ts`. [[feedback_validate_specialist_findings_before_acting]]
- **Idiom wins:** bin entries follow `codex-reviewer-resolve.ts` (`repoRoot()`,
  `writeLine`/`writeErrorLine`, `isDirectExecution` guard); testable discovery
  follows `paths.ts` (DI-injected fs). Lint standards: named TS imports (no
  `import * as`), `readonly T[]` not `ReadonlyArray<T>`, type-guard not `as`,
  complexity ≤8 / max-lines ≤250.

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

- Group C re-verified by an 18-agent adversarial workflow (Sonnet, refute-biased,
  default-keep): **15 keep, 3 withdraw**. Group A queued as a parallel-lane plan;
  two ledger home-recs corrected during independent re-grounding (#37 → PDR-058
  sequencing-optionality, not `no-moving-targets` — a category error; #22+23 →
  PDR-058 Surface 3, which PDR-058 pre-architected).
- **stale-claim 4th instance = missing autonomy primitive.** Owner-flagged; the
  only reap point is consolidation-gated (no session-open reap), so expired claims
  linger. Recorded on the claim-liveness plan. The cure is liveness-bound reaping,
  NOT a checklist step (the checklist is what keeps failing).
  [[feedback_owner_action_is_not_a_cure]]
- **self-correction:** I over-circled the commit/parallel-track decision after the
  rules already forced it (stage-by-pathspec; no bypass; surface-if-gate-fails).
  Reach rule-determined verdicts faster.
- **buffer pressure:** this napkin is at/over its line limit — route to rotation at
  the next consolidation (the Group A execution session), do not trim.

## Session: 2026-05-29 — D0 quality-signal grounding (Deciduous Climbing Root)

### Correction absorbed (owner; retrospective metacognition)

- **The "never exclude a path" escape-hatch screen has a real, documented
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
- **The discriminator (the durable bit):** the escape-hatch screen governs
  *our hand-maintained code* (→ fix it). For *faithful external/generated
  data*, copy-paste detection is semantically mis-applied; the repo's own
  `docs/governance/sonar-disposition-policy.md` §Duplications already documents
  this class (cpd.exclusions for `**/src/types/generated/**`, tests, config)
  with a three-step Expansion Discipline: **policy amendment → owner
  authorisation → properties update**. Precedent: an owner-authorised
  `api-schema/**` exception (2026-05-24), recorded "this is not typically
  allowed, this is a specific user intervention."
- **My process gap:** I did not establish *provenance* before classifying the
  cure space. Check "is this our code, or external/generated data?" FIRST — it
  decides whether the signal is a defect (fix) or a mis-applied metric
  (owner-gated disposition). distilled.md candidate: add this discriminator to
  the escape-hatch screen entry.

### Right-sizing win

- Grounding before orchestrating collapsed the judgment-load. I was about to
  fan out a 6-agent pre-execution review workflow over the D0 signals. Once
  grounded: Lane B (PATH hotspot) is a documented-class SAFE per policy §S4036
  (agent-tooling + `git` + dev-workstation — exact match, no expert needed);
  Lane C (duplication) is an owner-gated cpd-exclusion proposal (no code
  change); only Lane A (generator S7763) is a real edit. Net: no fan-out
  warranted, a gateway review at the end suffices. Proportionality beat the
  ultracode "always workflow" default *because the work was already
  verified/trivial post-grounding*.

### Candidate + session surprises

- **candidate (PDR/pattern):** the **external-data file convention**
  (`*.external-data.ts` + a cpd-exclusion glob pattern + the workspace ESLint
  code-quality ignore + an enforced contract via a repo-validator) is a portable
  Practice-governance shape worth a PDR (`pdr_kind: pattern`/`governance`).
  Captured here for the next pending-graduations register refresh — NOT written
  to the register directly, `Tempestuous Vaulting Falcon` holds it this window.
  Source: this session + `docs/governance/sonar-disposition-policy.md`
  §Duplications.
- **distilled candidate:** refine the escape-hatch-screen entry in `distilled.md`
  with the discriminator above (our code → fix; faithful external/generated data
  → owner-gated documented disposition). Deferred to consolidation.
- **surprise — concurrent same-tree agent, mutually coordinated.**
  `Tempestuous Vaulting Falcon` (`441c78`) registered on
  `agentic-engineering-enhancements` mid-session and `archive-stale`-reaped the
  dead Sunlit claim; its claim intent explicitly defers the PDR README index to
  me. Two sole-contributor sessions in one tree, disjoint areas, additive
  shared-surface edits — not a team (session-handoff is explicit on this). Owner
  flagged the lingering Sunlit claim as the 4th `owner-action-is-not-a-cure`
  instance (session-open claim reaping is the missing primitive).
- **operational tic (recurring this session ~3×):** `rg -rn` / `rg -rln` — `-r`
  is `--replace`, which corrupts grep *display* by substituting matched text
  (the file is fine). Use `rg -n` WITHOUT `-r`.

## Session: 2026-05-28 — pending-graduations drain after a crash (Sunlit Waxing Moon)

### Process insights (reusable — for future drain / consolidation sessions)

- **A read-only verification sub-agent's report can be substantially unreliable.**
  Leafy left a 51-item "is X already covered?" report as my evidence base. In 6
  direct spot-checks, ~3 verdicts were wrong: false-negatives on items 2 and 33
  (the sub-agent searched the wrong file / a different phrasing and reported "not
  found" when the substance existed), plus a mischaracterisation on item 1. This
  is distinct from the known "specialists over-escalate severity" failure
  (`feedback_validate_specialist_findings_before_acting`): it is *factual
  false-negatives in a search/verification report*. Lesson: never mass-act on a
  verification sub-agent's findings; for any irreversible disposition, re-verify
  against the repo yourself. Verify the auditor, not just the audited.
- **Draining an owner-gated register does NOT mean emptying it.** When the items
  are owner-reserved forks ("promote / merge / watch / withdraw"), "drain" means
  evaluate each on substance, attach a sharp verdict, and correct integrity
  issues; the removal itself is owner ratification. Producing verdicts is the
  deliverable; mass-removing on a flawed base would be the error. Contrast the
  prior Sylvan pass, which declared this same register "complete, preserve-all"
  without per-item substance eval — the owner overrode that. The cure is
  substance-eval, neither emptying nor blanket-preserving.
- **The register text was honest; the report auditing it was wrong.** My initial
  premise (inherited from the report) that the register asserted ~15 false
  "already covered" claims was itself false — the register entries are hedged
  candidates and targets. The integrity defect lived in the report, plus one
  dangling reference in a pattern (`reciprocal-cross-agent-reviewer-dispatch.md`
  line 248 cites a non-existent home).
- **Crash-safe execution under the compaction-bug risk.** The per-item verdict
  ledger (a durable on-disk artefact) is the real deliverable and survives a
  crash regardless of commit; commit in small batches. Files on disk survive a
  session-context crash — committing is for sharing/history, not file-survival —
  so a handoff loses nothing while the continuity substrate is the source of
  truth.
- **Operational tic.** markdownlint MD004 fires when prose containing a spaced
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

- **Forensic technique for a stuck Claude Code session**: locate the peer's
  session by `session_id_prefix` in `active-claims.json` → its `.jsonl` under
  `~/.claude/projects/<project>/`; reconstruct the *role-merged* logical message
  array (the API view) with jq, since each assistant content block is persisted
  as its own JSONL line and merged only at request-assembly time. Sub-agent
  transcripts live in `<session>/subagents/agent-*.jsonl` (+ `.meta.json`).
- **Tooling mistake (false alarm)**: `echo "$rest" | jq` inside a `while read`
  loop mangled JSON escapes and produced phantom "control character / invalid
  JSON" errors. The file was clean. Use `printf '%s'` or feed jq the file
  directly; never `echo "$var" | jq` for transcript records.
- **Root cause of "thinking blocks in the latest assistant message cannot be
  modified" during compaction**: known CC bug (canonical issue
  anthropics/claude-code#12311, "Auto-compact fails with Opus extended thinking
  blocks"). CC persists thinking blocks with empty text + retained signature
  (normal — confirmed identical in healthy sessions); the compaction request
  replays them in the latest-assistant-message position and the API rejects the
  mismatch. The on-disk transcript is NOT corrupt — `messages.N.content.M` indexes
  a runtime-assembled array, not any persisted record. Partially fixed in 2.0.67;
  long tail remains (owner hit it on 2.1.153, heavy extended-thinking agent runs).
- **Workaround (official)**: `/model` → Sonnet, then `/compact`, then `/model`
  back to Opus. Run BEFORE the session crashes. Robust alternative: don't rely on
  `/compact` for long thinking-heavy sessions — use handoff + fresh session
  (repo continuity substrate is the source of truth, so no work is lost).

### Correction I had to absorb (verify-dont-trust applies to CAUSATION too)

- I told the owner the crashed sub-agent writing its report to disk *validated*
  the durable-artefact doctrine working autonomously. WRONG: the owner had gone
  into the sub-agent's session and explicitly asked it to write the report. So it
  was **another owner-action-is-not-a-cure instance**, not the system self-saving.
  Lesson: when a good outcome appears, verify *whether it was autonomous or
  owner-induced* before crediting the system — mis-attributing causation is a
  verify-dont-trust failure, not just mis-stating a fact. Links
  [[feedback_owner_action_is_not_a_cure]], [[feedback_validate_specialist_findings_before_acting]].
- The good idea that survives the correction (owner: "seems like a good idea in
  general"): sub-agents should write durable intermediate artefacts to disk *as
  they go, autonomously* — a sub-agent returns only a summary to its parent, so
  its working context is the most crash-fragile in the system. Captured as a
  candidate in the new agent-tooling plan (see below), not as existing doctrine.

### Verified mechanism refinement (claim liveness)

- Claims DO carry optional `heartbeat_at`; `isClaimStale` = `(heartbeat_at ??
  claimed_at) + freshness_seconds < now`. The gap is not "TTL-only" but "the
  heartbeat writer is manual — nothing auto-heartbeats a live agent and nothing
  detects a dead one," so a crashed agent looks alive for up to its full TTL
  (default 14400s). `comms-watch-liveness-floor.plan.md` names this conflation
  and defers the claim side as an explicit non-goal.
- Insights recorded durably in
  `.agent/plans/agent-tooling/future/claim-liveness-crash-reconciliation-and-session-forensics.plan.md`;
  compaction bug report in `.agent/reports/`.

### Closeout insights (concurrent-agent tree + a commit-message gotcha)

- **Two overlapping sole-contributor sessions are NOT a team.** Sunlit Waxing
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
- **The repo pre-commit hook is NOT `pnpm check`.** It runs prettier/markdownlint
  on STAGED files only, plus repo-validators, shell-lint, and turbo
  type-check/lint/test (cached). So "commit but don't run pnpm check" is satisfied
  by a normal commit — no `--no-verify` needed (and none was used). The separate
  `pnpm check` aggregate (e2e/a11y/widget/fitness) is the closeout gate that was
  waived.
- **Commit-message gotcha**: `@commitlint/config-conventional` parses `#NNN`
  tokens in the body (`claude-code#12311`, `non-goal #3`, `#18/#19/#20`) as
  issue-reference footers, which trips `footer-leading-blank` when a real trailer
  (`Co-Authored-By`) follows. Cure: keep `#NNN` out of the commit body ("issue
  12311", "non-goal 3"). Caught pre-commit by
  `pnpm agent-tools:check-commit-message -F`; honoured no-warning-toleration.
- **The hedging correction (owner, twice this session)** is graduated to
  `distilled.md` — "a forced conclusion is executed, not offered; deference can be
  a hedge." A determination I was asked to make, then offered to act on, is
  responsibility-passback; misusing `feedback_feature_shaping_is_owner_decision`
  as cover for not finishing is the specific trap.

## Session: 2026-05-28 (closeout) — worked examples dissolve abstract design forks (Woodland Swaying Pollen)

### Patterns to Remember

- **When a design fork stalls in the abstract, pull the concrete numbers — don't
  argue harder.** The EEF "one axis or two" question (membership-only full nodes
  vs graded disclosure) circled in trade-off reasoning until one measured FACT
  ended it: the whole 30-strand corpus is ~21k tokens, under the ~25k agent
  ceiling, so full nodes always fit and graded disclosure earns nothing here.
  The abstract debate collapsed the instant the real corpus + a token count were
  in front of me. This is exactly the owner's "resolve by worked examples on the
  real corpus, not the rule in the abstract." Reusable: a stalled design fork is
  a signal to get the real data, not to deliberate harder.
- **Closeout note**: the escape-hatch generative screen now lives in
  `distilled.md` (always-loaded) as a pre-output filter, not a retrospective
  catalogue. `distilled.md` went SOFT (122/120 lines) — correct
  knowledge-preservation, routed to the next dedicated curation, never trimmed.

## Session: 2026-05-28 (later) — escape-hatch process re-enacts F (Woodland Swaying Pollen)

### Correction absorbed (retrospective metacognition)

- **Owner caught two moves in one planning session**: (1) I posed a *forced*
  conclusion (full nodes — my own worked examples showed graded disclosure isn't
  a helpful lever, whole corpus < ceiling) as a balanced A/B menu instead of
  stating the verdict; (2) I re-imported deferral ("gate-1b later", "D6-gated
  fast-follow", "consolidate-at-third-consumer defers it") when the explicit goal
  was to *remove* the 1a/1b deferral framing — the owner had made ZERO deferral
  decisions.
- **The pattern (the durable bit)**: both — plus a near-miss "rank the broad
  result down to N" (sort-plus-slice, a list-op) — share one root: **F's
  *process***. F shipped stubs + lateral workarounds + the gate-split, all ways
  to dodge the complete build. I had internalised the foundation's *content*
  (graph≠list, no stubs) while still running F's *process* (dodge the complete
  commitment via an escape hatch). Knowing the anti-pattern did not immunise me
  from re-enacting its shape.
- **Behaviour change**: the tell is **the reach for an exit** — "defer", "let the
  owner pick", "rank it down" — not the vocabulary. When I reach for one, treat
  it as a flag that a complete commitment is available and I'm flinching. Check,
  then make it. Deferral is an owner decision, never my silent default; a forced
  conclusion is stated, not offered as a menu.
- **Source plane**: `doctrine` (agent practice). Also landed in the graph-tooling
  foundation §9 as a named anti-pattern.

## Session: 2026-05-28 — napkin rotation (Sylvan Whispering Fern)

Rotated the 2026-05-27/28 napkin (was HARD: 408 lines / 19558 chars) during a
`consolidate-until-done` dedicated-knowledge-curation pass. The processed source
is archived verbatim in the [companion archive][archive].

Behaviour-changing lessons graduated to `distilled.md`:

- `tail -F | grep` watchers re-emit their whole history on file rewrite — use a
  dedup poll (two instances).
- Read git merge/divergence risk from content (`git diff HEAD origin/<branch>`),
  not a raw `HEAD..origin` name-status diff.
- Generated adapters are never hand-written — fix the generator, don't stub
  (owner-corrected).
- Treat session-opener fitness as stale until you rerun it this session.

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
