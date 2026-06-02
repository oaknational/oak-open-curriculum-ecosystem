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
