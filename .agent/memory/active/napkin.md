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
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-11.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-10.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-11.md
[previous-pass]: archive/napkin-2026-05-10.md

## 2026-05-11 — Dusky Masking Cloak / claude-code / opus-4-7-1m / `c5ff7f` (post-rotation start)

Rotation note: the 2026-05-11 archive carries ~14 sessions of accumulated
post-rotation capture from the 2026-05-10 Sylvan Sprouting Grove rotation
forward. Substance is preserved at full weight in:

- **PDR-057** (empirical-answerability pre-question gate) and **PDR-058**
  (three-tier optionality decomposition) — graduated 2026-05-10 by
  Quiet Lurking Mask from the quarantine corpus.
- **`pending-graduations.md`** — captured candidates with explicit trigger
  conditions including the 2026-05-11 entries from this session
  (ADR-041 amendment due; opener-vs-substrate divergence pending;
  different-lens reviewer divergence pending).
- **`distilled.md`** — 2026-05-09 and 2026-05-10 rotation distillations
  covering curation, coordination, tooling, planning arithmetic, PR
  closeout, generator, and multi-reviewer dispatch disciplines.

This rotation is the structural cure to the CRITICAL fitness signal
(napkin 655 lines / 39,232 chars vs critical thresholds 450 / 27,000)
per ADR-144 §Loop Health; no substance was compressed.

## 2026-05-11 — Forward pointers (post-session)

- **Next session in this thread (`agentic-engineering-enhancements`)**:
  graduation-candidates drain — focused pass on the two `due` items in
  `pending-graduations.md` (hook-chain re-staging amendment;
  ADR-041 top-level-workspace-tiers amendment for `agent-graphs/` +
  `agent-tools/`) plus a triage scan of recent `pending` additions.
  Opener at
  [`2026-05-11-graduation-candidates-drain-opener.md`](../../plans/agentic-engineering-enhancements/current/2026-05-11-graduation-candidates-drain-opener.md).
- **Graph thread (`connecting-oak-resources`) continuation**: taken up
  in parallel by **Mistbound Watching Lantern** on opener step 4
  (primary-agent-tooling-enhancements WS 2–5 implementation + B-01 fix).
  File scopes are disjoint from the graduation-candidates drain.
- **Architectural-excellence reminder carried forward**: we always
  choose long-term architectural excellence; we never compromise for
  expediency. This applies to both the graduation-candidates session
  (PDR/ADR amendments) and the graph implementation session
  (test-first atomic TDD; no audit-shaped tests).

## 2026-05-11 — Smouldering Crackling Pyre / `ab76ef` — R1.a session

- **SURPRISE — refuted premise at pre-flight, twice in two sessions on
  the same bug**: B-01 was first diagnosed as `--now`-not-populating-
  `created_at` (Blooming Growing Thicket, refuted in predecessor);
  predecessor re-diagnosed as two-family schema-mix (narrative +
  directed). My pre-flight fingerprint scan refuted THAT diagnosis
  too — there are actually three families with five accreted narrative
  variants. Lesson: when a bug-fix plan rests on a premise about
  *what's in the data*, run a fingerprint pass FIRST, before any
  shape decision. The cost is ~30s of `jq` plus an `awk` group-by;
  the value is catching premise errors before plan + reviewer
  dispatch + owner direction all rest on them.
- **SURPRISE — the live foreign-stage absorption event landed during
  the session designed to fix it**. Peer agent `Dusky Masking Cloak`
  / `c5ff7f` was committing in parallel on the graph thread; their
  pre-staged handoff files (napkin, thread-record, graduation
  opener) appeared in my index when I `git add`-ed my pathspec.
  The commit-queue `verify-staged` check structurally caught it
  (3 extra files, 0 missing). The cure was `git commit -F - --
  <pathspec>` per the stage-by-explicit-pathspec rule. R4-new's
  motivating use-case is no longer hypothetical; it is the
  literal recent past.
- **SURPRISE — hook policy blocks `git restore --staged` even with
  semantically safe intent**. The hook treats the literal pattern
  `git restore` as dangerous regardless of subcommand. Per
  `never-use-git-to-remove-work` rule + the policy, the canonical
  cure is filesystem-only forward-going changes — for the
  foreign-stage case that means `git commit -- <pathspec>` which
  commits only your files and leaves peer's pre-staged files in
  the index for them. The hook is correctly broad; the cure is
  correctly architectural.
