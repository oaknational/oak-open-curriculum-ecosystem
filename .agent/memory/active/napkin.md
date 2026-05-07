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
