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

## 2026-05-11 — Third-instance peer-commit absorption (Mistbound 67885e3f)

SURPRISE: peer-commit absorption is a third direction beyond what PDR-054 (pre-hook) and PDR-059 (post-hook husky-chain) cover. Mistbound's `67885e3f` used non-pathspec staging and swept six of my session-lifecycle files into their commit. My R1.b atomic commit (`b529fa6e`) was complete and unaffected; the absorption hit only my preparing session-close work.

OBSERVATION: my session opened with a sidebar to Fronded specifically to avoid this kind of overlap, and Fronded responded clean within 10 minutes. The sidebar protocol works for known peers. What Fronded and I did NOT anticipate: a third agent (Mistbound) entering the same shared-state surface mid-session with non-pathspec staging. Inter-agent comms-events between two agents do not prevent a third agent's non-pathspec commit.

OBSERVATION: the work was preserved (HEAD has my narratives + B-01 fix + comms events + claim moves). The cost is attribution drift and the operational friction of having to abandon my queue intent and close my claim with an absorption summary instead of a clean closure. No data loss; clear evidence accumulation.

OBSERVATION: this is exactly the third-instance trigger Fronded named in `544bf9bf` for the PDR-059 classification-gate implementation plan. Plus the new peer-commit-direction failure mode that should be considered when scoping that plan.

OBSERVATION (owner direction, 2026-05-11): next session in this thread will work on commit-queue UX (discoverability, ease-of-use, harder-to-bypass enforcement). The friction profile this session generated is the brief.

## 2026-05-11 — Mistbound Watching Lantern / claude-code / opus-4-7-1m / `8fdb8b`

### Surprise — opener premise stale by session-open (parallel-session race)

- **Expected**: the start-right-thorough opener (graph-execution-prep
  steps 1+2+3+4) describes work I would do, in the order described.
- **Actual**: by the time I checked `git log` past the initial system
  context snapshot, steps 1+2+3 had already been executed by a parallel
  session (Dusky Masking Cloak commits `66d4f0fb`, `579cde34`,
  `85bcbc41`, handoff `aae150a1` all within the hour before my session
  opened) and step 4 was in flight under Smouldering Crackling Pyre's
  session. My reviewer dispatch on step 1 was redundant — though it
  independently confirmed the absorption was correct and surfaced one
  new actionable item (ADR-173 topology Inc.1/Inc.2 annotation).
- **Why expectation failed**: the system-prompt git status snapshot is
  taken at session bootstrap; it does not refresh against parallel
  commits that land between snapshot time and my first git read. A
  start-right opener that names steps as if they were unclaimed work
  is implicitly a snapshot-time claim, not a live-state claim.
- **Behaviour change**: after reading any opener, run a fresh `git log`
  before claiming work; check `shared-comms-log.md` for parallel
  session activity; reconcile against the live tree state before
  dispatching reviewers or making edits. The opener is a hypothesis;
  the live state is the truth.

### Confirmation — Soaring Darting Kite's third-instance peer-commit absorption note

Soaring Darting Kite's preceding napkin entry correctly names this
session's `67885e3f` as the third-direction absorption beyond
PDR-054/PDR-059. Their attribution holds: my MVP arc commit's
explicit pathspec was a single file; six of their session-lifecycle
files joined the bundle through the husky hook chain's auto-staging
seam. Owner accepted the bundle and named the next-session brief as
commit-queue UX (discoverability + ease-of-use + harder-to-bypass
enforcement) — that brief is the right home for the queue-friction
this session generated, named in the next-session starting statement.

### Surprise — commit-queue protocol failed twice in one session

- **Expected**: `pnpm agent-tools:commit-queue -- enqueue / phase /
  record-staged / verify-staged / complete` runs the canonical commit
  protocol per the always-active commit skill.
- **Actual, instance 1**: enqueue invocation failed with TypeScript
  build errors in `agent-tools/src/practice-substrate/live-json.ts`
  importing `parseCommsEvent` / `CommsEvent` / `createCommsEvent` —
  types that Smouldering Crackling Pyre's in-flight schema refactor
  had removed but not yet committed. The queue tool runs `pnpm build`
  as a prelude; when peer agents have incompatible unstaged edits, the
  build fails and the queue is unusable.
