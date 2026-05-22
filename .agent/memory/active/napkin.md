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

## 2026-05-22 evening — Velvet Veiling Wisp consolidate-docs backfill archive sweep / claude / Opus-4.7 / `b4bb7a`

### Two follow-up findings surfaced by assumptions-expert during pre-commit review

**Finding 1 — repo-continuity.md session-summary bullets need sub-bullet decomposition discipline (orthogonal structural cure).**
`.agent/memory/operational/repo-continuity.md` line 41 currently carries a 2615-character single-bullet paragraph (the Shaded Whispering Dusk session summary). The line concatenates sub-points (a)/(b)/(c) into one paragraph rather than splitting into sub-bullets. This is the structural cure for the prose-line-width metric on that file, orthogonal to the pending-graduations archive sweep this session executed. **Capture for next consolidation**: doctrine candidate that session-summary bullets must use sub-bullet decomposition when carrying multiple distinct sub-points, so the prose-line-width metric tracks substance shape and not concatenation habit. Capture surface: this napkin entry; graduation target candidate: `repo-continuity.md` split_strategy frontmatter amendment, OR a new rule on session-summary bullet shape. Trigger to fire: second instance of the same shape, OR owner direction.

**Finding 2 — 10 nested-bullet `status: graduated` entries from 2026-05-09 / 2026-05-10 / 2026-05-11 (Sylvan Fruiting Glade era) have bodies in `pending-graduations.md` that were NOT moved to any archive snapshot when their status flipped to graduated.**
Verified: `pending-graduations-archive-2026-05-10.md` carries 4 ### headers; none of the skipped entries' titles appear there. These entries' bodies have sat as audit trail for 12 days. Defect class: the graduation-pass discipline at the time did not archive bodies for nested-bullet entries (only top-level ### entries). Cure shape: a next-pass script with bullet-level boundary discipline to relocate those 10 bodies. Out of scope for this commit (assumptions-expert condition 3 explicitly defers). **Captured here so the defect remains visible until cured.**

### Observation: the script-based archive surgery succeeded where 30-entry hand-edit would have risked boundary drift

This session's archive sweep used a Python script (substance-extracting regex on ### YYYY-MM-DD — headers with `status: graduated` tag matching) rather than 20 sequential Edit operations. The script-based approach: (a) preserved 442 lines of substance verbatim with no boundary errors detected by docs-adr-expert spot-check; (b) handled all 20 entries in one atomic pass; (c) made the operation reproducible and reviewable as a discrete artefact. The hand-edit alternative would have multiplied the boundary-discipline risk 20-fold. Pattern shape: **for repetitive substance-relocation operations across many entries, script-the-surgery beats hand-edit-the-surgery; the script becomes the audit artefact.** Trigger to watch: second instance of substance-relocation work where a script gives both atomicity and reviewability. Graduation candidate target: pattern entry at `.agent/memory/active/patterns/` (general form: "Script substance-preserving relocations; the script is the audit artefact").

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

## 2026-05-22 — Deep-graduation pass under owner direction / claude / Opus-4.7 / `e35155`

### Observation: owner-direction graduation pass drained a substantial slice of the buffer

**Observation**: owner directive *"please run a deep graduation of
knowledge source materials, the napkin, the comms records, the
.remember directory, the vendor specific memory locations. Ignore
fitness metric levels for now."* fired as the owner-direction trigger
for entries that had been gated on that condition since 2026-05-17.
Eight Tier A graduations landed (5 new rules, 2 PDRs, 1 directive
amendment, plus SKILL amendments), nine Tier B candidates were
captured at pattern fidelity or PDR-Draft status, five per-user
memory entries had audit-trail markers updated.

**Diagnosis**: the pending-graduations buffer accumulates substance
gated on owner-direction or N+1 instance triggers; without a
periodic owner-driven drain, the buffer slowly fills with substance
whose triggers never fire spontaneously. The deep-graduation pass
is itself a worked instance of PDR-068's consumer-cadence cure —
the bottleneck was the "consumer cadence too low" diagnostic and
the cure was a focused owner-triggered drain.

**Cure**: deep-graduation passes under owner direction are a
legitimate consumer-cadence increase for buffer drainage. The
pattern can recur whenever the buffer accumulates substance gated
on conditions that don't fire spontaneously in normal session work.
Captured implicitly in PDR-068 §"Consumer cadence too low" cure;
the worked instance is this pass itself.
