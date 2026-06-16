# ADR-144: Three-Zone Fitness Model

**Status**: Accepted
**Date**: 2026-04-17
**Supersedes**: ADR-144 (two-threshold model, 2026-04-01) — amended in place. Git
history preserves the prior revision.
**Amended**: 2026-04-26 — clarified that hard and critical zones are
structural health signals, never reasons to suppress capture, distillation,
graduation, or knowledge preservation.
**Amended**: 2026-05-07 — clarified non-reactive handling: fitness output must
remind agents to preserve substance first and route pressure structurally, not
trim memory or Practice Core content to make the signal disappear.
**Amended**: 2026-05-14 — extended the two-threshold model to optional
`fitness_token_target` / `fitness_token_limit` frontmatter fields with
content-only chars/4 estimation, and made target-only token configuration an
invalid frontmatter shape reported as a separate configuration finding with
mode-dependent exit semantics. See §Token Threshold Extension below.
**Amended**: 2026-05-25 — added the `fitness_content_role` frontmatter axis so
empty-content readiness applies only to drainable buffers, not directives or
other load-bearing reference surfaces. See §Content Role Extension below.
**Amended**: 2026-06-15 — the informational and strict-hard reports group the
per-file section by disposition category (orthogonal to the zone axis). See the
Amendment Log entry below.
**Amended**: 2026-06-16 — added the decision-debt count metric
(`fitness_item_count_*`), a new metric _kind_ that measures conceptual objects
(flow-rate), not content size, using discrete **ceiling** thresholds
(`target`/`soft`/`hard`, no ratio) plus a dwell-time axis (`fitness_item_dwell_*`).
See §Decision-Debt Count Extension below.
**Amended**: 2026-06-16 — **all fitness output is report-only: a prioritisation
signal, never a build gate** (the validator always exits 0). This is a _semantics_
correction (gate → signal), **not** a severity reduction — a `hard`/`critical`
zone is as important as ever, surfaced and acted on with full weight, and report-
only is not optional-to-heed. It reconciles this model with the routing doctrine
("fitness is a signal that routes work, never a completion gate"); the original
"advisory and ignored" drift is answered by prominence and discipline, not by
gating. See §Exit code semantics.
**Amended**: 2026-06-16 — named the optional `lifecycle_model` and
`access_pattern` frontmatter fields as recommended **declarative** metadata
(advisory; not validator-enforced). Every fitness-tracked file implicitly
encodes an _access-rhythm theory_ in its limit shape — a directive loaded every
session (small is the quality signal), a consolidation-pass-only register (grows
with cross-session-wait substance), and an archive have different healthy
shapes. Declaring the access rhythm makes recalibration principled rather than
ad-hoc. Example values: `loaded-every-session`, `read-on-demand`,
`consolidation-pass-only`, `archive-only`. Owner-decided 2026-05-23 (a governed
model concept and a candidate for portable Practice doctrine pending a second
Practice-bearing repo); the local cure is already live in
`pending-graduations.md` frontmatter.
**Related**: [ADR-131 (Self-Reinforcing Improvement Loop)](131-self-reinforcing-improvement-loop.md),
[ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md),
[ADR-127 (Documentation as Foundational Infrastructure)](127-documentation-as-foundational-infrastructure.md),
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)

## Context

The original fitness system used a single `fitness_line_count` field per governed
document. That field inflated over time because agents could extend the ceiling
freely.

The two-threshold revision (this ADR, 2026-04-01) separated soft
(`fitness_line_target`) from hard (`fitness_line_limit`) thresholds. It fixed
the gaming problem but introduced a semantic cliff. In practice the binary
"warning vs blocking violation" model proved too coarse:

- A one-line overage above the hard limit triggered the same "blocking
  violation" response as a fifty-line overage. Agents could not distinguish
  "address at the next refinement" from "emergency, stop everything".
- Because "blocking" felt disproportionate for moderate overages, the live
  Practice drifted into teaching that fitness is advisory, not a blocking gate.
  `.agent/memory/active/napkin.md` (2026-04-16), `.agent/prompts/session-continuation.prompt.md`,
  and the active-memory distilled learning loop all arrived at "limits are
  informational, not gates". The ADR said blocking; the Practice said
  advisory; three incompatible teachings lived in the repo simultaneously.
