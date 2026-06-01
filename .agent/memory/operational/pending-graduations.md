---
fitness_line_target: 1500
fitness_line_limit: 2200
fitness_char_limit: 200000
fitness_line_length: 500
lifecycle_model: >-
  canonical pending-graduations register — owner-gated and pending items live
  here until graduated, duplicated, stale-withdrawn, or owner-resolved
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Graduate items to PDRs/ADRs/rules/permanent docs; keep owner-gated items here
  until owner direction resolves them; do not split, shard, or hide buffer depth
fitness_rationale: >-
  Recalibrated 2026-05-27 on owner direction to collapse legacy
  pending-graduations pseudo-shards back into this canonical register. The
  register is intentionally allowed to hold owner-gated decisions and compact
  recovery-file disposition evidence in one place; fitness is routing evidence,
  not permission to create sidecar buffer files.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

This is the canonical pending-graduations register. Do not create dated,
windowed, backlog, split, or shard-like pending-graduation files. New capture,
owner-gated items, and unresolved pending-graduation decisions belong here until
they graduate, duplicate, become stale-withdrawn, or receive owner direction.

## Register Rule

Legacy recovery files under `.agent/memory/operational/pending-graduations/`
were collapsed back into this file on 2026-05-27 by owner direction. The
substance that still needed a live queue home is preserved below. Processed
source files were deleted after extraction so the repository does not carry
pseudo-shards that hide the true buffer state.

## 2026-06-01 capture — cross-platform rules generator (Twilit Threading Satellite)

- **No generator exists for the rules' cross-platform forms; one was intended,
  for consistency.** Each canonical `.agent/rules/<name>.md` is hand-mirrored
  into `.claude/rules/`, `.cursor/rules/<name>.mdc`, `.agents/rules/`, and a
  `RULES_INDEX.md` row, with `portability:check` validating alignment after the
  fact. A generator would author every form from the canonical file so the forms
  cannot drift and the index stays in lockstep. (The index header already drifted:
  it says "three on-disk forms" while listing four.)
  `[captured: 2026-06-01 | source: rules-have-no-exceptions authoring | target: agent-tools:rules-cross-platform-generator | trigger: owner-direction-or-next-rule-authoring | size: M | status: pending]`

## 2026-05-31 captures — EEF value reframe (Fruited Regrowing Copse)

Captured by Fruited Regrowing Copse (claude / Opus 4.8 / `abec59`) during the EEF
value reframe. Capture-only; graduation deferred to a future consolidation when
triggers fire.

- **No tombstones for removed ideas.** `[captured: 2026-05-31 | source:
  distilled.md + feedback_no_tombstones_for_removed_ideas | target:
  .agent/rules/no-tombstones-for-removed-ideas.md | trigger: FIRED 2026-06-01 —
  owner restated and directed graduation | size: S | status: graduated 2026-06-01]`
  GRADUATED to `.agent/rules/no-tombstones-for-removed-ideas.md` (canonical, with
  `.claude` / `.cursor` / `.agents` loader pointers + a RULES_INDEX entry) — now in
  the always-applied rule tier. When an idea is wrong, describe the correct design
  and stop; do not memorialise it via rejection labels, negation-contrast framing
  ("X, not Y"), or dead-shape prohibition lists. Allowed exception: real-code
  deletion instructions until the code is gone. **Remaining enforcement increment
  (owner decision pending, NOT graduated):** the write-time innate-immunity hook
  (`.agent/hooks/policy.json`). The negation-contrast form is a structural pattern,
  not a clean literal — a naive block on "never / rather than / instead of" would
  false-positive heavily — so the hook can carry only a narrow high-signal banner
  set, and catching the structural form needs a smarter detector or an output-time
  review pass.

- **Trace user value before tool design.** `[captured: 2026-05-31 | source:
  distilled.md + feedback_trace_user_value_before_tool_design | target:
  pdr-or-directive:value-trace-before-tool-design | trigger: second instance of a
  built/designed tool the data could not support, or owner direction | size: S |
  status: pending]` Trace the user journey + value end to end and check
  data-support at each hop before designing/building. The EEF tools-as-envisioned
  were impossible because the data never supported the subject/topic join.

## 2026-05-31 captures — agent-tools PreToolUse hooks + scripts→src migration

Captured by Ethereal Weaving Constellation (claude / Opus 4.8 / `1d6645`) during
the hook-fail-open fix + `agent-tools/scripts/` dissolution (commit `1851eed`).
Capture-only; graduation deferred to a future consolidation when triggers fire.

- **PreToolUse safety hooks must run prebuilt artefacts, not `pnpm exec tsx`.**
  `[captured: 2026-05-31 | source: this-session commit 1851eed | target:
  adr:hook-execution-from-prebuilt-artefacts | trigger: second per-tool-call hook
  instance, a new PreToolUse hook, or owner direction | size: S | status: pending]`
  Per-call TS recompile (~1-2s) blows the 5s hook timeout under concurrent load
  and the guard then fails OPEN. Cure: invoke `node dist/...` directly; guarantee
  dist via the install lifecycle (postinstall + pre-commit build).

- **Sub-agent verification briefs must mandate the full gate set, not eslint
  alone — "lintClean ≠ gate-clean".**
  `[captured: 2026-05-31 | source: this-session split-workflow agents | target:
  rule-or-pdr:subagent-brief-mandates-full-gate-set (extends
  validate-specialist-findings-before-acting) | trigger: second instance of an
  agent passing one gate while failing another, or owner direction | size: S |
  status: pending]`
  Split agents wrote compact code that passed eslint but failed Prettier; the
  format pass then un-compacted it over `max-lines`. The cure for over-cap is
  responsibility-based splitting, never compaction.

- **Relocating tsx-invoked entry points silently breaks knip's entry config.**
  `[captured: 2026-05-31 | source: this-session knip failure | target:
  pattern:knip-entry-config-tracks-entry-point-moves | trigger: second
  entry-point relocation that breaks knip, or owner direction | size: S |
  status: pending]`
  knip `entry` globs pointed at the old `scripts/`; moving entries to `src/` made
  the whole dependency graph read as unused. Update `knip.config.ts` entry list
  on any entry-point relocation.

## 2026-05-31 captures — source-buffer gates from napkin/distilled processing

Captured by Eclipsed Stealing Raven (codex / GPT-5 / `019e7d`) during the
dedicated source-buffer consolidation pass and repaired by Open Lofting Cliff
after owner correction. These items remain owner-gated pending real promotion;
active napkin / distilled content was restored, so this section is not evidence
that the source buffers were validly drained.

- **Verification sweeps must not exclude the class under test.**
  `[captured: 2026-05-31 | source: napkin 2026-05-30 readiness review |
  target: rule-or-pattern:complete-sweep-without-negative-target-filter |
  trigger: second sweep false-negative caused by an exclusion filter or owner
  direction | size: S | status: owner-gated]`
  The candidate is the concrete failure mode where a search/audit appears clean
  because the command filtered away the very class it meant to inspect.
- **Find the falsifying fact before product surgery.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Twilit entry |
  target: pattern:falsifying-fact-before-remediation-surgery |
  trigger: second strict-refactor or product-remediation instance or owner
  direction | size: S | status: owner-gated]`
  This is the diagnostic counterpart to "recorded verdict is a claim to test":
  locate the fact that would break the proposed repair before editing around the
  inherited story.
- **Plan narrative sections drift from working artefacts.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Twilit entry |
  target: plan-hygiene-or-rule:working-artefacts-outrank-plan-narrative |
  trigger: second plan-body drift instance after a working artefact proves a
  different state or owner direction | size: S | status: owner-gated]`
  The current evidence is strong but overlaps with propagation doctrine; keep it
  gated until another instance proves it needs a separate home.
- **Validate your own verdict before acting on it.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Tempestuous entry |
  target: amend:verify-dont-trust-or-specialist-findings-doctrine |
  trigger: second self-verdict invalidation instance or owner direction |
  size: S | status: owner-gated]`
  The unresolved refinement is that "verify the auditor" applies to the
  agent's own summarized verdict, not only to external reviewers.
- **Anti-abuse validators are tripwires, not adversarial guarantees.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Tempestuous entry |
  target: sonar-disposition-or-validator-doctrine |
  trigger: second validator false-confidence instance or owner direction |
  size: S | status: owner-gated]`
  Preserve for a future quality-signal doctrine pass; do not graduate from one
  worked instance.
- **Verify-the-auditor needs asymmetric bias for irreversible withdrawal.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Tempestuous entry |
  target: amend:consolidate-docs-or-verify-auditor-doctrine |
  trigger: second high-cost withdrawal where false negatives and false
  positives have asymmetric harm, or owner direction | size: S |
  status: owner-gated]`
  This extends the existing verification-audit lesson; it is gated because the
  current home may only need an amendment rather than a new rule.
- **Watcher verification and filter-loss failures.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Shaded + Highland entries |
  target: dedicated-comms-research-plan |
  trigger: comms research plan opens or owner direction | size: M |
  status: owner-gated]`
  Comms-event rotation is paused, but the evidence belongs in the eventual
  comms research plan rather than active napkin prose.
- **Feature flags must gate every naming surface through the real env path.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Quiet entry |
  target: product-engineering-pattern:dark-launch-surface-enumeration |
  trigger: second flag-gated feature or owner direction | size: S |
  status: owner-gated]`
  The evidence is high-signal but product-pattern shaped; keep it gated until
  another feature or owner decision asks for a durable pattern.
- **Fixed canonical data is authority; derive, do not validate.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Radiant entry |
  target: eef-graph-tooling-doctrine-or-typescript-practice |
  trigger: EEF D3/D4 contract ratification, second fixed-corpus instance, or
  owner direction | size: M | status: owner-gated]`
  This overlaps with EEF graph-tooling and TypeScript practice; avoid a new
  doctrine until the live contract proves the reusable shape.