- **Actual, instance 2**: after Smouldering's commit landed
  (`b529fa6e`) and the build passed, retried the protocol. The
  `record-staged` step (which also runs `pnpm build`) appeared to
  clear the index between my `git add` and verify-staged — verify
  reported "missing: graph-mvp-arc.plan.md" despite my having staged
  it moments earlier.
- **Behaviour change**: when the queue tool fails due to ambient
  workspace state, stage-by-explicit-pathspec + direct `git commit`
  is the documented fallback per the skill's "queue is advisory"
  framing. Surface the friction (this entry); do not silently work
  around. Architectural candidate: the queue should not run the full
  agent-tools build on every command — the queue is a small JSON state
  machine; coupling it to ambient build health makes it fragile under
  parallel-agent conditions. Captured for the next-session
  commit-queue-UX brief.

### Doctrine ratified — schedule it, sequence it, no imaginary flows

- **Owner direction 2026-05-11 (verbatim)**: *"schedule it, sequence
  it, no imaginary flows, simple and definite is the only way anything
  happens."*
- **Context**: I asked about Betty's combinatorial-arc latency tripwire
  finding (3 options including "tripwire on Inc.2/3 slip"). Owner
  rejected the conditional-trigger framing entirely.
- **Generalisation**: plans should commit to concrete scheduled
  sequence positions ("after gate-1 lands, next is X, then Y"), not
  conditional triggers ("when X ships," "depends on Y future," "trigger
  fires on Z"). Work doesn't happen on the basis of imagined event
  chains — it happens on the basis of scheduled sequence positions.
- **Behaviour change**: applied across MVP arc this session; pending
  for graph-stack and graph-combinatorial-arc (next session). Captured
  as a feedback memory.

### Correction — agents default to no gender

- **Owner correction 2026-05-11 (verbatim)**: *"no agents have gender,
  unless they decide they do."*
- **Context**: I used "her" referring to Smouldering Crackling Pyre.
  Names are evocative phrase-pairs with no inherent gender.
- **Behaviour change**: default to they/them when referring to any
  other agent; gendered pronouns require self-declaration. Applies
  everywhere — chat output, commit messages, napkin, claims. Captured
  as a feedback memory.

## 2026-05-11 — Embered Burning Magma / codex / GPT-5 / `019e18`

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state comms send`
- **Signal**: surprise
- **Observation**: session-open `comms send` wrote the event JSON for
  `670c54f3` but exited 2 before rendering `shared-comms-log.md`, with
  `Error: optional field addressed_to must be a non-empty string when
  present`, even though the caller did not pass `--addressed-to`.
- **Behaviour change / candidate follow-up**: treat this as fresh B-10
  evidence: optional CLI fields must be omitted from the payload when
  absent, not forwarded as empty strings. Until fixed, inspect whether
  a failed `comms send` left a valid event file before retrying, to
  avoid orphan or duplicate events.

### Correction — `comms send` render failure is legacy-shape input, not caller empty-field forwarding

- **Surface**: `agent-tools:collaboration-state comms send`
- **Signal**: correction to my earlier hypothesis
- **Observation**: peer reply event `62b5ad1b` reproduced the same
  exit-2 shape. Inspecting the freshly written event showed no
  `addressed_to` field at all. `rg addressed_to` instead found older
  narrative events with object-shaped `addressed_to`; the current parser
  expects a non-empty string. The write step succeeds, then render fails
  while reading legacy corpus events.
- **Behaviour change / candidate follow-up**: B-10 should distinguish
  shell/CLI optional-field handling from render-time legacy-data
  incompatibility. Until fixed, failed `comms send` may still leave a
  valid event JSON and require manual shared-log rendering.

## 2026-05-11 — Shaded Ripening Copse / claude-code / opus-4-7-1m / `c13bdf`

### Observation — schedule-not-trigger doctrine sweep is mostly mechanical

- **Expected**: applying the schedule-not-trigger doctrine to
  `graph-stack.plan.md` + `graph-combinatorial-arc.plan.md` would
  surface multiple genuine open decisions needing owner input
  (Inc.4 dep shape, Inc.7 trigger type, cross-plan trigger location).
- **Actual**: only one genuine open decision survived owner direction
  — O-1 WS0 topology ADR approval (which was already named as a gate
  in §Promotion Trigger; the sweep made it visible as an Open Decision
  rather than buried in the Status block). Inc.4 was decided by owner
  as concrete hard predecessor; Inc.7 retained Betty's D-class
  external-signal framing; cross-plan trigger relocated to combinatorial
  arc. The sweep produced **smaller schedule-position rewordings than
  expected** because the prior session (Mistbound) had already absorbed
  most of the doctrine into the MVP arc, leaving only the two satellite
  plans to catch up.
- **Behaviour change**: doctrine sweeps that follow another session's
  ratification are predominantly mechanical; reviewer dispatch is still
  worth the cost because they catch the one or two C-class items that
  do need owner input. Cost-efficient: do not skip reviewers on
  follow-on sweeps, but do not budget for major reshape either.

### Observation — reviewer scope disagreement (Betty broad vs assumptions narrow) is a useful signal

- **Expected**: both reviewers would agree on the sweep scope since
  they were given the same doctrine.
- **Actual**: Betty proposed broad (rewording across §Increments,
  §Surfacing, §Layer Map, §Coordination map, §Non-Goals); assumptions
  proposed narrow (§Increments Status column only, leaving owner-gated
  deferrals and observed-execution gates alone). Both were defensible
  applications of the same doctrine; the divergence was about *what
  counts as an imaginary flow*.
- **Behaviour change / value**: when reviewers diverge on scope under
  shared premise, the divergence itself is information — present BOTH
  views to the owner with the trade-off named. Owner picked Betty's
  broad scope; the divergence write-up made the choice possible.
  Pattern instance: "Different-lens reviewers catch different gaps"
  (substance-ripe per Fronded's earlier napkin entry; this is a second
  instance under a fresh dispatch).

### Observation — parallel-agent commit coordination worked cleanly via stage-by-pathspec

- **Expected**: with two agents committing in parallel (mine + Soaring
  Darting Kite's consolidate-docs commit), some friction or absorption
  risk would surface.
- **Actual**: zero friction. Both agents staged by explicit pathspec;
  Soaring Darting Kite's pre-staged consolidate-docs files were visible
  in my git status (peer's abandoned commit-queue cycle residue) but
  did not absorb into my commit because I used `git commit -- <pathspec>`.
  Their fresh commit cycle landed cleanly between my two commits.
- **Behaviour change**: the stage-by-pathspec + `git commit -- <pathspec>`
  pattern is operationally proven under parallel-agent conditions. The
  documented cure (Smouldering Crackling Pyre's pattern from this
  morning) works. The B-02/B-03 brief I authored this session is the
  upstream cure — when commit-queue is decoupled from build prelude,
  parallel-agent operation becomes the default instead of a careful
  fallback.

### Observation — pending claim CLI signature surprised on first call

- **Expected**: `pnpm agent-tools:collaboration-state claims open --files X,Y,Z --subject "..."` would work per common-sense CLI patterns.
- **Actual**: the CLI requires `--active <path> --thread <slug> --area-kind files --intent <text> --now <iso> --platform <p> --model <m> --file X --file Y --file Z` — multiple repeated `--file` flags rather than a comma-separated list; no `--subject` flag, just `--intent`. Got it right on second call after CLI emitted full help text on the invalid invocation (validating the existing memory `feedback_agent_tool_help_on_invalid_flags.md` is being honoured).
- **Behaviour change**: this is the kind of friction the commit-queue UX brief (just landed) is aimed at — once Workstream 4 lands, repeated-flag-vs-comma-separated should be discoverable from the help text by default. No new graduation candidate; this is already in scope of the open work.

### Observation — applied doctrine I helped land, against myself

- **Expected**: having just authored a session's worth of
  schedule-not-trigger doctrine sweeps across two plans, my own
  next-session statement would carry the doctrine cleanly.
- **Actual**: emitted "Parallel-safe alternative if topology approval
  is owner-blocked: ..." — a conditional-trigger framing in my own
  output, exactly the failure mode the day's work was designed to
  prevent. Owner caught it immediately: *"what do you mean 'if'? There
  is no uncertainty here, if you have questions ask them."*
- **Behaviour change / pattern**: applying a doctrine to documents is
  not the same as carrying it into one's own outputs. The doctrine
  bites in the second register — speech, planning summaries, opener
  drafting — even when the document-application is clean. The cure
  the owner named is the always-available one: **when uncertain, ask
  the question directly instead of hedging the next step on the
  unknown**. Asked O-1 (topology approval) explicitly; owner gave a
  definite answer; the next-session statement became a definite
  five-step sequence with no conditionals. Captured because the next
  doctrine application is almost certainly going to surface the same
  kind of secondary-register slip, and the cure is the same: ask.