- The original framing treated the loop-failure case (content vastly
  exceeding the ceiling) as the same class of event as the routine case
  (moderate overage). But the loop-failure case is a diagnostic signal about
  the Practice itself per ADR-131 §The Self-Referential Property, not a
  routine file-management event.

The two-threshold model solved gaming but created the cliff. The three-zone
model replaces the cliff with a graduated scale.

## Decision

The model has four **zone labels** (`healthy`, `soft`, `hard`, `critical`) but
**three actionable zones** on top of the default healthy state. The name
"three-zone" refers to the graduated severity scale — _think about it_ → _do
something soon_ → _loop failure_ — that sits above `healthy`. Fitness results
land in one of the four zone labels per metric, derived from the declared
thresholds (size metrics use a global ratio; concept-count and dwell use explicit
ceilings — see §Decision-Debt Count Extension).

Every zone is a **report-only prioritisation signal**: it ranks how urgently to
act and is surfaced and acted on with full weight, but it never fails a build (see
§Exit code semantics). This gate→signal framing is a **semantics correction, not a
severity reduction** — it reconciles this model with the routing doctrine
("fitness is a signal that routes work, never a completion gate").

| Zone       | Condition                                                    | Meaning                                          | Required response                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `healthy`  | count ≤ target (or ≤ hard limit where no target is declared) | Within design envelope                           | None                                                                                                                                                                                     |
| `soft`     | target < count ≤ hard limit                                  | Drifting; refinement opportunity                 | Consider refinement at the next natural boundary — consolidation, plan closure, or refactor touching the file. **Never blocks.**                                                         |
| `hard`     | hard limit < count ≤ hard limit × `CRITICAL_RATIO`           | Overweight; structural response needed           | Remediate, split, graduate, or route owner-approved limit change at the next natural boundary. Never suppress preserved learning.                                                        |
| `critical` | count > hard limit × `CRITICAL_RATIO`                        | Loop failure — governance has not fired upstream | Top prioritisation signal: open a remediation lane and conduct a loop-health post-mortem (§Loop Health); preserve the learning. Report-only — surfaced prominently, never build-failing. |