- **Read the primary artefact before machinery or reviewers.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Radiant entry |
  target: grounding-or-reviewer-doctrine-amendment |
  trigger: second reviewer/frame miss cured by reading the primary artefact or
  owner direction | size: S | status: owner-gated]`
  Preserve the behavioural lesson without expanding the always-read layer before
  a second instance or owner ratification.
- **Cursor session seed absent from terminal context.**
  `[captured: 2026-05-31 | source: napkin 2026-05-31 Cirrus entry |
  target: agent-tools-platform-identity-candidate |
  trigger: second platform seed/context mismatch or owner direction | size: S |
  status: owner-gated]`
  Route to agent-tools/platform identity work if it recurs.
- **Claim-pattern glob expansion is duplicate tooling friction.**
  `[captured: 2026-05-31 | source: napkin 2026-05-31 Eclipsed entry |
  target: duplicate-of:agent-tooling-frictions-register-F-04/F-14 |
  trigger: none | size: S | status: duplicate]`
  Existing homes already cover quoting and `--area-pattern` affordance gaps; the
  active napkin entry remains restored as a fresh worked instance until a valid
  future disposition removes it.

## 2026-05-31 longitudinal napkin-review gates

Captured by Blooming Twining Grove (codex / GPT-5 / `019e7d`) during the
dedicated longitudinal review of the active napkin plus the twenty most recent
archived napkins. These items are owner-gated because the review found repeated
failure despite existing reminders; they still need owner direction or a
narrower doctrine/tooling pass before promotion.

- **Active-buffer replacement needs a pre-replacement proof check.**
  `[captured: 2026-05-31 | source: longitudinal napkin review F1 |
  target: amend:consolidate-docs-or-consolidate-until-done |
  trigger: owner direction or next curation-doctrine/tooling amendment |
  size: S | status: owner-gated]`
  The 2026-05-31 source-buffer repair showed that archive-only replacement of an
  active source buffer can hide live material before the disposition ledger is
  trustworthy. The future cure should block active-buffer replacement until the
  source content has a valid item-level disposition proof in active homes.
- **Shell-significant collaboration CLI arguments need structural affordance.**
  `[captured: 2026-05-31 | source: longitudinal napkin review F2 |
  target: agent-tools-collaboration-state-ux-or-rule |
  trigger: owner direction or next collaboration-state CLI/doc pass |
  size: S | status: owner-gated]`
  Repeated instances include markdown backticks in comms bodies, unquoted `**`
  claim patterns, unquoted active-claim globs, and the current pass repeating the
  comms-glob variant. The shell expands before the CLI can validate, so the
  eventual cure may need `--area-pattern-file`, quote-safe examples, wrapper
  defaults, or another structural affordance rather than another prose reminder.

## 2026-05-31 distilled continuation gates

Processed by Foamy Charting Harbour (codex / GPT-5 / `019e7d`) while continuing
the repaired dedicated docs consolidation pass. These items were removed from
`distilled.md` only after a durable route was verified here or in an existing
home.

- **Rule-traction gap needs an action-time structural interrupt.**
  `[captured: 2026-05-31 | source: distilled 2026-05-14..28 / historical synthesis A1 |
  target: pdr:doctrine-adoption-lag-or-action-time-structural-interrupt |
  trigger: owner direction or next Practice-Core doctrine pass that reconciles
  this with metacognition pre-action ratification | size: M | status: owner-gated]`
  The lesson is stable and cross-session, but promotion must reconcile the
  structural-interrupt shape with existing metacognition and immune-system
  doctrine rather than minting a duplicate rule.
- **Substrate alignment is Practice design, not prose reinforcement.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25..26 / historical synthesis A2 |
  target: pdr:substrate-alignment-as-practice-design |
  trigger: owner direction or next Practice-Core substrate-design pass |
  size: M | status: owner-gated]`
  The candidate says Done-When fields, heartbeat templates, skill success
  criteria, and rules must encode the intended outcome. It is gated because the
  existing PDR-038 / PDR-046 / PDR-089 family may be the right amendment home.
- **Multi-agent auto-fix requires peer-file awareness.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25 / historical synthesis B3 |
  target: rule-or-pattern:multi-agent-auto-fix-requires-peer-file-check |
  trigger: second repo-wide autofix sweep incident after the 2026-05-25 Hushed
  instance or owner direction | size: S | status: owner-gated]`
  Single-agent repo-wide autofix is normal; the pending decision is whether
  multi-agent windows need an always-loaded pre-autofix peer-file check.
- **Long gate runs require a fresh post-gate git status.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Codex / historical synthesis B5 |
  target: session-handoff-or-rule:post-long-gate-status-refresh |
  trigger: second false-clean closeout after a long gate run or owner direction |
  size: S | status: owner-gated]`
  The candidate is a narrow closeout hygiene rule: after any long aggregate gate,
  rerun `git status --short` before claiming tree-clean or writing handoff state.
- **ADR status must match implementation maturity.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25 / historical synthesis D3 |
  target: adr-template-or-docs-adr-rule:status-matches-maturity |
  trigger: next ADR/PDR paired-status review or owner direction |
  size: S | status: owner-gated]`
  The reusable rule is that `Accepted` means decided and validated; when the
  paired PDR is still Candidate or implementation is explicitly deferred, the ADR
  should remain Proposed unless the owner ratifies the maturity mismatch.

## 2026-05-31 distilled final gates

Processed by Foamy Charting Harbour (codex / GPT-5 / `019e7d`) as the second
continuation batch on the restored active `distilled.md` buffer. These items are
removed from `distilled.md` only because they now have explicit owner-gated
routes here or duplicate homes named in the curator ledger.

- **Recorded verdicts are claims to test, not frames to inherit.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Pelagic entry |
  target: evaluator-grounding-or-continuity-doctrine |
  trigger: second evaluation task that inherits a stale diagnosis as its frame,
  or owner direction | size: S | status: owner-gated]`
  The candidate extends verify-dont-trust from artefacts to evaluation frames:
  verify existence against code/git, but verify meaning, role, and verdict
  before letting continuity prose define the question.
- **Verification artefacts are claims; withdrawal verdicts need adversarial checks.**
  `[captured: 2026-05-31 | source: distilled 2026-05-28 Sunlit ledger +
  Tempestuous recursion pass | target: consolidate-docs-or-curation-doctrine |
  trigger: next curation-discipline amendment or owner direction | size: M |
  status: owner-gated]`
  The live evidence is strong: verification and curation ledgers can be wrong in
  the highest-harm direction. Promote as a discipline amendment rather than
  burying it as a one-off note.
- **Merge and divergence risk must be content-derived.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Sylvan entry |
  target: git-collaboration-rule:content-derived-merge-risk |
  trigger: second raw-name-status false-conflict prediction or owner direction |
  size: S | status: owner-gated]`
  The reusable move is to prove risk from the merge algorithm or an empty content
  diff, not from raw `HEAD..origin` name-status output.
- **Session-opener fitness is stale until rerun.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Sylvan entry |
  target: start-right-or-consolidate-docs:rerun-fitness-before-acting |
  trigger: next fitness-driven curation lane or owner direction | size: S |
  status: owner-gated]`
  Opening fitness is a historical reading. Before acting on a hard/critical
  surface, rerun the validator and route substance structurally.
- **Collaboration state is source material, not durable memory.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Solar entry |
  target: collaboration-state-lifecycle-or-comms-research-plan |
  trigger: comms/state lifecycle research plan execution or owner direction |
  size: S | status: owner-gated]`
  State files may be preserved inside an explicit research window, but otherwise
  useful knowledge should be routed into memory/docs/plans and the state surface
  should not become long-term storage.
- **Supersession must refresh the auto-surfaced continuity chain.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 EEF supersession entry |
  target: session-handoff-or-continuity-practice-amendment |
  trigger: next continuity-surface amendment or owner direction | size: S |
  status: owner-gated]`
  A superseding pass must update the first surfaces a fresh session reads, such
  as the thread top and `repo-continuity` next steps, not only the plan body.
- **Production reachability is deployed registration, not SDK definition.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 EEF registration entry |
  target: mcp-registration-or-product-reachability-pattern |
  trigger: second SDK-defined-but-app-unregistered surface or owner direction |
  size: S | status: owner-gated]`
  The reusable rule is to test the deployed registration path before calling a
  prompt/tool/resource live in production.
- **Delegate by judgment load, not by available parallelism.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 delegation entry |
  target: agent-collaboration-or-reviewer-delegation-doctrine |
  trigger: second boundary-sensitive delegated edit that plants a false claim,
  or owner direction | size: S | status: owner-gated]`
  Mechanical edits can parallelise; subtle correctness boundaries stay with the
  agent that understands the boundary unless the delegation brief names it
  precisely.
