---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-25 — Hushed Stalking Shade (`bc0a07`, opus-4.7) — hardening-arc Phases 1+2+4+5

### What worked

- Pre-consolidation reflection (generative-mode metacognition) surfaced
  status drift across the three operational plans BEFORE the doctrine drain
  pass — five hardening workstreams (WS-2/6/8/11/12) were marked
  pending/in_progress despite their PDR/ADR landings via the companion
  tidy plan. Status reconciliation with SHA evidence cured the drift.
- Owner-direction packet items in pending-graduations resolved by direct
  graduation: PDR-077 (marshal-as-cycle-discipline) + PDR-079 (PDR-ADR
  portability) both landed during the arc but their pending-graduations
  entries hadn't been flipped. Trivial graduation moves left undone.

### Pattern instance (not yet a new candidate)

- **Strategic-plan status drift when execution routes through a companion
  executable plan**: hardening (strategic roll-up) named workstream
  landings done via tidy (executable companion). Strategic plan's status
  fields did NOT auto-update on companion landings. Symptom: zombie
  pending/in_progress workstreams masking complete arcs. Cure shape: the
  status-reconciliation pass in `consolidate-docs` Cardinal Rule + plan
  supersession discipline. This is an instance of the existing
  `substrate-pointer-read-as-current-state` pattern (the strategic plan's
  status field is the pointer; the companion plan's landed commits are
  the current state). No new pattern file; mark on the existing one if
  a second instance appears.

### Deferral with named constraint (per consolidate-docs deferral-honesty)

- Full pending-graduations register drain (86 entries across main + 3
  shards) NOT completed this session. **Constraint**: owner pivoted to
  graph work mid-session (explicit direction 2026-05-25). **Evidence**:
  user message *"fully pivoted back to the graph work"*. **Falsifiability**:
  a future consolidation pass can check whether graph-work commit
  activity dominates the branch in the window after this session;
  if yes, the deferral was honest; if no, this triage pass was
  premature. Triaged + graduated: 3 clear-fire entries (PDR-077,
  PDR-079, heartbeat-bundle which Misty had already done). Remaining:
  ~83 entries stay pending-or-due awaiting next consolidation cadence.
- Phase 3 of harmonic-fluttering-bentley plan (comms-event retention
  pass) NOT completed this session. **Constraint**: same as above
  (owner pivot). **Falsifiability**: next `consolidate-docs` cadence
  reads `.agent/state/collaboration/comms/` event dates; events older
  than 7 days will route through §3a retention discipline at that
  cadence. The retention rule is unchanged; only its execution this
  session was deferred.

### Owner standing direction recorded 2026-05-25 (binding)

- Comms-file retention has been INCREASED; the previous 7-day rule no
  longer applies. **NO comms files are to be moved or deleted** until
  the comms research plan completes. The comms research plan lives on
  the `agent-collaboration-research` thread (currently owner-gated,
  buffered). Affects all `.agent/state/collaboration/comms/` events;
  broadest-interpretation reading also affects `comms-seen/`. Concrete
  consequence: WS3 of `comms-watch-storage-redesign.plan.md` is now
  blocked until the constraint clears. Phase 3 of the
  harmonic-fluttering-bentley consolidation plan (comms-event retention
  pass) was deferred under same constraint.

### What landed (3 commits)

- `4e333441` chore(plans): reconcile hardening + tidy statuses to
  landed doctrine (Phase 1). 2 files, 24+/26-. WS-2/6/7/8/11/12 +
  M1/M2 gates flipped completed with SHA evidence; cycle-15 marked
  removed.
- `f3f520ce` chore(memory): graduate PDR-077 + PDR-079 pending entries;
  archive bodies (Phase 2). 3 files, 175+/72-. Register dropped from
  HARD (783) -> SOFT (722) via archive snapshot move; pre-existing
  MD049 co-fix.
- `650afb08` chore(plans): archive tidy + hardening plans; promote
  comms-watch-storage-redesign (Phase 4+5). 5 files, 473+/23-. New
  plan + supersession-mapping README + 2 plan moves to
  archive/completed/ + cost-of-collaboration back-pointer.

---

## 2026-05-25 — Salty Mooring Dock / cursor / Composer / `dc4dd7`

### What worked

- Owner wanted a **manual test checklist** (what / how / expected results), not
  automated `probe:remote` scripts — doc lives at
  `docs/agent-preview-test-checklist.md` in the MCP app workspace.
- Operational docs belong in MCP app `docs/` + README, not a new ADR.

### Correction (same session, after owner feedback)

- Misread "test script" as shell/ts automation; removed `probe-remote-mcp.sh`
  and `agent-preview-smoke.ts` in favour of the checklist doc only.

### Surprise

- `prod:requests` treats unauth `/mcp` 401 as failure; HTTP baseline belongs in
  the checklist as optional curl rows with expected 401, not a passing smoke job.

### candidate

- None — script placement is operational, not architectural.

