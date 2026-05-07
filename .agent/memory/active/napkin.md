---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-06-evening-graduation-pass.md`][archive-pass];
the prior pre-step napkins are at
[`archive/napkin-2026-05-06-evening.md`](archive/napkin-2026-05-06-evening.md)
and
[`archive/napkin-2026-05-06.md`](archive/napkin-2026-05-06.md).

[archive-pass]: archive/napkin-2026-05-06-evening-graduation-pass.md

## 2026-05-07 — Windward Darting Horizon / cursor / opus-4.7 / `dd084d`

Authored top-level `graph-mvp-arc.plan.md` as cross-collection
coordination spine sequencing 3 vertical slices (EEF → Oak Threads →
mcg sub-graph + EEF×mcg cross-corpus). Coordination amendments landed
(ADR-157 namespace, eef-* tool renames, portfolio index, high-level
plan cross-link).

Two course-corrections in same session, both captured to
[`pending-graduations.md`](../operational/pending-graduations.md) as
graduation candidates (sequence-or-admit-not-doing doctrine; spine-
drift-via-comprehensive-cataloguing anti-pattern):

- Added unsequenced `mvp_arc_status: deferred` to NC SKOS taxonomy
  plan → owner: *"we never mark anything as deferred, we sequence
  things properly or we admit we are not going to do them"*.
- Re-framed as `mvp_arc_sequencing` + `## Out-of-MVP-Arc Items` spine
  section → owner: *"the NC work is explicitly NOT part of the MVP,
  you have clearly become confused and this session has been dragging
  on in a long tail of low to negative value"*.

**Behaviour change**: when authoring an MVP/coordination spine, the
spine tracks ONLY what's IN the spine's commitment. Adjacent plans
own their own promotion-triggers in their own homes. Don't catalogue
"things adjacent that the spine doesn't ship" — that's a portfolio
index, not the spine. When the owner gives a concise correction,
apply it minimally and stop; don't generalise the correction into a
broader audit on speculation.

Smaller observations from this session:

- Doc-only coordination amendments to `current/` plans are cheap and
  parallel-safe (the eef-* rename was 19 occurrences via 5 replace-
  alls; ADR-157 was 2 StrReplaces); landing them at spine-authoring
  time removes acceptance-criteria ambiguity for downstream gates.
- ADR conformance (e.g. ADR-157 namespace prefixes) isn't checked at
  plan-author time when the ADR predates the plan — the eef-evidence-
  corpus plan was authored before ADR-157's prefix was finalised.
  When authoring/amending plans that ship MCP primitives, grep
  ADR-123 + ADR-157 + ADR-168 namespace tables before finalising
  tool names.

## 2026-05-06 — Clouded Lifting Aerie / claude-code / opus-4-7-1m / `1e2244`

### Rotation summary — graduation pass on five 2026-05-06 napkin sessions

This session executed Step 1 of the
`2026-05-06-napkin-and-pending-graduations-processing-opener.md`
opener: walked the prior rotation's five 2026-05-06 sessions
(Embered Melting Kiln, Briny Plumbing Fjord, Cindery Charring
Pyre, Umbral Cloaking Silhouette, Hidden Slipping Moth) and
routed substance to permanent homes per the always-graduate
rule. Boundary applied: substance > destination fitness.

Verified destinations as at archive time:

- Three new patterns landed in
  [`.agent/memory/active/patterns/`](patterns/README.md):
  - `consolidation-output-shape-pattern-vs-report.md` (process,
    pattern) — Briny's "one repeating shape across N findings →
    contract; N independents → report" diagnostic.
  - `audit-rule-body-on-prohibition-extension.md` (agent,
    pattern) — Hidden's lesson from extending
    `no-moving-targets-in-permanent-docs.md` and the rule body
    self-violating the new clause.
  - `in-session-contract-authoring-conditions.md` (process,
    pattern) — Hidden's three-condition gate for authoring a
    directive in the same session as the plan that proposes it.
- Patterns README index updated; Process count 29→31, Agent
  count 9→10.