- **Closeout verdicts require live plan-acceptance evidence.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Codex / historical synthesis D2 |
  target: session-handoff-or-definition-of-delivery:truthful-closeout-language |
  trigger: next closeout-doctrine pass or owner direction | size: S |
  status: owner-gated]`
  Documentation closeout, handoff wording, and useful slices are not completion
  proof. The durable rule should force verdict words to match live acceptance
  evidence.

## 2026-05-28 captures — EEF graph-tooling rebuild

Surfaced by Deep Fathoming Harbour (claude / claude-opus-4-7) during the EEF
wrong-shape diagnosis. (The originating design docs were quarantined to `archive/`
2026-05-30 as superseded broken-concept work; the substance to graduate is captured
below, independent of them.)

- **Graph-tool category + graph-delivery doctrine.**
  - captured-date: 2026-05-28
  - graduation-target: ADR (host architecture) and/or PDR — "graph tools are a
    first-class tool category: complete-within-itself subgraphs (contiguous or
    sparse), navigable links, structuredContent-only, no context hint, budget as
    a design signal; the graph/corpus is smart and the tool is a thin formatter"
  - trigger-condition: the live EEF plan ratifies the graph-tool / MCP contract
    (D3/D4 — becomes settled and reusable across adapters)
  - status: pending (graduate when the live EEF plan's D3/D4 contract is
    ratified). Reviewed 2026-05-31 by Open Lofting Cliff: carried forward because
    current continuity says D0 is complete and D1/D2 are next.
- **Self-correcting measurable deliverables (planning methodology).**
  - captured-date: 2026-05-28
  - source-surface: foundation §5 + this rebuild plan (first instance)
  - graduation-target: PDR + `oak-plan` skill amendment — deliverables sequenced
    by consumption so D(n+1)'s gate breaks if D(n) drifted; drafting discipline
    (a) measurable acceptance, (b) what it consumes, (c) how the gate breaks if
    the predecessor drifted
  - trigger-condition: plan D5 (extract from the rebuild plan as its first proven
    instance)
  - status: pending (owner wants this in planning methodology). Reviewed
    2026-05-31 by Open Lofting Cliff: carried forward because D5 has not fired.
- **Definition-of-Delivery refinement for discovery/instrument work.**
  - captured-date: 2026-05-28
  - source-surface: foundation §6; PDR-085
  - graduation-target: PDR-085 amendment — account for instrument/discovery
    deliverables (beneficiary = us-able-to-explore; value = exploration enabled)
    and the self-correcting-deliverables structure as the honesty mechanism; the
    F tool is the case study (merged + green + reviewed != delivery)
  - trigger-condition: plan D5 / owner direction on the doctrine refinement
  - status: pending (open question, owner-flagged). Reviewed 2026-05-31 by Open
    Lofting Cliff: carried forward because D5 / direct owner promotion has not
    fired.
- **'Working with graphs' skill(s) + supporting docs.**
  - captured-date: 2026-05-28
  - source-surface: foundation §11; plan D5 (owner-directed deliverable)
  - graduation-target: a skill (or skill family) — graph != list; the list-ops
    that must never touch a graph; completeness-as-integrity; contiguous vs
    sparse subgraphs; navigable links; graph tools as a category; soft-stub
    failure mode
  - trigger-condition: plan D5 (extract from the real built tool/contract)
  - status: pending (owner-directed plan deliverable). Reviewed 2026-05-31 by
    Open Lofting Cliff: carried forward because the D5 extraction trigger has
    not fired.
- **Proportionate exploration — raising a question is fine; the expenditure is the failure.**
  - captured-date: 2026-05-28
  - source-surface: owner correction 2026-05-28 — "it's always fine to raise a
    question, the problem was the amount of time, effort, tokens and distraction
    spent on it" (per-user memory `proportionate-exploration`; napkin 2026-05-28)
  - graduation-target: amend `principles.md` §"Keep it strict" or a rule sibling
    to `present-verdicts-not-menus` — the existing "don't invent optionality"
    principle was VIOLATED this session under the "holding-open / robustness"
    costume; the refinement is proportionality of exploratory questioning (flag in
    a sentence with a default, then move on) + costume-awareness
  - trigger-condition: second instance or owner-direction (one-session lesson;
    needs stability before graduating)
  - status: pending. Reviewed 2026-05-31 by Open Lofting Cliff: carried forward;
    no second instance or direct owner promotion found in the selected docs
    surfaces.

## Extracted Recovery-File Disposition Ledger

- `pending-graduations/owner-gated.md`: moved back into this canonical
  register below as the owner-gated section.
- `pending-graduations/2026-05-06-to-2026-05-21-legacy-backlog.md`: retained
  legacy backlog drain window had item-level dispositions through batch 27:
  `67` total dispositions, `33 duplicate`, `34 owner-gated`. The remaining
  unresolved items are now in the owner-gated section below.
- `pending-graduations/2026-05-23-team-session-autonomy.md`: processed file;
  graduated liveness heartbeat, heartbeat-content state-binding, and
  ping-before-escalate substance already live in their durable homes. No live
  queue items remained.
- `pending-graduations/2026-05-24-napkin-tail-candidates.md`: processed file;
  disposition evidence lives in
  `curator-passes/2026-05-27-airy-napkin-tail-owner-gates.md`; unresolved
  decisions are in the owner-gated section below.
- `pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md`:
  processed file; ship-independent-coordinate-dependent graduated to rule and
  adapters, and the n=2 coordination-efficiency decision is in the owner-gated
  section below.
- `pending-graduations/2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md`,
  `2026-05-25-misty-director-session-candidates.md`,
  `2026-05-25-planning-and-autofix-candidates.md`,
  `2026-05-26-feathered-torrid-n2-cycle-1-candidates.md`,
  `2026-05-26-starless-open-closeout-candidates.md`, and
  `2026-05-27-distilled-hard-drain-candidates.md`: ready-empty files with no
  content after frontmatter at collapse time; no knowledge remained to extract.
- `pending-graduations/README.md`: instruction content superseded by this
  register rule.

## Owner-Gated Pending Graduations

Processed items in this file already received a curation disposition. The
remaining action is a user decision: graduate now, keep the watch live,
withdraw, or route to an explicitly named implementation lane.

**Re-verification status (2026-05-29, Tempestuous Vaulting Falcon).** The Sunlit
ledger's Group C "recommend withdraw" verdicts were re-verified adversarially
against the live repo. 15 of 18 were wrong (the named coverage home did not
contain the substance) and are **kept**; 3 were confirmed genuinely covered /
thin-no-signal-lost and **withdrawn** (recurrence-rank weighting; napkin +
`.remember/` PDR-011 amendment; owner-authorised redundant-config marker).
Per-item verdicts and evidence:
[`curator-passes/2026-05-29-tempestuous-vaulting-falcon.md`](curator-passes/2026-05-29-tempestuous-vaulting-falcon.md).
The Group C dispositions in the Sunlit ledger are superseded by that pass.

Total live owner-gated items: 56.

## Legacy Backlog Gates

- 2026-05-22; **Intent notes as abandonment coordination**.
  `[captured: 2026-05-22 | source: Stormbound intent abandonment | target: pattern:intent-notes-for-abandonment-rationale | trigger: second peer-abandonment instance or owner-direction | size: S | status: owner-gated]`
  The commit workflow now preserves automated abandon-notes for failure
  surfaces, but the reusable peer-coordination pattern is narrower: an agent
  voluntarily abandons a queued intent and writes a substantive explanation in
  the queue record so later committers see the reason at the surface they must
  already read. Owner gate: keep watching for a second peer-abandonment instance,
  promote the pattern now, or withdraw because automated abandon-notes and
  intent-scoped commit workflow are sufficient.
- 2026-05-22; **More-restrictive Practice rule wins on reviewer conflict**.
  `[captured: 2026-05-22 | source: t12 reviewer conflict | target: pattern:more-restrictive-practice-rule-wins | trigger: second mandatory-reviewer conflict or owner-direction | size: S | status: owner-gated]`
  `different-lens-reviewer-divergence.md` covers why divergent findings are
  useful, and reciprocal-reviewer dispatch now names principle-based conflict
  resolution as the expected move. No standalone rule/pattern currently settles
  the narrower resolution doctrine. Owner gate: promote this as its own pattern,
  fold it into the existing divergence pattern, keep watching, or withdraw.
- 2026-05-12; **Re-plan after second cycle lands**.
  `[captured: 2026-05-12 | source: graph-stack Inc.1a holistic re-plan | target: pdr-or-rule:workstream-evolution-cadence | trigger: owner-direction-or-third-cycle-replan-failure | size: M | status: owner-gated]`
  The graph-stack plan and thread record preserve the worked instance: after
  WS1.2 landed, the remaining cycles were walked backwards from downstream
  consumers and reduced from 12 to 10 with five substantive verdicts. The
  broader reusable question is whether this becomes a cross-workstream cadence
  rule, folds into planning discipline, or remains graph-thread-specific.
- 2026-05-12; **Deferral with retrospective-review tripwire**.
  `[captured: 2026-05-12 | source: graph-stack Inc.1a V3 deferral | target: rule-or-pdr:defer-with-binding-retrospective-review | trigger: owner-direction-or-second-cross-increment-deferral | size: S | status: owner-gated]`
  The Inc.2 GraphDocument deferral is preserved in the active graph-stack plan
  and connecting-oak-resources thread record, including the named surfaces and
  binding review criteria. The remaining decision is whether to codify this as
  general deferral doctrine, keep it scoped to the graph-stack plan, or withdraw
  the reusable candidate.
- 2026-05-19; **Portable reference arrives without plan slot**.
  `[captured: 2026-05-19 | source: comms-watch-mechanism reference arrival | target: pattern:portable-reference-integration-grounding | trigger: second instance or owner-direction | size: S | status: owner-gated]`
  The `comms-watch-mechanism` reference has since acquired multiple concrete
  homes and workstream routes, but the reusable three-question grounding pattern
  is still a one-instance watch. Owner gate: keep watching for a second portable
  reference without an owning plan, promote the grounding pattern now, or
  withdraw it as a local recovery tactic.
- 2026-05-12; **E-1/E-2 advisory hooks and agent-tools git passthrough**.
  `[captured: 2026-05-12 | source: cost-of-collaboration-exploration | target: scoping-pass-or-cost-of-collaboration-workstream | trigger: owner-direction-or-decision-complete-scoping | size: L | status: owner-gated]`
  Advisory agent hooks and an `agent-tools git` passthrough may compose into a
  single post-P-Foundation workstream, but the exploration is not yet
  decision-complete. The remaining decision is whether to run the scoping pass,
  keep the exploration parked under cost-of-collaboration, or withdraw.
- 2026-05-12; **Agent-tools CLI architectural decision extraction**.
  `[captured: 2026-05-12 | source: cost-of-collaboration-p-foundation | target: adr:agent-tools-cli-unified-entrypoint+rule:no-new-bins | trigger: owner-direction-or-retrospective-confirms-doctrine | size: XL | status: owner-gated]`
  P-Foundation landed the unified entrypoint / build-once CLI architecture,
  but no separate ADR or no-new-bins rule extraction was found in this pass.
  The remaining decision is whether to author that ADR/rule now, keep a
  retrospective watch, or withdraw because the plan and implementation are
  enough.
- 2026-05-11; **Pre-flight fingerprint scan before shape decisions**.
  `[captured: 2026-05-11 | source: smouldering-crackling-pyre | target: rule-or-pattern:fingerprint-data-before-shaping-fix | trigger: owner-direction-or-second-data-premise-refutation | size: S | status: owner-gated]`
  A cheap data-corpus fingerprint scan refuted a migration-plan premise before
  code landed and let the owner redirect the shape. The remaining decision is
  whether to promote the rule/pattern now, keep watching for a second instance,
  or withdraw as a local investigation tactic.
- 2026-05-11; **Owner re-decision on evidence-refuted premise**.
  `[captured: 2026-05-11 | source: deciduous-twining-dew | target: pdr-or-rule:re-surface-dont-override-on-evidence-correction | trigger: owner-direction-or-second-distinct-review-type | size: S | status: owner-gated]`
  When reviewer evidence refutes an owner-approved premise, the healthy move is
  to re-surface the corrected evidence and let the owner decide again, not to
  silently reshape the design. The remaining decision is whether to promote the
  protocol now, keep watching for another review-type instance, or withdraw
  because existing owner-direction discipline is sufficient.
- 2026-05-10; **evaluateParityChecks focused unit coverage**.
  `[captured: 2026-05-10 | source: commands-retirement-reviewer-follow-up | target: test-cycle:agent-tools/src/core/health-probe-parity.ts | trigger: owner-direction-or-next-touch | size: M | status: owner-gated]`
  `evaluateParityChecks` still lacks focused unit coverage for reviewer adapter
  and registration parity; it is only exercised through the composed
  health-probe path. The remaining decision is whether to schedule the test
  cycle, keep as a next-touch watch, or withdraw because integration coverage is
  sufficient.
- 2026-05-10; **getSkillPermissionIssues live skill-dir test path**.
  `[captured: 2026-05-10 | source: commands-retirement-reviewer-follow-up | target: code-cleanup+test-cycle:validate-portability-helpers | trigger: owner-direction-or-next-touch | size: S | status: owner-gated]`
  `getSkillPermissionIssues` live calls use `claudeCommandFiles: []` plus
  `claudeSkillDirs`, while existing tests still cover command-file inputs. The
  remaining decision is whether to schedule the helper cleanup/test cycle, keep
  as a next-touch watch, or withdraw.
- 2026-05-10; **Pre-commit skills/portability gate coverage**.
  `[captured: 2026-05-10 | source: commands-retirement-config-review | target: pre-commit-hook-coverage-or-adr-121-amendment | trigger: owner-direction-or-adapter-drift-past-pre-commit | size: S | status: owner-gated]`
  `.husky/pre-commit` still does not run `pnpm portability:check` or
  `pnpm skills:check`; pre-push and full `pnpm check` cover adjacent routes.
  The remaining decision is whether to add pre-commit coverage, keep this as
  pre-push/full-gate discipline, or withdraw.
- 2026-05-10; **Generated insight artefact decay/honesty discipline**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10 | target: pattern:generated-insight-artefact-discipline-or-rule:no-moving-targets-amendment | trigger: owner-direction-or-second-generated-insight-artefact | size: S | status: owner-gated]`
  A generated insight artefact proposed a cadence-vs-friction decay split and
  evidence-vs-interpretation honesty discipline. The remaining decision is
  whether to graduate that method now, keep watching for a second generated
  artefact, or withdraw because existing no-moving-targets and honest
  documentation doctrine is enough.
- 2026-05-10; **Owner reply preferences and default reply shape**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10 | target: user-collaboration-or-pattern:owner-reply-shape | trigger: owner-direction-or-second-regeneration | size: S | status: owner-gated]`
  The insight report proposed compact reply preferences plus a default shape
  ("lead with answer" and concise evidence/next-step structure). The remaining
  decision is whether to amend `user-collaboration.md`, keep watching, or
  withdraw because the existing Working Model is enough.
- 2026-05-10; **Memory/skills key-terms glossary**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10 | target: memory-readme-or-memory-skills-glossary | trigger: owner-direction-or-second-term-confusion-instance | size: M | status: owner-gated]`
  Distillation, napkin rotation, and adapter-only skill are pervasive terms in
  memory/skill contexts but lack a glossary home. The remaining decision is
  whether to create a memory/skills glossary, keep watching for confusion or
  inconsistent usage, or withdraw because contextual use is sufficient.
- 2026-05-10; **Owner affirmation phrase corpus**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10+owner-course-correct-vocabulary | target: pattern:owner-affirmation-vocabulary | trigger: owner-direction-or-second-regeneration | size: S | status: owner-gated]`
  Affirmation phrases such as "exactly", "great", and "perfect" may calibrate
  agent confidence without acting as re-grounding triggers. The remaining
  decision is whether to graduate a companion pattern now, keep watching for a
  second corroborating regeneration, or withdraw because the existing
  course-correct pattern note is enough.
- 2026-05-05-06; **Cross-thread git-history as observable coordination
  signal**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target: pdr-027-thread-scope-or-distilled-agent-coordination | trigger: owner-direction-or-second-cross-thread-git-history-adaptation | size: S | status: owner-gated]`
  A peer on another thread correctly adapted after observing the local branch
  head advance, then re-ran verification against the new SHA without a direct
  comms exchange. The remaining decision is whether to amend PDR-027 or
  distilled coordination guidance now, keep watching for another git-history
  substrate adaptation, or withdraw because existing shared-substrate doctrine
  is sufficient.
