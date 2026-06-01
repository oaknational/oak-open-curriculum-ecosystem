---
title: "Comms-event write integrity — one-time repair + absolute prevention"
status: current
lane: current
type: executable
thread: agent-tooling
date: 2026-06-01
owner_scope: >-
  The agent comms substrate must never hold a malformed or schema-nonconforming
  event, and must never silently tolerate one. This plan does two things and only
  two things: a ONE-TIME repair of every malformed true-JSON collaboration event
  that exists today, and ABSOLUTE PREVENTION of new corruption by hardening the
  single write path (serialize via JSON.stringify only, validate the serialized
  string round-trips and conforms, write atomically via temp-file + rename) and by
  making readers fail loudly and namefully on any malformed event rather than
  skipping it. Owner direction 2026-06-01: a read-side "ignore/skip malformed"
  mode is explicitly rejected — tolerating corruption is not a fix.
todos:
  - id: d1-root-cause
    content: "Root-cause how malformed/unterminated event JSON was produced. Examine the write path (state-io.ts eventJson + writeFile { flag: 'wx' }), its git history, and the three repaired exemplars (625fb072, 76ede08d, a15363e5). Establish whether the live path serializes end-to-end via JSON.stringify or has any manual-assembly/legacy branch, whether the write is atomic, and whether shell-argv truncation can deliver a malformed value to the writer. Output: a named root-cause record that D3's prevention must close."
    status: pending
    depends_on: []
  - id: d2-one-time-repair
    content: "One-time comprehensive repair of every malformed true-JSON collaboration file. Audit all genuinely-JSON surfaces (comms events, conversations, escalations, sidebars, claim archives) and EXCLUDE by-design non-JSON surfaces — comms-seen/*.json are newline-delimited UUID cursors read by readSeenIdsFile, not JSON.parse. Repair every malformed/unterminated/legacy-schema true-JSON file to valid current-schema JSON, faithfully preserving surviving content (the three comms events repaired 2026-06-01 are the first instances). Validate 100% of true-JSON surfaces parse and conform. Resolve the misleading .json extension on comms-seen cursors (rename to a non-JSON extension or make integrity tooling format-aware) so scans no longer false-positive."
    status: pending
    depends_on: []
  - id: d3-write-prevention
    content: "Absolute write prevention via one hardened writer. Every event/state write builds an object, serializes with JSON.stringify ONLY (no manual string assembly anywhere), parses the serialized string back and schema-validates it, then writes atomically (temp file in the target directory + fsync + rename). A write that fails validation throws BEFORE any file is created. TDD: control chars, raw newlines, quotes, backticks, $, very long bodies, and unicode all produce valid, parseable, schema-conformant files; an interrupted write never leaves a partial/torn file in place."
    status: pending
    depends_on: [d1-root-cause]
  - id: d4-read-hard-fail
    content: "Read-side hard-fail with no tolerance. comms render, readCommsEvents, and sibling readers treat any malformed or schema-nonconforming event as a HARD, loud error that names the offending file and aborts with an actionable message — explicitly NOT skipped. Add a single validator (comms doctor / validate) that scans all true-JSON surfaces and exits non-zero naming every bad file. This supersedes F-05's --skip-malformed candidate cure (owner-rejected 2026-06-01)."
    status: pending
    depends_on: [d2-one-time-repair]
  - id: d5-regression-guard
    content: "Wire the D4 validator into the quality gate (repo-validators:check or the appropriate aggregate) so any malformed or schema-nonconforming collaboration event fails the gate. The same validator runs at render-time (D4) and at gate-time (D5); corruption can never silently re-accumulate. Update frictions-register F-05 to addressed and run the consolidation/learning loop."
    status: pending
    depends_on: [d2-one-time-repair, d3-write-prevention, d4-read-hard-fail]
---

# Comms-event write integrity — one-time repair + absolute prevention

## Problem

The agent comms substrate held three event files (`625fb072`, `76ede08d`,
`a15363e5`) whose `body` strings were truncated mid-sentence into unterminated
JSON. A single such file aborts `comms render` repo-wide, blocking
`shared-comms-log.md` regeneration for every agent. The three were repaired by
hand on 2026-06-01; this plan removes the class of fault, permanently.

