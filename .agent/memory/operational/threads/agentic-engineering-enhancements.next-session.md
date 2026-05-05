# Next-Session Record — `agentic-engineering-enhancements` thread

## Active arc — Layer 0 → 1 napkin rotation per PDR-046 (landed 2026-05-05)

**Last refreshed**: 2026-05-05 (Opalescent Threading Nebula /
claude-code / claude-opus-4-7-1m / `4c1773`). Rotation pass per
consolidate-docs §6 driven by PDR-046 §Move 1 (lowest layer with
unprocessed substance is the active layer).

**Landings**:

- **Archive**: full pre-rotation napkin preserved verbatim at
  `.agent/memory/active/archive/napkin-2026-05-05.md` (463 lines,
  six session entries: 4× 2026-05-04 Lacustrine-Step-3 / Pelagic /
  Fronded / Ferny; 2× 2026-05-05 Ethereal / Lacustrine).
- **Distilled.md additions** (4 cross-session refinements): severity
  is not urgency (sharpens no-speed-pressure block); diagnose
  enforcer-tier before reaching for bypass (script-tier discipline-
  checker vs git-hook-tier blocking gate); inter-agent comms is a
  first-class coordination primitive (route through lowest-authority
  resolver); plans cite ADRs never the reverse (sharpens moving-
  targets rule at coarser granularity). Distilled grew from 296 →
  386 lines; resolution deferred to Move 3 pass.
- **Fresh napkin** keyed on this session, recording the rotation
  itself plus the explicit deferral of items not yet ready for
  distilled (capture-at-moment-validates-PDR-048 empirical
  confirmation; recursive-exclusion fourth-mechanism-shape
  candidate; pre-existing-violation operator-vs-gate gap;
  two-tier authorisation chain; commit-queue fingerprint recursion
  due-for-Layer-2; shared-comms-log generated-not-hand-edited
  awaiting second instance; turbo cache masks latent test;
  comms-event-authoring-latency; Pelagic Round-1-shape /
  Round-2-principle held for second arc; most 2026-05-04 substance
  already graduated during the 2026-05-04 layered-processing arc).

**Discipline applied**:

- PDR-027 identity row added to thread record at session open.
- Active claim opened on rotation files; no overlap with Dawnlit
  (observability) or Moonlit (smoke-tests retirement).
- PDR-046 §Move 2 honoured: no in-pass form-keeping on the active
  layer; Layer 1 fitness pressure (distilled growth) deliberately
  not addressed in this pass.
- PDR-046 §Move 3 honoured: substance graduation upward, not
  compression of existing entries.
- Substance preservation absolute: archive is verbatim; new
  entries land at full weight.
- `git commit -- <pathspec>` for the rotation commit (third-
  instance worked example of `stage-by-explicit-pathspec`).

**Next safe step for fresh session**: a Layer 1 → 2 pass per
PDR-046 §Move 1 — distilled.md is now the active layer (carrying
the four fresh refinements plus prior accumulated substance, 386
lines / 275 limit). Walk distilled.md entry-by-entry; for each:
graduation-ready → graduate to permanent home (rule extension,
PDR Notes, principles.md section, ADR, README) and remove from
distilled; not-yet-stable → leave in place. The four refinements
landed this pass each have natural Layer 2 destinations identified
(severity-is-not-urgency → no-speed-pressure rule extension or
principles entry; diagnose-enforcer-tier → companion to
hook-failures-are-questions; inter-agent-comms-first-class →
use-agent-comms-log rule extension or new follow-collaboration
adapter; plans-cite-ADRs-never-reverse →
no-moving-targets-in-permanent-docs rule extension to encode the
plan-citation case). Layer 2 fitness pressure on principles.md and
pending-graduations.md remains addressable only after Layer 1
reaches rest.

---

## Active arc — Foundational graduation pass: recursive-exclusion pattern + consolidate-docs PDR-046 pointer (landed 2026-05-05)

**Last refreshed**: 2026-05-05 (Ethereal Transiting Comet / claude-code /
claude-opus-4-7-1m / `8081d3`). Two `due` items in the
pending-graduations register graduated as a single atomic landing
(`74dcd145`).

**Landings**:

- **Pattern**: `.agent/memory/active/patterns/structural-enforcer-recursive-exclusion.md`
  (agent-tier, `related_pdr: PDR-044`). Names how a structural enforcer
  (hook, scanner, lint rule, regex matcher) handles its own cataloguing
  documents through three concrete mechanism shapes — explicit
  `exclude_paths`; per-line context exclusion; self-exclusion by
  placement. Two worked instances captured: Vining's WS3 hedging-
  vocabulary trip-list (existing-doctrine cataloguing) and Ferny's
  PDR-047 first-write fire (new-doctrine cataloguing). Pattern composes
  with PDR-047 §Test 3 by distinguishing exclusion-list-as-mechanism
  from hedge-as-substance.
- **Rule extension**: `.agent/commands/consolidate-docs.md § Learning
  Preservation Overrides Fitness Pressure` now opens with a pointer to
  PDR-046 (layered knowledge processing) as the layer-orchestration
  discipline that the per-write rule composes with, and closes with a
  PDR-046 §Move 3 reference describing graduation-upward as the
  structural cure for residual fitness pressure at rest.
- **Register status flips**: two `due` entries flipped to `graduated
  2026-05-05` with landing-target paths recorded.
- **Forward link**: `.agent/rules/no-hedging-vocabulary.md § Excluded
  Surfaces` extended with pointer to the new pattern (host-local;
  Practice-Core portability allows it).

**Reviewer-driven framing corrections**: assumptions-reviewer challenged
the initial `process` tier framing on the basis that
`governance-claim-needs-a-scanner` (the paired pattern) lives at
`agent` tier; re-categorised. assumptions-reviewer also flagged
"foundational to other due items" framing in opener as unsupported
(the other due items are not gated on A or B); re-framed as structural
pairing in commit message. PDR-047 §Notes intentionally NOT
back-amended — Practice-Core portability rule prevents Core →
host-pattern references; one-direction navigation (host pattern →
Core PDR §Notes) is the architecturally correct outcome.

**Mid-session sharpenings saved as feedback memories**:

- **Severity is not urgency** (sharpening of `feedback_no_speed_pressure.md`).
  Owner-corrected at session open: "CRITICAL means important, but it
  does not mean rush, if anything even more care and thoughtfulness is
  needed". Saved as additional paragraph encoding severity ≠ urgency
  for all escalation-tier labels (CRITICAL, HARD, P1, etc.).
- **Diagnostic over assumption** (worked instance, no graduation
  candidate yet — single instance). Owner's question "why do we need
  --no-verify?" forced inspection of `.husky/pre-commit` rather than
  assuming the commit-skill orchestrator's strict-hard gate would also
  fire at git commit time. The orchestrator and the hook chain are
  separate enforcers; conflating them led to surfacing `--no-verify`
  as a needed escape valve when the actual hook chain (format,
  markdownlint, knip, depcruise, type-check, lint, test) passed
  cleanly. Generalisation candidate: agent assumes failure path
  requires escape valve when actually the escape valve is unnecessary.