- 2026-05-05-06; **In-flight consolidation workflow-gap patching**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target: pdr-014-amendment-or-distilled-process | trigger: owner-direction-or-second-in-session-workflow-gap-patch | size: S | status: owner-gated]`
  A consolidation session patched a directly relevant `session-handoff` workflow
  gap in the same session that exposed it, rather than deferring by default.
  The remaining decision is whether to promote the consolidation-boundary
  refinement now, keep watching for a second reviewed in-session workflow patch,
  or withdraw as already covered by PDR-014/PDR-046.
- 2026-05-05-06; **Fat-baton handoff inline diagnostics**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target: pattern:fat-baton-handoff-inline-diagnostic | trigger: owner-direction-or-second-named-receiver-diagnostic-handoff | size: S | status: owner-gated]`
  A named-receiver handoff inlined ephemeral `practice:fitness:strict-hard`
  diagnostic output so the receiver did not need to rerun it before intake.
  The remaining decision is whether to graduate the pattern now, keep watching
  for a second named-receiver diagnostic handoff, or withdraw because PDR-048
  and PDR-046 already carry enough capture-at-the-moment guidance.
- 2026-05-10; **Design optionality standalone rule sibling**.
  `[captured: 2026-05-10 | source: legacy-backlog+pdr-058-surface-2 | target: rule:closed-shape-design-optionality | trigger: owner-direction-or-second-named-instance-with-cure-draft | size: S | status: owner-gated]`
  PDR-058 Surface 2 names the design-optionality failure mode and cure:
  author the closed shape the known instances need, and defer configurability
  until a real second instance forces decomposition. PDR-058 also says the
  rule sibling requires its own evidence trail and is not pre-graduated by the
  PDR. The owner decision is whether to graduate the standalone rule now, keep
  watching for a second named instance with a concrete cure draft, or withdraw
  because PDR-058 plus existing consolidation rules are enough.
- 2026-04-30; **Graduation-trigger criteria refinement**.
  `[captured: 2026-04-30 | source: legacy-backlog | target: consolidate-docs-trigger-rubric | trigger: owner-appetite-for-flow-refinement | size: M | status: owner-gated]`
  Owner observation: the default "second instance OR owner direction" trigger
  can leave strong single-instance candidates waiting too long when the
  principle articulation is already robust. The remaining decision is whether
  to amend consolidate-docs trigger guidance now with evidence-density /
  principle-quality / structural-coverage criteria, keep the current default,
  or route a dedicated refinement pass.
- 2026-04-29; **Trinity Active Principles and bootstrap structural
  extensions**.
  `[captured: 2026-04-29 | source: legacy-backlog+trinity-drift-report | target: core:practice+practice-lineage+practice-bootstrap+practice-verification | trigger: owner-approval-for-core-amendments | size: M | status: owner-gated]`
  Several 2026-04-29 doctrine sharpenings have durable homes in PDRs, rules,
  and practice-lineage, but the proposed amendments still touch dense Practice
  Core trinity and verification surfaces. Per consolidate-docs step 8, the
  remaining decision is owner-approved Core amendment shape: land the trinity
  updates now, keep the healthy-lag watch live, or withdraw because the
  existing PDR/rule homes are sufficient.
- 2026-04-29; **Open up the value early PDR decision**.
  `[captured: 2026-04-29 | source: legacy-backlog | target: pdr:open-up-the-value-early | trigger: owner-direction-or-fourth-cross-session-instance | size: S | status: owner-gated]`
  The experience-text pattern says extra work is justified inside the current
  arc when it closes a coordination gap the surrounding decisions would
  otherwise ship with. The remaining decision is whether to graduate this
  strategic test into a PDR now, keep watching for another cross-session
  instance, or withdraw because the named experience files are sufficient.
- 2026-04-29; **Agent-infrastructure failure visibility Practice Core
  promotion**.
  `[captured: 2026-04-29 | source: legacy-backlog | target: pdr:hook-failures-must-be-observable-or-practice-core-contract | trigger: owner-direction-or-second-platform-thin-wrapper | size: S | status: owner-gated]`
  ADR-167 already carries the concrete host-local rule: non-blocking
  agentic-platform hook failures must be observable in a developer-readable
  failure channel. The unresolved decision is whether to extract that into a
  portable Practice Core PDR now, keep watching for a second platform
  implementation that needs the same thin-wrapper contract, or withdraw because
  ADR-167 plus `hook-as-question-not-obstacle` covers the current operational
  risk.
- 2026-04-28; **PR-87 pre-phase adversarial security review pattern**.
  `[captured: 2026-04-28 | source: pr-87-security-review | target: pattern:pre-phase-adversarial-review-expands-cluster-scope | trigger: owner-direction-or-second-cross-session-instance | size: S | status: owner-gated]`
  PR-87's Phase 2 pre-phase security review originally surfaced
  `X-Forwarded-For` spoofing on Vercel as MUST-FIX. The live security
  substance is already durable: the completed PR-87 security-review record
  re-reviewed the premise against Vercel docs and reclassified the finding as
  HARDENING, while ADR-158 and `safety-and-security.md` now carry the
  runtime-aware key-extraction boundary. The remaining item is only the
  pattern-promotion decision: whether to create
  `pre-phase-adversarial-review-expands-cluster-scope` as a reusable pattern,
  keep watching for a second cross-session instance, or withdraw because the
  generic adversarial-review component and security docs are sufficient.
- 2026-05-21; **Sync-kind / urgency flag in comms schema (ADR candidate)**.
  `[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing | target: adr:184+implementation-tranches | trigger: implementation-lands | size: S | status: owner-gated]`
  **ADR-184 slice processed 2026-05-24**:
  [ADR-184](../../../../docs/architecture/architectural-decisions/184-comms-event-sync-kind-and-urgency-field.md)
  is Proposed and resolves the representation decision: `sync` is the
  interaction-shape axis and `urgency` is the response-priority axis.
  The live residual is the implementation tranche set ADR-184 names:
  schema/parser migration, CLI rendering, authoring/enforcement, and
  activation.

  Route-state rechecked 2026-05-24 by Pelagic Snorkelling Sextant under claim
  `b92377f8-d305-465c-8303-a961924d1c6d`: the implementation trigger has
  not fired. The current comms schema still enumerates narrative, lifecycle,
  and directed event kinds without `sync`; the current collaboration-state
  parser/rendering surfaces still treat `sync` / `urgency` as ADR-planned
  work rather than supported event protocol. Keep this residual live until
  the schema, parser, renderer, authoring commands, and activation notes land.
- 2026-05-21; **Two-participant invariant write-side validator (rule candidate)**.
  `[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing+honest-scope-flag | target: rule:comms-write-refuses-self-addressed | trigger: owner-direction | size: S | status: owner-gated]`
  Owner direction 2026-05-21: *private messages must have at least two
  participants*. Today the `classifyEventForAgent` classifier handles
  the read-side correctly (a `directed`-kind event from `self.to.self`
  passes self-exclusion before to-match runs because the author is
  self). The write-side does NOT currently refuse a narrative event
  whose `addressed_to === author.agent_name`, nor a directed event
  whose `from === to`. The structural cure is a write-side validator
  in `agent-tools/src/collaboration-state/comms-messages.ts` (and
  wherever narrative events are constructed) that refuses self-only
  addressing at write time. Trigger: owner-direction to land the
  validator. Size S — single validator function plus unit tests.
- 2026-05-13; **Coordinator role-label ontology residual**
  `[captured: 2026-05-13 | source: napkin+napkin-archive+historical-synthesis | target: pdr:pressure-to-role-mapping-protocol-or-persistent-role-labels | trigger: p1-falsification-evidence+owner-direction | size: S | status: owner-gated]`
  **PDR-071 slice processed 2026-05-24**:
  [PDR-071](../../../practice-core/decision-records/PDR-071-coordinator-allocates-without-gating.md)
  is Proposed and now carries the durable coordinator allocation vs
  gating principle. The live residual is narrower: do not graduate a
  fixed role-label ontology until the start-right-team experiment has
  accumulated **N≥3 multi-agent sessions** across at least two
  thread/work-shape contexts, and
  [P1 falsification criteria](../../../prompts/agentic-engineering/collaboration/falsification-criteria.md#p1--modes-not-roles)
  show either that role labels remain bounded to live pressure or that
  specific labels consistently re-emerge across changing pressure shapes.
  Owner direction remains a co-trigger. Observations land in `napkin.md`
  tagged with the experiment ID and affected primitive; the next
  consolidation pass then graduates a pressure-to-role mapping protocol,
  graduates empirically persistent labels, reframes the candidate, or
  removes it.
- 2026-05-12; **Commit-boundary peer-pair governance refinements**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:pdr:commit-window-coordination+rule:stage-by-explicit-pathspec+skill:commit | trigger: n>=3-validation+owner-direction | size: L | status: owner-gated]`
  The 2026-05-12 peer-triple/dispatcher window produced a coherent
  commit-boundary governance bundle. Landed during this distilled-stage pass:
  peer-pair review is not peer-pair commit authorship (`agent-collaboration.md`);
  current-session memory/state should land or be named as residue while
  peer-session state is
  not default-includable (`agent-collaboration.md` with a cross-reference to
  `respect-active-agent-claims.md`); queue intents are exact file-list
  contracts (`commit/SKILL-CANONICAL.md`); new durable files require claim
  expansion before further edits (`respect-active-agent-claims.md`).
  Still pending: gatekeeper GO needs the named gate's evidence; unify that with
  the landed clauses, PDR-054/PDR-059/ADR-177, and the live commit-skill
  protocol after the collaboration hardening tail has another validation pass,
  so the PDR/ADR layer carries the complete three-direction commit-boundary
  model without hiding the in-session promotions already made.
- 2026-05-12; **Collaboration tooling operator UX backlog**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: plan:cost-of-collaboration-p5-p8 | trigger: plan-execution-gated | size: L | status: owner-gated]`
  Operator friction from the P5/P8 collaboration-tooling work belongs in the
  implementation backlog rather than staying as durable distilled prose. The
  candidate bundle: every collaboration-state verb that requires `--active`
  must advertise it or safely default to canonical paths; directed-message
  targeting needs discoverable presence from fresh claims and recent comms;
  shared-log mentions must either become inbox-visible or be replaced by
  directed messages; `comms send`, `direct`, and `append` need
  `--body-file`/`--subject-file` for long content (second-instance evidence
  2026-05-21 Celestial Glimmering Moon `46d23a`: ~3300-char `--body`
  triggered `[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "agent-tools:
collaboration-state" not found` despite the script being present and
  working before/after on short bodies; root cause is shell argv corruption
  from auto-escaped `'"'"'` apostrophe sequences in long directly-quoted
  multi-line `--body` values; CLI never reached; CLI's own
  fail-fast-with-helpful-error discipline confirmed sound on
  missing-required-option test; `--body-file` would eliminate this entire
  failure class); agents need a
  protocol-position command reporting current intent, phase, and next action;
  missing `--seen-file` should mean an empty seen set; built-CLI smoke must
  cover help paths and real read/write paths; missing or stale built output
  should produce an operator message, not a Node stack. Trigger: drain through
  the cost-of-collaboration P5/P8 implementation lane or split into separate
  tool tickets if the lane narrows.