The existing capture is frictions-register **F-05** ("`comms render` chokes on a
single malformed event JSON", open, high severity). Its candidate cure was a
read-side `--skip-malformed` flag. **The owner rejects that shape (2026-06-01):**
letting readers ignore malformed events tolerates corruption rather than
preventing it. The correct fix is prevention at the write plus a loud, hard
read-side failure.

## End goal, mechanism, means

- **End goal** — the comms substrate never contains a malformed or
  schema-nonconforming event, and a corrupt event is never silently tolerated:
  agents' coordination surface stays trustworthy and always-renderable.
- **Mechanism** — corruption can only enter at the write; a single hardened
  writer that serializes only via `JSON.stringify`, validates the serialized
  string round-trips and conforms, and writes atomically (temp + rename) makes a
  malformed write impossible. A loud read-side failure plus a gate-time validator
  means any externally introduced corruption surfaces immediately and is repaired,
  never skipped.
- **Means** — D1 root-cause, D2 one-time repair, D3 write prevention, D4 read
  hard-fail, D5 gate-wired regression guard.

## Ratified Decisions (owner-directed; do not re-open in execution)

1. **One-time repair plus absolute prevention — nothing else.** The deliverable
   is a clean substrate now and a write path that cannot produce a malformed event
   again. No schema migration, no event-semantics change.
2. **Prevention lives at the write.** The write is the only place corruption can
   enter, so it is the only place the guarantee is established: serialize via
   `JSON.stringify` only, validate the serialized output parses and conforms, write
   atomically (temp file in the target dir + fsync + `rename`). No code path
   constructs event or state JSON by string concatenation or templating.
3. **Readers fail loudly; they never skip.** A malformed or schema-nonconforming
   event on read is a hard error naming the file. Because the write guarantee holds,
   such a file means external corruption that must surface and be repaired. This
   supersedes F-05's `--skip-malformed` cure, owner-rejected 2026-06-01.
4. **`comms-seen` cursors are not JSON.** They are newline-delimited UUID lists
   read by `readSeenIdsFile`; they carry a misleading `.json` extension. Integrity
   scope is true-JSON surfaces only; the extension is corrected or the tooling is
   made format-aware so scans do not false-positive on them.

## Deliverables

Product-code deliverables are TDD landings — test and product code co-land in one
commit. D1 is `non-code` investigation.

### D1 — Root-cause the corruption mechanism

**Do:**

- Read the write path: `agent-tools/src/collaboration-state/state-io.ts`
  (`eventJson`, `writeFile(eventPath, …, { flag: 'wx' })`) and every sibling that
  writes events/state. Read its git history around the dates of the three corrupt
  files.
- Decide, with evidence, whether the live path serializes end to end via
  `JSON.stringify` or contains any manual-assembly/legacy branch; whether the write
  is atomic and fsync'd; and whether a shell-argv-truncated `--body` can reach the
  writer and be persisted.
- Record the named root cause(s). D3's prevention must demonstrably close each one.

**Done when:** the root cause is named and written here, and each named cause maps
to a specific D3 guard.

**Proof:** `non-code` (written root-cause record, file/line + git-history grounded).

### D2 — One-time comprehensive repair

**Do (TDD where code; one-shot audit where data):**

- Enumerate all genuinely-JSON collaboration surfaces (comms events,
  conversations, escalations, sidebars, claim archives). Confirm each surface's
  reader uses `JSON.parse` before treating it as in-scope.
- Confirm `comms-seen/*.json` are line-delimited cursors (reader: `readSeenIdsFile`)
  and exclude them from JSON-integrity scope.
- Repair every malformed/unterminated/legacy-schema true-JSON file to valid
  current-schema JSON, preserving surviving content. The three comms events
  repaired 2026-06-01 are already valid and are the first instances.
- Correct the `comms-seen` extension (or make the integrity tooling format-aware)
  so the cursor files are no longer scanned as JSON.

**Done when:** a one-shot audit reports zero malformed true-JSON collaboration
files; every in-scope reader parses the whole estate cleanly; `comms-seen` no
longer false-positives.

**Proof:** `integration` (audit command exits 0 over the real estate).

### D3 — Absolute write prevention (single hardened writer)

**Do (TDD cycles):**

- Route all event/state writes through one writer that: builds the object →
  `JSON.stringify` (only) → parse-back + schema-validate → atomic write (temp file
  in the target directory, fsync, `rename`). Remove any manual JSON assembly.
- A value that cannot be safely serialized or that fails schema validation makes
  the writer throw before any file is created.

**Done when:**

- Bodies/content with control chars, raw newlines, `"`, `` ` ``, `$`, very long
  text, and unicode all produce valid, parseable, schema-conformant files.
- A validation failure creates no file (proven by test).
- An interrupted write leaves no partial/torn file at the target path (temp +
  rename guarantees it; proven by test).
- No code path assembles event/state JSON by concatenation/templating (checked).

**Proof:** `unit` + `integration` over the real writer.

### D4 — Read-side hard-fail (no tolerance)

**Do (TDD cycles):**

- `comms render`, `readCommsEvents`, and sibling readers fail hard and namefully
  on any malformed or schema-nonconforming event: a clear, actionable error citing
  the file path, non-zero exit, no silent skip.
- Add one validator (`comms doctor` / `validate`) that scans all true-JSON
  surfaces and exits non-zero listing every bad file.

**Done when:** a planted malformed event makes render and the validator fail loudly
naming the file; a clean estate renders and validates green; no `--skip-malformed`
or equivalent tolerance path exists.

**Proof:** `unit` + `integration`.

### D5 — Regression guard wired into the gate

**Do:**

- Wire the D4 validator into the quality gate (`repo-validators:check` or the
  appropriate aggregate) so any malformed/nonconforming collaboration event fails
  the gate. One validator, two wirings (render-time + gate-time).
- Update frictions-register **F-05** to `addressed` with a back-cite to this plan;
  run the learning loop (`oak-consolidate-docs`) and consider graduating the
  validate-then-atomic-write shape to a shared-state-writer rule/ADR.

**Done when:** the validator fails the gate on a planted bad file and passes on the
clean tree; F-05 is closed against this plan; `pnpm check` green on a settled tree.

**Proof:** `integration` + `non-code` (gate wiring, F-05 closure).

## Non-Goals

- A `--skip-malformed` flag or any read-side mode that ignores or skips malformed
  or schema-nonconforming events (explicitly owner-rejected 2026-06-01).
- Migrating the comms event schema or changing event semantics.
- Reworking the `comms-seen` cursor format beyond the extension/format-awareness
  fix.
- Building `comms list`/`show`/`watch` (separate friction F-07).

## Risk Assessment

- **Atomic rename across filesystems.** `rename` is atomic only within one
  filesystem; the temp file is created in the target directory so source and
  destination share a filesystem.
- **Hard-fail-on-read as a substrate blocker.** If a malformed file exists, readers
  now block loudly. Mitigated by D2 (clears existing) + D3 (prevents new) + D5
  (gate catches external corruption before it lands). The owner accepts loud
  failure over silent skip — surfacing corruption is the correct response.
- **Concurrent writers.** Multiple agents write events with unique `event_id`
  UUIDs and the `wx` create flag; atomic temp+rename preserves collision-safety.

## Foundation Alignment

- `principles.md` — `replace-dont-bridge` (replace the fragile write path; do not
  add a read-side tolerance bridge), strict validation at the boundary (the write
  is the boundary), never tolerate a signal (a malformed event is a signal to
  surface, not suppress).
- `testing-strategy.md` / `tdd-as-design.md` — every product cycle co-lands
  test+code; tests prove writer/reader behaviour over real and adversarial inputs.
- `schema-first-execution.md` — the event schema governs validation at the write
  and read boundaries.
- Rules: `never-disable-checks`, `never-ignore-signals`,
  `strict-validation-at-boundary`, `important-state-not-in-temp-files`
  (the atomic temp file is transient, never the system of record).

## Plan-Body First-Principles Check

- **Shape clause** — the ratified shape is prevention-at-write + loud-read +
  one-time-repair; no read-side tolerance. D1 confirms the mechanism before D3
  builds the guard.
- **Landing-path clause** — D2/D3/D4/D5 product cycles co-land test+code and end
  green.
- **Vendor-literal clause** — verify Node `fs` atomic-rename and fsync semantics
  against the installed runtime at execution time before relying on them.
- **Optionality-surface clause** — the design carries one closed answer; the
  `--skip-malformed` escape hatch is a named non-goal, not a deferred option.

## Readiness Reviewers

Before this plan is marked ready for execution, dispatch by substance:

- `assumptions-expert` — the prevention-at-write framing and proportionality of the
  five deliverables.
- an architecture reviewer — the single-hardened-writer boundary and ADR alignment
  for shared-state writes.
- `type-expert` — the serialized-string schema validation and writer types.
- `test-expert` — the TDD shape, the atomicity test (no partial file on
  interruption), and the no-file-on-validation-failure test.

Code-gateway reviewers (`code-expert` and the specialists it flags) run in the
normal loop after product edits.

## Learning Loop & Lifecycle Triggers

- On completion, run `oak-consolidate-docs`: close frictions-register F-05 against
  this plan, and assess graduating the validate-then-atomic-write shape into a
  shared-state-writer rule or ADR (it generalises beyond comms events to all
  shared-state JSON).
- Lifecycle touch points per
  `.agent/plans/templates/components/lifecycle-triggers.md`: D3/D4 CLI-surface
  changes invoke doc/onboarding review; D5 gate-wiring invokes the config reviewer;
  completion runs the consolidation workflow.
