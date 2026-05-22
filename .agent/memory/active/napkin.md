---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-22-evening.md`][archive-pass] (Charcoal Searing Flame
end-of-session consolidation; substance from the Velvet + Charcoal evening
plan-improvement collaboration on `commit-queue-intent-scope-discipline.plan.md`).
Three behaviour-changing observations promoted to
[`distilled.md`](distilled.md) under "Recently Distilled — 2026-05-22 evening":
event-driven wake uses Monitor not Bash background; peer-pair plan-improvement
across model families produces ~50% non-overlapping defect coverage; named
peers can arrive after first live checks (keep all-channel comms reconciliation
alive until final closeout). One pending-graduation candidate captured: dispatch
PENDING reviewers at session-close, not next-session-open
(session-handoff SKILL amendment).

Prior rotations are [`napkin-2026-05-22.md`][previous-pass]
(Wooded Swaying Thicket — 11 sessions across the 2026-05-21 → 2026-05-22 dual-lane
window), [`napkin-2026-05-21.md`][previous-previous-pass], and
[`napkin-2026-05-17.md`][previous-previous-previous-pass].

[archive-pass]: archive/napkin-2026-05-22-evening.md
[previous-pass]: archive/napkin-2026-05-22.md
[previous-previous-pass]: archive/napkin-2026-05-21.md
[previous-previous-previous-pass]: archive/napkin-2026-05-17.md

## 2026-05-22 — Starlit Beaming Aurora metacognition reshape + Cycle 1.3 arc closeout / claude / Opus-4.7 / `1977cf`

### Surprise: the inherited cycle decomposition was the load-bearing shape, not the type narrowing

**Observation**: I opened the session to review Cycle 1.3 of
commit-queue-intent-scope-discipline as authored. First pass found a real but
tactical defect: the plan's stated narrowing of `GetStagedBundleInput.pathspec`
to `readonly [string, ...string[]]` would cause ~8 type errors in existing test
files (passing `intent.files: readonly string[]` to a non-empty tuple parameter).
My initial recommendation was to narrow LESS — keep `GetStagedBundleInput`
loose, narrow only `runGitCommit` dep input. Owner challenge: "are you sure /
is that a problem?". Second pass: I retracted the count overstatement but
doubled down on narrow-less. Owner correction: *"step back and examine the
nature of the tests, are they good tests? Hint: no, they are too coupled to
implementation"* + *"avoiding improving systems because it creates work in
tests is a terrible trend"* + *"drive excellence, not avoid work"*. Third pass
under explicit metacognition skill: the cycle decomposition itself was the
inherited shape. One system state takes one describing surface; the scaffolding
tests were testing the wrong layer; the right shape was workflow-level
invariants in a single file.

**Diagnosis**: my first two passes were solving inside the inherited frame —
type-mechanics, then test-mechanics. Both stayed below the impact layer. The
frame itself (three cycles each describing an internal seam) had not been
ratified from first principles. When the owner said "step back more, completely
change your perspective", metacognition surfaced that the cycle decomposition
was the load-bearing shape that needed examination, not Cycle 1.3's narrowing
choice. Once reframed, the resolution was structurally cleaner: Cycle 1.3
becomes the cycle where the system state finally gets described at the workflow
seam; Cycles 1.1+1.2's scaffolding tests come down because they were testing the
wrong layer all along.

**Cure**: when planning multi-cycle structural changes, ask at plan-author time
**where the system state will be observable**. If the answer is "at one
boundary" (e.g. the workflow seam), every cycle's tests should describe that
one surface. Intermediate scaffolding tests written for the implementer's
confidence in internal-seam correctness have no claim on ongoing maintenance
cost. The lesson generalises beyond this plan and is a candidate for graduation
as a pattern or amendment to `testing-strategy.md` or `tdd-as-design.md`.
Captured in `pending-graduations.md` for the next consolidation pass.

### Surprise: max-lines lint signal correctly forced a module extraction

**Observation**: Cycle 1.3's product code naturally pushed `commit-workflow.ts`
and `cli.ts` over the workspace `max-lines: 250` limit. First inclination was
compress (inline wrappers, tighten formatting). Better cure: extract two new
modules — `pathspec.ts` (carries `CommitWorkflowPathspec` type +
`narrowIntentPathspec` function, shared by workflow and CLI) and
`verify-output.ts` (carries the CLI-side `writeVerificationResult` helper that
wraps `verifyStagedBundle`). Each new file has its own bounded concern and clean
boundary.

**Diagnosis**: the lint signal was correct — Cycle 1.3 added genuine new
concerns (pathspec narrowing + CLI-side narrowing helper + runtime threading)
that didn't all belong in `commit-workflow.ts`. The natural module boundaries
emerged from the work. Extraction simplified rather than complicated.

**Cure**: when `max-lines` fires on a file mid-cycle, the question is "is the
file genuinely doing too many things?" before reaching for compression. Often
the lint signal is naming a real conceptual boundary that wants its own module.

### Surprise: queue ceremony self-applied cleanly across three commits in one session

**Observation**: ran the commit-queue ceremony three times this session
(plan-amendment `989dc6b4`, Cycle 1.3 `896312d0`, Phase Final `3f6b258a`). All
three landed cleanly through the queue+claim+comms protocol. The Phase Final
commit was itself the worked instance of the just-landed structural cure: it
bundled SKILL update + closed-claims residue + comms event + shared-comms-log
update (lifecycle commit exception case), and the inner `git commit -- pathspec`
(Cycle 1.3's structural change) ensured the bundle was scoped exactly to the
four intended files.

**Diagnosis**: self-application is a soundness check. The arc that just landed
(intent-scoped commit) is the substrate the closing commit relied on. Without
Cycle 1.3, the Phase Final commit's lifecycle-residue bundling would have been
more delicate.

**Cure**: continue to use the queue ceremony for self-application moments;
they're the highest-quality validation of structural cures.