- 2026-05-12; **Skill and documentation surface audit follow-ups**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:plan:skills-audit+doc-amend:AGENT-practice-index | trigger: plan-execution-gated | size: M | status: owner-gated]`
  The skill-audit lessons are mostly workflow-maintenance backlog rather than
  PDR-shaped doctrine. Candidate checks: canonical skill bodies are the review
  target and wrappers remain pointers; command-topology drift should be audited
  for retired command paths, retired adapter paths, mutating proof commands,
  and stale workspace CLI invocations; redundant workflow skills should retire
  into always-fired homes; parallel-agent decomposition is plan hygiene rather
  than a narrow skill; guidance methodologies are not automatically skills;
  portability validation failures found during docs work are real
  infrastructure findings and should be fixed.
- 2026-05-11; **Practice-adopting repos exhibit an elevated skill-
  listing budget floor by construction** (Burnished Crackling Pyre
  2026-05-11, observed during Claude `skillListingBudgetFraction` bump
  from 1% → 3%).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: amend:practice.md OR amend:PDR-051 | trigger: owner-direction OR second-platform-instance | size: S | status: owner-gated]`
  The Practice's vendor-agnostic strategy deliberately uses platform
  skill surfaces (and equivalents) as the canonical integration point
  per PDR-009 (canonical-first cross-platform architecture) and PDR-051
  (vendor-agnostic skills standardisation). Repos adopting the Practice
  will therefore exhibit a structurally higher skill count than
  platform defaults assume. Claude's default `skillListingBudgetFraction`
  is 1%; this repo bumped to 3% in `.claude/settings.json` 2026-05-11
  (commit `9547bb69`). Graduation-target: a one-line note in
  `practice.md` (adoption section) or in PDR-051 stating that
  per-platform skill-listing budgets may need raising on Practice
  adoption, with Claude's 3% as the current reference. The existing
  feedback rule `feedback_skill_load_budget.md` governs the *ceiling*
  (skill-load context budget is real); this entry names the *floor
  implied by the architecture* — they are complementary, not duplicate.
  Trigger: a second platform exhibits the same need (Cursor / Codex
  equivalent budget hits), OR owner direction to land the practice.md /
  PDR-051 amendment.