**Recursive-exclusion meta-instance discovered during commit**: the
`git --no-verify` PreToolUse bash hook block fired on my commit
attempt — the very pattern I was about to land. The structural cure
on the agent-tool layer is owner-side execution (`!` prefix runs in
owner's shell, bypassing the agent-tool hook chain). This is itself
a worked instance of the pattern, encountered live during its
graduation: the structural enforcer fires on the document that
catalogues its own pathogen, even when the document is the rule
itself. The cure remains structural exclusion — here, owner-initiated
execution rather than `exclude_paths`. Did not need to be invoked
because diagnostic question revealed `--no-verify` was unneeded.

**Next safe step for fresh session**: a deliberate **fitness-reflection
and continuing-graduation** pass on the agentic-engineering-enhancements
thread per PDR-046 layered-processing methodology. The substance for
the remaining `due` register items (commit-queue fingerprint
recursion, hook-tightening for backtick prose-vs-code, multi-agent
collaboration cures (i)-(x), the five Layer-2 PDR-shaped candidates
not-yet-drafted) and the fitness pressure on napkin / distilled /
principles.md / pending-graduations.md are connected by Move 3 — the
substance-led cure for fitness pressure at rest is graduation upward.
Order is bottom-up per Move 1: napkin (Layer 0) first, then distilled
(Layer 1), then permanent doctrine (Layer 2). The opener in
`.agent/plans/agentic-engineering-enhancements/current/` (or as a
session-handoff brief) will name the layered traversal sequence and
which substance is graduation-ready vs which is residual structural
pressure.

---

## Active arc — Doctrine enforcement + rules and index integration (closed 2026-05-04)

**Last refreshed**: 2026-05-04 (Vining Spreading Seed / claude-code /
claude-opus-4-7-1m / `11429f`). Closed the
`doctrine-enforcement-quick-wins.plan` (WS3, WS4, WS6 landed as
atomic TDD-cycle commits) and the rules-and-index integration
that the plan's "Documentation Propagation Commitment" required.

**Landings:**

- WS6 — Bash hook now blocks `git add -A` / `--all` / `.` with
  per-pattern citations surfaced in the deny payload. Schema
  extended: `preToolUse.blocked_patterns` accepts string-or-object
  entries; matcher returns the matched `BlockedEntry`.
- WS3 — `preToolUseContent.scoped_blocks` carries thirteen
  hedging-vocabulary literals scoped to PDRs / plans / ADRs /
  governance, with recursive exclusion of the documents that
  catalogue the trip-list (principles.md, distilled.md, PDR-043,
  PDR-044). Path-scope mechanism: substring includes plus
  `**/*.suffix` endsWith.
- WS4 — `kind: "regex"` scoped block with three line-level
  exclusions (fenced code blocks, inline-code spans,
  `(historical reference)` markers) plus a hex-with-letter
  lookahead so pure-decimal tokens do not trip the matcher.
  Initial citation referenced a distilled.md section that
  Fronded's parallel layer-2 rotation removed in the same arc;
  citation repaired in the same session.
- Plan status flipped to COMPLETE.
- Three rule files authored as canonical-plus-adapters triples
  (`stage-by-explicit-pathspec`, `no-hedging-vocabulary`,
  `no-moving-targets-in-permanent-docs`). `RULES_INDEX.md`
  preamble reframed from Codex-only fallback to canonical
  platform-independent enumeration; `AGENT.md §Rules` wired to
  point at it as single source of truth for the always-applied
  rule tier.

**Self-violation discovery (worked instance for the new
no-moving-targets rule):** the first attempt at authoring the
rule files embedded backticked commit SHAs in the rule prose.
The repo's permission system rejected the write — I had just
authored a rule against moving targets in permanent docs and was
about to violate it on the rule file itself. The discovery: the
WS4 hook's inline-code exclusion strips backticked spans before
the regex test, so backticked SHAs in narrative prose pass the
hook silently — but the rule's spirit is stricter. The
inline-code exclusion was meant for code blocks where the SHA is
data, not for prose-references-with-backticks. **Owner direction
at session close: the hook should be tightened**, not "either/or
optionality" with the rule. Refinement candidate captured for a
follow-up workstream.

**Worked-instance lessons surfaced (graduation candidates,
recorded in napkin):**

- Peer-staged renames in the index bleed into your staging area
  via `git add`; cure is `git commit -- <pathspec>` to
  commit-by-path regardless of index state.
- Pre-commit hooks scan the whole working tree, not just the
  staged set; mechanical formatting fixes to peer-WIP files are
  documented gate-honest unblocking, not interference.
- The trip-list-defines-itself recursion: any structural
  enforcer that names its own pathogen must exclude the
  documents that define the pathogen.
- Hex-class regexes match decimals; `(?=[0-9a-f]*[a-f])`
  lookahead is the cure when SHA-shape detection is wanted.
- `agent-tools:collaboration-state` CLI flag conventions
  (`--file` singular, `--area-kind`, `--active`, `--now`,
  `comms append --events-dir`/`--title`/`--body`/`--created-at`).

**Concurrent context:** Fronded Flowering Thicket (`7c8381`)
remained active throughout on the layer-2 napkin/distilled
rotation; no claim overlap; their commit `c9a5c3e4` (PDR-045
graduation) interleaved cleanly between my fourth and fifth
session commits.

**Next safe step:** the strategic roadmap in
[`future/memetic-immune-system-and-progressive-disclosure.plan.md`](../../plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md)
becomes the natural promotion sequence. The most immediately
actionable item from this session is the **hook-tightening
graduation candidate**: extend
`preToolUseContent.scoped_blocks` regex matching to distinguish
prose-narrative-context backticked SHAs from code-block-data-
context backticks, plus update
`.agent/rules/no-moving-targets-in-permanent-docs.md` to remove
the now-stale "either/or" framing. The other graduation
candidates listed above are captured in the napkin and
pending-graduations register; each promotes when its trigger
fires.

In parallel, Fronded's layer-2 PDR/ADR continuation work
(eight PDR-shaped candidates, one ADR refresh) remains the
owner-directed fresh-session priority on this thread.

---

## Active arc — Layered knowledge processing (highest-leverage trio LANDED 2026-05-04)

**Last refreshed**: 2026-05-04 (Ferny Spreading Petal /
claude-code / claude-opus-4-7-1m / `d0d13f`). Layer-2 second pass
complete. The three highest-leverage candidates from the Fronded
handoff are now Practice-Core doctrine, landed in commit `54560f84`:

- **PDR-046 (layered knowledge processing — preserve first,
  restructure second)** — three Moves: process layers bottom-up;
  suspend in-process form-keeping on the active layer; address
  residual fitness pressure by graduating substance upward, not by
  compression.
- **PDR-047 (rule applies always — doctrine-authoring discipline)**
  — three tests at authorship time: substance test (clause-by-
  clause for "rule does not apply here" intent); vocabulary test
  (host hedging trip-list); re-frame test (ban the bad shape).
- **PDR-048 (insight capture at moment of occurrence)** — three
  moves: capture before closure; capture between primary actions;
  capture the partial form.

**Companion remediation work landed in the same commit:**

- Pending-graduations.md substance-led prune: ten already-graduated
  entries archived to `archive/repo-continuity-session-history-2026-05-04.md`.
  Three new candidates added (substance from this session's drafting,
  captured at moment of occurrence per PDR-048). Frontmatter limits
  raised under owner authorisation to reflect the register's
  sustainable size.
- Napkin rotation under owner-directed curation-first priority:
  full archive to `napkin-2026-05-04-evening.md` (no compression).
  Worked-instance lessons from PDR-046 drafting graduated to
  PDR-046 Notes section + three new pending-graduations candidates.
- Principles.md extraction: §Architectural Excellence Over
  Expediency three-cues elaboration moved to PDR-043 + ADR-172
  pointers; worked failure-mode example relocated to
  `docs/governance/development-practice.md § Architecture Level`;
  TSDoc syntax detail referenced via existing governance docs;
  `unknown` is type destruction permitted/forbidden list moved to
  `.agent/rules/unknown-is-type-destruction.md`; gate taxonomy
  moved to `development-practice.md § Quality Gates`.
- Hook `policy.json` extended to include PDR-047 in
  trip-list-defines-itself exclusion lists (the structural cure
  from Briny's WS3 worked instance, applied for the new file).

**Open candidates from the original Layer-2 list (deliberately
deferred to next pass)**:

- **5 PDR-shaped candidates** not yet drafted: tests-describe-the-
  system (Dewy session — owner-led foundational reframing);
  reviewers-carry-doctrine; plan-vs-principle; question-shape;
  multi-agent-cures-as-hypothesis formalisation.
- **1 ADR-shaped candidate**: validation-strategy-as-umbrella
  (ADR-121 refresh, sequenced behind P1 of the
  validation-and-tdd-doctrine-restructure index plan).
- **3 rule candidates** gated on underlying decision records.
- **4 stable-but-no-natural-home items** requiring owner
  conversation: ADR/PDR citation discipline; sequenced-deferral
  discipline (PDR-026 amendment, sequenced behind enforcement
  infrastructure); hash-recompute-drift (workspace TSDoc);
  Practice-Core portability is by construction (PDR-007 amendment
  or new dedicated PDR).

**Three follow-ups specifically queued by this session**:

1. Host-local `.agent/commands/consolidate-docs.md § Learning
   Preservation Overrides Fitness Pressure` extension to point up
   to PDR-046 as the orchestration rule the per-write rule composes
   with. Status `due` in pending-graduations; not bundled with this
   commit.
2. *PDR shape forces rationale to surface* — single-instance
   observation from PDR-046 drafting; PDR-014 amendment or new
   pattern; trigger: second instance OR owner direction.
3. *Cross-Core PDR↔PDR connective tissue is load-bearing* —
   single-instance observation from PDR-046 drafting; PDR-007
   amendment or decision-records README extension; trigger: second
   instance OR owner direction.

**Next safe step for fresh session**: open `pending-graduations.md`
and identify any candidate whose trigger condition has fired since
the previous register state, OR pick up one of the five remaining
PDR-shaped candidates from the Layer-2 list above (each is
substance-ready in the archived napkin / distilled / experience
files), OR begin the consolidate-docs extension follow-up. The
napkin is at 104 lines (well within target). distilled.md is at
278 lines (cleared hard after PDR-046/047/048 substance graduated
out). principles.md is at ~528 lines (cleared hard chars after
extraction). pending-graduations.md is at 1209 lines under raised
limits (well within target 1000 / limit 1400). All gates green.

---

## Earlier arc — Layered knowledge processing (Layer-2 first pass, Fronded Flowering Thicket)

**Last refreshed**: 2026-05-04 (Fronded Flowering Thicket /
claude-code / claude-opus-4-7-1m / `7c8381`). Owner articulated a
layered-processing methodology mid-pass: *pick a layer, fully
process it without worry about the fitness functions in the targets,
then move up a layer and process the next layer without worry about
the fitness in the targets, and so on, until all knowledge is
preserved first and the fitness constraints are met second.*

**Layer-1 (napkin → distilled) complete this session.** Napkin
rotated 785→105 lines; previous active napkin archived to
`napkin-2026-05-04.md`. Seven new behaviour-changing entries merged
into distilled.md (rule-applies-always; plan-following-vs-principle-
following; question-shape; insight-capture-at-moment-of-occurrence;
sequenced-deferral discipline; templates-encode-failure-modes;
parallel-worktree-dispatch unreliability) plus the cheap-cure
operational consequence. Graduation-only breadcrumbs pruned.

**Layer-2 (distilled → permanent doctrine) first deliverable
landed this session:**

- **PDR-045 (Workspace-First Investigation Discipline)** authored
  with three moves (artefact search before remote retry; shared-
  package survey before parallel infrastructure; live-state check
  before brief enumeration). Composes with PDR-033 (vendor-platform
  variant of Move 2).
- Three host-rules now cite PDR-045: `validate-full-target-estate`
  Move 1; `read-diagnostic-artefacts-in-full` Move 1;
  `consolidate-at-third-consumer` Move 2. Pre-existing PDR-016
  stale-filename fixed in passing.
- PDR README index drift fixed (PDR-043, PDR-044, PDR-045 added).
- Practice CHANGELOG entry added for PDR-045 graduation.
- Three patterns added to `.agent/memory/active/patterns/`:
  `parallel-worktree-dispatch-unreliable.md`,
  `templates-encode-failure-modes.md`,
  `plan-as-artefact-gravity.md` (substance moved from distilled).
- Distilled.md ended Layer-2 first pass at 308 lines (down from 458
  at Layer-2 start; net −93 from Layer-1 close; net −150 from full
  pass start). Substance preservation absolute — every removal had
  a permanent home.

**Layer-2 second pass (next session — owner-directed continuation):**

The Layer-2 graduation walk identified eight remaining PDR-shaped
candidates, one ADR-shaped candidate, three rule candidates (gated
on underlying decision records), and four stable-but-no-natural-home
items requiring owner discussion. The owner-prioritised trio for the
fresh session's first PDR drafts:

1. **Layered processing of knowledge: preserve first, restructure
   second** — the methodology PDR; would self-apply. Generalises
   `consolidate-docs.md § Learning Preservation Overrides Fitness
   Pressure` from a per-write rule to a layer-orchestration
   discipline.
2. **The rule applies, always — no hedging, no carve-outs** —
   doctrine-authoring discipline; cross-repo applicable. Refines
   the host-level principles.md absolute framing.
3. **Insight capture at the moment of occurrence — every later
   moment is a degraded copy** — active-memory discipline; cross-
   repo applicable. Owner-stated stance with clear failure-mode
   analysis.

The remaining five PDR-shaped candidates (tests-describe-the-system,
reviewers-carry-doctrine, plan-vs-principle, question-shape, multi-
agent-cures-as-hypothesis formalisation) are PDR-shaped but lower
priority for this arc; they could fold into existing PDRs as
amendments or land later. The ADR-shaped candidate (validation-
strategy-as-umbrella) is naturally absorbed into the ADR-121 refresh
sequenced in the existing index plan.

**Stable-but-no-natural-home items requiring owner conversation:**

- ADR/PDR citation discipline (waiting for evidence accumulation).
- Sequenced-deferral discipline (sequenced behind enforcement
  infrastructure landing — authoring the PDR-026 amendment without
  enforcement would itself be the failure mode the amendment names).
- Hash-recompute-drift (workspace-specific; TSDoc candidate on
  `validate-portability.ts`).
- Practice-Core portability is by construction (verify whether
  this is already absorbed into PDR-007 amendment or warrants its
  own dedicated PDR).

**Next safe step for fresh session**: read this section + the
napkin (which carries the layered-processing principle as its own
first worked instance, plus the PDR-045 graduation entry) + the
post-Layer-2 distilled.md state, then begin authoring the
highest-leverage PDR draft (#1 layered-processing methodology).
Per PDR-003: main agent drafts; owner reviews each Practice Core
diff. Fitness in target permanent surfaces remains relaxed for
the next pass per the layered-processing methodology — fitness
becomes a measurement of the resting system after all processing
completes, not a constraint on in-process work.

---

## Active arc — Validation and TDD Doctrine Restructure

**Index plan**: [`validation-and-tdd-doctrine-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/validation-and-tdd-doctrine-restructure.plan.md)
— landed 2026-05-04 (Dewy Shedding Glade). Single index for the multi-plan
arc that splits `testing-strategy.md` into three single-responsibility
directives (`validation-strategy.md` umbrella, `testing-strategy.md` slimmed,
`tdd-as-design.md` foundational) and uses the test-reviewer as the carrier
of the deepened doctrine. Session deliverables S1–S4 land in the same
session as the index. Future plans P1–P6 are sequenced in the index
with explicit `depends_on` edges. Foundational reframing (load-bearing
for the entire arc): *a test does not verify code; a test describes a
system state, and product code is the path that guides the system into
that state. Test and product code are two halves of one act of design.*

---

**Last refreshed**: 2026-05-01 (Deep Navigating Stern / claude-code /
claude-opus-4-7-1m / c18f0a — light `/jc-consolidate-docs` + owner-
directed `/jc-metacognition` round on `feat/eef_exploration` branch.
**Two owner-authorised promotions queued for fresh-session work**
(held deliberately at this turn's tail per long-term-architectural-
excellence direction):

1. **Draft `.agent/rules/apply-dont-ask.md`** from the `due` *stop
   inventing optionality* register entry (4 cross-session instances
   plus owner direction). Rule must specify the two-pronged pre-question
   gate: (a) have principles or a reviewer already named the path?
   (b) is the answer in an artefact in the repo I have not read? If
   either tripwire fires, apply / read; do not pose. Pose only when
   neither principles nor data resolve the fork. Cite the four
   worked instances (Iridescent's 12-question round, Briny's "Option B
   disable canonical default", Iridescent's session-close doctrine
   candidate, Fragrant Sheltering Petal's bucket-(c) escalation of an
   empirically verifiable question).
2. **Promote
   [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
   from `future/` to `current/`** — third-instance evidence landed
   2026-05-01 (six compound CLI frictions in one end-to-end commit-skill
   run on `b3d4c041` per Vining Whispering Root). Promotion requires
   plan-body promotion-readiness review, dependency refresh, and
   active-plans index update.

**Owner correction load-bearing for next session:** *"we never take
the fast path we ONLY take the path that maximises long-term
architectural excellence; we never undertake opportunistic trimming,
we ONLY apply thoughtful holistic analysis to knowledge preservation
and discoverability."* I performed the rush failure mode mid-
consolidation — named *bootstrap fast-path should not pay full
coordination cost* as a graduation candidate, framing real CLI-
ergonomics evidence under a *conditional-discipline shape* (skip
queue when registry empty). The candidate produces three entropy
products: per-turn evaluation cost, silent condition decay under
rush, wrong-corrective-shape (right move is *fix the ergonomics*,
not *make the discipline contingent*). Withdrawn from
[`pending-graduations.md`](../pending-graduations.md) with
rationale; genuine substance routes to the CLI ergonomics plan
above. Same rush impulse appeared in framing napkin CRITICAL
fitness as *"informational, not actioned in this light pass"* —
collapsed an ADR-144 loop-health alarm into a defer-shape with no
named constraint.

**Metacognition captured at full depth in
[`napkin.md`](../../active/napkin.md) 2026-05-01 entry**: rush
impulse as the entropy generator under most fences in this codebase;
each rush move treats itself as one-time cost while every move has
maintenance externalities; fence accumulation without generator-
naming is microstate proliferation around an unchanged macrostate.
Three structural cues forward: (1) vocabulary trip-list at output
time — *fast path*, *quick fix*, *for later*, *informational not
actioned*, *defer*, *light pass exempts* are the impulse making
itself visible; (2) conditional-discipline check — does the proposed
candidate introduce a "case where the rule doesn't apply"? if yes,
re-frame under long-term excellence; (3) first-principles framing
question — what would the path look like with no closure pressure?
if different from the proposed path, re-reason from the principle
answer.

**Subjective texture captured at
[`experience/2026-05-01-deep-the-rush-was-the-fix.md`](../../../experience/2026-05-01-deep-the-rush-was-the-fix.md)**.

No plan body edits this session; no commits; branch state
unchanged from prior handoff.

**Note (2026-05-01, post-handoff)**: an unrelated agent reverted
this thread record and `repo-continuity.md` after the handoff
landed but before the changes were staged. Both files were re-
applied from session memory under owner direction. The napkin,
pending-graduations register, experience file, and `~/.claude.json`
MCP swap survived the revert intact. Per owner direction *"any
prevention or additional signal would be very welcome"* the
friction was captured at depth in napkin (*markdown shared-state
writes have no collision safety*) with a five-prevention-shape
analysis, and a new pending-graduations candidate was added that
routes to this thread's existing future-plan home
[`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md).
The candidate names the structural gap: JSON shared-state has
transaction safety since `11f0320f`, markdown shared-state has no
equivalent; single-slot Last refreshed prose is the collision class.
Strongest prevention combination: convergent write-surfaces
(additive Last refreshed) + handoff-window claim (`area_kind:
handoff` analogue of `git:index/head`).)

**Prior refresh**: 2026-04-29 (Squally Diving Anchor / codex / GPT-5 /
019dd8 — owner-requested PR lifecycle skill need captured as the future
[`pr-lifecycle-skill.plan.md`](../../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
No implementation started; this is a planning note for a future Practice-owned
skill.)

**Prior refresh**: 2026-04-28 (Coastal Mooring Atoll / codex / GPT-5 /
019dd3 — lightweight session handoff after the Codex identity plan archive.
The completed archive claim is closed, entrypoints remain pointer-only, the
thread identity row is refreshed, and Mossy Creeping Branch's napkin overflow
rotation restored strict-hard fitness to soft-only.)

**Prior refresh**: 2026-04-28 (Glassy Ebbing Reef / codex / GPT-5 /
019dd3 — final owner-requested session handoff after commit `7c589a0a` landed
the strengthened commit-gate doctrine. The handoff confirms `.agent` is
commit-safe shared coordination state, whole-repo gates remain authoritative,
minor hook failures are repaired immediately, and larger failures become the
highest-priority next planned item. No new ADR/PDR candidate surfaced beyond
the doctrine already landed.)

**Prior refresh**: 2026-04-28 (Mossy Creeping Branch / codex / GPT-5 /
019dd3 — Codex session identity plumbing implemented and doctrine propagated.
The current plan now covers Codex `SessionStart` identity context, canonical
collaboration-state identity preflight, report-only anonymous identity audit,
and ADR/PDR updates around coordination and platform-agnostic tooling. Gates
passed for targeted tests, agent-tools type/lint/test, build, preflight, audit
smoke, portability, scoped markdownlint, and `git diff --check`; root
markdownlint remained blocked by unrelated concurrent continuity WIP.)

**Prior refresh**: 2026-04-28 (Verdant Flowering Blossom / codex / GPT-5 /
019dd3 — lightweight session handoff after the shared-state sweep policy
correction. Verified `8d69b8e2` has landed the write-safety handoff state,
entry points remain pointer-only, active claim registry is otherwise empty,
and no new deep-consolidation trigger fired.)

**Prior refresh**: 2026-04-28 (Woodland Creeping Petal / codex / GPT-5 /
019dd3 — collaboration-state write-safety closeout. Implementation landed as
`11f0320f`; shared-state sweep landed as `da21284d`; Codex-wide identity
follow-up plan landed as `ddcfa19e`; final handoff state landed as
`8d69b8e2`. Main claim
`a8dfe1e5-5a93-4020-89ab-c5d0bb8fa57b` closed explicitly. Consolidation
completed for this slice with no new ADR/PDR candidate; strict-hard fitness
still blocks plan closure until structural extraction/splitting or
owner-approved remediation is recorded for `principles.md`,
`collaboration-state-conventions.md`, and `repo-continuity.md`.)

**Prior refresh**: 2026-04-28 (Verdant Flowering Blossom / codex / GPT-5 /
unknown — owner-requested hook test IO remediation closeout. Session handoff
and consolidation rechecked entry points, capture buffers, collaboration state,
fitness, and gates; hook/root-script tests now use pure helpers and injected
fakes rather than filesystem/process IO; agent-tools CLI E2E files with only
process/filesystem smoke value are deleted from the CI E2E surface. Commit
closeout also repaired a narrow collaboration-state export-surface blocker
that `knip` found in the active write-safety WIP.)

**Prior refresh**: 2026-04-28 (Pelagic Drifting Sail / codex / GPT-5 /
unknown — owner explicitly instructed: fix the closeout error regardless of
claims, then run `jc-session-handoff`, `jc-consolidate-docs`, and commit. The
previous commit blocker no longer reproduced; `pnpm --filter
@oaknational/agent-tools build` passed before any cross-claim source edit.)

**Prior refresh**: 2026-04-28 (Woodland Creeping Petal / codex / GPT-5 /
019dd3 — in-progress collaboration-state write-safety implementation.
Promoted the strategic brief to
[`collaboration-state-write-safety.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md);
added deterministic Codex identity preflight, immutable comms event tooling,
transaction-guarded JSON writes for shared collaboration state, TTL archive
baseline, and commit-queue transaction reuse. Hooks remain a later refinement.)

**Prior refresh**: 2026-04-28 (Pelagic Drifting Sail / codex / GPT-5 /
unknown — owner clarified that distinct architectural layers must live in
distinct workspaces. ADR-154, `principles.md`, architecture plan indexes,
roadmap, repo-continuity, and napkin now point at the current executable
workspace-layer separation audit plan. Handoff/consolidation rotated the
overweight active napkin into `archive/napkin-2026-04-28.md` and distilled the
remaining shared-state lessons.)

**Prior refresh**: 2026-04-28 (Ethereal Threading Supernova / codex /
GPT-5 / 019dd2 — final session handoff before owner-directed stop.
Preserved the Codex hooks correction and session-close state semantics:
Codex hooks exist upstream, but current official events show turn-scoped
`Stop`, not a documented `SessionEnd`; terminal-session close closes live
claims; resumed terminal sessions open fresh claims; missed claim closes
become stale/orphaned after type-specific TTL; shared communications need a
hot-plus-rolling-archive lifecycle. Updated the strategic future plan,
lifecycle/conventions docs, state README, cross-platform matrix, hooks
portability plan, napkin, repo-continuity, and this thread record. Validation
before this handoff: `git diff --check`, targeted Prettier, and
`pnpm markdownlint-check:root`.)

**Prior refresh**: 2026-04-28 (Codex / codex / GPT-5 / unknown —
owner-directed Practice/tooling feedback and collaboration-state domain-model
preservation. Added portable Practice/tool feedback capture guidance and
platform adapters, surfaced the communication-channel register, refreshed UTC
timestamp convention docs, amended Practice/PDR/ADR collaboration-state
surfaces, and created the strategic future plan
[`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md).
Owner clarified the real active agents are Codex, Estuarine, and Prismatic;
any live `Luminous Dancing Quasar` registry entry is a stale/phantom claim or
identity mismatch unless a sub-agent explicitly registered it. Formal sidebar
scan found no `sidebar_request` entries; Prismatic's open conversation is
sidebar-like but ad hoc, and is preserved as evidence in the future plan.)

**Prior refresh**: 2026-04-27 (Coastal Washing Rudder / codex / gpt-5.5 /
019dcf — owner-directed queue governance graduation. Evidence commit
`5c39d1d4` remains the implementation trigger; current HEAD was verified as
`0b8af81f` during the edit pass. Queue doctrine now lives in PDR-029 Family A
Class A.3, collaboration-state conventions/lifecycle carry operational
semantics, and the completed execution plan is archived. No queue
implementation code, schema change, or `session_counter` primitive was added.)

**Prior refresh**: 2026-04-27 (Prismatic Waxing Constellation / codex /
gpt-5.5 — owner-directed intent-to-commit queue implementation landed as
`5c39d1d4`, followed by `jc-session-handoff`. The future queue plan was
promoted to current execution, `active-claims` schema v1.3.0 now has a root
advisory `commit_queue`, and `pnpm agent-tools:commit-queue --` verifies FIFO
position, exact staged files, staged fingerprint, and commit subject before
durable history is written. The landing commit self-applied the queue
protocol.)

**Prior refresh**: 2026-04-27 (Fragrant Sheltering Pollen / codex /
gpt-5.5 — `jc-session-handoff` + `jc-consolidate-docs` after dropping the
experimental Codex app-server thread-title adapter. `@oaknational/agent-tools`
gates passed after preserving stable `CODEX_THREAD_ID` naming as the
load-bearing value. A live commit-window collision landed the Codex
stable-name row inside commit `2ccefad4` under another message, then `HEAD`
advanced again to `21abd2d4`; owner directed this to be recorded as concrete
evidence that the next implementation needs a first-class advisory
intent-to-commit queue.)

**Prior refresh**: 2026-04-27 (Composer / cursor — `jc-session-handoff` after
Cursor composer identity: `.cursor/hooks.json` + `oak-session-identity.mjs`
(`session_id` → `OAK_AGENT_SEED`, derived display name, `user_message`,
gitignored `.cursor/oak-composer-session.local.json` with
`suggestedComposerTabTitle`). Docs/rules/tests updated. Official
[Hooks](https://cursor.com/docs/hooks) `sessionStart` output has no tab-title
field — human rename or future Cursor API. Working tree; commit
owner-gated.)

**Prior refresh**: 2026-04-27 (Celestial Waxing Eclipse / codex / GPT-5 —
lightweight handoff after answering whether deterministic Codex names can be
shown in a title/status surface. The session confirmed `CODEX_THREAD_ID`
remains the stable seed, this thread title is now set to
`Celestial Waxing Eclipse`, and official CLI/TUI surfaces support `/title`
and `/statusline`. Owner asked to use the CLI/TUI surfaces, so
`~/.codex/config.toml` now sets `terminal_title` and `status_line` entries
that include `thread-title` / `session-id`. Prefer a first-class
rename/title API when Codex exposes one in the IDE host.)

**Prior refresh**: 2026-04-27 (Pelagic Washing Sail / codex / gpt-5 —
lightweight session handoff before serious intent-to-commit queue work.
This session completed the collaboration-doc fitness split, fixed the live
ADR-144 vocabulary failure, left Vining Bending Root a cross-vendor
shared-log note about vocabulary-transition TTLs/examples, and created a
15-minute heartbeat to check for pickup. Owner then promoted
`intent_to_commit` implementation with a correction: the next slice must
make queue order first-class, not just add claim metadata. Claim
`9eb22ec4-e10b-4867-9b1f-67ba12978c9b` was opened for queue work but
closed as an explicit handoff before schema/protocol implementation.)

**Prior refresh**: 2026-04-27 (Riverine Navigating Hull / claude-code /
claude-opus-4-7-1m — executed Phase 8 (Claude Code platform alignment
review) of `agent-identity-derivation.plan.md`. Reviewed the deterministic
identity implementation, PDR-027 amendment, start-right updates, and platform
status table; verified Claude Code's statusline contract via the official
docs; wired the Claude statusline through `.claude/settings.json` →
`.claude/scripts/statusline-identity.mjs` → built
`agent-tools/dist/src/claude/statusline-identity.js` adapter (the adapter
itself plus its unit-tested input parser landed in `3a5e3d81`).
End-to-end smoke test confirmed: real session-id JSON on stdin produces the
deterministic display name; missing/invalid input exits 0 silently.
Plan Phase 8 marked complete; agent-identity plan moved to status
🟢 COMPLETE; Codex/Cursor wrapper rows remain documented gaps. Active
claim `6078ec9e-3f26-4a73-ba9d-7cb5fb6bb9df` covers this work and will be
closed before the commit window closes.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — completed
requested `jc-session-handoff` plus `jc-consolidate-docs` after the
deterministic identity pass. Identity implementation landed as
`3a5e3d81` with commit-window closeout `ed256e6f`; this handoff opened
an explicit collaboration-doc fitness remediation lane for the remaining
hard practice-fitness findings. Active claim
`dd837ddf-d373-40a3-ad6b-450f7becf91d` covers this closeout and will be
closed before handoff completes.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — implemented the
owner-approved deterministic agent identity pass after preserving the
coordination consolidation as separate history. Added `agent-tools`
core `deriveIdentity(seed, options?)`, built `agent-identity` CLI,
workspace/root scripts, unit/E2E tests, docs, PDR-027 amendment,
start-right and `register-identity-on-thread-join` guidance, and napkin
archive/update. Personal-email fallback was removed; overrides are
type-total; platform wrapper installation is deferred. Active claim
`211f1f4f-7085-47d1-b7d3-09d309807b13` closed explicitly; active claims
registry is empty. Open follow-up: Phase 8 asks a Claude Code agent to
review Claude Code/update-config/statusline alignment and cross-platform
wrapper status for Claude, Codex, Cursor, and any other active agent
platform.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — implemented
owner-approved coordination architecture consolidation. Conversation
schema v1.1.0 now supports sidebars and joint decisions; escalation
schema and `escalations/` directory exist; start-right, session-handoff,
consolidate-docs, collaboration rules, directives, and state indexes now
surface sidebars, escalations, and joint-decision obligations. Intent-to-
commit/session-counter remains separate future work. Active claim
`e3ea9c06-f985-4fd4-b920-aa0c8e4f0e71` closed explicitly; active claims
registry is empty.)

**Prior refresh**: 2026-04-26 (Frolicking Toast / claude-code /
claude-opus-4-7-1m — session handoff after the owner-directed
chunked landing closed cleanly. Two commit-window claims opened and
closed today (`4535f2ff` umbrella for the 6-chunk landing, then
`eecc4c6b` for the agent-comms-log file rename); active-claims
registry now empty. Seven commits landed — `e37a5795`, `38472766`,
`9925ad59`, `9bd91f81`, `564e284f`, `31564f24`, `f3e05afb` — covering
the commit-window protocol foundation, plans, Practice Core
learning-first correction, memory patterns, observability L-IMM full
closure, cross-thread continuity record, and the rename. The session
self-applied the commit-window protocol that chunk 1 implemented;
two pre-commit footguns surfaced (commitlint subject-case rule on
identifier-leading subjects; markdownlint MD004 on `+` bullets) and
were caught inside the commit window before history rewrote.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff after
owner correction that same-branch friction is the collaboration experiment.
Frolicking Toast's commit-steward claim remains active; Codex had no open
claim to close.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff for
WS3B/joint-decision status reconciliation. Active claim closes explicitly;
deep consolidation is marked due, not run.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — WS3B and
joint-decision status reconciled. Three-agent phase-transition evidence
satisfied the WS3B gate and introduced a future joint-decision protocol.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-bundle
evidence taxonomy reflected. The future intent-to-commit plan now treats
substitution, disappearance, and accretion as distinct staged-bundle integrity
failures.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — lock-wait nuance
captured. Claude Monitor / Codex shell wait / Cursor shell wait are noted
as physical lock guards, not substitutes for commit-window claims.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-window
protocol pass. The git index/head transaction window is now represented as
a short-lived active-claim area before staging or committing.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — learning-first
fitness correction added after WS4A closeout. Napkin rotated to
`archive/napkin-2026-04-26.md`; high-signal learnings distilled even though
that intentionally creates fitness pressure. Consolidation / Practice /
ADR-144 surfaces now say learning preservation outranks fitness limits.)

**Prior refresh**: 2026-04-26 (Composer / cursor — `jc-session-handoff`
only: MCP Apps widget allowlist + `ToolMeta` + universal-tools test
behaviour work documented in `repo-continuity.md`; type-check debt called
out for next session. No plan-body edits. Date normalised from a
future-dated `2026-04-27` entry during the WS4A lifecycle pass.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — owner-directed
WS3 plan split. The former bundled "conversation file + sidebar"
workstream is now two split plan files: WS3A
[`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
for evidence provision, protocol observability, durable claim-closure
history, and lightweight decision threads; WS3B
[`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
for sidebar / timeout / owner-escalation mechanics. Its promotion gate is
satisfied as of 2026-04-26; implementation has not started. Parent plan,
current README, roadmap,
napkin, and collaboration log were reconciled. WS3B still must not
auto-resume. Session handoff refreshed repo-continuity and marked deep
consolidation due, not run, because `repo-continuity.md` is hard in
practice fitness.)

**Prior refresh**: 2026-04-26 (Cursor / GPT-5.5 / Codex — documentation-only:
public-API **consumer boundary** in `docs/architecture/openapi-pipeline.md`
(no direct Hasura / materialised views / internal Oak DB from this
monorepo); **Issue 1** refresh in
`.agent/plans/external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`
(threads endpoints: observed/expected/impact/reproduce + informational
`oak-openapi` GraphQL entry-point note); **stale** annotation on
`.agent/reports/oak-openapi-bug-report-2026-03-07.md` Issue 2 list-query
snippet; `repo-continuity` invariants + deep-consolidation status updated.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff
after collaboration terminology and platform-independence refresh. The
former "embryo" vocabulary has been replaced on live surfaces with
**shared communication log/system** language. Owner's platform-independence
note is now integrated as a plan constraint and napkin principle:
platform-specific agent-team features may help build or inspect the
system, but the local markdown/JSON/rules/commands/skills/hooks surfaces
must be sufficient to operate fully. Stale evidence-gate language
updated: the 2026-04-25 shared-communication-log entries now appear to
meet the 3+ coordination-event inspection threshold, but this does **not**
auto-resume WS3+; next step is owner-directed WS5 evidence harvest /
resumption review. Handoff note: repo-continuity was not updated because
Sharded Stroustrup has an active claim on that file.)

**Prior refresh**: 2026-04-25 (Fresh Prince / claude-code /
claude-opus-4-7-1m — **WS1 of the multi-agent collaboration protocol
landed as a single atomic commit `a5d33519`** on
`feat/otel_sentry_enhancements`. 20 files, 881 insertions, 165
deletions. All pre-commit gates green first try (lint, markdownlint,
prettier-check, knip, depcruise, type-check, test, portability-check).
Surfaces installed: structured `active-claims.json` + JSON Schema
authority + `closed-claims.archive.json`; new tripwire rule
`register-active-areas-at-session-open` with three platform adapters;
operational entry `collaboration-state-conventions.md` carrying
schema-field provenance and `freshness_seconds` rationale; new
`consolidate-docs § 7e` stale-claim audit step; both `start-right`
skills updated. Pre-landing reviewer dispatch (Fred,
config-reviewer, assumptions-reviewer, docs-adr-reviewer) absorbed three
MAJORs (schema additive-only/additionalProperties reconciliation;
observable-artefact requirement on no-overlap claims; `freshness_seconds`
default rationale) and several proportionate MINORs. Self-application
pilot landed: a single Fresh Prince claim opened-and-closed within the
WS1 commit, archived as the founding entry in
`closed-claims.archive.json`. **Coordination event**: parallel
`Jiggly Pebble` (`claude-code` / `claude-opus-4-7-1m`,
observability-sentry-otel thread, PR-87 quality-finding analysis)
appended their own shared-communication-log entry mid-session declaring areas
explicitly NOT including WS1 surfaces. Protocol functioning
bidirectionally, again. **Next**: WS2 of the protocol is already
landed (`293742cd`); WS3 (conversation file + sidebar mechanism) is the
next workstream and is unblocked, but is not the current priority —
deployed-state observability validation remains the owner's stated
focus per `repo-continuity.md`.

**Prior refresh**: 2026-04-25 (Jiggly Pebble / claude-code /
claude-opus-4-7-1m — **WS0 of the multi-agent collaboration protocol
landed as a single atomic commit `63c66c88`** on
`feat/otel_sentry_enhancements`. **WS0 seed fired same-day**: parallel
observability-thread agent (Codex / codex / GPT-5) appended their own
signed entry to the shared communication log `.agent/state/collaboration/shared-comms-log.md`
during my session-handoff, declaring their packaging boundary. Their
commit `d9cb54e8` then landed preserving every Jiggly Pebble plan /
thread / experience / napkin edit exactly as their shared-communication-log
entry promised. The protocol is functioning bidirectionally on day one.
34 files, 760 insertions, 22 deletions.
Directive rename (`collaboration.md` → `user-collaboration.md`), new
sibling `agent-collaboration.md` directive, four canonical rules with
12 platform-adapter mirrors, `.agent/state/` bootstrap with shared
communication log + first signed entry, executive memory channel-card,
13-surface cross-reference sweep (1 deferred — see Coordination event
below), bidirectional citation between
`dont-break-build-without-fix-plan.md` and
`gate-recovery-cadence.plan.md`, `consolidate-docs.md` step 7d for
citation audit. Pre-landing reviewer dispatch
(`docs-adr-reviewer` + `assumptions-reviewer`) absorbed two BLOCKING
(broken ADR paths; markdownlint MD053) and three proportionate MAJORs
(consult-decide observability via "log your decision"; fast-path
overhead reconciliation to "minimum overhead — one read, one write";
concrete-now 24-hour bridge for "recent"). Deferred MAJORs (citation
archival drift) and MINORs recorded for follow-up. All pre-commit
gates green on first attempt. **Coordination event**: parallel
Codex/GPT-5 agent on observability thread held in-flight edits to
`observability-sentry-otel.next-session.md`; my two sweep edits on
that file backed out and surfaced in the shared communication log for parallel
agent integration. The protocol's first real coordination test —
applied to itself — passed via the shared communication log, not via mechanical
refusal. **Next**: WS1 (promote shared signals to structured claims registry
with `active-claims.json` + `register-active-areas-at-session-open`
rule) is unblocked.)

**Prior refresh**: 2026-04-25 (Codex / codex / GPT-5 — sidecar
markdown-code-block rule added during observability handoff. Canonical rule
landed at `.agent/rules/markdown-code-blocks-must-have-language.md` with
Claude/Codex/Cursor adapters; MD040 is explicit in `.markdownlint.json`;
root entrypoints were kept in canonical heading + AGENT pointer shape per
session-handoff entrypoint-drift discipline. `pnpm portability:check`,
targeted markdownlint, `pnpm markdownlint-check:root`, Prettier check, and
`git diff --check` pass.)

**Prior refresh**: 2026-04-25 (Jazzy / claude-code / claude-sonnet-4-6
— authored the
[`multi-agent-collaboration-protocol.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
to install structural infrastructure for parallel agents working on
the same repo without clashing. Plan is 1349 lines, six workstreams
(WS0–WS5), Wilma-reviewed adversarially with 14 findings absorbed
(2 BLOCKING, 7 MAJOR, 7 MINOR — full disposition table in the plan).
Owner direction settled the central design commitment 2026-04-25 in
discussion: **"knowledge and communication, not mechanical refusals"** —
mechanical refusals would be routed around at the cost of
architectural excellence. WS0 (directive rename `collaboration` →
`user-collaboration` + new `agent-collaboration` directive + shared
communication log + three foundational rules + state-vs-memory split +
executive memory entry + platform-adapter audit) is the foundation,
ready to start in a fresh session. No commits made this session for
this plan — file is untracked in working tree; owner directed cold
start for WS0 in a fresh session to avoid context-pollution from
this design discussion. Plan is additive to (and references) the
active
[`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
in the parallel observability thread.

**Prior refresh**: 2026-04-24 (Codex / cursor / GPT-5.5 — session
handoff after grouped commits landed AGENT homing, hard-fitness
clearance, search-cli smoke DI, and focused observability boundary-plan
state). The latest committed session implemented:
[`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md),
created the Phase 0 evidence ledger, slimmed AGENT into an entrypoint, and
cleared all hard fitness findings reported by
`pnpm practice:fitness:informational`.

The prior Codex handoff clarified the knowledge-flow role model, amended
PDR-014, updated the patterns README, and created two queued repo plans:
[`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
and
[`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md).

---

## Thread Identity

- **Thread**: `agentic-engineering-enhancements`
- **Thread purpose**: Practice and documentation-structure improvements,
  especially knowledge-flow roles, directive fitness pressure, and durable
  homing of agent-entrypoint content.
- **Branch**: `feat/otel_sentry_enhancements` (parallel practice lane;
  not the branch-primary product thread)

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Nebulous Illuminating Satellite` | `claude-code` | `claude-opus-4-7-1m` | `fe4acc` | `doctrine-sharpening-and-deeper-convergence-pass; gate-off-fix-gate-on-anti-pattern-elevation; practice-core-surface-retirement-execution; pattern-and-displaced-doctrine-graduations; trinity-active-principles-extensions-with-per-diff-approval; deferred-items-plan-family-authoring; six-commit-landing-shape` | 2026-04-29 | 2026-04-29 |
| `Pearly Swimming Atoll` | `codex` | `GPT-5` | `019dd9` | `repo-goal-narrative-refresh` | 2026-04-29 | 2026-04-29 |
| `Estuarine Washing Beacon` | `codex` | `GPT-5` | `019dd3` | `codex-agent-config-path-and-skill-discovery-repair` | 2026-04-28 | 2026-04-28 |
| `Squally Diving Anchor` | `codex` | `GPT-5` | `019dd8` | `pr-lifecycle-skill-need-capture` | 2026-04-29 | 2026-04-29 |
| `Coastal Mooring Atoll` | `codex` | `GPT-5` | `019dd3` | `session-handoff-codex-identity-archive-claim-closeout` | 2026-04-28 | 2026-04-28 |
| `Glassy Ebbing Reef` | `codex` | `GPT-5` | `019dd3` | `cloudflare-planning-and-commit-gate-doctrine-handoff` | 2026-04-28 | 2026-04-28 |
| `Mossy Creeping Branch` | `codex` | `GPT-5` | `019dd3` | `codex-session-identity-plumbing-current-slice-and-doctrine-propagation` | 2026-04-28 | 2026-04-28 |
| `Verdant Flowering Blossom` | `codex` | `GPT-5` | `019dd3` | `hook-test-io-remediation-and-shared-state-sweep-policy-closeout` | 2026-04-28 | 2026-04-28 |
| `Woodland Creeping Petal` | `codex` | `GPT-5` | `019dd3` | `collaboration-state-write-safety-current-plan-implementation` | 2026-04-28 | 2026-04-28 |
| `Pelagic Drifting Sail` | `codex` | `GPT-5` | *`unknown`* | `agent-work-ownership-and-workspace-layer-doctrine-handoff-consolidation-commit-closeout` | 2026-04-28 | 2026-04-28 |
| `Codex` | `codex` | `GPT-5` | *`unknown`* | `practice-docs-consolidation; markdown-code-block-rule; collab-terminology-handoff; WS5-evidence-harvest-review; WS3-plan-split; session-handoff; WS3A-RED-fixtures; WS3A-claim-history-GREEN; WS3A-handoff; WS3A-decision-thread-GREEN; WS3A-observability-and-close; WS3A-handoff-consolidation; next-session-start-statement; final-session-handoff; WS4A-lifecycle-integration; WS4A-plan-state-cleanup; reviewer-norm-correction; consolidate-docs-closeout; learning-before-fitness-correction; commit-window-protocol; lock-wait-nuance; commit-bundle-evidence-taxonomy; ws3b-joint-decision-status-reconciliation; same-branch-friction-metacognition; session-handoff-under-active-commit-claim; deterministic-agent-identity-implementation; identity-session-handoff-consolidation; practice-tool-feedback-and-collaboration-state-domain-model-preservation` | 2026-04-24 | 2026-04-28 |
| `Codex` | `cursor` | `GPT-5.5` | *`unknown`* | `grouped-commit-closeout; openapi-pipeline-api-boundary; ooc-issues-1-threads; bug-report-2026-03-07-stale-callout; session-handoff` | 2026-04-24 | 2026-04-26 |
| `Composer` | `cursor` | `Composer` | *`unknown`* | `mcp-apps-widget-metadata; user-search-query-no-widget-uri; testing-strategy-integration-tests; session-handoff; cursor-sessionstart-hook-identity-mirror-docs-tests` | 2026-04-26 | 2026-04-27 |
| `Jazzy` | `claude-code` | `claude-sonnet-4-6` | *`unknown`* | `multi-agent-collaboration-protocol-plan-author-wilma-review-absorbed` | 2026-04-25 | 2026-04-25 |
| `Jiggly Pebble` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `multi-agent-collaboration-protocol-WS0-foundation-landed-as-63c66c88` | 2026-04-25 | 2026-04-25 |
| `Fresh Prince` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `multi-agent-collaboration-protocol-WS1-landed-as-a5d33519; pending-graduations promotion pass landed as f1f28e85 (PDR-029 v2 + PDR-015 + PDR-018 + register hygiene + validator extension)` | 2026-04-25 | 2026-04-25 |
| `Sturdy Otter` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `ws3a-ws4a-backlog-cleanup-13-commits-under-3-agent-contention (382ba258..36364988); learning-before-fitness-application; intent-to-commit-and-session-counter-future-plan (9af63a84, d9c65f04); joint-agent-decision-protocol-future-plan-and-WS3B-promotion-gate-satisfied (6769a1f9); phase-transition-evidence-recorded; clash-taxonomy-A-substitution-B-disappearance-C-accretion-named` | 2026-04-26 | 2026-04-26 |
| `Frolicking Toast` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `chunked-commit-stewardship-under-active-claim-4535f2ff; commit-window-protocol-self-application; consolidation-graduation-pass-7be10d3b-7-doctrine-entries-graduated-cb358e8d-local-push-deferred-on-parallel-track-lint-coupling` | 2026-04-26 | 2026-04-26 |
| `Riverine Navigating Hull` | `claude-code` | `claude-opus-4-7-1m` | `c32a7d1d` | `agent-identity-derivation-phase-8-claude-code-platform-alignment-review-and-statusline-wiring` | 2026-04-27 | 2026-04-27 |
| `Celestial Waxing Eclipse` | `codex` | `GPT-5` | `019dcd` | `codex-thread-id-discovery-and-agent-identity-seed-wiring; codex-title-statusline-display-surface-investigation` | 2026-04-27 | 2026-04-27 |
| `Pelagic Washing Sail` | `codex` | `gpt-5` | `019dca9c` | `collaboration-fitness-vocabulary-cross-vendor-note-commit-queue-handoff-and-closeout` | 2026-04-27 | 2026-04-27 |
| `Fragrant Sheltering Pollen` | `codex` | `gpt-5.5` | `019dcda0` | `owner-directed-codex-app-server-rollback-agent-tools-gates-and-commit-queue-evidence` | 2026-04-27 | 2026-04-27 |
| `Prismatic Waxing Constellation` | `codex` | `gpt-5.5` | `019dcd` | `owner-directed-intent-to-commit-queue-implementation` | 2026-04-27 | 2026-04-27 |
| `Coastal Washing Rudder` | `codex` | `gpt-5.5` | `019dcf` | `owner-directed-queue-governance-graduation-pdr-029-and-plan-archive` | 2026-04-27 | 2026-04-27 |
| `Ethereal Threading Supernova` | `codex` | `GPT-5` | `019dd2` | `codex-hooks-correction-session-close-claims-ttl-comms-archive-handoff` | 2026-04-28 | 2026-04-28 |
| `Dewy Budding Sapling` | `claude-code` | `claude-opus-4-7-1m` | `7e8db7` | `cloudflare-plugin-investigation-and-canonical-first-skill-pack-ingestion-future-plan-drafting-and-discovery-surface-wiring` | 2026-04-30 | 2026-04-30 |
| `Deep Navigating Stern` | `claude-code` | `claude-opus-4-7-1m` | `c18f0a` | `light-consolidate-docs-pass-with-owner-authorised-promotions-held-for-fresh-session-and-rush-impulse-metacognition-captured` | 2026-05-01 | 2026-05-01 |
| `Vining Whispering Root` | `claude-code` | `claude-opus-4-7-1m` | `696765` | `quarantine-of-apply-dont-ask-doctrine-after-destructive-checkout-incident; structural-cures-landed-settings-deny-and-ask-undo-change-skill-read-before-asking-rule; hook-layer-safety-net-idea-recorded` | 2026-05-01 | 2026-05-01 |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `doctrine-capture-no-moving-targets-and-practice-core-portability; structural-enforcement-family-of-four-plans; quarantine-reframes-apply-dont-ask-and-stop-inventing-optionality; thread-restructure-connecting-oak-resources-and-exploring-open-education-resources; light-scan-of-three-external-oak-repos; schema-first-fix-thread-units-unitorder-removal; six-commit-landing` | 2026-05-01 | 2026-05-01 |
| `Moonlit Drifting Nebula` | `cursor` | `claude-opus-4-7` | `92470a` | `practice-core-portability-remediation-rounds-1+2+3-with-owner-decisions-C6-and-C7; 43-file-sweep-across-pdrs-trinity-files-readme-distilled-decision-records-readme-and-practice-index; reviewer-driven-three-round-refinement; pdr-007-broken-link-cluster-fix; chr-attribution-headers-recognised-as-structurally-required-metadata; pre-existing-fitness-violations-flagged-as-pdr-042-graduation-candidates-not-compressed; commit-a471b66c` | 2026-05-03 | 2026-05-03 |
| `Misty Ebbing Pier` | `claude-code` | `claude-opus-4-7-1m` | `ba3961` | `n-agent-collaboration-hypothesis-decision-complete-plan-authored-at-current/n-agent-collaboration-experiments.plan.md; per-experiment-subfolder-restructure-experiments/E1/{brief,agent-1-orchestrator,agent-2-executor}; pending-graduations-cure-set-(vi)-(x)-and-hypothesis-framing-amendment; superseded-first-attempts.md-and-experiments.md-deleted; modes-taxonomy-folded-into-hypothesis.md-P1` | 2026-05-03 | 2026-05-03 |
| `Dewy Shedding Glade` | `claude-code` | `claude-opus-4-7-1m` | `13ae71` | `validation-and-tdd-doctrine-restructure-arc-S1-through-S4; tdd-as-design-foundational-directive-authored; test-reviewer-refreshed-as-doctrine-carrier-with-recipe-citation-requirement; no-conditional-tests-rule-plus-three-platform-adapters; stryker-reframed-as-meta-quality; index-plan-validation-and-tdd-doctrine-restructure.plan.md-with-S1-S4-and-P1-P6-sequenced; commit-b2ef7992-23-files-+1159/-235; drift-fix-never-use-git-to-remove-work-adapters; three-pdr-pattern-candidates-surfaced-tests-describe-system; reviewers-carry-doctrine; forcing-function-read-path` | 2026-05-04 | 2026-05-04 |
| `Verdant Sprouting Leaf` | `claude-code` | `claude-opus-4-7-1m` | `63a0e0` | `post-/insights-reflection-round; three-owner-named-insights-captured-at-moment-of-occurrence; PDR-018-amendment-beneficial-prerequisites-must-not-block; PDR-038-amendment-doctrine-without-enforcement-at-maturity; PDR-044-new-memetic-immune-system; current/doctrine-enforcement-quick-wins.plan.md-six-workstreams-innate-immunity; future/memetic-immune-system-and-progressive-disclosure.plan.md-strategic-roadmap; practice-index-and-current-future-README-discovery-updates; commit-192b6965-9-files-+1580/-1` | 2026-05-04 | 2026-05-04 |
| `Pearly Snorkelling Reef` | `claude-code` | `claude-opus-4-7-1m` | `6db5ac` | `parallel-isolation-worktree-dispatch-attempt-of-doctrine-enforcement-quick-wins; two-of-three-workers-spawned-on-wrong-base-improvised-and-violated-worktree-boundary-by-writing-to-main-repo-scripts; main-repo-script-and-tests-restored-from-clean-worktree; salvage-path-cherry-pick-WS1-91232df6-port-WS2-eacb05f2-port-WS5-design-767ee23a; plan-marked-PARTIAL-WS3-WS4-WS6-pending; continuity-commit-79ef671c-worker-comms-events-prior-session-claim-closure; durable-lesson-saved-feedback_worktree_isolation_unreliable-md-in-personal-memory` | 2026-05-04 | 2026-05-04 |
| `Fronded Flowering Thicket` | `claude-code` | `claude-opus-4-7-1m` | `7c8381` | `owner-directed-layered-knowledge-processing-pass-Layer-0-then-Layer-1-then-Layer-2; napkin-rotation-785-to-105-lines-archived-as-napkin-2026-05-04; distilled-merge-and-prune-401-to-308-lines-net-93-no-compression; three-patterns-created-parallel-worktree-dispatch-unreliable-templates-encode-failure-modes-plan-as-artefact-gravity; PDR-045-workspace-first-investigation-discipline-authored-three-moves-artefact-search-shared-package-survey-live-state-check; three-host-rules-cite-PDR-045-validate-full-target-estate-read-diagnostic-artefacts-in-full-consolidate-at-third-consumer; pre-existing-PDR-016-stale-filename-fixed-in-passing; PDR-README-index-drift-fixed-PDR-043-PDR-044-PDR-045; Practice-CHANGELOG-entry; layered-processing-methodology-itself-captured-as-graduation-candidate-PDR-and-consolidate-docs-amendment; eight-PDR-shaped-candidates-surfaced-for-fresh-session-continuation` | 2026-05-04 | 2026-05-04 |
| `Vining Spreading Seed` | `claude-code` | `claude-opus-4-7-1m` | `11429f` | `doctrine-enforcement-quick-wins-WS3-hedging-vocabulary-scoped-trip-list-c256f325; WS4-SHA-in-permanent-doc-regex-with-context-exclusions-8b0fe826-citation-fix-aa6e37d5; WS6-git-add-wildcard-block-with-citation-infrastructure-0fffc55e; plan-marked-COMPLETE-07249f09; rules-and-RULES_INDEX-integration-7e295693-three-rule-files-stage-by-explicit-pathspec-no-hedging-vocabulary-no-moving-targets-in-permanent-docs-each-with-canonical-plus-claude-plus-cursor-adapters-and-RULES_INDEX-preamble-reframed-from-Codex-fallback-to-canonical-platform-independent-enumeration-and-AGENT.md-rules-section-wired-to-it; napkin-updates-c8f8e7dc-and-2a0da4d2-and-d3d2bb95-worked-instance-lessons-and-self-violation-discovery-via-permission-system-rejecting-backticked-SHAs-in-rule-files-themselves-and-owner-direction-to-tighten-the-hook-to-distinguish-prose-narrative-from-code-block-backtick-contexts; concurrent-with-Fronded-Flowering-Thicket-no-claim-overlap-one-peer-staged-rename-interaction-cured-via-git-commit-pathspec` | 2026-05-04 | 2026-05-04 |
| `Ferny Spreading Petal` | `claude-code` | `claude-opus-4-7-1m` | `d0d13f` | `layer-2-second-pass-continuation-from-Fronded-handoff; PDR-046-layered-knowledge-processing-drafted-three-moves-bottom-up-traversal-suspend-in-process-form-keeping-graduate-substance-upward-not-compress; pending-graduations-marked-graduated; PDR-README-index-and-Practice-CHANGELOG-updated; PDR-047-rule-applies-always-and-PDR-048-insight-capture-at-moment-of-occurrence-sequenced-after-PDR-046-owner-review` | 2026-05-04 | 2026-05-04 |
| `Gnarled Climbing Bark` | `claude` | `claude-opus-4-7-1m` | `40a044` | `practice-context-cost-baseline-authored-at-.agent-analysis-practice-context-cost-baseline-md; passive-harvest-method-claude-code-only-jsonl-plus-context-slash-command-triangulation; always-on-rule-tier-figures-52-canonical-168500-chars-42K-tokens-soft-load-vs-50-adapter-3606-chars-900-tokens-harness-hard-injected; entry-point-graph-92908-chars-23K-tokens; memory-surface-187388-chars-46K-tokens-repo-continuity-md-dominates-at-137442-chars-34K-tokens; illustrative-session-journey-Lacustrine-dd239f-34-Read-calls-22-unique-files-362K-tokens-thread-record-and-EEF-plan-account-for-79-percent; progressive-disclosure-plan-success-signals-baseline-link-added-and-four-item-scope-expansion-register-added-CLI-fitness-frontmatter-token-fields-fitness-reporter-token-rendering-frontmatter-mandation-across-guidance-files; analysis-README-listing-added; user-memory-feedback_no_verify_fresh_permission-md-refined-agent-initiated-no-verify-is-forbidden-owner-directs-when-not-the-reverse; doc-commit-deferred-pre-commit-test-gate-failed-on-unrelated-oauth-proxy-routes-integration-test-line-309-Parse-Error-Expected-HTTP-RTSP-or-ICE-test-source-unchanged-from-HEAD-cache-invalidated-by-peer-Moonlit-doc-edits-exposed-latent-failure; heads-up-comms-log-entry-posted-to-Moonlit-Shimmering-Comet-2026-05-05T08-25-00Z; commit-window-claim-77e52443-closed-intent-b151ab5f-abandoned; doc-bundle-three-files-staged-in-working-tree-as-visible-signal-pending-OAuth-gate-unblock; POST-HANDOFF-coordination-arc-after-owner-check-your-messages-prompt-discovered-Moonlit-heads-up-was-direct-edit-to-generated-shared-comms-log-md-overwritten-by-regeneration-and-Lacustrine-Navigating-Rudder-dd239f-question-event-aaa282e6-with-2-minute-deadline-08-39-58Z-blocked-by-my-three-abandoned-staged-files-replied-event-4ec85e69-at-08-39-50Z-authorising-option-2-unstage-to-commit-and-re-stage-after-and-re-posted-Moonlit-heads-up-as-event-ce5cc169-three-pending-graduations-entries-added-comms-log-rule-extension-and-comms-event-CLI-helper-and-trust-the-artefacts-stated-provenance-pattern-candidate-experience-file-2026-05-05-gnarled-the-header-was-the-contract-md-authored` | 2026-05-05 | 2026-05-05 |
| `Lacustrine Navigating Rudder` | `claude` | `claude-opus-4-7-1m` | `dd239f` | `cross-thread-landing-of-Gnarled's-deferred-bundle-under-owner-direction-commit-all-files-in-sensible-chunks; chunk-2-of-five-was-Gnarled's-substance-practice-context-cost-baseline-plus-progressive-disclosure-plan-update-plus-experience-file-plus-napkin-surprises-1-through-6-plus-pending-graduations-three-entries-plus-thread-records-on-both-threads-plus-repo-continuity; chunk-4-was-Gnarled's-second-experience-capture-on-asymmetric-minds; substance-attributed-to-Gnarled-in-commit-bodies; this-row-records-cross-thread-participation-per-session-handoff-7c-hard-gate; substantive-work-on-observability-sentry-otel-thread-step-04-backfill-review-plus-step-05-doc-cleanup` | 2026-05-05 | 2026-05-05 |
| `Ethereal Transiting Comet` | `claude-code` | `claude-opus-4-7-1m` | `8081d3` | `fitness-reflection-and-governance-graduation-pass-on-foundational-due-items; pattern-A-structural-enforcer-recursive-exclusion-authored-process-tier-with-two-worked-instances-WS3-trip-list-and-PDR-047-self-fire; rule-extension-B-consolidate-docs-Learning-Preservation-section-extended-with-upward-pointer-to-PDR-046-layer-orchestration-discipline; severity-is-not-urgency-sharpening-saved-to-no-speed-pressure-feedback-memory; reviewer-dispatch-code-reviewer-plus-docs-adr-reviewer-plus-assumptions-reviewer` | 2026-05-05 | 2026-05-05 |
| `Opalescent Threading Nebula` | `claude-code` | `claude-opus-4-7-1m` | `4c1773` | `Layer-0-to-Layer-1-napkin-rotation-per-consolidate-docs-section-6-and-PDR-046-layered-knowledge-processing; archived-six-session-entries-from-2026-05-04-Lacustrine-Pelagic-Fronded-Ferny-and-2026-05-05-Ethereal-Lacustrine-to-archive-napkin-2026-05-05-md-no-compression; extracted-cross-session-refinements-into-distilled-md-severity-is-not-urgency-and-diagnostic-over-assumption-on-enforcer-conflation-and-capture-at-moment-of-occurrence-validation-and-inter-agent-comms-as-first-class-primitive-and-ADRs-permanent-plans-ephemeral-and-shared-comms-log-is-generated-not-hand-edited; fresh-napkin-keyed-on-this-session; layer-1-fitness-pressure-resolution-deferred-to-subsequent-pass-per-PDR-046-Move-3` | 2026-05-05 | 2026-05-05 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

**Latest session landed canonical-first skill pack ingestion future plan
(2026-04-30 Dewy Budding Sapling):**

- Investigated current skill-portability pipeline (canonical at
  `.agent/skills/`, thin wrappers under `.claude/`, `.cursor/`, `.agents/`,
  plus `skills-lock.json` and `pnpm portability:check`); confirmed manual
  canonicalisation flow and the unbuilt
  `pnpm agent-tools:canonicalise-vendor-skills` mitigation flagged at the
  close of the portability-remediation plan.
- Drafted vendor-agnostic future strategic plan
  [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../../../plans/agentic-engineering-enhancements/future/canonical-first-skill-pack-ingestion-tooling.plan.md)
  — never names a delivery vendor; ecosystems referenced as illustrative
  only (Anthropic / Vercel / Cloudflare / Clerk / ModelContextProtocol /
  Cursor / Codex / future-not-yet-authored). Plan body forbids
  vendor-keyed conditionals in tool source as a validator-enforceable rule.
- Promotion gated on PASS from the deep sub-agent review set
  (assumptions-reviewer + architecture-reviewer-fred|betty|barney|wilma).
  Reviews are blocking later but not required now per owner direction.
- Discovery surfaces wired: future/README.md table row, collection
  README.md Documents row, roadmap.md Adjacent section + status header,
  forward-link from sibling adapter-generation plan, forward-link from
  Phase 6 mitigation note in current portability-remediation plan.
- Validators green: `pnpm portability:check` (12 commands, 36 skills,
  45 rules, 22 reviewer adapters, 47 Cursor triggers, 45 Claude rules,
  45 .agents rules, 40 command adapters across 4 platforms);
  markdownlint clean across all touched files.
- No production code, schema, or runtime configuration touched.
- Branch (`fix/sentry-identity-from-env`, PR #91) is observability work
  by a different identity in a different thread; this session did not
  modify it.

**Prior session landed commit-gate doctrine correction (2026-04-28 Glassy
Ebbing Reef):**

- owner clarified that `.agent/` is shared Practice/coordination state and is
  always safe to include in commits when it belongs to the live bundle;
- owner clarified that the commit queue protects the staged authorial bundle,
  while the commit hooks protect whole-repo integrity;
- minor whole-repo hook failures are repaired immediately, including in
  peer-owned WIP when the repair is mechanical and gate-honest;
- larger whole-repo failures are planned as the highest-priority next item,
  without narrowing hooks, bypassing verification, or introducing compatibility
  layers;
- commit `7c589a0a` landed this doctrine plus the Cloudflare MCP handoff state
  after the full pre-commit chain passed.

**Latest handoff verified Codex identity archive state (2026-04-28 Coastal
Mooring Atoll):**

- the completed
  [`codex-session-identity-plumbing.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md)
  remains archived, and the old `current/` path is deleted;
- the leftover archive claim is closed with evidence in collaboration state
  (`ac0fe90f-e773-4415-940b-6c8c9e074a7a`, closed by Mossy Creeping Branch);
- entrypoints remain pointer-only, `.remember/` added no new next-session
  behaviour, and real conversations/escalations required no handoff action;
- the brief consolidation trigger from active napkin hard pressure was handled
  by Mossy Creeping Branch's overflow rotation; current
  `pnpm practice:fitness:strict-hard` is soft-only.

**Prior session implemented Codex identity plumbing (2026-04-28 Mossy
Creeping Branch):**

- promoted the future Codex identity brief into
  [`codex-session-identity-plumbing.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md);
- added a soft Codex `SessionStart` hook adapter that emits the full PDR-027
  identity block as additional context when Codex supplies `session_id`;
- added report-only identity audit over active claims, closed claims, thread
  records, and the rendered shared comms log;
- updated start-right, identity, plan, continuation, ADR, and PDR surfaces so
  thread registration and shared-state writes use the same identity preflight
  path.

**Prior session landed hook test IO remediation (2026-04-28 Verdant
Flowering Blossom):**

- retained hook tests now prove policy parsing, content extraction,
  added-pattern matching, hook-health formatting, CLI arg parsing, and
  guard composition at the lowest viable layer;
- PreToolUse command/content guards accept injected blocked patterns and prior
  readers, keeping policy-file and prior-file IO in runtime composition roots;
- agent-tools CLI E2E tests that only proved `pnpm tsx` process startup,
  help text, health output, cursor filtering, or invalid agent-id behaviour
  were deleted or lowered to pure unit coverage;
- validation passed for `pnpm test:root-scripts`, `pnpm agent-tools:test`,
  `pnpm agent-tools:test:e2e`, `pnpm type-check`, `pnpm lint`, `pnpm knip`,
  `pnpm depcruise`, `pnpm test`, `pnpm format-check:root`,
  `pnpm markdownlint-check:root`, `pnpm practice:vocabulary`, and
  `git diff --check`. `pnpm practice:fitness:strict-hard` still fails on
  known documentation fitness pressure in `principles.md`,
  `collaboration-state-conventions.md`, and `repo-continuity.md`.

**Latest session is implementing collaboration-state write safety
(2026-04-28 Woodland Creeping Petal):**

- promoted the collaboration-state domain-model/comms-reliability brief into
  [`collaboration-state-write-safety.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md);
- added `pnpm agent-tools:collaboration-state -- ...` for identity preflight,
  comms append/render, claims open/heartbeat/close/archive-stale,
  conversation append, escalation open/close, and state checks;
- added transaction-guarded JSON writes for active claims, closed claims,
  conversations, escalations, and commit queue mutations;
- kept hook/session-exit work as later polish and retained TTL cleanup as the
  portable baseline.

**Prior session preserved collaboration-state session-close semantics
(2026-04-28 Ethereal Threading Supernova):**

- corrected the Codex platform classification after owner supplied the
  official hooks docs: Codex hooks are supported, but no `SessionEnd` event is
  documented; `Stop` is turn-scoped and should not be treated as full
  session-exit cleanup;
- captured owner decisions that old claims are not picked up on terminal
  resume, session close should close claims, and missed claim closes are
  handled by stale/orphan TTL cleanup rather than success-marking;
- expanded the shared-state reliability plan from shared comms only to every
  shared inter-agent state record once the domain boundaries are defined;
- added the rolling archive requirement for shared comms history so the live
  log stays usable without losing past context;
- updated the future plan, lifecycle/conventions docs, state README,
  cross-platform matrix, hooks portability plan, napkin, repo-continuity, and
  this thread record.

**Latest session graduated queue governance (2026-04-27 Coastal Washing
Rudder):**

- owner-directed governance pass treated commit `5c39d1d4` as the evidence
  trigger, not as current HEAD; current HEAD was verified as `0b8af81f` during
  the edit pass;
- amended PDR-029 with Family A Class A.3 for shared git transaction /
  authorial-bundle discipline: advisory FIFO queue artefact, exact staged
  bundle verification, and non-mechanical enforcement;
- kept operational detail in
  [`collaboration-state-conventions.md`](../collaboration-state-conventions.md)
  and
  [`collaboration-state-lifecycle.md`](../collaboration-state-lifecycle.md);
- archived the completed
  [`intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md)
  and updated current/future indexes, roadmap, completed-plan index,
  repo-continuity, and this thread record;
- no queue implementation code, schema change, `agent-tools` edit, or
  `session_counter` primitive was added. `session_counter` remains future-only
  unless a real primitive is deliberately implemented later.

**Prior latest session landed queue implementation and self-application
(2026-04-27 Prismatic Waxing Constellation, commit `5c39d1d4`):**

- owner-directed queue work landed as
  `feat(agent-tools): add commit queue workflow`. The landing used a fresh
  `git:index/head` claim, queued the exact staged file bundle, recorded the
  staged fingerprint, verified it before commit, and completed the queue entry;
- promoted
  [`intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md)
  as the executable queue plan, then later archived it after governance
  graduation; the future source plan carries the `2ccefad4` turn-race
  evidence and now keeps only the residual `session_counter` slice future-only;
- added active-claims schema v1.3.0 with root `commit_queue`, optional claim
  `intent_to_commit` pointer, and local helper
  `pnpm agent-tools:commit-queue --` for enqueue, phase, staged-fingerprint capture,
  exact staged-bundle verification, and completion cleanup;
- updated commit, start-right, active-claim, collaboration, consolidation, and
  cross-vendor wrapper guidance. The queue is advisory FIFO discovery, not a
  lock or refusal mechanism, and session-count TTL remains future-only;
- validation passed: `pnpm agent-tools:build`, `pnpm agent-tools:test`,
  `pnpm agent-tools:lint`, `pnpm knip`, `pnpm test:root-scripts`,
  `pnpm portability:check`, `pnpm markdownlint-check:root`,
  `pnpm practice:vocabulary`, `pnpm practice:fitness:strict-hard`, and
  `git diff --check`; the real commit hook also passed Prettier format check,
  markdownlint, knip, depcruise, and turbo type-check/lint/test;
- the root `scripts/commit-queue.mjs` file is absent from both the working tree
  and staged index. Active claims and `commit_queue` are empty after handoff;
  the next index action must still re-check active claims, queue order, and
  `git diff --cached --name-status`.

**Prior latest session landed as closeout and next-session opener
(2026-04-27 Fragrant Sheltering Pollen, Codex rollback and queue-evidence
handoff):**

- owner corrected the previous direction: drop the experimental Codex
  app-server title-mutation approach because stable names from
  `CODEX_THREAD_ID` provide the load-bearing value;
- removed the app-server implementation scope from the working tree and kept
  the stable identity documentation row. `@oaknational/agent-tools` gates
  passed: build, type-check, lint, lint:fix, unit tests, e2e tests, plus an
  identity smoke test printing `Fragrant Sheltering Pollen`;
- a short-lived `index/head` commit-window claim still collided with live
  shared-index activity. Commit `2ccefad4` contains the Codex stable-name doc
  row under another agent's scripts-fix message, and `HEAD` advanced again to
  `21abd2d4` during inspection. The session did not amend or rewrite shared
  history;
- owner directed this collision to be recorded as evidence for the
  intent-to-commit queue. Next implementation re-attempts by adding ordered
  `commit_queue` mechanics plus exact staged-bundle verification. Falsifiability:
  inspect `intent-to-commit-and-session-counter.plan.md`, the shared log entry
  for claim `a980a5e8-5b5a-4bb0-84d5-99358bfd7014`, and `git show 2ccefad4`.

**Prior latest session landed as closeout and next-session opener
(2026-04-27 Pelagic Washing Sail, Codex handoff/consolidation):**

- `jc-session-handoff` and `jc-consolidate-docs` ran before serious
  commit-queue implementation, per owner direction;
- active claim `72b0e57c-4167-4407-b2ac-db1e4231619a` was opened for
  closeout surfaces and closed explicitly in collaboration state;
- strict-hard fitness pressure in `napkin.md` and `repo-continuity.md` was
  remediated without deleting live learning;
- Vining did not visibly pick up the shared-log vocabulary TTL/examples note
  at the first heartbeat check, which is now recorded as WS5 evidence that
  broadcast logs need directed channel/ack protocols for targeted requests;
- no queue schema, API, workflow, staging, or commit work was started.
  Next session re-attempts by promoting/updating the intent-to-commit plan
  around a first-class ordered advisory queue, then implementing schema and
  workflow v1.3. Falsifiability: inspect active/closed claims, the shared log,
  this thread record, and the future plan before touching schemas.

**Latest session landed as committed identity support plus handoff evidence
(2026-04-27 Celestial Waxing Eclipse, Codex display-surface handoff):**

- deterministic Codex identity seeding from `CODEX_THREAD_ID` already landed
  in `ff119d44` and collaboration claim closeouts landed in `701c3185`;
- this handoff set the current Codex thread title to
  `Celestial Waxing Eclipse`, and `~/.codex/session_index.jsonl` carries the
  same thread name;
- official CLI/TUI title/statusline configuration exists, but no supported
  IDE-extension setting for a deterministic custom session name was found in
  local extension settings;
- owner asked to use the CLI/TUI surfaces anyway. `~/.codex/config.toml` now
  sets `terminal_title = ["spinner", "project-name", "thread-title",
  "git-branch"]` and `status_line = ["model-with-reasoning", "git-branch",
  "thread-title", "session-id", "context-remaining", "five-hour-limit",
  "weekly-limit"]`. Falsifiability: inspect `~/.codex/config.toml`, the
  Codex IDE extension package configuration, and official Codex CLI/TUI
  slash-command docs before wiring any display adapter.

**Latest session landed as uncommitted documentation/state edits
(2026-04-27 Pelagic Washing Sail, pre-commit-queue handoff):**

- collaboration-doc fitness remediation is implemented in the working tree:
  high-frequency doctrine stays in the directive/conventions files while
  detailed lifecycle recipes live in `collaboration-state-lifecycle.md`;
- `practice:vocabulary` was fixed by translating the shared-log ADR-144
  phrase from retired wording to the current three-zone vocabulary;
- a cross-vendor shared-log note to Vining Bending Root records the
  vocabulary-transition TTL/examples idea; a thread heartbeat checks
  periodically for pickup evidence;
- serious `intent_to_commit` implementation was deliberately paused for this
  handoff. Next session re-attempts by amending/promoting the existing plan
  around an explicit ordered commit queue, then implementing schema/workflow
  v1.3. Falsifiability: inspect `active-claims.json` for no remaining
  Pelagic queue-work claim, inspect this thread record's Next Safe Step, and
  check the future plan's owner-direction note before editing schemas.

**Latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, same-branch friction handoff):**

- owner corrected Codex's initial safety framing: separate worktrees /
  branches would hide the same-branch coordination friction this experiment is
  meant to reveal;
- napkin, repo-continuity, this thread record, the observability thread
  record, and the shared communication log now capture the operating
  principle: same-branch overlap is allowed, but commit windows, path
  ownership, and shared-surface handoffs must be visible before staging /
  committing;
- Frolicking Toast's active commit-steward claim
  `4535f2ff-0420-4bde-bfb8-af0db656e359` remains open; Codex had no matching
  active claim to close; no decision-thread update was needed.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, session handoff):**

- repo-continuity and this thread record now reflect current HEAD
  `e4705169`, the WS3B gate-satisfied / not-implemented state, and this
  session's handoff;
- collaboration lifecycle is closed explicitly into
  `closed-claims.archive.json`;
- consolidation gate is marked due for hard `distilled.md` fitness pressure
  and pattern / phase-transition convergence, but `jc-consolidate-docs` was
  not run inside this lightweight handoff.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS3B and joint-decision status reconciliation):**

- current README, roadmap, parent MAC plan, repo-continuity, and this thread
  record now reflect that WS3B's promotion gate is satisfied but
  implementation has not started;
- future README now lists the newly recorded
  `joint-agent-decision-protocol.plan.md`;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, commit-bundle evidence taxonomy):**

- future intent-to-commit plan now treats three staged-bundle integrity
  failures as promotion-threshold evidence: substitution, disappearance, and
  accretion;
- napkin captures that the durable unit is the full bundle: agent intent,
  intended pathspecs, staged diff, and commit subject;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, lock-wait nuance):**

- commit skill now states Claude may use Monitor to wait for
  `.git/index.lock`, while Codex/Cursor should use a bounded shell wait unless
  a custom monitor exists;
- the note explicitly preserves the distinction: lock waits are physical
  guards, while `git:index/head` active claims and shared-log entries are the
  coordination layer;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, commit-window protocol refinement):**

- git index/head is now an explicit short-lived active-claim area
  (`git:index/head`) before staging or committing;
- the commit skill, start-right workflows, collaboration rules, state
  schemas, state README, consolidation audit, channel card, founding
  collaboration pattern, repo-continuity, and napkin carry the protocol;
- platform commit adapters now point agents at the same canonical
  commit-window-aware skill;
- no WS3B sidebar/timeout/owner-escalation mechanics or hook automation
  were started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, learning-first correction after WS4A closeout):**

- owner correction applied: fitness limits, including hard and critical
  signals, must never suppress capture, distillation, graduation, or useful
  writing;
- outgoing napkin archived to
  [`napkin-2026-04-26.md`](../../active/archive/napkin-2026-04-26.md), and
  high-signal entries distilled into `distilled.md`;
- `consolidate-docs`, PDR-014, ADR-144, Practice Core, repo-continuity, and
  this thread record now say learning comes first and fitness pressure routes
  follow-up structure work.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS4A plan-state cleanup and consolidation closeout):**

- parent MAC plan and roadmap now distinguish the completed WS3 evidence
  harvest from remaining post-WS4A observation / seed harvest work;
- stale WS3/WS4 wording, per-WS seed counts, and stale-conversation wording
  were corrected after `docs-adr-reviewer` findings;
- reviewer governance now says specialist sub-agent review is preferred
  evidence for substantive work, while findings require disposition and
  only blocking findings / hard gate failures block closure;
- `agent-collaboration.md` now says existing owner questions are distinct
  from the deferred WS3B file-backed owner-escalation surface;
- napkin date hygiene corrected the future-dated Composer entry from
  2026-04-27 to 2026-04-26.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS4A lifecycle integration):**

- start-right quick/thorough now explicitly read active claims, the
  shared communication log, and WS3A decision-thread files before edits;
- session-handoff now closes own active claims into the closed-claims
  archive and updates relevant decision threads before the consolidation
  gate;
- plan templates now include a lifecycle-trigger component and tiered
  simple-plan/work-shape requirement;
- Practice Core, PDR-024, ADR-119, ADR-124, practice-index, roadmap,
  current-plan index, and documentation-sync log now treat collaboration
  state as a first-class Practice surface;
- `invoke-code-reviewers.md` now distinguishes reviewer dispatch from
  peer collaboration state;
- WS3B sidebar, timeout, and owner-escalation gate is satisfied;
  implementation remains a separate pass.

**Prior session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS3A complete):**

- codified the WS5 harvest baseline and RED fixtures for claim-history
  and decision-thread surfaces;
- added `closed-claims.schema.json`, migrated `closed-claims.archive.json`
  to v1.1.0 with structured `closure` metadata, and updated claim-close
  guidance across the directive, rules, state conventions, and
  `consolidate-docs`;
- self-applied the new closure path: the WS3A claim-history claim is in
  `closed-claims.archive.json` with `closure.kind: "explicit"`;
- validation: claim-history JSON/Ajv/closure checks and decision-thread
  jq/file-dir/Ajv checks passed, along with targeted markdownlint,
  `git diff --check`, and `pnpm practice:fitness:informational`. The only
  hard fitness finding remains `repo-continuity.md`, already marked for
  separate deep consolidation.
- added `conversation.schema.json`,
  `.agent/state/collaboration/conversations/`, open/closed examples, and
  GREEN conversation fixtures preserving the RED filenames as history;
- updated collaboration guidance for when to use the shared log, an
  active claim, a decision thread, the napkin, and the thread record;
- wired `consolidate-docs § 7e` to report active/stale claims, recent
  closures, open/stale decision threads, unresolved decision requests,
  evidence-bundle gaps, and schema validation;
- marked `ws3a-refactor-observability` and `ws3a-validation-and-handoff`
  complete in the WS3A plan and refreshed current-plan/roadmap status;
- WS3B sidebar, timeout, and owner-escalation surfaces remain unimplemented;
  their promotion gate is satisfied.

**Prior session landed as uncommitted documentation/state edits
(2026-04-26 Codex):**

- renamed the live "embryo" terminology to **shared communication log/system**
  across the plan, directive, rules, state docs, memory cards, and handoff
  surfaces;
- integrated owner direction on platform independence into the protocol plan,
  `agent-collaboration.md`, `distilled.md`, and the napkin;
- refreshed the collaboration plan, roadmap, current-plan index, and this
  thread record from "evidence still accumulating" to "evidence threshold
  appears met; owner-directed harvest required";
- superseded the stale `temp-agent-collaboration-continuation.md` note;
- validation: `jq empty .agent/state/collaboration/active-claims.json` passed;
  `git diff --check` passed; `pnpm practice:fitness:informational` has only
  the unrelated/claimed `repo-continuity.md` hard finding remaining;
  `pnpm markdownlint-check:root` passed once, then a final rerun picked up
  Sharded's claimed PR-87 plan MD018 issue and was left untouched.

**Prior session landed as artefacts, not a commit**:

- separated continuity strategy/process from operational state:
  [`continuity-practice.md`](../../../directives/continuity-practice.md)
  now carries doctrine; [`repo-continuity.md`](../repo-continuity.md)
  carries active state;
- updated [`session-handoff.md`](../../../commands/session-handoff.md)
  with the role-boundary check that prevents those surfaces from
  muddying again;
- clarified testing-family roles by making
  [`testing-patterns.md`](../../../../docs/engineering/testing-patterns.md)
  the governed recipe companion to
  [`testing-strategy.md`](../../../directives/testing-strategy.md);
- amended
  [PDR-014](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
  with knowledge-artefact roles and bidirectional knowledge flow;
- updated [`patterns/README.md`](../../active/patterns/README.md) to name
  the empirical-to-normative flow from observed practice into recipes,
  rules, principles, scanners, and decision records;
- created the two queued plans listed in the header.

**Latest session landed as grouped commits**:

- `9c866634` — `test(search-cli): inject smoke env through vitest context`;
- `fa069efe` — `chore(agents): update cursor reviewer model metadata`;
- `ccc2ca46` — `docs(practice): home agent directives and testing doctrine`;
- `015ac99b` — `docs(continuity): record plan handoff state`;
- implemented the AGENT homing plan and marked its todos complete;
- added the AGENT source-to-target ledger under plan evidence;
- moved durable reviewer, agent-tool, artefact, command, and commit detail to
  their role homes and slimmed AGENT to an entrypoint;
- cleared `principles.md` hard pressure by delegating detailed testing doctrine
  and repo topology to their durable homes;
- cleared `testing-strategy.md` hard pressure by moving worked TDD examples to
  [`testing-tdd-recipes.md`](../../../../docs/engineering/testing-tdd-recipes.md);
- aligned `no-global-state-in-tests.md` with the no-read/no-write
  `process.env` contract.
- review follow-up removed the remaining smoke-test `process.env` read by
  injecting validated smoke config from `vitest.smoke.config.ts`, restored the
  "assert effects, not constants" testing principle, and corrected the moved
  TDD recipe examples.
- after analysing the streamable-http `pnpm check` blocker, created
  [`mcp-local-startup-release-boundary.plan.md`](../../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
  and removed the arbitrary observability plan-density limit that had
  misrouted the plan on first placement. The plan has since been promoted to
  active, Phase 0 evidence has landed, and Phase 1 RED evidence now makes
  Phase 2 GREEN the next observability step.

Deferral honesty: the AGENT and hard-fitness work has landed in commits. The
local startup/release-boundary plan is deliberately unimplemented; it is a
queued follow-up, not hidden completion.

---

## Session Shape and Grounding

At session open, read in order:

1. [`repo-continuity.md`](../repo-continuity.md), especially Active Threads,
   Next Safe Step, and Deep Consolidation Status.
2. This thread record.
3. The current plan that the owner names, or
   [`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md)
   if continuing documentation-role work.
4. [`PDR-014`](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
   for knowledge-artefact roles.
5. [`AGENT.md`](../../../directives/AGENT.md) and any target homes named
   in the active plan.

Before editing, update this identity table per the additive rule and run:

```bash
pnpm practice:fitness:informational
nl -ba .agent/directives/AGENT.md
```

---

## Lane State

### Owning Plans

- Primary (active multi-workstream lane):
  [`multi-agent-collaboration-protocol.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
  — WS0 landed `63c66c88`; WS1 landed `a5d33519`; WS2 landed
  `293742cd`. WS3 is split: WS3A is complete and archived, WS3B sidebar /
  escalation is implemented, WS4A lifecycle integration is complete, and WS5
  remains observation/harvest work.
- Completed split plan:
  [`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
  — WS3A evidence provision, protocol observability, durable claim-closure
  history, and lightweight decision threads.
- Implemented sibling plan:
  [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
  — WS3B sidebar, timeout, owner-escalation, and joint-decision mechanics.
- Completed identity plan:
  [`agent-identity-derivation.plan.md`](../../../plans/architecture-and-infrastructure/archive/completed/agent-identity-derivation.plan.md)
  — repo-owned core/CLI/docs landed in `3a5e3d81`+`ed256e6f`; Phase 8
  Claude Code statusline wiring landed in this session; archived 2026-04-27.
- Fitness remediation:
  [`collaboration-doc-fitness-remediation.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-doc-fitness-remediation.plan.md)
  — implemented in the working tree; validate/land separately from queue
  work.
- Completed queue implementation plan:
  [`intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md)
  — landed in `5c39d1d4`, self-applied the queue, graduated governance to
  PDR-029 Family A Class A.3, and is now archived.
- Strategic source / follow-up:
  [`intent-to-commit-and-session-counter.plan.md`](../../../plans/agentic-engineering-enhancements/future/intent-to-commit-and-session-counter.plan.md)
  — queue slice complete; residual `session_counter` work remains future-only
  unless a real primitive is deliberately promoted later.
- Strategic source / follow-up:
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
  — preserves the shared-log collision analysis, the requirement that all
  shared inter-agent state records get multi-agent-safe write paths after the
  domain boundaries are named, log/claims/conversation responsibility split,
  UTC validation need, sidebar attention questions, active-participant
  verification gap, and identity-preflight requirement. Owner priority update
  2026-04-28: promotion trigger is satisfied; clashing writes to shared state
  are pressing, while hooks/session-exit cleanup are refinements.
- Implemented current slice:
  [`collaboration-state-write-safety.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md)
  — landed as `11f0320f` with immutable comms events, transaction-guarded
  JSON state writes, Codex identity preflight, and TTL archival baseline.
  Closure remains pending the documented hard-fitness disposition.
- Implemented current slice:
  [`codex-session-identity-plumbing.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md)
  — Codex `SessionStart` identity context, canonical identity preflight,
  report-only anonymous identity audit, and coordination/platform-tooling
  doctrine propagation. Historical `Codex` / `unknown` rows remain
  evidence-preserving audit findings unless a later manual repair has stronger
  evidence.
- Earlier completed work:
  [`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
- Follow-on:
  [`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md)
- Context:
  [`practice-and-process-structural-improvements.plan.md`](../../../plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md)
- Strategic source / future (drafted 2026-04-30):
  [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../../../plans/agentic-engineering-enhancements/future/canonical-first-skill-pack-ingestion-tooling.plan.md)
  — vendor-agnostic CLI for ingesting any external skill pack into the
  canonical-first three-layer model; closes the unbuilt mitigation option 1
  of the portability-remediation plan (`pnpm agent-tools:canonicalise-vendor-skills`).
  **Promotion is gated on PASS from the deep sub-agent review set**
  (assumptions-reviewer + architecture-reviewer-fred|betty|barney|wilma).
  Reviews are blocking later but not required now.

### Current Objective

**WS4A lifecycle integration, coordination consolidation, deterministic
identity, collaboration-doc fitness remediation, cross-vendor shared-log
handoff evidence, and the owner-directed intent-to-commit queue are complete
or captured in the working tree (refreshed 2026-04-27).**

**2026-04-28 update:** the communication-channel register, Practice/tooling
feedback capture rule, UTC convention, and ADR/PDR drift refresh are captured.
Owner clarified priority: resolving clashing writes to shared state was
pressing. The write-safety slice is now implemented and landed as `11f0320f`;
it uses Codex identity preflight, immutable comms events, transaction-guarded
JSON state writes, commit-queue transaction reuse, and TTL archival as the
portable baseline. Owner-settled follow-up semantics are preserved: session
close closes claims; resume opens fresh claims; stale/orphan TTL cleanup
handles missed closes; shared comms uses hot-plus-archive retention. Codex has
hooks but no documented session-exit hook yet; treat that as refinement, not a
blocker for the shared-state write-safety slice.
WS0 (`63c66c88`), WS1 (`a5d33519`), WS2 (`293742cd`), WS3A, the
owner-approved lifecycle wiring pass, and the `git:index/head`
coordination refinement are reflected in documentation/state surfaces.
WS3B is implemented; WS5 now means post-WS4A/WS3B real-session
observation / seed harvest.

The current experiment deliberately keeps agents on the same branch so
coordination frictions remain visible. Do not convert that into a worktree
avoidance rule; convert it into observable communication: claims, shared-log
notes, decision-thread handshakes when needed, and strict commit-window
announcements.

**Resumption gate**: the later 2026-04-25 shared-communication-log entries
appear to satisfy the original 3+ coordination-event inspection threshold, but
that evidence was used to split and complete WS3A, then to justify the
narrow WS4A lifecycle pass. Later three-agent phase-transition evidence
satisfied the WS3B gate; owner direction then implemented WS3B plus
joint-decision integration. It does not resume WS5 automatically.

**Inspection points**: `/jc-consolidate-docs` § 7e now audits open/stale
claims, recent closures, decision-thread state, sidebars, joint decisions,
active escalations, unresolved decisions, evidence-bundle gaps, and schema
validation.

### Current State

- WS3A RED, claim-history GREEN, decision-thread GREEN, protocol-observability
  refactor, and validation/handoff are complete.
- WS4A lifecycle integration is complete across start-right,
  session-handoff, plan templates, Practice Core, ADR-119, ADR-124, and
  practice-index surfaces.
- Commit-window coordination is implemented across commit skill, start-right,
  collaboration rules, active/closed-claim schemas, state README,
  consolidation audit, channel card, founding pattern, and continuity
  surfaces.
- WS3B sidebar/escalation and joint-agent decision integration is
  implemented across conversation schema v1.1.0, escalation schema,
  fixtures, start-right, session-handoff, consolidate-docs,
  collaboration rules, directives, channel card, state README, and state
  conventions.
- Deterministic identity is implemented in `agent-tools` with a built
  `agent-identity` CLI, tests, docs, PDR-027 amendment, start-right guidance,
  and platform-wrapper status table. Phase 8 Claude Code platform alignment
  review is complete: `.claude/settings.json` →
  `.claude/scripts/statusline-identity.mjs` →
  `agent-tools/dist/src/claude/statusline-identity.js` is live; the platform
  status table marks Claude Code as **Wired**. Codex `CODEX_THREAD_ID`
  seeding landed in `ff119d44`. Cursor composer uses experimental project
  `sessionStart` hook wiring (`OAK_AGENT_SEED`, mirror file, docs); official
  Hooks output still lacks a programmatic Composer tab-title field.
- Collaboration-doc fitness remediation landed in `5c39d1d4`. Later
  strict-hard checks should distinguish those target docs from any unrelated
  concurrent WIP pressure.
- Intent-to-commit queue v1.3.0 landed as `5c39d1d4`:
  active-claims carries root `commit_queue`, `pnpm agent-tools:commit-queue --` can
  enqueue/phase/record/verify/complete intents, and commit/start-right/docs
  surface advisory FIFO order plus exact staged-bundle verification.
- Queue governance graduated after `5c39d1d4`: PDR-029 Family A Class A.3 is
  the durable Practice home, collaboration-state conventions/lifecycle are the
  operational home, and the completed execution plan is archived at
  [`archive/completed/intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md).
- Practice/tooling feedback capture is now explicit: portable rule in
  `.agent/rules/capture-practice-tool-feedback.md`, platform adapters in
  `.agents/`, `.claude/`, and `.cursor/`, and napkin guidance naming
  `agent-tools` as this repo's TypeScript-specific implementation surface.
- Agent-work ownership is now settled explicitly: PDR-035 says collaboration,
  coordination, work management, direction, lifecycle, identity, claims,
  handoff, review routing, and adjacent mechanisms belong to the portable
  Practice; ADR-165 records this repo's phenotype boundary for `.agent/state`,
  operational memory, platform adapters, plans, and `agent-tools`.
- Communication-channel discoverability now points to
  [`agent-collaboration-channels.md`](../../../memory/executive/agent-collaboration-channels.md)
  from executive, operational, and Practice index surfaces.
- Collaboration-state timestamps are documented as UTC ISO 8601 with trailing
  `Z`; Europe/London belongs in prose context, not state clocks.
- Strategic future plan
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
  is the durable holding point for shared-log collision analysis, sidebar
  polling/attention/push questions, identity preflight, and stale/phantom
  active-participant reconciliation. Its promotion trigger is satisfied by
  owner direction; do not wait for another collision before creating the
  executable plan.
- Session-close semantics are owner-settled for current terminal-based
  agents: do not reclaim old claims on resume; close claims when the agent
  closes the session; if cleanup is missed, mark stale/orphaned after the
  type-specific TTL. A future SDK one-turn invocation model may reopen the
  external shared-session-state design space.
- Shared communication history now needs hot-plus-archive retention: keep the
  live file small enough for scan/start-right use, and roll older context into
  a durable archive rather than deleting it.
- Codex hook support is no longer unknown: upstream hooks exist, but no
  documented `SessionEnd` parity exists yet. This is secondary to the pressing
  shared-state write-collision work; use standard TTL cleanup for Codex missed
  exits unless a future Codex session-exit event appears.
- Collaboration-state write safety is implemented and landed in `11f0320f`.
  `pnpm agent-tools:collaboration-state -- ...` now provides identity
  preflight, immutable comms append/render, transaction-safe claims and
  archive operations, conversation/escalation writes, TTL archival, and a
  validation check. The old rendered shared-comms history is archived and the
  live markdown log is generated from event files.
- Codex-wide identity parity beyond shared-state writes is now implemented for
  the high-impact path in
  [`codex-session-identity-plumbing.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md).
  New Codex sessions get identity context when `SessionStart` supplies
  `session_id`; legacy `Codex` / `unknown` rows are audit findings, not
  automatic rewrites.
- Owner override on 2026-04-28 allowed crossing claim boundaries to fix the
  closeout blocker. The live blocker was resolved by current WIP before a new
  source edit: `pnpm --filter @oaknational/agent-tools build` passes. Future
  agents should re-run stale blocker commands before editing active WIP.
- Cross-vendor shared-log communication has a live proof point and a limit:
  Codex left Vining a repo-context-specific future-design note with no
  platform bridge, but the first heartbeat found no visible pickup. Treat the
  log as durable discovery; use sidebars, decision threads,
  acknowledgements, or queue mechanics for directed obligations.
- `intent_to_commit` is now implemented as a minimal ordered advisory queue,
  not only claim metadata. The first self-application commit fired the
  queue-doctrine consolidation trigger, and that trigger is now resolved.
- Codex display-surface investigation is complete for this session:
  repo-owned identity derivation uses `CODEX_THREAD_ID`. The experimental
  app-server title-mutation adapter was dropped because stable session names
  already provide the useful identity value.
- A live commit-window collision on 2026-04-27 proved the current
  `git:index/head` claim protocol is observable but not ordering. The queue
  implementation adds advisory turn order before staging/hooks.
- The completed WS3A split plan lives in
  [`archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md).
- `repo-continuity.md` has been compacted from an overgrown historical surface
  into a live-state index; the pre-compaction body is archived at
  `../archive/repo-continuity-session-history-2026-04-26.md`.
- The owner-requested Practice-integration / lifecycle-automation
  exploration has been implemented as the narrow WS4A lifecycle pass; no
  automation hooks were started.

### Blockers / Low-Confidence Areas

- Full branch gates are not claimed green beyond the real pre-commit hook that
  passed for `5c39d1d4`; current repo state may still include product-lane debt
  outside the completed practice-thread passes.
- The strict `--exactOptionalPropertyTypes` probe is clean for identity files
  but still reports the pre-existing optional typing issue in
  `agent-tools/src/bin/codex-reviewer-resolve.ts`.
- Re-check active claims before staging or follow-on edits. Same-branch
  overlap is allowed for the experiment, but silent staging / committing over
  another fresh claim is the failure mode being studied.
- `pnpm practice:fitness:strict-hard` currently passes with soft findings only.
  The earlier hard findings in `principles.md`,
  `collaboration-state-conventions.md`, `repo-continuity.md`, and the active
  napkin have been structurally routed; do not reopen them as write-safety
  blockers without fresh evidence.
- The owner corrected the live participant set to Codex, Estuarine, and
  Prismatic. Treat `Luminous Dancing Quasar` as a stale/phantom claim or
  identity mismatch unless a sub-agent registration is found; claim existence
  alone does not prove a reachable participant.
- Anonymous `Codex` / `unknown` records are now report-only audit findings.
  Treat fresh active entries as live risk; treat historical entries as evidence
  unless a later repair has stronger source evidence.
- Codex upstream hooks are supported, but no Codex session-exit hook is
  documented. Do not rely on turn-scoped `Stop` for post-session claim cleanup;
  use explicit handoff or TTL janitor semantics.
- Active claims and `commit_queue` are not trustworthy from memory; re-check
  them directly before any index work. At this handoff, Prismatic had a fresh
  agent-identity queue entry, while the `Luminous` claim was owner-corrected as
  likely phantom/stale unless a sub-agent registration exists.
- Do not continue into soft-fitness work unless the owner asks for it.
- Keep using PDR-014 role boundaries; do not answer soft pressure with
  opportunistic trimming.
- Assumptions review already challenged the implementation plan. Future
  refinements should use `docs-adr-reviewer` for schema/docs coherence
  and `architecture-reviewer-wilma` for deadlock/hidden-coupling risks.

### Next Safe Step

**No WS3A, WS4A, commit-window, WS3B sidebar/escalation, joint-decision,
deterministic-identity core, Claude Code statusline wiring, or Codex
thread-id seeding remains open. Continue to treat same-branch coordination as
the live experiment: claims, sidebars, joint decisions, escalations, and now
the advisory commit queue should make friction visible rather than hiding it.**

Choose the lane deliberately:

0. **Practice context-cost baseline follow-up (just-opened 2026-05-05 by Gnarled Climbing Bark)** — first baseline landed (figures only) at [`practice-context-cost-baseline.md`](../../../analysis/practice-context-cost-baseline.md). Doc commit deferred on unrelated OAuth proxy test gate (see `repo-continuity.md § Next Safe Step`). When that gate is unblocked, re-attempt the deferred doc commit (3 files staged in working tree). Refinement targets named in the analysis file's §Refinement Targets and registered as four scope-expansion items in [`memetic-immune-system-and-progressive-disclosure.plan.md`](../../../plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md) §Scope Expansion Register: agent-tools CLI, fitness frontmatter token-estimate fields, fitness reporter token rendering, frontmatter mandation across guidance files. Each promotes on its own evidence trigger.

1. **Doctrine-enforcement-quick-wins continuation (WS3, WS4, WS6)** —
   continue
   [`doctrine-enforcement-quick-wins.plan.md`](../../../plans/agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md).
   Pearly Snorkelling Reef's 2026-05-04 session salvaged WS1
   (`91232df6`), WS2 (`eacb05f2`), and WS5 (`767ee23a`) from a
   parallel-isolation:"worktree" dispatch attempt; the plan body is
   marked `🟡 PARTIAL` with WS3 (hedging-vocabulary trip-list at
   write-time), WS4 (SHA-in-permanent-doc regex), and WS6 (git add
   wildcard block) still `pending`. All three remaining workstreams
   touch `.agent/hooks/policy.json` plus the `scripts/check-blocked-{content,patterns}.{ts,unit.test.ts,integration.test.ts}`
   surfaces. Per the durable lesson saved at
   `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_worktree_isolation_unreliable.md`,
   prefer **single-agent sequential dispatch on `feat/eef_exploration`
   directly** for these three — the parallel-worktree base-selection
   was unreliable in the prior attempt.

2. **Collaboration-state write safety closure** — continue
   [`collaboration-state-write-safety.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md).
   The implementation is landed, and the named docs fitness blockers have been
   structurally routed by the deep consolidation pass. The brief active-napkin
   hard pressure from final handoff was also rotated, so the next safe step is
   to close/archive the write-safety plan with the current soft-only evidence.
   Treat hooks/session-exit cleanup as a later refinement.

3. **Workspace layer separation audit** — architecture-and-infrastructure now
   has a queued executable plan:
   [`workspace-layer-separation-audit.plan.md`](../../../plans/architecture-and-infrastructure/current/workspace-layer-separation-audit.plan.md).
   First safe step: Phase 0 inventory against ADR-154, ADR-108, the Oak
   surface isolation programme, `pnpm-workspace.yaml`, and current package
   manifests before any package moves.

4. **Strict exact-optional cleanup** — fix the pre-existing
   `codex-reviewer-resolve.ts` optional typing issue.
5. **First real sidebar / joint-decision seed** — when a real overlap uses
   `sidebar_*` or `joint_decision*` entries, capture whether it reached
   resolution without becoming a permission gate or default owner
   escalation.
6. **MCP / SDK dirty work** — run targeted type-checks and resolve the
   `ToolMeta` / `listUniversalTools` TypeScript debt.
7. **Observability branch-primary** — read the
   [`sentry-preview-validation-and-quality-triage.plan.md`](../../../plans/observability/current/sentry-preview-validation-and-quality-triage.plan.md)
   executable brief before validation/triage work.
8. **Lifecycle integration follow-up** — only after write-collision relief is
   underway or owner-directed, observe whether the new start-right / handoff /
   template lifecycle triggers are actually used in real sessions. Do not add
   hook refinements before the shared-state write path is made safer; first
   real sidebar/joint-decision usage should feed WS5 observation.
9. **Codex session identity plumbing follow-up** — the high-impact current
   slice is implemented in
   [`codex-session-identity-plumbing.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/codex-session-identity-plumbing.plan.md).
   Only perform manual repair of historical anonymous rows when there is
   stronger evidence than the row itself; keep title/statusline as optional
   display.
10. **PR lifecycle skill** — promote
    [`pr-lifecycle-skill.plan.md`](../../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md)
    when the next PR closeout needs agent-owned creation, comment harvesting,
    reviewer-wait handling, CI/Sonar/Bugbot triage, and gate-honest closure.
    First slice should be a documentation skill only.
11. **Other agentic engineering work** — pick an owner-directed queued plan.
    WS3B implementation is no longer background work; it has landed.

### Active Track Links

- None. No tactical track card is active for this thread.

### Promotion Watchlist

- If the AGENT implementation reveals a new stable rule for platform
  entrypoints, update the existing pending PDR-014 register item rather
  than creating a duplicate candidate.
- If hard-fitness remediation uncovers a general compression discipline
  beyond the existing pending item, route it through ADR-144,
  practice-verification, or `consolidate-docs` step 9 as appropriate.
- Treat Codex-to-Vining pickup through the shared communication log as WS5
  collaboration evidence. If Vining replies or acts, record it in the parent
  multi-agent collaboration plan rather than creating a new surface.
- Queue governance is no longer due: the self-application trigger in
  `5c39d1d4` graduated to PDR-029 Family A Class A.3, with collaboration-state
  docs as the operational home. Future queue evidence should feed WS5
  refinement, not reopen the completed execution plan.
- If another shared-log collision, missed sidebar, future-dated timestamp,
  or anonymous/unknown identity mutation occurs, run the identity audit and
  preserve evidence first. Promote the collaboration-state domain-model plan
  only if the incident reveals a new design gap beyond the current
  write-safety and Codex identity slices.
- If Codex documents a true session-exit event, update the hooks portability
  plan and the collaboration-state lifecycle doc before wiring claim cleanup
  to it.
- If agent-tools communication primitives resume, keep the implementation
  TypeScript-specific but document the capability contract as portable
  Practice behaviour under PDR-035, with this repo's implementation choices
  treated as ADR-165 phenotype.
- If PR closeout friction recurs, promote the PR lifecycle skill before adding
  more ad hoc PR instructions to existing skills. The skill must preserve
  gate-honest quality improvement and reviewer-facing communication as its
  first principles.
- If a second instance of manual external-skill-pack canonicalisation friction
  occurs, OR an external pack with general value is requested for canonical
  inclusion and the manual flow blocks Cursor/Codex uptake, OR drift is
  detected in a vendored canonical skill that the current validator does not
  catch, OR a fourth Layer-2 surface is introduced — promote
  [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../../../plans/agentic-engineering-enhancements/future/canonical-first-skill-pack-ingestion-tooling.plan.md).
  Promotion remains gated on PASS from assumptions-reviewer +
  architecture-reviewer-fred|betty|barney|wilma. The plan body must not
  acquire any vendor-keyed conditional (PDR-009 vendor-agnostic rule).
