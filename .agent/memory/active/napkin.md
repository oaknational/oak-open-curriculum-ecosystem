---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## 2026-06-03 — closeout commit tooling (Lofty Sweeping Falcon)

- **`commit-queue` help still omits required identity `--id` on write commands.**
  During the session-completion commit window, `commit-queue enqueue` and
  `commit-queue guard` both failed with `missing required --id` even though the
  usage output listed agent name/platform/model/session-prefix but not the UUID
  field. The source says `--id` is the already-derived collaboration-agent UUID,
  not an intent id. Cure shape: commit-queue usage/option validation should make
  the identity tuple visibly complete for every write command that parses it.

## 2026-06-02 — EEF D3 execution (Seaworthy Swimming Sextant)

- **Known-answer probe missed again — and the miss-shape is new.** Withheld the
  D6 `eef-surface.ts` stale parenthetical (file deleted in D2 commit `9019bb86`,
  still named as a live co-gating site) from the 4-lens review-workflow briefs.
  The code-currency lens CHECKED the file, confirmed it absent, then read the
  plan text charitably ("D6 will create a new one") without raising the
  stale-reading risk. Lesson: reviewers verify facts but normalise ambiguous
  prose toward the charitable reading — file lists mixing live and
  to-be-created files are a reviewer blind class; the author applies that
  standard. Second calibration data point after the mandate-1 unfound probe.
- **A surprise diff surface after gates is a collision-safety read, not
  formatter noise.** `git diff --stat` after `format:root`/`markdownlint:root`
  showed 17 files where ~9 were expected; reading the unexpected diffs (not
  attributing them to `--fix`) surfaced a live parallel curation agent (Lofty
  Sweeping Falcon, codex) mid-slice on the same branch — their team-start had
  already yielded to my claim. One comms event settled the commit-window split.
  Cheap check at assertion time, again.
- **Fix every span of a false claim, not the first one found.** The D4
  frontmatter still carried "(already removed in code)" for the live
  `graph-view` files after a prior session fixed the same claim in the body —
  same shape as the mandate-1 "the span the prior 5-vs-4 fix missed". When
  correcting a claim, grep for its siblings (frontmatter todos duplicate body
  text by design and drift independently).
- **Recurrence (`feedback_repo_scripts_over_npx`)**: after canonical
  `format:root`/`markdownlint:root` ran green, I re-verified two files with
  targeted `npx prettier --check`/`npx markdownlint`. Same binaries/config,
  redundant invocation — the canonical-script reflex should have sufficed.

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
- **Recurrence: reached for `npx markdownlint` on targeted handoff files**
  instead of the canonical `pnpm markdownlint:root`
  (`feedback_repo_scripts_over_npx`). Same binary/config, zero impact, but
  the canonical-script reflex should fire even for targeted runs; counts as
  a recurring-friction instance for that memory.
- **candidate: opener staleness is structural, so openers self-instruct
  verification.** An opening statement is necessarily written before the
  session's final commit window, so it is ALWAYS potentially one commit
  stale when read — the last two openers each were (35472f15 over the
  Opalescent opener; the arc-recording dirt over this session's first
  draft). Not an authoring defect; a structural property of the handoff
  seam. Cure shape: the opener names its own staleness mode and directs
  perimeter re-derivation from git ("re-derive regardless"), and the test
  of a good opener is that the next session verifies it cheaply and finds
  it true — not that it is believed. Third face of the distilled
  "opening statements teach by their form" entry; route there at next
  consolidation.