- 2026-05-07; **fitness limits encode an implicit access-rhythm
  theory; recalibration must name the lifecycle, not just bump
  numbers** (Pelagic Rolling Harbour, owner-direction reframe of
  the pending-graduations HARD-persists framing).
  `[captured: 2026-05-07 | source: owner-direction | target: multi:doc-amend:fitness-validator-doc+pdr:fitness-lifecycle-axis | trigger: second-instance | size: M | status: owner-gated]`
  I had
  treated the persisting HARD on this register as a load-bearing
  signal and surfaced three response options (enlarge / split /
  cadence) as "owner direction". Owner reframed: the limit was
  arbitrarily calibrated against a frame that doesn't fit this
  file's lifecycle. `principles.md` is loaded every session by
  every agent — small *is* the quality signal. This register is
  accessed at consolidation passes only and grows with cross-
  session-wait substance — its limits should reflect a queue
  lifecycle, not a permanent-doc shape. The deeper insight:
  every fitness-tracked file implicitly encodes an access-rhythm
  theory in its limit shape; the schema should make that explicit
  so recalibration is principled rather than ad-hoc. Source-
  surface: this session's owner-direction turn after the
  2026-05-07 dedicated drain.
  Graduation-target: (a) extend the fitness validator and/or its
  documentation in `scripts/validate-practice-fitness.ts` and the
  ADR-144 narrative to name `lifecycle_model` and `access_pattern`
  as recommended (or required) frontmatter fields with a closed
  vocabulary (`loaded-every-session` / `read-on-demand` /
  `consolidation-pass-only` / `archive-only`); (b) sweep existing
  fitness-tracked files to declare their access pattern; (c) PDR
  capturing the doctrine ("limits encode access-rhythm theory")
  if it generalises across Practice-bearing repos. Trigger:
  second instance OR owner direction at promotion. The first
  instance is this session's recalibration. Status: owner-gated —
  capture to honour the moment per PDR-048 (insight capture at
  moment of occurrence); promotion when accumulation or owner
  direction warrants. **Cross-reference (2026-05-09)**:
  historical-napkin-synthesis confirms the recurrence of fitness-as-trim
  impulse across three corpus-window instances and identifies this
  lifecycle-aware-fitness recalibration as one of two structural cures
  (sibling cure: active inline discipline-reminder text in fitness output
  at non-healthy zones — separate entry below). Source:
  [`historical-napkin-synthesis-2026-05-09.md`](../../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F1.

  **Curation note (2026-05-23)**: retained pending as a partial
  graduation rather than archived. This register's own frontmatter now
  declares `lifecycle_model`, `access_pattern`, and `fitness_rationale`,
  proving the local cure for this file. ADR-144 currently records the
  non-reactive output reminder but does not yet generalise access rhythm
  as a named fitness-axis doctrine or recommend the lifecycle fields for
  other governed files; PDR-067/PDR-068 cover adjacent surface-kind and
  back-pressure doctrine, not the actual access-rhythm schema. Owner
  decision received 2026-05-23: this is both a governed model concept
  and portable Practice doctrine. Next action: ADR-144 / fitness-validator
  docs and tool schema first, plus a sweep of governed files, then a
  portable PDR. Disposition 2026-05-27: owner-gated; this remains an
  owner-routed implementation lane, not a narrow recovery-file drain.
- 2026-05-04; **memory classifications and systems review**
  (Verdant Sprouting Leaf, owner-flagged future-session item at
  session close): assess the three memory planes (`active/`,
  `operational/`, `executive/`) plus their sub-surfaces (napkin,
  distilled, patterns, threads, comms, claims, escalations,
  conversations, pending-graduations) for what works well, what
  can be improved, gaps, and beneficial restructure options. The
  seam-review concept exists in PDR-029 Family-B Layer-1 as a
  `taxonomy-review` candidate trigger; ≥3 such candidates in a
  single consolidation or ≥5 across consecutive consolidations
  signal a full taxonomy-review session is owed. Source-surface:
  napkin 2026-05-04 §"Three owner asides at session close".
  Graduation-target: dedicated taxonomy-review session with
  output: a memory-architecture audit report + any reorganisation
  proposals as PDR candidates against PDR-007/PDR-024/PDR-028. The
  assessment is multi-session in scope and benefits from the
  structural-foundation work landing first (the doctrine-scanner
  quick wins + practice trio activation create natural
  observation points for what the memory system *enables* vs
  *obstructs*). Trigger-condition: post-quick-wins evidence + owner
  direction, OR ≥2 additional taxonomy-review candidates
  accumulating before then. Status: owner-gated — PDR-029 Family B
  and the memory-feedback plans carry the seam-review lane; owner
  decision needed to ratify/restart that lane or withdraw this older
  broad review watch.
- 2026-05-03; **autonomous .git/index.lock interaction is forbidden,
  including wait loops** (Prismatic Illuminating Eclipse, owner
  intervention mid-A1-commit): the existing 2026-04-30 distilled.md
  entry "Never delete .git/index.lock" addressed the destructive
  shape (`rm` on a foreign lock). This session surfaced a softer
  failure mode that compounds in the same direction: an autonomous
  polling wait loop (`until [ ! -e .git/index.lock ]; do sleep 2;
done && echo "lock cleared"`). Even though the loop only OBSERVED
  the lock disappearing (Woodland's parallel commit completed
  naturally), the "lock cleared" echo conditioned the agent to treat
  lock-clearing as an action it takes rather than a state it
  observes, and any future evolution of the loop (timeout-then-rm
  fallback) would be a small step away from the catastrophic action.
  Owner direction: any contact with `.git/index.lock` requires owner
  authorisation, including the wait shape; surface foreign locks to
  the user with diagnostic + wait-vs-handoff options rather than
  running a wait loop. **Graduation target**: extend the existing
  distilled.md "Never delete .git/index.lock" entry to "Never
  autonomously interact with .git/index.lock at all — including wait
  loops"; consider promoting to a `.agent/rules/` rule given the
  destructive-blast-radius of the failure mode. Status: owner-gated —
  current owner-facing surfaces forbid autonomous lock-wait loops while the
  commit skill still permits a bounded physical lock wait, so the doctrine
  conflict needs owner decision before graduation. Captured to
  platform memory at
  `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_no_lock_wait_loops.md`
  for immediate effect; doctrine-level capture queued here for
  graduation through the proper consolidation pipeline. Companion
  entry: 2026-04-30 `feedback_no_delete_git_lock` is the destructive
  shape; this is the autonomous-observation shape; both are
  instances of *avoid actions that compound silently in destructive
  directions even when each individual step looks safe*.
- 2026-05-03; **session-close housekeeping ownership** (Woodland
  Sprouting Glade + Prismatic Illuminating Eclipse parallel-lane
  session, owner-stated experiment observation): at session-close some
  housekeeping is **agent-specific** (own observations in napkin,
  identity-row last_session, claim close, subjective experience file)
  and can ONLY be done by the originating agent — no other agent has
  the in-memory context. Other housekeeping is **NOT agent-specific**
  (refresh repo-continuity.md, refresh pending-graduations register,
  sweep platform entry points, commit prior-session leftover continuity
  files, run consolidation gate) — any agent could do it, which means
  without explicit ownership none of them does and work is lost or
  stale. **Cure shape**: when an Orchestrator role is assigned for a
  session, the Orchestrator owns shared / not-agent-specific
  housekeeping. When no Orchestrator is assigned, the
  **last-to-leave** rule applies (final committing agent picks up the
  shared housekeeping). Agent-specific housekeeping remains the
  originating agent's responsibility regardless. **First instance
  (live)**: this 2026-05-03 handoff — the prior Pelagic session ended
  with five continuity files modified-but-uncommitted; without the
  rule, every subsequent agent assumed someone else owned them. Owner
  direction at session-handoff fixed it. Source-surface: napkin §"E1
  Parallel two-agent execution" 2026-05-03 + experiment-plan §P11
  candidate; graduation-target: P11 in N-agent collaboration
  hypothesis (`hypothesis.md`) plus a Practice-Core PDR amendment to
  PDR-018 (Planning discipline) or a new dedicated PDR if the cure
  shape stabilises across N≥3; trigger-condition: validation across
  N≥3 sessions with no falsifying observation. Status: owner-gated —
  owner decision needed to promote, keep the N>=3 watch live, or withdraw.
- 2026-05-02; observability multi-sink + fixtures plan WS0 —
  near-miss surprise: almost spawned a duplicate
  `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` stub
  before checking the existing `future/` directory; caught when
  listing during WS0 promotion. Trigger: second instance of new-plan-
  stub-spawn-without-future-survey; graduation target: distilled.md
  § Process entry naming "directory survey before plan-stub spawning"
  OR amendment to `consolidate-at-third-consumer.md`; status: pending
  (single instance; capture-only until second instance accumulates).
  **Curation disposition (2026-05-27)**: owner-gated. No second
  plan-stub-survey instance was found in durable surfaces. Owner decision
  needed: promote a directory-survey-before-plan-stub rule now, keep the
  watch live, or withdraw it until recurrence.
- 2026-05-03; **atomic, independent cycles for optional
  parallel-agent dispatch** — new planning discipline landed this
  session in `.agent/commands/plan.md` requirement 3,
  `.agent/plans/templates/components/tdd-phases.md`
  §"Atomic, independent cycles for parallel dispatch", and
  `.agent/plans/templates/feature-workstream-template.md` §"Cycle
  Dependencies and Parallelisation". Substance: where the work
  shape allows, cycles should be made independent of each other
  (separate file scopes, executable acceptance, self-contained
  briefs) so each can be handed to a parallel agent without
  mid-work coordination. Declared via optional `depends_on: []`
  field on the YAML todo plus prose markers in the cycle body
  (Parallel-safety, Starting state, File scope, File scope NOT
  to touch). Plan-author discipline: do not invent serial
  dependencies the work shape does not require. Trigger: second
  Practice-bearing repo adopts the same discipline OR owner
  direction. Status: pending (single-instance — graduates as a
  PDR candidate when N≥2 host repos pick it up, or when owner
  directs). Captured: 2026-05-03 (Lush Spreading Seed). Source
  surface: this session's plan-template restructure following
  the TDD-as-pairs landing. Graduation target: a new PDR in
  `.agent/practice-core/decision-records/` covering atomic
  cycles + dependency declaration + parallel dispatch as a
  portable Practice-governance principle, with this repo's
  adoption already evidenced in the planning-template surfaces.
  **Curation disposition (2026-05-27)**: owner-gated. Host-local
  adoption is already live in the plan-template surfaces; portable
  Practice-Core promotion still needs owner direction or a second
  Practice-bearing repo adoption instance.
- 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: owner-gated. Owner decision
  needed to promote the existing skill-level sweep into PDR-014, keep it
  skill-local, or wait for another drift instance.
- 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: owner-gated. No second
  protocol-plan instance was found, and the workstream-brief surface has
  since been retired into thread/lane state. Owner decision needed to
  promote a refreshed thread/lane vocabulary version into plan practice,
  keep watching, or withdraw.
- 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: owner-gated. Existing
  PDR-029 self-application doctrine overlaps, but the narrower sibling
  pattern still lacks different-lane evidence. Owner decision needed to
  graduate it now or keep the archived evidence as sufficient until a
  different-lane instance appears.
- 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: owner-gated. The archived napkin
  evidence preserves the checklist and failure mode; no second
  skipped-alignment instance was found. Owner decision needed to promote,
  keep watching, or withdraw.

## Team Autonomy Gates

### Autonomy substrate gap: first-out-closeout-owner self-election protocol when no closeout owner declared at team-start

`[CANDIDATE: first-out-closeout-owner-self-election-protocol | captured: 2026-05-23 | source: napkin+comms-log+owner-direction | target: doc-amend:.agent/skills/start-right-team/SKILL-CANONICAL.md | trigger: candidate | size: M | status: owner-gated]`

Owner correction at 06:54Z + 06:57Z (codified to per-user memory as
`feedback_owner_action_is_not_a_cure`): *"owner action is not a valid
cure for anything, we are working towards agent autonomy here, and
for now user resolution is sometimes required, but it is not the end
goal."* Every observation of the form *"X failed → owner directed Y →
Y worked → therefore Y is the cure"* points instead at *"X failed →
autonomy substrate did not provide the primitive that would have
produced Y → owner bridged the gap → the bridge itself indicates the
missing autonomy primitive."*

**Worked instance from this session**: the 2026-05-22 → 2026-05-23
team session ran with NO closeout owner declared at team-start. As
the team wound down (Foamy paused; Sparking session-complete; Velvet
idle; Stormbounds silent then briefly active), there was no agent-
readable mechanism for the team to self-elect a first-out closeout
owner. Owner intervention named me (SVW) as the first-out closeout
owner. That naming was the bridge over a missing autonomy primitive.

**The missing primitive** (graduation-target): an amendment to
`start-right-team` §Closeout Contract giving agents a clear protocol
for self-electing the first-out closeout owner when none was named
at team-start. Candidate shapes for the SKILL amendment (do not pick
prematurely; the right shape needs design work):

1. **Broadcast-arrival precedence**: the first agent to announce
   intent-to-close in comms holds the first-out role (with tie-breaking).
2. **Pre-handoff-synthesis precedence**: the agent whose
   pre-handoff-synthesis broadcast has the earliest `created_at`
   timestamp self-elects once N team members have also posted
   pre-handoff syntheses. Builds on the empirical pre-handoff-
   syntheses pattern observed this session.
3. **Coordinator-poll**: if a coordinator was named at team-start,
   they retain closeout-owner naming authority on stand-down; if
   none, fall back to a precedence rule.
4. **Explicit at-team-start declaration**: amend `start-right-team`
   to require a tentative closeout owner be named in the team-start
   broadcasts (revisable at any time), removing the implicit-
   no-owner case entirely.

**Additional autonomy primitives** Stormbound Spiralling Breeze
surfaced in their amended closeout (also worth pending-graduations
entries; cross-link rather than duplicate if there are existing
register entries):

- **Coordinator-discovery for arriving agents** — query comms stream
  for active coordinator without owner naming names.
- **Standby-role defaults as first-class boundaries** —
  reviewer-dispatch / consolidation-observer / plan-file-only-follow-on
  as named roles arriving agents can self-select into without
  coordinator pairing.
- **Coordinator polling responsibility for unbriefed arriving
  agents** — active coordinator (if one exists) reads the comms
  stream for arriving-agent team-start broadcasts and routes them
  within bounded time.

These are all autonomy-substrate work-items. Stormbound's per-user
memory `feedback_owner_action_is_not_a_cure` is the standing
doctrine they discharge against.

### 2026-05-23 — SKILL amendment: Director ratification checklist + three-mode standby (start-right-team §3)

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger: second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 (Candidate, 2026-05-23) names a routing-moment
ratification checklist (6-7 per-moment + 4 periodic structural questions per
assumptions-expert finding 4 + 5) and a three-mode standby model
(silent / substrate-work / routed-slice) as the operational core of effective
directing. These belong on the active grounding layer for any agent holding the
Director role. The SKILL surface `start-right-team` §3 ("Choose Temporary
Responsibilities") is the natural home; it is already read at every
team-bootstrapping moment and at every Director handoff (PDR-064 Moment 2).

Cure shape: amend `start-right-team` §3 to embed (a) the routing-moment ratification questions verbatim from PDR-074 §"Routing-moment ratification checklist", (b) the four periodic structural questions (S1–S4), and (c) the three-mode standby model with holding-reason articulation as a Director obligation for any standby period >5 minutes. Cross-link to PDR-074 as substrate authority.

Why pending: PDR-074 is currently `Candidate`; second-instance evidence (a second multi-Director session ratifying the model in practice) is the natural promotion gate. The 2026-05-23 Seaworthy + Velvet + Seaworthy-acting windows are the first instance; a second window applying the checklist in real time strengthens the case from candidate → graduation-ready.

Falsifiability: a future Director session that ratifies decisions against the checklist and produces measurably tighter signal-to-noise / lower owner-attention split / lower busy-work output is the success shape. A session that finds the checklist unwieldy or its questions miscalibrated against real routing moments is the failure mode that revises the substance before graduation.

---

### 2026-05-23 — Rule pointer: director-ratification-checklist (active grounding layer)

`[captured: 2026-05-23 | source: pattern-emergence | target: rule:director-ratification-checklist | trigger: second-instance | size: S | status: owner-gated]`

Substance summary: thin pointer rule at
`.agent/rules/director-ratification-checklist.md` that fires whenever an agent
holds the Director role, referencing the `start-right-team` SKILL §3 amendment
(sibling entry above) for the actual checklist + standby model body. Two-layer
pattern matches the existing estate: SKILL holds the substance, rule provides
the always-loaded trigger pointer.

Cure shape: single-paragraph rule file naming the trigger condition ("when this agent is acting Director — newly assigned, on handoff receipt, or for the duration of a held Director window") and pointing to the SKILL amendment for substance. No content duplication; pure routing surface.

Why pending: gated on (a) PDR-074 promotion from Candidate → Accepted and (b) the sibling SKILL amendment landing. The rule is meaningless without the SKILL substance to point at, so it must land second.

Falsifiability: a Director session that lands the rule first, finds the SKILL substance has drifted from the checklist text, and the rule pointer dangles is the failure mode. Coordinated landing (SKILL first, rule pointer second, both in the same consolidation pass) is the success shape.

---

### 2026-05-23 — Autonomy primitive P1: pre-positioned routing logic (rule + SKILL amendment)

`[captured: 2026-05-23 | source: pattern-emergence | target: multi:rule:pre-positioned-routing,skill-amend:start-right-team | trigger: second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P1 names pre-positioned routing as a Director obligation: every owner-decision-gated slice carries pre-positioned routing in the comms stream, contingent on verdict shape. Post-verdict moves become light-up of pre-existing intent, not re-think. This shrinks the owner-attention window from "decide + wait for routing + ratify routing" to "decide; routing already in place."

Worked instance: Velvet Dimming Shadow's Tranche C/B/A pre-positioning broadcast (2026-05-23 Director window) named the routing for each tranche before the owner verdict on tranche ordering arrived. When the verdict landed, agents lit up against the pre-positioned slots rather than re-evaluating.

Cure shape: (a) rule at `.agent/rules/pre-positioned-routing.md` naming the obligation and the failure mode (reactive post-verdict routing); (b) SKILL amendment to `start-right-team` §3 listing pre-positioning as one of the routing-moment ratification questions (already Q1 in PDR-074 §"Routing-moment ratification checklist"). The rule is the always-loaded trigger; the SKILL is the substance.

Why pending: one strong worked instance so far (Velvet's Tranche C/B/A). Second instance in a different Director window, with a different verdict-gated slice, confirms the primitive before formal graduation.

Falsifiability: a Director session where the owner decision arrives and the team scrambles to re-evaluate routing (rather than lighting up pre-positioned slots) is the failure mode. A session where the routing was pre-positioned and the verdict produced immediate light-up is the success shape.

---

### 2026-05-23 — Autonomy primitive P2: owner-decision-elision via substrate-resolution (rule-shaped)

`[captured: 2026-05-23 | source: pattern-emergence | target: rule:owner-decision-elision-via-substrate | trigger: second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P2 names a
first-ratification-question discipline: when a decision arrives at the Director
surface, the first question is *can the team resolve this via
reviewer-dispatch, sidebar, or vote?* If yes, route to substrate; only escalate
to owner with substrate-resolution-attempted-and-failed evidence. The primitive
shrinks the owner-action surface one decision at a time by tagging every
owner-decision arrival with a substrate-resolution check.

Complements per-user memory `feedback_no_question_when_answer_is_forced` (don't surface multiple-choice when analysis already determines the answer) and `feedback_owner_action_is_not_a_cure` (owner intervention is a stopgap, never the architectural goal). P2 names the active discipline that operationalises both: every owner-decision arrival is a candidate for substrate-resolution elision.

**Load-bearing constraint** (per architecture-expert-fred + assumptions-expert review): substrate-resolution is *attempted-and-evidenced*, not silent elision. When the team escalates, evidence-of-substrate-attempt-and-failure accompanies the escalation. This protects against silently skipping owner-decisions that genuinely require owner attention.

Cure shape: rule at `.agent/rules/owner-decision-elision-via-substrate.md` naming (a) the first-ratification-question wording, (b) the three substrate-resolution paths (reviewer-dispatch, sidebar, vote), (c) the substrate-attempted-and-failed evidence requirement when escalation is necessary. Sits adjacent to `feedback_no_question_when_answer_is_forced` and the no-cheap-cure / no-passback rule estate.

Why pending: PDR-074 is the first explicit naming; second-instance evidence (a Director session that visibly elides an owner-decision via substrate-resolution and the elision holds) is the promotion gate.

Falsifiability: a session where the Director escalates a decision to the owner that the team could have resolved via sidebar or reviewer-dispatch (and the owner says so) is the failure mode. A session that runs the substrate-resolution check and either elides successfully or escalates with substrate-attempted-and-failed evidence is the success shape.

---

### 2026-05-23 — Autonomy primitives P3 + P4: standing-direction graduation + slice-routing self-selection (multi-rule)

`[captured: 2026-05-23 | source: pattern-emergence | target: multi:rule:standing-direction-graduation,rule:slice-routing-self-selection | trigger: second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" names two paired primitives that together shrink the owner-action surface at session boundaries and slice-opening moments:

- **P3 (standing-direction graduation)**: the Director actively identifies owner-direction substance worth graduating to standing rules at session close and routes the graduation work to an implementer — rather than waiting for the owner to manually trigger consolidation. Closes the loop between session-scoped direction (`feedback_owner_direction_scope` — direction is session-scoped unless explicitly standing) and the standing-rule estate.

- **P4 (slice-routing self-selection)**: when a slice opens, the Director broadcasts *slice + substrate authority + criteria for fit* and lets agents self-elect via comms with their own fit-assessment. The Director ratifies if multiple elect (first-broadcast convention) or if no one elects (escalate). Shrinks the Director-as-allocator bottleneck named in PDR-074 structural property D.

Partial worked-instance evidence: Clouded's transparent self-organisation broadcast (Velvet handoff §6.2) — agents self-electing into substrate work against Director-broadcast criteria.

Cure shape: two co-landing rules — `.agent/rules/standing-direction-graduation.md` (Director obligation at session-close) and `.agent/rules/slice-routing-self-selection.md` (broadcast-and-self-elect protocol for slice opening). Cross-link each other and PDR-074.

Why pending: P3 has no clear worked instance yet (no session has visibly run the graduation routing as a Director closeout move); P4 has partial evidence (Clouded broadcast) but no second instance. Both promote together because they pair structurally (P3 names the substrate, P4 names the routing protocol that lights it up).

Falsifiability: a session that closes with owner-direction substance left un-graduated and the next session re-discovering the same substance is the P3 failure mode. A slice-opening moment where the Director allocates manually rather than broadcasting criteria-and-self-elect is the P4 failure mode. Co-application of both, with the substance landing as standing rules and slices lighting up via self-election, is the success shape.

---

### 2026-05-23 — Autonomy primitive P5: Director self-selection protocol (CANDIDATE — no worked instance yet)

`[captured: 2026-05-23 | source: pattern-emergence | target: pdr:P5-director-self-selection | trigger: candidate | size: L | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P5 (now deferred from
PDR-074 main body per assumptions-expert review) names a Director
self-selection protocol: when a Director retires, propose a named candidate for
next Director in the Moment 1 broadcast with explicit criteria; the candidate
self-ratifies or declines; other agents can challenge; owner intervenes only if
the team cannot resolve. Shrinks the owner-action surface for one of the
highest-friction handoffs (PDR-064 Moment 1 is currently owner-driven).

**Explicit status: CURRENTLY UNPROVEN.** Both 2026-05-23 Director transfers (Seaworthy → Velvet → next) were owner-directed; no session has yet demonstrated the team self-selecting a Director on retirement with owner ratification post-hoc. Deferred per assumptions-expert review during PDR-074 authoring.

Cure shape: own PDR (not a rule) because the protocol is large enough to
warrant separate substrate authority: Moment 1 broadcast format,
criteria-naming convention, challenge window, escalation path, and the
team-can't-resolve owner-fallback. Specifically, per architecture-expert-fred
finding 2, the cure needs a bounded challenge window with explicit timeout
interlocking with PDR-064 Moment 2 cadence; if no Moment 2 active-ack lands
within the bounded window, escalate to owner. PDR drafting itself is gated on
first worked instance.

Why pending (with `candidate` trigger): no second-instance gate applies because there is no first-instance evidence yet. The trigger condition is *first worked instance* — a session where the team self-selects a Director on retirement (Director proposes candidate; candidate ratifies; no challenge or resolved challenge; owner ratifies post-hoc). Capture-only until that instance lands.

Falsifiability: a session that attempts P5 and the team-can't-resolve fallback fires (owner must intervene anyway) is the failure mode that revises the protocol. A session where the protocol runs end-to-end without owner intervention until post-hoc ratification is the first-instance success and unblocks PDR drafting.

---

### 2026-05-23 — Three-mode standby model with Director holding-reason articulation (SKILL amendment)

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger: second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Idle-cost balance" names a three-mode
standby model that converts the Director's standby-handling from invisible
failure-mode to observable state. Three modes:

- **Silent standby** — Director has articulated an explicit holding-reason;
  agents read comms, hold context; minimal idle cost, zero busy-work risk.
- **Substrate work** — Director has named a substrate-work boundary, OR agent
  self-elects from an authorised standing list (pattern-completion-only:
  failure-mode capture, reviewer brief preparation, pre-grounding on slices
  already named in the comms stream, napkin updates, comms-read-forward).
  Pattern-creation (inventing PDRs, proposing tranches, drafting plans,
  refactoring unprompted) is NOT authorised substrate work.
- **Routed slice** — Director has routed an opened slice; normal focused implementer cost profile.

**Director obligation**: every standby period >5 minutes carries an explicit
Director-articulated holding-reason in the comms stream. Three legitimate
shapes per PDR-074: (a) holding for owner-attention coherence (silent default),
(b) holding for gate-clear / cascade-clear (silent default), (c) holding open
for substrate work with an authorised standing list (agents self-elect).

Cure shape: amend `start-right-team` SKILL §3 to embed the three-mode model and the holding-reason-articulation obligation alongside the ratification checklist (sibling Entry 1). The pattern-completion-only constraint on substrate work is load-bearing — without it, idle agents drift into pattern-creation busy-work, which PDR-074 names as worse than idle.

Why pending: PDR-074 is `Candidate`; second-instance evidence (a Director session that runs the three-mode model with visible holding-reason broadcasts and clean substrate-work / pattern-creation boundary) is the promotion gate. The 2026-05-23 sessions are first-instance.

Falsifiability: a session where standby periods >5 minutes carry no articulated holding-reason, OR where "substrate work" drifts into pattern-creation (unsolicited PDRs, unprompted tranche proposals), is the failure mode. A session where every standby period carries an explicit holding-reason and substrate-work stays inside the pattern-completion list is the success shape.

---

### 2026-05-23 — Autonomy primitive P6: Director-routing-blockage-detection-and-cure protocol (PDR-shaped)

`[captured: 2026-05-23 | source: pattern-emergence | target: pdr:P6-director-routing-blockage-detection | trigger: second-instance | size: L | status: owner-gated]`

Substance summary: a structural protocol that fires *without* requiring owner intervention when a Director session exhibits one or more of the failure modes Seaworthy→next handoff §6.7 names — hoarding implementer work, mis-classifying idle agents, over-ceremonious bundling. The protocol detects each via observable signals and cures each via routing actions the Director or peer agents can take inside the existing comms substrate.

**Three sub-primitives** under P6, each cured per the corresponding §6.8 owner-intervention:

- **P6a — Hoarding-detection trigger**: when the Director-class agent has
  authored ≥N implementer-class artefacts (sub-agent dispatches, source edits
  beyond routing, drafts that should be routed) within a routing-window of
  duration D, and ≥M implementer-class agents are idle, surface as observable
  signal. Cure: peer-agent or self-ratification against PDR-074 ratification
  question Q6 (*Did I take this on, or did I route it? If took on — why?*).
- **P6b — Ceremony-over-pragmatism detection**: when total bundle-ceremony
  overhead (claim-opens + queue-enqueues + marshal-requests +
  reviewer-dispatches + verdict-windows) across team-window W exceeds the
  substantive routing-unblock benefit by ratio R, surface as observable signal.
  Cure: Director-authorised ceremony-bypass for one routing-unblock action.
- **P6c — Idle-misclassification cure**: covered upstream by the comms-watch
  self-exclusion-only cure (Bundle 3 / `1ea4e2e1` wide-sweep). Director
  broad-awareness sees cross-agent cross-traffic correctly post-cure; idle
  classification can ratify against observed traffic. May be redundant with P6
  main body after comms-watch cure stabilises; defer second-instance evidence
  to confirm.

Worked instance: Seaworthy's acting-Director window 11:30Z–12:06Z produced all
three sub-failures within ~36 minutes; owner cured each with a single directed
action. Each cure names a missing structural primitive per
`feedback_owner_action_is_not_a_cure`. Counter-evidence (Director sessions
without P6 failures) exists in Velvet's window 10:48Z–11:04Z, suggesting P6 is
not load-bearing for every Director session — it fires under specific
context-pressure shapes.

**Second worked instance (2026-05-23T12:36Z, SHA:`db275c09`)** — refined in
by Secret Creeping Moth / `61d726` under Abyssal routing `14b56fc7` at
12:44:35Z. About 41 minutes after the first wide-sweep (SHA:`1ea4e2e1`), a
second emergency-unblock landed: owner-authorised one-time `--no-verify`
mega-commit absorbing 58 outstanding changes plus owner-authorised one-time
`HUSKY=0` push. Escalation pattern from first instance: ceremony-bypass →
hook-bypass + push-bypass. The second cure was more aggressive because the
structural failure mode had deepened: Incandescent's Monitor-harness cure
mid-refactor blocked all commits team-wide via pre-existing type-check + lint
failures per Seaworthy `c19177c6` at 12:33:48Z. This strengthens the
motivating evidence: the failure mode is not anomalous to one session, and
successive cures require more owner-attention each time. Promotion gate (one
autonomous P6 cure) remains UNMET — second instance is owner-cured again, not
team-autonomously-cured. The very session that authored P6 demonstrated its
motivating failure mode twice without P6 firing once. See napkin entry
"Extension: second mega-commit emergency-unblock" 2026-05-23 for full
worked-instance substance.

**Adjacent substrate gap, NOT folded into P6** (flagged separately): the
HUSKY=0 portion of the second wide-sweep names a distinct substrate gap —
pre-push gitleaks scans historic commits not covered by per-commit allowlists;
the SHA-prefix rule (`.agent/rules/sha-prefix-in-collaboration-content.md`)
cures forward only. Possible cure shapes (auto-extend commit-allowlist at
marshal-emergency-bypass time / history-rewrite tool for SHA-prefix gap-fill /
push-time gitleaks scope narrowing) are distinct from P6's
Director-routing-blockage scope and would dilute P6 if folded in. Capture this
as a separate pending-grad entry if a second-instance of the
gitleaks-historical-scan blockage lands.

**Load-bearing constraint** (anticipating reviewer pushback): P6 must not
promote to over-eager detection that flags every Director session. The triggers
are bounded by observable thresholds (N, D, M, W, R) calibrated against the
Velvet counter-example. PDR-Proposed authoring should derive the threshold
values from the Seaworthy + Velvet sessions as initial empirical anchors.

Cure shape: PDR-Proposed authoring (not a rule — protocol substance is too
large for rule format). Substrate spans observable-signal definitions,
ratification-question wording, cure-routing protocols, and the ceremony-bypass
authorisation shape. Cross-references PDR-074 (Director value), PDR-072
(autonomic learning), and `feedback_owner_action_is_not_a_cure`.

Why pending: one explicit worked instance (Seaworthy 2026-05-23).
Second-instance evidence (a Director session that detects-and-cures one or more
of P6a/P6b/P6c without owner intervention) is the promotion gate. Until then,
capture-only.

Falsifiability: a session where Director-class failure modes from §6.7 occur
and P6 sub-primitives are observable + applicable but do not fire is the
failure mode that revises threshold calibration. A session where one or more
sub-primitives fire correctly and cure without owner intervention is the
first-instance success that promotes from candidate → PDR-Proposed authoring
trigger.

Cross-references:

- Builds on PDR-074 (Director value as mind-coherence-per-owner-attention); §observable-property-6 (Director-surface protection enforced inversely) is the substrate P6 operationalises.
- Builds on PDR-072 (autonomic learning); P6c's idle-misclassification cure is upstream of PDR-072's autonomic-learning shape applied to broad-awareness.
- Standing memory: `feedback_owner_action_is_not_a_cure` is the durable doctrine P6 discharges. Each owner intervention cured a missing primitive; P6 codifies the substrate so the primitives are held structurally.
- Substrate dependency: P6c requires the comms-watch self-exclusion-only cure to be stable (Bundle 3 + Bundle 5 doc-completion); without correct broad-awareness, idle-misclassification cannot be reliably detected.

---

### Heartbeat-cron health-monitoring via watcher-staleness substrate (cure for platform-wide cron-drift episodes)

[captured: 2026-05-25 | source: napkin 2026-05-25 Misty entry + DM event `8c6bd26a` (Misty to Lunar cron-drift correlation) |
graduation-target: adr-draft:heartbeat-cron-health-monitoring OR amendment to ADR-186 §Migration discipline |
trigger: second-instance — confirmed (Misty 20-min + Lunar 17-min concurrent gaps 23:28-23:47Z 2026-05-24) |
size: M — substrate amendment to heartbeat emitter + watcher-staleness substrate |
status: owner-gated]

Context: Misty heartbeat cron silent 20 min (23:26 → 23:47Z) AND Lunar's
silent 17 min (23:28 → 23:45Z) in the same window. Two independent
Claude-platform Monitor cron loops degraded concurrently — strongly suggests
platform/harness-side cause, not agent-side. Mistbound's silence-without-
work-evidence at 23:11-onwards may have been the same episode (never
broadcast a recovery).

Cure shape: heartbeat-cron health-monitoring via the existing
`agent-tools/src/collaboration-state/watcher-staleness.ts` substrate — the
same surface ADR-186 §Substrate-as-API reserves for C5. The substrate
already supports staleness-file writes per-tick (watcher already uses it for
self-liveness); extending the heartbeat emitter to write the same kind of
per-tick staleness file would let peers detect "cron loop alive, just
silent" vs "cron loop dead". The retirement-detection rule could compose:
silence past 10-min threshold AND staleness-file last-written > 5× expected
cadence ago = retired; silence past 10-min AND staleness-file fresh =
cron-degraded false-positive.

Why pending: depends on whether the substrate extension is a sibling ADR to
ADR-186 or an in-place amendment; needs ground-state check of
`watcher-staleness.ts` to confirm the extension shape is non-breaking.

Falsifiability: post-cure, a Director's retirement-detection decision can
be made deterministically from (silence + staleness-file age) without
relying on git work-evidence cross-check (the current ping-before-escalate
cure). The current cure becomes belt-and-braces, not primary.

Cross-references:

- Composes with the PDR-078 / ADR-186 contract above and with the
  heartbeat-content-state-binding candidate above. Together they form a
  three-part cure family: (1) what heartbeat body says (state-binding), (2)
  how peers detect heartbeat-loop liveness (staleness-substrate), (3) what
  the contract specifies (PDR-078 cadence/threshold/exemptions).
- Adjacent worked-instance: see Misty napkin entry 2026-05-25 §Surprises;
  DM event `8c6bd26a` Misty → Lunar; cross-correlation observable in
  comms-event timestamps for both agents' heartbeat streams.

---

## Napkin Tail Gates

### Heterogeneous working-tree owner direction splits by attribution

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture E | target: pattern:heterogeneous-working-tree-split-by-attribution | trigger: second commit-all split-by-attribution instance | size: M | status: owner-gated]`

Mistbound captured an owner direction to "commit all files" against a
heterogeneous dirty tree: an in-flight Twilit CLI bootstrap refactor, an
unattributed source-class `mcp-handler.ts` fix, and a large substrate /
shared-state bundle. The chosen cure was not a literal bulk commit; it was a
three-commit split by attribution and atomicity so owner intent (durable
progress) and Practice constraints (reviewer convergence, atomic landing, and
source/substrate separation) all remained true.

Natural home: repo-local coordination pattern if a second owner "commit all"
window encounters mixed peer/source/substrate ownership and is resolved by an
attribution-preserving split.

Falsifiability: a second worked instance names the mixed file classes, the
owner-intent vs literal-form tension, the split chosen, and the evidence that
atomic peer work and unattributed source work were not hidden in a hygiene
commit.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Current repo search found no existing
repo-local pattern carrying this exact split-by-attribution shape outside the
active napkin, main-register pointer, and this file. Keep pending until a
second mixed owner-"commit all" window is resolved by attribution-preserving
split. Do not generalise one emergency split into doctrine.

Owner gate: decide whether this one-instance mixed-tree / attribution-preserving
commit watch should remain live until a second worked instance appears, or be
withdrawn as insufficiently proven for the current buffer-drain goal.

### Substrate-write commit window under high team cadence

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture F | target: pattern:substrate-write-window-coordination | trigger: second multi-writer shared-state staging race | size: M | status: owner-gated]`

Mistbound captured a staging-window race while landing substrate hygiene:
shared-state writers modified `.agent/memory/` and
`.agent/state/collaboration/` during the staging window, producing staged-count
drift and an `MM` active-claims state. The immediate repair was to rebuild the
pathspec list and audit the staged set. The durable question is the
coordination shape for short substrate-write windows under high team cadence.

Natural home: repo-local coordination pattern after a second shared-state
staging race. The candidate must preserve the existing rule that shared-state
files remain writable and commit-includable; the question is whether a brief
"substrate-write window open" broadcast or an explicit residue policy is the
cleaner coordination move.

Falsifiability: a second substrate hygiene commit observes concurrent
shared-state mutations during staging, records the coordination decision, and
shows whether a short broadcast window or residue policy reduced re-stage churn
without blocking knowledge capture.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Existing claim and commit-window rules
cover `git:index/head`, commit-queue ordering, and active file ownership; they
do not yet settle the narrower shared-state substrate-write window question.
Keep pending until a second shared-state staging race shows whether the durable
cure is a short broadcast window, an explicit residue policy, or no new pattern.
Any future cure must preserve the rule that shared-state knowledge writes remain
writable and commit-includable.

Owner gate: decide whether this one-instance substrate-write staging-race watch
should remain live until a second race clarifies the durable cure, or be
withdrawn because current commit-window and claim rules already cover the known
portion.

### Goal-backed handoff state must be explicit

`[captured: 2026-05-24 | source: active-napkin Sylvan persistent-goal handoff capture | target: session-handoff-or-platform-pattern:goal-backed-session-close | trigger: second goal-backed stop/wind-down conflict or owner-direction to codify handoff step | size: S | status: owner-gated]`

Sylvan captured a handoff failure mode where the owner repeatedly asked to wind
down or stop, but a persistent goal wrapper kept reactivating the Knowledge
Curator objective. The reusable shape is not "always mark blocked"; the
reusable shape is that handoff must make the goal state explicit when an
unfinished long-running objective remains active after owner stop/wind-down
language.

Natural home: `session-handoff` amendment if this is repo-workflow doctrine, or
a platform/goal-runner pattern if the behaviour belongs to the wrapper that
resumes active goals. The repo-facing handoff move should be precise: complete
only with proof, block only when the blocked-audit threshold is satisfied, or
state that the persistent goal remains active and can resume.

Falsifiability: a second long-running goal-backed session reaches owner
wind-down/stop while unfinished, and the closeout either resolves the goal state
or visibly carries the active-goal continuation risk.

Processing disposition: verified 2026-05-24 under Shaded claim
`d7fe5974-56b1-45d4-92aa-b09d23911313`. Keep pending because the rule boundary
crosses repo workflow and platform goal-runner behaviour. Do not promote until
the trigger clarifies whether the durable cure belongs in `session-handoff`,
platform memory, or the goal wrapper itself.

Owner gate: decide the durable home for goal-backed closeout state: repo
`session-handoff`, platform goal-runner behaviour, or the already-landed
`consolidate-until-done` wrapper. Until that boundary is owner-ratified, this
entry stays live as an explicit user-decision item.

## Collaboration Mode Gate

## n=2 coordination efficiency

[captured: 2026-05-25 | source: owner-direction | target:
multi:pdr:PDR-082-n2-collaboration-mode+skill-amendment:start-right-team-§1 |
trigger: owner-direction | size: M | status: owner-gated]

**Partial graduation 2026-05-25** (Stormy Surfing Dock `2a7b65`,
post-handoff consolidation pass): first-stage durable home authored at
[`.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md`](../../../practice-core/decision-records/PDR-082-n2-collaboration-mode.md)
— Proposed first-draft (uncommitted in working tree at handoff close;
Fiery marshal handoff cycle to sweep). Second-stage graduation = SKILL
`start-right-team` §1 amendment, owner-gated on PDR-082 ratification
(Proposed → Adopted via second n=2 session validation per PDR-026
falsifiability). Route choice: PDR (Practice-governance, portable)
over Fiery's initial ADR framing — per PDR-079 (PDR-vs-ADR portability
distinction, graduated 2026-05-25), n=2 mode is a Practice protocol
question, not an architecture question for this repo. ADR target
dropped from the metadata accordingly.

**Substance**. Owner direction 2026-05-25T~15:03Z: "massively tighten coordination
efficiency for teams of two agents, n=2". The Fiery+Stormy n=2 coordination on PR #115
took 6+ comms events (directed acks, broadcast acks, tree-green, kind-corrections,
standby heartbeats) to land 2 sequenced commits. Each event added context-budget tax +
watcher-tick latency. Total coordination ceremony cost dwarfed the actual fix work.

**Failure mode named: n=2 over-coordination**. n=2 is the smallest peer-pair case and
should be the LIGHTEST coordination shape (peer-sidebar default per existing feedback
`peer-sidebar-beats-coordinator+helpers`); instead it carried full multi-agent ceremony
designed for n≥3 windows. Comms-event count growth was N (each fix gets its own
broadcast + ack + sync) instead of O(1) (single coordination event).

**Cure shape (structural, not doc-patch)**:

1. **n=2 minimal-coordination contract** (target: SKILL `start-right-team` §1 amendment
   and ADR): when n=2 confirmed at team-start, agents declare "I do X, you do Y" in ONE
   coordination event; no further coordination until work-product lands or genuine
   dependency emerges. No ack-the-ack. No tree-green broadcast (peer polls git +
   active-claims directly).
2. **Independent-ship default for n=2**: each agent ships their own slice independently;
   sequencing only required when files actually overlap. Commit-queue handles
   serialization at the index/head level.
3. **Direct git interaction beats comms-event coordination for n=2**: for commit
   sequencing in n=2, agents read each other's commit-queue intents directly; no
   separate broadcast needed.
4. **Communication budget**: n=2 sessions should target ≤3 inter-agent comms events per
   work-cycle (declaration + final-landing + closeout); anything more is ceremony.

**Falsifiability**: next n=2 session lands equivalent paired commits with ≤3 inter-
agent comms events total (vs the 6+ this cycle used).

**Cross-references**: composes with existing `peer-sidebar-beats-coordinator+helpers`
feedback (sidebar shape is the lightest); composes with `coordinator-role-threshold`
(n≤3 is peer-collaboration default; n=2 is the lightest case); composes with PDR-082
(n=2 collaboration mode, drafted by Stormy Surfing Dock 2026-05-25 on this substrate).