`CRITICAL_RATIO` is declared once in the validator
(`scripts/validate-practice-fitness.ts`) as a named constant. Its current
value is `1.5`. The ratio applies uniformly to `fitness_line_limit`,
`fitness_char_limit`, `fitness_line_length`, and `fitness_token_limit`.
No per-file `fitness_*_critical` frontmatter field exists; if a file
legitimately needs divergent critical-zone behaviour, the correct response is
to adjust its hard limit, not to introduce per-file ratios. This choice
follows `.agent/directives/principles.md` §Strict ("do not invent
optionality").

For metrics with only a hard ceiling (`fitness_char_limit`,
`fitness_line_length`), there is no `soft` zone — the metric is `healthy`,
`hard`, or `critical`. The overall zone for a file is the worst zone across
all its declared metrics.

### Token Threshold Extension

The two-threshold pair model accepts optional token thresholds:

| Field                  | Role                                                |
| ---------------------- | --------------------------------------------------- |
| `fitness_token_target` | Soft boundary (target). Optional; pairs with limit. |
| `fitness_token_limit`  | Hard boundary. Optional; required if target is set. |

Token counts are content-only chars/4 estimates derived from the markdown
body after frontmatter extraction. The estimator rule matches
`agent-tools context-cost`, but the two surfaces intentionally differ for
files that carry YAML frontmatter (fitness measures content-only; context-cost
measures raw files).

Token zones fold into `overallZone` exactly like line zones: `healthy`,
`soft`, `hard`, and `critical` derive from the same threshold-pair semantics
and the same `CRITICAL_RATIO`.

`fitness_token_target` declared without `fitness_token_limit` is **invalid
frontmatter**: the validator reports it as a configuration finding that is
separate from `overallZone` (the file is not classified as soft, hard, or
critical on that basis alone). Configuration findings are surfaced like every
fitness reading and **never gate**: the validator always exits 0 in all modes
(see §Exit code semantics). A malformed declaration is still a schema error to
fix — reported prominently — just not a build-failing one.

This protects the threshold-pair invariant without inventing a target-only
zone contract.

### Content Role Extension

The fitness model now distinguishes file role from size zone. Size thresholds
answer "is this content too large for its role?"; content role answers "what
does emptiness mean here?"

| Field                  | Values                          | Default     | Meaning                                                               |
| ---------------------- | ------------------------------- | ----------- | --------------------------------------------------------------------- |
| `fitness_content_role` | `reference`, `drainable-buffer` | `reference` | Declares whether an empty file is pathological or a successful drain. |

`reference` is the default for directives, Practice Core documents, ADRs,
PDRs, READMEs, and other load-bearing surfaces. Empty reference content is a
configuration finding, because an empty directive is not "ready"; it is missing
its contract.

`drainable-buffer` is for knowledge buffers and back-pressure control files
whose ideal end state can be empty after every item is curated elsewhere:
`napkin.md`, `distilled.md`, `pending-graduations.md`, active
pending-graduations shards, `open-questions.md`, and MEMORY-style capture
queues. Only these files may appear in the `ready (empty)` inventory.

### Decision-Debt Count Extension

The size metrics above (lines, characters, prose width, tokens) all measure the
_size_ of a file's text. The decision-debt count measures something categorically
different: the number of **conceptual objects** inside a file — schema-conformant
entries — and so reads the _flow rate_ of a buffer (is the consuming stage keeping
pace with the producer?), not its size. It is a buffer's defining health signal
(PDR-067), and its cure is to **decide** items and diagnose the pipeline (PDR-068),
never to trim content or raise a limit.

| Field                       | Role                                                             |
| --------------------------- | ---------------------------------------------------------------- |
| `fitness_item_count`        | Designation: `required` marks a file as concept-counted.         |
| `fitness_item_count_target` | Count healthy ceiling — the empty-buffer target (typically `0`). |
| `fitness_item_count_soft`   | Count soft ceiling (explicit discrete integer).                  |
| `fitness_item_count_hard`   | Count hard ceiling; beyond it is critical.                       |
| `fitness_item_dwell_target` | Dwell healthy ceiling, in days (the grace period).               |
| `fitness_item_dwell_soft`   | Dwell soft ceiling, in days.                                     |
| `fitness_item_dwell_hard`   | Dwell hard ceiling, in days; beyond it is critical.              |

Semantics:

- **It is discrete, not proportional.** A concept-count maps to a zone through
  explicit integer **ceilings** — healthy `≤ target`, soft `≤ soft`, hard `≤ hard`,
  else critical — NOT the size model's `× CRITICAL_RATIO`. Fractional headroom
  suits large magnitudes (`1000 × 1.5`) but is a category error on small discrete
  counts (`2 × 1.5 = 3` is a coincidence). The schema is derived from the size
  schema but deliberately not identical; the four zone _labels_ are shared (one
  vocabulary — Key Principle 1), the _classification mechanism_ differs. With the
  register's `target 0, soft 2, hard 3`: `0` healthy, `1–2` soft, `3` hard, `4+`
  critical — a fast ramp, because the target is an empty buffer.
- **Dwell-time is a second axis, same vocabulary.** Each register entry's
  `captured` date is its createdAt; an optional `updated` date is its lastUpdated.
  The oldest undecided item's age in days is classified through the **same ceiling
  engine** with the `fitness_item_dwell_*` thresholds (the register's: `target 2,
soft 4, hard 7` days). Count answers "how many are undecided"; dwell answers "how
  long has the oldest sat" — both rank how urgently to drain.
- **Every zone is a prioritisation signal, never a gate.** The gradation does not
  select different actions (the action is always: decide); it ranks urgency. Like
  all fitness output it is report-only (§Exit code semantics) — surfaced and acted
  on with full weight, never failing a build. The reading is its own report
  category (flow-rate, not size); it is NOT folded into a file's size `overallZone`.
- **It is mandatory for designated files — a schema has no optional parts.** A file
  carrying `fitness_item_count: required` MUST declare both ceiling trios
  (`fitness_item_count_{target,soft,hard}` and
  `fitness_item_dwell_{target,soft,hard}`); a concept-counted file with missing
  thresholds is a **schema failure** (a configuration finding — surfaced, not
  gating). The metric does not apply to undesignated files.
- **The count falls only by deciding.** An item leaves the count only through a
  recorded terminal disposition (graduated / rejected / duplicate), never by
  deletion, annotation, or raising a limit. Lowering the number any other way is
  the fitness→goal inversion this model forbids.

See [PDR-100](../../../.agent/practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md)
for the owner-gated abolition and the provenance-over-perfection doctrine this
metric enforces.

### Exit code semantics

Fitness is **report-only**: the validator surfaces every zone and configuration
finding but **always exits 0** — it never fails a build. The modes govern report
framing only.

| Mode              | Invoked via                                         | Exit |
| ----------------- | --------------------------------------------------- | ---- |
| `--informational` | `pnpm practice:fitness:informational`, `pnpm check` | `0`  |
| strict (default)  | `pnpm practice:fitness`                             | `0`  |
| `--strict-hard`   | consolidation-closure signal, commit advisory       | `0`  |

This is a **semantics correction, not a severity reduction.** A `hard` or
`critical` zone is exactly as important as before — it is the strongest signal to
prioritise draining or structural remediation, surfaced prominently and acted on
with full weight. What changed is that fitness _routes_ work rather than _blocking_
it, reconciling this model with the routing doctrine ("fitness is a signal that
routes work, never a completion gate"). In practice no hook or CI ever consumed
the fitness exit code — it has only ever been a manually-run report — so this
removes **dead** enforcement, not live enforcement, and aligns the code with how
fitness was actually used. The original concern — fitness drifting to "advisory
and ignored" — is answered by the signal's prominence and the discipline to run
and act on it at consolidation/handoff cadence, **not** by a build gate.
Report-only is not optional-to-heed.

### Non-Reactive Handling

Fitness is an interaction surface, not only a report. Every non-healthy fitness
output MUST remind the observing agent that the signal is not permission to cut
content. The expected posture is:

1. Preserve the substance at the weight it deserves, especially in memory and
   Practice Core surfaces.
2. Read the signal as a question about structure, lifecycle, home, or cadence.
3. Route the pressure deliberately: home or graduate the concept, split by
   responsibility, refine real redundancy, review the declared limit, open a
   remediation lane, or ask the owner for an explicit decision.

Forbidden responses: deleting captured knowledge; compressing a concept until
it fits; weakening Practice Core prose to satisfy a metric; trimming memory
surfaces because they are heavy; or making budget-shaped edits without a named
structural response.

### Key Principles

1. **One scale, one vocabulary everywhere.** The four zone names (`healthy`,
   `soft`, `hard`, `critical`) are used verbatim in the validator output, in
   the consolidation workflow, in `.agent/memory/active/distilled.md`,
   in `.agent/memory/operational/repo-continuity.md`, in the outgoing
   practice-context file, and in any future fitness-related surface. One
   concept = one name (`.agent/directives/principles.md` §Code Design).

2. **Hard limits and critical thresholds are constants, not formulas.** Hard
   limits are declared in frontmatter per file. The critical threshold is a
   single ratio applied globally. Neither grows with content.

3. **Reaching `hard` is routine; reaching `critical` is not.** The `hard`
   zone is the expected target of the refinement loop — files naturally drift
   there between consolidations. The `critical` zone is a diagnostic signal
   that the loop has failed upstream.

4. **`fitness_char_limit` and `fitness_line_length` are non-adjustable.**
   Only the user may change them, and only in exceptional circumstances.

5. **Fitness management does not block graduation.** Graduation checks
   stability and natural home; fitness management runs after graduation.

6. **No backward compatibility.** The two-threshold language ("warning",
   "blocking violation", "advisory, not a blocking gate", "informational, not
   gates") is retired in the same change. All live surfaces adopt the zone
   vocabulary. `.agent/directives/principles.md` §Refactoring: "NEVER create
   compatibility layers."

7. **Thresholds derive from the surface's documented function, not the measured
   corpus.** A limit is a property of what the surface's `fitness_content_role`
   _should_ occupy — a thread-continuation record is a compact pickup surface
   (identity + current state + landing target + standing decisions + the latest
   live handoff banner); a drainable buffer holds in-flight items. Set the
   threshold once from that function and hold it. Curve-fitting limits to the
   current file-size distribution bakes existing bloat into the "healthy" band
   and drifts as the corpus drifts; a bloated file is then a _function
   violation_ that should trip the signal, not a large healthy file. Use the
   `fitness_content_role` vocabulary to make the classification explicit.

## Loop Health

Reaching `critical` is always a loop-health signal, not a routine state.
ADR-131 §The Self-Referential Property requires that the Practice's own
governance applies to itself: _"If rules about rule creation cannot be refined
through the same loop, the enforcement stage is exempt from its own governance."_

When a file reaches `critical`, the required response includes — in addition
to local remediation — a short post-mortem:

1. **Why did the earlier zones not fire?** Was `pnpm practice:fitness` run at
   the expected cadence (session handoff, consolidation closure)? If not,
   which cadence has degraded?
2. **Was the limit set incorrectly?** Is the `fitness_line_limit` (or
   `fitness_char_limit`) too low for the file's legitimate role, or has the
   file's role changed such that its natural size is now larger than its
   declared ceiling?
3. **Is the file a symptom of a missing graduation?** Content accumulation
   often signals that a governance home (ADR, governance doc, README) is
   missing for material that `.agent/memory/active/distilled.md` or the napkin has
   been holding.

The post-mortem is short by design — three questions, not a full session. Its
purpose is to surface loop-level failure modes before they re-emerge.

## Consequences

### Positive

- Graduated response matches graduated severity. The false dichotomy between
  "ignore" and "halt" is retired.
- Consistent vocabulary across every live surface. Agents learn one mental
  model.
- The `critical` zone names the loop-failure case as a distinct event, giving
  it the diagnostic treatment it requires instead of burying it inside
  "blocking violation" language.
- Routine commit flow is no longer interrupted by near-limit drift;
  consolidation closure still enforces explicit disposition.

### Negative

- One additional threshold (the `CRITICAL_RATIO` multiplier) must be
  internalised. It is a single global constant, not a per-file field, so the
  burden is small.
- Surface-consistency discipline is required: the zone vocabulary must appear
  verbatim on every live surface. `scripts/validate-fitness-vocabulary.ts`
  (invoked via `pnpm practice:vocabulary`) scans live markdown and script
  surfaces for the retired two-threshold phrases and exits 1 if any appear
  outside permitted locations (this ADR itself, outgoing broadcast
  artefacts, archives, and experience files).

### Neutral

- Validator changes: a zone classifier, one new mode flag (`--strict-hard`),
  and updated output formatting. The existing exported surface
  (`evaluateFitnessFile`, `shouldInspectFitnessPath`) extends
  rather than being replaced.
- No renaming of frontmatter fields. `fitness_line_target`,
  `fitness_line_limit`, `fitness_char_limit`, and `fitness_line_length`
  retain their names.
- Existing file-level ratios (`fitness_line_limit` is ~1.3× `fitness_line_target`
  across most governed files) are unchanged. The new critical threshold is
  derived from `fitness_line_limit`, not from `fitness_line_target`.

## Amendment Log

### 2026-04-30 — Doc-kind classification + recipe ToC contract

Owner direction (2026-04-30 Verdant Sheltering Glade session): recipe
documents (`docs/engineering/*-recipes.md` and equivalents) carry higher
fitness limits than policies or directives, because their value scales
with worked examples. The contract is reciprocal — the recipe must
maintain a current table of contents at the top of the file. Adding or
removing a section without updating the ToC is a breach of the recipe
contract.

Frontmatter convention: declare `fitness_doc_kind: recipe` to mark a
recipe document. Recipe targets/limits typically run ~2× the equivalent
policy or directive (e.g. `fitness_line_limit: 500` rather than 260).
Policy/directive defaults remain unchanged. Doc-kind frontmatter does
not yet alter validator output; it is documentary classification today
and a hook point for future per-kind validation rules.

ToCs in recipe documents are agent-maintained by reading the file's
heading hierarchy. Reviewers and consolidation passes should check ToC
freshness when editing a recipe.

First applied instances: this ADR's own amendment log (recipe-shaped
amendment); `docs/engineering/testing-tdd-recipes.md` raised to
`fitness_line_target: 350 / fitness_line_limit: 500 / fitness_char_limit:
28000` and ToC added.

### 2026-05-07 — Fitness output as non-reactive reminder

Owner direction clarified that the existing doctrine was not enough when the
tool interaction itself still invited reactive behaviour. The validator output
must carry the response discipline at the point of observation: preserve
substance first; do not delete, trim, compress, or weaken memory or Practice
Core content to make the report greener; route pressure structurally.

### 2026-06-15 — Disposition-category grouping in the informational report

The informational and strict-hard reports group the per-file section by
_disposition category_ — an axis orthogonal to the zone (healthy / soft / hard /
critical). The category answers "what kind of surface is this, and what is the
right response when it is over budget", which routes consolidation work more
directly than the zone alone (drain a buffer, consolidate a directive, refine
Practice Core).

Categories, in display order — a mutability gradient, drain-freely first to
change-with-most-care last:

1. **Drainable buffers** — files declaring `fitness_content_role: drainable-buffer`.
2. **Operational & continuity memory** — every other `.agent/**` surface not
   matched below (today these are all `.agent/memory/**` continuity surfaces:
   threads, curator passes, the continuity index, executive memory).
3. **Project documentation** — any surface outside `.agent/**` (`docs/**`,
   root-level docs).
4. **Repo doctrine** — `.agent/directives/**`.
5. **Practice Core** — `.agent/practice-core/**`.

Derivation — a declared `drainable-buffer` role wins wherever the file lives;
otherwise path decides, most-specific first: `.agent/practice-core/` → Practice
Core, `.agent/directives/` → repo doctrine, any _other_ `.agent/` → operational
memory (a catch-all, so a future fitness-tracked plan or report would land here
until a more specific rule is added), and everything outside `.agent/` → project
documentation. The live source of truth is
`agent-tools/src/practice-fitness/categories.ts` — treat that module as
authoritative if this summary ever drifts. The zone inventory is unchanged and
remains the by-severity cross-cut; the grouping reorganises the per-file detail
section only.

This is the repository instantiation of the portable pattern in
[PDR-097](../../../.agent/practice-core/decision-records/PDR-097-disposition-category-grouping-in-health-reports.md):
the concrete labels and path rules above are repo-specific; the disposition-by-
mutability-gradient principle and the role-plus-location derivation are not.

### 2026-06-15 — File discovery: structural exclusion of transient roots

The practice-fitness and fitness-vocabulary walkers recurse the filesystem from
the repo root and exclude noise structurally: any non-root directory carrying a
`.git` marker (foreign git worktrees have a `.git` file, nested clones a dir) is
skipped — covering every vendor's worktrees with zero enumeration — plus the
root-anchored gitignored static roots `tmp/` and `.agent/reference-local`
(matched as `p === root || p.startsWith(root + '/')`, never a loose prefix that
would swallow e.g. a `template.md`). The proportionate fix keeps the walkers pure
and DI-testable. Source of truth: `agent-tools/src/practice-fitness/paths.ts` and
the vocabulary walker's `walk.ts`.

**Deferred deeper cure (not adopted).** Derive the discovery set from `.gitignore`
(a gitignore-aware walk, or `git ls-files` plus untracked-not-ignored), so the
exclusion list cannot drift from what the repo already treats as transient — every
exclusion added so far was already gitignored. It is deferred because it trades a
pure filesystem walk for a git subprocess or a gitignore parser (testability and
coupling cost), and `git ls-files` alone would stop scanning freshly-authored,
not-yet-tracked fitness files (an author-workflow regression to design around). It
needs deliberate design; the structural exclusion above stands until then.

### 2026-06-16 — Decision-debt count metric (a new metric kind)

Owner direction across a dedicated session: repo-learning is a first-class pillar,
and the pending-graduations buffer needs a _direct_ sensor of its decision-debt —
the count of undecided items — rather than the line-count byte-proxy that
understated it. Added `fitness_item_count_*` as a new metric kind (see
§Decision-Debt Count Extension): a flow-rate measurement of conceptual objects,
distinct in presentation (its own report category) and, like every fitness
reading, **report-only** — a prioritisation signal, never a build gate (see the
report-only amendment above and §Exit code semantics). It uses a discrete
**ceiling** classifier (`target`/`soft`/`hard`), distinct from the size model's
ratio, plus a dwell-time axis. Source of truth:
`agent-tools/src/practice-fitness/item-count.ts` (schema + count), `dwell.ts`
(dwell-time), and `decision-debt.ts` (metric). The owner-pre-approval gate
(`owner-gated`) is abolished as a status; the count is a first-class
prioritisation signal. See PDR-100.