- Markdown-prose-acceptance-criteria insight from Cindery
  landed in
  [`docs/governance/development-practice.md`](../../../docs/governance/development-practice.md)
  § Documentation Practice (one bullet, prose-vs-code-contracts
  doctrine).
- Friction register updates in
  [`frictions-register.md`](../../plans/agent-tooling/frictions-register.md):
  - F-15 added — commit-queue fingerprint recursion when claim
    file is in staged set; workflow-that-works documented.
  - F-14 evidence note appended — Clouded Lifting Aerie session
    reproducer of `--area-pattern` last-write-wins.
  - F-09 evidence note appended — Clouded Lifting Aerie session
    five-round-trip composition cost on `claims open`.
  - F-05 related-shape note appended — Hidden's `comms send`
    legacy-event-schema render failure; cure should extend to
    schema-shape mismatches not only parse failures.
- Archived to [`napkin-2026-05-06-evening-graduation-pass.md`][archive-pass]
  with full pre-archive content preserved.

Substance archived as instances-of-existing-rules (no new
graduation, just historical evidence preserved in archive):

- Embered: substance-trim mistake → already covered by
  [`learning-before-fitness.md`](patterns/substance-before-fitness.md)
  pattern; Embered's instance preserved in commit `40f7da45`
  ("re-add substance trimmed for fitness limits").
- Embered: review-fix-as-real-time → covered by user-memory
  `feedback_no_backfill_reviews`.
- Briny: doctrine-scanner vaporware → already in
  [`distilled.md`](distilled.md) preamble.
- Briny: learning-loop framing reframe → already in
  [`distilled.md`](distilled.md) preamble + plan exists.
- Briny: foreign-stage absorption recurrence → cure named in
  `agent-collaboration.md` directive (`git commit -- pathspec`);
  recurrence noted only.
- Umbral: reviewer-brief-scope-opens-closed-decision → covered
  by user-memory `feedback_reviewer_brief_respects_decided_scope`.
- Umbral: npx skills lifecycle → covered by user-memory
  `feedback_build_vs_buy_first`.
- Umbral: bootstrap fast-path missed → covered by
  `register-active-areas-at-session-open` rule.
- Hidden: `+` bullet misread as diff marker → small behavioural
  note; archived without graduation.

Surfaced for the next-audit input (per opener boundary):

- `agent-collaboration.md` extraction question — surfaced in
  commit `40f7da45` and `ca0794fc`'s body. Companion item
  retained in opener as "deferred to other sessions".
- `practice-bootstrap.md` recalibration question — companion
  item.
- `testing-patterns.md` stub question — companion item.

The single small new pending-graduations entry from this
napkin pass — Briny's "/doctor is session-local evidence, not
a shell gate" behavioural correction — is added directly to
[`pending-graduations.md`](../operational/pending-graduations.md)
as part of Step 2 processing.

### Session-shape note: Step 1 of the opener completed; Step 2 (pending-graduations) follows

This session uses checkpoint-commit discipline between Steps 1
and 2 to keep the diff readable and let the napkin-graduation
batch land cleanly before the larger pending-graduations walk
begins. Step 2 may not fully drain in this session — that is
honest output per the opener; the residual queue substance
becomes the next audit's input rather than this session's brake.

## 2026-05-07 — Pelagic Rolling Harbour / claude-code / opus-4-7-1m / `58a9ad`

### Surprise 1 — fitness limits encode access-rhythm theory

**Expectation**: HARD on `pending-graduations.md` was load-bearing;
my job was to drain or surface the queue size for owner direction.

**What happened**: surfaced three Phase 3 options (enlarge / split /
cadence). Owner reframed: the limit was *arbitrarily calibrated*
against a frame that doesn't fit the file's lifecycle.
`principles.md` is loaded every session by every agent — small *is*
the quality signal. `pending-graduations.md` is accessed at
consolidation passes only and grows with cross-session-wait
substance; its limits should reflect a queue lifecycle, not a
permanent-doc shape.