---

## 2026-05-25 — Briny Fathoming Dock / claude / claude-opus-4-7 / `95a27b`

### What Was Done

- Owner-directed role-metacognition session opened with the observation that
  "the Director role is only useful when grounded in continually re-verified
  *fact*, otherwise it becomes a useless, even damaging, expensive ticking
  clock". /oak-start-right-team + /oak-plan + /oak-metacognition.
- Session-local reflection in the private Claude plan area.
- Repo plan authored in the agentic-engineering current plan directory
  (1501 lines, lint-clean, DECISION-COMPLETE pending owner execution direction).
- Pre-execution reviewer pass: 6 reviewers (assumptions, docs-adr, betty,
  barney, fred, wilma) all PASS-WITH-CONDITIONS; owner ratified path B
  (Narrowed v1); consensus absorbed into plan body.
- Plan-tree discoverability + thread record + repo-continuity updated.
- **No implementation per owner closeout**; PDR-082 + ADR-188 + pattern
  memory + pending-graduations entry deferred to a future execution session.

### Patterns to Remember (graduation candidates and worked instances)

- **Recursive meta-cure for plan-authoring** (graduation candidate, first
  worked instance). The structural cure I proposed for multi-agent
  role-emission (substrate-bound citation-binding so freshness is
  mechanically auditable) applies recursively to plan-authoring itself.
  Every plan-emission depends on doctrine-landscape ground truth (the
  PDRs/ADRs/patterns the plan composes against); without freshness
  binding, the plan emits doctrine proposals against a stale model.
  Proposed cure shape: open every plan with explicit doctrine-landscape
  revision citation (PDR/ADR commit shas at author-time); reviewers
  audit freshness; stale plan-emissions are auditable from the plan
  body alone. Falsifiability: a plan whose cited landscape revision
  has aged past a freshness threshold (e.g. PDRs landed in the cluster
  since author-time) without re-grounding is the failure phenotype.
  Routing: candidate amendment to PDR-018 (Planning Discipline) once a
  second worked instance accumulates in a distinct session.
