---
status: opener
authored: 2026-05-06
authored_by: Clouded Lifting Aerie (claude-code, claude-opus-4-7-1m, 1e2244)
thread: agentic-engineering-enhancements
target_session_shape: dedicated end-to-end drain of pending-graduations.md — execute due entries, re-evaluate pending entries, surface remaining shape
context_budget_for_directives: <30% reserved (some `due` entries land in directive files; honour the standing rule)
---

# Next session opener — Pending-graduations dedicated drain

**Thread**: `agentic-engineering-enhancements`.

**Sole target**: `.agent/memory/operational/pending-graduations.md`.
The whole session focuses on this one file. No napkin work, no
patterns work, no unrelated graduations. The previous session
landed Step 1 (napkin) and Step 2 (register triage) of the
2026-05-06 opener; this session is the dedicated continuation of
Step 2.

## Starting state (post-2026-05-06)

- File: 1876 lines / 114,575 chars (HARD against 1400 / 90,000).
  HARD persists by design — the residual queue substance is the
  next-audit input per the prior opener's boundary, not a session
  brake.
- `graduated 2026-05-04|05` entries: archived in
  [`archive/pending-graduations-archive-2026-05-06.md`](../../../memory/operational/archive/pending-graduations-archive-2026-05-06.md).
  Live register no longer carries them.
- 8 `due` entries flagged for execution:
  - L103 — pattern surface needs polarity discipline (partial sweep
    deferred for bulk-edit scope).
  - L137 — 30%-context budget for directive-file processing
    (PDR target; itself directive-shaped work; respect the rule).
  - L320 — Lacustrine commit-queue fingerprint (status flipped to
    `graduated 2026-05-06` last session via F-15; verify and move
    to archive on next pass per audit-trail discipline).
  - L543 — PDR candidate for orchestrator-vs-gate structural cure.
  - L598 — PDR candidate for cross-lane repair pattern.
  - L720 — hook tightening for no-moving-targets-in-permanent-docs
    (prose-narrative vs code-block backtick contexts).
  - L1097 — observability multi-sink + fixtures plan WS10 (graduates
    when WS11.3 executes — confirm whether trigger has fired).
  - L1123 — observability multi-sink + fixtures plan WS8.6 (ADR
    authoring; trigger condition resolved).
  - L1202 — collaboration-protocol agent-tools CLI affordance
    graduation (graduates with the next CLI ergonomics pass).
- 1 `partially graduated` (L776) — the asymmetric-cure / `git
  commit -- pathspec` entry. Asymmetric-cure observation already
  graduated to a rule; ADR-shaped follow-up + PDR-shaped follow-up
  still queued. Keep partial status; verify whether the named
  follow-up triggers have fired.
- 1 `quarantined` (L1567) — special status; re-read to decide
  whether quarantine can lift.
- ~76 `pending` entries — most await second-instance triggers that
  may or may not have fired. Each needs one re-read to check.

Line counts approximate; treat them as locator hints — search by
status field for authoritative position.

## Session shape

### Phase 1 — `due` queue execution

For each of the 8 `due` entries, ask in this order:

1. **Has the substance already landed elsewhere?** (Lacustrine
   L320 is the worked example — landed via F-15 last session.)
   If yes: mark `graduated <date>` with cross-reference; archive
   on the next pass per audit-trail discipline.
2. **Is the graduation target small enough to land in this
   session within the 30%-context budget?** If yes: execute. If
   no: name the constraint, leave `due`, route to a follow-up
   plan with explicit phase pointer (per PDR-026 §Sequenced-
   deferral discipline; not "for later", not "next session").
3. **Does the graduation touch a directive file (`.agent/directives/*`)?**
   If yes: respect the standing 30%-context rule
   (`directive-file-context-budget`). Sequence the directive edit
   to a fresh session if context is at or above 30%; the L137
   entry is itself the rule that operationalises this.

### Phase 2 — `pending` re-evaluation

Walk every `pending` entry (~76) once. For each ask:

1. **Has the named trigger condition fired?** (Most are "second
   instance OR owner direction".) If yes: move to `due`. If `due`
   and small: execute in same pass.
2. **Is the trigger vaporware-shaped?** (Per
   [`distilled.md`][distilled] §Sequenced-Deferral Discipline —
   pointing at unmet `future/` plan promotion gates.) If yes:
   close as `not-graduating-here` with rationale, OR re-route
   the substance to land now without the gating.
3. **Is the substance still load-bearing?** If the captured
   surface has been superseded by other graduations, archive
   with `superseded-by: <link>` cross-reference.

### Phase 3 — surface the residual shape

After Phases 1–2, measure the file:

- If line/char count fits the limit (≤1400 / ≤90,000): success;
  surface as next-audit input clean.
- If still HARD: name the residual shape honestly. Three legitimate
  responses per the prior opener's boundary:
  - **Enlarge the queue file** — owner-direction-shaped frontmatter
    limit raise, with audit reasoning.
  - **Split by domain** — register split (e.g. tooling-friction
    register, doctrine-graduation register, plan-ADR-amendment
    register) with cross-references.
  - **Escalate the queue draining cadence** — owner-direction-shaped
    schedule for periodic dedicated drain sessions.

Surface for owner direction; do not pick one unilaterally.

## Boundary — substance > destination fitness (continued)

Same rule as the prior opener: when graduating substance to
permanent homes (rules, ADRs, PDRs, governance docs, patterns),
do not let destination-file fitness limits gate the move. The
current soft signals on `agent-collaboration.md`, `distilled.md`,
`practice-bootstrap.md`, `practice-lineage.md`, etc. are the
diagnostic surface for a follow-up calibration audit — not a
brake on legitimate graduations this session.

`practice-lineage.md` at 827/830 (3 lines of headroom before HARD)
is the next near-critical destination; flag immediately for the
calibration audit if any graduation lands substance there.

## Reviewer dispatch

After Phase 1 and Phase 2:

- `docs-adr-expert` — verify executed graduations landed
  substance in correct homes per the placement-contract analogue.
- `code-expert` — verify markdown/yaml/json validity, links
  resolve.

Brief on **execution-legitimacy, not decision-validation** — the
graduations are owner-directed via this opener; reviewer remit is
*did the graduations apply the substance correctly*.

## Validation

Per quality-gate cadence (one gate at a time):

1. `pnpm practice:fitness:informational` — expect
   `pending-graduations.md` HARD to drop substantially. Persisting
   HARD acceptable if Phase 3's surfacing names the residual shape
   for owner direction.
2. `pnpm practice:vocabulary` — expect green.
3. `pnpm markdownlint:root` — expect clean.
4. `pnpm agent-tools:collaboration-state -- check` — expect ok.

## Companion items (deferred — do not pull in)

These remain queued from the 2026-05-06 opener; explicit
non-pull list:

- `agent-collaboration.md` extraction question (raise hard limit
  vs extract Communication Channels).
- `practice-bootstrap.md` recalibration question.
- `testing-patterns.md` stub question.
- `learning-before-fitness.md` vs file-basename
  `substance-before-fitness.md` rename.

## Run

Apply `/jc-start-right-quick` (no directive-edit work expected
unless the L137 30%-context entry's PDR is queued and budget
allows). Apply the napkin skill at session-open. The boundary
rule for this session is: **dedicated drain — no scope creep**.
Land legitimate graduations; archive completed ones; surface
residual shape as next-audit input or owner-direction request.

[distilled]: ../../../memory/active/distilled.md