**Insight**: every fitness-tracked file implicitly encodes an
access-rhythm theory in its limit shape. The schema currently
makes this implicit (line/char numbers only). Making it explicit
(`lifecycle_model: loaded-every-session | read-on-demand |
consolidation-pass-only | archive-only` plus `access_pattern`
frontmatter) would make recalibration principled rather than
ad-hoc, and let fitness output classify violations by whether the
limit is structurally appropriate or just stale. **Captured as a
new `pending` entry in pending-graduations.md** with explicit
graduation target (ADR-144 amendment + possible cross-repo PDR);
not landed in-band per no-speed-pressure.

**Behaviour change**: when surfacing fitness signals as
load-bearing, ask first whether the limit's access-rhythm theory
matches the file's actual lifecycle. If it doesn't, recalibration
is the substance-led structural fix; the alternative options
(split, cadence) are not equivalent.

### Surprise 2 — reviewer conflated opener procedural text with diff content

**Expectation**: docs-adr-reviewer's P2 finding ("four citations
to a not-yet-existent PDR-026 §Sequenced-deferral discipline")
was a real issue with my diff.

**What happened**: verified my actual diff via `git diff | grep`.
My edits cite `distilled.md §Sequenced-Deferral Discipline`
(correct current home), not PDR-026. The reviewer read the
opener's procedural text — which DID say "per PDR-026
§Sequenced-deferral discipline" — and conflated it with the diff
content.

**Insight**: when reviewer findings cite specific text that the
diff doesn't actually contain, *verify against the diff before
applying the fix*. The reviewer's analysis can be load-bearing in
substance even when the textual claim is wrong; in this case the
substance was a false positive (the reviewer noted distilled.md
IS the correct home, which my diff already used). Trust-but-
verify on textual claims; a `git diff | grep` check is cheap.

**Behaviour change**: when a reviewer cites text-string evidence,
spot-check it before applying corrections. Saves wrong-direction
edits when the reviewer drifted from the diff to surrounding context.

### Surprise 3 — markdownlint MD004 fires when mixing `+` and `-` list markers

**Expectation**: adding a TOC index using `-` bullets to a file
that uses `+` bullets for entries would be cosmetically fine
since markdownlint normally accepts any consistent style.

**What happened**: 4 MD004 errors fired immediately after adding
the index with `-` markers; the file's `+` convention became
the "expected" style and all `-` markers in my new index errored.

**Insight**: markdownlint MD004 enforces consistency *within* a
file based on the first marker seen, not a global preference.
When extending a file, match the existing bullet style or expect
errors at every new marker.

**Behaviour change**: when adding sections to existing markdown
files, grep the file for existing list-marker style before
authoring new lists. One-line check that prevents a
markdownlint-fix loop.

## 2026-05-07 — Breezy Navigating Sail / cursor / opus-4.7 / `9edbd1`

Closed the graph MVP-arc PLANNING arc in a single session per owner
direction. Five phases + pre-flight in 6 commits (`62ffd8b8`,
`d740baa0`, `82b3a792`, `776df6b7`, `0899ba93`, `58e61f85`); three
slice plans authored; 1 spine BLOCKER + 2 slice-plan BLOCKERs
remediated same-session; 6 FINDINGS + 2 topology BLOCKERs deferred to
next-session execution-prep with file:line citations. Working tree
clean.

### Surprise 1 — two reviewers converged on the same BLOCKER through different reasoning

**Expectation**: Phase 4's parallel `code-reviewer` +
`assumptions-reviewer` batch over the three slice plans would surface
mostly-disjoint findings (one focuses on quality/structure, the other
on assumption hygiene).

**What happened**: they converged on the **same** BLOCKER from
different angles. `code-reviewer` flagged slice 2 saying "slice 3b
composes this slice's tool by name" (B1 — internal contradiction).
`assumptions-reviewer` flagged slice 3b's "compose slice-1 + slice-3a
tools by name" framing as contradicting Design Principle 1 (BLOCKER —
substrate-only). Both reviewers, different surfaces, same conceptual
mistake: I had described slice 3b as composing OTHER MCP TOOLS at
runtime, when the correct model is composing the underlying graph
data through `graph-corpus-sdk` substrate. The "by name" phrasing
appeared in 4 places across slices 2, 3a, 3b — all symptoms of one
wrong mental model.