- **SURPRISE — advisory orchestrator surfaces upstream fitness
  violations, not blocking, exactly as designed**. Pre-existing
  fitness signals on peer-touched surfaces (`napkin.md` critical
  line-width; `repo-continuity.md` critical lines+chars;
  `pending-graduations.md` HARD lines+chars;
  `practice-bootstrap.md` HARD chars) lit up at commit time. Per
  the orchestrator-vs-gate distinction (PDR-053 / ADR-176), these
  are advisory and routed to consolidation, not blockers for the
  current commit. The clarity of that boundary made the right
  action obvious: capture, route, proceed. The orchestrator did
  its job; the gates did theirs.
- **SURPRISE — `git commit -F - -- <pathspec>` requires options
  BEFORE the `--` separator**, not after. My first attempt placed
  `-F -` after the `--` and git read it as a pathspec. Quick fail,
  quick fix; record for future commits.
- **OBSERVATION — schema-as-canonical-protocol-with-directory-
  projection is a clean architectural shape** for "one protocol,
  multiple kinds, multiple physical locations". The owner's
  framing — "single source of truth for the protocol, not the
  same as single application" — names the abstraction cleanly.
  Candidate for pattern surface or PDR-shaped doctrine if a second
  instance emerges (e.g. claim-event-vs-claim-history-vs-claim-
  closure-archive split, or escalation vs sidebar vs joint-decision).
- **OBSERVATION — peer-coordination via "pre-stage and let next
  agent commit" is a workable handoff pattern** when paired with
  `verify-staged` and commit-by-pathspec. Peer left files staged
  with an explicit commit message draft in mind ("Mistbound
  Watching Lantern" was the anticipated next identity).
  Coordination happened entirely through the file system + commit
  state; no inter-agent comms-event was needed. The protocol's
  bare-minimum primitives (staged index + pathspec discipline)
  carried it.

## 2026-05-11 — Fronded Flowering Seed (graduation-candidates-drain session)

- **OBSERVATION — transient register inconsistency at session
  open**. At bootstrap fast-path scan `active-claims.json` `.claims`
  contained a stale entry for `059291ea` (Smouldering Crackling
  Pyre) even though that claim was already in
  `closed-claims.archive.json` with `closed_at: 2026-05-11T14:15Z`.
  Self-cleared between reads (likely periodic expiry sweep). Single
  observation; not a graduation candidate; record for awareness.
  If observed again at next session-open, treat as persistent drift
  and graduate to a register-self-cleanup gap.
- **OBSERVATION — different-lens reviewer divergence pattern at
  substance ripeness**. Six reviewer dispatches this session (3 per
  phase) each surfaced structurally distinct concerns — never
  redundant convergence. Phase 1: betty (Class A/B precedence +
  open-set overstatement); docs-adr (clean); assumptions (enumeration
  bounds + hook-staged-file definition). Phase 2: fred (clean
  principles); betty (matrix-cell scope precision); docs-adr
  (housekeeping). The pending entry "Different-lens reviewers catch
  different gaps" (captured 2026-05-11) is at substance-ripe state
  per the "triggers register on substance not instance count"
  memory; flagged for owner direction at next consolidation.
- **OBSERVATION — option-shape pre-selection at session open is
  efficient**. Opener author enumerated three architectural-
  excellence cure shapes for the hook-chain item; owner selected
  shape (iii) at session open via AskUserQuestion before any
  authoring work began. Let reviewer dispatch focus exclusively on
  execution-legitimacy, not shape-selection re-litigation. Pattern
  worth naming if a second instance shows the same pre-selection
  efficiency.
- **CORRECTED — forward-looking reviewer attestation in plan-state
  is a doc-quality violation**. I authored a "Reviewer attestations:
  ... (dispatched in parallel)" line in `graph-mvp-arc.plan.md:732`
  *before* reviewers had returned. docs-adr-expert flagged this
  correctly. Cure: name attestations only after they return;
  forward-looking claims fabricate evidence. Already corrected this
  session; record for discipline.