- **Doctrine-by-analogy self-instance** (worked instance of metacognition
  directive's "doc-patch fails under load" prediction). I diagnosed
  PDR-074 §S1's self-discipline-fails-under-load failure mode WHILE
  committing the exact same failure mode at plan-author time — I did
  not verify the doctrine landscape (PDR-074/075/080 existed and
  partially cover the cure shape I was proposing) until AFTER
  AskUserQuestion ratification was already given. The metacognition
  directive predicted this class explicitly; this entry is evidence
  the prediction is empirical, not theoretical.
- **Reviewer fan-out cost imbalance** (graduation candidate). Six
  sub-agent reviewers absorbed findings that one pre-author
  landscape-verification pass would have caught (multi-role overreach,
  layer-split leakage, lifecycle exclusion). Cure: treat reviewer
  fan-out as a check against autonomous due diligence, not a substitute
  for it. For doctrine-only landings, default to 3 reviewers per
  cycle, not 4+. Reserve 4+ reviewer depth for security-class
  substrate-as-API ADRs per the 2026-05-25 ADR-187 worked instance.
  Falsifiability: a reviewer-finding that names "the plan-author
  should have caught this by reading existing PDR-NNN §X" is the
  cost-imbalance phenotype.
- **Status maturity inversion lesson** (worked instance). Substrate
  phenotype ADRs typically land Accepted alongside their implementation
  (precedent: ADR-183/184/185/186). Landing an ADR Accepted with
  implementation explicitly deferred creates a maturity mismatch that
  future agents misread ("ADR is decided; doctrine is not yet
  validated"). Cure: ADR Status: Proposed when the paired PDR is
  still Candidate AND implementation is deferred to a follow-on plan;
  move to Accepted on first worked instance of the implemented
  substrate. Reviewers betty F4 and barney F4 surfaced this
  independently during the pre-execution pass.
- **AskUserQuestion before landscape verification is evasion** (worked
  instance of `.agent/rules/present-verdicts-not-menus.md` plus
  memoried "no question when answer is forced"). I surfaced "Where
  should the PDR + ADR pair land?" as a 3-option question BEFORE
  verifying PDR-074/075/080 already existed. After landscape
  verification, the question's premise was altered (the answer was
  forced toward "narrower scope inside existing cluster" rather than
  the originally-posed "new track / existing roadmap /
  defer-to-hypothesis-layer"). Cure: do landscape verification FIRST,
  then surface only genuinely-undetermined options. The
  "no question when answer is forced" rule applies recursively when
  the answer is forced by a landscape that has not yet been checked.
- **PDR-074 §S1 cure path is now named, not yet substrate-implemented**
  (operational note). After this session, the path from PDR-074 §S1's
  self-discipline shape to its structural cure substrate is named:
  PDR-082 (portable contract) + ADR-188 (repo-bound phenotype) +
  Phase 4 substrate-implementation plan. The cure path is reviewed,
  narrowed, and ready for execution; the path is not yet walked. Next
  session's Director ticking-clock failure modes (expected to recur
  until the substrate lands) should be captured against this named
  cure path rather than as fresh observations.

## 2026-05-25 — Misty Drifting Sail / claude / `02b325`

### Processing Disposition

- Full source-window preserved in the Misty Director-session archive after this
  pass verified durable routes for the behaviour-changing content.
- Session outcome, open handoff state, and Director-dissolve routing live in
  `threads/agentic-engineering-enhancements.next-session.md` under Misty's
  2026-05-25 session outcome.
- Five graduation candidates now live in `pending-graduations.md` under
  "Misty Drifting Sail Director-session candidates": plan Done-When must drive
  to live, state-bound heartbeat content, inbox/absorption semantics,
  owner-direction provenance, and Director-seat threshold.
- Two first-instance candidates remain explicitly pending in that same register:
  coordination overhead-to-delivery ratio and build-clean CLI breakage.
- Carry-forward behaviour: when owner intent and active substrate disagree,
  repair the substrate the team actually measures; do not treat heartbeats,
  local commits, or coordination volume as delivery.

## 2026-05-25 — Shadowed Glimmering Moth / codex / GPT-5 / `019e5d`

### Patterns to Remember

- A fresh `comms watch` seen-file can replay old backlog before it reaches
  live team traffic. For current-state grounding, pair it with rendered comms
  tail, active claims, and queue reads; treat backlog replay as historical
  substrate unless the command has already caught up.
- A fitness hard-width line can be remediated without knowledge loss by moving
  detail from an overlong heading into adjacent body prose. That is structural
  reflow, not trimming.
- Tidy-plan delivery in a live team needs routing discipline even when the
  owner gives a broad "work on delivery" instruction. If another agent owns
  the fresh source claim, switch to read-only support or a Director-routed
  non-overlapping slice instead of racing the implementation.
- Cycle 10 readiness note: the existing collaboration-state transaction helper
  provides temp-file plus rename and lock directories, but no fsync. A storage
  redesign that promises crash-hardening must extend the helper or add a
  dedicated state writer, not merely reuse it by name.
- Cycle 11 cleanup audit currently has non-test `comms-seen` references in the
  start-right-team SKILL, comms-watch mechanism reference, agent-tools README,
  continuity-surface rule, and ADR-182. Treat ADR-182 as an architectural
  reference that may need a deliberate keep/update verdict, not a mechanical
  grep casualty.
- `practice:substrate:check` can fail on inherited collaboration-state schema
  debt even when a new substrate evaluator is clean. For the open-questions
  validator landing, the only blocking finding was an old abandoned
  `commit_queue[19].files[0] == ""` entry; validate whether a residual is in
  the touched surface before attributing the failure to the new reader.

## 2026-05-24/25 — Processed Curation Carry-Forward

### Processing Disposition

- Pelagic's hard-napkin curation window is preserved in the Pelagic hard-napkin
  archive; current live routes remain in the thread records named there.
- Pelagic's 2026-05-25 stop-condition note remains behaviourally active:
  when the owner defines completion as no hard/critical files, soft-only
  fitness is the stop condition rather than a prompt to polish soft counts.
- Misty's earlier cycle 5-8a surprise window is preserved in the Misty
  Director-session archive.
- Carry-forward lessons: seed/bound comms watchers before reading current team
  silence; verify live branch/queue/comms immediately before closeout; count
  near-limit commit subjects before burning a marshal cycle; single-quote shell
  search patterns containing backticks.

## 2026-05-25 — Estuarine Drifting Mast / codex / GPT-5 / `019e5e`

### What Was Done

- Ran a bounded `oak-start-right-team` + `oak-consolidate-docs` curation pass
  on the current hard/critical memory surfaces, then stopped at the owner
  boundary once the live report had no critical or hard files.
- Preserved the Misty Director-session source window in an archive, created a
  focused pending-graduations shard for the still-active candidates, and
  replaced the active napkin/pending register bodies with disposition and route
  pointers rather than lossy summaries.
- Closed the docs-curation claim and posted a team closeout event with evidence:
  `practice:fitness --strict-hard` soft-only, markdownlint clean on touched
  memory files, and `git diff --check` clean.

### Mistakes Made

- I initially let the live fitness counts frame the work too strongly. Owner
  corrected the stance: process and curate understanding; the numbers are only
  a signal that the learning substrate needs care.

### Patterns to Remember

- During memory curation, the decisive question is not "how do I lower the
  count?" but "what understanding would a future session lose if I moved too
  quickly?" Route first, archive after the route is real, and use the report
  only to find where the substrate is asking for attention.
- Team-member handoff should stop at the owned boundary. In this session, the
  correct closeout was claim closure, comms evidence, watcher stop, and napkin
  capture; broader repo-wide check ownership stayed with the active marshal /
  implementation team.