**Insight**: when two independent reviewers converge on the same
finding through different reasoning paths, that's higher-confidence
signal than either alone, AND it points at a deeper conceptual
mistake than either reviewer named directly. The surface lint is the
visible edge; the mental model under it needs the actual fix. In this
case, fixing only the cited spots would have left the wrong framing
intact in the other 2 spots.

**Behaviour change**: when reviewers converge, treat the convergence
as a marker for an upstream conceptual mistake. Grep all related
surfaces for the symptomatic phrase before fixing only the cited
ones.

**Candidate**: process pattern — `reviewer-convergence-points-at-conceptual-root.md`. First instance. Capture only.

### Surprise 2 — owner-bounded reviewer scope made single-session closure achievable

**Expectation**: planning closure for the MVP-arc would take 4
sessions per the prior session's opener (5-reviewer parallel pass +
reviewer remediation + slice plan authoring + slice plan review).

**What happened**: owner directive — *"Reduce the reviewers to the
code reviewer and the assumption reviewer, and finish the planning
this session. … Have a specialist do the topology review in
parallel."* — collapsed the reviewer set from 5 to 2+1 and forced a
single-session arc. Result: all five phases landed cleanly in one
session, BLOCKERs surfaced AND remediated AND captured for
next-session, with no quality regression.

**Insight**: "comprehensive review" was over-scoped relative to the
session-bounded landing target. The 5-reviewer plan was applying a
"thorough review every pass" default rather than asking what the
proportional reviewer set was for THIS arc's BLOCKER-surfacing job.
The 2+1 set hit the same surface (composition discipline, assumption
audit, topology coupling) without the redundancy.

**Possible second instance** of the existing
`spine-drift-via-comprehensive-cataloguing` pending-graduation entry
(2026-05-07, Windward Darting Horizon — that one was about spine
authority over-scope; this one is about reviewer-pass over-scope).
Same mechanism: agent broadens for "comprehensive coverage", owner
corrects toward proportionality. Different shape (review proportionality
vs spine proportionality). Capture for `consolidate-docs` to decide
whether the existing entry's polarity covers this, or whether a
separate entry is warranted.

**Behaviour change**: when planning a multi-reviewer pass, ask
explicitly *"What is the proportional reviewer set for THIS arc's
specific gating decision?"* before defaulting to "every relevant
reviewer". The answer is owner-set when the session has a hard
landing commitment.

### Surprise 3 — plan-mode JSON edit blocked during session-handoff

**Expectation**: session-handoff would run cleanly through to commit;
mode is opaque to the workflow.

**What happened**: editing `active-claims.json` (Step 8 — release the
closing claim) was blocked with "Plan mode can only edit markdown
files and canvas files", despite a system signal that I was in agent
mode. Switched to agent mode via `SwitchMode`, edit succeeded, commit
landed.

**Insight**: session-handoff Step 8 (close collaboration lifecycle
surfaces) requires JSON edits to the collaboration registry — those
are not markdown. Sessions that run handoff while plan-mode-active
will hit this. A `SwitchMode` ahead of Step 8 (or a documented
handoff prerequisite of "agent mode") would prevent the mid-flow
interruption.

**Behaviour change**: if session-handoff is invoked while plan-mode
is active, switch to agent mode before Step 2 (which also touches
`repo-continuity.md` — markdown, OK) so Step 8's JSON edit lane is
already open when reached.

**Candidate**: small operational note to potentially add to
`session-handoff.md` Step 8 preamble — *"Step 8 requires write
access to JSON; switch out of plan mode before reaching this step."*
Capture only.

### Process observation — phase-commit discipline for multi-phase planning sessions

5 phases + pre-flight = 6 commits, each phase landing as one commit
with quality gates green and explicit Owner Decisions Log entries on
the spine. Made it possible to sustain the cognitive load of a
single-session planning closure across reviewer batches and BLOCKER
remediation without losing the through-line. Already covered by the
existing TDD-pairs / atomic-commit doctrine; not a new candidate.
