---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-02 - napkin rotation (Shaded Veiling Mirror, dedicated knowledge-curation)

Rotated the prior napkin (485 lines by `wc -l`; validator counted 477 content
lines, critical by line count and characters) after processing each current
entry into a durable disposition. Verbatim source preserved at
[`archive/napkin-2026-06-02-shaded-veiling-curation.md`][napkin-archive].
This archive is the source record, not completion proof.

Disposition ledger:
[`curator-passes/2026-06-02-shaded-veiling-napkin-rotation.md`][ledger].

[napkin-archive]: archive/napkin-2026-06-02-shaded-veiling-curation.md
[ledger]: ../operational/curator-passes/2026-06-02-shaded-veiling-napkin-rotation.md

### Rotation disposition

- **Distilled / refined in `distilled.md`**: assertion-time cheap checks,
  projection-not-location, live-routing reads before mechanical sweeps, owner-
  visible proof for untracked artefacts, dependency updates needing plan-truth
  cleanup, and set-level confirmation before broad revert/repair actions.
- **Added to `pending-graduations.md`**: substance-loss-first curation, plan
  anti-restratification, history-vs-residue decontamination, convergence scanning
  in multi-agent handoffs, untracked artefact visibility, mechanical sweep set
  discipline, and Cursor identity seed observability.
- **Already represented / duplicate**: EEF, graph-estate, output-schema, and
  contamination-scan details already live in the current plans, Q-003, the
  mandate-1 report, existing rules, or existing pending-graduation entries.
- **Stale or operational-only**: no source entry was deleted for convenience; the
  source archive is intact, and stale or operational entries are named in the
  ledger rather than silently dropped.

### Continuation disposition

- **Graduated after initial rotation**: the mandate-1 contamination-scan method
  now lives as `active/patterns/contamination-scan-method.md`.
- **Routed to future plans**: the owner-approved seam-map archetype and the fired
  cross-platform rules-generator trigger now have future strategic briefs under
  agentic-engineering and agent-tooling respectively.
- **Register shape**: `pending-graduations.md` no longer carries generic
  `pending`, `APPROVED`, or `owner-surfaced` statuses; unresolved entries now
  state their owner or trigger gate explicitly.

### Mistake made in this rotation

- I opened the active claim correctly, but I ran `git mv` on the napkin before
  updating the thread identity row. The source was preserved, but the thread
  convention says the identity row is written before edits. Fix: update the thread
  record immediately after catching it, and carry this as a start-right order
  check for future curation passes.

### Final closeout insight

- A drained register is not the same thing as "everything got authored now."
  The clean curation move for approved or trigger-fired but sizeable work is a
  durable future lane with acceptance and promotion triggers, plus a graduated
  register pointer. That preserves the insight without pretending a strategic
  deliverable has already landed.

## 2026-06-02 — graph-estate consolidation execution (Opalescent Cascading Planet)

- **Commit-queue intent lists collide with git rename detection.** Deriving an
  intent file list from `git status --porcelain` with a naive awk over `R`/`RM`
  lines double-counts rename pairs: `verify-staged` compares against
  `git diff --cached --name-only`, which collapses renames to the NEW path
  only, so the old paths read as "missing" and the verify fails. Cure: build
  the intent from `git diff --cached --name-only` after staging (the exact
  staged truth), or filter old rename paths out before enqueue. Cost: one
  abandoned intent + re-enqueue.
- **The installed `commit-queue` CLI build lacks the composed `commit`
  primitive the commit skill documents** (usage shows enqueue/phase/guard/
  record-staged/verify-staged; `complete` exists but is undocumented in usage
  and rejects `--sha`). Manual sequencing works; skill-vs-build drift worth a
  doc-or-build reconciliation pass.
- **De-link vs repoint split worked cleanly at execution**: superseded plans →
  live refs become plain text "(since archived)"; completed plans → historical
  citations may repoint to `archive/completed/` per ADR-117; one
  where-did-they-go record in `completed-plans.md`. The adversarial
  dangling-pointer hunt (24 confirmed misses across 9 files, all verified
  before acting) caught what the mechanical referrer sweep missed — fresh
  evidence for independent-eyes-catch-what-self-review-cannot.

## 2026-06-02 — final-capture additions (Opalescent Cascading Planet)

- **Decision-completeness does not amortise grounding; it relocates it.** This
  session executed the most-ratified inheritance imaginable (owner-confirmed,
  assumptions-expert READY, contamination-scanned) and still needed every
  confirm-at-move check: the scan session had edited the executing plan after
  its decisions closed, the eef/archive carried four false `status: current`
  frontmatters found only by full enumeration, and the Threads adapter that
  plan prose implied was nearer turned out absent from
  `graph-corpus-sdk/src/`. Heavy ratification shifts the live risk from
  under-ratification to treating ratification as a substitute for
  execution-time grounding.
- **Verify the overlap before designing the coordination.** Planned
  inter-agent coordination over `repo-continuity.md` (comms event shapes,
  deadline, default action, polling) evaporated under six grep lines — every
  token instance was sanctioned record, zero edits needed. The cheapest
  coordination is discovering none is required; the collision-safety read
  should test whether the conflict is real before any ceremony is built.
- **candidate: relative-link integrity gate for the `.agent` estate.** The
  scoped-t8 link check (an ad-hoc shell loop resolving every relative
  markdown link) found 14 pre-existing broken links that markdownlint,
  prettier, and the full gate chain structurally cannot catch — the repo has
  no link-integrity validator, so breaks accumulate silently until a manual
  sweep. Structural-cure shape (per the metacognition cure-shape clause): a
  repo-validator over live lanes (excluding `archive/`), wired at `warn`
  first per the new-ESLint-rules convention. Promote at next register
  refresh; target: repo-validators or a `check`-chain addition.

## 2026-06-02 — JC4 plan authoring (Galactic Glowing Prism)

- **Verification scoped by the claim cannot find unclaimed members.** My
  spot-check of the thread-progressions consumer set verified only the two
  files the claim named (`ontology-data.ts`, `tool-guidance-data.ts`) and
  passed; the reviewer fleet's open `rg` over the import symbol found a third
  (`tool-guidance-workflows.ts:15`). Confirm-the-claim greps inherit the
  claim's selection bias — completeness checks must enumerate from the code
  side (symbol/import sweep), never from the claim's file list. Fresh face of
  independent-eyes-catch-what-self-review-cannot.
- **Known-answer probe worked as calibration.** Withheld the ADR-086 §4
  "no new MCP tools" freeze from the reviewer briefs; docs-adr-expert found
  it unprompted (READY-WITH-CONDITIONS, condition F-02). Positive recall
  signal — the fleet's zero-findings elsewhere carry calibrated weight. The
  probe had to be redesigned mid-session: both absorbed-plan contaminations
  were already disclosed in the plan's own ledger, so the probe had to be a
  fact known to the author but absent from the artefact under review.
- **zsh false-green: `for f in $FILES` does not word-split.** The first
  link-integrity sweep "passed" having checked zero files (multiline var,
  no splitting; the `ugrep` warnings were the tell). Re-ran with explicit
  word-split + an extraction sanity check. Verify the verifier: a green
  sweep whose extraction count is unknown proves nothing.
- **Brief-vs-git divergence again, benign this time.** The opener said
  `c3b78eec` is HEAD; git showed an unpushed owner handoff commit
  (`35472f15`) on top. Re-derive perimeters from git held; the divergence
  changed nothing material but would have corrupted the commit-window
  narrative if trusted.
